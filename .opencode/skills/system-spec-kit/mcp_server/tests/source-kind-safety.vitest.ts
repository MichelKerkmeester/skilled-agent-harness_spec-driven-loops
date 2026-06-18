import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { executeAutoPromotion, scanForPromotions } from '../lib/search/auto-promotion';
import { createSchema, ensureSchemaVersion } from '../lib/search/vector-index-schema';
import { retirePredecessorForActiveReindex } from '../lib/storage/lineage-state';

describe('source_kind safety guards', () => {
  let database: Database.Database;

  beforeEach(() => {
    database = new Database(':memory:');
  });

  afterEach(() => {
    database.close();
  });

  it('retirePredecessorForActiveReindex preserves human-authored active tiers', () => {
    createSchema(database, {
      sqlite_vec_available: false,
      get_embedding_dim: () => 4,
    });
    ensureSchemaVersion(database);

    const insertMemory = (id: number, filePath: string, sourceKind: string, tier: string): void => {
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
          content_text,
          source_kind
        ) VALUES (?, 'specs/source-kind-safety', ?, ?, ?, '[]', 0.5, ?, ?, 'pending', ?, 'general', ?, ?)
      `).run(
        id,
        filePath,
        filePath,
        `memory-${id}`,
        '2026-03-13T08:00:00.000Z',
        '2026-03-13T08:00:00.000Z',
        tier,
        `body ${id}`,
        sourceKind,
      );
    };

    // A human-authored predecessor is still deprecated to free the active-row
    // uniqueness slot (so the successor insert cannot collide), but retire
    // surfaces the manual tier so the caller carries it onto the successor.
    insertMemory(1, '/tmp/source-kind-human.md', 'human', 'important');
    const carry = retirePredecessorForActiveReindex(database, 1);
    expect(carry).toEqual({ importanceTier: 'important', sourceKind: 'human' });
    expect(
      (database.prepare('SELECT importance_tier FROM memory_index WHERE id = ?').get(1) as { importance_tier: string }).importance_tier,
    ).toBe('deprecated');

    // A system-authored predecessor carries nothing forward and is deprecated.
    insertMemory(2, '/tmp/source-kind-system.md', 'system', 'normal');
    expect(retirePredecessorForActiveReindex(database, 2)).toBeNull();
    expect(
      (database.prepare('SELECT importance_tier FROM memory_index WHERE id = ?').get(2) as { importance_tier: string }).importance_tier,
    ).toBe('deprecated');
  });

  it('auto-promotion refuses human-authored tier decisions', () => {
    database.exec(`
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY,
        title TEXT,
        validation_count INTEGER DEFAULT 0,
        confidence REAL DEFAULT 0.5,
        importance_tier TEXT DEFAULT 'normal',
        source_kind TEXT,
        provenance_source TEXT,
        provenance_actor TEXT,
        updated_at TEXT
      )
    `);

    database.prepare(`
      INSERT INTO memory_index (id, title, validation_count, confidence, importance_tier, source_kind)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(1, 'manual memory', 5, 0.95, 'normal', 'human');
    database.prepare(`
      INSERT INTO memory_index (id, title, validation_count, confidence, importance_tier, source_kind)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(2, 'feedback memory', 5, 0.95, 'normal', 'feedback');

    const blocked = executeAutoPromotion(database, 1);
    expect(blocked.promoted).toBe(false);
    expect(blocked.reason).toContain('source_kind_not_promotable');
    expect(
      (database.prepare('SELECT importance_tier FROM memory_index WHERE id = ?').get(1) as { importance_tier: string }).importance_tier,
    ).toBe('normal');

    const eligible = scanForPromotions(database);
    expect(eligible).toHaveLength(1);
    expect(eligible[0].newTier).toBe('important');

    const promoted = executeAutoPromotion(database, 2);
    expect(promoted.promoted).toBe(true);
    expect(
      (database.prepare('SELECT importance_tier FROM memory_index WHERE id = ?').get(2) as { importance_tier: string }).importance_tier,
    ).toBe('important');
  });
});
