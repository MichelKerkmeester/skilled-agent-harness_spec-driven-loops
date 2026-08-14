// ───────────────────────────────────────────────────────────────────
// MODULE: Wrapper Envelope Normalization
// ───────────────────────────────────────────────────────────────────

import { mapRuntimeGeneration } from '../runtimes/adapter.js';

import type { ExactOriginalRecord } from '../contracts/exact-original.js';
import type {
  GenerationKey,
  IngestEventInput,
  StartGenerationInput,
} from '../core/assembly-types.js';
import type { RuntimeAdapter } from '../runtimes/adapter.js';
import type {
  RuntimeCanonicalState,
  RuntimeEnvelope,
} from '../runtimes/types.js';
import type { WrapperRunReasonCode } from './types.js';

/** Assembler-shaped generation and events ready for the entrypoint. */
export interface NormalizedWrapperMessage {
  readonly status: 'ready';
  readonly generation: StartGenerationInput;
  readonly events: readonly IngestEventInput[];
}

/** Byte-exact fallback when an envelope fails to normalize. */
export interface NormalizedWrapperFallback {
  readonly status: 'exact-original';
  readonly reasonCode: WrapperRunReasonCode;
}

/** Result of mapping captured envelopes into the assembler's event shape. */
export type NormalizeWrapperResult = NormalizedWrapperFallback | NormalizedWrapperMessage;

const CANONICAL_STATE_REVISION = '';

/**
 * Map captured runtime envelopes through the per-runtime adapter into the
 * assembler's event shape. The adapter is reused read-only; the captured
 * canonical bytes are never rewritten. Any unsupported, incompatible, or
 * terminal envelope resolves to the byte-exact original.
 */
export function normalizeWrapperEnvelopes(
  adapter: RuntimeAdapter<unknown>,
  original: ExactOriginalRecord,
  envelopes: readonly RuntimeEnvelope<unknown>[],
): NormalizeWrapperResult {
  if (envelopes.length === 0) {
    return { status: 'exact-original', reasonCode: 'incomplete-assembly' };
  }
  const firstEnvelope = envelopes[0];
  if (firstEnvelope === undefined) {
    return { status: 'exact-original', reasonCode: 'incomplete-assembly' };
  }

  const canonical: RuntimeCanonicalState = Object.freeze({
    exactOriginal: original,
    transcriptRevision: CANONICAL_STATE_REVISION,
    toolInputRevision: CANONICAL_STATE_REVISION,
    toolResultRevision: CANONICAL_STATE_REVISION,
    futureContextRevision: CANONICAL_STATE_REVISION,
  });

  const generationKey: GenerationKey = mapRuntimeGeneration({
    envelope: firstEnvelope,
    canonical,
  });

  const events: IngestEventInput[] = [];
  for (const [index, envelope] of envelopes.entries()) {
    let result;
    try {
      result = adapter.adapt({ envelope, canonical });
    } catch {
      return { status: 'exact-original', reasonCode: 'normalization-failed' };
    }
    if (result.status === 'exact-original') {
      return { status: 'exact-original', reasonCode: result.reasonCode };
    }
    events.push({
      key: result.generation,
      event: result.event,
      original,
      observedAtMs: observedAtMs(envelope, index),
    });
  }

  if (events.length === 0) {
    return { status: 'exact-original', reasonCode: 'incomplete-assembly' };
  }

  return Object.freeze({
    status: 'ready',
    generation: Object.freeze({
      key: generationKey,
      exactOriginal: original,
      startedAtMs: observedAtMs(firstEnvelope, 0),
    }),
    events: Object.freeze(events),
  });
}

function observedAtMs(envelope: RuntimeEnvelope<unknown>, index: number): number {
  const parsed = Date.parse(envelope.capturedAt);
  return Number.isFinite(parsed) ? parsed : index;
}
