---
title: "Tasks: Phase 13: devin-compaction-fallback-budget"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "devin compaction fallback budget tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 13: devin-compaction-fallback-budget

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

`V` is the CI command run from `.opencode/skills/system-spec-kit/runtime`: `npx vitest run --config ../vitest.config.ts --project root`. `C` is `tests/compaction-adapters.vitest.ts`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the baseline with the history engine built (worktree 427). Verify: `V` prints `Tests  1485 passed | 13 skipped (1498)`.
- [x] T002 Reproduce the CI failure with `.skilled/hooks/session-handover/history/dist/` moved aside. Verify: `V C` prints `expected 4099 to be less than or equal to 4096`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Replace the build-output fitter and the byte-cut fallback with an in-file fitter (`.skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs`). Verify: `node --check` exits 0 and `rg -n "dist/lookup-offer" post-compaction.cjs` prints nothing.
- [x] T004 Add the multi-byte case and five parity cases (`.skilled/skills/system-spec-kit/runtime/tests/compaction-adapters.vitest.ts`). Verify: `V C` with the build absent prints `Tests  18 passed (18)`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Negative control: the old hook with the build absent. Verify: `V C` prints `Tests  5 failed | 13 passed (18)`.
- [x] T006 Whole runtime project with the build present. Verify: `V` exits 0 and prints `Tests  1491 passed | 13 skipped (1504)`, the baseline plus the six new cases.
- [x] T007 History engine build and suites, the step CI runs after `V`. Verify: `npm --prefix .skilled/hooks/session-handover/history test` exits 0 and prints `Tests  148 passed (148)`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The compaction file passes with and without the build, and fails 5 cases on the old hook
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
