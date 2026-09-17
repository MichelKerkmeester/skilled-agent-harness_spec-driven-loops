#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: CREATE-DIFF REPORT SAFETY VALIDATOR (SK-DOC)
# ───────────────────────────────────────────────────────────────

"""Assert a create-diff HTML report is safe and self-contained.

A generated report is meant to open from `file://` with no network access and no
scripts. The create-diff renderer emits ONE fixed HTML dialect, so this gate is an
allowlist for exactly that dialect rather than a denylist of known-bad constructs:
a PASS means the document uses only the expected elements and attributes, carries
exactly the required Content-Security-Policy as an early `<head>` child, and
references nothing external. An allowlist is what makes "PASS implies inert and
self-contained" true even against a drifted producer or a hand-edited report — a
denylist is always one unknown construct behind. Exit 0 = pass, 1 = fail.

Safety model: the parser only reacts to REAL markup. A document containing hostile
*text* (for example ``<img onerror=...>`` pasted into the source) is escaped by the
renderer to ``&lt;img onerror=...&gt;`` and reaches the parser as inert character
data, never as a tag — so it is correctly ignored. Only genuine tags, attributes,
and ``<style>`` content are inspected.
"""

from __future__ import annotations

import sys
from html.parser import HTMLParser
from pathlib import Path
from typing import List, Optional, Set, Tuple

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

# The one CSP the renderer is allowed to ship, compared as a normalized directive
# set so ordering and incidental ASCII whitespace do not matter but a weakened
# directive does.
REQUIRED_CSP_DIRECTIVES: Set[str] = {
    "default-src 'none'",
    "style-src 'unsafe-inline'",
    "img-src data:",
    "base-uri 'none'",
    "form-action 'none'",
}

# Every element the create-diff renderer emits. Anything outside this set —
# <script>, <iframe>, <object>, <embed>, media, form controls, SVG/MathML — is
# rejected structurally, so no active or fetching element can slip through.
ALLOWED_TAGS: Set[str] = {
    "html", "head", "meta", "title", "style", "body", "main", "header",
    "footer", "section", "div", "h1", "h2", "p", "a", "span", "strong",
    "mark", "ul", "li", "table", "caption", "colgroup", "col", "thead",
    "tbody", "tr", "th", "td",
}

# Every attribute the renderer emits. Because this is an allowlist, every unlisted
# attribute is rejected — which covers inline event handlers (`on*`), `style`,
# `srcset`/`imagesrcset`, `ping`, `srcdoc`, `src`, `data`, and any other
# URL-bearing or active attribute without needing to enumerate them.
ALLOWED_ATTRS: Set[str] = {
    "lang", "charset", "name", "content", "http-equiv", "class", "href",
    "id", "scope", "colspan", "aria-labelledby", "aria-label", "aria-hidden",
    "role", "tabindex",
}

# The renderer's only URL-bearing attribute is `href`, always a same-document
# fragment. A value that is not empty and not a `#fragment` (a remote/relative
# reference, a `data:` URI, or a `javascript:` scheme) breaks self-containment.
_URL_ATTRS: Set[str] = {"href"}

# ASCII whitespace per the CSP grammar (tab, LF, FF, CR, space). CSP tokenizes on
# these only; Python's str.split() would also split on Unicode whitespace, which a
# browser treats as part of an (unknown) directive — a validator/browser split.
_CSP_ASCII_WS = "\t\n\f\r "


# ───────────────────────────────────────────────────────────────
# 2. HELPERS
# ───────────────────────────────────────────────────────────────

def _directive_set(csp: str) -> Tuple[Optional[Set[str]], Optional[str]]:
    """Tokenize a CSP policy with CSP's ASCII grammar.

    Returns (directive_set, error). The error is set when the policy contains any
    non-ASCII or ASCII-control character, because such a policy can normalize to the
    expected set in Python while a browser reads a different (unknown) directive.
    """
    for ch in csp:
        if ord(ch) > 0x7E or (ord(ch) < 0x20 and ch not in _CSP_ASCII_WS):
            return None, f"contains a non-ASCII or control character (U+{ord(ch):04X})"
    out: Set[str] = set()
    for directive in csp.split(";"):
        norm = " ".join(directive.split())  # ASCII-safe after the guard above
        if norm:
            out.add(norm)
    return out, None


def _href_is_local(value: Optional[str]) -> bool:
    """An href is self-contained iff empty or a same-document `#fragment`."""
    if value is None:
        return True
    v = value.strip()
    return v == "" or v.startswith("#")


def _style_problems(css: str, where: str) -> List[str]:
    """Reject any external or active CSS. The emitter's stylesheet uses neither
    `url()` nor `@import`, so both are rejected outright."""
    problems: List[str] = []
    low = css.lower()
    if "@import" in low:
        problems.append(f"CSS @import (external stylesheet) in {where}")
    if "url(" in low:
        problems.append(f"CSS url() reference in {where}")
    if "expression(" in low:
        problems.append(f"CSS expression() in {where}")
    return problems


# ───────────────────────────────────────────────────────────────
# 3. HTML ALLOWLIST PARSER
# ───────────────────────────────────────────────────────────────

class _SafetyParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.problems: List[str] = []
        self.saw_html_lang = False
        self.saw_doctype = False
        self.csp_content: Optional[str] = None
        self.csp_count = 0
        self.body_started = False
        self.head_ended = False
        self._in_style = False

    def handle_decl(self, decl: str) -> None:
        if decl.strip().lower().startswith("doctype html"):
            self.saw_doctype = True

    def _tag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]) -> None:
        low = tag.lower()

        if low not in ALLOWED_TAGS:
            self.problems.append(
                f"disallowed element <{low}> (not part of the report dialect)")
            return

        if low == "body":
            self.body_started = True
        if low == "style":
            self._in_style = True

        # Duplicate attribute names create a parser differential: CPython hands the
        # callback every duplicate while the HTML tokenizer keeps only the first.
        names = [name.lower() for name, _ in attrs]
        for dup in sorted({n for n in names if names.count(n) > 1}):
            self.problems.append(f"duplicate attribute '{dup}' on <{low}>")

        adict = {name.lower(): val for name, val in attrs}

        for name in names:
            if name not in ALLOWED_ATTRS:
                self.problems.append(f"disallowed attribute '{name}' on <{low}>")

        if low == "html" and "lang" in adict:
            self.saw_html_lang = True

        if low == "meta":
            equiv = (adict.get("http-equiv") or "").strip().lower()
            if equiv:
                if equiv != "content-security-policy":
                    # Rejects <meta http-equiv="refresh"> (timed navigation) and any
                    # other pragma the CSP does not backstop.
                    self.problems.append(f"disallowed meta http-equiv '{equiv}'")
                else:
                    self.csp_count += 1
                    self.csp_content = adict.get("content") or ""
                    if self.body_started or self.head_ended:
                        self.problems.append(
                            "CSP meta must be a <head> child before <body>")

        for name, val in attrs:
            if name.lower() in _URL_ATTRS and not _href_is_local(val):
                self.problems.append(
                    f"external reference {name.lower()}='{(val or '')[:48]}' on <{low}>")

    def handle_starttag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]) -> None:
        self._tag(tag, attrs)

    def handle_startendtag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]) -> None:
        self._tag(tag, attrs)

    def handle_endtag(self, tag: str) -> None:
        low = tag.lower()
        if low == "style":
            self._in_style = False
        if low == "head":
            self.head_ended = True

    def handle_data(self, data: str) -> None:
        if self._in_style:
            self.problems.extend(_style_problems(data, "<style> block"))


# ───────────────────────────────────────────────────────────────
# 4. VALIDATION
# ───────────────────────────────────────────────────────────────

def validate(path: Path) -> List[str]:
    """Return a list of safety problems; an empty list means the report is safe."""
    html = path.read_text(encoding="utf-8", errors="replace")
    parser = _SafetyParser()
    parser.feed(html)
    parser.close()

    problems = list(parser.problems)

    if not parser.saw_doctype:
        problems.append("missing <!doctype html> preamble")
    if not parser.saw_html_lang:
        problems.append("missing <html lang=...> for accessibility")

    if parser.csp_count == 0:
        problems.append("missing Content-Security-Policy meta tag")
    elif parser.csp_count > 1:
        problems.append(
            f"multiple Content-Security-Policy meta tags ({parser.csp_count})")
    else:
        found, csp_error = _directive_set(parser.csp_content or "")
        if csp_error is not None:
            problems.append(f"Content-Security-Policy {csp_error}")
        elif found != REQUIRED_CSP_DIRECTIVES:
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
    """Validate one or more report files and print a PASS/FAIL line for each.

    Args:
        argv: Report file paths to check.

    Returns:
        0 when every report is safe; 1 when any report is unsafe, missing, or no
        paths were given.
    """
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
