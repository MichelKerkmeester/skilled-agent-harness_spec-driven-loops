// ───────────────────────────────────────────────────────────────────
// MODULE: Compatibility Shadow Types
// ───────────────────────────────────────────────────────────────────

import type {
  CanonicalBytes,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. STATE UPCASTER TYPES
// ───────────────────────────────────────────────────────────────────

/** Normalized state shape produced only by an explicit legacy codec. */
export interface VersionedStateRecord extends JsonObject {
  readonly family: string;
  readonly recordType: string;
  readonly stateVersion: number;
  readonly identity: JsonObject;
  readonly payload: JsonObject;
}

/** Explicit decoder for one fixture-backed legacy record family and discriminator. */
export interface StateRecordCodec {
  readonly identity: string;
  readonly family: string;
  readonly recordType: string;
  readonly decode: (source: Readonly<JsonObject>) => VersionedStateRecord;
}

/** Closed validator and canonical fixture for one positive state version. */
export interface StateVersionDefinition {
  readonly version: number;
  readonly validate: (record: Readonly<VersionedStateRecord>) => boolean | void;
  readonly fixture: VersionedStateRecord;
}

/** Auditable provenance for a field introduced during one adjacent state hop. */
export interface StateIntroducedFieldProvenance {
  readonly kind: 'default' | 'derived';
  readonly provenance: string;
}

/** Lossless output contract for one adjacent state transform. */
export interface StateUpcastOutcome {
  readonly record: VersionedStateRecord;
  readonly sourceFieldMap: Readonly<Record<string, string>>;
  readonly introducedFields?: Readonly<Record<string, StateIntroducedFieldProvenance>>;
}

/** Pure transform from one declared state version to its immediate successor. */
export interface StateUpcasterDefinition {
  readonly identity: string;
  readonly fromVersion: number;
  readonly toVersion: number;
  readonly upcast: (record: Readonly<VersionedStateRecord>) => StateUpcastOutcome;
}

/** Complete startup definition for one stable state family and record type. */
export interface StateRecordTypeDefinition {
  readonly family: string;
  readonly recordType: string;
  readonly currentVersion: number;
  readonly versions: readonly StateVersionDefinition[];
  readonly upcasters: readonly StateUpcasterDefinition[];
}

/** Ordered evidence for one validated adjacent state transform. */
export interface StateUpcastHopTrace {
  readonly identity: string;
  readonly implementationDigest: string;
  readonly fromVersion: number;
  readonly toVersion: number;
  readonly inputDigest: string;
  readonly outputDigest: string;
}

/** Immutable source bytes and decoded stored version retained for audit. */
export interface StoredStateEvidence {
  readonly bytes: CanonicalBytes;
  readonly byteLength: number;
  readonly digest: string;
  readonly record: VersionedStateRecord;
}

/** Fully validated current state artifact. */
export interface EffectiveStateArtifact {
  readonly record: VersionedStateRecord;
  readonly canonicalBytes: CanonicalBytes;
  readonly canonicalDigest: string;
}

/** Read result that never exposes a partial upcast chain. */
export interface StateReadResult {
  readonly stored: StoredStateEvidence;
  readonly effective: EffectiveStateArtifact;
  readonly storedVersion: number;
  readonly effectiveVersion: number;
  readonly codecIdentity: string;
  readonly codecDigest: string;
  readonly registryDigest: string;
  readonly chainIdentity: string;
  readonly hopTrace: readonly StateUpcastHopTrace[];
}

export type StoredStateBytes = string | Uint8Array | readonly number[];

/** Function-free registry description suitable for hashing and evidence. */
export interface StateRegistryInspectionEntry {
  readonly family: string;
  readonly recordType: string;
  readonly currentVersion: number;
  readonly supportedVersions: readonly number[];
  readonly versions: readonly {
    readonly version: number;
    readonly validatorDigest: string;
    readonly fixtureDigest: string;
  }[];
  readonly upcasters: readonly {
    readonly identity: string;
    readonly fromVersion: number;
    readonly toVersion: number;
    readonly implementationDigest: string;
  }[];
}

// ───────────────────────────────────────────────────────────────────
// 2. DUAL-READ TYPES
// ───────────────────────────────────────────────────────────────────

/** Immutable token that binds both readers to one logical observation boundary. */
export interface ComparisonToken extends JsonObject {
  readonly tokenVersion: 1;
  readonly mode: string;
  readonly runId: string;
  readonly streamId: string;
  readonly authorityEpoch: number;
  readonly correlationId: string;
  readonly legacyRecordId: string;
  readonly legacySequence: number;
  readonly darkLedgerId: string;
  readonly darkHeadSequence: number;
  readonly darkHeadHash: string;
}

/** Current legacy model observed without changing the operational legacy value. */
export interface LegacyReadModel {
  readonly model: JsonValue;
  readonly recordId: string;
  readonly sequence: number;
  readonly comparisonSequence: number;
}

/** Current model from a verified dark-ledger read. */
export interface DarkReadModel {
  readonly model: JsonValue;
  readonly ledgerId: string;
  readonly verifiedHeadSequence: number;
  readonly verifiedHeadHash: string;
  readonly comparisonSequence: number;
}

export type ReconciliationOutcome =
  | 'parity'
  | 'divergence'
  | 'dark_lagging'
  | 'dark_missing'
  | 'dark_invalid'
  | 'dark_failure'
  | 'legacy_compatibility_failure'
  | 'legacy_failure_dark_success'
  | 'legacy_failure_dark_failure'
  | 'not_comparable';

/** Bounded evidence contains identifiers, codes, and digests but no model or payload. */
export interface ReconciliationEvidence {
  readonly outcome: ReconciliationOutcome;
  readonly parityEligible: boolean;
  readonly tokenDigest: string;
  readonly legacyFingerprint: string | null;
  readonly darkFingerprint: string | null;
  readonly legacyErrorCode: string | null;
  readonly darkErrorCode: string | null;
}

export interface CompatibilityGates {
  readonly upcastingEnabled: boolean;
  readonly dualReadEnabled: boolean;
  readonly darkMirroringEnabled: boolean;
}
