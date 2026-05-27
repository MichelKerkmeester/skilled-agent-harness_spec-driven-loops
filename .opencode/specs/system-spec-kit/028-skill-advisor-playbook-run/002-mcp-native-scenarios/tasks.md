---
title: "Tasks: MCP-Native Scenarios (Playbook Run Phase 002)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "playbook mcp native tasks"
  - "028 phase 002 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run/002-mcp-native-scenarios"
    last_updated_at: "2026-05-26T20:00:00Z"
    last_updated_by: "playbook-run-operator"
    recent_action: "NC scenario tasks complete"
    next_safe_action: "Phase 003"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: MCP-Native Scenarios (Playbook Run Phase 002)

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

- [x] T001 Confirm advisor MCP tools reachable
- [x] T002 [P] Read NC-001..009 scenario files for exact payloads + expected signals
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 NC-001 advisor_recommend happy path
- [x] T004 NC-002 advisor_status live check
- [x] T005 NC-003 advisor_validate slice bundle (heavy run)
- [x] T006 NC-004 advisor_recommend ambiguous (topK 2)
- [x] T007 NC-005 lifecycle vitest + recommend
- [x] T008 NC-006 advisor_rebuild skip-when-live + force
- [x] T009 NC-007/008/009 skill_graph_status/query/validate
- [x] T010 NC-004/005 vitest from correct directory (49/49 pass)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Compare each envelope to expected signals
- [x] T012 Quantify accuracy regression (NC-003)
- [x] T013 Record verdicts (7 PASS, 2 PARTIAL)
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
