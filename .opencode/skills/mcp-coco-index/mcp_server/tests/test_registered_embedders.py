"""Tests for cocoindex_code.registered_embedders — schema + default alignment."""

from __future__ import annotations

import pytest

from cocoindex_code.config import _DEFAULT_MODEL
from cocoindex_code.registered_embedders import (
    MANIFESTS,
    EmbedderMetadata,
    default_embedder,
    get_embedder_metadata,
    list_embedders,
)


class TestRegistryShape:
    def test_at_least_four_entries(self) -> None:
        """Registry must list ≥ 4 vetted candidates per 019 spec R1."""
        assert len(MANIFESTS) >= 4

    def test_entries_span_text_and_code(self) -> None:
        """Registry must cover both text and code categories."""
        categories = {m.category for m in MANIFESTS}
        assert "text" in categories
        assert "code" in categories

    def test_no_duplicate_names(self) -> None:
        names = [m.name for m in MANIFESTS]
        assert len(names) == len(set(names))

    def test_each_entry_well_formed(self) -> None:
        """Every entry has populated, schema-compliant fields."""
        for m in MANIFESTS:
            assert isinstance(m, EmbedderMetadata)
            assert m.name.startswith(("sbert/", "litellm/"))
            assert m.dim > 0
            assert m.ram_mb > 0
            assert m.disk_mb > 0
            assert isinstance(m.mps_compatible, bool)
            assert m.category in ("text", "code")
            assert m.hf_url.startswith("https://huggingface.co/")
            assert len(m.notes) > 0


class TestDefaultAlignment:
    def test_default_matches_config(self) -> None:
        """Registry default MUST match config._DEFAULT_MODEL or the registry has drifted."""
        assert default_embedder().name == _DEFAULT_MODEL

    def test_default_is_code_category(self) -> None:
        """For CocoIndex (code search), default should be code-tuned."""
        assert default_embedder().category == "code"

    def test_default_is_metal_compatible(self) -> None:
        """Default must work on Apple Silicon Metal — covers majority of operators."""
        assert default_embedder().mps_compatible is True


class TestLookupAPI:
    def test_list_embedders_returns_manifests(self) -> None:
        assert list_embedders() == MANIFESTS

    def test_get_known_name(self) -> None:
        """Round-trip a known entry."""
        for m in MANIFESTS:
            assert get_embedder_metadata(m.name) is m

    def test_get_unknown_returns_none(self) -> None:
        assert get_embedder_metadata("sbert/does-not-exist/foo") is None
