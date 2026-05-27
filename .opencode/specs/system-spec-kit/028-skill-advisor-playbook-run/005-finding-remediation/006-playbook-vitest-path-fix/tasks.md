---
title: "Tasks: Playbook Vitest Path Fix (F5)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "F5 tasks vitest path"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/006-playbook-vitest-path-fix"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "scorer-remediation"
    recent_action: "Implemented and verified"
    next_safe_action: "None; phase complete and verified"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Playbook Vitest Path Fix (F5)

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Confirm canonical command runs 49 tests from system-skill-advisor/mcp_server
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P] Replace stale vitest command in 004-ambiguous-brief-rendering.md (~line 38)
- [x] T003 [P] Replace stale vitest command in 005-lifecycle-redirect-metadata.md (~line 36)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Run both corrected commands (49/49 pass)
- [x] T005 Re-grep playbook + feature_catalog → no `skill-advisor/tests/` matches
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Commands run; no residual stale paths
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Root cause**: See `../research/research.md` §3 F5
<!-- /ANCHOR:cross-refs -->
