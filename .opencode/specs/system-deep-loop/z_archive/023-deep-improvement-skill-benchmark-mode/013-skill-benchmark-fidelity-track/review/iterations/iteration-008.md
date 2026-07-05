# Iteration 008 — Maintainability (Deep)

## Dimension
maintainability (deep)

## Files Reviewed

- `scripts/skill-benchmark/d4-ablation.cjs:1-245`
- `scripts/skill-benchmark/score-skill-benchmark.cjs:1-351`
- `scripts/skill-benchmark/build-report.cjs:1-172`
- `scripts/skill-benchmark/live-executor.cjs:1-263`
- `scripts/skill-benchmark/run-skill-benchmark.cjs:1-293`
- `scripts/model-benchmark/dispatch-model.cjs:1-666`
- `scripts/model-benchmark/sweep-benchmark.cjs:1-651`
- `scripts/model-benchmark/scorer/grader/prompts/system-grader-task-outcome.md:1-45`
- `SKILL.md:1-543`
- `changelog/v1.11.0.0.md:1-41`

## Findings by Severity

### P2

**R8-P2-001** — Duplicated event-stream parsing logic
- File: `scripts/model-benchmark/sweep-benchmark.cjs:346-365` and `scripts/model-benchmark/dispatch-model.cjs:253-292`
- Claim: `extractAssistantText()` in sweep-benchmark.cjs is a subset of `parseOpencodeStream()` in dispatch-model.cjs. Both parse the same JSONL event stream format, sort by `part.time.start`, and concatenate text. The sweep version omits usage extraction but the core loop is identical.
- Impact: A bug fix or event-schema change in one must be mirrored in the other. The duplication is ~20 lines of near-identical parsing code.
- Fix: Extract a shared `parseOpencodeText(stdout)` helper into a shared lib module (e.g. `scripts/model-benchmark/lib/opencode-stream.cjs`) and have both files call it.

**R8-P2-002** — Magic numbers in scoring weights
- File: `scripts/skill-benchmark/score-skill-benchmark.cjs:107-109`
- Claim: D1-intra uses hardcoded weights `0.4 * ir + 0.6 * rr` (intent recall 40%, resource recall 60%) and surface mismatch caps at `0.25` (line 115). These are undocumented design decisions — the WEIGHTS constant (line 33) only covers the per-dimension point weights, not the intra-dimension sub-weights.
- Impact: Future maintainers cannot tell whether 0.4/0.6 is a tuning choice or a stable contract. Changing them without understanding the intent risks breaking scoring expectations.
- Fix: Extract named constants (e.g. `INTENT_RECALL_WEIGHT = 0.4`, `RESOURCE_RECALL_WEIGHT = 0.6`, `SURFACE_MISMATCH_CAP = 0.25`) with a brief comment explaining the rationale.

**R8-P2-003** — Duplicated grader base object construction
- File: `scripts/skill-benchmark/d4-ablation.cjs:70-75` and `scripts/skill-benchmark/d4-ablation.cjs:184-190`
- Claim: `gradeAblation` and `gradeTaskOutcome` both construct a `base` object with identical fields (`variant_hash`, `rubric_version`, `grader_model_build_hash`, `mode`, `mock_mode`, `cache_dir`). The only difference is `variant_hash` ('live' vs 'live-d4r') and the addition of `system_prompt_path` in the task-outcome variant.
- Impact: Any grader-harness API change requires updating both call sites identically.
- Fix: Extract a `buildGraderBase(variantHash, graderMode, cacheDir, extraFields)` helper.

**R8-P2-004** — `scoreScenario` function is too long
- File: `scripts/skill-benchmark/score-skill-benchmark.cjs:55-208`
- Claim: `scoreScenario()` is 153 lines handling back-compat adaptation, surface matching, five dimension scores, mode-A aggregation, and live-evidence assembly. It mixes normalization (lines 60-85), scoring (96-167), funnel logic (172-178), and report assembly (192-207) in one function.
- Impact: Difficult to unit-test individual scoring dimensions in isolation. A bug in one dimension's logic is hard to isolate from the others.
- Fix: Extract `scoreD1Intra()`, `scoreD2Proxy()`, `scoreD3Efficiency()`, `scoreAssetLane()`, `computeFunnelStage()`, and `buildLiveEvidence()` as named helpers, leaving `scoreScenario` as the orchestrator.

**R8-P2-005** — `WEIGHTS` exported but unused within the file
- File: `scripts/skill-benchmark/score-skill-benchmark.cjs:33`
- Claim: `WEIGHTS = { d1inter: 12, d1intra: 13, d2: 20, d3: 15, d4: 25, d5: 15 }` is exported and used by external consumers (aggregate, build-report), but within `score-skill-benchmark.cjs` itself the mode-A scoring (lines 181-188) uses inline weight values from the `measured` array rather than referencing the WEIGHTS constant. This means if WEIGHTS were changed, the per-scenario mode-A score would not update.
- Impact: Silent divergence risk — a maintainer changing WEIGHTS would expect all scoring to update, but the per-scenario mode-A score is hardcoded.
- Fix: Reference `WEIGHTS.d1intra`, `WEIGHTS.d2`, `WEIGHTS.d3` in the `measured` array instead of local references.

**R8-P2-006** — Silent config load failure
- File: `scripts/model-benchmark/dispatch-model.cjs:103-117`
- Claim: `loadConfig()` catches all read/parse errors and returns `{}`, with no logging. If the config file exists but is malformed JSON, the operator gets zero feedback — the dispatcher silently runs with hardcoded defaults.
- Impact: A typo in `improvement_config.json` causes silent behavioral drift with no diagnostic signal.
- Fix: At minimum, write a one-line stderr warning when a candidate config path exists but fails to parse. Continue with `{}` as the fallback, but make the failure visible.

## Traceability Checks

| Claim | Source | Status |
|-------|--------|--------|
| SKILL.md §4: `--mode=model-benchmark` runs `materialize-benchmark-fixtures.cjs` then `run-benchmark.cjs` | `scripts/shared/loop-host.cjs` | MATCH — loop-host lazy-requires both |
| SKILL.md §4: `dispatch-model.cjs` is model-agnostic dispatcher | `dispatch-model.cjs:390-449` | MATCH — five executor cases |
| SKILL.md §4: `--grader noop` (default) stays deterministic | `harness.cjs` grader routing | MATCH — noop returns mock scores |
| SKILL.md §7: STOP_REASONS enum matches journal helper | `improvement-journal.cjs` exports | MATCH |
| Changelog: D4-R advisory, never collapsed into D4 | `score-skill-benchmark.cjs:169,282-284` | MATCH — d4 stays unscored-mode-a, d4TaskOutcome is advisory |
| Changelog: asset lane advisory, not weighted | `score-skill-benchmark.cjs:144-156,284-286` | MATCH — assetRecall not in measured[] |
| README: `build-report.cjs` is ONLY writer of report.md | `build-report.cjs` | MATCH — renderReport is the sole renderer |

## Verdict

**CONDITIONAL** — No P0/P1 findings. Six P2 findings (code duplication, magic numbers, function length, silent config failure). The codebase is well-structured overall with consistent box-header format and JSDoc coverage. The maintainability issues are incremental improvements, not blockers.

## Next Dimension

correctness (deep) — final pass to catch any remaining correctness issues before convergence.
