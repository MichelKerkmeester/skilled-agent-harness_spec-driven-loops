// ───────────────────────────────────────────────────────────────
// TEST: Startup drift-marker repair outcomes
// ───────────────────────────────────────────────────────────────
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { resolveMemoryDriftMarkerPath } from '../lib/storage/memory-drift-healing.js';
import {
  consumeMemoryDriftDirtyMarker,
  resolveMemoryIndexRepairResult,
  type MemoryIndexRepairStatus,
} from '../startup-checks.js';

const tempRoots: string[] = [];

function createMarker(): { root: string; databasePath: string; markerPath: string } {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'memory-index-startup-repair-'));
  tempRoots.push(root);
  const databasePath = path.join(root, 'database', 'context-index.sqlite');
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  const markerPath = resolveMemoryDriftMarkerPath(databasePath);
  fs.writeFileSync(markerPath, JSON.stringify({
    version: 1,
    entries: [{ kind: 'delete', oldPath: '.opencode/specs/demo/001-old/spec.md' }],
  }));
  return { root, databasePath, markerPath };
}

function scanEnvelope(repairStatus: MemoryIndexRepairStatus, reason: string | null = null): unknown {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        data: {
          status: repairStatus === 'complete' ? 'complete' : 'coalesced',
          repairStatus,
          ...(reason ? { reason } : {}),
        },
      }),
    }],
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of tempRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('startup memory-index repair result', () => {
  it.each([
    ['coalesced', 'cooldown'],
    ['contended', 'contention'],
    ['partial', null],
    ['failed', null],
  ] as const)('preserves the marker when scoped repair returns %s', async (status, reason) => {
    const { root, databasePath, markerPath } = createMarker();
    const refreshMovedSpecFolder = vi.fn();
    const result = await consumeMemoryDriftDirtyMarker({
      databasePath,
      workspacePath: root,
      runScopedScan: async () => ({ status, scanStatus: 'coalesced', reason }),
      refreshMovedSpecFolder,
    });

    expect(result).toMatchObject({ consumed: false, repairStatus: status });
    expect(fs.existsSync(markerPath)).toBe(true);
    expect(refreshMovedSpecFolder).not.toHaveBeenCalled();
  });

  it('consumes the marker only after scoped repair completes', async () => {
    const { root, databasePath, markerPath } = createMarker();
    const result = await consumeMemoryDriftDirtyMarker({
      databasePath,
      workspacePath: root,
      runScopedScan: async () => ({ status: 'complete', scanStatus: 'complete', reason: null }),
    });

    expect(result).toMatchObject({ consumed: true, repairStatus: 'complete' });
    expect(fs.existsSync(markerPath)).toBe(false);
  });

  it('derives typed coalesced and contended outcomes from scan envelopes', () => {
    expect(resolveMemoryIndexRepairResult(scanEnvelope('coalesced', 'cooldown'))).toEqual({
      status: 'coalesced',
      scanStatus: 'coalesced',
      reason: 'cooldown',
    });
    expect(resolveMemoryIndexRepairResult(scanEnvelope('contended', 'contention'))).toEqual({
      status: 'contended',
      scanStatus: 'coalesced',
      reason: 'contention',
    });
  });
});
