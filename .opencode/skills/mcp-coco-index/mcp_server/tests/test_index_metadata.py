"""Tests for durable index metadata and compatibility checks."""

from __future__ import annotations

import json
from dataclasses import replace
from pathlib import Path
from typing import Any

import pytest

from cocoindex_code.index_metadata import (
    CURRENT_SCHEMA_VERSION,
    CompatibilitySeverity,
    IndexCompatibility,
    IndexCompatibilityError,
    build_current_index_metadata,
    index_meta_path,
    read_index_meta,
    write_index_meta,
)
from cocoindex_code.indexer import write_index_metadata


def _metadata(tmp_path: Path):
    return build_current_index_metadata(
        project_root=tmp_path,
        embedding_model="sbert/nomic-ai/CodeRankEmbed",
        embedding_provider="sentence-transformers",
        query_prompt_name="query",
        document_prompt_name=None,
    )


def test_metadata_persisted_at_index_time(tmp_path: Path) -> None:
    write_index_metadata(
        tmp_path,
        chunk_count=3,
        file_count=2,
        embedding_model="sbert/nomic-ai/CodeRankEmbed",
        embedding_provider="sentence-transformers",
    )

    payload = json.loads(index_meta_path(tmp_path).read_text())

    for field in (
        "schema_version",
        "embedder_name",
        "embedder_provider",
        "embedder_dim",
        "query_prompt_name",
        "document_prompt_name",
        "chunking_policy",
        "chunk_size",
        "chunk_overlap",
        "mirror_dedup_canonical_preference",
        "corpus_root",
        "created_at",
        "indexer_version",
        "effective_config_hash",
    ):
        assert field in payload
    assert payload["schema_version"] == CURRENT_SCHEMA_VERSION
    assert payload["chunk_count"] == 3
    assert payload["file_count"] == 2


def test_dim_mismatch_hard_refuse(tmp_path: Path) -> None:
    expected = _metadata(tmp_path)
    actual = replace(expected, embedder_dim=1024)

    result = IndexCompatibility(expected=expected, actual=actual).check()

    assert result.hard_refusals[0].field == "embedder_dim"
    with pytest.raises(IndexCompatibilityError):
        result.raise_for_hard_refusal()


def test_embedder_mismatch_hard_refuse(tmp_path: Path) -> None:
    expected = _metadata(tmp_path)
    actual = replace(expected, embedder_name="sbert/BAAI/bge-code-v1")

    result = IndexCompatibility(expected=expected, actual=actual).check()

    assert any(m.field == "embedder_name" for m in result.hard_refusals)


def test_chunking_change_soft_warn(tmp_path: Path) -> None:
    expected = _metadata(tmp_path)
    actual = replace(expected, chunk_size=2000)

    result = IndexCompatibility(expected=expected, actual=actual).check()

    assert not result.hard_refusals
    assert result.soft_warnings[0].field == "chunk_size"
    assert result.soft_warnings[0].severity == CompatibilitySeverity.SOFT_WARN


def test_prompt_policy_invariant_enforced(tmp_path: Path) -> None:
    expected = _metadata(tmp_path)
    actual = replace(expected, query_prompt_name=None)

    result = IndexCompatibility(expected=expected, actual=actual).check()

    assert any(m.field == "query_prompt_name" for m in result.hard_refusals)


def test_schema_version_downgrade_refuse(tmp_path: Path) -> None:
    expected = _metadata(tmp_path)
    actual = replace(expected, schema_version=CURRENT_SCHEMA_VERSION + 1)

    result = IndexCompatibility(expected=expected, actual=actual).check()

    assert any(m.field == "schema_version" for m in result.hard_refusals)


def test_atomic_write_no_partial_meta(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    original = _metadata(tmp_path)
    write_index_meta(tmp_path, original)
    before = index_meta_path(tmp_path).read_text()

    def fail_replace(_src: Any, _dst: Any) -> None:
        raise RuntimeError("replace interrupted")

    monkeypatch.setattr("cocoindex_code.index_metadata.os.replace", fail_replace)

    with pytest.raises(RuntimeError, match="replace interrupted"):
        write_index_meta(tmp_path, replace(original, chunk_count=99))

    assert index_meta_path(tmp_path).read_text() == before
    assert read_index_meta(tmp_path) == original
