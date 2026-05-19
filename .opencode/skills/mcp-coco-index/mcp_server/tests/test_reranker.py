"""Tests for optional cross-encoder reranker integration."""

from __future__ import annotations

import asyncio
import sqlite3
import sys
from contextlib import contextmanager
from pathlib import Path
from typing import Any
from unittest.mock import patch

import numpy as np

from cocoindex_code import query as query_module
from cocoindex_code.config import (
    _DEFAULT_RERANK_MODEL,
    _DEFAULT_RERANK_TOP_K,
    Config,
)
from cocoindex_code.query import query_codebase
from cocoindex_code.reranker import RerankerAdapter
from cocoindex_code.schema import QueryResult
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


class FakeCrossEncoder:
    def predict(self, pairs: list[tuple[str, str]]) -> list[float]:
        return [0.1 + index for index, _pair in enumerate(pairs)]


def _candidate(
    file_path: str,
    score: float,
    content: str = "def example(): pass",
) -> QueryResult:
    return QueryResult(
        file_path=file_path,
        language="python",
        content=content,
        start_line=1,
        end_line=2,
        score=score,
        raw_score=score,
        path_class="implementation",
        rankingSignals=[],
    )


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


def test_reranker_module_imports() -> None:
    from cocoindex_code import reranker

    assert reranker.RerankerAdapter is RerankerAdapter


def test_rerank_handles_empty_candidates() -> None:
    adapter = RerankerAdapter()

    assert adapter.rerank("query", [], top_k=20) == []


def test_rerank_falls_back_on_model_load_failure(
    caplog: Any,
    monkeypatch: Any,
) -> None:
    adapter = RerankerAdapter()
    candidates = [_candidate("a.py", 0.9), _candidate("b.py", 0.8)]
    monkeypatch.setattr("cocoindex_code.reranker._available_ram_bytes", lambda: 8 * 1024**3)

    caplog.set_level("WARNING", logger="cocoindex_code.reranker")
    with patch.dict(sys.modules, {"sentence_transformers": None}):
        reranked = adapter.rerank("query", candidates, top_k=20)

    assert reranked is candidates
    assert [candidate.file_path for candidate in reranked] == ["a.py", "b.py"]
    assert "Failed to load cross-encoder reranker" in caplog.text


def test_rerank_replaces_score_and_preserves_pre_rerank_score(monkeypatch: Any) -> None:
    adapter = RerankerAdapter()
    monkeypatch.setattr(adapter, "_load_model", lambda: FakeCrossEncoder())
    candidates = [_candidate("a.py", 0.9), _candidate("b.py", 0.8)]

    reranked = adapter.rerank("query", candidates, top_k=20)

    assert [candidate.file_path for candidate in reranked] == ["b.py", "a.py"]
    assert reranked[0].score == 1.1
    assert reranked[0].reranker_score == 1.1
    assert reranked[0].pre_rerank_score == 0.8
    assert "cross_encoder_rerank" in reranked[0].rankingSignals


def test_config_rerank_defaults(tmp_path: Path) -> None:
    with patch.dict(
        "os.environ",
        {"COCOINDEX_CODE_ROOT_PATH": str(tmp_path)},
        clear=True,
    ):
        cfg = Config.from_env()

    assert cfg.rerank_enabled is True
    assert cfg.rerank_model == _DEFAULT_RERANK_MODEL
    assert cfg.rerank_top_k == _DEFAULT_RERANK_TOP_K == 20


def test_query_codebase_rerank_off_unchanged(
    tmp_path: Path,
    monkeypatch: Any,
) -> None:
    db_path = tmp_path / "target_sqlite.db"
    conn = sqlite3.connect(db_path)
    monkeypatch.setattr(query_module.config, "hybrid_enabled", True)
    monkeypatch.setattr(query_module.config, "rerank_enabled", False)
    monkeypatch.setattr(query_module.config, "hybrid_rrf_k", 60)
    monkeypatch.setattr(query_module.config, "hybrid_vector_weight", 0.7)
    monkeypatch.setattr(query_module.config, "hybrid_fts5_weight", 0.7)
    monkeypatch.setattr(
        query_module,
        "_hybrid_vector_rows",
        lambda *_args: [
            _vector_row(1, "src/first.py", 0.1),
            _vector_row(2, "src/second.py", 0.2),
        ],
    )
    monkeypatch.setattr(query_module, "query_fts", lambda *_args, **_kwargs: [])

    results = asyncio.run(query_codebase("query", db_path, FakeEnv(conn), limit=2))

    assert [result.file_path for result in results] == ["src/first.py", "src/second.py"]
    assert all(result.pre_rerank_score is None for result in results)
    assert all(result.reranker_score is None for result in results)


def test_query_codebase_rerank_on_changes_order(
    tmp_path: Path,
    monkeypatch: Any,
) -> None:
    db_path = tmp_path / "target_sqlite.db"
    conn = sqlite3.connect(db_path)
    monkeypatch.setattr(query_module.config, "hybrid_enabled", True)
    monkeypatch.setattr(query_module.config, "rerank_enabled", True)
    monkeypatch.setattr(query_module.config, "rerank_top_k", 20)
    monkeypatch.setattr(query_module.config, "rerank_model", _DEFAULT_RERANK_MODEL)
    monkeypatch.setattr(query_module.config, "hybrid_rrf_k", 60)
    monkeypatch.setattr(query_module.config, "hybrid_vector_weight", 0.7)
    monkeypatch.setattr(query_module.config, "hybrid_fts5_weight", 0.7)
    monkeypatch.setattr(
        query_module,
        "_hybrid_vector_rows",
        lambda *_args: [
            _vector_row(1, "src/first.py", 0.1),
            _vector_row(2, "src/second.py", 0.2),
        ],
    )
    monkeypatch.setattr(query_module, "query_fts", lambda *_args, **_kwargs: [])
    monkeypatch.setattr(
        query_module.reranker,
        "rerank",
        lambda _query, candidates, **_kwargs: list(reversed(candidates)),
    )

    results = asyncio.run(query_codebase("query", db_path, FakeEnv(conn), limit=1))

    assert results[0].file_path == "src/second.py"


# ───────────────────────────────────────────────────────────────────
# ADR-015 Phase 2: path-class boost + jina-v3 dispatch
# ───────────────────────────────────────────────────────────────────


def _path_class_candidate(
    file_path: str,
    score: float,
    path_class: str,
) -> QueryResult:
    """Build a QueryResult with an explicit path_class for boost tests."""
    return QueryResult(
        file_path=file_path,
        language="python",
        content="def example(): pass",
        start_line=1,
        end_line=2,
        score=score,
        raw_score=score,
        path_class=path_class,
        rankingSignals=[],
    )


def test_rerank_adapter_dispatch_jina_prefix(monkeypatch: Any) -> None:
    """get_reranker_adapter() routes jinaai/jina-reranker-v3* model names to the jina adapter."""
    from cocoindex_code import reranker as reranker_module

    # Reset adapter cache so the dispatch path runs fresh
    monkeypatch.setattr(reranker_module, "_ADAPTERS", {})

    # Stub the lazy-imported JinaRerankerAdapter so we don't actually load transformers
    class FakeJinaAdapter:
        def __init__(self, model_name: str) -> None:
            self.model_name = model_name

    fake_module = type(sys)("cocoindex_code.rerankers_jina_v3")
    fake_module.JinaRerankerAdapter = FakeJinaAdapter  # type: ignore[attr-defined]
    monkeypatch.setitem(sys.modules, "cocoindex_code.rerankers_jina_v3", fake_module)

    adapter = reranker_module.get_reranker_adapter("jinaai/jina-reranker-v3")
    assert isinstance(adapter, FakeJinaAdapter)
    assert adapter.model_name == "jinaai/jina-reranker-v3"

    # BGE path still routes to CrossEncoderRerankerAdapter
    monkeypatch.setattr(reranker_module, "_ADAPTERS", {})
    bge_adapter = reranker_module.get_reranker_adapter("BAAI/bge-reranker-v2-m3")
    assert isinstance(bge_adapter, reranker_module.CrossEncoderRerankerAdapter)


def test_rerank_path_class_boost_applied(monkeypatch: Any) -> None:
    """When COCOINDEX_RERANK_PATH_CLASS_BOOST=1, scores get per-path-class multipliers."""
    adapter = RerankerAdapter()

    class UniformScoreEncoder:
        def predict(self, pairs: list[tuple[str, str]]) -> list[float]:
            return [1.0 for _ in pairs]

    monkeypatch.setattr(adapter, "_load_model", lambda: UniformScoreEncoder())
    monkeypatch.setenv("COCOINDEX_RERANK_PATH_CLASS_BOOST", "1")
    # Don't set FACTORS env var — use built-in defaults

    candidates = [
        _path_class_candidate("src/impl.py", 0.9, "implementation"),
        _path_class_candidate("tests/test_impl.py", 0.85, "tests"),
        _path_class_candidate("vendor/lib.py", 0.8, "vendor"),
    ]

    reranked = adapter.rerank("query", candidates, top_k=20)

    # Defaults: implementation=1.00, tests=0.85, vendor=0.70 → boosted scores [1.00, 0.85, 0.70]
    # Sort order should be: impl > tests > vendor
    assert [c.file_path for c in reranked] == ["src/impl.py", "tests/test_impl.py", "vendor/lib.py"]
    assert reranked[0].reranker_score == 1.00
    assert abs(reranked[1].reranker_score - 0.85) < 1e-9
    assert abs(reranked[2].reranker_score - 0.70) < 1e-9


def test_rerank_path_class_boost_disabled_when_flag_off(monkeypatch: Any) -> None:
    """With the boost flag unset, scores are untouched even when factors env is present."""
    adapter = RerankerAdapter()

    class UniformScoreEncoder:
        def predict(self, pairs: list[tuple[str, str]]) -> list[float]:
            return [1.0 for _ in pairs]

    monkeypatch.setattr(adapter, "_load_model", lambda: UniformScoreEncoder())
    monkeypatch.delenv("COCOINDEX_RERANK_PATH_CLASS_BOOST", raising=False)
    # Factors env var set but flag is off → must be ignored
    monkeypatch.setenv(
        "COCOINDEX_RERANK_PATH_CLASS_FACTORS",
        '{"implementation": 0.5, "tests": 2.0}',
    )

    candidates = [
        _path_class_candidate("src/impl.py", 0.9, "implementation"),
        _path_class_candidate("tests/test_impl.py", 0.85, "tests"),
    ]

    reranked = adapter.rerank("query", candidates, top_k=20)

    # No boost applied → all scores stay at 1.0 → tie-break preserves original order
    assert all(c.reranker_score == 1.0 for c in reranked)


def test_path_class_factor_parse_is_cached(monkeypatch: Any, caplog: Any) -> None:
    from cocoindex_code import reranker as reranker_module

    monkeypatch.setattr(reranker_module, "_PATH_CLASS_FACTORS_CACHE", None)
    monkeypatch.setenv("COCOINDEX_RERANK_PATH_CLASS_BOOST", "1")
    monkeypatch.setenv("COCOINDEX_RERANK_PATH_CLASS_FACTORS", "{bad-json")
    caplog.set_level("WARNING", logger="cocoindex_code.config")
    candidates = [
        _path_class_candidate("src/impl.py", 0.9, "implementation"),
        _path_class_candidate("tests/test_impl.py", 0.8, "tests"),
    ]

    first = reranker_module._apply_path_class_boost([1.0, 1.0], candidates)
    second = reranker_module._apply_path_class_boost([1.0, 1.0], candidates)

    assert first == [1.0, 0.85]
    assert second == [1.0, 0.85]
    assert caplog.text.count("Ignoring invalid COCOINDEX_RERANK_PATH_CLASS_FACTORS") == 1
