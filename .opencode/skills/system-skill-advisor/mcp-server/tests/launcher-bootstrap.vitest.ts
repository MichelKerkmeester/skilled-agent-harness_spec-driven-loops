// ───────────────────────────────────────────────────────────────
// MODULE: Launcher Bootstrap Tests
// ───────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { initDb, getDb, closeDb, resolveSkillGraphDbDir } from '../lib/skill-graph/skill-graph-db.js';
import { isLeaseHeld, acquireSkillGraphLease, openLeaseDatabase } from '../lib/daemon/lease.js';
import { rebuildAdvisorIndex } from '../handlers/advisor-rebuild.js';
import type { AdvisorStatusOutput } from '../schemas/advisor-tool-schemas.js';
import { resolveProvider } from '@spec-kit/shared/embeddings/factory.js';

const require = createRequire(import.meta.url);
const launcher = require('../../../../bin/mk-skill-advisor-launcher.cjs') as {
  acquireBootstrapLock: (options?: { staleMs?: number; timeoutMs?: number; retrySleepMs?: number }) => Promise<boolean>;
  advisorDbPath: () => string;
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
    const mcpDir = join(root, 'mcp-server');
    const dbDir = join(mcpDir, 'database');
    const lockDir = join(dbDir, '.mk-skill-advisor-launcher.lockdir');
    mkdirSync(join(mcpDir, 'dist/mcp-server'), { recursive: true });
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
    const serverPath = join(mcpDir, 'dist/mcp-server/advisor-server.js');
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
    configureTempLauncher();
    const memoryDbPath = launcher.advisorDbPath();
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
      MEMORY_DB_PATH: memoryDbPath,
    });
  });

  it('passes the committed daemon trust default through to the advisor child env', () => {
    configureTempLauncher();
    const memoryDbPath = launcher.advisorDbPath();
    const opencodeConfig = JSON.parse(sourceText('../../../../../opencode.json')) as {
      mcp?: { mk_skill_advisor?: { environment?: Record<string, string> } };
    };
    const committedTrustDefault = opencodeConfig.mcp?.mk_skill_advisor?.environment?.MK_SKILL_ADVISOR_TRUST_DEFAULT;

    expect(committedTrustDefault).toBe('trusted');
    expect(sourceText('../advisor-server.ts')).toContain('process.env.MK_SKILL_ADVISOR_TRUST_DEFAULT');
    expect(launcher.createChildEnv({
      MK_SKILL_ADVISOR_TRUST_DEFAULT: committedTrustDefault,
      AWS_SECRET_ACCESS_KEY: 'should-not-leak',
    })).toEqual({
      MK_SKILL_ADVISOR_TRUST_DEFAULT: 'trusted',
      MEMORY_DB_PATH: memoryDbPath,
    });
  });

  it('passes advisor shadow feature flags through to the child env', () => {
    configureTempLauncher();
    const memoryDbPath = launcher.advisorDbPath();
    expect(launcher.createChildEnv({
      SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW: 'true',
      SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_SHADOW: 'true',
      AWS_SECRET_ACCESS_KEY: 'should-not-leak',
    })).toEqual({
      SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW: 'true',
      SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_SHADOW: 'true',
      MEMORY_DB_PATH: memoryDbPath,
    });
  });

  it('defaults the child MEMORY_DB_PATH to the advisor own database, not mk-spec-memory context-index.sqlite', () => {
    configureTempLauncher();
    const childEnv = launcher.createChildEnv({ PATH: '/bin' });

    expect(childEnv.MEMORY_DB_PATH).toBe(launcher.advisorDbPath());
    expect(childEnv.MEMORY_DB_PATH).toMatch(/skill-graph\.sqlite$/);
    expect(childEnv.MEMORY_DB_PATH).not.toMatch(/context-index\.sqlite$/);
  });

  it('honors an explicit MK_SKILL_ADVISOR_MEMORY_DB_PATH override instead of the default', () => {
    configureTempLauncher();
    const explicitOverride = '/tmp/some-other-test-or-external-db/custom.sqlite';

    const childEnv = launcher.createChildEnv({
      PATH: '/bin',
      MK_SKILL_ADVISOR_MEMORY_DB_PATH: explicitOverride,
    });

    expect(childEnv.MEMORY_DB_PATH).toBe(explicitOverride);
  });

  it('009-REQ-004/005: ignores an ambient MEMORY_DB_PATH that was not set via the dedicated override var', () => {
    configureTempLauncher();
    const memoryDbPath = launcher.advisorDbPath();
    // Mimics mk-spec-memory's own established use of this exact env var name —
    // a legacy shell/script exporting it must not silently reopen the
    // cross-server DB-path leak the advisor default protects against.
    const ambientMemoryDbPath = '/tmp/some-other-service/context-index.sqlite';

    const childEnv = launcher.createChildEnv({ PATH: '/bin', MEMORY_DB_PATH: ambientMemoryDbPath });

    expect(childEnv.MEMORY_DB_PATH).toBe(memoryDbPath);
    expect(childEnv.MEMORY_DB_PATH).not.toBe(ambientMemoryDbPath);
  });

  it('009-REQ-004: the dedicated override wins even when a hostile ambient MEMORY_DB_PATH is also present', () => {
    configureTempLauncher();
    const explicitOverride = '/tmp/some-other-test-or-external-db/custom.sqlite';
    const ambientMemoryDbPath = '/tmp/some-other-service/context-index.sqlite';

    const childEnv = launcher.createChildEnv({
      PATH: '/bin',
      MEMORY_DB_PATH: ambientMemoryDbPath,
      MK_SKILL_ADVISOR_MEMORY_DB_PATH: explicitOverride,
    });

    expect(childEnv.MEMORY_DB_PATH).toBe(explicitOverride);
  });
});

describe('mk-skill-advisor launcher end-to-end MEMORY_DB_PATH resolution (009-REQ-008)', () => {
  const tempDirs: string[] = [];
  const restoreKeys = ['MEMORY_DB_PATH', 'SPEC_KIT_DB_DIR', 'SPECKIT_DB_DIR', 'EMBEDDINGS_PROVIDER', 'VOYAGE_API_KEY', 'OPENAI_API_KEY'] as const;
  const originalEnv: Partial<Record<(typeof restoreKeys)[number], string>> = {};
  for (const key of restoreKeys) {
    originalEnv[key] = process.env[key];
  }

  afterEach(() => {
    for (const key of restoreKeys) {
      const value = originalEnv[key];
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  // Provider resolution must be driven by the fixture DBs alone, not by
  // whatever the ambient shell/CI environment happens to have set.
  function clearNonDbProviderSignals(): void {
    delete process.env.EMBEDDINGS_PROVIDER;
    delete process.env.VOYAGE_API_KEY;
    delete process.env.OPENAI_API_KEY;
    delete process.env.SPEC_KIT_DB_DIR;
    delete process.env.SPECKIT_DB_DIR;
  }

  function configureTempLauncherForE2e(): void {
    const root = mkdtempSync(join(tmpdir(), 'mk-skill-advisor-e2e-'));
    tempDirs.push(root);
    const mcpDir = join(root, 'mcp-server');
    const dbDir = join(mcpDir, 'database');
    mkdirSync(join(mcpDir, 'dist/mcp-server'), { recursive: true });
    mkdirSync(dbDir, { recursive: true });
    launcher.configureLauncherPathsForTesting({
      mcpDir,
      dbDir,
      lockDir: join(dbDir, '.mk-skill-advisor-launcher.lockdir'),
      stateFile: join(dbDir, '.mk-skill-advisor-launcher.json'),
    });
  }

  // A valid, resolvable ollama pointer: name/dim match the shared registry's
  // sole real manifest, with the vec_<dim> + vec_memories_rowids tables the
  // shared factory's active-Ollama gate requires before it will honor the
  // pointer at all.
  function createResolvableOllamaFixture(dbPath: string): void {
    const DatabaseSync = loadNodeSqlite();
    const db = new DatabaseSync(dbPath);
    try {
      db.prepare('CREATE TABLE vec_metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL)').run();
      const setMetadata = db.prepare('INSERT INTO vec_metadata (key, value) VALUES (?, ?)');
      setMetadata.run('active_embedder_name', 'nomic-embed-text-v1.5');
      setMetadata.run('active_embedder_dim', '768');
      setMetadata.run('active_embedder_provider', 'ollama');
      db.prepare('CREATE TABLE vec_768 (id INTEGER PRIMARY KEY, embedding BLOB NOT NULL)').run();
      db.prepare("INSERT INTO vec_768 (id, embedding) VALUES (1, x'00')").run();
      db.prepare('CREATE TABLE vec_memories_rowids (rowid INTEGER PRIMARY KEY, memory_id INTEGER NOT NULL)').run();
      db.prepare('INSERT INTO vec_memories_rowids (rowid, memory_id) VALUES (1, 1)').run();
    } finally {
      db.close();
    }
  }

  // A deliberately unresolvable pointer at a wrong-shaped DB: same manifest
  // name but a dim that does not match the registry's known dim for it, so
  // the shared factory's active-Ollama gate rejects it and falls through to
  // hf-local. Stands in for "a DB that is not the advisor's own" without
  // depending on any real repo state.
  function createUnresolvableFixture(dbPath: string): void {
    const DatabaseSync = loadNodeSqlite();
    const db = new DatabaseSync(dbPath);
    try {
      db.prepare('CREATE TABLE vec_metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL)').run();
      const setMetadata = db.prepare('INSERT INTO vec_metadata (key, value) VALUES (?, ?)');
      setMetadata.run('active_embedder_name', 'nomic-embed-text-v1.5');
      setMetadata.run('active_embedder_dim', '512');
      setMetadata.run('active_embedder_provider', 'ollama');
    } finally {
      db.close();
    }
  }

  it('the real launcher-derived MEMORY_DB_PATH makes the real shared factory open the advisor own skill-graph.sqlite', () => {
    configureTempLauncherForE2e();
    const advisorDbPath = launcher.advisorDbPath();
    mkdirSync(dirname(advisorDbPath), { recursive: true });
    createResolvableOllamaFixture(advisorDbPath);

    const childEnv = launcher.createChildEnv({ PATH: '/bin' });
    expect(childEnv.MEMORY_DB_PATH).toBe(advisorDbPath);

    clearNonDbProviderSignals();
    process.env.MEMORY_DB_PATH = childEnv.MEMORY_DB_PATH;
    const resolution = resolveProvider();

    expect(resolution.name).toBe('ollama');
    expect(resolution.reason).toContain('nomic-embed-text-v1.5');
    expect(resolution.reason).toContain('768-dim');
  });

  it('regression: the real shared factory does NOT resolve the advisor sentinel when fed the pre-fix (un-computed) env value', () => {
    configureTempLauncherForE2e();
    const advisorDbPath = launcher.advisorDbPath();
    mkdirSync(dirname(advisorDbPath), { recursive: true });
    createResolvableOllamaFixture(advisorDbPath);

    const decoyDir = mkdtempSync(join(tmpdir(), 'mk-skill-advisor-e2e-decoy-'));
    tempDirs.push(decoyDir);
    const decoyDbPath = join(decoyDir, 'context-index.sqlite');
    createUnresolvableFixture(decoyDbPath);

    // Simulates the exact leak this packet's F2 fix closes: an ambient
    // MEMORY_DB_PATH pointing at a different service's own database, forwarded
    // verbatim rather than computed by createChildEnv().
    clearNonDbProviderSignals();
    process.env.MEMORY_DB_PATH = decoyDbPath;
    const preFixResolution = resolveProvider();

    expect(preFixResolution.name).not.toBe('ollama');

    // The real createChildEnv() ignores that same ambient value and computes
    // the advisor's own path instead — feeding that (not the ambient value)
    // to the real consumer resolves the advisor sentinel correctly.
    const childEnv = launcher.createChildEnv({ PATH: '/bin', MEMORY_DB_PATH: decoyDbPath });
    process.env.MEMORY_DB_PATH = childEnv.MEMORY_DB_PATH;
    const postFixResolution = resolveProvider();

    expect(postFixResolution.name).toBe('ollama');
    expect(postFixResolution.reason).toContain('768-dim');
  });
});

function sourceText(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

interface FixtureSqliteStatement {
  run(...params: readonly unknown[]): unknown;
}

interface FixtureSqliteDatabase {
  prepare(sql: string): FixtureSqliteStatement;
  close(): void;
}

type FixtureDatabaseSyncConstructor = new (filename: string) => FixtureSqliteDatabase;

// node:sqlite's DatabaseSync is used only for fixture setup here (writing
// vec_metadata rows), never as the module under test — the assertions run
// against the real shared factory's own sqlite reader.
function loadNodeSqlite(): FixtureDatabaseSyncConstructor {
  const sqliteModule = require('node:sqlite') as unknown;
  const DatabaseSync = typeof sqliteModule === 'object' && sqliteModule !== null
    ? (sqliteModule as { DatabaseSync?: unknown }).DatabaseSync
    : undefined;
  if (typeof DatabaseSync !== 'function') {
    throw new Error('node:sqlite DatabaseSync is unavailable in this test runtime');
  }
  return DatabaseSync as FixtureDatabaseSyncConstructor;
}

function findDeadPid(): number {
  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const pid = Math.floor(Math.random() * 1_000_000) + 100_000;
    try {
      process.kill(pid, 0);
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code === 'ESRCH') {
        return pid;
      }
    }
  }
  throw new Error('unable to find an unused pid for stale lease coverage');
}

function advisorStatus(freshness: AdvisorStatusOutput['freshness'], generation: number): AdvisorStatusOutput {
  const checkedAt = new Date().toISOString();
  return {
    freshness,
    generation,
    trustState: {
      state: freshness,
      reason: freshness === 'live' ? null : 'runtime-test',
      generation,
      checkedAt,
      lastLiveAt: freshness === 'live' ? checkedAt : null,
    },
    lastGenerationBump: null,
    lastScanAt: null,
    skillCount: 0,
    laneWeights: {
      explicit_author: 0.42,
      lexical: 0.28,
      graph_causal: 0.13,
      derived_generated: 0.12,
      semantic_shadow: 0.05,
    },
  };
}

describe('lease-held single-writer enforcement', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    closeDb();
    delete process.env.MK_SKILL_ADVISOR_DB_DIR;
    delete process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
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

  it('isLeaseHeld returns staleReclaimable: true for a dead-pid lease', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'lease-test-'));
    tempDirs.push(tempDir);
    const leaseDbPath = join(tempDir, 'lease.sqlite');
    const deadPid = findDeadPid();
    const timestamp = Date.now() - 60_000;
    const leaseDb = openLeaseDatabase(tempDir, leaseDbPath);

    try {
      leaseDb.prepare(`
        INSERT INTO skill_graph_daemon_lease (workspace_key, owner_id, pid, acquired_at, heartbeat_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(realpathSync.native(dirname(leaseDbPath)), 'dead-owner', deadPid, timestamp, timestamp);
    } finally {
      leaseDb.close();
    }

    const result = isLeaseHeld(tempDir, { leaseDbPath });

    expect(result.held).toBe(false);
    expect(result.ownerPid).toBe(deadPid);
    expect(result.staleReclaimable).toBe(true);
  });

  it('isLeaseHeld keys ownership by resolved DB directory override', () => {
    const firstWorkspace = mkdtempSync(join(tmpdir(), 'lease-workspace-a-'));
    const secondWorkspace = mkdtempSync(join(tmpdir(), 'lease-workspace-b-'));
    const sharedDbDir = mkdtempSync(join(tmpdir(), 'lease-shared-db-'));
    tempDirs.push(firstWorkspace, secondWorkspace, sharedDbDir);
    process.env.MK_SKILL_ADVISOR_DB_DIR = sharedDbDir;

    const lease = acquireSkillGraphLease({ workspaceRoot: firstWorkspace });
    const result = isLeaseHeld(secondWorkspace);

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

  it('005-REQ-009 runtime: advisor_rebuild opens DB with WAL and busy_timeout pragmas', () => {
    const workspaceRoot = mkdtempSync(join(tmpdir(), 'skill-graph-runtime-open-'));
    const tempDbDir = mkdtempSync(join(tmpdir(), 'skill-graph-db-test-'));
    tempDirs.push(workspaceRoot, tempDbDir);
    mkdirSync(join(workspaceRoot, '.opencode', 'skills'), { recursive: true });
    process.env.MK_SKILL_ADVISOR_DB_DIR = tempDbDir;
    let statusCalls = 0;

    rebuildAdvisorIndex({ workspaceRoot, force: true }, {
      readStatus: () => {
        statusCalls += 1;
        return advisorStatus(statusCalls > 1 ? 'live' : 'stale', statusCalls);
      },
      publishGeneration: () => undefined,
      sourceSignature: () => 'runtime-test-signature',
    });

    const db = getDb();
    const resolvedDir = resolveSkillGraphDbDir();
    const journalMode = db.pragma('journal_mode', { simple: true }) as string;
    const busyTimeout = db.pragma('busy_timeout', { simple: true }) as number;

    expect(resolvedDir).toBe(tempDbDir);
    expect(journalMode).toBe('wal');
    expect(busyTimeout).toBe(5000);
  });

  it('005-REQ-009 static: watcher refresh path uses the shared DB opener', () => {
    const dbSource = sourceText('../lib/skill-graph/skill-graph-db.ts');
    const watcherSource = sourceText('../lib/daemon/watcher.ts');

    expect(dbSource).toMatch(/export function getDb\(\): Database\.Database \{\s*if \(!db\) initDb\(resolveSkillGraphDbDir\(\)\)/);
    expect(watcherSource).toContain('const defaultReindex = async (): Promise<ReindexResult> => indexSkillMetadata(skillsRoot);');
  });
});
