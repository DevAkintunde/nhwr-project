"use client";

import Image from "next/image";
import React from "react";
import ngGeo from "@/app/lib/jsons/ngGeography.json";

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
		<section className="bg-[#FAFAFA] mb-16">
			<div className="relative h-[812px] text-white">
				<div className="relative max-w-[1200px] h-full mx-auto">
					<div className="z-20 absolute top-[40%] left-0 right-[20%] max-w-[754]">
						<div className="font-bold text-[56px]">
							Welcome to <span className="text-[#28A745]">{`Nigeria’s`}</span> Health Workforce Registry
						</div>
						<div className="text-sm">
							{`Nigeria Health Workforce Registry (NHWR) is a human resources management tool that enables the States to design and manage a comprehensive human resources for health strategy. It is the single and authoritative source of health workforce information, that can provide accurate count of all healthcare personnel that have either worked or currently working at all tiers of government, private sector, as well as diaspora.`}
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

			<div className="mx-32">
				<div className="text-5xl py-6 px-10 border shadow-sm border-[#D0FFD8] bg-white max-w-[631px] mx-auto my-24 text-center">National Health Workforce Registry</div>

				<div className="grid grid-cols-4 gap-6">
					{regions.map((content, index) => {
						return (
							<React.Fragment key={content.iso_code + index}>
								<div className="flex items-center gap-2 py-6 px-10 border border-[#D0FFD8] bg-white min-w-[280px]">
									<Image
										src={iconSvg}
										width={24}
										height={24}
										alt={content.name}
									/>
									<span>{content.name}</span>
								</div>
							</React.Fragment>
						);
					})}
				</div>
			</div>
		</section>
	);
};
