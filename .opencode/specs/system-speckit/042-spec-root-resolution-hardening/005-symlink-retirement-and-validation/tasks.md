---
title: "Tasks: Symlink Retirement and Validation"
description: "Tasks to build and run the R1–R10 × L1–L4 validation matrix, prove no-alias correctness, and retire the specs alias."
trigger_phrases:
  - "symlink retirement tasks"
  - "validation matrix tasks"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Symlink Retirement and Validation

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
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

- [ ] T001 Build the fixture factory (root mode × packet mode, temp workspaces)
- [ ] T002 [P] Stand up the L1/L2/L3/L4 lane harness

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Implement R1–R10 across L1 (source) and L2 (clean dist)
- [ ] T004 [P] L3 OS/no-symlink matrix (Linux/macOS/Windows); record skips + counts
- [ ] T005 L4 migration/rollback fault injection
- [ ] T006 Prove R7 (dangling) / R9 (plain file) / R10 (misdirected) + no-alias cases

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Full R1–R10 × L1–L4 matrix green
- [ ] T008 Commit the alias removal; confirm zero re-materialization
- [ ] T009 Capture before/after `validate.sh --strict` delta on representative packets

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Matrix green across all lanes; skips justified + counted
- [ ] Alias retired with zero re-materialization
- [ ] Before/after strict-validate delta captured

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Research**: See `../research/research.md`

<!-- /ANCHOR:cross-refs -->
