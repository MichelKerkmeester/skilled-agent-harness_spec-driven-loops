import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Database from 'better-sqlite3';

const postInsertMocks = vi.hoisted(() => ({
  runPostInsertEnrichmentIfEnabled: vi.fn(),
}));

vi.mock('../handlers/save/post-insert.js', () => ({
  runPostInsertEnrichmentIfEnabled: postInsertMocks.runPostInsertEnrichmentIfEnabled,
}));

import {
  POST_INSERT_ENRICHMENT_VERSION,
  markEnrichmentPending,
  needsEnrichmentRepair,
  recordEnrichmentResult,
  repairEnrichmentOnReplay,
  repairIncompleteMarkers,
} from '../handlers/save/enrichment-state.js';

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

function createDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL,
      file_path TEXT NOT NULL,
      content_text TEXT,
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
  return db;
}

function insertMemory(db: Database.Database, id: number, status: string): void {
  db.prepare(`
    INSERT INTO memory_index (
      id,
      spec_folder,
      file_path,
      content_text,
      updated_at,
      post_insert_enrichment_status,
      post_insert_enrichment_state,
      post_insert_enrichment_completed_at,
      post_insert_enrichment_version
    ) VALUES (?, ?, ?, ?, ?, ?, NULL, NULL, ?)
  `).run(
    id,
    'specs/example',
    'specs/example/spec.md',
    '# Example\n\nRepairable content.',
    '2026-06-02T00:00:00.000Z',
    status,
    POST_INSERT_ENRICHMENT_VERSION,
  );
}

function readMarker(db: Database.Database, id: number): {
  status: string;
  state: string | null;
  completedAt: string | null;
  version: number | null;
} {
  return db.prepare(`
    SELECT post_insert_enrichment_status AS status,
           post_insert_enrichment_state AS state,
           post_insert_enrichment_completed_at AS completedAt,
           post_insert_enrichment_version AS version
    FROM memory_index
    WHERE id = ?
  `).get(id) as {
    status: string;
    state: string | null;
    completedAt: string | null;
    version: number | null;
  };
}

describe('post-insert enrichment marker state', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createDb();
    postInsertMocks.runPostInsertEnrichmentIfEnabled.mockReset();
    postInsertMocks.runPostInsertEnrichmentIfEnabled.mockResolvedValue(COMPLETE_RESULT);
  });

  afterEach(() => {
    db.close();
    vi.restoreAllMocks();
  });

  it('records pending in the primary transaction and complete after enrichment result recording', () => {
    let statusInsideTransaction = '';
    const tx = db.transaction(() => {
      insertMemory(db, 1, 'complete');
      markEnrichmentPending(db, 1, POST_INSERT_ENRICHMENT_VERSION);
      statusInsideTransaction = readMarker(db, 1).status;
    });

    tx.immediate();
    expect(statusInsideTransaction).toBe('pending');
    expect(needsEnrichmentRepair(db, 1)).toBe(true);

    recordEnrichmentResult(db, 1, COMPLETE_RESULT);
    const marker = readMarker(db, 1);
    expect(marker.status).toBe('complete');
    expect(marker.completedAt).toEqual(expect.any(String));
    expect(marker.version).toBe(POST_INSERT_ENRICHMENT_VERSION);
    expect(needsEnrichmentRepair(db, 1)).toBe(false);
  });

  it.each(['unchanged', 'duplicate'])('repairs a pending marker on %s replay', async () => {
    insertMemory(db, 2, 'pending');

    const result = await repairEnrichmentOnReplay({ database: db }, 2);

    expect(result).toEqual({ memoryId: 2, repaired: true, status: 'complete' });
    expect(readMarker(db, 2).status).toBe('complete');
    expect(postInsertMocks.runPostInsertEnrichmentIfEnabled).toHaveBeenCalledTimes(1);
  });

  it('does not replay-repair a complete marker and leaves row and edge counts stable', async () => {
    insertMemory(db, 3, 'complete');
    db.prepare(`INSERT INTO causal_edges (id, source_id, target_id, relation) VALUES (1, '3', '2', 'supports')`).run();
    const before = {
      memories: (db.prepare('SELECT COUNT(*) AS count FROM memory_index').get() as { count: number }).count,
      edges: (db.prepare('SELECT COUNT(*) AS count FROM causal_edges').get() as { count: number }).count,
    };

    const result = await repairEnrichmentOnReplay({ database: db }, 3);
    const after = {
      memories: (db.prepare('SELECT COUNT(*) AS count FROM memory_index').get() as { count: number }).count,
      edges: (db.prepare('SELECT COUNT(*) AS count FROM causal_edges').get() as { count: number }).count,
    };

    expect(result).toEqual({ memoryId: 3, repaired: false, status: 'complete' });
    expect(after).toEqual(before);
    expect(postInsertMocks.runPostInsertEnrichmentIfEnabled).not.toHaveBeenCalled();
  });

  it('does not repair deferred markers on normal replay or bounded backfill', async () => {
    insertMemory(db, 4, 'deferred');

    const replay = await repairEnrichmentOnReplay({ database: db }, 4);
    const backfill = await repairIncompleteMarkers({ database: db }, { limit: 10 });

    expect(replay).toEqual({ memoryId: 4, repaired: false, status: 'deferred' });
    expect(backfill).toEqual({ scanned: 0, repaired: 0, failed: 0 });
    expect(readMarker(db, 4).status).toBe('deferred');
    expect(postInsertMocks.runPostInsertEnrichmentIfEnabled).not.toHaveBeenCalled();
  });

  it('repairs a bounded pending marker backlog and reports the repaired count', async () => {
    insertMemory(db, 5, 'pending');
    insertMemory(db, 6, 'complete');

    const result = await repairIncompleteMarkers({ database: db }, { limit: 10 });

    expect(result).toEqual({ scanned: 1, repaired: 1, failed: 0 });
    expect(readMarker(db, 5).status).toBe('complete');
    expect(readMarker(db, 6).status).toBe('complete');
  });

  it('keeps state stable after repeated repair attempts', async () => {
    insertMemory(db, 7, 'pending');
    db.prepare(`INSERT INTO causal_edges (id, source_id, target_id, relation) VALUES (1, '7', '1', 'supports')`).run();

    await repairEnrichmentOnReplay({ database: db }, 7);
    const stateAfterOne = {
      marker: readMarker(db, 7),
      memories: (db.prepare('SELECT COUNT(*) AS count FROM memory_index').get() as { count: number }).count,
      edges: (db.prepare('SELECT COUNT(*) AS count FROM causal_edges').get() as { count: number }).count,
    };

    await repairEnrichmentOnReplay({ database: db }, 7);
    await repairIncompleteMarkers({ database: db }, { limit: 10 });
    const stateAfterMany = {
      marker: readMarker(db, 7),
      memories: (db.prepare('SELECT COUNT(*) AS count FROM memory_index').get() as { count: number }).count,
      edges: (db.prepare('SELECT COUNT(*) AS count FROM causal_edges').get() as { count: number }).count,
    };

    expect(stateAfterMany).toEqual(stateAfterOne);
    expect(postInsertMocks.runPostInsertEnrichmentIfEnabled).toHaveBeenCalledTimes(1);
  });
});
