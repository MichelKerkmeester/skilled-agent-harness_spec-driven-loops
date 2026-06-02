// ───────────────────────────────────────────────────────────────
// STRESS: Post-insert enrichment marker backfill convergence under save flood
// ───────────────────────────────────────────────────────────────
//
// The schema-v30 post-insert enrichment markers
// (post_insert_enrichment_status + idx_post_insert_enrichment_incomplete) let a
// crashed daemon find the rows whose enrichment never completed. This stress
// drives a flood of saves that each leave a `pending` marker, then runs the
// bounded backfill repeatedly and asserts every marker converges to `complete`
// and the partial-index-eligible (incomplete) set drains to empty — i.e. the
// backlog is bounded and self-healing, never an ever-growing leak.
//
// ISOLATION: an in-memory better-sqlite3 DB per test. The enrichment runtime
// (runPostInsertEnrichmentIfEnabled) is mocked to a deterministic COMPLETE
// result, so no embedder, provider, daemon, or production DB is touched.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Database from 'better-sqlite3';

const postInsertMocks = vi.hoisted(() => ({
  runPostInsertEnrichmentIfEnabled: vi.fn(),
}));

vi.mock('../../handlers/save/post-insert.js', () => ({
  runPostInsertEnrichmentIfEnabled: postInsertMocks.runPostInsertEnrichmentIfEnabled,
}));

import {
  POST_INSERT_ENRICHMENT_VERSION,
  markEnrichmentPending,
  recordEnrichmentResult,
  repairIncompleteMarkers,
} from '../../handlers/save/enrichment-state.js';
import { SCHEMA_VERSION } from '../../lib/search/vector-index-schema.js';

const SAVE_FLOOD = 300;
const BACKFILL_LIMIT = 50;

// Mirrors POST_INSERT_ENRICHMENT_INCOMPLETE_INDEX_SQL in vector-index-schema.ts
// (the constant is module-private). The repair partial index that the backfill
// relies on indexes only the incomplete markers.
const INCOMPLETE_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_post_insert_enrichment_incomplete
  ON memory_index(post_insert_enrichment_status, id)
  WHERE post_insert_enrichment_status != 'complete'
`;

const COMPLETE_RESULT = {
  causalLinksResult: null,
  enrichmentStatus: {
    causalLinks: { status: 'ran' },
    entityExtraction: { status: 'ran' },
    summaries: { status: 'ran' },
    entityLinking: { status: 'ran' },
    graphLifecycle: { status: 'ran' },
  },
  executionStatus: { status: 'ran' },
} as const;

let db: Database.Database;

// Minimal memory_index carrying the real v30 enrichment marker columns plus the
// real repair partial index, and the companion causal_edges table the enrichment
// runtime reads. Built by hand (rather than via create_schema) so the FTS5
// trigger machinery and embedding columns stay out of this marker-focused stress.
function createDb(): Database.Database {
  const database = new Database(':memory:');
  database.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL,
      file_path TEXT NOT NULL,
      content_text TEXT,
      created_at TEXT,
      updated_at TEXT,
      post_insert_enrichment_status TEXT NOT NULL DEFAULT 'complete',
      post_insert_enrichment_state TEXT,
      post_insert_enrichment_completed_at TEXT,
      post_insert_enrichment_version INTEGER
    );
    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY,
      source_id TEXT,
      target_id TEXT,
      relation TEXT
    );
  `);
  database.exec(INCOMPLETE_INDEX_SQL);
  return database;
}

function insertSavedRow(database: Database.Database, id: number): void {
  const now = new Date().toISOString();
  database.prepare(`
    INSERT INTO memory_index (id, spec_folder, file_path, content_text, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, 'specs/flood', `specs/flood/doc-${id}.md`, `# Doc ${id}\n\nbody`, now, now);
}

// Count exactly the rows the repair partial index is built to find: the
// incomplete (pending/deferred) markers. A bounded backlog must drain to 0.
function incompleteMarkerCount(database: Database.Database): number {
  return (database.prepare(`
    SELECT COUNT(*) AS count
    FROM memory_index
    WHERE post_insert_enrichment_status != 'complete'
  `).get() as { count: number }).count;
}

function pendingMarkerCount(database: Database.Database): number {
  return (database.prepare(`
    SELECT COUNT(*) AS count
    FROM memory_index
    WHERE post_insert_enrichment_status = 'pending'
  `).get() as { count: number }).count;
}

beforeEach(() => {
  db = createDb();
  postInsertMocks.runPostInsertEnrichmentIfEnabled.mockReset();
  postInsertMocks.runPostInsertEnrichmentIfEnabled.mockResolvedValue(COMPLETE_RESULT);
});

afterEach(() => {
  db.close();
  vi.restoreAllMocks();
});

describe('durability: enrichment marker backfill convergence under save flood', () => {
  it('pins schema v30 and the repair partial index the backfill relies on', () => {
    expect(SCHEMA_VERSION).toBe(30);
    const indexSql = (db.prepare(`
      SELECT sql FROM sqlite_master
      WHERE type = 'index' AND name = 'idx_post_insert_enrichment_incomplete'
    `).get() as { sql?: string | null } | undefined)?.sql ?? '';
    expect(indexSql).toContain("WHERE post_insert_enrichment_status != 'complete'");
  });

  it('drains a flood of pending markers to complete through repeated bounded backfill', async () => {
    // Simulate a save flood where every insert leaves a pending enrichment
    // marker (the post-insert work was deferred/crashed before completion).
    const floodTx = db.transaction(() => {
      for (let id = 1; id <= SAVE_FLOOD; id += 1) {
        insertSavedRow(db, id);
        markEnrichmentPending(db, id, POST_INSERT_ENRICHMENT_VERSION);
      }
    });
    floodTx.immediate();

    expect(pendingMarkerCount(db)).toBe(SAVE_FLOOD);
    expect(incompleteMarkerCount(db)).toBe(SAVE_FLOOD);

    // Run bounded backfill passes. Each pass repairs at most BACKFILL_LIMIT rows,
    // so the incomplete set must strictly shrink and the work per pass stays
    // bounded — no single unbounded sweep, no runaway storm.
    let totalRepaired = 0;
    let passes = 0;
    const maxPasses = Math.ceil(SAVE_FLOOD / BACKFILL_LIMIT) + 2;

    while (incompleteMarkerCount(db) > 0) {
      const before = incompleteMarkerCount(db);
      const result = await repairIncompleteMarkers({ database: db }, { limit: BACKFILL_LIMIT });
      passes += 1;

      expect(result.scanned).toBeLessThanOrEqual(BACKFILL_LIMIT);
      expect(result.failed).toBe(0);
      expect(result.repaired).toBeGreaterThan(0);
      totalRepaired += result.repaired;

      // Each pass must make monotonic progress, never regress.
      expect(incompleteMarkerCount(db)).toBeLessThan(before);
      expect(passes).toBeLessThanOrEqual(maxPasses);
    }

    // Markers converged: nothing incomplete remains, and every flooded row was
    // accounted for exactly once.
    expect(incompleteMarkerCount(db)).toBe(0);
    expect(pendingMarkerCount(db)).toBe(0);
    expect(totalRepaired).toBe(SAVE_FLOOD);
  });

  it('keeps the backlog at zero when a save completes its own marker inline (steady state)', () => {
    // The happy path: each save records its enrichment result inline, so the
    // partial-index-eligible backlog never accumulates under sustained load.
    const tx = db.transaction(() => {
      for (let id = 1; id <= SAVE_FLOOD; id += 1) {
        insertSavedRow(db, id);
        markEnrichmentPending(db, id, POST_INSERT_ENRICHMENT_VERSION);
        recordEnrichmentResult(db, id, COMPLETE_RESULT);
      }
    });
    tx.immediate();

    expect(incompleteMarkerCount(db)).toBe(0);
    // Bounded backfill over a clean DB is a no-op — nothing to scan or repair.
    return repairIncompleteMarkers({ database: db }, { limit: BACKFILL_LIMIT }).then((result) => {
      expect(result).toEqual({ scanned: 0, repaired: 0, failed: 0 });
    });
  });
});
