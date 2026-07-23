// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Projection Schema
// ───────────────────────────────────────────────────────────────────

import { canonicalJson } from '../event-envelope/index.js';

import type {
  DeepReviewLegacyProjection,
  DeepReviewProjectionState,
  DeepReviewReducerErrorCode,
} from './deep-review-projection-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED FIELD RULES
// ───────────────────────────────────────────────────────────────────

interface ScalarFieldRule {
  readonly kind:
    | 'boolean'
    | 'code'
    | 'digest'
    | 'identifier'
    | 'ratio'
    | 'reference'
    | 'selector'
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
const SYSTEM_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@#-]{0,255}$/u;
const CODE_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,127}$/u;
const SELECTOR_PATTERN = /^[^\u0000-\u001f\u007f\r\n]{1,256}$/u;
const MAX_SELECTOR_SPACES = 16;

const booleanRule = Object.freeze({ kind: 'boolean' } as const);
const codeRule = Object.freeze({ kind: 'code' } as const);
const digestRule = Object.freeze({ kind: 'digest' } as const);
const identifierRule = Object.freeze({ kind: 'identifier' } as const);
const ratioRule = Object.freeze({ kind: 'ratio' } as const);
const referenceRule = Object.freeze({ kind: 'reference' } as const);
const selectorRule = Object.freeze({ kind: 'selector' } as const);
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

const TARGET_RULE = objectRule({
  targetId: identifierRule,
  targetType: enumRule(['artifact', 'directory', 'file', 'repository', 'symbol']),
  artifactRef: referenceRule,
  sourceDigest: digestRule,
  contentDigest: digestRule,
});

const SEMANTIC_FINGERPRINT_RULE = objectRule({
  algorithmVersion: versionRule,
  semanticAnchorDigest: digestRule,
  normalizedContextDigest: digestRule,
  programSliceDigest: digestRule,
  renameMapVersion: versionRule,
  baselineState: enumRule(['absent', 'present', 'unknown']),
});

const EVIDENCE_LOCATOR_RULE = objectRule({
  scheme: enumRule(['artifact', 'file', 'other']),
  artifactRef: referenceRule,
  locatorDigest: digestRule,
  selector: selectorRule,
  startLine: nullableRule(uint32Rule),
  endLine: nullableRule(uint32Rule),
  revision: nullableRule(versionRule),
});

const CONVERGENCE_SIGNALS_RULE = objectRule({
  noveltyRatio: ratioRule,
  coverageRatio: ratioRule,
  findingStabilityRatio: ratioRule,
  evidenceDensityRatio: ratioRule,
  hotspotSaturationRatio: ratioRule,
  observationDigest: digestRule,
});

const CONFIGURATION_RULE = objectRule({
  mode: enumRule(['review', 'alignment']),
  requiredCoveragePolicy: enumRule(['all-required-cells']),
  hardVetoClasses: arrayRule(codeRule),
  terminalDecisionPolicy: enumRule(['typed-transition-only']),
});

const RUN_RULE = objectRule({
  runId: nullableRule(identifierRule),
  sessionId: nullableRule(identifierRule),
  generation: uint32Rule,
  target: nullableRule(TARGET_RULE),
  maxIterations: uint32Rule,
  convergencePolicyVersion: nullableRule(versionRule),
  reviewModeContractDigest: nullableRule(digestRule),
  initializationEventId: nullableRule(identifierRule),
});

const SCOPE_RULE = objectRule({
  targetSetDigest: nullableRule(digestRule),
  scopeClass: nullableRule(enumRule(['bounded', 'repository', 'targeted'])),
  targets: arrayRule(TARGET_RULE),
  orderedDimensionIds: arrayRule(identifierRule),
  scopeEvidenceRefs: arrayRule(referenceRule),
  orderingPolicyVersion: nullableRule(versionRule),
});

const COVERAGE_CELL_RULE = objectRule({
  iterationId: identifierRule,
  dimensionId: identifierRule,
  required: booleanRule,
  status: enumRule(['pending', 'started', 'complete', 'incomplete', 'blocked']),
  passNumber: uint32Rule,
  searchCoverageDigest: nullableRule(digestRule),
  producerEventId: identifierRule,
});

const PASS_RULE = objectRule({
  iterationId: identifierRule,
  dimensionId: identifierRule,
  passNumber: uint32Rule,
  targetRefs: arrayRule(referenceRule),
  filesReviewed: arrayRule(referenceRule),
  searchCoverageDigest: digestRule,
  status: enumRule(['started', 'complete', 'incomplete', 'blocked']),
  nextFocusRef: referenceRule,
  producerEventId: identifierRule,
});

const OBLIGATION_RULE = objectRule({
  obligationId: identifierRule,
  kind: enumRule(['coverage', 'evidence', 'finding', 'protocol', 'review-depth']),
  required: booleanRule,
  status: enumRule(['resolved', 'unresolved', 'blocked']),
  producerEventId: identifierRule,
});

const EVALUATION_RULE = objectRule({
  iterationId: identifierRule,
  decision: enumRule(['blocked', 'continue', 'converged', 'incomplete', 'recover']),
  rawSignals: CONVERGENCE_SIGNALS_RULE,
  weightedSignals: CONVERGENCE_SIGNALS_RULE,
  dimensionCoverageDigest: digestRule,
  protocolCoverageDigest: digestRule,
  findingStability: enumRule(['stable', 'unstable', 'unknown']),
  p0p1ResolutionState: enumRule(['blocked', 'resolved', 'unknown']),
  evidenceDensity: ratioRule,
  hotspotSaturation: ratioRule,
  policyFingerprint: digestRule,
  blockerIds: arrayRule(identifierRule),
  stopCandidate: booleanRule,
  graphDecision: nullableRule(enumRule(['blocked', 'continue', 'converged', 'unavailable'])),
  graphDigest: nullableRule(digestRule),
  producerEventId: identifierRule,
});

const REVIEW_LOOP_RULE = objectRule({
  configuration: CONFIGURATION_RULE,
  scope: SCOPE_RULE,
  coverageCells: arrayRule(COVERAGE_CELL_RULE),
  passes: arrayRule(PASS_RULE),
  obligations: arrayRule(OBLIGATION_RULE),
  evaluations: arrayRule(EVALUATION_RULE),
  currentIterationId: nullableRule(identifierRule),
  eligibility: enumRule(['CONTINUE', 'STOP_ELIGIBLE', 'INDETERMINATE']),
  outcome: enumRule(['active', 'blocked', 'converged', 'incomplete']),
  terminalDecision: nullableRule(enumRule(['blocked', 'fail', 'incomplete', 'pass'])),
  blockerIds: arrayRule(identifierRule),
  lastAppliedSequence: uint32Rule,
});

const EVIDENCE_RULE = objectRule({
  evidenceId: identifierRule,
  candidateId: identifierRule,
  locator: EVIDENCE_LOCATOR_RULE,
  observationKind: enumRule([
    'analyzer-output', 'inspection', 'runtime-witness', 'test-result',
  ]),
  rawResultDigest: digestRule,
  sourceDigest: digestRule,
  contentDigest: digestRule,
  independentEvidenceClass: codeRule,
  causalProximityStatus: enumRule(['direct', 'indirect', 'unknown']),
  stabilityStatus: enumRule(['stable', 'unstable', 'unknown']),
  relevanceStatus: enumRule(['irrelevant', 'relevant', 'unknown']),
  supersedesEvidenceEventId: nullableRule(identifierRule),
  producerEventId: identifierRule,
});

const FINDING_RULE = objectRule({
  findingId: identifierRule,
  candidateId: identifierRule,
  dimensionId: identifierRule,
  sourcePassEventId: identifierRule,
  claimDigest: digestRule,
  findingClass: codeRule,
  evidenceRefs: arrayRule(identifierRule),
  impact: ratioRule,
  confidence: ratioRule,
  reachability: ratioRule,
  exploitability: ratioRule,
  evidenceStrength: ratioRule,
  evidenceType: enumRule(['analyzer', 'inspection', 'runtime', 'test']),
  evidenceScope: enumRule(['direct', 'indirect', 'partial']),
  lifecycle: enumRule(['candidate', 'adjudicated', 'accepted', 'dismissed', 'fixed']),
  adjudicationOutcome: nullableRule(enumRule([
    'accepted', 'deferred', 'disproved', 'rejected',
  ])),
  semanticFingerprint: SEMANTIC_FINGERPRINT_RULE,
  hardVeto: booleanRule,
  presentationSeverity: enumRule(['none', 'P0', 'P1', 'P2']),
  candidateEventId: identifierRule,
  adjudicationEventId: nullableRule(identifierRule),
  predecessorEventId: nullableRule(identifierRule),
});

const LINEAGE_RULE = objectRule({
  findingId: identifierRule,
  priorFingerprint: SEMANTIC_FINGERPRINT_RULE,
  currentFingerprint: SEMANTIC_FINGERPRINT_RULE,
  relation: enumRule([
    'absent', 'disproved', 'fixed', 'introduced', 'preexisting', 'unchanged', 'updated',
  ]),
  predecessorEventId: identifierRule,
  producerEventId: identifierRule,
});

const FINDING_LEDGER_RULE = objectRule({
  findings: arrayRule(FINDING_RULE),
  evidence: arrayRule(EVIDENCE_RULE),
  lineage: arrayRule(LINEAGE_RULE),
  activeFindingIds: arrayRule(identifierRule),
  hardVetoFindingIds: arrayRule(identifierRule),
});

const ARTIFACT_RULE = objectRule({
  artifactId: identifierRule,
  logicalArtifactId: identifierRule,
  artifactKind: enumRule([
    'raw-finding', 'evidence', 'adjudication', 'challenge-attempt', 'proof-receipt',
    'suppression-record', 'verification-output', 'review-report', 'continuity-save',
  ]),
  producerEventId: identifierRule,
  reviewedInputIdentity: referenceRule,
  contentDigest: digestRule,
  availability: enumRule(['pending', 'available', 'unavailable', 'superseded']),
  supersedesArtifactIds: arrayRule(identifierRule),
  supersededByArtifactIds: arrayRule(identifierRule),
});

const ARTIFACT_INDEX_RULE = objectRule({ artifacts: arrayRule(ARTIFACT_RULE) });

const STATUS_TRANSITION_RULE = objectRule({
  state: enumRule([
    'planned', 'active', 'paused', 'converging', 'complete', 'incomplete',
    'blocked', 'failed',
  ]),
  producerEventId: identifierRule,
  producerStem: codeRule,
  streamId: identifierRule,
  logicalSequence: uint32Rule,
  blockingReason: nullableRule(codeRule),
});

const STATUS_RULE = objectRule({
  state: enumRule([
    'planned', 'active', 'paused', 'converging', 'complete', 'incomplete',
    'blocked', 'failed',
  ]),
  terminal: booleanRule,
  health: enumRule(['healthy', 'blocked', 'rebuild-required']),
  activeContractVersions: arrayRule(versionRule),
  lastAppliedSequence: uint32Rule,
  blockingReason: nullableRule(codeRule),
  shadowParityState: enumRule(['not-run']),
  provenance: arrayRule(STATUS_TRANSITION_RULE),
});

const CURSORS_RULE = objectRule({
  reviewLoop: uint32Rule,
  findings: uint32Rule,
  artifactIndex: uint32Rule,
  status: uint32Rule,
});

const SEEN_EVENT_RULE = objectRule({
  eventId: identifierRule,
  eventDigest: digestRule,
  stem: codeRule,
  streamId: identifierRule,
  streamSequence: uint32Rule,
});

const PROJECTION_RULE = objectRule({
  schemaVersion: versionRule,
  reducerVersion: versionRule,
  codecVersion: versionRule,
  orderingPolicyVersion: versionRule,
  run: RUN_RULE,
  reviewLoop: REVIEW_LOOP_RULE,
  findingLedger: FINDING_LEDGER_RULE,
  artifactIndex: ARTIFACT_INDEX_RULE,
  status: STATUS_RULE,
  cursors: CURSORS_RULE,
  seenEvents: arrayRule(SEEN_EVENT_RULE),
});

const LEGACY_RULE = objectRule({
  authority: enumRule(['shadow-only']),
  legacyAuthority: enumRule(['unchanged']),
  iteration: nullableRule(identifierRule),
  status: enumRule([
    'planned', 'active', 'paused', 'converging', 'complete', 'incomplete',
    'blocked', 'failed',
  ]),
  terminalDecision: nullableRule(enumRule(['blocked', 'fail', 'incomplete', 'pass'])),
  coverage: arrayRule(COVERAGE_CELL_RULE),
  findings: arrayRule(FINDING_RULE),
  artifacts: arrayRule(ARTIFACT_RULE),
  projectionHealth: enumRule(['healthy', 'blocked', 'rebuild-required']),
  parityFingerprint: digestRule,
});

// ───────────────────────────────────────────────────────────────────
// 2. VALIDATION
// ───────────────────────────────────────────────────────────────────

export class DeepReviewReducerError extends Error {
  public readonly code: DeepReviewReducerErrorCode;
  public readonly field: string | null;

  public constructor(
    code: DeepReviewReducerErrorCode,
    message: string,
    field: string | null = null,
  ) {
    super(message);
    this.name = 'DeepReviewReducerError';
    this.code = code;
    this.field = field;
    Object.setPrototypeOf(this, DeepReviewReducerError.prototype);
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
  throw new Error(`Unhandled projection rule: ${String(value)}`);
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
    case 'selector':
      return isSelector(value);
    case 'uint32':
      return isUint32(value);
    case 'enum':
      return typeof value === 'string' && rule.values.includes(value);
    case 'nullable':
      return value === null || isFieldValue(rule.value, value);
    case 'array':
      return Array.isArray(value) && value.every((entry) => isFieldValue(rule.item, entry));
    case 'object': {
      if (!isObject(value)) return false;
      const expected = Object.keys(rule.fields).sort();
      const actual = Object.keys(value).sort();
      return canonicalJson(expected) === canonicalJson(actual)
        && expected.every((field) => isFieldValue(rule.fields[field], value[field]));
    }
  }
  return assertNever(rule);
}

function assertProjectionReferences(projection: DeepReviewProjectionState): void {
  const eventIds = new Set(projection.seenEvents.map((event) => event.eventId));
  const passEventIds = new Set(projection.reviewLoop.passes.map((pass) => pass.producerEventId));
  const candidateIds = new Set<string>();
  const findingOwners = new Map<string, string>();
  for (const finding of projection.findingLedger.findings) {
    if (candidateIds.has(finding.candidateId)) {
      throw new DeepReviewReducerError(
        'referential-integrity',
        'A candidate identity must map to exactly one finding',
        'findingLedger.findings.candidateId',
      );
    }
    candidateIds.add(finding.candidateId);
    const owner = findingOwners.get(finding.findingId);
    if (owner !== undefined && owner !== finding.candidateId) {
      throw new DeepReviewReducerError(
        'referential-integrity',
        'A finding identity must map to exactly one candidate',
        'findingLedger.findings.findingId',
      );
    }
    findingOwners.set(finding.findingId, finding.candidateId);
  }

  const evidenceOwners = new Map<string, string>();
  for (const evidence of projection.findingLedger.evidence) {
    const owner = evidenceOwners.get(evidence.evidenceId);
    if (owner !== undefined && owner !== evidence.candidateId) {
      throw new DeepReviewReducerError(
        'referential-integrity',
        'An evidence identity must map to exactly one candidate',
        'findingLedger.evidence.evidenceId',
      );
    }
    evidenceOwners.set(evidence.evidenceId, evidence.candidateId);
    if (evidence.supersedesEvidenceEventId === null) continue;
    const predecessor = projection.findingLedger.evidence.find(
      (candidate) => candidate.producerEventId === evidence.supersedesEvidenceEventId
        && candidate.candidateId === evidence.candidateId,
    );
    if (predecessor === undefined || predecessor.evidenceId !== evidence.evidenceId) {
      throw new DeepReviewReducerError(
        'referential-integrity',
        'Evidence supersession must retain candidate ownership and logical identity',
        'findingLedger.evidence.supersedesEvidenceEventId',
      );
    }
  }

  if (projection.findingLedger.findings.some(
    (finding) => !passEventIds.has(finding.sourcePassEventId),
  )) {
    throw new DeepReviewReducerError(
      'referential-integrity',
      'Every finding must cite a pass event captured in the folded ledger',
      'findingLedger.findings.sourcePassEventId',
    );
  }
  if (projection.findingLedger.evidence.some(
    (evidence) => evidence.supersedesEvidenceEventId !== null
      && !eventIds.has(evidence.supersedesEvidenceEventId),
  )) {
    throw new DeepReviewReducerError(
      'referential-integrity',
      'Reconciled evidence must cite a captured predecessor event',
      'findingLedger.evidence.supersedesEvidenceEventId',
    );
  }
  if (projection.findingLedger.lineage.some(
    (lineage) => !eventIds.has(lineage.predecessorEventId),
  )) {
    throw new DeepReviewReducerError(
      'referential-integrity',
      'Finding lineage must cite a captured predecessor event',
      'findingLedger.lineage.predecessorEventId',
    );
  }
  if (projection.artifactIndex.artifacts.some(
    (artifact) => !eventIds.has(artifact.producerEventId),
  )) {
    throw new DeepReviewReducerError(
      'referential-integrity',
      'Artifact provenance must cite a captured producer event',
      'artifactIndex.artifacts.producerEventId',
    );
  }
  if (projection.status.terminal && projection.findingLedger.findings.some(
    (finding) => finding.evidenceRefs.some((evidenceId) => (
      !projection.findingLedger.evidence.some(
        (evidence) => evidence.evidenceId === evidenceId
          && evidence.candidateId === finding.candidateId,
      )
    )),
  )) {
    throw new DeepReviewReducerError(
      'referential-integrity',
      'Terminal findings must cite evidence owned by their candidate',
      'findingLedger.findings.evidenceRefs',
    );
  }
}

/** Validate every field and cross-record reference in a projection. */
export function assertDeepReviewProjectionState(
  value: unknown,
): asserts value is DeepReviewProjectionState {
  if (isObject(value)) {
    const expected = Object.keys(PROJECTION_RULE.fields).sort();
    const actual = Object.keys(value).sort();
    if (canonicalJson(expected) !== canonicalJson(actual)) {
      throw new DeepReviewReducerError(
        'projection-field-undeclared',
        'Deep-review projection contains a missing or undeclared persisted field',
        'projection',
      );
    }
  }
  if (!isFieldValue(PROJECTION_RULE, value)) {
    throw new DeepReviewReducerError(
      'projection-field-invalid',
      'Deep-review projection does not match the closed field-kind schema',
      'projection',
    );
  }
  assertProjectionReferences(value as DeepReviewProjectionState);
}

/** Validate the complete shadow-only legacy comparison projection. */
export function assertDeepReviewLegacyProjection(
  value: unknown,
): asserts value is DeepReviewLegacyProjection {
  if (!isFieldValue(LEGACY_RULE, value)) {
    throw new DeepReviewReducerError(
      'projection-field-invalid',
      'Legacy comparison projection does not match its closed schema',
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

/** Report whether an entire projection graph is recursively frozen. */
export function isDeepFrozenProjection(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return true;
  return Object.isFrozen(value) && Object.values(value).every(isDeepFrozenProjection);
}
