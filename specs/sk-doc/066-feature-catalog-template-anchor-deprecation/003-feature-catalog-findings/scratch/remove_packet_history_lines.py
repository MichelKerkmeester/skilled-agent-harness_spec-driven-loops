#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: FEATURE CATALOG PACKET HISTORY REMOVER
# ───────────────────────────────────────────────────────────────
"""
Remove deprecated packet-history lines from feature catalog markdown files.

Feature catalog entries once recorded the packet that produced them as
`Feature ID`, `Source phase`, or `Origin packet` lines. Those anchors are
retired, so each matching line is deleted as a whole while every other
line, its line ending, and any missing trailing newline survive unchanged.

Usage: python3 -I remove_packet_history_lines.py [--apply]
Output: one `path:line: text` line per matching line, then a total line
        `total_lines_removed=<n>`. Without --apply no file is written.
"""

from __future__ import annotations

# ───────────────────────────────────────────────────────────────
# 1. IMPORTS
# ───────────────────────────────────────────────────────────────

import argparse
import re
import subprocess
import sys
from pathlib import Path

# ───────────────────────────────────────────────────────────────
# 2. CONSTANTS
# ───────────────────────────────────────────────────────────────

PACKET_HISTORY_LINE = re.compile(
    r"^\s*(?:[-*]\s*)?(?:source\s+phase|feature[- ]?id(?:\s+history)?|origin\s+packet)\s*:",
    re.IGNORECASE,
)

# ───────────────────────────────────────────────────────────────
# 3. HELPERS
# ───────────────────────────────────────────────────────────────


def repo_root() -> Path:
    """Return the top level of the current git work tree."""
    result = subprocess.run(
        ["git", "rev-parse", "--show-toplevel"],
        capture_output=True,
        check=True,
        text=True,
    )
    return Path(result.stdout.strip())


def feature_catalog_files(root: Path) -> list[Path]:
    """Return every markdown file that sits below a feature-catalog directory."""
    skills_root = root / ".skilled" / "skills"
    return sorted(
        path for path in skills_root.rglob("*.md") if "feature-catalog" in path.parts
    )


def remove_history_lines(lines: list[str]) -> tuple[list[str], list[tuple[int, str]]]:
    """Drop every packet-history line, keeping all other lines untouched.

    Args:
        lines: File lines with their original line endings.

    Returns:
        The kept lines and the (1-based line number, display text) of each
        deleted line.
    """
    kept: list[str] = []
    removed: list[tuple[int, str]] = []
    for number, line in enumerate(lines, start=1):
        if PACKET_HISTORY_LINE.match(line):
            removed.append((number, line.rstrip("\r\n")))
            continue
        kept.append(line)
    return kept, removed


# ───────────────────────────────────────────────────────────────
# 4. MAIN
# ───────────────────────────────────────────────────────────────


def parse_args(argv: list[str]) -> argparse.Namespace:
    """Parse the optional --apply switch; the default run only reports."""
    parser = argparse.ArgumentParser(
        description="Remove deprecated packet-history lines from feature catalog markdown files."
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Write the deletions to disk; omit for a dry run.",
    )
    return parser.parse_args(argv)


def main() -> int:
    """Report every matching line and write the deletions only with --apply."""
    args = parse_args(sys.argv[1:])
    root = repo_root()
    total_removed = 0
    for path in feature_catalog_files(root):
        with path.open(encoding="utf-8", newline="") as handle:
            lines = handle.readlines()
        kept, removed = remove_history_lines(lines)
        if not removed:
            continue
        relative = path.relative_to(root).as_posix()
        for number, text in removed:
            print(f"{relative}:{number}: {text}")
        if args.apply:
            with path.open("w", encoding="utf-8", newline="") as handle:
                handle.writelines(kept)
        total_removed += len(removed)
    print(f"total_lines_removed={total_removed}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
