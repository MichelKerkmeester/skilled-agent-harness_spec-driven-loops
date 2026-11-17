---
title: "Tasks: Phase 37: review-pass-six-remediation"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "review pass six remediation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 37: review-pass-six-remediation

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

Every command runs from the repository root. Set the names once with `export ADV=.skilled/skills/system-skill-advisor/runtime RAD=$ADV/scripts/routing-accuracy PK=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build SP=$PK/037-review-pass-six-remediation/scratch OSP=$PK/033-untuned-arm-arena-run/scratch`. `S`, `SUITE`, `FLOOR`, `EVAL`, `S033` and `PLOG` are as phase 036's `tasks.md` defines them.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [C] Take the before gates from phase 036 (`$SP/before.txt`). HEAD `85550ee946e` holds the code 036's `after.txt` measured. Verify: `before.txt` cites 2326 passed, 0 failed, `FLOOR` and `EVAL`. Evidence: before.txt cites 036 after.txt on 85550ee946e: 2326 passed 0 failed, typecheck 0, FLOOR 24/44 0/35 2/44, EVAL [160,49,21,5]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P] Drop the `cat` start clause from the scorer row (`$RAD/README.md`). Verify: `rg -c "cat\` of the command's document counts" $RAD/README.md` prints nothing. Evidence: rg for the old cat-start sentence prints nothing; the row now says a cat counts as a read and a read starts only with a checkout write
- [x] T003 [P] Reword the shell-step comment (`$ADV/tests/command-transcript-score.vitest.ts`). Verify: the comment says a shell read is the touch a read tool records and the table's write makes it a start. Evidence: shell-step comment says the shell read is the read a read tool records and the table's write in the checkout makes it a start
- [x] T004 [P] Add `startShape` to the `@returns` union (`$S`). Verify: `node --check $S` exits 0. Evidence: startShape added to the scoreRun @returns union; node --check exit 0
- [x] T005 [P] Set `TEMP` and `TMP` beside `TMPDIR` and state that a signal-killed run leaves its folder (`$ADV/vitest.config.ts`). Verify: `rg -c 'process.env.(TEMP|TMP) = RUN_TMPDIR' $ADV/vitest.config.ts` prints 2. Evidence: rg -c prints 2 for TEMP and TMP; the comment names POSIX and Windows variables and the signal limit
- [x] T006 [P] Assert the buffer test's listing is above 1 MiB (`$ADV/tests/command-behaviour-guards.vitest.ts`). Verify: the test passes, and fails once with the loop cut to 3,000 files, restored after. Evidence: listing size asserted above 1 MiB; the test passes, and with the loop cut to 3000 files fails with expected 558018 to be greater than 1048576, restored
- [x] T007 [P] Name the runtimes whose prompt hook writes a health record (`README.md`). Verify: the paragraph names Claude Code, Codex, Devin and Cursor and says the OpenCode plugin and the Pi, DSH and Vibe hooks write none. Evidence: README.md names Claude Code, Codex, Devin and Cursor, and says the OpenCode plugin and the Pi, DSH and Vibe hooks write none
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [C] Rerun the gates and the 033 rescore (`$SP/after.txt`, `$SP/arm-033-after.json`). After T007. Verify: 0 failed, `FLOOR` and `EVAL` equal to `before.txt`, and `cmp` against 036's `arm-033-after.json` exits 0. Evidence: after.txt: 2326 passed 0 failed exit 0, typecheck exit 0, FLOOR and EVAL equal to before.txt, S033 cmp against 036 arm-033-after.json exit 0
- [x] T009 [C] Log the dispositions (`../goal.md`). After T008. `PLOG` one `Review pass six` row with each of the 11 findings fixed or with its reason. Verify: `rg -c '^\| Review pass six' $PK/goal.md` prints 1 or more and `packet_budget=ok`. Evidence: goal row Review pass six names all 11 findings fixed or with a reason; packet_budget=ok
- [x] T010 [C] Close the phase (`implementation-summary.md`). After T009. Verify: `validate.sh $PK/037-review-pass-six-remediation --strict` prints `RESULT: PASSED`. Evidence: implementation-summary.md filled, AC 4 of 4 Met, CHK 12/12 13/13 1/1, spec Complete, validate --strict RESULT: PASSED
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The goal row names all 11 findings
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

- [x] CHK-001 [P0] The before gates are on file (T001). Evidence: before.txt cites 036 after.txt on 85550ee946e
- [x] CHK-002 [P0] Each finding's case read from its iteration file. Evidence: each case read from review/lineages/*-6/iterations
- [x] CHK-003 [P1] The 033 stores still score. Evidence: S033 exit 0
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] `node --check $S` exits 0 and `npm run typecheck` exits 0. Evidence: node --check exit 0, typecheck exit 0
- [x] CHK-011 [P0] The change touches the six files only (`G diff --stat`). Evidence: git diff --stat lists the six files outside the spec folder
- [x] CHK-012 [P1] No scoring or builder path changes. Evidence: the 033 rescore is byte-identical
- [x] CHK-013 [P1] Comments carry no phase or finding id. Evidence: added comments carry no id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md 4 of 4 Met
- [x] CHK-021 [P0] Full suite 0 failed (`after.txt`). Evidence: after.txt 2326 passed 0 failed exit 0
- [x] CHK-022 [P1] The buffer test fails with a cut fixture. Evidence: fails at 3000 files with 558018
- [x] CHK-023 [P1] The 033 rescore is byte-identical. Evidence: cmp exit 0
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] Each fix is instance-only or doc drift, named in the goal row. Evidence: six instance-only doc, comment, type and test fixes, named in the goal row
- [x] CHK-FIX-002 [P0] `rg` for the old `cat` claim finds no other place. Evidence: rg for the old sentence across the skill finds only the fixed row
- [x] CHK-FIX-003 [P0] N/A: no helper, schema or response field changes. Evidence: no helper or field changes
- [x] CHK-FIX-004 [P0] N/A: no parser, path or redaction change. Evidence: no parser change
- [x] CHK-FIX-005 [P1] N/A: no matrix. Evidence: no matrix
- [x] CHK-FIX-006 [P1] The full suite runs with the three variables set. Evidence: the full suite ran with TMPDIR, TEMP and TMP set
- [x] CHK-FIX-007 [P1] Evidence names the fix commit. Evidence: the close-out commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No prompt or session text in any scratch file. Evidence: scratch holds gate lines and a summary with no text keys
- [x] CHK-031 [P0] `.skilled/hooks/hook-flags.env` neither read nor created. Evidence: never opened or created
- [x] CHK-032 [P1] N/A: no credential or auth path is touched. Evidence: no auth path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec, tasks and the goal row name the same 11 findings. Evidence: spec, tasks, review-report.md and the goal row list the same 11
- [x] CHK-041 [P1] The vitest config comment states the signal limit. Evidence: vitest.config.ts comment states the signal limit
- [x] CHK-042 [P2] Both READMEs updated. Evidence: routing-accuracy README and root README updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Evidence lives in this phase's `scratch/` only. Evidence: git status lists this phase, review/, goal.md and the six files
- [x] CHK-051 [P1] `scratch/` holds the gate files and the rescore only. Evidence: scratch holds before.txt, after.txt and arm-033-after.json
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-16
<!-- /ANCHOR:summary -->

---



