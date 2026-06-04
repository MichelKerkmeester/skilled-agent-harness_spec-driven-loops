---
title: "Implementation Plan: Relation-Inference Backfill"
description: "New lib/causal/relation-backfill.ts infers typed causal edges from spec-document chains + lineage predecessor links (created_by='auto', default dryRun, bounded, transactional, idempotent). Reporter flips to implemented:true; entry point wired onto memory_causal_stats({ backfill }); entity-density cache invalidated after writes."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/021-relation-inference-backfill"
    last_updated_at: "2026-06-04T12:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Module + wiring + tests complete; tsc clean"
    next_safe_action: "Commit + deploy (daemon rebuild + recycle)"
    blockers: []
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Relation-Inference Backfill

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
| **Storage** | SQLite (`causal_edges`, `memory_index`, `memory_lineage`) |
| **Testing** | Vitest |

### Overview
A new `lib/causal/relation-backfill.ts` exports `backfillRelationInference(db, { dryRun=true, limit, actor })`. It scans bounded `memory_index` + `memory_lineage` rows, infers typed edges from two strong existing signals (spec-document chains + lineage predecessor links), and either reports candidate counts (dry run) or commits `created_by='auto'` edges through the existing guard-bearing `insertEdgesBatch`. The reporter flips to `implemented:true` with a real callable command; the handler exposes the backfill via `memory_causal_stats({ backfill })`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (insertEdge guards, entity-density cache)

### Definition of Done
- [x] All acceptance criteria met (REQ-001..006)
- [x] Tests passing (new backfill suite + updated coverage/output suites + keep-green causal suite)
- [x] `tsc --noEmit` clean; comment hygiene clean
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Bounded maintenance backfill, mirroring `backfillLineageState` (scan → infer → dryRun? report : transaction-write → summary).

### Key Components
- **`backfillRelationInference`**: orchestrates scan/infer/write; default `dryRun=true`, bounded `limit`.
- **`collectSpecChainEdges` / `predictSpecChainEdges`**: group rows by `spec_folder`, map `document_type`→id, emit the same caused/supports pairs as `createSpecDocumentChain`.
- **`collectLineageEdges`**: promote `memory_lineage.predecessor_memory_id`→successor into `caused` edges.
- **`countWrittenByRelation`**: recompute `byRelation` from committed edges so the summary reflects guard-rejected duplicates.

### Data Flow
`memory_causal_stats({ backfill })` → `backfillRelationInference(db, opts)` → bounded scan → infer candidate edges → (dry run: report) OR (commit: `insertEdgesBatch` with `createdBy:'auto'` inside one transaction → `invalidateEntityDensityCache()`) → summary surfaced in the stats response + hint.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/causal/relation-backfill.ts` | new inference subsystem | create | `relation-backfill-unit.vitest.ts` (8 tests) |
| `lib/causal/relation-coverage.ts` | honest reporter (019) | flip implemented:true + command | `relation-coverage-unit.vitest.ts` |
| `handlers/causal-graph.ts` | `memory_causal_stats` handler | add `backfill` arg + surface result | `causal-stats-output.vitest.ts`, `handler-causal-graph.vitest.ts` |
| `schemas/tool-input-schemas.ts` | strict tool-input validation | add optional `backfill` | `mcp-input-validation.vitest.ts` green |
| `lib/storage/causal-edges.ts` | edge writers + guards | unchanged (reused) | guards exercised by backfill tests |
| `lib/search/entity-density.ts` | >=3-outgoing-edge routing cache | unchanged (existing export called) | freshness test asserts call |

Required inventories:
- Consumers of changed symbols: `rg -n 'buildRelationCoverageState|backfillRelationInference|handleMemoryCausalStats' . --glob '*.ts'`.
- Same-class producers (other backfills): `lib/storage/lineage-state.ts:backfillLineageState` (shape mirrored).
- Invariant: every inferred edge is `created_by='auto'`, strength ≤ MAX_AUTO_STRENGTH, no self-loop; backfill never writes when `dryRun` (default true).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm `createSpecDocumentChain` pairing rules + `insertEdgesBatch` createdBy plumbing.
- [x] Confirm `invalidateEntityDensityCache` export + the >=3-outgoing-edge signal it backs.

### Phase 2: Core Implementation
- [x] `relation-backfill.ts` with deterministic spec-chain + lineage signals, dry-run default, bounds, transaction, idempotent upsert.
- [x] Flip reporter to `implemented:true` + real command + honest hint.
- [x] Wire `backfill` into the handler + tool schema; surface result + hint.

### Phase 3: Verification
- [x] New backfill unit tests + updated coverage/output tests.
- [x] `tsc --noEmit` clean; keep-green causal suite passes.
- [ ] Commit + deploy (daemon rebuild + recycle); smoke `memory_causal_stats({ backfill })`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `relation-backfill-unit.vitest.ts` (dryRun-zero-writes, bounded guard-respecting writes, freshness cache invalidation, idempotency, stat flip, cold-start) | Vitest + in-memory sqlite |
| Integration | `causal-stats-output.vitest.ts`, `handler-causal-graph.vitest.ts` | Vitest |
| Regression | `relation-coverage-unit.vitest.ts`, `causal-edges*.vitest.ts`, `entity-density.vitest.ts`, `mcp-input-validation.vitest.ts` | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `insertEdge` / `insertEdgesBatch` guards | Internal | Green | Required for bounded safe writes |
| `invalidateEntityDensityCache` | Internal | Green | Required for routing-signal freshness |
| `createSpecDocumentChain` pairing rules | Internal | Green | Source of the spec-chain edge shape |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: unexpected edge growth or routing regression after deploy.
- **Procedure**: `git revert` the commit; the new entry point disappears on the next dist rebuild + recycle. Any committed auto edges are reversible via `memory_causal_unlink` / orphan cleanup, and were strength-bounded + count-bounded by construction. No schema migration to reverse.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Core (module + reporter flip + handler/schema wiring) ──► Verify (tests + tsc)
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
| Core Implementation | Med | ~2-3 hours |
| Verification | Low | ~1 hour |
| **Total** | | **~4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Default `dryRun=true` is the safety gate (no flag needed).
- [x] Bounded `limit` (default 200, max 2000) caps any single run.

### Rollback Procedure
1. `git revert` the commit.
2. Rebuild dist + recycle the daemon (orchestrator-owned).
3. Smoke `memory_causal_stats` to confirm the `backfill` arg is gone.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: committed auto edges are removable via `memory_causal_unlink` / orphan cleanup; all were strength- and count-bounded.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
relation-backfill.ts ──uses──► causal-edges.ts (insertEdgesBatch + guards)
        │                          │
        └──invalidates──► entity-density.ts (routing cache)
relation-coverage.ts ──command──► relation-backfill.ts (via handler)
handlers/causal-graph.ts ──calls──► relation-backfill.ts
schemas/tool-input-schemas.ts ──gates──► handler backfill arg
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| relation-backfill.ts | causal-edges, entity-density | auto edges, summary | handler, reporter command |
| relation-coverage.ts | (command string only) | implemented:true state | stats consumers |
| handlers/causal-graph.ts | relation-backfill, schema | stats + backfill result | MCP tool path |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **relation-backfill.ts core** - signals + dry-run/commit paths - CRITICAL
2. **reporter flip + command wiring** - implemented:true callable - CRITICAL
3. **tests + tsc** - prove the 4 P0 requirements - CRITICAL

**Total Critical Path**: module → wiring → verification.

**Parallel Opportunities**:
- Test authoring and reporter flip can proceed once the module signature is fixed.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Module complete | dry-run + commit paths bounded + guarded | DONE |
| M2 | Stat made true | implemented:true + callable command | DONE |
| M3 | Verified | tests green + tsc clean | DONE |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the full ADRs (signal selection, entry-point wiring, schema touch, dry-run default). Summary:

### ADR-001: Reuse deterministic signals, not a new heuristic

**Status**: Accepted

**Context**: The brief allows similarity/contradiction signals but warns against inventing speculative heuristics on a just-recovered production DB.

**Decision**: Ship the two fully-deterministic, fully-testable signals (spec-document chains + lineage predecessor links). Defer similarity/contradiction as best-effort extensions.

**Consequences**:
- Safe, auditable, reproducible auto edges; satisfies REQ-001..006.
- `caused`/`supports` coverage rises from real structure, not guesses.

**Alternatives Rejected**:
- Embedding-cosine 'supports' neighbors now: not deterministically testable in a unit fixture; deferred.
