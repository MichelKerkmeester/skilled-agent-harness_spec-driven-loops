---
title: "450 -- Graceful Embedder-Degrade to Lexical"
description: "Manual check that an unavailable embedder degrades search to lexical candidate generation and reports embedder_available:false, while the embedder-success path stays byte-identical."
version: 3.6.0.1
---

# 450 -- Graceful Embedder-Degrade to Lexical

## 1. OVERVIEW

This scenario validates graceful embedder degradation in the search pipeline. When the embedding model returns a null or empty embedding, search must fall back to lexical (BM25/FTS) candidate generation and report `embedder_available:false` and `vector_search_skipped:true`, instead of throwing internally and collapsing to empty candidates. The embedder-success path must remain unchanged.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm search degrades to lexical with degraded-mode signals when the embedder is unavailable.
- Real user request: `Search still works when the embedder is down, just on keywords, and tells me it skipped vectors.`
- Prompt: `Validate graceful embedder-degrade with a healthy embedder baseline and an unavailable-embedder run.`
- Expected execution process: Run a baseline search with a healthy embedder, simulate an unavailable embedder in a sandbox, rerun the same search, and inspect the response for lexical results and degraded-mode flags.
- Expected signals: Healthy run returns vector-backed results without degraded flags; unavailable-embedder run returns lexical (BM25/FTS) candidates with `embedder_available:false` and `vector_search_skipped:true`; the run does not throw or return empty; invalid Stage 1 input (more than 5 concepts, empty query or concept, unknown search type) surfaces a typed input error rather than an empty result.
- Desired user-visible outcome: The operator can prove search still returns lexical matches and signals the degraded mode when the embedder is unavailable.
- Pass/fail: PASS only when the unavailable-embedder run returns lexical results with degraded flags and the success path is unchanged.

---

## 3. TEST EXECUTION

### Prompt

```text
Validate graceful embedder-degrade with a healthy embedder baseline and an unavailable-embedder run.
```

### Commands

1. With a healthy embedder, run `memory_search({ query: "manual playbook embedder degrade probe", limit: 5 })` and capture result IDs as `BASELINE`.
2. In a sandbox, force the embedder to return a null or empty embedding using the local test harness.
3. Rerun `memory_search({ query: "manual playbook embedder degrade probe", limit: 5 })` and capture `DEGRADED`.
4. Confirm `DEGRADED` is non-empty, contains lexical candidates, and the response carries `embedder_available:false` and `vector_search_skipped:true`.
5. Issue an invalid Stage 1 input (for example a multi-concept array of more than 5 concepts) and confirm a typed input error propagates rather than an empty result.

### Expected

- `BASELINE` returns vector-backed results with no degraded flags.
- `DEGRADED` returns lexical candidates with `embedder_available:false` and `vector_search_skipped:true`.
- The degraded run does not throw and does not return an empty result for a query with lexical matches.
- Invalid Stage 1 input fails with a typed `Stage1InputError` instead of being swallowed to empty.

### Evidence

Baseline and degraded search payloads, the degraded-mode flag fields, and the typed input-error payload.

### Pass / Fail

- **Pass**: degraded search returns lexical results with the degraded-mode flags and the success path is unchanged.
- **Fail**: degraded search throws, returns empty for a query with lexical matches, omits the degraded flags, or the success path changes.

### Failure Triage

Inspect `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`, `mcp_server/lib/search/pipeline/types.ts`, and `mcp_server/handlers/memory-search.ts`. Confirm the unavailable-embedder branch runs lexical candidate generation with `useVector=false` and that the handler plumbs the degraded-mode flags through cache.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `08--bug-fixes-and-data-integrity/graceful-embedder-degrade-to-lexical.md` | Scenario contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Embedder-unavailable detection and lexical fallback |
| `mcp_server/lib/search/pipeline/types.ts` | Degraded-mode metadata fields |
| `mcp_server/handlers/memory-search.ts` | Degraded-mode flag reporting and handler concept guard |
| `mcp_server/tests/stage1-embedder-degrade.vitest.ts` | Lexical-degrade and typed input-error regression |
| `mcp_server/tests/gate-d-regression-embedding-semantic-search.vitest.ts` | Envelope assertion regression |

---

## 5. SOURCE METADATA

- Group: Bug Fixes And Data Integrity
- Playbook ID: 450
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--bug-fixes-and-data-integrity/graceful-embedder-degrade-to-lexical.md`
