import { createRequire } from 'node:module';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const LAUNCHER = require.resolve('../../../../bin/mk-spec-memory-launcher.cjs');
const launcher = require(LAUNCHER);
const { cleanCloseAfterReap, uncleanShutdownMarkerPath, resolvedDbDir } = launcher;

// F2 clean-close barrier: the launcher must be able to tell whether a reaped context-server child
// handed off the DB cleanly (close_db ran, `.unclean-shutdown` removed) before respawning over it.
describe('launcher clean-close barrier (F2)', () => {
  const ENV_KEYS = ['MEMORY_DB_PATH', 'SPEC_KIT_DB_DIR', 'SPECKIT_DB_DIR'] as const;
  const originalEnv: Partial<Record<string, string | undefined>> = {};
  for (const key of ENV_KEYS) {
    originalEnv[key] = process.env[key];
  }
  afterEach(() => {
    for (const key of ENV_KEYS) {
      if (originalEnv[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = originalEnv[key];
      }
    }
  });

  it('exposes the clean-close helpers from the launcher module', () => {
    expect(typeof cleanCloseAfterReap).toBe('function');
    expect(typeof uncleanShutdownMarkerPath).toBe('function');
    expect(typeof resolvedDbDir).toBe('function');
  });

  it('treats a reap as a clean close ONLY when the child exited on SIGTERM and the marker is gone', () => {
    expect(cleanCloseAfterReap({ killed: false, markerPresent: false })).toBe(true);
    expect(cleanCloseAfterReap({ killed: false, markerPresent: true })).toBe(false);
    expect(cleanCloseAfterReap({ killed: true, markerPresent: false })).toBe(false);
    expect(cleanCloseAfterReap({ killed: true, markerPresent: true })).toBe(false);
  });

  it('resolves the unclean-shutdown marker inside the resolved DB dir by default', () => {
    for (const key of ENV_KEYS) delete process.env[key];
    const markerPath = uncleanShutdownMarkerPath();
    expect(path.basename(markerPath)).toBe('.unclean-shutdown');
    expect(path.dirname(markerPath)).toBe(resolvedDbDir());
  });

  it('honors a MEMORY_DB_PATH override by using its dirname', () => {
    for (const key of ENV_KEYS) delete process.env[key];
    const override = path.join(path.sep, 'tmp', 'speckit-test-db', 'context-index.sqlite');
    process.env.MEMORY_DB_PATH = override;
    const markerPath = uncleanShutdownMarkerPath();
    expect(markerPath).toBe(path.join(path.dirname(override), '.unclean-shutdown'));
  });

  it('honors a dir override the way the daemon does (marker follows the writer)', () => {
    for (const key of ENV_KEYS) delete process.env[key];
    process.env.SPEC_KIT_DB_DIR = path.join(path.sep, 'tmp', 'speckit-dir-override');
    const markerPath = uncleanShutdownMarkerPath();
    expect(markerPath).toBe(path.join(path.sep, 'tmp', 'speckit-dir-override', '.unclean-shutdown'));
  });

  it('MEMORY_DB_PATH wins over a dir override, matching daemon precedence', () => {
    for (const key of ENV_KEYS) delete process.env[key];
    process.env.SPEC_KIT_DB_DIR = path.join(path.sep, 'tmp', 'speckit-dir-override');
    const override = path.join(path.sep, 'tmp', 'speckit-file-override', 'context-index.sqlite');
    process.env.MEMORY_DB_PATH = override;
    const markerPath = uncleanShutdownMarkerPath();
    expect(markerPath).toBe(path.join(path.dirname(override), '.unclean-shutdown'));
  });
});
