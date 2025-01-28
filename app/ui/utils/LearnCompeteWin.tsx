import Image from "next/image";

export const LearnCompeteWin = ({ className, retainDefaultClasses = true }: { className?: string; retainDefaultClasses?: boolean }) => {
	return (
		<div className={!retainDefaultClasses ? className : "relative h-full max-h-[480px] tab:max-h-[540px]" + (className ? " " + className : "")}>
			<Image
				src={"/assets/svg/LearnCompeteWinWIthCircleLayers.svg"}
				alt="brand"
				fill
				//sizes="(max-height: 600px) 60vw, (max-height: 1200px) 30vw, 33vw"
				//sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				//className="h-fit"
				/* style={{ objectFit: "contain" }} */
			/>
		</div>
	);
};
{
	/* <div className={className ? className : `text-[5em] leading-[0.85em] tab:text-8xl font-extrabold relative`}>
			<div className="break-words tab:break-normal">
				<div className="text-[#5b72ee]">Learn</div>
				<div className="text-[#00cbb8]">Compete</div>
				<div className="text-[#29b9e7]">Win</div>
			</div>
		</div> */
}
