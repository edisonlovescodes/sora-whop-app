import { withWhopAppConfig } from "@whop/react/next.config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [{ hostname: "**" }],
	},
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "Content-Security-Policy",
						// Allow Whop to embed our app (frame-ancestors) and allow our app to embed Whop checkout (frame-src)
						value: "frame-ancestors https://whop.com https://*.whop.com; frame-src 'self' https://whop.com https://*.whop.com; child-src 'self' https://whop.com https://*.whop.com;",
					},
					{
						key: "X-Frame-Options",
						value: "ALLOWALL",
					},
				],
			},
		];
	},
};

export default withWhopAppConfig(nextConfig);
