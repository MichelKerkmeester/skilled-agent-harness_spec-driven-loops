// ───────────────────────────────────────────────────────────────────
// MODULE: In-Flight State Migration Envelope
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes, canonicalJson, sha256Bytes } from '../event-envelope/index.js';
import { classificationFreshnessDigest } from '../inflight-state-classification/index.js';
import {
  AtomicityDomains,
  ProtectedResourceKinds,
  canonicalizeProtectedResource,
} from '../locks-and-fencing/index.js';
import { InflightMigrationError, InflightMigrationErrorCodes } from './migration-types.js';

import type {
  ClassificationEvidence,
  ClassifiedInflightStateRow,
  InflightClassificationManifest,
  InflightDisposition as InflightDispositionType,
} from '../inflight-state-classification/index.js';
import type { MigrationEnvelope, MigrationEnvelopeCore } from './migration-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const SHA256_PATTERN = /^[a-f0-9]{64}$/u;
/** Stable sentinel for a degenerate block envelope with no live source evidence, mirroring GENESIS_RECORD_HASH's zero-fill convention. */
const EMPTY_DIGEST_SENTINEL = '0'.repeat(64);
const UNKNOWN_ANCHOR_SENTINEL = 'unknown-rollback-anchor';

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as never));
}

function isDigest(value: unknown): value is string {
  return typeof value === 'string' && SHA256_PATTERN.test(value);
}

// ───────────────────────────────────────────────────────────────────
// 2. RESOURCE RESOLUTION
// ───────────────────────────────────────────────────────────────────

/**
 * One canonical WRITER resource per migration row, matching the existing
 * "serialize a bookkeeping mutation" pattern already used for the loop-lock
 * owner and the CLI graph writer rather than inventing a new protected
 * resource kind for this dark, additive coordinator.
 */
export function resolveMigrationResource(rowId: string) {
  return canonicalizeProtectedResource({
    kind: ProtectedResourceKinds.WRITER,
    components: { writerId: `inflight-state-migration:${rowId}` },
    atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
  });
}

function migrationId(manifestDigest: string, rowId: string): string {
  return `inflight-migration:${digest({ manifestDigest, rowId })}`;
}

// ───────────────────────────────────────────────────────────────────
// 3. BUILD
// ───────────────────────────────────────────────────────────────────

/**
 * Bind one row's live evidence to the frozen manifest. Deterministic in
 * every field except `envelopeDigest` itself, so two attempts for the same
 * manifest+row+operation+evidence produce byte-identical envelopes — the
 * property the coordinator's idempotent resume depends on.
 */
export function buildMigrationEnvelope(
  manifest: InflightClassificationManifest,
  row: ClassifiedInflightStateRow,
  operationClass: InflightDispositionType,
  currentEvidence: ClassificationEvidence,
): MigrationEnvelope {
  const freshnessDigest = classificationFreshnessDigest(currentEvidence);
  const id = migrationId(manifest.finalDigest, row.rowId);
  const core: MigrationEnvelopeCore = Object.freeze({
    envelopeVersion: 1,
    migrationId: id,
    rowId: row.rowId,
    classificationManifestDigest: manifest.finalDigest,
    operationClass,
    sourceDigest: currentEvidence.stateDigest,
    authorityEpoch: currentEvidence.authorityEpoch,
    resource: resolveMigrationResource(row.rowId),
    rollbackAnchorId: currentEvidence.rollbackAnchor.anchorId,
    rollbackAnchorDigest: currentEvidence.rollbackAnchor.digest,
    idempotencyKey: digest({
      migrationId: id,
      manifestDigest: manifest.finalDigest,
      rowId: row.rowId,
      operationClass,
      freshnessDigest,
    }),
  });
  return Object.freeze({ ...core, envelopeDigest: digest(core) });
}

/**
 * Degenerate envelope for a row that never reaches a live-evidence-bearing
 * operation: either the manifest already froze it as `BLOCK`, or fresh
 * evidence at migration time was missing, malformed, or stale. No live
 * source digest or rollback anchor exists to bind, so the sentinel values
 * make that explicit rather than reusing a real digest that would imply
 * evidence was actually read.
 */
export function buildBlockMigrationEnvelope(
  manifest: InflightClassificationManifest,
  row: ClassifiedInflightStateRow,
): MigrationEnvelope {
  const id = migrationId(manifest.finalDigest, row.rowId);
  const core: MigrationEnvelopeCore = Object.freeze({
    envelopeVersion: 1,
    migrationId: id,
    rowId: row.rowId,
    classificationManifestDigest: manifest.finalDigest,
    operationClass: 'BLOCK',
    sourceDigest: isDigest(row.evidence.stateDigest) ? row.evidence.stateDigest : EMPTY_DIGEST_SENTINEL,
    authorityEpoch: row.evidence.authorityEpoch ?? 0,
    resource: resolveMigrationResource(row.rowId),
    rollbackAnchorId: row.evidence.rollbackAnchorId ?? UNKNOWN_ANCHOR_SENTINEL,
    rollbackAnchorDigest: isDigest(row.evidence.rollbackAnchorDigest)
      ? row.evidence.rollbackAnchorDigest
      : EMPTY_DIGEST_SENTINEL,
    idempotencyKey: digest({
      migrationId: id,
      manifestDigest: manifest.finalDigest,
      rowId: row.rowId,
      operationClass: 'BLOCK',
      freshnessDigest: row.evidence.freshnessDigest,
    }),
  });
  return Object.freeze({ ...core, envelopeDigest: digest(core) });
}

// ───────────────────────────────────────────────────────────────────
// 4. FRESHNESS BINDING
// ───────────────────────────────────────────────────────────────────

/**
 * `classificationFreshnessDigest` alone does not cover the disposition
 * proof or verifier fields, so a row could pass freshness while its proof
 * or verifier evidence quietly drifted since classification. This closes
 * that gap: every field the frozen manifest row committed to must still
 * match before a live operation is allowed to run.
 */
export function evidenceMatchesFrozenRow(
  row: ClassifiedInflightStateRow,
  currentEvidence: ClassificationEvidence,
): boolean {
  if (classificationFreshnessDigest(currentEvidence) !== row.evidence.freshnessDigest) return false;
  if (digest(currentEvidence.proof) !== row.evidence.proofDigest) return false;
  return currentEvidence.verifier.receiptDigest === row.evidence.verifierReceiptDigest
    && currentEvidence.verifier.replayFingerprintDigest === row.evidence.replayFingerprintDigest
    && currentEvidence.verifier.rollbackScenarioDigest === row.evidence.rollbackScenarioDigest
    && currentEvidence.verifier.parityCaseDigest === row.evidence.parityCaseDigest;
}

// ───────────────────────────────────────────────────────────────────
// 5. VERIFY
// ───────────────────────────────────────────────────────────────────

/** Recompute and rebind every field; a tampered or malformed envelope fails closed. */
export function verifyMigrationEnvelope(envelope: MigrationEnvelope): boolean {
  try {
    const { envelopeDigest, ...core } = envelope;
    if (!isDigest(envelopeDigest) || digest(core) !== envelopeDigest) return false;
    if (
      core.envelopeVersion !== 1
      || typeof core.migrationId !== 'string'
      || core.migrationId.length === 0
      || typeof core.rowId !== 'string'
      || core.rowId.length === 0
      || !isDigest(core.classificationManifestDigest)
      || typeof core.operationClass !== 'string'
      || !isDigest(core.sourceDigest)
      || !Number.isSafeInteger(core.authorityEpoch)
      || core.authorityEpoch < 0
      || typeof core.rollbackAnchorId !== 'string'
      || core.rollbackAnchorId.length === 0
      || !isDigest(core.rollbackAnchorDigest)
      || !isDigest(core.idempotencyKey)
    ) return false;
    const expectedResource = resolveMigrationResource(core.rowId);
    if (canonicalJson(core.resource) !== canonicalJson(expectedResource)) return false;
    return core.migrationId === migrationId(core.classificationManifestDigest, core.rowId);
  } catch {
    return false;
  }
}

/** Fail closed rather than silently accept a resumed attempt whose recomputed envelope drifted. */
export function assertEnvelopeContinuity(
  previous: MigrationEnvelope | null,
  next: MigrationEnvelope,
): void {
  if (previous === null) return;
  if (previous.envelopeDigest !== next.envelopeDigest) {
    throw new InflightMigrationError(
      InflightMigrationErrorCodes.ENVELOPE_CONFLICT,
      'A resumed migration attempt recomputed a different envelope than the one already on record',
      { rowId: next.rowId, migrationId: next.migrationId },
    );
  }
}
