// ───────────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Graph Read-Only Mode Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';

import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';

import Database from 'better-sqlite3';

import {
  namespaceArgs,
  runScript,
  uniqueNamespace,
  type ScriptName,
  type ScriptNamespace,
  type ScriptResult,
} from '../helpers/spawn-cjs';

const COVERAGE_DB_FILENAME = 'deep-loop-graph.sqlite';
const OBSERVABILITY_EVENTS_FILENAME = 'observability-events.jsonl';

type GraphDirs = {
  coverage: string;
};

type DirSnapshotEntry = {
  path: string;
  size: number;
  sha256: string;
};

const tempRoots: string[] = [];

afterEach(() => {
  while (tempRoots.length > 0) {
    rmSync(tempRoots.pop() as string, { recursive: true, force: true });
  }
});

/**
 * Creates a tracked temporary directory that is cleaned up after each test.
 */
function makeTempRoot(): string {
  const dir = mkdtempSync(join(tmpdir(), 'graph-read-only-'));
  tempRoots.push(dir);
  return dir;
}

/**
 * Builds the child environment with the graph database directory pinned to a scratch path.
 */
function envFor(dirs: GraphDirs): NodeJS.ProcessEnv {
  return {
    ...process.env,
    DEEP_LOOP_COVERAGE_DB_DIR: dirs.coverage,
  };
}

/**
 * Runs a graph script with the pinned database directories.
 */
function runGraphScript(scriptName: ScriptName, args: string[], dirs: GraphDirs): ScriptResult {
  return runScript(scriptName, args, { env: envFor(dirs) });
}

/**
 * Asserts the read-only success contract and returns the data payload.
 */
function expectReadOnlyPayload(result: ScriptResult, databasePresent: boolean): Record<string, unknown> {
  expect(result.exitCode).toBe(0);
  expect(result.json.status).toBe('ok');
  const data = result.json.data as Record<string, unknown>;
  expect(data.readOnly).toBe(true);
  expect(data.databasePresent).toBe(databasePresent);
  return data;
}

/**
 * Lists every file beneath dir with its size and sha256, sorted by relative path.
 */
function snapshotDir(dir: string): DirSnapshotEntry[] {
  const entries: DirSnapshotEntry[] = [];
  const walk = (current: string): void => {
    for (const name of readdirSync(current).sort()) {
      const absolute = join(current, name);
      const stats = statSync(absolute);
      if (stats.isDirectory()) {
        walk(absolute);
      } else {
        entries.push({
          path: relative(dir, absolute),
          size: stats.size,
          sha256: createHash('sha256').update(readFileSync(absolute)).digest('hex'),
        });
      }
    }
  };
  walk(dir);
  return entries.sort((left, right) => left.path.localeCompare(right.path));
}

/**
 * Counts non-empty observability log lines, treating a missing log as zero lines.
 */
function observabilityLineCount(dir: string): number {
  const eventPath = join(dir, OBSERVABILITY_EVENTS_FILENAME);
  if (!existsSync(eventPath)) return 0;
  return readFileSync(eventPath, 'utf8').split(/\r?\n/u).filter(Boolean).length;
}

/**
 * Removes SQLite side files, which a clean close normally drops on its own.
 */
function removeSqliteSideFiles(dbPath: string): void {
  rmSync(`${dbPath}-wal`, { force: true });
  rmSync(`${dbPath}-shm`, { force: true });
}

/**
 * Stamps a coverage database with an older schema version through better-sqlite3.
 */
function setCoverageSchemaVersion(dbPath: string, version: number): void {
  const db = new Database(dbPath);
  try {
    db.prepare('UPDATE schema_version SET version = ?').run(version);
  } finally {
    db.close();
  }
  removeSqliteSideFiles(dbPath);
}

/**
 * Reads the coverage schema version from a disposable copy so the original stays untouched.
 */
function readCoverageSchemaVersion(dbPath: string): number {
  const copyPath = `${dbPath}.version-probe`;
  copyFileSync(dbPath, copyPath);
  const db = new Database(copyPath);
  try {
    const row = db.prepare('SELECT version FROM schema_version LIMIT 1').get() as { version: number } | undefined;
    return row?.version ?? -1;
  } finally {
    db.close();
    rmSync(copyPath, { force: true });
    removeSqliteSideFiles(copyPath);
  }
}

/**
 * Seeds one graph node for the given namespace through the upsert script.
 */
function seedNode(namespace: ScriptNamespace, dirs: GraphDirs): ScriptResult {
  return runGraphScript('upsert', [
    ...namespaceArgs(namespace),
    '--nodes',
    JSON.stringify([{ id: 'finding-1', kind: 'FINDING', name: 'Seeded finding' }]),
  ], dirs);
}

describe('graph scripts read-only mode', () => {
  it('serves empty results from missing database directories without creating them', () => {
    const root = makeTempRoot();
    const dirs = { coverage: join(root, 'coverage-db') };
    const research = uniqueNamespace('status', 'research');

    const statusResearch = runGraphScript('status', [...namespaceArgs(research), '--read-only'], dirs);
    const statusResearchData = expectReadOnlyPayload(statusResearch, false);
    expect(statusResearchData.totalNodes).toBe(0);
    expect(statusResearchData.totalEdges).toBe(0);

    const queryResearch = runGraphScript('query', [
      ...namespaceArgs(research),
      '--query-type',
      'coverage_gaps',
      '--read-only',
    ], dirs);
    const queryResearchData = expectReadOnlyPayload(queryResearch, false);
    expect(queryResearchData.totalGaps).toBe(0);
    expect(queryResearchData.gaps).toEqual([]);

    const convergenceResearch = runGraphScript('convergence', [
      ...namespaceArgs(research),
      '--persist-snapshot',
      '--iteration',
      '3',
      '--read-only',
    ], dirs);
    const convergenceResearchData = expectReadOnlyPayload(convergenceResearch, false);
    expect(convergenceResearchData.nodeCount).toBe(0);
    expect(convergenceResearchData.edgeCount).toBe(0);

    expect(existsSync(dirs.coverage)).toBe(false);
  });

  it('leaves populated database directories byte-identical across read-only runs', () => {
    const root = makeTempRoot();
    const dirs = { coverage: join(root, 'coverage-db') };
    const research = uniqueNamespace('convergence', 'research');

    // One node makes the read-only pass reach the convergence snapshot branch,
    // and a writable status run materializes the observability log the
    // byte-identity assertions compare against.
    expect(seedNode(research, dirs).exitCode).toBe(0);
    expect(runGraphScript('status', namespaceArgs(research), dirs).exitCode).toBe(0);

    removeSqliteSideFiles(join(dirs.coverage, COVERAGE_DB_FILENAME));

    const coverageBefore = snapshotDir(dirs.coverage);
    expect(coverageBefore.map((entry) => entry.path)).toContain(COVERAGE_DB_FILENAME);
    expect(coverageBefore.map((entry) => entry.path)).toContain(OBSERVABILITY_EVENTS_FILENAME);
    const coverageLinesBefore = observabilityLineCount(dirs.coverage);

    const statusResearchData = expectReadOnlyPayload(
      runGraphScript('status', [...namespaceArgs(research), '--read-only'], dirs),
      true,
    );
    expect(statusResearchData.totalNodes).toBe(1);
    expectReadOnlyPayload(
      runGraphScript('query', [...namespaceArgs(research), '--query-type', 'coverage_gaps', '--read-only'], dirs),
      true,
    );
    const convergenceResearchData = expectReadOnlyPayload(
      runGraphScript('convergence', [
        ...namespaceArgs(research),
        '--persist-snapshot',
        '--iteration',
        '3',
        '--read-only',
      ], dirs),
      true,
    );
    expect(convergenceResearchData.nodeCount).toBe(1);

    const coverageAfter = snapshotDir(dirs.coverage);
    for (const entry of coverageAfter) {
      expect(entry.path.endsWith('-wal')).toBe(false);
      expect(entry.path.endsWith('-shm')).toBe(false);
    }
    expect(coverageAfter).toEqual(coverageBefore);
    expect(observabilityLineCount(dirs.coverage)).toBe(coverageLinesBefore);
  });

  it('does not migrate or rewrite a coverage database stamped with an older schema version', () => {
    const root = makeTempRoot();
    const dirs = { coverage: join(root, 'coverage-db') };
    const research = uniqueNamespace('status', 'research');

    expect(seedNode(research, dirs).exitCode).toBe(0);
    const coverageDbPath = join(dirs.coverage, COVERAGE_DB_FILENAME);
    setCoverageSchemaVersion(coverageDbPath, 1);
    expect(readCoverageSchemaVersion(coverageDbPath)).toBe(1);

    const coverageBefore = snapshotDir(dirs.coverage);
    const result = runGraphScript('status', [...namespaceArgs(research), '--read-only'], dirs);

    if (result.exitCode === 0) {
      expect(result.json.status).toBe('ok');
      const data = result.json.data as Record<string, unknown>;
      expect(data.readOnly).toBe(true);
      expect(data.databasePresent).toBe(true);
    } else {
      expect(result.json.status).toBe('error');
      expect(typeof result.json.error).toBe('string');
      expect((result.json.error as string).length).toBeGreaterThan(0);
    }

    expect(snapshotDir(dirs.coverage)).toEqual(coverageBefore);
    expect(readCoverageSchemaVersion(coverageDbPath)).toBe(1);
  });

  it('control: a writable status run creates the missing database directory', () => {
    const root = makeTempRoot();
    const dirs = { coverage: join(root, 'coverage-db') };
    const research = uniqueNamespace('status', 'research');

    expect(existsSync(dirs.coverage)).toBe(false);

    const result = runGraphScript('status', namespaceArgs(research), dirs);

    expect(result.exitCode).toBe(0);
    expect(result.json.status).toBe('ok');
    expect(existsSync(dirs.coverage)).toBe(true);
    expect(existsSync(join(dirs.coverage, COVERAGE_DB_FILENAME))).toBe(true);
    const data = result.json.data as Record<string, unknown>;
    expect(data.readOnly).toBeUndefined();
  });
});
