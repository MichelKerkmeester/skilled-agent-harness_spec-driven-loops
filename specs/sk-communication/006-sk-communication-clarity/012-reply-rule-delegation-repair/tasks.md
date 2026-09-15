---
title: "Tasks: Phase 12: reply rule delegation repair"
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
# Tasks: Phase 12: reply rule delegation repair

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
## Phase 1: Find

- [x] T001 Sweep every bolded directive in all twelve rule files against every other (`repo-rules/`)
  - DONE 2026-09-15: 182 directives across 12 files, scored on shared content words, four cross-file pairs above the threshold
- [x] T002 Read each candidate in context rather than trusting the score (`repo-rules/`)
  - DONE 2026-09-15: one is a real duplicate. The two reproduce directives serve proof and diagnosis separately, the two exit-status directives serve a delegate's return and a command's own evidence, and the forward-motion directive names the prose floor rather than restating it
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Repair

- [x] T003 Replace the headline clause the file delegates (`repo-rules/communication.md`)
  - DONE 2026-09-15: "one idea per sentence" became "the answer first". The file said three lines below that sentence mechanics live in the prose rule, so it had been stating a rule it delegates
- [x] T004 Confirm both clauses resolve to sections of the same file (`repo-rules/communication.md`)
  - DONE 2026-09-15: the answer first is section 5, the first line. Nothing that does not carry information is section 3, cut filler
- [x] T005 Bump the version (`repo-rules/communication.md`)
  - DONE 2026-09-15: 1.4.0.0 to 1.4.1.0, a wording repair rather than a new instruction
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Rerun the sweep from the final state (`repo-rules/`)
  - DONE 2026-09-15: no directive is stated in two files
- [x] T007 Run the corpus checker (`check-repo-rules.cjs`)
  - DONE 2026-09-15: `RESULT: PASSED (9/9 checks)`, 12 files, 228 phrases with 0 collisions, max 242 lines against the 250 ceiling
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (the sweep rerun, then the corpus checker)
<!-- /ANCHOR:completion -->

---

---

<!-- ANCHOR:verification -->
## Verification Checklist

- [x] CHK-001 [P0] No directive is stated in two rule files (T006, sweep rerun from the final state)
- [x] CHK-002 [P0] The corpus checker passes 9 of 9 (T007)
- [x] CHK-003 [P1] Each candidate was read in context before being called a duplicate or dismissed (T002, three dismissed with a reason each)
- [x] CHK-004 [P1] Both clauses of the new headline resolve to sections of the same file (T004)
- [x] CHK-005 [P1] The delegated instruction still exists in the corpus (T003, the prose rule keeps it, which is where the split put it)
- [x] CHK-006 [P1] The version was bumped (T005)
- [x] CHK-007 [P2] The file stays under the line ceiling (T007, 242 against 250)
- [x] CHK-008 [P2] Only one file changed (scope, one sentence and one version line)
- [x] CHK-009 [P2] Security: no credential or path secret in the diff (not applicable: one prose sentence)
- [x] CHK-010 [P2] The packet validates from the final state (validate.sh --strict RESULT: PASSED)

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 2 | 2/2 |
| P1 Items | 4 | 4/4 |
| P2 Items | 4 | 4/4 |

**Verification Date**: 2026-09-15, the directive sweep rerun from the final state, then the corpus checker
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Seam this repairs**: phase 003, which split the reply rule from the sentence rule
<!-- /ANCHOR:cross-refs -->

---



