"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { appConfig } from "@/app.config";

export const Header = () => {
	const pathname = usePathname();
	const headerMenuLinks = appConfig.menus.header.nav;
	return (
		<header className={"w-full text-white text-sm z-50" + (pathname !== "/" ? " bg-black" : " absolute")}>
			<div className="relative flex max-w-[1200px] mx-auto py-10 place-content-between items-center">
				<Link
					href="/"
					title="Home"
				>
					<Image
						src={appConfig.menus.header.logo}
						alt="NHWR" //className="dark:invert"
						width={180}
						height={47.52}
						priority
						className="align-baseline max-w-[75%] h-auto -mt-1"
					/>
				</Link>

				<div className="font-semibold flex gap-10 items-center">
					{headerMenuLinks.map((link) => {
						return (
							<Link
								key={link.path}
								href={link.path}
								title={link.title}
							>
								{link.title}
							</Link>
						);
					})}
				</div>
			</div>
		</header>
	);
};
