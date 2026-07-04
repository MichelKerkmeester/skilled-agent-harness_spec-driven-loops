#!/usr/bin/env node
import Database from 'better-sqlite3';

function usage() {
  return [
    'Usage: node scripts/migrations/regenerate-placeholder-surrogate-titles.mjs --db <sqlite-db> [--apply --baseline-count <n> --checkpoint-name <name> --batch-size <n>]',
    'Default is dry-run count-only. Apply rewrites placeholder Memory NNNN surrogate questions with the stored document title.',
  ].join('\n');
}

function parseArgs(argv) {
  const args = { apply: false, baselineCount: null, checkpointName: null, db: null, batchSize: 500 };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--apply') args.apply = true;
    else if (arg === '--db') args.db = argv[++i] ?? null;
    else if (arg === '--baseline-count') args.baselineCount = Number.parseInt(argv[++i] ?? '', 10);
    else if (arg === '--checkpoint-name') args.checkpointName = argv[++i] ?? null;
    else if (arg === '--batch-size') args.batchSize = Number.parseInt(argv[++i] ?? '', 10);
    else if (arg === '--help' || arg === '-h') {
      console.log(usage());
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!args.db) throw new Error('Missing --db');
  if (!Number.isInteger(args.batchSize) || args.batchSize <= 0) throw new Error('--batch-size must be a positive integer');
  if (args.apply && (!Number.isInteger(args.baselineCount) || args.baselineCount < 0)) {
    throw new Error('Apply mode requires --baseline-count <n>');
  }
  if (args.apply && (!args.checkpointName || args.checkpointName.trim().length === 0)) {
    throw new Error('Apply mode requires --checkpoint-name <name>');
  }
  return args;
}

function candidateWhere() {
  return `ms.questions_json GLOB '*Memory [0-9]*'
    AND mi.title IS NOT NULL
    AND TRIM(mi.title) != ''
    AND mi.title NOT GLOB 'Memory [0-9]*'`;
}

function countCandidates(db) {
  const row = db.prepare(`
    SELECT COUNT(*) AS count
    FROM memory_surrogates ms
    JOIN memory_index mi ON mi.id = ms.memory_id
    WHERE ${candidateWhere()}
  `).get();
  return row?.count ?? 0;
}

function loadBatch(db, limit) {
  return db.prepare(`
    SELECT ms.memory_id, ms.questions_json, mi.title
    FROM memory_surrogates ms
    JOIN memory_index mi ON mi.id = ms.memory_id
    WHERE ${candidateWhere()}
    ORDER BY ms.memory_id ASC
    LIMIT ?
  `).all(limit);
}

function rewriteQuestions(questionsJson, title) {
  const questions = JSON.parse(questionsJson);
  if (!Array.isArray(questions)) return questionsJson;
  const cleanTitle = String(title).trim().toLowerCase();
  return JSON.stringify(questions.map((question) => (
    typeof question === 'string'
      ? question.replace(/memory \d+/gi, cleanTitle)
      : question
  )));
}

const args = parseArgs(process.argv);
const db = new Database(args.db);
try {
  const candidateRows = countCandidates(db);
  const result = {
    script: 'regenerate-placeholder-surrogate-titles',
    mode: args.apply ? 'apply' : 'dry-run',
    checkpointName: args.checkpointName,
    candidateRows,
    batchSize: args.batchSize,
    updated: 0,
  };

  if (args.apply) {
    if (candidateRows !== args.baselineCount) {
      throw new Error(`Refusing apply: candidateRows ${candidateRows} does not match baseline ${args.baselineCount}`);
    }
    const update = db.prepare(`
      UPDATE memory_surrogates
      SET questions_json = ?, generated_at = ?
      WHERE memory_id = ?
    `);
    const applyBatch = db.transaction((rows) => {
      let updated = 0;
      const generatedAt = Date.now();
      for (const row of rows) {
        updated += update.run(rewriteQuestions(row.questions_json, row.title), generatedAt, row.memory_id).changes;
      }
      return updated;
    });

    while (true) {
      const rows = loadBatch(db, args.batchSize);
      if (rows.length === 0) break;
      result.updated += applyBatch(rows);
    }
  }

  console.log(JSON.stringify(result, null, 2));
} finally {
  db.close();
}
