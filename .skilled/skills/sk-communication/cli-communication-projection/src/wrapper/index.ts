// ───────────────────────────────────────────────────────────────────
// MODULE: CLI-Output Wrapper Public API
// ───────────────────────────────────────────────────────────────────

import { decodeExactOriginal } from '../contracts/exact-original.js';
import { deepFreeze } from '../fidelity/freeze.js';
import { resolveWrapperRuntime } from './registry.js';
import { runWrapperProjection } from './run.js';
import {
  listStreamParsers,
  parseRuntimeStream,
  projectRuntimeStream,
  resolveStreamParser,
} from './stream.js';

import type { ExactOriginalRecord } from '../contracts/exact-original.js';
import type { RuntimeId } from '../contracts/common.js';
import type { WrapperRunInput, WrapperRunResult } from './types.js';

export { listWrapperRuntimes, resolveWrapperLaunchMode, resolveWrapperRuntime } from './registry.js';
export { normalizeWrapperEnvelopes } from './normalize.js';
export { renderWrapperTerminal } from './render.js';
export { runWrapperProjection } from './run.js';
export {
  listStreamParsers,
  parseRuntimeStream,
  projectRuntimeStream,
  resolveStreamParser,
} from './stream.js';
export {
  buildStreamEnvelope,
  buildStreamOriginal,
} from './stream-types.js';

export { WrapperLaunchModes } from './types.js';

export type {
  NormalizedWrapperFallback,
  NormalizedWrapperMessage,
  NormalizeWrapperResult,
} from './normalize.js';
export type {
  CaptureFailureReason,
  WrapperExactOriginalResult,
  WrapperFallbackReason,
  WrapperLaunchMode,
  WrapperProjectionConfig,
  WrapperProjectionResult,
  WrapperRunReasonCode,
  WrapperRunResult,
  WrapperRuntimeId,
  WrapperRuntimePlan,
} from './types.js';
export type {
  CapturedRuntimeStream,
  RuntimeStreamParseInput,
  RuntimeStreamParseResult,
  RuntimeStreamParser,
  UnparsedRuntimeStream,
} from './stream-types.js';

/**
 * Parameterized wrapper entrypoint. Resolves the declared launch mode and
 * adapter for a runtime and runs the capture-normalize-project-render stage
 * order. A runtime without a declared adapter (the native-hook runtime or an
 * unknown id) passes the byte-exact original through.
 */
export async function runRuntimeWrapper(
  runtimeId: RuntimeId,
  input: WrapperRunInput,
): Promise<WrapperRunResult> {
  const plan = resolveWrapperRuntime(runtimeId);
  if (plan === null) {
    return deepFreeze({
      status: 'exact-original',
      text: decodeOriginalText(input.original),
      reasonCode: 'runtime-incapable',
    } as const);
  }
  return runWrapperProjection(
    plan.adapter,
    input.original,
    input.envelopes,
    input.config,
    input.signal,
  );
}

function decodeOriginalText(record: ExactOriginalRecord): string {
  const bytes = decodeExactOriginal(record);
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return new TextDecoder('utf-8').decode(bytes);
  }
}
