// ───────────────────────────────────────────────────────────────
// MODULE: ensureActiveEmbedder tests
// ───────────────────────────────────────────────────────────────
// Covers manifest-based pointer resolution and provider backfill without
// probing a backend. A trusted skill_graph_scan owns writing skill vectors.
// ───────────────────────────────────────────────────────────────

import Database from 'better-sqlite3';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const autoSelectMocks = vi.hoisted(() => ({
  autoSelectActiveEmbedder: vi.fn(),
}));

vi.mock('@spec-kit/shared/embeddings/auto-select.js', () => ({
  autoSelectActiveEmbedder: autoSelectMocks.autoSelectActiveEmbedder,
}));

import {
  ensureActiveEmbedder,
  ensureVecMetadataTable,
  getActiveEmbedder,
  setActiveEmbedder,
} from '../../lib/embedders/schema.js';
import { listManifests } from '../../lib/embedders/registry.js';

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

function firstManifest() {
  const manifest = listManifests()[0];
  if (!manifest) {
    throw new Error('test requires a registered embedder manifest');
  }
  return manifest;
}

function totalChanges(db: Database.Database): number {
  const row = db.prepare('SELECT total_changes() AS count').get() as { count: number };
  return row.count;
}

describe('ensureActiveEmbedder', () => {
  beforeEach(() => vi.clearAllMocks());

  it('resolves the auto sentinel to the first registered manifest', async () => {
    const db = memoryDb();
    const manifest = firstManifest();
    expect(getActiveEmbedder(db)).toEqual({ name: 'auto', dim: 0 });

    const result = await ensureActiveEmbedder(db);

    expect(result).toEqual({ name: manifest.name, dim: manifest.dim, provider: 'ollama' });
    expect(getActiveEmbedder(db)).toEqual(result);
    expect(autoSelectMocks.autoSelectActiveEmbedder).not.toHaveBeenCalled();
  });

  it('resolves an unknown manifest name to the first registered manifest', async () => {
    const db = memoryDb();
    const manifest = firstManifest();
    setActiveEmbedder(db, 'unknown-embedder', manifest.dim);

    const result = await ensureActiveEmbedder(db);

    expect(result).toEqual({ name: manifest.name, dim: manifest.dim, provider: 'ollama' });
    expect(getActiveEmbedder(db)).toEqual(result);
    expect(autoSelectMocks.autoSelectActiveEmbedder).not.toHaveBeenCalled();
  });

  it('returns a known pointer unchanged', async () => {
    const db = memoryDb();
    const manifest = firstManifest();
    setActiveEmbedder(db, manifest.name, manifest.dim, 'ollama');
    const pointer = getActiveEmbedder(db);

    const result = await ensureActiveEmbedder(db);

    expect(result).toEqual(pointer);
    expect(getActiveEmbedder(db)).toEqual(pointer);
    expect(autoSelectMocks.autoSelectActiveEmbedder).not.toHaveBeenCalled();
  });

  it('backfills provider on a known pointer without a provider row', async () => {
    const db = memoryDb();
    const manifest = firstManifest();
    setActiveEmbedder(db, manifest.name, manifest.dim);
    expect(getActiveEmbedder(db)).toEqual({ name: manifest.name, dim: manifest.dim });

    const result = await ensureActiveEmbedder(db);

    expect(result).toEqual({ name: manifest.name, dim: manifest.dim, provider: 'ollama' });
    expect(getActiveEmbedder(db)).toEqual(result);
    expect(autoSelectMocks.autoSelectActiveEmbedder).not.toHaveBeenCalled();
  });

  it('leaves the persisted pointer unchanged on a second call', async () => {
    const db = memoryDb();
    const first = await ensureActiveEmbedder(db);
    const changesBeforeSecondCall = totalChanges(db);

    const second = await ensureActiveEmbedder(db);

    expect(second).toEqual(first);
    expect(totalChanges(db)).toBe(changesBeforeSecondCall);
    expect(autoSelectMocks.autoSelectActiveEmbedder).not.toHaveBeenCalled();
  });
});
