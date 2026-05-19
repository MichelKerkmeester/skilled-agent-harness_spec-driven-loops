"""Configuration management for cocoindex-code."""

from __future__ import annotations

import json
import logging
import os
from dataclasses import dataclass
from pathlib import Path

_DEFAULT_MODEL = "sbert/jinaai/jina-embeddings-v2-base-code"
_DEFAULT_CHUNK_SIZE = 1500
_DEFAULT_CHUNK_OVERLAP = 200
_DEFAULT_MIN_CHUNK_SIZE = 250
_DEFAULT_CODE_AWARE_CHUNKING = True
_DEFAULT_TREE_SITTER_LANGUAGES: dict[str, object] = {}
_DEFAULT_HYBRID_VECTOR_WEIGHT = 0.7
_DEFAULT_HYBRID_FTS5_WEIGHT = 0.7
_DEFAULT_HYBRID_RRF_K = 60
_DEFAULT_RERANK_MODEL = "BAAI/bge-reranker-v2-m3"
_DEFAULT_RERANK_TOP_K = 20
_DEFAULT_CANONICAL_MIRROR = ".opencode"
_DEFAULT_MIRROR_PREFIXES = [".opencode/", ".codex/", ".gemini/", ".claude/"]
# ADR-015 Phase 2: path-class boost defaults from 011 deep-research iter 10
# Multiplies the cross-encoder score per QueryResult.path_class. Flag-gated by
# COCOINDEX_RERANK_PATH_CLASS_BOOST. Override via COCOINDEX_RERANK_PATH_CLASS_FACTORS.
_DEFAULT_PATH_CLASS_FACTORS: dict[str, float] = {
    "implementation": 1.00,
    "tests": 0.85,
    "docs": 0.85,
    "generated": 0.95,
    "vendor": 0.70,
    "spec_research": 0.90,
}
_VALID_DEVICES = {"cuda", "mps", "cpu"}

logger = logging.getLogger(__name__)


def _find_root_with_marker(start: Path, markers: list[str]) -> Path | None:
    """Walk up from start, return first directory containing any marker."""
    current = start
    while True:
        if any((current / m).exists() for m in markers):
            return current
        parent = current.parent
        if parent == current:
            return None
        current = parent


def _discover_codebase_root() -> Path:
    """Discover the codebase root directory.

    Discovery order:
    1. Find nearest parent with `.cocoindex_code` directory (re-anchor to previously-indexed tree)
    2. Find nearest parent with any common project root marker
    3. Fall back to current working directory
    """
    cwd = Path.cwd()

    # First, look for existing .cocoindex_code directory
    root = _find_root_with_marker(cwd, [".cocoindex_code"])
    if root is not None:
        return root

    # Then, look for common project root markers
    markers = [".git", "pyproject.toml", "package.json", "Cargo.toml", "go.mod"]
    root = _find_root_with_marker(cwd, markers)
    return root if root is not None else cwd


def _resolve_device(env_override: str | None) -> str | None:
    """Resolve compute device for embedder inference.

    Resolution order:
    1. env_override (caller-supplied COCOINDEX_CODE_DEVICE) if valid
    2. Probe PyTorch backends in preference CUDA -> MPS -> CPU
    3. Return None if PyTorch not importable (let downstream framework choose)

    Lazy torch import keeps config import cheap when downstream doesn't need device hints.
    """
    if env_override:
        normalized = env_override.strip().lower()
        if normalized in _VALID_DEVICES:
            return normalized
        logger.warning(
            "Ignoring invalid COCOINDEX_CODE_DEVICE=%r; expected one of %s",
            env_override,
            sorted(_VALID_DEVICES),
        )

    try:
        import torch  # noqa: PLC0415 — lazy import; torch is heavy
    except ImportError:
        return None

    if torch.cuda.is_available():
        return "cuda"
    if torch.backends.mps.is_available():
        return "mps"
    return "cpu"


def _parse_json_string_list_env(var_name: str) -> list[str]:
    """Parse an environment variable as a JSON array of strings."""
    raw_value = os.environ.get(var_name, "")
    if not raw_value.strip():
        return []

    try:
        parsed = json.loads(raw_value)
    except json.JSONDecodeError as exc:
        raise ValueError(f"{var_name} must be a JSON array of strings, got invalid JSON") from exc

    if not isinstance(parsed, list):
        raise ValueError(f"{var_name} must be a JSON array of strings")

    result: list[str] = []
    for item in parsed:
        if not isinstance(item, str):
            raise ValueError(f"{var_name} must be a JSON array of strings")
        item = item.strip()
        if item:
            result.append(item)

    return result


def _normalize_mirror_prefix(prefix: str) -> str:
    """Normalize mirror prefixes to the form used by file_path startswith checks."""
    normalized = prefix.strip()
    if not normalized:
        return ""
    return normalized if normalized.endswith("/") else f"{normalized}/"


def _parse_mirror_prefixes_env() -> list[str]:
    """Parse COCOINDEX_MIRROR_PREFIXES, preserving [] as an explicit opt-out."""
    raw_value = os.environ.get("COCOINDEX_MIRROR_PREFIXES")
    if raw_value is None or not raw_value.strip():
        return list(_DEFAULT_MIRROR_PREFIXES)

    prefixes = _parse_json_string_list_env("COCOINDEX_MIRROR_PREFIXES")
    normalized: list[str] = []
    seen: set[str] = set()
    for prefix in prefixes:
        normalized_prefix = _normalize_mirror_prefix(prefix)
        if normalized_prefix and normalized_prefix not in seen:
            normalized.append(normalized_prefix)
            seen.add(normalized_prefix)
    return normalized


def _parse_canonical_mirror_env(mirror_prefixes: list[str]) -> str:
    """Parse COCOINDEX_CANONICAL_MIRROR with default fallback and warning."""
    raw_value = os.environ.get("COCOINDEX_CANONICAL_MIRROR", _DEFAULT_CANONICAL_MIRROR)
    stripped = raw_value.strip()
    if not stripped:
        logger.warning(
            "Ignoring empty COCOINDEX_CANONICAL_MIRROR; falling back to %r",
            _DEFAULT_CANONICAL_MIRROR,
        )
        return _normalize_mirror_prefix(_DEFAULT_CANONICAL_MIRROR)

    recognized = set(_DEFAULT_MIRROR_PREFIXES) | set(mirror_prefixes)
    normalized = _normalize_mirror_prefix(stripped)
    if stripped.endswith("/") or normalized in recognized:
        return normalized

    logger.warning(
        "Ignoring invalid COCOINDEX_CANONICAL_MIRROR=%r; expected a known mirror or trailing slash; falling back to %r",
        raw_value,
        _DEFAULT_CANONICAL_MIRROR,
    )
    return _normalize_mirror_prefix(_DEFAULT_CANONICAL_MIRROR)


def _parse_json_dict_env(
    var_name: str,
    default: dict[str, float],
    *,
    min_value: float = 0.0,
    max_value: float = 5.0,
) -> dict[str, float]:
    """Parse a JSON dict env var with float values. Falls back to default on malformed input."""
    raw_value = os.environ.get(var_name, "")
    if not raw_value.strip():
        return dict(default)

    try:
        parsed = json.loads(raw_value)
    except json.JSONDecodeError:
        logger.warning(
            "Ignoring invalid %s=%r; expected JSON dict of {str: float}; falling back to default",
            var_name,
            raw_value,
        )
        return dict(default)

    if not isinstance(parsed, dict):
        logger.warning(
            "Ignoring invalid %s=%r; expected JSON dict; falling back to default",
            var_name,
            raw_value,
        )
        return dict(default)

    result: dict[str, float] = {}
    for key, value in parsed.items():
        if not isinstance(key, str):
            logger.warning("Ignoring non-string key %r in %s; skipping", key, var_name)
            continue
        try:
            num = float(value)
        except (TypeError, ValueError):
            logger.warning(
                "Ignoring non-numeric value for key %r in %s; skipping",
                key,
                var_name,
            )
            continue
        if not (min_value <= num <= max_value):
            logger.warning(
                "Ignoring out-of-range value %s for key %r in %s; expected %s..%s",
                num,
                key,
                var_name,
                min_value,
                max_value,
            )
            continue
        result[key] = num

    if not result:
        logger.warning(
            "%s parsed to empty dict; falling back to default factors",
            var_name,
        )
        return dict(default)
    return result


def _parse_json_object_env(
    var_name: str,
    default: dict[str, object],
) -> dict[str, object]:
    """Parse a JSON object env var with string keys."""
    raw_value = os.environ.get(var_name, "")
    if not raw_value.strip():
        return dict(default)

    try:
        parsed = json.loads(raw_value)
    except json.JSONDecodeError:
        logger.warning(
            "Ignoring invalid %s=%r; expected JSON object; falling back to default",
            var_name,
            raw_value,
        )
        return dict(default)

    if not isinstance(parsed, dict):
        logger.warning(
            "Ignoring invalid %s=%r; expected JSON dict; falling back to default",
            var_name,
            raw_value,
        )
        return dict(default)

    result: dict[str, object] = {}
    for key, value in parsed.items():
        if not isinstance(key, str):
            logger.warning(
                "Ignoring invalid key %r in %s; expected string key",
                key,
                var_name,
            )
            continue
        key = key.strip()
        if key:
            result[key] = value

    return result


def _parse_int_env(
    var_name: str,
    default: int,
    min_value: int,
    max_value: int,
) -> int:
    """Parse a bounded integer environment variable with default fallback."""
    raw_value = os.environ.get(var_name)
    if raw_value is None or not raw_value.strip():
        return default

    try:
        value = int(raw_value)
    except ValueError:
        logger.warning(
            "Ignoring invalid %s=%r; expected integer between %s and %s; falling back to %s",
            var_name,
            raw_value,
            min_value,
            max_value,
            default,
        )
        return default

    if min_value <= value <= max_value:
        return value

    logger.warning(
        "Ignoring invalid %s=%r; expected integer between %s and %s; falling back to %s",
        var_name,
        raw_value,
        min_value,
        max_value,
        default,
    )
    return default


def _parse_bool_env(var_name: str, default: bool) -> bool:
    """Parse a boolean environment variable with common truthy/falsy values."""
    raw_value = os.environ.get(var_name)
    if raw_value is None or not raw_value.strip():
        return default

    normalized = raw_value.strip().lower()
    if normalized in {"1", "true", "yes", "on"}:
        return True
    if normalized in {"0", "false", "no", "off"}:
        return False

    logger.warning(
        "Ignoring invalid %s=%r; expected boolean; falling back to %s",
        var_name,
        raw_value,
        default,
    )
    return default


def _parse_float_env(
    var_name: str,
    default: float,
    min_value: float,
    max_value: float,
) -> float:
    """Parse a bounded float environment variable with default fallback."""
    raw_value = os.environ.get(var_name)
    if raw_value is None or not raw_value.strip():
        return default

    try:
        value = float(raw_value)
    except ValueError:
        logger.warning(
            "Ignoring invalid %s=%r; expected float between %s and %s; falling back to %s",
            var_name,
            raw_value,
            min_value,
            max_value,
            default,
        )
        return default

    if min_value <= value <= max_value:
        return value

    logger.warning(
        "Ignoring invalid %s=%r; expected float between %s and %s; falling back to %s",
        var_name,
        raw_value,
        min_value,
        max_value,
        default,
    )
    return default


def _is_registered_embedder(name: str) -> bool:
    from cocoindex_code.registered_embedders import get_embedder_metadata  # noqa: PLC0415

    return get_embedder_metadata(name) is not None


@dataclass
class Config:
    """Configuration loaded from environment variables."""

    codebase_root_path: Path
    embedding_model: str
    index_dir: Path
    device: str | None
    extra_extensions: dict[str, str | None]
    excluded_patterns: list[str]
    chunk_size: int
    chunk_overlap: int
    min_chunk_size: int
    code_aware_chunking: bool
    tree_sitter_languages: dict[str, object]
    hybrid_enabled: bool
    hybrid_vector_weight: float
    hybrid_fts5_weight: float
    hybrid_rrf_k: int
    rerank_enabled: bool
    rerank_model: str
    rerank_top_k: int
    rerank_path_class_boost: bool
    rerank_path_class_factors: dict[str, float]
    rerank_adapter: str
    canonical_mirror: str
    mirror_prefixes: list[str]

    @classmethod
    def from_env(cls) -> Config:
        """Load configuration from environment variables."""
        # Get root path from env or discover it
        root_path_str = os.environ.get("COCOINDEX_CODE_ROOT_PATH")
        if root_path_str:
            root = Path(root_path_str).resolve()
            if not root.exists():
                logger.warning(
                    "Ignoring COCOINDEX_CODE_ROOT_PATH=%r because it does not exist; falling back to discovery",
                    root_path_str,
                )
                root = _discover_codebase_root()
        else:
            root = _discover_codebase_root()

        # Get embedding model
        # Prefix "sbert/" for SentenceTransformers models, otherwise LiteLLM.
        embedding_model = os.environ.get(
            "COCOINDEX_CODE_EMBEDDING_MODEL",
            _DEFAULT_MODEL,
        )
        if not _is_registered_embedder(embedding_model):
            logger.warning(
                "Ignoring unknown COCOINDEX_CODE_EMBEDDING_MODEL=%r; falling back to %r",
                embedding_model,
                _DEFAULT_MODEL,
            )
            embedding_model = _DEFAULT_MODEL

        # Index directory is always under the root
        index_dir = root / ".cocoindex_code"

        # Device: env override wins; otherwise probe CUDA -> MPS -> CPU
        device = _resolve_device(os.environ.get("COCOINDEX_CODE_DEVICE"))

        # Extra file extensions (format: "inc:php,yaml,toml" — optional lang after colon)
        raw_extra = os.environ.get("COCOINDEX_CODE_EXTRA_EXTENSIONS", "")
        extra_extensions: dict[str, str | None] = {}
        for token in raw_extra.split(","):
            token = token.strip()
            if not token:
                continue
            if ":" in token:
                ext, lang = token.split(":", 1)
                extra_extensions[f".{ext.strip()}"] = lang.strip() or None
            else:
                extra_extensions[f".{token}"] = None

        # Excluded file glob patterns
        excluded_patterns = _parse_json_string_list_env("COCOINDEX_CODE_EXCLUDED_PATTERNS")

        chunk_size = _parse_int_env(
            "COCOINDEX_CODE_CHUNK_SIZE",
            _DEFAULT_CHUNK_SIZE,
            100,
            8000,
        )
        chunk_overlap = _parse_int_env(
            "COCOINDEX_CODE_CHUNK_OVERLAP",
            _DEFAULT_CHUNK_OVERLAP,
            0,
            1000,
        )
        min_chunk_size = _parse_int_env(
            "COCOINDEX_CODE_MIN_CHUNK_SIZE",
            _DEFAULT_MIN_CHUNK_SIZE,
            50,
            1000,
        )
        code_aware_chunking = _parse_bool_env(
            "COCOINDEX_CODE_AWARE_CHUNKING",
            _DEFAULT_CODE_AWARE_CHUNKING,
        )
        tree_sitter_languages = _parse_json_object_env(
            "COCOINDEX_TREE_SITTER_LANGUAGES",
            _DEFAULT_TREE_SITTER_LANGUAGES,
        )
        hybrid_enabled = _parse_bool_env("COCOINDEX_HYBRID", True)
        hybrid_vector_weight = _parse_float_env(
            "COCOINDEX_HYBRID_VECTOR_WEIGHT",
            _DEFAULT_HYBRID_VECTOR_WEIGHT,
            0.0,
            2.0,
        )
        hybrid_fts5_weight = _parse_float_env(
            "COCOINDEX_HYBRID_FTS5_WEIGHT",
            _DEFAULT_HYBRID_FTS5_WEIGHT,
            0.0,
            2.0,
        )
        hybrid_rrf_k = _parse_int_env(
            "COCOINDEX_HYBRID_RRF_K",
            _DEFAULT_HYBRID_RRF_K,
            1,
            500,
        )
        rerank_enabled = _parse_bool_env("COCOINDEX_RERANK", True)
        rerank_model = os.environ.get("COCOINDEX_RERANK_MODEL", _DEFAULT_RERANK_MODEL).strip()
        if not rerank_model:
            logger.warning(
                "Ignoring empty COCOINDEX_RERANK_MODEL; falling back to %r",
                _DEFAULT_RERANK_MODEL,
            )
            rerank_model = _DEFAULT_RERANK_MODEL
        rerank_top_k = _parse_int_env(
            "COCOINDEX_RERANK_TOP_K",
            _DEFAULT_RERANK_TOP_K,
            5,
            100,
        )
        rerank_path_class_boost = _parse_bool_env(
            "COCOINDEX_RERANK_PATH_CLASS_BOOST",
            False,
        )
        rerank_path_class_factors = _parse_json_dict_env(
            "COCOINDEX_RERANK_PATH_CLASS_FACTORS",
            _DEFAULT_PATH_CLASS_FACTORS,
        )
        rerank_adapter = os.environ.get("COCOINDEX_RERANK_ADAPTER", "").strip().lower()
        mirror_prefixes = _parse_mirror_prefixes_env()
        canonical_mirror = _parse_canonical_mirror_env(mirror_prefixes)

        return cls(
            codebase_root_path=root,
            embedding_model=embedding_model,
            index_dir=index_dir,
            device=device,
            extra_extensions=extra_extensions,
            excluded_patterns=excluded_patterns,
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            min_chunk_size=min_chunk_size,
            code_aware_chunking=code_aware_chunking,
            tree_sitter_languages=tree_sitter_languages,
            hybrid_enabled=hybrid_enabled,
            hybrid_vector_weight=hybrid_vector_weight,
            hybrid_fts5_weight=hybrid_fts5_weight,
            hybrid_rrf_k=hybrid_rrf_k,
            rerank_enabled=rerank_enabled,
            rerank_model=rerank_model,
            rerank_top_k=rerank_top_k,
            rerank_path_class_boost=rerank_path_class_boost,
            rerank_path_class_factors=rerank_path_class_factors,
            rerank_adapter=rerank_adapter,
            canonical_mirror=canonical_mirror,
            mirror_prefixes=mirror_prefixes,
        )

    @property
    def target_sqlite_db_path(self) -> Path:
        """Path to the vector index SQLite database."""
        return self.index_dir / "target_sqlite.db"

    @property
    def cocoindex_db_path(self) -> Path:
        """Path to the CocoIndex state database."""
        return self.index_dir / "cocoindex.db"


# Module-level singleton — imported directly by all modules that need configuration
config: Config = Config.from_env()
