"""Tests for cocoindex_code.config — device resolution + embedder default."""

from __future__ import annotations

import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from cocoindex_code.config import (
    _DEFAULT_CANONICAL_MIRROR,
    _DEFAULT_CHUNK_OVERLAP,
    _DEFAULT_CHUNK_SIZE,
    _DEFAULT_CODE_AWARE_CHUNKING,
    _DEFAULT_HYBRID_FTS5_WEIGHT,
    _DEFAULT_HYBRID_RRF_K,
    _DEFAULT_HYBRID_VECTOR_WEIGHT,
    _DEFAULT_MIN_CHUNK_SIZE,
    _DEFAULT_MIRROR_PREFIXES,
    _DEFAULT_MODEL,
    _DEFAULT_QUERY_EXPANSION,
    _DEFAULT_QUERY_EXPANSION_DENSE_FANOUT,
    _DEFAULT_QUERY_EXPANSION_MAX_VARIANTS,
    _DEFAULT_SYNONYMS,
    Config,
    _resolve_device,
)


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

    def test_registered_ollama_model_is_accepted(self, tmp_path: Path) -> None:
        with patch.dict(
            "os.environ",
            {
                "COCOINDEX_CODE_ROOT_PATH": str(tmp_path),
                "COCOINDEX_CODE_EMBEDDING_MODEL": "ollama/nomic-embed-text",
            },
            clear=True,
        ):
            assert Config.from_env().embedding_model == "ollama/nomic-embed-text"


class TestChunkConfigValidation:
    def test_default_chunk_params(self, tmp_path: Path) -> None:
        with patch.dict(
            "os.environ",
            {"COCOINDEX_CODE_ROOT_PATH": str(tmp_path)},
            clear=True,
        ):
            cfg = Config.from_env()

        assert cfg.chunk_size == _DEFAULT_CHUNK_SIZE == 1500
        assert cfg.chunk_overlap == _DEFAULT_CHUNK_OVERLAP == 200
        assert cfg.min_chunk_size == _DEFAULT_MIN_CHUNK_SIZE == 250
        assert cfg.code_aware_chunking is _DEFAULT_CODE_AWARE_CHUNKING is True
        assert cfg.tree_sitter_languages == {}

    def test_env_override_chunk_size(self, tmp_path: Path) -> None:
        with patch.dict(
            "os.environ",
            {
                "COCOINDEX_CODE_ROOT_PATH": str(tmp_path),
                "COCOINDEX_CODE_CHUNK_SIZE": "2000",
            },
            clear=True,
        ):
            assert Config.from_env().chunk_size == 2000

    def test_invalid_chunk_size_falls_back(
        self,
        tmp_path: Path,
        caplog: pytest.LogCaptureFixture,
    ) -> None:
        caplog.set_level("WARNING", logger="cocoindex_code.config")
        with patch.dict(
            "os.environ",
            {
                "COCOINDEX_CODE_ROOT_PATH": str(tmp_path),
                "COCOINDEX_CODE_CHUNK_SIZE": "invalid",
            },
            clear=True,
        ):
            cfg = Config.from_env()

        assert cfg.chunk_size == _DEFAULT_CHUNK_SIZE
        assert "Ignoring invalid COCOINDEX_CODE_CHUNK_SIZE='invalid'" in caplog.text

    @pytest.mark.parametrize("value", ["99", "8001"])
    def test_chunk_size_out_of_bounds_falls_back(
        self,
        tmp_path: Path,
        caplog: pytest.LogCaptureFixture,
        value: str,
    ) -> None:
        caplog.set_level("WARNING", logger="cocoindex_code.config")
        with patch.dict(
            "os.environ",
            {
                "COCOINDEX_CODE_ROOT_PATH": str(tmp_path),
                "COCOINDEX_CODE_CHUNK_SIZE": value,
            },
            clear=True,
        ):
            cfg = Config.from_env()

        assert cfg.chunk_size == _DEFAULT_CHUNK_SIZE
        assert f"Ignoring invalid COCOINDEX_CODE_CHUNK_SIZE='{value}'" in caplog.text

    def test_min_chunk_size_validated(
        self,
        tmp_path: Path,
        caplog: pytest.LogCaptureFixture,
    ) -> None:
        caplog.set_level("WARNING", logger="cocoindex_code.config")
        with patch.dict(
            "os.environ",
            {
                "COCOINDEX_CODE_ROOT_PATH": str(tmp_path),
                "COCOINDEX_CODE_MIN_CHUNK_SIZE": "49",
            },
            clear=True,
        ):
            cfg = Config.from_env()

        assert cfg.min_chunk_size == _DEFAULT_MIN_CHUNK_SIZE
        assert "Ignoring invalid COCOINDEX_CODE_MIN_CHUNK_SIZE='49'" in caplog.text

    def test_code_aware_chunking_can_be_disabled(self, tmp_path: Path) -> None:
        with patch.dict(
            "os.environ",
            {
                "COCOINDEX_CODE_ROOT_PATH": str(tmp_path),
                "COCOINDEX_CODE_AWARE_CHUNKING": "false",
            },
            clear=True,
        ):
            cfg = Config.from_env()

        assert cfg.code_aware_chunking is False

    def test_tree_sitter_language_override_json(self, tmp_path: Path) -> None:
        override = (
            '{"kotlin":{"module":"tree_sitter_kotlin",'
            '"top_level_node_types":["function_declaration"],'
            '"doc_comment_node_types":["comment"]}}'
        )
        with patch.dict(
            "os.environ",
            {
                "COCOINDEX_CODE_ROOT_PATH": str(tmp_path),
                "COCOINDEX_TREE_SITTER_LANGUAGES": override,
            },
            clear=True,
        ):
            cfg = Config.from_env()

        assert cfg.tree_sitter_languages["kotlin"] == {
            "module": "tree_sitter_kotlin",
            "top_level_node_types": ["function_declaration"],
            "doc_comment_node_types": ["comment"],
        }


class TestHybridConfigValidation:
    def test_default_hybrid_params(self, tmp_path: Path) -> None:
        with patch.dict(
            "os.environ",
            {"COCOINDEX_CODE_ROOT_PATH": str(tmp_path)},
            clear=True,
        ):
            cfg = Config.from_env()

        assert cfg.hybrid_enabled is True
        assert cfg.hybrid_vector_weight == _DEFAULT_HYBRID_VECTOR_WEIGHT == 0.7
        assert cfg.hybrid_fts5_weight == _DEFAULT_HYBRID_FTS5_WEIGHT == 0.7
        assert cfg.hybrid_rrf_k == _DEFAULT_HYBRID_RRF_K == 60

    def test_hybrid_env_overrides(self, tmp_path: Path) -> None:
        with patch.dict(
            "os.environ",
            {
                "COCOINDEX_CODE_ROOT_PATH": str(tmp_path),
                "COCOINDEX_HYBRID": "true",
                "COCOINDEX_HYBRID_VECTOR_WEIGHT": "1.2",
                "COCOINDEX_HYBRID_FTS5_WEIGHT": "0.4",
                "COCOINDEX_HYBRID_RRF_K": "40",
            },
            clear=True,
        ):
            cfg = Config.from_env()

        assert cfg.hybrid_enabled is True
        assert cfg.hybrid_vector_weight == 1.2
        assert cfg.hybrid_fts5_weight == 0.4
        assert cfg.hybrid_rrf_k == 40

    def test_invalid_hybrid_params_fall_back(
        self,
        tmp_path: Path,
        caplog: pytest.LogCaptureFixture,
    ) -> None:
        caplog.set_level("WARNING", logger="cocoindex_code.config")
        with patch.dict(
            "os.environ",
            {
                "COCOINDEX_CODE_ROOT_PATH": str(tmp_path),
                "COCOINDEX_HYBRID": "perhaps",
                "COCOINDEX_HYBRID_VECTOR_WEIGHT": "2.1",
                "COCOINDEX_HYBRID_FTS5_WEIGHT": "nope",
                "COCOINDEX_HYBRID_RRF_K": "0",
            },
            clear=True,
        ):
            cfg = Config.from_env()

        assert cfg.hybrid_enabled is True
        assert cfg.hybrid_vector_weight == _DEFAULT_HYBRID_VECTOR_WEIGHT
        assert cfg.hybrid_fts5_weight == _DEFAULT_HYBRID_FTS5_WEIGHT
        assert cfg.hybrid_rrf_k == _DEFAULT_HYBRID_RRF_K
        assert "Ignoring invalid COCOINDEX_HYBRID='perhaps'" in caplog.text
        assert "Ignoring invalid COCOINDEX_HYBRID_VECTOR_WEIGHT='2.1'" in caplog.text
        assert "Ignoring invalid COCOINDEX_HYBRID_FTS5_WEIGHT='nope'" in caplog.text
        assert "Ignoring invalid COCOINDEX_HYBRID_RRF_K='0'" in caplog.text


class TestQueryExpansionConfigValidation:
    def test_default_query_expansion_config(self, tmp_path: Path) -> None:
        with patch.dict(
            "os.environ",
            {"COCOINDEX_CODE_ROOT_PATH": str(tmp_path)},
            clear=True,
        ):
            cfg = Config.from_env()

        assert cfg.query_expansion is _DEFAULT_QUERY_EXPANSION is False
        assert cfg.query_expansion_max_variants == _DEFAULT_QUERY_EXPANSION_MAX_VARIANTS == 6
        assert cfg.query_expansion_dense_fanout is _DEFAULT_QUERY_EXPANSION_DENSE_FANOUT is True
        assert cfg.query_expansion_synonyms == _DEFAULT_SYNONYMS

    def test_query_expansion_env_overrides(self, tmp_path: Path) -> None:
        with patch.dict(
            "os.environ",
            {
                "COCOINDEX_CODE_ROOT_PATH": str(tmp_path),
                "COCOINDEX_QUERY_EXPANSION": "false",
                "COCOINDEX_QUERY_EXPANSION_MAX_VARIANTS": "4",
                "COCOINDEX_QUERY_EXPANSION_SYNONYMS": '{"walk":["find"],"SAVE":["Persist"]}',
                "COCOINDEX_QUERY_EXPANSION_DENSE_FANOUT": "off",
            },
            clear=True,
        ):
            cfg = Config.from_env()

        assert cfg.query_expansion is False
        assert cfg.query_expansion_max_variants == 4
        assert cfg.query_expansion_synonyms == {"walk": ["find"], "save": ["persist"]}
        assert cfg.query_expansion_dense_fanout is False

    def test_invalid_query_expansion_config_falls_back(
        self,
        tmp_path: Path,
        caplog: pytest.LogCaptureFixture,
    ) -> None:
        caplog.set_level("WARNING", logger="cocoindex_code.config")
        with patch.dict(
            "os.environ",
            {
                "COCOINDEX_CODE_ROOT_PATH": str(tmp_path),
                "COCOINDEX_QUERY_EXPANSION": "maybe",
                "COCOINDEX_QUERY_EXPANSION_MAX_VARIANTS": "0",
                "COCOINDEX_QUERY_EXPANSION_SYNONYMS": '{"walker":"finder"}',
                "COCOINDEX_QUERY_EXPANSION_DENSE_FANOUT": "sometimes",
            },
            clear=True,
        ):
            cfg = Config.from_env()

        assert cfg.query_expansion is _DEFAULT_QUERY_EXPANSION
        assert cfg.query_expansion_max_variants == _DEFAULT_QUERY_EXPANSION_MAX_VARIANTS
        assert cfg.query_expansion_synonyms == _DEFAULT_SYNONYMS
        assert cfg.query_expansion_dense_fanout is True
        assert "Ignoring invalid COCOINDEX_QUERY_EXPANSION='maybe'" in caplog.text
        assert "Ignoring invalid COCOINDEX_QUERY_EXPANSION_MAX_VARIANTS='0'" in caplog.text
        assert "COCOINDEX_QUERY_EXPANSION_SYNONYMS parsed to empty dict" in caplog.text
        assert "Ignoring invalid COCOINDEX_QUERY_EXPANSION_DENSE_FANOUT='sometimes'" in caplog.text


class TestMirrorConfigValidation:
    def test_default_mirror_config(self, tmp_path: Path) -> None:
        with patch.dict(
            "os.environ",
            {"COCOINDEX_CODE_ROOT_PATH": str(tmp_path)},
            clear=True,
        ):
            cfg = Config.from_env()

        assert _DEFAULT_CANONICAL_MIRROR == ".opencode"
        assert cfg.canonical_mirror == ".opencode/"
        assert cfg.mirror_prefixes == _DEFAULT_MIRROR_PREFIXES

    def test_mirror_prefixes_normalize_trailing_slashes(self, tmp_path: Path) -> None:
        with patch.dict(
            "os.environ",
            {
                "COCOINDEX_CODE_ROOT_PATH": str(tmp_path),
                "COCOINDEX_MIRROR_PREFIXES": '[".opencode", ".cursor/"]',
                "COCOINDEX_CANONICAL_MIRROR": ".cursor/",
            },
            clear=True,
        ):
            cfg = Config.from_env()

        assert cfg.mirror_prefixes == [".opencode/", ".cursor/"]
        assert cfg.canonical_mirror == ".cursor/"

    def test_empty_mirror_prefixes_are_valid_opt_out(self, tmp_path: Path) -> None:
        with patch.dict(
            "os.environ",
            {
                "COCOINDEX_CODE_ROOT_PATH": str(tmp_path),
                "COCOINDEX_MIRROR_PREFIXES": "[]",
            },
            clear=True,
        ):
            cfg = Config.from_env()

        assert cfg.mirror_prefixes == []

    def test_invalid_empty_canonical_mirror_falls_back(
        self,
        tmp_path: Path,
        caplog: pytest.LogCaptureFixture,
    ) -> None:
        caplog.set_level("WARNING", logger="cocoindex_code.config")
        with patch.dict(
            "os.environ",
            {
                "COCOINDEX_CODE_ROOT_PATH": str(tmp_path),
                "COCOINDEX_CANONICAL_MIRROR": "   ",
            },
            clear=True,
        ):
            cfg = Config.from_env()

        assert cfg.canonical_mirror == ".opencode/"
        assert "Ignoring empty COCOINDEX_CANONICAL_MIRROR" in caplog.text
