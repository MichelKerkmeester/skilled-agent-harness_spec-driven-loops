# Iter 005 — references/advisor-scorer.md vs scorer source code drift

## Question

Does .opencode/skills/system-skill-advisor/references/advisor-scorer.md accurately describe the 5-lane scorer in mcp_server/lib/scorer/? Where are weight values, lane names, and attribution mechanics drifted?

## Evidence (file:line citations required)

**Evidence 1: Lane weight table comparison**
- Documentation lane weight table: explicit_author 0.42, lexical 0.28, graph_causal 0.13, derived_generated 0.12, semantic_shadow 0.05 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/advisor-scorer.md" lines="34-40" />
- Source code lane-registry.ts SCORER_LANE_REGISTRY: explicit_author weight 0.42, lexical weight 0.28, graph_causal weight 0.13, derived_generated weight 0.12, semantic_shadow weight 0.05 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts" lines="7-12" />
- Grep for weight patterns in scorer directory found exact matches for 0.42, 0.28, 0.13, 0.12, 0.05 in lane-registry.ts <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts" lines="8-12" />
- All lane weights match exactly between documentation and source code

**Evidence 2: Shadow weight field omission in documentation**
- Source code lane-registry.ts defines shadowWeight field for each lane: explicit_author shadowWeight 0.40, lexical shadowWeight 0.25, graph_causal shadowWeight 0.20, derived_generated shadowWeight 0.10, semantic_shadow shadowWeight 0.05 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts" lines="8-12" />
- Documentation lane weight table only shows single "Weight" column, not separate "Weight" and "shadowWeight" columns <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/advisor-scorer.md" lines="34-40" />
- Documentation mentions "shadowOnly=true" for semantic_shadow lane but doesn't explain shadowWeight mechanics <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/advisor-scorer.md" line="62" />
- Source code exports DEFAULT_SHADOW_SCORER_LANE_WEIGHTS separately from DEFAULT_SCORER_LANE_WEIGHTS <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts" lines="32-38" />

**Evidence 3: Derived-dominant check mechanics**
- Documentation states: "The derived-dominant check fires when derived lane evidence exceeds combined explicit and lexical evidence, triggering a confidence ceiling" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/advisor-scorer.md" line="42" />
- Source code attribution.ts isDerivedDominant() checks if derived_generated is dominant lane AND derived weightedScore >= combined explicit_author + lexical weightedScore <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/attribution.ts" lines="26-34" />
- Documentation references attribution.ts:26-34 which contains the exact implementation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/advisor-scorer.md" line="42" />
- Derived-dominant mechanics match exactly between documentation and source code

**Evidence 4: Lexical lane category hints boost value**
- Documentation states: "The phrase `deep research` maps to the deep-research skill with a 0.38 boost" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/advisor-scorer.md" line="53" />
- Source code lexical.ts CATEGORY_HINTS maps 'deep-research' to ['deep research', 'research loop', ...] and applies 0.38 boost on phrase boundary match <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts" lines="25-37, 66-70" />
- Source code lexical.ts line 68: `score += 0.38` when category hint matches phrase boundary <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts" line="68" />
- Category hint boost value matches exactly between documentation and source code

**Evidence 5: Semantic shadow lane shadowOnly flag**
- Documentation states: "The lane carries `shadowOnly=true` and weight 0.05 so it does not affect live ranking" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/advisor-scorer.md" line="62" />
- Source code lane-registry.ts semantic_shadow entry has `live: true` but documentation claims it carries shadowOnly=true <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts" line="12" />
- Source code fusion.ts calculates shadowOnly from `!isLiveScorerLane(lane)` not from lane-registry live field <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts" line="329" />
- Documentation describes semantic_shadow as "shadow only" but source code marks it as `live: true` in registry <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts" line="12" />

**Evidence 6: Confidence calibration constants coverage**
- Documentation mentions confidence assembly uses `baseConstant=0.52` plus `liveNormalizedRampCoefficient=0.43` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/advisor-scorer.md" line="106" />
- Source code scoring-constants.ts defines 16 confidence calibration constants including baseConstant, liveNormalizedRampGain, liveNormalizedRampCoefficient, readOnlyExplainerFloor, readOnlyRouteAllowedFloor, derivedDominantConfidence, derivedDominantDirectScoreCeiling, deepResearchCycleSkillConfidence, deepResearchCycleLiveNormalizedFloor, taskIntentDirectScoreFloor, taskIntentLiveNormalizedFloor, taskIntentFloor, directScoreLiftThreshold, directScoreFloor, directScoreBonusThreshold, directScoreBonus, hardCeiling <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts" lines="139-158" />
- Documentation only mentions 2 of 16 confidence constants, missing readOnlyExplainerFloor, liveNormalizedRampGain, derivedDominantConfidence, taskIntentFloor, directScoreFloor, hardCeiling, and others <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/advisor-scorer.md" line="106" />
- Documentation coverage of confidence calibration constants is incomplete

**Evidence 7: Attribution reason format**
- Documentation states: "Attribution reason strings use lane identifiers and evidence labels (e.g., `lexical=0.85 (token:git; hint:worktree)`) instead of quoting prompt text" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/advisor-scorer.md" line="128" />
- Source code attribution.ts attributionReason() formats output as `${lane}${suffix}=${rawScore.toFixed(2)} (${evidence})` with evidence labels joined by semicolon <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/attribution.ts" lines="13-24" />
- Source code lexical.ts generates evidence labels as `token:${token}` and `hint:${hint}` format <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts" lines="66-77" />
- Attribution reason format matches exactly between documentation and source code

**Evidence 8: Prior iteration cross-reference**
- Iteration-001 focused on SKILL.md anchor coverage and smart-router conformance, not scorer documentation vs source code drift <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-001.md" lines="1-77" />
- Iteration-002 focused on README.md marketing voice gap audit, not scorer technical accuracy <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-002.md" lines="1-119" />
- Iteration-003 focused on ARCHITECTURE.md vs source code drift, verified lane weights match but did not examine shadowWeight field or confidence calibration constants <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-003.md" lines="15-19" />
- Iteration-004 focused on INSTALL_GUIDE.md command verification, not scorer documentation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-004.md" lines="1-112" />
- None of the prior iterations examined references/advisor-scorer.md or shadowWeight field omission

## Findings (numbered, severity-tagged P0|P1|P2, impact-ranked 1-10, sub-phase-targeted 002|003|004|005)

**Finding 1: Shadow weight field omitted from documentation (P1, impact-rank 7, sub-phase-target: 004)**
- Source code lane-registry.ts defines shadowWeight field for all 5 lanes with values: explicit_author 0.40, lexical 0.25, graph_causal 0.20, derived_generated 0.10, semantic_shadow 0.05 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts" lines="8-12" />
- Documentation lane weight table only shows single "Weight" column without mentioning shadowWeight field or separate shadow weight values <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/advisor-scorer.md" lines="34-40" />
- Source code exports DEFAULT_SHADOW_SCORER_LANE_WEIGHTS as separate constant object, indicating shadow weights are first-class configuration <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts" lines="32-38" />
- Documentation mentions "shadowOnly=true" for semantic_shadow but doesn't explain the shadowWeight mechanics or how shadow vs live weights are used <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/advisor-scorer.md" line="62" />
- Iteration-003 verified lane weights match but did not detect shadowWeight field omission <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-003.md" lines="77-81" />

**Finding 2: Confidence calibration constants coverage incomplete (P1, impact-rank 6, sub-phase-target: 004)**
- Source code scoring-constants.ts defines 16 confidence calibration constants in ConfidenceCalibration interface <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts" lines="17-64" />
- Documentation only mentions 2 constants: baseConstant=0.52 and liveNormalizedRampCoefficient=0.43 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/advisor-scorer.md" line="106" />
- Missing documented constants include: readOnlyExplainerFloor (0.25), liveNormalizedRampGain (1.25), readOnlyRouteAllowedFloor (0.82), derivedDominantConfidence (0.72), taskIntentFloor (0.82), directScoreFloor (0.82), hardCeiling (0.95), and 8 others <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts" lines="141-158" />
- Documentation describes derived-dominant short-circuit and task-intent floor but doesn't document the constant values that control these behaviors <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/advisor-scorer.md" lines="106-109" />
- Incomplete constant coverage makes it difficult for operators to understand confidence assembly tuning surface

**Finding 3: Semantic shadow lane live flag contradiction (P2, impact-rank 5, sub-phase-target: 004)**
- Documentation states semantic_shadow lane "carries `shadowOnly=true` and weight 0.05 so it does not affect live ranking" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/advisor-scorer.md" line="62" />
- Source code lane-registry.ts marks semantic_shadow as `live: true` in the registry entry <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts" line="12" />
- Source code fusion.ts calculates shadowOnly dynamically from `!isLiveScorerLane(lane)` which checks the live field in registry <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts" line="329" />
- Documentation describes semantic_shadow as "shadow only" but registry marks it as live, creating potential confusion about lane behavior <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts" line="12" />

**Finding 4: Lane weights and names accurate (P2, impact-rank 2, sub-phase-target: 004)**
- Documentation lane weight table: explicit_author 0.42, lexical 0.28, graph_causal 0.13, derived_generated 0.12, semantic_shadow 0.05 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/advisor-scorer.md" lines="34-40" />
- Source code lane-registry.ts weights match exactly <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts" lines="8-12" />
- Grep for lane name patterns found 12 matches in documentation confirming lane name usage <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/advisor-scorer.md" lines="36-42" />
- Lane weights sum to 1.0 in both documentation and source code <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts" lines="8-12" />
- Iteration-003 also verified lane weights match in ARCHITECTURE.md, confirming this is accurate across documentation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-003.md" lines="77-81" />

**Finding 5: Derived-dominant check mechanics accurate (P2, impact-rank 2, sub-phase-target: 004)**
- Documentation describes derived-dominant check as firing "when derived lane evidence exceeds combined explicit and lexical evidence" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/advisor-scorer.md" line="42" />
- Source code attribution.ts isDerivedDominant() implements exactly this logic: derived weightedScore >= combined explicit_author + lexical weightedScore <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/attribution.ts" lines="26-34" />
- Documentation correctly references attribution.ts:26-34 for the implementation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/advisor-scorer.md" line="42" />
- Mechanics match exactly between documentation and source code

**Finding 6: Lexical lane category hints accurate (P2, impact-rank 2, sub-phase-target: 004)**
- Documentation states "deep research" maps to deep-research skill with 0.38 boost <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/advisor-scorer.md" line="53" />
- Source code lexical.ts CATEGORY_HINTS maps 'deep-research' to ['deep research', 'research loop', ...] and applies 0.38 boost <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts" lines="25-37, 66-70" />
- Source code lexical.ts line 68 implements `score += 0.38` on category hint match <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts" line="68" />
- Category hint boost value and mechanics match exactly

**Finding 7: Attribution reason format accurate (P2, impact-rank 2, sub-phase-target: 004)**
- Documentation describes attribution reason format as `lexical=0.85 (token:git; hint:worktree)` with lane identifiers and evidence labels <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/advisor-scorer.md" line="128" />
- Source code attribution.ts attributionReason() formats output as `${lane}${suffix}=${rawScore.toFixed(2)} (${evidence})` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/attribution.ts" lines="13-24" />
- Source code lexical.ts generates evidence labels in `token:${token}` and `hint:${hint}` format <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts" lines="66-77" />
- Attribution reason format matches exactly between documentation and source code

## Gaps for next iter

1. **Gap 1**: Investigate how shadow weights are actually used in fusion logic to determine if the shadowWeight field is active or legacy configuration that should be documented or removed.

2. **Gap 2**: Determine if the semantic_shadow lane should be marked as `live: false` in lane-registry.ts to match the documentation's "shadow only" description, or if the documentation should be corrected to reflect the actual `live: true` setting.

3. **Gap 3**: Research whether the 14 missing confidence calibration constants should be documented in advisor-scorer.md or if they are intentionally omitted as implementation details not relevant to skill consumers.

4. **Gap 4**: Check if other scorer reference documentation (e.g., README.md in scorer directory) covers the shadowWeight field and confidence constants that advisor-scorer.md omits.

## JSONL delta row

```json
{"type":"iteration","iteration":5,"timestamp_utc":"2026-05-16T10:10:00Z","executor":"cli-devin","model":"swe-1.6","status":"complete","focus":"references/advisor-scorer.md vs scorer source code drift","findings_count":7,"gaps_count":4,"newInfoRatio":0.65,"primary_evidence_files":["/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/advisor-scorer.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/attribution.ts","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts"]}
```
