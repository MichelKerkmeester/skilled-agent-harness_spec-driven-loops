// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Resume Adapter Tests
// ───────────────────────────────────────────────────────────────────

import {
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  createDeepResearchEventRegistry,
  prepareDeepResearchEvent,
} from '../../lib/deep-research-ledger-schema/index.js';
import {
  DEEP_RESEARCH_PROJECTION_CODEC_VERSION,
  DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION,
  DEEP_RESEARCH_REDUCER_VERSION,
  deepResearchProjectionIntegrityDigest,
} from '../../lib/deep-research-reducers/index.js';
import {
  DeepResearchArtifactKinds,
  createDeepResearchSealedArtifactStore,
  sealDeepResearchArtifact,
} from '../../lib/deep-research-sealed-artifacts/index.js';
import {
  DEEP_RESEARCH_CONTINUITY_LADDER,
  DEEP_RESEARCH_RESUME_ADAPTER_VERSION,
  DeepResearchResumeAdapter,
  deepResearchResumeFingerprintDigest,
  parseDeepResearchResumeRequest,
} from '../../lib/deep-research-resume-adapter/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  AtomicityDomains,
  FencedLeaseCoordinator,
  FencedLedgerWriter,
  ProtectedResourceKinds,
} from '../../lib/locks-and-fencing/index.js';
import {
  AuthorizedEvidenceWriter,
  EFFECT_CONFIRMATION_EVENT_TYPE,
  EFFECT_CONFLICT_EVENT_TYPE,
  EFFECT_INTENT_EVENT_TYPE,
  EFFECT_RECONCILED_EVENT_TYPE,
  EFFECT_RECOVERY_STARTED_EVENT_TYPE,
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
  DeepResearchEventInput,
  DeepResearchEventStem,
  DeepResearchPayloadMap,
  DeepResearchReplayMetadata,
  DeepResearchScopeMap,
} from '../../lib/deep-research-ledger-schema/index.js';
import type {
  DeepResearchResumeAdapterResult,
  DeepResearchResumeFingerprint,
  DeepResearchResumeRequest,
} from '../../lib/deep-research-resume-adapter/index.js';
import type {
  EventTypeRegistry,
  EventWritePreflight,
  JsonObject,
} from '../../lib/event-envelope/index.js';
import type {
  FencedLease,
} from '../../lib/locks-and-fencing/index.js';
import type {
  EffectConfirmationPayload,
  EffectConflictPayload,
  EffectIntentPayload,
  EffectReconciledPayload,
  EffectRecoveryStartedPayload,
  RecoveryVerdict,
} from '../../lib/receipts-and-effect-recovery/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. REAL SUBSTRATE HARNESS
// ───────────────────────────────────────────────────────────────────

const T0 = '2026-07-21T10:00:00.000Z';
const T1 = '2026-07-21T10:01:00.000Z';
const T2 = '2026-07-21T10:02:00.000Z';
const AUTHORITY = Object.freeze({ state: 'shadowing' as const, epoch: 1 });
const roots: string[] = [];

interface Harness {
  readonly rootDirectory: string;
  readonly registry: EventTypeRegistry;
  readonly policies: TransitionPolicyRegistry;
  readonly ledger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
  readonly effectLedger: AppendOnlyLedger;
  readonly effectRegistry: EventTypeRegistry;
  readonly effectWriter: AuthorizedEvidenceWriter;
  readonly effectLease: Promise<FencedLease>;
  readonly artifactStore: ReturnType<typeof createDeepResearchSealedArtifactStore>;
  readonly adapter: DeepResearchResumeAdapter;
  readonly dispatched: string[];
}

function hash(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `deep-research-resume-${label}-`));
  roots.push(root);
  return root;
}

function resumeFingerprint(
  manifestRevision = 'manifest-v1',
  overrides: Partial<Omit<DeepResearchResumeFingerprint, 'finalDigest'>> = {},
): DeepResearchResumeFingerprint {
  const core = {
    fingerprintVersion: 1,
    manifestRevision,
    reducerVersion: DEEP_RESEARCH_REDUCER_VERSION,
    adapterVersion: DEEP_RESEARCH_RESUME_ADAPTER_VERSION,
    schemaVersion: DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION,
    codecVersion: DEEP_RESEARCH_PROJECTION_CODEC_VERSION,
    policyVersion: 'resume-policy@1',
    ...overrides,
  };
  return Object.freeze({ ...core, finalDigest: deepResearchResumeFingerprintDigest(core) });
}

function createHarness(label: string, enableDarkDispatch = false): Harness {
  const rootDirectory = temporaryRoot(label);
  const registry = createDeepResearchEventRegistry();
  const policies = new TransitionPolicyRegistry([{
    policyId: 'resume-policy',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['dark-resume'],
    evaluate: (input) => ({
      verdict: input.requestedEventType.startsWith('deep-research.ledger.') ? 'allow' : 'deny',
      reasonCode: input.requestedEventType.startsWith('deep-research.ledger.')
        ? 'allowed' : 'policy_denied',
      matchedRuleIds: ['dark-resume'],
    }),
  }]);
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: `resume-${label}`,
    auditLedgerId: `resume-${label}-authorization`,
    authorityProvider: () => AUTHORITY,
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: `resume-${label}-authorization`,
    authorityProvider: () => AUTHORITY,
  }, ledger, policies);

  const effectRegistry = createEvidenceControlEventRegistry();
  const effectPolicies = new TransitionPolicyRegistry([{
    policyId: 'effect-policy',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['effect-write'],
    evaluate: () => ({ verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['effect-write'] }),
  }]);
  const effectLedger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: `effects-${label}`,
    auditLedgerId: `effects-${label}-authorization`,
    authorityProvider: () => AUTHORITY,
  }, effectRegistry);
  const effectGateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: `effects-${label}-authorization`,
    authorityProvider: () => AUTHORITY,
  }, effectLedger, effectPolicies);
  const coordinator = new FencedLeaseCoordinator({ rootDirectory });
  const effectLease = coordinator.acquire({
    resource: {
      kind: ProtectedResourceKinds.LEDGER,
      components: { ledgerId: effectLedger.ledgerId },
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
    },
    ownerId: `effect-writer-${label}`,
    correlationId: `effect-correlation-${label}`,
    ttlMs: 300_000,
    acquireTimeoutMs: 5_000,
  });
  const effectWriter = new AuthorizedEvidenceWriter({
    ledger: effectLedger,
    ledgerFence: {
      writer: new FencedLedgerWriter(coordinator),
      currentLease: () => effectLease,
    },
    gateway: effectGateway,
    policies: effectPolicies,
    registry: effectRegistry,
    authorizationContext: (event) => ({
      mode: 'research',
      priorStateVersion: 'effect-state@1',
      priorStateFingerprint: hash('effect-state'),
      actorId: 'effect-writer',
      capabilityId: 'effect-write',
      authorityEpoch: event.identity.authorityEpoch,
      policyId: 'effect-policy',
      policyVersion: 1,
      evidenceDigest: event.canonicalDigest,
    }),
  });
  const dispatched: string[] = [];
  const artifactStore = createDeepResearchSealedArtifactStore({
    rootDirectory: join(rootDirectory, 'artifacts'),
  });
  const adapter = new DeepResearchResumeAdapter({
    ledger,
    effectLedger,
    gateway,
    policies,
    eventRegistry: registry,
    fingerprintVersions: createReplayFingerprintVersionRegistry(),
    artifactStore,
    producer: { name: 'resume-adapter-tests', version: '1' },
    policyId: 'resume-policy',
    policyVersion: 1,
    actorId: 'resume-adapter',
    capabilityId: 'resume-write',
    authorityEpoch: 1,
    priorStateVersion: 'deep-research-resume@1',
    enableDarkDispatch,
    branchDispatcher: {
      dispatch: async (entry) => {
        dispatched.push(entry.logicalLeafId);
      },
    },
  });
  return {
    rootDirectory,
    registry,
    policies,
    ledger,
    gateway,
    effectLedger,
    effectRegistry,
    effectWriter,
    effectLease,
    artifactStore,
    adapter,
    dispatched,
  };
}

async function authorize(
  harness: Harness,
  event: EventWritePreflight,
  requestId: string,
): Promise<GatewayAllowProof> {
  const policy = harness.policies.resolve('resume-policy', 1);
  const result = await harness.gateway.authorize({
    requestId,
    mode: 'research',
    event,
    priorHead: await harness.ledger.getVerifiedHead(),
    priorStateVersion: 'fixture@1',
    priorStateFingerprint: hash('fixture-state'),
    actorId: 'fixture-writer',
    capabilityId: 'resume-write',
    authorityEpoch: 1,
    policy: {
      policyId: policy.policyId,
      policyVersion: policy.policyVersion,
      policyDigest: policy.digest,
    },
    evidenceDigest: event.canonicalDigest,
  });
  if (result.verdict !== 'allow') throw new Error(result.reasonCode);
  return result.proof;
}

function replayMetadata(fingerprint: DeepResearchResumeFingerprint): DeepResearchReplayMetadata {
  return {
    fingerprint_version: fingerprint.fingerprintVersion,
    final_digest: fingerprint.finalDigest,
    replay_input_digests: { configuration: hash('configuration') },
  };
}

function scoreVector(): DeepResearchPayloadMap<'deep_research.branch_planned'>[
  'expectedYieldScoreVector'
] {
  return {
    expectedYield: 0.8,
    contradictionRisk: 0.2,
    impact: 0.7,
    independenceGain: 0.6,
    staleness: 0.1,
    expectedCost: 0.3,
  };
}

async function appendEvent<TStem extends DeepResearchEventStem>(
  harness: Harness,
  fingerprint: DeepResearchResumeFingerprint,
  stem: TStem,
  sequence: number,
  scope: DeepResearchScopeMap[TStem],
  data: DeepResearchPayloadMap[TStem],
): Promise<void> {
  const head = await harness.ledger.getVerifiedHead();
  const input: DeepResearchEventInput<TStem> = {
    stem,
    scope,
    prevEventHash: head.recordHash,
    replay: replayMetadata(fingerprint),
    data,
    eventId: `fixture-event-${sequence}`,
    streamId: 'deep-research-run-1',
    streamSequence: sequence,
    occurredAt: T0,
    recordedAt: T0,
    producer: { name: 'resume-fixture', version: '1' },
    authorityEpoch: 1,
    correlationId: 'fixture-correlation',
    causationId: sequence === 1 ? null : `fixture-event-${sequence - 1}`,
    idempotencyKey: `fixture-idempotency-${sequence}`,
  };
  const event = prepareDeepResearchEvent(input, harness.registry);
  const proof = await authorize(harness, event, `fixture-request-${sequence}`);
  await harness.ledger.appendAuthorized(event, proof);
}

interface SeededEffect {
  readonly intent: EffectIntentPayload;
  readonly intentEvent: VerifiedLedgerEvent;
  readonly streamId: string;
}

async function appendEffectEvent(
  harness: Harness,
  eventType: string,
  eventId: string,
  streamId: string,
  streamSequence: number,
  idempotencyKey: string,
  payload: JsonObject,
  causationId: string | null,
): Promise<VerifiedLedgerEvent> {
  const prepared = prepareEventWrite({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: eventId,
    event_type: eventType,
    event_version: 1,
    stream_id: streamId,
    stream_sequence: streamSequence,
    occurred_at: T1,
    recorded_at: T1,
    producer: { name: 'effect-fixture', version: '1' },
    authority_epoch: 1,
    correlation_id: 'effect-correlation',
    causation_id: causationId,
    idempotency_key: idempotencyKey,
    payload,
  }, harness.effectRegistry);
  return (await harness.effectWriter.append(prepared)).verified;
}

async function seedEffectIntent(
  harness: Harness,
  fingerprint: DeepResearchResumeFingerprint,
  effectKey: string,
  adapterOverrides: Partial<EffectIntentPayload['adapter']> = {},
): Promise<SeededEffect> {
  const intent: EffectIntentPayload = {
    effect_id: `effect-${hash(effectKey)}`,
    run_id: 'run-1',
    logical_effect_id: `logical-${effectKey}`,
    effect_type: 'subprocess',
    operation: 'persist-memory',
    target_identity: `target-${effectKey}`,
    input_digest: hash(`input-${effectKey}`),
    safe_metadata: {},
    secret_references: [],
    adapter: {
      adapter_id: `adapter-${effectKey}`,
      adapter_version: 'adapter-v1',
      effect_type: 'subprocess',
      replay_safe: false,
      idempotency_mode: 'postcondition',
      reconciliation: 'none',
      ...adapterOverrides,
    },
    idempotency_key: effectKey,
    recovery_policy: 'unknown-block',
    expected_postcondition_digest: hash(`postcondition-${effectKey}`),
    replay_fingerprint: fingerprint.finalDigest,
    requested_at: T1,
  };
  const streamId = `effect-run-1-${effectKey}`;
  const intentEvent = await appendEffectEvent(
    harness,
    EFFECT_INTENT_EVENT_TYPE,
    `effect-intent-${hash(effectKey)}`,
    streamId,
    1,
    effectKey,
    intent,
    null,
  );
  return Object.freeze({ intent, intentEvent, streamId });
}

function confirmationFor(
  seeded: SeededEffect,
  overrides: Partial<EffectConfirmationPayload> = {},
): EffectConfirmationPayload {
  return {
    confirmation_id: `effect-confirmation-${hash(seeded.intent.idempotency_key)}`,
    effect_id: seeded.intent.effect_id,
    intent_event_id: seeded.intentEvent.event.effective.envelope.event_id,
    intent_event_digest: seeded.intentEvent.event.stored.digest,
    idempotency_key: seeded.intent.idempotency_key,
    adapter: seeded.intent.adapter,
    external_receipt_digest: hash('external-receipt'),
    postcondition_digest: seeded.intent.expected_postcondition_digest,
    output_digest: hash('effect-output'),
    completion_class: 'executed',
    observed_at: T2,
    safe_result_metadata: {},
    ...overrides,
  };
}

async function appendReconciliation(
  harness: Harness,
  seeded: SeededEffect,
  verdict: RecoveryVerdict,
): Promise<void> {
  const intentEventId = seeded.intentEvent.event.effective.envelope.event_id;
  const claim = {
    claim_id: `claim-${verdict}`,
    claimant_id: 'effect-recovery-fixture',
    fence_token: `fence-${verdict}`,
    acquired_at: T1,
  };
  const recoveryId = `effect-recovery-${hash({
    intent_event_id: intentEventId,
    attempt: 1,
    claim_id: claim.claim_id,
  })}`;
  const started: EffectRecoveryStartedPayload = {
    recovery_id: recoveryId,
    intent_event_id: intentEventId,
    intent_event_digest: seeded.intentEvent.event.stored.digest,
    intent_head: {
      ledger_id: seeded.intentEvent.frame.ledger_id,
      sequence: seeded.intentEvent.frame.sequence,
      record_hash: seeded.intentEvent.frame.record_hash,
    },
    attempt: 1,
    reason_code: 'resume-crash-window',
    claim,
    started_at: T1,
  };
  await appendEffectEvent(
    harness,
    EFFECT_RECOVERY_STARTED_EVENT_TYPE,
    `${recoveryId}-started`,
    seeded.streamId,
    2,
    `${seeded.intent.idempotency_key}:recovery:1:started`,
    started,
    intentEventId,
  );
  const reconciled: EffectReconciledPayload = {
    recovery_id: recoveryId,
    intent_event_id: intentEventId,
    verdict,
    reason_code: `reconciled-${verdict}`,
    evidence_digest: hash(`reconciliation-${verdict}`),
    attempt: 1,
    claim,
    retry_decision: verdict === 'applied'
      ? 'synthesize_confirmation'
      : verdict === 'not_applied'
        ? 'execute_once'
        : verdict === 'in_doubt'
          ? 'operator_required'
          : 'reject',
    terminal_status: verdict === 'applied'
      ? 'confirmed'
      : verdict === 'not_applied'
        ? 'retrying'
        : verdict === 'in_doubt'
          ? 'operator_required'
          : 'conflict',
    observed_at: T2,
  };
  await appendEffectEvent(
    harness,
    EFFECT_RECONCILED_EVENT_TYPE,
    `${recoveryId}-reconciled`,
    seeded.streamId,
    3,
    `${seeded.intent.idempotency_key}:recovery:1:reconciled`,
    reconciled,
    `${recoveryId}-started`,
  );
}

async function appendEffectConflict(
  harness: Harness,
  seeded: SeededEffect,
): Promise<void> {
  const intentEventId = seeded.intentEvent.event.effective.envelope.event_id;
  const presentedKey = `${seeded.intent.idempotency_key}:divergent`;
  const conflictId = `effect-conflict-${hash({
    existing_intent_event_id: intentEventId,
    presented_idempotency_key: presentedKey,
  })}`;
  const conflict: EffectConflictPayload = {
    conflict_id: conflictId,
    existing_intent_event_id: intentEventId,
    run_id: seeded.intent.run_id,
    logical_effect_id: seeded.intent.logical_effect_id,
    existing_idempotency_key_digest: hash(seeded.intent.idempotency_key),
    presented_idempotency_key_digest: hash(presentedKey),
    reason_code: 'logical_effect_facts_changed',
    detected_at: T2,
  };
  await appendEffectEvent(
    harness,
    EFFECT_CONFLICT_EVENT_TYPE,
    conflictId,
    seeded.streamId,
    2,
    `${seeded.intent.idempotency_key}:conflict:${conflict.presented_idempotency_key_digest}`,
    conflict,
    intentEventId,
  );
}

async function seedRun(
  harness: Harness,
  fingerprint = resumeFingerprint(),
  withDrift = false,
  selectBranches = true,
): Promise<DeepResearchResumeFingerprint> {
  const base = { runId: 'run-1', lineageId: 'lineage-1' };
  let sequence = 1;
  await appendEvent(harness, fingerprint, 'deep_research.run_initialized', sequence++, base, {
    generation: 7,
    charterDigest: hash('charter'),
    configDigest: hash('config'),
    executorFingerprint: hash('executor'),
    replayFingerprint: fingerprint.finalDigest,
    maxIterations: 20,
    convergencePolicyVersion: 'convergence-policy-v1',
  });
  for (const question of ['question-1', 'question-2']) {
    const branch = question === 'question-1' ? 'branch-affected' : 'branch-unrelated';
    await appendEvent(harness, fingerprint, 'deep_research.question_registered', sequence++, {
      ...base, questionId: question,
    }, {
      normalizedQuestionDigest: hash(question),
      dependencyQuestionIds: [],
      requiredSourceClasses: ['primary'],
      disconfirmingQueryRecipeIds: [`recipe-${question}`],
      budgetRef: `budget-${question}`,
    });
    const branchData = {
      semanticClusterId: `cluster-${question}`,
      expectedYieldScoreVector: scoreVector(),
      contradictionRisk: 0.2,
      impact: 0.7,
      independenceGain: 0.6,
      staleness: 0.1,
      expectedCost: 0.3,
      tieBreakKey: `tie-${question}`,
      reservationRef: `reservation-${question}`,
    };
    await appendEvent(harness, fingerprint, 'deep_research.branch_planned', sequence++, {
      ...base, questionId: question, branchId: branch,
    }, branchData);
    if (selectBranches) {
      await appendEvent(harness, fingerprint, 'deep_research.branch_selected', sequence++, {
        ...base, questionId: question, branchId: branch,
      }, branchData);
    }
  }
  if (!withDrift) return fingerprint;
  const iteration = { ...base, iteration: 1 };
  await appendEvent(harness, fingerprint, 'deep_research.iteration_started', sequence++, iteration, {
    focusRef: 'focus-1',
    stateTailDigest: hash('state-tail'),
    strategyDigest: hash('strategy'),
    status: 'started',
  });
  await appendEvent(harness, fingerprint, 'deep_research.source_captured', sequence++, {
    ...iteration, sourceVersionId: 'source-v1',
  }, {
    sourceIdentityDigest: hash('source-identity'),
    locator: {
      scheme: 'url',
      locatorDigest: hash('locator'),
      selector: 'https://example.test/source',
      revision: 'revision-v1',
    },
    capturedAt: T0,
    contentDigest: hash('source-content-v1'),
    mediaType: 'text/html',
    retrievalReceiptRef: 'retrieval-v1',
    parentSourceVersionId: null,
    instructionScanResult: 'clean',
  });
  await appendEvent(harness, fingerprint, 'deep_research.evidence_admission_decided', sequence++, {
    ...iteration, sourceVersionId: 'source-v1', evidenceId: 'evidence-v1',
  }, {
    disposition: 'admit',
    passageLocators: [{
      locatorDigest: hash('locator'), selector: 'paragraph-1', passageDigest: hash('passage'),
    }],
    atomicClaimRefs: ['claim-1'],
    derivativeSourceGroup: 'source-group-1',
    admissionPolicyVersion: 'admission-policy-v1',
    contaminationStatus: 'clean',
    reasonCode: 'independent-primary',
  });
  await appendEvent(harness, fingerprint, 'deep_research.claim_asserted', sequence++, {
    ...iteration, claimVersionId: 'claim-v1',
  }, {
    claimId: 'claim-1',
    normalizedClaimDigest: hash('claim-1'),
    evidenceIds: ['evidence-v1'],
    independenceGroup: 'source-group-1',
    rawConfidence: 0.8,
    claimStatus: 'supported',
  });
  await appendEvent(harness, fingerprint, 'deep_research.gap_detected', sequence++, iteration, {
    obligationId: 'gap-1',
    gapKind: 'verification',
    affectedClaimIds: ['claim-1'],
    affectedQuestionIds: ['question-1'],
    criticality: 0.8,
    proposedQueryRecipeIds: ['recipe-followup'],
  });
  await appendEvent(harness, fingerprint, 'deep_research.source_captured', sequence++, {
    ...iteration, sourceVersionId: 'source-v2',
  }, {
    sourceIdentityDigest: hash('source-identity'),
    locator: {
      scheme: 'url',
      locatorDigest: hash('locator'),
      selector: 'https://example.test/source',
      revision: 'revision-v2',
    },
    capturedAt: T1,
    contentDigest: hash('source-content-v2'),
    mediaType: 'text/html',
    retrievalReceiptRef: 'retrieval-v2',
    parentSourceVersionId: 'source-v1',
    instructionScanResult: 'clean',
  });
  return fingerprint;
}

function resumeRequest(
  persisted: DeepResearchResumeFingerprint,
  installed = persisted,
  overrides: Partial<DeepResearchResumeRequest> = {},
): DeepResearchResumeRequest {
  return {
    runId: 'run-1',
    manifestRevision: installed.manifestRevision,
    idempotencyKey: 'resume-request-1',
    requestedAt: T2,
    resumeReason: 'Resume the verified dark run.',
    persistedFingerprint: persisted,
    installedFingerprint: installed,
    compatibilityRules: [],
    lease: {
      runId: 'run-1',
      leaseId: 'lease-1',
      lineageId: 'lineage-1',
      generation: 7,
      deadlineAt: '2026-07-22T10:00:00.000Z',
      remainingMs: 86_400_000,
      replayFingerprint: persisted.finalDigest,
    },
    checkpoint: null,
    artifactBindings: [],
    transitionReceipts: [],
    ...overrides,
  };
}

function projected(result: DeepResearchResumeAdapterResult) {
  expect(result.status).not.toBe('rebuild_required');
  if (result.status === 'rebuild_required') throw new Error(result.reasonCodes.join(','));
  return result;
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

// ───────────────────────────────────────────────────────────────────
// 2. ADVERSARIAL CONTRACT TESTS
// ───────────────────────────────────────────────────────────────────

describe('DeepResearchResumeAdapter', () => {
  it('rejects unknown request keys while accepting the exact closed positive control', () => {
    const fingerprint = resumeFingerprint();
    const valid = resumeRequest(fingerprint);
    expect(parseDeepResearchResumeRequest(valid).runId).toBe('run-1');
    expect(() => parseDeepResearchResumeRequest({ ...valid, mutableAuthority: 'iteration.md' }))
      .toThrow(/closed request shape/);
    expect(() => parseDeepResearchResumeRequest({
      ...valid,
      lease: { ...valid.lease, arbitraryEvidence: {} },
    })).toThrow(/closed persisted lease shape/);
  });

  it('ignores a mutable converged iteration file and reconstructs only ledger state', async () => {
    const harness = createHarness('ledger-only');
    const fingerprint = await seedRun(harness);
    writeFileSync(join(harness.rootDirectory, 'iteration.md'), 'status: converged\n');
    const result = projected(await harness.adapter.resume(resumeRequest(fingerprint)));
    expect(result.continuity.convergenceOutcome).toBe('active');
    expect(result.continuity.terminalState).toBe('active');
    expect(result.decision.productionCompletion).toBe(false);
    expect(result.projection.status.state).not.toBe('converged');
  });

  it('blocks an unknown persisted fingerprint version and records the decision before dispatch', async () => {
    const harness = createHarness('unknown-version', true);
    const unknown = resumeFingerprint('manifest-v1', { fingerprintVersion: 99 });
    await seedRun(harness, unknown);
    const installed = resumeFingerprint();
    const headBefore = await harness.ledger.getVerifiedHead();
    const request = resumeRequest(unknown, installed, {
      lease: { ...resumeRequest(unknown, installed).lease, replayFingerprint: unknown.finalDigest },
    });
    const result = projected(await harness.adapter.resume(request));
    expect(result.decision.compatibilityOutcome).toBe('blocked');
    expect(result.executionPool).toEqual([]);
    expect(result.dispatchedBranches).toBe(0);
    expect((await harness.ledger.getVerifiedHead()).sequence).toBe(headBefore.sequence + 1);
  });

  it('blocks a tampered sealed reference while a store-verified positive control resumes', async () => {
    const positiveHarness = createHarness('sealed-positive');
    const positiveFingerprint = await seedRun(positiveHarness);
    const binding = await sealDeepResearchArtifact(
      positiveHarness.artifactStore,
      DeepResearchArtifactKinds.MODE_CONFIGURATION,
      {
        artifactId: 'configuration-1',
        materialDigest: hash('configuration-material'),
        materialRef: 'artifact:configuration-material',
        locator: {
          scheme: 'artifact',
          locatorDigest: hash('configuration-locator'),
          selector: 'configuration-1',
          revision: 'revision-1',
        },
        producerVersion: 'producer-v1',
      },
    );
    const positive = projected(await positiveHarness.adapter.resume(resumeRequest(
      positiveFingerprint,
      positiveFingerprint,
      { artifactBindings: [binding] },
    )));
    expect(positive.decision.compatibilityOutcome).toBe('exact');
    expect(positive.decision.verifiedArtifactDigests).toEqual([
      binding.reference.content_digest,
    ]);

    const tamperedHarness = createHarness('sealed-tampered');
    const tamperedFingerprint = await seedRun(tamperedHarness);
    const missingDigest = 'f'.repeat(64);
    const tampered = {
      ...binding,
      eventReference: `artifact:sha256:${missingDigest}`,
      reference: {
        ...binding.reference,
        content_digest: missingDigest,
        qualified_digest: `sha256:${missingDigest}`,
      },
    };
    const rejected = projected(await tamperedHarness.adapter.resume(resumeRequest(
      tamperedFingerprint,
      tamperedFingerprint,
      { artifactBindings: [tampered] },
    )));
    expect(rejected.decision.compatibilityOutcome).toBe('blocked');
    expect(rejected.decision.verifiedArtifactDigests).toEqual([]);
    expect(rejected.executionPool).toEqual([]);
  });

  it('uses an explicit registered manifest revision and never inherits prior retry identity', async () => {
    const harness = createHarness('changed-manifest');
    const persisted = await seedRun(harness);
    const installed = resumeFingerprint('manifest-v2');
    const result = projected(await harness.adapter.resume(resumeRequest(persisted, installed, {
      compatibilityRules: [{
        component: 'manifest',
        fromVersion: 'manifest-v1',
        toVersion: 'manifest-v2',
        outcome: 'migrate',
        revision: 'manifest-migration-v2',
      }],
    })));
    expect(result.decision.compatibilityOutcome).toBe('migrate');
    expect(result.decision.manifestDisposition).toBe('restart');
    expect(result.decision.compatibility.find((entry) => entry.component === 'manifest'))
      .toMatchObject({ outcome: 'migrate', revision: 'manifest-migration-v2' });
    expect(result.decision.branches.every((branch) => branch.disposition === 'compensate')).toBe(true);
    expect(result.decision.branches.every((branch) => branch.attemptId === null)).toBe(true);
    expect(result.executionPool).toEqual([]);
    expect(result.decision.branches.every((branch) => branch.retryKey === `retry:${hash({
      manifestRevision: 'manifest-v2', logicalLeafId: branch.logicalLeafId,
    })}`)).toBe(true);
    expect(result.decision.branches.every((branch) => branch.retryKey.startsWith('retry:'))).toBe(true);
  });

  it('fails closed when a changed manifest has no registered compatibility rule', async () => {
    const harness = createHarness('unregistered-manifest');
    const persisted = await seedRun(harness);
    const installed = resumeFingerprint('manifest-v2');
    const result = projected(await harness.adapter.resume(resumeRequest(persisted, installed)));
    expect(result.decision.compatibilityOutcome).toBe('blocked');
    expect(result.decision.manifestDisposition).toBe('reject');
    expect(result.executionPool).toEqual([]);
  });

  it('blocks an irreversible unknown-result effect and retains grounded attempt references', async () => {
    const harness = createHarness('unknown-effect');
    const fingerprint = await seedRun(harness);
    const effectKey = 'effect-key-1';
    const intent: EffectIntentPayload = {
      effect_id: `effect-${hash(effectKey)}`,
      run_id: 'run-1',
      logical_effect_id: 'memory-handoff-1',
      effect_type: 'subprocess',
      operation: 'persist-memory',
      target_identity: 'memory-target-1',
      input_digest: hash('effect-input'),
      safe_metadata: {},
      secret_references: [],
      adapter: {
        adapter_id: 'irreversible-subprocess',
        adapter_version: 'adapter-v1',
        effect_type: 'subprocess',
        replay_safe: false,
        idempotency_mode: 'postcondition',
        reconciliation: 'none',
      },
      idempotency_key: effectKey,
      recovery_policy: 'unknown-block',
      expected_postcondition_digest: hash('postcondition'),
      replay_fingerprint: fingerprint.finalDigest,
      requested_at: T1,
    };
    const effectRegistry = createEvidenceControlEventRegistry();
    const preparedIntent = prepareEventWrite({
      envelope_version: CURRENT_ENVELOPE_VERSION,
      event_id: `effect-intent-${hash(effectKey)}`,
      event_type: EFFECT_INTENT_EVENT_TYPE,
      event_version: 1,
      stream_id: 'effect-run-1-memory-handoff-1',
      stream_sequence: 1,
      occurred_at: T1,
      recorded_at: T1,
      producer: { name: 'effect-fixture', version: '1' },
      authority_epoch: 1,
      correlation_id: 'effect-correlation',
      causation_id: null,
      idempotency_key: intent.idempotency_key,
      payload: intent,
    }, effectRegistry);
    await harness.effectWriter.append(preparedIntent);
    const result = projected(await harness.adapter.resume(resumeRequest(fingerprint)));
    expect(result.decision.effects).toHaveLength(1);
    expect(result.decision.effects[0].disposition).toBe('blocked');
    expect(result.decision.effects[0].effectId).toMatch(/^effect-/);
    expect(result.decision.effects[0].attemptRefs).toHaveLength(1);
    expect(result.decision.effects[0].nextAttemptId).toBeNull();
  });

  it('blocks a forged confirmation that shares the effect identity but not the intent binding', async () => {
    const harness = createHarness('forged-effect-confirmation');
    const fingerprint = await seedRun(harness);
    const seeded = await seedEffectIntent(harness, fingerprint, 'forged-confirmation-key');
    const forged = confirmationFor(seeded, {
      intent_event_digest: 'a'.repeat(64),
      postcondition_digest: hash('forged-postcondition'),
    });
    expect(effectConfirmationBindsIntent(
      forged,
      seeded.intent,
      seeded.intentEvent.event.effective.envelope.event_id,
      seeded.intentEvent.event.stored.digest,
    )).toBe(false);
    await appendEffectEvent(
      harness,
      EFFECT_CONFIRMATION_EVENT_TYPE,
      forged.confirmation_id,
      seeded.streamId,
      2,
      `${seeded.intent.idempotency_key}:confirmation`,
      forged,
      forged.intent_event_id,
    );
    const result = projected(await harness.adapter.resume(resumeRequest(fingerprint)));
    expect(result.decision.effects[0].disposition).toBe('blocked');
    expect(result.decision.effects[0].attemptRefs).not.toContain(forged.confirmation_id);
  });

  it('reconciles a confirmation bound to all durable intent facts', async () => {
    const harness = createHarness('genuine-effect-confirmation');
    const fingerprint = await seedRun(harness);
    const seeded = await seedEffectIntent(harness, fingerprint, 'genuine-confirmation-key');
    const genuine = confirmationFor(seeded);
    expect(effectConfirmationBindsIntent(
      genuine,
      seeded.intent,
      seeded.intentEvent.event.effective.envelope.event_id,
      seeded.intentEvent.event.stored.digest,
    )).toBe(true);
    await appendEffectEvent(
      harness,
      EFFECT_CONFIRMATION_EVENT_TYPE,
      genuine.confirmation_id,
      seeded.streamId,
      2,
      `${seeded.intent.idempotency_key}:confirmation`,
      genuine,
      genuine.intent_event_id,
    );
    const result = projected(await harness.adapter.resume(resumeRequest(fingerprint)));
    expect(result.decision.effects[0].disposition).toBe('reconcile');
    expect(result.decision.effects[0].attemptRefs).toContain(genuine.confirmation_id);
  });

  it('reconciles an applied recovery verdict after a confirmation crash window', async () => {
    const harness = createHarness('applied-reconciliation');
    const fingerprint = await seedRun(harness);
    const seeded = await seedEffectIntent(harness, fingerprint, 'applied-reconciliation-key');
    await appendReconciliation(harness, seeded, 'applied');
    const result = projected(await harness.adapter.resume(resumeRequest(fingerprint)));
    expect(result.decision.effects[0].disposition).toBe('reconcile');
    expect(result.decision.effects[0].attemptRefs).toHaveLength(2);
  });

  it.each(['in_doubt', 'conflict'] as const)(
    'blocks a %s reconciliation verdict before capability fallback',
    async (verdict) => {
      const harness = createHarness(`${verdict.replace('_', '-')}-reconciliation`);
      const fingerprint = await seedRun(harness);
      const seeded = await seedEffectIntent(
        harness,
        fingerprint,
        `${verdict}-reconciliation-key`,
        { replay_safe: true, reconciliation: 'conclusive' },
      );
      await appendReconciliation(harness, seeded, verdict);
      const result = projected(await harness.adapter.resume(resumeRequest(fingerprint)));
      expect(result.decision.effects[0].disposition).toBe('blocked');
    },
  );

  it('reexecutes only when reconciliation proves non-application and replay is safe', async () => {
    const harness = createHarness('not-applied-reconciliation');
    const fingerprint = await seedRun(harness);
    const seeded = await seedEffectIntent(
      harness,
      fingerprint,
      'not-applied-reconciliation-key',
      { replay_safe: true, reconciliation: 'conclusive' },
    );
    await appendReconciliation(harness, seeded, 'not_applied');
    const result = projected(await harness.adapter.resume(resumeRequest(fingerprint)));
    expect(result.decision.effects[0].disposition).toBe('reexecute');
    expect(result.decision.effects[0].nextAttemptId).toMatch(/^effect-attempt-/);
  });

  it('blocks an immutable effect conflict before reconciliation capability fallback', async () => {
    const harness = createHarness('effect-conflict');
    const fingerprint = await seedRun(harness);
    const seeded = await seedEffectIntent(
      harness,
      fingerprint,
      'effect-conflict-key',
      { replay_safe: true, reconciliation: 'conclusive' },
    );
    await appendEffectConflict(harness, seeded);
    const result = projected(await harness.adapter.resume(resumeRequest(fingerprint)));
    expect(result.decision.effects[0].disposition).toBe('blocked');
  });

  it('applies the same resume request once and dispatches no second branch effect', async () => {
    const harness = createHarness('idempotent', true);
    const fingerprint = await seedRun(harness, resumeFingerprint(), false, false);
    const request = resumeRequest(fingerprint);
    const first = projected(await harness.adapter.resume(request));
    const headAfterFirst = await harness.ledger.getVerifiedHead();
    const second = projected(await harness.adapter.resume(request));
    expect(first.status).toBe('appended');
    expect(second.status).toBe('idempotent');
    expect(second.decision).toEqual(first.decision);
    expect(second.continuity).toEqual(first.continuity);
    expect(second.appendReceipt).toEqual(first.appendReceipt);
    expect(second.dispatchedBranches).toBe(0);
    expect(harness.dispatched).toEqual(['branch-affected', 'branch-unrelated']);
    expect(await harness.ledger.getVerifiedHead()).toEqual(headAfterFirst);
  });

  it('rejects divergent resume content bound to the same idempotency key', async () => {
    const harness = createHarness('idempotency-conflict');
    const persisted = await seedRun(harness);
    const installed = resumeFingerprint('manifest-v2');
    const first = resumeRequest(persisted, installed, {
      compatibilityRules: [{
        component: 'manifest',
        fromVersion: 'manifest-v1',
        toVersion: 'manifest-v2',
        outcome: 'migrate',
        revision: 'manifest-migration-v2',
      }],
    });
    const divergent = resumeRequest(persisted, installed, {
      compatibilityRules: [{
        component: 'manifest',
        fromVersion: 'manifest-v1',
        toVersion: 'manifest-v2',
        outcome: 'pin-old-runtime',
        revision: 'manifest-pin-v2',
      }],
    });
    await harness.adapter.resume(first);
    await expect(harness.adapter.resume(divergent)).rejects.toThrow(/idempotency_conflict/);
  });

  it('reuses the exact persisted lease and never mints a lineage on same-run resume', async () => {
    const harness = createHarness('lease');
    const fingerprint = await seedRun(harness);
    const request = resumeRequest(fingerprint);
    const result = projected(await harness.adapter.resume(request));
    expect(result.decision.lease).toEqual(request.lease);
    expect(result.decision.lease.lineageId).toBe('lineage-1');
    expect(result.continuity.lineageId).toBe('lineage-1');
    expect(result.decision.lease.generation).toBe(7);
  });

  it('reopens only dependency-reachable work and preserves immutable history', async () => {
    const harness = createHarness('selective-drift');
    const fingerprint = await seedRun(harness, resumeFingerprint(), true);
    const result = projected(await harness.adapter.resume(resumeRequest(fingerprint)));
    expect(result.decision.invalidation.changedSourceVersionIds).toEqual(['source-v1']);
    expect(result.decision.invalidation.invalidatedClaimVersionIds).toEqual(['claim-v1']);
    expect(result.decision.invalidation.reopenedLogicalLeafIds).toEqual(['branch-affected']);
    expect(result.decision.branches.find((entry) => entry.logicalLeafId === 'branch-affected')?.disposition)
      .toBe('compensate');
    expect(result.decision.branches.find((entry) => entry.logicalLeafId === 'branch-unrelated')?.disposition)
      .toBe('reuse');
    expect(result.projection.claimLedger.sources.map((entry) => entry.sourceVersionId))
      .toEqual(['source-v1', 'source-v2']);
    expect(result.projection.claimLedger.claims.map((entry) => entry.claimVersionId))
      .toContain('claim-v1');
    expect(result.continuity.synthesisState).toBe('rebuild-required');
  });

  it('compensates a reopened live reservation before any branch reexecution', async () => {
    const harness = createHarness('reservation-compensation', true);
    const fingerprint = await seedRun(harness, resumeFingerprint(), true);
    const result = projected(await harness.adapter.resume(resumeRequest(fingerprint)));
    const affected = result.decision.branches.find(
      (entry) => entry.logicalLeafId === 'branch-affected',
    );
    expect(affected).toMatchObject({ disposition: 'compensate', attemptId: null });
    expect(affected?.decisionReason).toMatch(/reservation must be compensated/);
    expect(result.executionPool.map((entry) => entry.logicalLeafId)).not.toContain('branch-affected');
    expect(harness.dispatched).not.toContain('branch-affected');
  });

  it('rejects a self-consistent forged checkpoint cursor instead of skipping history', async () => {
    const harness = createHarness('forged-cursor');
    const fingerprint = await seedRun(harness);
    const first = projected(await harness.adapter.resume(resumeRequest(fingerprint)));
    const forgedTail = first.checkpoint.sourceTailSequence + 1;
    const forgedCheckpoint = {
      projection: first.checkpoint.projection,
      sourceTailSequence: forgedTail,
      integrityDigest: hash({
        projectionDigest: deepResearchProjectionIntegrityDigest(first.checkpoint.projection),
        sourceTailSequence: forgedTail,
      }),
    };
    const headBefore = await harness.ledger.getVerifiedHead();
    const result = await harness.adapter.resume(resumeRequest(fingerprint, fingerprint, {
      idempotencyKey: 'resume-request-forged-cursor',
      checkpoint: forgedCheckpoint,
    }));
    expect(result.status).toBe('rebuild_required');
    if (result.status !== 'rebuild_required') throw new Error('expected rebuild');
    expect(result.reasonCodes).toContain('checkpoint-digest-mismatch');
    expect(await harness.ledger.getVerifiedHead()).toEqual(headBefore);
  });

  it('exports the complete continuity ladder and keeps dispatch dark by default', async () => {
    expect(DEEP_RESEARCH_CONTINUITY_LADDER.map((row) => row.step)).toEqual([
      'init', 'plan/frontier', 'gather/analyze', 'convergence', 'synthesis', 'memory-save',
    ]);
    expect(DEEP_RESEARCH_CONTINUITY_LADDER.every((row) => (
      row.eventFamilies.length > 0 && row.reducerFields.length > 0 && row.reentryActions.length > 0
    ))).toBe(true);
    const harness = createHarness('dark-default');
    const fingerprint = await seedRun(harness, resumeFingerprint(), false, false);
    const result = projected(await harness.adapter.resume(resumeRequest(fingerprint)));
    expect(result.executionPool).toHaveLength(2);
    expect(result.dispatchedBranches).toBe(0);
    expect(harness.dispatched).toEqual([]);
    expect(result.decision.authority).toBe('dark-evidence-only');
    expect(result.continuity.authority).toBe('shadow-only');
  });
});
