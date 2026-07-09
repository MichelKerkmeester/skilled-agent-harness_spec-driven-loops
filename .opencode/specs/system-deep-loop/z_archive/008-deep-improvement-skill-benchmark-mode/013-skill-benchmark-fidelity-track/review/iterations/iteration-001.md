# Iteration 001 — inventory+correctness

**Dimension:** inventory+correctness
**Prior findings:** P0=0 P1=0 P2=0 (across iterations 0)
**Session:** mimo-deepreview-013

---

## Files Reviewed

| File | Lines Inspected |
|------|----------------|
| `SKILL.md` | 1-543 (full) |
| `changelog/v1.11.0.0.md` | 1-41 (full) |
| `scripts/skill-benchmark/d4-ablation.cjs` | 1-245 (full) |
| `scripts/skill-benchmark/score-skill-benchmark.cjs` | 1-351 (full) |
| `scripts/skill-benchmark/build-report.cjs` | 1-172 (full) |
| `scripts/skill-benchmark/live-executor.cjs` | 1-263 (full) |
| `scripts/skill-benchmark/run-skill-benchmark.cjs` | 1-293 (full) |
| `scripts/model-benchmark/scorer/grader/harness.cjs` | 60-329 |
| `scripts/model-benchmark/scorer/grader/prompts/system-grader-task-outcome.md` | 1-45 (full) |
| `references/skill-benchmark/scoring_contract.md` | 1-55 (full) |

---

## Findings by Severity

### P1 (1 finding)

**R1-P1-001 — SKILL.md pseudocode omits SKILL_BENCHMARK runtime_assets extension**

- **File:line:** `SKILL.md:217-218`
- **Claim:** The Smart Router pseudocode extends `runtime_assets` only for `MODEL_BENCHMARK` intent, but `RUNTIME_ASSETS` (line 146) also defines a `SKILL_BENCHMARK` entry (`assets/skill-benchmark/default_profile.json`). The pseudocode is missing the equivalent `if "SKILL_BENCHMARK" in intents` block.
- **Evidence:**
  - Line 146: `RUNTIME_ASSETS` defines `"SKILL_BENCHMARK": ["assets/skill-benchmark/default_profile.json"]`
  - Lines 216-218: only `MODEL_BENCHMARK` is checked — no `SKILL_BENCHMARK` branch
- **Impact:** Any implementer following the pseudocode would fail to load the skill-benchmark default profile when Lane C is selected. The `run-skill-benchmark.cjs` orchestrator (which does not use this pseudocode) is unaffected, but the router contract documented in SKILL.md is incomplete.
- **Fix:** Add `if "SKILL_BENCHMARK" in intents: runtime_assets.extend(RUNTIME_ASSETS.get("SKILL_BENCHMARK", []))` after line 218.

### P2 (2 findings)

**R1-P2-001 — scoring_contract.md funnel stages incomplete vs code**

- **File:line:** `references/skill-benchmark/scoring_contract.md:54`
- **Claim:** The contract lists `firstFailingStage ∈ {router-unparseable, routed-intra, discovered}`, but the code in `score-skill-benchmark.cjs:172-177` defines six stages: `activated-inter`, `router-unparseable`, `surface-mismatch`, `routed-intra`, `discovered`, and `passed`. Three stages are missing from the documentation.
- **Impact:** Operators reading the contract cannot distinguish `activated-inter` (D1-inter advisor failure) or `surface-mismatch` (wrong surface detected) from the documented stages. The contract is the authoritative reference for the funnel.
- **Fix:** Update the contract to list all six stages with brief descriptions.

**R1-P2-002 — build-report advisorySignals section not documented in scoring_contract**

- **File:line:** `references/skill-benchmark/scoring_contract.md` (§5) vs `build-report.cjs:80-88`
- **Claim:** The scoring contract (§5) mentions `D4_task_outcome` and `assetRecall` advisory signals exist, but does not document that `build-report.cjs` renders a dedicated "Advisory signals (NOT in the weighted aggregate)" section in report.md. The rendering contract is implied but not explicit.
- **Impact:** Minor — the contract says enough for a reader to understand the signals exist and are advisory, but the exact markdown rendering is not documented.
- **Fix:** Add a brief note in §5 that `build-report.cjs` renders advisory signals under a dedicated heading.

---

## Traceability Checks

| Check | Status | Detail |
|-------|--------|--------|
| changelog v1.11.0.0 "D4-R separate instrument" vs code | ✅ PASS | `d4-ablation.cjs` exports `runD4RAblation`/`gradeTaskOutcome` separate from `runD4Ablation`/`gradeAblation`. Score formula `0.5 + (on−off)/2` matches changelog. |
| changelog "wired behind --d4 opt-in flag" vs code | ✅ PASS | `run-skill-benchmark.cjs:284` gates `augmentWithD4R` on `args.d4 && traceMode === 'live'`. |
| changelog "advisorySignals block not folded into aggregate" vs code | ✅ PASS | `score-skill-benchmark.cjs:324-331` places `D4_task_outcome` and `assetRecall` under `advisorySignals`, separate from `dimensionScores`. |
| changelog "schemaVersion: skill-benchmark-report.v1 preserved" vs code | ✅ PASS | `score-skill-benchmark.cjs:304` returns `schemaVersion: 'skill-benchmark-report.v1'`. |
| changelog "deferred-asset scoring lane" vs code | ✅ PASS | `live-executor.cjs:197,211` keeps `statedAssets`/`observedAssets` on a separate channel; `score-skill-benchmark.cjs:148-156` scores `assetRecall` independently. |
| grader task-outcome prompt path wiring | ✅ PASS | `d4-ablation.cjs:134-136` resolves `system-grader-task-outcome.md`; `harness.cjs:90-91,116-117` reads `system_prompt_path` override; `gradeTaskOutcome` (d4-ablation.cjs:189) passes it via `system_prompt_path`. |
| SKILL.md RUNTIME_ASSETS definition vs pseudocode | ⚠️ FAIL | `SKILL_BENCHMARK` defined in `RUNTIME_ASSETS` (line 146) but missing from pseudocode runtime_assets extension (lines 217-218). See P1-001. |

---

## Verdict

**CONDITIONAL** — No P0 findings. One P1 traceability gap (pseudocode incomplete for SKILL_BENCHMARK runtime_assets). Two P2 documentation accuracy issues. All D4-R instrument code, grader wiring, and changelog claims verified correct against the implementation.

---

## Next Dimension

**security** — Focus: env var injection in `runDispatch` (`extraEnv` merge), `MK_SKILL_ADVISOR_HOOK_DISABLED` guard, `DEEP_AGENT_ALLOW_CRITERIA_EXEC` gate, cache dir resolution, untrusted output delimiter in grader harness.
