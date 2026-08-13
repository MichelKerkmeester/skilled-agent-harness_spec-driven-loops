// ───────────────────────────────────────────────────────────────────
// MODULE: Masked LLM Proxy Judge
// ───────────────────────────────────────────────────────────────────

import { EvaluationDimensionNames } from '../contracts/evidence.js';
import { deepFreeze } from '../fidelity/freeze.js';

import type { EvaluationDimensionName } from '../contracts/evidence.js';
import type { MaskedReviewBundle, MaskedReviewPacket } from './blinding.js';
import type { BlindReviewerRating } from './gate.js';

/** Scores for both opaque presentations in one evaluation dimension. */
export interface ProxyPresentationScores {
  readonly A: number;
  readonly B: number;
}

/** Complete numeric output expected from an injected masked-packet scorer. */
export type ProxyPerDimensionScores = Readonly<
  Record<EvaluationDimensionName, ProxyPresentationScores>
>;

/** Caller-owned scorer; transport and model access remain outside this module. */
export type ProxyJudgeScorer = (
  packet: MaskedReviewPacket,
) => Promise<ProxyPerDimensionScores>;

const DIMENSIONS = Object.values(EvaluationDimensionNames) as readonly EvaluationDimensionName[];
const LABELS = ['A', 'B'] as const;

/** Score one masked packet and unblind only the returned numeric ratings. */
export async function scoreMaskedReviewPacketWithProxy(
  bundle: MaskedReviewBundle,
  reviewerId: string,
  scorer: ProxyJudgeScorer,
): Promise<BlindReviewerRating> {
  validateBundle(bundle);
  if (reviewerId.trim().length === 0) {
    throw new TypeError('Proxy reviewer ID must be non-empty.');
  }
  const scores = await scorer(bundle.packet);
  validateScores(scores);
  const sourceLabels = new Map(
    bundle.orderRecord.order.map((entry) => [entry.source, entry.label]),
  );
  const candidateLabel = sourceLabels.get('candidate');
  const referenceLabel = sourceLabels.get('reference');
  if (candidateLabel === undefined || referenceLabel === undefined) {
    throw new TypeError('Blind order must identify candidate and reference presentations.');
  }
  return deepFreeze({
    comparisonId: bundle.orderRecord.comparisonId,
    reviewerId,
    evidenceClass: 'llm-proxy',
    candidateScores: scoresForLabel(scores, candidateLabel),
    referenceScores: scoresForLabel(scores, referenceLabel),
  });
}

/** Run a deterministic set of distinct proxy reviewers over masked bundles. */
export async function runProxyReviewers(
  bundles: readonly MaskedReviewBundle[],
  reviewerCount: number,
  scorer: ProxyJudgeScorer,
  reviewerIdPrefix = 'llm-proxy',
): Promise<readonly BlindReviewerRating[]> {
  if (!Number.isSafeInteger(reviewerCount) || reviewerCount < 1) {
    throw new RangeError('Proxy reviewer count must be a positive safe integer.');
  }
  if (reviewerIdPrefix.trim().length === 0) {
    throw new TypeError('Proxy reviewer ID prefix must be non-empty.');
  }
  const packetIds = bundles.map((bundle) => bundle.packet.packetId);
  if (new Set(packetIds).size !== packetIds.length) {
    throw new TypeError('Proxy review bundles must identify distinct masked packets.');
  }
  const reviewerIds = Array.from(
    { length: reviewerCount },
    (_, index) => `${reviewerIdPrefix}-${index + 1}`,
  );
  const ratings = await Promise.all(bundles.flatMap((bundle) =>
    reviewerIds.map((reviewerId) =>
      scoreMaskedReviewPacketWithProxy(bundle, reviewerId, scorer))));
  return deepFreeze(ratings);
}

function scoresForLabel(
  scores: ProxyPerDimensionScores,
  label: 'A' | 'B',
): Readonly<Record<EvaluationDimensionName, number>> {
  return Object.fromEntries(
    DIMENSIONS.map((dimension) => [dimension, scores[dimension][label]]),
  ) as Readonly<Record<EvaluationDimensionName, number>>;
}

function validateBundle(bundle: MaskedReviewBundle): void {
  if (bundle.packet.packetId !== bundle.orderRecord.packetId) {
    throw new TypeError('Masked packet and blind order must share a packet ID.');
  }
  const presentations = new Map(
    bundle.packet.presentations.map((entry) => [entry.label, entry.artifactToken]),
  );
  if (
    bundle.orderRecord.order.length !== LABELS.length
    || presentations.size !== LABELS.length
    || bundle.orderRecord.order.some((entry) =>
      presentations.get(entry.label) !== entry.artifactToken)
  ) {
    throw new TypeError('Masked packet and blind order presentations must agree.');
  }
}

function validateScores(scores: ProxyPerDimensionScores): void {
  const dimensions = Object.keys(scores);
  if (
    dimensions.length !== DIMENSIONS.length
    || dimensions.some((dimension) => !(DIMENSIONS as readonly string[]).includes(dimension))
    || DIMENSIONS.some((dimension) => {
      const presentationScores = scores[dimension];
      const labels = Object.keys(presentationScores);
      return labels.length !== LABELS.length
        || labels.some((label) => !(LABELS as readonly string[]).includes(label))
        || LABELS.some((label) => !Number.isFinite(presentationScores[label]));
    })
  ) {
    throw new TypeError('Proxy scores must cover every dimension and masked presentation.');
  }
}
