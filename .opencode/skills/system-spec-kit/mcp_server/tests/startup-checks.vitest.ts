// TEST: STARTUP CHECKS
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  checkSqliteVersion,
  checkJournalMode,
  consumeMemoryDriftDirtyMarker,
  detectNodeVersionMismatch,
  detectRuntimeMismatch,
  sweepStaleMemoryDriftProcessingMarkers,
  type NodeVersionMarker,
} from '../startup-checks.js';
import { resolveMemoryDriftMarkerPath } from '../lib/storage/memory-drift-healing.js';

describe('Startup Checks', () => {

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('detectRuntimeMismatch', () => {
    const marker: NodeVersionMarker = {
      nodeVersion: 'v22.0.0',
      moduleVersion: '127',
      platform: 'darwin',
      arch: 'arm64',
      createdAt: '2026-03-12T00:00:00.000Z',
    };

    it('returns no mismatch when ABI, platform, and arch all match', () => {
      const result = detectRuntimeMismatch(marker, {
        nodeVersion: 'v22.2.0',
        moduleVersion: '127',
        platform: 'darwin',
        arch: 'arm64',
      });

      expect(result).toEqual({
        detected: false,
        reasons: [],
      });
    });

    it('reports module ABI changes', () => {
      const result = detectRuntimeMismatch(marker, {
        nodeVersion: 'v24.0.0',
        moduleVersion: '130',
        platform: 'darwin',
        arch: 'arm64',
      });

      expect(result.detected).toBe(true);
      expect(result.reasons).toContain('module ABI');
    });

    it('reports platform and architecture changes even when ABI matches', () => {
      const result = detectRuntimeMismatch(marker, {
        nodeVersion: 'v22.0.0',
        moduleVersion: '127',
        platform: 'linux',
        arch: 'x64',
      });

      expect(result.detected).toBe(true);
      expect(result.reasons).toEqual(['platform', 'architecture']);
    });
  });

  describe('detectNodeVersionMismatch', () => {
    it('warns when the marker ABI differs from the current runtime', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({
        nodeVersion: 'v0.0.0',
        moduleVersion: `${Number(process.versions.modules) + 1}`,
        platform: process.platform,
        arch: process.arch,
        createdAt: '2026-03-12T00:00:00.000Z',
      }));
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      detectNodeVersionMismatch();

      expect(warnSpy).toHaveBeenCalled();
      expect(warnSpy.mock.calls.flat().join(' ')).toContain('module ABI');
    });

    it('logs OK when the marker matches the current runtime', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({
        nodeVersion: process.version,
        moduleVersion: process.versions.modules,
        platform: process.platform,
        arch: process.arch,
        createdAt: '2026-03-12T00:00:00.000Z',
      }));
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      detectNodeVersionMismatch();

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Node runtime check: OK'));
      expect(warnSpy.mock.calls.flat().join(' ')).not.toContain('WARNING: Native runtime changed');
    });

    it('creates a marker file when one does not exist', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      const writeSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      detectNodeVersionMismatch();

      expect(writeSpy).toHaveBeenCalled();
      expect(String(writeSpy.mock.calls[0]?.[1])).toContain(process.versions.modules);
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Created .node-version-marker'));
    });
  });

  describe('checkSqliteVersion', () => {
    it('should log OK for version >= 3.35.0', () => {
      const mockDb = {
        prepare: () => ({ get: () => ({ version: '3.45.1' }) }),
      };
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      checkSqliteVersion(mockDb);

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('meets 3.35.0+ requirement'));
      warnSpy.mockRestore();
    });

    it('should warn for version < 3.35.0', () => {
      const mockDb = {
        prepare: () => ({ get: () => ({ version: '3.34.0' }) }),
      };
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      checkSqliteVersion(mockDb);

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('WARNING'));
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Minimum required: 3.35.0'));
      warnSpy.mockRestore();
    });

    it('should warn for major version < 3', () => {
      const mockDb = {
        prepare: () => ({ get: () => ({ version: '2.99.0' }) }),
      };
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      checkSqliteVersion(mockDb);

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('WARNING'));
      warnSpy.mockRestore();
    });

    it('should handle query failure gracefully', () => {
      const mockDb = {
        prepare: () => ({ get: () => { throw new Error('database is locked'); } }),
      };
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      checkSqliteVersion(mockDb);

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Could not determine SQLite version'));
      warnSpy.mockRestore();
    });

    it('should log exact version string in success message', () => {
      const mockDb = {
        prepare: () => ({ get: () => ({ version: '3.40.0' }) }),
      };
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      checkSqliteVersion(mockDb);

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('3.40.0'));
      warnSpy.mockRestore();
    });

    it('should handle exact boundary version 3.35.0 as passing', () => {
      const mockDb = {
        prepare: () => ({ get: () => ({ version: '3.35.0' }) }),
      };
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      checkSqliteVersion(mockDb);

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('meets 3.35.0+ requirement'));
      expect(warnSpy.mock.calls.flat().join(' ')).not.toContain('WARNING: SQLite version');
      warnSpy.mockRestore();
    });

    it('should warn on malformed SQLite version strings', () => {
      const mockDb = {
        prepare: () => ({ get: () => ({ version: '3.x' }) }),
      };
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      checkSqliteVersion(mockDb);

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('unexpected version format'));
      warnSpy.mockRestore();
    });

    it('should handle non-Error throwables gracefully', () => {
      const mockDb = {
        prepare: () => ({ get: () => { throw 'database offline'; } }),
      };
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      checkSqliteVersion(mockDb);

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('database offline'));
      warnSpy.mockRestore();
    });
  });

  describe('checkJournalMode', () => {
    it('takes no action when journal_mode is the deliberately-chosen delete', () => {
      const pragmaSpy = vi.fn();
      const mockDb = {
        prepare: () => ({ get: () => ({ journal_mode: 'delete' }) }),
        pragma: pragmaSpy,
      };
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      checkJournalMode(mockDb);

      expect(pragmaSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('takes no action when journal_mode is the legacy wal state', () => {
      const pragmaSpy = vi.fn();
      const mockDb = {
        prepare: () => ({ get: () => ({ journal_mode: 'wal' }) }),
        pragma: pragmaSpy,
      };
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      checkJournalMode(mockDb);

      expect(pragmaSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('warns but never mutates journal_mode for an unexpected value', () => {
      const pragmaSpy = vi.fn();
      const mockDb = {
        prepare: () => ({ get: () => ({ journal_mode: 'truncate' }) }),
        pragma: pragmaSpy,
      };
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      checkJournalMode(mockDb);

      expect(pragmaSpy).not.toHaveBeenCalled();
      expect(pragmaSpy.mock.calls).not.toContainEqual(['journal_mode = WAL']);
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("unexpected journal_mode 'truncate'"));
    });

    it('is case-insensitive when reading the current journal_mode', () => {
      const pragmaSpy = vi.fn();
      const mockDb = {
        prepare: () => ({ get: () => ({ journal_mode: 'DELETE' }) }),
        pragma: pragmaSpy,
      };
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      checkJournalMode(mockDb);

      expect(pragmaSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('treats a missing/undefined journal_mode result as unexpected and warns without mutating', () => {
      const pragmaSpy = vi.fn();
      const mockDb = {
        prepare: () => ({ get: () => undefined }),
        pragma: pragmaSpy,
      };
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      checkJournalMode(mockDb);

      expect(pragmaSpy).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("unexpected journal_mode ''"));
    });
  });

  describe('sweepStaleMemoryDriftProcessingMarkers', () => {
    const tempRoots: string[] = [];

    function tempDbPath(): string {
      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'drift-sweep-'));
      tempRoots.push(root);
      return path.join(root, 'database', 'context-index.sqlite');
    }

    afterEach(() => {
      for (const root of tempRoots.splice(0)) {
        fs.rmSync(root, { recursive: true, force: true });
      }
    });

    it('is a no-op when the memory DB directory does not exist yet (fresh install)', () => {
      const dbPath = tempDbPath(); // parent directory intentionally never created
      const result = sweepStaleMemoryDriftProcessingMarkers({ databasePath: dbPath });
      expect(result).toEqual({ recovered: 0, unrecoverable: 0, entries: 0 });
    });

    it('is a no-op -- no new log noise, no behavior change -- when the directory exists but no stale file is present', () => {
      const dbPath = tempDbPath();
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = sweepStaleMemoryDriftProcessingMarkers({ databasePath: dbPath });

      expect(result).toEqual({ recovered: 0, unrecoverable: 0, entries: 0 });
      expect(warnSpy).not.toHaveBeenCalled();
      expect(errorSpy).not.toHaveBeenCalled();
    });

    it('merge-all policy: multiple stale processing files at once are all recovered and merged into the canonical marker', () => {
      const dbPath = tempDbPath();
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
      const markerPath = resolveMemoryDriftMarkerPath(dbPath);

      fs.writeFileSync(`${markerPath}.processing-111-1000`, JSON.stringify({
        version: 1,
        updatedAt: '2026-07-08T00:00:00.000Z',
        entries: [{ kind: 'delete', oldPath: '.opencode/specs/demo/a/spec.md' }],
      }));
      fs.writeFileSync(`${markerPath}.processing-222-2000`, JSON.stringify({
        version: 1,
        updatedAt: '2026-07-09T00:00:00.000Z',
        entries: [{ kind: 'delete', oldPath: '.opencode/specs/demo/b/spec.md' }],
      }));

      const result = sweepStaleMemoryDriftProcessingMarkers({ databasePath: dbPath });

      expect(result).toEqual({ recovered: 2, unrecoverable: 0, entries: 2 });
      expect(fs.existsSync(`${markerPath}.processing-111-1000`)).toBe(false);
      expect(fs.existsSync(`${markerPath}.processing-222-2000`)).toBe(false);
      expect(fs.existsSync(markerPath)).toBe(true);

      const restored = JSON.parse(fs.readFileSync(markerPath, 'utf8')) as { entries: Array<{ oldPath: string }> };
      expect(restored.entries.map((entry) => entry.oldPath).sort()).toEqual([
        '.opencode/specs/demo/a/spec.md',
        '.opencode/specs/demo/b/spec.md',
      ]);
    });

    it('a malformed/unreadable stale file is treated as unrecoverable and logged, not a boot failure', () => {
      const dbPath = tempDbPath();
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
      const markerPath = resolveMemoryDriftMarkerPath(dbPath);
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      fs.writeFileSync(`${markerPath}.processing-333-3000`, '{not-valid-json');

      const result = sweepStaleMemoryDriftProcessingMarkers({ databasePath: dbPath });

      expect(result).toEqual({ recovered: 0, unrecoverable: 1, entries: 0 });
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('malformed or empty'));
      expect(fs.existsSync(markerPath)).toBe(false);
      expect(fs.existsSync(`${markerPath}.processing-333-3000`)).toBe(false);
    });

    it('retains stale markers when a non-missing-file read error prevents recovery', () => {
      const dbPath = tempDbPath();
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
      const markerPath = resolveMemoryDriftMarkerPath(dbPath);
      const unreadablePath = `${markerPath}.processing-99999999-4000`;
      fs.mkdirSync(unreadablePath);
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = sweepStaleMemoryDriftProcessingMarkers({ databasePath: dbPath });

      expect(result).toEqual({ recovered: 0, unrecoverable: 1, entries: 0 });
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('unreadable'));
      expect(fs.existsSync(unreadablePath)).toBe(true);
    });

    it('merges recovered entries into an existing live canonical marker instead of clobbering it', () => {
      const dbPath = tempDbPath();
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
      const markerPath = resolveMemoryDriftMarkerPath(dbPath);

      fs.writeFileSync(markerPath, JSON.stringify({
        version: 1,
        entries: [{ kind: 'delete', oldPath: '.opencode/specs/demo/live/spec.md' }],
      }));
      fs.writeFileSync(`${markerPath}.processing-444-4000`, JSON.stringify({
        version: 1,
        entries: [{ kind: 'delete', oldPath: '.opencode/specs/demo/stale/spec.md' }],
      }));

      const result = sweepStaleMemoryDriftProcessingMarkers({ databasePath: dbPath });

      expect(result.recovered).toBe(1);
      const restored = JSON.parse(fs.readFileSync(markerPath, 'utf8')) as { entries: Array<{ oldPath: string }> };
      expect(restored.entries.map((entry) => entry.oldPath).sort()).toEqual([
        '.opencode/specs/demo/live/spec.md',
        '.opencode/specs/demo/stale/spec.md',
      ]);
    });
  });
});

describe('Memory drift marker read retention', () => {
  const tempRoots: string[] = [];

  function createMarker(raw: string): {
    databasePath: string;
    markerPath: string;
    workspacePath: string;
  } {
    const workspacePath = fs.mkdtempSync(path.join(os.tmpdir(), 'drift-consume-'));
    tempRoots.push(workspacePath);
    const databasePath = path.join(workspacePath, 'database', 'context-index.sqlite');
    const markerPath = resolveMemoryDriftMarkerPath(databasePath);
    fs.mkdirSync(path.dirname(databasePath), { recursive: true });
    fs.writeFileSync(markerPath, raw, 'utf8');
    return { databasePath, markerPath, workspacePath };
  }

  afterEach(() => {
    vi.restoreAllMocks();
    for (const root of tempRoots.splice(0)) {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('restores a claimed marker after a transient EACCES read failure', async () => {
    const raw = JSON.stringify({
      version: 1,
      entries: [{ kind: 'delete', oldPath: '.opencode/specs/demo/spec.md' }],
    });
    const fixture = createMarker(raw);
    const originalReadFileSync = fs.readFileSync.bind(fs);
    vi.spyOn(fs, 'readFileSync').mockImplementation((...args: Parameters<typeof fs.readFileSync>) => {
      const [filePath] = args;
      if (typeof filePath === 'string' && filePath.startsWith(`${fixture.markerPath}.processing-`)) {
        const error = new Error('permission denied') as NodeJS.ErrnoException;
        error.code = 'EACCES';
        throw error;
      }
      return originalReadFileSync(...args);
    });
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await consumeMemoryDriftDirtyMarker({
      databasePath: fixture.databasePath,
      workspacePath: fixture.workspacePath,
      runScopedScan: vi.fn(),
    });

    expect(result.consumed).toBe(false);
    expect(result.error).toContain('permission denied');
    expect(fs.readFileSync(fixture.markerPath, 'utf8')).toBe(raw);
    expect(fs.readdirSync(path.dirname(fixture.markerPath)).some((entry) => entry.includes('.processing-'))).toBe(false);
  });

  it('deletes retained malformed bytes only after a retry proves they are invalid', async () => {
    const fixture = createMarker('{not-valid-json');
    const readSpy = vi.spyOn(fs, 'readFileSync').mockImplementationOnce(() => {
      const error = new Error('permission denied') as NodeJS.ErrnoException;
      error.code = 'EACCES';
      throw error;
    });
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const options = {
      databasePath: fixture.databasePath,
      workspacePath: fixture.workspacePath,
      runScopedScan: vi.fn(),
    };
    const deferred = await consumeMemoryDriftDirtyMarker(options);

    expect(deferred.consumed).toBe(false);
    expect(fs.existsSync(fixture.markerPath)).toBe(true);

    readSpy.mockRestore();
    const discarded = await consumeMemoryDriftDirtyMarker(options);

    expect(discarded).toMatchObject({ consumed: true, entries: 0, error: null });
    expect(fs.existsSync(fixture.markerPath)).toBe(false);
    expect(fs.readdirSync(path.dirname(fixture.markerPath)).some((entry) => entry.includes('.processing-'))).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('malformed or empty'));
  });
});
