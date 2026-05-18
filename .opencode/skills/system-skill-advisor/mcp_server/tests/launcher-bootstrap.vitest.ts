// ───────────────────────────────────────────────────────────────
// MODULE: Launcher Bootstrap Tests
// ───────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import { mkdirSync, mkdtempSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { initDb, closeDb, resolveSkillGraphDbDir } from '../lib/skill-graph/skill-graph-db.js';
import { isLeaseHeld, acquireSkillGraphLease } from '../lib/daemon/lease.js';

const require = createRequire(import.meta.url);
const launcher = require('../../../../bin/mk-skill-advisor-launcher.cjs') as {
  acquireBootstrapLock: (options?: { staleMs?: number; timeoutMs?: number; retrySleepMs?: number }) => Promise<boolean>;
  artifactsReady: () => boolean;
  configureLauncherPathsForTesting: (paths: { mcpDir: string; dbDir: string; lockDir: string; stateFile: string }) => void;
  createChildEnv: (sourceEnv?: NodeJS.ProcessEnv) => Record<string, string>;
};

describe('mk-skill-advisor launcher bootstrap', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  function configureTempLauncher(): { mcpDir: string; lockDir: string } {
    const root = mkdtempSync(join(tmpdir(), 'mk-skill-advisor-launcher-'));
    tempDirs.push(root);
    const mcpDir = join(root, 'mcp_server');
    const dbDir = join(mcpDir, 'database');
    const lockDir = join(dbDir, '.mk-skill-advisor-launcher.lockdir');
    mkdirSync(join(mcpDir, 'dist/system-skill-advisor/mcp_server'), { recursive: true });
    launcher.configureLauncherPathsForTesting({
      mcpDir,
      dbDir,
      lockDir,
      stateFile: join(dbDir, '.mk-skill-advisor-launcher.json'),
    });
    return { mcpDir, lockDir };
  }

  it('removes a stale bootstrap lockdir before acquiring the lock', async () => {
    const { lockDir } = configureTempLauncher();
    mkdirSync(lockDir, { recursive: true });
    const stale = new Date(Date.now() - 10_000);
    utimesSync(lockDir, stale, stale);

    await expect(launcher.acquireBootstrapLock({ staleMs: 1, timeoutMs: 50, retrySleepMs: 1 })).resolves.toBe(true);
  });

  it('marks artifacts stale when source files are newer than dist output', () => {
    const { mcpDir } = configureTempLauncher();
    const serverPath = join(mcpDir, 'dist/system-skill-advisor/mcp_server/advisor-server.js');
    const sourcePath = join(mcpDir, 'advisor-server.ts');
    writeFileSync(serverPath, '// old dist\n', 'utf8');
    writeFileSync(sourcePath, '// new source\n', 'utf8');
    const oldDate = new Date(Date.now() - 10_000);
    const newDate = new Date();
    utimesSync(serverPath, oldDate, oldDate);
    utimesSync(sourcePath, newDate, newDate);

    expect(launcher.artifactsReady()).toBe(false);
  });

  it('filters parent environment before spawning npm or the advisor server', () => {
    expect(launcher.createChildEnv({
      PATH: '/bin',
      HOME: '/tmp/home',
      MK_SKILL_ADVISOR_DB_DIR: '/tmp/db',
      AWS_SECRET_ACCESS_KEY: 'should-not-leak',
      RANDOM_PARENT_ENV: 'should-not-leak',
    })).toEqual({
      PATH: '/bin',
      HOME: '/tmp/home',
      MK_SKILL_ADVISOR_DB_DIR: '/tmp/db',
    });
  });
});

describe('lease-held single-writer enforcement', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    closeDb();
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  it('isLeaseHeld returns held: true when lease is acquired by current process', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'lease-test-'));
    tempDirs.push(tempDir);

    const lease = acquireSkillGraphLease({ workspaceRoot: tempDir });
    const result = isLeaseHeld(tempDir);

    expect(result.held).toBe(true);
    expect(result.ownerPid).toBe(process.pid);
    expect(result.staleReclaimable).toBe(false);

    lease.close();
  });

  it('isLeaseHeld returns held: false when no lease exists', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'lease-test-'));
    tempDirs.push(tempDir);

    const result = isLeaseHeld(tempDir);

    expect(result.held).toBe(false);
    expect(result.ownerPid).toBe(null);
    expect(result.staleReclaimable).toBe(false);
  });

  it('WAL pragma is set on every fresh DB open', () => {
    const tempDbDir = mkdtempSync(join(tmpdir(), 'skill-graph-db-test-'));
    tempDirs.push(tempDbDir);
    process.env.MK_SKILL_ADVISOR_DB_DIR = tempDbDir;

    const db = initDb(tempDbDir);
    const journalMode = db.pragma('journal_mode', { simple: true }) as string;
    const busyTimeout = db.pragma('busy_timeout', { simple: true }) as number;

    expect(journalMode).toBe('wal');
    expect(busyTimeout).toBe(5000);
  });
});
