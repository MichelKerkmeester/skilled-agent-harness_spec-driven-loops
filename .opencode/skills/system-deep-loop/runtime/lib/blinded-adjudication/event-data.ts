// ───────────────────────────────────────────────────────────────────
// MODULE: Blinded Adjudication Event Data
// ───────────────────────────────────────────────────────────────────

import type { JsonObject } from '../event-envelope/index.js';
import type {
  AdjudicationReduction,
  AdjudicationRequest,
  AdjudicationVerdict,
  CounterfactualResult,
  JudgeProfile,
  RawJudgment,
} from './contracts.js';

// ───────────────────────────────────────────────────────────────────
// 1. SERIALIZERS
// ───────────────────────────────────────────────────────────────────

/** Serialize a validated request without changing its field vocabulary. */
export function requestEventData(request: AdjudicationRequest): JsonObject {
  return { request } as unknown as JsonObject;
}

/** Serialize post-judging metadata separately from the judge-facing assignment. */
export function judgeProfileEventData(profile: JudgeProfile): JsonObject {
  return {
    judgeId: profile.judgeId,
    equivalentIdentityIds: [...profile.equivalentIdentityIds],
    modelFamily: profile.modelFamily,
    providerFamily: profile.providerFamily,
    reasoningMethod: profile.reasoningMethod,
    evidenceProvenanceDigests: [...profile.evidenceProvenanceDigests],
    residualErrorGroup: profile.residualErrorGroup,
    competenceEstimate: profile.competenceEstimate,
  };
}

/** Serialize immutable pre-reduction judging evidence. */
export function rawJudgmentEventData(
  judgment: RawJudgment,
  judgeProfile: JudgeProfile,
): JsonObject {
  return {
    judgment_id: judgment.judgmentId,
    assignment_id: judgment.assignmentId,
    pair_id: judgment.pairId,
    judge_id: judgment.judgeId,
    order: judgment.order,
    counterfactual_kind: judgment.counterfactualKind,
    baseline_assignment_id: judgment.baselineAssignmentId,
    candidate_digests: [...judgment.candidateDigests],
    outcome: judgment.outcome,
    preferred_candidate_digest: judgment.preferredCandidateDigest,
    rationale: judgment.rationale,
    evidence_locators: [...judgment.evidenceLocators],
    uncertainty: judgment.uncertainty,
    hard_veto: judgment.hardVeto,
    judge_profile: judgeProfileEventData(judgeProfile),
  };
}

/** Serialize one linked counterfactual classification. */
export function counterfactualEventData(result: CounterfactualResult): JsonObject {
  return {
    probe_id: result.probeId,
    pair_id: result.pairId,
    kind: result.kind,
    baseline_judgment_id: result.baselineJudgmentId,
    intervention_judgment_id: result.interventionJudgmentId,
    outcome: result.outcome,
  };
}

/** Serialize the complete non-destructive reduction. */
export function reductionEventData(reduction: AdjudicationReduction): JsonObject {
  return {
    reducer_version: reduction.reducerVersion,
    status: reduction.status,
    preferred_candidate_digest: reduction.preferredCandidateDigest,
    reasons: [...reduction.reasons],
    raw_score_evidence_ids: [...reduction.rawScoreEvidenceIds],
    counterfactual_evidence_ids: [...reduction.counterfactualEvidenceIds],
    minority_evidence_ids: [...reduction.minorityEvidenceIds],
    pairwise_graph: reduction.pairwiseGraph.map((edge) => ({
      pairId: edge.pairId,
      candidateDigests: [...edge.candidateDigests],
      winnerCandidateDigest: edge.winnerCandidateDigest,
    })),
    tie_pair_ids: [...reduction.tiePairIds],
    cycles: reduction.cycles.map((cycle) => [...cycle]),
    veto_evidence_ids: [...reduction.vetoEvidenceIds],
    independence: {
      configuredSeatCount: reduction.independence.configuredSeatCount,
      observedSeatCount: reduction.independence.observedSeatCount,
      effectiveIndependentCount: reduction.independence.effectiveIndependentCount,
      clusters: reduction.independence.clusters.map((cluster) => ({
        clusterId: cluster.clusterId,
        judgeIds: [...cluster.judgeIds],
        sharedSignals: [...cluster.sharedSignals],
      })),
      residualCorrelationWarnings: [...reduction.independence.residualCorrelationWarnings],
      competenceEstimatesAdvisory: { ...reduction.independence.competenceEstimatesAdvisory },
      competenceWeightsCorrectCorrelation: false,
    },
  };
}

/** Serialize the mode-facing verdict without adding transition authority. */
export function verdictEventData(verdict: AdjudicationVerdict): JsonObject {
  return {
    decision_kind: verdict.decisionKind,
    status: verdict.status,
    preferred_candidate_digest: verdict.preferredCandidateDigest,
    reduction_evidence_id: verdict.reductionEvidenceId,
    raw_score_evidence_ids: [...verdict.rawScoreEvidenceIds],
    counterfactual_evidence_ids: [...verdict.counterfactualEvidenceIds],
    minority_evidence_ids: [...verdict.minorityEvidenceIds],
    pairwise_graph: verdict.pairwiseGraph.map((edge) => ({
      pairId: edge.pairId,
      candidateDigests: [...edge.candidateDigests],
      winnerCandidateDigest: edge.winnerCandidateDigest,
    })),
    tie_pair_ids: [...verdict.tiePairIds],
    cycles: verdict.cycles.map((cycle) => [...cycle]),
    veto_evidence_ids: [...verdict.vetoEvidenceIds],
    independence: {
      configuredSeatCount: verdict.independence.configuredSeatCount,
      observedSeatCount: verdict.independence.observedSeatCount,
      effectiveIndependentCount: verdict.independence.effectiveIndependentCount,
      clusters: verdict.independence.clusters.map((cluster) => ({
        clusterId: cluster.clusterId,
        judgeIds: [...cluster.judgeIds],
        sharedSignals: [...cluster.sharedSignals],
      })),
      residualCorrelationWarnings: [...verdict.independence.residualCorrelationWarnings],
      competenceEstimatesAdvisory: { ...verdict.independence.competenceEstimatesAdvisory },
      competenceWeightsCorrectCorrelation: false,
    },
    service_authority: 'shadow-only',
  };
}
