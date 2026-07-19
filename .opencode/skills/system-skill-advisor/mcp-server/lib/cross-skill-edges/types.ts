// ───────────────────────────────────────────────────────────────
// MODULE: Cross-Skill Edges Types
// ───────────────────────────────────────────────────────────────
// Type definitions for the cross-skill edge propagation system.

// ───────────────────────────────────────────────────────────────
// 1. PROPAGATION MODES
// ───────────────────────────────────────────────────────────────

export type PropagationMode = 'report' | 'propose' | 'apply';

export type EdgeSourceKind = 'automated' | 'manual' | 'trusted';

export type EdgeWriteIntent = 'automated' | 'trusted-maintainer';

// ───────────────────────────────────────────────────────────────
// 2. CANDIDATE EVIDENCE
// ───────────────────────────────────────────────────────────────

export interface CandidateRuleEvidence {
  rule: 'family-inference' | 'asset-shape' | 'sibling-transitivity';
  contribution: number;  // 0..1
  detail: string;        // e.g. "4/4 cli-family share"
}

// ───────────────────────────────────────────────────────────────
// 3. CANDIDATE
// ───────────────────────────────────────────────────────────────

export interface InboundEnhanceCandidate {
  id: string;                      // hash(source + target + 'enhances')
  sourceSkillId: string;
  targetSkillId: string;
  edgeType: 'enhances';            // hardcoded; never anything else
  weight: number | null;           // null when not deterministically inferrable
  context: string | null;
  confidence: number;              // 0..1
  confidenceLabel: 'high' | 'medium' | 'low';
  rules: CandidateRuleEvidence[];
  sourcePath: string;              // absolute path to source graph-metadata.json
  targetPath: string;              // absolute path to target graph-metadata.json
  applyable: boolean;              // false when weight or context not deterministically inferrable
  blockers: string[];              // human-readable reasons for !applyable
}

// ───────────────────────────────────────────────────────────────
// 4. DETECTION OPTIONS
// ───────────────────────────────────────────────────────────────

export interface DetectInboundEnhancesOptions {
  minConfidence: number;           // default 0.75
  targetSkillIds?: string[];       // scope to specific targets
  sourceSkillIds?: string[];       // scope to specific sources
}

// ───────────────────────────────────────────────────────────────
// 5. PROPAGATION OPTIONS
// ───────────────────────────────────────────────────────────────

export interface PropagateEnhancesOptions {
  skillsRoot: string;
  mode: PropagationMode;
  writeIntent?: EdgeWriteIntent;
  minConfidence?: number;
  targetSkillIds?: string[];
  sourceSkillIds?: string[];
  applyCandidateIds?: string[];
  applyAllHighConfidence?: boolean;
  dryRun?: boolean;                // default true
}

// ───────────────────────────────────────────────────────────────
// 6. PROPAGATION RESULT
// ───────────────────────────────────────────────────────────────

export interface PropagateEnhancesResult {
  candidates: InboundEnhanceCandidate[];
  applied: string[];               // candidate IDs successfully written
  skipped_existing: string[];      // candidate IDs already present
  errors: Array<{ skillId: string; error: string }>;
  dryRun: boolean;
  mode: PropagationMode;
}

// ───────────────────────────────────────────────────────────────
// 7. SKILL METADATA RECORD
// ───────────────────────────────────────────────────────────────

export interface SkillMetadataRecord {
  skillId: string;
  family: string;
  category: string;
  domains: string[];
  intentSignals: string[];
  derived: Record<string, unknown> | null;
  filePath: string;
  contentHash: string;
  edges?: {
    enhances?: Array<{
      target: string;
      weight: number;
      context: string;
      source_kind?: EdgeSourceKind;
    }>;
    siblings?: Array<{ target: string; weight: number; context: string }>;
    depends_on?: Array<{ target: string; weight: number; context: string }>;
    conflicts_with?: Array<{ target: string; weight: number; context: string }>;
    prerequisite_for?: Array<{ target: string; weight: number; context: string }>;
  };
  enhance_when?: EnhanceWhenRule | EnhanceWhenRule[];
}

// ───────────────────────────────────────────────────────────────
// 8. ENHANCE_WHEN RULE
// ───────────────────────────────────────────────────────────────

export interface EnhanceWhenRule {
  skill_has_asset?: string;
  skill_has_files?: string[];
  weight?: number;
  context_template?: string;
}
