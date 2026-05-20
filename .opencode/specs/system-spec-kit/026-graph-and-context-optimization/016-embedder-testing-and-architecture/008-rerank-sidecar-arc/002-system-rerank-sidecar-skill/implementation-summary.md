---
title: "Implementation Summary: system-rerank-sidecar skill [template:level_1/implementation-summary.md]"
description: "PRE-IMPLEMENTATION stub for the dedicated Qwen reranker HTTP sidecar skill. Sections marked (to fill) populate after implementation lands."
trigger_phrases:
  - "002 implementation summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/002-system-rerank-sidecar-skill"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Stub authored ahead of implementation"
    next_safe_action: "Implement skill then fill evidence"
    blockers: []
    completion_state: "pre-implementation"
---
# Implementation Summary: system-rerank-sidecar skill

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: PRE-IMPLEMENTATION.** Planned shape captured here so resume can pick this up cleanly.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Planned (pre-implementation) |
| **Created** | 2026-05-20 |
| **Branch** | `main` |
| **Parent Arc** | `008-rerank-sidecar-arc` |
| **Position in arc** | Phase 002 of 5 — the load-bearing sidecar |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

(to fill after implementation)

Planned shape:

- New skill at `.opencode/skills/system-rerank-sidecar/` with FastAPI sidecar (`rerank_sidecar.py`), install/start shell wrappers, pinned pyproject.toml, .env.example, SKILL.md + README.md, pytest suite, graph-metadata.json.
- The sidecar exposes 3 HTTP endpoints: `/health`, `/warmup`, `/rerank`.
- `/rerank` accepts `{query, documents, top_k}` and returns sigmoid-normalized `relevance_score` in `[0,1]`.
- All `model.predict()` calls serialized behind `asyncio.Lock` to dodge sentence-transformers thread-safety hazards.
- Model pinned by HuggingFace revision sha — not just tag — to avoid drift if upstream re-releases.
- SIGTERM handler releases the model and drains in-flight requests within 5s.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

(to fill after implementation)

Planned shape:

- Phase A: directory scaffold + pyproject.toml + .env.example
- Phase B: `rerank_sidecar.py` + SKILL.md + README.md
- Phase C: install.sh + start.sh + pytest suite + manual smoke

The skill is structurally tiny (~100 LOC Python + ~150 LOC docs + ~80 LOC tests) but architecturally load-bearing: it's the actual answerer for the empty HTTP slot in `cross-encoder.ts`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001 (planned): FastAPI over Flask or stdlib http.server
**Decision:** Use FastAPI + uvicorn.
**Rationale:** FastAPI's async-native model + pydantic request/response validation is a clean fit for `asyncio.Lock` serialization and the typed request schema. Stdlib `http.server` is sync and would require explicit threading for concurrent connection handling. Flask is sync by default; using `async def` routes in Flask requires extra config. FastAPI is the default contemporary choice and is what cocoindex already uses for its own internal HTTP needs.

### D-002 (planned): Pin model by HuggingFace revision sha, not just tag
**Decision:** `CrossEncoder(model_name, trust_remote_code=True, revision=PIN_SHA)`.
**Rationale:** `trust_remote_code=True` is a real security surface — pinning by commit sha means we're explicitly trusting a specific code state, not whatever upstream pushes next. Tag-based pinning (e.g. `revision="main"`) would silently inherit new commits. Sha-pinning matches the project's broader posture (dependency lockfiles, package-lock.json).

### D-003 (planned): Sigmoid at sidecar boundary, not at consumer
**Decision:** Apply sigmoid in `rerank_sidecar.py::rerank` before returning the response.
**Rationale:** Per gpt-5.5 xhigh critique, spec-memory's `cross-encoder.ts` clamps to `[0,1]` downstream. Raw Qwen logits like `7.625` and `-11.375` would collapse to `{1.0, 0.0}`, destroying ranking signal. Normalizing at the sidecar boundary is the correct contract: callers see meaningful continuous scores; the sidecar owns the normalization detail. If a future consumer wants raw logits, we can add `?raw=true` later.

### D-004 (planned): One model per sidecar process, not multi-model dispatch
**Decision:** The sidecar loads exactly one model at startup time; switching models requires restarting.
**Rationale:** A multi-model dispatcher (Qwen + jina + BGE all loaded simultaneously) would consume 3× RAM and introduce model-selection logic at request time. For A/B benchmarking (phase 004), we run two separate sidecar processes on different ports. For production, the operator picks one. Simpler contract, lower RAM ceiling.

### D-005 (planned): `asyncio.Lock` over `threading.Lock` or uvicorn `--workers 1`
**Decision:** Serialize with `asyncio.Lock` inside the request handler.
**Rationale:** Per gpt-5.5 xhigh critique: uvicorn `--workers 1` alone is insufficient — async handlers can still overlap around shared model state. `threading.Lock` would block the event loop. `asyncio.Lock` is the idiomatic fit for FastAPI handlers and yields to the event loop while waiting.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

(to fill after implementation with actual command outputs)

Planned verification:
```bash
cd .opencode/skills/system-rerank-sidecar
bash scripts/install.sh                              # → exit 0
bash scripts/start.sh &                              # → port 8765 bound within 3s
curl -s http://localhost:8765/health                 # → {status:"ok", model_loaded:false, ...}
curl -s -X POST http://localhost:8765/warmup         # → cold load <25s
curl -s -X POST http://localhost:8765/rerank \
  -d '{"query":"x","documents":["x","y"]}' \
  -H "Content-Type: application/json"                # → sigmoid scores in [0,1]
pytest tests/                                        # → all P0 tests pass
bash ../../../scripts/spec/validate.sh \
  .opencode/specs/.../008-rerank-sidecar-arc/002-system-rerank-sidecar-skill \
  --strict                                           # → exit 0
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

(to refine after implementation)

Planned limitations:

1. **Single model loaded.** Switching models requires sidecar restart. A/B benchmarking (phase 004) runs two processes side-by-side.
2. **No streaming.** `/rerank` is a single request/response. Long document lists block until full scoring completes; client sees nothing until then. Acceptable for top-K reranking where K is bounded (≤100 typical).
3. **Python is the only language.** No Node-native fallback. If Python venv installation fails, the sidecar can't run and the consumers fall back to positional scores (graceful degradation, not failure).
4. **First-use cold latency 5-10s.** `/warmup` mitigates by explicit pre-load. Without warmup, first `/rerank` after fresh start pays the load tax.
5. **Memory cost.** Qwen3-Reranker-0.6B + torch + sentence-transformers = ~1.5 GB warm. Documented in SKILL.md.
6. **Sentence-transformers version drift risk.** Pinning the library version + the model revision both. If sentence-transformers ships a breaking change to `CrossEncoder.predict`, we're insulated until we upgrade.
<!-- /ANCHOR:limitations -->
