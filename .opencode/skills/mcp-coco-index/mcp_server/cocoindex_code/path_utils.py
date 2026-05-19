"""Path helpers for mirror-aware query and indexing behavior."""

from __future__ import annotations

from collections.abc import Iterable
from typing import TypeVar

T = TypeVar("T")


def _field(item: object, name: str) -> object:
    if isinstance(item, dict):
        return item.get(name)
    return getattr(item, name, None)


def _normalized_prefixes(prefixes: Iterable[str]) -> list[str]:
    normalized: list[str] = []
    seen: set[str] = set()
    for prefix in prefixes:
        value = str(prefix).strip()
        if not value:
            continue
        value = value if value.endswith("/") else f"{value}/"
        if value not in seen:
            normalized.append(value)
            seen.add(value)
    return normalized


def extract_path_stem(file_path: str, mirror_prefixes: Iterable[str]) -> str:
    """Strip the first matching mirror prefix from a file path."""
    for prefix in _normalized_prefixes(mirror_prefixes):
        if file_path.startswith(prefix):
            return file_path[len(prefix) :]
    return file_path


def is_mirror_path(file_path: str, mirror_prefixes: Iterable[str]) -> bool:
    """Return whether a path starts with any configured mirror prefix."""
    return any(file_path.startswith(prefix) for prefix in _normalized_prefixes(mirror_prefixes))


def select_canonical_mirror_copy(
    candidates: Iterable[T],
    canonical_mirror: str,
    mirror_prefixes: Iterable[str],
    path_attr: str = "file_path",
) -> tuple[T | None, list[T]]:
    """Pick the canonical mirror copy from same-stem candidates."""
    items = list(candidates)
    if not items:
        return None, []

    canonical_prefixes = _normalized_prefixes([canonical_mirror])
    mirror_prefixes_normalized = _normalized_prefixes(mirror_prefixes)
    canonical_prefix = canonical_prefixes[0] if canonical_prefixes else ""

    canonical_items = [
        (position, item)
        for position, item in enumerate(items)
        if canonical_prefix and str(_field(item, path_attr) or "").startswith(canonical_prefix)
    ]
    if canonical_items:
        def sort_key(pair: tuple[int, T]) -> tuple[int, int]:
            position, item = pair
            chunk_id = _field(item, "chunk_id")
            chunk_rank = int(chunk_id) if isinstance(chunk_id, int) else position
            return (chunk_rank, position)

        winner = min(canonical_items, key=sort_key)[1]
    else:
        winner = items[0]

    losers = []
    for item in items:
        file_path = str(_field(item, path_attr) or "")
        if item is not winner and is_mirror_path(file_path, mirror_prefixes_normalized):
            losers.append(item)
    return winner, losers
