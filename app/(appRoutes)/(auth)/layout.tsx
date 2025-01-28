import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Authenticated page",
	description: "Authorised page access",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return children;
}
