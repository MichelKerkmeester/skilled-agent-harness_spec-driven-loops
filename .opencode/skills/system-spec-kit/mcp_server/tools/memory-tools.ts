// ───────────────────────────────────────────────────────────────
// MODULE: Memory Tools
// ───────────────────────────────────────────────────────────────
// Dispatch for L2-L4 memory tools: search, triggers, save,
// List, stats, health, delete, update, validate.
import {
  handleMemorySearch,
  handleMemoryMatchTriggers,
  handleMemorySave,
  handleMemoryList,
  handleMemoryStats,
  handleMemoryHealth,
  handleMemoryDelete,
  handleMemoryUpdate,
  handleMemoryValidate,
  handleMemoryBulkDelete,
  handleMemoryRetentionSweep,
  handleMemoryLearnedExpire,
  handleMemoryLearnedClear,
  handleMemoryEmbeddingReconcile,
  handleEmbedderList,
  handleEmbedderSet,
  handleEmbedderStatus,
} from '../handlers/index.js';
import { validateToolArgs } from '../schemas/tool-input-schemas.js';

import { parseArgs } from './types.js';
import type {
  MCPResponse,
  SearchArgs,
  TriggerArgs,
  SaveArgs,
  ListArgs,
  StatsArgs,
  HealthArgs,
  DeleteArgs,
  UpdateArgs,
  MemoryValidateArgs,
  BulkDeleteArgs,
  RetentionSweepArgs,
  LearnedExpireArgs,
  LearnedClearArgs,
  ReconcileArgs,
  EmbedderSetArgs,
  EmbedderStatusArgs,
} from './types.js';

/** Tool names handled by this module */
export const TOOL_NAMES = new Set([
  'memory_search',
  'memory_quick_search',
  'memory_match_triggers',
  'memory_save',
  'memory_list',
  'memory_stats',
  'memory_health',
  'memory_delete',
  'memory_update',
  'memory_validate',
  'memory_bulk_delete',
  'memory_retention_sweep',
  'memory_learned_expire',
  'memory_learned_clear',
  'memory_embedding_reconcile',
  'embedder_list',
  'embedder_set',
  'embedder_status',
]);

/** Dispatch a tool call. Returns null if tool name not handled. */
export async function handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
  switch (name) {
    case 'memory_search':         return handleMemorySearch(parseArgs<SearchArgs>(validateToolArgs('memory_search', args)));
    case 'memory_quick_search': {
      const validatedArgs = validateToolArgs('memory_quick_search', args);
      const response = await handleMemorySearch(parseArgs<SearchArgs>({
        ...validatedArgs,
        autoDetectIntent: true,
        enableDedup: true,
        includeContent: true,
        includeConstitutional: true,
        rerank: true,
      }));
      if (response.content?.[0]?.text) {
        try {
          const payload = JSON.parse(response.content[0].text) as { meta?: Record<string, unknown> };
          payload.meta = { ...(payload.meta ?? {}), tool: 'memory_quick_search' };
          response.content[0].text = JSON.stringify(payload);
        } catch {
          // Non-JSON responses are returned unchanged.
        }
      }
      return response;
    }
    case 'memory_match_triggers': return handleMemoryMatchTriggers(parseArgs<TriggerArgs>(validateToolArgs('memory_match_triggers', args)));
    case 'memory_save':           return handleMemorySave(parseArgs<SaveArgs>(validateToolArgs('memory_save', args)));
    case 'memory_list':           return handleMemoryList(parseArgs<ListArgs>(validateToolArgs('memory_list', args)));
    case 'memory_stats':          return handleMemoryStats(parseArgs<StatsArgs>(validateToolArgs('memory_stats', args)));
    case 'memory_health':         return handleMemoryHealth(parseArgs<HealthArgs>(validateToolArgs('memory_health', args)));
    case 'memory_delete':         return handleMemoryDelete(parseArgs<DeleteArgs>(validateToolArgs('memory_delete', args)));
    case 'memory_update':         return handleMemoryUpdate(parseArgs<UpdateArgs>(validateToolArgs('memory_update', args)));
    case 'memory_validate':       return handleMemoryValidate(parseArgs<MemoryValidateArgs>(validateToolArgs('memory_validate', args)));
    case 'memory_bulk_delete':    return handleMemoryBulkDelete(parseArgs<BulkDeleteArgs>(validateToolArgs('memory_bulk_delete', args)));
    case 'memory_retention_sweep': return handleMemoryRetentionSweep(parseArgs<RetentionSweepArgs>(validateToolArgs('memory_retention_sweep', args)));
    case 'memory_learned_expire': return handleMemoryLearnedExpire(parseArgs<LearnedExpireArgs>(validateToolArgs('memory_learned_expire', args)));
    case 'memory_learned_clear': return handleMemoryLearnedClear(parseArgs<LearnedClearArgs>(validateToolArgs('memory_learned_clear', args)));
    case 'memory_embedding_reconcile': return handleMemoryEmbeddingReconcile(parseArgs<ReconcileArgs>(validateToolArgs('memory_embedding_reconcile', args)));
    case 'embedder_list':
      validateToolArgs('embedder_list', args);
      return handleEmbedderList();
    case 'embedder_set':          return handleEmbedderSet(parseArgs<EmbedderSetArgs>(validateToolArgs('embedder_set', args)));
    case 'embedder_status':       return handleEmbedderStatus(parseArgs<EmbedderStatusArgs>(validateToolArgs('embedder_status', args)));
    default: return null;
  }
}
