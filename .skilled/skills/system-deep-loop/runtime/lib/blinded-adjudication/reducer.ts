// ───────────────────────────────────────────────────────────────────
// MODULE: Blinded Adjudication Reducer
// ───────────────────────────────────────────────────────────────────

import {
  ADJUDICATION_REDUCER_VERSION,
  AdjudicationStatuses,
  AssignmentOrders,
  CounterfactualOutcomes,
  JudgmentOutcomes,
} from './contracts.js';
import { adjudicationPairId } from './blinding.js';
import { measureEffectiveIndependence } from './judging.js';

import type {
  AdjudicationReduction,
  AdjudicationRequest,
  CounterfactualResult,
  JudgeProfile,
  RawJudgment,
} from './contracts.js';

// ───────────────────────────────────────────────────────────────────
// 1. INTERNAL TYPES
// ───────────────────────────────────────────────────────────────────

interface MirroredJudgments {
  forward?: RawJudgment;
  reverse?: RawJudgment;
}

interface PairReduction {
  readonly pairId: string;
  readonly candidates: readonly [string, string];
  readonly winner: string | null;
  readonly isTie: boolean;
  readonly unstableReasons: readonly string[];
  readonly inconclusiveReasons: readonly string[];
  readonly minorityEvidenceIds: readonly string[];
}

// ───────────────────────────────────────────────────────────────────
// 2. PAIRWISE HELPERS
// ───────────────────────────────────────────────────────────────────

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function expectedPairs(
  adjudicationId: string,
  candidateDigests: readonly string[],
): readonly { readonly pairId: string; readonly candidates: readonly [string, string] }[] {
  const pairs: { readonly pairId: string; readonly candidates: readonly [string, string] }[] = [];
  for (let left = 0; left < candidateDigests.length; left += 1) {
    for (let right = left + 1; right < candidateDigests.length; right += 1) {
      const candidates = [candidateDigests[left], candidateDigests[right]] as const;
      pairs.push(Object.freeze({
        pairId: adjudicationPairId(adjudicationId, candidates[0], candidates[1]),
        candidates,
      }));
    }
  }
  return Object.freeze(pairs);
}

function groupMirroredJudgments(
  judgments: readonly RawJudgment[],
): ReadonlyMap<string, ReadonlyMap<string, MirroredJudgments>> {
  const grouped = new Map<string, Map<string, MirroredJudgments>>();
  for (const judgment of judgments) {
    if (judgment.counterfactualKind !== null) continue;
    const byJudge = grouped.get(judgment.pairId) ?? new Map<string, MirroredJudgments>();
    const mirrored = byJudge.get(judgment.judgeId) ?? {};
    if (
      (judgment.order === AssignmentOrders.FORWARD && mirrored.forward)
      || (judgment.order === AssignmentOrders.REVERSE && mirrored.reverse)
    ) {
      throw new Error('Duplicate mirrored judgment slot');
    }
    byJudge.set(judgment.judgeId, judgment.order === AssignmentOrders.FORWARD
      ? { ...mirrored, forward: judgment }
      : { ...mirrored, reverse: judgment });
    grouped.set(judgment.pairId, byJudge);
  }
  return grouped;
}

function reducePair(
  pairId: string,
  candidates: readonly [string, string],
  judgeIds: readonly string[],
  grouped: ReadonlyMap<string, ReadonlyMap<string, MirroredJudgments>>,
  quorum: number,
): PairReduction {
  const votes = new Map<string, number>(candidates.map((candidate) => [candidate, 0]));
  const unstableReasons: string[] = [];
  const inconclusiveReasons: string[] = [];
  const minorityEvidenceIds: string[] = [];
  let completeCount = 0;
  let tieVotes = 0;
  const byJudge = grouped.get(pairId);
  for (const judgeId of judgeIds) {
    const mirrored = byJudge?.get(judgeId);
    if (!mirrored?.forward || !mirrored.reverse) {
      inconclusiveReasons.push(`${pairId}:missing-mirrored-judgment:${judgeId}`);
      continue;
    }
    completeCount += 1;
    const forward = mirrored.forward;
    const reverse = mirrored.reverse;
    if (forward.hardVeto || reverse.hardVeto) {
      inconclusiveReasons.push(`${pairId}:hard-veto:${judgeId}`);
    }
    const nonDecisions = [
      JudgmentOutcomes.ABSTAIN,
      JudgmentOutcomes.INVALID,
      JudgmentOutcomes.INSUFFICIENT_EVIDENCE,
    ] as const;
    if (
      nonDecisions.includes(forward.outcome as typeof nonDecisions[number])
      || nonDecisions.includes(reverse.outcome as typeof nonDecisions[number])
    ) {
      inconclusiveReasons.push(`${pairId}:non-decision:${judgeId}`);
      continue;
    }
    if (
      forward.outcome === JudgmentOutcomes.TIE
      && reverse.outcome === JudgmentOutcomes.TIE
    ) {
      tieVotes += 1;
      minorityEvidenceIds.push(forward.evidenceId, reverse.evidenceId);
      continue;
    }
    if (
      forward.outcome !== JudgmentOutcomes.PREFERENCE
      || reverse.outcome !== JudgmentOutcomes.PREFERENCE
      || forward.preferredCandidateDigest !== reverse.preferredCandidateDigest
    ) {
      unstableReasons.push(`${pairId}:order-sensitive:${judgeId}`);
      continue;
    }
    const selected = forward.preferredCandidateDigest;
    if (selected === null || !votes.has(selected)) {
      inconclusiveReasons.push(`${pairId}:invalid-preference:${judgeId}`);
      continue;
    }
    votes.set(selected, (votes.get(selected) ?? 0) + 1);
  }
  if (completeCount < quorum) inconclusiveReasons.push(`${pairId}:insufficient-quorum`);
  const orderedVotes = Array.from(votes.entries()).sort((left, right) => {
    const countDifference = right[1] - left[1];
    return countDifference !== 0 ? countDifference : compareCodeUnits(left[0], right[0]);
  });
  const top = orderedVotes[0];
  const second = orderedVotes[1];
  const isTie = tieVotes > 0 || !top || top[1] === 0 || top[1] === second?.[1];
  const winner = isTie ? null : top[0];
  if (isTie) inconclusiveReasons.push(`${pairId}:unresolved-tie`);
  if (winner !== null) {
    for (const mirrored of byJudge?.values() ?? []) {
      for (const judgment of [mirrored.forward, mirrored.reverse]) {
        if (
          judgment
          && (
            judgment.outcome !== JudgmentOutcomes.PREFERENCE
            || judgment.preferredCandidateDigest !== winner
          )
        ) {
          minorityEvidenceIds.push(judgment.evidenceId);
        }
      }
    }
  }
  return Object.freeze({
    pairId,
    candidates,
    winner,
    isTie,
    unstableReasons: Object.freeze(unstableReasons),
    inconclusiveReasons: Object.freeze(inconclusiveReasons),
    minorityEvidenceIds: Object.freeze(Array.from(new Set(minorityEvidenceIds)).sort()),
  });
}

function findCycle(
  candidates: readonly string[],
  winnersByPair: ReadonlyMap<string, string>,
  adjudicationId: string,
): readonly string[] {
  const edges = new Map<string, string[]>();
  for (const candidate of candidates) edges.set(candidate, []);
  for (let left = 0; left < candidates.length; left += 1) {
    for (let right = left + 1; right < candidates.length; right += 1) {
      const winner = winnersByPair.get(adjudicationPairId(
        adjudicationId,
        candidates[left],
        candidates[right],
      ));
      if (!winner) continue;
      const loser = winner === candidates[left] ? candidates[right] : candidates[left];
      edges.get(winner)?.push(loser);
    }
  }
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const path: string[] = [];
  const visit = (candidate: string): readonly string[] | null => {
    if (visiting.has(candidate)) {
      const start = path.indexOf(candidate);
      return Object.freeze([...path.slice(start), candidate]);
    }
    if (visited.has(candidate)) return null;
    visiting.add(candidate);
    path.push(candidate);
    for (const target of edges.get(candidate) ?? []) {
      const cycle = visit(target);
      if (cycle) return cycle;
    }
    path.pop();
    visiting.delete(candidate);
    visited.add(candidate);
    return null;
  };
  for (const candidate of candidates) {
    const cycle = visit(candidate);
    if (cycle) return cycle;
  }
  return Object.freeze([]);
}

// ───────────────────────────────────────────────────────────────────
// 3. PUBLIC REDUCER
// ───────────────────────────────────────────────────────────────────

/** Derive a fail-closed verdict while retaining every component evidence identity. */
export function reduceAdjudication(
  adjudicationId: string,
  request: AdjudicationRequest,
  judgments: readonly RawJudgment[],
  counterfactuals: readonly CounterfactualResult[],
  judgeProfiles: readonly JudgeProfile[],
): AdjudicationReduction {
  if (new Set(judgments.map((judgment) => judgment.judgmentId)).size !== judgments.length) {
    throw new Error('Duplicate raw judgment identity');
  }
  if (new Set(counterfactuals.map((probe) => probe.probeId)).size !== counterfactuals.length) {
    throw new Error('Duplicate counterfactual probe identity');
  }
  const judgeIds = judgeProfiles.map((profile) => profile.judgeId).sort();
  const pairs = expectedPairs(adjudicationId, request.candidateDigests);
  const expectedPairIds = new Set(pairs.map((pair) => pair.pairId));
  const grouped = groupMirroredJudgments(judgments);
  const pairReductions = pairs.map((pair) => reducePair(
    pair.pairId,
    pair.candidates,
    judgeIds,
    grouped,
    request.quorum,
  ));
  const unstableReasons = pairReductions.flatMap((pair) => pair.unstableReasons);
  const inconclusiveReasons = pairReductions.flatMap((pair) => pair.inconclusiveReasons);
  for (const judgment of judgments) {
    if (
      judgment.adjudicationId !== adjudicationId
      || !expectedPairIds.has(judgment.pairId)
      || !judgeIds.includes(judgment.judgeId)
    ) {
      inconclusiveReasons.push(`${judgment.evidenceId}:out-of-contract-raw-score`);
    }
  }
  const judgmentsById = new Map(judgments.map((judgment) => [judgment.judgmentId, judgment]));
  for (const probe of counterfactuals) {
    const baseline = judgmentsById.get(probe.baselineJudgmentId);
    const intervention = judgmentsById.get(probe.interventionJudgmentId);
    if (
      !baseline
      || !intervention
      || baseline.adjudicationId !== adjudicationId
      || intervention.adjudicationId !== adjudicationId
      || baseline.pairId !== probe.pairId
      || intervention.pairId !== probe.pairId
      || intervention.counterfactualKind !== probe.kind
      || intervention.baselineAssignmentId !== baseline.assignmentId
    ) {
      inconclusiveReasons.push(`${probe.pairId}:invalid-counterfactual-link:${probe.kind}`);
    }
  }
  for (const pair of pairs) {
    for (const kind of request.requiredCounterfactuals) {
      const matching = counterfactuals.filter((probe) =>
        probe.adjudicationId === adjudicationId
        && probe.pairId === pair.pairId
        && probe.kind === kind);
      if (matching.length === 0) {
        inconclusiveReasons.push(`${pair.pairId}:missing-counterfactual:${kind}`);
      } else if (matching.some((probe) => probe.outcome === CounterfactualOutcomes.FLIP)) {
        unstableReasons.push(`${pair.pairId}:counterfactual-flip:${kind}`);
      } else if (matching.some((probe) =>
        probe.outcome === CounterfactualOutcomes.INDETERMINATE)) {
        inconclusiveReasons.push(`${pair.pairId}:counterfactual-indeterminate:${kind}`);
      }
    }
  }
  const independence = measureEffectiveIndependence(judgeProfiles.length, judgeProfiles);
  if (independence.effectiveIndependentCount < request.minimumEffectiveIndependence) {
    inconclusiveReasons.push('insufficient-effective-independence');
  }
  const vetoEvidenceIds = judgments
    .filter((judgment) => judgment.hardVeto)
    .map((judgment) => judgment.evidenceId)
    .sort();
  if (vetoEvidenceIds.length > 0) inconclusiveReasons.push('hard-veto-present');

  const winnersByPair = new Map(pairReductions
    .filter((pair): pair is PairReduction & { readonly winner: string } => pair.winner !== null)
    .map((pair) => [pair.pairId, pair.winner]));
  const condorcetCandidates = request.candidateDigests.filter((candidate) =>
    request.candidateDigests.every((opponent) => {
      if (candidate === opponent) return true;
      return winnersByPair.get(adjudicationPairId(adjudicationId, candidate, opponent)) === candidate;
    }));
  const cycle = findCycle(request.candidateDigests, winnersByPair, adjudicationId);
  const cycles = cycle.length > 0 ? [cycle] : [];
  if (cycles.length > 0) inconclusiveReasons.push('pairwise-cycle');
  if (condorcetCandidates.length !== 1) inconclusiveReasons.push('no-unique-pairwise-winner');

  const status = unstableReasons.length > 0
    ? AdjudicationStatuses.UNSTABLE
    : inconclusiveReasons.length > 0
      ? AdjudicationStatuses.INCONCLUSIVE
      : AdjudicationStatuses.STABLE;
  const preferredCandidateDigest = status === AdjudicationStatuses.STABLE
    ? condorcetCandidates[0] ?? null
    : null;
  const minorityEvidenceIds = new Set(pairReductions.flatMap((pair) => pair.minorityEvidenceIds));
  if (preferredCandidateDigest !== null) {
    for (const judgment of judgments) {
      if (
        judgment.outcome !== JudgmentOutcomes.PREFERENCE
        || judgment.preferredCandidateDigest !== preferredCandidateDigest
      ) {
        minorityEvidenceIds.add(judgment.evidenceId);
      }
    }
  }
  return Object.freeze({
    reducerVersion: ADJUDICATION_REDUCER_VERSION,
    status,
    preferredCandidateDigest,
    reasons: Object.freeze(Array.from(new Set([...unstableReasons, ...inconclusiveReasons])).sort()),
    rawScoreEvidenceIds: Object.freeze(judgments.map((judgment) => judgment.evidenceId).sort()),
    counterfactualEvidenceIds: Object.freeze(counterfactuals.map((probe) => probe.evidenceId).sort()),
    minorityEvidenceIds: Object.freeze(Array.from(minorityEvidenceIds).sort()),
    pairwiseGraph: Object.freeze(pairReductions.map((pair) => Object.freeze({
      pairId: pair.pairId,
      candidateDigests: pair.candidates,
      winnerCandidateDigest: pair.winner,
    }))),
    tiePairIds: Object.freeze(pairReductions.filter((pair) => pair.isTie)
      .map((pair) => pair.pairId).sort()),
    cycles: Object.freeze(cycles),
    vetoEvidenceIds: Object.freeze(vetoEvidenceIds),
    independence,
  });
}
