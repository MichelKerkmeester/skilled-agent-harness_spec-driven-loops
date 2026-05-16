---
title: "Iter 014 — Track 7: advisor-scorer.md spec"
iteration: 14
track: 7
focus: "advisor-scorer.md spec"
status: complete
newInfoRatio: 1.00
findings: 30
timestamp: 2026-05-15T17:29:47Z
---

## Iter 014 Findings (advisor-scorer.md spec)

### Frontmatter Shape
```yaml
---
title: "Advisor Scorer: Lane Attribution and Confidence Calibration"
description: "Reference documentation for the skill advisor's 5-lane scoring system, lane attribution assembly, confidence thresholds, and prompt-safety boundaries."
trigger_phrases:
  - "advisor scorer lanes"
  - "lane attribution"
  - "confidence thresholds"
  - "scorer calibration"
  - "prompt isolation safety"
---
```

### Section Outline with Anchored Sections

#### 1. OVERVIEW
The advisor scorer uses a 5-lane fusion system to rank candidate skills against user prompts. Each lane contributes weighted evidence that is assembled into a final confidence score. Lane attribution provides prompt-safe explanations of why a skill was recommended without echoing raw prompt text.

**Critical Facts:**
- The scorer combines lane-specific evidence, text matching, age policy, ambiguity handling, and fusion into prompt-safe recommendation scores <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/README.md" lines="30-33" />
- Lane attribution must not echo raw prompt text as a prompt-safety boundary <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" line="124" />
- The fusion system normalizes lane contributions by live weight total and applies calibration constants for confidence assembly <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts" lines="309-311" />

#### 2. LANE ATTRIBUTION MODEL
The advisor uses five scoring lanes, each with distinct evidence sources and weights. Lane attribution traces which lanes contributed to a recommendation and provides prompt-safe reasoning.

**Critical Facts:**
- Five lanes with weights: explicit_author (0.42), lexical (0.28), graph_causal (0.13), derived_generated (0.12), semantic_shadow (0.05) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts" lines="7-19" />
- Lane attribution filters shadow-only lanes from dominant lane detection but preserves them in reason strings <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/attribution.ts" lines="7-11" />
- The derived-dominant check detects when derived lane evidence exceeds direct (explicit + lexical) evidence, triggering a confidence ceiling <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/attribution.ts" lines="26-34" />

#### 3. LEXICAL LANE
The lexical lane performs token-based matching between prompt text and skill metadata (name, description, domains, keywords, intent signals) with synonym expansion and category hints.

**Critical Facts:**
- Lexical scoring expands tokens through a synonym map (e.g., "branch" → ["git", "worktree", "merge"]) and applies category hints for skill-specific phrases <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts" lines="8-37" />
- Category hints provide skill-specific boosts (e.g., "deep research" maps to deep-research skill with 0.38 boost) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts" lines="25-37" />
- Evidence tokens are capped at 5 hits and overall score is clamped to 1.0 minimum <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts" lines="73-86" />

#### 4. SEMANTIC SHADOW LANE
The semantic shadow lane uses vector embeddings and cosine similarity to match prompt intent against skill embeddings. It is a shadow-only lane (weight 0.05, live=false) used for observational purposes without affecting live ranking.

**Critical Facts:**
- Semantic shadow computes cosine similarity between prompt embedding and pre-computed skill embeddings, with a 0.2 threshold cutoff <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts" lines="10, 147-150" />
- The lane is shadow-only (shadowOnly=true) and does not contribute to live ranking despite being computed <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts" lines="154-161" />
- In test environments (VITEST=true), the lane falls back to token-overlap scoring when embeddings are unavailable <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts" lines="91-108" />

#### 5. GRAPH CAUSAL LANE
The graph causal lane propagates scores through the skill graph using edge types (enhances, siblings, depends_on, prerequisite_for, conflicts_with) with depth and breadth limits.

**Critical Facts:**
- Edge multipliers: enhances (0.55), siblings (0.35), depends_on (0.35), prerequisite_for (0.30), conflicts_with (-0.35) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts" lines="13-19" />
- Traversal uses BFS with maxDepth=2 and maxBreadth=4, decaying signal by 1/(depth+1) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts" lines="27-28, 70" />
- Negative contributions from conflicts_with edges are preserved through the emit filter to enable suppressive evidence <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts" lines="89-103" />

#### 6. EXPLICIT AUTHOR LANE
The explicit author lane uses curated TOKEN_BOOSTS and PHRASE_BOOSTS mappings for high-confidence skill routing, plus pattern-based disambiguation rules.

**Critical Facts:**
- Token boosts map single tokens to skill-specific scores (e.g., "git" → sk-code with 1.0, "readme" → sk-doc with 0.95) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts" lines="8-90" />
- Phrase boosts handle multi-word patterns (e.g., "deep research" → deep-research with 1.3, "chrome devtools" → mcp-chrome-devtools with 1.0) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts" lines="92-186" />
- Review-plus-write disambiguation applies +3.0 to sk-code and -2.0 to sk-code-review when both "review" and write verbs are present <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts" lines="230-245" />

#### 7. DERIVED GENERATED LANE
The derived generated lane scores against derivedTriggers and derivedKeywords from skill metadata, with age-policy haircut and affordance integration.

**Critical Facts:**
- Derived lane matches skill.derivedTriggers and affordance-derivedTriggers with phrase-specificity scoring (0.7x for direct, 0.45x for affordances) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/derived.ts" lines="38-53" />
- Age-policy haircut reduces derived lane scores based on projection age and skill lifecycle status <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/derived.ts" lines="54-61" />
- Derived demotion factor (skill.derivedDemotion) further scales scores before emission <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/derived.ts" line="66" />

#### 8. SCORE FUSION AND CONFIDENCE CALIBRATION
Fusion combines weighted lane contributions into a final score, then applies confidence assembly based on live normalization, direct evidence, and intent signals.

**Critical Facts:**
- Confidence assembly uses liveNormalized (score/liveTotal) as the primary ramp, with baseConstant (0.52) + liveNormalizedRampCoefficient (0.43) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts" lines="141-144" />
- Derived-dominant short-circuit pins confidence to 0.72 when derived lane dominates and directScore < 0.2 <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts" lines="146-147" />
- Task-intent floor (0.82) applies when directScore >= 0.18 or liveNormalized >= 0.2, with a dispersion guard against token-stuffing <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts" lines="149-156" />

#### 9. UNCERTAINTY AND AMBIGUITY DETECTION
Uncertainty is computed from evidence count and direct evidence, while ambiguity detection clusters candidates within 0.05 score/confidence margins.

**Critical Facts:**
- Uncertainty floors: no evidence (0.42), some evidence (0.30), medium evidence (0.22), high evidence (0.18) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts" lines="160-165" />
- Direct evidence discount (-0.06) applies when directScore >= 0.75, and low-confidence penalty (+0.08) applies when confidence < 0.8 <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts" lines="167-170" />
- Ambiguity cluster uses 0.05 margins for both score and confidence gaps, unioning the two conditions <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/ambiguity.ts" lines="7-8, 22-36" />

#### 10. PROMPT ISOLATION SAFETY
Lane attribution is safety-critical because it provides explainable routing without exposing raw prompt text in advisor metadata or outputs.

**Critical Facts:**
- Prompt-safety boundary requires that advisor metadata and lane attribution must not echo raw prompt text <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" line="124" />
- Attribution reason strings use lane identifiers and evidence labels (e.g., "lexical=0.85 (token:git; hint:worktree)") instead of quoting prompt text <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/attribution.ts" lines="13-24" />
- Evidence arrays contain structured labels (token:, hint:, phrase:, explicit:, author:, derived:, edge:) that reference match patterns rather than raw prompt substrings <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts" lines="66-77" />

ITER_014_COMPLETE: 30 findings, newInfoRatio=1.00
