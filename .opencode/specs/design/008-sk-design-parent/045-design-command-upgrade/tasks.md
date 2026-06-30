---
title: "Tasks: design command upgrade"
description: "Planned task list for inventorying, aligning, and verifying the design command surface."
trigger_phrases:
  - "design command upgrade tasks"
  - "command replay tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/045-design-command-upgrade"
    last_updated_at: "2026-06-30T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Replaced template tasks with planned command-upgrade tasks"
    next_safe_action: "Start T001 when implementation begins"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-154-045-design-command-upgrade"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: design command upgrade

<!-- SPECKIT_LEVEL: 3 -->

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

- [ ] T001 Capture design command alias inventory with `rg`.
- [ ] T002 Capture `sk-design` parent router mode names and trigger phrases.
- [ ] T003 Compare command aliases against router mode boundaries.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Update command language for aliases that route ambiguously.
- [ ] T005 Document compatibility behavior for tightened or renamed aliases.
- [ ] T006 Update mode packet references only where command routing requires it.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Add or update routing replay fixtures for changed commands.
- [ ] T008 Run command replay and record the result.
- [ ] T009 Run strict validation for this packet and the parent.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All command changes have replay evidence.
- [ ] Compatibility behavior is documented.
- [ ] Parent validation passes after metadata regeneration.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor research**: See `../044-design-routing-and-integration-research/spec.md`
<!-- /ANCHOR:cross-refs -->
