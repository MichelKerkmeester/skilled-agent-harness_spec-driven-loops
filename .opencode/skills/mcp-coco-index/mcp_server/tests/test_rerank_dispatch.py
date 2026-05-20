"""Tests for reranker dispatch and ablation configuration."""

from __future__ import annotations

import sys
from pathlib import Path
from typing import Any
from unittest.mock import patch

from cocoindex_code.config.config import _DEFAULT_RERANK_MODEL, Config


def test_rerank_ablation_env_disables_reranker(tmp_path: Path) -> None:
    with patch.dict(
        "os.environ",
        {
            "COCOINDEX_CODE_ROOT_PATH": str(tmp_path),
            "COCOINDEX_RERANK": "false",
        },
        clear=True,
    ):
        cfg = Config.from_env()

    assert cfg.rerank_enabled is False
    assert cfg.rerank_model == _DEFAULT_RERANK_MODEL


def test_rerank_model_env_override_changes_config_model(tmp_path: Path) -> None:
    with patch.dict(
        "os.environ",
        {
            "COCOINDEX_CODE_ROOT_PATH": str(tmp_path),
            "COCOINDEX_RERANK_MODEL": "jinaai/jina-reranker-v3",
        },
        clear=True,
    ):
        cfg = Config.from_env()

    assert cfg.rerank_enabled is True
    assert cfg.rerank_model == "jinaai/jina-reranker-v3"


def test_default_dispatch_uses_cross_encoder_adapter(monkeypatch: Any) -> None:
    """With sidecar dispatch opted out, the default Qwen3 model uses the bundled CrossEncoder."""
    from cocoindex_code.rerankers import reranker as reranker_module

    monkeypatch.setenv("COCOINDEX_RERANK_VIA_SIDECAR", "false")
    monkeypatch.setattr(reranker_module, "_ADAPTERS", {})

    adapter = reranker_module.get_reranker_adapter(_DEFAULT_RERANK_MODEL)

    assert isinstance(adapter, reranker_module.CrossEncoderRerankerAdapter)
    assert adapter.model_name == _DEFAULT_RERANK_MODEL


def test_default_dispatch_uses_real_cross_encoder_adapter(monkeypatch: Any) -> None:
    from cocoindex_code.rerankers import reranker as reranker_module

    monkeypatch.setenv("COCOINDEX_RERANK_VIA_SIDECAR", "false")
    monkeypatch.setattr(reranker_module, "_ADAPTERS", {})

    adapter = reranker_module.get_reranker_adapter(_DEFAULT_RERANK_MODEL)

    assert isinstance(adapter, reranker_module.CrossEncoderRerankerAdapter)
    assert adapter.model_name == _DEFAULT_RERANK_MODEL


def test_override_dispatch_uses_jina_adapter(monkeypatch: Any) -> None:
    from cocoindex_code.rerankers import reranker as reranker_module

    class FakeJinaAdapter:
        def __init__(self, model_name: str) -> None:
            self.model_name = model_name

    fake_module = type(sys)("cocoindex_code.rerankers.rerankers_jina_v3")
    fake_module.JinaRerankerAdapter = FakeJinaAdapter  # type: ignore[attr-defined]
    monkeypatch.setenv("COCOINDEX_RERANK_VIA_SIDECAR", "false")
    monkeypatch.setattr(reranker_module, "_ADAPTERS", {})
    monkeypatch.setitem(sys.modules, "cocoindex_code.rerankers.rerankers_jina_v3", fake_module)

    adapter = reranker_module.get_reranker_adapter("jinaai/jina-reranker-v3")

    assert isinstance(adapter, FakeJinaAdapter)
    assert adapter.model_name == "jinaai/jina-reranker-v3"


def test_adapter_cache_is_keyed_by_model_name(monkeypatch: Any) -> None:
    from cocoindex_code.rerankers import reranker as reranker_module

    monkeypatch.setattr(reranker_module, "_ADAPTERS", {})

    default_adapter = reranker_module.get_reranker_adapter(_DEFAULT_RERANK_MODEL)
    override_adapter = reranker_module.get_reranker_adapter("BAAI/bge-reranker-v2-m3-alt")

    assert default_adapter is not override_adapter
    assert default_adapter.model_name == _DEFAULT_RERANK_MODEL
    assert override_adapter.model_name == "BAAI/bge-reranker-v2-m3-alt"


def test_bge_opt_in_dispatches_to_cross_encoder(monkeypatch: Any) -> None:
    from cocoindex_code.rerankers import reranker as reranker_module

    monkeypatch.setenv("COCOINDEX_RERANK_VIA_SIDECAR", "false")
    monkeypatch.setattr(reranker_module, "_ADAPTERS", {})

    adapter = reranker_module.get_reranker_adapter("BAAI/bge-reranker-v2-m3")

    assert isinstance(adapter, reranker_module.CrossEncoderRerankerAdapter)
    assert adapter.model_name == "BAAI/bge-reranker-v2-m3"
