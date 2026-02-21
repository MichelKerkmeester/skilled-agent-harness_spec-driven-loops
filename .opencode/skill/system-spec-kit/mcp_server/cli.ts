#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: CLI Entry Point
// ---------------------------------------------------------------
// Standalone CLI for bulk database operations, runnable from any
// directory. Resolves its own modules via __dirname so
// better-sqlite3 and sqlite-vec load correctly regardless of cwd.
//
// Usage:
//   node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js stats
//   node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js bulk-delete --tier deprecated
//   node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js reindex [--force]
// ---------------------------------------------------------------

// Core modules (resolved relative to this file's location)
import * as vectorIndex from './lib/search/vector-index';
import * as checkpointsLib from './lib/storage/checkpoints';
import * as accessTracker from './lib/storage/access-tracker';
import * as causalEdges from './lib/storage/causal-edges';
import * as mutationLedger from './lib/storage/mutation-ledger';
import * as triggerMatcher from './lib/parsing/trigger-matcher';
import { DATABASE_PATH } from './core';

/* ---------------------------------------------------------------
   1. ARGUMENT PARSING
--------------------------------------------------------------- */

const args = process.argv.slice(2);
const command = args[0];

function getFlag(name: string): boolean {
  return args.includes(`--${name}`);
}

function getOption(name: string): string | undefined {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1 || idx + 1 >= args.length) return undefined;
  return args[idx + 1];
}

function printUsage(): void {
  console.log(`
spec-kit-cli — Bulk database operations for Spec Kit Memory

Usage:
  spec-kit-cli <command> [options]

Commands:
  stats                          Show memory database statistics
  bulk-delete --tier <tier>      Delete memories by importance tier
    [--folder <spec-folder>]       Optional: scope to a spec folder
    [--older-than <days>]          Optional: only delete older than N days
    [--dry-run]                    Preview without deleting
  reindex [--force]              Re-index memory files

Options:
  --help                         Show this help message

Examples:
  spec-kit-cli stats
  spec-kit-cli bulk-delete --tier deprecated
  spec-kit-cli bulk-delete --tier temporary --older-than 30
  spec-kit-cli bulk-delete --tier deprecated --folder 003-system-spec-kit --dry-run
  spec-kit-cli reindex
  spec-kit-cli reindex --force
`);
}

/* ---------------------------------------------------------------
   2. DATABASE INITIALIZATION (minimal — no MCP, no embeddings)
--------------------------------------------------------------- */

function initDatabase(): void {
  vectorIndex.initializeDb();
  const db = vectorIndex.getDb();
  if (!db) {
    console.error(`ERROR: Failed to open database at ${DATABASE_PATH}`);
    process.exit(1);
  }
  checkpointsLib.init(db);
  accessTracker.init(db);
}

/* ---------------------------------------------------------------
   3. STATS COMMAND
--------------------------------------------------------------- */

function runStats(): void {
  initDatabase();
  const db = vectorIndex.getDb()!;

  // Total count
  const totalRow = db.prepare('SELECT COUNT(*) as count FROM memory_index').get() as { count: number };
  console.log(`\nMemory Database Statistics`);
  console.log(`${'─'.repeat(50)}`);
  console.log(`  Database:  ${DATABASE_PATH}`);
  console.log(`  Total:     ${totalRow.count} memories`);

  // Tier distribution
  const tiers = db.prepare(
    'SELECT importance_tier, COUNT(*) as count FROM memory_index GROUP BY importance_tier ORDER BY count DESC'
  ).all() as Array<{ importance_tier: string; count: number }>;

  console.log(`\n  Tier Distribution:`);
  for (const tier of tiers) {
    const bar = '█'.repeat(Math.min(Math.ceil(tier.count / Math.max(1, totalRow.count) * 30), 30));
    console.log(`    ${(tier.importance_tier || 'null').padEnd(16)} ${bar} ${tier.count}`);
  }

  // Top folders
  const folders = db.prepare(
    'SELECT spec_folder, COUNT(*) as count FROM memory_index WHERE spec_folder IS NOT NULL GROUP BY spec_folder ORDER BY count DESC LIMIT 10'
  ).all() as Array<{ spec_folder: string; count: number }>;

  if (folders.length > 0) {
    console.log(`\n  Top Folders:`);
    for (const folder of folders) {
      const bar = '█'.repeat(Math.min(Math.ceil(folder.count / Math.max(1, folders[0].count) * 20), 20));
      console.log(`    ${folder.spec_folder.padEnd(40)} ${bar} ${folder.count}`);
    }
  }

  // Schema version
  try {
    const versionRow = db.prepare("SELECT value FROM config WHERE key = 'schema_version'").get() as { value: string } | undefined;
    if (versionRow) {
      console.log(`\n  Schema:    v${versionRow.value}`);
    }
  } catch {
    // config table may not exist
  }

  // Chunked memories (parent/child)
  try {
    const chunkedParents = db.prepare(
      "SELECT COUNT(*) as count FROM memory_index WHERE embedding_status = 'partial'"
    ).get() as { count: number };
    const childChunks = db.prepare(
      'SELECT COUNT(*) as count FROM memory_index WHERE parent_id IS NOT NULL'
    ).get() as { count: number };
    if (chunkedParents.count > 0 || childChunks.count > 0) {
      console.log(`\n  Chunked:   ${chunkedParents.count} parent(s), ${childChunks.count} chunk(s)`);
    }
  } catch {
    // parent_id column may not exist yet
  }

  console.log('');
}

/* ---------------------------------------------------------------
   4. BULK DELETE COMMAND
--------------------------------------------------------------- */

function runBulkDelete(): void {
  const tier = getOption('tier');
  if (!tier) {
    console.error('ERROR: --tier is required. Example: spec-kit-cli bulk-delete --tier deprecated');
    process.exit(1);
  }

  const validTiers = ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'];
  if (!validTiers.includes(tier)) {
    console.error(`ERROR: Invalid tier "${tier}". Must be one of: ${validTiers.join(', ')}`);
    process.exit(1);
  }

  const specFolder = getOption('folder');
  const olderThanDays = getOption('older-than');
  const dryRun = getFlag('dry-run');

  // Safety: refuse constitutional/critical without folder scope
  if ((tier === 'constitutional' || tier === 'critical') && !specFolder) {
    console.error(`ERROR: Bulk delete of "${tier}" tier requires --folder scope for safety.`);
    process.exit(1);
  }

  initDatabase();
  const db = vectorIndex.getDb()!;

  // Count affected
  let countSql = 'SELECT COUNT(*) as count FROM memory_index WHERE importance_tier = ?';
  const countParams: unknown[] = [tier];

  if (specFolder) {
    countSql += ' AND spec_folder = ?';
    countParams.push(specFolder);
  }
  if (olderThanDays) {
    countSql += ` AND created_at < datetime('now', '-' || ? || ' days')`;
    countParams.push(parseInt(olderThanDays, 10));
  }

  const countResult = db.prepare(countSql).get(...countParams) as { count: number };
  const affectedCount = countResult.count;

  console.log(`\nBulk Delete Preview`);
  console.log(`${'─'.repeat(50)}`);
  console.log(`  Tier:        ${tier}`);
  if (specFolder) console.log(`  Folder:      ${specFolder}`);
  if (olderThanDays) console.log(`  Older than:  ${olderThanDays} days`);
  console.log(`  Affected:    ${affectedCount} memories`);

  if (affectedCount === 0) {
    console.log(`\n  No memories match the criteria.`);
    return;
  }

  if (dryRun) {
    console.log(`\n  [DRY RUN] Would delete ${affectedCount} memories. No changes made.`);

    // Show sample of affected memories
    let sampleSql = 'SELECT id, title, created_at FROM memory_index WHERE importance_tier = ?';
    const sampleParams: unknown[] = [tier];
    if (specFolder) { sampleSql += ' AND spec_folder = ?'; sampleParams.push(specFolder); }
    if (olderThanDays) { sampleSql += ` AND created_at < datetime('now', '-' || ? || ' days')`; sampleParams.push(parseInt(olderThanDays, 10)); }
    sampleSql += ' ORDER BY created_at ASC LIMIT 10';

    const samples = db.prepare(sampleSql).all(...sampleParams) as Array<{ id: number; title: string; created_at: string }>;
    if (samples.length > 0) {
      console.log(`\n  Sample (first ${samples.length}):`);
      for (const s of samples) {
        console.log(`    #${s.id}  ${(s.title || '(no title)').slice(0, 50).padEnd(50)}  ${s.created_at}`);
      }
      if (affectedCount > 10) {
        console.log(`    ... and ${affectedCount - 10} more`);
      }
    }
    return;
  }

  // Create checkpoint before deletion
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const checkpointName = `pre-bulk-delete-${tier}-${timestamp}`;

  try {
    checkpointsLib.createCheckpoint({
      name: checkpointName,
      specFolder,
      metadata: {
        reason: `CLI bulk delete of ${affectedCount} "${tier}" memories`,
        tier,
        affectedCount,
        olderThanDays: olderThanDays ? parseInt(olderThanDays, 10) : null,
      },
    });
    console.log(`\n  Checkpoint:  ${checkpointName}`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`  WARNING: Failed to create checkpoint: ${message}`);
    console.error(`  Proceeding with deletion...`);
  }

  // Fetch IDs for deletion
  let selectSql = 'SELECT id FROM memory_index WHERE importance_tier = ?';
  const selectParams: unknown[] = [tier];
  if (specFolder) { selectSql += ' AND spec_folder = ?'; selectParams.push(specFolder); }
  if (olderThanDays) { selectSql += ` AND created_at < datetime('now', '-' || ? || ' days')`; selectParams.push(parseInt(olderThanDays, 10)); }

  const toDelete = db.prepare(selectSql).all(...selectParams) as Array<{ id: number }>;

  // Initialize causal edges for cleanup
  causalEdges.init(db);

  // Delete in transaction
  let deletedCount = 0;
  const deletedIds: number[] = [];

  const bulkDeleteTx = db.transaction(() => {
    for (const memory of toDelete) {
      if (vectorIndex.deleteMemory(memory.id)) {
        deletedCount++;
        deletedIds.push(memory.id);
        try { causalEdges.deleteEdgesForMemory(String(memory.id)); } catch { /* ignore */ }
      }
    }
  });

  bulkDeleteTx();

  // Record in mutation ledger
  try {
    mutationLedger.initLedger(db);
    mutationLedger.appendEntry(db, {
      mutation_type: 'delete',
      reason: `CLI bulk-delete: ${deletedCount} memories with tier="${tier}"`,
      prior_hash: null,
      new_hash: mutationLedger.computeHash(`cli-bulk-delete-tier:${tier}:${deletedCount}:${Date.now()}`),
      linked_memory_ids: deletedIds.slice(0, 50),
      decision_meta: { tool: 'cli:bulk-delete', tier, specFolder: specFolder || null, olderThanDays: olderThanDays ? parseInt(olderThanDays, 10) : null },
      actor: 'cli:bulk-delete',
    });
  } catch {
    // Mutation ledger may not exist — non-fatal
  }

  // Invalidate trigger cache
  triggerMatcher.clearCache();

  console.log(`\n  Deleted:     ${deletedCount} memories`);
  console.log(`  Restore:     spec-kit-cli checkpoint restore ${checkpointName}`);
  console.log('');
}

/* ---------------------------------------------------------------
   5. REINDEX COMMAND
--------------------------------------------------------------- */

async function runReindex(): Promise<void> {
  const force = getFlag('force');

  console.log(`\nReindex Memory Files`);
  console.log(`${'─'.repeat(50)}`);
  console.log(`  Mode:  ${force ? 'force (all files)' : 'incremental (changed only)'}`);

  // Dynamic import to avoid pulling in embeddings at startup for simple commands
  const { handleMemoryIndexScan } = await import('./handlers/memory-index');
  const { setEmbeddingModelReady: setHandlerReady } = await import('./handlers/memory-crud');
  const embeddings = await import('./lib/providers/embeddings');

  initDatabase();

  // Initialize embedding model (required for indexing)
  console.log(`  Loading embedding model...`);
  try {
    await embeddings.generateEmbedding('warmup');
    setHandlerReady(true);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`  ERROR: Embedding model failed: ${message}`);
    process.exit(1);
  }

  console.log(`  Scanning...`);
  const result = await handleMemoryIndexScan({
    force,
    includeConstitutional: true,
    includeReadmes: true,
    includeSpecDocs: true,
  });

  // Extract summary from MCP response
  try {
    const text = result?.content?.[0]?.text;
    if (text) {
      const envelope = JSON.parse(text);
      if (envelope.data) {
        const d = envelope.data;
        console.log(`\n  Results:`);
        console.log(`    Indexed:   ${d.indexed ?? 0}`);
        console.log(`    Updated:   ${d.updated ?? 0}`);
        console.log(`    Skipped:   ${d.skipped ?? 0}`);
        console.log(`    Errors:    ${d.errors ?? 0}`);
      } else {
        console.log(`\n  ${envelope.summary || 'Scan complete'}`);
      }
    }
  } catch {
    console.log(`  Scan complete`);
  }
  console.log('');
}

/* ---------------------------------------------------------------
   6. MAIN DISPATCH
--------------------------------------------------------------- */

async function main(): Promise<void> {
  if (!command || command === '--help' || command === '-h') {
    printUsage();
    process.exit(0);
  }

  switch (command) {
    case 'stats':
      runStats();
      break;
    case 'bulk-delete':
      runBulkDelete();
      break;
    case 'reindex':
      await runReindex();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      printUsage();
      process.exit(1);
  }

  // Close DB cleanly
  vectorIndex.closeDb();
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`FATAL: ${message}`);
  try { vectorIndex.closeDb(); } catch { /* ignore */ }
  process.exit(1);
});
