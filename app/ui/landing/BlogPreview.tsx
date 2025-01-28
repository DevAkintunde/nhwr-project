import Image from "next/image";
import Link from "next/link";

export const BlogPreview = () => {
	return (
		<section className="grid gap-6 tab:gap-8 tab:grid-cols-2 items-center mt-6 tab:my-8">
			<div className="relative">
				<div className="absolute -left-2 top-1 z-0 bg-[#33EFA0] p-6 rounded-full inline-block" />
				<h3 className="relative z-10 mb-4 text-center tab:text-left">Everything you can do in a physical class/lecture room, you can do this QUIZMASTER BOT</h3>
				<div
					className="mt-2"
					dangerouslySetInnerHTML={{
						__html: `<p>
                    Another thing, in the future maybe you will want to access files from a remote domain, like aws bucket, in such case you have to add the domain </p>`,
					}}
				/>
				<Link
					href={"learn-more"}
					className="underline mt-3 block"
				>
					Learn more
				</Link>
			</div>
			<Image
				src="/assets/features/blogPlaceholder.png"
				width={600}
				height={480}
				alt="blog"
			/>
		</section>
	);
};
