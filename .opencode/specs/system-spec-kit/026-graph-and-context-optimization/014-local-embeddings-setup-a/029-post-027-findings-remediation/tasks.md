---
title: "Tasks: Fix all 21 P1 + 16 P2 findings from 027 deep-review. 6 workstreams: profile identity & dtype contract, provider fallback correctness, profile-keyed DB naming cleanup, operator docs & catalog drift, fixture refresh, legacy dependency/comment residue. cli-codex gpt-5.5 reasoning=high service_tier=standard (NOT fast). [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/029-post-027-findings-remediation"
    last_updated_at: "2026-05-13T19:18:30Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/029-post-027-findings-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Fix all 21 P1 + 16 P2 findings from 027 deep-review. 6 workstreams: profile identity & dtype contract, provider fallback correctness, profile-keyed DB naming cleanup, operator docs & catalog drift, fixture refresh, legacy dependency/comment residue. cli-codex gpt-5.5 reasoning=high service_tier=standard (NOT fast).

<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] T001 Create project structure
- [ ] T002 Install dependencies
- [ ] T003 [P] Configure development tools
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [Implement core feature 1]
- [ ] T005 [Implement core feature 2]
- [ ] T006 [Implement core feature 3]
- [ ] T007 [Add error handling]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Test happy path manually
- [ ] T009 Test edge cases
- [ ] T010 Update documentation
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

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

