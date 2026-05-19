"""Prompt-policy contract tests for indexing and search embedding."""

from __future__ import annotations

import asyncio
import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Any

import numpy as np

from cocoindex_code import query as query_module
from cocoindex_code.query import query_codebase
from cocoindex_code.settings import PROJECT_SETTINGS
from cocoindex_code.shared import (
    EMBEDDER,
    QUERY_PROMPT_NAME,
    SQLITE_DB,
    resolve_document_prompt_name,
    resolve_query_prompt_name,
)


class FakeDb:
    def __init__(self, conn: sqlite3.Connection) -> None:
        self.conn = conn

    @contextmanager
    def readonly(self) -> Any:
        yield self.conn


class RecordingEmbedder:
    def __init__(self) -> None:
        self.calls: list[tuple[str, str | None]] = []

    async def embed(self, query: str, prompt_name: str | None = None) -> np.ndarray:
        self.calls.append((query, prompt_name))
        return np.array([0.1, 0.2], dtype=np.float32)


class FakeProjectSettings:
    canonical_resource_paths: list[str] = []


class FakeEnv:
    def __init__(self, conn: sqlite3.Connection, embedder: RecordingEmbedder) -> None:
        self.db = FakeDb(conn)
        self.embedder = embedder
        self.project_settings = FakeProjectSettings()

    def get_context(self, key: Any) -> Any:
        if key is SQLITE_DB:
            return self.db
        if key is EMBEDDER:
            return self.embedder
        if key is QUERY_PROMPT_NAME:
            return "query"
        if key is PROJECT_SETTINGS:
            return self.project_settings
        raise KeyError(key)


def _vector_row(chunk_id: int, file_path: str, distance: float) -> tuple[Any, ...]:
    return (
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


def test_document_prompt_used_at_index_time() -> None:
    source = Path("cocoindex_code/indexer.py").read_text()

    assert "DOCUMENT_PROMPT_NAME" in source
    assert "embedder.embed(chunk.text, document_prompt_name)" in source


def test_query_prompt_used_at_search_time(tmp_path: Path, monkeypatch: Any) -> None:
    db_path = tmp_path / "target_sqlite.db"
    conn = sqlite3.connect(db_path)
    embedder = RecordingEmbedder()

    monkeypatch.setattr(query_module.config, "hybrid_enabled", False)
    monkeypatch.setattr(
        query_module,
        "_knn_query",
        lambda *_args, **_kwargs: [_vector_row(1, "src/first.py", 0.1)],
    )

    results = asyncio.run(
        query_codebase("implementation query", db_path, FakeEnv(conn, embedder), limit=1)
    )

    assert len(results) == 1
    assert embedder.calls == [("implementation query", "query")]


def test_nomic_uses_query_prefix() -> None:
    assert resolve_query_prompt_name("nomic-ai/CodeRankEmbed") == "query"
    assert resolve_document_prompt_name("nomic-ai/CodeRankEmbed") is None


def test_gemma_uses_instruction_retrieval_prefix() -> None:
    assert resolve_query_prompt_name("google/embeddinggemma-300m") == "InstructionRetrieval"
    assert resolve_document_prompt_name("google/embeddinggemma-300m") == "InstructionRetrieval"
