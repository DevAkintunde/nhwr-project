"use client";
import Link from "next/link";
import Image from "next/image";
import { appConfig } from "@/app.config";

export const Footer = () => {
	const footerSetting = appConfig.menus.footer;
	//const linkClass = "text-color-bg mt-1 tab:mt-4 block";
	return (
		<footer className="w-full bg-black text-white text-sm">
			<div className="max-w-[1200px] mx-auto pt-32">
				<div className="grid items-start grid-cols-5">
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

					<div className="col-span-3 grid grid-cols-3 gap-4">
						{Object.keys(footerSetting.nav).map((group, i) => {
							return (
								<nav key={group + i} className="place-self-center items-start h-full">
									<div className="pb-4 font-semibold">{group}</div>
									<ul className="grid gap-4 text-[#D4D4D4]">
										{footerSetting.nav[group as keyof typeof footerSetting.nav].map((nav, j) => {
											return (
												<li
													key={j}
													className=""
												>
													<Link
														href={nav.path}
														//className={linkClass}
													>
														{nav.title}
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

				<div className="text-[#D4D4D4] flex place-content-between items-center py-20">
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
			</div>
		</footer>
	);
};
