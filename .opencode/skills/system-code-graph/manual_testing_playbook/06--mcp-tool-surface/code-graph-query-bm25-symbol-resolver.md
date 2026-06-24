---
title: "027 -- code_graph_query BM25 fallback-only symbol suggestions"
description: "Verify that an unresolved subject returns disambiguation-only BM25 symbol suggestions when the resolver flag is on, that exact resolution still wins, and that the suggestions never execute the structural query."
trigger_phrases:
  - "027 bm25 scenario"
  - "code graph bm25 symbol resolver testing"
importance_tier: "important"
contextType: "verification"
version: 1.3.0.0
---

# 027 -- `code_graph_query` BM25 fallback-only symbol suggestions

## 1. OVERVIEW

This scenario validates the BM25 symbol resolver on `code_graph_query`. When a subject cannot be resolved to a symbol by exact `symbol_id`, `fq_name` or `name` lookup, the default-off `SPECKIT_CODE_GRAPH_BM25_SYMBOL_RESOLVER` flag lets the handler attach ranked candidate symbols to the unresolved-subject error. The suggestions are marked `disambiguationOnly: true` and never run the structural query automatically. Exact resolution runs first and always wins, so an exact subject returns its real query result with no BM25 path taken. With the flag off an unresolved subject returns the plain error with no candidates.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the BM25 resolver surfaces fallback-only candidates for an unresolved subject under the flag, leaves exact resolution unchanged, and never auto-runs the structural query.
- Real user request: `Validate the BM25 symbol resolver on code_graph_query: a near-miss subject should return candidate symbols for disambiguation only, an exact subject should still resolve normally, and the suggestions must never execute the query on their own.`
- Prompt: `Validate code_graph_query BM25 fallback suggestions against the resolver flag and report cited pass/fail evidence.`
- Expected execution process: Run the documented call sequence in a fresh-indexed workspace, capture the responses, compare the observed resolution and candidate fields against the expected signals and return the pass/fail verdict.
- Expected signals: an exact subject resolves and returns its query result, a near-miss subject with the flag on returns an error envelope carrying `symbolResolution.resolver: "bm25"` and `disambiguationOnly: true` candidates, and the same near-miss subject with the flag off returns the plain error without candidates.
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the flag-on near-miss returns disambiguation-only candidates, exact resolution is unaffected and no query runs from a suggestion.

---

## 3. TEST EXECUTION

### Preconditions

- Code graph index is `fresh` (verify via `code_graph_status`).
- Pick a real symbol name present in the index for the exact-match step, and a near-miss spelling of that name that does not exact-match for the suggestion step.

### Commands

1. **Exact resolution baseline (flag off):**
   ```jsonc
   mcp__mk_code_index__code_graph_query({
     operation: "outline",
     subject: "<exact symbol name or fqName present in the index>"
   })
   ```
   Expected: the subject resolves and the query returns its structural result. `status` not `error`. No `symbolResolution` block.

2. **Near-miss with the flag off:**
   ```jsonc
   mcp__mk_code_index__code_graph_query({
     operation: "outline",
     subject: "<near-miss spelling that does not exact-match>"
   })
   ```
   Expected: `status: "error"` with `Could not resolve subject: ...` and no `data.symbolResolution`. The default path returns no candidates.

3. **Near-miss with the flag on:** set `SPECKIT_CODE_GRAPH_BM25_SYMBOL_RESOLVER=true`, then repeat the near-miss call.
   ```jsonc
   mcp__mk_code_index__code_graph_query({
     operation: "outline",
     subject: "<same near-miss spelling>"
   })
   ```
   Expected: `status: "error"` with `data.symbolResolution.resolver: "bm25"`, `disambiguationOnly: true` and a `candidates` array of ranked symbols. The structural query is not executed for any candidate, so no outline payload appears.

4. **Exact resolution still wins with the flag on:** with `SPECKIT_CODE_GRAPH_BM25_SYMBOL_RESOLVER=true` still set, repeat the exact subject from step 1. Expected: the subject resolves by exact match and returns the structural result with no `symbolResolution` block, proving the resolver runs only after exact matching misses.

### Expected

The exact subject resolves and queries in both flag states, the near-miss subject returns disambiguation-only BM25 candidates only when the flag is on, and no candidate triggers an automatic structural query.

### Evidence

The four responses (exact flag-off, near-miss flag-off, near-miss flag-on, exact flag-on), captured with the flag state for each call, plus the `symbolResolution` block from the flag-on near-miss response.

### Pass / Fail

- **Pass**: flag-on near-miss returns `resolver: "bm25"` disambiguation-only candidates, flag-off near-miss returns the plain error, exact resolution is unaffected by the flag and no query runs from a suggestion.
- **Fail**: candidates appear with the flag off, exact resolution changes under the flag, a candidate auto-executes the query, or the flag-on near-miss omits the `symbolResolution` block.

### Failure Triage

Inspect `querySymbolBm25Suggestions` and `buildUnresolvedSubjectError` in `mcp_server/handlers/query.ts` (the suggestion path is taken only when `isCodeGraphBm25SymbolResolverEnabled()` returns true and exact resolution missed). Confirm the enable check `isCodeGraphBm25SymbolResolverEnabled` and the scorer `resolveSymbolBm25Candidates` in `mcp_server/lib/symbol-bm25-resolver.ts`, including the field weighting and the `disambiguationOnly: true` marking.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Handler: `mcp_server/handlers/query.ts`
- Resolver: `mcp_server/lib/symbol-bm25-resolver.ts`
- Catalog counterpart: `../../feature_catalog/01--read-path-freshness/query-self-heal.md`

---

## 5. SOURCE METADATA

- Group: MCP Tool Surface
- Playbook ID: 027
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--mcp-tool-surface/code-graph-query-bm25-symbol-resolver.md`
