// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Disabled Switch
// ───────────────────────────────────────────────────────────────
// The switch belongs to whoever makes the request. The handler reads it in the
// daemon and the CLI client reads it in the caller's own process before it
// connects, so both build the same envelope here. The client cannot import the
// handler because the handler loads the native database module and the scorer.
// The rule itself is the hooks' resolver, so the direct call abstains exactly
// when the prompt hooks do.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { existsSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

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

interface HookFlagsResolver {
  hookFlagDecision(
    concern: string,
    env?: NodeJS.ProcessEnv,
    config?: Readonly<Record<string, string>>,
  ): { enabled: boolean; key: string | null };
  loadConfigFile(path: string): Record<string, string>;
  configPath(): string;
  concernFlag(concern: string): string | null;
  MASTER_FLAG: string;
  MASTER_ALIASES: readonly string[];
  LEGACY_ALIASES: Readonly<Record<string, readonly string[]>>;
}

// The source and the built module sit at different depths below .skilled, so the
// resolver is found by walking up rather than by counting parent hops. A missing
// resolver answers as if no switch were set, as every adapter does.
function loadHookFlags(): HookFlagsResolver | null {
  let folder = dirname(fileURLToPath(import.meta.url));
  while (true) {
    const resolverPath = join(folder, 'hooks', 'shared', 'hook-flags.cjs');
    if (existsSync(resolverPath)) {
      try {
        return createRequire(import.meta.url)(resolverPath) as HookFlagsResolver;
      } catch {
        return null;
      }
    }
    const parent = dirname(folder);
    if (parent === folder) return null;
    folder = parent;
  }
}

const hookFlags = loadHookFlags();
const skillAdvisorFlag = hookFlags?.concernFlag('skill-advisor') ?? null;

// Callers strip these names to isolate a scope from a switch set in the shell.
export const ADVISOR_DISABLED_FLAGS: readonly string[] = hookFlags === null
  ? []
  : [
      hookFlags.MASTER_FLAG,
      ...hookFlags.MASTER_ALIASES,
      ...(skillAdvisorFlag === null ? [] : [skillAdvisorFlag]),
      ...(hookFlags.LEGACY_ALIASES['skill-advisor'] ?? []),
    ];

// Both arguments go in so an explicit environment never drops the file. The file
// is read per call because each CLI call is its own process.
export function advisorDisabledBy(
  env: NodeJS.ProcessEnv = process.env,
  config?: Readonly<Record<string, string>>,
): string | null {
  if (hookFlags === null) return null;
  const fileConfig = config ?? hookFlags.loadConfigFile(env.HOOK_FLAGS_CONFIG || hookFlags.configPath());
  const decision = hookFlags.hookFlagDecision('skill-advisor', env, fileConfig);
  return decision.enabled ? null : decision.key;
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
  config?: Readonly<Record<string, string>>,
): AdvisorRecommendOutput | null {
  const disabledBy = advisorDisabledBy(env, config);
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
