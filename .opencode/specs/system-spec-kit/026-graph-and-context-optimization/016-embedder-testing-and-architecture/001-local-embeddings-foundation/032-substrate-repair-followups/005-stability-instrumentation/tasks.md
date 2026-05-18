---
title: "Tasks: 005 substrate-stability-instrumentation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "substrate stability instrumentation tasks"
  - "memory health rss tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/005-stability-instrumentation"
    last_updated_at: "2026-05-14T11:25:36Z"
    last_updated_by: "cli-codex"
    recent_action: "Tracked implementation tasks"
    next_safe_action: "Run live memory_health after daemon respawn"
    blockers:
      - "Live daemon restart not available in sandbox"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:6666666666666666666666666666666666666666666666666666666666666666"
      session_id: "cli-codex-005-stability-instrumentation"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Tasks: 005 substrate-stability-instrumentation

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

- [x] T001 Read packet spec (`spec.md`).
- [x] T002 Read memory health handler (`memory-crud-health.ts`).
- [x] T003 [P] Read retry manager circuit code (`retry-manager.ts`).
- [x] T004 [P] Read context server startup code (`context-server.ts`).
- [x] T005 [P] Read dist mirrors before editing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Add startup RSS log after `server.connect` in source context server.
- [x] T007 Mirror startup RSS log to dist context server.
- [x] T008 Add circuit transition ring buffer and flap accessor in source retry manager.
- [x] T009 Mirror circuit flap instrumentation to dist retry manager.
- [x] T010 Add `process` and flap fields to source memory health responses.
- [x] T011 Mirror memory health fields to dist handler.
- [x] T012 Create threshold-focused `resource-map.md`.
- [x] T013 Update packet status metadata to complete.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run grep verification for startup log and response fields.
- [x] T015 Run MCP server TypeScript typecheck.
- [x] T016 Run packet strict spec validation.
- [x] T017 Document deferred live MCP verification path.
- [x] T018 Include sample `memory_health` output in implementation summary.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining; live daemon respawn is documented as external verification.
- [x] Static and typecheck verification passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Checklist**: See `checklist.md`.
- **Summary**: See `implementation-summary.md`.
- **Threshold Map**: See `resource-map.md`.
<!-- /ANCHOR:cross-refs -->
