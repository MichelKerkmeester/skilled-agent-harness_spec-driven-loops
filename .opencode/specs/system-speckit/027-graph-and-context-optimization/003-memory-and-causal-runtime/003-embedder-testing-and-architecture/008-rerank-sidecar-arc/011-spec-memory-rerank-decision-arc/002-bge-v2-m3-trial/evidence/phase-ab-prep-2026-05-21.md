# Phase A/B Preparation Evidence - 2026-05-21

## Revision Pin

HuggingFace model API:

```bash
curl -s https://huggingface.co/api/models/BAAI/bge-reranker-v2-m3/revision/main
```

Observed `sha`:

```text
953dc6f6f85a1b2dbfca4c34a2796e7dde08d41e
```

## Prefetch

```bash
HF_HUB_OFFLINE=0 TRANSFORMERS_OFFLINE=0 .opencode/skills/system-rerank-sidecar/.venv/bin/python -c 'from huggingface_hub import snapshot_download; p=snapshot_download(repo_id="BAAI/bge-reranker-v2-m3", revision="953dc6f6f85a1b2dbfca4c34a2796e7dde08d41e"); print(p)'
```

```text
Fetching 13 files: 100%|██████████| 13/13 [00:00<00:00, 19641.91it/s]
/Users/michelkerkmeester/.cache/huggingface/hub/models--BAAI--bge-reranker-v2-m3/snapshots/953dc6f6f85a1b2dbfca4c34a2796e7dde08d41e
```

## Requested Port 8765 Health After Restart Attempt

The existing listener could not be terminated from this sandbox:

```text
zsh:kill:1: kill 84109 failed: operation not permitted
```

So `:8765` remained the pre-existing Qwen-only process:

```bash
curl -s -w '\nHTTP_STATUS:%{http_code}\n' http://127.0.0.1:8765/health
```

```json
{"status":"ok","model_loaded":true,"model_name":"Qwen/Qwen3-Reranker-0.6B","default_model":"Qwen/Qwen3-Reranker-0.6B","allowed_models":["Qwen/Qwen3-Reranker-0.6B"],"loaded_models":["Qwen/Qwen3-Reranker-0.6B"],"queue_depth":0,"uptime_s":18615.95}
```

```text
HTTP_STATUS:200
```

## Fallback Port 8766 Health With Updated Env

```bash
RERANK_SIDECAR_PORT=8766 bash .opencode/skills/system-rerank-sidecar/scripts/start.sh
curl -s -w '\nHTTP_STATUS:%{http_code}\n' http://127.0.0.1:8766/health
```

```json
{"status":"ok","model_loaded":false,"model_name":"Qwen/Qwen3-Reranker-0.6B","default_model":"Qwen/Qwen3-Reranker-0.6B","allowed_models":["BAAI/bge-reranker-v2-m3","Qwen/Qwen3-Reranker-0.6B","cross-encoder/ms-marco-MiniLM-L-6-v2"],"loaded_models":["BAAI/bge-reranker-v2-m3"],"queue_depth":0,"uptime_s":88.66}
```

```text
HTTP_STATUS:200
```

## Warmup

First warmup measurement on the updated `:8766` process:

```bash
curl -s -w '\nCURL_TIME_TOTAL_SECONDS:%{time_total}\nHTTP_STATUS:%{http_code}\n' \
  -X POST http://127.0.0.1:8766/warmup \
  -H 'Content-Type: application/json' \
  -d '{"model":"BAAI/bge-reranker-v2-m3"}'
```

```text
RSS_BEFORE_BYTES=413138944
{"status":"warmed","model":"BAAI/bge-reranker-v2-m3","revision":"953dc6f6f85a1b2dbfca4c34a2796e7dde08d41e"}
CURL_TIME_TOTAL_SECONDS:0.823521
HTTP_STATUS:200
RSS_AFTER_BYTES=923697152
RSS_DELTA_BYTES=510558208
```

Second idempotent warmup probe after model load:

```text
{"status":"warmed","model":"BAAI/bge-reranker-v2-m3","revision":"953dc6f6f85a1b2dbfca4c34a2796e7dde08d41e"}
CURL_TIME_TOTAL_SECONDS:0.000618
HTTP_STATUS:200
```

## Smoke Test

Input used fixture query `fixture-001` from `benchmark-2026-05-21-spec-memory-mps/rerank-ab-fixture.json` with the gold path plus four distractors from the same fixture.

```bash
curl -s -w '\nHTTP_STATUS:%{http_code}\n' \
  -X POST http://127.0.0.1:8766/rerank \
  -H 'Content-Type: application/json' \
  -d '{"model":"BAAI/bge-reranker-v2-m3","query":"documentation verification checklist for the CocoIndex complete-fork author docs phase","documents":["system-spec-kit/027-xce-research-based-refinement/013-cocoindex-complete-fork/004-docs/checklist.md - documentation verification checklist for CocoIndex complete fork author docs","system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/041-v-rule-cross-spec-overreach/spec.md - V8 cross-spec contamination and ADR prefix overreach","system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/003-contextador/implementation-summary.md - deep-research summary comparing Contextador retrieval ergonomics","system-spec-kit/026-graph-and-context-optimization/008-template-levels/001-template-level-consolidation-research/decision-record.md - ADR consolidating spec-kit templates","system-spec-kit/026-graph-and-context-optimization/005-code-graph/009-fix-iteration-quality-meta-research/spec.md - review findings into fix-completeness inventories"],"top_k":5}'
```

```json
{"results":[{"index":0,"relevance_score":0.7293461354217158},{"index":1,"relevance_score":0.5000286688100145},{"index":4,"relevance_score":0.5000262687208064},{"index":2,"relevance_score":0.500016302436046},{"index":3,"relevance_score":0.5000122765004538}],"model":"BAAI/bge-reranker-v2-m3","latency_ms":230}
```

```text
HTTP_STATUS:200
```
