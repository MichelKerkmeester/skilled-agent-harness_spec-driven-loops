import { existsSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

type CheckpointResult = {
  checkpointed: boolean;
  reason: string;
  bytes?: number;
  error?: string;
};

type BetterSqliteDatabase = {
  close: () => void;
  exec: (sql: string) => unknown;
  pragma: (sql: string) => unknown;
  prepare: (sql: string) => {
    get: () => unknown;
    run: (...args: unknown[]) => unknown;
  };
  transaction: (fn: () => void) => () => void;
};

type BetterSqliteConstructor = new (filename: string) => BetterSqliteDatabase;

const testDir = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const codeGraphRequire = createRequire(join(testDir, '..', 'skills', 'system-code-graph', 'package.json'));
const { checkpointStaleWalIfNeeded } = require('./mk-code-index-launcher.cjs') as {
  checkpointStaleWalIfNeeded: (dbPath: string, options?: { reapedOrphan?: boolean }) => CheckpointResult;
};

function loadBetterSqlite(): BetterSqliteConstructor | null {
  try {
    const Database = codeGraphRequire('better-sqlite3') as BetterSqliteConstructor;
    const probe = new Database(':memory:');
    probe.close();
    return Database;
  } catch {
    return null;
  }
}

const BetterSqlite = loadBetterSqlite();
const sqlite3CliAvailable = spawnSync('sqlite3', ['-version'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'ignore'],
}).status === 0;
const maybeIt = BetterSqlite || sqlite3CliAvailable ? it : it.skip;

function walSize(dbPath: string): number {
  const walPath = `${dbPath}-wal`;
  return existsSync(walPath) ? statSync(walPath).size : 0;
}

function runSqliteCli(dbPath: string, sql: string): string {
  const result = spawnSync('sqlite3', [dbPath], {
    input: sql,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `sqlite3 exited ${result.status}`);
  }
  return result.stdout;
}

async function runCliWriterThenKill(dbPath: string, rows: number): Promise<void> {
  const writer = spawn('sqlite3', [dbPath], {
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  let stdout = '';
  let stderr = '';
  let ready = false;

  const readyPromise = new Promise<void>((resolve, reject) => {
    writer.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString('utf8');
      if (!ready && stdout.includes('writer-ready')) {
        ready = true;
        resolve();
      }
    });
    writer.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf8');
    });
    writer.once('error', reject);
    writer.once('exit', (code, signal) => {
      if (!ready) reject(new Error(`sqlite3 writer exited before ready (${code ?? signal}): ${stderr}`));
    });
  });

  writer.stdin.write(`
.headers off
.mode list
PRAGMA journal_mode=WAL;
PRAGMA wal_autocheckpoint=0;
WITH RECURSIVE series(index_value) AS (
  SELECT 1
  UNION ALL
  SELECT index_value + 1 FROM series WHERE index_value < ${rows}
)
INSERT INTO payloads (payload)
SELECT randomblob(4096) FROM series;
SELECT 'writer-ready';
`);
  await readyPromise;

  await new Promise<void>((resolve, reject) => {
    writer.once('error', reject);
    writer.once('exit', () => resolve());
    writer.kill('SIGKILL');
  });
}

async function createWalFixtureWithCli(dbPath: string, rows: number): Promise<number> {
  runSqliteCli(dbPath, `
PRAGMA journal_mode=WAL;
PRAGMA wal_autocheckpoint=0;
CREATE TABLE payloads (id INTEGER PRIMARY KEY, payload BLOB NOT NULL);
`);

  await runCliWriterThenKill(dbPath, rows);
  return walSize(dbPath);
}

async function createWalFixture(dbPath: string, rows: number): Promise<number> {
  if (!BetterSqlite) return createWalFixtureWithCli(dbPath, rows);

  const setup = new BetterSqlite(dbPath);
  setup.pragma('journal_mode = WAL');
  setup.pragma('wal_autocheckpoint = 0');
  setup.exec('CREATE TABLE payloads (id INTEGER PRIMARY KEY, payload BLOB NOT NULL)');
  setup.close();

  const reader = new BetterSqlite(dbPath);
  reader.pragma('journal_mode = WAL');
  reader.exec('BEGIN');
  reader.prepare('SELECT COUNT(*) FROM payloads').get();

  const writer = new BetterSqlite(dbPath);
  writer.pragma('journal_mode = WAL');
  writer.pragma('wal_autocheckpoint = 0');
  const insert = writer.prepare('INSERT INTO payloads (payload) VALUES (?)');
  writer.transaction(() => {
    for (let index = 0; index < rows; index += 1) {
      insert.run(Buffer.alloc(4096, index % 251));
    }
  })();
  writer.close();

  const bytes = walSize(dbPath);
  reader.exec('COMMIT');
  reader.close();
  return bytes;
}

function integrityCheck(dbPath: string): string {
  if (!BetterSqlite) return runSqliteCli(dbPath, 'PRAGMA integrity_check;').trim();
  const db = new BetterSqlite(dbPath);
  try {
    const row = db.prepare('PRAGMA integrity_check').get() as { integrity_check?: string };
    return row.integrity_check ?? '';
  } finally {
    db.close();
  }
}

describe('checkpointStaleWalIfNeeded', () => {
  const originalThreshold = process.env.SPECKIT_LAUNCHER_WAL_TRUNCATE_BYTES;
  let tempRoot: string;

  beforeEach(() => {
    tempRoot = mkdtempSync(join(tmpdir(), 'mk-code-index-wal-hygiene-'));
  });

  afterEach(() => {
    if (originalThreshold === undefined) {
      delete process.env.SPECKIT_LAUNCHER_WAL_TRUNCATE_BYTES;
    } else {
      process.env.SPECKIT_LAUNCHER_WAL_TRUNCATE_BYTES = originalThreshold;
    }
    rmSync(tempRoot, { recursive: true, force: true });
  });

  maybeIt('truncates an oversized orphan-style WAL and preserves integrity', async () => {
    const dbPath = join(tempRoot, 'code-graph.sqlite');
    const beforeBytes = await createWalFixture(dbPath, 64);
    expect(beforeBytes).toBeGreaterThan(4096);

    process.env.SPECKIT_LAUNCHER_WAL_TRUNCATE_BYTES = '4096';
    const result = checkpointStaleWalIfNeeded(dbPath, { reapedOrphan: false });
    const afterBytes = walSize(dbPath);

    expect(result).toMatchObject({ checkpointed: true, reason: 'truncated', bytes: beforeBytes });
    expect(afterBytes).toBeLessThan(beforeBytes);
    expect(integrityCheck(dbPath)).toBe('ok');
  });

  maybeIt('leaves a small WAL alone when no orphan was reaped', async () => {
    const dbPath = join(tempRoot, 'code-graph.sqlite');
    const beforeBytes = await createWalFixture(dbPath, 1);
    expect(beforeBytes).toBeGreaterThan(0);

    process.env.SPECKIT_LAUNCHER_WAL_TRUNCATE_BYTES = String(beforeBytes + 4096);
    const result = checkpointStaleWalIfNeeded(dbPath, { reapedOrphan: false });
    const afterBytes = walSize(dbPath);

    expect(result).toMatchObject({ checkpointed: false, reason: 'under-threshold', bytes: beforeBytes });
    expect(afterBytes).toBe(beforeBytes);
  });
});
