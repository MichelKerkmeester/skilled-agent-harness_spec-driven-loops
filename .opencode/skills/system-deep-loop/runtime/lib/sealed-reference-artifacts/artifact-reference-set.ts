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
} from './artifact-events.js';
import {
  SealedArtifactError,
  SealedArtifactErrorCodes,
} from './sealed-artifact-types.js';

import type { JsonObject } from '../event-envelope/index.js';
import type { VerifiedArtifactEvidence } from './artifact-events.js';
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

// ───────────────────────────────────────────────────────────────────
// 2. VERIFIED REFERENCE SETS
// ───────────────────────────────────────────────────────────────────

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
    payload.reference.qualified_digest !== evidence.artifact.reference.qualified_digest
    || payload.descriptor_digest !== evidence.artifact.reference.descriptor_digest
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

/** Adapt a verified set to the registered content-addressed replay-input seam. */
export function artifactReferenceSetReplayInput(
  referenceSet: ArtifactReferenceSet,
): ArtifactReplayInput {
  const value = referenceSet as unknown as JsonObject;
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
