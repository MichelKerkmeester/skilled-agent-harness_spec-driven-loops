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
const COUNCIL_DB_FILENAME = 'council-graph.sqlite';
const OBSERVABILITY_EVENTS_FILENAME = 'observability-events.jsonl';

type GraphDirs = {
  coverage: string;
  council: string;
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
 * Builds the child environment with both graph database directories pinned to scratch paths.
 */
function envFor(dirs: GraphDirs): NodeJS.ProcessEnv {
  return {
    ...process.env,
    DEEP_LOOP_COVERAGE_DB_DIR: dirs.coverage,
    DEEP_LOOP_COUNCIL_DB_DIR: dirs.council,
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
  const isCouncil = namespace.loopType === 'council';
  return runGraphScript('upsert', [
    ...namespaceArgs(namespace),
    '--nodes',
    JSON.stringify([isCouncil
      ? { id: 'session-1', kind: 'SESSION', name: 'Seeded session' }
      : { id: 'finding-1', kind: 'FINDING', name: 'Seeded finding' }]),
  ], dirs);
}

describe('graph scripts read-only mode', () => {
  it('serves empty results from missing database directories without creating them', () => {
    const root = makeTempRoot();
    const dirs = { coverage: join(root, 'coverage-db'), council: join(root, 'council-db') };
    const research = uniqueNamespace('status', 'research');
    const council = uniqueNamespace('status', 'council');

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
      '--round-id',
      'r1',
      '--read-only',
    ], dirs);
    const convergenceResearchData = expectReadOnlyPayload(convergenceResearch, false);
    expect(convergenceResearchData.nodeCount).toBe(0);
    expect(convergenceResearchData.edgeCount).toBe(0);

    const statusCouncil = runGraphScript('status', [...namespaceArgs(council), '--read-only'], dirs);
    const statusCouncilData = expectReadOnlyPayload(statusCouncil, false);
    expect(statusCouncilData.totalNodes).toBe(0);
    expect(statusCouncilData.totalEdges).toBe(0);

    const queryCouncil = runGraphScript('query', [
      ...namespaceArgs(council),
      '--query-type',
      'unresolved_disagreements',
      '--read-only',
    ], dirs);
    const queryCouncilData = expectReadOnlyPayload(queryCouncil, false);
    expect(queryCouncilData.totalUnresolved).toBe(0);
    expect(queryCouncilData.disagreements).toEqual([]);

    const convergenceCouncil = runGraphScript('convergence', [
      ...namespaceArgs(council),
      '--persist-snapshot',
      '--iteration',
      '3',
      '--round-id',
      'r1',
      '--read-only',
    ], dirs);
    const convergenceCouncilData = expectReadOnlyPayload(convergenceCouncil, false);
    expect(convergenceCouncilData.nodeCount).toBe(0);
    expect(convergenceCouncilData.edgeCount).toBe(0);

    expect(existsSync(dirs.coverage)).toBe(false);
    expect(existsSync(dirs.council)).toBe(false);
  });

  it('leaves populated database directories byte-identical across read-only runs', () => {
    const root = makeTempRoot();
    const dirs = { coverage: join(root, 'coverage-db'), council: join(root, 'council-db') };
    const research = uniqueNamespace('convergence', 'research');
    const council = uniqueNamespace('convergence', 'council');

    // One node per graph makes the read-only pass reach the convergence snapshot
    // branch, and a writable status run materializes the observability log the
    // byte-identity assertions compare against.
    expect(seedNode(research, dirs).exitCode).toBe(0);
    expect(seedNode(council, dirs).exitCode).toBe(0);
    expect(runGraphScript('status', namespaceArgs(research), dirs).exitCode).toBe(0);
    expect(runGraphScript('status', namespaceArgs(council), dirs).exitCode).toBe(0);

    removeSqliteSideFiles(join(dirs.coverage, COVERAGE_DB_FILENAME));
    removeSqliteSideFiles(join(dirs.council, COUNCIL_DB_FILENAME));

    const coverageBefore = snapshotDir(dirs.coverage);
    const councilBefore = snapshotDir(dirs.council);
    expect(coverageBefore.map((entry) => entry.path)).toContain(COVERAGE_DB_FILENAME);
    expect(coverageBefore.map((entry) => entry.path)).toContain(OBSERVABILITY_EVENTS_FILENAME);
    expect(councilBefore.map((entry) => entry.path)).toContain(COUNCIL_DB_FILENAME);
    expect(councilBefore.map((entry) => entry.path)).toContain(OBSERVABILITY_EVENTS_FILENAME);
    const coverageLinesBefore = observabilityLineCount(dirs.coverage);
    const councilLinesBefore = observabilityLineCount(dirs.council);

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
        '--round-id',
        'r1',
        '--read-only',
      ], dirs),
      true,
    );
    expect(convergenceResearchData.nodeCount).toBe(1);

    const statusCouncilData = expectReadOnlyPayload(
      runGraphScript('status', [...namespaceArgs(council), '--read-only'], dirs),
      true,
    );
    expect(statusCouncilData.totalNodes).toBe(1);
    expectReadOnlyPayload(
      runGraphScript('query', [
        ...namespaceArgs(council),
        '--query-type',
        'unresolved_disagreements',
        '--read-only',
      ], dirs),
      true,
    );
    const convergenceCouncilData = expectReadOnlyPayload(
      runGraphScript('convergence', [
        ...namespaceArgs(council),
        '--persist-snapshot',
        '--iteration',
        '3',
        '--round-id',
        'r1',
        '--read-only',
      ], dirs),
      true,
    );
    expect(convergenceCouncilData.nodeCount).toBe(1);

    const coverageAfter = snapshotDir(dirs.coverage);
    const councilAfter = snapshotDir(dirs.council);
    for (const entry of [...coverageAfter, ...councilAfter]) {
      expect(entry.path.endsWith('-wal')).toBe(false);
      expect(entry.path.endsWith('-shm')).toBe(false);
    }
    expect(coverageAfter).toEqual(coverageBefore);
    expect(councilAfter).toEqual(councilBefore);
    expect(observabilityLineCount(dirs.coverage)).toBe(coverageLinesBefore);
    expect(observabilityLineCount(dirs.council)).toBe(councilLinesBefore);
  });

  it('does not migrate or rewrite a coverage database stamped with an older schema version', () => {
    const root = makeTempRoot();
    const dirs = { coverage: join(root, 'coverage-db'), council: join(root, 'council-db') };
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
    const dirs = { coverage: join(root, 'coverage-db'), council: join(root, 'council-db') };
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
