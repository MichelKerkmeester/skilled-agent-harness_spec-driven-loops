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
  const originalMemoryDbPath = process.env.MEMORY_DB_PATH;
  afterEach(() => {
    if (originalMemoryDbPath === undefined) {
      delete process.env.MEMORY_DB_PATH;
    } else {
      process.env.MEMORY_DB_PATH = originalMemoryDbPath;
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
    delete process.env.MEMORY_DB_PATH;
    const markerPath = uncleanShutdownMarkerPath();
    expect(path.basename(markerPath)).toBe('.unclean-shutdown');
    expect(path.dirname(markerPath)).toBe(resolvedDbDir());
  });

  it('honors a MEMORY_DB_PATH override by using its dirname', () => {
    const override = path.join(path.sep, 'tmp', 'speckit-test-db', 'context-index.sqlite');
    process.env.MEMORY_DB_PATH = override;
    const markerPath = uncleanShutdownMarkerPath();
    expect(markerPath).toBe(path.join(path.dirname(override), '.unclean-shutdown'));
  });
});
