// ───────────────────────────────────────────────────────────────────
// MODULE: DeepPi Stability Controls
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';

import type { ExtensionAPI, ExtensionContext } from '@earendil-works/pi-coding-agent';
import type { DeepPiModelId } from './eligibility.js';

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

type ContentBlock = Record<string, unknown> & { type?: string };

interface MessageLike {
  role?: unknown;
  content?: unknown;
}

/** Mutable state used to freeze generated timestamp lines across requests. */
export interface TimestampState {
  frozenLines: Map<string, string>;
}

/** Reasons a provider prefix can change between requests. */
export type PrefixChurnReason =
  | 'model'
  | 'system-prompt'
  | 'tool-schema'
  | 'conversation-history';

/** Digests used to identify changes in the provider request prefix. */
export interface PrefixShape {
  modelId: DeepPiModelId;
  systemDigest: string;
  toolsDigest: string;
  messageDigests: string[];
}

/** Mutable counters and snapshots maintained by the stability hooks. */
export interface StabilityState extends TimestampState {
  previousShape: PrefixShape | null;
  latestChurn: PrefixChurnReason[];
  prunedThinking: number;
  preservedThinking: number;
  transformErrors: number;
}

// ───────────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const GENERATED_TIME_LINE =
  /^(Current date\/time is:|Current date and time is:|Today is:|Date:|Time:)[^\n]*$/gim;
const GENERATED_DATE_LINE = new RegExp(
  '^Date:\\s*' +
    '(\\d{4}[-/]\\d{1,2}[-/]\\d{1,2}|' +
    '[A-Z][a-z]{2,9}\\s+\\d{1,2}(?:st|nd|rd|th)?,?\\s+\\d{4})',
  'i',
);

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────

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
  if (normalized === 'date:') {
    return GENERATED_DATE_LINE.test(line);
  }
  if (normalized === 'time:') {
    return /^Time:\s*\d{1,2}:\d{2}/i.test(line);
  }
  return true;
}

function digest(value: unknown): string {
  return createHash('sha256').update(JSON.stringify(value) ?? 'undefined').digest('hex');
}

function toolName(value: unknown): string {
  // Provider tool entries are objects with one of these optional name locations.
  const tool = value as { name?: unknown; function?: { name?: unknown } } | undefined;
  const name = tool?.function?.name ?? tool?.name;
  return typeof name === 'string' ? name : '';
}

// ───────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/**
 * Remove thinking blocks from assistant messages that contain no tool call.
 *
 * @typeParam T - Message shape preserved in the returned array.
 * @param messages - Messages to stabilize.
 * @returns Stabilized messages and counts of pruned and preserved thinking blocks.
 */
export function stabilizeMessages<T extends MessageLike>(messages: readonly T[]): {
  messages: T[];
  prunedThinking: number;
  preservedThinking: number;
} {
  let prunedThinking = 0;
  let preservedThinking = 0;
  const stabilized = messages.map((message) => {
    if (message.role !== 'assistant' || !Array.isArray(message.content)) return message;
    // Pi's message contract supplies object content blocks when content is an array.
    const blocks = message.content as ContentBlock[];
    const hasToolCall = blocks.some((block) => block.type === 'toolCall');
    if (hasToolCall) {
      preservedThinking += blocks.filter((block) => block.type === 'thinking').length;
      return message;
    }
    const content = blocks.filter((block) => {
      if (block.type !== 'thinking') return true;
      prunedThinking++;
      return false;
    });
    return { ...message, content };
  });
  return { messages: stabilized, prunedThinking, preservedThinking };
}

/**
 * Freeze generated timestamp lines after their first observed value.
 *
 * @param prompt - Prompt text that may contain generated timestamp lines.
 * @param state - Mutable timestamp state shared across requests.
 * @returns Prompt text with repeated generated timestamps replaced by their first value.
 */
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

/** Sort provider tools by name so equivalent requests share a stable prefix. */
export function sortProviderTools(payload: Record<string, unknown>): boolean {
  if (!Array.isArray(payload.tools)) return false;
  const sorted = [...payload.tools].sort((left, right) =>
    toolName(left).localeCompare(toolName(right))
  );
  payload.tools = sorted;
  return true;
}

/**
 * Capture the request-prefix digests used to detect provider cache churn.
 *
 * @param modelId - DeepPi model identifier associated with the request.
 * @param payload - Provider request payload to inspect.
 * @returns Prefix shape containing the model, system, tool, and conversation digests.
 */
export function capturePrefixShape(
  modelId: DeepPiModelId,
  payload: Record<string, unknown>,
): PrefixShape {
  const messages = Array.isArray(payload.messages) ? payload.messages : [];
  const system = messages.find((value) => {
    // Provider message entries expose an optional role field used for prefix partitioning.
    const role = (value as { role?: unknown })?.role;
    return role === 'system' || role === 'developer';
  });
  const conversation = messages.filter((value) => {
    // Provider message entries expose an optional role field used for prefix partitioning.
    const role = (value as { role?: unknown })?.role;
    return role !== 'system' && role !== 'developer';
  });
  return {
    modelId,
    systemDigest: digest(system ?? null),
    toolsDigest: digest(Array.isArray(payload.tools) ? payload.tools : []),
    messageDigests: conversation.map(digest),
  };
}

/**
 * Classify the parts of a provider prefix that changed between requests.
 *
 * @param previous - Previously captured prefix shape.
 * @param current - Current prefix shape.
 * @returns Churn reasons in stable classification order.
 */
export function classifyPrefixChurn(
  previous: PrefixShape,
  current: PrefixShape,
): PrefixChurnReason[] {
  const reasons: PrefixChurnReason[] = [];
  if (previous.modelId !== current.modelId) reasons.push('model');
  if (previous.systemDigest !== current.systemDigest) reasons.push('system-prompt');
  if (previous.toolsDigest !== current.toolsDigest) reasons.push('tool-schema');
  const historyChanged = previous.messageDigests.length > current.messageDigests.length ||
    previous.messageDigests.some((value, index) => current.messageDigests[index] !== value);
  if (historyChanged) reasons.push('conversation-history');
  return reasons;
}

/** Create empty mutable state for the stability hooks. */
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

/**
 * Register context, prompt, and provider-request stability hooks.
 *
 * @param pi - Extension API used to register hooks.
 * @param state - Mutable stability state updated by the hooks.
 * @param eligible - Predicate identifying models that may use the hooks.
 */
export function registerStabilityHooks(
  pi: ExtensionAPI,
  state: StabilityState,
  eligible: (model: { provider: string; id: string } | undefined) => boolean,
): void {
  pi.on('context', async (event, ctx: ExtensionContext) => {
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

  pi.on('before_agent_start', async (event, ctx: ExtensionContext) => {
    if (!eligible(ctx.model)) return;
    try {
      const systemPrompt = freezeSessionTimestamps(event.systemPrompt, state);
      return { systemPrompt };
    } catch {
      state.transformErrors++;
    }
  });

  pi.on('before_provider_request', async (event, ctx) => {
    // The eligibility predicate narrows the active SDK model to a supported DeepPi identifier.
    const model = ctx.model as { provider: string; id: DeepPiModelId } | undefined;
    if (!model || !eligible(model)) return;
    try {
      // The provider payload is a structured-cloneable record mutated only through known keys.
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
