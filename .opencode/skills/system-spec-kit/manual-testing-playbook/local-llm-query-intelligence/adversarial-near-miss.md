---
title: "407 — Adversarial near-miss (lexical overlap, semantic distance)"
description: "Fire a query whose stem overlaps lexically with multiple corpus files but is semantically distant from most of them. Verify the semantically-correct file outranks the lexical decoys."
audited_post_018: true
version: 3.6.0.4
id: local-llm-query-intelligence-adversarial-near-miss
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
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
Semantic target: `mcp-server/lib/cache/embedding-cache.ts` (the actual cache impl)

```
  input: "where are embedding results cached by content hash to skip recomputation",
  queryMode: "neighborhood",
})
```

Confirm: `embedding-cache.ts` ranks above `embedding-circuit-breaker.vitest.ts`.

**Query B — "vector store" decoy:**
Lexical decoy: `vector-index-impl.vitest.ts` (test file)
Semantic target: `mcp-server/lib/search/vector-index-store.ts` (the impl)

```
  input: "core class that opens the sqlite-vec virtual table for runtime vector queries",
  queryMode: "neighborhood",
})
```

Confirm: `vector-index-store.ts` ranks above `vector-index-impl.vitest.ts`.

**Query C — "provider factory" decoy:**
Lexical decoy: `embeddings-ollama-factory.vitest.ts` (test file)
Semantic target: `shared/embeddings/factory.ts` (the impl)

```
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

- The 3 queries verbatim:
  - Query A: `where are embedding results cached by content hash to skip recomputation`
  - Query B: `core class that opens the sqlite-vec virtual table for runtime vector queries`
  - Query C: `primary entry point that constructs concrete embedding provider instances and resolves auto cascade`
- Native Code Graph status before retrying the commands:

```text
plugin_id=mk-code-graph
cache_ttl_ms=5000
spec_folder=auto
resume_mode=minimal
messages_transform_enabled=true
messages_transform_mode=schema_aligned
runtime_ready=false
node_binary=node
bridge_timeout_ms=15000
last_runtime_error=Bridge skipped: SOCKET_ABSENT (exit=75); plugin injection will no-op
cache_entries=0
cache=empty
```

- Code Index CLI tool availability check:

```text
detect_changes
```

- Query A command output:

```json
{
  "status": "error",
  "exitCode": 75
}
```

- Query B command output:

```json
{
  "status": "error",
  "exitCode": 75
}
```

- Query C command output:

```json
{
  "status": "error",
  "exitCode": 75
}
```

- Rank-pair table:

```text
| Query | Semantic target        | Target rank | Lexical decoy                     | Decoy rank | Target > Decoy? |
|-------|------------------------|------------:|-----------------------------------|-----------:|----------------|
| A     | embedding-cache.ts     | BLOCKED     | embedding-circuit-breaker.vitest.ts | BLOCKED  | BLOCKED        |
| B     | vector-index-store.ts  | BLOCKED     | vector-index-impl.vitest.ts       | BLOCKED    | BLOCKED        |
| C     | factory.ts             | BLOCKED     | embeddings-ollama-factory.vitest.ts | BLOCKED  | BLOCKED        |
```

- Honest note: unable to assess whether any decoy is actually a better answer because no ranked result lists were produced.
- Active provider from `memory_health`: BLOCKED. Native MCP `memory_health` returned this output on repeated attempts:

```text
MCP error -32001: backend recycled; retry
```

- Spec Memory CLI fallback for `memory_health` returned this output:

```text
@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp-server && npm run build
```

## 4. PASS PREDICATE

A FAIL signal indicates one of:
1. The embedding lane is degraded or disabled.
2. The lexical (FTS5) score is being weighted too heavily in the hybrid-search composition.
3. The corpus genuinely lacks an alternative to the decoy file (sparse-content issue, not a ranker issue).

Differentiate (1)/(2) from (3) by inspecting the top-10 — if MANY test/decoy files cluster at the top and the impl is buried, it's (1)/(2). If the impl simply doesn't have rich content, it's (3) and the test is inconclusive.

