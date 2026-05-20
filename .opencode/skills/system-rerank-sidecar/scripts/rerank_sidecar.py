#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: SYSTEM RERANK SIDECAR
# ───────────────────────────────────────────────────────────────
"""FastAPI HTTP sidecar for local Qwen cross-encoder reranking."""

from __future__ import annotations

import asyncio
import json
import logging
import math
import os
import time
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import CrossEncoder

MODEL_NAME = os.environ.get("RERANK_MODEL_NAME", "Qwen/Qwen3-Reranker-0.6B")
MODEL_REVISION = os.environ.get(
    "RERANK_MODEL_REVISION",
    "e61197ed45024b0ed8a2d74b80b4d909f1255473",
)
PORT = int(os.environ.get("RERANK_SIDECAR_PORT", "8765"))
LOG_PATH = os.environ.get("RERANK_LOG_PATH", "").strip()
DEVICE = os.environ.get("RERANK_DEVICE", "").strip()

_model: Optional[CrossEncoder] = None
_lock = asyncio.Lock()
_started_at = time.time()
logger = logging.getLogger("rerank_sidecar")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")


def sigmoid(x: float) -> float:
    if x >= 0:
        return 1.0 / (1.0 + math.exp(-x))
    z = math.exp(x)
    return z / (1.0 + z)


def _load_model() -> CrossEncoder:
    kwargs: dict[str, str | bool] = {
        "trust_remote_code": True,
        "revision": MODEL_REVISION,
        "local_files_only": True,
    }
    if DEVICE:
        kwargs["device"] = DEVICE
    return CrossEncoder(MODEL_NAME, **kwargs)


class RerankRequest(BaseModel):
    query: str
    documents: list[str]
    top_k: Optional[int] = None


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
    global _model
    if _model is not None:
        logger.info("Releasing rerank model before shutdown")
    _model = None


app = FastAPI(lifespan=lifespan, title="system-rerank-sidecar", version="0.1.0")


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "model_loaded": _model is not None,
        "model_name": MODEL_NAME,
        "queue_depth": 1 if _lock.locked() else 0,
        "uptime_s": round(time.time() - _started_at, 2),
    }


@app.post("/warmup")
async def warmup():
    global _model
    async with _lock:
        if _model is None:
            start = time.time()
            logger.info("Loading rerank model %s revision %s", MODEL_NAME, MODEL_REVISION)
            _model = _load_model()
            logger.info("Loaded rerank model in %sms", int((time.time() - start) * 1000))
    return {"status": "warmed", "model": MODEL_NAME, "revision": MODEL_REVISION}


@app.post("/rerank", response_model=RerankResponse)
async def rerank(req: RerankRequest):
    if not req.documents:
        raise HTTPException(status_code=400, detail="documents must be non-empty")
    if req.top_k is not None and req.top_k < 0:
        raise HTTPException(status_code=400, detail="top_k must be non-negative")

    global _model
    start = time.time()
    async with _lock:
        if _model is None:
            logger.info("Loading rerank model %s revision %s", MODEL_NAME, MODEL_REVISION)
            _model = _load_model()
        pairs = [(req.query, doc) for doc in req.documents]
        raw_scores = [float(score) for score in _model.predict(pairs)]

    sigmoid_scores = [sigmoid(score) for score in raw_scores]
    indexed = sorted(enumerate(sigmoid_scores), key=lambda kv: -kv[1])
    if req.top_k is not None:
        indexed = indexed[: req.top_k]

    latency_ms = int((time.time() - start) * 1000)
    if LOG_PATH:
        try:
            with open(LOG_PATH, "a", encoding="utf-8") as f:
                f.write(
                    json.dumps(
                        {
                            "ts": time.time(),
                            "query": req.query,
                            "doc_count": len(req.documents),
                            "top_k": req.top_k,
                            "latency_ms": latency_ms,
                            "model": MODEL_NAME,
                        }
                    )
                    + "\n"
                )
        except Exception as exc:  # pragma: no cover - logging must not break rerank
            logger.warning("rerank log write failed: %s", exc)

    return RerankResponse(
        results=[RerankResultItem(index=i, relevance_score=s) for i, s in indexed],
        model=MODEL_NAME,
        latency_ms=latency_ms,
    )
