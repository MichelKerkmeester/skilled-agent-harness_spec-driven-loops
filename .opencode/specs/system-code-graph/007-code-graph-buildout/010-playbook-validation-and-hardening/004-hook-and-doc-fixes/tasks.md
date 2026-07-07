---
title: "Tasks: Hook + Doc-Sync Fixes (029 Phase 004)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "devin hook fix tasks"
  - "playbook doc sync tasks"
  - "029 phase 004 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/010-playbook-validation-and-hardening/004-hook-and-doc-fixes"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 004 tasks"
    next_safe_action: "Execute T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-code-graph-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Hook + Doc-Sync Fixes (029 Phase 004)

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

- [ ] T001 Snapshot `.devin/hooks.v1.json` (git baseline)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Fix SessionStart command path in `.devin/hooks.v1.json` (F-025-1)
- [ ] T003 [P] 020 doc: 11→8 tools (F-020-1)
- [ ] T004 [P] 011 doc: replace stale verify-`rating` sub-check (F-011-1)
- [ ] T005 [P] 021 doc + index: reconcile label vs content (F-021-1)
- [ ] T006 [P] 009/010 docs: update cited line ranges
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 jq-validate hooks.v1.json + `test -f` registered path + invoke startup payload
- [ ] T008 `rg` confirms no stale references (`system-code-graph/dist/system-spec-kit`, `11 tools`) remain
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks `[x]`
- [ ] No `[B]` blocked
- [ ] Hook fires; docs reconciled
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
