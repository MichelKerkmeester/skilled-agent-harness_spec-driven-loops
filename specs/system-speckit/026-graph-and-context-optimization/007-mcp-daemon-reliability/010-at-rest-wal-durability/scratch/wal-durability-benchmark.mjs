import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const scratchDir = path.dirname(fileURLToPath(import.meta.url));
const mcpServerRoot = path.resolve(
  process.env.MCP_SERVER_ROOT ?? '.opencode/skills/system-spec-kit/mcp_server',
);
const require = createRequire(path.join(mcpServerRoot, 'package.json'));
const Database = require('better-sqlite3');

const sourceDbPath = path.join(mcpServerRoot, 'database', 'context-index.sqlite');
const copyDbPath = path.join(scratchDir, `wal-bench-copy-${process.pid}.sqlite`);
const resultsPath = path.join(scratchDir, 'wal-durability-benchmark-results.json');
const transactionCount = Number.parseInt(process.env.WAL_BENCH_TX ?? '200', 10);

function removeDbFiles(basePath) {
  for (const suffix of ['', '-wal', '-shm']) {
    const target = `${basePath}${suffix}`;
    if (fs.existsSync(target)) {
      fs.rmSync(target, { force: true });
    }
  }
}

function copyDbFiles(sourcePath, targetPath) {
  removeDbFiles(targetPath);
  for (const suffix of ['', '-wal', '-shm']) {
    const from = `${sourcePath}${suffix}`;
    if (fs.existsSync(from)) {
      fs.copyFileSync(from, `${targetPath}${suffix}`);
    }
  }
}

function walStats(basePath, pageSize) {
  const walPath = `${basePath}-wal`;
  const bytes = fs.existsSync(walPath) ? fs.statSync(walPath).size : 0;
  const frameSize = pageSize + 24;
  const pages = bytes > 32 ? Math.round((bytes - 32) / frameSize) : 0;
  return { bytes, pages };
}

function percentile(values, p) {
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[index] ?? 0;
}

function measureMs(fn) {
  const start = process.hrtime.bigint();
  const value = fn();
  const elapsed = Number(process.hrtime.bigint() - start) / 1_000_000;
  return { elapsed, value };
}

function checkpoint(db) {
  const measured = measureMs(() => db.pragma('wal_checkpoint(TRUNCATE)'));
  return {
    ms: Number(measured.elapsed.toFixed(3)),
    result: measured.value,
  };
}

function configureDurability(db, mode, fullfsync) {
  db.pragma('journal_mode = WAL');
  db.pragma('busy_timeout = 10000');
  db.pragma('wal_autocheckpoint = 256');
  db.pragma(`synchronous = ${mode}`);
  try {
    db.pragma(`fullfsync = ${fullfsync ? 'ON' : 'OFF'}`);
  } catch {
    // Not every SQLite build supports fullfsync. The benchmark still records commit timing.
  }
}

function runMemorySaveShapedTransactions(db, label, count) {
  const insertMemory = db.prepare(`
    INSERT INTO memory_index (
      id, spec_folder, file_path, canonical_file_path, anchor_id, title,
      trigger_phrases, importance_weight, created_at, updated_at,
      embedding_status, content_text, importance_tier, context_type,
      provenance_source, provenance_actor, content_hash
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(spec_folder, file_path, anchor_id) DO UPDATE SET
      title = excluded.title,
      trigger_phrases = excluded.trigger_phrases,
      updated_at = excluded.updated_at,
      content_text = excluded.content_text,
      content_hash = excluded.content_hash
  `);
  const upsertProjection = db.prepare(`
    INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(logical_key) DO UPDATE SET
      active_memory_id = excluded.active_memory_id,
      updated_at = excluded.updated_at
  `);
  const writeTx = db.transaction((i) => {
    const now = new Date().toISOString();
    const id = 10_100_000 + (label === 'normal' ? 0 : label === 'full' ? 100_000 : 200_000) + i;
    const logicalKey = `026/007/010-benchmark/${label}/${i}`;
    insertMemory.run(
      id,
      'system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/010-at-rest-wal-durability',
      `/tmp/spec-kit-wal-benchmark/${label}/${i}.md`,
      `/tmp/spec-kit-wal-benchmark/${label}/${i}.md`,
      `wal-benchmark-${label}-${i}`,
      `WAL benchmark ${label} ${i}`,
      JSON.stringify(['wal durability', 'memory_save shaped', label, String(i)]),
      0.5,
      now,
      now,
      'pending',
      `Benchmark payload ${label} ${i}\n${'x'.repeat(2048)}`,
      'normal',
      'implementation',
      'benchmark',
      'codex',
      `wal-benchmark-${label}-${i}`,
    );
    upsertProjection.run(logicalKey, id, id, now);
  });

  const samples = [];
  for (let i = 0; i < count; i += 1) {
    samples.push(measureMs(() => writeTx(i)).elapsed);
  }
  return {
    count,
    p50_ms: Number(percentile(samples, 50).toFixed(3)),
    p99_ms: Number(percentile(samples, 99).toFixed(3)),
    min_ms: Number(Math.min(...samples).toFixed(3)),
    max_ms: Number(Math.max(...samples).toFixed(3)),
  };
}

if (!fs.existsSync(sourceDbPath)) {
  throw new Error(`Source database not found: ${sourceDbPath}`);
}

copyDbFiles(sourceDbPath, copyDbPath);

let db;
try {
  db = new Database(copyDbPath);
  const pageSize = Number(db.pragma('page_size', { simple: true })) || 4096;
  const sourceWal = walStats(copyDbPath, pageSize);
  const currentWalCheckpoint = checkpoint(db);

  configureDurability(db, 'NORMAL', false);
  const normal = runMemorySaveShapedTransactions(db, 'normal', transactionCount);
  const normalWalBeforeCheckpoint = walStats(copyDbPath, pageSize);
  const autocheckpoint256AfterNormal = checkpoint(db);

  configureDurability(db, 'FULL', false);
  const full = runMemorySaveShapedTransactions(db, 'full', transactionCount);
  const fullWalBeforeCheckpoint = walStats(copyDbPath, pageSize);
  const autocheckpoint256AfterFull = checkpoint(db);

  configureDurability(db, 'FULL', true);
  const fullFullfsync = runMemorySaveShapedTransactions(db, 'full-fullfsync', transactionCount);
  const fullFullfsyncWalBeforeCheckpoint = walStats(copyDbPath, pageSize);
  const autocheckpoint256AfterFullFullfsync = checkpoint(db);

  const results = {
    source_db: sourceDbPath,
    copy_db: copyDbPath,
    transaction_count: transactionCount,
    page_size: pageSize,
    source_wal_before_checkpoint: sourceWal,
    current_wal_checkpoint: currentWalCheckpoint,
    normal,
    normal_wal_before_forced_checkpoint: normalWalBeforeCheckpoint,
    autocheckpoint_256_after_normal: autocheckpoint256AfterNormal,
    full,
    full_wal_before_forced_checkpoint: fullWalBeforeCheckpoint,
    autocheckpoint_256_after_full: autocheckpoint256AfterFull,
    full_fullfsync: fullFullfsync,
    full_fullfsync_wal_before_forced_checkpoint: fullFullfsyncWalBeforeCheckpoint,
    autocheckpoint_256_after_full_fullfsync: autocheckpoint256AfterFullFullfsync,
    deltas: {
      full_minus_normal_p99_ms: Number((full.p99_ms - normal.p99_ms).toFixed(3)),
      full_fullfsync_minus_normal_p99_ms: Number((fullFullfsync.p99_ms - normal.p99_ms).toFixed(3)),
    },
  };

  fs.writeFileSync(resultsPath, `${JSON.stringify(results, null, 2)}\n`);
  console.log(JSON.stringify(results, null, 2));
} finally {
  if (db) {
    db.close();
  }
  removeDbFiles(copyDbPath);
}
