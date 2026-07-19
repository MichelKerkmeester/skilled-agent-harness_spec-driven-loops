// Phase 2-B: resolve residual logical-key collisions, then add the logical-key
// uniqueness guard.
//
// After Phase 2-C, a small set of logical keys still hold >1 row — folder-rename
// duplicate pairs where an older row stayed projection-active alongside its
// newer twin (same canonical_file_path). For each collision key WITHOUT a
// constitutional row, keep the winner (non-deprecated, newest) and retire the
// rest via the sanctioned per-row delete. Constitutional rows are never deleted;
// the uniqueness guard is a PARTIAL index excluding the constitutional tier so
// those rare special rows are tolerated.
//
// Dry-run by default; --apply to mutate. Daemon UP; verified backup must exist.

import path from 'node:path';
import process from 'node:process';

const APPLY = process.argv.includes('--apply');
const INDEX_NAME = 'idx_memory_logical_key_unique';
const INDEX_SQL = `CREATE UNIQUE INDEX IF NOT EXISTS ${INDEX_NAME}
  ON memory_index (spec_folder, canonical_file_path, COALESCE(anchor_id, '_'))
  WHERE importance_tier <> 'constitutional'`;

const COLLISION_ROWS_SQL = `
  WITH k AS (
    SELECT id, importance_tier AS tier, updated_at,
      spec_folder||'::'||canonical_file_path||'::'||COALESCE(anchor_id,'_') AS lk
    FROM memory_index
  ),
  d AS (SELECT lk FROM k GROUP BY lk HAVING COUNT(*) > 1),
  collisions AS (SELECT * FROM k WHERE lk IN (SELECT lk FROM d))
  SELECT lk, id, tier,
    SUM(CASE WHEN tier='constitutional' THEN 1 ELSE 0 END) OVER (PARTITION BY lk) AS const_in_key,
    ROW_NUMBER() OVER (
      PARTITION BY lk
      ORDER BY CASE WHEN tier='constitutional' THEN 0 WHEN tier='deprecated' THEN 2 ELSE 1 END,
               updated_at DESC, id DESC
    ) AS rn
  FROM collisions
`;

function log(m) { console.log(`[dedup-index-b] ${m}`); }

const vi = await import('../dist/lib/search/vector-index.js');
vi.initializeDb();
const db = vi.getDb();
db.pragma('busy_timeout = 30000');

log(`mode=${APPLY ? 'APPLY' : 'DRY-RUN'} db=${path.basename(db.name)}`);

const rows = db.prepare(COLLISION_ROWS_SQL).all();
// Delete = non-winner (rn>1), non-constitutional, only in keys that have NO
// constitutional row (constitutional-bearing keys are left for the partial index).
const toDelete = rows.filter((r) => r.rn > 1 && r.tier !== 'constitutional' && r.const_in_key === 0);
const collisionKeys = new Set(rows.map((r) => r.lk));
const constKeys = new Set(rows.filter((r) => r.const_in_key > 0).map((r) => r.lk));
log(`collision keys=${collisionKeys.size} (constitutional-bearing=${constKeys.size}); rows to retire=${toDelete.length}`);

// SAFETY: never delete constitutional.
if (toDelete.some((r) => r.tier === 'constitutional')) { log('ABORT: delete set contains constitutional.'); process.exit(2); }
if (toDelete.length > 200) { log(`ABORT: unexpectedly large delete set ${toDelete.length}.`); process.exit(2); }

if (!APPLY) {
  log('DRY-RUN: would retire these ids: ' + toDelete.map((r) => r.id).join(','));
  // Simulate residual non-constitutional collisions after deletion.
  const delSet = new Set(toDelete.map((r) => r.id));
  const surviving = rows.filter((r) => !delSet.has(r.id) && r.tier !== 'constitutional');
  const byKey = {};
  for (const r of surviving) byKey[r.lk] = (byKey[r.lk] || 0) + 1;
  const residual = Object.values(byKey).filter((c) => c > 1).length;
  log(`After deletion, non-constitutional collision keys remaining: ${residual} (must be 0 for the index).`);
  log('Re-run with --apply to retire + create the partial unique index.');
  process.exit(0);
}

log(`APPLYING: retiring ${toDelete.length} duplicate rows...`);
const tx = db.transaction((rs) => { for (const r of rs) vi.delete_memory(r.id, db); });
tx(toDelete);
log('Retire complete. Creating partial unique index...');
try {
  db.prepare(INDEX_SQL).run();
  log(`Index ${INDEX_NAME} created (or already present).`);
} catch (e) {
  log(`INDEX CREATION FAILED: ${e instanceof Error ? e.message : String(e)}`);
  log('Residual non-constitutional duplicates still exist — investigate before retrying.');
  process.exit(3);
}

const idxOk = db.prepare("SELECT COUNT(*) c FROM sqlite_master WHERE type='index' AND name=?").get(INDEX_NAME).c;
const after = db.prepare('SELECT COUNT(*) c FROM memory_index').get().c;
log(`DONE. memory_index rows=${after}; unique index present=${idxOk === 1}`);
log('Restart the daemon so caches/BM25 rebuild from the cleaned, guarded index.');
