import { afterEach, describe, expect, it, vi } from 'vitest';

function parseResponse(result: { content: Array<{ text: string }> }): Record<string, unknown> {
  return JSON.parse(result.content[0]?.text ?? '{}') as Record<string, unknown>;
}

async function freshGuard() {
  vi.resetModules();
  return import('../lib/runtime/memory-runtime-guard.js');
}

afterEach(async () => {
  vi.restoreAllMocks();
  const vectorIndex = await import('../lib/search/vector-index-store.js');
  vectorIndex.closeDb();
});

describe('memory runtime guard', () => {
  it('is idempotent after initialization succeeds', async () => {
    const guard = await freshGuard();
    let calls = 0;
    guard.registerInitTasks(async () => {
      calls += 1;
    });

    expect(guard.isMemoryRuntimeInitialized()).toBe(false);
    await guard.ensureMemoryRuntimeInitialized('test:first');
    await guard.ensureMemoryRuntimeInitialized('test:second');

    expect(calls).toBe(1);
    expect(guard.isMemoryRuntimeInitialized()).toBe(true);
  });

  it('single-flights concurrent initialization callers', async () => {
    const guard = await freshGuard();
    let calls = 0;
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });

    guard.registerInitTasks(async () => {
      calls += 1;
      await gate;
    });

    const first = guard.ensureMemoryRuntimeInitialized('test:concurrent-a');
    const second = guard.ensureMemoryRuntimeInitialized('test:concurrent-b');
    await Promise.resolve();

    expect(calls).toBe(1);
    release();
    await Promise.all([first, second]);
    expect(guard.isMemoryRuntimeInitialized()).toBe(true);
  });

  it('retries after a failed initialization', async () => {
    const guard = await freshGuard();
    let calls = 0;
    guard.registerInitTasks(async () => {
      calls += 1;
      if (calls === 1) {
        throw new Error('boom');
      }
    });

    await expect(guard.ensureMemoryRuntimeInitialized('test:failure')).rejects.toThrow('boom');
    expect(guard.isMemoryRuntimeInitialized()).toBe(false);

    await guard.ensureMemoryRuntimeInitialized('test:retry');
    expect(calls).toBe(2);
    expect(guard.isMemoryRuntimeInitialized()).toBe(true);
  });

  it('tryGetDb returns null before init and the Database after init', async () => {
    vi.resetModules();
    const vectorIndex = await import('../lib/search/vector-index-store.js');

    expect(vectorIndex.tryGetDb()).toBeNull();
    const database = vectorIndex.initializeDb(':memory:');

    expect(vectorIndex.tryGetDb()).toBe(database);
  });

  it('memory_health reports pre-init status without opening the database', async () => {
    vi.resetModules();
    const vectorIndex = await import('../lib/search/vector-index-store.js');
    const health = await import('../handlers/memory-crud-health.js');

    expect(vectorIndex.tryGetDb()).toBeNull();
    const result = await health.handleMemoryHealth({ includeFullReport: true });
    const parsed = parseResponse(result);
    const data = parsed.data as Record<string, unknown>;

    expect(result.isError).toBe(false);
    expect(data.runtime_initialized).toBe(false);
    expect(data.databaseConnected).toBe(false);
    expect(vectorIndex.tryGetDb()).toBeNull();
  });

  it('a representative memory handler guard runs before DB access', async () => {
    const guard = await freshGuard();
    const events: string[] = [];
    guard.registerInitTasks(async () => {
      events.push('init');
    });

    async function mockedMemorySave(): Promise<void> {
      await guard.ensureMemoryRuntimeInitialized('handler:memory_save');
      events.push('db-access');
    }

    await mockedMemorySave();

    expect(events).toEqual(['init', 'db-access']);
  });
});
