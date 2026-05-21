#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: SYSTEM RERANK SIDECAR
# ───────────────────────────────────────────────────────────────
"""FastAPI HTTP sidecar for shared cross-encoder reranking.

Supports multiple cross-encoder models concurrently: each consumer can
request a different model via the optional ``model`` field on ``/rerank``.
The default model is loaded on first call when no ``model`` is specified.
Additional models must be in the ``RERANK_ALLOWED_MODELS`` allowlist.
"""

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

DEFAULT_MODEL_NAME = os.environ.get("RERANK_MODEL_NAME", "Qwen/Qwen3-Reranker-0.6B")
DEFAULT_MODEL_REVISION = os.environ.get(
    "RERANK_MODEL_REVISION",
    "e61197ed45024b0ed8a2d74b80b4d909f1255473",
)
PORT = int(os.environ.get("RERANK_SIDECAR_PORT", "8765"))
LOG_PATH = os.environ.get("RERANK_LOG_PATH", "").strip()
DEVICE = os.environ.get("RERANK_DEVICE", "").strip()
DTYPE = os.environ.get("RERANK_TORCH_DTYPE", "").strip().lower()

# Allowlist of model names the sidecar will load on request. The default is
# always implicitly allowed. Operators add more via env:
#   RERANK_ALLOWED_MODELS=Qwen/Qwen3-Reranker-0.6B,cross-encoder/ms-marco-MiniLM-L-6-v2
_allowed_raw = os.environ.get("RERANK_ALLOWED_MODELS", "").strip()
ALLOWED_MODELS: set[str] = {DEFAULT_MODEL_NAME}
if _allowed_raw:
    ALLOWED_MODELS |= {m.strip() for m in _allowed_raw.split(",") if m.strip()}

# Optional per-model revision overrides (JSON map). Defaults pin only the
# default model; others use HEAD of the locally cached snapshot.
#   RERANK_MODEL_REVISIONS={"cross-encoder/ms-marco-MiniLM-L-6-v2":"abc123"}
MODEL_REVISIONS: dict[str, str] = {DEFAULT_MODEL_NAME: DEFAULT_MODEL_REVISION}
_revisions_raw = os.environ.get("RERANK_MODEL_REVISIONS", "").strip()
if _revisions_raw:
    try:
        MODEL_REVISIONS.update(json.loads(_revisions_raw))
    except (json.JSONDecodeError, TypeError) as exc:
        logging.getLogger("rerank_sidecar").warning(
            "Ignoring invalid RERANK_MODEL_REVISIONS env: %s", exc
        )

_models: dict[str, CrossEncoder] = {}
_locks: dict[str, asyncio.Lock] = {}
_started_at = time.time()
logger = logging.getLogger("rerank_sidecar")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")


def sigmoid(x: float) -> float:
    if x >= 0:
        return 1.0 / (1.0 + math.exp(-x))
    z = math.exp(x)
    return z / (1.0 + z)


def _get_lock(model_name: str) -> asyncio.Lock:
    lock = _locks.get(model_name)
    if lock is None:
        lock = asyncio.Lock()
        _locks[model_name] = lock
    return lock


def _load_model(model_name: str) -> CrossEncoder:
    kwargs: dict[str, object] = {
        "trust_remote_code": True,
        "local_files_only": True,
    }
    revision = MODEL_REVISIONS.get(model_name)
    if revision:
        kwargs["revision"] = revision
    if DEVICE:
        kwargs["device"] = DEVICE
    # arc 008/009 — cut model memory ~2x on MPS via fp16; bfloat16 alt for ops that need wider range
    if DTYPE in {"float16", "fp16", "half"}:
        import torch
        kwargs["model_kwargs"] = {"torch_dtype": torch.float16}
    elif DTYPE in {"bfloat16", "bf16"}:
        import torch
        kwargs["model_kwargs"] = {"torch_dtype": torch.bfloat16}
    return CrossEncoder(model_name, **kwargs)


def _resolve_model_name(requested: Optional[str]) -> str:
    """Return the requested model if allowlisted, else the default model."""
    name = (requested or "").strip() or DEFAULT_MODEL_NAME
    if name not in ALLOWED_MODELS:
        raise HTTPException(
            status_code=400,
            detail=(
                f"model '{name}' is not in the allowlist. "
                f"Allowed: {sorted(ALLOWED_MODELS)}. "
                "Set RERANK_ALLOWED_MODELS to extend."
            ),
        )
    return name


class RerankRequest(BaseModel):
    query: str
    documents: list[str]
    top_k: Optional[int] = None
    model: Optional[str] = None  # optional; defaults to RERANK_MODEL_NAME


class RerankResultItem(BaseModel):
    index: int
    relevance_score: float


class RerankResponse(BaseModel):
    results: list[RerankResultItem]
    model: str
    latency_ms: int


class WarmupRequest(BaseModel):
    model: Optional[str] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    if _models:
        logger.info("Releasing %d rerank model(s) before shutdown", len(_models))
    _models.clear()


app = FastAPI(lifespan=lifespan, title="system-rerank-sidecar", version="0.2.0")


@app.get("/health")
async def health():
    loaded = sorted(_models.keys())
    return {
        "status": "ok",
        "model_loaded": DEFAULT_MODEL_NAME in _models,  # legacy field for old clients
        "model_name": DEFAULT_MODEL_NAME,                # legacy field
        "default_model": DEFAULT_MODEL_NAME,
        "allowed_models": sorted(ALLOWED_MODELS),
        "loaded_models": loaded,
        "queue_depth": sum(1 for lock in _locks.values() if lock.locked()),
        "uptime_s": round(time.time() - _started_at, 2),
    }


@app.post("/warmup")
async def warmup(req: Optional[WarmupRequest] = None):
    requested = req.model if req else None
    model_name = _resolve_model_name(requested)
    revision = MODEL_REVISIONS.get(model_name, "")
    lock = _get_lock(model_name)
    async with lock:
        if model_name not in _models:
            start = time.time()
            logger.info("Loading rerank model %s%s", model_name, f" revision {revision}" if revision else "")
            _models[model_name] = _load_model(model_name)
            logger.info("Loaded rerank model %s in %sms", model_name, int((time.time() - start) * 1000))
    return {"status": "warmed", "model": model_name, "revision": revision}


@app.post("/rerank", response_model=RerankResponse)
async def rerank(req: RerankRequest):
    if not req.documents:
        raise HTTPException(status_code=400, detail="documents must be non-empty")
    if req.top_k is not None and req.top_k < 0:
        raise HTTPException(status_code=400, detail="top_k must be non-negative")

    model_name = _resolve_model_name(req.model)
    revision = MODEL_REVISIONS.get(model_name, "")
    start = time.time()
    lock = _get_lock(model_name)
    async with lock:
        if model_name not in _models:
            logger.info("Lazy-loading rerank model %s%s", model_name, f" revision {revision}" if revision else "")
            _models[model_name] = _load_model(model_name)
        pairs = [(req.query, doc) for doc in req.documents]
        raw_scores = [float(score) for score in _models[model_name].predict(pairs)]

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
                            "model": model_name,
                        }
                    )
                    + "\n"
                )
        except Exception as exc:  # pragma: no cover - logging must not break rerank
            logger.warning("rerank log write failed: %s", exc)

    return RerankResponse(
        results=[RerankResultItem(index=i, relevance_score=s) for i, s in indexed],
        model=model_name,
        latency_ms=latency_ms,
    )
