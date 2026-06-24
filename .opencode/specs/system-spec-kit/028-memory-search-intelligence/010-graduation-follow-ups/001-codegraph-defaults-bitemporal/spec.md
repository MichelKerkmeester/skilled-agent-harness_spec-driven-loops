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
The 009 dark-flag validation found two production-readiness gaps in the system-code-graph subsystem, both behind existing default-off flags. The staleness-repair force-parse degree cap defaults to 0, which means uncapped, so a rename of a hot high-importer dependency pulls its whole importer fan-in back into the parse batch with no ceiling. The bitemporal edge writer is built but unwired, so the reindex path always deletes and re-inserts and an as-of query cannot answer about a past generation.

### Purpose
Set a production ceiling for the degree cap and wire the bitemporal writer into the reindex edge-replacement path, each behind its existing flag so the default-off behavior stays byte-identical.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Change `DEFAULT_REVERSE_DEP_DEGREE_CAP` from 0 to 10, the value the 006 benchmark validated
- Wire `closeEdgesForSources` and `insertEdgeWithValidity` into `replaceEdges` when the bitemporal flag is on
- A live integration test for the bitemporal reindex round trip
- Byte-identity tests for both changes when the gating flag is off

### Out of Scope
- Flipping any flag default to on - the work stays default-off
- Covering indexes on the validity columns - deferred and gated off
- Any file outside `.opencode/skills/system-code-graph/**` - scope lock

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts | Modify | Degree-cap default 0 to 10 plus comment update |
| .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts | Modify | Wire bitemporal close-and-insert into replaceEdges behind the flag |
| .opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-reindex.vitest.ts | Create | Live integration and byte-identity tests for the reindex wiring |
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
| REQ-003 | Bitemporal writer wired into the reindex path | When the bitemporal flag is on, `replaceEdges` closes old edges with `invalid_at` and inserts replacements with `valid_at` open |
| REQ-004 | Bitemporal wiring is byte-identical when the flag is off | `replaceEdges` with the flag off deletes and re-inserts exactly as before, validity columns untouched |
| REQ-005 | Live integration proof | A test closes an edge at generation N, reindexes at N+1, asserts the as-of query returns the old target for the past generation and the new target for current |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Dangling prune preserves history under the flag | When the bitemporal flag is on, the dangling prune closes edges instead of deleting them |
| REQ-007 | Type-check stays clean | `npx tsc --noEmit --composite false -p .opencode/skills/system-code-graph/tsconfig.json` exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The degree-cap default is 10 and is inert while the force-parse flag is off
- **SC-002**: The bitemporal reindex round trip is proven by a live integration test against a real SQLite database
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
- **NFR-P01**: The degree cap bounds the force-parse fan-out so a 30-importer rename drops to zero forced re-parses at cap 10
- **NFR-P02**: The bitemporal close-and-insert adds one UPDATE and per-edge inserts within the existing per-file transaction

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
- Empty source set: `replaceEdges` with no source ids skips the delete or close entirely on both paths
- No live edges to close: `closeEdgesForSources` returns a zero count and stamps nothing
- Already-closed edge: the dangling prune under the flag only touches rows where `invalid_at IS NULL`

### Error Scenarios
- Flag off with env cap set: the cap env value is never read because the force-parse branch is not entered
- Generation unset: a missing generation parses to 0 so as-of stamps fall back to 0 rather than crashing
- Reindex within one scan: every `replaceEdges` call sees the same generation because the bump runs once at scan end

### State Transitions
- Close at N then reindex at N+1: the old edge carries `invalid_at = N+1`, the new edge opens at N+1
- Live read after reindex: the as-of read at the current generation returns only the open edge
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two files modified, two test files, one subsystem |
| Risk | 12/25 | Persistence path touched, fully flag-gated with byte-identity proof |
| Research | 6/20 | Reindex path and helpers located from 009 research |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the validity columns gain covering indexes before a large-scale as-of read? **RESOLVED: Deferred, out of scope and gated off by default**
- Should the degree cap also apply when force-parse is off? **RESOLVED: No, the cap only bounds the force-parse fan-out which is itself gated**
<!-- /ANCHOR:questions -->
