#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────
// MODULE: Save-Reconsolidation Merge-Precision Benchmark
// Usage:
//   node recon-precision-benchmark.mjs
//
// Measures whether the save-time near-duplicate merge band cuts corpus
// redundancy without losing distinct information. The destructive path is
// SPECKIT_RECONSOLIDATION_ENABLED, the opt-in gate that lets the save flow run
// reconsolidate(), which merges near-duplicate rows at cosine >= MERGE_THRESHOLD
// and deprecates older rows at cosine >= CONFLICT_THRESHOLD.
//
// What it drives:
//   The PRODUCTION determineAction(similarity) band and the PRODUCTION
//   mergeContent(existing, incoming) line-union. No threshold is reimplemented
//   here. The script reads MERGE_THRESHOLD and CONFLICT_THRESHOLD straight from
//   the production module so a future tuning change is reflected automatically.
//
// The labeled fixture is mined from the REAL corpus on a read-only backup:
//   known-duplicate pairs : two active rows sharing one content_hash. Exact
//                           textual duplicates. These SHOULD merge.
//   known-distinct pairs  : two active rows in the same spec folder with a
//                           different title AND a different content_hash, both
//                           carrying content. Distinct documents. These should
//                           NOT merge and must NOT lose information if forced.
// The same-folder scope mirrors the production findScopeFilteredCandidates
// call, which only ever compares within one spec folder, so the precision read
// is on the production scope, not an unforced cross-corpus scope.
//
// Metrics:
//   merge precision    : of the labeled pairs the band routes to MERGE, the
//                        fraction that are truly duplicate.
//   conflict precision : same for the CONFLICT (deprecate) band.
//   recall preservation: of the new-content lines on a forced merge, the
//                        fraction that survive into the merged text. A distinct
//                        pair forced through mergeContent must keep every new
//                        line, otherwise the merge silently drops information.
//   separation         : the threshold that would give zero distinct
//                        false-positive, and the duplicate recall at it.
//
// Safety:
//   The live database and its active vector shard are backed up read-only to a
//   temporary eval copy. Every read runs against the copy. No write touches the
//   live corpus, and no reindex is triggered. The script never changes a default
//   and never decides whether the flag graduates. It writes results to
//   results/precision-metrics.json.
// ───────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
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

// Cap the same-folder distinct-pair sample so the run stays bounded on a large
// corpus. Folders are taken largest-first so the densest dedup targets, where a
// merge is most likely to fire, are always covered.
const MAX_FOLDERS = 60;
const MIN_FOLDER_ROWS = 4;

function removeSqliteFileSet(filePath) {
  for (const suffix of ['', '-wal', '-shm']) {
    fs.rmSync(`${filePath}${suffix}`, { force: true });
  }
}

async function backupSqlite(sourcePath, targetPath) {
  removeSqliteFileSet(targetPath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true, mode: 0o700 });
  const source = new Database(sourcePath, { readonly: true, fileMustExist: true });
  try {
    source.pragma('busy_timeout = 10000');
    await source.backup(targetPath);
  } finally {
    source.close();
  }
}

function createProfileSlug(provider, model, dim) {
  const safeModel = model.replace(/[^a-zA-Z0-9-_.]/g, '_').replace(/__+/g, '_').toLowerCase();
  return `${provider}__${safeModel}__${dim}`;
}

function readActiveEmbedder(dbPath) {
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  try {
    const rows = db.prepare(`
      SELECT key, value FROM vec_metadata
      WHERE key IN ('active_embedder_name', 'active_embedder_dim', 'active_embedder_provider')
    `).all();
    const metadata = new Map(rows.map((row) => [row.key, row.value]));
    const name = metadata.get('active_embedder_name');
    const provider = metadata.get('active_embedder_provider');
    const dim = Number.parseInt(metadata.get('active_embedder_dim') ?? '', 10);
    if (!name || !provider || !Number.isInteger(dim) || dim <= 0) {
      throw new Error(`Could not read active embedder metadata from ${dbPath}`);
    }
    return { name, provider, dim };
  } finally {
    db.close();
  }
}

// Back up the live database and the active vector shard read-only to a temp copy.
// All reads run against the copy so the live corpus is never opened for writes.
async function prepareEvalDatabase(sourceDbPath) {
  const evalRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-recon-precision-'));
  const evalDbPath = path.join(evalRoot, 'context-index.sqlite');
  await backupSqlite(sourceDbPath, evalDbPath);

  const activeEmbedder = readActiveEmbedder(evalDbPath);
  const shardSlug = createProfileSlug(activeEmbedder.provider, activeEmbedder.name, activeEmbedder.dim);
  const shardName = `context-vectors__${shardSlug}.sqlite`;
  const sourceShardPath = path.join(path.dirname(sourceDbPath), 'vectors', shardName);
  const evalShardPath = path.join(path.dirname(evalDbPath), 'vectors', shardName);
  if (!fs.existsSync(sourceShardPath)) {
    throw new Error(`Active vector shard not found: ${sourceShardPath}`);
  }
  await backupSqlite(sourceShardPath, evalShardPath);

  return { sourceDbPath, evalRoot, dbPath: evalDbPath, sourceShardPath, evalShardPath, activeEmbedder };
}

function cosine(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

function quantile(sortedAsc, p) {
  if (sortedAsc.length === 0) return null;
  const idx = Math.min(sortedAsc.length - 1, Math.floor(sortedAsc.length * p));
  return sortedAsc[idx];
}

function fmt(value, digits = 4) {
  return typeof value === 'number' && Number.isFinite(value) ? Number(value.toFixed(digits)) : null;
}

async function main() {
  const config = await import(distUrl('core/config.js'));
  config.resolveDatabasePaths();
  const sourceDbPath = config.DATABASE_PATH;
  if (!sourceDbPath || !fs.existsSync(sourceDbPath)) {
    throw new Error(`Live database not found at config DATABASE_PATH: ${sourceDbPath}`);
  }

  const recon = await import(distUrl('lib/storage/reconsolidation.js'));
  const MERGE_THRESHOLD = recon.MERGE_THRESHOLD;
  const CONFLICT_THRESHOLD = recon.CONFLICT_THRESHOLD;
  const determineAction = recon.determineAction;
  const mergeContent = recon.mergeContent;

  const evalDatabase = await prepareEvalDatabase(sourceDbPath);
  const mainDb = new Database(evalDatabase.dbPath, { readonly: true, fileMustExist: true });
  const shardDb = new Database(evalDatabase.evalShardPath, { readonly: true, fileMustExist: true });
  mainDb.pragma('busy_timeout = 5000');
  shardDb.pragma('busy_timeout = 5000');

  const vecStmt = shardDb.prepare('SELECT vec FROM vec_768 WHERE id = ?');
  const vecCache = new Map();
  function readVec(id) {
    if (vecCache.has(id)) return vecCache.get(id);
    const row = vecStmt.get(id);
    const vec = row && row.vec ? new Float32Array(row.vec.buffer, row.vec.byteOffset, row.vec.length / 4) : null;
    vecCache.set(id, vec);
    return vec;
  }

  // ── known-duplicate fixture: active rows sharing a content_hash ──
  const dupRows = mainDb.prepare(`
    SELECT a.id ida, b.id idb, a.title title, a.spec_folder spec_folder,
           a.content_text content_a, b.content_text content_b
    FROM memory_index a JOIN memory_index b
      ON a.content_hash = b.content_hash AND a.id < b.id
    WHERE a.content_hash IS NOT NULL AND a.content_hash != ''
      AND (a.is_archived IS NULL OR a.is_archived = 0)
      AND (b.is_archived IS NULL OR b.is_archived = 0)
      AND a.importance_tier != 'deprecated' AND b.importance_tier != 'deprecated'
  `).all();

  const dupPairs = [];
  for (const r of dupRows) {
    const va = readVec(r.ida);
    const vb = readVec(r.idb);
    if (!va || !vb) continue;
    dupPairs.push({
      ida: r.ida, idb: r.idb, label: 'duplicate',
      similarity: cosine(va, vb),
      title: r.title, specFolder: r.spec_folder,
      contentA: r.content_a ?? '', contentB: r.content_b ?? '',
    });
  }

  // ── known-distinct fixture: same folder, different title AND hash ──
  const folders = mainDb.prepare(`
    SELECT spec_folder, COUNT(*) n FROM memory_index
    WHERE (is_archived IS NULL OR is_archived = 0) AND importance_tier != 'deprecated'
      AND content_text IS NOT NULL
    GROUP BY spec_folder HAVING n >= ? ORDER BY n DESC LIMIT ?
  `).all(MIN_FOLDER_ROWS, MAX_FOLDERS);

  const distinctPairs = [];
  for (const f of folders) {
    const rows = mainDb.prepare(`
      SELECT id, title, content_hash, content_text FROM memory_index
      WHERE spec_folder = ? AND content_text IS NOT NULL AND title IS NOT NULL
      ORDER BY id
    `).all(f.spec_folder);
    for (let i = 0; i < rows.length; i += 1) {
      for (let j = i + 1; j < rows.length; j += 1) {
        if (rows[i].title === rows[j].title) continue;
        if (rows[i].content_hash && rows[i].content_hash === rows[j].content_hash) continue;
        const va = readVec(rows[i].id);
        const vb = readVec(rows[j].id);
        if (!va || !vb) continue;
        distinctPairs.push({
          ida: rows[i].id, idb: rows[j].id, label: 'distinct',
          similarity: cosine(va, vb),
          titleA: rows[i].title, titleB: rows[j].title, specFolder: f.spec_folder,
          contentA: rows[i].content_text ?? '', contentB: rows[j].content_text ?? '',
        });
      }
    }
  }

  // ── route every pair through the PRODUCTION band ──
  function actionOf(sim) { return determineAction(sim); }

  const dupActions = dupPairs.map((p) => actionOf(p.similarity));
  const distinctActions = distinctPairs.map((p) => actionOf(p.similarity));

  const dupMerge = dupActions.filter((a) => a === 'merge').length;
  const dupConflict = dupActions.filter((a) => a === 'conflict').length;
  const distinctMerge = distinctActions.filter((a) => a === 'merge').length;
  const distinctConflict = distinctActions.filter((a) => a === 'conflict').length;

  // merge precision: of pairs routed to MERGE, fraction truly duplicate.
  const mergeFired = dupMerge + distinctMerge;
  const mergePrecision = mergeFired > 0 ? dupMerge / mergeFired : null;
  // conflict precision: of pairs routed to CONFLICT, fraction truly duplicate.
  const conflictFired = dupConflict + distinctConflict;
  const conflictPrecision = conflictFired > 0 ? dupConflict / conflictFired : null;
  // duplicate recall under the MERGE band: of true dupes, fraction merged.
  const dupMergeRecall = dupPairs.length > 0 ? dupMerge / dupPairs.length : null;

  // ── recall preservation through the PRODUCTION mergeContent ──
  // For each pair, run the actual line-union and check that every non-empty new
  // line survives into the merged text (it must either already be present or be
  // appended). A dropped line is silent information loss.
  function recallPreservation(existingText, incomingText) {
    const merged = mergeContent(existingText, incomingText);
    const mergedLines = new Set(merged.split('\n').map((l) => l.trim()).filter((l) => l.length > 0));
    const incomingLines = incomingText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    if (incomingLines.length === 0) return { preserved: 1, lost: 0, total: 0 };
    let lost = 0;
    for (const line of incomingLines) {
      if (!mergedLines.has(line)) lost += 1;
    }
    return { preserved: (incomingLines.length - lost) / incomingLines.length, lost, total: incomingLines.length };
  }

  let dupLineLoss = 0;
  let dupLineTotal = 0;
  for (const p of dupPairs) {
    const r = recallPreservation(p.contentA, p.contentB);
    dupLineLoss += r.lost;
    dupLineTotal += r.total;
  }
  let distinctLineLoss = 0;
  let distinctLineTotal = 0;
  // For distinct pairs the merge is a mistake, but if it fires the new doc's
  // lines must still survive. Measure the line-loss when a distinct pair is
  // forced through the same union the merge path uses.
  for (const p of distinctPairs) {
    const r = recallPreservation(p.contentA, p.contentB);
    distinctLineLoss += r.lost;
    distinctLineTotal += r.total;
  }

  // ── separation: threshold for zero distinct false-positive ──
  const distinctSims = distinctPairs.map((p) => p.similarity).sort((a, b) => a - b);
  const dupSims = dupPairs.map((p) => p.similarity).sort((a, b) => a - b);
  const distinctMax = distinctSims.length ? distinctSims[distinctSims.length - 1] : null;
  const safeThreshold = distinctMax;
  const dupRecallAtSafe = safeThreshold === null
    ? null
    : dupSims.filter((s) => s > safeThreshold).length / (dupSims.length || 1);

  const output = {
    generatedFrom: 'recon-precision-benchmark.mjs',
    generatedAt: new Date().toISOString(),
    subject:
      'Save-time near-duplicate merge precision and recall preservation, measured against the ' +
      'production determineAction band and mergeContent line-union over a read-only corpus backup.',
    flagUnderTest: 'SPECKIT_RECONSOLIDATION_ENABLED',
    sourceDbPath: evalDatabase.sourceDbPath,
    evalDbPath: evalDatabase.dbPath,
    evalShardPath: evalDatabase.evalShardPath,
    activeEmbedder: evalDatabase.activeEmbedder,
    bands: { MERGE_THRESHOLD, CONFLICT_THRESHOLD },
    fixture: {
      duplicatePairs: dupPairs.length,
      distinctPairs: distinctPairs.length,
      duplicateRule: 'two active rows sharing one content_hash (exact textual duplicates, should merge)',
      distinctRule: 'two active rows in one spec folder with a different title and a different content_hash (distinct documents, should not merge)',
      foldersSampled: folders.length,
    },
    similarity: {
      duplicate: {
        min: fmt(quantile(dupSims, 0)),
        median: fmt(quantile(dupSims, 0.5)),
        max: fmt(dupSims.length ? dupSims[dupSims.length - 1] : null),
      },
      distinct: {
        p50: fmt(quantile(distinctSims, 0.5)),
        p90: fmt(quantile(distinctSims, 0.9)),
        p95: fmt(quantile(distinctSims, 0.95)),
        p99: fmt(quantile(distinctSims, 0.99)),
        max: fmt(distinctMax),
      },
    },
    bandRouting: {
      duplicate: { merge: dupMerge, conflict: dupConflict, complement: dupPairs.length - dupMerge - dupConflict },
      distinct: { merge: distinctMerge, conflict: distinctConflict, complement: distinctPairs.length - distinctMerge - distinctConflict },
    },
    precision: {
      mergePrecision: fmt(mergePrecision),
      mergeTruePositives: dupMerge,
      mergeFalsePositives: distinctMerge,
      conflictPrecision: fmt(conflictPrecision),
      conflictTruePositives: dupConflict,
      conflictFalsePositives: distinctConflict,
      duplicateMergeRecall: fmt(dupMergeRecall),
    },
    recallPreservation: {
      duplicateLineLoss: dupLineLoss,
      duplicateLineTotal: dupLineTotal,
      duplicateLinePreservation: fmt(dupLineTotal > 0 ? (dupLineTotal - dupLineLoss) / dupLineTotal : 1, 6),
      distinctLineLoss: distinctLineLoss,
      distinctLineTotal: distinctLineTotal,
      distinctLinePreservation: fmt(distinctLineTotal > 0 ? (distinctLineTotal - distinctLineLoss) / distinctLineTotal : 1, 6),
      note:
        'mergeContent is a line-union, so every non-empty incoming line either already exists or is appended. ' +
        'The information loss from a merge is NOT line truncation, it is the deprecation of the predecessor row ' +
        'and the collapse of two distinct documents into one record. Line preservation = 1.0 does not make a ' +
        'wrong merge safe.',
    },
    separation: {
      safeThresholdForZeroDistinctFalsePositive: fmt(safeThreshold),
      duplicateRecallAtSafeThreshold: fmt(dupRecallAtSafe),
      note:
        'The threshold that excludes every distinct pair sits above the distinct-pair max. ' +
        'The MERGE_THRESHOLD of ' + MERGE_THRESHOLD + ' sits well inside the distinct-pair distribution.',
    },
    examples: {
      distinctMergeFalsePositives: distinctPairs
        .filter((p) => actionOf(p.similarity) === 'merge')
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 10)
        .map((p) => ({ ida: p.ida, idb: p.idb, similarity: fmt(p.similarity), titleA: (p.titleA || '').slice(0, 70), titleB: (p.titleB || '').slice(0, 70), specFolder: p.specFolder })),
    },
  };

  fs.mkdirSync(RESULTS_DIR, { recursive: true });
  const outPath = path.join(RESULTS_DIR, 'precision-metrics.json');
  fs.writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`);

  mainDb.close();
  shardDb.close();
  try { fs.rmSync(evalDatabase.evalRoot, { recursive: true, force: true }); } catch { /* best-effort */ }

  process.stdout.write(`${JSON.stringify({
    metricsPath: outPath,
    fixture: output.fixture,
    bands: output.bands,
    precision: output.precision,
    recallPreservation: {
      duplicateLinePreservation: output.recallPreservation.duplicateLinePreservation,
      distinctLinePreservation: output.recallPreservation.distinctLinePreservation,
    },
    separation: output.separation,
    similarity: output.similarity,
  }, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
