import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Sign in to Quizmaster",
	description: "Access the Quizmaster portal",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return children;
}
