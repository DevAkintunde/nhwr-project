"use client";
import { ServerHandler } from "@/app/lib/handlers/serverHandler";
import Loading from "@/app/loading";
import { PrimaryButton } from "@/app/ui/buttons/PrimaryButton";
import { Icons } from "@/app/ui/utils/Icons";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { moodleResponsesRewriter } from "../../../../../moodle.config";

//sample endpoint: http://4.180.140.62/moodle/login/confirm.php?data=DTMPXZqcbcCuAEN/akin%40gmail%2Ecom
const Verifier = ({ serverHandler }: { serverHandler: ServerHandler }) => {
	const searchParams = useSearchParams();
	const userData = useRef(searchParams.get("data"));

	const [response, setResponse] = useState<{ status: number; element: string | React.ReactNode }>();
	useEffect(() => {
		let isMounted = true;
		let dataAsArray: string[] | undefined;
		if (userData.current) dataAsArray = userData.current?.split("/");
		//console.log("dataAsArray", dataAsArray);
		if (isMounted && dataAsArray?.length) {
			serverHandler({
				endpoint: "verifyuser",
				body: { username: dataAsArray[1], secret: dataAsArray[0] },
				requireShortName: false,
				//serviceEndpoint: "/login/confirm.php",
			}).then((res) => {
				setTimeout(() => {
					if (res && res["data" as keyof typeof res]) {
						const data = res["data" as keyof typeof res];
						if (data["success"] === true) {
							setResponse(res as { status: 200; element: "Account verified. Click continue to create your profile" });
						} else if (data["warnings"]) {
							setResponse({
								status: data["warnings"][0]["warningcode"] === "alreadyconfirmed" ? 409 : 500,
								element: (data["warnings"] as { item: string; itemid: number; warningcode: string; message: string }[]).map((dat, j) => {
									return (
										<div
											key={j + dat.itemid}
											className={j + 1 !== (data["warnings"] as []).length ? "my-2" : ""}
										>
											{dat.warningcode === "alreadyconfirmed" ? (
												moodleResponsesRewriter["userAlreadyVerified"]
											) : dat.message ? (
												<div
													className="text-color-link text-center"
													dangerouslySetInnerHTML={{ __html: moodleResponsesRewriter["userAlreadyVerified"] }}
												/>
											) : (
												""
											)}
										</div>
									);
								}),
							});
						} else setResponse(res as { status: 503; element: "Oops! Currently unable to verify account. Please try again later" });
					}
					console.log("verified get data client: ", res);
				}, 5000);
				// process token tosave in cookie for session management
				/* if (saveToken)
				if (res && res["status" as keyof typeof res] === 200 && res["data" as keyof typeof res] && res["data" as keyof typeof res]["token"]) {
					saveToken(res["data" as keyof typeof res]["token"]);
				} */
			});
		}

		return () => {
			isMounted = false;
		};
	}, [serverHandler]);

	return (
		<div className="rounded-2xl shadow-2xl p-4 tab:p-8 max-w-[640px] min-h-[360px] mx-auto my-4 tab:my-8 bg-[#FFFFFF] flex items-center place-content-center">
			<div>
				<h1 className="text-center text-xl font-semibold text-black">Email Verification</h1>
				{!response ? (
					<Loading className="m-8" />
				) : (
					<div>
						<div className="text-center py-8">
							<div>
								<div className="mx-auto inline-block rounded-full border-2 border-color-pri p-4 tab:p-6 text-color-pri text-2xl tab:text-2xl">
									{response.status === 200 ? <Icons.Check /> : response.status === 409 ? <Icons.Alert /> : <Icons.Xmark />}
								</div>
								<div className="text-color-link p-3">{response.element}</div>
							</div>
						</div>

						{response.status === 200 ? (
							<div className="px-8 tab:px-28 py-4 tab:py-8 mx-auto font-bold text-center">
								<PrimaryButton
									className="py-3 tab:py-3 px-4 tab:px-8 block bg-color-pri text-white rounded-full mx-auto"
									text={"Sign in to create profile"}
									href="/signin?redirect=/profile"
								/>
							</div>
						) : response.status === 409 ? (
							<div className="px-8 tab:px-28 py-4 tab:py-8 mx-auto font-bold text-center">
								<PrimaryButton
									className="py-3 tab:py-3 px-4 tab:px-8 block bg-color-pri text-white rounded-full mx-auto"
									text={"Sign in"}
									href="/signin"
								/>
							</div>
						) : null}
					</div>
				)}
			</div>
		</div>
	);
};

export default Verifier;
