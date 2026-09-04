import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const FLAG_NAMES = [
  'SPEC_KIT_DB_DIR',
  'SPECKIT_DB_DIR',
  'MEMORY_DB_PATH',
] as const;

const ORIGINAL_ENV: Partial<Record<typeof FLAG_NAMES[number], string | undefined>> = {};
const ORIGINAL_CWD = process.cwd();
const TEMP_DIRS: string[] = [];

function clearFlags(): void {
  for (const flag of FLAG_NAMES) {
    delete process.env[flag];
  }
}

describe('Database directory resolution', () => {
  beforeEach(() => {
    for (const flag of FLAG_NAMES) {
      ORIGINAL_ENV[flag] = process.env[flag];
    }
    clearFlags();
  });

  afterEach(() => {
    process.chdir(ORIGINAL_CWD);
    for (const flag of FLAG_NAMES) {
      if (ORIGINAL_ENV[flag] === undefined) {
        delete process.env[flag];
      } else {
        process.env[flag] = ORIGINAL_ENV[flag];
      }
    }
    while (TEMP_DIRS.length > 0) {
      const tempDir = TEMP_DIRS.pop();
      if (tempDir) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    }
  });

  it('uses the shared database directory resolver when db-dir env vars are unset', async () => {
    delete process.env.SPEC_KIT_DB_DIR;
    delete process.env.SPECKIT_DB_DIR;
    vi.resetModules();

    const [{ resolveDatabasePaths }, { DB_PATH }] = await Promise.all([
      import('../core/config'),
      import('../../shared/paths'),
    ]);

    expect(resolveDatabasePaths().databaseDir).toBe(path.dirname(DB_PATH));
  });

  it('rejects repo-local database symlinks that realpath outside allowed roots', async () => {
    const workspaceDir = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-db-boundary-'));
    TEMP_DIRS.push(workspaceDir);
    const linkPath = path.join(workspaceDir, 'db-link');
    fs.symlinkSync('/etc', linkPath, 'dir');
    process.chdir(workspaceDir);
    process.env.SPEC_KIT_DB_DIR = 'db-link';
    vi.resetModules();

    await expect(import('../core/config')).rejects.toThrow(/outside the allowed/);
  });

  it('refreshes exported database path bindings when env overrides arrive after import', async () => {
    const workspaceDir = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-db-refresh-'));
    const databaseDir = path.join(workspaceDir, 'runtime-db');
    TEMP_DIRS.push(workspaceDir);
    fs.mkdirSync(databaseDir, { recursive: true });
    process.chdir(workspaceDir);
    vi.resetModules();

    const [config, sharedPaths] = await Promise.all([
      import('../core/config'),
      import('../../shared/paths'),
    ]);
    const initialDir = config.DATABASE_DIR;

    process.env.SPEC_KIT_DB_DIR = databaseDir;
    const resolved = config.resolveDatabasePaths();

    expect(resolved.databaseDir).toBe(fs.realpathSync(databaseDir));
    expect(config.DATABASE_DIR).toBe(fs.realpathSync(databaseDir));
    expect(config.DATABASE_PATH).toBe(path.join(fs.realpathSync(databaseDir), path.basename(sharedPaths.DB_PATH)));
    expect(config.DATABASE_DIR).not.toBe(initialDir);
  });

});
