// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Resume Adapter Tests
// ───────────────────────────────────────────────────────────────────

import { appendAuthorizedForTest } from '../fixtures/authorized-ledger-test-helper.js';

import {
  mkdtempSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

const certificateControl = vi.hoisted(() => ({
  calls: 0,
  result: {
    verdict: 'valid',
    certificateDigest: '',
    replayFingerprint: '',
    projectionIntegrityDigest: '',
    receiptChainDigest: '',
    artifactSetDigest: '',
  } as Record<string, unknown>,
}));

vi.mock('../../lib/deep-review-certificates/index.js', async () => {
  const actual = await vi.importActual<
    typeof import('../../lib/deep-review-certificates/index.js')
  >('../../lib/deep-review-certificates/index.js');
  return {
    ...actual,
    parseDeepReviewCertificateBundle: (input: unknown) => input,
    verifyDeepReviewCertificateOffline: vi.fn(async () => {
      certificateControl.calls += 1;
      return certificateControl.result;
    }),
  };
});

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  createDeepReviewEventRegistry,
  prepareDeepReviewEvent,
} from '../../lib/deep-review-ledger-schema/index.js';
import {
  DEEP_REVIEW_PROJECTION_CODEC_VERSION,
  DEEP_REVIEW_PROJECTION_SCHEMA_VERSION,
  DEEP_REVIEW_REDUCER_VERSION,
  deepReviewProjectionIntegrityDigest,
} from '../../lib/deep-review-reducers/index.js';
import {
  createDeepReviewSealedArtifactStore,
} from '../../lib/deep-review-sealed-artifacts/index.js';
import {
  DEEP_REVIEW_CONTINUITY_LADDER,
  DEEP_REVIEW_RESUME_ADAPTER_VERSION,
  DeepReviewResumeAdapter,
  deepReviewMigrationRegistryDigest,
  deepReviewResumeFingerprintDigest,
  parseDeepReviewResumeRequest,
} from '../../lib/deep-review-resume-adapter/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  CertificationProviderRegistry,
  EFFECT_CONFIRMATION_EVENT_TYPE,
  EFFECT_INTENT_EVENT_TYPE,
  createEvidenceControlEventRegistry,
  effectConfirmationBindsIntent,
} from '../../lib/receipts-and-effect-recovery/index.js';
import {
  createReplayFingerprintVersionRegistry,
} from '../../lib/replay-fingerprint/index.js';

import type {
  GatewayAllowProof,
  VerifiedLedgerEvent,
} from '../../lib/authorized-ledger/index.js';
import type {
  DeepReviewCertificateBundle,
} from '../../lib/deep-review-certificates/index.js';
import type {
  DeepReviewEventInput,
  DeepReviewEventStem,
  DeepReviewPayloadMap,
  DeepReviewReplayMetadata,
  DeepReviewScopeMap,
} from '../../lib/deep-review-ledger-schema/index.js';
import type {
  DeepReviewAuthenticatedMigrationRegistry,
  DeepReviewMigrationRegistryEntry,
  DeepReviewResumeAdapterOptions,
  DeepReviewResumeAdapterResult,
  DeepReviewResumeFingerprint,
  DeepReviewResumeRequest,
} from '../../lib/deep-review-resume-adapter/index.js';
import type {
  EventTypeRegistry,
  EventWritePreflight,
  JsonObject,
} from '../../lib/event-envelope/index.js';
import type {
  EffectConfirmationPayload,
  EffectIntentPayload,
} from '../../lib/receipts-and-effect-recovery/index.js';

const T0 = '2026-07-27T10:00:00.000Z';
const T1 = '2026-07-27T10:01:00.000Z';
const T2 = '2026-07-27T10:02:00.000Z';
const RUN_ID = 'deep-review-resume-run-1';
const SESSION_ID = 'deep-review-resume-session-1';
const STREAM_ID = 'deep-review-resume-stream-1';
const AUTHORITY = Object.freeze({ state: 'shadowing' as const, epoch: 1 });
const roots: string[] = [];

interface Scenario {
  readonly rootDirectory: string;
  readonly ledger: AppendOnlyLedger;
  readonly effectLedger: AppendOnlyLedger;
  readonly effectRegistry: EventTypeRegistry;
  readonly effectGateway: TransitionAuthorizationGateway;
  readonly effectPolicies: TransitionPolicyRegistry;
  readonly gateway: TransitionAuthorizationGateway;
  readonly policies: TransitionPolicyRegistry;
  readonly registry: EventTypeRegistry;
  readonly persisted: DeepReviewResumeFingerprint;
  readonly certificateBundle: DeepReviewCertificateBundle;
  createAdapter(
    current?: DeepReviewResumeFingerprint,
    entries?: readonly DeepReviewMigrationRegistryEntry[],
    registryMutation?: Partial<DeepReviewAuthenticatedMigrationRegistry>,
  ): DeepReviewResumeAdapter;
}

function hash(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `deep-review-resume-${label}-`));
  roots.push(root);
  return root;
}

function replayMetadata(): DeepReviewReplayMetadata {
  return {
    fingerprint_version: 1,
    final_digest: hash('event-replay'),
    replay_input_digests: { configuration: hash('configuration') },
  };
}

const TARGET = Object.freeze({
  targetId: 'target-root',
  targetType: 'repository' as const,
  artifactRef: 'artifact:repository',
  sourceDigest: hash('target-source'),
  contentDigest: hash('target-content'),
});

function fingerprint(
  replayFingerprint: string,
  certificateDigest: string,
  overrides: Partial<Omit<DeepReviewResumeFingerprint, 'finalDigest'>> = {},
): DeepReviewResumeFingerprint {
  const body = {
    fingerprintVersion: 1,
    manifestRevision: 'manifest-v1',
    targetDigest: hash(TARGET),
    toolVersion: 'review-tool-v1',
    modelVersion: 'review-model-v1',
    reducerVersion: DEEP_REVIEW_REDUCER_VERSION,
    adapterVersion: DEEP_REVIEW_RESUME_ADAPTER_VERSION,
    schemaVersion: DEEP_REVIEW_PROJECTION_SCHEMA_VERSION,
    codecVersion: DEEP_REVIEW_PROJECTION_CODEC_VERSION,
    policyVersion: 'resume-policy@1',
    replayFingerprint,
    certificateDigest,
    ...overrides,
  };
  return Object.freeze({
    ...body,
    finalDigest: deepReviewResumeFingerprintDigest(body),
  });
}

function migrationRegistry(
  entries: readonly DeepReviewMigrationRegistryEntry[],
): DeepReviewAuthenticatedMigrationRegistry {
  const body = Object.freeze({
    registryVersion: 1 as const,
    authorityEpoch: 1,
    entries: Object.freeze([...entries]),
  });
  return Object.freeze({
    ...body,
    registryDigest: deepReviewMigrationRegistryDigest(body),
  });
}

async function authorize(
  ledger: AppendOnlyLedger,
  gateway: TransitionAuthorizationGateway,
  policies: TransitionPolicyRegistry,
  prepared: EventWritePreflight,
  requestId: string,
  mode = 'review',
): Promise<GatewayAllowProof> {
  const priorHead = await ledger.getVerifiedHead();
  const policy = policies.resolve('resume-policy', 1);
  const result = await gateway.authorize({
    requestId,
    mode,
    event: prepared,
    priorHead,
    priorStateVersion: 'resume-test-state@1',
    priorStateFingerprint: hash(`state:${priorHead.sequence}`),
    actorId: 'resume-test',
    capabilityId: 'write',
    authorityEpoch: 1,
    policy: {
      policyId: policy.policyId,
      policyVersion: policy.policyVersion,
      policyDigest: policy.digest,
    },
    evidenceDigest: prepared.canonicalDigest,
  });
  if (result.verdict !== 'allow') throw new Error('Expected fixture authorization');
  return result.proof;
}

async function appendReviewEvent<TStem extends DeepReviewEventStem>(
  scenario: Pick<Scenario, 'ledger' | 'gateway' | 'policies' | 'registry'>,
  stem: TStem,
  sequence: number,
  scope: DeepReviewScopeMap[TStem],
  data: DeepReviewPayloadMap[TStem],
  cursor: Readonly<{
    streamId?: string;
    streamSequence?: number;
    causationId?: string | null;
  }> = {},
): Promise<VerifiedLedgerEvent> {
  const input: DeepReviewEventInput<TStem> = {
    stem,
    scope,
    prevEventHash: hash(`previous:${sequence}`),
    replay: replayMetadata(),
    data,
    eventId: `review-event-${String(sequence).padStart(3, '0')}`,
    streamId: cursor.streamId ?? STREAM_ID,
    streamSequence: cursor.streamSequence ?? sequence,
    occurredAt: T0,
    recordedAt: T0,
    producer: { name: 'deep-review-resume-tests', version: '1' },
    authorityEpoch: 1,
    correlationId: RUN_ID,
    causationId: cursor.causationId === undefined
      ? sequence === 1
        ? null
        : `review-event-${String(sequence - 1).padStart(3, '0')}`
      : cursor.causationId,
    idempotencyKey: `review-event-${sequence}`,
  };
  const prepared = prepareDeepReviewEvent(input, scenario.registry);
  const proof = await authorize(
    scenario.ledger,
    scenario.gateway,
    scenario.policies,
    prepared,
    `review-request-${sequence}`,
  );
  await appendAuthorizedForTest(scenario.ledger, prepared, proof);
  const events = await scenario.ledger.readVerifiedEvents();
  return events.at(-1)!;
}

async function seedReviewHistory(
  scenario: Pick<Scenario, 'ledger' | 'gateway' | 'policies' | 'registry'>,
  finalCursor: Readonly<{
    streamId?: string;
    streamSequence?: number;
    causationId?: string | null;
  }> = {},
): Promise<void> {
  const runScope = { runId: RUN_ID, sessionId: SESSION_ID };
  const generationScope = { ...runScope, generation: 1 };
  const iterationScope = { ...generationScope, iterationId: 'iteration-1' };
  const dimensionScope = { ...iterationScope, dimensionId: 'correctness' };
  await appendReviewEvent(scenario, 'deep_review.run_initialized', 1, generationScope, {
    target: TARGET,
    lineageMode: 'fresh',
    maxIterations: 4,
    convergencePolicyVersion: 'review-convergence@1',
    reviewModeContractDigest: hash('review-contract'),
    initialReleaseReadinessState: 'not-assessed',
  });
  await appendReviewEvent(scenario, 'deep_review.scope_resolved', 2, runScope, {
    targetSetDigest: hash('target-set'),
    scopeClass: 'targeted',
    selectedTargets: [{
      targetId: 'target-file',
      targetType: 'file',
      artifactRef: 'artifact:src/review.ts',
      sourceDigest: hash('review-source'),
      contentDigest: hash('review-content'),
    }],
    omittedHighRiskTargetRefs: [],
    discoveryMethodIds: ['changed-files'],
    scopeEvidenceRefs: ['scope-evidence-1'],
  });
  await appendReviewEvent(scenario, 'deep_review.dimension_ordered', 3, runScope, {
    orderedDimensionIds: ['correctness'],
    riskRationale: 'Correctness is the required fixture dimension.',
    scopeEvidenceRefs: ['scope-evidence-1'],
    orderingPolicyVersion: 'dimension-order@1',
  });
  await appendReviewEvent(scenario, 'deep_review.dimension_pass_started', 4, dimensionScope, {
    passNumber: 1,
    targetRefs: ['target:src/review.ts'],
    filesReviewed: ['file:src/review.ts'],
    searchCoverageDigest: hash('pass-started'),
    passStatus: 'started',
    nextFocusRef: 'focus:evidence',
  });
  await appendReviewEvent(scenario, 'deep_review.dimension_pass_completed', 5, dimensionScope, {
    passNumber: 1,
    targetRefs: ['target:src/review.ts'],
    filesReviewed: ['file:src/review.ts'],
    searchCoverageDigest: hash('pass-complete'),
    passStatus: 'complete',
    rawFindingCounts: { candidates: 0, adjudicated: 0, p0: 0, p1: 0, p2: 0 },
    nextFocusRef: 'focus:convergence',
  }, finalCursor);
}

async function createScenario(
  label: string,
  finalCursor: Readonly<{
    streamId?: string;
    streamSequence?: number;
    causationId?: string | null;
  }> = {},
): Promise<Scenario> {
  const rootDirectory = temporaryRoot(label);
  const ledgerLabel = label.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const registry = createDeepReviewEventRegistry();
  const policies = new TransitionPolicyRegistry([{
    policyId: 'resume-policy',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['dark-resume'],
    evaluate: () => ({ verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['dark-resume'] }),
  }]);
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: `review-${ledgerLabel}`,
    auditLedgerId: `review-${ledgerLabel}-authorization`,
    authorityProvider: () => AUTHORITY,
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: `review-${ledgerLabel}-authorization`,
    authorityProvider: () => AUTHORITY,
  }, ledger, policies);
  const effectRegistry = createEvidenceControlEventRegistry();
  const effectPolicies = new TransitionPolicyRegistry([{
    policyId: 'resume-policy',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['effects'],
    evaluate: () => ({ verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['effects'] }),
  }]);
  const effectLedger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: `effects-${ledgerLabel}`,
    auditLedgerId: `effects-${ledgerLabel}-authorization`,
    authorityProvider: () => AUTHORITY,
  }, effectRegistry);
  const effectGateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: `effects-${ledgerLabel}-authorization`,
    authorityProvider: () => AUTHORITY,
  }, effectLedger, effectPolicies);
  const shell = {
    rootDirectory,
    ledger,
    effectLedger,
    effectRegistry,
    effectGateway,
    effectPolicies,
    gateway,
    policies,
    registry,
  };
  await seedReviewHistory(shell as Scenario, finalCursor);
  const head = await ledger.getVerifiedHead();
  const certificateDigest = hash(`certificate:${label}`);
  const replayFingerprint = hash(`certificate-replay:${label}`);
  const persisted = fingerprint(replayFingerprint, certificateDigest);
  const certificateBundle = {
    bundleVersion: 1,
    certificate: {
      body: {
        startHead: {
          ledger_id: head.ledgerId,
          sequence: 0,
          record_hash: '0'.repeat(64),
        },
        finalHead: {
          ledger_id: head.ledgerId,
          sequence: head.sequence,
          record_hash: head.recordHash,
        },
      },
      certificateDigest,
    },
    receipts: [],
  } as unknown as DeepReviewCertificateBundle;
  certificateControl.result = {
    verdict: 'valid',
    certificateDigest,
    replayFingerprint,
    projectionIntegrityDigest: hash('projection'),
    receiptChainDigest: hash('receipt-chain'),
    artifactSetDigest: hash('artifact-set'),
  };
  const createAdapter = (
    current = persisted,
    entries: readonly DeepReviewMigrationRegistryEntry[] = [],
    registryMutation: Partial<DeepReviewAuthenticatedMigrationRegistry> = {},
  ): DeepReviewResumeAdapter => {
    const authenticated = migrationRegistry(entries);
    const supplied = Object.freeze({ ...authenticated, ...registryMutation });
    const options: DeepReviewResumeAdapterOptions = {
      ledger,
      effectLedger,
      gateway,
      policies,
      eventRegistry: registry,
      fingerprintVersions: createReplayFingerprintVersionRegistry(),
      artifactStore: createDeepReviewSealedArtifactStore({
        rootDirectory: join(rootDirectory, `artifacts-${current.finalDigest.slice(0, 8)}`),
      }),
      certificateReplay: {
        ledger,
        runId: RUN_ID,
        rangeStartSequence: 1,
        rangeEndSequence: 5,
      } as unknown as DeepReviewResumeAdapterOptions['certificateReplay'],
      certificateProviders: new CertificationProviderRegistry([]),
      installedFingerprint: current,
      migrationRegistry: supplied,
      trustedMigrationRegistryDigest: authenticated.registryDigest,
      producer: { name: 'deep-review-resume-tests', version: '1' },
      policyId: 'resume-policy',
      policyVersion: 1,
      actorId: 'resume-adapter',
      capabilityId: 'resume-write',
      authorityEpoch: 1,
      priorStateVersion: 'deep-review-resume@1',
    };
    return new DeepReviewResumeAdapter(options);
  };
  return Object.freeze({
    ...shell,
    persisted,
    certificateBundle,
    createAdapter,
  });
}

function request(
  scenario: Scenario,
  current = scenario.persisted,
  idempotencyKey = `resume-${current.finalDigest.slice(0, 12)}`,
): DeepReviewResumeRequest {
  return {
    runId: RUN_ID,
    manifestRevision: current.manifestRevision,
    idempotencyKey,
    requestedAt: T1,
    resumeReason: 'Resume from offline-verified evidence.',
    persistedFingerprint: scenario.persisted,
    currentFingerprint: current,
    lease: {
      runId: RUN_ID,
      sessionId: SESSION_ID,
      leaseId: 'persisted-lease-1',
      generation: 1,
      deadlineAt: '2026-07-27T11:00:00.000Z',
      remainingMs: 3_600_000,
      replayFingerprint: scenario.persisted.replayFingerprint,
    },
    checkpoint: null,
    priorCertificateBundle: scenario.certificateBundle,
  };
}

function projected(result: DeepReviewResumeAdapterResult) {
  if (result.status === 'rebuild_required') {
    throw new Error(`Expected projected result, got ${result.reasonCodes.join(',')}`);
  }
  return result;
}

async function appendEffect(
  scenario: Scenario,
  eventType: string,
  eventId: string,
  sequence: number,
  payload: JsonObject,
  causationId: string | null,
): Promise<VerifiedLedgerEvent> {
  const payloadIdempotencyKey = String(payload.idempotency_key);
  const prepared = prepareEventWrite({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: eventId,
    event_type: eventType,
    event_version: 1,
    stream_id: 'effect-stream-1',
    stream_sequence: sequence,
    occurred_at: T1,
    recorded_at: T1,
    producer: { name: 'effect-fixture', version: '1' },
    authority_epoch: 1,
    correlation_id: RUN_ID,
    causation_id: causationId,
    idempotency_key: eventType === EFFECT_CONFIRMATION_EVENT_TYPE
      ? `${payloadIdempotencyKey}:confirmation`
      : payloadIdempotencyKey,
    payload,
  }, scenario.effectRegistry);
  const proof = await authorize(
    scenario.effectLedger,
    scenario.effectGateway,
    scenario.effectPolicies,
    prepared,
    `effect-request-${sequence}`,
  );
  await appendAuthorizedForTest(scenario.effectLedger, prepared, proof);
  return (await scenario.effectLedger.readVerifiedEvents()).at(-1)!;
}

async function seedForgedConfirmation(
  scenario: Scenario,
  forgedFact:
    | 'intent_event_id'
    | 'intent_event_digest'
    | 'idempotency_key'
    | 'postcondition_digest',
) {
  const effectKey = 'effect-key-1';
  const intentEventId = `effect-intent-${hash(effectKey)}`;
  const intent: EffectIntentPayload = {
    effect_id: `effect-${hash(effectKey)}`,
    run_id: RUN_ID,
    logical_effect_id: 'logical-effect-1',
    effect_type: 'file',
    operation: 'persist-review',
    target_identity: 'target-review-report',
    input_digest: hash('effect-input'),
    safe_metadata: {},
    secret_references: [],
    adapter: {
      adapter_id: 'review-effect-adapter',
      adapter_version: 'adapter-v1',
      effect_type: 'file',
      replay_safe: false,
      idempotency_mode: 'postcondition',
      reconciliation: 'none',
    },
    idempotency_key: effectKey,
    recovery_policy: 'unknown-block',
    expected_postcondition_digest: hash('expected-postcondition'),
    replay_fingerprint: scenario.persisted.finalDigest,
    requested_at: T1,
  };
  const intentEvent = await appendEffect(
    scenario,
    EFFECT_INTENT_EVENT_TYPE,
    intentEventId,
    1,
    intent,
    null,
  );
  const forgedIdentityKey = forgedFact === 'intent_event_id'
    || forgedFact === 'idempotency_key'
    ? `${effectKey}-${forgedFact}`
    : effectKey;
  const forged: EffectConfirmationPayload = {
    confirmation_id: `effect-confirmation-${hash(forgedIdentityKey)}`,
    effect_id: `effect-${hash(forgedIdentityKey)}`,
    intent_event_id: `effect-intent-${hash(forgedIdentityKey)}`,
    intent_event_digest: forgedFact === 'intent_event_digest'
      ? hash('forged-intent-digest')
      : intentEvent.event.stored.digest,
    idempotency_key: forgedIdentityKey,
    adapter: intent.adapter,
    external_receipt_digest: hash('external-receipt'),
    postcondition_digest: forgedFact === 'postcondition_digest'
      ? hash('forged-postcondition')
      : intent.expected_postcondition_digest,
    output_digest: hash('effect-output'),
    completion_class: 'executed',
    observed_at: T2,
    safe_result_metadata: {},
  };
  await appendEffect(
    scenario,
    EFFECT_CONFIRMATION_EVENT_TYPE,
    forged.confirmation_id,
    2,
    forged,
    intentEventId,
  );
  return Object.freeze({ forged, intent, intentEvent, intentEventId });
}

afterEach(() => {
  vi.clearAllMocks();
  certificateControl.calls = 0;
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('DeepReviewResumeAdapter', () => {
  it('parses a closed request and exports the mode continuity ladder', async () => {
    const scenario = await createScenario('closed');
    expect(parseDeepReviewResumeRequest(request(scenario)).runId).toBe(RUN_ID);
    expect(() => parseDeepReviewResumeRequest({
      ...request(scenario),
      callerCompatibilityVerdict: 'compatible',
    })).toThrow(/closed request shape/);
    expect(DEEP_REVIEW_CONTINUITY_LADDER.map((row) => row.step)).toEqual([
      'init',
      'scope',
      'dimension-pass',
      'findings/evidence',
      'convergence',
      'review-report',
      'continuity-save',
    ]);
  });

  it('covers exact reuse, compatible, migrate, blocked, and rebuild-required decisions', async () => {
    const exactScenario = await createScenario('matrix-exact');
    const exact = projected(await exactScenario.createAdapter().resume(request(exactScenario)));
    expect(exact.decision.reuseDisposition).toBe('exact-reuse');
    expect(exact.decision.passes[0]?.disposition).toBe('reuse');

    const compatibleScenario = await createScenario('matrix-compatible');
    const compatibleCurrent = fingerprint(
      compatibleScenario.persisted.replayFingerprint,
      compatibleScenario.persisted.certificateDigest,
      { modelVersion: 'review-model-v2' },
    );
    const compatibleRule: DeepReviewMigrationRegistryEntry = {
      component: 'model',
      fromVersion: 'review-model-v1',
      toVersion: 'review-model-v2',
      outcome: 'compatible',
      revision: 'model-compat-v1',
    };
    const compatible = projected(await compatibleScenario
      .createAdapter(compatibleCurrent, [compatibleRule])
      .resume(request(compatibleScenario, compatibleCurrent)));
    expect(compatible.decision.reuseDisposition).toBe('compatible');

    const migrateScenario = await createScenario('matrix-migrate');
    const migrateCurrent = fingerprint(
      migrateScenario.persisted.replayFingerprint,
      migrateScenario.persisted.certificateDigest,
      { toolVersion: 'review-tool-v2' },
    );
    const migrateRule: DeepReviewMigrationRegistryEntry = {
      component: 'tool',
      fromVersion: 'review-tool-v1',
      toVersion: 'review-tool-v2',
      outcome: 'migrate',
      revision: 'tool-migration-v1',
    };
    const migrate = projected(await migrateScenario
      .createAdapter(migrateCurrent, [migrateRule])
      .resume(request(migrateScenario, migrateCurrent)));
    expect(migrate.decision.reuseDisposition).toBe('migrate');
    expect(migrate.decision.passes[0]?.disposition).toBe('reexecute');

    const blockedScenario = await createScenario('matrix-blocked');
    const blockedCurrent = fingerprint(
      blockedScenario.persisted.replayFingerprint,
      blockedScenario.persisted.certificateDigest,
      { policyVersion: 'resume-policy@2' },
    );
    const blocked = projected(await blockedScenario
      .createAdapter(blockedCurrent)
      .resume(request(blockedScenario, blockedCurrent)));
    expect(blocked.decision.reuseDisposition).toBe('blocked');

    const rebuildScenario = await createScenario('matrix-rebuild');
    certificateControl.result = {
      verdict: 'invalid',
      code: 'CERTIFICATE_INVALID',
      evidenceLocation: 'certificate:digest',
      expectedDigest: hash('expected'),
      actualDigest: hash('actual'),
      failureReason: 'Certificate digest was mutated.',
      evidenceDigest: hash('failure'),
    };
    const rebuild = await rebuildScenario.createAdapter().resume(request(rebuildScenario));
    expect(rebuild.status).toBe('rebuild_required');
    if (rebuild.status === 'rebuild_required') {
      expect(rebuild.reasonCodes).toContain('prior-certificate-invalid');
    }
  });

  it('does not trust caller-compatible state-bearing drift or an unauthenticated registry', async () => {
    const scenario = await createScenario('compatibility');
    const changedTarget = fingerprint(
      scenario.persisted.replayFingerprint,
      scenario.persisted.certificateDigest,
      { targetDigest: hash('new-target') },
    );
    const assertedCompatible: DeepReviewMigrationRegistryEntry = {
      component: 'target',
      fromVersion: scenario.persisted.targetDigest,
      toVersion: changedTarget.targetDigest,
      outcome: 'compatible',
      revision: 'caller-compatible-v1',
    };
    const promoted = projected(await scenario
      .createAdapter(changedTarget, [assertedCompatible])
      .resume(request(scenario, changedTarget, 'resume-promoted')));
    expect(promoted.decision.compatibility
      .find((entry) => entry.component === 'target')?.outcome).toBe('migrate');

    const untrustedScenario = await createScenario('unauthenticated-registry');
    const untrustedTarget = fingerprint(
      untrustedScenario.persisted.replayFingerprint,
      untrustedScenario.persisted.certificateDigest,
      { targetDigest: hash('untrusted-target') },
    );
    const untrusted = projected(await untrustedScenario
      .createAdapter(untrustedTarget, [{
        ...assertedCompatible,
        fromVersion: untrustedScenario.persisted.targetDigest,
        toVersion: untrustedTarget.targetDigest,
      }], { registryDigest: hash('forged-registry') })
      .resume(request(untrustedScenario, untrustedTarget, 'resume-untrusted')));
    expect(untrusted.decision.compatibilityOutcome).toBe('blocked');
  });

  it('recomputes changed identity and runtime facts instead of reusing a digest claim', async () => {
    const fields = [
      ['toolVersion', 'review-tool-v2'],
      ['modelVersion', 'review-model-v2'],
      ['policyVersion', 'resume-policy@2'],
      ['targetDigest', hash('changed-target')],
      ['reducerVersion', 'deep-review-reducer@forged'],
      ['adapterVersion', 'deep-review-resume-adapter@forged'],
      ['schemaVersion', 'deep-review-projection@2'],
      ['codecVersion', 'deep-review-codec@forged'],
    ] as const;
    for (const [field, value] of fields) {
      const scenario = await createScenario(`fingerprint-${field}`);
      const current = fingerprint(
        scenario.persisted.replayFingerprint,
        scenario.persisted.certificateDigest,
        { [field]: value },
      );
      const result = projected(await scenario
        .createAdapter(current)
        .resume(request(scenario, current, `resume-${field}`)));
      expect(result.decision.reuseDisposition).not.toBe('exact-reuse');
      expect(result.decision.compatibility
        .find((entry) => entry.component === field.replace('Version', '')
          .replace('Digest', ''))?.outcome).toBe('blocked');
    }
  });

  it.each([
    'intent_event_id',
    'intent_event_digest',
    'idempotency_key',
    'postcondition_digest',
  ] as const)(
    'keeps a confirmation forged through %s recovery-required',
    async (forgedFact) => {
      const scenario = await createScenario(`forged-effect-${forgedFact}`);
      const seeded = await seedForgedConfirmation(scenario, forgedFact);
      expect(effectConfirmationBindsIntent(
        seeded.forged,
        seeded.intent,
        seeded.intentEventId,
        seeded.intentEvent.event.stored.digest,
      )).toBe(false);
      const result = projected(await scenario.createAdapter().resume(request(scenario)));
      expect(result.decision.effects).toHaveLength(1);
      expect(result.decision.effects[0]).toMatchObject({
        applicationState: 'unknown',
        disposition: 'blocked',
      });
      expect(result.decision.effects[0]?.attemptRefs).toEqual([
        `effect-intent-${hash('effect-key-1')}`,
      ]);
    },
  );

  it('rejects a self-consistent forged checkpoint cursor without appending', async () => {
    const scenario = await createScenario('forged-checkpoint');
    const first = projected(await scenario.createAdapter().resume(request(scenario)));
    const forgedTail = first.checkpoint.sourceTailSequence + 1;
    const forgedCheckpoint = {
      projection: first.checkpoint.projection,
      sourceTailSequence: forgedTail,
      sourceTailEventDigest: first.checkpoint.sourceTailEventDigest,
      integrityDigest: hash({
        projectionDigest: deepReviewProjectionIntegrityDigest(first.checkpoint.projection),
        sourceTailSequence: forgedTail,
        sourceTailEventDigest: first.checkpoint.sourceTailEventDigest,
      }),
    };
    const headBefore = await scenario.ledger.getVerifiedHead();
    const verifierCallsBefore = certificateControl.calls;
    const result = await scenario.createAdapter().resume({
      ...request(scenario, scenario.persisted, 'resume-forged-checkpoint'),
      checkpoint: forgedCheckpoint,
    });
    expect(result.status).toBe('rebuild_required');
    if (result.status !== 'rebuild_required') throw new Error('Expected checkpoint rebuild');
    expect(result.reasonCodes).toContain('cursor-gap');
    expect(certificateControl.calls).toBe(verifierCallsBefore);
    expect(await scenario.ledger.getVerifiedHead()).toEqual(headBefore);
  });

  it('rejects a certificate frontier that disagrees with the replayed ledger tail', async () => {
    const scenario = await createScenario('certificate-frontier');
    const events = await scenario.ledger.readVerifiedEvents();
    const realTail = events.at(-1)!;
    const priorRecordHash = events.at(-2)!.frame.record_hash;
    const mismatchedBundle = {
      ...scenario.certificateBundle,
      certificate: {
        ...scenario.certificateBundle.certificate,
        body: {
          ...scenario.certificateBundle.certificate.body,
          finalHead: {
            ledger_id: realTail.frame.ledger_id,
            sequence: realTail.frame.sequence,
            record_hash: priorRecordHash,
          },
        },
      },
    };
    const headBefore = await scenario.ledger.getVerifiedHead();
    const result = await scenario.createAdapter().resume({
      ...request(scenario),
      priorCertificateBundle: mismatchedBundle,
    });
    expect(result.status).toBe('rebuild_required');
    if (result.status !== 'rebuild_required') throw new Error('Expected frontier rebuild');
    expect(result.reasonCodes).toContain('certificate-frontier-mismatch');
    expect(result.authenticatedTail?.recordHash).toBe(realTail.frame.record_hash);
    expect(certificateControl.calls).toBe(0);
    expect(await scenario.ledger.getVerifiedHead()).toEqual(headBefore);
  });

  it('rejects an authenticated history split across causal streams', async () => {
    const scenario = await createScenario('stream-split', {
      streamId: 'deep-review-resume-stream-split',
      streamSequence: 1,
    });
    const headBefore = await scenario.ledger.getVerifiedHead();
    const result = await scenario.createAdapter().resume(request(scenario));
    expect(result.status).toBe('rebuild_required');
    if (result.status !== 'rebuild_required') throw new Error('Expected stream rebuild');
    expect(result.reasonCodes).toContain('certificate-frontier-mismatch');
    expect(result.authenticatedTail).toBeNull();
    expect(certificateControl.calls).toBe(0);
    expect(await scenario.ledger.getVerifiedHead()).toEqual(headBefore);
  });

  it('is idempotent and remains additive-dark', async () => {
    const scenario = await createScenario('idempotent');
    const adapter = scenario.createAdapter();
    const input = request(scenario);
    const first = projected(await adapter.resume(input));
    const second = projected(await adapter.resume(input));
    expect(first.status).toBe('appended');
    expect(second.status).toBe('idempotent');
    expect(second.decision.productionCompletion).toBe(false);
    expect(second.decision.authority).toBe('dark-evidence-only');
    expect(second.dispatchedPasses).toBe(0);
  });
});
