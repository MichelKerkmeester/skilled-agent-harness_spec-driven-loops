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
Flag-gated branch inside the existing reindex transaction. The bitemporal path reuses the already-built `closeEdgesForSources` and `insertEdgeWithValidity`, which call the same `getDb()` singleton and therefore join the same per-file transaction.

### Key Components
- **structural-indexer.ts `DEFAULT_REVERSE_DEP_DEGREE_CAP`**: the production ceiling, read by `getReverseDepDegreeCap`
- **code-graph-db.ts `replaceEdges`**: the reindex edge-replacement path, now branching on the bitemporal flag
- **code-graph-db.ts `closeEdgesForSources` and `insertEdgeWithValidity`**: the close-and-insert writer reused for the on-path
- **code-graph-db.ts `asOfEdgesFrom`**: the as-of reader used by the integration test

### Data Flow
A rescan parses a changed file and calls `persistIndexedFileResult`, which wraps `replaceNodes` and `replaceEdges` in one per-file transaction. `replaceEdges` reads the bitemporal flag once. Off: delete edges from the source ids, re-insert retained edges, prune dangling edges by delete. On: close live edges from the source ids with `invalid_at`, insert retained edges with `valid_at` open, prune dangling edges by closing them. An as-of query later filters by the validity window for a past or current generation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `replaceEdges` | Reindex edge-replacement producer | update, flag-gated branch added | byte-identity and integration tests |
| `closeEdgesForSources` and `insertEdgeWithValidity` | Bitemporal writer, previously unwired | now called from `replaceEdges` on the on-path | integration test |
| `persistIndexedFileResult` | Per-file persist boundary calling `replaceEdges` | unchanged | `rg -n 'replaceEdges' ensure-ready.ts` |
| `getReverseDepDegreeCap` | Reads the degree-cap default | unchanged, default value changed | degree-cap byte-identity test |
| `asOfEdgesFrom` | As-of reader | unchanged, now exercised by a live consumer | integration test |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Degree-cap default
- [x] Change `DEFAULT_REVERSE_DEP_DEGREE_CAP` from 0 to 10
- [x] Update the cap comments so they no longer call 0 the default
- [x] Confirm the value is read only inside the force-parse branch

### Phase 2: Bitemporal reindex wiring
- [x] Read the bitemporal flag once at the top of `replaceEdges`
- [x] Branch the source delete to `closeEdgesForSources` when on
- [x] Branch the edge insert to `insertEdgeWithValidity` when on
- [x] Branch the dangling prune to a close-only UPDATE when on

### Phase 3: Verification
- [x] Author the bitemporal live integration test and byte-identity tests
- [x] Author the degree-cap byte-identity tests
- [x] Confirm `tsc` exits 0 and the new test files type-check
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Degree-cap inertness while force-parse is off | Vitest |
| Integration | Bitemporal reindex round trip against a real SQLite database | Vitest |
| Manual | Type-check of the subsystem and the two new test files | tsc |
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
