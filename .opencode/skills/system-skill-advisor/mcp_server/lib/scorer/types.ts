// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Scorer Types
// ───────────────────────────────────────────────────────────────

import type { AffordanceInput } from '../affordance-normalizer.js';
import type { ScorerLaneId } from './lane-registry.js';
// SkillLifecycleStatus now derives from the canonical tuple in
// lifecycle/status-values.ts. The re-export here keeps every existing consumer
// importing from `scorer/types.js`.
import {
  SKILL_LIFECYCLE_STATUS_VALUES,
  isSkillLifecycleStatus,
  type SkillLifecycleStatus,
} from '../lifecycle/status-values.js';

export type ScorerLane = ScorerLaneId;

export {
  SKILL_LIFECYCLE_STATUS_VALUES,
  isSkillLifecycleStatus,
  type SkillLifecycleStatus,
};

/**
 * Doc-level trigger signal harvested from one reference/asset doc's
 * frontmatter. Only present when the doc-trigger harvest flag is on and
 * the sqlite projection carries skill_docs rows.
 */
export interface SkillDocTriggerProjection {
  /** Path relative to the skill directory, e.g. 'references/foo.md'. */
  readonly docPath: string;
  readonly phrases: readonly string[];
  /** Importance-tier dampening multiplier in (0, 1]. */
  readonly tierWeight: number;
}

export interface SkillProjection {
  readonly id: string;
  readonly kind: 'skill' | 'command';
  readonly family: string;
  readonly category: string;
  readonly name: string;
  readonly description: string;
  readonly keywords: readonly string[];
  readonly domains: readonly string[];
  readonly intentSignals: readonly string[];
  readonly derivedTriggers: readonly string[];
  readonly derivedKeywords: readonly string[];
  readonly derivedDemotion?: number;
  // Per-skill derived-content freshness: graph-metadata.json derived.generated_at
  // (canonical), with legacy last_updated_at/created_at fallback. This is
  // AUTHOR-TIME — when the derived block was last generated/synced from source —
  // NOT a runtime value: advisor_rebuild/skill_graph_scan re-index the existing
  // block without re-stamping it (only a derived-content change through sync
  // re-stamps it). The age haircut decays by THIS, not by when the projection
  // itself was built (a projection is rebuilt constantly, so its own timestamp
  // would exempt every skill from the haircut).
  readonly derivedGeneratedAt?: string | null;
  readonly docTriggers?: readonly SkillDocTriggerProjection[];
  readonly sourcePath: string | null;
  readonly lifecycleStatus: SkillLifecycleStatus;
  readonly redirectTo?: string | null;
  readonly redirectFrom?: readonly string[];
}

export interface SkillEdgeProjection {
  readonly sourceId: string;
  readonly targetId: string;
  readonly edgeType: 'depends_on' | 'enhances' | 'siblings' | 'conflicts_with' | 'prerequisite_for';
  readonly weight: number;
  readonly context?: string;
}

export interface AdvisorEmbeddingSignature {
  readonly provider: string | null;
  readonly name: string;
  readonly dim: number;
  readonly modelId: string;
  readonly providerModelId?: string | null;
}

export interface AdvisorEmbeddingStalenessVerdict {
  readonly stale: boolean;
  readonly reason?: string;
  readonly active: AdvisorEmbeddingSignature | null;
  readonly stored: AdvisorEmbeddingSignature | null;
  readonly vectorCount: number;
  readonly modelIds?: readonly string[];
}

// 'filesystem-fallback' is set when SQLite projection threw
// (corrupt DB, schema mismatch, etc.) and we degraded to filesystem scan; the
// optional `fallbackReason` carries the underlying error so operators can
// distinguish a clean filesystem-only run ('filesystem' source) from a
// degraded one. 'filesystem' is preserved for the legitimate first-run path
// where the SQLite DB simply does not exist yet.
export interface AdvisorProjection {
  readonly skills: readonly SkillProjection[];
  readonly edges: readonly SkillEdgeProjection[];
  readonly generatedAt: string;
  readonly source: 'sqlite' | 'filesystem' | 'filesystem-fallback' | 'fixture';
  readonly fallbackReason?: string;
  readonly embeddingSignature?: AdvisorEmbeddingSignature | null;
  readonly embeddingStaleness?: AdvisorEmbeddingStalenessVerdict;
}

export interface LaneMatch {
  readonly skillId: string;
  readonly lane: ScorerLane;
  readonly score: number;
  readonly evidence: readonly string[];
  readonly shadowOnly?: boolean;
}

export type LaneScores = Readonly<Record<ScorerLane, readonly LaneMatch[]>>;

export type LaneRuntimeHealthStatus = 'healthy' | 'runtime_degraded' | 'matched_nothing';

export interface LaneRuntimeHealthSignal {
  readonly status: 'healthy' | 'runtime_degraded';
  readonly reason?: string;
}

export interface LaneRuntimeHealth {
  readonly lane: ScorerLane;
  readonly status: LaneRuntimeHealthStatus;
  readonly matchCount: number;
  readonly reason?: string;
}

export interface LaneDampingConfig {
  readonly threshold: number;
  readonly floor: number;
}

export interface LaneContribution {
  readonly lane: ScorerLane;
  readonly rawScore: number;
  readonly weightedScore: number;
  readonly weight: number;
  readonly evidence: readonly string[];
  readonly shadowOnly: boolean;
}

export interface AdvisorScoredRecommendation {
  readonly skill: string;
  readonly kind: 'skill' | 'command';
  readonly confidence: number;
  readonly uncertainty: number;
  readonly passes_threshold: boolean;
  readonly reason: string;
  readonly score: number;
  readonly laneContributions: readonly LaneContribution[];
  readonly dominantLane: ScorerLane | null;
  readonly ambiguousWith?: readonly string[];
  readonly redirectTo?: string;
  readonly redirectFrom?: readonly string[];
  readonly lifecycleStatus: SkillLifecycleStatus;
}

export interface AdvisorScoringOptions {
  readonly workspaceRoot: string;
  readonly projection?: AdvisorProjection;
  readonly affordances?: readonly AffordanceInput[];
  readonly confidenceThreshold?: number;
  readonly uncertaintyThreshold?: number;
  readonly includeAllCandidates?: boolean;
  readonly disabledLanes?: readonly ScorerLane[];
  readonly runtimeLaneHealth?: Partial<Record<ScorerLane, LaneRuntimeHealthSignal>>;
  /**
   * Optional scorer lane weights for one scoring call. Overrides are merged over
   * the default vector without renormalizing; callers own sensible totals. The
   * lane registry's `live` flag still gates contribution, so overriding a
   * shadow-only lane's weight does not make it contribute.
   */
  readonly laneWeightsOverride?: Partial<Record<ScorerLane, number>>;
  /**
   * Optional per-call contribution damping. Overrides are merged over registry
   * defaults. When a lane's raw score falls below `threshold`, fusion scales the
   * lane's effective weight by `floor`.
   */
  readonly dampingOverride?: Partial<Record<ScorerLane, LaneDampingConfig>>;
}

export interface AdvisorScoringResult {
  readonly recommendations: readonly AdvisorScoredRecommendation[];
  readonly topSkill: string | null;
  readonly unknown: boolean;
  readonly ambiguous: boolean;
  readonly metrics: {
    readonly candidateCount: number;
    readonly liveLaneCount: number;
    readonly degradedLanes?: readonly ScorerLane[];
    readonly laneHealth?: readonly LaneRuntimeHealth[];
  };
  readonly abstainReasons?: readonly string[];
}
