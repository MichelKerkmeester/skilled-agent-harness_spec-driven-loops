// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Auto-Rescan Policy
// ───────────────────────────────────────────────────────────────
// Shared policy module that decides whether the read-path
// handlers (query, context) may safely auto-trigger a guarded
// inline full scan when ensure-ready returns
// `action: "full_scan"`.
//
// A scope-fingerprint guard in scan.ts prevents unsafe scope-mismatched scans
// from wiping the
// populated index. With that guard in place, it is now SAFE to
// allow read-path handlers to auto-rescan when stored scope
// matches the active runtime scope AND the parse-diagnostics
// backlog is clean.
//
// Caller contract:
//   - If `shouldAutoRescan(...)` returns true, the caller is
//     authorized to run an inline full scan.
//   - If it returns false, the caller MUST NOT run a full scan
//     and MUST surface the diagnostics payload so
//     operators can choose remediation.
//
// Note: ensure-ready.ts maintains its own internal copy of this
// gate via `evaluateGuardedFullScan()` so the diagnostics on
// `ReadyResult.autoRescanSafety` / `autoRescanBlockReason`
// remain populated even when callers don't pass through this
// helper directly. Both must stay in sync — this module is the
// canonical reference.

import { scopeFingerprintsMatchOrLegacy } from './index-scope-policy.js';

// ───────────────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────────────

export interface AutoRescanScope {
  readonly fingerprint?: string | null;
}

export interface AutoRescanPolicyArgs {
  /**
   * The scope persisted on the existing graph. Sourced via
   * `getStoredCodeGraphScope()` from `code-graph-db.ts`.
   */
  readonly storedScope: AutoRescanScope | null | undefined;
  /**
   * The active runtime scope. Sourced via
   * `resolveIndexScopePolicy()` from `index-scope-policy.ts`.
   */
  readonly activeScope: AutoRescanScope | null | undefined;
  /**
   * Number of files currently in the parse_diagnostics backlog.
   * When the backlog exceeds the threshold, an auto-rescan
   * would likely re-trip the same parse errors, so we block.
   */
  readonly parseDiagnosticsBacklog: number;
  /**
   * Optional override. Defaults to `0` so any backlog blocks the
   * auto-rescan; production callers may relax to e.g. `10` if
   * they tolerate a small parse-error population.
   */
  readonly parseDiagnosticsBacklogThreshold?: number;
}

export type AutoRescanBlockReason =
  | 'scope_mismatch'
  | 'parse_error_backlog';

export interface AutoRescanPolicyDecision {
  readonly allowed: boolean;
  /** When `allowed === false`, names the reason. */
  readonly blockReason?: AutoRescanBlockReason;
}

// ───────────────────────────────────────────────────────────────
// Constants
// ───────────────────────────────────────────────────────────────

/**
 * Default backlog threshold. Any non-zero parse-diagnostic
 * backlog blocks the auto-rescan unless the caller relaxes the
 * threshold explicitly. This conservative default mirrors the
 * existing guard in `ensure-ready.ts`.
 */
export const DEFAULT_PARSE_DIAGNOSTICS_BACKLOG_THRESHOLD = 0;

// ───────────────────────────────────────────────────────────────
// Public API
// ───────────────────────────────────────────────────────────────

/**
 * Decide whether a read-path handler may safely auto-trigger an
 * inline full scan when ensure-ready reports
 * `action: "full_scan"`.
 *
 * Auto-rescan is only allowed when BOTH conditions hold:
 *   1. `storedScope.fingerprint === activeScope.fingerprint`
 *      (no scope-mismatch risk; rescan would write the same
 *      scope's worth of nodes back).
 *   2. `parseDiagnosticsBacklog <= threshold` (a clean parse
 *      backlog means the rescan is unlikely to re-trip the same
 *      parse errors).
 *
 * Otherwise the caller must block with diagnostics.
 */
export function shouldAutoRescan(
  args: AutoRescanPolicyArgs,
): AutoRescanPolicyDecision {
  const threshold = args.parseDiagnosticsBacklogThreshold
    ?? DEFAULT_PARSE_DIAGNOSTICS_BACKLOG_THRESHOLD;

  const scopesMatch = scopeFingerprintsMatchOrLegacy(
    args.storedScope?.fingerprint,
    args.activeScope?.fingerprint,
  );
  if (!scopesMatch) {
    return { allowed: false, blockReason: 'scope_mismatch' };
  }

  const backlog = Number.isFinite(args.parseDiagnosticsBacklog)
    ? Math.max(0, args.parseDiagnosticsBacklog)
    : 0;
  if (backlog > threshold) {
    return { allowed: false, blockReason: 'parse_error_backlog' };
  }

  return { allowed: true };
}
