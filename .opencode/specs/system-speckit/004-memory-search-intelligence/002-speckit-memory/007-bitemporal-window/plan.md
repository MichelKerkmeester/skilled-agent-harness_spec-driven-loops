---
title: "Implementation Plan: Bi-temporal Window for Spec-Kit Memory Causal + Lineage"
description: "Ship the reader-transparent event-time fact-invalidation spearhead first, then the additive four-timestamp window (C3-B) on causal + lineage, chronology-scoped supersession (GR-temporal-ordering-invalidation) and the C3-D separation-of-concerns note - referencing the already-shipped skip-closed-in-sweep guard."
trigger_phrases:
  - "bitemporal window memory plan"
  - "event-time invalidation plan"
  - "four timestamp window sequencing"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/007-bitemporal-window"
    last_updated_at: "2026-07-04T17:51:08.870Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author bi-temporal-window plan from 028/001 research"
    next_safe_action: "Implement MEM-fact-invalidation-event-time spearhead (single-site)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-007-bitemporal-window"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Bi-temporal Window for Spec-Kit Memory Causal + Lineage

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node, better-sqlite3) |
| **Framework** | Spec-Kit Memory MCP server (`.opencode/skills/system-spec-kit/mcp_server/`) |
| **Storage** | SQLite - `causal_edges` table + lineage store, `active_memory_projection` is the live current-store |
| **Testing** | Vitest (focused causal/temporal suites alongside each change) |

### Overview
Ship four candidates against the causal + lineage temporal substrate, plus reference one already-shipped guard. The spearhead (`MEM-fact-invalidation-event-time`) is a single-site, reader-transparent writer change at `invalidateEdge()`. The four-timestamp window (C3-B) is the additive schema substrate the rest sits on, chronology-scoped supersession (`GR-temporal-ordering-invalidation`) and the C3-D separation note follow. Lineage is the canonical event-time writer, causal `invalid_at` is a derived projection, retention TTL is excluded.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Seams confirmed: `temporal-edges.ts:81,86,94` (writer), readers on `IS NULL`, `frontmatter-promoter.ts` `openEdgeClause` (shipped)
- [ ] Canonical event-time source decided (lineage) and recorded in decision-record.md
- [ ] C3-B additivity question against `active_memory_projection` flagged as build-time confirm

### Definition of Done
- [ ] Spearhead: event-time close written, readers unchanged (grep proof), fail-open preserved
- [x] C3-B: four columns (`valid_from`/`valid_to`/`ingested_at`/`expired_at`) declared in v38 migration, existing readers byte-identical (still filter `invalid_at IS NULL`), UP/BACKFILL/DOWN + idempotency tests pass
- [ ] `GR-temporal-ordering`: scoped to conflicting pairs, co-valid non-conflicting test green
- [ ] C3-D note recorded, skip-closed verified intact
- [ ] Typecheck + focused tests green, `validate.sh --strict` passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive substrate evolution behind a reader-transparent writer change - no read-path rewrite for the spearhead, schema columns added once and consumed lazily.

### Key Components
- **`invalidateEdge()`** (`lib/graph/temporal-edges.ts:68-101`): the spearhead site - derive the close timestamp from lineage event-time instead of `new Date().toISOString()`.
- **Schema declaration** (`lib/search/vector-index-schema.ts:184-185`): the single point where the four-timestamp window is declared, reconciling causal-edge and lineage column shapes (unify, do not fork).
- **`contradiction-detection.ts`** (`:75-77,99-110`): the conflicting-pair detector that `GR-temporal-ordering-invalidation` extends with chronology.
- **`active_memory_projection`**: the live current-memory read store (the real "current" store, C3-C "Current"-replaces-projection is out of scope, L effort).

### Data Flow
A new fact supersedes an old causal edge → lineage records its event-time → `invalidateEdge()` stamps the old edge's close column with that lineage event-time (not `now()`) → readers filter `invalid_at IS NULL` unchanged → "as of date X" lineage queries read correct belief-state. Chronology invalidation, when two conflicting same-pair edges exist, closes the earlier `valid_at` by the same writer path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The spearhead touches a persistence + temporal-semantics boundary (schema column, edge-close writer), so the producer/consumer inventory is required.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `invalidateEdge()` (`temporal-edges.ts:68-101`) | Writer: stamps `invalid_at = now()` | Update: stamp lineage event-time, fall back to `now()` | Unit test on close column value + fallback |
| `getValidEdgesForNode` (`temporal-edges.ts:108-138`) | Reader: `WHERE ... invalid_at IS NULL` | Unchanged (reader-transparent) | grep proof: still `IS NULL`, no `< now()` |
| `contradiction-detection.ts:75-77,99-110` | Reader + auto-invalidation on conflicting pairs | Update: add chronology scoped to conflicting pairs | Test: earlier-valid_at closed, co-valid untouched |
| `frontmatter-promoter.ts` `openEdgeClause` | Cleanup: `AND invalid_at IS NULL` (SHIPPED) | Unchanged, verify intact | Closed-edge fixture not re-touched |
| `vector-index-schema.ts:184-185` | Schema: single `valid_at`/`invalid_at` pair | Update: declare four-timestamp window additively | Existing readers byte-identical, additivity confirmed |
| `active_memory_projection` consumers | Live current store | Not a consumer this phase (C3-C deferred) | Confirm no projection reshape needed for spearhead |

Required inventories:
- Same-class producers: `rg -n 'invalid_at = |invalidateEdge|new Date\(\).toISOString' lib/graph lib/causal`.
- Consumers of changed symbols: `rg -n 'invalid_at|valid_at|valid_from|valid_to|ingested_at|expired_at' . --glob '*.ts' --glob '*.md'`.
- Algorithm invariant: a current-edge read must remain `invalid_at IS NULL` only, closing an edge must write the correct event-time exactly once and be a no-op if already closed.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm writer/reader seams and the shipped skip-closed clause
- [ ] Decide and record the canonical event-time source (lineage)
- [ ] Confirm whether lineage already carries `valid_from`/`valid_to`/`ingested_at` (only `expired_at` missing per research)

### Phase 2: Core Implementation
- [ ] Spearhead `MEM-fact-invalidation-event-time`: derive close timestamp from lineage event-time at `invalidateEdge()`, fail-open to `now()`
- [x] C3-B: four-timestamp window declared additively in v38 schema, existing readers kept byte-identical (legacy `valid_at`/`invalid_at` preserved)
- [ ] `GR-temporal-ordering-invalidation`: chronology-driven auto-invalidation scoped to conflicting/superseding pairs
- [ ] C3-D: record the tombstone-sweep vs temporal-close separation note, verify skip-closed guard intact

### Phase 3: Verification
- [ ] Event-time close + fallback test, reader-transparency grep
- [ ] Four-timestamp additivity test, chronology scope test (co-valid untouched)
- [ ] Typecheck + focused suite green, `validate.sh --strict` on this folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `invalidateEdge()` event-time close + fail-open fallback | Vitest |
| Unit | four-timestamp additivity (existing `IS NULL` readers unchanged) | Vitest |
| Unit | chronology invalidation scoped to conflicting pairs (co-valid untouched) | Vitest |
| Regression | skip-closed-in-sweep: closed generated edge not re-touched | Vitest (fixture) |
| Static | reader-transparency: no `invalid_at < now()` reader introduced | rg grep gate |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| C3-B four-timestamp window | Internal | Yellow (additivity unverified) | Gates C3-A live retirement (later phase) + Code-Graph Q1-C1 column shape (sibling), spearhead independent |
| lineage canonical event-time writer | Internal | Green (decision recorded) | Spearhead sources the wrong time if not lineage |
| `SPECKIT_TEMPLATE_EDGES` flag | Internal | Green (already ON) | None - spearhead does not depend on a flip |
| skip-closed-in-sweep | Internal | Green (SHIPPED `e1c6a3c793`) | Defensive hardening only, not a gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: reader-transparency breaks, a focused test regresses or the C3-B migration proves non-additive against `active_memory_projection`.
- **Procedure**: revert the per-candidate scoped commit (each candidate is an independent, reversible hunk), the spearhead and C3-B land as separate commits so either reverts alone. Additive columns are forward-compatible (left in place, unread) if only the writer change is reverted.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
                       │
   spearhead (independent of C3-B) ──┐
   C3-B window ──► GR-temporal-ordering (full form)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core: spearhead | Setup | Verify |
| Core: C3-B | Setup | GR-temporal-ordering (full), Verify |
| Core: GR-temporal-ordering | C3-B (for full form) | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core: spearhead (H/S) | Low | 2-3 hours |
| Core: C3-B (M, additive schema) | Med | 4-6 hours |
| Core: GR-temporal-ordering (H/S) | Med | 2-4 hours |
| Verification | Med | 2-3 hours |
| **Total** | | **11-18 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Each candidate is a separate scoped commit
- [ ] No reader added that compares `invalid_at` to a clock
- [ ] Additive columns confirmed forward-compatible

### Rollback Procedure
1. Identify the regressing candidate's scoped commit
2. `git revert` that commit (hunks are separable)
3. Re-run focused causal/temporal suite + reader-transparency grep
4. Leave additive columns in place if only the writer reverts (unread = harmless)

### Data Reversal
- **Has data migrations?** Yes (C3-B additive columns).
- **Reversal procedure**: additive columns are nullable and unread until a consumer opts in, no down-migration needed unless a consumer began writing them.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Phase 1    │────►│  Phase 2 Core    │────►│  Phase 3    │
│  Setup      │     │  spearhead/C3-B  │     │  Verify     │
└─────────────┘     └────────┬─────────┘     └─────────────┘
                             │
                   ┌─────────▼──────────┐
                   │ GR-temporal-order  │
                   │ (full form on C3-B)│
                   └────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| spearhead (event-time close) | lineage event-time | correct close timestamps | nothing (independent) |
| C3-B (four-timestamp window) | schema reconciliation | bi-temporal substrate | GR-temporal (full), C3-A (later), CG Q1-C1 shape |
| GR-temporal-ordering | C3-B (full form) | chronology supersession | nothing |
| C3-D note | skip-closed (shipped) | separation-of-concerns clarity | C3-A scoping |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 Setup** - 1-2 hours - CRITICAL
2. **Core: spearhead** - 2-3 hours - CRITICAL (the H/S correctness win)
3. **Core: C3-B window** - 4-6 hours - CRITICAL (substrate for the rest)
4. **Verification** - 2-3 hours - CRITICAL

**Total Critical Path**: ~9-14 hours

**Parallel Opportunities**:
- The C3-D decision note can be authored while the spearhead is implemented
- `GR-temporal-ordering` tests can be written against fixtures before C3-B's full additivity lands
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Spearhead shipped | Event-time close + fail-open + reader-transparency grep | Phase 2 |
| M2 | C3-B window additive | Four columns declared, existing readers byte-identical | Phase 2 |
| M3 | Chronology supersession scoped | Conflicting-pair invalidation, co-valid untouched | Phase 2 |
| M4 | Phase verified | Typecheck + focused suite + `validate.sh --strict` green | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the full ADRs. Headlines: (ADR-001) lineage is the canonical event-time writer, causal `invalid_at` is a derived projection, (ADR-002) retention TTL is EXCLUDED from the bi-temporal consumer set, (ADR-003) tombstone-sweep and temporal-close are separate concerns (C3-D) and skip-closed ships as defensive hardening, not a data-loss gate.
