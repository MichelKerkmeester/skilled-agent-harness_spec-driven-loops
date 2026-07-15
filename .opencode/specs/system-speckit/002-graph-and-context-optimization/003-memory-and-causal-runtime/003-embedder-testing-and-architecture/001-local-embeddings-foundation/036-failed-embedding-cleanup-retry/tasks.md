---
title: "Tasks: 036 Failed Embedding Cleanup Retry"
description: "Task ledger for the failed-embedding cleanup retry packet."
trigger_phrases:
  - "036 tasks"
  - "failed embedding cleanup tasks"
importance_tier: "important"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/036-failed-embedding-cleanup-retry"
    last_updated_at: "2026-05-14T00:30:00Z"
    last_updated_by: "main-agent"
    recent_action: "Completed dry-run, live-run, final counts, and documentation updates"
    next_safe_action: "Emit final binding trace"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v2.2 -->
# Tasks: 036 Failed Embedding Cleanup Retry

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

**Task Format**: `T### [P?] Description (file path or command)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm 036 packet path does not already exist.
- [x] T002 Read 037 structure and relevant 038/039 metadata.
- [x] T003 Inspect `repair-failed-embeddings.mjs` selection and dry-run behavior.
- [x] T004 Create `description.json` and `graph-metadata.json`.
- [x] T005 Create Level-2 `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`.
- [x] T006 Capture baseline `memory_index` status counts.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Run dry-run repair command.
- [x] T011 Confirm dry-run does not mutate state by comparing status counts.
- [x] T012 Run live repair command.
- [x] T013 Retry live command with explicit CPU fallback only if Metal contention crashes the first live run. Not needed; first live run exited 0.
- [x] T014 Capture dry-run and live-run summary lines.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Query final `memory_index` status counts.
- [x] T021 Query final `vec_memories` count with sqlite-vec loaded.
- [x] T022 Update implementation summary with baseline, dry-run, live-run, and final-state evidence.
- [x] T023 Update checklist evidence.
- [x] T024 Run strict validation for the 036 packet.
- [x] T025 Emit required binding trace in final response.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Dry-run completed or blocker documented.
- [x] Live run completed or blocker documented.
- [x] Final DB counts documented.
- [x] Checklist items are marked with evidence.
- [x] Strict validation result captured.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Implementation Summary**: `implementation-summary.md`
- **Parent**: `../spec.md`
- **Repair script**: `.opencode/skills/system-spec-kit/mcp_server/scripts/repair-failed-embeddings.mjs`
<!-- /ANCHOR:cross-refs -->
