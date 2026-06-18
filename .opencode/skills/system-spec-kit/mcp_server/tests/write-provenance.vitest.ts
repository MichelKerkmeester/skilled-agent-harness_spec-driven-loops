import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { applyWriteProvenance, deriveSourceKindFromContext } from '../lib/storage/write-provenance.js';

let database: Database.Database;

function createDatabase(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      source_kind TEXT,
      provenance_source TEXT,
      provenance_actor TEXT
    )
  `);
  db.prepare('INSERT INTO memory_index (id) VALUES (1), (2)').run();
  return db;
}

describe('write provenance tagging', () => {
  beforeEach(() => {
    database = createDatabase();
  });

  afterEach(() => {
    database.close();
  });

  it('tags scan and ingest rows as imports without governed scope metadata', () => {
    applyWriteProvenance(database, 1, {
      provenanceSource: 'memory_index_scan',
      provenanceActor: 'system-scan',
      tool: 'memory_index_scan',
    });
    applyWriteProvenance(database, 2, {
      provenanceSource: 'memory_ingest_start',
      provenanceActor: 'async-ingest',
      tool: 'memory_ingest_start',
    });

    const rows = database.prepare(`
      SELECT id, source_kind, provenance_source, provenance_actor
      FROM memory_index
      ORDER BY id
    `).all() as Array<{
      id: number;
      source_kind: string;
      provenance_source: string;
      provenance_actor: string;
    }>;

    expect(rows).toEqual([
      {
        id: 1,
        source_kind: 'import',
        provenance_source: 'memory_index_scan',
        provenance_actor: 'system-scan',
      },
      {
        id: 2,
        source_kind: 'import',
        provenance_source: 'memory_ingest_start',
        provenance_actor: 'async-ingest',
      },
    ]);
  });

  it('defaults untagged and path-only saves to human provenance', () => {
    expect(deriveSourceKindFromContext()).toBe('human');
    expect(deriveSourceKindFromContext({ filePath: '/tmp/indexed-notes/scan-plan.md' })).toBe('human');
    expect(deriveSourceKindFromContext({ scope: { agentId: 'agent-a' } })).toBe('agent');
  });
});
