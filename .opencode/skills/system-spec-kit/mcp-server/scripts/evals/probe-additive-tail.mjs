// Displacement + append-activity probe for the two additive tail-lane recall
// features. Mirrors run-eval-v2's prepare/init/prod-lens, but instead of mean
// completeRecall it captures, per measurability query, the prod-lens result id
// list and the _s3meta append metadata, off-vs-on for ONE feature at a time.
//
// Displacement is measured directly: a baseline (flag-off) top-K id that is no
// longer present in the flag-on top-K. The append contract guarantees this is
// always 0; this probe proves it on the live-DB copy. Read-only on the source
// DB — run-eval's prepareEvalDatabase makes its own temp copy.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import Database from 'better-sqlite3';

const SOURCE_DB_PATH = path.resolve(process.env.MEMORY_DB_PATH ?? 'database/context-index.sqlite');
const SEARCH_LIMIT = 20;
const KS = [3, 5, 8];
const FEATURE = process.argv[2]; // 'multihop' | 'lane-champion'
const FLAG = FEATURE === 'multihop' ? 'SPECKIT_DETERMINISTIC_MULTIHOP' : 'SPECKIT_LANE_CHAMPION_BACKFILL';
const META_KEY = FEATURE === 'multihop' ? 'multihop' : 'laneChampionBackfill';

function removeSqliteFileSet(p) {
  for (const s of ['', '-wal', '-shm']) fs.rmSync(`${p}${s}`, { force: true });
}
async function backupSqlite(src, dst) {
  removeSqliteFileSet(dst);
  fs.mkdirSync(path.dirname(dst), { recursive: true, mode: 0o700 });
  const s = new Database(src, { readonly: true, fileMustExist: true });
  try { s.pragma('busy_timeout = 10000'); await s.backup(dst); } finally { s.close(); }
}
function createProfileSlug(provider, model, dim) {
  const safe = model.replace(/[^a-zA-Z0-9-_.]/g, '_').replace(/__+/g, '_').toLowerCase();
  return `${provider}__${safe}__${dim}`;
}
function readActiveEmbedder(dbPath) {
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  try {
    const rows = db.prepare(`SELECT key, value FROM vec_metadata WHERE key IN ('active_embedder_name','active_embedder_dim','active_embedder_provider')`).all();
    const m = new Map(rows.map((r) => [r.key, r.value]));
    return { name: m.get('active_embedder_name'), provider: m.get('active_embedder_provider'), dim: Number.parseInt(m.get('active_embedder_dim') ?? '', 10) };
  } finally { db.close(); }
}
async function prepareEvalDatabase(srcDb) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'probe-additive-'));
  const dbPath = path.join(root, 'context-index.sqlite');
  await backupSqlite(srcDb, dbPath);
  const emb = readActiveEmbedder(dbPath);
  const shard = `context-vectors__${createProfileSlug(emb.provider, emb.name, emb.dim)}.sqlite`;
  await backupSqlite(path.join(path.dirname(srcDb), 'vectors', shard), path.join(path.dirname(dbPath), 'vectors', shard));
  return { root, dbPath };
}
function moduleUrl(rel) { return pathToFileURL(path.resolve(rel)).href; }
function topKIds(rows, k) {
  return rows.slice(0, k).map((r) => Number(r.parentMemoryId ?? r.parent_id ?? r.parentId ?? r.id)).filter(Number.isInteger);
}

async function main() {
  if (!['multihop', 'lane-champion'].includes(FEATURE)) {
    throw new Error(`usage: probe-additive-tail.mjs <multihop|lane-champion>`);
  }
  const evalDb = await prepareEvalDatabase(SOURCE_DB_PATH);
  process.env.MEMORY_DB_PATH = evalDb.dbPath;
  process.env.SPECKIT_ABLATION = 'true';

  const [vectorIndex, hybridSearch, graphSearch, embeddings, groundTruth] = await Promise.all([
    import(moduleUrl('dist/lib/search/vector-index.js')),
    import(moduleUrl('dist/lib/search/hybrid-search.js')),
    import(moduleUrl('dist/lib/search/graph-search-fn.js')),
    import(moduleUrl('dist/lib/providers/embeddings.js')),
    import(moduleUrl('dist/lib/eval/ground-truth-data.js')),
  ]);
  const db = vectorIndex.initializeDb(evalDb.dbPath, { skipRestoreRecovery: true });
  const graphSearchFn = graphSearch.createUnifiedGraphSearchFn(db);
  hybridSearch.init(db, vectorIndex.vectorSearch, graphSearchFn);

  const MEAS = ['thematic_multi_target', 'causal_chain', 'hard_negative'];
  const queries = groundTruth.GROUND_TRUTH_QUERIES.filter((q) => MEAS.includes(q.category));

  const embCache = new Map();
  async function getEmb(q) {
    if (embCache.has(q)) return embCache.get(q);
    let e = null;
    try { e = await embeddings.generateQueryEmbedding(q); } catch { e = null; }
    embCache.set(q, e);
    return e;
  }
  async function prodLens(q) {
    const embedding = await getEmb(q);
    const rows = await hybridSearch.hybridSearchEnhanced(q, embedding, {
      limit: SEARCH_LIMIT, useVector: true, useBm25: true, useFts: true, useGraph: true, includeContent: false,
    });
    // _s3meta is a non-enumerable property on the result array.
    const meta = rows._s3meta ?? Object.getOwnPropertyDescriptor(rows, '_s3meta')?.value;
    return { rows, meta };
  }

  // OFF arm
  delete process.env[FLAG];
  const off = new Map();
  for (const q of queries) off.set(q.id, (await prodLens(q.query)).rows);
  // ON arm
  process.env[FLAG] = 'true';
  const on = new Map();
  const metaAgg = [];
  for (const q of queries) {
    const { rows, meta } = await prodLens(q.query);
    on.set(q.id, rows);
    if (meta && meta[META_KEY]) metaAgg.push({ id: q.id, ...meta[META_KEY] });
  }

  // Displacement: baseline top-K member missing from on top-K.
  let totalDisplacement = 0;
  const perK = Object.fromEntries(KS.map((k) => [k, 0]));
  for (const q of queries) {
    const offRows = off.get(q.id), onRows = on.get(q.id);
    for (const k of KS) {
      const offIds = new Set(topKIds(offRows, k));
      const onIds = new Set(topKIds(onRows, k));
      for (const id of offIds) if (!onIds.has(id)) { perK[k]++; totalDisplacement++; }
    }
  }

  const appendedTotal = metaAgg.reduce((s, m) => s + (m.appendedCount ?? 0), 0);
  const firedQueries = metaAgg.filter((m) => (m.appendedCount ?? 0) > 0).length;
  console.log(JSON.stringify({
    feature: FEATURE, flag: FLAG, queries: queries.length,
    displacement: { total: totalDisplacement, perK },
    appendActivity: { firedQueries, appendedTotal, sample: metaAgg.filter((m)=>(m.appendedCount??0)>0).slice(0, 6) },
  }, null, 2));

  db.close();
  fs.rmSync(evalDb.root, { recursive: true, force: true });
}
main().catch((e) => { console.error(e); process.exit(1); });
