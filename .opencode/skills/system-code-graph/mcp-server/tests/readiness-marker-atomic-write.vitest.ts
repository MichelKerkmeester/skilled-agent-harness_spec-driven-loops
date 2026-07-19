import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const fsState = vi.hoisted(() => ({
  renameShouldFail: false,
}));

vi.mock('node:fs', async () => {
  const actual = await vi.importActual<typeof import('node:fs')>('node:fs');
  return {
    ...actual,
    writeFileSync: vi.fn((...args: Parameters<typeof actual.writeFileSync>) => actual.writeFileSync(...args)),
    renameSync: vi.fn((...args: Parameters<typeof actual.renameSync>) => {
      if (fsState.renameShouldFail) {
        throw new Error('synthetic rename failure');
      }
      return actual.renameSync(...args);
    }),
    unlinkSync: vi.fn((...args: Parameters<typeof actual.unlinkSync>) => actual.unlinkSync(...args)),
  };
});

vi.mock('../lib/code-graph-db.js', () => ({
  getStats: vi.fn(() => null),
  queryStartupHighlights: vi.fn(() => []),
}));

vi.mock('../lib/ensure-ready.js', () => ({
  getGraphReadinessSnapshot: vi.fn(() => ({
    freshness: 'fresh',
    action: 'none',
    inlineIndexPerformed: false,
    reason: 'test',
  })),
}));

import * as fs from 'node:fs';
import {
  CODE_GRAPH_READINESS_MARKER_BASE_DIR,
  validateMarkerPath,
  writeMarkerFileAtomic,
} from '../lib/readiness-marker.js';

let tempDir: string;

function tmpFiles(): string[] {
  return fs.readdirSync(tempDir).filter((file) => file.includes('.tmp.'));
}

describe('readiness-marker atomic write', () => {
  beforeEach(() => {
    fsState.renameShouldFail = false;
    tempDir = fs.mkdtempSync(join(tmpdir(), 'readiness-marker-'));
    vi.clearAllMocks();
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  it('writes the marker at the final path', () => {
    const markerPath = join(tempDir, '.code-graph-readiness.json');

    expect(writeMarkerFileAtomic(markerPath, '{"status":"ok"}\n', tempDir)).toBe(true);

    expect(fs.existsSync(markerPath)).toBe(true);
    expect(fs.readFileSync(markerPath, 'utf8')).toBe('{"status":"ok"}\n');
  });

  it('removes the temporary marker after a successful rename', () => {
    const markerPath = join(tempDir, '.code-graph-readiness.json');

    expect(writeMarkerFileAtomic(markerPath, '{"status":"ok"}\n', tempDir)).toBe(true);

    expect(tmpFiles()).toEqual([]);
    expect(fs.renameSync).toHaveBeenCalledWith(
      expect.stringContaining('.code-graph-readiness.json.tmp.'),
      markerPath,
    );
  });

  it('cleans up the temporary marker when rename fails', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const markerPath = join(tempDir, '.code-graph-readiness.json');
    fsState.renameShouldFail = true;

    expect(writeMarkerFileAtomic(markerPath, '{"status":"ok"}\n', tempDir)).toBe(false);

    expect(fs.existsSync(markerPath)).toBe(false);
    expect(tmpFiles()).toEqual([]);
    expect(fs.unlinkSync).toHaveBeenCalledWith(expect.stringContaining('.code-graph-readiness.json.tmp.'));
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('synthetic rename failure'));
  });

  it('blocks out-of-bounds marker writes before fs.writeFileSync runs', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const outOfBoundsPath = resolve(tempDir, '..', 'outside-readiness-marker.json');

    expect(writeMarkerFileAtomic(outOfBoundsPath, '{"status":"ok"}\n', tempDir)).toBe(false);

    expect(fs.writeFileSync).not.toHaveBeenCalled();
    expect(fs.existsSync(outOfBoundsPath)).toBe(false);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Marker path traversal rejected'));
  });

  it('rejects traversal payloads through the exported validator', () => {
    expect(() => validateMarkerPath('../../../etc/passwd', tempDir)).toThrow('Marker path traversal rejected');
    expect(() => validateMarkerPath('/etc/passwd', tempDir)).toThrow('Marker path traversal rejected');
    expect(() => validateMarkerPath(join(tempDir, '.code-graph-readiness.json'), tempDir)).not.toThrow();
  });

  it('anchors the marker base dir to the skill-local DB regardless of CWD', () => {
    // The base dir is computed at module load from this file's own path, not process.cwd(),
    // so the marker always lands beside the SQLite DB even when the server is loaded from a
    // subdirectory. Assert it is absolute and ends at the skill-local database path.
    expect(CODE_GRAPH_READINESS_MARKER_BASE_DIR.startsWith('/')).toBe(true);
    expect(CODE_GRAPH_READINESS_MARKER_BASE_DIR.endsWith(
      'system-code-graph/mcp-server/database',
    )).toBe(true);
  });
});
