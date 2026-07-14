---
title: "Tasks: Phase 4: discriminating-bakeoff (contingency)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "glm-5.2 discriminating bakeoff tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/024-glm-5-2-support/004-discriminating-bakeoff"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Contingency task list scaffolded; not started"
    next_safe_action: "Execute only if phase 2 saturated"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/004-discriminating-bakeoff"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: discriminating-bakeoff (contingency)

<!-- SPECKIT_LEVEL: 1 -->

> **CONTINGENCY** — run only if phase 2 saturated.

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

- [ ] T001 Confirm phase 2 saturated (the trigger) and pick the next free run-label
- [ ] T002 Build `glm-5.2-frameworks-discriminating.json` (harder invalid-dominant validators, more samples/cell)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Run the discriminating bakeoff with a non-GLM judge
- [ ] T004 Confirm per-framework correctness is no longer uniform 1.0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Record the separable winner + leaderboard; refute the saturated phase-2 run
- [ ] T006 Hand off to a 003-style promotion; write implementation-summary.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] Correctness separated; winner named
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
