// ───────────────────────────────────────────────────────────────────
// MODULE: CLI-Output Stream Capture Registry and Orchestrator
// ───────────────────────────────────────────────────────────────────

import { deepFreeze } from '../fidelity/freeze.js';
import { resolveWrapperRuntime } from './registry.js';
import { runWrapperProjection } from './run.js';
import { claudeStreamParser } from './stream-parsers/claude.js';
import { codexStreamParser } from './stream-parsers/codex.js';
import { cursorStreamParser } from './stream-parsers/cursor.js';
import { devinStreamParser } from './stream-parsers/devin.js';
import { piStreamParser } from './stream-parsers/pi.js';

import type { RuntimeId } from '../contracts/common.js';
import type {
  RuntimeStreamParseInput,
  RuntimeStreamParseResult,
  RuntimeStreamParser,
} from './stream-types.js';
import type {
  WrapperProjectionConfig,
  WrapperRunReasonCode,
  WrapperRunResult,
  WrapperRuntimeId,
} from './types.js';

/** Per-runtime raw-stream parsers, one for each wrapper-target runtime. */
const STREAM_PARSERS: Readonly<Record<WrapperRuntimeId, RuntimeStreamParser>> = deepFreeze({
  claude: claudeStreamParser,
  codex: codexStreamParser,
  cursor: cursorStreamParser,
  devin: devinStreamParser,
  pi: piStreamParser,
});

/** Resolve a stream parser for a runtime, or null when the runtime is incapable. */
export function resolveStreamParser(runtimeId: RuntimeId): RuntimeStreamParser | null {
  if (runtimeId === 'opencode') {
    return null;
  }
  return STREAM_PARSERS[runtimeId] ?? null;
}

/** Every runtime with a registered stream parser, in registry order. */
export function listStreamParsers(): readonly WrapperRuntimeId[] {
  return Object.freeze(Object.keys(STREAM_PARSERS) as WrapperRuntimeId[]);
}

/**
 * Parse a raw captured CLI stream through the runtime's parser, or null when
 * the runtime is incapable or undeclared.
 */
export function parseRuntimeStream(
  runtimeId: RuntimeId,
  input: RuntimeStreamParseInput,
): RuntimeStreamParseResult | null {
  return resolveStreamParser(runtimeId)?.parse(input) ?? null;
}

/**
 * Run the full capture-project-render pipeline for one raw CLI stream: parse
 * the captured text through the runtime's parser, then feed the extracted
 * assistant message through the shared wrapper projection. An unparsed stream
 * or an incapable runtime passes the raw captured text through byte-exactly.
 */
export async function projectRuntimeStream(
  runtimeId: RuntimeId,
  input: RuntimeStreamParseInput,
  config: WrapperProjectionConfig,
  signal?: AbortSignal,
): Promise<WrapperRunResult> {
  const plan = resolveWrapperRuntime(runtimeId);
  if (plan === null) {
    return rawOriginal(input.capturedText, 'runtime-incapable');
  }
  const parser = resolveStreamParser(runtimeId);
  if (parser === null) {
    return rawOriginal(input.capturedText, 'runtime-incapable');
  }
  const parsed = parser.parse(input);
  if (parsed.status === 'unparsed') {
    return rawOriginal(input.capturedText, parsed.reasonCode);
  }
  return runWrapperProjection(plan.adapter, parsed.original, parsed.envelopes, config, signal);
}

function rawOriginal(text: string, reasonCode: WrapperRunReasonCode): WrapperRunResult {
  return deepFreeze({ status: 'exact-original', text, reasonCode });
}
