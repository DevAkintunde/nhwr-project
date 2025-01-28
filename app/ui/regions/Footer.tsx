"use client";
import Link from "next/link";
import Image from "next/image";
import { appConfig } from "../../../../app.config";
import { Icons } from "../utils/Icons";

export const Footer = () => {
	const footerSetting = appConfig.menus.footer;
	const linkClass = "text-color-bg mt-1 tab:mt-4 block";
	return (
		<footer className="w-full grid grid-cols-1 z-50">
			<div
				className="grid items-center tab:place-content-between tab:grid-cols-3 gap-4 px-8 tab:px-24 py-4 tab:py-16"
				style={{ backgroundColor: "rgba(0, 0, 205, 0.75)", color: "rgba(234, 236, 240, 1)" }}
			>
				<div className="col-span-1 mt-3 mb-6 tab:mt-0 tab:mb-0 text-center tab:text-left">
					<Link
						href="/"
						title="Home"
					>
						<Image
							src={footerSetting.logo}
							alt="Logo" //className="dark:invert"
							width={197}
							height={178.16}
							className="mx-auto tab:mx-0"
							//priority
						/>
					</Link>
					<div className="mt-4 tab:mt-10 max-w-[80%] mx-auto tab:mx-0">{footerSetting.text}</div>
				</div>

				<div className="tab:col-span-2 grid grid-cols-4 tab:flex tab:flex-nowrap gap-2 tab:gap-12 mb-4 tab:mb-0 items-start tab:place-content-end">
					{Object.keys(footerSetting.nav).map((group, i) => {
						return (
							<nav
								key={group + i}
								className="grid place-content-center"
							>
								<span className="text-[#98A2B3]">{group}</span>
								<ol>
									{footerSetting.nav[group as keyof typeof footerSetting.nav].map((nav, j) => {
										return (
											<li key={j}>
												<Link
													href={
														typeof nav === "object" && nav.path
															? nav.path
															: typeof nav === "string" && appConfig.socials[nav.toLowerCase() as "facebook"]
															? appConfig.socials[nav.toLowerCase() as "facebook"]
															: "#"
													}
													className={linkClass}
												>
													{typeof nav === "object" && nav.title ? nav.title : typeof nav === "string" ? nav : ""}
												</Link>
											</li>
										);
									})}
								</ol>
							</nav>
						);
					})}
				</div>
			</div>

			<div
				className="flex place-content-between items-center py-4 tab:py-8 px-16 tab:px-24 text-color-link"
				style={{ backgroundColor: "#0A0A61", color: "#98A2B3" }}
			>
				<span> {"© " + new Date(Date.now()).getFullYear() + ". All rights reserved."}</span>
				<nav>
					<ol className="flex gap-2 tab:gap-6">
						<li>
							<a href={appConfig.socials.facebook}>
								<Icons.Facebook className="tab:text-2xl" />
							</a>
						</li>
						<li>
							<a href={appConfig.socials.instagram}>
								<Icons.Linkedin className="tab:text-2xl" />
							</a>
						</li>
						<li>
							<a href={appConfig.socials.twitter}>
								<Icons.Twitter className="tab:text-2xl" />
							</a>
						</li>
						<li>
							<a href={appConfig.socials.instagram}>
								<Icons.Instagram className="tab:text-2xl" />
							</a>
						</li>
					</ol>
				</nav>
			</div>
		</footer>
	);
};
