#!/usr/bin/env python3
# ---------------------------------------------------------------
# COMPONENT: BASELINE RHYTHM CHECKER
# ---------------------------------------------------------------
"""Deterministic baseline-rhythm checker for spacing token tables.

Exists because a spacing scale can say "use the scale" while still letting a
one-off value slip into the token table unnoticed. This checker makes the
vertical-rhythm contract executable: spacing values must resolve to the
declared baseline, a small sub-baseline fraction, or an explicitly marked
exception.

Usage:
  baseline_rhythm_check.py token_starter.md
  baseline_rhythm_check.py --json token_starter.md

Unit rule: px values are read directly; rem and em values resolve against a
16px root. Fluid units inside clamp() are exempt, but fixed px/rem/em anchors
inside the same value must still resolve to the baseline. Rows that genuinely
cannot resolve must include the literal word "exception" in the Use cell.

Exit: 0 = all rows resolve or are marked; 1 = validation failure; 2 = usage or
read error.
"""
import json
import os
from pathlib import Path
import re
import sys
from typing import Any, Optional

SHARED_SCRIPTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "shared", "scripts"))
sys.path.insert(0, SHARED_SCRIPTS_DIR)
from md_table import _clean_cell, _is_separator_row, _split_table_row

ROOT_PX = 16.0
EPSILON = 0.000001
SPACING_HEADING = re.compile(r"^#{1,6}\s+(?:\d+\.\s+)?SPACING SCALE\s*$", re.I)
MARKDOWN_HEADING = re.compile(r"^#{1,6}\s+")
LENGTH_TOKEN = re.compile(
    r"(?<![A-Za-z0-9_-])(-?\d+(?:\.\d+)?)\s*"
    r"(dvw|dvh|svw|svh|lvw|lvh|vmin|vmax|rem|em|px|vw|vh|%)\b",
    re.I,
)
FIXED_UNITS = {"px", "rem", "em"}
FLUID_UNITS = {"vw", "vh", "vmin", "vmax", "%", "dvw", "dvh", "svw", "svh", "lvw", "lvh"}


def _normalized_header(cells: list[str]) -> list[str]:
    return [re.sub(r"\s+", " ", _clean_cell(cell).lower()) for cell in cells]


def _find_spacing_table(text: str) -> tuple[list[dict[str, Any]], list[str]]:
    lines = text.splitlines()
    rows: list[dict[str, Any]] = []
    errors: list[str] = []

    start = None
    for index, line in enumerate(lines):
        if SPACING_HEADING.match(line):
            start = index + 1
            break
    if start is None:
        return rows, ["spacing section missing"]

    saw_header = False
    in_table = False
    for line_number, line in enumerate(lines[start:], start + 1):
        cells = _split_table_row(line)
        if not cells:
            if in_table:
                break
            if MARKDOWN_HEADING.match(line):
                break
            continue

        if len(cells) != 3:
            errors.append(f"line {line_number}: expected 3 columns, found {len(cells)}")
            in_table = True
            continue

        normalized = _normalized_header(cells)
        if normalized == ["token", "value", "use"]:
            saw_header = True
            in_table = True
            continue
        if _is_separator_row(cells):
            in_table = True
            continue
        if not saw_header:
            continue

        rows.append(
            {
                "line": line_number,
                "token": _clean_cell(cells[0]),
                "value": _clean_cell(cells[1]),
                "use": _clean_cell(cells[2]),
            }
        )
        in_table = True

    if not saw_header:
        errors.append("spacing table header missing")
    return rows, errors


def _lengths(value: str) -> list[dict[str, Any]]:
    lengths = []
    for match in LENGTH_TOKEN.finditer(value):
        amount = float(match.group(1))
        unit = match.group(2).lower()
        if unit == "px":
            px = amount
        elif unit in {"rem", "em"}:
            px = amount * ROOT_PX
        else:
            px = None
        lengths.append({"raw": match.group(0), "amount": amount, "unit": unit, "px": px})
    return lengths


def _is_baseline_value(px: float, baseline_px: float) -> bool:
    if baseline_px <= 0 or px < 0:
        return False
    ratio = px / baseline_px
    if abs(ratio - round(ratio)) <= EPSILON:
        return True
    return any(abs(ratio - allowed) <= EPSILON for allowed in (0.5, 0.25))


def _baseline_px(row: dict[str, Any]) -> tuple[Optional[float], Optional[str]]:
    lengths = _lengths(row["value"])
    fixed = [item for item in lengths if item["unit"] in FIXED_UNITS]
    if len(fixed) != 1 or len(lengths) != 1:
        return None, f"{row['token']}: baseline value must be one fixed px/rem/em length"
    px = fixed[0]["px"]
    if px is None or px <= 0:
        return None, f"{row['token']}: baseline value must be greater than zero"
    return px, None


def _check_row(row: dict[str, Any], baseline_px: float) -> dict[str, Any]:
    use = row["use"].lower()
    if "exception" in use:
        return {**row, "ok": True, "reason": "marked exception"}

    lengths = _lengths(row["value"])
    fixed = [item for item in lengths if item["unit"] in FIXED_UNITS]
    fluid = [item for item in lengths if item["unit"] in FLUID_UNITS]
    if not lengths:
        return {**row, "ok": False, "reason": "no supported length found"}
    if fluid and not fixed:
        return {**row, "ok": False, "reason": "fluid value has no fixed px/rem/em anchor"}
    if not fixed:
        return {**row, "ok": False, "reason": "no fixed px/rem/em anchor found"}

    bad = [item for item in fixed if item["px"] is None or not _is_baseline_value(item["px"], baseline_px)]
    if bad:
        bad_values = ", ".join(item["raw"] for item in bad)
        return {
            **row,
            "ok": False,
            "reason": f"{bad_values} does not resolve to the {baseline_px:g}px baseline",
        }

    if fluid:
        return {**row, "ok": True, "reason": "fixed fluid anchors resolve"}
    return {**row, "ok": True, "reason": "resolves to baseline"}


def check(text: str) -> dict[str, Any]:
    rows, parse_errors = _find_spacing_table(text)
    failures = [{"reason": error} for error in parse_errors]

    if not rows:
        failures.append({"reason": "spacing rows missing"})
        return {"baseline": None, "rows": 0, "checked": [], "failures": failures, "ok": False}

    baseline_rows = [row for row in rows if row["token"] == "--baseline"]
    if not baseline_rows:
        failures.append({"reason": "baseline token missing"})
        return {"baseline": None, "rows": len(rows), "checked": [], "failures": failures, "ok": False}

    baseline_px, baseline_error = _baseline_px(baseline_rows[0])
    if baseline_error or baseline_px is None:
        failures.append({"reason": baseline_error or "baseline token invalid"})
        return {"baseline": None, "rows": len(rows), "checked": [], "failures": failures, "ok": False}

    spacing_rows = [row for row in rows if row["token"] != "--baseline"]
    if not spacing_rows:
        failures.append({"reason": "spacing rows missing"})

    checked = [_check_row(row, baseline_px) for row in spacing_rows]
    failures.extend(row for row in checked if not row["ok"])
    return {
        "baseline": {"token": "--baseline", "value": baseline_rows[0]["value"], "px": baseline_px},
        "rows": len(spacing_rows),
        "checked": checked,
        "failures": failures,
        "ok": not failures,
    }


def main(argv: list[str]) -> int:
    as_json = "--json" in argv
    paths = [arg for arg in argv if arg != "--json"]
    if len(paths) != 1:
        sys.stderr.write("usage: baseline_rhythm_check.py [--json] <token_starter.md>\n")
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
        print(f"Baseline rhythm gate - {path}")
        baseline = result["baseline"]
        if baseline:
            print(f"  baseline: {baseline['value']} ({baseline['px']:g}px)")
        print(f"  spacing rows: {result['rows']}")
        if result["ok"]:
            print("PASS - all spacing rows resolve to the baseline or are marked exceptions.")
        else:
            for failure in result["failures"]:
                token = failure.get("token")
                value = failure.get("value")
                reason = failure["reason"]
                if token and value:
                    print(f"FAIL - {token}: {value} - {reason}")
                else:
                    print(f"FAIL - {reason}")

    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
