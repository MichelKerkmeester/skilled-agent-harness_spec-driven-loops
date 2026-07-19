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
  vector_search,
} from '../lib/search/vector-index-queries.js';

const DIM = 4;

function embedding(value: number): Float32Array {
  return Float32Array.from([value, value / 2, value / 3, value / 4]);
}

function vector(values: [number, number, number, number]): Float32Array {
  return Float32Array.from(values);
}

function vectorBuffer(value: Float32Array): Buffer {
  return Buffer.from(value.buffer, value.byteOffset, value.byteLength);
}

function embeddingBuffer(value: number): Buffer {
  return vectorBuffer(embedding(value));
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
        trigger_phrases TEXT,
        context_type TEXT,
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

  it('orders equal-distance vector rows by stable memory id without changing primary distance order', () => {
    const memoryInsert = db.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, embedding_status)
      VALUES (?, ?, ?, 'success')
    `);
    const vecInsert = db.prepare(`INSERT INTO active_vec.vec_${DIM} (id, vec) VALUES (?, ?)`);
    const knnInsert = db.prepare('INSERT INTO active_vec.vec_memories (rowid, embedding) VALUES (?, ?)');
    const insertVector = (id: number, specFolder: string, values: [number, number, number, number]) => {
      const buffer = vectorBuffer(vector(values));
      memoryInsert.run(id, specFolder, `doc-${id}.md`);
      vecInsert.run(id, buffer);
      knnInsert.run(BigInt(id), buffer);
    };

    insertVector(200, 'specs/tied-vector', [1, 0, 0, 0]);
    insertVector(100, 'specs/tied-vector', [1, 0, 0, 0]);
    insertVector(400, 'specs/non-tied-vector', [1, 0, 0, 0]);
    insertVector(50, 'specs/non-tied-vector', [0, 1, 0, 0]);

    const tiedOrders = Array.from({ length: 3 }, () =>
      vector_search(vector([1, 0, 0, 0]), {
        limit: 2,
        specFolder: 'specs/tied-vector',
        useDecay: false,
        includeConstitutional: false,
      }, db).map(row => row.id)
    );

    expect(tiedOrders).toEqual([
      [100, 200],
      [100, 200],
      [100, 200],
    ]);

    const primaryOrder = vector_search(vector([1, 0, 0, 0]), {
      limit: 2,
      specFolder: 'specs/non-tied-vector',
      useDecay: false,
      includeConstitutional: false,
    }, db).map(row => row.id);

    expect(primaryOrder).toEqual([400, 50]);
  });

  it('keeps every ranked vector query shape on a stable secondary id order', () => {
    const source = fs.readFileSync(
      path.resolve(import.meta.dirname, '..', 'lib/search/vector-index-queries.ts'),
      'utf8',
    );

    expect(source).toContain('ORDER BY distance ASC,\n             m.id ASC');
    expect(source).toContain('ORDER BY knn.distance ASC,\n                 m.id ASC');
    expect(source).toContain('ORDER BY (sub.distance - (sub.effective_importance * 0.1)) ASC,\n             sub.id ASC');
    expect(source).toContain('ORDER BY avg_distance ASC,\n             sub.id ASC');
  });
});
