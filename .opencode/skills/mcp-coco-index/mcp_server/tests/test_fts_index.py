#!/usr/bin/env python3
"""Tests for SQLite FTS5 indexing and hybrid RRF fusion."""

from __future__ import annotations

import asyncio
import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Any

import numpy as np

from cocoindex_code import query as query_module
from cocoindex_code.fts_index import (
    FtsChunkRow,
    ensure_fts_table,
    populate_fts,
    query_fts,
    sync_fts_from_code_chunks,
    _normalize_fts_query,
)
from cocoindex_code.fusion import RankedRow, rrf_fuse
from cocoindex_code.query import query_codebase
from cocoindex_code.settings import PROJECT_SETTINGS
from cocoindex_code.shared import EMBEDDER, SQLITE_DB


class FakeDb:
    def __init__(self, conn: sqlite3.Connection) -> None:
        self.conn = conn

    @contextmanager
    def readonly(self) -> Any:
        yield self.conn


class FakeEmbedder:
    def __init__(self) -> None:
        self.queries: list[str] = []

    async def embed(self, query: str, prompt_name: str | None = None) -> np.ndarray:
        self.queries.append(query)
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


def _create_chunk_table(conn: sqlite3.Connection) -> None:
    conn.execute(
        """
        CREATE TABLE code_chunks_vec(
            id INTEGER PRIMARY KEY,
            file_path TEXT,
            source_realpath TEXT,
            language TEXT,
            content TEXT,
            content_hash TEXT,
            path_class TEXT,
            start_line INTEGER,
            end_line INTEGER
        )
        """
    )


def _insert_chunk(
    conn: sqlite3.Connection,
    chunk_id: int,
    content: str,
    file_path: str = "src/example.py",
    language: str = "python",
    path_class: str = "implementation",
) -> None:
    conn.execute(
        """
        INSERT INTO code_chunks_vec(
            id, file_path, source_realpath, language, content, content_hash,
            path_class, start_line, end_line
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            chunk_id,
            file_path,
            f"/real/{file_path}",
            language,
            content,
            f"hash-{chunk_id}",
            path_class,
            chunk_id,
            chunk_id + 1,
        ),
    )


def test_fts_table_created_on_first_index(tmp_path: Path) -> None:
    conn = sqlite3.connect(tmp_path / "index.db")
    ensure_fts_table(conn)

    row = conn.execute(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'code_chunks_fts'"
    ).fetchone()

    assert row == ("code_chunks_fts",)


def test_fts_populated_with_chunks(tmp_path: Path) -> None:
    conn = sqlite3.connect(tmp_path / "index.db")
    populate_fts(
        conn,
        [
            FtsChunkRow(
                chunk_id=1,
                content="def authenticate_user(token): pass",
                file_path="src/auth.py",
                language="python",
            )
        ],
    )

    count = conn.execute("SELECT count(*) FROM code_chunks_fts").fetchone()[0]

    assert count == 1


def test_fts_query_returns_ranked_bm25(tmp_path: Path) -> None:
    conn = sqlite3.connect(tmp_path / "index.db")
    populate_fts(
        conn,
        [
            (1, "auth token validation auth", "src/auth.py", "python"),
            (2, "render dashboard", "src/ui.ts", "typescript"),
        ],
    )

    rows = query_fts(conn, "auth token", 5)

    assert rows[0][0] == 1
    assert rows[0][1] > 0


def test_fts_query_normalization_escapes_embedded_quotes() -> None:
    assert _normalize_fts_query('auth"token path') == '"auth""token" OR "path"'


def test_fts_query_accepts_expanded_match_clause(tmp_path: Path) -> None:
    conn = sqlite3.connect(tmp_path / "index.db")
    populate_fts(
        conn,
        [
            (1, "def memory_save_context(): pass", "src/memory.py", "python"),
            (2, "def unrelated(): pass", "src/other.py", "python"),
        ],
    )

    rows = query_fts(
        conn,
        "ignored",
        5,
        match_clause='"memory" OR "save" OR "memorySave" OR "memory_save"',
    )

    assert rows[0][0] == 1


def test_rrf_fuse_combines_two_ranked_lists() -> None:
    fused = rrf_fuse(
        [RankedRow(chunk_id=1, score=0.9), RankedRow(chunk_id=2, score=0.8)],
        [RankedRow(chunk_id=2, score=4.0), RankedRow(chunk_id=3, score=2.0)],
        k=60,
        vector_weight=0.7,
        fts_weight=0.7,
    )

    assert [row.chunk_id for row in fused] == [2, 1, 3]
    assert fused[0].vector_rank == 2
    assert fused[0].fts_rank == 1


def test_query_codebase_hybrid_off_unchanged(
    tmp_path: Path,
    monkeypatch: Any,
) -> None:
    db_path = tmp_path / "target_sqlite.db"
    conn = sqlite3.connect(db_path)
    monkeypatch.setattr(query_module.config, "hybrid_enabled", False)
    monkeypatch.setattr(query_module.config, "query_expansion", False)
    monkeypatch.setattr(
        query_module,
        "_knn_query",
        lambda *_args: [
            (
                "src/auth.py",
                "/real/src/auth.py",
                "python",
                "def authenticate_user(): pass",
                "hash-1",
                "implementation",
                1,
                2,
                0.2,
            )
        ],
    )

    results = asyncio.run(
        query_codebase("authenticate implementation", db_path, FakeEnv(conn), limit=1)
    )

    assert len(results) == 1
    assert results[0].rrf_score is None
    assert results[0].fts5_score is None
    assert "hybrid_rrf" not in results[0].rankingSignals


def test_query_codebase_hybrid_on_returns_fused(
    tmp_path: Path,
    monkeypatch: Any,
) -> None:
    db_path = tmp_path / "target_sqlite.db"
    conn = sqlite3.connect(db_path)
    _create_chunk_table(conn)
    _insert_chunk(conn, 1, "def semantic_match(): pass")
    _insert_chunk(conn, 2, "def authenticate_user(token): return token")
    sync_fts_from_code_chunks(conn)
    monkeypatch.setattr(query_module.config, "hybrid_enabled", True)
    monkeypatch.setattr(query_module.config, "query_expansion", False)
    monkeypatch.setattr(query_module.config, "hybrid_rrf_k", 60)
    monkeypatch.setattr(query_module.config, "hybrid_vector_weight", 0.7)
    monkeypatch.setattr(query_module.config, "hybrid_fts5_weight", 0.7)
    monkeypatch.setattr(
        query_module,
        "_hybrid_vector_rows",
        lambda *_args: [
            (
                1,
                "src/example.py",
                "/real/src/example.py",
                "python",
                "def semantic_match(): pass",
                "hash-1",
                "implementation",
                1,
                2,
                0.1,
            )
        ],
    )

    results = asyncio.run(query_codebase("authenticate token", db_path, FakeEnv(conn), limit=2))

    assert {result.file_path for result in results} == {"src/example.py"}
    assert any("hybrid_rrf" in result.rankingSignals for result in results)
    assert any(result.rrf_score is not None for result in results)
    assert any(result.fts5_score is not None for result in results)


def test_query_codebase_hybrid_query_expansion_fans_out_dense_and_fts(
    tmp_path: Path,
    monkeypatch: Any,
) -> None:
    db_path = tmp_path / "target_sqlite.db"
    conn = sqlite3.connect(db_path)
    _create_chunk_table(conn)
    _insert_chunk(conn, 1, "def memory_save_context(): pass")
    sync_fts_from_code_chunks(conn)
    monkeypatch.setattr(query_module.config, "hybrid_enabled", True)
    monkeypatch.setattr(query_module.config, "query_expansion", True)
    monkeypatch.setattr(query_module.config, "query_expansion_max_variants", 4)
    monkeypatch.setattr(query_module.config, "query_expansion_synonyms", {"save": ["persist"]})
    monkeypatch.setattr(query_module.config, "query_expansion_dense_fanout", True)
    monkeypatch.setattr(query_module.config, "hybrid_rrf_k", 60)
    monkeypatch.setattr(query_module.config, "hybrid_vector_weight", 0.7)
    monkeypatch.setattr(query_module.config, "hybrid_fts5_weight", 0.7)

    seen_match_clauses: list[str | None] = []

    def fake_query_fts(*args: Any, **kwargs: Any) -> list[tuple[int, float]]:
        seen_match_clauses.append(kwargs.get("match_clause"))
        return [(1, 1.0)]

    monkeypatch.setattr(query_module, "query_fts", fake_query_fts)
    monkeypatch.setattr(
        query_module,
        "_hybrid_vector_rows",
        lambda *_args: [
            (
                1,
                "src/memory.py",
                "/real/src/memory.py",
                "python",
                "def memory_save_context(): pass",
                "hash-1",
                "implementation",
                1,
                2,
                0.1,
            )
        ],
    )
    env = FakeEnv(conn)

    results = asyncio.run(query_codebase("memory save", db_path, env, limit=1))

    assert len(results) == 1
    assert env.embedder.queries == ["memory save", "memory persist", "memorySave", "memory_save"]
    assert seen_match_clauses
    assert '"memorySave"' in str(seen_match_clauses[0])
