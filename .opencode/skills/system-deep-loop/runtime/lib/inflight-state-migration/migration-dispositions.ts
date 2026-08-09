// ───────────────────────────────────────────────────────────────────
// MODULE: In-Flight State Migration Disposition Executors
// ───────────────────────────────────────────────────────────────────

import { join } from 'node:path';

import { appendAuthorizedThroughFence } from '../locks-and-fencing/fenced-ledger-writer.js';
import { canonicalBytes, EventTypeRegistry, prepareEventWrite, sha256Bytes } from '../event-envelope/index.js';
import { writeCanonicalJsonAtomic } from '../locks-and-fencing/durable-file.js';
import { InflightMigrationError, InflightMigrationErrorCodes } from './migration-types.js';

import type {
  DurableAppendReceipt,
} from '../authorized-ledger/index.js';
import type {
  DispositionProof,
} from '../inflight-state-classification/index.js';
import type {
  EventProducer,
  EventTypeDefinition,
  EventWritePreflight,
  JsonObject,
} from '../event-envelope/index.js';
import type {
  BlockOutcome,
  ForkOutcome,
  InflightMigrationCheckpointFacts,
  MigrateOutcome,
  MigrationEnvelope,
  MigrationLedgerContext,
  PinOutcome,
  UpcastOutcome,
} from './migration-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. HELPERS
// ───────────────────────────────────────────────────────────────────

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as never));
}

function artifactRoot(rootDirectory: string): string {
  return join(rootDirectory, 'inflight-state-migration-v1');
}

function mismatch(
  envelope: MigrationEnvelope,
  expectedKind: string,
  actualKind: string,
): InflightMigrationError {
  return new InflightMigrationError(
    InflightMigrationErrorCodes.DISPOSITION_MISMATCH,
    'Fresh evidence proof kind does not match the envelope operation class',
    {
      rowId: envelope.rowId,
      migrationId: envelope.migrationId,
      expectedKind,
      actualKind,
    },
  );
}

// ───────────────────────────────────────────────────────────────────
// 2. UPCAST — logical shape conversion, source bytes preserved
// ───────────────────────────────────────────────────────────────────

/**
 * Materializes the already-proven effective shape as a temporary versioned
 * artifact bound to the source digest. The source itself is never opened or
 * rewritten; only a digest-addressed evidentiary record is written, under
 * the caller's already-revalidated fence.
 */
export function executeUpcast(
  envelope: MigrationEnvelope,
  proof: DispositionProof,
  rootDirectory: string,
): UpcastOutcome {
  if (proof.kind !== 'upcast') throw mismatch(envelope, 'upcast', proof.kind);
  const artifact = Object.freeze({
    envelopeDigest: envelope.envelopeDigest,
    sourceBytesDigest: proof.sourceBytesDigest,
    effectiveStateDigest: proof.effectiveStateDigest,
    registryDigest: proof.registryDigest,
    chainIdentitiesDigest: proof.chainIdentitiesDigest,
  });
  writeCanonicalJsonAtomic(
    join(artifactRoot(rootDirectory), 'upcast-snapshots', `${envelope.migrationId}.json`),
    artifact as unknown as JsonObject,
  );
  return Object.freeze({
    kind: 'upcast',
    sourceBytesDigest: proof.sourceBytesDigest,
    effectiveStateDigest: proof.effectiveStateDigest,
    snapshotArtifactDigest: digest(artifact),
  });
}

// ───────────────────────────────────────────────────────────────────
// 3. FORK — isolated dark copy, source immutable
// ───────────────────────────────────────────────────────────────────

/** Writes a disposable dark artifact into an isolated namespace; the live source is never touched. */
export function executeFork(
  envelope: MigrationEnvelope,
  proof: DispositionProof,
  parityCaseDigest: string,
  rootDirectory: string,
): ForkOutcome {
  if (proof.kind !== 'fork') throw mismatch(envelope, 'fork', proof.kind);
  const artifact = Object.freeze({
    envelopeDigest: envelope.envelopeDigest,
    executionNamespace: proof.executionNamespace,
    effectNamespace: proof.effectNamespace,
    shadowOnlySink: proof.shadowOnlySink,
    parityCaseDigest,
  });
  writeCanonicalJsonAtomic(
    join(artifactRoot(rootDirectory), 'dark-forks', `${envelope.migrationId}.json`),
    artifact as unknown as JsonObject,
  );
  return Object.freeze({
    kind: 'fork',
    executionNamespace: proof.executionNamespace,
    effectNamespace: proof.effectNamespace,
    parityCaseDigest,
    darkArtifactDigest: digest(artifact),
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. PIN — legacy-authoritative admission, no state transformation
// ───────────────────────────────────────────────────────────────────

/** No file write: the admission record lives entirely inside the migration receipt. */
export function executePin(envelope: MigrationEnvelope, proof: DispositionProof): PinOutcome {
  if (proof.kind !== 'pin') throw mismatch(envelope, 'pin', proof.kind);
  const admission = Object.freeze({
    envelopeDigest: envelope.envelopeDigest,
    terminalBoundary: proof.terminalBoundary,
    terminalReceiptRequired: proof.terminalReceiptRequired,
  });
  return Object.freeze({
    kind: 'pin',
    terminalBoundary: proof.terminalBoundary,
    admissionDigest: digest(admission),
  });
}

// ───────────────────────────────────────────────────────────────────
// 5. BLOCK — veto only, no transform
// ───────────────────────────────────────────────────────────────────

export function executeBlock(veto: string, blockReasonCode: string): BlockOutcome {
  return Object.freeze({ kind: 'block', veto, blockReasonCode });
}

// ───────────────────────────────────────────────────────────────────
// 6. MIGRATE — quiescent checkpoint import through the fenced ledger seam
// ───────────────────────────────────────────────────────────────────

export const INFLIGHT_MIGRATION_CHECKPOINT_EVENT_TYPE = 'deep-loop-inflight-migration.ledger.checkpoint-imported';
const INFLIGHT_MIGRATION_CHECKPOINT_SCHEMA_VERSION = 1 as const;

function isInflightMigrationCheckpointPayload(payload: Readonly<JsonObject>): boolean {
  const facts = payload.checkpointFacts;
  return typeof facts === 'object'
    && facts !== null
    && !Array.isArray(facts)
    && (facts as JsonObject).schemaVersion === INFLIGHT_MIGRATION_CHECKPOINT_SCHEMA_VERSION
    && typeof (facts as JsonObject).migrationId === 'string'
    && typeof (facts as JsonObject).checkpointDigest === 'string';
}

/** Register the one event type a checkpoint import is written as. */
export function createInflightMigrationCheckpointEventRegistry(): EventTypeRegistry {
  const definition: EventTypeDefinition = {
    eventType: INFLIGHT_MIGRATION_CHECKPOINT_EVENT_TYPE,
    currentVersion: 1,
    versions: [{
      version: 1,
      payload: {
        requiredFields: ['checkpointFacts'],
        validate: isInflightMigrationCheckpointPayload,
      },
    }],
    upcasters: [],
  };
  return new EventTypeRegistry([definition]);
}

/** Pure fact binding; no state transformation and no ledger access. */
export function buildInflightMigrationCheckpointFacts(
  envelope: MigrationEnvelope,
  proof: DispositionProof,
  importedAt: string,
): InflightMigrationCheckpointFacts {
  if (proof.kind !== 'migrate') throw mismatch(envelope, 'migrate', proof.kind);
  return Object.freeze({
    schemaVersion: INFLIGHT_MIGRATION_CHECKPOINT_SCHEMA_VERSION,
    migrationId: envelope.migrationId,
    rowId: envelope.rowId,
    classificationManifestDigest: envelope.classificationManifestDigest,
    checkpointDigest: proof.checkpointDigest,
    restorationReceiptDigest: proof.restorationReceiptDigest,
    importedAt,
  });
}

export interface InflightMigrationCheckpointEnvelopeFields {
  readonly eventId: string;
  readonly streamId: string;
  readonly streamSequence: number;
  readonly occurredAt: string;
  readonly recordedAt: string;
  readonly producer: EventProducer;
  readonly authorityEpoch: number;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly idempotencyKey: string;
}

/** Build the write-preflight for one checkpoint-import event, current version only. */
export function prepareInflightMigrationCheckpointEventWrite(
  facts: InflightMigrationCheckpointFacts,
  fields: InflightMigrationCheckpointEnvelopeFields,
  registry: EventTypeRegistry,
): EventWritePreflight {
  return prepareEventWrite({
    envelope_version: 1,
    event_id: fields.eventId,
    event_type: INFLIGHT_MIGRATION_CHECKPOINT_EVENT_TYPE,
    event_version: 1,
    stream_id: fields.streamId,
    stream_sequence: fields.streamSequence,
    occurred_at: fields.occurredAt,
    recorded_at: fields.recordedAt,
    producer: fields.producer,
    authority_epoch: fields.authorityEpoch,
    correlation_id: fields.correlationId,
    causation_id: fields.causationId,
    idempotency_key: fields.idempotencyKey,
    payload: { checkpointFacts: facts },
  }, registry);
}

/**
 * Append exactly one checkpoint-import event through the existing fenced,
 * gateway-authorized append seam (`appendAuthorizedThroughFence`). This
 * function never appends any other event type, and it never re-derives or
 * bypasses the caller-supplied gateway proof: the caller obtains that proof
 * from the transition-authorization gateway it already owns, matching how
 * every other guarded ledger writer in this runtime is authorized.
 */
export async function appendInflightMigrationCheckpointEvent(
  ledgerContext: MigrationLedgerContext,
): Promise<DurableAppendReceipt> {
  const { ledger, checkpointFacts, event, proof } = ledgerContext;
  if (event.identity.eventType !== INFLIGHT_MIGRATION_CHECKPOINT_EVENT_TYPE) {
    throw new TypeError('Inflight migration checkpoint append received an event of a different type');
  }
  return appendAuthorizedThroughFence(ledger, event, proof);
}

/** Bind the fenced ledger append into one migration outcome. */
export async function executeMigrate(
  envelope: MigrationEnvelope,
  proof: DispositionProof,
  ledgerContext: MigrationLedgerContext,
): Promise<MigrateOutcome> {
  if (proof.kind !== 'migrate') throw mismatch(envelope, 'migrate', proof.kind);
  if (
    ledgerContext.checkpointFacts.migrationId !== envelope.migrationId
    || ledgerContext.checkpointFacts.rowId !== envelope.rowId
    || ledgerContext.checkpointFacts.classificationManifestDigest !== envelope.classificationManifestDigest
    || ledgerContext.checkpointFacts.checkpointDigest !== proof.checkpointDigest
    || ledgerContext.checkpointFacts.restorationReceiptDigest !== proof.restorationReceiptDigest
  ) {
    throw new InflightMigrationError(
      InflightMigrationErrorCodes.LEDGER_CONTEXT_MISMATCHED,
      'Supplied ledger checkpoint facts do not match this envelope and disposition proof',
      { rowId: envelope.rowId, migrationId: envelope.migrationId },
    );
  }
  const receipt = await appendInflightMigrationCheckpointEvent(ledgerContext);
  return Object.freeze({
    kind: 'migrate',
    checkpointDigest: proof.checkpointDigest,
    restorationReceiptDigest: proof.restorationReceiptDigest,
    ledgerEventId: receipt.event_id,
    ledgerAppendReceiptDigest: digest(receipt),
  });
}
