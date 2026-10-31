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

- [x] T001 Re-measure phrase counts and body overlap per rule (scratch/). 16 to 29 per rule, 255 in total
- [x] T002 Draft one or two natural queries per rule and record which miss under the ripgrep recipe (scratch/). `scratch/query-misses.json`: 18 of 26 miss their rule
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Fix the `.skilled/repo-rules` row wording (`retrieval-conventions.md:284`)
- [x] T004 [P] Settle the phrase guidance in the template and `rule-anatomy.md`. No count target in the template, `rule-anatomy.md` or `creation-standards.md`
- [x] T005 [P] Optional, deferred under REQ-006: add the warn-only near-duplicate check with a pytest fixture (`check-repo-rules.cjs`). Not built; the phase closed without it, as REQ-006 allows
- [x] T006 Add plain-noun phrases for the queries that miss, after the 006 window is measured (`.skilled/repo-rules/*.md`). Added 2026-10-05 without the window, on the operator's close-out: 18 phrases across 11 rules, versions bumped in the fourth segment, 273 phrases in total
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run `retrieval-coverage-parity.vitest.ts`. 16 of 16 pass
- [x] T008 Run `check-repo-rules.cjs` and its pytest suite. 11/11 checks, 7 tests pass. Rerun after T006: RESULT: PASSED 11/11, phrase uniqueness 273 with 0 collisions, pytest 26 passed
- [x] T009 Rerun the T002 query list and confirm each finds its rule. 26 of 26 find their rule with `rg -i -F -l`; "recommend one option" and "root cause" also hit one other rule
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
