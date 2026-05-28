import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { resolveCreateRecordLineage } from '../handlers/save/create-record';
import { createSchema, ensureSchemaVersion } from '../lib/search/vector-index-schema';
import { recordLineageVersion } from '../lib/storage/lineage-state';

function insertMemory(
  database: Database.Database,
  params: {
    id: number;
    specFolder: string;
    filePath: string;
    title: string;
    createdAt: string;
  },
): void {
  database.prepare(`
    INSERT INTO memory_index (
      id,
      spec_folder,
      file_path,
      canonical_file_path,
      title,
      trigger_phrases,
      importance_weight,
      created_at,
      updated_at,
      embedding_status,
      importance_tier,
      context_type,
      content_text
    ) VALUES (?, ?, ?, ?, ?, '[]', 0.5, ?, ?, 'pending', 'normal', 'general', ?)
  `).run(
    params.id,
    params.specFolder,
    params.filePath,
    params.filePath,
    params.title,
    params.createdAt,
    params.createdAt,
    `${params.title} body`,
  );
}

describe('Create-record lineage regressions', () => {
  let database: Database.Database;

  beforeEach(() => {
    database = new Database(':memory:');
    createSchema(database, {
      sqlite_vec_available: false,
      get_embedding_dim: () => 4,
    });
    ensureSchemaVersion(database);
  });

  afterEach(() => {
    database.close();
  });

  it('T070-1 routes cross-path PE supersedes to a causal edge target instead of the version chain', () => {
    const routed = resolveCreateRecordLineage(
      {
        action: 'SUPERSEDE',
        similarity: 0.98,
        existingMemoryId: 99,
        reason: 'Contradiction detected in a different file',
      },
      7,
    );

    expect(routed.predecessorMemoryId).toBe(7);
    expect(routed.transitionEvent).toBe('SUPERSEDE');
    expect(routed.causalSupersedesMemoryId).toBe(99);
  });

  it('T070-2 keeps same-path PE supersedes inside the lineage chain only', () => {
    const routed = resolveCreateRecordLineage(
      {
        action: 'SUPERSEDE',
        similarity: 0.99,
        existingMemoryId: 7,
        reason: 'Same file new version',
      },
      7,
    );

    expect(routed.predecessorMemoryId).toBe(7);
    expect(routed.transitionEvent).toBe('SUPERSEDE');
    expect(routed.causalSupersedesMemoryId).toBeNull();
  });

  it('T070-3 rejects mismatched logical identities at the lineage layer', () => {
    insertMemory(database, {
      id: 1,
      specFolder: 'specs/t070-lineage',
      filePath: '/tmp/specs/t070-lineage/memory/original.md',
      title: 'Original',
      createdAt: '2026-03-28T10:00:00.000Z',
    });
    recordLineageVersion(database, {
      memoryId: 1,
      actor: 'test:t070',
      effectiveAt: '2026-03-28T10:00:00.000Z',
      transitionEvent: 'CREATE',
    });

    insertMemory(database, {
      id: 2,
      specFolder: 'specs/t070-lineage',
      filePath: '/tmp/specs/t070-lineage/memory/different.md',
      title: 'Different',
      createdAt: '2026-03-28T11:00:00.000Z',
    });

    expect(() => recordLineageVersion(database, {
      memoryId: 2,
      predecessorMemoryId: 1,
      actor: 'test:t070',
      effectiveAt: '2026-03-28T11:00:00.000Z',
      transitionEvent: 'SUPERSEDE',
    })).toThrow(/logical identity/);
  });

  it('T070-4 re-roots lineage when a moved file leaves a stale predecessor logical_key', () => {
    // Predecessor created at the OLD path; its lineage row keeps the old logical_key.
    insertMemory(database, {
      id: 1,
      specFolder: 'specs/old-loc',
      filePath: '/tmp/specs/old-loc/impl.md',
      title: 'Moved doc',
      createdAt: '2026-03-28T10:00:00.000Z',
    });
    recordLineageVersion(database, {
      memoryId: 1,
      actor: 'test:t070',
      effectiveAt: '2026-03-28T10:00:00.000Z',
      transitionEvent: 'CREATE',
    });

    // Simulate an in-place spec-folder move: memory_index path is updated, but the existing
    // lineage row's logical_key is left stale (the exact production state that caused E081).
    database.prepare(`
      UPDATE memory_index
      SET spec_folder = 'specs/new-loc',
          file_path = '/tmp/specs/new-loc/impl.md',
          canonical_file_path = '/tmp/specs/new-loc/impl.md'
      WHERE id = 1
    `).run();

    // New version saved at the NEW path (same logical file as the moved predecessor row).
    insertMemory(database, {
      id: 2,
      specFolder: 'specs/new-loc',
      filePath: '/tmp/specs/new-loc/impl.md',
      title: 'Moved doc v2',
      createdAt: '2026-03-28T11:00:00.000Z',
    });

    // Must NOT throw: the predecessor's CURRENT identity matches, so re-root under the new key.
    const recorded = recordLineageVersion(database, {
      memoryId: 2,
      predecessorMemoryId: 1,
      actor: 'test:t070',
      effectiveAt: '2026-03-28T11:00:00.000Z',
      transitionEvent: 'SUPERSEDE',
    });

    expect(recorded.logicalKey).toContain('specs/new-loc');
    const predecessorTier = database.prepare(
      'SELECT importance_tier FROM memory_index WHERE id = ?',
    ).get(1) as { importance_tier: string };
    expect(predecessorTier.importance_tier).toBe('deprecated');
    const newLineage = database.prepare(
      'SELECT logical_key FROM memory_lineage WHERE memory_id = ?',
    ).get(2) as { logical_key: string };
    expect(newLineage.logical_key).toContain('specs/new-loc');
  });
});
