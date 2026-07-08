import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

import {
  beginMaintenance,
  __resetMaintenanceMarkerForTest,
  MAINTENANCE_MARKER_REFRESH_BEFORE_MS,
  MAINTENANCE_MARKER_TTL_MS,
  MAINTENANCE_MARKER_TTL_MULTIPLIER,
  OWNER_LEASE_STALE_RECLAIM_MS,
  OWNER_LEASE_STALE_RECLAIM_MULTIPLIER,
  OWNER_LEASE_TTL_MS,
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
const LAUNCHER_PATH = path.resolve(import.meta.dirname, '../../../../bin/mk-spec-memory-launcher.cjs');

function markerPath(): string {
  return path.join(tmpDir, MARKER_FILE);
}

function markerExists(): boolean {
  return fs.existsSync(markerPath());
}

function readMarker(): MarkerShape {
  return JSON.parse(fs.readFileSync(markerPath(), 'utf8')) as MarkerShape;
}

function readLauncherOwnerLeaseTtlMs(): number {
  const source = fs.readFileSync(LAUNCHER_PATH, 'utf8');
  const match = source.match(/ttlMs:\s*(\d+)/);
  if (!match?.[1]) {
    throw new Error('launcher owner lease ttlMs literal not found');
  }
  return Number.parseInt(match[1], 10);
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
  it('derives marker TTL from the owner lease window with a reclaim-safe margin', () => {
    const launcherLeaseTtlMs = readLauncherOwnerLeaseTtlMs();

    expect(OWNER_LEASE_TTL_MS).toBe(launcherLeaseTtlMs);
    expect(MAINTENANCE_MARKER_TTL_MULTIPLIER).toBeGreaterThan(
      OWNER_LEASE_STALE_RECLAIM_MULTIPLIER,
    );
    expect(OWNER_LEASE_STALE_RECLAIM_MS).toBe(
      OWNER_LEASE_TTL_MS * OWNER_LEASE_STALE_RECLAIM_MULTIPLIER,
    );
    expect(MAINTENANCE_MARKER_TTL_MS).toBe(
      OWNER_LEASE_TTL_MS * MAINTENANCE_MARKER_TTL_MULTIPLIER,
    );
    expect(MAINTENANCE_MARKER_TTL_MS).toBe(180_000);
    expect(MAINTENANCE_MARKER_TTL_MS).toBeGreaterThan(OWNER_LEASE_STALE_RECLAIM_MS);
    expect(MAINTENANCE_MARKER_REFRESH_BEFORE_MS).toBe(MAINTENANCE_MARKER_TTL_MS / 2);
  });

  it('beginMaintenance writes a marker with this pid, a future TTL, and the label', () => {
    const before = Date.now();
    const handle = beginMaintenance('scan');
    const after = Date.now();

    expect(markerExists()).toBe(true);
    const marker = readMarker();
    expect(marker.childPid).toBe(process.pid);
    expect(marker.activeUntilMs).toBeGreaterThan(before);
    expect(marker.activeUntilMs).toBeGreaterThanOrEqual(before + MAINTENANCE_MARKER_TTL_MS);
    expect(marker.activeUntilMs).toBeLessThanOrEqual(after + MAINTENANCE_MARKER_TTL_MS);
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

  describe('boot-fts-integrity-rebuild call site (context-server.ts wrap)', () => {
    const BOOT_LABEL = 'boot-fts-integrity-rebuild';

    // Mirrors the exact shape added to context-server.ts's runBootFtsIntegrityCheck():
    // begin before the routine, .end() in a finally so every exit path (return or throw)
    // releases it.
    function runWrapped<T>(routine: () => T): T {
      const handle = beginMaintenance(BOOT_LABEL);
      try {
        return routine();
      } finally {
        handle.end();
      }
    }

    it('holds a fresh marker naming this pid for the duration of the wrapped routine', () => {
      let observedDuringRoutine: MarkerShape | null = null;
      runWrapped(() => {
        observedDuringRoutine = readMarker();
      });

      expect(observedDuringRoutine).not.toBeNull();
      expect(observedDuringRoutine!.childPid).toBe(process.pid);
      expect(observedDuringRoutine!.labels).toContain(BOOT_LABEL);
      expect(observedDuringRoutine!.activeUntilMs).toBeGreaterThan(Date.now());
      // Marker removed once the wrapped routine returns (the finally ran).
      expect(markerExists()).toBe(false);
    });

    it('releases the marker via finally even when the wrapped routine throws', () => {
      expect(() =>
        runWrapped(() => {
          expect(markerExists()).toBe(true);
          throw new Error('forced boot-rebuild failure');
        }),
      ).toThrow('forced boot-rebuild failure');

      // The finally must have run despite the throw: no dangling marker left for the 180s TTL to clear.
      expect(markerExists()).toBe(false);
    });

    it('overlaps correctly with a concurrent memory-index background-scan marker (reference-counted)', () => {
      const bootHandle = beginMaintenance(BOOT_LABEL);
      const scanHandle = beginMaintenance('index_scan');
      expect(markerExists()).toBe(true);
      let marker = readMarker();
      expect(marker.labels).toContain(BOOT_LABEL);
      expect(marker.labels).toContain('index_scan');

      // The boot rebuild finishing first must not clear the marker while the background
      // scan is still active.
      bootHandle.end();
      expect(markerExists()).toBe(true);

      scanHandle.refresh();
      marker = readMarker();
      expect(marker.labels).toContain('index_scan');
      expect(marker.labels).not.toContain(BOOT_LABEL);

      // Only the last holder ending removes the marker.
      scanHandle.end();
      expect(markerExists()).toBe(false);
    });
  });
});
