---
title: "Implementation Plan: Code-Graph Degree-Cap Default and Bitemporal Reindex Wiring"
description: "Set the degree-cap production default and wire the bitemporal writer into the reindex edge-replacement path behind existing flags, with byte-identity and integration proof."
trigger_phrases:
  - "degree cap plan"
  - "bitemporal plan"
  - "reindex wiring"
  - "code graph plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/011-graduation-follow-ups/001-codegraph-defaults-bitemporal"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Wired replaceEdges close-and-insert behind the bitemporal flag and set the degree-cap default"
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
# Implementation Plan: Code-Graph Degree-Cap Default and Bitemporal Reindex Wiring

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node |
| **Framework** | system-code-graph MCP server |
| **Storage** | SQLite via better-sqlite3 |
| **Testing** | Vitest |

### Overview
Two surgical changes, each behind an existing default-off flag. The degree-cap default moves from 0 to 15 in `structural-indexer.ts`, the value located by a degree-sweep cost benchmark. The bitemporal writer is wired into `replaceEdges` in `code-graph-db.ts` so a reindex closes the superseded edges and inserts replacements with an open validity window when the bitemporal flag is on, and runs the original delete-and-insert when off.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Both gaps documented from 009 research sections 3.2 and 3.3
- [x] Reindex edge-replacement path located
- [x] Existing bitemporal helpers located

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests authored and type-checking
- [x] Docs updated for spec, plan, and tasks
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Flag-gated branches across every edge remover and live reader on the real reindex path. Each site reads the bitemporal flag once and keeps its original statement on the off branch, so the off path is byte-identical. The close stamps at the next generation because the bump trails the persist loop.

### Key Components
- **structural-indexer.ts `DEFAULT_REVERSE_DEP_DEGREE_CAP`**: the production ceiling set to 15 from the benchmark, read by `getReverseDepDegreeCap`
- **code-graph-db.ts `replaceNodes`, `replaceEdges`, `pruneDanglingEdges`**: the three edge removers, close instead of delete under the flag
- **code-graph-db.ts `queryEdgesFrom` and `queryEdgesTo`**: live readers, filter closed edges under the flag
- **code-graph-db.ts `recordSupersedesLineage`**: stamps a valid_at on lineage edges under the flag
- **code-graph-db.ts `getNextCodeGraphGeneration`**: the loop-time stamping helper that fixes the off-by-one
- **code-graph-db.ts `asOfEdgesFrom` and `asOfEdgesTo`**: the outbound and inbound as-of readers
- **ensure-ready.ts `indexWithTimeout`**: bumps the generation after its persist loop under the flag
- **handlers/query.ts `handleCodeGraphQuery`**: routes the relationship reads through the as-of readers when `asOf` is set
- **benchmark/degree-cap-sweep.mjs**: the cost sweep that set the cap

### Data Flow
A scan persists files (replaceNodes then replaceEdges per file), bumps the generation, then prunes danglers. The ensure-ready auto-index path runs the same persist loop and now also bumps under the flag. Off: every remover deletes. On: each remover closes, loop-time closes and inserts stamp at the next generation, the post-bump prune stamps at the current generation, both equal the scan's produced generation. The live readers drop closed edges. A read consumer can pass `asOf` to `code_graph_query`, which routes the relationship reads through `asOfEdgesFrom` / `asOfEdgesTo` and skips the dangling exclusion so a historical edge to a deleted node still surfaces.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `replaceNodes` | Deletes a file's edges before edge replacement | close instead of delete under the flag | unit test plus real-scan integration |
| `replaceEdges` | Reindex edge-replacement producer | close-and-insert under the flag | byte-identity and integration tests |
| `pruneDanglingEdges` | Deferred full-scan dangling prune | close instead of delete under the flag | unit test |
| `queryEdgesFrom` and `queryEdgesTo` | Live readers used across context and query handlers | add `invalid_at IS NULL` filter under the flag | live-reader unit test, off-path byte identity |
| `recordSupersedesLineage` | Inserts SUPERSEDES lineage edges | stamp valid_at under the flag | lineage as-of test, off-path byte identity |
| `getNextCodeGraphGeneration`, `asOfEdgesTo` | New helpers | added | as-of round-trip and inbound reads |
| `indexWithTimeout` (ensure-ready) | Auto-index persist loop, never bumped | bump the generation under the flag | ensure-ready two-reindex test |
| `handleCodeGraphQuery` | Relationship read handler | optional `asOf` routes through the as-of readers | `code_graph_query asOf` test |
| `excludeDanglingEdges` | Drops edges with a missing endpoint | skip for as-of reads | as-of query returns a deleted-target edge |
| `getReverseDepDegreeCap` | Reads the degree-cap default | unchanged, default set from the benchmark | degree-cap byte-identity test |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Degree-cap default
- [x] Run the degree-sweep benchmark and record the results
- [x] Set `DEFAULT_REVERSE_DEP_DEGREE_CAP` to 15 on the evidence
- [x] Update the cap comment to cite the sweep and the hot-hub cost

### Phase 2: Bitemporal reindex wiring
- [x] Add `getNextCodeGraphGeneration` and stamp loop-time writes at the next generation
- [x] Close edges in `replaceNodes`, `replaceEdges`, and `pruneDanglingEdges` under the flag
- [x] Filter closed edges from `queryEdgesFrom` and `queryEdgesTo` under the flag
- [x] Bump the generation on the ensure-ready path under the flag
- [x] Stamp lineage edges with a valid_at under the flag
- [x] Add `asOfEdgesTo` and the `code_graph_query asOf` parameter, skip the dangling exclusion for as-of
- [x] Keep every off-path statement verbatim

### Phase 3: Verification
- [x] Author the real-scan integration, live-reader, close-not-delete, ensure-ready, lineage, and asOf tests
- [x] Author the degree-cap byte-identity tests and update the mocked ensure-ready test
- [x] Confirm `tsc` exits 0, the new test files type-check, and the code-graph tests that exercise the changed code pass
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Degree-cap inertness, live-reader filter, close-not-delete, lineage validity, all with off-path byte identity | Vitest |
| Integration | Bitemporal round trip over the scan handler and the ensure-ready path, `code_graph_query asOf` | Vitest |
| Benchmark | Degree-sweep cost over importer counts five through twenty-five | Node script |
| Manual | Type-check of the subsystem and the four new test files | tsc |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| better-sqlite3 | External | Green | No database to test against |
| Existing bitemporal helpers | Internal | Green | Nothing to wire |
| Graph generation counter | Internal | Green | No as-of stamps |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A rescan corrupts edges with the bitemporal flag on, or the degree-cap default regresses force-parse behavior
- **Procedure**: Revert the source edits. The flags stay off by default so reverting restores the prior behavior with no data migration. The benchmark and tests are additive
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Degree-cap) ──┐
                       ├──► Phase 3 (Verify)
Phase 2 (Bitemporal) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Degree-cap | None | Verify |
| Bitemporal | None | Verify |
| Verify | Degree-cap, Bitemporal | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Degree-cap benchmark and default | Med | 1 hour |
| Bitemporal wiring and follow-ups | Med | 2 hours |
| Tests and verification | Med | 2 hours |
| **Total** | | **5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Both changes gated behind existing default-off flags
- [x] Byte-identity proven for both off-paths
- [x] No flag default flipped to on

### Rollback Procedure
1. Both flags are off by default so live behavior is unchanged without any action
2. Revert the `structural-indexer.ts` and `code-graph-db.ts` edits
3. Re-run `tsc` and the subsystem tests
4. No stakeholder notification needed, this is internal indexer plumbing

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: None required, the validity columns predate this work
<!-- /ANCHOR:enhanced-rollback -->
