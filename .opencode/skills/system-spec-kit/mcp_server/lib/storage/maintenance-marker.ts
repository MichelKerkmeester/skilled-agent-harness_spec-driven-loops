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

import { rmSync } from 'node:fs';
import path from 'node:path';

import { DATABASE_DIR } from '../../core/config.js';
import { atomicWriteFile } from './transaction-manager.js';

const MAINTENANCE_MARKER_FILE = '.maintenance-active.json';
// The TTL must exceed the longest single synchronous phase that cannot fire the
// refresh timer. 180s is a margin over the longest observed blocking phase (~79s).
const MAINTENANCE_MARKER_TTL_MS = 180_000;
const MAINTENANCE_MARKER_REFRESH_MS = 20_000;

export interface MaintenanceMarkerHandle {
  // Refresh at a known progress point too: a non-yielding phase cannot fire the
  // interval timer, so it only gets the refresh its caller makes explicitly.
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
