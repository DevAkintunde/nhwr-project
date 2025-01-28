import Image from "next/image";
import { appConfig } from "../../../../app.config";

export const ProfileMini = ({ profile }: { profile: { name: string; picture?: string } }) => {
	const thumbnailPlaceholder = appConfig.placeholder.thumbnails.picture;
	return (
		<div>
			{thumbnailPlaceholder || profile.picture ? (
				<Image
					src={profile.picture ? profile.picture : thumbnailPlaceholder}
					alt={profile.name}
					height={80}
					width={80}
				/>
			) : null}
			<span>{profile.name}</span>
		</div>
	);
};
