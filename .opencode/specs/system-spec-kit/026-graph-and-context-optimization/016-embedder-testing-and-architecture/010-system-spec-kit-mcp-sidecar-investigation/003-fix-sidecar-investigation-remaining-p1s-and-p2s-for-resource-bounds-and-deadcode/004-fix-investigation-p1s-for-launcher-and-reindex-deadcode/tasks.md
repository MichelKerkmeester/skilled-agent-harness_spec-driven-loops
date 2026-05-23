---
title: "Tasks: Launcher and Reindex P1 Finding Closure"
description: "Task list for F15, F49, and F105 closure in arc 010/003/004."
trigger_phrases:
  - "arc 010 003 004 tasks"
  - "F15 F49 F105 tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/003-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/004-fix-investigation-p1s-for-launcher-and-reindex-deadcode"
    last_updated_at: "2026-05-23T07:05:00Z"
    last_updated_by: "codex"
    recent_action: "All packet tasks completed"
    next_safe_action: "Commit handoff"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0100030040100030040100030040100030040100030040100030040100030040"
      session_id: "010-003-004-launcher-reindex-p1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Launcher and Reindex P1 Finding Closure

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

- [x] T001 Scaffold Level 2 spec folder with canonical anchors.
- [x] T002 Read sibling 010/003/001 packet docs.
- [x] T003 Read F13 atomic-write precedent in 010/002/001.
- [x] T004 Read F15, F49, and F105 finding evidence.
- [x] T005 Read source and sibling tests before editing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Implement F15 atomic owner-token publication in `.opencode/bin/lib/ensure-rerank-sidecar.cjs`.
- [x] T007 Implement F49 env allowlist in `.opencode/bin/lib/ensure-rerank-sidecar.cjs`.
- [x] T008 Delete F105 cancellation polling helper and branches in `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`.
- [x] T009 Add F15 fixture tests in `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts`.
- [x] T010 Add F49 fixture test in `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run launcher vitest.
- [x] T012 Run `mcp_server/tests/embedders/` vitest.
- [x] T013 Run `mcp_server/tests/embedder-reindex.vitest.ts`.
- [x] T014 Run MCP server typecheck.
- [x] T015 Run strict spec validation.
- [x] T016 Fill checklist, decision record, and implementation summary.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Verification passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Checklist**: See `checklist.md`.
- **Decisions**: See `decision-record.md`.
<!-- /ANCHOR:cross-refs -->
