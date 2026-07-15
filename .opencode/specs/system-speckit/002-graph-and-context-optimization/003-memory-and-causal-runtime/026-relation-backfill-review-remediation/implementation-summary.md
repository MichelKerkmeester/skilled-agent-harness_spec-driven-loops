---
title: "Implementation Summary: Relation-Backfill Review Remediation"
description: "Remediated the relation-inference backfill deep-review findings: a relation-agnostic conflict guard (hasConflictingValidEdge, reusing relationsConflict) stops a committed backfill from silently invalidating a pre-existing valid edge; written/byRelation now come from a committed valid-auto-edge delta (honest on re-runs); the inner backfill schema is strict; and five maintainability P2s are cleared. tsc clean; 179 tests green across 9 suites; committed bb61e8864e, deployed, and the production backfill was executed (302 new edges, skippedConflicting 0)."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/026-relation-backfill-review-remediation"
    last_updated_at: "2026-06-04T15:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Committed bb61e8864e + deployed, production backfill executed (302 edges)"
    next_safe_action: "Done. Shipped + deployed + backfilled, guard held (skippedConflicting 0)"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Suppress the conflicting backfill emission rather than alter the contradiction-detection labeling; the contradicts direction is intentional."
---
# Implementation Summary: Relation-Backfill Review Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Status** | Shipped (committed + deployed + production backfill executed) |
| **Date** | 2026-06-04 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A targeted remediation of the relation-inference backfill subsystem in response to a deep review.

| File | Change |
|------|--------|
| `mcp_server/lib/causal/relation-backfill.ts` | Conflict guard `hasConflictingValidEdge` (column-aware, reuses `relationsConflict`, fails open) + `insertNonConflictingEdges` (filter+insert, returns skipped) + `insertInferredEdges` (single batch helper for all collectors). Transaction reordered so non-conflicting edges insert first; conflict-prone collectors are filtered against the in-transaction valid edge set. New result field `skippedConflicting`. `written`/`byRelation` now derived from a before/after `countValidAutoEdgesByRelation` delta (replaces the over-counting `countWrittenByRelation`). P2s: dropped the unused `createSpecDocumentChain` import, removed the dead `bumpRelation(...,0)` no-op loop, named the spec-chain strength literals (`SPEC_CHAIN_CAUSED_STRENGTH`/`SPEC_CHAIN_SUPPORTS_STRENGTH`) and corrected the lock-step comment. |
| `mcp_server/lib/graph/contradiction-detection.ts` | Exported `relationsConflict` so the guard reuses the single conflict-rule source. |
| `mcp_server/schemas/tool-input-schemas.ts` | Inner `backfill` object now built via `getSchema`, so it rejects unknown keys (a typo'd `contradict`/`threshold` throws instead of being silently dropped). |
| `mcp_server/handlers/causal-graph.ts` | Honest hint ("wrote N new auto edges") + surfaces `skippedConflicting` when non-zero. |
| `mcp_server/tests/relation-backfill-conflict.vitest.ts` | NEW (5 cases): reciprocal caused-survives + contradicts-skipped + skippedConflicting; pre-existing manual edge survives; written===0 on re-run; byRelation equals the live valid-auto SQL distribution; strict inner schema rejects a typo'd key. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The defect was reproduced first: a committed `{ contradicts:true }` run over a reciprocal lineage pair (`20.superseded_by=21`, `21.predecessor=20`) inserted `caused` 20->21, then `contradicts` 20->21, whose contradiction-detection set `invalid_at` on the valid `caused` edge. The fix keeps the detector and the `contradicts` labeling untouched and instead suppresses the conflicting backfill EMISSION: the non-conflicting collectors (spec-chain + lineage `caused`, then similarity `supports`) insert first, and each conflict-prone candidate is checked against the now-current, in-transaction valid edges via `hasConflictingValidEdge`. Because the guard reuses `relationsConflict`, it protects every conflicting pair the detector knows and every pre-existing valid edge — auto or manual. Counting was made honest by snapshotting valid `created_by='auto'` edges by relation before and after the commit and reporting only the positive delta, which naturally yields `written=0` on re-runs and excludes any invalidated edge. Both guard and counters are column-aware so they degrade gracefully on a DB without the temporal `invalid_at` column.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

See `decision-record.md` (ADR-001..004):
- ADR-001: Suppress the conflicting backfill emission; do not change the contradiction-detection labeling.
- ADR-002: Make the conflict guard relation-agnostic by reusing `relationsConflict` (protects manual + auto for any conflicting relation).
- ADR-003: Report `written`/`byRelation` from the committed valid-auto-edge delta instead of upsert counts.
- ADR-004: Make the inner `backfill` schema strict via `getSchema`.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `npx tsc --noEmit` → 0 errors.
- `npx vitest run` over the required + keep-green suites (`relation-backfill-unit`, `relation-backfill-similarity`, `relation-backfill-conflict`, `relation-coverage-unit`, `causal-stats-output`, `causal-edges-unit`, `handler-causal-graph`, `mcp-input-validation`, `contradiction-detection`) → 179 passed across 9 files.
- New `relation-backfill-conflict.vitest.ts` proves the four P0 requirements + the two P1 honesty requirements: reciprocal `caused` stays valid while the conflicting `contradicts` is skipped (`skippedConflicting >= 1`); a pre-existing manual `caused` survives; `written===0` on a second committed run; `result.byRelation` deep-equals the live valid-auto-edge distribution.
- Comment-hygiene: grep confirms no spec-path/packet/ADR/REQ/CHK/finding ids remain in production code comments.
- Post-deploy (executed 2026-06-04): `memory_causal_stats({ backfill: { dryRun:false, similarity:true, contradicts:true, limit:2000 } })` ran on the production DB. Scanned 2926, inferred 1810, written 302 (caused 102, contradicts 100, supports 100, each at the per-relation 100/15min window cap), skippedConflicting 0 (no invalidation, the SEC-001 guard held in production). Coverage rose 39.91% to 43.59% (total_edges 9258 to 9608), caused 3 to 103 (still below the 5% target structurally because `supports` dominates the inferred distribution).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Supersession `contradicts` is intentionally NOT auto-created on a pair that already carries a valid conflicting `caused` (or any conflicting valid edge). An explicit `contradicts` can still be added via `memory_causal_link` if a real contradiction (not an evolution) is recorded.
- When both a similarity `supports` and a supersession `contradicts` candidate target the same pair, the first-inserted (`supports`) wins and the `contradicts` is skipped; this is deterministic by insert order, not a value judgement between the two signals.
<!-- /ANCHOR:limitations -->
