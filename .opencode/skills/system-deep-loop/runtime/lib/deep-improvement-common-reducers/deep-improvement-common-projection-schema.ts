// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Projection Schema
// ───────────────────────────────────────────────────────────────────

import { canonicalJson } from '../event-envelope/index.js';

import type {
  DeepImprovementCommonCandidateView,
  DeepImprovementCommonLegacyProjection,
  DeepImprovementCommonProjectionState,
  DeepImprovementCommonReducerErrorCode,
} from './deep-improvement-common-projection-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIELD RULES
// ───────────────────────────────────────────────────────────────────

interface ScalarFieldRule {
  readonly kind:
    | 'boolean'
    | 'code'
    | 'digest'
    | 'identifier'
    | 'ratio'
    | 'reference'
    | 'uint32'
    | 'version';
}

interface EnumFieldRule {
  readonly kind: 'enum';
  readonly values: readonly string[];
}

interface NullableFieldRule {
  readonly kind: 'nullable';
  readonly value: ProjectionFieldRule;
}

interface ArrayFieldRule {
  readonly kind: 'array';
  readonly item: ProjectionFieldRule;
}

interface ObjectFieldRule {
  readonly kind: 'object';
  readonly fields: Readonly<Record<string, ProjectionFieldRule>>;
}

type ProjectionFieldRule =
  | ScalarFieldRule
  | EnumFieldRule
  | NullableFieldRule
  | ArrayFieldRule
  | ObjectFieldRule;

// ───────────────────────────────────────────────────────────────────
// 2. RULE BUILDERS AND SHARED RULES
// ───────────────────────────────────────────────────────────────────

const HASH_PATTERN = /^[a-f0-9]{64}$/u;
const SYSTEM_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/u;
const CODE_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,127}$/u;

const booleanRule = Object.freeze({ kind: 'boolean' } as const);
const codeRule = Object.freeze({ kind: 'code' } as const);
const digestRule = Object.freeze({ kind: 'digest' } as const);
const identifierRule = Object.freeze({ kind: 'identifier' } as const);
const ratioRule = Object.freeze({ kind: 'ratio' } as const);
const referenceRule = Object.freeze({ kind: 'reference' } as const);
const uint32Rule = Object.freeze({ kind: 'uint32' } as const);
const versionRule = Object.freeze({ kind: 'version' } as const);

function enumRule(values: readonly string[]): EnumFieldRule {
  return Object.freeze({ kind: 'enum', values: Object.freeze([...values]) });
}

function nullableRule(value: ProjectionFieldRule): NullableFieldRule {
  return Object.freeze({ kind: 'nullable', value });
}

function arrayRule(item: ProjectionFieldRule): ArrayFieldRule {
  return Object.freeze({ kind: 'array', item });
}

function objectRule(
  fields: Readonly<Record<string, ProjectionFieldRule>>,
): ObjectFieldRule {
  return Object.freeze({ kind: 'object', fields: Object.freeze({ ...fields }) });
}

const VARIANT_RULE = enumRule([
  'agent-improvement',
  'model-benchmark',
  'skill-benchmark',
]);
const WORKSTREAM_RULE = enumRule([
  'deep-improvement-common',
  'agent-improvement',
  'model-benchmark',
  'skill-benchmark',
]);
const RUN_STATE_RULE = enumRule([
  'planned',
  'active',
  'paused',
  'completed',
  'aborted',
  'quarantined',
]);
const MODE_STATE_RULE = enumRule([
  'planned',
  'active',
  'paused',
  'awaiting-evaluation',
  'offline-accepted',
  'awaiting-canary',
  'promotion-proposed',
  'ship-eligible',
  'shadow',
  'canary',
  'shipped',
  'inconclusive',
  'blocked',
  'quarantined',
  'aborted',
  'rolled-back',
  'completed',
  'failed',
]);
const CANDIDATE_STAGE_RULE = enumRule([
  'proposed',
  'generated',
  'rejected',
  'evaluating',
  'scored',
  'verified',
  'inconclusive',
  'failed',
]);
const CANARY_STAGE_RULE = enumRule([
  'not-started',
  'sealed',
  'executed',
  'passed',
  'failed',
  'vetoed',
]);
const PROMOTION_STAGE_RULE = enumRule([
  'not-proposed',
  'proposed',
  'authorized',
  'denied',
  'shadow',
  'canary',
  'paused',
  'aborted',
  'rolled-back',
  'shipped',
]);
const AUTHORITY_STATE_RULE = enumRule([
  'legacy',
  'shadow',
  'canary',
  'eligible',
  'authorized',
  'authoritative',
  'denied',
  'rollback-required',
  'restored',
]);
const EVENT_STEM_RULE = enumRule([
  'deep_improvement_common.run_started',
  'deep_improvement_common.run_resumed',
  'deep_improvement_common.run_paused',
  'deep_improvement_common.run_completed',
  'deep_improvement_common.run_aborted',
  'deep_improvement_common.run_quarantined',
  'deep_improvement_common.candidate_proposed',
  'deep_improvement_common.candidate_generated',
  'deep_improvement_common.candidate_rejected',
  'deep_improvement_common.candidate_lineage_attached',
  'deep_improvement_common.evaluation_epoch_sealed',
  'deep_improvement_common.evaluation_started',
  'deep_improvement_common.evaluation_observation_recorded',
  'deep_improvement_common.evaluation_normalized',
  'deep_improvement_common.evaluation_verification_requested',
  'deep_improvement_common.evaluation_verification_recorded',
  'deep_improvement_common.evaluation_inconclusive',
  'deep_improvement_common.evaluation_failed',
  'deep_improvement_common.canary_suite_sealed',
  'deep_improvement_common.canary_executed',
  'deep_improvement_common.canary_leak_detected',
  'deep_improvement_common.canary_drift_detected',
  'deep_improvement_common.canary_invariant_failed',
  'deep_improvement_common.canary_gate_passed',
  'deep_improvement_common.canary_gate_failed',
  'deep_improvement_common.canary_vetoed',
  'deep_improvement_common.promotion_proposed',
  'deep_improvement_common.promotion_authorized',
  'deep_improvement_common.promotion_denied',
  'deep_improvement_common.promotion_shadow_started',
  'deep_improvement_common.promotion_canary_started',
  'deep_improvement_common.promotion_paused',
  'deep_improvement_common.promotion_aborted',
  'deep_improvement_common.promotion_baseline_restored',
  'deep_improvement_common.promotion_completed',
]);

const SCORE_COMPONENT_RULE = objectRule({
  dimensionCode: codeRule,
  rawScore: ratioRule,
  normalizedScore: ratioRule,
  weight: ratioRule,
});
const SCORE_VECTOR_RULE = objectRule({
  components: arrayRule(SCORE_COMPONENT_RULE),
  aggregateScore: ratioRule,
  uncertainty: ratioRule,
});

// ───────────────────────────────────────────────────────────────────
// 3. CLOSED PROJECTION SCHEMA
// ───────────────────────────────────────────────────────────────────

const RUN_RULE = objectRule({
  runId: nullableRule(identifierRule),
  lineageId: nullableRule(identifierRule),
  variant: nullableRule(VARIANT_RULE),
  generation: uint32Rule,
  charterDigest: nullableRule(digestRule),
  configDigest: nullableRule(digestRule),
  operatorRef: nullableRule(referenceRule),
  serviceContractVersion: nullableRule(versionRule),
  replayFingerprint: nullableRule(digestRule),
  maxIterations: uint32Rule,
  initializationEventId: nullableRule(identifierRule),
  state: RUN_STATE_RULE,
});

const EVALUATOR_EPOCH_RULE = objectRule({
  evaluationEpochId: identifierRule,
  candidateId: identifierRule,
  evaluatorRef: referenceRule,
  evaluatorCapsuleDigest: digestRule,
  fixtureSetRef: referenceRule,
  fixtureSetDigest: digestRule,
  scorePolicyVersion: versionRule,
  scoreWriteBackendRef: referenceRule,
  evaluationBudgetRef: referenceRule,
  sealedEventId: identifierRule,
  startedEventId: nullableRule(identifierRule),
});

const CANDIDATE_PROGRESS_RULE = objectRule({
  candidateId: identifierRule,
  stage: CANDIDATE_STAGE_RULE,
  proposalEventId: identifierRule,
  generatedEventId: nullableRule(identifierRule),
  terminalEventId: nullableRule(identifierRule),
});

const CANARY_RULE = objectRule({
  candidateId: identifierRule,
  canaryEpochId: identifierRule,
  canarySuiteId: identifierRule,
  stage: CANARY_STAGE_RULE,
  suiteEventId: identifierRule,
  executionEventIds: arrayRule(identifierRule),
  gateEventId: nullableRule(identifierRule),
});

const PROMOTION_RULE = objectRule({
  promotionId: identifierRule,
  candidateId: identifierRule,
  baselineId: identifierRule,
  stage: PROMOTION_STAGE_RULE,
  requestedRollout: nullableRule(enumRule(['canary', 'shadow'])),
  proposalEventId: identifierRule,
  authorizationEventId: nullableRule(identifierRule),
  rolloutEventIds: arrayRule(identifierRule),
  terminalEventId: nullableRule(identifierRule),
});

const HARD_VETO_RULE = objectRule({
  candidateId: identifierRule,
  vetoCode: codeRule,
  source: enumRule([
    'canary',
    'evaluator-integrity',
    'promotion',
    'verification',
  ]),
  evidenceRef: referenceRule,
  evidenceDigest: digestRule,
  producerEventId: identifierRule,
});

const ITERATION_CONVERGENCE_RULE = objectRule({
  currentIteration: uint32Rule,
  evaluatorEpochs: arrayRule(EVALUATOR_EPOCH_RULE),
  candidates: arrayRule(CANDIDATE_PROGRESS_RULE),
  canaries: arrayRule(CANARY_RULE),
  promotions: arrayRule(PROMOTION_RULE),
  evaluationBudgetRefs: arrayRule(referenceRule),
  unresolvedEvidenceRefs: arrayRule(referenceRule),
  hardVetoes: arrayRule(HARD_VETO_RULE),
  stopReason: nullableRule(enumRule([
    'blockedStop',
    'converged',
    'error',
    'manualStop',
    'maxIterationsReached',
    'stuckRecovery',
  ])),
  sessionOutcome: nullableRule(enumRule([
    'advisoryOnly',
    'keptBaseline',
    'promoted',
    'rolledBack',
  ])),
  convergenceDisposition: enumRule([
    'active',
    'aborted',
    'blocked',
    'converged',
    'inconclusive',
    'quarantined',
  ]),
});

const CANDIDATE_RECORD_RULE = objectRule({
  candidateId: identifierRule,
  parentCandidateId: nullableRule(identifierRule),
  proposalRef: referenceRule,
  proposalDigest: digestRule,
  targetRef: referenceRule,
  targetDigest: digestRule,
  mutationOperatorRef: referenceRule,
  mutationOperatorVersion: versionRule,
  proposalPolicyVersion: versionRule,
  proposalEventId: identifierRule,
  candidateArtifactRef: nullableRule(referenceRule),
  candidateArtifactDigest: nullableRule(digestRule),
  generationReceiptRef: nullableRule(referenceRule),
  generatedEventId: nullableRule(identifierRule),
  activeProfileRef: nullableRule(referenceRule),
});

const ARTIFACT_RULE = objectRule({
  artifactId: identifierRule,
  logicalArtifactId: identifierRule,
  artifactKind: enumRule([
    'proposal',
    'candidate',
    'raw-observation',
    'normalized-score',
    'verification',
    'canary-suite',
    'canary-observation',
    'promotion-receipt',
    'rollback-receipt',
    'run-checkpoint',
  ]),
  reference: referenceRule,
  digest: digestRule,
  producerEventId: identifierRule,
  candidateId: nullableRule(identifierRule),
  evaluationEpochId: nullableRule(identifierRule),
  availability: enumRule([
    'available',
    'pending',
    'invalid',
    'unavailable',
    'superseded',
  ]),
  receiptRefs: arrayRule(referenceRule),
  supersedesArtifactIds: arrayRule(identifierRule),
  supersededByArtifactIds: arrayRule(identifierRule),
});

const RAW_OBSERVATION_RULE = objectRule({
  candidateId: identifierRule,
  evaluationEpochId: identifierRule,
  fixtureId: identifierRule,
  observationId: identifierRule,
  evaluatorRef: referenceRule,
  fixtureRef: referenceRule,
  rawObservationRef: referenceRule,
  rawObservationDigest: digestRule,
  executionReceiptRef: referenceRule,
  observationOutcome: enumRule(['error', 'fail', 'pass', 'timeout']),
  producerEventId: identifierRule,
});

const DERIVED_SCORE_RULE = objectRule({
  candidateId: identifierRule,
  evaluationEpochId: identifierRule,
  observationEventIds: arrayRule(identifierRule),
  observationSetDigest: digestRule,
  scorePolicyVersion: versionRule,
  scorerFingerprint: digestRule,
  scoreWriteBackendRef: referenceRule,
  scoreVector: SCORE_VECTOR_RULE,
  normalizationReceiptRef: referenceRule,
  producerEventId: identifierRule,
});

const ARTIFACT_INDEX_RULE = objectRule({
  candidates: arrayRule(CANDIDATE_RECORD_RULE),
  artifacts: arrayRule(ARTIFACT_RULE),
  rawObservations: arrayRule(RAW_OBSERVATION_RULE),
  derivedScores: arrayRule(DERIVED_SCORE_RULE),
});

const PROFILE_INCUMBENT_RULE = objectRule({
  profileRef: referenceRule,
  candidateId: identifierRule,
  promotionEventId: identifierRule,
});

const STATUS_TRANSITION_RULE = objectRule({
  state: MODE_STATE_RULE,
  producerEventId: identifierRule,
  producerStem: EVENT_STEM_RULE,
  logicalSequence: uint32Rule,
  transitionReason: nullableRule(referenceRule),
});

const MODE_STATUS_RULE = objectRule({
  workstream: WORKSTREAM_RULE,
  state: MODE_STATE_RULE,
  evaluatorEpochId: nullableRule(identifierRule),
  activeProfileRef: nullableRule(referenceRule),
  currentIncumbentCandidateId: nullableRule(identifierRule),
  candidateStage: nullableRule(CANDIDATE_STAGE_RULE),
  canaryStage: CANARY_STAGE_RULE,
  promotionStage: PROMOTION_STAGE_RULE,
  authorityState: AUTHORITY_STATE_RULE,
  rollbackTargetBaselineId: nullableRule(identifierRule),
  blockingVetoCodes: arrayRule(codeRule),
  profileIncumbents: arrayRule(PROFILE_INCUMBENT_RULE),
  terminal: booleanRule,
  provenance: arrayRule(STATUS_TRANSITION_RULE),
});

const MODE_STATUS_PROJECTION_RULE = objectRule({
  statuses: arrayRule(MODE_STATUS_RULE),
});

const CURSORS_RULE = objectRule({
  iterationConvergence: uint32Rule,
  artifactIndex: uint32Rule,
  modeStatus: uint32Rule,
});

const SEEN_EVENT_RULE = objectRule({
  eventId: identifierRule,
  eventDigest: digestRule,
  payloadDigest: digestRule,
  stem: EVENT_STEM_RULE,
  streamId: identifierRule,
  streamSequence: uint32Rule,
  candidateId: nullableRule(identifierRule),
  evaluationEpochId: nullableRule(identifierRule),
  canaryEpochId: nullableRule(identifierRule),
  promotionId: nullableRule(identifierRule),
});

const PROJECTION_RULE = objectRule({
  schemaVersion: versionRule,
  reducerVersion: versionRule,
  codecVersion: versionRule,
  orderingPolicyVersion: versionRule,
  run: RUN_RULE,
  iterationConvergence: ITERATION_CONVERGENCE_RULE,
  artifactIndex: ARTIFACT_INDEX_RULE,
  modeStatus: MODE_STATUS_PROJECTION_RULE,
  cursors: CURSORS_RULE,
  seenEvents: arrayRule(SEEN_EVENT_RULE),
});

const LEGACY_PROJECTION_RULE = objectRule({
  authority: enumRule(['shadow-only']),
  legacyAuthority: enumRule(['unchanged']),
  variant: nullableRule(VARIANT_RULE),
  runState: RUN_STATE_RULE,
  iteration: uint32Rule,
  candidateId: nullableRule(identifierRule),
  candidateStage: nullableRule(CANDIDATE_STAGE_RULE),
  aggregateScore: nullableRule(ratioRule),
  canaryStage: CANARY_STAGE_RULE,
  promotionStage: PROMOTION_STAGE_RULE,
  stopReason: nullableRule(enumRule([
    'blockedStop',
    'converged',
    'error',
    'manualStop',
    'maxIterationsReached',
    'stuckRecovery',
  ])),
  sessionOutcome: nullableRule(enumRule([
    'advisoryOnly',
    'keptBaseline',
    'promoted',
    'rolledBack',
  ])),
  hardVetoCodes: arrayRule(codeRule),
});

const CANDIDATE_VIEW_RULE = objectRule({
  authority: enumRule(['derived-redacted']),
  workstream: enumRule(['deep-improvement-common']),
  runState: RUN_STATE_RULE,
  iteration: uint32Rule,
  candidateStage: nullableRule(CANDIDATE_STAGE_RULE),
  canaryStage: CANARY_STAGE_RULE,
  promotionStage: PROMOTION_STAGE_RULE,
  decisionBand: enumRule(['blocked', 'eligible', 'pending', 'terminal']),
});

// ───────────────────────────────────────────────────────────────────
// 4. VALIDATION AND IMMUTABILITY
// ───────────────────────────────────────────────────────────────────

export class DeepImprovementCommonReducerError extends Error {
  public readonly code: DeepImprovementCommonReducerErrorCode;
  public readonly field: string | null;

  public constructor(
    code: DeepImprovementCommonReducerErrorCode,
    message: string,
    field: string | null = null,
  ) {
    super(message);
    this.name = 'DeepImprovementCommonReducerError';
    this.code = code;
    this.field = field;
    Object.setPrototypeOf(this, DeepImprovementCommonReducerError.prototype);
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function isUint32(value: unknown): value is number {
  return Number.isSafeInteger(value)
    && Number(value) >= 0
    && Number(value) <= 0xffff_ffff;
}

function isRatio(value: unknown): value is number {
  return typeof value === 'number'
    && Number.isFinite(value)
    && value >= 0
    && value <= 1;
}

function assertNever(value: never): never {
  throw new Error(`Unhandled projection field rule: ${String(value)}`);
}

function isFieldValue(rule: ProjectionFieldRule, value: unknown): boolean {
  switch (rule.kind) {
    case 'boolean':
      return typeof value === 'boolean';
    case 'code':
      return typeof value === 'string' && CODE_TOKEN_PATTERN.test(value);
    case 'digest':
      return typeof value === 'string' && HASH_PATTERN.test(value);
    case 'identifier':
    case 'reference':
    case 'version':
      return typeof value === 'string' && SYSTEM_TOKEN_PATTERN.test(value);
    case 'ratio':
      return isRatio(value);
    case 'uint32':
      return isUint32(value);
    case 'enum':
      return typeof value === 'string' && rule.values.includes(value);
    case 'nullable':
      return value === null || isFieldValue(rule.value, value);
    case 'array':
      return Array.isArray(value)
        && value.every((entry) => isFieldValue(rule.item, entry));
    case 'object': {
      if (!isObject(value)) return false;
      const expectedFields = Object.keys(rule.fields).sort();
      const actualFields = Object.keys(value).sort();
      return canonicalJson(expectedFields) === canonicalJson(actualFields)
        && expectedFields.every((field) => (
          isFieldValue(rule.fields[field], value[field])
        ));
    }
  }
  return assertNever(rule);
}

function assertCrossProjectionReferences(
  projection: DeepImprovementCommonProjectionState,
): void {
  const eventIds = new Set(projection.seenEvents.map((event) => event.eventId));
  const candidateIds = new Set(
    projection.artifactIndex.candidates.map((candidate) => candidate.candidateId),
  );
  const rawObservationEventIds = new Set(
    projection.artifactIndex.rawObservations.map((observation) => observation.producerEventId),
  );
  if (projection.artifactIndex.artifacts.some(
    (artifact) => !eventIds.has(artifact.producerEventId),
  )) {
    throw new DeepImprovementCommonReducerError(
      'referential-integrity',
      'Projected artifacts must reference events present in the folded ledger',
      'artifactIndex.artifacts.producerEventId',
    );
  }
  if (projection.iterationConvergence.evaluatorEpochs.some(
    (epoch) => !candidateIds.has(epoch.candidateId) || !eventIds.has(epoch.sealedEventId),
  )) {
    throw new DeepImprovementCommonReducerError(
      'referential-integrity',
      'Evaluator epochs must reference captured candidates and producer events',
      'iterationConvergence.evaluatorEpochs',
    );
  }
  if (projection.artifactIndex.candidates.some(
    (candidate) => candidate.parentCandidateId !== null
      && !candidateIds.has(candidate.parentCandidateId),
  )) {
    throw new DeepImprovementCommonReducerError(
      'referential-integrity',
      'Candidate lineage cannot reference a candidate absent from the folded ledger',
      'artifactIndex.candidates.parentCandidateId',
    );
  }
  if (projection.artifactIndex.derivedScores.some(
    (score) => score.observationEventIds.some(
      (eventId) => !rawObservationEventIds.has(eventId),
    ),
  )) {
    throw new DeepImprovementCommonReducerError(
      'referential-integrity',
      'Derived scores must retain references to captured raw observations',
      'artifactIndex.derivedScores.observationEventIds',
    );
  }
  if (projection.modeStatus.statuses.some(
    (status) => status.currentIncumbentCandidateId !== null
      && !candidateIds.has(status.currentIncumbentCandidateId),
  )) {
    throw new DeepImprovementCommonReducerError(
      'referential-integrity',
      'Incumbent status cannot reference a candidate absent from the folded ledger',
      'modeStatus.statuses.currentIncumbentCandidateId',
    );
  }
}

/** Validate every field and cross-array reference in the common projection. */
export function assertDeepImprovementCommonProjectionState(
  value: unknown,
): asserts value is DeepImprovementCommonProjectionState {
  if (isObject(value)) {
    const expectedFields = Object.keys(PROJECTION_RULE.fields).sort();
    const actualFields = Object.keys(value).sort();
    if (canonicalJson(expectedFields) !== canonicalJson(actualFields)) {
      throw new DeepImprovementCommonReducerError(
        'projection-field-undeclared',
        'Common projection contains a missing or undeclared persisted field',
        'projection',
      );
    }
  }
  if (!isFieldValue(PROJECTION_RULE, value)) {
    throw new DeepImprovementCommonReducerError(
      'projection-field-invalid',
      'Common projection does not match the closed field-kind schema',
      'projection',
    );
  }
  assertCrossProjectionReferences(value as DeepImprovementCommonProjectionState);
}

/** Validate the complete shadow-only legacy comparison view. */
export function assertDeepImprovementCommonLegacyProjection(
  value: unknown,
): asserts value is DeepImprovementCommonLegacyProjection {
  if (!isFieldValue(LEGACY_PROJECTION_RULE, value)) {
    throw new DeepImprovementCommonReducerError(
      'projection-field-invalid',
      'Legacy comparison projection does not match its complete closed schema',
      'legacyProjection',
    );
  }
}

/** Validate the closed candidate-facing view, which intentionally carries no evidence locators. */
export function assertDeepImprovementCommonCandidateView(
  value: unknown,
): asserts value is DeepImprovementCommonCandidateView {
  if (!isFieldValue(CANDIDATE_VIEW_RULE, value)) {
    throw new DeepImprovementCommonReducerError(
      'projection-field-invalid',
      'Candidate-facing projection does not match its closed redacted schema',
      'candidateView',
    );
  }
}

/** Clone canonical JSON and recursively freeze the clone. */
export function immutableProjectionClone<T>(value: T): Readonly<T> {
  const clone = JSON.parse(canonicalJson(value)) as T;
  const freeze = (candidate: unknown): void => {
    if (candidate !== null && typeof candidate === 'object') {
      Object.values(candidate).forEach(freeze);
      Object.freeze(candidate);
    }
  };
  freeze(clone);
  return clone;
}

/** Check that every nested projection collection and object is frozen. */
export function isDeepFrozenProjection(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return true;
  return Object.isFrozen(value)
    && Object.values(value).every(isDeepFrozenProjection);
}
