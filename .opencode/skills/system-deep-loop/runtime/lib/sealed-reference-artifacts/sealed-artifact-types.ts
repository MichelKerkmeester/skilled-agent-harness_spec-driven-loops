// ───────────────────────────────────────────────────────────────────
// MODULE: Sealed Reference Artifact Types
// ───────────────────────────────────────────────────────────────────

import type { JsonObject, JsonValue } from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const ARTIFACT_DESCRIPTOR_VERSION = 1;
export const ARTIFACT_REFERENCE_VERSION = 1;
export const ARTIFACT_TOMBSTONE_VERSION = 1;
export const DEFAULT_ARTIFACT_DIGEST_ALGORITHM = 'sha256';
export const DEFAULT_ARTIFACT_CANONICALIZATION_VERSION = 'deep-loop-json@1';
export const DEFAULT_ARTIFACT_MEDIA_TYPE = 'application/json';

export const InitialArtifactKinds = Object.freeze({
  PROMPT_SET: 'prompt-set',
  FIXTURE: 'fixture',
  PRIOR_RUN_OUTPUT: 'prior-run-output',
  CONFIGURATION: 'configuration',
} as const);

/** Artifact kinds shipped by the initial shared canonicalization registry. */
export type InitialArtifactKind =
  typeof InitialArtifactKinds[keyof typeof InitialArtifactKinds];

export const SealedArtifactErrorCodes = Object.freeze({
  INVALID_INPUT: 'INVALID_INPUT',
  UNSUPPORTED_ARTIFACT_KIND: 'UNSUPPORTED_ARTIFACT_KIND',
  UNSUPPORTED_CANONICALIZATION: 'UNSUPPORTED_CANONICALIZATION',
  UNSUPPORTED_DIGEST_ALGORITHM: 'UNSUPPORTED_DIGEST_ALGORITHM',
  UNSUPPORTED_DESCRIPTOR_VERSION: 'UNSUPPORTED_DESCRIPTOR_VERSION',
  UNSUPPORTED_REFERENCE_VERSION: 'UNSUPPORTED_REFERENCE_VERSION',
  PUBLICATION_FAILED: 'PUBLICATION_FAILED',
  ARTIFACT_MISSING: 'ARTIFACT_MISSING',
  ARTIFACT_TOMBSTONED: 'ARTIFACT_TOMBSTONED',
  ARTIFACT_QUARANTINED: 'ARTIFACT_QUARANTINED',
  ARTIFACT_CORRUPT: 'ARTIFACT_CORRUPT',
  DESCRIPTOR_CONFLICT: 'DESCRIPTOR_CONFLICT',
  DIGEST_CONFLICT: 'DIGEST_CONFLICT',
  EVIDENCE_MISSING: 'EVIDENCE_MISSING',
  EVIDENCE_CONFLICT: 'EVIDENCE_CONFLICT',
  LEDGER_AUTHORIZATION_DENIED: 'LEDGER_AUTHORIZATION_DENIED',
  RETENTION_INDETERMINATE: 'RETENTION_INDETERMINATE',
  RETENTION_PROTECTED: 'RETENTION_PROTECTED',
  RESTORATION_MISMATCH: 'RESTORATION_MISMATCH',
  INPUT_EQUIVALENCE_FAILURE: 'INPUT_EQUIVALENCE_FAILURE',
} as const);

/** Closed programmatic failure vocabulary for artifact operations. */
export type SealedArtifactErrorCode =
  typeof SealedArtifactErrorCodes[keyof typeof SealedArtifactErrorCodes];

/** Boundary at which a sealed artifact failure was detected. */
export type SealedArtifactErrorPhase =
  | 'canonicalization'
  | 'descriptor'
  | 'publication'
  | 'read'
  | 'evidence'
  | 'ledger'
  | 'retention'
  | 'restoration'
  | 'parity';

// ───────────────────────────────────────────────────────────────────
// 2. SEALED ARTIFACT CONTRACTS
// ───────────────────────────────────────────────────────────────────

/** Immutable identity metadata stored separately from content bytes. */
export interface SealDescriptor extends JsonObject {
  readonly descriptor_version: number;
  readonly artifact_kind: string;
  readonly media_type: string;
  readonly byte_length: number;
  readonly digest_algorithm: string;
  readonly content_digest: string;
  readonly canonicalization_version: string;
  readonly source_provenance_digest: string | null;
}

/** Only consumable artifact address; mutable discovery names are absent. */
export interface SealedArtifactReference extends JsonObject {
  readonly reference_version: number;
  readonly artifact_kind: string;
  readonly digest_algorithm: string;
  readonly content_digest: string;
  readonly qualified_digest: string;
  readonly descriptor_version: number;
  readonly canonicalization_version: string;
  readonly descriptor_digest: string;
}

/** Bytes are present only after reference, descriptor, length, and digest verification. */
export interface VerifiedSealedArtifact {
  readonly reference: SealedArtifactReference;
  readonly descriptor: SealDescriptor;
  readonly bytes: readonly number[];
}

/** Pure derivation result including canonical descriptor and reference bytes. */
export interface DerivedSealedArtifact extends VerifiedSealedArtifact {
  readonly descriptorBytes: readonly number[];
  readonly referenceBytes: readonly number[];
}

/** Optional registered identities included during artifact derivation. */
export interface SealArtifactOptions {
  readonly canonicalizationVersion?: string;
  readonly digestAlgorithm?: string;
  readonly mediaType?: string;
  readonly sourceProvenanceDigest?: string | null;
}

/** Idempotent publication result returned only with verified bytes. */
export interface SealArtifactResult {
  readonly status: 'sealed' | 'idempotent';
  readonly artifact: VerifiedSealedArtifact;
}

/** Disjoint filesystem ownership for immutable objects and lifecycle state. */
export interface ArtifactStorePaths {
  readonly blobPath: string;
  readonly descriptorPath: string;
  readonly referencePath: string;
  readonly tombstonePath: string;
  readonly quarantineMarkerPath: string;
}

/** Optional crash boundaries used to prove that publication stays unreachable. */
export interface ArtifactStoreFaultInjection {
  readonly beforeBlobWrite?: () => void;
  readonly beforeDescriptorWrite?: () => void;
  readonly beforePersistenceVerification?: () => void;
  readonly beforeReferencePublication?: () => void;
}

/** Filesystem and deterministic clock inputs for one artifact store. */
export interface ArtifactStoreOptions {
  readonly rootDirectory: string;
  readonly lockTimeoutMs?: number;
  readonly now?: () => Date;
  readonly faultInjection?: ArtifactStoreFaultInjection;
}

/** Durable ledger location that authorizes one deletion or restoration. */
export interface ArtifactDeletionAuthorization {
  readonly eventId: string;
  readonly ledgerId: string;
  readonly ledgerSequence: number;
  readonly ledgerRecordHash: string;
  readonly authorizedAt: string;
}

/** Receipt-bound logical deletion record retained after object removal. */
export interface ArtifactTombstone extends JsonObject {
  readonly tombstone_version: number;
  readonly reference: SealedArtifactReference;
  readonly descriptor: SealDescriptor;
  readonly descriptor_digest: string;
  readonly deletion_event_id: string;
  readonly deletion_ledger_id: string;
  readonly deletion_ledger_sequence: number;
  readonly deletion_record_hash: string;
  readonly deleted_at: string;
}

/** Registered canonicalization output before identity metadata is derived. */
export interface CanonicalizedArtifact {
  readonly artifactKind: string;
  readonly canonicalizationVersion: string;
  readonly mediaType: string;
  readonly bytes: Uint8Array;
}

/** Controlled implementation registered for one kind-and-version pair. */
export interface ArtifactCanonicalizerDefinition {
  readonly artifactKind: string;
  readonly canonicalizationVersion: string;
  readonly mediaType: string;
  readonly implementationIdentity: string;
  readonly canonicalize: (input: unknown) => Uint8Array;
}

/** Fixed digest metadata exposed without accepting executable integrity code. */
export interface ArtifactDigestDefinition {
  readonly algorithm: string;
  readonly implementationIdentity: string;
}

/** One ordered, verified, ledger-addressed replay input entry. */
export interface ArtifactReferenceSetEntry extends JsonObject {
  readonly position: number;
  readonly reference: SealedArtifactReference;
  readonly descriptor_digest: string;
  readonly verification_result: 'verified';
  readonly sealed_ledger_id: string;
  readonly sealed_sequence: number;
  readonly sealed_record_hash: string;
}

/** Reference-set fields committed before the set's own digest is added. */
export interface ArtifactReferenceSetCore extends JsonObject {
  readonly reference_set_version: number;
  readonly ordered_artifacts: ArtifactReferenceSetEntry[];
}

/** Complete ordered artifact set consumed by replay and parity gates. */
export interface ArtifactReferenceSet extends ArtifactReferenceSetCore {
  readonly reference_set_digest: string;
}

/** Content-addressed source shape accepted by replay component registration. */
export interface ArtifactReplayInputSource {
  readonly kind: 'content-addressed';
  readonly value: JsonValue;
}

/** Content-addressed source and claimed digest supplied to replay derivation. */
export interface ArtifactReplayInput {
  readonly key: string;
  readonly digest: string;
  readonly source: ArtifactReplayInputSource;
}

// ───────────────────────────────────────────────────────────────────
// 3. ERROR CONTRACT
// ───────────────────────────────────────────────────────────────────

/** Bounded typed failure that never carries artifact bytes. */
export class SealedArtifactError extends Error {
  public readonly code: SealedArtifactErrorCode;
  public readonly phase: SealedArtifactErrorPhase;
  public readonly details: Readonly<Record<string, string | number | boolean | null>>;

  public constructor(
    code: SealedArtifactErrorCode,
    phase: SealedArtifactErrorPhase,
    message: string,
    details: Readonly<Record<string, string | number | boolean | null>> = {},
  ) {
    super(message);
    this.name = 'SealedArtifactError';
    this.code = code;
    this.phase = phase;
    this.details = Object.freeze({ ...details });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
