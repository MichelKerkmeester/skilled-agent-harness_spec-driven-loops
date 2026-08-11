// ───────────────────────────────────────────────────────────────────
// MODULE: Projection Outcome Contract
// ───────────────────────────────────────────────────────────────────

import type { ContractHeader, RuntimeId } from './common.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Shared identity for every projection state. */
export interface ProjectionBase extends ContractHeader {
  readonly contractKind: 'projection';
  readonly projectionId: string;
  readonly originalId: string;
  readonly runtime: RuntimeId;
  readonly promptVersion: string;
}

/** Non-terminal projection candidate awaiting deterministic validation. */
export interface ProjectionCandidate extends ProjectionBase {
  readonly status: 'candidate';
  readonly projectedTextId: string;
  readonly providerId: string;
  readonly modelId: string;
}

/** Projection accepted after every required validator passes. */
export interface AcceptedProjection extends ProjectionBase {
  readonly status: 'accepted';
  readonly projectedTextId: string;
  readonly validationProfileVersion: string;
}

/** Candidate rejected without replacing the canonical original. */
export interface RejectedProjection extends ProjectionBase {
  readonly status: 'rejected';
  readonly reasonCode: ProjectionReasonCode;
  readonly rejectedCandidateId: string | null;
}

/** Terminal decision to render the immutable original bytes. */
export interface ExactOriginalFallback extends ProjectionBase {
  readonly status: 'exact-original';
  readonly reasonCode: ProjectionReasonCode;
}

/** All states in the display-projection decision lifecycle. */
export type ProjectionOutcome =
  | AcceptedProjection
  | ExactOriginalFallback
  | ProjectionCandidate
  | RejectedProjection;

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** Stable reasons that reject a candidate or select the original. */
export const ProjectionReasonCodes = {
  CANCELLED: 'cancelled',
  EMPTY_OUTPUT: 'empty-output',
  INCOMPLETE_SOURCE: 'incomplete-source',
  NONE: 'none',
  PRIVACY_DENIED: 'privacy-denied',
  PROVIDER_ERROR: 'provider-error',
  TIMEOUT: 'timeout',
  UNSUPPORTED_CONTROL: 'unsupported-control',
  UNSUPPORTED_SCHEMA: 'unsupported-schema',
  VALIDATION_REJECTED: 'validation-rejected',
} as const;

/** Projection decision reason. */
export type ProjectionReasonCode =
  typeof ProjectionReasonCodes[keyof typeof ProjectionReasonCodes];
