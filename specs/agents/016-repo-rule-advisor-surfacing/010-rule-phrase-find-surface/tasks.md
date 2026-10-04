---
title: "Tasks: Rule phrase find surface"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "rule phrase find surface tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Rule phrase find surface

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

- [ ] T001 Re-measure phrase counts and body overlap per rule (scratch/)
- [ ] T002 Draft one or two natural queries per rule and record which miss under the ripgrep recipe (scratch/)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [P] Fix the `.skilled/repo-rules` row wording (`retrieval-conventions.md:284`)
- [ ] T004 [P] Settle the phrase guidance in the template and `rule-anatomy.md`
- [ ] T005 [P] Optional: add the warn-only near-duplicate check with a pytest fixture (`check-repo-rules.cjs`)
- [ ] T006 [B] Add plain-noun phrases for the queries that miss, after the 006 window is measured (`.skilled/repo-rules/*.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Run `retrieval-coverage-parity.vitest.ts`
- [ ] T008 Run `check-repo-rules.cjs` and its pytest suite
- [ ] T009 Rerun the T002 query list and confirm each finds its rule
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
