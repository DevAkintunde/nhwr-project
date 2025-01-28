"use server";
import { moodle } from "../../../../moodle.config";
import { logger } from "../utils/serverLogger";

/*** import ENV variable here */
const ENVserverShortName = process.env.MOO_SHORT_NAME;
const ENVserverToken = process.env.MOO_SERVER_ACCESS;
const ENVserverAddress =
	process.env.MOO_SERVER && process.env.MOO_SERVER.endsWith("/")
		? process.env.MOO_SERVER.substring(0, process.env.MOO_SERVER.length - 1)
		: process.env.MOO_SERVER;
const ENVserviceEndpoint = process.env.MOO_SERVICE_ENDPOINT
	? !process.env.MOO_SERVICE_ENDPOINT.startsWith("/")
		? "/" + process.env.MOO_SERVICE_ENDPOINT
		: process.env.MOO_SERVICE_ENDPOINT
	: "/webservice/rest/server.php";
const ENVloginEndpoint = process.env.MOO_LOGIN_ENDPOINT
	? !process.env.MOO_LOGIN_ENDPOINT.startsWith("/")
		? "/" + process.env.MOO_LOGIN_ENDPOINT
		: process.env.MOO_LOGIN_ENDPOINT
	: "/login/token.php";
const ENVfileEndpoint = process.env.MOO_FILE_ENDPOINT
	? !process.env.MOO_FILE_ENDPOINT.startsWith("/")
		? "/" + process.env.MOO_FILE_ENDPOINT
		: process.env.MOO_FILE_ENDPOINT
	: "/webservice/pluginfile.php";

//method to auto extract endpoint combinations. Recondiser this for possible implementation
/* const endpointKeys = () => {
	const keys = [];
	const extractor = (objectProp: object) =>
		Object.keys(objectProp).forEach((key) => {
			let prop = key;
			const getKey = (value?: string | object) => {
				if (typeof value === "object") {
					extractor(value);
				}
			};
			keys.push(prop);
			getKey(objectProp, key);
		});
	extractor(moodle);
}; */

/**
 * @description endpointRewriter allows to user simplified endpoint structure Serverhandler middleware, which is then converted to a format usable by moodle. Moodle endpoint should be SET in moodle.config at the root directory. Though exported, it is currently not planned to be used outside ServerHandler.
 * @param endpoint shortened version
 * @returns service endpoint
 */
const endpointRewriter = (endpoint: string) => {
	const key = endpoint.includes(".") ? endpoint.split(".") : endpoint;
	let moodleService = "";
	const depthGetter = (value: string | object) => {
		if (typeof value === "string") moodleService = value;
		else if (value && Object.keys(value).length === 1) {
			//when a single object key exist
			moodleService = Object.values(value)[0];
		} else {
			//objects with more than a single object key must be a nested array concatenated as string, else return error
			new Error("Improperly configured endpoint");
		}
	};
	if (typeof key === "string") {
		const value = moodle[key as keyof typeof moodle];
		depthGetter(value);
	} else {
		let depth: string | object = "";
		key.forEach((k, i) => {
			if (i === 0) depth = moodle[k as keyof typeof moodle];
			else if (typeof depth === "object") {
				depth = depth[key[i] as keyof typeof depth];
			}
		});
		depthGetter(depth);
	}
	//console.log("moodleService", moodleService);
	return moodleService;
};
const extractDataFromResponse = (resjson: any) =>
	resjson
		? resjson["exception"]
			? { statusText: resjson["message"], status: resjson["code"], statusCode: resjson["errorcode"], raw: JSON.stringify(resjson) }
			: resjson[0]
			? resjson[0]["modules"]
				? resjson[0]["modules"][0]
					? resjson[0]["modules"][0]["contents"]
						? { ...resjson[0]["modules"][0]["contents"], raw: resjson }
						: resjson[0]["modules"][0]
						? { ...resjson[0]["modules"][0], raw: resjson }
						: resjson[0]["modules"]
						? { ...resjson[0]["modules"], raw: resjson }
						: resjson[0]
						? { ...resjson[0], raw: resjson }
						: { ...resjson, raw: resjson }
					: { ...resjson, raw: resjson }
				: { ...resjson, raw: resjson }
			: { ...resjson, raw: resjson }
		: null;

export interface serverFetcher {
	endpoint?: string; // typeof moodle: course.title.writer.calendar.date
	disableEndpointRewrite?: boolean;
	disableContentMode?: boolean; //moodle exports content as layers of arrays inside 'module' key and then in 'contents' key. We are automating this. set this to true to disable
	serviceEndpoint?: string | "login" | "file"; // defaults to "/webservice/rest/server.php"
	requireShortName?: boolean; //this is a requirement for token generation endpoints
	body?: object | FormData;
	method?: string; // also really not needed
	headers?: {
		//headers are currently not needed with how moodle currently works. It is here for a possible future compatibility if ever needed
		accept?: string;
		Authorization?: string;
		"content-type"?: "multipart/form-data" | "application/vnd.api+json";
	};
	token?: string;
	id?: string; //only useful in array of Requests
	waitFor?: string; //allows to set dependent values on another RESPONSE; E.g: <props.prop.0.uuid/> | <id.uuid/> can be used on REQUEST 'body', where 'id' or 'props' is the id in 'waitFor'  //only useful in array of Requests. Not tested nor fully implemented yet
}
export type ServerHandler = (data?: string | serverFetcher | serverFetcher[] | undefined) => Promise<object>;

/** communication to serve managed entirely from here
  • @param MoodleInterface
  * @description The main interface to communicate with the backend server
  *
  * http://4.180.140.62/moodle/webservice/rest/server.php?wsfunction=core_course_get_contents&moodlewsrestformat=json&wstoken=9aceecb4e2dc1ec5c18911c7fa2ad939&courseid=1&options[0][name]=modname&options[0][value]=folder

	* http://4.180.140.62/moodle/login/token.php?username=USERNAME&password=PASSWORD&service=SERVICESHORTNAME
 username=USERNAME&password=PASSWORD&service=SERVICESHORTNAME
*/

/* Error: output by MOODLE!
resjson {
  exception: 'core\\exception\\invalid_parameter_exception',
  errorcode: 'invalidparameter',
  message: 'Invalid parameter value detected'
}
   */

/**
 * @description Serves as a middleware between client and moodle backend request and can be easily modified to adapt to a different decoupled backend as all backend request goes through here. ONly case 1 is fully implemented and tested at the moment
 * @param {string | serverFetcher | serverFetcher[]} data
 * @returns {object}
 */
export const serverHandler = async (data?: string | serverFetcher | serverFetcher[]): Promise<object> => {
	// only GET is supported on server
	if (!ENVserverAddress) {
		return {
			status: "406",
			statusText: "There is a problem getting server address.",
		};
	}

	//console.log('data',data);
	let headers: { accept: string; "content-type"?: string } = {
		accept: "application/vnd.api+json",
		"content-type": "application/vnd.api+json",
	};

	try {
		//case 1; check if input data is a single object
		if (data && typeof data === "object" && !Array.isArray(data) && data !== null) {
			// ensure short isn't require for route
			if (data.requireShortName && !ENVserverShortName)
				return {
					status: "406",
					statusText: "Service endpoint requires short name but this is unset in env file.",
				};
			//convert imported headers toLowerCase to compare and avoid duplicates with defaults.
			let importedHeaders: { "content-type"?: string } = {};
			if (data.headers && Object.keys(data.headers).length > 0) {
				Object.keys(data.headers).forEach((key: string) => {
					const keyValue: string | undefined = data.headers?.[key as keyof typeof data.headers];
					if (keyValue) {
						importedHeaders = {
							...importedHeaders,
							[key.toLowerCase()]: keyValue,
						};
					}
				});
			}
			headers = {
				...headers,
				...importedHeaders,
			};

			let body = data.requireShortName ? "&service=" + ENVserverShortName : "";
			// when body is a form data, manually convert to query for server compatibility
			if (data.body)
				if (data.body instanceof FormData) {
					for (const [key, val] of data.body) {
						body = body + "&" + key + "=" + val;
					}
				} else if (typeof data.body === "object")
					Object.keys(data.body).forEach((key) => {
						const b = data.body as object;
						body = body + "&" + key + "=" + b[key as keyof typeof b];
					});
				else body = data.body;

			//4.180.140.62/moodle/webservice/rest/server.php?wsfunction=core_course_get_contents&moodlewsrestformat=json&wstoken=9aceecb4e2dc1ec5c18911c7fa2ad939&courseid=1&options[0][name]=modname&options[0][value]=folder

			const serviceEndpoint =
				typeof data === "object" && data.serviceEndpoint
					? data.serviceEndpoint
						? data.serviceEndpoint === "login"
							? ENVloginEndpoint
							: data.serviceEndpoint === "file"
							? ENVfileEndpoint
							: data.serviceEndpoint
						: data.serviceEndpoint
					: ENVserviceEndpoint;
			let endpoint = data.endpoint ? (data.disableEndpointRewrite ? data.endpoint : endpointRewriter(data.endpoint)) : undefined;
			if (serviceEndpoint && !serviceEndpoint.startsWith("/")) endpoint = "/" + endpoint;

			if (!endpoint && !data.requireShortName) {
				// endpoint can safely be ignored when requireShortName is set
				return {
					status: 403,
					statusText: "No endpoint specified in client.",
				};
			} else {
				const fetcherEndpoint =
					ENVserverAddress +
					serviceEndpoint +
					"?moodlewsrestformat=json" +
					(endpoint ? "&wsfunction=" + endpoint : "") +
					"&wstoken=" +
					(data.token ? data.token : ENVserverToken) +
					body;
				logger.info("fetcherEndpoint: ", fetcherEndpoint);
				return fetch(fetcherEndpoint, {
					method: data.method ? data.method.toUpperCase() : "GET",
					headers: headers,
				})
					.then(async (res) => {
						//console.log("res", res);
						if (res.status === 200) {
							if (res.headers.get("content-type")?.includes("application/json")) return res.json();
							else if (res.headers.get("content-type")?.includes("text/plain"))
								return {
									status: res.status,
									statusText: await res.text().then((text: string) => text),
								};
							return null;
						} else {
							return {
								status: res.status,
								statusText: res.statusText ? res.statusText : res["message" as keyof typeof res] ? res["message" as keyof typeof res] : null,
							};
						}
					})
					.then((resjson) => {
						logger.info("Raw Moodle RES: ", JSON.stringify(resjson, null, 2));
						let obj = data.disableContentMode && resjson;
						if (!obj) {
							const dataExtract = extractDataFromResponse(resjson);
							if (dataExtract["status"]) obj = dataExtract["raw"];
							else obj = { status: 200, data: dataExtract };
						}
						logger.info("ServerHandler response: ", obj);
						return obj;
					})
					.catch((error) => {
						logger.error("Server error: ", error);
						return {
							status: "503",
							statusText: error["cause"]["code"] === "EHOSTUNREACH" ? "Unable to connect to server" : "Server error.",
						};
					});
			}
		}
		//case 2; check if imported data is an array of multiple objects
		else if (data && Array.isArray(data) && typeof data !== "string") {
			//case 2... allow to wait for dependent async to be implemented later;
			type requestedData = { [key: string]: string | { [key: string]: { [key: string]: string } } };

			let promisesDependent: Promise<requestedData>[] = [];
			const promisesIndependent: Promise<requestedData>[] = [];
			let promisesIdDependent: (string | requestedData)[] = [];
			let promisesIdIndependent: (string | requestedData)[] = [];

			const dependentRequests: serverFetcher[] = [];
			const inDependentRequests: serverFetcher[] = [];
			data.forEach((request) => {
				if (request.waitFor) dependentRequests.push(request);
				else inDependentRequests.push(request);
			});

			const Requests = async (requestGroup: serverFetcher[]) => {
				requestGroup.length &&
					requestGroup.forEach((thisCall: serverFetcher) => {
						// ensure short isn't require for route
						if (thisCall.requireShortName && !ENVserverShortName)
							return {
								status: "500",
								statusText: "Service endpoint requires short name but this is unset in env file.",
							};

						let importedHeaders: { "content-type"?: string } = {};
						if (thisCall.headers && Object.keys(thisCall.headers).length > 0) {
							Object.keys(thisCall.headers).forEach((key: string) => {
								const keyValue: string | undefined = thisCall.headers![key as keyof typeof thisCall.headers];
								if (keyValue) {
									importedHeaders = {
										...importedHeaders,
										[key.toLowerCase()]: keyValue,
									};
								}
							});
						}

						let body = thisCall.requireShortName ? "&service=" + ENVserverShortName : "";
						// when body is a form data, manually convert to query for server compatibility
						if (thisCall.body && thisCall.body instanceof FormData) {
							for (const [key, val] of thisCall.body.entries()) {
								body = body + "&" + key + "=" + val;
							}
						} else if (typeof thisCall.body === "object")
							Object.keys(thisCall.body).forEach((key) => {
								const b = thisCall.body as object;
								body = body + "&" + key + "=" + b[key as keyof typeof b];
							});
						else if (thisCall.body) body = thisCall.body;

						const serviceEndpoint = typeof data === "object" && thisCall.serviceEndpoint ? thisCall.serviceEndpoint : ENVserviceEndpoint;
						let endpoint = thisCall.endpoint;
						if (serviceEndpoint && !serviceEndpoint.startsWith("/")) endpoint = "/" + endpoint;

						const promiseCall = () =>
							new Promise(function (resolve) {
								resolve(
									fetch(
										ENVserverAddress + serviceEndpoint + "?moodlewsrestformat=json&wsfunction=" + endpoint + "&wstoken=" + ENVserverToken + body,
										{
											method: thisCall.method ? thisCall.method.toUpperCase() : "GET",
											headers: headers,
										}
									)
								);
							});

						//return Response as function
						const returnResponse = async (res: Response) => {
							if (res && res.status) {
								if (res.status === 200) {
									if (res.headers.get("content-type")?.includes("application/json")) return res.json();
									else if (res.headers.get("content-type")?.includes("text/plain"))
										return {
											status: res.status,
											statusText: await res.text().then((text: string) => text),
										};
									return null;
								} else {
									return {
										status: res.status,
										statusText: res.statusText ? res.statusText : res["message" as keyof typeof res] ? res["message" as keyof typeof res] : null,
									};
								}
							} else {
								return {
									status: 500,
									statusText: `Error: Something went wrong on this endpoint ${endpoint}!`,
								};
							}
						};
						if (thisCall.waitFor) {
							promisesDependent.push(
								promiseCall().then((res) => {
									return thisCall.disableContentMode
										? returnResponse(res as Response)
										: { status: 200, data: extractDataFromResponse(returnResponse(res as Response)) };
								})
							);
							//set the id
							if (thisCall.id) {
								promisesIdDependent.push(thisCall.id);
							} else {
								promisesIdDependent.push((promisesIdDependent.length + promisesIdIndependent.length + 1) as unknown as string);
							}
						} else {
							promisesIndependent.push(
								promiseCall().then((res) => {
									return thisCall.disableContentMode
										? returnResponse(res as Response)
										: { status: 200, data: extractDataFromResponse(returnResponse(res as Response)) };
								})
							);
							//set the id
							if (thisCall.id) {
								promisesIdIndependent.push(thisCall.id);
							} else {
								promisesIdIndependent.push((promisesIdDependent.length + promisesIdIndependent.length + 1) as unknown as string);
							}
						}
					});
			};

			const getPromises = async () => {
				if (inDependentRequests.length) await Requests(inDependentRequests);
				const RequestedData: requestedData = {};

				const reservedIndependentPromisesId = promisesIdIndependent as string[];
				if (promisesIndependent.length) promisesIdIndependent = (await Promise.all(promisesIndependent)) as requestedData[];
				else promisesIdIndependent = [];

				if (promisesIdIndependent.length)
					for (let i = 0; i < promisesIdIndependent.length; i++) {
						RequestedData[reservedIndependentPromisesId[i]] = promisesIdIndependent[i] as string | { [key: string]: { [key: string]: string } };
					}

				if (dependentRequests.length) {
					let isFirstItiration = true;
					let unprocessedRequests: serverFetcher[] = [];

					const callDependentRequests = async () => {
						const pendingRequests = isFirstItiration ? dependentRequests : unprocessedRequests;
						if (isFirstItiration) isFirstItiration = false;
						//reset unprocessedRequests
						unprocessedRequests = [];

						const nextToBeProcessed: serverFetcher[] = [];
						// Timeout function to avoid an endless loop when 'waitFor' cannot be processed after multiple calls (3) to 'callDependentRequests'
						let trials = 3;

						pendingRequests.forEach((request) => {
							if (request.waitFor && RequestedData[request.waitFor]) {
								//stringifying allows to replace <props.prop.0.uuid/> from request body on dependent requests and import the real value from an earlier processed request.
								//conditional do the above when the dependent request is not GET; where it is not necessary.
								let stringifyRequestForWaitForImport = JSON.stringify(request);
								//get dependent waitFor values for replacement
								//using a container tag: < />.
								// <props.prop.0.uuid/>
								const splitedString = stringifyRequestForWaitForImport.split("<" + request.waitFor);
								if (splitedString.length > 1) {
									const replaceableString: string[] = []; //houses data keys
									splitedString.forEach((string) => {
										if (string.includes("/>")) {
											const dataKey = string.split("/>")[0];
											if (!replaceableString.includes(dataKey)) replaceableString.push(dataKey);
										}
									});
									if (replaceableString.length) {
										const waitForData = (
											RequestedData[request.waitFor] as {
												[key: string]: { [key: string]: string };
											}
										)["data"];

										replaceableString.forEach((string) => {
											//note that string will often start with a '.' because first string KEY has been stripped. Re-add this when doing replacement operations.
											const keyHierarchical = string.split("."); // .prop.0.uuid
											let keyValue: { [x: string]: string } | string | undefined = undefined;
											keyHierarchical.forEach((key) => {
												if (key) keyValue = !keyValue ? waitForData[key] : typeof keyValue === "object" ? keyValue[key] : keyValue;
											});

											if (keyValue) {
												const replacementString = "<" + request.waitFor + string + "/>";
												let replacementStringWhole;
												if (stringifyRequestForWaitForImport.includes("'" + replacementString + "'"))
													replacementStringWhole = "'" + replacementString + "'";
												else if (stringifyRequestForWaitForImport.includes('"' + replacementString + '"'))
													replacementStringWhole = '"' + replacementString + '"';

												if (replacementStringWhole) {
													const regex = new RegExp(replacementStringWhole, "gi");
													stringifyRequestForWaitForImport = stringifyRequestForWaitForImport.replace(regex, JSON.stringify(keyValue));
												}
											}
										});
									}
								}

								const reparsedImport = JSON.parse(stringifyRequestForWaitForImport);

								//console.log("reparsedImport", reparsedImport);
								nextToBeProcessed.push(reparsedImport);
								trials = 3; //Reset trials.
							} else if (trials) {
								trials--; //reduce trials and halt function once it zero'd out
								unprocessedRequests.push(request);
							}
						});
						promisesDependent = [];
						promisesIdDependent = [];

						await Requests(nextToBeProcessed);
						if (promisesDependent.length) {
							const reservedDependentPromisesId = promisesIdDependent;
							promisesIdDependent = await Promise.all(promisesDependent);

							if (promisesIdDependent.length)
								for (let i = 0; i < promisesIdDependent.length; i++) {
									RequestedData[reservedDependentPromisesId[i] as string] = promisesIdDependent[i] as
										| string
										| { [key: string]: { [key: string]: string } };
								}
						}
						//console.log("unprocessedRequests", unprocessedRequests);
						//console.log("RequestedData", RequestedData);
						if (unprocessedRequests.length) await callDependentRequests();
					};
					await callDependentRequests();
				}

				return RequestedData;
			};
			return await getPromises();
		}
		//case 3; check if imported data is just an endpoint uri string
		else if (typeof data === "string") {
			const serviceEndpoint = ENVserviceEndpoint;
			let endpoint = data;
			if (serviceEndpoint && !serviceEndpoint.startsWith("/")) endpoint = "/" + endpoint;

			return fetch(ENVserverAddress + serviceEndpoint + "?moodlewsrestformat=json&wsfunction=" + endpoint + "&wstoken=" + ENVserverToken, {
				method: "GET",
				headers: headers,
			})
				.then(async (res) => {
					if (res.status === 200) {
						if (res.headers.get("content-type")?.includes("application/json")) return res.json();
						else if (res.headers.get("content-type")?.includes("text/plain"))
							return {
								status: res.status,
								statusText: await res.text().then((text: string) => text),
							};
						return null;
					} else {
						return {
							status: res.status,
							statusText: res.statusText ? res.statusText : res["message" as keyof typeof res] ? res["message" as keyof typeof res] : null,
						};
					}
				})
				.then((resjson) => {
					return { status: 200, data: extractDataFromResponse(resjson) };
				})
				.catch(() => {
					return {
						status: "503",
						statusText: "Endpoint not found.",
					};
				});
		}
		//case 4; export origin / endpoint if empty data. Useful when there's need to just fetch data from default server url. Only get method available
		else {
			return fetch(ENVserverAddress!, {
				method: "GET",
				headers: headers,
			})
				.then(async (res) => {
					if (res.headers.get("content-type")?.includes("application/json")) return res.json();
					else if (res.headers.get("content-type")?.includes("text/plain"))
						return {
							status: res.status,
							statusText: await res.text().then((text: string) => text),
						};
					return null;
				})
				.then((resjson) => {
					return { status: 200, data: extractDataFromResponse(resjson) };
				});
		}
	} catch (error: unknown) {
		logger.error("Server handler Error: ", error);
		return {
			status: "503",
			statusText: "Server error.",
		};
	}
};

export { endpointRewriter };
