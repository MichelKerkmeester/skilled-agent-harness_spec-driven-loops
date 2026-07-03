import BetterSqlite3 from 'better-sqlite3';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { acquireIndexScanLease, completeIndexScanLease, init, refreshScanLease } from '../core/db-state';
import type { DatabaseLike } from '../core/db-state';

describe('db-state', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logs when a direct vector-index rebind listener returns false', () => {
    const originalDb = { name: 'original-db' } as unknown as DatabaseLike;
    const reboundDb = { name: 'rebound-db' } as unknown as DatabaseLike;
    let connectionListener: ((database: DatabaseLike) => void) | null = null;
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const vectorIndex = {
      initializeDb: vi.fn(),
      getDb: vi.fn(() => originalDb),
      closeDb: vi.fn(),
      vectorSearch: vi.fn(),
      onDatabaseConnectionChange: vi.fn((listener: (database: DatabaseLike) => void) => {
        connectionListener = listener;
        return () => {
          connectionListener = null;
        };
      }),
    };

    init({
      vectorIndex,
      checkpoints: { init: vi.fn() },
      accessTracker: { init: vi.fn() },
      hybridSearch: { init: vi.fn() },
      sessionManager: { init: vi.fn(() => ({ success: false, error: 'listener-session-init-failed' })) },
      incrementalIndex: { init: vi.fn() },
    });

    connectionListener?.(reboundDb);

    expect(errorSpy).toHaveBeenCalledWith('[db-state] Session manager rebind failed: listener-session-init-failed');
    expect(errorSpy).toHaveBeenCalledWith('[db-state] Database consumer listener rebind returned false');
  });

  it('acquires scan lease once and rejects a concurrent fresh lease', async () => {
    const db = new BetterSqlite3(':memory:');

    init({
      vectorIndex: {
        initializeDb: vi.fn(),
        getDb: vi.fn(() => db as unknown as DatabaseLike),
        closeDb: vi.fn(),
      },
    });

    const now = Date.now();
    const first = await acquireIndexScanLease({ now, cooldownMs: 60000, leaseExpiryMs: 120000 });
    const second = await acquireIndexScanLease({ now: now + 1000, cooldownMs: 60000, leaseExpiryMs: 120000 });

    expect(first.acquired).toBe(true);
    expect(second.acquired).toBe(false);
    expect(second.reason).toBe('lease_active');
    expect(second.waitSeconds).toBeGreaterThan(0);

    db.close();
  });

  it('expires stale scan lease and allows a fresh reservation', async () => {
    const db = new BetterSqlite3(':memory:');
    db.exec('CREATE TABLE config (key TEXT PRIMARY KEY, value TEXT)');
    const staleStartedAt = Date.now() - 300000;
    db.prepare('INSERT INTO config (key, value) VALUES (?, ?)').run('scan_started_at', String(staleStartedAt));

    init({
      vectorIndex: {
        initializeDb: vi.fn(),
        getDb: vi.fn(() => db as unknown as DatabaseLike),
        closeDb: vi.fn(),
      },
    });

    const now = Date.now();
    const lease = await acquireIndexScanLease({ now, cooldownMs: 60000, leaseExpiryMs: 120000 });

    expect(lease.acquired).toBe(true);
    const startedRow = db.prepare('SELECT value FROM config WHERE key = ?').get('scan_started_at') as { value: string };
    expect(Number.parseInt(startedRow.value, 10)).toBe(now);

    db.close();
  });

  it('fails CLOSED on SQLite lock contention so two scans cannot both acquire', async () => {
    const busyError = Object.assign(new Error('database is locked'), { code: 'SQLITE_BUSY' });
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Fake DB whose transaction body throws a contention error inside the lease try-block.
    const contendedDb = {
      exec: vi.fn(),
      prepare: vi.fn(() => ({ all: vi.fn(), get: vi.fn(), run: vi.fn() })),
      transaction: vi.fn(() => () => { throw busyError; }),
    } as unknown as DatabaseLike;

    init({
      vectorIndex: {
        initializeDb: vi.fn(),
        getDb: vi.fn(() => contendedDb),
        closeDb: vi.fn(),
      },
    });

    const lease = await acquireIndexScanLease({ now: Date.now(), cooldownMs: 60000, leaseExpiryMs: 120000 });

    expect(lease.acquired).toBe(false);
    expect(lease.reason).toBe('contention');
    expect(lease.waitSeconds).toBeGreaterThan(0);
    expect(warnSpy).toHaveBeenCalled();
  });

  it('fails OPEN on a non-contention structural error', async () => {
    const structuralError = new Error('no such table: config');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const brokenDb = {
      exec: vi.fn(),
      prepare: vi.fn(() => ({ all: vi.fn(), get: vi.fn(), run: vi.fn() })),
      transaction: vi.fn(() => () => { throw structuralError; }),
    } as unknown as DatabaseLike;

    init({
      vectorIndex: {
        initializeDb: vi.fn(),
        getDb: vi.fn(() => brokenDb),
        closeDb: vi.fn(),
      },
    });

    const lease = await acquireIndexScanLease({ now: Date.now(), cooldownMs: 60000, leaseExpiryMs: 120000 });

    expect(lease.acquired).toBe(true);
    expect(lease.reason).toBe('ok');
    expect(errorSpy).toHaveBeenCalled();
  });

  it('completes lease by moving scan_started_at to last_index_scan', async () => {
    const db = new BetterSqlite3(':memory:');
    db.exec('CREATE TABLE config (key TEXT PRIMARY KEY, value TEXT)');
    const startedAt = Date.now();
    db.prepare('INSERT INTO config (key, value) VALUES (?, ?)').run('scan_started_at', String(startedAt));

    init({
      vectorIndex: {
        initializeDb: vi.fn(),
        getDb: vi.fn(() => db as unknown as DatabaseLike),
        closeDb: vi.fn(),
      },
    });

    const completedAt = startedAt + 2000;
    await completeIndexScanLease(completedAt);

    const lastScan = db.prepare('SELECT value FROM config WHERE key = ?').get('last_index_scan') as { value: string };
    const activeLease = db.prepare('SELECT value FROM config WHERE key = ?').get('scan_started_at') as { value: string } | undefined;

    expect(Number.parseInt(lastScan.value, 10)).toBe(completedAt);
    expect(activeLease).toBeUndefined();

    db.close();
  });

  it('applies scan cooldown only to the same scan key', async () => {
    const db = new BetterSqlite3(':memory:');

    init({
      vectorIndex: {
        initializeDb: vi.fn(),
        getDb: vi.fn(() => db as unknown as DatabaseLike),
        closeDb: vi.fn(),
      },
    });

    const start = Date.now();
    const first = await acquireIndexScanLease({ now: start, cooldownMs: 60000, leaseExpiryMs: 120000, scanKey: 'scope-a' });
    await completeIndexScanLease(start + 2000, { scanKey: 'scope-a' });
    const sameScope = await acquireIndexScanLease({ now: start + 3000, cooldownMs: 60000, leaseExpiryMs: 120000, scanKey: 'scope-a' });
    const differentScope = await acquireIndexScanLease({ now: start + 4000, cooldownMs: 60000, leaseExpiryMs: 120000, scanKey: 'scope-b' });

    expect(first.acquired).toBe(true);
    expect(sameScope.acquired).toBe(false);
    expect(sameScope.reason).toBe('cooldown');
    expect(differentScope.acquired).toBe(true);

    db.close();
  });

  it('does not coalesce an active lease for a different scan key', async () => {
    const db = new BetterSqlite3(':memory:');

    init({
      vectorIndex: {
        initializeDb: vi.fn(),
        getDb: vi.fn(() => db as unknown as DatabaseLike),
        closeDb: vi.fn(),
      },
    });

    const now = Date.now();
    const first = await acquireIndexScanLease({ now, cooldownMs: 60000, leaseExpiryMs: 120000, scanKey: 'scope-a' });
    const differentScope = await acquireIndexScanLease({ now: now + 1000, cooldownMs: 60000, leaseExpiryMs: 120000, scanKey: 'scope-b' });
    const sameScope = await acquireIndexScanLease({ now: now + 2000, cooldownMs: 60000, leaseExpiryMs: 120000, scanKey: 'scope-b' });

    expect(first.acquired).toBe(true);
    expect(differentScope.acquired).toBe(true);
    expect(sameScope.acquired).toBe(false);
    expect(sameScope.reason).toBe('lease_active');

    db.close();
  });

  it('clears a cancelled scan lease without stamping cooldown', async () => {
    const db = new BetterSqlite3(':memory:');

    init({
      vectorIndex: {
        initializeDb: vi.fn(),
        getDb: vi.fn(() => db as unknown as DatabaseLike),
        closeDb: vi.fn(),
      },
    });

    const start = Date.now();
    const first = await acquireIndexScanLease({ now: start, cooldownMs: 60000, leaseExpiryMs: 120000, scanKey: 'scope-a' });
    await completeIndexScanLease(start + 1000, { scanKey: 'scope-a', setCooldown: false });
    const second = await acquireIndexScanLease({ now: start + 2000, cooldownMs: 60000, leaseExpiryMs: 120000, scanKey: 'scope-a' });
    const lastScan = db.prepare('SELECT value FROM config WHERE key = ?').get('last_index_scan') as { value: string } | undefined;

    expect(first.acquired).toBe(true);
    expect(second.acquired).toBe(true);
    expect(lastScan).toBeUndefined();

    db.close();
  });

  it('refreshes only the matching keyed scan lease', async () => {
    const db = new BetterSqlite3(':memory:');

    init({
      vectorIndex: {
        initializeDb: vi.fn(),
        getDb: vi.fn(() => db as unknown as DatabaseLike),
        closeDb: vi.fn(),
      },
    });

    const start = Date.now();
    await acquireIndexScanLease({ now: start, cooldownMs: 60000, leaseExpiryMs: 120000, scanKey: 'scope-a' });
    refreshScanLease(start + 1000, undefined, 'scope-b');
    const unchanged = db.prepare('SELECT value FROM config WHERE key = ?').get('scan_started_at') as { value: string };
    refreshScanLease(start + 2000, undefined, 'scope-a');
    const refreshed = db.prepare('SELECT value FROM config WHERE key = ?').get('scan_started_at') as { value: string };

    expect(Number.parseInt(unchanged.value, 10)).toBe(start);
    expect(Number.parseInt(refreshed.value, 10)).toBe(start + 2000);

    db.close();
  });
});
