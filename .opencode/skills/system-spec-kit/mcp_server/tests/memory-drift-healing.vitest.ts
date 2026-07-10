import Database from 'better-sqlite3';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { __testables as searchTestables } from '../handlers/memory-search';
import {
  appendMemoryDriftSuspects,
  MEMORY_DRIFT_SUSPECT_QUEUE_KEY,
  MEMORY_DRIFT_SUSPECT_QUEUE_MAX_SIZE,
  parseMemoryDriftMarker,
  readMemoryDriftSuspects,
  removeMemoryDriftSuspects,
  resolveMemoryDriftMarkerPath,
} from '../lib/storage/memory-drift-healing';
import { consumeMemoryDriftDirtyMarker } from '../startup-checks';

const tempRoots: string[] = [];

function tempRoot(prefix: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempRoots.push(root);
  return root;
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of tempRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('memory drift healing helpers', () => {
  it('filters missing backing files from top-k rows without deleting the row', () => {
    const root = tempRoot('query-existence-');
    const existingPath = path.join(root, 'spec.md');
    const missingPath = path.join(root, 'plan.md');
    fs.writeFileSync(existingPath, '# spec');
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const filtered = searchTestables.applyQueryTimeExistenceFilter([
      { id: 1, file_path: existingPath, score: 1 },
      { id: 2, file_path: missingPath, score: 0.9 },
    ]);

    expect(filtered.results.map((result) => result.id)).toEqual([1]);
    expect(filtered.stats).toMatchObject({ checked: 2, excluded: 1, suspectIds: [2] });
  });

  it('round-trips suspect queue entries through the config table', () => {
    const db = new Database(':memory:');
    try {
      appendMemoryDriftSuspects(db, [7, 8, 7], '2026-07-09T00:00:00.000Z');
      expect(readMemoryDriftSuspects(db).map((suspect) => suspect.id)).toEqual([7, 8]);

      removeMemoryDriftSuspects(db, [7]);
      expect(readMemoryDriftSuspects(db).map((suspect) => suspect.id)).toEqual([8]);

      removeMemoryDriftSuspects(db, [8]);
      expect(readMemoryDriftSuspects(db)).toEqual([]);
    } finally {
      db.close();
    }
  });

  it('keeps the queue at its cap and defers the one-over-cap candidate', () => {
    const db = new Database(':memory:');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const atCap = appendMemoryDriftSuspects(
        db,
        Array.from({ length: MEMORY_DRIFT_SUSPECT_QUEUE_MAX_SIZE }, (_, index) => index + 1),
      );
      expect(atCap).toMatchObject({
        accepted: MEMORY_DRIFT_SUSPECT_QUEUE_MAX_SIZE,
        rejected: 0,
        queueSize: MEMORY_DRIFT_SUSPECT_QUEUE_MAX_SIZE,
      });

      const oneOverCap = appendMemoryDriftSuspects(db, [MEMORY_DRIFT_SUSPECT_QUEUE_MAX_SIZE + 1]);
      expect(oneOverCap).toMatchObject({
        accepted: 0,
        rejected: 1,
        queueSize: MEMORY_DRIFT_SUSPECT_QUEUE_MAX_SIZE,
      });
      expect(readMemoryDriftSuspects(db).map((suspect) => suspect.id)).not.toContain(MEMORY_DRIFT_SUSPECT_QUEUE_MAX_SIZE + 1);
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Drift suspect queue is full'));
    } finally {
      db.close();
    }
  });

  it('F11: logs exactly one warning naming the failure and still returns [] when the suspect queue fails to parse', () => {
    const db = new Database(':memory:');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      db.exec('CREATE TABLE IF NOT EXISTS config (key TEXT PRIMARY KEY, value TEXT)');
      db.prepare('INSERT INTO config (key, value) VALUES (?, ?)').run(MEMORY_DRIFT_SUSPECT_QUEUE_KEY, '{not-json');

      expect(readMemoryDriftSuspects(db)).toEqual([]);
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy.mock.calls[0]?.[0]).toContain('[memory-drift-healing]');
    } finally {
      db.close();
    }
  });

  it('F11: a successful read produces no new log output', () => {
    const db = new Database(':memory:');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      appendMemoryDriftSuspects(db, [1, 2], '2026-07-09T00:00:00.000Z');
      warnSpy.mockClear();

      expect(readMemoryDriftSuspects(db).map((suspect) => suspect.id)).toEqual([1, 2]);
      expect(warnSpy).not.toHaveBeenCalled();
    } finally {
      db.close();
    }
  });

  it('parses valid markers and rejects malformed marker JSON without throwing', () => {
    const parsed = parseMemoryDriftMarker(JSON.stringify({
      version: 1,
      entries: [
        { kind: 'rename', oldPath: '.opencode/specs/a/spec.md', newPath: '.opencode/specs/b/spec.md' },
        { kind: 'delete', oldPath: '.opencode/specs/c/spec.md' },
        { kind: 'rename', oldPath: '.opencode/specs/d/spec.md' },
      ],
    }));
    expect(parsed?.entries).toHaveLength(2);
    expect(parseMemoryDriftMarker('{not-json')).toBeNull();
  });

  it('consumes a marker, delegates one scoped scan, refreshes moved folders, and removes the marker', async () => {
    const root = tempRoot('marker-consume-');
    const dbPath = path.join(root, 'database', 'context-index.sqlite');
    const movedSpec = path.join(root, '.opencode', 'specs', 'demo', '002-new', 'spec.md');
    fs.mkdirSync(path.dirname(movedSpec), { recursive: true });
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(movedSpec, '# moved');
    const markerPath = resolveMemoryDriftMarkerPath(dbPath);
    fs.writeFileSync(markerPath, JSON.stringify({
      version: 1,
      entries: [
        {
          kind: 'rename',
          oldPath: '.opencode/specs/demo/001-old/spec.md',
          newPath: '.opencode/specs/demo/002-new/spec.md',
        },
        { kind: 'delete', oldPath: '.opencode/specs/demo/003-deleted/spec.md' },
      ],
    }));

    const scanCalls: string[][] = [];
    const refreshed: string[] = [];
    const result = await consumeMemoryDriftDirtyMarker({
      databasePath: dbPath,
      workspacePath: root,
      runScopedScan: async (paths) => { scanCalls.push(paths); },
      refreshMovedSpecFolder: (folderPath) => { refreshed.push(folderPath); },
    });

    expect(result.consumed).toBe(true);
    expect(result.entries).toBe(2);
    expect(scanCalls).toHaveLength(1);
    expect(scanCalls[0]).toEqual(expect.arrayContaining([
      path.join(root, '.opencode', 'specs', 'demo', '001-old', 'spec.md'),
      movedSpec,
      path.join(root, '.opencode', 'specs', 'demo', '003-deleted', 'spec.md'),
    ]));
    expect(refreshed).toEqual([path.dirname(movedSpec)]);
    expect(fs.existsSync(markerPath)).toBe(false);
  });

  it('treats malformed marker files as non-fatal no-op input', async () => {
    const root = tempRoot('marker-malformed-');
    const dbPath = path.join(root, 'database', 'context-index.sqlite');
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(resolveMemoryDriftMarkerPath(dbPath), '{bad-json');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const scan = vi.fn<() => Promise<void>>();

    const result = await consumeMemoryDriftDirtyMarker({
      databasePath: dbPath,
      workspacePath: root,
      runScopedScan: scan,
    });

    expect(result.consumed).toBe(true);
    expect(scan).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('malformed or empty'));
  });
});
