#!/usr/bin/env python3
# ---------------------------------------------------------------
# COMPONENT: POLISH READINESS CHECK
# ---------------------------------------------------------------
"""Deterministic polish-readiness gate for filled design audit reports.

A ready verdict is otherwise cheap prose. This gate makes the report carry a
polish-readiness row with an allowed verdict, and makes `ready` depend on a
fresh unfinished-marker scan. The scan is a necessary floor only; it does not
prove that hierarchy, alignment, state craft, or perceived quality are strong.

Usage:
  polish_readiness_check.py --scan <surface> <filled-audit-report.md>
  polish_readiness_check.py --json --scan <surface> <filled-audit-report.md>
  polish_readiness_check.py <filled-audit-report.md>

Exit: 0 = satisfied; 1 = violated or unfilled; 2 = usage/read/parse error.
"""

import argparse
import json
import os
from pathlib import Path
import re
import sys
from typing import Any, Optional

SHARED_SCRIPTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "shared", "scripts"))
sys.path.insert(0, SHARED_SCRIPTS_DIR)
from md_table import _is_separator_row, _split_table_row, _strip_markdown


ALLOWED_VERDICTS = {"ready", "blocked", "not-assessed"}
MARKER_PATTERN = re.compile(r"\b(TODO|FIXME|XXX|HACK|WIP)\b")
POLISH_READINESS_LABEL = re.compile(r"\bpolish[-\s]+readiness\b", re.I)
VERDICT_PATTERN = re.compile(r"\b(ready|blocked|not[-\s]assessed)\b", re.I)


def _normalize_verdict(value: str) -> str:
    cleaned = _strip_markdown(value).lower()
    return re.sub(r"\bnot\s+assessed\b", "not-assessed", cleaned)


def _extract_verdict(text: str) -> dict[str, Any]:
    for line_number, line in enumerate(text.splitlines(), start=1):
        cells = _split_table_row(line)
        if not cells or _is_separator_row(cells):
            continue

        if not any(POLISH_READINESS_LABEL.search(_strip_markdown(cell)) for cell in cells):
            continue

        for cell in cells[1:]:
            match = VERDICT_PATTERN.search(_strip_markdown(cell))
            if match:
                verdict = _normalize_verdict(match.group(1))
                return {
                    "found": True,
                    "verdict": verdict,
                    "line": line_number,
                    "row": line.strip(),
                }

        return {
            "found": True,
            "verdict": None,
            "line": line_number,
            "row": line.strip(),
        }

    return {"found": False, "verdict": None}


def _scan_file(path: Path) -> tuple[list[dict[str, Any]], list[str]]:
    locations: list[dict[str, Any]] = []
    errors: list[str] = []

    try:
        text = path.read_text(encoding="utf-8", errors="ignore")
    except OSError as error:
        return locations, [f"cannot read {path}: {error}"]

    for line_number, line in enumerate(text.splitlines(), start=1):
        for match in MARKER_PATTERN.finditer(line):
            locations.append(
                {
                    "path": str(path),
                    "line": line_number,
                    "marker": match.group(1),
                    "text": line.strip(),
                }
            )

    return locations, errors


def _scan_surface(surface: Optional[Path]) -> dict[str, Any]:
    if surface is None:
        return {
            "ran": False,
            "markerCount": 0,
            "markerLocations": [],
            "errors": [],
        }

    if not surface.exists():
        return {
            "ran": True,
            "markerCount": 0,
            "markerLocations": [],
            "errors": [f"scan path not found: {surface}"],
        }

    files = [surface] if surface.is_file() else sorted(path for path in surface.rglob("*") if path.is_file())
    locations: list[dict[str, Any]] = []
    errors: list[str] = []
    for path in files:
        file_locations, file_errors = _scan_file(path)
        locations.extend(file_locations)
        errors.extend(file_errors)

    return {
        "ran": True,
        "markerCount": len(locations),
        "markerLocations": locations,
        "errors": errors,
    }


def check(text: str, scan: dict[str, Any]) -> dict[str, Any]:
    verdict_result = _extract_verdict(text)
    verdict = verdict_result.get("verdict")
    base = {
        "verdict": verdict,
        "verdictLine": verdict_result.get("line"),
        "scanRan": scan["ran"],
        "markerCount": scan["markerCount"],
        "markerLocations": scan["markerLocations"],
    }

    if not verdict_result["found"] or verdict not in ALLOWED_VERDICTS:
        return {
            **base,
            "ok": False,
            "exit": 1,
            "reason": "polish readiness row missing or verdict not in {ready, blocked, not-assessed}",
        }

    if verdict == "ready" and not scan["ran"]:
        return {
            **base,
            "ok": False,
            "exit": 1,
            "reason": "ready claimed without a scan",
        }

    if verdict == "ready" and scan["markerCount"] > 0:
        return {
            **base,
            "ok": False,
            "exit": 1,
            "reason": f"ready claimed with {scan['markerCount']} unfinished markers present",
        }

    if verdict == "ready":
        reason = "Polish readiness satisfied"
    elif verdict == "blocked":
        reason = "Polish readiness blocked honestly"
    else:
        reason = "Polish readiness not assessed honestly"

    return {
        **base,
        "ok": True,
        "exit": 0,
        "reason": reason,
    }


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="polish_readiness_check.py",
        description="Check a filled audit report's polish-readiness verdict against an unfinished-marker scan.",
    )
    parser.add_argument("report", help="Filled audit report markdown file")
    parser.add_argument("--scan", help="Surface file or directory to scan for unfinished markers")
    parser.add_argument("--json", action="store_true", help="Emit structured JSON output")
    return parser


def main(argv: list[str]) -> int:
    parser = _build_parser()
    args = parser.parse_args(argv)

    report = Path(args.report)
    try:
        text = report.read_text(encoding="utf-8")
    except OSError as error:
        sys.stderr.write(f"cannot read {report}: {error}\n")
        return 2

    scan = _scan_surface(Path(args.scan) if args.scan else None)
    if scan["errors"]:
        for error in scan["errors"]:
            sys.stderr.write(f"{error}\n")
        return 2

    result = check(text, scan)
    if args.json:
        print(json.dumps({"file": str(report), "scan": args.scan, **result}, indent=2))
    else:
        print(f"Polish readiness gate - {report}")
        print(f"  verdict: {result.get('verdict', 'unknown')}")
        print(f"  scan ran: {'yes' if result['scanRan'] else 'no'}")
        print(f"  markers: {result['markerCount']}")
        print(f"  status: {'PASS' if result['ok'] else 'FAIL'}")
        print(f"  reason: {result['reason']}")

    return int(result["exit"])


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
