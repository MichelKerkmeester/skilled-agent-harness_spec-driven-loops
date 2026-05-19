"""IPC message types and serialization helpers for daemon communication."""

# Modified by spec-kit-skilled-agent-orchestration: 009 packet REQ-001..006 (see ../NOTICE)
from __future__ import annotations

import msgspec as _msgspec

# ---------------------------------------------------------------------------
# Requests (tagged union via struct tag)
# ---------------------------------------------------------------------------


class HandshakeRequest(_msgspec.Struct, tag="handshake"):
    version: str


class IndexRequest(_msgspec.Struct, tag="index"):
    project_root: str


class SearchRequest(_msgspec.Struct, tag="search"):
    project_root: str
    query: str
    languages: list[str] | None = None
    paths: list[str] | None = None
    limit: int = 5
    offset: int = 0
    reqId: str | None = None


class ProjectStatusRequest(_msgspec.Struct, tag="project_status"):
    project_root: str


class DaemonStatusRequest(_msgspec.Struct, tag="daemon_status"):
    pass


class RemoveProjectRequest(_msgspec.Struct, tag="remove_project"):
    project_root: str


class StopRequest(_msgspec.Struct, tag="stop"):
    pass


Request = (
    HandshakeRequest
    | IndexRequest
    | SearchRequest
    | ProjectStatusRequest
    | DaemonStatusRequest
    | RemoveProjectRequest
    | StopRequest
)

# ---------------------------------------------------------------------------
# Responses
# ---------------------------------------------------------------------------


class HandshakeResponse(_msgspec.Struct, tag="handshake"):
    ok: bool
    daemon_version: str
    global_settings_mtime_us: int | None = None


class IndexResponse(_msgspec.Struct, tag="index"):
    success: bool
    message: str | None = None


class IndexingProgress(_msgspec.Struct):
    """Indexing stats snapshot, shared between progress updates and status responses."""

    num_execution_starts: int
    num_unchanged: int
    num_adds: int
    num_deletes: int
    num_reprocesses: int
    num_errors: int


class IndexProgressUpdate(_msgspec.Struct, tag="index_progress"):
    """Streamed during indexing — one per stats change, before the final IndexResponse."""

    progress: IndexingProgress


class IndexWaitingNotice(_msgspec.Struct, tag="index_waiting"):
    """Sent when another indexing is already in progress and the client must wait."""

    pass


class SearchResult(_msgspec.Struct):
    file_path: str
    language: str
    content: str
    start_line: int
    end_line: int
    score: float
    raw_score: float = 0.0
    path_class: str = "implementation"
    rankingSignals: list[str] = _msgspec.field(default_factory=list)
    fts5_score: float | None = None
    rrf_score: float | None = None
    pre_rerank_score: float | None = None
    reranker_score: float | None = None


class RetrievalDiagnosticsPayload(_msgspec.Struct):
    vec_candidates_count: int = 0
    fts_candidates_count: int = 0
    overlap_count: int = 0
    post_dedup_count: int = 0
    rerank_input_count: int = 0
    rerank_output_count: int = 0
    boost_flip_count: int = 0
    reranker_fallback_used: bool = False
    reranker_fallback_reason: str = "none"


class IndexFingerprintPayload(_msgspec.Struct):
    embedder_name: str | None = None
    embedder_dim: int | None = None
    embedder_provider: str | None = None
    query_prompt_name: str | None = None
    document_prompt_name: str | None = None
    reranker_name: str | None = None
    reranker_enabled: bool | None = None
    reranker_license: str | None = None
    chunk_size: int | None = None
    chunk_overlap: int | None = None
    chunking_policy: str | None = None
    corpus_root: str | None = None
    chunk_count: int | None = None
    file_count: int | None = None
    rrf_K: int | None = None
    rrf_V: float | None = None
    rrf_F: float | None = None
    hybrid_boost_path: bool | None = None
    hybrid_boost_canonical: bool | None = None
    effective_config_hash: str | None = None
    indexed_effective_config_hash: str | None = None
    fingerprint_warning: str | None = None


class SearchResponse(_msgspec.Struct, tag="search"):
    success: bool
    results: list[SearchResult] = []
    total_returned: int = 0
    offset: int = 0
    dedupedAliases: int = 0
    uniqueResultCount: int = 0
    diagnostics: RetrievalDiagnosticsPayload = _msgspec.field(
        default_factory=RetrievalDiagnosticsPayload
    )
    message: str | None = None


class ProjectStatusResponse(_msgspec.Struct, tag="project_status"):
    indexing: bool
    total_chunks: int
    total_files: int
    languages: dict[str, int]
    progress: IndexingProgress | None = None
    index_exists: bool = True
    fingerprint: IndexFingerprintPayload = _msgspec.field(default_factory=IndexFingerprintPayload)


class DaemonProjectInfo(_msgspec.Struct):
    project_root: str
    indexing: bool


class DaemonStatusResponse(_msgspec.Struct, tag="daemon_status"):
    version: str
    uptime_seconds: float
    projects: list[DaemonProjectInfo]
    clientDisconnects: int = 0


class RemoveProjectResponse(_msgspec.Struct, tag="remove_project"):
    ok: bool


class StopResponse(_msgspec.Struct, tag="stop"):
    ok: bool


class ErrorResponse(_msgspec.Struct, tag="error"):
    message: str
    reqId: str | None = None


Response = (
    HandshakeResponse
    | IndexResponse
    | IndexProgressUpdate
    | IndexWaitingNotice
    | SearchResponse
    | ProjectStatusResponse
    | DaemonStatusResponse
    | RemoveProjectResponse
    | StopResponse
    | ErrorResponse
)

IndexStreamResponse = IndexProgressUpdate | IndexWaitingNotice | IndexResponse | ErrorResponse
SearchStreamResponse = IndexWaitingNotice | SearchResponse | ErrorResponse

# ---------------------------------------------------------------------------
# Encode / decode helpers (msgpack binary)
# ---------------------------------------------------------------------------

_request_encoder = _msgspec.msgpack.Encoder()
_request_decoder = _msgspec.msgpack.Decoder(Request)

_response_encoder = _msgspec.msgpack.Encoder()
_response_decoder = _msgspec.msgpack.Decoder(Response)


def encode_request(req: Request) -> bytes:
    return _request_encoder.encode(req)


def decode_request(data: bytes) -> Request:
    result: Request = _request_decoder.decode(data)
    return result


def encode_response(resp: Response) -> bytes:
    return _response_encoder.encode(resp)


def decode_response(data: bytes) -> Response:
    result: Response = _response_decoder.decode(data)
    return result
