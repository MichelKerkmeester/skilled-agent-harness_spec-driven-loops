// ───────────────────────────────────────────────────────────────────
// MODULE: Blinded Adjudication Service
// ───────────────────────────────────────────────────────────────────

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
} from '../authorized-ledger/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  hashReplayFingerprintBytes,
  serializeReplayFingerprintDescriptor,
} from '../replay-fingerprint/index.js';
import {
  ADJUDICATION_MODE,
  ADJUDICATION_TRANSITION_POLICY_ID,
  ADJUDICATION_TRANSITION_POLICY_VERSION,
  AdjudicationError,
  AdjudicationErrorCodes,
  adjudicationEvidenceId,
} from './contracts.js';
import {
  BlindingRegistrar,
  CandidateIdentityVault,
} from './blinding.js';
import {
  AdjudicationEventTypes,
  CAPABILITY_BY_ADJUDICATION_EVENT,
  createAdjudicationEventPayload,
  createAdjudicationEventRegistry,
  createAdjudicationTransitionPolicyRegistry,
} from './event-registry.js';
import {
  adjudicationVerdictEvidenceId,
  counterfactualEventData,
  rawJudgmentEventData,
  reductionEventData,
  requestEventData,
  verdictEventData,
} from './event-data.js';
import { evaluateCounterfactual } from './judging.js';
import { reduceAdjudication } from './reducer.js';
import {
  requireDigest,
  requireIdentity,
  validateAdjudicationRequest,
  validateCandidateRegistration,
  validateJudgeProfile,
  validateJudgeSubmission,
} from './validation.js';

import type {
  AppendOnlyLedger as AppendOnlyLedgerType,
  AuthoritySnapshot,
  DurableAppendReceipt,
} from '../authorized-ledger/index.js';
import type {
  EventProducer,
  EventTypeRegistry,
  JsonObject,
} from '../event-envelope/index.js';
import type {
  VerifiedReplayFingerprint,
} from '../replay-fingerprint/index.js';
import type {
  AdjudicationRequest,
  AdjudicationVerdict,
  CandidateRegistration,
  CounterfactualKind,
  CounterfactualResult,
  JudgeAssignment,
  JudgeProfile,
  JudgeSubmission,
  RawJudgment,
} from './contracts.js';
import type { AdjudicationEventType } from './event-registry.js';
import type { DeblindedIdentity } from './blinding.js';

// ───────────────────────────────────────────────────────────────────
// 1. SERVICE TYPES
// ───────────────────────────────────────────────────────────────────

export interface DeblindingAuthorizationRequest {
  readonly adjudicationId: string;
  readonly actorClaim: string;
  readonly purpose: string;
  readonly candidateDigests: readonly string[];
}

export interface AuthenticatedDeblindingAuthorization {
  readonly principalId: string;
  readonly capabilityId: string;
  readonly authenticationMethod: string;
}

export interface BlindedAdjudicationServiceOptions {
  readonly rootDirectory: string;
  readonly ledgerId?: string;
  readonly auditLedgerId?: string;
  readonly authorityProvider: (
    mode: string,
  ) => AuthoritySnapshot | Promise<AuthoritySnapshot>;
  /** This boundary authenticates the caller claim and authorizes the exact requested scope. */
  readonly deblindingAuthorizer: (
    request: Readonly<DeblindingAuthorizationRequest>,
  ) => AuthenticatedDeblindingAuthorization | null
  | Promise<AuthenticatedDeblindingAuthorization | null>;
  readonly producer?: EventProducer;
  readonly now?: () => Date;
}

interface AdjudicationSession {
  readonly request: AdjudicationRequest;
  readonly vault: CandidateIdentityVault;
  readonly registrar: BlindingRegistrar;
  readonly judgments: Map<string, RawJudgment>;
  readonly judgeProfiles: Map<string, JudgeProfile>;
  readonly counterfactuals: Map<string, CounterfactualResult>;
  verdict: AdjudicationVerdict | null;
  isInvalidated: boolean;
}

// ───────────────────────────────────────────────────────────────────
// 2. SERVICE
// ───────────────────────────────────────────────────────────────────

/** Additive-dark orchestration over the shared envelope, gateway, ledger, and replay contracts. */
export class BlindedAdjudicationService {
  public readonly eventRegistry: EventTypeRegistry;
  public readonly ledger: AppendOnlyLedgerType;
  readonly #gateway: TransitionAuthorizationGateway;
  readonly #policies = createAdjudicationTransitionPolicyRegistry();
  readonly #authorityProvider: BlindedAdjudicationServiceOptions['authorityProvider'];
  readonly #deblindingAuthorizer: BlindedAdjudicationServiceOptions['deblindingAuthorizer'];
  readonly #producer: EventProducer;
  readonly #now: () => Date;
  readonly #sessions = new Map<string, AdjudicationSession>();
  readonly #receipts = new Map<string, DurableAppendReceipt>();

  public constructor(options: BlindedAdjudicationServiceOptions) {
    this.eventRegistry = createAdjudicationEventRegistry();
    this.#authorityProvider = options.authorityProvider;
    this.#deblindingAuthorizer = options.deblindingAuthorizer;
    this.#producer = Object.freeze(options.producer ?? {
      name: 'blinded-adjudication-service',
      version: '1',
    });
    this.#now = options.now ?? (() => new Date());
    this.ledger = new AppendOnlyLedger({
      rootDirectory: options.rootDirectory,
      ledgerId: options.ledgerId ?? 'blinded-adjudication-evidence',
      auditLedgerId: options.auditLedgerId ?? 'blinded-adjudication-authorization-audit',
      authorityProvider: options.authorityProvider,
      now: this.#now,
    }, this.eventRegistry);
    this.#gateway = new TransitionAuthorizationGateway({
      rootDirectory: options.rootDirectory,
      auditLedgerId: options.auditLedgerId ?? 'blinded-adjudication-authorization-audit',
      authorityProvider: options.authorityProvider,
      now: this.#now,
    }, this.ledger, this.#policies);
  }

  /** Register identity-bearing candidates and durably accept one versioned request. */
  public async acceptRequest(
    adjudicationIdInput: string,
    requestInput: AdjudicationRequest,
    candidateInputs: readonly CandidateRegistration[],
    verifiedReplay: VerifiedReplayFingerprint<JsonObject>,
    actorId = 'adjudication-registrar',
  ): Promise<DurableAppendReceipt> {
    const adjudicationId = requireIdentity(adjudicationIdInput, '$.adjudicationId');
    if (this.#sessions.has(adjudicationId)) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.INVALID_INPUT,
        'Adjudication identity is already registered',
        { adjudicationId },
      );
    }
    const request = validateAdjudicationRequest(requestInput);
    this.#assertVerifiedReplay(request, verifiedReplay);
    const candidates = candidateInputs.map(validateCandidateRegistration);
    const candidateDigests = candidates.map((candidate) => candidate.candidateDigest);
    if (
      candidates.length !== request.candidateDigests.length
      || request.candidateDigests.some((digest) => !candidateDigests.includes(digest))
    ) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.INVALID_INPUT,
        'Candidate registrations must exactly match request candidate digests',
      );
    }
    if (new Set(candidates.map((candidate) => candidate.originalPosition)).size !== candidates.length) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.INVALID_INPUT,
        'Candidate original positions must be unique',
      );
    }
    const vault = new CandidateIdentityVault();
    candidates.forEach((candidate) => vault.register(candidate));
    vault.seal();
    const session: AdjudicationSession = {
      request,
      vault,
      registrar: new BlindingRegistrar(request, candidates, vault),
      judgments: new Map(),
      judgeProfiles: new Map(),
      counterfactuals: new Map(),
      verdict: null,
      isInvalidated: false,
    };
    this.#sessions.set(adjudicationId, session);
    const evidenceId = adjudicationEvidenceId('request', {
      adjudicationId,
      request,
      replayFingerprint: request.replayFingerprint,
    });
    try {
      return await this.#appendEvidence(
        adjudicationId,
        request,
        AdjudicationEventTypes.REQUEST_ACCEPTED,
        evidenceId,
        null,
        requestEventData(request),
        requireIdentity(actorId, '$.actorId'),
      );
    } catch (error: unknown) {
      this.#sessions.delete(adjudicationId);
      throw error;
    }
  }

  /** Create and ledger every mirrored pair presentation before returning judge views. */
  public async planMirroredAssignments(
    adjudicationId: string,
    judgeInputs: readonly JudgeProfile[],
    actorId = 'adjudication-assignment-planner',
  ): Promise<readonly JudgeAssignment[]> {
    const session = this.#session(adjudicationId);
    this.#assertOpen(session);
    const judges = judgeInputs.map(validateJudgeProfile);
    const assignments = session.registrar.planMirroredAssignments(adjudicationId, judges);
    for (const assignment of assignments) {
      await this.#recordPresentation(session, assignment, actorId);
    }
    return assignments;
  }

  /** Plan and ledger a targeted merit-irrelevant intervention. */
  public async planCounterfactualAssignment(
    adjudicationId: string,
    baselineAssignment: JudgeAssignment,
    kind: CounterfactualKind,
    judgeInput: JudgeProfile,
    interventionToken?: string,
    actorId = 'adjudication-assignment-planner',
  ): Promise<JudgeAssignment> {
    const session = this.#session(adjudicationId);
    this.#assertOpen(session);
    const assignment = session.registrar.planCounterfactualAssignment(
      baselineAssignment,
      kind,
      validateJudgeProfile(judgeInput),
      interventionToken,
    );
    await this.#recordPresentation(session, assignment, actorId);
    return assignment;
  }

  /** Validate and append immutable raw judging evidence before any reduction. */
  public async recordJudgment(
    adjudicationId: string,
    assignment: JudgeAssignment,
    judgeInput: JudgeProfile,
    submissionInput: JudgeSubmission,
    actorId = 'adjudication-judge-gateway',
  ): Promise<RawJudgment> {
    const session = this.#session(adjudicationId);
    this.#assertOpen(session);
    const judge = validateJudgeProfile(judgeInput);
    const submission = validateJudgeSubmission(submissionInput);
    if (session.judgments.has(submission.judgmentId)) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.INVALID_JUDGMENT,
        'Judgment identity is already recorded',
      );
    }
    const existingProfile = session.judgeProfiles.get(judge.judgeId);
    if (
      existingProfile
      && sha256Bytes(canonicalBytes(existingProfile as unknown as JsonObject))
        !== sha256Bytes(canonicalBytes(judge as unknown as JsonObject))
    ) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.INVALID_JUDGMENT,
        'Judge independence metadata changed during adjudication',
      );
    }
    const judgment = session.registrar.acceptSubmission(
      assignment,
      judge,
      submission,
    );
    await this.#appendEvidence(
      adjudicationId,
      session.request,
      AdjudicationEventTypes.SCORE_RECORDED,
      judgment.evidenceId,
      judgment.judgeAssignmentId,
      rawJudgmentEventData(judgment, judge),
      requireIdentity(actorId, '$.actorId'),
    );
    session.judgments.set(judgment.judgmentId, judgment);
    session.judgeProfiles.set(judge.judgeId, judge);
    return judgment;
  }

  /** Link two recorded judgments and append their flip classification. */
  public async recordCounterfactualResult(
    adjudicationId: string,
    probeId: string,
    kind: CounterfactualKind,
    baselineJudgmentId: string,
    interventionJudgmentId: string,
    actorId = 'adjudication-counterfactual-evaluator',
  ): Promise<CounterfactualResult> {
    const session = this.#session(adjudicationId);
    this.#assertOpen(session);
    const baseline = session.judgments.get(baselineJudgmentId);
    const intervention = session.judgments.get(interventionJudgmentId);
    if (!baseline || !intervention) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.INVALID_COUNTERFACTUAL,
        'Counterfactual references an unknown raw judgment',
      );
    }
    if (
      intervention.counterfactualKind !== kind
      || intervention.baselineAssignmentId !== baseline.assignmentId
    ) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.INVALID_COUNTERFACTUAL,
        'Intervention assignment is not linked to the declared baseline and kind',
      );
    }
    const result = evaluateCounterfactual(
      requireIdentity(probeId, '$.probeId'),
      kind,
      baseline,
      intervention,
    );
    if (session.counterfactuals.has(result.probeId)) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.INVALID_COUNTERFACTUAL,
        'Counterfactual probe identity is already recorded',
      );
    }
    await this.#appendEvidence(
      adjudicationId,
      session.request,
      AdjudicationEventTypes.COUNTERFACTUAL_EVALUATED,
      result.evidenceId,
      intervention.judgeAssignmentId,
      counterfactualEventData(result),
      requireIdentity(actorId, '$.actorId'),
    );
    session.counterfactuals.set(result.probeId, result);
    return result;
  }

  /** Reduce ordered raw evidence and append both the reduction and final shadow verdict. */
  public async finalize(
    adjudicationId: string,
    actorId = 'adjudication-reducer',
  ): Promise<AdjudicationVerdict> {
    const session = this.#session(adjudicationId);
    if (session.verdict && !session.isInvalidated) return session.verdict;
    if (session.isInvalidated) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.INVALID_INPUT,
        'Invalidated adjudication cannot emit another verdict without a new identity',
      );
    }
    const reduction = reduceAdjudication(
      adjudicationId,
      session.request,
      Array.from(session.judgments.values()),
      Array.from(session.counterfactuals.values()),
      Array.from(session.judgeProfiles.values()),
    );
    const reductionData = reductionEventData(reduction);
    const reductionEvidenceId = adjudicationEvidenceId('reduction', {
      adjudicationId,
      reduction: reductionData,
    });
    await this.#appendEvidence(
      adjudicationId,
      session.request,
      AdjudicationEventTypes.REDUCTION_COMPLETED,
      reductionEvidenceId,
      null,
      reductionData,
      requireIdentity(actorId, '$.actorId'),
    );
    const verdictWithoutEvidenceId: Omit<AdjudicationVerdict, 'verdictEvidenceId'> = Object.freeze({
      adjudicationId,
      decisionKind: session.request.decisionKind,
      status: reduction.status,
      preferredCandidateDigest: reduction.preferredCandidateDigest,
      reductionEvidenceId,
      rawScoreEvidenceIds: reduction.rawScoreEvidenceIds,
      counterfactualEvidenceIds: reduction.counterfactualEvidenceIds,
      minorityEvidenceIds: reduction.minorityEvidenceIds,
      pairwiseGraph: reduction.pairwiseGraph,
      tiePairIds: reduction.tiePairIds,
      cycles: reduction.cycles,
      vetoEvidenceIds: reduction.vetoEvidenceIds,
      independence: reduction.independence,
      replayFingerprint: session.request.replayFingerprint,
      legacyAuthority: 'canonical',
      serviceAuthority: 'shadow-only',
    });
    const verdictEvidenceId = adjudicationVerdictEvidenceId(verdictWithoutEvidenceId);
    const verdict: AdjudicationVerdict = Object.freeze({
      ...verdictWithoutEvidenceId,
      verdictEvidenceId,
    });
    await this.#appendEvidence(
      adjudicationId,
      session.request,
      AdjudicationEventTypes.VERDICT_RECORDED,
      verdictEvidenceId,
      null,
      verdictEventData(verdict),
      requireIdentity(actorId, '$.actorId'),
    );
    session.verdict = verdict;
    return verdict;
  }

  /** Append an invalidation while preserving the original raw and reduced evidence. */
  public async invalidateVerdict(
    adjudicationId: string,
    reason: string,
    actorId = 'adjudication-auditor',
  ): Promise<DurableAppendReceipt> {
    const session = this.#session(adjudicationId);
    if (!session.verdict || session.isInvalidated || reason.trim() === '') {
      throw new AdjudicationError(
        AdjudicationErrorCodes.INVALID_INPUT,
        'Invalidation requires one current verdict and a non-empty reason',
      );
    }
    const evidenceId = adjudicationEvidenceId('invalidation', {
      adjudicationId,
      invalidatedEvidenceId: session.verdict.verdictEvidenceId,
      reason,
    });
    const receipt = await this.#appendEvidence(
      adjudicationId,
      session.request,
      AdjudicationEventTypes.VERDICT_INVALIDATED,
      evidenceId,
      null,
      {
        invalidated_evidence_id: session.verdict.verdictEvidenceId,
        reason,
      },
      requireIdentity(actorId, '$.actorId'),
    );
    session.isInvalidated = true;
    return receipt;
  }

  /** Audit authorization before releasing any scoped identity-map result. */
  public async requestDeblinding(
    adjudicationId: string,
    actorClaimInput: string,
    purpose: string,
    candidateDigestInputs: readonly string[],
  ): Promise<readonly DeblindedIdentity[]> {
    const session = this.#session(adjudicationId);
    const actorClaim = requireIdentity(actorClaimInput, '$.actorClaim');
    if (purpose.trim() === '' || purpose.length > 1_000) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.INVALID_INPUT,
        'Deblinding purpose must be a bounded non-empty string',
      );
    }
    const candidateDigests = candidateDigestInputs.map((digest, index) =>
      requireDigest(digest, `$.candidateDigests[${index}]`));
    if (
      candidateDigests.length === 0
      || new Set(candidateDigests).size !== candidateDigests.length
      || candidateDigests.some((digest) => !session.request.candidateDigests.includes(digest))
    ) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.INVALID_INPUT,
        'Deblinding scope must reference registered candidates',
      );
    }
    const isVerdictFinal = session.verdict !== null && !session.isInvalidated;
    let authorization: AuthenticatedDeblindingAuthorization | null = null;
    if (isVerdictFinal) {
      const authorizerResult = await this.#deblindingAuthorizer({
        adjudicationId,
        actorClaim,
        purpose,
        candidateDigests,
      });
      if (authorizerResult !== null) {
        try {
          authorization = Object.freeze({
            principalId: requireIdentity(
              authorizerResult.principalId,
              '$.authorization.principalId',
            ),
            capabilityId: requireIdentity(
              authorizerResult.capabilityId,
              '$.authorization.capabilityId',
            ),
            authenticationMethod: requireIdentity(
              authorizerResult.authenticationMethod,
              '$.authorization.authenticationMethod',
            ),
          });
        } catch {
          authorization = null;
        }
      }
    }
    const isAuthorized = isVerdictFinal && authorization !== null;
    const result = isAuthorized ? 'authorized' : 'denied';
    const evidenceId = adjudicationEvidenceId('deblinding-audit', {
      adjudicationId,
      actorClaim,
      authenticatedPrincipalId: authorization?.principalId ?? null,
      authorizationCapabilityId: authorization?.capabilityId ?? null,
      authenticationMethod: authorization?.authenticationMethod ?? null,
      purpose,
      candidateDigests,
      result,
    });
    await this.#appendEvidence(
      adjudicationId,
      session.request,
      AdjudicationEventTypes.DEBLINDING_AUDITED,
      evidenceId,
      null,
      {
        caller_claim: actorClaim,
        authenticated_principal_id: authorization?.principalId ?? null,
        authorization_capability_id: authorization?.capabilityId ?? null,
        authentication_method: authorization?.authenticationMethod ?? null,
        purpose,
        scope_candidate_digests: candidateDigests,
        identity_map_version: 'identity-map@1',
        result,
      },
      authorization?.principalId ?? 'adjudication-deblinding-gateway',
    );
    const capability = session.vault.mintDeblindingCapability(isVerdictFinal, isAuthorized);
    return session.vault.deblind(capability, candidateDigests);
  }

  /** Record shadow comparison evidence while returning the exact canonical legacy value. */
  public async recordShadowComparison<T>(
    adjudicationId: string,
    legacyResult: T,
    legacyOutcomeDigestInput: string,
    matchesLegacy: boolean,
    actorId = 'adjudication-shadow-comparator',
  ): Promise<T> {
    const session = this.#session(adjudicationId);
    if (!session.verdict || session.isInvalidated) return legacyResult;
    try {
      const legacyOutcomeDigest = requireDigest(
        legacyOutcomeDigestInput,
        '$.legacyOutcomeDigest',
      );
      const evidenceId = adjudicationEvidenceId('shadow-comparison', {
        adjudicationId,
        legacyOutcomeDigest,
        adjudicationStatus: session.verdict.status,
        preferredCandidateDigest: session.verdict.preferredCandidateDigest,
        matchesLegacy,
      });
      await this.#appendEvidence(
        adjudicationId,
        session.request,
        AdjudicationEventTypes.SHADOW_COMPARED,
        evidenceId,
        null,
        {
          legacy_outcome_digest: legacyOutcomeDigest,
          adjudication_status: session.verdict.status,
          preferred_candidate_digest: session.verdict.preferredCandidateDigest,
          matches_legacy: matchesLegacy,
          service_authoritative: false,
        },
        requireIdentity(actorId, '$.actorId'),
      );
    } catch {
      // Shadow evidence must never become an alternate legacy control-flow channel.
    }
    return legacyResult;
  }

  async #recordPresentation(
    session: AdjudicationSession,
    assignment: JudgeAssignment,
    actorId: string,
  ): Promise<void> {
    const data = session.registrar.presentationEvidence(assignment);
    const evidenceId = adjudicationEvidenceId('presentation', {
      adjudicationId: data.adjudication_id,
      assignmentId: data.assignment_id,
      presentation: data,
    });
    await this.#appendEvidence(
      data.adjudication_id,
      session.request,
      AdjudicationEventTypes.PRESENTATION_BLINDED,
      evidenceId,
      data.judge_assignment_id,
      data,
      requireIdentity(actorId, '$.actorId'),
    );
  }

  async #appendEvidence(
    adjudicationId: string,
    request: AdjudicationRequest,
    eventType: AdjudicationEventType,
    evidenceId: string,
    judgeAssignmentId: string | null,
    data: JsonObject,
    actorId: string,
  ): Promise<DurableAppendReceipt> {
    const eventKey = `${eventType}:${evidenceId}`;
    const priorReceipt = this.#receipts.get(eventKey);
    if (priorReceipt) return priorReceipt;
    const head = await this.ledger.getVerifiedHead();
    const priorEvents = head.sequence === 0 ? [] : await this.ledger.readVerifiedEvents();
    const causationId = priorEvents.length === 0
      ? null
      : priorEvents[priorEvents.length - 1].event.effective.envelope.event_id;
    const authority = await this.#authorityProvider(ADJUDICATION_MODE);
    const payload = createAdjudicationEventPayload(
      adjudicationId,
      request,
      evidenceId,
      judgeAssignmentId,
      data,
    );
    const timestamp = this.#now().toISOString();
    const eventId = `adjudication-event-${sha256Bytes(canonicalBytes({
      eventType,
      evidenceId,
    })).slice(0, 32)}`;
    const event = prepareEventWrite({
      envelope_version: CURRENT_ENVELOPE_VERSION,
      event_id: eventId,
      event_type: eventType,
      event_version: 1,
      stream_id: adjudicationId,
      stream_sequence: head.sequence + 1,
      occurred_at: timestamp,
      recorded_at: timestamp,
      producer: this.#producer,
      authority_epoch: authority.epoch,
      correlation_id: adjudicationId,
      causation_id: causationId,
      idempotency_key: eventId,
      payload,
    }, this.eventRegistry);
    const policy = this.#policies.resolve(
      ADJUDICATION_TRANSITION_POLICY_ID,
      ADJUDICATION_TRANSITION_POLICY_VERSION,
    );
    const authorization = await this.#gateway.authorize({
      requestId: `authorize-${eventId}`,
      mode: ADJUDICATION_MODE,
      event,
      priorHead: head,
      priorStateVersion: 'blinded-adjudication-state@1',
      priorStateFingerprint: head.recordHash,
      actorId,
      capabilityId: CAPABILITY_BY_ADJUDICATION_EVENT[eventType],
      authorityEpoch: authority.epoch,
      policy: {
        policyId: policy.policyId,
        policyVersion: policy.policyVersion,
        policyDigest: policy.digest,
      },
      evidenceDigest: event.canonicalDigest,
    });
    if (authorization.verdict !== 'allow') {
      throw new AdjudicationError(
        AdjudicationErrorCodes.AUTHORIZATION_DENIED,
        'Adjudication evidence append was denied by the transition gateway',
        { reasonCode: authorization.reasonCode },
      );
    }
    const receipt = await this.ledger.appendAuthorized(event, authorization.proof);
    this.#receipts.set(eventKey, receipt);
    return receipt;
  }

  #session(adjudicationIdInput: string): AdjudicationSession {
    const adjudicationId = requireIdentity(adjudicationIdInput, '$.adjudicationId');
    const session = this.#sessions.get(adjudicationId);
    if (!session) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.INVALID_INPUT,
        'Adjudication identity is not registered',
        { adjudicationId },
      );
    }
    return session;
  }

  #assertOpen(session: AdjudicationSession): void {
    if (session.verdict !== null || session.isInvalidated) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.INVALID_INPUT,
        'Adjudication scoring is closed after verdict finalization',
      );
    }
  }

  #assertVerifiedReplay(
    request: AdjudicationRequest,
    verifiedReplay: VerifiedReplayFingerprint<JsonObject>,
  ): void {
    try {
      const commitmentBytes = serializeReplayFingerprintDescriptor(
        verifiedReplay.descriptor,
        false,
      );
      const recomputed = hashReplayFingerprintBytes(commitmentBytes);
      if (
        recomputed !== verifiedReplay.descriptor.final_digest
        || recomputed !== request.replayFingerprint
        || verifiedReplay.projection.digest !== verifiedReplay.descriptor.projection_digest
        || !Number.isSafeInteger(verifiedReplay.attestationSequence)
        || verifiedReplay.attestationSequence <= 0
      ) {
        throw new Error('verified replay binding mismatch');
      }
    } catch {
      throw new AdjudicationError(
        AdjudicationErrorCodes.REPLAY_MISMATCH,
        'Request replay fingerprint is not bound to verified shared replay evidence',
      );
    }
  }
}
