// ───────────────────────────────────────────────────────────────────
// MODULE: Stopping Clocks Unit Tests
// ───────────────────────────────────────────────────────────────────

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
} from '../../lib/authorized-ledger/index.js';
import { createEmptyClaimRelationshipProjection } from '../../lib/contradiction-supersession/index.js';
import {
  BudgetReasonCodes,
  costBudget,
  iterationBudget,
  tokenBudget,
  wallTimeBudget,
} from '../../lib/hierarchical-budgets/index.js';
import {
  CYCLE_DETECTOR_POLICY_VERSION,
  CycleEvaluationStatuses,
  CycleProgressVerdicts,
  CycleSignatureKinds,
  createCycleHealthEventPayload,
  cycleStoppingClockInput,
} from '../../lib/cycle-detection/index.js';
import {
  MAX_JSON_NODES,
  canonicalBytes,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  MODE_COVERAGE_PROFILES,
  compileCoverageUniverse,
} from '../../lib/path-coverage-termination/index.js';
import {
  STOPPING_CLOCK_ADAPTER_VERSIONS,
  STOPPING_CLOCK_CAUSES,
  STOPPING_CLOCK_PROFILES,
  STOPPING_CLOCK_TERMINATION_CLASSES,
  STOPPING_CLOCK_TIE_RANK,
  arbitrateStoppingClocks,
  createStoppingClockEventRegistry,
  createStoppingClockPolicyRegistry,
  createStoppingClocksShadowResult,
  observeBudgetClock,
  observeCoverageClock,
  observeCycleClock,
  observeNoveltyDecayClock,
  observeWallTimeClock,
  prepareLoopTerminationDeclaredEvent,
  recordLoopTerminationDeclaredEvent,
  stoppingClockProfiles,
  stoppingClockWriteContext,
  validateLoopTerminationDeclared,
} from '../../lib/stopping-clocks/index.js';

import type {
  GatewayAllowProof,
  TransitionAuthorizationRequest,
} from '../../lib/authorized-ledger/index.js';
import type { CycleEvaluationResult } from '../../lib/cycle-detection/index.js';
import type { BudgetDecision, BudgetDimensionValue } from '../../lib/hierarchical-budgets/index.js';
import type {
  CoverageCertificate,
  CoverageUniverse,
} from '../../lib/path-coverage-termination/index.js';
import type {
  SemanticCommunityProjection,
  SemanticNoveltyResult,
} from '../../lib/semantic-communities/index.js';
import type {
  BudgetClockDimension,
  InFlightEvidenceLink,
  LoopTerminationDeclared,
  StoppingClockEvaluationBoundary,
  StoppingClockEvaluationContext,
  StoppingClockKind,
  StoppingClockObservation,
  StoppingClockObservationCore,
  StoppingClockProfile,
  StoppingClockState,
} from '../../lib/stopping-clocks/index.js';

const RUN_ID = 'run-stopping-clocks';
const LEDGER_ID = 'stopping-clocks-ledger';
const WATERMARK = 'projection-watermark-42';
const REPLAY_FINGERPRINT = digest({ replay: RUN_ID });
const PRICING_DIGEST = digest({ pricing: 'fixture-v1' });
const TIMESTAMP = '2026-07-21T12:00:00.000Z';
const PROFILE = stoppingClockProfiles.resolve('research', 'research-stopping-clocks@1');
const COVERAGE_NAMESPACE = Object.freeze({
  specFolder: 'specs/stopping-clock-fixture',
  sessionId: RUN_ID,
});
const temporaryRoots: string[] = [];

afterEach(() => {
  while (temporaryRoots.length > 0) {
    rmSync(temporaryRoots.pop() as string, { recursive: true, force: true });
  }
});

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function cursor(sequence: number) {
  return Object.freeze({
    ledger_id: LEDGER_ID,
    sequence,
    record_hash: digest({ sequence }),
  });
}

function context(
  boundary: StoppingClockEvaluationBoundary,
  effectiveElapsedMs: number,
  sequence: number,
  projectionWatermark = WATERMARK,
): StoppingClockEvaluationContext {
  return Object.freeze({
    runLineageId: RUN_ID,
    profileVersion: PROFILE.profile_version,
    evaluationBoundary: boundary,
    ledgerCursor: cursor(sequence),
    effectiveElapsedMs,
    projectionWatermark,
    replayFingerprint: REPLAY_FINGERPRINT,
  });
}

function budgetValue(
  dimension: BudgetClockDimension,
  amount: number,
): BudgetDimensionValue {
  switch (dimension) {
    case 'tokens':
      return tokenBudget(amount);
    case 'cost':
      return costBudget(amount, 'EUR', 2, PRICING_DIGEST);
    case 'iterations':
      return iterationBudget(amount);
    case 'wall_time':
      return wallTimeBudget(amount, PROFILE.hard_deadline_ms);
  }
}

function budgetDecision(
  fired: boolean,
  dimension: BudgetClockDimension,
): BudgetDecision {
  return Object.freeze({
    operation: 'admit',
    requestId: `budget-request-${dimension}`,
    scopeId: 'iteration-scope',
    status: fired ? 'denied' : 'granted',
    reasonCode: fired
      ? dimension === 'wall_time'
        ? BudgetReasonCodes.DEADLINE_EXHAUSTED
        : BudgetReasonCodes.BUDGET_EXHAUSTED
      : BudgetReasonCodes.ALLOWED,
    dispatchAllowed: !fired,
    reservationId: 'reservation-1',
    dispatchId: 'dispatch-1',
    incomplete: fired,
    converged: false,
    authority: 'shadow',
  });
}

function budgetObservation(
  fired: boolean,
  dimension: BudgetClockDimension = 'tokens',
  effectiveElapsedMs = 1_000,
  sequence = 20,
  governingScopeId = 'mode-scope',
): StoppingClockObservation {
  return observeBudgetClock({
    context: context('pre_dispatch', effectiveElapsedMs, sequence),
    decision: budgetDecision(fired, dimension),
    budgetPolicyVersion: 'hierarchical-budget-policy@1',
    sourceEventId: `budget-event-${dimension}`,
    scopePath: ['program-scope', 'mode-scope', 'lineage-scope', 'iteration-scope'],
    governingScopeId,
    exhaustedDimension: dimension,
    requested: budgetValue(dimension, 2),
    remaining: budgetValue(dimension, 1),
    reconciliationState: 'reconciled',
  }, PROFILE);
}

function semanticNovelty(
  iteration: number,
  isNovel: boolean,
): SemanticNoveltyResult {
  return Object.freeze({
    claim_id: `claim-${iteration}`,
    projection_version: `semantic-projection-${iteration}`,
    concept: isNovel ? 'new_community' : 'existing_community_member',
    evidence: isNovel ? 'new_evidence' : 'no_new_evidence',
    classifications: isNovel ? ['new-concept', 'new-evidence'] : ['paraphrase', 'duplicate-evidence'],
    concept_novelty_increment: isNovel ? 1 : 0,
    evidence_novelty_increment: isNovel ? 1 : 0,
    community_id: isNovel ? `community-${iteration}` : 'community-existing',
  });
}

function semanticProjection(): SemanticCommunityProjection {
  const claimId = 'coverage-claim-1';
  const communityId = 'coverage-community-1';
  return Object.freeze({
    schema_version: 'semantic-community-projection@1',
    namespace: {
      spec_folder: COVERAGE_NAMESPACE.specFolder,
      loop_type: 'research',
      session_id: COVERAGE_NAMESPACE.sessionId,
    },
    projection_version: 'semantic-projection@1',
    config_digest: digest({ config: 'coverage' }),
    claims: {
      [claimId]: {
        claim_id: claimId,
        raw_text: 'Coverage fixture claim',
        normalized_fingerprint: digest({ claimId }),
        evidence_links: ['ledger://coverage/evidence-1'],
        namespace: {
          spec_folder: COVERAGE_NAMESPACE.specFolder,
          loop_type: 'research',
          session_id: COVERAGE_NAMESPACE.sessionId,
        },
        coverage_node_name: claimId,
        coverage_node_content_hash: digest({ content: claimId }),
        coverage_node_iteration: 1,
        originating_ledger_event: {
          ledger_id: LEDGER_ID,
          sequence: 1,
          event_id: 'semantic-event-1',
          record_hash: digest({ semantic: 1 }),
        },
      },
    },
    edges: {},
    communities: {
      [communityId]: {
        community_id: communityId,
        representative_claim_id: claimId,
        member_claim_ids: [claimId],
        membership_version: 'membership-1',
        membership_version_hash: digest({ communityId, claimId }),
      },
    },
    memberships: {
      [claimId]: {
        claim_id: claimId,
        status: 'stable',
        community_id: communityId,
        candidate_community_ids: [],
        membership_version: 'membership-1',
      },
    },
    lineage: [],
    last_ledger_sequence: 1,
  });
}

function noveltySamples(
  fired: boolean,
  projectionWatermark = WATERMARK,
) {
  return Array.from({ length: 6 }, (_, index) => ({
    iteration: index + 1,
    ledgerSequence: index + 1,
    projectionWatermark: index === 5 ? projectionWatermark : `watermark-${index + 1}`,
    sourceEventId: `semantic-event-${index + 1}`,
    novelty: semanticNovelty(index + 1, !fired),
  }));
}

function noveltyObservation(
  fired: boolean,
  effectiveElapsedMs = 2_000,
  sequence = 30,
  projectionWatermark = WATERMARK,
): StoppingClockObservation {
  return observeNoveltyDecayClock({
    context: context('committed_iteration', effectiveElapsedMs, sequence, projectionWatermark),
    noveltyPolicyVersion: PROFILE.novelty_decay.policy_version,
    samples: noveltySamples(fired, projectionWatermark),
  }, PROFILE);
}

function coverageCertificate(
  decision: CoverageCertificate['decision'],
  universe = coverageUniverse(),
): CoverageCertificate {
  const complete = decision === 'STOP_ALLOWED';
  const core: Omit<CoverageCertificate, 'certificateHash'> = {
    schemaVersion: 'path-coverage-termination@1',
    decision,
    universeId: universe.universeId,
    universeVersion: universe.universeVersion,
    profileVersion: PROFILE.coverage_profile_version,
    mode: 'research',
    runId: RUN_ID,
    inputFingerprint: universe.inputFingerprint,
    replayFingerprint: REPLAY_FINGERPRINT,
    ledgerHead: {
      ledgerId: LEDGER_ID,
      sequence: 10,
      recordHash: digest({ coverage: 10 }),
    },
    communityProjectionVersion: universe.communityProjectionVersion,
    communityMembershipDigest: universe.communityMembershipDigest,
    relationshipProjectionVersion: universe.relationshipProjectionVersion,
    projectionFresh: true,
    denominator: universe.paths.length,
    closedPathCount: complete ? universe.paths.length : 0,
    addressedMajorRegions: complete
      ? new Set(universe.paths.map((path) => path.regionId)).size
      : 0,
    totalMajorRegions: new Set(universe.paths.map((path) => path.regionId)).size,
    unweightedCoverage: complete ? 1 : 0,
    weightedCoverage: complete ? 1 : 0,
    openPathIds: complete ? [] : universe.paths.map((path) => path.pathId),
    blockedPathIds: [],
    blockerIds: [],
    unresolvedContradictionIds: [],
    ambiguousMajorCommunityIds: [],
    exclusions: [],
    paths: universe.paths.map((path, pathIndex) => ({
      pathId: path.pathId,
      regionId: path.regionId,
      mandatory: path.mandatory,
      major: path.major,
      weight: path.weight,
      state: complete ? 'addressed' : 'active',
      requiredEvidenceClasses: path.requiredEvidenceClasses,
      evidence: complete ? path.requiredEvidenceClasses.map((evidenceClass, index) => ({
        kind: 'ledger-event' as const,
        evidenceClass,
        digest: digest({ pathId: path.pathId, evidenceClass }),
        ledgerId: LEDGER_ID,
        sequence: pathIndex + 1,
        eventId: `coverage-evidence-${pathIndex}-${index}`,
      })) : [],
      blockerIds: [],
      exclusion: null,
    })),
    semanticEvidenceGrowth: [],
    triggeredLimit: decision === 'INCOMPLETE_LIMIT'
      ? { kind: 'iteration', limitId: 'iteration-limit' }
      : null,
  };
  return Object.freeze({ ...core, certificateHash: digest(core) });
}

function coverageUniverse(version = 1): CoverageUniverse {
  const coverageProfile = MODE_COVERAGE_PROFILES.find((entry) => entry.mode === 'research');
  if (!coverageProfile) throw new Error('Research coverage profile is unavailable');
  const universe = compileCoverageUniverse({
    namespace: COVERAGE_NAMESPACE,
    runId: RUN_ID,
    mode: 'research',
    profileVersion: PROFILE.coverage_profile_version,
    inputFingerprint: digest({ input: RUN_ID }),
    dimensionValues: Object.fromEntries(coverageProfile.pathDimensions
      .filter((dimension) => dimension.source === 'declared')
      .map((dimension) => [dimension.dimensionId, [`${dimension.dimensionId}-fixture`]])),
    semanticCommunityProjection: semanticProjection(),
    relationshipProjection: createEmptyClaimRelationshipProjection(),
    ledgerHead: { ledgerId: LEDGER_ID, sequence: 10, recordHash: digest({ coverage: 10 }) },
    replayFingerprint: REPLAY_FINGERPRINT,
  });
  return version === 1
    ? universe
    : Object.freeze({
        ...universe,
        universeId: `${universe.universeId}-stale`,
        universeVersion: version,
        predecessorUniverseId: universe.universeId,
        invalidatesUniverseIds: [universe.universeId],
      });
}

function coverageObservation(
  fired: boolean,
  effectiveElapsedMs = 3_000,
  sequence = 40,
): StoppingClockObservation {
  const universe = coverageUniverse();
  return observeCoverageClock({
    context: context('committed_iteration', effectiveElapsedMs, sequence),
    certificate: coverageCertificate(fired ? 'STOP_ALLOWED' : 'CONTINUE', universe),
    activeUniverse: universe,
    sourceEventId: 'coverage-certificate-event',
  }, PROFILE);
}

function wallTimeObservation(
  fired: boolean,
  effectiveElapsedMs = fired ? PROFILE.hard_deadline_ms : 1_000,
  sequence = 50,
): StoppingClockObservation {
  return observeWallTimeClock({
    context: context('pre_dispatch', effectiveElapsedMs, sequence),
    monotonicClockVersion: 'monotonic-clock@1',
    previousElapsedMs: Math.max(0, effectiveElapsedMs - 1),
  }, PROFILE);
}

function cycleEvaluation(
  status: 'cycle_confirmed' | 'cycle_suspected' | 'cycle_cleared',
): CycleEvaluationResult {
  const progress = status === 'cycle_cleared';
  const traceEntries = Array.from({ length: 3 }, (_, index) => ({
    iteration: index + 1,
    ledger_cursor: cursor(index + 1),
    fingerprint: digest({ repeated: 'A' }),
  }));
  return {
    status,
    detectorPolicyVersion: CYCLE_DETECTOR_POLICY_VERSION,
    evidence: {
      run_lineage_id: RUN_ID,
      detector_policy_version: CYCLE_DETECTOR_POLICY_VERSION,
      signature_kind: CycleSignatureKinds.COMPOSITE_STATE,
      period: 1,
      occurrence_count: 3,
      start_iteration: 1,
      end_iteration: 3,
      start_cursor: cursor(1),
      end_cursor: cursor(3),
      source_fingerprints: [digest({ repeated: 'A' })],
      trace: traceEntries,
      progress_assessment: {
        gate_version: 'cycle-progress-gate-v1',
        verdict: progress ? CycleProgressVerdicts.PROGRESS : CycleProgressVerdicts.NO_PROGRESS,
        basis: [progress ? 'independent-evidence' : 'no-material-progress'],
        start_iteration: 1,
        end_iteration: 3,
        path_coverage_gain_bps: progress ? 100 : 0,
        community_coverage_gain_bps: 0,
      },
    },
  };
}

function cycleObservation(
  state: 'cycle_confirmed' | 'cycle_suspected' | 'cycle_cleared',
  effectiveElapsedMs = 4_000,
  sequence = 60,
): StoppingClockObservation {
  const healthEvent = createCycleHealthEventPayload(cycleEvaluation(state), RUN_ID);
  return observeCycleClock({
    context: context('committed_iteration', effectiveElapsedMs, sequence),
    healthEvent,
    clockInput: cycleStoppingClockInput(healthEvent),
    healthEventLedgerCursor: cursor(sequence - 1),
  }, PROFILE);
}

function armedObservations(): StoppingClockObservation[] {
  return [
    budgetObservation(false),
    noveltyObservation(false),
    coverageObservation(false),
    wallTimeObservation(false),
    cycleObservation('cycle_suspected'),
  ];
}

const IN_FLIGHT: readonly InFlightEvidenceLink[] = Object.freeze([{
  dispatch_receipt_id: 'dispatch-receipt-1',
  dispatch_id: 'dispatch-1',
  disposition: 'salvage',
  status: 'pending',
  evidence_event_ids: ['dispatch-receipt-event-1'],
}]);

function arbitrationForProfile(
  profile: StoppingClockProfile,
  observations: readonly StoppingClockObservation[],
  options: Readonly<{
    finalCoverageGaps?: readonly string[];
    unresolvedBlockers?: readonly string[];
    inFlightEvidence?: readonly InFlightEvidenceLink[];
  }> = {},
) {
  const coverageFired = observations.some((entry) => (
    entry.clock_kind === 'coverage' && entry.state === 'fired'
  ));
  return arbitrateStoppingClocks({
    profile,
    observations,
    authorizedLedgerHead: cursor(100),
    projectionWatermark: WATERMARK,
    replayFingerprint: REPLAY_FINGERPRINT,
    finalCoverageGaps: options.finalCoverageGaps ?? (coverageFired ? [] : ['path-open']),
    unresolvedBlockers: options.unresolvedBlockers ?? (coverageFired ? [] : ['blocker-open']),
    lastAuthorizedWork: {
      iteration_id: 'iteration-9',
      dispatch_id: 'dispatch-1',
      dispatch_receipt_id: 'dispatch-receipt-1',
    },
    inFlightEvidence: options.inFlightEvidence ?? IN_FLIGHT,
  });
}

function arbitration(
  observations: readonly StoppingClockObservation[],
  options: Readonly<{
    finalCoverageGaps?: readonly string[];
    unresolvedBlockers?: readonly string[];
    inFlightEvidence?: readonly InFlightEvidenceLink[];
  }> = {},
) {
  return arbitrationForProfile(PROFILE, observations, options);
}

function sourcePolicyVersion(profile: StoppingClockProfile, kind: StoppingClockKind): string {
  switch (kind) {
    case 'budget':
      return profile.budget_policy_version;
    case 'novelty_decay':
      return profile.novelty_decay.policy_version;
    case 'coverage':
      return profile.coverage_profile_version;
    case 'wall_time':
      return profile.monotonic_clock_version;
    case 'cycle':
      return profile.cycle.detector_policy_version;
  }
}

function profileObservation(
  profile: StoppingClockProfile,
  kind: StoppingClockKind,
  state: StoppingClockState,
  effectiveElapsedMs: number,
  sequence: number,
  projectionWatermark = WATERMARK,
): StoppingClockObservation {
  const binding = profile.adapters.find((entry) => entry.clock_kind === kind);
  if (!binding) throw new Error(`Missing ${kind} adapter in ${profile.profile_version}`);
  const ledgerCursor = cursor(sequence);
  const inputFingerprint = digest({
    profile_version: profile.profile_version,
    kind,
    state,
    effective_elapsed_ms: effectiveElapsedMs,
    sequence,
    projection_watermark: projectionWatermark,
  });
  const core: StoppingClockObservationCore = {
    schema_version: 1,
    run_lineage_id: RUN_ID,
    clock_kind: kind,
    adapter_version: STOPPING_CLOCK_ADAPTER_VERSIONS[kind],
    source_policy_version: sourcePolicyVersion(profile, kind),
    profile_version: profile.profile_version,
    evaluation_boundary: binding.evaluation_boundaries[0],
    ledger_cursor: ledgerCursor,
    effective_elapsed_ms: effectiveElapsedMs,
    projection_watermark: projectionWatermark,
    replay_fingerprint: REPLAY_FINGERPRINT,
    input_fingerprint: inputFingerprint,
    state,
    cause: STOPPING_CLOCK_CAUSES[kind][0],
    termination_class: STOPPING_CLOCK_TERMINATION_CLASSES[kind],
    source_event_ids: kind === 'wall_time' ? [] : [`${profile.mode}-${kind}-event`],
    condition_trace: [{
      condition: 'profile_matrix_fixture',
      passed: state === 'fired',
      observed: state,
      expected: 'fired',
    }],
    detail: { fixture: 'profile-matrix' },
  };
  const identity = {
    run_lineage_id: core.run_lineage_id,
    clock_kind: core.clock_kind,
    profile_version: core.profile_version,
    evaluation_boundary: core.evaluation_boundary,
    ledger_cursor: core.ledger_cursor,
    input_fingerprint: core.input_fingerprint,
  };
  return Object.freeze({
    ...core,
    observation_id: `stopping-clock-observation-${digest(identity)}`,
    observation_hash: digest(core),
  });
}

function profileArmedObservations(profile: StoppingClockProfile): StoppingClockObservation[] {
  return profile.required_clocks.map((kind, index) => (
    profileObservation(profile, kind, 'armed', 1_000 + index, 20 + index)
  ));
}

function eventFrom(result: ReturnType<typeof arbitration>): LoopTerminationDeclared {
  if (result.status !== 'termination_declared') {
    throw new Error(`Expected termination event, received ${result.status}`);
  }
  return result.event;
}

function allClockTie(): StoppingClockObservation[] {
  const elapsed = PROFILE.hard_deadline_ms;
  const sequence = 70;
  return [
    coverageObservation(true, elapsed, sequence),
    cycleObservation('cycle_confirmed', elapsed, sequence),
    noveltyObservation(true, elapsed, sequence),
    wallTimeObservation(true, elapsed, sequence),
    budgetObservation(true, 'tokens', elapsed, sequence),
  ];
}

describe('independent typed stopping-clock adapters', () => {
  it.each(['tokens', 'cost', 'iterations', 'wall_time'] as const)(
    'preserves the exact budget dimension for %s exhaustion',
    (dimension) => {
      for (const governingScopeId of [
        'program-scope',
        'mode-scope',
        'lineage-scope',
        'iteration-scope',
      ]) {
        const observed = budgetObservation(true, dimension, 1_000, 20, governingScopeId);
        expect(observed.state).toBe('fired');
        expect(observed.cause).toBe(`budget_exhausted:${dimension}`);
        expect(observed.termination_class).toBe('incomplete');
        expect(observed.detail).toMatchObject({
          governing_scope_id: governingScopeId,
          exhausted_dimension: dimension,
        });
      }
    },
  );

  it('fires novelty only after both replay-stable tails satisfy patience', () => {
    const fired = noveltyObservation(true);
    const churn = noveltyObservation(false);
    expect(fired.state).toBe('fired');
    expect(fired.termination_class).toBe('diminishing_returns');
    expect(churn.state).toBe('armed');
    expect(fired.detail.tail).toHaveLength(PROFILE.novelty_decay.observation_window);
  });

  it('keeps an incomplete novelty window armed and rejects duplicate source evidence', () => {
    const samples = noveltySamples(true);
    const incomplete = observeNoveltyDecayClock({
      context: context('committed_iteration', 2_000, 30),
      noveltyPolicyVersion: PROFILE.novelty_decay.policy_version,
      samples: samples.slice(1),
    }, PROFILE);
    const duplicated = observeNoveltyDecayClock({
      context: context('committed_iteration', 2_000, 30),
      noveltyPolicyVersion: PROFILE.novelty_decay.policy_version,
      samples: samples.map((sample, index) => (
        index === 5 ? { ...sample, sourceEventId: samples[4].sourceEventId } : sample
      )),
    }, PROFILE);
    const stale = observeNoveltyDecayClock({
      context: context('committed_iteration', 2_000, 30),
      noveltyPolicyVersion: PROFILE.novelty_decay.policy_version,
      samples: samples.map((sample, index) => (
        index === 5 ? { ...sample, projectionWatermark: 'stale-watermark' } : sample
      )),
    }, PROFILE);
    expect(incomplete.state).toBe('armed');
    expect(duplicated.state).toBe('not_evaluable');
    expect(stale.state).toBe('not_evaluable');
  });

  it('requires a current zero-gap STOP_ALLOWED coverage certificate', () => {
    const complete = coverageObservation(true);
    const partial = observeCoverageClock({
      context: context('committed_iteration', 3_000, 40),
      certificate: coverageCertificate('INCOMPLETE_LIMIT'),
      activeUniverse: coverageUniverse(),
      sourceEventId: 'coverage-limit-event',
    }, PROFILE);
    const blocked = observeCoverageClock({
      context: context('committed_iteration', 3_000, 40),
      certificate: coverageCertificate('STOP_BLOCKED'),
      activeUniverse: coverageUniverse(),
      sourceEventId: 'coverage-blocked-event',
    }, PROFILE);
    const stale = observeCoverageClock({
      context: context('committed_iteration', 3_000, 40),
      certificate: coverageCertificate('STOP_ALLOWED'),
      activeUniverse: coverageUniverse(2),
      sourceEventId: 'coverage-stale-event',
    }, PROFILE);
    expect(complete).toMatchObject({ state: 'fired', termination_class: 'converged' });
    expect(partial.state).toBe('armed');
    expect(blocked.state).toBe('armed');
    expect(stale.state).toBe('not_evaluable');
  });

  it('does not accept aggregate coverage fields without a closed certificate path set', () => {
    const universe = coverageUniverse();
    const valid = coverageCertificate('STOP_ALLOWED', universe);
    const { certificateHash: ignoredHash, ...validCore } = valid;
    const scoreOnlyCore: Omit<CoverageCertificate, 'certificateHash'> = {
      ...validCore,
      paths: validCore.paths.map((path, index) => (
        index === 0 ? { ...path, state: 'active' as const, evidence: [] } : path
      )),
    };
    const observation = observeCoverageClock({
      context: context('committed_iteration', 3_000, 40),
      certificate: {
        ...scoreOnlyCore,
        certificateHash: digest(scoreOnlyCore),
      },
      activeUniverse: universe,
      sourceEventId: 'coverage-score-only-event',
    }, PROFILE);
    expect(observation.state).toBe('armed');
  });

  it('keeps hard wall time independent from budgeted wall-time exhaustion', () => {
    const elapsed = PROFILE.hard_deadline_ms;
    const result = arbitration([
      budgetObservation(true, 'wall_time', elapsed, 70),
      noveltyObservation(false, elapsed, 70),
      coverageObservation(false, elapsed, 70),
      wallTimeObservation(true, elapsed, 70),
      cycleObservation('cycle_suspected', elapsed, 70),
    ]);
    const event = eventFrom(result);
    expect(event.primary_cause.cause).toBe('budget_exhausted:wall_time');
    expect(event.co_firing_causes.map((entry) => entry.cause)).toContain('wall_time_deadline');
  });

  it('fires cycle only from fresh confirmed detector evidence', () => {
    const confirmed = cycleObservation('cycle_confirmed');
    const suspected = cycleObservation('cycle_suspected');
    const cleared = cycleObservation('cycle_cleared');
    const healthEvent = createCycleHealthEventPayload(
      cycleEvaluation(CycleEvaluationStatuses.CYCLE_CONFIRMED),
      RUN_ID,
    );
    const stale = observeCycleClock({
      context: context('committed_iteration', 4_000, 60),
      healthEvent,
      clockInput: cycleStoppingClockInput(healthEvent),
      healthEventLedgerCursor: cursor(57),
    }, PROFILE);
    const progressEvaluation = cycleEvaluation(CycleEvaluationStatuses.CYCLE_CONFIRMED);
    if (!('evidence' in progressEvaluation)) throw new Error('Expected cycle evidence fixture');
    const progressHealthEvent = createCycleHealthEventPayload({
      ...progressEvaluation,
      evidence: {
        ...progressEvaluation.evidence,
        progress_assessment: {
          ...progressEvaluation.evidence.progress_assessment,
          verdict: CycleProgressVerdicts.PROGRESS,
          basis: ['independent-evidence'],
          path_coverage_gain_bps: 100,
        },
      },
    }, RUN_ID);
    const progressBroken = observeCycleClock({
      context: context('committed_iteration', 4_000, 60),
      healthEvent: progressHealthEvent,
      clockInput: cycleStoppingClockInput(progressHealthEvent),
      healthEventLedgerCursor: cursor(59),
    }, PROFILE);
    expect(confirmed).toMatchObject({ state: 'fired', termination_class: 'cycle_detected' });
    expect(suspected.state).toBe('armed');
    expect(cleared.state).toBe('cleared');
    expect(progressBroken.state).toBe('armed');
    expect(stale.state).toBe('not_evaluable');
    expect(cycleStoppingClockInput(healthEvent).stop_decision).toBeNull();
  });

  it('rejects a forged confirmed-cycle payload even when its handoff matches', () => {
    const healthEvent = createCycleHealthEventPayload(
      cycleEvaluation(CycleEvaluationStatuses.CYCLE_CONFIRMED),
      RUN_ID,
    );
    const forged = Object.freeze({
      ...healthEvent,
      occurrence_count: healthEvent.occurrence_count + 1,
    });
    const observation = observeCycleClock({
      context: context('committed_iteration', 4_000, 60),
      healthEvent: forged,
      clockInput: cycleStoppingClockInput(forged),
      healthEventLedgerCursor: cursor(59),
    }, PROFILE);
    expect(observation.state).toBe('not_evaluable');
  });

  it('rejects unregistered budget and monotonic source versions', () => {
    const budget = observeBudgetClock({
      context: context('pre_dispatch', 1_000, 20),
      decision: budgetDecision(true, 'tokens'),
      budgetPolicyVersion: 'hierarchical-budget-policy@unknown',
      sourceEventId: 'budget-unknown-version',
      scopePath: ['program-scope', 'mode-scope'],
      governingScopeId: 'mode-scope',
      exhaustedDimension: 'tokens',
      requested: tokenBudget(2),
      remaining: tokenBudget(1),
      reconciliationState: 'reconciled',
    }, PROFILE);
    const wall = observeWallTimeClock({
      context: context('pre_dispatch', PROFILE.hard_deadline_ms, 20),
      monotonicClockVersion: 'monotonic-clock@unknown',
      previousElapsedMs: PROFILE.hard_deadline_ms - 1,
    }, PROFILE);
    expect(budget.state).toBe('not_evaluable');
    expect(wall.state).toBe('not_evaluable');
  });

  it('fails closed for unreconciled budget state and non-monotonic time', () => {
    const budget = observeBudgetClock({
      context: context('pre_dispatch', 1_000, 20),
      decision: budgetDecision(true, 'tokens'),
      budgetPolicyVersion: 'hierarchical-budget-policy@1',
      sourceEventId: 'budget-unreconciled',
      scopePath: ['program-scope', 'mode-scope'],
      governingScopeId: 'mode-scope',
      exhaustedDimension: 'tokens',
      requested: tokenBudget(2),
      remaining: tokenBudget(1),
      reconciliationState: 'unreconciled',
    }, PROFILE);
    const wall = observeWallTimeClock({
      context: context('pre_dispatch', 99, 20),
      monotonicClockVersion: 'monotonic-clock@1',
      previousElapsedMs: 100,
    }, PROFILE);
    expect(budget.state).toBe('not_evaluable');
    expect(wall.state).toBe('not_evaluable');
  });
});

describe('deterministic earliest-fire arbitration', () => {
  it('returns no_stop only when all five required clocks are evaluable and unfired', () => {
    const result = arbitration(armedObservations());
    expect(result).toMatchObject({ status: 'no_stop', admission: 'allow', authority: 'shadow' });
    expect(result.observations).toHaveLength(5);
  });

  it('chooses the smallest effective elapsed time regardless of adapter order', () => {
    const observations = [
      wallTimeObservation(true, PROFILE.hard_deadline_ms, 50),
      coverageObservation(true, 300, 40),
      budgetObservation(true, 'tokens', 500, 20),
      cycleObservation('cycle_confirmed', 200, 60),
      noveltyObservation(true, 100, 30),
    ];
    const forward = eventFrom(arbitration(observations));
    const reverse = eventFrom(arbitration([...observations].reverse()));
    expect(forward.primary_cause.clock_kind).toBe('novelty_decay');
    expect(reverse.primary_cause).toEqual(forward.primary_cause);
    expect(reverse.termination_event_hash).toBe(forward.termination_event_hash);
  });

  it('uses only the versioned rank for one all-clock boundary and retains every cause', () => {
    const event = eventFrom(arbitration(allClockTie()));
    expect(STOPPING_CLOCK_TIE_RANK).toEqual([
      'budget', 'wall_time', 'cycle', 'novelty_decay', 'coverage',
    ]);
    expect(event.primary_cause.clock_kind).toBe('budget');
    expect(event.co_firing_causes.map((entry) => entry.clock_kind)).toEqual([
      'wall_time', 'cycle', 'novelty_decay', 'coverage',
    ]);
    expect(event.comparator_trace).toHaveLength(5);
    expect(event.observations.filter((entry) => entry.state === 'fired')).toHaveLength(5);
  });

  it('orders equal elapsed times by committed cursor before applying tie rank', () => {
    const observations = armedObservations();
    observations[0] = budgetObservation(true, 'tokens', 1_000, 22);
    observations[4] = cycleObservation('cycle_confirmed', 1_000, 21);
    const event = eventFrom(arbitration(observations));
    expect(event.primary_cause.clock_kind).toBe('cycle');
    expect(event.primary_cause.ledger_cursor.sequence).toBe(21);
  });

  it('reproduces primary, co-causes, and event hash after resume and replay', () => {
    const original = eventFrom(arbitration(allClockTie()));
    const resumed = JSON.parse(JSON.stringify(allClockTie())) as StoppingClockObservation[];
    const replayed = eventFrom(arbitration(resumed));
    expect(replayed.primary_cause).toEqual(original.primary_cause);
    expect(replayed.co_firing_causes).toEqual(original.co_firing_causes);
    expect(replayed.termination_event_hash).toBe(original.termination_event_hash);
    expect(validateLoopTerminationDeclared(replayed)).toBe(true);
  });

  it('fails closed for a missing clock or mixed projection watermark', () => {
    const missing = arbitration(armedObservations().slice(0, 4));
    const mixed = armedObservations();
    mixed[4] = cycleObservation('cycle_suspected', 4_000, 60);
    const different = observeWallTimeClock({
      context: context('pre_dispatch', 1_000, 50, 'different-watermark'),
      monotonicClockVersion: 'monotonic-clock@1',
      previousElapsedMs: 999,
    }, PROFILE);
    mixed[3] = different;
    expect(missing).toMatchObject({ status: 'fail_closed', admission: 'reject_new_dispatch' });
    expect(mixed[4].state).toBe('armed');
    expect(arbitration(mixed)).toMatchObject({
      status: 'fail_closed',
      admission: 'reject_new_dispatch',
    });
  });

  it('fails closed when a fired coverage clock conflicts with reported gaps', () => {
    const observations = armedObservations();
    observations[2] = coverageObservation(true);
    const result = arbitration(observations, {
      finalCoverageGaps: ['forged-gap'],
      unresolvedBlockers: [],
    });
    expect(result.status).toBe('fail_closed');
    if (result.status === 'fail_closed') {
      expect(result.reasons).toContain('coverage_fired_with_unresolved_state');
    }
  });

  it('never relabels a primary termination class', () => {
    const cases = [
      [budgetObservation(true), 'incomplete'],
      [noveltyObservation(true), 'diminishing_returns'],
      [coverageObservation(true), 'converged'],
      [wallTimeObservation(true), 'incomplete'],
      [cycleObservation('cycle_confirmed'), 'cycle_detected'],
    ] as const;
    for (const [fired, expectedClass] of cases) {
      const observations = armedObservations().map((entry) => (
        entry.clock_kind === fired.clock_kind ? fired : entry
      ));
      expect(eventFrom(arbitration(observations)).termination_class).toBe(expectedClass);
    }
  });

  it('rejects new dispatch while retaining settle, salvage, and cancel evidence', () => {
    const inFlightEvidence: readonly InFlightEvidenceLink[] = [
      {
        dispatch_receipt_id: 'dispatch-receipt-cancel',
        dispatch_id: 'dispatch-cancel',
        disposition: 'cancel',
        status: 'cancelled',
        evidence_event_ids: ['cancel-event'],
      },
      {
        dispatch_receipt_id: 'dispatch-receipt-salvage',
        dispatch_id: 'dispatch-salvage',
        disposition: 'salvage',
        status: 'salvaged',
        evidence_event_ids: ['salvage-event'],
      },
      {
        dispatch_receipt_id: 'dispatch-receipt-settle',
        dispatch_id: 'dispatch-settle',
        disposition: 'settle',
        status: 'settled',
        evidence_event_ids: ['settle-event'],
      },
    ];
    const event = eventFrom(arbitration(allClockTie(), { inFlightEvidence }));
    expect(event.admission).toBe('reject_new_dispatch');
    expect(event.in_flight_evidence).toEqual(inFlightEvidence);
    expect(event.last_authorized_work.dispatch_receipt_id).toBe('dispatch-receipt-1');

    const budgetOnly = armedObservations();
    budgetOnly[0] = budgetObservation(true);
    const incomplete = eventFrom(arbitration(budgetOnly));
    expect(incomplete.final_coverage_gaps).toEqual(['path-open']);
    expect(incomplete.unresolved_blockers).toEqual(['blocker-open']);
  });
});

describe('supported mode profile matrix', () => {
  it.each(STOPPING_CLOCK_PROFILES)(
    '$mode preserves every clock, pair ordering, tie, resume, and fail-closed invariant',
    (profile) => {
      for (const kind of profile.required_clocks) {
        const observations = profileArmedObservations(profile);
        const index = profile.required_clocks.indexOf(kind);
        observations[index] = profileObservation(profile, kind, 'fired', 100, 50);
        const event = eventFrom(arbitrationForProfile(profile, observations));
        expect(event.primary_cause.clock_kind).toBe(kind);
        expect(event.termination_class).toBe(STOPPING_CLOCK_TERMINATION_CLASSES[kind]);
      }

      for (let leftIndex = 0; leftIndex < profile.required_clocks.length; leftIndex += 1) {
        for (
          let rightIndex = leftIndex + 1;
          rightIndex < profile.required_clocks.length;
          rightIndex += 1
        ) {
          const leftKind = profile.required_clocks[leftIndex];
          const rightKind = profile.required_clocks[rightIndex];
          const ordered = profileArmedObservations(profile);
          ordered[leftIndex] = profileObservation(profile, leftKind, 'fired', 200, 60);
          ordered[rightIndex] = profileObservation(profile, rightKind, 'fired', 100, 61);
          const forward = eventFrom(arbitrationForProfile(profile, ordered));
          const reverse = eventFrom(arbitrationForProfile(profile, [...ordered].reverse()));
          expect(forward.primary_cause.clock_kind).toBe(rightKind);
          expect(reverse.termination_event_hash).toBe(forward.termination_event_hash);

          const tied = profileArmedObservations(profile);
          tied[leftIndex] = profileObservation(profile, leftKind, 'fired', 300, 70);
          tied[rightIndex] = profileObservation(profile, rightKind, 'fired', 300, 70);
          const tieEvent = eventFrom(arbitrationForProfile(profile, tied));
          const expectedPrimary = [leftKind, rightKind].sort((left, right) => (
            STOPPING_CLOCK_TIE_RANK.indexOf(left)
              - STOPPING_CLOCK_TIE_RANK.indexOf(right)
          ))[0];
          expect(tieEvent.primary_cause.clock_kind).toBe(expectedPrimary);
          expect(tieEvent.co_firing_causes).toHaveLength(1);
        }
      }

      const allTied = profile.required_clocks.map((kind) => (
        profileObservation(profile, kind, 'fired', 400, 80)
      ));
      const original = eventFrom(arbitrationForProfile(profile, allTied));
      const resumed = JSON.parse(JSON.stringify(allTied)) as StoppingClockObservation[];
      const replayed = eventFrom(arbitrationForProfile(profile, resumed));
      expect(original.primary_cause.clock_kind).toBe('budget');
      expect(original.co_firing_causes).toHaveLength(4);
      expect(replayed.termination_event_hash).toBe(original.termination_event_hash);

      expect(arbitrationForProfile(profile, allTied.slice(0, 4)).status).toBe('fail_closed');
      const mixed = profileArmedObservations(profile);
      mixed[4] = profileObservation(
        profile,
        mixed[4].clock_kind,
        'armed',
        mixed[4].effective_elapsed_ms,
        mixed[4].ledger_cursor.sequence,
        'mixed-watermark',
      );
      expect(arbitrationForProfile(profile, mixed).status).toBe('fail_closed');
    },
  );
});

describe('ledger event and additive-dark bridge', () => {
  it('authorizes one terminal event, accepts exact retry, and rejects a conflict', async () => {
    const rootDirectory = mkdtempSync(join(tmpdir(), 'stopping-clock-ledger-'));
    temporaryRoots.push(rootDirectory);
    const authority = Object.freeze({ state: 'legacy_authoritative' as const, epoch: 1 });
    const registry = createStoppingClockEventRegistry();
    const policies = createStoppingClockPolicyRegistry();
    const ledger = new AppendOnlyLedger({
      rootDirectory,
      ledgerId: 'stopping-clock-domain',
      auditLedgerId: 'stopping-clock-audit',
      authorityProvider: () => authority,
    }, registry);
    const gateway = new TransitionAuthorizationGateway({
      rootDirectory,
      auditLedgerId: 'stopping-clock-audit',
      authorityProvider: () => authority,
    }, ledger, policies);
    const payload = eventFrom(arbitration(allClockTie()));
    const event = prepareLoopTerminationDeclaredEvent(payload, {
      streamId: 'stopping-clock-stream',
      streamSequence: 1,
      occurredAt: TIMESTAMP,
      recordedAt: TIMESTAMP,
      producer: { name: 'stopping-clock-tests', version: '1' },
      authorityEpoch: authority.epoch,
      correlationId: 'stopping-clock-correlation',
      causationId: null,
    }, registry);
    expect(event.canonicalBytes.length).toBeLessThan(MAX_JSON_NODES);
    const writeContext = stoppingClockWriteContext(payload, policies, 'stopping-clock-arbiter');
    const request: TransitionAuthorizationRequest = {
      requestId: `authorize-${event.canonicalDigest}`,
      mode: writeContext.mode,
      event,
      priorHead: await ledger.getVerifiedHead(),
      priorStateVersion: PROFILE.profile_version,
      priorStateFingerprint: digest({ state: 'shadow' }),
      actorId: writeContext.actorId,
      capabilityId: writeContext.capabilityId,
      authorityEpoch: authority.epoch,
      policy: writeContext.policy,
      evidenceDigest: writeContext.evidenceDigest,
    };
    const authorization = await gateway.authorize(request);
    expect(authorization.verdict).toBe('allow');
    if (authorization.verdict !== 'allow') {
      throw new Error(`Stopping-clock authorization denied: ${authorization.reasonCode}`);
    }
    const proof: GatewayAllowProof = authorization.proof;
    expect(await ledger.readVerifiedEvents()).toHaveLength(0);
    const appended = await recordLoopTerminationDeclaredEvent(ledger, event, proof);
    const retried = await recordLoopTerminationDeclaredEvent(ledger, event, proof);
    expect(appended.status).toBe('appended');
    expect(retried.status).toBe('idempotent');
    expect(retried.receipt.recordHash).toBe(appended.receipt.recordHash);
    expect(await ledger.readVerifiedEvents()).toHaveLength(1);

    const conflictingObservations = allClockTie();
    conflictingObservations[0] = coverageObservation(false, PROFILE.hard_deadline_ms, 70);
    const conflictPayload = eventFrom(arbitration(conflictingObservations));
    const conflict = prepareLoopTerminationDeclaredEvent(conflictPayload, {
      streamId: 'stopping-clock-stream',
      streamSequence: 1,
      occurredAt: TIMESTAMP,
      recordedAt: TIMESTAMP,
      producer: { name: 'stopping-clock-tests', version: '1' },
      authorityEpoch: authority.epoch,
      correlationId: 'stopping-clock-correlation',
      causationId: null,
    }, registry);
    await expect(recordLoopTerminationDeclaredEvent(ledger, conflict, proof)).rejects.toThrow(
      'conflicting payload bytes',
    );
  });

  it('preserves every supported profile and the legacy result by identity', () => {
    expect(STOPPING_CLOCK_PROFILES).toHaveLength(7);
    for (const profile of STOPPING_CLOCK_PROFILES) {
      expect(profile.required_clocks).toHaveLength(5);
      expect(profile.adapters.map((entry) => entry.clock_kind)).toEqual(profile.required_clocks);
      expect(profile.authority).toBe('shadow');
    }
    const authoritative = Object.freeze({
      decision: 'STOP_ALLOWED',
      trace: Object.freeze([{ condition: 'legacy', met: true }]),
      blockers: Object.freeze([]),
      score: 0.9,
      bridge_payload: Object.freeze({ graph_decision: 'STOP_ALLOWED' }),
    });
    const shadow = createStoppingClocksShadowResult(authoritative, arbitration(armedObservations()));
    expect(shadow.authoritative).toBe(authoritative);
    expect(shadow.authority).toBe('legacy-convergence');
    expect(shadow.stopping_clocks_shadow.authority).toBe('shadow');
  });

  it('rejects unknown or altered mode-profile versions', () => {
    expect(() => stoppingClockProfiles.resolve('research', 'research-stopping-clocks@2'))
      .toThrow('Unknown stopping-clock profile');
    const altered = {
      ...PROFILE,
      hard_deadline_ms: PROFILE.hard_deadline_ms + 1,
    } as StoppingClockProfile;
    expect(() => observeWallTimeClock({
      context: context('pre_dispatch', 1_000, 50),
      monotonicClockVersion: 'monotonic-clock@1',
      previousElapsedMs: 999,
    }, altered)).toThrow('Altered stopping-clock profile');
  });
});
