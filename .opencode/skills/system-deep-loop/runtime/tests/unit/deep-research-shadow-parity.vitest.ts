// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Shadow Parity Tests
// ───────────────────────────────────────────────────────────────────

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

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
  DEEP_RESEARCH_VOLATILITY_ALLOWLIST,
  DeepResearchResumeParityDivergenceError,
  canonicalizeDeepResearchEventStream,
  compareDeepResearchEventStreams,
  compileDeepResearchParityManifest,
  createDeepResearchModeGateInput,
  createDeepResearchLegacyResumeOracle,
  createDeepResearchParityCaseDefinition,
  createDeepResearchParityExecutors,
  deepResearchParityInitialStateDigest,
  driveDeepResearchResumeParity,
  parseDeepResearchModeGateInput,
  parseDeepResearchParityReceipt,
  runDeepResearchParityCase,
  runDeepResearchParitySuite,
} from '../../lib/deep-research-shadow-parity/index.js';
import {
  DEEP_RESEARCH_PROJECTION_CODEC_VERSION,
  DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION,
  DEEP_RESEARCH_REDUCER_VERSION,
} from '../../lib/deep-research-reducers/index.js';
import {
  DEEP_RESEARCH_RESUME_ADAPTER_VERSION,
  DeepResearchResumeAdapter,
  deepResearchResumeFingerprintDigest,
} from '../../lib/deep-research-resume-adapter/index.js';
import {
  createDeepResearchSealedArtifactStore,
} from '../../lib/deep-research-sealed-artifacts/index.js';
import {
  EventTypeRegistry,
  canonicalBytes,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  InitialArtifactKinds,
  SealedArtifactStore,
  bindVerifiedArtifactReferences,
  prepareArtifactSealedEvent,
  readVerifiedArtifactEvidence,
  recordArtifactEvent,
  sealedArtifactEventDefinitions,
} from '../../lib/sealed-reference-artifacts/index.js';
import { compileParityCaseManifest } from '../../lib/shadow-parity/index.js';
import {
  REPLAY_FINGERPRINT_ATTESTATION_EVENT_TYPE,
  createReplayFingerprintVersionRegistry,
} from '../../lib/replay-fingerprint/index.js';
import { createEvidenceControlEventRegistry } from '../../lib/receipts-and-effect-recovery/index.js';

import type {
  AuthoritySnapshot,
  GatewayAllowProof,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
} from '../../lib/authorized-ledger/index.js';
import type {
  DeepResearchEventEnvelope,
  DeepResearchEventInput,
  DeepResearchEventStem,
  DeepResearchLedgerEvent,
  DeepResearchPayloadMap,
  DeepResearchReplayMetadata,
  DeepResearchScopeMap,
} from '../../lib/deep-research-ledger-schema/index.js';
import type {
  DeepResearchParityCaseRun,
  DeepResearchParityDiffRecord,
  DeepResearchParityFaultKind,
  DeepResearchParityFixture,
  DeepResearchParityFixtureScenario,
  DeepResearchParityReceipt,
  DeepResearchTerminalDecision,
} from '../../lib/deep-research-shadow-parity/index.js';
import type { DeepResearchResumeDecision } from '../../lib/deep-research-resume-adapter/index.js';
import type {
  DeepResearchResumeFingerprint,
  DeepResearchResumeRequest,
} from '../../lib/deep-research-resume-adapter/index.js';
import type { EventWritePreflight } from '../../lib/event-envelope/index.js';
import type {
  ArtifactAuthorizationContext,
  ArtifactEventMetadata,
  ArtifactEventRecorder,
  ArtifactReferenceSet,
  VerifiedArtifactEvidence,
} from '../../lib/sealed-reference-artifacts/index.js';
import type { ParityCaseCapsule, ParityCaseManifest } from '../../lib/shadow-parity/index.js';

const BASE_SHA = '0360360360360360360360360360360360360360';
const OTHER_BASE_SHA = '1371371371371371371371371371371371371371';
const TIMESTAMP = '2026-07-22T10:00:00.000Z';
const RUN_ID = 'run-shadow-1';
const LINEAGE_ID = 'lineage-shadow-1';
const STREAM_ID = 'deep-research-shadow-run-1';
const AUTHORITY: AuthoritySnapshot = Object.freeze({ state: 'shadowing', epoch: 1 });
const temporaryRoots: string[] = [];
const eventRegistry = createDeepResearchEventRegistry();
const FAULT_CASES = Object.freeze([
  { kind: 'drop-event', eventIndex: 2, expectedClass: 'missing' },
  { kind: 'reorder-event', eventIndex: 1, expectedClass: 'reordered' },
  { kind: 'extra-event', eventIndex: 2, expectedClass: 'extra' },
  { kind: 'duplicate-event', eventIndex: 5, expectedClass: 'duplicated' },
  { kind: 'causal-link', eventIndex: 2, expectedClass: 'causal-link' },
  { kind: 'payload', eventIndex: 2, expectedClass: 'payload' },
  { kind: 'receipt', eventIndex: 2, expectedClass: 'receipt' },
  { kind: 'artifact', eventIndex: 2, expectedClass: 'artifact' },
  { kind: 'terminal-decision', eventIndex: 5, expectedClass: 'terminal-decision' },
  { kind: 'projection', eventIndex: 2, expectedClass: 'projection' },
] as const);

interface ArtifactHarness {
  readonly ledger: AppendOnlyLedger;
  readonly store: SealedArtifactStore;
  readonly recorder: ArtifactEventRecorder;
  readonly registry: EventTypeRegistry;
  readonly nextMetadata: (label: string) => ArtifactEventMetadata;
}

interface SealedBoundary {
  readonly harness: ArtifactHarness;
  readonly referenceSet: ArtifactReferenceSet;
}

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function bindReceiptDigest(
  body: Omit<DeepResearchParityReceipt, 'receiptDigest'>,
): DeepResearchParityReceipt {
  return Object.freeze({ ...body, receiptDigest: digest(body) });
}

function receiptReproducibilityDigest(
  receipt: Pick<
    DeepResearchParityReceipt,
    | 'baseSha'
    | 'runManifestDigest'
    | 'fixtureId'
    | 'legacyStreamDigest'
    | 'ledgerStreamDigest'
    | 'legacyProjectionFingerprint'
    | 'ledgerProjectionFingerprint'
    | 'diffDispositions'
  >,
): string {
  return digest({
    baseSha: receipt.baseSha,
    runManifestDigest: receipt.runManifestDigest,
    fixtureId: receipt.fixtureId,
    legacyStreamDigest: receipt.legacyStreamDigest,
    ledgerStreamDigest: receipt.ledgerStreamDigest,
    legacyProjectionFingerprint: receipt.legacyProjectionFingerprint,
    ledgerProjectionFingerprint: receipt.ledgerProjectionFingerprint,
    diffDispositions: receipt.diffDispositions,
  });
}

function forgedReceiptDiff(
  fixtureId: string,
  disposition: string,
): Readonly<Record<string, unknown>> {
  const evidence = {
    fixtureId,
    class: 'terminal-decision' as const,
    eventIndex: 0,
    expectedDigest: digest('expected-terminal-decision'),
    actualDigest: digest('actual-terminal-decision'),
  };
  const body = {
    ...evidence,
    disposition,
    owner: 'deep-research-mode-owner',
    dispositionReason: 'Terminal decisions remain comparable trusted state.',
    trustedStateProof: digest(evidence),
  };
  return Object.freeze({ diffId: digest(body), ...body });
}

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `deep-research-parity-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function replayMetadata(): DeepResearchReplayMetadata {
  return {
    fingerprint_version: 1,
    final_digest: digest('deep-research-parity-replay'),
    replay_input_digests: { configuration: digest('configuration') },
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

function createEvent<TStem extends DeepResearchEventStem>(
  stem: TStem,
  sequence: number,
  scope: DeepResearchScopeMap[TStem],
  data: DeepResearchPayloadMap[TStem],
): DeepResearchEventEnvelope<TStem> {
  return prepareDeepResearchEvent({
    stem,
    scope,
    prevEventHash: digest(`previous:${sequence}`),
    replay: replayMetadata(),
    data,
    eventId: `event-${String(sequence).padStart(3, '0')}`,
    streamId: STREAM_ID,
    streamSequence: sequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'deep-research-parity-fixture', version: '1' },
    authorityEpoch: 1,
    correlationId: `transport-${digest({ sequence }).slice(0, 16)}`,
    causationId: sequence === 1 ? null : `event-${String(sequence - 1).padStart(3, '0')}`,
    idempotencyKey: `fixture-${sequence}`,
  }, eventRegistry).envelope as DeepResearchEventEnvelope<TStem>;
}

function baseScope(): DeepResearchScopeMap<'deep_research.run_initialized'> {
  return { runId: RUN_ID, lineageId: LINEAGE_ID };
}

function iterationScope(iteration = 1): DeepResearchScopeMap<'deep_research.iteration_started'> {
  return { ...baseScope(), iteration };
}

function fullLifecycleEvents(): DeepResearchLedgerEvent[] {
  const hash = digest('fixture');
  const passage = { locatorDigest: hash, selector: 'paragraph:4', passageDigest: hash };
  return [
    createEvent('deep_research.run_initialized', 1, baseScope(), {
      generation: 1,
      charterDigest: hash,
      configDigest: hash,
      executorFingerprint: hash,
      replayFingerprint: hash,
      maxIterations: 10,
      convergencePolicyVersion: 'convergence@1',
    }),
    createEvent('deep_research.question_registered', 2, {
      ...baseScope(), questionId: 'question-1',
    }, {
      normalizedQuestionDigest: hash,
      dependencyQuestionIds: [],
      requiredSourceClasses: ['primary'],
      disconfirmingQueryRecipeIds: ['query-recipe-1'],
      budgetRef: 'budget-1',
    }),
    createEvent('deep_research.branch_planned', 3, {
      ...baseScope(), questionId: 'question-1', branchId: 'branch-1',
    }, {
      semanticClusterId: 'cluster-1',
      expectedYieldScoreVector: scoreVector(),
      contradictionRisk: 0.2,
      impact: 0.7,
      independenceGain: 0.6,
      staleness: 0.1,
      expectedCost: 0.3,
      tieBreakKey: 'tie-1',
      reservationRef: 'reservation-1',
    }),
    createEvent('deep_research.branch_selected', 4, {
      ...baseScope(), questionId: 'question-1', branchId: 'branch-1',
    }, {
      semanticClusterId: 'cluster-1',
      expectedYieldScoreVector: scoreVector(),
      contradictionRisk: 0.2,
      impact: 0.7,
      independenceGain: 0.6,
      staleness: 0.1,
      expectedCost: 0.3,
      tieBreakKey: 'tie-1',
      reservationRef: 'reservation-1',
    }),
    createEvent('deep_research.iteration_started', 5, iterationScope(), {
      focusRef: 'focus-1',
      stateTailDigest: hash,
      strategyDigest: hash,
      status: 'started',
    }),
    createEvent('deep_research.source_captured', 6, {
      ...iterationScope(), sourceVersionId: 'source-version-1',
    }, {
      sourceIdentityDigest: hash,
      locator: {
        scheme: 'url',
        locatorDigest: hash,
        selector: 'https://example.test/source',
        revision: 'revision-1',
      },
      capturedAt: TIMESTAMP,
      contentDigest: digest('source-content'),
      mediaType: 'text/html',
      retrievalReceiptRef: 'retrieval-1',
      parentSourceVersionId: null,
      instructionScanResult: 'clean',
    }),
    createEvent('deep_research.evidence_admission_decided', 7, {
      ...iterationScope(), sourceVersionId: 'source-version-1', evidenceId: 'evidence-1',
    }, {
      disposition: 'admit',
      passageLocators: [passage],
      atomicClaimRefs: ['claim-1'],
      derivativeSourceGroup: 'independent-1',
      admissionPolicyVersion: 'admission@1',
      contaminationStatus: 'clean',
      reasonCode: 'independent-primary',
    }),
    createEvent('deep_research.claim_asserted', 8, {
      ...iterationScope(), claimVersionId: 'claim-version-1',
    }, {
      claimId: 'claim-1',
      normalizedClaimDigest: digest('claim-1'),
      evidenceIds: ['evidence-1'],
      independenceGroup: 'independent-1',
      rawConfidence: 0.8,
      claimStatus: 'supported',
    }),
    createEvent('deep_research.claim_relation_recorded', 9, {
      ...iterationScope(), claimVersionId: 'claim-version-2',
    }, {
      claimId: 'claim-1',
      relatedClaimVersionId: 'claim-version-1',
      evidenceIds: ['evidence-1'],
      relation: 'contradicts',
      independenceGroup: 'independent-2',
      rawConfidence: 0.6,
      claimStatus: 'supported',
    }),
    createEvent('deep_research.claim_superseded', 10, {
      ...iterationScope(), claimVersionId: 'claim-version-2',
    }, {
      priorClaimVersionId: 'claim-version-1',
      successorClaimVersionId: 'claim-version-2',
      supersessionReason: 'New admitted evidence changes the active claim version.',
      effectiveAt: TIMESTAMP,
      replacementEvidenceIds: ['evidence-1'],
      invalidationScope: 'claim-version',
    }),
    createEvent('deep_research.next_focus_selected', 11, iterationScope(), {
      obligationId: 'obligation-1',
      selectionScoreVector: scoreVector(),
      visitCooldown: 1,
      policyVersion: 'next-focus@1',
      chosenBranchId: 'branch-1',
      chosenQuestionId: null,
    }),
    createEvent('deep_research.iteration_completed', 12, iterationScope(), {
      status: 'complete',
      rawNewInfoRatio: 0.9,
      trustedEvidenceYield: 0.3,
      outputDigest: digest('iteration-output'),
      ruledOutApproachRefs: ['approach-1'],
      nextFocusCausationId: 'event-011',
    }),
    createEvent('deep_research.convergence_evaluated', 13, iterationScope(), {
      decision: 'converged',
      rawSignals: {
        newInfoRatio: 0.9,
        contradictionRisk: 0.2,
        citationDrift: 0.1,
        observationDigest: digest('raw-observation'),
      },
      trustedSignals: {
        evidenceYield: 0.3,
        independentSourceRatio: 0.8,
        supportedClaimRatio: 0.7,
        assessmentDigest: digest('trusted-assessment'),
      },
      qualityGateResults: {
        sourceDiversity: 'pass',
        contradictionResolution: 'pass',
        citationIntegrity: 'pass',
        policyVersion: 'quality@1',
        resultDigest: digest('quality-gates'),
      },
      blockerIds: [],
      policyFingerprint: digest('policy'),
      evaluatorFingerprint: digest('evaluator'),
      evidenceTailHash: digest('evidence-tail'),
      incompleteReason: null,
      recoveryReason: null,
    }),
    createEvent('deep_research.synthesis_started', 14, baseScope(), {
      admittedLedgerRevision: 'ledger-revision-1',
      selectedClaimVersionSetDigest: digest('claim-set'),
      synthesisPolicyDigest: digest('synthesis-policy'),
      reportRevision: 'report-revision-1',
      unresolvedClaimIds: [],
      contestedClaimIds: ['claim-1'],
    }),
    createEvent('deep_research.synthesis_committed', 15, baseScope(), {
      admittedLedgerRevision: 'ledger-revision-1',
      selectedClaimVersionSetDigest: digest('claim-set'),
      synthesisPolicyDigest: digest('synthesis-policy'),
      reportRevision: 'report-revision-1',
      unresolvedClaimIds: [],
      contestedClaimIds: ['claim-1'],
      reportDigest: digest('research-report'),
      citationEventIds: ['event-007'],
      synthesisReceiptRef: 'synthesis-receipt-1',
    }),
    createEvent('deep_research.memory_save_requested', 16, baseScope(), {
      targetPacket: 'packet-1',
      continuityPayloadDigest: digest('continuity-payload'),
      route: 'continuity',
      mergeMode: 'upsert',
      sourceEventRange: { firstEventId: 'event-001', lastEventId: 'event-015' },
    }),
    createEvent('deep_research.memory_save_completed', 17, baseScope(), {
      targetPacket: 'packet-1',
      continuityPayloadDigest: digest('continuity-payload'),
      route: 'continuity',
      mergeMode: 'upsert',
      sourceEventRange: { firstEventId: 'event-001', lastEventId: 'event-015' },
      persistenceReceiptRefs: ['persistence-1'],
      continuityFingerprint: digest('continuity-fingerprint'),
    }),
    createEvent('deep_research.run_completed', 18, baseScope(), {
      terminalStatus: 'completed',
      convergenceEventId: 'event-013',
      synthesisEventId: 'event-015',
      memorySaveEventId: 'event-017',
      finalLedgerTailHash: digest('ledger-tail'),
      counts: { iterations: 1, sources: 1, admittedEvidence: 1, claims: 2 },
      completionReason: 'All typed convergence and persistence evidence is present.',
      incompleteReason: null,
    }),
  ];
}

function resequenceEvents(
  events: readonly DeepResearchLedgerEvent[],
): DeepResearchLedgerEvent[] {
  return events.map((event, index) => Object.freeze({
    ...event,
    stream_sequence: index + 1,
    causation_id: index === 0 ? null : events[index - 1].event_id,
    idempotency_key: `fixture-resequenced-${index + 1}`,
  }));
}

function evaluateArtifactPolicy(
  input: Readonly<PolicyEvaluationInput>,
): PolicyEvaluationResult {
  return input.capabilityId === 'artifact-write'
    ? { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['artifact-write'] }
    : { verdict: 'deny', reasonCode: 'policy_denied', matchedRuleIds: ['artifact-write'] };
}

function createArtifactHarness(): ArtifactHarness {
  const rootDirectory = temporaryRoot('sealed');
  const registry = new EventTypeRegistry(sealedArtifactEventDefinitions());
  const policies = new TransitionPolicyRegistry([{
    policyId: 'artifact-policy',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['artifact-write'],
    evaluate: evaluateArtifactPolicy,
  }]);
  const ledger = new AppendOnlyLedger({
    rootDirectory: join(rootDirectory, 'ledger'),
    ledgerId: 'deep-research-parity-artifacts',
    auditLedgerId: 'deep-research-parity-artifact-audit',
    authorityProvider: () => AUTHORITY,
    now: () => new Date(TIMESTAMP),
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory: join(rootDirectory, 'ledger'),
    auditLedgerId: 'deep-research-parity-artifact-audit',
    authorityProvider: () => AUTHORITY,
    now: () => new Date(TIMESTAMP),
  }, ledger, policies);
  const store = new SealedArtifactStore({
    rootDirectory: join(rootDirectory, 'store'),
    now: () => new Date(TIMESTAMP),
  });
  const policy = policies.resolve('artifact-policy', 1);
  let index = 0;
  const nextMetadata = (label: string): ArtifactEventMetadata => {
    index += 1;
    return {
      eventId: `${label}-${index}`,
      streamId: 'artifact-stream',
      streamSequence: index,
      occurredAt: TIMESTAMP,
      recordedAt: TIMESTAMP,
      producer: { name: 'deep-research-parity-tests', version: '1' },
      authorityEpoch: 1,
      correlationId: `artifact-correlation-${index}`,
      causationId: null,
      idempotencyKey: `artifact-idempotency-${index}`,
    };
  };
  const recorder: ArtifactEventRecorder = {
    ledger,
    gateway,
    authorizationContext: (event): ArtifactAuthorizationContext => ({
      requestId: `artifact-request-${event.identity.eventId}`,
      mode: 'research',
      priorStateVersion: 'artifact-state@1',
      priorStateFingerprint: digest('artifact-state'),
      actorId: 'deep-research-parity-test',
      capabilityId: 'artifact-write',
      authorityEpoch: 1,
      policy: {
        policyId: policy.policyId,
        policyVersion: policy.policyVersion,
        policyDigest: policy.digest,
      },
      evidenceDigest: digest({ event: event.canonicalDigest }),
    }),
  };
  return { ledger, store, recorder, registry, nextMetadata };
}

async function sealAndRecord(
  harness: ArtifactHarness,
  artifactKind: string,
  source: unknown,
  label: string,
): Promise<VerifiedArtifactEvidence> {
  const sealed = await harness.store.seal(artifactKind, source);
  const event = prepareArtifactSealedEvent(
    sealed.artifact,
    harness.registry,
    harness.nextMetadata(label),
    'run-retained',
  );
  await recordArtifactEvent(harness.recorder, event);
  return readVerifiedArtifactEvidence(
    harness.ledger,
    harness.store,
    sealed.artifact.reference,
    artifactKind,
  );
}

async function createSealedBoundary(): Promise<SealedBoundary> {
  const harness = createArtifactHarness();
  const fixture = await sealAndRecord(
    harness,
    InitialArtifactKinds.FIXTURE,
    { mode: 'deep-research', source: 'frozen-fixture' },
    'fixture',
  );
  const configuration = await sealAndRecord(
    harness,
    InitialArtifactKinds.CONFIGURATION,
    { mode: 'deep-research', authority: 'legacy' },
    'configuration',
  );
  return {
    harness,
    referenceSet: bindVerifiedArtifactReferences([fixture, configuration]),
  };
}

interface ResumeHarness {
  readonly rootDirectory: string;
  readonly ledger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
  readonly policies: TransitionPolicyRegistry;
  readonly registry: EventTypeRegistry;
  readonly adapter: DeepResearchResumeAdapter;
}

function resumeFingerprint(): DeepResearchResumeFingerprint {
  const core = {
    fingerprintVersion: 1,
    manifestRevision: 'manifest-v1',
    reducerVersion: DEEP_RESEARCH_REDUCER_VERSION,
    adapterVersion: DEEP_RESEARCH_RESUME_ADAPTER_VERSION,
    schemaVersion: DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION,
    codecVersion: DEEP_RESEARCH_PROJECTION_CODEC_VERSION,
    policyVersion: 'resume-policy@1',
  };
  return Object.freeze({
    ...core,
    finalDigest: deepResearchResumeFingerprintDigest(core),
  });
}

function createResumeHarness(label: string): ResumeHarness {
  const rootDirectory = temporaryRoot(`resume-${label}`);
  const registry = createDeepResearchEventRegistry();
  const policies = new TransitionPolicyRegistry([{
    policyId: 'resume-policy',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['dark-resume'],
    evaluate: (input) => ({
      verdict: input.requestedEventType.startsWith('deep-research.ledger.')
        ? 'allow' : 'deny',
      reasonCode: input.requestedEventType.startsWith('deep-research.ledger.')
        ? 'allowed' : 'policy_denied',
      matchedRuleIds: ['dark-resume'],
    }),
  }]);
  const ledger = new AppendOnlyLedger({
    rootDirectory: join(rootDirectory, 'ledger'),
    ledgerId: 'resume-parity-ledger',
    auditLedgerId: 'resume-parity-audit',
    authorityProvider: () => AUTHORITY,
    now: () => new Date(TIMESTAMP),
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory: join(rootDirectory, 'ledger'),
    auditLedgerId: 'resume-parity-audit',
    authorityProvider: () => AUTHORITY,
    now: () => new Date(TIMESTAMP),
  }, ledger, policies);
  const effectLedger = new AppendOnlyLedger({
    rootDirectory: join(rootDirectory, 'effects'),
    ledgerId: 'resume-parity-effects',
    auditLedgerId: 'resume-parity-effects-audit',
    authorityProvider: () => AUTHORITY,
    now: () => new Date(TIMESTAMP),
  }, createEvidenceControlEventRegistry());
  const adapter = new DeepResearchResumeAdapter({
    ledger,
    effectLedger,
    gateway,
    policies,
    eventRegistry: registry,
    fingerprintVersions: createReplayFingerprintVersionRegistry(),
    artifactStore: createDeepResearchSealedArtifactStore({
      rootDirectory: join(rootDirectory, 'artifacts'),
    }),
    producer: { name: 'deep-research-parity-resume', version: '1' },
    policyId: 'resume-policy',
    policyVersion: 1,
    actorId: 'deep-research-parity-resume',
    capabilityId: 'resume-write',
    authorityEpoch: 1,
    priorStateVersion: 'deep-research-resume@1',
  });
  return { rootDirectory, ledger, gateway, policies, registry, adapter };
}

async function authorizeResumeEvent(
  harness: ResumeHarness,
  event: EventWritePreflight,
  requestId: string,
): Promise<GatewayAllowProof> {
  const policy = harness.policies.resolve('resume-policy', 1);
  const result = await harness.gateway.authorize({
    requestId,
    mode: 'research',
    event,
    priorHead: await harness.ledger.getVerifiedHead(),
    priorStateVersion: 'resume-fixture@1',
    priorStateFingerprint: digest('resume-fixture-state'),
    actorId: 'resume-fixture',
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

async function appendResumeEvent<TStem extends DeepResearchEventStem>(
  harness: ResumeHarness,
  fingerprint: DeepResearchResumeFingerprint,
  stem: TStem,
  sequence: number,
  scope: DeepResearchScopeMap[TStem],
  data: DeepResearchPayloadMap[TStem],
): Promise<DeepResearchLedgerEvent> {
  const head = await harness.ledger.getVerifiedHead();
  const input: DeepResearchEventInput<TStem> = {
    stem,
    scope,
    prevEventHash: head.recordHash,
    replay: {
      fingerprint_version: fingerprint.fingerprintVersion,
      final_digest: fingerprint.finalDigest,
      replay_input_digests: { configuration: digest('configuration') },
    },
    data,
    eventId: `resume-event-${sequence}`,
    streamId: 'resume-parity-stream',
    streamSequence: sequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'deep-research-parity-resume', version: '1' },
    authorityEpoch: 1,
    correlationId: `transport-${digest({ resume: sequence }).slice(0, 16)}`,
    causationId: sequence === 1 ? null : `resume-event-${sequence - 1}`,
    idempotencyKey: `resume-fixture-${sequence}`,
  };
  const event = prepareDeepResearchEvent(input, harness.registry);
  const proof = await authorizeResumeEvent(harness, event, `resume-request-${sequence}`);
  await harness.ledger.appendAuthorized(event, proof);
  return event.envelope as DeepResearchLedgerEvent;
}

async function seedResumeHarness(
  harness: ResumeHarness,
  fingerprint: DeepResearchResumeFingerprint,
): Promise<readonly DeepResearchLedgerEvent[]> {
  const base = baseScope();
  const events: DeepResearchLedgerEvent[] = [];
  events.push(await appendResumeEvent(
    harness,
    fingerprint,
    'deep_research.run_initialized',
    1,
    base,
    {
    generation: 1,
    charterDigest: digest('charter'),
    configDigest: digest('config'),
    executorFingerprint: digest('executor'),
    replayFingerprint: fingerprint.finalDigest,
    maxIterations: 10,
    convergencePolicyVersion: 'convergence@1',
    },
  ));
  events.push(await appendResumeEvent(harness, fingerprint, 'deep_research.question_registered', 2, {
    ...base, questionId: 'question-1',
  }, {
    normalizedQuestionDigest: digest('question-1'),
    dependencyQuestionIds: [],
    requiredSourceClasses: ['primary'],
    disconfirmingQueryRecipeIds: ['query-1'],
    budgetRef: 'budget-1',
  }));
  const branchData = {
    semanticClusterId: 'cluster-1',
    expectedYieldScoreVector: scoreVector(),
    contradictionRisk: 0.2,
    impact: 0.7,
    independenceGain: 0.6,
    staleness: 0.1,
    expectedCost: 0.3,
    tieBreakKey: 'tie-1',
    reservationRef: 'reservation-1',
  };
  events.push(await appendResumeEvent(harness, fingerprint, 'deep_research.branch_planned', 3, {
    ...base, questionId: 'question-1', branchId: 'branch-1',
  }, branchData));
  events.push(await appendResumeEvent(harness, fingerprint, 'deep_research.branch_selected', 4, {
    ...base, questionId: 'question-1', branchId: 'branch-1',
  }, branchData));
  return Object.freeze(events);
}

function resumeRequestFor(fingerprint: DeepResearchResumeFingerprint): DeepResearchResumeRequest {
  return {
    runId: RUN_ID,
    manifestRevision: fingerprint.manifestRevision,
    idempotencyKey: 'resume-parity-request-1',
    requestedAt: TIMESTAMP,
    resumeReason: 'Resume the authenticated dark run without replacing its lease.',
    persistedFingerprint: fingerprint,
    installedFingerprint: fingerprint,
    compatibilityRules: [],
    lease: {
      runId: RUN_ID,
      leaseId: 'lease-1',
      lineageId: LINEAGE_ID,
      generation: 1,
      deadlineAt: '2026-07-23T10:00:00.000Z',
      remainingMs: 86_400_000,
      replayFingerprint: fingerprint.finalDigest,
    },
    checkpoint: null,
    artifactBindings: [],
    transitionReceipts: [],
  };
}

function resumeDecision(
  disposition: 'reuse' | 'reexecute' = 'reuse',
  budgetLease: DeepResearchParityFixture['frozenInput']['budgetLease'] = {
    leaseId: 'lease-1',
    runId: RUN_ID,
    lineageId: LINEAGE_ID,
    generation: 1,
    maxIterations: 10,
    remainingIterations: 9,
    deadlineAt: '2026-07-23T10:00:00.000Z',
  },
): DeepResearchResumeDecision {
  const body = {
    decisionVersion: 1 as const,
    decisionId: `resume-${disposition}`,
    authority: 'dark-evidence-only' as const,
    legacyAuthority: 'unchanged' as const,
    productionCompletion: false as const,
    compatibilityOutcome: 'compatible' as const,
    manifestDisposition: 'original' as const,
    compatibility: [],
    branches: [{
      logicalLeafId: 'branch-1',
      manifestRevision: 'manifest-v1',
      retryKey: 'retry-branch-1',
      disposition,
      attemptId: disposition === 'reexecute' ? 'attempt-2' : null,
      evidenceEventIds: ['event-004'],
      decisionReason: disposition === 'reuse'
        ? 'Authenticated selected branch remains reusable.'
        : 'Changed source evidence requires branch reexecution.',
    }],
    effects: [],
    invalidation: {
      changedSourceVersionIds: disposition === 'reexecute' ? ['source-version-1'] : [],
      invalidatedEvidenceIds: disposition === 'reexecute' ? ['evidence-1'] : [],
      invalidatedClaimVersionIds: disposition === 'reexecute' ? ['claim-version-1'] : [],
      reopenedQuestionIds: disposition === 'reexecute' ? ['question-1'] : [],
      reopenedLogicalLeafIds: disposition === 'reexecute' ? ['branch-1'] : [],
      synthesisReopened: disposition === 'reexecute',
    },
    lease: {
      runId: budgetLease.runId,
      leaseId: budgetLease.leaseId,
      lineageId: budgetLease.lineageId,
      generation: budgetLease.generation,
      deadlineAt: budgetLease.deadlineAt,
      remainingMs: 86_400_000,
      replayFingerprint: digest('deep-research-parity-replay'),
    },
    forensicReceiptDigests: [],
    verifiedArtifactDigests: [],
    decisionReason: 'Resume decision is bound to authenticated ledger continuity.',
  };
  return Object.freeze({ ...body, decisionDigest: digest(body) });
}

function replaceResumeDecisionLease(
  decision: DeepResearchResumeDecision,
  overrides: Partial<DeepResearchResumeDecision['lease']>,
): DeepResearchResumeDecision {
  const { decisionDigest: _decisionDigest, ...decisionBody } = decision;
  const changedBody = {
    ...decisionBody,
    lease: { ...decision.lease, ...overrides },
  };
  return Object.freeze({ ...changedBody, decisionDigest: digest(changedBody) });
}

function incompleteEvents(): DeepResearchLedgerEvent[] {
  const full = fullLifecycleEvents();
  const events = [full[0], full[4], full[5], full[6], full[7]];
  events.push(createEvent('deep_research.convergence_evaluated', 13, iterationScope(), {
    decision: 'incomplete',
    rawSignals: {
      newInfoRatio: 0.01,
      contradictionRisk: 0.8,
      citationDrift: 0.2,
      observationDigest: digest('incomplete-observation'),
    },
    trustedSignals: {
      evidenceYield: 0.1,
      independentSourceRatio: 0.4,
      supportedClaimRatio: 0.3,
      assessmentDigest: digest('incomplete-assessment'),
    },
    qualityGateResults: {
      sourceDiversity: 'pass',
      contradictionResolution: 'pass',
      citationIntegrity: 'pass',
      policyVersion: 'quality@1',
      resultDigest: digest('incomplete-quality-gates'),
    },
    blockerIds: ['max-iterations'],
    policyFingerprint: digest('policy'),
    evaluatorFingerprint: digest('evaluator'),
    evidenceTailHash: digest('evidence-tail'),
    incompleteReason: 'Iteration lease exhausted before quality gates passed.',
    recoveryReason: null,
  }));
  return resequenceEvents(events);
}

function quarantinedEvents(): DeepResearchLedgerEvent[] {
  const events = fullLifecycleEvents().slice(0, 5);
  const hash = digest('fixture');
  events.push(createEvent('deep_research.source_captured', 6, {
    ...iterationScope(), sourceVersionId: 'source-version-1',
  }, {
    sourceIdentityDigest: hash,
    locator: {
      scheme: 'url',
      locatorDigest: hash,
      selector: 'https://example.test/poisoned',
      revision: 'revision-1',
    },
    capturedAt: TIMESTAMP,
    contentDigest: digest('poisoned-source-content'),
    mediaType: 'text/html',
    retrievalReceiptRef: 'retrieval-poisoned',
    parentSourceVersionId: null,
    instructionScanResult: 'flagged',
  }));
  events.push(createEvent('deep_research.evidence_admission_decided', 7, {
    ...iterationScope(), sourceVersionId: 'source-version-1', evidenceId: 'evidence-1',
  }, {
    disposition: 'quarantine',
    passageLocators: [{ locatorDigest: hash, selector: 'paragraph:1', passageDigest: hash }],
    atomicClaimRefs: ['claim-1'],
    derivativeSourceGroup: 'untrusted-1',
    admissionPolicyVersion: 'admission@1',
    contaminationStatus: 'contaminated',
    reasonCode: 'embedded-instruction',
  }));
  return events;
}

function quarantineConvergenceEvents(): DeepResearchLedgerEvent[] {
  const full = fullLifecycleEvents();
  const quarantined = quarantinedEvents();
  return resequenceEvents([
    full[0],
    full[4],
    quarantined[quarantined.length - 2],
    quarantined[quarantined.length - 1],
    full[12],
  ]);
}

function multiBranchEvents(): DeepResearchLedgerEvent[] {
  const events = fullLifecycleEvents().slice(0, 4);
  events.push(createEvent('deep_research.branch_planned', 5, {
    ...baseScope(), questionId: 'question-1', branchId: 'branch-2',
  }, {
    semanticClusterId: 'cluster-2',
    expectedYieldScoreVector: scoreVector(),
    contradictionRisk: 0.4,
    impact: 0.5,
    independenceGain: 0.9,
    staleness: 0.2,
    expectedCost: 0.5,
    tieBreakKey: 'tie-2',
    reservationRef: 'reservation-2',
  }));
  return events;
}

function sourceMutationEvents(): DeepResearchLedgerEvent[] {
  const events = fullLifecycleEvents().slice(0, 8);
  const hash = digest('fixture');
  events.push(createEvent('deep_research.source_captured', 9, {
    ...iterationScope(), sourceVersionId: 'source-version-2',
  }, {
    sourceIdentityDigest: hash,
    locator: {
      scheme: 'url',
      locatorDigest: hash,
      selector: 'https://example.test/source',
      revision: 'revision-2',
    },
    capturedAt: TIMESTAMP,
    contentDigest: digest('source-content-v2'),
    mediaType: 'text/html',
    retrievalReceiptRef: 'retrieval-2',
    parentSourceVersionId: 'source-version-1',
    instructionScanResult: 'clean',
  }));
  return events;
}

function convergedCoreEvents(): DeepResearchLedgerEvent[] {
  const full = fullLifecycleEvents();
  return resequenceEvents([
    full[0], full[4], full[5], full[6], full[7], full[12],
  ]);
}

function synthesisEvents(): DeepResearchLedgerEvent[] {
  const full = fullLifecycleEvents();
  return resequenceEvents([
    full[0], full[4], full[5], full[6], full[7], full[12], full[13], full[14],
  ]);
}

function memoryHandoffEvents(): DeepResearchLedgerEvent[] {
  const full = fullLifecycleEvents();
  return resequenceEvents([full[0], full[15], full[16]]);
}

function scenarioEvents(scenario: DeepResearchParityFixtureScenario): Readonly<{
  events: readonly DeepResearchLedgerEvent[];
  terminal: DeepResearchTerminalDecision;
}> {
  const full = fullLifecycleEvents();
  switch (scenario) {
    case 'fresh-run': return { events: full.slice(0, 5), terminal: 'active' };
    case 'multi-branch': return { events: multiBranchEvents(), terminal: 'active' };
    case 'quarantined-evidence': return { events: quarantinedEvents(), terminal: 'quarantined' };
    case 'contradiction-supersession': return {
      events: resequenceEvents([
        full[0], full[4], full[5], full[6], full[7], full[8], full[9],
      ]),
      terminal: 'active',
    };
    case 'max-iteration-incomplete': return { events: incompleteEvents(), terminal: 'incomplete' };
    case 'converged': return { events: convergedCoreEvents(), terminal: 'converged' };
    case 'crash-resume': return {
      events: [
        ...full.slice(0, 4),
        createEvent('deep_research.run_resumed', 5, baseScope(), {
          priorTailDigest: digest('event-004-tail'),
          sourceLineageId: LINEAGE_ID,
          resumeReason: 'Continue the authenticated selected branch.',
          generation: 1,
          compatibilityDecision: 'compatible',
          recoveryReceiptRef: 'resume-receipt-1',
        }),
      ],
      terminal: 'active',
    };
    case 'source-mutation-refresh': return { events: sourceMutationEvents(), terminal: 'active' };
    case 'synthesis': return { events: synthesisEvents(), terminal: 'converged' };
    case 'memory-save-handoff': return { events: memoryHandoffEvents(), terminal: 'active' };
  }
}

function createFixture(scenario: DeepResearchParityFixtureScenario): DeepResearchParityFixture {
  const selected = scenarioEvents(scenario);
  const budgetLease = Object.freeze({
    leaseId: 'lease-1',
    runId: RUN_ID,
    lineageId: LINEAGE_ID,
    generation: 1,
    maxIterations: 10,
    remainingIterations: scenario === 'max-iteration-incomplete' ? 0 : 9,
    deadlineAt: '2026-07-23T10:00:00.000Z',
  });
  const provisional: DeepResearchParityFixture = {
    fixtureId: `fixture-${scenario}`,
    scenario,
    frozenInput: {
      baseSha: BASE_SHA,
      runManifestDigest: digest({ scenario, manifest: 1 }),
      sourceSnapshotDigest: digest({ scenario, sources: 1 }),
      promptFingerprint: digest('prompt'),
      modelFingerprint: digest('model'),
      toolFingerprint: digest('tools'),
      initialStateDigest: digest('pending-initial-state'),
      configurationDigest: digest({ mode: 'deep-research', comparator: 1 }),
      budgetLease,
    },
    events: selected.events,
    expectedTerminalDecision: selected.terminal,
    resumeEvidence: scenario === 'crash-resume'
      ? {
        legacyDecision: resumeDecision('reuse', budgetLease),
        ledgerDecision: resumeDecision('reuse', budgetLease),
        legacyEventTailDigest: digest('resume-tail'),
        ledgerEventTailDigest: digest('resume-tail'),
        legacyFreshProjectionFingerprint: digest('fresh-continuation'),
        ledgerFreshProjectionFingerprint: digest('fresh-continuation'),
      }
      : null,
  };
  return Object.freeze({
    ...provisional,
    frozenInput: Object.freeze({
      ...provisional.frozenInput,
      initialStateDigest: deepResearchParityInitialStateDigest(provisional),
    }),
  });
}

function capsule(
  fixture: DeepResearchParityFixture,
  referenceSet: ArtifactReferenceSet,
): ParityCaseCapsule {
  return {
    baseSha: fixture.frozenInput.baseSha,
    baseDigest: digest({ baseSha: fixture.frozenInput.baseSha }),
    initialStateDigest: fixture.frozenInput.initialStateDigest,
    configurationDigest: fixture.frozenInput.configurationDigest,
    canonicalizationVersions: {
      event: 'deep-research-event@1',
      comparator: 'deep-research-event-comparator@1',
    },
    artifactReferenceSet: referenceSet,
    timeoutMs: 30_000,
    terminationPolicy: 'deep-research-bounded-shadow',
  };
}

async function caseRun(
  fixture: DeepResearchParityFixture,
  sealed: SealedBoundary,
  fault?: Readonly<{
    path: 'ledger' | 'legacy';
    kind: DeepResearchParityFaultKind;
    eventIndex: number;
  }>,
): Promise<DeepResearchParityCaseRun> {
  const boundary = {
    ledger: sealed.harness.ledger,
    store: sealed.harness.store,
    capsule: capsule(fixture, sealed.referenceSet),
  };
  return {
    caseDefinition: createDeepResearchParityCaseDefinition(fixture),
    legacyBoundary: boundary,
    ledgerBoundary: boundary,
    fixture,
    executors: createDeepResearchParityExecutors(fixture, fault),
    shadowRootDirectory: join(temporaryRoot(`execution-${fixture.fixtureId}`), 'shadow'),
    protectedRoots: [join(temporaryRoot(`authority-${fixture.fixtureId}`), 'legacy-live')],
    deterministicRuns: 2,
  };
}

function targetedManifest(fixture: DeepResearchParityFixture): ParityCaseManifest {
  const definition = createDeepResearchParityCaseDefinition(fixture);
  return compileParityCaseManifest({
    baseSha: BASE_SHA,
    baselineRows: [{
      scenarioId: definition.scenarioId,
      mode: definition.mode,
      contractDigest: definition.contractDigest,
      disposition: 'protected',
    }],
    cases: [definition],
  });
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('Deep Research shadow parity', () => {
  it('drives independent real paths: a clean fixture passes and one-path semantic drift fails', async () => {
    const fixture = createFixture('converged');
    const sealed = await createSealedBoundary();
    const appendSpy = vi.spyOn(AppendOnlyLedger.prototype, 'appendAuthorized');
    const cleanRun = await caseRun(fixture, sealed);
    const clean = await runDeepResearchParityCase({
      manifest: targetedManifest(fixture),
      caseRun: cleanRun,
    });
    expect(clean.result, JSON.stringify(clean.result)).toMatchObject({ ok: true });
    expect(clean.receipt.exitStatus).toBe('green');
    expect(clean.receipt.diffDispositions).toEqual([]);
    expect(clean.receipt.parityCertificateDigest).toMatch(/^[a-f0-9]{64}$/);
    const appendedEventTypes = appendSpy.mock.calls.map(([event]) => event.identity.eventType);
    const evidence = cleanRun.executors.evidence();
    const droveRealSubstrate = cleanRun.executors.substrateImportsReal
      && fixture.events.every((event) => appendedEventTypes.includes(event.event_type))
      && appendedEventTypes.includes(REPLAY_FINGERPRINT_ATTESTATION_EVENT_TYPE)
      && evidence.length === 4
      && evidence.every((entry) => (
        entry.observations.length === fixture.events.length
        && /^[a-f0-9]{64}$/.test(entry.streamDigest)
        && /^[a-f0-9]{64}$/.test(entry.projectionFingerprint)
      ));
    expect(droveRealSubstrate).toBe(true);

    const divergentRun = await caseRun(fixture, sealed, {
      path: 'ledger',
      kind: 'payload',
      eventIndex: 2,
    });
    const divergent = await runDeepResearchParityCase({
      manifest: targetedManifest(fixture),
      caseRun: divergentRun,
    });
    expect(divergent.result.ok).toBe(false);
    expect(divergent.receipt.exitStatus).toBe('blocked');
    expect(divergent.receipt.certificateStatus).toBe('refused');
    expect(divergent.receipt.diffDispositions.some(
      (entry) => entry.class === 'payload' && entry.disposition === 'unexplained',
    )).toBe(true);
  });

  it.each(FAULT_CASES)(
    'rejects the $kind fault through ledger append, replay, and receipt issuance',
    async ({ kind, eventIndex, expectedClass }) => {
      const fixture = createFixture('converged');
      const sealed = await createSealedBoundary();
      const outcome = await runDeepResearchParityCase({
        manifest: targetedManifest(fixture),
        caseRun: await caseRun(fixture, sealed, {
          path: 'ledger',
          kind,
          eventIndex,
        }),
      });
      expect(outcome.result.ok).toBe(false);
      expect(outcome.receipt.exitStatus).toBe('blocked');
      expect(outcome.receipt.diffDispositions.some(
        (entry) => entry.class === expectedClass && entry.disposition === 'unexplained',
      ), JSON.stringify(outcome.receipt)).toBe(true);
    },
    30_000,
  );

  it.each(FAULT_CASES)(
    'rejects the $kind fault when the legacy path is the divergent side',
    async ({ kind, eventIndex, expectedClass }) => {
      const expectedLegacyClass = kind === 'drop-event'
        ? 'extra'
        : kind === 'extra-event' ? 'missing' : expectedClass;
      const fixture = createFixture('converged');
      const sealed = await createSealedBoundary();
      const outcome = await runDeepResearchParityCase({
        manifest: targetedManifest(fixture),
        caseRun: await caseRun(fixture, sealed, {
          path: 'legacy',
          kind,
          eventIndex,
        }),
      });
      expect(outcome.result.ok).toBe(false);
      expect(outcome.receipt.exitStatus).toBe('blocked');
      expect(outcome.receipt.diffDispositions.some(
        (entry) => entry.class === expectedLegacyClass
          && entry.disposition === 'unexplained',
      ), JSON.stringify(outcome.receipt)).toBe(true);
    },
    30_000,
  );

  it('runs the complete ten-scenario closure and emits a green fail-closed gate input', async () => {
    const scenarios = [
      'fresh-run', 'multi-branch', 'quarantined-evidence',
      'contradiction-supersession', 'max-iteration-incomplete', 'converged',
      'crash-resume', 'source-mutation-refresh', 'synthesis', 'memory-save-handoff',
    ] as const;
    const fixtures = scenarios.map(createFixture);
    const manifest = compileDeepResearchParityManifest({ baseSha: BASE_SHA, fixtures });
    const sealed = await createSealedBoundary();
    const cases = await Promise.all(fixtures.map((fixture) => caseRun(fixture, sealed)));
    const suite = await runDeepResearchParitySuite({ manifest, cases });
    expect(suite.caseResults).toHaveLength(10);
    expect(
      suite.caseResults.every((result) => result.ok),
      JSON.stringify(suite.caseResults.filter((result) => !result.ok)),
    ).toBe(true);
    expect(suite.receipts).toHaveLength(10);
    expect(suite.receipts.every((receipt) => receipt.exitStatus === 'green')).toBe(true);
    expect(suite.certificate).not.toBeNull();
    expect(suite.divergence).toBeNull();
    expect(suite.modeGateInput).toMatchObject({
      exitStatus: 'pass',
      zeroUnexplainedDiffs: true,
      allReceiptsPresent: true,
      deterministicReplay: true,
      authorityState: 'legacy-authoritative',
      authorityMutation: false,
      rollbackReadinessAuthorized: false,
      cutoverAuthorized: false,
    });
  }, 120_000);

  it('classifies every event-for-event divergence surface through closed records', () => {
    const fixture = createFixture('converged');
    const fingerprints = fixture.events.map((event) => digest({ event: event.event_id }));
    const baseline = canonicalizeDeepResearchEventStream(fixture.events, fingerprints);
    const changed = (
      index: number,
      fields: Partial<(typeof baseline)[number]>,
    ) => baseline.map((entry, entryIndex) => (
      entryIndex === index ? { ...entry, ...fields } : entry
    ));
    const reordered = [...baseline];
    [reordered[1], reordered[2]] = [reordered[2], reordered[1]];
    const cases = [
      { class: 'missing', actual: baseline.filter((_, index) => index !== 2) },
      {
        class: 'extra',
        actual: [...baseline, {
          ...baseline[2],
          eventId: 'event-extra',
          producerSequence: baseline.length + 1,
          stablePayloadDigest: digest('extra-payload'),
        }],
      },
      { class: 'reordered', actual: reordered },
      {
        class: 'duplicated',
        actual: [...baseline, { ...baseline[2], eventId: 'event-duplicate' }],
      },
      { class: 'payload', actual: changed(2, { stablePayloadDigest: digest('payload') }) },
      { class: 'causal-link', actual: changed(2, { causalEventIds: ['event-causal'] }) },
      { class: 'receipt', actual: changed(2, { receiptRefs: ['receipt-altered'] }) },
      { class: 'artifact', actual: changed(2, { artifactRefs: [digest('artifact')] }) },
      { class: 'projection', actual: changed(2, { projectionFingerprint: digest('projection') }) },
      { class: 'terminal-decision', actual: changed(5, { terminalDecision: 'incomplete' }) },
    ] as const;
    for (const entry of cases) {
      const diffs = compareDeepResearchEventStreams(fixture.fixtureId, baseline, entry.actual);
      expect(
        diffs.some((diff) => diff.class === entry.class && diff.disposition === 'unexplained'),
        `missing typed ${entry.class} divergence`,
      ).toBe(true);
    }
    const payloadDiff = compareDeepResearchEventStreams(
      fixture.fixtureId,
      baseline,
      cases[4].actual,
    ).find((entry) => entry.class === 'payload');
    expect(payloadDiff).toBeDefined();
    expect(Object.keys(payloadDiff ?? {}).sort()).toEqual([
      'actualDigest', 'class', 'diffId', 'disposition', 'dispositionReason',
      'eventIndex', 'expectedDigest', 'fixtureId', 'owner', 'trustedStateProof',
    ].sort());
  });

  it('pairs corresponding transitions by logical identity across independent event IDs', () => {
    const fixture = createFixture('converged');
    const fingerprints = fixture.events.map((event) => digest({ event: event.event_id }));
    const baseline = canonicalizeDeepResearchEventStream(fixture.events, fingerprints);
    const legacy = baseline.map((entry, index) => ({
      ...entry,
      eventId: `legacy-event-${index + 1}`,
    }));
    const ledger = baseline.map((entry, index) => ({
      ...entry,
      eventId: `ledger-event-${index + 1}`,
    }));

    expect(compareDeepResearchEventStreams(fixture.fixtureId, legacy, ledger)).toEqual([]);
  });

  it('emits every field diff for matching logical positions with independent event IDs', () => {
    const fixture = createFixture('converged');
    const fingerprints = fixture.events.map((event) => digest({ event: event.event_id }));
    const baseline = canonicalizeDeepResearchEventStream(fixture.events, fingerprints);
    const legacy = baseline.map((entry, index) => ({
      ...entry,
      eventId: `legacy-event-${index + 1}`,
    }));
    const ledger = baseline.map((entry, index) => ({
      ...entry,
      eventId: `ledger-event-${index + 1}`,
      ...(index === 2 ? {
        stablePayloadDigest: digest('independent-payload'),
        causalEventIds: ['ledger-causal-event'],
        receiptRefs: ['ledger-receipt'],
        artifactRefs: [digest('ledger-artifact')],
        projectionFingerprint: digest('ledger-projection'),
        terminalDecision: 'incomplete' as const,
      } : {}),
    }));

    const diffs = compareDeepResearchEventStreams(fixture.fixtureId, legacy, ledger);
    expect(diffs.map((entry) => entry.class).sort()).toEqual([
      'artifact',
      'causal-link',
      'payload',
      'projection',
      'receipt',
      'terminal-decision',
    ]);
  });

  it('classifies missing and extra transitions by logical position regardless of event ID', () => {
    const fixture = createFixture('converged');
    const fingerprints = fixture.events.map((event) => digest({ event: event.event_id }));
    const baseline = canonicalizeDeepResearchEventStream(fixture.events, fingerprints);
    const legacy = baseline.map((entry, index) => ({
      ...entry,
      eventId: `legacy-event-${index + 1}`,
    }));
    const ledger = baseline.map((entry, index) => ({
      ...entry,
      eventId: `ledger-event-${index + 1}`,
    }));

    expect(compareDeepResearchEventStreams(
      fixture.fixtureId,
      legacy,
      ledger.filter((_, index) => index !== 2),
    ).map((entry) => entry.class)).toEqual(['missing']);
    expect(compareDeepResearchEventStreams(
      fixture.fixtureId,
      legacy.filter((_, index) => index !== 2),
      ledger,
    ).map((entry) => entry.class)).toEqual(['extra']);
  });

  it('keeps the volatility allowlist closed and rejects semantic smuggling', () => {
    expect(DEEP_RESEARCH_VOLATILITY_ALLOWLIST.map((entry) => entry.field).sort()).toEqual([
      'correlation_id', 'occurred_at', 'recorded_at',
    ]);
    expect(DEEP_RESEARCH_VOLATILITY_ALLOWLIST.every(
      (entry) => entry.volatilityReason.length > 0 && entry.semanticIdentity === false,
    )).toBe(true);
    const event = fullLifecycleEvents()[0];
    const fingerprint = digest('projection');
    expect(canonicalizeDeepResearchEventStream([event], [fingerprint])).toHaveLength(1);
    expect(() => canonicalizeDeepResearchEventStream([{
      ...event,
      correlation_id: 'claim-version-1',
    }], [fingerprint])).toThrow(/transport-only token grammar/);
    expect(() => canonicalizeDeepResearchEventStream([{
      ...event,
      recorded_at: 'not-a-timestamp',
    }], [fingerprint])).toThrow(/ISO-8601 millisecond timestamp/);
  });

  it('does not upgrade quarantined evidence or max-iteration exhaustion to convergence', async () => {
    const sealed = await createSealedBoundary();
    for (const scenario of [
      'quarantined-evidence', 'max-iteration-incomplete', 'memory-save-handoff',
    ] as const) {
      const fixture = createFixture(scenario);
      const outcome = await runDeepResearchParityCase({
        manifest: targetedManifest(fixture),
        caseRun: await caseRun(fixture, sealed),
      });
      expect(outcome.result, JSON.stringify(outcome.result)).toMatchObject({ ok: true });
      const terminal = outcome.receipt.exitStatus;
      expect(terminal).toBe('green');
      expect(fixture.expectedTerminalDecision).not.toBe('converged');
      expect(fixture.expectedTerminalDecision).not.toBe('completed');
    }
  });

  it.each([
    { expectedTerminalDecision: 'quarantined', accepted: true },
    { expectedTerminalDecision: 'converged', accepted: false },
    { expectedTerminalDecision: 'incomplete', accepted: false },
  ] as const)(
    'prioritizes quarantine over an explicit converged event when expecting $expectedTerminalDecision',
    async ({ expectedTerminalDecision, accepted }) => {
      const baseFixture = createFixture('quarantined-evidence');
      const fixture: DeepResearchParityFixture = Object.freeze({
        ...baseFixture,
        fixtureId: `fixture-quarantine-priority-${expectedTerminalDecision}`,
        events: quarantineConvergenceEvents(),
        expectedTerminalDecision,
      });
      const sealed = await createSealedBoundary();
      const outcome = await runDeepResearchParityCase({
        manifest: targetedManifest(fixture),
        caseRun: await caseRun(fixture, sealed),
      });

      expect(outcome.result.ok).toBe(accepted);
      expect(outcome.receipt.exitStatus).toBe(accepted ? 'green' : 'blocked');
      expect(outcome.receipt.certificateStatus).toBe(accepted ? 'issued' : 'refused');
    },
    30_000,
  );

  it('blocks missing and malformed receipts and rejects open receipt or gate shapes', async () => {
    const fixture = createFixture('fresh-run');
    const manifest = targetedManifest(fixture);
    const sealed = await createSealedBoundary();
    const outcome = await runDeepResearchParityCase({
      manifest,
      caseRun: await caseRun(fixture, sealed),
    });
    const missing = createDeepResearchModeGateInput({
      manifest,
      expectedFixtureIds: [fixture.fixtureId],
      receipts: [],
    });
    expect(missing).toMatchObject({
      exitStatus: 'blocked',
      allReceiptsPresent: false,
      blockingReasonCode: 'MISSING_RECEIPT',
    });
    const malformed = createDeepResearchModeGateInput({
      manifest,
      expectedFixtureIds: [fixture.fixtureId],
      receipts: [{ receiptId: 'truncated' }],
    });
    expect(malformed).toMatchObject({
      exitStatus: 'blocked',
      blockingReasonCode: 'RECEIPT_MALFORMED',
    });
    expect(() => parseDeepResearchParityReceipt({
      ...outcome.receipt,
      arbitraryEvidence: {},
    }, manifest)).toThrow(/closed allowed-key set/);
    expect(() => parseDeepResearchModeGateInput({
      ...missing,
      cutoverOverride: true,
    })).toThrow(/closed allowed-key set/);
  });

  it('binds a receipt declared status to its own stream and projection evidence', async () => {
    const fixture = createFixture('fresh-run');
    const manifest = targetedManifest(fixture);
    const sealed = await createSealedBoundary();
    const outcome = await runDeepResearchParityCase({
      manifest,
      caseRun: await caseRun(fixture, sealed),
    });
    const { receiptDigest: _receiptDigest, ...validBody } = outcome.receipt;
    const validReceipt = bindReceiptDigest(validBody);
    expect(parseDeepResearchParityReceipt(validReceipt, manifest)).toEqual(validReceipt);
    expect(createDeepResearchModeGateInput({
      manifest,
      expectedFixtureIds: [fixture.fixtureId],
      receipts: [validReceipt],
    })).toMatchObject({
      exitStatus: 'pass',
      blockingReasonCode: null,
      zeroUnexplainedDiffs: true,
    });

    const contradictoryEvidence = {
      ...validBody,
      ledgerStreamDigest: digest('forged-ledger-stream'),
      ledgerProjectionFingerprint: digest('forged-ledger-projection'),
      exitStatus: 'green' as const,
      diffDispositions: Object.freeze([]),
    };
    const contradictoryReceipt = bindReceiptDigest({
      ...contradictoryEvidence,
      reproducibilityDigest: receiptReproducibilityDigest(contradictoryEvidence),
    });
    expect(() => parseDeepResearchParityReceipt(contradictoryReceipt, manifest)).toThrow(
      /streams are not bound|declared status contradicts/,
    );
    expect(createDeepResearchModeGateInput({
      manifest,
      expectedFixtureIds: [fixture.fixtureId],
      receipts: [contradictoryReceipt],
    })).toMatchObject({
      exitStatus: 'blocked',
      blockingReasonCode: 'CERTIFICATE_UNVERIFIABLE',
    });

    const contradictoryStatus = bindReceiptDigest({
      ...validBody,
      exitStatus: 'blocked',
    });
    expect(() => parseDeepResearchParityReceipt(contradictoryStatus, manifest)).toThrow(
      /declared status contradicts its bound evidence/,
    );
  });

  it('rejects a tolerated disposition on every comparable diff class', async () => {
    const fixture = createFixture('converged');
    const manifest = targetedManifest(fixture);
    const sealed = await createSealedBoundary();
    const outcome = await runDeepResearchParityCase({
      manifest,
      caseRun: await caseRun(fixture, sealed, {
        path: 'ledger',
        kind: 'terminal-decision',
        eventIndex: 5,
      }),
    });
    const { receiptDigest: _receiptDigest, ...receiptBody } = outcome.receipt;
    const forgedBody = {
      ...receiptBody,
      diffDispositions: Object.freeze([
        forgedReceiptDiff(fixture.fixtureId, 'tolerated-non-semantic'),
      ]),
    };
    const forgedReceipt = {
      ...forgedBody,
      reproducibilityDigest: receiptReproducibilityDigest(
        forgedBody as unknown as DeepResearchParityReceipt,
      ),
    };
    const serializedReceipt = Object.freeze({
      ...forgedReceipt,
      receiptDigest: digest(forgedReceipt),
    });

    let parseError: unknown;
    try {
      parseDeepResearchParityReceipt(serializedReceipt, manifest);
    } catch (error: unknown) {
      parseError = error;
    }
    expect(parseError).toBeInstanceOf(TypeError);
    expect((parseError as Error).message).toBe(
      'diffDispositions[0].disposition is not registered',
    );
  }, 30_000);

  it('rejects a green receipt carrying any comparable diff record', async () => {
    const fixture = createFixture('fresh-run');
    const manifest = targetedManifest(fixture);
    const sealed = await createSealedBoundary();
    const outcome = await runDeepResearchParityCase({
      manifest,
      caseRun: await caseRun(fixture, sealed),
    });
    const diff = forgedReceiptDiff(
      fixture.fixtureId,
      'unexplained',
    ) as unknown as DeepResearchParityDiffRecord;
    const { receiptDigest: _receiptDigest, ...receiptBody } = outcome.receipt;
    const contradictoryEvidence = {
      ...receiptBody,
      diffDispositions: Object.freeze([diff]),
    };
    const contradictoryReceipt = bindReceiptDigest({
      ...contradictoryEvidence,
      reproducibilityDigest: receiptReproducibilityDigest(contradictoryEvidence),
    });

    expect(() => parseDeepResearchParityReceipt(
      contradictoryReceipt,
      manifest,
    )).toThrow(/declared status contradicts its bound evidence/);
  }, 30_000);

  it('keeps a real zero-diff run green and mode-gate eligible', async () => {
    const fixture = createFixture('fresh-run');
    const manifest = targetedManifest(fixture);
    const sealed = await createSealedBoundary();
    const outcome = await runDeepResearchParityCase({
      manifest,
      caseRun: await caseRun(fixture, sealed),
    });

    expect(outcome.result.ok).toBe(true);
    expect(outcome.receipt).toMatchObject({
      exitStatus: 'green',
      diffDispositions: [],
      certificateStatus: 'issued',
    });
    expect(createDeepResearchModeGateInput({
      manifest,
      expectedFixtureIds: [fixture.fixtureId],
      receipts: [outcome.receipt],
    })).toMatchObject({
      exitStatus: 'pass',
      blockingReasonCode: null,
      zeroUnexplainedDiffs: true,
    });
  }, 30_000);

  it('blocks a fabricated receipt without a real embedded certificate and passes a real run', async () => {
    const fixture = createFixture('fresh-run');
    const manifest = targetedManifest(fixture);
    const sealed = await createSealedBoundary();
    const outcome = await runDeepResearchParityCase({
      manifest,
      caseRun: await caseRun(fixture, sealed),
    });
    expect(outcome.receipt.parityCertificate).not.toBeNull();
    expect(outcome.receipt.certificateEvidenceBindings).toHaveLength(1);
    expect(parseDeepResearchParityReceipt(outcome.receipt, manifest)).toEqual(outcome.receipt);
    expect(createDeepResearchModeGateInput({
      manifest,
      expectedFixtureIds: [fixture.fixtureId],
      receipts: [outcome.receipt],
    })).toMatchObject({ exitStatus: 'pass', blockingReasonCode: null });

    const { receiptDigest: _receiptDigest, ...realBody } = outcome.receipt;
    const fabricated = bindReceiptDigest({
      ...realBody,
      parityCertificate: null,
      certificateEvidenceBindings: Object.freeze([]),
      parityCertificateDigest: digest('self-chosen-fabricated-certificate'),
      certificateStatus: 'issued',
      certificateRefusalCode: null,
    });
    expect(() => parseDeepResearchParityReceipt(fabricated, manifest)).toThrow(
      /certificate evidence contradicts its status/,
    );
    expect(createDeepResearchModeGateInput({
      manifest,
      expectedFixtureIds: [fixture.fixtureId],
      receipts: [fabricated],
    })).toMatchObject({
      exitStatus: 'blocked',
      blockingReasonCode: 'RECEIPT_MALFORMED',
    });
  }, 30_000);

  it('blocks a genuine certificate when the trusted manifest and BASE differ', async () => {
    const fixture = createFixture('fresh-run');
    const manifest = targetedManifest(fixture);
    const sealed = await createSealedBoundary();
    const outcome = await runDeepResearchParityCase({
      manifest,
      caseRun: await caseRun(fixture, sealed),
    });
    const definition = createDeepResearchParityCaseDefinition(fixture);
    const differentManifest = compileParityCaseManifest({
      baseSha: OTHER_BASE_SHA,
      baselineRows: [{
        scenarioId: definition.scenarioId,
        mode: definition.mode,
        contractDigest: definition.contractDigest,
        disposition: 'protected',
      }],
      cases: [definition],
    });
    expect(() => parseDeepResearchParityReceipt(
      outcome.receipt,
      differentManifest,
    )).toThrow(/certificate verification failed/);
    expect(createDeepResearchModeGateInput({
      manifest: differentManifest,
      expectedFixtureIds: [fixture.fixtureId],
      receipts: [outcome.receipt],
    })).toMatchObject({
      exitStatus: 'blocked',
      blockingReasonCode: 'RECEIPT_STALE',
    });
  }, 30_000);

  it('blocks undeclared frozen-input keys at the executor boundary', async () => {
    const fixture = createFixture('fresh-run');
    const frozenInput = Object.freeze({
      ...fixture.frozenInput,
      stopPolicy: 'undeclared-policy',
    }) as unknown as DeepResearchParityFixture['frozenInput'];
    const fixtureWithExtraInput = Object.freeze({ ...fixture, frozenInput });
    const sealed = await createSealedBoundary();
    const outcome = await runDeepResearchParityCase({
      manifest: targetedManifest(fixtureWithExtraInput),
      caseRun: await caseRun(fixtureWithExtraInput, sealed),
    });
    expect(outcome.result).toMatchObject({
      ok: false,
      divergence: {
        class: 'execution-outcome',
        message: expect.stringMatching(/frozenInput must use the closed allowed-key set/),
      },
    });
    expect(outcome.receipt).toMatchObject({
      exitStatus: 'blocked',
      certificateStatus: 'refused',
    });
  }, 30_000);

  it('rejects undeclared fixture keys before case execution', async () => {
    const fixture = createFixture('fresh-run');
    const fixtureWithExtraKey = Object.freeze({
      ...fixture,
      stopPolicy: 'undeclared-policy',
    }) as unknown as DeepResearchParityFixture;
    const sealed = await createSealedBoundary();

    await expect(runDeepResearchParityCase({
      manifest: targetedManifest(fixtureWithExtraKey),
      caseRun: await caseRun(fixtureWithExtraKey, sealed),
    })).rejects.toThrow(/fixture must use the closed allowed-key set/);
  }, 30_000);

  it('rejects undeclared resume-evidence keys before case execution', async () => {
    const fixture = createFixture('crash-resume');
    if (fixture.resumeEvidence === null) throw new TypeError('Crash fixture requires resume evidence');
    const resumeEvidence = Object.freeze({
      ...fixture.resumeEvidence,
      cutoverAuthorized: true,
    }) as unknown as DeepResearchParityFixture['resumeEvidence'];
    const fixtureWithExtraResumeKey: DeepResearchParityFixture = Object.freeze({
      ...fixture,
      resumeEvidence,
    });
    const sealed = await createSealedBoundary();

    await expect(runDeepResearchParityCase({
      manifest: targetedManifest(fixtureWithExtraResumeKey),
      caseRun: await caseRun(fixtureWithExtraResumeKey, sealed),
    })).rejects.toThrow(/resumeEvidence must use the closed allowed-key set/);
  }, 30_000);

  it('blocks symmetric untracked resume leases in the real case pipeline', async () => {
    const fixture = createFixture('crash-resume');
    if (fixture.resumeEvidence === null) throw new TypeError('Crash fixture requires resume evidence');
    const untrackedIdentity = {
      leaseId: 'lease-UNTRACKED-999',
      runId: 'run-UNTRACKED-999',
      lineageId: 'lineage-UNTRACKED-999',
      generation: 999,
      deadlineAt: '2026-07-24T10:00:00.000Z',
    };
    const mismatched: DeepResearchParityFixture = Object.freeze({
      ...fixture,
      resumeEvidence: Object.freeze({
        ...fixture.resumeEvidence,
        legacyDecision: replaceResumeDecisionLease(
          fixture.resumeEvidence.legacyDecision,
          untrackedIdentity,
        ),
        ledgerDecision: replaceResumeDecisionLease(
          fixture.resumeEvidence.ledgerDecision,
          untrackedIdentity,
        ),
      }),
    });
    const manifest = targetedManifest(mismatched);
    const sealed = await createSealedBoundary();
    const outcome = await runDeepResearchParityCase({
      manifest,
      caseRun: await caseRun(mismatched, sealed),
    });

    expect(outcome.result).toMatchObject({
      ok: false,
      divergence: {
        class: 'execution-outcome',
        message: expect.stringMatching(/DEEP_RESEARCH_RESUME_LEASE_CONTINUITY/),
      },
    });
    expect(outcome.receipt).toMatchObject({
      exitStatus: 'blocked',
      certificateStatus: 'refused',
      genericDivergenceClass: 'execution-outcome',
    });
    expect(createDeepResearchModeGateInput({
      manifest,
      expectedFixtureIds: [mismatched.fixtureId],
      receipts: [outcome.receipt],
    })).toMatchObject({
      exitStatus: 'blocked',
      blockingReasonCode: 'FIXTURE_FAILURE',
    });
  }, 30_000);

  it.each(['legacyDecision', 'ledgerDecision'] as const)(
    'reports typed frozen-lease drift for resumeEvidence.%s',
    async (decisionKey) => {
      const fixture = createFixture('crash-resume');
      if (fixture.resumeEvidence === null) {
        throw new TypeError('Crash fixture requires resume evidence');
      }
      const mismatched: DeepResearchParityFixture = Object.freeze({
        ...fixture,
        resumeEvidence: Object.freeze({
          ...fixture.resumeEvidence,
          [decisionKey]: replaceResumeDecisionLease(
            fixture.resumeEvidence[decisionKey],
            { leaseId: `lease-UNTRACKED-${decisionKey}` },
          ),
        }),
      });
      const sealed = await createSealedBoundary();
      const outcome = await runDeepResearchParityCase({
        manifest: targetedManifest(mismatched),
        caseRun: await caseRun(mismatched, sealed),
      });

      expect(outcome.result).toMatchObject({
        ok: false,
        divergence: {
          class: 'execution-outcome',
          message: expect.stringMatching(
            new RegExp(`DEEP_RESEARCH_RESUME_LEASE_CONTINUITY.*${decisionKey}`),
          ),
        },
      });
      expect(outcome.receipt.exitStatus).toBe('blocked');
    },
    30_000,
  );

  it('keeps a frozen-lease-matched crash fixture green and gate eligible', async () => {
    const fixture = createFixture('crash-resume');
    const manifest = targetedManifest(fixture);
    const sealed = await createSealedBoundary();
    const run = await caseRun(fixture, sealed);
    const outcome = await runDeepResearchParityCase({ manifest, caseRun: run });

    expect(run.executors.substrateImportsReal).toBe(true);
    expect(outcome.result.ok).toBe(true);
    expect(outcome.receipt).toMatchObject({
      exitStatus: 'green',
      diffDispositions: [],
      certificateStatus: 'issued',
    });
    expect(createDeepResearchModeGateInput({
      manifest,
      expectedFixtureIds: [fixture.fixtureId],
      receipts: [outcome.receipt],
    })).toMatchObject({
      exitStatus: 'pass',
      blockingReasonCode: null,
      zeroUnexplainedDiffs: true,
    });
  }, 30_000);

  it('matches a legacy resume oracle with the independently seeded real ledger adapter', async () => {
    const fingerprint = resumeFingerprint();
    const ledger = createResumeHarness('ledger');
    const legacyEvents = await seedResumeHarness(ledger, fingerprint);
    const legacyOracle = createDeepResearchLegacyResumeOracle({ events: legacyEvents });
    const request = resumeRequestFor(fingerprint);
    const leaseBefore = JSON.stringify(request.lease);
    const resumeEvidence = await driveDeepResearchResumeParity({
      legacyOracle,
      ledgerAdapter: ledger.adapter,
      request,
    });
    expect(resumeEvidence.legacyDecision.decisionId).not.toBe(
      resumeEvidence.ledgerDecision.decisionId,
    );
    expect(resumeEvidence.legacyDecision.branches.map((entry) => entry.disposition)).toEqual(
      resumeEvidence.ledgerDecision.branches.map((entry) => entry.disposition),
    );
    expect(resumeEvidence.legacyEventTailDigest).toBe(resumeEvidence.ledgerEventTailDigest);
    expect(resumeEvidence.legacyFreshProjectionFingerprint).toBe(
      resumeEvidence.ledgerFreshProjectionFingerprint,
    );
    expect(JSON.stringify(request.lease)).toBe(leaseBefore);

    const baseFixture = createFixture('crash-resume');
    const provisional: DeepResearchParityFixture = Object.freeze({
      ...baseFixture,
      resumeEvidence,
    });
    const fixture: DeepResearchParityFixture = Object.freeze({
      ...provisional,
      frozenInput: Object.freeze({
        ...provisional.frozenInput,
        initialStateDigest: deepResearchParityInitialStateDigest(provisional),
      }),
    });
    const sealed = await createSealedBoundary();
    const outcome = await runDeepResearchParityCase({
      manifest: targetedManifest(fixture),
      caseRun: await caseRun(fixture, sealed),
    });
    expect(outcome.result.ok).toBe(true);
    expect(outcome.receipt.exitStatus).toBe('green');
  }, 60_000);

  it('rejects a genuine legacy-model resume divergence before parity evidence is emitted', async () => {
    const fingerprint = resumeFingerprint();
    const ledger = createResumeHarness('ledger-divergence');
    const ledgerEvents = await seedResumeHarness(ledger, fingerprint);
    const legacyOracle = createDeepResearchLegacyResumeOracle({
      events: ledgerEvents.slice(0, -1),
    });
    const request = resumeRequestFor(fingerprint);
    const leaseBefore = JSON.stringify(request.lease);
    let caught: unknown;
    try {
      await driveDeepResearchResumeParity({
        legacyOracle,
        ledgerAdapter: ledger.adapter,
        request,
      });
    } catch (error: unknown) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(DeepResearchResumeParityDivergenceError);
    expect(caught).toMatchObject({
      code: 'DEEP_RESEARCH_RESUME_PARITY_DIVERGENCE',
      dimensions: expect.arrayContaining(['decision', 'event-tail', 'fresh-projection']),
    });
    expect(JSON.stringify(request.lease)).toBe(leaseBefore);
  }, 60_000);

  it('rejects wrong resume evidence attribution as a decision-only divergence', async () => {
    const fingerprint = resumeFingerprint();
    const ledger = createResumeHarness('ledger-wrong-evidence');
    const ledgerEvents = await seedResumeHarness(ledger, fingerprint);
    const modeledOracle = createDeepResearchLegacyResumeOracle({ events: ledgerEvents });
    const wrongEvidenceOracle = {
      resume: async (request: DeepResearchResumeRequest) => {
        const result = await modeledOracle.resume(request);
        const { decisionDigest: _decisionDigest, ...decisionBody } = result.decision;
        const alteredBody = {
          ...decisionBody,
          branches: result.decision.branches.map((entry) => ({
            ...entry,
            evidenceEventIds: ['wrong-evidence-event'],
          })),
        };
        return Object.freeze({
          ...result,
          decision: Object.freeze({
            ...alteredBody,
            decisionDigest: digest(alteredBody),
          }),
        });
      },
    };
    let caught: unknown;
    try {
      await driveDeepResearchResumeParity({
        legacyOracle: wrongEvidenceOracle,
        ledgerAdapter: ledger.adapter,
        request: resumeRequestFor(fingerprint),
      });
    } catch (error: unknown) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(DeepResearchResumeParityDivergenceError);
    expect(caught).toMatchObject({
      code: 'DEEP_RESEARCH_RESUME_PARITY_DIVERGENCE',
      dimensions: ['decision'],
    });
  }, 60_000);

  it('blocks divergent resume choices and source-delta tails without allocating a lease', async () => {
    const fixture = createFixture('crash-resume');
    const divergent: DeepResearchParityFixture = Object.freeze({
      ...fixture,
      resumeEvidence: Object.freeze({
        legacyDecision: resumeDecision('reuse'),
        ledgerDecision: resumeDecision('reexecute'),
        legacyEventTailDigest: digest('resume-tail'),
        ledgerEventTailDigest: digest('source-delta-tail'),
        legacyFreshProjectionFingerprint: digest('fresh-continuation'),
        ledgerFreshProjectionFingerprint: digest('source-delta-projection'),
      }),
    });
    const sealed = await createSealedBoundary();
    const outcome = await runDeepResearchParityCase({
      manifest: targetedManifest(divergent),
      caseRun: await caseRun(divergent, sealed),
    });
    expect(outcome.result.ok).toBe(false);
    expect(outcome.receipt.exitStatus).toBe('blocked');
    expect(outcome.receipt.genericDivergenceClass).not.toBeNull();
    expect(outcome.receipt.diffDispositions.some(
      (entry) => entry.class === 'projection' && entry.disposition === 'unexplained',
    )).toBe(true);
    expect(divergent.frozenInput.budgetLease).toEqual(fixture.frozenInput.budgetLease);
  });
});
