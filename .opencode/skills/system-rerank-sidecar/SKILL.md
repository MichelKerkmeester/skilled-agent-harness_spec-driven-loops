---
name: system-rerank-sidecar
description: "Local FastAPI sidecar serving Qwen/Qwen3-Reranker-0.6B cross-encoder reranking over HTTP for spec-memory and CocoIndex."
allowed-tools: [Bash, Read]
version: 0.1.0
---

<!-- Keywords: rerank, cross-encoder, qwen, qwen3-reranker, sidecar, fastapi, sigmoid, localhost:8765, ensure-rerank-sidecar, spec-memory-rerank, cocoindex-rerank -->

# Rerank Sidecar — Shared Local Cross-Encoder HTTP Service

Dedicated local HTTP sidecar that owns model loading, request serialization, sigmoid normalization, and the operator lifecycle for `Qwen/Qwen3-Reranker-0.6B`. Consumed by mk-spec-memory (opt-in per arc 008 phase 005 HOLD) and available to any MCP that wants shared cross-encoder rerank without bundling its own model.

---

## 1. WHEN TO USE

### Activation Triggers

- **MCP launcher ensure**: when `mk-spec-memory-launcher.cjs` or CocoIndex's `cli.py::mcp` cold-starts with `SPECKIT_CROSS_ENCODER=true`, the auto-ensure helpers (`bin/lib/ensure-rerank-sidecar.cjs` + `scripts/ensure_rerank_sidecar.py`) probe this sidecar and spawn it detached if absent.
- **Operator setup**: when a user installs or starts the sidecar for the first time, or debugs an HTTP probe failure on `localhost:8765/health`.
- **Cross-encoder rerank request**: when an MCP search pipeline needs sigmoid-normalized rerank scores in `[0,1]` for a query + candidate documents.
- **Lifecycle debugging**: when the model warmup is slow, the SIGTERM shutdown hangs, or the request queue is backing up under load.

### When NOT to Use

- **Don't author calls directly from agents** — the sidecar is HTTP infrastructure consumed by other MCPs' launcher helpers, not a tool the AI agent invokes per-query.
- **Don't enable as default on memory-constrained hosts** — arc 008 phase 004 measured p95 ~11s under sustained load on CPU. Promotion requires CPU→MPS device tuning first. Per phase 005 HOLD verdict, the sidecar stays opt-in via `SPECKIT_CROSS_ENCODER=true`.
- **Don't run inside the same process as another reranker** — multiple workers load multiple model copies. Keep `--workers 1` (enforced by `scripts/start.sh`).

---

## 2. SMART ROUTING

### Detection Signals

| Signal | Action |
|--------|--------|
| User says "rerank", "cross-encoder", "Qwen reranker", or names `localhost:8765` | Route here |
| `SPECKIT_CROSS_ENCODER=true` referenced in launcher or env config | Route here for setup/debug |
| `/health`, `/warmup`, `/rerank` HTTP probe failures | Route here for triage |
| Phase 005 HOLD verdict, p95 latency tuning, CPU→MPS device decisions | Route here |
| MCP launcher (`mk-spec-memory-launcher.cjs`, cocoindex `cli.py::mcp`) startup with rerank ensure | Route here |

### Routing Pseudocode

```python
def route_rerank_sidecar(task_description: str, env_context: dict) -> str:
    triggers = [
        "rerank sidecar",
        "qwen3-reranker",
        "cross-encoder",
        "localhost:8765",
        "/rerank endpoint",
        "ensure-rerank-sidecar",
        "speckit_cross_encoder",
    ]
    if any(t in task_description.lower() for t in triggers):
        return "system-rerank-sidecar"

    # Implicit triggers via env or launcher startup
    if env_context.get("SPECKIT_CROSS_ENCODER") == "true":
        return "system-rerank-sidecar"
    if "rerank_sidecar.py" in task_description or "ensure_rerank_sidecar" in task_description:
        return "system-rerank-sidecar"

    return "unknown"
```

### Resource Loading Levels

| Level | When to Load | Resources |
|-------|--------------|-----------|
| ALWAYS | This skill activates | This SKILL.md (HTTP contract + lifecycle + rules) |
| CONDITIONAL | Install/start ops | `scripts/install.sh`, `scripts/start.sh` |
| ON_DEMAND | Debugging or extension | `scripts/rerank_sidecar.py` (Python source), `scripts/ensure_rerank_sidecar.py` (sibling helper), `tests/test_rerank_sidecar.py` (pytest suite) |

---

## 3. HOW IT WORKS

### Architecture

The sidecar mirrors CocoIndex's `CrossEncoderRerankerAdapter` core: build `(query, document)` pairs, call `model.predict(pairs)`, cast to floats, sort by score. The sidecar adds FastAPI request validation, process-local `asyncio.Lock` serialization (avoids the sentence-transformers thread-safety hazard), pinned local-cache loading (`local_files_only=True` + `revision=<sha>`), and sigmoid normalization at the response boundary.

### HTTP Endpoints

#### `GET /health`

Cheap readiness probe. Does NOT load the model.

```json
{"status": "ok", "model_loaded": false, "model_name": "Qwen/Qwen3-Reranker-0.6B", "queue_depth": 0, "uptime_s": 1.25}
```

```bash
curl -sf http://127.0.0.1:8765/health
```

#### `POST /warmup`

Loads the model if needed. Launcher pre-loads with this to avoid cold-start tax on the first user-facing rerank.

```json
{"status": "warmed", "model": "Qwen/Qwen3-Reranker-0.6B", "revision": "e61197ed45024b0ed8a2d74b80b4d909f1255473"}
```

```bash
curl -sf -X POST http://127.0.0.1:8765/warmup
```

#### `POST /rerank`

```json
{"query": "apple", "documents": ["apple", "quantum chromodynamics"], "top_k": 2}
```

Returns sigmoid-normalized results sorted descending by `relevance_score`:

```json
{
  "results": [{"index": 0, "relevance_score": 0.99}, {"index": 1, "relevance_score": 0.01}],
  "model": "Qwen/Qwen3-Reranker-0.6B",
  "latency_ms": 42
}
```

```bash
curl -sf -X POST http://127.0.0.1:8765/rerank \
  -H "Content-Type: application/json" \
  -d '{"query":"apple","documents":["apple","quantum chromodynamics"]}'
```

Validation: `documents` must be non-empty; `top_k` is optional and zero-or-greater when set; `index` is the original zero-based document position.

### Lifecycle

```bash
# Install once
cd .opencode/skills/system-rerank-sidecar && bash scripts/install.sh

# Start
bash scripts/start.sh

# First request sequence:
#   1. /health → 200 (model_loaded usually false)
#   2. /warmup → loads pinned Qwen from HuggingFace cache
#   3. /rerank → scores through loaded model

# Shutdown
#   SIGTERM/SIGINT → uvicorn stops new requests, drains in-flight,
#   runs FastAPI lifespan shutdown hook, releases model reference
```

### Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `RERANK_SIDECAR_PORT` | `8765` | Localhost port used by `scripts/start.sh` |
| `RERANK_MODEL_NAME` | `Qwen/Qwen3-Reranker-0.6B` | HuggingFace model id passed to `CrossEncoder` |
| `RERANK_MODEL_REVISION` | `e61197ed45024b0ed8a2d74b80b4d909f1255473` | Pinned model commit sha |
| `RERANK_LOG_PATH` | unset | Optional JSONL request log path |
| `RERANK_DEVICE` | unset | Optional device override: `cpu`, `mps`, or `cuda` |

`scripts/start.sh` loads `.env` first and `.env.local` second so operators can keep local overrides out of version control.

### Consumers

- **mk-spec-memory** consumes via `mcp_server/lib/search/cross-encoder.ts:local` when `SPECKIT_CROSS_ENCODER=true`. Per arc 008 phase 005 HOLD, this is opt-in (not default).
- **mcp-coco-index** consumes via `HttpSidecarRerankerAdapter` (`cocoindex_code/rerankers/reranker.py`). Default-on as of arc 008 phase 006 (`COCOINDEX_RERANK_VIA_SIDECAR=true`); bundled `CrossEncoderRerankerAdapter` is retained as the HTTP-failure fallback. The cocoindex MCP startup auto-ensures the sidecar via `cli.py::_ensure_rerank_sidecar_for_mcp`.

### RAM Budget + macOS Notes

Expect ~1.5 GB warm memory pressure for Qwen + PyTorch + sentence-transformers. On 16 GB Macs running concurrent spec-memory + CocoIndex + code-graph + browser tooling, the host may swap. Practical defaults:

- Default device selection on Apple Silicon unless MPS misbehaves
- `RERANK_DEVICE=cpu` when MPS memory pressure is worse than CPU latency
- Keep `--workers 1` (multiple workers load multiple model copies)
- Run `/warmup` post-start if the next query is latency-sensitive

### Troubleshooting

| Symptom | Likely Cause | Action |
|---------|--------------|--------|
| `ModuleNotFoundError` on start | venv missing/stale | `bash scripts/install.sh` |
| Port collision | another process owns 8765 | `RERANK_SIDECAR_PORT=8766 bash scripts/start.sh` |
| Model load tries network download | cache missing | `find ~/.cache/huggingface/hub/models--Qwen--Qwen3-Reranker-0.6B/snapshots -mindepth 1 -maxdepth 1 -type d` |
| Slow first request | cold model | `POST /warmup` first; confirm `.env.example` revision matches local snapshot |
| Bad downstream scores | caller is re-normalizing already-sigmoid `[0,1]` values | Preserve score ordering; do not re-clamp |

---

## 4. RULES

### ✅ ALWAYS

1. Bind HTTP to `127.0.0.1` only (never `0.0.0.0`). The sidecar is for local-MCP consumption, not LAN exposure.
2. Serialize `model.predict()` calls behind `asyncio.Lock` (sentence-transformers is not thread-safe).
3. Apply sigmoid at the `/rerank` boundary. Callers expect `[0,1]`, not raw cross-encoder logits.
4. Pin `revision=<sha>` AND set `local_files_only=True` when loading the model. `trust_remote_code=True` is acceptable only with a pinned revision.
5. Run `--workers 1` in uvicorn. Multiple workers load multiple model copies and break the single-`asyncio.Lock` invariant.
6. Lazy-load the model on first `/warmup` or `/rerank`. `/health` must return without loading the model.

### ❌ NEVER

1. Never expose the sidecar on a non-loopback interface.
2. Never spawn the sidecar with the full parent environment — use a sidecar-specific allowlist (per arc 008 review iter 002 P1 finding).
3. Never write to the sidecar from agents — read-only HTTP client via `cross-encoder.ts:local` is the only consumer surface.
4. Never assume `trust_remote_code=True` is safe without revision pinning + `local_files_only=True`.
5. Never disable `local_files_only` to let HuggingFace fetch updates silently. Cache misses must fail loudly so operators see them.

### ⚠️ ESCALATE IF

1. `/warmup` times out repeatedly → CPU saturation; consider `RERANK_DEVICE=mps` on Apple Silicon.
2. `/rerank` p95 > 5s under sustained load → revisit promotion gate (arc 008 phase 004 HOLD root cause).
3. Cache snapshot directory is empty → pre-cache via `huggingface-cli download Qwen/Qwen3-Reranker-0.6B --revision <sha>`.
4. Multiple sidecar processes detected → port-bind race lost; investigate which launcher misbehaved (per arc 008 phase 003 self-electing-primary semantics).

---

## 5. REFERENCES

### Bundled Resources

- `scripts/install.sh` — venv + pip install
- `scripts/start.sh` — env loader + uvicorn exec
- `scripts/rerank_sidecar.py` — FastAPI app (the actual service)
- `scripts/ensure_rerank_sidecar.py` — Python sibling of the `.cjs` ensure helper (used by CocoIndex)
- `tests/test_rerank_sidecar.py` — pytest suite (4 P0 cases)
- `pyproject.toml` — pinned deps (fastapi, uvicorn, sentence-transformers, torch)
- `.env.example` — operator-facing env-var reference
- `README.md` — operator quickstart

### Related Skills + Commands

- `cross-encoder.ts:54-62` (mk-spec-memory) — the HTTP client wrapper for `local` provider
- `bin/lib/ensure-rerank-sidecar.cjs` — Node-side ensure helper (mk-spec-memory)
- `bin/lib/launcher-ipc-bridge.cjs` — sibling helper at the same level (packet 010/012 lease pattern)
- `mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py` — CrossEncoderRerankerAdapter the sidecar mirrors

### Arc 008 Evidence Trail

- Phase 002 commit `b3db00d2f` — sidecar shipped
- Phase 003 commit `3ad09c6c3` — ensure-helper integration
- Phase 004 commit `c1258a54b` — A/B benchmark + HOLD verdict
- Phase 005 commit `06ff42cb9` — HOLD path executed (sidecar stays opt-in)
- Phase 004 benchmark report: `mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/benchmark_report.md` §8 RECOMMENDATIONS

### External

- HuggingFace model card: https://huggingface.co/Qwen/Qwen3-Reranker-0.6B
- sentence-transformers `CrossEncoder` docs: https://www.sbert.net/docs/cross_encoder/usage/usage.html
- FastAPI lifespan: https://fastapi.tiangolo.com/advanced/events/

---

## 6. SUCCESS CRITERIA

- `bash scripts/install.sh` exits 0 on a fresh `.venv`
- `bash scripts/start.sh` binds the port; `/health` returns 200 within 3s; model loads lazily on `/warmup`
- `/rerank` apple-vs-QCD adversarial pair returns `apple > QCD` with both scores in `[0,1]`
- `pytest tests/` passes 4 P0 cases (health-before-load, sigmoid-bounds, concurrent-serialization, SIGTERM-clean-shutdown)
- Single `rerank_sidecar` process under parallel cold start from spec-memory + CocoIndex
- `sk-doc validate_document.py --type skill` returns 0 issues on this SKILL.md
