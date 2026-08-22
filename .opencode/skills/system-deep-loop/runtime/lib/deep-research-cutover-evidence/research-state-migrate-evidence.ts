// ───────────────────────────────────────────────────────────────────
// MODULE: Research State Migrate Evidence
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  readEvent,
  sha256Bytes,
} from '../event-envelope/index.js';
import { AppendOnlyLedger } from '../authorized-ledger/index.js';
import {
  AuthorizationVerdicts,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../authorized-ledger/index.js';
import {
  createDeepResearchEventRegistry,
} from '../deep-research-ledger-schema/index.js';
import { createDeepResearchProjectionContract } from '../legacy-projections/index.js';
import {
  deriveRestartClassificationEvidence,
} from '../inflight-state-classification/restart-classification-evidence.js';
import { FROZEN_CENSUS_ROW_POLICIES } from '../inflight-state-classification/frozen-census-policy.js';
import type {
  ClassificationEvidence,
  MigrateProof,
} from '../inflight-state-classification/inflight-state-types.js';
import {
  appendInflightMigrationCheckpointEvent,
  buildInflightMigrationCheckpointFacts,
  createInflightMigrationCheckpointEventRegistry,
  prepareInflightMigrationCheckpointEventWrite,
} from '../inflight-state-migration/index.js';
import { resolveMigrationResource } from '../inflight-state-migration/migration-envelope.js';
import type {
  InflightMigrationCheckpointFacts,
  MigrationEnvelope,
  MigrationLedgerContext,
} from '../inflight-state-migration/migration-types.js';
import {
  observeRestartFacts,
} from '../restart-observation/restart-facts-reader.js';
import {
  AtomicityDomains,
  FencedLedgerWriter,
  FencedLeaseCoordinator,
  ProtectedResourceKinds,
} from '../locks-and-fencing/index.js';

import type {
  AuthoritySnapshot,
  DurableAppendReceipt,
  PolicyEvaluationResult,
  TransitionAuthorizationRequest,
} from '../authorized-ledger/index.js';
import type {
  EventReadResult,
  EventWritePreflight,
  JsonObject,
} from '../event-envelope/index.js';
import type {
  LedgerReadPort,
  ObserveRestartFactsOptions,
  RestartLeaseObservation,
} from '../restart-observation/restart-facts-reader.js';

// ───────────────────────────────────────────────────────────────────
// 1. PUBLIC INPUTS
// ───────────────────────────────────────────────────────────────────

/** Import result with the number of real checkpoint-seam calls it performed. */
export interface ResearchStateCheckpointImportResult {
  readonly receipt: DurableAppendReceipt;
  readonly appendCount: number;
}

/** Real checkpoint-import context exposed for focused seam perturbation tests. */
export interface ResearchStateCheckpointImportContext {
  readonly migration: MigrationLedgerContext;
  readonly attempt: number;
}

/** Optional importer used to observe a deliberately perturbed checkpoint seam. */
export type ResearchStateCheckpointImporter = (
  context: ResearchStateCheckpointImportContext,
) => Promise<ResearchStateCheckpointImportResult>;

/**
 * Real source and observation inputs for one research-state migration drill.
 * The optional transforms are observation-boundary controls: production uses
 * none, while focused tests can perturb one observed input without changing
 * the derivation or directly supplying a proof flag.
 */
export interface ResearchStateMigrateSeed {
  readonly runDirectory: string;
  readonly restart: ObserveRestartFactsOptions;
  readonly lifecycle: string;
  readonly mutability: string;
  readonly importLedgerId: string;
  readonly importAuditLedgerId: string;
  readonly importedAt: string;
  readonly classificationManifestDigest?: string;
  readonly checkpointEventTransform?: (
    events: readonly EventReadResult[],
  ) => readonly EventReadResult[];
  readonly checkpointByteTransform?: (bytes: Uint8Array) => Uint8Array;
  readonly checkpointLeaseObservation?: () => readonly RestartLeaseObservation[];
  readonly importCheckpoint?: ResearchStateCheckpointImporter;
}

interface SourceObservation {
  readonly events: readonly EventReadResult[];
  readonly checkpointBytes: Uint8Array;
  readonly checkpointDigest: string;
  readonly parsedCheckpoint: readonly unknown[] | null;
  readonly transactionalSnapshot: boolean;
}

interface ProjectionObservation {
  readonly events: readonly EventReadResult[] | null;
  readonly stateBytes: Uint8Array | null;
  readonly stateDigest: string;
}

interface ImportAttempt {
  readonly result: ResearchStateCheckpointImportResult | null;
  readonly error: unknown | null;
}

const RESEARCH_STATE_ROW_ID = 'research-state';
const RESTORE_STEP = 'deep-research-state-checkpoint-restore@1';
const BUDGET_FIELDS = Object.freeze(['budgetRef', 'expectedCost', 'reservationRef'] as const);
const RECEIPT_FIELDS = Object.freeze([
  'recoveryReceiptRef',
  'retrievalReceiptRef',
  'synthesisReceiptRef',
  'persistenceReceiptRefs',
] as const);

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as never));
}

function bytesEqual(left: readonly number[] | Uint8Array, right: readonly number[] | Uint8Array): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function payloadOf(event: EventReadResult): Record<string, unknown> {
  return event.effective.envelope.payload as Record<string, unknown>;
}

function dataOf(event: EventReadResult): Record<string, unknown> {
  const data = payloadOf(event).data;
  return isRecord(data) ? data : {};
}

function stemOf(event: EventReadResult): string | null {
  const stem = payloadOf(event).stem;
  return typeof stem === 'string' ? stem : null;
}

function scopeOf(event: EventReadResult): Record<string, unknown> {
  const scope = payloadOf(event).scope;
  return isRecord(scope) ? scope : {};
}

function checkpointBytes(events: readonly EventReadResult[]): Uint8Array {
  return Uint8Array.from(canonicalBytes(events.map((event) => event.effective.envelope) as never));
}

function parseCheckpoint(bytes: Uint8Array): readonly unknown[] | null {
  try {
    const parsed = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(bytes))) as unknown;
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function captureSource(
  events: readonly EventReadResult[],
  seed: ResearchStateMigrateSeed,
): SourceObservation {
  const transformedEvents = seed.checkpointEventTransform?.(events) ?? events;
  const capturedBytes = checkpointBytes(transformedEvents);
  const transformedBytes = seed.checkpointByteTransform?.(Uint8Array.from(capturedBytes))
    ?? capturedBytes;
  const parsedCheckpoint = parseCheckpoint(transformedBytes);
  const canonicalParsed = parsedCheckpoint === null
    ? null
    : canonicalBytes(parsedCheckpoint as never);
  return {
    events,
    checkpointBytes: transformedBytes,
    checkpointDigest: sha256Bytes(transformedBytes),
    parsedCheckpoint,
    transactionalSnapshot: canonicalParsed !== null && bytesEqual(transformedBytes, canonicalParsed),
  };
}

function restoreProjection(
  parsedCheckpoint: readonly unknown[] | null,
  registry: ReturnType<typeof createDeepResearchEventRegistry>,
  ledgerId: string,
): ProjectionObservation {
  if (parsedCheckpoint === null) {
    const errorDigest = digest({ step: RESTORE_STEP, outcome: 'unreadable-checkpoint' });
    return { events: null, stateBytes: null, stateDigest: errorDigest };
  }
  try {
    const events = parsedCheckpoint.map((record) => (
      readEvent(canonicalBytes(record as never), registry)
    ));
    const contract = createDeepResearchProjectionContract({ ledgerId });
    const state = events.reduce(
      (current, event) => contract.reduce(current, event),
      contract.base.state,
    );
    const stateBytes = contract.serialize(state);
    return {
      events,
      stateBytes,
      stateDigest: sha256Bytes(stateBytes),
    };
  } catch (error) {
    const errorDigest = digest({
      step: RESTORE_STEP,
      outcome: 'restore-failed',
      error: error instanceof Error ? error.message : String(error),
    });
    return { events: null, stateBytes: null, stateDigest: errorDigest };
  }
}

function foldProjection(
  events: readonly EventReadResult[],
  ledgerId: string,
): Uint8Array {
  const contract = createDeepResearchProjectionContract({ ledgerId });
  const state = events.reduce(
    (current, event) => contract.reduce(current, event),
    contract.base.state,
  );
  return contract.serialize(state);
}

function identityKeys(events: readonly EventReadResult[]): readonly string[] {
  return events.map((event) => {
    const scope = scopeOf(event);
    return digest({
      runId: scope.runId,
      lineageId: scope.lineageId,
      streamId: event.effective.envelope.stream_id,
    });
  }).sort();
}

function orderedKeys(events: readonly EventReadResult[]): readonly string[] {
  return events.map((event) => digest({
    eventId: event.effective.envelope.event_id,
    streamSequence: event.effective.envelope.stream_sequence,
  }));
}

function gapFree(events: readonly EventReadResult[]): boolean {
  return events.every(
    (event, index) => event.effective.envelope.stream_sequence === index + 1,
  );
}

function observedSet(
  values: readonly unknown[],
): readonly string[] {
  return [...new Set(values.map((value) => digest(value)))].sort();
}

function budgetSet(events: readonly EventReadResult[]): readonly string[] {
  const values: unknown[] = [];
  for (const event of events) {
    const data = dataOf(event);
    for (const field of BUDGET_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(data, field)) {
        values.push({ field, value: data[field] });
      }
    }
  }
  return observedSet(values);
}

function receiptSet(
  events: readonly EventReadResult[],
  effectReceipts: readonly string[],
): readonly string[] {
  const values: unknown[] = effectReceipts.map((effectId) => ({ field: 'effectId', value: effectId }));
  for (const event of events) {
    const data = dataOf(event);
    for (const field of RECEIPT_FIELDS) {
      const value = data[field];
      if (typeof value === 'string') values.push({ field, value });
      if (Array.isArray(value)) {
        value.filter((entry): entry is string => typeof entry === 'string')
          .forEach((entry) => values.push({ field, value: entry }));
      }
    }
  }
  return observedSet(values);
}

function pendingWorkSet(events: readonly EventReadResult[]): readonly string[] {
  const started = events
    .filter((event) => stemOf(event) === 'deep_research.iteration_started'
      || stemOf(event) === 'deep_research.memory_save_requested')
    .map((event) => event.effective.envelope.event_id);
  const completed = new Set(
    events
      .filter((event) => stemOf(event) === 'deep_research.iteration_completed'
        || stemOf(event) === 'deep_research.memory_save_completed')
      .map((event) => event.effective.envelope.causation_id)
      .filter((value): value is string => value !== null),
  );
  return started.filter((eventId) => !completed.has(eventId)).sort();
}

function restorationReceiptDigest(
  checkpointDigest: string,
  observation: ProjectionObservation,
): string {
  return digest({
    step: RESTORE_STEP,
    checkpointDigest,
    restoredStateDigest: observation.stateDigest,
    restoredEventIds: observation.events?.map((event) => event.effective.envelope.event_id) ?? [],
  });
}

function importEnvelope(
  sourceDigest: string,
  checkpointDigest: string,
  classificationManifestDigest: string,
  anchorId: string,
  anchorDigest: string,
  importLedgerId: string,
): MigrationEnvelope {
  const migrationId = `inflight-migration:${digest({
    rowId: RESEARCH_STATE_ROW_ID,
    sourceDigest,
    checkpointDigest,
    importLedgerId,
  })}`;
  const core = {
    envelopeVersion: 1 as const,
    migrationId,
    rowId: RESEARCH_STATE_ROW_ID,
    classificationManifestDigest,
    operationClass: 'MIGRATE' as const,
    sourceDigest,
    authorityEpoch: 1,
    resource: resolveMigrationResource(RESEARCH_STATE_ROW_ID),
    rollbackAnchorId: anchorId,
    rollbackAnchorDigest: anchorDigest,
    idempotencyKey: digest({ migrationId, checkpointDigest }),
  };
  return Object.freeze({ ...core, envelopeDigest: digest(core) });
}

function provisionalProof(
  checkpointDigest: string,
  restorationDigest: string,
): MigrateProof {
  return {
    kind: 'migrate',
    checkpointDigest,
    restorationReceiptDigest: restorationDigest,
  } as MigrateProof;
}

async function createImportContext(
  seed: ResearchStateMigrateSeed,
  envelope: MigrationEnvelope,
  proof: MigrateProof,
  sourceStateBytes: Uint8Array,
): Promise<MigrationLedgerContext> {
  const registry = createInflightMigrationCheckpointEventRegistry();
  const authority: AuthoritySnapshot = { state: 'legacy_authoritative', epoch: 1 };
  const ledger = new AppendOnlyLedger({
    rootDirectory: seed.runDirectory,
    ledgerId: seed.importLedgerId,
    auditLedgerId: seed.importAuditLedgerId,
    authorityProvider: () => authority,
    now: () => new Date(seed.importedAt),
  }, registry);
  const policies = new TransitionPolicyRegistry([{
    policyId: 'research-state-migrate-evidence-policy',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['checkpoint-import'],
    evaluate: (): PolicyEvaluationResult => ({
      verdict: AuthorizationVerdicts.ALLOW,
      reasonCode: 'allowed',
      matchedRuleIds: ['checkpoint-import'],
    }),
  }]);
  const policy = policies.resolve('research-state-migrate-evidence-policy', 1);
  const facts = buildInflightMigrationCheckpointFacts(
    envelope,
    provisionalProof(proof.checkpointDigest, proof.restorationReceiptDigest),
    seed.importedAt,
  );
  const event = prepareInflightMigrationCheckpointEventWrite(facts, {
    eventId: `checkpoint-import-${seed.importLedgerId}`,
    streamId: `inflight-migration:${RESEARCH_STATE_ROW_ID}`,
    streamSequence: 1,
    occurredAt: seed.importedAt,
    recordedAt: seed.importedAt,
    producer: { name: 'research-state-migrate-evidence', version: '1' },
    authorityEpoch: authority.epoch,
    correlationId: `research-state-migrate:${seed.importLedgerId}`,
    causationId: null,
    idempotencyKey: envelope.idempotencyKey,
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory: seed.runDirectory,
    auditLedgerId: seed.importAuditLedgerId,
    authorityProvider: () => authority,
    now: () => new Date(seed.importedAt),
    identityResolver: ({ evaluationInput }) => ({
      actorId: evaluationInput.actorId,
      capabilityId: evaluationInput.capabilityId,
      evidenceDigest: evaluationInput.evidenceDigest,
    }),
  }, ledger, policies);
  const priorHead = await ledger.getVerifiedHead();
  const request: TransitionAuthorizationRequest = {
    requestId: `request-${seed.importLedgerId}`,
    mode: 'research',
    event,
    priorHead,
    priorStateVersion: 'deep-research-state@1',
    priorStateFingerprint: sha256Bytes(sourceStateBytes),
    actorId: 'research-state-migrate-evidence',
    capabilityId: 'checkpoint-import',
    authorityEpoch: authority.epoch,
    policy: {
      policyId: policy.policyId,
      policyVersion: policy.policyVersion,
      policyDigest: policy.digest,
    },
    evidenceDigest: digest(facts),
  };
  const authorization = await gateway.authorize(request);
  if (authorization.verdict !== AuthorizationVerdicts.ALLOW) {
    throw new Error(`checkpoint-import authorization denied: ${authorization.reasonCode}`);
  }
  return { ledger, checkpointFacts: facts, event, proof: authorization.proof };
}

async function runImportAttempt(
  seed: ResearchStateMigrateSeed,
  migration: MigrationLedgerContext,
  attempt: number,
): Promise<ImportAttempt> {
  try {
    const importer = seed.importCheckpoint ?? (async (
      context: ResearchStateCheckpointImportContext,
    ): Promise<ResearchStateCheckpointImportResult> => ({
      receipt: context.attempt === 1
        ? await appendInflightMigrationCheckpointEvent(context.migration)
        : await retryResearchStateCheckpointImport(context.migration),
      appendCount: 1,
    }));
    return { result: await importer({ migration, attempt }), error: null };
  } catch (error) {
    return { result: null, error };
  }
}

/** Retry the same checkpoint through the fenced writer so ledger idempotency is observable after the first head advances. */
export async function retryResearchStateCheckpointImport(
  migration: MigrationLedgerContext,
): Promise<DurableAppendReceipt> {
  const coordinator = new FencedLeaseCoordinator({ rootDirectory: migration.ledger.rootDirectory });
  const resource = Object.freeze({
    kind: ProtectedResourceKinds.LEDGER,
    atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
    components: Object.freeze({ ledgerId: migration.ledger.ledgerId }),
  });
  const lease = await coordinator.acquire({
    resource,
    ownerId: 'research-state-migrate-evidence-retry',
    correlationId: `checkpoint-retry:${migration.event.identity.eventId}`,
    ttlMs: 30_000,
  });
  try {
    const writer = new FencedLedgerWriter(coordinator);
    return await writer.append({
      lease,
      ledger: migration.ledger,
      event: migration.event,
      proof: migration.proof,
      expectedHead: await migration.ledger.getVerifiedHead(),
    });
  } finally {
    await coordinator.release(lease).catch(() => undefined);
  }
}

function sameReceipt(
  left: DurableAppendReceipt,
  right: DurableAppendReceipt,
): boolean {
  return left.ledger_id === right.ledger_id
    && left.sequence === right.sequence
    && left.event_id === right.event_id
    && left.recordHash === right.recordHash
    && left.canonicalEventHash === right.canonicalEventHash;
}

// ───────────────────────────────────────────────────────────────────
// 3. PUBLIC PRODUCER
// ───────────────────────────────────────────────────────────────────

/**
 * Observe a real quiescent research-state checkpoint, fenced import, and
 * restore before deriving the migration evidence consumed by classification.
 */
export async function deriveResearchStateMigrateEvidence(
  seed: ResearchStateMigrateSeed,
): Promise<ClassificationEvidence> {
  const restartFacts = await observeRestartFacts(seed.restart);
  const restartEvidence = deriveRestartClassificationEvidence({
    rowId: RESEARCH_STATE_ROW_ID,
    lifecycle: seed.lifecycle,
    mutability: seed.mutability,
    restart: restartFacts,
  });
  const sourceLedger: LedgerReadPort = seed.restart.modeLedger();
  const verifiedSourceEvents = await sourceLedger.readVerifiedEvents();
  const sourceEvents = verifiedSourceEvents.map((entry) => {
    const event = (entry as { readonly event: EventReadResult }).event;
    return event;
  });
  const source = captureSource(sourceEvents, seed);
  const registry = createDeepResearchEventRegistry();
  const sourceLedgerId = sourceEvents[0]?.effective.envelope.stream_id ?? RESEARCH_STATE_ROW_ID;
  const originalStateBytes = foldProjection(sourceEvents, sourceLedgerId);
  const previewRestore = restoreProjection(source.parsedCheckpoint, registry, sourceLedgerId);
  const restoreDigest = restorationReceiptDigest(source.checkpointDigest, previewRestore);
  const sourceDigest = digest(sourceEvents.map((event) => event.effective.canonicalDigest));
  const manifestDigest = seed.classificationManifestDigest
    ?? digest({
      rowId: RESEARCH_STATE_ROW_ID,
      sourceDigest,
      restartStateDigest: restartEvidence.stateDigest,
    });
  const envelope = importEnvelope(
    sourceDigest,
    source.checkpointDigest,
    manifestDigest,
    restartEvidence.rollbackAnchor.anchorId,
    restartEvidence.rollbackAnchor.digest,
    seed.importLedgerId,
  );
  const migration = await createImportContext(
    seed,
    envelope,
    provisionalProof(source.checkpointDigest, restoreDigest),
    originalStateBytes,
  );
  const beforeImport = await migration.ledger.readVerifiedEvents();
  const firstImport = await runImportAttempt(seed, migration, 1);
  const afterFirstImport = await migration.ledger.readVerifiedEvents();
  const secondImport = await runImportAttempt(seed, migration, 2);
  const afterSecondImport = await migration.ledger.readVerifiedEvents();
  const restored = restoreProjection(source.parsedCheckpoint, registry, sourceLedgerId);
  const restoredStateBytes = restored.stateBytes;
  const quiescentLeases = seed.checkpointLeaseObservation?.() ?? restartFacts.leases;
  const quiescentCheckpoint = restartFacts.pendingEffects.length === 0
    && quiescentLeases.every((lease) => lease.state !== 'active' && lease.state !== 'uncertain');
  const atomicImport = firstImport.result !== null
    && firstImport.result.appendCount === 1
    && beforeImport.length === 0
    && afterFirstImport.length === 1
    && firstImport.result.receipt.sequence === 1;
  const idempotencyPreserved = firstImport.result !== null
    && secondImport.result !== null
    && secondImport.result.appendCount === 1
    && sameReceipt(firstImport.result.receipt, secondImport.result.receipt)
    && afterSecondImport.length === afterFirstImport.length;
  const identityPreserved = restored.events !== null
    && bytesEqual(
      Uint8Array.from(canonicalBytes(identityKeys(sourceEvents) as never)),
      Uint8Array.from(canonicalBytes(identityKeys(restored.events) as never)),
    );
  const orderPreserved = restored.events !== null
    && gapFree(sourceEvents)
    && gapFree(restored.events)
    && bytesEqual(
      Uint8Array.from(canonicalBytes(orderedKeys(sourceEvents) as never)),
      Uint8Array.from(canonicalBytes(orderedKeys(restored.events) as never)),
    );
  const originalBudgets = budgetSet(sourceEvents);
  const restoredBudgets = restored.events === null ? [] : budgetSet(restored.events);
  const budgetsPreserved = restored.events !== null
    && bytesEqual(
      Uint8Array.from(canonicalBytes(originalBudgets as never)),
      Uint8Array.from(canonicalBytes(restoredBudgets as never)),
    );
  const originalReceipts = receiptSet(sourceEvents, restartFacts.receipts.map((receipt) => receipt.effectId));
  const restoredReceipts = restored.events === null
    ? []
    : receiptSet(restored.events, restartFacts.receipts.map((receipt) => receipt.effectId));
  const receiptsPreserved = restored.events !== null
    && bytesEqual(
      Uint8Array.from(canonicalBytes(originalReceipts as never)),
      Uint8Array.from(canonicalBytes(restoredReceipts as never)),
    );
  const originalPendingWork = pendingWorkSet(sourceEvents);
  const restoredPendingWork = restored.events === null ? [] : pendingWorkSet(restored.events);
  const pendingWorkPreserved = restored.events !== null
    && originalPendingWork.length === 0
    && restoredPendingWork.length === 0
    && bytesEqual(
      Uint8Array.from(canonicalBytes(originalPendingWork as never)),
      Uint8Array.from(canonicalBytes(restoredPendingWork as never)),
    );
  const reversible = restoredStateBytes !== null
    && bytesEqual(originalStateBytes, restoredStateBytes)
    && restored.stateDigest === previewRestore.stateDigest;
  const proof: MigrateProof = {
    kind: 'migrate',
    quiescentCheckpoint,
    transactionalSnapshot: source.transactionalSnapshot,
    atomicImport,
    reversible,
    identityPreserved,
    orderPreserved,
    idempotencyPreserved,
    budgetsPreserved,
    receiptsPreserved,
    pendingWorkPreserved,
    checkpointDigest: source.checkpointDigest,
    restorationReceiptDigest: restorationReceiptDigest(source.checkpointDigest, restored),
  };
  const budgetCoverage = originalBudgets.length > 0 && restoredBudgets.length > 0;
  const policy = FROZEN_CENSUS_ROW_POLICIES[RESEARCH_STATE_ROW_ID];
  if (policy.disposition !== 'MIGRATE') {
    throw new Error('research-state census policy is not MIGRATE');
  }
  return {
    ...restartEvidence,
    budgetCoverage,
    proof,
  };
}
