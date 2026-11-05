#!/usr/bin/env python3
"""
Table-driven regression tests for the H2 numbering check in validate_h2_headers.

A document may open on a deliberate section 0, such as a contract that must be
read before section 1, so the sequence may start at 0 or 1. Every later
section must still add one, and a sequence that starts anywhere else, or that
skips a number after a section 0, still warns.

Run: python3 test_h2_numbering_start.py   (exit 0 = all pass)
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from validate_document import validate_h2_headers  # noqa: E402

RULES = {'h2EmojiRequired': False}

# (section numbers in document order, expected count of numbering warnings)
CASES = [
    ([1, 2, 3], 0),
    ([0, 1, 2], 0),        # a deliberate section 0 starts the sequence
    ([0, 2, 3], 1),        # a skip after section 0 still warns
    ([2, 3], 1),           # a sequence may not start above 1
    ([1, 0, 2], 2),        # a 0 after section 1 is out of order
]


def numbering_warnings(numbers):
    content = "\n\n".join(f"## {n}. SECTION {n}\n\nText." for n in numbers)
    issues = validate_h2_headers(content, RULES, {})
    return sum(1 for issue in issues if issue['type'] == 'non_sequential_numbering')


def main():
    failures = 0
    for numbers, expected in CASES:
        got = numbering_warnings(numbers)
        if got != expected:
            failures += 1
            print(f"FAIL {numbers}: expected {expected} warning(s), got {got}")
    print(f"{len(CASES) - failures}/{len(CASES)} cases passed")
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(main())
