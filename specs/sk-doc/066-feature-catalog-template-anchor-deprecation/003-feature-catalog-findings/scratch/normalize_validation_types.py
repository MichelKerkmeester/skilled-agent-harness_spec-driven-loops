#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: FEATURE CATALOG VALIDATION TYPE VOCABULARY NORMALIZER
# ───────────────────────────────────────────────────────────────
"""
Normalize the Type column of feature catalog Validation And Tests tables.

The catalog validator accepts only a fixed set of Type values, so the ad-hoc
labels that drifted into Validation And Tests tables are mapped onto their
canonical equivalent. Only the Type cell of a table whose header is
`| File | Type | Role |` is rewritten; every other cell, every other table and
every line ending survives unchanged.

Usage: python3 -I normalize_validation_types.py [--apply]
Output: one `path:line old -> new` line per rewritten Type cell, then a
        `total_rows_changed=<n>` line. Without --apply no file is written.

Options:
    --apply     Write the rewritten files to disk; omit for a dry run.
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

HEADER_ROW = re.compile(r"^\s*\|\s*File\s*\|\s*Type\s*\|\s*Role\s*\|\s*$")
SEPARATOR_ROW = re.compile(r"^\s*\|[\s:|-]+\|\s*$")
ROW_SHAPE = re.compile(r"^\s*\|(.*)\|\s*$")

TYPE_REPLACEMENTS = {
    "Manual": "Manual playbook",
    "Manual scenario": "Manual playbook",
    "Manual validation anchor": "Manual playbook",
    "Manual gold": "Manual playbook",
    "Test": "Automated test",
    "Automated gate": "Automated test",
    "Automated check": "Automated test",
    "Conformance": "Automated test",
    "Operator reference": "Reference",
    "Safety reference": "Reference",
    "Package reference": "Reference",
    "Contract reference": "Reference",
    "Policy reference": "Reference",
    "Workflow reference": "Reference",
    "Skill contract": "Reference",
    "Catalog": "Reference",
    "Consumed target example": "Reference",
    "Lifecycle": "Reference",
}

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


def split_line_ending(line: str) -> tuple[str, str]:
    """Split a raw line into its content and its original line ending."""
    body = line.rstrip("\r\n")
    return body, line[len(body):]


def cell_spans(row: str) -> list[tuple[int, int]]:
    """Return the (start, end) span of every cell in a markdown table row.

    A pipe escaped with a backslash is cell text and never splits the row.
    Returns an empty list when the row lacks both bounding pipes.
    """
    match = ROW_SHAPE.match(row)
    if match is None:
        return []
    inner = match.group(1)
    offset = match.start(1)
    spans: list[tuple[int, int]] = []
    start = 0
    index = 0
    while index < len(inner):
        if inner[index] == "\\" and index + 1 < len(inner):
            index += 2
            continue
        if inner[index] == "|":
            spans.append((offset + start, offset + index))
            start = index + 1
        index += 1
    spans.append((offset + start, offset + len(inner)))
    return spans


def rewrite_type_cell(row: str, spans: list[tuple[int, int]]) -> tuple[str, str, str] | None:
    """Map the Type cell of a table row onto its canonical value.

    Returns the rewritten row with the old and new value, or None when the
    Type cell keeps its text. The whitespace around the cell value and every
    other cell stay byte for byte identical.
    """
    start, end = spans[1]
    raw_cell = row[start:end]
    old_value = raw_cell.strip()
    new_value = TYPE_REPLACEMENTS.get(old_value)
    if new_value is None:
        return None
    leading = raw_cell[: len(raw_cell) - len(raw_cell.lstrip())]
    trailing = raw_cell[len(raw_cell.rstrip()):]
    rewritten = row[:start] + leading + new_value + trailing + row[end:]
    return rewritten, old_value, new_value


def normalize_lines(lines: list[str]) -> tuple[list[str], list[tuple[int, str, str]]]:
    """Rewrite the legacy Type values of every matching table in one file.

    Args:
        lines: File lines with their original line endings.

    Returns:
        The rewritten lines and the (1-based line number, old value, new value)
        of every changed row.
    """
    output: list[str] = []
    changes: list[tuple[int, str, str]] = []
    in_table = False
    for number, line in enumerate(lines, start=1):
        body, ending = split_line_ending(line)
        if not in_table:
            in_table = HEADER_ROW.match(body) is not None
            output.append(line)
            continue
        if not body.strip().startswith("|"):
            in_table = False
            output.append(line)
            continue
        if SEPARATOR_ROW.match(body):
            output.append(line)
            continue
        spans = cell_spans(body)
        if len(spans) < 3:
            output.append(line)
            continue
        rewritten = rewrite_type_cell(body, spans)
        if rewritten is None:
            output.append(line)
            continue
        new_body, old_value, new_value = rewritten
        output.append(new_body + ending)
        changes.append((number, old_value, new_value))
    return output, changes


# ───────────────────────────────────────────────────────────────
# 4. MAIN
# ───────────────────────────────────────────────────────────────


def parse_args(argv: list[str]) -> argparse.Namespace:
    """Parse the optional --apply switch; the default run only reports."""
    parser = argparse.ArgumentParser(
        description="Normalize the Type column of feature catalog Validation And Tests tables."
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Write the rewritten files to disk; omit for a dry run.",
    )
    return parser.parse_args(argv)


def main() -> int:
    """Report every rewritten Type cell and write files only with --apply."""
    args = parse_args(sys.argv[1:])
    root = repo_root()
    total_changed = 0
    for path in feature_catalog_files(root):
        with path.open(encoding="utf-8", newline="") as handle:
            lines = handle.readlines()
        updated, changes = normalize_lines(lines)
        if not changes:
            continue
        relative = path.relative_to(root).as_posix()
        for number, old_value, new_value in changes:
            print(f"{relative}:{number} {old_value} -> {new_value}")
        if args.apply:
            with path.open("w", encoding="utf-8", newline="") as handle:
                handle.writelines(updated)
        total_changed += len(changes)
    print(f"total_rows_changed={total_changed}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
