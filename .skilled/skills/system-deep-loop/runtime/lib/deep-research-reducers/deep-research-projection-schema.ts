// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Projection Schema
// ───────────────────────────────────────────────────────────────────

import { canonicalJson } from '../event-envelope/index.js';

import type {
  DeepResearchLegacyProjection,
  DeepResearchProjectionState,
  DeepResearchReducerErrorCode,
} from './deep-research-projection-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIELD-RULE TYPES
// ───────────────────────────────────────────────────────────────────

interface ScalarFieldRule {
  readonly kind:
    | 'boolean'
    | 'code'
    | 'digest'
    | 'identifier'
    | 'prose'
    | 'ratio'
    | 'reference'
    | 'selector'
    | 'timestamp'
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
// 2. CONSTANTS AND RULE BUILDERS
// ───────────────────────────────────────────────────────────────────

const HASH_PATTERN = /^[a-f0-9]{64}$/u;
const SYSTEM_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/u;
const CODE_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,127}$/u;
const SELECTOR_PATTERN = /^[^\u0000-\u001f\u007f\r\n]{1,256}$/u;
const MAX_SELECTOR_SPACES = 16;
const MAX_PROSE_LENGTH = 4_096;

const booleanRule = Object.freeze({ kind: 'boolean' } as const);
const codeRule = Object.freeze({ kind: 'code' } as const);
const digestRule = Object.freeze({ kind: 'digest' } as const);
const identifierRule = Object.freeze({ kind: 'identifier' } as const);
const proseRule = Object.freeze({ kind: 'prose' } as const);
const ratioRule = Object.freeze({ kind: 'ratio' } as const);
const referenceRule = Object.freeze({ kind: 'reference' } as const);
const selectorRule = Object.freeze({ kind: 'selector' } as const);
const timestampRule = Object.freeze({ kind: 'timestamp' } as const);
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
  for (const [field, rule] of Object.entries(fields)) {
    if (rule.kind === 'prose' && !field.endsWith('Reason')) {
      throw new Error(`Projection prose field must end in Reason: ${field}`);
    }
  }
  return Object.freeze({ kind: 'object', fields: Object.freeze({ ...fields }) });
}

const SCORE_VECTOR_RULE = objectRule({
  expectedYield: ratioRule,
  contradictionRisk: ratioRule,
  impact: ratioRule,
  independenceGain: ratioRule,
  staleness: ratioRule,
  expectedCost: ratioRule,
});

const SOURCE_LOCATOR_RULE = objectRule({
  scheme: enumRule(['artifact', 'file', 'other', 'url']),
  locatorDigest: digestRule,
  selector: selectorRule,
  revision: nullableRule(versionRule),
});

const PASSAGE_LOCATOR_RULE = objectRule({
  locatorDigest: digestRule,
  selector: selectorRule,
  passageDigest: digestRule,
});

const RAW_SIGNALS_RULE = objectRule({
  newInfoRatio: ratioRule,
  contradictionRisk: ratioRule,
  citationDrift: ratioRule,
  observationDigest: digestRule,
});

const TRUSTED_SIGNALS_RULE = objectRule({
  evidenceYield: ratioRule,
  independentSourceRatio: ratioRule,
  supportedClaimRatio: ratioRule,
  assessmentDigest: digestRule,
});

const QUALITY_GATES_RULE = objectRule({
  sourceDiversity: enumRule(['fail', 'pass', 'unknown']),
  contradictionResolution: enumRule(['fail', 'pass', 'unknown']),
  citationIntegrity: enumRule(['fail', 'pass', 'unknown']),
  policyVersion: versionRule,
  resultDigest: digestRule,
});

// ───────────────────────────────────────────────────────────────────
// 3. CLOSED PROJECTION SCHEMAS
// ───────────────────────────────────────────────────────────────────

const RUN_RULE = objectRule({
  runId: nullableRule(identifierRule),
  lineageId: nullableRule(identifierRule),
  generation: uint32Rule,
  charterDigest: nullableRule(digestRule),
  configDigest: nullableRule(digestRule),
  executorFingerprint: nullableRule(digestRule),
  replayFingerprint: nullableRule(digestRule),
  maxIterations: uint32Rule,
  convergencePolicyVersion: nullableRule(versionRule),
  initializationEventId: nullableRule(identifierRule),
});

const QUESTION_RULE = objectRule({
  questionId: identifierRule,
  normalizedQuestionDigest: digestRule,
  dependencyQuestionIds: arrayRule(identifierRule),
  requiredSourceClasses: arrayRule(codeRule),
  disconfirmingQueryRecipeIds: arrayRule(identifierRule),
  budgetRef: referenceRule,
  producerEventId: identifierRule,
});

const BRANCH_RULE = objectRule({
  questionId: identifierRule,
  branchId: identifierRule,
  semanticClusterId: identifierRule,
  expectedYieldScoreVector: SCORE_VECTOR_RULE,
  contradictionRisk: ratioRule,
  impact: ratioRule,
  independenceGain: ratioRule,
  staleness: ratioRule,
  expectedCost: ratioRule,
  tieBreakKey: codeRule,
  reservationRef: referenceRule,
  lifecycle: enumRule(['planned', 'selected']),
  plannedEventId: nullableRule(identifierRule),
  selectedEventId: nullableRule(identifierRule),
});

const FOCUS_RULE = objectRule({
  iteration: uint32Rule,
  obligationId: identifierRule,
  selectionScoreVector: SCORE_VECTOR_RULE,
  visitCooldown: uint32Rule,
  policyVersion: versionRule,
  chosenBranchId: nullableRule(identifierRule),
  chosenQuestionId: nullableRule(identifierRule),
  producerEventId: identifierRule,
});

const RESEARCH_PLAN_RULE = objectRule({
  planDigest: digestRule,
  questions: arrayRule(QUESTION_RULE),
  branches: arrayRule(BRANCH_RULE),
  focusObligations: arrayRule(FOCUS_RULE),
});

const SOURCE_RULE = objectRule({
  iteration: uint32Rule,
  sourceVersionId: identifierRule,
  sourceIdentityDigest: digestRule,
  locator: SOURCE_LOCATOR_RULE,
  capturedAt: timestampRule,
  contentDigest: digestRule,
  mediaType: codeRule,
  retrievalReceiptRef: referenceRule,
  parentSourceVersionId: nullableRule(identifierRule),
  instructionScanResult: enumRule(['clean', 'flagged', 'unknown']),
  producerEventId: identifierRule,
});

const EVIDENCE_RULE = objectRule({
  iteration: uint32Rule,
  sourceVersionId: identifierRule,
  evidenceId: identifierRule,
  disposition: enumRule(['admit', 'degrade', 'quarantine']),
  passageLocators: arrayRule(PASSAGE_LOCATOR_RULE),
  atomicClaimRefs: arrayRule(referenceRule),
  derivativeSourceGroup: identifierRule,
  admissionPolicyVersion: versionRule,
  contaminationStatus: enumRule(['clean', 'contaminated', 'suspected', 'unknown']),
  reasonCode: codeRule,
  producerEventId: identifierRule,
});

const CLAIM_RULE = objectRule({
  iteration: uint32Rule,
  claimId: identifierRule,
  claimVersionId: identifierRule,
  normalizedClaimDigest: nullableRule(digestRule),
  relatedClaimVersionId: nullableRule(identifierRule),
  relation: enumRule(['asserts', 'contextualizes', 'contradicts', 'qualifies', 'supports']),
  evidenceIds: arrayRule(identifierRule),
  independenceGroup: identifierRule,
  rawConfidence: ratioRule,
  claimStatus: enumRule(['contested', 'supported', 'unresolved']),
  producerEventId: identifierRule,
});

const SUPERSESSION_RULE = objectRule({
  iteration: uint32Rule,
  priorClaimVersionId: identifierRule,
  successorClaimVersionId: identifierRule,
  supersessionReason: proseRule,
  effectiveAt: timestampRule,
  replacementEvidenceIds: arrayRule(identifierRule),
  invalidationScope: codeRule,
  producerEventId: identifierRule,
});

const GAP_RULE = objectRule({
  iteration: uint32Rule,
  obligationId: identifierRule,
  gapKind: enumRule(['contradiction', 'coverage', 'source-diversity', 'verification']),
  affectedClaimIds: arrayRule(identifierRule),
  affectedQuestionIds: arrayRule(identifierRule),
  criticality: ratioRule,
  proposedQueryRecipeIds: arrayRule(identifierRule),
  producerEventId: identifierRule,
});

const CLAIM_LEDGER_RULE = objectRule({
  sources: arrayRule(SOURCE_RULE),
  evidence: arrayRule(EVIDENCE_RULE),
  claims: arrayRule(CLAIM_RULE),
  supersessions: arrayRule(SUPERSESSION_RULE),
  gapObligations: arrayRule(GAP_RULE),
  activeClaimVersionIds: arrayRule(identifierRule),
  contradictionClaimVersionIds: arrayRule(identifierRule),
});

const ITERATION_RECORD_RULE = objectRule({
  iteration: uint32Rule,
  lifecycle: enumRule([
    'planned', 'started', 'complete', 'error', 'insight', 'stuck', 'thought', 'timeout',
  ]),
  focusRef: nullableRule(referenceRule),
  stateTailDigest: nullableRule(digestRule),
  strategyDigest: nullableRule(digestRule),
  startedEventId: nullableRule(identifierRule),
  completedEventId: nullableRule(identifierRule),
  rawNewInfoRatio: nullableRule(ratioRule),
  trustedEvidenceYield: nullableRule(ratioRule),
  outputDigest: nullableRule(digestRule),
  ruledOutApproachRefs: arrayRule(referenceRule),
  nextFocusCausationId: nullableRule(identifierRule),
});

const ITERATION_RULE = objectRule({
  currentIteration: uint32Rule,
  records: arrayRule(ITERATION_RECORD_RULE),
});

const CONVERGENCE_EVALUATION_RULE = objectRule({
  iteration: uint32Rule,
  streamId: identifierRule,
  logicalSequence: uint32Rule,
  decision: enumRule(['blocked', 'continue', 'converged', 'incomplete', 'recover']),
  rawSignals: RAW_SIGNALS_RULE,
  trustedSignals: TRUSTED_SIGNALS_RULE,
  qualityGateResults: QUALITY_GATES_RULE,
  blockerIds: arrayRule(identifierRule),
  policyFingerprint: digestRule,
  evaluatorFingerprint: digestRule,
  evidenceTailHash: digestRule,
  incompleteReason: nullableRule(proseRule),
  recoveryReason: nullableRule(proseRule),
  producerEventId: identifierRule,
});

const CONVERGENCE_RULE = objectRule({
  evaluations: arrayRule(CONVERGENCE_EVALUATION_RULE),
  observedRevision: nullableRule(digestRule),
  finalizedRevision: nullableRule(digestRule),
  eligibility: enumRule(['CONTINUE', 'STOP_ELIGIBLE', 'INDETERMINATE']),
  outcome: enumRule(['active', 'blocked', 'converged', 'incomplete', 'quarantined']),
  trustedEvidenceYield: ratioRule,
  rawNewInfoRatio: ratioRule,
  blockerIds: arrayRule(identifierRule),
});

const ARTIFACT_RULE = objectRule({
  artifactId: identifierRule,
  logicalArtifactId: identifierRule,
  artifactKind: enumRule([
    'source-capture', 'iteration-output', 'research-report', 'continuity-save',
  ]),
  digest: digestRule,
  schemaVersion: versionRule,
  producerEventId: identifierRule,
  streamId: identifierRule,
  logicalSequence: uint32Rule,
  runId: identifierRule,
  lineageId: identifierRule,
  iteration: nullableRule(uint32Rule),
  branchId: nullableRule(identifierRule),
  receiptRefs: arrayRule(referenceRule),
  observedValidityState: enumRule([
    'pending', 'valid', 'invalid', 'unknown', 'unavailable',
  ]),
  validityState: enumRule([
    'pending', 'valid', 'invalid', 'unknown', 'superseded', 'unavailable',
  ]),
  supersedesArtifactIds: arrayRule(identifierRule),
  supersededByArtifactIds: arrayRule(identifierRule),
});

const ARTIFACT_INDEX_RULE = objectRule({ artifacts: arrayRule(ARTIFACT_RULE) });

const STATUS_TRANSITION_RULE = objectRule({
  state: enumRule([
    'planned', 'active', 'paused', 'awaiting-evidence', 'converged', 'incomplete',
    'blocked', 'quarantined', 'failed',
  ]),
  producerEventId: identifierRule,
  producerStem: codeRule,
  streamId: identifierRule,
  logicalSequence: uint32Rule,
  transitionReason: nullableRule(proseRule),
});

const STATUS_RULE = objectRule({
  state: enumRule([
    'planned', 'active', 'paused', 'awaiting-evidence', 'converged', 'incomplete',
    'blocked', 'quarantined', 'failed',
  ]),
  terminal: booleanRule,
  provenance: arrayRule(STATUS_TRANSITION_RULE),
});

const CURSORS_RULE = objectRule({
  researchPlan: uint32Rule,
  claimLedger: uint32Rule,
  iteration: uint32Rule,
  convergence: uint32Rule,
  artifactIndex: uint32Rule,
  status: uint32Rule,
});

const SEEN_EVENT_RULE = objectRule({
  eventId: identifierRule,
  eventDigest: digestRule,
  streamId: identifierRule,
  streamSequence: uint32Rule,
});

const PROJECTION_RULE = objectRule({
  schemaVersion: versionRule,
  reducerVersion: versionRule,
  codecVersion: versionRule,
  orderingPolicyVersion: versionRule,
  run: RUN_RULE,
  researchPlan: RESEARCH_PLAN_RULE,
  claimLedger: CLAIM_LEDGER_RULE,
  iterations: ITERATION_RULE,
  convergence: CONVERGENCE_RULE,
  artifactIndex: ARTIFACT_INDEX_RULE,
  status: STATUS_RULE,
  cursors: CURSORS_RULE,
  seenEvents: arrayRule(SEEN_EVENT_RULE),
});

const LEGACY_PROJECTION_RULE = objectRule({
  authority: enumRule(['shadow-only']),
  legacyAuthority: enumRule(['unchanged']),
  iteration: uint32Rule,
  status: enumRule([
    'planned', 'active', 'paused', 'awaiting-evidence', 'converged', 'incomplete',
    'blocked', 'quarantined', 'failed',
  ]),
  newInfoRatio: ratioRule,
  trustedEvidenceYield: ratioRule,
  nextFocusRef: nullableRule(referenceRule),
  lossyFields: arrayRule(codeRule),
});

// ───────────────────────────────────────────────────────────────────
// 4. VALIDATION
// ───────────────────────────────────────────────────────────────────

export class DeepResearchReducerError extends Error {
  public readonly code: DeepResearchReducerErrorCode;
  public readonly field: string | null;

  public constructor(
    code: DeepResearchReducerErrorCode,
    message: string,
    field: string | null = null,
  ) {
    super(message);
    this.name = 'DeepResearchReducerError';
    this.code = code;
    this.field = field;
    Object.setPrototypeOf(this, DeepResearchReducerError.prototype);
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function isUint32(value: unknown): value is number {
  return Number.isSafeInteger(value) && Number(value) >= 0 && Number(value) <= 0xffff_ffff;
}

function isRatio(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1;
}

function isSelector(value: unknown): value is string {
  return typeof value === 'string'
    && value.trim().length > 0
    && SELECTOR_PATTERN.test(value)
    && (value.match(/\s/gu)?.length ?? 0) <= MAX_SELECTOR_SPACES;
}

function assertNever(value: never): never {
  throw new Error(`Unhandled projection field rule: ${String(value)}`);
}

function isFieldValue(rule: ProjectionFieldRule, value: unknown, field: string): boolean {
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
    case 'prose':
      return field.endsWith('Reason')
        && typeof value === 'string'
        && value.trim().length > 0
        && value.length <= MAX_PROSE_LENGTH;
    case 'ratio':
      return isRatio(value);
    case 'selector':
      return isSelector(value);
    case 'timestamp':
      return typeof value === 'string'
        && value.length <= 64
        && !Number.isNaN(new Date(value).getTime());
    case 'uint32':
      return isUint32(value);
    case 'enum':
      return typeof value === 'string' && rule.values.includes(value);
    case 'nullable':
      return value === null || isFieldValue(rule.value, value, field);
    case 'array':
      return Array.isArray(value)
        && value.every((entry) => isFieldValue(rule.item, entry, field));
    case 'object': {
      if (!isObject(value)) return false;
      const expectedFields = Object.keys(rule.fields).sort();
      const actualFields = Object.keys(value).sort();
      if (canonicalJson(expectedFields) !== canonicalJson(actualFields)) return false;
      return expectedFields.every((childField) => (
        isFieldValue(rule.fields[childField], value[childField], childField)
      ));
    }
  }
  return assertNever(rule);
}

function assertTerminalClaimLedgerReferences(
  projection: DeepResearchProjectionState,
): void {
  if (!projection.status.terminal) return;
  const sourceVersionIds = new Set(
    projection.claimLedger.sources.map((source) => source.sourceVersionId),
  );
  const evidenceIds = new Set(
    projection.claimLedger.evidence.map((evidence) => evidence.evidenceId),
  );
  const claimVersionIds = new Set(
    projection.claimLedger.claims.map((claim) => claim.claimVersionId),
  );
  if (projection.claimLedger.evidence.some(
    (evidence) => !sourceVersionIds.has(evidence.sourceVersionId),
  )) {
    throw new DeepResearchReducerError(
      'projection-field-invalid',
      'Terminal evidence must reference a captured source version',
      'claimLedger.evidence.sourceVersionId',
    );
  }
  if (projection.claimLedger.claims.some(
    (claim) => claim.evidenceIds.some((evidenceId) => !evidenceIds.has(evidenceId)),
  )) {
    throw new DeepResearchReducerError(
      'projection-field-invalid',
      'Terminal claims must reference projected evidence records',
      'claimLedger.claims.evidenceIds',
    );
  }
  if (projection.claimLedger.activeClaimVersionIds.some(
    (claimVersionId) => !claimVersionIds.has(claimVersionId),
  )) {
    throw new DeepResearchReducerError(
      'projection-field-invalid',
      'Terminal active claim identities must reference projected claims',
      'claimLedger.activeClaimVersionIds',
    );
  }
}

/** Validate every field in the closed deep-research projection schema. */
export function assertDeepResearchProjectionState(
  value: unknown,
): asserts value is DeepResearchProjectionState {
  if (isObject(value)) {
    const expectedFields = Object.keys(PROJECTION_RULE.fields).sort();
    const actualFields = Object.keys(value).sort();
    if (canonicalJson(expectedFields) !== canonicalJson(actualFields)) {
      throw new DeepResearchReducerError(
        'projection-field-undeclared',
        'Deep-research projection contains a missing or undeclared persisted field',
        'projection',
      );
    }
  }
  if (!isFieldValue(PROJECTION_RULE, value, 'projection')) {
    throw new DeepResearchReducerError(
      'projection-field-invalid',
      'Deep-research projection does not match the closed field-kind schema',
      'projection',
    );
  }
  assertTerminalClaimLedgerReferences(value as DeepResearchProjectionState);
}

/** Validate the comparison-only legacy projection against its closed schema. */
export function assertDeepResearchLegacyProjection(
  value: unknown,
): asserts value is DeepResearchLegacyProjection {
  if (!isFieldValue(LEGACY_PROJECTION_RULE, value, 'legacyProjection')) {
    throw new DeepResearchReducerError(
      'projection-field-invalid',
      'Legacy comparison projection does not match the closed field-kind schema',
      'legacyProjection',
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
  return Object.isFrozen(value) && Object.values(value).every(isDeepFrozenProjection);
}
