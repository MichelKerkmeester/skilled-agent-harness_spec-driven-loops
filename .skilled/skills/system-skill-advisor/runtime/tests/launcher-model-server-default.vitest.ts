// ───────────────────────────────────────────────────────────────────
// MODULE: Launcher Model Server Default Tests
// ───────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import { copyFileSync, mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const launcher = require('../../../../bin/system-skill-advisor-launcher.cjs') as {
  acquireOwnerLeaseFile: () => { acquired: boolean; lease?: Record<string, unknown> };
  buildOwnerLease: () => Record<string, unknown>;
  clearOwnerLeaseFile: () => void;
  configureLauncherPathsForTesting: (paths: { runtimeDir?: string; dbDir: string; lockDir: string; stateFile: string }) => void;
  readOwnerLeaseFile: () => Record<string, unknown> | null;
  isModelServerEnabled: () => boolean;
  modelServerSetting: () => 'default-on' | 'explicit-on' | 'off';
  pinModelServerToAdvisorDatabase: (env: NodeJS.ProcessEnv) => string | null;
  resolveModelServerSocketPath: (env?: NodeJS.ProcessEnv) => string;
};

const FLAG = 'SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED';
const DB_DIR_ENV = 'SYSTEM_SKILL_ADVISOR_DB_DIR';
const original = process.env[FLAG];

function setFlag(value: string | undefined): void {
  if (value === undefined) delete process.env[FLAG];
  else process.env[FLAG] = value;
}

afterEach(() => {
  setFlag(original);
});

describe('skill-advisor model-server spawn default', () => {
  it('arms the spawn when the flag is unset, because no other launcher can', () => {
    setFlag(undefined);
    expect(launcher.modelServerSetting()).toBe('default-on');
    expect(launcher.isModelServerEnabled()).toBe(true);
  });

  it('treats a blank value the same as unset', () => {
    setFlag('   ');
    expect(launcher.modelServerSetting()).toBe('default-on');
    expect(launcher.isModelServerEnabled()).toBe(true);
  });

  it('records an explicit 1 separately so a missing supervision library can fail loudly', () => {
    setFlag('1');
    expect(launcher.modelServerSetting()).toBe('explicit-on');
    expect(launcher.isModelServerEnabled()).toBe(true);
  });

  it('turns the spawner off for 0 and for any other value', () => {
    for (const value of ['0', 'false', 'off', 'no']) {
      setFlag(value);
      expect(launcher.modelServerSetting(), value).toBe('off');
      expect(launcher.isModelServerEnabled(), value).toBe(false);
    }
  });
});

describe('owner lease records the launcher supervision decision', () => {
  const tempDirs: string[] = [];
  const originalDbDir = process.env[DB_DIR_ENV];

  function configureTempLauncher(target: typeof launcher = launcher): void {
    const root = mkdtempSync(join(tmpdir(), 'advisor-lease-supervision-'));
    tempDirs.push(root);
    const runtimeDir = join(root, 'runtime');
    const dbDir = join(runtimeDir, 'database');
    mkdirSync(dbDir, { recursive: true });
    target.configureLauncherPathsForTesting({
      runtimeDir,
      dbDir,
      lockDir: join(dbDir, '.system-skill-advisor-launcher.lockdir'),
      stateFile: join(dbDir, '.system-skill-advisor-launcher.json'),
    });
  }

  // The path resolver prefers this variable over the configured database
  // directory, so a value inherited from the shell would redirect the lease
  // file away from the temp directory these cases inspect.
  beforeEach(() => {
    delete process.env[DB_DIR_ENV];
  });

  afterEach(() => {
    try { launcher.clearOwnerLeaseFile(); } catch { /* ignore */ }
    if (originalDbDir === undefined) delete process.env[DB_DIR_ENV];
    else process.env[DB_DIR_ENV] = originalDbDir;
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  it.each([
    [undefined, true],
    ['', true],
    ['1', true],
    ['0', false],
    ['off', false],
  ])('writes supervisesModelServer for the flag %j', (value, expected) => {
    configureTempLauncher();
    setFlag(value);

    expect(launcher.acquireOwnerLeaseFile().acquired).toBe(true);

    expect(launcher.readOwnerLeaseFile()?.supervisesModelServer).toBe(expected);
  });

  it.each([undefined, '1'])(
    'writes false when the flag is %j but the supervision library is absent',
    (value) => {
      // A launcher copied beside no lib/ directory loads without the supervision
      // module, the same shape as a package that shipped without it.
      const isolatedRoot = mkdtempSync(join(tmpdir(), 'advisor-launcher-no-supervision-'));
      tempDirs.push(isolatedRoot);
      const isolatedBin = join(isolatedRoot, 'bin');
      mkdirSync(isolatedBin, { recursive: true });
      const isolatedLauncherPath = join(isolatedBin, 'system-skill-advisor-launcher.cjs');
      copyFileSync(require.resolve('../../../../bin/system-skill-advisor-launcher.cjs'), isolatedLauncherPath);
      const isolated = require(isolatedLauncherPath) as typeof launcher;
      configureTempLauncher(isolated);
      setFlag(value);

      expect(isolated.isModelServerEnabled()).toBe(true);
      expect(isolated.buildOwnerLease().supervisesModelServer).toBe(false);
    },
  );
});

describe('sandboxed launcher model-server isolation', () => {
  const SHARED_SOCKET_DIR = '/tmp/system-skill-advisor';
  const SANDBOX_DB_DIR = join(tmpdir(), 'advisor-model-server-pin-db');

  it('gives a launcher with its own database its own model-server address', () => {
    const liveEnv: NodeJS.ProcessEnv = { SPECKIT_IPC_SOCKET_DIR: SHARED_SOCKET_DIR };
    const sandboxEnv: NodeJS.ProcessEnv = {
      SPECKIT_IPC_SOCKET_DIR: SHARED_SOCKET_DIR,
      SYSTEM_SKILL_ADVISOR_DB_DIR: SANDBOX_DB_DIR,
    };

    const pinned = launcher.pinModelServerToAdvisorDatabase(sandboxEnv);

    expect(pinned).not.toBeNull();
    expect(sandboxEnv.HF_EMBED_SERVER_URL).toBe(pinned);
    expect(launcher.resolveModelServerSocketPath(sandboxEnv)).toBe(pinned);
    expect(dirname(launcher.resolveModelServerSocketPath(sandboxEnv)))
      .not.toBe(dirname(launcher.resolveModelServerSocketPath(liveEnv)));
    expect(sandboxEnv.SPECKIT_IPC_SOCKET_DIR).toBe(SHARED_SOCKET_DIR);
  });

  it('leaves a workspace launcher and an explicit model-server address alone', () => {
    const liveEnv: NodeJS.ProcessEnv = { SPECKIT_IPC_SOCKET_DIR: SHARED_SOCKET_DIR };
    expect(launcher.pinModelServerToAdvisorDatabase(liveEnv)).toBeNull();
    expect(liveEnv).toEqual({ SPECKIT_IPC_SOCKET_DIR: SHARED_SOCKET_DIR });

    const explicitEnv: NodeJS.ProcessEnv = {
      SYSTEM_SKILL_ADVISOR_DB_DIR: SANDBOX_DB_DIR,
      HF_EMBED_SERVER_URL: 'tcp://127.0.0.1:9',
    };
    expect(launcher.pinModelServerToAdvisorDatabase(explicitEnv)).toBeNull();
    expect(explicitEnv.HF_EMBED_SERVER_URL).toBe('tcp://127.0.0.1:9');
  });
});
