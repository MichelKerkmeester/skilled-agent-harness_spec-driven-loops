---
title: "Tasks: Phase 35: suite-metrics-and-start-shape"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "suite metrics and start shape tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 35: suite-metrics-and-start-shape

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
| `[C]` | Coordinator task: a gate, a rescore or the close-out |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every command runs from the repository root. Set the names once with `export ADV=.skilled/skills/system-skill-advisor/runtime RAD=$ADV/scripts/routing-accuracy PK=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build SP=$PK/035-suite-metrics-and-start-shape/scratch OSP=$PK/033-untuned-arm-arena-run/scratch BASE=$PK/034-scorer-heredoc-redirect-fix/scratch/summary-rescore.json`.
- `G` is `git -c core.fsmonitor=false`. `S` is `$RAD/score-command-transcripts.mjs`. `LOGS` is `$OSP/runs/{claude,opencode,pi,devin,dsh}.jsonl`.
- `SHARED` is `"$(node -p 'require("os").tmpdir()')/speckit-skill-advisor-metrics"`, read with the operator's own `TMPDIR`. `COUNT` prints `find $SHARED -type f | wc -l` and `find $SHARED -type f -exec cat {} + | wc -l`.
- `SUITE` is `(cd $ADV && env -u AI_SESSION_CHILD npx vitest run)`. `FLOOR` and `EVAL` are the two capture lines defined in `032-review-pass-five-remediation/tasks.md`.
- `CHECK` is `jq -r -n --slurpfile a $BASE --slurpfile b $SP/summary-shapes.json '$a[0] | to_entries[] | select(.key != "pooled") | .key as $r | .value | del(.unscored, .paired) | to_entries[] | .key as $m | ($b[0][$r][$m]) as $n | "\($r) \($m) rate \(if .value.startRate == $n.startRate then "equal" else "DIFF" end), shapes sum \(if ([$n.startShapes[]] | add) == ($n.startRate | split(" of ")[0] | tonumber) then "equal" else "DIFF" end)"'`.
- `PLOG "<row>"` is `node .skilled/hooks/goal/bin/goal.cjs packet-log $PK "<row>" --workspace .`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [C] Record the before state (`$SP/before.txt`). Run `COUNT`, `SUITE`, `COUNT` again, `FLOOR` and `EVAL`, and write each with its output. Verify: the suite reads 0 failed, and the second `COUNT` is higher than the first, which shows the leak this phase closes. Evidence: before.txt at 3bfdd8aa09b: COUNT 729 files 26001 lines, SUITE 2319 passed 0 failed exit 0, COUNT 735 files 26313 lines (leak shown), FLOOR 24/44 0/35 2/44, EVAL [160,49,21,5]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Make a per-run temp folder, set `process.env.TMPDIR` to it and remove it on exit (`$ADV/vitest.config.ts`). After T001. Verify: `COUNT` before and after `SUITE` prints the same two numbers, and the folder path the config logs is gone after the run. Evidence: shared COUNT 735 files 26313 lines before and after a full SUITE, 0 sav- folders left after; 7 full runs: 6 at 2319 passed 0 failed, the first at 1 failed (test not captured, did not recur in 6 reruns)
- [x] T003 Return the start's shape from `startState`, taking an optional checkout folder, and pass the line's `projectDir` from `scoreLine` (`$S`). After T001. Verify: `node --check $S` exits 0. Evidence: node --check exit 0; startState(events, row, checkoutDir) returns shape, scoreLine passes line.locator.projectDir
- [x] T004 Tally the shape of each counted start and print `startShapes` in `tallyBlock` and the text summary (`$S`). After T003. Verify: `node $S --summary $LOGS --pair off,on --json > $SP/summary-shapes.json` exits 0. Evidence: summary-shapes.json score exit 0, startShapes in every runtime and arm block and in the text summary
- [x] T005 Add a case per shape and a summary case whose split sums to its started count (`$ADV/tests/command-transcript-score.vitest.ts`). After T004. Verify: `(cd $ADV && env -u AI_SESSION_CHILD npx vitest run tests/command-transcript-score.vitest.ts)` passes. Evidence: command-transcript-score.vitest.ts 342 passed: four shape cases, expansion and no-start case, outside-checkout write case, capped summary split sums to 1; tsc on tsconfig.json 0 errors in the file, typecheck exit 0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 [C] Rerun the gates (`$SP/after.txt`). After T005. Run `COUNT`, `SUITE`, `COUNT`, `FLOOR` and `EVAL`. Verify: 0 failed, both `COUNT` runs equal, `FLOOR` and `EVAL` equal to `before.txt`. Evidence: after.txt: SUITE 2325 passed 0 failed exit 0, 0 sav- folders left, FLOOR and EVAL equal before.txt; the snapshot check shows no shared file changed across the trim test file and a full run (the first COUNT drift came from other sessions' OpenCode and Claude records)
- [x] T007 [C] Check the rescore (`$SP/shape-check.txt`). After T006. Run `CHECK > $SP/shape-check.txt` and append the `startShapes` of each runtime and arm. Verify: 10 lines read `rate equal, shapes sum equal`. Evidence: shape-check.txt at 267c27fc5df: 10 lines rate equal, shapes sum equal; summary identical to 034 apart from startShapes
- [x] T008 [C] Log the result (`../goal.md`). After T007. `PLOG` a `Start shape split` row quoting the read-alone count per runtime and arm from `summary-shapes.json`, and a `Suite metrics isolation` row with the `COUNT` lines. Verify: `rg -c '^\| (Start shape split|Suite metrics isolation) \|' $PK/goal.md` prints 2 and `goal.cjs packet $PK` prints `packet_budget=ok`. Evidence: goal rows Start shape split and Suite metrics isolation logged, rg -c prints 2, packet_budget=ok
- [x] T009 [C] Close the phase (`implementation-summary.md`). After T008. Fill the summary, tick the checklist and validate. Verify: `validate.sh $PK/035-suite-metrics-and-start-shape --strict` prints `RESULT: PASSED`. Evidence: implementation-summary.md filled, AC 5 of 5 Met, CHK P0 12/12 P1 13/13, P2 deferred to 036, spec Complete, validate --strict RESULT: PASSED (errors=0 warnings=0)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `shape-check.txt` and the goal rows agree
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] The leak is measured before the fix (`before.txt` COUNT rises across `SUITE`). Evidence: before.txt COUNT 729 to 735 files across SUITE
- [x] CHK-002 [P0] 034's `summary-rescore.json` is the committed baseline. Evidence: 034 scratch/summary-rescore.json committed in e21e63ad395
- [x] CHK-003 [P1] The 033 sessions still load (rescore exit 0 with 033's unscored counts). Evidence: summary-shapes.json score exit 0, shape-check.txt summary identical to 034 apart from startShapes
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] `node --check $S` exits 0 and the config loads in `SUITE`. Evidence: node --check exit 0, config loads in every SUITE run, typecheck exit 0
- [x] CHK-011 [P0] The change touches the config, the scorer and its test only (`G diff --stat`). Evidence: git show --stat 267c27fc5df: vitest.config.ts, score-command-transcripts.mjs, command-transcript-score.vitest.ts
- [x] CHK-012 [P1] A folder that cannot be made throws at config load instead of falling back to the shared one. Evidence: mkdtempSync runs at config load with no catch, so a failure throws before any worker
- [x] CHK-013 [P1] Comments state the why and carry no phase or finding id. Evidence: the config and startShape comments state the why with no ids
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md 5 of 5 Met
- [x] CHK-021 [P0] Full suite 0 failed with the shared counts unchanged (`after.txt`). Evidence: isolation.txt 2325 passed exit 0, COUNT equal, no shared file changed
- [x] CHK-022 [P1] Each of the five shapes has a passing case. Evidence: four shape cases plus the expansion case pass
- [x] CHK-023 [P1] A row with no expected command returns no shape. Evidence: expected_command null returns shape null
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] Classes: rank 3 is `test-isolation`, rank 4 is `matrix/evidence`. Evidence: test-isolation and matrix/evidence
- [x] CHK-FIX-002 [P0] Every suite writer of the shared folder goes through `tmpdir()` (`rg -n 'speckit-skill-advisor-metrics' $ADV --glob '!node_modules'`). Evidence: rg finds the folder name only in lib/metrics.ts, which resolves it under tmpdir()
- [x] CHK-FIX-003 [P0] `startState` has one caller, and `tallyBlock` feeds JSON and text output. Evidence: one startState call in scoreLine, tallyBlock feeds --json and the text summary
- [x] CHK-FIX-004 [P0] N/A: no parser, path or redaction logic changes. Evidence: no parser, path or redaction change
- [x] CHK-FIX-005 [P1] Matrix axes listed in `plan.md`. Evidence: plan.md affected surfaces lists the axes
- [x] CHK-FIX-006 [P1] The suite runs with the operator's own `TMPDIR` set, the hostile case for the leak. Evidence: every SUITE ran with the operator TMPDIR set
- [x] CHK-FIX-007 [P1] Evidence names the code commit. Evidence: 267c27fc5df
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No prompt or session text in any scratch file. Evidence: scratch files hold counts, shape names, paths and scorer lines
- [x] CHK-031 [P0] `.skilled/hooks/hook-flags.env` neither read nor created. Evidence: never opened, no test -e on it needed this phase
- [x] CHK-032 [P1] The per-run folder is made with `mkdtempSync`, private to the user. Evidence: mkdtempSync creates the folder with mode 0700
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec, plan, tasks and goal rows state the same numbers. Evidence: goal rows Start shape split and Suite metrics isolation with their correction rows match shape-check.txt and isolation.txt
- [x] CHK-041 [P1] The config comment says why the suite needs its own folder. Evidence: vitest.config.ts comment names the health readers and the fallback risk
- [ ] CHK-042 [P2] The summary field is named in the scorer's own header comment if it lists fields. Deferred: phase 036, which states startShapes in the routing-accuracy README; the scorer header lists no fields
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Evidence lives in this phase's `scratch/` only. Evidence: git status lists only this phase, goal.md and the parent metadata
- [x] CHK-051 [P1] No per-run temp folder is left behind. Evidence: isolation.txt shows the per-run folder gone
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 0/1, deferred to phase 036 |

**Verification Date**: 2026-11-16
<!-- /ANCHOR:summary -->

---



