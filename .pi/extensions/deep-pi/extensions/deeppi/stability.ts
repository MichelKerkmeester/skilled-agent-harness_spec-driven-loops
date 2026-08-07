import { createHash } from "node:crypto";
import type { DeepPiModelId } from "./eligibility.js";

type ContentBlock = Record<string, unknown> & { type?: string };
type MessageLike = { role?: unknown; content?: unknown };

export interface TimestampState {
	frozenLines: Map<string, string>;
}

const GENERATED_TIME_LINE =
	/^(Current date\/time is:|Current date and time is:|Today is:|Date:|Time:)[^\n]*$/gim;

/**
 * A generated timestamp line must actually look like a date/time, not a
 * user-authored label that happens to start with `Date:`/`Time:` (e.g.
 * `Date: release-candidate-1`). The unambiguous prefixes
 * (`Current date...`, `Today is:`) are always generated lines.
 */
function isGeneratedTimestampLine(label: string, line: string): boolean {
	// GENERATED_TIME_LINE matches case-insensitively, so the captured label
	// can be "Date:" or "date:". Normalize before classification; otherwise
	// lowercase user labels (e.g. "date: release-candidate-1") fall through
	// to `return true` and get frozen as if they were generated timestamps.
	const normalized = label.trim().toLowerCase();
	if (normalized === "date:") {
		return /^Date:\s*(\d{4}[-/]\d{1,2}[-/]\d{1,2}|[A-Z][a-z]{2,9}\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4})/i
			.test(line);
	}
	if (normalized === "time:") {
		return /^Time:\s*\d{1,2}:\d{2}/i.test(line);
	}
	return true;
}

export function stabilizeMessages<T extends MessageLike>(messages: readonly T[]): {
	messages: T[];
	prunedThinking: number;
	preservedThinking: number;
} {
	let prunedThinking = 0;
	let preservedThinking = 0;
	const stabilized = messages.map((message) => {
		if (message.role !== "assistant" || !Array.isArray(message.content)) return message;
		const blocks = message.content as ContentBlock[];
		const hasToolCall = blocks.some((block) => block.type === "toolCall");
		if (hasToolCall) {
			preservedThinking += blocks.filter((block) => block.type === "thinking").length;
			return message;
		}
		const content = blocks.filter((block) => {
			if (block.type !== "thinking") return true;
			prunedThinking++;
			return false;
		});
		return { ...message, content };
	});
	return { messages: stabilized, prunedThinking, preservedThinking };
}

export function freezeSessionTimestamps(prompt: string, state: TimestampState): string {
	return prompt.replace(GENERATED_TIME_LINE, (line, label: string) => {
		if (!isGeneratedTimestampLine(label, line)) return line;
		const key = label.toLowerCase();
		const frozen = state.frozenLines.get(key);
		if (frozen) return frozen;
		state.frozenLines.set(key, line);
		return line;
	});
}

export type PrefixChurnReason =
	| "model"
	| "system-prompt"
	| "tool-schema"
	| "conversation-history";

export interface PrefixShape {
	modelId: DeepPiModelId;
	systemDigest: string;
	toolsDigest: string;
	messageDigests: string[];
}

function digest(value: unknown): string {
	return createHash("sha256").update(JSON.stringify(value) ?? "undefined").digest("hex");
}

function toolName(value: unknown): string {
	const tool = value as { name?: unknown; function?: { name?: unknown } } | undefined;
	const name = tool?.function?.name ?? tool?.name;
	return typeof name === "string" ? name : "";
}

export function sortProviderTools(payload: Record<string, unknown>): boolean {
	if (!Array.isArray(payload.tools)) return false;
	const sorted = [...payload.tools].sort((left, right) =>
		toolName(left).localeCompare(toolName(right)),
	);
	payload.tools = sorted;
	return true;
}

export function capturePrefixShape(
	modelId: DeepPiModelId,
	payload: Record<string, unknown>,
): PrefixShape {
	const messages = Array.isArray(payload.messages) ? payload.messages : [];
	const system = messages.find((value) => {
		const role = (value as { role?: unknown })?.role;
		return role === "system" || role === "developer";
	});
	const conversation = messages.filter((value) => {
		const role = (value as { role?: unknown })?.role;
		return role !== "system" && role !== "developer";
	});
	return {
		modelId,
		systemDigest: digest(system ?? null),
		toolsDigest: digest(Array.isArray(payload.tools) ? payload.tools : []),
		messageDigests: conversation.map(digest),
	};
}

export function classifyPrefixChurn(
	previous: PrefixShape,
	current: PrefixShape,
): PrefixChurnReason[] {
	const reasons: PrefixChurnReason[] = [];
	if (previous.modelId !== current.modelId) reasons.push("model");
	if (previous.systemDigest !== current.systemDigest) reasons.push("system-prompt");
	if (previous.toolsDigest !== current.toolsDigest) reasons.push("tool-schema");
	const historyChanged =
		previous.messageDigests.length > current.messageDigests.length ||
		previous.messageDigests.some((value, index) => current.messageDigests[index] !== value);
	if (historyChanged) reasons.push("conversation-history");
	return reasons;
}

export interface StabilityState extends TimestampState {
	previousShape: PrefixShape | null;
	latestChurn: PrefixChurnReason[];
	prunedThinking: number;
	preservedThinking: number;
	transformErrors: number;
}

export function createStabilityState(): StabilityState {
	return {
		frozenLines: new Map(),
		previousShape: null,
		latestChurn: [],
		prunedThinking: 0,
		preservedThinking: 0,
		transformErrors: 0,
	};
}

import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

export function registerStabilityHooks(
	pi: ExtensionAPI,
	state: StabilityState,
	eligible: (model: { provider: string; id: string } | undefined) => boolean,
): void {
	pi.on("context", async (event, ctx: ExtensionContext) => {
		if (!eligible(ctx.model)) return;
		try {
			const result = stabilizeMessages(event.messages);
			state.prunedThinking += result.prunedThinking;
			state.preservedThinking += result.preservedThinking;
			event.messages = result.messages;
			// Pi's context contract: hook return values are merged into the
			// context. Return the pruned messages so consumers reading
			// `result.messages` see the stabilized list, not just the mutation.
			return { messages: result.messages };
		} catch {
			state.transformErrors++;
		}
	});

	pi.on("before_agent_start", async (event, ctx: ExtensionContext) => {
		if (!eligible(ctx.model)) return;
		try {
			const systemPrompt = freezeSessionTimestamps(event.systemPrompt, state);
			return { systemPrompt };
		} catch {
			state.transformErrors++;
		}
	});

	pi.on("before_provider_request", async (event, ctx) => {
		const model = ctx.model as { provider: string; id: DeepPiModelId } | undefined;
		if (!model || !eligible(model)) return;
		try {
			const payload = structuredClone(event.payload) as Record<string, unknown>;
			sortProviderTools(payload);
			const shape = capturePrefixShape(model.id, payload);
			const churn = state.previousShape ? classifyPrefixChurn(state.previousShape, shape) : [];
			state.previousShape = shape;
			state.latestChurn = churn;
			return payload;
		} catch {
			state.transformErrors++;
		}
	});
}
