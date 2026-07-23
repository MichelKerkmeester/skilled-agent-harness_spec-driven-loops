// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Reducer
// ───────────────────────────────────────────────────────────────────

import {
  DeepResearchEventStems,
  DeepResearchWireEventTypes,
  createDeepResearchEventRegistry,
  isDeepResearchEventStem,
} from '../deep-research-ledger-schema/index.js';
import {
  canonicalBytes,
  canonicalJson,
  readEvent,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  DeepResearchReducerError,
  assertDeepResearchLegacyProjection,
  assertDeepResearchProjectionState,
  immutableProjectionClone,
  isDeepFrozenProjection,
} from './deep-research-projection-schema.js';

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type {
  DeepResearchEventEnvelope,
  DeepResearchEventStem,
  DeepResearchLedgerEvent,
  DeepResearchLedgerPayload,
} from '../deep-research-ledger-schema/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type {
  ModeContract,
  ModeReducerSet,
  ModeReductionResult,
} from '../mode-contracts/index.js';
import type {
  DeepResearchArtifactRecord,
  DeepResearchClaimEvidenceProjection,
  DeepResearchClaimRecord,
  DeepResearchConvergenceProjection,
  DeepResearchEvidenceRecord,
  DeepResearchFoldOptions,
  DeepResearchFoldResult,
  DeepResearchGapObligation,
  DeepResearchIterationProjection,
  DeepResearchIterationRecord,
  DeepResearchLegacyProjection,
  DeepResearchModeStatus,
  DeepResearchPersistedField,
  DeepResearchProjectedResult,
  DeepResearchProjectionCheckpoint,
  DeepResearchProjectionFieldOwnership,
  DeepResearchProjectionState,
  DeepResearchRebuildReasonCode,
  DeepResearchResearchPlanProjection,
  DeepResearchRunProjection,
  DeepResearchSeenEvent,
  DeepResearchSourceRecord,
  DeepResearchStatusProjection,
  DeepResearchStatusTransition,
} from './deep-research-projection-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. PUBLIC CONTRACT CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION = 'deep-research-projection@1' as const;
export const DEEP_RESEARCH_REDUCER_VERSION = 'deep-research-reducer@1' as const;
export const DEEP_RESEARCH_PROJECTION_CODEC_VERSION = 'canonical-json@1' as const;
export const DEEP_RESEARCH_ORDERING_POLICY_VERSION = 'logical-stream-order@1' as const;
export const DEEP_RESEARCH_REDUCER_ID = 'deep-research:projection-fold' as const;

const eventRegistry = createDeepResearchEventRegistry();
const EMPTY_DIGEST = sha256Bytes(canonicalBytes([]));
type DeepResearchModeContractState = DeepResearchProjectionState & JsonObject;

const PERSISTED_FIELDS = Object.freeze([
  'schemaVersion',
  'reducerVersion',
  'codecVersion',
  'orderingPolicyVersion',
  'run',
  'researchPlan',
  'claimLedger',
  'iterations',
  'convergence',
  'artifactIndex',
  'status',
  'cursors',
  'seenEvents',
] as const satisfies readonly DeepResearchPersistedField[]);

type ProjectionPlane =
  | 'run'
  | 'researchPlan'
  | 'claimLedger'
  | 'iterations'
  | 'convergence'
  | 'artifactIndex'
  | 'status';

export const DEEP_RESEARCH_EVENT_ROUTING = Object.freeze({
  'deep_research.run_initialized': Object.freeze(['run', 'status']),
  'deep_research.run_resumed': Object.freeze(['run', 'status']),
  'deep_research.run_restarted': Object.freeze(['run', 'status']),
  'deep_research.question_registered': Object.freeze(['researchPlan', 'status']),
  'deep_research.branch_planned': Object.freeze(['researchPlan', 'status']),
  'deep_research.branch_selected': Object.freeze(['researchPlan', 'status']),
  'deep_research.iteration_started': Object.freeze(['iterations', 'status']),
  'deep_research.iteration_completed': Object.freeze([
    'iterations', 'artifactIndex', 'status',
  ]),
  'deep_research.source_captured': Object.freeze([
    'claimLedger', 'convergence', 'artifactIndex', 'status',
  ]),
  'deep_research.evidence_admission_decided': Object.freeze([
    'claimLedger', 'convergence', 'status',
  ]),
  'deep_research.claim_asserted': Object.freeze(['claimLedger', 'status']),
  'deep_research.claim_relation_recorded': Object.freeze(['claimLedger', 'status']),
  'deep_research.claim_superseded': Object.freeze(['claimLedger', 'status']),
  'deep_research.gap_detected': Object.freeze(['claimLedger', 'convergence', 'status']),
  'deep_research.next_focus_selected': Object.freeze(['researchPlan', 'status']),
  'deep_research.convergence_evaluated': Object.freeze(['convergence', 'status']),
  'deep_research.convergence_blocked': Object.freeze(['convergence', 'status']),
  'deep_research.synthesis_started': Object.freeze(['status']),
  'deep_research.synthesis_committed': Object.freeze(['artifactIndex', 'status']),
  'deep_research.memory_save_requested': Object.freeze(['artifactIndex']),
  'deep_research.memory_save_completed': Object.freeze(['artifactIndex']),
  'deep_research.memory_save_failed': Object.freeze(['artifactIndex', 'status']),
  'deep_research.run_completed': Object.freeze(['status']),
} as const satisfies Readonly<Record<DeepResearchEventStem, readonly ProjectionPlane[]>>);

function stemsForPlane(plane: ProjectionPlane): readonly DeepResearchEventStem[] {
  return Object.freeze(DeepResearchEventStems.filter((stem) => (
    DEEP_RESEARCH_EVENT_ROUTING[stem].includes(plane as never)
  )));
}

export const DEEP_RESEARCH_PROJECTION_FIELD_OWNERSHIP = Object.freeze([
  {
    field: 'schemaVersion', ownerReducerId: DEEP_RESEARCH_REDUCER_ID,
    inputStems: Object.freeze([]), foldAlgebra: 'constant', immutableOutput: true,
  },
  {
    field: 'reducerVersion', ownerReducerId: DEEP_RESEARCH_REDUCER_ID,
    inputStems: Object.freeze([]), foldAlgebra: 'constant', immutableOutput: true,
  },
  {
    field: 'codecVersion', ownerReducerId: DEEP_RESEARCH_REDUCER_ID,
    inputStems: Object.freeze([]), foldAlgebra: 'constant', immutableOutput: true,
  },
  {
    field: 'orderingPolicyVersion', ownerReducerId: DEEP_RESEARCH_REDUCER_ID,
    inputStems: Object.freeze([]), foldAlgebra: 'constant', immutableOutput: true,
  },
  {
    field: 'run', ownerReducerId: DEEP_RESEARCH_REDUCER_ID,
    inputStems: stemsForPlane('run'), foldAlgebra: 'insert-sorted-and-derive',
    immutableOutput: true,
  },
  {
    field: 'researchPlan', ownerReducerId: DEEP_RESEARCH_REDUCER_ID,
    inputStems: stemsForPlane('researchPlan'), foldAlgebra: 'insert-sorted-and-derive',
    immutableOutput: true,
  },
  {
    field: 'claimLedger', ownerReducerId: DEEP_RESEARCH_REDUCER_ID,
    inputStems: stemsForPlane('claimLedger'), foldAlgebra: 'insert-sorted-and-derive',
    immutableOutput: true,
  },
  {
    field: 'iterations', ownerReducerId: DEEP_RESEARCH_REDUCER_ID,
    inputStems: stemsForPlane('iterations'), foldAlgebra: 'insert-sorted-and-derive',
    immutableOutput: true,
  },
  {
    field: 'convergence', ownerReducerId: DEEP_RESEARCH_REDUCER_ID,
    inputStems: stemsForPlane('convergence'), foldAlgebra: 'insert-sorted-and-derive',
    immutableOutput: true,
  },
  {
    field: 'artifactIndex', ownerReducerId: DEEP_RESEARCH_REDUCER_ID,
    inputStems: stemsForPlane('artifactIndex'), foldAlgebra: 'insert-sorted-and-derive',
    immutableOutput: true,
  },
  {
    field: 'status', ownerReducerId: DEEP_RESEARCH_REDUCER_ID,
    inputStems: stemsForPlane('status'), foldAlgebra: 'insert-sorted-and-derive',
    immutableOutput: true,
  },
  {
    field: 'cursors', ownerReducerId: DEEP_RESEARCH_REDUCER_ID,
    inputStems: DeepResearchEventStems, foldAlgebra: 'insert-sorted-and-derive',
    immutableOutput: true,
  },
  {
    field: 'seenEvents', ownerReducerId: DEEP_RESEARCH_REDUCER_ID,
    inputStems: DeepResearchEventStems, foldAlgebra: 'insert-sorted', immutableOutput: true,
  },
] as const satisfies readonly DeepResearchProjectionFieldOwnership[]);

export const DEEP_RESEARCH_REDUCER_SET: ModeReducerSet<DeepResearchModeContractState> =
  Object.freeze({
    persistedFields: PERSISTED_FIELDS,
    definitions: Object.freeze([Object.freeze({
      reducerId: DEEP_RESEARCH_REDUCER_ID,
      reducerVersion: DEEP_RESEARCH_REDUCER_VERSION,
      stateVersion: DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION,
      ownedFields: PERSISTED_FIELDS,
      inputEventTypes: Object.freeze(
        DeepResearchEventStems.map((stem) => DeepResearchWireEventTypes[stem]),
      ),
      replaySource: 'verified-ledger-events-only',
      outputRule: 'immutable',
    })]),
  });

// ───────────────────────────────────────────────────────────────────
// 2. GENERAL HELPERS
// ───────────────────────────────────────────────────────────────────

function compareString(left: string, right: string): number {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function compareNumber(left: number, right: number): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function payloadFor<TStem extends DeepResearchEventStem>(
  event: DeepResearchLedgerEvent,
  stem: TStem,
): DeepResearchLedgerPayload<TStem> {
  if (event.payload.stem !== stem) {
    throw new DeepResearchReducerError(
      'event-not-deep-research',
      `Expected ${stem}, received ${event.payload.stem}`,
      'payload.stem',
    );
  }
  return event.payload as DeepResearchLedgerPayload<TStem>;
}

function eventDigest(event: DeepResearchLedgerEvent): string {
  return sha256Bytes(canonicalBytes(event));
}

function compareEvents(
  left: DeepResearchLedgerEvent,
  right: DeepResearchLedgerEvent,
): number {
  const run = compareString(left.payload.scope.runId, right.payload.scope.runId);
  if (run !== 0) return run;
  const lineage = compareString(left.payload.scope.lineageId, right.payload.scope.lineageId);
  if (lineage !== 0) return lineage;
  const sequence = compareNumber(left.stream_sequence, right.stream_sequence);
  if (sequence !== 0) return sequence;
  return compareString(left.event_id, right.event_id);
}

function sortStrings(values: readonly string[]): string[] {
  return [...new Set(values)].sort(compareString);
}

function assertNeverStem(stem: never): never {
  throw new DeepResearchReducerError(
    'event-not-deep-research',
    `Unhandled deep-research event stem: ${String(stem)}`,
    'payload.stem',
  );
}

function validateTypedEvent(event: DeepResearchLedgerEvent): DeepResearchLedgerEvent {
  try {
    const read = readEvent(canonicalBytes(event), eventRegistry);
    const effective = read.effective.envelope;
    const payload = effective.payload;
    if (!isDeepResearchEventStem(payload.stem)
      || effective.event_type !== DeepResearchWireEventTypes[payload.stem]) {
      throw new DeepResearchReducerError(
        'event-not-deep-research',
        'Verified event does not carry a registered deep-research stem',
        'event_type',
      );
    }
    return effective as DeepResearchLedgerEvent;
  } catch (error: unknown) {
    if (error instanceof DeepResearchReducerError) throw error;
    throw new DeepResearchReducerError(
      'event-schema-invalid',
      'Deep-research event failed the real typed-ledger registry',
      'event',
    );
  }
}

function typedEventFromVerified(verified: VerifiedLedgerEvent): DeepResearchLedgerEvent {
  const envelope = verified.event.effective.envelope;
  const payload = envelope.payload;
  if (!isDeepResearchEventStem(payload.stem)
    || envelope.event_type !== DeepResearchWireEventTypes[payload.stem]) {
    throw new DeepResearchReducerError(
      'event-not-deep-research',
      'Mode reducer received a verified event outside the deep-research union',
      'event_type',
    );
  }
  return validateTypedEvent(envelope as DeepResearchLedgerEvent);
}

function sameCanonical(left: unknown, right: unknown): boolean {
  return canonicalJson(left) === canonicalJson(right);
}

function asModeContractState(
  state: DeepResearchProjectionState,
): DeepResearchModeContractState {
  assertDeepResearchProjectionState(state);
  return state as DeepResearchModeContractState;
}

function topLevelChangedFields(
  before: DeepResearchProjectionState,
  after: DeepResearchProjectionState,
): DeepResearchPersistedField[] {
  return PERSISTED_FIELDS.filter((field) => !sameCanonical(before[field], after[field]));
}

// ───────────────────────────────────────────────────────────────────
// 3. INITIAL STATE
// ───────────────────────────────────────────────────────────────────

/** Create the immutable empty state accepted by the shared mode reducer contract. */
export function createDeepResearchProjectionState(): DeepResearchProjectionState {
  const state: DeepResearchProjectionState = {
    schemaVersion: DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION,
    reducerVersion: DEEP_RESEARCH_REDUCER_VERSION,
    codecVersion: DEEP_RESEARCH_PROJECTION_CODEC_VERSION,
    orderingPolicyVersion: DEEP_RESEARCH_ORDERING_POLICY_VERSION,
    run: {
      runId: null,
      lineageId: null,
      generation: 0,
      charterDigest: null,
      configDigest: null,
      executorFingerprint: null,
      replayFingerprint: null,
      maxIterations: 0,
      convergencePolicyVersion: null,
      initializationEventId: null,
    },
    researchPlan: {
      planDigest: EMPTY_DIGEST,
      questions: [],
      branches: [],
      focusObligations: [],
    },
    claimLedger: {
      sources: [],
      evidence: [],
      claims: [],
      supersessions: [],
      gapObligations: [],
      activeClaimVersionIds: [],
      contradictionClaimVersionIds: [],
    },
    iterations: { currentIteration: 0, records: [] },
    convergence: {
      evaluations: [],
      observedRevision: null,
      finalizedRevision: null,
      eligibility: 'INDETERMINATE',
      outcome: 'active',
      trustedEvidenceYield: 0,
      rawNewInfoRatio: 0,
      blockerIds: [],
    },
    artifactIndex: { artifacts: [] },
    status: { state: 'planned', terminal: false, provenance: [] },
    cursors: {
      researchPlan: 0,
      claimLedger: 0,
      iteration: 0,
      convergence: 0,
      artifactIndex: 0,
      status: 0,
    },
    seenEvents: [],
  };
  assertDeepResearchProjectionState(state);
  return immutableProjectionClone(state) as DeepResearchProjectionState;
}

// ───────────────────────────────────────────────────────────────────
// 4. RUN AND PLAN FOLDS
// ───────────────────────────────────────────────────────────────────

function assertRunIdentity(
  run: DeepResearchRunProjection,
  event: DeepResearchLedgerEvent,
): void {
  if (run.runId === null && event.payload.stem !== 'deep_research.run_initialized') {
    throw new DeepResearchReducerError(
      'run-not-initialized',
      'A run-initialized event must precede every projected deep-research event',
      'run',
    );
  }
  if (run.runId !== null && (
    run.runId !== event.payload.scope.runId
    || run.lineageId !== event.payload.scope.lineageId
  )) {
    throw new DeepResearchReducerError(
      'run-identity-conflict',
      'One projection cannot fold events from different run or lineage identities',
      'run',
    );
  }
}

function foldRun(
  run: DeepResearchRunProjection,
  event: DeepResearchLedgerEvent,
): DeepResearchRunProjection {
  switch (event.payload.stem) {
    case 'deep_research.run_initialized': {
      const payload = payloadFor(event, 'deep_research.run_initialized');
      if (run.initializationEventId !== null && run.initializationEventId !== event.event_id) {
        throw new DeepResearchReducerError(
          'duplicate-terminal-event',
          'A projection accepts exactly one run initialization event',
          'run.initializationEventId',
        );
      }
      return {
        runId: payload.scope.runId,
        lineageId: payload.scope.lineageId,
        generation: payload.data.generation,
        charterDigest: payload.data.charterDigest,
        configDigest: payload.data.configDigest,
        executorFingerprint: payload.data.executorFingerprint,
        replayFingerprint: payload.data.replayFingerprint,
        maxIterations: payload.data.maxIterations,
        convergencePolicyVersion: payload.data.convergencePolicyVersion,
        initializationEventId: event.event_id,
      };
    }
    case 'deep_research.run_resumed': {
      const payload = payloadFor(event, 'deep_research.run_resumed');
      return { ...run, generation: Math.max(run.generation, payload.data.generation) };
    }
    case 'deep_research.run_restarted': {
      const payload = payloadFor(event, 'deep_research.run_restarted');
      return { ...run, generation: Math.max(run.generation, payload.data.generation) };
    }
    default:
      return run;
  }
}

function foldQuestion(
  plan: DeepResearchResearchPlanProjection,
  event: DeepResearchEventEnvelope<'deep_research.question_registered'>,
): DeepResearchResearchPlanProjection {
  const payload = event.payload;
  const candidate = {
    questionId: payload.scope.questionId,
    normalizedQuestionDigest: payload.data.normalizedQuestionDigest,
    dependencyQuestionIds: sortStrings(payload.data.dependencyQuestionIds),
    requiredSourceClasses: sortStrings(payload.data.requiredSourceClasses),
    disconfirmingQueryRecipeIds: sortStrings(payload.data.disconfirmingQueryRecipeIds),
    budgetRef: payload.data.budgetRef,
    producerEventId: event.event_id,
  };
  const existing = plan.questions.find((entry) => entry.questionId === candidate.questionId);
  if (existing !== undefined && !sameCanonical(existing, candidate)) {
    throw new DeepResearchReducerError(
      'projection-field-invalid',
      'A question identity cannot resolve to two projected definitions',
      'researchPlan.questions',
    );
  }
  const questions = existing === undefined
    ? [...plan.questions, candidate]
    : [...plan.questions];
  questions.sort((left, right) => compareString(left.questionId, right.questionId));
  return { ...plan, questions };
}

function branchCore(candidate: DeepResearchResearchPlanProjection['branches'][number]): JsonObject {
  return {
    questionId: candidate.questionId,
    branchId: candidate.branchId,
    semanticClusterId: candidate.semanticClusterId,
    expectedYieldScoreVector: candidate.expectedYieldScoreVector,
    contradictionRisk: candidate.contradictionRisk,
    impact: candidate.impact,
    independenceGain: candidate.independenceGain,
    staleness: candidate.staleness,
    expectedCost: candidate.expectedCost,
    tieBreakKey: candidate.tieBreakKey,
    reservationRef: candidate.reservationRef,
  };
}

function foldBranch<TStem extends 'deep_research.branch_planned' | 'deep_research.branch_selected'>(
  plan: DeepResearchResearchPlanProjection,
  event: DeepResearchEventEnvelope<TStem>,
): DeepResearchResearchPlanProjection {
  const payload = event.payload;
  const isSelected = payload.stem === 'deep_research.branch_selected';
  const key = `${payload.scope.questionId}:${payload.scope.branchId}`;
  const candidate = {
    questionId: payload.scope.questionId,
    branchId: payload.scope.branchId,
    semanticClusterId: payload.data.semanticClusterId,
    expectedYieldScoreVector: payload.data.expectedYieldScoreVector,
    contradictionRisk: payload.data.contradictionRisk,
    impact: payload.data.impact,
    independenceGain: payload.data.independenceGain,
    staleness: payload.data.staleness,
    expectedCost: payload.data.expectedCost,
    tieBreakKey: payload.data.tieBreakKey,
    reservationRef: payload.data.reservationRef,
    lifecycle: isSelected ? 'selected' as const : 'planned' as const,
    plannedEventId: isSelected ? null : event.event_id,
    selectedEventId: isSelected ? event.event_id : null,
  };
  const existingIndex = plan.branches.findIndex(
    (entry) => `${entry.questionId}:${entry.branchId}` === key,
  );
  const branches = [...plan.branches];
  if (existingIndex === -1) {
    branches.push(candidate);
  } else {
    const existing = branches[existingIndex];
    if (!sameCanonical(branchCore(existing), branchCore(candidate))) {
      throw new DeepResearchReducerError(
        'projection-field-invalid',
        'A branch identity cannot resolve to conflicting plan data',
        'researchPlan.branches',
      );
    }
    branches[existingIndex] = {
      ...existing,
      lifecycle: existing.lifecycle === 'selected' || isSelected ? 'selected' : 'planned',
      plannedEventId: isSelected ? existing.plannedEventId : event.event_id,
      selectedEventId: isSelected ? event.event_id : existing.selectedEventId,
    };
  }
  branches.sort((left, right) => (
    compareString(left.questionId, right.questionId)
      || compareString(left.branchId, right.branchId)
  ));
  return { ...plan, branches };
}

function foldFocus(
  plan: DeepResearchResearchPlanProjection,
  event: DeepResearchEventEnvelope<'deep_research.next_focus_selected'>,
): DeepResearchResearchPlanProjection {
  const payload = event.payload;
  const candidate = {
    iteration: payload.scope.iteration,
    obligationId: payload.data.obligationId,
    selectionScoreVector: payload.data.selectionScoreVector,
    visitCooldown: payload.data.visitCooldown,
    policyVersion: payload.data.policyVersion,
    chosenBranchId: payload.data.chosenBranchId,
    chosenQuestionId: payload.data.chosenQuestionId,
    producerEventId: event.event_id,
  };
  const existing = plan.focusObligations.find(
    (entry) => entry.producerEventId === candidate.producerEventId,
  );
  const focusObligations = existing === undefined
    ? [...plan.focusObligations, candidate]
    : [...plan.focusObligations];
  focusObligations.sort((left, right) => (
    compareNumber(left.iteration, right.iteration)
      || compareString(left.obligationId, right.obligationId)
      || compareString(left.producerEventId, right.producerEventId)
  ));
  return { ...plan, focusObligations };
}

function refreshPlanDigest(
  plan: DeepResearchResearchPlanProjection,
): DeepResearchResearchPlanProjection {
  const dependencies = new Map(
    plan.questions.map((question) => [question.questionId, question.dependencyQuestionIds]),
  );
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (questionId: string): void => {
    if (visiting.has(questionId)) {
      throw new DeepResearchReducerError(
        'projection-field-invalid',
        'Research-plan question dependencies must remain acyclic',
        'researchPlan.questions.dependencyQuestionIds',
      );
    }
    if (visited.has(questionId)) return;
    visiting.add(questionId);
    for (const dependency of dependencies.get(questionId) ?? []) {
      if (dependencies.has(dependency)) visit(dependency);
    }
    visiting.delete(questionId);
    visited.add(questionId);
  };
  for (const questionId of dependencies.keys()) visit(questionId);
  const planDigest = sha256Bytes(canonicalBytes({
    questions: plan.questions,
    branches: plan.branches,
    focusObligations: plan.focusObligations,
  }));
  return { ...plan, planDigest };
}

// ───────────────────────────────────────────────────────────────────
// 5. CLAIM-EVIDENCE-CONTRADICTION FOLDS
// ───────────────────────────────────────────────────────────────────

function foldSource(
  ledger: DeepResearchClaimEvidenceProjection,
  event: DeepResearchEventEnvelope<'deep_research.source_captured'>,
): DeepResearchClaimEvidenceProjection {
  const payload = event.payload;
  const candidate: DeepResearchSourceRecord = {
    iteration: payload.scope.iteration,
    sourceVersionId: payload.scope.sourceVersionId,
    sourceIdentityDigest: payload.data.sourceIdentityDigest,
    locator: payload.data.locator,
    capturedAt: payload.data.capturedAt,
    contentDigest: payload.data.contentDigest,
    mediaType: payload.data.mediaType,
    retrievalReceiptRef: payload.data.retrievalReceiptRef,
    parentSourceVersionId: payload.data.parentSourceVersionId,
    instructionScanResult: payload.data.instructionScanResult,
    producerEventId: event.event_id,
  };
  const existing = ledger.sources.find(
    (entry) => entry.sourceVersionId === candidate.sourceVersionId,
  );
  if (existing !== undefined && !sameCanonical(existing, candidate)) {
    throw new DeepResearchReducerError(
      'source-version-conflict',
      'A source version identity cannot resolve to mutable content or locator data',
      'claimLedger.sources',
    );
  }
  const sources = existing === undefined ? [...ledger.sources, candidate] : [...ledger.sources];
  sources.sort((left, right) => compareString(left.sourceVersionId, right.sourceVersionId));
  return { ...ledger, sources };
}

function foldEvidence(
  ledger: DeepResearchClaimEvidenceProjection,
  event: DeepResearchEventEnvelope<'deep_research.evidence_admission_decided'>,
): DeepResearchClaimEvidenceProjection {
  const payload = event.payload;
  const candidate: DeepResearchEvidenceRecord = {
    iteration: payload.scope.iteration,
    sourceVersionId: payload.scope.sourceVersionId,
    evidenceId: payload.scope.evidenceId,
    disposition: payload.data.disposition,
    passageLocators: [...payload.data.passageLocators],
    atomicClaimRefs: sortStrings(payload.data.atomicClaimRefs),
    derivativeSourceGroup: payload.data.derivativeSourceGroup,
    admissionPolicyVersion: payload.data.admissionPolicyVersion,
    contaminationStatus: payload.data.contaminationStatus,
    reasonCode: payload.data.reasonCode,
    producerEventId: event.event_id,
  };
  const existing = ledger.evidence.find((entry) => entry.evidenceId === candidate.evidenceId);
  if (existing !== undefined && !sameCanonical(existing, candidate)) {
    throw new DeepResearchReducerError(
      'projection-field-invalid',
      'An evidence identity cannot resolve to conflicting admission judgments',
      'claimLedger.evidence',
    );
  }
  const evidence = existing === undefined
    ? [...ledger.evidence, candidate]
    : [...ledger.evidence];
  evidence.sort((left, right) => compareString(left.evidenceId, right.evidenceId));
  return { ...ledger, evidence };
}

function foldClaim(
  ledger: DeepResearchClaimEvidenceProjection,
  event: DeepResearchEventEnvelope<
    'deep_research.claim_asserted' | 'deep_research.claim_relation_recorded'
  >,
): DeepResearchClaimEvidenceProjection {
  const payload = event.payload;
  let candidate: DeepResearchClaimRecord;
  if (payload.stem === 'deep_research.claim_asserted') {
    const asserted = event as DeepResearchEventEnvelope<'deep_research.claim_asserted'>;
    candidate = {
      iteration: asserted.payload.scope.iteration,
      claimId: asserted.payload.data.claimId,
      claimVersionId: asserted.payload.scope.claimVersionId,
      normalizedClaimDigest: asserted.payload.data.normalizedClaimDigest,
      relatedClaimVersionId: null,
      relation: 'asserts',
      evidenceIds: sortStrings(asserted.payload.data.evidenceIds),
      independenceGroup: asserted.payload.data.independenceGroup,
      rawConfidence: asserted.payload.data.rawConfidence,
      claimStatus: asserted.payload.data.claimStatus,
      producerEventId: event.event_id,
    };
  } else {
    const related = event as DeepResearchEventEnvelope<'deep_research.claim_relation_recorded'>;
    candidate = {
      iteration: related.payload.scope.iteration,
      claimId: related.payload.data.claimId,
      claimVersionId: related.payload.scope.claimVersionId,
      normalizedClaimDigest: null,
      relatedClaimVersionId: related.payload.data.relatedClaimVersionId,
      relation: related.payload.data.relation,
      evidenceIds: sortStrings(related.payload.data.evidenceIds),
      independenceGroup: related.payload.data.independenceGroup,
      rawConfidence: related.payload.data.rawConfidence,
      claimStatus: related.payload.data.claimStatus,
      producerEventId: event.event_id,
    };
  }
  const existing = ledger.claims.find(
    (entry) => entry.claimVersionId === candidate.claimVersionId,
  );
  if (existing !== undefined && !sameCanonical(existing, candidate)) {
    throw new DeepResearchReducerError(
      'claim-version-conflict',
      'A claim version identity cannot resolve to conflicting claim or relation data',
      'claimLedger.claims',
    );
  }
  const claims = existing === undefined ? [...ledger.claims, candidate] : [...ledger.claims];
  claims.sort((left, right) => compareString(left.claimVersionId, right.claimVersionId));
  return { ...ledger, claims };
}

function foldSupersession(
  ledger: DeepResearchClaimEvidenceProjection,
  event: DeepResearchEventEnvelope<'deep_research.claim_superseded'>,
): DeepResearchClaimEvidenceProjection {
  const payload = event.payload;
  const candidate = {
    iteration: payload.scope.iteration,
    priorClaimVersionId: payload.data.priorClaimVersionId,
    successorClaimVersionId: payload.data.successorClaimVersionId,
    supersessionReason: payload.data.supersessionReason,
    effectiveAt: payload.data.effectiveAt,
    replacementEvidenceIds: sortStrings(payload.data.replacementEvidenceIds),
    invalidationScope: payload.data.invalidationScope,
    producerEventId: event.event_id,
  };
  const existing = ledger.supersessions.find(
    (entry) => entry.producerEventId === candidate.producerEventId,
  );
  const supersessions = existing === undefined
    ? [...ledger.supersessions, candidate]
    : [...ledger.supersessions];
  supersessions.sort((left, right) => (
    compareString(left.priorClaimVersionId, right.priorClaimVersionId)
      || compareString(left.successorClaimVersionId, right.successorClaimVersionId)
      || compareString(left.producerEventId, right.producerEventId)
  ));
  return { ...ledger, supersessions };
}

function foldGap(
  ledger: DeepResearchClaimEvidenceProjection,
  event: DeepResearchEventEnvelope<'deep_research.gap_detected'>,
): DeepResearchClaimEvidenceProjection {
  const payload = event.payload;
  const candidate: DeepResearchGapObligation = {
    iteration: payload.scope.iteration,
    obligationId: payload.data.obligationId,
    gapKind: payload.data.gapKind,
    affectedClaimIds: sortStrings(payload.data.affectedClaimIds),
    affectedQuestionIds: sortStrings(payload.data.affectedQuestionIds),
    criticality: payload.data.criticality,
    proposedQueryRecipeIds: sortStrings(payload.data.proposedQueryRecipeIds),
    producerEventId: event.event_id,
  };
  const existing = ledger.gapObligations.find(
    (entry) => entry.producerEventId === candidate.producerEventId,
  );
  const gapObligations = existing === undefined
    ? [...ledger.gapObligations, candidate]
    : [...ledger.gapObligations];
  gapObligations.sort((left, right) => (
    compareString(left.obligationId, right.obligationId)
      || compareString(left.producerEventId, right.producerEventId)
  ));
  return { ...ledger, gapObligations };
}

function refreshClaimLedger(
  ledger: DeepResearchClaimEvidenceProjection,
): DeepResearchClaimEvidenceProjection {
  const superseded = new Set(ledger.supersessions.map((entry) => entry.priorClaimVersionId));
  const activeClaimVersionIds = ledger.claims
    .map((entry) => entry.claimVersionId)
    .filter((claimVersionId) => !superseded.has(claimVersionId));
  const contradictionClaimVersionIds = ledger.claims
    .filter((entry) => entry.relation === 'contradicts')
    .flatMap((entry) => [entry.claimVersionId, entry.relatedClaimVersionId])
    .filter((entry): entry is string => entry !== null);
  return {
    ...ledger,
    activeClaimVersionIds: sortStrings(activeClaimVersionIds),
    contradictionClaimVersionIds: sortStrings(contradictionClaimVersionIds),
  };
}

// ───────────────────────────────────────────────────────────────────
// 6. ITERATION AND CONVERGENCE FOLDS
// ───────────────────────────────────────────────────────────────────

function emptyIteration(iteration: number): DeepResearchIterationRecord {
  return {
    iteration,
    lifecycle: 'planned',
    focusRef: null,
    stateTailDigest: null,
    strategyDigest: null,
    startedEventId: null,
    completedEventId: null,
    rawNewInfoRatio: null,
    trustedEvidenceYield: null,
    outputDigest: null,
    ruledOutApproachRefs: [],
    nextFocusCausationId: null,
  };
}

function foldIteration(
  projection: DeepResearchIterationProjection,
  event: DeepResearchEventEnvelope<
    'deep_research.iteration_started' | 'deep_research.iteration_completed'
  >,
): DeepResearchIterationProjection {
  const payload = event.payload;
  const index = projection.records.findIndex(
    (entry) => entry.iteration === payload.scope.iteration,
  );
  const records = [...projection.records];
  const existing = index === -1 ? emptyIteration(payload.scope.iteration) : records[index];
  let next: DeepResearchIterationRecord;
  if (payload.stem === 'deep_research.iteration_started') {
    const started = event as DeepResearchEventEnvelope<'deep_research.iteration_started'>;
    if (existing.startedEventId !== null && existing.startedEventId !== event.event_id) {
      throw new DeepResearchReducerError(
        'duplicate-terminal-event',
        'An iteration accepts exactly one started event',
        'iterations.records.startedEventId',
      );
    }
    next = {
      ...existing,
      lifecycle: existing.completedEventId === null ? 'started' : existing.lifecycle,
      focusRef: started.payload.data.focusRef,
      stateTailDigest: started.payload.data.stateTailDigest,
      strategyDigest: started.payload.data.strategyDigest,
      startedEventId: event.event_id,
    };
  } else {
    const completed = event as DeepResearchEventEnvelope<'deep_research.iteration_completed'>;
    if (existing.completedEventId !== null && existing.completedEventId !== event.event_id) {
      throw new DeepResearchReducerError(
        'duplicate-terminal-event',
        'An iteration accepts exactly one completion event',
        'iterations.records.completedEventId',
      );
    }
    next = {
      ...existing,
      lifecycle: completed.payload.data.status,
      completedEventId: event.event_id,
      rawNewInfoRatio: completed.payload.data.rawNewInfoRatio,
      trustedEvidenceYield: completed.payload.data.trustedEvidenceYield,
      outputDigest: completed.payload.data.outputDigest,
      ruledOutApproachRefs: sortStrings(completed.payload.data.ruledOutApproachRefs),
      nextFocusCausationId: completed.payload.data.nextFocusCausationId,
    };
  }
  if (index === -1) records.push(next);
  else records[index] = next;
  records.sort((left, right) => compareNumber(left.iteration, right.iteration));
  return {
    currentIteration: records.at(-1)?.iteration ?? 0,
    records,
  };
}

function foldConvergenceEvaluation(
  projection: DeepResearchConvergenceProjection,
  event: DeepResearchEventEnvelope<
    'deep_research.convergence_evaluated' | 'deep_research.convergence_blocked'
  >,
): DeepResearchConvergenceProjection {
  const payload = event.payload;
  const candidate = {
    iteration: payload.scope.iteration,
    streamId: event.stream_id,
    logicalSequence: event.stream_sequence,
    decision: payload.data.decision,
    rawSignals: payload.data.rawSignals,
    trustedSignals: payload.data.trustedSignals,
    qualityGateResults: payload.data.qualityGateResults,
    blockerIds: sortStrings(payload.data.blockerIds),
    policyFingerprint: payload.data.policyFingerprint,
    evaluatorFingerprint: payload.data.evaluatorFingerprint,
    evidenceTailHash: payload.data.evidenceTailHash,
    incompleteReason: payload.data.incompleteReason,
    recoveryReason: payload.data.recoveryReason,
    producerEventId: event.event_id,
  };
  const existing = projection.evaluations.find(
    (entry) => entry.producerEventId === candidate.producerEventId,
  );
  const evaluations = existing === undefined
    ? [...projection.evaluations, candidate]
    : [...projection.evaluations];
  evaluations.sort((left, right) => (
    compareNumber(left.iteration, right.iteration)
      || compareNumber(left.logicalSequence, right.logicalSequence)
      || compareString(left.producerEventId, right.producerEventId)
  ));
  return { ...projection, evaluations };
}

function hasQuarantinedEvidence(ledger: DeepResearchClaimEvidenceProjection): boolean {
  return ledger.sources.some((entry) => entry.instructionScanResult === 'flagged')
    || ledger.evidence.some((entry) => (
      entry.disposition === 'quarantine'
      || entry.contaminationStatus === 'contaminated'
      || entry.contaminationStatus === 'suspected'
    ));
}

function hasSupportedClaimEvidence(
  ledger: DeepResearchClaimEvidenceProjection,
  eligibleEvidenceIds: ReadonlySet<string>,
): boolean {
  const activeClaimIds = new Set(ledger.activeClaimVersionIds);
  return ledger.claims.some((claim) => (
    activeClaimIds.has(claim.claimVersionId)
    && claim.claimStatus === 'supported'
    && claim.evidenceIds.some((evidenceId) => eligibleEvidenceIds.has(evidenceId))
  ));
}

function hasTrustedClaimEvidence(ledger: DeepResearchClaimEvidenceProjection): boolean {
  const capturedSourceVersionIds = new Set(
    ledger.sources.map((entry) => entry.sourceVersionId),
  );
  const admittedEvidenceIds = new Set(ledger.evidence
    .filter((entry) => (
      entry.disposition === 'admit'
      && entry.contaminationStatus === 'clean'
      && capturedSourceVersionIds.has(entry.sourceVersionId)
    ))
    .map((entry) => entry.evidenceId));
  return hasSupportedClaimEvidence(ledger, admittedEvidenceIds);
}

function hasAdmittedClaimEvidence(ledger: DeepResearchClaimEvidenceProjection): boolean {
  const admittedEvidenceIds = new Set(ledger.evidence
    .filter((entry) => (
      entry.disposition === 'admit'
      && entry.contaminationStatus === 'clean'
    ))
    .map((entry) => entry.evidenceId));
  return hasSupportedClaimEvidence(ledger, admittedEvidenceIds);
}

function refreshConvergence(
  projection: DeepResearchConvergenceProjection,
  ledger: DeepResearchClaimEvidenceProjection,
  ownsEvaluationDecision: boolean,
): DeepResearchConvergenceProjection {
  const latest = projection.evaluations.at(-1);
  const hasTrustedEvidence = hasTrustedClaimEvidence(ledger);
  const quarantined = hasQuarantinedEvidence(ledger);
  if (latest === undefined) {
    return {
      ...projection,
      observedRevision: null,
      finalizedRevision: null,
      eligibility: 'INDETERMINATE',
      outcome: quarantined ? 'quarantined' : 'active',
      trustedEvidenceYield: 0,
      rawNewInfoRatio: 0,
      blockerIds: sortStrings(ledger.gapObligations.map((entry) => entry.obligationId)),
    };
  }
  const gates = latest.qualityGateResults;
  const areGatesPassing = gates.sourceDiversity === 'pass'
    && gates.contradictionResolution === 'pass'
    && gates.citationIntegrity === 'pass';
  const canStop = areGatesPassing && hasTrustedEvidence && !quarantined;
  const evaluatedEligibility = latest.decision === 'continue' || latest.decision === 'recover'
    ? 'CONTINUE' as const
    : (latest.decision === 'converged' || latest.decision === 'incomplete')
      && canStop
      ? 'STOP_ELIGIBLE' as const
      : 'INDETERMINATE' as const;
  const eligibility = ownsEvaluationDecision
    ? evaluatedEligibility
    : projection.eligibility;
  const outcome = quarantined
    ? 'quarantined' as const
    : (latest.decision === 'converged' || latest.decision === 'incomplete') && !canStop
      ? 'blocked' as const
      : latest.decision === 'converged'
      ? 'converged' as const
      : latest.decision === 'incomplete'
        ? 'incomplete' as const
        : latest.decision === 'blocked'
          ? 'blocked' as const
          : 'active' as const;
  const gapBlockers = ledger.gapObligations.map((entry) => entry.obligationId);
  return {
    ...projection,
    observedRevision: latest.evidenceTailHash,
    finalizedRevision: ownsEvaluationDecision
      ? evaluatedEligibility === 'STOP_ELIGIBLE' ? latest.evidenceTailHash : null
      : projection.finalizedRevision,
    eligibility,
    outcome,
    trustedEvidenceYield: hasTrustedEvidence ? latest.trustedSignals.evidenceYield : 0,
    rawNewInfoRatio: latest.rawSignals.newInfoRatio,
    blockerIds: sortStrings([...latest.blockerIds, ...gapBlockers]),
  };
}

// ───────────────────────────────────────────────────────────────────
// 7. ARTIFACT-INDEX FOLDS
// ───────────────────────────────────────────────────────────────────

function artifactId(kind: string, digest: string, sourceIdentity?: string): string {
  const identitySegment = sourceIdentity === undefined
    ? ''
    : `:${sha256Bytes(canonicalBytes(sourceIdentity))}`;
  return `${kind}${identitySegment}:${digest}`;
}

function insertArtifact(
  artifacts: readonly DeepResearchArtifactRecord[],
  candidate: DeepResearchArtifactRecord,
): DeepResearchArtifactRecord[] {
  const sameIdentity = artifacts.find((entry) => entry.artifactId === candidate.artifactId);
  if (sameIdentity !== undefined) {
    if (!sameCanonical(sameIdentity, candidate)) {
      throw new DeepResearchReducerError(
        'projection-field-invalid',
        'An artifact identity cannot resolve to conflicting provenance or validity data',
        'artifactIndex.artifacts',
      );
    }
    return [...artifacts];
  }
  const next = [...artifacts, candidate];
  next.sort((left, right) => (
    compareString(left.logicalArtifactId, right.logicalArtifactId)
      || compareArtifactOrder(left, right)
  ));
  return next;
}

function compareArtifactOrder(
  left: DeepResearchArtifactRecord,
  right: DeepResearchArtifactRecord,
): number {
  return compareNumber(left.iteration ?? 0, right.iteration ?? 0)
    || compareNumber(left.logicalSequence, right.logicalSequence)
    || compareString(left.producerEventId, right.producerEventId);
}

function refreshArtifactSupersession(
  artifacts: readonly DeepResearchArtifactRecord[],
  ledger: DeepResearchClaimEvidenceProjection,
): DeepResearchArtifactRecord[] {
  const refreshed = artifacts.map((entry) => {
    const sameLogical = artifacts
      .filter((candidate) => candidate.logicalArtifactId === entry.logicalArtifactId)
      .sort(compareArtifactOrder);
    const earlierIds = sameLogical
      .filter((candidate) => compareArtifactOrder(candidate, entry) < 0)
      .map((candidate) => candidate.artifactId);
    const laterIds = sameLogical
      .filter((candidate) => compareArtifactOrder(candidate, entry) > 0)
      .map((candidate) => candidate.artifactId);
    let parentIds: string[] = [];
    let childIds: string[] = [];
    if (entry.artifactKind === 'source-capture') {
      const sourceVersionId = entry.logicalArtifactId.slice('source:'.length);
      const source = ledger.sources.find(
        (candidate) => candidate.sourceVersionId === sourceVersionId,
      );
      if (source?.parentSourceVersionId !== null && source?.parentSourceVersionId !== undefined) {
        parentIds = artifacts
          .filter((candidate) => (
            candidate.logicalArtifactId === `source:${source.parentSourceVersionId}`
          ))
          .map((candidate) => candidate.artifactId);
      }
      const childVersions = new Set(ledger.sources
        .filter((candidate) => candidate.parentSourceVersionId === sourceVersionId)
        .map((candidate) => candidate.sourceVersionId));
      childIds = artifacts
        .filter((candidate) => (
          candidate.artifactKind === 'source-capture'
          && childVersions.has(candidate.logicalArtifactId.slice('source:'.length))
        ))
        .map((candidate) => candidate.artifactId);
    }
    const supersededByArtifactIds = sortStrings([...laterIds, ...childIds]);
    return {
      ...entry,
      validityState: supersededByArtifactIds.length > 0
        ? 'superseded' as const
        : entry.observedValidityState,
      supersedesArtifactIds: sortStrings([...earlierIds, ...parentIds]),
      supersededByArtifactIds,
    };
  });
  refreshed.sort((left, right) => (
    compareString(left.logicalArtifactId, right.logicalArtifactId)
      || compareArtifactOrder(left, right)
  ));
  return refreshed;
}

function artifactFromEvent(
  event: DeepResearchLedgerEvent,
): DeepResearchArtifactRecord | null {
  const scope = event.payload.scope;
  switch (event.payload.stem) {
    case 'deep_research.source_captured': {
      const payload = payloadFor(event, 'deep_research.source_captured');
      return {
        artifactId: artifactId(
          'source',
          payload.data.contentDigest,
          payload.scope.sourceVersionId,
        ),
        logicalArtifactId: `source:${payload.scope.sourceVersionId}`,
        artifactKind: 'source-capture',
        digest: payload.data.contentDigest,
        schemaVersion: 'deep-research-source@1',
        producerEventId: event.event_id,
        streamId: event.stream_id,
        logicalSequence: event.stream_sequence,
        runId: scope.runId,
        lineageId: scope.lineageId,
        iteration: payload.scope.iteration,
        branchId: null,
        receiptRefs: [payload.data.retrievalReceiptRef],
        observedValidityState: payload.data.instructionScanResult === 'flagged'
          ? 'invalid'
          : 'valid',
        validityState: payload.data.instructionScanResult === 'flagged' ? 'invalid' : 'valid',
        supersedesArtifactIds: [],
        supersededByArtifactIds: [],
      };
    }
    case 'deep_research.iteration_completed': {
      const payload = payloadFor(event, 'deep_research.iteration_completed');
      return {
        artifactId: artifactId('iteration-output', payload.data.outputDigest),
        logicalArtifactId: `iteration-output:${payload.scope.iteration}`,
        artifactKind: 'iteration-output',
        digest: payload.data.outputDigest,
        schemaVersion: 'deep-research-iteration-output@1',
        producerEventId: event.event_id,
        streamId: event.stream_id,
        logicalSequence: event.stream_sequence,
        runId: scope.runId,
        lineageId: scope.lineageId,
        iteration: payload.scope.iteration,
        branchId: null,
        receiptRefs: [],
        observedValidityState: 'pending',
        validityState: 'pending',
        supersedesArtifactIds: [],
        supersededByArtifactIds: [],
      };
    }
    case 'deep_research.synthesis_committed': {
      const payload = payloadFor(event, 'deep_research.synthesis_committed');
      return {
        artifactId: artifactId('research-report', payload.data.reportDigest),
        logicalArtifactId: `research-report:${payload.data.reportRevision}`,
        artifactKind: 'research-report',
        digest: payload.data.reportDigest,
        schemaVersion: 'deep-research-report@1',
        producerEventId: event.event_id,
        streamId: event.stream_id,
        logicalSequence: event.stream_sequence,
        runId: scope.runId,
        lineageId: scope.lineageId,
        iteration: null,
        branchId: null,
        receiptRefs: [payload.data.synthesisReceiptRef],
        observedValidityState: 'valid',
        validityState: 'valid',
        supersedesArtifactIds: [],
        supersededByArtifactIds: [],
      };
    }
    case 'deep_research.memory_save_requested': {
      const payload = payloadFor(event, 'deep_research.memory_save_requested');
      return {
        artifactId: artifactId('continuity-request', payload.data.continuityPayloadDigest),
        logicalArtifactId: `continuity:${payload.data.continuityPayloadDigest.slice(0, 32)}`,
        artifactKind: 'continuity-save',
        digest: payload.data.continuityPayloadDigest,
        schemaVersion: 'deep-research-continuity@1',
        producerEventId: event.event_id,
        streamId: event.stream_id,
        logicalSequence: event.stream_sequence,
        runId: scope.runId,
        lineageId: scope.lineageId,
        iteration: null,
        branchId: null,
        receiptRefs: [],
        observedValidityState: 'pending',
        validityState: 'pending',
        supersedesArtifactIds: [],
        supersededByArtifactIds: [],
      };
    }
    case 'deep_research.memory_save_completed': {
      const payload = payloadFor(event, 'deep_research.memory_save_completed');
      return {
        artifactId: artifactId('continuity', payload.data.continuityFingerprint),
        logicalArtifactId: `continuity:${payload.data.continuityPayloadDigest.slice(0, 32)}`,
        artifactKind: 'continuity-save',
        digest: payload.data.continuityFingerprint,
        schemaVersion: 'deep-research-continuity@1',
        producerEventId: event.event_id,
        streamId: event.stream_id,
        logicalSequence: event.stream_sequence,
        runId: scope.runId,
        lineageId: scope.lineageId,
        iteration: null,
        branchId: null,
        receiptRefs: sortStrings(payload.data.persistenceReceiptRefs),
        observedValidityState: payload.data.persistenceReceiptRefs.length > 0
          ? 'valid'
          : 'unknown',
        validityState: payload.data.persistenceReceiptRefs.length > 0 ? 'valid' : 'unknown',
        supersedesArtifactIds: [],
        supersededByArtifactIds: [],
      };
    }
    case 'deep_research.memory_save_failed': {
      const payload = payloadFor(event, 'deep_research.memory_save_failed');
      return {
        artifactId: artifactId('continuity-failed', payload.data.continuityPayloadDigest),
        logicalArtifactId: `continuity:${payload.data.continuityPayloadDigest.slice(0, 32)}`,
        artifactKind: 'continuity-save',
        digest: payload.data.continuityPayloadDigest,
        schemaVersion: 'deep-research-continuity@1',
        producerEventId: event.event_id,
        streamId: event.stream_id,
        logicalSequence: event.stream_sequence,
        runId: scope.runId,
        lineageId: scope.lineageId,
        iteration: null,
        branchId: null,
        receiptRefs: [],
        observedValidityState: 'invalid',
        validityState: 'invalid',
        supersedesArtifactIds: [],
        supersededByArtifactIds: [],
      };
    }
    case 'deep_research.run_initialized':
    case 'deep_research.run_resumed':
    case 'deep_research.run_restarted':
    case 'deep_research.question_registered':
    case 'deep_research.branch_planned':
    case 'deep_research.branch_selected':
    case 'deep_research.iteration_started':
    case 'deep_research.evidence_admission_decided':
    case 'deep_research.claim_asserted':
    case 'deep_research.claim_relation_recorded':
    case 'deep_research.claim_superseded':
    case 'deep_research.gap_detected':
    case 'deep_research.next_focus_selected':
    case 'deep_research.convergence_evaluated':
    case 'deep_research.convergence_blocked':
    case 'deep_research.synthesis_started':
    case 'deep_research.run_completed':
      return null;
  }
  return assertNeverStem((event as DeepResearchLedgerEvent).payload.stem as never);
}

// ───────────────────────────────────────────────────────────────────
// 8. STATUS FOLD
// ───────────────────────────────────────────────────────────────────

const TERMINAL_STATUS_STATES = Object.freeze([
  'converged',
  'incomplete',
  'failed',
] as const satisfies readonly DeepResearchModeStatus[]);

function hasCompletionTransition(
  projection: DeepResearchStatusProjection,
): boolean {
  return projection.provenance.some(
    (transition) => transition.producerStem === 'deep_research.run_completed',
  );
}

function statusTransitionForEvent(
  projection: DeepResearchStatusProjection,
  event: DeepResearchLedgerEvent,
  convergence: DeepResearchConvergenceProjection,
  artifactIndex: DeepResearchProjectionState['artifactIndex'],
): DeepResearchStatusTransition | null {
  const base = {
    producerEventId: event.event_id,
    producerStem: event.payload.stem,
    streamId: event.stream_id,
    logicalSequence: event.stream_sequence,
    transitionReason: null,
  };
  if ((projection.state === 'quarantined' || projection.terminal)
    && event.payload.stem !== 'deep_research.run_completed') {
    return null;
  }
  switch (event.payload.stem) {
    case 'deep_research.run_initialized':
      return { ...base, state: 'planned' };
    case 'deep_research.run_resumed':
    case 'deep_research.run_restarted':
    case 'deep_research.branch_selected':
    case 'deep_research.iteration_started':
      return { ...base, state: 'active' };
    case 'deep_research.iteration_completed': {
      const payload = payloadFor(event, 'deep_research.iteration_completed');
      if (payload.data.status === 'error') return { ...base, state: 'failed' };
      if (payload.data.status === 'stuck' || payload.data.status === 'timeout') {
        return { ...base, state: 'blocked' };
      }
      if (convergence.outcome === 'quarantined') {
        return { ...base, state: 'quarantined' };
      }
      return { ...base, state: 'awaiting-evidence' };
    }
    case 'deep_research.source_captured': {
      const payload = payloadFor(event, 'deep_research.source_captured');
      return payload.data.instructionScanResult === 'flagged'
        ? { ...base, state: 'quarantined' }
        : null;
    }
    case 'deep_research.evidence_admission_decided': {
      const payload = payloadFor(event, 'deep_research.evidence_admission_decided');
      return payload.data.disposition === 'quarantine'
        || payload.data.contaminationStatus === 'contaminated'
        || payload.data.contaminationStatus === 'suspected'
        ? { ...base, state: 'quarantined' }
        : null;
    }
    case 'deep_research.convergence_evaluated':
    case 'deep_research.convergence_blocked': {
      const payload = event.payload.stem === 'deep_research.convergence_evaluated'
        ? payloadFor(event, 'deep_research.convergence_evaluated')
        : payloadFor(event, 'deep_research.convergence_blocked');
      if (convergence.outcome === 'quarantined') {
        return { ...base, state: 'quarantined' };
      }
      if (payload.data.decision === 'converged') {
        if (convergence.outcome !== 'converged') return { ...base, state: 'blocked' };
        return hasValidCompletionArtifacts(artifactIndex)
          ? { ...base, state: 'converged' }
          : null;
      }
      if (payload.data.decision === 'incomplete') {
        return convergence.outcome === 'incomplete'
          ? {
            ...base,
            state: 'incomplete',
            transitionReason: payload.data.incompleteReason,
          }
          : { ...base, state: 'blocked' };
      }
      if (payload.data.decision === 'blocked') return { ...base, state: 'blocked' };
      return { ...base, state: 'active', transitionReason: payload.data.recoveryReason };
    }
    case 'deep_research.synthesis_started':
    case 'deep_research.synthesis_committed':
      return null;
    case 'deep_research.memory_save_failed': {
      const payload = payloadFor(event, 'deep_research.memory_save_failed');
      return { ...base, state: 'blocked', transitionReason: payload.data.failureReason };
    }
    case 'deep_research.run_completed': {
      const payload = payloadFor(event, 'deep_research.run_completed');
      if (payload.data.terminalStatus === 'completed') {
        return { ...base, state: 'converged', transitionReason: payload.data.completionReason };
      }
      if (payload.data.terminalStatus === 'incomplete') {
        return { ...base, state: 'incomplete', transitionReason: payload.data.incompleteReason };
      }
      return { ...base, state: 'blocked', transitionReason: payload.data.completionReason };
    }
    case 'deep_research.memory_save_requested':
    case 'deep_research.memory_save_completed':
    case 'deep_research.question_registered':
    case 'deep_research.branch_planned':
    case 'deep_research.claim_asserted':
    case 'deep_research.claim_relation_recorded':
    case 'deep_research.claim_superseded':
    case 'deep_research.gap_detected':
    case 'deep_research.next_focus_selected':
      return null;
  }
  return assertNeverStem((event as DeepResearchLedgerEvent).payload.stem as never);
}

const STATUS_TRANSITIONS = Object.freeze({
  planned: Object.freeze([
    'planned', 'active', 'blocked', 'quarantined', 'failed', 'incomplete',
  ]),
  active: Object.freeze([
    'active', 'awaiting-evidence', 'converged', 'incomplete', 'blocked',
    'quarantined', 'failed',
  ]),
  paused: Object.freeze(['paused', 'active', 'blocked', 'incomplete']),
  'awaiting-evidence': Object.freeze([
    'awaiting-evidence', 'active', 'converged', 'incomplete', 'blocked',
    'quarantined', 'failed',
  ]),
  quarantined: Object.freeze(['quarantined']),
  blocked: Object.freeze(['blocked', 'active', 'incomplete', 'failed']),
  failed: Object.freeze(['failed']),
  converged: Object.freeze(['converged']),
  incomplete: Object.freeze(['incomplete']),
} as const satisfies Readonly<Record<DeepResearchModeStatus, readonly DeepResearchModeStatus[]>>);

function refreshStatus(
  projection: DeepResearchStatusProjection,
  event: DeepResearchLedgerEvent,
  convergence: DeepResearchConvergenceProjection,
  artifactIndex: DeepResearchProjectionState['artifactIndex'],
): DeepResearchStatusProjection {
  const candidate = statusTransitionForEvent(
    projection,
    event,
    convergence,
    artifactIndex,
  );
  const provenance = candidate === null
    ? [...projection.provenance]
    : projection.provenance.some((entry) => entry.producerEventId === candidate.producerEventId)
      ? [...projection.provenance]
      : [...projection.provenance, candidate];
  return deriveStatusFromProvenance(provenance);
}

function deriveStatusFromProvenance(
  transitions: readonly DeepResearchStatusTransition[],
): DeepResearchStatusProjection {
  const provenance = [...transitions];
  provenance.sort((left, right) => (
    compareNumber(left.logicalSequence, right.logicalSequence)
      || compareString(left.producerEventId, right.producerEventId)
  ));
  let state: DeepResearchModeStatus = 'planned';
  for (const transition of provenance) {
    const allowed: readonly DeepResearchModeStatus[] = STATUS_TRANSITIONS[state];
    if (!allowed.includes(transition.state)) {
      throw new DeepResearchReducerError(
        'impossible-status-transition',
        `Status cannot transition from ${state} to ${transition.state}`,
        'status.provenance',
      );
    }
    state = transition.state;
  }
  return {
    state,
    terminal: TERMINAL_STATUS_STATES.includes(state as never)
      || provenance.some(
        (transition) => transition.producerStem === 'deep_research.run_completed',
      ),
    provenance,
  };
}

function assertProjectionCrossFieldConsistency(
  state: DeepResearchProjectionState,
): void {
  const derivedStatus = deriveStatusFromProvenance(state.status.provenance);
  if (!sameCanonical(derivedStatus, state.status)) {
    throw new DeepResearchReducerError(
      'impossible-status-transition',
      'Persisted status must match its ordered transition provenance',
      'status',
    );
  }
  if (state.status.state === 'converged'
    && state.convergence.eligibility !== 'STOP_ELIGIBLE') {
    throw new DeepResearchReducerError(
      'impossible-status-transition',
      'Converged status requires stop-eligible convergence',
      'status.state',
    );
  }
  if (state.status.state === 'converged'
    && !hasValidCompletionArtifacts(state.artifactIndex)) {
    throw new DeepResearchReducerError(
      'impossible-status-transition',
      'Converged status requires valid research-report and continuity-save artifacts',
      'status.state',
    );
  }
}

function hasValidCompletionArtifacts(
  artifactIndex: DeepResearchProjectionState['artifactIndex'],
): boolean {
  const hasReport = artifactIndex.artifacts.some((entry) => (
    entry.artifactKind === 'research-report' && entry.validityState === 'valid'
  ));
  const hasContinuitySave = artifactIndex.artifacts.some((entry) => (
    entry.artifactKind === 'continuity-save' && entry.validityState === 'valid'
  ));
  return hasReport && hasContinuitySave;
}

function assertRunCompletionReferences(
  state: DeepResearchProjectionState,
  event: DeepResearchEventEnvelope<'deep_research.run_completed'>,
): void {
  const completionReferences = [
    ['convergenceEventId', event.payload.data.convergenceEventId],
    ['synthesisEventId', event.payload.data.synthesisEventId],
    ['memorySaveEventId', event.payload.data.memorySaveEventId],
  ] as const;
  const missingReference = completionReferences.find(([, eventId]) => (
    !state.seenEvents.some((seenEvent) => seenEvent.eventId === eventId)
  ));
  if (missingReference !== undefined) {
    throw new DeepResearchReducerError(
      'impossible-status-transition',
      'Completion references must identify events present in the folded sequence',
      `status.${missingReference[0]}`,
    );
  }
  const wrongKindReference = [
    {
      field: 'convergenceEventId',
      matches: state.convergence.evaluations.some(
        (entry) => entry.producerEventId === event.payload.data.convergenceEventId,
      ),
    },
    {
      field: 'synthesisEventId',
      matches: state.artifactIndex.artifacts.some(
        (entry) => entry.producerEventId === event.payload.data.synthesisEventId
          && entry.artifactKind === 'research-report',
      ),
    },
    {
      field: 'memorySaveEventId',
      matches: state.artifactIndex.artifacts.some(
        (entry) => entry.producerEventId === event.payload.data.memorySaveEventId
          && entry.artifactKind === 'continuity-save',
      ),
    },
  ].find((reference) => !reference.matches);
  if (wrongKindReference !== undefined) {
    throw new DeepResearchReducerError(
      'impossible-status-transition',
      'Completion references must identify the required event families',
      `status.${wrongKindReference.field}`,
    );
  }
  if (event.payload.data.terminalStatus !== 'completed') return;
  const hasConvergence = state.convergence.evaluations.some(
    (entry) => entry.producerEventId === event.payload.data.convergenceEventId
      && entry.decision === 'converged',
  );
  const hasSynthesis = state.artifactIndex.artifacts.some(
    (entry) => entry.producerEventId === event.payload.data.synthesisEventId
      && entry.artifactKind === 'research-report'
      && entry.validityState === 'valid',
  );
  const hasMemorySave = state.artifactIndex.artifacts.some(
    (entry) => entry.producerEventId === event.payload.data.memorySaveEventId
      && entry.artifactKind === 'continuity-save'
      && entry.validityState === 'valid',
  );
  if (!hasConvergence
    || state.convergence.eligibility !== 'STOP_ELIGIBLE'
    || !hasSynthesis
    || !hasMemorySave) {
    throw new DeepResearchReducerError(
      'impossible-status-transition',
      'Completed runs require converged, committed-synthesis, and completed-memory evidence',
      'status',
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// 9. EVENT APPLICATION
// ───────────────────────────────────────────────────────────────────

function advanceCursors(
  state: DeepResearchProjectionState,
  event: DeepResearchLedgerEvent,
): DeepResearchProjectionState['cursors'] {
  const planes = DEEP_RESEARCH_EVENT_ROUTING[event.payload.stem];
  const sequence = event.stream_sequence;
  return {
    researchPlan: planes.includes('researchPlan' as never)
      ? Math.max(state.cursors.researchPlan, sequence)
      : state.cursors.researchPlan,
    claimLedger: planes.includes('claimLedger' as never)
      ? Math.max(state.cursors.claimLedger, sequence)
      : state.cursors.claimLedger,
    iteration: planes.includes('iterations' as never)
      ? Math.max(state.cursors.iteration, sequence)
      : state.cursors.iteration,
    convergence: planes.includes('convergence' as never)
      ? Math.max(state.cursors.convergence, sequence)
      : state.cursors.convergence,
    artifactIndex: planes.includes('artifactIndex' as never)
      ? Math.max(state.cursors.artifactIndex, sequence)
      : state.cursors.artifactIndex,
    status: planes.includes('status' as never)
      ? Math.max(state.cursors.status, sequence)
      : state.cursors.status,
  };
}

function appendSeenEvent(
  state: DeepResearchProjectionState,
  event: DeepResearchLedgerEvent,
): DeepResearchSeenEvent[] | null {
  const digest = eventDigest(event);
  const existing = state.seenEvents.find((entry) => entry.eventId === event.event_id);
  if (existing !== undefined) {
    if (existing.eventDigest !== digest) {
      throw new DeepResearchReducerError(
        'duplicate-event-conflict',
        'A persisted event identity cannot resolve to different canonical bytes',
        'seenEvents',
      );
    }
    return null;
  }
  const seenEvents = [...state.seenEvents, {
    eventId: event.event_id,
    eventDigest: digest,
    streamId: event.stream_id,
    streamSequence: event.stream_sequence,
  }];
  seenEvents.sort((left, right) => (
    compareNumber(left.streamSequence, right.streamSequence)
      || compareString(left.eventId, right.eventId)
  ));
  return seenEvents;
}

function applyEvent(
  state: DeepResearchProjectionState,
  event: DeepResearchLedgerEvent,
): DeepResearchProjectionState {
  const seenEvents = appendSeenEvent(state, event);
  if (seenEvents === null) return state;
  assertRunIdentity(state.run, event);
  if (hasCompletionTransition(state.status)) {
    throw new DeepResearchReducerError(
      'duplicate-terminal-event',
      'A run accepts no additional events after its completion event',
      'status.provenance',
    );
  }

  let run = foldRun(state.run, event);
  let researchPlan = state.researchPlan;
  let claimLedger = state.claimLedger;
  let iterations = state.iterations;
  let convergence = state.convergence;

  switch (event.payload.stem) {
    case 'deep_research.question_registered':
      researchPlan = foldQuestion(
        researchPlan,
        event as DeepResearchEventEnvelope<'deep_research.question_registered'>,
      );
      break;
    case 'deep_research.branch_planned':
      researchPlan = foldBranch(
        researchPlan,
        event as DeepResearchEventEnvelope<'deep_research.branch_planned'>,
      );
      break;
    case 'deep_research.branch_selected':
      researchPlan = foldBranch(
        researchPlan,
        event as DeepResearchEventEnvelope<'deep_research.branch_selected'>,
      );
      break;
    case 'deep_research.iteration_started':
    case 'deep_research.iteration_completed':
      iterations = foldIteration(
        iterations,
        event as DeepResearchEventEnvelope<
          'deep_research.iteration_started' | 'deep_research.iteration_completed'
        >,
      );
      break;
    case 'deep_research.source_captured':
      claimLedger = foldSource(
        claimLedger,
        event as DeepResearchEventEnvelope<'deep_research.source_captured'>,
      );
      break;
    case 'deep_research.evidence_admission_decided':
      claimLedger = foldEvidence(
        claimLedger,
        event as DeepResearchEventEnvelope<'deep_research.evidence_admission_decided'>,
      );
      break;
    case 'deep_research.claim_asserted':
    case 'deep_research.claim_relation_recorded':
      claimLedger = foldClaim(
        claimLedger,
        event as DeepResearchEventEnvelope<
          'deep_research.claim_asserted' | 'deep_research.claim_relation_recorded'
        >,
      );
      break;
    case 'deep_research.claim_superseded':
      claimLedger = foldSupersession(
        claimLedger,
        event as DeepResearchEventEnvelope<'deep_research.claim_superseded'>,
      );
      break;
    case 'deep_research.gap_detected':
      claimLedger = foldGap(
        claimLedger,
        event as DeepResearchEventEnvelope<'deep_research.gap_detected'>,
      );
      break;
    case 'deep_research.next_focus_selected':
      researchPlan = foldFocus(
        researchPlan,
        event as DeepResearchEventEnvelope<'deep_research.next_focus_selected'>,
      );
      break;
    case 'deep_research.convergence_evaluated':
    case 'deep_research.convergence_blocked':
      convergence = foldConvergenceEvaluation(
        convergence,
        event as DeepResearchEventEnvelope<
          'deep_research.convergence_evaluated' | 'deep_research.convergence_blocked'
        >,
      );
      break;
    case 'deep_research.run_initialized':
    case 'deep_research.run_resumed':
    case 'deep_research.run_restarted':
    case 'deep_research.synthesis_started':
    case 'deep_research.synthesis_committed':
    case 'deep_research.memory_save_requested':
    case 'deep_research.memory_save_completed':
    case 'deep_research.memory_save_failed':
    case 'deep_research.run_completed':
      break;
    default:
      return assertNeverStem((event as DeepResearchLedgerEvent).payload.stem as never);
  }

  researchPlan = refreshPlanDigest(researchPlan);
  claimLedger = refreshClaimLedger(claimLedger);
  const ownsEvaluationDecision = event.payload.stem === 'deep_research.convergence_evaluated'
    || event.payload.stem === 'deep_research.convergence_blocked';
  if (DEEP_RESEARCH_EVENT_ROUTING[event.payload.stem].includes('convergence' as never)) {
    convergence = refreshConvergence(
      convergence,
      claimLedger,
      ownsEvaluationDecision,
    );
  }
  if (ownsEvaluationDecision
    && event.payload.data.decision === 'converged'
    && convergence.eligibility !== 'STOP_ELIGIBLE'
    && convergence.outcome !== 'quarantined'
    && !hasAdmittedClaimEvidence(claimLedger)) {
    throw new DeepResearchReducerError(
      'impossible-status-transition',
      'Converged status requires admitted trusted evidence and passing quality gates',
      'convergence.eligibility',
    );
  }

  let artifacts = [...state.artifactIndex.artifacts];
  const candidateArtifact = artifactFromEvent(event);
  if (candidateArtifact !== null) artifacts = insertArtifact(artifacts, candidateArtifact);
  artifacts = refreshArtifactSupersession(artifacts, claimLedger);

  const interim: DeepResearchProjectionState = {
    ...state,
    run,
    researchPlan,
    claimLedger,
    iterations,
    convergence,
    artifactIndex: { artifacts },
    cursors: advanceCursors(state, event),
    seenEvents,
    status: state.status,
  };
  if (event.payload.stem === 'deep_research.run_completed') {
    assertRunCompletionReferences(
      interim,
      event as DeepResearchEventEnvelope<'deep_research.run_completed'>,
    );
  }
  const next: DeepResearchProjectionState = {
    ...interim,
    status: refreshStatus(state.status, event, convergence, interim.artifactIndex),
  };
  if (next.status.state === 'converged'
    && next.convergence.eligibility !== 'STOP_ELIGIBLE') {
    throw new DeepResearchReducerError(
      'impossible-status-transition',
      'Converged status requires stop-eligible convergence',
      'status.state',
    );
  }
  if (next.status.state === 'converged'
    && !hasValidCompletionArtifacts(next.artifactIndex)) {
    throw new DeepResearchReducerError(
      'impossible-status-transition',
      'Converged status requires valid research-report and continuity-save artifacts',
      'status.state',
    );
  }
  assertDeepResearchProjectionState(next);
  return immutableProjectionClone(next) as DeepResearchProjectionState;
}

// ───────────────────────────────────────────────────────────────────
// 10. MODE-CONTRACT REDUCER SURFACE
// ───────────────────────────────────────────────────────────────────

export type DeepResearchReducerSurface = Pick<
  ModeContract<DeepResearchModeContractState>,
  'reducers' | 'reduce'
>;

/** Apply one real verified-ledger event through the shared ModeContract.reduce signature. */
export function reduceDeepResearchVerifiedEvent(
  verified: VerifiedLedgerEvent,
  state: Readonly<DeepResearchModeContractState>,
): ModeReductionResult<DeepResearchModeContractState> {
  assertDeepResearchProjectionState(state);
  const event = typedEventFromVerified(verified);
  const next = applyEvent(state, event);
  return Object.freeze({
    reducerId: DEEP_RESEARCH_REDUCER_ID,
    stateVersion: DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION,
    appliedEventId: event.event_id,
    state: asModeContractState(next),
  });
}

export const DEEP_RESEARCH_REDUCER_SURFACE: DeepResearchReducerSurface = Object.freeze({
  reducers: DEEP_RESEARCH_REDUCER_SET,
  reduce: reduceDeepResearchVerifiedEvent,
});

function assertReducerOwnership(reducers: ModeReducerSet<DeepResearchModeContractState>): void {
  const declared = [...reducers.persistedFields].sort(compareString);
  const expected = [...PERSISTED_FIELDS].sort(compareString);
  if (!sameCanonical(declared, expected)) {
    throw new DeepResearchReducerError(
      'projection-field-undeclared',
      'Persisted fields must equal the closed deep-research projection field set',
      'reducers.persistedFields',
    );
  }
  const owners = new Map<string, string>();
  for (const definition of reducers.definitions) {
    for (const field of definition.ownedFields) {
      const existing = owners.get(field);
      if (existing !== undefined) {
        throw new DeepResearchReducerError(
          'duplicate-owner',
          `Projection field ${field} is owned by both ${existing} and ${definition.reducerId}`,
          field,
        );
      }
      owners.set(field, definition.reducerId);
    }
  }
  for (const field of PERSISTED_FIELDS) {
    if (!owners.has(field)) {
      throw new DeepResearchReducerError(
        'projection-field-undeclared',
        `Projection field ${field} has no reducer owner`,
        field,
      );
    }
  }
}

/**
 * Probe a ModeContract reducer for determinism, immutability, and closed ownership.
 *
 * The probe deliberately invokes the real shared reducer signature twice. It rejects
 * cosmetic contracts whose declarations do not constrain their actual writes.
 */
export function verifyDeepResearchReducerSurface(
  surface: DeepResearchReducerSurface,
  event: VerifiedLedgerEvent,
  state: DeepResearchProjectionState,
): void {
  assertReducerOwnership(surface.reducers);
  assertDeepResearchProjectionState(state);
  const firstInput = immutableProjectionClone(state) as DeepResearchProjectionState;
  const secondInput = immutableProjectionClone(state) as DeepResearchProjectionState;
  const initialDigest = canonicalJson(firstInput);
  const first = surface.reduce(event, asModeContractState(firstInput));
  const second = surface.reduce(event, asModeContractState(secondInput));
  assertDeepResearchProjectionState(first.state);
  assertDeepResearchProjectionState(second.state);
  if (!isDeepFrozenProjection(first.state) || !isDeepFrozenProjection(second.state)) {
    throw new DeepResearchReducerError(
      'projection-not-frozen',
      'Mode reducer outputs must be recursively frozen',
      'state',
    );
  }
  if (canonicalJson(firstInput) !== initialDigest || canonicalJson(secondInput) !== initialDigest) {
    throw new DeepResearchReducerError(
      'state-mutated',
      'Mode reducer mutated its frozen input state',
      'state',
    );
  }
  if (!sameCanonical(first, second)) {
    throw new DeepResearchReducerError(
      'reducer-nondeterministic',
      'Mode reducer produced different canonical outputs for equal inputs',
      'state',
    );
  }
  const definition = surface.reducers.definitions.find(
    (candidate) => candidate.reducerId === first.reducerId,
  );
  if (definition === undefined) {
    throw new DeepResearchReducerError(
      'reducer-output-unowned',
      'Mode reducer returned an undeclared reducer identity',
      'reducerId',
    );
  }
  const changedFields = topLevelChangedFields(state, first.state);
  const unowned = changedFields.find((field) => !definition.ownedFields.includes(field));
  if (unowned !== undefined) {
    throw new DeepResearchReducerError(
      'reducer-output-unowned',
      `Mode reducer wrote unowned projection field ${unowned}`,
      unowned,
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// 11. FULL AND INCREMENTAL REPLAY
// ───────────────────────────────────────────────────────────────────

/** Derive the projection integrity digest without feeding a prior output digest back in. */
export function deepResearchProjectionIntegrityDigest(
  projection: DeepResearchProjectionState,
): string {
  assertDeepResearchProjectionState(projection);
  return sha256Bytes(canonicalBytes({
    schemaVersion: DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION,
    reducerVersion: DEEP_RESEARCH_REDUCER_VERSION,
    codecVersion: DEEP_RESEARCH_PROJECTION_CODEC_VERSION,
    orderingPolicyVersion: DEEP_RESEARCH_ORDERING_POLICY_VERSION,
    projection,
  }));
}

function deepResearchCheckpointIntegrityDigest(
  projection: DeepResearchProjectionState,
  sourceTailSequence: number,
): string {
  return sha256Bytes(canonicalBytes({
    projectionDigest: deepResearchProjectionIntegrityDigest(projection),
    sourceTailSequence,
  }));
}

function rebuildReasons(
  options: DeepResearchFoldOptions,
): DeepResearchRebuildReasonCode[] {
  const reasons: DeepResearchRebuildReasonCode[] = [];
  if (options.expectedSchemaVersion !== undefined
    && options.expectedSchemaVersion !== DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION) {
    reasons.push('projection-schema-mismatch');
  }
  if (options.expectedReducerVersion !== undefined
    && options.expectedReducerVersion !== DEEP_RESEARCH_REDUCER_VERSION) {
    reasons.push('reducer-version-mismatch');
  }
  if (options.expectedCodecVersion !== undefined
    && options.expectedCodecVersion !== DEEP_RESEARCH_PROJECTION_CODEC_VERSION) {
    reasons.push('codec-version-mismatch');
  }
  if (options.expectedOrderingPolicyVersion !== undefined
    && options.expectedOrderingPolicyVersion !== DEEP_RESEARCH_ORDERING_POLICY_VERSION) {
    reasons.push('ordering-policy-mismatch');
  }
  const checkpoint = options.checkpoint;
  if (checkpoint !== undefined) {
    try {
      assertDeepResearchProjectionState(checkpoint.projection);
    } catch {
      reasons.push('projection-schema-mismatch');
      return reasons;
    }
    if (checkpoint.projection.schemaVersion !== DEEP_RESEARCH_PROJECTION_SCHEMA_VERSION) {
      reasons.push('projection-schema-mismatch');
    }
    if (checkpoint.projection.reducerVersion !== DEEP_RESEARCH_REDUCER_VERSION) {
      reasons.push('reducer-version-mismatch');
    }
    if (checkpoint.projection.codecVersion !== DEEP_RESEARCH_PROJECTION_CODEC_VERSION) {
      reasons.push('codec-version-mismatch');
    }
    if (checkpoint.projection.orderingPolicyVersion !== DEEP_RESEARCH_ORDERING_POLICY_VERSION) {
      reasons.push('ordering-policy-mismatch');
    }
    if (deepResearchCheckpointIntegrityDigest(
      checkpoint.projection,
      checkpoint.sourceTailSequence,
    )
      !== checkpoint.integrityDigest) {
      reasons.push('checkpoint-digest-mismatch');
    }
    if (options.sourceTailSequence !== undefined
      && options.sourceTailSequence < checkpoint.sourceTailSequence) {
      reasons.push('source-truncated');
    }
  }
  return [...new Set(reasons)].sort(compareString);
}

function projectedResult(
  projection: DeepResearchProjectionState,
  sourceTailSequence: number,
): DeepResearchProjectedResult {
  const integrityDigest = deepResearchProjectionIntegrityDigest(projection);
  const checkpoint: DeepResearchProjectionCheckpoint = {
    projection,
    integrityDigest: deepResearchCheckpointIntegrityDigest(projection, sourceTailSequence),
    sourceTailSequence,
  };
  return immutableProjectionClone({
    outcome: 'projected',
    projection,
    integrityDigest,
    checkpoint,
  }) as unknown as DeepResearchProjectedResult;
}

/** Fold typed events into deterministic, frozen, checkpointable projections. */
export function foldDeepResearchEvents(
  events: readonly DeepResearchLedgerEvent[],
  options: DeepResearchFoldOptions = {},
): DeepResearchFoldResult {
  const reasons = rebuildReasons(options);
  if (reasons.length > 0) {
    return Object.freeze({ outcome: 'rebuild_required', reasonCodes: Object.freeze(reasons) });
  }
  const validated = events.map(validateTypedEvent).sort(compareEvents);
  const checkpoint = options.checkpoint;
  if (checkpoint !== undefined) {
    assertProjectionCrossFieldConsistency(checkpoint.projection);
  }
  if (checkpoint !== undefined && options.requireContiguousTail !== false) {
    const unseenSequences = validated
      .filter((event) => !checkpoint.projection.seenEvents.some(
        (seen) => seen.eventId === event.event_id,
      ))
      .map((event) => event.stream_sequence)
      .filter((sequence) => sequence > checkpoint.sourceTailSequence);
    const firstUnseen = unseenSequences.length === 0 ? null : Math.min(...unseenSequences);
    if (firstUnseen !== null && firstUnseen > checkpoint.sourceTailSequence + 1) {
      return Object.freeze({
        outcome: 'rebuild_required',
        reasonCodes: Object.freeze(['cursor-gap'] as const),
      });
    }
  }
  let projection = checkpoint?.projection ?? createDeepResearchProjectionState();
  for (const event of validated) projection = applyEvent(projection, event);
  const eventTail = validated.reduce(
    (tail, event) => Math.max(tail, event.stream_sequence),
    checkpoint?.sourceTailSequence ?? 0,
  );
  const sourceTailSequence = Math.max(options.sourceTailSequence ?? 0, eventTail);
  return projectedResult(projection, sourceTailSequence);
}

// ───────────────────────────────────────────────────────────────────
// 12. SHADOW-ONLY LEGACY VIEW
// ───────────────────────────────────────────────────────────────────

/** Project the typed aggregate into a lossy, non-authoritative legacy comparison view. */
export function projectDeepResearchLegacyView(
  projection: DeepResearchProjectionState,
): DeepResearchLegacyProjection {
  assertDeepResearchProjectionState(projection);
  const latestFocus = projection.researchPlan.focusObligations.at(-1);
  const nextFocusRef = latestFocus?.chosenBranchId ?? latestFocus?.chosenQuestionId ?? null;
  const legacy: DeepResearchLegacyProjection = {
    authority: 'shadow-only',
    legacyAuthority: 'unchanged',
    iteration: projection.iterations.currentIteration,
    status: projection.status.state,
    newInfoRatio: projection.convergence.rawNewInfoRatio,
    trustedEvidenceYield: projection.convergence.trustedEvidenceYield,
    nextFocusRef,
    lossyFields: Object.freeze([
      'artifact-validity-history',
      'claim-supersession-history',
      'observed-finalized-frontiers',
      'raw-trusted-signal-separation',
    ]) as unknown as string[],
  };
  assertDeepResearchLegacyProjection(legacy);
  return immutableProjectionClone(legacy) as DeepResearchLegacyProjection;
}
