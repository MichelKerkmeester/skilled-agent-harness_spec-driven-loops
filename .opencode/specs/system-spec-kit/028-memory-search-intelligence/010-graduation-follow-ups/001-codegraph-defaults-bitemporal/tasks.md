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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/010-graduation-follow-ups/001-codegraph-defaults-bitemporal"
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

- [x] T001 Change `DEFAULT_REVERSE_DEP_DEGREE_CAP` from 0 to 10 (`mcp_server/lib/structural-indexer.ts`) [5m]
- [x] T002 Update the cap comment block so it no longer calls 0 the default (`mcp_server/lib/structural-indexer.ts`) [5m]
- [x] T003 Update the `getReverseDepDegreeCap` comment so the byte-identity claim points at a cap of 0, not the default (`mcp_server/lib/structural-indexer.ts`) [5m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Read the bitemporal flag once at the top of `replaceEdges` (`mcp_server/lib/code-graph-db.ts`) [10m]
- [x] T005 Branch the source delete to `closeEdgesForSources` when the flag is on (`mcp_server/lib/code-graph-db.ts`) [15m]
- [x] T006 Branch the per-edge insert to `insertEdgeWithValidity` when the flag is on (`mcp_server/lib/code-graph-db.ts`) [15m]
- [x] T007 Branch the dangling prune to a close-only UPDATE when the flag is on (`mcp_server/lib/code-graph-db.ts`) [15m]
- [x] T008 Keep every off-path statement verbatim so the off-path stays byte-identical (`mcp_server/lib/code-graph-db.ts`) [5m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Write the as-of round-trip integration test: close at N, reindex at N+1, assert old target at N and new target current (`mcp_server/tests/code-edge-bitemporal-reindex.vitest.ts`) [30m]
- [x] T010 Add a live-read assertion that the post-reindex read returns only the open edge (`mcp_server/tests/code-edge-bitemporal-reindex.vitest.ts`) [10m]
- [x] T011 Write the bitemporal off-path byte-identity test: delete and re-insert, validity columns null (`mcp_server/tests/code-edge-bitemporal-reindex.vitest.ts`) [15m]
- [x] T012 Write the flag-unset-versus-false byte-identity test for `replaceEdges` (`mcp_server/tests/code-edge-bitemporal-reindex.vitest.ts`) [10m]
- [x] T013 Write the degree-cap off-path byte-identity tests: stale edge stays, outcome invariant to the cap env value (`mcp_server/tests/reverse-dep-degree-cap-default.vitest.ts`) [20m]
- [x] T014 Confirm `npx tsc --noEmit --composite false -p .opencode/skills/system-code-graph/tsconfig.json` exits 0 [5m]
- [x] T015 Confirm the two new test files type-check against the vitest and node types [5m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Integration test authored
- [x] Byte-identity tests authored for both changes
- [x] `tsc` exits 0
- [x] Checklist.md fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
