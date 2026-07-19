// TEST: MCP TOOL DISPATCH
import { beforeEach, describe, expect, it, vi } from 'vitest';

const handlerSpies = vi.hoisted(() => {
  const handlerNames = [
    'handleMemoryContext',
    'handleMemorySearch',
    'handleMemoryMatchTriggers',
    'handleMemorySave',
    'handleMemoryList',
    'handleMemoryStats',
    'handleMemoryHealth',
    'handleMemoryDelete',
    'handleMemoryUpdate',
    'handleMemoryValidate',
    'handleMemoryBulkDelete',
    'handleMemoryRetentionSweep',
    'handleMemoryLearnedExpire',
    'handleMemoryLearnedClear',
    'handleMemoryEmbeddingReconcile',
    'handleEmbedderList',
    'handleEmbedderSet',
    'handleEmbedderStatus',
    'handleMemoryDriftWhy',
    'handleMemoryCausalLink',
    'handleMemoryCausalStats',
    'handleMemoryCausalUnlink',
    'handleCheckpointCreate',
    'handleCheckpointList',
    'handleCheckpointRestore',
    'handleCheckpointDelete',
    'handleMemoryIndexScan',
    'handleMemoryIndexScanStatus',
    'handleMemoryIndexScanCancel',
    'handleTaskPreflight',
    'handleTaskPostflight',
    'handleGetLearningHistory',
    'handleMemoryIngestStart',
    'handleMemoryIngestStatus',
    'handleMemoryIngestCancel',
    'handleEvalRunAblation',
    'handleEvalReportingDashboard',
    'handleSessionHealth',
    'handleSessionResume',
    'handleSessionBootstrap',
  ] as const;

  return Object.fromEntries(handlerNames.map((name) => [
    name,
    vi.fn(async () => ({
      content: [{ type: 'text', text: JSON.stringify({ data: { results: [] }, meta: { tool: name } }) }],
    })),
  ]));
});

vi.mock('../handlers/index', () => handlerSpies);

import { TOOL_DEFINITIONS } from '../tool-schemas';
import { TOOL_SCHEMAS } from '../schemas/tool-input-schemas';
import {
  ALL_DISPATCHERS,
  dispatchTool,
} from '../tools/index';
import {
  enforceEnvelopeResultBudget,
  resolveEnvelopeTokenBudget,
} from '../context-server';
import {
  serializeEnvelopeWithTokenCount,
  syncEnvelopeTokenCount,
} from '../hooks';

const MINIMAL_VALID_ARGS: Record<string, Record<string, unknown>> = {
  memory_context: { input: 'context query' },
  memory_search: { query: 'search query' },
  memory_quick_search: { query: 'quick query' },
  memory_match_triggers: { prompt: 'trigger prompt' },
  memory_save: { filePath: '/tmp/context.md' },
  memory_delete: { id: 1, confirm: true },
  memory_update: { id: 1 },
  memory_validate: { id: 1, wasUseful: true },
  memory_bulk_delete: { tier: 'temporary', confirm: true },
  memory_learned_clear: { confirm: true },
  checkpoint_create: { name: 'checkpoint' },
  checkpoint_restore: { name: 'checkpoint' },
  checkpoint_delete: { name: 'checkpoint', confirmName: 'checkpoint' },
  task_preflight: {
    specFolder: 'specs/active',
    taskId: 'implementation',
    knowledgeScore: 50,
    uncertaintyScore: 50,
    contextScore: 50,
  },
  task_postflight: {
    specFolder: 'specs/active',
    taskId: 'implementation',
    knowledgeScore: 75,
    uncertaintyScore: 25,
    contextScore: 75,
  },
  memory_drift_why: { memoryId: '1' },
  memory_causal_link: { sourceId: '1', targetId: '2', relation: 'supports' },
  memory_causal_unlink: { edgeId: 1 },
  memory_get_learning_history: { specFolder: 'specs/active' },
  memory_ingest_start: { paths: ['/tmp/context.md'] },
  memory_ingest_status: { jobId: 'job-1' },
  memory_ingest_cancel: { jobId: 'job-1' },
  memory_index_scan_status: { jobId: 'job-1' },
  memory_index_scan_cancel: { jobId: 'job-1' },
  embedder_set: { name: 'embedder', dryRun: true },
};

function totalHandlerCalls(): number {
  return Object.values(handlerSpies).reduce((total, spy) => total + spy.mock.calls.length, 0);
}

describe('MCP protocol tool dispatch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('keeps advertised definitions, runtime schemas, and dispatcher names identical', () => {
    const definitionNames = TOOL_DEFINITIONS.map((tool) => tool.name).sort();
    const schemaNames = Object.keys(TOOL_SCHEMAS).sort();
    const dispatcherNames = Array.from(new Set(
      ALL_DISPATCHERS.flatMap((dispatcher) => Array.from(dispatcher.TOOL_NAMES)),
    )).sort();

    expect(schemaNames).toEqual(definitionNames);
    expect(dispatcherNames).toEqual(definitionNames);
  });

  it('dispatches every advertised tool through exactly one real dispatcher', async () => {
    expect(TOOL_DEFINITIONS).toHaveLength(41);

    for (const definition of TOOL_DEFINITIONS) {
      const owners = ALL_DISPATCHERS.filter((dispatcher) => dispatcher.TOOL_NAMES.has(definition.name));
      expect(owners, definition.name).toHaveLength(1);

      const before = totalHandlerCalls();
      const result = await dispatchTool(definition.name, MINIMAL_VALID_ARGS[definition.name] ?? {});

      expect(result, definition.name).not.toBeNull();
      expect(totalHandlerCalls() - before, definition.name).toBe(1);
    }
  });

  it('honors memory_context upward and downward budgets in the dispatch envelope', () => {
    const rows = Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      title: `Result ${index + 1}`,
      content: 'x'.repeat(700),
    }));
    const envelope: Record<string, unknown> = {
      data: { count: rows.length, results: rows },
      hints: [],
      meta: { tool: 'memory_context', tokenBudget: 12000 },
    };
    syncEnvelopeTokenCount(envelope);
    const meta = envelope.meta as Record<string, unknown>;

    expect(meta.tokenCount).toEqual(expect.any(Number));
    expect(meta.tokenCount as number).toBeGreaterThan(3500);
    expect(meta.tokenCount as number).toBeLessThan(12000);
    expect(resolveEnvelopeTokenBudget('memory_context', meta)).toBe(12000);
    expect(resolveEnvelopeTokenBudget('memory_context', { tokenBudget: 500 })).toBe(500);
    expect(enforceEnvelopeResultBudget(
      envelope,
      resolveEnvelopeTokenBudget('memory_context', meta),
      syncEnvelopeTokenCount,
    )).toBe(false);

    const serialized = serializeEnvelopeWithTokenCount(envelope);
    const parsed = JSON.parse(serialized) as { data: { results: unknown[] } };
    expect(parsed.data.results).toHaveLength(20);
  });
});
