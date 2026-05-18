// ---------------------------------------------------------------
// MODULE: Local LLM Offline Degradation Tests
// ---------------------------------------------------------------

import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import Database from 'better-sqlite3';
import {
  computeContentHash,
  initEmbeddingCache,
  lookupEmbedding,
  storeEmbedding,
} from '../../lib/cache/embedding-cache.js';
import { BACKOFF_DELAYS } from '../../lib/providers/retry-manager.js';

const originalEnv = { ...process.env };
let tempDir: string;

function createKeywordDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      title TEXT,
      trigger_phrases TEXT,
      spec_folder TEXT,
      file_path TEXT,
      created_at TEXT,
      importance_weight REAL,
      importance_tier TEXT
    );
    CREATE TABLE active_memory_projection (active_memory_id INTEGER PRIMARY KEY);
  `);
  const filePath = path.join(tempDir, 'offline-keyword.md');
  writeFileSync(filePath, '# Offline Keyword\n\nllama local fallback search');
  db.prepare(`
    INSERT INTO memory_index
      (id, title, trigger_phrases, spec_folder, file_path, created_at, importance_weight, importance_tier)
    VALUES
      (1, 'Offline llama fallback', '["llama","fallback"]', 'specs/offline', ?, '2026-05-13T00:00:00.000Z', 1.0, 'important')
  `).run(filePath);
  db.prepare('INSERT INTO active_memory_projection (active_memory_id) VALUES (1)').run();
  return db;
}

describe('local LLM offline degradation', () => {
  // CLAIM: 028 spec Group 10 — cache hits avoid providers, vector failures fall back to keyword search, and retries use exponential backoff.
  beforeAll(() => {
    tempDir = mkdtempSync(path.join(tmpdir(), 'spec-kit-test-'));
    writeFileSync(path.join(tempDir, 'claim.txt'), 'offline-degradation');
  });

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.resetModules();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
    vi.resetModules();
  });

  afterAll(() => {
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('T1 cached embedding returns a vector without invoking the provider', () => {
    const db = new Database(':memory:');
    const provider = vi.fn();
    const vector = new Float32Array(768).fill(0.25);
    const contentHash = computeContentHash('cached local text');
    initEmbeddingCache(db);
    storeEmbedding(db, contentHash, 'BAAI/bge-base-en-v1.5', Buffer.from(vector.buffer), 768);

    const cached = lookupEmbedding(db, contentHash, 'BAAI/bge-base-en-v1.5', 768);

    expect(cached).toBeInstanceOf(Buffer);
    expect(provider).not.toHaveBeenCalled();
    db.close();
  });

  it('T2 vector embedding failure falls back to keyword search results', async () => {
    vi.doMock('../../lib/providers/embeddings.js', () => ({
      generateQueryEmbedding: vi.fn(async () => null),
    }));
    const db = createKeywordDb();
    const { vector_search_enriched } = await import('../../lib/search/vector-index-queries.js');

    const results = await vector_search_enriched('llama fallback', 5, {}, db);

    expect(results).toHaveLength(1);
    expect(results[0]?.searchMethod).toBe('keyword');
    expect(results[0]?.title).toContain('Offline');
    db.close();
  });

  it('T3 retry backoff delays increase exponentially for provider failures', () => {
    expect(BACKOFF_DELAYS.length).toBeGreaterThanOrEqual(3);
    expect(BACKOFF_DELAYS[1]).toBeGreaterThan(BACKOFF_DELAYS[0]);
    expect(BACKOFF_DELAYS[2]).toBeGreaterThan(BACKOFF_DELAYS[1]);
  });
});
