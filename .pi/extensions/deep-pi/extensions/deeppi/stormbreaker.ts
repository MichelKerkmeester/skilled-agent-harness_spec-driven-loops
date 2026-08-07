/**
 * Storm-breaker module — batch-aware retry economy.
 *
 * Collects every tool call in a turn as a batch, then escalates only when
 * the *whole* batch fails repeatedly: a guard on the third equivalent
 * all-failed batch, an abort on the fourth. Any success resets both streaks.
 */
import type {
	ExtensionAPI,
	ExtensionContext,
	ToolResultEvent,
} from "@earendil-works/pi-coding-agent";
import { enhanceError, errorSignature, extractErrorText } from "./utils.js";

// ─────────────────────────────────────────────────────────────────────────────
// New batch-aware implementation (Task 4)
// ─────────────────────────────────────────────────────────────────────────────

export interface ExpectedToolCall { id: string; name: string }
export interface ToolOutcome extends ExpectedToolCall { isError: boolean; text: string }
export type StormDecision =
	| { kind: "pending" | "none" }
	| { kind: "guard" | "abort"; message: string };

export interface StormBreakerState {
	expected: ExpectedToolCall[];
	outcomes: Map<string, ToolOutcome>;
	lastSignature: string | null;
	repeatCount: number;
	blockedTurnStreak: number;
	guardsInjected: number;
	loopsAborted: number;
	errorsEnhanced: number;
}

export function createStormBreakerState(): StormBreakerState {
	return {
		expected: [], outcomes: new Map(), lastSignature: null, repeatCount: 0,
		blockedTurnStreak: 0, guardsInjected: 0, loopsAborted: 0, errorsEnhanced: 0,
	};
}

export function resetStormBreaker(state: StormBreakerState): void {
	state.expected = [];
	state.outcomes = new Map();
	state.lastSignature = null;
	state.repeatCount = 0;
	state.blockedTurnStreak = 0;
	state.guardsInjected = 0;
	state.loopsAborted = 0;
	state.errorsEnhanced = 0;
}

export function startToolBatch(state: StormBreakerState, calls: ExpectedToolCall[]): void {
	state.expected = calls;
	state.outcomes = new Map();
}

export function recordToolOutcome(
	state: StormBreakerState,
	outcome: ToolOutcome,
): StormDecision {
	if (!state.expected.some((call) => call.id === outcome.id)) return { kind: "none" };
	state.outcomes.set(outcome.id, outcome);
	if (state.outcomes.size < state.expected.length) return { kind: "pending" };
	const ordered = state.expected.map((call) => state.outcomes.get(call.id)!);
	state.expected = [];
	state.outcomes = new Map();
	if (ordered.some((value) => !value.isError)) {
		state.lastSignature = null;
		state.repeatCount = 0;
		state.blockedTurnStreak = 0;
		return { kind: "none" };
	}
	const signature = batchSignatureFromOutcomes(ordered);
	state.repeatCount = state.lastSignature === signature ? state.repeatCount + 1 : 1;
	state.lastSignature = signature;
	state.blockedTurnStreak++;
	const level = Math.max(state.repeatCount, state.blockedTurnStreak);
	const lastError = ordered.at(-1)!.text.slice(0, 300);
	if (level === 3) {
		state.guardsInjected++;
		return {
			kind: "guard",
			message: `[loop guard] Every tool call in this batch failed repeatedly. Change arguments, use another tool, or report the blocker. Last error: ${lastError}`,
		};
	}
	if (level >= 4) {
		state.loopsAborted++;
		return { kind: "abort", message: `DeepPi stopped a repeated failed tool batch. Last error: ${lastError}` };
	}
	return { kind: "none" };
}

function batchSignatureFromOutcomes(outcomes: ToolOutcome[]): string {
	return outcomes.map((outcome) =>
		`${outcome.name}\0${errorSignature(outcome.name, outcome.text)}`,
	).join("\0\0");
}

export function toolCallsFromMessage(message: unknown): ExpectedToolCall[] {
	const value = message as { role?: unknown; content?: unknown } | undefined;
	if (value?.role !== "assistant" || !Array.isArray(value.content)) return [];
	return value.content.flatMap((block) => {
		const call = block as { type?: unknown; id?: unknown; name?: unknown };
		return call.type === "toolCall" && typeof call.id === "string" && typeof call.name === "string"
			? [{ id: call.id, name: call.name }]
			: [];
	});
}

export function registerStormBreaker(
	pi: ExtensionAPI,
	state: StormBreakerState,
	eligible: (model: { provider: string; id: string } | undefined) => boolean,
): StormBreakerState {
	pi.on("message_end", async (event, ctx) => {
		if (!eligible(ctx.model)) return;
		const message = event.message as { role?: unknown } | undefined;
		// Pi emits message_start/message_end for EVERY message — including
		// tool-result messages (role "toolResult", see agent-loop.ts
		// emitToolResultMessage) and user turns. Only assistant turns carry
		// tool calls or end a blocked streak; ignoring everything else keeps a
		// tool-result's message_end from resetting the streak mid-batch.
		if (message?.role !== "assistant") return;
		const calls = toolCallsFromMessage(event.message);
		if (calls.length > 0) {
			startToolBatch(state, calls);
		} else {
			// The assistant moved on without calling any tools — the blocked
			// streak is over. A later all-failed batch starts a fresh streak.
			state.expected = [];
			state.outcomes = new Map();
			state.lastSignature = null;
			state.repeatCount = 0;
			state.blockedTurnStreak = 0;
		}
	});

	pi.on("tool_result", async (event, ctx) => {
		if (!eligible(ctx.model)) return;
		const raw = extractErrorText(event.content);
		const text = event.isError ? enhanceError(event.toolName, raw) : raw;
		if (text !== raw) state.errorsEnhanced++;
		const decision = recordToolOutcome(state, {
			id: event.toolCallId,
			name: event.toolName,
			isError: event.isError,
			text,
		});
		if (decision.kind === "guard") {
			return { content: [{ type: "text" as const, text: `${text}\n\n${decision.message}` }] };
		}
		if (decision.kind === "abort") {
			ctx.abort();
			ctx.ui.notify(decision.message, "warning");
		}
		if (event.isError && text !== raw) {
			return { content: [{ type: "text" as const, text }] };
		}
	});

	return state;
}
