"""Small observability helpers for CocoIndex daemon IPC and MCP requests."""

from __future__ import annotations

import json
import logging
import os
import time
import uuid
from collections.abc import Mapping
from typing import Any

import msgspec as _msgspec

DEFAULT_MCP_REQUEST_TIMEOUT_MS = 10_000
MIN_MCP_REQUEST_TIMEOUT_MS = 1_000
MAX_MCP_REQUEST_TIMEOUT_MS = 600_000
MCP_REQUEST_TIMEOUT_ENV = "COCOINDEX_CODE_MCP_REQUEST_TIMEOUT_MS"
IPC_DEBUG_ENV = "COCOINDEX_CODE_IPC_DEBUG"


def ipc_debug_enabled() -> bool:
    """Return whether sensitive IPC payload debug logging is enabled."""
    return os.environ.get(IPC_DEBUG_ENV, "").lower() in {"1", "true", "yes", "on"}


def new_request_id() -> str:
    """Generate a short request correlation ID."""
    return uuid.uuid4().hex[:12]


def monotonic_ms() -> float:
    """Return monotonic time in milliseconds."""
    return time.perf_counter() * 1000


def elapsed_ms(start_ms: float) -> int:
    """Return elapsed milliseconds rounded to a non-negative integer."""
    return max(0, round(monotonic_ms() - start_ms))


def resolve_mcp_request_timeout_ms(env: Mapping[str, str] | None = None) -> int:
    """Resolve and clamp the MCP request timeout budget."""
    source = os.environ if env is None else env
    raw_value = source.get(MCP_REQUEST_TIMEOUT_ENV, "").strip()
    if not raw_value:
        return DEFAULT_MCP_REQUEST_TIMEOUT_MS
    try:
        parsed = int(raw_value)
    except ValueError:
        return DEFAULT_MCP_REQUEST_TIMEOUT_MS
    return min(
        MAX_MCP_REQUEST_TIMEOUT_MS,
        max(MIN_MCP_REQUEST_TIMEOUT_MS, parsed),
    )


def log_json(logger: logging.Logger, **fields: Any) -> None:
    """Emit one structured JSON log line."""
    logger.info(json.dumps(fields, sort_keys=True, separators=(",", ":")))


def log_stage(
    logger: logging.Logger,
    *,
    req_id: str,
    stage: str,
    duration_ms: int,
    result_count: int = 0,
    lane: str | None = None,
) -> None:
    """Emit a standard request-stage timing log entry."""
    fields: dict[str, Any] = {
        "event": "cocoindex_stage",
        "reqId": req_id,
        "stage": stage,
        "durationMs": duration_ms,
        "resultCount": result_count,
    }
    if lane is not None:
        fields["lane"] = lane
    log_json(logger, **fields)


def log_response_size(
    logger: logging.Logger,
    *,
    req_id: str,
    byte_count: int,
    stage: str,
) -> None:
    """Emit a standard serialized-response-size log entry."""
    log_json(
        logger,
        event="cocoindex_response_size",
        reqId=req_id,
        bytes=byte_count,
        stage=stage,
    )


def _payload_type(data: bytes) -> Any:
    try:
        decoded = _msgspec.msgpack.decode(data)
    except Exception:
        return None
    if isinstance(decoded, dict):
        return decoded.get("type") or decoded.get(b"type")
    return None


def log_msgspec_decode_error(
    logger: logging.Logger,
    *,
    direction: str,
    data: bytes,
    error: Exception,
    req_id: str | None = None,
) -> None:
    """Log msgspec decode metadata, gated because the prefix can expose content."""
    if not ipc_debug_enabled():
        return
    fields: dict[str, Any] = {
        "event": "cocoindex_msgspec_decode_error",
        "direction": direction,
        "bytes": len(data),
        "type": _payload_type(data),
        "prefix": repr(data[:200]),
        "error": str(error),
    }
    if req_id is not None:
        fields["reqId"] = req_id
    log_json(logger, **fields)
