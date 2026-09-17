// ───────────────────────────────────────────────────────────────────
// MODULE: Counterfactual and Independence Evaluation
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import {
  AdjudicationError,
  AdjudicationErrorCodes,
  CounterfactualOutcomes,
  JudgmentOutcomes,
  adjudicationEvidenceId,
} from './contracts.js';
import { validateJudgeProfile } from './validation.js';

import type {
  CounterfactualKind,
  CounterfactualResult,
  EffectiveIndependenceEvidence,
  IndependenceCluster,
  JudgeProfile,
  RawJudgment,
} from './contracts.js';

// ───────────────────────────────────────────────────────────────────
// 1. COUNTERFACTUAL EVALUATION
// ───────────────────────────────────────────────────────────────────

/** Compare one baseline judgment with one policy-linked intervention. */
export function evaluateCounterfactual(
  probeId: string,
  kind: CounterfactualKind,
  baseline: RawJudgment,
  intervention: RawJudgment,
): CounterfactualResult {
  if (
    baseline.adjudicationId !== intervention.adjudicationId
    || baseline.pairId !== intervention.pairId
    || baseline.judgeId !== intervention.judgeId
    || baseline.judgmentId === intervention.judgmentId
  ) {
    throw new AdjudicationError(
      AdjudicationErrorCodes.INVALID_COUNTERFACTUAL,
      'Counterfactual judgments must share adjudication, pair, and judge identities',
    );
  }
  let outcome: CounterfactualResult['outcome'];
  if (
    baseline.outcome === JudgmentOutcomes.PREFERENCE
    && intervention.outcome === JudgmentOutcomes.PREFERENCE
  ) {
    outcome = baseline.preferredCandidateDigest === intervention.preferredCandidateDigest
      ? CounterfactualOutcomes.NO_FLIP
      : CounterfactualOutcomes.FLIP;
  } else if (
    baseline.outcome === JudgmentOutcomes.TIE
    && intervention.outcome === JudgmentOutcomes.TIE
  ) {
    outcome = CounterfactualOutcomes.NO_FLIP;
  } else if (
    baseline.outcome === JudgmentOutcomes.INVALID
    || intervention.outcome === JudgmentOutcomes.INVALID
    || baseline.outcome === JudgmentOutcomes.ABSTAIN
    || intervention.outcome === JudgmentOutcomes.ABSTAIN
    || baseline.outcome === JudgmentOutcomes.INSUFFICIENT_EVIDENCE
    || intervention.outcome === JudgmentOutcomes.INSUFFICIENT_EVIDENCE
  ) {
    outcome = CounterfactualOutcomes.INDETERMINATE;
  } else {
    outcome = CounterfactualOutcomes.FLIP;
  }
  const evidenceId = adjudicationEvidenceId('counterfactual', {
    probeId,
    kind,
    baselineJudgmentId: baseline.judgmentId,
    interventionJudgmentId: intervention.judgmentId,
    outcome,
  });
  return Object.freeze({
    probeId,
    adjudicationId: baseline.adjudicationId,
    pairId: baseline.pairId,
    kind,
    baselineJudgmentId: baseline.judgmentId,
    interventionJudgmentId: intervention.judgmentId,
    outcome,
    evidenceId,
  });
}

// ───────────────────────────────────────────────────────────────────
// 2. EFFECTIVE INDEPENDENCE
// ───────────────────────────────────────────────────────────────────

function profileSignals(profile: JudgeProfile): ReadonlySet<string> {
  return new Set([
    `model:${profile.modelFamily}`,
    `provider:${profile.providerFamily}`,
    `reasoning:${profile.reasoningMethod}`,
    `residual:${profile.residualErrorGroup}`,
    ...profile.evidenceProvenanceDigests.map((digest) => `evidence:${digest}`),
  ]);
}

function sharedSignals(
  left: ReadonlySet<string>,
  right: ReadonlySet<string>,
): readonly string[] {
  return Object.freeze(Array.from(left).filter((signal) => right.has(signal)).sort());
}

function findRoot(parents: number[], index: number): number {
  let root = index;
  while (parents[root] !== root) root = parents[root];
  let current = index;
  while (parents[current] !== current) {
    const next = parents[current];
    parents[current] = root;
    current = next;
  }
  return root;
}

function unite(parents: number[], left: number, right: number): void {
  const leftRoot = findRoot(parents, left);
  const rightRoot = findRoot(parents, right);
  if (leftRoot !== rightRoot) parents[rightRoot] = leftRoot;
}

/** Measure conservative independence after judging without producing vote weights. */
export function measureEffectiveIndependence(
  configuredSeatCount: number,
  profileInputs: readonly JudgeProfile[],
): EffectiveIndependenceEvidence {
  if (!Number.isSafeInteger(configuredSeatCount) || configuredSeatCount < profileInputs.length) {
    throw new AdjudicationError(
      AdjudicationErrorCodes.INVALID_INPUT,
      'Configured seat count must cover every observed judge profile',
    );
  }
  const profiles = profileInputs.map(validateJudgeProfile);
  if (new Set(profiles.map((profile) => profile.judgeId)).size !== profiles.length) {
    throw new AdjudicationError(
      AdjudicationErrorCodes.INVALID_INPUT,
      'Judge profiles must have unique identities',
    );
  }
  const signals = profiles.map(profileSignals);
  const parents = profiles.map((_profile, index) => index);
  const pairSignals = new Map<string, readonly string[]>();
  for (let left = 0; left < profiles.length; left += 1) {
    for (let right = left + 1; right < profiles.length; right += 1) {
      const shared = sharedSignals(signals[left], signals[right]);
      if (shared.length > 0) {
        unite(parents, left, right);
        pairSignals.set(`${left}:${right}`, shared);
      }
    }
  }
  const indicesByRoot = new Map<number, number[]>();
  profiles.forEach((_profile, index) => {
    const root = findRoot(parents, index);
    const indices = indicesByRoot.get(root) ?? [];
    indices.push(index);
    indicesByRoot.set(root, indices);
  });
  const clusters: IndependenceCluster[] = [];
  const warnings: string[] = [];
  for (const indices of indicesByRoot.values()) {
    const judgeIds = indices.map((index) => profiles[index].judgeId).sort();
    const clusterSignals = new Set<string>();
    for (let left = 0; left < indices.length; left += 1) {
      for (let right = left + 1; right < indices.length; right += 1) {
        for (const signal of pairSignals.get(`${indices[left]}:${indices[right]}`) ?? []) {
          clusterSignals.add(signal);
        }
      }
    }
    const shared = Array.from(clusterSignals).sort();
    const clusterId = `cluster-${sha256Bytes(canonicalBytes({ judgeIds, shared })).slice(0, 16)}`;
    clusters.push(Object.freeze({
      clusterId,
      judgeIds: Object.freeze(judgeIds),
      sharedSignals: Object.freeze(shared),
    }));
    if (indices.length > 1) {
      warnings.push(`${clusterId}:correlated-seats:${String(indices.length)}`);
    }
  }
  clusters.sort((left, right) => left.clusterId.localeCompare(right.clusterId));
  const competenceEstimatesAdvisory: Record<string, number> = Object.create(null);
  for (const profile of profiles) {
    if (profile.competenceEstimate !== null) {
      competenceEstimatesAdvisory[profile.judgeId] = profile.competenceEstimate;
    }
  }
  return Object.freeze({
    configuredSeatCount,
    observedSeatCount: profiles.length,
    effectiveIndependentCount: clusters.length,
    clusters: Object.freeze(clusters),
    residualCorrelationWarnings: Object.freeze(warnings.sort()),
    competenceEstimatesAdvisory: Object.freeze(competenceEstimatesAdvisory),
    competenceWeightsCorrectCorrelation: false,
  });
}
