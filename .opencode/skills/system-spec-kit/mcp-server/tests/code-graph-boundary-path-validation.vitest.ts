import { beforeEach, describe, expect, it, vi } from 'vitest';
import path from 'node:path';

const fsMocks = vi.hoisted(() => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
}));

vi.mock('node:fs', () => ({
  existsSync: fsMocks.existsSync,
  readFileSync: fsMocks.readFileSync,
}));

import {
  getCodeGraphReadinessMarkerPath,
  readCodeGraphReadinessMarkerFromPath,
  validateMarkerPath,
} from '../lib/code-graph-boundary.js';

const markerBaseDir = path.dirname(getCodeGraphReadinessMarkerPath());

describe('code-graph-boundary marker path validation', () => {
  beforeEach(() => {
    fsMocks.existsSync.mockReset();
    fsMocks.readFileSync.mockReset();
    vi.restoreAllMocks();
  });

  it('rejects relative traversal payloads', () => {
    expect(() => validateMarkerPath('../../../etc/passwd', markerBaseDir)).toThrow(
      'Marker path traversal rejected',
    );
  });

  it('rejects absolute paths outside the marker base', () => {
    expect(() => validateMarkerPath('/etc/passwd', markerBaseDir)).toThrow(
      'Marker path traversal rejected',
    );
  });

  it('allows normal paths inside the marker base', () => {
    expect(() => validateMarkerPath(path.join(markerBaseDir, '.code-graph-readiness.json'), markerBaseDir)).not.toThrow();
  });

  it('gates marker reads before fs.readFileSync when a resolved path escapes the base', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const traversalPath = path.resolve(markerBaseDir, '../../../etc/passwd');

    expect(readCodeGraphReadinessMarkerFromPath(traversalPath)).toBeNull();

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Marker path traversal rejected'));
    expect(fsMocks.existsSync).not.toHaveBeenCalled();
    expect(fsMocks.readFileSync).not.toHaveBeenCalled();
  });

  it('reads and parses a valid marker path inside the base', () => {
    fsMocks.existsSync.mockReturnValue(true);
    fsMocks.readFileSync.mockReturnValue(JSON.stringify({
      schemaVersion: 1,
      generatedAt: '2026-05-15T00:00:00.000Z',
      producer: 'mk-code-index',
      workspaceRoot: process.cwd(),
      graphFreshness: 'fresh',
      graphState: 'ready',
      readiness: {
        freshness: 'fresh',
        action: 'none',
        inlineIndexPerformed: false,
        reason: 'test',
      },
      stats: null,
      startup: null,
    }));

    expect(readCodeGraphReadinessMarkerFromPath(getCodeGraphReadinessMarkerPath())).toMatchObject({
      schemaVersion: 1,
      producer: 'mk-code-index',
    });
    expect(fsMocks.readFileSync).toHaveBeenCalledWith(getCodeGraphReadinessMarkerPath(), 'utf8');
  });
});
