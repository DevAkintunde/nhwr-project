import { BlogPreview } from "./ui/landing/BlogPreview";
import { Collaborators } from "./ui/landing/Collaborators";
import { FeatureList } from "./ui/landing/FeatureList";
import { HomePrev } from "./ui/landing/HomePrev";
import { MeetTheTeam } from "./ui/landing/MeetTheTeam";
import { Testimonial } from "./ui/landing/Testimonial";

// Website home page
export default function Home() {
	return (
		<div className="px-4 tab:px-20 bg-white">
			<HomePrev />
			<Collaborators />
			<BlogPreview />
			<FeatureList />
			<Testimonial />
			<MeetTheTeam />
			<section> latest news and resources placeholder</section>
		</div>
	);
}
