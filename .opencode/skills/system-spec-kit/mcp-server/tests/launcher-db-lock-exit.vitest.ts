import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const launcher = require(require.resolve('../../../../bin/mk-spec-memory-launcher.cjs'));
const { decideDbLockHeldAction, EXIT_DB_LOCK_HELD } = launcher;

// Exit-86 ("database single-writer lock held") supervision flow. The critical
// case: in supervised mode the pid-lease records the LAUNCHER's own pid, so a
// self-held lease must never be treated as a bridge target — bridging would
// deep-probe the launcher's own dead socket and route into a self-reap.
describe('launcher exit-86 decision (db single-writer lock held)', () => {
  const SELF = 4242;
  const OTHER = 9999;

  it('exports the decision helper and the exit code', () => {
    expect(typeof decideDbLockHeldAction).toBe('function');
    expect(EXIT_DB_LOCK_HELD).toBe(86);
  });

  it('self-held lease routes to bounded retry, never bridge', () => {
    const d = decideDbLockHeldAction({ leaseHeld: true, leaseOwnerPid: SELF, selfPid: SELF, attempt: 1, maxRetries: 3 });
    expect(d.action).toBe('retry');
    expect(d.backoffMs).toBe(2000);
  });

  it('a DIFFERENT live owner is the only bridge target', () => {
    const d = decideDbLockHeldAction({ leaseHeld: true, leaseOwnerPid: OTHER, selfPid: SELF, attempt: 1, maxRetries: 3 });
    expect(d.action).toBe('bridge');
  });

  it('no live lease retries with exponential backoff then reports', () => {
    expect(decideDbLockHeldAction({ leaseHeld: false, leaseOwnerPid: null, selfPid: SELF, attempt: 2, maxRetries: 3 }).backoffMs).toBe(4000);
    expect(decideDbLockHeldAction({ leaseHeld: false, leaseOwnerPid: null, selfPid: SELF, attempt: 3, maxRetries: 3 }).backoffMs).toBe(8000);
    const exhausted = decideDbLockHeldAction({ leaseHeld: false, leaseOwnerPid: null, selfPid: SELF, attempt: 4, maxRetries: 3 });
    expect(exhausted.action).toBe('report');
    expect(exhausted.reason).toBe('db-lock-held');
  });

  it('hard cap reports even when a bridgeable owner appears (anti-loop backstop)', () => {
    const d = decideDbLockHeldAction({ leaseHeld: true, leaseOwnerPid: OTHER, selfPid: SELF, attempt: 6, maxRetries: 3 });
    expect(d.action).toBe('report');
    expect(d.reason).toBe('db-lock-held-persistent');
  });
});
