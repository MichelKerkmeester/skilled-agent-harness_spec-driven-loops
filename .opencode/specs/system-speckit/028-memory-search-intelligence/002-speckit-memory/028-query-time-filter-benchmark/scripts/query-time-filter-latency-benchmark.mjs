#!/usr/bin/env node

// Measures the public memory_search handler against an isolated SQLite backup.
// The source database and vector shard are opened read-only; only the temporary
// evaluation copy may receive the handler's normal best-effort writes.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PACKET_ROOT = path.resolve(HERE, '..');
const RESULTS_PATH = path.join(PACKET_ROOT, 'results', 'query-time-filter-latency.json');
const REPO_ROOT = path.resolve(HERE, '..', '..', '..', '..', '..', '..');
const MCP_DIR = path.join(REPO_ROOT, '.opencode', 'skills', 'system-spec-kit', 'mcp_server');
const DIST = path.join(MCP_DIR, 'dist');
const mcpRequire = createRequire(path.join(MCP_DIR, 'package.json'));
const Database = mcpRequire('better-sqlite3');

const QUERIES = [
  'query time existence filter benchmark',
  'memory search drift suspect queue',
  'automatic drift self healing',
  'capability flag default off',
  'memory index scan confirmation',
  'retrieval latency benchmark',
  'spec kit memory database',
  'transient missing file recovery',
];
const WARMUP_REPEATS = Number(process.env.SPECKIT_BENCHMARK_WARMUP_REPEATS ?? 2);
const MEASURED_REPEATS = Number(process.env.SPECKIT_BENCHMARK_MEASURED_REPEATS ?? 8);

function distUrl(relativePath) {
  return pathToFileURL(path.join(DIST, relativePath)).href;
}

function removeSqliteFileSet(filePath) {
  for (const suffix of ['', '-wal', '-shm']) fs.rmSync(`${filePath}${suffix}`, { force: true });
}

async function backupSqlite(sourcePath, targetPath) {
  removeSqliteFileSet(targetPath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true, mode: 0o700 });
  const source = new Database(sourcePath, { readonly: true, fileMustExist: true });
  try {
    await source.backup(targetPath);
  } finally {
    source.close();
  }
}

function readActiveEmbedder(dbPath) {
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  try {
    const rows = db.prepare(`SELECT key, value FROM vec_metadata WHERE key IN ('active_embedder_name', 'active_embedder_dim', 'active_embedder_provider')`).all();
    const metadata = new Map(rows.map((row) => [row.key, row.value]));
    const name = metadata.get('active_embedder_name');
    const provider = metadata.get('active_embedder_provider');
    const dim = Number.parseInt(metadata.get('active_embedder_dim') ?? '', 10);
    if (!name || !provider || !Number.isInteger(dim) || dim <= 0) throw new Error(`Could not read active embedder metadata from ${dbPath}`);
    return { name, provider, dim };
  } finally {
    db.close();
  }
}

function shardName(profile) {
  const model = profile.name.replace(/[^a-zA-Z0-9-_.]/g, '_').replace(/__+/g, '_').toLowerCase();
  return `context-vectors__${profile.provider}__${model}__${profile.dim}.sqlite`;
}

async function prepareEvaluationCopy(sourceDbPath) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'query-time-filter-benchmark-'));
  const dbPath = path.join(root, 'context-index.sqlite');
  await backupSqlite(sourceDbPath, dbPath);
  const profile = readActiveEmbedder(dbPath);
  const sourceShardPath = path.join(path.dirname(sourceDbPath), 'vectors', shardName(profile));
  const evalShardPath = path.join(root, 'vectors', shardName(profile));
  if (!fs.existsSync(sourceShardPath)) throw new Error(`Active vector shard not found: ${sourceShardPath}`);
  await backupSqlite(sourceShardPath, evalShardPath);
  return { root, dbPath, sourceShardPath, evalShardPath, profile };
}

function summarize(samples) {
  const sorted = [...samples].sort((a, b) => a - b);
  const percentile = (fraction) => sorted[Math.floor((sorted.length - 1) * fraction)];
  return {
    samples: samples.length,
    p50Ms: Number(percentile(0.5).toFixed(3)),
    p95Ms: Number(percentile(0.95).toFixed(3)),
    meanMs: Number((samples.reduce((sum, value) => sum + value, 0) / samples.length).toFixed(3)),
  };
}

async function main() {
  if (!fs.existsSync(DIST)) throw new Error(`Missing mcp_server dist build: ${DIST}. Run npm run build in ${MCP_DIR}.`);
  if (!Number.isInteger(WARMUP_REPEATS) || WARMUP_REPEATS < 0 || !Number.isInteger(MEASURED_REPEATS) || MEASURED_REPEATS < 1) {
    throw new Error('SPECKIT_BENCHMARK_WARMUP_REPEATS must be >= 0 and SPECKIT_BENCHMARK_MEASURED_REPEATS must be >= 1');
  }

  const config = await import(distUrl('core/config.js'));
  const sourceDbPath = process.env.SPECKIT_BENCHMARK_SOURCE_DB ?? config.DATABASE_PATH;
  if (!sourceDbPath || !fs.existsSync(sourceDbPath)) throw new Error(`Live database not found at config DATABASE_PATH: ${sourceDbPath}`);
  const evaluation = await prepareEvaluationCopy(sourceDbPath);
  const previous = process.env.SPECKIT_QUERY_TIME_EXISTENCE_FILTER;

  try {
    process.env.MEMORY_DB_PATH = evaluation.dbPath;
    process.env.SPECKIT_SKIP_API_VALIDATION = 'true';
    const [vectorIndex, hybridSearch, graphSearch] = await Promise.all([
      import(distUrl('lib/search/vector-index.js')),
      import(distUrl('lib/search/hybrid-search.js')),
      import(distUrl('lib/search/graph-search-fn.js')),
    ]);
    const db = vectorIndex.initializeDb(evaluation.dbPath, { skipRestoreRecovery: true });
    vectorIndex.attachActiveVectorShardForActiveProfile(db);
    hybridSearch.init(db, vectorIndex.vectorSearch, graphSearch.createUnifiedGraphSearchFn(db));
    const { handleMemorySearch } = await import(distUrl('handlers/memory-search.js'));
    const runState = async (enabled) => {
      process.env.SPECKIT_QUERY_TIME_EXISTENCE_FILTER = enabled ? 'true' : 'false';
      for (let repeat = 0; repeat < WARMUP_REPEATS; repeat += 1) {
        for (const query of QUERIES) await handleMemorySearch({ query, bypassCache: true, trackAccess: false });
      }
      const samples = [];
      let returnedRows = 0;
      let checkedRows = 0;
      let excludedRows = 0;
      for (let repeat = 0; repeat < MEASURED_REPEATS; repeat += 1) {
        for (const query of QUERIES) {
          const startedAt = performance.now();
          const response = await handleMemorySearch({ query, bypassCache: true, trackAccess: false });
          if (response.isError) throw new Error(`memory_search failed for benchmark query: ${query}`);
          samples.push(performance.now() - startedAt);
          const data = JSON.parse(response.content[0].text).data ?? {};
          returnedRows += Array.isArray(data.results) ? data.results.length : 0;
          checkedRows += Number(data.queryTimeExistenceFilter?.checked ?? 0);
          excludedRows += Number(data.queryTimeExistenceFilter?.excluded ?? 0);
        }
      }
      return { ...summarize(samples), returnedRows, checkedRows, excludedRows };
    };

    const off = await runState(false);
    const on = await runState(true);
    if (on.checkedRows === 0) {
      throw new Error('Benchmark query set did not reach any file-backed result rows; no existence-filter latency was measured');
    }
    const delta = {
      p50Ms: Number((on.p50Ms - off.p50Ms).toFixed(3)),
      p95Ms: Number((on.p95Ms - off.p95Ms).toFixed(3)),
      meanMs: Number((on.meanMs - off.meanMs).toFixed(3)),
      meanFractionOfOff: off.meanMs === 0 ? null : Number(((on.meanMs - off.meanMs) / off.meanMs).toFixed(6)),
    };
    const report = {
      generatedAt: new Date().toISOString(),
      subject: 'memory_search latency with SPECKIT_QUERY_TIME_EXISTENCE_FILTER OFF versus ON',
      safety: {
        sourceDbOpenedReadOnly: true,
        sourceShardOpenedReadOnly: true,
        evaluationCopy: evaluation.dbPath,
        sourceDbPath,
        sourceShardPath: evaluation.sourceShardPath,
      },
      queryCount: QUERIES.length,
      warmupRepeats: WARMUP_REPEATS,
      measuredRepeats: MEASURED_REPEATS,
      activeEmbedder: evaluation.profile,
      off,
      on,
      delta,
    };
    fs.mkdirSync(path.dirname(RESULTS_PATH), { recursive: true });
    fs.writeFileSync(RESULTS_PATH, `${JSON.stringify(report, null, 2)}\n`);
    process.stdout.write(`${JSON.stringify({ resultsPath: RESULTS_PATH, off, on, delta }, null, 2)}\n`);
  } finally {
    if (previous === undefined) delete process.env.SPECKIT_QUERY_TIME_EXISTENCE_FILTER;
    else process.env.SPECKIT_QUERY_TIME_EXISTENCE_FILTER = previous;
    fs.rmSync(evaluation.root, { recursive: true, force: true });
  }
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
