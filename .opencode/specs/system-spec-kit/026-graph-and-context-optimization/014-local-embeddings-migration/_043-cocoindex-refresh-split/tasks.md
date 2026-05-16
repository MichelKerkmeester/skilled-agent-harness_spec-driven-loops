---
title: "Tasks: 042 CocoIndex Refresh/Search Split"
description: "Task ledger for the MCP refresh/search split behavior change."
trigger_phrases:
  - "042 tasks"
  - "cocoindex refresh split tasks"
importance_tier: "critical"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/_043-cocoindex-refresh-split"
    last_updated_at: "2026-05-14T16:45:00Z"
    last_updated_by: "codex"
    recent_action: "Completed refresh split task ledger"
    next_safe_action: "Review packet"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_refresh_split.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000042"
      session_id: "_043-cocoindex-refresh-split"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 042 CocoIndex Refresh/Search Split

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

- [x] T001 Scaffold 042 packet at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/_043-cocoindex-refresh-split/`.
- [x] T002 Read 041 instrumentation and current CocoIndex MCP files.
- [x] T003 Identify current MCP default and refresh call site in `server.py`.
- [x] T004 Confirm `client.py` has no separate `refresh_index` default to change.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Change FastMCP `search.refresh_index` default to `false`.
- [x] T006 Preserve explicit `search(refresh_index=true)` refresh-before-search.
- [x] T007 Add `RefreshIndexResultModel`.
- [x] T008 Register `cocoindex_refresh_index(paths?: list[str])`.
- [x] T009 Add pytest coverage in `tests/test_refresh_split.py`.
- [x] T010 Update tool reference, skill docs, README, feature catalog, search patterns, cross-CLI playbook, and readiness guidance.
- [x] T011 Author ADR-004 in `decision-record.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run Python compile check.
- [x] T013 Run editable install.
- [x] T014 Run requested observability and daemon pytest command.
- [x] T015 Run new refresh split pytest.
- [x] T016 Run strict packet validation.
- [x] T017 Fill implementation summary with source changes, test results, and migration steps.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Verification results recorded in `implementation-summary.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Record**: See `decision-record.md`
- **Verification**: See `checklist.md` and `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
