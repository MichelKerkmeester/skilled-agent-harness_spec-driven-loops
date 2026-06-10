import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import Database from 'better-sqlite3';
import * as sqliteVec from 'sqlite-vec';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { EmbeddingProfile } from '@spec-kit/shared/embeddings/profile';
import { setActiveEmbedder } from '../lib/embedders/schema.js';
import { attachActiveVectorShard, detachActiveVectorShard } from '../lib/search/vector-index-store.js';
import {
  benchmarkKnnQueryShapes,
  shouldAdoptMatchQueryShape,
} from '../lib/search/vector-index-queries.js';

const DIM = 4;

function embedding(value: number): Float32Array {
  return Float32Array.from([value, value / 2, value / 3, value / 4]);
}

function embeddingBuffer(value: number): Buffer {
  const vector = embedding(value);
  return Buffer.from(vector.buffer, vector.byteOffset, vector.byteLength);
}

describe('vector KNN query-shape benchmark', () => {
  let tempDir: string;
  let db: Database.Database;
  let profile: EmbeddingProfile;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vector-knn-benchmark-'));
    db = new Database(path.join(tempDir, 'context-index.sqlite'));
    sqliteVec.load(db);
    profile = new EmbeddingProfile({ provider: 'ollama', model: 'knn-benchmark-model', dim: DIM, dtype: null, baseUrl: null });
    setActiveEmbedder(db, profile.model, profile.dim, 'ollama');
    attachActiveVectorShard(db, profile);
    db.exec(`
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY,
        spec_folder TEXT,
        file_path TEXT,
        importance_tier TEXT DEFAULT 'normal',
        importance_weight REAL DEFAULT 0.5,
        embedding_status TEXT DEFAULT 'success',
        expires_at TEXT,
        is_pinned INTEGER DEFAULT 0,
        last_review TEXT,
        review_count INTEGER DEFAULT 0,
        stability REAL,
        updated_at TEXT DEFAULT (datetime('now'))
      );
      CREATE VIEW active_memory_projection AS SELECT id AS active_memory_id FROM memory_index;
    `);
    const memoryInsert = db.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, embedding_status)
      VALUES (?, 'specs/knn', ?, 'success')
    `);
    const vecInsert = db.prepare(`INSERT INTO active_vec.vec_${DIM} (id, vec) VALUES (?, ?)`);
    const knnInsert = db.prepare('INSERT INTO active_vec.vec_memories (rowid, embedding) VALUES (?, ?)');
    const writeRows = db.transaction(() => {
      for (let i = 1; i <= 32; i += 1) {
        memoryInsert.run(i, `doc-${i}.md`);
        vecInsert.run(i, embeddingBuffer(i));
        knnInsert.run(BigInt(i), embeddingBuffer(i));
      }
    });
    writeRows();
  });

  afterEach(() => {
    try { detachActiveVectorShard(db); } catch { /* best-effort */ }
    try { db.close(); } catch { /* best-effort */ }
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('records scalar JOIN vs vec0 MATCH timings and gates adoption at >20 percent', () => {
    const result = benchmarkKnnQueryShapes(embedding(1), { iterations: 2, limit: 8 }, db);

    console.info(
      `KNN query-shape benchmark: corpus=${result.corpusSize} scalar_ms=${result.scalarJoinAverageMs.toFixed(4)} ` +
      `match_ms=${result.matchAverageMs?.toFixed(4) ?? 'n/a'} decision=${result.decision}`,
    );
    expect(result.corpusSize).toBe(32);
    expect(result.scalarJoinAverageMs).toBeGreaterThanOrEqual(0);
    expect(result.decision).toBe(
      result.matchSupported && (result.matchImprovementPct ?? 0) > 20 ? 'adopt_match' : 'keep_scalar_join',
    );
    expect(shouldAdoptMatchQueryShape({ matchSupported: true, matchImprovementPct: 20 })).toBe(false);
    expect(shouldAdoptMatchQueryShape({ matchSupported: true, matchImprovementPct: 20.1 })).toBe(true);
  });
});
