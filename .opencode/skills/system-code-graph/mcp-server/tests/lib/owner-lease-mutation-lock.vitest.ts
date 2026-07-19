import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// OR-3-01: top-level node:fs named exports are not configurable under ESM, so vi.spyOn(fs,
// 'fsyncSync') fails ("Cannot redefine property"). Instead mock node:fs with a passthrough factory
// that lets a single test toggle a one-shot fsyncSync failure. Everything else delegates to the
// real fs so canonical-db-dir + the lease writes behave normally.
let fsyncFailQueue: Array<() => void> = [];

vi.mock('node:fs', async () => {
  const actual = await vi.importActual<typeof import('node:fs')>('node:fs');
  return {
    ...actual,
    default: actual,
    fsyncSync: (fd: number): void => {
      const next = fsyncFailQueue.shift();
      if (next) {
        next();
        return;
      }
      return actual.fsyncSync(fd);
    },
  };
});

const { existsSync, mkdtempSync, readdirSync, rmSync, utimesSync, writeFileSync } = await import('node:fs');
const { tmpdir } = await import('node:os');
const { join } = await import('node:path');

const { acquireOwnerLease, refreshOwnerLease } = await import('../../lib/owner-lease.js');
const { resolveCanonicalDbDir } = await import('../../lib/canonical-db-dir.js');

const OWNER_LEASE_LOCK_FILE_NAME = '.code-graph-owner.json.lock';

const tempDirs: string[] = [];

function tempRoot(): string {
  const dir = mkdtempSync(join(tmpdir(), 'cg-owner-lease-mutex-'));
  tempDirs.push(dir);
  return dir;
}

beforeEach(() => {
  fsyncFailQueue = [];
});

afterEach(() => {
  fsyncFailQueue = [];
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('OR-3-01: mutation lock orphan recovery', () => {
  it('unlinks the just-created lock when the post-open write/fsync fails, so a later acquire is not wedged forever', () => {
    const dbDir = join(tempRoot(), 'db');
    const ownerPid = 4242;

    // Establish a healthy lease so refreshOwnerLease reaches the holder-write path under the lock.
    expect(acquireOwnerLease(dbDir, { ownerPid, ppid: 1, executablePath: '/bin/node' }).acquired).toBe(true);

    const canonicalDbDir = resolveCanonicalDbDir(dbDir);
    const lockPath = join(canonicalDbDir, OWNER_LEASE_LOCK_FILE_NAME);

    // Inject a single fsyncSync failure. The lock's fsyncSync is the first fsyncSync call in the
    // refresh path, and tryAcquireOwnerLeaseMutationLock has already openSync('wx')'d the lock file
    // by then — exactly the OR-3-01 orphan window (file exists, post-open write/fsync throws).
    let observedLockExisted = false;
    fsyncFailQueue.push(() => {
      observedLockExisted = existsSync(lockPath);
      const error = new Error('simulated ENOSPC during lock fsync') as NodeJS.ErrnoException;
      error.code = 'ENOSPC';
      throw error;
    });

    // The failure is a non-EEXIST error, so it propagates out of the acquire/refresh path.
    expect(() => refreshOwnerLease(dbDir, ownerPid)).toThrow(/ENOSPC|simulated/);

    // Sanity: we actually exercised the orphan window (lock file existed when fsync blew up).
    expect(observedLockExisted).toBe(true);
    expect(fsyncFailQueue).toHaveLength(0);

    // OR-3-01 core assertion: NO orphan mutation-lock file may remain. Pre-fix code closed the fd
    // but left the empty/partial lock on disk, where its unparseable pid wedged every subsequent
    // acquirer (lockPid === null fails the stale-reclaim guard) -> tryAcquire null forever ->
    // refreshOwnerLease false forever -> heartbeat self-shutdown.
    expect(existsSync(lockPath)).toBe(false);
    expect(readdirSync(canonicalDbDir).filter((name) => name.endsWith('.lock'))).toHaveLength(0);

    // And a subsequent refresh must succeed (fsync no longer mocked after the single throw),
    // proving the lock subsystem is not wedged.
    expect(refreshOwnerLease(dbDir, ownerPid)).toBe(true);
  });

  it('self-heals a pre-existing wedged empty lock (unparseable pid, aged past threshold)', () => {
    const dbDir = join(tempRoot(), 'db');
    const ownerPid = 5151;

    expect(acquireOwnerLease(dbDir, { ownerPid, ppid: 1, executablePath: '/bin/node' }).acquired).toBe(true);

    const canonicalDbDir = resolveCanonicalDbDir(dbDir);
    const lockPath = join(canonicalDbDir, OWNER_LEASE_LOCK_FILE_NAME);

    // Simulate a wedged orphan from a pre-fix binary / hard crash: an empty lock with no parseable
    // pid, with an mtime far enough in the past to exceed the conservative self-heal age guard.
    writeFileSync(lockPath, '', { encoding: 'utf8', mode: 0o600 });
    const aged = new Date(Date.now() - 60_000);
    utimesSync(lockPath, aged, aged);

    // The live-pid stale check cannot clear an unparseable pid; only the OR-3-01 age-guarded
    // self-heal can. With it, the wedged orphan is removed and the refresh acquires cleanly.
    expect(refreshOwnerLease(dbDir, ownerPid)).toBe(true);
    expect(existsSync(lockPath)).toBe(false);
  });

  it('does NOT remove a fresh empty lock (within the age guard) — leaves it for the live holder', () => {
    const dbDir = join(tempRoot(), 'db');
    const ownerPid = 6262;

    expect(acquireOwnerLease(dbDir, { ownerPid, ppid: 1, executablePath: '/bin/node' }).acquired).toBe(true);

    const canonicalDbDir = resolveCanonicalDbDir(dbDir);
    const lockPath = join(canonicalDbDir, OWNER_LEASE_LOCK_FILE_NAME);

    // A brand-new empty lock (e.g. a concurrent acquirer mid-write) is younger than the age guard,
    // so the self-heal must NOT touch it; refresh backs off (returns false) instead of stealing it.
    writeFileSync(lockPath, '', { encoding: 'utf8', mode: 0o600 });

    expect(refreshOwnerLease(dbDir, ownerPid)).toBe(false);
    expect(existsSync(lockPath)).toBe(true);
  });
});
