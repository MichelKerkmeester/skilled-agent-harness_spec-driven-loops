---
title: "Goal: Phase 3: versioned-placeholder-gate"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "versioned placeholder gate goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate"
    last_updated_at: "2026-10-24T15:45:00Z"
    last_updated_by: "conductor"
    recent_action: "Closed the phase after the review fix and the second census and suite run"
    next_safe_action: "Start phase 004"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-weak-model-spec-authoring-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: versioned-placeholder-gate

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make an unfilled template hint fail validation once a new packet leaves Draft, by turning the core template hints into value tokens stamped v2.3 and giving the validator a Draft lifecycle for v2.3 docs only, with no change to the verdict of any existing packet.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The grammar is the existing `[YOUR_VALUE_HERE: ...]` token. No new token is added. |
| D2 | A doc stamped v2.3 or later warns on an unfilled token while `spec.md` has the Status Draft and errors at any other status. A doc with an older stamp or none keeps its old error. `[NEEDS CLARIFICATION:` is an error everywhere. |
| D3 | Both the orchestrator function `validatePlaceholders` and the shell rule `check-placeholders.sh` get the lifecycle, and one test file compares them. |
| D4 | Only the five templates `core/spec.md.tmpl`, `core/plan.md.tmpl`, `core/tasks.md.tmpl`, `core/implementation-summary.md.tmpl` and `addons/acceptance-criteria.md.tmpl` are converted, by `convert_hints.py`, and the scaffolder's own placeholders stay as they are. |
| D5 | Every edit is made by a tool or a quoted heredoc. No worker model edits a file in this phase. |
| D6 | The phase closes on a failing-first test, three red mutations, identical strict counts over `specs/` before and after, a suite match plus the new test, and one read-only review through `cli-devin` with `swe-2-max`. |
| D7 | The post-edit scanner, the era report and `upgrade-level.sh` are not edited. Their side effects are recorded as operator items. |
| D8 | The phase ends with one local commit on the worktree branch and never pushes. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `npx vitest run --config ../../vitest.config.ts --project cli tests/placeholder-token-gate.vitest.ts`, run from `.skilled/skills/system-spec-kit/runtime/cli`, prints `Tests  5 passed (5)`, `scratch/test-red.txt` shows it failed once before the code change, and `tasks.md` T010 printed `M1_RED`, `M2_RED`, `M3_RED` and `GREEN_AGAIN`
- [x] The five templates hold 217 value tokens, `LEFTOVERS_SAME` printed in T011, and `rg -n 'SPECKIT_TEMPLATE_SOURCE:[^|]*\| v2\.2'` over them prints nothing
- [x] A Level 1 scaffold in `specs/zz-bench-gate/` validates `RESULT: PASSED` with a `PLACEHOLDER_FILLED` warning at Draft, shows an `error` at Complete and shows an `error` with a v2.2 stamp, and the track is deleted
- [x] `scratch/census/a-before.tsv` equals `a-after.tsv`, and the path, verdict and placeholder columns of `b-before.tsv` equal those of `b-after.tsv`
- [x] `python3 -I "$PHASE/scratch/tools/suite_compare.py" "$P1/scratch/baseline/suite-start.txt" "$PHASE/scratch/suite-end.txt" 1 5` prints `SUITE_MATCH_PLUS_NEW_TEST`
- [x] `rg -c 'PLACEHOLDER\]' .skilled/skills/system-spec-kit/references/templates/template-guide.md` prints nothing, `validation-rules.md` holds the lifecycle section, and `scratch/review/T019.txt` holds only `P0`, `P1` or `P2` lines or the single line `NO FINDINGS`, with each P0 and P1 line fixed
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate --strict` prints `RESULT: PASSED`, `git status --porcelain` lists no changed path outside the file list in `spec.md` section 3 and this phase folder, and `git log -1 --format=%H` prints the start commit until the phase's one local commit
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phases 1 and 2 closed, templates original (T001) | Done | Printed `1`, `exit=0`, `LEDGER_OK` and nothing for the token check |
| Tools checked (T002) | Done | Python 3.9.6, jq-1.7.1-apple, ripgrep 15.2.0, v26.8.2, perl 5.034001, 11.19.1 |
| Phase start commit | Done | 72001d694fe2419dfa2f8db68bcea7cbbf522ed7 |
| Build runs this checkout, no `FOREIGN` line (T003) | Done | Five `OWN` lines and `MISSING runtime/node_modules`, `ORCH_OK` |
| Six tools saved (T004) | Done | Five `PY_OK` lines and `NODE_OK` |
| Conversion tool tested on a copy (T005) | Done | Converted `96`, `90`, `7`, `14`, `10`, then five `converted 0`, totals `106 96`, `101 90`, `17 7`, `20 14`, `13 10`, `LEFTOVERS_SAME`. `git status --porcelain` over the templates printed nothing |
| Census before: Gate A and Gate B totals (T006) | Done | 4688 folders. Gate A `4688 PASS pass` in 40 s. Gate B `ROWS_OK`, `4496 PASS` and `192 FAIL`, placeholder column `pass` on all 4688, 0 crashes, 1567 s on three shards. This is the Gate B baseline |
| Failing test red (T007) | Done | `× warns on a v2.3 doc with an unfilled token while the packet is a Draft`, `Failed Tests 1`, `Tests  1 failed \| 4 passed (5)`, `exit=1`, code-frame grep `1`. Saved in `scratch/test-red.txt` |
| Orchestrator block replaced and built (T008) | Done | `REPLACED lines 661 to 697`, `carriesTokenGateStamp` count `2` in source and `2` in dist, test `1 failed \| 4 passed (5)` at the shell line, grep `1` |
| Shell rule replaced, test green, harness green (T009) | Done | `SYNTAX_OK`, `Tests  5 passed (5)`, `exit=0`, harness `8/8 passed`, `3/3 passed`, `Failed:  0`, `RESULT: PASSED` |
| Three mutations red (T010) | Done | `M1_RED`, `M2_RED`, `M3_RED`, `GREEN_AGAIN`, then `RESTORED` |
| Templates converted, stamped, manifest updated (T011) | Done | Converted `96`, `90`, `7`, `14`, `10`. Stamps 1, 1, 1, 3, 1 (7 in all), manifest `5`, `LEFTOVERS_SAME`, tokens `217`, no v2.2 stamp left |
| Reference docs fixed (T012) | Done | `APPLIED 5 edits` and `APPLIED 1 edits`, `PLACEHOLDER]` count printed nothing, lifecycle heading count `1` |
| Snapshot regenerated, template tests green (T013) | Done | `Snapshots  16 updated`, `Tests  12 passed (12)`. Snapshot diff `327` and `327` (the plan saw 324 before phase 002 added three implementation-summary hints), then `0` and `0`. Template tests `5 passed (5)`, `32 passed (32)`. Both stamp edits `APPLIED 1 edits`, then `2 passed (2)`, `74 passed (74)` |
| Scaffold smoke test (T014) | Done | `--track` check `1`. Level 1 Draft: `! PLACEHOLDER_FILLED: 36 unfilled value token(s) in a Draft packet`, `Errors: 0`, `RESULT: PASSED`. Complete: `error 36 placeholder(s) found`. v2.2 stamp: `error 30 placeholder(s) found`. Level 2 `112 112 101 101 0`, `TRACK_GONE` |
| Census after and compare (T015) | Done | Gate A `4688` rows, `CENSUS_SAME gate A`. Gate B `4688` rows on three shards, `CENSUS_SAME gate B`, `4496 PASS` and `192 FAIL`, the same as the baseline. No rerun was needed |
| Ledger rows owned by this phase (T016) | Done | `HANDLED L-A-019`, `HANDLED L-A-021`. `OPEN L-A-015`, `OPEN L-A-016` (core spec.md.tmpl), `OPEN L-A-018` (core plan.md.tmpl), `OPEN L-A-020` (core tasks.md.tmpl). `OUTSIDE L-B-029`, `L-B-030`, `L-B-031`, `L-C-005`, `L-C-006`, `L-C-008`, `L-C-012`, `L-C-014`, `L-C-015`, `L-C-020`, `L-C-025`, `L-C-028`. The four OPEN rows are explained in the ledger table below |
| Suite compared with the phase 1 start (T017) | Done | Two full runs, both `exit=0` and `SUITE_MATCH_PLUS_NEW_TEST`: the first before the review fix took about 37 minutes, the second after it about 43 minutes. Core lane 276 files and 4162 tests as at the start, cli lane 180 to 181 files and 2061 to 2066 tests. Block 3 matched no `upgrade-level` line (the log lists no line for those files) and counted `0` lines starting `FAIL` (ADR-006 probe: the `upgrade-legacy` test, fixed in T013, passed) |
| Scope check (T018) | Done | Printed `1`: the only extra path is `specs/system-speckit/054-weak-model-spec-authoring/goal.md`, the parent goal changed by the conductor on purpose (see the deviation row). Nothing else is outside the file list |
| Frontier review and findings (T019, T020) | Done | cli-devin `swe-2-max`, read-only. `T019.txt` holds one `P2` line, verify `0`. The finding was true and is applied. After the fix: build run, `Tests  5 passed (5)`, harness `8/8` and `3/3`, template tests `32 passed (32)`, T015 `CENSUS_SAME` twice, T018 `1` (parent goal). `FINDINGS_TALLIED 1 1` |
| Phase closed and committed locally (T021) | Done | Strict validation of this folder printed `RESULT: PASSED`. One local commit on the worktree branch, never pushed. The commit hash is in the implementation summary and the report |

### Operator items

Write each as a row in the table below with its probe output when T016 runs. The numbers shown were observed while this phase was planned.

| Item | Note |
|------|------|
| OP-1 era report flip | The manifest bump makes `repo-era.mjs` count every v2.2 stamp as `legacy`. In this repository `signals.templateMarkers` went from `{"new":16871,"legacy":2374,"none":510}` to `{"new":1421,"legacy":17824,"none":510}`. `/doctor:update check` reads the legacy count as a pre-v4 signal. Options: accept, teach the era report that v2.2 is still current for old docs, or hold the manifest bump. The operator decides before a release. **Probe (T016):** `repo-era.mjs` `templateMarkers` on this tree after the change is `{"new":1451,"legacy":17869,"none":510}`. The start-commit build was not re-measured, so the before value `{"new":16871,"legacy":2374,"none":510}` is the planning-time figure |
| OP-2 post-edit scanner | `runtime/cli/spec/check-placeholders.sh` exits 1 on a hint inside a fenced block and exits 0 on a line that holds a value token after the word Priority. After this phase the hook no longer reports unfilled tokens in new packets. Candidate ledger row for a later phase. **Probe (T016):** `probe-fence exit=1`, `probe-token exit=0` |
| OP-3 upgrade-level | `upgrade-level.sh` renders template sections into an older doc without touching its stamp, so a v2.2 doc gains tokens that error. The planning run found one existing test that hard-codes the v2.2 plan stamp, `upgrade-legacy.vitest.ts`, and T013 fixes that line. Check the two `upgrade-level` suites in T017. **Probe (T016):** the two `upgrade-level` suites are checked in T017 (see the T017 row) |
| OP-4 other docs | `README.md` lines about `check-placeholders.sh` and `assets/template-mapping.md` still say `[PLACEHOLDER]`. Phase 7 owns the README alignment. |
| OP-5 phase 2 commit | `../002-template-and-example-defect-repair/tasks.md` T017 makes a local commit, while `../goal.md` section 3 says the swarm makes none. This phase makes none. The operator reconciles the two. **Resolved** by the operator decision of 2026-10-24 to commit locally once per phase |

### Deviations and findings

| Item | Note |
|------|------|
| Counts moved by phase 002 | Phase 002 applied ledger rows L-A-002 to L-A-004, which put three `[PACKET-ID]` values in `core/implementation-summary.md.tmpl`. The operator chose to keep them, so this phase's counts moved: implementation-summary converts 14 hints, not 11, its T005 line reads `20 14`, and the total is 217 tokens out of 257 hints. Measured by running this phase's T005 test on a copy of the post-002 templates. `create.sh` rewrites every `packet_pointer` line at scaffold time, so the Level 2 counts in T014 do not move |
| Commit decision on 2026-10-24 | D8 said the phase makes no commit. The operator chose one local commit per phase on the worktree branch, never pushed. D8 and the last completion criterion were reworded to match, and OP-5 is resolved by that decision |
| Task order | T001, T002, T004 and T005 ran while the 041-006 suites were running, before T003, because they write only this phase's `scratch/`. T003 then recorded the start commit after the 041-006 commit `72001d694f` |
| Parent goal.md changed by the conductor | `../goal.md` (the parent packet goal) carries an operator-approved amendment and log rows made by the conductor. It appears in the T018 changed-files list as an extra path, is conductor-owned and expected, is excluded from this phase's commit, and stays modified and unstaged |
| Timing | Gate A ran in about 40 seconds. Gate B on three shards took 1567 s at the start, about 26 minutes after the change, and about 67 minutes in the rerun after the review fix (shards finish unevenly under load), inside the 90 minute bound. Suite runs: about 37 and 43 minutes |
| Next phase | Phase 004 (`004-template-section-fill-guidance`) may assume: the five core templates hold 217 value tokens plus the kept list and are stamped v2.3, the orchestrator and the shell rule both warn at Draft and error otherwise for v2.3 docs, and ledger rows L-A-015 and L-A-016 (missing `risk-matrix` and `user-stories` anchors in core `spec.md.tmpl`) are handed to it. Its frozen alignment table removes those two anchors from the level-3 example, so no gate needs them |
| Takeover on 2026-10-24 | The parent moved every remaining run to cli-codex gpt-6-luna max fast and cli-devin swe-2-max, and every review to swe-2-max (parent D4, D7, D8). A task that names the Task tool runs as that CLI dispatch with the same brief and reply file. |
### Ledger rows owned by this phase

| Row | Result | Note |
|-----|--------|------|
| L-A-015, L-A-016 | OPEN, not fixed here | Core `spec.md.tmpl` lacks the `risk-matrix` and `user-stories` anchors. Phase 004's frozen alignment table removes those two anchors from the level-3 example instead, and the three Level 3 baseline scaffolds passed strict validation without them, so no gate requires them. Handed to phase 004 and raised to the operator |
| L-A-018 | OPEN by the check, handled by this phase | Its evidence command `rg -c '\[[A-Za-z][^]\[]{2,}\]'` counts lines with any bracketed text, and a converted `[YOUR_VALUE_HERE: ...]` token still matches, so the count cannot move although every `plan.md.tmpl` hint is now a gated value token. The evidence is stale |
| L-A-020 | OPEN by the check, handled by this phase | Same stale evidence command for `tasks.md.tmpl` |
| L-A-019, L-A-021 | HANDLED | The evidence no longer matches |
| L-B-029, L-B-030, L-B-031, L-C-005, L-C-006, L-C-008, L-C-012, L-C-014, L-C-015, L-C-020, L-C-025, L-C-028 | OUTSIDE | The file is not owned by this phase. Left as it is |

### Review findings

The review ran on cli-devin `swe-2-max` with `--permission-mode auto` (parent D4), which refuses shell commands, so the reviewer read precomputed diff files only. The first two dispatches hit the model's free-tier rate limit (`Reached free model rate limit`, reset in 37 minutes), which cost no review output. The third, after the reset, returned one line.

| Finding | State |
|---------|-------|
| FINDING P2 .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:743 | APPLIED |

The finding was true: the orchestrator also matches the legacy `<YOUR_VALUE_HERE:` form (line 665), which the shell rule never matches, so a stamped Draft doc carrying that form warned in the orchestrator where it errored before this phase. The applied condition adds `match[0] === '[YOUR_VALUE_HERE:'` and keeps the existing `!CLARIFICATION_MARKER_RE.test(line)`. This is the reviewer's suggested text. The first edit applied was a shorter form without that second test and was corrected to the suggested form before the build.

<!-- /ANCHOR:log -->
