import { describe, expect, it, afterEach } from 'vitest';

import {
  binarizeGradedLabeledSet,
  loadLabeledSet,
  type CalibrationModel,
  type CalibrationSample,
} from '../lib/search/confidence-calibration';
import {
  buildCalibrationSamplesFromDiagnostics,
  buildObserveOnlySearchLeverVariants,
  fitCalibrationFromDiagnostics,
  formatAblationReport,
  runAblation,
  type AblationDiagnosticSnapshot,
  type AblationSearchFn,
} from '../lib/eval/ablation-framework';
import {
  buildGroundTruthLabelViews,
  computeCitabilityConfusionMetrics,
  computeLeverABMetrics,
  computeReorderDemotionMetrics,
  type EvalResult,
  type GroundTruthEntry,
} from '../lib/eval/eval-metrics';
import {
  GROUND_TRUTH_QUERIES,
  GROUND_TRUTH_RELEVANCES,
} from '../lib/eval/ground-truth-data';
import { compareCalibrationShadows } from '../lib/eval/shadow-scoring';

describe('eval calibration and lever A/B utilities', () => {
  const savedAblationFlag = process.env.SPECKIT_ABLATION;

  afterEach(() => {
    if (savedAblationFlag === undefined) {
      delete process.env.SPECKIT_ABLATION;
    } else {
      process.env.SPECKIT_ABLATION = savedAblationFlag;
    }
  });

  it('binarizes graded labels into the calibration loader shape', () => {
    const pairs = binarizeGradedLabeledSet([
      { query: 'alpha', memoryId: 1, relevance: 0 },
      { query: 'alpha', memoryId: 2, relevance: 1 },
      { query: 'alpha', memoryId: 3, relevance: 2 },
      { query: 'alpha', memoryId: 4, relevance: 3 },
    ]);

    expect(pairs.map((pair) => pair.relevant)).toEqual([0, 0, 1, 1]);
    expect(loadLabeledSet(pairs)).toHaveLength(4);
  });

  it('harvests calibration samples from ablation diagnostics and fits when the sample floor is met', () => {
    const labelViews = buildGroundTruthLabelViews({
      queries: [{ id: 1, category: 'factual' }],
      relevances: [
        { queryId: 1, memoryId: 101, relevance: 3 },
        { queryId: 1, memoryId: 102, relevance: 0 },
      ],
    });
    const snapshots: AblationDiagnosticSnapshot[] = [{
      queryId: 1,
      query: 'alpha',
      requestQuality: 'good',
      results: [
        {
          memoryId: 101,
          rank: 1,
          rawValue: 0.9,
          confidenceValue: 0.9,
          confidenceLabel: 'high',
          scoreSnapshot: {} as never,
        },
        {
          memoryId: 102,
          rank: 2,
          rawValue: 0.2,
          confidenceValue: 0.2,
          confidenceLabel: 'low',
          scoreSnapshot: {} as never,
        },
      ],
    }];

    const samples = buildCalibrationSamplesFromDiagnostics(snapshots, labelViews);
    expect(samples).toMatchObject([
      { queryId: 1, query: 'alpha', memoryId: 101, rawValue: 0.9, relevant: 1 },
      { queryId: 1, query: 'alpha', memoryId: 102, rawValue: 0.2, relevant: 0 },
    ]);

    const report = fitCalibrationFromDiagnostics(samples, { minSamples: 2, binCount: 2 });
    expect(report.fitted).toBe(true);
    expect(report.model.fittedFrom).toBe(2);
    expect(report.metrics.sampleCount).toBe(2);
  });

  it('runAblation can emit an observe-only calibration fit report', async () => {
    process.env.SPECKIT_ABLATION = 'true';

    const query = GROUND_TRUTH_QUERIES.find((candidate) => (
      candidate.category !== 'hard_negative'
      && GROUND_TRUTH_RELEVANCES.some((entry) => entry.queryId === candidate.id && entry.relevance >= 2)
    ));
    expect(query).toBeDefined();
    const ids = GROUND_TRUTH_RELEVANCES
      .filter((entry) => entry.queryId === query!.id && entry.relevance > 0)
      .map((entry) => entry.memoryId);
    expect(ids.length).toBeGreaterThan(0);

    const searchFn: AblationSearchFn = (_query, disabled) => {
      const selected = disabled.has('vector') ? ids.slice(0, 1) : ids.slice(0, 2);
      return {
        results: selected.map((memoryId, index) => ({ memoryId, score: 0.9 - index * 0.1, rank: index + 1 })),
        diagnosticRows: selected.map((id, index) => ({
          id,
          rank: index + 1,
          score: 0.9 - index * 0.1,
          similarity: 0.9 - index * 0.1,
        })),
      };
    };

    const report = await runAblation(searchFn, {
      channels: ['vector'],
      groundTruthQueryIds: [query!.id],
      includeDiagnosticSnapshots: true,
      includeCalibrationFit: true,
      minCalibrationSamples: 1,
      calibrationBinCount: 4,
    });

    expect(report?.calibrationFit?.fitted).toBe(true);
    expect(report?.calibrationFit?.sampleCount).toBeGreaterThan(0);
    expect(formatAblationReport(report!)).toContain('### Calibration Fit');
  });

  it('compares identity, proxy seed, and traffic fit on a held-out split without flipping a flag', () => {
    const samples: CalibrationSample[] = [
      { rawValue: 0.1, relevant: 1 },
      { rawValue: 0.2, relevant: 1 },
      { rawValue: 0.3, relevant: 1 },
      { rawValue: 0.4, relevant: 1 },
      { rawValue: 0.2, relevant: 1 },
      { rawValue: 0.3, relevant: 1 },
    ];
    const proxySeedModel: CalibrationModel = {
      method: 'isotonic',
      points: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
      fittedFrom: 2,
    };

    const comparison = compareCalibrationShadows(samples, {
      minSamples: 4,
      holdoutRatio: 0.33,
      proxySeedModel,
      binCount: 2,
    });

    expect(comparison.decision).toBe('promote');
    expect(comparison.identity.metrics.ece).toBeGreaterThan(comparison.trafficFit.metrics.ece);
    expect(comparison.trafficFit.model?.fittedFrom).toBe(4);
  });

  it('keeps calibration promotion waiting when the sample floor is not met', () => {
    const comparison = compareCalibrationShadows([
      { rawValue: 0.2, relevant: 1 },
      { rawValue: 0.8, relevant: 0 },
    ], { minSamples: 10 });

    expect(comparison.decision).toBe('wait');
    expect(comparison.reason).toContain('insufficient samples');
  });

  it('describes observe-only lever variants with S5 measured outside evaluationMode', () => {
    const variants = buildObserveOnlySearchLeverVariants();
    const s5 = variants.filter((variant) => variant.lever === 'cosineTopNReorder');
    expect(s5).toHaveLength(2);
    expect(s5.every((variant) => variant.evaluationMode === false)).toBe(true);
    expect(s5.map((variant) => variant.env.SPECKIT_COSINE_TOPN_REORDER).sort()).toEqual(['false', 'true']);

    const s3 = variants.filter((variant) => variant.lever === 'complexityRouter');
    expect(s3.map((variant) => variant.partition).sort()).toEqual(['escalated', 'non-escalated']);
    expect(variants.some((variant) => variant.lever === 'topDominantVerdict' && variant.partition === 'citability-confusion')).toBe(true);
  });

  it('computes per-lever A/B deltas for ranking metrics', () => {
    const groundTruth: GroundTruthEntry[] = [
      { queryId: 1, memoryId: 1, relevance: 0 },
      { queryId: 1, memoryId: 2, relevance: 3 },
    ];
    const baselineResults: EvalResult[] = [
      { memoryId: 1, score: 0.9, rank: 1 },
      { memoryId: 2, score: 0.8, rank: 2 },
    ];
    const variantResults: EvalResult[] = [
      { memoryId: 2, score: 0.9, rank: 1 },
      { memoryId: 1, score: 0.8, rank: 2 },
    ];

    const metrics = computeLeverABMetrics({ baselineResults, variantResults, groundTruth, recallK: 1 });
    expect(metrics.ndcgAt1.delta).toBeGreaterThan(0);
    expect(metrics.top1Precision.delta).toBeGreaterThan(0);
    expect(metrics.recallAtK.delta).toBeGreaterThan(0);
  });

  it('instruments fused non-vector demotions after reorder', () => {
    const metrics = computeReorderDemotionMetrics([
      { memoryId: 10, beforeRank: 1, afterRank: 4, relevance: 3 },
      { memoryId: 11, beforeRank: 2, afterRank: 5, relevance: 3, similarity: 0.92 },
      { memoryId: 12, beforeRank: 3, afterRank: 2, relevance: 3 },
    ]);

    expect(metrics.relevantWithoutSimilarityCount).toBe(2);
    expect(metrics.demotedRelevantWithoutSimilarityCount).toBe(1);
    expect(metrics.maxRankLoss).toBe(3);
    expect(metrics.sinkers[0].memoryId).toBe(10);
  });

  it('reports the false-good hard-negative cell for top-dominant verdict review', () => {
    const metrics = computeCitabilityConfusionMetrics([
      { predicted: 'good', expectedCitable: false, isHardNegative: true },
      { predicted: 'weak', expectedCitable: false, isHardNegative: true },
      { predicted: 'good', expectedCitable: true },
    ]);

    expect(metrics.falseGoodOnHardNegatives).toBe(1);
    expect(metrics.hardNegativeCount).toBe(2);
    expect(metrics.falsePositive).toBe(1);
  });
});
