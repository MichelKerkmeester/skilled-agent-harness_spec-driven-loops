// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Projection Schema
// ───────────────────────────────────────────────────────────────────

import { canonicalJson } from '../event-envelope/index.js';

import type {
  DeepAlignmentLegacyProjection,
  DeepAlignmentProjectionState,
  DeepAlignmentReducerErrorCode,
} from './deep-alignment-projection-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED FIELD RULES
// ───────────────────────────────────────────────────────────────────

const HASH_PATTERN = /^[a-f0-9]{64}$/u;
const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@#-]{0,255}$/u;

const PROJECTION_FIELDS = Object.freeze([
  'schemaVersion',
  'reducerVersion',
  'codecVersion',
  'orderingPolicyVersion',
  'run',
  'reviewLoop',
  'authorityAlignment',
  'lanePlan',
  'applicability',
  'conformance',
  'proofWitness',
  'artifactIndex',
  'status',
  'cursors',
  'seenEvents',
] as const);

const LEGACY_FIELDS = Object.freeze([
  'authority',
  'legacyAuthority',
  'iteration',
  'status',
  'terminalDecision',
  'lanes',
  'applicability',
  'verdicts',
  'artifacts',
  'projectionHealth',
  'parityFingerprint',
] as const);

const NESTED_FIELDS = Object.freeze({
  run: ['runId', 'sessionId', 'authorityEpochId', 'generation', 'target',
    'maxIterations', 'convergencePolicyVersion', 'alignmentModeContractDigest',
    'initializationEventId'],
  reviewLoop: ['configuration', 'scope', 'coverageCells', 'passes', 'obligations',
    'evaluations', 'currentIterationId', 'eligibility', 'outcome',
    'terminalDecision', 'blockerIds', 'lastAppliedSequence'],
  reviewLoopConfiguration: ['mode', 'requiredCoveragePolicy', 'hardVetoClasses',
    'terminalDecisionPolicy'],
  scope: ['targetSetDigest', 'scopeClass', 'targets', 'orderedDimensionIds',
    'scopeEvidenceRefs', 'orderingPolicyVersion'],
  authorityAlignment: ['references', 'validations', 'compatibilities',
    'witnessReplays', 'activeValidationEventId', 'status'],
  lanePlan: ['plans', 'subjects', 'lanes'],
  applicability: ['decisions', 'coverage'],
  conformance: ['observations', 'reconciliations', 'candidates', 'verifications',
    'adjudications', 'findings', 'assessments', 'deviations', 'laneVerdicts',
    'overallVerdict', 'activeFindingIds', 'hardVetoFindingIds'],
  proofWitness: ['evidenceReceipts', 'witnesses'],
  artifactIndex: ['artifacts'],
  status: ['state', 'terminal', 'health', 'activeContractVersions',
    'activeAuthorityEpochs', 'laneStatuses', 'lastAppliedSequence',
    'blockingReason', 'shadowParityState', 'provenance'],
  cursors: ['reviewLoop', 'authorityAlignment', 'lanePlan', 'applicability',
    'conformance', 'proofWitness', 'artifactIndex', 'status'],
} as const);

const RECORD_FIELDS = Object.freeze({
  coverageCells: ['iterationId', 'dimensionId', 'required', 'status', 'passNumber',
    'searchCoverageDigest', 'producerEventId'],
  passes: ['iterationId', 'dimensionId', 'passNumber', 'targetRefs',
    'filesReviewed', 'searchCoverageDigest', 'status', 'nextFocusRef',
    'producerEventId'],
  obligations: ['obligationId', 'ownerLaneId', 'kind', 'required', 'status',
    'producerEventId'],
  evaluations: ['iterationId', 'decision', 'rawSignals', 'weightedSignals',
    'dimensionCoverageDigest', 'protocolCoverageDigest', 'findingStability',
    'p0p1ResolutionState', 'evidenceDensity', 'hotspotSaturation',
    'policyFingerprint', 'blockerIds', 'stopCandidate', 'graphDecision',
    'graphDigest', 'producerEventId', 'streamId'],
  references: ['authorityEpochId', 'authorityId', 'authorityCapsuleRef',
    'authoritySourceDigest', 'compilerFingerprint', 'profileDigest',
    'ruleIrDigest', 'signatureDigest', 'expiresAt', 'rollbackRef',
    'producerEventId'],
  validations: ['authorityEpochId', 'authorityReferenceEventId', 'checks',
    'authorityStatus', 'validationReceiptRefs', 'validatorFingerprint',
    'validationDigest', 'blockedReasonCode', 'producerEventId'],
  compatibilities: ['sourceAuthorityEpochId', 'targetAuthorityEpochId',
    'compatibilityClass', 'direction', 'affectedRuleIds', 'comparisonDigest',
    'reasonCode', 'orderedUpcastPath', 'ambiguous', 'lossy', 'producerEventId'],
  witnessReplays: ['proofId', 'laneId', 'subjectId', 'sourceAuthorityEpochId',
    'targetAuthorityEpochId', 'witnessEventId', 'compatibilityDecisionEventId',
    'replayOutcome', 'replayDigest', 'producerEventId'],
  plans: ['laneId', 'iterationId', 'authorityEpochId', 'laneKind',
    'orderedRuleIds', 'ruleIrRef', 'ruleIrDigest', 'verifierPolicyVersion',
    'budgetRef', 'requiredEvidenceClasses', 'planDigest', 'producerEventId'],
  subjects: ['subjectId', 'laneId', 'subjectSnapshotRef', 'subjectType',
    'subjectDigest', 'sourceVersionRef', 'capturedAt', 'parentSnapshotRef',
    'receiptRef', 'producerEventId'],
  lanes: ['laneId', 'iterationId', 'lanePlanEventId',
    'authorityValidationEventId', 'subjectSnapshotRef', 'subjectSnapshotDigest',
    'status', 'counts', 'applicabilityDecisionRefs', 'observationRefs',
    'verificationRefs', 'completionDigest', 'blockedReasonCode',
    'producerEventId'],
  decisions: ['decisionId', 'laneId', 'subjectId', 'ruleId',
    'authorityValidationEventId', 'result', 'predicateRef', 'predicateDigest',
    'targetFactRefs', 'targetFactDigest', 'evaluatorFingerprint',
    'decisionDigest', 'reasonCode', 'producerEventId'],
  applicabilityCoverage: ['laneId', 'authorityValidationEventId',
    'subjectSnapshotDigest', 'declaredApplicabilityEdgeRefs',
    'applicableRuleIds', 'notApplicableRuleIds', 'unresolvedRuleIds',
    'untestedRuleIds', 'blockedRuleIds', 'coverageDigest', 'producerEventId'],
  observations: ['observationId', 'laneId', 'subjectId', 'ruleId',
    'applicabilityDecisionId', 'subjectSnapshotRef', 'subjectSnapshotDigest',
    'detectorFingerprint', 'observationKind', 'rawResultDigest', 'sourceDigest',
    'contentDigest', 'evidenceClass', 'freshness', 'causalRelevance', 'locator',
    'receiptRefs', 'producerEventId'],
  reconciliations: ['observationId', 'observationEventId',
    'predecessorObservationEventId', 'evidenceReceiptRefs', 'outcome',
    'evidenceSetDigest', 'reconcilerFingerprint', 'reasonCode',
    'producerEventId'],
  candidates: ['candidateId', 'laneId', 'subjectId', 'ruleId', 'observationId',
    'observationEventId', 'applicabilityDecisionId', 'evidenceReceiptRefs',
    'detectorFingerprint', 'detectorBlindingDigest', 'candidateClaimDigest',
    'findingClass', 'rawImpact', 'rawConfidence', 'rawCandidateScore',
    'scorerFingerprint', 'scoringPolicyVersion', 'semanticFingerprint',
    'sourcePassEventId', 'producerEventId'],
  verifications: ['verificationId', 'findingId', 'candidateId', 'observationId',
    'candidateEventId', 'observationEventId', 'authorityValidationEventId',
    'subjectSnapshotRef', 'subjectSnapshotDigest', 'applicabilityDecisionId',
    'evidenceReceiptRefs', 'verifierFingerprint', 'verifierIndependenceDigest',
    'proofWitnessRefs', 'verificationMode', 'result', 'rawImpact',
    'rawConfidence', 'evidenceStrength', 'counterevidenceRefs',
    'verificationDigest', 'producerEventId'],
  adjudications: ['findingId', 'candidateId', 'verificationId', 'observationId',
    'candidateEventId', 'verificationEventId', 'observationEventId',
    'claimDigest', 'evidenceReceiptRefs', 'proofWitnessRefs',
    'counterevidenceRefs', 'verifierFingerprint', 'assessorFingerprint',
    'authorityValidationEventId', 'applicabilityDecisionId',
    'subjectSnapshotDigest', 'impact', 'confidence', 'outcome', 'transition',
    'adjudicationDigest', 'predecessorAdjudicationEventId', 'derivedSeverity',
    'hardVeto', 'producerEventId'],
  findings: ['findingId', 'candidateId', 'laneId', 'subjectId', 'ruleId',
    'observationId', 'findingClass', 'lifecycle', 'adjudicationOutcome',
    'impact', 'confidence', 'derivedSeverity', 'hardVeto', 'candidateEventId',
    'verificationEventId', 'adjudicationEventId', 'predecessorEventId'],
  assessments: ['findingId', 'laneId', 'subjectId', 'ruleId',
    'adjudicationEventId', 'verificationEventId', 'authorityValidationEventId',
    'applicabilityDecisionId', 'conformanceStatus', 'rawImpact',
    'rawConfidence', 'verifierFingerprint', 'proofWitnessRefs',
    'evidenceReceiptRefs', 'assessmentPolicyVersion', 'assessmentDigest',
    'producerEventId'],
  deviations: ['deviationId', 'findingId', 'originalFindingEventId',
    'conformanceAssessmentEventId', 'authorityEpochRef', 'verifierFingerprint',
    'issuerId', 'rationale', 'scopePredicateRef', 'scopePredicateDigest',
    'subjectSnapshotDigest', 'expiresAt', 'invalidationConditionRefs', 'status',
    'invalidationEventId', 'producerEventId'],
  laneVerdicts: ['laneId', 'verdict', 'blockerIds', 'findingIds'],
  evidenceReceipts: ['evidenceId', 'observationId', 'observationEventId',
    'laneId', 'subjectId', 'ruleId', 'receiptRef', 'receiptDigest',
    'evidenceClass', 'freshness', 'sourceDigest', 'contentDigest',
    'toolFingerprint', 'capturedAt', 'producerEventId'],
  witnesses: ['proofId', 'findingId', 'candidateId', 'verificationId',
    'verificationEventId', 'witnessKind', 'artifactRef', 'witnessDigest',
    'sourceDigest', 'locator', 'minimized', 'minimizerFingerprint',
    'replayRecipeRef', 'replayRecipeDigest', 'outcome', 'receiptRefs',
    'producerEventId'],
  artifacts: ['artifactId', 'logicalArtifactId', 'artifactKind',
    'producerEventId', 'ownerEntityId', 'reviewedInputIdentity',
    'contentDigest', 'availability', 'freshness', 'authorityEpochId',
    'verifierRevision', 'supersedesArtifactIds', 'supersededByArtifactIds'],
  laneStatuses: ['laneId', 'status'],
  provenance: ['state', 'producerEventId', 'producerStem', 'streamId',
    'logicalSequence', 'blockingReason'],
  seenEvents: ['eventId', 'eventDigest', 'stem', 'streamId', 'streamSequence'],
} as const);

// ───────────────────────────────────────────────────────────────────
// 2. VALIDATION
// ───────────────────────────────────────────────────────────────────

export class DeepAlignmentReducerError extends Error {
  public readonly code: DeepAlignmentReducerErrorCode;
  public readonly field: string | null;

  public constructor(
    code: DeepAlignmentReducerErrorCode,
    message: string,
    field: string | null = null,
  ) {
    super(message);
    this.name = 'DeepAlignmentReducerError';
    this.code = code;
    this.field = field;
    Object.setPrototypeOf(this, DeepAlignmentReducerError.prototype);
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function assertExactFields(
  value: unknown,
  fields: readonly string[],
  path: string,
): asserts value is Record<string, unknown> {
  if (!isObject(value)) {
    throw new DeepAlignmentReducerError(
      'projection-field-invalid',
      `${path} must be a plain object`,
      path,
    );
  }
  const actual = Object.keys(value).sort();
  const expected = [...fields].sort();
  if (canonicalJson(actual) !== canonicalJson(expected)) {
    throw new DeepAlignmentReducerError(
      'projection-field-undeclared',
      `${path} contains a missing or undeclared field`,
      path,
    );
  }
}

function assertPlainJson(value: unknown, path: string): void {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new DeepAlignmentReducerError(
        'projection-field-invalid',
        `${path} must contain finite numbers`,
        path,
      );
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertPlainJson(entry, `${path}[${index}]`));
    return;
  }
  if (isObject(value)) {
    Object.entries(value).forEach(([field, child]) => (
      assertPlainJson(child, `${path}.${field}`)
    ));
    return;
  }
  throw new DeepAlignmentReducerError(
    'projection-field-invalid',
    `${path} must contain canonical JSON values only`,
    path,
  );
}

function assertRecordArray(
  value: unknown,
  fields: readonly string[],
  path: string,
): void {
  if (!Array.isArray(value)) {
    throw new DeepAlignmentReducerError(
      'projection-field-invalid',
      `${path} must be an array`,
      path,
    );
  }
  value.forEach((entry, index) => assertExactFields(
    entry,
    fields,
    `${path}[${index}]`,
  ));
}

function assertClosedProjectionFields(value: Record<string, unknown>): void {
  assertExactFields(value.run, NESTED_FIELDS.run, 'projection.run');
  assertExactFields(value.reviewLoop, NESTED_FIELDS.reviewLoop, 'projection.reviewLoop');
  assertExactFields(
    value.reviewLoop.configuration,
    NESTED_FIELDS.reviewLoopConfiguration,
    'projection.reviewLoop.configuration',
  );
  assertExactFields(value.reviewLoop.scope, NESTED_FIELDS.scope, 'projection.reviewLoop.scope');
  assertExactFields(
    value.authorityAlignment,
    NESTED_FIELDS.authorityAlignment,
    'projection.authorityAlignment',
  );
  assertExactFields(value.lanePlan, NESTED_FIELDS.lanePlan, 'projection.lanePlan');
  assertExactFields(
    value.applicability,
    NESTED_FIELDS.applicability,
    'projection.applicability',
  );
  assertExactFields(value.conformance, NESTED_FIELDS.conformance, 'projection.conformance');
  assertExactFields(
    value.proofWitness,
    NESTED_FIELDS.proofWitness,
    'projection.proofWitness',
  );
  assertExactFields(
    value.artifactIndex,
    NESTED_FIELDS.artifactIndex,
    'projection.artifactIndex',
  );
  assertExactFields(value.status, NESTED_FIELDS.status, 'projection.status');
  assertExactFields(value.cursors, NESTED_FIELDS.cursors, 'projection.cursors');

  assertRecordArray(
    value.reviewLoop.coverageCells,
    RECORD_FIELDS.coverageCells,
    'projection.reviewLoop.coverageCells',
  );
  assertRecordArray(value.reviewLoop.passes, RECORD_FIELDS.passes, 'projection.reviewLoop.passes');
  assertRecordArray(
    value.reviewLoop.obligations,
    RECORD_FIELDS.obligations,
    'projection.reviewLoop.obligations',
  );
  assertRecordArray(
    value.reviewLoop.evaluations,
    RECORD_FIELDS.evaluations,
    'projection.reviewLoop.evaluations',
  );
  assertRecordArray(
    value.authorityAlignment.references,
    RECORD_FIELDS.references,
    'projection.authorityAlignment.references',
  );
  assertRecordArray(
    value.authorityAlignment.validations,
    RECORD_FIELDS.validations,
    'projection.authorityAlignment.validations',
  );
  assertRecordArray(
    value.authorityAlignment.compatibilities,
    RECORD_FIELDS.compatibilities,
    'projection.authorityAlignment.compatibilities',
  );
  assertRecordArray(
    value.authorityAlignment.witnessReplays,
    RECORD_FIELDS.witnessReplays,
    'projection.authorityAlignment.witnessReplays',
  );
  assertRecordArray(value.lanePlan.plans, RECORD_FIELDS.plans, 'projection.lanePlan.plans');
  assertRecordArray(
    value.lanePlan.subjects,
    RECORD_FIELDS.subjects,
    'projection.lanePlan.subjects',
  );
  assertRecordArray(value.lanePlan.lanes, RECORD_FIELDS.lanes, 'projection.lanePlan.lanes');
  assertRecordArray(
    value.applicability.decisions,
    RECORD_FIELDS.decisions,
    'projection.applicability.decisions',
  );
  assertRecordArray(
    value.applicability.coverage,
    RECORD_FIELDS.applicabilityCoverage,
    'projection.applicability.coverage',
  );
  const conformance = value.conformance;
  for (const [field, fields] of [
    ['observations', RECORD_FIELDS.observations],
    ['reconciliations', RECORD_FIELDS.reconciliations],
    ['candidates', RECORD_FIELDS.candidates],
    ['verifications', RECORD_FIELDS.verifications],
    ['adjudications', RECORD_FIELDS.adjudications],
    ['findings', RECORD_FIELDS.findings],
    ['assessments', RECORD_FIELDS.assessments],
    ['deviations', RECORD_FIELDS.deviations],
    ['laneVerdicts', RECORD_FIELDS.laneVerdicts],
  ] as const) {
    assertRecordArray(
      conformance[field],
      fields,
      `projection.conformance.${field}`,
    );
  }
  assertRecordArray(
    value.proofWitness.evidenceReceipts,
    RECORD_FIELDS.evidenceReceipts,
    'projection.proofWitness.evidenceReceipts',
  );
  assertRecordArray(
    value.proofWitness.witnesses,
    RECORD_FIELDS.witnesses,
    'projection.proofWitness.witnesses',
  );
  assertRecordArray(
    value.artifactIndex.artifacts,
    RECORD_FIELDS.artifacts,
    'projection.artifactIndex.artifacts',
  );
  assertRecordArray(value.status.laneStatuses, RECORD_FIELDS.laneStatuses, 'projection.status.laneStatuses');
  assertRecordArray(value.status.provenance, RECORD_FIELDS.provenance, 'projection.status.provenance');
  assertRecordArray(value.seenEvents, RECORD_FIELDS.seenEvents, 'projection.seenEvents');
}

function assertVersion(value: unknown, field: string): void {
  if (typeof value !== 'string' || !TOKEN_PATTERN.test(value)) {
    throw new DeepAlignmentReducerError(
      'projection-field-invalid',
      `${field} must be a bounded version token`,
      field,
    );
  }
}

function assertDigest(value: unknown, field: string): void {
  if (typeof value !== 'string' || !HASH_PATTERN.test(value)) {
    throw new DeepAlignmentReducerError(
      'projection-field-invalid',
      `${field} must be a lowercase sha256 digest`,
      field,
    );
  }
}

function assertProjectionReferences(projection: DeepAlignmentProjectionState): void {
  const eventIds = new Set(projection.seenEvents.map((event) => event.eventId));
  const ownedEvent = (eventId: string, stem?: string): boolean => projection.seenEvents.some(
    (event) => event.eventId === eventId && (stem === undefined || event.stem === stem),
  );

  if (projection.run.initializationEventId !== null
    && !ownedEvent(projection.run.initializationEventId, 'deep_alignment.run_initialized')) {
    throw new DeepAlignmentReducerError(
      'referential-integrity',
      'Run initialization must cite the captured genesis event',
      'run.initializationEventId',
    );
  }
  if (projection.artifactIndex.artifacts.some(
    (artifact) => !eventIds.has(artifact.producerEventId),
  )) {
    throw new DeepAlignmentReducerError(
      'referential-integrity',
      'Artifact provenance must cite a captured producer event',
      'artifactIndex.artifacts.producerEventId',
    );
  }

  const observationsByEvent = new Map(
    projection.conformance.observations.map((entry) => [entry.producerEventId, entry]),
  );
  const candidatesByEvent = new Map(
    projection.conformance.candidates.map((entry) => [entry.producerEventId, entry]),
  );
  const verificationsByEvent = new Map(
    projection.conformance.verifications.map((entry) => [entry.producerEventId, entry]),
  );
  const adjudicationsByEvent = new Map(
    projection.conformance.adjudications.map((entry) => [entry.producerEventId, entry]),
  );

  for (const receipt of projection.proofWitness.evidenceReceipts) {
    const observation = observationsByEvent.get(receipt.observationEventId);
    if (observation === undefined
      || observation.observationId !== receipt.observationId
      || observation.laneId !== receipt.laneId
      || observation.subjectId !== receipt.subjectId
      || observation.ruleId !== receipt.ruleId) {
      throw new DeepAlignmentReducerError(
        'referential-integrity',
        'Evidence receipts must cite an observation owned by the same rule subject',
        'proofWitness.evidenceReceipts.observationEventId',
      );
    }
  }
  for (const verification of projection.conformance.verifications) {
    const candidate = candidatesByEvent.get(verification.candidateEventId);
    const observation = observationsByEvent.get(verification.observationEventId);
    if (candidate === undefined
      || observation === undefined
      || candidate.candidateId !== verification.candidateId
      || candidate.observationId !== verification.observationId
      || observation.observationId !== verification.observationId) {
      throw new DeepAlignmentReducerError(
        'referential-integrity',
        'Verification provenance must remain owned by one candidate and observation',
        'conformance.verifications',
      );
    }
  }
  for (const witness of projection.proofWitness.witnesses) {
    const verification = verificationsByEvent.get(witness.verificationEventId);
    if (verification === undefined
      || verification.verificationId !== witness.verificationId
      || verification.candidateId !== witness.candidateId
      || verification.findingId !== witness.findingId) {
      throw new DeepAlignmentReducerError(
        'referential-integrity',
        'Proof witnesses must cite verification owned by the same finding',
        'proofWitness.witnesses.verificationEventId',
      );
    }
  }
  for (const assessment of projection.conformance.assessments) {
    const adjudication = adjudicationsByEvent.get(assessment.adjudicationEventId);
    const verification = verificationsByEvent.get(assessment.verificationEventId);
    if (adjudication === undefined
      || verification === undefined
      || adjudication.findingId !== assessment.findingId
      || verification.findingId !== assessment.findingId) {
      throw new DeepAlignmentReducerError(
        'referential-integrity',
        'Conformance assessments must cite adjudication and verification for one finding',
        'conformance.assessments',
      );
    }
  }

  const candidateOwners = new Map<string, string>();
  for (const candidate of projection.conformance.candidates) {
    const owner = canonicalJson({
      laneId: candidate.laneId,
      subjectId: candidate.subjectId,
      ruleId: candidate.ruleId,
      observationId: candidate.observationId,
    });
    const prior = candidateOwners.get(candidate.candidateId);
    if (prior !== undefined && prior !== owner) {
      throw new DeepAlignmentReducerError(
        'referential-integrity',
        'Candidate identities cannot cross rule-subject owners',
        'conformance.candidates.candidateId',
      );
    }
    candidateOwners.set(candidate.candidateId, owner);
  }

  if (projection.status.terminal) {
    for (const finding of projection.conformance.findings) {
      if (finding.adjudicationEventId === null) continue;
      const adjudication = adjudicationsByEvent.get(finding.adjudicationEventId);
      if (adjudication === undefined || adjudication.candidateId !== finding.candidateId) {
        throw new DeepAlignmentReducerError(
          'referential-integrity',
          'Terminal findings require their own typed adjudication',
          'conformance.findings.adjudicationEventId',
        );
      }
    }
  }
}

/** Validate the closed projection surface and all ownership-bearing references. */
export function assertDeepAlignmentProjectionState(
  value: unknown,
): asserts value is DeepAlignmentProjectionState {
  assertExactFields(value, PROJECTION_FIELDS, 'projection');
  assertPlainJson(value, 'projection');
  assertClosedProjectionFields(value);
  assertVersion(value.schemaVersion, 'schemaVersion');
  assertVersion(value.reducerVersion, 'reducerVersion');
  assertVersion(value.codecVersion, 'codecVersion');
  assertVersion(value.orderingPolicyVersion, 'orderingPolicyVersion');
  if (!Array.isArray(value.seenEvents)) {
    throw new DeepAlignmentReducerError(
      'projection-field-invalid',
      'seenEvents must be an array',
      'seenEvents',
    );
  }
  for (const event of value.seenEvents) {
    assertDigest((event as { eventDigest?: unknown }).eventDigest, 'seenEvents.eventDigest');
  }
  assertProjectionReferences(value as unknown as DeepAlignmentProjectionState);
}

/** Validate the complete shadow-only legacy comparison projection. */
export function assertDeepAlignmentLegacyProjection(
  value: unknown,
): asserts value is DeepAlignmentLegacyProjection {
  assertExactFields(value, LEGACY_FIELDS, 'legacyProjection');
  assertPlainJson(value, 'legacyProjection');
  assertDigest(value.parityFingerprint, 'legacyProjection.parityFingerprint');
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
