#!/usr/bin/env python3
"""Regression tests for how validate_document.py types SKILL.md scaffold templates.

A skill scaffold lives under a create-skill assets/ tree but is the template a renderer
copies into SKILL.md, so it must be held to the skill section contract rather than the
asset rule, which requires an Overview that no SKILL.md carries. Written asset documents
keep the asset rule and its Overview requirement.

Run: python3 -m pytest -q test_scaffold_template_typing.py
"""

import sys
from pathlib import Path

TESTS_DIR = Path(__file__).resolve().parent
REPO_ROOT = TESTS_DIR.parents[4]
sys.path.insert(0, str(REPO_ROOT / ".skilled/skills/sk-doc/shared/scripts"))

from validate_document import detect_document_type, load_rules, validate_document  # type: ignore

CREATE_SKILL = ".skilled/skills/sk-doc/sk-create-skill"
SCAFFOLDS = (
    f"{CREATE_SKILL}/assets/skill/skill-scaffold-template.md",
    f"{CREATE_SKILL}/assets/parent-skill/scaffold/hub-skill-scaffold.md",
    f"{CREATE_SKILL}/assets/parent-skill/scaffold/packet-skill-scaffold.md",
)


def test_skill_scaffolds_get_the_skill_type() -> None:
    rules = load_rules()
    for scaffold in SCAFFOLDS:
        assert detect_document_type(scaffold, "", rules) == "skill", scaffold


def test_shipped_skill_scaffolds_have_no_blocking_errors() -> None:
    rules = load_rules()
    for scaffold in SCAFFOLDS:
        result = validate_document(
            str(REPO_ROOT / scaffold),
            doc_type=None,
            rules=rules,
            skip_exclusions=True,
        )
        assert result["document_type"] == "skill", scaffold
        assert result["blocking_errors"] == [], (scaffold, result["blocking_errors"])
        assert not any(
            item["type"] == "document_type_fallback" for item in result["warnings"]
        ), scaffold


def test_asset_documents_keep_the_asset_type_and_its_overview_rule(tmp_path: Path) -> None:
    rules = load_rules()
    written = ".skilled/skills/example-skill/assets/reference-notes.md"
    assert detect_document_type(written, "", rules) == "asset"

    # The scaffold word alone does not mark a template: outside an assets tree the file
    # is written documentation and keeps the type its folder gives it.
    assert detect_document_type(
        ".skilled/skills/example-skill/references/scaffold-notes.md", "", rules
    ) == "reference"

    asset = tmp_path / "assets" / "reference-notes.md"
    asset.parent.mkdir(parents=True)
    asset.write_text("# Reference Notes\n\n## 1. SOME NOTES\n\nContent.\n", encoding="utf-8")

    result = validate_document(
        str(asset),
        doc_type=None,
        rules=rules,
        skip_exclusions=True,
    )

    assert result["document_type"] == "asset"
    assert any(
        item["type"] == "missing_required_section" for item in result["blocking_errors"]
    ), result["blocking_errors"]
