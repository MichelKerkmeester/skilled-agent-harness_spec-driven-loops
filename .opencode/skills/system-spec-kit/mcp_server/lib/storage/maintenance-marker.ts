// ───────────────────────────────────────────────────────────────
// MODULE: Maintenance-Active Marker
// ───────────────────────────────────────────────────────────────
// Signals the launcher that this daemon is busy-by-design (a background index
// scan or a background-embedding burst) so a competing launcher adopts it
// instead of reaping it as wedged. The launcher reads <DATABASE_DIR>/.maintenance-active.json
// and refuses to reap a live daemon that holds a fresh marker (see the
// shouldAdoptDespiteProbe guard in the launcher supervision lib).
//
// Reference-counted: the scan and the embedding queue can overlap (the scan
// defers embeddings the queue then drains), so the marker stays present while
// ANY maintenance source is active and is removed only when the last one ends.
// A genuinely wedged daemon cannot refresh the marker, so it still lapses and
// becomes reapable again.
// The marker window must stay beyond stale lease reclaim. Long synchronous
// phases can starve unref timers, so callers refresh at phase boundaries before
// half the marker window elapses.

import { rmSync } from 'node:fs';
import path from 'node:path';

import { DATABASE_DIR } from '../../core/config.js';
import { atomicWriteFile } from './transaction-manager.js';

const MAINTENANCE_MARKER_FILE = '.maintenance-active.json';
export const OWNER_LEASE_TTL_MS = 60_000;
export const OWNER_LEASE_STALE_RECLAIM_MULTIPLIER = 2;
export const MAINTENANCE_MARKER_TTL_MULTIPLIER = 3;
export const OWNER_LEASE_STALE_RECLAIM_MS =
  OWNER_LEASE_TTL_MS * OWNER_LEASE_STALE_RECLAIM_MULTIPLIER;
export const MAINTENANCE_MARKER_TTL_MS =
  OWNER_LEASE_TTL_MS * MAINTENANCE_MARKER_TTL_MULTIPLIER;
export const MAINTENANCE_MARKER_REFRESH_BEFORE_MS = MAINTENANCE_MARKER_TTL_MS / 2;
const MAINTENANCE_MARKER_REFRESH_MS = 20_000;

export interface MaintenanceMarkerHandle {
  // Refresh at a phase boundary too: a non-yielding phase cannot fire the
  // interval timer, so it must refresh before half the marker window elapses.
  refresh(): void;
  // Idempotent. Decrements the active count and removes the marker at zero.
  end(): void;
}

let activeCount = 0;
let refreshTimer: ReturnType<typeof setInterval> | null = null;
let activeLabels: string[] = [];

function markerPath(): string {
  return path.join(DATABASE_DIR, MAINTENANCE_MARKER_FILE);
}

function writeMarker(): void {
  atomicWriteFile(markerPath(), `${JSON.stringify({
    childPid: process.pid,
    activeUntilMs: Date.now() + MAINTENANCE_MARKER_TTL_MS,
    labels: activeLabels,
    refreshedAtIso: new Date().toISOString(),
  }, null, 2)}\n`);
}

/**
 * Begin signalling busy-by-design maintenance. Call when a busy burst starts and
 * `end()` it in a finally so the marker is cleared on every exit. Safe to nest or
 * overlap with other maintenance sources.
 */
export function beginMaintenance(label: string): MaintenanceMarkerHandle {
  activeCount += 1;
  activeLabels.push(label);
  writeMarker();
  if (!refreshTimer) {
    refreshTimer = setInterval(writeMarker, MAINTENANCE_MARKER_REFRESH_MS);
    refreshTimer.unref?.();
  }

  let ended = false;
  return {
    refresh(): void {
      if (!ended && activeCount > 0) writeMarker();
    },
    end(): void {
      if (ended) return;
      ended = true;
      activeCount = Math.max(0, activeCount - 1);
      const idx = activeLabels.indexOf(label);
      if (idx >= 0) activeLabels.splice(idx, 1);
      // A non-final end() prunes the in-memory label only; the on-disk labels[]
      // is not re-serialized here and stays best-effort diagnostic until the next
      // write (begin/refresh/timer). The launcher reads only childPid +
      // activeUntilMs, so a momentarily stale label set is harmless.
      if (activeCount === 0) {
        if (refreshTimer) { clearInterval(refreshTimer); refreshTimer = null; }
        try { rmSync(markerPath(), { force: true }); } catch { /* best-effort cleanup */ }
      }
    },
  };
}

// Test-only: reset module state between cases. Removes the on-disk marker too,
// so a later test reusing the same DATABASE_DIR cannot observe a stale marker.
export function __resetMaintenanceMarkerForTest(): void {
  if (refreshTimer) { clearInterval(refreshTimer); refreshTimer = null; }
  try { rmSync(markerPath(), { force: true }); } catch { /* best-effort cleanup */ }
  activeCount = 0;
  activeLabels = [];
}
