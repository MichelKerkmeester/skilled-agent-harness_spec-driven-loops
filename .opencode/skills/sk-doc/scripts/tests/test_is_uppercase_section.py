#!/usr/bin/env python3
"""
Table-driven regression tests for is_uppercase_section, the ALL-CAPS H2 gate.

The gate polices prose words only. Code spans, parenthetical annotations,
function-call args, and link destinations are removed before the check; code
identifiers (camelCase) and product/acronym names (PascalCase, OAuth, PDFs) are
accepted as-is. It must reject Title-Case, lowercase, and scrambled mixed-case
words, and it must NOT reject valid headers that carry nested parentheses,
autolinks, or a URL that itself contains parentheses.

Run: python3 test_is_uppercase_section.py   (exit 0 = all pass)
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from validate_document import is_uppercase_section  # noqa: E402

# (header text, expected result)
CASES = [
    # ALL-CAPS prose passes, including punctuation and emoji/number prefixes.
    ("OVERVIEW", True),
    ("INSTALLATION & SETUP", True),
    ("WHAT'S NEXT?", True),
    ("1. 📖 MCP TOOLS", True),

    # Title-Case, lowercase, and scrambled mixed-case must fail.
    ("Overview", False),
    ("Quick Start", False),
    ("pseudocode", False),
    ("Worked Examples", False),
    ("oVERVIEW", False),          # scrambled mixed-case must not bypass the gate
    ("tITLE cASE", False),

    # Code spans, parentheticals, and function args are removed before checking.
    ("MODE DETECTION (`SP-001..SP-004`)", True),
    ("CAPABILITY MATRIX (image input)", True),      # lowercase inside parens is exempt
    ("SUMMARY OF `renderBlocks`", True),
    ("animate(target, keyframes, options) - VALUE, KEYFRAME ARRAY", True),
    ("scroll() - SCROLL-LINKED ANIMATIONS", True),

    # Nested parentheses and autolinks must not produce false positives.
    ("API (legacy (v2) only)", True),
    ("API <https://example.com/docs>", True),
    ("[API](https://example.com/docs_(v2)-guide) OVERVIEW", True),

    # Bare code identifiers and product/acronym names are exempt.
    ("DEPTH LOOP renderBlocks", True),
    ("STATE gate3Precedence", True),
    ("USE OAuth AND PDFs", True),
    ("BUILT WITH JavaScript AND OpenCode", True),
    ("SUPPORT MiMo", True),
    ("BUILD FOR iOS", True),

    # A single-hump capitalized word is Title-Case, not a product name.
    ("Renderer", False),
    ("Github", False),
]


def run() -> int:
    failures = []
    for text, expected in CASES:
        got = is_uppercase_section(text)
        if got != expected:
            failures.append((text, expected, got))
    for text, expected, got in failures:
        print(f"  FAIL: is_uppercase_section({text!r}) = {got}, expected {expected}")
    print(f"{len(CASES) - len(failures)}/{len(CASES)} passed")
    return 1 if failures else 0


def test_is_uppercase_section():
    """pytest entry point."""
    assert run() == 0


if __name__ == "__main__":
    sys.exit(run())
