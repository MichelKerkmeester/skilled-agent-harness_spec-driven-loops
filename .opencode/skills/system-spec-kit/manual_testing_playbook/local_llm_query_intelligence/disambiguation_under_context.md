---
title: "404 — Disambiguation under context"
description: "A polysemous query token ('save context') has multiple senses — memory_save vs git stash vs file-system serialization. Verify that surrounding query context biases the result toward the intended sense."
audited_post_018: true
version: 3.6.0.4
---

# 404 — Disambiguation under context

## 1. OVERVIEW

The phrase "save context" can mean:
- A. `memory_save` — persist conversation context to Spec Kit Memory
- B. `git stash` — save working-tree state
- C. A generic file-system serialization

The embedding should disambiguate based on surrounding query context. Adding "to Memory MCP" should bias toward A; adding "to a branch" should bias toward B; adding "to disk as JSON" should bias toward C.

This scenario probes whether the LLM's pretraining recognizes these domain-specific framings and shifts the ranking accordingly.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm contextual disambiguation across 3 senses of "save context".
- Real user request: `Verify that adding context-disambiguating phrases to a polysemous query 'save context' steers Memory MCP and Code Graph to the correct sense.`
- RCAF Prompt: `As a query_intelligence validation operator, fire 3 variants of a polysemous query 'save context' (each adding a different disambiguator) and verify the top-3 results match the intended sense. Return a pass/fail verdict.`
- Expected execution process: fire 3 query variants, inspect top-3 results for each, mark which sense the top-3 represents.
- Expected signals: each variant's top-3 is dominated by its intended sense (≥ 2 of 3 results match).
- Desired user-visible outcome: `PASS — all 3 variants disambiguate correctly; top-3 dominated by intended sense.`
- Pass/fail: PASS if all 3 variants correctly disambiguate; PARTIAL if 2 of 3; FAIL if ≤ 1.

---

## 3. TEST EXECUTION

### Prompt

```
Fire 3 variants of 'save context' through Code Graph + Memory MCP and verify each is disambiguated by its added qualifier.
```

### Commands

**Variant 1 — Memory MCP sense:**
```
mcp__mk_code_index__code_graph_context({
  input: "save context to Memory MCP after a successful spec-folder workflow",
  queryMode: "neighborhood",
})
```
Expected top-3: `memory:save` skill files, `generate-context.js`, `_memory.continuity` references.

**Variant 2 — Git sense:**
```
mcp__mk_code_index__code_graph_context({
  input: "save context to a git branch before switching",
  queryMode: "neighborhood",
})
```
Expected top-3: `sk-git` skill files, git-worktree references, git-stash patterns.

**Variant 3 — File-system sense:**
```
mcp__mk_code_index__code_graph_context({
  input: "save context to disk as a structured JSON snapshot file",
  queryMode: "neighborhood",
})
```
Expected top-3: checkpoint creation scripts, JSON serialization helpers, snapshot file patterns.

For each variant:
1. Capture top-5 result file paths.
2. Tag each of the top-3 by sense: A (Memory), B (Git), C (File).
3. Compute the dominant sense.

### Expected

```
| Variant | Top-3 senses        | Dominant | Intended | Match? |
|---------|---------------------|----------|----------|--------|
| 1       | A, A, A             | A        | A        | YES    |
| 2       | B, B, A             | B        | B        | YES    |
| 3       | C, C, C             | C        | C        | YES    |
```

### Evidence

- The exact Code Graph query for each variant.
- The top-5 file paths returned by each.
- A sense-classification table (manual judgment per result file).
- An honest note if a particular variant's top-3 mixes senses — list which senses appeared and discuss whether the mixing is reasonable (e.g., a `memory_save` file might appear in the git-sense query because both involve "saving").
- Active provider from memory_health.

## 4. NOTES

This scenario stresses the embedding's ability to distinguish senses based on surrounding context. Current local and Ollama models should handle these common English-language disambiguations cleanly, but ambiguous queries (e.g., bare "save context" without a qualifier) may legitimately return mixed top-K — that's not a failure of the disambiguation itself.
