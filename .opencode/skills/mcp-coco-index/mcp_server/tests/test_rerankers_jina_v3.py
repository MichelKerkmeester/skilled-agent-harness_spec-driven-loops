"""Smoke tests for the production jina-reranker-v3 adapter.

Verifies the native-rerank-API integration without loading the actual transformers
model. Mocks the model.rerank() method to return synthetic score dicts.
"""

from __future__ import annotations

import logging
from typing import Any
from unittest.mock import MagicMock

import pytest

from cocoindex_code.rerankers.rerankers_jina_v3 import JinaRerankerAdapter
from cocoindex_code.indexer.schema import QueryResult


def _candidate(file_path: str, score: float, content: str = "def f(): pass") -> QueryResult:
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


def _path_candidate(file_path: str, score: float, path_class: str) -> QueryResult:
    candidate = _candidate(file_path, score)
    return QueryResult(
        file_path=candidate.file_path,
        language=candidate.language,
        content=candidate.content,
        start_line=candidate.start_line,
        end_line=candidate.end_line,
        score=candidate.score,
        raw_score=candidate.raw_score,
        path_class=path_class,
        rankingSignals=candidate.rankingSignals,
    )


def test_jina_adapter_handles_empty_candidates() -> None:
    adapter = JinaRerankerAdapter()
    assert adapter.rerank("query", [], top_k=20) == []


def test_jina_adapter_returns_input_on_load_failure(monkeypatch: Any) -> None:
    """If transformers/JinaForRanking fails to load, the adapter returns candidates unchanged."""
    adapter = JinaRerankerAdapter()
    candidates = [_candidate("a.py", 0.9), _candidate("b.py", 0.8)]
    monkeypatch.setattr(adapter, "_load_model", lambda: None)

    reranked = adapter.rerank("query", candidates, top_k=20)
    assert reranked is candidates


def test_jina_adapter_maps_native_scores_back_to_input_order(monkeypatch: Any) -> None:
    """The native rerank() returns results sorted by score; we must map back to input order."""
    adapter = JinaRerankerAdapter()

    # Mock model: native rerank() returns native-API shape (sorted descending by score)
    fake_model = MagicMock()

    def _fake_rerank(query: str, documents: list[str]) -> list[dict]:
        # Suppose doc index=2 is most relevant, then index=0, then index=1
        return [
            {"document": documents[2], "relevance_score": 0.9, "index": 2},
            {"document": documents[0], "relevance_score": 0.5, "index": 0},
            {"document": documents[1], "relevance_score": 0.1, "index": 1},
        ]

    fake_model.rerank = _fake_rerank
    adapter._model = fake_model
    adapter._device = "cpu"

    candidates = [
        _candidate("a.py", 0.5, content="content of a"),
        _candidate("b.py", 0.5, content="content of b"),
        _candidate("c.py", 0.5, content="content of c"),
    ]

    reranked = adapter.rerank("query", candidates, top_k=20)

    # After mapping: index 2 (c.py) → 0.9, index 0 (a.py) → 0.5, index 1 (b.py) → 0.1
    # Sort descending: c.py (0.9), a.py (0.5), b.py (0.1)
    assert [c.file_path for c in reranked] == ["c.py", "a.py", "b.py"]
    assert reranked[0].reranker_score == 0.9
    assert reranked[1].reranker_score == 0.5
    assert reranked[2].reranker_score == 0.1
    assert "jina_v3_rerank" in reranked[0].rankingSignals


def test_jina_adapter_returns_original_order_on_forward_pass_failure(monkeypatch: Any) -> None:
    """If model.rerank() raises, the adapter degrades to original order."""
    adapter = JinaRerankerAdapter()

    fake_model = MagicMock()
    fake_model.rerank.side_effect = RuntimeError("simulated MPS fp16 failure")
    adapter._model = fake_model
    adapter._device = "cpu"

    candidates = [_candidate("a.py", 0.9), _candidate("b.py", 0.8)]
    reranked = adapter.rerank("query", candidates, top_k=20)

    # Same list reference returned on failure
    assert reranked is candidates


def test_jina_adapter_invalid_max_doc_chars_falls_back(
    monkeypatch: pytest.MonkeyPatch,
    caplog: pytest.LogCaptureFixture,
) -> None:
    adapter = JinaRerankerAdapter()
    fake_model = MagicMock()
    fake_model.rerank.return_value = [
        {"document": "content of b", "relevance_score": 0.9, "index": 1},
        {"document": "content of a", "relevance_score": 0.1, "index": 0},
    ]
    adapter._model = fake_model
    adapter._device = "cpu"
    monkeypatch.setenv("COCOINDEX_RERANK_JINA_MAX_DOC_CHARS", "bad")
    caplog.set_level(logging.WARNING, logger="cocoindex_code.config")

    candidates = [
        _candidate("a.py", 0.5, content="content of a"),
        _candidate("b.py", 0.5, content="content of b"),
    ]
    reranked = adapter.rerank("query", candidates, top_k=20)

    assert [c.file_path for c in reranked] == ["b.py", "a.py"]
    assert "Ignoring invalid COCOINDEX_RERANK_JINA_MAX_DOC_CHARS='bad'" in caplog.text


def test_jina_adapter_ignores_default_path_class_boost_without_explicit_factors(
    monkeypatch: pytest.MonkeyPatch,
    caplog: pytest.LogCaptureFixture,
) -> None:
    adapter = JinaRerankerAdapter()
    fake_model = MagicMock()
    fake_model.rerank.return_value = [
        {"document": "vendor", "relevance_score": 0.9, "index": 1},
        {"document": "impl", "relevance_score": 0.8, "index": 0},
    ]
    adapter._model = fake_model
    adapter._device = "cpu"
    monkeypatch.setenv("COCOINDEX_RERANK_PATH_CLASS_BOOST", "1")
    monkeypatch.delenv("COCOINDEX_RERANK_PATH_CLASS_FACTORS", raising=False)
    caplog.set_level(logging.WARNING, logger="cocoindex_code.reranker")

    candidates = [
        _path_candidate("src/impl.py", 0.5, "implementation"),
        _path_candidate("vendor/lib.py", 0.5, "vendor"),
    ]
    reranked = adapter.rerank("query", candidates, top_k=20)

    assert [c.file_path for c in reranked] == ["vendor/lib.py", "src/impl.py"]
    assert "Ignoring COCOINDEX_RERANK_PATH_CLASS_BOOST for jina-v3" in caplog.text


def test_jina_adapter_applies_explicit_path_class_factors(monkeypatch: pytest.MonkeyPatch) -> None:
    adapter = JinaRerankerAdapter()
    fake_model = MagicMock()
    fake_model.rerank.return_value = [
        {"document": "vendor", "relevance_score": 0.9, "index": 1},
        {"document": "impl", "relevance_score": 0.8, "index": 0},
    ]
    adapter._model = fake_model
    adapter._device = "cpu"
    monkeypatch.setenv("COCOINDEX_RERANK_PATH_CLASS_BOOST", "1")
    monkeypatch.setenv("COCOINDEX_RERANK_PATH_CLASS_FACTORS", '{"implementation": 2.0, "vendor": 0.5}')

    candidates = [
        _path_candidate("src/impl.py", 0.5, "implementation"),
        _path_candidate("vendor/lib.py", 0.5, "vendor"),
    ]
    reranked = adapter.rerank("query", candidates, top_k=20)

    assert [c.file_path for c in reranked] == ["src/impl.py", "vendor/lib.py"]
    assert reranked[0].reranker_score == 1.6
