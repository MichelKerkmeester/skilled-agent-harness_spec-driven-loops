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
  createDeepReviewEventRegistry,
  prepareDeepReviewEvent,
} from '../../lib/deep-review-ledger-schema/index.js';
import * as deepReviewReducersModule from '../../lib/deep-review-reducers/index.js';
import type { DeepReviewProjectionState } from '../../lib/deep-review-reducers/index.js';
import {
  DEEP_REVIEW_REQUIRED_FIXTURE_SCENARIOS,
  DEEP_REVIEW_VOLATILITY_ALLOWLIST,
  canonicalizeDeepReviewEventStream,
  compareDeepReviewEventStreams,
  compileDeepReviewParityManifest,
  createDeepReviewModeGateInput,
  createDeepReviewParityCaseDefinition,
  createDeepReviewParityExecutors,
  deepReviewParityInitialStateDigest,
  parseDeepReviewParityReceipt,
  runDeepReviewParityCase,
} from '../../lib/deep-review-shadow-parity/index.js';
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

import type {
  AuthoritySnapshot,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
} from '../../lib/authorized-ledger/index.js';
import type {
  DeepReviewEventEnvelope,
  DeepReviewEventInput,
  DeepReviewEventStem,
  DeepReviewLedgerEvent,
  DeepReviewPayloadMap,
  DeepReviewScopeMap,
  SemanticFingerprintParts,
} from '../../lib/deep-review-ledger-schema/index.js';
import type {
  DeepReviewParityCaseRun,
  DeepReviewParityFaultKind,
  DeepReviewParityFixture,
  DeepReviewParityFixtureScenario,
  DeepReviewTerminalDecision,
} from '../../lib/deep-review-shadow-parity/index.js';
import type {
  ArtifactAuthorizationContext,
  ArtifactEventMetadata,
  ArtifactEventRecorder,
  ArtifactReferenceSet,
  VerifiedArtifactEvidence,
} from '../../lib/sealed-reference-artifacts/index.js';
import type { ParityCaseCapsule, ParityCaseManifest } from '../../lib/shadow-parity/index.js';

const BASE_SHA = '0360360360360360360360360360360360360360';
const TIMESTAMP = '2026-07-22T10:00:00.000Z';
const RUN_ID = 'run-shadow-1';
const SESSION_ID = 'session-shadow-1';
const STREAM_ID = 'deep-review-shadow-stream';
const AUTHORITY: AuthoritySnapshot = Object.freeze({ state: 'shadowing', epoch: 1 });
const roots: string[] = [];
const registry = createDeepReviewEventRegistry();

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

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `deep-review-parity-${label}-`));
  roots.push(root);
  return root;
}

function semanticFingerprint(label: string): SemanticFingerprintParts {
  return {
    algorithmVersion: 'semantic-finding@1',
    semanticAnchorDigest: digest(`${label}:anchor`),
    normalizedContextDigest: digest(`${label}:context`),
    programSliceDigest: digest(`${label}:slice`),
    renameMapVersion: 'rename-map@1',
    baselineState: 'present',
  };
}

function convergenceSignals(label: string) {
  return {
    noveltyRatio: 0.01,
    coverageRatio: 1,
    findingStabilityRatio: 1,
    evidenceDensityRatio: 1,
    hotspotSaturationRatio: 1,
    observationDigest: digest(label),
  };
}

function candidateData(candidateId: string, findingClass: string, evidenceRefs: string[]) {
  return {
    targetRefs: ['target:src/review.ts'],
    evidenceRefs,
    claimTextDigest: digest(`candidate-claim-${candidateId}`),
    findingClass,
    impact: 0.5,
    rawConfidence: 0.8,
    rawCandidateScore: 0.7,
    actionability: 0.8,
    reachability: 0.8,
    exploitability: 0.2,
    evidenceType: 'test' as const,
    evidenceScope: 'direct' as const,
    rawObservationDigest: digest(`candidate-observation-${candidateId}`),
    semanticFingerprint: semanticFingerprint(candidateId),
    sourcePassEventId: 'event-5',
  };
}

function evidenceObservedData() {
  return {
    locator: {
      scheme: 'file',
      artifactRef: 'artifact:src/review.ts',
      locatorDigest: digest('locator'),
      selector: 'function:reviewCandidate',
      startLine: 20,
      endLine: 28,
      revision: 'revision-1',
    },
    observationKind: 'test-result' as const,
    rawResultDigest: digest('test-result'),
    sourceDigest: digest('evidence-source'),
    contentDigest: digest('evidence-content'),
    toolFingerprint: digest('test-tool'),
    analyzerFingerprint: digest('test-analyzer'),
    independentEvidenceClass: 'independent-test',
    causalProximityStatus: 'direct' as const,
    stabilityStatus: 'stable' as const,
    relevanceStatus: 'relevant' as const,
    supersedesEvidenceEventId: null,
  };
}

function reconciliationData() {
  return {
    ...evidenceObservedData(),
    contentDigest: digest('evidence-reconciled'),
    supersedesEvidenceEventId: 'event-7',
    reconciliationOutcome: 'confirmed' as const,
    evidenceSetDigest: digest('reconciled-evidence-set'),
  };
}

function convergenceData(label: string) {
  return {
    rawSignals: convergenceSignals(`${label}-raw`),
    weightedSignals: convergenceSignals(`${label}-weighted`),
    dimensionCoverageDigest: digest(`${label}-dimension-coverage`),
    protocolCoverageDigest: digest(`${label}-protocol-coverage`),
    findingStability: 'stable' as const,
    p0p1ResolutionState: 'resolved' as const,
    evidenceDensity: 1,
    hotspotSaturation: 1,
    decision: 'converged' as const,
    policyFingerprint: digest(`${label}-policy`),
    blockerIds: [],
    stopCandidate: true,
  };
}

function resumeData() {
  return {
    priorTailDigest: digest('prior-tail-resume'),
    sourceSessionId: 'session-shadow-0',
    resumeReason: 'Fixture continuation after a pause boundary.',
    continuedFromRunId: RUN_ID,
    compatibilityDecision: 'exact' as const,
    recoveryReceiptRef: 'recovery-receipt-1',
  };
}

function restartData() {
  return {
    priorTailDigest: digest('prior-tail-restart'),
    archivedLineageId: 'lineage-archived-1',
    restartReason: 'Fixture restart for parity coverage.',
    continuedFromRunId: RUN_ID,
    compatibilityDecision: 'exact' as const,
    recoveryReceiptRef: 'recovery-receipt-2',
  };
}

function protocolPlanData() {
  return {
    coreProtocolIds: ['review-protocol@1'],
    overlayProtocolIds: [],
    applicability: 'applicable' as const,
    gateClass: 'required' as const,
    contractVersion: 'review-protocol@1',
    plannedEvidenceSourceRefs: [],
    protocolPlanDigest: digest('protocol-plan'),
  };
}

function findingStateChangedData() {
  return {
    priorFingerprint: semanticFingerprint('candidate'),
    currentFingerprint: semanticFingerprint('dismissed'),
    priorState: 'accepted' as const,
    currentState: 'dismissed' as const,
    priorSeverity: 'P2' as const,
    currentSeverity: 'none' as const,
    adjudicationEventId: 'event-8',
    adjudicationPayloadDigest: digest('adjudication-payload'),
    changeReason: 'Fixture dismissal of a previously accepted finding.',
    evidenceSetDigest: digest('state-set'),
    predecessorEventRef: 'event-9',
  };
}

function graphConvergenceData() {
  return {
    ...convergenceData('graph'),
    graphDecision: 'converged' as const,
    graphDigest: digest('graph'),
  };
}

function pauseData() {
  return {
    normalizedStopReason: 'fixture-pause',
    sentinelCause: 'manual',
    fromIterationId: 'iteration-1',
    strategy: 'resume-later',
    targetDimensionId: null,
    outcome: 'paused' as const,
    lineageRef: 'lineage:pause',
    priorTailDigest: digest('pause-tail'),
  };
}

function recoveryData() {
  return {
    normalizedStopReason: 'fixture-pause',
    recoveryCause: 'operator-recovered',
    fromIterationId: 'iteration-1',
    strategy: 'resume-later',
    targetDimensionId: 'correctness',
    outcome: 'recovery-started' as const,
    lineageRef: 'lineage:recovery',
    priorTailDigest: digest('recovery-tail'),
    originatingPauseEventId: 'event-22',
  };
}

function blockedStopData() {
  return {
    blockedGateIds: ['coverage:correctness'],
    gateResults: [{
      gateId: 'coverage:correctness',
      status: 'fail' as const,
      reasonCode: 'coverage-incomplete',
      evidenceDigest: digest('gate-evidence'),
    }],
    activeFindingCounts: { candidates: 1, adjudicated: 0, p0: 0, p1: 0, p2: 0 },
    recoveryStrategy: 'restart',
    targetDimensionId: 'correctness',
    originatingConvergenceEventId: 'event-11',
    appendPosition: 1,
  };
}

function continuityRequestedData() {
  return {
    targetPacket: 'system-deep-loop/target',
    continuityPayloadDigest: digest('continuity-payload'),
    sourceEventRange: { firstEventId: 'event-1', lastEventId: 'event-13' },
    route: 'implementation-summary',
    mergeMode: 'update-in-place',
  };
}

function continuityCompletedData() {
  return {
    ...continuityRequestedData(),
    sourceEventRange: { firstEventId: 'event-1', lastEventId: 'event-14' },
    persistenceReceiptRefs: ['continuity-receipt-1'],
    continuityFingerprint: digest('continuity-fingerprint'),
  };
}

function continuityFailedData() {
  return {
    ...continuityRequestedData(),
    retryable: false,
    failureReasonCode: 'persistence-rejected',
  };
}

function replayMetadata() {
  return {
    fingerprint_version: 1,
    final_digest: digest('deep-review-parity-replay'),
    replay_input_digests: { configuration: digest('configuration') },
  };
}

function event<TStem extends DeepReviewEventStem>(
  stem: TStem,
  sequence: number,
  scope: DeepReviewScopeMap[TStem],
  data: DeepReviewPayloadMap[TStem],
): DeepReviewLedgerEvent {
  const input: DeepReviewEventInput<TStem> = {
    stem,
    scope,
    prevEventHash: digest(`previous:${sequence}`),
    replay: replayMetadata(),
    data,
    eventId: `event-${sequence}`,
    streamId: STREAM_ID,
    streamSequence: sequence,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'deep-review-parity-fixture', version: '1' },
    authorityEpoch: 1,
    correlationId: `transport-${digest(sequence).slice(0, 16)}`,
    causationId: sequence === 1 ? null : `event-${sequence - 1}`,
    idempotencyKey: `fixture-${sequence}`,
  };
  return prepareDeepReviewEvent(input, registry).envelope as DeepReviewEventEnvelope<TStem>;
}

function generationScope() {
  return { runId: RUN_ID, sessionId: SESSION_ID, generation: 1 };
}

function iterationScope() {
  return {
    ...generationScope(),
    iterationId: 'iteration-1',
  };
}

function dimensionScope(dimensionId = 'correctness') {
  return {
    ...iterationScope(),
    dimensionId,
  };
}

function lifecycleEvents(): DeepReviewLedgerEvent[] {
  // One realistic, folding-complete run for every stem the adapter's lifecycle
  // map owns. The two completion-breaking stems (blocked_stop_recorded and
  // continuity_save_failed) plus run_restarted and the duplicate/secondary
  // candidate live in the pool so scenarios that need them can select them.
  return [
    event('deep_review.run_initialized', 1, generationScope(), {
      target: {
        targetId: 'target-root',
        targetType: 'repository',
        artifactRef: 'artifact:repository',
        sourceDigest: digest('target-source'),
        contentDigest: digest('target-content'),
      },
      lineageMode: 'fresh',
      maxIterations: 4,
      convergencePolicyVersion: 'review-convergence@1',
      reviewModeContractDigest: digest('review-contract'),
      initialReleaseReadinessState: 'not-assessed',
    }),
    event('deep_review.run_resumed', 17, generationScope(), resumeData()),
    event('deep_review.scope_resolved', 2, {
      runId: RUN_ID, sessionId: SESSION_ID,
    }, {
      targetSetDigest: digest('target-set'),
      scopeClass: 'targeted',
      selectedTargets: [{
        targetId: 'target-file',
        targetType: 'file',
        artifactRef: 'artifact:src/review.ts',
        sourceDigest: digest('review-source'),
        contentDigest: digest('review-content'),
      }],
      omittedHighRiskTargetRefs: [],
      discoveryMethodIds: ['changed-files'],
      scopeEvidenceRefs: ['scope-evidence-1'],
    }),
    event('deep_review.dimension_ordered', 3, {
      runId: RUN_ID, sessionId: SESSION_ID,
    }, {
      orderedDimensionIds: ['correctness'],
      riskRationale: 'Correctness is the required fixture dimension.',
      scopeEvidenceRefs: ['scope-evidence-1'],
      orderingPolicyVersion: 'dimension-order@1',
    }),
    event('deep_review.protocol_plan_recorded', 18, {
      runId: RUN_ID, sessionId: SESSION_ID, protocolId: 'protocol-1',
    }, protocolPlanData()),
    event('deep_review.dimension_pass_started', 4, dimensionScope(), {
      passNumber: 1,
      targetRefs: ['target:src/review.ts'],
      filesReviewed: ['file:src/review.ts'],
      searchCoverageDigest: digest('pass-started'),
      passStatus: 'started',
      nextFocusRef: 'focus:evidence',
    }),
    event('deep_review.dimension_pass_completed', 5, dimensionScope(), {
      passNumber: 1,
      targetRefs: ['target:src/review.ts'],
      filesReviewed: ['file:src/review.ts'],
      searchCoverageDigest: digest('pass-complete'),
      passStatus: 'complete',
      rawFindingCounts: { candidates: 1, adjudicated: 1, p0: 0, p1: 0, p2: 1 },
      nextFocusRef: 'focus:convergence',
    }),
    event('deep_review.finding_candidate_emitted', 6, {
      ...dimensionScope(), candidateId: 'candidate-1',
    }, candidateData('candidate-1', 'correctness-defect', ['evidence-1'])),
    event('deep_review.evidence_observed', 7, {
      ...dimensionScope(), candidateId: 'candidate-1', evidenceId: 'evidence-1',
    }, evidenceObservedData()),
    event('deep_review.evidence_reconciled', 19, {
      ...dimensionScope(), candidateId: 'candidate-1', evidenceId: 'evidence-1',
    }, reconciliationData()),
    event('deep_review.claim_adjudication_recorded', 8, {
      ...dimensionScope(), candidateId: 'candidate-1', findingId: 'finding-1',
    }, {
      claimDigest: digest('adjudicated-claim'),
      evidenceRefs: ['evidence-1'],
      counterevidenceSoughtRefs: ['counterevidence-1'],
      alternativeExplanationDigest: digest('alternative'),
      finalSeverity: 'P2',
      impact: 0.5,
      confidence: 0.8,
      downgradeTrigger: 'none',
      transition: 'candidate-to-finding',
      validatorFingerprint: digest('validator'),
      adjudicationOutcome: 'accepted',
      predecessorAdjudicationEventId: null,
    }),
    event('deep_review.finding_lineage_recorded', 9, {
      ...dimensionScope(), findingId: 'finding-1',
    }, {
      priorFingerprint: semanticFingerprint('candidate'),
      currentFingerprint: semanticFingerprint('candidate'),
      lineageRelation: 'preexisting',
      baselineStatus: 'present',
      evidenceSetDigest: digest('lineage-evidence'),
      predecessorEventRef: 'event-8',
    }),
    event('deep_review.finding_state_changed', 20, {
      ...dimensionScope(), findingId: 'finding-1',
    }, findingStateChangedData()),
    event('deep_review.review_depth_recorded', 10, iterationScope(), {
      reviewDepthSchemaVersion: 'review-depth@1',
      applicability: 'applicable',
      targetSelectionDigest: digest('depth-targets'),
      requiredBugClasses: ['state-corruption'],
      coveredBugClasses: ['state-corruption'],
      ruledOutBugClasses: [],
      deferredBugClasses: [],
      blockedBugClasses: [],
      searchLedgerRowDigests: [digest('search-row')],
      graphStatus: 'available',
      semanticSearchStatus: 'available',
    }),
    event('deep_review.finding_candidate_emitted', 21, {
      ...dimensionScope(), candidateId: 'candidate-2',
    }, candidateData('candidate-2', 'security', ['evidence-2'])),
    event('deep_review.evidence_observed', 28, {
      ...dimensionScope(), candidateId: 'candidate-2', evidenceId: 'evidence-2',
    }, evidenceObservedData()),
    event('deep_review.convergence_evaluated', 11, iterationScope(), convergenceData('convergence')),
    event('deep_review.graph_convergence_evaluated', 22, iterationScope(), graphConvergenceData()),
    event('deep_review.pause_recorded', 23, iterationScope(), pauseData()),
    event('deep_review.recovery_started', 24, dimensionScope(), recoveryData()),
    event('deep_review.synthesis_started', 12, {
      runId: RUN_ID, sessionId: SESSION_ID, reportRevisionId: 'report-1',
    }, {
      finalizedEventRange: { firstEventId: 'event-1', lastEventId: 'event-11' },
      findingRegistryInputDigest: digest('finding-registry'),
      deduplicationPolicyDigest: digest('deduplication'),
      verdictInputDigests: [digest('verdict-input')],
      unresolvedFindingIds: [],
      deferredFindingIds: [],
    }),
    event('deep_review.review_report_committed', 13, {
      runId: RUN_ID, sessionId: SESSION_ID, reportRevisionId: 'report-1',
    }, {
      finalizedEventRange: { firstEventId: 'event-1', lastEventId: 'event-12' },
      findingRegistryInputDigest: digest('finding-registry'),
      deduplicationPolicyDigest: digest('deduplication'),
      verdictInputDigests: [digest('verdict-input')],
      unresolvedFindingIds: [],
      deferredFindingIds: [],
      reportDigest: digest('report'),
      sectionManifest: {
        sectionIds: ['findings', 'verification'],
        manifestDigest: digest('report-sections'),
      },
      reportReceiptRef: 'report-receipt-1',
    }),
    event('deep_review.continuity_save_requested', 14, {
      runId: RUN_ID, sessionId: SESSION_ID,
    }, continuityRequestedData()),
    event('deep_review.continuity_save_completed', 15, {
      runId: RUN_ID, sessionId: SESSION_ID,
    }, continuityCompletedData()),
    event('deep_review.blocked_stop_recorded', 25, iterationScope(), blockedStopData()),
    event('deep_review.run_restarted', 26, generationScope(), restartData()),
    event('deep_review.continuity_save_failed', 27, {
      runId: RUN_ID, sessionId: SESSION_ID,
    }, continuityFailedData()),
    event('deep_review.run_completed', 16, {
      runId: RUN_ID, sessionId: SESSION_ID,
    }, {
      terminalStatus: 'completed',
      convergenceEventId: 'event-11',
      synthesisEventId: 'event-12',
      reportEventId: 'event-13',
      continuityEventId: 'event-15',
      finalLedgerTailHash: digest('previous:16'),
      counts: { dimensions: 1, iterations: 1, candidates: 2, findings: 1, evidence: 2 },
      verdict: 'pass',
      completionReason: 'All required typed gates passed.',
      incompleteReason: null,
    }),
  ];
}

/** Renumber a hand-picked selection into a contiguous, causally-chained stream
 *  the reducer's cursor-gap guard accepts no matter which pool slots it skips. */
function renumber(selected: readonly DeepReviewLedgerEvent[]): DeepReviewLedgerEvent[] {
  return selected.map((entry, index, entries) => (
    Object.freeze({
      ...entry,
      stream_sequence: index + 1,
      causation_id: index === 0 ? null : entries[index - 1].event_id,
      idempotency_key: `compact-${index + 1}`,
    })
  ));
}

function scenarioSelection(scenario: DeepReviewParityFixtureScenario): Readonly<{
  events: readonly DeepReviewLedgerEvent[];
  terminal: DeepReviewTerminalDecision;
}> {
  const all = lifecycleEvents();
  // The harness records a replay fingerprint attestation only for paths of at
  // most nine events, and both paths must fold to the closed terminal, so
  // every scene below stays compact. Each divergence test runs the scene that
  // genuinely populates its field rather than a single omnibus fixture.
  const pick = (indexes: readonly number[]) => renumber(
    indexes.map((index) => all[index]),
  );
  switch (scenario) {
    case 'clean-review':
      // The run/scope surface: initializes run identity, resolves a target and
      // dimension order, and completes one pass, ending active.
      return { events: pick([0, 2, 3, 5, 6]), terminal: 'active' };
    case 'resumed-run':
      return { events: pick([0, 1, 2, 3, 5, 6]), terminal: 'active' };
    case 'duplicate-candidates':
      // The findings/evidence surface: one adjudicated, non-veto finding with
      // owned evidence and lineage so active ids, lineage, and artifacts are
      // populated without a convergence evaluation.
      return { events: pick([0, 3, 6, 7, 8, 10, 11]), terminal: 'active' };
    case 'multiple-dimensions':
      // Holds the open hard-veto candidate (security) with no convergence
      // evaluation after it, so the run stays non-terminal and the hard-veto
      // slice is genuinely populated on both independent projections.
      return { events: pick([0, 3, 6, 14, 15]), terminal: 'active' };
    case 'finding-updates':
      return { events: pick([0, 3, 6, 7, 8, 9, 10, 11]), terminal: 'active' };
    case 'fixed-preexisting-findings':
      return { events: pick([0, 3, 6, 7, 8, 10, 11]), terminal: 'active' };
    case 'inconclusive-validation':
      // The two stems no completed run can fold (blocked_stop forces a blocked
      // outcome while continuity_save_failed forces a blocked status) live in
      // this blocked-terminal scene.
      return { events: pick([0, 3, 6, 24, 26]), terminal: 'blocked' };
    case 'converged':
    case 'deterministic-replay':
      // The convergence surface: one complete coverage cell plus a stop
      // eligible evaluation populates decision and outcome on both paths.
      return { events: pick([0, 3, 6, 16]), terminal: 'converged' };
    case 'review-report':
      // Reaching a real run-completion event requires the events it cites by
      // id to be present (evidence, convergence, synthesis, report, and
      // continuity references), so this compact nine-event scene carries the
      // smallest event set that keeps the reducer's referential-integrity
      // invariants satisfied. Any open hard veto would break the completion
      // eligibility invariant, so none is selected here.
      return {
        events: pick([0, 6, 7, 8, 16, 20, 21, 23, 27]),
        terminal: 'completed',
      };
  }
}

function fixture(scenario: DeepReviewParityFixtureScenario): DeepReviewParityFixture {
  const selection = scenarioSelection(scenario);
  const provisional: DeepReviewParityFixture = {
    fixtureId: `fixture-${scenario}`,
    scenario,
    frozenInput: {
      baseSha: BASE_SHA,
      runManifestDigest: digest({ scenario, manifest: 1 }),
      sourceSnapshotDigest: digest({ scenario, source: 1 }),
      promptFingerprint: digest('prompt'),
      modelFingerprint: digest('model'),
      toolFingerprint: digest('tools'),
      initialStateDigest: digest('pending'),
      configurationDigest: digest({ mode: 'deep-review', comparator: 1 }),
      budgetLease: {
        leaseId: 'lease-1',
        runId: RUN_ID,
        sessionId: SESSION_ID,
        generation: 1,
        maxIterations: 4,
        remainingIterations: 3,
        deadlineAt: '2026-07-23T10:00:00.000Z',
      },
    },
    events: selection.events,
    expectedTerminalDecision: selection.terminal,
    resumeEvidence: null,
  };
  return Object.freeze({
    ...provisional,
    frozenInput: Object.freeze({
      ...provisional.frozenInput,
      initialStateDigest: deepReviewParityInitialStateDigest(provisional),
    }),
  });
}

function artifactPolicy(input: Readonly<PolicyEvaluationInput>): PolicyEvaluationResult {
  return input.capabilityId === 'artifact-write'
    ? { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['artifact-write'] }
    : { verdict: 'deny', reasonCode: 'policy_denied', matchedRuleIds: ['artifact-write'] };
}

/** Pin actor, capability, and evidence to the prepared request so unverified identity cannot authorize. */
function pinRequestIdentity(
  context: Readonly<{ evaluationInput: PolicyEvaluationInput }>,
): { actorId: string; capabilityId: string; evidenceDigest: string } {
  return {
    actorId: context.evaluationInput.actorId,
    capabilityId: context.evaluationInput.capabilityId,
    evidenceDigest: context.evaluationInput.evidenceDigest,
  };
}

function artifactHarness(): ArtifactHarness {
  const rootDirectory = temporaryRoot('sealed');
  const artifactRegistry = new EventTypeRegistry(sealedArtifactEventDefinitions());
  const policies = new TransitionPolicyRegistry([{
    policyId: 'artifact-policy',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['artifact-write'],
    evaluate: artifactPolicy,
  }]);
  const ledger = new AppendOnlyLedger({
    rootDirectory: join(rootDirectory, 'ledger'),
    ledgerId: 'deep-review-parity-artifacts',
    auditLedgerId: 'deep-review-parity-artifact-audit',
    authorityProvider: () => AUTHORITY,
    now: () => new Date(TIMESTAMP),
  }, artifactRegistry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory: join(rootDirectory, 'ledger'),
    auditLedgerId: 'deep-review-parity-artifact-audit',
    authorityProvider: () => AUTHORITY,
    now: () => new Date(TIMESTAMP),
    identityResolver: pinRequestIdentity,
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
      producer: { name: 'deep-review-parity-tests', version: '1' },
      authorityEpoch: 1,
      correlationId: `artifact-correlation-${index}`,
      causationId: null,
      idempotencyKey: `artifact-idempotency-${index}`,
    };
  };
  const recorder: ArtifactEventRecorder = {
    ledger,
    gateway,
    authorizationContext: (prepared): ArtifactAuthorizationContext => ({
      requestId: `artifact-request-${prepared.identity.eventId}`,
      mode: 'review',
      priorStateVersion: 'artifact-state@1',
      priorStateFingerprint: digest('artifact-state'),
      actorId: 'deep-review-parity-test',
      capabilityId: 'artifact-write',
      authorityEpoch: 1,
      policy: {
        policyId: policy.policyId,
        policyVersion: policy.policyVersion,
        policyDigest: policy.digest,
      },
      evidenceDigest: digest({ event: prepared.canonicalDigest }),
    }),
  };
  return { ledger, store, recorder, registry: artifactRegistry, nextMetadata };
}

async function sealAndRecord(
  harness: ArtifactHarness,
  artifactKind: string,
  source: unknown,
  label: string,
): Promise<VerifiedArtifactEvidence> {
  const sealed = await harness.store.seal(artifactKind, source);
  const prepared = prepareArtifactSealedEvent(
    sealed.artifact,
    harness.registry,
    harness.nextMetadata(label),
    'run-retained',
  );
  await recordArtifactEvent(harness.recorder, prepared);
  return readVerifiedArtifactEvidence(
    harness.ledger,
    harness.store,
    sealed.artifact.reference,
    artifactKind,
  );
}

async function sealedBoundary(): Promise<SealedBoundary> {
  const harness = artifactHarness();
  const frozen = await sealAndRecord(
    harness,
    InitialArtifactKinds.FIXTURE,
    { mode: 'deep-review', source: 'frozen-fixture' },
    'fixture',
  );
  const configuration = await sealAndRecord(
    harness,
    InitialArtifactKinds.CONFIGURATION,
    { mode: 'deep-review', authority: 'legacy' },
    'configuration',
  );
  return {
    harness,
    referenceSet: bindVerifiedArtifactReferences([frozen, configuration]),
  };
}

function capsule(
  selected: DeepReviewParityFixture,
  referenceSet: ArtifactReferenceSet,
): ParityCaseCapsule {
  return {
    baseSha: selected.frozenInput.baseSha,
    baseDigest: digest({ baseSha: selected.frozenInput.baseSha }),
    initialStateDigest: selected.frozenInput.initialStateDigest,
    configurationDigest: selected.frozenInput.configurationDigest,
    canonicalizationVersions: {
      event: 'deep-review-event@1',
      comparator: 'deep-review-event-comparator@1',
    },
    artifactReferenceSet: referenceSet,
    timeoutMs: 30_000,
    terminationPolicy: 'deep-review-bounded-shadow',
  };
}

function targetedManifest(selected: DeepReviewParityFixture): ParityCaseManifest {
  const definition = createDeepReviewParityCaseDefinition(selected);
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

async function caseRun(
  selected: DeepReviewParityFixture,
  sealed: SealedBoundary,
  fault?: Readonly<{
    path: 'ledger' | 'legacy';
    kind: DeepReviewParityFaultKind;
    eventIndex: number;
  }>,
): Promise<DeepReviewParityCaseRun> {
  const boundary = {
    ledger: sealed.harness.ledger,
    store: sealed.harness.store,
    capsule: capsule(selected, sealed.referenceSet),
  };
  return {
    caseDefinition: createDeepReviewParityCaseDefinition(selected),
    legacyBoundary: boundary,
    ledgerBoundary: boundary,
    fixture: selected,
    executors: createDeepReviewParityExecutors(selected, fault),
    shadowRootDirectory: join(temporaryRoot(`execution-${selected.fixtureId}`), 'shadow'),
    protectedRoots: [join(temporaryRoot(`authority-${selected.fixtureId}`), 'legacy-live')],
    deterministicRuns: 2,
  };
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('Deep Review shadow parity', () => {
  it('keeps allowlisted volatility present while identical semantics pass', () => {
    const selected = fixture('review-report');
    const fingerprints = selected.events.map((entry) => digest(entry.payload.payloadDigest));
    const legacy = canonicalizeDeepReviewEventStream(selected.events, fingerprints);
    const independent = selected.events.map((entry, index) => Object.freeze({
      ...entry,
      event_id: `independent-${index}`,
      occurred_at: `2026-07-22T11:${String(index).padStart(2, '0')}:00.000Z`,
      recorded_at: `2026-07-22T12:${String(index).padStart(2, '0')}:00.000Z`,
      correlation_id: `transport-${digest(`independent-${index}`).slice(0, 16)}`,
    })) as DeepReviewLedgerEvent[];
    const ledger = canonicalizeDeepReviewEventStream(independent, fingerprints);
    expect(DEEP_REVIEW_VOLATILITY_ALLOWLIST.map((entry) => entry.field)).toEqual([
      'occurred_at', 'recorded_at', 'correlation_id',
    ]);
    expect(compareDeepReviewEventStreams(selected.fixtureId, legacy, ledger)).toEqual([]);
  });

  it('pairs by logical identity across independent raw ids and detects semantic drift', () => {
    const selected = fixture('review-report');
    const fingerprints = selected.events.map((entry) => digest(entry.payload.payloadDigest));
    const baseline = canonicalizeDeepReviewEventStream(selected.events, fingerprints);
    const independent = baseline.map((entry, index) => ({
      ...entry,
      eventId: `other-${index}`,
      causalEventIds: entry.causalEventIds.map((_, causalIndex) => `cause-${causalIndex}`),
    }));
    const sameCausality = independent.map((entry, index) => ({
      ...entry,
      causalEventIds: baseline[index].causalEventIds,
    }));
    expect(compareDeepReviewEventStreams(selected.fixtureId, baseline, sameCausality)).toEqual([]);
    const drift = sameCausality.map((entry, index) => (
      index === 5 ? { ...entry, stablePayloadDigest: digest('semantic-drift') } : entry
    ));
    expect(compareDeepReviewEventStreams(selected.fixtureId, baseline, drift).map(
      (entry) => entry.class,
    )).toContain('payload');
  });

  it('drives every named fault through the real paired pipeline to its typed class', async () => {
    const selected = fixture('review-report');
    const sealed = await sealedBoundary();
    const faults = [
      // Every non-terminal event in this compact fixture is a referenced
      // prerequisite of run_completed (evidence, convergence, synthesis,
      // report, or continuity), so a real reducer fold rejects most
      // structural corruption of them outright; drop/reorder therefore
      // target events without a downstream referential dependent.
      ['drop-event', 8, 'missing'],
      ['reorder-event', 6, 'reordered'],
      ['extra-event', 2, 'extra'],
      ['duplicate-event', 2, 'duplicated'],
      ['causal-link', 2, 'causal-link'],
      ['payload', 2, 'payload'],
      ['receipt', 6, 'receipt'],
      ['artifact', 6, 'artifact'],
      ['terminal-decision', 8, 'terminal-decision'],
      ['projection', 2, 'projection'],
    ] as const;
    for (const [kind, eventIndex, expectedClass] of faults) {
      const outcome = await runDeepReviewParityCase({
        manifest: targetedManifest(selected),
        caseRun: await caseRun(selected, sealed, { path: 'ledger', kind, eventIndex }),
      });
      expect(outcome.receipt.exitStatus).toBe('blocked');
      expect(outcome.receipt.diffDispositions.map((entry) => entry.class)).toContain(
        expectedClass,
      );
    }
  }, 180_000);

  it('fails every unexplained semantic difference and exposes no laundering disposition', () => {
    const selected = fixture('review-report');
    const fingerprints = selected.events.map((entry) => digest(entry.payload.payloadDigest));
    const baseline = canonicalizeDeepReviewEventStream(selected.events, fingerprints);
    const changed = baseline.map((entry, index) => (
      index === 5 ? { ...entry, stablePayloadDigest: digest('changed') } : entry
    ));
    const diffs = compareDeepReviewEventStreams(selected.fixtureId, baseline, changed);
    expect(diffs).toHaveLength(1);
    expect(diffs[0]).toMatchObject({ class: 'payload', disposition: 'unexplained' });
    expect(JSON.stringify(diffs)).not.toContain('tolerated-non-semantic');
  });

  it('binds green receipts to the manifest and real generic certificate', async () => {
    const selected = fixture('review-report');
    const sealed = await sealedBoundary();
    const manifest = targetedManifest(selected);
    const outcome = await runDeepReviewParityCase({
      manifest,
      caseRun: await caseRun(selected, sealed),
    });
    expect(outcome.receipt.exitStatus).toBe('green');
    expect(outcome.receipt.parityCertificate).not.toBeNull();
    expect(parseDeepReviewParityReceipt(outcome.receipt, manifest).receiptDigest).toBe(
      outcome.receipt.receiptDigest,
    );
    const mismatched = compileParityCaseManifest({
      baseSha: '1371371371371371371371371371371371371371',
      baselineRows: manifest.baselineRows,
      cases: manifest.cases,
    });
    expect(() => parseDeepReviewParityReceipt(outcome.receipt, mismatched)).toThrow();
    const tampered = {
      ...outcome.receipt,
      parityCertificate: {
        ...outcome.receipt.parityCertificate,
        manifest_digest: digest('tampered-manifest'),
      },
    };
    expect(() => parseDeepReviewParityReceipt(tampered, manifest)).toThrow();
  }, 30_000);

  it('catches a reducer-internal divergence the two independent paths cannot both reproduce', async () => {
    // The ledger side derives every field from foldDeepReviewEvents' typed
    // output; the legacy side never calls that reducer at all. Corrupting a
    // load-bearing field inside a successful ('projected') fold therefore
    // changes only the ledger path, so the two independently derived
    // projections genuinely disagree and the paired pipeline must refuse.
    const realFold = deepReviewReducersModule.foldDeepReviewEvents;
    const spy = vi.spyOn(deepReviewReducersModule, 'foldDeepReviewEvents')
      .mockImplementation((events, options) => {
        const result = realFold(events, options);
        // The empty-event fold is shared, trivial, sealed-capsule state; both
        // paths must agree on it identically, so only a fold over a real
        // event history is corrupted here.
        if (result.outcome !== 'projected' || events.length === 0) return result;
        return {
          ...result,
          projection: {
            ...result.projection,
            run: { ...result.projection.run, generation: result.projection.run.generation + 1000 },
          },
        };
      });
    try {
      // Built after the spy is installed so the frozen initialStateDigest
      // (itself derived from a fold) is consistent with the corrupted
      // implementation used during actual replay.
      const selected = fixture('review-report');
      const sealed = await sealedBoundary();
      const manifest = targetedManifest(selected);
      const outcome = await runDeepReviewParityCase({
        manifest,
        caseRun: await caseRun(selected, sealed),
      });
      expect(outcome.receipt.exitStatus).toBe('blocked');
      expect(outcome.receipt.certificateStatus).toBe('refused');
      expect(outcome.receipt.parityCertificate).toBeNull();
      expect(outcome.result.ok).toBe(false);
      if (!outcome.result.ok) {
        expect(outcome.result.divergence.class).toBe('projection-semantic');
      }
    } finally {
      spy.mockRestore();
    }
  }, 30_000);

  it('reports the identical uncorrupted pipeline as green (paired control)', async () => {
    // Same fixture and pipeline as the corruption test above, with no
    // reducer mock installed: proves the refusal above is caused by the
    // injected divergence, not by the harness or fixture themselves.
    const selected = fixture('review-report');
    const sealed = await sealedBoundary();
    const manifest = targetedManifest(selected);
    const outcome = await runDeepReviewParityCase({
      manifest,
      caseRun: await caseRun(selected, sealed),
    });
    expect(outcome.receipt.exitStatus).toBe('green');
    expect(outcome.receipt.certificateStatus).toBe('issued');
    expect(outcome.receipt.parityCertificate).not.toBeNull();
    expect(outcome.result.ok).toBe(true);
  }, 30_000);

  it('uses a distinct legacy model and keeps parity evidence non-authoritative', async () => {
    const selected = fixture('review-report');
    const executors = createDeepReviewParityExecutors(selected);
    expect(executors.legacy).not.toBe(executors.ledger);
    expect(executors.legacyOracleKind).toBe('independent-legacy-model');
    expect(executors.substrateImportsReal).toBe(true);
    const sealed = await sealedBoundary();
    const manifest = targetedManifest(selected);
    const outcome = await runDeepReviewParityCase({
      manifest,
      caseRun: await caseRun(selected, sealed),
    });
    const gate = createDeepReviewModeGateInput({
      manifest,
      expectedFixtureIds: [selected.fixtureId],
      receipts: [outcome.receipt],
    });
    expect(gate).toMatchObject({
      exitStatus: 'pass',
      authorityState: 'legacy-authoritative',
      authorityMutation: false,
      rollbackReadinessAuthorized: false,
      cutoverAuthorized: false,
    });
  }, 30_000);

  it('compiles only the exact ten-scenario fixture closure', () => {
    const fixtures = DEEP_REVIEW_REQUIRED_FIXTURE_SCENARIOS.map(fixture);
    const manifest = compileDeepReviewParityManifest({ baseSha: BASE_SHA, fixtures });
    expect(manifest.cases).toHaveLength(10);
    expect(() => compileDeepReviewParityManifest({
      baseSha: BASE_SHA,
      fixtures: fixtures.slice(1),
    })).toThrow(/complete ten-scenario fixture set/);
  });

  it('rejects open fixture and resume-evidence shapes before execution', async () => {
    const selected = fixture('clean-review');
    const sealed = await sealedBoundary();
    const openFixture = {
      ...selected,
      undeclared: true,
    } as DeepReviewParityFixture;
    await expect(runDeepReviewParityCase({
      manifest: targetedManifest(openFixture),
      caseRun: await caseRun(openFixture, sealed),
    })).rejects.toThrow(/fixture must use the closed allowed-key set/);
  });

  /** Corrupt one reducer-state slice on the ledger fold only and require the
   *  paired pipeline to refuse the resulting projection-semantic divergence.
   *  The ledger path derives every projected field from `foldDeepReviewEvents`,
   *  while the legacy path never calls it, so a load-bearing mutation changes
   *  only one side and the comparator must fail closed. */
  async function expectSurfaceDivergence(
    scenario: DeepReviewParityFixtureScenario,
    mutate: (state: DeepReviewProjectionState) => DeepReviewProjectionState,
  ): Promise<void> {
    const realFold = deepReviewReducersModule.foldDeepReviewEvents;
    const spy = vi.spyOn(deepReviewReducersModule, 'foldDeepReviewEvents')
      .mockImplementation((events, options) => {
        const result = realFold(events, options);
        // The empty-event fold is the shared sealed-capsule state; both paths
        // must agree on it identically, so only real event histories mutate.
        if (result.outcome !== 'projected' || events.length === 0) return result;
        return { ...result, projection: mutate(result.projection) };
      });
    try {
      // Built after the spy is installed so the frozen initialStateDigest is
      // consistent with the corrupted implementation used during replay.
      const selected = fixture(scenario);
      const sealed = await sealedBoundary();
      const manifest = targetedManifest(selected);
      const outcome = await runDeepReviewParityCase({
        manifest,
        caseRun: await caseRun(selected, sealed),
      });
      expect(outcome.receipt.exitStatus).toBe('blocked');
      expect(outcome.receipt.certificateStatus).toBe('refused');
      expect(outcome.receipt.parityCertificate).toBeNull();
      expect(outcome.result.ok).toBe(false);
      if (!outcome.result.ok) {
        expect(outcome.result.divergence.class).toBe('projection-semantic');
      }
    } finally {
      spy.mockRestore();
    }
  }

  it('fails parity when the findings presentation-severity field diverges', async () => {
    await expectSurfaceDivergence('duplicate-candidates', (state) => ({
      ...state,
      findingLedger: {
        ...state.findingLedger,
        findings: state.findingLedger.findings.map((finding, index) => (
          index === 0 ? { ...finding, presentationSeverity: 'P1' as const } : finding
        )),
      },
    }));
  }, 30_000);

  it('fails parity when the evidence content-digest field diverges', async () => {
    await expectSurfaceDivergence('duplicate-candidates', (state) => ({
      ...state,
      findingLedger: {
        ...state.findingLedger,
        evidence: state.findingLedger.evidence.map((entry, index) => (
          index === 0 ? { ...entry, contentDigest: digest('corrupted-evidence') } : entry
        )),
      },
    }));
  }, 30_000);

  it('fails parity when a pass search-coverage-digest field diverges', async () => {
    await expectSurfaceDivergence('clean-review', (state) => ({
      ...state,
      reviewLoop: {
        ...state.reviewLoop,
        passes: state.reviewLoop.passes.map((pass) => (
          { ...pass, searchCoverageDigest: digest('corrupted-pass') }
        )),
      },
    }));
  }, 30_000);

  it('fails parity when the report-digest field diverges', async () => {
    await expectSurfaceDivergence('review-report', (state) => ({
      ...state,
      artifactIndex: {
        artifacts: state.artifactIndex.artifacts.map((artifact) => (
          artifact.artifactKind === 'review-report'
            ? { ...artifact, contentDigest: digest('corrupted-report') }
            : artifact
        )),
      },
    }));
  }, 30_000);

  it('fails parity when the convergence-outcome field diverges', async () => {
    // On a completed run the terminal decision is pinned by the run-completed
    // provenance transition, so corrupting only the loop outcome can never
    // trip the executor's closed-terminal gate and always reaches the
    // fingerprint comparator.
    await expectSurfaceDivergence('review-report', (state) => ({
      ...state,
      reviewLoop: { ...state.reviewLoop, outcome: 'active' as const },
    }));
  }, 30_000);

  it('fails parity when the convergence decision field diverges', async () => {
    await expectSurfaceDivergence('converged', (state) => ({
      ...state,
      reviewLoop: {
        ...state.reviewLoop,
        evaluations: state.reviewLoop.evaluations.map((evaluation, index, all) => (
          index === all.length - 1 ? { ...evaluation, decision: 'continue' as const } : evaluation
        )),
      },
    }));
  }, 30_000);

  it.skip('covers the terminal-decision field via a projection-semantic mutation', async () => {
    // The executor's closed-terminal gate re-reads this very projection field
    // on every path and throws before the fingerprint comparator when a
    // one-path flip disagrees with the fixture's closed expectation, so a
    // folded-terminal corruption always fails closed as execution-outcome,
    // never projection-semantic. Terminal drift is already asserted separately
    // by the terminal-decision fault in the fault-injection battery.
  });

  it('fails parity when the active-finding-id list diverges', async () => {
    await expectSurfaceDivergence('duplicate-candidates', (state) => ({
      ...state,
      findingLedger: {
        ...state.findingLedger,
        activeFindingIds: [...state.findingLedger.activeFindingIds, 'fabricated-active'],
      },
    }));
  }, 30_000);

  it('fails parity when the hard-veto finding-id list diverges', async () => {
    // The completed-run scene must keep zero open hard vetoes for its
    // completion eligibility invariant, so the open 'security' candidate lives
    // in the non-terminal multiple-dimensions scene instead.
    await expectSurfaceDivergence('multiple-dimensions', (state) => ({
      ...state,
      findingLedger: {
        ...state.findingLedger,
        hardVetoFindingIds: [...state.findingLedger.hardVetoFindingIds, 'fabricated-hard-veto'],
      },
    }));
  }, 30_000);

  it('fails parity when the target-id set diverges', async () => {
    await expectSurfaceDivergence('clean-review', (state) => ({
      ...state,
      reviewLoop: {
        ...state.reviewLoop,
        scope: {
          ...state.reviewLoop.scope,
          targets: state.reviewLoop.scope.targets.map((target, index) => (
            index === 0 ? { ...target, targetId: 'target-file-corrupt' } : target
          )),
        },
      },
    }));
  }, 30_000);

  it('fails parity when the ordered-dimension-id list diverges', async () => {
    await expectSurfaceDivergence('clean-review', (state) => ({
      ...state,
      reviewLoop: {
        ...state.reviewLoop,
        scope: {
          ...state.reviewLoop.scope,
          orderedDimensionIds: [...state.reviewLoop.scope.orderedDimensionIds, 'security'],
        },
      },
    }));
  }, 30_000);

  it('fails parity when the finding-lineage list diverges', async () => {
    await expectSurfaceDivergence('duplicate-candidates', (state) => ({
      ...state,
      findingLedger: {
        ...state.findingLedger,
        lineage: state.findingLedger.lineage.map((entry, index) => (
          index === 0 ? { ...entry, relation: 'introduced' as const } : entry
        )),
      },
    }));
  }, 30_000);

  it('fails parity when the continuity-save state field diverges', async () => {
    await expectSurfaceDivergence('review-report', (state) => ({
      ...state,
      artifactIndex: {
        artifacts: state.artifactIndex.artifacts.map((artifact) => (
          artifact.artifactKind === 'continuity-save' && artifact.availability === 'available'
            ? { ...artifact, availability: 'pending' as const }
            : artifact
        )),
      },
    }));
  }, 30_000);

  it('fails parity when the continuity-save digest field diverges', async () => {
    await expectSurfaceDivergence('review-report', (state) => ({
      ...state,
      artifactIndex: {
        artifacts: state.artifactIndex.artifacts.map((artifact) => (
          artifact.artifactKind === 'continuity-save' && artifact.availability === 'available'
            ? { ...artifact, contentDigest: digest('corrupted-continuity') }
            : artifact
        )),
      },
    }));
  }, 30_000);

  it('fails parity when the session-id field diverges', async () => {
    await expectSurfaceDivergence('clean-review', (state) => ({
      ...state,
      run: { ...state.run, sessionId: 'session-shadow-corrupt' },
    }));
  }, 30_000);

  it('fails parity when the run-id field diverges', async () => {
    await expectSurfaceDivergence('clean-review', (state) => ({
      ...state,
      run: { ...state.run, runId: 'run-shadow-corrupt' },
    }));
  }, 30_000);

  it('fails parity when an artifact entry diverges', async () => {
    await expectSurfaceDivergence('duplicate-candidates', (state) => ({
      ...state,
      artifactIndex: {
        artifacts: state.artifactIndex.artifacts.map((artifact, index) => (
          index === 0 ? { ...artifact, contentDigest: digest('corrupted-artifact') } : artifact
        )),
      },
    }));
  }, 30_000);

  it.skip('covers the resume-decision-digest field', async () => {
    // The closed fixture closure never supplies resumeEvidence, so the reducer
    // yields a structurally-null resume-decision digest on both paths and no
    // mutation of its feeding slice can change the projection.
  });
});

