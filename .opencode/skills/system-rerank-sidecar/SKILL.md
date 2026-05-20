---
name: system-rerank-sidecar
description: "Run a local FastAPI sidecar that serves Qwen/Qwen3-Reranker-0.6B cross-encoder reranking over HTTP for spec-memory and CocoIndex."
allowed-tools: [Bash, Read]
version: 0.1.0
---

<!-- Keywords: rerank, cross-encoder, qwen, qwen3-reranker, sidecar, fastapi, sigmoid, localhost:8765 -->

# system-rerank-sidecar

Dedicated local HTTP sidecar for shared cross-encoder reranking. The sidecar owns model loading, request serialization, sigmoid normalization, and the operator lifecycle for `Qwen/Qwen3-Reranker-0.6B`.

---

## 1. Purpose & Invariants

Use this skill when an OpenCode workflow needs the shared rerank sidecar installed, started, probed, warmed, or debugged.

Invariants:

- The service is plain HTTP on `127.0.0.1`, default port `8765`.
- The model is loaded lazily on `/warmup` or the first `/rerank`.
- `CrossEncoder.predict()` calls are serialized behind one `asyncio.Lock`.
- `/rerank` returns sigmoid-normalized scores in `[0,1]`, never raw logits.
- The default model revision is pinned to `e61197ed45024b0ed8a2d74b80b4d909f1255473`.
- The model loader uses `local_files_only=True`; cache misses fail instead of downloading.
- Request logging is opt-in through `RERANK_LOG_PATH`; no log file is written by default.

The core model path mirrors CocoIndex's `CrossEncoderRerankerAdapter`: build `(query, document)` pairs, call `model.predict(pairs)`, cast to floats, then sort by score. This sidecar adds FastAPI request validation, process-local locking, pinned local-cache loading, and sigmoid normalization at the response boundary.

---

## 2. Endpoints

### `GET /health`

Cheap readiness probe. It must not load the model.

Response:

```json
{
  "status": "ok",
  "model_loaded": false,
  "model_name": "Qwen/Qwen3-Reranker-0.6B",
  "queue_depth": 0,
  "uptime_s": 1.25
}
```

Example:

```bash
curl -sf http://127.0.0.1:8765/health
```

### `POST /warmup`

Loads the model if needed. This is the explicit way for launchers to pay the cold-start cost before a user-facing rerank request.

Response:

```json
{
  "status": "warmed",
  "model": "Qwen/Qwen3-Reranker-0.6B",
  "revision": "e61197ed45024b0ed8a2d74b80b4d909f1255473"
}
```

Example:

```bash
curl -sf -X POST http://127.0.0.1:8765/warmup
```

### `POST /rerank`

Request:

```json
{
  "query": "apple",
  "documents": ["apple", "quantum chromodynamics"],
  "top_k": 2
}
```

Response:

```json
{
  "results": [
    {"index": 0, "relevance_score": 0.99},
    {"index": 1, "relevance_score": 0.01}
  ],
  "model": "Qwen/Qwen3-Reranker-0.6B",
  "latency_ms": 42
}
```

Example:

```bash
curl -sf -X POST http://127.0.0.1:8765/rerank \
  -H "Content-Type: application/json" \
  -d '{"query":"apple","documents":["apple","quantum chromodynamics"]}'
```

Validation:

- `documents` must be non-empty.
- `top_k` is optional; when set, it must be zero or greater.
- Results are sorted descending by normalized relevance score.
- `index` is the original zero-based document position.

---

## 3. Lifecycle

Install once:

```bash
cd .opencode/skills/system-rerank-sidecar
bash scripts/install.sh
```

Start:

```bash
bash scripts/start.sh
```

First request:

1. `GET /health` confirms the HTTP process is up and usually reports `model_loaded=false`.
2. `POST /warmup` loads the pinned Qwen model from the HuggingFace cache.
3. `POST /rerank` scores request pairs through the already-loaded model.

Shutdown:

- Send SIGTERM or SIGINT to the uvicorn process.
- Uvicorn stops accepting new requests, lets in-flight work finish, runs the FastAPI lifespan shutdown hook, and releases the model reference.

---

## 4. Environment Variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `RERANK_SIDECAR_PORT` | `8765` | Localhost port used by `scripts/start.sh`. |
| `RERANK_MODEL_NAME` | `Qwen/Qwen3-Reranker-0.6B` | HuggingFace model id passed to `CrossEncoder`. |
| `RERANK_MODEL_REVISION` | `e61197ed45024b0ed8a2d74b80b4d909f1255473` | Pinned model commit sha. |
| `RERANK_LOG_PATH` | unset | Optional JSONL request log path. |
| `RERANK_DEVICE` | unset | Optional device override: `cpu`, `mps`, or `cuda`. |

`scripts/start.sh` loads `.env` first and `.env.local` second, so operators can keep local overrides out of version control.

---

## 5. RAM Budget + macOS Notes

Expect roughly 1.5 GB of warm memory pressure for the Qwen reranker plus PyTorch and sentence-transformers. On 16 GB Macs, running this sidecar beside spec-memory, CocoIndex, code graph tooling, and browser automation may push the system into swap.

Practical defaults:

- Use the default device selection on Apple Silicon unless MPS behaves poorly.
- Set `RERANK_DEVICE=cpu` when MPS memory pressure is worse than CPU latency.
- Keep `--workers 1`; multiple uvicorn workers would load multiple model copies.
- Run `/warmup` after start if the next query is latency-sensitive.

---

## 6. Troubleshooting

`ModuleNotFoundError` on start means the venv is missing or stale. Run:

```bash
bash scripts/install.sh
```

Port collision means another process owns the selected port. Run with an override:

```bash
RERANK_SIDECAR_PORT=8766 bash scripts/start.sh
```

Model load tries to download when offline. Confirm the pinned cache exists:

```bash
find ~/.cache/huggingface/hub/models--Qwen--Qwen3-Reranker-0.6B/snapshots -mindepth 1 -maxdepth 1 -type d
```

Slow first request is expected when the model is cold. Use `/warmup` and check that the revision in `.env.example` matches the local snapshot directory.

Bad scores downstream usually means a caller is clamping or re-normalizing already sigmoid-normalized values. The HTTP contract returns `[0,1]`; callers should preserve the score ordering.
