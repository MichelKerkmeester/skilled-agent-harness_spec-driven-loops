---
title: "408 — Compound concept synthesis"
description: "Fire a query whose answer is not stated in any single document — operator must synthesize from 2-3 sources. Verify top-3 returns the constituent docs that together compose the answer."
audited_post_018: true
---

# 408 — Compound concept synthesis

## 1. OVERVIEW

Not every answer lives in one file. A query like "how does the auto-migration from hf-local to ollama interact with the cascade fallback when ollama warmup fails?" requires synthesis across:
- `factory.ts:resolveProvider` (cascade order)
- `factory.ts` cascade fallback logic
- `context-server.ts` auto-migration trigger
- `018-ollama-auto-migration/implementation-summary.md` (operational narrative)

A good ranker brings these together in top-K so the operator can synthesize. A poor ranker hits one and stops.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm compound-question retrieval surfaces multiple constituent sources.
- Real user request: `Verify that a compound question whose answer is not in any single file returns the constituent sources in top-3, allowing me to synthesize.`
- RCAF Prompt: `As a query-intelligence validation operator, fire a compound question requiring multi-source synthesis, and verify top-3 returns ≥ 2 of the 3-4 expected constituent files. Return a pass/fail verdict with the source-set table.`
- Expected execution process: fire compound query, identify the expected constituent source set, check which constituents appear in top-3 / top-5 / top-10.
- Expected signals: after deduplicating mirrored runtime paths (`.opencode`, `.codex`, `.claude`) to one constituent hit, at least 2 of the 4 expected constituents appear in top-3 and at least 3 in top-5.
- Desired user-visible outcome: `PASS — top-3 includes 3 of 4 expected constituents (the missing one was in rank 6, still close).`
- Pass/fail: PASS if >= 2/4 deduped constituents are in top-3 AND >= 3/4 are in top-5; PARTIAL if 2/4 are in top-3 but < 3/4 are in top-5; FAIL if < 2/4 are in top-3.

---

## 3. TEST EXECUTION

### Prompt

```
Fire a compound question about auto-migration + cascade fallback + warmup failure interaction, and verify the constituent sources appear in top-K.
```

### Commands

```
mcp__mk_code_index__code_graph_query({
  query: "what happens when ollama auto-migration starts but the provider warmup fails — does the cascade fall back to hf-local or does migration error out?",
  num_results: 10,
})
```

Expected constituent files (the 4 sources whose union answers the question):
1. `shared/embeddings/factory.ts` — cascade fallback logic (resumes cascade on warmup failure)
2. `mcp_server/context-server.ts` — auto-migration trigger and failure path
3. `shared/embeddings/providers/ollama.ts` — provider warmup implementation
4. `<spec-folder>` - operator narrative

For each, capture rank in the top-10 (or `>10` if absent).

### Expected

```
| Expected source                          | Rank in top-10 |
|------------------------------------------|---------------:|
| factory.ts (cascade fallback)            | 1              |
| context-server.ts (auto-migration entry) | 3              |
| ollama.ts (warmup impl)               | 2              |
| 018-ollama-auto-migration summary       | 7              |
```

Summary:
- In top-3: 3 of 4 constituents (factory, ollama, context-server)
- In top-5: 3 of 4 (017 summary still at rank 7)
- In top-10: all 4

→ PASS (3/4 in top-3 + 3/4 in top-5)

### Evidence

- The compound query verbatim.
- The full top-10 result paths, with mirrored implementation paths deduplicated before constituent scoring.
- A constituent-rank table.
- A short narrative: would an operator be able to assemble the answer from the top-3?
- An honest note: which constituent (if any) was missing or buried? Why might it have lower rank — corpus sparsity, embedding mismatch, or genuine irrelevance?
- Active provider from memory_health.

## 4. NOTES

This scenario stresses **retrieval breadth**, not depth. A top-3 with 3 different constituent sources is BETTER than a top-3 with 3 paragraphs from the same file, even if that single file has the longest individual coverage.

If a single doc happens to comprehensively answer the question (rare, but possible), that's actually a corpus-quality win — note it explicitly and pass the test.
