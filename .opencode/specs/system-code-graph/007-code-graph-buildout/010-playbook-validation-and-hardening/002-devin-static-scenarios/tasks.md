---
title: "Tasks: Devin Static Scenarios (Code Graph Playbook 002)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "devin static scenarios tasks"
  - "code graph post-rename infra tasks"
  - "029 phase 002 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/010-playbook-validation-and-hardening/002-devin-static-scenarios"
    last_updated_at: "2026-05-26T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 002 task list"
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
# Tasks: Devin Static Scenarios (Code Graph Playbook 002)

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

- [ ] T001 devin self-invocation guard + `devin auth status` pre-flight
- [ ] T002 Ensure `devin mcp add sequential_thinking` registered (2-layer pattern layer 1)
- [ ] T003 Author RCAF prompt-file + agent-config recipe (scratch/), CLEAR-checked
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Dispatch 016-021 batch (manifest + launcher + mcp.json + db path + build + unicode) → capture
- [ ] T005 Dispatch 025 (Devin SessionStart hook) → capture
- [ ] T006 SIGKILL each cli-devin dispatch before launching the next
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Parse output into evidence.md verdict table (7 rows)
- [ ] T008 Confirm no source files modified (git status clean)
- [ ] T009 Cross-reference verdicts to feature_catalog; flag any FAIL/SKIP
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] 7/7 verdicts recorded with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
