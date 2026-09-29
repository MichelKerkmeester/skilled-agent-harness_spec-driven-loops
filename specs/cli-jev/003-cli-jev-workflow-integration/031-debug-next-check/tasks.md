---
title: "Tasks: Phase 31: debug-next-check"
description: "Ordered build and verification tasks for the offline debug next-check measurement: seam search, fixture reader, constant baselines, the label and payload gates, both model arms, the Keep Rule, tests, runs and the parent D6 skill docs."
trigger_phrases:
  - "debug next check tasks"
  - "score-debug-next-check tasks"
  - "next check payload gate tests"
  - "constant baseline tests"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 31: debug-next-check

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

`S` below is `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs` (proposed) and `V` is `.skilled/skills/system-spec-kit/runtime/tests/debug-next-check.vitest.ts` (proposed). Every task is Pending. The phase is Planned and was released on 2026-09-29, when the operator's "Bind and release" amended parent D3. Builds run in number order, and disjoint builds may run in parallel.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the `system-spec-kit` runtime vitest baseline at HEAD in `goal.md`'s log (`goal.md`)
- [ ] T002 [P] Reopen `../context/external repo's/claude-jev-main/src/domain/catalog/hypotheses.ts:10-15`, `:41-45`, `.skilled/agents/debug.md:246-276` and `universal-debugging-methodology.md:79-94`, rerun the seam search by hand and log any change (`goal.md`)
- [ ] T003 [P] Build synthetic fixtures inside `V`: 29 and 30 labeled rows, one unknown label, rows with and without `jev_ok` and a set where `read_code` is right on 28 of 30 (`V`)
- [ ] T004 [P] Write logging stub `jev` and `cli-deem` binaries inside `V` that answer per case (`V`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Write the seam search of REQ-002: `git grep -l next_check -- ':!specs'`, tracked `debug-delegation.md` files outside `templates/` and tracked spec files with a `### Hypothesis <n>` heading (`S`)
- [ ] T006 Write the fixture reader of REQ-005: the path-inside-repository refusal, row and label validation and the 30-row gate line (`S`)
- [ ] T007 Write the constant baselines and headroom of REQ-003 (`S`)
- [ ] T008 Write the payload gate of REQ-007: the `jev_ok` split, `unmeasured_withheld` and `jev arm skipped: payload not accepted` (`S`)
- [ ] T009 Add the Jev gate and arm: identity line, `command -v jev`, `jev --version` equal to `jev 0.6.2`, `jev auth status --provider P`, one `jev auth test --provider P`, the notice, three `jev choice` calls per accepted row in the orders of REQ-008, the 90 s cap and REQ-009's Jev exits (`S`)
- [ ] T010 Add the Deem gate and arm: `cli-deem health` within 2,000 ms with its four skip lines, the notice, three `cli-deem choice` calls per row and REQ-009's Deem exits with the exit-4 recheck (`S`)
- [ ] T011 Add the Keep Rule of spec section 4 in its fixed order, the verdict line on stdout and in `report.json`, the requalify lines, a `calls.jsonl` writer without row text and the `--out` refusal before any call (`S`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Write `V` with a happy path and one edge case per surface, as REQ-011 lists: the default run with no stub call and `--jev` without `--out`, seam search clean and planted, fixture reader valid and rejected, gate at 29 and 30, constant baselines and the tie, `no headroom`, the payload split and skip, both gates passing and skipping, Deem exit 4 with a new pair, no row text in `calls.jsonl` and `keep`, `kill` and `stop (coverage)`. Expect at least 22 passed tests (`V`)
- [ ] T013 Proof step 1: the census on the real tree with logging stubs first on `PATH`. Read exit 0, `seam: none`, `mined rows: 0` and two absent stub logs (`goal.md`)
- [ ] T014 Proof steps 2 and 3 on synthetic fixtures: the gate stop at 29 rows, the inside-repository refusal, the constant lines, `no headroom`, `jev arm skipped: payload not accepted` and the Deem stub-backend skip (`goal.md`)
- [ ] T015 Proof step 5: `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `S` prints nothing, `git status --porcelain` is the same before and after each run and `git diff --stat .skilled/agents/` is empty (`goal.md`)
- [ ] T016 [B] Only when the operator's fixture holds 30 labeled rows: one `--deem --out` run and, on the operator's flag, one `--jev --out` run on the accepted rows. Read each verdict line and every `calls.jsonl` line. Blocked on the operator's fixture (`goal.md`)
- [ ] T017 Write the parent D6 docs through sk-doc: `SKILL.md`, `README.md`, `runtime/scripts/README.md`, a new changelog file, the tooling-and-scripts catalog entry and the tooling-and-scripts playbook entry with their index rows. Run `validate_document.py` on each and read exit 0 (`.skilled/skills/system-spec-kit/`)
- [ ] T018 Rerun the runtime vitest suite and compare with T001, then run `validate.sh --strict` and `check-goal.cjs` on this phase and read `RESULT: PASSED` on each (`implementation-summary.md`)
- [ ] T019 Record the census lines and every stop or verdict line in `implementation-summary.md` and `goal.md`'s log for the parent's log (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, or T016 left `[B]` with the gate stop line recorded as the phase's result
- [ ] No other `[B]` blocked tasks remaining
- [ ] Manual verification passed: the census and the gate runs were read by the orchestrator session
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
<!-- /ANCHOR:cross-refs -->

---
