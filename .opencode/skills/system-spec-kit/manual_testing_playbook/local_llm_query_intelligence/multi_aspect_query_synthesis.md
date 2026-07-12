---
title: "405 — Multi-aspect query synthesis"
description: "A compound query joining 3 distinct concepts ('Apple Silicon Metal GPU embedding default') should return top-K that spans ALL three aspects, not collapse onto the most-frequent term."
audited_post_018: true
version: 3.6.0.3
---

# 405 — Multi-aspect query synthesis

## 1. OVERVIEW

Operators frequently fire compound queries: "Apple Silicon Metal GPU embedding default". This single query joins THREE distinct concepts:
1. Platform — Apple Silicon
2. Acceleration — Metal GPU
3. Feature — embedding default selection

A naive search ranker collapses onto the most-frequent term ("embedding"); a competent semantic ranker preserves all three aspects and surfaces documents that touch each. Verify Memory MCP + Code Graph represent all three aspects in the top 5 results.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm multi-aspect representation in top-5.
- Real user request: `Verify that a 3-concept compound query 'Apple Silicon Metal GPU embedding default' returns top-5 results that collectively cover all three concepts.`
- RCAF Prompt: `As a query_intelligence validation operator, fire a compound query joining platform + acceleration + feature, and verify that the top-5 results span all three concepts. Return a pass/fail verdict with the per-aspect coverage breakdown.`
- Expected execution process: run the compound query, tag each top-5 result with the aspects it touches (A=Apple Silicon, M=Metal, E=Embedding-default), confirm all three aspects appear at least once in the top-5.
- Expected signals: each of the 3 aspects appears in at least 1 result; ≥ 2 results touch multiple aspects.
- Desired user-visible outcome: `PASS — aspects A, M, E all represented in top-5; 3 results touch ≥ 2 aspects.`
- Pass/fail: PASS if all 3 aspects represented AND ≥ 2 results are multi-aspect; PARTIAL if all 3 aspects but no multi-aspect results; FAIL if any aspect is missing from top-5.

---

## 3. TEST EXECUTION

### Prompt

```
Fire the compound query 'Apple Silicon Metal GPU embedding default' and verify the top-5 covers all 3 aspects.
```

### Commands

```
mcp__mk_code_index__code_graph_query({
  query: "Apple Silicon Metal GPU embedding default provider selection",
  num_results: 10,
})
```

And in parallel:

```
memory_search({
  query: "Apple Silicon Metal GPU embedding default provider selection",
  limit: 10,
})
```

For each top-5 result, tag with aspects present:
- `A` if mentions Apple Silicon / darwin / arm64 / `mps` device
- `M` if mentions Metal GPU acceleration
- `E` if mentions embedding default / provider selection / cascade

### Expected

```
| Rank | File                                     | A | M | E | # aspects |
|-----:|------------------------------------------|---|---|---|----------:|
| 1    | INSTALL_GUIDE.md (ollama section)     | Y | Y | Y | 3         |
| 2    | factory.ts (cascade + Metal hint)        | - | - | Y | 1         |
| 3    | providers/README.md                      | Y | Y | Y | 3         |
| 4    | ollama-availability.ts                | Y | - | - | 1         |
| 5    | hf-local.ts (mps device hint)            | Y | - | Y | 2         |
```

Coverage summary:
- A (Apple Silicon): 4 of 5
- M (Metal): 2 of 5
- E (Embedding-default): 4 of 5
- ALL aspects covered ≥ once: YES
- Multi-aspect results: 3 (rank 1, 3, 5)

→ PASS

### Evidence

- The exact compound query payload for both Memory MCP and Code Graph.
- The top-10 result paths for each.
- The aspect-tagging table.
- An honest note on which result was "most synthesized" (touches the most aspects).
- An honest note on which aspect was weakest in top-5 (and whether that's correct given the corpus).
- Active provider from memory_health.

## 4. PASS PREDICATE

A naive lexical ranker would over-weight "embedding" (frequent) and underweight "Apple Silicon" (less frequent). The semantic ranker should balance contributions and ensure each aspect surfaces. If a single-aspect-dominated top-5 is observed (e.g., 5 hits all about embeddings, none about Apple Silicon), mark FAIL.
