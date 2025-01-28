import Link from "next/link";
import React from "react";

export const PrimaryButton = ({
	href,
	action,
	className,
	text,
	type,
}: {
	className?: string;
	href?: string;
	action?: () => void;
	text: string;
	type?: "button" | "submit";
}) => {
	return !href ? (
		<button
			className={
				className ? className : "inline-block rounded-xl bg-color-pri text-color-bg py-2 px-3 whitespace-nowrap shadow border-4 border-[#F4EBFF]"
			}
			onClick={!type || (type && type !== "submit") ? action : undefined}
			type={type ? type : "button"}
			onSubmit={type && type === "submit" ? action : undefined}
		>
			{text}
		</button>
	) : (
		<Link
			href={href}
			className={
				className
					? className
					: "inline-block rounded-lg tab:rounded-xl bg-color-pri text-color-bg py-1 tab:py-2 px-2 tab:px-3 whitespace-nowrap shadow border-4 border-[#F4EBFF]"
			}
		>
			{text}
		</Link>
	);
};
