// ---------------------------------------------------------------
// TEST: Entity Density Commit Hooks
// ---------------------------------------------------------------
// Verifies that cache invalidation makes committed memory mutations visible
// immediately instead of waiting for the entity-density 60s TTL.

import type Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { handleMemoryBulkDelete } from '../../handlers/memory-bulk-delete';
import {
  getEntityDensityScore,
  invalidateEntityDensityCache,
  MIN_OUTGOING_EDGES,
} from '../../lib/search/entity-density';
import {
  createMemoryDbFixture,
  disposeMemoryDbFixture,
  seedCausalEdge,
  seedMemoryRow,
} from '../helpers/memory-db-fixture';

const SPEC_FOLDER = 'specs/t1-3-entity-density-hooks';

let db: Database.Database;

function seedHighDegreeMemory(input: {
  id: number;
  title: string;
  triggerPhrase: string;
  importanceTier?: string;
}): void {
  seedMemoryRow(db, {
    id: input.id,
    specFolder: SPEC_FOLDER,
    filePath: `${SPEC_FOLDER}/${input.triggerPhrase}.md`,
    title: input.title,
    triggerPhrases: [input.triggerPhrase],
    importanceTier: input.importanceTier ?? 'important',
  });

  for (let i = 0; i < MIN_OUTGOING_EDGES; i++) {
    seedCausalEdge(db, {
      sourceId: String(input.id),
      targetId: `target-${input.id}-${i}`,
      relation: 'supports',
      evidence: 'entity-density hook fixture',
    });
  }
}

describe('entity-density commit hooks', () => {
  beforeEach(() => {
    invalidateEntityDensityCache();
    db = createMemoryDbFixture();
  });

  afterEach(() => {
    invalidateEntityDensityCache();
    disposeMemoryDbFixture(db);
  });

  it('entity-density cache reflects bulk-delete without TTL wait (REQ-T1-002)', async () => {
    const query = 'bulkdeletehook';
    seedHighDegreeMemory({
      id: 101,
      title: 'Bulk delete cache fixture',
      triggerPhrase: query,
      importanceTier: 'temporary',
    });

    expect(getEntityDensityScore(query, db)).toBeGreaterThan(0);

    const response = await handleMemoryBulkDelete({
      tier: 'temporary',
      specFolder: SPEC_FOLDER,
      confirm: true,
      skipCheckpoint: true,
    });
    const envelope = JSON.parse(response.content[0].text);
    expect(envelope.data?.deleted).toBe(1);

    expect(getEntityDensityScore(query, db)).toBe(0);
  });

  it('entity-density cache reflects save invalidation without TTL wait (REQ-T1-001)', () => {
    const query = 'memorysavehook';
    seedHighDegreeMemory({
      id: 201,
      title: 'Memory save cache fixture',
      triggerPhrase: query,
    });

    expect(getEntityDensityScore(query, db)).toBeGreaterThan(0);

    db.prepare('UPDATE memory_index SET trigger_phrases = ? WHERE id = ?')
      .run(JSON.stringify(['replacementhook']), 201);
    expect(getEntityDensityScore(query, db)).toBeGreaterThan(0);

    invalidateEntityDensityCache();

    expect(getEntityDensityScore(query, db)).toBe(0);
  });
});
