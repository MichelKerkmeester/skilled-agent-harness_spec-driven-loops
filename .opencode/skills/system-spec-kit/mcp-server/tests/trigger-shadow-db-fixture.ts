import Database from 'better-sqlite3';

import { computeContentHash, storeEmbedding } from '../lib/cache/embedding-cache';
import { normalizeTriggerText } from '../lib/parsing/trigger-matcher';
import { createSchema, ensureSchemaVersion } from '../lib/search/vector-index-schema';
import type { TriggerGoldensFixture } from './trigger-golden-fixture';
import { syntheticVector } from './trigger-golden-fixture';

export const triggerTestProfile = {
  provider: 'test',
  model: 'test-model',
  dim: 48,
  key: 'test:test-model:48',
};

export function createTriggerDatabase(): Database.Database {
  const database = new Database(':memory:');
  createSchema(database, {
    sqlite_vec_available: false,
    get_embedding_dim: () => triggerTestProfile.dim,
  });
  ensureSchemaVersion(database);
  return database;
}

export function insertTriggerMemory(database: Database.Database, id: number, phrases: string[]): void {
  database.prepare(`
    INSERT INTO memory_index (
      id, spec_folder, file_path, title, trigger_phrases,
      created_at, updated_at, importance_tier, context_type, embedding_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    'trigger/goldens',
    `/workspace/trigger-goldens/${id}.md`,
    `Trigger ${id}`,
    JSON.stringify(phrases),
    '2026-06-10T00:00:00.000Z',
    '2026-06-10T00:00:00.000Z',
    'normal',
    'implementation',
    'success',
  );
}

export function insertTriggerEmbedding(
  database: Database.Database,
  memoryId: number,
  phrase: string,
  embedding: Float32Array,
): void {
  const phraseHash = computeContentHash(normalizeTriggerText(phrase));
  database.prepare(`
    INSERT INTO memory_trigger_embeddings (
      memory_id, phrase_hash, profile_key, input_kind, model_id, dimensions, embedding_status
    ) VALUES (?, ?, ?, 'document', ?, ?, 'ready')
  `).run(memoryId, phraseHash, triggerTestProfile.key, triggerTestProfile.model, triggerTestProfile.dim);
  storeEmbedding(
    database,
    phraseHash,
    triggerTestProfile.model,
    Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength),
    embedding.length,
    { profileKey: triggerTestProfile.key, inputKind: 'document' },
  );
}

export function storeQueryEmbedding(database: Database.Database, prompt: string, embedding: Float32Array): void {
  storeEmbedding(
    database,
    computeContentHash(prompt.trim()),
    triggerTestProfile.model,
    Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength),
    embedding.length,
    { profileKey: triggerTestProfile.key, inputKind: 'query' },
  );
}

export function insertGoldenTriggerEmbeddings(database: Database.Database, fixture: TriggerGoldensFixture): void {
  for (const golden of fixture.cases) {
    insertTriggerMemory(database, golden.memoryId, [golden.triggerPhrase]);
    insertTriggerEmbedding(
      database,
      golden.memoryId,
      golden.triggerPhrase,
      syntheticVector(fixture.metadata.vectorModel.dimensions, golden.basis, 'exact'),
    );
  }
}
