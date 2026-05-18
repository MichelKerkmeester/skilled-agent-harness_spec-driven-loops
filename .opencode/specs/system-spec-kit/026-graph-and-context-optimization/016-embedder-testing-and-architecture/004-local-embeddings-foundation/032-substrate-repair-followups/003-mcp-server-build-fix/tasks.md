---
title: "Tasks: MCP server build fix"
description: "Task list for repairing the MCP SDK dependency declaration and verifying the build."
trigger_phrases:
  - "mcp_server build tasks"
  - "sdk dependency task list"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/032-substrate-repair-followups/003-mcp-server-build-fix"
    last_updated_at: "2026-05-14T11:12:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Recorded completed dependency repair tasks"
    next_safe_action: "Use implementation-summary.md for handoff"
    blockers: []
    key_files:
      - "plan.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000302"
      session_id: "003-mcp-server-build-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: MCP server build fix

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

- [x] T001 Read packet spec before investigation.
- [x] T002 Run current failing-build reproducer command.
- [x] T003 [P] Inventory MCP SDK import sites.
- [x] T004 [P] Inspect package manifests, node_modules state, and ADR-002 topology context.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Choose Path A because `system-code-graph` imports the SDK without declaring it.
- [x] T006 Add `@modelcontextprotocol/sdk` to `.opencode/skills/system-code-graph/package.json`.
- [x] T007 Add matching lockfile metadata to `.opencode/skills/system-code-graph/package-lock.json`.
- [x] T008 Refresh watched runtime dist JS from compiler output.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 `npm run build` exits 0 in `.opencode/skills/system-spec-kit/mcp_server`.
- [x] T010 SDK `Cannot find module` errors absent.
- [x] T011 Dist files show fresh mtimes.
- [x] T012 Fix-1 retry/save-classifier markers present in dist.
- [x] T013 Document one stale out-of-scope Vitest failure from the topology pivot.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Build verification passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Checklist**: See `checklist.md`.
- **Summary**: See `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
