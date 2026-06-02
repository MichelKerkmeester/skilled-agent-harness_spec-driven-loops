// One-shot dedup cleanup for the live memory index (Phase 2-C).
//
// Collapses duplicate logical-key rows that accumulated before supersede-on-
// reindex landed: per logical key (spec_folder :: canonical_file_path ::
// COALESCE(anchor_id,'_')) it keeps a single winner (projection-active else
// newest) and retires the rest via the sanctioned per-row delete cascade
// (never raw SQL). Constitutional rows and any projection-active row are NEVER
// deleted. Dry-run by default; pass --apply to mutate.
//
// Run from mcp_server/ with the daemon UP (sole sanctioned delete path attaches
// the active embedder shard). A verified backup MUST exist first. Restart the
// daemon afterward so its in-memory caches/BM25 rebuild from the cleaned DB.

import path from 'node:path';
import process from 'node:process';

const APPLY = process.argv.includes('--apply');
const BATCH = 500;
const EXPECTED_MAX_DELETE = 21000; // hard ceiling guard; abort if the set is unexpectedly larger

const DELETE_SET_SQL = `
  WITH amp AS (SELECT DISTINCT active_memory_id AS aid FROM active_memory_projection),
  grp AS (
    SELECT m.id, m.importance_tier AS tier, m.updated_at,
      m.spec_folder||'::'||m.canonical_file_path||'::'||COALESCE(m.anchor_id,'_') AS lk,
      CASE WHEN amp.aid IS NOT NULL THEN 1 ELSE 0 END AS is_active
    FROM memory_index m LEFT JOIN amp ON amp.aid = m.id
  ),
  ranked AS (
    SELECT id, lk, tier, is_active,
      ROW_NUMBER() OVER (PARTITION BY lk ORDER BY is_active DESC, updated_at DESC, id DESC) AS rn
    FROM grp
  )
  SELECT id FROM ranked
  WHERE rn > 1 AND tier <> 'constitutional' AND is_active = 0
`;

function log(msg) {
  // eslint-disable-next-line no-console
  console.log(`[dedup-cleanup] ${msg}`);
}

const vi = await import('../dist/lib/search/vector-index.js');

vi.initializeDb();
const db = vi.getDb();
db.pragma('busy_timeout = 30000');

const dbFile = db.name || '(unknown)';
log(`mode=${APPLY ? 'APPLY' : 'DRY-RUN'}  db=${path.basename(dbFile)}`);

// Surface attached databases (the active embedder shard must be present so the
// vector cascade actually deletes shard rows rather than orphaning them).
const attached = db.prepare('PRAGMA database_list').all();
log(`attached: ${attached.map((a) => `${a.name}=${a.file ? path.basename(a.file) : 'main'}`).join(', ')}`);

const before = db.prepare('SELECT COUNT(*) c FROM memory_index').get().c;
log(`memory_index rows (before): ${before}`);

const ids = db.prepare(DELETE_SET_SQL).all().map((r) => r.id);
log(`deletion candidates: ${ids.length}`);

// Safety assertions — abort on any violation.
const constInSet = db.prepare(
  `SELECT COUNT(*) c FROM memory_index WHERE importance_tier='constitutional' AND id IN (${DELETE_SET_SQL})`,
).get().c;
const activeInSet = db.prepare(
  `SELECT COUNT(*) c FROM active_memory_projection WHERE active_memory_id IN (${DELETE_SET_SQL})`,
).get().c;
log(`SAFETY constitutional-in-set=${constInSet} (must be 0), projection-active-in-set=${activeInSet} (must be 0)`);

if (constInSet !== 0 || activeInSet !== 0) {
  log('ABORT: safety invariant violated (would delete constitutional or active rows).');
  process.exit(2);
}
if (ids.length > EXPECTED_MAX_DELETE) {
  log(`ABORT: deletion set ${ids.length} exceeds ceiling ${EXPECTED_MAX_DELETE}.`);
  process.exit(2);
}
if (ids.length === 0) {
  log('Nothing to delete — index already deduplicated.');
  process.exit(0);
}

if (!APPLY) {
  log(`DRY-RUN complete. Would delete ${ids.length} rows; result would be ${before - ids.length} rows.`);
  log('Re-run with --apply to mutate (daemon must be up; backup must exist).');
  process.exit(0);
}

log(`APPLYING: deleting ${ids.length} rows in batches of ${BATCH} via delete_memory()...`);
let done = 0;
for (let i = 0; i < ids.length; i += BATCH) {
  const batch = ids.slice(i, i + BATCH);
  const tx = db.transaction((rows) => {
    for (const id of rows) vi.delete_memory(id, db);
  });
  tx(batch);
  done += batch.length;
  if (done % 2500 === 0 || done === ids.length) log(`  deleted ${done}/${ids.length}`);
}

const after = db.prepare('SELECT COUNT(*) c FROM memory_index').get().c;
const residualDup = db.prepare(`
  WITH k AS (SELECT spec_folder||'::'||canonical_file_path||'::'||COALESCE(anchor_id,'_') AS lk
             FROM memory_index)
  SELECT COUNT(*) c FROM (SELECT lk FROM k GROUP BY lk HAVING COUNT(*) > 1)
`).get().c;
const constSurv = db.prepare("SELECT COUNT(*) c FROM memory_index WHERE importance_tier='constitutional'").get().c;
log(`DONE. rows: ${before} -> ${after} (deleted ${before - after}); residual dup-keys=${residualDup}; constitutional rows surviving=${constSurv}`);
log('Restart the daemon now so caches/BM25 rebuild from the cleaned index.');
