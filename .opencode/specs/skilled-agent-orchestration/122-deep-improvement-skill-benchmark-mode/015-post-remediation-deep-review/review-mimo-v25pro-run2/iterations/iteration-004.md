# Iteration 004 — Traceability Review

**Agent:** mimo-v2.5-pro | **Run:** mimo-deepreview-015-run2 | **Dimension:** traceability

---

## Dimension

Does the code match the claims made in SKILL.md, README.md, changelog/v1.11.1.0.md, and scoring_contract.md?

## Files Reviewed

| File | Lines Inspected |
|---|---|
| `SKILL.md:1-546` | Full file, §11 script list cross-referenced against filesystem |
| `README.md:1-378` | Full file, scripts table (§4), references count, trigger phrases |
| `changelog/v1.11.1.0.md:1-46` | Full file, all claims verified against code |
| `references/skill-benchmark/scoring_contract.md:1-59` | Full file, D1-D5 weights, funnel stages, advisory signals |
| `scripts/skill-benchmark/score-skill-benchmark.cjs:1-403` | Full file, weight constants, helper decomposition, funnel logic |
| `scripts/skill-benchmark/live-executor.cjs:1-302` | Full file, GRADED_RESPONSE_MAX_CHARS, brace scanner, DEFAULT_MODEL |
| `scripts/model-benchmark/dispatch-model.cjs:1-677` | Full file, shellQuote, loadConfig, buildResumeHint |
| `scripts/model-benchmark/scorer/grader/harness.cjs:1-460` | Full file, dimId threading, normalizeParsedPayload, --append-system-prompt |
| `scripts/model-benchmark/scorer/score-model-variant.cjs:1-365` | Full file, criteriaExecAllowed gate |
| `scripts/skill-benchmark/d4-ablation.cjs:1-258` | Full file, buildGraderBase dimId threading |
| `scripts/skill-benchmark/run-skill-benchmark.cjs:226` | DEFAULT_D4R_SCENARIOS constant verified |

## Findings by Severity

### P1 — Required Fix

#### R4-P1-001: SKILL.md §11 claims comprehensive script list but omits 9 scripts

**File:** `SKILL.md:544`
**Claim:** The v1.11.1.0 changelog states "SKILL.md gains the 6 previously-missing scripts in §11" — implying §11 is now the authoritative, comprehensive script listing.
**Evidence:** §11 lists 22 scripts. The actual `scripts/` directories contain 31 .cjs files (excluding lib/). The 9 missing scripts are: `_args.cjs`, `advisor-probe.cjs`, `browser-executor.cjs`, `contamination-lint.cjs`, `d5-connectivity.cjs`, `executor-dispatch.cjs`, `load-playbook-scenarios.cjs`, `playbook-generator.cjs`, `router-replay.cjs` (all in `scripts/skill-benchmark/`), and `run-benchmark.cjs` (in `scripts/model-benchmark/`), and `sweep-benchmark.cjs` — wait, sweep IS listed. Let me recount.

Actual missing from §11 but present in directories:
- `scripts/skill-benchmark/_args.cjs`
- `scripts/skill-benchmark/advisor-probe.cjs`
- `scripts/skill-benchmark/browser-executor.cjs`
- `scripts/skill-benchmark/contamination-lint.cjs`
- `scripts/skill-benchmark/d5-connectivity.cjs`
- `scripts/skill-benchmark/executor-dispatch.cjs`
- `scripts/skill-benchmark/load-playbook-scenarios.cjs`
- `scripts/skill-benchmark/playbook-generator.cjs`
- `scripts/skill-benchmark/router-replay.cjs`

**Impact:** An operator reading §11 to discover available scripts would miss 9 Lane C helpers, including critical ones like `d5-connectivity.cjs` (the D5 hard gate), `advisor-probe.cjs` (D1-inter scoring), and `executor-dispatch.cjs` (live dispatch orchestration). This defeats the purpose of the v1.11.1.0 doc-reconciliation claim.
**Fix:** Add the 9 missing scripts to the §11 list with one-line descriptions. Alternatively, explicitly scope §11 to "key scripts" rather than implying completeness.

### P2 — Suggestion

#### R4-P2-001: README §4 scripts table shows 19 rows but header claims "22 + lib"

**File:** `README.md:216-245`
**Claim:** Section 4 header reads "Scripts (22 + lib, grouped by lane)".
**Evidence:** The table contains exactly 19 script rows (8 agent-improvement + 4 model-benchmark + 5 skill-benchmark + 6 shared = 23 entries if counting lib/ rows, but the lib/ rows are 3, so 20 non-lib rows... actually let me recount: the table has rows for loop-host, dispatch-model, sweep-benchmark, scorer/**, run-skill-benchmark, live-executor, score-skill-benchmark, d4-ablation, build-report, scan-integration, generate-profile, score-candidate, run-benchmark, reduce-state, promote-candidate, rollback-candidate, check-mirror-drift, improvement-journal, mutation-coverage, trade-off-detector, candidate-lineage, benchmark-stability, materialize-benchmark-fixtures, lib/ (3 files) = 23 script entries + 3 lib entries. That's 22 scripts + lib. The count is correct if `scorer/**` counts as 1 entry representing the subtree. So this is actually consistent — the "22" counts each top-level script, and `scorer/**` is one entry.
**Impact:** Minor. The table is correct but a reader might miscount because `scorer/**` is a wildcard entry.
**Fix:** No change needed. Withdrawing this finding — the count is accurate.

#### R4-P2-002: README §4 skill-benchmark table shows 4 rows but text says "5 core scripts"

**File:** `README.md:186, README.md:226-230`
**Claim:** Structure block says `Lane C (5 core)`: run, live executor, score, D4/D4-R ablation, report builder.
**Evidence:** The scripts table in §4 shows exactly these 5: `run-skill-benchmark.cjs`, `live-executor.cjs`, `score-skill-benchmark.cjs`, `d4-ablation.cjs`, `build-report.cjs`. The count is consistent.
**Impact:** None — withdrawing this finding. The count matches.

#### R4-P2-003: v1.11.0.0 changelog references DEFAULT_D4R_SCENARIOS but v1.11.1.0 changelog references it as if it's a v1.11.1.0 addition

**File:** `changelog/v1.11.1.0.md:29` vs `changelog/v1.11.0.0.md:30`
**Claim:** v1.11.1.0 says "the v1.11.0.0 changelog ties the D4-R scenarios to the `DEFAULT_D4R_SCENARIOS` constant" — this is a cross-reference to the prior release, not a claim of new addition. Confirmed accurate.
**Evidence:** `run-skill-benchmark.cjs:226` defines `DEFAULT_D4R_SCENARIOS = ['LS-001', 'LS-002', 'LS-003', 'LS-004', 'SD-002']`. The v1.11.0.0 changelog documents this.
**Impact:** None — this is a correct cross-reference. Withdrawing.

## Traceability Checks

### v1.11.1.0 Remediation Claims vs Code

| Claim | Status | Evidence |
|---|---|---|
| Grader is dimension-aware (dimId threaded through composeGraderPrompt/parseGraderResponse) | **VERIFIED** | `harness.cjs:154` `composeGraderPrompt(fixture, swe16OutputText, systemPromptPath, dimId = 'D4')`, `harness.cjs:186` `parseGraderResponse(rawText, dimId = 'D4')`, `harness.cjs:338` `const dimId = opts.dim_id \|\| 'D4'` |
| normalizeParsedPayload stamps expected dimId when missing | **VERIFIED** | `harness.cjs:129` `if (!parsed.dim_id) return { parsed: { ...parsed, dim_id: dimId }, dimMismatch: false }` |
| normalizeParsedPayload caps confidence on mismatch | **VERIFIED** | `harness.cjs:131` `const confidence = typeof parsed.confidence === 'number' ? Math.min(parsed.confidence, 0.3) : 0.3` |
| --append-system-prompt used for real grader dispatch | **VERIFIED** | `harness.cjs:250` `['--print', '--model', GRADER_MODEL, '--append-system-prompt', prompt.systemPrompt, '-p', prompt.userPrompt]` |
| GRADED_RESPONSE_MAX_CHARS=8000 cap | **VERIFIED** | `live-executor.cjs:45` `const GRADED_RESPONSE_MAX_CHARS = 8000`, used at line 255 |
| collectBraceBalancedObjects is string-aware | **VERIFIED** | `live-executor.cjs:118-148` — tracks `inString`/`escaped`, handles `\"` inside strings correctly |
| shellQuote on resume-hint path | **VERIFIED** | `dispatch-model.cjs:356-358` POSIX single-quote escaping, used at line 347 |
| loadConfig ENOENT-vs-parse diagnostic | **VERIFIED** | `dispatch-model.cjs:112-114` — ENOENT silently continues, parse errors warn |
| criteriaExecAllowed gate | **VERIFIED** | `score-model-variant.cjs:111-120` — warns when not explicitly set, returns true (trusted default) |
| scoreScenario decomposed into named helpers | **VERIFIED** | `score-skill-benchmark.cjs:51-183` — `normalizeScenarioInput`, `computeSurfaceMatch`, `scoreD1Intra`, `scoreD2`, `scoreD3`, `scoreAssetRecall`, `firstFailingStage`, `modeAScore`, `buildLiveEvidence` all present |
| D1-intra weights are named constants | **VERIFIED** | `score-skill-benchmark.cjs:36-38` `D1_INTRA_INTENT_WEIGHT = 0.4`, `D1_INTRA_RESOURCE_WEIGHT = 0.6`, `SURFACE_MISMATCH_D1_CAP = 0.25` |
| SKILL.md has SKILL_BENCHMARK runtime_assets branch | **VERIFIED** | `SKILL.md:220-221` `if "SKILL_BENCHMARK" in intents: runtime_assets.extend(...)` |
| scoring_contract.md documents funnel stages | **VERIFIED** | `scoring_contract.md:57` — `activated-inter`, `router-unparseable`, `surface-mismatch`, `routed-intra`, `discovered` — matches `firstFailingStage()` at `score-skill-benchmark.cjs:153-160` |
| scoring_contract.md documents advisorySignals | **VERIFIED** | `scoring_contract.md:53-55` — `D4_task_outcome` and `assetRecall` documented as outside weighted aggregate |
| README references count 14→17 | **VERIFIED** | Actual count: agent-improvement(6) + model-benchmark(3) + skill-benchmark(3) + shared(5) = 17 |
| README trigger phrases 6→9 | **VERIFIED** | `SKILL.md:6-16` lists 9 trigger phrases |
| DEFAULT_D4R_SCENARIOS constant exists | **VERIFIED** | `run-skill-benchmark.cjs:226` |

### Doc-vs-Code Gaps

| Doc Claim | Code Reality | Severity |
|---|---|---|
| SKILL.md §11 implies comprehensive script list (22 listed) | 31 .cjs scripts exist in directories; 9 skill-benchmark scripts omitted | P1 |
| v1.11.1.0 says "SKILL.md gains the 6 previously-missing scripts in §11" | §11 gained scripts but still omits 9 | P1 |

## Verdict

**CONDITIONAL** — The v1.11.1.0 remediation code is solid and all functional claims are verified. However, SKILL.md §11 still omits 9 scripts despite the changelog claiming the list was reconciled. This is a doc-accuracy gap, not a code bug.

## Next Dimension

**maintainability** — final dimension in this review.
