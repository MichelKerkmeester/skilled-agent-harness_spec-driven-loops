// ───────────────────────────────────────────────────────────────
// MODULE: Memory Roadmap Flags
// ───────────────────────────────────────────────────────────────
// Feature catalog: Feature flag governance
// Phase-gated capability switches for the memory roadmap.
// Defaults reflect the shipped rollout unless explicitly opted out, except for
// roadmap phases that remain intentionally dormant in production.
import { isFeatureEnabled } from '../cognitive/rollout-policy.js';

// Derive phase type from the canonical array to keep them in sync.
const SUPPORTED_PHASES_ARRAY = ['baseline', 'lineage', 'graph', 'adaptive', 'scope-governance'] as const;

/** Canonical rollout phases used by memory roadmap tracking. */
type MemoryRoadmapPhase = typeof SUPPORTED_PHASES_ARRAY[number];

/** Capability flags tracked for phased rollout. */
interface MemoryRoadmapCapabilityFlags {
  lineageState: boolean;
  graphUnified: boolean;
  adaptiveRanking: boolean;
}

/** Rollout defaults snapshot for telemetry and migration checkpoints. */
interface MemoryRoadmapDefaults {
  phase: MemoryRoadmapPhase;
  capabilities: MemoryRoadmapCapabilityFlags;
  scopeDimensionsTracked: number;
}

const PHASE_ENV = 'SPECKIT_MEMORY_ROADMAP_PHASE';
/**
 * SPECKIT_PARSER, Structural parser backend selector.
 *
 * Controls which parsing backend the structural indexer uses for code-graph
 * symbol extraction. Evaluated at first parse call; cannot be changed mid-session.
 *
 * | Value        | Description                                                 |
 * |--------------|-------------------------------------------------------------|
 * | `treesitter` | (default) AST-accurate parsing via web-tree-sitter WASM    |
 * | `regex`      | Lightweight regex-based fallback, no WASM dependencies     |
 *
 * Runtime: `lib/code-graph/structural-indexer.ts::getParser()`
 * Example: `SPECKIT_PARSER=regex node context-server.js`
 */
const SPECKIT_PARSER_ENV = 'SPECKIT_PARSER' as const;

/**
 * SPECKIT_IDENTITY_MERGE_SAFETY: Shared identity resolver and lineage-merge guard.
 *
 * Strictly default-OFF and env-only: existing description.json and graph-metadata.json
 * files on disk still carry the caller-base-relative path shape and the spread-merge
 * lineage, so the specs-root-relative identity and the parent/children preservation
 * guard must stay opt-in until a scoped migration graduates them. Unlike the roadmap
 * capabilities this never consults the rollout policy, so an un-set environment can
 * never flip it on by chance.
 *
 * | Value          | Behavior                                                          |
 * |----------------|-------------------------------------------------------------------|
 * | unset / other  | (default) generators keep their legacy identity, merge spreads    |
 * | `true` / `1`   | both generators resolve specs-root-relative identity and the      |
 * |                | merge preserves a non-null parent and unions children             |
 */
const IDENTITY_MERGE_SAFETY_ENV = 'SPECKIT_IDENTITY_MERGE_SAFETY' as const;

/**
 * Returns whether the shared identity resolver and the lineage-merge guard are active.
 *
 * Reads the environment on every call so a test can flip the behavior per-case, and
 * stays OFF for any value other than an explicit truthy opt-in.
 */
function isIdentityMergeSafetyEnabled(): boolean {
  const rawValue = process.env[IDENTITY_MERGE_SAFETY_ENV]?.trim().toLowerCase();
  return rawValue === 'true' || rawValue === '1';
}

// Keep roadmap controls distinct from existing runtime feature flags so
// Telemetry/checkpoints describe roadmap rollout state rather than unrelated
// Default-on retrieval behavior.
const CAPABILITY_ENV = {
  lineageState: 'SPECKIT_MEMORY_LINEAGE_STATE',
  graphUnified: 'SPECKIT_MEMORY_GRAPH_UNIFIED',
  adaptiveRanking: 'SPECKIT_MEMORY_ADAPTIVE_RANKING',
} as const;

const SUPPORTED_PHASES: ReadonlySet<MemoryRoadmapPhase> = new Set(SUPPORTED_PHASES_ARRAY);

function hasExplicitDisableFlag(flagNames: string | readonly string[]): boolean {
  const candidates = Array.isArray(flagNames) ? flagNames : [flagNames];
  for (const flagName of candidates) {
    const rawValue = process.env[flagName]?.trim().toLowerCase();
    if (rawValue === 'false' || rawValue === '0') {
      return true;
    }
  }
  return false;
}

function normalizeIdentity(flagName: string, identity?: string): string {
  if (typeof identity === 'string' && identity.trim().length > 0) {
    return identity.trim();
  }
  return `memory-roadmap:${flagName}`;
}

/** Returns the roadmap capability state, with optional default-off dormant flags. */
function isMemoryRoadmapCapabilityEnabled(
  flagNames: string | readonly string[],
  identity?: string,
  defaultValue = true,
): boolean {
  const candidates = Array.isArray(flagNames) ? flagNames : [flagNames];
  if (hasExplicitDisableFlag(flagNames)) {
    return false;
  }

  for (const flagName of candidates) {
    const rawValue = process.env[flagName]?.trim().toLowerCase();
    if (rawValue === 'true' || rawValue === '1') {
      return true;
    }
  }

  if (!defaultValue) {
    return false;
  }

  const canonicalFlag = candidates[0];
  return isFeatureEnabled(canonicalFlag, normalizeIdentity(canonicalFlag, identity));
}

/** Resolves the active memory roadmap phase from env, defaulting to scope-governance. */
function getMemoryRoadmapPhase(): MemoryRoadmapPhase {
  const canonicalPhase = process.env[PHASE_ENV]?.trim().toLowerCase();
  if (canonicalPhase && SUPPORTED_PHASES.has(canonicalPhase as MemoryRoadmapPhase)) {
    return canonicalPhase as MemoryRoadmapPhase;
  }
  return 'scope-governance';
}

/** Returns the full capability snapshot for memory roadmap controls. */
function getMemoryRoadmapCapabilityFlags(identity?: string): MemoryRoadmapCapabilityFlags {
  return {
    lineageState: isMemoryRoadmapCapabilityEnabled(
      CAPABILITY_ENV.lineageState,
      identity,
    ),
    graphUnified: isMemoryRoadmapCapabilityEnabled(
      CAPABILITY_ENV.graphUnified,
      identity,
    ),
    adaptiveRanking: isMemoryRoadmapCapabilityEnabled(
      CAPABILITY_ENV.adaptiveRanking,
      identity,
      false,
    ),
  };
}

/** Returns defaults consumed by telemetry/checkpoint paths for phase tracking. */
function getMemoryRoadmapDefaults(identity?: string): MemoryRoadmapDefaults {
  return {
    phase: getMemoryRoadmapPhase(),
    capabilities: getMemoryRoadmapCapabilityFlags(identity),
    scopeDimensionsTracked: 4, // tenant/user/agent/session
  };
}

export {
  /** @internal — test-only, not part of public API */
  CAPABILITY_ENV,
  getMemoryRoadmapCapabilityFlags,
  getMemoryRoadmapDefaults,
  getMemoryRoadmapPhase,
  /** Documented identity/merge-safety env var name */
  IDENTITY_MERGE_SAFETY_ENV,
  isIdentityMergeSafetyEnabled,
  /** @internal — exposed for test utilities only */
  isMemoryRoadmapCapabilityEnabled,
  /** Documented parser backend env var name */
  SPECKIT_PARSER_ENV,
};

export type {
  MemoryRoadmapCapabilityFlags,
  MemoryRoadmapDefaults,
  MemoryRoadmapPhase,
};
