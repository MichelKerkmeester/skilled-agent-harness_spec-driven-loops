import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import type { MCPEnvelope } from '../lib/response/envelope.js';
import type { MCPResponse } from '../handlers/types.js';

const originalCwd = process.cwd();
const originalEnv = {
  MEMORY_DB_PATH: process.env.MEMORY_DB_PATH,
  SPEC_KIT_DB_DIR: process.env.SPEC_KIT_DB_DIR,
  SPECKIT_DB_DIR: process.env.SPECKIT_DB_DIR,
};

function restoreEnv(): void {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function parseEnvelope<T>(response: MCPResponse): MCPEnvelope<T> {
  const text = response.content[0]?.text;
  if (typeof text !== 'string') {
    throw new Error('Expected text response');
  }
  return JSON.parse(text) as MCPEnvelope<T>;
}

async function importRuntimeModules(): Promise<{
  vectorIndex: typeof import('../lib/search/vector-index.js');
  dbState: typeof import('../core/db-state.js');
  config: typeof import('../core/config.js');
  stats: typeof import('../handlers/memory-crud-stats.js');
  health: typeof import('../handlers/memory-crud-health.js');
}> {
  vi.resetModules();
  const [vectorIndex, dbState, config, stats, health] = await Promise.all([
    import('../lib/search/vector-index.js'),
    import('../core/db-state.js'),
    import('../core/config.js'),
    import('../handlers/memory-crud-stats.js'),
    import('../handlers/memory-crud-health.js'),
  ]);
  return { vectorIndex, dbState, config, stats, health };
}

function seedDeferredMemory(
  vectorIndex: typeof import('../lib/search/vector-index.js'),
  id: number,
  filePath: string,
): number {
  fs.writeFileSync(filePath, `memory ${id}`);
  return vectorIndex.indexMemoryDeferred({
    specFolder: path.dirname(filePath),
    filePath,
    title: `Memory ${id}`,
    triggerPhrases: [`memory ${id}`],
    contentText: `memory ${id}`,
    appendOnly: true,
  });
}

describe('database lifecycle and path resolution', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-db-lifecycle-'));
    process.chdir(tempDir);
    restoreEnv();
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    restoreEnv();
    vi.restoreAllMocks();
    vi.resetModules();
    try {
      const vectorIndex = await import('../lib/search/vector-index.js');
      vectorIndex.closeDb();
    } catch {
      // Some tests reset modules before the vector-index store is loaded.
    }
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('rebounds stats and health after an external marker update', async () => {
    const dbPath = path.join(tempDir, 'runtime', 'context-index.sqlite');
    const replacementPath = path.join(tempDir, 'replacement', 'context-index.sqlite');
    process.env.MEMORY_DB_PATH = dbPath;
    delete process.env.SPEC_KIT_DB_DIR;
    delete process.env.SPECKIT_DB_DIR;

    const { vectorIndex, dbState, config, stats, health } = await importRuntimeModules();

    vectorIndex.initializeDb(replacementPath);
    seedDeferredMemory(vectorIndex, 201, path.join(tempDir, 'replacement', 'memory-201.md'));
    seedDeferredMemory(vectorIndex, 202, path.join(tempDir, 'replacement', 'memory-202.md'));
    vectorIndex.closeDb();

    const liveDb = vectorIndex.initializeDb(dbPath);
    dbState.init({ vectorIndex });
    seedDeferredMemory(vectorIndex, 101, path.join(tempDir, 'runtime', 'memory-101.md'));
    liveDb.pragma('wal_checkpoint(TRUNCATE)');

    let rebindCount = 0;
    const unregister = dbState.registerDatabaseRebindListener(() => {
      rebindCount += 1;
    });

    fs.renameSync(replacementPath, dbPath);
    for (const suffix of ['-wal', '-shm']) {
      fs.rmSync(`${dbPath}${suffix}`, { force: true });
    }
    fs.writeFileSync(config.resolveDatabasePaths().dbUpdatedFile, String(Date.now() + 10_000));

    try {
      const statsEnvelope = parseEnvelope<{ totalMemories: number; byStatus: { pending: number } }>(
        await stats.handleMemoryStats({}),
      );
      const healthEnvelope = parseEnvelope<{ status: string; databaseConnected: boolean; consistency: { rowsTotal: number } }>(
        await health.handleMemoryHealth({}),
      );

      expect(rebindCount).toBe(1);
      expect(statsEnvelope.data.totalMemories).toBe(2);
      expect(statsEnvelope.data.byStatus.pending).toBe(2);
      expect(healthEnvelope.data.status).toBe('healthy');
      expect(healthEnvelope.data.databaseConnected).toBe(true);
      expect(healthEnvelope.data.consistency.rowsTotal).toBe(2);
    } finally {
      unregister();
    }
  });

  it('resolves the same database path across runtime and migration entry points', async () => {
    const primaryDir = path.join(tempDir, 'primary-db');
    const secondaryDir = path.join(tempDir, 'secondary-db');
    const memoryPath = path.join(tempDir, 'memory-path-parent', 'custom-name.sqlite');
    fs.mkdirSync(primaryDir, { recursive: true });
    fs.mkdirSync(secondaryDir, { recursive: true });

    process.env.SPEC_KIT_DB_DIR = primaryDir;
    process.env.SPECKIT_DB_DIR = secondaryDir;
    process.env.MEMORY_DB_PATH = memoryPath;

    vi.resetModules();
    const [config, vectorIndex, createCheckpoint, restoreCheckpoint, specMemoryCli] = await Promise.all([
      import('../core/config.js'),
      import('../lib/search/vector-index.js'),
      import('../scripts/migrations/create-checkpoint.js'),
      import('../scripts/migrations/restore-checkpoint.js'),
      import('../spec-memory-cli.js'),
    ]);

    const resolved = config.resolveDatabasePaths();
    const expectedDir = fs.realpathSync(primaryDir);
    const expectedPath = path.join(expectedDir, path.basename(memoryPath));

    expect(resolved.databaseDir).toBe(expectedDir);
    expect(resolved.databasePath).toBe(expectedPath);
    expect(resolved.databasePath).not.toContain('secondary-db');
    expect(resolved.databasePath).not.toContain('memory-path-parent');
    expect(createCheckpoint.resolveDefaultDbPath()).toBe(expectedPath);
    expect(restoreCheckpoint.resolveDefaultDbPath()).toBe(expectedPath);
    expect(specMemoryCli.__testing.findRepoPaths().dbDir).toBe(expectedDir);

    vectorIndex.closeDb();
    vectorIndex.initializeDb();
    expect(vectorIndex.getDbPath()).toBe(expectedPath);
  });
});
