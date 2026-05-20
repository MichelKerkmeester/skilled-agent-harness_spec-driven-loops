---
title: "Implementation Summary: system-rerank-sidecar skill [template:level_1/implementation-summary.md]"
description: "Implementation evidence for the dedicated Qwen reranker HTTP sidecar skill."
trigger_phrases:
  - "002 implementation summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/002-system-rerank-sidecar-skill"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Phase 002 implementation and verification completed"
    next_safe_action: "Phase 003 can wire launchers to ensure/start the sidecar"
    blockers: []
    completion_state: "complete"
---
# Implementation Summary: system-rerank-sidecar skill

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: COMPLETE.** The sidecar skill is authored, installed, tested, smoke-verified on port 8765, and strict-validated.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Complete |
| **Created** | 2026-05-20 |
| **Branch** | `main` |
| **Parent Arc** | `008-rerank-sidecar-arc` |
| **Position in arc** | Phase 002 of 5 — the load-bearing sidecar |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- Created `.opencode/skills/system-rerank-sidecar/` with FastAPI sidecar (`scripts/rerank_sidecar.py`), install/start shell wrappers, pinned `pyproject.toml`, `.env.example`, `SKILL.md`, `README.md`, pytest suite, and `graph-metadata.json`.
- Implemented `GET /health`, `POST /warmup`, and `POST /rerank`.
- `/rerank` accepts `{query, documents, top_k}` and returns sigmoid-normalized `relevance_score` values in `[0,1]`.
- Mirrored CocoIndex's `CrossEncoderRerankerAdapter` core path: lazy `CrossEncoder`, `(query, doc)` pairs, `model.predict(pairs)`, float scores, score-sorted results.
- Serialized model loading and `predict()` calls behind one `asyncio.Lock`.
- Pinned the model revision to the existing HuggingFace cache snapshot `e61197ed45024b0ed8a2d74b80b4d909f1255473`.
- Added `local_files_only=True` to the `CrossEncoder` load so a missing cache fails instead of downloading model artifacts.
- Shutdown is handled by uvicorn SIGTERM/SIGINT plus the FastAPI lifespan hook, which releases the process-local `_model` reference.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

- Phase A created `scripts/` and `tests/`, then authored `pyproject.toml` and `.env.example`.
- Phase B authored `scripts/rerank_sidecar.py`, `scripts/install.sh`, `scripts/start.sh`, `SKILL.md`, `README.md`, `graph-metadata.json`, and `tests/test_rerank_sidecar.py`.
- The cached Qwen snapshot was verified before any model load work: `~/.cache/huggingface/hub/models--Qwen--Qwen3-Reranker-0.6B/snapshots/e61197ed45024b0ed8a2d74b80b4d909f1255473`.
- `scripts/install.sh` intentionally mirrors CocoIndex's install shape while staying standalone: find Python 3.11+, create `.venv`, activate, upgrade packaging tools, install editable package, import-check sentence-transformers/FastAPI/uvicorn.
- `scripts/start.sh` loads `.env` then `.env.local`, activates `.venv`, and `exec`s uvicorn with one worker on `127.0.0.1`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001: FastAPI over Flask or stdlib http.server
**Decision:** Use FastAPI + uvicorn.
**Rationale:** FastAPI's async-native model + pydantic request/response validation is a clean fit for `asyncio.Lock` serialization and the typed request schema. Stdlib `http.server` is sync and would require explicit threading for concurrent connection handling. Flask is sync by default; using `async def` routes in Flask requires extra config. FastAPI is the default contemporary choice and is what cocoindex already uses for its own internal HTTP needs.

### D-002: Pin model by HuggingFace revision sha, not just tag
**Decision:** `CrossEncoder(model_name, trust_remote_code=True, revision=PIN_SHA)`.
**Rationale:** `trust_remote_code=True` is a real security surface — pinning by commit sha means we're explicitly trusting a specific code state, not whatever upstream pushes next. Tag-based pinning (e.g. `revision="main"`) would silently inherit new commits. Sha-pinning matches the project's broader posture (dependency lockfiles, package-lock.json).

### D-003: Sigmoid at sidecar boundary, not at consumer
**Decision:** Apply sigmoid in `rerank_sidecar.py::rerank` before returning the response.
**Rationale:** Per gpt-5.5 xhigh critique, spec-memory's `cross-encoder.ts` clamps to `[0,1]` downstream. Raw Qwen logits like `7.625` and `-11.375` would collapse to `{1.0, 0.0}`, destroying ranking signal. Normalizing at the sidecar boundary is the correct contract: callers see meaningful continuous scores; the sidecar owns the normalization detail. If a future consumer wants raw logits, we can add `?raw=true` later.

### D-004: One model per sidecar process, not multi-model dispatch
**Decision:** The sidecar loads exactly one model at startup time; switching models requires restarting.
**Rationale:** A multi-model dispatcher (Qwen + jina + BGE all loaded simultaneously) would consume 3× RAM and introduce model-selection logic at request time. For A/B benchmarking (phase 004), we run two separate sidecar processes on different ports. For production, the operator picks one. Simpler contract, lower RAM ceiling.

### D-005: `asyncio.Lock` over `threading.Lock` or uvicorn `--workers 1`
**Decision:** Serialize with `asyncio.Lock` inside the request handler.
**Rationale:** Per gpt-5.5 xhigh critique: uvicorn `--workers 1` alone is insufficient — async handlers can still overlap around shared model state. `threading.Lock` would block the event loop. `asyncio.Lock` is the idiomatic fit for FastAPI handlers and yields to the event loop while waiting.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Install

Command:

```bash
cd .opencode/skills/system-rerank-sidecar
bash scripts/install.sh
```

Evidence:

```text
Successfully installed ... fastapi-0.136.1 ... httpx-0.28.1 ... pytest-9.0.3 ... sentence-transformers-5.4.1 ... torch-2.12.0 ... uvicorn-0.47.0 ...
sentence-transformers OK
fastapi + uvicorn OK
system-rerank-sidecar install complete
```

Exit code: `0`.

### Pytest

Command:

```bash
cd .opencode/skills/system-rerank-sidecar
.venv/bin/pytest tests/
```

Evidence:

```text
collected 4 items
tests/test_rerank_sidecar.py ....                                        [100%]
============================== 4 passed in 31.67s ==============================
```

Exit code: `0`.

### Manual Smoke

Command shape:

```bash
cd .opencode/skills/system-rerank-sidecar
RERANK_LOG_PATH=/tmp/system-rerank-sidecar-smoke-local-only.jsonl bash scripts/start.sh
curl -sf http://localhost:8765/health
curl -sf -X POST http://localhost:8765/warmup
curl -sf -X POST -H "Content-Type: application/json" \
  -d '{"query":"apple", "documents":["apple", "quantum chromodynamics"]}' \
  http://localhost:8765/rerank
```

Evidence:

```json
{"status":"ok","model_loaded":false,"model_name":"Qwen/Qwen3-Reranker-0.6B","queue_depth":0,"uptime_s":0.44}
{"status":"warmed","model":"Qwen/Qwen3-Reranker-0.6B","revision":"e61197ed45024b0ed8a2d74b80b4d909f1255473"}
{"results":[{"index":0,"relevance_score":0.9840936082881853},{"index":1,"relevance_score":0.0003799845147518645}],"model":"Qwen/Qwen3-Reranker-0.6B","latency_ms":1039}
```

Additional smoke assertions:

```text
apple score > QCD score verified
jsonl log rows: 1
no HuggingFace HTTP metadata calls observed
sidecar exit code: 0
```

### Syntax

Command:

```bash
cd .opencode/skills/system-rerank-sidecar
.venv/bin/python -m py_compile scripts/rerank_sidecar.py tests/test_rerank_sidecar.py
```

Exit code: `0`.

### Strict Validate

Command:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/002-system-rerank-sidecar-skill \
  --strict
```

Evidence:

```text
Summary: Errors: 0  Warnings: 0
RESULT: PASSED
```

Exit code: `0`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Single model loaded.** Switching models requires sidecar restart. A/B benchmarking (phase 004) runs two processes side-by-side.
2. **No streaming.** `/rerank` is a single request/response. Long document lists block until full scoring completes; client sees nothing until then. Acceptable for top-K reranking where K is bounded (≤100 typical).
3. **Python is the only language.** No Node-native fallback. If Python venv installation fails, the sidecar can't run and the consumers fall back to positional scores (graceful degradation, not failure).
4. **First-use cold latency 5-10s.** `/warmup` mitigates by explicit pre-load. Without warmup, first `/rerank` after fresh start pays the load tax.
5. **Memory cost.** Qwen3-Reranker-0.6B + torch + sentence-transformers = ~1.5 GB warm. Documented in SKILL.md.
6. **Sentence-transformers version drift risk.** Pinning the library version + the model revision both. If sentence-transformers ships a breaking change to `CrossEncoder.predict`, we're insulated until we upgrade.
<!-- /ANCHOR:limitations -->

## Commit Handoff

Files to stage:

```text
.opencode/skills/system-rerank-sidecar/SKILL.md
.opencode/skills/system-rerank-sidecar/README.md
.opencode/skills/system-rerank-sidecar/pyproject.toml
.opencode/skills/system-rerank-sidecar/.env.example
.opencode/skills/system-rerank-sidecar/graph-metadata.json
.opencode/skills/system-rerank-sidecar/scripts/install.sh
.opencode/skills/system-rerank-sidecar/scripts/start.sh
.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py
.opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/002-system-rerank-sidecar-skill/spec.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/002-system-rerank-sidecar-skill/plan.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/002-system-rerank-sidecar-skill/tasks.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/002-system-rerank-sidecar-skill/implementation-summary.md
```

Suggested subject:

```text
feat(016/008/002): system-rerank-sidecar skill + Qwen3-Reranker-0.6B HTTP service
```

Phase 003 is unblocked: launcher integration can now probe, start, and warm the shared sidecar instead of assuming an HTTP service already exists.
