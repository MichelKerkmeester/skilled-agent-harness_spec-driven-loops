---
title: "Implementation Summary: Bi-temporal Window for Spec-Kit Memory Causal + Lineage"
description: "Schema-migration foundation complete: Memory MCP schema v38 adds the causal + lineage bi-temporal window with explicit UP/BACKFILL/DOWN helpers, default-off recall consumption and migration tests. Behavior consumers remain deferred."
trigger_phrases:
  - "bitemporal window memory implementation summary"
  - "skip closed in sweep shipped"
  - "event-time invalidation pending"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/007-bitemporal-window"
    last_updated_at: "2026-07-06T19:16:29.355Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented schema-migration foundation for the bi-temporal window"
    next_safe_action: "Run final broad verification and strict phase validation"
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
      session_id: "2026-06-19-028-001-007-bitemporal-window"
      parent_session_id: null
    completion_pct: 85
    open_questions:
      - "Is the C3-B four-timestamp window additive against active_memory_projection?"
    answered_questions:
      - "skip-closed-in-sweep is SHIPPED (030 e1c6a3c793)"
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
| **Spec Folder** | 007-bitemporal-window |
| **Status** | complete |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This implementation lands the schema-migration foundation for the Memory MCP's causal + lineage bi-temporal window. It does not enable live recall/currentness behavior that consumes transaction-time windows. Those consumers stay default-off behind `SPECKIT_BITEMPORAL_RECALL` until benchmark evidence exists.

Status is **complete** at the schema-foundation level: the C3-B migration shipped and skip-closed-in-sweep shipped, while the behavior consumers (the event-time spearhead, chronology invalidation, transaction-time recall) are deferred to later phases. The result is benchmark-gated and shadow-only, the `SPECKIT_BITEMPORAL_RECALL` flag was later removed in the flag-resolution reckoning (see decision-record.md), so "complete" here means the foundation work concluded, not that live recall behavior is on.

### skip-closed-in-sweep (SHIPPED)

Closed generated causal edges are now skipped during frontmatter-promoter cleanup. The promoter's stale-edge query gained an `AND invalid_at IS NULL` open-edge clause (`openEdgeClause`), applied only when the schema actually has the column, so already-closed edges are left intact and fixtures without the column stay compatible. This shipped in 030 commit `e1c6a3c793` (030 spec §14 row 9) as cheap defensive hardening ahead of the live edge-presence retirement path, not as a data-loss gate (the collision it guards is theoretical and tombstone-recoverable, per 005 iter-032).

### MEM-fact-invalidation-event-time (PENDING, the spearhead)

The planned change makes `invalidateEdge()` stamp the close timestamp with the superseding fact's lineage event-time instead of `new Date().toISOString()`. It is reader-transparent: all three current-edge readers use a binary `invalid_at IS NULL` test, so only the writer's stamped value changes. A missing event-time falls back to `now()` to preserve the fail-open contract. High leverage, small effort.

### C3-B four-timestamp window (DONE, schema foundation)

`SCHEMA_VERSION` now moves from 37 to 38. The v38 migration adds `valid_from`, `valid_to`, `ingested_at` and `expired_at` to `causal_edges`, and adds the missing transaction-time `ingested_at`/`expired_at` columns to `memory_lineage`. Legacy causal `valid_at`/`invalid_at` columns are preserved for reader transparency. Current readers continue to filter on `invalid_at IS NULL`.

The migration exposes three explicit helpers:

| Helper | Role |
|--------|------|
| `ensureBitemporalWindowSchema` | UP: add additive columns and invoke backfill inside the existing transaction-wrapped migration harness |
| `backfillBitemporalWindow` | BACKFILL: derive causal event windows from `valid_at`/`invalid_at` when present and transaction ingestion from `extracted_at`. Derive lineage ingestion from `created_at` and legacy close from `valid_to` |
| `rollbackBitemporalWindowSchema` | DOWN: drop only the v38 columns, preserving legacy `valid_at`/`invalid_at` |

Future schema phases should extend this pattern: single `SCHEMA_VERSION` bump, one named UP helper, one explicit BACKFILL helper, one testable DOWN helper, idempotent column/index creation, fail-closed preconditions for required base tables and default-off behavior consumers until a benchmark promotes them.

### GR-temporal-ordering-invalidation (PENDING)

Chronology-driven supersession: when two edges on the same pair conflict, the chronologically-earlier `valid_at` is auto-invalidated. Scoped strictly to conflicting/superseding relation pairs so co-valid, non-conflicting facts are never retired.

### C3-D separation-of-concerns note (PENDING)

A decision note (ADR-003) recording that tombstone-sweep (forgetting) and temporal-close (not-current) are distinct lifecycle operations, and that skip-closed ships as hardening rather than a gate.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The schema foundation was delivered as a coordinated v38 migration in `lib/search/vector-index-schema.ts`, with runtime schema convergence in `lib/graph/temporal-edges.ts`, writer-side timestamp population in causal/lineage writers and a default-off recall gate in `lib/search/search-flags.ts` / `ENV_REFERENCE.md`. The migration tests cover UP, BACKFILL, DOWN, idempotent rerun and fresh database initialization.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Source event-time from lineage, treat causal `invalid_at` as a derived projection (ADR-001) | Lineage is the only store that already models event-time. Sourcing from the causal projection would reintroduce the same conflation one layer down |
| Exclude retention TTL from the bi-temporal consumer set (ADR-002) | Physical deletion is the opposite of edge-presence currentness. Folding it in is a category error that forks a third store |
| Classify skip-closed as defensive hardening, not a C3-A gate (ADR-003) | Adversarial verification (005 iter-032) found the guarded collision theoretical and tombstone-recoverable. Gating C3-A on it would be unfounded conservatism |
| Keep the spearhead reader-transparent | All three readers use `IS NULL`. Changing only the writer's stamped value keeps the win at H/S and avoids a read-path rewrite |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| skip-closed-in-sweep shipped + tested | PASS (030 `e1c6a3c793`, closed-edge fixture) |
| MEM-fact-invalidation-event-time | PENDING (planned, seam confirmed `temporal-edges.ts:81,86,94`) |
| C3-B four-timestamp window | PASS (v38 UP/BACKFILL/DOWN, fresh-init and idempotency tests) |
| `npm run typecheck` | PASS (exit 0) |
| Focused migration/temporal/search flag Vitest | PASS (`4` files, `84` tests) |
| Broad memory/schema/search/migration Vitest | BASELINE-MATCH (`7 failed | 94 passed`, `13 failed | 1493 passed | 105 skipped`, same 13 failures as baseline, 6 new tests passing) |
| GR-temporal-ordering-invalidation | PENDING (scope test for co-valid pairs not yet written) |
| C3-D separation note | RECORDED (decision-record ADR-003) |
| `validate.sh --strict` on this folder | PASS (0 errors / 0 warnings) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Behavior consumers are still deferred.** This implementation lands the schema foundation only. Event-time invalidation plumbing, chronology invalidation and transaction-time recall behavior remain gated or pending.
2. **No benefit number is measured.** Every leverage/effort tag in research is structural inference, never a benchmarked delta (research §6). The spearhead's H rating is inferred from the correctness fix, not a measured recall gain.
3. **Legacy transaction close time is approximate.** Existing closed rows have no stored transaction-close timestamp, so backfill maps legacy close information into `expired_at`. Future lineage writes use the write timestamp for transaction close.
4. **C3-A and C3-C are out of scope.** The live edge-presence retirement path (C3-A) and the transaction-time recall modes (C3-C, L effort) depend on C3-B and live in later phases.
<!-- /ANCHOR:limitations -->
