---
title: "MCP-010 -- Reranker behavior"
description: "This scenario validates end-to-end cross-encoder reranker behavior for `MCP-010`. It focuses on confirming that `COCOINDEX_RERANK=true` produces a measurably re-ordered top-K against the same query, with `reranker_score` reflecting cross-encoder relevance rather than the upstream RRF or vector score."
---

# MCP-010 -- Reranker behavior

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `MCP-010`.

---

## 1. OVERVIEW

This scenario validates the end-to-end reranker behavior for `MCP-010`. When `COCOINDEX_RERANK=true` is exported, `query.py:query_codebase()` runs the GTE cross-encoder after RRF fusion and heuristic boosts but before the final slice. The cross-encoder rescores the top-K candidates (default 20, bounded 5-100 via `COCOINDEX_RERANK_TOP_K`); the new score replaces the upstream score in the response, `pre_rerank_score` preserves the prior score for audit, and `reranker_score` carries the new cross-encoder relevance. This scenario verifies the rerank stage materially re-orders the top results against the same query, not just that the response fields are populated.

### Why This Matters

Scenario `CFG-007` confirms the env var toggles the response *shape* (`pre_rerank_score` and `reranker_score` populated) and validates the cold-cache model download. This scenario goes further: it confirms the cross-encoder actually changes the top-K ordering, which is the operator-visible quality outcome. If the reranker silently fell back to the upstream order (e.g., model loaded but scoring returned constants, or the score-replacement path was skipped), the response would still carry both new fields and an operator who only checks the field presence would miss the silent half-failure.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MCP-010` and confirm the expected signals without contradictory evidence.

- Objective: Verify the reranker materially re-orders the top-K against the same query; the top-3 with reranker ON differs from the top-3 with reranker OFF by at least one rank swap, and every reranked result carries a non-null `reranker_score` reflecting cross-encoder relevance rather than echoing the upstream score.
- Real user request: `"I turned on the reranker — show me a query where the top-3 actually changes order, so I know the cross-encoder is doing work."`
- Prompt: `Run the same query with reranker off and then on; show me the top-3 reordering and prove reranker_score is not just echoing pre_rerank_score.`
- Expected execution process: pick a query with several near-relevance candidates so a re-ranker has signal to work with; capture the rerank-off result set first (env unset); flip `COCOINDEX_RERANK=true`; restart the daemon; pre-warm the model cache by running one sample call (so the timed comparison query measures rerank cost, not download cost); capture the rerank-on result set against the same query and limit; compare top-3 file paths and ranks; verify `reranker_score` is not constant across entries and is not byte-identical to `pre_rerank_score`; reset the env.
- Expected signals: RERANK-OFF response returns a result list with `pre_rerank_score`/`reranker_score` null; RERANK-ON response returns a result list where every entry has non-null `pre_rerank_score` and `reranker_score`, those two values are not identical (cross-encoder produced a different score), and the top-3 ordering differs from RERANK-OFF by at least one rank swap; daemon log records reranker activity.
- Desired user-visible outcome: A short verdict listing the two top-3 lists side by side with `pre_rerank_score` and `reranker_score` for each entry, marking the rank swaps, and PASS confirming the reranker materially changed the ordering.
- Pass/fail: PASS if RERANK-ON top-3 differs from RERANK-OFF top-3 in at least one rank position AND `reranker_score` differs from `pre_rerank_score` on at least one entry AND `reranker_score` is not constant across entries; PARTIAL if rerank fields populate but the top-K ordering is byte-identical to the rerank-off baseline (reranker confirmed upstream order — rare but possible on well-aligned queries); FAIL if `pre_rerank_score` or `reranker_score` is null on any entry (silent fallback — fall back to scenario `CFG-007` for the env-var contract) OR `reranker_score` equals `pre_rerank_score` exactly on every entry (score-replacement path is no-op).

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the same query with reranker off and then on; show me the top-3 reordering and prove reranker_score is not just echoing pre_rerank_score.`

### Commands

1. `bash: ccc status` — confirm the index is non-empty
2. `bash: unset COCOINDEX_RERANK && ccc daemon stop && ccc daemon start` — RERANK-OFF baseline
3. `mcp__cocoindex_code__search({ "query": "graceful fallback when model load fails", "limit": 5, "refresh_index": false })` — capture RERANK-OFF result set; pick a multi-clause query that has several near-relevance candidates so the cross-encoder has signal (substitute another such query if the indexed tree has stronger options)
4. `bash: export COCOINDEX_RERANK=true && ccc daemon stop && ccc daemon start` — flip reranker on
5. `mcp__cocoindex_code__search({ "query": "warmup call", "limit": 3, "refresh_index": false })` — pre-warm the model cache so the next call measures rerank cost, not cold-load cost (one-off; ignore the response)
6. `mcp__cocoindex_code__search({ "query": "graceful fallback when model load fails", "limit": 5, "refresh_index": false })` — capture RERANK-ON result set against the exact same query and limit as step 3
7. Compare top-3 between step 3 and step 6: extract `file` and `lines` from each top-3 entry; record any rank swap or top-3 addition
8. Inspect every entry in the RERANK-ON response: confirm `pre_rerank_score` and `reranker_score` are both non-null; confirm `reranker_score` is NOT identical to `pre_rerank_score` on at least one entry; confirm `reranker_score` is NOT a constant across entries
9. `bash: tail -100 ~/.cocoindex_code/daemon.log | grep -Ei "rerank|gte|crossencoder"` — confirm reranker activity
10. `bash: unset COCOINDEX_RERANK && ccc daemon stop && ccc daemon start` — reset to rerank-off (cleanup)

### Expected

- Step 1: status reports non-zero file and chunk counts
- Step 3: RERANK-OFF response is a non-empty result array with `pre_rerank_score`/`reranker_score` null on every entry
- Step 5: warm-up call returns successfully (response shape not inspected; sole purpose is to load the cross-encoder into memory)
- Step 6: RERANK-ON response is a non-empty result array with both `pre_rerank_score` and `reranker_score` populated on every entry
- Step 7: top-3 of step 6 differs from top-3 of step 3 in at least one rank position
- Step 8: `reranker_score` is not byte-identical to `pre_rerank_score` on at least one entry AND `reranker_score` is not constant across all entries
- Step 9: daemon.log shows reranker load/score traces referencing the GTE cross-encoder

### Evidence

Capture both verbatim MCP responses (steps 3 and 6). Tabulate the top-3 of each side by side with columns (rank, file, lines, score). For the RERANK-ON response, include a column for `pre_rerank_score` and `reranker_score` to make the score-replacement evidence visible. Highlight rank swaps. Include the `daemon.log` excerpt covering reranker activity.

### Pass / Fail

- **Pass**: Step-6 top-3 differs from step-3 top-3 in at least one rank AND step-6 `reranker_score` differs from `pre_rerank_score` on at least one entry AND `reranker_score` varies across entries AND daemon.log records reranker activity.
- **Partial**: Step-6 fields populate correctly but the top-K ordering is byte-identical to step 3 (reranker confirmed upstream order — log as PARTIAL and retry with a query that has stronger semantic discrimination among the top candidates).
- **Fail**: Any step-6 entry has null `pre_rerank_score` or null `reranker_score` (silent fallback — fall back to scenario `CFG-007` for the env-var contract) OR `reranker_score` equals `pre_rerank_score` exactly on every entry (score-replacement is a no-op) OR `reranker_score` is constant across entries (cross-encoder did not discriminate).

### Failure Triage

1. If null fields appear on RERANK-ON: confirm the env was exported before the daemon restart (`bash: env | grep COCOINDEX_RERANK`); rerun scenario `CFG-007` to validate the cold-cache opt-in contract; inspect `~/.cocoindex_code/daemon.log` for a `RerankerAdapter` fallback log line.
2. If `reranker_score` equals `pre_rerank_score` on every entry: inspect `query.py:query_codebase()` for the score-replacement assignment; this is a logic regression and must be escalated.
3. If `reranker_score` is constant across entries: model may have loaded with broken weights — clear the Hugging Face cache (`bash: rm -rf ~/.cache/huggingface/hub/models--Alibaba-NLP--gte-multilingual-reranker-base`) and rerun cold so the model re-downloads.
4. If top-3 is byte-identical (PARTIAL): pick a query with broader semantic spread among the top candidates and rerun; document the PARTIAL with the original query for triage. Some queries genuinely have one obvious top hit and the cross-encoder will agree.
5. If the rerank-on call times out: lower `COCOINDEX_RERANK_TOP_K` to 5 to reduce cross-encoder workload, or temporarily switch `COCOINDEX_RERANK_MODEL` to a smaller cross-encoder to confirm the integration before tuning the production model.

### Optional Supplemental Checks

- Pair with `COCOINDEX_RERANK_TOP_K=5` and `=50` and confirm a larger top-K window produces more rank churn relative to RERANK-OFF.
- Override `COCOINDEX_RERANK_MODEL` with a smaller cross-encoder (e.g., `cross-encoder/ms-marco-MiniLM-L-6-v2`) and confirm the rank swap pattern is qualitatively different — proves the model knob is wired.
- Pair with `COCOINDEX_HYBRID=true` to verify reranker + hybrid stack cleanly: the upstream RRF score should appear in `pre_rerank_score` and the cross-encoder relevance in `reranker_score`.
- Cross-check with scenario `CFG-007` if the response-shape contract is in doubt.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `02--mcp-search-tool/001-basic-semantic-search.md` | Sibling scenario for the baseline result-set shape |
| `02--mcp-search-tool/009-hybrid-search-behavior.md` | Sibling scenario covering end-to-end hybrid behavior |
| `03--configuration/007-reranker-opt-in.md` | Sibling scenario covering the env-var opt-in contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py` | `RerankerAdapter` wrapping `sentence-transformers` CrossEncoder; lazy init; graceful fallback |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | `query_codebase()` invokes reranker after RRF fusion; cross-encoder score replaces upstream score |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py` | `pre_rerank_score` and `reranker_score` response fields |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_reranker.py` | Reranker unit coverage including score-replacement and fallback-on-load-failure |
| `~/.cache/huggingface/hub/models--Alibaba-NLP--gte-multilingual-reranker-base` | Cached cross-encoder weights |
| `~/.cocoindex_code/daemon.log` | Runtime evidence of reranker activity |

---

## 5. SOURCE METADATA

- Group: MCP Search Tool
- Playbook ID: MCP-010
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--mcp-search-tool/010-reranker-behavior.md`
