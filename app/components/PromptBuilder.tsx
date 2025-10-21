// app/components/PromptBuilder.tsx
"use client";

import { useMemo, useState } from "react";

export type PromptChangePayload = {
	promptText: string;
	jsonPrompt?: Record<string, unknown> | null;
};

interface PromptBuilderProps {
	onPromptChange: (payload: PromptChangePayload) => void;
}

type PromptMode = "simple" | "json";

interface PromptTemplate {
	id: string;
	name: string;
	tagline: string;
	promptText: string;
	jsonStructure: Record<string, unknown>;
}

const PROMPT_TEMPLATES: PromptTemplate[] = [
	{
		id: "cinematic",
				name: "City hero shot",
				tagline: "Futuristic skyline vibes.",
				promptText:
				"A lone explorer crosses a futuristic rooftop at golden hour with neon holograms glowing behind them.",
		jsonStructure: {
			scene: {
				subject: "Futuristic explorer on rooftop",
				environment: "Neon skyline at sunset",
				objects: ["holograms", "glass towers", "hovering drones"],
				composition: "Wide establishing shot",
			},
			camera: {
				angle: "Low angle",
				movement: "Slow dolly forward",
				lens: "35mm anamorphic",
				focus: "Explorer sharp, skyline soft",
			},
			motion: {
				primary: "Explorer walking with purpose",
				secondary: "Neon signs flicker",
				tertiary: "Particles drifting in sunlight",
				pace: "Steady cinematic pacing",
			},
			lighting: {
				source: "Setting sun",
				direction: "Backlit with rim highlights",
				quality: "Soft haze",
				color_temperature: "Warm with cyan accents",
				mood: "Hopeful and cinematic",
			},
			timeline: {
				"0-4s": "Reveal skyline and explorer silhouette",
				"4-8s": "Camera glides past explorer, neon reflects",
				"8-12s": "Hold on explorer as drones pass",
			},
		},
	},
	{
		id: "product",
				name: "Product glow-up",
				tagline: "Studio spin with shine.",
		promptText:
			"A premium wireless earbud on a stone plinth rotates in slow motion as soft light sweeps across the surface.",
		jsonStructure: {
			scene: {
				subject: "Matte black wireless earbud",
				environment: "Dark studio with floating light strips",
				objects: ["stone plinth", "floating dust"],
				composition: "Centered macro shot",
			},
			camera: {
				angle: "Macro close-up",
				movement: "360 orbit",
				lens: "85mm macro",
				focus: "Product sharp, background blurred",
			},
			motion: {
				primary: "Earbud rotating slowly",
				secondary: "Light sweep along edges",
				tertiary: "Dust particles drifting",
				pace: "Loopable and smooth",
			},
			lighting: {
				source: "Soft LED strips",
				direction: "Opposing rim lights with top fill",
				quality: "Diffused with glossy reflections",
				color_temperature: "Cool white with teal accents",
				mood: "Premium and refined",
			},
			timeline: {
				"0-4s": "Reveal hero angle with light sweep",
				"4-8s": "Macro detail shot",
				"8-12s": "Full silhouette with glow",
			},
		},
	},
	{
		id: "tutorial",
				name: "Creator desk",
				tagline: "Warm how-to scene.",
		promptText:
			"A creator at a warm desk explains how to storyboard ideas, pointing at sticky notes and a sketchbook.",
		jsonStructure: {
			scene: {
				subject: "Creator sketching ideas",
				environment: "Cozy studio desk",
				objects: ["sticky notes", "tablet", "coffee mug"],
				composition: "Three-quarter over-shoulder view",
			},
			camera: {
				angle: "Slight overhead",
				movement: "Slow push-in",
				lens: "28mm prime",
				focus: "Subject and desk items sharp",
			},
			motion: {
				primary: "Creator gesturing toward storyboard",
				secondary: "Sticky notes flipping",
				tertiary: "Ambient dust in sunlight",
				pace: "Energetic but calm",
			},
			lighting: {
				source: "Window light with softbox fill",
				direction: "Key from right, bounce from left",
				quality: "Soft and diffused",
				color_temperature: "Warm neutral",
				mood: "Welcoming and crafty",
			},
			timeline: {
				"0-4s": "Establish desk and subject",
				"4-8s": "Focus on storyboard notes",
				"8-12s": "Pull back to reveal final plan",
			},
		},
	},
];

export default function PromptBuilder({ onPromptChange }: PromptBuilderProps) {
	const [mode, setMode] = useState<PromptMode>("simple");
	const [simplePrompt, setSimplePrompt] = useState("");
	const [jsonValue, setJsonValue] = useState(
		JSON.stringify(PROMPT_TEMPLATES[0]?.jsonStructure ?? {}, null, 2),
	);
	const [jsonPrompt, setJsonPrompt] = useState<Record<string, unknown> | null>(
		null,
	);
	const [jsonError, setJsonError] = useState<string | null>(null);
	const [isEnhancing, setIsEnhancing] = useState(false);
	const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

	const characterCount = useMemo(() => simplePrompt.trim().length, [simplePrompt]);

	const notifyParent = (next: {
		promptText?: string;
		json?: Record<string, unknown> | null;
	}) => {
		const promptText =
			next.promptText ??
			(simplePrompt.trim().length > 0
				? simplePrompt
				: "Generated JSON prompt");

		const payload: PromptChangePayload = {
			promptText,
		};

		if (next.json !== undefined) {
			payload.jsonPrompt = next.json;
		} else if (jsonPrompt) {
			payload.jsonPrompt = jsonPrompt;
		}

		onPromptChange(payload);
	};

	const handleSimpleChange = (value: string) => {
		setSimplePrompt(value);
		notifyParent({ promptText: value });
	};

	const handleJsonChange = (value: string) => {
		setJsonValue(value);

		try {
			const parsed = JSON.parse(value);
			setJsonPrompt(parsed);
			setJsonError(null);
			notifyParent({ json: parsed });
		} catch {
			setJsonPrompt(null);
			setJsonError("Invalid JSON format. Finish editing to validate.");
			notifyParent({ json: null });
		}
	};

	const handleTemplateSelect = (template: PromptTemplate) => {
		setActiveTemplate(template.id);
		setMode("json");
		setSimplePrompt(template.promptText);

		const formattedJson = JSON.stringify(template.jsonStructure, null, 2);
		setJsonValue(formattedJson);
		setJsonPrompt(template.jsonStructure);
		setJsonError(null);

		onPromptChange({
			promptText: template.promptText,
			jsonPrompt: template.jsonStructure,
		});
	};

	const enhancePromptWithAI = async () => {
		if (!simplePrompt.trim()) {
			setJsonError("Add a natural language prompt before enhancing.");
			return;
		}

		try {
			setIsEnhancing(true);
			setJsonError(null);

			const response = await fetch("/api/enhance-prompt", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ prompt: simplePrompt.trim() }),
			});

			const data = await response.json();
			if (!response.ok || !data.success) {
				throw new Error(data.error ?? "Failed to enhance prompt");
			}

			const enhancedJson = data.jsonPrompt as Record<string, unknown>;
			setMode("json");
			setJsonPrompt(enhancedJson);
			setJsonValue(JSON.stringify(enhancedJson, null, 2));
			setJsonError(null);

			onPromptChange({
				promptText: simplePrompt.trim(),
				jsonPrompt: enhancedJson,
			});
		} catch (error) {
			setJsonError(
				error instanceof Error ? error.message : "Unable to enhance prompt.",
			);
		} finally {
			setIsEnhancing(false);
		}
	};

	return (
		<div className="rounded-3xl border border-[#FA4616]/20 bg-[#141212] p-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="text-xl font-bold text-[#FCF6F5]">Prompt</h2>
					<p className="text-sm text-[#FCF6F5]/70">Describe what you want to see</p>
				</div>
				<div className="inline-flex rounded-full border border-[#FA4616]/30 bg-[#FA4616]/10 p-1 text-xs font-semibold">
					<button
						type="button"
						onClick={() => setMode("simple")}
						className={`rounded-full px-4 py-1.5 transition ${
							mode === "simple"
								? "bg-[#FA4616] text-[#141212] shadow-lg"
								: "text-[#FCF6F5]/70 hover:text-[#FCF6F5]"
						}`}
						aria-pressed={mode === "simple"}
					>
						Simple
					</button>
					<button
						type="button"
						onClick={() => setMode("json")}
						className={`rounded-full px-4 py-1.5 transition ${
							mode === "json"
								? "bg-[#FA4616] text-[#141212] shadow-lg"
								: "text-[#FCF6F5]/70 hover:text-[#FCF6F5]"
						}`}
						aria-pressed={mode === "json"}
					>
						JSON
					</button>
				</div>
			</div>

            {mode === "simple" ? (
                <div className="mt-6 space-y-4">
                    <textarea
                        value={simplePrompt}
                        onChange={(event) => handleSimpleChange(event.target.value)}
                        placeholder="Example: a futuristic explorer on a rooftop at golden hour with neon holograms"
                        rows={5}
                        className="w-full rounded-2xl border border-[#FA4616]/20 bg-[#141212]/50 p-4 text-base text-[#FCF6F5] placeholder:text-[#FCF6F5]/40 focus:border-[#FA4616] focus:outline-none focus:ring-2 focus:ring-[#FA4616]/30"
                    />

					<div className="flex flex-wrap items-center justify-between gap-3">
						<span className="text-xs text-[#FCF6F5]/50">{characterCount} characters</span>
						<button
							type="button"
							onClick={enhancePromptWithAI}
							disabled={isEnhancing}
							className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FA4616] px-5 py-2 text-xs font-bold text-[#141212] shadow-lg hover:bg-[#FA4616]/90 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{isEnhancing ? "Working…" : "Auto Build JSON"}
						</button>
					</div>
				</div>
			) : (
                <div className="mt-6 space-y-3">
                    <textarea
                        value={jsonValue}
                        onChange={(event) => handleJsonChange(event.target.value)}
                        spellCheck={false}
                        rows={12}
                        className="w-full rounded-2xl border border-[#FA4616]/20 bg-[#141212]/50 p-4 font-mono text-sm text-[#FCF6F5] focus:border-[#FA4616] focus:outline-none focus:ring-2 focus:ring-[#FA4616]/30"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs text-[#FCF6F5]/50">Keep sections tidy: scene, camera, motion, lighting, timeline</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(jsonValue).catch(() => {});
                          }}
                          className="inline-flex items-center justify-center rounded-full bg-[#FA4616] px-4 py-2 text-xs font-bold text-[#141212] shadow-lg hover:bg-[#FA4616]/90"
                        >
                          Copy JSON
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const blob = new Blob([jsonValue], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'sora_prompt.json';
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            URL.revokeObjectURL(url);
                          }}
                          className="inline-flex items-center justify-center rounded-full border border-[#FA4616]/40 px-4 py-2 text-xs font-bold text-[#FA4616] hover:bg-[#FA4616]/10"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                </div>
            )}

			{jsonError && (
				<p className="mt-4 rounded-2xl border border-[#FA4616]/40 bg-[#FA4616]/10 px-4 py-3 text-sm text-[#FA4616]">
					{jsonError}
				</p>
			)}

			<div className="mt-8 space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-sm font-bold uppercase tracking-wider text-[#FA4616]">
						Quick Start Templates
					</h3>
					<span className="text-xs text-[#FCF6F5]/50">
						Tap to load
					</span>
				</div>

				<div className="grid gap-3 sm:grid-cols-3">
					{PROMPT_TEMPLATES.map((template) => {
						const isActive = activeTemplate === template.id;

						return (
							<button
								type="button"
								key={template.id}
								onClick={() => handleTemplateSelect(template)}
								className={`rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-[#FA4616]/40 ${
									isActive
										? "border-[#FA4616] bg-[#FA4616]/10"
										: "border-[#FA4616]/20 bg-[#141212]/50 hover:border-[#FA4616]/40"
								}`}
							>
								<p className="text-sm font-bold text-[#FCF6F5]">
									{template.name}
								</p>
								<p className="mt-2 text-xs text-[#FCF6F5]/70">{template.tagline}</p>
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
