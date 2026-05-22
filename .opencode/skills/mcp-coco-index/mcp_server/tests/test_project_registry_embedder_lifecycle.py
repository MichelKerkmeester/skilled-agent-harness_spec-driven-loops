from __future__ import annotations

from typing import Any

from cocoindex_code.daemon import ProjectRegistry


class FakeClosable:
    def __init__(self) -> None:
        self.close_count = 0

    def close(self) -> None:
        self.close_count += 1


class FakeProject(FakeClosable):
    pass


def test_refresh_project_config_hash_evicts_unused_embedder(monkeypatch: Any) -> None:
    base = FakeClosable()
    registry = ProjectRegistry(base)  # type: ignore[arg-type]
    project = FakeProject()
    embedder = FakeClosable()
    root = "/tmp/project-a"

    registry._projects[root] = project  # type: ignore[assignment]
    registry._project_effective_config_hash[root] = "old-hash"
    registry._embedder_by_config_hash["old-hash"] = embedder  # type: ignore[assignment]
    monkeypatch.setattr(
        registry,
        "_runtime_metadata",
        lambda project_root: {"effective_config_hash": "new-hash"},
    )

    registry._refresh_project_if_config_changed(root)

    assert project.close_count == 1
    assert embedder.close_count == 1
    assert root not in registry._projects
    assert "old-hash" not in registry._embedder_by_config_hash


def test_remove_project_preserves_embedder_used_by_another_project() -> None:
    base = FakeClosable()
    registry = ProjectRegistry(base)  # type: ignore[arg-type]
    project_a = FakeProject()
    embedder = FakeClosable()
    root_a = "/tmp/project-a"
    root_b = "/tmp/project-b"

    registry._projects[root_a] = project_a  # type: ignore[assignment]
    registry._project_effective_config_hash[root_a] = "shared-hash"
    registry._project_effective_config_hash[root_b] = "shared-hash"
    registry._embedder_by_config_hash["shared-hash"] = embedder  # type: ignore[assignment]

    assert registry._pop_and_close_project(root_a) is True

    assert project_a.close_count == 1
    assert embedder.close_count == 0
    assert "shared-hash" in registry._embedder_by_config_hash


def test_remove_project_closes_unused_embedder_once() -> None:
    base = FakeClosable()
    registry = ProjectRegistry(base)  # type: ignore[arg-type]
    project = FakeProject()
    embedder = FakeClosable()
    root = "/tmp/project-a"

    registry._projects[root] = project  # type: ignore[assignment]
    registry._project_effective_config_hash[root] = "hash-a"
    registry._embedder_by_config_hash["hash-a"] = embedder  # type: ignore[assignment]

    assert registry._pop_and_close_project(root) is True
    assert registry._pop_and_close_project(root) is False

    assert project.close_count == 1
    assert embedder.close_count == 1
    assert registry._embedder_by_config_hash == {}


def test_close_all_closes_projects_embedder_and_reranker_cache_idempotently(monkeypatch: Any) -> None:
    base = FakeClosable()
    registry = ProjectRegistry(base)  # type: ignore[arg-type]
    project = FakeProject()
    cached = FakeClosable()
    reranker_close_calls = 0

    def fake_close_all_reranker_adapters() -> int:
        nonlocal reranker_close_calls
        reranker_close_calls += 1
        return 2

    monkeypatch.setattr(
        "cocoindex_code.rerankers.reranker.close_all_reranker_adapters",
        fake_close_all_reranker_adapters,
    )

    registry._projects["/tmp/project-a"] = project  # type: ignore[assignment]
    registry._embedder_by_config_hash["hash-a"] = cached  # type: ignore[assignment]
    registry._project_effective_config_hash["/tmp/project-a"] = "hash-a"

    registry.close_all()
    registry.close_all()

    assert project.close_count == 1
    assert base.close_count == 1
    assert cached.close_count == 1
    assert reranker_close_calls == 1
    assert registry._projects == {}
    assert registry._embedder_by_config_hash == {}
    assert registry._project_effective_config_hash == {}
