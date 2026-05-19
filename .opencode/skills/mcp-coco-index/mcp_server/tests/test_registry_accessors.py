"""Tests for the public CocoIndex model registry accessors."""

from __future__ import annotations

from dataclasses import fields
from pathlib import Path

import pytest

from cocoindex_code.registry import (
    EmbedderSpec,
    RerankerSpec,
    embed_document_prompt,
    embed_query_prompt,
    embedder_for,
    embedder_license,
    list_embedders,
    list_rerankers,
    rerank_license,
    reranker_for,
)


def test_every_embedder_has_license_field() -> None:
    for entry in list_embedders():
        assert entry.license is not None
        assert entry.license


def test_every_embedder_has_prompt_fields() -> None:
    field_names = {field.name for field in fields(EmbedderSpec)}

    assert "query_prompt_name" in field_names
    assert "document_prompt_name" in field_names
    for entry in list_embedders():
        assert hasattr(entry, "query_prompt_name")
        assert hasattr(entry, "document_prompt_name")


def test_every_reranker_has_license_field() -> None:
    for entry in list_rerankers():
        assert entry.license is not None
        assert entry.license


def test_no_duplicated_prompt_registries() -> None:
    server_root = Path(__file__).resolve().parents[1]
    competing_name = "_QUERY" "_PROMPT_MODELS"
    offenders = [
        path
        for path in server_root.rglob("*.py")
        if path != Path(__file__).resolve()
        and "build" not in path.relative_to(server_root).parts
        and ".venv" not in path.relative_to(server_root).parts
        and competing_name in path.read_text(encoding="utf-8", errors="ignore")
    ]

    assert offenders == []


def test_accessor_returns_typed_spec() -> None:
    embedder = embedder_for("sbert/nomic-ai/CodeRankEmbed")
    reranker = reranker_for("jinaai/jina-reranker-v3")

    assert isinstance(embedder, EmbedderSpec)
    assert isinstance(reranker, RerankerSpec)
    assert embed_query_prompt(embedder.name) == "query"
    assert embed_document_prompt(embedder.name) is None
    assert embedder_license(embedder.name) == "mit"
    assert rerank_license(reranker.name) == "cc-by-nc-4.0"


def test_unknown_model_raises_clear_error() -> None:
    with pytest.raises(KeyError, match="Unknown embedder.*Registered embedders"):
        embedder_for("sbert/not-a-real-model")

    with pytest.raises(KeyError, match="Unknown reranker.*Registered rerankers"):
        reranker_for("not-a-real-reranker")
