---
title: "Tasks: path-containment-seam"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "path containment seam"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: path-containment-seam

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

- [x] T001 Inventory the containment sites in the CLI with `rg` for `realpathSync`, `startsWith('..')` and the local canonicalizer; three write-boundary implementations found (`runtime/cli`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Export `canonicalizeExistingPrefix`, `isPathInsideRoot`, `assertPathInsideRoot` (`runtime/cli/utils/path-utils.ts`)
- [x] T003 [P] Replace the local canonicalizer and lexical check with the helper (`runtime/cli/spec-folder/nested-changelog.ts`)
- [x] T004 [P] Replace the realpath-only check with the helper, keeping the exit-1 contract (`runtime/cli/spec-folder/generate-description.ts`)
- [x] T005 Add the helper's unit test (`runtime/cli/tests/path-containment.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 CLI typecheck exit 0; `npm run build`; dist fresh
- [x] T007 Helper test 4 of 4, changelog 3 of 3, identity-safety 2 of 2
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
