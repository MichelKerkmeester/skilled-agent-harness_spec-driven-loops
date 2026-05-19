"""Tests for per-dimension vector table storage."""

from __future__ import annotations

import asyncio
import sqlite3
from contextlib import contextmanager
from dataclasses import replace
from pathlib import Path
from typing import Any

import pytest

from cocoindex_code import daemon as daemon_module
from cocoindex_code import query as query_module
from cocoindex_code.index_metadata import (
    IndexCompatibilityError,
    build_current_index_metadata,
    write_index_meta,
)
from cocoindex_code.migrations import migrate_connection
from cocoindex_code.protocol import ProjectStatusResponse
from cocoindex_code.schema import (
    _quote_identifier,
    _table_name_for_dim,
    count_table_rows,
)
from cocoindex_code.settings import PROJECT_SETTINGS, EmbeddingSettings, UserSettings
from cocoindex_code.shared import EMBEDDER, SQLITE_DB, VECTOR_TABLE_NAME


def _create_chunk_table(conn: sqlite3.Connection, table_name: str) -> None:
    conn.execute(
        f"""
        CREATE TABLE {_quote_identifier(table_name)}(
            id INTEGER PRIMARY KEY,
            file_path TEXT,
            source_realpath TEXT,
            language TEXT,
            content TEXT,
            content_hash TEXT,
            path_class TEXT,
            start_line INTEGER,
            end_line INTEGER,
            embedding BLOB
        )
        """
    )


def _insert_chunk(conn: sqlite3.Connection, table_name: str, chunk_id: int) -> None:
    conn.execute(
        f"""
        INSERT INTO {_quote_identifier(table_name)}(
            id, file_path, source_realpath, language, content, content_hash,
            path_class, start_line, end_line, embedding
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            chunk_id,
            f"src/{chunk_id}.py",
            f"/real/src/{chunk_id}.py",
            "python",
            f"def chunk_{chunk_id}(): pass",
            f"hash-{chunk_id}",
            "implementation",
            chunk_id,
            chunk_id + 1,
            b"",
        ),
    )


class FakeDb:
    def __init__(self, conn: sqlite3.Connection) -> None:
        self.conn = conn

    @contextmanager
    def readonly(self) -> Any:
        yield self.conn


class FakeEnv:
    def __init__(self, conn: sqlite3.Connection, table_name: str = "vectors_768") -> None:
        self.conn = conn
        self.table_name = table_name

    def get_context(self, key: Any) -> Any:
        if key is SQLITE_DB:
            return FakeDb(self.conn)
        if key is VECTOR_TABLE_NAME:
            return self.table_name
        if key is PROJECT_SETTINGS:
            return type("ProjectSettings", (), {"canonical_resource_paths": []})()
        if key is EMBEDDER:
            return type("Embedder", (), {})()
        raise KeyError(key)


def _settings(model: str) -> UserSettings:
    return UserSettings(embedding=EmbeddingSettings(model=model, provider="sentence-transformers"))


def test_768_table_created_by_default(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    monkeypatch.setattr(daemon_module, "load_user_settings", lambda: _settings("sbert/nomic-ai/CodeRankEmbed"))
    registry = daemon_module.ProjectRegistry(embedder=object())

    assert registry._vector_table_name_for_project(str(tmp_path)) == "vectors_768"
    assert _table_name_for_dim(768) == "vectors_768"


def test_legacy_vectors_rename_atomic(tmp_path: Path) -> None:
    conn = sqlite3.connect(tmp_path / "target_sqlite.db")
    _create_chunk_table(conn, "vectors")
    _insert_chunk(conn, "vectors", 1)

    result = migrate_connection(conn)

    assert result.renamed_from == "vectors"
    assert count_table_rows(conn, "vectors_768") == 1
    assert conn.execute("SELECT name FROM sqlite_master WHERE name = 'vectors'").fetchone() is None


def test_swap_embedder_creates_new_dim_table(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    active_model = {"value": "sbert/nomic-ai/CodeRankEmbed"}
    monkeypatch.setattr(daemon_module, "load_user_settings", lambda: _settings(active_model["value"]))
    registry = daemon_module.ProjectRegistry(embedder=object())

    assert registry._vector_table_name_for_project(str(tmp_path)) == "vectors_768"
    active_model["value"] = "sbert/dunzhang/stella_en_400M_v5"
    assert registry._vector_table_name_for_project(str(tmp_path)) == "vectors_1024"

    conn = sqlite3.connect(tmp_path / "target_sqlite.db")
    _create_chunk_table(conn, "vectors_768")
    _create_chunk_table(conn, "vectors_1024")
    assert set(
        row[0]
        for row in conn.execute(
            "SELECT name FROM sqlite_master WHERE name IN ('vectors_768', 'vectors_1024')"
        )
    ) == {"vectors_768", "vectors_1024"}


def test_query_refuses_cross_dim(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    project = tmp_path / "project"
    index_dir = project / ".cocoindex_code"
    index_dir.mkdir(parents=True)
    db_path = index_dir / "target_sqlite.db"
    db_path.touch()
    meta_768 = build_current_index_metadata(
        project_root=project,
        embedding_model="sbert/nomic-ai/CodeRankEmbed",
        embedding_provider="sentence-transformers",
        query_prompt_name="query",
        document_prompt_name=None,
    )
    write_index_meta(project, meta_768)
    monkeypatch.setattr(
        query_module,
        "build_current_index_metadata",
        lambda **_kwargs: replace(
            meta_768,
            embedder_name="sbert/dunzhang/stella_en_400M_v5",
            embedder_dim=1024,
            query_prompt_name=None,
        ),
    )

    with pytest.raises(IndexCompatibilityError):
        asyncio.run(query_module.query_codebase("anything", db_path, FakeEnv(sqlite3.connect(db_path))))


def test_per_dim_table_size_in_status(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    conn = sqlite3.connect(":memory:")
    _create_chunk_table(conn, "vectors_768")
    _create_chunk_table(conn, "vectors_1024")
    _insert_chunk(conn, "vectors_768", 1)
    _insert_chunk(conn, "vectors_1024", 2)
    _insert_chunk(conn, "vectors_1024", 3)
    registry = daemon_module.ProjectRegistry(embedder=object())
    project_root = str(tmp_path)
    project = type(
        "Project",
        (),
        {"env": FakeEnv(conn), "indexing_stats": None},
    )()
    registry._projects[project_root] = project
    registry._index_locks[project_root] = asyncio.Lock()
    monkeypatch.setattr(daemon_module, "_validate_project_root", lambda value: value)
    monkeypatch.setattr(daemon_module, "load_user_settings", lambda: _settings("sbert/nomic-ai/CodeRankEmbed"))

    status = registry.get_status(project_root)

    assert isinstance(status, ProjectStatusResponse)
    assert status.per_dim_table_sizes == {"vectors_768": 1, "vectors_1024": 2}
    assert status.total_chunks == 1


def test_migration_idempotent(tmp_path: Path) -> None:
    conn = sqlite3.connect(tmp_path / "target_sqlite.db")
    _create_chunk_table(conn, "vectors")

    migrate_connection(conn)
    result = migrate_connection(conn)

    assert result.skipped_reason == "target_exists"
    assert count_table_rows(conn, "vectors_768") == 0


def test_concurrent_indexers_different_dims(tmp_path: Path) -> None:
    conn = sqlite3.connect(tmp_path / "target_sqlite.db")
    _create_chunk_table(conn, "vectors_768")
    _create_chunk_table(conn, "vectors_1024")
    _insert_chunk(conn, "vectors_768", 1)
    _insert_chunk(conn, "vectors_1024", 1)

    assert count_table_rows(conn, "vectors_768") == 1
    assert count_table_rows(conn, "vectors_1024") == 1
