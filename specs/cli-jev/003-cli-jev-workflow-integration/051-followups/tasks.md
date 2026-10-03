---
title: "Tasks: Jev feature follow-ups"
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
# Tasks: Jev feature follow-ups

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

- [ ] T001 Brief the three stream leads
- [ ] T002 Capture the suite baselines before any change
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Stream A: transport model and usage, input wrapping, record fields for 035, 024 and 025
- [ ] T004 Stream B: 032 non-blocking check, R9 and its record fields
- [ ] T005 Stream C: 025 capture, retire 026, 029 and 031
- [ ] T006 Commit streams A to C, then brief the R8 lead
- [ ] T007 Stream D: 017 R8 port and 017's record fields
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Session reruns each stream's suites with `TYPESAFE_API_KEY` set and unset
- [ ] T009 Session checks each verdict line against its run folder
- [ ] T010 Lead review of every DeepSeek diff: fix P0 and P1, record P2
- [ ] T011 Run `validate.sh --strict` on this phase
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



