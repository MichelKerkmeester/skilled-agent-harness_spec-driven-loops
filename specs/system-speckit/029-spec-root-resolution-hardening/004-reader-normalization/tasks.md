---
title: "Tasks: Reader Normalization"
description: "Tasks to make readers canonical-first with read-only legacy fallback and run a clean compatibility window."
trigger_phrases:
  - "reader normalization tasks"
  - "compatibility window tasks"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Reader Normalization

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

- [ ] T001 Add the fallback-hit counter + compatibility-window harness

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Shared helper canonical-first with read-only legacy fallback (`scripts/core/config.ts`)
- [ ] T003 [P] Independent constructors canonical-first (resume, discovery, indexing, affinity, memory-quality)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T004 Reader fixtures pass (canonical-first + unique legacy-only fallback)
- [ ] T005 Run the 28-day zero-hit compatibility window

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All unqualified readers canonical-first; explicit paths preserved
- [ ] Zero fallback hits recorded over the window

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Research**: See `../research/research.md`

<!-- /ANCHOR:cross-refs -->
