---
title: "402 — Synonymy across vocabularies"
description: "Verifies that domain-jargon and plain-language queries surface the same canonical results. Probes EmbeddingGemma's cross-vocabulary mapping: 'tier 1 ephemeral memories' vs 'short-term temporary memories' should hit the same docs."
audited_post_018: true
---

# 402 — Synonymy across vocabularies

## 1. OVERVIEW

The same concept can be expressed using domain-specific jargon ("Tier 1 ephemeral memories") or everyday language ("short-term temporary memories"). The Memory MCP should treat these as referring to the same retrieval target — top-K results should overlap heavily across the two queries.

The behavior is user-observable: an operator new to the codebase uses casual phrasing; a veteran uses technical terms. Both should reach the same canonical reference.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm cross-vocabulary semantic mapping.
- Real user request: `Verify that domain-jargon and plain-English versions of the same concept retrieve the same documents from Memory MCP and CocoIndex.`
- RCAF Prompt: `As a query-intelligence validation operator, run two queries that express the same concept with different vocabularies. Report the Jaccard overlap of the top-5 results between the two queries. Return a concise pass/fail verdict and the overlap percentage.`
- Expected execution process: fire 4 query pairs (memory + code), compute top-5 Jaccard overlap, record any divergence.
- Expected signals: Jaccard overlap of top-5 ≥ 60% for at least 3 of 4 query pairs; no query returns zero hits; canonical reference (Tier-1 docs or memory-system.md) appears in BOTH variants.
- Desired user-visible outcome: `PASS — 3/4 pairs at ≥ 60% top-5 Jaccard; canonical Tier-1 reference present in all variants.`
- Pass/fail: PASS if ≥ 3 of 4 pairs hit ≥ 60% overlap; PARTIAL if 2 of 4; FAIL if ≤ 1 of 4 OR any query returns zero relevant hits.

---

## 3. TEST EXECUTION

### Prompt

```
Verify cross-vocabulary semantic mapping in Memory MCP + CocoIndex by firing 4 query pairs (jargon vs plain) and measuring top-5 overlap.
```

### Commands

Run each query pair and record results:

**Pair A — Memory MCP, Tier-1 concept:**
```
memory_search({ query: "Tier 1 ephemeral memories" }) → top 5
memory_search({ query: "short-term temporary memories" }) → top 5
```

**Pair B — Memory MCP, importance concept:**
```
memory_search({ query: "constitutional importance tier 5" }) → top 5
memory_search({ query: "always-surface memory entries" }) → top 5
```

**Pair C — CocoIndex, code concept:**
```
mcp__cocoindex_code__search({ query: "embedding provider auto-detection cascade" }) → top 5
mcp__cocoindex_code__search({ query: "pick which model to use based on API keys" }) → top 5
```

**Pair D — CocoIndex, code concept:**
```
mcp__cocoindex_code__search({ query: "SQLite virtual table for vector similarity" }) → top 5
mcp__cocoindex_code__search({ query: "fast cosine search backed by vec0 extension" }) → top 5
```

For each pair, compute the Jaccard overlap of the top-5 result IDs:
`overlap = |intersection| / |union|`

### Expected

- Pair A: top-5 should both surface `references/memory/memory_system.md` and Tier-1-tagged memories. Expected overlap ≥ 70%.
- Pair B: top-5 should both surface `memory:learn` skill content and the Tier-5 constitutional rule docs. Expected overlap ≥ 60%.
- Pair C: top-5 should both surface `factory.ts:resolveProvider` and `profile.ts:resolveActiveProfileProvider`. Expected overlap ≥ 60%.
- Pair D: top-5 should both surface `vector-index-store.ts` and the `sqlite-vec` references in install guides. Expected overlap ≥ 60%.

### Evidence

- For each pair: top-5 result IDs for query A, top-5 result IDs for query B, intersection, Jaccard overlap percentage.
- Note any query that returned fewer than 5 hits.
- Active provider from `memory_health`.
- A pass-summary table:
  ```
  | Pair | Overlap | Status |
  |------|--------:|--------|
  | A    |    72%  | PASS   |
  | B    |    64%  | PASS   |
  | C    |    66%  | PASS   |
  | D    |    58%  | PARTIAL|
  ```
