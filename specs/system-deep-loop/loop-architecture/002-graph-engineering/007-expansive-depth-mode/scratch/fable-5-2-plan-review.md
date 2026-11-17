# Adversarial review of the planned phases 001-014 against the code (Fable 5.2)

Reviewed 2026-11-17 against the working tree on `main` (review started at `8e2eca067d3`; `HEAD` was `0d11528a8b3` when this file was written). Read-only. Nothing was committed and this is the only file written.

Shorthand used below:

- `S` = `.skilled/skills/system-deep-loop`
- `C` = `.skilled/commands/deep/assets`
- `K` = `.skilled/skills/system-spec-kit/runtime/cli`
- `PKT` = this packet folder

## Summary

- Overall assessment: REQUESTED_CHANGES. The line citations in the phase docs are mostly accurate. The defects are in what the plans leave out: files and callers, the right test homes, default-path effects, and work that sits between phases.
- Findings: **2 P0, 31 P1, 18 P2** (51 total).
- Scope note: the brief named 13 children. The folder holds a fourteenth, `014-docs-playbooks-alignment/` (untracked), and the parent map lists it. It is reviewed here because it changes who owns the doc work.
- Evidence class: every code claim was checked by opening the file and line. Two things were run: `npx vitest run runtime/tests/unit/stop-policy-yaml-parity.vitest.ts` from `S` (exit 1, "No test files found") and `npx vitest run tests/unit/stop-policy-yaml-parity.vitest.ts` from `S/runtime` (exit 0, 4 passed). No loop run was repeated. Where a finding rests on inference, it says so.
- No embedded instruction was found in any file read, and none was acted on.

Severity scale, as the task set it: **P0** wrong and would mislead the build, **P1** materially incomplete, **P2** minor.

### Decision consistency at a glance (006, 008, 012)

| Phase | Accepted option | Reflected in the phase docs? | Leftovers |
|-------|-----------------|------------------------------|-----------|
| 006 | Widen the upcast | Yes, in scope, requirements and tasks | F006-3, X-8 |
| 008 | Support custom review dimensions | Yes in the reducer plan, not in the surfaces that still hard-code four names | F008-1, F008-3, X-8 |
| 012 | Three seats per council attempt, at most one retry per pivot | Yes in scope and tasks, but the retry is not designed | F012-2, F012-3, X-8 |

---

## Phase 001 - completed-run extension

Line claims checked and correct: `on_completed_session` at `C/deep-research.yaml:515-519` and `C/deep-review.yaml:584-587`, `note_deferred_branches` at research `:514` and review `:538`, `step_check_max_duration` at research `:882-905`, the stop order in `S/runtime/scripts/convergence.cjs:1115-1159`.

### F001-1 (P1) The flag has no binding surface in the file list

- Claim: `--extend=N` is added through the command docs, the YAMLs and the config assets.
- Verdict: INCOMPLETE. The setup binding for `lineage_mode` lives in the presentation assets, and neither is listed.
- Evidence: `C/deep-research-presentation.txt:47`, `:70`, `:107-108` and `C/deep-review-presentation.txt:39`, `:72`, `:120-121` bind `lineage_mode: auto|resume|restart`. `S/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts:222` tests that "research.md and the presentation bind lineage_mode".
- Fix: add both presentation files to the file list and a binding case to `workflow-restart-lifecycle.vitest.ts`.

### F001-2 (P1) The T001 inventory cannot find the reducer consumers

- Claim: T001 inventories consumers with `rg -n 'run_resumed'`, and the spec cites research `reduce-state.cjs:2245` and review `:497`.
- Verdict: INCOMPLETE. The reducers match the legacy event name `resumed`, not the stem, and there are five sites, not two.
- Evidence: `S/deep-research/scripts/reduce-state.cjs:2245` (lineage filter) and `:2294` (terminal-stop lifecycle check). `S/runtime/scripts/reduce-state.cjs:497` (lineage filter), `:549` (`buildTerminalStopState` lifecycle check), `:591`. With the recommended default for open question 4 (do not project `resumed`), `buildTerminalStopState` keeps the run terminal until the first new iteration lands, and review `continuedFromRun` is nulled by `terminalStop ? null` at `:495-528`. The legacy row name that `run_extended` projects to is not stated anywhere.
- Fix: grep `'resumed'` and `'restarted'` as well, list all five sites, name the projected row, and add a case "extended run is not terminal before its first new iteration" for both reducers.

### F001-3 (P1) Fan-out packets bypass the step the extension lives in

- Claim: the extension runs as a locked step before session classification.
- Verdict: INCOMPLETE. A fan-out run never reaches that step.
- Evidence: `C/deep-research.yaml:327-357`. `step_fanout_spawn` says "jump directly to phase_synthesis - skip phase_init and phase_main_loop entirely". `step_acquire_lock` is at `:408` and `step_classify_session` at `:427`, both inside `phase_init`.
- Fix: reject `--extend` together with fan-out in preflight (`:369`) with a named error, or define per-lineage extension. Add the case either way.

### F001-4 (P2) Four open questions are undecided while the parent says nothing waits

- Claim: parent `spec.md:155` says "No phase waits on a decision now".
- Verdict: OVERSTATED. `001-completed-run-extension/plan.md:42` and `tasks.md:126` (CHK-004, P0) require open questions 1 to 4 in spec §10 to be decided first. The phase `decision-record.md` holds an unrelated Q001 about the generation-1 orchestrator choice.
- Fix: record the four defaults as accepted rows in the 001 decision record, or soften the parent sentence.

### F001-5 (P2) Deferred-wording sites that T020 misses

- Evidence: the REQ-010 grep for "deferred" does not match `S/deep-research/README.md:197` ("declared in the lifecycle vocabulary but not wired"), `S/deep-research/references/guides/capability-matrix.md:44`, `:84`, `S/deep-research/feature-catalog/loop-lifecycle/initialization.md:27` or `S/deep-research/references/protocol/loop-protocol.md:119` ("MUST NOT be exposed").
- Fix: add these files, and widen the REQ-010 grep to "not wired", "reserved" and "MUST NOT be exposed".

### F001-6 (P2) Test gaps and loose assertions

- REQ-013 covers only a run that completed on `all_questions_answered`. It does not cover review `all_dimensions_clean`, nor a run that completed on consecutive failures, which re-stops at `convergence.cjs:1127` even under `off` (`:1134` comes after it).
- The duration case "asserts one dispatch". It should assert `reached == false` from `step_check_max_duration` (`C/deep-research.yaml:882-905`), which is the thing the change controls.
- T025 names no telemetry suite. `S/runtime/tests/unit/loop-heartbeat.vitest.ts` is the one.
- Research `run_resumed` is `reserved` in `S/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts:760`, while `run_restarted` is spoken. The producer-table task should say which class `run_extended` joins, because `check-ledger-stem-producers` checks it.

---

## Phase 002 - research Claude config dir

Code line claims checked and correct: `validateFlags` at `S/runtime/scripts/dispatch-iteration.cjs:213-220`, the config-dir line at `:355-357`, the research executor object at `:407-413`, `C/deep-research.yaml:1440-1448` (no `--claude-config-dir`), `C/deep-review.yaml:1517-1526` (has it).

### F002-1 (P0) All three named test suites are the wrong home, and REQ-006 cites a test that does not exist

- Claim: new cases go into `tests/stress/cli-adapter/cli-claude-code.vitest.ts`, `tests/unit/cli-matrix.vitest.ts` and `tests/unit/combo-matrix.vitest.ts`, and an existing review test asserts `missing required flag '--claude-config-dir'`.
- Verdict: WRONG. None of the three suites exercises `dispatch-iteration.cjs`, and no test in the repository contains that message.
- Evidence:
  - `S/runtime/tests/stress/cli-adapter/cli-claude-code.vitest.ts` is 7 lines: `defineAdapterStressSuite('cli-claude-code')`. The suite drives `fanout-run.cjs` (`fixtures/adapter-suite.ts:50`, `CLAUDE_CONFIG_DIR` assert at `:296`).
  - `S/runtime/tests/unit/cli-matrix.vitest.ts` tests a local `buildDispatchCommand` and `parseExecutorConfig`.
  - `S/runtime/tests/unit/combo-matrix.vitest.ts:193` is a `fanout-run.cjs` matrix.
  - The real flag tests are `S/runtime/tests/unit/dispatch-iteration.vitest.ts:45-93` and `S/runtime/tests/executor-audit-cli-branch-receipts.test.ts:164-224`.
  - `S/runtime/tests/unit/executor-branch-contract.vitest.ts:20` pins the `if_cli_claude_code` branch in both YAMLs.
- Consequence: a builder who follows the plan adds cases that pass without touching the changed code, and the baseline in T001 does not cover it.
- Fix: put the required-flag and forwarding cases in `dispatch-iteration.vitest.ts`, the env assertion in `executor-audit-cli-branch-receipts.test.ts`, add the missing review required-flag case first as the reference, and check `executor-branch-contract.vitest.ts` after the YAML edit. See also X-1 (compiled contract) and X-7 (the test command).

---

## Phase 003 - review minIterations floor

Line claims checked and correct: the floor at `convergence.cjs:1159` is research-only, and `stopDecisionConfig` at `:1344-1368` reads `config.minIterations ?? antiConvergence.minIterations`.

### F003-1 (P1) An existing test asserts the opposite, and it is not in the file list

- Claim: T007 expects "baseline plus new cases", and the success criteria keep existing suites green.
- Verdict: CANNOT HOLD as written.
- Evidence: `S/runtime/tests/unit/stop-decision.vitest.ts:905-913`, case `'does not apply the iteration floor to review'`, asserts that `reviewInput({ iterationCount: 1, config: { minIterations: 3 } })` returns `STOP` / `converged` / `all_dimensions_clean`. The same case shows that a review stop at iteration 1 can be built by direct input.
- Fix: add `stop-decision.vitest.ts` to the file list, invert that case, and state the baseline as "one case changed, N added".

### F003-2 (P2) No workflow or doc line for the new review blocker

- Evidence: `C/deep-review.yaml` has no `minIterations` or `minIterationsNotReached` handling, and `S/deep-review/README.md:155` describes the floor. The stop-order prose that research carries (`C/deep-research.yaml:963-1015`) has no review twin for the floor.
- Fix: add the review YAML stop-order line and the README sentence, then regenerate the review contract (X-1).

---

## Phase 004 - focus hijack fix

### F004-1 (P1) The literal-equality filter does not cover the instance that was observed live

- Claim: REQ-001 drops a carried-forward entry when its text equals an answered question.
- Verdict: INCOMPLETE. The D5 instance was a status sentence under "Questions Remaining", which equals no question. Two open questions in the spec (`004-focus-hijack-fix/spec.md:140` and the one after it) still need an operator answer, against parent `spec.md:155`.
- Evidence: `S/runtime/lib/deep-loop/continuity-thread.cjs:76-118` carries every list item under the heading forward, with no check that it is a question.
- Fix: add a "stale status sentence" fixture case, decide the rule (for example, carry forward only items that resolve to a registry question id or end in a question mark), and record it.

### F004-2 (P1) The filter's call site is in `buildRegistry`, with four more consumers

- Claim: the filter sits in the Next Focus path.
- Verdict: INCOMPLETE. `buildCarriedForwardOpenQuestions` is called from `buildRegistry`, not from `resolveNextFocus`.
- Evidence: `S/deep-research/scripts/reduce-state.cjs:2587` (call), `:2594` and `:2618` (persisted registry field), `:2644` (metric), `:2801` (strategy section). `resolveNextFocus` is `:2420-2473`. The prompt-pack carried-forward list reads the same field.
- Fix: say where the filter runs. If it runs in the shared helper, list the four consumers and add a default-path risk row for the changed registry field and metric. If only Next Focus should change, filter in `deriveNextFocusFromContinuity` (`continuity-thread.cjs:130-164`).

### F004-3 (P1) The review twin does not steer dispatch

- Claim: fixing the review reducer's Next Focus stops stale text steering a review run.
- Verdict: INCOMPLETE. Review dispatch is driven by `next_dimension`, not by the reducer's Next Focus.
- Evidence: `C/deep-review.yaml:904` extracts "the next uncovered dimension from dimension_queue in strategy.md", and the review pack carries `Dimension: {next_dimension}`. The reducer text at `S/runtime/scripts/reduce-state.cjs:2173-2187` is read only by the agent (`.skilled/agents/deep-review.md:161`). The same expression is repeated for the dashboard at `:2271-2274`, which the file list omits.
- Fix: list `:2271-2274`, state which input steers the dispatched dimension, and add a test at that level, or narrow the review claim to "the strategy and dashboard text".

### F004-4 (P2) Small items

- The cite `continuity-thread.cjs:80-118` is `:76-118`.
- REQ-002's reader matches a heading the pack does not yet emit. It is inert until 005 lands (see X-4).

---

## Phase 005 - prompt-pack contract alignment

Claims checked and correct: allowed write paths at `S/deep-research/assets/prompt-pack-iteration.md.tmpl:42-45`, the heading list at `:61`, the agent's `## Recommended Next Focus` at `.skilled/agents/deep-research.md:228`, `extractSection(markdown, 'Recommended Next Focus')` at `S/deep-research/scripts/reduce-state.cjs:1930`. This is the only phase that plans a compiled-contract regeneration.

### F005-1 (P2) The static path `research/research.md` is wrong for a fan-out lineage

- Evidence: the template's own lineage rule at `:48` sends lineage writes to the lineage directory, where the file is `${lineageDir}/research.md`. Detached executors read the raw template (`S/runtime/scripts/fanout-run.cjs:1617-1625`).
- Fix: word the allowed path relative to the run's artifact directory, and add a lineage render case.

---

## Phase 006 - state-log leaf fields (decision: widen the upcast)

The four-point chain is correct: upcast `S/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:634-660`, schema `deep-research-ledger-schema.ts:657-660`, type `deep-research-ledger-types.ts:185-200`, projection writer `S/runtime/lib/legacy-projections/deep-research-contract.ts:312-325`.

### F006-1 (P1) Default-path effects are understated

- Claim: widening switches on the findings gate and the `focusAlignment` guard.
- Verdict: INCOMPLETE. Three more consumers switch on, and the guard has no recovery path.
- Evidence:
  - `S/deep-research/scripts/reduce-state.cjs:2492-2496`: a record with a single `keyQuestions` entry resolves that question. This changes when `all_questions_answered` fires.
  - `:1737-1742` and `:1986` read `sourcesQueried`. `:2948-2950` render the `focusTrack` and `findingsCount` dashboard columns.
  - `S/runtime/scripts/convergence.cjs:871-885`: `focusAlignment` is computed over all records, so one violating record makes `qualityGuardFailed` return CONTINUE (`:1167-1169`) for the rest of the run.
  - The pack's record shape at `S/deep-research/assets/prompt-pack-iteration.md.tmpl:66` names neither `keyQuestions` nor `findingsCount`, while the agent's shape at `.skilled/agents/deep-research.md:246` names both. Generation 2 wrote `keyQuestions` with a "Q1: " prefix, so an exact-match consumer can miss.
- Fix: enumerate these consumers in the risk table, add a case for each, add the two fields to the pack record shape (file shared with 005 and 010), and either scope `focusAlignment` to a window or define how a run recovers.

### F006-2 (P1) The route-proof test has no task, and the field list is never written down

- Claim: plan §5 promises a route-proof survival test. The spec talks about "route-proof and telemetry fields".
- Verdict: UNTESTABLE as written. No task creates the test, and no doc lists the fields, so "all fields arrive" cannot be checked.
- Evidence: `S/runtime/scripts/verify-iteration.cjs:500-503` already falls back to the delta for route proof. The comment there goes stale once the projection carries the fields.
- Fix: list the exact field names in REQ-005, add the task, and update the `:500-503` comment in the same change.

### F006-3 (P2) Decision leftovers

- `006-state-log-leaf-fields/spec.md:98` (REQ-001) says the decision record "holds one row". It holds OD-001 and Q001.
- `spec.md:129` still lists "Operator decision on parent §12 item 6" as a blocking dependency.
- A risk row still says "both branches are planned".
- REQ-006 and tasks T007/T008 are missing from the numbering, where the rejected option was removed.
- The decision record files the operator's verbatim answer "we want best ux and logic" under the label "Read from delta (Recommended)" while recording option 1. The caller confirms widen. Fix the label so the record cannot be read as the other option.

---

## Phase 007 - source diversity quality_class

### F007-1 (P1) The plan derives the class from `name` and `id` and ignores `path`

- Claim: derive `quality_class` at upsert from the node name, then the id. Open question 2 asks whether a path is available.
- Verdict: INCOMPLETE. The path is already required and already reaches the upsert.
- Evidence: `S/deep-research/assets/prompt-pack-iteration.md.tmpl:86` requires `"path"` on SOURCE nodes that name a file. `S/runtime/scripts/iteration-graph-upsert.cjs:143` passes `{ ...event, name: ... }`, so `path` reaches `S/runtime/scripts/upsert.cjs:211-245`, where it is dropped.
- Fix: derive from `n.path` first, then `name`, then `id`. Close open question 2. Check `SAFE_METADATA_KEYS` at `S/runtime/lib/coverage-graph/coverage-graph-query.ts:123-136` so the new key survives a read.

### F007-2 (P1) The signal counts distinct classes, so D1 stays open for single-class runs

- Claim: Purpose and REQ-004 say source diversity will reflect the sources consulted.
- Verdict: WRONG WORDING, and the fix is partial.
- Evidence: `S/runtime/lib/coverage-graph/coverage-graph-signals.ts:653-690` counts distinct `quality_class` values per question and averages them. The threshold is 1.5 at `S/runtime/scripts/convergence.cjs:437` with the blocker at `:448`. A code-only run gets one class per question, so `source_diversity_guard` still blocks. Phase 010 lists 007 as a dependency for exactly this guard.
- Fix: decide one of: finer classes for repository sources, a lower threshold, or counting distinct sources. Add a code-only fixture that must pass, and close `007-source-diversity-quality-class/spec.md:135`.

---

## Phase 008 - custom review dimensions (decision: support custom)

### F008-1 (P1) Support is planned in the reducer and one YAML line, while the rest of the surface hard-codes four names

- Claim: every configured dimension is tracked and can be covered.
- Verdict: INCOMPLETE. A custom dimension has no way in, no rubric for the leaf and no place in the order.
- Evidence:
  - `C/deep-review.yaml:54` (input), `:628-641` (fixed risk order), `:644-654` ("Every element MUST be one of the four canonical dimension names" at `:654`), `:782` (four-key `dimensionCoverage`), `:2324-2330` (dimension table).
  - `.skilled/agents/deep-review.md:170`, `:189`, `:338`.
  - The review prompt pack hard-codes four dimensions at line 38.
  - `C/deep-review-presentation.txt:35`, `:183`.
  - `S/deep-review/assets/review-mode-contract.yaml:62-82`.
  - The strategy and dashboard assets.
- What already works: `S/deep-review/scripts/divergent-review-pivot.ts:212-219` seeds from `config.reviewDimensions`, so the pivot path accepts any name.
- Fix: add these files, with an input surface, an ordering rule and a leaf rubric for a custom name, or narrow REQ-003 to "a custom dimension written in the config is tracked".

### F008-2 (P2) Consumers and signatures the plan misses

- `deriveDimension` at `S/runtime/scripts/reduce-state.cjs:1213-1220` falls back to `'correctness'` and is not in the consumer list.
- `buildDimensionCoverage(iterationRecords, strategyDimensions)` at `:1223-1250` (call at `:1937`) has no config parameter. The config is loaded at `:2522-2537`. The plan needs a signature change it does not name.
- A config with a subset of the four names shrinks the registry keys, so "default runs do not change" holds only for the four-name default. Say so.
- The other `REQUIRED_DIMENSIONS` uses are `:1215`, `:1225`, `:1246`, `:2173`, `:2178`, `:2185`, `:2272`, `:2301`, `:2763`. No other file imports the constant.

### F008-3 (P2) Decision leftovers

- `008-review-dimension-coverage/plan.md:94`: the rollback trigger "a contract-compliant review run fails the new check" is text for the rejected enforce option.
- `spec.md:95` (REQ-001) says one decision row. Two exist.
- REQ-002, T003, T004 and T008 are missing from the numbering.
- The spec title still says "out-of-contract".

---

## Phase 009 - fan-out review coverage merge

Line claims checked and correct: `mergeReviewRegistries` at `S/runtime/scripts/fanout-merge.cjs:869-997` returns no coverage surfaces (`:981-996`).

### F009-1 (P2) The inventory grep finds nothing useful, and `frontier` is not merged

- T002 `rg mergedRegistry` matches only `fanout-merge.cjs` itself. Readers open the merged registry by file name. Grep the file name instead.
- The merge does not carry a `frontier` field, which the 011 pilot reads from the merged registry (X-3).

---

## Phase 010 - research frontier mode

### F010-1 (P0) The fan-out partition assumes depth-1 nodes that cannot exist yet

- Claim: REQ-010, AC-012 and T019-T020 partition open depth-1 frontier nodes across lineages when the lineage prompts are built.
- Verdict: WRONG. Lineages are spawned before any iteration runs, and no step seeds or decomposes a frontier before that.
- Evidence:
  - `C/deep-research.yaml:327-357`: `step_fanout_spawn` runs first and skips `phase_init` and `phase_main_loop`.
  - `S/runtime/scripts/fanout-run.cjs:31` (flag list) and `:1658-1680` (lineage params) pass `convergenceMode` and no depth mode. The YAML passes `--convergence-mode` at `:354` and nothing for depth.
  - Nothing persists the partition, and `fanout-merge.cjs` (`mergeResearchRegistries` at `:758`) merges no `frontier`.
- Consequence: a builder implements T019-T020 against an empty frontier. Each lineage then runs in default mode.
- Fix: add a pre-spawn seed step that decomposes the topic into depth-1 nodes, pass `--depth-mode` to lineages, persist the partition in the fan-out manifest, and merge `frontier`. Or move fan-out out of this phase and say so in REQ-010.

### F010-2 (P1) Node status has no durable store

- Claim: nodes move through active, exhausted, blocked, abstained and pruned.
- Verdict: INCOMPLETE. The registry is rebuilt on every reduce, and the inbox cannot carry status.
- Evidence: `readInboxQuestions` at `S/deep-research/scripts/reduce-state.cjs:1137-1175` keeps six fields (`text`, `id`, `source`, `origin`, `injectedAtIteration`, `promotedQuestionId`). `buildRegistry` (`:2480`) rebuilds from inputs. The research upcast validates exact fields (`hasExactFields`), so a status cannot ride an existing event.
- Fix: name the durable rows (inbox fields or a new event with a schema), their writer, and a "reduce twice gives the same frontier" test.

### F010-3 (P1) Flag plumbing surfaces are missing

- Evidence: `C/deep-research-presentation.txt` binds `convergence_mode` at `:46`, `:68`, `:105`, `:139`, `:197`, `:211` and has no depth mode. The YAML needs the input (near `:71`), preflight (`:369`), `step_read_state` (`:868`) and the convergence CLI call (`:947`).
- Fix: add each to the file list and tasks, with a `stop-decision-yaml-contract` case.

### F010-4 (P1) The `## FRONTIER` block cannot be rendered conditionally

- Claim: the pack gains a frontier block in expansive mode, and default packs stay byte-identical.
- Verdict: CANNOT HOLD as written.
- Evidence: `renderPromptPack` at `S/runtime/lib/deep-loop/prompt-pack.ts:69-85` is plain token substitution and throws `PromptPackError` on any missing variable. `render_prompt_pack.variables` at `C/deep-research.yaml:1376-1398` is not in the tasks. A token on its own line leaves a blank line in default mode. Detached executors read the raw template (`fanout-run.cjs:1617-1625`).
- Fix: add the variable to the YAML list with an empty default, place the token so an empty value changes no byte, add a byte-identity golden, and cover the detached path.

### F010-5 (P1) T021 edits a file that does not render the dashboard

- Evidence: `010-research-frontier-mode/tasks.md:90` names `S/deep-research/assets/deep-research-dashboard.md`. The dashboard is rendered by `renderDashboard` at `S/deep-research/scripts/reduce-state.cjs:2848` (output path at `:3114`).
- Fix: point T021 at `renderDashboard` and add a reducer test.

### F010-6 (P2) Smaller items

- A `depthMode` passthrough in `stopDecisionConfig` (`convergence.cjs:1344-1368`) changes the echoed `inputs.config` for default runs unless the key is added only when set. The `'echoes the input unchanged'` test in `stop-decision.vitest.ts` will show it.
- T014 and T018 verify YAML prose that Vitest cannot run. T018 is also covered by the veto.
- Three ADRs in `plan.md:215`, `:230`, `:245` are Proposed, while `tasks.md:41` requires Accepted.
- The helper script has no name. `frontier-admit.vitest.ts` does not exist yet, which is expected.
- The `$U/...` test paths do not say which directory to run from (X-7).

---

## Phase 011 - review frontier mode

### F011-1 (P1) Admitted nodes have no persistence

- Claim: admitted nodes are "handed to the reducer".
- Verdict: INCOMPLETE. Review has no inbox, and the registry is rebuilt each reduce (`S/runtime/scripts/reduce-state.cjs:1984-2003`).
- Fix: name the durable row, its schema and writer, as in F010-2.

### F011-2 (P1) Frontier steering goes through a text the dispatcher does not read

- Evidence: dispatch reads `next_dimension` at `C/deep-review.yaml:904`. The reducer's Next Focus is advisory text (F004-3). `step_read_state` is not in the file list.
- Fix: add `step_read_state` and the pack variable, and state how an admitted node becomes the dispatched focus.

### F011-3 (P1) The pilot needs three things no phase delivers

- Claim: REQ-010 and T022 run a pilot and read `.frontier.stats` from the merged registry.
- Verdict: CANNOT RUN as planned. It needs init-time seeding of nodes, a fan-out partition (the F010-1 hole) and a merged `frontier`, which neither 009 nor T019 produces (`fanout-merge.cjs:981-996`).
- Fix: see X-3.

### F011-4 (P1) T020 names the dashboard asset, not the reducer

- Evidence: `011-review-frontier-mode/tasks.md:89`. The review dashboard rows come from `S/runtime/scripts/reduce-state.cjs:2301` and the lines around it.
- Fix: point T020 at the reducer.

### F011-5 (P1) The flag is added to `review.md` without its binding surfaces

- Evidence: `C/deep-review-presentation.txt` binds `convergence_mode` at `:35`, `:72`, `:183`, `:225` and has no depth mode. The YAML input block (`:54-58`), `step_read_state` and the convergence call are not listed.
- Fix: add them, as in F010-3.

### F011-6 (P2) Smaller items

- ADR-002 needs per-node dimension coverage state. No task adds it.
- The depth-1 band rule gives one iteration per node, against "up to four" elsewhere in the plan.
- Both ADRs (`plan.md:213`, `:229`) are Proposed while `tasks.md:41` requires Accepted.

---

## Phase 012 - pivot hygiene (decision: three seats per attempt, one retry per pivot)

Line claims checked and correct: defaults at `S/runtime/lib/deep-loop/divergent-pivot.ts:284-289`, `preflightFailure` at `:730-743`, `parsePersistedLimits` at `:1023-1035`, `councilSeatOutputs + 3` at `:1486`, finalize steps at `C/deep-research.yaml:1112` and `C/deep-review.yaml:1206`.

### F012-1 (P1) Seat usage is counted in two files the plan does not list

- Claim: the cap scope changes in `divergent-pivot.ts`.
- Verdict: INCOMPLETE. That file receives a usage number. The number is computed elsewhere, as a lifetime count.
- Evidence: `S/deep-research/scripts/divergent-research-pivot.ts:420` and `S/deep-review/scripts/divergent-review-pivot.ts:405`: `pivotEvents.filter((event) => event.event === 'pivot_seat_returned').length`.
- Fix: add both files, and scope the count to the current pivot id and attempt there. `divergent-review-pivot.ts` is also edited by 011.

### F012-2 (P1) The retry is not designed against the fixed seat ids

- Claim: one retry per pivot with three fresh seats.
- Verdict: INCOMPLETE. The attempt has no identity anywhere in the data.
- Evidence: `REQUIRED_SEAT_IDS = ['seat-001','seat-002','seat-003']` at `divergent-pivot.ts:283`, enforced at `:500-501`. Event ids are `${pivotId}:pivot_seat_returned:${seatId}` at `:600-601`, so a second attempt collides with the first. Both YAMLs loop `seat_id in [seat-001, seat-002, seat-003]` (`C/deep-research.yaml:1084`, `C/deep-review.yaml:1178`). `failureReasonForQuorum` is `:719-728`. T009 puts the test in `tests/council/multi-seat-dispatch.vitest.ts`, while the workflow, not that module, drives the seats.
- Fix: add an attempt number to the event id and the persisted config, define which quorum reasons retry (REQ-003 already excludes `council_agreement_failed`), add the retry loop to both YAML pivot branches, and test it in `tests/integration/divergent-pivot.vitest.ts`.

### F012-3 (P2) Decision leftovers

- `012-pivot-hygiene/spec.md:99` (REQ-001) asks for "one Operator Decisions row" naming per-pivot or lifetime. The record has five rows and the accepted answer is neither word.
- A risk row still says tasks wait for ADR-001.
- `decision-record.md:76` bolds "Per pivot, default 6" in the alternatives table. The accepted decision is 3 per attempt.
- `decision-record.md:115` says "One check and one usage line change", which is no longer the size of the change (F012-1, F012-2).

---

## Phase 013 - no redispatch of a landed iteration

Line claims checked and correct: `redispatch_once` at `C/deep-research.yaml:1539` and `C/deep-review.yaml:1634`; in `S/runtime/scripts/verify-iteration.cjs` the narrative check at `:479`, state record at `:520`, delta at `:530` and `EXECUTOR_MISSING` at `:573`. Existing `executor_missing` cases are at `S/runtime/tests/unit/verify-iteration.vitest.ts:786-811`.

### F013-1 (P2) The "existing still-fails path" records a landed iteration as an error

- Claim: `executor_missing` goes to the existing still-fails path.
- Verdict: CORRECT but the consequence is not stated. This is today's end state too, reached one dispatch later.
- Evidence: the rule ends "record the iteration as error and continue". The row for that is `if_other_failure` at `C/deep-research.yaml:1646-1650`: a second `type: iteration` row for the same number with `status: error` and `findingsCount: 0`. Inferred, not run: the reducers and `deriveLoopCounters` (`convergence.cjs:1288-1342`) then see a failure for an iteration whose narrative, record and delta all landed. A reducer fixture with both rows would confirm it.
- Fix: add that fixture, and decide whether a landed iteration with missing executor provenance should count as a failure or keep its record with a warning.

### F013-2 (P2) Test plan

- SC-001 runs `stop-policy-yaml-parity.vitest.ts`, which nothing in this phase touches. The new YAML assertion goes into `verify-iteration.vitest.ts`.
- The fix is prose the orchestrator reads, so the test pins wording, not behavior. The spec says so in its risk row. Keep the two rules word-identical so one assertion covers both.
- The command form is wrong (X-7), and the YAML edits need a contract regeneration (X-1).

---

## Phase 014 - docs, playbooks and alignment

Checked and correct: every playbook and catalog directory the spec names exists (`S/runtime/manual-testing-playbook/{executor,prompt-rendering,coverage-graph,council}`, `S/runtime/feature-catalog/...`, `S/deep-review/feature-catalog/review-dimensions`), the create command takes `<skill-name> [create|update] [--path <dir>]`, and both `/local-*-alignment` commands exist.

### F014-1 (P1) REQ-005 and REQ-007 cannot both hold

- Claim: both alignment checks end with zero open findings (REQ-005), and the phase diff holds only playbook and catalog `.md` files (REQ-007).
- Verdict: CANNOT HOLD together. The alignment checks read every live doc and connected surface. The reference docs, READMEs, SKILL.md files, presentation assets, agent mirrors and compiled contracts for the new flags are owned by no phase (X-1, X-2, X-6), so the checks will report them, and 014 may only "hand each code finding to its owning phase", which is closed by then (T001 requires all thirteen complete).
- Fix: either widen the 014 file list to the reference docs, READMEs, SKILL.md files and contract regeneration, or add those tasks to the owning phases now. State who fixes a doc finding outside the two create commands.

### F014-2 (P2) "Each implementation phase owns its own changelog note" is not true of the plans

- Evidence: only 006 plans a changelog entry as a requirement (REQ-008, T013). 001 has it as a P2 checklist line (`tasks.md:182`). 004 and 007 write the note into `implementation-summary.md` (their T010). 002, 003, 005, 008, 009, 010, 011, 012 and 013 plan none. 003, 005 and 008 change default-path behavior, and research §15 asks for changelog entries for those.
- Fix: add a changelog task to each phase that changes default behavior or adds a flag, under `S/changelog/`.

---

## Cross-phase findings

### X-1 (P1) Compiled-contract regeneration is planned in one phase and needed in most

- Claim: only 005 regenerates a compiled contract.
- Verdict: INCOMPLETE. `C/compiled/deep-research.contract.markdown` (lines 7-87) and `deep-review.contract.markdown` carry sha256 digests of the command doc, the presentation asset, the workflow YAML, `mode-registry.json`, the hub and mode `SKILL.md`, `loop-protocol.md`, `state-format.md`, `convergence.md`, the config and strategy assets, the prompt-pack template and the agent definition. CI checks drift at `.github/workflows/deep-loop-runtime.yml:88`, and `S/runtime/tests/unit/check-contract-drift.vitest.ts` does the same locally.
- Phases that change a digested source without a regeneration task: 001, 002, 003 (if F003-2 is taken), 008, 010, 011, 012, 013, and 014 if it edits reference docs.
- Second effect: two phases built in parallel both rewrite the same two contract files, so every merge conflicts there.
- Fix: add "regenerate and commit the contract" as the last implementation task of each such phase, and regenerate again after each merge instead of resolving the digest lines by hand.

### X-2 (P1) Agent definition edits need the runtime mirrors

- Evidence: 001, 010 and 011 edit `.skilled/agents/deep-research.md` or `deep-review.md`. Mirrors exist in `.claude/agents/`, `.codex/agents/*.toml`, `.pi/agents/`, `.vibe/agents/*.toml` and `.dsh/agents/*.patch.yml`, and all ten mirror files contain the `completed-continue` wording that 001 changes. `agent-mirror-sync.yml` checks them.
- Fix: add a mirror-sync task (`/doctor:runtime-mirrors`) to 001, 010 and 011.

### X-3 (P1) 011 assumes deliveries that 009 and 010 do not make

- 011 reads `.frontier.stats` from a merged registry. 009 merges only review coverage surfaces, and 010 merges nothing new.
- 011 reuses "the frontier store" from 010. 010's store is the research inbox, which review does not have (F010-2, F011-1).
- 011 reuses the fan-out partition from 010, which is F010-1.
- Fix: give the merged `frontier` projection to 009 or 010 explicitly, and write the review store as its own design in 011.

### X-4 (P1) The dependency order is right where stated and silent in four places

- Stated and correct: 001 first, 010 after 004-007, 011 after 008-010, 014 last (parent `spec.md:155`).
- Missing:
  - 004 after 005. REQ-002 of 004 reads a heading the pack emits only after 005.
  - 011 after 004 and 003. 011 edits the review focus block that 004 rewrites (`S/runtime/scripts/reduce-state.cjs:2173-2187`) and places its veto relative to the floor that 003 adds for review (`convergence.cjs:1159`).
  - 010 and 011 after 012. 010 T018 gates the pivot branch that 012 rewrites for the retry (`C/deep-research.yaml:1056-1112`, `C/deep-review.yaml:1158-1206`).
  - 013 after 006, or decided together (X-5).
- Fix: change the parent line to "005 before 004; 012 before 010; 003 and 004 before 011", and treat "002-009, 012 and 013 in any order" as true only for 002, 003, 007 and 009.

### X-5 (P1) 006 makes the 013 open question live

- Evidence: 006 switches on `findings_not_enumerated` for research. That reason is returned after the delta check (`verify-iteration.cjs:533-550`), so the iteration has landed, and `redispatch_once` fires on it. 013 excludes only `executor_missing` and leaves the other landed reasons as an open question (`013-no-redispatch-landed-iteration/spec.md:137`). 006 names the redispatch as a risk in its own decision record.
- Consequence: after 006, the wasted dispatch that 013 removes comes back for a new reason.
- Fix: decide the 013 open question before either phase builds. The natural rule is "no redispatch for any reason returned after the delta check, except route-proof", which is `findings_not_enumerated`, `executor_missing`, `gateway_bypass_detected` and `ledger_backing_missing`.

### X-6 (P1) Work the research requires that no phase owns

- Presentation assets for both new flags (research §10 integration map): `C/deep-research-presentation.txt`, `C/deep-review-presentation.txt`.
- Init-time decomposition and pruning of the frontier (research §9). No phase has a seed step.
- The merged `frontier` projection and the `--depth-mode` passthrough to fan-out lineages (`fanout-run.cjs:31`, `:1658-1680`).
- Reference docs for the new behavior: `convergence.md`, `loop-protocol.md`, `state-format.md`, the two quick references, the mode `SKILL.md` and `README.md` files. 014 covers playbooks and catalogs only.
- Changelog entries for default-path changes (F014-2).
- Compiled contracts and agent mirrors (X-1, X-2).

### X-7 (P1) The test commands in 002, 003 and 013 find no tests

- Claim: `cd S && npx vitest run runtime/tests/...` exits 0 (002 `tasks.md:37`, `plan.md:83`; 003 `spec.md:110`, `plan.md:82`, `tasks.md:37`; 013 SC-001, `plan.md` §5, `tasks.md` T001).
- Verdict: WRONG. Run from `S`, Vitest has no config, uses its default include `**/*.{test,spec}.*` and exits 1 with "No test files found". The only config is `S/runtime/vitest.config.ts` (its header says so), with `include: ['tests/**/*.{vitest,test}.ts']` at `:46`.
- Evidence: ran both forms, see the Summary.
- Fix: use the form 006, 008, 009 and 012 already use: from `S/runtime`, `npm test -- tests/unit/<file>`. State the directory in 010 and 011 as well, where `$U/...` paths leave it open.

### X-8 (P2) Rejected-option and pre-decision text outside the three phases

- Parent `spec.md:145-147` still lists "Decisions open before Slices F and H", eight lines above the sentence that says none are open (`:155`). The block is generated, so fix the source and regenerate.
- `research/research.md:390` records the 012 decision as "3 council seat outputs per pivot". The accepted wording is 3 per attempt with one retry, so up to 6 per pivot.
- `research/research.md:561`, `:563` and `:570` still say "decide, then" for Slices F and H.
- Parent `spec.md:60` keeps "Implementing the sub-mode" out of scope while the same file maps fourteen build phases.

### X-9 (P2) Same-function hotspots

These are the places where two phases change the same lines, beyond sharing a file:

- `buildStopDecision`, floor region `convergence.cjs:1159-1169`: 003 (review floor), 010 and 011 (veto placed after the floor).
- `stopDecisionConfig`, `convergence.cjs:1344-1368`: 010 and 011.
- Review strategy focus block `S/runtime/scripts/reduce-state.cjs:2173-2187` and its dashboard twin `:2271-2274`: 004, 008 and 011.
- `buildDimensionCoverage` `:1223-1250` and the registry assembly `:1984-2003`: 008 and 011.
- Research `buildRegistry` `S/deep-research/scripts/reduce-state.cjs:2480-2620`: 004 and 010. `buildLineageState` `:2245`: 001.
- Research upcast `legacy-compatibility.ts:32-60` and `:634-660`, with the schema and type files: 001 (new stem) and 006 (wider stem).
- Pivot branch in both YAMLs: 010, 011 and 012.
- `render_prompt_pack.variables` `C/deep-research.yaml:1376-1398` and the research template record shape `:66`: 005, 006 (if F006-1 is taken) and 010.
- `mergeReviewRegistries` return `fanout-merge.cjs:981-996`: 009 and 011.

---

## Shared files touched by more than one phase

For parallel scheduling. A phase in brackets touches the file only if the fix from this review is taken.

### Workflow, command and asset files

| File | Phases |
|------|--------|
| `C/deep-research.yaml` | 001, 002, 010, 012, 013 |
| `C/deep-review.yaml` | 001, 008, 011, 012, 013, [003] |
| `C/compiled/deep-research.contract.markdown` | 005, [001, 002, 010, 012, 013] |
| `C/compiled/deep-review.contract.markdown` | [001, 003, 008, 011, 012, 013] |
| `C/deep-research-presentation.txt` | [001, 010] |
| `C/deep-review-presentation.txt` | [001, 008, 011] |
| `.skilled/commands/deep/research.md` | 001, 010 |
| `.skilled/commands/deep/review.md` | 001, 011 |
| `.skilled/agents/deep-research.md` and its runtime mirrors | 001, 010 |
| `.skilled/agents/deep-review.md` and its runtime mirrors | 001, 011, [008] |
| `S/deep-research/assets/prompt-pack-iteration.md.tmpl` | 005, 010, [006] |
| Review prompt-pack template | 011, [008] |
| `S/deep-research/assets/deep-research-config.json` | 001, 010 |
| Review config asset | 001, 011 |
| `K/optimizer/optimizer-manifest.json` | 010, 011 |

### Runtime scripts and libraries

| File | Phases |
|------|--------|
| `S/runtime/scripts/convergence.cjs` | 003, 010, 011 |
| `S/deep-research/scripts/reduce-state.cjs` | 001, 004, 010 |
| `S/runtime/scripts/reduce-state.cjs` (review) | 001, 004, 008, 011 |
| `S/runtime/lib/deep-loop/continuity-thread.cjs` | 004, [010] |
| `S/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts` | 001, 006 |
| `S/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts` | 001, 006 |
| `S/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts` | 001, 006 |
| `S/runtime/lib/legacy-projections/deep-research-contract.ts` | 001, 006 |
| `S/runtime/lib/deep-loop/prompt-pack.ts` | 010, 011 |
| `S/runtime/scripts/fanout-run.cjs` | 010, 011 |
| `S/runtime/scripts/fanout-merge.cjs` | 009, 010, 011 |
| `S/runtime/scripts/verify-iteration.cjs` | [006 comment], 013 reads only |
| `S/runtime/lib/deep-loop/divergent-pivot.ts` | 012, [010, 011 pivot gating] |
| `S/deep-review/scripts/divergent-review-pivot.ts` | 011, [012] |
| `S/deep-research/scripts/divergent-research-pivot.ts` | [012], [010] |
| `S/runtime/scripts/dispatch-iteration.cjs` | 002 only |
| `S/runtime/scripts/upsert.cjs` | 007 only |

### Test files

| File | Phases |
|------|--------|
| `tests/unit/stop-decision.vitest.ts` | 010, 011, [003] |
| `tests/unit/stop-decision-yaml-contract.vitest.ts` | 010, 011, [001] |
| `tests/integration/review-depth-convergence.vitest.ts` | 003, 008, 011 |
| `tests/integration/review-stop-path-replay.vitest.ts` | 003, [011] |
| `tests/unit/deep-review-state-reducer.vitest.ts` | 004, 008, [001, 011] |
| `tests/unit/deep-research-reduce-state.vitest.ts` | 004, 010, [001, 006] |
| `tests/unit/continuity-thread.vitest.ts` | 004 |
| `tests/integration/convergence-script.vitest.ts` | 006, 007 |
| `tests/unit/verify-iteration.vitest.ts` | 006, 013 |
| `tests/unit/append-mode-event-legacy-seam.vitest.ts` | 001, 006 |
| `tests/unit/deep-research-ledger-schema.vitest.ts` | 001, 006 |
| `tests/unit/check-projection-coverage.vitest.ts`, `deep-research-projections-contract.vitest.ts` | 001, 006 |
| `tests/unit/prompt-pack.vitest.ts` | 005, 010, 011 |
| `tests/unit/fanout-merge.vitest.ts` | 009, 010, 011 |
| `tests/unit/fanout-run.vitest.ts` (serial file) | 010, 011 |
| `tests/integration/divergent-pivot.vitest.ts` | 008, 011, 012 |
| `tests/unit/workflow-restart-lifecycle.vitest.ts` | 001 |
| `tests/unit/optimizer-manifest-anti-convergence.vitest.ts` | 010, 011 |
| `tests/unit/check-contract-drift.vitest.ts`, `compile-command-contracts.vitest.ts` | every phase that regenerates a contract |
| `K/tests/deep-review-contract-parity.vitest.ts`, `deep-review-reducer-schema.vitest.ts` | 001, [008] |

All test paths are under `S/runtime/` unless they start with `K/`.

### Scheduling reading

- Safe in parallel with anything: 007 (`upsert.cjs` only) and 009 until 010 or 011 start.
- 002 is small but shares `C/deep-research.yaml` and the research contract with 001, 010, 012 and 013.
- Serialise on the two YAMLs and the two compiled contracts. They are the hottest files: five or six phases each.
- Serialise 001 then 006 on the four ledger files.
- Serialise 004 then 008 then 011 on the review reducer, and 003 then 010 then 011 on `convergence.cjs`.
