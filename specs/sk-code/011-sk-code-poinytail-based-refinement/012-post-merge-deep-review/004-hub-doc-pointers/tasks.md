---
title: "Tasks: Phase 4: hub-doc-pointers"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "hub doc pointers tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: hub-doc-pointers

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

- [x] T001 Read `sk-code-quality/SKILL.md:97`, the two scenarios, the playbook root and `stack-detection.md`, and record validator baselines
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P] Build the TH-002 wording through DeepSeek V4.1 Flash at max (`comment-hygiene-hook.md`)
- [x] T003 [P] Build the TH-001 wording through DeepSeek V4.1 Flash at max (`check-dist-staleness-hook.md`)
- [x] T004 [P] Build the playbook root wording, then move its parenthetical so the sentence reads cleanly (`manual-testing-playbook.md`)
- [x] T005 [P] Build the stack detection path swap through DeepSeek V4.1 Flash at max (`stack-detection.md`)
- [x] T006 Bump the six hub carriers to 2.2.8.0, write `changelog/v2.2.8.0.md` and regenerate the Hermes copy
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Rerun the stale wording and dead path searches
- [x] T008 Validate every edited doc against its baseline
- [x] T009 Confirm the re-mint with the route guard after the commit, then strict validation
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
