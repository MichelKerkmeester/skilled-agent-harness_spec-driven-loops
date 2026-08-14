---
title: "Tasks: 002 Advisor Surface Audit"
description: "Task breakdown for 002 Advisor Surface Audit."
trigger_phrases:
  - "advisor-018-002"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/018-advisor-audit-and-state-containment/002-advisor-surface-audit"
    last_updated_at: "2026-07-27T17:50:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored from research"
    next_safe_action: "Re-verify each finding against HEAD"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "advisor-018-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 002 Advisor Surface Audit

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

- [ ] T001 Re-verify F1 handler aliases, distinguishing them from the MCP tool ids
- [ ] T002 Re-verify F2 unused Codex timeout variable
- [ ] T003 Re-verify F3 orphaned search-quality harness copy
- [ ] T004 Re-verify F4 committed test telemetry
- [ ] T005 Re-verify F5 invisible scorer test and decide wire-or-remove
- [ ] T006 Re-verify F6 misplaced and broken code-graph benchmarks
- [ ] T007 Re-verify F7 test contract versus Vitest discovery
- [ ] T008 Re-verify F8 dual-sourced compatibility contract; name the canonical side
- [ ] T009 Re-verify F9 duplicated tool descriptors; name the canonical registry
- [ ] T010 Propose a systemic guard for tests outside the include glob
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] Execute the approved dispositions one at a time
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] Re-run every evidence command and record the result
- [ ] `validate.sh --strict` exits 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
