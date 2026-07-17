---
title: "Tasks: Resolver Registry and Preflight"
description: "Tasks to build the resolver registry, R1–R10 table, and fail-closed collision classifier with a recorded baseline."
trigger_phrases:
  - "resolver registry tasks"
  - "collision classifier tasks"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Resolver Registry and Preflight

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

- [ ] T001 Seed the resolver registry from research §4 (`scripts/core/config.ts` + new registry module)
- [ ] T002 [P] Define the R1–R10 expected-result table schema

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Fill the registry for every call site with file:line + precedence label
- [ ] T004 Implement the fail-closed read-only collision classifier (new module)
- [ ] T005 Record source revision + both dist hashes (baseline)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Classifier unit tests pass for all five identity classes
- [ ] T007 Confirm registry coverage vs research §4 (zero unclassified sites)

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Registry + R1–R10 table complete
- [ ] Classifier rejects divergent duplicates
- [ ] Baseline hashes recorded

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Research**: See `../research/research.md`

<!-- /ANCHOR:cross-refs -->
