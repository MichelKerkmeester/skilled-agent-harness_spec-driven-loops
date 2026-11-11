---
title: "Tasks: Phase 6: overlay-replaced-subtree-repin"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "overlay replaced subtree repin tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: overlay-replaced-subtree-repin

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

`O` is `.skilled/commands/doctor/scripts`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Write failing tests (`O/tests/overlay-engine-repin.test.cjs`, `O/tests/overlay-engine-fixes.test.cjs`). Verify: on the unchanged engine, fixes has 1 failure and repin has 2.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add the provenance check and the readers (`O/overlay-engine.cjs`). Verify: the three new tests pass.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T003 Run every overlay test file. Verify: 18, 21, 6, 20 and 8 tests pass, with 0 failures.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification recorded in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source report**: Barter's handover, `barter/ai-speckit/specs/skilled-barter-overlays/002-spec-tracks-restructure/009-repin-b6e570ffb2/handover.md`
<!-- /ANCHOR:cross-refs -->

---



