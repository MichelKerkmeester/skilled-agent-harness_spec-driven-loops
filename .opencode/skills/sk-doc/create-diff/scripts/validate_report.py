#!/usr/bin/env python3
"""Assert a create-diff HTML report is safe and self-contained.

A generated report is meant to open from `file://` with no network access and no
scripts. This checks that promise so a regression in the renderer cannot silently
ship a report that phones home or executes content. Exit 0 = pass, 1 = fail.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path
from typing import List

# Real HTML tags only. Escaped document content uses `&lt;`, so it is never
# captured here — that is what keeps hostile *text* (e.g. "<img onerror=...>"
# pasted into a document) from being mistaken for live markup.
_REAL_TAG = re.compile(r"<[a-zA-Z!/][^>]*>", re.DOTALL)

# Attribute-level hazards, checked ONLY inside real tags.
_REMOTE_REF = re.compile(
    r"""(?:src|href)\s*=\s*["']?(?!data:|#)\s*(?:https?:)?//""", re.IGNORECASE)
_INLINE_HANDLER = re.compile(r"\son[a-z]+\s*=", re.IGNORECASE)


def validate(path: Path) -> List[str]:
    problems: List[str] = []
    html = path.read_text(encoding="utf-8", errors="replace")

    if not html.lstrip().lower().startswith("<!doctype html"):
        problems.append("missing <!doctype html> preamble")
    if "<html lang" not in html.lower():
        problems.append("missing <html lang=...> for accessibility")
    if "content-security-policy" not in html.lower():
        problems.append("missing Content-Security-Policy meta tag")

    for tag in _REAL_TAG.findall(html):
        low = tag.lower()
        if low.startswith("<script"):
            problems.append("contains a <script> tag (must be zero-JavaScript)")
        if _INLINE_HANDLER.search(tag):
            problems.append(f"inline event handler in markup: {tag[:60].strip()}…")
        if low.startswith("<link") and _REMOTE_REF.search(tag):
            problems.append("references an external stylesheet/link")
        if (low.startswith("<img") or low.startswith("<iframe")
                or low.startswith("<source")) and _REMOTE_REF.search(tag):
            problems.append(f"references a remote resource in markup: {tag[:60].strip()}…")

    # De-duplicate while preserving order (a report may repeat the same hazard).
    seen = set()
    unique = []
    for p in problems:
        if p not in seen:
            seen.add(p)
            unique.append(p)
    return unique


def main(argv: List[str]) -> int:
    if not argv:
        print("usage: validate_report.py <report.html> [more.html ...]", file=sys.stderr)
        return 1
    failed = False
    for arg in argv:
        path = Path(arg)
        if not path.exists():
            print(f"FAIL {path}: not found")
            failed = True
            continue
        problems = validate(path)
        if problems:
            failed = True
            print(f"FAIL {path}:")
            for p in problems:
                print(f"  - {p}")
        else:
            print(f"PASS {path}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
