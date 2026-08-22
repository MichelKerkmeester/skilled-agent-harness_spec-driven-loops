// ───────────────────────────────────────────────────────────────────
// MODULE: Research State Migrate Evidence Tests
// ───────────────────────────────────────────────────────────────────

import {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  AuthorizationVerdicts,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  canonicalBytes,
  CURRENT_ENVELOPE_VERSION,
  prepareEventWrite,
  readEvent,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  ClassificationReasonCodes,
  createClassificationManifest,
  deriveRestartClassificationEvidence,
  InflightDisposition,
} from '../../lib/inflight-state-classification/index.js';
import type {
  ClassificationEvidence,
  StateBackendCensus,
} from '../../lib/inflight-state-classification/index.js';
import {
  createDeepResearchEventRegistry,
  prepareDeepResearchEvent,
} from '../../lib/deep-research-ledger-schema/index.js';
import type {
  DeepResearchEventInput,
  DeepResearchEventStem,
  DeepResearchPayloadMap,
  DeepResearchScopeMap,
} from '../../lib/deep-research-ledger-schema/index.js';
import { createDeepResearchProjectionContract } from '../../lib/legacy-projections/index.js';
import {
  EFFECT_CONFIRMATION_EVENT_TYPE,
  EFFECT_INTENT_EVENT_TYPE,
  createEvidenceControlEventRegistry,
} from '../../lib/receipts-and-effect-recovery/index.js';
import { appendInflightMigrationCheckpointEvent } from '../../lib/inflight-state-migration/index.js';
import { observeRestartFacts } from '../../lib/restart-observation/restart-facts-reader.js';
import type { EventReadResult, EventTypeRegistry, EventWritePreflight } from '../../lib/event-envelope/index.js';
import type {
  AuthoritySnapshot,
  PolicyEvaluationResult,
  TransitionAuthorizationRequest,
} from '../../lib/authorized-ledger/index.js';
import type { ObserveRestartFactsOptions } from '../../lib/restart-observation/restart-facts-reader.js';
import {
  deriveResearchStateMigrateEvidence,
  retryResearchStateCheckpointImport,
} from '../../lib/deep-research-cutover-evidence/research-state-migrate-evidence.js';
import type {
  ResearchStateCheckpointImportContext,
  ResearchStateCheckpointImportResult,
  ResearchStateCheckpointImporter,
  ResearchStateMigrateSeed,
} from '../../lib/deep-research-cutover-evidence/research-state-migrate-evidence.js';
import { appendAuthorizedForTest } from '../fixtures/authorized-ledger-test-helper.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURE DATA
// ───────────────────────────────────────────────────────────────────

const TEST_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = resolve(TEST_DIRECTORY, '../../../../../..');
const CENSUS_PATH = join(
  REPOSITORY_ROOT,
  '.opencode/specs/system-deep-loop/036-deep-loop-innovation',
  '001-research-inputs-and-architecture/003-baseline-taxonomy-and-state-census/state-backend-census.json',
);
const CENSUS_BYTES = readFileSync(CENSUS_PATH);
const CENSUS = JSON.parse(CENSUS_BYTES.toString('utf8')) as StateBackendCensus;
const TIMESTAMP = '2026-08-22T10:00:00.000Z';
const RUN_ID = 'research-state-run-1';
const LINEAGE_ID = 'research-state-lineage-1';
const SOURCE_LEDGER_ID = 'research-state-source';
const EFFECT_LEDGER_ID = 'research-state-effects';
const RESTORE_STEP = 'deep-research-state-checkpoint-restore@1';
const ROOTS: string[] = [];

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as never));
}

function rowFor(rowId: string): StateBackendCensus['rows'][number] {
  const row = CENSUS.rows.find((candidate) => candidate.id === rowId);
  if (!row) throw new Error(`census row not found: ${rowId}`);
  return row;
}

function rootFor(label: string): string {
  const root = resolve(mkdtempSync(join(tmpdir(), `research-state-migrate-${label}-`)));
  ROOTS.push(root);
  return root;
}

function installRestoreTrap(path: string, original: Uint8Array): () => void {
  const absolutePath = resolve(path);
  let active = true;
  const restore = (): void => {
    if (!active) return;
    writeFileSync(absolutePath, original);
    active = false;
  };
  const restoreOnSignal = (): void => {
    restore();
    process.exit(143);
  };
  process.once('exit', restore);
  process.once('SIGINT', restoreOnSignal);
  process.once('SIGTERM', restoreOnSignal);
  return (): void => {
    restore();
    process.removeListener('exit', restore);
    process.removeListener('SIGINT', restoreOnSignal);
    process.removeListener('SIGTERM', restoreOnSignal);
  };
}

interface LedgerHarness {
  readonly ledger: AppendOnlyLedger;
  readonly registry: EventTypeRegistry;
  readonly policies: TransitionPolicyRegistry;
  readonly gateway: TransitionAuthorizationGateway;
  readonly authority: AuthoritySnapshot;
}

function ledgerHarness(
  rootDirectory: string,
  ledgerId: string,
  auditLedgerId: string,
  registry: EventTypeRegistry,
): LedgerHarness {
  const authority: AuthoritySnapshot = { state: 'legacy_authoritative', epoch: 1 };
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId,
    auditLedgerId,
    authorityProvider: () => authority,
    now: () => new Date(TIMESTAMP),
  }, registry);
  const policies = new TransitionPolicyRegistry([{
    policyId: 'research-state-seed-policy',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['allow-seeded-event'],
    evaluate: (): PolicyEvaluationResult => ({
      verdict: AuthorizationVerdicts.ALLOW,
      reasonCode: 'allowed',
      matchedRuleIds: ['allow-seeded-event'],
    }),
  }]);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId,
    authorityProvider: () => authority,
    now: () => new Date(TIMESTAMP),
    identityResolver: ({ evaluationInput }) => ({
      actorId: evaluationInput.actorId,
      capabilityId: evaluationInput.capabilityId,
      evidenceDigest: evaluationInput.evidenceDigest,
    }),
  }, ledger, policies);
  return { ledger, registry, policies, gateway, authority };
}

async function appendSeededEvent(
  harness: LedgerHarness,
  event: EventWritePreflight,
): Promise<void> {
  const policy = harness.policies.resolve('research-state-seed-policy', 1);
  const request: TransitionAuthorizationRequest = {
    requestId: `seed-request-${event.identity.eventId}`,
    mode: 'research',
    event,
    priorHead: await harness.ledger.getVerifiedHead(),
    priorStateVersion: 'research-state@1',
    priorStateFingerprint: digest({ state: 'seeded' }),
    actorId: 'research-state-seed',
    capabilityId: 'write',
    authorityEpoch: harness.authority.epoch,
    policy: {
      policyId: policy.policyId,
      policyVersion: policy.policyVersion,
      policyDigest: policy.digest,
    },
    evidenceDigest: event.canonicalDigest,
  };
  const authorization = await harness.gateway.authorize(request);
  if (authorization.verdict !== AuthorizationVerdicts.ALLOW) {
    throw new Error(`seed authorization denied: ${authorization.reasonCode}`);
  }
  await appendAuthorizedForTest(harness.ledger, event, authorization.proof);
}

function replayMetadata(): DeepResearchEventInput<'deep_research.run_initialized'>['replay'] {
  const value = digest('research-state-replay');
  return {
    fingerprint_version: 1,
    final_digest: value,
    replay_input_digests: { seed: value },
  };
}

function deepResearchSeedEvents(
  registry: ReturnType<typeof createDeepResearchEventRegistry>,
): readonly EventWritePreflight[] {
  const value = digest('research-state-seed');
  const events: EventWritePreflight[] = [];
  let previous = '0'.repeat(64);
  const add = <TStem extends DeepResearchEventStem>(
    stem: TStem,
    scope: DeepResearchScopeMap[TStem],
    data: DeepResearchPayloadMap[TStem],
    eventId: string,
    streamSequence: number,
    causationId: string | null = null,
  ): void => {
    const event = prepareDeepResearchEvent({
      stem,
      scope,
      prevEventHash: previous,
      replay: replayMetadata(),
      data,
      eventId,
      streamId: RUN_ID,
      streamSequence,
      occurredAt: TIMESTAMP,
      recordedAt: TIMESTAMP,
      producer: { name: 'research-state-seed', version: '1' },
      authorityEpoch: 1,
      correlationId: 'research-state-seed-correlation',
      causationId,
      idempotencyKey: `research-state-seed:${streamSequence}`,
    }, registry);
    events.push(event);
    previous = event.canonicalDigest;
  };
  const baseScope = { runId: RUN_ID, lineageId: LINEAGE_ID };
  const iterationScope = { ...baseScope, iteration: 1 };
  const sourceScope = { ...iterationScope, sourceVersionId: 'source-version-1' };
  add('deep_research.run_initialized', baseScope, {
    generation: 1,
    charterDigest: value,
    configDigest: value,
    executorFingerprint: value,
    replayFingerprint: value,
    maxIterations: 10,
    convergencePolicyVersion: 'convergence@1',
  }, 'research-seed-001', 1);
  add('deep_research.question_registered', {
    ...baseScope,
    questionId: 'question-1',
  }, {
    normalizedQuestionDigest: value,
    dependencyQuestionIds: [],
    requiredSourceClasses: ['primary'],
    disconfirmingQueryRecipeIds: ['recipe-1'],
    budgetRef: 'budget-1',
  }, 'research-seed-002', 2);
  const branchScope = { ...baseScope, questionId: 'question-1', branchId: 'branch-1' };
  const branchData = {
    semanticClusterId: 'cluster-1',
    expectedYieldScoreVector: {
      expectedYield: 0.8,
      contradictionRisk: 0.2,
      impact: 0.7,
      independenceGain: 0.6,
      staleness: 0.1,
      expectedCost: 0.3,
    },
    contradictionRisk: 0.2,
    impact: 0.7,
    independenceGain: 0.6,
    staleness: 0.1,
    expectedCost: 0.3,
    tieBreakKey: 'tie-1',
    reservationRef: 'reservation-1',
  };
  add('deep_research.branch_planned', branchScope, branchData, 'research-seed-003', 3);
  add('deep_research.branch_selected', branchScope, branchData, 'research-seed-004', 4, 'research-seed-003');
  add('deep_research.iteration_started', iterationScope, {
    focusRef: 'focus-1',
    stateTailDigest: value,
    strategyDigest: value,
    status: 'started',
  }, 'research-seed-005', 5);
  add('deep_research.source_captured', sourceScope, {
    sourceIdentityDigest: value,
    locator: {
      scheme: 'url',
      locatorDigest: value,
      selector: 'https://example.test/source',
      revision: 'revision-1',
    },
    capturedAt: TIMESTAMP,
    contentDigest: value,
    mediaType: 'text/html',
    retrievalReceiptRef: 'retrieval-receipt-1',
    parentSourceVersionId: null,
    instructionScanResult: 'clean',
  }, 'research-seed-006', 6);
  add('deep_research.iteration_completed', iterationScope, {
    status: 'complete',
    rawNewInfoRatio: 0.8,
    trustedEvidenceYield: 0.8,
    outputDigest: value,
    ruledOutApproachRefs: [],
    nextFocusCausationId: 'focus-2',
  }, 'research-seed-007', 7, 'research-seed-005');
  const claimScope = { ...iterationScope, claimVersionId: 'claim-version-1' };
  const claimData = {
    claimId: 'claim-1',
    normalizedClaimDigest: value,
    evidenceIds: ['evidence-1'],
    independenceGroup: 'independent-1',
    rawConfidence: 0.9,
    claimStatus: 'supported' as const,
  };
  add('deep_research.claim_asserted', claimScope, claimData, 'research-seed-008', 8);
  add('deep_research.claim_asserted', claimScope, claimData, 'research-seed-009', 9);
  add('deep_research.synthesis_committed', baseScope, {
    admittedLedgerRevision: 'revision-1',
    selectedClaimVersionSetDigest: value,
    synthesisPolicyDigest: value,
    reportRevision: 'report-1',
    unresolvedClaimIds: [],
    contestedClaimIds: [],
    reportDigest: value,
    citationEventIds: [],
    synthesisReceiptRef: 'synthesis-receipt-1',
  }, 'research-seed-010', 10);
  return events;
}

function effectId(prefix: string, key: string): string {
  return `${prefix}-${sha256Bytes(canonicalBytes(key))}`;
}

async function seedEffectLedger(harness: LedgerHarness): Promise<void> {
  const key = 'research-state-effect-1';
  const value = digest('research-state-effect');
  const adapter = {
    adapter_id: 'research-state-effect-adapter',
    adapter_version: '1',
    effect_type: 'subprocess' as const,
    replay_safe: false,
    idempotency_mode: 'postcondition' as const,
    reconciliation: 'none' as const,
  };
  const intentPayload = {
    effect_id: effectId('effect', key),
    run_id: RUN_ID,
    logical_effect_id: 'research-state-effect',
    effect_type: 'subprocess' as const,
    operation: 'observe-checkpoint',
    target_identity: 'research-state-temp',
    input_digest: value,
    safe_metadata: {},
    secret_references: [],
    adapter,
    idempotency_key: key,
    recovery_policy: 'unknown-block',
    expected_postcondition_digest: value,
    replay_fingerprint: value,
    requested_at: TIMESTAMP,
  };
  const intent = prepareEventWrite({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: effectId('effect-intent', key),
    event_type: EFFECT_INTENT_EVENT_TYPE,
    event_version: 1,
    stream_id: 'research-state-effect-stream',
    stream_sequence: 1,
    occurred_at: TIMESTAMP,
    recorded_at: TIMESTAMP,
    producer: { name: 'research-state-effect-seed', version: '1' },
    authority_epoch: 1,
    correlation_id: 'research-state-effect-correlation',
    causation_id: null,
    idempotency_key: key,
    payload: intentPayload,
  }, harness.registry);
  await appendSeededEvent(harness, intent);
  const confirmationPayload = {
    confirmation_id: effectId('effect-confirmation', key),
    effect_id: intentPayload.effect_id,
    intent_event_id: intent.identity.eventId,
    intent_event_digest: intent.canonicalDigest,
    idempotency_key: key,
    adapter,
    external_receipt_digest: value,
    postcondition_digest: value,
    output_digest: value,
    completion_class: 'executed' as const,
    observed_at: TIMESTAMP,
    safe_result_metadata: {},
  };
  const confirmation = prepareEventWrite({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: confirmationPayload.confirmation_id,
    event_type: EFFECT_CONFIRMATION_EVENT_TYPE,
    event_version: 1,
    stream_id: 'research-state-effect-stream',
    stream_sequence: 2,
    occurred_at: TIMESTAMP,
    recorded_at: TIMESTAMP,
    producer: { name: 'research-state-effect-seed', version: '1' },
    authority_epoch: 1,
    correlation_id: 'research-state-effect-correlation',
    causation_id: intent.identity.eventId,
    idempotency_key: `${key}:confirmation`,
    payload: confirmationPayload,
  }, harness.registry);
  await appendSeededEvent(harness, confirmation);
}

function rebuildDataEvent(
  event: EventReadResult,
  changes: Readonly<Record<string, unknown>>,
  registry: ReturnType<typeof createDeepResearchEventRegistry>,
): EventReadResult {
  const envelope = event.effective.envelope;
  const payload = envelope.payload as Record<string, unknown>;
  const data = payload.data as Record<string, unknown>;
  const rebuilt = prepareDeepResearchEvent({
    stem: payload.stem as DeepResearchEventStem,
    scope: payload.scope,
    prevEventHash: payload.prevEventHash,
    replay: payload.replay,
    data: { ...data, ...changes },
    eventId: envelope.event_id,
    streamId: envelope.stream_id,
    streamSequence: envelope.stream_sequence,
    occurredAt: envelope.occurred_at,
    recordedAt: envelope.recorded_at,
    producer: envelope.producer,
    authorityEpoch: envelope.authority_epoch,
    correlationId: envelope.correlation_id,
    causationId: envelope.causation_id,
    idempotencyKey: envelope.idempotency_key,
  } as never, registry);
  return readEvent(rebuilt.canonicalBytes, registry);
}

function rebuildEnvelope(
  event: EventReadResult,
  changes: Readonly<Record<string, unknown>>,
  registry: ReturnType<typeof createDeepResearchEventRegistry>,
): EventReadResult {
  return readEvent(canonicalBytes({ ...event.effective.envelope, ...changes } as never), registry);
}

function sourceTreeBytes(root: string): Readonly<Record<string, readonly number[]>> {
  const entries: Record<string, readonly number[]> = {};
  const visit = (directory: string, prefix: string): void => {
    readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
      const relative = prefix === '' ? entry.name : `${prefix}/${entry.name}`;
      const path = join(directory, entry.name);
      if (entry.isDirectory()) visit(path, relative);
      else entries[relative] = [...readFileSync(path)];
    });
  };
  if (existsSync(root)) visit(root, '');
  return entries;
}

interface SeededFixture {
  readonly root: string;
  readonly source: LedgerHarness;
  readonly effect: LedgerHarness;
  readonly restart: ObserveRestartFactsOptions;
  readonly sourceBytes: Readonly<Record<string, readonly number[]>>;
}

async function seededFixture(): Promise<SeededFixture> {
  const root = rootFor('base');
  const source = ledgerHarness(
    root,
    SOURCE_LEDGER_ID,
    `${SOURCE_LEDGER_ID}-audit`,
    createDeepResearchEventRegistry(),
  );
  for (const event of deepResearchSeedEvents(source.registry as ReturnType<typeof createDeepResearchEventRegistry>)) {
    await appendSeededEvent(source, event);
  }
  const effect = ledgerHarness(
    root,
    EFFECT_LEDGER_ID,
    `${EFFECT_LEDGER_ID}-audit`,
    createEvidenceControlEventRegistry(),
  );
  await seedEffectLedger(effect);
  const restart: ObserveRestartFactsOptions = {
    runDirectory: root,
    modeLedgerId: SOURCE_LEDGER_ID,
    effectLedgerId: EFFECT_LEDGER_ID,
    modeLedger: () => source.ledger,
    effectLedger: () => effect.ledger,
    leases: [],
    continuityId: 'research-state-continuity-1',
    now: () => new Date(TIMESTAMP),
  };
  return {
    root,
    source,
    effect,
    restart,
    sourceBytes: sourceTreeBytes(join(root, SOURCE_LEDGER_ID)),
  };
}

function seedFor(
  fixture: SeededFixture,
  label: string,
  overrides: Partial<ResearchStateMigrateSeed> = {},
): ResearchStateMigrateSeed {
  const row = rowFor('research-state');
  const safeLabel = label.replace(/[A-Z]/gu, (value) => `-${value.toLowerCase()}`);
  return {
    runDirectory: fixture.root,
    restart: fixture.restart,
    lifecycle: row.lifecycle,
    mutability: row.mutability,
    importLedgerId: `research-state-import-${safeLabel}`,
    importAuditLedgerId: `research-state-import-${safeLabel}-audit`,
    importedAt: TIMESTAMP,
    ...overrides,
  };
}

async function manifestFor(
  evidence: ClassificationEvidence,
  restart: ObserveRestartFactsOptions,
): Promise<ReturnType<typeof createClassificationManifest>['manifest']> {
  const facts = await observeRestartFacts(restart);
  const otherEvidence = CENSUS.rows
    .filter((row) => row.id !== 'research-state')
    .map((row) => deriveRestartClassificationEvidence({
      rowId: row.id,
      lifecycle: row.lifecycle,
      mutability: row.mutability,
      restart: facts,
    }));
  return createClassificationManifest({
    classificationId: 'research-state-migrate-evidence-test',
    classifiedAt: TIMESTAMP,
    classifierBuildId: 'research-state-migrate-evidence-test',
    censusBytes: CENSUS_BYTES,
    evidence: [evidence, ...otherEvidence],
  }).manifest;
}

function researchRow(
  manifest: ReturnType<typeof createClassificationManifest>['manifest'],
) {
  const row = manifest.rows.find((candidate) => candidate.rowId === 'research-state');
  if (!row) throw new Error('research-state row missing from manifest');
  return row;
}

// ───────────────────────────────────────────────────────────────────
// 2. SUITE
// ───────────────────────────────────────────────────────────────────

afterEach(() => {
  for (const root of ROOTS.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('research-state migrate evidence producer', () => {
  it('classifies a real quiescent checkpoint as MIGRATE and preserves source bytes', async () => {
    const fixture = await seededFixture();
    const restore = installRestoreTrap(
      join(fixture.root, 'source-preservation-sentinel'),
      Uint8Array.from([1, 2, 3]),
    );
    writeFileSync(join(fixture.root, 'source-preservation-sentinel'), Uint8Array.from([1, 2, 3]));
    try {
      const evidence = await deriveResearchStateMigrateEvidence(seedFor(fixture, 'positive'));
      const manifest = await manifestFor(evidence, fixture.restart);
      const row = researchRow(manifest);
      const sourceEvents = (await fixture.source.ledger.readVerifiedEvents())
        .map((entry) => entry.event);
      const checkpointBytes = canonicalBytes(
        sourceEvents.map((event) => event.effective.envelope) as never,
      );
      const sourceState = createDeepResearchProjectionContract({ ledgerId: RUN_ID });
      const restoredState = sourceEvents.reduce(
        (current, event) => sourceState.reduce(current, event),
        sourceState.base.state,
      );
      const restoredStateBytes = sourceState.serialize(restoredState);
      const expectedRestorationDigest = sha256Bytes(canonicalBytes({
        step: RESTORE_STEP,
        checkpointDigest: sha256Bytes(checkpointBytes),
        restoredStateDigest: sha256Bytes(restoredStateBytes),
        restoredEventIds: sourceEvents.map((event) => event.effective.envelope.event_id),
      }));
      expect(row.disposition).toBe(InflightDisposition.MIGRATE);
      expect(row.reasonCode).toBe(ClassificationReasonCodes.MIGRATION_REVERSIBLE);
      expect(evidence.proof.kind).toBe('migrate');
      if (evidence.proof.kind !== 'migrate') throw new Error('expected migrate proof');
      expect(evidence.proof.checkpointDigest).toBe(sha256Bytes(checkpointBytes));
      expect(evidence.proof.restorationReceiptDigest).toBe(expectedRestorationDigest);
      expect(evidence.budgetCoverage).toBe(true);
      expect(sourceTreeBytes(join(fixture.root, SOURCE_LEDGER_ID))).toEqual(fixture.sourceBytes);
      expect(sourceTreeBytes(fixture.root)).toEqual(expect.any(Object));
    } finally {
      restore();
    }
  });

  const negativeCases: readonly {
    readonly label: string;
    readonly flag: keyof Omit<Extract<ClassificationEvidence['proof'], { kind: 'migrate' }>, 'kind' | 'checkpointDigest' | 'restorationReceiptDigest'>;
    readonly overrides: (fixture: SeededFixture) => Partial<ResearchStateMigrateSeed>;
  }[] = [
    {
      label: 'quiescentCheckpoint',
      flag: 'quiescentCheckpoint',
      overrides: () => ({
        checkpointLeaseObservation: () => [{ state: 'active', fencingToken: 7 }],
      }),
    },
    {
      label: 'transactionalSnapshot',
      flag: 'transactionalSnapshot',
      overrides: () => ({
        checkpointByteTransform: (bytes) => Uint8Array.from([...bytes, 0x20]),
      }),
    },
    {
      label: 'atomicImport',
      flag: 'atomicImport',
      overrides: () => ({
        importCheckpoint: async ({ migration, attempt }: ResearchStateCheckpointImportContext): Promise<ResearchStateCheckpointImportResult> => {
          if (attempt === 1) {
            const first = await appendInflightMigrationCheckpointEvent(migration);
            await retryResearchStateCheckpointImport(migration);
            return { receipt: first, appendCount: 2 };
          }
          return {
            receipt: await retryResearchStateCheckpointImport(migration),
            appendCount: 1,
          };
        },
      }),
    },
    {
      label: 'reversible',
      flag: 'reversible',
      overrides: () => ({
        checkpointByteTransform: (bytes) => {
          const records = JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>[];
          records[5] = { ...records[5], occurred_at: '2026-08-22T10:00:01.000Z' };
          return canonicalBytes(records as never);
        },
      }),
    },
    {
      label: 'identityPreserved',
      flag: 'identityPreserved',
      overrides: () => ({
        checkpointByteTransform: (bytes) => {
          const records = JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>[];
          return canonicalBytes(records.map((record) => ({ ...record, stream_id: 'restored-stream' })) as never);
        },
      }),
    },
    {
      label: 'orderPreserved',
      flag: 'orderPreserved',
      overrides: () => ({
        checkpointEventTransform: (events) => [
          ...events.slice(0, 7),
          events[8],
          events[7],
          ...events.slice(9),
        ],
      }),
    },
    {
      label: 'idempotencyPreserved',
      flag: 'idempotencyPreserved',
      overrides: () => ({
        importCheckpoint: async ({ migration, attempt }: ResearchStateCheckpointImportContext): Promise<ResearchStateCheckpointImportResult> => {
          if (attempt === 1) {
            return {
              receipt: await appendInflightMigrationCheckpointEvent(migration),
              appendCount: 1,
            };
          }
          const envelope = migration.event.envelope;
          const event = prepareEventWrite({
            ...envelope,
            recorded_at: '2026-08-22T10:00:01.000Z',
          }, createDeepResearchEventRegistry());
          return {
            receipt: await appendInflightMigrationCheckpointEvent({ ...migration, event }),
            appendCount: 1,
          };
        },
      }),
    },
    {
      label: 'budgetsPreserved',
      flag: 'budgetsPreserved',
      overrides: () => ({
        checkpointEventTransform: (events) => events.map((event) => (
          event.effective.envelope.event_id === 'research-seed-002'
            ? rebuildDataEvent(event, { budgetRef: 'budget-perturbed' }, createDeepResearchEventRegistry())
            : event
        )),
      }),
    },
    {
      label: 'receiptsPreserved',
      flag: 'receiptsPreserved',
      overrides: () => ({
        checkpointEventTransform: (events) => events.map((event) => (
          event.effective.envelope.event_id === 'research-seed-010'
            ? rebuildDataEvent(event, { synthesisReceiptRef: 'synthesis-receipt-perturbed' }, createDeepResearchEventRegistry())
            : event
        )),
      }),
    },
    {
      label: 'pendingWorkPreserved',
      flag: 'pendingWorkPreserved',
      overrides: () => ({
        checkpointByteTransform: (bytes) => {
          const records = JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>[];
          records[6] = { ...records[6], causation_id: 'missing-iteration-start' };
          return canonicalBytes(records as never);
        },
      }),
    },
  ];

  it.each(negativeCases)('$label is observed as false and blocks with MIGRATION_UNSAFE', async ({ label, flag, overrides }) => {
    const fixture = await seededFixture();
    const sentinelPath = join(fixture.root, `${label}-restore-sentinel`);
    const restore = installRestoreTrap(sentinelPath, Uint8Array.from([4, 5, 6]));
    writeFileSync(sentinelPath, Uint8Array.from([4, 5, 6]));
    try {
      const evidence = await deriveResearchStateMigrateEvidence(seedFor(fixture, label, overrides(fixture)));
      const manifest = await manifestFor(evidence, fixture.restart);
      const row = researchRow(manifest);
      expect(row.disposition).toBe(InflightDisposition.BLOCK);
      expect(row.reasonCode).toBe(ClassificationReasonCodes.MIGRATION_UNSAFE);
      expect(evidence.proof.kind).toBe('migrate');
      if (evidence.proof.kind !== 'migrate') throw new Error('expected migrate proof');
      expect(evidence.proof[flag]).toBe(false);
      for (const other of negativeCases.map((candidate) => candidate.flag)) {
        if (other !== flag) expect(evidence.proof[other]).toBe(true);
      }
      expect(sourceTreeBytes(join(fixture.root, SOURCE_LEDGER_ID))).toEqual(fixture.sourceBytes);
    } finally {
      restore();
    }
  });
});
