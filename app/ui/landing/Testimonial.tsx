"use client";

import Image from "next/image";
import { SlideShow } from "../nav/SlideShow";
import Link from "next/link";
import { Icons } from "../utils/Icons";
import { appConfig } from "../../../../app.config";

export const Testimonial = () => {
	const testimonials: {
		title: string;
		body: string;
		reviews: {
			image: string;
			name: string;
			rating: string;
			review: string;
		}[];
	} = appConfig.homepageDataDrive.testimonial;

	const slideShows = testimonials.reviews.map((review, index) => {
		return (
			<div
				className="relative h-full"
				key={index}
			>
				<Image
					src={review.image}
					width={480}
					height={400}
					alt={review.name}
					className="rounded-3xl z-10"
				/>
				<div className="rounded-2xl border-l-8 border-[#F67766] px-6 pt-4 pb-3 tab:px-8 tab:pt-6 tab:pb-4 shadow-2xl -mt-[20%] -mr-[20%] ml-[15%] bg-color-bg z-10 relative">
					<p className="line-clamp-3">{review.review}</p>
					<div className="flex place-content-between items-start mt-6 text-sm">
						<p>{review.name}</p>
						<div>
							Rating <div>{review.rating}</div>
						</div>
					</div>
				</div>
			</div>
		);
	});

	return (
		<section className="grid tab:grid-cols-2 gap-12 items-center mt-16 tab:my-14">
			<div className="max-w-[480px] mx-auto">
				<div className="flex tab:gap-6 items-center text-color-pri place-content-center">
					<span className="w-20 bg-color-pri h-0.5 hidden tab:block" />
					<h2 className="text-3xl p-0 m-0">TESTIMONIAL</h2>
				</div>
				<div className="text-4xl font-bold text-color-pri text-center my-3 tab:my-10">{testimonials.title}</div>
				<div
					className="text-lg place-self-center w-[80%] mx-auto"
					dangerouslySetInnerHTML={{ __html: testimonials.body }}
				/>

				<div className="hidden tab:block mx-auto w-fit mt-4 tab:mt-10">
					<Link
						href="write-review"
						className="rounded-full border border-color-sec bg-color-bg flex flex-nowrap place-content-between items-center"
					>
						<span className="px-6 tab:px-12">Write your review</span>
						<Icons.LongArrowAltRight className="rounded-full p-2 border border-color-sec bg-color-bg text-color-sec text-4xl tab:text-5xl" />
					</Link>
				</div>
			</div>

			<SlideShow
				loaderClassName="w-[70%] mx-auto"
				slides={slideShows}
				navigator={{
					previous: {
						value: <Icons.AngleLeft />,
						className: "p-2 rounded-full text-xl text-color-sec bg-color-bg inline absolute -left-6 -top-8 shadow cursor-pointer",
					},
					next: {
						value: <Icons.AngleRight />,
						className: "p-2 rounded-full text-xl text-color-sec bg-color-bg inline absolute -right-6 -top-8 shadow cursor-pointer",
					},
					//container: { className: "string" },
				}}
			/>
			<div className="block tab:hidden mx-auto w-fit mt-1">
				<Link
					href="write-review"
					className="rounded-full border border-color-sec bg-color-bg flex flex-nowrap place-content-between items-center"
				>
					<span className="px-6 tab:px-12">Write your review</span>
					<Icons.LongArrowAltRight className="rounded-full p-2 border border-color-sec bg-color-bg text-color-sec text-4xl tab:text-5xl" />
				</Link>
			</div>
		</section>
	);
};
