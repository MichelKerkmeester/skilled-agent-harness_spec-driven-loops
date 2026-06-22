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
 * Default-ON, graduated on a measured benchmark. The scoped migration restamped the
 * tree, so both generators resolve the specs-root-relative identity and the merge
 * preserves a non-null parent and unions children by default. An explicit opt-out
 * restores the legacy caller-base path shape and the spread-merge lineage for a tree
 * that has not been restamped. Unlike the roadmap capabilities this never consults the
 * rollout policy, so the graduated default holds without the rollout percentage.
 *
 * | Value                 | Behavior                                                   |
 * |-----------------------|------------------------------------------------------------|
 * | unset / `true` / `1`  | (default) specs-root-relative identity, parent preserved, children unioned |
 * | `false` / `0` / `off` | legacy caller-base identity, merge spreads                 |
 */
const IDENTITY_MERGE_SAFETY_ENV = 'SPECKIT_IDENTITY_MERGE_SAFETY' as const;

/**
 * Returns whether the shared identity resolver and the lineage-merge guard are active.
 *
 * Reads the environment on every call so a test can flip the behavior per-case, and
 * stays ON for any value other than an explicit opt-out so the graduated default holds.
 */
function isIdentityMergeSafetyEnabled(): boolean {
  const rawValue = process.env[IDENTITY_MERGE_SAFETY_ENV]?.trim().toLowerCase();
  return !(rawValue === 'false' || rawValue === '0' || rawValue === 'off');
}

/**
 * SPECKIT_GENERATED_METADATA_GRANDFATHER: Generated-metadata integrity report mode.
 *
 * Default-OFF-enforcing, graduated on a measured benchmark. The scoped migration
 * restamped the legacy description.json and graph-metadata.json files, so the
 * GENERATED_METADATA_INTEGRITY rule runs as a hard error by default and a violation
 * blocks strict validation. An explicit opt-in restores the grandfather report mode that
 * records violations non-blocking, kept only for a tree that has not been restamped yet.
 * The enforcing default measures clean because the migrated tree carries zero violations,
 * which holds only while the drift-gate and generator-hardening flags stay off.
 *
 * | Value                         | Behavior                                            |
 * |-------------------------------|-----------------------------------------------------|
 * | unset / `false` / `0` / `off` | (default) violations are errors and block strict validation |
 * | `true` / `1`                  | grandfather report mode, violations report non-blocking     |
 */
const GENERATED_METADATA_GRANDFATHER_ENV = 'SPECKIT_GENERATED_METADATA_GRANDFATHER' as const;

/**
 * Returns whether generated-metadata integrity violations stay in grandfather report mode.
 *
 * Reads the environment on every call so a test can flip the behavior per-case, and stays
 * OFF for any value other than an explicit opt-in so an unset environment enforces.
 */
function isGeneratedMetadataGrandfatherEnabled(): boolean {
  const rawValue = process.env[GENERATED_METADATA_GRANDFATHER_ENV]?.trim().toLowerCase();
  return rawValue === 'true' || rawValue === '1';
}

/**
 * SPECKIT_GENERATED_METADATA_DRIFT_GATE: Synopsis drift gate and shared-extractor routing.
 *
 * Strictly default-OFF and env-only. Existing folders carry description and causal_summary
 * text produced by two divergent extractors plus stale synopsis fields with no freshness
 * proof, so a hard gate flipped on at once would mass-fail them. With the flag off the gate
 * runs in grandfather report mode: the drift report surfaces in strict validation and dry-run
 * backfill but never changes the verdict, both fields keep their legacy local extractors, and
 * no source_doc_hashes are persisted, so generated bytes are unchanged. With the flag on both
 * fields derive from the one shared synopsis extractor, source_doc_hashes persist as the cheap
 * freshness key, and a drift report graduates to a hard strict failure. Like the sibling safety
 * flags this never consults the rollout policy, so an un-set environment can never enforce by chance.
 *
 * | Value          | Behavior                                                          |
 * |----------------|-------------------------------------------------------------------|
 * | unset / other  | (default) grandfather report mode, legacy extractors, no hashes   |
 * | `true` / `1`   | shared extractor, persisted hashes, drift fails strict validation |
 */
const GENERATED_METADATA_DRIFT_GATE_ENV = 'SPECKIT_GENERATED_METADATA_DRIFT_GATE' as const;

/**
 * Returns whether the generated-metadata drift gate enforces and routes both synopsis fields
 * through the shared extractor.
 *
 * Reads the environment on every call so a test can flip the behavior per-case, and stays OFF
 * for any value other than an explicit truthy opt-in so an unset environment stays in grandfather
 * report mode.
 */
function isGeneratedMetadataDriftGateEnabled(): boolean {
  const rawValue = process.env[GENERATED_METADATA_DRIFT_GATE_ENV]?.trim().toLowerCase();
  return rawValue === 'true' || rawValue === '1';
}

/**
 * SPECKIT_GENERATOR_HARDENING: Graph-metadata generator hardening switch.
 *
 * Strictly default-OFF and env-only: existing graph-metadata.json files carry neither a
 * source_fingerprint nor the unified phase-child contract, and the access/freshness
 * telemetry still lives in the generated JSON, so each behavior must stay opt-in until a
 * scoped migration restamps the legacy files. With the flag on the generator persists a
 * source_fingerprint over the volatile-ignoring source-doc projection, both the
 * phase-parent classification and the derived children list resolve through one shared
 * listPhaseChildren enumeration, and a read or resume routes access and freshness to the
 * index-layer store instead of dirtying the generated file. Like the other safety flags
 * this never consults the rollout policy, so an un-set environment can never flip it on.
 *
 * | Value          | Behavior                                                          |
 * |----------------|-------------------------------------------------------------------|
 * | unset / other  | (default) no fingerprint, legacy split child paths, JSON pointer  |
 * | `true` / `1`   | fingerprint written, unified child contract, telemetry split      |
 */
const GENERATOR_HARDENING_ENV = 'SPECKIT_GENERATOR_HARDENING' as const;

/**
 * Returns whether the graph-metadata generator hardening behaviors are active.
 *
 * Reads the environment on every call so a test can flip the behavior per-case, and
 * stays OFF for any value other than an explicit truthy opt-in.
 */
function isGeneratorHardeningEnabled(): boolean {
  const rawValue = process.env[GENERATOR_HARDENING_ENV]?.trim().toLowerCase();
  return rawValue === 'true' || rawValue === '1';
}

/**
 * SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES: Content-gated description and global-cache writes.
 *
 * Default-ON, graduated on a measured benchmark that proved a double generate stays
 * deterministic. A per-folder save that changes only the volatile stamp is skipped and
 * the prior timestamp is preserved, the aggregate-cache write is gated on a real member
 * delta, and the targeted upsert replaces only the changed entry. An explicit canonical
 * save still bumps the timestamp through the escape hatch. An explicit opt-out restores
 * the unconditional legacy write that stamps wall-clock time. Like the other safety flags
 * this never consults the rollout policy, so the graduated default holds without the
 * rollout percentage.
 *
 * | Value                 | Behavior                                                   |
 * |-----------------------|------------------------------------------------------------|
 * | unset / `true` / `1`  | (default) unchanged content skips the write and preserves the prior stamp |
 * | `false` / `0` / `off` | writes are unconditional and stamp wall-clock time         |
 */
const IDEMPOTENT_DESCRIPTION_WRITES_ENV = 'SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES' as const;

/**
 * Returns whether content-gated idempotent description and cache writes are active.
 *
 * Reads the environment on every call so a test can flip the behavior per-case, and
 * stays ON for any value other than an explicit opt-out so the graduated default holds.
 */
function isIdempotentDescriptionWritesEnabled(): boolean {
  const rawValue = process.env[IDEMPOTENT_DESCRIPTION_WRITES_ENV]?.trim().toLowerCase();
  return !(rawValue === 'false' || rawValue === '0' || rawValue === 'off');
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
  /** Documented generated-metadata drift-gate env var name */
  GENERATED_METADATA_DRIFT_GATE_ENV,
  /** Documented generated-metadata grandfather env var name */
  GENERATED_METADATA_GRANDFATHER_ENV,
  /** Documented generator-hardening env var name */
  GENERATOR_HARDENING_ENV,
  /** Documented idempotent-description-writes env var name */
  IDEMPOTENT_DESCRIPTION_WRITES_ENV,
  /** Documented identity/merge-safety env var name */
  IDENTITY_MERGE_SAFETY_ENV,
  isGeneratedMetadataDriftGateEnabled,
  isGeneratedMetadataGrandfatherEnabled,
  isGeneratorHardeningEnabled,
  isIdempotentDescriptionWritesEnabled,
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
