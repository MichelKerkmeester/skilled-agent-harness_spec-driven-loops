// ───────────────────────────────────────────────────────────────
// MODULE: SQLite Integrity Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it, vi } from 'vitest';

describe('checkSqliteIntegrity', () => {
  it('returns a categorized failure instead of throwing unknown open errors', async () => {
    vi.doMock('better-sqlite3', () => ({
      default: class {
        constructor() {
          throw new Error('permission denied');
        }
      },
    }));
    vi.doMock('node:fs', () => ({
      existsSync: () => true,
    }));

    const { checkSqliteIntegrity } = await import('../lib/freshness/sqlite-integrity.js?unknown-open-error');

    expect(checkSqliteIntegrity('/tmp/blocked.sqlite')).toEqual({
      ok: false,
      reason: 'SQLITE_CHECK_FAILED: permission denied',
    });
  });
});
