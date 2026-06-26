// ───────────────────────────────────────────────────────────────
// MODULE: Orchestrator
// ───────────────────────────────────────────────────────────────
// 4-stage pipeline execution with per-stage error handling and timeouts.
//
// Each stage is wrapped in try/catch with withTimeout().
// Stage 1 is mandatory (throws on failure — no candidates = no results).
// Stages 2-4 fall back to previous stage output with degraded metadata.
// Timing is recorded for latency observability.
//
// I/O CONTRACT:
// Input:  PipelineConfig (query, embedding, limits, flags, intent, session)
// Output: PipelineResult { results: Stage4ReadonlyRow[], metadata, annotations, trace }
// Key invariants:
//     - results are scored by Stage 2, reranked by Stage 3, filtered by Stage 4
//     - Score fields are frozen after Stage 3; Stage 4 output scores == Stage 3 output scores
//     - Stage metadata for all four stages is included for observability
//     - When a stage degrades, metadata.degraded = true and timing tracks each stage
// Side effects:
//     - Delegates to each stage; see individual stage modules for their side effects

import { MemoryError, withTimeout } from '../../errors/core.js';
import { requireDb } from '../../../utils/db-helpers.js';
import {
  isDeterministicMultihopEnabled,
  isLaneChampionBackfillEnabled,
} from '../search-flags.js';
import { applyDeterministicMultihop } from '../deterministic-multihop.js';
import { applyLaneChampionBackfill } from '../lane-champion-backfill.js';
import { executeStage1 } from './stage1-candidate-gen.js';
import { executeStage2 } from './stage2-fusion.js';
import { executeStage3 } from './stage3-rerank.js';
import { executeStage4 } from './stage4-filter.js';
import { readLaneLists } from './types.js';

import type {
  LaneCandidateList,
  PipelineConfig,
  PipelineResult,
  PipelineRow,
  SignalStatus,
  Stage1Output,
  Stage2Output,
  Stage3Output,
  Stage4Output,
  Stage4ReadonlyRow,
} from './types.js';

// Feature catalog: 4-stage pipeline architecture
// Feature catalog: 4-stage pipeline refactor


/** Per-stage timeout in milliseconds. */
const STAGE_TIMEOUT_MS = 10_000;
const TRIGGER_PROMOTION_FLOOR = 10;

interface TriggerPromotionResult {
  results: Stage4ReadonlyRow[];
  metadata?: NonNullable<PipelineResult['metadata']['triggerPromotion']>;
}

function findTriggerLaneRows(laneLists: LaneCandidateList[] | undefined): PipelineRow[] {
  if (!laneLists || laneLists.length === 0) return [];
  return laneLists
    .filter((list) => (list.lane ?? list.source) === 'trigger')
    .flatMap((list) => list.results)
    .filter((row): row is PipelineRow => typeof row.id === 'number' && Number.isFinite(row.id));
}

function promoteTriggerLaneRows(
  results: Stage4ReadonlyRow[],
  laneLists: LaneCandidateList[] | undefined,
  limit: number,
): TriggerPromotionResult {
  if (!Number.isFinite(limit) || limit <= 0 || results.length >= Math.min(limit, TRIGGER_PROMOTION_FLOOR)) {
    return { results };
  }

  const existingIds = new Set(results.map((row) => row.id));
  const triggerRows = findTriggerLaneRows(laneLists);
  const missingTriggerRows: Stage4ReadonlyRow[] = [];
  const seenTriggerIds = new Set<number>();
  for (const row of triggerRows) {
    if (existingIds.has(row.id) || seenTriggerIds.has(row.id)) continue;
    seenTriggerIds.add(row.id);
    missingTriggerRows.push(row as unknown as Stage4ReadonlyRow);
  }

  if (missingTriggerRows.length === 0) {
    return { results };
  }

  const targetCount = Math.min(limit, results.length + missingTriggerRows.length);
  const appended = missingTriggerRows.slice(0, Math.max(0, targetCount - results.length));
  if (appended.length === 0) {
    return { results };
  }

  return {
    results: [...results, ...appended],
    metadata: {
      applied: true,
      appendedCount: appended.length,
      triggerCandidateCount: triggerRows.length,
      targetCount,
    },
  };
}

/**
 * Execute the 4-stage retrieval pipeline with per-stage error handling.
 *
 * Stage 1: Candidate Generation — MANDATORY (throws on failure)
 * Stage 2: Fusion + Signal Integration — falls back to unsorted candidates
 * Stage 3: Rerank + Aggregate — falls back to unranked scored results
 * Stage 4: Filter + Annotate — falls back to unfiltered results
 *
 * @param config Pipeline configuration derived from search args
 * @returns Pipeline result with stage metadata and timing
 */
export async function executePipeline(config: PipelineConfig): Promise<PipelineResult> {
  const timing: Record<string, number> = {};
  const pipelineStart = Date.now();
  let degraded = false;

  // -- Stage 1: Candidate Generation (MANDATORY — no fallback possible) --
  let stage1Result: Stage1Output;
  try {
    const t0 = Date.now();
    stage1Result = await withTimeout(
      executeStage1({ config }),
      STAGE_TIMEOUT_MS,
      'Stage 1: Candidate Generation',
    );
    timing.stage1 = Date.now() - t0;
  } catch (err: unknown) {
    throw new MemoryError(
      'PIPELINE_STAGE1_FAILED',
      `Candidate generation failed: ${err instanceof Error ? err.message : String(err)}`,
      { cause: err instanceof Error ? err.message : String(err) },
    );
  }

  // Capture the per-lane candidate lists Stage 1 may have attached, before Stages
  // 2 through 4 reallocate the array and drop the non-enumerable shadow. The
  // tail-append stage after Stage 4 reads them to backfill a lane champion. Undefined
  // on the flags-off path, so the append stage finds nothing to add.
  const laneListsForBackfill: LaneCandidateList[] | undefined = readLaneLists(stage1Result.candidates);

  // -- Stage 2: Fusion + Signal Integration (falls back to unsorted candidates) --
  let stage2Result: Stage2Output;
  try {
    const t0 = Date.now();
    stage2Result = await withTimeout(
      executeStage2({
        candidates: stage1Result.candidates,
        config,
        stage1Metadata: stage1Result.metadata,
      }),
      STAGE_TIMEOUT_MS,
      'Stage 2: Fusion',
    );
    timing.stage2 = Date.now() - t0;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[pipeline] Stage 2 failed, returning unscored candidates: ${msg}`);
    degraded = true;
    stage2Result = {
      scored: stage1Result.candidates,
      metadata: {
        sessionBoostApplied: 'failed' as SignalStatus,
        causalBoostApplied: 'failed' as SignalStatus,
        intentWeightsApplied: 'failed' as SignalStatus,
        artifactRoutingApplied: 'failed' as SignalStatus,
        feedbackSignalsApplied: 'failed' as SignalStatus,
        qualityFiltered: 0,
        durationMs: 0,
      },
    };
    timing.stage2 = 0;
  }

  // -- Stage 3: Rerank + Aggregate (falls back to unranked scored results) --
  let stage3Result: Stage3Output;
  try {
    const t0 = Date.now();
    stage3Result = await withTimeout(
      executeStage3({
        scored: stage2Result.scored,
        config,
      }),
      STAGE_TIMEOUT_MS,
      'Stage 3: Rerank',
    );
    timing.stage3 = Date.now() - t0;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[pipeline] Stage 3 failed, returning unranked results: ${msg}`);
    degraded = true;
    stage3Result = {
      reranked: stage2Result.scored,
      metadata: {
        rerankApplied: false,
        chunkReassemblyStats: {
          collapsedChunkHits: 0,
          chunkParents: 0,
          reassembled: 0,
          fallback: 0,
        },
        durationMs: 0,
      },
    };
    timing.stage3 = 0;
  }

  // -- Stage 4: Filter + Annotate (falls back to unfiltered results) --
  let stage4Result: Stage4Output;
  try {
    const t0 = Date.now();
    stage4Result = await withTimeout(
      executeStage4({
        results: stage3Result.reranked as Stage4ReadonlyRow[],
        config,
        stage1Metadata: { constitutionalInjected: stage1Result.metadata.constitutionalInjected },
      }),
      STAGE_TIMEOUT_MS,
      'Stage 4: Filter',
    );
    timing.stage4 = Date.now() - t0;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[pipeline] Stage 4 failed, returning unfiltered results: ${msg}`);
    degraded = true;
    stage4Result = {
      final: stage3Result.reranked as Stage4ReadonlyRow[],
      metadata: {
        stateFiltered: 0,
        constitutionalInjected: stage1Result.metadata.constitutionalInjected,
        evidenceGapDetected: false,
        durationMs: 0,
      },
      annotations: {
        stateStats: {},
        featureFlags: {},
      },
    };
    timing.stage4 = 0;
  }

  // -- Tail-Append Stage: deterministic multi-hop and lane-champion backfill --
  // Extend the capped baseline with additive tail recall the live route otherwise
  // never reaches. The deterministic multi-hop append follows the explicit folder
  // slugs the top recalled docs wrote in their own content and appends those specs.
  // The lane-champion backfill appends each base lane's top candidate that missed
  // the fused window. Both are tail-only and deduped against the baseline, so they
  // can only fill empty tail slots past the requested limit and never evict a
  // baseline hit. They run AFTER the Stage-4 final-limit cap, so the appended rows
  // are exempt from that cap and actually reach the reader. When both flags are off
  // this whole stage is skipped and the Stage-4 output is returned byte-for-byte.
  const triggerPromotion = promoteTriggerLaneRows(
    stage4Result.final,
    laneListsForBackfill,
    config.limit,
  );
  let finalResults: Stage4ReadonlyRow[] = triggerPromotion.results;
  let tailAppendsMeta: PipelineResult['metadata']['tailAppends'];
  const multihopOn = isDeterministicMultihopEnabled();
  const laneChampionOn = isLaneChampionBackfillEnabled();
  if (multihopOn || laneChampionOn) {
    try {
      const t0 = Date.now();
      // The append modules read and emit a mutable {id, score, ...} view. The
      // baseline rows pass through untouched (the appends only add new tail rows and
      // never rescore an existing row), so viewing the readonly Stage-4 rows through
      // this mutable shape is sound, and the result is cast back to the readonly type.
      let working = (finalResults as readonly Stage4ReadonlyRow[]).slice() as unknown as Array<
        { id: number | string; score: number; source?: string; sources?: string[]; [key: string]: unknown }
      >;
      let multihopApplied = false;
      let multihopAppendedCount = 0;
      let laneChampionApplied = false;
      let laneChampionAppendedCount = 0;

      if (multihopOn) {
        let multihopDb: ReturnType<typeof requireDb> | null = null;
        try {
          multihopDb = requireDb();
        } catch {
          multihopDb = null;
        }
        const multihopResult = applyDeterministicMultihop(
          working,
          multihopOn,
          multihopDb,
          { specFolder: config.specFolder },
        );
        working = multihopResult.results;
        multihopApplied = multihopResult.multihop.applied;
        multihopAppendedCount = multihopResult.multihop.appendedCount;
      }

      if (laneChampionOn) {
        const lanes = (laneListsForBackfill ?? []).map((list) => ({
          lane: list.lane ?? list.source,
          results: list.results,
        }));
        const backfillResult = applyLaneChampionBackfill(working, lanes, laneChampionOn);
        working = backfillResult.results;
        laneChampionApplied = backfillResult.backfill.applied;
        laneChampionAppendedCount = backfillResult.backfill.appendedCount;
      }

      finalResults = working as unknown as Stage4ReadonlyRow[];
      tailAppendsMeta = {
        multihopApplied,
        multihopAppendedCount,
        laneChampionApplied,
        laneChampionAppendedCount,
      };
      timing.tailAppends = Date.now() - t0;
    } catch (err: unknown) {
      // Non-critical — a tail-append failure must not block the pipeline. Leave the
      // Stage-4 output untouched so the baseline still returns.
      console.warn(
        '[pipeline] tail-append stage failed:',
        err instanceof Error ? err.message : String(err),
      );
      finalResults = triggerPromotion.results;
    }
  }

  timing.total = Date.now() - pipelineStart;

  return {
    results: finalResults,
    metadata: {
      stage1: stage1Result.metadata,
      stage2: stage2Result.metadata,
      stage3: stage3Result.metadata,
      stage4: stage4Result.metadata,
      timing,
      degraded: degraded || undefined,
      tailAppends: tailAppendsMeta,
      triggerPromotion: triggerPromotion.metadata,
    },
    annotations: stage4Result.annotations,
    trace: config.trace,
  };
}
