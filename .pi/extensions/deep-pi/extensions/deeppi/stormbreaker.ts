// ───────────────────────────────────────────────────────────────────
// MODULE: DeepPi Storm Breaker
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { enhanceError, errorSignature, extractErrorText } from './utils.js';

import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';

/**
 * Storm-breaker collects tool calls as batches and escalates only when the
 * whole batch fails repeatedly. Any successful call resets both streaks.
 */

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Tool call expected to produce an outcome in the current batch. */
export interface ExpectedToolCall {
  id: string;
  name: string;
}

/** Result recorded for one expected tool call. */
export interface ToolOutcome extends ExpectedToolCall {
  isError: boolean;
  text: string;
}

/** Decision returned after a tool outcome completes or advances a batch. */
export type StormDecision =
  | { kind: 'pending' | 'none' }
  | { kind: 'guard' | 'abort'; message: string };

/** Mutable counters and in-flight outcomes used by the storm breaker. */
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

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function batchSignatureFromOutcomes(outcomes: ToolOutcome[]): string {
  return outcomes.map((outcome) => `${outcome.name}\0${errorSignature(outcome.name, outcome.text)}`)
    .join('\0\0');
}

/** Extract assistant tool calls from a message-shaped value. */
export function toolCallsFromMessage(message: unknown): ExpectedToolCall[] {
  // Pi message-end events carry a message object when the assistant produced output.
  const value = message as { role?: unknown; content?: unknown } | undefined;
  if (value?.role !== 'assistant' || !Array.isArray(value.content)) return [];
  return value.content.flatMap((block) => {
    // Assistant content blocks expose the tagged fields inspected below.
    const call = block as { type?: unknown; id?: unknown; name?: unknown };
    return call.type === 'toolCall' && typeof call.id === 'string' && typeof call.name === 'string'
      ? [{ id: call.id, name: call.name }]
      : [];
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/** Create empty mutable state for the storm breaker. */
export function createStormBreakerState(): StormBreakerState {
  return {
    expected: [],
    outcomes: new Map(),
    lastSignature: null,
    repeatCount: 0,
    blockedTurnStreak: 0,
    guardsInjected: 0,
    loopsAborted: 0,
    errorsEnhanced: 0,
  };
}

/** Reset counters and discard any in-flight tool batch. */
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

/**
 * Start tracking a new assistant tool-call batch.
 *
 * @param state - Mutable storm-breaker state.
 * @param calls - Tool calls expected to produce outcomes.
 */
export function startToolBatch(state: StormBreakerState, calls: ExpectedToolCall[]): void {
  state.expected = calls;
  state.outcomes = new Map();
}

/**
 * Record one tool result and escalate after repeated all-failed batches.
 *
 * @param state - Mutable storm-breaker state.
 * @param outcome - Result for one expected tool call.
 * @returns The guard, abort, pending, or no-op decision for the batch.
 */
export function recordToolOutcome(
  state: StormBreakerState,
  outcome: ToolOutcome,
): StormDecision {
  if (!state.expected.some((call) => call.id === outcome.id)) return { kind: 'none' };
  state.outcomes.set(outcome.id, outcome);
  if (state.outcomes.size < state.expected.length) return { kind: 'pending' };
  // The expected batch contains each call id once, so a size match means every lookup is defined.
  const ordered = state.expected.map((call) => state.outcomes.get(call.id)!);
  state.expected = [];
  state.outcomes = new Map();
  if (ordered.some((value) => !value.isError)) {
    state.lastSignature = null;
    state.repeatCount = 0;
    state.blockedTurnStreak = 0;
    return { kind: 'none' };
  }
  const signature = batchSignatureFromOutcomes(ordered);
  state.repeatCount = state.lastSignature === signature ? state.repeatCount + 1 : 1;
  state.lastSignature = signature;
  state.blockedTurnStreak++;
  const level = Math.max(state.repeatCount, state.blockedTurnStreak);
  // A completed all-failed batch is non-empty because batches start from assistant tool calls.
  const lastError = ordered.at(-1)!.text.slice(0, 300);
  if (level === 3) {
    state.guardsInjected++;
    return {
      kind: 'guard',
      message: `[loop guard] Every tool call in this batch failed repeatedly. ` +
        `Change arguments, use another tool, or report the blocker. Last error: ${lastError}`,
    };
  }
  if (level >= 4) {
    state.loopsAborted++;
    return {
      kind: 'abort',
      message: `DeepPi stopped a repeated failed tool batch. Last error: ${lastError}`,
    };
  }
  return { kind: 'none' };
}

/**
 * Register message and tool-result hooks for batch-aware retry escalation.
 *
 * @param pi - Extension API used to register hooks.
 * @param state - Mutable storm-breaker state.
 * @param eligible - Predicate identifying models that may use the breaker.
 * @returns The same mutable state object used by the hooks.
 */
export function registerStormBreaker(
  pi: ExtensionAPI,
  state: StormBreakerState,
  eligible: (model: { provider: string; id: string } | undefined) => boolean,
): StormBreakerState {
  pi.on('message_end', async (event, ctx) => {
    if (!eligible(ctx.model)) return;
    // The message-end event exposes a message object; only its role is needed
    // for turn classification.
    const message = event.message as { role?: unknown } | undefined;
    // Pi emits message_start/message_end for EVERY message — including
    // tool-result messages (role "toolResult", see agent-loop.ts
    // emitToolResultMessage) and user turns. Only assistant turns carry
    // tool calls or end a blocked streak; ignoring everything else keeps a
    // tool-result's message_end from resetting the streak mid-batch.
    if (message?.role !== 'assistant') return;
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

  pi.on('tool_result', async (event, ctx) => {
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
    if (decision.kind === 'guard') {
      return { content: [{ type: 'text' as const, text: `${text}\n\n${decision.message}` }] };
    }
    if (decision.kind === 'abort') {
      ctx.abort();
      ctx.ui.notify(decision.message, 'warning');
    }
    if (event.isError && text !== raw) {
      return { content: [{ type: 'text' as const, text }] };
    }
  });

  return state;
}
