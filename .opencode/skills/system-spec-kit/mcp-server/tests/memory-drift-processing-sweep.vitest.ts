// TEST: MEMORY DRIFT PROCESSING SWEEP
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { sweepStaleMemoryDriftProcessingMarkers } from '../lib/storage/memory-drift-processing-sweep.js';
import { resolveMemoryDriftMarkerPath } from '../lib/storage/memory-drift-healing.js';

const tempRoots: string[] = [];

function tempDbPath(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'drift-processing-sweep-'));
  tempRoots.push(root);
  const dbPath = path.join(root, 'database', 'context-index.sqlite');
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  return dbPath;
}

function exitedChildPid(): number {
  const child = spawnSync(process.execPath, ['-e', 'process.exit(0)']);
  if (!child.pid) throw new Error('Could not obtain an exited child PID');
  return child.pid;
}

function markerPayload(oldPath: string): string {
  return JSON.stringify({
    version: 1,
    entries: [{ kind: 'delete', oldPath }],
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of tempRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('memory drift processing sweep atomicity', () => {
  it('keeps processing sources intact when the canonical marker write fails', () => {
    const dbPath = tempDbPath();
    const markerPath = resolveMemoryDriftMarkerPath(dbPath);
    const processingPath = `${markerPath}.processing-${exitedChildPid()}-${Date.now()}`;
    fs.writeFileSync(markerPath, markerPayload('.opencode/specs/demo/existing/spec.md'));
    fs.writeFileSync(processingPath, markerPayload('.opencode/specs/demo/recovered/spec.md'));

    const writeFileSync = fs.writeFileSync.bind(fs);
    vi.spyOn(fs, 'writeFileSync').mockImplementation((...args: Parameters<typeof fs.writeFileSync>) => {
      const target = String(args[0]);
      if (target === markerPath || target.startsWith(`${markerPath}.tmp-`)) {
        throw new Error('forced canonical write failure');
      }
      return writeFileSync(...args);
    });
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = sweepStaleMemoryDriftProcessingMarkers({ databasePath: dbPath });

    expect(result).toEqual({ recovered: 0, unrecoverable: 0, entries: 0 });
    expect(fs.existsSync(processingPath)).toBe(true);
    expect(JSON.parse(fs.readFileSync(markerPath, 'utf8'))).toEqual(
      JSON.parse(markerPayload('.opencode/specs/demo/existing/spec.md')),
    );
  });

  it('skips a processing marker while its recorded owner PID is alive', () => {
    const dbPath = tempDbPath();
    const markerPath = resolveMemoryDriftMarkerPath(dbPath);
    const processingPath = `${markerPath}.processing-${process.pid}-${Date.now()}`;
    fs.writeFileSync(processingPath, markerPayload('.opencode/specs/demo/live/spec.md'));

    const result = sweepStaleMemoryDriftProcessingMarkers({ databasePath: dbPath });

    expect(result).toEqual({ recovered: 0, unrecoverable: 0, entries: 0 });
    expect(fs.existsSync(processingPath)).toBe(true);
    expect(fs.existsSync(markerPath)).toBe(false);
  });
});
