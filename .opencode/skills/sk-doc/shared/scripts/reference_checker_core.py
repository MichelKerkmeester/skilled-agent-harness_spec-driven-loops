#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: WHOLE-REPOSITORY REFERENCE CHECKER
# ───────────────────────────────────────────────────────────────
"""Read-only Git manifest scanning, map reconciliation, and ledger assembly."""

from __future__ import annotations

import hashlib
import json
import os
import posixpath
import subprocess
from collections import defaultdict
from pathlib import Path, PurePosixPath
from typing import Any, Iterable, Mapping, Sequence
from urllib.parse import unquote, urlsplit

from check_no_new_snake_case import (
    FROZEN_ROOT_NAMES,
    GENERATED_ROOT_NAMES,
    GENERATED_SUFFIXES,
    LOCKFILE_NAMES,
    TEST_RUNNER_ROOT_NAMES,
    TOOL_MANDATED_NAMES,
    VENDORED_ROOT_NAMES,
)
from naming_root_resolver import canonical_root
from reference_checker_extractors import extract_references
from reference_checker_models import (
    BLOCKING_STATUSES,
    DYNAMIC_DISPOSITIONS,
    LEDGER_SCHEMA_VERSION,
    CheckerError,
    MapEntry,
    ReferenceObservation,
    SemanticMap,
    TrackedEntry,
    git_blob_hash,
    operation_set_hash,
    sha256_json,
)


# ───────────────────────────────────────────────────────────────
# 1. CONSTANTS
# ───────────────────────────────────────────────────────────────

MODULE_SUFFIXES = (".cjs", ".js", ".jsx", ".mjs", ".ts", ".tsx")
SUPPORTED_TEXT_SUFFIXES = frozenset(
    {
        ".bash",
        ".cjs",
        ".js",
        ".json",
        ".jsonc",
        ".jsx",
        ".md",
        ".mdx",
        ".mjs",
        ".sh",
        ".toml",
        ".ts",
        ".tsx",
        ".yaml",
        ".yml",
        ".zsh",
    }
)
URL_SCHEMES = frozenset({"data", "file", "ftp", "http", "https", "mailto", "tel"})
SCAN_STATES = frozenset({"auto", "post", "pre"})

# The spec/planning tree documents and records references (spec prose, decision records, review
# transcripts, research and per-iteration logs, scratch runs) rather than consuming them at runtime.
# It quotes pre-migration names as historical data; rewriting it corrupts records and, on transcripts
# that cite hundreds of paths, cannot be uniquely regenerated. Runtime consumers live outside it.
MIGRATION_SELF_RECORD_PREFIX = ".opencode/specs/"
# Record work-product directory names anywhere else in the tree (outside the spec tree above).
RECORD_ARTIFACT_SEGMENTS = frozenset({"scratch", "review", "iterations", "runs-archive"})


# ───────────────────────────────────────────────────────────────
# 2. READ-ONLY GIT ACCESS
# ───────────────────────────────────────────────────────────────


class GitRepository:
    """Read-only access to one canonical Git worktree."""

    def __init__(self, root: Path):
        requested = root.resolve()
        result = self._run_at(requested, ["rev-parse", "--show-toplevel"])
        discovered = Path(result.decode("utf-8").strip()).resolve()
        if requested != discovered:
            raise CheckerError(
                f"scan root must be the Git worktree root: requested {requested}, found {discovered}"
            )
        self.root = discovered

    @staticmethod
    def _run_at(root: Path, args: Sequence[str]) -> bytes:
        result = subprocess.run(
            ["git", "-C", str(root), *args],
            check=False,
            capture_output=True,
        )
        if result.returncode != 0:
            detail = result.stderr.decode("utf-8", errors="replace").strip()
            raise CheckerError(detail or f"git {' '.join(args)} exited {result.returncode}")
        return result.stdout

    def git(self, args: Sequence[str]) -> bytes:
        """Run a read-only Git command in the validated worktree."""
        return self._run_at(self.root, args)

    def head_sha(self) -> str:
        """Return the full current HEAD object ID."""
        return self.git(["rev-parse", "HEAD"]).decode("ascii").strip()

    def status_porcelain(self) -> bytes:
        """Return deterministic tracked and untracked worktree status bytes."""
        return self.git(
            ["status", "--porcelain=v1", "-z", "--untracked-files=all"]
        )

    def tracked_manifest(self) -> tuple[TrackedEntry, ...]:
        """Enumerate stage-zero tracked regular files and symlink entries."""
        raw = self.git(["ls-files", "--stage", "-z"])
        entries: list[TrackedEntry] = []
        for record in raw.split(b"\0"):
            if not record:
                continue
            try:
                metadata, raw_path = record.split(b"\t", 1)
                mode, object_id, stage = metadata.decode("ascii").split(" ")
            except (ValueError, UnicodeDecodeError) as error:
                raise CheckerError("git returned a malformed tracked-file manifest") from error
            if stage != "0":
                raise CheckerError(
                    f"tracked manifest contains unresolved index stage {stage}: "
                    f"{raw_path.decode('utf-8', errors='replace')}"
                )
            entries.append(
                TrackedEntry(
                    path=PurePosixPath(
                        raw_path.decode("utf-8", errors="surrogateescape")
                    ),
                    mode=mode,
                    object_id=object_id,
                )
            )
        entries.sort(key=lambda entry: entry.path.as_posix())
        if not entries:
            raise CheckerError(
                "tracked-file scan returned zero files; verify the repository root and Git index"
            )
        return tuple(entries)

    def snapshot_hash(self, manifest: Sequence[TrackedEntry]) -> str:
        """Hash tracked content, symlink text, modes, HEAD, status, and index identities."""
        digest = hashlib.sha256()
        digest.update(self.head_sha().encode("ascii"))
        digest.update(b"\0")
        digest.update(self.status_porcelain())
        for entry in manifest:
            digest.update(entry.mode.encode("ascii"))
            digest.update(b"\0")
            digest.update(entry.object_id.encode("ascii"))
            digest.update(b"\0")
            digest.update(entry.path.as_posix().encode("utf-8", errors="surrogateescape"))
            digest.update(b"\0")
            physical = self.root.joinpath(*entry.path.parts)
            if entry.is_symlink:
                digest.update(os.readlink(physical).encode("utf-8", errors="surrogateescape"))
            else:
                try:
                    digest.update(physical.read_bytes())
                except FileNotFoundError as error:
                    raise CheckerError(
                        f"tracked path disappeared during scan: {entry.path.as_posix()}"
                    ) from error
            digest.update(b"\0")
        return digest.hexdigest()


# ───────────────────────────────────────────────────────────────
# 3. POLICY AND EXTRACTION
# ───────────────────────────────────────────────────────────────


def _python_package_roots(
    manifest: Sequence[TrackedEntry],
) -> frozenset[PurePosixPath]:
    tracked = {entry.path for entry in manifest}
    roots: set[PurePosixPath] = set()
    for entry in manifest:
        if entry.path.suffix != ".py":
            continue
        parent = entry.path.parent
        while parent != PurePosixPath("."):
            # A directory is an import package only when it actually holds an __init__.py.
            # Treating every identifier-named ancestor of any .py file as a package exempts
            # whole non-Python trees (a lone script under .opencode/commands would exempt the
            # entire commands tree) and silently blocks their renames.
            if parent.name.isidentifier() and parent / "__init__.py" in tracked:
                roots.add(parent)
            parent = parent.parent
    return frozenset(roots)


def _policy_disposition(
    path: PurePosixPath,
    python_package_roots: frozenset[PurePosixPath],
) -> tuple[str, str] | None:
    parts = set(path.parts)
    if parts & VENDORED_ROOT_NAMES:
        return "exempt", "vendored or third-party tree"
    if parts & GENERATED_ROOT_NAMES or path.name.endswith(GENERATED_SUFFIXES):
        return "generated", "generated output tree or suffix"
    if parts & FROZEN_ROOT_NAMES:
        return "frozen", "append-only frozen surface"
    if parts & TEST_RUNNER_ROOT_NAMES:
        return "exempt", "test-runner magic path"
    if path.name in LOCKFILE_NAMES:
        return "generated", "lockfile output"
    if path.name in TOOL_MANDATED_NAMES:
        return "tool-mandated", "tool-mandated exact filename"
    if path.suffix == ".py":
        return "exempt", "Python source filename"
    if any(path == root or root in path.parents for root in python_package_roots):
        return "exempt", "Python import-package directory"
    return None


def _read_text_file(path: Path) -> tuple[bytes, str] | None:
    content = path.read_bytes()
    if b"\0" in content:
        return None
    try:
        return content, content.decode("utf-8")
    except UnicodeDecodeError:
        return None


def _is_migration_self_record(path: PurePosixPath) -> bool:
    # The migration program's own tree records every pre-migration name as inventory data
    # (baseline census, frozen rename map, mode manifests) and documents the renames in prose.
    # Those files cite the old names on purpose; treating them as reference-rewrite surfaces would
    # corrupt the frozen inputs the run depends on, so they are never rewritten. They are not
    # rename candidates themselves, so excluding them leaves the reference graph unchanged.
    if path.as_posix().startswith(MIGRATION_SELF_RECORD_PREFIX):
        return True
    # Review, scratch, and iteration artifacts are process work-products that quote paths as
    # historical data — a review transcript can cite hundreds of paths. Rewriting them corrupts
    # the record and cannot be uniquely regenerated. They record references, they do not consume them.
    return bool(set(path.parts) & RECORD_ARTIFACT_SEGMENTS)


def _scan_observations(
    repository: GitRepository,
    manifest: Sequence[TrackedEntry],
) -> tuple[
    list[ReferenceObservation],
    list[dict[str, str]],
    dict[PurePosixPath, bytes],
]:
    observations: list[ReferenceObservation] = []
    skipped: list[dict[str, str]] = []
    contents: dict[PurePosixPath, bytes] = {}
    python_roots = _python_package_roots(manifest)

    for entry in manifest:
        physical = repository.root.joinpath(*entry.path.parts)
        if _is_migration_self_record(entry.path):
            skipped.append(
                {
                    "path": entry.path.as_posix(),
                    "classification": "frozen",
                    "rationale": "migration self-record cites pre-migration names as data",
                }
            )
            continue
        if entry.is_symlink:
            raw_target = os.readlink(physical)
            target_bytes = raw_target.encode("utf-8", errors="surrogateescape")
            contents[entry.path] = target_bytes
            observations.append(
                ReferenceObservation(
                    file=entry.path,
                    reference_kind="symlink-target",
                    raw_value=raw_target,
                    line=1,
                    column=1,
                    span_start=0,
                    span_end=len(raw_target),
                )
            )
            continue

        policy = _policy_disposition(entry.path, python_roots)
        if policy is not None:
            skipped.append(
                {
                    "path": entry.path.as_posix(),
                    "classification": policy[0],
                    "rationale": policy[1],
                }
            )
            continue
        if entry.path.suffix.lower() not in SUPPORTED_TEXT_SUFFIXES:
            skipped.append(
                {
                    "path": entry.path.as_posix(),
                    "classification": "unsupported-reference-surface",
                    "rationale": "tracked for coverage but no path-reference adapter applies",
                }
            )
            continue
        decoded = _read_text_file(physical)
        if decoded is None:
            skipped.append(
                {
                    "path": entry.path.as_posix(),
                    "classification": "binary-or-non-utf8",
                    "rationale": "tracked for coverage but not decoded as executable text",
                }
            )
            continue
        content, text = decoded
        contents[entry.path] = content
        observations.extend(extract_references(entry.path, text))
    return observations, skipped, contents


# ───────────────────────────────────────────────────────────────
# 4. REFERENCE RESOLUTION
# ───────────────────────────────────────────────────────────────


def _canonical_root_variant(path: PurePosixPath) -> PurePosixPath | None:
    parts = list(path.parts)
    changed = False
    for index, part in enumerate(parts):
        canonical = canonical_root(part)
        if canonical is not None and canonical != part:
            parts[index] = canonical
            changed = True
    return PurePosixPath(*parts) if changed else None


def _clean_reference(raw_value: str) -> str | None:
    value = raw_value.strip().strip("'\"")
    if not value or value.startswith("#"):
        return None
    parsed = urlsplit(value)
    if parsed.scheme.lower() in URL_SCHEMES or value.startswith("//"):
        return None
    path = unquote(parsed.path).replace("\\", "/")
    if not path:
        return None
    return path


def _normalized_candidate(base: PurePosixPath, raw_path: str) -> PurePosixPath | None:
    if raw_path.startswith("/"):
        combined = raw_path.lstrip("/")
    else:
        combined = posixpath.join(base.as_posix(), raw_path)
    normalized = posixpath.normpath(combined)
    if normalized in {"", ".", ".."} or normalized.startswith("../"):
        return None
    return PurePosixPath(normalized)


def _reference_candidates(
    observation: ReferenceObservation,
) -> tuple[PurePosixPath, ...]:
    cleaned = _clean_reference(observation.raw_value)
    if cleaned is None:
        return ()
    if observation.reference_kind == "js-module" and not cleaned.startswith((".", "/")):
        return ()

    bases = [observation.file.parent]
    if observation.reference_kind in {"config-path", "registry-path"}:
        bases.append(PurePosixPath("."))
    candidates: list[PurePosixPath] = []
    for base in bases:
        candidate = _normalized_candidate(base, cleaned)
        if candidate is None:
            continue
        candidates.append(candidate)
        if observation.reference_kind == "js-module" and not PurePosixPath(cleaned).suffix:
            candidates.extend(
                PurePosixPath(f"{candidate.as_posix()}{suffix}")
                for suffix in MODULE_SUFFIXES
            )
            candidates.extend(candidate / f"index{suffix}" for suffix in MODULE_SUFFIXES)
        variant = _canonical_root_variant(candidate)
        if variant is not None:
            candidates.append(variant)
    return tuple(dict.fromkeys(candidates))


def _path_index(
    semantic_map: SemanticMap,
) -> dict[PurePosixPath, list[tuple[MapEntry, str]]]:
    index: dict[PurePosixPath, list[tuple[MapEntry, str]]] = defaultdict(list)
    for entry in semantic_map.entries:
        index[entry.source].append((entry, "source"))
        index[entry.target].append((entry, "target"))
    return index


def _validate_repository_map_state(
    semantic_map: SemanticMap,
    tracked_paths: frozenset[PurePosixPath],
    state: str,
) -> tuple[list[str], dict[str, str]]:
    errors: list[str] = []
    statuses: dict[str, str] = {}
    # Git tracks files, not directories, so a directory rename's source/target is never a
    # member of tracked_paths. A directory is present when a tracked file lives under it;
    # without this, every directory rename falsely fails the state check.
    tracked_dirs = {ancestor for path in tracked_paths for ancestor in path.parents}

    def _path_present(path: PurePosixPath) -> bool:
        return path in tracked_paths or path in tracked_dirs

    for entry in semantic_map.rename_entries:
        source_exists = _path_present(entry.source)
        target_exists = _path_present(entry.target)
        if state == "pre" and (not source_exists or target_exists):
            statuses[entry.map_id] = "unresolved"
            errors.append(
                f"map {entry.map_id}: pre state requires source present and target absent "
                f"({entry.source.as_posix()} -> {entry.target.as_posix()})"
            )
        elif state == "post" and (source_exists or not target_exists):
            statuses[entry.map_id] = "stale"
            errors.append(
                f"map {entry.map_id}: post state requires source absent and target present "
                f"({entry.source.as_posix()} -> {entry.target.as_posix()})"
            )
        elif state == "auto" and source_exists == target_exists:
            statuses[entry.map_id] = "ambiguous" if source_exists else "unresolved"
            errors.append(
                f"map {entry.map_id}: auto state requires exactly one of source or target"
            )
    return errors, statuses


def _validate_policy_classifications(
    semantic_map: SemanticMap,
    manifest: Sequence[TrackedEntry],
) -> list[str]:
    python_roots = _python_package_roots(manifest)
    errors = []
    for entry in semantic_map.entries:
        policy = _policy_disposition(entry.source, python_roots)
        if entry.classification == "rename" and policy is not None:
            errors.append(
                f"map {entry.map_id}: rename conflicts with {policy[0]} policy for "
                f"{entry.source.as_posix()} ({policy[1]})"
            )
        # A non-rename classification without an independent policy match is trusted: the map is
        # the reviewed source of truth and declining to rename is the safe direction. The
        # dangerous inverse (a rename the policy says is exempt) is still rejected above, and the
        # whole-repo no-new-snake guard confirms nothing in-scope was left behind.
        if (
            entry.classification != "rename"
            and policy is not None
            and entry.classification != policy[0]
        ):
            errors.append(
                f"map {entry.map_id}: classification {entry.classification!r} conflicts "
                f"with policy class {policy[0]!r} for {entry.source.as_posix()}"
            )
    return errors


def _validate_target_occupancy(
    semantic_map: SemanticMap,
    tracked_paths: frozenset[PurePosixPath],
    state: str,
) -> list[str]:
    if state == "post":
        return []
    sources = {entry.source for entry in semantic_map.rename_entries}
    errors = []
    for entry in semantic_map.rename_entries:
        if entry.target in tracked_paths and entry.target not in sources:
            errors.append(
                f"map {entry.map_id}: exact target collision with tracked path "
                f"{entry.target.as_posix()}"
            )
    return errors


def _resolve_static_sites(
    observations: Sequence[ReferenceObservation],
    semantic_map: SemanticMap,
    tracked_paths: frozenset[PurePosixPath],
    contents: Mapping[PurePosixPath, bytes],
    state: str,
) -> tuple[dict[str, list[dict[str, Any]]], list[str], dict[str, str], set[tuple[str, str]]]:
    map_index = _path_index(semantic_map)
    sites: dict[str, list[dict[str, Any]]] = defaultdict(list)
    errors: list[str] = []
    map_statuses: dict[str, str] = {}
    graph_edges: set[tuple[str, str]] = set()
    owner_index: dict[PurePosixPath, str] = {}
    for entry in semantic_map.rename_entries:
        owner_index[entry.source] = entry.map_id
        owner_index[entry.target] = entry.map_id

    for observation in observations:
        if observation.dynamic:
            continue
        candidates = _reference_candidates(observation)
        matches: list[tuple[MapEntry, str, PurePosixPath]] = []
        for candidate in candidates:
            matches.extend(
                (entry, side, candidate) for entry, side in map_index.get(candidate, [])
            )
        unique_matches = {
            (entry.map_id, side, candidate.as_posix()): (entry, side, candidate)
            for entry, side, candidate in matches
        }
        if not unique_matches:
            continue
        map_ids = {key[0] for key in unique_matches}
        rename_map_ids = {
            entry.map_id
            for entry, _side, _candidate in unique_matches.values()
            if entry.classification == "rename"
        }
        physical_candidates = {candidate for candidate in candidates if candidate in tracked_paths}
        # Ambiguity only matters when more than one rename target is in play. A reference that
        # resolves to exempt/tool-mandated names is never rewritten, so its ambiguity is harmless.
        if len(rename_map_ids) > 1 or (
            observation.reference_kind == "js-module" and len(physical_candidates) > 1
        ):
            affected = ", ".join(sorted(map_ids))
            errors.append(
                f"{observation.site_key}: ambiguous mapped reference across {affected}"
            )
            for map_id in map_ids:
                map_statuses[map_id] = "ambiguous"
            continue

        entry, side, resolved_path = next(iter(unique_matches.values()))
        if state == "post" and side == "source":
            map_statuses[entry.map_id] = "stale"
            errors.append(
                f"{observation.site_key}: stale source reference {observation.raw_value!r}"
            )
        preimage = contents.get(observation.file)
        if preimage is None:
            errors.append(f"{observation.site_key}: missing preimage content")
            map_statuses[entry.map_id] = "unresolved"
            continue
        site = {
            "site_id": observation.site_id,
            "site_key": observation.site_key,
            "file": observation.file.as_posix(),
            "line": observation.line,
            "column": observation.column,
            "span_start": observation.span_start,
            "span_end": observation.span_end,
            "reference_kind": observation.reference_kind,
            "raw_value": observation.raw_value,
            "resolved_path": resolved_path.as_posix(),
            "matched_side": side,
            "preimage_blob_hash": git_blob_hash(preimage),
            "cas_rule": "regenerate-on-preimage-drift",
        }
        sites[entry.map_id].append(site)
        owner = owner_index.get(observation.file)
        if owner is not None and owner != entry.map_id:
            graph_edges.add((owner, entry.map_id))
    for map_sites in sites.values():
        map_sites.sort(key=lambda site: (site["file"], site["span_start"], site["site_id"]))
    return sites, errors, map_statuses, graph_edges


# ───────────────────────────────────────────────────────────────
# 5. DYNAMIC DISPOSITIONS AND SCCS
# ───────────────────────────────────────────────────────────────


def load_dynamic_dispositions(path: Path | None) -> dict[str, dict[str, Any]]:
    """Load optional externally reviewed dynamic-site dispositions."""
    if path is None:
        return {}
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as error:
        raise CheckerError(f"dynamic disposition file not found: {path}") from error
    except json.JSONDecodeError as error:
        raise CheckerError(
            f"dynamic disposition JSON is invalid at line {error.lineno}: {error.msg}"
        ) from error
    if not isinstance(payload, dict):
        raise CheckerError("dynamic disposition file must be an object keyed by site ID or site key")
    normalized: dict[str, dict[str, Any]] = {}
    for key, value in payload.items():
        if not isinstance(key, str) or not isinstance(value, dict):
            raise CheckerError("each dynamic disposition must be an object under a string key")
        normalized[key] = value
    return normalized


def _dynamic_rows(
    observations: Sequence[ReferenceObservation],
    dispositions: Mapping[str, Mapping[str, Any]],
) -> tuple[list[dict[str, Any]], list[str]]:
    rows: list[dict[str, Any]] = []
    errors: list[str] = []
    for observation in observations:
        if not observation.dynamic:
            continue
        supplied = dispositions.get(observation.site_id) or dispositions.get(
            observation.site_key
        )
        disposition = observation.automatic_disposition
        rationale = (
            "literal glob pattern is bounded without executing the glob"
            if disposition == "bounded-static-pattern"
            else ""
        )
        evidence: list[str] = [observation.expression] if disposition else []
        if supplied is not None:
            disposition = supplied.get("disposition")
            rationale = supplied.get("rationale", "")
            raw_evidence = supplied.get("evidence", [])
            if isinstance(raw_evidence, list) and all(
                isinstance(item, str) and item for item in raw_evidence
            ):
                evidence = list(raw_evidence)
            else:
                evidence = []
        status = "dispositioned"
        if disposition not in DYNAMIC_DISPOSITIONS or not rationale or not evidence:
            status = "pending"
            errors.append(
                f"{observation.site_key}: dynamic site lacks a valid disposition, rationale, and evidence"
            )
        rows.append(
            {
                "row_type": "dynamic-site",
                "site_id": observation.site_id,
                "site_key": observation.site_key,
                "file": observation.file.as_posix(),
                "line": observation.line,
                "column": observation.column,
                "reference_kind": observation.reference_kind,
                "expression": observation.expression,
                "disposition": disposition or "undispositioned",
                "rationale": rationale,
                "status": status,
                "evidence": evidence,
            }
        )
    rows.sort(key=lambda row: (row["file"], row["line"], row["column"], row["site_id"]))
    return rows, errors


def _strongly_connected_components(
    nodes: Iterable[str], edges: Iterable[tuple[str, str]]
) -> list[tuple[str, ...]]:
    adjacency: dict[str, set[str]] = {node: set() for node in nodes}
    for source, target in edges:
        if source in adjacency and target in adjacency:
            adjacency[source].add(target)
    index = 0
    indices: dict[str, int] = {}
    lowlinks: dict[str, int] = {}
    stack: list[str] = []
    on_stack: set[str] = set()
    components: list[tuple[str, ...]] = []

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
        component = []
        while stack:
            member = stack.pop()
            on_stack.remove(member)
            component.append(member)
            if member == node:
                break
        components.append(tuple(sorted(component)))

    for node in sorted(adjacency):
        if node not in indices:
            visit(node)
    components.sort()
    return components


def _reference_graph(
    semantic_map: SemanticMap,
    observed_edges: set[tuple[str, str]],
) -> tuple[dict[str, Any], list[str]]:
    rename_entries = semantic_map.rename_entries
    nodes = {entry.map_id for entry in rename_entries}
    edges = set(observed_edges)
    for entry in rename_entries:
        edges.update(
            (entry.map_id, dependency)
            for dependency in entry.dependencies
            if dependency in nodes
        )
    components = _strongly_connected_components(nodes, edges)
    declared: dict[str, set[str]] = defaultdict(set)
    for entry in rename_entries:
        declared[entry.closure_id].add(entry.map_id)
    declared_sets = {frozenset(members) for members in declared.values()}
    component_sets = {frozenset(component) for component in components}
    errors = []
    if declared_sets != component_sets:
        errors.append(
            "declared closure batches do not exactly match reference-graph strongly connected components"
        )
    batches = []
    by_id = semantic_map.by_id
    for component in components:
        ordered = sorted(component, key=lambda map_id: by_id[map_id].order)
        extensions = sorted(
            {
                by_id[map_id].source.suffix or "<directory>"
                for map_id in component
            }
        )
        batches.append(
            {
                "batch_id": f"scc-{sha256_json(ordered)[:16]}",
                "map_ids": ordered,
                "closure_id": by_id[ordered[0]].closure_id,
                "extensions": extensions,
                "batch_rule": "reference-graph-scc",
            }
        )
    return {
        "nodes": sorted(nodes),
        "edges": [list(edge) for edge in sorted(edges)],
        "scc_batches": batches,
    }, errors


# ───────────────────────────────────────────────────────────────
# 6. LEDGER ASSEMBLY
# ───────────────────────────────────────────────────────────────


def _map_rows(
    semantic_map: SemanticMap,
    sites: Mapping[str, list[dict[str, Any]]],
    map_statuses: Mapping[str, str],
) -> list[dict[str, Any]]:
    rows = []
    for entry in semantic_map.entries:
        reference_sites = list(sites.get(entry.map_id, []))
        if entry.classification != "rename":
            decision = entry.classification
            status = "preserved"
        elif entry.map_id in map_statuses:
            decision = "blocked"
            status = map_statuses[entry.map_id]
        elif any(site["matched_side"] == "source" for site in reference_sites):
            decision = "rewrite-required"
            status = "rewrite-required"
        elif reference_sites:
            decision = "already-resolved"
            status = "already-resolved"
        else:
            decision = "rename"
            status = "ready"
        rows.append(
            {
                "row_type": "map-entry",
                "map_id": entry.map_id,
                "source": entry.source.as_posix(),
                "target": entry.target.as_posix(),
                "classification": entry.classification,
                "closure_id": entry.closure_id,
                "order": entry.order,
                "decision": decision,
                "rationale": entry.rationale,
                "status": status,
                "evidence": [
                    f"reference_sites={len(reference_sites)}",
                    f"closure_id={entry.closure_id}",
                ],
                "reference_sites": reference_sites,
            }
        )
    return rows


def build_reference_ledger(
    repository_root: Path,
    semantic_map: SemanticMap,
    *,
    expected_base: str,
    state: str,
    dispositions: Mapping[str, Mapping[str, Any]] | None = None,
) -> dict[str, Any]:
    """Scan a repository and return a complete, CAS-ready reference ledger.

    Args:
        repository_root: Exact Git worktree root to scan.
        semantic_map: Validated explicit source-to-target map.
        expected_base: Immutable BASE identity selected by the caller.
        state: Expected filesystem state: pre, post, or auto.
        dispositions: Optional reviewed decisions for dynamic sites.

    Returns:
        JSON-serializable ledger with plan identity, scan denominator, and rows.

    Raises:
        CheckerError: If the repository identity or scan safety contract fails.
    """
    if state not in SCAN_STATES:
        raise CheckerError(f"state must be one of: {', '.join(sorted(SCAN_STATES))}")
    if expected_base != semantic_map.base_sha:
        raise CheckerError(
            f"BASE mismatch: expected {expected_base}, map pins {semantic_map.base_sha}"
        )
    repository = GitRepository(repository_root)
    head_sha = repository.head_sha()
    if head_sha != semantic_map.base_sha:
        raise CheckerError(
            f"stale plan: HEAD {head_sha} does not equal pinned BASE {semantic_map.base_sha}"
        )
    status_before = repository.status_porcelain()
    if status_before:
        detail = status_before.decode("utf-8", errors="replace").replace("\0", " ").strip()
        raise CheckerError(f"dirty tree blocks immutable plan generation: {detail}")

    manifest = repository.tracked_manifest()
    snapshot_before = repository.snapshot_hash(manifest)
    tracked_paths = frozenset(entry.path for entry in manifest)
    errors, map_statuses = _validate_repository_map_state(
        semantic_map, tracked_paths, state
    )
    errors.extend(_validate_policy_classifications(semantic_map, manifest))
    errors.extend(_validate_target_occupancy(semantic_map, tracked_paths, state))

    observations, skipped_files, contents = _scan_observations(repository, manifest)
    sites, site_errors, site_statuses, observed_edges = _resolve_static_sites(
        observations,
        semantic_map,
        tracked_paths,
        contents,
        state,
    )
    errors.extend(site_errors)
    map_statuses.update(site_statuses)
    dynamic_rows, dynamic_errors = _dynamic_rows(
        observations, dispositions or {}
    )
    errors.extend(dynamic_errors)
    graph, graph_errors = _reference_graph(semantic_map, observed_edges)
    errors.extend(graph_errors)

    map_rows = _map_rows(semantic_map, sites, map_statuses)
    rows = [*map_rows, *dynamic_rows]
    blocking_rows = [row for row in rows if row["status"] in BLOCKING_STATUSES]

    snapshot_after = repository.snapshot_hash(manifest)
    if snapshot_after != snapshot_before or repository.status_porcelain() != status_before:
        raise CheckerError("repository content, modes, HEAD, or index changed during read-only scan")

    regular_count = sum(not entry.is_symlink for entry in manifest)
    symlink_count = sum(entry.is_symlink for entry in manifest)
    operation_identity = [entry.operation_identity() for entry in semantic_map.entries]
    ledger = {
        "schema_version": LEDGER_SCHEMA_VERSION,
        "accepted": not errors and not blocking_rows,
        "plan_identity": {
            "semantic_map_id": semantic_map.semantic_map_id,
            "base_sha": semantic_map.base_sha,
            "map_hash": semantic_map.map_hash,
            "operation_set_hash": operation_set_hash(semantic_map),
            "head_sha": head_sha,
            "clean_tree": True,
            "ordered_operations": operation_identity,
            "pre_write_revalidation": [
                "head-equals-base",
                "map-hash-equals-plan",
                "clean-tree",
                "source-target-set-and-order-equals-plan",
            ],
        },
        "scan": {
            "tracked_file_count": len(manifest),
            "regular_file_count": regular_count,
            "symlink_count": symlink_count,
            "scanned_reference_file_count": len(contents),
            "observation_count": len(observations),
            "snapshot_hash": snapshot_before,
            "manifest": [
                {
                    "path": entry.path.as_posix(),
                    "mode": entry.mode,
                    "object_id": entry.object_id,
                }
                for entry in manifest
            ],
            "skipped_files": skipped_files,
        },
        "reference_graph": graph,
        "rows": rows,
        "errors": sorted(set(errors)),
    }
    ledger["ledger_hash"] = sha256_json(ledger)
    return ledger


def validate_ledger(ledger: Mapping[str, Any], semantic_map: SemanticMap) -> None:
    """Validate row completeness and terminal status before consumer handoff."""
    if ledger.get("schema_version") != LEDGER_SCHEMA_VERSION:
        raise CheckerError("ledger schema_version is unsupported")
    rows = ledger.get("rows")
    if not isinstance(rows, list):
        raise CheckerError("ledger rows must be an array")
    map_rows = [row for row in rows if row.get("row_type") == "map-entry"]
    dynamic_rows = [row for row in rows if row.get("row_type") == "dynamic-site"]
    expected_map_ids = [entry.map_id for entry in semantic_map.entries]
    actual_map_ids = [row.get("map_id") for row in map_rows]
    if actual_map_ids != expected_map_ids:
        raise CheckerError("ledger map-entry rows do not exactly match semantic map order")
    dynamic_ids = [row.get("site_id") for row in dynamic_rows]
    if len(dynamic_ids) != len(set(dynamic_ids)):
        raise CheckerError("ledger contains duplicate dynamic site IDs")
    for row in rows:
        if not row.get("rationale") or not row.get("evidence"):
            raise CheckerError("every ledger row requires rationale and evidence")
        if row.get("status") in BLOCKING_STATUSES:
            raise CheckerError(
                f"ledger row is not terminal: {row.get('map_id') or row.get('site_id')}"
            )
    if ledger.get("errors"):
        raise CheckerError("ledger contains blocking scan errors")
    if ledger.get("accepted") is not True:
        raise CheckerError("ledger did not reach accepted terminal state")


__all__ = [
    "GitRepository",
    "SCAN_STATES",
    "build_reference_ledger",
    "load_dynamic_dispositions",
    "validate_ledger",
]
