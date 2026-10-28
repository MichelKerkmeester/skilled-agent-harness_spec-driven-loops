#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: COMMENT HYGIENE PER-FILE CHECK
# ───────────────────────────────────────────────────────────────

"""Check one file and record what it holds.

Usage: imported by `cli.py`
Output: one result record per file, with its status, its language and its findings
"""

from __future__ import annotations

# ───────────────────────────────────────────────────────────────
# 1. IMPORTS
# ───────────────────────────────────────────────────────────────

import os
import sys
from typing import Any, Dict, List, Pattern, Tuple

from .families import language_for
from .rules import ALLOWED_PATTERNS, URL_SPAN
from .scanner import ScanState, comment_text


# ───────────────────────────────────────────────────────────────
# 2. CONSTANTS
# ───────────────────────────────────────────────────────────────

EXCLUDED_DIRS = ["/dist/", "/node_modules/", "/.git/"]


# ───────────────────────────────────────────────────────────────
# 3. FILE CHECK
# ───────────────────────────────────────────────────────────────

def _check_file(
    filepath: str,
    table: Dict[str, Any],
    patterns: List[Tuple[str, Pattern[str], str]],
    extra_extensions: Dict[str, str],
) -> Dict[str, Any]:
    """Check one file and return its result record."""
    record = {"file": filepath, "status": "clean", "language": None, "findings": []}
    abs_path = os.path.abspath(filepath)
    if any(excl in abs_path for excl in EXCLUDED_DIRS):
        record.update(status="skipped", reason="excluded directory")
        return record
    if os.path.basename(filepath).endswith(".vitest.js"):
        record.update(status="skipped", reason="excluded test bundle")
        return record
    if os.path.isdir(filepath):
        record.update(status="skipped", reason="directory")
        return record

    try:
        language, family_name = language_for(filepath, table, extra_extensions)
        if language is None:
            record.update(status="skipped", reason="unknown language")
            return record
        with open(filepath, "r", encoding="utf-8", errors="replace") as handle:
            lines = handle.readlines()
    except OSError as error:
        # The shebang sniff opens every file, so a file the extension alone would have
        # skipped stays skipped when it cannot be opened.
        ext = os.path.splitext(os.path.basename(filepath))[1].lower()
        if ext not in extra_extensions and ext not in table["by_extension"]:
            record.update(status="skipped", reason="unreadable, unknown language")
            return record
        print(f"ERROR: cannot read {filepath}: {error}", file=sys.stderr)
        record.update(status="unreadable", error=str(error))
        return record

    record["language"] = language
    family = table["families"][family_name]
    state = ScanState()
    for lineno, raw_line in enumerate(lines, start=1):
        text = comment_text(raw_line, family, state)
        if not text or "hygiene-ok" in text:
            continue
        text = URL_SPAN.sub("", text)
        for allowed in ALLOWED_PATTERNS:
            text = allowed.sub(" ", text)
        for rule, pattern, reason in patterns:
            if pattern.search(text):
                record["findings"].append({
                    "line": lineno,
                    "rule": rule,
                    "reason": reason,
                    "excerpt": raw_line.rstrip(),
                })
                break
    if record["findings"]:
        record["status"] = "violation"
    return record
