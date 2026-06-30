---
title: "Implementation Plan: Semantic Relation Inference"
description: "Two OPT-IN collectors added to backfillRelationInference: a similarity 'supports' collector reading only the cached memory_index.related_memories column (no live vec, no O(n^2)), and a 'contradicts' collector from structural memory_lineage.superseded_by_memory_id. Both default false, run inside the existing transaction, emit created_by='auto' edges through insertEdgesBatch, and inherit the dryRun-default + bounded safety. Wired through the schema, types, and handler; honest hint updated."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/023-semantic-relation-inference"
    last_updated_at: "2026-06-04T13:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Collectors + wiring + tests complete; tsc clean"
    next_safe_action: "Commit + deploy"
    blockers: []
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Semantic Relation Inference

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node, better-sqlite3) |
| **Framework** | mk-spec-memory MCP server |
| **Storage** | SQLite (`causal_edges`, `memory_index.related_memories`, `memory_lineage.superseded_by_memory_id`) |
| **Testing** | Vitest |

### Overview
Two OPT-IN collectors extend the shipped `backfillRelationInference`. The similarity collector reads the pre-computed `memory_index.related_memories` column (cached cosine neighbours, 0-100 scale), keeps neighbours at or above a threshold (default 75, configurable 1-100), takes top K<=5, excludes self + spec-chain pairs, and emits `supports` at strength ~0.35. The contradicts collector promotes `memory_lineage.superseded_by_memory_id` into a predecessor->successor `contradicts` edge at strength ~0.3. Both run inside the existing transaction, commit through the guard-bearing `insertEdgesBatch` with `createdBy='auto'`, and are gated behind `options.similarity` / `options.contradicts` (default false).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (insertEdge guards, existing transaction + invalidation)

### Definition of Done
- [x] All acceptance criteria met (REQ-001..006)
- [x] Tests passing (new similarity suite + keep-green causal suites)
- [x] `tsc --noEmit` clean; comment hygiene clean
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive OPT-IN collectors inside the established bounded-backfill flow (scan → infer → dryRun? report : transaction-write → summary).

### Key Components
- **`collectSimilarityEdges`**: parse cached `related_memories`, threshold + top-K filter, exclude self + spec-chain pairs, emit `supports`.
- **`collectSupersessionEdges`**: promote `superseded_by_memory_id` into predecessor->successor `contradicts`.
- **`parseRelatedNeighbors`**: tolerant JSON parse of the cached column (mirrors co-activation parsing; drops bare ids that carry no score).
- **`pairKey` / spec-chain pair set**: unordered-pair dedup so similarity never re-links a structural pair.
- **`columnExists`**: gate the collectors on column presence for cold-start safety.

### Data Flow
`memory_causal_stats({ backfill: { similarity, contradicts, similarityThreshold } })` → `backfillRelationInference(db, opts)` → bounded scan of the cached column + supersession rows (only when the flag is on) → infer candidate edges → (dry run: report) OR (commit inside the existing transaction via `insertEdgesBatch` createdBy='auto' → `invalidateEntityDensityCache()` already called once after commit) → summary.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/causal/relation-backfill.ts` | shipped backfill (021) | add two opt-in collectors + options | `relation-backfill-similarity.vitest.ts` (9 tests) |
| `lib/causal/relation-coverage.ts` | honest reporter | update hint to advertise opt-in collectors | `relation-coverage-unit.vitest.ts` green |
| `handlers/causal-graph.ts` | `memory_causal_stats` handler | thread similarity/contradicts/similarityThreshold | `handler-causal-graph.vitest.ts`, `causal-stats-output.vitest.ts` |
| `schemas/tool-input-schemas.ts` | strict tool-input validation | add the 3 optional nested fields | `mcp-input-validation.vitest.ts` green |
| `tools/types.ts` | dispatcher arg type | extend `CausalStatsArgs.backfill` | tsc |
| `lib/storage/causal-edges.ts` | edge writers + guards | unchanged (reused) | guards exercised by tests |

Required inventories:
- Consumers of changed symbols: `rg -n 'backfillRelationInference|BackfillRelationInferenceOptions|handleMemoryCausalStats' . --glob '*.ts'`.
- Same-class producers (collectors inside the backfill): `collectSpecChainEdges`, `collectLineageEdges` (new collectors follow their `InferredEdge[]` shape).
- Invariant: every inferred edge is `created_by='auto'`, strength ≤ MAX_AUTO_STRENGTH, no self-loop; the two new collectors stay silent unless their flag is explicitly `true`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the cached `related_memories` shape (`[{ id, similarity }]`, 0-100) and its writers (`link_related_on_save` / co-activation).
- [x] Confirm `superseded_by_memory_id` semantics (memory_id superseded BY successor) in lineage-state.

### Phase 2: Core Implementation
- [x] Add `collectSimilarityEdges` (cached-column read, threshold + top-K, exclusions) and `collectSupersessionEdges`.
- [x] Add `similarity`/`contradicts`/`similarityThreshold` to options; gate the collectors; wire into scan/dry-run/execute/byRelation.
- [x] Wire the 3 fields through schema, types, and the handler pass-through; update the honest hint.

### Phase 3: Verification
- [x] New `relation-backfill-similarity.vitest.ts` (opt-in/dry/bounded/idempotent/no-op).
- [x] `tsc --noEmit` clean; keep-green causal suite passes.
- [ ] Commit + deploy (orchestrator-owned dist rebuild + recycle).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `relation-backfill-similarity.vitest.ts` (opt-in default off, dry-run zero writes, bounded similarity threshold/K/strength, contradicts-from-supersession, idempotency, graceful no-op/unparseable) | Vitest + in-memory sqlite |
| Regression | `relation-backfill-unit`, `relation-coverage-unit`, `causal-stats-output`, `causal-edges-unit`, `handler-causal-graph`, `mcp-input-validation` | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `insertEdge` / `insertEdgesBatch` guards | Internal | Green | Required for bounded safe writes |
| Existing transaction + `invalidateEntityDensityCache` in backfill | Internal | Green | Collectors reuse it; no new invalidation |
| Cached `related_memories` column | Internal | Green | Source of the similarity collector's candidates |
| `memory_lineage.superseded_by_memory_id` | Internal | Green | Source of the contradicts collector's candidates |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: unexpected edge growth or routing regression after deploy.
- **Procedure**: `git revert` the commit; the new options disappear on the next dist rebuild + recycle. Committed auto edges are reversible via `memory_causal_unlink` / orphan cleanup and were strength + count bounded by construction. No schema migration to reverse (the columns already existed).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Core (collectors + options + wiring) ──► Verify (tests + tsc)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | Deploy |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | ~0.5 hour |
| Core Implementation | Med | ~2 hours |
| Verification | Low | ~1 hour |
| **Total** | | **~3.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Both collectors OPT-IN (default false) — no behaviour change for existing callers.
- [x] Default `dryRun=true` + bounded `limit` cap any single run.

### Rollback Procedure
1. `git revert` the commit.
2. Rebuild dist + recycle the daemon (orchestrator-owned).
3. Smoke `memory_causal_stats` to confirm the new options are gone.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: committed auto edges removable via `memory_causal_unlink` / orphan cleanup; all strength + count bounded.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
relation-backfill.ts (new collectors) ──uses──► causal-edges.ts (insertEdgesBatch + guards)
        │                                          │
        ├──reads──► memory_index.related_memories (cached neighbours)
        └──reads──► memory_lineage.superseded_by_memory_id (structural supersession)
handlers/causal-graph.ts ──passes──► similarity/contradicts/similarityThreshold
schemas/tool-input-schemas.ts ──gates──► the 3 nested options
tools/types.ts ──types──► CausalStatsArgs.backfill
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| relation-backfill.ts | causal-edges, cached column, lineage | supports/contradicts auto edges | handler, hint |
| handlers/causal-graph.ts | relation-backfill, schema | stats + backfill result | MCP tool path |
| schemas/tool-input-schemas.ts | — | validated backfill options | handler args |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **collectors + options** - cached-column read + supersession + gating - CRITICAL
2. **wiring (schema/types/handler)** - options callable end-to-end - CRITICAL
3. **tests + tsc** - prove the 4 P0 requirements - CRITICAL

**Total Critical Path**: collectors → wiring → verification.

**Parallel Opportunities**:
- Test authoring can proceed once the collector signatures are fixed.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Collectors complete | opt-in, bounded, guarded, cached-column-only | DONE |
| M2 | Wiring complete | options callable through the MCP tool path | DONE |
| M3 | Verified | tests green + tsc clean | DONE |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for full ADRs (cached column over live vec, supersession over semantic, opt-in posture). Summary:

### ADR-001: Read the cached related_memories column, not a live vector scan

**Status**: Accepted

**Context**: The brief warns against a live `vector_search`/sqlite-vec scan and O(n^2) all-pairs work on a recovered production DB; the similarity collector must be deterministic + testable.

**Decision**: Read only the pre-computed `memory_index.related_memories` column (written by `link_related_on_save`).

**Consequences**:
- Deterministic, unit-testable without sqlite-vec; bounded by the existing `limit`.
- The collector is only as fresh as the cached column, which is acceptable for a maintenance backfill.

**Alternatives Rejected**:
- Live vector scan per row: non-deterministic in a fixture and risks O(n^2) cost.
