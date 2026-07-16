---
title: "Tasks: Byte-Aware Health Telemetry"
description: "Task checklist for Rec 7 byte-aware context-server memory diagnostics."
trigger_phrases:
  - "byte-aware telemetry tasks"
  - "heap profiler tasks"
  - "memory diagnostics checklist"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/008-byte-aware-health-telemetry"
    last_updated_at: "2026-05-18T21:10:00Z"
    last_updated_by: "codex"
    recent_action: "Completed implementation tasks"
    next_safe_action: "Commit scoped files"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tests/heap-profiler.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0160020082222222222222222222222222222222222222222222222222222222"
      session_id: "phase-016-002-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Byte-Aware Health Telemetry

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Read deep-research-005 iteration 008 for design assumptions.
- [x] T002 Read `memory-crud-health.ts`, `tool-cache.ts`, `trigger-matcher.ts`, and `mk-spec-memory-launcher.cjs`.
- [x] T003 [P] Read ENV and embedder architecture docs before documentation edits.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create `heap-profiler.ts` with detailed snapshot, opt-in snapshot writing, and cache estimates.
- [x] T005 Add tool cache byte estimate helper.
- [x] T006 Add trigger matcher regex byte estimate helper.
- [x] T007 Extend `memory_health` args, schema, and full-report payload.
- [x] T008 Wire `SPECKIT_CONTEXT_SERVER_MAX_OLD_SPACE_MB` in launcher.
- [x] T009 Add focused Vitest coverage.
- [x] T010 Update operator docs for diagnostics and env vars.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run strict spec validation.
- [x] T012 Run MCP server typecheck.
- [x] T013 Run targeted `heap-profiler` Vitest.
- [x] T014 Run MCP server build.
- [x] T015 Run live import probe for seven memory fields.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Verification evidence recorded in `implementation-summary.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research Source**: `../005-context-server-memory-reduction-research/research/iterations/iteration-008.md`
<!-- /ANCHOR:cross-refs -->
