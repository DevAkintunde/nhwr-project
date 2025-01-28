import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Create an account on Quizmaster",
	description: "Ace your cerifications/exam with ease on Quizmaster",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return children;
}
