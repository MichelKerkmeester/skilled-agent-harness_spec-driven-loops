---
title: "Implementation Plan: memory_save Replay Enrichment Repair"
description: "Add a durable per-row enrichment-completion marker (schema v30), record it across the save path, and repair incomplete markers idempotently on dedup replay and under the scan lease."
trigger_phrases:
  - "memory_save enrichment repair plan"
  - "schema v30 marker migration"
  - "enrichment-state helpers"
  - "repair on replay scan lease"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/004-memory-save-enrichment-repair"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored enrichment-repair packet plan from follow-up research"
    next_safe_action: "Implement schema v30 marker + repair-on-replay via gpt-5.5-fast xhigh"
    blockers: []
    key_files:
      - "mcp_server/lib/search/vector-index-schema.ts"
      - "mcp_server/handlers/memory-save.ts"
      - "mcp_server/handlers/save/enrichment-state.ts"
      - "mcp_server/handlers/memory-index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "enrichment-repair-packet-setup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: memory_save Replay Enrichment Repair

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

> Line anchors below are from the research read of `main` and are **approximate**. The implementer MUST locate each site by the described function/behavior and read surrounding code first - do not edit by blind line number.

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js MCP server) |
| **Framework** | mk-spec-memory MCP server (better-sqlite3) |
| **Storage** | SQLite (shared memory DB, schema-versioned) |
| **Testing** | vitest (`cd mcp_server && npx vitest run`) |

### Overview
Add a durable, per-row marker recording whether post-insert enrichment completed. Write `pending` inside the same transaction that commits the primary row (so the marker can never be lost relative to the row), then record the outcome (`complete`/`partial`/`failed`/`deferred`) after enrichment runs. Teach the dedup replay return path and the scan lease to detect a non-`complete` marker and run idempotent repair.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md authored, replay hole identified).
- [ ] Success criteria measurable (marker lifecycle + idempotent repair + bounded backfill).
- [ ] Dependencies identified (deploy gate; integration with packet 005 in `memory-index.ts`).

### Definition of Done
- [ ] All acceptance criteria met (REQ-001..REQ-007).
- [ ] New + affected vitest suites passing; scoped typecheck has no new errors.
- [ ] Docs updated (spec/plan/tasks/checklist/decision-record/implementation-summary synchronized).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Marker-and-repair over a schema-versioned SQLite store: a durable completion flag committed atomically with the primary row, plus idempotent repair driven from two call sites (dedup replay and scan backfill).

### Key Components
- **Schema v30 marker columns** (`lib/search/vector-index-schema.ts`): four narrow, defaulted columns plus a partial index on incomplete rows.
- **`enrichment-state.ts` helpers** (`handlers/save/`): synchronous marker reads/writes and async repair that reuses the existing enrichment machinery.
- **Save-path wiring** (`handlers/memory-save.ts`): marks `pending` in-transaction, records the result after enrichment, repairs on dedup replay returns.
- **Scan-lease backfill** (`handlers/memory-index.ts`): bounded repair of incomplete markers, count surfaced in the scan response.

### Data Flow
On save: primary row + `pending` marker commit atomically → `runPostInsertEnrichmentIfEnabled()` runs → `recordEnrichmentResult` flips the marker to `complete`/`partial`/`failed`/`deferred`. On replay: dedup returns a row id → `needsEnrichmentRepair` checks the marker → `repairEnrichmentOnReplay` re-runs only missing steps and records the result. On scan: `repairIncompleteMarkers({ limit })` processes a bounded set of non-`complete` rows under the lease.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet fixes a persistence/replay-idempotency bug and bumps a schema boundary, so the affected-surfaces inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/search/vector-index-schema.ts` (SCHEMA_VERSION, fresh schema, migrations) | Owns schema version + column definitions for both fresh and upgrade paths | update | Migration test: fresh DB + v29→v30 upgrade land identical columns/index |
| `handlers/save/enrichment-state.ts` (new marker helpers) | Owns marker reads/writes + repair entrypoints | create | Unit tests for each helper; reuse of `runPostInsertEnrichmentIfEnabled()` |
| `handlers/save/post-insert.ts` (`runPostInsertEnrichmentIfEnabled`) | Existing enrichment machinery reused by repair | unchanged (consumer of, not modified) | grep confirms repair imports it; no duplicated enrichment logic |
| `handlers/memory-save.ts` (primary txn + dedup returns) | Produces the marker and triggers replay repair | update | Save-path + replay-repair tests |
| `handlers/save/dedup.ts` (dedup pre-check helpers) | Returns the `unchanged`/`duplicate` verdict + row id | unchanged (stays synchronous) | grep confirms helpers stay sync; repair runs in the async caller |
| `handlers/memory-index.ts` (scan lease, lines 249-333) | Hosts the bounded backfill repair; also edited by packet 005 | update (additive, distinct region) | Scan backfill test + report-count assertion |

Required inventories:
- Same-class producers: `rg -n 'SCHEMA_VERSION|post_insert_enrichment' mcp_server/lib/search/vector-index-schema.ts`.
- Consumers of changed symbols: `rg -n 'runPostInsertEnrichmentIfEnabled|post_insert_enrichment_status|needsEnrichmentRepair' mcp_server --glob '*.ts'`.
- Matrix axes: marker status ∈ {pending, complete, partial, failed, deferred} × replay class ∈ {unchanged, duplicate} × repair source ∈ {replay, backfill}.
- Algorithm invariant: repair is idempotent - causal/graph edges use upsert/dedup, FTS/vector rows are replaced not appended, so N repairs equal one repair.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Schema foundation: bump `SCHEMA_VERSION` 29 → 30 (~line 427).
- [ ] Add the 4 marker columns to the fresh-schema definition (~lines 2408-2470): `post_insert_enrichment_status TEXT NOT NULL DEFAULT 'complete'`, `post_insert_enrichment_state TEXT`, `post_insert_enrichment_completed_at TEXT`, `post_insert_enrichment_version INTEGER`.
- [ ] Add an idempotent v30 migration block (~lines 439-599): guarded `ALTER TABLE ADD COLUMN` per marker column + a partial index on `post_insert_enrichment_status != 'complete'`. Fresh-schema and migration paths declare the SAME columns.

### Phase 2: Core Implementation
- [ ] Create `handlers/save/enrichment-state.ts` with `markEnrichmentPending`, `recordEnrichmentResult`, `needsEnrichmentRepair`, `repairEnrichmentOnReplay`, `repairIncompleteMarkers`. Marker helpers stay synchronous; repair functions await enrichment and reuse `runPostInsertEnrichmentIfEnabled()` (`handlers/save/post-insert.ts`) - no duplicated enrichment logic.
- [ ] Save path (`handlers/memory-save.ts`): inside the primary write transaction (~lines 2500-2604) call `markEnrichmentPending(...)` for the new memory id; immediately after `runPostInsertEnrichmentIfEnabled()` returns (~lines 2648-2655) call `recordEnrichmentResult(...)`; on the `duplicatePrecheck` replay return (~lines 2333-2343) and the `dupResult` replay return (~lines 2487-2497), if a row id is present and `needsEnrichmentRepair`, call `repairEnrichmentOnReplay` before returning. Keep `dedup.ts` helpers synchronous.
- [ ] Scan backfill (`handlers/memory-index.ts`): under the existing scan lease (~lines 249-333) call `repairIncompleteMarkers(deps, { limit })` with a bounded limit and surface the repair count in the scan response. Keep this edit additive and in a distinct region from any packet 005 sentinel check.

### Phase 3: Verification
- [ ] Run new + affected vitest suites (all green).
- [ ] Scoped typecheck of touched TS (no new errors).
- [ ] Fill `implementation-summary.md` (what shipped, evidence, deploy-gated note) and run `validate.sh --strict`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (migration) | v30 fresh DB has columns + partial index; v29→v30 upgrade is idempotent (run twice) | vitest |
| Unit (save path) | `pending` present mid-transaction, `complete` after enrichment | vitest |
| Unit (replay repair) | `unchanged` and `duplicate` dedup returns with a `pending` marker trigger repair → `complete` | vitest |
| Unit (no-op + deferred) | `complete` marker untouched (stable edge/row counts); `deferred` not repaired on normal replay | vitest |
| Unit (backfill + idempotency) | `memory_index_scan` repairs a `pending` marker under the lease and reports the count; repairing twice yields identical FTS/vector/graph state | vitest |
| Manual | Scoped typecheck of touched TS against throwaway test DBs only | npx tsc --noEmit (scoped) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `runPostInsertEnrichmentIfEnabled()` (`handlers/save/post-insert.ts`) | Internal | Green | Repair reuses it; if its signature changes, repair wiring must follow |
| Packet 005 edit to `memory-index.ts` (lines 249-333) | Internal | Yellow | Same file; keep this edit additive + distinct to avoid merge conflicts |
| Separate confirmed daemon deploy (runs v30 migration on shared DB) | External | Red (intentionally gated) | Production stays on v29 until confirmed; feature ships disabled-by-deploy |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Repair produces duplicate edges/rows, save-latency regresses, or the v30 migration misbehaves on upgrade.
- **Procedure**: Because production is never deployed in this packet, rollback is `git revert` of the branch before any deploy. If a deploy already ran, the marker columns are additive and defaulted to `complete`, so reverting the code leaves the columns inert (no reads), and the partial index can be dropped independently.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Schema v30) ──► Phase 2 (Helpers + Save wiring + Scan backfill) ──► Phase 3 (Tests + Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Schema v30 | None | Helpers, Save wiring, Backfill |
| Marker helpers | Schema v30 | Save wiring, Backfill |
| Save wiring | Helpers | Tests |
| Scan backfill | Helpers | Tests |
| Tests + Verify | Save wiring, Backfill | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Schema v30 (columns + migration + index) | Med | 2-3 hours |
| Helpers + save wiring + scan backfill | High | 4-6 hours |
| Tests (7 scenarios) + verify | Med | 3-4 hours |
| **Total** | | **9-13 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Branch implemented and unit-tested against throwaway DBs only (no live migration).
- [ ] Deploy window confirmed separately before the v30 migration touches the shared DB.
- [ ] Concurrent v29 sessions drained or upgrade confirmed safe under the single-writer lease.

### Rollback Procedure
1. Before deploy: `git revert` the branch - no production impact (production is still on v29).
2. After deploy: revert the code; marker columns are additive + default `complete` so they sit inert with no readers.
3. Drop the partial index on `post_insert_enrichment_status != 'complete'` if it must be removed.
4. Verify: smoke-test `memory_save` + `memory_index_scan` on the reverted build.

### Data Reversal
- **Has data migrations?** Yes (v30 ALTER TABLE ADD COLUMN + partial index).
- **Reversal procedure**: Columns are additive and defaulted; leaving them is safe. To fully reverse, drop the partial index; the added columns can remain unused without affecting v29 behavior.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────────────┐     ┌─────────────┐
│  Schema v30 │────►│  enrichment-state.ts │────►│   Tests +   │
│  (columns)  │     │  (helpers + repair)  │     │   Verify    │
└─────────────┘     └──────────┬───────────┘     └─────────────┘
                              │
                  ┌───────────┴───────────┐
                  ▼                       ▼
            ┌───────────┐           ┌───────────┐
            │ memory-   │           │ memory-   │
            │ save.ts   │           │ index.ts  │
            │ wiring    │           │ backfill  │
            └───────────┘           └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Schema v30 | None | Marker columns + partial index | Helpers, Save wiring, Backfill |
| enrichment-state.ts | Schema v30 | Marker helpers + repair | Save wiring, Backfill |
| memory-save.ts wiring | enrichment-state.ts | pending/record/replay-repair | Tests |
| memory-index.ts backfill | enrichment-state.ts | Bounded repair + count | Tests |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Schema v30 (columns + migration + index)** - 2-3 hours - CRITICAL
2. **enrichment-state.ts helpers + repair** - 3-4 hours - CRITICAL
3. **memory-save.ts wiring + tests** - 4-6 hours - CRITICAL

**Total Critical Path**: 9-13 hours

**Parallel Opportunities**:
- `memory-save.ts` wiring and `memory-index.ts` backfill can be implemented in parallel once `enrichment-state.ts` exists.
- Migration tests and save-path tests can be authored in parallel after the schema lands.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Schema v30 landed | Fresh + upgrade fixtures land identical columns/index; migration idempotent | Phase 1 |
| M2 | Helpers + wiring done | Save marks pending/complete; replay repairs `pending` rows | Phase 2 |
| M3 | Verified + deploy-gated | All suites green; `validate.sh --strict` passes; deploy left as a separate step | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Durable marker + repair-on-replay

**Status**: Accepted

**Context**: The primary row commits before secondary enrichment runs; a kill in that window leaves a committed-but-unenriched row that dedup replay never repairs. Full ADRs are in `decision-record.md`.

**Decision**: Add a durable completion marker, write `pending` inside the primary transaction, and repair non-`complete` markers idempotently on dedup replay plus a bounded scan-lease backfill.

**Consequences**:
- Keeps the current latency model (only a cheap marker write joins the transaction) and repairs exactly the replay hole.
- One schema version bump (29 → 30); repair must be idempotent because both replay and backfill can run it.

**Alternatives Rejected**:
- Move enrichment into the primary transaction: holds the SQLite writer through async enrichment, a real save-latency/writer-contention regression.
- Scan-only backfill (no replay repair): leaves the row unenriched until the next scan; folded in as the secondary safety net instead.
