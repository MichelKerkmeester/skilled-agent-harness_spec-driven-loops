import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  runAutoMigrationIfNeeded,
  setAutoMigrationTestOverridesForTests,
} from '../../shared/embeddings/factory.js';
import { EmbeddingProfile } from '../../shared/embeddings/profile.js';

const LLAMA_MODEL = 'unsloth/embeddinggemma-300m-GGUF';
const ORIGINAL_AUTO_MIGRATE = process.env.MEMORY_AUTO_MIGRATE_HF_TO_LLAMA;

function createProfile(): EmbeddingProfile {
  return new EmbeddingProfile({
    provider: 'llama-cpp',
    model: 'unsloth-embeddinggemma-300m-GGUF',
    dim: 768,
    dtype: 'q8',
  });
}

function createMemoryStore(dbPath: string, rowCount: number, embeddingModel: string): void {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  try {
    db.exec(`
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY,
        content_text TEXT,
        embedding_model TEXT
      );
    `);
    const insert = db.prepare('INSERT INTO memory_index (id, content_text, embedding_model) VALUES (?, ?, ?)');
    for (let index = 1; index <= rowCount; index += 1) {
      insert.run(index, `fixture memory ${index}`, embeddingModel);
    }
  } finally {
    db.close();
  }
}

function createSourceStore(databaseDir: string, rowCount: number): string {
  const sourcePath = path.join(
    databaseDir,
    'context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite',
  );
  createMemoryStore(sourcePath, rowCount, 'onnx-community/embeddinggemma-300m-ONNX');
  return sourcePath;
}

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

function migrationResult(overrides: Partial<FakeMigrationResult> = {}): FakeMigrationResult {
  return {
    status: 'completed' as const,
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
    wall_clock_seconds: 0.012,
    started_at: new Date(0).toISOString(),
    completed_at: new Date(1).toISOString(),
    ...overrides,
  };
}

async function fakeCompletedMigration() {
  return migrationResult();
}

describe('llama-cpp auto migration', () => {
  let tempDir: string;
  let infoSpy: ReturnType<typeof vi.spyOn>;
  let stderrWriteSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-auto-migration-'));
    infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    stderrWriteSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    delete process.env.MEMORY_AUTO_MIGRATE_HF_TO_LLAMA;
    setAutoMigrationTestOverridesForTests({ databaseDir: tempDir });
  });

  afterEach(() => {
    setAutoMigrationTestOverridesForTests(null);
    if (ORIGINAL_AUTO_MIGRATE === undefined) {
      delete process.env.MEMORY_AUTO_MIGRATE_HF_TO_LLAMA;
    } else {
      process.env.MEMORY_AUTO_MIGRATE_HF_TO_LLAMA = ORIGINAL_AUTO_MIGRATE;
    }
    infoSpy.mockRestore();
    stderrWriteSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('skips when no hf-local source exists', async () => {
    const result = await runAutoMigrationIfNeeded(createProfile());

    expect(result).toMatchObject({
      status: 'skipped',
      reason: expect.stringMatching(/no hf-local source/),
    });
  });

  it('skips and preserves the pre-018 warning when env var disables migration', async () => {
    process.env.MEMORY_AUTO_MIGRATE_HF_TO_LLAMA = 'false';
    createSourceStore(tempDir, 3);

    const result = await runAutoMigrationIfNeeded(createProfile());

    expect(warnSpy).toHaveBeenCalledWith(
      "MIGRATION_PENDING: hf-local store contains 3 rows. Run 'tsx .opencode/skills/system-spec-kit/scripts/migrate-embeddings-to-llama-cpp.ts' to migrate.",
    );
    expect(result).toMatchObject({
      status: 'skipped',
      reason: expect.stringMatching(/opt-out/),
    });
  });

  it('migrates successfully, deletes source companions, and writes a marker', async () => {
    const sourcePath = createSourceStore(tempDir, 4);
    fs.writeFileSync(`${sourcePath}-shm`, '');
    fs.writeFileSync(`${sourcePath}-wal`, '');
    const targetPath = createProfile().getDatabasePath(tempDir);
    const runMigration = vi.fn(async () => {
      createMemoryStore(targetPath, 4, LLAMA_MODEL);
      return migrationResult({
        source: sourcePath,
        target: targetPath,
        source_rows: 4,
        target_rows: 4,
        migrated_rows: 4,
        wall_clock_seconds: 0.02,
      });
    });
    setAutoMigrationTestOverridesForTests({ databaseDir: tempDir, runMigration });

    const result = await runAutoMigrationIfNeeded(createProfile());

    expect(result).toMatchObject({
      status: 'completed',
      sourceRows: 4,
      targetRows: 4,
    });
    expect(fs.existsSync(sourcePath)).toBe(false);
    expect(fs.existsSync(`${sourcePath}-shm`)).toBe(false);
    expect(fs.existsSync(`${sourcePath}-wal`)).toBe(false);
    expect(fs.existsSync(path.join(tempDir, '.auto-migration-complete.json'))).toBe(true);
    expect(stderrWriteSpy).toHaveBeenCalledWith(expect.stringContaining('AUTO_MIGRATION_COMPLETE'));
    expect(infoSpy).not.toHaveBeenCalled();
  });

  it('keeps the source and returns hf-local fallback on validation failure', async () => {
    const sourcePath = createSourceStore(tempDir, 2);
    const targetPath = createProfile().getDatabasePath(tempDir);
    const runMigration = vi.fn(async () => {
      createMemoryStore(targetPath, 2, LLAMA_MODEL);
      return migrationResult({
        source: sourcePath,
        target: targetPath,
        source_rows: 2,
        target_rows: 2,
        mismatches: 1,
        reason: 'fixture mismatch',
      });
    });
    setAutoMigrationTestOverridesForTests({ databaseDir: tempDir, runMigration });

    const result = await runAutoMigrationIfNeeded(createProfile());

    expect(fs.existsSync(sourcePath)).toBe(true);
    expect(result).toMatchObject({
      status: 'failed',
      preservedSource: sourcePath,
      fallbackProvider: 'hf-local',
    });
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('AUTO_MIGRATION_FAILED'));
  });

  it('skips when the llama-cpp target is already populated', async () => {
    createSourceStore(tempDir, 5);
    createMemoryStore(createProfile().getDatabasePath(tempDir), 5, LLAMA_MODEL);
    const runMigration = vi.fn(fakeCompletedMigration);
    setAutoMigrationTestOverridesForTests({ databaseDir: tempDir, runMigration });

    const result = await runAutoMigrationIfNeeded(createProfile());

    expect(runMigration).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      status: 'skipped',
      reason: expect.stringMatching(/already migrated|target up to date/),
    });
  });
});
