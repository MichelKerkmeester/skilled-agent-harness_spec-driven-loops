---
title: "Tasks: Phase 36: start-rate-fixed-rule"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "start rate fixed rule tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 36: start-rate-fixed-rule

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

Every command runs from the repository root. Set the names once with `export ADV=.skilled/skills/system-skill-advisor/runtime RAD=$ADV/scripts/routing-accuracy PK=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build SP=$PK/036-start-rate-fixed-rule/scratch RL=$PK/007-per-runtime-behaviour-proof/scratch OSP=$PK/033-untuned-arm-arena-run/scratch`.
- `G` is `git -c core.fsmonitor=false`. `S` is `$RAD/score-command-transcripts.mjs`.
- `S007` is `env -u OPENCODE_DB node $S --summary $RL/runs-pre.jsonl $RL/runs-post.jsonl --json`, the start set of phase 032's `SSTART`. `S033` is `node $S --summary $OSP/runs/{claude,opencode,pi,devin,dsh}.jsonl --pair off,on --json` with `SKILL_ADVISOR_FRESH_PROMPTS_PATH` unset.
- `SUITE`, `FLOOR` and `EVAL` are as phase 035's `tasks.md` defines them.
- `RESTATE` is `python3 $SP/restate.py`, which compares each before and after summary and prints one line per runtime and arm.
- `PLOG "<row>"` is `node .skilled/hooks/goal/bin/goal.cjs packet-log $PK "<row>" --workspace .`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [C] Record the before state (`$SP/before.txt`, `$SP/start-007-before.json`, `$SP/arm-033-before.json`). Run `SUITE`, `FLOOR` and `EVAL` into `before.txt`, and `S007` and `S033` into the two JSON files. Verify: 0 failed, and `start-007-before.json` equals the copy taken at `267c27fc5df`. Evidence: before.txt at c3477fdcc85: 2325 passed 0 failed exit 0, FLOOR 24/44 0/35 2/44, EVAL [160,49,21,5]; start-007-before.json cmp equal to the 267c27fc5df copy (exit 0)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Make `started` follow the fixed rule and keep the shape of a read alone as `readOnly` (`$S`). After T001. Verify: `node --check $S` exits 0. Evidence: startState: started = touched && shape !== 'readOnly', shape kept for a read alone; node --check exit 0
- [x] T003 Count shapes for every judged row that started or looked up, and `started` for the four starting shapes only (`$S`). After T002. Verify: `S033 > /dev/null` exits 0. Evidence: tally counts startShapes for any shape and started for the four starting shapes; S033 exit 0
- [x] T004 Update the cases that expected a read alone to start, and add a read-alone lookup case (`$ADV/tests/command-transcript-score.vitest.ts`). After T003. Verify: `(cd $ADV && env -u AI_SESSION_CHILD npx vitest run tests/command-transcript-score.vitest.ts)` passes, and each changed expectation is listed in `implementation-summary.md`. Evidence: 4 expectations changed: the three it.each policy cases now expect started == wrote, the read-alone shape case moved to its own case expecting started false; the outside-checkout case also asserts started false. 342 passed, tsc 0 errors on the file
- [x] T005 State the rule for `startRate` and list `startShapes` in the scorer row (`$RAD/README.md`). After T004. Verify: `rg -c 'startShapes' $RAD/README.md` prints at least 1. Evidence: README scorer row lists startShapes and states the rule for startRate, line 115 states it for startRate and startedOfOffered; rg -c startShapes prints 2
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 [C] Rerun the gates (`$SP/after.txt`). After T005. Run `SUITE`, `FLOOR` and `EVAL`. Verify: 0 failed, `FLOOR` and `EVAL` equal to `before.txt`. Evidence: after.txt: 2325 passed 0 failed exit 0, FLOOR and EVAL equal to before.txt
- [x] T007 [C] Restate the rates (`$SP/start-007-after.json`, `$SP/arm-033-after.json`, `$SP/restate.txt`). After T006. Run `S007` and `S033` into the after files, then `RESTATE > $SP/restate.txt`. Verify: 22 lines read `numerator moved by readOnly, denominator equal`, and the 033 decline and skill-only counts equal 034's. Evidence: restate.txt: 22 lines 'numerator moved by readOnly, denominator equal', 0 DIFF, 033 decline and skill-only equal; fields-check.txt: no other field moved
- [x] T008 [C] Log the restated rates (`../goal.md`). After T007. `PLOG` a `Start rates, fixed rule, 007 set` row and a `Start rates, fixed rule, 033 arm` row from `restate.txt`. Verify: `rg -c '^\| Start rates, fixed rule' $PK/goal.md` prints 2 and `packet_budget=ok`. Evidence: goal rows Start rates, fixed rule, 007 set and 033 arm plus a correction row for the decline totals; rg -c prints 2, packet_budget=ok
- [ ] T009 [C] Close the phase (`implementation-summary.md`). After T008. Fill the summary, tick the checklist and validate. Verify: `validate.sh $PK/036-start-rate-fixed-rule --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `restate.txt` and the goal rows agree
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

- [ ] CHK-001 [P0] Both before summaries are on file (T001)
- [ ] CHK-002 [P0] The operator's go-ahead is recorded in `../decision-record.md`
- [ ] CHK-003 [P1] Both stored sets still score with their before unscored counts
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [ ] CHK-010 [P0] `node --check $S` exits 0 and the build type check exits 0
- [ ] CHK-011 [P0] The change touches the scorer, its test and the README row only (`G diff --stat`)
- [ ] CHK-012 [P1] `startState`'s doc comment states the rule
- [ ] CHK-013 [P1] Comments carry no phase or finding id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Full suite 0 failed (`after.txt`)
- [ ] CHK-022 [P1] A write outside the checkout leaves a lookup
- [ ] CHK-023 [P1] A row with no expected command has no shape
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [ ] CHK-FIX-001 [P0] Class `cross-consumer`: one judge feeds the rate, the policy tally and the offered count
- [ ] CHK-FIX-002 [P0] `startedCommand` already follows the rule, and no third judge exists
- [ ] CHK-FIX-003 [P0] Consumers listed in `plan.md` and each reread in the rescore
- [ ] CHK-FIX-004 [P0] N/A: no parser, path or redaction logic changes
- [ ] CHK-FIX-005 [P1] Matrix axes listed in `plan.md`
- [ ] CHK-FIX-006 [P1] N/A: the judge reads no environment
- [ ] CHK-FIX-007 [P1] Evidence names the code commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [ ] CHK-030 [P0] No prompt or session text in any scratch file
- [ ] CHK-031 [P0] `.skilled/hooks/hook-flags.env` neither read nor created
- [ ] CHK-032 [P1] N/A: no credential or auth path is touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [ ] CHK-040 [P1] Spec, plan, tasks, README and goal rows state the same rule and numbers
- [ ] CHK-041 [P1] The scorer comments match the rule
- [ ] CHK-042 [P2] The README scorer row lists `startShapes`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [ ] CHK-050 [P1] Evidence lives in this phase's `scratch/` only
- [ ] CHK-051 [P1] `scratch/` holds the summaries, the check script and the gate files only
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-16
<!-- /ANCHOR:summary -->

---



