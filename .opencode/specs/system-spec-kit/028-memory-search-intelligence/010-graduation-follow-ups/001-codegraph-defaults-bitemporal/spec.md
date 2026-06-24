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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/010-graduation-follow-ups/001-codegraph-defaults-bitemporal"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Set degree-cap default to 10 and wired the bitemporal writer into replaceEdges, both flag-gated"
    next_safe_action: "Run the full vitest suite on the CLI executor"
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
The 009 dark-flag validation found two production-readiness gaps in the system-code-graph subsystem, both behind existing default-off flags. The staleness-repair force-parse degree cap defaults to 0, which means uncapped, so a rename of a hot high-importer dependency pulls its whole importer fan-in back into the parse batch with no ceiling. The bitemporal edge writer is built but unwired, so the reindex path always deletes and re-inserts and an as-of query cannot answer about a past generation. A subsequent opus deep review (011) then found the first bitemporal wiring attempt was defeated on the real reindex path: the live readers had no validity filter so they returned both the closed and the open edge, and the upstream node-replacement and dangling-prune paths hard-deleted edges before the close could record them, so an as-of query returned nothing.

### Purpose
Set a production ceiling for the degree cap and wire the bitemporal writer correctly through the whole real reindex path, each behind its existing flag so the default-off behavior stays byte-identical. The live readers must filter closed edges, every edge remover on the reindex path must close rather than delete under the flag, and the generation stamping must place a superseded edge in a readable window.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Change `DEFAULT_REVERSE_DEP_DEGREE_CAP` from 0 to 10, an unbenchmarked midpoint chosen as a safe ceiling
- Wire the bitemporal writer through the whole real reindex path under the flag: `replaceNodes`, `replaceEdges`, and `pruneDanglingEdges` close instead of delete
- Filter closed edges out of the live readers `queryEdgesFrom` and `queryEdgesTo` under the flag
- Stamp loop-time writes at the next generation so a superseded edge lands in a readable window
- A live integration test that drives the real scan handler twice and byte-identity tests for the off path

### Out of Scope
- Flipping any flag default to on - the work stays default-off
- Covering indexes on the validity columns - deferred and gated off
- Exposing an as-of read parameter on the public `code_graph_query` or `code_graph_context` tools - deliberately deferred, see the de-scoped graduation note in section 8
- Any file outside `.opencode/skills/system-code-graph/**` - scope lock

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts | Modify | Degree-cap default 0 to 10 plus comment update |
| .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts | Modify | Close-not-delete in replaceNodes, replaceEdges, and pruneDanglingEdges, live-reader validity filter, next-generation stamping, all flag-gated |
| .opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-reindex.vitest.ts | Create | Real-scan integration round trip and off-path byte-identity tests |
| .opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts | Create | Live-reader filter and close-not-delete unit tests with off-path byte identity |
| .opencode/skills/system-code-graph/mcp_server/tests/reverse-dep-degree-cap-default.vitest.ts | Create | Byte-identity tests for the degree-cap default while force-parse is off |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Degree cap has a sensible production default | `DEFAULT_REVERSE_DEP_DEGREE_CAP` is 10 and is read only inside the force-parse branch |
| REQ-002 | Degree-cap change is byte-identical when force-parse is off | A scan with the force-parse flag off produces identical edge state regardless of the degree-cap env value |
| REQ-003 | Live readers filter closed edges under the flag | `queryEdgesFrom` and `queryEdgesTo` add `AND invalid_at IS NULL` only when the flag is on, so a live read after a reindex returns only the open edge |
| REQ-004 | Every reindex-path edge remover closes under the flag | `replaceNodes`, `replaceEdges`, and `pruneDanglingEdges` close edges with `invalid_at` instead of deleting them when the flag is on |
| REQ-005 | Superseded edges land in a readable window | Loop-time writes stamp at the next generation so an as-of query at the genuine pre-reindex generation returns the old target and the close lands strictly after the valid_at |
| REQ-006 | Real-reindex integration proof | A test drives the real scan handler twice with the flag on under the production bump ordering, asserting `asOfEdgesFrom` at the pre-reindex generation returns the old target and the live read returns only the new target |
| REQ-007 | Bitemporal wiring is byte-identical when the flag is off | With the flag off, `replaceNodes`, `replaceEdges`, `pruneDanglingEdges`, and the live readers behave exactly as before, validity columns untouched |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | As-of read consumer is honest about exposure | `asOfEdgesFrom` is the tested as-of consumer, the public query-surface exposure is deliberately deferred and not claimed as graduated |
| REQ-009 | Type-check stays clean | `npx tsc --noEmit --composite false -p .opencode/skills/system-code-graph/tsconfig.json` exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The degree-cap default is 10 and is inert while the force-parse flag is off
- **SC-002**: The bitemporal reindex round trip is proven by a test that drives the real scan handler twice, with the live read returning only the new target and the as-of read at the pre-reindex generation returning the old target
- **SC-003**: Every reindex-path edge remover and both live readers are byte-identical when the flag is off
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
- **NFR-P01**: The degree cap bounds the force-parse fan-out. Ten is an unbenchmarked midpoint the 30-versus-2 fixture cannot distinguish, chosen as a safe ceiling rather than a benchmark-tuned value
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
- Live read after reindex: the validity-filtered live readers return only the open edge, the closed row stays on disk for the as-of read
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Two files modified, three test files, one subsystem, multiple reindex-path sites |
| Risk | 16/25 | Production reindex path and live readers touched, fully flag-gated with byte-identity proof and a real-scan integration test |
| Research | 8/20 | Reindex path located from 009, the defeat modes located from the 011 deep review |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the validity columns gain covering indexes before a large-scale as-of read? **RESOLVED: Deferred, out of scope and gated off by default**
- Should the degree cap also apply when force-parse is off? **RESOLVED: No, the cap only bounds the force-parse fan-out which is itself gated**
- Should `asOfEdgesFrom` be exposed on a public query tool? **RESOLVED: De-scoped. The smaller correct option is to keep `asOfEdgesFrom` as the tested as-of consumer and defer the public query-surface parameter. The graduation claim is narrowed to a correct, tested writer plus live-read filter, not a consumable time-travel query API**
- Is degree-cap 10 distinguishable from other values in the open interval? **RESOLVED: No. The fixture only contrasts 30 and 2 importers, so any cap in that range behaves the same on it. Ten is recorded as a safe unbenchmarked midpoint, a degree sweep is future work**
<!-- /ANCHOR:questions -->
