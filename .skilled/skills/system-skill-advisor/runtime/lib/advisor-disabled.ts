// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Disabled Switch
// ───────────────────────────────────────────────────────────────
// The switch belongs to whoever makes the request. The handler reads it in the
// daemon and the CLI client reads it in the caller's own process before it
// connects, so both build the same envelope here. The client cannot import the
// handler because the handler loads the native database module and the scorer.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { realpathSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  AdvisorRecommendOutputSchema,
  type AdvisorRecommendOutput,
} from '../schemas/advisor-tool-schemas.js';
import {
  resolvedConfidenceThreshold,
  resolvedUncertaintyThreshold,
} from './compat/contract.js';
import { findAdvisorWorkspaceRoot } from './utils/workspace-root.js';

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

type PublicThresholds = AdvisorRecommendOutput['effectiveThresholds'];

// The canonical flag is checked first so the reason names it when both are set.
export const ADVISOR_DISABLED_FLAGS = [
  'SYSTEM_SKILL_ADVISOR_HOOK_DISABLED',
  'SPECKIT_SKILL_ADVISOR_HOOK_DISABLED',
] as const;

export function advisorDisabledBy(env: NodeJS.ProcessEnv = process.env): string | null {
  return ADVISOR_DISABLED_FLAGS.find((flag) => env[flag] === '1') ?? null;
}

// Canonicalize a caller-supplied workspaceRoot via realpath.
// The schema-level allowlist refinement runs against the same canonical
// form, so a caller passing /tmp/symlink-to-repo gets the real path
// post-symlink before downstream code uses it.
export function requestWorkspaceRoot(workspaceRoot?: string): string {
  if (!workspaceRoot) {
    return findAdvisorWorkspaceRoot(process.cwd(), { maxDepth: 12 });
  }
  const resolved = resolve(workspaceRoot);
  try {
    return realpathSync.native(resolved);
  } catch {
    return resolved;
  }
}

function unavailableTrustState(reason: string): AdvisorRecommendOutput['trustState'] {
  return {
    state: 'unavailable',
    reason,
    generation: 0,
    checkedAt: new Date().toISOString(),
    lastLiveAt: null,
  };
}

// ───────────────────────────────────────────────────────────────────
// 3. EXPORTS
// ───────────────────────────────────────────────────────────────────

export function emptyOutput(args: {
  workspaceRoot: string;
  effectiveThresholds: AdvisorRecommendOutput['effectiveThresholds'];
  freshness: AdvisorRecommendOutput['freshness'];
  trustState: AdvisorRecommendOutput['trustState'];
  warnings?: readonly string[];
  abstainReasons?: readonly string[];
}): AdvisorRecommendOutput {
  return AdvisorRecommendOutputSchema.parse({
    workspaceRoot: args.workspaceRoot,
    effectiveThresholds: args.effectiveThresholds,
    recommendations: [],
    ambiguous: false,
    freshness: args.freshness,
    trustState: args.trustState,
    generatedAt: new Date().toISOString(),
    cache: {
      hit: false,
      sourceSignaturePresent: false,
    },
    ...(args.warnings && args.warnings.length > 0 ? { warnings: [...args.warnings] } : {}),
    ...(args.abstainReasons && args.abstainReasons.length > 0 ? { abstainReasons: [...args.abstainReasons] } : {}),
  });
}

export function disabledRecommendOutput(
  input: { readonly workspaceRoot?: unknown; readonly options?: unknown },
  env: NodeJS.ProcessEnv = process.env,
): AdvisorRecommendOutput | null {
  const disabledBy = advisorDisabledBy(env);
  if (disabledBy === null) return null;
  const options = typeof input.options === 'object' && input.options !== null
    ? input.options as Record<string, unknown>
    : {};
  const effectiveThresholds: PublicThresholds = {
    confidenceThreshold: typeof options.confidenceThreshold === 'number'
      ? options.confidenceThreshold
      : resolvedConfidenceThreshold(),
    uncertaintyThreshold: typeof options.uncertaintyThreshold === 'number'
      ? options.uncertaintyThreshold
      : resolvedUncertaintyThreshold(),
    confidenceOnly: false,
  };
  return emptyOutput({
    workspaceRoot: requestWorkspaceRoot(
      typeof input.workspaceRoot === 'string' ? input.workspaceRoot : undefined,
    ),
    effectiveThresholds,
    freshness: 'unavailable',
    trustState: unavailableTrustState('ADVISOR_DISABLED'),
    warnings: ['ADVISOR_DISABLED'],
    abstainReasons: [`Skill advisor disabled by ${disabledBy}.`],
  });
}
