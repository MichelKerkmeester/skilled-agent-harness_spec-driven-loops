"""Tests for Ollama-backed CocoIndex embedder routing."""

from __future__ import annotations

import asyncio
from types import SimpleNamespace
from unittest.mock import patch

import numpy as np
import pytest

from cocoindex_code.config.settings import EmbeddingSettings
from cocoindex_code.core.shared import (
    _ollama_model_tag,
    _ollama_tag_matches,
    create_embedder,
)


def test_ollama_model_tag_strips_provider_prefix() -> None:
    assert _ollama_model_tag("ollama/nomic-embed-text") == "nomic-embed-text"


@pytest.mark.parametrize(
    ("requested", "available", "expected"),
    [
        ("nomic-embed-text", "nomic-embed-text", True),
        ("nomic-embed-text", "nomic-embed-text:latest", True),
        ("nomic-embed-text", "nomic-embed-text:v1.5", True),
        ("nomic-embed-text:v1.5", "nomic-embed-text:latest", False),
    ],
)
def test_ollama_tag_matches_latest_aliases(
    requested: str,
    available: str,
    expected: bool,
) -> None:
    assert _ollama_tag_matches(requested, available) is expected


def test_ollama_embedder_routes_through_litellm_call_site() -> None:
    calls = []

    async def fake_aembedding(**kwargs):
        calls.append(kwargs)
        return SimpleNamespace(data=[{"embedding": [0.1, 0.2, 0.3]}])

    settings = EmbeddingSettings(provider="litellm", model="ollama/nomic-embed-text")
    with (
        patch("cocoindex_code.core.shared._ensure_ollama_daemon_ready") as ready,
        patch("litellm.aembedding", side_effect=fake_aembedding),
    ):
        embedder = create_embedder(settings)
        vector = asyncio.run(embedder.embed("hello"))

    ready.assert_called_once_with("ollama/nomic-embed-text")
    assert np.allclose(vector, np.array([0.1, 0.2, 0.3], dtype=np.float32))
    assert calls == [
        {
            "model": "ollama/nomic-embed-text",
            "input": ["hello"],
            "api_base": "http://localhost:11434",
        }
    ]
