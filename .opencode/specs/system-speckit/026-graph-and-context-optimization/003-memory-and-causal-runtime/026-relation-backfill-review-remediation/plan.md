---
title: "Implementation Plan: Relation-Backfill Review Remediation"
description: "Add a relation-agnostic conflict guard to the relation-inference backfill, make written/byRelation honest via a committed valid-auto-edge delta, make the inner backfill schema strict, and clear the maintainability P2s — all behind the same insertEdge guards, with no change to the contradiction-detection labeling."
trigger_phrases:
  - "relation backfill remediation plan"
  - "conflict guard implementation"
  - "backfill honest delta counting"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/026-relation-backfill-review-remediation"
    last_updated_at: "2026-06-04T14:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Guard + counting + schema + P2s landed; suites green"
    next_safe_action: "Strict-validate packet"
    blockers: []
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Relation-Backfill Review Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node, better-sqlite3) |
| **Framework** | MCP server (spec-kit memory) |
| **Storage** | SQLite (`causal_edges`, temporal `invalid_at` lifecycle) |
| **Testing** | Vitest |

### Overview
Suppress backfill auto edges whose (source,target) pair already carries a VALID conflicting-relation edge, so contradiction-detection never invalidates an established edge. Derive `written`/`byRelation` from a before/after snapshot of valid `created_by='auto'` edges. Make the inner `backfill` schema strict. Remove maintainability debt in the module.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Defect reproduced (caused edge `invalid_at` set after contradicts insert).
- [x] Conflict rules located (`relationsConflict`, contradiction-detection).
- [x] Honest-counting approach chosen (valid-auto-edge delta).

### Definition of Done
- [x] All acceptance criteria met (REQ-001..007).
- [x] `tsc --noEmit` clean; required + keep-green suites pass.
- [x] Docs (spec/plan/tasks/checklist/decision-record/implementation-summary) synchronized.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Defensive write-path guard + delta-based reporting, layered on the existing scan→infer→write→summary backfill.

### Key Components
- **`hasConflictingValidEdge(db, source, target, relation)`**: column-aware query that reuses `relationsConflict`; sees in-transaction inserts.
- **`insertNonConflictingEdges(db, edges)`**: filters out conflicting candidates, inserts the rest, returns the skipped count.
- **`insertInferredEdges(edges)`**: single batch-insert helper shared by all collector write blocks.
- **`countValidAutoEdgesByRelation(db)`**: snapshot used before/after the commit for honest written/byRelation.

### Data Flow
Non-conflicting structural collectors (spec-chain + lineage `caused`, then similarity `supports`) insert first; the conflict-prone collectors (similarity `supports` against a pre-existing conflict, supersession `contradicts`) are filtered against the now-current valid edges within the same transaction.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This remediation is `fix_bug` and touches schema boundaries + persistence + a public response field, so the surface inventory is mandatory.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/causal/relation-backfill.ts` (write path) | Emits + commits inferred auto edges | update (add conflict guard + delta counting + helpers) | `relation-backfill-conflict.vitest.ts` + existing suites |
| `lib/graph/contradiction-detection.ts` (`relationsConflict`) | Owns the conflict-pair rules; invalidates on insert | update (export helper; rules unchanged) | `contradiction-detection.vitest.ts` green; reused by the guard |
| `lib/storage/causal-edges.ts` (`insertEdge`/`insertEdgesBatch`) | Runs contradiction-detection on insert | unchanged (not a consumer of the new guard) | `causal-edges-unit.vitest.ts` green |
| `schemas/tool-input-schemas.ts` (`memoryCausalStatsSchema.backfill`) | Validates the `backfill` arg | update (inner object now strict) | new strict-key test + `mcp-input-validation.vitest.ts` |
| `handlers/causal-graph.ts` (hint + `data.backfill`) | Surfaces the backfill summary | update (honest hint + `skippedConflicting`) | `handler-causal-graph.vitest.ts` + `causal-stats-output.vitest.ts` |
| Consumers of `BackfillRelationInferenceResult` | Read the summary shape | unchanged (additive field) | `ReturnType<...>` tracks; grep below |

Required inventories:
- Same-class producers: `rg -n 'insertEdgesBatch|createSpecDocumentChain|detectContradictions' mcp_server/lib/causal mcp_server/lib/storage mcp_server/lib/graph` — only this backfill and `createSpecDocumentChain` produce auto/manual chain edges; only this backfill emits the conflicting reciprocal pair.
- Consumers of changed symbols: `rg -n 'BackfillRelationInferenceResult|skippedConflicting|relationsConflict|backfillResult\.' mcp_server` — handler reads the result via `ReturnType`; `relationsConflict` now imported by the backfill.
- Matrix axes: {dryRun true/false} x {reciprocal lineage / manual pre-existing edge / spec-chain+lineage} x {first-run / re-run} x {temporal column present/absent}.
- Algorithm invariant: a committed backfill never sets `invalid_at` on a pre-existing VALID edge; a conflicting candidate is skipped and reported under `skippedConflicting`, never under `written`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Reproduce the defect (caused `invalid_at` set after contradicts insert).
- [x] Export `relationsConflict` from contradiction-detection.

### Phase 2: Core Implementation
- [x] Add `hasConflictingValidEdge` + `insertNonConflictingEdges` + `insertInferredEdges`.
- [x] Reorder the transaction so non-conflicting edges insert first; filter conflict-prone collectors.
- [x] Add `skippedConflicting` to the result; derive `written`/`byRelation` from the valid-auto-edge delta.
- [x] Make the inner `backfill` schema strict (via `getSchema`).
- [x] Honest handler hint + `skippedConflicting` note.
- [x] P2s: drop unused import, remove dead no-op loop, name spec-chain strengths, single insert helper.

### Phase 3: Verification
- [x] New `relation-backfill-conflict.vitest.ts` (5 cases).
- [x] `tsc --noEmit` clean; 9 causal/backfill/schema suites green (179 tests).
- [ ] Strict-validate the packet.
- [ ] Commit + deploy (user-gated).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Conflict guard, honest counting, strict inner schema | Vitest + better-sqlite3 in-memory |
| Regression | Existing backfill/similarity/coverage/handler/contradiction suites | Vitest |
| Type | `tsc --noEmit` over the mcp_server | tsc |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `relationsConflict` | Internal | Green | Guard cannot reuse shared conflict rules |
| `insertEdgesBatch`/`insertEdge` | Internal | Green | Auto-edge guards unavailable |
| Temporal `invalid_at` column | Internal | Green (column-aware fallback) | Guard/count degrade gracefully |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A legitimate auto edge is wrongly suppressed, or counting regresses.
- **Procedure**: `git revert` the commit; rebuild dist + recycle the daemon. The guard and counting are additive and stateless — reverting restores prior behavior with no data migration. Any auto edges already written remain bounded and removable via `memory_causal_unlink` / orphan cleanup.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Repro + export) ──► Phase 2 (Guard + counting + schema + P2s) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | ~0.5h |
| Core Implementation | Med | ~2h |
| Verification | Low | ~0.5h |
| **Total** | | **~3h** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Tests green on the working tree.
- [x] Default `dryRun=true` safety preserved.

### Rollback Procedure
1. `git revert` the remediation commit.
2. Rebuild dist + recycle the daemon.
3. Smoke `memory_causal_stats({ backfill: { dryRun: true } })`.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A (additive guard + reporting; no schema change).
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
contradiction-detection (relationsConflict) ──► relation-backfill (hasConflictingValidEdge)
                                                      │
            insertEdgesBatch/insertEdge ◄────────────┘──► causal_edges (valid/invalid lifecycle)
                                                      │
                              handlers/causal-graph ◄─┘ (honest hint + data.backfill)
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| relationsConflict export | None | shared conflict rule | guard |
| conflict guard + helpers | relationsConflict, insertEdgesBatch | skipped/written counts | handler hint, tests |
| strict inner schema | getSchema | rejection of unknown keys | schema test |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Export `relationsConflict`** - ~5m - CRITICAL
2. **Conflict guard + transaction reorder + delta counting** - ~90m - CRITICAL
3. **Regression tests + tsc** - ~30m - CRITICAL

**Parallel Opportunities**:
- Strict-schema fix and the P2 cleanups can land alongside the guard once the export exists.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Defect guarded | caused survives reciprocal contradicts | done |
| M2 | Honest summary | written===0 on re-run; byRelation==SQL | done |
| M3 | Green + clean | 179 tests pass; tsc clean | done |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` (ADR-001..004): suppress-emission vs alter-detector; relation-agnostic guard; delta-based honest counting; strict inner schema.
