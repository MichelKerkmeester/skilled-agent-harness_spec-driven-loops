---
title: "Tasks: Phase 15: evidence rule seam links"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 15: evidence rule seam links

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
## Phase 1: Read, then place

- [x] T001 Derive the cross-reference graph across all twelve rules (`repo-rules/`)
  - DONE 2026-09-15: `evidence-and-proof.md` was pointed at by four rules and pointed at none, the only rule in the corpus with that shape
- [x] T002 Read the rule's sections for passages that end at another rule's territory (`repo-rules/evidence-and-proof.md`)
  - DONE 2026-09-15: four found. The tiers table's unresolved case, a finding confirmed against a symptom, a finding handed back by a delegate, and the close-out's boundary with the handback
- [x] T003 Append one clause per seam (`repo-rules/evidence-and-proof.md`)
  - DONE 2026-09-15: each appended to a sentence that already reached the seam, rather than added as a new paragraph
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Fit the budget

- [x] T004 Measure against the ceiling after the first pass (`repo-rules/evidence-and-proof.md`)
  - DONE 2026-09-15: 248 lines against 250. The file had opened at 239, so the first pass spent nine of eleven available lines
- [x] T005 Tighten every clause and drop the one that pointed where another already did
  - DONE 2026-09-15: a second pointer at the honesty rule was removed, since the tiers section already names that seam. Final 244 lines, six clear of the ceiling
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Re-derive the graph from the final state (`repo-rules/`)
  - DONE 2026-09-15: the rule names four neighbours and is named by four, with the delegation rule and the handoff rule now reciprocal
- [x] T007 Confirm every rule is still reachable (`REPO RULES.md`, `AGENTS.md`)
  - DONE 2026-09-15: all twelve carry a trigger row and an index row. `blast-radius.md` has no rule-to-rule link either way and is reached twice from the router and twice from the root document, so it is a rule with no seam rather than an unreachable one
- [x] T008 Run the corpus checker (`check-repo-rules.cjs`)
  - DONE 2026-09-15: `RESULT: PASSED (9/9 checks)`, every link in the corpus resolving
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (the graph re-derived, the reachability check, the corpus checker)
<!-- /ANCHOR:completion -->

---

---

<!-- ANCHOR:verification -->
## Verification Checklist

- [x] CHK-001 [P0] Every link in the corpus resolves (T008, checker 9 of 9)
- [x] CHK-002 [P0] Each link sits on a passage that already reached the seam (T002, the sections were read before any edit)
- [x] CHK-003 [P0] The file stays under the ceiling (T005, 244 against 250)
- [x] CHK-004 [P1] The rule names four neighbours (T006)
- [x] CHK-005 [P1] Two of the four links are reciprocal (T006, the delegation rule and the handoff rule)
- [x] CHK-006 [P1] No rule is named twice in this file (T005, the duplicate pointer was dropped)
- [x] CHK-007 [P1] No instruction was added, removed or reworded (T003, the diff carries only appended clauses)
- [x] CHK-008 [P1] Every rule in the corpus is still reachable (T007, twelve trigger rows and twelve index rows)
- [x] CHK-009 [P2] The one isolated rule was checked rather than assumed broken (T007, reachable four ways, simply sharing no seam)
- [x] CHK-010 [P2] Security: no credential or path secret in the diff (not applicable: four prose clauses)
- [x] CHK-011 [P2] The packet validates from the final state (validate.sh --strict RESULT: PASSED)

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 3 | 3/3 |
| P1 Items | 5 | 5/5 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-09-15, the graph re-derived from the files, the reachability check, then the corpus checker
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Standard this follows**: phase 012, one pointer per seam
<!-- /ANCHOR:cross-refs -->

---



