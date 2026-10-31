# Build design: Pi's native classifier transport against the jev CLI

One new script, its tests, and the docs that describe them. Nothing here edits a runtime file. Every path, line and symbol below was read in this worktree; anything the build must decide is marked `(proposed)`.

---

## 1. Replay feasibility

**No, not as a guaranteed rebuild of all 333 calls.** The question text and the option list of every recorded `choice` call depend on two values the recorded file does not hold, so exactness is verifiable per row, never assumed.

The call is composed at `score-suggested-order.mjs:464-472`: keys are `[...row.cluster, 'none']` (`:465`), orders are `rotations(keys)` (`:466`), args are `optionArgs(orders[order], census.describe, row.cluster)` (`:469`), and the argv is `['choice','--provider',gate.provider,'-q',CHOICE_QUESTION, ...options]` (`:471`) with `row.prompt` on stdin.

| Piece of the call | Source | Rebuildable |
|---|---|---|
| `row.prompt`, sent on stdin | committed corpus field, `score-jev-tiebreak.mjs:319`; corpora read at `:276` from `labeled-prompts.jsonl` / `holdout-prompts.jsonl` (`CORPORA`, `:33`); `childMain` passes it as the spawn's `input` at `score-suggested-order.mjs:290` | Yes, committed |
| `-q` question text | `CHOICE_QUESTION`, `score-suggested-order.mjs:25` — module-private, no `export` | Literal only, by copy |
| `none` option text | `NONE_DESCRIPTION`, `score-suggested-order.mjs:26` — module-private, no `export` | Literal only, by copy |
| rotated key order | `rotations`, exported `score-suggested-order.mjs:56`, over `[...row.cluster,'none']` at `:465` | Yes, once `cluster` is known |
| `-o key=description` args | `optionArgs`, exported `:67` (with `none` handled at `:69` and the `[key]` disambiguator at `:80`) | Yes, once `describe` and `cluster` are known |
| `describe(skill)` | `loadCensus()` reads `projection.skills[].description`, `score-jev-tiebreak.mjs:337-340`; projection loaded at `:272` | Only by rerunning `loadCensus()` |
| `row.cluster` | derived per row from `scoreAdvisorPrompt`, `score-jev-tiebreak.mjs:311-327` | Only by rerunning `loadCensus()` |
| `order` (0, 1, 2) | recorded, field `order` in the 019 `calls.jsonl` | Yes, recorded |
| probability map | recorded, field `probabilities` | Yes, recorded |
| `call_ms` | recorded; measured around the CLI spawn only, `score-suggested-order.mjs:286-293` | Yes, recorded |

The three gaps, in order of severity:

1. **`cluster` and `describe` are derived at load time.** `loadCensus()` scores each committed prompt through `scoreAdvisorPrompt` (`score-jev-tiebreak.mjs:311-312`), whose module lives in `dist/runtime` — a gitignored build artifact (`.gitignore:58`) — and takes the descriptions from the skill projection (`:272`, `:337-340`). The recorded map gives the key **set** but not the rotation **order**, and no description text at all.
2. **The two literals are module-private.** Exporting them would edit a file this phase may not touch, so the script copies the two strings, cites the lines, and pins the copy with a test that reads the source file and asserts both literals are still there.
3. **Description text can drift while the key set still matches**, undetectably from the recorded file. The design records a `sha12` of each rebuilt option list in `report.json`, so a later reader can tell whether the options changed; the paired rerun in the fallback removes the question entirely.

So the arm **rebuilds and verifies per row**: rebuilt `[...cluster,'none']` set equal to the recorded `probabilities` key set means the row is replayed with its recorded order index; unequal means the row is excluded and counted in `replay: rows=… excluded=…`. No row is guessed at, and no excluded row becomes a zero.

**Drift evidence, measured not assumed.** `git log --since='2026-09-30T09:53:00Z' -- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/` prints nothing, so the corpus and both scorer files are unchanged since the run recorded in `run.txt:1-2` (09:53:49Z to 10:03:07Z, exit 0). The `dist/runtime/lib/scorer/*.js` files are untracked and their mtime in this worktree is 2026-09-30T13:41, after the run. The corpus is `labeled-prompts.jsonl` + `holdout-prompts.jsonl`; the row fixture `score-suggested-order.mjs` reads is that pair through `loadCensus()`, not a committed table.

**Fallback, `spec.md` section 10's first question (proposed).** One same-day paired run: `--pi --cli --out <dir>`. This script builds each question once, in-process, from one `loadCensus()` result and one `rotations()` call, then sends it to both sides — Pi through `classify()`, the CLI through `spawnCall` of `jev choice`. Both sides then carry identical option keys, descriptions and order by construction, the recorded baseline still supplies K wherever the rebuild matched, and the two latency columns share a day and a machine load. The fallback spends money and needs the operator's yes, exactly as the recorded path does.

One asymmetry no rebuild removes: the CLI takes its state as text on stdin (`childMain`, `input: job.prompt`, `score-suggested-order.mjs:290`), while Pi takes a `JsonObject` (`ClassifierContext.state`, `pi-ai/dist/types.d.ts:467-469`). The design wraps it once, as `{ request: prompt }` `(proposed)`, and records the wrapper's `sha12` on every call so the run proves what it sent.

---

## 2. Interface

Script: `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs` `(proposed)`. Tests: `benchmark/pi-transport/tests/score-pi-transport.test.mjs` `(proposed)`. Node ESM, standard library plus two read-only imports.

### Switches

| Switch | Rule |
|---|---|
| none | Zero-call census only. Prints the census block, spawns nothing, calls no `classify()`, writes no file, exits 0 |
| `--pi` | Arms the Pi side. Requires `--out <dir>`; without it, one stderr line and exit 2 before any line on stdout |
| `--cli` | Arms the paired CLI rerun (the section 1 fallback). Requires `--out <dir>`, same exit 2 rule |
| `--out <dir>` | Report directory. Legal only with `--pi` or `--cli`; alone, exit 2 |

No other switch. The timeouts, the baseline path and the row set are module constants: an option earns existence when two real callers need different values today, and these have one caller each. Tests inject through `deps`, not argv.

### Exit codes

| Code | When |
|---|---|
| 0 | Census printed, or an arm ran and printed its columns and verdict, or an arm stopped and printed `partial_rows` |
| 1 | Census stop: the baseline file is missing, empty or unparseable — one `stop:` line naming the path |
| 2 | Usage: unknown flag, `--pi` or `--cli` without `--out`, `--out` alone, or an unreadable `--out` path |

A failed gate is not an exit code: it prints one skip line and the run exits 0, matching the sibling's dormant-unless-available rule.

### stdout lines

Census, in this order, before anything can spend:

1. `pi: path=<packageDir|none> version=<v|none>`
2. `pi classifier <provider>: known=<n> available=<n>` — one line per provider, providers sorted by code unit
3. `pi classifier total: known=<n> available=<n>`
4. `jev: path=<abs|none> version=<v|none> provider=official`
5. `jev identity: provider=official auth=<ok|absent|failed>`
6. `llama.cpp: server=<abs|none> cli=<abs|none>`
7. `baseline: path=<repo-relative> rows=<K> choice=<n> rows_with_3_full_maps=<n>`
8. `replay: rows=<K> calls=<3K> key_source=recorded`

Pi arm lines:

9. `pi gate: model=openrouter/typesafe/jev-1.13 available=<yes|no> openrouter_models=<n>`
10. `pi arm skipped: <package|model|baseline>` — one line, then no arm lines and no verdict
11. `pi: rows=<n> calls=<n> measured=<M> unmeasured=<n> timeouts=<n> excluded=<n>`
12. `column pi: rows=<K> measured=<M> p50_ms=<v> p95_ms=<v> cost_per_100=<v>`
13. `metrics: coverage=<pct> agreement=<pct> median_abs_dp=<v>`
14. `pi: partial_rows=<n>` on a stop, and no verdict line

CLI arm lines (`--cli`): `jev: path=… provider=…` and `jev: version=0.6.2` from the shared gate, `jev: auth_test provider=official model=<id>`, `column cli: rows=<K> measured=<M> p50_ms=<v> p95_ms=<v> calls=<n>`, `cli: partial_rows=<n>` on a stop.

Verdict line, verbatim shape from `spec.md` section 4, printed once, last:

`verdict pi-transport: <outcome> K=<K> M=<M> coverage=<pct> agreement=<pct> median_abs_dp=<v> p95_ms=<pi>/<cli> cost_per_100=<v>`

Formats `(proposed)`: `pct` one decimal (`coverage=100.0`), `median_abs_dp` four decimals, `p95_ms` integer ms, `cost_per_100` four decimals in USD or `none` when Pi reports no usage. `outcome` is `adopt`, `keep-cli` or `stop (<reason>)` per the three ordered checks.

### Files under `--out`

- `calls.jsonl` — appended, one line per call. Pi row: `{ "backend":"pi","kind":"choice","row_id":…,"order":0,"attempt":1,"call_ms":…,"exit_code":0,"stop_reason":"stop","status":"measured","probabilities":{…},"replay":"recorded|fresh|excluded","model":"typesafe/jev-1.13","provider":"openrouter","pi_version":"0.99.1","state_sha12":"…" }`. Plus one `{ "backend":"pi","kind":"model_check", … }` line when the gate passes. CLI rerun row: the 019 field names verbatim (`backend:"jev"`, `child_wall_ms`, `advisor_ms`, `health_ms`, `call_ms`, `exit_code`, `probabilities`, `status`, `jev_version`, `provider`, `model`), plus one `kind:"auth_test"` line, so a rerun sits beside the recorded file in one shape.
- `report.json` — written once, at the end: `{ census: string[], pi: {…}, cli: {…}, metrics: { K, M, coverage, agreement, median_abs_dp, p95_ms_pi, p95_ms_cli, cost_per_100 }, verdict: { outcome, line, …same fields }, stopped: {} }`.

`exit_code` on the Pi side: `0` when a full map came back, `null` otherwise, with `stop_reason` carrying the SDK's own `stop | error | aborted` (`ClassifierResult.stopReason`, `types.d.ts:487-488`). Pi has no process to exit; recording a fake code would be a number the run did not observe.

### Exported functions

```js
export const CHOICE_QUESTION = '…';           // copied literal, pinned by a test
export const NONE_DESCRIPTION = '…';
export const CALL_TIMEOUT_MS = 30000;         // fixed bound for both sides
export const QUESTION_NAME = 'answer';
export function which(name, env)                                            // → string|null
export function readBaseline(text)                                          // → { rows, calls, fullRows, unreadable, reason }
export function censusLines({ pi, jev, llama, baseline })                    // → string[]
export function criteriaMap(optionPairs)                                    // → Record<string,string>
export function toClassifierContext({ prompt, keys, criteria })             // → ClassifierContext
export function probabilitiesFrom(result, questionName, keys)                // → { raw, full }
export function meanMap(maps, keys)                                         // → Record<string,number>
export function topKeyByMean(maps, keys)                                    // → string
export function buildReplayPlan({ baseline, census, describe })             // → { plan, excluded }
export function metricsFor({ K, plan, piByRow, cliByRow })                  // → metrics object
export function judge(metrics)                                             // → { outcome, reason }
export function verdictLine(verdict)                                        // → string
export function columnLine(column)                                          // → string
export function runPiArm(deps)                                              // → Promise<{ column, stopped? }>
export function runCliArm(deps)                                             // → Promise<{ column, stopped? }>
export async function main(argv, deps)                                      // → Promise<number>
```

Imports, both read-only and neither edited: `rotations`, `optionArgs`, `topKey`, `readProbabilities`, `nearestRank` from `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs`; `writeCall`, `spawnCall`, `jevGate` from `score-jev-tiebreak.mjs` beside it. `loadCensus` is imported the same way but reached only through `deps.loadCensus`, defaulted to a dynamic `await import(...)`, so the default census never loads the scorer or `dist/`. A private `which` is copied from `score-jev-tiebreak.mjs:1359-1372` because that one is not exported.

### A CLI question, mapped onto `classify()`

| CLI | Pi |
|---|---|
| `row.prompt` on stdin (`:290`) | `state: { request: prompt }` — `ClassifierContext.state`, `types.d.ts:467-469` |
| `-q CHOICE_QUESTION` (`:471`) | `questions.answer.instructions`, `ClassifierChoiceQuestion`, `types.d.ts:448-451` |
| `-o key=description` pairs | `questions.answer.criteria`, built by `criteriaMap(optionArgs(...))` so the text, including the `[key]` disambiguator, is the CLI's own |
| option order = `rotations(keys)[order]` | `criteria` insertion order, so the JSON object carries the CLI's order |
| one unnamed `answer` in the CLI's payload | `QUESTION_NAME = 'answer'`, so the two shapes line up |

The call is `runtime.classify(model, context, { signal: AbortSignal.timeout(CALL_TIMEOUT_MS) })` — `model-runtime.d.ts:106`, `ClassifierOptions.signal` at `types.d.ts:58`. Nothing else is passed: no `apiKey`, no `env`, no `authPath`.

Back, keyed like the CLI's: the CLI's `readProbabilities` (`:82`) returns `{ raw, full }` from `JSON.parse(stdout).answers.answer.probabilities`. Pi mirrors that contract exactly — `probabilitiesFrom(result, 'answer', keys)` returns `{ raw: result.answers.answer.probabilities, full: raw-or-null }`, where `full` is null unless every submitted key holds a finite number. Both sides then reduce with one code path: `meanMap` over the row's three maps, then `topKey` (`score-suggested-order.mjs:108`, the first key in `keys` order holding the highest value — the CLI's own tie rule).

---

## 3. Gates

**Pi arm, only behind `--pi`, in this order, before any call:**

1. Resolve the package: `which('pi', env)`, `realpathSync`, then climb `dirname` until a `package.json` names `@earendil-works/pi-coding-agent`. Unresolved → `pi: path=none version=none`, then `pi arm skipped: package`, exit 0. On this machine `pi` resolves to `<pkg>/dist/bundle/cli.js`, so the climb starts two levels up from `dist/bundle`.
2. `const runtime = await ModelRuntime.create()` with **no options**, the offline default (`CreateModelRuntimeOptions.allowModelNetwork` defaults false, `model-runtime.d.ts:11-12`; `refreshOnCreate` at `:19`).
3. `const available = await runtime.getAvailableOfType('classifier', 'openrouter')` — `model-runtime.d.ts:75`.
4. Require a member whose `id` is `typesafe/jev-1.13`. Absent → `pi gate: model=openrouter/typesafe/jev-1.13 available=no openrouter_models=<n>`, then `pi arm skipped: model`, exit 0.
5. `const model = runtime.getModelOfType('classifier', 'openrouter', 'typesafe/jev-1.13')` — `:73` — and pass that object to `classify()`.
6. Print `pi gate: … available=yes openrouter_models=<n>` and the `kind:"model_check"` record, then start the arm.

The gate never calls `classify()` and never calls `getAvailableOfType` without a provider, so the census and the gate make no model call.

**CLI arm, same gate as 019, live:** the shared `jevGate` — `which('jev')` then `jev --version` whose first line must equal `jev 0.6.2`, then `jev auth status --provider <p>` exiting 0, with `<p>` from `JEV_PROVIDER` defaulting to `official` (`score-jev-tiebreak.mjs:1381-1407`; `cli-usage/SKILL.md:97` pins the version). One provider line, then either `jev: auth_test provider=official model=<id>` from the recorded `auth test` call, or one skip line: `jev arm skipped: version` or `jev arm skipped: no credential`.

**A failed gate prints one skip line and nothing else**: no `calls.jsonl`, no `report.json`, no verdict, exit 0. Both arms are dormant behind their own switch, so a default run is byte-identical with or without them.

**Key hygiene.** The script never reads, prints or passes a key: `ModelRuntime.create()` resolves credentials from Pi's own store (`CreateModelRuntimeOptions.credentials` / `authPath`, `model-runtime.d.ts:5-8`) and receives no options here. `jev auth status` prints a store path, so only its exit code is read, never its stdout. `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the script exits 1.

---

## 4. Test cases

`node --test .skilled/skills/cli-classifier/benchmark/pi-transport/tests/score-pi-transport.test.mjs`. The Pi runtime is injected as a fake object with `getAvailableOfType`, `getModelOfType` and `classify`; `jev` is a stub executable in a temp dir first on `PATH`. No test opens a socket.

| name | input | expected |
|---|---|---|
| `which_finds_stub_first_on_path` | temp dir with an executable `jev`, `PATH=temp:…` | the temp path |
| `which_returns_null_for_a_missing_name` | `which('not-a-binary', { PATH: temp })` | `null` |
| `read_baseline_counts_rows_calls_and_full_maps` | 334-line fixture, three orders per row | `rows=111`, `calls=333`, `fullRows=111`, `unreadable=false` |
| `read_baseline_reports_unreadable_empty` | `''` | `unreadable=true`, `reason='empty'` |
| `read_baseline_tolerates_a_partial_map` | one row whose second order holds two keys only | that row out of `fullRows`, `unreadable=false` |
| `read_baseline_rejects_non_json` | `'not json'` | `unreadable=true` |
| `census_lines_zero_call_order_and_count` | fixture baseline, fake runtime with 12 known / 7 available, no `pi` on PATH | the eight census lines in order, `pi: path=none version=none` |
| `census_lines_report_zero_available_without_credentials` | fake runtime whose available list is empty | `available=0` per provider and `total: known=12 available=0` |
| `census_private_literals_still_match` | the two source files on disk | both literals equal the script's constants, and the two consts carry no `export` in the source |
| `criteria_map_keeps_option_text_and_order` | `optionArgs` pairs from a 3-key rotation | keys in rotation order, `none` mapped to its long text |
| `criteria_map_keeps_the_disambiguator_suffix` | two cluster members with identical descriptions | one text ends with ` [key]` |
| `to_classifier_context_wraps_state_and_one_question` | `{ prompt, keys, criteria }` | `state.request === prompt`, one question named `answer`, `type: 'choice'`, criteria equal to input |
| `probabilities_from_full_map` | fake result with all three keys finite | `full` non-null and keyed in submitted order |
| `probabilities_from_partial_map_is_unmeasured` | fake result missing one key | `full === null`, `raw` still returned |
| `probabilities_from_error_result` | result with `stopReason: 'error'`, no `answers` | `{ raw: null, full: null }` |
| `top_key_by_mean_uses_the_mean_over_orders` | two maps whose means differ | the key with the higher mean |
| `top_key_by_mean_ties_keep_keys_order` | equal means on two keys | the earlier key in `keys` |
| `build_replay_plan_matches_on_an_equal_key_set` | census row whose `cluster` equals the recorded set | row planned with its recorded order index |
| `build_replay_plan_excludes_on_a_key_set_mismatch` | census row with one extra key | row in `excluded`, absent from the plan |
| `metrics_for_counts_coverage_and_agreement` | 10 planned rows, 9 measured, 8 agreeing | `K=10`, `M=9`, `coverage=90.0`, `agreement=88.9` |
| `metrics_for_median_over_a_partial_map_row` | one row measured on one side only | it stays out of both totals and out of the median |
| `judge_stops_on_coverage_below_ninety` | `coverage=89.9`, otherwise perfect | `stop (coverage)` |
| `judge_keeps_cli_on_agreement_below_ninety_five` | `coverage=100`, `agreement=94.9` | `keep-cli (agreement)` |
| `judge_keeps_cli_on_latency_over_one_and_a_half` | `agreement=100`, `p95=2.0x` the CLI | `keep-cli (latency)` |
| `judge_adopts_when_every_bound_holds` | `coverage=100`, `agreement=100`, `p95` inside the bound | `adopt` |
| `verdict_line_matches_the_fixed_field_order` | a full metrics object | one line, fields in the fixed order, `none` for a missing cost |
| `run_pi_arm_skips_when_the_model_is_unavailable` | fake runtime whose `openrouter` list lacks the model | one `pi arm skipped: model`, no `calls.jsonl` |
| `run_pi_arm_measures_a_full_map_and_records_it` | fake `classify` returning a full map, temp `--out` | one `calls.jsonl` line, `status:"measured"`, `exit_code:0` |
| `run_pi_arm_records_a_timeout_as_unmeasured` | fake `classify` that never settles, `CALL_TIMEOUT_MS` injected small | `status:"unmeasured_timeout"`, row excluded, no verdict |
| `run_pi_arm_stops_on_a_backend_refusal` | fake `classify` resolving with `stopReason:'error'` | `partial_rows` line, no verdict, exit 0 |
| `run_cli_arm_skips_when_the_stub_reports_another_version` | stub printing `jev 0.0.1` | one `jev arm skipped: version` line, no `calls.jsonl` |
| `run_cli_arm_records_one_line_per_call` | stub printing a full CLI payload for three orders | three `calls.jsonl` lines with the 019 field names |
| `main_default_run_makes_no_call_and_writes_nothing` | stub `jev` on `PATH`, injected runtime, temp cwd | exit 0, the census lines, no stub log, no file written |
| `main_live_without_out_exits_two_before_any_line` | `['--pi']` | exit 2, one stderr line, empty stdout |
| `main_out_alone_exits_two` | `['--out', dir]` | exit 2 |
| `main_unknown_flag_exits_two` | `['--nope']` | exit 2 |
| `main_unreadable_baseline_exits_one` | baseline path absent | exit 1 and one `stop:` line naming the path |

---

## 5. Build steps

One change per step, one executor: DeepSeek V4.1 Flash writes, MiMo v2.6 Pro reviews. Code steps name the functions and the test names that cover them.

1. **Folder and script skeleton.** Create `benchmark/pi-transport/score-pi-transport.mjs`: the two copied literals with their source lines beside them, `CALL_TIMEOUT_MS`, `QUESTION_NAME`, the private `which`, and package resolution up to the `pi: path= version=` line. Tests: `which_finds_stub_first_on_path`, `which_returns_null_for_a_missing_name`.
2. **Baseline reader.** `readBaseline(text)` plus the `baseline:` and `replay:` lines and the exit-1 stop. Tests: the four `read_baseline_*` cases.
3. **CLI and llama.cpp census reads.** `jev --version`, `jev auth status --provider official` (exit code only), `which('llama-server')`, `which('llama-cli')`, and the two lines they feed. Tests: `census_lines_zero_call_order_and_count`, `census_lines_report_zero_available_without_credentials`.
4. **Pi census reads.** Package resolution feeding `pi:`, then `ModelRuntime.create()` and one `getModelsOfType('classifier')` plus one `getAvailableOfType('classifier')` grouped per provider — `model-runtime.d.ts:72` and `:75`. Test: the same two census cases, with the injected runtime.
5. **`main` census wiring.** Arg parsing, the exit-2 usage rules, the exit-1 baseline stop, the census block, no arm. Tests: `main_default_run_makes_no_call_and_writes_nothing`, `main_live_without_out_exits_two_before_any_line`, `main_out_alone_exits_two`, `main_unknown_flag_exits_two`, `main_unreadable_baseline_exits_one`, `census_private_literals_still_match`.
6. **Question construction.** `criteriaMap`, `toClassifierContext`, `probabilitiesFrom`, `meanMap`, `topKeyByMean`. Tests: the two `criteria_map_*`, `to_classifier_context_*`, the three `probabilities_from_*`, the two `top_key_by_mean_*`.
7. **Replay plan.** `buildReplayPlan` over `deps.loadCensus` (default the dynamic import) and the recorded key sets, with `excluded` recorded per row. Tests: `build_replay_plan_matches_on_an_equal_key_set`, `build_replay_plan_excludes_on_a_key_set_mismatch`.
8. **Pi arm.** The five gate steps, the per-call `classify()` with `signal: AbortSignal.timeout(CALL_TIMEOUT_MS)`, the timeout and refusal handlings, `writeCall` records, `replay: recorded|fresh|excluded`. Tests: `run_pi_arm_skips_when_the_model_is_unavailable`, `run_pi_arm_measures_a_full_map_and_records_it`, `run_pi_arm_records_a_timeout_as_unmeasured`, `run_pi_arm_stops_on_a_backend_refusal`.
9. **CLI arm, the section 1 fallback.** The shared `jevGate`, the `auth test` record, `spawnCall` of `jev choice` per row and order with the same `optionArgs` output. Tests: `run_cli_arm_skips_when_the_stub_reports_another_version`, `run_cli_arm_records_one_line_per_call`.
10. **Metrics, judge and report.** `metricsFor`, `judge`, `verdictLine`, `columnLine`, `report.json`. Tests: the five `metrics_for_*` and `judge_*` cases, `verdict_line_matches_the_fixed_field_order`.
11. **Folder README.** `.skilled/skills/cli-classifier/benchmark/pi-transport/README.md`, sk-doc mode `sk-create-readme`, MODEL `.skilled/skills/cli-classifier/benchmark/injection-screen/README.md` (sections OVERVIEW, DIRECTORY TREE, KEY FILES, ENTRYPOINTS with exit codes, gate section, VALIDATION, RELATED). Facts the README may state: the script path, the two switches and their exit rules, the zero-call default, the keep rule's three ordered checks, the verdict line's shape, and that no verdict has been printed yet.
12. **Benchmark hub row.** `.skilled/skills/cli-classifier/benchmark/README.md` section 2 LAYOUT, one row after the `injection-screen/` row at line 32, naming the folder, the script and the two gates.
13. **Feature catalog entry.** `.skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-comparison.md`, sk-doc mode `sk-create-feature-catalog`, MODEL `.skilled/skills/cli-classifier/feature-catalog/measurements/injection-screen-measurement.md` (frontmatter, `sk-doc-template: skill_asset_feature_catalog`, sections OVERVIEW, HOW IT WORKS, SOURCE FILES, SOURCE METADATA). Then its index row in `feature-catalog/feature-catalog.md` under `## 2. MEASUREMENTS`, the shape of the `Injection screen measurement` block at lines 27-39.
14. **Playbook scenario.** `.skilled/skills/cli-classifier/manual-testing-playbook/measurements/pi-transport-comparison.md`, sk-doc mode `sk-create-manual-testing-playbook`, MODEL `.skilled/skills/cli-classifier/manual-testing-playbook/measurements/injection-screen-measurement.md` (SCENARIO CONTRACT, TEST EXECUTION with an exact command sequence, the 9-column table, SOURCE FILES, SOURCE METADATA). Give it the next free id after `CC-004`, then add its three index rows in `manual-testing-playbook/manual-testing-playbook.md`: the `## 7. MEASUREMENTS` block, the `## 8. AUTOMATED TEST CROSS-REFERENCE` row, and the `## 9. FEATURE CATALOG CROSS-REFERENCE INDEX` row, following lines 127-133, 146 and 159. The scenario's command sequence must use stub `jev` and an injected runtime only; it must not run a live arm.
15. **Name reconciliation.** Update the four phase docs that carry the old proposed names so they name `score-pi-transport.mjs`, `--pi` and `--cli`: `spec.md` section 3's Files to Change table and section 4's proof plan, `plan.md` sections 3 and 5, `tasks.md`'s notation and the task bodies, `acceptance-criteria.md`'s preamble. The design note lives at `scratch/w4-build/design.md`.

No step edits anything under `.skilled/skills/system-skill-advisor/runtime/`, and no step installs anything.

---

## 6. Proof plan

One row per completion criterion in `goal.md`. `$S` is the script, `$T` its test file, `$STUB` a temp dir holding a logging `jev` stub first on `PATH`.

| Criterion | Command | Expected output |
|---|---|---|
| The default run prints Pi's version, the per-provider classifier availability, the jev identity line and the replay row count, and makes no model call | `PATH="$STUB:$PATH" node $S` | exit 0; the eight census lines, including `pi: path=… version=0.99.1`, one `pi classifier <provider>:` line per provider, `jev identity: provider=official auth=ok`, `baseline: … rows=111 choice=333`, `replay: rows=111 calls=333 key_source=recorded`; `$STUB/calls.log` absent; `git status --porcelain` identical to before |
| One approved live run prints agreement, the median probability difference, p95 latency per side and Pi's cost per 100 calls, with every call in `calls.jsonl` | `node $S --pi --out "$OUT"` (operator's yes first) | `column pi:` and `column cli:` with both `p95_ms`, `metrics: coverage=… agreement=… median_abs_dp=…`, `pi: rows=… calls=…`; `$OUT/calls.jsonl` holds one line per call plus the `model_check` line; `$OUT/report.json` carries the same fields |
| The run ends in one `verdict pi-transport:` line under the keep rule fixed in `spec.md` | `grep -c '^verdict pi-transport: ' "$OUT/run.txt"` and `node -e` on `report.json.verdict.line` | `1`, and the line's `K`, `M`, `coverage`, `agreement`, `median_abs_dp`, `p95_ms`, `cost_per_100` equal the report's own fields |
| The script's tests cover each public surface with a happy path and an edge case, both backends stubbed | `node --test $T` | `pass` at or above the count of the section 4 rows, `fail 0`, and no test reaches a network |
| `validate_document.py` is VALID on every doc the phase changes and `validate.sh --strict` passes | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <each changed doc>`; then `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <phase folder> --strict` | `VALID` on each doc, then `RESULT: PASSED` |

Two supporting checks the closure records beside them: `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' $S` exits 1, and `git status --porcelain` before and after a default run is the same text.

---

## 7. Open questions

- **Is the recorded baseline enough, or is the paired rerun needed?** `(proposed)` Attempt the recorded replay first and let the rebuild decide per row: rows whose rebuilt key set equals the recorded set use the recorded CLI answers and timings; if fewer than 90 percent of K survive, the run reports `stop (coverage)` and the answer is the `--cli` fallback on the operator's yes. The script never mixes a recorded side with a fresh side inside one row.
- **Does a recorded `call_ms` compare fairly with a fresh `classify()`?** `(proposed)` It compares in kind but not byte-for-byte: the recorded `call_ms` brackets the CLI `spawnSync` including process start (`score-suggested-order.mjs:286-293`), while Pi's number brackets an in-process HTTP round trip. The design records both, prints `p95_ms=<pi>/<cli>` unqualified, and names the asymmetry in `report.json` and the docs. When the operator wants the strict comparison, the paired rerun puts both sides on one day.
- **Which state wrapper does the Pi question take?** `(proposed)` `{ request: <prompt> }` — one key, stable text, the whole prompt as its value — because Pi requires a `JsonObject` and the CLI's state is bare text. The wrapper's `sha12` goes in `calls.jsonl`.
- **What does `exit_code` mean for a Pi call?** `(proposed)` `0` on a full map, `null` otherwise, with the SDK's own `stop_reason` beside it; the spec's field list is satisfied by keeping the field and leaving it honest rather than inventing a number.
- **Where does the cost come from when Pi reports no usage?** `(proposed)` `ClassifierResult.usage.cost.total` (`types.d.ts:289-309`) scaled to 100 calls; when `usage` is absent, `cost_per_100=none` on the line and in the report. The keep rule's three checks do not read cost, so a `none` never changes the verdict.
- **Do the option descriptions still match what the CLI was asked?** `(proposed)` Unknowable from the recorded file, since it holds no description text. The run records a `sha12` of each rebuilt option list, so a later reader can see whether the options changed; only a paired rerun settles it. Recorded as a named residual risk rather than a claim.
- **Which script name is authoritative?** `(proposed)` `score-pi-transport.mjs`, matching the siblings `score-suggested-order.mjs` and `score-injection-screen.mjs`, with the switches `--pi` and `--cli`. The phase docs currently carry the proposed name `compare-pi-transport.mjs` and `--live`; build step 15 updates them in one pass, which stays inside the phase's own record.
- **Does the design note belong under `scratch/design/` or `scratch/w4-build/`?** `(proposed)` `scratch/w4-build/design.md`, where it was written; `tasks.md` names `scratch/design/` in its notation, and step 15 corrects that too.
- **Any extra column in the first run?** `(proposed)` None. The other four OpenRouter classifier families, OpenCode Zen and a llama.cpp model each cost money, llama.cpp needs an install, and the census prints `llama.cpp: server=none cli=none` on this machine — so the first run stays one Jev column on each side.
