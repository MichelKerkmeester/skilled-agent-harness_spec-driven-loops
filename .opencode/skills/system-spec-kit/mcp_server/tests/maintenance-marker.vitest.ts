import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

import {
  beginMaintenance,
  __resetMaintenanceMarkerForTest,
} from '../lib/storage/maintenance-marker';
import { resolveDatabasePaths } from '../core/config';

const MARKER_FILE = '.maintenance-active.json';

interface MarkerShape {
  childPid: number;
  activeUntilMs: number;
  labels: string[];
  refreshedAtIso: string;
}

let tmpDir: string;
const originalSpecKitDbDir = process.env.SPEC_KIT_DB_DIR;
const originalSpeckitDbDir = process.env.SPECKIT_DB_DIR;

function markerPath(): string {
  return path.join(tmpDir, MARKER_FILE);
}

function markerExists(): boolean {
  return fs.existsSync(markerPath());
}

function readMarker(): MarkerShape {
  return JSON.parse(fs.readFileSync(markerPath(), 'utf8')) as MarkerShape;
}

beforeEach(() => {
  // Point DATABASE_DIR at a throwaway directory so the marker module's real-fs
  // writes never touch a live database. The marker reads DATABASE_DIR as a live
  // ESM binding, so reassigning it via resolveDatabasePaths() redirects writes.
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'maintmarker.'));
  process.env.SPEC_KIT_DB_DIR = tmpDir;
  delete process.env.SPECKIT_DB_DIR;
  resolveDatabasePaths();
});

afterEach(() => {
  __resetMaintenanceMarkerForTest();
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {
    // Best-effort cleanup
  }
  if (originalSpecKitDbDir === undefined) {
    delete process.env.SPEC_KIT_DB_DIR;
  } else {
    process.env.SPEC_KIT_DB_DIR = originalSpecKitDbDir;
  }
  if (originalSpeckitDbDir === undefined) {
    delete process.env.SPECKIT_DB_DIR;
  } else {
    process.env.SPECKIT_DB_DIR = originalSpeckitDbDir;
  }
  // Re-resolve so a subsequent suite/test sees a consistent DATABASE_DIR.
  resolveDatabasePaths();
});

describe('maintenance-marker', () => {
  it('beginMaintenance writes a marker with this pid, a future TTL, and the label', () => {
    const before = Date.now();
    const handle = beginMaintenance('scan');

    expect(markerExists()).toBe(true);
    const marker = readMarker();
    expect(marker.childPid).toBe(process.pid);
    expect(marker.activeUntilMs).toBeGreaterThan(before);
    expect(marker.labels).toContain('scan');

    handle.end();
  });

  it('is reference-counted: marker persists until the LAST holder ends', () => {
    const first = beginMaintenance('scan');
    const second = beginMaintenance('embedding-queue');

    expect(markerExists()).toBe(true);
    let marker = readMarker();
    expect(marker.labels).toContain('scan');
    expect(marker.labels).toContain('embedding-queue');

    // Ending the FIRST holder: marker must STILL exist (second is active).
    // The on-disk file is only rewritten on a write event (begin/refresh/timer),
    // so end() does NOT itself re-serialize the pruned label set — it just
    // decrements the in-memory ref count. The reference-counting contract under
    // test is file PERSISTENCE while >=1 holder remains.
    first.end();
    expect(markerExists()).toBe(true);

    // The next write (refresh on the surviving holder) reflects the pruned label
    // set, confirming the first holder's label was decremented from live state.
    second.refresh();
    marker = readMarker();
    expect(marker.labels).toContain('embedding-queue');
    expect(marker.labels).not.toContain('scan');

    // Ending the SECOND (last) holder: marker is REMOVED.
    second.end();
    expect(markerExists()).toBe(false);
  });

  it('end() is idempotent: calling twice on the sole holder removes the file once and does not throw', () => {
    const handle = beginMaintenance('scan');
    expect(markerExists()).toBe(true);

    expect(() => {
      handle.end();
      handle.end();
    }).not.toThrow();

    expect(markerExists()).toBe(false);
  });

  it('refresh() rewrites the marker with a non-decreasing activeUntilMs and a refreshed timestamp', () => {
    const handle = beginMaintenance('scan');
    const first = readMarker();

    handle.refresh();
    const second = readMarker();

    // TTL is recomputed from Date.now(); never goes backwards on refresh.
    expect(second.activeUntilMs).toBeGreaterThanOrEqual(first.activeUntilMs);
    // refreshedAtIso must be a valid ISO timestamp and not predate the first write.
    expect(Date.parse(second.refreshedAtIso)).toBeGreaterThanOrEqual(
      Date.parse(first.refreshedAtIso),
    );
    expect(Number.isNaN(Date.parse(second.refreshedAtIso))).toBe(false);

    handle.end();
  });

  it('removes the marker once all handles have ended', () => {
    const a = beginMaintenance('scan');
    const b = beginMaintenance('embedding-queue');
    const c = beginMaintenance('checkpoint');
    expect(markerExists()).toBe(true);

    a.end();
    b.end();
    expect(markerExists()).toBe(true);

    c.end();
    expect(markerExists()).toBe(false);
  });

  it('__resetMaintenanceMarkerForTest removes the on-disk marker, not just in-memory state', () => {
    // Leave a holder active so the marker is on disk and the ref count is non-zero.
    beginMaintenance('scan');
    expect(markerExists()).toBe(true);

    __resetMaintenanceMarkerForTest();

    // The reset must clear the on-disk marker so a later test reusing the same
    // DATABASE_DIR cannot observe a stale marker.
    expect(markerExists()).toBe(false);

    // A fresh begin after reset starts from a clean slate (no leaked labels).
    const handle = beginMaintenance('embedding-queue');
    const marker = readMarker();
    expect(marker.labels).toEqual(['embedding-queue']);
    handle.end();
  });

  it('two holders sharing a label: ending one keeps the marker until the other ends', () => {
    const first = beginMaintenance('scan');
    const second = beginMaintenance('scan');
    expect(markerExists()).toBe(true);

    // Ending one of two same-label holders leaves the marker present (ref count 1).
    first.end();
    expect(markerExists()).toBe(true);

    // The surviving holder still sees the shared label on the next write.
    second.refresh();
    expect(readMarker().labels).toContain('scan');

    // Ending the last holder removes the marker.
    second.end();
    expect(markerExists()).toBe(false);
  });
});
