#!/usr/bin/env python3
# ---------------------------------------------------------------------------
# COMPONENT: No-New-Snake-Case Filesystem Name Guard
# ---------------------------------------------------------------------------
"""Reject non-exempt snake_case filesystem names.

Usage:
  check_no_new_snake_case.py --changed-since <git-ref>
  check_no_new_snake_case.py --all

Changed-only mode compares a ref with the complete working tree, including
untracked files, and reports only names that did not exist at the ref. Whole-tree
mode reports every current in-scope name. Both modes print offenders in stable
repository-relative order and return 1 when any offender is found.
"""

import argparse
import os
import re
import subprocess
import sys
from pathlib import Path, PurePosixPath
from typing import Iterable, Sequence

sys.path.insert(0, str(Path(__file__).resolve().parent))
from naming_root_resolver import canonical_root  # type: ignore  # noqa: E402


SNAKE_CASE = re.compile(r"[A-Za-z0-9]+_[A-Za-z0-9_]*[A-Za-z0-9]")

VENDORED_ROOT_NAMES = frozenset(
    {
        ".venv",
        "node_modules",
        "site-packages",
        "third-party",
        "third_party",
        "vendor",
        "vendored",
        "venv",
    }
)
GENERATED_ROOT_NAMES = frozenset(
    {
        ".cache",
        ".mypy_cache",
        ".next",
        ".nuxt",
        ".pytest_cache",
        ".ruff_cache",
        "__generated__",
        "__pycache__",
        "build",
        "coverage",
        "dist",
        "generated",
        "out",
        "target",
    }
)
TEST_RUNNER_ROOT_NAMES = frozenset({"__mocks__", "__snapshots__"})
FROZEN_ROOT_NAMES = frozenset({"changelog", "changelogs", "z_archive"})
REPOSITORY_METADATA_ROOT_NAMES = frozenset({".git"})

TOOL_MANDATED_NAMES = frozenset(
    {
        ".utcp_config.json",
        "README.md",
        "SKILL.md",
        "action.yaml",
        "action.yml",
        "conftest.py",
    }
)
LOCKFILE_NAMES = frozenset(
    {
        "Cargo.lock",
        "Gemfile.lock",
        "Pipfile.lock",
        "bun.lock",
        "bun.lockb",
        "composer.lock",
        "package-lock.json",
        "pnpm-lock.yaml",
        "poetry.lock",
        "uv.lock",
        "yarn.lock",
    }
)
GENERATED_SUFFIXES = (".tsbuildinfo",)
CODEX_GENERATED_ROOTS = (
    PurePosixPath(".codex/agents"),
    PurePosixPath(".codex/prompts"),
)


class GuardError(RuntimeError):
    """The repository or git state could not be inspected safely."""


def _git(repo_root: Path, args: Sequence[str]) -> bytes:
    """Run a read-only git command and return its raw stdout."""
    command = ["git", "-C", str(repo_root), *args]
    result = subprocess.run(command, check=False, capture_output=True)
    if result.returncode != 0:
        detail = result.stderr.decode("utf-8", errors="replace").strip()
        raise GuardError(detail or f"git exited {result.returncode}: {' '.join(command)}")
    return result.stdout


def repository_root() -> Path:
    """Return the current repository root."""
    result = subprocess.run(
        ["git", "rev-parse", "--show-toplevel"],
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        detail = result.stderr.strip()
        raise GuardError(detail or "current directory is not inside a git repository")
    return Path(result.stdout.strip()).resolve()


def _decode_path(raw: bytes) -> PurePosixPath:
    return PurePosixPath(raw.decode("utf-8", errors="surrogateescape"))


def _all_ref_paths(repo_root: Path, ref: str) -> set[PurePosixPath]:
    """Return every file and implied directory path present at ``ref``."""
    raw_paths = _git(repo_root, ["ls-tree", "-r", "-z", "--name-only", ref])
    paths: set[PurePosixPath] = set()
    for raw in raw_paths.split(b"\0"):
        if not raw:
            continue
        file_path = _decode_path(raw)
        paths.add(file_path)
        paths.update(tuple(file_path.parents)[:-1])
    return paths


def _changed_destinations(repo_root: Path, ref: str) -> set[PurePosixPath]:
    """Return added, copied, renamed, and untracked destinations since ``ref``."""
    raw = _git(
        repo_root,
        [
            "diff",
            "--name-status",
            "-z",
            "--find-renames",
            "--find-copies",
            "--diff-filter=ACR",
            ref,
            "--",
        ],
    )
    fields = raw.split(b"\0")
    changed: set[PurePosixPath] = set()
    index = 0
    while index < len(fields) and fields[index]:
        status = fields[index].decode("ascii", errors="replace")
        index += 1
        if status.startswith(("R", "C")):
            if index + 1 >= len(fields):
                raise GuardError("git returned a truncated rename/copy record")
            index += 1
            changed.add(_decode_path(fields[index]))
            index += 1
            continue
        if index >= len(fields):
            raise GuardError("git returned a truncated changed-path record")
        changed.add(_decode_path(fields[index]))
        index += 1

    untracked = _git(repo_root, ["ls-files", "--others", "--exclude-standard", "-z"])
    changed.update(_decode_path(raw_path) for raw_path in untracked.split(b"\0") if raw_path)
    return changed


def _completed_spec_roots(paths: Iterable[PurePosixPath]) -> set[PurePosixPath]:
    """Derive completed spec roots from their completion artifact."""
    marker = "implementation-summary.md"
    return {path.parent for path in paths if path.name == marker and _under_specs(path)}


def _under_specs(path: PurePosixPath) -> bool:
    parts = path.parts
    return len(parts) >= 2 and parts[0] == ".opencode" and parts[1] == "specs"


def _is_within(path: PurePosixPath, root: PurePosixPath) -> bool:
    return path == root or root in path.parents


def _is_tree_exempt(
    path: PurePosixPath,
    completed_spec_roots: set[PurePosixPath],
) -> bool:
    """Return whether a path belongs to an entirely exempt subtree."""
    if any(_is_within(path, root) for root in CODEX_GENERATED_ROOTS):
        return True
    if any(_is_within(path, root) for root in completed_spec_roots):
        return True

    parts = set(path.parts)
    return bool(
        parts
        & (
            VENDORED_ROOT_NAMES
            | GENERATED_ROOT_NAMES
            | TEST_RUNNER_ROOT_NAMES
            | FROZEN_ROOT_NAMES
            | REPOSITORY_METADATA_ROOT_NAMES
        )
    )


def _name_stem(name: str) -> str:
    """Return the authored portion before the first extension."""
    visible_name = name[1:] if name.startswith(".") else name
    return visible_name.split(".", 1)[0]


def _uses_snake_case(name: str) -> bool:
    """Return whether a filesystem name uses underscore-separated words."""
    resolved_root = canonical_root(name)
    if resolved_root is not None:
        return name != resolved_root
    return bool(SNAKE_CASE.search(_name_stem(name)))


def _is_python_package_dir(repo_root: Path, path: PurePosixPath) -> bool:
    """Recognize regular and namespace-style Python package directories."""
    physical_path = repo_root.joinpath(*path.parts)
    if not physical_path.is_dir() or not path.name.isidentifier():
        return False
    try:
        children = tuple(physical_path.iterdir())
    except OSError:
        return False
    return any(child.name in {"__init__.py", "py.typed"} for child in children) or any(
        child.is_file() and child.suffix == ".py" for child in children
    )


def _is_name_exempt(repo_root: Path, path: PurePosixPath, is_dir: bool) -> bool:
    """Return whether the path's own basename has an exact-name exemption."""
    name = path.name
    if name in TOOL_MANDATED_NAMES or name in LOCKFILE_NAMES:
        return True
    if name.endswith(GENERATED_SUFFIXES):
        return True
    if not is_dir and name.endswith(".py"):
        return True
    if is_dir and _is_python_package_dir(repo_root, path):
        return True
    return False


def _candidate_prefixes(path: PurePosixPath) -> Iterable[PurePosixPath]:
    parts: list[str] = []
    for part in path.parts:
        parts.append(part)
        yield PurePosixPath(*parts)


def changed_since_offenders(repo_root: Path, ref: str) -> list[PurePosixPath]:
    """Find newly introduced in-scope snake_case names since ``ref``."""
    base_paths = _all_ref_paths(repo_root, ref)
    completed_at_base = _completed_spec_roots(base_paths)
    offenders: set[PurePosixPath] = set()

    for changed_path in _changed_destinations(repo_root, ref):
        for candidate in _candidate_prefixes(changed_path):
            if candidate in base_paths or _is_tree_exempt(candidate, completed_at_base):
                continue
            physical_path = repo_root.joinpath(*candidate.parts)
            is_dir = candidate != changed_path or physical_path.is_dir()
            if _uses_snake_case(candidate.name) and not _is_name_exempt(
                repo_root, candidate, is_dir
            ):
                offenders.add(candidate)

    return sorted(offenders, key=lambda path: path.as_posix())


def _current_completed_spec_roots(repo_root: Path) -> set[PurePosixPath]:
    specs_root = repo_root / ".opencode" / "specs"
    if not specs_root.is_dir():
        return set()
    roots = set()
    for marker in specs_root.rglob("implementation-summary.md"):
        roots.add(PurePosixPath(marker.parent.relative_to(repo_root).as_posix()))
    return roots


def all_offenders(repo_root: Path) -> list[PurePosixPath]:
    """Find every current in-scope snake_case name in the repository tree."""
    completed_spec_roots = _current_completed_spec_roots(repo_root)
    offenders: set[PurePosixPath] = set()

    for current_root, dir_names, file_names in os.walk(repo_root, topdown=True):
        current = Path(current_root)
        relative_current = current.relative_to(repo_root)
        current_path = PurePosixPath(relative_current.as_posix())
        if current_path != PurePosixPath(".") and _is_tree_exempt(
            current_path, completed_spec_roots
        ):
            dir_names[:] = []
            continue

        retained_dirs = []
        for name in sorted(dir_names):
            path = current_path / name if current_path != PurePosixPath(".") else PurePosixPath(name)
            if _is_tree_exempt(path, completed_spec_roots):
                continue
            retained_dirs.append(name)
            if _uses_snake_case(name) and not _is_name_exempt(repo_root, path, True):
                offenders.add(path)
        dir_names[:] = retained_dirs

        for name in sorted(file_names):
            path = current_path / name if current_path != PurePosixPath(".") else PurePosixPath(name)
            if _is_tree_exempt(path, completed_spec_roots):
                continue
            if _uses_snake_case(name) and not _is_name_exempt(repo_root, path, False):
                offenders.add(path)

    return sorted(offenders, key=lambda path: path.as_posix())


def _print_result(offenders: Sequence[PurePosixPath], scope: str) -> int:
    if not offenders:
        print(f"PASS: no {scope} in-scope snake_case filesystem names found.")
        return 0

    print(f"FAIL: {len(offenders)} {scope} in-scope snake_case filesystem name(s) found:")
    for offender in offenders:
        print(f"  - {offender.as_posix()}")
    return 1


def parse_args(argv: Sequence[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--changed-since", metavar="REF")
    mode.add_argument("--all", action="store_true", dest="scan_all")
    return parser.parse_args(argv)


def main(argv: Sequence[str]) -> int:
    args = parse_args(argv)
    try:
        repo_root = repository_root()
        if args.scan_all:
            return _print_result(all_offenders(repo_root), "current")
        offenders = changed_since_offenders(repo_root, args.changed_since)
        return _print_result(offenders, f"newly introduced since {args.changed_since}")
    except GuardError as error:
        print(f"ERROR: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
