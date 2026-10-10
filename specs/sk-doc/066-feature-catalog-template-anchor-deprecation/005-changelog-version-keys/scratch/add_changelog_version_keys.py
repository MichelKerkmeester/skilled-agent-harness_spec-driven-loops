#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: CHANGELOG VERSION KEY INSERTER
# ───────────────────────────────────────────────────────────────

"""Insert a version key into changelog frontmatter derived from the file name.

Changelog files are named v<major>.<minor>.<patch>.<build>.md. For every file
matched by changelog/**/v*.md under a skill folder, the frontmatter gains a
`version: <major>.<minor>.<patch>.<build>` line directly above its closing
delimiter, unless a version key already exists. Files without frontmatter are
listed and left untouched. Everything else in a file, line endings included,
is preserved byte for byte.

Usage: python3 add_changelog_version_keys.py <skill-folder> [<skill-folder> ...]
Output:
    changed: <path>                  one line per modified file
    skipped (no frontmatter): <path> one line per file without frontmatter
    changed=<n> already_had=<n> no_frontmatter=<n>
"""

from __future__ import annotations

import re
import sys
from pathlib import Path
from typing import Iterable, List, Optional, Tuple

CHANGELOG_GLOB = "changelog/**/v*.md"
FRONTMATTER_DELIMITER = "---"
VERSION_KEY_PREFIX = "version:"
VERSION_NAME_PATTERN = re.compile(r"^v(\d+)\.(\d+)\.(\d+)\.(\d+)\.md$")
USAGE = "usage: add_changelog_version_keys.py <skill-folder> [<skill-folder> ...]"


def version_from_name(file_name: str) -> Optional[str]:
    """Return the dotted version encoded in a changelog file name.

    Args:
        file_name: Base name of the changelog file.

    Returns:
        The version as A.B.C.D, or None when the name has another shape.
    """
    match = VERSION_NAME_PATTERN.match(file_name)
    if match is None:
        return None
    return ".".join(match.groups())


def iter_changelog_files(folder: Path) -> Iterable[Tuple[Path, str]]:
    """Yield changelog files paired with the version encoded in their names.

    Args:
        folder: Skill folder whose changelog subtree is walked.

    Returns:
        Pairs of matching file and dotted version, in sorted order.
    """
    for path in sorted(folder.glob(CHANGELOG_GLOB)):
        version = version_from_name(path.name)
        if version is not None:
            yield path, version


def read_lines(path: Path) -> List[str]:
    """Read a file into lines that keep their original endings.

    Args:
        path: File to read.

    Returns:
        Lines including their trailing newline sequences.
    """
    with path.open("r", encoding="utf-8", newline="") as handle:
        return handle.read().splitlines(keepends=True)


def write_lines(path: Path, lines: List[str]) -> None:
    """Write lines verbatim, without newline translation.

    Args:
        path: File to overwrite.
        lines: Lines to write, trailing newline sequences included.
    """
    with path.open("w", encoding="utf-8", newline="") as handle:
        handle.write("".join(lines))


def strip_ending(line: str) -> str:
    """Return a line without its trailing newline sequence.

    Args:
        line: Raw line, with or without a trailing newline.

    Returns:
        The line content alone.
    """
    return line.rstrip("\r\n")


def line_ending(line: str) -> str:
    """Return the newline sequence a line ends with.

    Args:
        line: Raw line that may end with CRLF, LF, or nothing.

    Returns:
        The line's newline sequence, or LF when it has none.
    """
    if line.endswith("\r\n"):
        return "\r\n"
    if line.endswith("\n"):
        return "\n"
    return "\n"


def find_frontmatter_close(lines: List[str]) -> Optional[int]:
    """Find the closing delimiter of the leading frontmatter block.

    Args:
        lines: File lines with trailing newline sequences.

    Returns:
        Zero-based index of the closing delimiter line, or None when the file
        does not open and close its frontmatter with delimiter lines.
    """
    if not lines or strip_ending(lines[0]) != FRONTMATTER_DELIMITER:
        return None
    for index in range(1, len(lines)):
        if strip_ending(lines[index]) == FRONTMATTER_DELIMITER:
            return index
    return None


def process_file(path: Path, version: str) -> str:
    """Insert the version key when missing and classify the file.

    Args:
        path: Changelog file to inspect.
        version: Dotted version read from the file name.

    Returns:
        "changed", "already_had", or "no_frontmatter".
    """
    lines = read_lines(path)
    close_index = find_frontmatter_close(lines)
    if close_index is None:
        return "no_frontmatter"

    if any(line.startswith(VERSION_KEY_PREFIX) for line in lines[1:close_index]):
        return "already_had"

    newline = line_ending(lines[close_index - 1])
    lines.insert(close_index, f"{VERSION_KEY_PREFIX} {version}{newline}")
    write_lines(path, lines)
    return "changed"


def main(argv: List[str]) -> int:
    """Process each skill folder named on the command line.

    Args:
        argv: Full argument vector, script name included.

    Returns:
        Process exit status: 0 on success, 2 when no folder was given.
    """
    if len(argv) < 2:
        print(USAGE, file=sys.stderr)
        return 2

    counts = {"changed": 0, "already_had": 0, "no_frontmatter": 0}
    for folder_arg in argv[1:]:
        folder = Path(folder_arg)
        if not folder.is_dir():
            print(f"not a directory: {folder_arg}", file=sys.stderr)
            continue
        for path, version in iter_changelog_files(folder):
            outcome = process_file(path, version)
            counts[outcome] += 1
            if outcome == "changed":
                print(f"changed: {path}")
            elif outcome == "no_frontmatter":
                print(f"skipped (no frontmatter): {path}")

    print(
        f"changed={counts['changed']} already_had={counts['already_had']} "
        f"no_frontmatter={counts['no_frontmatter']}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
