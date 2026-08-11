// ───────────────────────────────────────────────────────────────────
// MODULE: Render Decision Types
// ───────────────────────────────────────────────────────────────────

import type { ExactOriginalRecord } from '../contracts/exact-original.js';
import type { FidelityOutcome } from '../fidelity/types.js';

/** Display modes that never mutate the canonical runtime message. */
export const RenderModes = {
  APPEND_AFTER_ORIGINAL: 'append-after-original',
  ATOMIC_REPLACE: 'atomic-replace',
  EXACT_ORIGINAL_ONLY: 'exact-original-only',
  SIDECAR: 'sidecar',
} as const;

/** One capability-aware display mode. */
export type RenderMode = typeof RenderModes[keyof typeof RenderModes];

/** Stable reasons for projection or exact-original selection. */
export const RenderReasonCodes = {
  INCOMPLETE_SOURCE: 'incomplete-source',
  INVALID_INPUT: 'invalid-input',
  ORIGINAL_SELECTED: 'original-selected',
  PROJECTION_ACCEPTED: 'projection-accepted',
  SOURCE_CHANGED: 'source-changed',
  UNSUPPORTED_MODE: 'unsupported-mode',
  VALIDATION_REJECTED: 'validation-rejected',
} as const;

/** One content-free render decision reason. */
export type RenderReasonCode =
  typeof RenderReasonCodes[keyof typeof RenderReasonCodes];

/** Runtime display capabilities observed for one render decision. */
export interface RenderCapabilities {
  readonly atomicReplace: boolean;
  readonly appendAfterOriginal: boolean;
  readonly sidecar: boolean;
}

/** Canonical source state required before a projection may render. */
export type RenderSourceTerminal =
  | 'cancelled'
  | 'completed'
  | 'error'
  | 'timeout';

/** Complete immutable input to one render decision. */
export interface RenderDecisionInput {
  readonly validation: FidelityOutcome;
  readonly currentSourceSha256: string;
  readonly sourceTerminal: RenderSourceTerminal;
  readonly allPartsComplete: boolean;
  readonly capabilities: RenderCapabilities;
  readonly preferredModes?: readonly RenderMode[];
}

interface RenderDecisionBase {
  readonly renderProfileVersion: 'render/1.0.0';
  readonly sourceSha256: string;
  readonly exactOriginal: ExactOriginalRecord;
  readonly projectionSha256: string | null;
  readonly projectionText: string | null;
}

/** Accepted projection paired with a runtime-supported presentation mode. */
export interface ProjectionRenderDecision extends RenderDecisionBase {
  readonly status: 'projection';
  readonly mode: Exclude<RenderMode, 'exact-original-only'>;
  readonly reasonCode: 'projection-accepted';
  readonly projectionSha256: string;
  readonly projectionText: string;
}

/** Exact stored bytes selected after a veto or explicit safe preference. */
export interface ExactOriginalRenderDecision extends RenderDecisionBase {
  readonly status: 'exact-original';
  readonly mode: 'exact-original-only';
  readonly reasonCode: Exclude<RenderReasonCode, 'projection-accepted'>;
  readonly projectionSha256: null;
  readonly projectionText: null;
}

/** Terminal display decision with an immutable exact-original fallback. */
export type RenderDecision = ProjectionRenderDecision | ExactOriginalRenderDecision;
