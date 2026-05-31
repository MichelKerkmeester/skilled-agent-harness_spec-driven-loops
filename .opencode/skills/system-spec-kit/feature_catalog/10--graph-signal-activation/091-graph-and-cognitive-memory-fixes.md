---
title: "Graph and cognitive memory fixes"
description: "Covers seven fixes (of 9 planned) for graph integrity and cognitive scoring, including self-loop prevention, community debounce, WM score clamping and double-decay removal."
trigger_phrases:
  - "graph and cognitive memory fixes"
  - "self-loop prevention insertEdge"
  - "working memory score clamping"
  - "double-decay removal cognitive scoring"
  - "graph integrity bug fixes"
---

# Graph and cognitive memory fixes

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Covers seven fixes (of 9 planned) for graph integrity and cognitive scoring, including self-loop prevention, community debounce, WM score clamping and double-decay removal.

This is a collection of seven bug fixes for the relationship graph and memory scoring systems. Problems included a spec-doc record linking to itself (a loop that makes no sense), cluster detection that could not tell when links were deleted and replaced, and scores that could climb higher than they should. Without these fixes, the graph connections and scoring would slowly drift into unreliable territory.

---

## 2. HOW IT WORKS

Seven fixes (of 9 planned, 2 deferred) addressed graph integrity and cognitive scoring:

- **Self-loop prevention (#24):** `insertEdge()` rejects `sourceId === targetId`.
- **maxDepth clamping (#25):** `handleMemoryDriftWhy` clamps `maxDepth` to [1, 10] server-side.
- **Community debounce (#27):** Replaced edge-count-only debounce with `count:maxId` hash. Edge count alone can't detect deletions followed by insertions that maintain the same count.
- **Orphaned edge cleanup (#28):** New `cleanupOrphanedEdges()` function exported from `causal-edges.ts`.
- **WM score clamping (#29):** Working memory scores clamped to `[DECAY_FLOOR, 1.0]` to prevent mention boost from exceeding normalized range.
- **Double-decay removal (#30):** Trigger handler no longer double-decays working-memory entries in the `fullRecord + wmEntry` path. The fallback branch without `fullRecord` still applies one turn-decay step to preserve baseline behavior.
- **Co-activation cache (#32):** `clearRelatedCache()` called from `memory-bulk-delete.ts` after bulk operations.

**Deferred:** #26 (FK existence check on causal edges, test fixtures use synthetic IDs not in memory_index) and #31 (session entry limit off-by-one, code already correct).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/attention-decay.ts` | Lib | FSRS attention decay |
| `mcp_server/lib/cognitive/fsrs-scheduler.ts` | Lib | FSRS scheduling algorithm |
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/cognitive/working-memory.ts` | Lib | Working memory integration |
| `mcp_server/lib/graph/graph-signals.ts` | Lib | Graph momentum and depth signals |
| `mcp_server/lib/scoring/composite-scoring.ts` | Lib | Composite score computation |
| `mcp_server/lib/scoring/folder-scoring.ts` | Lib | Folder scoring implementation |
| `mcp_server/lib/scoring/importance-tiers.ts` | Lib | Importance tier definitions |
| `mcp_server/lib/scoring/interference-scoring.ts` | Lib | Interference penalty scoring |
| `mcp_server/lib/storage/access-tracker.ts` | Lib | Access pattern tracking |
| `mcp_server/lib/telemetry/scoring-observability.ts` | Lib | Scoring observability |
| `shared/normalization.ts` | Shared | Text normalization |
| `shared/scoring/folder-scoring.ts` | Shared | Shared folder scoring |
| `shared/types.ts` | Shared | Type definitions |
| `mcp_server/lib/storage/causal-edges.ts` | Lib | Causal edge storage and graph traversal |
| `mcp_server/lib/cognitive/co-activation.ts` | Lib | Co-activation spreading activation |
| `mcp_server/lib/cognitive/temporal-contiguity.ts` | Lib | Temporal contiguity boosting |
| `mcp_server/lib/eval/edge-density.ts` | Lib | Edge density measurement |
| `mcp_server/lib/search/causal-boost.ts` | Lib | Causal neighbor boost |
| `mcp_server/lib/search/graph-search-fn.ts` | Lib | Graph-backed FTS5 search |
| `mcp_server/lib/graph/community-detection.ts` | Lib | Community detection |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/access-tracker-extended.vitest.ts` | Automated test | Access tracker extended |
| `mcp_server/tests/access-tracker.vitest.ts` | Automated test | Access tracker tests |
| `mcp_server/tests/attention-decay.vitest.ts` | Automated test | Attention decay tests |
| `mcp_server/tests/checkpoint-working-memory.vitest.ts` | Automated test | Checkpoint working memory |
| `mcp_server/tests/composite-scoring.vitest.ts` | Automated test | Composite scoring tests |
| `mcp_server/tests/decay.vitest.ts` | Automated test | Decay behavior tests |
| `mcp_server/tests/feature-eval-graph-signals.vitest.ts` | Automated test | Graph signal evaluation |
| `mcp_server/tests/folder-scoring.vitest.ts` | Automated test | Folder scoring tests |
| `mcp_server/tests/fsrs-scheduler.vitest.ts` | Automated test | FSRS scheduler tests |
| `mcp_server/tests/graph-signals.vitest.ts` | Automated test | Graph signal computation |
| `mcp_server/tests/importance-tiers.vitest.ts` | Automated test | Importance tier tests |
| `mcp_server/tests/interference.vitest.ts` | Automated test | Interference scoring tests |
| `mcp_server/tests/memory-types.vitest.ts` | Automated test | Memory type tests |
| `mcp_server/tests/rollout-policy.vitest.ts` | Automated test | Rollout policy tests |
| `mcp_server/tests/score-normalization.vitest.ts` | Automated test | Score normalization tests |
| `mcp_server/tests/scoring-observability.vitest.ts` | Automated test | Scoring observability tests |
| `mcp_server/tests/scoring.vitest.ts` | Automated test | General scoring tests |
| `mcp_server/tests/unit-composite-scoring-types.vitest.ts` | Automated test | Scoring type tests |
| `mcp_server/tests/unit-folder-scoring-types.vitest.ts` | Automated test | Folder scoring type tests |
| `mcp_server/tests/unit-normalization-roundtrip.vitest.ts` | Automated test | Normalization roundtrip |
| `mcp_server/tests/unit-normalization.vitest.ts` | Automated test | Normalization unit tests |
| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Automated test | Tier classifier types |
| `mcp_server/tests/unit-transaction-metrics-types.vitest.ts` | Automated test | Transaction metric types |
| `mcp_server/tests/working-memory-event-decay.vitest.ts` | Automated test | Working memory decay |
| `mcp_server/tests/working-memory.vitest.ts` | Automated test | Working memory tests |
| `mcp_server/tests/causal-edges.vitest.ts` | Automated test | Causal edge operations |
| `mcp_server/tests/co-activation.vitest.ts` | Automated test | Co-activation boost tests |
| `mcp_server/tests/temporal-contiguity.vitest.ts` | Automated test | Temporal contiguity tests |
| `mcp_server/tests/edge-density.vitest.ts` | Automated test | Edge density measurement tests |
| `mcp_server/tests/causal-boost.vitest.ts` | Automated test | Causal boost tests |
| `mcp_server/tests/graph-search-fn.vitest.ts` | Automated test | Graph search function tests |
| `mcp_server/tests/anchor-metadata.vitest.ts` | Automated test | Anchor metadata parsing tests |

---

## 4. SOURCE METADATA
- Group: Graph Signal Activation
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `10--graph-signal-activation/091-graph-and-cognitive-memory-fixes.md`
Related references:
- [090-community-detection.md](090-community-detection.md) — Community detection
- [092-causal-neighbor-boost-and-injection.md](092-causal-neighbor-boost-and-injection.md) — Causal neighbor boost and injection
