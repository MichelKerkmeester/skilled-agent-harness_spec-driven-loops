// ───────────────────────────────────────────────────────────────
// TEST: Retry Retention
// ───────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it, vi } from 'vitest';

const runCalls: Array<{ sql: string; args: unknown[] }> = [];

vi.mock('../../lib/search/vector-index.js', () => {
  const db = {
    prepare(sql: string) {
      return {
        run: (...args: unknown[]) => {
          runCalls.push({ sql, args });
          if (sql.includes('Retry retention max age exceeded')) return { changes: 2 };
          if (sql.includes('Retry retention pending cap exceeded')) return { changes: 1 };
          return { changes: 0 };
        },
        all: (...args: unknown[]) => {
          runCalls.push({ sql, args });
          if (sql.includes('LIMIT -1 OFFSET')) return [{ id: 101 }, { id: 102 }];
          return [];
        },
        get: () => undefined,
      };
    },
    transaction(fn: (ids: number[]) => void) {
      return (ids: number[]) => fn(ids);
    },
  };

  return {
    initializeDb: vi.fn(),
    getDb: vi.fn(() => db),
    getMemory: vi.fn(),
  };
});

describe('retry retention', () => {
  afterEach(() => {
    runCalls.length = 0;
  });

  it('marks expired retry rows and overflow rows as failed', async () => {
    const { enforceRetryRetentionLimits } = await import('../../lib/providers/retry-manager.js');

    const result = enforceRetryRetentionLimits(1, 1_000, new Date('2026-05-22T00:00:00Z'));

    expect(result).toEqual({ expired: 2, overflow: 2 });
    expect(runCalls.some((call) => call.sql.includes('Retry retention max age exceeded'))).toBe(true);
    expect(runCalls.some((call) => call.sql.includes('Retry retention pending cap exceeded'))).toBe(true);
  });

  it('aborts retry queue processing after shutdown is requested', async () => {
    const retryManager = await import('../../lib/providers/retry-manager.js');

    retryManager.stopBackgroundJob();
    const result = await retryManager.processRetryQueue(5);

    expect(result.processed).toBe(0);
    expect(result.details).toEqual([]);
  });
});
