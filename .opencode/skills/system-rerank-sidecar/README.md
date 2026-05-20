# system-rerank-sidecar — Local FastAPI Cross-Encoder Sidecar

Local HTTP service for shared Qwen cross-encoder reranking. Serves `GET /health`, `POST /warmup`, and `POST /rerank` on `127.0.0.1:8765` by default. Consumed by mk-spec-memory (opt-in per arc 008 phase 005 HOLD) and available to any MCP that wants shared cross-encoder rerank without bundling its own model.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. CONFIGURATION](#3--configuration)
- [4. USAGE EXAMPLES](#4--usage-examples)
- [5. TROUBLESHOOTING](#5--troubleshooting)
- [6. RELATED DOCUMENTS](#6--related-documents)

---

## 1. OVERVIEW

### Purpose

Provides one local HTTP endpoint that exposes `Qwen/Qwen3-Reranker-0.6B` via the sentence-transformers `CrossEncoder` adapter. Sigmoid-normalizes raw cross-encoder logits at the response boundary so callers see scores in `[0,1]` instead of raw logits.

### Audience

- **Operators**: install, start, probe the service; tune port + device + log path
- **MCP launcher authors**: integrate via the auto-ensure helpers (`bin/lib/ensure-rerank-sidecar.cjs`, `scripts/ensure_rerank_sidecar.py`)
- **Consumers**: HTTP clients (currently `mk-spec-memory`'s `cross-encoder.ts:local`)

### Prerequisites

- Python 3.11+
- `~/.cache/huggingface/hub/models--Qwen--Qwen3-Reranker-0.6B/snapshots/<sha>/` present (the model is loaded `local_files_only=True`; cache miss fails loudly)
- 1.5 GB free RAM for warm model + PyTorch + sentence-transformers
- Default port `8765` available (or set `RERANK_SIDECAR_PORT`)

### Key Stats

| Field | Value |
|-------|-------|
| Default model | `Qwen/Qwen3-Reranker-0.6B` (Apache-2.0) |
| Pinned revision | `e61197ed45024b0ed8a2d74b80b4d909f1255473` |
| Default port | `8765` (loopback only) |
| Concurrent workers | 1 (asyncio.Lock serializes `predict()`) |
| Cold-load latency | ~5-10s on Mac CPU, ~3-5s on MPS |
| Sigmoid normalized | yes (response boundary) |

---

## 2. QUICK START

```bash
# Install once
cd .opencode/skills/system-rerank-sidecar
bash scripts/install.sh

# Start
bash scripts/start.sh
```

The sidecar binds `127.0.0.1:8765`. Probe with:

```bash
curl -sf http://127.0.0.1:8765/health
```

Expected shape before warmup:

```json
{"status":"ok","model_loaded":false,"model_name":"Qwen/Qwen3-Reranker-0.6B","queue_depth":0,"uptime_s":1.0}
```

Warm the model (avoids cold-start tax on the first user-facing rerank):

```bash
curl -sf -X POST http://127.0.0.1:8765/warmup
```

Expected shape:

```json
{"status":"warmed","model":"Qwen/Qwen3-Reranker-0.6B","revision":"e61197ed45024b0ed8a2d74b80b4d909f1255473"}
```

---

## 3. CONFIGURATION

Copy `.env.example` to `.env.local` for local overrides. `scripts/start.sh` loads `.env` first and `.env.local` second.

| Variable | Default | Purpose |
|----------|---------|---------|
| `RERANK_SIDECAR_PORT` | `8765` | Localhost port |
| `RERANK_MODEL_NAME` | `Qwen/Qwen3-Reranker-0.6B` | HuggingFace model id |
| `RERANK_MODEL_REVISION` | `e61197ed...` | Pinned model commit sha |
| `RERANK_LOG_PATH` | unset | Optional JSONL request log path |
| `RERANK_DEVICE` | unset | Optional override: `cpu`, `mps`, `cuda` |

---

## 4. USAGE EXAMPLES

### Rerank a basic query

```bash
curl -sf -X POST http://127.0.0.1:8765/rerank \
  -H "Content-Type: application/json" \
  -d '{"query":"apple","documents":["apple","quantum chromodynamics"]}'
```

Expected:

```json
{
  "results": [{"index":0,"relevance_score":0.99},{"index":1,"relevance_score":0.01}],
  "model": "Qwen/Qwen3-Reranker-0.6B",
  "latency_ms": 42
}
```

Scores are sigmoid-normalized in `[0,1]` and sorted descending. `index` always refers to the original document position.

### Override the port

```bash
RERANK_SIDECAR_PORT=8766 bash scripts/start.sh
```

### Force CPU mode (when MPS pressure hurts more than CPU latency)

```bash
RERANK_DEVICE=cpu bash scripts/start.sh
```

### Opt in to request logging

```bash
RERANK_LOG_PATH=/tmp/rerank.jsonl bash scripts/start.sh
```

### Switch reranker model

`scripts/use-model.sh` is the one-step swapper — updates `.env.local`, downloads weights if missing, restarts the sidecar, probes `/health` + `/warmup`.

```bash
# Default Qwen, pinned revision
bash scripts/use-model.sh Qwen/Qwen3-Reranker-0.6B \
  --revision e61197ed45024b0ed8a2d74b80b4d909f1255473

# Lighter / faster
bash scripts/use-model.sh cross-encoder/ms-marco-MiniLM-L-6-v2

# Multilingual
bash scripts/use-model.sh BAAI/bge-reranker-v2-m3

# Apple Silicon GPU
bash scripts/use-model.sh Qwen/Qwen3-Reranker-0.6B --device mps

# Update .env.local only, don't restart
bash scripts/use-model.sh <model> --no-restart
```

Both consumers (mk-spec-memory + mcp-coco-index) automatically inherit the change — `/rerank` carries no model field, so swapping the sidecar swaps everyone.

---

## 5. TROUBLESHOOTING

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `ModuleNotFoundError` on start | venv missing/stale | `bash scripts/install.sh` |
| Port collision (EADDRINUSE) | another process owns 8765 | `RERANK_SIDECAR_PORT=8766 bash scripts/start.sh` |
| Model load tries network | cache missing | `find ~/.cache/huggingface/hub/models--Qwen--Qwen3-Reranker-0.6B/snapshots -mindepth 1 -maxdepth 1 -type d` should print 1 directory matching the pinned sha |
| Slow first request | cold model | `POST /warmup` first; confirm `.env.example` revision matches local snapshot |
| Bad downstream scores | caller is re-normalizing already-sigmoid `[0,1]` values | Preserve score ordering; do not re-clamp |
| `/warmup` times out | CPU saturation | Try `RERANK_DEVICE=mps` on Apple Silicon |
| Sustained `/rerank` p95 > 5s | known issue | Per arc 008 phase 004 HOLD — CPU/MPS device tuning required before production use |

---

## 6. RELATED DOCUMENTS

### Inside this skill

- [`SKILL.md`](./SKILL.md) — AI-agent routing + invariants + rules
- [`scripts/rerank_sidecar.py`](./scripts/rerank_sidecar.py) — the FastAPI app
- [`scripts/install.sh`](./scripts/install.sh) — venv + pip install
- [`scripts/start.sh`](./scripts/start.sh) — env loader + uvicorn exec
- [`scripts/ensure_rerank_sidecar.py`](./scripts/ensure_rerank_sidecar.py) — Python sibling of the `.cjs` ensure helper
- [`tests/test_rerank_sidecar.py`](./tests/test_rerank_sidecar.py) — pytest suite (4 P0 cases)

### Consumers + integration points

- `cross-encoder.ts:54-62` in mk-spec-memory — HTTP client for the `local` provider
- `bin/lib/ensure-rerank-sidecar.cjs` — Node-side auto-ensure helper
- `bin/lib/launcher-ipc-bridge.cjs` — sibling helper (lease pattern at file level; this sidecar uses port-bind atomicity instead)
- `mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py` — CrossEncoderRerankerAdapter that this sidecar mirrors

### Arc 008 evidence

- Phase 002 commit `b3db00d2f` — sidecar shipped
- Phase 003 commit `3ad09c6c3` — ensure-helper integration
- Phase 004 commit `c1258a54b` — A/B benchmark; **HOLD verdict**
- Phase 005 commit `06ff42cb9` — HOLD path executed (sidecar stays opt-in)
- Benchmark report: `mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/benchmark_report.md`

### External

- [HuggingFace model card](https://huggingface.co/Qwen/Qwen3-Reranker-0.6B)
- [sentence-transformers CrossEncoder docs](https://www.sbert.net/docs/cross_encoder/usage/usage.html)
- [FastAPI lifespan events](https://fastapi.tiangolo.com/advanced/events/)
