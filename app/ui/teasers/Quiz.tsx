import Image from "next/image";
import { Icons } from "../utils/Icons";
import { ProfileMini } from "./ProfileMini";

export const Quiz = ({
	image,
	title,
	description,
	duration,
	author,
	price,
}: {
	image: string;
	title: string;
	description: string;
	duration: string;
	price: string;
	author: { name: string; picture?: string };
}) => {
	return (
		<div>
			<Image
				src={image}
				alt={title}
				className="rounded-lg"
				width={240}
				height={240}
			/>
			<div className="flex place-content-between">
				<div className="flex gap-2">
					<Icons.GridOutline /> {"Quiz"}
				</div>
				<div className="flex gap-2">
					<Icons.Clock /> {duration}
				</div>
			</div>
			<h3 className="line-clamp-2">{title}</h3>
			<div className="mt-4 mb-3">{description}</div>
			<div className="grid grid-cols-2 place-content-between">
				<ProfileMini profile={author} />
				<div>{price}</div>
			</div>
		</div>
	);
};
