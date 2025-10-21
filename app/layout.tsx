import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Sora 2 Pro - AI Video Generator",
	description: "Transform your ideas into stunning AI videos with Sora 2. Advanced JSON prompting for photorealistic results.",
};

// Avoid initializing Whop SDK during server build/prerender. Load on client only.
const WhopAppClient = dynamic(
  () => import("@whop/react/components").then((m) => m.WhopApp),
  { ssr: false },
);

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<WhopAppClient>{children}</WhopAppClient>
			</body>
		</html>
	);
}
