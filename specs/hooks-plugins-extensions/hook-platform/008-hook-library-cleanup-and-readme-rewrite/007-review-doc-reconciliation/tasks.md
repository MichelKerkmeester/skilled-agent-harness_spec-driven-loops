---
title: "Tasks: Phase 7: review-doc-reconciliation"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "review doc reconciliation tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: review-doc-reconciliation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`P` is the packet folder, `specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite`. `H` is `.skilled/hooks/README.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the six defects before any edit (`spec.md` Measured Behavior). Verify: the block shows `four children` at `goal.md:91` and `spec.md:59`, `not signed off` count 1, two unticked boxes, 105 READMEs, and 0 for `kill-switch-index` and `history/` in `H`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Name seven children in the description and handoff criteria, and fill phase map row 7 and its handoff row (`P/spec.md`). Verify: `grep -c "four children\|Four phases\|Phase 7 scope\|TBD" P/spec.md` prints 0.
- [x] T003 Name seven children in completion criterion 6 (`P/goal.md`). Verify: `grep -c "four children" P/goal.md` prints 0 and `grep -c "seven children" P/goal.md` prints 1.
- [x] T004 Record the operator's README fix in What Was Built and the count after the later merge (`P/004-hook-readme-fold-and-rewrite/implementation-summary.md`). Verify: `grep -c "not signed off" <file>` prints 0.
- [x] T005 Tick the two completion criteria, which are true (`P/004-hook-readme-fold-and-rewrite/tasks.md`). Verify: `grep -c "^- \[ \] T" <file>` and `grep -c "\[B\]" <file>` print 0 first, then `grep -c "^- \[ \]" <file>` prints 0.
- [x] T006 Record in SC-001 the count at phase close and the README a later merge added (`P/004-hook-readme-fold-and-rewrite/spec.md`). Verify: `grep -c "history/README.md" <file>` prints 1 and `find .skilled/hooks -name README.md | wc -l` prints 105.
- [x] T007 Add a `Kill-switch index` heading directly above the switch table (`H`). Verify: `grep -n "^### Kill-switch index" H` prints one line, and the switch table follows its one-sentence introduction.
- [x] T008 Add the `history/` line to the session-handover block of the tree (`H`). Verify: `grep -c 'history/' H` prints 1.
- [x] T012 Remove the long-specifier sentence and correct the alias comment (`H`), the two stale lines the operator added to this phase. Verify: `grep -c "long specifier\|test alias\|config's alias" H` prints 0, `rg -n "\.skilled/" .skilled/hooks/*/pi/*.ts` shows no import specifier, and the README's dispatch vitest command prints 3 files and 281 tests passed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Check the hooks README (`H`). Verify: `validate_document.py H` prints `VALID` and `hvr_scan.py H` reports `hard blockers: 0`.
- [x] T010 Validate the packet (`P`). Verify: `validate.sh P --recursive --strict` prints `RESULT: PASSED` eight times.
- [x] T011 Rerun the deep review with the same executor (`P/review/`). Verify: the new run's `deep_review.terminal_gates_recorded` row lists no failed gate, or the close-out names the gate that still fails.
- [x] T013 Add the URL-userinfo and owner-only tests first (`.skilled/hooks/cli-dispatch/lib/dispatch-audit.test.mjs`). Verify: against the unchanged core, 2 failed and 131 passed, with `not to contain 'hunter2'` and `expected 420 to be 384`.
- [x] T014 Redact URL userinfo and create the log with mode `0o600` (`.skilled/hooks/cli-dispatch/lib/dispatch-audit.mjs`). Verify: `node --check` passes and `dispatch-audit.test.mjs` prints 133 passed.
- [x] T015 Remove the fallback and alias text and add the missing tree entries (`.skilled/hooks/cli-dispatch/README.md`, `.skilled/hooks/subagent-dispatch-guard/README.md`, `.skilled/hooks/subagent-dispatch-guard/pi/README.md`, `.skilled/hooks/decision-capture/README.md`, `.skilled/hooks/session-lifecycle/README.md`, `H`). Verify: the REQ-006 search prints nothing, and each README prints `VALID` with `hard blockers: 0`.
- [x] T016 Check the documented adapter suites (`.skilled/hooks/cli-dispatch/README.md`). Verify: the four suites pass 283 of 283 with and without `--config`.
- [x] T017 Record the status and goal fixes (`P/spec.md`, `P/goal.md`, this phase). Verify: the REQ-008 records agree and `validate.sh P --recursive --strict` prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: each grep in T002 to T008 printed its expected value
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Review report**: See `../review/review-report.md`
<!-- /ANCHOR:cross-refs -->

---
