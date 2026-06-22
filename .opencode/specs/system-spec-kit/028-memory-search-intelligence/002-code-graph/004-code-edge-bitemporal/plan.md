---
title: "Implementation Plan: Code-Edge Bi-temporal Lifecycle (Q1-C1 cluster)"
description: "Plan and completion update for the Code Graph schema foundation: SCHEMA_VERSION 6->7 adds code_edges valid_at/invalid_at with UP/DOWN/BACKFILL, idempotent fail-closed migration tests, fresh init and default-off temporal read consumption. Wider lifecycle/timeline consumers remain gated."
trigger_phrases:
  - "code edge bitemporal plan"
  - "q1-c1 views atomic migration"
  - "code graph schema migration sequencing"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/004-code-edge-bitemporal"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented code-edge bitemporal schema foundation"
    next_safe_action: "Keep temporal consumers default-off until named and benchmarked"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-004-code-edge-bitemporal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Code-Edge Bi-temporal Lifecycle (Q1-C1 cluster)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node, better-sqlite3) |
| **Framework** | System Code Graph (`.opencode/skills/system-code-graph/`) - tree-sitter → SQLite typed-edge graph |
| **Storage** | SQLite - `code_edges`/`code_nodes` on a singleton WAL connection, SCHEMA_VERSION = 8 (`code_edges.valid_at`/`invalid_at` added by this phase at the 6->7 migration, commit `1c39235e36`) |
| **Testing** | Vitest (focused code-graph reindex/read suites alongside each change) |

### Overview
This plan is **DONE for the schema foundation** and remains gated for temporal consumers. The shipped foundation adds `code_edges.valid_at` / `invalid_at`, bumps Code Graph `SCHEMA_VERSION` 6->7, exposes UP/DOWN/BACKFILL helpers, backfills legacy rows from `graph_generation`, fails closed on missing migration prerequisites, covers idempotent reruns and fresh DB initialization and keeps temporal read consumption default-off behind `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS`. The wider cluster - live-view routing, close-and-insert reindex writes, edge lifecycle and symbol timeline reads - still requires an explicit consumer and benchmark before it should consume the columns.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready (to un-defer - NOT met today)
- [ ] A real as-of/time-travel consumer is named (impact-as-of, audit or "call graph at commit X") - none exists today
- [ ] Q6-C1 (hard generation watermark) has shipped, the generation bumps atomically with the reindex swap
- [ ] CG-closed-vocab-CHECK has rebuilt the `edge_type` table (the first table-rebuild migration)
- [ ] The bi-temporal "commit-time = event-time" mapping is traced end-to-end (dangling-prune contract `:957-968` + cross-file CALLS resolver)

### Definition of Done (schema foundation)
- [x] Q1-C1 schema columns land as an additive SCHEMA_VERSION 6->7 migration
- [x] UP/DOWN/BACKFILL helpers exist and are tested
- [x] Migration is idempotent, fail-closed and present in fresh DB init
- [x] Temporal consumer behavior remains default-off
- [ ] `validate.sh --strict` passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Non-destructive bi-temporal supersede behind a single SQL-VIEW current-store chokepoint - the aionforge reference: define "current" once as a VIEW, route all default reads through it, retain non-current rows and bump an explicit generation counter in the same atomic commit (SQLite must maintain the counter explicitly, aionforge gets it free from engine MVCC).

### Key Components
- **`code_edges` schema**: gained `valid_at`/`invalid_at` (the validity window) at the 6->7 migration (commit `1c39235e36`, SCHEMA_VERSION is now 8), `ensureSchemaMigrations()` one call site on the WAL singleton, additive ALTER + CREATE-IF-NOT-EXISTS (no table-rebuild pattern exists yet - closed-vocab adds the first).
- **Reindex write path** (`code-graph-db.ts:941,:985,:1012,:1031`): the 4 DELETE sites become `UPDATE ... SET invalid_at = <generation>` + INSERT new (non-destructive supersede).
- **Live-view chokepoint** (Q1-C1-views, the keystone): `CREATE VIEW code_nodes_live`/`code_edges_live` `WHERE invalid_at IS NULL`, all default reads route through it, the as-of/audit reader (CG-symbol-timeline-query) deliberately bypasses.
- **Edge-lifecycle layer** (`structural-indexer.ts` edge-write): close-and-replace on relabel, ON TOP OF Q1-C1 columns (CG-edge-bitemporal-lifecycle).
- **Generation counter** (Q6-C1, dependency): maintained explicitly in a meta row in-txn, +1 per scan commit, the value stamped into `invalid_at`.

### Data Flow
A reindex finds a changed file → instead of DELETE+INSERT, the old edges are closed (`UPDATE ... SET invalid_at = <current generation>`) and new edges INSERTed in the SAME atomic transaction → the generation bumps in that same commit → default reads query `code_*_live` (`invalid_at IS NULL`) and see only current edges → an as-of read (CG-symbol-timeline-query) bypasses the view and filters by generation to reconstruct the graph at commit/generation N. A rescan of unchanged content writes nothing (apply-once G2 invariant). The schema foundation shipped (columns + migration, default-off), this runtime flow - reindex supersede, live-view reads, as-of reads - stays deferred until a consumer is named.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The cluster touches a persistence + temporal-semantics boundary (schema columns, reindex write path, a new read chokepoint), so the producer/consumer inventory is required even though it is deferred.

| Surface | Current Role | Action (deferred) | Verification |
|---------|--------------|-------------------|--------------|
| `code_edges` schema | `valid_at`/`invalid_at` present (shipped 6->7, commit `1c39235e36`, SCHEMA_VERSION now 8) | SHIPPED additively, default-off, legacy rows backfill `valid_at` from `graph_generation` | Idempotent fail-closed migration, UP/DOWN/BACKFILL + idempotency tests pass |
| reindex DELETEs (`:941,:985,:1012,:1031`) | Destructive DELETE+INSERT | `UPDATE ... SET invalid_at = <generation>` + INSERT | Superseded edge closed, not destroyed, as-of read resolves it |
| `pruneDanglingEdges()` (`:1027,:1031`) | Physical delete of dangling edges | Close-not-delete OR keep (decision: dangling = invalid window) | Dangling-prune contract `:957-968` traced before changing |
| `code_*_live` views (new) | N/A | `CREATE VIEW ... WHERE invalid_at IS NULL` - the chokepoint | All default reads query the view, grep proof |
| `code-graph-context.ts` reads (`:627-671`) | Read base tables | Route through live-view, as-of reader bypasses | Default reads use `_live`, only timeline reader bypasses |
| `structural-indexer.ts` edge-write | Delete+recreate on change | Close-and-replace (CG-edge-bitemporal-lifecycle) on Q1-C1 cols | Layered on Q1-C1, never standalone (REFUTED) |
| tombstones (`:247-260`) | Records edge deletion-history (opt-in, off) | Reconcile: tombstones already cover deletion-history | Do not duplicate, lifecycle is versioning, not deletion-log |

Required inventories (IF un-deferred):
- Same-class producers: `rg -n 'DELETE FROM code_edges|DELETE FROM code_nodes|pruneDanglingEdges|replaceEdges|replaceNodes' .` (every site that physically removes an edge).
- Consumers of changed symbols: `rg -n 'invalid_at|valid_at|code_edges_live|code_nodes_live|generation' . --glob '*.ts'` (readers must route through the live-view).
- Algorithm invariant: apply-once G2 - a rescan of unchanged content is a no-op (same edge ids, same windows, generation unchanged).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

> The schema foundation executed (columns + migration, default-off, commit `1c39235e36`), the consumer phases below remain **gated** - their deliverable is the gated plan, not execution.

### Phase 0: Gate (recorded) + schema foundation (shipped)
- [x] Confirm no as-of/time-travel consumer exists (200-iteration finding) → record DEFER
- [x] Confirm the cluster does NOT fix the real edge-staleness bug → route to sibling `002-edge-staleness-correctness`
- [x] Record standalone CG-edge-bitemporal-lifecycle as REFUTED (per-scan rebuild + tombstones, 002 iter-013)

### Phase 1: Prerequisites (deferred - separate phases)
- [ ] Q6-C1 hard generation watermark ships first (generation = the `invalid_at` value)
- [ ] CG-closed-vocab-CHECK rebuilds `edge_type` (first table-rebuild migration, pre-migration `SELECT DISTINCT edge_type` scan)

### Phase 2: Core (deferred - only IF un-deferred)
- [ ] Q1-C1 columns + Q1-C1-views co-ship atomically (ONE SCHEMA_VERSION 5->6 migration)
- [ ] Replace reindex DELETEs with `UPDATE ... SET invalid_at = <generation>` + INSERT (4 sites)
- [ ] Reconcile `code_edges` validity-window shape with Memory C3-B (shared shape, no fork)
- [ ] CG-edge-bitemporal-lifecycle: close-and-replace edge-write layered on Q1-C1 columns
- [ ] CG-symbol-timeline-query: as-of read bypassing the live-view - ONLY if a consumer is named

### Phase 3: Verification (deferred)
- [ ] apply-once G2 invariant test (no-change rescan = no-op)
- [ ] as-of read test (closed edge resolves at prior generation, non-existent generation errors)
- [ ] live-view chokepoint test (default reads see only current, bypass only in timeline reader)
- [ ] Typecheck + focused suite green, `validate.sh --strict` on this folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | apply-once G2 invariant: no-change rescan = no-op (same ids/windows/generation) | Vitest |
| Unit | non-destructive supersede: reindex UPDATEs `invalid_at`, INSERTs new, deletes nothing | Vitest |
| Unit | live-view chokepoint: default reads see only `invalid_at IS NULL`, as-of reader bypasses | Vitest |
| Unit | as-of read: closed edge resolves at prior generation, unsatisfiable generation errors | Vitest |
| Regression | edge-lifecycle layered on Q1-C1 (never standalone), tombstones not duplicated | Vitest |
| Static | reindex DELETE sites replaced (grep `DELETE FROM code_edges` returns only sanctioned sites) | rg grep gate |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| A named as-of/time-travel consumer | Product | Red (none exists) | The cluster stays DEFERRED - this is the speculative gate |
| Q6-C1 hard generation watermark | Internal | Red (not built, separate phase) | The generation is the `invalid_at` value, cannot start without it |
| CG-closed-vocab-CHECK (first table-rebuild) | Internal | Red (not built, separate phase) | Orders the edge_type rebuild before this cluster extends the table |
| Memory C3-B validity-window shape | Internal | Yellow (`007-bitemporal-window` planned) | Shared column shape, reconcile to avoid a fork |
| bi-temporal commit-time=event-time mapping | Research | Yellow (INFERRED, not traced) | Dangling-prune + cross-file CALLS resolver unverified end-to-end |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: this phase shipped only the additive schema foundation (commit `1c39235e36`), reverted via `rollbackCodeEdgeBitemporalSchema` + reverting that commit, the deferred consumers ship nothing, so their only "rollback" is a future un-defer that turns out wrong.
- **Procedure (IF the cluster is ever built and must be reverted)**: revert the single atomic SCHEMA_VERSION 5->6 migration commit, the columns are additive/nullable and the views are droppable. Because the migration is one `d.transaction()`, partial state is impossible - it either applied or it did not. The reindex write path reverts to DELETE+INSERT with the columns left in place (unread = harmless) or dropped.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 0 (Gate: DEFER) ──► [deferred] Phase 1 (Q6-C1, closed-vocab)
                                   │
                                   ▼
                          Phase 2 (Q1-C1 + Q1-C1-views ATOMIC)
                                   │
                          ┌────────┴─────────┐
                          ▼                  ▼
                  edge-lifecycle      symbol-timeline (needs a consumer)
                                   │
                                   ▼
                          Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 0 Gate (active) | None | (records DEFER) |
| 1 Prereqs (deferred) | Q6-C1, closed-vocab | Phase 2 |
| 2 Core: Q1-C1 + views (deferred) | Phase 1, named consumer | edge-lifecycle, timeline |
| 2 edge-lifecycle (deferred) | Q1-C1 columns | Verify |
| 2 symbol-timeline (deferred) | Q1-C1 columns + named consumer | Verify |
| 3 Verify (deferred) | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 0 Gate (this phase) | Low | 1-2 hours (decision + plan) |
| Phase 1 Prereqs (deferred) | High | separate phases (Q6-C1, closed-vocab) |
| Phase 2 Q1-C1 + views (deferred, M) | High | 8-12 hours (atomic migration, read-surface reroute) |
| Phase 2 edge-lifecycle (deferred, H/L) | High | 6-10 hours |
| Phase 2 symbol-timeline (deferred) | Med | 3-5 hours (only with a consumer) |
| Phase 3 Verify (deferred) | Med | 3-5 hours |
| **Total (active this phase)** | | **1-2 hours (the gate only)** |
| **Total (IF un-deferred)** | | **~20-32 hours + prerequisite phases** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist (IF un-deferred)
- [ ] Q1-C1 columns + views land as ONE atomic migration commit
- [ ] Reindex DELETE sites all rerouted to UPDATE+INSERT (grep proof)
- [ ] apply-once G2 invariant test green before any further layering

### Rollback Procedure (IF built)
1. Revert the single SCHEMA_VERSION 5->6 migration commit
2. Reindex write path returns to DELETE+INSERT
3. Re-run focused reindex/read suite + the DELETE-site grep
4. Leave additive columns in place (unread) or drop the views - both forward-compatible

### Data Reversal
- **Has data migrations?** Yes (additive `valid_at`/`invalid_at` columns + views) - but only IF un-deferred.
- **Reversal procedure**: columns nullable/unread until a consumer opts in, views droppable, no down-migration unless a consumer began writing the validity window.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌────────────────────┐     ┌──────────────┐
│  Phase 0     │────►│  Phase 1 Prereqs   │────►│ Phase 2 Core │
│  Gate: DEFER │     │  Q6-C1, closed-vocab│     │ Q1-C1 + views│
└──────────────┘     └────────────────────┘     └──────┬───────┘
                                                         │
                                            ┌────────────┴────────────┐
                                            ▼                         ▼
                                  edge-lifecycle (on cols)   symbol-timeline (consumer)
                                            │                         │
                                            └───────────┬─────────────┘
                                                        ▼
                                                  Phase 3 Verify
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Q6-C1 generation (prereq) | - | the `invalid_at` value | Q1-C1 |
| CG-closed-vocab-CHECK (prereq) | - | rebuilt `edge_type` table | Q1-C1 (extends the rebuilt table) |
| Q1-C1 columns | Q6-C1, closed-vocab | validity window | edge-lifecycle, timeline |
| Q1-C1-views (keystone) | Q1-C1 columns | current-view chokepoint | all default reads |
| CG-edge-bitemporal-lifecycle | Q1-C1 columns | edge-granularity versioning | nothing (standalone REFUTED) |
| CG-symbol-timeline-query | Q1-C1 columns + named consumer | as-of read | nothing |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 0 Gate** - 1-2 hours - CRITICAL (the DEFER decision, the only active work)
2. **[deferred] Q6-C1 generation** - separate phase - CRITICAL prerequisite
3. **[deferred] Q1-C1 + views (ATOMIC)** - 8-12 hours - CRITICAL (the keystone co-ship)
4. **[deferred] Verification** - 3-5 hours - CRITICAL

**Total Critical Path (active)**: ~1-2 hours (the gate). **IF un-deferred**: ~20-32 hours + prerequisite phases.

**Parallel Opportunities (IF un-deferred)**:
- The Memory C3-B shape reconciliation can proceed alongside Q6-C1
- The symbol-timeline read can be scoped (not built) while Q1-C1 lands, pending a named consumer
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M0 | DEFER decision recorded | Cluster STATUS = PENDING (gated), no migration shipped | Phase 0 (this phase) |
| M1 | Prereqs shipped (deferred) | Q6-C1 + closed-vocab landed | Phase 1 |
| M2 | Q1-C1 + views atomic (deferred) | One migration, reindex UPDATEs not DELETEs, G2 invariant | Phase 2 |
| M3 | Edge-lifecycle layered (deferred) | Close-and-replace on Q1-C1 cols, standalone never attempted | Phase 2 |
| M4 | Verified (deferred) | as-of read + live-view tests + `validate.sh --strict` green | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the full ADRs. Headlines: (ADR-001) the whole cluster is DEFER-speculative - no as-of consumer, safety redundant with the readiness gate, does not fix the real staleness bug, (ADR-002) Q1-C1 + Q1-C1-views MUST co-ship atomically through one reindex transaction, with the live-view as the read chokepoint that localizes the migration, (ADR-003) standalone CG-edge-bitemporal-lifecycle is REFUTED (per-scan rebuild + tombstones) - it survives only as a layer on Q1-C1 columns, (ADR-004) the `code_edges` validity-window shape is shared with Memory C3-B (build once, reconcile, do not fork).
