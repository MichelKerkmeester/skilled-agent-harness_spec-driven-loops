---
title: "Tasks: Phase 60: Save and resume pointer truth"
description: "Ordered tasks to keep a track root's pointer in the telemetry store only and to make --help and seven save and resume docs match the runtime."
trigger_phrases:
  - "save resume pointer tasks"
  - "track root store only tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 60: Save and resume pointer truth

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

- [x] T001 Confirm the track-root rewrite
  - Evidence: phase 059's commit changed `specs/system-speckit/graph-metadata.json` in `last_save_at` and `last_active_at` only.
- [x] T002 Confirm the runtime facts the docs must state
  - Evidence: `resolvePhaseParentPointerHop` follows a pointer to an existing child at any age; the store is read first under default generator hardening; `planContinuityWrite` returns before any continuity write unless the mode is full-auto; the post-save refresh runs for every mode.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Store-only pointer at a track root (`runtime/cli/continuity/generate-context.ts`)
  - Evidence: the ancestor walk records the pointer in the store when an ancestor has no `spec.md`, and calls `updatePhaseParentPointer` otherwise; the store id comes from one shared helper, `getTelemetryStorePacketId`.
- [x] T004 `--help` says what each planner mode writes (`runtime/cli/continuity/generate-context.ts`)
  - Evidence: the planner-mode line and the Output note; `HELP_TEXT` is exported for the test.
- [x] T005 Tests (`runtime/cli/tests/phase-parent-pointer.vitest.ts`, `generate-context-help.vitest.ts`, `save-continuity-write.vitest.ts`)
  - Evidence: a track-root test, a `--help` test, and the save test's track assertion rewritten to check the unchanged file and the store.
- [x] T006 Correct the seven save and resume docs
  - Evidence: nine literal replacements across `save-workflow.md`, `quick-reference.md`, the skill `README.md`, `folder-routing.md`, both resume workflow assets and `save.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the suites, the typecheck and the check script
  - Evidence: the three suites 24 passed; `tsc --noEmit -p runtime/cli/tsconfig.json` exit 0; `npm --prefix runtime/cli run check` exit 0.
- [x] T008 Negative control against the previous writer
  - Evidence: the three new or changed tests fail; the other 21 pass.
- [x] T009 Rebuild the CLI project
  - Evidence: `npm run build` in `runtime/cli` exit 0; the compiled `--help` prints the new planner-mode text.
- [x] T010 Check the docs
  - Evidence: both resume assets parse as YAML, and the old 24-hour and null-pointer claims are gone from the seven files.
- [x] T011 Update documentation
  - Evidence: this phase's `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md`.
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
