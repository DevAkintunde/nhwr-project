"use client";
import { PrimaryButton } from "../buttons/PrimaryButton";
import Image from "next/image";
import { appConfig } from "../../../../app.config";
import { LearnCompeteWin } from "../utils/LearnCompeteWin";

export const HomePrev = () => {
	const headerData = appConfig.homepageDataDrive.header;

	return (
		<div className="mb-10 grid grid-cols-1 tab:grid-cols-2 items-center">
			<div className="relative">
				<div className="relative hidden tab:block -ml-[10%] lg:-ml-[15%] -mb-[60px]">
					<LearnCompeteWin className="grid tab:min-h-[480px] lg:min-[600px]" />
				</div>
				<div className={"relative tab:hidden h-full min-h-[240px] max-h-[480px] -mx-4"}>
					<Image
						src={'/assets/svg/mobileHplearnCompeteWin.svg'}
						alt="brand"
						fill
					/>
				</div>

				<div className="text-color-text my-3 text-center tab:text-left">{headerData.subtext}</div>
				<div className="hidden tab:block mt-8">
					<PrimaryButton
						href="get-started"
						text="Get started Today"
					/>
				</div>
			</div>
			<Image
				src={headerData.image}
				width={600}
				height={600}
				alt="homepage image"
			/>
			<div className="text-center my-3 tab:hidden block">
				<PrimaryButton
					href="get-started"
					text="Get started Today"
				/>
			</div>
		</div>
	);
};
