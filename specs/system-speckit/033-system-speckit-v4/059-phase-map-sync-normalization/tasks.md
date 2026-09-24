---
title: "Tasks: Phase 59: Phase-map sync normalization"
description: "Ordered tasks to make the phase-map sync tool leave agreeing rows alone, write a status rather than a note, warn about rows it cannot see, and report completion mismatches without writing them."
trigger_phrases:
  - "phase map sync tasks"
  - "completion pct report only tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 59: Phase-map sync normalization

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

- [x] T001 Reproduce the defect with a dry run on the v4 parent
  - Evidence: 38 proposed row changes, 35 of them case-only and one a pasted free-text note; no word about the rows after the blank line; 31 proposed `completion_pct` writes to descendant `spec.md` files.
- [x] T002 Check for callers of the completion write
  - Evidence: a repository search outside `specs/`, `dist/` and `node_modules` finds only the tool, its test, the fixture README and the spec README.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Keep only the leading status from a status cell (`runtime/cli/spec/sync-phase-map-status.ts`)
  - Evidence: `leadingStatus` cuts at the first bracket, semicolon, colon, comma, period or spaced dash; `parseSpecStatus` returns it.
- [x] T004 Leave a row that already agrees (`runtime/cli/spec/sync-phase-map-status.ts`)
  - Evidence: `statusesAgree` compares normalized leading statuses and treats two completion words as agreeing; it replaces the exact comparison in the row loop.
- [x] T005 Warn about a blank line inside the table and about children with no row (`runtime/cli/spec/sync-phase-map-status.ts`)
  - Evidence: the row loop warns before it breaks at a blank line followed by a row; after the loop, each unmatched child gets a warning.
- [x] T006 Report completion mismatches without writing them (`runtime/cli/spec/sync-phase-map-status.ts`)
  - Evidence: the descendant write block is gone; the summary fields are `completionPctMismatchesFound` and `completionPctMismatches`, printed as reported, not written.
- [x] T007 Test each change (`runtime/cli/tests/sync-phase-map-status.vitest.ts`)
  - Evidence: five new tests; the completion test and the idempotency test now expect reporting, with no file changed between runs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the suite and the typecheck
  - Evidence: `sync-phase-map-status.vitest.ts` 10 passed; `tsc --noEmit -p runtime/cli/tsconfig.json` exit 0.
- [x] T009 Negative control against the previous tool
  - Evidence: 7 of 10 fail, the five new tests and the two rewritten ones; the three unchanged tests pass.
- [x] T010 Rebuild the CLI project
  - Evidence: `npm run build` in `runtime/cli` exit 0, build attestation recorded; the compiled tool contains the new summary field.
- [x] T011 Update documentation
  - Evidence: the tool's two entries in `runtime/cli/spec/README.md`, and this phase's `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md`.
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
