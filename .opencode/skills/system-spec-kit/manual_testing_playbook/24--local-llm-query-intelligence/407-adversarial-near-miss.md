---
title: "407 — Adversarial near-miss (lexical overlap, semantic distance)"
description: "Fire a query whose stem overlaps lexically with multiple corpus files but is semantically distant from most of them. Verify the semantically-correct file outranks the lexical decoys."
audited_post_018: true
---

# 407 — Adversarial near-miss (lexical overlap, semantic distance)

## 1. OVERVIEW

A lexical-only ranker (FTS5, BM25) would rank by term-frequency overlap; a semantic ranker should weight meaning. This scenario fires queries crafted so that the lexically-closest file is semantically WRONG, and the semantically-correct file has lower term overlap.

If BGE local fallback's semantic representation is functioning correctly, it pulls the right answer despite lexical decoys. If it's degraded (or the embedding lane is disabled in favor of FTS5), the wrong file ranks first.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm semantic > lexical when they disagree.
- Real user request: `Verify Code Graph's semantic ranking beats lexical decoys: fire 3 adversarial queries and confirm the semantically-correct file ranks above the lexical decoy in each top-5.`
- RCAF Prompt: `As a query-intelligence validation operator, fire 3 adversarial queries with intentional lexical decoys and verify the semantically-correct file outranks the decoy in each top-5. Return a pass/fail verdict.`
- Expected execution process: run 3 queries with engineered lexical+semantic mismatch, identify the correct file and the decoy in each result list, check ranks.
- Expected signals: correct file rank < decoy rank in ≥ 2 of 3 queries.
- Desired user-visible outcome: `PASS — semantic ranking beats lexical decoy in 3/3 queries.`
- Pass/fail: PASS if 3/3; PARTIAL if 2/3; FAIL if ≤ 1.

---

## 3. TEST EXECUTION

### Prompt

```
Fire 3 adversarial queries with engineered lexical decoys; confirm semantic ranking wins.
```

### Commands

**Query A — "embedding cache" decoy:**
Lexical decoy: `embedding-circuit-breaker.vitest.ts` (high term overlap with "embedding")
Semantic target: `mcp_server/lib/cache/embedding-cache.ts` (the actual cache impl)

```
mcp__mk_code_index__code_graph_context({
  input: "where are embedding results cached by content hash to skip recomputation",
  queryMode: "neighborhood",
})
```

Confirm: `embedding-cache.ts` ranks above `embedding-circuit-breaker.vitest.ts`.

**Query B — "vector store" decoy:**
Lexical decoy: `vector-index-impl.vitest.ts` (test file)
Semantic target: `mcp_server/lib/search/vector-index-store.ts` (the impl)

```
mcp__mk_code_index__code_graph_context({
  input: "core class that opens the sqlite-vec virtual table for runtime vector queries",
  queryMode: "neighborhood",
})
```

Confirm: `vector-index-store.ts` ranks above `vector-index-impl.vitest.ts`.

**Query C — "provider factory" decoy:**
Lexical decoy: `embeddings-ollama-factory.vitest.ts` (test file)
Semantic target: `shared/embeddings/factory.ts` (the impl)

```
mcp__mk_code_index__code_graph_context({
  input: "primary entry point that constructs concrete embedding provider instances and resolves auto cascade",
  queryMode: "neighborhood",
})
```

Confirm: `factory.ts` ranks above `embeddings-ollama-factory.vitest.ts`.

For each query, capture:
- Rank of the semantic target.
- Rank of the lexical decoy.
- Boolean: target ranked above decoy?

### Expected

```
| Query | Semantic target              | Target rank | Lexical decoy                   | Decoy rank | Target > Decoy? |
|-------|------------------------------|------------:|---------------------------------|-----------:|----------------|
| A     | embedding-cache.ts           | 1           | embedding-circuit-breaker.vitest| 6          | YES            |
| B     | vector-index-store.ts        | 2           | vector-index-impl.vitest.ts     | 5          | YES            |
| C     | factory.ts                   | 1           | embeddings-ollama-factory.vt | 4          | YES            |
```

### Evidence

- The 3 queries verbatim.
- The top-10 result paths for each.
- The rank-pair table.
- An honest note: if the decoy ranks above the target, IS the decoy actually a better answer for this query? (Test files can sometimes be the most explicit single source for a behavior — that's a legitimate edge case, not a ranker failure.)
- Active provider from memory_health.

## 4. PASS PREDICATE

A FAIL signal indicates one of:
1. The embedding lane is degraded or disabled.
2. The lexical (FTS5) score is being weighted too heavily in the hybrid-search composition.
3. The corpus genuinely lacks an alternative to the decoy file (sparse-content issue, not a ranker issue).

Differentiate (1)/(2) from (3) by inspecting the top-10 — if MANY test/decoy files cluster at the top and the impl is buried, it's (1)/(2). If the impl simply doesn't have rich content, it's (3) and the test is inconclusive.
