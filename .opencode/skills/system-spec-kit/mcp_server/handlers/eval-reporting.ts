// ────────────────────────────────────────────────────────────────
// MODULE: Eval Reporting
// ────────────────────────────────────────────────────────────────

import path from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

import { checkDatabaseUpdated } from '../core/index.js';
import { withDatabaseWriteLock } from '../core/db-state.js';
import { ensureMemoryRuntimeInitialized } from '../lib/runtime/memory-runtime-guard.js';
import * as vectorIndex from '../lib/search/vector-index.js';
import {
  init as initHybridSearch,
  bm25Search,
  ftsSearch,
} from '../lib/search/hybrid-search.js';
import { generateQueryEmbedding } from '../lib/providers/embeddings.js';
import { MemoryError, ErrorCodes } from '../lib/errors.js';
import { createMCPSuccessResponse } from '../lib/response/envelope.js';
import {
  ALL_CHANNELS,
  isAblationEnabled,
  runAblation,
  assertGroundTruthAlignment,
  storeAblationResults,
  formatAblationReport,
  type AblationChannel,
  type AblationSearchFn,
} from '../lib/eval/ablation-framework.js';
import { executePipeline } from '../lib/search/pipeline/index.js';
import type { PipelineConfig } from '../lib/search/pipeline/index.js';
import {
  generateDashboardReport,
  formatReportJSON,
  formatReportText,
} from '../lib/eval/reporting-dashboard.js';
import {
  analyzeKValueSensitivityBatch,
  formatKValueReport,
} from '../lib/eval/k-value-analysis.js';
import {
  createUnifiedGraphSearchFn,
  computeDegreeScores,
  DEGREE_CHANNEL_WEIGHT,
} from '../lib/search/graph-search-fn.js';
import {
  isCausalBoostEnabled,
  isDegreeBoostEnabled,
  isSessionBoostEnabled,
} from '../lib/search/search-flags.js';
import type { RankedList } from '@spec-kit/shared/algorithms/rrf-fusion';

import type { MCPResponse } from './types.js';

// Feature catalog: Reporting dashboard (eval_reporting_dashboard)
// Feature catalog: Ablation studies (eval_run_ablation)


interface RunAblationArgs {
  mode?: 'ablation' | 'k_sensitivity';
  dataset?: string;
  dryRun?: boolean;
  channels?: AblationChannel[];
  groundTruthQueryIds?: number[];
  recallK?: number;
  queries?: string[];
  storeResults?: boolean;
  includeFormattedReport?: boolean;
}

function normalizeDatasetSelector(args: RunAblationArgs): string | undefined {
  const dataset = args.dataset?.trim();
  if (dataset) return dataset;
  if (Array.isArray(args.groundTruthQueryIds) && args.groundTruthQueryIds.length > 0) {
    return `groundTruthQueryIds=[${args.groundTruthQueryIds.join(',')}]`;
  }
  return undefined;
}

function createEmptyDatasetAblationResponse(selector: string, dryRun: boolean): MCPResponse {
  const warning = {
    code: 'EMPTY_DATASET',
    selector,
    message: `Ablation dataset selector "${selector}" is empty or unavailable.`,
  };

  return createMCPSuccessResponse({
    tool: 'eval_run_ablation',
    summary: `Ablation dataset empty or unavailable (selector=${selector})`,
    data: {
      status: 'empty_dataset',
      datasetSelector: selector,
      dryRun,
      stored: false,
      warnings: [warning],
      recovery: {
        actions: [
          'Use groundTruthQueryIds to select static ground-truth queries.',
          'Omit dataset to run the default ablation corpus.',
        ],
      },
    },
    hints: [
      dryRun
        ? 'Dry-run requested; no ablation metrics were persisted.'
        : 'No ablation metrics were persisted because the dataset selector was empty or unavailable.',
    ],
  });
}

interface KSensitivityArgs {
  queries?: string[];
  limit?: number;
}

const modulePath = fileURLToPath(import.meta.url);
const moduleDir = path.dirname(modulePath);

function resolvePackageRoot(): string {
  let current = moduleDir;
  for (let depth = 0; depth < 5; depth++) {
    if (existsSync(path.join(current, 'package.json'))) return current;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return path.resolve(moduleDir, '..');
}

function toPipelineChannelConfig(disabledChannels: Set<AblationChannel>): Pick<PipelineConfig, 'useVector' | 'useBm25' | 'useFts' | 'useGraph' | 'useTrigger'> {
  return {
    useVector: !disabledChannels.has('vector'),
    useBm25: !disabledChannels.has('bm25'),
    useFts: !disabledChannels.has('fts5'),
    useGraph: !disabledChannels.has('graph'),
    useTrigger: !disabledChannels.has('trigger'),
  };
}

function buildEvalPipelineConfig(
  query: string,
  embedding: Float32Array | number[] | null,
  recallK: number,
  disabledChannels: Set<AblationChannel>,
): PipelineConfig {
  return {
    query,
    ...(embedding ? { queryEmbedding: embedding } : {}),
    searchType: 'hybrid',
    limit: recallK,
    includeArchived: false,
    includeConstitutional: false,
    includeContent: true,
    minState: '',
    applyStateLimits: false,
    useDecay: true,
    rerank: true,
    applyLengthPenalty: true,
    enableDedup: true,
    enableSessionBoost: isSessionBoostEnabled(),
    enableCausalBoost: isCausalBoostEnabled(),
    trackAccess: false,
    detectedIntent: null,
    intentConfidence: 0,
    intentWeights: null,
    retrievalLevel: 'auto',
    evaluationMode: true,
    forceAllChannels: true,
    ...toPipelineChannelConfig(disabledChannels),
  };
}

interface ReportingDashboardArgs {
  sprintFilter?: string[];
  channelFilter?: string[];
  metricFilter?: string[];
  limit?: number;
  format?: 'text' | 'json';
}

function normalizeChannels(input?: string[]): AblationChannel[] {
  if (!Array.isArray(input) || input.length === 0) return ALL_CHANNELS;
  const valid = input.filter((value): value is AblationChannel =>
    (ALL_CHANNELS as string[]).includes(value)
  );
  return valid.length > 0 ? valid : ALL_CHANNELS;
}

async function generateQueryEmbeddingOrNull(query: string, context: string): Promise<Float32Array | null> {
  try {
    return await generateQueryEmbedding(query);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[eval-reporting] ${context} embedding failed: ${message}`);
    return null;
  }
}

function initializeEvalHybridSearch(database: ReturnType<typeof vectorIndex.getDb>) {
  const graphSearchFn = createUnifiedGraphSearchFn(database);
  initHybridSearch(database, vectorIndex.vectorSearch, graphSearchFn);
  return graphSearchFn;
}

function resolveEvalDbPath(): string | null {
  const configuredPath = process.env.SPECKIT_EVAL_DB_PATH?.trim();
  if (!configuredPath) {
    return null;
  }

  return path.isAbsolute(configuredPath)
    ? configuredPath
    : path.resolve(resolvePackageRoot(), configuredPath);
}

async function withAblationDb<T>(
  run: (database: NonNullable<ReturnType<typeof vectorIndex.getDb>>, dbPath: string) => Promise<T>,
): Promise<T> {
  const overrideDbPath = resolveEvalDbPath();
  const activeDb = vectorIndex.getDb();

  if (!overrideDbPath) {
    if (!activeDb) {
      throw new MemoryError(
        ErrorCodes.DATABASE_ERROR,
        'Database not initialized. Server may still be starting up.',
        {}
      );
    }
    return run(activeDb, vectorIndex.getDbPath());
  }

  const currentDbPath = path.resolve(vectorIndex.getDbPath());
  if (currentDbPath === overrideDbPath) {
    if (!activeDb) {
      throw new MemoryError(
        ErrorCodes.DATABASE_ERROR,
        'Database not initialized. Server may still be starting up.',
        {}
      );
    }
    return run(activeDb, currentDbPath);
  }

  return withDatabaseWriteLock(async () => {
    vectorIndex.closeDb();

    try {
      const overrideDb = vectorIndex.initializeDb(overrideDbPath);
      return await run(overrideDb, vectorIndex.getDbPath());
    } finally {
      vectorIndex.closeDb();
      vectorIndex.initializeDb();
    }
  });
}

function buildRawFusionLists(
  database: NonNullable<ReturnType<typeof vectorIndex.getDb>>,
  graphSearchFn: ReturnType<typeof createUnifiedGraphSearchFn>,
  query: string,
  embedding: Float32Array | number[] | null,
  limit: number,
): RankedList[] {
  const lists: RankedList[] = [];

  if (embedding) {
    const vectorResults = vectorIndex.vectorSearch(embedding, {
      limit,
      minSimilarity: 0,
      includeConstitutional: false,
      includeArchived: false,
    });
    if (vectorResults.length > 0) {
      lists.push({
        source: 'vector',
        results: vectorResults.map((row) => ({ id: row.id as number | string })),
      });
    }
  }

  const ftsResults = ftsSearch(query, { limit });
  if (ftsResults.length > 0) {
    lists.push({
      source: 'fts',
      results: ftsResults.map((row) => ({ id: row.id })),
    });
  }

  const bm25Results = bm25Search(query, { limit });
  if (bm25Results.length > 0) {
    lists.push({
      source: 'bm25',
      results: bm25Results.map((row) => ({ id: row.id })),
    });
  }

  const graphResults = graphSearchFn(query, { limit });
  if (graphResults.length > 0) {
    lists.push({
      source: 'graph',
      results: graphResults.map((row) => ({ id: row.id as number | string })),
    });
  }

  if (isDegreeBoostEnabled()) {
    const allResultIds = new Set<number>();
    for (const list of lists) {
      for (const row of list.results) {
        if (typeof row.id === 'number') {
          allResultIds.add(row.id);
        }
      }
    }

    if (allResultIds.size > 0) {
      const degreeScores = computeDegreeScores(database, Array.from(allResultIds));
      const degreeItems = Array.from(degreeScores.entries())
        .map(([id, score]) => ({ id: Number(id), score }))
        .filter((item) => Number.isFinite(item.id) && item.score > 0)
        .sort((left, right) => right.score - left.score);

      if (degreeItems.length > 0) {
        lists.push({
          source: 'degree',
          results: degreeItems.map((item) => ({ id: item.id })),
          weight: DEGREE_CHANNEL_WEIGHT,
        });
      }
    }
  }

  return lists;
}

/** Handle eval_run_ablation tool — runs ablation analysis or K-sensitivity sweep.
 * @param args - Ablation arguments (channels, queries, recallK, mode)
 * @returns MCP response with ablation report or K-sensitivity results
 */
async function handleEvalRunAblation(args: RunAblationArgs): Promise<MCPResponse> {
  await ensureMemoryRuntimeInitialized('handler:eval_run_ablation');
  if (args.mode === 'k_sensitivity') {
    return handleEvalKSensitivity({
      queries: args.queries,
      limit: args.recallK,
    });
  }

  await checkDatabaseUpdated();

  if (!isAblationEnabled()) {
    throw new MemoryError(
      ErrorCodes.INVALID_PARAMETER,
      'Ablation is disabled. Set SPECKIT_ABLATION=true to run ablation studies.',
      { flag: 'SPECKIT_ABLATION' }
    );
  }

  const datasetSelector = normalizeDatasetSelector(args);
  if (args.dataset) {
    return createEmptyDatasetAblationResponse(datasetSelector ?? args.dataset, args.dryRun === true);
  }

  const channels = normalizeChannels(args.channels as string[] | undefined);
  const recallK = typeof args.recallK === 'number' && Number.isFinite(args.recallK)
    ? Math.max(1, Math.floor(args.recallK))
    : 20;

  const report = await withAblationDb(async (db, dbPath) => {
    try {
      assertGroundTruthAlignment(db, {
        dbPath,
        context: 'eval_run_ablation',
      });
    } catch (error: unknown) {
      throw new MemoryError(
        ErrorCodes.INVALID_PARAMETER,
        error instanceof Error ? error.message : String(error),
        { dbPath },
      );
    }

    initializeEvalHybridSearch(db);

    const searchFn: AblationSearchFn = async (query, disabledChannels) => {
      const embedding = await generateQueryEmbeddingOrNull(query, 'ablation query');

      const pipelineConfig = buildEvalPipelineConfig(query, embedding, recallK, disabledChannels);
      const pipelineResult = await executePipeline(pipelineConfig);
      const results = pipelineResult.results;
      return {
        results: results.map((row, index) => ({
          memoryId: Number(
            (row as unknown as Record<string, unknown>).parentMemoryId ?? row.id
          ),
          score: row.score ?? 0,
          rank: index + 1,
        })),
        diagnosticRows: results.map((row, index) => ({
          ...row,
          id: Number((row as unknown as Record<string, unknown>).parentMemoryId ?? row.id),
          rank: index + 1,
        })),
      };
    };

    return runAblation(searchFn, {
      channels,
      groundTruthQueryIds: args.groundTruthQueryIds,
      recallK,
      datasetSelector,
      alignmentDb: db,
      alignmentDbPath: dbPath,
      alignmentContext: 'eval_run_ablation',
      includeDiagnosticSnapshots: true,
    });
  });

  if (!report) {
    throw new MemoryError(
      ErrorCodes.DATABASE_ERROR,
      'Ablation run returned no report. Check feature flag and ground truth availability.',
      {}
    );
  }

  const isEmptyDataset = report.status === 'empty_dataset' || report.evaluatedQueryCount === 0;
  const shouldStore = args.storeResults !== false && args.dryRun !== true && !isEmptyDataset;
  const stored = shouldStore ? storeAblationResults(report) : false;
  const formatted = args.includeFormattedReport === false ? null : formatAblationReport(report);
  const status = report.status ?? 'complete';
  const summary = isEmptyDataset
    ? `Ablation dataset empty or unavailable (selector=${report.datasetSelector ?? datasetSelector ?? 'default ground truth dataset'})`
    : `Ablation run complete (${report.results.length} channels, baseline=${report.overallBaselineRecall.toFixed(4)})`;

  return createMCPSuccessResponse({
    tool: 'eval_run_ablation',
    summary,
    data: {
      status,
      report,
      stored,
      dryRun: args.dryRun === true,
      warnings: report.warnings ?? [],
      ...(formatted ? { formattedReport: formatted } : {}),
    },
    hints: [
      args.dryRun === true
        ? 'Ablation dry-run requested; metrics were not persisted'
        : null,
      isEmptyDataset
        ? 'Ablation dataset was empty or unavailable; no metrics were persisted'
        : null,
      shouldStore
        ? (stored ? 'Ablation metrics stored to eval_metric_snapshots' : 'Ablation metrics storage failed')
        : 'Ablation metrics were not persisted (storeResults=false)',
    ].filter((hint): hint is string => typeof hint === 'string'),
  });
}

/** Representative queries used when no custom query set is provided. */
const DEFAULT_K_SENSITIVITY_QUERIES = [
  'memory retrieval',
  'hybrid search fusion',
  'context recall',
  'RRF scoring',
  'semantic search',
];

/**
 * Run Multi-K RRF sensitivity analysis.
 *
 * 1. Builds raw channel fusion lists for each representative query
 * 2. Converts results to per-query RankedList[] groups
 * 3. Aggregates per-query sensitivity and formats the report
 */
async function handleEvalKSensitivity(args: KSensitivityArgs): Promise<MCPResponse> {
  await ensureMemoryRuntimeInitialized('handler:eval_run_ablation');
  await checkDatabaseUpdated();

  const db = vectorIndex.getDb();
  if (!db) {
    throw new MemoryError(
      ErrorCodes.DATABASE_ERROR,
      'Database not initialized. Server may still be starting up.',
      {}
    );
  }

  const graphSearchFn = initializeEvalHybridSearch(db);

  const queries = Array.isArray(args.queries) && args.queries.length > 0
    ? args.queries
    : DEFAULT_K_SENSITIVITY_QUERIES;

  const limit = typeof args.limit === 'number' && Number.isFinite(args.limit)
    ? Math.max(1, Math.floor(args.limit))
    : 20;

  const queryLists: RankedList[][] = [];
  for (const query of queries) {
    const embedding = await generateQueryEmbeddingOrNull(query, 'k-sensitivity query');
    queryLists.push(buildRawFusionLists(db, graphSearchFn, query, embedding, limit));
  }

  const analysis = analyzeKValueSensitivityBatch(queryLists);
  const report = formatKValueReport(analysis);

  return createMCPSuccessResponse({
    tool: 'eval_run_ablation',
    summary: `K-sensitivity analysis complete (${queries.length} queries, ${analysis.totalItems} unique items)`,
    data: {
      report,
      queriesUsed: queries,
      totalItems: analysis.totalItems,
    },
    hints: [report.recommendation],
  });
}

async function handleEvalReportingDashboard(args: ReportingDashboardArgs): Promise<MCPResponse> {
  await ensureMemoryRuntimeInitialized('handler:eval_reporting_dashboard');
  await checkDatabaseUpdated();

  const report = await generateDashboardReport({
    sprintFilter: args.sprintFilter,
    channelFilter: args.channelFilter,
    metricFilter: args.metricFilter,
    limit: args.limit,
  });

  const format = args.format === 'json' ? 'json' : 'text';
  const formatted = format === 'json' ? formatReportJSON(report) : formatReportText(report);

  return createMCPSuccessResponse({
    tool: 'eval_reporting_dashboard',
    summary: `Dashboard generated (${report.sprints.length} sprint groups, ${report.totalEvalRuns} eval runs)`,
    data: {
      report,
      format,
      formatted,
    },
  });
}

export {
  handleEvalRunAblation,
  handleEvalReportingDashboard,
  handleEvalKSensitivity,
};

const handle_eval_run_ablation = handleEvalRunAblation;
const handle_eval_reporting_dashboard = handleEvalReportingDashboard;
const handle_eval_k_sensitivity = handleEvalKSensitivity;

export {
  handle_eval_run_ablation,
  handle_eval_reporting_dashboard,
  handle_eval_k_sensitivity,
};
