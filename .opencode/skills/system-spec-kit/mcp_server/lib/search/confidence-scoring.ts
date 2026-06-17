// ───────────────────────────────────────────────────────────────
// MODULE: Confidence Scoring
// ───────────────────────────────────────────────────────────────
// Per-result calibrated confidence scoring
//
// PURPOSE: Combine margin, multi-channel agreement,
// and anchor density into a single calibrated confidence score per
// result. V1 uses heuristic scoring only — no LLM calls in the hot path.
//
// FEATURE FLAG: SPECKIT_RESULT_CONFIDENCE_V1 (default ON, graduated)
//
// OUTPUT SHAPE (per result):
// {
//   "confidence": {
//     "label": "high" | "medium" | "low",
//     "value": 0.78,
//     "drivers": ["large_margin", "multi_channel_agreement"]
//   },
//   "requestQuality": {
//     "label": "good" | "weak" | "gap"
//   }
// }
//
// IMPORTANT: This module only models ranking confidence for retrieval ordering.
// It is not freshness authority and it is not a substitute for StructuralTrust.
import { resolveEffectiveScore, resolveAbsoluteRelevance, type PipelineRow } from './pipeline/types.js';
import { isAbsoluteRelevanceCalibrationEnabled } from './search-flags.js';

declare const rankingConfidenceBrand: unique symbol;

// -- Constants --

const HIGH_THRESHOLD = 0.7;
const LOW_THRESHOLD = 0.4;

// Weights for each active confidence factor. The former reranker weight (0.20)
// was removed with the LLM reranker; its term was already inert (always 0), so
// rawValue stays capped at 0.80 exactly as before — behavior-neutral. The 0.20
// is intentionally NOT redistributed (that would change confidence scores).
const WEIGHT_MARGIN = 0.35;
const WEIGHT_CHANNEL_AGREEMENT = 0.30;
const WEIGHT_ANCHOR_DENSITY = 0.15;

// Margin thresholds (gap between top score and next score, 0–1 scale)
const LARGE_MARGIN_THRESHOLD = 0.15;
const SMALL_MARGIN_THRESHOLD = 0.05;

// Channel count thresholds
const STRONG_CHANNEL_AGREEMENT_MIN = 2;

// Request-quality aggregation: a top hit at or above this absolute relevance
// stands on its own, so a weak tail cannot drag the verdict below "good".
const TOP_DOMINANT_THRESHOLD = 0.8;

// Cap the quality-ratio denominator at the head of the ranking. Pulling deeper
// for recall appends weaker tail results; counting them would mechanically
// depress the ratio and penalize a query for retrieving more candidates.
const QUALITY_RATIO_HEAD = 5;

// -- Types --

/** Confidence label for a single result. */
export type ConfidenceLabel = 'high' | 'medium' | 'low';

/**
 * Branded ranking score for retrieval ordering only.
 * Consumers must not reuse this as parser provenance, evidence status,
 * freshness authority, or any other StructuralTrust axis.
 */
export type RankingConfidenceValue = number & {
  readonly [rankingConfidenceBrand]: 'RankingConfidenceValue';
};

/** Quality label at the request level (across all results). */
export type RequestQualityLabel = 'good' | 'weak' | 'gap';

/** Which factors drove the confidence score upward. */
export type ConfidenceDriver =
  | 'large_margin'
  | 'multi_channel_agreement'
  | 'anchor_density';

/** Per-result confidence payload. */
export interface RankingConfidenceContract {
  label: ConfidenceLabel;
  value: RankingConfidenceValue;
  drivers: ConfidenceDriver[];
  structuralTrust?: never;
  parserProvenance?: never;
  evidenceStatus?: never;
  freshnessAuthority?: never;
}

export interface ResultConfidence {
  confidence: RankingConfidenceContract;
}

/** Request-level quality assessment (one per search call). */
export interface RequestQualityAssessment {
  requestQuality: {
    label: RequestQualityLabel;
  };
}

/**
 * Minimal result shape needed for confidence computation.
 * Uses `Record<string, unknown>` to stay compatible with both
 * `RawSearchResult` and `PipelineRow` without importing either.
 */
export interface ScoredResult extends Record<string, unknown> {
  id: number;
  /** Composite score (0–1). */
  score?: number;
  /** RRF fusion score (0–1). */
  rrfScore?: number;
  /** Intent-adjusted score (0–1). */
  intentAdjustedScore?: number;
  /** Raw cosine similarity (0–100 scale from sqlite-vec). */
  similarity?: number;
  /** Score origin metadata for distinguishing real reranks from fallbacks. */
  scoringMethod?: string;
  /** Anchor metadata array populated by Stage 2. */
  anchorMetadata?: Array<Record<string, unknown>>;
  /** Source channels that contributed this result. */
  sources?: string[];
  /** Single source channel string (legacy). */
  source?: string;
  /** Trace metadata containing channel attribution. */
  traceMetadata?: Record<string, unknown>;
}

// -- Internal helpers --

function resolveScore(result: ScoredResult): number {
  return resolveEffectiveScore(result as PipelineRow);
}

/**
 * Absolute relevance used for confidence calibration and request-quality — keeps
 * ordering on the RRF/effective score while reading an absolute 0–1 signal for
 * "how good is this", so the 0.7/0.4 thresholds mean what they say. Reverts to the
 * effective score when SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION is disabled.
 */
function resolveCalibrationScore(result: ScoredResult): number {
  return isAbsoluteRelevanceCalibrationEnabled()
    ? resolveAbsoluteRelevance(result as PipelineRow)
    : resolveEffectiveScore(result as PipelineRow);
}

/**
 * Count the number of unique channels that retrieved this result.
 * Inspects `sources`, `source`, and traceMetadata.attribution.
 */
function countChannels(result: ScoredResult): number {
  const channels = new Set<string>();

  if (Array.isArray(result.sources)) {
    for (const s of result.sources) {
      if (typeof s === 'string' && s.trim().length > 0) channels.add(s.trim());
    }
  }

  if (typeof result.source === 'string' && result.source.trim().length > 0) {
    channels.add(result.source.trim());
  }

  // Check traceMetadata.attribution for richer channel data
  const numericId = typeof result.id === 'number' ? result.id : null;
  const attribution = result.traceMetadata?.attribution;
  if (attribution && typeof attribution === 'object' && numericId !== null) {
    for (const [channel, memoryIds] of Object.entries(attribution as Record<string, unknown>)) {
      if (!Array.isArray(memoryIds)) continue;
      const matched = memoryIds.some((mid) => {
        const n = typeof mid === 'number' ? mid : typeof mid === 'string' ? Number(mid) : NaN;
        return Number.isFinite(n) && n === numericId;
      });
      if (matched && typeof channel === 'string' && channel.trim().length > 0) {
        channels.add(channel.trim());
      }
    }
  }

  return channels.size;
}

/**
 * Count anchors present in this result's anchorMetadata array.
 * A result with multiple named anchors is considered "dense" and
 * more likely to be a high-quality, well-structured memory.
 */
function countAnchors(result: ScoredResult): number {
  if (!Array.isArray(result.anchorMetadata)) return 0;
  return result.anchorMetadata.length;
}

/**
 * Compute the score margin between result[i] and result[i+1].
 * Tail results have no successor, so they receive no synthetic margin boost.
 */
function computeMargin(score: number, nextScore: number | null): number {
  if (nextScore === null) return 0;
  const gap = score - nextScore;
  return Math.max(0, gap);
}

/**
 * Map raw confidence value to a coarse label.
 */
function toConfidenceLabel(value: number): ConfidenceLabel {
  if (value >= HIGH_THRESHOLD) return 'high';
  if (value >= LOW_THRESHOLD) return 'medium';
  return 'low';
}

export function asRankingConfidenceValue(value: number): RankingConfidenceValue {
  const clamped = Math.max(0, Math.min(1, value));
  return (Math.round(clamped * 1000) / 1000) as RankingConfidenceValue;
}

// -- Public API --

/**
 * Compute per-result confidence for a ranked list of results.
 *
 * Each result receives a confidence object derived from:
 *   - Score margin to the next result (35% weight)
 *   - Number of channels that contributed this result (30%)
 *   - Anchor density in anchorMetadata (15%)
 *
 * @param results - Ranked results (highest score first). Ordering is assumed.
 * @returns Array of ResultConfidence objects, parallel to `results`.
 */
export function computeResultConfidence(results: ScoredResult[]): ResultConfidence[] {
  if (!Array.isArray(results) || results.length === 0) return [];

  const scores = results.map(resolveScore);

  return results.map((result, i): ResultConfidence => {
    const score = scores[i] ?? 0;
    const nextScore = i + 1 < scores.length ? (scores[i + 1] ?? null) : null;

    const margin = computeMargin(score, nextScore);
    const channelCount = countChannels(result);
    const anchorCount = countAnchors(result);

    // Factor scores (each 0–1)
    const marginFactor = margin >= LARGE_MARGIN_THRESHOLD
      ? 1.0
      : margin >= SMALL_MARGIN_THRESHOLD
        ? margin / LARGE_MARGIN_THRESHOLD
        : 0;

    const channelFactor = channelCount >= STRONG_CHANNEL_AGREEMENT_MIN
      ? 1.0
      : channelCount === 1
        ? 0.5
        : 0;

    // Anchor density: 1 anchor → 0.3, 2 → 0.6, 3+ → 1.0
    const anchorFactor = Math.min(1, anchorCount * 0.33);

    const rawValue =
      WEIGHT_MARGIN * marginFactor +
      WEIGHT_CHANNEL_AGREEMENT * channelFactor +
      WEIGHT_ANCHOR_DENSITY * anchorFactor;

    // Base score is a strong prior: if the score itself is very high, confidence
    // should reflect that even when heuristic signals are weak. Use the absolute
    // relevance (cosine) here, not the RRF ordering score — an RRF magnitude of
    // ~0.03 would make this prior contribute ~0.01 and defeat its purpose.
    const scorePrior = resolveCalibrationScore(result) * 0.4;
    const heuristicValue = rawValue * 0.6;
    const value = Math.max(0, Math.min(1, heuristicValue + scorePrior));

    const drivers: ConfidenceDriver[] = [];
    if (margin >= LARGE_MARGIN_THRESHOLD) drivers.push('large_margin');
    if (channelCount >= STRONG_CHANNEL_AGREEMENT_MIN) drivers.push('multi_channel_agreement');
    if (anchorCount >= 2) drivers.push('anchor_density');

      return {
        confidence: {
          label: toConfidenceLabel(value),
          value: asRankingConfidenceValue(value),
          drivers,
        },
      };
  });
}

/**
 * Compute request-level quality assessment based on the overall result set.
 *
 * - "good":  a dominant top hit, or a healthy top score with confident head / clear margin
 * - "weak":  results exist but signals are mixed or low
 * - "gap":   no results, or all results have low confidence
 *
 * The "good" rule is top-dominant and margin-aware: a single strong, well-separated
 * top hit is citable even when the tail is weak. Without this, a strong top result
 * is dragged to "weak" by a weaker tail, and expanding recall (more tail candidates)
 * mechanically lowers the quality ratio — penalizing the very recall that found the hit.
 *
 * @param results   - The scored results for the query.
 * @param confidences - Parallel confidence array from `computeResultConfidence`.
 */
export function assessRequestQuality(
  results: ScoredResult[],
  confidences: ResultConfidence[],
): RequestQualityAssessment {
  if (!Array.isArray(results) || results.length === 0) {
    return { requestQuality: { label: 'gap' } };
  }

  // Absolute relevance, not the RRF ordering score: HIGH_THRESHOLD/LOW_THRESHOLD
  // are calibrated for a 0–1 cosine scale, so an RRF-magnitude topScore (~0.03)
  // would put "good" out of reach and collapse every query to weak/gap.
  const topScore = resolveCalibrationScore(results[0]);

  // Quality ratio over the head of the ranking only, so recall expansion does
  // not depress it (see QUALITY_RATIO_HEAD).
  const head = Math.min(confidences.length, QUALITY_RATIO_HEAD);
  const highOrMediumCount = confidences
    .slice(0, head)
    .filter((c) => c.confidence.label === 'high' || c.confidence.label === 'medium')
    .length;
  const qualityRatio = head > 0 ? highOrMediumCount / head : 0;

  // Margin between #1 and #2 on the same absolute scale as topScore. A clear gap
  // to the runner-up marks a dominant top hit even when the tail is weak.
  const topMargin = results.length > 1
    ? computeMargin(topScore, resolveCalibrationScore(results[1]))
    : 0;

  // A sufficiently strong top hit is citable on its own, regardless of the tail.
  if (topScore >= TOP_DOMINANT_THRESHOLD) {
    return { requestQuality: { label: 'good' } };
  }
  // Otherwise a healthy top hit reads "good" when the head is mostly confident
  // OR the top hit clearly dominates the runner-up.
  if (topScore >= HIGH_THRESHOLD && (qualityRatio >= 0.6 || topMargin >= LARGE_MARGIN_THRESHOLD)) {
    return { requestQuality: { label: 'good' } };
  }
  // weak/gap thresholds unchanged — preserves the do-not-cite safety net for
  // genuinely low-signal queries.
  if (topScore >= LOW_THRESHOLD || qualityRatio >= 0.3) {
    return { requestQuality: { label: 'weak' } };
  }
  return { requestQuality: { label: 'gap' } };
}

/**
 * Check whether the per-result confidence feature flag is enabled.
 * Default: ON (graduated). Set SPECKIT_RESULT_CONFIDENCE_V1=false to disable.
 */
export { isResultConfidenceEnabled } from './search-flags.js';
