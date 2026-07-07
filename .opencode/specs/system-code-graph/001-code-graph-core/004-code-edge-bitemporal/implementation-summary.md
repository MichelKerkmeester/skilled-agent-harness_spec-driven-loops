---
title: "Implementation Summary: Code-Edge Bi-temporal Lifecycle (Q1-C1 cluster)"
description: "DONE for the Code Graph schema foundation: SCHEMA_VERSION 6->7 adds nullable code_edges valid_at/invalid_at generation columns with UP/DOWN/BACKFILL helpers, fresh-init support, idempotent fail-closed tests and default-off temporal read consumption."
trigger_phrases:
  - "code edge bitemporal implementation summary"
  - "q1-c1 cluster deferred"
  - "code edge bitemporal schema foundation shipped"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/001-code-graph-core/004-code-edge-bitemporal"
    last_updated_at: "2026-07-06T16:45:37.676Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented code-edge bitemporal schema foundation"
    next_safe_action: "Keep temporal consumers default-off until a named consumer and benchmark exist"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-004-code-edge-bitemporal"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Is there any consumer for as-of/time-travel code-graph reads?"
    answered_questions:
      - "Schema foundation shipped (columns, migration helpers, default-off gate); wider consumer cluster remains DEFER-speculative"
      - "standalone CG-edge-bitemporal-lifecycle is REFUTED (002 iter-013)"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-code-edge-bitemporal |
| **Completed** | Complete |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status is **Complete** in the narrow sense that the schema foundation shipped. The wider lifecycle/timeline consumers stay default-off and gated by decision, so "Complete" here means the shipped schema foundation plus an explicit deferral of the consumer cluster, not a fully un-gated runtime.

The schema foundation was built in `.opencode/skills/system-code-graph/mcp_server`. `code_edges` now has nullable `valid_at` and `invalid_at` generation columns, Code Graph `SCHEMA_VERSION` is 7, and the migration has explicit helpers for UP (`ensureCodeEdgeBitemporalSchema`), BACKFILL (`backfillCodeEdgeBitemporalColumns`) and DOWN (`rollbackCodeEdgeBitemporalSchema`). The fresh database path creates the columns directly. Legacy databases get an idempotent fail-closed migration that backfills `valid_at` from `graph_generation` and leaves `invalid_at` NULL. Default code-graph behavior is unchanged unless a later consumer opts into `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS=true`.

### Q1-C1 / Q1-C1-code-edge-bitemporal (DONE, schema foundation)

The additive schema migration is complete: `valid_at` / `invalid_at` are present in `SCHEMA_SQL` and in the legacy migration path, with rollback and backfill helpers exported for tests and future migration tooling. Reindex close-and-insert behavior is intentionally not wired into default writes.

### Q1-C1-views (PENDING, gated)

The live current-view chokepoint: `CREATE VIEW code_nodes_live`/`code_edges_live` `WHERE invalid_at IS NULL`, with every default read routed through it and the as-of/audit reader deliberately bypassing. This is the de-risk prerequisite, it defines "current" exactly once and localizes the migration so Q1-C1 does not leak the `invalid_at IS NULL` filter across the whole read surface. It MUST co-ship atomically with Q1-C1 in one SCHEMA_VERSION transaction (the aionforge reference, 002 iter-018).

### CG-edge-bitemporal-lifecycle (PENDING, gated, standalone REFUTED)

Edge-granularity versioning (close-and-replace on relabel, one current edge per ordered pair). As a standalone it is REFUTED: the per-scan DELETE+INSERT rebuild fights never-delete versioning, and the existing tombstone machinery already records edge deletion-history (002 iter-013). It survives only as the lifecycle layer ON TOP OF Q1-C1's columns + atomic supersede.

### CG-symbol-timeline-query (PENDING, gated, needs a consumer)

The as-of/time-travel read ("what did the call graph look like at generation/commit N") over the Q1-C1 columns, bypassing the live-view. It has no research seam beyond the Q1-C1 read filter. It is precisely the consumer the rest of the cluster has no demand for today, so it is built only if a real consumer is named.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation is intentionally narrow. It changes `code-graph-db.ts`, adds `code-edge-bitemporal-schema.vitest.ts` and removes a stale exact schema-version assertion from the edge-staleness behavior test. The wider plan remains useful: live-view routing, close-and-insert lifecycle writes and symbol timeline reads still require an explicit consumer path and benchmark before they can consume the new columns.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Ship schema foundation only | User amendment unblocked the careful migration while keeping consumers default-off |
| Keep temporal consumers default-off | Avoids routing default reads/writes through unbenchmarked temporal behavior |
| Standalone CG-edge-bitemporal-lifecycle is REFUTED, layer it on Q1-C1 only (ADR-003) | The per-scan DELETE+INSERT rebuild fights never-delete versioning, and tombstones already record deletion-history (002 iter-013) |
| Share the validity-window shape with Memory C3-B (ADR-004) | The shape is the most-transferable cross-subsystem artifact, forking it defeats the build-once intent, retention TTL excluded |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Typecheck | PASS: `npm run typecheck` in `.opencode/skills/system-code-graph` |
| Focused migration/schema/indexer Vitest | PASS: 5 files, 117 passed, 1 skipped |
| Broad code-graph Vitest | 19 failed, 702 passed, 1 skipped, remaining failures match baseline IPC/socket/drift class |
| Alignment drift | PASS: 160 files scanned, 0 findings |
| Comment hygiene | PASS on modified code/test files |
| `validate.sh --strict` on this folder | PASS: 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Temporal consumers are not enabled by default.** The new columns are schema foundation only unless a later path explicitly uses `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS=true`.
2. **No symbol timeline/as-of reader exists.** The consumer gate still applies.
3. **Close-and-insert writes are not implemented.** Reindex behavior remains byte-identical by default.
4. **No benefit number is measured.** No benchmark was claimed.
5. **The real edge-staleness bug remains separate.** Dependency-transitivity staleness is owned by sibling `002-edge-staleness-correctness`.
<!-- /ANCHOR:limitations -->
