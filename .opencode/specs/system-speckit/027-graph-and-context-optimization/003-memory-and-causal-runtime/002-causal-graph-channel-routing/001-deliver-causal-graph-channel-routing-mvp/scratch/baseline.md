# Pre-change Baseline — graph_channel_invocation_rate

Captured: 2026-05-08

## Method

Synthetic baseline derived from code-path analysis (live MCP smoke deferred to T015).

## Pre-change routing logic (query-router.ts, before 012)

```ts
const channels = getChannelSubset(classification.tier);
const adjustedChannels = classification.tier === 'simple' && shouldPreserveBm25(query)
  ? enforceMinimumChannels([...channels, 'bm25'])
  : channels;
```

`getChannelSubset` returns:
- simple   → ['vector', 'fts']
- moderate → ['vector', 'fts', 'bm25']
- complex  → ['vector', 'fts', 'bm25', 'graph', 'degree']

The only path that includes `graph` is the `complex` tier (>8 terms, no trigger match). The bm25 preservation override touches bm25 only.

## Conclusion

For natural user queries (1–5 terms, classified simple/moderate), `graph` is never included.

**Baseline `graph_channel_invocation_rate` for queries ≤8 terms: 0.000.**

The cross-AI session log noted in spec.md problem statement (3 sequential queries: "feature flag cleanup" 3 terms, "cli-opencode" 1 term, "cli-opencode orchestration dispatch skill" 5 terms) confirms this empirically — none of those routes included graph.

## Live-snapshot context (memory_causal_stats 2026-05-08T10:34Z)

- `causal_edges` table: 1,328 rows (data exists, but routing logic ignored it)
- Link coverage: 46.14%
- Avg strength: 0.83
