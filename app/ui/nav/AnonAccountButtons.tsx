"use client";
import Link from "next/link";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { usePathname } from "next/navigation";

const AnonAccountButtons = () => {
	const currentPath = usePathname();
	return (
		<nav>
			<ol className="flex gap-2 tab:gap-6 items-center">
				{currentPath !== "/signin" && currentPath !== "/signup" ? (
					<li>
						<Link
							href={"signin" + "?redirect=" + currentPath}
							className="font-semibold text-neu whitespace-nowrap"
						>
							Log in
						</Link>
					</li>
				) : null}
				{currentPath !== "/signin" && currentPath !== "/signup" ? (
					<li>
						<PrimaryButton
							href="signup"
							text="Create account"
						/>
					</li>
				) : null}
			</ol>
		</nav>
	);
};

export default AnonAccountButtons;
