import { spawn, type ChildProcess } from 'node:child_process';
import * as fs from 'node:fs';
import { createRequire } from 'node:module';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  acquire_db_instance_lock,
  release_db_instance_locks,
  held_db_instance_lock,
  DB_LOCK_DISABLE_ENV,
} from '../lib/search/db-instance-lock.js';
import { VectorIndexError, VectorIndexErrorCode } from '../lib/search/vector-index-types.js';

const require = createRequire(import.meta.url);
const BETTER_SQLITE3_PATH = require.resolve('better-sqlite3');

// Contender/holder child: replicates the acquire recipe with raw better-sqlite3
// so cross-process kernel-lock semantics are tested for real (an in-process
// second acquire is reentrant by design and proves nothing about exclusion).
const CHILD_SCRIPT = `
const Database = require(process.argv[2]);
const lockPath = process.argv[3];
const mode = process.argv[4] || 'hold';
try {
  const conn = new Database(lockPath);
  conn.pragma('busy_timeout = 0');
  conn.pragma('journal_mode = DELETE');
  conn.pragma('locking_mode = EXCLUSIVE');
  conn.exec('BEGIN IMMEDIATE');
  conn.exec('CREATE TABLE IF NOT EXISTS lock_owner (id INTEGER PRIMARY KEY CHECK (id = 1), pid INTEGER NOT NULL, started_at TEXT NOT NULL, token TEXT NOT NULL)');
  conn.prepare('INSERT OR REPLACE INTO lock_owner (id, pid, started_at, token) VALUES (1, ?, ?, ?)')
    .run(process.pid, new Date().toISOString(), 'child-token');
  conn.exec('COMMIT');
  process.stdout.write('ACQUIRED\\n');
  if (mode === 'hold') {
    setInterval(() => {}, 1000);
  } else {
    conn.close();
    process.exit(0);
  }
} catch (err) {
  if (err && (err.code === 'SQLITE_BUSY' || err.code === 'SQLITE_BUSY_SNAPSHOT')) {
    process.stdout.write('BUSY\\n');
    process.exit(3);
  }
  process.stdout.write('ERROR:' + (err && err.message) + '\\n');
  process.exit(2);
}
`;

function waitForLine(child: ChildProcess, timeoutMs = 10_000): Promise<string> {
  return new Promise((resolve, reject) => {
    let buffer = '';
    const timer = setTimeout(() => reject(new Error(`child produced no output within ${timeoutMs}ms: ${buffer}`)), timeoutMs);
    child.stdout?.on('data', (chunk: Buffer) => {
      buffer += chunk.toString();
      const newlineIdx = buffer.indexOf('\n');
      if (newlineIdx >= 0) {
        clearTimeout(timer);
        resolve(buffer.slice(0, newlineIdx));
      }
    });
    child.on('error', (err) => { clearTimeout(timer); reject(err); });
    child.on('exit', () => {
      const newlineIdx = buffer.indexOf('\n');
      if (newlineIdx >= 0) {
        clearTimeout(timer);
        resolve(buffer.slice(0, newlineIdx));
      }
    });
  });
}

function waitForExit(child: ChildProcess, timeoutMs = 10_000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (child.exitCode !== null || child.signalCode !== null) { resolve(); return; }
    const timer = setTimeout(() => reject(new Error('child did not exit in time')), timeoutMs);
    child.on('exit', () => { clearTimeout(timer); resolve(); });
  });
}

describe('db-instance-lock', () => {
  let tmpDir: string;
  let dbPath: string;
  let childScriptPath: string;
  const liveChildren: ChildProcess[] = [];

  function spawnLockChild(mode: 'hold' | 'touch' = 'hold'): ChildProcess {
    const child = spawn(process.execPath, [childScriptPath, BETTER_SQLITE3_PATH, `${dbPath}.lock`, mode], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    liveChildren.push(child);
    return child;
  }

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'db-instance-lock-'));
    dbPath = path.join(tmpDir, 'context-index.sqlite');
    childScriptPath = path.join(tmpDir, 'lock-child.cjs');
    fs.writeFileSync(childScriptPath, CHILD_SCRIPT);
  });

  afterEach(async () => {
    delete process.env[DB_LOCK_DISABLE_ENV];
    release_db_instance_locks();
    for (const child of liveChildren.splice(0)) {
      if (child.exitCode === null && child.signalCode === null) {
        child.kill('SIGKILL');
        await waitForExit(child).catch(() => undefined);
      }
    }
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('is reentrant per process and skips in-memory paths', () => {
    const first = acquire_db_instance_lock(dbPath);
    const second = acquire_db_instance_lock(dbPath);
    expect(first).not.toBeNull();
    expect(second).toBe(first);
    expect(held_db_instance_lock(dbPath)).toBe(first);
    expect(acquire_db_instance_lock(':memory:')).toBeNull();
    expect(acquire_db_instance_lock('')).toBeNull();
  });

  it('writes a diagnostic info sidecar on acquire and removes it on release', () => {
    const handle = acquire_db_instance_lock(dbPath);
    expect(handle).not.toBeNull();
    const info = JSON.parse(fs.readFileSync(`${dbPath}.lock-info.json`, 'utf8'));
    expect(info.pid).toBe(process.pid);
    expect(info.token).toBe(handle?.token);
    release_db_instance_locks();
    expect(fs.existsSync(`${dbPath}.lock-info.json`)).toBe(false);
    // The lock file itself is NEVER unlinked — arbitration is on kernel
    // lock state, not file presence.
    expect(fs.existsSync(`${dbPath}.lock`)).toBe(true);
  });

  it('refuses a second writer while another live process holds the lock', async () => {
    const child = spawnLockChild('hold');
    await expect(waitForLine(child)).resolves.toBe('ACQUIRED');

    expect(() => acquire_db_instance_lock(dbPath, { acquireTimeoutMs: 50 })).toThrowError(VectorIndexError);
    try {
      acquire_db_instance_lock(dbPath, { acquireTimeoutMs: 50 });
    } catch (error) {
      expect((error as VectorIndexError).code).toBe(VectorIndexErrorCode.DB_LOCK_HELD);
      expect((error as VectorIndexError).message).toContain('single-writer lock');
    }
  });

  it('acquires immediately after a SIGKILLed holder dies — no stale state to clear', async () => {
    const child = spawnLockChild('hold');
    await expect(waitForLine(child)).resolves.toBe('ACQUIRED');

    child.kill('SIGKILL');
    await waitForExit(child);

    const handle = acquire_db_instance_lock(dbPath, { acquireTimeoutMs: 500 });
    expect(handle).not.toBeNull();
    expect(fs.existsSync(`${dbPath}.lock`)).toBe(true);
  });

  it('lets a second process acquire after a clean release', async () => {
    acquire_db_instance_lock(dbPath);
    release_db_instance_locks();

    const child = spawnLockChild('touch');
    await expect(waitForLine(child)).resolves.toBe('ACQUIRED');
    await waitForExit(child);
  });

  it('cannot release a lock it does not hold (lease-wipe regression guard)', async () => {
    const holder = spawnLockChild('hold');
    await expect(waitForLine(holder)).resolves.toBe('ACQUIRED');

    expect(() => acquire_db_instance_lock(dbPath, { acquireTimeoutMs: 50 })).toThrow();
    // A failed acquire holds nothing, so this must be a structural no-op.
    release_db_instance_locks();

    const contender = spawnLockChild('touch');
    await expect(waitForLine(contender)).resolves.toBe('BUSY');
    await waitForExit(contender);
  });

  it('kill switch disables enforcement entirely', async () => {
    const holder = spawnLockChild('hold');
    await expect(waitForLine(holder)).resolves.toBe('ACQUIRED');

    process.env[DB_LOCK_DISABLE_ENV] = '1';
    expect(acquire_db_instance_lock(dbPath, { acquireTimeoutMs: 50 })).toBeNull();
  });
});

describe('db-instance-lock store integration', () => {
  let tmpDir: string;
  let dbPath: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'db-lock-store-'));
    dbPath = path.join(tmpDir, 'context-index.sqlite');
  });

  afterEach(async () => {
    const store = await import('../lib/search/vector-index-store.js');
    try { store.close_db(); } catch { /* best-effort */ }
    release_db_instance_locks();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('initialize_db acquires, reopenActiveDatabase retains, close_db releases', async () => {
    const store = await import('../lib/search/vector-index-store.js');

    store.initialize_db(dbPath);
    expect(held_db_instance_lock(dbPath)).not.toBeNull();

    let swapRan = false;
    store.reopenActiveDatabase(dbPath, () => {
      swapRan = true;
      // The swap window itself must stay protected: the lock is still held
      // while no database connection exists.
      expect(held_db_instance_lock(dbPath)).not.toBeNull();
    });
    expect(swapRan).toBe(true);
    expect(held_db_instance_lock(dbPath)).not.toBeNull();

    store.close_db();
    expect(held_db_instance_lock(dbPath)).toBeNull();
  });
});
