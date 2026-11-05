#!/usr/bin/env python3
"""
Regression tests for the format-spec exclusion in validate_document.py.

The DESIGN.md format spec and its sample outputs number their sections with the
format's own ids, which the generator cites, so the validator skips them rather
than ask for a renumber. The match is on the path suffix, so a sibling file in
the same examples folder is still validated.

Run: python3 -m pytest -q test_format_spec_exclusion.py
"""

import sys
from pathlib import Path

TESTS = Path(__file__).resolve().parent
REPO = TESTS.parents[4]
GENERATOR = REPO / ".skilled/skills/sk-design/sk-design-md-generator/references"

sys.path.insert(0, str(TESTS.parent))
from validate_document import should_exclude_path  # noqa: E402


def test_format_spec_and_samples_are_skipped():
    for path in (
        GENERATOR / "design-md-format.md",
        GENERATOR / "examples/stripe/DESIGN.md",
    ):
        skipped, reason = should_exclude_path(str(path))
        assert skipped is True, path
        assert reason.startswith("Format spec")


def test_sibling_in_examples_folder_is_still_validated():
    path = GENERATOR / "examples/stripe/writing-notes.md"
    assert should_exclude_path(str(path)) == (False, None)
