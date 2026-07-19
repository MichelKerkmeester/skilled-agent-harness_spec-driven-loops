// ───────────────────────────────────────────────────────────────
// STRESS: index_scan lease coalescing under concurrent saves
// ───────────────────────────────────────────────────────────────
//
// memory_index_scan is single-writer: a config-table lease (scan_started_at +
// last_index_scan) ensures only one scan runs at a time, and a cooldown coalesces
// the burst of scan requests a save flood would otherwise trigger. This stress
// fires many concurrent lease acquisitions and asserts:
//   * exactly ONE acquisition wins (single-writer), the rest back off cleanly
//     with a structured `lease_active` reason — not a raw error storm.
//   * after completion, the cooldown coalesces immediate re-acquisitions.
//   * an expired/stale lease is reclaimable (a crashed scan never wedges forever).
//
// ISOLATION: a throwaway in-memory DB injected into db-state via init(); the
// lease primitives create their own `config` table. No production DB, no daemon,
// no real vector index — getDb() just returns the throwaway handle.

import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import * as dbState from '../../core/db-state';

const CONCURRENT_SCANS = 64;

let db: Database.Database;

// Minimal VectorIndexLike: only getDb()/initializeDb() are exercised by the lease
// primitives. No onDatabaseConnectionChange, so init() registers a no-op listener.
function installThrowawayDb(database: Database.Database): void {
  dbState.init({
    vectorIndex: {
      initializeDb(): void { /* no-op: DB is already open */ },
      getDb(): Database.Database { return database; },
    },
  });
}

beforeEach(() => {
  db = new Database(':memory:');
  installThrowawayDb(db);
});

afterEach(() => {
  try { db.close(); } catch { /* ignore */ }
});

describe('durability: index_scan lease coalescing under concurrent saves', () => {
  it('admits exactly one writer under a concurrent acquisition burst; the rest back off cleanly', async () => {
    const now = Date.now();

    // Fire a burst of concurrent lease acquisitions at the same logical instant,
    // as a save flood would. The lease reservation is a single SQLite
    // transaction, so the burst is serialized and deterministic.
    const results = await Promise.all(
      Array.from({ length: CONCURRENT_SCANS }, () =>
        dbState.acquireIndexScanLease({ now, cooldownMs: 60_000, leaseExpiryMs: 120_000 }),
      ),
    );

    const acquired = results.filter((result) => result.acquired);
    const backedOff = results.filter((result) => !result.acquired);

    // Single-writer: exactly one acquisition holds the lease.
    expect(acquired).toHaveLength(1);
    expect(backedOff).toHaveLength(CONCURRENT_SCANS - 1);

    // Every back-off is a structured lease_active decision with a positive,
    // bounded wait — a clean coalesced refusal, never a raw E429-class error.
    for (const result of backedOff) {
      expect(result.reason).toBe('lease_active');
      expect(result.waitSeconds).toBeGreaterThan(0);
      expect(result.waitSeconds).toBeLessThanOrEqual(120);
    }
  });

  it('coalesces immediate re-acquisitions behind the cooldown after a scan completes', async () => {
    const start = Date.now();

    const first = await dbState.acquireIndexScanLease({ now: start, cooldownMs: 60_000, leaseExpiryMs: 120_000 });
    expect(first.acquired).toBe(true);

    // Complete the scan: lease released, last_index_scan stamped.
    await dbState.completeIndexScanLease(start);

    // A second burst immediately after completion must be coalesced by the
    // cooldown — none may acquire while still inside the cooldown window.
    const burst = await Promise.all(
      Array.from({ length: CONCURRENT_SCANS }, () =>
        dbState.acquireIndexScanLease({ now: start + 1_000, cooldownMs: 60_000, leaseExpiryMs: 120_000 }),
      ),
    );

    expect(burst.every((result) => !result.acquired)).toBe(true);
    expect(burst.every((result) => result.reason === 'cooldown')).toBe(true);

    // Past the cooldown, exactly one scan may acquire again.
    const afterCooldown = await Promise.all(
      Array.from({ length: CONCURRENT_SCANS }, () =>
        dbState.acquireIndexScanLease({ now: start + 61_000, cooldownMs: 60_000, leaseExpiryMs: 120_000 }),
      ),
    );
    expect(afterCooldown.filter((result) => result.acquired)).toHaveLength(1);
  });

  it('reclaims an expired (stale) lease so a crashed scan never wedges the writer slot', async () => {
    const start = Date.now();

    const holder = await dbState.acquireIndexScanLease({ now: start, cooldownMs: 1_000, leaseExpiryMs: 5_000 });
    expect(holder.acquired).toBe(true);

    // Simulate the holder crashing without releasing: while the lease is still
    // live, a new request must be refused.
    const blockedWhileLive = await dbState.acquireIndexScanLease({ now: start + 1_000, cooldownMs: 1_000, leaseExpiryMs: 5_000 });
    expect(blockedWhileLive.acquired).toBe(false);
    expect(blockedWhileLive.reason).toBe('lease_active');

    // Once the lease has expired past leaseExpiryMs, the stale lease is cleared
    // and exactly one of a fresh burst reclaims the slot.
    const reclaim = await Promise.all(
      Array.from({ length: CONCURRENT_SCANS }, () =>
        dbState.acquireIndexScanLease({ now: start + 6_000, cooldownMs: 1_000, leaseExpiryMs: 5_000 }),
      ),
    );
    expect(reclaim.filter((result) => result.acquired)).toHaveLength(1);
  });
});
