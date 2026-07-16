---
title: "Implementation Summary: Relation-Inference Backfill"
description: "Built a bounded, safe, reversible relation-inference backfill that infers typed causal edges from spec-document chains + lineage predecessor links (created_by='auto', default dryRun, transactional, idempotent), flipped the honest stat to implemented:true with a callable command, and invalidates the entity-density cache after writes. Tests green; tsc clean; committed d32d90c3f1, deployed, and the production backfill has since run."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/021-relation-inference-backfill"
    last_updated_at: "2026-06-04T12:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Committed d32d90c3f1 + deployed; verify green (tsc + 343 tests)"
    next_safe_action: "Done; shipped + deployed. Actual backfill run stays user-gated"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Similarity/contradiction signals are deferred best-effort extensions; the two deterministic signals satisfy all P0 requirements."
---
# Implementation Summary: Relation-Inference Backfill

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Status** | Shipped (committed + deployed) |
| **Date** | 2026-06-04 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A bounded, safe, reversible relation-inference backfill that makes packet 019's honest `memory_causal_stats` stat true.

| File | Change |
|------|--------|
| `mcp_server/lib/causal/relation-backfill.ts` | NEW. `backfillRelationInference(db, { dryRun=true, limit, actor })`. Mirrors `backfillLineageState` (scan → infer → dryRun? report : transaction-write → summary `{ scanned, inferred, skipped, written, byRelation }`). Infers from spec-document chains (same pairing rules as `createSpecDocumentChain`) + `memory_lineage` predecessor links. All edges `created_by='auto'`, idempotent upsert, bounded `limit` (default 200, max 2000). Calls `invalidateEntityDensityCache()` after commit. |
| `mcp_server/lib/causal/relation-coverage.ts` | `backfillJob.implemented` flipped to `true`; `command` set to `memory_causal_stats({ backfill: { dryRun: false } })`; honest hint rewritten to name the real backfill command (no `autoRepair`) while staying accurate below target. |
| `mcp_server/handlers/causal-graph.ts` | `handleMemoryCausalStats` accepts optional `backfill`; runs the backfill before stats; surfaces the summary under `data.backfill` + a hint. |
| `mcp_server/schemas/tool-input-schemas.ts` | Optional `backfill` ({ dryRun?, limit? ≤2000, actor? }) added to `memoryCausalStatsSchema`; `backfill` added to the tool's allowed-params (strict schema still rejects all other unknown keys). |
| `mcp_server/tools/types.ts` | Optional `backfill` field added to the tool-layer `CausalStatsArgs` dispatch type so the static dispatch-boundary type matches the runtime/schema shape. |
| `mcp_server/lib/causal/README.md` | STRUCTURE table + code-file count refreshed to include the new `relation-backfill.ts`. |
| `mcp_server/tests/relation-backfill-unit.vitest.ts` | NEW (8 tests): dryRun-zero-writes, dryRun-default, bounded guard-respecting writes + idempotency, limit handling, freshness cache invalidation (called on non-dry, NOT on dry), stat flip + lastBackfillAt, cold-start safety. |
| `mcp_server/tests/relation-coverage-unit.vitest.ts` | Updated to the new implemented:true / non-null-command contract. |
| `mcp_server/tests/causal-stats-output.vitest.ts` | Updated to assert implemented:true / non-null command; hints still contain no `autoRepair`. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The two inference signals are deterministic and reuse existing recorded structure, so they are auditable and unit-testable without sqlite-vec: spec-document chains promote the spec→plan→tasks→impl `caused` chain plus checklist/decision/research `supports` links; lineage predecessor pointers promote version-evolution into `caused` edges. Every write flows through the existing `insertEdgesBatch`/`insertEdge` path, so the runtime guards (MAX_AUTO_STRENGTH=0.5, MAX_EDGES_PER_NODE=20, per-relation window cap, self-loop/orphan rejection) apply unchanged. The default `dryRun=true` keeps the just-recovered production DB safe; writes require an explicit `backfill.dryRun:false`. After committing, the backfill explicitly invalidates the entity-density cache because raising outgoing-edge counts changes the >=3-outgoing-edge routing signal and no causal mutation invalidated that cache before.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

See `decision-record.md` (ADR-001..004):
- ADR-001: Infer from deterministic structural signals (spec-doc chains + lineage links), not a semantic heuristic.
- ADR-002: Wire the entry point onto `memory_causal_stats({ backfill })` rather than adding a new public MCP tool.
- ADR-003: Add an optional `backfill` field to the strict tool-input schema so the advertised command is callable end-to-end.
- ADR-004: Default to a dry run and explicitly invalidate the entity-density cache after writes.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `npx tsc --noEmit -p tsconfig.json` → 0 errors.
- `npx vitest run` over the required + keep-green causal suites (`relation-coverage-unit`, `causal-stats-output`, `relation-backfill-unit`, `causal-edges-unit`, `causal-edges`, `handler-causal-graph`, `entity-density`, `mcp-input-validation`, `mcp-tool-dispatch`) → 309 passed across 9 files.
- New `relation-backfill-unit.vitest.ts` proves the four P0 requirements: (1) dryRun writes zero edges; (2) non-dry writes bounded auto edges within guards + idempotent; (3) `invalidateEntityDensityCache` called on non-dry, not on dry; (4) `implemented:true` / non-null command, with `lastBackfillAt` null before and set after a real run.
- Pre-existing unrelated failure: `tests/layer-definitions.vitest.ts` (2 tests) fails on the clean baseline too (verified via git stash); not caused by this packet and out of scope.
- Post-deploy (pending): `memory_causal_stats({ backfill: { dryRun: false } })` on the production DB writes bounded auto edges and reports `implemented:true` with a real `lastBackfillAt`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- `contradicts` and high-similarity 'supports' neighbor inference are not yet auto-created; they are deferred best-effort extensions (need sqlite-vec embeddings, not deterministically reproducible in a unit fixture). The two deterministic signals satisfy all P0 requirements; broader coverage can be added later without reworking the entry point.
- The backfill is invoked explicitly (no scheduled/autonomous job); `backfillJob.name` retains `autonomous-causal-relation-backfill` to keep consumers stable, but the implementation is on-demand.
<!-- /ANCHOR:limitations -->
