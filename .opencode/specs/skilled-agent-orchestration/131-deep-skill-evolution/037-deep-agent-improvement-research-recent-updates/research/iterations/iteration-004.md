# RCAF DEEP RESEARCH — ITERATION 4 — deep-agent-improvement-specific gaps

## ROLE
Expert researcher identifying deep-agent-improvement-specific quality gaps that 117-122 patterns wouldn't surface. Find issues PARTICULAR to evaluator-first agent improvement semantics.

## CONTEXT

Iter 4 of 10. Prior:
- Iter-1: 36 patterns catalogued
- Iter-2: 8 APPLY / 2 ADAPT / 22 SKIP / 4 ALREADY-DONE; 3 P0 / 5 P1 / 2 P2
- Iter-3: 0/3 P0s confirmed (all reclassified to P1); 3/4 ALREADY-DONE confirmed

Cumulative uplift queue (post-adjudication): ~0 P0 / ~8 P1 (5 + 3 reclassified) / ~2 P2.

## ACTION

This iter pivots: **what does deep-agent-improvement need that 117-122 audits wouldn't catch?**

Agent-improvement-specific surfaces:
- 5-dimensional scoring rubric
- Dynamic profiling (per-task agent profile selection)
- Packet-local candidate proposals
- Guarded promotion (acceptance gates before agent definition lands)
- Evaluator-first design (eval before mutate)

## Step 1: Read deep-agent-improvement skill end-to-end

**Files analyzed:**
- `.opencode/skills/deep-agent-improvement/SKILL.md` (481 lines)
- `.opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs` (463 lines)
- `.opencode/skills/deep-agent-improvement/scripts/generate-profile.cjs` (260 lines)
- `.opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs` (188 lines)
- `.opencode/skills/deep-agent-improvement/references/evaluator_contract.md`
- `.opencode/skills/deep-agent-improvement/references/promotion_rules.md`
- `.opencode/skills/deep-agent-improvement/assets/improvement_config.json`

**Key findings from code analysis:**

### 5-dimension scoring implementation
- **Location**: `score-candidate.cjs` lines 94-100 (hardcoded weights), `improvement_config.json` lines 47-53 (config weights)
- **Mechanism**: Deterministic scoring via regex, string matching, file existence checks
- **Issue**: Weights are hardcoded in two places with potential drift. `--weights` override exists but no drift detection
- **Evidence**: Lines 94-100 in score-candidate.cjs show `DIMENSION_WEIGHTS` constant; config shows same values but no sync mechanism

### Dynamic profiling
- **Location**: `generate-profile.cjs` (260 lines)
- **Mechanism**: Derives profile from agent's own structure, rules, permissions on-the-fly
- **Issue**: No profile versioning. If agent structure changes, old scores claim new-rubric semantics
- **Evidence**: Line 225 shows `generatedAt: new Date().toISOString()` but no schema version or rubric version

### Guarded promotion gates
- **Location**: `promote-candidate.cjs` lines 96-164
- **Mechanism**: Multiple hardcoded checks (proposalOnly, promotionEnabled, benchmark status, repeatability, delta threshold)
- **Issue**: Threshold values scattered across config files, not centrally codified per-dimension
- **Evidence**: Line 92: `const threshold = Number(config?.scoring?.thresholdDelta || 1)` - fallback to magic number

### Evaluator-first timing
- **Location**: YAML workflow `improve_deep-agent-improvement_auto.yaml` steps 163-168
- **Mechanism**: Score candidate before promotion
- **Issue**: No explicit timing verification that evaluation completed before mutation proposal
- **Evidence**: Workflow steps are sequential but no timestamp-based ordering verification

## Step 2: Identify gaps the recent-arc patterns don't address

**Agent-improvement-specific gaps identified:**

1. **Runtime mirror sync drift** - Agents exist across 4 runtimes (.opencode, .claude, .gemini, .codex). Promotion to canonical .opencode agent doesn't auto-sync mirrors. This is agent-improvement-specific because promotion is a guarded gate unique to this skill.

2. **Promotion threshold drift** - Gate values (thresholdDelta, minimumAggregateScore, minimumFixtureScore) are in config but not codified per-dimension with version tracking. 117-122 audits check for config files but wouldn't detect threshold value drift over time.

3. **Cross-packet candidate deduplication** - Similar improvement proposals across different spec packets can accumulate. Mutation signature dedup exists (mutation-coverage.json) but is packet-local only.

4. **Profile selection accuracy** - Dynamic profile generation is deterministic but there's no validation that the generated profile actually matches the agent's intended behavior pattern.

5. **Scoring rubric drift** - 5-dimension definitions could change but scores from old runs would claim new-rubric semantics without version tracking.

6. **Cross-runtime A/B validation** - Improvement validated on one runtime (e.g., Claude) but not on others (Codex, Gemini, OpenCode).

## Step 3: Sample-check past agent improvement runs

**Sample analyzed:** `.opencode/specs/skilled-agent-orchestration/z_archive/061-agent-optimization/002-agent-debug/improvement/`

**Findings:**
- `experiment-registry.json` shows empty dimension scores arrays for dynamic profile (lines 147-152)
- All scores were 100/100 with delta 0, suggesting either perfect agents or scoring saturation
- Registry shows `dimensionScores: { structural: [], ruleCoherence: [], integration: [], outputQuality: [], systemFitness: [] }` - data quality issue
- This indicates the 5-dim scoring may not be populating correctly in all cases

## Step 4: Compare deep-agent-improvement skill structure vs peers

**Comparison with deep-loop-runtime and deep-research:**

| Surface | deep-agent-improvement | deep-loop-runtime | deep-research |
|---------|----------------------|-------------------|---------------|
| feature_catalog/ | ✅ 13 files | ✅ 18 files | ✅ 15 files |
| manual_testing_playbook/ | ✅ 34 files | ✅ 17 files | ✅ 33 files |
| references/ | ✅ 10 files | ✅ (not applicable) | ✅ (not applicable) |
| assets/ | ✅ 8 files | ✅ (not applicable) | ✅ (not applicable) |
| scripts/ | ✅ 16 files + tests | ✅ (integrated) | ✅ (integrated) |

**Conclusion:** deep-agent-improvement matches the post-118 canonical companion set structure. It has feature_catalog/ and manual_testing_playbook/ at appropriate depth.

## Step 5: Findings summary

**DAI-001: Runtime mirror sync drift (P1)**
- Scope: Promotion workflow
- File: `scripts/promote-candidate.cjs`
- Evidence: Line 171 only copies to canonical target, no mirror sync
- Fix: Add post-promotion mirror sync step or emit warning about manual sync required

**DAI-002: Promotion threshold drift (P2)**
- Scope: Config management
- File: `assets/improvement_config.json`, `scripts/promote-candidate.cjs`
- Evidence: Threshold values scattered, no version tracking
- Fix: Centralize threshold definitions with schema versioning

**DAI-003: Cross-packet candidate deduplication (P2)**
- Scope: Mutation coverage tracking
- File: `scripts/mutation-coverage.cjs`
- Evidence: Dedup is packet-local via mutation-coverage.json, no cross-packet registry
- Fix: Add optional global dedup registry or emit cross-packet similarity warnings

**DAI-004: Profile selection accuracy validation (P1)**
- Scope: Dynamic profiling
- File: `scripts/generate-profile.cjs`
- Evidence: No validation that generated profile matches agent behavior pattern
- Fix: Add profile sanity checks (e.g., rule count ranges, integration point expectations)

**DAI-005: Scoring rubric version tracking (P1)**
- Scope: Scoring system
- File: `scripts/score-candidate.cjs`, `assets/improvement_config.json`
- Evidence: No rubric version in score output, old scores claim new semantics
- Fix: Add rubricVersion field to score output, reject comparisons across versions

**DAI-006: Dimension score data quality (P1)**
- Scope: State management
- File: Sample run showed empty dimension arrays
- Evidence: `experiment-registry.json` lines 147-152 show empty arrays despite scoring
- Fix: Add reducer validation that dimension scores are populated before accepting results

**DAI-007: Cross-runtime A/B validation gap (P2)**
- Scope: Validation methodology
- File: Not addressed in current implementation
- Evidence: No cross-runtime validation in promotion gates
- Fix: Add optional cross-runtime validation step or document single-runtime limitation

## Iteration Summary

**Total findings:** 7
- P1: 4 (DAI-001, DAI-004, DAI-005, DAI-006)
- P2: 3 (DAI-002, DAI-003, DAI-007)

**Key insight:** The agent-improvement-specific gaps cluster around:
1. Promotion workflow completeness (mirror sync)
2. Scoring reproducibility over time (rubric versioning)
3. Data quality validation (dimension population)
4. Profile generation accuracy

These are distinct from 117-122 audit patterns which focus on general code quality, documentation, and testing infrastructure.
