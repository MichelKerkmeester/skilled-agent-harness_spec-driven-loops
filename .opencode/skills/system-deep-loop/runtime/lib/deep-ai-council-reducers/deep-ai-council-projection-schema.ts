// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Projection Schema
// ───────────────────────────────────────────────────────────────────

import { canonicalJson } from '../event-envelope/index.js';

import type {
  DeepAiCouncilLegacyProjection,
  DeepAiCouncilProjectionState,
  DeepAiCouncilReducerErrorCode,
} from './deep-ai-council-projection-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED FIELD TABLES
// ───────────────────────────────────────────────────────────────────

const PROJECTION_FIELDS = Object.freeze([
  'schemaVersion',
  'reducerVersion',
  'codecVersion',
  'orderingPolicyVersion',
  'run',
  'councilSeats',
  'critique',
  'blindedAdjudication',
  'convergence',
  'artifacts',
  'testGate',
  'status',
  'cursors',
  'seenEvents',
] as const);

const RECORD_FIELDS = Object.freeze({
  run: [
    'runId', 'roundId', 'generation', 'target', 'targetDigest', 'configDigest',
    'strategyDigest', 'convergencePolicyDigest', 'testGatePolicyDigest', 'maxRounds',
    'minSeatCount', 'maxSeatCount', 'planningOnly', 'initialReplayFingerprint',
    'initializationEventId',
  ],
  councilSeats: ['rounds', 'seats', 'proposals'],
  round: [
    'roundId', 'roundNumber', 'protocolVersion', 'exposurePolicyVersion',
    'seatRosterDigest', 'promptPackDigest', 'budgetRef', 'priorRoundRef',
    'informationSurface', 'producerEventId',
  ],
  seat: [
    'roundId', 'seatId', 'strategyLens', 'mandateDigest', 'vantageFingerprint',
    'modelFingerprint', 'independenceGroup', 'capabilityDigest', 'promptDigest',
    'selectionUtility', 'selectionPolicyVersion', 'selectedEventId', 'dispatchEventId',
    'dispatchReceiptRef', 'logicalBranchRef', 'attempt', 'budgetLeaseRef',
  ],
  proposal: [
    'roundId', 'seatId', 'proposalId', 'targetVersion', 'responseStatus',
    'proposalDigest', 'artifactRef', 'artifactDigest', 'rawScores', 'rawConfidence',
    'usage', 'evidenceRefs', 'outputSchemaVersion', 'observationDigest',
    'informationSurface', 'failureReason', 'timeoutReason', 'observedEventId',
    'returnedEventId',
  ],
  critique: ['rounds', 'critiques'],
  critiqueRound: [
    'roundId', 'critiqueRoundId', 'seatId', 'sourceProposalIds',
    'visibleInformationPolicyVersion', 'inputDigest', 'informationSurface',
    'producerEventId',
  ],
  critiqueRecord: [
    'roundId', 'critiqueRoundId', 'seatId', 'sourceProposalIds',
    'critiqueArtifactRef', 'critiqueArtifactDigest', 'referencedClaimRefs',
    'rawSeverity', 'rawConfidence', 'challengeDisposition', 'causalProposalRefs',
    'informationSurface', 'producerEventId',
  ],
  blindedAdjudication: ['candidates', 'judgments', 'biasAudits', 'decisions'],
  candidate: [
    'roundId', 'candidateId', 'sourceProposalIds', 'candidateAliasDigest',
    'shuffleSeedDigest', 'visibleCandidateDigest', 'artifactRef', 'artifactDigest',
    'targetVersion', 'redactionPolicyVersion', 'informationSurface', 'producerEventId',
  ],
  judgment: [
    'roundId', 'judgmentId', 'candidateAId', 'candidateBId', 'orderToken',
    'judgeProfileFingerprint', 'rawPreference', 'rawConfidence', 'judgmentStatus',
    'inputDigest', 'calibrationRef', 'informationSurface', 'producerEventId',
  ],
  biasAudit: [
    'roundId', 'judgmentId', 'candidateAId', 'candidateBId', 'pairedJudgmentIds',
    'biasFeatureCodes', 'detectorResult', 'inconsistencyStatus', 'rawBiasScore',
    'inputDigest', 'detectorFingerprint', 'producerEventId',
  ],
  decision: [
    'roundId', 'candidateSetDigest', 'protocolVersion', 'rubricVersion', 'rawScores',
    'calibratedScores', 'supportMass', 'oppositionMass', 'independence', 'minorityRefs',
    'contradictionRefs', 'vetoFindingRefs', 'disposition', 'selectedCandidateId',
    'evaluatorReceiptRef', 'sourceJudgmentIds', 'producerEventId',
  ],
  convergence: [
    'stances', 'deliberations', 'evaluations', 'outcome', 'eligible', 'blockerIds',
    'hardVetoRefs', 'rawAgreement', 'calibratedSupport', 'effectiveSeatCount',
    'presentation',
  ],
  stance: [
    'roundId', 'candidateId', 'seatId', 'candidateOrPlanRef', 'priorStanceEventId',
    'priorStance', 'currentStance', 'flipDirection', 'rawRationaleDigest',
    'evidenceRef', 'influenceObservationDigest', 'producerEventId',
  ],
  deliberation: [
    'roundId', 'inputEventRange', 'candidateSetDigest', 'planDisposition',
    'selectedPlanDigest', 'disagreementRefs', 'minorityRefs',
    'synthesisPolicyFingerprint', 'evaluatorFingerprint', 'reportDraftRef',
    'synthesisReceiptRef', 'producerEventId',
  ],
  evaluation: [
    'roundId', 'decision', 'rawAgreement', 'rawStability', 'calibratedSupport',
    'effectiveSeatCount', 'independence', 'judgeProfileRefs', 'qualityWitnessRefs',
    'invarianceWitnessRefs', 'minorityRefs', 'contradictionRefs', 'vetoFindingRefs',
    'requiredGateResultRefs', 'budgetStateRef', 'coverageStateRef', 'blockerIds',
    'recoveryOrEscalationReason', 'producerEventId',
  ],
  presentation: [
    'kind', 'selectedCandidateId', 'rawProposalEventIds', 'rawJudgmentEventIds',
    'adjudicationEventIds', 'minorityRefs', 'contradictionRefs', 'vetoFindingRefs',
    'unresolvedValueRefs', 'reopenConditionRefs',
  ],
  artifacts: ['records'],
  artifact: [
    'artifactId', 'logicalArtifactId', 'roundId', 'artifactKind', 'safeRelativePath',
    'schemaVersion', 'byteDigest', 'contentDigest', 'requiredSectionResults',
    'sourceEventRange', 'producerEventId', 'availability', 'supersedesArtifactIds',
    'supersededByArtifactIds', 'rollbackRef',
  ],
  testGate: ['evaluations', 'verdict'],
  gate: [
    'gateId', 'roundId', 'testSuiteDigest', 'fixtureManifestDigest',
    'baselineFingerprint', 'candidateFingerprint', 'requiredCheckResults',
    'criticalFailureRefs', 'metamorphicCheckDigest', 'biasCheckDigest',
    'artifactCompleteness', 'verdict', 'gateReceiptRef', 'informationSurface',
    'producerEventId',
  ],
  status: [
    'state', 'terminal', 'projectionHealth', 'admission', 'shadowParity', 'modeGate',
    'blockingReason', 'provenance',
  ],
  transition: [
    'state', 'producerEventId', 'producerStem', 'streamSequence', 'blockingReason',
  ],
  cursors: [
    'councilSeats', 'critique', 'blindedAdjudication', 'convergence', 'artifacts',
    'testGate', 'status',
  ],
  seenEvent: ['eventId', 'eventDigest', 'streamId', 'streamSequence', 'stem'],
  legacy: [
    'authority', 'legacyAuthority', 'roundId', 'status', 'seatCount', 'proposalCount',
    'selectedCandidateId', 'convergenceOutcome', 'artifactIds', 'gateVerdict',
    'terminal', 'lossyFields',
  ],
} as const);

const HASH_PATTERN = /^[a-f0-9]{64}$/u;
const SYSTEM_TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/u;
const SAFE_RELATIVE_PATH_PATTERN =
  /^(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$))[A-Za-z0-9._/-]{1,512}$/u;

// ───────────────────────────────────────────────────────────────────
// 2. VALIDATION
// ───────────────────────────────────────────────────────────────────

export class DeepAiCouncilReducerError extends Error {
  public readonly code: DeepAiCouncilReducerErrorCode;
  public readonly field: string | null;

  public constructor(
    code: DeepAiCouncilReducerErrorCode,
    message: string,
    field: string | null = null,
  ) {
    super(message);
    this.name = 'DeepAiCouncilReducerError';
    this.code = code;
    this.field = field;
    Object.setPrototypeOf(this, DeepAiCouncilReducerError.prototype);
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
    throw new DeepAiCouncilReducerError(
      'projection-field-invalid',
      `Projection field ${path} must be an object`,
      path,
    );
  }
  const expected = [...fields].sort();
  const actual = Object.keys(value).sort();
  if (canonicalJson(expected) !== canonicalJson(actual)) {
    throw new DeepAiCouncilReducerError(
      'projection-field-undeclared',
      `Projection field ${path} contains a missing or undeclared field`,
      path,
    );
  }
}

function assertRecordArray(
  value: unknown,
  fields: readonly string[],
  path: string,
): void {
  if (!Array.isArray(value)) {
    throw new DeepAiCouncilReducerError(
      'projection-field-invalid',
      `Projection field ${path} must be an array`,
      path,
    );
  }
  value.forEach((entry, index) => assertExactFields(entry, fields, `${path}.${index}`));
}

function assertScalarKinds(value: unknown, path = 'projection'): void {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertScalarKinds(entry, `${path}.${index}`));
    return;
  }
  if (!isObject(value)) {
    if (typeof value === 'number' && !Number.isFinite(value)) {
      throw new DeepAiCouncilReducerError(
        'projection-field-invalid',
        `Projection field ${path} must be finite`,
        path,
      );
    }
    return;
  }
  for (const [field, child] of Object.entries(value)) {
    const childPath = `${path}.${field}`;
    if ((field.endsWith('Digest') || field.endsWith('Fingerprint'))
      && child !== null
      && (typeof child !== 'string' || !HASH_PATTERN.test(child))) {
      throw new DeepAiCouncilReducerError(
        'projection-field-invalid',
        `Projection field ${childPath} must be a SHA-256 digest`,
        childPath,
      );
    }
    if (field === 'safeRelativePath'
      && (typeof child !== 'string' || !SAFE_RELATIVE_PATH_PATTERN.test(child))) {
      throw new DeepAiCouncilReducerError(
        'projection-field-invalid',
        'Artifact paths must remain safe relative paths',
        childPath,
      );
    }
    if ((field.endsWith('Id') || field.endsWith('Ref') || field.endsWith('Version'))
      && child !== null
      && (typeof child !== 'string' || !SYSTEM_TOKEN_PATTERN.test(child))) {
      throw new DeepAiCouncilReducerError(
        'projection-field-invalid',
        `Projection field ${childPath} must be a bounded token`,
        childPath,
      );
    }
    assertScalarKinds(child, childPath);
  }
}

function assertProjectionCollections(projection: Record<string, unknown>): void {
  assertExactFields(projection.run, RECORD_FIELDS.run, 'run');
  assertExactFields(projection.councilSeats, RECORD_FIELDS.councilSeats, 'councilSeats');
  const seats = projection.councilSeats as Record<string, unknown>;
  assertRecordArray(seats.rounds, RECORD_FIELDS.round, 'councilSeats.rounds');
  assertRecordArray(seats.seats, RECORD_FIELDS.seat, 'councilSeats.seats');
  assertRecordArray(seats.proposals, RECORD_FIELDS.proposal, 'councilSeats.proposals');

  assertExactFields(projection.critique, RECORD_FIELDS.critique, 'critique');
  const critique = projection.critique as Record<string, unknown>;
  assertRecordArray(critique.rounds, RECORD_FIELDS.critiqueRound, 'critique.rounds');
  assertRecordArray(
    critique.critiques,
    RECORD_FIELDS.critiqueRecord,
    'critique.critiques',
  );

  assertExactFields(
    projection.blindedAdjudication,
    RECORD_FIELDS.blindedAdjudication,
    'blindedAdjudication',
  );
  const adjudication = projection.blindedAdjudication as Record<string, unknown>;
  assertRecordArray(
    adjudication.candidates,
    RECORD_FIELDS.candidate,
    'blindedAdjudication.candidates',
  );
  assertRecordArray(
    adjudication.judgments,
    RECORD_FIELDS.judgment,
    'blindedAdjudication.judgments',
  );
  assertRecordArray(
    adjudication.biasAudits,
    RECORD_FIELDS.biasAudit,
    'blindedAdjudication.biasAudits',
  );
  assertRecordArray(
    adjudication.decisions,
    RECORD_FIELDS.decision,
    'blindedAdjudication.decisions',
  );

  assertExactFields(projection.convergence, RECORD_FIELDS.convergence, 'convergence');
  const convergence = projection.convergence as Record<string, unknown>;
  assertRecordArray(convergence.stances, RECORD_FIELDS.stance, 'convergence.stances');
  assertRecordArray(
    convergence.deliberations,
    RECORD_FIELDS.deliberation,
    'convergence.deliberations',
  );
  assertRecordArray(
    convergence.evaluations,
    RECORD_FIELDS.evaluation,
    'convergence.evaluations',
  );
  assertExactFields(
    convergence.presentation,
    RECORD_FIELDS.presentation,
    'convergence.presentation',
  );

  assertExactFields(projection.artifacts, RECORD_FIELDS.artifacts, 'artifacts');
  assertRecordArray(
    (projection.artifacts as Record<string, unknown>).records,
    RECORD_FIELDS.artifact,
    'artifacts.records',
  );
  assertExactFields(projection.testGate, RECORD_FIELDS.testGate, 'testGate');
  assertRecordArray(
    (projection.testGate as Record<string, unknown>).evaluations,
    RECORD_FIELDS.gate,
    'testGate.evaluations',
  );
  assertExactFields(projection.status, RECORD_FIELDS.status, 'status');
  assertRecordArray(
    (projection.status as Record<string, unknown>).provenance,
    RECORD_FIELDS.transition,
    'status.provenance',
  );
  assertExactFields(projection.cursors, RECORD_FIELDS.cursors, 'cursors');
  assertRecordArray(projection.seenEvents, RECORD_FIELDS.seenEvent, 'seenEvents');
}

/** Validate every persisted field against the closed council projection schema. */
export function assertDeepAiCouncilProjectionState(
  value: unknown,
): asserts value is DeepAiCouncilProjectionState {
  assertExactFields(value, PROJECTION_FIELDS, 'projection');
  assertProjectionCollections(value);
  assertScalarKinds(value);
  try {
    canonicalJson(value);
  } catch {
    throw new DeepAiCouncilReducerError(
      'projection-field-invalid',
      'Council projection must remain canonically serializable',
      'projection',
    );
  }
}

/** Validate the complete comparison-only legacy view. */
export function assertDeepAiCouncilLegacyProjection(
  value: unknown,
): asserts value is DeepAiCouncilLegacyProjection {
  assertExactFields(value, RECORD_FIELDS.legacy, 'legacyProjection');
  assertScalarKinds(value, 'legacyProjection');
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
