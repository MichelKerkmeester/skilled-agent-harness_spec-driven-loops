---
title: "Tasks: Preconditions and Build (Playbook Run Phase 001)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "playbook preconditions tasks"
  - "028 phase 001 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/001-preconditions-and-build"
    last_updated_at: "2026-05-26T20:00:00Z"
    last_updated_by: "playbook-run-operator"
    recent_action: "All precondition tasks complete"
    next_safe_action: "Phase 002"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Preconditions and Build (Playbook Run Phase 001)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Confirm build scripts in both mcp_server package.json
- [x] T002 Create evidence workspaces under /tmp
- [x] T003 [P] Confirm SPECKIT_SKILL_ADVISOR_HOOK_DISABLED unset
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Build system-spec-kit mcp_server (dist/api/index.js emitted)
- [x] T005 Build system-skill-advisor mcp_server (exit 0)
- [x] T006 Verify advisor devin hook dist artifact present
- [x] T007 Probe devin auth + opencode providers
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 advisor_status returns live (generation 4463, 23 skills)
- [x] T009 Confirm next free spec slot is 028
- [x] T010 Record precondition evidence
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
