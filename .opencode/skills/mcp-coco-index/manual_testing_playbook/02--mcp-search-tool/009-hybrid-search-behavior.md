---
title: "MCP-009 -- Hybrid search behavior"
description: "This scenario validates end-to-end hybrid search behavior for `MCP-009`. It focuses on confirming that `COCOINDEX_HYBRID=true` produces a merged vector + FTS5/BM25 result set that materially differs from vector-only retrieval and surfaces at least one hit the vector-only lane missed."
---

# MCP-009 -- Hybrid search behavior

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `MCP-009`.

---

## 1. OVERVIEW

This scenario validates the end-to-end hybrid search behavior for `MCP-009`. When `COCOINDEX_HYBRID=true` is exported, `query.py` runs the vector lane and the SQLite FTS5 (BM25-style) lane sequentially and fuses them with RRF. The fused result set should include hits that pure vector retrieval cannot find — for example, exact identifier matches, rare tokens, or short queries where dense embeddings underperform — while preserving the strong semantic hits from the vector lane. This scenario verifies the merged result set materially differs from the vector-only baseline against the same query.

### Why This Matters

Scenario `CFG-006` confirms the env var toggles the response *shape* (`fts5_score` and `rrf_score` populated). This scenario goes further: it confirms the fused ranking actually delivers a different result set than vector-only, which is the operator-visible quality gate. If hybrid is enabled but the FTS5 lane silently returns zero rows (e.g. because the `code_chunks_fts` virtual table was never populated by the indexer hook), the response would still carry the new fields with null FTS5 contributions and the fused ranking would collapse back to the vector-only order. This scenario detects that silent half-failure.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MCP-009` and confirm the expected signals without contradictory evidence.

- Objective: Verify hybrid search produces a merged result set with at least one hit absent from the vector-only baseline (or, equivalently, a measurable re-ordering of the top-K) against the same query, while `fts5_score` and `rrf_score` are populated on every hybrid result.
- Real user request: `"I turned on hybrid — show me a query where it actually finds something vector-only missed, so I know it's worth keeping on."`
- Prompt: `Run the same query with hybrid off and then on; show me the result-set diff and prove hybrid surfaced at least one new hit or re-ordered the top-K.`
- Expected execution process: pick a query likely to expose hybrid's strength — short rare-token query, exact identifier, or acronym — that vector-only often misses; capture the vector-only result set first (env unset); flip `COCOINDEX_HYBRID=true`; restart the daemon; capture the hybrid result set against the same query and limit; diff the two file lists; confirm at least one file path appears in hybrid but not in vector-only OR the top-K ordering changed; capture `fts5_score`/`rrf_score` from the hybrid response to prove the lane ran; reset the env.
- Expected signals: HYBRID-OFF response returns a result list with `fts5_score`/`rrf_score` null; HYBRID-ON response returns a result list where every entry has non-null `fts5_score` and `rrf_score`; the two result sets are not identical — either at least one file path differs OR the top-K ordering differs by at least one rank swap; daemon log records `lane=vector_only` for the first query and `lane=hybrid_rrf` for the second.
- Desired user-visible outcome: A short verdict listing the two result sets side by side, marking the new-hit additions or rank swaps, and PASS confirming hybrid materially changed the retrieval.
- Pass/fail: PASS if the result sets differ in at least one of (a) file paths, (b) top-K ordering, or (c) score distribution AND hybrid response fields are populated; PARTIAL if the response fields populate but the two result sets are byte-identical (FTS5 lane returned zero rows or RRF collapsed to vector-only); FAIL if hybrid response fields are null (the opt-in did not take effect — fall through to scenario CFG-006 for the env-var contract).

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the same query with hybrid off and then on; show me the result-set diff and prove hybrid surfaced at least one new hit or re-ordered the top-K.`

### Commands

1. `bash: ccc status` — confirm the index is non-empty
2. `bash: unset COCOINDEX_HYBRID && ccc daemon stop && ccc daemon start` — HYBRID-OFF baseline
3. `mcp__cocoindex_code__search({ "query": "RerankerAdapter", "limit": 10, "refresh_index": false })` — capture VECTOR-ONLY result set; pick a short identifier-style query so the FTS5 lane has a strong opportunity to add hits (substitute another concrete identifier from the indexed tree if needed)
4. `bash: export COCOINDEX_HYBRID=true && ccc daemon stop && ccc daemon start` — flip hybrid on
5. `mcp__cocoindex_code__search({ "query": "RerankerAdapter", "limit": 10, "refresh_index": false })` — capture HYBRID result set against the exact same query and limit
6. Diff the two responses: extract the `file` field from each result, compare the two ordered lists; record (a) any file present in HYBRID but absent in VECTOR-ONLY, (b) any rank swap inside the intersecting set
7. Inspect every entry in the HYBRID response for non-null `fts5_score` and `rrf_score`
8. `bash: tail -100 ~/.cocoindex_code/daemon.log | grep -E "lane=|hybrid"` — confirm the lane switch
9. `bash: unset COCOINDEX_HYBRID && ccc daemon stop && ccc daemon start` — reset to vector-only (cleanup)

### Expected

- Step 1: status reports non-zero file and chunk counts
- Step 3: VECTOR-ONLY response is a non-empty result array with `fts5_score`/`rrf_score` null on every entry
- Step 5: HYBRID response is a non-empty result array with `fts5_score` and `rrf_score` populated on every entry
- Step 6: at least one of the following is true — (a) HYBRID includes a file path that VECTOR-ONLY does not, (b) the top-K ordering differs by at least one rank swap, (c) the score distribution shifts measurably (the highest HYBRID `rrf_score` is for a different file than the highest VECTOR-ONLY raw score)
- Step 7: every HYBRID result has non-null `fts5_score` and `rrf_score` (no half-fused entries)
- Step 8: daemon.log records `lane=vector_only` for step 3 and `lane=hybrid_rrf` for step 5

### Evidence

Capture both verbatim MCP responses (steps 3 and 5). Tabulate the result-set diff from step 6 as two columns (file path, rank). Highlight any HYBRID-only files or rank swaps. Include the `daemon.log` excerpt covering the lane switch.

### Pass / Fail

- **Pass**: Result sets differ in at least one observable way (path addition, rank swap, or score-leader change) AND all HYBRID entries have non-null `fts5_score`/`rrf_score` AND daemon.log records the lane switch.
- **Partial**: HYBRID response fields populate correctly but the result lists are byte-identical to VECTOR-ONLY (FTS5 lane returned zero rows or RRF fully agreed with vector-only ranking) — log as PARTIAL and retry with a different query that has a stronger lexical signature (rare identifier, exact API name).
- **Fail**: HYBRID response leaves `fts5_score` or `rrf_score` null on any entry (opt-in failed — fall back to scenario `CFG-006` for the env-var contract) OR HYBRID response is empty while VECTOR-ONLY returned hits (hybrid regressed below vector-only baseline).

### Failure Triage

1. If hybrid result is empty but vector-only is non-empty: inspect `~/.cocoindex_code/daemon.log` for FTS5 errors; verify the `code_chunks_fts` virtual table is populated by running `bash: sqlite3 <db-path> "SELECT count(*) FROM code_chunks_fts"`; if zero, the indexer FTS5 populate hook never ran — rebuild with `bash: ccc reset --force && ccc index`.
2. If response fields stay null on HYBRID: the env var did not propagate to the worker — confirm via `bash: env | grep COCOINDEX_HYBRID` after the daemon restart; rerun scenario `CFG-006` to validate the basic opt-in contract before continuing here.
3. If result sets are byte-identical (PARTIAL): pick a more lexically-distinctive query (exact identifier, acronym, error string) and rerun; document the PARTIAL with the original query for triage.
4. If `daemon.log` shows `lane=hybrid_rrf` but the fused order matches vector-only exactly: experiment with `COCOINDEX_HYBRID_FTS5_WEIGHT` and `COCOINDEX_HYBRID_VECTOR_WEIGHT` to confirm the weights actually influence the fused score; if they do not, escalate as a fusion regression.

### Optional Supplemental Checks

- Repeat with a semantic-leaning query (e.g., "validate user input gracefully") and confirm the result-set delta is smaller — semantic queries should favor the vector lane and produce less hybrid uplift.
- Repeat with `COCOINDEX_HYBRID_FTS5_WEIGHT=0.0` and confirm the fused ranking collapses to vector-only — proves the weight knob is wired.
- Cross-check with scenario `CFG-006` if the response-shape contract is in doubt.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `02--mcp-search-tool/001-basic-semantic-search.md` | Sibling scenario for the vector-only baseline shape |
| `02--mcp-search-tool/010-reranker-behavior.md` | Sibling scenario covering end-to-end reranker behavior |
| `03--configuration/006-hybrid-search-opt-in.md` | Sibling scenario covering the env-var opt-in contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fts_index.py` | `code_chunks_fts` virtual table and FTS5 query helpers |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fusion.py` | `rrf_fuse()` and per-channel min-max normalization |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | Hybrid dispatch on `COCOINDEX_HYBRID`; telemetry lane tagging |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py` | FTS5 populate hook called after each chunk batch |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_fts_index.py` | FTS5 virtual-table and query coverage |
| `~/.cocoindex_code/daemon.log` | Runtime evidence of the lane switch and fusion telemetry |

---

## 5. SOURCE METADATA

- Group: MCP Search Tool
- Playbook ID: MCP-009
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--mcp-search-tool/009-hybrid-search-behavior.md`
