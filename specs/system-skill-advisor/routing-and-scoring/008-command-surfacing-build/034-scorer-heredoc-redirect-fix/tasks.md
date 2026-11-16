---
title: "Tasks: Phase 34: scorer-heredoc-redirect-fix"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "scorer heredoc redirect fix tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 34: scorer-heredoc-redirect-fix

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

Every command runs from the repository root. Set the names once with `export ADV=.skilled/skills/system-skill-advisor/runtime RAD=$ADV/scripts/routing-accuracy PK=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build SP=$PK/034-scorer-heredoc-redirect-fix/scratch OSP=$PK/033-untuned-arm-arena-run/scratch`.
- `G` is `git -c core.fsmonitor=false`. `S` is `$RAD/score-command-transcripts.mjs`. `LOGS` is `$OSP/runs/{claude,opencode,pi,devin,dsh}.jsonl`.
- `SUITE` is `(cd $ADV && env -u AI_SESSION_CHILD npx vitest run)`. `FLOOR` and `EVAL` are the two capture lines defined in `032-review-pass-five-remediation/tasks.md`.
- `PROBE` is `node $SP/heredoc-probe.mjs` and `REACH` is `node $SP/heredoc-reach.mjs`. Both print counts, row ids and target names, never session text.
- `FOLLOWED`, `PAIRED`, `POOLED`, `STARTS`, `DELIVERY` and `MISMATCH` are the `jq` filters defined in `026-untuned-behaviour-arm/tasks.md`, used as written there.
- `PLOG "<row>"` is `node .skilled/hooks/goal/bin/goal.cjs packet-log $PK "<row>" --workspace .`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [C] Record the before state (`$SP/before.txt`). Run `SUITE`, `FLOOR`, `EVAL`, `PROBE` and `REACH` and write each command with its output tail into the file. Verify: the suite line reads 0 failed, `PROBE` prints `body ["0:"] started /create:sk-skill`, and `REACH` prints 401 loaded, 0 failed and 12 lines in all.
- [ ] T002 [C] Confirm the unfixed scorer reproduces phase 033 (`$SP/summary-before.json`). After T001. Run `node $S --summary $LOGS --pair off,on --json > $SP/summary-before.json` with `SKILL_ADVISOR_FRESH_PROMPTS_PATH` unset. Verify: `cmp $SP/summary-before.json $OSP/summary-arm.json` exits 0, so any later change comes from the fix.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Strip heredoc bodies in `redirectTargets` with `HEREDOC_BODY` before the scan, as `shellReadTargets` does (`$RAD/score-command-transcripts.mjs`). After T002. Verify: `PROBE` prints `body [] started null` and `opening ["notes.txt"] started /create:sk-skill`.
- [ ] T004 Add three cases (`$ADV/tests/command-transcript-score.vitest.ts`): a heredoc body comparison yields no write, a redirect on the opening line yields one, and a document read followed by only a body comparison makes `startedCommand` return null. Verify: `(cd $ADV && env -u AI_SESSION_CHILD npx vitest run tests/command-transcript-score.vitest.ts)` passes, and the three cases fail with the T003 change reverted.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 [C] Rerun the gates (`$SP/after.txt`). After T004. Run `SUITE`, `FLOOR`, `EVAL`, `PROBE` and `REACH`. Verify: 0 failed, `FLOOR` and `EVAL` lines equal to `before.txt`, and `REACH` prints 0 lines on all five runtimes.
- [ ] T006 [C] Rescore the arm (`$SP/summary-rescore.json`, `$SP/rescore-evidence.txt`). After T005. Run `node $S --summary $LOGS --pair off,on --json > $SP/summary-rescore.json`, then write `FOLLOWED`, `PAIRED`, `POOLED`, `STARTS` and `DELIVERY` over it, `mismatch <count>` from `MISMATCH` over `LOGS`, the `limit: ` lines of `$OSP/arm-evidence.txt` and its two `floor` lines. Verify: the same line-kind counts as `$OSP/arm-evidence.txt` (10 followed, 5 paired, 1 pooled, 10 starts, 10 delivery, 1 mismatch, 2 floor, 6 limit).
- [ ] T007 [C] Diff the evidence (`$SP/rescore-diff.txt`). After T006. Run `diff $OSP/arm-evidence.txt $SP/rescore-evidence.txt > $SP/rescore-diff.txt`. Verify: the file lists every changed line, and the `starts dsh on` line reads decline 0.
- [ ] T008 [C] Log the rescored verdict and trigger (`../goal.md`). After T007. Apply the arm target and the B-5 rule (P036) to `rescore-evidence.txt` and `PLOG` an `Arm verdict, rescored` row and a `B-5 trigger, rescored` row, each quoting the printed pooled, decline and skill-only numbers. Verify: `rg -c '^\| (Arm verdict|B-5 trigger), rescored \|' $PK/goal.md` prints 2 and `goal.cjs packet $PK` prints `packet_budget=ok`.
- [ ] T009 [C] Check the boundaries (`$SP/boundaries.txt`). After T008. Verify: `G diff --quiet HEAD -- $OSP` exits 0, and `G status --short` lists only the scorer, its test file, this phase folder and `../goal.md`.
- [ ] T010 [C] Close the phase (`implementation-summary.md`). After T009. Fill the summary, tick the checklist and validate. Verify: `validate.sh $PK/034-scorer-heredoc-redirect-fix --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `rescore-evidence.txt` and the two goal rows agree on every number
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

- [ ] CHK-001 [P0] The cause is reproduced by `PROBE` before the fix (`before.txt`)
- [ ] CHK-002 [P0] The unfixed scorer reproduces 033's summary byte for byte (T002 `cmp`)
- [ ] CHK-003 [P1] All 401 run lines load from the stores (`REACH` in `before.txt`)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [ ] CHK-010 [P0] `node --check $S` exits 0
- [ ] CHK-011 [P0] The change is the one `HEREDOC_BODY` replace in `redirectTargets` (`G diff --stat`)
- [ ] CHK-012 [P1] The new comment states the why and carries no phase or finding id
- [ ] CHK-013 [P1] The fix matches the strip line `shellReadTargets` and `shellWriteTargets` already use
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] The full suite reports 0 failed and `FLOOR` and `EVAL` are unchanged (`after.txt`)
- [ ] CHK-022 [P1] The three new cases fail with the fix reverted
- [ ] CHK-023 [P1] `REACH` prints 0 lines on all five runtimes
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [ ] CHK-FIX-001 [P0] The finding class is `class-of-bug`: one parser of three skipped the heredoc strip
- [ ] CHK-FIX-002 [P0] Same-class producers listed in `plan.md`: `shellReadTargets` and `shellWriteTargets` already strip, `patchPaths` scans no `>`
- [ ] CHK-FIX-003 [P0] `normalize` is the only caller of `redirectTargets` (`rg -n 'redirectTargets\(' $RAD`)
- [ ] CHK-FIX-004 [P0] The tests cover the body comparison, the opening-line redirect and the start shape
- [ ] CHK-FIX-005 [P1] Matrix axes listed in `plan.md`: body, opening line, after the end word, quoted, unterminated
- [ ] CHK-FIX-006 [P1] N/A: the parser reads no environment or global state
- [ ] CHK-FIX-007 [P1] Evidence names the fix commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [ ] CHK-030 [P0] No prompt or session text in any scratch file (`PROBE` and `REACH` print counts and names only)
- [ ] CHK-031 [P0] `.skilled/hooks/hook-flags.env` neither read nor created
- [ ] CHK-032 [P1] N/A: no credential or auth path is touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [ ] CHK-040 [P1] Spec, plan, tasks and goal rows state the same rescored numbers
- [ ] CHK-041 [P1] The parser comment says why a heredoc body is data
- [ ] CHK-042 [P2] N/A: no README describes `redirectTargets`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [ ] CHK-050 [P1] Rescore files live in this phase's `scratch/` only
- [ ] CHK-051 [P1] `scratch/` holds only the two scripts, the before and after files and the rescore files
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



