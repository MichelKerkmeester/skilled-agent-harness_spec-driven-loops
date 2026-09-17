// ───────────────────────────────────────────────────────────────────
// MODULE: Wrapper Capture-Normalize-Project-Render Orchestrator
// ───────────────────────────────────────────────────────────────────

import { decodeExactOriginal } from '../contracts/exact-original.js';
import { isProjectionEnabled } from '../config/enablement.js';
import { deepFreeze } from '../fidelity/freeze.js';
import { projectMessage } from '../runtime/project-message.js';
import { normalizeWrapperEnvelopes } from './normalize.js';
import { renderWrapperTerminal } from './render.js';

import type { ExactOriginalRecord } from '../contracts/exact-original.js';
import type { RuntimeAdapter } from '../runtimes/adapter.js';
import type { RuntimeEnvelope } from '../runtimes/types.js';
import type {
  WrapperProjectionConfig,
  WrapperRunReasonCode,
  WrapperRunResult,
} from './types.js';

/**
 * Run the frozen stage order for one captured runtime stream: gate on the
 * shared enablement flag, normalize the captured envelopes through the
 * per-runtime adapter, feed the assembled message to the projection entrypoint,
 * and re-render the projected text or pass the byte-exact original through.
 * Every disabled, failed, or incapable terminal fails open to the original.
 */
export async function runWrapperProjection(
  adapter: RuntimeAdapter<unknown>,
  original: ExactOriginalRecord,
  envelopes: readonly RuntimeEnvelope<unknown>[],
  config: WrapperProjectionConfig,
  signal?: AbortSignal,
): Promise<WrapperRunResult> {
  if (!isProjectionEnabled()) {
    return exactOriginal(decodeOriginalText(original), 'projection-disabled');
  }
  if (signal?.aborted === true) {
    return exactOriginal(decodeOriginalText(original), 'cancelled');
  }

  const normalized = normalizeWrapperEnvelopes(adapter, original, envelopes);
  if (normalized.status === 'exact-original') {
    return exactOriginal(decodeOriginalText(original), normalized.reasonCode);
  }

  try {
    const result = await projectMessage({
      generation: normalized.generation,
      events: normalized.events,
      context: config.context,
      prompt: config.prompt,
      records: config.records,
      candidateProviderIds: config.candidateProviderIds,
      policy: config.policy,
      judgeMode: config.judgeMode,
      capabilities: config.capabilities,
      now: config.now,
      ...(config.transport !== undefined ? { transport: config.transport } : {}),
      ...(signal !== undefined ? { signal } : {}),
    });
    return renderWrapperTerminal(result);
  } catch {
    return exactOriginal(decodeOriginalText(original), 'wrapper-failure');
  }
}

function decodeOriginalText(record: ExactOriginalRecord): string {
  const bytes = decodeExactOriginal(record);
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return new TextDecoder('utf-8').decode(bytes);
  }
}

function exactOriginal(
  text: string,
  reasonCode: WrapperRunReasonCode,
): WrapperRunResult {
  return deepFreeze({ status: 'exact-original', text, reasonCode });
}
