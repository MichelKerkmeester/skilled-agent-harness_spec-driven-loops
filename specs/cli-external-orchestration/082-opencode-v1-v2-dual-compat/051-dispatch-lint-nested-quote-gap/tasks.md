---
title: "Tasks: Phase 51: dispatch-lint-nested-quote-gap"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "dispatch lint nested quote gap tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 51: dispatch-lint-nested-quote-gap

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold this phase, register it in the parent map and copy the suite, mutation and corpus scripts with base `82df5375ba` (`../spec.md`, `scratch/`)
- [x] T002 Capture the baseline: hooks node 872, hooks vitest 401, plugins 516, battery 51, rule-checks 42, audit 124 (`scratch/suites/baseline/`)
- [x] T003 Reproduce the gap and find ten neighbours that also authorize on base (`.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Replace the two scan helpers with the context-stack scanner, and correct the writer's two deviations (`.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts`)
- [x] T005 Fix round 1: comments, `${`, `case`, contraction-only apostrophes and curly quotes read both ways (`.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts`)
- [x] T006 Fix round 2: comments and `case` after `)`, the turn marker, possessives, and the two cheap P2s (`.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts`)
- [x] T007 Post-round fix: a `/deep:` executor value must be plain text at its own position (`.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts`)
- [x] T008 Add 34 deny rows and 11 allow rows (`.skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts`)
- [x] T009 Update the review row and totals, 040's known gaps and the dispatch README (`../039-sk-code-opencode-alignment-audit/review.md`, `../040-dispatch-lint-held-fixes/implementation-summary.md`, `.skilled/hooks/dispatch/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Mutation: every deny row fails on base, 34 of 259 (`scratch/mutation/base-engine-final.txt`)
- [x] T011 Pi corpus: 0 of 476 texts move (`scratch/pi-corpus-diff.txt`)
- [x] T012 Three read-only reviews, each P1 fixed and covered by a row
- [x] T013 Suites at or above baseline (`scratch/suites/`)
- [x] T014 Recursive strict validation of the parent prints `RESULT: PASSED` - 53 folders passed, 0 failed, run on its own after the merge
- [x] T015 Push to main and record CI on the pushed commit and the tip - pushed `977dc751a8..48efc4f6cc`; 13 of 13 workflows green on `48efc4f6cc`, and the tip `ffddf3560b` green with the trigger-index rebuild skipped
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
