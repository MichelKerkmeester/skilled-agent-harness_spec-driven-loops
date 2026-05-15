// ───────────────────────────────────────────────────────────────────
// MODULE: Local LLM Auto Migration Tests
// ───────────────────────────────────────────────────────────────────

import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import Database from 'better-sqlite3';
import { getLlamaCppAvailability } from '../../../shared/embeddings/llama-cpp-availability.js';
import {
  runAutoMigrationIfNeeded,
  setAutoMigrationTestOverridesForTests,
} from '../../../shared/embeddings/factory.js';
import { EmbeddingProfile } from '../../../shared/embeddings/profile.js';

interface FakeMigrationResult {
  status: 'completed' | 'no-op' | 'failed';
  source: string;
  target: string;
  source_rows: number;
  target_rows: number;
  migrated_rows: number;
  skipped_rows: number;
  pruned_target_only_rows: number;
  summary_rows: number;
  validation_sample_size: number;
  mismatches: number;
  wall_clock_seconds: number;
  started_at: string;
  completed_at: string;
  reason?: string;
}

const originalEnv = { ...process.env };
const llamaAvailable = getLlamaCppAvailability().available;
const llamaModel = 'unsloth/embeddinggemma-300m-GGUF';
let tempDir: string;

function createProfile(): EmbeddingProfile {
  return new EmbeddingProfile({
    provider: 'llama-cpp',
    model: 'unsloth-embeddinggemma-300m-gguf',
    dim: 768,
    dtype: 'q8',
  });
}

function createMemoryStore(dbPath: string, rowCount: number, embeddingModel: string): void {
  const db = new Database(dbPath);
  try {
    db.exec('CREATE TABLE memory_index (id INTEGER PRIMARY KEY, content_text TEXT, embedding_model TEXT);');
    const insert = db.prepare('INSERT INTO memory_index (id, content_text, embedding_model) VALUES (?, ?, ?)');
    for (let index = 1; index <= rowCount; index += 1) {
      insert.run(index, `fixture memory ${index}`, embeddingModel);
    }
  } finally {
    db.close();
  }
}

function createSourceStore(rowCount: number): string {
  const sourcePath = path.join(
    tempDir,
    'context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite',
  );
  createMemoryStore(sourcePath, rowCount, 'onnx-community/embeddinggemma-300m-ONNX');
  return sourcePath;
}

function migrationResult(overrides: Partial<FakeMigrationResult> = {}): FakeMigrationResult {
  return {
    status: 'completed',
    source: '',
    target: '',
    source_rows: 0,
    target_rows: 0,
    migrated_rows: 0,
    skipped_rows: 0,
    pruned_target_only_rows: 0,
    summary_rows: 0,
    validation_sample_size: 10,
    mismatches: 0,
    wall_clock_seconds: 0.01,
    started_at: new Date(0).toISOString(),
    completed_at: new Date(1).toISOString(),
    ...overrides,
  };
}

describe('local LLM auto migration', () => {
  // CLAIM: shared/embeddings/factory.ts runAutoMigrationIfNeeded — llama-cpp startup migrates populated hf-local stores unless MEMORY_AUTO_MIGRATE_HF_TO_LLAMA=false.
  beforeAll(() => undefined);

  beforeEach(() => {
    tempDir = mkdtempSync(path.join(tmpdir(), 'spec-kit-test-'));
    writeFileSync(path.join(tempDir, 'claim.txt'), 'auto-migration');
    process.env = { ...originalEnv };
    delete process.env.MEMORY_AUTO_MIGRATE_HF_TO_LLAMA;
    setAutoMigrationTestOverridesForTests({ databaseDir: tempDir });
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    setAutoMigrationTestOverridesForTests(null);
    vi.restoreAllMocks();
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  afterAll(() => undefined);

  it.skipIf(!llamaAvailable)('T1 empty hf-local DB is skipped without writing a marker', async () => {
    createSourceStore(0);

    const result = await runAutoMigrationIfNeeded(createProfile());

    expect(result).toMatchObject({ status: 'skipped' });
    expect(existsSync(path.join(tempDir, '.auto-migration-complete.json'))).toBe(false);
  });

  it.skipIf(!llamaAvailable)('T2 populated hf-local DB re-embeds rows into the llama-cpp profile DB', async () => {
    const sourcePath = createSourceStore(4);
    const targetPath = createProfile().getDatabasePath(tempDir);
    const runMigration = vi.fn(async () => {
      createMemoryStore(targetPath, 4, llamaModel);
      return migrationResult({
        source: sourcePath,
        target: targetPath,
        source_rows: 4,
        target_rows: 4,
        migrated_rows: 4,
      });
    });
    setAutoMigrationTestOverridesForTests({ databaseDir: tempDir, runMigration });

    const result = await runAutoMigrationIfNeeded(createProfile());

    expect(runMigration).toHaveBeenCalledOnce();
    expect(result).toMatchObject({ status: 'completed', sourceRows: 4, targetRows: 4 });
    expect(existsSync(path.join(tempDir, '.auto-migration-complete.json'))).toBe(true);
  });

  it.skipIf(!llamaAvailable)('T3 MEMORY_AUTO_MIGRATE_HF_TO_LLAMA=false skips migration and marker creation', async () => {
    process.env.MEMORY_AUTO_MIGRATE_HF_TO_LLAMA = 'false';
    createSourceStore(3);
    const runMigration = vi.fn(async () => migrationResult());
    setAutoMigrationTestOverridesForTests({ databaseDir: tempDir, runMigration });

    const result = await runAutoMigrationIfNeeded(createProfile());

    expect(runMigration).not.toHaveBeenCalled();
    expect(result).toMatchObject({ status: 'skipped', reason: expect.stringMatching(/opt-out/) });
    expect(existsSync(path.join(tempDir, '.auto-migration-complete.json'))).toBe(false);
  });

  it.skipIf(!llamaAvailable)('T4 populated target plus marker skips subsequent migration runs', async () => {
    createSourceStore(2);
    createMemoryStore(createProfile().getDatabasePath(tempDir), 2, llamaModel);
    writeFileSync(path.join(tempDir, '.auto-migration-complete.json'), '{"fixture":true}\n');
    const runMigration = vi.fn(async () => migrationResult());
    setAutoMigrationTestOverridesForTests({ databaseDir: tempDir, runMigration });

    const result = await runAutoMigrationIfNeeded(createProfile());

    expect(runMigration).not.toHaveBeenCalled();
    expect(result).toMatchObject({ status: 'skipped', reason: expect.stringMatching(/already migrated|target up to date/) });
  });
});
