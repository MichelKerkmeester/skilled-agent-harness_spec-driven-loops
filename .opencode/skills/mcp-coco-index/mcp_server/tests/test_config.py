"""Tests for cocoindex_code.config — device resolution + embedder default."""

from __future__ import annotations

import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from cocoindex_code.config import _DEFAULT_MODEL, Config, _resolve_device


class TestDefaultEmbedder:
    def test_default_model_is_jina_code(self) -> None:
        """Default embedder must be jina's code-tuned variant per ADR-001 / 018 packet."""
        assert _DEFAULT_MODEL == "sbert/jinaai/jina-embeddings-v2-base-code"


class TestResolveDevice:
    def test_env_override_wins_for_valid_devices(self) -> None:
        """Explicit valid env override returns without probing."""
        assert _resolve_device("cuda") == "cuda"
        assert _resolve_device("mps") == "mps"
        assert _resolve_device("cpu") == "cpu"

    def test_invalid_env_override_falls_back_to_auto_detect(self) -> None:
        """Unknown device values are ignored rather than passed downstream."""
        fake_torch = MagicMock()
        fake_torch.cuda.is_available.return_value = False
        fake_torch.backends.mps.is_available.return_value = False
        with patch.dict(sys.modules, {"torch": fake_torch}):
            assert _resolve_device("xpu") == "cpu"

    def test_no_env_no_torch_returns_none(self) -> None:
        """If torch is unimportable, fall back to None (downstream picks)."""
        with patch.dict(sys.modules, {"torch": None}):
            assert _resolve_device(None) is None

    def test_no_env_cuda_available(self) -> None:
        """When no env and CUDA available, prefer CUDA."""
        fake_torch = MagicMock()
        fake_torch.cuda.is_available.return_value = True
        fake_torch.backends.mps.is_available.return_value = True  # both present
        with patch.dict(sys.modules, {"torch": fake_torch}):
            assert _resolve_device(None) == "cuda"

    def test_no_env_mps_available_no_cuda(self) -> None:
        """Apple Silicon path: MPS picked when CUDA unavailable."""
        fake_torch = MagicMock()
        fake_torch.cuda.is_available.return_value = False
        fake_torch.backends.mps.is_available.return_value = True
        with patch.dict(sys.modules, {"torch": fake_torch}):
            assert _resolve_device(None) == "mps"

    def test_no_env_cpu_fallback(self) -> None:
        """No CUDA, no MPS, no env -> CPU."""
        fake_torch = MagicMock()
        fake_torch.cuda.is_available.return_value = False
        fake_torch.backends.mps.is_available.return_value = False
        with patch.dict(sys.modules, {"torch": fake_torch}):
            assert _resolve_device(None) == "cpu"

    def test_empty_string_env_treated_as_no_override(self) -> None:
        """Empty env string falls through to probing."""
        fake_torch = MagicMock()
        fake_torch.cuda.is_available.return_value = False
        fake_torch.backends.mps.is_available.return_value = True
        with patch.dict(sys.modules, {"torch": fake_torch}):
            assert _resolve_device("") == "mps"


class TestConfigValidation:
    def test_missing_root_path_falls_back_to_discovery(self, tmp_path: Path) -> None:
        with (
            patch.dict(
                "os.environ",
                {
                    "COCOINDEX_CODE_ROOT_PATH": str(tmp_path / "missing"),
                    "COCOINDEX_CODE_EMBEDDING_MODEL": _DEFAULT_MODEL,
                },
                clear=True,
            ),
            patch("cocoindex_code.config._discover_codebase_root", return_value=tmp_path),
        ):
            assert Config.from_env().codebase_root_path == tmp_path

    def test_unknown_embedding_model_falls_back_to_default(self, tmp_path: Path) -> None:
        with (
            patch.dict(
                "os.environ",
                {
                    "COCOINDEX_CODE_ROOT_PATH": str(tmp_path),
                    "COCOINDEX_CODE_EMBEDDING_MODEL": "sbert/unknown/model",
                },
                clear=True,
            ),
        ):
            assert Config.from_env().embedding_model == _DEFAULT_MODEL
