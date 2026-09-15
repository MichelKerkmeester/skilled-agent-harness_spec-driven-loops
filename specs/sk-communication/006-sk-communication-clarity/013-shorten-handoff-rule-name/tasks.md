---
title: "Tasks: Phase 13: shorten the handoff rule name"
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
# Tasks: Phase 13: shorten the handoff rule name

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
## Phase 1: Assess, then rename

- [x] T001 Answer whether the rule should split into a handoff rule and a questions rule instead (`repo-rules/`)
  - DONE 2026-09-15: declined and reported. The file is 188 lines against a 250 ceiling, so the ceiling pressure that forced the phase 003 split is absent, and the two halves are one sentence rather than two rules
- [x] T002 Measure the name against its siblings before choosing a replacement (`repo-rules/`)
  - DONE 2026-09-15: 16, 22, 37 and 38 characters. The chosen name is 24, which sits beside the sentence rule
- [x] T003 Rename with `git mv` and rewrite the identity (`repo-rules/communication-handoff.md`)
  - DONE 2026-09-15: title and H1 became `Rule: Communication handoff`, version 1.4.0.0 to 1.5.0.0
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: References

- [x] T004 The sentence naming the four reply rules (`AGENTS.md`)
  - DONE 2026-09-15: section 8 repointed. `CLAUDE.md` is a symlink to this file, so it follows
- [x] T005 The trigger row, the index row and the scope paragraph (`REPO RULES.md`)
  - DONE 2026-09-15: display name became `Communication handoff`, and the fourth-widening paragraph names the new path
- [x] T006 [P] The misread table (`sk-create-repo-rule/references/creation-standards.md`)
  - DONE 2026-09-15: the row renamed, the misread text untouched
- [x] T007 [P] The release-notes line naming the reply rules (v4 changelog)
  - DONE 2026-09-15: the communication-quality subsection names the new path
- [x] T008 The third name on the benchmark coverage case (`reply-harness/cases.json`)
  - DONE 2026-09-15: the handoff entry now reads communication-handoff.md, communication-handoff-and-questions.md, handoff-and-questions.md, counted as one item under any of them
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Prove every rule link resolves (`check-repo-rules.cjs`)
  - DONE 2026-09-15: `RESULT: PASSED (9/9 checks)`, 12 files, 32 links all resolving
- [x] T010 Prove no live reference names the old path (repo scan)
  - DONE 2026-09-15: the tracked scan outside `specs/` returns only the coverage case, which keeps every historical name on purpose
- [x] T011 Prove the frozen benchmark still holds (six rescored sides)
  - DONE 2026-09-15: every weighted mean and every blocking row identical, and the coverage case reports no missing item on any side
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (the four proof-plan checks from the final state)
<!-- /ANCHOR:completion -->

---

---

<!-- ANCHOR:verification -->
## Verification Checklist

- [x] CHK-001 [P0] Every rule link in the corpus resolves (T009, 32 links)
- [x] CHK-002 [P0] No live reference names the old path (T010, only the coverage case matches, by design)
- [x] CHK-003 [P0] Six frozen benchmark sides score identically (T011)
- [x] CHK-004 [P1] The rename is recorded as a rename (T003, `git diff -M` reports it as one)
- [x] CHK-005 [P1] The title and H1 match the filename (T003)
- [x] CHK-006 [P1] The version was bumped (T003, 1.4.0.0 to 1.5.0.0)
- [x] CHK-007 [P1] No rule sentence changed (T003, the diff carries only identity lines)
- [x] CHK-008 [P1] The split question was answered before the name was changed (T001, assessed and declined with reasons)
- [x] CHK-009 [P2] The questions half is still reachable from the router (T005, the trigger row still names asking the operator anything)
- [x] CHK-010 [P2] Security: no credential or path secret in the diff (not applicable: a rename and link edits)
- [x] CHK-011 [P2] The packet validates from the final state (validate.sh --strict RESULT: PASSED)

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 3 | 3/3 |
| P1 Items | 5 | 5/5 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-09-15, the four proof-plan checks run from the final state
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Name this supersedes**: phase 011, which set the prefixed name
<!-- /ANCHOR:cross-refs -->

---



