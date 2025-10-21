// app/components/VideoSettings.tsx
"use client";

import { useMemo, useState } from "react";
import { CREDIT_COSTS } from "@/lib/types/database";

export type VideoGenerationSettings = {
	model: "sora-2" | "sora-2-pro";
	resolution: "1280x720" | "720x1280";
	duration: "4" | "8" | "12";
};

interface VideoSettingsProps {
	onSettingsChange: (settings: VideoGenerationSettings) => void;
}

const MODEL_OPTIONS: Array<{
	value: VideoGenerationSettings["model"];
	label: string;
	description: string;
	subLabel: string;
}> = [
	{
		value: "sora-2",
		label: "Sora 2 Standard",
		description: "Fast and light.",
		subLabel: "720p clip",
	},
	{
		value: "sora-2-pro",
		label: "Sora 2 Pro",
		description: "Max detail.",
		subLabel: "1080p clip",
	},
];

const RESOLUTION_OPTIONS: Array<{
	value: VideoGenerationSettings["resolution"];
	label: string;
	description: string;
}> = [
	{
		value: "1280x720",
		label: "Landscape 16:9",
		description: "Wide feed.",
	},
	{
		value: "720x1280",
		label: "Portrait 9:16",
		description: "Vertical feed.",
	},
];

const DURATION_OPTIONS: Array<{
	value: VideoGenerationSettings["duration"];
	label: string;
	description: string;
}> = [
	{ value: "4", label: "4 seconds", description: "Quick peek." },
	{
		value: "8",
		label: "8 seconds",
		description: "Short story.",
	},
	{
		value: "12",
		label: "12 seconds",
		description: "Full beat.",
	},
];

export default function VideoSettings({ onSettingsChange }: VideoSettingsProps) {
	const [settings, setSettings] = useState<VideoGenerationSettings>({
		model: "sora-2",
		resolution: "1280x720",
		duration: "4",
	});

	const creditsRequired = useMemo(() => {
		const durationKey = Number.parseInt(settings.duration, 10) as 4 | 8 | 12;
		return CREDIT_COSTS[settings.model][durationKey];
	}, [settings.duration, settings.model]);

	const handleChange = <K extends keyof VideoGenerationSettings>(
		key: K,
		value: VideoGenerationSettings[K],
	) => {
		const next = { ...settings, [key]: value };
		setSettings(next);
		onSettingsChange(next);
	};

	return (
		<div className="rounded-3xl border border-[#FA4616]/20 bg-[#141212] p-6">
			<div className="space-y-1">
				<h2 className="text-xl font-bold text-[#FCF6F5]">Settings</h2>
				<p className="text-sm text-[#FCF6F5]/70">Configure your video</p>
			</div>

			<section className="mt-6 space-y-3">
				<h3 className="text-xs font-bold uppercase tracking-wider text-[#FA4616]">
					Model Quality
				</h3>
				<div className="grid gap-2 sm:grid-cols-2">
					{MODEL_OPTIONS.map((option) => {
						const isActive = settings.model === option.value;
						return (
							<button
								type="button"
								key={option.value}
								onClick={() => handleChange("model", option.value)}
								aria-pressed={isActive}
								className={`rounded-2xl border px-4 py-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-[#FA4616]/40 ${
									isActive
										? "border-[#FA4616] bg-[#FA4616]/10"
										: "border-[#FA4616]/20 bg-[#141212]/50 hover:border-[#FA4616]/40"
								}`}
							>
								<p className="font-bold text-[#FCF6F5]">{option.label}</p>
								<p className="mt-1 text-xs text-[#FCF6F5]/70">
									{option.description}
								</p>
								<p className="mt-2 text-[11px] text-[#FCF6F5]/50">
									{option.subLabel}
								</p>
							</button>
						);
					})}
				</div>
			</section>

			<section className="mt-6 space-y-3">
				<h3 className="text-xs font-bold uppercase tracking-wider text-[#FA4616]">
					Aspect Ratio
				</h3>
				<div className="grid gap-2 sm:grid-cols-2">
					{RESOLUTION_OPTIONS.map((option) => {
						const isActive = settings.resolution === option.value;
						return (
							<button
								type="button"
								key={option.value}
								onClick={() => handleChange("resolution", option.value)}
								aria-pressed={isActive}
								className={`rounded-2xl border px-4 py-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-[#FA4616]/40 ${
									isActive
										? "border-[#FA4616] bg-[#FA4616]/10"
										: "border-[#FA4616]/20 bg-[#141212]/50 hover:border-[#FA4616]/40"
								}`}
							>
								<p className="font-bold text-[#FCF6F5]">{option.label}</p>
								<p className="mt-1 text-xs text-[#FCF6F5]/70">
									{option.description}
								</p>
							</button>
						);
					})}
				</div>
			</section>

			<section className="mt-6 space-y-3">
				<h3 className="text-xs font-bold uppercase tracking-wider text-[#FA4616]">
					Clip Length
				</h3>
				<div className="grid gap-2 sm:grid-cols-3">
					{DURATION_OPTIONS.map((option) => {
						const isActive = settings.duration === option.value;
						return (
							<button
								type="button"
								key={option.value}
								onClick={() => handleChange("duration", option.value)}
								aria-pressed={isActive}
								className={`rounded-2xl border px-3 py-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-[#FA4616]/40 ${
									isActive
										? "border-[#FA4616] bg-[#FA4616]/10"
										: "border-[#FA4616]/20 bg-[#141212]/50 hover:border-[#FA4616]/40"
								}`}
							>
								<p className="font-bold text-[#FCF6F5]">{option.label}</p>
								<p className="mt-1 text-xs text-[#FCF6F5]/70">
									{option.description}
								</p>
							</button>
						);
					})}
				</div>
			</section>

			<div className="mt-6 rounded-2xl border border-[#FA4616]/40 bg-[#FA4616]/10 px-4 py-3 text-sm text-[#FCF6F5]">
				<strong className="font-bold text-[#FA4616]">{creditsRequired} credits</strong>{" "}
				estimated for this render
			</div>
		</div>
	);
}
