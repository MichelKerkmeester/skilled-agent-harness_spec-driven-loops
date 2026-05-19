"""Stable registry accessors for CocoIndex model metadata."""

from __future__ import annotations

from .registered_embedders import (
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
    validate_registry,
)

__all__ = [
    "EmbedderSpec",
    "RerankerSpec",
    "embed_document_prompt",
    "embed_query_prompt",
    "embedder_for",
    "embedder_license",
    "list_embedders",
    "list_rerankers",
    "rerank_license",
    "reranker_for",
    "validate_registry",
]
