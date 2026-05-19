"""Tests for per-project daemon metadata isolation."""

from __future__ import annotations

from pathlib import Path
from typing import Any

from cocoindex_code import daemon as daemon_module
from cocoindex_code.index_metadata import build_current_index_metadata, write_index_meta
from cocoindex_code.settings import EmbeddingSettings, UserSettings


class FakeEmbedder:
    def __init__(self, model: str) -> None:
        self.model = model


def _settings(model: str) -> UserSettings:
    return UserSettings(
        embedding=EmbeddingSettings(
            provider="sentence-transformers",
            model=model,
        )
    )


def test_per_project_meta_isolated(tmp_path: Path, monkeypatch: Any) -> None:
    project_a = tmp_path / "a"
    project_b = tmp_path / "b"
    project_a.mkdir()
    project_b.mkdir()
    active_model = {"value": "sbert/nomic-ai/CodeRankEmbed"}

    def fake_load_user_settings() -> UserSettings:
        return _settings(active_model["value"])

    def fake_create_embedder(settings: EmbeddingSettings) -> FakeEmbedder:
        return FakeEmbedder(settings.model)

    monkeypatch.setattr(daemon_module, "load_user_settings", fake_load_user_settings)
    monkeypatch.setattr(daemon_module, "create_embedder", fake_create_embedder)

    registry = daemon_module.ProjectRegistry(embedder=FakeEmbedder("initial"))
    embedder_a = registry._embedder_for_project(str(project_a))
    active_model["value"] = "sbert/BAAI/bge-code-v1"
    embedder_b = registry._embedder_for_project(str(project_b))

    assert embedder_a.model == "sbert/nomic-ai/CodeRankEmbed"
    assert embedder_b.model == "sbert/BAAI/bge-code-v1"
    assert registry._current_index_meta[str(project_a)] is None
    assert registry._current_index_meta[str(project_b)] is None


def test_cross_project_search_does_not_leak_meta(tmp_path: Path, monkeypatch: Any) -> None:
    project_a = tmp_path / "a"
    project_b = tmp_path / "b"
    project_a.mkdir()
    project_b.mkdir()
    active_model = {"value": "sbert/nomic-ai/CodeRankEmbed"}

    def fake_load_user_settings() -> UserSettings:
        return _settings(active_model["value"])

    monkeypatch.setattr(daemon_module, "load_user_settings", fake_load_user_settings)
    write_index_meta(
        project_a,
        build_current_index_metadata(
            project_root=project_a,
            embedding_model="sbert/nomic-ai/CodeRankEmbed",
            embedding_provider="sentence-transformers",
            query_prompt_name="query",
            document_prompt_name=None,
        ),
    )
    write_index_meta(
        project_b,
        build_current_index_metadata(
            project_root=project_b,
            embedding_model="sbert/BAAI/bge-code-v1",
            embedding_provider="sentence-transformers",
            query_prompt_name=None,
            document_prompt_name=None,
        ),
    )

    registry = daemon_module.ProjectRegistry(embedder=FakeEmbedder("initial"))
    registry._check_search_compatibility(str(project_a))
    active_model["value"] = "sbert/BAAI/bge-code-v1"
    registry._check_search_compatibility(str(project_b))

    assert registry._current_index_meta[str(project_a)]["embedder_name"] == "sbert/nomic-ai/CodeRankEmbed"
    assert registry._current_index_meta[str(project_b)]["embedder_name"] == "sbert/BAAI/bge-code-v1"
