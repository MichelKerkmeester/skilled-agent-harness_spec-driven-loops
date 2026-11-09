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

<!-- SPECKIT_LEVEL: 1 -->

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

- [ ] T001 Re-read every cited line range in the phase 3 design (`../003-retrieval-feature-design-research/research/iterations/iteration-001.md`). Verify: each range still holds the named code.
- [ ] T002 Record the test baseline (`.skilled/skills/system-spec-kit/runtime/cli/tests/`). Verify: the retrieval suite's pass and fail counts are written to `scratch/baseline.txt`.
- [ ] T002a Write the query set and runner (`benchmark/queries.txt`, `benchmark/run.sh`). Verify: `wc -l benchmark/queries.txt` matches the count in `plan.md`.
- [ ] T002b Run the before benchmark (`benchmark/before.json`). Verify: one row per query, plus the index sha256 and git status count.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add `totalCandidates` to the JSDoc, the answer literal (default `0`) and the cap block (`lookup-trigger-index.mjs`). Verify: the fixture lookup at `--limit 2` returns `totalCandidates: 6`.
- [ ] T004 Change the truncated branch of the `candidates :` line in `formatAnswer` (`lookup-trigger-index.mjs:332`). Verify: a `--limit 2` CLI run prints `2 of N (truncated)`.
- [ ] T005 Add the section 8 sentence and the section 9 `specs/**/research/**` row (`retrieval-conventions.md`). Verify: `rg -n 'totalCandidates' retrieval-conventions.md` prints one line.
- [ ] T006 Add the nine test cases from the phase 3 design (`trigger-index.vitest.ts`, `retrieval-coverage-parity.vitest.ts`). Verify: both files pass.
- [ ] T020 Write the catalog entry and its index row (`feature-catalog/retrieval/trigger-lookup-total-candidates.md`, `feature-catalog.md`). Verify: `validate_catalog_package.py` exits 0.
- [ ] T021 Write scenario 489 "Trigger lookup total candidates" with a real user request ("Search the trigger index for "spec folder validation strict" but only show me the top 2. How many matches did you leave out?"), commands, expected signals (The JSON answer has `totalCandidates` greater than 2; the human line reads `candidates : 2 of N (truncated)`; the assistant reports N) and pass/fail, and add its row to section 7.8 (`manual-testing-playbook/retrieval/trigger-lookup-total-candidates.md`, `manual-testing-playbook.md`). Verify: `validate-playbook-package.cjs --package .skilled/skills/system-spec-kit/manual-testing-playbook` exits 0.
- [ ] T022 Update every README that describes the changed tool (`.skilled/skills/system-spec-kit/README.md`, `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md`, `.skilled/skills/system-spec-kit/runtime/data/README.md`). Verify: `rg -n` for each new flag or field finds it in each README that lists flags or fields.
- [ ] T023 Write the changelog entry and bump the skill version (`changelog/v2.12.39.0.md`, `SKILL.md`), plus a line in the open root release notes. Verify: `check-release-coverage.cjs` reports no gap.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T030 Run `/local-skilled-alignment :auto --base=<commit before this phase>` on the uncommitted change. Verify: `scope.json` lists only this phase's files and `report.md` exists.
- [ ] T031 Fix every P0 and P1 finding, and fix or record each P2 (files named in `fix-plan.md`). Verify: each fix is in the diff or each skipped P2 has a reason in `implementation-summary.md`.
- [ ] T032 Recheck with `/local-skilled-alignment --recheck=<run folder>` and copy `report.md` and `recheck.md` to `alignment/`. Verify: `recheck.md` shows 0 open P0 and P1 findings.
- [ ] T033 Run the after benchmark and write the comparison (`benchmark/after.json`, `benchmark/results.md`). Verify: the index sha256 and git status count match `before.json`, and every metric row in `plan.md` has a measured value.
- [ ] T007 Run the full retrieval test suite before and after the change. Verify: the after run has no new failures versus the baseline.
- [ ] T008 Validate this phase folder. Verify: `validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Suite delta versus baseline reported in `implementation-summary.md`
- [ ] Benchmark table and alignment result copied into `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Design**: See `../003-retrieval-feature-design-research/research/research.md`
<!-- /ANCHOR:cross-refs -->

---
