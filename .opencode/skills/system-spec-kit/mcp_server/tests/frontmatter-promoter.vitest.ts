import type Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { promoteMetadataEdges, FRONTMATTER_RELATION_MAPPINGS } from '../lib/causal/frontmatter-promoter';
import {
  createMemoryDbFixture,
  disposeMemoryDbFixture,
  seedCausalEdge,
  seedMemoryRow,
} from './helpers/memory-db-fixture';

function graphMetadataContent(input: {
  packetId: string;
  parentId?: string | null;
  childrenIds?: string[];
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
      causal_summary: 'fixture',
      created_at: '2026-06-10T00:00:00.000Z',
      last_save_at: '2026-06-10T00:00:00.000Z',
      last_accessed_at: null,
      source_docs: ['spec.md'],
    },
  });
}

function descriptionContent(specFolder: string, parentChain: string[]): string {
  return JSON.stringify({
    specFolder,
    description: 'fixture description',
    keywords: ['fixture'],
    lastUpdated: '2026-06-10T00:00:00.000Z',
    parentChain,
  });
}

function edges(db: Database.Database): Array<Record<string, unknown>> {
  return db.prepare(`
    SELECT source_id, target_id, relation, strength, evidence, created_by,
      source_anchor, target_anchor, confidence, extraction_method
    FROM causal_edges
    ORDER BY id ASC
  `).all() as Array<Record<string, unknown>>;
}

describe('frontmatter metadata edge promoter', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createMemoryDbFixture();
  });

  afterEach(() => {
    disposeMemoryDbFixture(db);
  });

  it('documents deterministic relation mappings for promoted metadata fields', () => {
    expect(FRONTMATTER_RELATION_MAPPINGS).toEqual([
      expect.objectContaining({ field: 'parent_id', relation: 'derived_from', source: 'current', target: 'target' }),
      expect.objectContaining({ field: 'children_ids', relation: 'enabled', source: 'current', target: 'target' }),
      expect.objectContaining({ field: 'parentChain', relation: 'derived_from', source: 'current', target: 'target' }),
    ]);
  });

  it('promotes parent and child graph metadata with deterministic provenance', () => {
    seedMemoryRow(db, { id: 1, specFolder: 'parent', documentType: 'graph_metadata' });
    seedMemoryRow(db, { id: 2, specFolder: 'child', documentType: 'graph_metadata' });
    seedMemoryRow(db, { id: 3, specFolder: 'grandchild', documentType: 'graph_metadata' });

    const parentResult = promoteMetadataEdges(db, {
      memoryId: 1,
      filePath: '/workspace/specs/parent/graph-metadata.json',
      content: graphMetadataContent({ packetId: 'parent', childrenIds: ['grandchild'] }),
    });
    const childResult = promoteMetadataEdges(db, {
      memoryId: 2,
      filePath: '/workspace/specs/child/graph-metadata.json',
      content: graphMetadataContent({ packetId: 'child', parentId: 'parent' }),
    });

    expect(parentResult).toMatchObject({ processed: 1, resolved: 1, inserted: 1, warnings: [] });
    expect(childResult).toMatchObject({ processed: 1, resolved: 1, inserted: 1, warnings: [] });
    expect(edges(db)).toEqual([
      expect.objectContaining({
        source_id: '1',
        target_id: '3',
        relation: 'enabled',
        created_by: 'auto',
        source_anchor: 'metadata:children_ids',
        target_anchor: 'packet:grandchild',
        confidence: 1,
        extraction_method: 'frontmatter',
      }),
      expect.objectContaining({
        source_id: '2',
        target_id: '1',
        relation: 'derived_from',
        created_by: 'auto',
        source_anchor: 'metadata:parent_id',
        target_anchor: 'packet:parent',
        confidence: 1,
        extraction_method: 'frontmatter',
      }),
    ]);
  });

  it('promotes description parentChain ancestors without duplicate rows on rerun', () => {
    seedMemoryRow(db, { id: 10, specFolder: 'root', documentType: 'graph_metadata' });
    seedMemoryRow(db, { id: 11, specFolder: 'mid', documentType: 'graph_metadata' });
    seedMemoryRow(db, { id: 12, specFolder: 'leaf', documentType: 'description_metadata' });

    const input = {
      memoryId: 12,
      filePath: '/workspace/specs/leaf/description.json',
      content: descriptionContent('leaf', ['root', 'mid']),
    };

    const first = promoteMetadataEdges(db, input);
    const second = promoteMetadataEdges(db, input);

    expect(first).toMatchObject({ processed: 2, resolved: 2, inserted: 2, warnings: [] });
    expect(second).toMatchObject({ processed: 2, resolved: 2, inserted: 2, warnings: [] });
    expect(edges(db)).toHaveLength(2);
    expect(edges(db)).toEqual([
      expect.objectContaining({ source_id: '12', target_id: '10', relation: 'derived_from', source_anchor: 'metadata:parent_chain' }),
      expect.objectContaining({ source_id: '12', target_id: '11', relation: 'derived_from', source_anchor: 'metadata:parent_chain' }),
    ]);
  });

  it('reports unresolved targets and creates no partial edge', () => {
    seedMemoryRow(db, { id: 20, specFolder: 'orphan-child', documentType: 'graph_metadata' });

    const result = promoteMetadataEdges(db, {
      memoryId: 20,
      filePath: '/workspace/specs/orphan-child/graph-metadata.json',
      content: graphMetadataContent({ packetId: 'orphan-child', parentId: 'missing-parent' }),
    });

    expect(result).toMatchObject({ processed: 1, resolved: 0, inserted: 0 });
    expect(result.warnings).toEqual([
      { field: 'parent_id', reference: 'missing-parent', message: 'Target packet could not be resolved' },
    ]);
    expect(edges(db)).toHaveLength(0);
  });

  it('preserves manual edges instead of duplicating metadata-derived edges', () => {
    seedMemoryRow(db, { id: 30, specFolder: 'manual-parent', documentType: 'graph_metadata' });
    seedMemoryRow(db, { id: 31, specFolder: 'manual-child', documentType: 'graph_metadata' });
    seedCausalEdge(db, {
      sourceId: '31',
      targetId: '30',
      relation: 'derived_from',
      strength: 0.9,
      evidence: 'curated lineage',
      createdBy: 'manual',
    });

    const input = {
      memoryId: 31,
      filePath: '/workspace/specs/manual-child/graph-metadata.json',
      content: graphMetadataContent({ packetId: 'manual-child', parentId: 'manual-parent' }),
    };

    const first = promoteMetadataEdges(db, input);
    const second = promoteMetadataEdges(db, input);

    expect(first).toMatchObject({ processed: 1, resolved: 1, inserted: 0, skippedManual: 1 });
    expect(second).toMatchObject({ processed: 1, resolved: 1, inserted: 0, skippedManual: 1 });
    expect(edges(db)).toEqual([
      expect.objectContaining({
        source_id: '31',
        target_id: '30',
        relation: 'derived_from',
        strength: 0.9,
        evidence: 'curated lineage',
        created_by: 'manual',
      }),
    ]);
  });

  it('tombstones stale generated edges when metadata relationships are removed', () => {
    seedMemoryRow(db, { id: 40, specFolder: 'stale-parent', documentType: 'graph_metadata' });
    seedMemoryRow(db, { id: 41, specFolder: 'stale-child', documentType: 'graph_metadata' });

    promoteMetadataEdges(db, {
      memoryId: 41,
      filePath: '/workspace/specs/stale-child/graph-metadata.json',
      content: graphMetadataContent({ packetId: 'stale-child', parentId: 'stale-parent' }),
    });
    const cleanup = promoteMetadataEdges(db, {
      memoryId: 41,
      filePath: '/workspace/specs/stale-child/graph-metadata.json',
      content: graphMetadataContent({ packetId: 'stale-child' }),
    });

    expect(cleanup).toMatchObject({ staleTombstoned: 1, staleDeleted: 1 });
    expect(edges(db)).toHaveLength(0);
    const tombstone = db.prepare('SELECT reason, restore_metadata FROM causal_edge_tombstones').get() as { reason: string; restore_metadata: string };
    expect(tombstone.reason).toBe('metadata relationship removed');
    expect(JSON.parse(tombstone.restore_metadata)).toMatchObject({
      command: 'frontmatter_promoter.cleanupStaleGeneratedEdges',
    });
  });

  it('skips stale generated edges that are already temporally closed', () => {
    seedMemoryRow(db, { id: 60, specFolder: 'closed-parent', documentType: 'graph_metadata' });
    seedMemoryRow(db, { id: 61, specFolder: 'closed-child', documentType: 'graph_metadata' });

    promoteMetadataEdges(db, {
      memoryId: 61,
      filePath: '/workspace/specs/closed-child/graph-metadata.json',
      content: graphMetadataContent({ packetId: 'closed-child', parentId: 'closed-parent' }),
    });
    db.prepare('UPDATE causal_edges SET invalid_at = ? WHERE source_id = ? AND target_id = ?')
      .run('2026-06-10T00:00:00.000Z', '61', '60');

    const cleanup = promoteMetadataEdges(db, {
      memoryId: 61,
      filePath: '/workspace/specs/closed-child/graph-metadata.json',
      content: graphMetadataContent({ packetId: 'closed-child' }),
    });

    expect(cleanup).toMatchObject({ staleTombstoned: 0, staleDeleted: 0 });
    expect(edges(db)).toHaveLength(1);
    const tombstoneCount = db.prepare('SELECT COUNT(*) AS count FROM causal_edge_tombstones').get() as { count: number };
    expect(tombstoneCount.count).toBe(0);
  });

  it('tombstones stale description parentChain edges scoped to canonical graph row', () => {
    seedMemoryRow(db, { id: 50, specFolder: 'mixed-root', documentType: 'graph_metadata' });
    seedMemoryRow(db, { id: 51, specFolder: 'mixed-leaf', documentType: 'graph_metadata' });
    seedMemoryRow(db, { id: 52, specFolder: 'mixed-leaf', documentType: 'description_metadata' });

    const first = promoteMetadataEdges(db, {
      memoryId: 52,
      filePath: '/workspace/specs/mixed-leaf/description.json',
      content: descriptionContent('mixed-leaf', ['mixed-root']),
    });

    expect(first).toMatchObject({ processed: 1, resolved: 1, inserted: 1, warnings: [] });
    expect(edges(db)).toEqual([
      expect.objectContaining({
        source_id: '51',
        target_id: '50',
        relation: 'derived_from',
        created_by: 'auto',
        source_anchor: 'metadata:parent_chain',
        target_anchor: 'packet:mixed-root',
        confidence: 1,
        extraction_method: 'frontmatter',
      }),
    ]);

    const cleanup = promoteMetadataEdges(db, {
      memoryId: 52,
      filePath: '/workspace/specs/mixed-leaf/description.json',
      content: descriptionContent('mixed-leaf', []),
    });

    expect(cleanup).toMatchObject({ processed: 0, resolved: 0, staleTombstoned: 1, staleDeleted: 1 });
    expect(edges(db)).toHaveLength(0);

    const tombstone = db.prepare('SELECT source_id, target_id, restore_metadata FROM causal_edge_tombstones').get() as {
      source_id: string;
      target_id: string;
      restore_metadata: string;
    };
    expect(tombstone).toMatchObject({ source_id: '51', target_id: '50' });
    expect(JSON.parse(tombstone.restore_metadata)).toMatchObject({
      edge: {
        source_anchor: 'metadata:parent_chain',
        extraction_method: 'frontmatter',
      },
    });
  });
});
