"""Small observability helpers for CocoIndex daemon IPC and MCP requests."""

from __future__ import annotations

import json
import logging
import os
import hashlib
import time
import uuid
from collections.abc import Mapping
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any

import msgspec as _msgspec

DEFAULT_MCP_REQUEST_TIMEOUT_MS = 10_000
MIN_MCP_REQUEST_TIMEOUT_MS = 1_000
MAX_MCP_REQUEST_TIMEOUT_MS = 600_000
MCP_REQUEST_TIMEOUT_ENV = "COCOINDEX_CODE_MCP_REQUEST_TIMEOUT_MS"
IPC_DEBUG_ENV = "COCOINDEX_CODE_IPC_DEBUG"
LANE_VECTOR_ONLY = "vector_only"
LANE_HYBRID_RRF = "hybrid_rrf"
LANE_HYBRID_RERANK = "hybrid_rerank"
INDEX_META_FILE = "index_meta.json"

RERANKER_LICENSES = {
    "jinaai/jina-reranker-v3": "cc-by-nc-4.0",
    "BAAI/bge-reranker-v2-m3": "mit",
}


@dataclass
class RetrievalDiagnostics:
    vec_candidates_count: int = 0
    fts_candidates_count: int = 0
    overlap_count: int = 0
    post_dedup_count: int = 0
    rerank_input_count: int = 0
    rerank_output_count: int = 0
    boost_flip_count: int = 0
    reranker_fallback_used: bool = False
    reranker_fallback_reason: str = "none"

    def record_stage(self, name: str, count: int) -> None:
        """Record a retrieval diagnostic counter by field name."""
        if not hasattr(self, name):
            raise KeyError(f"unknown retrieval diagnostic counter: {name}")
        setattr(self, name, count)

    def record_reranker_fallback(self, reason: str) -> None:
        self.reranker_fallback_used = True
        self.reranker_fallback_reason = reason

    def dump(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(frozen=True)
class IndexFingerprint:
    embedder_name: str
    embedder_dim: int | None
    embedder_provider: str
    query_prompt_name: str | None
    document_prompt_name: str | None
    reranker_name: str
    reranker_enabled: bool
    reranker_license: str
    chunk_size: int
    chunk_overlap: int
    chunking_policy: str
    corpus_root: str
    chunk_count: int
    file_count: int
    rrf_K: int
    rrf_V: float
    rrf_F: float
    hybrid_boost_path: bool
    hybrid_boost_canonical: bool
    effective_config_hash: str

    def dump(self) -> dict[str, Any]:
        return asdict(self)


def index_meta_path(project_root: Path) -> Path:
    return project_root / ".cocoindex_code" / INDEX_META_FILE


def effective_config_hash(config_dict: Mapping[str, Any]) -> str:
    payload = json.dumps(config_dict, sort_keys=True, separators=(",", ":"), default=str)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:12]


def _reranker_license(model_name: str) -> str:
    for prefix, license_name in RERANKER_LICENSES.items():
        if model_name.startswith(prefix):
            return license_name
    return "unknown"


def build_index_fingerprint(
    *,
    project_root: Path,
    chunk_count: int = 0,
    file_count: int = 0,
    embedding_model: str | None = None,
    embedding_provider: str | None = None,
) -> IndexFingerprint:
    from .config import config
    from .registered_embedders import get_embedder_metadata
    from .shared import query_prompt_name

    embedder_name = embedding_model or config.embedding_model
    embedder_dim = None
    if metadata := get_embedder_metadata(embedder_name):
        embedder_dim = metadata.dim
    embedder_provider = embedding_provider or (
        "sentence-transformers" if embedder_name.startswith("sbert/") else "litellm"
    )
    chunking_policy = "tree-sitter" if config.code_aware_chunking else "simple"
    hash_payload = {
        "embedder_name": embedder_name,
        "embedder_dim": embedder_dim,
        "embedder_provider": embedder_provider,
        "query_prompt_name": query_prompt_name,
        "document_prompt_name": None,
        "reranker_name": config.rerank_model,
        "reranker_enabled": config.rerank_enabled,
        "reranker_license": _reranker_license(config.rerank_model),
        "chunk_size": config.chunk_size,
        "chunk_overlap": config.chunk_overlap,
        "chunking_policy": chunking_policy,
        "corpus_root": str(project_root),
        "rrf_K": config.hybrid_rrf_k,
        "rrf_V": config.hybrid_vector_weight,
        "rrf_F": config.hybrid_fts5_weight,
        "hybrid_boost_path": True,
        "hybrid_boost_canonical": True,
    }
    return IndexFingerprint(
        **hash_payload,
        chunk_count=chunk_count,
        file_count=file_count,
        effective_config_hash=effective_config_hash(hash_payload),
    )


def write_index_meta(project_root: Path, fingerprint: IndexFingerprint) -> Path:
    path = index_meta_path(project_root)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(fingerprint.dump(), indent=2, sort_keys=True) + "\n")
    return path


def read_index_meta(project_root: Path) -> dict[str, Any] | None:
    path = index_meta_path(project_root)
    if not path.is_file():
        return None
    try:
        payload = json.loads(path.read_text())
    except (OSError, json.JSONDecodeError):
        return None
    return payload if isinstance(payload, dict) else None


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


def log_retrieval_diagnostics(
    logger: logging.Logger,
    *,
    req_id: str,
    diagnostics: RetrievalDiagnostics,
) -> None:
    log_json(
        logger,
        event="cocoindex_retrieval_diagnostics",
        reqId=req_id,
        **diagnostics.dump(),
    )


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
