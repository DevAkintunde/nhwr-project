"use client";
import Link from "next/link";
import Image from "next/image";
import { appConfig } from "@/app.config";

export const Footer = () => {
	const footerSetting = appConfig.menus.footer;
	//const linkClass = "text-color-bg mt-1 tab:mt-4 block";
	return (
		<footer className="w-full bg-black text-white text-sm">
			<div className="pt-10 tab:pt-32 px-10 tab:px-32">
			<div className="max-w-[1200px] mx-auto">
				<div className="grid gap-20 tab:items-start tab:grid-cols-5">
					<div className="col-span-2">
						<Image
							src={footerSetting.logo}
							alt="Logo" //className="dark:invert"
							width={180}
							height={47.52}
							//priority
						/>
						<div className="my-10">
							{`
						Nigeria Health Workforce Registry (NHWR) is a human resources management tool that enables the States to design and manage a comprehensive human resources for health strategy. It is the single and authoritative source of health workforce information, that can provide accurate count of all healthcare personnel that have either worked or currently working at all tiers of government, private sector, as well as diaspora.
						`}
						</div>
						<div className="">{"© NHWR " + new Date(Date.now()).getFullYear()}</div>
					</div>

					<div className="col-span-3 grid tab:grid-cols-3 gap-4">
						{Object.keys(footerSetting.nav).map((group, i) => {
							return (
								<nav
									key={group + i}
									className="tab:place-self-center items-start h-full"
								>
									<div className="pb-4 font-semibold">{group}</div>
									<ul className="grid gap-4 text-[#D4D4D4]">
										{footerSetting.nav[group as keyof typeof footerSetting.nav].map((nav, j) => {
											return (
												<li
													key={j}
													className=""
												>
													<Link
														href={(nav.title === "phone" ? "tel: " : nav.title === "email" ? "mailto: " : "") + nav.path}
														//className={linkClass}
													>
														{group.toLowerCase() === "contact" ? nav.path : nav.title}
													</Link>
												</li>
											);
										})}
									</ul>
								</nav>
							);
						})}
					</div>
				</div>

				<div className="text-[#D4D4D4] grid tab:flex gap-10 place-content-between items-center py-20">
					<nav>
						<ul className="flex gap-6 sm:gap-10">
							{footerSetting.bottomNav.links.map((link, j) => {
								return (
									<li key={link.path + j}>
										<Link
											href={link.path}
											//className={linkClass}
										>
											{link.title}
										</Link>
									</li>
								);
							})}
						</ul>
					</nav>
					<nav>
						<ul className="flex gap-6 sm:gap-10">
							{footerSetting.bottomNav.socials.map((link, j) => {
								return (
									<li key={link.path + j}>
										<Link
											href={link.path}
											//className={linkClass}
										>
											{link.title}
										</Link>
									</li>
								);
							})}
						</ul>
					</nav>
				</div>
			</div></div>
		</footer>
	);
};
