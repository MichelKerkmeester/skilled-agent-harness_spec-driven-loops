#!/usr/bin/env python3
# ---------------------------------------------------------------------------
# COMPONENT: Semantic Rename Engine Core
# ---------------------------------------------------------------------------
"""Plan, apply, and roll back semantic filesystem renames safely.

The engine consumes explicit source and target paths. It never derives a target
from source characters. Mutating operations require a reviewed plan and a
repository that carries two independent disposable-fixture opt-ins.
"""

from __future__ import annotations

import fcntl
import hashlib
import json
import os
import re
import subprocess
import tempfile
import unicodedata
from contextlib import contextmanager
from dataclasses import dataclass
from pathlib import Path, PurePosixPath
from typing import Any, Iterator, Mapping, Sequence

from check_no_new_snake_case import (
    CODEX_GENERATED_ROOTS,
    FROZEN_ROOT_NAMES,
    GENERATED_ROOT_NAMES,
    GENERATED_SUFFIXES,
    LOCKFILE_NAMES,
    TEST_RUNNER_ROOT_NAMES,
    TOOL_MANDATED_NAMES,
    VENDORED_ROOT_NAMES,
)
from naming_root_resolver import canonical_root


SCHEMA_VERSION = 1
DISPOSABLE_MARKER = ".rename-engine-disposable"
DISPOSABLE_MARKER_CONTENT = "semantic-rename-engine disposable fixture\n"
DISPOSABLE_CONFIG_KEY = "rename-engine.disposable"
CLASSIFICATIONS = frozenset(
    {"rename", "exempt", "frozen", "generated", "tool-mandated"}
)
NON_RENAME_CLASSIFICATIONS = CLASSIFICATIONS - {"rename"}
BASE_SHA_PATTERN = re.compile(r"^[0-9a-f]{40}(?:[0-9a-f]{24})?$")


class RenameEngineError(RuntimeError):
    """Base error for a rejected rename-engine operation."""


class MapValidationError(RenameEngineError):
    """The semantic map is malformed or internally unsafe."""


class PlanValidationError(RenameEngineError):
    """A reviewed plan does not match the current semantic map."""


class PreflightError(RenameEngineError):
    """Repository state makes the requested operation unsafe."""


class ApplyExecutionError(RenameEngineError):
    """A mutating operation failed after its journal was created."""


@dataclass(frozen=True)
class MapEntry:
    """One explicitly classified semantic-map row."""

    entry_id: str
    source: PurePosixPath
    target: PurePosixPath | None
    classification: str
    dependencies: tuple[str, ...]
    reason: str


@dataclass(frozen=True)
class SemanticMap:
    """Validated map content plus the hash of its exact source bytes."""

    base_sha: str
    map_sha256: str
    entries: tuple[MapEntry, ...]


def _canonical_json(value: Any) -> bytes:
    return json.dumps(
        value,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")


def _sha256(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def _git(
    repo_root: Path,
    arguments: Sequence[str],
    *,
    check: bool = True,
) -> subprocess.CompletedProcess[bytes]:
    command = ["git", "-C", str(repo_root), *arguments]
    result = subprocess.run(command, check=False, capture_output=True)
    if check and result.returncode != 0:
        detail = result.stderr.decode("utf-8", errors="replace").strip()
        raise PreflightError(detail or f"git exited {result.returncode}: {' '.join(command)}")
    return result


def _validate_relative_path(value: Any, field_name: str) -> PurePosixPath:
    if not isinstance(value, str) or not value:
        raise MapValidationError(f"{field_name} must be a non-empty string")
    if "\x00" in value or "\\" in value:
        raise MapValidationError(
            f"{field_name} must be a NUL-free repository-relative POSIX path: {value!r}"
        )
    path = PurePosixPath(value)
    if path.is_absolute() or value != path.as_posix():
        raise MapValidationError(f"{field_name} must be a normalized relative path: {value!r}")
    if any(part in {"", ".", "..", ".git"} for part in path.parts):
        raise MapValidationError(f"{field_name} escapes or enters repository metadata: {value!r}")
    return path


def _require_string(value: Any, field_name: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise MapValidationError(f"{field_name} must be a non-empty string")
    return value


def _collision_key(path: PurePosixPath, mode: str) -> str:
    value = path.as_posix()
    if mode == "exact":
        return value
    if mode == "casefold":
        return value.casefold()
    if mode == "nfc":
        return unicodedata.normalize("NFC", value)
    if mode == "casefold+nfc":
        return unicodedata.normalize("NFC", value).casefold()
    raise AssertionError(f"unsupported collision mode: {mode}")


def _reject_duplicate_paths(entries: Sequence[MapEntry]) -> None:
    rename_entries = [entry for entry in entries if entry.classification == "rename"]
    for label in ("source", "target"):
        for mode in ("exact", "casefold", "nfc", "casefold+nfc"):
            owners: dict[str, tuple[str, PurePosixPath]] = {}
            for entry in rename_entries:
                path = entry.source if label == "source" else entry.target
                assert path is not None
                key = _collision_key(path, mode)
                previous = owners.get(key)
                if previous is not None:
                    previous_id, previous_path = previous
                    raise MapValidationError(
                        f"{mode} {label} collision between {previous_id!r} ({previous_path}) "
                        f"and {entry.entry_id!r} ({path})"
                    )
                owners[key] = (entry.entry_id, path)


def load_semantic_map(map_path: Path) -> SemanticMap:
    """Load and validate an explicit semantic source-to-target map."""
    try:
        raw = map_path.read_bytes()
    except OSError as error:
        raise MapValidationError(f"cannot read semantic map {map_path}: {error}") from error
    try:
        document = json.loads(raw)
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        raise MapValidationError(f"semantic map is not valid UTF-8 JSON: {error}") from error
    if not isinstance(document, dict):
        raise MapValidationError("semantic map root must be an object")
    if document.get("schema_version") != SCHEMA_VERSION:
        raise MapValidationError(f"schema_version must equal {SCHEMA_VERSION}")

    base_sha = _require_string(document.get("base_sha"), "base_sha").lower()
    if not BASE_SHA_PATTERN.fullmatch(base_sha):
        raise MapValidationError("base_sha must be a lowercase 40- or 64-character Git object ID")

    raw_entries = document.get("entries")
    if not isinstance(raw_entries, list) or not raw_entries:
        raise MapValidationError("entries must be a non-empty array; a zero-file map is unsafe")

    entries: list[MapEntry] = []
    seen_ids: set[str] = set()
    for index, raw_entry in enumerate(raw_entries):
        field_prefix = f"entries[{index}]"
        if not isinstance(raw_entry, dict):
            raise MapValidationError(f"{field_prefix} must be an object")
        entry_id = _require_string(raw_entry.get("id"), f"{field_prefix}.id")
        if entry_id in seen_ids:
            raise MapValidationError(f"duplicate entry id: {entry_id!r}")
        seen_ids.add(entry_id)

        classification = _require_string(
            raw_entry.get("classification"), f"{field_prefix}.classification"
        )
        if classification not in CLASSIFICATIONS:
            raise MapValidationError(
                f"{field_prefix}.classification must be one of {sorted(CLASSIFICATIONS)}"
            )
        source = _validate_relative_path(raw_entry.get("source"), f"{field_prefix}.source")
        target_value = raw_entry.get("target")
        target = (
            _validate_relative_path(target_value, f"{field_prefix}.target")
            if target_value is not None
            else None
        )
        if classification == "rename" and target is None:
            raise MapValidationError(f"{field_prefix}.target is required for rename entries")
        if classification != "rename" and target is not None:
            raise MapValidationError(
                f"{field_prefix}.target must be omitted unless classification is rename"
            )
        if target == source:
            raise MapValidationError(f"{field_prefix} source and target must differ")
        if target is not None and source in target.parents:
            raise MapValidationError(
                f"{field_prefix}.target cannot be nested inside its own source: {target}"
            )

        raw_dependencies = raw_entry.get("dependencies", [])
        if not isinstance(raw_dependencies, list) or any(
            not isinstance(value, str) or not value for value in raw_dependencies
        ):
            raise MapValidationError(f"{field_prefix}.dependencies must be an array of entry ids")
        dependencies = tuple(sorted(set(raw_dependencies)))
        if entry_id in dependencies:
            raise MapValidationError(f"{field_prefix} cannot depend on itself")
        reason = raw_entry.get("reason", "")
        if not isinstance(reason, str):
            raise MapValidationError(f"{field_prefix}.reason must be a string")
        if classification in NON_RENAME_CLASSIFICATIONS and not reason.strip():
            raise MapValidationError(
                f"{field_prefix}.reason is required for non-rename classifications"
            )

        if target is not None:
            canonical = canonical_root(source.name)
            if canonical is not None and target.name != canonical:
                raise MapValidationError(
                    f"{field_prefix}.target must use the canonical root {canonical!r}; "
                    "the semantic map must state that target explicitly"
                )
        entries.append(
            MapEntry(
                entry_id=entry_id,
                source=source,
                target=target,
                classification=classification,
                dependencies=dependencies,
                reason=reason.strip(),
            )
        )

    if not any(entry.classification == "rename" for entry in entries):
        raise MapValidationError("semantic map must contain at least one rename entry")
    for entry in entries:
        missing = sorted(set(entry.dependencies) - seen_ids)
        if missing:
            raise MapValidationError(
                f"entry {entry.entry_id!r} has unknown dependencies: {', '.join(missing)}"
            )
    _reject_duplicate_paths(entries)
    return SemanticMap(
        base_sha=base_sha,
        map_sha256=_sha256(raw),
        entries=tuple(entries),
    )


def _is_within(path: PurePosixPath, root: PurePosixPath) -> bool:
    return path == root or root in path.parents


def _classify_exemption(repo_root: Path, source: PurePosixPath) -> tuple[str, str] | None:
    parts = set(source.parts)
    if any(_is_within(source, root) for root in CODEX_GENERATED_ROOTS):
        return "generated", "generated mirror output is changed at its producer"
    if parts & FROZEN_ROOT_NAMES:
        return "frozen", "frozen history is append-only"
    if parts & VENDORED_ROOT_NAMES:
        return "exempt", "vendored or third-party content is outside authored scope"
    if parts & GENERATED_ROOT_NAMES or source.name.endswith(GENERATED_SUFFIXES):
        return "generated", "generated output is regenerated rather than renamed"
    if parts & TEST_RUNNER_ROOT_NAMES:
        return "exempt", "test-runner magic path must retain its exact name"
    if source.name in LOCKFILE_NAMES:
        return "generated", "lockfile output is regenerated"
    if source.name in TOOL_MANDATED_NAMES:
        return "tool-mandated", "tool contract requires the exact filename"
    if source.suffix == ".py":
        return "exempt", "Python filenames retain snake_case"

    physical_source = repo_root.joinpath(*source.parts)
    if physical_source.is_dir() and source.name.isidentifier():
        try:
            children = tuple(physical_source.iterdir())
        except OSError:
            children = ()
        if any(child.name in {"__init__.py", "py.typed"} for child in children) or any(
            child.is_file() and child.suffix == ".py" for child in children
        ):
            return "exempt", "Python import-package directories must remain importable"
    return None


def _validate_policy_classifications(repo_root: Path, semantic_map: SemanticMap) -> None:
    for entry in semantic_map.entries:
        detected = _classify_exemption(repo_root, entry.source)
        if entry.classification == "rename" and detected is not None:
            detected_class, reason = detected
            raise MapValidationError(
                f"entry {entry.entry_id!r} classifies exempt path {entry.source} as rename; "
                f"detected {detected_class}: {reason}"
            )
        if detected is not None and entry.classification != "rename":
            detected_class, _ = detected
            compatible = entry.classification == detected_class or (
                entry.classification == "exempt" and detected_class == "tool-mandated"
            )
            if not compatible:
                raise MapValidationError(
                    f"entry {entry.entry_id!r} classification {entry.classification!r} "
                    f"conflicts with detected class {detected_class!r}"
                )


def _strongly_connected_components(
    graph: Mapping[str, tuple[str, ...]],
) -> list[tuple[str, ...]]:
    index = 0
    stack: list[str] = []
    indices: dict[str, int] = {}
    lowlinks: dict[str, int] = {}
    on_stack: set[str] = set()
    components: list[tuple[str, ...]] = []

    def visit(node: str) -> None:
        nonlocal index
        indices[node] = index
        lowlinks[node] = index
        index += 1
        stack.append(node)
        on_stack.add(node)

        for dependency in graph[node]:
            if dependency not in indices:
                visit(dependency)
                lowlinks[node] = min(lowlinks[node], lowlinks[dependency])
            elif dependency in on_stack:
                lowlinks[node] = min(lowlinks[node], indices[dependency])

        if lowlinks[node] != indices[node]:
            return
        members: list[str] = []
        while True:
            member = stack.pop()
            on_stack.remove(member)
            members.append(member)
            if member == node:
                break
        components.append(tuple(sorted(members)))

    for node in sorted(graph):
        if node not in indices:
            visit(node)
    return components


def _plan_batches(entries: Sequence[MapEntry]) -> list[dict[str, Any]]:
    rename_ids = {entry.entry_id for entry in entries if entry.classification == "rename"}
    graph = {
        entry.entry_id: tuple(
            dependency for dependency in entry.dependencies if dependency in rename_ids
        )
        for entry in entries
        if entry.classification == "rename"
    }
    components = _strongly_connected_components(graph)
    component_by_member = {
        member: component_index
        for component_index, component in enumerate(components)
        for member in component
    }
    dependency_components: dict[int, set[int]] = {
        index: set() for index in range(len(components))
    }
    for member, dependencies in graph.items():
        owner = component_by_member[member]
        dependency_components[owner].update(
            component_by_member[dependency]
            for dependency in dependencies
            if component_by_member[dependency] != owner
        )

    remaining = set(range(len(components)))
    emitted: list[int] = []
    while remaining:
        ready = sorted(
            (index for index in remaining if not (dependency_components[index] & remaining)),
            key=lambda index: components[index],
        )
        if not ready:
            raise MapValidationError("component dependency graph contains an impossible cycle")
        emitted.extend(ready)
        remaining.difference_update(ready)

    batches: list[dict[str, Any]] = []
    emitted_position = {component_index: position for position, component_index in enumerate(emitted)}
    for ordinal, component_index in enumerate(emitted, start=1):
        members = components[component_index]
        member_hash = _sha256(_canonical_json(list(members)))[:12]
        dependency_ids = sorted(
            f"batch-{emitted_position[dependency] + 1:04d}-"
            f"{_sha256(_canonical_json(list(components[dependency])))[:12]}"
            for dependency in dependency_components[component_index]
        )
        batches.append(
            {
                "id": f"batch-{ordinal:04d}-{member_hash}",
                "members": list(members),
                "depends_on": dependency_ids,
            }
        )
    return batches


def _repository_paths(repo_root: Path) -> set[PurePosixPath]:
    paths: set[PurePosixPath] = set()
    for current_root, directory_names, file_names in os.walk(repo_root, followlinks=False):
        current = Path(current_root)
        relative_current = current.relative_to(repo_root)
        if relative_current == Path("."):
            directory_names[:] = [name for name in directory_names if name != ".git"]
        for name in directory_names:
            paths.add(PurePosixPath((relative_current / name).as_posix()))
        for name in file_names:
            paths.add(PurePosixPath((relative_current / name).as_posix()))
    return paths


def _lexists(repo_root: Path, path: PurePosixPath) -> bool:
    return os.path.lexists(repo_root.joinpath(*path.parts))


def _is_vacated(path: PurePosixPath, sources: Sequence[PurePosixPath]) -> bool:
    return any(path == source or source in path.parents for source in sources)


def _validate_existing_collisions(
    repo_root: Path,
    pending_entries: Sequence[MapEntry],
) -> None:
    if not pending_entries:
        return
    sources = [entry.source for entry in pending_entries]
    targets = [entry.target for entry in pending_entries]
    assert all(target is not None for target in targets)
    concrete_targets = [target for target in targets if target is not None]
    existing = _repository_paths(repo_root)
    # Test whether each existing path is vacated by a rename against a membership set of sources,
    # walking only the path's own ancestors. Scanning every source for every existing path is
    # quadratic and dominates planning on a whole-repo rename set.
    source_set = set(sources)
    retained = [
        path
        for path in existing
        if path not in source_set and not any(parent in source_set for parent in path.parents)
    ]

    # Index each retained path by its exact, casefold, NFC, and casefold+NFC form once, so a
    # target is checked with four constant-time lookups instead of a full rescan of the tree.
    # A single pairwise scan is O(targets x tracked-files) with a Unicode normalization per pair,
    # which grows into tens of millions of operations on a whole-repo rename set.
    exact_index: dict[str, PurePosixPath] = {}
    casefold_index: dict[str, PurePosixPath] = {}
    nfc_index: dict[str, PurePosixPath] = {}
    casefold_nfc_index: dict[str, PurePosixPath] = {}
    for existing_path in retained:
        posix = existing_path.as_posix()
        normalized = unicodedata.normalize("NFC", posix)
        exact_index.setdefault(posix, existing_path)
        casefold_index.setdefault(posix.casefold(), existing_path)
        nfc_index.setdefault(normalized, existing_path)
        casefold_nfc_index.setdefault(normalized.casefold(), existing_path)

    for target in concrete_targets:
        posix = target.as_posix()
        normalized = unicodedata.normalize("NFC", posix)
        if posix in exact_index:
            raise PreflightError(f"exact collision: target {target} already exists")
        conflict = casefold_index.get(posix.casefold())
        if conflict is not None:
            raise PreflightError(
                f"casefold collision: target {target} conflicts with existing {conflict}"
            )
        conflict = nfc_index.get(normalized)
        if conflict is not None:
            raise PreflightError(
                f"NFC collision: target {target} conflicts with existing {conflict}"
            )
        conflict = casefold_nfc_index.get(normalized.casefold())
        if conflict is not None:
            raise PreflightError(
                f"casefold/NFC collision: target {target} conflicts with existing {conflict}"
            )


def _validate_symlink_boundaries(repo_root: Path, entries: Sequence[MapEntry]) -> None:
    for entry in entries:
        for label, path in (("source", entry.source), ("target", entry.target)):
            if path is None:
                continue
            cursor = repo_root
            for part in path.parts[:-1]:
                cursor = cursor / part
                if cursor.is_symlink():
                    raise PreflightError(
                        f"{label} path {path} traverses symlink ancestor {cursor.relative_to(repo_root)}"
                    )


def _validate_tracked_sources(repo_root: Path, entries: Sequence[MapEntry]) -> None:
    for entry in entries:
        tracked = _git(
            repo_root,
            ["ls-files", "-z", "--", entry.source.as_posix()],
        ).stdout
        if not tracked:
            raise PreflightError(
                f"source {entry.source} contains zero tracked files; git mv cannot own this operation"
            )


def _validate_target_parents(repo_root: Path, entries: Sequence[MapEntry]) -> None:
    sources = [entry.source for entry in entries]
    existing_paths = _repository_paths(repo_root)
    directory_targets = {
        entry.target
        for entry in entries
        if entry.target is not None
        and repo_root.joinpath(*entry.source.parts).is_dir()
        and not repo_root.joinpath(*entry.source.parts).is_symlink()
    }
    for entry in entries:
        assert entry.target is not None
        parent = entry.target.parent
        if parent == PurePosixPath("."):
            continue
        retained_parent = parent in existing_paths and not _is_vacated(parent, sources)
        created_parent = any(
            parent == target or target in parent.parents for target in directory_targets
        )
        if not retained_parent and not created_parent:
            raise PreflightError(
                f"target parent {parent} will not exist when moving {entry.source} to {entry.target}"
            )


def _entry_state(
    entry: MapEntry,
    source_set: set[PurePosixPath],
    existing_paths: set[PurePosixPath],
) -> str:
    assert entry.target is not None
    # Compare enumerated spellings so case-insensitive filesystems still report
    # casefold and Unicode-normalization collisions by their real category.
    source_exists = entry.source in existing_paths
    target_exists = entry.target in existing_paths
    if source_exists and (not target_exists or entry.target in source_set):
        return "pending"
    if not source_exists and target_exists:
        return "already-at-target"
    if source_exists and target_exists:
        raise PreflightError(
            f"exact collision for entry {entry.entry_id!r}: source and target both exist"
        )
    raise PreflightError(
        f"unreconciled entry {entry.entry_id!r}: neither source {entry.source} nor "
        f"target {entry.target} exists"
    )


def _git_head(repo_root: Path) -> str:
    return _git(repo_root, ["rev-parse", "HEAD"]).stdout.decode("ascii").strip()


def _tree_is_clean(repo_root: Path) -> bool:
    status = _git(
        repo_root,
        ["status", "--porcelain=v1", "-z", "--untracked-files=all"],
    ).stdout
    return not status


def _tracked_modes(repo_root: Path, pathspecs: Sequence[PurePosixPath]) -> dict[str, str]:
    if not pathspecs:
        return {}
    result = _git(
        repo_root,
        ["ls-files", "-s", "-z", "--", *(path.as_posix() for path in pathspecs)],
    ).stdout
    modes: dict[str, str] = {}
    for record in result.split(b"\0"):
        if not record:
            continue
        metadata, raw_path = record.split(b"\t", 1)
        mode = metadata.split(b" ", 1)[0].decode("ascii")
        path = raw_path.decode("utf-8", errors="surrogateescape")
        modes[path] = mode
    return dict(sorted(modes.items()))


def _identity_payload(
    semantic_map: SemanticMap,
    batches: Sequence[Mapping[str, Any]],
    operation_order: Sequence[Mapping[str, str]],
) -> dict[str, Any]:
    return {
        "base_sha": semantic_map.base_sha,
        "map_sha256": semantic_map.map_sha256,
        "batches": [
            {
                "id": batch["id"],
                "members": batch["members"],
                "depends_on": batch["depends_on"],
            }
            for batch in batches
        ],
        "operation_order": list(operation_order),
    }


def build_plan(repo_root: Path, semantic_map: SemanticMap) -> dict[str, Any]:
    """Build a deterministic, read-only plan for the current repository state."""
    repo_root = repo_root.resolve()
    if not (repo_root / ".git").exists():
        git_dir = _git(repo_root, ["rev-parse", "--git-dir"], check=False)
        if git_dir.returncode != 0:
            raise PreflightError(f"not a Git repository: {repo_root}")
    _validate_policy_classifications(repo_root, semantic_map)
    rename_entries = [
        entry for entry in semantic_map.entries if entry.classification == "rename"
    ]
    _validate_symlink_boundaries(repo_root, rename_entries)
    source_set = {entry.source for entry in rename_entries}
    existing_paths = _repository_paths(repo_root)
    states = {
        entry.entry_id: _entry_state(entry, source_set, existing_paths)
        for entry in rename_entries
    }
    pending_entries = [entry for entry in rename_entries if states[entry.entry_id] == "pending"]
    _validate_tracked_sources(repo_root, pending_entries)
    _validate_existing_collisions(repo_root, pending_entries)
    _validate_target_parents(repo_root, pending_entries)

    batches = _plan_batches(semantic_map.entries)
    entry_by_id = {entry.entry_id: entry for entry in semantic_map.entries}
    batch_by_member = {
        member: batch["id"] for batch in batches for member in batch["members"]
    }
    operation_order: list[dict[str, str]] = []
    for batch in batches:
        batch_entries = sorted(
            (entry_by_id[member] for member in batch["members"]),
            key=lambda entry: (entry.source.as_posix(), entry.entry_id),
        )
        for entry in batch_entries:
            assert entry.target is not None
            operation_order.append(
                {
                    "id": entry.entry_id,
                    "batch": batch["id"],
                    "source": entry.source.as_posix(),
                    "target": entry.target.as_posix(),
                }
            )

    identity_payload = _identity_payload(semantic_map, batches, operation_order)
    plan_id = _sha256(_canonical_json(identity_payload))
    report_entries: list[dict[str, Any]] = []
    for entry in sorted(semantic_map.entries, key=lambda value: value.entry_id):
        if entry.classification == "rename":
            state = states[entry.entry_id]
            reason = "source is ready for explicit apply" if state == "pending" else "target already exists"
        else:
            state = "skipped-with-reason"
            reason = entry.reason
        report_entries.append(
            {
                "id": entry.entry_id,
                "source": entry.source.as_posix(),
                "target": entry.target.as_posix() if entry.target is not None else None,
                "classification": entry.classification,
                "batch": batch_by_member.get(entry.entry_id),
                "dependencies": list(entry.dependencies),
                "state": state,
                "reason": reason,
            }
        )

    pending_sources = [entry.source for entry in pending_entries]
    return {
        "schema_version": SCHEMA_VERSION,
        "mode": "dry-run",
        "plan_id": plan_id,
        "base_sha": semantic_map.base_sha,
        "map_sha256": semantic_map.map_sha256,
        "head_sha": _git_head(repo_root),
        "tree_clean": _tree_is_clean(repo_root),
        "batches": batches,
        "operation_order": operation_order,
        "entries": report_entries,
        "mode_manifest_before": _tracked_modes(repo_root, pending_sources),
        "summary": {
            "map_entries": len(semantic_map.entries),
            "rename_entries": len(rename_entries),
            "pending": sum(state == "pending" for state in states.values()),
            "already_at_target": sum(
                state == "already-at-target" for state in states.values()
            ),
            "skipped": len(semantic_map.entries) - len(rename_entries),
            "batches": len(batches),
        },
    }


def load_plan(plan_path: Path) -> dict[str, Any]:
    """Load a reviewed plan document."""
    try:
        plan = json.loads(plan_path.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as error:
        raise PlanValidationError(f"cannot load reviewed plan {plan_path}: {error}") from error
    if not isinstance(plan, dict):
        raise PlanValidationError("reviewed plan root must be an object")
    return plan


def _validate_reviewed_plan(
    reviewed_plan: Mapping[str, Any],
    current_plan: Mapping[str, Any],
) -> None:
    fields = ("schema_version", "plan_id", "base_sha", "map_sha256")
    for field in fields:
        if reviewed_plan.get(field) != current_plan.get(field):
            raise PlanValidationError(
                f"stale plan: {field} changed from {reviewed_plan.get(field)!r} "
                f"to {current_plan.get(field)!r}"
            )
    for field in ("batches", "operation_order"):
        if reviewed_plan.get(field) != current_plan.get(field):
            raise PlanValidationError(
                f"stale plan: exact {field.replace('_', ' ')} changed; regenerate the plan"
            )


def _git_dir(repo_root: Path) -> Path:
    raw = _git(repo_root, ["rev-parse", "--git-dir"]).stdout.decode("utf-8").strip()
    candidate = Path(raw)
    if not candidate.is_absolute():
        candidate = repo_root / candidate
    return candidate.resolve()


@contextmanager
def _exclusive_apply_lock(repo_root: Path) -> Iterator[None]:
    lock_path = _git_dir(repo_root) / "semantic-rename-engine.lock"
    with lock_path.open("a+b") as lock_file:
        fcntl.flock(lock_file.fileno(), fcntl.LOCK_EX)
        try:
            yield
        finally:
            fcntl.flock(lock_file.fileno(), fcntl.LOCK_UN)


def _assert_disposable_repository(repo_root: Path) -> None:
    marker = repo_root / DISPOSABLE_MARKER
    try:
        marker_content = marker.read_text(encoding="utf-8")
    except OSError as error:
        raise PreflightError(
            f"apply and rollback require committed marker {DISPOSABLE_MARKER}: {error}"
        ) from error
    if marker_content != DISPOSABLE_MARKER_CONTENT:
        raise PreflightError(f"disposable marker {DISPOSABLE_MARKER} has unexpected content")
    tracked = _git(
        repo_root,
        ["ls-files", "--error-unmatch", "--", DISPOSABLE_MARKER],
        check=False,
    )
    if tracked.returncode != 0:
        raise PreflightError(f"disposable marker {DISPOSABLE_MARKER} must be committed")
    configured = _git(
        repo_root,
        ["config", "--local", "--get", DISPOSABLE_CONFIG_KEY],
        check=False,
    )
    if configured.returncode != 0 or configured.stdout.decode("utf-8").strip().lower() != "true":
        raise PreflightError(
            f"apply and rollback require local Git config {DISPOSABLE_CONFIG_KEY}=true"
        )


def _assert_path_outside_repository(path: Path, repo_root: Path, label: str) -> None:
    resolved = path.resolve()
    try:
        resolved.relative_to(repo_root.resolve())
    except ValueError:
        return
    raise PreflightError(f"{label} must be outside the disposable repository: {path}")


def _write_json_atomically(path: Path, value: Mapping[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        "w",
        encoding="utf-8",
        dir=path.parent,
        prefix=f".{path.name}.",
        suffix=".tmp",
        delete=False,
    ) as temporary_file:
        json.dump(value, temporary_file, ensure_ascii=False, indent=2, sort_keys=True)
        temporary_file.write("\n")
        temporary_path = Path(temporary_file.name)
    os.replace(temporary_path, path)


def _dirty_paths(repo_root: Path) -> set[PurePosixPath]:
    dirty: set[PurePosixPath] = set()
    for arguments in (
        ["diff", "--name-only", "--no-renames", "-z", "HEAD", "--"],
        ["diff", "--cached", "--name-only", "--no-renames", "-z", "HEAD", "--"],
        ["ls-files", "--others", "--exclude-standard", "-z", "--"],
    ):
        raw = _git(repo_root, arguments).stdout
        dirty.update(
            PurePosixPath(value.decode("utf-8", errors="surrogateescape"))
            for value in raw.split(b"\0")
            if value
        )
    return dirty


def _assert_only_expected_dirty(
    repo_root: Path,
    operation_order: Sequence[Mapping[str, str]],
    stage_root: PurePosixPath | None = None,
) -> None:
    allowed_roots = [
        PurePosixPath(operation[field])
        for operation in operation_order
        for field in ("source", "target")
    ]
    if stage_root is not None:
        allowed_roots.append(stage_root)
    unexpected = sorted(
        path
        for path in _dirty_paths(repo_root)
        if not any(path == root or root in path.parents for root in allowed_roots)
    )
    if unexpected:
        raise PreflightError(
            "dirty tree contains paths outside the reviewed operation set: "
            + ", ".join(path.as_posix() for path in unexpected)
        )


def _source_kind(repo_root: Path, source: PurePosixPath) -> str:
    physical = repo_root.joinpath(*source.parts)
    if physical.is_symlink():
        return "symlink"
    if physical.is_dir():
        return "directory"
    return "file"


def _git_mv(repo_root: Path, source: PurePosixPath, target: PurePosixPath) -> None:
    # Option termination makes every path an operand, including root-level names beginning with a hyphen.
    _git(repo_root, ["mv", "--", source.as_posix(), target.as_posix()])


def _translated_manifest(
    before: Mapping[str, str],
    operation_order: Sequence[Mapping[str, str]],
) -> dict[str, str]:
    mappings = sorted(
        (
            (PurePosixPath(operation["source"]), PurePosixPath(operation["target"]))
            for operation in operation_order
        ),
        key=lambda pair: len(pair[0].parts),
        reverse=True,
    )
    translated: dict[str, str] = {}
    for raw_path, mode in before.items():
        path = PurePosixPath(raw_path)
        final_path = path
        for source, target in mappings:
            if path == source:
                final_path = target
                break
            if source in path.parents:
                final_path = target / path.relative_to(source)
                break
        translated[final_path.as_posix()] = mode
    return dict(sorted(translated.items()))


def _remove_empty_stage(stage_path: Path) -> None:
    if not stage_path.exists():
        return
    for current_root, directory_names, file_names in os.walk(stage_path, topdown=False):
        if file_names:
            return
        current = Path(current_root)
        for directory_name in directory_names:
            child = current / directory_name
            if child.exists():
                try:
                    child.rmdir()
                except OSError:
                    return
    try:
        stage_path.rmdir()
    except OSError:
        return


def apply_plan(
    repo_root: Path,
    map_path: Path,
    reviewed_plan: Mapping[str, Any],
    journal_path: Path,
    *,
    inject_failure_after_moves: int | None = None,
) -> dict[str, Any]:
    """Apply a reviewed plan inside an explicitly disposable Git repository."""
    repo_root = repo_root.resolve()
    _assert_path_outside_repository(journal_path, repo_root, "journal")
    _assert_disposable_repository(repo_root)

    with _exclusive_apply_lock(repo_root):
        semantic_map = load_semantic_map(map_path)
        current_plan = build_plan(repo_root, semantic_map)
        _validate_reviewed_plan(reviewed_plan, current_plan)
        if _git_head(repo_root) != semantic_map.base_sha:
            raise PreflightError(
                f"stale plan: HEAD {_git_head(repo_root)} does not equal BASE {semantic_map.base_sha}"
            )

        pending_ids = {
            entry["id"] for entry in current_plan["entries"] if entry["state"] == "pending"
        }
        stage_root = PurePosixPath(f".rename-engine-stage-{current_plan['plan_id'][:16]}")
        if not pending_ids:
            _assert_only_expected_dirty(repo_root, current_plan["operation_order"], stage_root)
            return {
                "mode": "apply",
                "plan_id": current_plan["plan_id"],
                "state": "already-at-target",
                "applied": 0,
                "journal": str(journal_path),
            }
        if not _tree_is_clean(repo_root):
            raise PreflightError("dirty tree: apply requires a clean index and working tree")

        # Re-read under the lock so map bytes, source/target order, and repository state share one pre-write instant.
        locked_map = load_semantic_map(map_path)
        locked_plan = build_plan(repo_root, locked_map)
        _validate_reviewed_plan(reviewed_plan, locked_plan)
        if _git_head(repo_root) != locked_map.base_sha or not _tree_is_clean(repo_root):
            raise PreflightError("stale plan: HEAD or clean-tree state changed during pre-write validation")
        if _lexists(repo_root, stage_root):
            raise PreflightError(f"staging path already exists: {stage_root}")

        entry_by_id = {entry.entry_id: entry for entry in locked_map.entries}
        operations = [
            operation
            for operation in locked_plan["operation_order"]
            if operation["id"] in pending_ids
        ]
        operation_details = [
            {
                **operation,
                "source_kind": _source_kind(repo_root, entry_by_id[operation["id"]].source),
            }
            for operation in operations
        ]
        journal: dict[str, Any] = {
            "schema_version": SCHEMA_VERSION,
            "plan_id": locked_plan["plan_id"],
            "base_sha": locked_map.base_sha,
            "map_sha256": locked_map.map_sha256,
            "state": "applying",
            "stage_root": stage_root.as_posix(),
            "operation_order": locked_plan["operation_order"],
            "operations": operation_details,
            "completed_moves": [],
            "error": None,
        }
        _write_json_atomically(journal_path, journal)
        move_count = 0

        def move(source: PurePosixPath, target: PurePosixPath) -> None:
            nonlocal move_count
            repo_root.joinpath(*target.parent.parts).mkdir(parents=True, exist_ok=True)
            _git_mv(repo_root, source, target)
            journal["completed_moves"].append(
                {"source": source.as_posix(), "target": target.as_posix()}
            )
            move_count += 1
            _write_json_atomically(journal_path, journal)
            if inject_failure_after_moves is not None and move_count >= inject_failure_after_moves:
                raise ApplyExecutionError(f"injected fixture failure after {move_count} move(s)")

        try:
            # Rename directories shallowest-first so each `git mv` carries its whole
            # subtree intact, then rename the files. A directory can only be moved while
            # it still holds tracked entries, so its descendants must be renamed *after*
            # it. Moving every source aside into a flat staging area first cannot do this:
            # when all of a directory's tracked files are themselves renamed, staging them
            # empties the directory before the directory itself can move, and `git mv` then
            # refuses the now-empty directory. Each operation's source is rewritten to its
            # current on-disk location, because renaming an ancestor directory has already
            # relocated it.
            final_target_by_source = {
                operation["source"]: operation["target"] for operation in operation_details
            }

            def _current_on_disk_source(original_source: str) -> PurePosixPath:
                segments = original_source.split("/")
                for boundary in range(len(segments) - 1, 0, -1):
                    renamed_ancestor = final_target_by_source.get("/".join(segments[:boundary]))
                    if renamed_ancestor is not None:
                        return PurePosixPath(renamed_ancestor + "/" + "/".join(segments[boundary:]))
                return PurePosixPath(original_source)

            directory_operations = sorted(
                (op for op in operation_details if op["source_kind"] == "directory"),
                key=lambda operation: (
                    len(PurePosixPath(operation["source"]).parts),
                    operation["source"],
                    operation["id"],
                ),
            )
            leaf_operations = sorted(
                (op for op in operation_details if op["source_kind"] != "directory"),
                key=lambda operation: (operation["target"], operation["id"]),
            )
            for operation in (*directory_operations, *leaf_operations):
                move(
                    _current_on_disk_source(operation["source"]),
                    PurePosixPath(operation["target"]),
                )
            expected_modes = _translated_manifest(
                locked_plan["mode_manifest_before"], operations
            )
            actual_modes = _tracked_modes(
                repo_root, [PurePosixPath(path) for path in expected_modes]
            )
            if actual_modes != expected_modes:
                raise ApplyExecutionError(
                    f"mode preservation failed: expected {expected_modes}, got {actual_modes}"
                )
            journal["state"] = "applied"
            journal["mode_manifest_after"] = actual_modes
            journal["mode_manifest_delta"] = {
                "added": sorted(set(actual_modes) - set(expected_modes)),
                "removed": sorted(set(expected_modes) - set(actual_modes)),
                "changed": sorted(
                    path
                    for path in set(actual_modes) & set(expected_modes)
                    if actual_modes[path] != expected_modes[path]
                ),
            }
            _write_json_atomically(journal_path, journal)
            return {
                "mode": "apply",
                "plan_id": locked_plan["plan_id"],
                "state": "applied",
                "applied": len(operations),
                "journal": str(journal_path),
                "mode_manifest_delta": journal["mode_manifest_delta"],
            }
        except RenameEngineError as error:
            journal["state"] = "failed"
            journal["error"] = str(error)
            _write_json_atomically(journal_path, journal)
            raise
        except OSError as error:
            journal["state"] = "failed"
            journal["error"] = str(error)
            _write_json_atomically(journal_path, journal)
            raise ApplyExecutionError(f"filesystem operation failed: {error}") from error


def rollback_plan(
    repo_root: Path,
    map_path: Path,
    reviewed_plan: Mapping[str, Any],
    journal_path: Path,
) -> dict[str, Any]:
    """Replay a journal's completed moves in reverse inside a disposable repository."""
    repo_root = repo_root.resolve()
    _assert_path_outside_repository(journal_path, repo_root, "journal")
    _assert_disposable_repository(repo_root)
    try:
        journal = json.loads(journal_path.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as error:
        raise PlanValidationError(f"cannot load rollback journal {journal_path}: {error}") from error
    if not isinstance(journal, dict):
        raise PlanValidationError("rollback journal root must be an object")
    if journal.get("state") == "reverted":
        return {
            "mode": "rollback",
            "plan_id": journal.get("plan_id"),
            "state": "reverted",
            "reverted_moves": 0,
            "journal": str(journal_path),
        }
    if journal.get("state") not in {"failed", "applied"}:
        raise PlanValidationError(
            f"journal state {journal.get('state')!r} is not rollback-eligible"
        )

    with _exclusive_apply_lock(repo_root):
        semantic_map = load_semantic_map(map_path)
        if _git_head(repo_root) != semantic_map.base_sha:
            raise PreflightError(
                f"rollback refused: HEAD {_git_head(repo_root)} does not equal BASE {semantic_map.base_sha}"
            )
        identity_plan = build_plan_identity_only(semantic_map)
        _validate_reviewed_plan(reviewed_plan, identity_plan)
        for field in ("plan_id", "base_sha", "map_sha256", "operation_order"):
            if journal.get(field) != reviewed_plan.get(field):
                raise PlanValidationError(f"rollback journal {field} does not match reviewed plan")

        stage_root = PurePosixPath(str(journal["stage_root"]))
        _assert_only_expected_dirty(repo_root, reviewed_plan["operation_order"], stage_root)
        completed_moves = journal.get("completed_moves")
        if not isinstance(completed_moves, list):
            raise PlanValidationError("rollback journal completed_moves must be an array")
        journal["state"] = "rolling-back"
        _write_json_atomically(journal_path, journal)

        reverted = 0
        try:
            for move_record in reversed(completed_moves):
                source = _validate_relative_path(move_record.get("source"), "journal move source")
                target = _validate_relative_path(move_record.get("target"), "journal move target")
                if not _lexists(repo_root, target):
                    raise ApplyExecutionError(
                        f"rollback source is missing for completed move: {target}"
                    )
                repo_root.joinpath(*source.parent.parts).mkdir(parents=True, exist_ok=True)
                _git_mv(repo_root, target, source)
                reverted += 1
            _remove_empty_stage(repo_root.joinpath(*stage_root.parts))
            if not _tree_is_clean(repo_root):
                raise ApplyExecutionError("rollback completed but repository is not clean")
            journal["state"] = "reverted"
            journal["reverted_moves"] = reverted
            _write_json_atomically(journal_path, journal)
        except RenameEngineError as error:
            journal["state"] = "rollback-failed"
            journal["rollback_error"] = str(error)
            _write_json_atomically(journal_path, journal)
            raise

    return {
        "mode": "rollback",
        "plan_id": journal["plan_id"],
        "state": "reverted",
        "reverted_moves": reverted,
        "journal": str(journal_path),
    }


def build_plan_identity_only(semantic_map: SemanticMap) -> dict[str, Any]:
    """Build the immutable portion of a plan without inspecting filesystem state."""
    batches = _plan_batches(semantic_map.entries)
    entry_by_id = {entry.entry_id: entry for entry in semantic_map.entries}
    operation_order: list[dict[str, str]] = []
    for batch in batches:
        batch_entries = sorted(
            (entry_by_id[member] for member in batch["members"]),
            key=lambda entry: (entry.source.as_posix(), entry.entry_id),
        )
        for entry in batch_entries:
            assert entry.target is not None
            operation_order.append(
                {
                    "id": entry.entry_id,
                    "batch": batch["id"],
                    "source": entry.source.as_posix(),
                    "target": entry.target.as_posix(),
                }
            )
    payload = _identity_payload(semantic_map, batches, operation_order)
    return {
        "schema_version": SCHEMA_VERSION,
        "plan_id": _sha256(_canonical_json(payload)),
        "base_sha": semantic_map.base_sha,
        "map_sha256": semantic_map.map_sha256,
        "batches": batches,
        "operation_order": operation_order,
    }
