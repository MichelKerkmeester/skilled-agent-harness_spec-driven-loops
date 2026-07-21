// ───────────────────────────────────────────────────────────────────
// MODULE: Blinded Adjudication Validation
// ───────────────────────────────────────────────────────────────────

import {
  ADJUDICATION_PRESENTATION_POLICY_VERSION,
  ADJUDICATION_REDUCER_VERSION,
  ADJUDICATION_REQUEST_VERSION,
  AdjudicationDecisionKinds,
  AdjudicationError,
  AdjudicationErrorCodes,
  CounterfactualKinds,
  JudgmentOutcomes,
  digestCandidateContent,
} from './contracts.js';

import type {
  AdjudicationRequest,
  CandidateRegistration,
  CounterfactualKind,
  JudgeProfile,
  JudgeSubmission,
} from './contracts.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const IDENTITY_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,255}$/;
const COUNTERFACTUAL_TOKEN_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/;
const MAX_CONTENT_LENGTH = 1_000_000;
const MAX_RATIONALE_LENGTH = 100_000;
const MAX_COLLECTION_LENGTH = 1_000;
const DECISION_KIND_SET = new Set<string>(Object.values(AdjudicationDecisionKinds));
const COUNTERFACTUAL_KIND_SET = new Set<string>(Object.values(CounterfactualKinds));
const JUDGMENT_OUTCOME_SET = new Set<string>(Object.values(JudgmentOutcomes));

// ───────────────────────────────────────────────────────────────────
// 2. GENERIC GUARDS
// ───────────────────────────────────────────────────────────────────

export function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || Array.isArray(value) || typeof value !== 'object') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

export function assertClosedKeys(
  value: Record<string, unknown>,
  expected: readonly string[],
  field: string,
): void {
  const allowed = new Set(expected);
  for (const key of expected) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) {
      throw invalidInput('Required field is missing', `${field}.${key}`);
    }
  }
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) {
      throw invalidInput('Unknown field is forbidden', `${field}.${key}`);
    }
  }
}

export function requireIdentity(value: unknown, field: string): string {
  if (typeof value !== 'string' || !IDENTITY_PATTERN.test(value)) {
    throw invalidInput('Identity must use the bounded identity grammar', field);
  }
  return value;
}

export function requireDigest(value: unknown, field: string): string {
  if (typeof value !== 'string' || !SHA256_PATTERN.test(value)) {
    throw invalidInput('Digest must be a lowercase SHA-256 hex string', field);
  }
  return value;
}

export function requireCounterfactualToken(value: unknown, field: string): string {
  if (typeof value !== 'string' || !COUNTERFACTUAL_TOKEN_PATTERN.test(value)) {
    throw invalidInput('Counterfactual token must be bounded lowercase kebab-case', field);
  }
  return value;
}

export function requireFiniteUnitInterval(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) {
    throw invalidInput('Value must be a finite number between zero and one', field);
  }
  return value;
}

function invalidInput(message: string, field: string): AdjudicationError {
  return new AdjudicationError(
    AdjudicationErrorCodes.INVALID_INPUT,
    message,
    { field },
  );
}

function requireStringArray(
  value: unknown,
  field: string,
  itemValidator: (item: unknown, itemField: string) => string,
  allowEmpty = false,
): string[] {
  if (!Array.isArray(value) || value.length > MAX_COLLECTION_LENGTH) {
    throw invalidInput('Field must be a bounded array', field);
  }
  if (!allowEmpty && value.length === 0) {
    throw invalidInput('Array field must not be empty', field);
  }
  const validated = value.map((item, index) => itemValidator(item, `${field}[${index}]`));
  if (new Set(validated).size !== validated.length) {
    throw invalidInput('Array field must not contain duplicates', field);
  }
  return validated;
}

function requirePositiveInteger(value: unknown, field: string): number {
  if (!Number.isSafeInteger(value) || (value as number) <= 0) {
    throw invalidInput('Field must be a positive safe integer', field);
  }
  return value as number;
}

// ───────────────────────────────────────────────────────────────────
// 3. REQUEST AND IDENTITY VALIDATION
// ───────────────────────────────────────────────────────────────────

/** Validate a complete request without supplying policy defaults. */
export function validateAdjudicationRequest(input: unknown): AdjudicationRequest {
  if (!isPlainRecord(input)) throw invalidInput('Adjudication request must be an object', '$');
  assertClosedKeys(input, [
    'requestVersion',
    'decisionKind',
    'candidateDigests',
    'rubricDigest',
    'referenceDigest',
    'presentationPolicyVersion',
    'judgePolicyVersion',
    'counterfactualPolicyVersion',
    'reducerVersion',
    'requiredCounterfactuals',
    'quorum',
    'minimumEffectiveIndependence',
    'tieBehavior',
    'replayFingerprint',
    'authorityPosture',
  ], '$');

  if (input.requestVersion !== ADJUDICATION_REQUEST_VERSION) {
    throw new AdjudicationError(
      AdjudicationErrorCodes.UNSUPPORTED_POLICY,
      'Adjudication request version is not supported',
    );
  }
  if (typeof input.decisionKind !== 'string' || !DECISION_KIND_SET.has(input.decisionKind)) {
    throw invalidInput('Decision kind is not supported', '$.decisionKind');
  }
  const candidateDigests = requireStringArray(
    input.candidateDigests,
    '$.candidateDigests',
    requireDigest,
  );
  if (candidateDigests.length < 2) {
    throw invalidInput('At least two candidates are required', '$.candidateDigests');
  }
  if (input.presentationPolicyVersion !== ADJUDICATION_PRESENTATION_POLICY_VERSION) {
    throw new AdjudicationError(
      AdjudicationErrorCodes.UNSUPPORTED_POLICY,
      'Presentation policy is not supported',
    );
  }
  if (input.reducerVersion !== ADJUDICATION_REDUCER_VERSION) {
    throw new AdjudicationError(
      AdjudicationErrorCodes.UNSUPPORTED_POLICY,
      'Reducer version is not supported',
    );
  }
  const requiredCounterfactuals = requireStringArray(
    input.requiredCounterfactuals,
    '$.requiredCounterfactuals',
    (value, field) => {
      if (typeof value !== 'string' || !COUNTERFACTUAL_KIND_SET.has(value)) {
        throw invalidInput('Counterfactual kind is not supported', field);
      }
      return value;
    },
  ) as CounterfactualKind[];
  const quorum = requirePositiveInteger(input.quorum, '$.quorum');
  const minimumEffectiveIndependence = requirePositiveInteger(
    input.minimumEffectiveIndependence,
    '$.minimumEffectiveIndependence',
  );
  if (minimumEffectiveIndependence > quorum) {
    throw invalidInput(
      'Minimum effective independence cannot exceed quorum',
      '$.minimumEffectiveIndependence',
    );
  }
  if (input.tieBehavior !== 'inconclusive') {
    throw new AdjudicationError(
      AdjudicationErrorCodes.UNSUPPORTED_POLICY,
      'Only fail-closed inconclusive tie behavior is supported',
    );
  }
  if (input.authorityPosture !== 'legacy-canonical-shadow-only') {
    throw new AdjudicationError(
      AdjudicationErrorCodes.UNSUPPORTED_POLICY,
      'Adjudication authority must remain shadow-only',
    );
  }

  return Object.freeze({
    requestVersion: ADJUDICATION_REQUEST_VERSION,
    decisionKind: input.decisionKind as AdjudicationRequest['decisionKind'],
    candidateDigests: Object.freeze(candidateDigests) as unknown as string[],
    rubricDigest: requireDigest(input.rubricDigest, '$.rubricDigest'),
    referenceDigest: requireDigest(input.referenceDigest, '$.referenceDigest'),
    presentationPolicyVersion: ADJUDICATION_PRESENTATION_POLICY_VERSION,
    judgePolicyVersion: requireIdentity(input.judgePolicyVersion, '$.judgePolicyVersion'),
    counterfactualPolicyVersion: requireIdentity(
      input.counterfactualPolicyVersion,
      '$.counterfactualPolicyVersion',
    ),
    reducerVersion: ADJUDICATION_REDUCER_VERSION,
    requiredCounterfactuals: Object.freeze(requiredCounterfactuals) as CounterfactualKind[],
    quorum,
    minimumEffectiveIndependence,
    tieBehavior: 'inconclusive',
    replayFingerprint: requireDigest(input.replayFingerprint, '$.replayFingerprint'),
    authorityPosture: 'legacy-canonical-shadow-only',
  });
}

/** Validate identity-bearing registration and bind content to its digest. */
export function validateCandidateRegistration(input: unknown): CandidateRegistration {
  if (!isPlainRecord(input)) throw invalidInput('Candidate registration must be an object', '$');
  assertClosedKeys(input, [
    'candidateDigest',
    'content',
    'producerId',
    'equivalentProducerIds',
    'providerId',
    'authorId',
    'originalPosition',
    'declaredConfidence',
  ], '$');
  if (
    typeof input.content !== 'string'
    || input.content.length === 0
    || input.content.length > MAX_CONTENT_LENGTH
  ) {
    throw invalidInput('Candidate content must be a bounded non-empty string', '$.content');
  }
  const candidateDigest = requireDigest(input.candidateDigest, '$.candidateDigest');
  if (candidateDigest !== digestCandidateContent(input.content)) {
    throw invalidInput('Candidate content does not match its registered digest', '$.candidateDigest');
  }
  const declaredConfidence = input.declaredConfidence === null
    ? null
    : requireFiniteUnitInterval(input.declaredConfidence, '$.declaredConfidence');
  return Object.freeze({
    candidateDigest,
    content: input.content,
    producerId: requireIdentity(input.producerId, '$.producerId'),
    equivalentProducerIds: Object.freeze(requireStringArray(
      input.equivalentProducerIds,
      '$.equivalentProducerIds',
      requireIdentity,
      true,
    )),
    providerId: requireIdentity(input.providerId, '$.providerId'),
    authorId: requireIdentity(input.authorId, '$.authorId'),
    originalPosition: requirePositiveInteger(input.originalPosition, '$.originalPosition'),
    declaredConfidence,
  });
}

/** Validate post-judging independence metadata without assigning vote weight. */
export function validateJudgeProfile(input: unknown): JudgeProfile {
  if (!isPlainRecord(input)) throw invalidInput('Judge profile must be an object', '$');
  assertClosedKeys(input, [
    'judgeId',
    'equivalentIdentityIds',
    'modelFamily',
    'providerFamily',
    'reasoningMethod',
    'evidenceProvenanceDigests',
    'residualErrorGroup',
    'competenceEstimate',
  ], '$');
  return Object.freeze({
    judgeId: requireIdentity(input.judgeId, '$.judgeId'),
    equivalentIdentityIds: Object.freeze(requireStringArray(
      input.equivalentIdentityIds,
      '$.equivalentIdentityIds',
      requireIdentity,
      true,
    )),
    modelFamily: requireIdentity(input.modelFamily, '$.modelFamily'),
    providerFamily: requireIdentity(input.providerFamily, '$.providerFamily'),
    reasoningMethod: requireIdentity(input.reasoningMethod, '$.reasoningMethod'),
    evidenceProvenanceDigests: Object.freeze(requireStringArray(
      input.evidenceProvenanceDigests,
      '$.evidenceProvenanceDigests',
      requireDigest,
    )),
    residualErrorGroup: requireIdentity(input.residualErrorGroup, '$.residualErrorGroup'),
    competenceEstimate: input.competenceEstimate === null
      ? null
      : requireFiniteUnitInterval(input.competenceEstimate, '$.competenceEstimate'),
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. JUDGMENT VALIDATION
// ───────────────────────────────────────────────────────────────────

/** Validate a closed judge submission before resolving an opaque label. */
export function validateJudgeSubmission(input: unknown): JudgeSubmission {
  if (!isPlainRecord(input)) throw invalidInput('Judge submission must be an object', '$');
  assertClosedKeys(input, [
    'judgmentId',
    'outcome',
    'preferredOpaqueLabel',
    'rationale',
    'evidenceLocators',
    'uncertainty',
    'hardVeto',
  ], '$');
  if (typeof input.outcome !== 'string' || !JUDGMENT_OUTCOME_SET.has(input.outcome)) {
    throw invalidInput('Judgment outcome is not supported', '$.outcome');
  }
  const preferredOpaqueLabel = input.preferredOpaqueLabel === null
    ? null
    : requireIdentity(input.preferredOpaqueLabel, '$.preferredOpaqueLabel');
  if (
    (input.outcome === JudgmentOutcomes.PREFERENCE && preferredOpaqueLabel === null)
    || (input.outcome !== JudgmentOutcomes.PREFERENCE && preferredOpaqueLabel !== null)
  ) {
    throw new AdjudicationError(
      AdjudicationErrorCodes.INVALID_JUDGMENT,
      'Only a preference outcome may select one opaque label',
    );
  }
  if (
    typeof input.rationale !== 'string'
    || input.rationale.length === 0
    || input.rationale.length > MAX_RATIONALE_LENGTH
  ) {
    throw invalidInput('Rationale must be a bounded non-empty string', '$.rationale');
  }
  if (typeof input.hardVeto !== 'boolean') {
    throw invalidInput('Hard-veto marker must be boolean', '$.hardVeto');
  }
  return Object.freeze({
    judgmentId: requireIdentity(input.judgmentId, '$.judgmentId'),
    outcome: input.outcome as JudgeSubmission['outcome'],
    preferredOpaqueLabel,
    rationale: input.rationale,
    evidenceLocators: Object.freeze(requireStringArray(
      input.evidenceLocators,
      '$.evidenceLocators',
      requireIdentity,
      input.outcome === JudgmentOutcomes.ABSTAIN,
    )),
    uncertainty: requireFiniteUnitInterval(input.uncertainty, '$.uncertainty'),
    hardVeto: input.hardVeto,
  });
}
