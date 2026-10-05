// ───────────────────────────────────────────────────────────────
// MODULE: system-skill-advisor Launcher Stale-Build Detection Tests
// ───────────────────────────────────────────────────────────────
// A daemon loads its code once at launch. When the server entrypoint is rebuilt
// after that launch, the launcher and the CLI must recycle the daemon instead of
// using it, but never mistake a launcher that is still bootstrapping for one.

import { createRequire } from 'node:module';
import { mkdtempSync, mkdirSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { __testing as cli } from '../skill-advisor-cli.js';

const require = createRequire(import.meta.url);
const launcher = require('../../../../bin/system-skill-advisor-launcher.cjs') as {
  launchedDaemonPredatesBuild: (leaseResult: { ownerPid: number; legacyPath?: string | null }) => boolean;
  configureLauncherPathsForTesting: (paths: { runtimeDir?: string; dbDir: string; lockDir: string; stateFile: string }) => void;
};

const tempDirs: string[] = [];
const BUILD_TIME = new Date('2026-10-05T12:00:00.000Z');

function stageLauncher(options: { entrypoint?: boolean } = {}): string {
  const root = mkdtempSync(join(tmpdir(), 'system-skill-advisor-stale-build-'));
  tempDirs.push(root);
  const runtimeDir = join(root, 'runtime');
  const dbDir = join(runtimeDir, 'database');
  mkdirSync(dbDir, { recursive: true });
  if (options.entrypoint !== false) {
    const distDir = join(runtimeDir, 'dist', 'runtime');
    mkdirSync(distDir, { recursive: true });
    const entrypoint = join(distDir, 'advisor-server.js');
    writeFileSync(entrypoint, '// built\n');
    utimesSync(entrypoint, BUILD_TIME, BUILD_TIME);
  }
  launcher.configureLauncherPathsForTesting({
    runtimeDir,
    dbDir,
    lockDir: join(dbDir, '.system-skill-advisor-launcher.lockdir'),
    stateFile: join(dbDir, '.system-skill-advisor-launcher.json'),
  });
  return dbDir;
}

function writeLease(dbDir: string, lease: Record<string, unknown>): void {
  writeFileSync(join(dbDir, '.system-skill-advisor-launcher.json'), JSON.stringify(lease));
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('launchedDaemonPredatesBuild', () => {
  it('flags a launched daemon whose launch predates the current build', () => {
    const dbDir = stageLauncher();
    writeLease(dbDir, { pid: 4242, ownerPid: 4242, childPid: 4243, startedAt: '2026-10-05T11:00:00.000Z' });

    expect(launcher.launchedDaemonPredatesBuild({ ownerPid: 4242 })).toBe(true);
  });

  it('leaves a daemon launched after the build alone', () => {
    const dbDir = stageLauncher();
    writeLease(dbDir, { pid: 4242, ownerPid: 4242, childPid: 4243, startedAt: '2026-10-05T13:00:00.000Z' });

    expect(launcher.launchedDaemonPredatesBuild({ ownerPid: 4242 })).toBe(false);
  });

  it('never flags a launcher that has not launched its daemon yet', () => {
    const dbDir = stageLauncher();
    writeLease(dbDir, { pid: 4242, ownerPid: 4242, startedAt: '2026-10-05T11:00:00.000Z' });

    expect(launcher.launchedDaemonPredatesBuild({ ownerPid: 4242 })).toBe(false);
  });

  it('does not flag anything when the entrypoint is missing', () => {
    const dbDir = stageLauncher({ entrypoint: false });
    writeLease(dbDir, { pid: 4242, ownerPid: 4242, childPid: 4243, startedAt: '2026-10-05T11:00:00.000Z' });

    expect(launcher.launchedDaemonPredatesBuild({ ownerPid: 4242 })).toBe(false);
  });
});

describe('CLI liveDaemonPredatesBuild', () => {
  function cliPaths(dbDir: string) {
    const runtimeDir = join(dbDir, '..');
    return {
      opencodeDir: '',
      repoRoot: '',
      launcherPath: '',
      bridgePath: '',
      dbDir,
      packageJsonPath: join(runtimeDir, 'package.json'),
      packageLockPath: join(runtimeDir, 'package-lock.json'),
    };
  }

  it('flags the same stale lease the launcher does', () => {
    const dbDir = stageLauncher();
    writeLease(dbDir, { pid: 4242, ownerPid: 4242, childPid: 4243, startedAt: '2026-10-05T11:00:00.000Z' });

    expect(cli.liveDaemonPredatesBuild(cliPaths(dbDir))).toBe(true);
  });

  it('leaves a daemon launched after the build alone', () => {
    const dbDir = stageLauncher();
    writeLease(dbDir, { pid: 4242, ownerPid: 4242, childPid: 4243, startedAt: '2026-10-05T13:00:00.000Z' });

    expect(cli.liveDaemonPredatesBuild(cliPaths(dbDir))).toBe(false);
  });

  it('treats a missing lease as nothing to recycle', () => {
    const dbDir = stageLauncher();

    expect(cli.liveDaemonPredatesBuild(cliPaths(dbDir))).toBe(false);
  });
});
