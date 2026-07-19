#!/usr/bin/env node
import Database from 'better-sqlite3';

const TARGET_STRENGTH = 0.05;
const LEGACY_STRENGTH = 0.7;

function usage() {
  return [
    'Usage: node scripts/migrations/downweight-entity-linker-supports.mjs --db <sqlite-db> [--apply|--rollback --baseline-count <n> --checkpoint-name <name>]',
    'Default is dry-run count-only. Apply down-weights entity_linker supports edges in place; rollback restores the legacy strength.',
  ].join('\n');
}

function parseArgs(argv) {
  const args = { apply: false, rollback: false, baselineCount: null, checkpointName: null, db: null };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--apply') args.apply = true;
    else if (arg === '--rollback') args.rollback = true;
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
  if (args.apply && args.rollback) throw new Error('Choose only one of --apply or --rollback');
  if ((args.apply || args.rollback) && (!Number.isInteger(args.baselineCount) || args.baselineCount < 0)) {
    throw new Error('Apply and rollback modes require --baseline-count <n>');
  }
  if ((args.apply || args.rollback) && (!args.checkpointName || args.checkpointName.trim().length === 0)) {
    throw new Error('Apply and rollback modes require --checkpoint-name <name>');
  }
  return args;
}

function targetWhere(strength) {
  return `created_by = 'entity_linker'
    AND relation = 'supports'
    AND ABS(COALESCE(strength, -1) - ${strength}) < 0.000001`;
}

function countRows(db, strength) {
  const row = db.prepare(`
    SELECT COUNT(*) AS count
    FROM causal_edges
    WHERE ${targetWhere(strength)}
  `).get();
  return row?.count ?? 0;
}

const args = parseArgs(process.argv);
const db = new Database(args.db);
try {
  const legacyRows = countRows(db, LEGACY_STRENGTH);
  const downWeightedRows = countRows(db, TARGET_STRENGTH);
  const result = {
    script: 'downweight-entity-linker-supports',
    mode: args.rollback ? 'rollback' : (args.apply ? 'apply' : 'dry-run'),
    checkpointName: args.checkpointName,
    targetStrength: TARGET_STRENGTH,
    legacyStrength: LEGACY_STRENGTH,
    candidateRows: args.rollback ? downWeightedRows : legacyRows,
    legacyRows,
    downWeightedRows,
    updated: 0,
  };

  if (args.apply) {
    if (legacyRows !== args.baselineCount) {
      throw new Error(`Refusing apply: candidateRows ${legacyRows} does not match baseline ${args.baselineCount}`);
    }
    result.updated = db.transaction(() => db.prepare(`
      UPDATE causal_edges
      SET strength = ?
      WHERE ${targetWhere(LEGACY_STRENGTH)}
    `).run(TARGET_STRENGTH).changes)();
  } else if (args.rollback) {
    if (downWeightedRows !== args.baselineCount) {
      throw new Error(`Refusing rollback: candidateRows ${downWeightedRows} does not match baseline ${args.baselineCount}`);
    }
    result.updated = db.transaction(() => db.prepare(`
      UPDATE causal_edges
      SET strength = ?
      WHERE ${targetWhere(TARGET_STRENGTH)}
    `).run(LEGACY_STRENGTH).changes)();
  }

  console.log(JSON.stringify(result, null, 2));
} finally {
  db.close();
}
