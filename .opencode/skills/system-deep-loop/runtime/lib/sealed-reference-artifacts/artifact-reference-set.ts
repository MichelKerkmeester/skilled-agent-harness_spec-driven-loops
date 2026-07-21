// ───────────────────────────────────────────────────────────────────
// MODULE: Sealed Artifact Replay Binding
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  ARTIFACT_SEALED_EVENT_TYPE,
  parseArtifactSealedPayload,
  readVerifiedArtifactEvidence,
} from './artifact-events.js';
import {
  SealedArtifactError,
  SealedArtifactErrorCodes,
} from './sealed-artifact-types.js';

import type { AppendOnlyLedger } from '../authorized-ledger/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type { VerifiedArtifactEvidence } from './artifact-events.js';
import type { SealedArtifactStore } from './sealed-artifact-store.js';
import type {
  ArtifactReferenceSet,
  ArtifactReferenceSetCore,
  ArtifactReferenceSetEntry,
  ArtifactReplayInput,
} from './sealed-artifact-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS AND TYPES
// ───────────────────────────────────────────────────────────────────

export const SEALED_ARTIFACT_REPLAY_INPUT_KEY = 'sealed_reference_artifacts';

/** Exact input-equivalence proof for parity consumers. */
export interface ArtifactInputEquivalenceSuccess {
  readonly ok: true;
  readonly referenceSetDigest: string;
}

/** Bounded parity failure that carries commitments instead of artifact content. */
export interface ArtifactInputEquivalenceFailure {
  readonly ok: false;
  readonly code: 'INPUT_EQUIVALENCE_FAILURE';
  readonly legacyReferenceSetDigest: string;
  readonly darkReferenceSetDigest: string;
  readonly message: string;
}

/** Shadow-input gate result with no behavior-comparison branch on failure. */
export type ArtifactInputEquivalenceResult =
  | ArtifactInputEquivalenceSuccess
  | ArtifactInputEquivalenceFailure;

interface ResolvedArtifactDigest extends JsonObject {
  readonly qualified_digest: string;
  readonly descriptor_digest: string;
}

interface ResolvedArtifactReplayValue extends JsonObject {
  readonly reference_set_version: number;
  readonly reference_set_digest: string;
  readonly ordered_digests: ResolvedArtifactDigest[];
}

// ───────────────────────────────────────────────────────────────────
// 2. VERIFIED REFERENCE SETS
// ───────────────────────────────────────────────────────────────────

function isImmutableByteArray(value: unknown): value is readonly number[] {
  return Array.isArray(value)
    && Object.isFrozen(value)
    && value.every((byte) => Number.isInteger(byte) && byte >= 0 && byte <= 255);
}

function evidenceEntry(
  evidence: VerifiedArtifactEvidence,
  position: number,
): ArtifactReferenceSetEntry {
  if (
    !evidence
    || !evidence.sealedEvent
    || !evidence.receipt
    || !evidence.artifact
    || !evidence.artifact.reference
  ) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
      'evidence',
      'Reference-set binding accepts verified artifact evidence only',
      { position },
    );
  }
  if (
    evidence.sealedEvent.event.effective.envelope.event_type
      !== ARTIFACT_SEALED_EVENT_TYPE
    || evidence.sealedEvent.frame.sequence !== evidence.receipt.sequence
    || evidence.sealedEvent.frame.record_hash !== evidence.receipt.recordHash
  ) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
      'evidence',
      'Reference-set binding requires exact verified ledger creation evidence',
      { position },
    );
  }
  const payload = parseArtifactSealedPayload(
    evidence.sealedEvent.event.effective.envelope.payload,
  );
  if (
    canonicalJson(payload.reference) !== canonicalJson(evidence.artifact.reference)
    || payload.descriptor_digest !== evidence.artifact.reference.descriptor_digest
    || !evidence.artifact.descriptor
    || !isImmutableByteArray(evidence.artifact.bytes)
    || evidence.artifact.bytes.length !== evidence.artifact.descriptor.byte_length
    || evidence.artifact.descriptor.content_digest
      !== evidence.artifact.reference.content_digest
    || sha256Bytes(Uint8Array.from(evidence.artifact.bytes))
      !== evidence.artifact.reference.content_digest
  ) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
      'evidence',
      'Artifact bytes and authorized creation evidence do not share one identity',
      { position },
    );
  }
  return Object.freeze({
    position,
    reference: evidence.artifact.reference,
    descriptor_digest: evidence.artifact.reference.descriptor_digest,
    verification_result: 'verified',
    sealed_ledger_id: evidence.sealedEvent.frame.ledger_id,
    sealed_sequence: evidence.sealedEvent.frame.sequence,
    sealed_record_hash: evidence.sealedEvent.frame.record_hash,
  });
}

/** Bind caller order, descriptor versions, verification, and creation evidence. */
export function bindVerifiedArtifactReferences(
  evidence: readonly VerifiedArtifactEvidence[],
): ArtifactReferenceSet {
  if (!Array.isArray(evidence) || evidence.length === 0) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.EVIDENCE_MISSING,
      'evidence',
      'Trusted replay requires a non-empty verified artifact reference set',
    );
  }
  const entries = evidence.map(evidenceEntry);
  const identities = entries.map((entry) => entry.reference.qualified_digest);
  if (new Set(identities).size !== identities.length) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
      'evidence',
      'Verified artifact reference set cannot contain duplicate identities',
    );
  }
  const core: ArtifactReferenceSetCore = Object.freeze({
    reference_set_version: 1,
    ordered_artifacts: Object.freeze(entries) as unknown as ArtifactReferenceSetEntry[],
  });
  return Object.freeze({
    ...core,
    reference_set_digest: sha256Bytes(canonicalBytes(core)),
  });
}

function requireClaimedEntry(
  value: unknown,
  position: number,
): ArtifactReferenceSetEntry {
  if (
    value === null
    || Array.isArray(value)
    || typeof value !== 'object'
  ) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
      'evidence',
      'Replay reference set contains a malformed artifact entry',
      { position },
    );
  }
  const entry = value as Partial<ArtifactReferenceSetEntry>;
  if (
    entry.position !== position
    || entry.verification_result !== 'verified'
    || !entry.reference
    || typeof entry.descriptor_digest !== 'string'
    || typeof entry.sealed_ledger_id !== 'string'
    || typeof entry.sealed_sequence !== 'number'
    || typeof entry.sealed_record_hash !== 'string'
  ) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
      'evidence',
      'Replay reference set contains fabricated verification or ledger fields',
      { position },
    );
  }
  return entry as ArtifactReferenceSetEntry;
}

/** Resolve every reference and ledger claim before producing replay input. */
export async function artifactReferenceSetReplayInput(
  ledger: AppendOnlyLedger,
  store: SealedArtifactStore,
  referenceSet: ArtifactReferenceSet,
): Promise<ArtifactReplayInput> {
  if (
    !referenceSet
    || referenceSet.reference_set_version !== 1
    || !Array.isArray(referenceSet.ordered_artifacts)
    || referenceSet.ordered_artifacts.length === 0
    || typeof referenceSet.reference_set_digest !== 'string'
  ) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
      'evidence',
      'Replay input requires a complete ordered artifact reference set',
    );
  }

  const resolvedEntries: ArtifactReferenceSetEntry[] = [];
  for (const [position, candidate] of referenceSet.ordered_artifacts.entries()) {
    const claimed = requireClaimedEntry(candidate, position);
    const evidence = await readVerifiedArtifactEvidence(
      ledger,
      store,
      claimed.reference,
      claimed.reference.artifact_kind,
    );
    const resolved = evidenceEntry(evidence, position);
    if (canonicalJson(claimed) !== canonicalJson(resolved)) {
      throw new SealedArtifactError(
        SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
        'evidence',
        'Replay reference set does not match resolved artifact and ledger evidence',
        { position },
      );
    }
    resolvedEntries.push(resolved);
  }
  const resolvedIdentities = resolvedEntries.map(
    (entry) => entry.reference.qualified_digest,
  );
  if (new Set(resolvedIdentities).size !== resolvedIdentities.length) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
      'evidence',
      'Replay reference set cannot contain duplicate resolved identities',
    );
  }

  const resolvedCore: ArtifactReferenceSetCore = Object.freeze({
    reference_set_version: 1,
    ordered_artifacts: Object.freeze(resolvedEntries) as unknown as ArtifactReferenceSetEntry[],
  });
  const resolvedSetDigest = sha256Bytes(canonicalBytes(resolvedCore));
  if (resolvedSetDigest !== referenceSet.reference_set_digest) {
    throw new SealedArtifactError(
      SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
      'evidence',
      'Replay reference-set digest does not match resolved evidence',
    );
  }

  const orderedDigests = resolvedEntries.map((entry): ResolvedArtifactDigest => Object.freeze({
    qualified_digest: entry.reference.qualified_digest,
    descriptor_digest: entry.descriptor_digest,
  }));
  const value: ResolvedArtifactReplayValue = Object.freeze({
    reference_set_version: 1,
    reference_set_digest: resolvedSetDigest,
    ordered_digests: Object.freeze(orderedDigests) as unknown as ResolvedArtifactDigest[],
  });
  return Object.freeze({
    key: SEALED_ARTIFACT_REPLAY_INPUT_KEY,
    digest: sha256Bytes(canonicalBytes(value)),
    source: Object.freeze({
      kind: 'content-addressed',
      value,
    }),
  });
}

/** Gate shadow comparison on exact verified input identity and order. */
export function compareArtifactReferenceSets(
  legacy: ArtifactReferenceSet,
  dark: ArtifactReferenceSet,
): ArtifactInputEquivalenceResult {
  if (canonicalJson(legacy) === canonicalJson(dark)) {
    return Object.freeze({
      ok: true,
      referenceSetDigest: legacy.reference_set_digest,
    });
  }
  return Object.freeze({
    ok: false,
    code: SealedArtifactErrorCodes.INPUT_EQUIVALENCE_FAILURE,
    legacyReferenceSetDigest: legacy.reference_set_digest,
    darkReferenceSetDigest: dark.reference_set_digest,
    message: 'Shadow comparison requires the same ordered verified artifact reference set',
  });
}
