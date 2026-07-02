---
title: "Seeded PPR impact ranking"
description: "Default-off seeded Personalized PageRank ranking mode for code_graph_context's impact query, recovered from git history for a benchmark re-test. Verdict: CUT stands, not intended to ship enabled."
trigger_phrases:
  - "seeded ppr impact ranking"
  - "system-code-graph feature catalog"
  - "SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING"
importance_tier: "important"
version: 1.3.0.0
---

# Seeded PPR impact ranking

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` is a default-off ranking mode for `code_graph_context`'s `queryMode: "impact"`. Off (the shipping default), impact mode ranks callers/importers with the existing flat weighted-walk ordering. On, it instead ranks candidates by a bounded seeded Personalized PageRank score computed from the anchor symbol, walking `CALLS`/`IMPORTS` edges up to 3 hops.

**This mode is not intended to ship enabled.** It was recovered from git history (it had already been cut once) specifically to re-run its original benchmark against real per-edge confidence gradients from [edge-confidence-differentiation.md](./edge-confidence-differentiation.md). With a genuine confidence gradient in place, PPR no longer ties the flat walk (as it did in the original cut) -- it loses on every metric: precision@3 down 0.10, precision@5 down 0.04-0.06, precision@8 down 0.03-0.04, recall@3 through recall@8 down 0.01-0.05, nDCG@3 down 0.057, nDCG@5 down 0.04, nDCG@8 down 0.03. The best damping value tested (0.5) only ties flat nDCG@5; every other damping value is worse. The CUT verdict stands, and the gap widened. See `.opencode/specs/system-speckit/028-memory-search-intelligence/007-dark-flag-graduation/005-codegraph-seeded-ppr/benchmark-results.md` and `.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/implementation-summary.md` for the full re-benchmark record.

## 2. HOW IT WORKS

### Trigger / Auto-Fire Path

Manual tool call only, and only for `code_graph_context({queryMode: "impact", ...})`. The flag is read per-call (`seededPprRankingEnabled()`), so toggling it mid-session changes the very next `impact`-mode call with no restart required.

### Class

manual. Catalog presence documents that the code exists and is tested, not that it is a shipping recommendation -- the benchmark verdict says the opposite.

### Caveats / Fallback

The bounded PPR walker (`computeBoundedPersonalizedPageRank`, shared with the spec-kit memory graph) is lazy-loaded: `code-graph-context.ts` dynamically imports `system-spec-kit/mcp_server/dist/lib/graph/bfs-traversal.js` on first use inside `impact` mode, so the module is not paid for when the flag is off or when `impact` mode is never requested. When `includeTrace:true` is also passed, `why_included[].edgeChain` reconstructs the full multi-hop path from anchor to each ranked candidate (see [../04--context-retrieval/code-graph-context.md](../04--context-retrieval/code-graph-context.md)) using the walker's `predecessor` field, not just a single one-hop edge.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:146-149` | Library | `SEEDED_PPR_ENABLED_ENV`/`SEEDED_PPR_ENABLED_VALUES`/`SEEDED_PPR_MAX_HOPS` flag and bound constants |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:492-498` | Library | `seededPprRankingEnabled()`/`shouldUseSeededPprRanking()`: per-call flag read gating `impact` mode |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:19-39` | Library | lazy dynamic `import()` of the shared weighted-walk traversal module, resolved from either of two candidate dist paths |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:747-887` | Library | `collectSeededPprImpactRanking()`/`buildPprEdgeChain()`: runs the bounded PPR walk and reconstructs each candidate's full multi-hop `edgeChain` from the walker's `predecessor` field |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:1191-1222` | Library | wires `collectSeededPprImpactRanking()` into `impact`-mode candidate collection when the flag is on |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/bfs-traversal.ts:20-24` | Library | shared `WeightedWalkResult.predecessor` field the seeded-PPR edge-chain reconstruction depends on |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/04--context-retrieval/` | Manual Playbook | Operator-facing manual scenarios for context retrieval, including `impact` mode |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-ranking.vitest.ts` | Automated test | seeded-PPR ranking and scoring behavior |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-flag-on-path.vitest.ts` | Automated test | flag-on `impact`-mode dispatch path |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-lazy-weighted-walk.vitest.ts` | Automated test | lazy-load behavior of the shared weighted-walk module |
| `.opencode/skills/system-code-graph/mcp_server/tests/weighted-walk-predecessor.vitest.ts` | Automated test | `predecessor` field correctness in the shared walker |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts` | Automated test | multi-hop `edgeChain` reconstruction and min-confidence/ambiguity reduction across chain steps |
| `.opencode/specs/system-speckit/028-memory-search-intelligence/007-dark-flag-graduation/005-codegraph-seeded-ppr/scripts/seeded-ppr-impact-benchmark.mjs` | Benchmark script | unmodified original harness; re-run against a real confidence gradient produced the CUT-stands verdict |

## 4. SOURCE METADATA

- Group: Edge confidence and provenance
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `09--edge-confidence-and-provenance/seeded-ppr-impact-ranking.md`

Related references:

- [edge-confidence-differentiation.md](./edge-confidence-differentiation.md)
- [edge-evidence-classification.md](./edge-evidence-classification.md)
- [../04--context-retrieval/code-graph-context.md](../04--context-retrieval/code-graph-context.md)
