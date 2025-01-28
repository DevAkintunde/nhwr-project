import { objectifyStringedKeys } from "@/app/lib/utils/objectifyStringedKeys";

/**
 * @description default web app config file containing primarily social media links and homepage data contents.
 */
export const appConfig = {
	socials: { facebook: "facebook.com/quizbox", twitter: "twitter.com", instagram: "instagram.com", linkedin: "linkedin.com" },
	placeholder: { thumbnails: { picture: "" } },
	menus: {
		header: {
			logo: "/quizmaster_bot_logo.png",
			nav: [
				{ title: "Home", path: "/" },
				{ title: "Quizzes", path: "/quizzes" },
				{ title: "Competition", path: "/competition" },
				{ title: "Examination Prep", path: "/examination-prep" },
				{ title: "Blog", path: "/blog" },
				{ title: "About Us", path: "/about-us" },
			],
		},
		footer: {
			logo: "/quizmaster_bot_logo-alt.png",
			text: "Top learning experiences that creates more talents in the world.",
			nav: {
				Overview: [
					{ title: "Quizzes", path: "/quizzes" },
					{ title: "Competition", path: "/competition" },
					{ title: "Examination Prep", path: "/examination-prep" },
					{ title: "Pricing", path: "/pricing" },
				],
				Company: [
					{ title: "About Us", path: "/about-us" },
					{ title: "Careers", path: "/careers" },
					{ title: "News", path: "/news" },
				],
				Social: ["Facebook", "LinkedIn", "Twitter", "Instagram"],
				Legal: [
					{ title: "Terms", path: "/terms" },
					{ title: "Privacy", path: "privacy" },
					{ title: "Cookies", path: "cookies" },
					{ title: "Contact", path: "contact" },
				],
			},
		},
	},
	homepageDataDrive: {
		header: { subtext: "Engage, Learn, and Earn Rewards while still having fun", image: "/fp-header-image.png" },
		collaboratorLogos: [
			"/assets/collaborators/Codecov.svg",
			"/assets/collaborators/Duolingo.svg",
			"/assets/collaborators/MagicLeap.svg",
			"/assets/collaborators/UserTesting.svg",
		],
		features: {
			subtext: "This very extraordinary feature, can make learning activites more efficient",
			contents: [
				{
					title: "Everything you can do in a physical class/lecture room, you can do this QUIZMASTER BOT",
					body: "Another thing, in the future maybe you will want to access files from a remote domain, like aws bucket, in such case you have to add the domain",
					image: "/assets/features/blogPlaceholder.png",
				},
				{
					title: "Everything you can do in a physical class/lecture room, you can do this QUIZMASTER BOT",
					body: "Another thing, in the future maybe you will want to access files from a remote domain, like aws bucket, in such case you have to add the domain",
					image: "/assets/features/blogPlaceholder.png",
				},
			],
		},
		testimonial: {
			title: "What They Say?",
			body: `<p>Quizmaster Bot has got more than 100k positive ratings from our users around the world.</p>
					<p>Some of the students and teachers were greatly helped by the skilline.</p>
					<p>Are you too? Please gve your assessment</p>`,
			reviews: [
				{
					name: "Abosede Gloria",
					image: "/MaskGroup.png",
					rating: "10/10",
					review: "Thank you so much Thank you so much Thank you so much Thank you so much Thank you so much<",
				},
			],
		},
		team: [
			{
				name: "Lola one",
				designation: "Founder",
				description: "uihc  ij fjv oijivi o j ij sv  of",
				image: "/digital_camera_photo.jpg",
				socials: { twitter: "https://twitter", linkedin: "https://linkedin.com" },
			},
			{
				name: "Lola two",
				designation: "Team Lead",
				description: "uihc  ij fjv oijivi o j ij sv  of",
				image: "/digital_camera_photo.jpg",
				socials: { twitter: "https://twitter", linkedin: "https://linkedin.com" },
			},
			{
				name: "Lola three",
				designation: "CFO",
				description: "uihc  ij fjv oijivi o j ij sv  of",
				image: "/digital_camera_photo.jpg",
				socials: { twitter: "https://twitter", linkedin: "https://linkedin.com" },
			},
			{
				name: "Lola four",
				designation: "Co-Founder",
				description: "uihc  ij fjv oijivi o j ij sv  of",
				image: "/digital_camera_photo.jpg",
				socials: { twitter: "https://twitter", linkedin: "https://linkedin.com" },
			},
		],
	},
	staticFiles: {
		learnCompeteWin: { mobile: "/assets/static_files/LearnCompeteWin-web.png", web: "/assets/static_files/LearnCompeteWin-mobile.png" },
		fourCircles: { mobile: "/assets/static_files/fourCircle-web.png", web: "/assets/static_files/fourCircle-mobile.png" },
	},
};

export const appJsonData = (endpoint: string) => {
	const data = {
		form: {
			personalisedTitle: "/json/form.title.json",
			countries: "/json/address.countries.json",
			sex: "/json/form.sex.json",
			occupation: "/json/form.occupation.json",
		},
	};

	return process.cwd() + objectifyStringedKeys({ keyAtDepth: endpoint, containerObj: data });
};
