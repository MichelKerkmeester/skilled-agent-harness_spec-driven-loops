"""Tests for retrieval configuration fingerprints."""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any

from cocoindex_code import daemon as daemon_module
from cocoindex_code.observability.observability import (
    effective_config_hash,
    index_meta_path,
    write_index_meta,
)
from cocoindex_code.indexer.indexer import write_index_metadata
from cocoindex_code.config.settings import EmbeddingSettings, UserSettings


def test_fingerprint_persisted_at_index_time(tmp_path: Path, monkeypatch: Any) -> None:
    monkeypatch.setattr("cocoindex_code.observability.query_prompt_name", None, raising=False)

    write_index_metadata(
        tmp_path,
        chunk_count=3,
        file_count=2,
        embedding_model="sbert/nomic-ai/CodeRankEmbed",
        embedding_provider="sentence-transformers",
    )

    payload = json.loads(index_meta_path(tmp_path).read_text())
    for field in (
        "embedder_name",
        "embedder_dim",
        "embedder_provider",
        "query_prompt_name",
        "document_prompt_name",
        "reranker_name",
        "reranker_enabled",
        "reranker_license",
        "chunk_size",
        "chunk_overlap",
        "chunking_policy",
        "corpus_root",
        "chunk_count",
        "file_count",
        "rrf_K",
        "rrf_V",
        "rrf_F",
        "hybrid_boost_path",
        "hybrid_boost_canonical",
        "effective_config_hash",
    ):
        assert field in payload
    assert payload["chunk_count"] == 3
    assert payload["file_count"] == 2


def test_fingerprint_mismatch_warning(
    tmp_path: Path,
    monkeypatch: Any,
    caplog: Any,
) -> None:
    indexed = daemon_module.build_index_fingerprint(
        project_root=tmp_path,
        embedding_model="sbert/nomic-ai/CodeRankEmbed",
        embedding_provider="sentence-transformers",
    )
    write_index_meta(tmp_path, indexed)
    monkeypatch.setattr(
        daemon_module,
        "load_user_settings",
        lambda: UserSettings(
            embedding=EmbeddingSettings(
                provider="sentence-transformers",
                model="sbert/BAAI/bge-code-v1",
            )
        ),
    )
    registry = daemon_module.ProjectRegistry(embedder=object())

    caplog.set_level(logging.INFO, logger="cocoindex_code.daemon")
    registry._warn_if_fingerprint_mismatch(str(tmp_path), req_id="req-1")

    assert "INDEX_FINGERPRINT_MISMATCH" in caplog.text


def test_fingerprint_hash_stable_across_dict_order() -> None:
    left = {"b": 2, "a": {"d": 4, "c": 3}}
    right = {"a": {"c": 3, "d": 4}, "b": 2}
    assert effective_config_hash(left) == effective_config_hash(right)
