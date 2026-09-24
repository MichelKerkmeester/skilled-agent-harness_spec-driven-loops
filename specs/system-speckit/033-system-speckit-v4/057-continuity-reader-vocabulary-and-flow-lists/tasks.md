---
title: "Tasks: Phase 57: Continuity reader vocabulary and flow lists"
description: "Ordered tasks to make the continuity reader accept flow-style lists and the opening words hand-written blocks use."
trigger_phrases:
  - "continuity reader tasks"
  - "flow list parsing tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 57: Continuity reader vocabulary and flow lists

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

- [x] T001 Scan every tracked `implementation-summary.md` outside `z_archive` with the reader
  - Evidence: 2484 blocks, 180 valid; the `next_safe_action` first-word rule rejected 2119 and flow lists failed every list field written that way; 12 files could not be parsed at all.
- [x] T002 Tally the first words of `next_safe_action`
  - Evidence: none 401, replace 170, "none;" 151, commit 145, operator 114, close 95, phase 78, execute 75, use 74, proceed 53.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Parse one-level flow lists (`runtime/lib/continuity/thin-continuity-record.ts`)
  - Evidence: `parseFlowSequence`, called from `parseYamlScalar` for bracketed values; nested brackets, an unclosed quote or an empty item keep the raw text.
- [x] T004 Strip trailing punctuation from the first word (`runtime/lib/continuity/thin-continuity-record.ts`)
  - Evidence: the first-token check removes non-letter, non-digit characters at the end of the word.
- [x] T005 Widen the allowed first words from 41 to 62 (`runtime/lib/continuity/thin-continuity-record.ts`)
  - Evidence: 21 words added; "Replace" left out on purpose and the reason recorded in a comment.
- [x] T006 Add tests for hand-written blocks (`runtime/tests/thin-continuity-record.vitest.ts`)
  - Evidence: `describe('hand-written continuity blocks')`, flow lists plus five accepted and two rejected opening phrases.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the reader's own suite and the negative control
  - Evidence: 15 of 15 pass; against the previous reader 6 fail.
- [x] T008 Run the suites that read continuity
  - Evidence: `cli` project, save-continuity-write, continuity-freshness and input-normalizer-unit: 55 passed, 1 skipped. `root` project, path-boundary, spec-doc-structure, resume-ladder, continuity-freshness, thin-continuity-record, gate-d-regression-quality-gates and dist-freshness: 79 passed.
- [x] T009 Typecheck and the CLI check
  - Evidence: `npm run typecheck` exit 0; `npm --prefix runtime/cli run check` exit 0.
- [x] T010 Rescan the same blocks
  - Evidence: valid 180 → 1047 of 2484; first-word rejections 2119 → 849; the same 12 unparseable files.
- [x] T011 Update documentation
  - Evidence: `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` in this phase.
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
