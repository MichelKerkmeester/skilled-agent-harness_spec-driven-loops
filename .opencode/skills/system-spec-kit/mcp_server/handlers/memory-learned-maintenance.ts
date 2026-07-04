// ────────────────────────────────────────────────────────────────
// MODULE: Memory Learned Maintenance Handler
// ────────────────────────────────────────────────────────────────
import { checkDatabaseUpdated } from '../core/index.js';
import { ensureMemoryRuntimeInitialized } from '../lib/runtime/memory-runtime-guard.js';
import * as vectorIndex from '../lib/search/vector-index.js';
import {
  clearAllLearnedTriggers,
  expireLearnedTerms,
} from '../lib/search/learned-feedback.js';
import { migrateLearnedTriggers, parseLearnedTriggers } from '../lib/storage/learned-triggers-schema.js';
import { createMCPErrorResponse, createMCPSuccessResponse } from '../lib/response/envelope.js';
import { toErrorMessage } from '../utils/index.js';

import type Database from 'better-sqlite3';
import type { MCPResponse } from './types.js';

interface MemoryLearnedExpireArgs {
  dryRun?: boolean;
}

interface MemoryLearnedClearArgs {
  confirm?: boolean;
}

function getDatabaseOrError(tool: string): Database.Database | MCPResponse {
  const database = vectorIndex.getDb();
  if (!database) {
    return createMCPErrorResponse({
      tool,
      error: 'Learned-trigger maintenance aborted: database unavailable',
      code: 'E_DB_UNAVAILABLE',
      recovery: {
        hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database.',
        actions: ['Restart the MCP server', 'Call memory_index_scan()'],
        severity: 'error',
      },
    });
  }
  return database;
}

function countExpiredLearnedTerms(database: Database.Database): { expired: number; updated: number } {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const rows = database.prepare(`
    SELECT id, learned_triggers
    FROM memory_index
    WHERE learned_triggers IS NOT NULL
      AND learned_triggers != '[]'
  `).all() as Array<{ id: number; learned_triggers: string }>;

  let expired = 0;
  let updated = 0;
  for (const row of rows) {
    const entries = parseLearnedTriggers(row.learned_triggers);
    const expiredForRow = entries.filter((entry) => entry.expiresAt <= nowSeconds).length;
    if (expiredForRow > 0) {
      expired += expiredForRow;
      updated += 1;
    }
  }
  return { expired, updated };
}

function countLearnedTriggerRows(database: Database.Database): number {
  const row = database.prepare(`
    SELECT COUNT(*) AS count
    FROM memory_index
    WHERE learned_triggers IS NOT NULL
      AND learned_triggers != '[]'
  `).get() as { count: number };
  return row.count;
}

async function handleMemoryLearnedExpire(args: MemoryLearnedExpireArgs = {}): Promise<MCPResponse> {
  await ensureMemoryRuntimeInitialized('handler:memory_learned_expire');
  await checkDatabaseUpdated();

  const maybeDatabase = getDatabaseOrError('memory_learned_expire');
  if ('content' in maybeDatabase) return maybeDatabase;

  try {
    migrateLearnedTriggers(maybeDatabase);
    const preview = countExpiredLearnedTerms(maybeDatabase);
    const dryRun = args.dryRun !== false;
    const updated = dryRun ? 0 : expireLearnedTerms(maybeDatabase);
    const summary = dryRun
      ? `Dry-run found ${preview.expired} expired learned trigger term(s) across ${preview.updated} memory row(s); no rows updated`
      : `Expired learned trigger terms in ${updated} memory row(s)`;

    return createMCPSuccessResponse({
      tool: 'memory_learned_expire',
      summary,
      data: {
        dryRun,
        expired: preview.expired,
        updated: dryRun ? preview.updated : updated,
      },
      hints: dryRun && preview.updated > 0
        ? ['Run memory_learned_expire({ dryRun: false }) after confirmation to remove expired terms.']
        : [],
    });
  } catch (error: unknown) {
    return createMCPErrorResponse({
      tool: 'memory_learned_expire',
      error: `Learned-trigger expiry failed: ${toErrorMessage(error)}`,
      code: 'E_LEARNED_EXPIRE_FAILED',
      recovery: {
        hint: 'Run memory_health(), then retry memory_learned_expire({ dryRun: true }).',
        actions: ['Run memory_health()', 'Retry memory_learned_expire({ dryRun: true })'],
        severity: 'error',
      },
    });
  }
}

async function handleMemoryLearnedClear(args: MemoryLearnedClearArgs = {}): Promise<MCPResponse> {
  await ensureMemoryRuntimeInitialized('handler:memory_learned_clear');
  await checkDatabaseUpdated();

  if (args.confirm !== true) {
    return createMCPErrorResponse({
      tool: 'memory_learned_clear',
      error: 'confirm:true is required to clear learned triggers',
      code: 'E_CONFIRM_REQUIRED',
      recovery: {
        hint: 'Confirm the rollback in /memory:manage before clearing learned triggers.',
        actions: ['Retry memory_learned_clear({ confirm: true }) after confirmation'],
        severity: 'warning',
      },
    });
  }

  const maybeDatabase = getDatabaseOrError('memory_learned_clear');
  if ('content' in maybeDatabase) return maybeDatabase;

  try {
    migrateLearnedTriggers(maybeDatabase);
    const affected = countLearnedTriggerRows(maybeDatabase);
    const cleared = clearAllLearnedTriggers(maybeDatabase);

    return createMCPSuccessResponse({
      tool: 'memory_learned_clear',
      summary: `Cleared learned triggers from ${cleared} memory row(s)`,
      data: {
        affected,
        cleared,
      },
    });
  } catch (error: unknown) {
    return createMCPErrorResponse({
      tool: 'memory_learned_clear',
      error: `Learned-trigger clear failed: ${toErrorMessage(error)}`,
      code: 'E_LEARNED_CLEAR_FAILED',
      recovery: {
        hint: 'Run memory_health(), then retry only after confirming the rollback.',
        actions: ['Run memory_health()', 'Retry memory_learned_clear({ confirm: true })'],
        severity: 'error',
      },
    });
  }
}

export { handleMemoryLearnedExpire, handleMemoryLearnedClear };
