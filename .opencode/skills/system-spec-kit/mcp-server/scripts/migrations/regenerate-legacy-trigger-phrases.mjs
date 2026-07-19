#!/usr/bin/env node
import Database from 'better-sqlite3';

const MIGRATION_VERSION = 'regenerate-legacy-trigger-phrases-v1';

function usage() {
  return [
    'Usage: node scripts/migrations/regenerate-legacy-trigger-phrases.mjs --db <sqlite-db> [--before <iso>] [--batch-size <n>] [--apply --checkpoint-id <id> --baseline-selected <n>]',
    'Default is dry-run count-only. Apply mode is batched, resumable, and preserves existing phrases by merging.',
  ].join('\n');
}

function parseArgs(argv) {
  const args = {
    apply: false,
    before: null,
    batchSize: 200,
    checkpointId: null,
    baselineSelected: null,
    db: null,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--apply') args.apply = true;
    else if (arg === '--db') args.db = argv[++i] ?? null;
    else if (arg === '--before') args.before = argv[++i] ?? null;
    else if (arg === '--batch-size') args.batchSize = Number.parseInt(argv[++i] ?? '', 10);
    else if (arg === '--checkpoint-id') args.checkpointId = argv[++i] ?? null;
    else if (arg === '--baseline-selected') args.baselineSelected = Number.parseInt(argv[++i] ?? '', 10);
    else if (arg === '--help' || arg === '-h') {
      console.log(usage());
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!args.db) throw new Error('Missing --db');
  if (!Number.isInteger(args.batchSize) || args.batchSize < 1) throw new Error('--batch-size must be a positive integer');
  if (args.apply && !args.checkpointId) throw new Error('Apply mode requires --checkpoint-id');
  if (args.apply && (!Number.isInteger(args.baselineSelected) || args.baselineSelected < 0)) {
    throw new Error('Apply mode requires --baseline-selected <n>');
  }
  // Regeneration must only touch rows that predate the matcher-side quality guard;
  // without a cutoff, apply could rewrite fresh, already-clean phrases.
  if (args.apply && !args.before) {
    throw new Error('Apply mode requires --before <iso> so regeneration is scoped to legacy pre-guard rows only');
  }
  if (args.before && Number.isNaN(Date.parse(args.before))) {
    throw new Error('--before must be an ISO-8601 timestamp');
  }
  return args;
}

function parsePhrases(raw) {
  if (typeof raw !== 'string' || raw.trim() === '') return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((value) => typeof value === 'string') : [];
  } catch {
    return [];
  }
}

function normalizeToken(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function titleTokens(title) {
  return new Set(normalizeToken(title).split(/\s+/u).filter((token) => token.length >= 3));
}

function isSingleTokenPhrase(phrase) {
  return normalizeToken(phrase).split(/\s+/u).filter(Boolean).length === 1;
}

function isTitleWordSoup(row) {
  const phrases = parsePhrases(row.trigger_phrases);
  if (phrases.length < 3) return false;
  const tokens = titleTokens(row.title ?? '');
  if (tokens.size === 0) return false;
  let soup = 0;
  for (const phrase of phrases) {
    const normalized = normalizeToken(phrase);
    if (isSingleTokenPhrase(phrase) && tokens.has(normalized)) soup += 1;
  }
  return soup === phrases.length || soup / phrases.length >= 0.7;
}

function shouldSkip(row) {
  const tier = String(row.importance_tier ?? '').toLowerCase();
  const filePath = String(row.file_path ?? '').toLowerCase();
  return tier === 'constitutional'
    || tier === 'archived'
    || tier === 'deprecated'
    || filePath.includes('/z_archive/')
    || filePath.startsWith('z_archive/');
}

function mergePhrases(existing, extracted, limit = 10) {
  const merged = [];
  const seen = new Set();
  for (const phrase of [...existing, ...extracted]) {
    const cleaned = String(phrase).trim().replace(/\s+/g, ' ');
    const key = cleaned.toLowerCase();
    if (!cleaned || seen.has(key)) continue;
    seen.add(key);
    merged.push(cleaned);
    if (merged.length >= limit) break;
  }
  return merged;
}

function loadCandidateRows(db, before) {
  if (!hasTable(db, 'memory_index')) return [];
  const beforeClause = before ? 'AND datetime(COALESCE(updated_at, created_at)) < datetime(?)' : '';
  const params = before ? [before] : [];
  return db.prepare(`
    SELECT id, title, trigger_phrases, content_text, importance_tier, file_path, updated_at, created_at
    FROM memory_index
    WHERE trigger_phrases IS NOT NULL
      AND trim(trigger_phrases) != ''
      AND trim(trigger_phrases) != '[]'
      AND deleted_at IS NULL
      ${beforeClause}
    ORDER BY id ASC
  `).all(...params);
}

function hasTable(db, tableName) {
  const row = db.prepare("SELECT 1 AS present FROM sqlite_master WHERE type = 'table' AND name = ?")
    .get(tableName);
  return row?.present === 1;
}

function ensureAuditTables(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS trigger_phrase_regeneration_audit (
      memory_id INTEGER PRIMARY KEY,
      prior_trigger_phrases TEXT NOT NULL,
      new_trigger_phrases TEXT NOT NULL,
      migration_version TEXT NOT NULL,
      checkpoint_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS trigger_phrase_regeneration_state (
      migration_version TEXT PRIMARY KEY,
      last_memory_id INTEGER NOT NULL DEFAULT 0,
      checkpoint_id TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

async function loadExtractor() {
  const moduleUrl = new URL('../../dist/handlers/quality-loop.js', import.meta.url);
  const module = await import(moduleUrl.href);
  if (typeof module.extractTriggersFromContent !== 'function') {
    throw new Error('Quality-loop trigger extractor is unavailable; run the MCP server build first');
  }
  return module.extractTriggersFromContent;
}

const args = parseArgs(process.argv);
const db = new Database(args.db);
try {
  const candidates = loadCandidateRows(db, args.before);
  const selected = candidates.filter((row) => !shouldSkip(row) && isTitleWordSoup(row));
  const skippedArchivedOrConstitutional = candidates.filter(shouldSkip).length;
  const result = {
    script: 'regenerate-legacy-trigger-phrases',
    mode: args.apply ? 'apply' : 'dry-run',
    migrationVersion: MIGRATION_VERSION,
    scanned: candidates.length,
    selected: selected.length,
    skippedArchivedOrConstitutional,
    updated: 0,
    checkpointId: args.checkpointId,
  };

  if (args.apply) {
    if (selected.length !== args.baselineSelected) {
      throw new Error(`Refusing apply: selected ${selected.length} does not match baseline ${args.baselineSelected}`);
    }
    ensureAuditTables(db);
    const extractTriggersFromContent = await loadExtractor();
    const state = db.prepare('SELECT last_memory_id FROM trigger_phrase_regeneration_state WHERE migration_version = ?')
      .get(MIGRATION_VERSION);
    const lastMemoryId = state?.last_memory_id ?? 0;
    const batch = selected.filter((row) => row.id > lastMemoryId).slice(0, args.batchSize);
    const tx = db.transaction((rows) => {
      const audit = db.prepare(`
        INSERT OR REPLACE INTO trigger_phrase_regeneration_audit (
          memory_id, prior_trigger_phrases, new_trigger_phrases, migration_version, checkpoint_id
        ) VALUES (?, ?, ?, ?, ?)
      `);
      const update = db.prepare(`
        UPDATE memory_index
        SET trigger_phrases = ?, updated_at = datetime('now')
        WHERE id = ?
      `);
      const upsertState = db.prepare(`
        INSERT INTO trigger_phrase_regeneration_state (migration_version, last_memory_id, checkpoint_id, updated_at)
        VALUES (?, ?, ?, datetime('now'))
        ON CONFLICT(migration_version) DO UPDATE SET
          last_memory_id = excluded.last_memory_id,
          checkpoint_id = excluded.checkpoint_id,
          updated_at = datetime('now')
      `);
      let updated = 0;
      for (const row of rows) {
        const existing = parsePhrases(row.trigger_phrases);
        const extracted = extractTriggersFromContent(String(row.content_text ?? ''), row.title ?? undefined);
        const merged = mergePhrases(existing, extracted);
        const serialized = JSON.stringify(merged);
        audit.run(row.id, row.trigger_phrases, serialized, MIGRATION_VERSION, args.checkpointId);
        updated += update.run(serialized, row.id).changes;
        upsertState.run(MIGRATION_VERSION, row.id, args.checkpointId);
      }
      return updated;
    });
    result.updated = tx(batch);
    result.remaining = Math.max(0, selected.length - selected.filter((row) => row.id <= (batch.at(-1)?.id ?? lastMemoryId)).length);
  }

  console.log(JSON.stringify(result, null, 2));
} finally {
  db.close();
}
