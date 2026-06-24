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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/010-graduation-follow-ups/001-codegraph-defaults-bitemporal"
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
Two surgical changes, each behind an existing default-off flag. The degree-cap default moves from 0 to 10 in `structural-indexer.ts`. The bitemporal writer is wired into `replaceEdges` in `code-graph-db.ts` so a reindex closes the superseded edges and inserts replacements with an open validity window when the bitemporal flag is on, and runs the original delete-and-insert when off.
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
- **structural-indexer.ts `DEFAULT_REVERSE_DEP_DEGREE_CAP`**: the production ceiling, read by `getReverseDepDegreeCap`
- **code-graph-db.ts `replaceNodes`**: runs first on the per-file persist path and owns the old symbol ids, closes instead of deletes under the flag
- **code-graph-db.ts `replaceEdges`**: closes the source edges and inserts replacements with an open window
- **code-graph-db.ts `pruneDanglingEdges`**: the deferred full-scan prune, closes instead of deletes under the flag
- **code-graph-db.ts `queryEdgesFrom` and `queryEdgesTo`**: live readers, filter closed edges under the flag
- **code-graph-db.ts `getNextCodeGraphGeneration`**: the loop-time stamping helper that fixes the off-by-one
- **code-graph-db.ts `asOfEdgesFrom`**: the as-of reader, the tested consumer, public query-surface exposure deferred

### Data Flow
A rescan parses a changed file and calls `persistIndexedFileResult`, which wraps `replaceNodes` then `replaceEdges` in one per-file transaction, then the full scan bumps the generation and calls `pruneDanglingEdges`. Off: every step deletes. On: `replaceNodes` closes the old source and removed-target edges, `replaceEdges` closes the source edges and inserts replacements with an open window, the post-bump `pruneDanglingEdges` closes danglers. Loop-time closes and inserts stamp at the next generation, the post-bump prune stamps at the current generation, both equal the scan's produced generation. The live readers drop closed edges, and `asOfEdgesFrom` filters by the validity window for a past or current generation.
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
| `getNextCodeGraphGeneration` | New loop-time stamping helper | added | as-of round-trip assertion |
| `persistIndexedFileResult` | Per-file persist boundary | unchanged | `rg -n 'replaceNodes|replaceEdges' ensure-ready.ts` |
| `getReverseDepDegreeCap` | Reads the degree-cap default | unchanged, default value changed | degree-cap byte-identity test |
| `asOfEdgesFrom` | As-of reader | unchanged, public query-surface exposure deferred | integration test |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Degree-cap default
- [x] Change `DEFAULT_REVERSE_DEP_DEGREE_CAP` from 0 to 10
- [x] Update the cap comments so they no longer call 0 the default
- [x] Confirm the value is read only inside the force-parse branch

### Phase 2: Bitemporal reindex wiring
- [x] Add `getNextCodeGraphGeneration` and stamp loop-time writes at the next generation
- [x] Close edges in `replaceNodes` under the flag instead of deleting
- [x] Close-and-insert in `replaceEdges` under the flag
- [x] Close danglers in `pruneDanglingEdges` under the flag at the current generation
- [x] Filter closed edges from `queryEdgesFrom` and `queryEdgesTo` under the flag
- [x] Keep every off-path statement verbatim

### Phase 3: Verification
- [x] Author the real-scan integration round trip and the off-path byte-identity tests
- [x] Author the live-reader filter and close-not-delete unit tests
- [x] Author the degree-cap byte-identity tests
- [x] Confirm `tsc` exits 0, the new test files type-check, and the focused run passes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Degree-cap inertness, live-reader filter, close-not-delete, all with off-path byte identity | Vitest |
| Integration | Bitemporal reindex round trip driving the real scan handler twice | Vitest |
| Manual | Type-check of the subsystem and the three new test files | tsc |
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
- **Procedure**: Revert the two source edits. The flags stay off by default so reverting restores the prior behavior with no data migration
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
| Degree-cap default | Low | 15 minutes |
| Bitemporal reindex wiring | Med | 1 hour |
| Tests and verification | Med | 1.5 hours |
| **Total** | | **2.75 hours** |
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
