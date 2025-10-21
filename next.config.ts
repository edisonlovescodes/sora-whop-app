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
						value: "frame-ancestors https://whop.com https://*.whop.com;",
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
