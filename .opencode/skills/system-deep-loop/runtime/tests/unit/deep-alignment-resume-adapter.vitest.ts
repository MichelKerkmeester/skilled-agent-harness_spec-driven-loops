// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Resume Adapter Tests
// ───────────────────────────────────────────────────────────────────

import {
  mkdtempSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';
import { appendAuthorizedForTest } from '../fixtures/authorized-ledger-test-helper.js';

const certificateControl = vi.hoisted(() => ({
  calls: 0,
  useActual: false,
  result: {
    verdict: 'valid',
    certificateDigest: '',
    replayFingerprint: '',
    projectionIntegrityDigest: '',
    receiptChainDigest: '',
    artifactSetDigest: '',
  } as Record<string, unknown>,
}));

vi.mock('../../lib/deep-alignment-certificates/index.js', async () => {
  const actual = await vi.importActual<
    typeof import('../../lib/deep-alignment-certificates/index.js')
  >('../../lib/deep-alignment-certificates/index.js');
  return {
    ...actual,
    parseDeepAlignmentCertificateBundle: (input: unknown) => input,
    verifyDeepAlignmentCertificateOffline: vi.fn(async (
      input: Parameters<typeof actual.verifyDeepAlignmentCertificateOffline>[0],
    ) => {
      certificateControl.calls += 1;
      if (certificateControl.useActual) {
        return actual.verifyDeepAlignmentCertificateOffline(input);
      }
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
  createDeepAlignmentEventRegistry,
  prepareDeepAlignmentEvent,
} from '../../lib/deep-alignment-ledger-schema/index.js';
import {
  DEEP_ALIGNMENT_PROJECTION_CODEC_VERSION,
  DEEP_ALIGNMENT_PROJECTION_SCHEMA_VERSION,
  DEEP_ALIGNMENT_REDUCER_VERSION,
  deepAlignmentProjectionIntegrityDigest,
} from '../../lib/deep-alignment-reducers/index.js';
import {
  createDeepAlignmentSealedArtifactStore,
} from '../../lib/deep-alignment-sealed-artifacts/index.js';
import {
  DEEP_ALIGNMENT_CONTINUITY_LADDER,
  DEEP_ALIGNMENT_RESUME_ADAPTER_VERSION,
  DeepAlignmentResumeAdapter,
  deepAlignmentMigrationRegistryDigest,
  deepAlignmentResumeFingerprintDigest,
  parseDeepAlignmentResumeRequest,
} from '../../lib/deep-alignment-resume-adapter/index.js';
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
  DeepAlignmentCertificateBundle,
} from '../../lib/deep-alignment-certificates/index.js';
import type {
  DeepAlignmentEventInput,
  DeepAlignmentEventStem,
  DeepAlignmentPayloadMap,
  DeepAlignmentReplayMetadata,
  DeepAlignmentScopeMap,
} from '../../lib/deep-alignment-ledger-schema/index.js';
import type {
  DeepAlignmentAuthenticatedMigrationRegistry,
  DeepAlignmentMigrationRegistryEntry,
  DeepAlignmentResumeAdapterOptions,
  DeepAlignmentResumeAdapterResult,
  DeepAlignmentResumeFingerprint,
  DeepAlignmentResumeRequest,
} from '../../lib/deep-alignment-resume-adapter/index.js';
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
const RUN_ID = 'deep-alignment-resume-run-1';
const SESSION_ID = 'deep-alignment-resume-session-1';
const STREAM_ID = 'deep-alignment-resume-stream-1';
const AUTHORITY_EPOCH_ID = 'authority-epoch-1';
const VERIFIER_VERSION = 'alignment-verifier-v1';
const SUBJECT_DIGEST = hash('subject-snapshot');
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
  readonly persisted: DeepAlignmentResumeFingerprint;
  readonly certificateBundle: DeepAlignmentCertificateBundle;
  createAdapter(
    current?: DeepAlignmentResumeFingerprint,
    entries?: readonly DeepAlignmentMigrationRegistryEntry[],
    registryMutation?: Partial<DeepAlignmentAuthenticatedMigrationRegistry>,
  ): DeepAlignmentResumeAdapter;
}

function hash(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `deep-alignment-resume-${label}-`));
  roots.push(root);
  return root;
}

function replayMetadata(): DeepAlignmentReplayMetadata {
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
  overrides: Partial<Omit<DeepAlignmentResumeFingerprint, 'finalDigest'>> = {},
): DeepAlignmentResumeFingerprint {
  const body = {
    fingerprintVersion: 1,
    manifestRevision: 'manifest-v1',
    authorityEpochId: AUTHORITY_EPOCH_ID,
    targetDigest: hash(TARGET),
    toolVersion: 'review-tool-v1',
    modelVersion: 'review-model-v1',
    verifierVersion: VERIFIER_VERSION,
    reducerVersion: DEEP_ALIGNMENT_REDUCER_VERSION,
    adapterVersion: DEEP_ALIGNMENT_RESUME_ADAPTER_VERSION,
    schemaVersion: DEEP_ALIGNMENT_PROJECTION_SCHEMA_VERSION,
    codecVersion: DEEP_ALIGNMENT_PROJECTION_CODEC_VERSION,
    policyVersion: 'resume-policy@1',
    replayFingerprint,
    certificateDigest,
    ...overrides,
  };
  return Object.freeze({
    ...body,
    finalDigest: deepAlignmentResumeFingerprintDigest(body),
  });
}

function migrationRegistry(
  entries: readonly DeepAlignmentMigrationRegistryEntry[],
): DeepAlignmentAuthenticatedMigrationRegistry {
  const body = Object.freeze({
    registryVersion: 1 as const,
    authorityEpoch: 1,
    entries: Object.freeze([...entries]),
  });
  return Object.freeze({
    ...body,
    registryDigest: deepAlignmentMigrationRegistryDigest(body),
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

async function appendReviewEvent<TStem extends DeepAlignmentEventStem>(
  scenario: Pick<Scenario, 'ledger' | 'gateway' | 'policies' | 'registry'>,
  stem: TStem,
  sequence: number,
  scope: DeepAlignmentScopeMap[TStem],
  data: DeepAlignmentPayloadMap[TStem],
  cursor: Readonly<{
    streamId?: string;
    streamSequence?: number;
    causationId?: string | null;
  }> = {},
): Promise<VerifiedLedgerEvent> {
  const input: DeepAlignmentEventInput<TStem> = {
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
    producer: { name: 'deep-alignment-resume-tests', version: '1' },
    authorityEpoch: 1,
    correlationId: RUN_ID,
    causationId: cursor.causationId === undefined
      ? sequence === 1
        ? null
        : `review-event-${String(sequence - 1).padStart(3, '0')}`
      : cursor.causationId,
    idempotencyKey: `review-event-${sequence}`,
  };
  const prepared = prepareDeepAlignmentEvent(input, scenario.registry);
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
  const runScope = {
    runId: RUN_ID,
    sessionId: SESSION_ID,
    authorityEpochId: AUTHORITY_EPOCH_ID,
  };
  const generationScope = { ...runScope, generation: 1 };
  const iterationScope = { ...generationScope, iterationId: 'iteration-1' };
  const dimensionScope = { ...iterationScope, dimensionId: 'correctness' };
  const laneScope = { ...iterationScope, laneId: 'lane-1' };
  await appendReviewEvent(scenario, 'deep_alignment.run_initialized', 1, generationScope, {
    target: TARGET,
    lineageMode: 'fresh',
    maxIterations: 4,
    convergencePolicyVersion: 'review-convergence@1',
    reviewModeContractDigest: hash('review-contract'),
    initialReleaseReadinessState: 'not-assessed',
  });
  await appendReviewEvent(scenario, 'deep_alignment.authority_reference_bound', 2, runScope, {
    authorityId: 'authority-main',
    authorityCapsuleRef: 'authority-capsule-1',
    authoritySourceDigest: hash('authority-source'),
    compilerFingerprint: hash('authority-compiler'),
    profileDigest: hash('authority-profile'),
    ruleIrDigest: hash('rule-ir'),
    signatureDigest: hash('authority-signature'),
    expiresAt: '2027-07-27T10:00:00.000Z',
    rollbackRef: null,
  });
  await appendReviewEvent(scenario, 'deep_alignment.authority_validation_recorded', 3, runScope, {
    authorityReferenceEventId: 'review-event-002',
    checks: {
      parse: 'pass',
      type: 'pass',
      capability: 'pass',
      ruleTests: 'pass',
      coverage: 'pass',
      expiry: 'pass',
      rollback: 'pass',
      signature: 'pass',
      mixAndMatch: 'pass',
      resultDigest: hash('authority-checks'),
    },
    authorityStatus: 'valid',
    validationReceiptRefs: ['receipt:authority'],
    validatorFingerprint: hash('authority-validator'),
    validationDigest: hash('authority-validation'),
    blockedReasonCode: null,
  });
  await appendReviewEvent(scenario, 'deep_alignment.scope_resolved', 4, runScope, {
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
  await appendReviewEvent(scenario, 'deep_alignment.dimension_ordered', 5, runScope, {
    orderedDimensionIds: ['correctness'],
    riskRationale: 'Correctness is the required fixture dimension.',
    scopeEvidenceRefs: ['scope-evidence-1'],
    orderingPolicyVersion: 'dimension-order@1',
  });
  await appendReviewEvent(scenario, 'deep_alignment.lane_plan_recorded', 6, laneScope, {
    laneKind: 'schema',
    orderedRuleIds: ['rule-1'],
    ruleIrRef: 'rule-ir:1',
    ruleIrDigest: hash('rule-ir'),
    verifierPolicyVersion: VERIFIER_VERSION,
    budgetRef: 'budget:lane-1',
    requiredEvidenceClasses: ['schema-witness'],
    planDigest: hash('lane-plan'),
  });
  await appendReviewEvent(scenario, 'deep_alignment.lane_started', 7, laneScope, {
    lanePlanEventId: 'review-event-006',
    subjectSnapshotRef: 'subject-snapshot-1',
    subjectSnapshotDigest: SUBJECT_DIGEST,
    authorityValidationEventId: 'review-event-003',
    authorityValidationDigest: hash('authority-validation'),
    status: 'started',
  });
  await appendReviewEvent(scenario, 'deep_alignment.dimension_pass_started', 8, dimensionScope, {
    passNumber: 1,
    targetRefs: ['target:src/review.ts'],
    filesReviewed: ['file:src/review.ts'],
    searchCoverageDigest: hash('pass-started'),
    passStatus: 'started',
    nextFocusRef: 'focus:evidence',
  });
  await appendReviewEvent(scenario, 'deep_alignment.dimension_pass_completed', 9, dimensionScope, {
    passNumber: 1,
    targetRefs: ['target:src/review.ts'],
    filesReviewed: ['file:src/review.ts'],
    searchCoverageDigest: hash('pass-complete'),
    passStatus: 'complete',
    rawFindingCounts: { candidates: 0, adjudicated: 0, p0: 0, p1: 0, p2: 0 },
    nextFocusRef: 'focus:convergence',
  });
  await appendReviewEvent(scenario, 'deep_alignment.lane_completed', 10, laneScope, {
    lanePlanEventId: 'review-event-006',
    subjectSnapshotRef: 'subject-snapshot-1',
    subjectSnapshotDigest: SUBJECT_DIGEST,
    authorityValidationEventId: 'review-event-003',
    applicabilityDecisionRefs: [],
    observationRefs: [],
    verificationRefs: [],
    status: 'complete',
    counts: {
      applicable: 0,
      notApplicable: 0,
      unresolved: 0,
      untested: 0,
      blocked: 0,
      nonConformant: 0,
    },
    completionDigest: hash('lane-completion'),
    blockedReasonCode: null,
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
  const registry = createDeepAlignmentEventRegistry();
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
    identityResolver: ({ evaluationInput }) => ({
      actorId: evaluationInput.actorId,
      capabilityId: evaluationInput.capabilityId,
      evidenceDigest: evaluationInput.evidenceDigest,
    }),
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
    identityResolver: ({ evaluationInput }) => ({
      actorId: evaluationInput.actorId,
      capabilityId: evaluationInput.capabilityId,
      evidenceDigest: evaluationInput.evidenceDigest,
    }),
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
        authorityEvidence: {
          authorityEpochId: AUTHORITY_EPOCH_ID,
        },
        convergenceEvidence: {
          evaluatorFingerprint: VERIFIER_VERSION,
        },
      },
      certificateDigest,
    },
    receipts: [],
  } as unknown as DeepAlignmentCertificateBundle;
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
    entries: readonly DeepAlignmentMigrationRegistryEntry[] = [],
    registryMutation: Partial<DeepAlignmentAuthenticatedMigrationRegistry> = {},
  ): DeepAlignmentResumeAdapter => {
    const authenticated = migrationRegistry(entries);
    const supplied = Object.freeze({ ...authenticated, ...registryMutation });
    const options: DeepAlignmentResumeAdapterOptions = {
      ledger,
      effectLedger,
      gateway,
      policies,
      eventRegistry: registry,
      fingerprintVersions: createReplayFingerprintVersionRegistry(),
      artifactStore: createDeepAlignmentSealedArtifactStore({
        rootDirectory: join(rootDirectory, `artifacts-${current.finalDigest.slice(0, 8)}`),
      }),
      certificateReplay: {
        ledger,
        runId: RUN_ID,
        rangeStartSequence: 1,
        rangeEndSequence: head.sequence,
      } as unknown as DeepAlignmentResumeAdapterOptions['certificateReplay'],
      certificateProviders: new CertificationProviderRegistry([]),
      installedFingerprint: current,
      migrationRegistry: supplied,
      trustedMigrationRegistryDigest: authenticated.registryDigest,
      producer: { name: 'deep-alignment-resume-tests', version: '1' },
      policyId: 'resume-policy',
      policyVersion: 1,
      actorId: 'resume-adapter',
      capabilityId: 'resume-write',
      authorityEpoch: 1,
      priorStateVersion: 'deep-alignment-resume@1',
    };
    return new DeepAlignmentResumeAdapter(options);
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
): DeepAlignmentResumeRequest {
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

function projected(result: DeepAlignmentResumeAdapterResult) {
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
  certificateControl.useActual = false;
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('DeepAlignmentResumeAdapter', () => {
  it('parses a closed request and exports the mode continuity ladder', async () => {
    const scenario = await createScenario('closed');
    expect(parseDeepAlignmentResumeRequest(request(scenario)).runId).toBe(RUN_ID);
    expect(() => parseDeepAlignmentResumeRequest({
      ...request(scenario),
      callerCompatibilityVerdict: 'compatible',
    })).toThrow(/closed request shape/);
    expect(DEEP_ALIGNMENT_CONTINUITY_LADDER.map((row) => row.step)).toEqual([
      'init',
      'authority',
      'lane/scope',
      'observation/evidence',
      'finding/proof',
      'adjudication/deviation',
      'convergence',
      'report/handoff',
    ]);
  });

  it('covers exact reuse, compatible, migrate, blocked, and rebuild-required decisions', async () => {
    const exactScenario = await createScenario('matrix-exact');
    const exact = projected(await exactScenario.createAdapter().resume(request(exactScenario)));
    expect(exact.decision.reuseDisposition).toBe('exact-reuse');
    expect(exact.decision.branches[0]?.disposition).toBe('reuse');

    const compatibleScenario = await createScenario('matrix-compatible');
    const compatibleCurrent = fingerprint(
      compatibleScenario.persisted.replayFingerprint,
      compatibleScenario.persisted.certificateDigest,
      { modelVersion: 'review-model-v2' },
    );
    const compatibleRule: DeepAlignmentMigrationRegistryEntry = {
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
    const migrateRule: DeepAlignmentMigrationRegistryEntry = {
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
    expect(migrate.decision.branches[0]?.disposition).toBe('reexecute');

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
    const assertedCompatible: DeepAlignmentMigrationRegistryEntry = {
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

  it('rejects a prior certificate that does not pass the real offline verifier', async () => {
    const scenario = await createScenario('real-offline-verifier');
    certificateControl.useActual = true;
    const result = await scenario.createAdapter().resume(request(scenario));
    expect(result.status).toBe('rebuild_required');
    if (result.status !== 'rebuild_required') {
      throw new Error('Expected unverified-certificate rebuild');
    }
    expect(result.reasonCodes).toContain('prior-certificate-invalid');
    expect(certificateControl.calls).toBe(1);
  });

  it('recomputes changed identity and runtime facts instead of reusing a digest claim', async () => {
    const fields = [
      ['toolVersion', 'review-tool-v2', 'tool'],
      ['modelVersion', 'review-model-v2', 'model'],
      ['policyVersion', 'resume-policy@2', 'policy'],
      ['targetDigest', hash('changed-target'), 'target'],
      ['authorityEpochId', 'authority-epoch-2', 'authority'],
      ['verifierVersion', 'alignment-verifier-v2', 'verifier'],
      ['reducerVersion', 'deep-alignment-reducer@forged', 'reducer'],
      ['adapterVersion', 'deep-alignment-resume-adapter@forged', 'adapter'],
      ['schemaVersion', 'deep-alignment-projection@2', 'schema'],
      ['codecVersion', 'deep-alignment-codec@forged', 'codec'],
    ] as const;
    for (const [field, value, component] of fields) {
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
        .find((entry) => entry.component === component)?.outcome).toBe('blocked');
    }
  }, 60_000);

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
        projectionDigest: deepAlignmentProjectionIntegrityDigest(first.checkpoint.projection),
        sourceTailSequence: forgedTail,
        sourceTailEventDigest: first.checkpoint.sourceTailEventDigest,
      }),
    };
    const headBefore = await scenario.ledger.getVerifiedHead();
    const verifierCallsBefore = certificateControl.calls;
    certificateControl.useActual = true;
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
    certificateControl.useActual = true;
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
      streamId: 'deep-alignment-resume-stream-split',
      streamSequence: 1,
    });
    const headBefore = await scenario.ledger.getVerifiedHead();
    certificateControl.useActual = true;
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
    expect(second.dispatchedBranches).toBe(0);
  });
});
