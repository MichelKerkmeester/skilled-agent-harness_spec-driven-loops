// ───────────────────────────────────────────────────────────────────
// MODULE: Per-Mode Authority Flip Types
// ───────────────────────────────────────────────────────────────────
//
// A dark, unwired mode-keyed authority selector and atomic flip mechanism.
// Nothing here executes against a real mode: every helper is a pure or
// file-scoped function the caller must invoke explicitly, and the default
// authority for any mode this registry has never written is legacy.

import type { AuthorityState } from '../authorized-ledger/index.js';
import type { JsonObject } from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. IDENTITY AND CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const AUTHORITY_FLIP_SCHEMA_VERSION = 1;
export const AUTHORITY_FLIP_EVENT_TYPE = 'deep-loop-authority-flip.ledger.transition-recorded';

export type CutoverCertificateMode =
  | 'agent-improvement'
  | 'deep-ai-council'
  | 'deep-alignment'
  | 'deep-improvement-common'
  | 'deep-research'
  | 'deep-review'
  | 'model-benchmark'
  | 'skill-benchmark';

/** Route a selector may hand a mode adapter; there is never more than one canonical route. */
export type AuthorityRoute = 'legacy' | 'dark';

export type AuthorityFlipDenialReasonCode =
  | 'ACTIVE_TRANSACTION_CONFLICT'
  | 'AUTHORIZATION_DENIED'
  | 'CANDIDATE_MISMATCH'
  | 'CAS_CONFLICT'
  | 'CUTOVER_CERTIFICATE_INVALID'
  | 'GATEWAY_FAILURE'
  | 'IDENTITY_UNVERIFIED'
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
