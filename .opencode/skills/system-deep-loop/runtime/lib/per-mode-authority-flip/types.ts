// ───────────────────────────────────────────────────────────────────
// MODULE: Per-Mode Authority Flip Types
// ───────────────────────────────────────────────────────────────────
//
// A dark, unwired mode-keyed authority selector and atomic flip mechanism.
// Nothing here executes against a real mode: every helper is a pure or
// file-scoped function the caller must invoke explicitly, and the default
// authority for any mode this registry has never written is legacy.

import type { AuthorityState } from '../authorized-ledger/index.js';
import type {
  CutoverCertificate,
  CutoverCertificateMode,
  CutoverCertificateVerificationExpectation,
} from '../cutover-certificate/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type { InflightClassificationManifest } from '../inflight-state-classification/index.js';
import type { InflightMigrationHandoff } from '../inflight-state-migration/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. IDENTITY AND CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const AUTHORITY_FLIP_SCHEMA_VERSION = 1;
export const AUTHORITY_FLIP_EVENT_TYPE = 'deep-loop-authority-flip.ledger.transition-recorded';

/** Route a selector may hand a mode adapter; there is never more than one canonical route. */
export type AuthorityRoute = 'legacy' | 'dark';

export type AuthorityFlipDenialReasonCode =
  | 'ACTIVE_TRANSACTION_CONFLICT'
  | 'AUTHORIZATION_DENIED'
  | 'CANDIDATE_MISMATCH'
  | 'CAS_CONFLICT'
  | 'CUTOVER_CERTIFICATE_INVALID'
  | 'GATEWAY_FAILURE'
  | 'LEDGER_APPEND_FAILED'
  | 'MIGRATION_HANDOFF_INVALID'
  | 'MIGRATION_HANDOFF_UNBOUND'
  | 'MODE_ORDER_VIOLATION'
  | 'MULTI_MODE_REQUEST_REJECTED'
  | 'POLICY_MISMATCH'
  | 'RECORD_DIGEST_MISMATCH'
  | 'RECORD_MALFORMED'
  | 'ROLLBACK_ASSETS_INVALID'
  | 'STALE_AUTHORITY_EPOCH'
  | 'UNKNOWN_AUTHORITY_STATE'
  | 'UNKNOWN_MODE'
  | 'WRONG_MODE_BINDING';

/** Fail-closed structural error that never carries a raw state payload. */
export class AuthorityFlipError extends Error {
  public readonly reasonCode: AuthorityFlipDenialReasonCode;
  public readonly details: Readonly<Record<string, boolean | number | string>>;

  public constructor(
    reasonCode: AuthorityFlipDenialReasonCode,
    message: string,
    details: Readonly<Record<string, boolean | number | string>> = {},
  ) {
    super(message);
    this.name = 'AuthorityFlipError';
    this.reasonCode = reasonCode;
    this.details = Object.freeze({ ...details });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ───────────────────────────────────────────────────────────────────
// 2. AUTHORITY RECORD
// ───────────────────────────────────────────────────────────────────

/** The exact durable states a mode-keyed authority record may hold. */
export const AuthorityFlipStates: ReadonlySet<AuthorityState> = new Set([
  'legacy_authoritative',
  'shadowing',
  'cutover_ready',
  'new_authoritative_reversible',
  'rollback_pending',
  'new_authoritative_final',
]);

export interface AuthorityRecordCore extends JsonObject {
  readonly schemaVersion: typeof AUTHORITY_FLIP_SCHEMA_VERSION;
  readonly mode: CutoverCertificateMode;
  readonly state: AuthorityState;
  readonly epoch: number;
  readonly selectedWriter: AuthorityRoute;
  readonly candidateSha: string | null;
  readonly policyVersion: number;
  readonly cutoverCertificateDigest: string | null;
  readonly lastTransitionDigest: string | null;
  readonly updatedAt: string;
}

/** One mode's durable authority record; `recordDigest` is the tamper-evident binding. */
export interface AuthorityRecord extends AuthorityRecordCore {
  readonly recordDigest: string;
}

// ───────────────────────────────────────────────────────────────────
// 3. SELECTOR
// ───────────────────────────────────────────────────────────────────

export interface AuthoritySelectorExpectation {
  readonly mode: CutoverCertificateMode;
  readonly policyVersion?: number;
  readonly expectedRecordDigest?: string;
}

export type AuthoritySelectorResult =
  | Readonly<{
    outcome: 'selected';
    route: AuthorityRoute;
    shadowRoute: AuthorityRoute | null;
    state: AuthorityState;
    epoch: number;
    admissionOpen: boolean;
  }>
  | Readonly<{ outcome: 'denied'; reasonCode: AuthorityFlipDenialReasonCode }>;

// ───────────────────────────────────────────────────────────────────
// 4. MANIFEST ORDER
// ───────────────────────────────────────────────────────────────────

/** The eight mode/workstream identities in the frozen cutover-order sequence. */
export const AUTHORITY_FLIP_MODE_ORDER: readonly CutoverCertificateMode[] = Object.freeze([
  'deep-research',
  'deep-review',
  'deep-ai-council',
  'deep-improvement-common',
  'agent-improvement',
  'model-benchmark',
  'skill-benchmark',
  'deep-alignment',
]);

export const AUTHORITY_FLIP_COMMON_MODE: CutoverCertificateMode = 'deep-improvement-common';

/** The three shared-backend variants that may never flip before the common workstream. */
export const AUTHORITY_FLIP_COMMON_VARIANTS: ReadonlySet<CutoverCertificateMode> = new Set([
  'agent-improvement',
  'model-benchmark',
  'skill-benchmark',
]);

// ───────────────────────────────────────────────────────────────────
// 5. PREFLIGHT
// ───────────────────────────────────────────────────────────────────

export interface CutoverCertificateEvidence {
  readonly certificate: CutoverCertificate;
  readonly expectation: CutoverCertificateVerificationExpectation;
}

export interface MigrationHandoffEvidence {
  readonly handoff: InflightMigrationHandoff;
  readonly classificationManifest: InflightClassificationManifest;
}

export interface CutoverPreflightInput {
  readonly mode: CutoverCertificateMode;
  readonly expectedAuthorityEpoch: number;
  readonly alreadyFlippedModes: ReadonlySet<CutoverCertificateMode>;
  readonly cutover: CutoverCertificateEvidence;
  readonly migration: MigrationHandoffEvidence;
  readonly rollbackAssetDigests: readonly string[];
}

export type CutoverPreflightResult =
  | Readonly<{ verdict: 'ready'; cutoverCertificateDigest: string; classificationManifestDigest: string }>
  | Readonly<{ verdict: 'blocked'; reasonCode: AuthorityFlipDenialReasonCode }>;

// ───────────────────────────────────────────────────────────────────
// 6. CUTOVER REQUEST AND DECISION
// ───────────────────────────────────────────────────────────────────

export interface CutoverRequest {
  readonly requestedModes: readonly CutoverCertificateMode[];
  readonly preflight: CutoverPreflightInput;
  readonly requestId: string;
  readonly actorId: string;
  readonly capabilityId: string;
  readonly policyId: string;
  readonly policyVersion: number;
  readonly policyDigest: string;
  readonly streamId: string;
  readonly correlationId: string;
  readonly decidedAt: string;
}

export interface AuthorityTransitionFacts extends JsonObject {
  readonly schemaVersion: typeof AUTHORITY_FLIP_SCHEMA_VERSION;
  readonly eventKind: 'authority-transition-flip';
  readonly mode: CutoverCertificateMode;
  readonly fromAuthorityState: 'cutover_ready';
  readonly toAuthorityState: 'new_authoritative_reversible';
  readonly fromAuthorityEpoch: number;
  readonly toAuthorityEpoch: number;
  readonly candidateSha: string;
  readonly policyId: string;
  readonly policyVersion: number;
  readonly policyDigest: string;
  readonly cutoverCertificateDigest: string;
  readonly modeGateCertificateDigest: string;
  readonly rollbackDrillCertificateDigest: string;
  readonly shadowParityEvidenceDigest: string;
  readonly classificationManifestDigest: string;
  readonly migrationHandoffDigest: string;
  readonly rollbackAssetSetDigest: string;
  readonly rollbackWindowMinimumCalendarDays: number;
  readonly rollbackWindowMinimumSuccessfulExecutions: number;
  readonly actorId: string;
  readonly requestDigest: string;
  readonly decidedAt: string;
  readonly transitionDigest: string;
}

export interface AuthorityTransitionEvent {
  readonly facts: AuthorityTransitionFacts;
  readonly eventDigest: string;
}

export type CutoverDecision =
  | Readonly<{
    disposition: 'flipped';
    record: AuthorityRecord;
    transitionEvent: AuthorityTransitionEvent;
    resumed: boolean;
  }>
  | Readonly<{ disposition: 'denied'; reasonCode: AuthorityFlipDenialReasonCode }>;

export type { CutoverCertificateMode };
