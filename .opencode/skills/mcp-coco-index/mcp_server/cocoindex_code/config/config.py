"""Configuration management for cocoindex-code."""

from __future__ import annotations

import json
import logging
import os
from dataclasses import dataclass
from pathlib import Path

from ..core.path_utils import normalize_mirror_prefix
from ..retrieval.query_expansion import _DEFAULT_SYNONYMS
from ..embedders.registry import embedder_for, reranker_for
from ..embedders.registered_embedders import (
    DEFAULT_EMBEDDER_NAME,
    DEFAULT_RERANKER_NAME,
    commercial_safe_embedder_alternatives,
    commercial_safe_reranker_alternatives,
)

_DEFAULT_MODEL = DEFAULT_EMBEDDER_NAME  # 018 follow-on: ties bge-code-v1 on hit rate (12/13/14 across BGE/BGE+path-class/jina-v3 lanes) with ~10% lower median latency; supersedes jina-v2-base-code default
_DEFAULT_CHUNK_SIZE = 1500
_DEFAULT_CHUNK_OVERLAP = 200
_DEFAULT_MIN_CHUNK_SIZE = 250
# Module-level default for COCOINDEX_RERANK_VIA_SIDECAR (used by both
# Config.from_env below AND rerankers/reranker.py::_rerank_via_sidecar_enabled
# at runtime). Single source of truth prevents silent drift between the two
# code paths that parse the env var independently (022/006 dedup).
_DEFAULT_RERANK_VIA_SIDECAR = True
_DEFAULT_CODE_AWARE_CHUNKING = True
_DEFAULT_TREE_SITTER_LANGUAGES: dict[str, object] = {}
_DEFAULT_HYBRID_VECTOR_WEIGHT = 0.9  # 017 empirical: tied hit rate across V=[0.7,0.9], V=0.9 picks lower p95
_DEFAULT_HYBRID_FTS5_WEIGHT = 0.5  # 017 empirical: tied hit rate across F=[0.5,0.7], F=0.5 picks lower p95
_DEFAULT_HYBRID_RRF_K = 60  # 017 empirical: K=[30,60,90,120] all tied at 12/18 hits; keep canonical 60
_DEFAULT_RERANK_MODEL = DEFAULT_RERANKER_NAME  # 023B empirical: Qwen3-0.6B beat jina-v3 on 73-probe expanded fixture (30/73 vs 29/73, -32% p95, Apache-2.0); jina-v3 retained as opt-in fallback
_DEFAULT_RERANK_TOP_K = 20
_DEFAULT_QUERY_EXPANSION = False  # 016 empirical: ON regressed 14/13/12 → 12/12/12 on corrected fixture; ships opt-in pending 017 RRF tuning
_DEFAULT_QUERY_EXPANSION_MAX_VARIANTS = 6
_DEFAULT_QUERY_EXPANSION_DENSE_FANOUT = True
_DEFAULT_CANONICAL_MIRROR = ".opencode"
_DEFAULT_MIRROR_PREFIXES = [".opencode/", ".codex/", ".gemini/", ".claude/"]
_DEFAULT_SEARCH_MAX_OFFSET = 1000
_DEFAULT_SEARCH_MAX_LIMIT = 200
_DEFAULT_SEARCH_MAX_FETCH_K = 4000
_DEFAULT_SEARCH_MAX_LANGUAGES = 8
_DEFAULT_SEARCH_PATH_FULLSCAN_ALLOWED = False
_DEFAULT_SEARCH_TIMEOUT_SEC = 10.0
# ADR-015 Phase 2: path-class boost defaults from 011 deep-research iter 10.
# These factors are embedder-independent metadata, but the empirical evidence is
# BGE path-class lane only; future reranker families must revalidate before
# composing the default factors with their score distribution. Flag-gated by
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
_MAX_JSON_ENV_BYTES = 10_000
_MAX_JSON_LIST_ITEMS = 100
_MAX_JSON_DICT_ITEMS = 100

logger = logging.getLogger(__name__)


class CommercialSafeProfileError(ValueError):
    """Raised when COCOINDEX_COMMERCIAL_SAFE_PROFILE blocks an active model."""


def _commercial_safe_error(
    *,
    model_kind: str,
    model_name: str,
    license_name: str,
    alternatives: list[str],
) -> CommercialSafeProfileError:
    payload = {
        "error": "COCOINDEX_COMMERCIAL_SAFE_PROFILE_MODEL_BLOCKED",
        "model_kind": model_kind,
        "model_name": model_name,
        "license": license_name,
        "commercial_safe": False,
        "alternatives": alternatives,
        "remediation": "Choose a commercial-safe model or unset COCOINDEX_COMMERCIAL_SAFE_PROFILE.",
    }
    return CommercialSafeProfileError(json.dumps(payload, sort_keys=True))


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
    _validate_json_env_size(var_name, raw_value)

    try:
        parsed = json.loads(raw_value)
    except json.JSONDecodeError as exc:
        raise ValueError(f"{var_name} must be a JSON array of strings, got invalid JSON") from exc

    if not isinstance(parsed, list):
        raise ValueError(f"{var_name} must be a JSON array of strings")
    if len(parsed) > _MAX_JSON_LIST_ITEMS:
        raise ValueError(f"{var_name} must contain at most {_MAX_JSON_LIST_ITEMS} items")

    result: list[str] = []
    for item in parsed:
        if not isinstance(item, str):
            raise ValueError(f"{var_name} must be a JSON array of strings")
        item = item.strip()
        if item:
            result.append(item)

    return result


def _validate_json_env_size(var_name: str, raw_value: str) -> None:
    if len(raw_value.encode("utf-8")) > _MAX_JSON_ENV_BYTES:
        raise ValueError(f"{var_name} must be at most {_MAX_JSON_ENV_BYTES} bytes")


def _parse_mirror_prefixes_env() -> list[str]:
    """Parse COCOINDEX_MIRROR_PREFIXES, preserving [] as an explicit opt-out."""
    raw_value = os.environ.get("COCOINDEX_MIRROR_PREFIXES")
    if raw_value is None or not raw_value.strip():
        return list(_DEFAULT_MIRROR_PREFIXES)

    prefixes = _parse_json_string_list_env("COCOINDEX_MIRROR_PREFIXES")
    normalized: list[str] = []
    seen: set[str] = set()
    for prefix in prefixes:
        try:
            normalized_prefix = normalize_mirror_prefix(prefix)
        except ValueError as exc:
            logger.warning("Ignoring invalid mirror prefix %r in COCOINDEX_MIRROR_PREFIXES: %s", prefix, exc)
            continue
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
        return normalize_mirror_prefix(_DEFAULT_CANONICAL_MIRROR)

    recognized = set(_DEFAULT_MIRROR_PREFIXES) | set(mirror_prefixes)
    try:
        normalized = normalize_mirror_prefix(stripped)
    except ValueError as exc:
        logger.warning(
            "Ignoring invalid COCOINDEX_CANONICAL_MIRROR=%r: %s; falling back to %r",
            raw_value,
            exc,
            _DEFAULT_CANONICAL_MIRROR,
        )
        return normalize_mirror_prefix(_DEFAULT_CANONICAL_MIRROR)
    if stripped.endswith("/") or normalized in recognized:
        return normalized

    logger.warning(
        "Ignoring invalid COCOINDEX_CANONICAL_MIRROR=%r; expected a known mirror or trailing slash; falling back to %r",
        raw_value,
        _DEFAULT_CANONICAL_MIRROR,
    )
    return normalize_mirror_prefix(_DEFAULT_CANONICAL_MIRROR)


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
        _validate_json_env_size(var_name, raw_value)
    except ValueError as exc:
        logger.warning("%s; falling back to default", exc)
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
    if len(parsed) > _MAX_JSON_DICT_ITEMS:
        logger.warning(
            "Ignoring invalid %s; expected at most %s entries; falling back to default",
            var_name,
            _MAX_JSON_DICT_ITEMS,
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
        _validate_json_env_size(var_name, raw_value)
    except ValueError as exc:
        logger.warning("%s; falling back to default", exc)
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
    if len(parsed) > _MAX_JSON_DICT_ITEMS:
        logger.warning(
            "Ignoring invalid %s; expected at most %s entries; falling back to default",
            var_name,
            _MAX_JSON_DICT_ITEMS,
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


def _parse_json_string_list_dict_env(
    var_name: str,
    default: dict[str, list[str]],
) -> dict[str, list[str]]:
    """Parse a JSON dict env var with string keys and list-of-string values."""
    raw_value = os.environ.get(var_name, "")
    if not raw_value.strip():
        return {key: list(values) for key, values in default.items()}
    try:
        _validate_json_env_size(var_name, raw_value)
    except ValueError as exc:
        logger.warning("%s; falling back to default", exc)
        return {key: list(values) for key, values in default.items()}

    try:
        parsed = json.loads(raw_value)
    except json.JSONDecodeError:
        logger.warning(
            "Ignoring invalid %s=%r; expected JSON dict of {str: list[str]}; falling back to default",
            var_name,
            raw_value,
        )
        return {key: list(values) for key, values in default.items()}

    if not isinstance(parsed, dict):
        logger.warning(
            "Ignoring invalid %s=%r; expected JSON dict; falling back to default",
            var_name,
            raw_value,
        )
        return {key: list(values) for key, values in default.items()}
    if len(parsed) > _MAX_JSON_DICT_ITEMS:
        logger.warning(
            "Ignoring invalid %s; expected at most %s entries; falling back to default",
            var_name,
            _MAX_JSON_DICT_ITEMS,
        )
        return {key: list(values) for key, values in default.items()}

    result: dict[str, list[str]] = {}
    for key, value in parsed.items():
        if not isinstance(key, str):
            logger.warning("Ignoring non-string key %r in %s; skipping", key, var_name)
            continue
        normalized_key = key.strip().lower()
        if not normalized_key:
            continue
        if not isinstance(value, list):
            logger.warning(
                "Ignoring non-list value for key %r in %s; skipping",
                key,
                var_name,
            )
            continue
        synonyms = [item.strip().lower() for item in value if isinstance(item, str) and item.strip()]
        if synonyms:
            result[normalized_key] = synonyms

    if not result:
        logger.warning(
            "%s parsed to empty dict; falling back to default synonyms",
            var_name,
        )
        return {key: list(values) for key, values in default.items()}
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


def _warn_on_semantic_rrf_config(
    *,
    hybrid_enabled: bool,
    vector_weight: float,
    fts5_weight: float,
    rrf_k: int,
) -> None:
    """Warn on semantically suspicious RRF combinations after bounded parsing."""
    if not hybrid_enabled:
        return
    if vector_weight == 0.0 and fts5_weight == 0.0:
        logger.warning("Hybrid RRF has both vector and FTS5 weights set to 0.0; fusion will have no signal")
    elif vector_weight == 0.0:
        logger.warning("Hybrid RRF vector weight is 0.0; dense retrieval lane is disabled")
    elif fts5_weight == 0.0:
        logger.warning("Hybrid RRF FTS5 weight is 0.0; lexical retrieval lane is disabled")
    if vector_weight == 2.0 or fts5_weight == 2.0:
        logger.warning("Hybrid RRF weight at upper bound 2.0; verify score-scale behavior before relying on this")
    if rrf_k <= 5:
        logger.warning("Hybrid RRF K=%s is very low; ranking may become overly sensitive to top positions", rrf_k)


def _is_registered_embedder(name: str) -> bool:
    try:
        embedder_for(name)
    except KeyError:
        return False
    return True


def _enforce_commercial_safe_profile(
    *,
    enabled: bool,
    embedding_model: str,
    rerank_enabled: bool,
    rerank_model: str,
) -> None:
    """Block active non-commercial-safe models when the operator opts in."""
    if not enabled:
        return

    try:
        embedder = embedder_for(embedding_model)
    except KeyError:
        embedder = None
    if embedder is not None and not embedder.commercial_safe:
        raise _commercial_safe_error(
            model_kind="embedder",
            model_name=embedding_model,
            license_name=embedder.license,
            alternatives=commercial_safe_embedder_alternatives(),
        )

    if not rerank_enabled:
        return

    try:
        reranker = reranker_for(rerank_model)
    except KeyError:
        reranker = None
    if reranker is not None and not reranker.commercial_safe:
        raise _commercial_safe_error(
            model_kind="reranker",
            model_name=rerank_model,
            license_name=reranker.license,
            alternatives=commercial_safe_reranker_alternatives(),
        )


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
    rerank_via_sidecar: bool
    commercial_safe_profile: bool
    query_expansion: bool
    query_expansion_max_variants: int
    query_expansion_synonyms: dict[str, list[str]]
    query_expansion_dense_fanout: bool
    canonical_mirror: str
    mirror_prefixes: list[str]
    search_max_offset: int
    search_max_limit: int
    search_max_fetch_k: int
    search_max_languages: int
    search_path_fullscan_allowed: bool
    search_timeout_sec: float

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
        _warn_on_semantic_rrf_config(
            hybrid_enabled=hybrid_enabled,
            vector_weight=hybrid_vector_weight,
            fts5_weight=hybrid_fts5_weight,
            rrf_k=hybrid_rrf_k,
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
        rerank_via_sidecar = _parse_bool_env("COCOINDEX_RERANK_VIA_SIDECAR", _DEFAULT_RERANK_VIA_SIDECAR)
        commercial_safe_profile = _parse_bool_env("COCOINDEX_COMMERCIAL_SAFE_PROFILE", False)
        _enforce_commercial_safe_profile(
            enabled=commercial_safe_profile,
            embedding_model=embedding_model,
            rerank_enabled=rerank_enabled,
            rerank_model=rerank_model,
        )
        query_expansion = _parse_bool_env(
            "COCOINDEX_QUERY_EXPANSION",
            _DEFAULT_QUERY_EXPANSION,
        )
        query_expansion_max_variants = _parse_int_env(
            "COCOINDEX_QUERY_EXPANSION_MAX_VARIANTS",
            _DEFAULT_QUERY_EXPANSION_MAX_VARIANTS,
            1,
            32,
        )
        query_expansion_synonyms = _parse_json_string_list_dict_env(
            "COCOINDEX_QUERY_EXPANSION_SYNONYMS",
            _DEFAULT_SYNONYMS,
        )
        query_expansion_dense_fanout = _parse_bool_env(
            "COCOINDEX_QUERY_EXPANSION_DENSE_FANOUT",
            _DEFAULT_QUERY_EXPANSION_DENSE_FANOUT,
        )
        mirror_prefixes = _parse_mirror_prefixes_env()
        canonical_mirror = _parse_canonical_mirror_env(mirror_prefixes)
        search_max_offset = _parse_int_env(
            "COCOINDEX_SEARCH_MAX_OFFSET",
            _DEFAULT_SEARCH_MAX_OFFSET,
            0,
            1_000_000,
        )
        search_max_limit = _parse_int_env(
            "COCOINDEX_SEARCH_MAX_LIMIT",
            _DEFAULT_SEARCH_MAX_LIMIT,
            1,
            10_000,
        )
        search_max_fetch_k = _parse_int_env(
            "COCOINDEX_SEARCH_MAX_FETCH_K",
            _DEFAULT_SEARCH_MAX_FETCH_K,
            1,
            1_000_000,
        )
        search_max_languages = _parse_int_env(
            "COCOINDEX_SEARCH_MAX_LANGUAGES",
            _DEFAULT_SEARCH_MAX_LANGUAGES,
            1,
            1000,
        )
        search_path_fullscan_allowed = _parse_bool_env(
            "COCOINDEX_SEARCH_PATH_FULLSCAN_ALLOWED",
            _DEFAULT_SEARCH_PATH_FULLSCAN_ALLOWED,
        )
        search_timeout_sec = _parse_float_env(
            "COCOINDEX_SEARCH_TIMEOUT_SEC",
            _DEFAULT_SEARCH_TIMEOUT_SEC,
            0.1,
            600.0,
        )

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
            rerank_via_sidecar=rerank_via_sidecar,
            commercial_safe_profile=commercial_safe_profile,
            query_expansion=query_expansion,
            query_expansion_max_variants=query_expansion_max_variants,
            query_expansion_synonyms=query_expansion_synonyms,
            query_expansion_dense_fanout=query_expansion_dense_fanout,
            canonical_mirror=canonical_mirror,
            mirror_prefixes=mirror_prefixes,
            search_max_offset=search_max_offset,
            search_max_limit=search_max_limit,
            search_max_fetch_k=search_max_fetch_k,
            search_max_languages=search_max_languages,
            search_path_fullscan_allowed=search_path_fullscan_allowed,
            search_timeout_sec=search_timeout_sec,
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
