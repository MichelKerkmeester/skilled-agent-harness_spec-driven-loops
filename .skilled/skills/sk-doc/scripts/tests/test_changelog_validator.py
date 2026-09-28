#!/usr/bin/env python3
"""Regression tests for changelog document type detection."""

import sys
from pathlib import Path
from typing import List

SCRIPTS_DIR = Path(__file__).resolve().parent.parent
REPO_ROOT = Path(__file__).resolve().parents[5]
sys.path.insert(0, str(SCRIPTS_DIR))

from validate_document import detect_document_type, load_rules, should_exclude_path, validate_document  # type: ignore


def test_changelog_paths_detect_as_changelog() -> None:
    rules = load_rules()

    paths = [
        ".skilled/skills/example-skill/changelog/v1.0.0.0.md",
        ".skilled/changelog/example-component/v2.5.0.0.md",
    ]

    for path in paths:
        assert detect_document_type(path, "", rules) == "changelog"


def test_real_skill_changelog_has_no_blocking_errors() -> None:
    changelog_path = REPO_ROOT / ".skilled/skills/system-deep-loop/deep-ai-council/changelog/v1.0.0.0.md"

    result = validate_document(str(changelog_path), rules=load_rules())

    assert result["document_type"] == "changelog"
    assert result["blocking_errors"] == []


COMPLETE_ENTRY = """---
title: "example-skill v1.2.0.0"
description: "An example release that adds one small feature to the tool."
trigger_phrases:
  - "example-skill v1.2.0.0"
  - "example-skill 1.2.0.0"
  - "example feature"
importance_tier: "normal"
contextType: "general"
---

An example release narrative.
"""


def _entry(tmp_path: Path, name: str, text: str) -> Path:
    entry = tmp_path / "changelog" / name
    entry.parent.mkdir(parents=True, exist_ok=True)
    entry.write_text(text, encoding="utf-8")
    return entry


def _blocking(path: Path) -> List[str]:
    result = validate_document(str(path), rules=load_rules())
    return [error["type"] for error in result["blocking_errors"]]


def test_entry_without_frontmatter_is_blocked(tmp_path: Path) -> None:
    entry = _entry(tmp_path, "v1.2.0.0.md", "An example release narrative.\n")

    assert "changelog_frontmatter_missing" in _blocking(entry)


def test_entry_with_complete_frontmatter_passes(tmp_path: Path) -> None:
    entry = _entry(tmp_path, "v1.2.0.0.md", COMPLETE_ENTRY)

    assert _blocking(entry) == []


def test_entry_missing_a_canonical_key_is_blocked(tmp_path: Path) -> None:
    entry = _entry(tmp_path, "changelog-001-root.md", COMPLETE_ENTRY.replace('importance_tier: "normal"\n', ""))

    assert _blocking(entry) == ["changelog_frontmatter_missing_field"]


def test_version_entry_without_its_version_phrase_is_blocked(tmp_path: Path) -> None:
    text = COMPLETE_ENTRY.replace('  - "example-skill v1.2.0.0"\n  - "example-skill 1.2.0.0"\n', "")
    entry = _entry(tmp_path, "v1.2.0.0.md", text)

    assert _blocking(entry) == ["changelog_version_phrase_missing"]


def test_readme_in_a_changelog_folder_is_not_an_entry(tmp_path: Path) -> None:
    readme = _entry(tmp_path, "README.md", "Notes about the folder, with no frontmatter.\n")

    assert not [error for error in _blocking(readme) if error.startswith("changelog_")]


def test_entry_named_for_install_guides_is_checked_as_a_changelog(tmp_path: Path) -> None:
    entry = _entry(tmp_path, "changelog-003-003-install-guide-docs.md", COMPLETE_ENTRY)

    result = validate_document(str(entry), rules=load_rules())

    assert result["document_type"] == "changelog"
    assert result["blocking_errors"] == []


def test_entry_in_a_numbered_folder_ending_in_fixtures_is_checked(tmp_path: Path) -> None:
    entry = _entry(tmp_path, "001-contracts-and-fixtures/changelog-001-contracts.md", "An entry with no frontmatter.\n")

    assert "changelog_frontmatter_missing" in _blocking(entry)


def test_install_guides_and_fixture_trees_keep_their_handling() -> None:
    assert detect_document_type(".skilled/skills/example-skill/INSTALL-GUIDE.md", "", load_rules()) == "install_guide"
    assert should_exclude_path(".skilled/skills/example-skill/tests/fixtures/sample.md")[0] is True
    assert should_exclude_path(".skilled/skills/example-skill/tests/test-fixtures/sample.md")[0] is True
