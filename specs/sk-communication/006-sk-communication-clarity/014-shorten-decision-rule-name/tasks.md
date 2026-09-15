---
title: "Tasks: Phase 14: shorten the decision rule name"
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
# Tasks: Phase 14: shorten the decision rule name

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
## Phase 1: Check, then rename

- [x] T001 Read the file for the meaning the shorter name gives up (`repo-rules/communication-decisions.md`)
  - DONE 2026-09-15: the line under the heading reads "Load before presenting a recommendation, a fork, a plan, or the result of a long run", and the rule sentence ends "This file governs the shape of the decision you are handing over". Nothing needed adding
- [x] T002 Rename with `git mv` and match the identity to the filename (`repo-rules/`)
  - DONE 2026-09-15: title and H1 became `Rule: Communication decisions`, version 1.2.0.0 to 1.3.0.0
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: References

- [x] T003 The sentence naming the four reply rules (`AGENTS.md`)
  - DONE 2026-09-15: section 8 repointed, and `CLAUDE.md` follows as a symlink to it
- [x] T004 The trigger row and the index row (`REPO RULES.md`)
  - DONE 2026-09-15: the display name became `Communication decisions`
- [x] T005 [P] The inbound links from the two sibling rules (`repo-rules/`)
  - DONE 2026-09-15: the reply rule records where the decision half moved, and the handoff rule cites it in its section 4
- [x] T006 [P] The misread table and the release-notes line (`sk-doc`, v4 changelog)
  - DONE 2026-09-15: both repointed, neither text otherwise changed
- [x] T007 The extra name on the benchmark coverage case (`reply-harness/cases.json`)
  - DONE 2026-09-15: the decision entry now reads communication-decisions.md and communication-presenting-decisions.md, counted as one item under either
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Prove every rule link resolves (`check-repo-rules.cjs`)
  - DONE 2026-09-15: `RESULT: PASSED (9/9 checks)`, 12 files, index summaries matching every description
- [x] T009 Prove no live reference names the old path (repo scan)
  - DONE 2026-09-15: the tracked scan outside `specs/` returns only the coverage case, which keeps every historical name on purpose
- [x] T010 Measure every rule filename (`repo-rules/`)
  - DONE 2026-09-15: the four reply rules read 16, 22, 24 and 26. This file went from 37, the longest in the corpus, to 26. The corpus longest is now `delegation-and-orchestration.md` at 31, which this pass did not touch
- [x] T011 Prove the frozen benchmark still holds (six rescored sides)
  - DONE 2026-09-15: every weighted mean and every blocking row identical, no missing item on any side
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (the five proof-plan checks from the final state)
<!-- /ANCHOR:completion -->

---

---

<!-- ANCHOR:verification -->
## Verification Checklist

- [x] CHK-001 [P0] Every rule link in the corpus resolves (T008)
- [x] CHK-002 [P0] No live reference names the old path (T009, only the coverage case, by design)
- [x] CHK-003 [P0] Six frozen benchmark sides score identically (T011)
- [x] CHK-004 [P0] The file states what the shorter name omits (T001, verified by reading, not assumed)
- [x] CHK-005 [P1] The rename is recorded as a rename (T002)
- [x] CHK-006 [P1] The title and H1 match the filename (T002)
- [x] CHK-007 [P1] The version was bumped (T002, 1.2.0.0 to 1.3.0.0)
- [x] CHK-008 [P1] No rule sentence changed (T002, the diff carries only identity lines)
- [x] CHK-009 [P1] Both sibling rules that link here were repointed (T005)
- [x] CHK-010 [P2] The four reply rules sit in one band (T010, 16, 22, 24 and 26, with the corpus longest 31 and untouched)
- [x] CHK-011 [P2] Security: no credential or path secret in the diff (not applicable: a rename and link edits)
- [x] CHK-012 [P2] The packet validates from the final state (validate.sh --strict RESULT: PASSED)

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 4 | 4/4 |
| P1 Items | 5 | 5/5 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-09-15, the five proof-plan checks run from the final state
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Name this supersedes**: phase 011, which set the prefixed name
<!-- /ANCHOR:cross-refs -->

---



