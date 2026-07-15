---
title: "Tasks: Code-Graph Degree-Cap Default and Bitemporal Reindex Wiring"
description: "Task breakdown for the degree-cap default and the bitemporal reindex wiring with explicit verification tasks."
trigger_phrases:
  - "degree cap tasks"
  - "bitemporal tasks"
  - "reindex tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/028-code-graph-defaults-bitemporal"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Marked all implementation and verification tasks complete"
    next_safe_action: "Run the full vitest suite on the CLI executor"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-028-010-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Code-Graph Degree-Cap Default and Bitemporal Reindex Wiring

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

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Write the degree-sweep benchmark over importer counts five through twenty-five at caps five through twenty-five (`benchmark/degree-cap-sweep.mjs`) [25m]
- [x] T002 Run the benchmark, record the results, and read the cost-versus-staleness trade (`benchmark/degree-cap-sweep-results.json`) [15m]
- [x] T003 Set `DEFAULT_REVERSE_DEP_DEGREE_CAP` to 15 on the evidence and update the comment to cite the sweep and the hot-hub cost (`mcp_server/lib/structural-indexer.ts`) [10m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `getNextCodeGraphGeneration` and stamp loop-time writes at the next generation (`mcp_server/lib/code-graph-db.ts`) [10m]
- [x] T005 Close edges in `replaceNodes`, `replaceEdges`, and `pruneDanglingEdges` under the flag instead of deleting (`mcp_server/lib/code-graph-db.ts`) [25m]
- [x] T006 Filter closed edges from `queryEdgesFrom` and `queryEdgesTo` under the flag (`mcp_server/lib/code-graph-db.ts`) [10m]
- [x] T007 Bump the generation after the ensure-ready persist loop under the flag (`mcp_server/lib/ensure-ready.ts`) [15m]
- [x] T008 Stamp SUPERSEDES lineage edges with a valid_at under the flag (`mcp_server/lib/code-graph-db.ts`) [15m]
- [x] T009 Add `asOfEdgesTo` and the `code_graph_query asOf` parameter, skip the dangling exclusion for as-of, document the schema (`mcp_server/lib/code-graph-db.ts`, `mcp_server/handlers/query.ts`, `mcp_server/tool-schemas.ts`) [30m]
- [x] T010 Keep every off-path statement verbatim so the off-path stays byte-identical (`mcp_server/lib/code-graph-db.ts`, `mcp_server/lib/ensure-ready.ts`, `mcp_server/handlers/query.ts`) [10m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Write the real-scan as-of round trip and the live-read assertion (`mcp_server/tests/code-edge-bitemporal-reindex.vitest.ts`) [30m]
- [x] T012 Write the live-reader filter and close-not-delete unit tests with off-path byte identity (`mcp_server/tests/code-edge-bitemporal-readers.vitest.ts`) [25m]
- [x] T013 Write the ensure-ready bump, lineage validity, and `code_graph_query asOf` tests with off-path byte identity (`mcp_server/tests/code-edge-bitemporal-followups.vitest.ts`) [35m]
- [x] T014 Write the degree-cap off-path byte-identity tests (`mcp_server/tests/reverse-dep-degree-cap-default.vitest.ts`) [20m]
- [x] T015 Update the mocked ensure-ready test to export the new flag and bump mocks (`mcp_server/tests/ensure-ready.vitest.ts`) [10m]
- [x] T016 Confirm `tsc` exits 0, the four new test files type-check, and the code-graph tests that exercise the changed code pass (`mcp_server/tests`) [15m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Real-scan integration and as-of consumer tests authored and passing
- [x] Byte-identity tests authored for every change
- [x] Degree cap set from the recorded benchmark
- [x] `tsc` exits 0 and the changed-code tests pass
- [x] Checklist.md fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
