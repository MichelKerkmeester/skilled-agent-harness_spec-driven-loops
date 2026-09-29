---
title: "Tasks: Phase 28: confirm-mode-stop-hint"
description: "Ordered build and verification tasks for the offline confirm-mode stop hint evaluator: 027 report reader, hint counter, column switches, the Keep Rule, tests, one run and the parent D6 skill docs."
trigger_phrases:
  - "stop hint tasks"
  - "score-stop-hint tasks"
  - "hint precision tests"
  - "confirm-mode hint verification"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 28: confirm-mode-stop-hint

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

**Task Format**: `T### [P?] Description (file path)`

`S` below is `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs` (proposed) and `V` is `.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-hint.vitest.ts` (proposed). Every task is Pending. The phase is Planned and was released on 2026-09-29, when the operator's "Bind and release" amended parent D3. Builds run in number order, and disjoint builds may run in parallel.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the runtime vitest baseline at HEAD in `goal.md`'s log (`goal.md`)
- [ ] T002 [P] Reopen `.skilled/commands/deep/assets/deep-research-confirm.yaml:1325-1354` and 027's final report format, and log any drift (`goal.md`)
- [ ] T003 [P] Write fixture 027 reports inside `V`: one with a passed gate and `legacy`, `sources`, `jev` and `deem` columns, one whose gate stopped, one without rater columns and one broken file (`V`)
- [ ] T004 [P] Write logging stub `jev` and `cli-deem` binaries inside `V` for the no-call check (`V`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Write the report reader: `--rater-report <dir>`, the label-gate check with `stop: rater report has no confirmed gold`, exit 2 on a missing or broken file and the report's SHA-256 (`S`)
- [ ] T006 Write the hint counter of REQ-003 per column and lineage: hint iteration, right, wrong, no hint and iterations saved (`S`)
- [ ] T007 Write the column selector: `legacy` and `sources` by default, `--jev` and `--deem` with their skip lines when 027 recorded no such column or recorded it skipped or stopped (`S`)
- [ ] T008 Write the Keep Rule of spec section 4 in its fixed order, the verdict line on stdout and in `report.json`, the rater fields and `requalify: rater changed` of REQ-006 and the proposed hint line of REQ-007 (`S`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Write `V` with a happy path and one edge case per surface: reader pass and gate stop, broken file exit 2, hint counter right and wrong, both skip lines with byte-identical remaining output, `keep`, `kill` and `stop (precision)`, the proposed line on a keep and no stub call in any mode. Expect at least 10 passed tests (`V`)
- [ ] T010 Proof steps 1 to 3 on fixtures with logging stubs first on `PATH`. Read each exit status, the column lines, the verdict lines and two absent stub logs (`goal.md`)
- [ ] T011 Proof step 5: `git status --porcelain` is the same before and after each run, and `git diff --stat .skilled/commands/deep/assets/` is empty (`goal.md`)
- [ ] T012 [B] One run on phase 027's real report with `--jev --deem`. Read each column's verdict or skip line. Blocked until 027 has a report whose label gate passed (`goal.md`)
- [ ] T013 Write the parent D6 docs through sk-doc after the run: `SKILL.md`, `runtime/README.md`, `runtime/scripts/README.md`, a new runtime changelog file, the scoring catalog entry and the scoring playbook entry with their index rows. Run `validate_document.py` on each and read exit 0 (`.skilled/skills/system-deep-loop/`)
- [ ] T014 Rerun the runtime vitest suite and compare with T001, then run `validate.sh --strict` and `check-goal.cjs` on this phase and read `RESULT: PASSED` on each (`implementation-summary.md`)
- [ ] T015 Record every stop or verdict line in `implementation-summary.md` and `goal.md`'s log for the parent's log (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, or T012 left `[B]` with `stop: rater report has no confirmed gold` recorded as the phase's result
- [ ] No other `[B]` blocked tasks remaining
- [ ] Manual verification passed: the fixture runs and any real run were read by the orchestrator session
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
<!-- /ANCHOR:cross-refs -->

---
