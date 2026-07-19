#!/usr/bin/env node
import { createHash } from 'node:crypto';
import Database from 'better-sqlite3';

const DEFAULT_RULE_VERSION = 'causal-edge:v1';

function usage() {
  return [
    'Usage: node scripts/migrations/backfill-derived-causal-edge-ids.mjs --db <sqlite-db> [--apply --baseline-count <n> --checkpoint-name <name>]',
    'Default is dry-run count-only. Apply fills derived_id only for generated rows where derived_id is NULL.',
  ].join('\n');
}

function parseArgs(argv) {
  const args = { apply: false, baselineCount: null, checkpointName: null, db: null };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--apply') args.apply = true;
    else if (arg === '--db') args.db = argv[++i] ?? null;
    else if (arg === '--baseline-count') args.baselineCount = Number.parseInt(argv[++i] ?? '', 10);
    else if (arg === '--checkpoint-name') args.checkpointName = argv[++i] ?? null;
    else if (arg === '--help' || arg === '-h') {
      console.log(usage());
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!args.db) throw new Error('Missing --db');
  if (args.apply && (!Number.isInteger(args.baselineCount) || args.baselineCount < 0)) {
    throw new Error('Apply mode requires --baseline-count <n>');
  }
  if (args.apply && (!args.checkpointName || args.checkpointName.trim().length === 0)) {
    throw new Error('Apply mode requires --checkpoint-name <name>');
  }
  return args;
}

function tableColumns(db, tableName) {
  return new Set(db.prepare(`PRAGMA table_info(${tableName})`).all().map((row) => row.name).filter(Boolean));
}

function optionalColumn(columns, columnName) {
  return columns.has(columnName) ? columnName : `NULL AS ${columnName}`;
}

function normalizeField(value, fallback) {
  if (value === null || value === undefined) return fallback;
  const normalized = String(value).trim();
  return normalized.length > 0 ? normalized : fallback;
}

function normalizeAnchor(value) {
  return value === null || value === undefined ? '' : String(value);
}

function edgeSource(row) {
  const extractionMethod = normalizeField(row.extraction_method, '');
  const createdBy = normalizeField(row.created_by, '');
  if (extractionMethod.length > 0 && extractionMethod !== 'manual') return extractionMethod;
  return createdBy.length > 0 ? createdBy : 'auto';
}

function deriveId(row) {
  const identity = {
    kind: 'causal-edge',
    source_id: normalizeField(row.source_id, ''),
    target_id: normalizeField(row.target_id, ''),
    relation: normalizeField(row.relation, ''),
    source_anchor: normalizeAnchor(row.source_anchor),
    target_anchor: normalizeAnchor(row.target_anchor),
    source: edgeSource(row),
    rule_version: DEFAULT_RULE_VERSION,
  };
  return createHash('sha256').update(JSON.stringify(identity), 'utf-8').digest('hex');
}

function selectRows(db) {
  const columns = tableColumns(db, 'causal_edges');
  return db.prepare(`
    SELECT id, source_id, target_id,
           ${optionalColumn(columns, 'source_anchor')},
           ${optionalColumn(columns, 'target_anchor')},
           relation, created_by,
           ${optionalColumn(columns, 'extraction_method')}
    FROM causal_edges
    WHERE derived_id IS NULL
      AND (created_by = 'auto' OR created_by LIKE 'auto-%')
    ORDER BY id ASC
  `).all();
}

function existingIds(db) {
  return new Set(db.prepare(`
    SELECT derived_id
    FROM causal_edges
    WHERE derived_id IS NOT NULL AND TRIM(derived_id) != ''
  `).all().map((row) => row.derived_id));
}

const args = parseArgs(process.argv);
const db = new Database(args.db);
try {
  const rows = selectRows(db);
  const result = {
    script: 'backfill-derived-causal-edge-ids',
    mode: args.apply ? 'apply' : 'dry-run',
    checkpointName: args.checkpointName,
    candidateRows: rows.length,
    backfilled: 0,
    duplicatesSkipped: 0,
  };

  if (args.apply) {
    if (rows.length !== args.baselineCount) {
      throw new Error(`Refusing apply: candidateRows ${rows.length} does not match baseline ${args.baselineCount}`);
    }
    const seen = existingIds(db);
    const update = db.prepare('UPDATE causal_edges SET derived_id = ? WHERE id = ? AND derived_id IS NULL');
    db.transaction(() => {
      for (const row of rows) {
        const derivedId = deriveId(row);
        if (seen.has(derivedId)) {
          result.duplicatesSkipped++;
          continue;
        }
        const changes = update.run(derivedId, row.id).changes;
        if (changes > 0) {
          seen.add(derivedId);
          result.backfilled += changes;
        }
      }
    })();
  }

  console.log(JSON.stringify(result, null, 2));
} finally {
  db.close();
}
