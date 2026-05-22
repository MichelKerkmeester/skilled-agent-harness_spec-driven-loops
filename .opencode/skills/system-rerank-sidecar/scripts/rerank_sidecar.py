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
import collections
import hashlib
import json
import logging
import math
import os
import pathlib
import re
import time
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sentence_transformers import CrossEncoder

# TRUST MODEL: this server binds to 127.0.0.1 only. All security is
# defense-in-depth on top of localhost binding:
#   - Optional X-Rerank-Secret header (RERANK_API_KEY env)
#   - Rate limiting (RERANK_RATE_LIMIT_PER_MIN env, default 100/min)
#   - Payload size caps (10K char query, 1000 docs max)
#   - CORS restricted to localhost origins
# No TLS -- relies on OS process-isolation. If you need transit encryption
# (e.g. proxy through a TLS terminator), do it externally; this sidecar
# is designed for trusted local consumers only.

DEFAULT_MODEL_NAME = os.environ.get("RERANK_MODEL_NAME", "Qwen/Qwen3-Reranker-0.6B")
DEFAULT_MODEL_REVISION = os.environ.get(
    "RERANK_MODEL_REVISION",
    "e61197ed45024b0ed8a2d74b80b4d909f1255473",
)
PORT = int(os.environ.get("RERANK_SIDECAR_PORT", "8765"))
LOG_PATH = os.environ.get("RERANK_LOG_PATH", "").strip()
LOG_MAX_BYTES = int(os.environ.get("RERANK_LOG_MAX_BYTES", str(1024 * 1024)))
LOG_RAW_QUERIES = os.environ.get("RERANK_LOG_RAW_QUERIES", "").strip() == "1"
DEVICE = os.environ.get("RERANK_DEVICE", "").strip()
DTYPE = os.environ.get("RERANK_TORCH_DTYPE", "").strip().lower()
RATE_LIMIT = int(os.environ.get("RERANK_RATE_LIMIT_PER_MIN", "100"))
OWNER_TOKEN = os.environ.get("RERANK_SIDECAR_OWNER_TOKEN", "").strip()
CONFIG_HASH = os.environ.get("RERANK_SIDECAR_CONFIG_HASH", "").strip()
MAX_DOCUMENT_BYTES = int(os.environ.get("RERANK_MAX_DOCUMENT_BYTES", str(1024 * 1024)))
_request_log: collections.deque[float] = collections.deque()

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

REVISION_PIN_RE = r"^[0-9a-fA-F]{40}$"
for _allowed_model in sorted(ALLOWED_MODELS):
    _revision = MODEL_REVISIONS.get(_allowed_model, "")
    if not isinstance(_revision, str) or not re.match(REVISION_PIN_RE, _revision):
        raise RuntimeError(
            "RERANK_MODEL_REVISIONS must provide a 40-character commit revision "
            f"for allowlisted model '{_allowed_model}' when trust_remote_code is enabled"
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


def _owner_token_sha256() -> str:
    if not OWNER_TOKEN:
        return ""
    return hashlib.sha256(OWNER_TOKEN.encode("utf-8")).hexdigest()


def _require_authenticated(x_rerank_secret: str | None = Header(default=None)) -> None:
    required = os.environ.get("RERANK_API_KEY", "").strip()
    if not required:
        return
    if x_rerank_secret != required:
        raise HTTPException(
            status_code=401,
            detail="Invalid or missing X-Rerank-Secret header",
        )


def verify_rerank_secret(x_rerank_secret: str | None = Header(default=None)) -> None:
    _require_authenticated(x_rerank_secret)


def check_rate_limit() -> None:
    if RATE_LIMIT <= 0:
        return
    now = time.time()
    while _request_log and _request_log[0] < now - 60:
        _request_log.popleft()
    if len(_request_log) >= RATE_LIMIT:
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded ({RATE_LIMIT}/min)",
        )
    _request_log.append(now)


def _validate_document_bytes(documents: list[str]) -> None:
    total_bytes = sum(len(doc.encode("utf-8")) for doc in documents)
    if total_bytes > MAX_DOCUMENT_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"document payload exceeds {MAX_DOCUMENT_BYTES} bytes",
        )


def _rotate_log_if_needed(path: str) -> None:
    if LOG_MAX_BYTES <= 0:
        return
    try:
        log_path = pathlib.Path(path)
        if not log_path.exists() or log_path.stat().st_size < LOG_MAX_BYTES:
            return
        rotated_path = log_path.with_name(f"{log_path.name}.1")
        try:
            rotated_path.unlink()
        except FileNotFoundError:
            pass
        log_path.replace(rotated_path)
    except OSError as exc:
        logger.warning("rerank log rotation failed: %s", exc)


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
    query: str = Field(..., max_length=10000)
    documents: list[str] = Field(..., min_length=1, max_length=1000)
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
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


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
        "owner_token_sha256": _owner_token_sha256(),
        "canonical_config_hash": CONFIG_HASH,
        "queue_depth": sum(1 for lock in _locks.values() if lock.locked()),
        "uptime_s": round(time.time() - _started_at, 2),
    }


@app.post("/warmup")
async def warmup(
    req: Optional[WarmupRequest] = None,
    x_rerank_secret: str | None = Header(default=None),
):
    _require_authenticated(x_rerank_secret)
    check_rate_limit()
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


@app.post(
    "/rerank",
    response_model=RerankResponse,
    dependencies=[Depends(verify_rerank_secret)],
)
async def rerank(req: RerankRequest):
    check_rate_limit()
    if req.top_k is not None and req.top_k < 0:
        raise HTTPException(status_code=400, detail="top_k must be non-negative")
    _validate_document_bytes(req.documents)

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
            _rotate_log_if_needed(LOG_PATH)
            query_hash = hashlib.sha256(req.query.encode("utf-8")).hexdigest()
            query_value = req.query if LOG_RAW_QUERIES else "<redacted>"
            with open(LOG_PATH, "a", encoding="utf-8") as f:
                f.write(
                    json.dumps(
                        {
                            "ts": time.time(),
                            "query": query_value,
                            "query_sha256": query_hash,
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
