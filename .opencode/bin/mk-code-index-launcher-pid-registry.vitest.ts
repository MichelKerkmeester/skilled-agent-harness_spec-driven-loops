// ───────────────────────────────────────────────────────────────────
// MODULE: Code Index Launcher PID Registry Tests
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

type DaemonPidRegistry = {
  daemonPid: number;
  launcherPid: number;
  socketPath: string | null;
  startedAtIso: string;
  canonicalDbDir: string;
  registryPath?: string;
};

// ───────────────────────────────────────────────────────────────────
// 3. TEST SUBJECT (CJS REQUIRE)
// ───────────────────────────────────────────────────────────────────

const require = createRequire(import.meta.url);
const fs = require('node:fs') as typeof import('node:fs');
const {
  clearAllLeaseFiles,
  clearDaemonPidRegistry,
  configureLauncherPathsForTesting,
  daemonPidRegistryPath,
  discoverDaemonFromRegistry,
  writeDaemonPidRegistry,
} = require('./mk-code-index-launcher.cjs') as {
  clearAllLeaseFiles: () => void;
  clearDaemonPidRegistry: (dbDir?: string) => void;
  configureLauncherPathsForTesting: (nextPaths: Record<string, string>) => void;
  daemonPidRegistryPath: (dbDir?: string) => string;
  discoverDaemonFromRegistry: (dbDir?: string) => DaemonPidRegistry | null;
  writeDaemonPidRegistry: (registry: DaemonPidRegistry) => void;
};

// ───────────────────────────────────────────────────────────────────
// 4. TEST STATE
// ───────────────────────────────────────────────────────────────────

const testDir = dirname(fileURLToPath(import.meta.url));

let tempRoot: string;
let originalDbDir: string | undefined;

// ───────────────────────────────────────────────────────────────────
// 5. HELPER FUNCTIONS
// ───────────────────────────────────────────────────────────────────

function registryFor(overrides: Partial<DaemonPidRegistry> = {}): DaemonPidRegistry {
  return {
    daemonPid: 12345,
    launcherPid: process.pid,
    socketPath: join(tempRoot, 'daemon.sock'),
    startedAtIso: '2026-06-29T12:00:00.000Z',
    canonicalDbDir: tempRoot,
    ...overrides,
  };
}

// ───────────────────────────────────────────────────────────────────
// 6. TEST SUITE
// ───────────────────────────────────────────────────────────────────

describe('code-index daemon PID registry', () => {
  beforeEach(() => {
    originalDbDir = process.env.SPECKIT_CODE_GRAPH_DB_DIR;
    tempRoot = fs.mkdtempSync(join(testDir, '.mk-code-index-pid-registry-'));
    process.env.SPECKIT_CODE_GRAPH_DB_DIR = tempRoot;
    configureLauncherPathsForTesting({
      dbDir: tempRoot,
      lockDir: join(tempRoot, 'bootstrap.lock'),
      stateFile: join(tempRoot, 'state.json'),
    });
  });

  afterEach(() => {
    if (originalDbDir === undefined) {
      delete process.env.SPECKIT_CODE_GRAPH_DB_DIR;
    } else {
      process.env.SPECKIT_CODE_GRAPH_DB_DIR = originalDbDir;
    }
    fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  it('writes the registry atomically with the expected fields', () => {
    const registry = registryFor();

    writeDaemonPidRegistry(registry);

    const registryPath = daemonPidRegistryPath(tempRoot);
    const parsed = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    expect(parsed).toEqual(registry);
    expect(fs.readdirSync(tempRoot).filter((name) => name.includes('.tmp.'))).toEqual([]);
  });

  it('discovers present registries and tolerates missing or corrupt files', () => {
    const registry = registryFor({ daemonPid: 23456, socketPath: null });
    writeDaemonPidRegistry(registry);

    expect(discoverDaemonFromRegistry(tempRoot)).toEqual({
      ...registry,
      registryPath: daemonPidRegistryPath(tempRoot),
    });

    clearDaemonPidRegistry(tempRoot);
    expect(discoverDaemonFromRegistry(tempRoot)).toBeNull();

    fs.writeFileSync(daemonPidRegistryPath(tempRoot), '{not-json', { mode: 0o600 });
    expect(discoverDaemonFromRegistry(tempRoot)).toBeNull();
  });

  it('survives generic lease cleanup and is removed by the child clean-exit cleanup', () => {
    writeDaemonPidRegistry(registryFor());
    fs.writeFileSync(
      join(tempRoot, '.mk-code-index-launcher.json'),
      `${JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString(), socketPath: null }, null, 2)}\n`,
      { mode: 0o600 },
    );

    clearAllLeaseFiles();

    expect(discoverDaemonFromRegistry(tempRoot)).not.toBeNull();

    clearDaemonPidRegistry(tempRoot);

    expect(discoverDaemonFromRegistry(tempRoot)).toBeNull();
  });
});
