// ───────────────────────────────────────────────────────────────
// MODULE: Memory Drift Processing-Marker Sweep
// ───────────────────────────────────────────────────────────────
// Kept in its own module (rather than inline in startup-checks.ts) so its
// compiled size doesn't push that file's line-count checks over budget.
// Recovers `.memory-drift-dirty-paths.json.processing-*` files orphaned by
// a boot that was killed externally before it finished consuming the
// canonical drift marker. See sweepStaleMemoryDriftProcessingMarkers below
// for the full recovery contract.
import path from 'path';
import fs from 'fs';

import {
  MEMORY_DRIFT_MARKER_FILENAME,
  type MemoryDriftMarkerEntry,
  type MemoryDriftMarkerPayload,
  memoryDriftMarkerEntryKey,
  parseMemoryDriftMarker,
  resolveMemoryDriftMarkerPath,
} from './memory-drift-healing.js';

export interface MemoryDriftProcessingSweepResult {
  /** Stale `.processing-*` files whose entries were successfully read and merged back. */
  recovered: number;
  /** Stale `.processing-*` files that were malformed/unreadable and could not be recovered. */
  unrecoverable: number;
  /** Total marker entries restored to the canonical marker path (post-dedup). */
  entries: number;
}

/**
 * Recovers `.memory-drift-dirty-paths.json.processing-*` files orphaned by a boot
 * that was killed externally (e.g. by an MCP client's init-timeout watchdog) after
 * `consumeMemoryDriftDirtyMarker` claimed the canonical marker via rename but before
 * it either consumed or restored it. Runs once at boot, immediately before the
 * normal `consumeMemoryDriftDirtyMarker` call, so any recovered entries reach the
 * existing consume-and-scan path on the same boot instead of being orphaned forever.
 *
 * Merge policy: every stale claim file found is merged (not just the most recent) --
 * each one represents marker entries a killed boot never finished processing, and
 * none of them are individually recoverable later, so dropping any would silently
 * lose that entry's chance at Layer 2 auto-healing. A stale file that already exists
 * at the canonical marker path (e.g. written fresh by the git hook after the sweep
 * started) is merged into rather than clobbered.
 *
 * Never blocks startup: a missing memory DB directory, or a malformed/unreadable
 * stale file, is treated as a no-op / logged-and-skipped, matching the canonical
 * marker's own "never block startup" precedent in `consumeMemoryDriftDirtyMarker`.
 */
export function sweepStaleMemoryDriftProcessingMarkers(
  options: { databasePath: string },
): MemoryDriftProcessingSweepResult {
  const result: MemoryDriftProcessingSweepResult = { recovered: 0, unrecoverable: 0, entries: 0 };
  const markerPath = resolveMemoryDriftMarkerPath(options.databasePath);
  const dir = path.dirname(markerPath);
  const prefix = `${path.basename(markerPath)}.processing-`;

  let dirEntries: string[];
  try {
    dirEntries = fs.readdirSync(dir);
  } catch {
    // Memory DB directory doesn't exist yet (fresh install) -- nothing to sweep.
    return result;
  }

  const staleFiles = dirEntries
    .filter((name) => name.startsWith(prefix))
    .sort()
    .map((name) => path.join(dir, name));

  if (staleFiles.length === 0) {
    return result;
  }

  const mergedByKey = new Map<string, MemoryDriftMarkerEntry>();
  let mostRecentUpdatedAt: string | undefined;

  for (const staleFile of staleFiles) {
    let raw: string;
    try {
      raw = fs.readFileSync(staleFile, 'utf8');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[context-server] stale ${path.basename(staleFile)} unreadable, treating as unrecoverable: ${message}`);
      result.unrecoverable += 1;
      continue;
    }

    const parsed = parseMemoryDriftMarker(raw);
    if (!parsed || parsed.entries.length === 0) {
      console.warn(`[context-server] stale ${path.basename(staleFile)} malformed or empty, treating as unrecoverable`);
      result.unrecoverable += 1;
      try { fs.unlinkSync(staleFile); } catch (_unlinkError: unknown) { /* cleanup best-effort */ }
      continue;
    }

    for (const entry of parsed.entries) {
      mergedByKey.set(memoryDriftMarkerEntryKey(entry), entry);
    }
    if (parsed.updatedAt && (!mostRecentUpdatedAt || parsed.updatedAt > mostRecentUpdatedAt)) {
      mostRecentUpdatedAt = parsed.updatedAt;
    }
    result.recovered += 1;
    try { fs.unlinkSync(staleFile); } catch (_unlinkError: unknown) { /* the canonical write below is authoritative */ }
  }

  if (mergedByKey.size === 0) {
    return result;
  }

  try {
    if (fs.existsSync(markerPath)) {
      const existingRaw = fs.readFileSync(markerPath, 'utf8');
      const existingParsed = parseMemoryDriftMarker(existingRaw);
      if (existingParsed) {
        for (const entry of existingParsed.entries) {
          mergedByKey.set(memoryDriftMarkerEntryKey(entry), entry);
        }
      }
    }

    const payload: MemoryDriftMarkerPayload = {
      version: 1,
      updatedAt: mostRecentUpdatedAt ?? new Date().toISOString(),
      entries: Array.from(mergedByKey.values()),
    };
    fs.writeFileSync(markerPath, JSON.stringify(payload));
    result.entries = payload.entries.length;
    console.error(`[context-server] Recovered ${result.recovered} stale ${MEMORY_DRIFT_MARKER_FILENAME}.processing-* file(s) from a killed prior boot: ${result.entries} entr${result.entries === 1 ? 'y' : 'ies'} restored for consumption`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[context-server] Could not restore recovered drift-marker entries; leaving stale files unconsumed: ${message}`);
  }

  return result;
}
