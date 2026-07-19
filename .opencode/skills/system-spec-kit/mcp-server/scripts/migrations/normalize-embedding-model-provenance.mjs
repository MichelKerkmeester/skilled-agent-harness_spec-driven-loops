#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import * as sqliteVec from 'sqlite-vec';

const MODEL_ALIASES = new Map([
  ['nomic-ai/nomic-embed-text-v1.5', 'nomic-embed-text-v1.5'],
]);

function usage() {
  return [
    'Usage: node scripts/migrations/normalize-embedding-model-provenance.mjs --db <sqlite-db> [--apply --checkpoint-id <id>]',
    'Default is dry-run count-only. Apply mode requires a checkpoint id and records before-values in embedding_model_backfill_audit.',
  ].join('\n');
}

function parseArgs(argv) {
  const args = { db: null, apply: false, checkpointId: null };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--db') args.db = argv[++i] ?? null;
    else if (arg === '--apply') args.apply = true;
    else if (arg === '--checkpoint-id') args.checkpointId = argv[++i] ?? null;
    else if (arg === '--help' || arg === '-h') {
      console.log(usage());
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!args.db) throw new Error('Missing required --db');
  if (args.apply && (!args.checkpointId || args.checkpointId.trim().length === 0)) {
    throw new Error('Apply mode requires --checkpoint-id');
  }
  return args;
}

function row(db, sql, params = []) {
  return db.prepare(sql).get(...params);
}

function count(db, sql, params = []) {
  return Number(row(db, sql, params)?.n ?? 0);
}

function tableExists(db, tableName) {
  const found = row(db, `
    SELECT 1 AS found
    FROM sqlite_master
    WHERE type IN ('table', 'view') AND name = ?
    LIMIT 1
  `, [tableName]);
  return found?.found === 1;
}

function normalizeModelName(value) {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  if (trimmed.length === 0) return null;
  return MODEL_ALIASES.get(trimmed) ?? trimmed;
}

function quoteIdentifier(identifier) {
  return `"${String(identifier).replace(/"/g, '""')}"`;
}

function tryLoadSqliteVec(db) {
  try {
    sqliteVec.load(db);
  } catch {
    // Plain table shards remain readable without the extension; vec0 tables use the rowids fallback below.
  }
}

function listCandidateShardPaths(dbPath) {
  const paths = new Set([path.resolve(dbPath)]);
  const vectorDir = path.join(path.dirname(path.resolve(dbPath)), 'vectors');
  try {
    for (const entry of fs.readdirSync(vectorDir)) {
      if (entry.endsWith('.sqlite')) {
        paths.add(path.join(vectorDir, entry));
      }
    }
  } catch {
    // Older single-file databases have no sibling vector shard directory.
  }
  return [...paths].filter((candidate) => fs.existsSync(candidate));
}

function readShardModel(db) {
  if (!tableExists(db, 'vec_metadata')) return null;
  const rows = db.prepare(`
    SELECT key, value
    FROM vec_metadata
    WHERE key IN ('model', 'active_embedder_name')
  `).all();
  const metadata = new Map(rows.map((entry) => [entry.key, entry.value]));
  return normalizeModelName(metadata.get('model') ?? metadata.get('active_embedder_name'));
}

function listVectorPayloadTables(db) {
  const rows = db.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type IN ('table', 'view')
      AND (name = 'vec_memories' OR name LIKE 'vec\\_%' ESCAPE '\\')
    ORDER BY name
  `).all();
  return rows
    .map((entry) => entry.name)
    .filter((name) => name !== 'vec_metadata' && !name.startsWith('vec_memories_'));
}

function addIdsFromVecMemoriesRowids(db, ids) {
  if (!tableExists(db, 'vec_memories_rowids')) return;
  try {
    const columns = db.prepare('PRAGMA table_info(vec_memories_rowids)').all().map((column) => column.name);
    const idColumn = columns.includes('memory_id') ? 'memory_id' : 'rowid';
    for (const rowId of db.prepare(`SELECT ${quoteIdentifier(idColumn)} AS id FROM vec_memories_rowids`).all()) {
      if (rowId.id != null) ids.add(Number(rowId.id));
    }
  } catch {
    // If the vec0 shadow shape is unknown, leave those rows unattributed instead of guessing.
  }
}

function readVectorRowIds(db, tableName, ids) {
  if (tableName === 'vec_memories') {
    try {
      for (const rowId of db.prepare('SELECT rowid AS id FROM vec_memories').all()) {
        if (rowId.id != null) ids.add(Number(rowId.id));
      }
    } catch {
      addIdsFromVecMemoriesRowids(db, ids);
    }
    return;
  }

  try {
    for (const rowId of db.prepare(`SELECT id FROM ${quoteIdentifier(tableName)}`).all()) {
      if (rowId.id != null) ids.add(Number(rowId.id));
    }
  } catch {
    // Unknown vector table shapes are ignored so ambiguous provenance stays unchanged.
  }
}

function readShardProvenance(shardPath) {
  const shard = new Database(shardPath, { readonly: true, fileMustExist: true });
  try {
    tryLoadSqliteVec(shard);
    const model = readShardModel(shard);
    if (!model) return null;
    const ids = new Set();
    for (const tableName of listVectorPayloadTables(shard)) {
      readVectorRowIds(shard, tableName, ids);
    }
    addIdsFromVecMemoriesRowids(shard, ids);
    return { path: shardPath, model, ids };
  } finally {
    shard.close();
  }
}

function resolveBackfillPlan(db, dbPath) {
  const emptyRows = db.prepare(`
    SELECT id
    FROM memory_index
    WHERE COALESCE(TRIM(embedding_model), '') = ''
      AND embedding_status = 'success'
    ORDER BY id
  `).all();
  const shards = listCandidateShardPaths(dbPath)
    .map((shardPath) => {
      try {
        return readShardProvenance(shardPath);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  const byModel = new Map();
  const unknown = [];
  const samplesByModel = new Map();
  for (const rowEntry of emptyRows) {
    const id = Number(rowEntry.id);
    const models = new Set(shards.filter((shard) => shard.ids.has(id)).map((shard) => shard.model));
    if (models.size !== 1) {
      unknown.push(id);
      continue;
    }
    const model = [...models][0];
    if (!byModel.has(model)) byModel.set(model, []);
    byModel.get(model).push(id);
    if (!samplesByModel.has(model)) samplesByModel.set(model, []);
    const samples = samplesByModel.get(model);
    if (samples.length < 10) samples.push(id);
  }

  return {
    byModel,
    unknown,
    shardsInspected: shards.map((shard) => ({ path: shard.path, model: shard.model, vectorRows: shard.ids.size })),
    samplesByModel,
  };
}

function main() {
  const args = parseArgs(process.argv);
  const db = new Database(args.db);
  tryLoadSqliteVec(db);
  try {
    const before = {
      empty: count(db, "SELECT COUNT(*) AS n FROM memory_index WHERE COALESCE(TRIM(embedding_model), '') = ''"),
      longNomic: count(db, "SELECT COUNT(*) AS n FROM memory_index WHERE embedding_model = 'nomic-ai/nomic-embed-text-v1.5'"),
      shortNomic: count(db, "SELECT COUNT(*) AS n FROM memory_index WHERE embedding_model = 'nomic-embed-text-v1.5'"),
      vectorCoveredEmpty: tableExists(db, 'vec_memories') ? count(db, `
        SELECT COUNT(*) AS n
        FROM memory_index m
        WHERE COALESCE(TRIM(m.embedding_model), '') = ''
          AND m.embedding_status = 'success'
          AND EXISTS (SELECT 1 FROM vec_memories v WHERE v.rowid = m.id)
      `) : 0,
    };

    const result = {
      script: 'normalize-embedding-model-provenance',
      mode: args.apply ? 'apply' : 'dry-run',
      checkpointId: args.checkpointId,
      before,
      shardsInspected: [],
      backfillCandidatesByModel: {},
      unknownProvenanceRows: 0,
      unknownProvenanceSampleIds: [],
      normalizedSpellings: 0,
      backfilledEmptyRows: 0,
    };

    const backfillPlan = resolveBackfillPlan(db, args.db);
    result.shardsInspected = backfillPlan.shardsInspected;
    result.unknownProvenanceRows = backfillPlan.unknown.length;
    result.unknownProvenanceSampleIds = backfillPlan.unknown.slice(0, 25);
    for (const [model, ids] of backfillPlan.byModel.entries()) {
      result.backfillCandidatesByModel[model] = {
        count: ids.length,
        sampleIds: backfillPlan.samplesByModel.get(model) ?? [],
      };
    }

    if (args.apply) {
      db.exec(`
        CREATE TABLE IF NOT EXISTS embedding_model_backfill_audit (
          memory_id INTEGER NOT NULL,
          previous_embedding_model TEXT,
          next_embedding_model TEXT NOT NULL,
          checkpoint_id TEXT NOT NULL,
          changed_at TEXT NOT NULL DEFAULT (datetime('now')),
          PRIMARY KEY (memory_id, checkpoint_id)
        )
      `);
      const tx = db.transaction(() => {
        db.prepare(`
          INSERT OR IGNORE INTO embedding_model_backfill_audit (memory_id, previous_embedding_model, next_embedding_model, checkpoint_id)
          SELECT id, embedding_model, 'nomic-embed-text-v1.5', ?
          FROM memory_index
          WHERE embedding_model = 'nomic-ai/nomic-embed-text-v1.5'
        `).run(args.checkpointId);
        result.normalizedSpellings = db.prepare(`
          UPDATE memory_index
          SET embedding_model = 'nomic-embed-text-v1.5', updated_at = datetime('now')
          WHERE embedding_model = 'nomic-ai/nomic-embed-text-v1.5'
        `).run().changes;
        const auditBackfill = db.prepare(`
          INSERT OR IGNORE INTO embedding_model_backfill_audit (memory_id, previous_embedding_model, next_embedding_model, checkpoint_id)
          SELECT id, embedding_model, ?, ?
          FROM memory_index
          WHERE id = ?
            AND COALESCE(TRIM(embedding_model), '') = ''
        `);
        const updateBackfill = db.prepare(`
          UPDATE memory_index
          SET embedding_model = ?, updated_at = datetime('now')
          WHERE id = ?
            AND COALESCE(TRIM(embedding_model), '') = ''
        `);
        for (const [model, ids] of backfillPlan.byModel.entries()) {
          for (const id of ids) {
            auditBackfill.run(model, args.checkpointId, id);
            result.backfilledEmptyRows += updateBackfill.run(model, id).changes;
          }
        }
      });
      tx();
    }

    result.after = {
      empty: count(db, "SELECT COUNT(*) AS n FROM memory_index WHERE COALESCE(TRIM(embedding_model), '') = ''"),
      longNomic: count(db, "SELECT COUNT(*) AS n FROM memory_index WHERE embedding_model = 'nomic-ai/nomic-embed-text-v1.5'"),
      shortNomic: count(db, "SELECT COUNT(*) AS n FROM memory_index WHERE embedding_model = 'nomic-embed-text-v1.5'"),
    };

    console.log(JSON.stringify(result, null, 2));
  } finally {
    db.close();
  }
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  console.error(usage());
  process.exit(1);
}
