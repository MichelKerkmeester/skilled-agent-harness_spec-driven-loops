#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: REFERENCE CHECKER DATA MODEL
# ───────────────────────────────────────────────────────────────
"""Typed records and semantic-map validation for the reference checker."""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass, field
from pathlib import Path, PurePosixPath
from typing import Any

from rename_engine_core import (
    RenameEngineError,
    load_semantic_map as load_engine_semantic_map,
)


# ───────────────────────────────────────────────────────────────
# 1. CONSTANTS
# ───────────────────────────────────────────────────────────────

LEDGER_SCHEMA_VERSION = 1
DYNAMIC_DISPOSITIONS = frozenset(
    {
        "bounded-static-pattern",
        "manual-review-required",
        "out-of-scope",
        "preserved-by-policy",
        "producer-routed",
        "resolved-static-expression",
    }
)
BLOCKING_STATUSES = frozenset(
    {"ambiguous", "invalid", "pending", "stale", "unresolved"}
)


# ───────────────────────────────────────────────────────────────
# 2. TYPES
# ───────────────────────────────────────────────────────────────


class CheckerError(RuntimeError):
    """The checker cannot prove a safe and complete ledger."""


@dataclass(frozen=True)
class TrackedEntry:
    """One stage-zero path from the Git tracked-file manifest."""

    path: PurePosixPath
    mode: str
    object_id: str

    @property
    def is_symlink(self) -> bool:
        """Return whether the index records this entry as a symbolic link."""
        return self.mode == "120000"


@dataclass(frozen=True)
class MapEntry:
    """One explicit source-to-target decision from the semantic map."""

    map_id: str
    source: PurePosixPath
    target: PurePosixPath
    classification: str
    closure_id: str
    order: int
    rationale: str
    dependencies: tuple[str, ...] = ()

    def operation_identity(self) -> dict[str, Any]:
        """Return the immutable operation fields consumed by later apply gates."""
        safe_argv = None
        operation = "preserve"
        if self.classification == "rename":
            operation = "git-mv"
            safe_argv = [
                "git",
                "mv",
                "--",
                self.source.as_posix(),
                self.target.as_posix(),
            ]
        return {
            "map_id": self.map_id,
            "source": self.source.as_posix(),
            "target": self.target.as_posix() if self.classification == "rename" else None,
            "classification": self.classification,
            "closure_id": self.closure_id,
            "order": self.order,
            "operation": operation,
            "safe_argv": safe_argv,
        }


@dataclass(frozen=True)
class SemanticMap:
    """Validated semantic-map input bound to a BASE and canonical content hash."""

    semantic_map_id: str
    base_sha: str
    map_hash: str
    entries: tuple[MapEntry, ...]

    @property
    def rename_entries(self) -> tuple[MapEntry, ...]:
        """Return operations that represent real filesystem moves."""
        return tuple(entry for entry in self.entries if entry.classification == "rename")

    @property
    def by_id(self) -> dict[str, MapEntry]:
        """Index entries by stable map identifier."""
        return {entry.map_id: entry for entry in self.entries}


@dataclass(frozen=True)
class ReferenceObservation:
    """One statically bounded path reference or one dynamic reference site."""

    file: PurePosixPath
    reference_kind: str
    raw_value: str
    line: int
    column: int
    span_start: int
    span_end: int
    dynamic: bool = False
    expression: str = ""
    automatic_disposition: str | None = None

    @property
    def site_key(self) -> str:
        """Return a readable key accepted by an external disposition file."""
        return f"{self.file.as_posix()}:{self.line}:{self.column}:{self.reference_kind}"

    @property
    def site_id(self) -> str:
        """Return a stable semantic identifier for this exact source site."""
        payload = "\0".join(
            (
                self.file.as_posix(),
                self.reference_kind,
                str(self.line),
                str(self.column),
                self.raw_value,
                self.expression,
            )
        )
        return f"site-{hashlib.sha256(payload.encode('utf-8')).hexdigest()[:20]}"


@dataclass
class ScanResult:
    """Mutable scan accumulator used before ledger serialization."""

    observations: list[ReferenceObservation] = field(default_factory=list)
    skipped_files: list[dict[str, str]] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)


# ───────────────────────────────────────────────────────────────
# 3. HASHING AND PATH VALIDATION
# ───────────────────────────────────────────────────────────────


def canonical_json_bytes(value: Any) -> bytes:
    """Serialize a value deterministically for plan and map identities."""
    return json.dumps(
        value,
        ensure_ascii=False,
        separators=(",", ":"),
        sort_keys=True,
    ).encode("utf-8")


def sha256_json(value: Any) -> str:
    """Return a lowercase SHA-256 digest of canonical JSON."""
    return hashlib.sha256(canonical_json_bytes(value)).hexdigest()


def git_blob_hash(content: bytes) -> str:
    """Compute Git's blob object identity without writing to the object store."""
    preimage = f"blob {len(content)}\0".encode("ascii") + content
    return hashlib.sha1(preimage).hexdigest()


# ───────────────────────────────────────────────────────────────
# 4. SEMANTIC MAP LOADING
# ───────────────────────────────────────────────────────────────


def load_semantic_map(path: Path) -> SemanticMap:
    """Load the rename engine's canonical semantic map for checker consumption.

    Args:
        path: JSON file containing BASE identity and ordered map entries.

    Returns:
        A validated immutable semantic map.

    Raises:
        CheckerError: If the engine rejects the map contract.
    """
    try:
        engine_map = load_engine_semantic_map(path)
    except RenameEngineError as error:
        raise CheckerError(str(error)) from error

    closure_ids = _dependency_closure_ids(engine_map.entries)
    entries = tuple(
        MapEntry(
            map_id=entry.entry_id,
            source=entry.source,
            target=entry.target or entry.source,
            classification=entry.classification,
            closure_id=closure_ids.get(entry.entry_id, f"policy-{entry.entry_id}"),
            order=index,
            rationale=entry.reason.strip() or "explicit semantic rename",
            dependencies=entry.dependencies,
        )
        for index, entry in enumerate(engine_map.entries)
    )
    return SemanticMap(
        semantic_map_id=f"semantic-map-{engine_map.map_sha256[:16]}",
        base_sha=engine_map.base_sha,
        map_hash=engine_map.map_sha256,
        entries=entries,
    )


def _dependency_closure_ids(entries: Any) -> dict[str, str]:
    """Derive stable SCC identities from the engine's dependency graph."""
    rename_entries = [entry for entry in entries if entry.classification == "rename"]
    nodes = {entry.entry_id for entry in rename_entries}
    adjacency = {
        entry.entry_id: set(entry.dependencies) & nodes for entry in rename_entries
    }
    index = 0
    indices: dict[str, int] = {}
    lowlinks: dict[str, int] = {}
    stack: list[str] = []
    on_stack: set[str] = set()
    closure_ids: dict[str, str] = {}

    def visit(node: str) -> None:
        nonlocal index
        indices[node] = index
        lowlinks[node] = index
        index += 1
        stack.append(node)
        on_stack.add(node)
        for target in sorted(adjacency[node]):
            if target not in indices:
                visit(target)
                lowlinks[node] = min(lowlinks[node], lowlinks[target])
            elif target in on_stack:
                lowlinks[node] = min(lowlinks[node], indices[target])
        if lowlinks[node] != indices[node]:
            return
        members = []
        while stack:
            member = stack.pop()
            on_stack.remove(member)
            members.append(member)
            if member == node:
                break
        closure_id = f"scc-{sha256_json(sorted(members))[:16]}"
        closure_ids.update({member: closure_id for member in members})

    for node in sorted(nodes):
        if node not in indices:
            visit(node)
    return closure_ids


def operation_set_hash(semantic_map: SemanticMap) -> str:
    """Hash the exact ordered source/target operation set."""
    return sha256_json(
        [entry.operation_identity() for entry in semantic_map.entries]
    )


__all__ = [
    "BLOCKING_STATUSES",
    "CheckerError",
    "DYNAMIC_DISPOSITIONS",
    "LEDGER_SCHEMA_VERSION",
    "MapEntry",
    "ReferenceObservation",
    "ScanResult",
    "SemanticMap",
    "TrackedEntry",
    "canonical_json_bytes",
    "git_blob_hash",
    "load_semantic_map",
    "operation_set_hash",
    "sha256_json",
]
