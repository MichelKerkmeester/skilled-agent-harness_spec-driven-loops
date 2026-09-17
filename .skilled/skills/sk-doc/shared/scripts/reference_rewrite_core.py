#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: Reference Rewrite Executor Core
# ───────────────────────────────────────────────────────────────
"""Plan, apply and roll back ledger-bounded static reference rewrites.

The module never discovers new rewrite sites. It consumes an accepted reference
ledger and an explicit semantic map, then rewrites only the static sites already
recorded by that ledger. Mutating operations require a committed disposable
fixture marker plus a local Git opt-in.
"""

from __future__ import annotations

import base64
import fcntl
import hashlib
import json
import os
import posixpath
import stat
import subprocess
import tempfile
from contextlib import contextmanager
from pathlib import Path, PurePosixPath
from typing import Any, Callable, Iterator, Mapping, Sequence

from naming_root_resolver import assert_supported_root_path
from reference_checker_core import validate_ledger
from reference_checker_extractors import extract_references
from reference_checker_models import (
    CheckerError,
    MapEntry,
    SemanticMap,
    canonical_json_bytes,
    git_blob_hash,
    load_semantic_map,
    operation_set_hash,
    sha256_json,
)
from rename_engine_core import (
    DISPOSABLE_CONFIG_KEY,
    DISPOSABLE_MARKER,
    DISPOSABLE_MARKER_CONTENT,
    RenameEngineError,
    build_plan_identity_only,
    load_semantic_map as load_engine_semantic_map,
)


# ───────────────────────────────────────────────────────────────
# 1. CONSTANTS AND ERRORS
# ───────────────────────────────────────────────────────────────

PLAN_SCHEMA_VERSION = 1
JOURNAL_SCHEMA_VERSION = 1
SUPPORTED_STATIC_KINDS = frozenset(
    {
        "config-path",
        "js-module",
        "markdown-link",
        "registry-path",
        "shell-executable",
        "shell-source",
        "symlink-target",
    }
)
TERMINAL_DYNAMIC_DISPOSITIONS = frozenset(
    {
        "bounded-static-pattern",
        "manual-review-required",
        "out-of-scope",
        "preserved-by-policy",
        "producer-routed",
        "resolved-static-expression",
    }
)


class ReferenceRewriteError(RuntimeError):
    """The executor cannot prove a safe deterministic rewrite."""


class InputValidationError(ReferenceRewriteError):
    """A map, ledger or reviewed plan violates the input contract."""


class PreflightError(ReferenceRewriteError):
    """Repository state blocks a mutating operation."""


class ApplyExecutionError(ReferenceRewriteError):
    """A fixture apply failed after its journal was created."""


# ───────────────────────────────────────────────────────────────
# 2. GIT AND FILESYSTEM SAFETY
# ───────────────────────────────────────────────────────────────


def _git(
    repository_root: Path,
    arguments: Sequence[str],
    *,
    check: bool = True,
) -> subprocess.CompletedProcess[bytes]:
    """Run Git with an option-terminated path contract supplied by callers."""
    result = subprocess.run(
        ["git", "-C", str(repository_root), *arguments],
        check=False,
        capture_output=True,
    )
    if check and result.returncode != 0:
        detail = result.stderr.decode("utf-8", errors="replace").strip()
        raise PreflightError(detail or f"git exited {result.returncode}")
    return result


def _git_head(repository_root: Path) -> str:
    """Return the current immutable commit identity."""
    return _git(repository_root, ["rev-parse", "HEAD"]).stdout.decode("ascii").strip()


def _status_paths(repository_root: Path) -> set[PurePosixPath]:
    """Return every tracked or untracked dirty path without rename inference."""
    dirty: set[PurePosixPath] = set()
    commands = (
        ["diff", "--name-only", "--no-renames", "-z", "HEAD", "--"],
        ["diff", "--cached", "--name-only", "--no-renames", "-z", "HEAD", "--"],
        ["ls-files", "--others", "--exclude-standard", "-z", "--"],
    )
    for command in commands:
        raw = _git(repository_root, command).stdout
        dirty.update(
            PurePosixPath(item.decode("utf-8", errors="surrogateescape"))
            for item in raw.split(b"\0")
            if item
        )
    return dirty


def _tree_is_clean(repository_root: Path) -> bool:
    """Return whether HEAD, index and working tree have identical path content."""
    return not _status_paths(repository_root)


def _ledger_rewrite_surface(ledger: Mapping[str, Any]) -> set[PurePosixPath]:
    """Every file the ledger may rewrite, across all batches — the expected change surface."""
    surface: set[PurePosixPath] = {PurePosixPath(DISPOSABLE_MARKER)}
    for row in ledger.get("rows", []):
        for site in row.get("reference_sites") or []:
            file = site.get("file")
            if file:
                surface.add(PurePosixPath(file))
    return surface


def _foreign_dirty_paths(
    repository_root: Path, allowed: set[PurePosixPath]
) -> set[PurePosixPath]:
    """Dirty paths outside the ledger's own rewrite surface (i.e. not from this migration).

    Applying an SCC leaves that batch's rewritten files dirty. Driving the batches back to back
    without an intervening commit keeps HEAD pinned to the ledger head, but each later batch would
    then see the earlier batches' rewrites as a dirty tree. Those accumulated edits are expected and
    bounded to the ledger's own sites; only edits outside that surface indicate a foreign writer.
    """
    return {path for path in _status_paths(repository_root) if path not in allowed}


def _git_dir(repository_root: Path) -> Path:
    """Resolve the repository metadata directory for the executor lock."""
    raw = _git(repository_root, ["rev-parse", "--git-dir"]).stdout.decode("utf-8").strip()
    path = Path(raw)
    if not path.is_absolute():
        path = repository_root / path
    return path.resolve()


@contextmanager
def _exclusive_apply_lock(repository_root: Path) -> Iterator[None]:
    """Serialize executor apply and rollback operations in one fixture repo."""
    lock_path = _git_dir(repository_root) / "reference-rewrite-executor.lock"
    with lock_path.open("a+b") as lock_file:
        fcntl.flock(lock_file.fileno(), fcntl.LOCK_EX)
        try:
            yield
        finally:
            fcntl.flock(lock_file.fileno(), fcntl.LOCK_UN)


def _assert_disposable_repository(repository_root: Path) -> None:
    """Require both independent fixture opt-ins before any content mutation."""
    marker = repository_root / DISPOSABLE_MARKER
    try:
        content = marker.read_text(encoding="utf-8")
    except OSError as error:
        raise PreflightError(
            f"apply and rollback require committed marker {DISPOSABLE_MARKER}: {error}"
        ) from error
    if content != DISPOSABLE_MARKER_CONTENT:
        raise PreflightError(f"disposable marker {DISPOSABLE_MARKER} has unexpected content")
    tracked = _git(
        repository_root,
        ["ls-files", "--error-unmatch", "--", DISPOSABLE_MARKER],
        check=False,
    )
    if tracked.returncode != 0:
        raise PreflightError(f"disposable marker {DISPOSABLE_MARKER} must be committed")
    configured = _git(
        repository_root,
        ["config", "--local", "--get", DISPOSABLE_CONFIG_KEY],
        check=False,
    )
    if configured.returncode != 0 or configured.stdout.decode("utf-8").strip().lower() != "true":
        raise PreflightError(
            f"apply and rollback require local Git config {DISPOSABLE_CONFIG_KEY}=true"
        )


def _assert_external_path(path: Path, repository_root: Path, label: str) -> None:
    """Keep plans and journals outside the mutable fixture repository."""
    try:
        path.resolve().relative_to(repository_root.resolve())
    except ValueError:
        return
    raise PreflightError(f"{label} must be outside the disposable repository: {path}")


def _relative_path(value: Any, label: str) -> PurePosixPath:
    """Validate a normalized repository-relative POSIX path."""
    if not isinstance(value, str) or not value or "\x00" in value or "\\" in value:
        raise InputValidationError(f"{label} must be a NUL-free relative POSIX path")
    path = PurePosixPath(value)
    if path.is_absolute() or path.as_posix() != value:
        raise InputValidationError(f"{label} must be normalized and repository-relative: {value!r}")
    if any(part in {"", ".", "..", ".git"} for part in path.parts):
        raise InputValidationError(f"{label} escapes or enters repository metadata: {value!r}")
    assert_supported_root_path(value)
    return path


def _safe_physical_path(repository_root: Path, relative_path: PurePosixPath) -> Path:
    """Resolve a ledger path without following a symlinked ancestor."""
    current = repository_root
    for part in relative_path.parts[:-1]:
        current = current / part
        if current.is_symlink():
            raise PreflightError(
                f"rewrite path traverses symlinked directory: {relative_path.as_posix()}"
            )
    return repository_root.joinpath(*relative_path.parts)


def _tracked_mode(repository_root: Path, relative_path: PurePosixPath) -> str:
    """Return the stage-zero mode for one exact ledger path."""
    raw = _git(
        repository_root,
        ["ls-files", "-s", "-z", "--", relative_path.as_posix()],
    ).stdout
    records = [record for record in raw.split(b"\0") if record]
    if len(records) != 1:
        raise PreflightError(f"rewrite site is not one exact tracked path: {relative_path}")
    metadata, raw_path = records[0].split(b"\t", 1)
    actual_path = raw_path.decode("utf-8", errors="surrogateescape")
    if actual_path != relative_path.as_posix():
        raise PreflightError(f"Git returned unexpected tracked path {actual_path!r}")
    return metadata.split(b" ", 1)[0].decode("ascii")


def _read_blob(repository_root: Path, relative_path: PurePosixPath, mode: str) -> bytes:
    """Read regular file bytes or a symlink target without following the link."""
    physical = _safe_physical_path(repository_root, relative_path)
    if mode == "120000":
        if not physical.is_symlink():
            raise PreflightError(f"tracked symlink is not a symlink in the worktree: {relative_path}")
        return os.fsencode(os.readlink(physical))
    if physical.is_symlink() or not physical.is_file():
        raise PreflightError(f"tracked rewrite site is not a regular file: {relative_path}")
    return physical.read_bytes()


def _write_blob(
    repository_root: Path,
    relative_path: PurePosixPath,
    mode: str,
    content: bytes,
) -> None:
    """Replace one fixture blob atomically while preserving its tracked mode."""
    physical = _safe_physical_path(repository_root, relative_path)
    if mode == "120000":
        temporary = physical.parent / f".{physical.name}.rewrite-{os.getpid()}"
        if temporary.exists() or temporary.is_symlink():
            temporary.unlink()
        os.symlink(os.fsdecode(content), temporary)
        os.replace(temporary, physical)
        return

    file_mode = stat.S_IMODE(physical.stat().st_mode)
    with tempfile.NamedTemporaryFile(
        "wb",
        dir=physical.parent,
        prefix=f".{physical.name}.rewrite-",
        delete=False,
    ) as temporary_file:
        temporary_file.write(content)
        temporary_path = Path(temporary_file.name)
    os.chmod(temporary_path, file_mode)
    os.replace(temporary_path, physical)


def _write_json_atomically(path: Path, value: Mapping[str, Any]) -> None:
    """Persist a journal transition without exposing a partial JSON document."""
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


# ───────────────────────────────────────────────────────────────
# 3. INPUT CONTRACTS AND PLAN IDENTITY
# ───────────────────────────────────────────────────────────────


def _load_json(path: Path, label: str) -> dict[str, Any]:
    """Load one UTF-8 JSON object with a contextual error."""
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as error:
        raise InputValidationError(f"cannot load {label} {path}: {error}") from error
    if not isinstance(value, dict):
        raise InputValidationError(f"{label} root must be an object")
    return value


def load_ledger(path: Path, semantic_map: SemanticMap) -> dict[str, Any]:
    """Load an accepted checker ledger and verify its self-hash and denominator."""
    ledger = _load_json(path, "reference ledger")
    try:
        validate_ledger(ledger, semantic_map)
    except CheckerError as error:
        raise InputValidationError(str(error)) from error
    supplied_hash = ledger.get("ledger_hash")
    unhashed = dict(ledger)
    unhashed.pop("ledger_hash", None)
    if supplied_hash != sha256_json(unhashed):
        raise InputValidationError("reference ledger hash does not match its canonical content")
    scan = ledger.get("scan")
    if not isinstance(scan, dict):
        raise InputValidationError("reference ledger scan block is missing")
    if scan.get("tracked_file_count", 0) <= 0 or scan.get("scanned_reference_file_count", 0) <= 0:
        raise InputValidationError("zero-file scan is unsafe and cannot produce a rewrite plan")
    return ledger


def load_inputs(
    map_path: Path,
    ledger_path: Path,
) -> tuple[SemanticMap, dict[str, Any], dict[str, Any]]:
    """Load the shared checker and engine views of the same semantic map bytes."""
    try:
        semantic_map = load_semantic_map(map_path)
        engine_map = load_engine_semantic_map(map_path)
    except (CheckerError, RenameEngineError) as error:
        raise InputValidationError(str(error)) from error
    ledger = load_ledger(ledger_path, semantic_map)
    identity = ledger.get("plan_identity")
    assert isinstance(identity, dict)
    expected_operations = [entry.operation_identity() for entry in semantic_map.entries]
    if identity.get("base_sha") != semantic_map.base_sha:
        raise InputValidationError("ledger BASE does not match the semantic map")
    if identity.get("map_hash") != semantic_map.map_hash:
        raise InputValidationError("ledger map hash does not match the semantic map bytes")
    if identity.get("operation_set_hash") != operation_set_hash(semantic_map):
        raise InputValidationError("ledger operation-set hash does not match the semantic map")
    if identity.get("ordered_operations") != expected_operations:
        raise InputValidationError("ledger source-target set or order does not match the semantic map")
    for operation in expected_operations:
        if operation["classification"] == "rename" and operation.get("safe_argv") != [
            "git",
            "mv",
            "--",
            operation["source"],
            operation["target"],
        ]:
            raise InputValidationError("rename path operands are not protected by option termination")
    return semantic_map, ledger, build_plan_identity_only(engine_map)


def _batch(ledger: Mapping[str, Any], batch_id: str) -> dict[str, Any]:
    """Return one exact reference-graph SCC and reject alternate batch schemes."""
    graph = ledger.get("reference_graph")
    if not isinstance(graph, dict):
        raise InputValidationError("reference ledger graph is missing")
    batches = graph.get("scc_batches")
    if not isinstance(batches, list) or not batches:
        raise InputValidationError("reference ledger has no dependency-closure SCC batches")
    matches = [value for value in batches if value.get("batch_id") == batch_id]
    if len(matches) != 1:
        raise InputValidationError(f"unknown or duplicate SCC batch: {batch_id}")
    selected = matches[0]
    if selected.get("batch_rule") != "reference-graph-scc":
        raise InputValidationError("rewrite batches must be reference-graph SCCs")
    map_ids = selected.get("map_ids")
    if not isinstance(map_ids, list) or not map_ids or len(map_ids) != len(set(map_ids)):
        raise InputValidationError("SCC batch must contain a non-empty unique map-id list")
    return dict(selected)


# ───────────────────────────────────────────────────────────────
# 4. STATIC REWRITE PLANNING
# ───────────────────────────────────────────────────────────────


def _split_reference_suffix(raw_value: str) -> tuple[str, str]:
    """Separate query or fragment text from a path value."""
    positions = [position for marker in ("?", "#") if (position := raw_value.find(marker)) >= 0]
    if not positions:
        return raw_value, ""
    position = min(positions)
    return raw_value[:position], raw_value[position:]


def _normalized_join(base: PurePosixPath, value: str) -> PurePosixPath:
    """Normalize a POSIX reference without permitting an escaped repository path."""
    normalized = posixpath.normpath(posixpath.join(base.as_posix(), value))
    if normalized == ".." or normalized.startswith("../") or normalized.startswith("/"):
        raise InputValidationError(f"reference escapes the repository root: {value!r}")
    return PurePosixPath(normalized)


def _logical_target(
    source: PurePosixPath,
    target: PurePosixPath,
    raw_path: str,
) -> PurePosixPath:
    """Preserve extensionless and directory-index reference forms semantically."""
    raw_suffix = PurePosixPath(raw_path).suffix
    source_suffix = source.suffix
    if source.name.startswith("index.") and not raw_suffix:
        return target.parent
    if source_suffix and not raw_suffix and target.suffix == source_suffix:
        return target.with_suffix("")
    return target


def _replacement_value(
    site: Mapping[str, Any],
    entry: MapEntry,
) -> str:
    """Build a reference from the explicit map target while preserving path form."""
    raw_value = site.get("raw_value")
    if not isinstance(raw_value, str) or not raw_value:
        raise InputValidationError(f"site {site.get('site_id')} has no static raw value")
    raw_path, suffix = _split_reference_suffix(raw_value)
    file_path = _relative_path(site.get("file"), "site file")
    logical_source = _logical_target(entry.source, entry.source, raw_path)
    logical_target = _logical_target(entry.source, entry.target, raw_path)
    if raw_path.startswith("/"):
        return f"/{logical_target.as_posix()}{suffix}"

    file_parent = file_path.parent
    relative_candidate = _normalized_join(file_parent, raw_path)
    if relative_candidate == logical_source:
        rendered = posixpath.relpath(logical_target.as_posix(), file_parent.as_posix())
        if raw_path.startswith("./") and not rendered.startswith("."):
            rendered = f"./{rendered}"
        return f"{rendered}{suffix}"
    root_candidate = _normalized_join(PurePosixPath("."), raw_path)
    if root_candidate == logical_source:
        return f"{logical_target.as_posix()}{suffix}"
    raise InputValidationError(
        f"site {site.get('site_id')} no longer resolves to map entry {entry.map_id}"
    )


def _map_rows(ledger: Mapping[str, Any]) -> dict[str, dict[str, Any]]:
    """Index map-entry rows while preserving ledger ownership of site discovery."""
    rows = ledger.get("rows")
    assert isinstance(rows, list)
    return {
        str(row["map_id"]): dict(row)
        for row in rows
        if row.get("row_type") == "map-entry"
    }


def _dynamic_states(ledger: Mapping[str, Any]) -> list[dict[str, Any]]:
    """Expose every dynamic site as routed or skipped, never as rewrite input."""
    rows = ledger.get("rows")
    assert isinstance(rows, list)
    states = []
    for row in rows:
        if row.get("row_type") != "dynamic-site":
            continue
        disposition = row.get("disposition")
        if disposition not in TERMINAL_DYNAMIC_DISPOSITIONS:
            raise InputValidationError(f"dynamic site {row.get('site_id')} is not terminal")
        state = "routed-to-producer" if disposition == "producer-routed" else "skipped-with-reason"
        states.append(
            {
                "site_id": row.get("site_id"),
                "file": row.get("file"),
                "state": state,
                "reason": row.get("rationale"),
                "evidence": row.get("evidence"),
            }
        )
    return states


def _site_plan(
    repository_root: Path,
    semantic_map: SemanticMap,
    ledger: Mapping[str, Any],
    selected_batch: Mapping[str, Any],
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    """Build ledger-owned pending sites and terminal states for one SCC."""
    rows_by_id = _map_rows(ledger)
    entries_by_id = semantic_map.by_id
    pending_sites: list[dict[str, Any]] = []
    states = _dynamic_states(ledger)
    selected_ids = set(selected_batch["map_ids"])
    for entry in semantic_map.entries:
        row = rows_by_id[entry.map_id]
        reference_sites = row.get("reference_sites")
        if not isinstance(reference_sites, list):
            raise InputValidationError(f"map row {entry.map_id} reference_sites must be an array")
        if entry.classification != "rename":
            states.append(
                {
                    "map_id": entry.map_id,
                    "state": "skipped-with-reason",
                    "reason": row.get("rationale"),
                    "evidence": row.get("evidence"),
                }
            )
            continue
        if entry.map_id not in selected_ids:
            for site in reference_sites:
                states.append(
                    {
                        "site_id": site.get("site_id"),
                        "map_id": entry.map_id,
                        "file": site.get("file"),
                        "state": "skipped-with-reason",
                        "reason": "site belongs to a different dependency-closure SCC",
                        "evidence": [selected_batch["batch_id"]],
                    }
                )
            continue
        for site in reference_sites:
            kind = site.get("reference_kind")
            if kind not in SUPPORTED_STATIC_KINDS:
                raise InputValidationError(
                    f"site {site.get('site_id')} uses unsupported static class {kind!r}"
                )
            if site.get("matched_side") != "source":
                states.append(
                    {
                        "site_id": site.get("site_id"),
                        "map_id": entry.map_id,
                        "file": site.get("file"),
                        "state": "skipped-with-reason",
                        "reason": "reference already resolves to the explicit map target",
                        "evidence": [str(site.get("preimage_blob_hash"))],
                    }
                )
                continue
            file_path = _relative_path(site.get("file"), "site file")
            mode = _tracked_mode(repository_root, file_path)
            content = _read_blob(repository_root, file_path, mode)
            replacement = _replacement_value(site, entries_by_id[entry.map_id])
            pending_sites.append(
                {
                    "site_id": site.get("site_id"),
                    "site_key": site.get("site_key"),
                    "map_id": entry.map_id,
                    "batch_id": selected_batch["batch_id"],
                    "file": file_path.as_posix(),
                    "mode": mode,
                    "reference_kind": kind,
                    "span_start": site.get("span_start"),
                    "span_end": site.get("span_end"),
                    "raw_value": site.get("raw_value"),
                    "replacement": replacement,
                    "ledger_preimage_blob_hash": site.get("preimage_blob_hash"),
                    "current_preimage_blob_hash": git_blob_hash(content),
                    "cas_rule": "regenerate-on-preimage-drift",
                    "state": "planned",
                }
            )
    grouped: dict[str, list[dict[str, Any]]] = {}
    for site in pending_sites:
        grouped.setdefault(site["file"], []).append(site)
    reconciled_sites: list[dict[str, Any]] = []
    for raw_file in sorted(grouped):
        file_sites = grouped[raw_file]
        current_hashes = {site["current_preimage_blob_hash"] for site in file_sites}
        ledger_hashes = {site["ledger_preimage_blob_hash"] for site in file_sites}
        if current_hashes == ledger_hashes:
            reconciled_sites.extend(file_sites)
            continue
        file_path = _relative_path(raw_file, "site file")
        mode = str(file_sites[0]["mode"])
        content = _read_blob(repository_root, file_path, mode)
        regenerated, terminal = _regenerate_file_sites(file_path, mode, content, file_sites)
        reconciled_sites.extend(regenerated)
        states.extend(terminal)
    pending_sites = reconciled_sites
    pending_sites.sort(key=lambda site: (site["file"], site["span_start"], site["site_id"]))
    states.sort(key=lambda value: (str(value.get("file", "")), str(value.get("site_id", value.get("map_id", "")))))
    return pending_sites, states


def build_plan(
    repository_root: Path,
    map_path: Path,
    ledger_path: Path,
    batch_id: str,
) -> dict[str, Any]:
    """Build a deterministic read-only rewrite plan for one ledger SCC."""
    repository_root = repository_root.resolve()
    _git(repository_root, ["rev-parse", "--show-toplevel"])
    semantic_map, ledger, engine_identity = load_inputs(map_path, ledger_path)
    selected_batch = _batch(ledger, batch_id)
    sites, states = _site_plan(repository_root, semantic_map, ledger, selected_batch)
    identity = ledger["plan_identity"]
    site_plan_hash = sha256_json(sites)
    plan_identity = {
        "base_sha": semantic_map.base_sha,
        "head_sha": identity["head_sha"],
        "map_hash": semantic_map.map_hash,
        "operation_set_hash": identity["operation_set_hash"],
        "ledger_hash": ledger["ledger_hash"],
        "batch_id": batch_id,
        "batch_map_ids": selected_batch["map_ids"],
        "ordered_operations": identity["ordered_operations"],
        "engine_plan_id": engine_identity["plan_id"],
        "site_plan_hash": site_plan_hash,
    }
    return {
        "schema_version": PLAN_SCHEMA_VERSION,
        "mode": "dry-run",
        "plan_id": hashlib.sha256(canonical_json_bytes(plan_identity)).hexdigest(),
        **plan_identity,
        "tree_clean": _tree_is_clean(repository_root),
        "batch": selected_batch,
        "sites": sites,
        "site_states": states,
        "summary": {
            "pending_rewrites": len(sites),
            "selected_batch_sites": len(sites),
            "terminal_nonwrite_states": len(states),
            "scanned_reference_files": ledger["scan"]["scanned_reference_file_count"],
        },
    }


def load_plan(path: Path) -> dict[str, Any]:
    """Load a reviewed dry-run plan."""
    return _load_json(path, "reviewed rewrite plan")


def _validate_reviewed_plan(
    reviewed_plan: Mapping[str, Any],
    current_plan: Mapping[str, Any],
) -> None:
    """Require exact immutable identity and rewrite-site equality."""
    scalar_fields = (
        "schema_version",
        "plan_id",
        "base_sha",
        "head_sha",
        "map_hash",
        "operation_set_hash",
        "ledger_hash",
        "batch_id",
        "engine_plan_id",
        "site_plan_hash",
    )
    for field in scalar_fields:
        if reviewed_plan.get(field) != current_plan.get(field):
            raise PreflightError(f"stale plan: {field} changed; regenerate the rewrite plan")
    for field in ("batch_map_ids", "ordered_operations", "batch", "sites"):
        if reviewed_plan.get(field) != current_plan.get(field):
            raise PreflightError(
                f"stale plan: exact {field.replace('_', ' ')} changed; regenerate the rewrite plan"
            )


# ───────────────────────────────────────────────────────────────
# 5. REGENERATION AND APPLY
# ───────────────────────────────────────────────────────────────


def _regenerate_file_sites(
    file_path: PurePosixPath,
    mode: str,
    content: bytes,
    planned_sites: Sequence[Mapping[str, Any]],
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    """Re-anchor ledger-owned sites in one drifted blob without discovering new sites."""
    if mode == "120000":
        candidates = []
        raw_text = os.fsdecode(content)
        for site in planned_sites:
            if raw_text == site["raw_value"]:
                candidates.append(
                    {
                        **site,
                        "span_start": 0,
                        "span_end": len(raw_text),
                        "current_preimage_blob_hash": git_blob_hash(content),
                        "state": "regenerated",
                    }
                )
            elif raw_text == site["replacement"]:
                return [], [
                    {
                        "site_id": site["site_id"],
                        "map_id": site["map_id"],
                        "file": file_path.as_posix(),
                        "state": "skipped-with-reason",
                        "reason": "reference already resolves to the explicit map target",
                        "evidence": [git_blob_hash(content)],
                    }
                ]
        if len(candidates) != len(planned_sites):
            raise ApplyExecutionError(f"cannot regenerate symlink site in {file_path}")
        return candidates, []

    try:
        text = content.decode("utf-8")
    except UnicodeDecodeError as error:
        raise ApplyExecutionError(f"drifted rewrite file is not UTF-8: {file_path}") from error
    observations = [observation for observation in extract_references(file_path, text) if not observation.dynamic]
    regenerated: list[dict[str, Any]] = []
    terminal: list[dict[str, Any]] = []
    used_offsets: set[int] = set()
    for site in planned_sites:
        matching = [
            observation
            for observation in observations
            if observation.reference_kind == site["reference_kind"]
            and observation.raw_value == site["raw_value"]
            and observation.span_start not in used_offsets
        ]
        if matching:
            # Several identical references (same kind and raw value) in one file rewrite to the same
            # target, so a site need not map to a unique observation — bind it to the first still-
            # unused occurrence deterministically. Each planned site consumes one distinct offset, so
            # N identical quotes are all rewritten across the file's N sites.
            observation = min(matching, key=lambda candidate: candidate.span_start)
            used_offsets.add(observation.span_start)
            regenerated.append(
                {
                    **site,
                    "site_id": observation.site_id,
                    "site_key": observation.site_key,
                    "span_start": observation.span_start,
                    "span_end": observation.span_end,
                    "current_preimage_blob_hash": git_blob_hash(content),
                    "state": "regenerated",
                    "regenerated_from_site_id": site["site_id"],
                }
            )
            continue
        target_matches = [
            observation
            for observation in observations
            if observation.reference_kind == site["reference_kind"]
            and observation.raw_value == site["replacement"]
        ]
        if not matching and len(target_matches) == 1:
            terminal.append(
                {
                    "site_id": site["site_id"],
                    "map_id": site["map_id"],
                    "file": file_path.as_posix(),
                    "state": "skipped-with-reason",
                    "reason": "reference already resolves to the explicit map target",
                    "evidence": [git_blob_hash(content)],
                }
            )
            continue
        raise ApplyExecutionError(
            f"cannot uniquely regenerate ledger site {site['site_id']} in {file_path}"
        )
    return regenerated, terminal


def _prepare_apply_files(
    repository_root: Path,
    reviewed_plan: Mapping[str, Any],
) -> tuple[list[dict[str, Any]], list[dict[str, Any]], bool]:
    """CAS-check every selected blob and regenerate the SCC before any write."""
    grouped: dict[str, list[Mapping[str, Any]]] = {}
    for site in reviewed_plan.get("sites", []):
        grouped.setdefault(str(site["file"]), []).append(site)
    files: list[dict[str, Any]] = []
    terminal_states: list[dict[str, Any]] = []
    regenerated_any = False
    for raw_file in sorted(grouped):
        file_path = _relative_path(raw_file, "planned site file")
        sites = sorted(grouped[raw_file], key=lambda value: (value["span_start"], value["site_id"]))
        mode = _tracked_mode(repository_root, file_path)
        if any(site["mode"] != mode for site in sites):
            raise PreflightError(f"tracked mode changed for rewrite file {file_path}")
        content = _read_blob(repository_root, file_path, mode)
        current_hash = git_blob_hash(content)
        expected_hashes = {site["current_preimage_blob_hash"] for site in sites}
        if len(expected_hashes) != 1:
            raise InputValidationError(f"planned sites disagree on preimage for {file_path}")
        active_sites = [dict(site) for site in sites]
        if current_hash not in expected_hashes:
            active_sites, terminal = _regenerate_file_sites(file_path, mode, content, sites)
            terminal_states.extend(terminal)
            regenerated_any = True
        if not active_sites:
            continue
        files.append(
            {
                "file": file_path.as_posix(),
                "mode": mode,
                "preimage_blob_hash": current_hash,
                "preimage_base64": base64.b64encode(content).decode("ascii"),
                "sites": active_sites,
            }
        )
    return files, terminal_states, regenerated_any


def _render_file(preimage: bytes, file_record: Mapping[str, Any]) -> bytes:
    """Apply non-overlapping ledger spans from highest offset to lowest."""
    if file_record["mode"] == "120000":
        sites = file_record["sites"]
        if len(sites) != 1:
            raise ApplyExecutionError("a symlink target must have exactly one rewrite site")
        return os.fsencode(sites[0]["replacement"])
    try:
        text = preimage.decode("utf-8")
    except UnicodeDecodeError as error:
        raise ApplyExecutionError(f"rewrite file is not UTF-8: {file_record['file']}") from error
    previous_start = len(text) + 1
    for site in sorted(file_record["sites"], key=lambda value: value["span_start"], reverse=True):
        start = site["span_start"]
        end = site["span_end"]
        if not isinstance(start, int) or not isinstance(end, int) or not (0 <= start < end <= len(text)):
            raise ApplyExecutionError(f"invalid rewrite span for site {site['site_id']}")
        if end > previous_start:
            raise ApplyExecutionError(f"overlapping rewrite spans in {file_record['file']}")
        if text[start:end] != site["raw_value"]:
            raise ApplyExecutionError(f"compare-and-swap text mismatch at site {site['site_id']}")
        text = f"{text[:start]}{site['replacement']}{text[end:]}"
        previous_start = start
    return text.encode("utf-8")


def _restore_completed_files(
    repository_root: Path,
    journal: dict[str, Any],
    journal_path: Path,
) -> int:
    """Replay completed writes in reverse and persist every rollback step."""
    reverted = 0
    completed = journal.get("completed_files", [])
    files_by_path = {record["file"]: record for record in journal["files"]}
    for raw_file in reversed(completed):
        record = files_by_path[raw_file]
        path = _relative_path(raw_file, "journal file")
        current = _read_blob(repository_root, path, record["mode"])
        if git_blob_hash(current) != record["postimage_blob_hash"]:
            raise ApplyExecutionError(f"rollback CAS mismatch for {raw_file}")
        preimage = base64.b64decode(record["preimage_base64"], validate=True)
        _write_blob(repository_root, path, record["mode"], preimage)
        reverted += 1
        journal["reverted_files"].append(raw_file)
        _write_json_atomically(journal_path, journal)
    return reverted


def apply_plan(
    repository_root: Path,
    map_path: Path,
    ledger_path: Path,
    reviewed_plan: Mapping[str, Any],
    journal_path: Path,
    *,
    inject_drift: Callable[[Path], None] | None = None,
    inject_failure_after_writes: int | None = None,
) -> dict[str, Any]:
    """Apply one reviewed SCC plan inside an explicitly disposable repository."""
    repository_root = repository_root.resolve()
    _assert_external_path(map_path, repository_root, "semantic map")
    _assert_external_path(ledger_path, repository_root, "reference ledger")
    _assert_external_path(journal_path, repository_root, "rewrite journal")
    _assert_disposable_repository(repository_root)
    with _exclusive_apply_lock(repository_root):
        allowed_surface = _ledger_rewrite_surface(_load_json(ledger_path, "reference ledger"))
        current_plan = build_plan(
            repository_root,
            map_path,
            ledger_path,
            str(reviewed_plan.get("batch_id", "")),
        )
        _validate_reviewed_plan(reviewed_plan, current_plan)
        if _git_head(repository_root) != reviewed_plan.get("head_sha"):
            raise PreflightError("stale plan: HEAD changed; regenerate the rewrite plan")
        foreign = _foreign_dirty_paths(repository_root, allowed_surface)
        if foreign:
            raise PreflightError(
                f"foreign changes outside the ledger rewrite surface: {sorted(p.as_posix() for p in foreign)[:3]}"
            )

        # Reload under the lock so map bytes, HEAD, cleanliness and operation order
        # describe one pre-write instant rather than a sequence of stale checks.
        locked_plan = build_plan(
            repository_root,
            map_path,
            ledger_path,
            str(reviewed_plan.get("batch_id", "")),
        )
        _validate_reviewed_plan(reviewed_plan, locked_plan)
        if _git_head(repository_root) != reviewed_plan.get("head_sha") or _foreign_dirty_paths(
            repository_root, allowed_surface
        ):
            raise PreflightError("stale plan: HEAD or foreign-change state changed during revalidation")

        if inject_drift is not None:
            inject_drift(repository_root)
        files, terminal_states, regenerated = _prepare_apply_files(repository_root, reviewed_plan)
        journal: dict[str, Any] = {
            "schema_version": JOURNAL_SCHEMA_VERSION,
            "plan_id": reviewed_plan["plan_id"],
            "base_sha": reviewed_plan["base_sha"],
            "head_sha": reviewed_plan["head_sha"],
            "map_hash": reviewed_plan["map_hash"],
            "ledger_hash": reviewed_plan["ledger_hash"],
            "batch_id": reviewed_plan["batch_id"],
            "state": "applying",
            "regenerated": regenerated,
            "site_states": [*reviewed_plan.get("site_states", []), *terminal_states],
            "files": [],
            "completed_files": [],
            "reverted_files": [],
            "error": None,
        }
        for file_record in files:
            preimage = base64.b64decode(file_record["preimage_base64"], validate=True)
            postimage = _render_file(preimage, file_record)
            journal["files"].append(
                {
                    **file_record,
                    "postimage_blob_hash": git_blob_hash(postimage),
                    "postimage_base64": base64.b64encode(postimage).decode("ascii"),
                }
            )
        _write_json_atomically(journal_path, journal)

        try:
            for file_record in journal["files"]:
                path = _relative_path(file_record["file"], "journal file")
                current = _read_blob(repository_root, path, file_record["mode"])
                if git_blob_hash(current) != file_record["preimage_blob_hash"]:
                    raise ApplyExecutionError(
                        f"compare-and-swap preimage changed before write: {file_record['file']}"
                    )
                postimage = base64.b64decode(file_record["postimage_base64"], validate=True)
                _write_blob(repository_root, path, file_record["mode"], postimage)
                journal["completed_files"].append(file_record["file"])
                journal["site_states"].extend(
                    {
                        "site_id": site["site_id"],
                        "map_id": site["map_id"],
                        "file": file_record["file"],
                        "state": (
                            "regenerated" if site.get("state") == "regenerated" else "applied"
                        ),
                        "evidence": [file_record["postimage_blob_hash"]],
                    }
                    for site in file_record["sites"]
                )
                _write_json_atomically(journal_path, journal)
                if (
                    inject_failure_after_writes is not None
                    and len(journal["completed_files"]) >= inject_failure_after_writes
                ):
                    raise ApplyExecutionError(
                        f"injected fixture failure after {len(journal['completed_files'])} write(s)"
                    )
            journal["state"] = "applied"
            _write_json_atomically(journal_path, journal)
        except (ReferenceRewriteError, OSError, ValueError) as error:
            journal["state"] = "failed"
            journal["error"] = str(error)
            recorded_site_ids = {
                state.get("site_id") for state in journal["site_states"] if state.get("site_id")
            }
            for file_record in journal["files"]:
                for site in file_record["sites"]:
                    if site["site_id"] in recorded_site_ids:
                        continue
                    journal["site_states"].append(
                        {
                            "site_id": site["site_id"],
                            "map_id": site["map_id"],
                            "file": file_record["file"],
                            "state": "failed-with-evidence",
                            "reason": str(error),
                            "evidence": [file_record["preimage_blob_hash"]],
                        }
                    )
            _write_json_atomically(journal_path, journal)
            try:
                _restore_completed_files(repository_root, journal, journal_path)
                journal["state"] = "failed-rolled-back"
                _write_json_atomically(journal_path, journal)
            except (ReferenceRewriteError, OSError, ValueError) as rollback_error:
                journal["state"] = "rollback-failed"
                journal["rollback_error"] = str(rollback_error)
                _write_json_atomically(journal_path, journal)
            raise ApplyExecutionError(str(error)) from error

        return {
            "mode": "apply",
            "plan_id": reviewed_plan["plan_id"],
            "batch_id": reviewed_plan["batch_id"],
            "state": "applied",
            "applied_files": len(journal["files"]),
            "applied_sites": sum(len(record["sites"]) for record in journal["files"]),
            "regenerated": regenerated,
            "journal": str(journal_path),
        }


# ───────────────────────────────────────────────────────────────
# 6. ROLLBACK
# ───────────────────────────────────────────────────────────────


def rollback_plan(
    repository_root: Path,
    map_path: Path,
    ledger_path: Path,
    reviewed_plan: Mapping[str, Any],
    journal_path: Path,
) -> dict[str, Any]:
    """Restore an applied fixture batch using its inverse rewrite journal."""
    repository_root = repository_root.resolve()
    _assert_external_path(map_path, repository_root, "semantic map")
    _assert_external_path(ledger_path, repository_root, "reference ledger")
    _assert_external_path(journal_path, repository_root, "rewrite journal")
    _assert_disposable_repository(repository_root)
    journal = _load_json(journal_path, "rewrite journal")
    if journal.get("state") == "reverted":
        return {
            "mode": "rollback",
            "plan_id": journal.get("plan_id"),
            "state": "reverted",
            "reverted_files": 0,
            "journal": str(journal_path),
        }
    if journal.get("state") != "applied":
        raise PreflightError(f"journal state {journal.get('state')!r} is not rollback-eligible")
    for field in ("plan_id", "base_sha", "head_sha", "map_hash", "ledger_hash", "batch_id"):
        if journal.get(field) != reviewed_plan.get(field):
            raise PreflightError(f"rollback journal {field} does not match the reviewed plan")
    semantic_map, ledger, _ = load_inputs(map_path, ledger_path)
    if semantic_map.map_hash != reviewed_plan.get("map_hash"):
        raise PreflightError("rollback map hash does not match the reviewed plan")
    if ledger.get("ledger_hash") != reviewed_plan.get("ledger_hash"):
        raise PreflightError("rollback ledger hash does not match the reviewed plan")
    if _git_head(repository_root) != reviewed_plan.get("head_sha"):
        raise PreflightError("rollback HEAD does not match the reviewed plan")
    allowed = {PurePosixPath(record["file"]) for record in journal.get("files", [])}
    unexpected = sorted(_status_paths(repository_root) - allowed)
    if unexpected:
        raise PreflightError(
            "rollback found dirty paths outside its journal: "
            + ", ".join(path.as_posix() for path in unexpected)
        )

    with _exclusive_apply_lock(repository_root):
        journal["state"] = "rolling-back"
        _write_json_atomically(journal_path, journal)
        reverted = _restore_completed_files(repository_root, journal, journal_path)
        remaining_dirty = _status_paths(repository_root)
        unexpected = sorted(remaining_dirty - allowed)
        if unexpected:
            journal["state"] = "rollback-failed"
            journal["rollback_error"] = (
                "rollback left dirty paths outside its journal: "
                + ", ".join(path.as_posix() for path in unexpected)
            )
            _write_json_atomically(journal_path, journal)
            raise ApplyExecutionError(journal["rollback_error"])
        journal["state"] = "reverted"
        journal["tree_clean_after_rollback"] = not remaining_dirty
        _write_json_atomically(journal_path, journal)
    return {
        "mode": "rollback",
        "plan_id": reviewed_plan["plan_id"],
        "state": "reverted",
        "reverted_files": reverted,
        "tree_clean": not remaining_dirty,
        "journal": str(journal_path),
    }


__all__ = [
    "ApplyExecutionError",
    "InputValidationError",
    "PreflightError",
    "ReferenceRewriteError",
    "apply_plan",
    "build_plan",
    "load_plan",
    "rollback_plan",
]
