"use client";
import { PrimaryButton } from "@/app/ui/buttons/PrimaryButton";
import React, { FormEvent, useCallback, useContext, useEffect, useRef, useState } from "react";
import { SignInSignUpResponseMarkup } from "../overlays/SignInSignUpResponseMarkup";
import { Modal } from "../providers/Modal";
import { redirect } from "next/navigation";
import { serverFetcher } from "@/app/lib/handlers/serverHandler";
import { LearnCompeteWin } from "../utils/LearnCompeteWin";
import CountryListDailingCode, { Country } from "country-list-with-dial-code-and-flag";
import { Account } from "../providers/ProvidersExport";

type fieldType = {
	name: string;
	type?: string | "text";
	label?: string;
	placeholder?: string;
	defaultValue?: string;
	mirrorTo?: string; // allows to export an input value to another field
	mirror?: boolean; // a mirror field is ignored from html print but require on server
	required?: boolean;
	disableSendingToServer?: boolean; // a situation where the UI field is mirrored to another which is needed on server and where the view UI field itslef isn't.
	className?: string;
	options?: string[] | { key: string; value: string }[];
	disabled?: boolean;
};
export default function UserProfile({
	serverHandler,
	formData,
}: {
	serverHandler: (data?: string | serverFetcher | serverFetcher[] | undefined) => Promise<object>;
	formData?: fieldType[] | fieldType[][] | (fieldType[] | fieldType)[] | fieldType[][][] | (fieldType[][] | fieldType[] | fieldType)[];
}) {
	// save country list from external libray in state
	const countryList = useRef<Array<Country>>(CountryListDailingCode.getAll());

	const { setModal } = useContext(Modal);
	// import current user account detail
	const { account } = useContext(Account);
	//console.log("account: ", account);
	// values to send to server
	const [formValues, setFormValues] = useState<{ [name: string]: string }>({});

	// filter mirrored field out when formData exists
	const formDataFilter = useCallback(
		(formData: fieldType[] | fieldType[][] | (fieldType[] | fieldType)[] | fieldType[][][] | (fieldType[][] | fieldType[] | fieldType)[]) => {
			const initialFields: any = [];
			formData.forEach((field) => {
				if (Array.isArray(field)) {
					const grp1Con: fieldType[][] = [];
					field.forEach((grp1) => {
						if (Array.isArray(grp1)) {
							const grp2Con: fieldType[] = [];
							grp1.forEach((grp2) => {
								if (typeof grp2 === "object" && !grp2.mirror) {
									grp2Con.push(grp2);
								} else if (typeof field === "string") grp2Con.push(grp2);
							});
							grp1Con.push(grp2Con);
						} else if (typeof grp1 === "object" && !grp1.mirror) {
							grp1Con.push(grp1 as unknown as fieldType[]);
						}
					});
					initialFields.push(grp1Con);
				} else {
					if (typeof field === "object" && !field.mirror) {
						{
							initialFields.push(field);
						}
					} else if (typeof field === "string") initialFields.push(field);
				}
			});
			return initialFields;
		},
		[]
	);

	const [profileFields, setProfileFields] = useState<
		fieldType[] | fieldType[][] | (fieldType[] | fieldType)[] | fieldType[][][] | (fieldType[][] | fieldType[] | fieldType)[]
	>(formData ? formDataFilter(formData) : []);

	// initially set default values if or where that exists
	useEffect(() => {
		let isMounted = true;
		if (isMounted && profileFields.length) {
			const initialValues: { [name: string]: string } = {};
			profileFields.forEach((field) => {
				if (Array.isArray(field)) {
					field.forEach((grp1) => {
						if (Array.isArray(grp1)) {
							grp1.forEach((grp2) => {
								if (typeof grp2 === "object" && !grp2.mirror) if (grp2.defaultValue) initialValues[grp2.name] = grp2.defaultValue;
							});
						} else if (typeof grp1 === "object" && !grp1.mirror) if (grp1.defaultValue) initialValues[grp1.name] = grp1.defaultValue;
					});
				} else {
					if (typeof field === "object" && !field.mirror) if (field.defaultValue) initialValues[field.name] = field.defaultValue;
				}
			});
			// initially set default values if or where that exists
			if (Object.keys(initialValues).length) setFormValues(initialValues);
		}

		return () => {
			isMounted = false;
		};
	}, [profileFields]);
	console.log("formValues", formValues);

	const [allowSubmitForm, setAllowSubmitForm] = useState(false);

	const formSubmission = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		//console.log(e);
		if (allowSubmitForm)
			serverHandler({
				endpoint: "signup.post",
				body: formValues,
				requireShortName: true,
				serviceEndpoint: undefined,
			}).then((res) => {
				//console.log("signup get data client: ", res);
				setModal({
					element: (
						<SignInSignUpResponseMarkup
							response={res as any}
							action={res["data" as keyof typeof res]["success"] ? () => redirect("/auth") : undefined}
						/>
					),
				});
			});
	};

	/* useEffect(() => {
		setModal({ element: <SignInSignUpResponseMarkup response={"res"} /> });
	}, [setModal]); */

	//console.log("formValues", formValues);
	//console.log("profileFields", profileFields);
	return (
		<section className="relative pb-16 tab:p-12 tab:pb-0 bg-white tab:bg-transparent">
			{/* <div className="absolute bg-gradient-to-b from-[rgba(33, 33, 33, 0.84)] to-[rgba(66, 66, 66, 0.24)] left-0 right-0 top-0 bottom-0" /> */}
			{/* <div
				//style={{ backgroundColor: "rgba(91, 114, 238, 0.17)" }}
				className="hidden tab:block bg-gradient-to-t from-[#5B72EE]/20 absolute left-0 right-0 top-0 h-full bottom-0"
			/> */}
			<div className="grid grid-cols-1 tab:grid-cols-2 gap-4 tab:gap-12 lg:gap-24 relative z-10 mt-1 mx-auto items-start">
				<div className="relative tab:bg-transparent bg-[#5B72EE]/[0.09] rounded-b-[96px] tab:rounded-none p-4 tab:p-0">
					<LearnCompeteWin className="grid min-h-[335px] tab:min-h-[480px]" />
				</div>

				<div className="tab:shadow tab:rounded-t-3xl bg-color-bg px-16 tab:px-10 tab:max-w-[600px]">
					<div className={"tab:block text-color-pri text-4xl font-bold mt-4 tab:mt-12 mb-3 tab:mb-8"}>{"Create Profile"}</div>

					<form
						className="grid mt-6 gap-9 tab:gap-5"
						id={"account-profile-page"}
						onSubmit={formSubmission}
					>
						{profileFields.length
							? profileFields.map((field, i) => {
									return (
										<div
											key={field.toString() + i}
											className="grid grid-cols-1 tab:flex tab:grow gap-2 place-content-between"
										>
											{Array.isArray(field) ? (
												field.map((grp1, j) => {
													return (
														<div
															key={j}
															className="grid grid-cols-1 tab:gro tab:flex tab:w-full"
														>
															{Array.isArray(grp1) ? (
																<div className="grid grid-cols-1 tab:flex place-content-between">
																	{grp1.map((grp2, k) => {
																		return (
																			<label
																				key={k}
																				className={
																					"relative rounded-md border border-color-text/30 hover:border-color-text/70 focus:border-color-text/70 p-1 z-0 " +
																					(grp2.className ? grp2.className : "")
																				}
																			>
																				<span className="absolute font-bold tab:font-semibold left-2 -top-3 bg-color-bg px-1 text-nowrap">
																					{grp2.label}
																					{grp2.required ? <span className="text-red-600 text-xl absolute -bottom-1 -right-2">*</span> : null}
																				</span>
																				{grp2.type !== "select" && grp2.type !== "diallingCode" ? (
																					<input
																						data-mirrorto={grp2.mirrorTo}
																						data-disablesendingtoserver={grp2.disableSendingToServer ? grp2.disableSendingToServer : undefined}
																						name={grp2.name}
																						required={grp2.required}
																						disabled={grp2.disabled}
																						className={"p-1 border-none w-full -z-0 outline-none placeholder:text-xs"}
																						type={grp2.type ? grp2.type : "text"}
																						placeholder={grp2.placeholder}
																						defaultValue={grp2.defaultValue}
																						onChange={(e) => {
																							const target = e.target;
																							//console.log("e", target);

																							setFormValues((prev) => {
																								if (!prev[target.name] && target.name in prev) {
																									delete prev[target.name];
																									if (target["dataset"]["mirrorto"]) delete prev[target["dataset"]["mirrorto"]];
																								} else if (target.value) {
																									if (!target["dataset"]["disablesendingtoserver"]) prev[target.name] = target.value;
																									if (target["dataset"]["mirrorto"]) prev[target["dataset"]["mirrorto"]] = target.value;
																								}

																								return prev;
																							});
																						}}
																					/>
																				) : (
																					<select
																						data-mirrorto={grp2.mirrorTo}
																						data-disablesendingtoserver={grp2.disableSendingToServer ? grp2.disableSendingToServer : undefined}
																						name={grp2.name}
																						required={grp2.required}
																						disabled={grp2.disabled}
																						className={"p-1 pt-2 pr-5 border-none w-full bg-white -z-0 outline-none"}
																						//placeholder={grp2.placeholder}
																						defaultValue={grp2.defaultValue}
																						onChange={(e) => {
																							const target = e.target;
																							//console.log("e", target);
																							setFormValues((prev) => {
																								if (!prev[target.name] && target.name in prev) {
																									delete prev[target.name];
																									if (target["dataset"]["mirrorto"]) delete prev[target["dataset"]["mirrorto"]];
																								} else if (target.value) {
																									if (!target["dataset"]["disablesendingtoserver"]) prev[target.name] = target.value;
																									if (target["dataset"]["mirrorto"]) prev[target["dataset"]["mirrorto"]] = target.value;
																								}

																								return prev;
																							});
																						}}
																					>
																						{grp2.type === "diallingCode" ? (
																							countryList.current ? (
																								countryList.current.map((country, index) => {
																									return (
																										<option
																											key={index}
																											value={country.countryCode}
																										>
																											{country.flag + " " + country.code + " " + "(" + country.dialCode + ")"}
																										</option>
																									);
																								})
																							) : (
																								<option> </option>
																							)
																						) : (
																							grp2.options?.map((option: string | object, index) => {
																								return (
																									<option
																										key={index}
																										value={
																											typeof option === "string"
																												? option
																												: option["key" as keyof typeof option]
																												? option["key" as keyof typeof option]
																												: undefined
																										}
																									>
																										{typeof option === "string"
																											? option
																											: option["value" as keyof typeof option]
																											? option["value" as keyof typeof option]
																											: undefined}
																									</option>
																								);
																							})
																						)}
																					</select>
																				)}
																			</label>
																		);
																	})}
																</div>
															) : (
																<label
																	className={
																		"relative rounded-md border border-color-text/30 hover:border-color-text/70 focus:border-color-text/70 p-1 z-0 " +
																		(grp1.className ? grp1.className : "")
																	}
																>
																	<span className="absolute font-bold tab:font-semibold left-2 -top-3 bg-color-bg px-1 text-nowrap">
																		{grp1.label}
																		{grp1.required ? <span className="text-red-600 text-xl absolute -bottom-1 -right-2">*</span> : null}
																	</span>
																	{grp1.type !== "select" && grp1.type !== "diallingCode" ? (
																		<input
																			data-mirrorto={grp1.mirrorTo}
																			data-disablesendingtoserver={grp1.disableSendingToServer ? grp1.disableSendingToServer : undefined}
																			name={grp1.name}
																			required={grp1.required}
																			disabled={grp1.disabled}
																			className={"p-1 border-none w-full -z-0 outline-none placeholder:text-xs"}
																			type={grp1.type ? grp1.type : "text"}
																			placeholder={grp1.placeholder}
																			defaultValue={grp1.defaultValue}
																			onChange={(e) => {
																				const target = e.target;
																				//console.log("e", target);

																				setFormValues((prev) => {
																					if (!prev[target.name] && target.name in prev) {
																						delete prev[target.name];
																						if (target["dataset"]["mirrorto"]) delete prev[target["dataset"]["mirrorto"]];
																					} else if (target.value) {
																						if (!target["dataset"]["disablesendingtoserver"]) prev[target.name] = target.value;
																						if (target["dataset"]["mirrorto"]) prev[target["dataset"]["mirrorto"]] = target.value;
																					}

																					return prev;
																				});
																			}}
																		/>
																	) : (
																		<select
																			data-mirrorto={grp1.mirrorTo}
																			data-disablesendingtoserver={grp1.disableSendingToServer ? grp1.disableSendingToServer : undefined}
																			name={grp1.name}
																			required={grp1.required}
																			disabled={grp1.disabled}
																			className={"p-1 pt-2 pr-5 border-none w-full bg-white -z-0 outline-none"}
																			//placeholder={grp2.placeholder}
																			defaultValue={grp1.defaultValue}
																			onChange={(e) => {
																				const target = e.target;
																				//console.log("e", target);
																				setFormValues((prev) => {
																					if (!prev[target.name] && target.name in prev) {
																						delete prev[target.name];
																						if (target["dataset"]["mirrorto"]) delete prev[target["dataset"]["mirrorto"]];
																					} else if (target.value) {
																						if (!target["dataset"]["disablesendingtoserver"]) prev[target.name] = target.value;
																						if (target["dataset"]["mirrorto"]) prev[target["dataset"]["mirrorto"]] = target.value;
																					}

																					return prev;
																				});
																			}}
																		>
																			{grp1.type === "diallingCode" ? (
																				countryList.current ? (
																					countryList.current.map((country, index) => {
																						return (
																							<option
																								key={index}
																								value={country.countryCode}
																							>
																								{country.flag + " " + country.code + " " + "(" + country.dialCode + ")"}
																							</option>
																						);
																					})
																				) : (
																					<option></option>
																				)
																			) : (
																				grp1.options?.map((option: string | object, index) => {
																					return (
																						<option
																							key={index}
																							value={
																								typeof option === "string"
																									? option
																									: option["key" as keyof typeof option]
																									? option["key" as keyof typeof option]
																									: undefined
																							}
																						>
																							{typeof option === "string"
																								? option
																								: option["value" as keyof typeof option]
																								? option["value" as keyof typeof option]
																								: undefined}
																						</option>
																					);
																				})
																			)}
																		</select>
																	)}
																</label>
															)}
														</div>
													);
												})
											) : (
												<label
													className={
														"relative rounded-md border border-color-text/30 hover:border-color-text/70 focus:border-color-text/70 p-1 z-0 " +
														(field.className ? field.className : "")
													}
												>
													<span className="absolute font-bold tab:font-semibold left-2 -top-3 bg-color-bg px-1 text-nowrap">
														{field.label}
														{field.required ? <span className="text-red-600 text-xl absolute -bottom-1 -right-2">*</span> : null}
													</span>
													{field.type !== "select" && field.type !== "diallingCode" ? (
														<input
															data-mirrorto={field.mirrorTo}
															data-disablesendingtoserver={field.disableSendingToServer ? field.disableSendingToServer : undefined}
															name={field.name}
															required={field.required}
															disabled={field.disabled}
															className={"p-1 border-none w-full -z-0 outline-none placeholder:text-xs"}
															type={field.type ? field.type : "text"}
															placeholder={field.placeholder}
															defaultValue={field.defaultValue}
															onChange={(e) => {
																const target = e.target;
																//console.log("e", target);

																setFormValues((prev) => {
																	if (!prev[target.name] && target.name in prev) {
																		delete prev[target.name];
																		if (target["dataset"]["mirrorto"]) delete prev[target["dataset"]["mirrorto"]];
																	} else if (target.value) {
																		if (!target["dataset"]["disablesendingtoserver"]) prev[target.name] = target.value;
																		if (target["dataset"]["mirrorto"]) prev[target["dataset"]["mirrorto"]] = target.value;
																	}

																	return prev;
																});
															}}
														/>
													) : (
														<select
															data-mirrorto={field.mirrorTo}
															data-disablesendingtoserver={field.disableSendingToServer ? field.disableSendingToServer : undefined}
															name={field.name}
															required={field.required}
															disabled={field.disabled}
															className={"p-1 pt-2 pr-5 border-none w-full bg-white -z-0 outline-none"}
															//placeholder={grp2.placeholder}
															defaultValue={field.defaultValue}
															onChange={(e) => {
																const target = e.target;
																//console.log("e", target);
																setFormValues((prev) => {
																	if (!prev[target.name] && target.name in prev) {
																		delete prev[target.name];
																		if (target["dataset"]["mirrorto"]) delete prev[target["dataset"]["mirrorto"]];
																	} else if (target.value) {
																		if (!target["dataset"]["disablesendingtoserver"]) prev[target.name] = target.value;
																		if (target["dataset"]["mirrorto"]) prev[target["dataset"]["mirrorto"]] = target.value;
																	}

																	return prev;
																});
															}}
														>
															{field.type === "diallingCode" ? (
																countryList.current ? (
																	countryList.current.map((country, index) => {
																		return (
																			<option
																				key={index}
																				value={country.countryCode}
																			>
																				{country.flag + " " + country.code + " " + "(" + country.dialCode + ")"}
																			</option>
																		);
																	})
																) : (
																	<option></option>
																)
															) : (
																field.options?.map((option: string | object, index) => {
																	return (
																		<option
																			key={index}
																			value={
																				typeof option === "string"
																					? option
																					: option["key" as keyof typeof option]
																					? option["key" as keyof typeof option]
																					: undefined
																			}
																		>
																			{typeof option === "string"
																				? option
																				: option["value" as keyof typeof option]
																				? option["value" as keyof typeof option]
																				: undefined}
																		</option>
																	);
																})
															)}
														</select>
													)}
												</label>
											)}
										</div>
									);
							  })
							: null}

						<div className="flex gap-4 place-content-center items-center mt-16 tab:my-8">
							<PrimaryButton
								className="inline-block grow-0 rounded-full bg-color-pri text-color-bg font-semibold shadow px-16 py-3"
								text={"Save"}
								type={"submit"}
							/>
							{/* <PrimaryButton
								text={"Skip"}
								type={"button"}
								action={() => redirect("/")}
							/> */}
						</div>
					</form>
				</div>
			</div>
		</section>
	);
}
