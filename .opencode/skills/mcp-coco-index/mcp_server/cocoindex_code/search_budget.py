"""Search request budget validation."""

from __future__ import annotations

import logging
import os
from dataclasses import dataclass
from typing import Any

logger = logging.getLogger(__name__)

_DEFAULT_MAX_OFFSET = 1000
_DEFAULT_MAX_LIMIT = 200
_DEFAULT_MAX_FETCH_K = 4000
_DEFAULT_MAX_LANGUAGES = 8
_DEFAULT_PATH_FULLSCAN_ALLOWED = False
_DEFAULT_TIMEOUT_SEC = 10.0
_WILDCARDS = {"*", "?", "["}


class SearchBudgetExceeded(ValueError):
    """Raised when a search request exceeds configured request-budget bounds."""

    def __init__(
        self,
        *,
        budget_field: str,
        actual: object,
        limit: object,
        suggestion: str,
    ) -> None:
        self.budget_field = budget_field
        self.actual = actual
        self.limit = limit
        self.suggestion = suggestion
        super().__init__(
            f"SearchBudgetExceeded(field={budget_field}, actual={actual}, "
            f"limit={limit}, suggestion={suggestion})"
        )

    def as_dict(self) -> dict[str, object]:
        return {
            "budget_field": self.budget_field,
            "actual": self.actual,
            "limit": self.limit,
            "suggestion": self.suggestion,
        }


@dataclass(frozen=True)
class SearchBudget:
    max_offset: int = _DEFAULT_MAX_OFFSET
    max_limit: int = _DEFAULT_MAX_LIMIT
    max_fetch_k: int = _DEFAULT_MAX_FETCH_K
    max_languages: int = _DEFAULT_MAX_LANGUAGES
    path_fullscan_allowed: bool = _DEFAULT_PATH_FULLSCAN_ALLOWED
    timeout_sec: float = _DEFAULT_TIMEOUT_SEC

    @classmethod
    def from_config(cls, cfg: Any) -> SearchBudget:
        return cls(
            max_offset=cfg.search_max_offset,
            max_limit=cfg.search_max_limit,
            max_fetch_k=cfg.search_max_fetch_k,
            max_languages=cfg.search_max_languages,
            path_fullscan_allowed=cfg.search_path_fullscan_allowed,
            timeout_sec=cfg.search_timeout_sec,
        )

    @classmethod
    def from_env(cls) -> SearchBudget:
        return cls(
            max_offset=_parse_int_env("COCOINDEX_SEARCH_MAX_OFFSET", _DEFAULT_MAX_OFFSET),
            max_limit=_parse_int_env("COCOINDEX_SEARCH_MAX_LIMIT", _DEFAULT_MAX_LIMIT),
            max_fetch_k=_parse_int_env("COCOINDEX_SEARCH_MAX_FETCH_K", _DEFAULT_MAX_FETCH_K),
            max_languages=_parse_int_env("COCOINDEX_SEARCH_MAX_LANGUAGES", _DEFAULT_MAX_LANGUAGES),
            path_fullscan_allowed=_parse_bool_env(
                "COCOINDEX_SEARCH_PATH_FULLSCAN_ALLOWED",
                _DEFAULT_PATH_FULLSCAN_ALLOWED,
            ),
            timeout_sec=_parse_float_env("COCOINDEX_SEARCH_TIMEOUT_SEC", _DEFAULT_TIMEOUT_SEC),
        )


@dataclass(frozen=True)
class SearchBudgetedRequest:
    limit: int
    offset: int
    languages: list[str] | None
    paths: list[str] | None
    fetch_k: int
    timeout_sec: float


def validate_search_budget(
    *,
    limit: int,
    offset: int,
    languages: list[str] | None = None,
    paths: list[str] | None = None,
    budget: SearchBudget | None = None,
) -> SearchBudgetedRequest:
    budget = budget or SearchBudget.from_env()
    if offset > budget.max_offset:
        raise SearchBudgetExceeded(
            budget_field="offset",
            actual=offset,
            limit=budget.max_offset,
            suggestion="Use a smaller offset or narrow the search with language/path filters.",
        )
    if limit > budget.max_limit:
        raise SearchBudgetExceeded(
            budget_field="limit",
            actual=limit,
            limit=budget.max_limit,
            suggestion="Lower --limit or raise COCOINDEX_SEARCH_MAX_LIMIT deliberately.",
        )
    if limit < 1:
        raise SearchBudgetExceeded(
            budget_field="limit",
            actual=limit,
            limit=">=1",
            suggestion="Use a positive result limit.",
        )
    if offset < 0:
        raise SearchBudgetExceeded(
            budget_field="offset",
            actual=offset,
            limit=">=0",
            suggestion="Use a non-negative offset.",
        )

    normalized_languages = _normalize_items(languages)
    if normalized_languages and len(normalized_languages) > budget.max_languages:
        logger.warning(
            "Clamping search language fanout from %s to %s",
            len(normalized_languages),
            budget.max_languages,
        )
        normalized_languages = normalized_languages[: budget.max_languages]

    normalized_paths = _normalize_items(paths)
    if normalized_paths and not budget.path_fullscan_allowed:
        for path in normalized_paths:
            if _is_global_wildcard_path(path):
                raise SearchBudgetExceeded(
                    budget_field="paths",
                    actual=path,
                    limit="scoped path",
                    suggestion=(
                        "Use a scoped path such as src/*, or set "
                        "COCOINDEX_SEARCH_PATH_FULLSCAN_ALLOWED=true."
                    ),
                )

    unique_k = max(limit + offset, 1)
    fetch_k = min(unique_k * 4, budget.max_fetch_k)
    return SearchBudgetedRequest(
        limit=limit,
        offset=offset,
        languages=normalized_languages,
        paths=normalized_paths,
        fetch_k=fetch_k,
        timeout_sec=budget.timeout_sec,
    )


def _normalize_items(values: list[str] | None) -> list[str] | None:
    if not values:
        return None
    normalized = [value.strip() for value in values if value.strip()]
    return normalized or None


def _is_global_wildcard_path(path: str) -> bool:
    normalized = path.strip().replace("\\", "/")
    while normalized.startswith("./"):
        normalized = normalized[2:]
    normalized = normalized.lstrip("/")
    if normalized in {"*", "**", "**/*"}:
        return True
    return "/" not in normalized and any(marker in normalized for marker in _WILDCARDS)


def _parse_int_env(var_name: str, default: int) -> int:
    raw = os.environ.get(var_name, "")
    if not raw.strip():
        return default
    try:
        value = int(raw)
    except ValueError:
        logger.warning("Ignoring invalid %s=%r; falling back to %s", var_name, raw, default)
        return default
    return value if value >= 0 else default


def _parse_float_env(var_name: str, default: float) -> float:
    raw = os.environ.get(var_name, "")
    if not raw.strip():
        return default
    try:
        value = float(raw)
    except ValueError:
        logger.warning("Ignoring invalid %s=%r; falling back to %s", var_name, raw, default)
        return default
    return value if value > 0 else default


def _parse_bool_env(var_name: str, default: bool) -> bool:
    raw = os.environ.get(var_name, "")
    if not raw.strip():
        return default
    normalized = raw.strip().lower()
    if normalized in {"1", "true", "yes", "on"}:
        return True
    if normalized in {"0", "false", "no", "off"}:
        return False
    logger.warning("Ignoring invalid %s=%r; falling back to %s", var_name, raw, default)
    return default
