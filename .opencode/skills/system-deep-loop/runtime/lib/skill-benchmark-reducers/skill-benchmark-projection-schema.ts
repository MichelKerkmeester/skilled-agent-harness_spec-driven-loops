// ───────────────────────────────────────────────────────────────────
// MODULE: Skill Benchmark Projection Schema
// ───────────────────────────────────────────────────────────────────

import { canonicalJson } from '../event-envelope/index.js';
import {
  assertDeepImprovementCommonLegacyProjection,
  assertDeepImprovementCommonProjectionState,
} from '../deep-improvement-common-reducers/index.js';

import type {
  SkillBenchmarkLegacyProjection,
  SkillBenchmarkProjectionState,
  SkillBenchmarkReducerErrorCode,
} from './skill-benchmark-projection-types.js';

interface ScalarFieldRule {
  readonly kind:
    | 'boolean'
    | 'digest'
    | 'identifier'
    | 'ratio'
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

const HASH_PATTERN = /^[a-f0-9]{64}$/u;
const SYSTEM_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/u;

const booleanRule = Object.freeze({ kind: 'boolean' } as const);
const digestRule = Object.freeze({ kind: 'digest' } as const);
const identifierRule = Object.freeze({ kind: 'identifier' } as const);
const ratioRule = Object.freeze({ kind: 'ratio' } as const);
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

const RUN_STATE_RULE = enumRule([
  'planned', 'active', 'closed', 'incomplete', 'aborted',
]);
const SCENARIO_STATE_RULE = enumRule([
  'assigned', 'running', 'finished', 'aborted',
]);
const COLLECTION_STAGE_RULE = enumRule([
  'assigned',
  'available',
  'loaded',
  'invoked',
  'trajectory-recorded',
  'outcome-recorded',
  'raw-score-recorded',
  'normalized',
  'blocked',
]);
const MODE_STATE_RULE = enumRule([
  'planned',
  'active',
  'collecting',
  'scoring',
  'ready',
  'blocked',
  'withheld',
  'issued',
  'expired',
  'closed',
  'incomplete',
  'aborted',
]);
const SCORING_STATE_RULE = enumRule([
  'not-started', 'raw-observed', 'normalized', 'ranked', 'blocked',
]);
const CERTIFICATE_STATE_RULE = enumRule([
  'none', 'pending', 'eligible', 'issued', 'withheld', 'expired',
]);
const COMPATIBILITY_STATE_RULE = enumRule([
  'compatible', 'incompatible', 'unknown',
]);
const TREATMENT_ARM_RULE = enumRule([
  'auto-route',
  'compatibility-boundary',
  'component-ablation',
  'control',
  'distractor',
  'forced-activation',
  'no-skill',
  'placebo',
]);

const STREAM_TAIL_RULE = objectRule({
  streamId: identifierRule,
  sequence: uint32Rule,
  eventId: identifierRule,
  eventDigest: digestRule,
});

const RUN_RULE = objectRule({
  runId: nullableRule(identifierRule),
  lineageId: nullableRule(identifierRule),
  benchmarkDesignId: nullableRule(identifierRule),
  designRef: nullableRule(identifierRule),
  designDigest: nullableRule(digestRule),
  taskSetRef: nullableRule(identifierRule),
  taskSetDigest: nullableRule(digestRule),
  skillBundleRef: nullableRule(identifierRule),
  skillBundleDigest: nullableRule(digestRule),
  registryDigest: nullableRule(digestRule),
  executorDescriptorRef: nullableRule(identifierRule),
  executorDescriptorDigest: nullableRule(digestRule),
  environmentDigest: nullableRule(digestRule),
  dependencyDigest: nullableRule(digestRule),
  workloadDigest: nullableRule(digestRule),
  replicateCount: uint32Rule,
  designPolicyVersion: nullableRule(versionRule),
  state: RUN_STATE_RULE,
  plannedEventId: nullableRule(identifierRule),
  closedEventId: nullableRule(identifierRule),
});

const SCENARIO_RULE = objectRule({
  scenarioId: identifierRule,
  assignmentId: identifierRule,
  executionId: nullableRule(identifierRule),
  designCellId: identifierRule,
  pairedReplicateId: identifierRule,
  replicateIndex: uint32Rule,
  treatmentArm: TREATMENT_ARM_RULE,
  taskRef: identifierRule,
  taskDigest: digestRule,
  skillBundleRef: identifierRule,
  skillBundleDigest: digestRule,
  executorDescriptorRef: identifierRule,
  executorDescriptorDigest: digestRule,
  environmentDigest: digestRule,
  toolDigest: nullableRule(digestRule),
  permissionDigest: nullableRule(digestRule),
  dependencyDigest: nullableRule(digestRule),
  workloadDigest: nullableRule(digestRule),
  state: SCENARIO_STATE_RULE,
  collectionStage: COLLECTION_STAGE_RULE,
  assignmentEventId: identifierRule,
  startedEventId: nullableRule(identifierRule),
  terminalEventId: nullableRule(identifierRule),
  discoveryEventId: nullableRule(identifierRule),
  loadEventId: nullableRule(identifierRule),
  invocationEventId: nullableRule(identifierRule),
  trajectoryEventId: nullableRule(identifierRule),
  outcomeEventId: nullableRule(identifierRule),
  rawScoreEventIds: arrayRule(identifierRule),
  goldIntegrityEventIds: arrayRule(identifierRule),
  compatibilityEventIds: arrayRule(identifierRule),
  requiredEvidenceComplete: booleanRule,
});

const COVERAGE_RULE = objectRule({
  assignedScenarioCount: uint32Rule,
  terminalScenarioCount: uint32Rule,
  discoveredScenarioCount: uint32Rule,
  invokedScenarioCount: uint32Rule,
  trajectoryScenarioCount: uint32Rule,
  outcomeScenarioCount: uint32Rule,
  rawScoreScenarioCount: uint32Rule,
  acceptedGoldScenarioCount: uint32Rule,
  normalizedCandidateCount: uint32Rule,
  requiredScenarioCount: uint32Rule,
  complete: booleanRule,
});

const HARD_VETO_RULE = objectRule({
  vetoCode: identifierRule,
  source: enumRule([
    'canary',
    'compatibility',
    'gold-integrity',
    'negative-transfer',
    'security-probe',
    'shared-common',
  ]),
  scenarioId: nullableRule(identifierRule),
  evidenceRef: identifierRule,
  evidenceDigest: digestRule,
  producerEventId: identifierRule,
});

const ITERATION_CONVERGENCE_RULE = objectRule({
  scenarios: arrayRule(SCENARIO_RULE),
  coverage: COVERAGE_RULE,
  hardVetoes: arrayRule(HARD_VETO_RULE),
  collectionComplete: booleanRule,
  scoringComplete: booleanRule,
  certificateReady: booleanRule,
  blockerCodes: arrayRule(identifierRule),
  lastAppliedSequenceByStream: arrayRule(STREAM_TAIL_RULE),
});

const ARTIFACT_RULE = objectRule({
  artifactId: identifierRule,
  logicalArtifactId: identifierRule,
  artifactKind: enumRule([
    'assignment',
    'compatibility',
    'dependency',
    'design',
    'environment',
    'executor',
    'gold',
    'milestone',
    'negative-transfer',
    'normalized-score',
    'outcome',
    'permission',
    'raw-observation',
    'registry',
    'resource-exposure',
    'security-probe',
    'skill-bundle',
    'task',
    'tool',
    'trajectory',
    'workload',
  ]),
  reference: identifierRule,
  digest: digestRule,
  producerEventId: identifierRule,
  scenarioId: nullableRule(identifierRule),
  candidateId: nullableRule(identifierRule),
  availability: enumRule([
    'available', 'invalid', 'pending', 'superseded', 'unavailable',
  ]),
  supersedesArtifactIds: arrayRule(identifierRule),
  supersededByArtifactIds: arrayRule(identifierRule),
});

const RAW_SCORE_AXIS_RULE = objectRule({
  dimensionCode: identifierRule,
  rawScore: ratioRule,
  measurementRef: identifierRule,
  measurementDigest: digestRule,
});

const RAW_MEASUREMENT_RULE = objectRule({
  scenarioId: identifierRule,
  assignmentId: identifierRule,
  executionId: identifierRule,
  observationId: identifierRule,
  outcomeEventId: identifierRule,
  evaluatorRef: identifierRule,
  evaluatorVersion: versionRule,
  evaluatorFingerprint: digestRule,
  rawScoreAxes: arrayRule(RAW_SCORE_AXIS_RULE),
  deterministicResultsRef: identifierRule,
  deterministicResultsDigest: digestRule,
  dynamicReferenceResultsRef: identifierRule,
  dynamicReferenceResultsDigest: digestRule,
  constraintCoverageRef: identifierRule,
  constraintCoverageDigest: digestRule,
  tokenCount: uint32Rule,
  latencyMs: uint32Rule,
  costMicrounits: uint32Rule,
  goldIntegrityEventId: identifierRule,
  goldPolicy: enumRule(['negative', 'pending', 'scored', 'structural-only']),
  numeratorEligible: booleanRule,
  scoreWriteBackendRef: enumRule(['backend:deep-improvement-score']),
  producerEventId: identifierRule,
});

const DERIVED_RANKING_RULE = objectRule({
  candidateId: identifierRule,
  evaluationEpochId: identifierRule,
  normalizedScoreEventId: identifierRule,
  scorePolicyVersion: versionRule,
  aggregateScore: ratioRule,
  uncertainty: ratioRule,
  rank: nullableRule(uint32Rule),
  eligible: booleanRule,
  promoted: booleanRule,
  blockingVetoCodes: arrayRule(identifierRule),
});

const ARTIFACT_INDEX_RULE = objectRule({
  artifacts: arrayRule(ARTIFACT_RULE),
  rawMeasurements: arrayRule(RAW_MEASUREMENT_RULE),
  derivedRankings: arrayRule(DERIVED_RANKING_RULE),
});

const STATUS_TRANSITION_RULE = objectRule({
  state: MODE_STATE_RULE,
  producerEventId: identifierRule,
  producerStem: identifierRule,
  streamId: identifierRule,
  streamSequence: uint32Rule,
  reasonCode: nullableRule(identifierRule),
});

const MODE_STATUS_RULE = objectRule({
  state: MODE_STATE_RULE,
  scoringState: SCORING_STATE_RULE,
  certificateState: CERTIFICATE_STATE_RULE,
  compatibilityState: COMPATIBILITY_STATE_RULE,
  blockingVetoCodes: arrayRule(identifierRule),
  terminal: booleanRule,
  provenance: arrayRule(STATUS_TRANSITION_RULE),
});

const CURSORS_RULE = objectRule({
  common: arrayRule(STREAM_TAIL_RULE),
  iterationConvergence: arrayRule(STREAM_TAIL_RULE),
  artifactIndex: arrayRule(STREAM_TAIL_RULE),
  modeStatus: arrayRule(STREAM_TAIL_RULE),
});

const SEEN_EVENT_RULE = objectRule({
  eventId: identifierRule,
  eventDigest: digestRule,
  payloadDigest: digestRule,
  stem: identifierRule,
  streamId: identifierRule,
  streamSequence: uint32Rule,
  scenarioId: nullableRule(identifierRule),
  assignmentId: nullableRule(identifierRule),
  executionId: nullableRule(identifierRule),
  observationId: nullableRule(identifierRule),
  candidateId: nullableRule(identifierRule),
  benchmarkDesignId: nullableRule(identifierRule),
  certificateId: nullableRule(identifierRule),
});

const PROJECTION_RULE = objectRule({
  schemaVersion: versionRule,
  reducerVersion: versionRule,
  codecVersion: versionRule,
  orderingPolicyVersion: versionRule,
  common: objectRule({}),
  run: RUN_RULE,
  iterationConvergence: ITERATION_CONVERGENCE_RULE,
  artifactIndex: ARTIFACT_INDEX_RULE,
  modeStatus: MODE_STATUS_RULE,
  cursors: CURSORS_RULE,
  seenEvents: arrayRule(SEEN_EVENT_RULE),
});

const LEGACY_RULE = objectRule({
  authority: enumRule(['shadow-only']),
  legacyAuthority: enumRule(['unchanged']),
  common: objectRule({}),
  runState: RUN_STATE_RULE,
  modeState: MODE_STATE_RULE,
  scoringState: SCORING_STATE_RULE,
  certificateState: CERTIFICATE_STATE_RULE,
  collectionComplete: booleanRule,
  scoringComplete: booleanRule,
  certificateReady: booleanRule,
  scenarioCount: uint32Rule,
  rawMeasurementCount: uint32Rule,
  rankings: arrayRule(DERIVED_RANKING_RULE),
  blockerCodes: arrayRule(identifierRule),
});

export class SkillBenchmarkReducerError extends Error {
  public readonly code: SkillBenchmarkReducerErrorCode;
  public readonly field: string | null;

  public constructor(
    code: SkillBenchmarkReducerErrorCode,
    message: string,
    field: string | null = null,
  ) {
    super(message);
    this.name = 'SkillBenchmarkReducerError';
    this.code = code;
    this.field = field;
    Object.setPrototypeOf(this, SkillBenchmarkReducerError.prototype);
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
    case 'digest':
      return typeof value === 'string' && HASH_PATTERN.test(value);
    case 'identifier':
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
      if (Object.keys(rule.fields).length === 0) return true;
      const expected = Object.keys(rule.fields).sort();
      const actual = Object.keys(value).sort();
      return canonicalJson(expected) === canonicalJson(actual)
        && expected.every((field) => isFieldValue(rule.fields[field], value[field]));
    }
  }
  return assertNever(rule);
}

function assertReferentialIntegrity(
  projection: SkillBenchmarkProjectionState,
): void {
  const eventIds = new Set(projection.seenEvents.map((event) => event.eventId));
  const seenEventsById = new Map(
    projection.seenEvents.map((event) => [event.eventId, event]),
  );
  const scenarioIds = new Set(
    projection.iterationConvergence.scenarios.map((scenario) => scenario.scenarioId),
  );
  const missingProducer = projection.artifactIndex.artifacts.find(
    (artifact) => !eventIds.has(artifact.producerEventId),
  );
  if (missingProducer !== undefined) {
    throw new SkillBenchmarkReducerError(
      'referential-integrity',
      'Projected artifacts must reference producer events present in the folded ledger',
      'artifactIndex.artifacts.producerEventId',
    );
  }
  const missingRawSource = projection.artifactIndex.rawMeasurements.find((measurement) => {
    const ownedSource = (eventId: string): boolean => {
      const source = seenEventsById.get(eventId);
      return source !== undefined
        && source.scenarioId === measurement.scenarioId
        && source.assignmentId === measurement.assignmentId
        && source.executionId === measurement.executionId
        && source.observationId === measurement.observationId;
    };
    return !ownedSource(measurement.producerEventId)
      || !ownedSource(measurement.outcomeEventId)
      || !ownedSource(measurement.goldIntegrityEventId)
      || !scenarioIds.has(measurement.scenarioId);
  });
  if (missingRawSource !== undefined) {
    throw new SkillBenchmarkReducerError(
      'referential-integrity',
      'Raw measurements must reference folded outcome, gold, scenario, and producer sources',
      'artifactIndex.rawMeasurements',
    );
  }
  const commonScoreEventIds = new Set(
    projection.common.artifactIndex.derivedScores.map(
      (score) => score.producerEventId,
    ),
  );
  const missingDerivedSource = projection.artifactIndex.derivedRankings.find(
    (ranking) => !commonScoreEventIds.has(ranking.normalizedScoreEventId),
  );
  if (missingDerivedSource !== undefined) {
    throw new SkillBenchmarkReducerError(
      'referential-integrity',
      'Rankings must derive from a folded common normalized-score event',
      'artifactIndex.derivedRankings.normalizedScoreEventId',
    );
  }
}

/** Validate every field in the closed combined projection schema. */
export function assertSkillBenchmarkProjectionState(
  value: unknown,
): asserts value is SkillBenchmarkProjectionState {
  if (!isObject(value)) {
    throw new SkillBenchmarkReducerError(
      'projection-field-invalid',
      'Skill Benchmark projection must be an object',
      'projection',
    );
  }
  const expectedFields = Object.keys(PROJECTION_RULE.fields).sort();
  const actualFields = Object.keys(value).sort();
  if (canonicalJson(expectedFields) !== canonicalJson(actualFields)) {
    throw new SkillBenchmarkReducerError(
      'projection-field-undeclared',
      'Skill Benchmark projection contains a missing or undeclared persisted field',
      'projection',
    );
  }
  const { common, ...withoutCommon } = value;
  const { common: _commonRule, ...nonCommonRules } = PROJECTION_RULE.fields;
  if (!isFieldValue(objectRule(nonCommonRules), withoutCommon)) {
    throw new SkillBenchmarkReducerError(
      'projection-field-invalid',
      'Skill Benchmark projection does not match the closed field-kind schema',
      'projection',
    );
  }
  try {
    assertDeepImprovementCommonProjectionState(common);
  } catch {
    throw new SkillBenchmarkReducerError(
      'projection-field-invalid',
      'The nested common projection failed its own closed schema',
      'common',
    );
  }
  // Closed-field and nested-common guards establish the composite projection shape.
  assertReferentialIntegrity(value as unknown as SkillBenchmarkProjectionState);
}

/** Validate the complete comparison-only legacy projection. */
export function assertSkillBenchmarkLegacyProjection(
  value: unknown,
): asserts value is SkillBenchmarkLegacyProjection {
  if (!isObject(value)) {
    throw new SkillBenchmarkReducerError(
      'projection-field-invalid',
      'Skill Benchmark legacy projection does not match its complete closed schema',
      'legacyProjection',
    );
  }
  const { common, ...withoutCommon } = value;
  const { common: _commonRule, ...nonCommonRules } = LEGACY_RULE.fields;
  if (!isFieldValue(objectRule(nonCommonRules), withoutCommon)) {
    throw new SkillBenchmarkReducerError(
      'projection-field-invalid',
      'Skill Benchmark legacy projection does not match its complete closed schema',
      'legacyProjection',
    );
  }
  try {
    assertDeepImprovementCommonLegacyProjection(common);
  } catch {
    throw new SkillBenchmarkReducerError(
      'projection-field-invalid',
      'The nested common legacy projection failed its complete closed schema',
      'legacyProjection.common',
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
