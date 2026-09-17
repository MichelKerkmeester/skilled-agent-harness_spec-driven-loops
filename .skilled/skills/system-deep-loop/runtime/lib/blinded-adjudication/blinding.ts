// ───────────────────────────────────────────────────────────────────
// MODULE: Blinded Assignment Registrar
// ───────────────────────────────────────────────────────────────────

import { randomBytes, randomInt } from 'node:crypto';

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import {
  ADJUDICATION_PRESENTATION_POLICY_VERSION,
  AdjudicationError,
  AdjudicationErrorCodes,
  AssignmentOrders,
  CounterfactualKinds,
  adjudicationEvidenceId,
  digestCandidateContent,
} from './contracts.js';
import {
  requireCounterfactualToken,
  normalizeCandidateContentForJudging,
  validateCandidateRegistration,
  validateJudgeProfile,
  validateJudgeSubmission,
} from './validation.js';

import type { JsonObject } from '../event-envelope/index.js';
import type {
  AdjudicationRequest,
  AssignmentOrder,
  CandidateRegistration,
  CounterfactualCue,
  CounterfactualKind,
  JudgeAssignment,
  JudgeProfile,
  JudgeSubmission,
  PresentationTransformation,
  RawJudgment,
} from './contracts.js';

// ───────────────────────────────────────────────────────────────────
// 1. INTERNAL TYPES
// ───────────────────────────────────────────────────────────────────

interface CandidateIdentityRecord {
  readonly candidateDigest: string;
  readonly producerId: string;
  readonly equivalentProducerIds: readonly string[];
  readonly providerId: string;
  readonly authorId: string;
  readonly originalPosition: number;
  readonly declaredConfidence: number | null;
}

interface AssignmentSecret {
  readonly assignmentId: string;
  readonly adjudicationId: string;
  readonly pairId: string;
  readonly judgeAssignmentId: string;
  readonly judgeId: string;
  readonly order: AssignmentOrder;
  readonly counterfactualKind: CounterfactualKind | null;
  readonly baselineAssignmentId: string | null;
  readonly plannedProfileDigest: string;
  readonly plannedEligibilityBasisDigest: string;
  readonly candidateDigests: readonly [string, string];
  readonly labelToDigest: ReadonlyMap<string, string>;
  readonly transformationByDigest: ReadonlyMap<string, PresentationTransformation>;
}

interface CounterfactualCueInput {
  readonly kind: Exclude<CounterfactualKind, 'identity-label' | 'order'>;
  readonly token: string;
}

export interface BlindedPresentationEvidence extends JsonObject {
  readonly adjudication_id: string;
  readonly assignment_id: string;
  readonly judge_assignment_id: string;
  readonly pair_id: string;
  readonly order: AssignmentOrder;
  readonly opaque_labels: string[];
  readonly presented_content_digests: string[];
  readonly transformations: PresentationTransformation[];
  readonly counterfactual_kind: CounterfactualKind | null;
  readonly baseline_assignment_id: string | null;
  readonly counterfactual_token_digest: string | null;
}

export interface DeblindedIdentity {
  readonly candidateDigest: string;
  readonly producerId: string;
  readonly providerId: string;
  readonly authorId: string;
  readonly originalPosition: number;
  readonly declaredConfidence: number | null;
}

interface DeblindingCapability {
  readonly capabilityId: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. IDENTITY VAULT
// ───────────────────────────────────────────────────────────────────

/** Separately controlled candidate identity map with unforgeable read capabilities. */
export class CandidateIdentityVault {
  readonly #identities = new Map<string, CandidateIdentityRecord>();
  readonly #capabilities = new WeakSet<object>();
  #isFinalized = false;

  public register(candidate: CandidateRegistration): void {
    const validated = validateCandidateRegistration(candidate);
    if (this.#isFinalized || this.#identities.has(validated.candidateDigest)) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.INVALID_INPUT,
        'Candidate identity registration is closed or duplicated',
      );
    }
    this.#identities.set(validated.candidateDigest, Object.freeze({
      candidateDigest: validated.candidateDigest,
      producerId: validated.producerId,
      equivalentProducerIds: validated.equivalentProducerIds,
      providerId: validated.providerId,
      authorId: validated.authorId,
      originalPosition: validated.originalPosition,
      declaredConfidence: validated.declaredConfidence,
    }));
  }

  /** Seal registration before any judge assignment is emitted. */
  public seal(): void {
    if (this.#identities.size < 2) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.INVALID_INPUT,
        'Identity vault requires at least two registered candidates',
      );
    }
    this.#isFinalized = true;
  }

  /** Check producer equivalence without exposing identity records to the judge path. */
  public assertJudgeEligible(candidateDigests: readonly string[], judge: JudgeProfile): void {
    if (!this.#isFinalized) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.INVALID_INPUT,
        'Identity vault must be sealed before judge eligibility checks',
      );
    }
    const identities = new Set([judge.judgeId, ...judge.equivalentIdentityIds]);
    for (const candidateDigest of candidateDigests) {
      const candidate = this.#identities.get(candidateDigest);
      if (!candidate) {
        throw new AdjudicationError(
          AdjudicationErrorCodes.INVALID_INPUT,
          'Candidate identity is not registered',
          { candidateDigest },
        );
      }
      if (
        identities.has(candidate.producerId)
        || identities.has(candidate.authorId)
        || identities.has(candidate.providerId)
        || candidate.equivalentProducerIds.some((identity) => identities.has(identity))
      ) {
        throw new AdjudicationError(
          AdjudicationErrorCodes.SELF_SCORING,
          'Candidate producer or equivalent identity cannot judge its own candidate',
          { candidateDigest },
        );
      }
    }
  }

  /** Mint a capability only after a final verdict and external authorization. */
  public mintDeblindingCapability(
    isVerdictFinal: boolean,
    isAuthorized: boolean,
  ): DeblindingCapability {
    if (!isVerdictFinal) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.VERDICT_NOT_FINAL,
        'Identity map cannot be read before verdict finalization',
      );
    }
    if (!isAuthorized) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.DEBLINDING_DENIED,
        'External deblinding authorization was denied',
      );
    }
    const capability = Object.freeze({
      capabilityId: `deblind-${sha256Bytes(canonicalBytes({ size: this.#identities.size }))}`,
    });
    this.#capabilities.add(capability);
    return capability;
  }

  /** Resolve only the requested scope through a single-use capability. */
  public deblind(
    capability: DeblindingCapability,
    candidateDigests: readonly string[],
  ): readonly DeblindedIdentity[] {
    if (!this.#capabilities.has(capability)) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.DEBLINDING_DENIED,
        'Identity-map capability is missing, forged, or already used',
      );
    }
    this.#capabilities.delete(capability);
    return Object.freeze(candidateDigests.map((candidateDigest) => {
      const identity = this.#identities.get(candidateDigest);
      if (!identity) {
        throw new AdjudicationError(
          AdjudicationErrorCodes.DEBLINDING_DENIED,
          'Deblinding scope references an unknown candidate',
        );
      }
      return Object.freeze({
        candidateDigest: identity.candidateDigest,
        producerId: identity.producerId,
        providerId: identity.providerId,
        authorId: identity.authorId,
        originalPosition: identity.originalPosition,
        declaredConfidence: identity.declaredConfidence,
      });
    }));
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. BLINDING REGISTRAR
// ───────────────────────────────────────────────────────────────────

const ASSIGNMENT_SECRETS = new WeakMap<JudgeAssignment, AssignmentSecret>();

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

/** Derive one order-neutral pair identity shared by planning and reduction. */
export function adjudicationPairId(
  adjudicationId: string,
  leftDigest: string,
  rightDigest: string,
): string {
  const pair = [leftDigest, rightDigest].sort(compareCodeUnits);
  return adjudicationEvidenceId('pair', { adjudicationId, pair });
}

function assignmentIdentity(
  adjudicationId: string,
  pair: string,
  judgeId: string,
  order: AssignmentOrder,
  counterfactualKind: CounterfactualKind | null,
  baselineAssignmentId: string | null,
): string {
  return adjudicationEvidenceId('assignment', {
    adjudicationId,
    pair,
    judgeDigest: sha256Bytes(canonicalBytes({ judgeId })),
    order,
    counterfactualKind,
    baselineAssignmentId,
  });
}

function opaqueLabel(assignmentId: string, candidateDigest: string): string {
  return `candidate-${sha256Bytes(canonicalBytes({
    assignmentId,
    candidateDigest,
    nonce: randomBytes(32).toString('hex'),
  })).slice(0, 16)}`;
}

function judgeProfileDigest(judge: JudgeProfile): string {
  return sha256Bytes(canonicalBytes(judge as unknown as JsonObject));
}

function eligibilityBasisDigest(judge: JudgeProfile): string {
  return sha256Bytes(canonicalBytes({
    equivalentIdentities: Array.from(new Set([
      judge.judgeId,
      ...judge.equivalentIdentityIds,
    ])).sort(compareCodeUnits),
  }));
}

function shuffleAssignments(assignments: JudgeAssignment[]): void {
  for (let index = assignments.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [assignments[index], assignments[swapIndex]] = [assignments[swapIndex], assignments[index]];
  }
}

function freezeAssignment(assignment: JudgeAssignment): JudgeAssignment {
  Object.freeze(assignment.candidates[0].transformation);
  Object.freeze(assignment.candidates[1].transformation);
  Object.freeze(assignment.candidates[0]);
  Object.freeze(assignment.candidates[1]);
  Object.freeze(assignment.candidates);
  if (assignment.contextCue) Object.freeze(assignment.contextCue);
  return Object.freeze(assignment);
}

/** Produce per-assignment opaque views while retaining resolution in module-private state. */
export class BlindingRegistrar {
  readonly #request: AdjudicationRequest;
  readonly #vault: CandidateIdentityVault;
  readonly #sourceContentByDigest: ReadonlyMap<string, string>;
  readonly #presentedContentByDigest: ReadonlyMap<string, string>;
  readonly #assignments = new Map<string, JudgeAssignment>();

  public constructor(
    request: AdjudicationRequest,
    candidates: readonly CandidateRegistration[],
    vault: CandidateIdentityVault,
  ) {
    this.#request = request;
    this.#vault = vault;
    const sourceContentByDigest = new Map<string, string>();
    const presentedContentByDigest = new Map<string, string>();
    for (const candidateInput of candidates) {
      const candidate = validateCandidateRegistration(candidateInput);
      sourceContentByDigest.set(candidate.candidateDigest, candidate.content);
      presentedContentByDigest.set(
        candidate.candidateDigest,
        normalizeCandidateContentForJudging(candidate.content),
      );
    }
    this.#sourceContentByDigest = sourceContentByDigest;
    this.#presentedContentByDigest = presentedContentByDigest;
  }

  /** Plan all unordered pairs in both presentation orders for every eligible judge. */
  public planMirroredAssignments(
    adjudicationId: string,
    judges: readonly JudgeProfile[],
  ): readonly JudgeAssignment[] {
    const validatedJudges = judges.map(validateJudgeProfile);
    if (validatedJudges.length === 0) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.INVALID_INPUT,
        'At least one judge profile is required',
      );
    }
    const assignments: JudgeAssignment[] = [];
    for (let left = 0; left < this.#request.candidateDigests.length; left += 1) {
      for (let right = left + 1; right < this.#request.candidateDigests.length; right += 1) {
        const pair: readonly [string, string] = [
          this.#request.candidateDigests[left],
          this.#request.candidateDigests[right],
        ];
        for (const judge of validatedJudges) {
          this.#vault.assertJudgeEligible(pair, judge);
          const firstOrder = randomInt(2) === 0
            ? AssignmentOrders.FORWARD
            : AssignmentOrders.REVERSE;
          const secondOrder = firstOrder === AssignmentOrders.FORWARD
            ? AssignmentOrders.REVERSE
            : AssignmentOrders.FORWARD;
          assignments.push(this.#createAssignment(
            adjudicationId,
            pair,
            judge,
            firstOrder,
            null,
            null,
            null,
          ));
          assignments.push(this.#createAssignment(
            adjudicationId,
            pair,
            judge,
            secondOrder,
            null,
            null,
            null,
          ));
        }
      }
    }
    shuffleAssignments(assignments);
    return Object.freeze(assignments);
  }

  /** Create a targeted intervention linked to one existing baseline assignment. */
  public planCounterfactualAssignment(
    baselineAssignment: JudgeAssignment,
    kind: CounterfactualKind,
    judgeInput: JudgeProfile,
    interventionToken?: string,
  ): JudgeAssignment {
    if (!this.#request.requiredCounterfactuals.includes(kind)) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.INVALID_COUNTERFACTUAL,
        'Counterfactual kind is not declared by the request policy',
        { kind },
      );
    }
    const secret = this.#resolveAssignment(baselineAssignment);
    if (secret.counterfactualKind !== null) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.UNKNOWN_ASSIGNMENT,
        'Counterfactual baseline assignment is unknown or not a baseline',
      );
    }
    const judge = validateJudgeProfile(judgeInput);
    if (
      judge.judgeId !== secret.judgeId
      || judgeProfileDigest(judge) !== secret.plannedProfileDigest
      || eligibilityBasisDigest(judge) !== secret.plannedEligibilityBasisDigest
    ) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.INVALID_COUNTERFACTUAL,
        'Counterfactual must retain the complete planned judge profile',
      );
    }
    this.#vault.assertJudgeEligible(secret.candidateDigests, judge);
    const order = kind === CounterfactualKinds.ORDER
      ? (secret.order === AssignmentOrders.FORWARD
        ? AssignmentOrders.REVERSE
        : AssignmentOrders.FORWARD)
      : secret.order;
    let cue: CounterfactualCueInput | null = null;
    if (kind !== CounterfactualKinds.IDENTITY_LABEL && kind !== CounterfactualKinds.ORDER) {
      const token = requireCounterfactualToken(
        interventionToken,
        '$.interventionToken',
      );
      cue = Object.freeze({
        kind,
        token,
      });
    } else if (interventionToken !== undefined) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.INVALID_COUNTERFACTUAL,
        'Identity-label and order probes do not accept cue tokens',
      );
    }
    return this.#createAssignment(
      secret.adjudicationId,
      secret.candidateDigests,
      judge,
      order,
      kind,
      secret.assignmentId,
      cue,
    );
  }

  /** Create ledger-safe presentation evidence that is never handed to the judge. */
  public presentationEvidence(assignment: JudgeAssignment): BlindedPresentationEvidence {
    const secret = this.#resolveAssignment(assignment);
    const presentedCandidateDigests: readonly [string, string] =
      secret.order === AssignmentOrders.FORWARD
        ? secret.candidateDigests
        : [secret.candidateDigests[1], secret.candidateDigests[0]];
    const transformations = presentedCandidateDigests.map((digest) => {
      const transformation = secret.transformationByDigest.get(digest);
      if (!transformation) {
        throw new AdjudicationError(
          AdjudicationErrorCodes.UNKNOWN_ASSIGNMENT,
          'Assignment transformation evidence is incomplete',
        );
      }
      return transformation;
    });
    return Object.freeze({
      adjudication_id: secret.adjudicationId,
      assignment_id: secret.assignmentId,
      judge_assignment_id: secret.judgeAssignmentId,
      pair_id: secret.pairId,
      order: secret.order,
      opaque_labels: Object.freeze(
        assignment.candidates.map((candidate) => candidate.opaqueLabel),
      ) as unknown as string[],
      presented_content_digests: Object.freeze(assignment.candidates.map((candidate) =>
        digestCandidateContent(candidate.content))) as unknown as string[],
      transformations: Object.freeze(transformations) as unknown as PresentationTransformation[],
      counterfactual_kind: secret.counterfactualKind,
      baseline_assignment_id: secret.baselineAssignmentId,
      counterfactual_token_digest: assignment.contextCue
        ? sha256Bytes(canonicalBytes({ token: assignment.contextCue.token }))
        : null,
    });
  }

  /** Validate a submission and resolve its preference inside the sealed registrar boundary. */
  public acceptSubmission(
    assignment: JudgeAssignment,
    judgeInput: JudgeProfile,
    submissionInput: JudgeSubmission,
  ): RawJudgment {
    const secret = this.#resolveAssignment(assignment);
    const judge = validateJudgeProfile(judgeInput);
    const submission = validateJudgeSubmission(submissionInput);
    this.#vault.assertJudgeEligible(secret.candidateDigests, judge);
    if (
      judge.judgeId !== secret.judgeId
      || judgeProfileDigest(judge) !== secret.plannedProfileDigest
      || eligibilityBasisDigest(judge) !== secret.plannedEligibilityBasisDigest
    ) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.INVALID_JUDGMENT,
        'Submission judge profile differs from the planned eligibility basis',
      );
    }
    const preferredCandidateDigest = submission.preferredOpaqueLabel === null
      ? null
      : secret.labelToDigest.get(submission.preferredOpaqueLabel);
    if (submission.preferredOpaqueLabel !== null && preferredCandidateDigest === undefined) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.INVALID_JUDGMENT,
        'Preferred opaque label is not part of the assignment',
      );
    }
    const evidenceId = adjudicationEvidenceId('raw-score', {
      adjudicationId: secret.adjudicationId,
      assignmentId: secret.assignmentId,
      judgmentId: submission.judgmentId,
    });
    return Object.freeze({
      judgmentId: submission.judgmentId,
      adjudicationId: secret.adjudicationId,
      assignmentId: secret.assignmentId,
      pairId: secret.pairId,
      judgeAssignmentId: secret.judgeAssignmentId,
      judgeId: judge.judgeId,
      order: secret.order,
      counterfactualKind: secret.counterfactualKind,
      baselineAssignmentId: secret.baselineAssignmentId,
      candidateDigests: secret.candidateDigests,
      outcome: submission.outcome,
      preferredCandidateDigest: preferredCandidateDigest ?? null,
      rationale: submission.rationale,
      evidenceLocators: submission.evidenceLocators,
      uncertainty: submission.uncertainty,
      hardVeto: submission.hardVeto,
      evidenceId,
    });
  }

  #resolveAssignment(assignment: JudgeAssignment): AssignmentSecret {
    const knownSecret = ASSIGNMENT_SECRETS.get(assignment);
    const registered = knownSecret
      ? this.#assignments.get(knownSecret.assignmentId)
      : undefined;
    const secret = registered === assignment ? ASSIGNMENT_SECRETS.get(assignment) : undefined;
    if (!secret) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.UNKNOWN_ASSIGNMENT,
        'Judge assignment is forged, stale, or owned by another registrar',
      );
    }
    return secret;
  }

  #createAssignment(
    adjudicationId: string,
    sourcePair: readonly [string, string],
    judge: JudgeProfile,
    order: AssignmentOrder,
    counterfactualKind: CounterfactualKind | null,
    baselineAssignmentId: string | null,
    counterfactualCueInput: CounterfactualCueInput | null,
  ): JudgeAssignment {
    const pair = adjudicationPairId(adjudicationId, sourcePair[0], sourcePair[1]);
    const assignmentId = assignmentIdentity(
      adjudicationId,
      pair,
      judge.judgeId,
      order,
      counterfactualKind,
      baselineAssignmentId,
    );
    if (this.#assignments.has(assignmentId)) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.INVALID_INPUT,
        'Assignment identity already exists',
        { assignmentId },
      );
    }
    const orderedDigests: readonly [string, string] = order === AssignmentOrders.FORWARD
      ? sourcePair
      : [sourcePair[1], sourcePair[0]];
    const labelToDigest = new Map<string, string>();
    const transformationByDigest = new Map<string, PresentationTransformation>();
    const candidates = orderedDigests.map((candidateDigest) => {
      const sourceContent = this.#sourceContentByDigest.get(candidateDigest);
      const presentedContent = this.#presentedContentByDigest.get(candidateDigest);
      if (sourceContent === undefined || presentedContent === undefined) {
        throw new AdjudicationError(
          AdjudicationErrorCodes.INVALID_INPUT,
          'Assignment references unregistered candidate content',
          { candidateDigest },
        );
      }
      const label = opaqueLabel(assignmentId, candidateDigest);
      labelToDigest.set(label, candidateDigest);
      const sourceContentDigest = digestCandidateContent(sourceContent);
      const presentedContentDigest = digestCandidateContent(presentedContent);
      const transformation: PresentationTransformation = Object.freeze({
        policyVersion: ADJUDICATION_PRESENTATION_POLICY_VERSION,
        transformation: 'merit-content-normalization',
        sourceContentDigest,
        presentedContentDigest,
      });
      transformationByDigest.set(candidateDigest, transformation);
      return {
        opaqueLabel: label,
        content: presentedContent,
        contentBoundary: 'untrusted-candidate-content',
        transformation: {
          policyVersion: transformation.policyVersion,
          transformation: transformation.transformation,
        },
      };
    }) as [JudgeAssignment['candidates'][0], JudgeAssignment['candidates'][1]];
    const judgeAssignmentId = adjudicationEvidenceId('judge-assignment', {
      assignmentId,
      judgeDigest: sha256Bytes(canonicalBytes({ judgeId: judge.judgeId })),
    });
    const contextCue: CounterfactualCue | null = counterfactualCueInput
      ? Object.freeze({
        token: counterfactualCueInput.token,
        targetOpaqueLabel: candidates[0].opaqueLabel,
      })
      : null;
    const assignment = freezeAssignment({
      candidates,
      rubricDigest: this.#request.rubricDigest,
      referenceDigest: this.#request.referenceDigest,
      judgePolicyVersion: this.#request.judgePolicyVersion,
      contextCue,
    });
    ASSIGNMENT_SECRETS.set(assignment, Object.freeze({
      assignmentId,
      adjudicationId,
      pairId: pair,
      judgeAssignmentId,
      judgeId: judge.judgeId,
      order,
      counterfactualKind,
      baselineAssignmentId,
      plannedProfileDigest: judgeProfileDigest(judge),
      plannedEligibilityBasisDigest: eligibilityBasisDigest(judge),
      candidateDigests: sourcePair,
      labelToDigest,
      transformationByDigest,
    }));
    this.#assignments.set(assignmentId, assignment);
    return assignment;
  }
}
