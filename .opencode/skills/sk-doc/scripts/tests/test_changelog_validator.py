#!/usr/bin/env python3
"""Regression tests for changelog document type detection."""

import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent.parent
REPO_ROOT = Path(__file__).resolve().parents[5]
sys.path.insert(0, str(SCRIPTS_DIR))

from validate_document import detect_document_type, load_rules, validate_document  # type: ignore


def test_changelog_paths_detect_as_changelog() -> None:
    rules = load_rules()

    paths = [
        ".opencode/skills/example-skill/changelog/v1.0.0.0.md",
        ".opencode/changelog/example-component/v2.5.0.0.md",
    ]

    for path in paths:
        assert detect_document_type(path, "", rules) == "changelog"


def test_real_skill_changelog_has_no_blocking_errors() -> None:
    changelog_path = REPO_ROOT / ".opencode/skills/deep-loop-workflows/deep-ai-council/changelog/v1.0.0.0.md"

    result = validate_document(str(changelog_path), rules=load_rules())

    assert result["document_type"] == "changelog"
    assert result["blocking_errors"] == []
