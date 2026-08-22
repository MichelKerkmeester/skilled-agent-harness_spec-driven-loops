// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Pilot Authority Flip Integration Tests
// ───────────────────────────────────────────────────────────────────

import { appendJsonlRecord } from '../../lib/deep-loop/jsonl-repair.js';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
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
import { buildCutoverCertificate } from '../../lib/cutover-certificate/index.js';
import {
  canonicalBytes,
  CURRENT_ENVELOPE_VERSION,
  readEvent,
  sha256Bytes,
  prepareEventWrite,
} from '../../lib/event-envelope/index.js';
import {
  createDeepResearchEventRegistry,
  prepareDeepResearchEvent,
  upcastLegacyDeepResearchRecord,
} from '../../lib/deep-research-ledger-schema/index.js';
import { createDeepResearchProjectionContract } from '../../lib/legacy-projections/index.js';
import {
  ClassificationReasonCodes,
  createClassificationManifest,
  deriveRestartClassificationEvidence,
  InflightDisposition,
} from '../../lib/inflight-state-classification/index.js';
import {
  buildInflightMigrationCheckpointFacts,
  buildInflightMigrationHandoff,
  buildMigrationEnvelope,
  createInflightMigrationCheckpointEventRegistry,
  MigrationCoordinator,
  MigrationOperationStatuses,
  prepareInflightMigrationCheckpointEventWrite,
} from '../../lib/inflight-state-migration/index.js';
import {
  AUTHORITY_FLIP_EVENT_TYPE,
  AUTHORITY_FLIP_POLICY_ID,
  AuthorityRegistry,
  createAuthorityFlipCoordinator,
  evaluateCutoverPreflight,
} from '../../lib/per-mode-authority-flip/index.js';
import {
  certifyBoundaryReceipt,
  CertificationProviderRegistry,
  createEvidenceControlEventRegistry,
  createHmacCertificationProvider,
  EFFECT_CONFIRMATION_EVENT_TYPE,
  EFFECT_INTENT_EVENT_TYPE,
} from '../../lib/receipts-and-effect-recovery/index.js';
import {
  createRollbackDrillCertificate,
  ROLLBACK_CERTIFICATE_SCHEMA_VERSION,
} from '../../lib/rollback-drills/index.js';
import { appendAuthorizedForTest } from '../fixtures/authorized-ledger-test-helper.js';

import type {
  AuthoritySnapshot,
  PolicyEvaluationResult,
  TransitionAuthorizationRequest,
} from '../../lib/authorized-ledger/index.js';
import type {
  DeepResearchEventEnvelope,
  DeepResearchEventInput,
  DeepResearchEventStem,
  DeepResearchPayloadMap,
  DeepResearchReplayMetadata,
  DeepResearchScopeMap,
} from '../../lib/deep-research-ledger-schema/index.js';
import type {
  ClassificationEvidence,
  InflightClassificationManifest,
  StateBackendCensus,
} from '../../lib/inflight-state-classification/index.js';
import type {
  InflightMigrationHandoff,
  MigrationLedgerContext,
  MigrationReceipt,
} from '../../lib/inflight-state-migration/index.js';
import type {
  CutoverCertificate,
  CutoverCertificateMode,
  CutoverPreflightInput,
  CutoverRequest,
} from '../../lib/per-mode-authority-flip/index.js';
import type {
  CertificationProfile,
} from '../../lib/receipts-and-effect-recovery/index.js';
import type {
  ResearchConfigUpcastSeed,
} from '../../lib/deep-research-cutover-evidence/research-config-upcast-evidence.js';
import { deriveResearchConfigUpcastEvidence } from '../../lib/deep-research-cutover-evidence/research-config-upcast-evidence.js';
import type {
  ResearchDeltasUpcastSeed,
} from '../../lib/deep-research-cutover-evidence/research-deltas-upcast-evidence.js';
import { deriveResearchDeltasUpcastEvidence } from '../../lib/deep-research-cutover-evidence/research-deltas-upcast-evidence.js';
import type {
  ResearchProjectionsUpcastSeed,
} from '../../lib/deep-research-cutover-evidence/research-projections-upcast-evidence.js';
import { deriveResearchProjectionsUpcastEvidence } from '../../lib/deep-research-cutover-evidence/research-projections-upcast-evidence.js';
import type {
  ResearchStateMigrateSeed,
} from '../../lib/deep-research-cutover-evidence/research-state-migrate-evidence.js';
import { deriveResearchStateMigrateEvidence } from '../../lib/deep-research-cutover-evidence/research-state-migrate-evidence.js';
import type { ObserveRestartFactsOptions } from '../../lib/restart-observation/restart-facts-reader.js';

const TEST_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = resolve(TEST_DIRECTORY, '../../../../../..');
const CENSUS_PATH = join(
  REPOSITORY_ROOT,
  '.opencode/specs/system-deep-loop/036-deep-loop-innovation',
  '001-research-inputs-and-architecture/003-baseline-taxonomy-and-state-census/state-backend-census.json',
);
const CENSUS_BYTES = readFileSync(CENSUS_PATH);
const CENSUS = JSON.parse(CENSUS_BYTES.toString('utf8')) as StateBackendCensus;
const MODE: CutoverCertificateMode = 'deep-research';
const AUTHORITY_EPOCH = 3;
const CANDIDATE_SHA = 'a'.repeat(40);
const TIMESTAMP = '2026-08-22T10:00:00.000Z';
const ACTOR_ID = 'deep-research-pilot-tests';
const CAPABILITY_ID = 'write';
const ROOTS: string[] = [];

const RESTART_FACTS = {
  stopSequence: 12,
  pendingEffects: [],
  receipts: [],
  leases: [],
  continuityId: 'deep-research-pilot-continuity-1',
} as const;

const CONFIG_RECORD = {
  type: 'config',
  schemaVersion: 1,
  runId: 'deep-research-pilot-run-1',
  lineageId: 'deep-research-pilot-lineage-1',
  sessionId: 'deep-research-pilot-run-1',
  parentSessionId: 'deep-research-pilot-lineage-1',
  topic: 'runtime enablement',
  maxIterations: 10,
  convergenceThreshold: 0.05,
  antiConvergence: { minIterations: 3, convergenceMode: 'default', stopPolicy: 'fail-closed' },
  stuckThreshold: 3,
  maxDurationMinutes: 120,
  maxToolCallsPerIteration: 12,
  maxMinutesPerIteration: 10,
  progressiveSynthesis: true,
  specFolder: 'temporary/deep-research-pilot',
  createdAt: TIMESTAMP,
  status: 'initialized',
  executionMode: 'auto',
  executor: 'native',
  generation: 1,
  lineage: {
    sessionId: 'deep-research-pilot-run-1',
    parentSessionId: null,
    lineageMode: 'new',
    generation: 1,
  },
} as const;

const CONFIG_CONTEXT = {
  scope: {
    runId: CONFIG_RECORD.runId,
    lineageId: CONFIG_RECORD.lineageId,
  },
  prevEventHash: '0'.repeat(64),
  replay: {
    fingerprint_version: 1,
    final_digest: sha256Bytes(canonicalBytes('deep-research-pilot-config-replay')),
    replay_input_digests: {
      configuration: sha256Bytes(canonicalBytes(CONFIG_RECORD)),
    },
  },
} as const;

const REPLAY: DeepResearchReplayMetadata = {
  fingerprint_version: 1,
  final_digest: sha256Bytes(canonicalBytes('deep-research-pilot-replay')),
  replay_input_digests: {
    configuration: sha256Bytes(canonicalBytes('deep-research-pilot-configuration')),
  },
};

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as never));
}

function temporaryRoot(label: string): string {
  const root = resolve(mkdtempSync(join(tmpdir(), `deep-research-pilot-${label}-`)));
  ROOTS.push(root);
  return root;
}

function rowFor(rowId: string): StateBackendCensus['rows'][number] {
  const row = CENSUS.rows.find((candidate) => candidate.id === rowId);
  if (!row) throw new Error(`census row not found: ${rowId}`);
  return row;
}

function otherEvidence(excluded: ReadonlySet<string>): ClassificationEvidence[] {
  return CENSUS.rows
    .filter((row) => !excluded.has(row.id))
    .map((row) => deriveRestartClassificationEvidence({
      rowId: row.id,
      lifecycle: row.lifecycle,
      mutability: row.mutability,
      restart: RESTART_FACTS,
    }));
}

interface SeededChain {
  readonly records: readonly Record<string, unknown>[];
  readonly events: readonly DeepResearchEventEnvelope<'deep_research.iteration_completed'>[];
}

function seededChain(length: number): SeededChain {
  const registry = createDeepResearchEventRegistry();
  const records: Record<string, unknown>[] = [];
  const events: DeepResearchEventEnvelope<'deep_research.iteration_completed'>[] = [];
  let previousEventHash = '0'.repeat(64);
  for (let iteration = 1; iteration <= length; iteration += 1) {
    const record = {
      type: 'iteration',
      schemaVersion: 1,
      sessionId: 'deep-research-pilot-run-1',
      parentSessionId: 'deep-research-pilot-lineage-1',
      run: iteration,
      status: 'complete',
      newInfoRatio: 0.8 - iteration / 10,
      findingsCount: iteration,
      timestamp: `2026-08-22T10:0${iteration}:00.000Z`,
      prevEventHash: previousEventHash,
    };
    const upcast = upcastLegacyDeepResearchRecord(record, {
      scope: {
        runId: 'deep-research-pilot-run-1',
        lineageId: 'deep-research-pilot-lineage-1',
        iteration,
      },
      prevEventHash: previousEventHash,
      replay: REPLAY,
    });
    if (upcast.status !== 'migrated') throw new Error(upcast.decision.reasonCode);
    const input: DeepResearchEventInput<'deep_research.iteration_completed'> = {
      stem: 'deep_research.iteration_completed',
      scope: upcast.scope as DeepResearchScopeMap['deep_research.iteration_completed'],
      prevEventHash: upcast.prevEventHash,
      replay: upcast.replay,
      data: upcast.data as DeepResearchPayloadMap['deep_research.iteration_completed'],
      eventId: `research-delta-${iteration}-${upcast.originalRecordDigest}`,
      streamId: upcast.scope.runId,
      streamSequence: iteration,
      occurredAt: record.timestamp,
      recordedAt: TIMESTAMP,
      producer: { name: 'deep-research-pilot-tests', version: '1' },
      authorityEpoch: 1,
      correlationId: 'deep-research-pilot-deltas-correlation',
      causationId: null,
      idempotencyKey: `deep-research-pilot-deltas-${iteration}`,
    };
    const event = readEvent(prepareDeepResearchEvent(input, registry).canonicalBytes, registry);
    records.push(record);
    events.push(event.effective.envelope as DeepResearchEventEnvelope<'deep_research.iteration_completed'>);
    previousEventHash = event.effective.canonicalDigest;
  }
  return { records, events };
}

function writeDeltaFiles(root: string, records: readonly Record<string, unknown>[]): readonly string[] {
  const directory = join(root, 'research', 'deltas');
  mkdirSync(directory, { recursive: true });
  return records.map((record, index) => {
    const path = resolve(join(directory, `iter-${String(index + 1).padStart(3, '0')}.jsonl`));
    appendJsonlRecord(path, record);
    return path;
  });
}

function writeProjectionSource(
  root: string,
  events: readonly DeepResearchEventEnvelope<'deep_research.iteration_completed'>[],
): string {
  const path = resolve(join(root, 'research', 'source-events.jsonl'));
  mkdirSync(dirname(path), { recursive: true });
  events.forEach((event) => appendJsonlRecord(path, event as unknown as Record<string, unknown>));
  return path;
}

function configSeed(path: string): ResearchConfigUpcastSeed {
  return {
    sourcePath: path,
    context: CONFIG_CONTEXT,
    sequence: 1,
    lifecycle: rowFor('research-config').lifecycle,
    mutability: rowFor('research-config').mutability,
    restart: RESTART_FACTS,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'deep-research-pilot-tests', version: '1' },
    authorityEpoch: 1,
    correlationId: 'deep-research-pilot-config-correlation',
    causationId: null,
    idempotencyKey: 'deep-research-pilot-config-1',
  };
}

function deltasSeed(paths: readonly string[]): ResearchDeltasUpcastSeed {
  return {
    sourcePaths: paths,
    replay: REPLAY,
    lifecycle: rowFor('research-deltas').lifecycle,
    mutability: rowFor('research-deltas').mutability,
    restart: RESTART_FACTS,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'deep-research-pilot-tests', version: '1' },
    authorityEpoch: 1,
    correlationId: 'deep-research-pilot-deltas-correlation',
    causationId: null,
    idempotencyKeyPrefix: 'deep-research-pilot-deltas',
  };
}

function projectionsSeed(path: string): ResearchProjectionsUpcastSeed {
  return {
    sourcePath: path,
    lifecycle: rowFor('research-projections').lifecycle,
    mutability: rowFor('research-projections').mutability,
    restart: RESTART_FACTS,
  };
}

interface LedgerHarness {
  readonly ledger: AppendOnlyLedger;
  readonly registry: ReturnType<typeof createDeepResearchEventRegistry>;
  readonly policies: TransitionPolicyRegistry;
  readonly gateway: TransitionAuthorizationGateway;
  readonly authority: AuthoritySnapshot;
}

function ledgerHarness(
  rootDirectory: string,
  ledgerId: string,
  auditLedgerId: string,
  registry: LedgerHarness['registry'],
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
    policyId: `seed-policy-${ledgerId}`,
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['seed-allow'],
    evaluate: (): PolicyEvaluationResult => ({
      verdict: AuthorizationVerdicts.ALLOW,
      reasonCode: 'allowed',
      matchedRuleIds: ['seed-allow'],
    }),
  }]);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId,
    authorityProvider: () => authority,
    identityResolver: ({ evaluationInput }) => ({
      actorId: evaluationInput.actorId,
      capabilityId: evaluationInput.capabilityId,
      evidenceDigest: evaluationInput.evidenceDigest,
    }),
    now: () => new Date(TIMESTAMP),
  }, ledger, policies);
  return { ledger, registry, policies, gateway, authority };
}

async function appendSeededEvent(
  harness: LedgerHarness,
  event: Parameters<typeof prepareEventWrite>[0] extends never ? never : ReturnType<typeof prepareEventWrite>,
): Promise<void> {
  const policy = harness.policies.resolve(`seed-policy-${harness.ledger.ledgerId}`, 1);
  const request: TransitionAuthorizationRequest = {
    requestId: `seed-request-${event.identity.eventId}`,
    mode: 'research',
    event,
    priorHead: await harness.ledger.getVerifiedHead(),
    priorStateVersion: `${harness.ledger.ledgerId}@1`,
    priorStateFingerprint: digest({ state: 'seeded' }),
    actorId: `seed-${harness.ledger.ledgerId}`,
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
  const value = digest('deep-research-pilot-state-replay');
  return {
    fingerprint_version: 1,
    final_digest: value,
    replay_input_digests: { seed: value },
  };
}

function deepResearchSeedEvents(
  registry: ReturnType<typeof createDeepResearchEventRegistry>,
): readonly ReturnType<typeof prepareDeepResearchEvent>[] {
  const value = digest('deep-research-pilot-state-seed');
  const events: ReturnType<typeof prepareDeepResearchEvent>[] = [];
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
      streamId: 'deep-research-pilot-state-run',
      streamSequence,
      occurredAt: TIMESTAMP,
      recordedAt: TIMESTAMP,
      producer: { name: 'deep-research-pilot-tests', version: '1' },
      authorityEpoch: 1,
      correlationId: 'deep-research-pilot-state-correlation',
      causationId,
      idempotencyKey: `deep-research-pilot-state-${streamSequence}`,
    }, registry);
    events.push(event);
    previous = event.canonicalDigest;
  };
  const baseScope = { runId: 'deep-research-pilot-state-run', lineageId: 'deep-research-pilot-state-lineage' };
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
  }, 'deep-research-pilot-state-001', 1);
  add('deep_research.question_registered', {
    ...baseScope,
    questionId: 'question-1',
  }, {
    normalizedQuestionDigest: value,
    dependencyQuestionIds: [],
    requiredSourceClasses: ['primary'],
    disconfirmingQueryRecipeIds: ['recipe-1'],
    budgetRef: 'budget-1',
  }, 'deep-research-pilot-state-002', 2);
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
  add('deep_research.branch_planned', branchScope, branchData, 'deep-research-pilot-state-003', 3);
  add('deep_research.branch_selected', branchScope, branchData, 'deep-research-pilot-state-004', 4, 'deep-research-pilot-state-003');
  add('deep_research.iteration_started', iterationScope, {
    focusRef: 'focus-1',
    stateTailDigest: value,
    strategyDigest: value,
    status: 'started',
  }, 'deep-research-pilot-state-005', 5);
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
  }, 'deep-research-pilot-state-006', 6);
  add('deep_research.iteration_completed', iterationScope, {
    status: 'complete',
    rawNewInfoRatio: 0.8,
    trustedEvidenceYield: 0.8,
    outputDigest: value,
    ruledOutApproachRefs: [],
    nextFocusCausationId: 'focus-2',
  }, 'deep-research-pilot-state-007', 7, 'deep-research-pilot-state-005');
  const claimScope = { ...iterationScope, claimVersionId: 'claim-version-1' };
  const claimData = {
    claimId: 'claim-1',
    normalizedClaimDigest: value,
    evidenceIds: ['evidence-1'],
    independenceGroup: 'independent-1',
    rawConfidence: 0.9,
    claimStatus: 'supported' as const,
  };
  add('deep_research.claim_asserted', claimScope, claimData, 'deep-research-pilot-state-008', 8);
  add('deep_research.claim_asserted', claimScope, claimData, 'deep-research-pilot-state-009', 9);
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
  }, 'deep-research-pilot-state-010', 10);
  return events;
}

function effectId(prefix: string, key: string): string {
  return `${prefix}-${sha256Bytes(canonicalBytes(key))}`;
}

async function seedEffectLedger(harness: LedgerHarness): Promise<void> {
  const key = 'deep-research-pilot-effect-1';
  const value = digest('deep-research-pilot-effect');
  const adapter = {
    adapter_id: 'deep-research-pilot-effect-adapter',
    adapter_version: '1',
    effect_type: 'subprocess' as const,
    replay_safe: false,
    idempotency_mode: 'postcondition' as const,
    reconciliation: 'none' as const,
  };
  const intentPayload = {
    effect_id: effectId('effect', key),
    run_id: 'deep-research-pilot-state-run',
    logical_effect_id: 'deep-research-pilot-effect',
    effect_type: 'subprocess' as const,
    operation: 'observe-checkpoint',
    target_identity: 'deep-research-pilot-temp',
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
    stream_id: 'deep-research-pilot-effect-stream',
    stream_sequence: 1,
    occurred_at: TIMESTAMP,
    recorded_at: TIMESTAMP,
    producer: { name: 'deep-research-pilot-tests', version: '1' },
    authority_epoch: 1,
    correlation_id: 'deep-research-pilot-effect-correlation',
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
    stream_id: 'deep-research-pilot-effect-stream',
    stream_sequence: 2,
    occurred_at: TIMESTAMP,
    recorded_at: TIMESTAMP,
    producer: { name: 'deep-research-pilot-tests', version: '1' },
    authority_epoch: 1,
    correlation_id: 'deep-research-pilot-effect-correlation',
    causation_id: intent.identity.eventId,
    idempotency_key: `${key}:confirmation`,
    payload: confirmationPayload,
  }, harness.registry);
  await appendSeededEvent(harness, confirmation);
}

interface ResearchStateFixture {
  readonly root: string;
  readonly restart: ObserveRestartFactsOptions;
}

async function researchStateFixture(root: string): Promise<ResearchStateFixture> {
  const source = ledgerHarness(
    root,
    'deep-research-pilot-state-source',
    'deep-research-pilot-state-source-audit',
    createDeepResearchEventRegistry(),
  );
  for (const event of deepResearchSeedEvents(source.registry)) await appendSeededEvent(source, event);
  const effect = ledgerHarness(
    root,
    'deep-research-pilot-state-effects',
    'deep-research-pilot-state-effects-audit',
    createEvidenceControlEventRegistry() as LedgerHarness['registry'],
  );
  await seedEffectLedger(effect);
  const restart: ObserveRestartFactsOptions = {
    runDirectory: root,
    modeLedgerId: 'deep-research-pilot-state-source',
    effectLedgerId: 'deep-research-pilot-state-effects',
    modeLedger: () => source.ledger,
    effectLedger: () => effect.ledger,
    leases: [],
    continuityId: 'deep-research-pilot-state-continuity',
    now: () => new Date(TIMESTAMP),
  };
  return { root, restart };
}

async function stateSeed(
  fixture: ResearchStateFixture,
  perturb: boolean,
): Promise<ResearchStateMigrateSeed> {
  return {
    runDirectory: fixture.root,
    restart: fixture.restart,
    lifecycle: rowFor('research-state').lifecycle,
    mutability: rowFor('research-state').mutability,
    importLedgerId: perturb
      ? 'deep-research-pilot-state-import-negative'
      : 'deep-research-pilot-state-import-positive',
    importAuditLedgerId: perturb
      ? 'deep-research-pilot-state-import-negative-audit'
      : 'deep-research-pilot-state-import-positive-audit',
    importedAt: TIMESTAMP,
    checkpointLeaseObservation: perturb
      ? () => [{ state: 'active' as const, fencingToken: 7 }]
      : undefined,
  };
}

interface EvidenceAssembly {
  readonly manifest: InflightClassificationManifest;
  readonly manifestEvidence: ReadonlyMap<string, ClassificationEvidence>;
  readonly migrationEvidence: ReadonlyMap<string, ClassificationEvidence>;
  readonly positiveStateEvidence: ClassificationEvidence;
  readonly negativeStateEvidence: ClassificationEvidence | null;
}

async function assembleEvidence(root: string, includeNegative: boolean): Promise<EvidenceAssembly> {
  mkdirSync(root, { recursive: true });
  const configPath = join(root, 'deep-research-config.json');
  writeFileSync(configPath, `${JSON.stringify(CONFIG_RECORD)}\n`);
  const chain = seededChain(3);
  const deltaPaths = writeDeltaFiles(root, chain.records);
  const projectionPath = writeProjectionSource(root, chain.events);
  const stateFixture = await researchStateFixture(join(root, 'research-state'));
  const configEvidence = deriveResearchConfigUpcastEvidence(configSeed(configPath));
  const deltaEvidence = deriveResearchDeltasUpcastEvidence(deltasSeed(deltaPaths));
  const projectionEvidence = deriveResearchProjectionsUpcastEvidence(projectionsSeed(projectionPath));
  const positiveStateEvidence = await deriveResearchStateMigrateEvidence(await stateSeed(stateFixture, false));
  const negativeStateEvidence = includeNegative
    ? await deriveResearchStateMigrateEvidence(await stateSeed(stateFixture, true))
    : null;
  const realEvidence = new Map<string, ClassificationEvidence>([
    ['research-config', configEvidence],
    ['research-state', positiveStateEvidence],
    ['research-deltas', deltaEvidence],
    ['research-projections', projectionEvidence],
  ]);
  const allEvidence = new Map<string, ClassificationEvidence>([
    ...realEvidence,
    ...otherEvidence(new Set(realEvidence.keys())).map((evidence) => [evidence.rowId, evidence] as const),
  ]);
  const manifest = createClassificationManifest({
    classificationId: 'deep-research-pilot-real-evidence',
    classifiedAt: TIMESTAMP,
    classifierBuildId: 'deep-research-pilot-real-evidence',
    censusBytes: CENSUS_BYTES,
    evidence: [...allEvidence.values()],
  }).manifest;
  const migrationEvidence = new Map(allEvidence);
  if (negativeStateEvidence !== null) migrationEvidence.set('research-state', negativeStateEvidence);
  return {
    manifest,
    manifestEvidence: allEvidence,
    migrationEvidence,
    positiveStateEvidence,
    negativeStateEvidence,
  };
}

async function migrationLedgerContext(
  root: string,
  manifest: InflightClassificationManifest,
  row: InflightClassificationManifest['rows'][number],
  evidence: ClassificationEvidence,
): Promise<MigrationLedgerContext> {
  if (evidence.proof.kind !== 'migrate') throw new Error('research-state evidence must carry a migrate proof');
  const envelope = buildMigrationEnvelope(manifest, row, row.disposition, evidence);
  const eventRegistry = createInflightMigrationCheckpointEventRegistry();
  const authority: AuthoritySnapshot = { state: 'legacy_authoritative', epoch: 1 };
  const ledger = new AppendOnlyLedger({
    rootDirectory: root,
    ledgerId: 'deep-research-pilot-migration-state',
    auditLedgerId: 'deep-research-pilot-migration-state-audit',
    authorityProvider: () => authority,
    now: () => new Date(TIMESTAMP),
  }, eventRegistry);
  const policies = new TransitionPolicyRegistry([{
    policyId: 'deep-research-pilot-migration-policy',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['checkpoint-import'],
    evaluate: (): PolicyEvaluationResult => ({
      verdict: AuthorizationVerdicts.ALLOW,
      reasonCode: 'allowed',
      matchedRuleIds: ['checkpoint-import'],
    }),
  }]);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory: root,
    auditLedgerId: 'deep-research-pilot-migration-state-audit',
    authorityProvider: () => authority,
    identityResolver: ({ evaluationInput }) => ({
      actorId: evaluationInput.actorId,
      capabilityId: evaluationInput.capabilityId,
      evidenceDigest: evaluationInput.evidenceDigest,
    }),
    now: () => new Date(TIMESTAMP),
  }, ledger, policies);
  const checkpointFacts = buildInflightMigrationCheckpointFacts(envelope, evidence.proof, TIMESTAMP);
  const event = prepareInflightMigrationCheckpointEventWrite(checkpointFacts, {
    eventId: `deep-research-pilot-checkpoint-${row.rowId}`,
    streamId: `deep-research-pilot-migration:${row.rowId}`,
    streamSequence: 1,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'deep-research-pilot-tests', version: '1' },
    authorityEpoch: authority.epoch,
    correlationId: `deep-research-pilot-migration:${row.rowId}`,
    causationId: null,
    idempotencyKey: envelope.idempotencyKey,
  }, eventRegistry);
  const policy = policies.resolve('deep-research-pilot-migration-policy', 1);
  const authorization = await gateway.authorize({
    requestId: `deep-research-pilot-migration-request-${row.rowId}`,
    mode: 'research',
    event,
    priorHead: await ledger.getVerifiedHead(),
    priorStateVersion: 'deep-research-state@1',
    priorStateFingerprint: digest({ state: 'deep-research-pilot' }),
    actorId: 'deep-research-pilot-migration',
    capabilityId: 'checkpoint-import',
    authorityEpoch: authority.epoch,
    policy: {
      policyId: policy.policyId,
      policyVersion: policy.policyVersion,
      policyDigest: policy.digest,
    },
    evidenceDigest: digest(checkpointFacts),
  });
  if (authorization.verdict !== AuthorizationVerdicts.ALLOW) {
    throw new Error(`migration authorization denied: ${authorization.reasonCode}`);
  }
  return { ledger, checkpointFacts, event, proof: authorization.proof };
}

async function buildHandoff(
  root: string,
  evidence: EvidenceAssembly,
): Promise<InflightMigrationHandoff> {
  const coordinator = new MigrationCoordinator({
    rootDirectory: root,
    now: () => new Date(TIMESTAMP),
  });
  const receipts = new Map<string, MigrationReceipt>();
  for (const row of evidence.manifest.rows) {
    const currentEvidence = evidence.migrationEvidence.get(row.rowId);
    const shouldRunBlocked = row.disposition === InflightDisposition.BLOCK;
    const context = row.rowId === 'research-state' && row.disposition === InflightDisposition.MIGRATE
      && currentEvidence?.proof.kind === 'migrate'
      ? await migrationLedgerContext(join(root, 'research-state-ledger'), evidence.manifest, row, currentEvidence)
      : undefined;
    const result = await coordinator.runRow({
      manifest: evidence.manifest,
      row,
      currentEvidence: shouldRunBlocked ? undefined : currentEvidence,
      ledgerContext: context,
    });
    receipts.set(row.rowId, result.receipt);
  }
  return buildInflightMigrationHandoff(evidence.manifest, receipts);
}

const ROLLBACK_PROFILE: CertificationProfile = Object.freeze({
  scheme: 'hmac-sha256',
  provider_id: 'deep-research-pilot-rollback',
  key_id: 'deep-research-pilot-rollback-k1',
  verifier_version: '1',
  trust_scope: 'durable-cross-resume',
});
const MIGRATION_PROFILE: CertificationProfile = Object.freeze({
  scheme: 'hmac-sha256',
  provider_id: 'deep-research-pilot-migration',
  key_id: 'deep-research-pilot-migration-k1',
  verifier_version: '1',
  trust_scope: 'durable-cross-resume',
});

function rollbackProvider() {
  return createHmacCertificationProvider(ROLLBACK_PROFILE, 'a'.repeat(32));
}

function migrationProviders(): CertificationProviderRegistry {
  return new CertificationProviderRegistry([
    createHmacCertificationProvider(MIGRATION_PROFILE, 'b'.repeat(32)),
  ]);
}

async function migrationCertificateReceipt(label: string): Promise<MigrationReceipt> {
  const facts = {
    receipt_id: `deep-research-pilot-receipt-${label}`,
    boundary_id: `deep-research-pilot-boundary-${label}`,
    boundary_kind: 'phase-handoff' as const,
    scope: 'phase' as const,
    scope_id: 'deep-research-pilot',
    from_state: 'cutover_ready',
    to_state: 'new_authoritative_reversible',
    from_head: { ledger_id: 'deep-research-pilot-domain', sequence: 1, record_hash: digest(`${label}:from`) },
    result_head: { ledger_id: 'deep-research-pilot-domain', sequence: 2, record_hash: digest(`${label}:result`) },
    result_event_id: `deep-research-pilot-event-${label}`,
    result_event_type: 'deep-loop-cutover.ledger.certificate-issued',
    result_event_digest: digest(`${label}:event`),
    result_code: 'ok',
    evidence_digest: digest(`${label}:evidence`),
    artifact_digests: [],
    replay_fingerprint: digest(`${label}:replay`),
    authority_epoch: AUTHORITY_EPOCH,
    correlation_id: `deep-research-pilot-correlation-${label}`,
    causation_id: `deep-research-pilot-causation-${label}`,
    issuer: 'deep-research-pilot-tests',
    issued_at: TIMESTAMP,
    idempotency_key: `deep-research-pilot-receipt-${label}`,
  };
  const certification = await certifyBoundaryReceipt(facts as never, MIGRATION_PROFILE, migrationProviders());
  return Object.freeze({ ...facts, certification }) as unknown as MigrationReceipt;
}

async function cutoverCertificate(
  manifest: InflightClassificationManifest,
  policy: Readonly<{ policyId: string; policyVersion: number; digest: string }>,
): Promise<CutoverCertificate> {
  const rollbackFacts = {
    schemaVersion: ROLLBACK_CERTIFICATE_SCHEMA_VERSION,
    mode: MODE,
    candidateSha: CANDIDATE_SHA,
    passed: true,
    classificationDigest: manifest.finalDigest,
    startingAuthorityEpoch: AUTHORITY_EPOCH,
  };
  const rollback = await createRollbackDrillCertificate(
    rollbackFacts as never,
    rollbackProvider(),
    ROLLBACK_PROFILE,
  );
  const result = await buildCutoverCertificate({
    mode: MODE,
    candidateSha: CANDIDATE_SHA,
    fromAuthorityEpoch: AUTHORITY_EPOCH,
    issuer: 'deep-research-pilot-tests',
    issuedAt: '2026-08-22T10:15:00.000Z',
    evidence: {
      modeGateCertificate: {
        mode: MODE,
        candidateSha: CANDIDATE_SHA,
        authorityEpoch: AUTHORITY_EPOCH,
        readiness: 'ready-for-phase-014-consideration',
        certificateDigest: digest('deep-research-pilot-mode-gate'),
      },
      shadowParity: {
        mode: MODE,
        candidateSha: CANDIDATE_SHA,
        exitStatus: 'green',
        evidenceDigest: digest('deep-research-pilot-shadow-parity'),
      },
      rollbackDrillCertificate: rollback,
      mixedVersionReplay: Object.freeze({
        ok: true,
        caseId: 'deep-research-pilot-mixed-version',
        capsuleDigest: digest('deep-research-pilot-capsule'),
        evidenceDigest: digest('deep-research-pilot-replay-evidence'),
        deterministicRuns: 2,
        parityEligible: true,
        certificateEligible: true,
        authorityState: 'legacy_authoritative',
        authorityMutation: false,
      }) as never,
      classificationManifest: manifest,
      migrationReceipts: [await migrationCertificateReceipt('one')] as never,
      approvingPolicy: policy,
    },
  }, {
    rollbackDrillProvider: rollbackProvider(),
    migrationReceiptProviders: migrationProviders(),
  });
  if (result.verdict !== 'issued') throw new Error(`cutover certificate failed: ${result.reasonCode}`);
  return result.certificate;
}

function preflightInput(
  manifest: InflightClassificationManifest,
  handoff: InflightMigrationHandoff,
  certificate: CutoverCertificate,
): CutoverPreflightInput {
  return {
    mode: MODE,
    expectedAuthorityEpoch: AUTHORITY_EPOCH,
    alreadyFlippedModes: new Set(),
    cutover: {
      certificate,
      expectation: {
        mode: MODE,
        candidateSha: CANDIDATE_SHA,
        fromAuthorityEpoch: AUTHORITY_EPOCH,
        policyId: certificate.facts.evidence.approvingPolicyId,
        policyVersion: certificate.facts.evidence.approvingPolicyVersion,
        policyDigest: certificate.facts.evidence.approvingPolicyDigest,
      },
    },
    migration: { handoff, classificationManifest: manifest },
    rollbackAssetDigests: [digest('deep-research-pilot-rollback-one'), digest('deep-research-pilot-rollback-two')],
  };
}

function seedAuthorityRecord(root: string): void {
  const core = {
    schemaVersion: 1 as const,
    mode: MODE,
    state: 'cutover_ready' as const,
    epoch: AUTHORITY_EPOCH,
    selectedWriter: 'legacy' as const,
    candidateSha: null,
    policyVersion: 0,
    cutoverCertificateDigest: null,
    lastTransitionDigest: null,
    updatedAt: TIMESTAMP,
  };
  const record = { ...core, recordDigest: digest(core) };
  mkdirSync(root, { recursive: true });
  writeFileSync(join(root, `authority-${MODE}.json`), `${JSON.stringify(record)}\n`);
}

interface Scenario {
  readonly root: string;
  readonly evidence: EvidenceAssembly;
  readonly handoff: InflightMigrationHandoff;
  readonly preflight: CutoverPreflightInput;
  readonly registry: AuthorityRegistry;
  readonly factory: ReturnType<typeof createAuthorityFlipCoordinator>;
  readonly policy: ReturnType<ReturnType<typeof createAuthorityFlipCoordinator>['policies']['resolve']>;
}

async function assembleScenario(options: {
  readonly includeNegativeEvidence?: boolean;
  readonly denyPolicy?: boolean;
} = {}): Promise<Scenario> {
  const root = temporaryRoot('scenario');
  const evidence = await assembleEvidence(join(root, 'evidence'), options.includeNegativeEvidence === true);
  const handoff = await buildHandoff(join(root, 'migration'), evidence);
  const registryRoot = join(root, 'authority-registry');
  seedAuthorityRecord(registryRoot);
  const registry = new AuthorityRegistry(registryRoot, () => new Date(TIMESTAMP));
  const factory = createAuthorityFlipCoordinator({
    rootDirectory: join(root, 'authority-ledger'),
    ledgerId: 'deep-research-pilot-authority',
    auditLedgerId: 'deep-research-pilot-authority-audit',
    registry,
    expectedIdentity: { actorId: ACTOR_ID, capabilityId: CAPABILITY_ID },
    authorizedActorIds: options.denyPolicy ? ['different-actor'] : [ACTOR_ID],
    authorizedCapabilityIds: [CAPABILITY_ID],
    now: () => new Date(TIMESTAMP),
  });
  const policy = factory.policies.resolve(AUTHORITY_FLIP_POLICY_ID, 1);
  const certificate = await cutoverCertificate(evidence.manifest, policy);
  const preflight = preflightInput(evidence.manifest, handoff, certificate);
  return { root, evidence, handoff, preflight, registry, factory, policy };
}

function cutoverRequest(
  preflight: CutoverPreflightInput,
  policy: Readonly<{ policyId: string; policyVersion: number; digest: string }>,
): CutoverRequest {
  return {
    requestedModes: [MODE],
    preflight,
    requestId: 'deep-research-pilot-cutover-request',
    actorId: ACTOR_ID,
    capabilityId: CAPABILITY_ID,
    policyId: policy.policyId,
    policyVersion: policy.policyVersion,
    policyDigest: policy.digest,
    streamId: 'deep-research-pilot-authority-flip',
    correlationId: 'deep-research-pilot-cutover-correlation',
    decidedAt: '2026-08-22T10:20:00.000Z',
  };
}

afterEach(() => {
  for (const root of ROOTS.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('deep-research real-evidence authority flip', () => {
  it('flips from a manifest built by all four real research evidence producers', async () => {
    const scenario = await assembleScenario();
    const preflightResult = evaluateCutoverPreflight(scenario.preflight);
    expect(preflightResult.verdict).toBe('ready');
    expect(scenario.evidence.manifest.rows.find((row) => row.rowId === 'research-config')?.disposition)
      .toBe(InflightDisposition.UPCAST);
    const researchDeltasRow = scenario.evidence.manifest.rows.find((row) => row.rowId === 'research-deltas');
    expect(scenario.evidence.manifestEvidence.get('research-deltas'), JSON.stringify(scenario.evidence.manifestEvidence.get('research-deltas')))
      .toMatchObject({ proof: { kind: 'upcast' } });
    expect(
      Object.values(scenario.evidence.manifestEvidence.get('research-deltas')?.proof ?? {}).filter((value) => value === false),
      JSON.stringify(scenario.evidence.manifestEvidence.get('research-deltas')?.proof),
    ).toHaveLength(0);
    expect(researchDeltasRow?.disposition, JSON.stringify(researchDeltasRow)).toBe(InflightDisposition.UPCAST);
    expect(scenario.evidence.manifest.rows.find((row) => row.rowId === 'research-projections')?.disposition)
      .toBe(InflightDisposition.UPCAST);
    expect(scenario.evidence.manifest.rows.find((row) => row.rowId === 'research-state')?.disposition)
      .toBe(InflightDisposition.MIGRATE);
    expect(scenario.evidence.positiveStateEvidence.proof.kind).toBe('migrate');
    if (scenario.evidence.positiveStateEvidence.proof.kind !== 'migrate') throw new Error('expected migrate proof');
    expect(Object.values(scenario.evidence.positiveStateEvidence.proof).filter((value) => value === false)).toHaveLength(0);

    const decision = await scenario.factory.coordinator.requestCutover(
      cutoverRequest(scenario.preflight, scenario.policy),
    );
    expect(decision.disposition).toBe('flipped');
    const record = scenario.registry.read(MODE);
    expect(record.state).toBe('new_authoritative_reversible');
    expect(record.epoch).toBe(AUTHORITY_EPOCH + 1);
    const events = await scenario.factory.ledger.readVerifiedEvents();
    expect(events.filter((entry) => entry.event.effective.envelope.event_type === AUTHORITY_FLIP_EVENT_TYPE)).toHaveLength(1);
  });

  it('leaves the registry record and ledger whole when the transition policy denies', async () => {
    const scenario = await assembleScenario({ denyPolicy: true });
    expect(evaluateCutoverPreflight(scenario.preflight).verdict).toBe('ready');
    const before = scenario.registry.read(MODE);
    const decision = await scenario.factory.coordinator.requestCutover(
      cutoverRequest(scenario.preflight, scenario.policy),
    );
    expect(decision).toEqual({ disposition: 'denied', reasonCode: 'AUTHORIZATION_DENIED' });
    expect(scenario.registry.read(MODE)).toEqual(before);
    expect(await scenario.factory.ledger.readVerifiedEvents()).toHaveLength(0);
  });

  it('rejects a fresh research-state MIGRATE proof with one observed flag perturbed', async () => {
    const scenario = await assembleScenario({ includeNegativeEvidence: true });
    const negativeEvidence = scenario.evidence.negativeStateEvidence;
    expect(negativeEvidence).not.toBeNull();
    if (negativeEvidence === null || negativeEvidence.proof.kind !== 'migrate') throw new Error('expected negative migrate proof');
    expect(negativeEvidence.proof.quiescentCheckpoint).toBe(false);
    const researchStateHandoff = scenario.handoff.rows.find((row) => row.rowId === 'research-state');
    expect(researchStateHandoff).toMatchObject({
      disposition: InflightDisposition.MIGRATE,
      status: MigrationOperationStatuses.BLOCKED,
    });
    expect(evaluateCutoverPreflight(scenario.preflight)).toEqual({
      verdict: 'blocked',
      reasonCode: 'MIGRATION_HANDOFF_INVALID',
    });
    const decision = await scenario.factory.coordinator.requestCutover(
      cutoverRequest(scenario.preflight, scenario.policy),
    );
    expect(decision).toEqual({ disposition: 'denied', reasonCode: 'MIGRATION_HANDOFF_INVALID' });
    const record = scenario.registry.read(MODE);
    expect(record.state).toBe('cutover_ready');
    expect(record.epoch).toBe(AUTHORITY_EPOCH);
    expect(await scenario.factory.ledger.readVerifiedEvents()).toHaveLength(0);
  });
});
