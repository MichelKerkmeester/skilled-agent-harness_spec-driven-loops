// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Shadow Parity Tests
// ───────────────────────────────────────────────────────────────────

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

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
  DEEP_ALIGNMENT_REQUIRED_FIXTURE_SCENARIOS,
  DEEP_ALIGNMENT_VOLATILITY_ALLOWLIST,
  canonicalizeDeepAlignmentEventStream,
  compareDeepAlignmentEventStreams,
  compileDeepAlignmentParityManifest,
  createDeepAlignmentModeGateInput,
  createDeepAlignmentParityCaseDefinition,
  createDeepAlignmentParityExecutors,
  deepAlignmentParityInitialStateDigest,
  parseDeepAlignmentParityReceipt,
  runDeepAlignmentParityCase,
} from '../../lib/deep-alignment-shadow-parity/index.js';
import { canonicalBytes, sha256Bytes } from '../../lib/event-envelope/index.js';
import {
  InitialArtifactKinds,
  SealedArtifactStore,
  bindVerifiedArtifactReferences,
  prepareArtifactSealedEvent,
  readVerifiedArtifactEvidence,
  recordArtifactEvent,
  sealedArtifactEventDefinitions,
} from '../../lib/sealed-reference-artifacts/index.js';
import { EventTypeRegistry } from '../../lib/event-envelope/index.js';
import { compileParityCaseManifest } from '../../lib/shadow-parity/index.js';

import type {
  AuthoritySnapshot,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
} from '../../lib/authorized-ledger/index.js';
import type {
  DeepAlignmentEventEnvelope,
  DeepAlignmentEventInput,
  DeepAlignmentEventStem,
  DeepAlignmentLedgerEvent,
  DeepAlignmentPayloadMap,
  DeepAlignmentReplayMetadata,
  DeepAlignmentScopeMap,
} from '../../lib/deep-alignment-ledger-schema/index.js';
import type {
  DeepAlignmentParityCaseRun,
  DeepAlignmentParityFaultKind,
  DeepAlignmentParityFixture,
  DeepAlignmentParityFixtureScenario,
} from '../../lib/deep-alignment-shadow-parity/index.js';
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
const TIMESTAMP = '2026-07-28T10:00:00.000Z';
const RUN_ID = 'alignment-shadow-run';
const SESSION_ID = 'alignment-shadow-session';
const AUTHORITY_EPOCH_ID = 'authority-epoch-1';
const STREAM_ID = 'deep-alignment-shadow-stream';
const AUTHORITY: AuthoritySnapshot = Object.freeze({ state: 'shadowing', epoch: 1 });
const roots: string[] = [];
const registry = createDeepAlignmentEventRegistry();

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
  const root = mkdtempSync(join(tmpdir(), `deep-alignment-parity-${label}-`));
  roots.push(root);
  return root;
}

function replayMetadata(): DeepAlignmentReplayMetadata {
  return {
    fingerprint_version: 1,
    final_digest: digest('deep-alignment-parity-replay'),
    replay_input_digests: {
      authority: digest('authority'),
      configuration: digest('configuration'),
      subject: digest('subject'),
      verifier: digest('verifier'),
    },
  };
}

function event<TStem extends DeepAlignmentEventStem>(
  stem: TStem,
  sequence: number,
  scope: DeepAlignmentScopeMap[TStem],
  data: DeepAlignmentPayloadMap[TStem],
): DeepAlignmentLedgerEvent {
  const input: DeepAlignmentEventInput<TStem> = {
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
    producer: { name: 'deep-alignment-parity-fixture', version: '1' },
    authorityEpoch: 1,
    correlationId: `transport-${digest(sequence).slice(0, 16)}`,
    causationId: sequence === 1 ? null : `event-${sequence - 1}`,
    idempotencyKey: `fixture-${sequence}`,
  };
  return prepareDeepAlignmentEvent(input, registry).envelope as DeepAlignmentEventEnvelope<TStem>;
}

function baseScope() {
  return { runId: RUN_ID, sessionId: SESSION_ID, authorityEpochId: AUTHORITY_EPOCH_ID };
}

function iterationScope() {
  return { ...baseScope(), generation: 1, iterationId: 'iteration-1' };
}

function laneScope() {
  return { ...iterationScope(), laneId: 'lane-schema' };
}

function convergenceSignals(label: string) {
  return {
    noveltyRatio: 0,
    coverageRatio: 1,
    findingStabilityRatio: 1,
    evidenceDensityRatio: 1,
    hotspotSaturationRatio: 1,
    observationDigest: digest(label),
  };
}

function lifecycleEvents(): DeepAlignmentLedgerEvent[] {
  return [
    event('deep_alignment.run_initialized', 1, { ...baseScope(), generation: 1 }, {
      target: {
        targetId: 'target-root',
        targetType: 'repository',
        artifactRef: 'artifact:repository',
        sourceDigest: digest('target-source'),
        contentDigest: digest('target-content'),
      },
      lineageMode: 'fresh',
      maxIterations: 4,
      convergencePolicyVersion: 'alignment-convergence@1',
      reviewModeContractDigest: digest('shared-review-loop-contract'),
      initialReleaseReadinessState: 'not-assessed',
    }),
    event('deep_alignment.authority_reference_bound', 2, baseScope(), {
      authorityId: 'authority-main',
      authorityCapsuleRef: 'authority-capsule-1',
      authoritySourceDigest: digest('authority-source'),
      compilerFingerprint: digest('authority-compiler'),
      profileDigest: digest('authority-profile'),
      ruleIrDigest: digest('rule-ir'),
      signatureDigest: digest('authority-signature'),
      expiresAt: '2027-07-28T10:00:00.000Z',
      rollbackRef: null,
    }),
    event('deep_alignment.authority_validation_recorded', 3, baseScope(), {
      authorityReferenceEventId: 'event-2',
      checks: {
        parse: 'pass', type: 'pass', capability: 'pass', ruleTests: 'pass',
        coverage: 'pass', expiry: 'pass', rollback: 'pass', signature: 'pass',
        mixAndMatch: 'pass', resultDigest: digest('authority-checks'),
      },
      authorityStatus: 'valid',
      validationReceiptRefs: ['receipt:authority'],
      validatorFingerprint: digest('authority-validator'),
      validationDigest: digest('authority-validation'),
      blockedReasonCode: null,
    }),
    event('deep_alignment.scope_resolved', 4, baseScope(), {
      targetSetDigest: digest('target-set'),
      scopeClass: 'targeted',
      selectedTargets: [{
        targetId: 'target-file', targetType: 'file', artifactRef: 'artifact:alignment.ts',
        sourceDigest: digest('alignment-source'), contentDigest: digest('alignment-content'),
      }],
      omittedHighRiskTargetRefs: [],
      discoveryMethodIds: ['changed-files'],
      scopeEvidenceRefs: ['evidence:scope'],
    }),
    event('deep_alignment.dimension_ordered', 5, baseScope(), {
      orderedDimensionIds: ['alignment'],
      riskRationale: 'Authority-backed alignment is the required dimension.',
      scopeEvidenceRefs: ['evidence:scope'],
      orderingPolicyVersion: 'dimension-order@1',
    }),
    event('deep_alignment.lane_plan_recorded', 6, laneScope(), {
      laneKind: 'schema', orderedRuleIds: ['rule-1'], ruleIrRef: 'rule-ir:1',
      ruleIrDigest: digest('rule-ir'), verifierPolicyVersion: 'verifier-policy@1',
      budgetRef: 'budget:lane', requiredEvidenceClasses: ['schema-witness'],
      planDigest: digest('lane-plan'),
    }),
    event('deep_alignment.lane_started', 7, laneScope(), {
      lanePlanEventId: 'event-6', subjectSnapshotRef: 'subject-snapshot-1',
      subjectSnapshotDigest: digest('subject-snapshot'),
      authorityValidationEventId: 'event-3',
      authorityValidationDigest: digest('authority-validation'), status: 'started',
    }),
    event('deep_alignment.subject_snapshot_bound', 8, {
      ...laneScope(), subjectId: 'subject-1',
    }, {
      subjectSnapshotRef: 'subject-snapshot-1', subjectType: 'file',
      subjectDigest: digest('subject-snapshot'), sourceVersionRef: 'source-version-1',
      capturedAt: TIMESTAMP, parentSnapshotRef: null, receiptRef: 'receipt:subject',
    }),
    event('deep_alignment.applicability_evaluated', 9, {
      ...laneScope(), subjectId: 'subject-1', ruleId: 'rule-1',
    }, {
      predicateRef: 'predicate:rule-1', predicateDigest: digest('predicate'),
      targetFactRefs: ['target-fact:language'], targetFactDigest: digest('target-facts'),
      result: 'applicable', evaluatorFingerprint: digest('applicability-evaluator'),
      authorityValidationEventId: 'event-3', decisionDigest: digest('applicability'),
      reasonCode: 'subject-matches-rule',
    }),
    event('deep_alignment.dimension_pass_started', 10, {
      ...iterationScope(), dimensionId: 'alignment',
    }, {
      passNumber: 1, targetRefs: ['target:subject-1'], filesReviewed: ['file:subject-1'],
      searchCoverageDigest: digest('pass-coverage'), passStatus: 'started',
      nextFocusRef: 'focus:rule-1',
    }),
    event('deep_alignment.observation_recorded', 11, {
      ...laneScope(), subjectId: 'subject-1', ruleId: 'rule-1', observationId: 'observation-1',
    }, {
      applicabilityDecisionId: 'event-9', subjectSnapshotRef: 'subject-snapshot-1',
      subjectSnapshotDigest: digest('subject-snapshot'), detectorFingerprint: digest('detector'),
      observationKind: 'schema', rawResultDigest: digest('raw-result'),
      sourceDigest: digest('subject-source'), contentDigest: digest('subject-content'),
      evidenceClass: 'schema-witness', freshness: 'fresh', causalRelevance: 'direct',
      locator: {
        scheme: 'file', artifactRef: 'artifact:subject-1',
        locatorDigest: digest('locator'), selector: 'symbol:subject', revision: 'revision-1',
      },
      receiptRefs: ['receipt:observation'],
    }),
    event('deep_alignment.applicability_coverage_recorded', 12, laneScope(), {
      authorityValidationEventId: 'event-3', subjectSnapshotDigest: digest('subject-snapshot'),
      declaredApplicabilityEdgeRefs: ['edge:rule-subject'], applicableRuleIds: ['rule-1'],
      notApplicableRuleIds: [], unresolvedRuleIds: [], untestedRuleIds: [],
      blockedRuleIds: [], coverageDigest: digest('applicability-coverage'),
    }),
    event('deep_alignment.dimension_pass_completed', 13, {
      ...iterationScope(), dimensionId: 'alignment',
    }, {
      passNumber: 1, targetRefs: ['target:subject-1'], filesReviewed: ['file:subject-1'],
      searchCoverageDigest: digest('pass-coverage'), passStatus: 'complete',
      rawFindingCounts: { candidates: 0, adjudicated: 0, p0: 0, p1: 0, p2: 0 },
      nextFocusRef: 'focus:convergence',
    }),
    event('deep_alignment.lane_completed', 14, laneScope(), {
      lanePlanEventId: 'event-6', subjectSnapshotRef: 'subject-snapshot-1',
      subjectSnapshotDigest: digest('subject-snapshot'), authorityValidationEventId: 'event-3',
      applicabilityDecisionRefs: ['event-9'], observationRefs: ['event-11'],
      verificationRefs: [], status: 'complete',
      counts: {
        applicable: 1, notApplicable: 0, unresolved: 0, untested: 0,
        blocked: 0, nonConformant: 0,
      },
      completionDigest: digest('lane-completion'), blockedReasonCode: null,
    }),
    event('deep_alignment.convergence_evaluated', 15, iterationScope(), {
      rawSignals: convergenceSignals('raw'), weightedSignals: convergenceSignals('weighted'),
      dimensionCoverageDigest: digest('dimension-coverage'),
      protocolCoverageDigest: digest('protocol-coverage'), findingStability: 'stable',
      p0p1ResolutionState: 'resolved', evidenceDensity: 1, hotspotSaturation: 1,
      decision: 'converged', policyFingerprint: digest('convergence-policy'),
      blockerIds: [], stopCandidate: true,
    }),
  ];
}

function fixture(scenario: DeepAlignmentParityFixtureScenario): DeepAlignmentParityFixture {
  const provisional: DeepAlignmentParityFixture = {
    fixtureId: `fixture-${scenario}`,
    scenario,
    frozenInput: {
      baseSha: BASE_SHA,
      runManifestDigest: digest({ scenario, manifest: 1 }),
      targetDigest: digest('target-content'),
      authorityCapsuleDigest: digest('authority-capsule'),
      authorityEpochId: AUTHORITY_EPOCH_ID,
      verifierFingerprint: digest('authority-validator'),
      laneConfigurationDigest: digest('lane-configuration'),
      reviewLoopContractVersion: 'shared-review-loop@1',
      executorCapabilityDigest: digest('executor-capabilities'),
      fixtureSeed: `seed-${scenario}`,
      initialStateDigest: digest('pending'),
      configurationDigest: digest({ mode: 'deep-alignment', comparator: 1 }),
      budgetLease: {
        leaseId: 'lease-1', runId: RUN_ID, sessionId: SESSION_ID, generation: 1,
        maxIterations: 4, remainingIterations: 3,
        deadlineAt: '2026-07-29T10:00:00.000Z',
      },
    },
    events: lifecycleEvents().slice(0, 9),
    expectedTerminalDecision: 'active',
    resumeEvidence: null,
  };
  return Object.freeze({
    ...provisional,
    frozenInput: Object.freeze({
      ...provisional.frozenInput,
      initialStateDigest: deepAlignmentParityInitialStateDigest(provisional),
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
    policyId: 'artifact-policy', policyVersion: 1, evaluatorVersion: '1',
    ruleIds: ['artifact-write'], evaluate: artifactPolicy,
  }]);
  const ledger = new AppendOnlyLedger({
    rootDirectory: join(rootDirectory, 'ledger'), ledgerId: 'alignment-parity-artifacts',
    auditLedgerId: 'alignment-parity-artifact-audit', authorityProvider: () => AUTHORITY,
    now: () => new Date(TIMESTAMP),
  }, artifactRegistry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory: join(rootDirectory, 'ledger'),
    auditLedgerId: 'alignment-parity-artifact-audit', authorityProvider: () => AUTHORITY,
    now: () => new Date(TIMESTAMP),
  }, ledger, policies);
  const store = new SealedArtifactStore({
    rootDirectory: join(rootDirectory, 'store'), now: () => new Date(TIMESTAMP),
  });
  const policy = policies.resolve('artifact-policy', 1);
  let index = 0;
  const nextMetadata = (label: string): ArtifactEventMetadata => {
    index += 1;
    return {
      eventId: `${label}-${index}`, streamId: 'artifact-stream', streamSequence: index,
      occurredAt: TIMESTAMP, recordedAt: TIMESTAMP,
      producer: { name: 'alignment-parity-tests', version: '1' }, authorityEpoch: 1,
      correlationId: `artifact-correlation-${index}`, causationId: null,
      idempotencyKey: `artifact-idempotency-${index}`,
    };
  };
  const recorder: ArtifactEventRecorder = {
    ledger,
    gateway,
    authorizationContext: (prepared): ArtifactAuthorizationContext => ({
      requestId: `artifact-request-${prepared.identity.eventId}`, mode: 'review',
      priorStateVersion: 'artifact-state@1', priorStateFingerprint: digest('artifact-state'),
      actorId: 'alignment-parity-test', capabilityId: 'artifact-write', authorityEpoch: 1,
      policy: {
        policyId: policy.policyId, policyVersion: policy.policyVersion,
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
    { mode: 'deep-alignment', source: 'frozen-fixture' },
    'fixture',
  );
  const configuration = await sealAndRecord(
    harness,
    InitialArtifactKinds.CONFIGURATION,
    { mode: 'deep-alignment', authority: 'legacy' },
    'configuration',
  );
  return { harness, referenceSet: bindVerifiedArtifactReferences([frozen, configuration]) };
}

function capsule(
  selected: DeepAlignmentParityFixture,
  referenceSet: ArtifactReferenceSet,
): ParityCaseCapsule {
  return {
    baseSha: selected.frozenInput.baseSha,
    baseDigest: digest({ baseSha: selected.frozenInput.baseSha }),
    initialStateDigest: selected.frozenInput.initialStateDigest,
    configurationDigest: selected.frozenInput.configurationDigest,
    canonicalizationVersions: {
      event: 'deep-alignment-event@1', comparator: 'deep-alignment-event-comparator@1',
    },
    artifactReferenceSet: referenceSet,
    timeoutMs: 30_000,
    terminationPolicy: 'deep-alignment-bounded-shadow',
  };
}

function targetedManifest(selected: DeepAlignmentParityFixture): ParityCaseManifest {
  const definition = createDeepAlignmentParityCaseDefinition(selected);
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

function caseRun(
  selected: DeepAlignmentParityFixture,
  sealed: SealedBoundary,
  fault?: Readonly<{
    path: 'ledger' | 'legacy';
    kind: DeepAlignmentParityFaultKind;
    eventIndex: number;
  }>,
): DeepAlignmentParityCaseRun {
  const boundary = {
    ledger: sealed.harness.ledger,
    store: sealed.harness.store,
    capsule: capsule(selected, sealed.referenceSet),
  };
  return {
    caseDefinition: createDeepAlignmentParityCaseDefinition(selected),
    legacyBoundary: boundary,
    ledgerBoundary: boundary,
    fixture: selected,
    executors: createDeepAlignmentParityExecutors(selected, fault),
    shadowRootDirectory: join(temporaryRoot(`execution-${selected.fixtureId}`), 'shadow'),
    protectedRoots: [join(temporaryRoot(`authority-${selected.fixtureId}`), 'legacy-live')],
    deterministicRuns: 2,
  };
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('Deep Alignment shadow parity', () => {
  it('honors closed volatility while identical semantics remain green', () => {
    const selected = fixture('report-handoff');
    const fingerprints = selected.events.map((entry) => digest(entry.payload.payloadDigest));
    const legacy = canonicalizeDeepAlignmentEventStream(selected.events, fingerprints);
    const independent = selected.events.map((entry, index) => Object.freeze({
      ...entry,
      event_id: `independent-${index}`,
      causation_id: index === 0 ? null : `independent-${index - 1}`,
      occurred_at: `2026-07-28T11:${String(index).padStart(2, '0')}:00.000Z`,
      recorded_at: `2026-07-28T12:${String(index).padStart(2, '0')}:00.000Z`,
      correlation_id: `transport-${digest(`independent-${index}`).slice(0, 16)}`,
    })) as DeepAlignmentLedgerEvent[];
    const ledger = canonicalizeDeepAlignmentEventStream(independent, fingerprints);
    expect(DEEP_ALIGNMENT_VOLATILITY_ALLOWLIST.map((entry) => entry.field)).toEqual([
      'occurred_at', 'recorded_at', 'correlation_id',
    ]);
    expect(compareDeepAlignmentEventStreams(selected.fixtureId, legacy, ledger)).toEqual([]);
  });

  it('pairs independent streams by logical identity and detects semantic drift', () => {
    const selected = fixture('deterministic-replay');
    const fingerprints = selected.events.map((entry) => digest(entry.payload.payloadDigest));
    const baseline = canonicalizeDeepAlignmentEventStream(selected.events, fingerprints);
    const independent = baseline.map((entry, index) => ({ ...entry, eventId: `other-${index}` }));
    expect(compareDeepAlignmentEventStreams(selected.fixtureId, baseline, independent)).toEqual([]);
    const changed = independent.map((entry, index) => (
      index === 8 ? { ...entry, stablePayloadDigest: digest('semantic-drift') } : entry
    ));
    expect(compareDeepAlignmentEventStreams(selected.fixtureId, baseline, changed).map(
      (entry) => entry.class,
    )).toContain('payload');
  });

  it('drives every divergence class through the real paired pipeline', async () => {
    const selected = fixture('deterministic-replay');
    const indexOf = (stem: DeepAlignmentEventStem): number => {
      const index = selected.events.findIndex((entry) => entry.payload.stem === stem);
      if (index < 0) throw new TypeError(`Fixture does not contain ${stem}`);
      return index;
    };
    const applicabilityIndex = indexOf('deep_alignment.applicability_evaluated');
    const faults = [
      ['drop-event', applicabilityIndex, 'missing'],
      ['reorder-event', indexOf('deep_alignment.subject_snapshot_bound'), 'reordered'],
      ['extra-event', applicabilityIndex, 'extra'],
      ['duplicate-event', applicabilityIndex, 'duplicated'],
      ['causal-link', applicabilityIndex, 'causal-link'],
      ['payload', applicabilityIndex, 'payload'],
      ['receipt', indexOf('deep_alignment.authority_validation_recorded'), 'receipt'],
      ['artifact', indexOf('deep_alignment.subject_snapshot_bound'), 'artifact'],
      ['terminal-decision', applicabilityIndex, 'terminal-decision'],
      ['projection', applicabilityIndex, 'projection'],
    ] as const;
    for (const [kind, eventIndex, expectedClass] of faults) {
      const sealed = await sealedBoundary();
      const outcome = await runDeepAlignmentParityCase({
        manifest: targetedManifest(selected),
        caseRun: caseRun(selected, sealed, { path: 'ledger', kind, eventIndex }),
      });
      expect(outcome.receipt.exitStatus).toBe('blocked');
      expect(
        outcome.receipt.diffDispositions.map((entry) => entry.class),
        JSON.stringify({ result: outcome.result, receipt: outcome.receipt }),
      ).toContain(
        expectedClass,
      );
    }
  }, 180_000);

  it('fails unexplained differences and exposes no laundering disposition', () => {
    const selected = fixture('applicability');
    const fingerprints = selected.events.map((entry) => digest(entry.payload.payloadDigest));
    const baseline = canonicalizeDeepAlignmentEventStream(selected.events, fingerprints);
    const changed = baseline.map((entry, index) => (
      index === 8 ? { ...entry, stablePayloadDigest: digest('changed-applicability') } : entry
    ));
    const diffs = compareDeepAlignmentEventStreams(selected.fixtureId, baseline, changed);
    expect(diffs).toHaveLength(1);
    expect(diffs[0]).toMatchObject({ class: 'payload', disposition: 'unexplained' });
    expect(JSON.stringify(diffs)).not.toContain('tolerated-non-semantic');
  });

  it('binds green receipts to the real certificate and trusted manifest', async () => {
    const selected = fixture('report-handoff');
    const sealed = await sealedBoundary();
    const manifest = targetedManifest(selected);
    const outcome = await runDeepAlignmentParityCase({
      manifest,
      caseRun: caseRun(selected, sealed),
    });
    expect(
      outcome.receipt.exitStatus,
      JSON.stringify({ result: outcome.result, receipt: outcome.receipt }),
    ).toBe('green');
    expect(outcome.receipt.parityCertificate).not.toBeNull();
    expect(parseDeepAlignmentParityReceipt(outcome.receipt, manifest).receiptDigest).toBe(
      outcome.receipt.receiptDigest,
    );
    const mismatched = compileParityCaseManifest({
      baseSha: OTHER_BASE_SHA,
      baselineRows: manifest.baselineRows,
      cases: manifest.cases,
    });
    expect(() => parseDeepAlignmentParityReceipt(outcome.receipt, mismatched)).toThrow();
    const tampered = {
      ...outcome.receipt,
      parityCertificate: {
        ...outcome.receipt.parityCertificate,
        manifest_digest: digest('tampered-manifest'),
      },
    };
    expect(() => parseDeepAlignmentParityReceipt(tampered, manifest)).toThrow();
  }, 30_000);

  it('uses a distinct legacy model and keeps the successor input non-authoritative', async () => {
    const selected = fixture('report-handoff');
    const executors = createDeepAlignmentParityExecutors(selected);
    expect(executors.legacy).not.toBe(executors.ledger);
    expect(executors.legacyOracleKind).toBe('independent-legacy-model');
    expect(executors.sharedReviewLoopContract).toBe('imported-phase-012-backbone');
    expect(executors.substrateImportsReal).toBe(true);
    const sealed = await sealedBoundary();
    const manifest = targetedManifest(selected);
    const outcome = await runDeepAlignmentParityCase({
      manifest,
      caseRun: caseRun(selected, sealed),
    });
    const gate = createDeepAlignmentModeGateInput({
      manifest,
      expectedFixtureIds: [selected.fixtureId],
      receipts: [outcome.receipt],
    });
    expect(gate).toMatchObject({
      exitStatus: 'pass', authorityState: 'legacy-authoritative',
      authorityMutation: false, rollbackReadinessAuthorized: false,
      cutoverAuthorized: false,
    });
  }, 30_000);

  it('compiles only the exact ten-scenario fixture closure', () => {
    const fixtures = DEEP_ALIGNMENT_REQUIRED_FIXTURE_SCENARIOS.map(fixture);
    const manifest = compileDeepAlignmentParityManifest({ baseSha: BASE_SHA, fixtures });
    expect(manifest.cases).toHaveLength(10);
    expect(() => compileDeepAlignmentParityManifest({
      baseSha: BASE_SHA,
      fixtures: fixtures.slice(1),
    })).toThrow(/complete ten-scenario fixture set/);
  });

  it('rejects open fixture and resume-evidence shapes before execution', async () => {
    const selected = fixture('fresh-run');
    const sealed = await sealedBoundary();
    const openFixture = { ...selected, undeclared: true } as DeepAlignmentParityFixture;
    await expect(runDeepAlignmentParityCase({
      manifest: targetedManifest(openFixture),
      caseRun: caseRun(openFixture, sealed),
    })).rejects.toThrow(/fixture must use the closed allowed-key set/);
  });
});
