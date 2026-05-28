---
title: "Tasks: Populate the empty code graph via an initial code_graph_scan"
description: "Operational task tracker: reconnect mk_code_index, run a full code_graph_scan, verify readiness."
trigger_phrases:
  - "code graph initial scan tasks"
  - "code_graph_scan populate tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/002-code-graph-initial-scan"
    last_updated_at: "2026-05-28T17:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-2 tasks; scan blocked on mk_code_index reconnect"
    next_safe_action: "Reconnect mk_code_index, then run code_graph_scan (T003) + verify (T004)"
    blockers: ["mk_code_index disconnected; T003/T004 blocked until reconnect"]
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000297"
      session_id: "029-002-tasks"
      parent_session_id: null
    completion_pct: 40
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Populate the empty code graph via an initial code_graph_scan

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Confirm Phase 1 socket-dir fix shipped + dist rebuilt (prerequisite)
- [ ] T002 [B] User reconnects mk_code_index via `/mcp`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [B] Run `code_graph_scan` (full) to populate the empty graph
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T004 [B] Verify `code_graph_status` reports nodes > 0 / non-empty freshness
- [ ] T005 [B] Update implementation-summary with final node/edge counts
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] code_graph_scan completed
- [ ] code_graph_status reports a non-empty, ready graph
- [ ] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: ../001-ipc-socket-dir-canonicalize (socket-dir fix)
<!-- /ANCHOR:cross-refs -->
