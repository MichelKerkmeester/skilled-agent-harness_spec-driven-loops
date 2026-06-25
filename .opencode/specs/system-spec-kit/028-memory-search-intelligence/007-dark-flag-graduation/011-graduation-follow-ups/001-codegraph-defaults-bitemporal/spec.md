---
title: "Feature Specification: Code-Graph Degree-Cap Default and Bitemporal Reindex Wiring"
description: "The staleness-repair degree cap defaults to uncapped and the bitemporal edge writer is unwired. This sets a production ceiling and wires the writer into the reindex path, each behind its existing flag."
trigger_phrases:
  - "degree cap"
  - "bitemporal"
  - "code graph"
  - "reindex"
  - "reverse dep force parse"
  - "edge replacement"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/011-graduation-follow-ups/001-codegraph-defaults-bitemporal"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Raised the degree-cap default to 15 and wired the as-of query surface, flag-gated"
    next_safe_action: "Graduation decision for the bitemporal and degree-cap flags"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-028-010-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Should the degree cap also apply when force-parse is off"
      - "Should the validity columns gain covering indexes before a large-scale as-of read"
---
# Feature Specification: Code-Graph Degree-Cap Default and Bitemporal Reindex Wiring

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-24 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 009 dark-flag validation found two production-readiness gaps in the system-code-graph subsystem, both behind existing default-off flags. The staleness-repair force-parse degree cap defaults to 0, which means uncapped, so a rename of a hot high-importer dependency pulls its whole importer fan-in back into the parse batch with no ceiling. The bitemporal edge writer is built but unwired, so the reindex path always deletes and re-inserts and an as-of query cannot answer about a past generation. A subsequent opus deep review (011) found the first bitemporal wiring attempt was defeated on the real reindex path: the live readers had no validity filter, and the upstream node-replacement and dangling-prune paths hard-deleted edges before the close could record them. A follow-up review then found four residual gaps: the ensure-ready auto-index path never bumped the generation so a superseded edge collapsed to a zero-width window, the SUPERSEDES lineage edges were written with a NULL valid_at so an as-of read dropped them, the as-of reader still had no production caller so the preserved history was not consumable, and the degree-cap default was an unbenchmarked guess.

### Purpose
Set the degree cap on benchmark evidence and wire the bitemporal writer correctly through the whole real reindex path including the ensure-ready auto-index path and the lineage writer, each behind its existing flag so the default-off behavior stays byte-identical. Expose a minimal as-of read parameter on `code_graph_query` so the preserved history is consumable, and choose the degree-cap default from a degree-sweep cost benchmark.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Set `DEFAULT_REVERSE_DEP_DEGREE_CAP` to 15 from a degree-sweep cost benchmark
- Wire the bitemporal writer through the whole real reindex path under the flag: `replaceNodes`, `replaceEdges`, and `pruneDanglingEdges` close instead of delete
- Filter closed edges out of the live readers `queryEdgesFrom` and `queryEdgesTo` under the flag
- Stamp loop-time writes at the next generation, and bump the generation on the ensure-ready auto-index path under the flag
- Stamp SUPERSEDES lineage edges with a valid_at under the flag so an as-of read surfaces them
- Add an optional `asOf` generation parameter to `code_graph_query` that routes the relationship reads through the as-of readers
- Real-scan integration tests, byte-identity tests for the off path, and a degree-sweep benchmark script

### Out of Scope
- Flipping any flag default to on - the work stays default-off
- Covering indexes on the validity columns - deferred and gated off
- An as-of parameter on `code_graph_context` - the smaller `code_graph_query` surface is sufficient, the context multi-hop traversal stays live-only
- Any file outside `.opencode/skills/system-code-graph/**` and the 010/001 phase folder - scope lock

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts | Modify | Degree-cap default set to 15 from the benchmark, comment records the sweep and the hot-hub cost |
| .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts | Modify | Close-not-delete in replaceNodes, replaceEdges, and pruneDanglingEdges, live-reader validity filter, next-generation stamping, lineage-edge valid_at, asOfEdgesTo, all flag-gated |
| .opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts | Modify | Bump the generation after the auto-index persist loop under the flag |
| .opencode/skills/system-code-graph/mcp_server/handlers/query.ts | Modify | Optional asOf parameter routing relationship reads through the as-of readers, dangling exclusion skipped for as-of |
| .opencode/skills/system-code-graph/mcp_server/tool-schemas.ts | Modify | Document the asOf parameter on code_graph_query |
| .opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-reindex.vitest.ts | Create | Real-scan integration round trip and off-path byte-identity tests |
| .opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts | Create | Live-reader filter and close-not-delete unit tests with off-path byte identity |
| .opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-followups.vitest.ts | Create | Ensure-ready bump, lineage validity, and code_graph_query asOf tests with off-path byte identity |
| .opencode/skills/system-code-graph/mcp_server/tests/reverse-dep-degree-cap-default.vitest.ts | Create | Byte-identity tests for the degree-cap default while force-parse is off |
| .opencode/specs/.../001-codegraph-defaults-bitemporal/benchmark/degree-cap-sweep.mjs | Create | The degree-sweep cost benchmark and its recorded results |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Degree cap chosen on benchmark evidence | `DEFAULT_REVERSE_DEP_DEGREE_CAP` is 15, set from the degree-sweep benchmark, read only inside the force-parse branch |
| REQ-002 | Degree-cap change is byte-identical when force-parse is off | A scan with the force-parse flag off produces identical edge state regardless of the degree-cap env value |
| REQ-003 | Live readers filter closed edges under the flag | `queryEdgesFrom` and `queryEdgesTo` add `AND invalid_at IS NULL` only when the flag is on, so a live read after a reindex returns only the open edge |
| REQ-004 | Every reindex-path edge remover closes under the flag | `replaceNodes`, `replaceEdges`, and `pruneDanglingEdges` close edges with `invalid_at` instead of deleting them when the flag is on |
| REQ-005 | Superseded edges land in a readable window | Loop-time writes stamp at the next generation so an as-of query at the genuine pre-reindex generation returns the old target and the close lands strictly after the valid_at |
| REQ-006 | The ensure-ready path bumps the generation under the flag | Two consecutive ensure-ready reindexes write at distinct generations, so a superseded edge gets a non-empty as-of window |
| REQ-007 | SUPERSEDES lineage edges are as-of readable under the flag | A lineage edge carries a valid_at so an as-of read surfaces it instead of dropping it for a NULL valid_at |
| REQ-008 | The as-of read is consumable through `code_graph_query` | An `asOf` generation on the relationship operations returns the old target while the default query returns the new |
| REQ-009 | Bitemporal wiring is byte-identical when the flag is off | With the flag off, every edge remover, the live readers, the lineage writer, the ensure-ready path, and a no-asOf query behave exactly as before |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | A query without asOf is byte-identical | An `asOf`-absent `code_graph_query`, or any query while the flag is off, uses the live readers and the dangling exclusion exactly as today |
| REQ-011 | Type-check and tests stay green | `tsc` exits 0 and every code-graph test that exercises the changed code passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The degree-cap default is 15, set from the recorded degree-sweep benchmark, and is inert while the force-parse flag is off
- **SC-002**: The bitemporal reindex round trip is proven over both the scan handler and the ensure-ready auto-index path, the live read returns only the new target, the as-of read at the pre-reindex generation returns the old target
- **SC-003**: The preserved history is consumable through `code_graph_query asOf`, and every changed site is byte-identical when the flag is off
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Graph generation counter | As-of stamps need a stable generation | Generation bumps only at scan end so all edges in one scan share it |
| Risk | Bitemporal wiring corrupts live edges | High | The whole path is gated, default-off byte identity is tested |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The degree cap bounds the force-parse fan-out. Fifteen is chosen from a degree-sweep benchmark over importer counts five through twenty-five: rebind cost is linear with no cost knee and cheap through the measured range, so the cap maximizes correctness in that range while bounding the unmeasured extreme tail
- **NFR-P02**: The bitemporal close runs as UPDATE statements and the inserts run within the existing per-file transaction, no extra round trips outside it

### Security
- **NFR-S01**: Both changes are internal to the indexer, no network or credential paths touched
- **NFR-S02**: Neither change flips a flag default to on

### Reliability
- **NFR-R01**: The default-off path is byte-identical to the pre-change behavior for both changes
- **NFR-R02**: An as-of query at a past generation returns the target that was live then
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty source set: the edge removers with no source ids skip the delete or close entirely on both paths
- No live edges to close: a close UPDATE touches zero rows and stamps nothing
- Already-closed edge: every close UPDATE only touches rows where `invalid_at IS NULL`, so a prior stamp is preserved

### Error Scenarios
- Flag off with env cap set: the cap env value is never read because the force-parse branch is not entered
- Generation unset: a missing generation parses to 0 so as-of stamps fall back to 0 rather than crashing
- Hot-hub above the cap: a renamed high-fan-in dependency whose importer degree exceeds the cap leaves all its importer edges durably stale until each importer's next own edit. This is the correctness cost of the cap, a deliberate trade for bounded re-parse cost

### State Transitions
- Bump trails the writes: a scan writes its edges while the counter holds the prior value, then bumps once at the end. Loop-time writers stamp at the next generation so the written edges carry the generation the scan produces, while the post-bump dangling sweep stamps at the current generation. Both resolve to the same value for one scan
- Reindex over two scans: an edge written in scan one carries `valid_at = G+1`, and when scan two supersedes it the close stamps `invalid_at = G+2`, giving a non-empty window readable at the genuine pre-reindex generation `G+1`
- Ensure-ready reindex: the auto-index path bumps the generation after its persist loop under the flag, so two consecutive ensure-ready reindexes do not collapse a superseded edge to a zero-width window
- Lineage edge: a SUPERSEDES edge carries an open valid_at at the next generation and a NULL invalid_at, so it is both live-readable and as-of readable
- As-of query: an `asOf` request skips the dangling-edge exclusion because a missing endpoint node is expected for a historical read, so a closed edge to a now-deleted target still surfaces, rendered by its symbol id
- Live read after reindex: the validity-filtered live readers return only the open edge, the closed row stays on disk for the as-of read
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Five source files modified, four test files, a benchmark, one subsystem, many reindex-path and query sites |
| Risk | 18/25 | Production reindex path, live readers, and the public query schema touched, fully flag-gated with byte-identity proof, a real-scan integration test, and a degree-sweep benchmark |
| Research | 10/20 | Reindex path located from 009, the defeat modes from the 011 deep review, the residual gaps from the follow-up review |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the validity columns gain covering indexes before a large-scale as-of read? **RESOLVED: Deferred, out of scope and gated off by default**
- Should the degree cap also apply when force-parse is off? **RESOLVED: No, the cap only bounds the force-parse fan-out which is itself gated**
- Should `asOfEdgesFrom` be exposed on a public query tool? **RESOLVED: Yes, wired. `code_graph_query` now takes an `asOf` generation that routes the relationship reads through the as-of readers, with `asOfEdgesTo` added as the inbound mirror. The larger `code_graph_context` multi-hop surface stays live-only**
- What degree cap does the benchmark support? **RESOLVED: The degree-sweep benchmark shows rebind cost is linear with no knee and cheap through importer count twenty-five, while correctness improves monotonically with the cap. Fifteen is chosen to fully repair the common-to-moderate refactor at negligible cost while bounding the unmeasured hundred-plus-importer tail. The fixture uses trivial importer files, so the absolute milliseconds understate production per-importer cost, which argues against cranking the cap higher on the measured numbers alone**
<!-- /ANCHOR:questions -->
