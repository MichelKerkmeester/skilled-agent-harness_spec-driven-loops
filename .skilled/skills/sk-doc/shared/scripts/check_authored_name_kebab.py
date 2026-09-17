#!/usr/bin/env python3
# ---------------------------------------------------------------------------
# COMPONENT: Authored Artifact Name Guard
# ---------------------------------------------------------------------------
"""Validate one authored artifact basename or slug as kebab-case.

Usage:
  check_authored_name_kebab.py <artifact-path-or-slug>
  check_authored_name_kebab.py --directory <artifact-path-or-slug>

The authored stem must match ``^[a-z0-9]+(?:-[a-z0-9]+)*$``. Repository-wide
filesystem exemptions are delegated to ``check_no_new_snake_case.py`` so both
guards apply the same boundary.
"""

import argparse
import re
import sys
from pathlib import Path, PurePosixPath
from typing import Sequence

sys.path.insert(0, str(Path(__file__).resolve().parent))
from check_no_new_snake_case import (  # type: ignore  # noqa: E402
    GuardError,
    _current_completed_spec_roots,
    _is_name_exempt,
    _is_tree_exempt,
    _name_stem,
    repository_root,
)


KEBAB_CASE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def _repository_relative_path(repo_root: Path, artifact: Path) -> PurePosixPath:
    """Return a repository-relative path when possible, otherwise the supplied path."""
    candidate = artifact if artifact.is_absolute() else Path.cwd() / artifact
    try:
        relative = candidate.resolve(strict=False).relative_to(repo_root)
    except ValueError:
        return PurePosixPath(artifact.as_posix())
    return PurePosixPath(relative.as_posix())


def validate_authored_name(repo_root: Path, artifact: Path, is_dir: bool) -> tuple[bool, bool]:
    """Return ``(valid, exempt)`` for one authored artifact path or slug."""
    relative_path = _repository_relative_path(repo_root, artifact)
    completed_spec_roots = _current_completed_spec_roots(repo_root)
    if _is_tree_exempt(relative_path, completed_spec_roots):
        return True, True
    if _is_name_exempt(repo_root, relative_path, is_dir):
        return True, True
    return bool(KEBAB_CASE.fullmatch(_name_stem(relative_path.name))), False


def parse_args(argv: Sequence[str]) -> argparse.Namespace:
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("artifact", help="Artifact path, filename, or slug to validate")
    parser.add_argument(
        "--directory",
        action="store_true",
        help="Treat a not-yet-created artifact as a directory",
    )
    return parser.parse_args(argv)


def main(argv: Sequence[str]) -> int:
    """Validate one artifact name and print a stable pass/fail signal."""
    args = parse_args(argv)
    artifact = Path(args.artifact)
    try:
        repo_root = repository_root()
        valid, exempt = validate_authored_name(
            repo_root,
            artifact,
            args.directory or artifact.is_dir(),
        )
    except GuardError as error:
        print(f"ERROR: {error}", file=sys.stderr)
        return 2

    if exempt:
        print(f"PASS: authored artifact name is exempt: {args.artifact}")
        return 0
    if valid:
        print(f"PASS: authored artifact name is kebab-case: {args.artifact}")
        return 0

    print(
        "FAIL: authored artifact name must match "
        f"{KEBAB_CASE.pattern}: {args.artifact}"
    )
    return 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
