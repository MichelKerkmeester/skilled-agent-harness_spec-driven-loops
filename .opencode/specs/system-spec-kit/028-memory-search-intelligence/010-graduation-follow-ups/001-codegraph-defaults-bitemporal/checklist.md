---
title: "Verification Checklist: Code-Graph Degree-Cap Default and Bitemporal Reindex Wiring"
description: "Verification evidence for the degree-cap default and the bitemporal reindex wiring, each behind its existing flag."
trigger_phrases:
  - "degree cap checklist"
  - "bitemporal checklist"
  - "reindex checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/010-graduation-follow-ups/001-codegraph-defaults-bitemporal"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Verified all P0 and P1 items with evidence"
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
# Verification Checklist: Code-Graph Degree-Cap Default and Bitemporal Reindex Wiring

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: spec.md sections 2 through 4 capture both gaps and the five P0 requirements
- [x] CHK-002 [P0] Reindex edge-replacement path located
  - **Evidence**: `replaceEdges` in code-graph-db.ts, called from `persistIndexedFileResult` in ensure-ready.ts
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Type-check passes
  - **Evidence**: `npx tsc --noEmit --composite false -p .opencode/skills/system-code-graph/tsconfig.json` exits 0
- [x] CHK-011 [P0] Degree-cap default chosen on benchmark evidence
  - **Evidence**: `DEFAULT_REVERSE_DEP_DEGREE_CAP = 15` in structural-indexer.ts, set from the degree-sweep benchmark whose results are recorded in `benchmark/degree-cap-sweep-results.json`, comment cites the sweep and the hot-hub cost
- [x] CHK-012 [P1] Off-path statements kept verbatim
  - **Evidence**: The else branches in `replaceNodes`, `replaceEdges`, `pruneDanglingEdges`, the live readers, the lineage writer, the ensure-ready bump, and the query asOf path hold the original statements unchanged
- [x] CHK-013 [P1] No artifact ids or spec paths in code comments
  - **Evidence**: New comments carry durable WHY only, no packet or spec ids
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Real-scan integration and as-of consumer tests authored and passing
  - **Evidence**: `code-edge-bitemporal-reindex.vitest.ts` drives the scan handler twice and `code-edge-bitemporal-followups.vitest.ts` drives the ensure-ready path and `code_graph_query asOf`, all asserting the old target at the pre-reindex generation and the new target live
- [x] CHK-021 [P0] Live-reader filter, close-not-delete, and lineage validity covered
  - **Evidence**: `code-edge-bitemporal-readers.vitest.ts` covers the readers and the close-not-delete in `replaceNodes` and `pruneDanglingEdges`, the followups file covers the lineage valid_at
- [x] CHK-022 [P0] Byte-identity tests authored for every change
  - **Evidence**: Off-path tests confirm the delete-and-insert, the NULL lineage validity, the untouched generation on the ensure-ready path, and the asOf-with-flag-off matching the default query, plus flag-unset versus flag-false
- [x] CHK-023 [P0] tsc and the changed-code tests pass
  - **Evidence**: `tsc` exits 0, the four new test files type-check standalone, the four bitemporal and degree-cap files pass 19 of 19, and the nine code-graph files that exercise the changed code pass 90 of 90
- [x] CHK-024 [P1] Full-suite failures shown to be environmental
  - **Evidence**: A full run leaves only four `code-index-cli-*` daemon tests (failing under the live session daemon lease, passing on a clean checkout) and one `ipc-socket-drift` guard (failing on the clean checkout too), none of which import the changed code
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-025 [P0] All four follow-up items closed
  - **Evidence**: The ensure-ready path bumps under the flag, lineage edges carry a valid_at, `code_graph_query asOf` exposes the as-of read, and the degree cap is set from the benchmark
- [x] CHK-026 [P0] Each finding confirmed against real code before fixing
  - **Evidence**: The ensure-ready persist loop genuinely never bumped, `recordSupersedesLineage` genuinely wrote NULL validity, and `asOfEdgesFrom` genuinely had no caller, all verified before touching anything
- [x] CHK-027 [P1] As-of read consumer wired and symmetric
  - **Evidence**: `code_graph_query asOf` routes the relationship reads, `asOfEdgesTo` added as the inbound mirror, the dangling exclusion skipped for as-of so a deleted-target edge still surfaces
- [x] CHK-028 [P1] Degree cap set on evidence with the cost recorded
  - **Evidence**: The benchmark shows linear cheap cost with no knee, 15 chosen to maximize correctness in range while bounding the extreme tail, the trivial-fixture caveat recorded
- [x] CHK-029 [P1] Default-off invariant preserved across all sites
  - **Evidence**: Byte-identity tests confirm no live behavior change while either flag is off across all changed sites
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No new secrets or external surfaces
  - **Evidence**: Every change is internal to the code-graph indexer and its query handler
- [x] CHK-031 [P1] No default-on behavior change
  - **Evidence**: Both flags stay off by default, proven by the byte-identity tests, and a query without asOf is unchanged
- [x] CHK-032 [P1] Scope respected
  - **Evidence**: Only `.opencode/skills/system-code-graph/**` and the 010/001 phase folder were touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, and tasks synchronized
  - **Evidence**: All reflect the four follow-up items, the benchmark, the same file list, and the same test set
- [x] CHK-041 [P1] Code comments adequate
  - **Evidence**: The generation helper, each close-not-delete branch, the live-reader filter, the lineage stamp, the ensure-ready bump, the as-of query routing, and the degree-cap default each carry a WHY comment
- [x] CHK-042 [P2] Description and graph metadata generated
  - **Evidence**: description.json and graph-metadata.json generated by the spec-kit generators
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files left outside scratch
  - **Evidence**: All work landed in the source files, the new test files, and the phase folder
- [x] CHK-051 [P1] Phase folder complete
  - **Evidence**: spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, graph-metadata.json all present
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-24
**Verified By**: AI Assistant (Claude)
<!-- /ANCHOR:summary -->
