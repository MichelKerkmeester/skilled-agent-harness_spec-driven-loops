"""Tests for search request budget enforcement."""

from __future__ import annotations

import asyncio
import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Any

import numpy as np
import pytest

from cocoindex_code.retrieval import query as query_module
from cocoindex_code.retrieval.search_budget import (
    SearchBudgetExceeded,
    validate_search_budget,
)
from cocoindex_code.config.settings import PROJECT_SETTINGS
from cocoindex_code.core.shared import EMBEDDER, SQLITE_DB


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


def test_offset_cap_enforced() -> None:
    with pytest.raises(SearchBudgetExceeded) as exc_info:
        validate_search_budget(limit=10, offset=20001)

    assert exc_info.value.budget_field == "offset"


def test_limit_cap_enforced() -> None:
    with pytest.raises(SearchBudgetExceeded) as exc_info:
        validate_search_budget(limit=201, offset=0)

    assert exc_info.value.budget_field == "limit"


def test_fetch_k_clamped(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    db_path = tmp_path / "target_sqlite.db"
    db_path.touch()
    conn = sqlite3.connect(db_path)
    seen_k: list[int] = []

    def fake_knn_query(*args: Any) -> list[tuple[Any, ...]]:
        seen_k.append(args[2])
        return [
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
        ]

    monkeypatch.setattr(query_module.config, "hybrid_enabled", False)
    monkeypatch.setattr(query_module.config, "query_expansion", False)
    monkeypatch.setattr(query_module.config, "search_max_fetch_k", 4000)
    monkeypatch.setattr(query_module, "_knn_query", fake_knn_query)

    asyncio.run(
        query_module.query_codebase(
            "authenticate implementation",
            db_path,
            FakeEnv(conn),
            limit=200,
            offset=1000,
        )
    )

    assert seen_k == [4000]


def test_language_fanout_capped(caplog: pytest.LogCaptureFixture) -> None:
    caplog.set_level("WARNING", logger="cocoindex_code.search_budget")
    languages = [f"lang{idx}" for idx in range(9)]

    budgeted = validate_search_budget(limit=10, offset=0, languages=languages)

    assert budgeted.languages == languages[:8]
    assert "Clamping search language fanout from 9 to 8" in caplog.text


def test_path_fullscan_refused_by_default() -> None:
    with pytest.raises(SearchBudgetExceeded) as exc_info:
        validate_search_budget(limit=10, offset=0, paths=["*"])

    assert exc_info.value.budget_field == "paths"


def test_path_fullscan_allowed_when_forced(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("COCOINDEX_SEARCH_PATH_FULLSCAN_ALLOWED", "true")

    budgeted = validate_search_budget(limit=10, offset=0, paths=["*"])

    assert budgeted.paths == ["*"]


def test_budget_validator_runs_before_db_hit(tmp_path: Path) -> None:
    db_path = tmp_path / "target_sqlite.db"
    db_path.touch()
    conn = sqlite3.connect(db_path)
    env = FakeEnv(conn)

    with pytest.raises(SearchBudgetExceeded) as exc_info:
        asyncio.run(
            query_module.query_codebase(
                "authenticate implementation",
                db_path,
                env,
                limit=10,
                offset=20001,
            )
        )

    assert exc_info.value.budget_field == "offset"
    assert env.embedder.queries == []


def test_search_budget_structured_error_fields() -> None:
    err = SearchBudgetExceeded(
        budget_field="offset",
        actual=20001,
        limit=1000,
        suggestion="Use a smaller offset.",
    )

    assert err.as_dict() == {
        "budget_field": "offset",
        "actual": 20001,
        "limit": 1000,
        "suggestion": "Use a smaller offset.",
    }
