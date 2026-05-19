#!/usr/bin/env python3
"""Unit tests for CocoIndex MCP observability helpers."""

from __future__ import annotations

import asyncio
import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Any

import numpy as np

from cocoindex_code.observability import (
    DEFAULT_MCP_REQUEST_TIMEOUT_MS,
    MAX_MCP_REQUEST_TIMEOUT_MS,
    MCP_REQUEST_TIMEOUT_ENV,
    MIN_MCP_REQUEST_TIMEOUT_MS,
    RetrievalDiagnostics,
    resolve_mcp_request_timeout_ms,
)
from cocoindex_code.query import (
    _count_hybrid_boost_flips,
    query_codebase,
)
from cocoindex_code import query as query_module
from cocoindex_code.fusion import FusedRow
from cocoindex_code.settings import PROJECT_SETTINGS
from cocoindex_code.shared import EMBEDDER, SQLITE_DB


class FakeDb:
    def __init__(self, conn: sqlite3.Connection) -> None:
        self.conn = conn

    @contextmanager
    def readonly(self) -> Any:
        yield self.conn


class FakeEmbedder:
    async def embed(self, query: str, prompt_name: str | None = None) -> np.ndarray:
        return np.array([0.1, 0.2], dtype=np.float32)


class FakeProjectSettings:
    canonical_resource_paths: list[str] = []


class FakeEnv:
    def __init__(self, conn: sqlite3.Connection) -> None:
        self.db = FakeDb(conn)
        self.embedder = FakeEmbedder()
        self.project_settings = FakeProjectSettings()

    def get_context(self, key: Any) -> Any:
        if key is SQLITE_DB:
            return self.db
        if key is EMBEDDER:
            return self.embedder
        if key is PROJECT_SETTINGS:
            return self.project_settings
        raise KeyError(key)


def _vector_row(chunk_id: int, file_path: str, distance: float) -> tuple[Any, ...]:
    return (
        chunk_id,
        file_path,
        f"/real/{file_path}",
        "python",
        f"def chunk_{chunk_id}(): pass",
        f"hash-{chunk_id}",
        "implementation",
        chunk_id,
        chunk_id + 1,
        distance,
    )


def _record(chunk_id: int, file_path: str, path_class: str) -> dict[str, Any]:
    return {
        "chunk_id": chunk_id,
        "file_path": file_path,
        "source_realpath": f"/real/{file_path}",
        "language": "python",
        "content": "def example(): pass",
        "content_hash": f"hash-{chunk_id}",
        "path_class": path_class,
        "start_line": 1,
        "end_line": 2,
        "distance": 0.1,
    }


def test_resolve_mcp_request_timeout_default() -> None:
    assert resolve_mcp_request_timeout_ms({}) == DEFAULT_MCP_REQUEST_TIMEOUT_MS


def test_resolve_mcp_request_timeout_invalid_uses_default() -> None:
    assert (
        resolve_mcp_request_timeout_ms({MCP_REQUEST_TIMEOUT_ENV: "not-an-int"})
        == DEFAULT_MCP_REQUEST_TIMEOUT_MS
    )


def test_resolve_mcp_request_timeout_clamps_low() -> None:
    assert (
        resolve_mcp_request_timeout_ms({MCP_REQUEST_TIMEOUT_ENV: "42"})
        == MIN_MCP_REQUEST_TIMEOUT_MS
    )


def test_resolve_mcp_request_timeout_clamps_high() -> None:
    assert (
        resolve_mcp_request_timeout_ms({MCP_REQUEST_TIMEOUT_ENV: "9999999"})
        == MAX_MCP_REQUEST_TIMEOUT_MS
    )


def test_resolve_mcp_request_timeout_accepts_in_range_value() -> None:
    assert resolve_mcp_request_timeout_ms({MCP_REQUEST_TIMEOUT_ENV: "12345"}) == 12345


def test_per_stage_counter_recorded(tmp_path: Path, monkeypatch: Any) -> None:
    db_path = tmp_path / "target_sqlite.db"
    conn = sqlite3.connect(db_path)
    monkeypatch.setattr(query_module.config, "hybrid_enabled", True)
    monkeypatch.setattr(query_module.config, "rerank_enabled", True)
    monkeypatch.setattr(query_module.config, "rerank_top_k", 20)
    monkeypatch.setattr(query_module.config, "rerank_model", "test-reranker")
    monkeypatch.setattr(query_module.config, "hybrid_rrf_k", 60)
    monkeypatch.setattr(query_module.config, "hybrid_vector_weight", 0.9)
    monkeypatch.setattr(query_module.config, "hybrid_fts5_weight", 0.5)
    monkeypatch.setattr(
        query_module,
        "_hybrid_vector_rows",
        lambda *_args: [
            _vector_row(1, "src/first.py", 0.1),
            _vector_row(2, "src/second.py", 0.2),
        ],
    )
    monkeypatch.setattr(query_module, "query_fts", lambda *_args, **_kwargs: [(2, 0.4)])
    monkeypatch.setattr(
        query_module.reranker,
        "rerank",
        lambda _query, candidates, **_kwargs: candidates,
    )

    results = asyncio.run(query_codebase("implementation query", db_path, FakeEnv(conn), limit=2))
    diagnostics = results.diagnostics.dump()

    assert set(diagnostics) == {
        "vec_candidates_count",
        "fts_candidates_count",
        "overlap_count",
        "post_dedup_count",
        "rerank_input_count",
        "rerank_output_count",
        "boost_flip_count",
        "reranker_fallback_used",
        "reranker_fallback_reason",
    }
    assert diagnostics["vec_candidates_count"] == 2
    assert diagnostics["fts_candidates_count"] == 1
    assert diagnostics["overlap_count"] == 1
    assert diagnostics["post_dedup_count"] == 2


def test_reranker_fallback_recorded(tmp_path: Path, monkeypatch: Any) -> None:
    db_path = tmp_path / "target_sqlite.db"
    conn = sqlite3.connect(db_path)
    monkeypatch.setattr(query_module.config, "hybrid_enabled", True)
    monkeypatch.setattr(query_module.config, "rerank_enabled", True)
    monkeypatch.setattr(query_module.config, "rerank_top_k", 20)
    monkeypatch.setattr(query_module.config, "rerank_model", "test-reranker")
    monkeypatch.setattr(query_module.config, "hybrid_rrf_k", 60)
    monkeypatch.setattr(query_module.config, "hybrid_vector_weight", 0.9)
    monkeypatch.setattr(query_module.config, "hybrid_fts5_weight", 0.5)
    monkeypatch.setattr(query_module, "_hybrid_vector_rows", lambda *_args: [_vector_row(1, "src/a.py", 0.1)])
    monkeypatch.setattr(query_module, "query_fts", lambda *_args, **_kwargs: [])

    def _fallback(_query: str, candidates: list[Any], **kwargs: Any) -> list[Any]:
        kwargs["diagnostics"].record_reranker_fallback("model_error")
        return candidates

    monkeypatch.setattr(query_module.reranker, "rerank", _fallback)

    results = asyncio.run(query_codebase("query", db_path, FakeEnv(conn), limit=1))

    assert results.diagnostics.reranker_fallback_used is True
    assert results.diagnostics.reranker_fallback_reason == "model_error"


def test_overlap_count_correct() -> None:
    diagnostics = RetrievalDiagnostics()
    vector_ids = {1, 2, 3}
    fts_ids = {3, 4}
    diagnostics.record_stage("overlap_count", len(vector_ids & fts_ids))
    assert diagnostics.overlap_count == 1


def test_boost_flip_count() -> None:
    fused_rows = [
        FusedRow(1, 0.20, 1, None, 1.0, None),
        FusedRow(2, 0.19, 2, None, 0.9, None),
    ]
    records_by_id = {
        1: _record(1, "docs/readme.md", "docs"),
        2: _record(2, "src/impl.py", "implementation"),
    }

    assert (
        _count_hybrid_boost_flips(
            fused_rows,
            records_by_id,
            query="implementation handler",
            canonical_paths=[],
            top_k=2,
        )
        == 2
    )
