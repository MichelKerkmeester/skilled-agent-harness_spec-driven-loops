#!/usr/bin/env python3
"""
Table-driven regression tests for the bare-URL render check.

A badge is an image inside a link, so its image URL sits in a link target and
must not read as bare. A URL in running text, or in a link-free blockquote,
still warns.

Run: python3 test_bare_url_badge.py   (exit 0 = all pass)
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from validate_document import _render_bare_url  # noqa: E402

# (line, expected warning)
CASES = [
    ('[![Stars](https://img.shields.io/x?style=a)](https://github.com/a/b)', False),
    ('[![License](https://img.shields.io/l)](LICENSE)', False),
    ('![diagram](https://example.com/d.png)', False),
    ('[docs](https://example.com)', False),
    ('> Like it? https://example.com/coffee', True),
    ('See https://example.com for more.', True),
]


def main():
    failures = 0
    for line, expected in CASES:
        got = bool(_render_bare_url([line], set()))
        if got != expected:
            failures += 1
            print(f"FAIL {line!r}: expected warning={expected}, got {got}")
    print(f"{len(CASES) - failures}/{len(CASES)} cases passed")
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(main())
