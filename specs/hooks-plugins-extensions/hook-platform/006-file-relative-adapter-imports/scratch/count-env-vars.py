#!/usr/bin/env python3
"""Recount the ENV-REFERENCE variable totals with the method the doc states.

Counts unique backticked names in the `Variable` column of every table below the
totals line, once per name in multi-variable cells, and separately the names that
appear only in a `governing env var` column.
"""

import re
import subprocess
import sys

NAME = re.compile(r"`([^`]+)`")
TOTALS = "Total unique variables documented:"


def cells(line: str) -> list[str]:
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def count(lines: list[str]) -> tuple[set[str], set[str]]:
    start = next(i for i, line in enumerate(lines) if TOTALS in line)
    variable_names: set[str] = set()
    governing_names: set[str] = set()
    column = governing = None
    for line in lines[start + 1 :]:
        if not line.lstrip().startswith("|"):
            column = governing = None
            continue
        row = cells(line)
        if column is None and governing is None:
            lowered = [cell.lower() for cell in row]
            if "variable" in lowered:
                column = lowered.index("variable")
            if "governing env var" in lowered:
                governing = lowered.index("governing env var")
            continue
        if column is not None and column < len(row):
            variable_names.update(NAME.findall(row[column]))
        if governing is not None and governing < len(row):
            governing_names.update(NAME.findall(row[governing]))
    return variable_names, governing_names


def main() -> int:
    source = sys.argv[1] if len(sys.argv) > 1 else "-"
    if source == "-":
        text = sys.stdin.read()
    elif source.startswith("git:"):
        text = subprocess.run(
            ["git", "-c", "core.fsmonitor=false", "show", source[4:]],
            capture_output=True,
            text=True,
            check=True,
        ).stdout
    else:
        with open(source, encoding="utf-8") as handle:
            text = handle.read()
    variable_names, governing_names = count(text.splitlines())
    only_governing = governing_names - variable_names
    print(f"variable column: {len(variable_names)}")
    print(f"governing-only: {len(only_governing)} {sorted(only_governing)}")
    print(f"total with governing-only: {len(variable_names | governing_names)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
