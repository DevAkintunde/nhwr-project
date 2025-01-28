"use client";
import React, { useEffect, useState, ReactElement } from "react";

interface Imported {
	slides: ReactElement[];
	caption?: string | { caption: string; className: string };
	navigator?:
		| boolean
		| {
				previous: { value: string | React.ReactNode; className: string };
				next: { value: string | React.ReactNode; className: string };
				container?: { className: string };
		  };
	duration?: number;
	className?: string;
	loaderClassName?: string;
	delay?: number;
}
export const SlideShow = ({
	slides,
	caption,
	navigator,
	duration,
	className,
	loaderClassName,
	delay, //delay between loader transitions
}: Imported) => {
	const [onDisplay, setOnDisplay] = useState({
		data: slides[0],
		index: 0,
	});
	const [slideTrigger, setSlideTrigger] = useState({
		direction: "",
		trigger: "", //a constant changing value even where direction might not have changed: next, after next... which would not trigger useEffect
	});

	useEffect(() => {
		let isMounted = true;

		type NewDisplay = { data: object; index: number };
		function newDisplay(prev: NewDisplay) {
			const indexer =
				slideTrigger.direction === "previous"
					? prev.index - 1 < 0
						? slides.length - prev.index - 1
						: prev.index - 1
					: prev.index + 2 > slides.length
					? 0
					: prev.index + 1;
			const newSlide = {
				data: slides[indexer],
				index: indexer,
			};
			return newSlide;
		}
		if (isMounted && slideTrigger.direction) setOnDisplay((prev) => newDisplay(prev));

		return () => {
			isMounted = false;
		};
	}, [slides, slideTrigger]);

	const previousButton = () => {
		setSlideTrigger({ direction: "previous", trigger: Date.now().toString() });
	};
	const nextButton = () => {
		setSlideTrigger({ direction: "next", trigger: Date.now().toString() });
	};

	//auto slideshow when duration exist
	if (duration && typeof duration === "number")
		setInterval(() => {
			setSlideTrigger({ direction: "next", trigger: Date.now().toString() });
		}, duration);

	return (
		<div className={loaderClassName}>
			<div className={className ? className : "mx-auto relative"}>
				{onDisplay.data}
				{/* slides[0] */}
				<div>
					<div className={caption && typeof caption === "object" && caption.className ? caption.className : "text-center"}>
						{caption ? (typeof caption === "string" ? caption : caption.caption ? caption.caption : null) : null}
					</div>
					{navigator ? (
						<div
							className={
								navigator && typeof navigator === "object" && navigator.container && navigator.container.className
									? navigator.container.className
									: "absolute z-10 text-3xl grid grid-cols-2 px-2 place-content-evenly w-full bottom-1/2 text-center"
							}
						>
							<span
								className={
									navigator && typeof navigator === "object" && navigator.previous && navigator.previous.className
										? navigator.previous.className
										: "opacity-20 hover:opacity-100 cursor-pointer"
								}
								onClick={previousButton}
							>
								{navigator && typeof navigator === "object" && navigator.previous && navigator.previous.value ? navigator.previous.value : "<"}
							</span>
							<span
								className={
									navigator && typeof navigator === "object" && navigator.next && navigator.next.className
										? navigator.next.className
										: "opacity-20 hover:opacity-100 cursor-pointer"
								}
								onClick={nextButton}
							>
								{navigator && typeof navigator === "object" && navigator.next && navigator.next.value ? navigator.next.value : ">"}
							</span>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
};
