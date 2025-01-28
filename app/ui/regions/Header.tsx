"use client";
import Image from "next/image";
import React, { useContext } from "react";
import { appConfig } from "../../../../app.config";
import MainNav from "../nav/MainNav";
import AnonAccountButtons from "../nav/AnonAccountButtons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Account } from "../providers/ProvidersExport";

export const Header = () => {
	const pathname = usePathname();
	// import current user account detail
	const { account } = useContext(Account);
	return (
		<header
			className={
				"pt-8 pb-16 px-4 tab:pt-9 tab:pb-20 tab:px-20 grid gap-4 grid-cols-2 tab:flex tab:gap-8 place-content-between items-end w-full" +
				(pathname === "/" ? " bg-white" : "")
			}
		>
			<Link
				href="/"
				title="Home"
			>
				<Image
					src={appConfig.menus.header.logo}
					alt="Quizmaster Bot Logo" //className="dark:invert"
					width={150}
					height={25}
					priority
					className="align-baseline max-w-[75%] h-auto -mt-1"
				/>
			</Link>

			{pathname !== "/verify" ? (
				<nav className="flex gap-2 tab:gap-8 tab:flex-wrap items-center flex-row-reverse tab:flex-row place-content-end">
					<MainNav />
					{!account || (account && !account.status) ? <AnonAccountButtons /> : null}
				</nav>
			) : null}
		</header>
	);
};
