import React, { useCallback, useContext, useEffect, useState } from "react";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { Icons } from "../utils/Icons";
import { Modal } from "../providers/Modal";
import { MoodleSignInSignUpResponse } from "@/app/lib/@types";
import DOMPurify from "dompurify";

type actionObj = { onClick: () => void; text?: string; link?: string };
export const SignInSignUpResponseMarkup = ({ response, action }: MoodleSignInSignUpResponse) => {
	const { setModal } = useContext(Modal);
	const resView = useCallback(
		({
			data,
			icon,
			action,
		}: {
			data: { title: string; message?: string } | { title: string; message: string }[];
			icon: React.ReactNode;
			action?: () => void | actionObj;
		}) => {
			return (
				<div className="rounded-xl shadow-2xl p-4 bg-[#FFFFFF] max-w-[640px] mx-auto">
					<div className="text-center pt-12">
						<div className="mx-auto inline-block rounded-full border-2 border-color-pri p-2 tab:p-5 text-color-pri text-xl tab:text-2xl">{icon}</div>
						{Array.isArray(data) ? (
							data.map((dat, j) => {
								return (
									<div
										key={j}
										className={j + 1 !== data.length ? "my-2" : ""}
									>
										<div className="text-black text-xl font-semibold">{dat.title}</div>
										{dat.message ? (
											<div
												className="text-color-link text-center"
												dangerouslySetInnerHTML={{ __html: dat.message }}
											/>
										) : null}
									</div>
								);
							})
						) : (
							<div>
								<div className="text-black text-xl font-semibold">{data.title}</div>
								{data.message ? (
									<div
										className="text-color-link text-center"
										dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.message) }}
									/>
								) : null}
							</div>
						)}
					</div>

					<div className="px-8 tab:px-28 py-8 tab:py-16 mx-auto font-bold">
						<PrimaryButton
							className="py-1 tab:py-3 px-4 tab:px-24 block bg-color-pri text-white rounded-full mx-auto"
							text={typeof action === "object" && action["text" as keyof typeof action] ? action["text" as keyof typeof action] : "Continue"}
							action={
								typeof action === "object" && action["onClick" as keyof typeof action]
									? action["onClick" as keyof typeof action]
									: action
									? action
									: () => setModal()
							}
						/>
					</div>
				</div>
			);
		},
		[setModal]
	);

	//console.log("response", response);
	return (
		<div
			//style={{ backgroundColor: "rgba(91, 114, 238, 0.09)" }}
			className="h-full w-full flex place-content-center items-center"
		>
			{typeof response === "string"
				? resView({
						data: { title: response },
						icon: <Icons.Check />,
				  })
				: resView({
						// below are all possible potential moodle response encountered during testing. Note that the 'data' parent is injected by serverHandler
						data: response["data" as keyof typeof response]
							? response["data" as keyof typeof response]["statusText"]
								? { title: response["data" as keyof typeof response]["statusText"] }
								: response["data" as keyof typeof response]["error"]
								? { title: response["data" as keyof typeof response]["error"] }
								: response["data" as keyof typeof response]["warnings"]
								? (response["data" as keyof typeof response]["warnings"] as { item: string; message: string }[]).map((res) => {
										return { title: res.item, message: res.message };
								  })
								: response["data" as keyof typeof response]["success"] || response["data" as keyof typeof response]["token"]
								? { title: "Success" }
								: { title: "Error" }
							: response["statusText" as keyof typeof response]
							? { title: response["statusText" as keyof typeof response] }
							: { title: "Error" },
						icon:
							response["data" as keyof typeof response]["success"] || response["data" as keyof typeof response]["token"] ? (
								<Icons.Check />
							) : (
								<Icons.Xmark />
							),
						action: action,
				  })}
		</div>
	);
};
