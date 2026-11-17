---
title: "Tasks: Phase 33: untuned-arm-arena-run"
description: "Discard the stopped arm's lines, build five arenas, smoke, run the arm at the option D size, score it and log the verdict. Every task is a coordinator task and no code changes."
trigger_phrases:
  - "untuned arm arena run tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 33: untuned-arm-arena-run

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
| `[C]` | Coordinator task: a gate, a live run, a summary over run logs or the close-out |
| `[J]` | Read-only judgment: one Fable 5.2 medium session, plan permission mode, no edits |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every command runs from the repository root unless a task names an arena. Set the names once with `export WT=$(pwd) ADV=.skilled/skills/system-skill-advisor/runtime RAD=$ADV/scripts/routing-accuracy PK=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build PH=$PK/033-untuned-arm-arena-run SP=$PK/033-untuned-arm-arena-run/scratch OLDSP=$PK/026-untuned-behaviour-arm/scratch ARENAS=$TMPDIR/skilled-behaviour-arenas`.
- `G` is `git -c core.fsmonitor=false`. `AC` is the arena commit T003 records.
- `A` is `$RAD/prepare-behaviour-arena.mjs`, `S` is `$RAD/score-command-transcripts.mjs`, `FP` is `$RAD/behaviour-fresh-prompts.jsonl` and `CAP` is `$RAD/capture-command-routing-baseline.mjs`.
- `FIT` is `jq -r 'del(.prompt) | select(.row_type == "plain") | .id' $FP | sort` and `DECL` is the same with `"decline"`. `FP` is read only through `del(.prompt)`.
- `PLOG "<row>"` is `node .skilled/hooks/goal/bin/goal.cjs packet-log $PK "<row>" --workspace .`.
- `RT` is the five runtimes `claude opencode pi devin dsh`. `LOGS` is `$SP/runs/{claude,opencode,pi,devin,dsh}.jsonl`.
- `FOLLOWED`, `PAIRED`, `POOLED`, `STARTS`, `DELIVERY` and `MISMATCH` are the `jq` filters defined in `026-untuned-behaviour-arm/tasks.md`, used as written there.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [C] Set the stopped arm's lines aside (`$OLDSP/runs/discarded/`). Move `$OLDSP/runs/{claude,devin,dsh,opencode,pi,smoke}.jsonl` into `discarded/` with a `stopped-arm-` prefix, then `PLOG "Stopped arm lines set aside | Recorded | claude 72, devin 23, dsh 23, opencode 8, pi 12 and smoke 10 lines from arenas at 6ccb2b5157 and 067c2cf029, older than the pass-five runner, moved to 026 runs/discarded unscored"`. Verify: `ls $OLDSP/runs/*.jsonl` lists nothing and the six moved files hold 148 lines. Evidence: Evidence: 6 files git mv'd to 026 runs/discarded/stopped-arm-*.jsonl, 148 lines, no jsonl left in runs/; goal log row Stopped arm lines set aside
- [x] T002 [C] Prove the harness at the arena commit (`$SP/before.txt`). Run `env -u AI_SESSION_CHILD npx vitest run` in `$ADV`, `G status --porcelain` and `test -e .skilled/hooks/hook-flags.env; echo $?`. Verify: 0 failed, an empty status and `1`. Evidence: Evidence: scratch/before.txt at 9bc2f17a59e: 185 files, 2313 passed, 0 failed; status held only before.txt itself; flags test -e exit 1
- [x] T003 [C] Build five arenas at one commit (`$ARENAS/run033-<runtime>`, `$SP/arenas.txt`). Record `AC` as `G rev-parse HEAD`, check `df -g $TMPDIR` shows at least 45 GB free, then for each of `RT` run `node $A --source . --dest $ARENAS/run033-<runtime>`, a new path because the builder refuses an existing one and the old fresh arenas stay untouched. In each arena run `git rev-parse HEAD`, `git remote`, `git status --porcelain`, `cat CLAUDE.md`, `test -e .skilled/hooks/hook-flags.env; echo $?` and the runner's model constant for that runtime. Verify: five builder runs print `"ok":true` with `head` equal to `AC`, and each arena prints `AC`, no remote, an empty status, `@AGENTS.md` and `1`. Evidence: Evidence: scratch/arenas.txt: AC b765c7a14c5, 640 GB free; first try stale_build (cli/dist older than the regenerated fixtures), spec-kit runtime and cli rebuilt; five builds ok:true head AC, 23 copied, trackedDotenv names two .env.example; each arena AC, 0 remotes, 0 status, @AGENTS.md, flags exit 1, models claude-sonnet-5-5, opencode-go/deepseek-v4.1-flash, its :off for pi, swe-2-max, deepseek-v4.1-flash-1017
- [x] T004 [C] Smoke one fit row per runtime and arm (`$SP/runs/smoke.jsonl`, `$SP/smoke.txt`). From each arena run its runner copy with `--runtime <runtime> --row-id <first id of FIT> --arm off --run 1`, then `--arm on`, each with `--out $WT/$SP/runs/smoke.jsonl`. Verify: 10 lines, every one `restored: true` with a session locator, `briefDelivered` false off and true on for claude, pi, devin and dsh, unknown both arms for opencode, `MISMATCH` prints nothing and `node $S --summary $SP/runs/smoke.jsonl --json` exits 0. A contradiction marks T005 `[B]`. Evidence: Evidence: scratch/smoke.txt, runs/smoke.jsonl 10 lines (fresh-fit-01), all restored true exit 0 with session ids; false off and true on for claude, pi, devin, dsh; opencode unknown both; MISMATCH empty; summary exit 0 with 10 scored, 0 unscored; arenas clean, no remote
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [C] Run 1 of both arms (`$SP/runs/<runtime>.jsonl`). After T004. From each arena run `--set fresh --arm off --run 1`, then `--set fresh --arm on --run 1`, each with `--out $WT/$SP/runs/<runtime>.jsonl`, the five runtimes side by side under one Monitor whose filter catches progress and auth, quota, refusal and `spawn_failed`. A pass that stops early resumes its remaining rows with `--row-id` under the same arm and run, and the stop is written on this line. Verify: per runtime the grouping prints `[36,36]` for off-1 and on-1. Evidence: Evidence: off-1 and on-1 at 36 rows each on all five runtimes; claude, pi, opencode in one pass each; devin stopped twice by fresh-skill-04 head moves and resumed with --row-id (resume scripts devin-resume, devin-resume2); dsh stopped once by the same row and resumed (dsh-resume); every arena back at AC, clean, no remote
- [x] T006 [C] Run 2 of the decline rows in the on arm. After T005. From each arena run `--arm on --run 2` with one `--row-id` per id of `DECL` and no `--set`, because the runner runs the union of a set and the named rows, out to the same log. Verify: `jq -s 'group_by(.arm + "-" + (.run|tostring)) | map(map(.rowId) | unique | length)'` prints `[36,36,8]` for each runtime. Evidence: Evidence: on-2 over the 8 decline rows with --row-id only; every runtime groups [36,36,8]
- [x] T007 [C] Rerun each harness fault once (`$SP/reruns.txt`). After T006. List `MISMATCH` over `LOGS` and the runs the scorer leaves unscored for a reader or locator reason, as 026 T043 states. A capped turn is the model's behaviour and is not a fault. Rerun each once with `--row-id`, its arm and its run. Verify: each `reruns.txt` line names a runtime, row, arm, run and reason, none twice, and `cat $SP/runs/*.jsonl | wc -l` prints at most 440. Evidence: Evidence: MISMATCH empty, 0 unscored runs in run 1 and run 2 summaries on every runtime and arm; reruns.txt names the fresh-skill-04 restore faults (devin rerun once, then unmeasurable; dsh not rerun) and the two dsh exit-1 lines not rerun; total run lines 411 (cap 440)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [C] Score the arm (`$SP/summary-arm.json`, `$SP/arm-evidence.txt`). After T007. With `SKILL_ADVISOR_FRESH_PROMPTS_PATH` unset run `node $S --summary $LOGS --pair off,on --json > $SP/summary-arm.json`, then write `FOLLOWED`, `PAIRED`, `POOLED`, `STARTS` and `DELIVERY` over it, `mismatch <count>` from `MISMATCH` over `LOGS`, and the six `limit: ` lines of 026 T044 with Codex named as not measured (Q075) and one run per arm (option D). No number is typed by hand. Verify: 10 `followed`, at most 5 `paired`, 1 `pooled`, 10 `starts`, 10 `delivery`, 1 `mismatch` and 6 `limit: ` lines. Evidence: Evidence: summary-arm.json exit 0; arm-evidence.txt holds 10 followed, 5 paired, 1 pooled, 10 starts, 10 delivery, mismatch 0 and 6 limit lines, every number from the scorer and the 026 jq filters
- [x] T009 [C] Check the sealed reach floor at `AC` (`$SP/arm-evidence.txt`). After T008. Run `(set -o pipefail; node $CAP | jq -c '.attachedMetrics.plain.holdout')` and the same with `--real-embedding`, and append `floor fixture <out>` and `floor real <out>`, or `floor real: embedder not live` when it exits 2. Verify: `rg -c '^floor ' $SP/arm-evidence.txt` prints 2. Evidence: Evidence: at HEAD b765c7a14c5 (0 code diff from AC) fixture exit 0 combined 2 of 44, real exit 0 combined 5 of 44, both floor lines appended
- [x] T010 [C] Record the verdict (the parent `goal.md` through `PLOG` only). After T009. Apply the 026 Pre-registered Target as option D amends it: a row gains when its `on` run 1 followed and its `off` run 1 did not, and loses on the reverse. `Met` needs the pooled `p` below 0.05, every `on` arm's decline starts `0 of <n>` over both runs, fixture `combined` at least 1 and real at least 4. Write `PLOG "Arm verdict | <Met or Not shown> | <pooled line>, decline starts on <per runtime>, floors <fixture> and <real>"` and one `Arm <runtime>` row for each runtime whose gained is not above lost. Verify: `rg -c '^\| Arm verdict \| (Met|Not shown) \|' $PK/goal.md` prints 1 and `goal.cjs packet $PK` prints `packet_budget=ok`. Evidence: Evidence: goal log Arm verdict Not shown (p 0.0769, dsh decline start 1 of 16), Arm devin row (gained 3 = lost 3), packet_budget=ok
- [x] T011 [J] Step reader (`$SP/step-reader/`). After T010. Pick and export up to four followed `on` sessions per runtime as 026 T047 states, then one Fable 5.2 medium session judges three steps per session as 026 T048 states. Write `PLOG "Step reader | Judgment, not a printed number | <yes counts>"`. Verify: one report block per picked session and one `Step reader` row. Evidence: Evidence: pick.txt 20 lines (4 per runtime, five runtimes), 20 sessions exported through loadSession, report.txt one block per session, TOTAL setup=15/20 folder=12/20 output=4/20, goal log Step reader row
- [x] T012 [C] Decide B-5 (the parent `goal.md` through `PLOG` only). After T010. Fire when any `on` block reads decline starts above 0, or the pooled `on` skill-only starts exceed the `off` sum. Write the Fired or Declined row as 026 T049 states and build nothing here. Verify: `rg -c '^\| B-5 trigger \| (Fired|Declined) \|' $PK/goal.md` prints 1. Evidence: Evidence: goal log B-5 trigger Fired on the dsh decline start at fresh-decline-refusal-02; built nothing here
- [x] T013 [C] Close the phase (`$PH/implementation-summary.md`). After T011 and T012. Check `G status --porcelain` shows only this phase's folder, `026` runs and the goal, that each arena still reads no remote, fill the summary and validate. Verify: `validate.sh $PH --strict` prints `RESULT: PASSED`. Evidence: Evidence: validate --strict RESULT: PASSED (Errors 0, Warnings 0); gate review re-run APPROVED, 0 P0, 0 P1; arenas-after.txt all five clean with no remote; implementation-summary.md filled
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every runtime log groups `[36,36,8]` and the verdict row matches `arm-evidence.txt`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Design and target**: `../026-untuned-behaviour-arm/spec.md` (Pre-registered Target, Arm Design) and `../026-untuned-behaviour-arm/tasks.md` (T039 to T049)
- **Run size**: `../026-untuned-behaviour-arm/scratch/decide-run-size/report.txt`
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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md Evidence: spec.md REQ-001 to REQ-007
- [x] CHK-002 [P0] Technical approach defined in plan.md Evidence: plan.md, strict validation passed at planning
- [x] CHK-003 [P1] Dependencies identified and available Evidence: five CLIs on PATH, 640 GB free, arenas.txt
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No code file changes: `G diff --stat AC -- . ':!specs'` prints nothing Evidence: `git diff --stat b765c7a14c5 -- . ':!specs'` prints nothing
- [x] CHK-011 [P0] The advisor suite reports 0 failed at `AC` Evidence: before.txt: 2313 passed, 0 failed at 9bc2f17a59e, whose code equals the arena commit b765c7a14c5 (that commit touched three spec files only)
- [x] CHK-012 [P1] Every stopped pass resumed and written on its task line Evidence: devin and dsh stops written on T005 and in reruns.txt
- [x] CHK-013 [P1] Commands follow the 026 runbook Evidence: commands as the 026 runbook, with the T003 path and T006 flag amendments written on their lines
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: acceptance-criteria.md: six Met, AC-001 Waived by ADR-001
- [x] CHK-021 [P0] The smoke passed before run 1 Evidence: smoke.txt, 10 lines, no mismatch, before T005
- [x] CHK-022 [P1] Faults rerun once, listed in `reruns.txt` Evidence: reruns.txt
- [x] CHK-023 [P1] The line cap of 440 held Evidence: 411 lines with smoke, cap 440
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Not a fix packet: no finding is fixed here, so each finding class reads `matrix/evidence`. Evidence: no finding fixed here, measurement only
- [x] CHK-FIX-002 [P0] No producer changes, proven by CHK-010. Evidence: CHK-010
- [x] CHK-FIX-003 [P0] No consumer changes, proven by CHK-010. Evidence: CHK-010
- [x] CHK-FIX-004 [P0] No security, path or parser code changes, proven by CHK-010. Evidence: CHK-010
- [x] CHK-FIX-005 [P1] Matrix axes listed: five runtimes, two arms, run 1 and the decline run 2. Evidence: five runtimes x off and on x run 1, plus on run 2 for 8 decline rows
- [x] CHK-FIX-006 [P1] Each turn's environment is the runner's `childEnv`, unchanged. Evidence: runner childEnv unchanged, OPENCODE_DB unset in every script
- [x] CHK-FIX-007 [P1] Evidence pinned to `AC`. Evidence: arena commit b765c7a14c5
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No prompt text read or printed, and `hook-flags.env` only tested with `test -e` Evidence: no prompt field in any committed run file; hook-flags.env tested with test -e only
- [x] CHK-031 [P0] Every arena reads no remote after the run Evidence: scratch/arenas-after.txt: every arena 0 remotes, 0 status, 0 stash at b765c7a14c5, the stray devin and dsh main refs deleted
- [x] CHK-032 [P1] Every run line reads `restored: true` Evidence: 397 of 401 lines restored true; the 4 fresh-skill-04 head-move lines (devin.jsonl lines 32, 33 and 81, dsh.jsonl line 68) are covered by ADR-001
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized Evidence: spec, plan and tasks match the run, with the T003 and T006 amendments on their lines and the plan section 7 deviation recorded by ADR-001
- [x] CHK-041 [P1] Goal log rows match the evidence Evidence: goal rows quote arm-evidence.txt lines; the Arm devin lost-row ids and paths come from scratch/devin-rows.txt, the scorer's per-row output
- [x] CHK-042 [P2] README updated (if applicable) Evidence: not applicable, no README in scope
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: run files under scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion Evidence: per-runtime smoke files merged and removed; scratch/ holds evidence only
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-16
<!-- /ANCHOR:summary -->

---
