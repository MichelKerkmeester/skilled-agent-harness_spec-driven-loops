---
title: "system-rerank-sidecar: Feature Catalog"
description: "Unified current-state inventory for the system-rerank-sidecar HTTP cross-encoder sidecar — endpoint contracts, model lifecycle, concurrency, score normalization, security posture, launcher integration, configuration, and observability."
trigger_phrases:
  - "system-rerank-sidecar feature catalog"
  - "rerank sidecar catalog"
  - "qwen sidecar feature inventory"
importance_tier: "important"
contextType: "reference"
---

# system-rerank-sidecar: Feature Catalog

This document is the canonical inventory of what `system-rerank-sidecar` actually does today. Each section names a feature, summarizes the current shipped behavior, lists the source files that own it, and points to the validation surface that protects it. The skill ships a single FastAPI HTTP service that wraps `Qwen/Qwen3-Reranker-0.6B`; both `mk-spec-memory` and `mcp-coco-index` consume it over the same `/rerank` contract.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. HTTP ENDPOINT CONTRACTS](#2--http-endpoint-contracts)
- [3. MODEL LIFECYCLE](#3--model-lifecycle)
- [4. CONCURRENCY AND LOCKING](#4--concurrency-and-locking)
- [5. SCORE NORMALIZATION](#5--score-normalization)
- [6. SECURITY POSTURE](#6--security-posture)
- [7. LAUNCHER INTEGRATION](#7--launcher-integration)
- [8. CONFIGURATION AND ENV VARS](#8--configuration-and-env-vars)
- [9. OBSERVABILITY](#9--observability)
- [10. CROSS-SKILL CONSUMERS](#10--cross-skill-consumers)
- [11. SOURCE METADATA](#11--source-metadata)

---

## 1. OVERVIEW

Use this catalog when you need to find out what `system-rerank-sidecar` ships today, what each feature is responsible for, and where the implementation and tests live. The skill is intentionally small — one FastAPI service, one model, one port — but it is consumed by two MCP servers, so the contracts here are the load-bearing boundary that lets either MCP stay independent of the other.

| Capability area | Default behavior | Owning file |
|---|---|---|
| HTTP server | uvicorn `--workers 1` on `127.0.0.1:8765` | `scripts/rerank_sidecar.py` |
| Model | `Qwen/Qwen3-Reranker-0.6B` (Apache-2.0), pinned revision | `scripts/rerank_sidecar.py` |
| Concurrency primitive | `asyncio.Lock` around `model.predict()` | `scripts/rerank_sidecar.py` |
| Spawn helper (Node) | `bin/lib/ensure-rerank-sidecar.cjs` in `mk-spec-memory` | external |
| Spawn helper (Python) | `scripts/ensure_rerank_sidecar.py` | this skill |

The sidecar is opt-in for spec-memory (`SPECKIT_CROSS_ENCODER=true`) and the default dispatch path for cocoindex (`COCOINDEX_RERANK_VIA_SIDECAR=true` as of arc 008 phase 006).

---

## 2. HTTP ENDPOINT CONTRACTS

### `GET /health`

#### Description

Liveness + warmth probe. Returns the model name, whether the weights are loaded, the queue depth at the asyncio lock, and process uptime.

#### Current Reality

- Returns HTTP 200 with `{"status":"ok","model_loaded":<bool>,"model_name":<str>,"queue_depth":<int>,"uptime_s":<float>}`.
- `model_loaded` flips to `true` after the first successful `/warmup` or `/rerank` call.
- Used by both `ensure_rerank_sidecar.py` and the Node `ensure-rerank-sidecar.cjs` to decide spawn vs attach.

#### Source Files

- `scripts/rerank_sidecar.py` (`/health` handler)
- `tests/test_rerank_sidecar.py` (health-shape assertions)

### `POST /warmup`

#### Description

Idempotent model preload. Triggers `CrossEncoder(...)` instantiation and a no-op `predict()` so that the first user-facing `/rerank` call does not pay the cold-load tax.

#### Current Reality

- Returns HTTP 200 with `{"status":"warmed","model":<str>,"revision":<str>}`.
- Safe to call multiple times — subsequent calls are no-ops.
- Cold cost: ~5–10 s on Mac CPU, ~3–5 s on MPS.

#### Source Files

- `scripts/rerank_sidecar.py` (`/warmup` handler)
- `tests/test_rerank_sidecar.py` (warmup transition assertions)

### `POST /rerank`

#### Description

Score one query against N candidate documents. Loads the model lazily on first call. Returns sigmoid-normalized relevance scores `[0,1]` sorted descending by score, with each entry carrying the document's original index.

#### Current Reality

- Request body: `{"query":<str>,"documents":[<str>...],"top_k":<int>}`.
- Response: `{"results":[{"index":<int>,"relevance_score":<float>}...],"model":<str>,"latency_ms":<int>}`.
- Scores are sigmoid-normalized at the response boundary (raw cross-encoder logits are NOT returned).
- `top_k` is clamped to `len(documents)`.
- Serialized through `asyncio.Lock` (see §4) — concurrent callers queue.

#### Source Files

- `scripts/rerank_sidecar.py` (`/rerank` handler, lines around 108–153)
- `tests/test_rerank_sidecar.py` (rerank ordering + sigmoid bounds)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py` (`HttpSidecarRerankerAdapter`, consumer)
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` (TypeScript consumer for the `local` provider)

---

## 3. MODEL LIFECYCLE

### Description

Lazy model load + warm transition + clean shutdown.

### Current Reality

- The Qwen model is loaded on first `/warmup` or `/rerank` request via FastAPI's lifespan event.
- Load uses `local_files_only=True` — cache miss fails loudly rather than silently downloading.
- Pinned revision `e61197ed45024b0ed8a2d74b80b4d909f1255473` is the load-bearing model commit; changing the pin requires re-running the arc 008 phase 002 evidence path.
- SIGTERM triggers `lifespan.shutdown` — model weights released, port returned.

### Source Files

- `scripts/rerank_sidecar.py` (`lifespan` block, `load_model_blocking`)
- `.env.example` (`RERANK_MODEL_NAME`, `RERANK_MODEL_REVISION`)

---

## 4. CONCURRENCY AND LOCKING

### Description

The sidecar serializes `predict()` calls so a single Qwen forward pass never overlaps with another, even under concurrent HTTP load.

### Current Reality

- Single uvicorn worker (`--workers 1`).
- A module-level `asyncio.Lock` wraps the `model.predict()` call inside `/rerank`.
- Concurrent callers queue at the lock — observed via `/health.queue_depth`.
- This is the **load-bearing** reason the sidecar cannot be replaced with a thread pool: `sentence_transformers.CrossEncoder` is not thread-safe under concurrent `predict()`.

### Source Files

- `scripts/rerank_sidecar.py` (lock declaration + wrap)
- `scripts/start.sh` (`--workers 1` flag)
- `tests/test_rerank_sidecar.py` (serialization smoke)

---

## 5. SCORE NORMALIZATION

### Description

Raw cross-encoder logits are converted to sigmoid-normalized scores in `[0,1]` at the response boundary, NOT inside the model.

### Current Reality

- The sigmoid happens at `scripts/rerank_sidecar.py:124`.
- Spec-memory's `cross-encoder.ts` clamps to `[0,1]`; if the sidecar returned raw logits like `7.625` and `-11.375` the clamp would collapse the ordering. Sigmoid preserves it.
- Cocoindex's `HttpSidecarRerankerAdapter` consumes sigmoid scores as-is. Path-class boost (gated `false` by default for non-BGE adapters) operates on the sigmoid scale; operators turning the boost on must supply explicit factors via `COCOINDEX_RERANK_PATH_CLASS_FACTORS`.

### Source Files

- `scripts/rerank_sidecar.py` (sigmoid call)
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` (consumer clamp)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py` (consumer + path-class boost interaction)

---

## 6. SECURITY POSTURE

### Description

The sidecar binds only to localhost and trusts only its own code path.

### Current Reality

- HTTP server binds `127.0.0.1` (loopback only). External network listeners are NOT enabled.
- Model load passes `trust_remote_code=True` — required by `Qwen/Qwen3-Reranker-0.6B` to import its custom config classes. Pinned revision (see §3) is the mitigation; without the pin, an upstream model swap could inject arbitrary code.
- Parent-process env vars are inherited by the uvicorn child wholesale via `os.execvp` in `scripts/start.sh`. A future packet should narrow the env passthrough to a `RERANK_*` allowlist (open advisory from arc 008 phase 005 review).

### Source Files

- `scripts/rerank_sidecar.py` (`host="127.0.0.1"`, `trust_remote_code=True`)
- `scripts/start.sh` (env passthrough)
- `.env.example` (revision pin)

---

## 7. LAUNCHER INTEGRATION

### Description

Both MCP servers idempotently ensure a sidecar is running before issuing `/rerank` calls, using port-bind atomicity as the primary primitive.

### Current Reality

- `bin/lib/ensure-rerank-sidecar.cjs` (lives inside `mk-spec-memory`) — Node-side helper. Probes `/health`; spawns detached if absent; attaches as HTTP client if present.
- `scripts/ensure_rerank_sidecar.py` (this skill) — Python sibling. Same probe-spawn-attach contract, called from cocoindex's `cli.py::_ensure_rerank_sidecar_for_mcp`.
- Port-bind atomicity (`EADDRINUSE`) is the self-electing-primary primitive — same shape as the file-lease pattern from arc 006, just at the port level.
- Either MCP can run standalone (sidecar absent → falls back to positional or bundled scoring); both MCPs running together share the single sidecar process.

### Source Files

- `scripts/ensure_rerank_sidecar.py`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py` (`_ensure_rerank_sidecar_for_mcp`)
- `bin/lib/ensure-rerank-sidecar.cjs` (lives in `mk-spec-memory`)
- `bin/lib/ensure-rerank-sidecar.vitest.ts` (lives in `mk-spec-memory`)

---

## 8. CONFIGURATION AND ENV VARS

### Description

The sidecar has five env vars. Three are operator-tunable; two are emergency overrides for cache placement and device selection.

### Current Reality

| Variable | Default | Purpose | Consumer |
|---|---|---|---|
| `RERANK_SIDECAR_PORT` | `8765` | Localhost port the sidecar binds | sidecar + both ensure helpers |
| `RERANK_MODEL_NAME` | `Qwen/Qwen3-Reranker-0.6B` | HuggingFace model id | sidecar |
| `RERANK_MODEL_REVISION` | `e61197ed...` | Pinned model commit sha | sidecar (security mitigation) |
| `RERANK_LOG_PATH` | unset | Optional JSONL request log path | sidecar |
| `RERANK_DEVICE` | unset | `cpu`, `mps`, or `cuda` device override | sidecar |

Consumer-side toggles (separate concerns from sidecar env, listed here for cross-skill discoverability):

| Variable | Default | Purpose | Consumer |
|---|---|---|---|
| `SPECKIT_CROSS_ENCODER` | `false` | Enable spec-memory's HTTP `local` provider routing to the sidecar | `mk-spec-memory` |
| `COCOINDEX_RERANK_VIA_SIDECAR` | **`true`** | Route cocoindex Stage 2 rerank through the sidecar (default since arc 008 phase 006) | `mcp-coco-index` |

### Source Files

- `.env.example` (sidecar tunables)
- `scripts/start.sh` (env loader order: `.env` then `.env.local`)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config/config.py` (`COCOINDEX_RERANK_VIA_SIDECAR`)
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` (`SPECKIT_CROSS_ENCODER` routing)

---

## 9. OBSERVABILITY

### Description

The sidecar surfaces three observability channels: `/health` polling, optional per-request JSONL log, and the per-call `latency_ms` field.

### Current Reality

- **`/health.queue_depth`**: number of `/rerank` requests waiting at the asyncio lock. Steady-state should be 0 or 1.
- **`/health.uptime_s`**: process uptime in seconds since uvicorn started. Restart detection.
- **JSONL request log**: when `RERANK_LOG_PATH` is set, every `/rerank` call writes one JSON line with `{ts, query, n_documents, top_k, latency_ms, model}`. Off by default.
- **`/rerank.latency_ms`**: per-call inclusive latency reported in the response body.
- **Consumer-side diagnostics**: `RetrievalDiagnostics.reranker_fallback_reason` in cocoindex distinguishes `sidecar_unavailable`, `sidecar_5xx`, `sidecar_<status>`, `sidecar_malformed` after the HTTP path failed and the bundled fallback fired.

### Source Files

- `scripts/rerank_sidecar.py` (`/health`, JSONL log emit)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability/observability.py` (`record_reranker_fallback`)

---

## 10. CROSS-SKILL CONSUMERS

### Description

Two MCP servers consume the sidecar today. The contract surface is intentionally narrow (one HTTP endpoint) so additions stay cheap.

### Current Reality

| Consumer | Provider routing | Default? | Path |
|---|---|---|---|
| `mk-spec-memory` | `cross-encoder.ts:local` (HTTP client) | Opt-in via `SPECKIT_CROSS_ENCODER=true` (arc 008 phase 005 HOLD) | `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` |
| `mcp-coco-index` | `HttpSidecarRerankerAdapter` | **Default ON** via `COCOINDEX_RERANK_VIA_SIDECAR=true` (arc 008 phase 006 PROMOTE) | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py` |

Both consumers preserve graceful degradation: spec-memory falls back to positional scoring; cocoindex falls back to the bundled `CrossEncoderRerankerAdapter`. Neither consumer hard-fails when the sidecar is unreachable.

### Source Files

- `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` (spec-memory consumer)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py` (cocoindex consumer + fallback)
- `.opencode/skills/mcp-coco-index/mcp_server/tests/test_http_sidecar_adapter.py` (consumer test coverage)

---

## 11. SOURCE METADATA

- Canonical SKILL: `.opencode/skills/system-rerank-sidecar/SKILL.md`
- Canonical README: `.opencode/skills/system-rerank-sidecar/README.md`
- Originating arc: `008-rerank-sidecar-arc` under `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/`
- License: Apache-2.0 (model + skill code)
- Pinned model revision: `e61197ed45024b0ed8a2d74b80b4d909f1255473`
