---
title: "CFG-007 -- Reranker default-on (with opt-out)"
description: "This scenario validates the cross-encoder reranker default-on surface for `CFG-007`. It focuses on confirming that the reranker runs by default (`COCOINDEX_RERANK=true` as of v1.10), that the default model `Qwen/Qwen3-Reranker-0.6B` stamps `pre_rerank_score` and `reranker_score` on every returned result, and that operators can disable the rerank stage via `COCOINDEX_RERANK=false`."
---

# CFG-007 -- Reranker default-on (with opt-out)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CFG-007`.

> **Filename note:** kept as `007-reranker-opt-in.md` for catalog stability after the v1.10 default-on promotion; the scenario semantics now cover the default-on contract plus the opt-out path.

---

## 1. OVERVIEW

This scenario validates the reranker default-on surface for `CFG-007`. As of the 023B follow-on, `config.py` declares `COCOINDEX_RERANK` (default `true`), `COCOINDEX_RERANK_MODEL` (default `Qwen/Qwen3-Reranker-0.6B`, registered at `registered_embedders.py:256`), and `COCOINDEX_RERANK_TOP_K` (default 20, bounded 5-100). With the env unset, `query.py` runs the cross-encoder after RRF fusion and heuristic boosts but before the final result slice. The cross-encoder score replaces the upstream score; `pre_rerank_score` preserves the prior value for audit and `reranker_score` carries the new cross-encoder relevance. First call after a cold cache downloads the ~1.1 GB Qwen3-0.6B model from Hugging Face (smaller than the v1.10 BGE-reranker-v2-m3 (~2.3 GB) and the pre-v1.10 GTE-multilingual (~0.61 GB)).

### Why This Matters

The reranker is the last retrieval stage and the only one that materially changes the top-K ordering. Operators evaluating the change to default-on need deterministic proof that the cross-encoder actually ran by default — both response fields (`pre_rerank_score` + `reranker_score`) populated when the env is unset — and a clean fallback when they set `COCOINDEX_RERANK=false`. If the env-default flip silently regressed, or if the model load fails mid-call, `RerankerAdapter` is documented to fall back gracefully without rerank; an operator who only checks "did I get results?" will miss the silent fallback. The GTE→BGE swap in v1.10 was driven by exactly this failure mode on Apple Silicon MPS (`AcceleratorError: index ... is out of bounds`); the subsequent BGE→Qwen3 swap (023B follow-on) was driven by empirical hit-rate + p95 gains on the 73-probe expanded fixture (+1 hit, -32% p95, Apache-2.0 licensed).

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CFG-007` and confirm the expected signals without contradictory evidence.

- Objective: Verify the reranker is default-on (`COCOINDEX_RERANK=true`) — sample MCP search responses with the env unset carry non-null `pre_rerank_score` and `reranker_score` on every result. Cold-cache cold-load is observable via a noticeably longer wall-clock on the first call (the daemon itself does NOT emit a model-name load line on successful CrossEncoder init — silent success is normal; warnings only appear via `logger.warning` on failure paths). Verify the opt-out path (`COCOINDEX_RERANK=false`) returns the response shape to the no-rerank baseline (both fields null). On a cold Hugging Face cache, the first call triggers a one-time ~1.1 GB Qwen3-Reranker-0.6B download.
- Real user request: `"I want to confirm the reranker actually runs by default and that I can turn it off cleanly if I need to."`
- Prompt: `Run a sample MCP search with COCOINDEX_RERANK unset and confirm pre_rerank_score + reranker_score are populated; then set COCOINDEX_RERANK=false and confirm both fields go null.`
- Expected execution process: confirm the default-on baseline by running a sample search with `COCOINDEX_RERANK` unset and recording that `pre_rerank_score`/`reranker_score` are populated; if the Hugging Face cache for `Qwen/Qwen3-Reranker-0.6B` already exists, optionally clear it to validate the cold-download path; observe the first-call cold load via the wall-clock gap (slow first response on cold cache — daemon log will NOT log the model name on successful load, only on warning/error paths); rerun a second query to confirm the model is now cached (fast response); export `COCOINDEX_RERANK=false`; restart the daemon; run the sample search and confirm both fields go null; restore by unsetting the env or setting it back to `true` and confirm clean re-activation.
- Expected signals: DEFAULT-ON (env unset) first call has noticeably longer wall-clock on a cold cache; daemon log does NOT contain a model-name load line on successful init (silent success). DEFAULT-ON second call is fast and every result carries non-null floats in both fields. Daemon log warnings about model load failures or fallback paths ONLY appear when CrossEncoder initialization or per-call predict fails. RERANK-DISABLED (`COCOINDEX_RERANK=false`) response leaves both fields null on every result.
- Desired user-visible outcome: A short verdict naming the cold-load duration (if applicable), the warm-call duration, sample `pre_rerank_score`/`reranker_score` values, and PASS confirming the reranker stage runs by default and disables cleanly.
- Pass/fail: PASS if DEFAULT-ON populates both fields on every result AND RERANK-DISABLED leaves both fields null AND the daemon log contains NO warn-on-fallback or model-load-failure warning for the reranker stage; FAIL if DEFAULT-ON leaves the fields null (silent fallback or env-default regression) OR the model fails to download AND the response still returns "successfully" without surfacing the failure (silent-degrade regression) OR a warn-on-invalid fallback fires for a clean boolean OR daemon log contains a CrossEncoder load-failure warning for the reranker.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run a sample MCP search with COCOINDEX_RERANK unset and confirm pre_rerank_score + reranker_score are populated; then set COCOINDEX_RERANK=false and confirm both fields go null. Verify the daemon log contains no reranker load-failure warning.`

### Commands

1. `bash: ccc status` — confirm the index is non-empty before sampling responses
2. `bash: unset COCOINDEX_RERANK && ccc daemon stop && ccc daemon start` — establish the default-on baseline (env unset means default `true`); restart so any cached config is flushed
3. `bash: ls -lh ~/.cache/huggingface/hub/models--Qwen--Qwen3-Reranker-0.6B 2>/dev/null || echo "cold cache"` — record whether the Qwen3 model is already downloaded (cold vs warm cache)
4. `bash: time mcp__cocoindex_code__search({ "query": "validation logic", "limit": 5, "refresh_index": false })` — DEFAULT-ON first call; if cache was cold, this triggers the ~1.1 GB Qwen3-Reranker-0.6B model download (expect minutes); capture wall-clock and inspect each result for `pre_rerank_score` and `reranker_score`
5. `bash: time mcp__cocoindex_code__search({ "query": "validation logic", "limit": 5, "refresh_index": false })` — DEFAULT-ON warm call; capture wall-clock to confirm the model is now cached and the per-call overhead has dropped
6. `bash: tail -200 ~/.cocoindex_code/daemon.log | grep -Ei "warn|error|fallback|fail"` — confirm the daemon log contains NO warning/error/fallback message related to reranker load (the daemon does not emit a positive "loaded model X" line — silent success is normal)
7. `bash: export COCOINDEX_RERANK=false && ccc daemon stop && ccc daemon start` — flip reranker off; restart so the env reaches the daemon
8. `mcp__cocoindex_code__search({ "query": "validation logic", "limit": 5, "refresh_index": false })` — RERANK-DISABLED response; inspect each result and confirm `pre_rerank_score` and `reranker_score` are null
9. `bash: unset COCOINDEX_RERANK && ccc daemon stop && ccc daemon start` — restore the default-on baseline for subsequent scenarios (cleanup)

### Expected

- Step 1: status reports non-zero file and chunk counts
- Step 3: cache state recorded (cold or warm); the cold path proves the download contract end-to-end while the warm path still proves the reranker stage runs
- Step 4: response returns valid results; every result carries non-null floats in both `pre_rerank_score` and `reranker_score`; on a cold cache the wall-clock is noticeably longer (Qwen3 download + CrossEncoder init)
- Step 5: response returns valid results with both fields populated; wall-clock is dramatically faster than step 4 because the model is now cached in memory
- Step 6: daemon log contains NO reranker-related warning/error/fallback message; no `Ignoring invalid COCOINDEX_RERANK` warning appears (the daemon does not emit a positive load-trace line on successful CrossEncoder init)
- Step 8: every result in the RERANK-DISABLED response leaves `pre_rerank_score` and `reranker_score` as `null`

### Evidence

Capture all three verbatim MCP responses (steps 4, 5, 8) with the `pre_rerank_score`/`reranker_score` keys highlighted. Record cold-vs-warm cache state from step 3 and the two wall-clock measurements from steps 4 and 5. Include the daemon.log excerpt from step 6 showing absence of reranker-related warning/error messages.

### Pass / Fail

- **Pass**: Steps 4 and 5 populate `pre_rerank_score` and `reranker_score` on every result AND step 8 leaves both null AND daemon.log contains no reranker-related warning/error/fallback messages with no warn-on-invalid fallback. Cold-cache cold-load is a nice-to-have but not required if the cache was already warm.
- **Fail**: Step 4 or 5 leaves the fields null (silent fallback because the model failed to load — the GTE-on-MPS failure mode that drove the v1.10 swap) OR step 8 populates them (env opt-out ignored) OR daemon crashes after the env flip OR a warn-on-invalid fallback fires for a clean `false` value OR the response returns successfully without surfacing a documented model-load failure (silent-degrade regression) OR daemon.log contains a `CrossEncoder` load-failure warning.

### Failure Triage

1. If step 4/5 leaves the fields null: confirm the daemon restarted (`bash: ccc daemon status`); inspect daemon.log for a model-load error from `RerankerAdapter` (the GTE-on-MPS pattern was `AcceleratorError: index ... is out of bounds`; for Qwen3-0.6B check for OOM or sentence-transformers compatibility errors); since the daemon does not log model-name on successful load, presence of a `RerankerAdapter` warning is the signal.
2. If the cold-cache download fails: check disk space (~1.5 GB free required for Qwen3-0.6B); confirm outbound HTTPS to `huggingface.co` is available; rerun with `HF_HUB_VERBOSITY=debug` for the daemon process to capture the download trace.
3. If a warn-on-invalid fallback fires for `false`: inspect `_parse_bool_env` in `cocoindex_code/config.py` for a regression; capture the exact warning.
4. If the daemon crashes loading the model: check RAM headroom (Qwen3-Reranker-0.6B is ~600M params, ~1.1 GB on disk, fp16/fp32 working set on top); switch to a smaller `COCOINDEX_RERANK_MODEL` for the smoke test and rerun.
5. If response is successful but fields remain null even on a warm cache (the v1.10-original silent-degrade): inspect `RerankerAdapter` for fallback paths that should have logged a warning; capture the verbatim daemon.log and escalate.

### Optional Supplemental Checks

- Pair with `COCOINDEX_RERANK_TOP_K=5` (low end) and `=100` (high end) to confirm the rerank candidate window changes the per-call latency and the spread of `reranker_score` values.
- Pin `COCOINDEX_RERANK_MODEL=Alibaba-NLP/gte-multilingual-reranker-base` on a non-MPS backend to verify the model-name override path works; on Apple Silicon MPS this currently exposes the silent-fallback failure mode (no `AcceleratorError` surfaces in the response, only in daemon.log) and is useful for regression-watch only.
- Cross-check against scenario `MCP-010 reranker-behavior` (search-tool category) for top-K ordering effects rather than just the response-shape contract validated here.

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
| `~/.cache/huggingface/hub/models--Qwen--Qwen3-Reranker-0.6B` | Cached default model directory on warm cache (Qwen3-Reranker-0.6B; ~1.1 GB) |
| `~/.cache/huggingface/hub/models--BAAI--bge-reranker-v2-m3` | Cached directory if operators pin the prior v1.10 BGE default via `COCOINDEX_RERANK_MODEL` (~2.3 GB; runner-up in 023B bench) |
| `~/.cache/huggingface/hub/models--Alibaba-NLP--gte-multilingual-reranker-base` | Cached directory if operators pin the prior GTE default via `COCOINDEX_RERANK_MODEL` (broken on Apple Silicon MPS) |
| `~/.cocoindex_code/daemon.log` | Runtime evidence of reranker activity |

---

## 5. SOURCE METADATA

- Group: Configuration
- Playbook ID: CFG-007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--configuration/007-reranker-opt-in.md`
