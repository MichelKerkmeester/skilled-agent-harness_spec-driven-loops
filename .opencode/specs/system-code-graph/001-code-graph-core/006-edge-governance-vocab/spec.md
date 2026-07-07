---
title: "Feature Specification: Code-Graph Edge Write-Time Governance (closed-vocab CHECK + deferred governance siblings)"
description: "DONE for the closed-vocab edge-governance anchor: Code Graph now exposes a default-off SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB flag that applies an idempotent code_edges edge_type CHECK table rebuild, with a pre-rebuild DISTINCT scan across live edges and tombstones, all-or-nothing abort on out-of-vocab values, rollback helper, SCHEMA_VERSION 7->8 and focused tests. Churn cap, audit-subgraph and derived-clock siblings remain deferred."
trigger_phrases:
  - "028 code graph edge governance"
  - "closed vocab check edge_type"
  - "edge_type CHECK constraint migration"
  - "cascade guard churn cap heuristic edges"
  - "derived clock supersession tiebreak prune"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/001-code-graph-core/006-edge-governance-vocab"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented the default-off closed-vocab edge_type CHECK migration in system-code-graph"
    next_safe_action: "Enable SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB only after owner rollout approval"
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
    open_questions:
      - "Can per-run churn cap be enforced without cross-scan edge identity, which the per-scan rebuild model lacks?"
    answered_questions:
      - "All four candidates are PENDING, none appear in 030 §14 done table (only Code-Graph Q4-C1 shipped from the Code Graph subsystem, in a different sub-phase)"
      - "edge_type is TEXT NOT NULL with NO CHECK (code-graph-db.ts:184) vs the parser_skip CHECK pattern (:208), the constraint gap is CONFIRMED"
      - "The prune tiebreak is ORDER BY deleted_at DESC, id DESC (code-graph-db.ts:279, :1493), rowid is arrival-order dependent, CONFIRMED"
      - "The 2 heuristic edge-write sites are CALLS (structural-indexer.ts:1146) and TESTED_BY (:2058), both uncapped, CONFIRMED"
      - "edge-bitemporal-lifecycle is NO-GO (per-scan rebuild fights never-delete versioning, tombstones already record deletion-history), only closed-vocab-CHECK is a clean GO here (iter-013)"
      - "Closed vocabulary is the 10 live relations plus SUPERSEDES, sourced from EDGE_TYPES"
      - "Live DB DISTINCT scan on 2026-06-19 found only in-vocab code_edges values and no tombstone edge rows"
---

# Feature Specification: Code-Graph Edge Write-Time Governance (closed-vocab CHECK + churn cap + audit + derived-clock tiebreak)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | complete |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Phase** | `system-code-graph/001-code-graph-core` (research) |
| **Parent Packet** | system-code-graph/001-code-graph-core |
| **Subsystem** | Code Graph, structural retrieval intelligence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The code-graph edge table is **ungoverned at write time**. Four distinct holes share that one theme:

1. **No closed-vocabulary enforcement.** `code_edges.edge_type` is `TEXT NOT NULL` with **no CHECK constraint** (`code-graph-db.ts:184`), even though the sibling `parser_skip_list` table demonstrates the exact CHECK pattern (`error_class TEXT NOT NULL CHECK (error_class IN ('B1','B2','OTHER'))`, `:208`). Today only the writers' discipline keeps the column to the 10 known relations (`CONTAINS, CALLS, IMPORTS, EXPORTS, EXTENDS, IMPLEMENTS, TESTED_BY, DECORATES, OVERRIDES, TYPE_OF`, see `indexer-types.ts:20-22`). A future edge-evolver, a typo or a migration bug can silently write an out-of-vocab type the driver will never reject.
2. **Unbounded heuristic churn.** The two heuristic edge-write sites, cross-file `CALLS` (`structural-indexer.ts:1146`, confidence 0.8, `INFERRED`) and cross-file `TESTED_BY` (`:2058`, confidence 0.6, `AMBIGUOUS`), have **no per-run cap** on links created. A pathological scan (e.g. a glob that matches many `*.test.*` siblings) can write an unbounded number of low-confidence heuristic edges with no governor.
3. **Governance ops leave no per-decision audit.** The `code_graph_tombstones` precursor (`code-graph-db.ts:250-262`, env-gated OFF by default `SPECKIT_CODE_GRAPH_TOMBSTONES` `:230`, pruned to 100 `:232`) records **deletions only**. There is no queryable record of an edge's *creation* or *relabel*, and the existing store is non-durable.
4. **Arrival-order-dependent supersession tiebreak.** The tombstone prune tiebreak is `ORDER BY deleted_at DESC, id DESC` (`code-graph-db.ts:279`, `:1493`), where `id` is the rowid, i.e. **insertion/arrival order**, so which tombstone "wins" when `deleted_at` ties is non-deterministic across re-scans of the same content.

### Purpose
Govern edge writes at the source. Land the lowest-blast, highest-certainty fix first: a driver-level closed-vocabulary CHECK on `edge_type` (table-rebuild migration that admits the 10 live relations **plus** the additive `SUPERSEDES` type that the rename-lineage sibling phase introduces). Then layer the three deferred governance siblings that couple to the tombstone / edge-identity substrate: a per-run churn cap at the two heuristic write sites, an extension of the tombstone precursor with creation/relabel audit events + retention and a derived supersession-winner key replacing the rowid-arrival-order prune tiebreak.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope: five candidate ids, four units

**Unit 1 (ANCHOR): `CG-closed-vocab-check` / `closed-vocab-edge-type` (DONE, driver CHECK on `edge_type`, L/S, schema-migration gate):**
- Add a `CHECK (edge_type IN (...))` constraint to `code_edges.edge_type`, mirroring the `parser_skip_list` CHECK pattern (`code-graph-db.ts:208`).
- SQLite **cannot** `ALTER TABLE ... ADD CHECK`, so this requires a **table-rebuild migration** (create new table with the CHECK → copy rows → drop old → rename), the **first** table-rebuild migration in this schema (`ensureSchemaMigrations` is purely additive `hasColumn → ALTER` today, `code-graph-db.ts:450`). This drives a `SCHEMA_VERSION` bump from 5 (`:145`).
- **Pre-migration `SELECT DISTINCT edge_type` vocab scan is MANDATORY** (incl. nullable `tombstone.edge_type`, `code-graph-db.ts:256`): a rebuild adding the CHECK **hard-fails on any legacy / out-of-vocab row**, and "no risk" was explicitly unverified (iter-023, iter-024). The migration must enumerate live values first and either map/repair or abort with a clear error.
- The CHECK vocabulary **MUST co-admit `SUPERSEDES`**, the rename-lineage type from sibling phase `002-edge-staleness-correctness` (Q1-C2). Ordering: the `edge_type` rebuild lands FIRST so any later edge-type addition extends the rebuilt table (iter-023 build sequence, Phase-1).

2026-06-19 implementation result: shipped as a default-off migration behind `SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB`. The exported UP helper rebuilds `code_edges` with the CHECK, the BACKFILL helper performs the pre-rebuild scan and aborts on out-of-vocab live or tombstone values and the DOWN helper rebuilds without the CHECK. Existing `valid_at` / `invalid_at` columns from sibling 004 are preserved. `SCHEMA_VERSION` advances from 7 to 8. The live DB scan found `CALLS, CONTAINS, DECORATES, EXPORTS, EXTENDS, IMPLEMENTS, IMPORTS, OVERRIDES, TESTED_BY, TYPE_OF`. Tombstone edge rows were empty.

**Unit 2: `CG-cascade-guard` (DEFERRED, per-run churn cap at the 2 heuristic write sites, M/S, couples to history):**
- Add a per-run cap on heuristic edges created at the two write sites, cross-file `CALLS` (`structural-indexer.ts:1146`) and cross-file `TESTED_BY` (`:2058`), a clean additive guard.
- The **per-pair revision cap** (aionforge's flip-flop guard) needs cross-scan edge identity that the per-scan rebuild model lacks (couples to history), so scope the per-run cap (clean), defer/flag the per-pair cap. Integrate with the existing `edge-drift.ts`.

**Unit 3: `CG-audit-subgraph` (DEFERRED, EXTEND the tombstone precursor with creation/relabel events + retention, M/M, couples to tombstones):**
- EXTEND `code_graph_tombstones` (NOT a new table) so governance ops beyond deletion, edge **creation** and **relabel/revision**, leave a queryable audit event keyed by subject/kind/time, wired to the affected entity.
- Address the precursor's gaps: default-OFF, pruned-to-100, not durable, deletions-only (iter-013 CAUTION). Add durable retention semantics for audit events.

**Unit 4: `CG-derived-clock-winner` (DEFERRED, derived supersession tiebreak on the prune path, M/M as FIX, couples to edge-identity):**
- Replace the rowid-arrival-order prune tiebreak `ORDER BY deleted_at DESC, id DESC` (`code-graph-db.ts:279`, `:1493`) with a **derived** supersession-winner key, `argmax over (valid_from DESC, object_canonical ASC)`, no stored counter, no actor/rowid in the key (aionforge `crdt-model.md` derived-logical-clock).
- Goal: a re-scan of the same content picks the same supersession winner deterministically, regardless of insertion order.

### Out of Scope
- **CG-edge-bitemporal-lifecycle** (edge-granularity `valid_from`/`valid_to` versioning + relabel-revision), **NO-GO** (iter-013): the per-scan DELETE+re-INSERT rebuild model is fundamentally incompatible with never-delete edge versioning, and tombstones already record edge deletion-history. Belongs to the deferred bi-temporal cluster, not this phase.
- **Q1-C1 (`code_edges` `valid_at`/`invalid_at` columns)**, DEFER-speculative: no consumer wants as-of/time-travel, separate schema-migration cluster (synthesis `01`/`04`, 030 spec.md:48). Different migration, different phase.
- **Q1-C2 (rename `SUPERSEDES` edge itself)**, owned by sibling phase `002-edge-staleness-correctness`. This phase only **admits** the `SUPERSEDES` type into the closed vocab, it does not emit the edge.
- **Q2-C1 (parser transient/fatal split)**, separate recovery concern (the parser-skip CHECK is only the *pattern* mirror, not a shared change).
- **per-row crypto-signing / substrate-signing**, flagged over-engineering for a local single-writer code graph (iter-009 FLAG).
- **monotonic-dedup-latch** (blank→signed upgrade-only dedup), separate INFERRED candidate, not in this group.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` | Modified | Unit 1 shipped: default-off flag, `SCHEMA_VERSION` 7->8, pre-rebuild DISTINCT scan, table-rebuild UP/DOWN helpers, CHECK schema detection and index recreation. Units 3-4 remain deferred. |
| `.opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts` | Modified | Unit 1 shipped: exported `EDGE_TYPES` runtime vocabulary as the source used by both the TypeScript union and SQLite CHECK migration. |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts` | Added | Unit 1 shipped: default-off flag, opt-in init migration, CHECK reject/admit including `SUPERSEDES`, row preservation, all-or-nothing abort on out-of-vocab live/tombstone values, DOWN helper and idempotent rerun. |
| `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts` | Deferred | Unit 2 future surface: per-run churn cap at the cross-file `CALLS` and `TESTED_BY` heuristic sites. |
| `.opencode/skills/system-code-graph/mcp_server/lib/edge-drift.ts` | Deferred | Unit 2 future surface: integrate capped/dropped heuristic edges with drift accounting. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `CG-closed-vocab-check`: a driver-level CHECK constraint rejects out-of-vocabulary `edge_type` writes and admits exactly the known vocabulary. | After migration, inserting an `edge_type` NOT in the closed set throws an SQLite CHECK violation, and all 10 live relations (`indexer-types.ts:20-22`) AND `SUPERSEDES` insert successfully. CHECK pattern mirrors `parser_skip_list` (`code-graph-db.ts:208`). |
| REQ-002 | The pre-migration `SELECT DISTINCT edge_type` vocab scan runs BEFORE the table rebuild and the rebuild does not hard-fail on any legacy / out-of-vocab row. | A test seeds an out-of-vocab `edge_type` (incl. a nullable `tombstone.edge_type` row, `code-graph-db.ts:256`) then runs the migration. The migration enumerates live values first and either maps/repairs them into the closed set or aborts with a clear, non-corrupting error, never a partial half-rebuilt table. (iter-023 / iter-024: "no risk" was unverified.) |
| REQ-003 | The migration is a true table-rebuild (SQLite cannot `ALTER ... ADD CHECK`) and bumps `SCHEMA_VERSION`, preserving every existing `code_edges` row. | `SCHEMA_VERSION` increments from 5 (`code-graph-db.ts:145`), a round-trip test (N edges before → migrate → N edges after, identical `source_id`/`target_id`/`edge_type`/`weight`/`metadata`) passes and indexes (`idx_edges_source/target/type`, `:221-223`) are recreated on the rebuilt table. |
| REQ-004 | The CHECK vocabulary co-admits `SUPERSEDES` so the rename-lineage sibling phase is not blocked, and the `edge_type` rebuild is ordered FIRST in the migration sequence. | The closed set explicitly includes `SUPERSEDES`, so sibling phase `002-edge-staleness-correctness` (Q1-C2) can emit a `SUPERSEDES` edge without a further migration. Build order documented: closed-vocab rebuild precedes any later edge-type extension (iter-023 Phase-1). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `CG-cascade-guard`: a per-run cap bounds heuristic edges created at the two heuristic write sites. | A scan that would otherwise write an unbounded number of heuristic `CALLS` (`structural-indexer.ts:1146`) / `TESTED_BY` (`:2058`) edges is capped per run, the cap is additive (structural/1.0-confidence edges unaffected) and integrates with `edge-drift.ts`. The per-pair revision cap (needs cross-scan edge identity the rebuild model lacks) is explicitly deferred/flagged, not silently dropped. |
| REQ-006 | `CG-audit-subgraph`: the tombstone precursor is EXTENDED (not replaced) with creation/relabel audit events + retention, queryable by subject/kind/time. | Edge creation and relabel/revision ops write a queryable audit row on `code_graph_tombstones` (`code-graph-db.ts:250-262`) wired to the affected entity, durable retention semantics replace the prune-to-100 default for audit events and default-OFF gating preserved unless the owner approves default-on. NOT a new table (iter-013 CAUTION). |
| REQ-007 | `CG-derived-clock-winner`: the prune supersession tiebreak is derived, not arrival-order. | Replace `ORDER BY deleted_at DESC, id DESC` (`code-graph-db.ts:279`, `:1493`) with `argmax over (valid_from DESC, object_canonical ASC)` (no stored counter / rowid in the key), and a determinism test that inserts the same tombstone set in two different arrival orders selects the identical winner both times. |
| REQ-008 | Each unit is independently reversible and scoped, the closed-vocab migration is the only blast-radius-bearing change and is gated by the pre-migration scan. | Each candidate is a separate scoped commit, Units 2-4 do not depend on Unit 1 except Unit 4's `valid_from` key may reuse audit/tombstone columns from Unit 3 and the migration carries a documented rollback (restore from the pre-rebuild copy). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: DONE for the opt-in migration: the driver rejects any out-of-vocabulary `edge_type` write and admits exactly the 10 live relations plus `SUPERSEDES`, so the closed-vocabulary contract is enforced in SQLite, not just by writer discipline.
- **SC-002**: DONE: the pre-migration `SELECT DISTINCT edge_type` scan (incl. nullable tombstone rows) runs first and no live DB row causes a hard-fail half-rebuild. The migration is all-or-nothing with a clear abort path.
- **SC-003**: DONE: `SCHEMA_VERSION` is bumped to 8 and every existing `code_edges` row survives the rebuild byte-for-byte (round-trip verified). The `SUPERSEDES` type is admitted so the sibling rename-lineage phase is unblocked.
- **SC-004**: DEFERRED: heuristic edge creation remains a future sibling unit, with the per-pair cap explicitly deferred for lack of cross-scan edge identity.
- **SC-005**: DEFERRED: audit-subgraph and derived-clock tiebreak remain future sibling units.
- **SC-006**: `validate.sh --strict` on this phase folder passes, with typecheck + the focused code-graph schema/migration/indexer suites green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Table-rebuild migration hard-fails on a legacy / out-of-vocab `edge_type` row | Half-rebuilt table → corrupt code graph | MANDATORY pre-migration `SELECT DISTINCT edge_type` scan (incl. nullable tombstone rows, `:256`), map/repair or abort all-or-nothing (REQ-002), "no risk" was unverified (iter-024) |
| Risk | First table-rebuild migration in a schema whose `ensureSchemaMigrations` is purely additive (`:450`) | New migration shape, index/trigger recreation easy to miss | Recreate `idx_edges_source/target/type` (`:221-223`) on the rebuilt table, round-trip row-count + content test (REQ-003) |
| Risk | CHECK omits `SUPERSEDES` → blocks the sibling rename-lineage phase | Q1-C2 can't emit its edge without a second migration | Co-admit `SUPERSEDES` in the closed set, order the rebuild FIRST (REQ-004, iter-023) |
| Risk | Per-pair churn cap attempted without cross-scan edge identity | Couples to history the rebuild model lacks, over-scope | Ship only the per-run cap (clean additive), defer/flag the per-pair cap (REQ-005, iter-013) |
| Risk | Audit-subgraph implemented as a NEW table | Duplicates the existing tombstone precursor | EXTEND `code_graph_tombstones` (`:250-262`), not a new table (REQ-006, iter-013) |
| Risk | Derived-clock key reintroduces a stored counter / rowid | Re-creates the arrival-order dependence | Key strictly on derived fields `(valid_from DESC, object_canonical ASC)`, no rowid/actor (REQ-007) |
| Dependency | Sibling phase `002-edge-staleness-correctness` (Q1-C2 `SUPERSEDES`) | The closed vocab must admit its edge type | Coordinate the vocab list, closed-vocab rebuild lands first so the sibling extends the rebuilt table |
| Dependency | Off-by-default tombstone machinery (`code-graph-db.ts:230-262`, `SPECKIT_CODE_GRAPH_TOMBSTONES`) | Substrate for Units 3 (audit) and 4 (derived clock) | Reuse / extend the existing machinery, preserve default-OFF gating unless the owner approves default-on |
| Dependency | `edge-drift.ts` | Integration point for the per-run churn cap (Unit 2) | Fold the cap into existing drift accounting rather than a parallel counter |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The pre-migration `SELECT DISTINCT edge_type` scan and the table rebuild run once per `SCHEMA_VERSION` bump on the single serialized WAL connection, a one-time cost, not per-scan. The rebuild copies all rows in one transaction.
- **NFR-P02**: The per-run churn cap (Unit 2) adds an O(1) counter check per heuristic edge write, with no extra query in the hot scan path.
- **NFR-P03**: Audit-event writes (Unit 3) reuse the existing tombstone insert path. Retention is bounded so the audit subgraph does not grow without limit.

### Security
- **NFR-S01**: No new untrusted-content surface. All four units touch the schema constraint, edge-write accounting, the audit/tombstone store and the prune tiebreak only, and no recalled content is rendered into an agent loop.

### Reliability
- **NFR-R01**: The migration is all-or-nothing: a pre-scan failure aborts before any destructive rebuild step, and a documented rollback restores from the pre-rebuild copy.
- **NFR-R02**: The closed-vocab CHECK degrades safely, so an attempted out-of-vocab write fails loudly at the driver (a typed CHECK violation) rather than silently corrupting the relationship vocabulary.
- **NFR-R03**: The derived supersession key is a pure function of stored derived fields, so the same content yields the same winner across re-scans regardless of arrival order.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty `code_edges` table at migration time: rebuild is a no-op row-copy, CHECK still installed, `SCHEMA_VERSION` still bumped.
- A nullable `tombstone.edge_type` row (`code-graph-db.ts:256`): the pre-migration scan MUST include it. The CHECK on `code_edges` does not constrain the tombstone column, but the scan must not miss out-of-vocab values that a future relabel could copy back.
- `deleted_at` ties across multiple tombstones for the same pair: the derived key `(valid_from DESC, object_canonical ASC)` breaks the tie deterministically (Unit 4), where `id DESC` did not.

### Error Scenarios
- An out-of-vocab `edge_type` value found in the live DB during the pre-scan: the migration aborts with a clear error naming the offending value(s) and row(s), and it does NOT proceed with a half-rebuild (REQ-002).
- The heuristic churn cap is hit mid-scan: edges beyond the cap are dropped (not errored) and counted in `edge-drift.ts` accounting so the drop is observable, not silent.
- Audit retention exceeded: oldest audit events age out per the durable retention policy, not the legacy prune-to-100 default.

### State Transitions
- Partial / crashed migration: the all-or-nothing transaction leaves either the old table (pre-rebuild) or the new CHECK'd table, never a half-state. `SCHEMA_VERSION` only advances after a committed rebuild.
- Sibling `SUPERSEDES` introduced after this phase: it inserts cleanly because the closed vocab already admits it (no second migration).
- A relabel of an existing edge (creation→relabel audit, Unit 3): writes an audit event on the tombstone store wired to the affected entity, without deleting the underlying edge.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Files: ~3-4 prod + tests, LOC: ~200-350, Systems: schema migration (first table-rebuild) + heuristic edge-write accounting + tombstone/audit store + prune tiebreak |
| Risk | 14/25 | Auth: N, API: N (internal lib), Breaking: table-rebuild migration is the blast-radius (mitigated by pre-scan + round-trip test), Units 2-4 additive |
| Research | 8/20 | Seams CONFIRMED in live code (`edge_type` no-CHECK :184, prune tiebreak :279/:1493, heuristic sites :1146/:2058, tombstone store :250-262), pre-migration vocab scan UNVERIFIED against a live DB, effort/leverage structural inference |
| **Total** | **36/70** | **Level 2** (one schema-migration anchor + three additive governance siblings, no multi-system architecture change) |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- What is the exact closed vocabulary the CHECK admits, the 10 live relations (`indexer-types.ts:20-22`) plus `SUPERSEDES`? Are there any other in-flight edge types (e.g. from sibling phases) that must be admitted in the same rebuild to avoid a second migration?
- Does any live DB currently hold an out-of-vocab `edge_type` value (incl. nullable `tombstone.edge_type`)? The pre-migration `SELECT DISTINCT edge_type` scan must run against a real DB before the rebuild can be promised safe (iter-023/024 flagged "no risk" as unverified).
- Can the per-run churn cap be enforced meaningfully without cross-scan edge identity, or does the per-pair revision cap require an edge-identity model the per-scan rebuild fundamentally lacks (iter-013)?
- Should `CG-audit-subgraph` retention be durable-unbounded, durable-with-TTL or a higher prune limit than the current 100, and does default-OFF gating stay, or does the owner want audit default-on?
- What populates `valid_from` for the derived-clock key on a tombstone row, `deleted_at`, a scan generation or a new column (Unit 4 depends on the audit/tombstone column shape from Unit 3)?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Research (PRIMARY)**: `../research/research.md`, `../research/iterations/iteration-009.md` (edge-governance cluster: audit-subgraph, cascade-guard, closed-vocab CHECK, NET-NEW candidates), `../research/iterations/iteration-008.md` (CG-derived-clock-winner / derived-logical-clock-supersession-winner), `../research/iterations/iteration-013.md` (Round E feasibility: closed-vocab GO, audit-subgraph EXTEND-not-new, cascade-guard per-run clean / per-pair couples to history, edge-bitemporal NO-GO), `../research/iterations/iteration-023.md` (build sequence: closed-vocab rebuild FIRST, pre-migration DISTINCT scan), `../research/iterations/iteration-024.md` (GO re-verify: closed-vocab WEAKER, pre-migration scan unverified), `../research/deltas/iter-008.jsonl` + `../research/deltas/iter-009.jsonl` + `../research/deltas/iter-013.jsonl` (banked candidate rows).
- **Roadmap (AUTHORITATIVE)**: `../../research/roadmap.md` (BROADENING §3 Ship-First #5, closed-vocab WEAKER caveat, spine 6 idempotent governance), `../../research/synthesis/01-go-candidates.md` (Wave-0 correction: closed-vocab → schema-migration wave, not a flip), `../../research/synthesis/03-corrections-caveats-and-residuals.md` (closed-vocab weaker-than-billed), `../../research/synthesis/04-sibling-and-cross-cutting.md`.
- **Sibling phase**: `../002-edge-staleness-correctness/spec.md` (Q1-C2 `SUPERSEDES` edge, this phase admits its type into the closed vocab).
- **Wave-0 shipped record**: Wave-0 record (none of these five candidates are in the done table, only Code-Graph Q4-C1 shipped from the Code Graph subsystem, in a different sub-phase).
