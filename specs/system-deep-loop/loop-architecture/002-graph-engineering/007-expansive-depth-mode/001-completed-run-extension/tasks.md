---
title: "Tasks: Completed-Run Extension (--extend=N)"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "completed run extension tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Completed-Run Extension (--extend=N)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Shell variables: `S` is `.skilled/skills/system-deep-loop`, `C` is `.skilled/commands/deep/assets`, `SSK` is `.skilled/skills/system-spec-kit/runtime/cli/tests`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 List every hand-written `run_resumed` handler the new stem needs a twin in (`$S/runtime/lib/`, `$S/runtime/scripts/`, `$S/deep-research/scripts/reduce-state.cjs`). Verify: `rg -n 'run_resumed' $S/runtime $S/deep-research/scripts` and `rg -n "'resumed'|'restarted'" $S/runtime/scripts/reduce-state.cjs $S/deep-research/scripts/reduce-state.cjs` are copied into `scratch/run-resumed-sites.txt`; the output covers the reducers, projections and stem-producer tables named in `spec.md` §3 and the five legacy-name lifecycle sites (research `:2245`, `:2294`; review `:497`, `:549`, `:591`). Done 2026-11-17: `scratch/run-resumed-sites.txt` (51 lines) lists the typed stem sites and the five legacy-name lifecycle sites.
- [x] T002 Record the test baseline before any edit (`$S/runtime`). Verify: `cd $S/runtime && npx vitest run` prints its pass and fail counts, saved to `scratch/baseline.txt`, and `node $S/runtime/scripts/check-contract-drift.cjs` exits 0 on the untouched tree. Done 2026-11-17: `scratch/baseline.txt`, 185 files, 3095 passed, 9 skipped, 0 failed; `check-contract-drift.cjs` exit 0.
- [x] T003 Record the operator's answers, or acceptance of the recommended defaults, for open questions 1 to 4 (`spec.md`). Verify: `rg -n 'Open question [1-4]' spec.md` prints four lines and each carries a decision. Done 2026-11-17: the operator accepted all four recommended defaults, recorded as ADR-001 to ADR-004 in `decision-record.md`.
- [x] T004 Trace every `:confirm` branch from `step_classify_session` onward for a config with status `initialized` (`$C/deep-research.yaml`, `$C/deep-review.yaml`). Verify: `scratch/confirm-branch-trace.md` lists each branch with file:line and its classification, and every one lands on `resume`. Done 2026-11-17: `scratch/confirm-branch-trace.md`; every classification lands on resume, and the trace adds three YAML requirements (extension_pending binding, ADR-004 in both confirm branches, max_iterations binding).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add the `deep_research.run_extended` stem with its payload fields and a stem-producer table row marked `spoken` with `.skilled/commands/deep/assets/deep-research.yaml` as producer (`$S/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts`, `deep-research-ledger-types.ts`). Verify: `rg -n 'run_extended' $S/runtime/lib/deep-research-ledger-schema` prints the schema, type and producer-table lines. Done 2026-11-17 (Pi dispatch): schema rule, `extension-budget` field kind, scope row, types and `spoken` producer row; the grep prints all lines.
- [x] T006 Add the `deep_review.run_extended` stem with its payload fields and a stem-producer table row marked `spoken` with `.skilled/commands/deep/assets/deep-review.yaml` as producer (`$S/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts`, `deep-review-ledger-types.ts`). Verify: `rg -n 'run_extended' $S/runtime/lib/deep-review-ledger-schema` prints the schema, type and producer-table lines. Done 2026-11-17 (Pi dispatch): review twin; sessionId and generation ride in `DeepReviewGenerationScope`.
- [x] T007 Add the legacy `run_extended` row upcast (`$S/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts`). Verify: the upcast case for a legacy `extended` row passes under `cd $S/runtime && npx vitest run tests/unit/deep-research-ledger-schema.vitest.ts`. Done 2026-11-17 (Pi dispatch plus a native fixture row): legacy `extended` row upcasts, a row without a full budget is refused (`run-extended-budget-missing`); `deep-research-ledger-schema.vitest.ts` and `deep-review-ledger-schema.vitest.ts` pass 76 of 76.
- [x] T008 [P] Handle the stem in the research typed reducer's routing table and every `assertNeverStem` switch (`$S/runtime/lib/deep-research-reducers/deep-research-reducer.ts`). Verify: `npx tsc --noEmit` in `$S/runtime` exits 0. Done 2026-11-17 (Pi dispatch): routing row, run fold raises `maxIterations` from the extension, three fall-through labels; `npm run -s typecheck` exits 0 (the package has no local `tsc`, so `npx tsc` cannot run; `typecheck` is its script).
- [x] T009 [P] Handle the stem in the review typed reducer's routing table and every `assertNeverStem` switch (`$S/runtime/lib/deep-review-reducers/deep-review-reducer.ts`). Verify: `npx tsc --noEmit` in `$S/runtime` exits 0. Done 2026-11-17 (Pi dispatch): same for review; typecheck exit 0, `deep-review-reducers.vitest.ts` 95 of 95.
- [x] T010 Write the stem back into the state log as a row with `event: 'extended'` in both legacy projections, beside the `run_restarted` to `restarted` branch (`$S/runtime/lib/legacy-projections/deep-research-contract.ts`, `deep-review-state-contract.ts`). Verify: `node $S/runtime/scripts/check-projection-coverage.cjs` exits 0. Done 2026-11-17 (Pi dispatch): both projections write `event: extended` with `lineageMode: completed-continue`, `continuedFromRun` and the budget; `check-projection-coverage.cjs` exit 0, `npm run -s typecheck` exit 0.
- [x] T011 Add the legacy `extended` row to the five lifecycle sites (research `:2245`, `:2294`; review `:497`, `:549`, `:591`) and add `completed-continue` to `LIVE_LINEAGE_MODES` (`$S/deep-research/scripts/reduce-state.cjs`, `$S/runtime/scripts/reduce-state.cjs`). Verify: `rg -n 'LIVE_LINEAGE_MODES = ' $S/runtime/scripts/reduce-state.cjs` prints a set that includes `completed-continue`, and `rg -c "'extended'" $S/deep-research/scripts/reduce-state.cjs $S/runtime/scripts/reduce-state.cjs` prints 2 and 3. Done 2026-11-17 (Pi dispatch): `extended` added at all five sites; the `rg -c` prints 2 and 3; `LIVE_LINEAGE_MODES` includes `completed-continue`; `node --check` passes on both; the two reducer suites pass 49 of 49.
- [x] T012 Move `completed-continue` from `lineage.deferredModes` to `lineage.allowedModes` in research and add the mode to the review flat lineage fields (`$S/deep-research/assets/deep-research-config.json`, `$S/deep-review/assets/deep-review-config.json`). Verify: `node -e` reading the research config prints `completed-continue` in `allowedModes` and not in `deferredModes`. Done 2026-11-17 (native, a two-line JSON move): research `allowedModes` gains the mode and `deferredModes` keeps only `fork`. The review config has no mode list, only the flat `lineageMode` and `continuedFromRun` fields, which the extension step writes; `LIVE_LINEAGE_MODES` (T011) is what teaches the review reducer the mode.
- [x] T013 Add the `--extend=N` and `--extend-minutes=M` parameters and the lineage param value, rejecting a non-positive or non-integer value before the lock (`$C/deep-research.yaml`, `$C/deep-review.yaml`). Verify: `rg -n 'extend' $C/deep-research.yaml $C/deep-review.yaml` prints the param lines in both files. Done 2026-11-17 (Pi dispatch applying reviewed literal pairs): `extend` and `extend_minutes` user inputs, `lineage_mode` value list, and an `extend_values` preflight check in `step_preflight_contract`, which runs before `step_acquire_lock`.
- [x] T029 Reject `--extend` together with a fan-out config in a pre-spawn guard before `step_fanout_spawn`, beside `step_apply_lifecycle_request`, with a named usage error (`$C/deep-research.yaml:270-327`, `$C/deep-review.yaml:247-304`). Not in `step_preflight_contract`, which sits inside `phase_init` and never runs for fan-out. Verify: in both files the rejection line number printed by `rg -n -i 'extend.*fan-?out'` sits above the `step_fanout_spawn:` line printed by `rg -n`. Done 2026-11-17 (Pi dispatch): `step_reject_extend_with_fanout` sits above `step_fanout_spawn:` in both YAMLs (research 329 vs 341, review 306 vs 318).
- [x] T030 Bind `--extend` and `--extend-minutes` beside `lineage_mode` (`$C/deep-research-presentation.txt:47`, `:70`, `:107-108`; `$C/deep-review-presentation.txt:39`, `:72`, `:120-121`). Verify: `rg -n -- '--extend' $C/deep-research-presentation.txt $C/deep-review-presentation.txt` prints the binding lines in both files. Done 2026-11-17 (Pi dispatch): setup block, resolution-table rows and parse-tree lines in both presentations, plus the review resolved-setup summary.
- [x] T014 Add the locked pre-classify extension step after `step_acquire_lock` and before `step_classify_session`, computing `continuedFromRun`, `maxIterations`, `maxDurationMinutes` and status `initialized`, leaving `createdAt` untouched (`$C/deep-research.yaml`, `$C/deep-review.yaml`). Verify: in both files the new step's line number sits between the `step_acquire_lock:` and `step_classify_session:` lines printed by `rg -n`. Done 2026-11-17 (Pi dispatch inserting a natively tested block): `step_extend_completed_run` sits between `step_acquire_lock` and `step_classify_session` in both YAMLs. A fixture dry run with the gateway stubbed gave `maxIterations` 10 from 7 runs plus 3, `maxDurationMinutes` 420 from 300 elapsed plus 120, an unchanged `createdAt`, and exit 2 with the config untouched on a non-complete run.
- [x] T015 Append `run_extended` through the gateway from the pre-classify step and apply the chosen `resumed` handling in `on_resume` (`$C/deep-research.yaml`, `$C/deep-review.yaml`). Verify: `rg -n 'run_extended' $C/deep-research.yaml $C/deep-review.yaml` prints the append in both files. Done 2026-11-17: the extension step appends `run_extended` through the gateway before replacing the config; `extension_override` on the auto `on_resume` and on the confirm `on_resume_choice` skips the `resumed` append (ADR-004); `extension_rule` keeps the classifier on resume (T004 risk 1).
- [x] T016 Add the synthesis snapshot step with the name chosen for open question 2 (`$C/deep-research.yaml`, `$C/deep-review.yaml`). Verify: `rg -n -e 'synthesis-v' -e 'review-report-v' $C/deep-research.yaml $C/deep-review.yaml` prints the snapshot step in both files. Done 2026-11-17: `step_snapshot_extended_synthesis` and `step_snapshot_extended_review_report` copy to `synthesis-v{generation}-r{continuedFromRun}.md` and `review-report-v{generation}-r{continuedFromRun}.md` and refuse to overwrite.
- [x] T017 Replace `note_deferred_branches` and the YAML comment lines so only `fork` stays deferred (`$C/deep-research.yaml`, `$C/deep-review.yaml`). Verify: `rg -n 'completed-continue.*deferred' $C` prints nothing. Done 2026-11-17: `note_deferred_branches` now names only `fork` (the key is kept because a system-spec-kit assertion pins it), a new `note_live_branches` carries the live mode, and both synthesis notes name the snapshot. `rg -n "completed-continue.*deferred" .skilled/commands/deep/assets` prints nothing.
- [x] T018 Document `--extend=N` and `--extend-minutes=M` in the `--lineage-mode` rows (`.skilled/commands/deep/research.md`, `.skilled/commands/deep/review.md`). Verify: `rg -n 'extend=' .skilled/commands/deep/research.md .skilled/commands/deep/review.md` prints a row in each. Done 2026-11-17 (native doc edit): `--extend` and `--extend-minutes` rows in both command docs plus the argument hint; the first cell holds the bare flag because the flag-parity guard in `compile-command-contracts.vitest.ts` reads only a bare `--flag` token.
- [ ] T019 [P] Update the lifecycle branch contract and the snapshot rule, and state the `stopPolicy: convergence` window (`$S/deep-research/references/protocol/loop-protocol.md`, `$S/deep-review/references/protocol/loop-protocol.md`). Verify: `rg -n 'completed-continue' $S/deep-*/references/protocol/loop-protocol.md` shows no line calling it deferred or saying it MUST NOT be exposed (research `:121`), one line naming the convergence window for `all_questions_answered` and `all_dimensions_clean`, and one line saying a run that completed on consecutive failures re-stops even under `--convergence-mode=off`.
- [ ] T020 [P] Update the remaining deferred-wording lines (`$S/deep-review/assets/review-mode-contract.yaml`, `$S/deep-review/references/state/state-format.md`, both quick references, `$S/deep-research/SKILL.md`, `$S/deep-research/assets/deep-research-strategy.md`, `.skilled/agents/deep-research.md`, `.skilled/agents/deep-review.md`, `$S/deep-review/README.md`, `$S/deep-research/README.md:197`), and check that `$S/deep-research/references/guides/capability-matrix.md:44` and `:84` hold once the mode is live. Keep the `fork` deferral on its own line, apart from any `completed-continue` mention, so the REQ-010 pipeline does not match a correct rewrite. Verify: the REQ-010 command in `spec.md` prints nothing for `.skilled`, apart from `$S/deep-research/feature-catalog/` (T031) and the runtime mirrors (T032).
- [ ] T031 Update `$S/deep-research/feature-catalog/loop-lifecycle/initialization.md:27` through `/create:feature-catalog system-deep-loop update --path $S/deep-research/feature-catalog`, not by hand. Verify: `rg -n 'completed-continue' $S/deep-research/feature-catalog/loop-lifecycle/initialization.md` prints no line saying the mode is not exposed as live.
- [ ] T032 Sync the ten runtime agent mirrors after T020 edits the two agent definitions (`.claude/agents/`, `.codex/agents/`, `.pi/agents/`, `.vibe/agents/`, `.dsh/agents/`), through `/doctor:runtime-mirrors`. Verify: the command reports no drift for `deep-research` and `deep-review`, and the full REQ-010 command in `spec.md` prints nothing.
- [ ] T021 Update the two assertions that pin the deferred wording (`$SSK/deep-review-contract-parity.vitest.ts:126`, `$SSK/deep-review-reducer-schema.vitest.ts:120-121`). Verify: `cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli tests/deep-review-contract-parity.vitest.ts tests/deep-review-reducer-schema.vitest.ts` exits 0.
- [ ] T033 Regenerate both compiled contracts as the last implementation task, after every digested source edit (`$C/compiled/deep-research.contract.markdown`, `$C/compiled/deep-review.contract.markdown`). Verify: `node $S/runtime/scripts/compile-command-contracts.cjs --command deep/research --write` and `--command deep/review --write` exit 0, then `node $S/runtime/scripts/check-contract-drift.cjs` exits 0. After a merge with another phase that regenerated them, rerun both instead of resolving digest lines by hand.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T022 Add the ledger-schema, upcast and `append-mode-event-legacy-seam` cases for `run_extended` (`$S/runtime/tests/unit/deep-research-ledger-schema.vitest.ts`, `deep-review-ledger-schema.vitest.ts`, `append-mode-event-legacy-seam.vitest.ts`). Verify: `cd $S/runtime && npx vitest run tests/unit/deep-research-ledger-schema.vitest.ts tests/unit/deep-review-ledger-schema.vitest.ts tests/unit/append-mode-event-legacy-seam.vitest.ts` exits 0.
- [ ] T023 Add the `run_extended` projection case and the reducer Lifecycle-section parity case (`$S/runtime/tests/unit/deep-research-reducers.vitest.ts`, `deep-review-reducers.vitest.ts`). Verify: `cd $S/runtime && npx vitest run tests/unit/deep-research-reducers.vitest.ts tests/unit/deep-review-reducers.vitest.ts` exits 0 and the projection case asserts the `extended` row in the state log.
- [ ] T034 Add the not-terminal case per reducer: a completed run whose state log ends with `synthesis_complete` then an `extended` row returns no terminal stop, and review keeps `continuedFromRun` (`$S/runtime/tests/unit/deep-research-reduce-state.vitest.ts`, `deep-review-state-reducer.vitest.ts`). Verify: `cd $S/runtime && npx vitest run tests/unit/deep-research-reduce-state.vitest.ts tests/unit/deep-review-state-reducer.vitest.ts` exits 0, and both cases fail before T011.
- [ ] T035 Add the presentation binding case for both loops and the fan-out rejection case (`$S/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts`, beside "research.md and the presentation bind lineage_mode"). Verify: `cd $S/runtime && npx vitest run tests/unit/workflow-restart-lifecycle.vitest.ts` exits 0.
- [ ] T024 Add the 7-of-10 plus `--extend=3` cap case and the duration-ceiling case that starts after the old budget (`$S/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts`, `$SSK/deep-review-auto-restart-contract.vitest.ts`). Verify: `cd $S/runtime && npx vitest run tests/unit/workflow-restart-lifecycle.vitest.ts` and the T021 `system-spec-kit` command with `tests/deep-review-auto-restart-contract.vitest.ts` exit 0; the cap case asserts `maxIterations == 10` and the duration case asserts that `step_check_max_duration` (`$C/deep-research.yaml:882-905`) reports `reached == false` for the extended config.
- [ ] T025 Add the double-terminal telemetry case (two `completed` rows for one sessionId) (`$S/runtime/tests/unit/loop-heartbeat.vitest.ts`, beside "accepts an empty stop reason and still writes the completed terminal row"). Verify: `cd $S/runtime && npx vitest run tests/unit/loop-heartbeat.vitest.ts` exits 0.
- [ ] T026 Run the three guard scripts (`$S/runtime/scripts/check-ledger-stem-producers.cjs`, `check-projection-coverage.cjs`, `check-contract-drift.cjs`). Verify: each exits 0.
- [ ] T027 Rerun the whole suite and compare with the baseline (`$S/runtime`). Verify: `cd $S/runtime && npx vitest run` prints no new failure against `scratch/baseline.txt`.
- [ ] T028 Write one playbook scenario per loop that extends a completed fixture run through `/create:manual-testing-playbook system-deep-loop update --path $S/deep-research/manual-testing-playbook` and the same for `$S/deep-review/manual-testing-playbook`, landing in each `entry-points-and-modes/` category, then walk both. No hand edits to the playbook packages. Verify: each package index lists the new scenario, and the walked scenario records one `run_extended` event, the snapshot file and the original sessionId.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] A fixture run extended from 7 of 10 with `--extend=3` ends at 10 iterations in one session, and the deep-loop suite shows no new failure against the baseline
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Design source**: `../research/research.md` §19 and §20 Slice A; verification rows F1, F6, F7, F8, F16 to F19 in `../scratch/opus-verification-log.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task is marked `[B]` with the blocker named on the line; a `[B]` task blocks close until it is resolved or the operator defers it.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
- [ ] CHK-004 [P0] Open questions 1 to 4 decided (T003) and the `:confirm` trace written (T004). Decision half met 2026-11-17 (T003, ADR-001 to ADR-004); the T004 trace is still open.
- [ ] CHK-005 [P1] The T001 inventory lists the five legacy-name lifecycle sites, not only the `run_resumed` stem sites
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `npx tsc --noEmit` in the deep-loop runtime exits 0
- [ ] CHK-011 [P0] `node --check` passes on both edited `reduce-state.cjs` files
- [ ] CHK-012 [P1] Invalid `--extend` and `--extend-minutes` values exit with a usage error before the lock
- [ ] CHK-013 [P1] No code comment embeds a spec path, phase number or finding id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Playbook entry walked for both loops
- [ ] CHK-022 [P1] Duration-ceiling and second-extension cases pass
- [ ] CHK-023 [P1] Non-complete run and invalid-value cases rejected
- [ ] CHK-024 [P1] Fan-out rejection and not-terminal-before-first-iteration cases pass (T034, T035)
- [ ] CHK-025 [P0] `check-contract-drift.cjs` exits 0 after T033
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] D11 is classed `cross-consumer`: one new stem with many consumers.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed from `rg -n 'run_resumed'` (T001).
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the stem, the config fields, the docs and the two `system-spec-kit` assertions.
- [ ] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix; the input validation cases are covered by CHK-023.
- [ ] CHK-FIX-005 [P1] Matrix axes from `plan.md` (loop, stopPolicy, start time, extension count) and their rows are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] N/A: the change reads no process-wide state beyond the existing config and lock.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the fix commit SHA.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential is read or written by the extension step
- [ ] CHK-031 [P0] `--extend` and `--extend-minutes` accept positive integers only
- [ ] CHK-032 [P1] The config mutation and the event append run under the loop lock
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] `loop-protocol.md` snapshot line and the YAML snapshot step use the same name
- [ ] CHK-042 [P2] Changelog notes the new opt-in flag
- [ ] CHK-043 [P1] The ten runtime agent mirrors are synced (T032)
- [ ] CHK-044 [P1] Playbook scenarios written through `/create:manual-testing-playbook` and the catalog line through `/create:feature-catalog`, with no hand edit to either package
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 17 | 0/17 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet verified (status Planned)
<!-- /ANCHOR:summary -->

---
