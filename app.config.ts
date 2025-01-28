import { objectifyStringedKeys } from "@/app/lib/utils/objectifyStringedKeys";

/**
 * @description default web app config file containing quick header and footer links, and global json data loader serverside components.
 */
export const appConfig = {
	socials: { facebook: "facebook.com/quizbox", twitter: "twitter.com", instagram: "instagram.com", linkedin: "linkedin.com" },
	partners: [],
	menus: {
		header: {
			logo: "/svgs/logo.svg",
			nav: [
				{ title: "Home", path: "/" },
				{ title: "About", path: "/about-us" },
				{ title: "FAQs", path: "/faq" },
			],
		},
		footer: {
			logo: "/svgs/logo.svg",
			nav: {
				About: [
					{ title: "Careers", path: "/careers" },
					{ title: "Blog", path: "/blog" },
					{ title: "About", path: "/about-us" },
					{ title: "Contact", path: "/contact" },
				],
				States: [
					{ title: "Lagos", path: "/lagos" },
					{ title: "Ibadan", path: "/ibadan" },
					{ title: "FCT", path: "/fct" },
				],
				Contact: [
					{ title: "email", path: "hello@nhwr.com" },
					{ title: "hone", path: "(+1) (555) 555-1234" },
				],
			},
			bottomNav: {
				links: [
					{ title: "Privacy Policy", path: "/privacy-policy" },
					{ title: "Terms and Conditions", path: "/terms" },
					{ title: "Return Policy", path: "/return-policy" },
				],
				socials: [
					{ title: "instagram", path: "instagram.com" },
					{ title: "facebook", path: "facebook.com" },
					{ title: "twitter", path: "twitter.com" },
				],
			},
		},
	},
};

export const appJsonData = (endpoint: string) => {
	const data = {
		countries: "/app/lib/jsons/ngGeography.json",
		/* form: {
			countries: "/app/lib/jsons/ngGeography.json",
		}, */
	};

	return process.cwd() + objectifyStringedKeys({ keyAtDepth: endpoint, containerObj: data });
};
