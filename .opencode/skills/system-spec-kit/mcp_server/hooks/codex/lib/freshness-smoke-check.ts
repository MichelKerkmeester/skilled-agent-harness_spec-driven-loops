// ───────────────────────────────────────────────────────────────
// MODULE: Codex Freshness Smoke Check
// ───────────────────────────────────────────────────────────────

import { performance } from 'node:perf_hooks';
import {
  getStartupBriefFromMarker,
  type StartupBriefResult,
} from '../../../lib/code-graph-boundary.js';

/** Result of the Codex cold-start context freshness smoke check. */
export interface CodexFreshnessSmokeCheckResult {
  readonly fresh: boolean;
  readonly lastUpdateAt: string | null;
  readonly latencyMs: number;
}

/** Injectable dependencies for deterministic Codex freshness tests. */
export interface CodexFreshnessSmokeCheckDependencies {
  readonly buildStartup?: () => StartupBriefResult;
  readonly now?: () => number;
}

function isFreshStartupContext(result: StartupBriefResult): boolean {
  return result.startupSurface.trim().length > 0 && result.graphState === 'ready';
}

function lastUpdatedFromStartupPayload(result: StartupBriefResult): string | null {
  const payload = result.sharedPayload;
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    return result.graphSummary?.lastScan ?? null;
  }
  const provenance = (payload as Record<string, unknown>).provenance;
  if (typeof provenance !== 'object' || provenance === null || Array.isArray(provenance)) {
    return result.graphSummary?.lastScan ?? null;
  }
  const lastUpdated = (provenance as Record<string, unknown>).lastUpdated;
  return typeof lastUpdated === 'string' ? lastUpdated : result.graphSummary?.lastScan ?? null;
}

/** Check whether Codex startup context is populated from a ready code graph. */
export function smokeCheckCodexColdStartContext(
  dependencies: CodexFreshnessSmokeCheckDependencies = {},
): CodexFreshnessSmokeCheckResult {
  const now = dependencies.now ?? performance.now.bind(performance);
  const startedAt = now();
  try {
    const result = (dependencies.buildStartup ?? getStartupBriefFromMarker)();
    return {
      fresh: isFreshStartupContext(result),
      lastUpdateAt: lastUpdatedFromStartupPayload(result),
      latencyMs: Number((now() - startedAt).toFixed(3)),
    };
  } catch {
    // Fail closed: smoke checks report stale rather than blocking hook startup.
    return {
      fresh: false,
      lastUpdateAt: null,
      latencyMs: Number((now() - startedAt).toFixed(3)),
    };
  }
}
