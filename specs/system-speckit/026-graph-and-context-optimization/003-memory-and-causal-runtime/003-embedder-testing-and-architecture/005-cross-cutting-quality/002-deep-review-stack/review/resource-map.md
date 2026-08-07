---
title: "Resource Map — 020 Deep-Review"
description: "Per-file finding count across the 20-iteration deep-review of the 016-019 embedder/rescue/registry stack."
trigger_phrases:
  - "020 resource map"
  - "deep review file coverage"
importance_tier: "useful"
contextType: "review"
---
<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v1.0 -->

# Resource Map — Files Reviewed + Finding Counts

## TypeScript (mk-spec-memory) — 1900+ LOC reviewed

| File | LOC | P0 (raw) | P0 (adjudicated) | P1 (raw) | P2 (raw) | Iters touching |
|------|-----|----------|------------------|----------|----------|----------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapter.ts` | 58 | 0 | 0 | 1 | 0 | 1, 4, 18 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts` | 42 | 0 | 0 | 0 | 0 | 1, 4 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts` | 192 | 1 (downgrade) | 0 | 4 | 2 | 1, 4, 11, 12, 14, 16, 17, 18 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | 408 | 3 (1 downgrade + 2 real) | 0 | 8 | 5 | 1, 2, 3, 4, 11, 12, 13, 15, 18, 19 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts` | 136 | 1 (REAL) | **1 (P0-A)** | 0 | 1 | 1, 4, 14 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/types.ts` | 76 | 0 | 0 | 0 | 0 | 1, 4 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/ollama.ts` | 296 | 1 (downgrade) | 0 | 4 | 4 | 1, 2, 4, 10, 13, 18, 20 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts` | 382 | 4 (1 false-positive + 1 downgrade + 2 REAL) | **2 (P0-B, P0-C)** | 6 | 4 | 1, 2, 3, 4, 11, 13, 15 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` | 1478 | 6 (all downgrades) | 0 | 12 | 9 | 9, 10, 11, 12, 13, 15, 16, 17, 19, 20 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-list.ts` | 111 | 0 | 0 | 2 | 2 | 2, 3, 4, 10 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts` | 79 | 1 (downgrade) | 0 | 3 | 2 | 2, 3, 4, 10, 12, 15 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts` | 86 | 0 | 0 | 1 | 1 | 2, 3, 4, 10 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/dist-freshness.vitest.ts` | 106 | 1 (FALSE-POSITIVE) | 0 | 1 | 1 | 4, 11, 12, 19, 20 |

**Subtotal TS:** ~17 raw P0, **3 confirmed P0**, ~42 P1, ~31 P2.

## Python (CocoIndex) — 439 LOC reviewed

| File | LOC | P0 (raw) | P0 (adjudicated) | P1 (raw) | P2 (raw) | Iters touching |
|------|-----|----------|------------------|----------|----------|----------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | 167 | 6 (5 downgrades + 1 contested) | 0 | 6 | 6 | 5, 6, 7, 8, 17, 18 |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py` | 140 | 0 | 0 | 2 | 2 | 5, 6, 7, 8, 17, 18 |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py` | 62 | 0 | 0 | 0 | 3 | 5, 8 |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_registered_embedders.py` | 70 | 0 | 0 | 0 | 1 | 5, 8 |

**Subtotal Python:** 6 raw P0 (all downgrade or contested), **0 confirmed P0**, 8 P1, 12 P2.

## Cross-Stack Contract (iter 17)

Files touching both sides simultaneously:
- TS registry.ts:29-93 (MANIFESTS) ↔ Python registered_embedders.py:49-110 (MANIFESTS) — zero overlap (P1).
- TS schema.ts (DEFAULT_ACTIVE_EMBEDDER) ↔ Python config.py (_DEFAULT_MODEL) — different defaults (P1).

## Summary

- **20 iters complete**, all 4 dimensions × 5 passes each
- **16 in-scope files reviewed**; 0 out-of-scope files modified
- **Total raw findings:** 34 P0 + 54 P1 + 56 P2 = 144
- **Adjudicated P0:** 3 (P0-A schema.ts, P0-B + P0-C retrieval-rescue.ts)
- **Adjudicated P1:** ~50 (after re-tiering aggressive Devin P0s)
- **False positives:** 3 (z_archive regex iter 1, runningJobs race iter 2, dist-freshness missing iter 20)
- **Verified correct (positive observations):** rescue layer wiring, sortDeterministicRows, score normalization, async patterns, 17 `Number.isFinite` checks, DB ID handling — all from iter 9

See `review-report.md` for the full verdict + recommendations.
