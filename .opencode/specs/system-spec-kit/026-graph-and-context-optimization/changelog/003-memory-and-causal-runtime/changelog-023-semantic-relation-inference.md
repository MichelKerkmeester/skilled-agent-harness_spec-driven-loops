---
title: "Semantic Relation Inference (similarity + contradicts collectors)"
description: "Added the two deferred OPT-IN collectors to backfillRelationInference: a similarity 'supports' collector reading only the cached memory_index.related_memories column (threshold 75, top K<=5, strength ~0.35) and a 'contradicts' collector from structural memory_lineage.superseded_by_memory_id (strength ~0.3). Both default false, inherit the dryRun-default plus bounded safety, and emit created_by='auto' edges."
trigger_phrases:
  - "semantic relation inference collectors"
  - "similarity supports causal edges"
  - "contradicts supersession causal edges"
  - "related_memories backfill collector"
  - "023-semantic-relation-inference"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-04

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/023-semantic-relation-inference` (Level 3)

### Summary

Packet 021 built the bounded relation-inference backfill with two deterministic collectors (spec-document chains plus lineage `caused` links) and explicitly deferred the similarity `supports` and `contradicts` signals as best-effort extensions. Both signals already existed in the DB (`memory_index.related_memories` cached cosine neighbours, `memory_lineage.superseded_by_memory_id`) but neither was promoted into the causal graph.

This packet shipped those two as OPT-IN collectors (default false) that reuse the same safety envelope: `dryRun` default true, bounded by `limit`, every edge `created_by='auto'` so it inherits `insertEdge`'s runtime guards. The similarity collector reads ONLY the pre-computed `related_memories` column, no live `vector_search`/sqlite-vec scan and no O(n^2) all-pairs work, so it is deterministic and unit-testable. The `contradicts` collector is driven by structural supersession, never embedding similarity, to avoid semantic false positives. Committed as `b834150fe5`.

### Added

- `collectSimilarityEdges` in `relation-backfill.ts`: reads only the cached `memory_index.related_memories` column, keeps neighbours `similarity >= threshold` (default 75, configurable 1-100), takes top K<=5, excludes self plus spec-chain pairs, emits `supports` at strength ~0.35.
- `collectSupersessionEdges`: emits predecessor-to-successor `contradicts` at strength ~0.3 from `superseded_by_memory_id`.
- Helpers `parseRelatedNeighbors`, `columnExists`, `pairKey`, plus options `similarity?`/`contradicts?`/`similarityThreshold?` on `BackfillRelationInferenceOptions` (defaults false/false/75, threshold clamped 1-100).
- `tests/relation-backfill-similarity.vitest.ts` (11 tests): opt-in default off, dry-run zero writes with both on, bounded similarity (threshold/K/strength/auto), custom threshold, contradicts-from-supersession, idempotency, graceful no-op on empty plus unparseable, genuinely-absent schema, spec-chain pair dedup (direction-agnostic), and schema rejection of bad `similarityThreshold` / `similarity` type.

### Changed

- `relation-coverage.ts`: honest hint updated to advertise the opt-in collectors via `memory_causal_stats({ backfill: { dryRun:false, similarity:true, contradicts:true } })`.
- `handlers/causal-graph.ts`: local `backfill` interface plus handler pass-through thread `similarity`/`contradicts`/`similarityThreshold` into `backfillRelationInference`.
- `schemas/tool-input-schemas.ts`: `memoryCausalStatsSchema.backfill` gains optional `similarity`/`contradicts` booleans plus `similarityThreshold` (`positiveIntMax(100)`).
- `tools/types.ts`: `CausalStatsArgs.backfill` extended with `similarity?`/`contradicts?`/`similarityThreshold?`.

### Fixed

None. Additive opt-in collectors. The existing default `memory_causal_stats({ backfill })` contract is unchanged.

### Verification

| Check | Result |
|-------|--------|
| `tsc --noEmit --composite false -p tsconfig.json` | PASS (0 errors) |
| `vitest run` over the new plus keep-green suites (7 files) | PASS (169 passed) |
| 4 P0 requirements in `relation-backfill-similarity.vitest.ts` | PASS (opt-in off by default, dryRun zero with both on, bounded supports writes threshold/K/strength, contradicts-from-supersession) |
| Post-deploy dry run (read-only, via daemon IPC) | `memory_causal_stats({ backfill: { dryRun:true, similarity:true, contradicts:true } })` reported scanned 600, inferred 421 (caused 218 / contradicts 200 / supports 3), written 0 |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts` | Two opt-in collectors plus parse/column/pair helpers plus options |
| `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-coverage.ts` | Honest hint advertises the opt-in collectors |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts` | Thread similarity/contradicts/similarityThreshold |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Add similarity/contradicts/similarityThreshold to the backfill object |
| `.opencode/skills/system-spec-kit/mcp_server/tools/types.ts` | Extend `CausalStatsArgs.backfill` |
| `.opencode/skills/system-spec-kit/mcp_server/tests/relation-backfill-similarity.vitest.ts` | NEW. 11 tests for opt-in/dry/bounded/idempotent/no-op |
| `.opencode/skills/system-spec-kit/mcp_server/lib/causal/README.md` | STRUCTURE entry for relation-backfill.ts notes the two opt-in collectors |

### Follow-Ups

- Broader `supports`/`contradicts` coverage is still limited. The similarity collector is only as fresh as the cached `related_memories` column, and `contradicts` covers only recorded supersession pairs. Other contradictions still require explicit `memory_causal_link`.
- Deep review (`review/review-report.md`) confirmed SEC-001: the opt-in `contradicts` collector can silently invalidate the `caused` edge on the same reciprocal lineage pair (and pre-existing valid edges). Until the remediation in packet 026 lands, do NOT enable `contradicts` in a non-dry run.
- Both collectors remain OPT-IN. They do not run for default `memory_causal_stats({ backfill })` callers until the flags are passed.
