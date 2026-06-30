#!/usr/bin/env python3
"""Deterministic schema gate for the design variant parameter contract.

Variant transports can silently drift when a row looks complete but drops a
renderer or leaves ownership vague. This checker reads the contract table and
exits non-zero unless every variant knob has the required schema cells filled
and names every canonical transport.

Usage:
  variant_parameter_check.py variant_parameter_contract.md
  variant_parameter_check.py --json variant_parameter_contract.md

Exit: 0 = rows present, complete, and transport-covered; 1 = violated;
2 = usage or read error.
"""
import json
import os
from pathlib import Path
import re
import sys
from typing import Any

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from md_table import _clean_cell, _is_separator_row, _split_table_row

TABLE_COLUMNS = [
    "knob",
    "range/values",
    "step",
    "owner mode",
    "transports",
    "caveat",
]
REQUIRED_COLUMNS = [
    "knob",
    "range/values",
    "owner mode",
    "transports",
    "caveat",
]
CANONICAL_TRANSPORTS = ["figma", "open-design", "live"]
KNOB_TABLE_HEADING = re.compile(r"^#{1,6}\s+(?:\d+\.\s+)?Knob Schema\s*$", re.I)
MARKDOWN_HEADING = re.compile(r"^#{1,6}\s+")
PLACEHOLDER = re.compile(r"^(?:_+|TBD|TODO|-|N/A)$", re.I)


def _is_placeholder(value: str) -> bool:
    return not _clean_cell(value) or bool(PLACEHOLDER.fullmatch(_clean_cell(value)))


def _normalized_header(cells: list[str]) -> list[str]:
    normalized = []
    for cell in cells:
        cleaned = re.sub(r"\s+", " ", _clean_cell(cell).lower())
        cleaned = cleaned.replace(" / ", "/")
        normalized.append(cleaned)
    return normalized


def _find_table_start(lines: list[str]) -> int:
    for index, line in enumerate(lines):
        if KNOB_TABLE_HEADING.match(line):
            return index + 1
    return 0


def _find_rows(text: str) -> tuple[list[dict[str, Any]], list[str]]:
    lines = text.splitlines()
    start = _find_table_start(lines)
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

        if len(cells) != len(TABLE_COLUMNS):
            errors.append(f"line {line_number}: expected 6 columns, found {len(cells)}")
            in_table = True
            continue

        normalized = _normalized_header(cells)
        if normalized == TABLE_COLUMNS:
            in_table = True
            saw_header = True
            continue
        if _is_separator_row(cells):
            in_table = True
            continue
        if not saw_header:
            continue

        row = dict(zip(TABLE_COLUMNS, [_clean_cell(cell) for cell in cells]))
        row["line"] = line_number
        rows.append(row)

    if not saw_header:
        errors.append("variant-parameter table header missing")
    return rows, errors


def _transport_present(transports: str, transport: str) -> bool:
    pattern = rf"(?<![\w-]){re.escape(transport)}(?![\w-])"
    return bool(re.search(pattern, transports, re.I))


def check(text: str) -> dict[str, Any]:
    rows, errors = _find_rows(text)
    incomplete: list[dict[str, str]] = []
    missing_transports: list[dict[str, str]] = []

    for index, row in enumerate(rows, 1):
        knob = row["knob"] if not _is_placeholder(row["knob"]) else f"row-{index}"
        for column in REQUIRED_COLUMNS:
            if _is_placeholder(row[column]):
                incomplete.append({"knob": knob, "column": column})

        if not _is_placeholder(row["transports"]):
            for transport in CANONICAL_TRANSPORTS:
                if not _transport_present(row["transports"], transport):
                    missing_transports.append({"knob": knob, "transport": transport})

    missing = []
    if not rows:
        missing.append("variant-knob rows missing")

    ok = not errors and not missing and not incomplete and not missing_transports
    return {
        "rows": len(rows),
        "errors": errors,
        "missing": missing,
        "incomplete": incomplete,
        "missing_transports": missing_transports,
        "ok": ok,
    }


def main(argv: list[str]) -> int:
    as_json = "--json" in argv
    paths = [arg for arg in argv if arg != "--json"]
    if len(paths) != 1:
        sys.stderr.write("usage: variant_parameter_check.py [--json] <variant_parameter_contract.md>\n")
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
        print(f"Variant parameter schema gate - {path}")
        print(f"  rows: {result['rows']}")
        if result["ok"]:
            print("PASS - all variant parameter rows are complete and transport-covered.")
        else:
            for error in result["errors"]:
                print(f"FAIL - {error}")
            for missing in result["missing"]:
                print(f"FAIL - {missing}")
            for item in result["incomplete"]:
                print(f"FAIL - {item['knob']}: blank {item['column']}")
            for item in result["missing_transports"]:
                print(f"FAIL - {item['knob']}: missing transport {item['transport']}")

    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
