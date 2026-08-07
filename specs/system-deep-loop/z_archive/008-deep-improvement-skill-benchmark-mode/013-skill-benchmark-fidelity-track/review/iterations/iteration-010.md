# Iteration 010 — Cross-Cutting + Residual

**Focus:** cross-cutting + residual (final iteration)
**Prior cumulative:** P0=0, P1=8, P2=25

---

## Dimension

Cross-cutting: issues that span multiple files or affect the system as a whole. Residual: anything not caught by the prior 9 iterations covering inventory+correctness, correctness, maintainability, security, and traceability.

## Files Reviewed

- `SKILL.md:1-543`
- `README.md:1-363`
- `changelog/v1.11.0.0.md:1-41`
- `references/skill-benchmark/scoring_contract.md:1-55`
- `scripts/skill-benchmark/d4-ablation.cjs:1-245`
- `scripts/skill-benchmark/score-skill-benchmark.cjs:1-351`
- `scripts/skill-benchmark/build-report.cjs:1-172`
- `scripts/skill-benchmark/live-executor.cjs:1-263`
- `scripts/skill-benchmark/run-skill-benchmark.cjs:1-293`
- `scripts/skill-benchmark/executor-dispatch.cjs:1-123`
- `scripts/skill-benchmark/router-replay.cjs:1-50`
- `scripts/skill-benchmark/d5-connectivity.cjs:1-50`
- `scripts/model-benchmark/dispatch-model.cjs:1-666`
- `scripts/model-benchmark/sweep-benchmark.cjs:1-651`
- `scripts/model-benchmark/scorer/grader/prompts/system-grader-task-outcome.md:1-45`

## Findings by Severity

### P0

None.

### P1

#### R10-P1-001: Scoring contract funnel stages are incomplete vs implementation

**File:** `references/skill-benchmark/scoring_contract.md:55` vs `scripts/skill-benchmark/score-skill-benchmark.cjs:172-177`

**Claim:** The scoring contract states `firstFailingStage ∈ {router-unparseable, routed-intra, discovered}`. The implementation adds two additional stages not documented in the contract: `activated-inter` (line 173) and `surface-mismatch` (line 175). The contract's `remediation_taxonomy.json` mapping also does not cover these stages.

**Impact:** Operators consulting the contract will not understand two of the five possible funnel outcomes. The contract is supposed to be the authoritative source but is stale relative to the code.

**Fix:** Update `scoring_contract.md` §6 to list all five stages: `{activated-inter, router-unparseable, surface-mismatch, routed-intra, discovered}`.

#### R10-P1-002: README.md scripts table undercounts by 1

**File:** `README.md:178,207-231`

**Claim:** The structure section header at line 178 says `scripts/` contains "16 helpers + lib/ + tests/" and the scripts section header at line 207 says "16 + lib, grouped by lane". The table at lines 209-231 actually lists 17 script entries (8 agent-improvement + 3 model-benchmark + 6 shared = 17), not 16. The `skill-benchmark/` subdirectory with 15 scripts is also not represented in the table at all.

**Impact:** Operators relying on the README for a script inventory will miss entries. The table omits the entire Lane C script tree.

**Fix:** Update the count to 17 (or more if skill-benchmark scripts are included) and consider adding a row for `skill-benchmark/` scripts.

### P2

#### R10-P2-001: README.md references table undercounts by 1

**File:** `README.md:173,186-205`

**Claim:** The structure section at line 173 says "References (14, grouped by lane)" and the table at lines 186-205 lists 14 rows. However, the structure breakdown says `references/agent-improvement/` (6) + `references/model-benchmark/` (3) + `references/shared/` (5) = 14, but `references/skill-benchmark/` (3 files: operator_guide, scoring_contract, scenario_authoring) is not listed in the structure section or the table.

**Impact:** The 14 count matches only because the skill-benchmark references are omitted, but the actual reference count on disk is 17 (6+3+5+3). Minor documentation inconsistency.

#### R10-P2-002: live-executor surface-valid list is an undocumented hard-coded allowlist

**File:** `scripts/skill-benchmark/live-executor.cjs:199`

**Claim:** The `statedSurface` assignment validates against `['WEBFLOW', 'OPENCODE', 'UNKNOWN', 'MOTION_DEV', 'NONE']`. This allowlist is not documented in the scoring contract, the README, or any reference doc. Adding a new surface requires editing this line; there is no test that asserts the allowlist matches the set of surfaces the skill's router supports.

**Impact:** If a new surface is added to the target skill's router but not to this allowlist, live-mode scenarios will silently report `statedSurface: null`, causing D1-intra surface-mismatch checks to be skipped.

#### R10-P2-003: DEFAULT_D4R_SCENARIOS is a maintenance trap

**File:** `scripts/skill-benchmark/run-skill-benchmark.cjs:226`

**Claim:** The `DEFAULT_D4R_SCENARIOS` array hardcodes `['LS-001', 'LS-002', 'LS-003', 'LS-004', 'SD-002']`. These scenario IDs must exist in the playbook. If any are renamed or removed, `augmentWithD4R` silently skips them with no warning — the report just shows fewer scored rows than expected.

**Impact:** Silent degradation of D4-R coverage when scenario IDs change.

#### R10-P2-004: README "What Changes With This Skill" table oversimplifies

**File:** `README.md:43-49`

**Claim:** Row "Only hand-profiled agents can be evaluated" → "Any agent in `.opencode/agents/` is evaluated through dynamic profiling" is an overstatement. Agents must have ALWAYS/NEVER/ESCALATE-IF rules and standard sections to produce meaningful profiles; agents without these get trivially low scores. The FAQ at line 331 is more precise: "Derives scoring checks from the agent's own ALWAYS/NEVER rules."

**Impact:** Minor — sets an expectation that any `.md` file works well.

#### R10-P2-005: D3 negative-activation coupling diverges from D2 semantics

**File:** `scripts/skill-benchmark/score-skill-benchmark.cjs:136-137`

**Claim:** For negative scenarios, D3 is explicitly set to `dims.d1intra.score`, coupling it to D1-intra. But D2 for negative scenarios is also `dims.d1intra.score` (line 121). This means D2 and D3 are always identical for negative scenarios, making D3 redundant signal — both dimensions carry the same number.

**Impact:** Minor measurement redundancy. Negative scenarios contribute no unique D3 signal beyond what D2 already provides.

#### R10-P2-006: scoring_contract.md §6 references nonexistent remediation_taxonomy.json

**File:** `references/skill-benchmark/scoring_contract.md:55`

**Claim:** The last line says bottlenecks are "mapped through `assets/skill-benchmark/remediation_taxonomy.json` to (file, locus, one-line fix, handoff lane)". This file does not exist in the assets directory. The build-report.cjs bottlenecks table (lines 100-108) renders severity/class/locus/detail directly from the report object without any taxonomy file lookup.

**Impact:** The contract references a nonexistent artifact. Operators looking for the taxonomy file will not find it.

## Traceability Checks

| Claim | Source | Code Match |
|-------|--------|------------|
| D4-R is advisory, not in weighted aggregate | changelog:24, scoring_contract:46 | ✅ score-skill-benchmark.cjs:324-331 |
| D4 stays unscored-mode-a | scoring_contract:21 | ✅ score-skill-benchmark.cjs:320 |
| schemaVersion preserved at v1 | changelog:24 | ✅ score-skill-benchmark.cjs:304 |
| assetRecall scored on own lane | changelog:16 | ✅ score-skill-benchmark.cjs:148-156 |
| Surface valid list matches router | SKILL.md:199 (live-executor) | ⚠️ Undocumented allowlist |
| Funnel stages documented | scoring_contract:55 | ❌ Missing 2 stages |
| Script count 16 | README:178 | ❌ Actual: 17+ |

## Verdict

**CONDITIONAL** — No P0 findings. Two P1 documentation-code mismatches remain (scoring contract funnel stages, README script count). These are traceability gaps that could mislead operators but do not break functionality.

## Next Dimension

None — this is iteration 10 of 10 (final). Review is complete.
