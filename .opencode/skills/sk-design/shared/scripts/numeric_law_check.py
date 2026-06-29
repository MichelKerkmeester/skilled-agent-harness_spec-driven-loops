#!/usr/bin/env python3
"""Deterministic completeness and uniqueness gate for the numeric design laws index.

The index is a reference surface, so the first failure mode is a row that looks
canonical while leaving a value, owner, source, or caveat blank. This checker
parses the law table and exits non-zero unless every law row has all six
required cells populated and no two rows register the same value.

Usage:
  numeric_law_check.py numeric_design_laws.md
  numeric_law_check.py --json numeric_design_laws.md

Exit: 0 = rows present, complete, and unique; 1 = missing rows, incomplete
cells, or duplicate values; 2 = usage or read error.
"""
import json
from pathlib import Path
import re
import sys
from typing import Any

REQUIRED_COLUMNS = [
    "law_id",
    "value/range",
    "owner mode",
    "enforcement target",
    "source",
    "caveat",
]
LAW_TABLE_HEADING = re.compile(r"^#{1,6}\s+(?:\d+\.\s+)?Law Index\s*$", re.I)
MARKDOWN_HEADING = re.compile(r"^#{1,6}\s+")
PLACEHOLDER = re.compile(r"^(?:_+|TBD|TODO|-)$", re.I)


def _clean_cell(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == "`" and value[-1] == "`":
        value = value[1:-1].strip()
    return value


def _split_table_row(line: str) -> list[str]:
    line = line.strip()
    if not line.startswith("|") or not line.endswith("|"):
        return []
    return [cell.strip() for cell in line.strip("|").split("|")]


def _is_separator_row(cells: list[str]) -> bool:
    return bool(cells) and all(re.fullmatch(r":?-{3,}:?", cell.strip()) for cell in cells)


def _is_placeholder(value: str) -> bool:
    return not _clean_cell(value) or bool(PLACEHOLDER.fullmatch(_clean_cell(value)))


def _normalized_header(cells: list[str]) -> list[str]:
    return [re.sub(r"\s+", " ", _clean_cell(cell).lower()) for cell in cells]


def _normalized_value(value: str) -> str:
    return re.sub(r"\s+", " ", _clean_cell(value).lower()).strip()


def _find_law_table_start(lines: list[str]) -> int:
    for index, line in enumerate(lines):
        if LAW_TABLE_HEADING.match(line):
            return index + 1
    return 0


def _find_law_rows(text: str) -> tuple[list[dict[str, Any]], list[str]]:
    lines = text.splitlines()
    start = _find_law_table_start(lines)
    rows: list[dict[str, Any]] = []
    errors: list[str] = []
    in_table = False
    saw_header = False

    for line_number, line in enumerate(lines[start:], start + 1):
        cells = _split_table_row(line)
        if not cells:
            if in_table:
                break
            if MARKDOWN_HEADING.match(line) and start != 0:
                break
            continue

        if len(cells) != len(REQUIRED_COLUMNS):
            errors.append(f"line {line_number}: expected 6 columns, found {len(cells)}")
            in_table = True
            continue

        normalized = _normalized_header(cells)
        if normalized == REQUIRED_COLUMNS:
            in_table = True
            saw_header = True
            continue
        if _is_separator_row(cells):
            in_table = True
            continue
        if not saw_header:
            continue

        row = dict(zip(REQUIRED_COLUMNS, [_clean_cell(cell) for cell in cells]))
        row["line"] = line_number
        rows.append(row)

    if not saw_header:
        errors.append("numeric-law table header missing")
    return rows, errors


def _find_duplicates(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    values: dict[str, list[dict[str, str]]] = {}

    for index, row in enumerate(rows, 1):
        if _is_placeholder(row["value/range"]):
            continue

        value = _normalized_value(row["value/range"])
        law_id = row["law_id"] if not _is_placeholder(row["law_id"]) else f"row-{index}"
        owner = row["owner mode"] if not _is_placeholder(row["owner mode"]) else ""
        values.setdefault(value, []).append({"law_id": law_id, "owner": owner})

    duplicates: list[dict[str, Any]] = []
    for value, grouped_rows in values.items():
        if len(grouped_rows) < 2:
            continue

        duplicates.append(
            {
                "value": value,
                "law_ids": [row["law_id"] for row in grouped_rows],
                "owners": [row["owner"] for row in grouped_rows],
            }
        )

    return duplicates


def check(text: str) -> dict[str, Any]:
    rows, errors = _find_law_rows(text)
    incomplete: list[dict[str, str]] = []

    for index, row in enumerate(rows, 1):
        law_id = row["law_id"] if not _is_placeholder(row["law_id"]) else f"row-{index}"
        for column in REQUIRED_COLUMNS:
            if _is_placeholder(row[column]):
                incomplete.append({"law_id": law_id, "column": column})

    missing = []
    if not rows:
        missing.append("numeric-law rows missing")

    duplicates = _find_duplicates(rows)
    ok = not errors and not missing and not incomplete and not duplicates
    return {
        "rows": len(rows),
        "errors": errors,
        "missing": missing,
        "incomplete": incomplete,
        "duplicates": duplicates,
        "ok": ok,
    }


def main(argv: list[str]) -> int:
    as_json = "--json" in argv
    paths = [arg for arg in argv if arg != "--json"]
    if len(paths) != 1:
        sys.stderr.write("usage: numeric_law_check.py [--json] <numeric_design_laws.md>\n")
        return 2

    path = Path(paths[0])
    try:
        text = path.read_text(encoding="utf-8")
    except OSError as exc:
        sys.stderr.write(f"cannot read {path}: {exc}\n")
        return 2

    result = check(text)
    if as_json:
        print(json.dumps({"file": str(path), **result}, indent=2))
    else:
        print(f"Numeric law completeness gate - {path}")
        print(f"  rows: {result['rows']}")
        if result["ok"]:
            print("PASS - all numeric law rows are fully populated and unique.")
        else:
            for error in result["errors"]:
                print(f"FAIL - {error}")
            for missing in result["missing"]:
                print(f"FAIL - {missing}")
            for item in result["incomplete"]:
                print(f"FAIL - {item['law_id']}: blank {item['column']}")
            for item in result["duplicates"]:
                print(
                    f"FAIL - duplicate law value \"{item['value']}\" shared by "
                    f"{', '.join(item['law_ids'])} "
                    f"(owners: {', '.join(item['owners'])})"
                )

    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
