// ───────────────────────────────────────────────────────────────────
// MODULE: Release Evidence Contracts
// ───────────────────────────────────────────────────────────────────

import type { RuntimeId } from '../contracts/common.js';
import type { DoctorReport } from '../doctor/types.js';
import type { ReleaseGateDecision } from '../evaluation/gate.js';
import type { SupportMatrix as SupportMatrixRecord } from './types.js';

/** Independent evidence lanes required for a release decision. */
export type ReleaseEvidenceInputName =
  | 'doctor'
  | 'evaluation'
  | 'fidelity-negative-controls'
  | 'privacy-canaries'
  | 'provider-contracts'
  | 'runtime-smokes'
  | 'strict-packet-validation'
  | 'support-matrix';

/** Status retained for one content-free evidence lane. */
export type ReleaseEvidenceStatus =
  | 'fail'
  | 'invalid'
  | 'missing'
  | 'pass'
  | 'provisional'
  | 'stale';

/** Stable reasons that prevent release without exposing evidence content. */
export const ReleaseAbortReasonCodes = {
  DOCTOR_MISSING: 'doctor-missing',
  DOCTOR_NOT_READY: 'doctor-not-ready',
  EVALUATION_MISSING: 'evaluation-missing',
  EVALUATION_NOT_APPROVED: 'evaluation-not-approved',
  EVALUATION_NOT_HUMAN_CERTIFIABLE: 'evaluation-not-human-certifiable',
  EVIDENCE_INVALID: 'evidence-invalid',
  EVIDENCE_STALE: 'evidence-stale',
  FIDELITY_NEGATIVE_CONTROL_FAILED: 'fidelity-negative-control-failed',
  FIDELITY_NEGATIVE_CONTROLS_MISSING: 'fidelity-negative-controls-missing',
  PRIVACY_CANARY_FAILED: 'privacy-canary-failed',
  PRIVACY_CANARY_LEAK: 'privacy-canary-leak',
  PRIVACY_CANARIES_MISSING: 'privacy-canaries-missing',
  PROVIDER_CONTRACT_FAILED: 'provider-contract-failed',
  PROVIDER_CONTRACTS_MISSING: 'provider-contracts-missing',
  RELEASE_TIME_INVALID: 'release-time-invalid',
  RUNTIME_SMOKE_FAILED: 'runtime-smoke-failed',
  RUNTIME_SMOKES_INCOMPLETE: 'runtime-smokes-incomplete',
  RUNTIME_SMOKES_MISSING: 'runtime-smokes-missing',
  STRICT_PACKET_VALIDATION_FAILED: 'strict-packet-validation-failed',
  STRICT_PACKET_VALIDATION_MISSING: 'strict-packet-validation-missing',
  SUPPORT_MATRIX_INCOMPLETE: 'support-matrix-incomplete',
  SUPPORT_MATRIX_MISSING: 'support-matrix-missing',
  SUPPORT_MATRIX_STALE: 'support-matrix-stale',
} as const;

/** Typed reason carried by a blocked release decision. */
export type ReleaseAbortReasonCode =
  typeof ReleaseAbortReasonCodes[keyof typeof ReleaseAbortReasonCodes];

/** Reason retained for a passing or blocked manifest lane. */
export type ReleaseEvidenceReasonCode = 'passed' | ReleaseAbortReasonCode;

/** Dated pointer to independently retained evidence. */
export interface ReleaseEvidenceReferenceInput {
  readonly evidenceRef: string;
  readonly observedAt: string;
  readonly expiresAt: string;
}

/** One pass/fail check with independently retained dated evidence. */
export interface ReleaseCheckEvidence extends ReleaseEvidenceReferenceInput {
  readonly status: 'fail' | 'pass';
}

/** Runtime smoke evidence bound to one portable runtime family. */
export interface RuntimeSmokeEvidence extends ReleaseCheckEvidence {
  readonly runtime: RuntimeId;
}

/** Privacy canary result whose release-safe outcome has no leaks. */
export interface PrivacyCanaryEvidence extends ReleaseCheckEvidence {
  readonly leakCount: number;
}

/** Dated wrapper for an existing structured decision. */
export interface DatedReleaseEvidence<TResult> extends ReleaseEvidenceReferenceInput {
  readonly result: TResult;
}

/** Independent evidence bundle consumed by the fail-closed release gate. */
export interface ReleaseEvidenceInput {
  readonly supportMatrix?: SupportMatrixRecord;
  readonly doctor?: DatedReleaseEvidence<DoctorReport>;
  readonly runtimeSmokes?: readonly RuntimeSmokeEvidence[];
  readonly providerContracts?: readonly ReleaseCheckEvidence[];
  readonly fidelityNegativeControls?: readonly ReleaseCheckEvidence[];
  readonly privacyCanaries?: readonly PrivacyCanaryEvidence[];
  readonly evaluation?: DatedReleaseEvidence<ReleaseGateDecision>;
  readonly strictPacketValidation?: ReleaseCheckEvidence;
}

/** Hashed dated reference retained without its raw locator. */
export interface ReleaseEvidenceManifestReference {
  readonly referenceDigest: string;
  readonly observedAt: string;
  readonly expiresAt: string;
}

/** Content-free outcome for one independent release input. */
export interface ReleaseEvidenceManifestEntry {
  readonly inputName: ReleaseEvidenceInputName;
  readonly status: ReleaseEvidenceStatus;
  readonly reasonCode: ReleaseEvidenceReasonCode;
  readonly resultCount: number;
  readonly references: readonly ReleaseEvidenceManifestReference[];
}

/** Reproducible metadata-only manifest for the assembled release decision. */
export interface ReleaseEvidenceManifest {
  readonly manifestVersion: 'release-evidence-manifest/1.0.0';
  readonly evaluatedAt: string | null;
  readonly overallDecision: 'blocked' | 'release-ready';
  readonly entries: readonly ReleaseEvidenceManifestEntry[];
  readonly contentFreeDigest: string;
}

/** Typed abort tied to the independent evidence lane that caused it. */
export interface ReleaseAbort {
  readonly inputName: ReleaseEvidenceInputName | 'release-time';
  readonly reasonCode: ReleaseAbortReasonCode;
}

/** Final release decision with every evaluated input and typed abort. */
export interface ReleaseReadinessDecision {
  readonly decisionVersion: 'release-readiness/1.0.0';
  readonly overallDecision: 'blocked' | 'release-ready';
  readonly aborts: readonly ReleaseAbort[];
  readonly manifest: ReleaseEvidenceManifest;
}
