"""Tests for HttpSidecarRerankerAdapter (arc 008 phase 006).

Cocoindex consumes the shared system-rerank-sidecar over HTTP when
``COCOINDEX_RERANK_VIA_SIDECAR=true``. Each scenario here verifies a
distinct branch of the adapter's fallback chain by injecting a custom
``httpx.MockTransport`` into the adapter's client.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from typing import Any

import httpx
import pytest

from cocoindex_code.indexer.schema import QueryResult
from cocoindex_code.observability.observability import RetrievalDiagnostics
from cocoindex_code.rerankers import reranker as reranker_mod
from cocoindex_code.rerankers.reranker import (
    HttpSidecarRerankerAdapter,
    _rerank_via_sidecar_enabled,
    get_reranker_adapter,
)


_DEFAULT_MODEL = "Qwen/Qwen3-Reranker-0.6B"


def _candidates(n: int = 3) -> list[QueryResult]:
    return [
        QueryResult(
            file_path=f"src/file_{i}.py",
            language="python",
            content=f"def function_{i}(): pass",
            start_line=1,
            end_line=10,
            score=0.5 - 0.1 * i,
            raw_score=0.5 - 0.1 * i,
            path_class="source",
            rankingSignals=["vector"],
        )
        for i in range(n)
    ]


def _install_mock_transport(
    adapter: HttpSidecarRerankerAdapter,
    handler,
) -> None:
    """Replace the adapter's lazy client with an httpx.MockTransport client."""
    transport = httpx.MockTransport(handler)
    adapter._client = httpx.Client(
        base_url=f"http://127.0.0.1:{adapter.port}",
        transport=transport,
    )


def _install_failing_fallback(adapter: HttpSidecarRerankerAdapter) -> "_RecordedFallback":
    """Replace the adapter's fallback with a recorder that does NOT touch the bundled model."""
    fallback = _RecordedFallback(adapter.model_name)
    adapter._fallback_adapter = fallback  # type: ignore[assignment]
    return fallback


@dataclass
class _RecordedFallback:
    """Test double for CrossEncoderRerankerAdapter — records rerank calls without loading a model."""

    model_name: str
    calls: list[dict[str, Any]] = field(default_factory=list)

    def rerank(self, query, candidates, top_k, *, diagnostics=None):
        self.calls.append(
            {
                "query": query,
                "candidate_count": len(candidates),
                "top_k": top_k,
                "diagnostics": diagnostics,
            }
        )
        return candidates


def test_happy_path_returns_reranked_results():
    adapter = HttpSidecarRerankerAdapter(_DEFAULT_MODEL, port=8765, timeout_s=1.0)

    def handler(request: httpx.Request) -> httpx.Response:
        payload = json.loads(request.content)
        assert payload["query"] == "alpha query"
        assert len(payload["documents"]) == 3
        assert payload["model"] == _DEFAULT_MODEL  # adapter sends its model_name
        return httpx.Response(
            200,
            json={
                "results": [
                    {"index": 2, "relevance_score": 0.95},
                    {"index": 0, "relevance_score": 0.60},
                    {"index": 1, "relevance_score": 0.10},
                ],
                "model": _DEFAULT_MODEL,
                "latency_ms": 7,
            },
        )

    _install_mock_transport(adapter, handler)
    diagnostics = RetrievalDiagnostics()

    out = adapter.rerank("alpha query", _candidates(3), top_k=3, diagnostics=diagnostics)

    assert [c.file_path for c in out] == ["src/file_2.py", "src/file_0.py", "src/file_1.py"]
    assert all(c.reranker_score is not None for c in out)
    assert out[0].reranker_score == pytest.approx(0.95)
    assert "cross_encoder_rerank" in out[0].rankingSignals
    assert diagnostics.reranker_fallback_used is False


def test_connection_error_falls_back_to_bundled():
    adapter = HttpSidecarRerankerAdapter(_DEFAULT_MODEL, port=8765, timeout_s=1.0)

    def handler(request: httpx.Request) -> httpx.Response:
        raise httpx.ConnectError("connection refused")

    _install_mock_transport(adapter, handler)
    fallback = _install_failing_fallback(adapter)
    diagnostics = RetrievalDiagnostics()

    out = adapter.rerank("q", _candidates(3), top_k=3, diagnostics=diagnostics)

    assert diagnostics.reranker_fallback_used is True
    assert diagnostics.reranker_fallback_reason == "sidecar_unavailable"
    assert len(fallback.calls) == 1
    assert fallback.calls[0]["candidate_count"] == 3
    assert out == _candidates(3)


def test_http_5xx_falls_back_to_bundled():
    adapter = HttpSidecarRerankerAdapter(_DEFAULT_MODEL, port=8765, timeout_s=1.0)

    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(503, json={"detail": "unavailable"})

    _install_mock_transport(adapter, handler)
    fallback = _install_failing_fallback(adapter)
    diagnostics = RetrievalDiagnostics()

    adapter.rerank("q", _candidates(3), top_k=3, diagnostics=diagnostics)

    assert diagnostics.reranker_fallback_used is True
    assert diagnostics.reranker_fallback_reason == "sidecar_5xx"
    assert len(fallback.calls) == 1


def test_http_4xx_falls_back_with_status_bucket():
    adapter = HttpSidecarRerankerAdapter(_DEFAULT_MODEL, port=8765, timeout_s=1.0)

    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(422, json={"detail": "bad input"})

    _install_mock_transport(adapter, handler)
    fallback = _install_failing_fallback(adapter)
    diagnostics = RetrievalDiagnostics()

    adapter.rerank("q", _candidates(3), top_k=3, diagnostics=diagnostics)

    assert diagnostics.reranker_fallback_used is True
    assert diagnostics.reranker_fallback_reason == "sidecar_422"
    assert len(fallback.calls) == 1


def test_malformed_json_falls_back():
    adapter = HttpSidecarRerankerAdapter(_DEFAULT_MODEL, port=8765, timeout_s=1.0)

    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(
            200,
            content=b"this is not json",
            headers={"content-type": "application/json"},
        )

    _install_mock_transport(adapter, handler)
    fallback = _install_failing_fallback(adapter)
    diagnostics = RetrievalDiagnostics()

    adapter.rerank("q", _candidates(3), top_k=3, diagnostics=diagnostics)

    assert diagnostics.reranker_fallback_used is True
    assert diagnostics.reranker_fallback_reason == "sidecar_malformed"
    assert len(fallback.calls) == 1


def test_missing_index_in_payload_falls_back():
    adapter = HttpSidecarRerankerAdapter(_DEFAULT_MODEL, port=8765, timeout_s=1.0)

    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(
            200,
            json={
                "results": [
                    {"index": 0, "relevance_score": 0.9},
                    {"index": 5, "relevance_score": 0.5},
                ],
                "model": _DEFAULT_MODEL,
                "latency_ms": 1,
            },
        )

    _install_mock_transport(adapter, handler)
    fallback = _install_failing_fallback(adapter)
    diagnostics = RetrievalDiagnostics()

    adapter.rerank("q", _candidates(3), top_k=3, diagnostics=diagnostics)

    assert diagnostics.reranker_fallback_used is True
    assert diagnostics.reranker_fallback_reason == "sidecar_malformed"
    assert len(fallback.calls) == 1


def test_too_few_candidates_skips_http_call():
    adapter = HttpSidecarRerankerAdapter(_DEFAULT_MODEL, port=8765)
    fallback = _install_failing_fallback(adapter)

    out = adapter.rerank("q", _candidates(1), top_k=5)

    assert out == _candidates(1)
    assert len(fallback.calls) == 0  # short-circuit, never touches client/fallback


def test_dispatch_routes_to_sidecar_when_env_set(monkeypatch):
    monkeypatch.setenv("COCOINDEX_RERANK_VIA_SIDECAR", "true")
    monkeypatch.setattr(reranker_mod, "_ADAPTERS", {})
    assert _rerank_via_sidecar_enabled() is True

    adapter = get_reranker_adapter(_DEFAULT_MODEL)

    assert isinstance(adapter, HttpSidecarRerankerAdapter)
    assert adapter.model_name == _DEFAULT_MODEL


def test_dispatch_defaults_to_sidecar_when_env_unset(monkeypatch):
    """PROMOTE default: unset COCOINDEX_RERANK_VIA_SIDECAR routes to HTTP sidecar."""
    monkeypatch.delenv("COCOINDEX_RERANK_VIA_SIDECAR", raising=False)
    monkeypatch.setattr(reranker_mod, "_ADAPTERS", {})

    adapter = get_reranker_adapter(_DEFAULT_MODEL)

    assert isinstance(adapter, HttpSidecarRerankerAdapter)


def test_dispatch_routes_to_bundled_when_env_explicit_false(monkeypatch):
    """Operator opt-out: COCOINDEX_RERANK_VIA_SIDECAR=false routes to bundled."""
    monkeypatch.setenv("COCOINDEX_RERANK_VIA_SIDECAR", "false")
    monkeypatch.setattr(reranker_mod, "_ADAPTERS", {})

    from cocoindex_code.rerankers.reranker import CrossEncoderRerankerAdapter

    adapter = get_reranker_adapter(_DEFAULT_MODEL)
    assert isinstance(adapter, CrossEncoderRerankerAdapter)
