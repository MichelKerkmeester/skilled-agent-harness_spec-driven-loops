# Seat opus-codegraph-daemon — iteration 4 (global #19)

- Model: `claude-opus-4-8` · Executor: claude · Angle: opus-codegraph-daemon
- Verdict: **PASS** · Findings: P0=0 P1=0 P2=1

## Analysis

I've traced the full BM25 symbol resolver and its single production caller. Here is my analysis.

## Analysis — `opus-codegraph-daemon` seat

**Module under review:** `mcp_server/lib/symbol-bm25-resolver.ts` (383 lines), its production caller `mcp_server/handlers/query.ts`, the data source `code-graph-db.ts:querySymbolIndexRows`, and the test `symbol-bm25-resolver.vitest.ts`.

### Gating & blast-radius (the key correctness question for my angle)
The resolver is **correctly and tightly gated**:
- Default-OFF behind `SPECKIT_CODE_GRAPH_BM25_SYMBOL_RESOLVER`; `isCodeGraphBm25SymbolResolverEnabled()` returns `false` unless the env value is in `ENABLED_VALUES` (`symbol-bm25-resolver.ts:120-123`), confirmed by test `:30-34`.
- Invoked only as a **last resort** in `resolveSubject`, after exact `symbol_id`, `fq_name`, and `name` lookups all fail (`query.ts:484`).
- Results carry `disambiguationOnly: true` and flow **only** into the error response `buildUnresolvedSubjectError` (`query.ts:1643-1649`). They never resolve a `symbolId` or drive a structural query. So even a wrong fuzzy match cannot corrupt a query result — it is a hint surfaced to a caller who already failed exact resolution.

This means **false-match risk has a low impact ceiling by construction.** That is the correct design for a fuzzy fallback, not a defect.

### Fuzzy-lookup correctness — verified sound
- `splitIdentifier` (`:125-132`) correctly handles camelCase (`v2Handler→v2 handler`) and acronym boundaries (`HTTPServer→HTTP server`); drops <2-char tokens.
- `trigrams` (`:134-141`) gated to tokens ≥4 chars, avoiding noise on short tokens like `get`/`api`. The near-miss test (`handleMemryContext` typo → `handleMemoryContext`) passes because the `handle` + `context` tokens and most `memory`/`memry` trigrams still overlap (`:65-85`).
- IDF (`:370-373`) uses `Math.log(1 + (N - df + 0.5)/(df + 0.5))` — the leading `1 +` guarantees a **strictly positive** IDF even when a trigram appears in a majority of documents, so common trigrams are down-weighted but never produce negative/zero scores that would scramble ranking. `idf` is only ever called after a `postings` existence check, so `df ≥ 1` always.
- Zero-length documents are excluded before consuming a numeric id (`:226-228`), so `symbolIds[numericId]` indexing and `averageLength` (`:268`) are never skewed. Sort tiebreakers (`:318-321`) are fully deterministic.
- Score normalization `rawScore/(rawScore+4)` is monotonic, so post-normalization sort order matches rawScore order; the `score > 0` filter (`:315`) is a harmless no-op given positive IDF.

### One latent robustness issue (not reachable in production)
`addDocument` (`:223-244`) is not idempotent on a repeated `symbolId`: it overwrites `documents` but **re-adds** to `totalDocumentLength` and **re-pushes** postings under the same `numericId`, which would double-count term frequencies and skew `averageLength`/scores. The sole production caller (`querySymbolIndexRows`, `code-graph-db.ts:1236`) selects from `code_nodes` where `symbol_id TEXT NOT NULL UNIQUE` (`code-graph-db.ts:161`), so duplicates cannot occur on the live path. I am flagging it only as defensive hardening for the exported public API/tests — it is **not** a reachable defect today.

### Verdict
The resolver is correct, deterministic, and properly fenced (default-off, suggestion-only, error-path-only). No reachable correctness, false-match, or gating defect. Prior passes' remediation of this area holds up. One honest, clearly-caveated P2 for public-API robustness; nothing that blocks.

```json
{"seat":"opus-codegraph-daemon","model":"claude-opus-4-8","angle":"Code-graph BM25 symbol resolver: fuzzy lookup correctness; false-match risk; optional-path gating.","verdict":"PASS","summary":"Resolver is default-off, suggestion-only, error-path-only; fuzzy/IDF/sort logic correct & deterministic. No reachable defect. One latent non-idempotent addDocument noted as P2 hardening (unreachable: symbol_id is UNIQUE).","files_reviewed":[".opencode/skills/system-code-graph/mcp_server/lib/symbol-bm25-resolver.ts",".opencode/skills/system-code-graph/mcp_server/handlers/query.ts",".opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts",".opencode/skills/system-code-graph/mcp_server/tests/symbol-bm25-resolver.vitest.ts"],"findings":[{"severity":"P2","dimension":"maintainability","title":"addDocument not idempotent on duplicate symbolId (double-counts length & postings)","file":".opencode/skills/system-code-graph/mcp_server/lib/symbol-bm25-resolver.ts:223","evidence":"On a repeated symbolId, nextNumericId() returns the existing id, documents.set() overwrites, but totalDocumentLength += length runs again and postings.docIds/*Tfs.push() re-append under the same numericId, duplicating that doc's postings for each term.","why":"Would corrupt averageLength and per-term scoring (a doc counted twice). Not reachable on the production path: querySymbolIndexRows selects from code_nodes where symbol_id is TEXT NOT NULL UNIQUE (code-graph-db.ts:161), so the exported index/addDocument are only exposed to duplicates via direct API/test misuse.","recommendation":"Guard addDocument against an already-present symbolId (early-return or rebuild that doc's postings) so the exported SymbolPackedBm25Index is safe for arbitrary callers, not only the dedup-guaranteed DB caller."}]}
```
