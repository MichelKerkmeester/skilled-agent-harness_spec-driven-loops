---
title: "Implementation Summary: Code-Graph Edge Write-Time Governance"
description: "Planning-only record for the code-graph edge write-time governance phase: all five candidates (closed-vocab edge_type CHECK, per-run heuristic churn cap, audit-subgraph tombstone extension, derived-clock supersession tiebreak) are PENDING and unimplemented. This summary captures the planned scope, the confirmed seam evidence, and the gates that block each unit."
trigger_phrases:
  - "code graph edge governance summary"
  - "closed vocab check status"
  - "cascade guard audit derived clock status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/006-edge-governance-vocab"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author edge-governance-vocab impl-summary (planning-only)"
    next_safe_action: "Run the pre-migration SELECT DISTINCT edge_type scan against a live DB (T001)"
    blockers:
      - "Live-DB DISTINCT edge_type vocabulary UNVERIFIED — gates the table-rebuild migration safety"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-006-edge-governance-vocab"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Code-Graph Edge Write-Time Governance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `028-memory-search-intelligence/002-code-graph/006-edge-governance-vocab` |
| **Completed** | Not yet — planning only |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing has been built yet. This is a planning-only spec folder governing how the Code Graph writes edges. All five candidates are PENDING and none shipped in the Wave-0 record (030 §14, where only Code-Graph Q4-C1 shipped, in a different sub-phase). The plan anchors on the one clean GO of the edge-governance cluster — a driver-level closed-vocabulary CHECK on `edge_type` — and layers three additive governance siblings that the research deferred onto the tombstone and edge-identity substrate.

### Unit 1 — Closed-vocabulary `edge_type` CHECK (planned, PENDING; anchor)

The edge table will reject any out-of-vocabulary `edge_type` at the driver, not just by writer discipline. Because SQLite cannot `ALTER ... ADD CHECK`, this is the first table-rebuild migration in this schema (today `ensureSchemaMigrations` is purely additive) and bumps `SCHEMA_VERSION` from 5. A mandatory pre-migration `SELECT DISTINCT edge_type` scan — including nullable `tombstone.edge_type` rows — runs first so the rebuild never hard-fails on a legacy value. The CHECK admits the 10 live relations plus `SUPERSEDES`, so the sibling rename-lineage phase is not blocked.

### Unit 2 — Per-run heuristic churn cap (planned, PENDING)

The two heuristic edge-write sites — cross-file `CALLS` and cross-file `TESTED_BY` — gain a per-run cap so a pathological scan cannot write unbounded low-confidence edges. The cap is additive (1.0-confidence structural edges untouched) and integrates with the existing edge-drift accounting so dropped edges are observable. The per-pair revision cap is deferred: it needs cross-scan edge identity the per-scan rebuild model lacks.

### Unit 3 — Audit-subgraph tombstone extension (planned, PENDING)

The deletion-only tombstone precursor is extended (not replaced) to record edge creation and relabel/revision events, queryable by subject/kind/time, with durable retention instead of the prune-to-100 default. Governance ops then leave a per-decision audit trail wired to the affected entity.

### Unit 4 — Derived-clock supersession tiebreak (planned, PENDING)

The prune supersession tiebreak stops depending on rowid arrival order. The planned change replaces `ORDER BY deleted_at DESC, id DESC` with a derived key `argmax over (valid_from DESC, object_canonical ASC)` — no stored counter, no rowid — so a re-scan of the same content picks the same winner deterministically.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| (none yet) | Planned | No code changes have been made; see spec.md §3 Files to Change for the planned set |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The phase is planned but unimplemented. Delivery, when it happens, lands Unit 1 first (the migration ordering constraint: the `edge_type` rebuild must precede any later edge-type addition so siblings extend the rebuilt table) and ships the four units as separate scoped commits behind the per-candidate gates in checklist.md. The closed-vocab migration is the only blast-radius-bearing change; it is gated by the pre-migration DISTINCT scan against a live DB and a round-trip row-count test. Units 2-4 are additive. All cited seams below were confirmed against live code during planning.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Anchor on closed-vocab CHECK; defer the rest of the edge-governance cluster | Of the iter-9 cluster, only closed-vocab-CHECK is a clean GO; edge-bitemporal-lifecycle is NO-GO (per-scan rebuild fights never-delete versioning; tombstones already cover deletion-history) — research iter-013. |
| Mandatory pre-migration `SELECT DISTINCT edge_type` scan before the rebuild | A rebuild adding the CHECK hard-fails on any legacy / out-of-vocab row (incl. nullable `tombstone.edge_type`); the iter-024 "no risk" claim was explicitly unverified. Abort all-or-nothing, never a half-rebuild. |
| Co-admit `SUPERSEDES` in the closed vocab; order the rebuild FIRST | The sibling rename-lineage phase (Q1-C2) emits a `SUPERSEDES` edge; admitting it now avoids a second migration (iter-023 build sequence Phase-1). |
| Ship only the per-run churn cap; defer the per-pair revision cap | The per-run cap is a clean additive guard at the 2 heuristic write sites; the per-pair cap needs cross-scan edge identity the rebuild model lacks (couples to history) — iter-013. |
| EXTEND the tombstone precursor for audit; do not add a new table | The `code_graph_tombstones` store is already queryable by kind/reason/time — extend it with creation/relabel events + retention rather than duplicate it (iter-013 CAUTION). |
| Derived supersession key on stored derived fields only | `(valid_from DESC, object_canonical ASC)` with no stored counter/rowid keeps the winner order-independent across re-scans (aionforge derived-logical-clock; iter-008). |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Seam: `code_edges.edge_type` is `TEXT NOT NULL`, no CHECK `code-graph-db.ts:184` | PASS (confirmed in live code) |
| Seam: `parser_skip_list` CHECK pattern `code-graph-db.ts:208` (the mirror) | PASS (confirmed) |
| Seam: nullable `tombstone.edge_type` `code-graph-db.ts:256`; tombstone store `:250-262`, env gate `:230`, prune-100 `:232` | PASS (confirmed) |
| Seam: prune tiebreak `ORDER BY deleted_at DESC, id DESC` `code-graph-db.ts:279` and `:1493` | PASS (confirmed — both sites) |
| Seam: heuristic write sites — `CALLS` `structural-indexer.ts:1146`, `TESTED_BY` `:2058` | PASS (confirmed in live code) |
| Seam: `SCHEMA_VERSION = 5` `:145`; `ensureSchemaMigrations` additive-only `:450`; 10 relations `indexer-types.ts:20-22` | PASS (confirmed) |
| Pre-migration live-DB DISTINCT vocab scan | NOT RUN — gates migration safety (the iter-024 unverified gap) |
| `validate.sh --strict` on this folder | PASS (target state; run before any completion claim) |
| Unit tests (CHECK reject/admit, round-trip, churn cap, audit query, derived-clock determinism) | NOT RUN — code unimplemented |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **All five candidates are unimplemented.** This folder is planning-only; no code exists yet.
2. **The live `edge_type` vocabulary is unverified.** The table-rebuild migration cannot be promised safe until the pre-migration `SELECT DISTINCT edge_type` scan runs against a real DB (research iter-023/024 flagged "no risk" as unverified).
3. **No benefit number is benchmarked.** Per the 028 research, every leverage/effort tag is structural inference, never a measured delta.
4. **The per-pair churn cap is out of scope.** Only the per-run cap is planned; the per-pair revision cap is deferred for lack of cross-scan edge identity in the per-scan rebuild model.
5. **Edge-bitemporal-lifecycle is NO-GO, not deferred.** The per-scan DELETE+re-INSERT rebuild is fundamentally incompatible with never-delete edge versioning; this phase deliberately excludes it.
<!-- /ANCHOR:limitations -->
