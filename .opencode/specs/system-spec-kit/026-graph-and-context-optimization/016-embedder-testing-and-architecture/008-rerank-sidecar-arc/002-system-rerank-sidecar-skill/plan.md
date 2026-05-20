---
title: "Implementation Plan: system-rerank-sidecar skill [template:level_1/plan.md]"
description: "Three-phase plan: scaffold skill folder + author Python sidecar + tests + install script."
trigger_phrases:
  - "002 plan sidecar skill"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/002-system-rerank-sidecar-skill"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan authored"
    next_safe_action: "Begin Phase A scaffold"
    blockers: []
---
# Implementation Plan: system-rerank-sidecar skill

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Phase | What | Status |
|-------|------|--------|
| **A** | Scaffold the skill folder structure (`scripts/`, `tests/`, `pyproject.toml`, `.env.example`, SKILL.md stubs) | Complete |
| **B** | Author `rerank_sidecar.py` — FastAPI app, sentence-transformers wrapper, `asyncio.Lock`, sigmoid output, `/health` + `/warmup` + `/rerank` endpoints, SIGTERM handler | Complete |
| **C** | Author `install.sh` (venv + pip install) and `start.sh` (activate + exec uvicorn). Pin revision sha for Qwen3-Reranker-0.6B. Pytest cases for REQ-001..REQ-004 | Complete |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

1. Strict validate exits 0 on this packet.
2. `bash install.sh` succeeds on a fresh `.venv` (CI: clean checkout test).
3. `bash start.sh` binds port and `/health` returns 200 within 3s.
4. `pytest tests/` passes all 4 P0 cases.
5. Sigmoid normalization smoke: feed an adversarial pair `(query="apple", docs=["apple", "quantum chromodynamics"])`, assert both returned scores are in `[0,1]` and the apple score > 0.5 > QCD score.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Skill layout (mirrors `mcp-coco-index/` structurally where applicable)

```
.opencode/skills/system-rerank-sidecar/
├── SKILL.md                       — HTTP contract, lifecycle, troubleshooting
├── README.md                      — operator quickstart
├── pyproject.toml                 — fastapi, uvicorn, sentence-transformers, torch
├── .env.example                   — RERANK_SIDECAR_PORT, RERANK_MODEL_NAME, etc.
├── graph-metadata.json            — discovery metadata for the advisor
├── scripts/
│   ├── install.sh                 — venv create + pip install
│   ├── start.sh                   — activate venv + exec uvicorn
│   └── rerank_sidecar.py          — the actual FastAPI app
└── tests/
    └── test_rerank_sidecar.py     — pytest suite
```

### `rerank_sidecar.py` shape

```python
import asyncio
import os
import time
import signal
from contextlib import asynccontextmanager
from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import CrossEncoder
import math

MODEL_NAME = os.environ.get("RERANK_MODEL_NAME", "Qwen/Qwen3-Reranker-0.6B")
MODEL_REVISION = os.environ.get("RERANK_MODEL_REVISION", "<pinned-sha>")
PORT = int(os.environ.get("RERANK_SIDECAR_PORT", "8765"))

_model = None
_lock = asyncio.Lock()
_started_at = time.time()

def sigmoid(x: float) -> float:
    if x >= 0:
        return 1.0 / (1.0 + math.exp(-x))
    z = math.exp(x)
    return z / (1.0 + z)

class RerankRequest(BaseModel):
    query: str
    documents: list[str]
    top_k: int | None = None

class RerankResultItem(BaseModel):
    index: int
    relevance_score: float

class RerankResponse(BaseModel):
    results: list[RerankResultItem]
    model: str
    latency_ms: int

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    # cleanup on shutdown
    if _model is not None:
        del _model

app = FastAPI(lifespan=lifespan)

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "model_loaded": _model is not None,
        "queue_depth": (1 if _lock.locked() else 0),
        "uptime_s": round(time.time() - _started_at, 2),
    }

@app.post("/warmup")
async def warmup():
    global _model
    async with _lock:
        if _model is None:
            _model = CrossEncoder(MODEL_NAME, trust_remote_code=True, revision=MODEL_REVISION)
    return {"status": "warmed", "model": MODEL_NAME}

@app.post("/rerank", response_model=RerankResponse)
async def rerank(req: RerankRequest):
    global _model
    start = time.time()
    async with _lock:
        if _model is None:
            _model = CrossEncoder(MODEL_NAME, trust_remote_code=True, revision=MODEL_REVISION)
        pairs = [(req.query, d) for d in req.documents]
        raw_scores = [float(s) for s in _model.predict(pairs)]
    sigmoid_scores = [sigmoid(s) for s in raw_scores]
    indexed = sorted(enumerate(sigmoid_scores), key=lambda kv: -kv[1])
    if req.top_k is not None:
        indexed = indexed[: req.top_k]
    return RerankResponse(
        results=[RerankResultItem(index=i, relevance_score=s) for i, s in indexed],
        model=MODEL_NAME,
        latency_ms=int((time.time() - start) * 1000),
    )
```

(Rough sketch. Final shape may add structured logging, model_max_length cap at 8192, etc.)
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — Scaffold (no functional code yet)
- Create directory structure
- Write empty/stub versions of all files so `find` shows the skill exists
- pyproject.toml with exact pinned versions
- .env.example documenting all env vars

### Phase B — Sidecar code
- Author `rerank_sidecar.py` per the sketch above
- Add structured logging (`structlog` or stdlib JSONL) gated on `RERANK_LOG_PATH`
- Add SIGTERM handler that releases the model + flushes logs
- Author SKILL.md (HTTP contract section, lifecycle section, troubleshooting section)

### Phase C — Install + tests
- Author `install.sh`: create `.venv`, `pip install -e .`, verify `python -c "from sentence_transformers import CrossEncoder"` works
- Author `start.sh`: source `.venv/bin/activate`, exec `uvicorn rerank_sidecar:app --host 127.0.0.1 --port $PORT`
- Author pytest cases:
  - test_health_before_model_load
  - test_rerank_basic (sigmoid bounds, ordering)
  - test_concurrent_requests_serialized
  - test_sigterm_clean_shutdown
- Build/run `pytest tests/`
- Strict validate this packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | What | Expected |
|------|------|----------|
| install.sh | Fresh venv from scratch | Exits 0; `pip list` includes pinned versions |
| start.sh smoke | `start.sh &` then `curl /health` within 3s | 200 OK, `model_loaded=false` |
| /warmup latency | curl /warmup cold | Completes in <25s (cached model) |
| /rerank sigmoid bounds | Adversarial pair | All scores in `[0,1]`; apple > QCD |
| /rerank concurrent | 5 parallel curls | All complete in strict order; no overlap |
| /rerank top_k | top_k=2 of 5 docs | Returns 2 results, sorted desc by score |
| SIGTERM | Send signal mid-/rerank | In-flight finishes; new requests refused; exit 0 in ≤5s |
| Strict validate | `validate.sh --strict` | Exit 0 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- **Upstream**: phase 001 (flag-routing fix) — so the sidecar is reachable when wired. Strictly, this phase can be authored in parallel; the dependency only matters at integration time.
- **External**: Python ≥3.11, sentence-transformers ≥3.x, torch ≥2.x, fastapi, uvicorn. Pin versions identical to cocoindex's `pyproject.toml`.
- **Downstream**: phase 003 needs the sidecar to be installable + runnable.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Surface | How to roll back |
|---------|------------------|
| Skill folder | `rm -rf .opencode/skills/system-rerank-sidecar/` |
| Operator's `.venv` | `rm -rf .opencode/skills/system-rerank-sidecar/.venv` (also rolls back the install) |
| HuggingFace cache | Optionally `rm -rf ~/.cache/huggingface/hub/models--Qwen--Qwen3-Reranker-0.6B/` if disk-pressure-driven cleanup needed |

Removing the skill returns the system to today's state: HTTP slot in cross-encoder.ts has no answerer; spec-memory falls back to positional scores. Cocoindex (which bundles its own Qwen) is unaffected.
<!-- /ANCHOR:rollback -->
