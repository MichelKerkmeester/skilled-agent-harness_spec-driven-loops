---
title: "CFG-007 -- Reranker opt-in"
description: "This scenario validates the cross-encoder reranker opt-in surface for `CFG-007`. It focuses on confirming that `COCOINDEX_RERANK=true` activates the GTE cross-encoder, downloads the model on first call, and stamps `pre_rerank_score` and `reranker_score` on every returned result for auditability."
---

# CFG-007 -- Reranker opt-in

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CFG-007`.

---

## 1. OVERVIEW

This scenario validates the reranker opt-in surface for `CFG-007`. `config.py` declares `COCOINDEX_RERANK` (default `false`), `COCOINDEX_RERANK_MODEL` (default `Alibaba-NLP/gte-multilingual-reranker-base`), and `COCOINDEX_RERANK_TOP_K` (default 20, bounded 5-100). When opt-in is on, `query.py` runs the GTE cross-encoder after RRF fusion and heuristic boosts but before the final result slice. The cross-encoder score replaces the upstream score; `pre_rerank_score` preserves the prior value for audit and `reranker_score` carries the new cross-encoder relevance. First call downloads the ~0.61GB model from Hugging Face.

### Why This Matters

The reranker is the last opt-in retrieval stage and the only one that materially changes the top-K ordering. Operators evaluating its impact need deterministic proof that the cross-encoder actually ran — both response fields (`pre_rerank_score` + `reranker_score`) populated, and a one-time model-download trace on first call. If the env var is silently ignored or the model load fails mid-call, `query.py` is documented to fall back gracefully without rerank, leaving both fields null while still returning results; an operator who only checks "did I get results?" will miss the silent fallback.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CFG-007` and confirm the expected signals without contradictory evidence.

- Objective: Verify `COCOINDEX_RERANK=true` activates the GTE cross-encoder rerank stage; sample MCP search responses then carry non-null `pre_rerank_score` and `reranker_score` on every result, the first call after a cold cache triggers a one-time `~0.61GB` model download, and the same query with reranker off leaves both fields null.
- Real user request: `"I want to turn on the reranker but I need to know (a) that the model actually downloads, (b) that the response proves the cross-encoder ran, and (c) that I can turn it back off cleanly."`
- Prompt: `Flip COCOINDEX_RERANK on, run a sample MCP search, and confirm pre_rerank_score + reranker_score are populated and the model downloaded on first call.`
- Expected execution process: confirm the rerank-off baseline by running a sample search with `COCOINDEX_RERANK` unset and recording that `pre_rerank_score`/`reranker_score` are null; if the Hugging Face cache for `Alibaba-NLP/gte-multilingual-reranker-base` already exists, optionally clear it to validate the cold-download path; export `COCOINDEX_RERANK=true`; restart the daemon; run the sample search and observe the first-call download (slow first response, daemon log shows model-load trace); rerun a second query to confirm the model is now cached (fast response); verify both fields are populated on every result; unset the env, restart, and rerun to confirm clean fallback.
- Expected signals: RERANK-OFF response leaves `pre_rerank_score` and `reranker_score` as null on every result; RERANK-ON first call has noticeably longer wall-clock and the daemon log shows model-load activity for `Alibaba-NLP/gte-multilingual-reranker-base`; RERANK-ON second call is fast and every result carries non-null floats in both fields; cleanup unset returns the response shape to RERANK-OFF.
- Desired user-visible outcome: A short verdict naming the cold-load duration, the warm-call duration, sample `pre_rerank_score`/`reranker_score` values, and PASS confirming the reranker stage actually ran.
- Pass/fail: PASS if RERANK-ON populates both fields on every result AND first call triggers the model download AND RERANK-OFF leaves both fields null; FAIL if RERANK-ON leaves the fields null (silent fallback) OR the model fails to download AND the response still returns "successfully" without surfacing the failure (silent-degrade regression) OR the warn-on-invalid fallback fires for a clean boolean.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Flip COCOINDEX_RERANK on, run a sample MCP search, and confirm pre_rerank_score + reranker_score are populated and the model downloaded on first call.`

### Commands

1. `bash: ccc status` — confirm the index is non-empty before sampling responses
2. `bash: unset COCOINDEX_RERANK && ccc daemon stop && ccc daemon start` — establish a clean RERANK-OFF baseline; restart so any cached config is flushed
3. `mcp__cocoindex_code__search({ "query": "validation logic", "limit": 5, "refresh_index": false })` — capture RERANK-OFF response; inspect each result for `pre_rerank_score` and `reranker_score`
4. `bash: ls -lh ~/.cache/huggingface/hub/models--Alibaba-NLP--gte-multilingual-reranker-base 2>/dev/null || echo "cold cache"` — record whether the GTE model is already downloaded (cold vs warm cache)
5. `bash: export COCOINDEX_RERANK=true && ccc daemon stop && ccc daemon start` — flip reranker on; restart so the env reaches the daemon
6. `bash: time mcp__cocoindex_code__search({ "query": "validation logic", "limit": 5, "refresh_index": false })` — RERANK-ON first call; if cache was cold, this triggers the ~0.61GB model download (expect minutes); capture wall-clock and inspect each result for `pre_rerank_score` and `reranker_score`
7. `bash: time mcp__cocoindex_code__search({ "query": "validation logic", "limit": 5, "refresh_index": false })` — RERANK-ON warm call; capture wall-clock to confirm the model is now cached and the per-call overhead has dropped
8. `bash: tail -100 ~/.cocoindex_code/daemon.log | grep -Ei "rerank|gte|crossencoder"` — confirm the daemon log shows reranker activity and no warn-on-invalid fallback
9. `bash: unset COCOINDEX_RERANK && ccc daemon stop && ccc daemon start` — reset to RERANK-OFF for subsequent scenarios (cleanup)

### Expected

- Step 1: status reports non-zero file and chunk counts
- Step 3: every result in the RERANK-OFF response leaves `pre_rerank_score` and `reranker_score` as `null`
- Step 4: cache state recorded (cold or warm); the cold path proves the download contract end-to-end while the warm path still proves the reranker stage runs
- Step 6: response returns valid results; every result carries non-null floats in both `pre_rerank_score` and `reranker_score`; on a cold cache the wall-clock is noticeably longer (download + model load)
- Step 7: response returns valid results with both fields populated; wall-clock is dramatically faster than step 6 because the model is now cached in memory
- Step 8: daemon log shows reranker load trace referencing `Alibaba-NLP/gte-multilingual-reranker-base`; no `Ignoring invalid COCOINDEX_RERANK` warning appears

### Evidence

Capture all four verbatim MCP responses (steps 3, 6, 7) with the `pre_rerank_score`/`reranker_score` keys highlighted. Record cold-vs-warm cache state from step 4 and the two wall-clock measurements from steps 6 and 7. Include the daemon.log excerpt covering the reranker load.

### Pass / Fail

- **Pass**: Steps 6 and 7 populate `pre_rerank_score` and `reranker_score` on every result AND step 3 leaves both null AND daemon.log records reranker activity with no warn-on-invalid fallback. Cold-cache cold-load is a nice-to-have but not required if the cache was already warm.
- **Fail**: Step 6 or 7 leaves the fields null (silent fallback because the model failed to load) OR step 3 populates them (env-default inversion) OR daemon crashes after the env flip OR a warn-on-invalid fallback fires for the clean `true` value OR the response returns successfully without surfacing a documented model-load failure (silent-degrade regression).

### Failure Triage

1. If step 6/7 leaves the fields null: confirm the env was exported before the daemon restart (`bash: env | grep COCOINDEX_RERANK`); confirm the daemon restarted (`bash: ccc daemon status`); inspect daemon.log for a model-load error from `RerankerAdapter`.
2. If the cold-cache download fails: check disk space (~1GB free required); confirm outbound HTTPS to `huggingface.co` is available; rerun with `HF_HUB_VERBOSITY=debug` for the daemon process to capture the download trace.
3. If a warn-on-invalid fallback fires for `true`: inspect `_parse_bool_env` in `cocoindex_code/config.py` for a regression; capture the exact warning.
4. If the daemon crashes loading the model: check RAM headroom (~0.61GB fp16 plus working set); switch to a smaller `COCOINDEX_RERANK_MODEL` for the smoke test and rerun.
5. If response is successful but fields remain null even on a warm cache: this is the silent-degrade failure mode — inspect `RerankerAdapter` for fallback paths that should have logged a warning; capture the verbatim daemon.log and escalate.

### Optional Supplemental Checks

- Pair with `COCOINDEX_RERANK_TOP_K=5` (low end) and `=100` (high end) to confirm the rerank candidate window changes the per-call latency and the spread of `reranker_score` values.
- Override `COCOINDEX_RERANK_MODEL` with a smaller cross-encoder (e.g., `cross-encoder/ms-marco-MiniLM-L-6-v2`) to validate the model-name override path and shorten cold-cache benchmarks.
- Cross-check against scenario `MCP-00N reranker-behavior` (search-tool category) for top-K ordering effects rather than just the response-shape contract validated here.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `03--configuration/006-hybrid-search-opt-in.md` | Sibling opt-in scenario (hybrid) |
| `03--configuration/005-chunking-env-override.md` | Sibling env-var-override scenario (chunking) |
| `02--mcp-search-tool/001-basic-semantic-search.md` | Sibling search-shape scenario for the rerank-off baseline |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | `COCOINDEX_RERANK*` declarations with defaults and bounds |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py` | `RerankerAdapter` wrapping `sentence-transformers` CrossEncoder; lazy init; graceful fallback |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | `query_codebase()` invokes reranker after RRF fusion + heuristic boosts; cross-encoder score replaces RRF score |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py` | `pre_rerank_score` and `reranker_score` response fields |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_reranker.py` | Reranker unit coverage including fallback-on-load-failure |
| `~/.cache/huggingface/hub/models--Alibaba-NLP--gte-multilingual-reranker-base` | Cached model directory on warm cache |
| `~/.cocoindex_code/daemon.log` | Runtime evidence of reranker activity |

---

## 5. SOURCE METADATA

- Group: Configuration
- Playbook ID: CFG-007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--configuration/007-reranker-opt-in.md`
