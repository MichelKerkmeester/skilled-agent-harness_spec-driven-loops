// ───────────────────────────────────────────────────────────────
// MODULE: Launcher Install Guard Tests
// ───────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const launcherPath = require.resolve('../../../../bin/system-skill-advisor-launcher.cjs');
const launcher = require('../../../../bin/system-skill-advisor-launcher.cjs') as {
  buildIfNeeded: (actions: string[]) => void;
  configureLauncherPathsForTesting: (paths: {
    kitDir: string;
    runtimeDir: string;
    dbDir: string;
    lockDir: string;
    stateFile: string;
  }) => void;
  installedTreeMatchesLockfile: (dir: string) => boolean;
};

describe('system-skill-advisor launcher install guard', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  function createTempDir(): string {
    const dir = mkdtempSync(join(tmpdir(), 'system-skill-advisor-install-guard-'));
    tempDirs.push(dir);
    return dir;
  }

  function writeLockfile(runtimeDir: string): void {
    writeFileSync(join(runtimeDir, 'package-lock.json'), JSON.stringify({
      name: 'test-runtime',
      version: '1.0.0',
      lockfileVersion: 3,
      requires: true,
      packages: {
        '': { name: 'test-runtime', version: '1.0.0' },
        'node_modules/left-pad': { version: '1.3.0' },
        'node_modules/opt-pkg': { version: '1.0.0', optional: true },
      },
    }, null, 2));
  }

  function writeLeftPad(runtimeDir: string, version: string): void {
    const leftPadDir = join(runtimeDir, 'node_modules', 'left-pad');
    mkdirSync(leftPadDir, { recursive: true });
    writeFileSync(join(leftPadDir, 'package.json'), JSON.stringify({ name: 'left-pad', version }));
  }

  it('matches installed required packages and skips missing optional packages', () => {
    const runtimeDir = createTempDir();
    writeLockfile(runtimeDir);
    writeLeftPad(runtimeDir, '1.3.0');

    expect(launcher.installedTreeMatchesLockfile(runtimeDir)).toBe(true);
  });

  it('rejects an installed package whose version differs from the lockfile', () => {
    const runtimeDir = createTempDir();
    writeLockfile(runtimeDir);
    writeLeftPad(runtimeDir, '1.2.0');

    expect(launcher.installedTreeMatchesLockfile(runtimeDir)).toBe(false);
  });

  it('rejects a missing required package', () => {
    const runtimeDir = createTempDir();
    writeLockfile(runtimeDir);

    expect(launcher.installedTreeMatchesLockfile(runtimeDir)).toBe(false);
  });

  it('rejects a runtime directory without a lockfile', () => {
    expect(launcher.installedTreeMatchesLockfile(createTempDir())).toBe(false);
  });

  function createBuildTree(leftPadVersion: string): {
    kitDir: string;
    runtimeDir: string;
    dbDir: string;
    lockDir: string;
    stateFile: string;
    fakeBinDir: string;
    logFile: string;
  } {
    const root = createTempDir();
    const kitDir = join(root, 'skills', 'system-skill-advisor');
    const runtimeDir = join(kitDir, 'runtime');
    const specKitDir = join(root, 'skills', 'system-spec-kit');
    const dbDir = join(root, 'database');
    const lockDir = join(dbDir, 'launcher.lockdir');
    const stateFile = join(dbDir, 'launcher.json');
    const fakeBinDir = join(root, 'fake-bin');
    const logFile = join(root, 'npm.log');

    mkdirSync(join(runtimeDir, 'dist', 'runtime'), { recursive: true });
    mkdirSync(join(specKitDir, 'node_modules', '.bin'), { recursive: true });
    mkdirSync(fakeBinDir, { recursive: true });
    writeFileSync(join(specKitDir, 'node_modules', '.bin', 'tsc'), '');
    writeFileSync(join(runtimeDir, 'package.json'), JSON.stringify({ name: 'test-runtime', version: '1.0.0' }));
    writeLockfile(runtimeDir);
    writeLeftPad(runtimeDir, leftPadVersion);

    const sourceFile = join(runtimeDir, 'advisor-server.ts');
    const outputFile = join(runtimeDir, 'dist', 'runtime', 'advisor-server.js');
    writeFileSync(sourceFile, 'export {};\n');
    writeFileSync(outputFile, '// stale output\n');
    const oldTime = new Date(Date.now() - 60_000);
    const newTime = new Date(Date.now() + 5_000);
    utimesSync(outputFile, oldTime, oldTime);
    utimesSync(sourceFile, newTime, newTime);

    const npmPath = join(fakeBinDir, 'npm');
    writeFileSync(npmPath, `#!/bin/sh
printf '%s\\n' "$*" >> '${logFile}'
if [ "$1" = "ci" ] || [ "$1" = "install" ]; then
  rm -rf node_modules
  exit 1
fi
if [ "$1" = "run" ] && [ "$2" = "build" ]; then
  touch dist/runtime/advisor-server.js
  exit 0
fi
exit 2
`);
    chmodSync(npmPath, 0o755);

    return { kitDir, runtimeDir, dbDir, lockDir, stateFile, fakeBinDir, logFile };
  }

  function runChildBuild(tree: ReturnType<typeof createBuildTree>) {
    const code = `
      const launcher = require(${JSON.stringify(launcherPath)});
      launcher.configureLauncherPathsForTesting({
        kitDir: ${JSON.stringify(tree.kitDir)},
        runtimeDir: ${JSON.stringify(tree.runtimeDir)},
        dbDir: ${JSON.stringify(tree.dbDir)},
        lockDir: ${JSON.stringify(tree.lockDir)},
        stateFile: ${JSON.stringify(tree.stateFile)},
      });
      launcher.buildIfNeeded([]);
    `;
    const env = { ...process.env };
    delete env.VITEST;
    env.PATH = `${tree.fakeBinDir}:${process.env.PATH ?? ''}`;

    return spawnSync(process.execPath, ['-e', code], { env, encoding: 'utf8' });
  }

  it('builds with matching installed dependencies after an offline install would fail', () => {
    const tree = createBuildTree('1.3.0');
    const child = runChildBuild(tree);
    const logLines = readFileSync(tree.logFile, 'utf8').trim().split('\n');

    expect(child.status).toBe(0);
    expect(readFileSync(join(tree.runtimeDir, 'node_modules', 'left-pad', 'package.json'), 'utf8')).toContain('1.3.0');
    expect(logLines).toContain('run build');
    expect(logLines.some((line) => line.startsWith('ci') || line.startsWith('install'))).toBe(false);
  });

  it('runs npm ci when an installed package does not match the lockfile', () => {
    const tree = createBuildTree('1.2.0');
    const child = runChildBuild(tree);
    const logLines = readFileSync(tree.logFile, 'utf8').trim().split('\n');

    expect(child.status).not.toBe(0);
    expect(logLines.some((line) => line.startsWith('ci'))).toBe(true);
  });
});
