---
title: "Tasks: nested MCP README sync"
description: "Task list for syncing three nested mcp_server READMEs with their real tool sets."
trigger_phrases:
  - "nested mcp readme sync tasks"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/005-nested-mcp-readme-sync"
    last_updated_at: "2026-06-07T18:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All nested-README sync tasks complete"
    next_safe_action: "Return to packet 135 phase 024 (skills index README)"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/tools/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "nested-readme-sync-136"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: nested MCP README sync

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

- [x] T001 Confirm the live tool and handler names from source
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add `skill_graph_propagate_enhances` to `system-skill-advisor/mcp_server/tools/README.md`
- [x] T003 Add the `skill-graph/` subhandlers to `system-skill-advisor/mcp_server/handlers/README.md`
- [x] T004 Add `code_graph_classify_query_intent` to `system-code-graph/mcp_server/handlers/README.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 `validate_document.py --type readme` passes (0 issues) on all three
- [x] T006 HVR scan of the added prose clean
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All three READMEs validated
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
