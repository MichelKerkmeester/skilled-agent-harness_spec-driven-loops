# system-rerank-sidecar

Local FastAPI service for shared Qwen cross-encoder reranking. It serves `GET /health`, `POST /warmup`, and `POST /rerank` on `127.0.0.1:8765` by default.

## Install

```bash
cd .opencode/skills/system-rerank-sidecar
bash scripts/install.sh
```

## Start

```bash
bash scripts/start.sh
```

Override the port when needed:

```bash
RERANK_SIDECAR_PORT=8766 bash scripts/start.sh
```

## Probe

```bash
curl -sf http://127.0.0.1:8765/health
```

Expected shape before warmup:

```json
{"status":"ok","model_loaded":false,"model_name":"Qwen/Qwen3-Reranker-0.6B","queue_depth":0,"uptime_s":1.0}
```

## Warm

```bash
curl -sf -X POST http://127.0.0.1:8765/warmup
```

Expected shape:

```json
{"status":"warmed","model":"Qwen/Qwen3-Reranker-0.6B","revision":"e61197ed45024b0ed8a2d74b80b4d909f1255473"}
```

## Rerank

```bash
curl -sf -X POST http://127.0.0.1:8765/rerank \
  -H "Content-Type: application/json" \
  -d '{"query":"apple","documents":["apple","quantum chromodynamics"]}'
```

Expected shape:

```json
{"results":[{"index":0,"relevance_score":0.99},{"index":1,"relevance_score":0.01}],"model":"Qwen/Qwen3-Reranker-0.6B","latency_ms":42}
```

Scores are sigmoid-normalized in `[0,1]` and sorted descending. `index` always refers to the original document position.

## Configuration

Copy `.env.example` to `.env.local` for local overrides. The useful knobs are `RERANK_SIDECAR_PORT`, `RERANK_MODEL_NAME`, `RERANK_MODEL_REVISION`, `RERANK_LOG_PATH`, and `RERANK_DEVICE`.
