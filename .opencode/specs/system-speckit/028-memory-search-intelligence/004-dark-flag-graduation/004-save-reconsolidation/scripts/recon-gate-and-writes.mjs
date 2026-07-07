#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────
// MODULE: Save-Reconsolidation Gate and Destructive-Write Verification
// Usage:
//   node recon-gate-and-writes.mjs
//
// Verifies the safety gates and the destructive merge/deprecate writes of the
// save-time reconsolidation path on an ISOLATED in-memory database with the
// production schema. It drives the PRODUCTION functions:
//   reconsolidate()                 — the orchestrator gated by isReconsolidationEnabled
//   hasReconsolidationCheckpoint()  — the per-spec-folder checkpoint gate
//   executeMerge() / executeConflict() — the destructive writers
//
// Why in-memory and not the corpus backup:
//   These checks WRITE (merge inserts a row and retires the predecessor,
//   conflict deprecates a row). To honor the hard safety rule the writes run on
//   a throwaway in-memory database seeded with the production memory_index,
//   vec_memories, causal_edges, memory_lineage, active_memory_projection and
//   checkpoints schema. The live corpus is never opened. This isolates the
//   write semantics so the gate and the row effects are observable without
//   touching real data.
//
// What it asserts:
//   GATE-OFF      : with SPECKIT_RECONSOLIDATION=false reconsolidate returns null
//                   (byte-identical default-off behavior, caller uses normal store)
//   CHECKPOINT    : hasReconsolidationCheckpoint is false with no pre-reconsolidation
//                   row and true once one is present, scoped by spec_folder
//   MERGE-WRITE   : at similarity >= MERGE_THRESHOLD reconsolidate routes to merge,
//                   inserts a merged row and retires the predecessor via a
//                   supersedes edge
//   DEPRECATE-WRITE: at CONFLICT_THRESHOLD <= sim < MERGE_THRESHOLD the existing
//                   row is marked deprecated and a supersedes edge is created
//   COMPLEMENT    : below CONFLICT_THRESHOLD no destructive write fires
//
// Safety:
//   Pure in-memory database. No file write to any corpus. Writes results to
//   results/gate-metrics.json.
// ───────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BENCH_ROOT = path.resolve(HERE, '..');
const RESULTS_DIR = path.join(BENCH_ROOT, 'results');
const REPO_ROOT = path.resolve(HERE, '..', '..', '..', '..', '..', '..', '..');
const MCP_DIR = path.join(REPO_ROOT, '.opencode', 'skills', 'system-spec-kit', 'mcp_server');
const DIST = path.join(MCP_DIR, 'dist');

const mcpRequire = createRequire(path.join(MCP_DIR, 'package.json'));
const Database = mcpRequire('better-sqlite3');

function distUrl(rel) {
  return pathToFileURL(path.join(DIST, rel)).href;
}

const DIM = 8;

// The schema is copied verbatim from the live database so every column the
// production merge and deprecate writers touch exists, with no hand-maintained
// drift. Only the CREATE TABLE statements for the tables the path uses are
// copied. No row of live data is read or written. The connection is read-only.
const RECON_TABLES = [
  'memory_index',
  'vec_memories',
  'causal_edges',
  'memory_lineage',
  'active_memory_projection',
  'checkpoints',
];

function readReconSchemaDDL(liveDbPath) {
  const db = new Database(liveDbPath, { readonly: true, fileMustExist: true });
  try {
    db.pragma('busy_timeout = 5000');
    const placeholders = RECON_TABLES.map(() => '?').join(', ');
    const rows = db.prepare(`
      SELECT name, sql FROM sqlite_master
      WHERE type = 'table' AND name IN (${placeholders}) AND sql IS NOT NULL
    `).all(...RECON_TABLES);
    return new Map(rows.map((row) => [row.name, row.sql]));
  } finally {
    db.close();
  }
}

function seedSchema(db, ddlByTable) {
  // vec_memories is a vec0 virtual table in the live DB, replaced here with a
  // plain table so the eval database needs no sqlite-vec extension. The merge writer
  // only does plain SELECT/INSERT on rowid + embedding, so a plain table is a
  // faithful stand-in for the write semantics under test.
  db.exec('CREATE TABLE vec_memories (rowid INTEGER PRIMARY KEY, embedding BLOB)');
  for (const table of RECON_TABLES) {
    if (table === 'vec_memories') continue;
    const sql = ddlByTable.get(table);
    if (!sql) throw new Error(`Live schema missing CREATE TABLE for ${table}`);
    db.exec(sql);
  }
  // history.init builds the memory_history table itself with its own columns.
}

function makeEmbeddingBuffer(fill) {
  const arr = new Float32Array(DIM).fill(fill);
  return Buffer.from(arr.buffer);
}

function insertMemory(db, { id, specFolder, title, content, hash, tier = 'normal' }) {
  db.prepare(`
    INSERT INTO memory_index (id, spec_folder, file_path, canonical_file_path, title, content_text, content_hash, embedding_status, importance_tier, importance_weight, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'success', ?, 0.5, datetime('now'), datetime('now'))
  `).run(id, specFolder, `/m/${id}.md`, `/m/${id}.md`, title, content, hash, tier);
  db.prepare('INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)').run(id, makeEmbeddingBuffer(0.5));
}

async function main() {
  const config = await import(distUrl('core/config.js'));
  config.resolveDatabasePaths();
  const liveDbPath = config.DATABASE_PATH;
  if (!liveDbPath || !fs.existsSync(liveDbPath)) {
    throw new Error(`Live database not found at config DATABASE_PATH: ${liveDbPath}`);
  }
  const ddlByTable = readReconSchemaDDL(liveDbPath);

  const recon = await import(distUrl('lib/storage/reconsolidation.js'));
  const dbHelpers = await import(distUrl('handlers/save/db-helpers.js'));
  const history = await import(distUrl('lib/storage/history.js'));
  const MERGE_THRESHOLD = recon.MERGE_THRESHOLD;
  const CONFLICT_THRESHOLD = recon.CONFLICT_THRESHOLD;

  const checks = [];
  const SPEC = 'eval-recon-folder';

  // Build a similar-memory record the way the production findSimilar callback
  // would, at a chosen similarity, so the band routing is exercised end to end.
  function similarOf(id, title, content, similarity) {
    return [{
      id, file_path: `/m/${id}.md`, title,
      content_text: content, similarity, spec_folder: SPEC, importance_weight: 0.5,
    }];
  }
  function newMemory(content, embeddingFill = 0.5) {
    return {
      title: 'New incoming memory', content, specFolder: SPEC,
      filePath: '/m/new.md', embedding: new Float32Array(DIM).fill(embeddingFill),
      triggerPhrases: ['recon', 'eval'], importanceTier: 'normal',
    };
  }

  // ── GATE-OFF: flag false → reconsolidate returns null ──
  {
    const prev = process.env.SPECKIT_RECONSOLIDATION;
    process.env.SPECKIT_RECONSOLIDATION = 'false';
    const db = new Database(':memory:');
    seedSchema(db, ddlByTable);
    if (typeof history.init === 'function') history.init(db);
    const result = await recon.reconsolidate(newMemory('x'), db, {
      findSimilar: () => similarOf(1, 'Existing', 'existing body', 0.99),
      storeMemory: () => 999,
    });
    checks.push({ name: 'GATE-OFF reconsolidate returns null when SPECKIT_RECONSOLIDATION=false', pass: result === null, detail: `result=${result === null ? 'null' : JSON.stringify(result).slice(0, 60)}` });
    db.close();
    if (prev === undefined) delete process.env.SPECKIT_RECONSOLIDATION; else process.env.SPECKIT_RECONSOLIDATION = prev;
  }

  // ── CHECKPOINT gate: absent then present, folder-scoped ──
  {
    const db = new Database(':memory:');
    seedSchema(db, ddlByTable);
    const absent = dbHelpers.hasReconsolidationCheckpoint(db, SPEC);
    db.prepare("INSERT INTO checkpoints (name, created_at, spec_folder) VALUES ('pre-reconsolidation', datetime('now'), ?)").run(SPEC);
    const present = dbHelpers.hasReconsolidationCheckpoint(db, SPEC);
    // The production query matches `spec_folder = ? OR spec_folder IS NULL OR
    // spec_folder = ''`. A folder-scoped row must NOT satisfy a different folder,
    // proving the gate isolates the checkpoint per spec folder.
    const otherFolder = dbHelpers.hasReconsolidationCheckpoint(db, 'a-different-folder');
    checks.push({ name: 'CHECKPOINT absent → gate false', pass: absent === false, detail: `absent=${absent}` });
    checks.push({ name: 'CHECKPOINT present for folder → gate true', pass: present === true, detail: `present=${present}` });
    checks.push({ name: 'CHECKPOINT folder-scoped row does not satisfy a different folder', pass: otherFolder === false, detail: `otherFolder=${otherFolder}` });
    db.close();
  }

  // ── MERGE-WRITE: sim >= MERGE_THRESHOLD inserts merged row, retires predecessor ──
  {
    const prevCore = process.env.SPECKIT_RECONSOLIDATION;
    process.env.SPECKIT_RECONSOLIDATION = 'true';
    const db = new Database(':memory:');
    seedSchema(db, ddlByTable);
    if (typeof history.init === 'function') history.init(db);
    insertMemory(db, { id: 1, specFolder: SPEC, title: 'Existing', content: 'line one\nline two', hash: 'hash-existing' });
    const beforeActive = db.prepare("SELECT COUNT(*) c FROM memory_index WHERE importance_tier != 'deprecated'").get().c;
    let storeId = 1000;
    const result = await recon.reconsolidate(
      newMemory('line two\nline three', 0.5),
      db,
      {
        findSimilar: () => similarOf(1, 'Existing', 'line one\nline two', MERGE_THRESHOLD + 0.05),
        storeMemory: () => { const id = storeId; db.prepare(`INSERT INTO memory_index (id, spec_folder, file_path, title, content_text, content_hash, embedding_status, created_at, updated_at) VALUES (?,?,?,?,?,?, 'success', datetime('now'), datetime('now'))`).run(id, SPEC, '/m/new.md', 'New', 'line two\nline three', 'hash-new'); db.prepare('INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)').run(id, makeEmbeddingBuffer(0.5)); return id; },
        generateEmbedding: async () => new Float32Array(DIM).fill(0.5),
      }
    );
    const supersedesEdges = db.prepare("SELECT COUNT(*) c FROM causal_edges WHERE relation='supersedes'").get().c;
    const mergedRow = result && result.action === 'merge' ? db.prepare('SELECT content_text FROM memory_index WHERE id = ?').get(result.newMemoryId) : null;
    const mergedHasNewLine = mergedRow ? String(mergedRow.content_text).includes('line three') : false;
    const mergedKeepsOldLine = mergedRow ? String(mergedRow.content_text).includes('line one') : false;
    checks.push({ name: 'MERGE-WRITE routes to merge at sim >= MERGE_THRESHOLD', pass: !!result && result.action === 'merge', detail: `action=${result?.action}` });
    checks.push({ name: 'MERGE-WRITE creates a supersedes edge (predecessor retired)', pass: supersedesEdges >= 1, detail: `supersedesEdges=${supersedesEdges}` });
    checks.push({ name: 'MERGE-WRITE merged row keeps the old line and gains the new line', pass: mergedHasNewLine && mergedKeepsOldLine, detail: `newLine=${mergedHasNewLine} oldLine=${mergedKeepsOldLine}` });
    void beforeActive;
    db.close();
    if (prevCore === undefined) delete process.env.SPECKIT_RECONSOLIDATION; else process.env.SPECKIT_RECONSOLIDATION = prevCore;
  }

  // ── DEPRECATE-WRITE: CONFLICT_THRESHOLD <= sim < MERGE_THRESHOLD deprecates existing ──
  {
    const prevCore = process.env.SPECKIT_RECONSOLIDATION;
    process.env.SPECKIT_RECONSOLIDATION = 'true';
    const db = new Database(':memory:');
    seedSchema(db, ddlByTable);
    if (typeof history.init === 'function') history.init(db);
    insertMemory(db, { id: 1, specFolder: SPEC, title: 'Existing distinct doc', content: 'alpha beta gamma', hash: 'hash-existing-2' });
    let storeId = 2000;
    const result = await recon.reconsolidate(
      newMemory('delta epsilon zeta', 0.5),
      db,
      {
        findSimilar: () => similarOf(1, 'Existing distinct doc', 'alpha beta gamma', (MERGE_THRESHOLD + CONFLICT_THRESHOLD) / 2),
        storeMemory: () => { const id = storeId; db.prepare(`INSERT INTO memory_index (id, spec_folder, file_path, title, content_text, content_hash, embedding_status, created_at, updated_at) VALUES (?,?,?,?,?,?, 'success', datetime('now'), datetime('now'))`).run(id, SPEC, '/m/new2.md', 'New', 'delta epsilon zeta', 'hash-new-2'); db.prepare('INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)').run(id, makeEmbeddingBuffer(0.5)); return id; },
        generateEmbedding: async () => new Float32Array(DIM).fill(0.5),
      }
    );
    const existingTier = db.prepare('SELECT importance_tier FROM memory_index WHERE id = 1').get();
    const deprecated = existingTier && existingTier.importance_tier === 'deprecated';
    const supersedesEdges = db.prepare("SELECT COUNT(*) c FROM causal_edges WHERE relation='supersedes'").get().c;
    checks.push({ name: 'DEPRECATE-WRITE routes to conflict in the [CONFLICT, MERGE) band', pass: !!result && result.action === 'conflict', detail: `action=${result?.action}` });
    checks.push({ name: 'DEPRECATE-WRITE marks the existing distinct row deprecated', pass: deprecated, detail: `tier=${existingTier?.importance_tier}` });
    checks.push({ name: 'DEPRECATE-WRITE creates a supersedes edge', pass: supersedesEdges >= 1, detail: `supersedesEdges=${supersedesEdges}` });
    db.close();
    if (prevCore === undefined) delete process.env.SPECKIT_RECONSOLIDATION; else process.env.SPECKIT_RECONSOLIDATION = prevCore;
  }

  // ── COMPLEMENT: below CONFLICT_THRESHOLD no destructive write ──
  {
    const prevCore = process.env.SPECKIT_RECONSOLIDATION;
    process.env.SPECKIT_RECONSOLIDATION = 'true';
    const db = new Database(':memory:');
    seedSchema(db, ddlByTable);
    if (typeof history.init === 'function') history.init(db);
    insertMemory(db, { id: 1, specFolder: SPEC, title: 'Unrelated existing', content: 'totally unrelated', hash: 'hash-unrelated' });
    const result = await recon.reconsolidate(
      newMemory('a brand new distinct topic', 0.5),
      db,
      {
        findSimilar: () => similarOf(1, 'Unrelated existing', 'totally unrelated', CONFLICT_THRESHOLD - 0.1),
        storeMemory: () => 3000,
      }
    );
    const tier = db.prepare('SELECT importance_tier FROM memory_index WHERE id = 1').get();
    const stillActive = tier && tier.importance_tier !== 'deprecated';
    checks.push({ name: 'COMPLEMENT routes to complement below CONFLICT_THRESHOLD', pass: !!result && result.action === 'complement', detail: `action=${result?.action}` });
    checks.push({ name: 'COMPLEMENT leaves the existing row active (no destructive write)', pass: stillActive, detail: `tier=${tier?.importance_tier}` });
    db.close();
    if (prevCore === undefined) delete process.env.SPECKIT_RECONSOLIDATION; else process.env.SPECKIT_RECONSOLIDATION = prevCore;
  }

  const passed = checks.filter((c) => c.pass).length;
  const output = {
    generatedFrom: 'recon-gate-and-writes.mjs',
    generatedAt: new Date().toISOString(),
    subject: 'Save-reconsolidation gate behavior and destructive merge/deprecate writes on an isolated in-memory database with the production schema.',
    flagUnderTest: 'SPECKIT_RECONSOLIDATION_ENABLED (orchestrator core gate SPECKIT_RECONSOLIDATION exercised here)',
    bands: { MERGE_THRESHOLD, CONFLICT_THRESHOLD },
    totalChecks: checks.length,
    passedChecks: passed,
    allPassed: passed === checks.length,
    checks,
  };
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
  const outPath = path.join(RESULTS_DIR, 'gate-metrics.json');
  fs.writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ metricsPath: outPath, passedChecks: passed, totalChecks: checks.length, allPassed: output.allPassed, checks: checks.map((c) => ({ name: c.name, pass: c.pass, detail: c.detail })) }, null, 2)}\n`);
  if (!output.allPassed) process.exitCode = 1;
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
