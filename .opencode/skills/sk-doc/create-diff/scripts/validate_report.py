#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: CREATE-DIFF REPORT SAFETY VALIDATOR (SK-DOC)
# ───────────────────────────────────────────────────────────────

"""Assert a create-diff HTML report is safe and self-contained.

A generated report is meant to open from `file://` with no network access and no
scripts. This gate parses the report with the standard-library HTML parser (not a
regex) so a malformed attribute cannot hide a live handler, and it asserts the exact
Content-Security-Policy rather than merely its presence. Exit 0 = pass, 1 = fail.

Safety model: the parser only reacts to REAL markup. A document containing hostile
*text* (for example ``<img onerror=...>`` pasted into the source) is escaped by the
renderer to ``&lt;img onerror=...&gt;`` and reaches the parser as inert character
data, never as a tag — so it is correctly ignored. Only genuine tags, attributes,
and ``<style>`` content are inspected.
"""

from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from typing import List, Optional, Set, Tuple

# The one CSP the renderer is allowed to ship, compared as a normalized directive set
# so ordering and incidental whitespace do not matter but a weakened directive does.
# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

REQUIRED_CSP_DIRECTIVES: Set[str] = {
    "default-src 'none'",
    "style-src 'unsafe-inline'",
    "img-src data:",
    "base-uri 'none'",
    "form-action 'none'",
}

# Attributes that can pull in an external resource. Anything not a `data:` URI or a
# same-document `#fragment` breaks self-containment (remote fetch, relative file, or a
# `javascript:` scheme) and is rejected.
_URL_ATTRS = {
    "src", "href", "poster", "data", "action", "formaction", "background",
    "cite", "longdesc", "usemap", "manifest", "codebase", "xlink:href",
}

_URL_IN_CSS = re.compile(r"url\(\s*['\"]?\s*([^'\")]+)", re.IGNORECASE)


# ───────────────────────────────────────────────────────────────
# 2. HELPERS
# ───────────────────────────────────────────────────────────────

def _directive_set(csp: str) -> Set[str]:
    out: Set[str] = set()
    for directive in csp.split(";"):
        norm = " ".join(directive.split())
        if norm:
            out.add(norm)
    return out


def _url_is_local(value: Optional[str]) -> bool:
    """A URL is self-contained iff empty, a `data:` URI, or a same-document fragment."""
    if value is None:
        return True
    v = value.strip()
    if v == "" or v.startswith("#"):
        return True
    return v.lower().startswith("data:")


def _css_problems(css: str, where: str) -> List[str]:
    problems: List[str] = []
    if "@import" in css.lower():
        problems.append(f"CSS @import (external stylesheet) in {where}")
    for target in _URL_IN_CSS.findall(css):
        if not _url_is_local(target):
            problems.append(f"CSS url({target.strip()[:48]}…) references a non-data resource in {where}")
    return problems


# ───────────────────────────────────────────────────────────────
# 3. HTML SAFETY PARSER
# ───────────────────────────────────────────────────────────────

class _SafetyParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.problems: List[str] = []
        self.saw_html_lang = False
        self.saw_doctype = False
        self.csp_content: Optional[str] = None
        self._in_style = False

    def handle_decl(self, decl: str) -> None:
        if decl.strip().lower().startswith("doctype html"):
            self.saw_doctype = True

    def _tag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]) -> None:
        low = tag.lower()
        adict = {name.lower(): val for name, val in attrs}

        if low == "script":
            self.problems.append("contains a <script> tag (must be zero-JavaScript)")
        if low == "html" and "lang" in adict:
            self.saw_html_lang = True
        if low == "meta":
            equiv = (adict.get("http-equiv") or "").strip().lower()
            if equiv == "content-security-policy":
                self.csp_content = adict.get("content") or ""
        if low == "style":
            self._in_style = True

        for name, val in attrs:
            lname = name.lower()
            if lname.startswith("on"):
                self.problems.append(f"inline event handler '{lname}=' on <{low}>")
            if lname == "style" and val:
                self.problems.extend(_css_problems(val, f"inline style on <{low}>"))
            if lname == "srcset" and val:
                for candidate in val.split(","):
                    url = candidate.strip().split(" ")[0]
                    if not _url_is_local(url):
                        self.problems.append(f"remote srcset '{url[:48]}…' on <{low}>")
            if lname in _URL_ATTRS and not _url_is_local(val):
                self.problems.append(f"external reference {lname}='{(val or '')[:48]}…' on <{low}>")

    def handle_starttag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]) -> None:
        self._tag(tag, attrs)

    def handle_startendtag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]) -> None:
        self._tag(tag, attrs)

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "style":
            self._in_style = False

    def handle_data(self, data: str) -> None:
        if self._in_style:
            self.problems.extend(_css_problems(data, "<style> block"))


# ───────────────────────────────────────────────────────────────
# 4. VALIDATION
# ───────────────────────────────────────────────────────────────

def validate(path: Path) -> List[str]:
    html = path.read_text(encoding="utf-8", errors="replace")
    parser = _SafetyParser()
    parser.feed(html)
    parser.close()

    problems = list(parser.problems)

    if not parser.saw_doctype:
        problems.append("missing <!doctype html> preamble")
    if not parser.saw_html_lang:
        problems.append("missing <html lang=...> for accessibility")
    if parser.csp_content is None:
        problems.append("missing Content-Security-Policy meta tag")
    else:
        found = _directive_set(parser.csp_content)
        if found != REQUIRED_CSP_DIRECTIVES:
            missing = REQUIRED_CSP_DIRECTIVES - found
            extra = found - REQUIRED_CSP_DIRECTIVES
            detail = []
            if missing:
                detail.append("missing/weakened: " + "; ".join(sorted(missing)))
            if extra:
                detail.append("unexpected: " + "; ".join(sorted(extra)))
            problems.append("Content-Security-Policy does not match the required policy (" +
                            " | ".join(detail) + ")")

    # De-duplicate while preserving order (a report may repeat the same hazard).
    seen: Set[str] = set()
    unique: List[str] = []
    for p in problems:
        if p not in seen:
            seen.add(p)
            unique.append(p)
    return unique


# ───────────────────────────────────────────────────────────────
# 5. COMMAND-LINE INTERFACE
# ───────────────────────────────────────────────────────────────

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
