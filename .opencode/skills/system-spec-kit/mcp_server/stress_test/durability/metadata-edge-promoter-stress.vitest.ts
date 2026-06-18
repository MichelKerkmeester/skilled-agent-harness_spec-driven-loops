// ───────────────────────────────────────────────────────────────
// MODULE: Metadata Edge Promoter Stress
// ───────────────────────────────────────────────────────────────
// Stress coverage for high-volume metadata promotion idempotency and cleanup.
// Uses an in-memory production-shaped fixture so no live memory DB is touched.

import type Database from 'better-sqlite3';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const envSnapshot = vi.hoisted(() => {
  const originalCap = process.env.SPECKIT_CAUSAL_RELATION_CAP_PER_WINDOW;
  process.env.SPECKIT_CAUSAL_RELATION_CAP_PER_WINDOW = '100000';
  return { originalCap };
});

import { promoteMetadataEdges } from '../../lib/causal/frontmatter-promoter';
import {
  createMemoryDbFixture,
  disposeMemoryDbFixture,
  seedCausalEdge,
  seedMemoryRow,
} from '../../tests/helpers/memory-db-fixture';

const HIGH_VOLUME_ROWS = 360;
const STALE_VOLUME_ROWS = 320;
const STALE_SLICE_START = 48;
const STALE_SLICE_COUNT = 176;
const INTERLEAVED_ROWS = 240;
const INTERLEAVED_BATCH_SIZE = 40;
const PARENT_COUNT = 32;

type PromotionResult = ReturnType<typeof promoteMetadataEdges>;

interface CorpusEntry {
  readonly memoryId: number;
  readonly packetId: string;
  readonly parentId: string;
  readonly childId: string;
}

interface ProtectedEdgeSnapshot {
  readonly id: number;
  readonly source_id: string;
  readonly target_id: string;
  readonly relation: string;
  readonly strength: number;
  readonly evidence: string | null;
  readonly created_by: string | null;
  readonly source_anchor: string | null;
  readonly target_anchor: string | null;
  readonly extraction_method: string | null;
}

let db: Database.Database;

function packetId(prefix: string, index: number): string {
  return `${prefix}-${index.toString().padStart(3, '0')}`;
}

function graphMetadataContent(input: {
  readonly packetId: string;
  readonly parentId?: string | null;
  readonly childrenIds?: readonly string[];
}): string {
  return JSON.stringify({
    schema_version: 1,
    packet_id: input.packetId,
    spec_folder: input.packetId,
    parent_id: input.parentId ?? null,
    children_ids: input.childrenIds ?? [],
    manual: {
      depends_on: [],
      supersedes: [],
      related_to: [],
    },
    derived: {
      trigger_phrases: [input.packetId],
      key_topics: [],
      importance_tier: 'important',
      status: 'in_progress',
      key_files: [],
      entities: [],
      causal_summary: 'stress fixture',
      created_at: '2026-06-10T00:00:00.000Z',
      last_save_at: '2026-06-10T00:00:00.000Z',
      last_accessed_at: null,
      source_docs: ['spec.md'],
    },
  });
}

function createCorpus(count: number): CorpusEntry[] {
  return Array.from({ length: count }, (_value, index) => {
    const packet = packetId('packet', index);
    return {
      memoryId: 1_000 + index,
      packetId: packet,
      parentId: packetId('parent', index % PARENT_COUNT),
      childId: packetId('packet', (index + 1) % count),
    };
  });
}

function seedCorpus(database: Database.Database, entries: readonly CorpusEntry[]): void {
  const parentIds = Array.from(new Set(entries.map((entry) => entry.parentId)));
  const seedTx = database.transaction(() => {
    parentIds.forEach((parent, index) => {
      seedMemoryRow(database, { id: index + 1, specFolder: parent, documentType: 'graph_metadata' });
    });
    for (const entry of entries) {
      seedMemoryRow(database, { id: entry.memoryId, specFolder: entry.packetId, documentType: 'graph_metadata' });
    }
  });
  seedTx.immediate();
}

function promoteEntry(database: Database.Database, entry: CorpusEntry, override?: {
  readonly parentId?: string | null;
  readonly childrenIds?: readonly string[];
}): PromotionResult {
  return promoteMetadataEdges(database, {
    memoryId: entry.memoryId,
    filePath: `/workspace/specs/${entry.packetId}/graph-metadata.json`,
    content: graphMetadataContent({
      packetId: entry.packetId,
      parentId: override?.parentId === undefined ? entry.parentId : override.parentId,
      childrenIds: override?.childrenIds ?? [entry.childId],
    }),
  });
}

function promoteEntries(database: Database.Database, entries: readonly CorpusEntry[]): PromotionResult[] {
  return entries.map((entry) => promoteEntry(database, entry));
}

function activeEdgeCount(database: Database.Database): number {
  return (database.prepare('SELECT COUNT(*) AS count FROM causal_edges').get() as { count: number }).count;
}

function autoEdgeCount(database: Database.Database): number {
  return (database.prepare(`
    SELECT COUNT(*) AS count
    FROM causal_edges
    WHERE created_by = 'auto' AND extraction_method = 'frontmatter'
  `).get() as { count: number }).count;
}

function tombstoneCount(database: Database.Database): number {
  return (database.prepare(`
    SELECT COUNT(*) AS count
    FROM causal_edge_tombstones
    WHERE reason = 'metadata relationship removed'
  `).get() as { count: number }).count;
}

function duplicateEdgeIdentities(database: Database.Database): Array<{ source_id: string; target_id: string; relation: string; count: number }> {
  return database.prepare(`
    SELECT source_id, target_id, relation, COUNT(*) AS count
    FROM causal_edges
    GROUP BY source_id, target_id, relation
    HAVING COUNT(*) > 1
    ORDER BY source_id, target_id, relation
  `).all() as Array<{ source_id: string; target_id: string; relation: string; count: number }>;
}

function expectNoDuplicateEdgeIdentities(database: Database.Database): void {
  expect(duplicateEdgeIdentities(database)).toEqual([]);
}

function seedProtectedEdges(database: Database.Database, source: CorpusEntry): number[] {
  seedMemoryRow(database, { id: 90_001, specFolder: 'protected-manual', documentType: 'graph_metadata' });
  seedMemoryRow(database, { id: 90_002, specFolder: 'protected-constitutional', documentType: 'graph_metadata' });

  const edgeIds = [
    seedCausalEdge(database, {
      sourceId: String(source.memoryId),
      targetId: '90001',
      relation: 'derived_from',
      sourceAnchor: 'metadata:parent_id',
      targetAnchor: 'packet:protected-manual',
      strength: 0.95,
      evidence: 'curated lineage',
      createdBy: 'manual',
    }),
    seedCausalEdge(database, {
      sourceId: String(source.memoryId),
      targetId: '90002',
      relation: 'enabled',
      sourceAnchor: 'metadata:children_ids',
      targetAnchor: 'packet:protected-constitutional',
      strength: 1,
      evidence: 'constitutional lineage',
      createdBy: 'constitutional',
    }),
  ];

  database.prepare(`
    UPDATE causal_edges
    SET confidence = 1, extraction_method = 'frontmatter'
    WHERE id IN (${edgeIds.map(() => '?').join(', ')})
  `).run(...edgeIds);

  return edgeIds;
}

function readProtectedEdges(database: Database.Database, edgeIds: readonly number[]): ProtectedEdgeSnapshot[] {
  return database.prepare(`
    SELECT id, source_id, target_id, relation, strength, evidence, created_by,
      source_anchor, target_anchor, extraction_method
    FROM causal_edges
    WHERE id IN (${edgeIds.map(() => '?').join(', ')})
    ORDER BY id ASC
  `).all(...edgeIds) as ProtectedEdgeSnapshot[];
}

function sumResults(results: readonly PromotionResult[], key: keyof PromotionResult): number {
  return results.reduce((sum, result) => {
    const value = result[key];
    if (Array.isArray(value)) {
      return sum + value.length;
    }
    return typeof value === 'number' ? sum + value : sum;
  }, 0);
}

beforeEach(() => {
  db = createMemoryDbFixture();
});

afterEach(() => {
  disposeMemoryDbFixture(db);
});

afterAll(() => {
  if (envSnapshot.originalCap === undefined) delete process.env.SPECKIT_CAUSAL_RELATION_CAP_PER_WINDOW;
  else process.env.SPECKIT_CAUSAL_RELATION_CAP_PER_WINDOW = envSnapshot.originalCap;
});

describe('durability: metadata edge promoter stress', () => {
  it('keeps high-volume promotion idempotent across repeated runs', () => {
    const corpus = createCorpus(HIGH_VOLUME_ROWS);
    seedCorpus(db, corpus);

    const first = promoteEntries(db, corpus);
    const firstEdgeCount = activeEdgeCount(db);
    const firstAutoCount = autoEdgeCount(db);
    expect(sumResults(first, 'warnings')).toBe(0);
    expect(firstAutoCount).toBe(HIGH_VOLUME_ROWS * 2);
    expect(firstEdgeCount).toBe(firstAutoCount);
    expectNoDuplicateEdgeIdentities(db);

    const second = promoteEntries(db, corpus);
    expect(sumResults(second, 'warnings')).toBe(0);
    expect(activeEdgeCount(db)).toBe(firstEdgeCount);
    expect(autoEdgeCount(db)).toBe(firstAutoCount);
    expectNoDuplicateEdgeIdentities(db);
  });

  it('tombstones stale generated edges at volume while preserving protected edges', () => {
    const corpus = createCorpus(STALE_VOLUME_ROWS);
    seedCorpus(db, corpus);
    promoteEntries(db, corpus);

    const protectedIds = seedProtectedEdges(db, corpus[STALE_SLICE_START]);
    const protectedBefore = readProtectedEdges(db, protectedIds);
    const baselineTotal = activeEdgeCount(db);
    const baselineAuto = autoEdgeCount(db);
    const staleSlice = corpus.slice(STALE_SLICE_START, STALE_SLICE_START + STALE_SLICE_COUNT);

    const cleanupResults = staleSlice.map((entry) => promoteEntry(db, entry, {
      parentId: null,
      childrenIds: [],
    }));

    const expectedStaleEdges = STALE_SLICE_COUNT * 2;
    expect(sumResults(cleanupResults, 'staleTombstoned')).toBe(expectedStaleEdges);
    expect(sumResults(cleanupResults, 'staleDeleted')).toBe(expectedStaleEdges);
    expect(tombstoneCount(db)).toBe(expectedStaleEdges);
    expect(autoEdgeCount(db)).toBe(baselineAuto - expectedStaleEdges);
    expect(activeEdgeCount(db)).toBe(baselineTotal - expectedStaleEdges);
    expect(readProtectedEdges(db, protectedIds)).toEqual(protectedBefore);
    expectNoDuplicateEdgeIdentities(db);
  });

  it('maintains invariants through interleaved promote and mutate batches', () => {
    const corpus = createCorpus(INTERLEAVED_ROWS);
    seedCorpus(db, corpus);

    let promotedRows = 0;
    let totalTombstones = 0;

    for (let offset = 0; offset < corpus.length; offset += INTERLEAVED_BATCH_SIZE) {
      const batch = corpus.slice(offset, offset + INTERLEAVED_BATCH_SIZE);
      promoteEntries(db, batch);
      promotedRows += batch.length;

      expect(autoEdgeCount(db)).toBe(promotedRows * 2);
      expectNoDuplicateEdgeIdentities(db);

      const mutated = batch.map((entry, index) => promoteEntry(db, entry, {
        parentId: packetId('parent', (offset + index + 7) % PARENT_COUNT),
        childrenIds: [entry.childId],
      }));
      totalTombstones += batch.length;

      expect(sumResults(mutated, 'staleTombstoned')).toBe(batch.length);
      expect(sumResults(mutated, 'staleDeleted')).toBe(batch.length);
      expect(tombstoneCount(db)).toBe(totalTombstones);
      expect(autoEdgeCount(db)).toBe(promotedRows * 2);
      expectNoDuplicateEdgeIdentities(db);
    }
  });
});
