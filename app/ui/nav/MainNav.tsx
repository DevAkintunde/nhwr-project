"use client";
import { appConfig } from "@/app.config";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";

// potential menu button
const MainNav = () => {
	const headerMenu = appConfig.menus.header.nav;
	{
		const pathname = usePathname();
		const menuButton = (
			<div>
				<div
					style={{
						height: "3px",
						marginTop: "0px",
						width: "30px",
					}}
					className={"bg-color-pri"}
				></div>
				<div
					style={{
						height: "3px",
						margin: "3px 0",
						width: "30px",
					}}
					className={"bg-color-pri"}
				></div>
				<div
					style={{
						height: "3px",
						width: "30px",
					}}
					className={"bg-color-pri"}
				></div>
			</div>
		);

		const [menu, setMenu] = useState<React.ReactElement | undefined>();
		const launchMainMenu = () => {
			if (menu) setMenu(undefined);
			else setMenu(menuContainer);
		};
		const closeMainMenu = () => {
			setMenu(undefined);
		};

		const activeLink = (menuPath: string) =>
			(pathname === menuPath ? "bg-color-pri text-color-bg" : "text-color-neu") + "  py-1 px-2 whitespace-nowrap font-semibold";

		const menuContainer = (
			<>
				{/* auto close on clicking outside of menu region */}
				<div
					className="-z-10 absolute top-0 bottom-0 right-0 left-0 tab:hidden"
					onClick={closeMainMenu}
				></div>

				<ol className="tab:flex tab:gap-2 tab:items-center">
					{headerMenu.map((nav) => {
						return (
							<li key={nav.title}>
								<Link
									href={nav.path}
									title={nav.title}
									className={activeLink(nav.path)}
									onClick={closeMainMenu}
								>
									{nav.title}
								</Link>
							</li>
						);
					})}
				</ol>
			</>
		);
		return (
			<nav className={"z-10"}>
				<button
					type="button"
					id={"menuButton"}
					className={"flex gap-2 mr-2 items-center tab:hidden"}
					onClick={(e) => {
						const navContainer = (e.target as HTMLElement).nextElementSibling;
						if (navContainer) {
							if (navContainer.classList.contains("hidden")) navContainer.classList.remove("hidden");
							else navContainer.classList.add("hidden");
						}
						launchMainMenu();
						//onClick && onClick();
					}}
				>
					{menuButton}
				</button>
				<nav className="hidden tab:block tab:relative tab:p-0 tab:z-0 tab:shadow-none tab:text-black tab:w-fit tab:h-auto">
					{menuContainer}
				</nav>

				{menu &&
					createPortal(
						<nav className="fixed bottom-0 top-0 left-0 pb-8 z-50 right-0 max-w-full bg-color-pri/75 bg-clip-padding shadow-sm outline-none text-gray-700 border-none w-full h-screen tab:hidden">
							{menu}
						</nav>,
						document.getElementById("quizmaster-app")!
					)}
			</nav>
		);
	}
};

export default MainNav;
