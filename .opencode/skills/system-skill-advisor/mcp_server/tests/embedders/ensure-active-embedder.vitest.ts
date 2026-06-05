// ───────────────────────────────────────────────────────────────
// MODULE: ensureActiveEmbedder tests
// ───────────────────────────────────────────────────────────────
// Covers the cascade integration helper that flips the persisted active
// pointer from the `'auto'` sentinel to a concrete embedder via the shared
// auto-select cascade.
//
// Scenarios:
//   1. Pointer is 'auto' → cascade fires → winner persisted.
//   2. Pointer is set (nomic) → cascade skipped → existing pointer returned.
//   3. Pointer is orphan (embeddinggemma-300m, post-purge) → cascade fires
//      → winner persisted (migration safety net).
//   4. `contentType` parameter is plumbed through to the cascade.
// ───────────────────────────────────────────────────────────────

import Database from 'better-sqlite3';
import { describe, expect, it, vi } from 'vitest';
import type { AutoSelectResult } from '@spec-kit/shared/embeddings/auto-select.js';

import {
  ensureActiveEmbedder,
  ensureVecMetadataTable,
  getActiveEmbedder,
  setActiveEmbedder,
} from '../../lib/embedders/schema.js';

function memoryDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE skill_nodes (
      id TEXT PRIMARY KEY
    )
  `);
  ensureVecMetadataTable(db);
  return db;
}

function fakeWinner(name: string, dim: number, provider: AutoSelectResult['provider']): AutoSelectResult {
  return {
    name,
    dim,
    provider,
    probes: [{ tier: provider, ok: true, reason: `fake winner ${name}` }],
  };
}

describe('ensureActiveEmbedder', () => {
  it('runs the cascade when pointer is the auto sentinel', async () => {
    const db = memoryDb();
    expect(getActiveEmbedder(db)).toEqual({ name: 'auto', dim: 0 });

    const autoSelect = vi.fn(async () => fakeWinner('nomic-embed-text-v1.5', 768, 'ollama'));

    const result = await ensureActiveEmbedder(db, { autoSelect });

    expect(autoSelect).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ name: 'nomic-embed-text-v1.5', dim: 768 });
    expect(getActiveEmbedder(db)).toEqual({ name: 'nomic-embed-text-v1.5', dim: 768 });
  });

  it('skips the cascade when a concrete known pointer is already persisted', async () => {
    const db = memoryDb();
    setActiveEmbedder(db, 'nomic-embed-text-v1.5', 768);

    const autoSelect = vi.fn(async () => fakeWinner('nomic-embed-text-v1.5', 768, 'ollama'));

    const result = await ensureActiveEmbedder(db, { autoSelect });

    expect(autoSelect).not.toHaveBeenCalled();
    expect(result).toEqual({ name: 'nomic-embed-text-v1.5', dim: 768 });
  });

  it('runs the cascade when pointer references a manifest no longer in the registry', async () => {
    const db = memoryDb();
    // Pre-phase-007 install: legacy gemma pointer still in vec_metadata.
    setActiveEmbedder(db, 'embeddinggemma-300m', 768);

    const autoSelect = vi.fn(async () => fakeWinner('nomic-embed-text-v1.5', 768, 'ollama'));

    const result = await ensureActiveEmbedder(db, { autoSelect });

    expect(autoSelect).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ name: 'nomic-embed-text-v1.5', dim: 768 });
    expect(getActiveEmbedder(db)).toEqual({ name: 'nomic-embed-text-v1.5', dim: 768 });
  });

  it('passes contentType through to the cascade (defaults to text)', async () => {
    const db = memoryDb();
    const autoSelect = vi.fn(async () => fakeWinner('nomic-embed-text-v1.5', 768, 'ollama'));

    await ensureActiveEmbedder(db, { autoSelect });
    expect(autoSelect).toHaveBeenLastCalledWith(expect.objectContaining({ contentType: 'text' }));

    // Reset by clearing the vec_metadata pointer rows so the next call triggers
    // the cascade again. `setActiveEmbedder(db, 'auto', 0)` is rejected by
    // `validateDim`, which is correct — the `'auto'` sentinel lives in the
    // application-layer default, not in the persistent table.
    db.prepare('DELETE FROM vec_metadata WHERE key IN (?, ?)').run(
      'active_embedder_name',
      'active_embedder_dim',
    );

    await ensureActiveEmbedder(db, { autoSelect, contentType: 'code' });
    expect(autoSelect).toHaveBeenLastCalledWith(expect.objectContaining({ contentType: 'code' }));
  });

  it('persists the winner so a second call is a no-op', async () => {
    const db = memoryDb();
    const autoSelect = vi.fn(async () => fakeWinner('nomic-embed-text-v1.5', 768, 'ollama'));

    const first = await ensureActiveEmbedder(db, { autoSelect });
    const second = await ensureActiveEmbedder(db, { autoSelect });

    expect(autoSelect).toHaveBeenCalledTimes(1);
    expect(first).toEqual(second);
    expect(first).toEqual({ name: 'nomic-embed-text-v1.5', dim: 768 });
  });
});
