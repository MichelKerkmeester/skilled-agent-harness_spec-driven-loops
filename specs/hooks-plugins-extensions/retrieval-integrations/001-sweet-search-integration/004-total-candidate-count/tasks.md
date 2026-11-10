---
title: "Tasks: Phase 4: report total candidates in the trigger lookup"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "total candidate count tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: report total candidates in the trigger lookup

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-read every cited line range in the phase 3 design (`../003-retrieval-feature-design-research/research/iterations/iteration-001.md`). Verify: each range still holds the named code. Evidence: lookup-trigger-index.mjs JSDoc 148-159, literal 168-179, cap block 237-239 and formatAnswer :332 match the design.
- [x] T002 Record the test baseline (`.skilled/skills/system-spec-kit/runtime/cli/tests/`). Verify: the retrieval suite's pass and fail counts are written to `scratch/baseline.txt`. Evidence: `scratch/baseline.txt`: 4071 passed, 33 skipped, 0 failed, 333 files.
- [x] T002a Write the query set and runner (`benchmark/queries.txt`, `benchmark/run.mjs`). Verify: `wc -l benchmark/queries.txt` matches the count in `plan.md`. Evidence: 12 rows, written by cli-devin DeepSeek.
- [x] T002b Run the before benchmark (`benchmark/before.json`). Verify: one row per query, plus the index sha256 and git status count. Evidence: `benchmark/before.json`: 12 rows, 6 truncated, prompt-set p95 109.373 ms, index `d024126c0b36`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `totalCandidates` to the JSDoc, the answer literal (default `0`) and the cap block (`lookup-trigger-index.mjs`). Verify: the fixture lookup at `--limit 2` returns `totalCandidates: 6`. Evidence: diff adds the JSDoc line, `totalCandidates: 0` and `answer.totalCandidates = ordered.length`.
- [x] T004 Change the truncated branch of the `candidates :` line in `formatAnswer` (`lookup-trigger-index.mjs:332`). Verify: a `--limit 2` CLI run prints `2 of N (truncated)`. Evidence: benchmark rows read `candidates : 2 of 801 (truncated) from 1035 phrase(s)`.
- [x] T005 Add the section 8 sentence and the section 9 `specs/**/research/**` row (`retrieval-conventions.md`). Verify: `rg -n 'totalCandidates' retrieval-conventions.md` prints one line. Evidence: section 8 sentence and section 9 row present; parity suite passes.
- [x] T006 Add the nine test cases from the phase 3 design (`trigger-index.vitest.ts`, `retrieval-coverage-parity.vitest.ts`). Verify: both files pass. Evidence: `trigger-index.vitest.ts` and `retrieval-coverage-parity.vitest.ts`: 84/84 passed.
- [x] T020 Write the catalog entry and its index row (`feature-catalog/retrieval/trigger-lookup-total-candidates.md`, `feature-catalog.md`). Verify: `validate_catalog_package.py` exits 0. Evidence: `validate_catalog_package.py` exit 0 for every package.
- [x] T021 Write scenario 489 "Trigger lookup total candidates" with a real user request ("Search the trigger index for "spec folder validation strict" but only show me the top 2. How many matches did you leave out?"), commands, expected signals (The JSON answer has `totalCandidates` greater than 2; the human line reads `candidates : 2 of N (truncated)`; the assistant reports N) and pass/fail, and add its row to section 7.8 (`manual-testing-playbook/retrieval/trigger-lookup-total-candidates.md`, `manual-testing-playbook.md`). Verify: `validate-playbook-package.cjs --package .skilled/skills/system-spec-kit/manual-testing-playbook` exits 0. Evidence: `validate-playbook-package.cjs` exit 0; scenario 489 PASS on devin (`benchmark/scenario-489/matrix.md`).
- [x] T022 Update every README that describes the changed tool (`.skilled/skills/system-spec-kit/README.md`, `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md`, `.skilled/skills/system-spec-kit/runtime/data/README.md`). Verify: `rg -n` for each new flag or field finds it in each README that lists flags or fields. Evidence: skill README, retrieval README and root README updated; the data README does not describe lookup output.
- [x] T023 Write the changelog entry and bump the skill version (`changelog/v2.12.41.0.md`, `SKILL.md`), plus a line in the open root release notes. Verify: `check-release-coverage.cjs` reports no gap. Evidence: `changelog/v2.12.41.0.md`, `SKILL.md` version 2.12.41.0; root notes v4.0.2.0 are tagged, so no root line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Run `/local-skilled-alignment :auto --base=<commit before this phase>` on the uncommitted change. Verify: `scope.json` lists only this phase's files and `report.md` exists. Evidence: run `20261109T180850Z-p004`, 30 files, 0 commits; `alignment/report.md`.
- [x] T031 Fix every P0 and P1 finding, and fix or record each P2 (files named in `fix-plan.md`). Verify: each fix is in the diff or each skipped P2 has a reason in `implementation-summary.md`. Evidence: E-1, E-3, E-4, B-1, C-1 and BAT-01 fixed; BAT-02 to 04 repaired; B-2 pre-existing and C-2 refuted by the critic.
- [x] T032 Recheck with `/local-skilled-alignment --recheck=<run folder>` and copy `report.md` and `recheck.md` to `alignment/`. Verify: `recheck.md` shows 0 open P0 and P1 findings. Evidence: recheck resolved 7, still open 0, new 0; `alignment/recheck.md`.
- [x] T033 Run the after benchmark and write the comparison (`benchmark/after.json`, `benchmark/results.md`). Verify: the index sha256 matches `before.json` (the git status count is recorded, not compared, because the build edits are uncommitted during the after run), and every metric row in `plan.md` has a measured value. Evidence: `benchmark/results.md`: 6/6 totals, 0/6 changed, median 83.45 to 78.22 ms, p95 129.6 ms, index equal.
- [x] T007 Run the full retrieval test suite before and after the change. Verify: the after run has no new failures versus the baseline. Evidence: full suite 4077 passed, 0 failed versus baseline 4071 passed, 0 failed.
- [x] T008 Validate this phase folder. Verify: `validate.sh <this folder> --strict` prints `RESULT: PASSED`. Evidence: `validate.sh --strict` RESULT: PASSED.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Suite delta versus baseline reported in `implementation-summary.md`
- [x] Benchmark table and alignment result copied into `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Design**: See `../003-retrieval-feature-design-research/research/research.md`
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

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Every cited line range re-read and still matches the phase 3 design (T001)
- [x] CHK-002 [P0] `benchmark/before.json` exists with the index sha256 and git status count (T002b)
- [x] CHK-003 [P1] Executor preflight passed: `codex login status` and `devin auth status` both report signed in
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] `node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --format text --files <changed files>` exits 0
- [x] CHK-011 [P0] `python3 .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh -- <changed files>` passes: no spec, phase or task ids in comments
- [x] CHK-012 [P1] Every new error path exits 2 with a message on stderr, never a silent exit 1 N/A: the change adds no error path.
- [x] CHK-013 [P1] `npm --prefix .skilled/skills/system-spec-kit run check` passes, run by the conductor outside the codex sandbox Exit 0 in the worktree.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met` with evidence
- [x] CHK-021 [P0] Scenario 489 walked by the testing orchestrator and its PASS verdict recorded PASS 1/1, devin reported `Left out: 1,934 matches.`
- [x] CHK-022 [P1] Each edge case in `spec.md` has a passing test Tokenless, `--limit 0` and index-error cases covered by the new tests and the unchanged error path.
- [x] CHK-023 [P1] Every guardrail row in `benchmark/results.md` meets its target
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] `benchmark/` and `alignment/` hold no tokens, keys or home-directory secrets Benchmark and alignment files hold queries, timings and findings only.
- [x] CHK-031 [P0] Every new flag or input is validated and rejects bad values with exit 2 N/A: no new flag or input.
- [x] CHK-032 [P1] N/A: the retrieval CLI has no auth surface
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` name the same fields and flags
- [x] CHK-041 [P1] Alignment recheck shows no open S3, S4, S5 or S6 finding
- [x] CHK-042 [P2] The open root release notes carry a line for this change N/A: v4.0.2.0 is tagged.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temp files live in `scratch/`; benchmark and alignment evidence live in `benchmark/` and `alignment/`
- [x] CHK-051 [P1] `scratch/` cleaned and no `.backup-*` folder left before completion
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-09
<!-- /ANCHOR:summary -->

---



