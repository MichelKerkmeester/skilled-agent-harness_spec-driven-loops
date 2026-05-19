"""License metadata tests for CocoIndex model registries."""

from __future__ import annotations

from cocoindex_code.registered_embedders import (
    MANIFESTS,
    get_reranker_metadata,
)


def test_all_embedders_have_license() -> None:
    for entry in MANIFESTS:
        assert entry.license
        assert isinstance(entry.commercial_safe, bool)


def test_jina_v3_marked_non_commercial() -> None:
    metadata = get_reranker_metadata("jinaai/jina-reranker-v3")

    assert metadata is not None
    assert metadata.license == "cc-by-nc-4.0"
    assert metadata.commercial_safe is False
