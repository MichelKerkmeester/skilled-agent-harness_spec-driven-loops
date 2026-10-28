#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: DERIVED README COUNT REGRESSIONS
# ───────────────────────────────────────────────────────────────
"""Regression tests for count phrases that do and do not name file categories."""

from __future__ import annotations

import sys
from pathlib import Path

import pytest


SCRIPTS = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS))

import check_derived_readme_counts as counts  # type: ignore  # noqa: E402


COMPOUND_CONCEPTS = [
    "Four decision tests run before anything is written.\n",
    "Five reader tests decide whether the draft earns its load.\n",
    "Two explicit files are required.\n",
    "Three example scripts are documented.\n",
    "6 log files on disk.\n",
]


@pytest.mark.parametrize("line", COMPOUND_CONCEPTS)
def test_compound_concept_phrases_are_not_file_count_claims(line: str) -> None:
    assert counts.line_claims(line) == []


FILE_CATEGORY_COUNTS = [
    ("Holds 12 test files.\n", "test"),
    ("Holds 12 plugin scripts.\n", "plugin"),
    ("Holds 12 shell scripts.\n", "scripts"),
    ("Holds three vitest suites.\n", "suites"),
]


@pytest.mark.parametrize(("line", "term"), FILE_CATEGORY_COUNTS)
def test_file_category_modifiers_remain_countable(line: str, term: str) -> None:
    claims = counts.line_claims(line)

    assert [claim.term for claim in claims] == [term]
