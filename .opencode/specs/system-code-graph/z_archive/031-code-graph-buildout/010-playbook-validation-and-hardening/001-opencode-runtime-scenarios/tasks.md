---
title: "Tasks: OpenCode Runtime Scenarios (Code Graph Playbook 001)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "opencode runtime scenarios tasks"
  - "code graph live mcp tasks"
  - "029 phase 001 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/010-playbook-validation-and-hardening/001-opencode-runtime-scenarios"
    last_updated_at: "2026-05-26T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 001 task list"
    next_safe_action: "Execute T001 setup tasks"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-26-code-graph-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: OpenCode Runtime Scenarios (Code Graph Playbook 001)

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

- [ ] T001 Run opencode self-invocation guard + DeepSeek provider pre-flight
- [ ] T002 Render group-batch dispatch prompts (scratch/dispatch-*.md), CLEAR-checked
- [ ] T003 [P] Snapshot live graph DB mtime for mutation-check baseline
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Dispatch group 01-02 batch (001,002,003,004,005,006) → capture JSON
- [ ] T005 Dispatch group 03-04 batch (007,024,008) → capture JSON
- [ ] T006 Dispatch group 05 batch (009,010 coverage graph) → capture JSON
- [ ] T007 Dispatch group 06 batch (011,022) → capture JSON
- [ ] T008 Dispatch group 08 batch (015,023 doctor) → capture JSON
- [ ] T009 SIGKILL each dispatch before launching next (single-dispatch discipline)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Parse JSON evidence into evidence.md verdict table (15 rows)
- [ ] T011 Confirm live DB mtime unchanged (disposable-workspace proof)
- [ ] T012 Cross-reference verdicts to feature_catalog; flag any FAIL/SKIP
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] 15/15 verdicts recorded with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
