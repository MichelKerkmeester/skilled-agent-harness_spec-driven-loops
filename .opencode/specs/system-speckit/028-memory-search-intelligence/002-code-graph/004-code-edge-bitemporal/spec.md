---
title: "Feature Specification: Code-Edge Bi-temporal Lifecycle (Q1-C1 cluster)"
description: "DONE for the Code Graph schema foundation: SCHEMA_VERSION 6->7 adds nullable code_edges valid_at/invalid_at generation columns with UP/DOWN/BACKFILL helpers, idempotent fail-closed migration tests, fresh-DB init support and default-off temporal read consumption. Lifecycle/timeline consumers remain gated."
trigger_phrases:
  - "028 code edge bitemporal"
  - "code_edges valid_at invalid_at"
  - "code graph live view chokepoint"
  - "edge bitemporal lifecycle"
  - "symbol timeline as-of query"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/004-code-edge-bitemporal"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented code-edge bitemporal schema foundation in system-code-graph"
    next_safe_action: "Keep temporal consumers default-off until benchmarked and requested"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-004-code-edge-bitemporal"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Is there any consumer for as-of/time-travel code-graph reads, or does the shipped readiness gate already cover the safety case?"
      - "Should 1.0-confidence structural edges (CONTAINS/IMPORTS) stay replace-in-place while only heuristic edges (CALLS/TESTED_BY) get versioning?"
    answered_questions:
      - "Schema foundation shipped (columns, migration helpers, default-off gate); wider consumer cluster remains DEFER-speculative (030 §3/§14)"
      - "standalone CG-edge-bitemporal-lifecycle is REFUTED (per-scan rebuild + tombstones already cover deletion-history; 002 iter-013)"
---

# Feature Specification: Code-Edge Bi-temporal Lifecycle (Q1-C1 cluster)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

**Original problem statement (2026-06-16, superseded by the 2026-06-19 implementation update immediately below - the schema foundation described as missing here has since shipped):**

The code-graph reindex is destructive DELETE+INSERT with **no temporal columns**: `code_edges(id, source_id, target_id, edge_type, weight, metadata)` carries no validity window, and currentness equals physical edge presence (`code-graph-db.ts:177-184`, SCHEMA_VERSION 5). This phase captures the heavy schema-migration cluster that would make code structure *explicitly* bi-temporal, a symbol/edge valid for a commit range (event-time) and indexed at scan-time (transaction-time), mirroring Memory's causal four-timestamp window (C3-B). The cluster is: **Q1-C1** (`valid_at`/`invalid_at` columns, replace reindex DELETEs with `UPDATE ... SET invalid_at = <generation>` + INSERT new, default read filters `invalid_at IS NULL`), **Q1-C1-views** (the `code_nodes_live`/`code_edges_live` current-view chokepoint that localizes the migration, the keystone), **CG-edge-bitemporal-lifecycle** (the edge-granularity validity + relabel-revision layer) and **CG-symbol-timeline-query** (the timeline/as-of read). Q1-C1 and Q1-C1-views MUST co-ship atomically through ONE `code-graph-db.ts` reindex transaction boundary. The whole cluster depends on **Q6-C1 (the hard generation watermark) landing first**.

**2026-06-19 implementation update: the schema foundation is DONE.** The current codebase already had the hard generation watermark at `SCHEMA_VERSION = 6`. This phase bumps Code Graph to `SCHEMA_VERSION = 7` and adds the additive `code_edges.valid_at` / `code_edges.invalid_at` generation columns in `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts`. The migration exposes explicit UP (`ensureCodeEdgeBitemporalSchema`), BACKFILL (`backfillCodeEdgeBitemporalColumns`) and DOWN (`rollbackCodeEdgeBitemporalSchema`) helpers, runs idempotently, fails closed when required migration tables/columns are missing and is present on fresh DB initialization. Legacy edge rows backfill `valid_at` from the current `graph_generation`. `invalid_at` remains NULL. Consumer behavior is deliberately unchanged by default: temporal read consumption is behind `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS=false` unless explicitly enabled later.

The wider lifecycle/timeline cluster remains gated. Research is still deflationary for as-of/time-travel consumers, and this schema foundation does not replace the separate edge-staleness correctness work. Standalone `CG-edge-bitemporal-lifecycle` remains independently **REFUTED** as a standalone write model. It can only layer on the schema foundation if a future consumer and benchmark justify it.

**Key Decisions**: the live-view chokepoint (Q1-C1-views) is the de-risk prerequisite and the read chokepoint, defining "current" ONCE as a SQL VIEW and routing all default reads through it. Blast-radius is MEDIUM-HIGH (the whole read/resolve/prune surface, NOT the 4 DELETE lines). The column shape is shared with Memory's C3-B (build the validity-window shape once, reconcile, do not fork).

**Critical Dependencies**: **Q6-C1 generation watermark first** (the generation must bump atomically with the reindex swap, and `invalid_at` is stamped with the generation value), a **real as-of/time-travel consumer** (none exists today, the speculative gate) and the shared bi-temporal validity-window shape with Memory `007-bitemporal-window` C3-B.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P3 (schema foundation shipped; wider consumer cluster DEFER-speculative) |
| **Status** | Complete |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Phase** | `system-spec-kit/028-memory-search-intelligence/002-code-graph` (research) |
| **Parent Packet** | `system-spec-kit/028-memory-search-intelligence` |
| **Subsystem** | Code Graph (`system-code-graph`), structural retrieval intelligence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The code-graph reindex mutates edges destructively. `replaceNodes(fileId, nodes)` does `DELETE FROM code_nodes WHERE file_id = ?` then re-INSERT and hard-deletes node-touching edges, `replaceEdges` deletes-per-source then re-inserts, and deferred dangling-delete and `pruneDanglingEdges()` physically delete edges whose endpoint is no longer a live node (`code-graph-db.ts:936,:941,:985,:1012,:1027,:1031`). `code_edges` carries NO `valid_from`/`valid_to`/`generation`/`superseded_by` (`:177-184`), so currentness equals physical presence and a broken or partial scan can only **block** reads (binary `freshness !== 'fresh'` gate, `code-graph-context.ts:313-321`), never serve as-of-last-green-scan results. There is no way to ask "what did the call graph look like at commit X" or "when was this CALLS edge superseded".

### Purpose
Capture, faithfully and gated, the schema-migration cluster that would make `code_edges` bi-temporally explicit (validity window + live-view chokepoint + edge-lifecycle + symbol-timeline read), sharing the validity-window column shape with Memory's causal C3-B, so the plan is ready IF a consumer for as-of/time-travel ever materializes. This phase shipped the schema foundation (nullable `valid_at`/`invalid_at` columns, SCHEMA_VERSION 6→7, UP/DOWN/BACKFILL helpers, default-off temporal reads) and makes the DEFER decision legible for the wider consumer cluster.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope, implemented schema foundation + gated consumers
- **Q1-C1 / Q1-C1-code-edge-bitemporal schema foundation, DONE.** Adds nullable `valid_at`/`invalid_at` generation columns to `code_edges`, bumps Code Graph `SCHEMA_VERSION` from 6 to 7, backfills legacy rows from `graph_generation`, exposes UP/DOWN/BACKFILL helpers and keeps temporal read consumption default-off behind `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS`.
- **Q1-C1 write/read consumers, still gated.** Replacing reindex DELETEs with temporal close-and-insert and routing default reads through a temporal current set remain out of this schema-only implementation until a named consumer and benchmark exist.
- **Q1-C1-views** (Code Graph, the keystone), the live current-view chokepoint (`CREATE VIEW code_nodes_live`/`code_edges_live` `WHERE invalid_at IS NULL AND status NOT IN (superseded, quarantined)`). ALL default reads route through it, and as-of/audit readers deliberately bypass. This is the de-risk prerequisite that localizes the migration. **MUST co-ship atomically with Q1-C1.** Reference: aionforge `relates_to.rs:313-332`, `store.rs:894-927` (002 iter-018).
- **CG-edge-bitemporal-lifecycle** (Code Graph, H/L, BUILD edge-granularity), `RELATES_TO`-style edge carries `valid_from`/`valid_to` + `ingested_at`/`expired_at`, one current edge per ordered pair, a different label = close-and-replace revision. Seam `code-graph-db.ts:177-184` (no temporal cols, LWW). **[CONFIRMED gap] but standalone-REFUTED** (002 iter-013): the per-scan DELETE+INSERT rebuild model fights never-delete versioning, and tombstones (`:247-260`) already record edge deletion-history. Survives ONLY as the lifecycle layer ON TOP OF Q1-C1's columns + atomic supersede (002 iter-023 Phase 3), never as a standalone.
- **CG-symbol-timeline-query** (Code Graph, the timeline read), the as-of/time-travel read over the Q1-C1 columns ("what did the call graph look like at commit/generation N"). No separate research seam beyond the Q1-C1 read filter + an audit-reader that bypasses the live-view. It is the consumer the rest of the cluster has no demand for today.

### Out of Scope
- **Temporal read/write behavior by default.** The migration ships only the schema foundation. Default behavior remains byte-identical unless `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS=true` is set by a later consumer path.
- **Q6-C1 (hard generation watermark)**, the cluster's hard dependency, owned by a separate Code Graph phase (the generation+watermark cluster). The generation must bump atomically with the reindex swap and is the value stamped into `invalid_at`. Build it first.
- **Q6-C2 (soft generation watermark)**, the additive, no-migration staged predecessor, lives in the Code Graph Wave-0/determinism scope, not here. It is a metadata-only counter on the freshness envelope.
- **CG-closed-vocab-CHECK** (`edge_type` CHECK table-rebuild), the FIRST table-rebuild migration that orders the edge_type rebuild before this cluster extends the rebuilt table (002 iter-023 Phase 1), owned by a separate Code Graph schema phase. Sequenced before Q1-C1 but a distinct candidate.
- **CG-edge-staleness / dependency-transitivity**, the ONE real edge-staleness bug (wire `queryFileImportDependents` into the scan loop), owned by sibling `002-edge-staleness-correctness`. The cluster here explicitly does NOT fix it.
- **Q4-C1 rank-time trust multiplier**, SHIPPED (030 `(this commit)`), rank-time-only, off the schema chokepoint, not part of this cluster.
- **Q3-C1 seeded PPR**, net-new query-seeded impact ranking, read-side, must intersect the `invalid_at IS NULL` current set but is a separate candidate. Belongs to the cluster on the read side only, not built here.
- **CRDT order-independent merge**, needs-benchmark, the last node in the build sequence after edge-lifecycle (002 iter-023 Phase 3), explicitly deferred. aionforge `trust_fold.rs:183-259` reference, no consumer.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` | Modified | Added `valid_at`/`invalid_at` columns to `code_edges`, bumped `SCHEMA_VERSION` 6->7, added UP/DOWN/BACKFILL helpers, wired fresh init + idempotent migration path, added default-off temporal read flag. |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts` | Added | Covers up applies, down reverts, backfill correctness, idempotent rerun, fresh init, fail-closed behavior and default-off flag. |
| `.opencode/skills/system-code-graph/mcp_server/tests/edge-staleness-correctness.vitest.ts` | Modified | Removed stale exact schema-version assertion from the sibling behavior test. The test now verifies lineage behavior without pinning global schema version. |
| `.opencode/skills/system-code-graph/.../code-graph-db.ts` (views) | Create (deferred) | `CREATE VIEW code_nodes_live`/`code_edges_live` WHERE `invalid_at IS NULL`, the single current-view chokepoint (Q1-C1-views). |
| `.opencode/skills/system-code-graph/.../code-graph-context.ts` | Modify (deferred) | Default reads route through the live-view, an as-of/audit reader (CG-symbol-timeline-query) deliberately bypasses it, intersect any PPR-reached set with `invalid_at IS NULL`. |
| `.opencode/skills/system-code-graph/.../structural-indexer.ts` | Modify (deferred) | Edge-write path emits close-and-replace (CG-edge-bitemporal-lifecycle) instead of delete+recreate, ON TOP OF Q1-C1's columns. |
| `.opencode/skills/system-code-graph/.../*.vitest.ts` | Create (deferred) | apply-once G2 invariant test (rescan of unchanged content = no-op: same edge ids, same windows, generation unchanged), as-of read test, live-view chokepoint test. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

> The schema-foundation requirements (nullable `valid_at`/`invalid_at` columns, SCHEMA_VERSION 7, UP/DOWN/BACKFILL helpers, default-off temporal reads) are satisfied. The wider consumer-cluster requirements below remain gated and define the contract the cluster MUST meet IF it is ever un-deferred.

### P0 - Blockers (MUST complete IF un-deferred)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Q1-C1 + Q1-C1-views co-ship atomically through ONE `code-graph-db.ts` reindex transaction boundary, and the validity columns AND the live-view land in a single SCHEMA_VERSION migration. | A single migration adds `valid_at`/`invalid_at` (`code-graph-db.ts:177-184`) AND the `code_*_live` views, and partial application is impossible (one `d.transaction()` on the serialized WAL connection, `:511`). |
| REQ-002 | Reindex DELETEs are replaced by `UPDATE ... SET invalid_at = <generation>` + INSERT new, not physical delete, at all four sites (`:941,:985,:1012,:1031`). | A superseded edge is closed (History-readable), not destroyed, and an as-of read at the prior generation still resolves it. |
| REQ-003 | The apply-once G2 invariant holds: a rescan of unchanged content is a no-op, same edge ids, same windows, generation unchanged. | Test: scan a file twice with no content change → zero new edge rows, zero `invalid_at` writes, generation unchanged. |
| REQ-004 | Q6-C1 (hard generation watermark) lands FIRST, and the generation bumps atomically with the reindex swap and is the value stamped into `invalid_at`. | The cluster does not start until Q6-C1 exists, and `invalid_at` holds a generation value, not a wall-clock timestamp. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The live-view chokepoint defines "current" exactly once, all default reads route through it, and as-of/audit readers deliberately bypass. | grep shows default read sites query `code_*_live`, not the base tables, and the CG-symbol-timeline-query reader is the only sanctioned base-table/as-of reader. |
| REQ-006 | CG-edge-bitemporal-lifecycle ships ONLY as the layer on top of Q1-C1 columns + atomic supersede, never as a standalone (the standalone is REFUTED). | The lifecycle write path depends on Q1-C1 columns, and no edge-versioning is attempted against the bare per-scan-rebuild model. |
| REQ-007 | CG-symbol-timeline-query exists ONLY if a real as-of/time-travel consumer is named, otherwise the cluster stays deferred. | A named consumer (impact-as-of, audit, or "call graph at commit X") is documented before the timeline read is built. |
| REQ-008 | The `code_edges` validity-window column shape is reconciled with Memory's C3-B (`007-bitemporal-window`), shared shape, not a fork. | The four-timestamp / `valid_*`+`invalid_at` column names match the Memory causal/lineage shape per the shared-infra row. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The schema foundation is shipped and evidence-cited: `code_edges.valid_at` / `invalid_at`, SCHEMA_VERSION 6->7, UP/DOWN/BACKFILL helpers, fresh-init path and default-off temporal consumption.
- **SC-002**: The gated plan is faithful: Q1-C1 + Q1-C1-views co-ship atomically, the cluster depends on Q6-C1 first, standalone edge-lifecycle is recorded as REFUTED and the column shape is shared with Memory C3-B.
- **SC-003**: IF un-deferred, the apply-once G2 invariant and the live-view chokepoint are the de-risk gates (a rescan of unchanged content is a no-op, and "current" is defined once).
- **SC-004**: `validate.sh --strict` on this phase folder passes, the schema foundation is DONE and wider consumers remain explicitly gated.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Building the cluster with no consumer for as-of/time-travel | Pure cost, zero realized value, a speculative migration on the read/resolve/prune surface | DEFER until a real consumer is named (REQ-007); schema foundation shipped, consumer cluster deferred |
| Risk | Treating it as a staleness fix | It does NOT fix the real bug (dependency-transitivity) | Route the real bug to sibling `002-edge-staleness-correctness`, this cluster is orthogonal |
| Risk | Attempting standalone edge-versioning against the per-scan rebuild | The rebuild model fights never-delete, and tombstones already cover deletion-history | Only layer CG-edge-bitemporal-lifecycle on Q1-C1 columns (REQ-006), standalone is REFUTED (002 iter-013) |
| Risk | Q1-C1 without the live-view | Migration leaks across the whole read surface, high blast-radius | The live-view chokepoint localizes it, co-ship atomically (REQ-001/005) |
| Risk | `invalid_at` stamped with wall-clock instead of generation | as-of reads become non-reproducible | Stamp the generation value, Q6-C1 first (REQ-004) |
| Dependency | Q6-C1 hard generation watermark | Gates the whole cluster (generation is the `invalid_at` value) | Build Q6-C1 first, it is a separate Code Graph phase |
| Dependency | A real as-of/time-travel consumer | The speculative gate, none exists today | Named consumer required before un-deferring (REQ-007) |
| Dependency | CG-closed-vocab-CHECK (first table-rebuild) | Orders the edge_type rebuild before this cluster extends the table | Sequence closed-vocab + Q6-C1 (Phase 1) before Q1-C1 (Phase 2) per 002 iter-023 |
| Dependency | Memory C3-B validity-window shape | Shared column shape (build once, reconcile) | Align with `007-bitemporal-window` C3-B (REQ-008) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The live-view chokepoint adds a view layer to default reads, and the apply-once invariant keeps a no-change rescan a no-op (no write amplification). Both are gated, unmeasured (no benchmark exists per research §6).

### Security
- **NFR-S01**: No untrusted-content surface. The temporal columns carry generation values/timestamps only, not recalled content.

### Reliability
- **NFR-R01**: The migration is atomic (one `d.transaction()` on the serialized WAL connection), and partial application is impossible. A superseded edge is closed, not destroyed, so a botched scan degrades to as-of-last-green rather than data loss, IF built.

---

## 8. EDGE CASES

### Data Boundaries
- Rescan of unchanged content: must be a no-op (apply-once G2 invariant), same edge ids, same windows, generation unchanged.
- 1.0-confidence structural edges (CONTAINS/IMPORTS) vs heuristic edges (CALLS/TESTED_BY): open question whether structural edges stay replace-in-place while only heuristic edges get versioning (002 iter-009).
- Legacy/out-of-vocab `edge_type` rows: the closed-vocab rebuild (dependency) hard-fails on any out-of-vocab row incl nullable `tombstone.edge_type` (`:253`), needs a pre-migration `SELECT DISTINCT edge_type` scan.

### Error Scenarios
- A reindex that crashes mid-migration: the single atomic transaction rolls back, no partial validity columns / partial view.
- An as-of read for a generation that never existed: surfaces an ERROR (Q6-C1 contract, unsatisfiable generation is an error, never silently-stale).

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: ~4 prod + tests, whole read/resolve/prune surface (NOT 4 DELETE lines), SCHEMA_VERSION 6->7 |
| Risk | 19/25 | Breaking: schema migration on the singleton WAL connection, blast-radius MEDIUM-HIGH, per-scan-rebuild model fights versioning |
| Research | 12/20 | Seams CONFIRMED, standalone lifecycle REFUTED, aionforge schema reference present, bi-temporal "commit-time = event-time" mapping is INFERRED (dangling-prune + cross-file CALLS resolver not traced end-to-end) |
| Multi-Agent | 4/15 | Single-stream IF built, cluster co-ships through one txn |
| Coordination | 12/15 | Depends on Q6-C1 (first) + closed-vocab (first) + a named as-of consumer (none) + Memory C3-B shape |
| **Total** | **67/100** | **Level 3** (schema-migration cluster, high blast-radius, DEFER-speculative) |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Cluster built with no as-of/time-travel consumer (speculative spend) | H | H | DEFER (REQ-007); schema foundation shipped, consumer cluster deferred |
| R-002 | Mistaken for a staleness fix, the real bug (dependency-transitivity) stays open | M | M | Route to sibling `002-edge-staleness-correctness` |
| R-003 | Standalone edge-versioning attempted against per-scan rebuild | M | M | Only layer on Q1-C1 columns (REQ-006), standalone REFUTED |
| R-004 | Q1-C1 lands without the live-view, migration leaks across the read surface | H | M | Co-ship atomically, live-view localizes (REQ-001/005) |
| R-005 | `invalid_at` stamped with wall-clock, not generation, as-of non-reproducible | M | L | Q6-C1 first, stamp the generation (REQ-004) |
| R-006 | Closed-vocab rebuild hard-fails on a legacy out-of-vocab row | M | M | Pre-migration `SELECT DISTINCT edge_type` scan (dependency) |

---

## 11. USER STORIES

### US-001: As-of-last-green-scan impact (Priority: P3, gated)

**As a** code-graph consumer after a broken or partial scan, **I want** impact reads to serve the last-green-scan edge set, **so that** a partial scan degrades to stale-but-correct rather than blocking, IF an as-of consumer is ever needed.

**Acceptance Criteria**:
1. Given a superseded edge closed at generation N, When an as-of read at generation N-1 runs, Then the edge resolves (it is closed, not destroyed).
2. Given no as-of consumer is named, Then the consumer cluster stays DEFERRED (schema foundation is already shipped).

### US-002: Call graph at commit X (Priority: P3, gated)

**As a** maintainer auditing a refactor, **I want** to ask "what did the call graph look like at commit/generation X", **so that** I can trace when a CALLS edge was superseded, IF the timeline read is ever built.

**Acceptance Criteria**:
1. Given the Q1-C1 columns exist, When CG-symbol-timeline-query reads as-of generation X, Then it bypasses the live-view and returns the edge set valid at X.
2. Given a generation that never existed, Then the read surfaces an ERROR, never silently-stale edges.

---

## 12. OPEN QUESTIONS

- Is there ANY consumer for as-of/time-travel code-graph reads, or does the shipped readiness gate (`code-graph-context.ts:313-321`) already cover the safety case? (The speculative gate, no consumer found across 200 iterations.)
- Should 1.0-confidence structural edges (CONTAINS/IMPORTS) stay replace-in-place while only heuristic edges (CALLS/TESTED_BY) get versioning (002 iter-009)?
- Is the bi-temporal "commit-time = event-time" mapping onto code structure correct end-to-end? (The dangling-prune contract `:957-968` + cross-file CALLS resolver were NOT traced, INFERRED.)
- Does the `code_edges` validity-window shape reconcile cleanly with Memory's C3-B column shape, or do they fork?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Research (Code Graph)**: `../research/research.md`, `../research/iterations/iteration-018.md` (aionforge schema reference), `iteration-023.md` (build sequence), `iteration-013.md` (standalone lifecycle REFUTED), `iteration-009.md` (edge-governance cluster).
- **Cross-cutting research**: `../../research/roadmap.md` (BROADENING + 027-REVISIT + MEMORY-SYSTEMS addenda), `../../research/synthesis/01-go-candidates.md` (Wave-2 + DEFER), `../../research/synthesis/04-sibling-and-cross-cutting.md` (Q1-C1/Q6-C1 DEFER-speculative).
- **Shared bi-temporal sibling (Memory)**: `../../001-speckit-memory/007-bitemporal-window/` (C3-B validity-window shape, build once, reconcile).
- **Wave-0 shipped record**: Wave-0 record (Code Graph shipped Q4-C1 only; Q1-C1 schema foundation subsequently shipped as this phase, wider consumer cluster remains DEFER-speculative).
