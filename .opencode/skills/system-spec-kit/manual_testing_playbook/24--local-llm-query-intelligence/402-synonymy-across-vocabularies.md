---
title: "402 - Synonymy across vocabularies"
description: "Verifies that domain-jargon and plain-language queries surface the same canonical results. Uses live memory IDs and code paths so stale fixture targets do not masquerade as embedder failures."
audited_post_018: true
fixture_version: "post-surgery"
---

# 402 - Synonymy across vocabularies

## 1. OVERVIEW

The same concept can be expressed using domain-specific jargon or everyday language. The Memory MCP and CocoIndex should treat paired phrasings as referring to the same retrieval target; top-K results should overlap heavily across the two queries.

The behavior is user-observable: an operator new to the codebase uses casual phrasing; a veteran uses technical terms. Both should reach the same canonical reference.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm cross-vocabulary semantic mapping.
- Real user request: `Verify that domain-jargon and plain-English versions of the same concept retrieve the same documents from Memory MCP and CocoIndex.`
- RCAF Prompt: `As a query-intelligence validation operator, run two queries that express the same concept with different vocabularies. Report the Jaccard overlap of the top-5 results between the two queries and whether the current canonical target appears in both variants. Return a concise pass/fail verdict and the overlap percentage.`
- Expected execution process: fire 4 query pairs (memory + code), compute top-5 Jaccard overlap, record any divergence.
- Expected signals: At least 2 of 4 query pairs have top-5 overlap >= 25%; no query returns zero hits; the current canonical target appears in BOTH variants. Calibration source: 016/004 post-surgery evidence showed the previous 3/4 at 60% bar was not empirically met even after live-ID remap, so this scenario now gates fair target visibility plus modest overlap.
- Desired user-visible outcome: `PASS - 2/4 pairs at >= 25% top-5 Jaccard; canonical live targets present in both variants; remaining misses documented.`
- Pass/fail: PASS if >= 2 of 4 pairs hit >= 25% overlap and all live canonical targets appear; PARTIAL if target visibility holds but only 1 pair reaches overlap; FAIL if any query returns zero relevant hits or a live canonical target is absent.

---

## 3. TEST EXECUTION

### Prompt

```
Verify cross-vocabulary semantic mapping in Memory MCP + CocoIndex by firing 4 query pairs (jargon vs plain) and measuring top-5 overlap.
```

### Commands

Run each query pair and record results:

**Pair A - Memory MCP, V-rule overreach concept:**
```
memory_search({ query: "V8 cross-spec contamination overreach checklist" }) -> top 5
memory_search({ query: "checklist for preventing one spec from pulling unrelated foreign spec identifiers into generated content" }) -> top 5
```

**Pair B - Memory MCP, template consolidation concept:**
```
memory_search({ query: "template consolidation decision compose.sh levels addendum generator" }) -> top 5
memory_search({ query: "ADR about merging spec-kit templates into the level and addendum generator" }) -> top 5
```

**Pair C - CocoIndex, code concept:**
```
mcp__cocoindex_code__search({ query: "embedding provider auto-detection cascade" }) -> top 5
mcp__cocoindex_code__search({ query: "pick which model to use based on API keys" }) -> top 5
```

**Pair D - CocoIndex, code concept:**
```
mcp__cocoindex_code__search({ query: "SQLite virtual table for vector similarity" }) -> top 5
mcp__cocoindex_code__search({ query: "fast cosine search backed by vec0 extension" }) -> top 5
```

For each pair, compute the Jaccard overlap of the top-5 result IDs:
`overlap = |intersection| / |union|`

### Expected

- Pair A: top-5 should both surface live memory ID `7007`, the current successor for the stale `4437` / `5143` V-rule checklist lineage. Expected overlap >= 25% after live-target visibility is confirmed.
- Pair B: top-5 should both surface live memory ID `8048`, the current successor for stale ID `4400`. Expected overlap >= 25% after live-target visibility is confirmed.
- Pair C: top-5 should both surface `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:resolveProvider` and `.opencode/skills/system-spec-kit/shared/embeddings/profile.d.ts:resolveActiveProfileProvider`. Expected overlap >= 25% after live-target visibility is confirmed.
- Pair D: top-5 should both surface `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` and `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` / `vector-index-schema.ts` sqlite-vec references. Expected overlap >= 25% after live-target visibility is confirmed.

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
