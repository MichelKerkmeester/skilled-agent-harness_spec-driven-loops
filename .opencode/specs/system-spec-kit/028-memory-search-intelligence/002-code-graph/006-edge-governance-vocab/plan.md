---
title: "Implementation Plan: Code-Graph Edge Write-Time Governance (closed-vocab CHECK done; siblings deferred)"
description: "Closed-vocab edge_type CHECK shipped as the anchor: default-off opt-in migration behind SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB, pre-rebuild DISTINCT vocab scan, table rebuild, SCHEMA_VERSION 7->8, and focused tests. The three additive siblings (per-run churn cap, audit-subgraph extension, derived-clock prune tiebreak) remain deferred."
trigger_phrases:
  - "edge governance plan"
  - "edge_type CHECK table rebuild migration"
  - "heuristic churn cap plan"
  - "tombstone audit extension"
  - "derived clock tiebreak plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/006-edge-governance-vocab"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented closed-vocab edge_type CHECK migration and tests"
    next_safe_action: "Keep automatic CHECK rollout disabled until owner approval"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-006-edge-governance-vocab"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Code-Graph Edge Write-Time Governance (closed-vocab CHECK done; siblings deferred)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node, better-sqlite3) |
| **Framework** | mk-code-index MCP server (`system-code-graph`) |
| **Storage** | SQLite (WAL singleton; `code_edges`, `code_graph_tombstones`, `schema_version`) |
| **Testing** | Vitest (`mcp_server/tests/*.vitest.ts`) |

### Overview
Four units govern edge writes at the source, anchored by `CG-closed-vocab-check`. The anchor is now implemented: a default-off opt-in migration adds a driver-level `CHECK (edge_type IN (...))` to `code_edges` through a table rebuild, after a mandatory pre-rebuild `SELECT DISTINCT edge_type` scan across live edges and nullable tombstone rows. It co-admits `SUPERSEDES`, preserves sibling 004's `valid_at` / `invalid_at` columns, recreates edge indexes, and bumps `SCHEMA_VERSION` from 7 to 8. The three deferred siblings are additive: a per-run churn cap at the two heuristic edge-write sites (`structural-indexer.ts:1146`, `:2058`), an extension of the `code_graph_tombstones` precursor with creation/relabel audit events + retention, and a derived supersession-winner key replacing the rowid-arrival-order prune tiebreak (`:279`, `:1493`).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §2-3)
- [x] Success criteria measurable (spec.md §5, SC-001..006)
- [x] Dependencies identified (sibling Q1-C2 `SUPERSEDES`; tombstone machinery; `edge-drift.ts`)

### Definition of Done
- [x] Closed-vocab acceptance criteria met (REQ-001..004); REQ-005..007 deferred as sibling behavior units
- [x] Tests passing for migration round-trip, CHECK enforcement, pre-scan abort, default-off flag, rollback, and rerun
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Schema-migration anchor + additive write-time governors over a single serialized SQLite WAL connection.

### Key Components
- **Closed-vocab migration (Unit 1)**: DONE as a default-off table-rebuild migration in `code-graph-db.ts` adding `CHECK (edge_type IN (10 relations + SUPERSEDES))`, gated by a pre-migration DISTINCT scan, bumping `SCHEMA_VERSION` to 8.
- **Heuristic churn cap (Unit 2)**: DEFERRED per-run counter at the cross-file `CALLS` (`structural-indexer.ts:1146`) and `TESTED_BY` (`:2058`) write sites, integrated with `edge-drift.ts`.
- **Audit-subgraph extension (Unit 3)**: DEFERRED creation/relabel event rows + durable retention on the existing `code_graph_tombstones` store (`:250-262`), queryable by subject/kind/time.
- **Derived-clock tiebreak (Unit 4)**: DEFERRED replacement for `ORDER BY deleted_at DESC, id DESC` (`:279`, `:1493`) with `argmax over (valid_from DESC, object_canonical ASC)`.

### Data Flow
Scan → structural-indexer derives edges (heuristic sites now capped) → `code-graph-db` writes edges (now CHECK-constrained on `edge_type`) → governance ops write creation/relabel/deletion audit events to the extended tombstone store → prune selects the supersession winner via the derived key, deterministically.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `code_edges.edge_type` schema (`code-graph-db.ts:184`) | `TEXT NOT NULL`, no CHECK — vocab held only by writer discipline | DONE: opt-in CHECK via table-rebuild | CHECK-rejection test |
| `ensureSchemaMigrations` (`code-graph-db.ts:450`) | sibling 004 migration pattern at schema version 7 | DONE: opt-in table rebuild + `SCHEMA_VERSION` 7->8 | round-trip row-count test; version-row assertion |
| `parser_skip_list` CHECK (`code-graph-db.ts:208`) | the existing CHECK pattern to mirror | unchanged (reference) | `grep -n "CHECK (error_class" code-graph-db.ts` |
| `indexer-types.ts:20-22` edge relations union | the 10-relation source of truth | DONE: `EDGE_TYPES` runtime tuple + derived `EdgeType` union, admitting `SUPERSEDES` | focused governance test |
| heuristic `CALLS` write (`structural-indexer.ts:1146`) | uncapped INFERRED edge write (conf 0.8) | DEFERRED (per-run cap) | future cap-bound test |
| heuristic `TESTED_BY` write (`structural-indexer.ts:2058`) | uncapped AMBIGUOUS edge write (conf 0.6) | DEFERRED (per-run cap) | future cap-bound test |
| `code_graph_tombstones` store (`code-graph-db.ts:250-262`) | deletion-only, default-OFF, pruned-to-100 | DEFERRED (extend: creation/relabel events + retention) | future audit creation/relabel query test |
| prune tiebreak (`code-graph-db.ts:279`, `:1493`) | `ORDER BY deleted_at DESC, id DESC` (arrival-order) | DEFERRED (derived supersession key) | future re-ordered-insert determinism test |
| sibling Q1-C2 `SUPERSEDES` emitter (`002-edge-staleness-correctness`) | will emit a new edge type | not a consumer here — this phase only admits the type | vocab list includes `SUPERSEDES` |

Required inventories:
- Same-class producers: `rg -n "edge_type" .opencode/skills/system-code-graph/mcp_server/lib` (every writer that sets `edge_type` must use a vocab value the CHECK admits).
- Consumers of changed symbols: `rg -n "edge_type|edgeType|SUPERSEDES|deleted_at DESC" .opencode/skills/system-code-graph --glob '*.ts'`.
- Matrix axes: DONE for {edge_type in vocab vs out-of-vocab} × {code_edges row vs nullable tombstone row} × {empty/init path vs populated} for the migration; deferred for {below cap vs at cap vs over cap} churn and {arrival-order A vs arrival-order B} derived clock.
- Algorithm invariant (migration): all-or-nothing — either the old table or the new CHECK'd table, never a half-rebuild; the pre-scan must enumerate ALL live `edge_type` values (incl. nullable tombstone) before any destructive step.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup — vocab scan + migration scaffold (Unit 1 prereq)
- [x] Define the closed vocabulary constant (10 relations + `SUPERSEDES`) co-located with / synced to `indexer-types.ts:20-22`.
- [x] Implement the pre-migration `SELECT DISTINCT edge_type` scan (incl. nullable `tombstone.edge_type`, `:256`); decide map/repair vs abort policy for any out-of-vocab value.
- [x] Run the scan against a live DB (the iter-024 "no risk" gap) — actual DISTINCT set recorded in `tasks.md` and `implementation-summary.md`.

### Phase 2: Core Implementation
- [x] **Unit 1**: table-rebuild migration adding `CHECK (edge_type IN (...))` to `code_edges` (mirror `parser_skip_list` CHECK `:208`); recreate indexes (`:221-223`); bump `SCHEMA_VERSION` from 7 to 8; all-or-nothing transaction.
- [ ] **Unit 2 DEFERRED**: per-run churn cap at `structural-indexer.ts:1146` (CALLS) and `:2058` (TESTED_BY); integrate with `edge-drift.ts`; defer/flag the per-pair revision cap (no cross-scan edge identity).
- [ ] **Unit 3 DEFERRED**: extend `code_graph_tombstones` (`:250-262`) with creation/relabel audit events + durable retention; queryable by subject/kind/time.
- [ ] **Unit 4 DEFERRED**: replace the prune tiebreak `ORDER BY deleted_at DESC, id DESC` (`:279`, `:1493`) with `argmax over (valid_from DESC, object_canonical ASC)`.

### Phase 3: Verification
- [x] Migration round-trip (N edges before == after; CHECK rejects out-of-vocab; admits all 10 + `SUPERSEDES`; pre-scan abort on a seeded out-of-vocab row).
- [ ] DEFERRED Churn-cap bound test; audit creation/relabel query test; derived-clock re-ordered-insert determinism test.
- [x] `validate.sh --strict` on this folder; typecheck + focused code-graph schema/migration suites green.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | pre-migration DISTINCT scan; CHECK admit/reject vocab; derived-clock key on a tombstone set; churn-cap counter | Vitest |
| Integration | table-rebuild round-trip (populated + empty + nullable-tombstone-row DB); migration abort on out-of-vocab; audit creation/relabel write+query; `SCHEMA_VERSION` advance | Vitest + in-memory/temp SQLite |
| Manual | run the pre-migration DISTINCT scan against a real `~/.../code_graph` DB to confirm the live vocabulary before promising the rebuild safe | sqlite3 / node REPL |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Sibling phase `002-edge-staleness-correctness` (Q1-C2 `SUPERSEDES`) | Internal | Yellow (sibling drafted) | Closed vocab must admit `SUPERSEDES`; coordinate the list or a 2nd migration is needed |
| Tombstone machinery (`code-graph-db.ts:230-262`) | Internal | Green (present, default-OFF) | Substrate for Units 3 + 4 — must extend, not replace |
| `edge-drift.ts` | Internal | Green (present) | Integration point for the Unit 2 churn cap |
| Live DB DISTINCT-vocab evidence | Internal | Green (verified 2026-06-19) | Read-only scan found only in-vocab live edge types and no tombstone edge rows |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: migration aborts mid-rebuild, an unexpected out-of-vocab value, or a round-trip row-count mismatch.
- **Procedure**: the rebuild runs in one transaction — an abort leaves the original `code_edges` intact and `SCHEMA_VERSION` un-advanced; for a committed-but-regretted migration, restore from the pre-rebuild table copy and revert the version row. Units 2-4 are additive and individually `git revert`-able.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (vocab scan + scaffold) ──► Phase 2 (Unit 1 migration)
                                          │
                                          ├──► Unit 2 (churn cap, independent)
                                          ├──► Unit 3 (audit extension)
                                          └──► Unit 4 (derived clock; may reuse Unit 3 columns)
                                                   └──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (vocab scan) | None | Unit 1 migration |
| Unit 1 (closed-vocab) | Phase 1 scan | sibling `SUPERSEDES` emission; any later edge-type extension |
| Unit 2 (churn cap) | None (additive) | Deferred sibling verification |
| Unit 3 (audit extension) | tombstone store | Deferred sibling verification |
| Unit 4 (derived clock) | Unit 3 (valid_from source) | Deferred sibling verification |
| Verify | Unit 1 for this implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (vocab scan + scaffold) | Med | 1-2 hours |
| Unit 1 (table-rebuild migration) | Med-High | 3-5 hours |
| Unit 2 (churn cap) | Low | 1-2 hours |
| Unit 3 (audit extension) | Med | 2-4 hours |
| Unit 4 (derived clock) | Med | 2-3 hours |
| Verification | Med | 2-3 hours |
| **Total** | | **11-19 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Pre-migration `SELECT DISTINCT edge_type` scan run against a live DB; DISTINCT set recorded and all values in-vocab
- [x] `code_edges` row count captured in migration tests before rebuild (round-trip baseline)
- [x] Governance CHECK automatic rollout preserved default-OFF unless owner enables `SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB`

### Rollback Procedure
1. If pre-scan finds an out-of-vocab value: abort — do not run the rebuild; map/repair or escalate.
2. If the rebuild transaction fails: it rolls back automatically; original table + `SCHEMA_VERSION` intact.
3. If a committed migration must be reverted: run the DOWN helper or restore from the pre-rebuild copy + reset the version row to 7; revert Units 2-4 independently if they are implemented later.
4. Smoke test: a code-graph scan + an impact query return non-degraded results post-rollback.

### Data Reversal
- **Has data migrations?** Yes (Unit 1 table-rebuild; `SCHEMA_VERSION` bump).
- **Reversal procedure**: run `rollbackCodeEdgeGovernanceVocabSchema()` or restore the pre-rebuild `code_edges` copy and reset the `schema_version` row to 7; Units 2-4 are not part of this implementation.
<!-- /ANCHOR:enhanced-rollback -->
