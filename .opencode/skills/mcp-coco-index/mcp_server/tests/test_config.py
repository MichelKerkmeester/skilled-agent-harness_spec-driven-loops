"""Tests for cocoindex_code.config — device resolution + embedder default."""

from __future__ import annotations

import sys
from unittest.mock import MagicMock, patch

import pytest

from cocoindex_code.config import _DEFAULT_MODEL, _resolve_device


class TestDefaultEmbedder:
    def test_default_model_is_jina_code(self) -> None:
        """Default embedder must be jina's code-tuned variant per ADR-001 / 018 packet."""
        assert _DEFAULT_MODEL == "sbert/jinaai/jina-embeddings-v2-base-code"


class TestResolveDevice:
    def test_env_override_wins(self) -> None:
        """Explicit env override returns as-is without probing."""
        assert _resolve_device("cuda") == "cuda"
        assert _resolve_device("mps") == "mps"
        assert _resolve_device("cpu") == "cpu"
        assert _resolve_device("xpu") == "xpu"  # unknown values pass through

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
