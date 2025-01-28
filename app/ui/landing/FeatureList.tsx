"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { appConfig } from "../../../../app.config";

export const FeatureList = () => {
	const feature = appConfig.homepageDataDrive.features;
	return (
		<section className="mt-16">
			<div className="text-center">
				<h2 className="flex gap-3 font-bold place-content-center">
					<span className="text-color-pri">Our</span>
					<span className="text-color-sec">Features</span>
				</h2>
				<p>{feature.subtext}</p>
			</div>
			{feature.contents.map((content, index) => {
				return (
					<React.Fragment key={content.title + index}>
						<div className="grid tab:grid-cols-7 gap-3 items-center mt-3 tab:mt-4 w-full place-content-center">
							<Image
								className="tab:col-span-4 place-self-center"
								src={content.image}
								width={600}
								height={480}
								alt="platform feature"
							/>
							<div className={(index % 2 !== 0 ? "tab:order-first" : "tab:order-last") + " tab:col-span-3"}>
								<h3>{content.title}</h3>
								<div
									className="mt-2"
									dangerouslySetInnerHTML={{
										__html: content.body,
									}}
								/>
							</div>
						</div>
					</React.Fragment>
				);
			})}
			<div className="text-center mt-16">
				<PrimaryButton
					className="rounded-full border border-color-sec py-3 px-4 text-color-sec"
					text="See more features"
					href="features"
				/>
			</div>
		</section>
	);
};
