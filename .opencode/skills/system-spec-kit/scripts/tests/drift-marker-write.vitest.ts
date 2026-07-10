import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DRIFT_MARKER_LOCK_STALE_MS,
  acquireDriftMarkerLock,
  runDriftMarkerWrite,
  writeDriftMarker,
} from '../git-hooks/drift-marker-write';
import { releaseInterprocessLock, resolveMemoryDriftMarkerPath } from '@spec-kit/mcp-server/api';

const ENV_KEYS = ['MEMORY_DB_PATH', 'SPEC_KIT_DB_DIR', 'SPECKIT_DB_DIR'] as const;
const originalEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
const originalCwd = process.cwd();
const tempDirs: string[] = [];

function makeTempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'drift-marker-write-'));
  tempDirs.push(dir);
  return dir;
}

function testInput(repoRoot: string) {
  return {
    repoRoot,
    source: 'drift-marker-write.vitest.ts',
    diff: [
      'R100\t.opencode/specs/old/spec.md\t.opencode/specs/new/spec.md',
      'D\t.opencode/specs/removed/spec.md',
    ].join('\n'),
  };
}

async function exitedPid(): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['-e', ''], { stdio: 'ignore' });
    if (!child.pid) {
      reject(new Error('Child process did not expose a pid'));
      return;
    }
    const pid = child.pid;
    child.once('error', reject);
    child.once('close', () => resolve(pid));
  });
}

describe('drift marker write entrypoint', () => {
  beforeEach(() => {
    const databaseDir = makeTempDir();
    process.env.SPEC_KIT_DB_DIR = databaseDir;
    delete process.env.SPECKIT_DB_DIR;
    delete process.env.MEMORY_DB_PATH;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    for (const key of ENV_KEYS) {
      const value = originalEnv[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    process.chdir(originalCwd);
    for (const dir of tempDirs.splice(0)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('collapses repeated rename and delete entries using the shared key', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-10T12:00:00.000Z'));
    const repoRoot = makeTempDir();

    const markerPath = writeDriftMarker(testInput(repoRoot));
    writeDriftMarker(testInput(repoRoot));

    expect(fs.readFileSync(markerPath!, 'utf8')).toBe(`${JSON.stringify({
      version: 1,
      updatedAt: '2026-07-10T12:00:00.000Z',
      entries: [
        {
          kind: 'rename',
          oldPath: '.opencode/specs/old/spec.md',
          newPath: '.opencode/specs/new/spec.md',
          source: 'drift-marker-write.vitest.ts',
          observedAt: '2026-07-10T12:00:00.000Z',
        },
        {
          kind: 'delete',
          oldPath: '.opencode/specs/removed/spec.md',
          source: 'drift-marker-write.vitest.ts',
          observedAt: '2026-07-10T12:00:00.000Z',
        },
      ],
    }, null, 2)}\n`);
  });

  it('recovers from a partial temp file by publishing only a complete marker', () => {
    const repoRoot = makeTempDir();
    const markerPath = resolveMemoryDriftMarkerPath(path.join(process.env.SPEC_KIT_DB_DIR!, 'context-index.sqlite'));
    fs.writeFileSync(markerPath, '{"version":1,"entries":[]}\n');
    fs.writeFileSync(`${markerPath}.tmp`, '{"partial":');

    writeDriftMarker(testInput(repoRoot));

    expect(JSON.parse(fs.readFileSync(markerPath, 'utf8'))).toMatchObject({
      version: 1,
      entries: expect.arrayContaining([
        expect.objectContaining({ kind: 'rename' }),
        expect.objectContaining({ kind: 'delete' }),
      ]),
    });
    expect(fs.existsSync(`${markerPath}.tmp`)).toBe(false);
  });

  it('reclaims a dead owner immediately and an unknown owner after the 45-second fallback', async () => {
    const repoRoot = makeTempDir();
    const markerPath = resolveMemoryDriftMarkerPath(path.join(process.env.SPEC_KIT_DB_DIR!, 'context-index.sqlite'));
    const lockDir = `${markerPath}.lock`;
    fs.mkdirSync(lockDir, { recursive: true });
    fs.writeFileSync(path.join(lockDir, 'owner.json'), JSON.stringify({ pid: await exitedPid() }));

    const deadOwnerLock = acquireDriftMarkerLock(repoRoot, lockDir);
    expect(fs.existsSync(path.join(lockDir, 'owner.json'))).toBe(true);
    releaseInterprocessLock(deadOwnerLock);

    fs.mkdirSync(lockDir, { recursive: true });
    const staleAt = new Date(Date.now() - DRIFT_MARKER_LOCK_STALE_MS - 1);
    fs.utimesSync(lockDir, staleAt, staleAt);
    const unknownOwnerLock = acquireDriftMarkerLock(repoRoot, lockDir);
    expect(fs.existsSync(path.join(lockDir, 'owner.json'))).toBe(true);
    releaseInterprocessLock(unknownOwnerLock);
  });

  it('rejects an out-of-boundary database override without writing a marker and keeps the CLI non-fatal', () => {
    const repoRoot = makeTempDir();
    process.env.SPEC_KIT_DB_DIR = '/opt/drift-marker-write-boundary-test';

    expect(() => writeDriftMarker(testInput(repoRoot))).toThrow('outside the allowed project, home, and temporary directories');
    expect(fs.existsSync('/opt/drift-marker-write-boundary-test/.memory-drift-dirty-paths.json')).toBe(false);
    process.env.MEMORY_DRIFT_DIFF = testInput(repoRoot).diff;
    process.env.MEMORY_DRIFT_REPO_ROOT = repoRoot;
    process.env.MEMORY_DRIFT_SOURCE = 'drift-marker-write.vitest.ts';
    expect(() => runDriftMarkerWrite()).not.toThrow();
    delete process.env.MEMORY_DRIFT_DIFF;
    delete process.env.MEMORY_DRIFT_REPO_ROOT;
    delete process.env.MEMORY_DRIFT_SOURCE;
  });
});
