import type Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as core from '../core';
import { handleMemoryCausalUnlink } from '../handlers/causal-graph';
import { handleMemoryDelete } from '../handlers/memory-crud-delete';
import { handleMemoryHealth } from '../handlers/memory-crud-health';
import { handleMemoryBulkDelete } from '../handlers/memory-bulk-delete';
import * as vectorIndex from '../lib/search/vector-index';
import {
  createMemoryDbFixture,
  disposeMemoryDbFixture,
  seedCausalEdge,
  seedMemoryRow,
} from './helpers/memory-db-fixture';

const SPEC_FOLDER = 'specs/tombstone-fixture';
const SOFT_DELETE_FLAG = 'SPECKIT_SOFT_DELETE_TOMBSTONES';

function parseResponse(response: { content: Array<{ text: string }> }): Record<string, any> {
  return JSON.parse(response.content[0].text) as Record<string, any>;
}

function tombstones(db: Database.Database): Array<Record<string, any>> {
  return db.prepare(`
    SELECT * FROM causal_edge_tombstones ORDER BY id ASC
  `).all() as Array<Record<string, any>>;
}

function activeEdgeCount(db: Database.Database): number {
  return (db.prepare('SELECT COUNT(*) AS count FROM causal_edges').get() as { count: number }).count;
}

function deletedAt(db: Database.Database, id: number): string | null {
  const row = db.prepare('SELECT deleted_at FROM memory_index WHERE id = ?').get(id) as { deleted_at: string | null };
  return row.deleted_at;
}

describe('causal edge tombstones', () => {
  let db: Database.Database;
  let originalSoftDeleteFlag: string | undefined;

  beforeEach(() => {
    vi.restoreAllMocks();
    originalSoftDeleteFlag = process.env[SOFT_DELETE_FLAG];
    delete process.env[SOFT_DELETE_FLAG];
    db = createMemoryDbFixture();
  });

  afterEach(() => {
    if (originalSoftDeleteFlag === undefined) {
      delete process.env[SOFT_DELETE_FLAG];
    } else {
      process.env[SOFT_DELETE_FLAG] = originalSoftDeleteFlag;
    }
    vi.restoreAllMocks();
    disposeMemoryDbFixture(db);
  });

  it('hard-deletes memory rows by default while cleaning related edges', async () => {
    seedMemoryRow(db, { id: 401, specFolder: SPEC_FOLDER });
    seedMemoryRow(db, { id: 402, specFolder: SPEC_FOLDER });
    seedCausalEdge(db, { sourceId: '401', targetId: '402', relation: 'supports' });

    const response = await handleMemoryDelete({ id: 401, confirm: true });
    const envelope = parseResponse(response);

    expect(envelope.data.deleted).toBe(1);
    expect((db.prepare('SELECT COUNT(*) AS count FROM memory_index WHERE id = 401').get() as { count: number }).count).toBe(0);
    expect(activeEdgeCount(db)).toBe(0);
    expect(tombstones(db)).toHaveLength(1);
  });

  it('tombstones incoming and outgoing edges before single memory delete', async () => {
    seedMemoryRow(db, { id: 1, specFolder: SPEC_FOLDER });
    seedMemoryRow(db, { id: 2, specFolder: SPEC_FOLDER });
    seedMemoryRow(db, { id: 3, specFolder: SPEC_FOLDER });
    seedCausalEdge(db, {
      sourceId: '1',
      targetId: '2',
      relation: 'supports',
      evidence: 'outgoing edge evidence',
      sourceAnchor: 'source-anchor',
      targetAnchor: 'target-anchor',
      createdBy: 'manual',
    });
    seedCausalEdge(db, {
      sourceId: '3',
      targetId: '1',
      relation: 'caused',
      evidence: 'incoming edge evidence',
      createdBy: 'manual',
    });

    const response = await handleMemoryDelete({ id: 1, confirm: true });
    const envelope = parseResponse(response);

    expect(envelope.data.deleted).toBe(1);
    expect(activeEdgeCount(db)).toBe(0);

    const rows = tombstones(db);
    expect(rows).toHaveLength(2);
    expect(rows.map((row) => row.reason)).toEqual([
      'memory row mutation cleanup',
      'memory row mutation cleanup',
    ]);

    const metadata = JSON.parse(rows[0].restore_metadata);
    expect(metadata.edge).toMatchObject({
      source_id: '1',
      target_id: '2',
      source_anchor: 'source-anchor',
      target_anchor: 'target-anchor',
      evidence: 'outgoing edge evidence',
      created_by: 'manual',
    });
  });

  it('tombstones each removed active edge during bulk delete', async () => {
    seedMemoryRow(db, { id: 10, specFolder: SPEC_FOLDER, importanceTier: 'temporary' });
    seedMemoryRow(db, { id: 20, specFolder: SPEC_FOLDER, importanceTier: 'normal' });
    seedMemoryRow(db, { id: 30, specFolder: SPEC_FOLDER, importanceTier: 'normal' });
    seedCausalEdge(db, { sourceId: '10', targetId: '20', relation: 'supports' });
    seedCausalEdge(db, { sourceId: '30', targetId: '10', relation: 'enabled' });

    const response = await handleMemoryBulkDelete({
      tier: 'temporary',
      specFolder: SPEC_FOLDER,
      confirm: true,
      skipCheckpoint: true,
    });
    const envelope = parseResponse(response);

    expect(envelope.data.deleted).toBe(1);
    expect(activeEdgeCount(db)).toBe(0);
    expect(tombstones(db)).toHaveLength(2);
  });

  it('preserves the first tombstone timestamp on repeated single delete', async () => {
    process.env[SOFT_DELETE_FLAG] = 'true';
    seedMemoryRow(db, { id: 40, specFolder: SPEC_FOLDER });

    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date('2026-06-10T00:00:00.000Z'));
      expect(parseResponse(await handleMemoryDelete({ id: 40, confirm: true })).data.deleted).toBe(1);
      const firstDeletedAt = deletedAt(db, 40);
      expect(firstDeletedAt).toBe('2026-06-10T00:00:00.000Z');

      vi.setSystemTime(new Date('2026-06-12T00:00:00.000Z'));
      expect(parseResponse(await handleMemoryDelete({ id: 40, confirm: true })).data.deleted).toBe(1);
      expect(parseResponse(await handleMemoryDelete({ id: 40, confirm: true })).data.deleted).toBe(1);

      expect(deletedAt(db, 40)).toBe(firstDeletedAt);
      expect((db.prepare('SELECT COUNT(*) AS count FROM memory_index WHERE id = 40').get() as { count: number }).count).toBe(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it('preserves the first tombstone timestamp on repeated bulk delete', async () => {
    process.env[SOFT_DELETE_FLAG] = 'true';
    seedMemoryRow(db, { id: 50, specFolder: SPEC_FOLDER, importanceTier: 'temporary' });

    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date('2026-06-10T01:00:00.000Z'));
      expect(parseResponse(await handleMemoryBulkDelete({
        tier: 'temporary',
        specFolder: SPEC_FOLDER,
        confirm: true,
        skipCheckpoint: true,
      })).data.deleted).toBe(1);
      const firstDeletedAt = deletedAt(db, 50);
      expect(firstDeletedAt).toBe('2026-06-10T01:00:00.000Z');

      vi.setSystemTime(new Date('2026-06-13T01:00:00.000Z'));
      expect(parseResponse(await handleMemoryBulkDelete({
        tier: 'temporary',
        specFolder: SPEC_FOLDER,
        confirm: true,
        skipCheckpoint: true,
      })).data.deleted).toBe(1);
      expect(parseResponse(await handleMemoryBulkDelete({
        tier: 'temporary',
        specFolder: SPEC_FOLDER,
        confirm: true,
        skipCheckpoint: true,
      })).data.deleted).toBe(1);

      expect(deletedAt(db, 50)).toBe(firstDeletedAt);
      expect((db.prepare('SELECT COUNT(*) AS count FROM memory_index WHERE id = 50').get() as { count: number }).count).toBe(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it('manual causal unlink records reason and restore metadata', async () => {
    seedMemoryRow(db, { id: 101, specFolder: SPEC_FOLDER });
    seedMemoryRow(db, { id: 102, specFolder: SPEC_FOLDER });
    const edgeId = seedCausalEdge(db, {
      sourceId: '101',
      targetId: '102',
      relation: 'derived_from',
      evidence: 'manual unlink evidence',
      createdBy: 'manual',
    });
    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
    vi.spyOn(vectorIndex, 'initializeDb').mockImplementation(() => db as ReturnType<typeof vectorIndex.initializeDb>);
    vi.spyOn(vectorIndex, 'getDb').mockReturnValue(db as ReturnType<typeof vectorIndex.getDb>);

    const response = await handleMemoryCausalUnlink({ edgeId });
    const envelope = parseResponse(response);

    expect(envelope.data.deleted).toBe(true);
    expect(activeEdgeCount(db)).toBe(0);

    const [row] = tombstones(db);
    expect(row.reason).toBe('manual causal unlink');
    expect(row.lifecycle_generation).toBe(1);
    const metadata = JSON.parse(row.restore_metadata);
    expect(metadata).toMatchObject({ command: 'memory_causal_unlink' });
    expect(metadata.edge).toMatchObject({
      id: edgeId,
      source_id: '101',
      target_id: '102',
      relation: 'derived_from',
      evidence: 'manual unlink evidence',
    });
  });

  it('reports orphan edges before confirmed health repair and tombstones on repair', async () => {
    seedMemoryRow(db, { id: 201, specFolder: SPEC_FOLDER });
    seedCausalEdge(db, {
      sourceId: '201',
      targetId: '999',
      relation: 'supports',
      evidence: 'orphan edge evidence',
      createdBy: 'manual',
    });

    const report = parseResponse(await handleMemoryHealth({ reportMode: 'full' }));
    expect(report.data.causalEdges.orphanedEdges).toBe(1);
    expect(report.data.causalEdges.sample[0]).toMatchObject({
      sourceId: '201',
      targetId: '999',
      sourceExists: true,
      targetExists: false,
    });
    expect(activeEdgeCount(db)).toBe(1);
    expect(tombstones(db)).toHaveLength(0);

    const repaired = parseResponse(await handleMemoryHealth({
      reportMode: 'full',
      autoRepair: true,
      confirmed: true,
    }));

    expect(repaired.data.causalEdges.repaired).toBe(1);
    expect(repaired.data.causalEdges.tombstoned).toBe(1);
    expect(activeEdgeCount(db)).toBe(0);
    const [row] = tombstones(db);
    expect(row.reason).toBe('orphan causal edge cleanup');
  });
});
