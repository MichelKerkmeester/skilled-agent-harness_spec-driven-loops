---
title: "Tasks: Phase 53: Legacy template default detection"
description: "Ordered tasks to report retired template defaults as warnings and record a repository baseline."
trigger_phrases:
  - "legacy default detection tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 53: Legacy template default detection

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

Decisions: answered by the operator on 2026-09-23 and recorded in `spec.md` §7. Any rewrite is decided after the baseline, no retroactive fix is forced, and a cheap-model sample is measured.

- [ ] T001 Confirm phase 052 is closed and copy its retired-default list, the tasks description included
- [ ] T002 [P] Add defaults from earlier core-template versions found in git history (`templates/core/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add the exact-match, warning-severity check inside `validatePlaceholders` (`runtime/lib/validation/orchestrator.ts`)
- [ ] T004 [P] Document the warning in the rule table (`references/validation/validation-rules.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Add tests for REQ-001, REQ-002 and REQ-003 (`runtime/tests/`)
- [ ] T006 Rebuild `dist` and run the vitest suite
- [ ] T007 Run validation recursively over `specs/` and record the count per retired default (REQ-004)
- [ ] T008 Pick the 20-doc sample from the baseline and dispatch `gpt-6-luna` at medium effort on the normal service tier through cli-codex, read-only, after reading `cli-codex/SKILL.md` (REQ-006)
- [ ] T009 Grade each draft against its doc and record drafts, verdicts, time and tokens in `scratch/backfill-sample.md`
- [ ] T010 Run strict validation on this phase
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
