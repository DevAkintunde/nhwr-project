"use client";

import Image from "next/image";
import { Icons } from "../utils/Icons";
import { useEffect, useRef, useState } from "react";
import { appConfig } from "../../../../app.config";

export const MeetTheTeam = () => {
	const resources: {
		name: string;
		designation: string;
		description?: string;
		image: string;
		socials: { twitter?: string; linkedin?: string };
	}[] = appConfig.homepageDataDrive.team;

	const [scrollProps, setScrollProps] = useState<number | "-1" | "+1">("-1"); // -1 = extreme left (default, +1 extreme right)

	const [displayNavigator, setDisplayNavigator] = useState(false);

	useEffect(() => {
		let isMounted = true;
		if (isMounted && displayNavigator) {
			const left = document.querySelector(".meettheteam-hp-images-left");
			const right = document.querySelector(".meettheteam-hp-images-right");
			if (scrollProps === "-1" && !left?.classList.contains("hidden")) left?.classList.add("hidden");
			else left?.classList.remove("hidden");
			if (scrollProps === "+1" && !right?.classList.contains("hidden")) right?.classList.add("hidden");
			else right?.classList.remove("hidden");
		}

		return () => {
			isMounted = false;
		};
	}, [displayNavigator, scrollProps]);

	const haltRerender = useRef(false);

	useEffect(() => {
		let isMounted = true;
		const navigatorController = (slideWitch: number) => {
			const mainContainer = document.getElementById("meettheteam-hp-images");
			if (slideWitch && mainContainer && slideWitch * resources.length > mainContainer.clientWidth) setDisplayNavigator(true);
			haltRerender.current = true;
		};
		if (isMounted && !haltRerender.current) {
			const interval = setInterval(() => {
				const resourceContainerHP = document.querySelector(".meet-team-resourceContainer-hp");
				if (resourceContainerHP && resourceContainerHP.clientWidth > 100) {
					navigatorController(resourceContainerHP.clientWidth);
					clearInterval(interval);
				}
			}, 500);
		}
		return () => {
			isMounted = false;
		};
	}, [resources.length]);

	return (
		<section className="mt-20 mb-12 text-center relative">
			<h2 className="text-5xl p-0 m-0 font-bold mb-12">Meet the Team</h2>
			<div
				id="meettheteam-hp-images"
				className={"flex-nowrap flex overflow-hidden" + (!displayNavigator ? " place-content-center" : "")}
			>
				{resources.map((member, index) => {
					return (
						<div
							className="min-w-64 meet-team-resourceContainer-hp mx-4"
							key={index}
						>
							<Image
								src={member.image}
								width={240}
								height={240}
								alt="team picture"
								className="rounded-3xl mx-auto"
							/>
							<div>
								<h3 className="text-color-pri font-bold">{member.name + " " + index}</h3>
								<div className="text-color-sec">{member.designation}</div>
								<div className="text-color-text">{member.description}</div>
								{member.socials.twitter || member.socials.twitter ? (
									<div className="flex gap-3 place-content-center mt-4">
										{member.socials.twitter ? (
											<a href={member.socials.twitter}>
												<Icons.Twitter />
											</a>
										) : null}
										{member.socials.linkedin ? (
											<a href={member.socials.linkedin}>
												<Icons.Linkedin />
											</a>
										) : null}
									</div>
								) : null}
							</div>
						</div>
					);
				})}
			</div>
			<Icons.AngleLeft
				className={
					"absolute -left-2 top-[40%] bg-color-bg shadow rounded-full text-color-sec p-2 text-4xl cursor-pointer meettheteam-hp-images-left" +
					(scrollProps === "-1" || !displayNavigator ? " hidden" : "")
				}
				onClick={() => {
					const container = document.getElementById("meettheteam-hp-images");
					if (container) {
						if (scrollProps === "-1") container.scroll(0, 0);
						else {
							const resourceContainerHP = document.querySelector(".meet-team-resourceContainer-hp");
							const currentPixel =
								scrollProps === "+1" ? Number(resourceContainerHP?.clientWidth) * resources.length - container.clientWidth : scrollProps;
							if (currentPixel - 480 > 0) container.scroll(currentPixel - 480, 0);
							else container.scroll(0, 0);
							setScrollProps(currentPixel - 480 > 0 ? currentPixel - 480 : "-1");
						}
					}
				}}
			/>
			<Icons.AngleRight
				className={
					"absolute -right-2 top-[40%] bg-color-bg shadow rounded-full text-color-sec p-2 text-4xl cursor-pointer meettheteam-hp-images-right" +
					(scrollProps === "+1" || !displayNavigator ? " hidden" : "")
				}
				onClick={() => {
					const container = document.getElementById("meettheteam-hp-images");
					if (container) {
						const resourceContainerHP = document.querySelector(".meet-team-resourceContainer-hp");
						const resourceContainer = Number(resourceContainerHP?.clientWidth) * resources.length;
						if (scrollProps === "+1") container.scroll(resourceContainer, 0);
						else {
							const currentPixel = scrollProps === "-1" ? container.clientWidth : scrollProps;
							if (currentPixel + 480 < resourceContainer) container.scroll(currentPixel + 480, 0);
							else container.scroll(resourceContainer, 0);
							setScrollProps(currentPixel + 480 < resourceContainer ? currentPixel + 480 : "+1");
						}
					}
				}}
			/>
		</section>
	);
};
