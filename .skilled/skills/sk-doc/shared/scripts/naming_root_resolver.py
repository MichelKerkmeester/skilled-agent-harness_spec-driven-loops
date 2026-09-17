#!/usr/bin/env python3
# ---------------------------------------------------------------------------
# COMPONENT: Catalog / Playbook Root Name Resolver
# ---------------------------------------------------------------------------
"""Canonical-only resolver for the catalog and playbook root directories.

Kebab-case is the sole canonical form. This module is the single place that recognizes
the catalog and playbook roots, so no consumer reinterprets a root name on its own.

It fails closed: a legacy underscore directory is no longer a recognized alias, so any
path carrying one is rejected as unsupported rather than silently resolved. Path matching
handles POSIX and Windows separators so a consumer gets the same answer on either platform.
"""
import re
from pathlib import Path
from typing import Iterable, Optional, Tuple

# Canonical hyphen form only. The bounded migration window has closed: the legacy underscore
# aliases are no longer accepted, and a path carrying one now fails closed as unsupported.
CATALOG_ROOT_NAMES: Tuple[str, ...] = ('feature-catalog',)
PLAYBOOK_ROOT_NAMES: Tuple[str, ...] = ('manual-testing-playbook',)
ALL_ROOT_NAMES: Tuple[str, ...] = CATALOG_ROOT_NAMES + PLAYBOOK_ROOT_NAMES

# Canonical hyphen forms only, for callers that emit rather than read.
CANONICAL_ROOT_NAMES: Tuple[str, ...] = (CATALOG_ROOT_NAMES[0], PLAYBOOK_ROOT_NAMES[0])

_CANONICAL = {
    'feature-catalog': 'feature-catalog',
    'manual-testing-playbook': 'manual-testing-playbook',
}


class RootCoexistenceError(Exception):
    """A legacy underscore root directory is present and must be migrated, not resolved."""


class UnsupportedRootError(Exception):
    """A path contains a catalog/playbook-shaped root that is not supported."""


def canonical_root(name: str) -> Optional[str]:
    """Return the canonical hyphen root for either form, or None if not a root name."""
    return _CANONICAL.get(name)


def is_catalog_root(name: str) -> bool:
    return name in CATALOG_ROOT_NAMES


def is_playbook_root(name: str) -> bool:
    return name in PLAYBOOK_ROOT_NAMES


def is_root_name(name: str) -> bool:
    return name in _CANONICAL


def path_contains_root(path, roots: Iterable[str] = ALL_ROOT_NAMES) -> bool:
    """True if any root name appears as a full path segment (POSIX or Windows)."""
    lowered = str(path).lower()
    return any(f'/{r}/' in lowered or f'\\{r}\\' in lowered for r in roots)


def unsupported_root_names(path) -> Tuple[str, ...]:
    """Return unsupported catalog/playbook-shaped path segments.

    Near-miss names must not fall through into a generic document category.
    Ordinary unrelated path segments remain outside this bounded contract.
    """
    segments = re.split(r'[/\\\\]+', str(path).lower())
    candidates = []
    for segment in segments:
        if '.' in segment:
            continue
        if segment in _CANONICAL:
            continue
        normalized = segment.replace('-', '_')
        if normalized.startswith('feature_catalog') or normalized.startswith('manual_testing_playbook'):
            candidates.append(segment)
    return tuple(dict.fromkeys(candidates))


def assert_supported_root_path(path) -> None:
    """Raise when a path contains an unsupported catalog/playbook root segment."""
    unsupported = unsupported_root_names(path)
    if unsupported:
        raise UnsupportedRootError(
            f"unsupported catalog/playbook root segment(s): {', '.join(unsupported)}"
        )


def find_unsupported_root_dirs(root: Path) -> Tuple[Path, ...]:
    """Return unsupported catalog/playbook-shaped directories below ``root``."""
    root = Path(root)
    offenders = []
    if not root.exists():
        return ()
    for candidate in root.rglob('*'):
        if candidate.is_dir() and unsupported_root_names(candidate.name):
            offenders.append(candidate)
    return tuple(sorted(set(offenders)))


def resolve_existing_root_dir(parent: Path, root_kind: str) -> Optional[Path]:
    """Return the single existing canonical root dir under `parent` for 'catalog' or 'playbook'.

    Fails closed (raises RootCoexistenceError) when a legacy underscore directory physically
    exists, whether alone or beside the canonical form, because it must be migrated rather than
    silently ignored. Returns None when no root of that kind exists.
    """
    if root_kind == 'catalog':
        names = CATALOG_ROOT_NAMES
        legacy = 'feature_catalog'
    elif root_kind == 'playbook':
        names = PLAYBOOK_ROOT_NAMES
        legacy = 'manual_testing_playbook'
    else:
        raise ValueError(f"root_kind must be 'catalog' or 'playbook', got {root_kind!r}")
    parent = Path(parent)
    if (parent / legacy).is_dir():
        raise RootCoexistenceError(
            f"legacy underscore root {legacy!r} present under {parent}; "
            "migrate it to the canonical hyphen form before continuing"
        )
    present = [parent / name for name in names if (parent / name).is_dir()]
    return present[0] if present else None
