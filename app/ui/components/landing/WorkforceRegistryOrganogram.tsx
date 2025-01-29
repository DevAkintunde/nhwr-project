"use client";

import Image from "next/image";
import React from "react";
import ngGeo from "@/app/lib/jsons/ngGeography.json";
import { appConfig } from "@/app.config";

const hpImage = "/images/hp-header-bg-crop.jpg";
const iconSvg = "/svgs/state-icon.svg";
export const WorkforceRegistryOrganogram = () => {
	const regions: {
		name: string; // state => Abia
		abbreviation: string; // "AB",
		iso_code: string; // "NG-AB",
		id: string; //"Abia",
		cities: { name: string; id: string }[];
	}[] = ngGeo;

	return (
		<section className="pb-16">
			<div className="relative h-[812px] text-white">
				<div className="p-10 tab:px-32">
					<div className="relative max-w-[1200px] h-full mx-auto">
						<div className="z-20 absolute h-[712px] max-w-[754] grid gap-4 place-content-center">
							<div className="font-bold text-[40px] tab:text-[56px]">
								Welcome to <span className="text-[#28A745]">{`Nigeria’s`}</span> Health Workforce Registry
							</div>
							<div className="text-sm">
								{`Nigeria Health Workforce Registry (NHWR) is a human resources management tool that enables the States to design and manage a comprehensive human resources for health strategy. It is the single and authoritative source of health workforce information, that can provide accurate count of all healthcare personnel that have either worked or currently working at all tiers of government, private sector, as well as diaspora.`}
							</div>
							<div className="z-20 absolute bottom-0 flex gap-6 items-center">
								<div>Our Partner:</div>
								<div className="flex gap-4">
									{appConfig.partners.map((p, k) => {
										return (
											<Image
												key={p + k}
												//className=""
												src={p}
												width={48}
												height={48}
												alt={"partner"}
											/>
										);
									})}
								</div>
							</div>{" "}
						</div>
					</div>
				</div>

				<div className="absolute z-10 h-full w-full bg-black opacity-80 top-0 bottom-0 left-0 right-0" />
				<Image
					className="object-cover absolute top-0 h-full w-full overflow-hidden"
					src={hpImage}
					width={1440}
					height={812}
					alt={"Home"}
				/>
			</div>

			<div className="mx-12 tab:mx-32 text-black">
				<div className="text-3xl tab:text-5xl py-6 px-10 border shadow-sm border-[#D0FFD8] bg-white max-w-[714px] mx-auto mt-16 text-center">
					National Health Workforce Registry
				</div>

				<div>
					<div className="w-[1px] h-14 bg-[#96E4A8] mx-auto" />

					<div className="hidden relative h-14 tab:grid grid-cols-4 gap-6">
						{/* <hr className="h-[1.5px] bg-[#96E4A8] w-3/4 absolute left-[12.5%]" /> */}
						{[1, 2, 3, 4].map((i, j) => {
							return (
								<div
									key={i}
									className={"relative w-1/2 h-full border-r-[1.5px] border-[#96E4A8] " + (j !== 0 ? "border-t-[1.5px]" : "")}
								>
									<div className={"absolute w-[150%] -left-full -ml-[26px] -mt-[1px] border-[#96E4A8] " + (j !== 0 ? "border-t-[1.5px]" : "")} />
								</div>
							);
						})}
					</div>
				</div>

				<div className="grid tab:grid-cols-4 gap-6">
					{regions.map((content, index) => {
						return (
							<React.Fragment key={content.iso_code + index}>
								<div className="relative flex items-center place-content-center gap-2 py-4 px-4 tab:py-6 tab:px-10 border border-[#D0FFD8] bg-white w-full">
									<Image
										src={iconSvg}
										width={24}
										height={24}
										alt={content.name}
									/>
									<span>{content.name + " SHWR"}</span>
									{regions.length - index > 1 ? (
										<div
											className={
												"absolute top-full left-1/2 h-6 border-r-[1.5px] border-[#96E4A8]" +
												(regions.length - index < 5 ? " tab:hidden" : "")
											}
										/>
									) : null}
								</div>
							</React.Fragment>
						);
					})}
				</div>
			</div>
		</section>
	);
};
