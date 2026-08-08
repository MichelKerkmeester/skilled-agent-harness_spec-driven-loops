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
    }, {
      targetRefs: ['target:src/review.ts'],
      evidenceRefs: ['evidence-1'],
      claimTextDigest: digest('candidate-claim'),
      findingClass: 'correctness-defect',
      impact: 0.5,
      rawConfidence: 0.8,
      rawCandidateScore: 0.7,
      actionability: 0.8,
      reachability: 0.8,
      exploitability: 0.2,
      evidenceType: 'test',
      evidenceScope: 'direct',
      rawObservationDigest: digest('candidate-observation'),
      semanticFingerprint: semanticFingerprint('candidate'),
      sourcePassEventId: 'event-5',
    }),
    event('deep_review.evidence_observed', 7, {
      ...dimensionScope(), candidateId: 'candidate-1', evidenceId: 'evidence-1',
    }, {
      locator: {
        scheme: 'file',
        artifactRef: 'artifact:src/review.ts',
        locatorDigest: digest('locator'),
        selector: 'function:reviewCandidate',
        startLine: 20,
        endLine: 28,
        revision: 'revision-1',
      },
      observationKind: 'test-result',
      rawResultDigest: digest('test-result'),
      sourceDigest: digest('evidence-source'),
      contentDigest: digest('evidence-content'),
      toolFingerprint: digest('test-tool'),
      analyzerFingerprint: digest('test-analyzer'),
      independentEvidenceClass: 'independent-test',
      causalProximityStatus: 'direct',
      stabilityStatus: 'stable',
      relevanceStatus: 'relevant',
      supersedesEvidenceEventId: null,
    }),
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
    event('deep_review.convergence_evaluated', 11, iterationScope(), {
      rawSignals: convergenceSignals('raw'),
      weightedSignals: convergenceSignals('weighted'),
      dimensionCoverageDigest: digest('dimension-coverage'),
      protocolCoverageDigest: digest('protocol-coverage'),
      findingStability: 'stable',
      p0p1ResolutionState: 'resolved',
      evidenceDensity: 1,
      hotspotSaturation: 1,
      decision: 'converged',
      policyFingerprint: digest('convergence-policy'),
      blockerIds: [],
      stopCandidate: true,
    }),
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
    }, {
      targetPacket: 'system-deep-loop/target',
      continuityPayloadDigest: digest('continuity-payload'),
      sourceEventRange: { firstEventId: 'event-1', lastEventId: 'event-13' },
      route: 'implementation-summary',
      mergeMode: 'update-in-place',
    }),
    event('deep_review.continuity_save_completed', 15, {
      runId: RUN_ID, sessionId: SESSION_ID,
    }, {
      targetPacket: 'system-deep-loop/target',
      continuityPayloadDigest: digest('continuity-payload'),
      sourceEventRange: { firstEventId: 'event-1', lastEventId: 'event-14' },
      route: 'implementation-summary',
      mergeMode: 'update-in-place',
      persistenceReceiptRefs: ['continuity-receipt-1'],
      continuityFingerprint: digest('continuity-fingerprint'),
    }),
    event('deep_review.run_completed', 16, {
      runId: RUN_ID, sessionId: SESSION_ID,
    }, {
      terminalStatus: 'completed',
      convergenceEventId: 'event-11',
      synthesisEventId: 'event-12',
      reportEventId: 'event-13',
      continuityEventId: 'event-15',
      finalLedgerTailHash: digest('previous:16'),
      counts: { dimensions: 1, iterations: 1, candidates: 1, findings: 1, evidence: 1 },
      verdict: 'pass',
      completionReason: 'All required typed gates passed.',
      incompleteReason: null,
    }),
  ];
}

function scenarioSelection(scenario: DeepReviewParityFixtureScenario): Readonly<{
  events: readonly DeepReviewLedgerEvent[];
  terminal: DeepReviewTerminalDecision;
}> {
  const all = lifecycleEvents();
  switch (scenario) {
    case 'clean-review':
      return { events: all.slice(0, 5), terminal: 'active' };
    case 'multiple-dimensions':
      return { events: all.slice(0, 10), terminal: 'active' };
    case 'duplicate-candidates':
      return { events: all.slice(0, 7), terminal: 'active' };
    case 'finding-updates':
    case 'fixed-preexisting-findings':
      return { events: all.slice(0, 10), terminal: 'active' };
    case 'inconclusive-validation':
      return { events: all.slice(0, 8), terminal: 'active' };
    case 'converged':
      return { events: all.slice(0, 11), terminal: 'converged' };
    case 'resumed-run':
      return { events: all.slice(0, 5), terminal: 'active' };
    case 'deterministic-replay':
      return { events: all.slice(0, 11), terminal: 'converged' };
    case 'review-report':
      // Reaching a real run-completion event requires the events it cites by
      // id to be present (its evidence, convergence, synthesis, report, and
      // continuity references), so this compact fixture carries the smallest
      // event set that keeps the reducer's referential-integrity invariants
      // satisfied (dimension_pass_completed alone stands in for the pass; no
      // separate dimension_pass_started record is required for it).
      return {
        events: [
          all[0], all[4], all[5], all[6],
          all[10], all[11], all[12], all[14], all[15],
        ].map((entry, index, selected) => (
          Object.freeze({
            ...entry,
            stream_sequence: index + 1,
            causation_id: index === 0 ? null : selected[index - 1].event_id,
            idempotency_key: `compact-${index + 1}`,
          })
        )),
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
});
