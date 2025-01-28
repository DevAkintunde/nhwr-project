"use client";
import { PrimaryButton } from "@/app/ui/buttons/PrimaryButton";
import { Icons } from "@/app/ui/utils/Icons";
import Image from "next/image";
import Link from "next/link";
import React, { FormEvent, useCallback, useContext, useEffect, useState } from "react";
import { appConfig } from "../../../../app.config";
import { SignInSignUpResponseMarkup } from "../overlays/SignInSignUpResponseMarkup";
import { Modal } from "../providers/Modal";
import { redirect, useSearchParams } from "next/navigation";
import { passwordValidator } from "@/app/lib/utils/passwordValidator";
import { serverFetcher } from "@/app/lib/handlers/serverHandler";
import { LearnCompeteWin } from "../utils/LearnCompeteWin";

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
};
export default function SignUpSignInForm({
	formType,
	serverHandler,
	formData,
	saveToken,
}: {
	formType: "signUp" | "signIn";
	serverHandler: (data?: string | serverFetcher | serverFetcher[] | undefined) => Promise<object>;
	formData?: string[] | fieldType[] | (string | fieldType)[];
	saveToken?: (token: string) => Promise<void>;
}) {
	const queryParams = useSearchParams();
	//console.log('queryParams', queryParams.get('redirect'))
	const { setModal } = useContext(Modal);
	const bgImages = appConfig.staticFiles;
	// filter mirrored field out when formData exists
	const formDataFilter = useCallback((formData: string[] | fieldType[] | (string | fieldType)[]) => {
		const initialValues: any = [];
		formData.forEach((field) => {
			if (typeof field === "object" && !field.mirror) initialValues.push(field);
			else if (typeof field === "string") initialValues.push(field);
		});
		return initialValues;
	}, []);

	const [profileFields, setProfileFields] = useState<string[] | fieldType[] | (string | fieldType)[]>(
		formData ? formDataFilter(formData) : formType === "signUp" ? ["name", "email", "password"] : ["email", "password"]
	);

	const [passwordFieldType, setPasswordFieldType] = useState("password");
	const passwordRevealToggle = (state: "view" | "hide") => {
		if (state === "view") {
			setPasswordFieldType("text");
			const iconOnDisplay = document.querySelector(`#${"account-" + formType + "-page"} .passwordView`);
			iconOnDisplay && iconOnDisplay.classList.add("hidden");
			const iconToDisplay = document.querySelector(`#${"account-" + formType + "-page"} .passwordHide`);
			iconToDisplay && iconToDisplay.classList.remove("hidden");
		} else {
			setPasswordFieldType("password");
			const iconOnDisplay = document.querySelector(`#${"account-" + formType + "-page"} .passwordHide`);
			iconOnDisplay && iconOnDisplay.classList.add("hidden");
			const iconToDisplay = document.querySelector(`#${"account-" + formType + "-page"} .passwordView`);
			iconToDisplay && iconToDisplay.classList.remove("hidden");
		}
	};
	const [allowSubmitForm, setAllowSubmitForm] = useState(formType === "signIn" ? true : false);
	const [passwordCaution, setPasswordCaution] = useState<React.ReactNode | null>();
	//password processor & validator
	const processPasword = (target: HTMLInputElement) => {
		setFormValues((prev) => {
			if (!prev[target.name] && target.name in prev) {
				delete prev[target.name];
			} else if (target.value) {
				prev[target.name] = target.value;
			}

			return prev;
		});

		const passValidation = passwordValidator(target.value);
		if (typeof passValidation === "boolean") {
			setAllowSubmitForm(true);
			setPasswordCaution(null);
		} else {
			/* setPasswordCaution(
				<div className={"flex gap-1 items-center text-red-600"}>
					<Icons.Alert />
					<span className="validator-response">{passValidation}</span>
				</div>
			); */
		}
		//console.log("passValidation", passValidation);
	};

	// values to send to server
	const [formValues, setFormValues] = useState<{ [name: string]: string }>({});
	// initially set default values if or where that exists
	useEffect(() => {
		let isMounted = true;
		if (isMounted && formData) {
			const initialValues: { [name: string]: string } = {};
			formData.forEach((field) => {
				if (typeof field === "object" && field.defaultValue) initialValues[field.name] = field.defaultValue;
			});
			if (Object.keys(initialValues).length) setFormValues(initialValues);
		}
		return () => {
			isMounted = false;
		};
	}, [formData]);
	const formSubmission = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		//console.log(e);
		if (allowSubmitForm)
			serverHandler({
				endpoint: formType === "signUp" ? "signup.post" : undefined,
				body: formValues,
				requireShortName: formType === "signUp" ? false : true,
				serviceEndpoint: formType === "signUp" ? undefined : "login",
			}).then((res) => {
				//console.log("signup get data client: ", res);
				// process token tosave in cookie for session management
				if (saveToken) {
					if (res && res["status" as keyof typeof res] === 200 && res["data" as keyof typeof res] && res["data" as keyof typeof res]["token"]) {
						saveToken(res["data" as keyof typeof res]["token"]);
					}
					const redirectDestination = queryParams.get("redirect");
					if (redirectDestination) redirect(redirectDestination);
				} else
					setModal({
						element: (
							<SignInSignUpResponseMarkup
								response={res as any}
								//action={res["data" as keyof typeof res]["success"] ? () => redirect("/") : undefined}
							/>
						),
					});
			});
	};

	/* useEffect(() => {
		setModal({ element: <SignInSignUpResponseMarkup response={"res"} /> });
	}, [setModal]); */

	/* useEffect(() => {
		console.log("formValues", formValues);
	}, [formValues]);
	console.log("formValues", formValues); */
	//console.log("profileFields", profileFields);
	return (
		<section className="relative tab:p-12 tab:pb-0 bg-white tab:bg-transparent">
			<div className="grid grid-cols-1 tab:grid-cols-2 gap-4 tab:gap-12 lg:gap-24 relative z-10 mt-1 mx-auto items-start">
				<div className="relative tab:bg-transparent bg-[#5B72EE]/[0.09] rounded-b-[96px] tab:rounded-none p-4 tab:p-0">
					<LearnCompeteWin className="grid min-h-[335px] tab:min-h-[480px]" />
				</div>

				<div className="tab:shadow tab:rounded-t-3xl bg-color-bg tab:pt-4 px-16 tab:px-10 tab:max-w-[530px]">
					<div className="text-color-pri mx-4 tab:ml-0 tab:m-6">{formType === "signUp" ? "Let's get you started!" : "Welcome!"}</div>
					<div
						className={(formType === "signUp" ? "hidden " : "") + "tab:block text-color-pri text-3xl tab:text-4xl font-bold mt-4 mb-3 mx-4 tab:mb-8"}
					>
						{formType === "signUp" ? "Create an Account" : "Log In to your Account"}
					</div>
					<div className="tab:hidden grid gap-4 grid-cols-2 items-center bg-[#5B72EE]/50 font-bold my-2 rounded-full p-3 text-center">
						<Link
							className={"text-color-bg py-2" + (formType === "signIn" ? " bg-color-pri rounded-full py-2 px-3" : "")}
							href="signin"
						>
							LOGIN
						</Link>
						<Link
							className={"text-color-bg py-2" + (formType === "signUp" ? " bg-color-pri rounded-full py-2 px-3" : "")}
							href="signup"
						>
							GET STARTED
						</Link>
					</div>

					<form
						className="grid mt-6 gap-6 tab:gap-5"
						id={"account-" + formType + "-page"}
						onSubmit={formSubmission}
					>
						{profileFields.length
							? profileFields.map((field, i) => {
									return (
										<React.Fragment key={field.toString() + i}>
											<label className="relative rounded-md border border-color-text/30 hover:border-color-text/70 focus:border-color-text/70 p-1 z-0">
												{typeof field === "string" ? (
													<>
														<span className="absolute text-xs left-2 -top-2 bg-color-bg px-1 capitalize">{field}</span>
														<input
															className={
																"p-1 pr-6 border-none w-full -z-0 outline-none" + (field.toLowerCase() === "password" ? " form-password" : "")
															}
															type={field.toLowerCase() === "password" ? passwordFieldType : "text"}
															placeholder={field}
															name={field}
															onChange={(e) => {
																const target = e.target;
																setFormValues((prev) => {
																	if (!prev[target.name] && target.name in prev) delete prev[target.name];
																	else if (target.value) prev[target.name] = target.value;
																	return prev;
																});
															}}
														/>
														{field.toLowerCase() === "password" ? (
															<>
																<Icons.PasswordView
																	className="absolute right-2 h-full top-0 passwordView cursor-pointer text-color-link/40"
																	//pointerEvents={"none"}
																	onClick={() => passwordRevealToggle("view")}
																/>
																<Icons.PasswordHide
																	className="absolute right-2 h-full top-0 passwordHide cursor-pointer text-color-link/40 hidden"
																	//pointerEvents={"none"}
																	onClick={() => passwordRevealToggle("hide")}
																/>
															</>
														) : (
															<Icons.Edit
																className="absolute right-2 h-full top-0 text-color-link/40"
																pointerEvents={"none"}
															/>
														)}
													</>
												) : (
													<>
														<span className="absolute text-xs left-2 -top-2 bg-color-bg px-1">
															{field.label}
															{field.required ? <span className="text-red-600 text-xl absolute -bottom-1 -right-2">*</span> : null}
														</span>
														<input
															data-mirrorto={field.mirrorTo}
															data-disablesendingtoserver={field.disableSendingToServer ? field.disableSendingToServer : undefined}
															name={field.name}
															required={field.required}
															className={"p-1 pr-6 border-none w-full -z-0 outline-none" + (field.type === "password" ? " form-password" : "")}
															type={field.type ? (field.type === "password" ? passwordFieldType : field.type) : "text"}
															placeholder={field.placeholder}
															defaultValue={field.defaultValue}
															onChange={(e) => {
																const target = e.target;
																//console.log("e", target);
																if (field.type !== "password")
																	setFormValues((prev) => {
																		if (!prev[target.name] && target.name in prev) {
																			delete prev[target.name];
																			if (target.name === "firstname" && prev["lastname"] && prev["lastname"] !== "-") prev["lastname"] = "-";
																			if (target["dataset"]["mirrorto"]) delete prev[target["dataset"]["mirrorto"]];
																		} else if (target.value) {
																			if (!target["dataset"]["disablesendingtoserver"]) {
																				if (target.name === "firstname" && target.value.split(" ").length > 1) {
																					const combinedValue = target.value.split(" ");
																					prev[target.name] = combinedValue.shift() as string;
																					prev["lastname"] = combinedValue.join(" ");
																				} else {
																					prev[target.name] = target.value;
																					if (target.name === "firstname" && prev["lastname"] && prev["lastname"] !== "-") prev["lastname"] = "-";
																				}
																			}
																			if (target["dataset"]["mirrorto"]) prev[target["dataset"]["mirrorto"]] = target.value;
																		}

																		return prev;
																	});
																else processPasword(target);
															}}
														/>
														{field.type === "password" ? (
															<>
																<Icons.PasswordView
																	className="absolute right-2 h-full top-0 passwordView cursor-pointer text-color-link/40"
																	//pointerEvents={"none"}
																	onClick={() => passwordRevealToggle("view")}
																/>
																<Icons.PasswordHide
																	className="absolute right-2 h-full top-0 passwordHide cursor-pointer text-color-link/40 hidden"
																	//pointerEvents={"none"}
																	onClick={() => passwordRevealToggle("hide")}
																/>
															</>
														) : (
															<Icons.Edit
																className="absolute right-2 h-full top-0 text-color-link/40"
																pointerEvents={"none"}
															/>
														)}
													</>
												)}
											</label>

											{typeof field !== "string" && formType === "signUp" && field.type === "password" ? (
												/* passwordCaution */
												<div className="px-4">
													<div className={"flex gap-1 items-center text-red-500"}>
														<Icons.Alert />
														<span className="validator-response">{"You must choose a password"}</span>
													</div>
													<div className={"flex gap-1 items-center text-red-500"}>
														<Icons.Alert />
														<span className="validator-response">{"7+ characters"}</span>
													</div>
													<div className={"flex gap-1 items-center text-red-500"}>
														<Icons.Alert />
														<span className="validator-response">{"At least one number"}</span>
													</div>
													<div className={"flex gap-1 items-center text-red-500"}>
														<Icons.Alert />
														<span className="validator-response">{"Not a common password"}</span>
													</div>
												</div>
											) : null}
										</React.Fragment>
									);
							  })
							: null}
						{formType === "signIn" ? (
							<div className="flex place-content-between font-semibold text-sm">
								<label className="cursor-pointer flex gap-1 items-center">
									<input type="checkbox" />
									{"Remember me"}
								</label>
								<Link href="forgot-password">{"Forgot Password?"}</Link>
							</div>
						) : null}
						<PrimaryButton
							text={formType === "signUp" ? "GET STARTED" : "LOGIN"}
							type={"submit"}
						/>
					</form>

					<div className="relative text-center my-2 z-0">
						<hr className="w-full h-0.5 bg-color-text/30 absolute top-1/2 -z-10" />
						<div className="p-3 bg-color-bg font-bold inline-flex w-fit z-10">Or</div>
					</div>

					<div className="grid gap-2">
						<button className="flex items-center w-full rounded-md p-2 border border-color-text/30">
							<Icons.Colored.Google className="ml-4" />{" "}
							<span className="text-sm place-self-center block grow">{formType === "signUp" ? "Sign up with Google" : "Log In with Google"}</span>
						</button>
						<button className="flex items-center w-full rounded-md p-2 border border-color-text/30">
							<Icons.Facebook className="ml-4 text-blue-700" />{" "}
							<span className="text-sm place-self-center block grow">{formType === "signUp" ? "Sign up with Facebook" : "Log In with Facebook"}</span>
						</button>
					</div>

					<div className="flex place-content-center text-sm gap-1 my-12">
						<span>{formType === "signUp" ? "Already have an account?" : "New User?"}</span>
						<Link
							href={formType === "signUp" ? "signin" : "signup"}
							className="underline uppercase font-bold text-color-pri"
						>
							{formType === "signUp" ? "LOGIN HERE" : "SIGN UP HERE"}
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
