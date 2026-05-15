// ───────────────────────────────────────────────────────────────
// MODULE: Launcher Bootstrap Tests
// ───────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import { mkdirSync, mkdtempSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const launcher = require('../../../../bin/mk-skill-advisor-launcher.cjs') as {
  acquireBootstrapLock: (options?: { staleMs?: number; timeoutMs?: number; retrySleepMs?: number }) => Promise<boolean>;
  artifactsReady: () => boolean;
  configureLauncherPathsForTesting: (paths: { mcpDir: string; dbDir: string; lockDir: string; stateFile: string }) => void;
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
});
