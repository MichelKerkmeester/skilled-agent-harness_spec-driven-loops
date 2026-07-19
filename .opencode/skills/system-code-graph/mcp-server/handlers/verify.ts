// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Verify Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for code_graph_verify — executes the persisted
// gold-query battery against the current code graph.

import { realpathSync } from 'node:fs';
import { isAbsolute, relative, resolve, sep } from 'node:path';

import * as graphDb from '../lib/code-graph-db.js';
import {
  DEFAULT_GOLD_BATTERY_PATH,
  executeBattery,
  loadGoldBattery,
  type GoldBattery,
} from '../lib/gold-query-verifier.js';
import { ensureCodeGraphReady } from '../lib/ensure-ready.js';
import { buildReadinessBlock } from '../lib/readiness-contract.js';
import { resolveIndexScopePolicy, scopeFingerprintsMatchOrLegacy } from '../lib/index-scope-policy.js';
import { canonicalizeWorkspacePaths, isWithinWorkspace } from '../lib/utils/workspace-path.js';
import { handleCodeGraphQuery } from './query.js';

export type VerifyCategory =
  | 'mcp-tool'
  | 'cross-module'
  | 'exported-type'
  | 'regression-detection';

export interface VerifyArgs {
  rootDir?: string;
  batteryPath?: string;
  category?: VerifyCategory;
  failFast?: boolean;
  includeDetails?: boolean;
  persistBaseline?: boolean;
  allowInlineIndex?: boolean;
}

const GOLD_BATTERY_FILENAME = 'code-graph-gold-queries.json';

function buildResponse(payload: object): { content: Array<{ type: 'text'; text: string }> } {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify(payload, null, 2),
    }],
  };
}

function scopeDiagnostic(scope: {
  fingerprint?: string | null;
  label?: string | null;
  source?: string | null;
}) {
  return {
    fingerprint: scope.fingerprint ?? null,
    label: scope.label ?? null,
    source: scope.source ?? null,
  };
}

function buildScopePreflight() {
  const activeScope = resolveIndexScopePolicy();
  const storedScope = graphDb.getStoredCodeGraphScope();
  const matches = scopeFingerprintsMatchOrLegacy(storedScope.fingerprint, activeScope.fingerprint);
  return {
    status: matches ? 'pass' : 'mismatch',
    activeScope: scopeDiagnostic(activeScope),
    storedScope: scopeDiagnostic(storedScope),
    reason: matches
      ? 'active scope matches stored graph scope'
      : 'active scope differs from stored graph scope',
  };
}

// Informational scope-mismatch field derived from the
// already-computed preflight. Returns `null` when scopes match.
// When they differ, surfaces the canonical { stored, active,
// recommendation } shape so operators can decide whether to
// rescan with matching scope or pass `forceScopeChange`. The
// field is purely informational — verify proceeds either way.
function buildScopeMismatchInfo(
  preflight: ReturnType<typeof buildScopePreflight>,
): {
  stored: ReturnType<typeof scopeDiagnostic>;
  active: ReturnType<typeof scopeDiagnostic>;
  recommendation: string;
} | null {
  if (preflight.status !== 'mismatch') {
    return null;
  }
  return {
    stored: preflight.storedScope,
    active: preflight.activeScope,
    recommendation: 'rescan with matching scope or pass forceScopeChange',
  };
}

function applyCategoryFilter(
  battery: GoldBattery,
  category: VerifyCategory | undefined,
): GoldBattery {
  if (!category) {
    return battery;
  }

  const filteredQueries = battery.queries.filter((query) => query.category === category);
  if (filteredQueries.length === 0) {
    throw new Error(`Gold battery does not contain any queries for category "${category}"`);
  }

  return {
    ...battery,
    queries: filteredQueries,
  };
}

function isAllowlistedBatteryPath(canonicalWorkspace: string, canonicalBatteryPath: string): boolean {
  const allowlistedBases = [
    resolve(canonicalWorkspace, '.opencode/specs'),
    resolve(canonicalWorkspace, '.opencode/skills/system-spec-kit/mcp-server'),
    resolve(canonicalWorkspace, '.opencode/skills/system-code-graph/mcp-server'),
  ];

  return allowlistedBases.some((basePath) => {
    const candidateRelative = relative(basePath, canonicalBatteryPath);
    if (
      candidateRelative.length === 0
      || candidateRelative.startsWith('..')
      || isAbsolute(candidateRelative)
    ) {
      return false;
    }

    const segments = candidateRelative.split(sep);
    const assetDir = segments[segments.length - 2];
    const fileName = segments[segments.length - 1];
    return segments.length >= 2
      && assetDir === 'assets'
      && fileName === GOLD_BATTERY_FILENAME;
  });
}

type ResolveVerifyPathsResult =
  | { readonly ok: true; readonly canonicalRootDir: string; readonly canonicalBatteryPath: string }
  | { readonly ok: false; readonly error: string };

function resolveVerifyPaths(args: VerifyArgs): ResolveVerifyPathsResult {
  const resolvedRootDir = resolve(args.rootDir ?? process.cwd());
  const resolvedBatteryPath = resolve(args.batteryPath ?? DEFAULT_GOLD_BATTERY_PATH);

  const canonical = canonicalizeWorkspacePaths(resolvedRootDir);
  if (!canonical) {
    return {
      ok: false,
      error: `rootDir path is invalid or contains a broken symlink: ${resolvedRootDir}`,
    };
  }
  const { canonicalWorkspace, canonicalRootDir } = canonical;

  if (!isWithinWorkspace(canonicalWorkspace, canonicalRootDir)) {
    return {
      ok: false,
      error: `rootDir must stay within the workspace root: ${canonicalWorkspace}`,
    };
  }

  let canonicalBatteryPath: string;
  try {
    canonicalBatteryPath = realpathSync(resolvedBatteryPath);
  } catch {
    return {
      ok: false,
      error: `batteryPath is invalid or contains a broken symlink: ${resolvedBatteryPath}`,
    };
  }

  if (!isAllowlistedBatteryPath(canonicalWorkspace, canonicalBatteryPath)) {
    return {
      ok: false,
      error: `batteryPath must stay within approved code-graph asset roots under: ${canonicalWorkspace}`,
    };
  }

  return {
    ok: true,
    canonicalRootDir,
    canonicalBatteryPath,
  };
}

export async function handleCodeGraphVerify(
  args: VerifyArgs,
): Promise<{ content: { type: 'text'; text: string }[] }> {
  const paths = resolveVerifyPaths(args);
  if (!paths.ok) {
    return buildResponse({
      status: 'error',
      error: `code_graph_verify failed: ${paths.error}`,
    });
  }
  const { canonicalRootDir, canonicalBatteryPath } = paths;

  try {
    const readyState = await ensureCodeGraphReady(canonicalRootDir, {
      allowInlineIndex: args.allowInlineIndex ?? false,
      allowInlineFullScan: false,
    });
    const readiness = buildReadinessBlock(readyState);
    const scopePreflight = buildScopePreflight();
    // Informational scopeMismatch field derived from the
    // single preflight call (no extra DB query). Surfaces stored
    // vs active scope and a remediation hint when the two differ.
    const scopeMismatch = buildScopeMismatchInfo(scopePreflight);

    if (readyState.freshness !== 'fresh') {
      return buildResponse({
        status: 'blocked',
        readiness,
        scopePreflight,
        ...(scopeMismatch ? { scopeMismatch } : {}),
      });
    }

    // Scope mismatch is informational only — verify proceeds
    // and the `scopeMismatch` field on the response surfaces the
    // canonical { stored, active, recommendation } shape so operators
    // can decide whether to rescan or override. The legacy block
    // branch was removed; readiness is now the only blocking signal.

    const battery = applyCategoryFilter(loadGoldBattery(canonicalBatteryPath), args.category);
    const result = {
      ...(await executeBattery(battery, handleCodeGraphQuery, {
        failFast: args.failFast,
        includeDetails: args.includeDetails,
      })),
      batteryPath: canonicalBatteryPath,
    };

    if (args.persistBaseline === true) {
      graphDb.setLastGoldVerification(result);
    }

    return buildResponse({
      status: 'ok',
      scopePreflight,
      ...(scopeMismatch ? { scopeMismatch } : {}),
      result,
    });
  } catch (error: unknown) {
    return buildResponse({
      status: 'error',
      error: `code_graph_verify failed: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}
