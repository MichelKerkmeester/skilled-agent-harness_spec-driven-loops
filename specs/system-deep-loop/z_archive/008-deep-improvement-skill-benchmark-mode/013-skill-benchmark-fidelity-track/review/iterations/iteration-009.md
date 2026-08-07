# Iteration 009 — Traceability (Deep)

**Dimension:** traceability (deep)
**Iteration:** 9 of 10
**Prior findings:** P0=0 P1=6 P2=20

---

## Files Reviewed

- `SKILL.md:1-543` (full read — router pseudocode, §4 Lane B, §7 contracts, §11 scripts)
- `scripts/skill-benchmark/d4-ablation.cjs:1-245` (D4/D4-R instrument)
- `scripts/skill-benchmark/score-skill-benchmark.cjs:1-351` (Lane C scorer)
- `scripts/skill-benchmark/build-report.cjs:1-172` (report renderer)
- `scripts/skill-benchmark/live-executor.cjs:1-263` (Mode B executor)
- `scripts/skill-benchmark/run-skill-benchmark.cjs:1-293` (Lane C orchestrator)
- `scripts/model-benchmark/dispatch-model.cjs:1-666` (model-agnostic dispatcher)
- `scripts/model-benchmark/sweep-benchmark.cjs:1-651` (matrix expander/scorer)
- `scripts/model-benchmark/scorer/grader/prompts/system-grader-task-outcome.md:1-45` (D4-R rubric)
- `changelog/v1.11.0.0.md:1-41` (release notes)
- `README.md:1-363` (main readme)
- `references/` directory listing (via glob)
- `scripts/model-benchmark/tests/*.vitest.ts` listing (via glob)

---

## Findings by Severity

### P0

None.

### P1

#### R9-P1-001: Smart router pseudocode missing SKILL_BENCHMARK runtime_assets branch

**File:** `SKILL.md:216-222`
**Claim:** The router pseudocode in §2 is the "authoritative routing logic" (line 105). `RUNTIME_ASSETS` defines a `SKILL_BENCHMARK` entry at line 146 (`assets/skill-benchmark/default_profile.json`), but `route_recursive_agent_resources()` only extends `runtime_assets` for `MODEL_BENCHMARK` (lines 217-218). There is no corresponding `if "SKILL_BENCHMARK" in intents` branch.
**Evidence:**
- `SKILL.md:146` — `RUNTIME_ASSETS = { ... "SKILL_BENCHMARK": ["assets/skill-benchmark/default_profile.json"] }`
- `SKILL.md:217-218` — `if "MODEL_BENCHMARK" in intents: runtime_assets.extend(RUNTIME_ASSETS.get("MODEL_BENCHMARK", []))` — no SKILL_BENCHMARK equivalent
**Impact:** Lane C invocations routed by the pseudocode will never load the default skill-benchmark profile into `runtime_assets`. Any downstream consumer relying on the pseudocode's output shape to discover available runtime assets will miss the Lane C profile. The actual CJS orchestrator (`run-skill-benchmark.cjs`) handles this independently, so the runtime behavior is unaffected — but the documented "authoritative" pseudocode is inaccurate.
**Fix:** Add `if "SKILL_BENCHMARK" in intents: runtime_assets.extend(RUNTIME_ASSETS.get("SKILL_BENCHMARK", []))` after line 218.

#### R9-P1-002: §11 script list incomplete — 6 scripts missing

**File:** `SKILL.md:541`
**Claim:** §11 lists 14 scripts as the authoritative script inventory. The actual skill contains 20 `.cjs` scripts (verified via glob). Missing from the list:
1. `scripts/skill-benchmark/d4-ablation.cjs`
2. `scripts/skill-benchmark/score-skill-benchmark.cjs`
3. `scripts/skill-benchmark/build-report.cjs`
4. `scripts/skill-benchmark/live-executor.cjs`
5. `scripts/skill-benchmark/run-skill-benchmark.cjs`
6. `scripts/model-benchmark/sweep-benchmark.cjs`

**Evidence:**
- `SKILL.md:541` — lists 14 scripts, none from `scripts/skill-benchmark/` and no `sweep-benchmark.cjs`
- Glob of `scripts/skill-benchmark/*.cjs` returns 5 files
- `scripts/model-benchmark/sweep-benchmark.cjs` exists (651 lines, fully implemented)
**Impact:** Operators and automated tooling relying on §11 to discover available scripts will miss the entire Lane C script surface and the Lane B sweep expander. This is the primary script-discovery reference for the skill.
**Fix:** Add the 6 missing scripts to the §11 list. The Lane C scripts should be grouped under `scripts/skill-benchmark/` (5 scripts) and `sweep-benchmark.cjs` added to the `scripts/model-benchmark/` group.

### P2

#### R9-P2-021: README §4 structure block shows 3 script groups but omits skill-benchmark/

**File:** `README.md:178-183`
**Claim:** The structure tree shows `scripts/` split into `agent-improvement/`, `model-benchmark/`, and `shared/` — but omits `skill-benchmark/` entirely. The text says "16 helpers" (line 178), which matches agent-improvement(8) + model-benchmark(2) + shared(6), but the actual count is 20+ when including `skill-benchmark/(5)` and `model-benchmark/scorer/` subtree.
**Evidence:**
- `README.md:178-183` — tree shows 3 script subdirs, not 4
- Glob confirms `scripts/skill-benchmark/` exists with 5+ files
**Impact:** README structure overview is misleading for operators browsing the skill tree. The `scripts/skill-benchmark/` directory is the largest Lane C surface and is invisible in the README structure.
**Fix:** Add `+-- skill-benchmark/ # Lane C (5): d4-ablation, score, build-report, live-executor, run-skill-benchmark` to the tree, update helper count to 21.

#### R9-P2-022: README references table lists only 14 references; omits skill-benchmark group

**File:** `README.md:186-205`
**Claim:** "References (14, grouped by lane)" and the table lists 14 entries. The actual `references/` directory contains `agent-improvement/` (6), `model-benchmark/` (3), `shared/` (5), and `skill-benchmark/` (3: `operator_guide.md`, `scoring_contract.md`, `scenario_authoring.md`) = 17 total. The 3 skill-benchmark references are absent from the table.
**Evidence:**
- `README.md:186` — "References (14, grouped by lane)"
- SKILL.md `RESOURCE_MAP` at line 139 references all 3 skill-benchmark docs
- Glob confirms 3 `.md` files under `references/skill-benchmark/`
**Impact:** Lane C reference discovery via README is incomplete. Operators looking for Lane C guidance from the README will not find `operator_guide.md`, `scoring_contract.md`, or `scenario_authoring.md`.
**Fix:** Add the 3 skill-benchmark references to the table and update count to 17.

#### R9-P2-023: README scripts table omits all skill-benchmark scripts and sweep-benchmark

**File:** `README.md:207-230`
**Claim:** The scripts table lists 16 entries. Missing: `d4-ablation.cjs`, `score-skill-benchmark.cjs`, `build-report.cjs`, `live-executor.cjs`, `run-skill-benchmark.cjs` (all Lane C), and `sweep-benchmark.cjs` (Lane B). The table also omits shared scripts like `loop-host.cjs`, `reduce-state.cjs`, etc. that are listed in SKILL.md §11.
**Evidence:**
- `README.md:207-230` — table has 16 rows, none from `scripts/skill-benchmark/`
- SKILL.md §11 (line 541) lists more scripts than the README table
**Impact:** The README scripts table is the secondary script-discovery reference after §11. Missing Lane C scripts means operators cannot discover them from the README.
**Fix:** Add the missing scripts to the table, grouped by lane, and update the count.

#### R9-P2-024: README trigger_phrases incomplete vs SKILL.md triggers

**File:** `README.md:4-11`
**Claim:** README frontmatter lists 6 `trigger_phrases`. SKILL.md frontmatter (lines 7-14) lists 9 triggers. Missing from README: `model-benchmark mode`, `benchmark a model or prompt framework`, `skill-benchmark`.
**Evidence:**
- `README.md:4-11` — 6 trigger phrases
- `SKILL.md:7-14` — 9 triggers including Lane B/C activation keywords
**Impact:** Skill advisor matching relies on trigger phrases. If README trigger_phrases are used for discovery (some tooling reads README frontmatter), Lane B/C triggers will be missed.
**Fix:** Add the 3 missing trigger phrases to README frontmatter to match SKILL.md.

#### R9-P2-025: changelog/v1.11.0.0.md does not specify D4-R live scenario count in "What Changed"

**File:** `changelog/v1.11.0.0.md:30`
**Claim:** The "Result" section says D4-R ran on "five routine sk-code scenarios" and lists them. But the `DEFAULT_D4R_SCENARIOS` constant in `run-skill-benchmark.cjs:226` is `['LS-001', 'LS-002', 'LS-003', 'LS-004', 'SD-002']` — these are the same 5 scenarios. The changelog does not mention that these are the hardcoded defaults, which means an operator running `--d4` without `--d4-scenarios` will get exactly these 5. This is a minor traceability gap: the changelog describes a specific run but does not link it to the code constant that produced it.
**Evidence:**
- `changelog/v1.11.0.0.md:30` — "five routine sk-code scenarios (gpt-5.5-fast on/off, claude-sonnet grader)"
- `run-skill-benchmark.cjs:226` — `const DEFAULT_D4R_SCENARIOS = ['LS-001', 'LS-002', 'LS-003', 'LS-004', 'SD-002'];`
**Impact:** Minimal — the 5 scenarios are verifiable from the code. But an operator reading the changelog cannot tell whether these are configurable or hardcoded.
**Fix:** Optional — mention that these are the `DEFAULT_D4R_SCENARIOS` defaults in the changelog "Result" section.

---

## Traceability Checks

| Check | Status | Detail |
|-------|--------|--------|
| SKILL.md router pseudocode vs runtime code | PARTIAL | Pseudocode missing SKILL_BENCHMARK runtime_assets branch (P1) |
| SKILL.md §11 scripts vs actual scripts | FAIL | 6 of 20 scripts missing from the list (P1) |
| changelog D4-R claims vs d4-ablation.cjs | PASS | `runD4RAblation`, `gradeTaskOutcome`, contamination guard all match |
| changelog advisorySignals vs score-skill-benchmark.cjs | PASS | `advisorySignals` block with `D4_task_outcome` + `assetRecall` confirmed |
| changelog deferred-asset lane vs code | PASS | `assetRecall` scored separately, `observedResources` excludes assets |
| system-grader-task-outcome.md rubric vs changelog | PASS | 4 axes (correctness 0.40, verification 0.25, focus 0.20, hallucination 0.15) match |
| D4-R score formula in d4-ablation.cjs vs changelog | PASS | `0.5 + (onScore - offScore) / 2` matches changelog description |
| README structure vs actual directory tree | FAIL | Missing `skill-benchmark/` in scripts tree (P2) |
| README references count vs actual | FAIL | 14 listed vs 17 actual; 3 skill-benchmark refs missing (P2) |
| README trigger_phrases vs SKILL.md triggers | FAIL | 6 vs 9; 3 Lane B/C triggers missing (P2) |
| README scripts table vs actual | FAIL | 16 listed vs 20+ actual; skill-benchmark scripts missing (P2) |
| dispatch-model.cjs executor map vs SKILL.md §4 | PASS | 5 executors (cli-opencode, cli-claude-code, cli-codex, cli-gemini, cli-devin) match §4 |
| sweep-benchmark.cjs cartesian expansion vs §4 | PASS | models[] x variants[] x frameworks[] x fixtures matches documented "same loop shape" |
| 5-dimension weights in score-skill-benchmark.cjs vs SKILL.md | PASS | D1=25, D2=20, D3=15, D4=25, D5=15 match converged weights |
| run-skill-benchmark.cjs --d4 gate vs changelog | PASS | `--d4` requires `--trace-mode live` matches changelog "opt-in, live only" |
| D4-R DEFAULT_D4R_SCENARIOS vs changelog result | PASS | 5 scenarios match; minor gap in linking code constant to changelog |

---

## Verdict

**CONDITIONAL** — No P0 findings. Two P1 traceability gaps in SKILL.md (router pseudocode missing SKILL_BENCHMARK branch; §11 script list incomplete). Five P2 gaps in README (structure, references, scripts, triggers) and changelog (scenario constant linkage). The P1s are documentation-only; runtime behavior is unaffected because the CJS scripts handle Lane C correctly. However, the documented "authoritative" pseudocode and script inventory are inaccurate.

---

## Next Dimension

correctness (revisit for any new evidence from this iteration's findings)
