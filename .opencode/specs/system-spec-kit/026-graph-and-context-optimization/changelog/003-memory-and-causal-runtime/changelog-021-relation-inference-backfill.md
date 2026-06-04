---
title: "Relation-Inference Backfill"
description: "Built a bounded, dryRun-default, reversible relation-inference backfill that promotes spec-document chains and lineage predecessor links into created_by='auto' causal edges, invalidates the entity-density cache after writes, and flips packet 019's honest backfillJob stat to implemented:true with a callable command."
trigger_phrases:
  - "relation inference backfill"
  - "causal relation auto edges"
  - "memory_causal_stats backfill command"
  - "spec document chain causal edges"
  - "021-relation-inference-backfill"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-04

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/021-relation-inference-backfill` (Level 3)

### Summary

Packet 019 corrected `memory_causal_stats` to honestly report that no command balances relation coverage (`backfillJob.implemented:false`, `command:null`). The honest stat was correct but the underlying capability was missing. There was no safe, auditable way to raise typed relation coverage (`caused`/`supports`) without manual `memory_causal_link` calls, even though the system carried strong structural signals (spec-document chains, lineage version links) that already encode causal relationships.

This packet built the missing piece, a bounded, safe, reversible relation-inference backfill that promotes existing deterministic structural signals into typed `created_by='auto'` causal edges, then made the honest stat true. The two inference signals are deterministic and reuse recorded structure, so they are auditable and unit-testable without sqlite-vec. Default `dryRun=true` keeps the recovered production DB safe. Committed and deployed as `d32d90c3f1`.

### Added

- `lib/causal/relation-backfill.ts`: `backfillRelationInference(db, { dryRun=true, limit, actor })`, mirroring `backfillLineageState` (scan, infer, dryRun? report : transaction-write, summary `{ scanned, inferred, skipped, written, byRelation }`). Infers from spec-document chains (same pairing rules as `createSpecDocumentChain`) plus `memory_lineage` predecessor links. All edges `created_by='auto'`, idempotent upsert, bounded `limit` (default 200, max 2000).
- `tests/relation-backfill-unit.vitest.ts` (8 tests): dryRun-zero-writes, dryRun-default, bounded guard-respecting writes plus idempotency, limit handling, freshness-cache invalidation (called on non-dry, not on dry), stat flip plus `lastBackfillAt`, cold-start safety.
- Optional `backfill` ({ dryRun?, limit? max 2000, actor? }) on `memoryCausalStatsSchema`, added to the tool's allowed params so the advertised command is callable end-to-end.

### Changed

- `relation-coverage.ts`: `backfillJob.implemented` flipped to `true`, `command` set to `memory_causal_stats({ backfill: { dryRun: false } })`, and the honest hint rewritten to name the real backfill command (no `autoRepair`) while staying accurate below target.
- `handlers/causal-graph.ts`: `handleMemoryCausalStats` accepts optional `backfill`, runs the backfill before stats, and surfaces the summary under `data.backfill` plus a hint.
- `tools/types.ts`: optional `backfill` field added to `CausalStatsArgs` so the static dispatch-boundary type matches the runtime schema shape.
- `lib/causal/README.md`: STRUCTURE table and code-file count refreshed to include `relation-backfill.ts`.
- `tests/relation-coverage-unit.vitest.ts` and `tests/causal-stats-output.vitest.ts` updated to the new `implemented:true` / non-null-command contract.

### Fixed

- The advertised relation-backfill hint was previously a no-op (the old `memory_health({autoRepair})` path did nothing). Following the hint now creates typed edges and raises coverage.
- The entity-density cache was never invalidated by a causal mutation. The backfill now explicitly calls `invalidateEntityDensityCache()` after commit, because raising outgoing-edge counts changes the 3-or-more-outgoing-edge routing signal.

### Verification

| Check | Result |
|-------|--------|
| `tsc --noEmit -p tsconfig.json` | PASS (0 errors) |
| `vitest run` over the required plus keep-green causal suites (9 files) | PASS (309 passed) |
| 4 P0 requirements in `relation-backfill-unit.vitest.ts` | PASS (dryRun zero-writes, bounded auto writes plus idempotency, cache invalidation on non-dry only, implemented:true / non-null command) |
| Pre-existing unrelated `layer-definitions.vitest.ts` (2 tests) | Fails on clean baseline too (verified via git stash), out of scope, later closed by packet 025 |

### Files Changed

| File | What changed |
|------|--------------|
| `mcp_server/lib/causal/relation-backfill.ts` | NEW. Bounded dryRun-default relation-inference backfill |
| `mcp_server/lib/causal/relation-coverage.ts` | Flip `implemented:true`, set the real command, honest hint |
| `mcp_server/handlers/causal-graph.ts` | Wire optional `backfill` into `memory_causal_stats` |
| `mcp_server/schemas/tool-input-schemas.ts` | Add optional `backfill` to the causal-stats schema |
| `mcp_server/tools/types.ts` | Add optional `backfill` to `CausalStatsArgs` |
| `mcp_server/lib/causal/README.md` | STRUCTURE table and code-file count refreshed |
| `mcp_server/tests/relation-backfill-unit.vitest.ts` | NEW. 8 tests proving the P0 contract |
| `mcp_server/tests/relation-coverage-unit.vitest.ts` | Updated to the implemented:true contract |
| `mcp_server/tests/causal-stats-output.vitest.ts` | Updated to the implemented:true contract |

### Follow-Ups

- `contradicts` and high-similarity `supports` neighbor inference are deferred best-effort extensions (need sqlite-vec embeddings, not deterministically reproducible in a unit fixture). They were later added as opt-in collectors in packet 023.
- Structurally, `caused` stays below the 5% coverage target because `supports` dominates the inferred distribution. The two deterministic signals satisfy all P0 requirements but do not move `caused` to target on their own.
- The backfill is invoked explicitly (no scheduled job). `backfillJob.name` retains `autonomous-causal-relation-backfill` to keep consumers stable, but the implementation is on-demand.
