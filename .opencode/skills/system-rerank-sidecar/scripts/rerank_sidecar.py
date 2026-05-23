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
import signal
import tempfile
import time
from contextlib import asynccontextmanager
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Optional

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sentence_transformers import CrossEncoder

from scripts import sidecar_ledger

# TRUST MODEL: this server binds to 127.0.0.1 only. All security is
# defense-in-depth on top of localhost binding:
#   - Optional X-Rerank-Secret header (RERANK_API_KEY env)
#   - Rate limiting (RERANK_RATE_LIMIT_PER_MIN env, default 100/min)
#   - Payload size caps (10K char query, 1000 docs max)
#   - CORS restricted to localhost origins
# No TLS -- relies on OS process-isolation. If you need transit encryption
# (e.g. proxy through a TLS terminator), do it externally; this sidecar
# is designed for trusted local consumers only.

# Canonical defaults imported from sidecar_defaults (022/008 dedup; previously
# duplicated as inline literals across .cjs + .sh + this file + ensure_rerank_sidecar.py).
try:
    from scripts.sidecar_defaults import (
        DEFAULT_PORT as _SIDECAR_DEFAULT_PORT,
        DEFAULT_MODEL_NAME as _SIDECAR_DEFAULT_MODEL_NAME,
        DEFAULT_MODEL_REVISION as _SIDECAR_DEFAULT_MODEL_REVISION,
    )
except ModuleNotFoundError:  # pragma: no cover - direct script execution
    from sidecar_defaults import (  # type: ignore[no-redef]
        DEFAULT_PORT as _SIDECAR_DEFAULT_PORT,
        DEFAULT_MODEL_NAME as _SIDECAR_DEFAULT_MODEL_NAME,
        DEFAULT_MODEL_REVISION as _SIDECAR_DEFAULT_MODEL_REVISION,
    )

DEFAULT_MODEL_NAME = os.environ.get("RERANK_MODEL_NAME", _SIDECAR_DEFAULT_MODEL_NAME)
DEFAULT_MODEL_REVISION = os.environ.get("RERANK_MODEL_REVISION", _SIDECAR_DEFAULT_MODEL_REVISION)
PORT = int(os.environ.get("RERANK_SIDECAR_PORT", str(_SIDECAR_DEFAULT_PORT)))
LOG_PATH = os.environ.get("RERANK_LOG_PATH", "").strip()
LOG_MAX_BYTES = int(os.environ.get("RERANK_LOG_MAX_BYTES", str(1024 * 1024)))
LOG_RAW_QUERIES = os.environ.get("RERANK_LOG_RAW_QUERIES", "").strip() == "1"
DEVICE = os.environ.get("RERANK_DEVICE", "").strip()
DTYPE = os.environ.get("RERANK_TORCH_DTYPE", "").strip().lower()
RATE_LIMIT = int(os.environ.get("RERANK_RATE_LIMIT_PER_MIN", "100"))
OWNER_TOKEN = os.environ.get("RERANK_SIDECAR_OWNER_TOKEN", "").strip()
CONFIG_HASH = os.environ.get("RERANK_SIDECAR_CONFIG_HASH", "").strip()
MAX_DOCUMENT_BYTES = int(os.environ.get("RERANK_MAX_DOCUMENT_BYTES", str(1024 * 1024)))
REAPER_HEARTBEAT_SECONDS = float(
    os.environ.get("RERANK_SIDECAR_REAPER_HEARTBEAT_SECONDS", "45")
)
IDLE_TIMEOUT_SECONDS = float(os.environ.get("RERANK_SIDECAR_IDLE_TIMEOUT_SECONDS", "1800"))
REAPER_TELEMETRY_PATH = os.environ.get(
    "RERANK_SIDECAR_REAPER_TELEMETRY_PATH",
    "~/Library/Logs/spec-kit/sidecar-reaper.jsonl",
).strip()
REAPER_DISABLED = os.environ.get("RERANK_SIDECAR_REAPER_DISABLE", "").strip() == "1"
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


@dataclass(frozen=True)
class ReaperDecision:
    """Decision snapshot that can be delayed until requests drain."""

    event_type: str
    reason: str
    evidence: dict[str, Any]


class InFlightGate:
    """Track active app work so the reaper never exits mid-request."""

    def __init__(self) -> None:
        self._count = 0
        self._lock = asyncio.Lock()

    async def enter(self) -> None:
        async with self._lock:
            self._count += 1

    async def exit(self) -> int:
        async with self._lock:
            self._count = max(0, self._count - 1)
            return self._count

    async def count(self) -> int:
        async with self._lock:
            return self._count

    async def is_open(self) -> bool:
        return await self.count() == 0


in_flight_gate = InFlightGate()
_last_request_at = datetime.now(timezone.utc)
_shutdown_pending: ReaperDecision | None = None
_shutdown_signal_sent = False
_shutdown_lock = asyncio.Lock()


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


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _idle_seconds(now: datetime | None = None) -> float:
    reference = now or _utcnow()
    return max(0.0, (reference - _last_request_at).total_seconds())


def _mark_real_request() -> None:
    global _last_request_at
    _last_request_at = _utcnow()


def _read_ledger_locked() -> list[sidecar_ledger.SidecarLedgerRow]:
    """Read the sidecar ledger under the existing ledger file lock."""
    with sidecar_ledger._locked_ledger(sidecar_ledger.default_state_dir()):
        return sidecar_ledger._read_ledger_unlocked(sidecar_ledger.default_state_dir())


def _owner_states_for_port(port: int) -> list[dict[str, Any]]:
    rows = [row for row in _read_ledger_locked() if row.port == port]
    owners_state: list[dict[str, Any]] = []
    for row in rows:
        for owner in row.owners:
            liveness = sidecar_ledger.process_liveness(
                owner.pid,
                owner.createTimestamp,
                owner.comm,
            )
            owners_state.append(
                {
                    "pid": owner.pid,
                    "alive": bool(liveness.get("alive")),
                    "reason": str(liveness.get("reason", "unknown")),
                }
            )
    return owners_state


def _build_event_payload(
    event_type: str,
    reason: str,
    evidence: dict[str, Any] | None = None,
) -> dict[str, Any]:
    event_evidence = evidence or {}
    now = _utcnow()
    owners_state = event_evidence.get("owners_state", [])
    in_flight_count = event_evidence.get("in_flight_count", 0)
    idle_seconds = event_evidence.get("idle_seconds", _idle_seconds(now))
    return {
        "ts": now.isoformat().replace("+00:00", "Z"),
        "event_type": event_type,
        "sidecar_pid": os.getpid(),
        "port": PORT,
        "owners_state": owners_state,
        "in_flight_count": in_flight_count,
        "idle_seconds": idle_seconds,
        "reason": reason,
        "evidence": event_evidence,
    }


def _write_reaper_event_sync(payload: dict[str, Any]) -> None:
    telemetry_path = pathlib.Path(REAPER_TELEMETRY_PATH).expanduser()
    telemetry_path.parent.mkdir(parents=True, exist_ok=True)
    existing = ""
    try:
        existing = telemetry_path.read_text(encoding="utf-8")
    except FileNotFoundError:
        pass
    fd, temp_name = tempfile.mkstemp(
        prefix=f"{telemetry_path.name}.tmp.{os.getpid()}.",
        dir=str(telemetry_path.parent),
        text=True,
    )
    temp_path = pathlib.Path(temp_name)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            if existing:
                handle.write(existing)
                if not existing.endswith("\n"):
                    handle.write("\n")
            handle.write(json.dumps(payload, sort_keys=True) + "\n")
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temp_path, telemetry_path)
    except Exception:
        try:
            temp_path.unlink()
        except OSError:
            pass
        raise


def write_reaper_event(
    event_type: str,
    reason: str,
    evidence_dict: dict[str, Any] | None = None,
) -> None:
    """Append one structured reaper telemetry JSONL event."""
    _write_reaper_event_sync(_build_event_payload(event_type, reason, evidence_dict))


async def _write_reaper_event_async(decision: ReaperDecision) -> None:
    loop = asyncio.get_running_loop()
    await loop.run_in_executor(
        None,
        write_reaper_event,
        decision.event_type,
        decision.reason,
        decision.evidence,
    )


async def _send_self_sigterm(decision: ReaperDecision) -> None:
    global _shutdown_signal_sent
    async with _shutdown_lock:
        if _shutdown_signal_sent:
            return
        await _write_reaper_event_async(decision)
        _shutdown_signal_sent = True
        os.kill(os.getpid(), signal.SIGTERM)


async def _maybe_exit_after_request_drained() -> None:
    global _shutdown_pending
    if _shutdown_pending is None:
        return
    if not await in_flight_gate.is_open():
        return
    decision = _shutdown_pending
    _shutdown_pending = None
    await _send_self_sigterm(decision)


async def _handle_reaper_decision(decision: ReaperDecision) -> bool:
    global _shutdown_pending
    count = await in_flight_gate.count()
    if count > 0:
        decision.evidence["in_flight_count"] = count
        _shutdown_pending = decision
        return False
    decision.evidence["in_flight_count"] = 0
    await _send_self_sigterm(decision)
    return True


async def evaluate_reaper_once() -> bool:
    """Evaluate Layer B owner liveness and Layer A idle timeout once."""
    if REAPER_DISABLED:
        return False

    now = _utcnow()
    idle_seconds = _idle_seconds(now)
    owners_state = _owner_states_for_port(PORT)
    base_evidence = {
        "owners_state": owners_state,
        "idle_seconds": idle_seconds,
        "heartbeat_seconds": REAPER_HEARTBEAT_SECONDS,
        "idle_timeout_seconds": IDLE_TIMEOUT_SECONDS,
    }

    if owners_state and all(not owner["alive"] for owner in owners_state):
        return await _handle_reaper_decision(
            ReaperDecision("reap", "all-owners-dead", dict(base_evidence))
        )

    if IDLE_TIMEOUT_SECONDS > 0 and idle_seconds > IDLE_TIMEOUT_SECONDS:
        return await _handle_reaper_decision(
            ReaperDecision("idle-exit", "idle-timeout", dict(base_evidence))
        )

    return False


async def reaper_loop() -> None:
    while True:
        await asyncio.sleep(REAPER_HEARTBEAT_SECONDS)
        await evaluate_reaper_once()


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
    reaper_task: asyncio.Task[None] | None = None
    if not REAPER_DISABLED:
        reaper_task = asyncio.create_task(reaper_loop(), name="rerank-sidecar-reaper")
    try:
        yield
    finally:
        if reaper_task is not None:
            reaper_task.cancel()
            try:
                await reaper_task
            except asyncio.CancelledError:
                pass
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
    await in_flight_gate.enter()
    _mark_real_request()
    try:
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
    finally:
        await in_flight_gate.exit()
        await _maybe_exit_after_request_drained()


@app.post(
    "/rerank",
    response_model=RerankResponse,
)
async def rerank(
    req: RerankRequest,
    x_rerank_secret: str | None = Header(default=None),
):
    await in_flight_gate.enter()
    _mark_real_request()
    try:
        _require_authenticated(x_rerank_secret)
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
    finally:
        await in_flight_gate.exit()
        await _maybe_exit_after_request_drained()
