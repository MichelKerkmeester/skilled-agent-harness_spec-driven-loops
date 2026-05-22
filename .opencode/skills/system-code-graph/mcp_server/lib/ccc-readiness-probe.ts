// ───────────────────────────────────────────────────────────────
// MODULE: CocoIndex Readiness Probe (Shared)
// ───────────────────────────────────────────────────────────────
// Shared probe that checks the real CocoIndex binary, index, and
// freshness state. Used by ccc-status, ccc-reindex, and ccc-feedback
// handlers to replace the hardcoded 'readiness_not_applicable' stub.
//
// The probe maps onto the same readiness-contract vocabulary used
// by the code-graph readiness surface (Freshness → canonicalReadiness,
// Freshness → trustState) so consumers get a single, consistent axis.
//
// ## Readiness semantics
//
// trustState mapping:
//   'live'        — ccc binary exists, runs, AND a CocoIndex index
//                    directory (.cocoindex_code/) exists at workspace
//                    root and is within the staleness threshold.
//   'stale'       — binary + index both exist, but the index directory
//                    mtime exceeds the staleness threshold (24h),
//                    indicating the index may be out of date relative
//                    to recent source modifications.
//   'absent'      — binary exists and runs successfully, but no index
//                    has been built yet (.cocoindex_code/ missing).
//   'unavailable' — binary is missing from the expected path, OR the
//                    binary exists but fails to invoke (eg missing
//                    Python deps, corrupted venv).
//
// reason field per trustState:
//   live         → empty string (omitted)
//   stale        → 'cocoindex_index_older_than_source'
//   absent       → 'cocoindex_index_not_built'
//   unavailable  → 'cocoindex_binary_missing' or 'cocoindex_invoke_failed'
//
// ## Cache behavior
//
// To avoid excessive filesystem calls on repeated status checks,
// results are cached in module scope with a 60-second TTL. The
// cache is keyless — a single global cache because the probe is
// deterministic for a given workspace root (process.cwd()).
// ───────────────────────────────────────────────────────────────

import { existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

import { canonicalReadinessFromFreshness, queryTrustStateFromFreshness } from './readiness-contract.js';
import { getCocoIndexBinaryPath } from './shared/cocoindex-path.js';
import type { StructuralReadiness } from './ops-hardening.js';
import type { SharedPayloadTrustState } from './shared/shared-payload.js';
import type { ReadyAction } from './ensure-ready.js';

// ───────────────────────────────────────────────────────────────
// Constants
// ───────────────────────────────────────────────────────────────

/** Index staleness threshold: 24 hours. */
const STALE_THRESHOLD_MS = 24 * 60 * 60 * 1000;

/** Probe result TTL: 60 seconds. */
const CACHE_TTL_MS = 60_000;

// ───────────────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────────────

/** Freshness axis mapped from CocoIndex surface state. */
type CocoIndexFreshness = 'fresh' | 'stale' | 'empty' | 'error';

/** Readiness block returned by the probe, compatible with handler payloads. */
export interface CocoIndexReadinessBlock {
  freshness: CocoIndexFreshness;
  action: ReadyAction;
  inlineIndexPerformed: boolean;
  reason: string;
  canonicalReadiness: StructuralReadiness;
  trustState: SharedPayloadTrustState;
}

// ───────────────────────────────────────────────────────────────
// Module-scope cache
// ───────────────────────────────────────────────────────────────

let cachedResult: CocoIndexReadinessBlock | null = null;
let cachedAt: number = 0;

// ───────────────────────────────────────────────────────────────
// Internal: uncached probe
// ───────────────────────────────────────────────────────────────

/**
 * Build a readiness block for a given freshness, reason, and trustState.
 * Uses the shared readiness-contract helpers for canonicalReadiness
 * and trustState derivation.
 */
function buildReadiness(
  freshness: CocoIndexFreshness,
  reason: string,
): CocoIndexReadinessBlock {
  return {
    freshness,
    action: 'none',
    inlineIndexPerformed: false,
    reason,
    canonicalReadiness: canonicalReadinessFromFreshness(freshness),
    trustState: queryTrustStateFromFreshness(freshness),
  };
}

/**
 * Determine if the CocoIndex index is stale.
 *
 * Staleness is detected when the index directory's newest modification
 * time is older than the staleness threshold (24h by default). This
 * approximates "index is older than the most recent source-file
 * modification" without requiring an expensive full-workspace stat walk.
 *
 * The 24h threshold is the same guard used by the ensure_ready.sh
 * readiness probe and provides a pragmatic signal for long-running
 * CI/IDE sessions where the index may drift from current source without
 * every status call triggering an expensive source-scan comparison.
 */
function isIndexStale(indexDir: string): boolean {
  try {
    const st = statSync(indexDir);
    const ageMs = Date.now() - st.mtimeMs;
    return ageMs >= STALE_THRESHOLD_MS;
  } catch {
    return false;
  }
}

/**
 * Probe the real CocoIndex state at `workspaceRoot`.
 *
 * Checks (in order):
 * 1. Binary existence at the expected venv path.
 * 2. Binary invocation (ccc --version) to verify it is functional.
 * 3. Index directory existence (.cocoindex_code/).
 * 4. Index staleness (index mtime vs workspace source mtime).
 *
 * All operations are synchronous — async signature is for forward
 * compatibility with potential async daemon queries.
 */
async function probeCocoIndexReadinessUncached(
  workspaceRoot: string,
): Promise<CocoIndexReadinessBlock> {
  let cccBin: string;
  try {
    cccBin = getCocoIndexBinaryPath(workspaceRoot);
  } catch {
    return buildReadiness('error', 'cocoindex_binary_untrusted');
  }
  const indexDir = resolve(workspaceRoot, '.cocoindex_code');

  // 1. Binary missing
  if (!existsSync(cccBin)) {
    return buildReadiness('error', 'cocoindex_binary_missing');
  }

  // 2. Binary invocation check
  try {
    execFileSync(cccBin, ['--version'], {
      cwd: workspaceRoot,
      timeout: 10_000,
      encoding: 'utf-8',
      stdio: 'pipe',
    });
  } catch {
    return buildReadiness('error', 'cocoindex_invoke_failed');
  }

  // 3. Index not built
  if (!existsSync(indexDir)) {
    return buildReadiness('empty', 'cocoindex_index_not_built');
  }

  // 4. Staleness check
  if (isIndexStale(indexDir)) {
    return buildReadiness('stale', 'cocoindex_index_older_than_source');
  }

  // 5. Live
  return buildReadiness('fresh', '');
}

// ───────────────────────────────────────────────────────────────
// Public API
// ───────────────────────────────────────────────────────────────

/**
 * Probe the real CocoIndex readiness state at `workspaceRoot`.
 *
 * Results are cached for 60 seconds (module scope, process lifetime)
 * to avoid excessive filesystem I/O on repeated status/health calls.
 * The cache is invalidated when the TTL expires; there is no explicit
 * invalidation API because CocoIndex state changes infrequently within
 * a single process lifetime.
 *
 * @param workspaceRoot - Absolute path to the workspace root.
 * @returns A readiness block with freshness, canonicalReadiness, and
 *          trustState mapped from the real CocoIndex surface.
 */
export async function probeCocoIndexReadiness(
  workspaceRoot: string,
): Promise<CocoIndexReadinessBlock> {
  const now = Date.now();
  if (cachedResult !== null && (now - cachedAt) < CACHE_TTL_MS) {
    return cachedResult;
  }

  const result = await probeCocoIndexReadinessUncached(workspaceRoot);
  cachedResult = result;
  cachedAt = now;
  return result;
}
