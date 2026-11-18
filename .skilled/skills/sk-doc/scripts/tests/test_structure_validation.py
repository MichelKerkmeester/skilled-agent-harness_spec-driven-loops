#!/usr/bin/env python3
"""Tests for staged general-document structure enforcement."""

from __future__ import annotations

import sys
from pathlib import Path

TESTS = Path(__file__).resolve().parent
REPO = TESTS.parents[4]
SCRIPTS = REPO / ".skilled/skills/sk-doc/shared/scripts"
sys.path.insert(0, str(SCRIPTS))

from validate_document import load_rules, validate_document  # type: ignore  # noqa: E402


def validate(path: Path, doc_type: str) -> dict:
    return validate_document(
        str(path),
        doc_type=doc_type,
        rules=load_rules(),
        skip_exclusions=True,
    )


def issue_types(result: dict) -> set[str]:
    return {item["type"] for item in result.get("blocking_errors", [])}


def test_missing_divider_is_detected(monkeypatch) -> None:
    monkeypatch.setenv("SKDOC_ENFORCE_STRUCTURE", "1")
    result = validate(TESTS / "structure/negative/missing-divider.md", "readme")

    assert "general_h2_separator" in issue_types(result)
    assert sum(item["type"] == "general_h2_separator" for item in result["blocking_errors"]) == 1


def test_all_dividers_present_do_not_fire(monkeypatch) -> None:
    monkeypatch.setenv("SKDOC_ENFORCE_STRUCTURE", "1")
    result = validate(TESTS / "structure/positive/all-dividers.md", "readme")

    assert "general_h2_separator" not in issue_types(result)


def test_divider_check_ignores_fences_comments_and_h3(monkeypatch, tmp_path: Path) -> None:
    monkeypatch.setenv("SKDOC_ENFORCE_STRUCTURE", "1")
    path = tmp_path / "reference.md"
    path.write_text(
        """# Structure Edge Cases

---

## 1. OVERVIEW

### Details

```markdown
## 99. EXAMPLE ONLY
```

---

<!-- ANCHOR:second -->
## 2. SECOND SECTION

Content.
""",
        encoding="utf-8",
    )

    result = validate(path, "reference")

    assert "general_h2_separator" not in issue_types(result)


def test_navigation_rules_apply_to_readme_and_skill_but_not_spec(monkeypatch, tmp_path: Path) -> None:
    monkeypatch.setenv("SKDOC_ENFORCE_STRUCTURE", "1")
    readme = tmp_path / "README.md"
    readme.write_text(
        """# README

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)

---

## 1. OVERVIEW

<!-- ANCHOR:overview -->
Content.
""",
        encoding="utf-8",
    )
    skill = tmp_path / "SKILL.md"
    skill.write_text(
        """# SKILL

---

## TABLE OF CONTENTS

- [1. WHEN TO USE](#1--when-to-use)

---

## 1. WHEN TO USE

Content.

---

## 2. SMART ROUTING

Content.

---

## 3. HOW IT WORKS

Content.

---

## 4. RULES

<!-- ANCHOR:rules -->
Content.
""",
        encoding="utf-8",
    )
    spec = tmp_path / "spec.md"
    spec.write_text(
        """# Spec

<!-- ANCHOR:metadata -->
## 1. METADATA

Content.
<!-- /ANCHOR:metadata -->
""",
        encoding="utf-8",
    )

    for path, doc_type in ((readme, "readme"), (skill, "skill")):
        result = validate(path, doc_type)
        types = issue_types(result)
        assert {"general_no_toc", "general_no_anchor"}.issubset(types)

    spec_result = validate(spec, "spec")
    assert not issue_types(spec_result) & {
        "general_h2_separator",
        "general_no_toc",
        "general_no_anchor",
    }


def test_untyped_document_reports_readme_fallback(tmp_path: Path) -> None:
    path = tmp_path / "notes.md"
    path.write_text("# Notes\n\nPlain notes that no document type rule claims.\n", encoding="utf-8")

    result = validate_document(str(path), doc_type=None, rules=load_rules(), skip_exclusions=True)
    explicit = validate_document(str(path), doc_type="readme", rules=load_rules(), skip_exclusions=True)
    fallback_warnings = [
        item for item in result["warnings"] if item["type"] == "document_type_fallback"
    ]

    assert result["document_type"] == "readme"
    assert len(fallback_warnings) == 1
    assert "--type" in fallback_warnings[0]["fix_hint"]
    assert (result["valid"], result["exit_code"]) == (explicit["valid"], explicit["exit_code"])


def test_typed_or_named_readme_gets_no_fallback(tmp_path: Path) -> None:
    body = "# Notes\n\nPlain notes that no document type rule claims.\n"
    notes = tmp_path / "notes.md"
    notes.write_text(body, encoding="utf-8")
    readme = tmp_path / "README.md"
    readme.write_text(body, encoding="utf-8")

    typed = validate_document(str(notes), doc_type="readme", rules=load_rules(), skip_exclusions=True)
    named = validate_document(str(readme), doc_type=None, rules=load_rules(), skip_exclusions=True)

    assert typed["document_type"] == "readme"
    assert named["document_type"] == "readme"
    assert not any(item["type"] == "document_type_fallback" for item in typed["warnings"])
    assert not any(item["type"] == "document_type_fallback" for item in named["warnings"])


SPACED_README = """# Project

## 1. OVERVIEW

Content.

&nbsp;

## 2. SETUP

Content.
"""


def test_repo_root_readme_is_exempt_from_the_divider_rule(monkeypatch, tmp_path: Path) -> None:
    monkeypatch.setenv("SKDOC_ENFORCE_STRUCTURE", "1")
    (tmp_path / ".git").mkdir()
    root = tmp_path / "README.md"
    root.write_text(SPACED_README, encoding="utf-8")
    nested = tmp_path / "docs" / "README.md"
    nested.parent.mkdir()
    nested.write_text(SPACED_README, encoding="utf-8")

    assert "general_h2_separator" not in issue_types(validate(root, "readme"))
    assert "general_h2_separator" in issue_types(validate(nested, "readme"))


def test_repo_root_guides_are_exempt_from_the_divider_rule(monkeypatch, tmp_path: Path) -> None:
    monkeypatch.setenv("SKDOC_ENFORCE_STRUCTURE", "1")
    (tmp_path / ".git").mkdir()
    guide = tmp_path / "INSTALL-SKILLED.md"
    guide.write_text(SPACED_README, encoding="utf-8")
    cross_cli = tmp_path / ".skilled" / "CROSS-CLI.md"
    cross_cli.parent.mkdir()
    cross_cli.write_text(SPACED_README, encoding="utf-8")
    other = tmp_path / "NOTES.md"
    other.write_text(SPACED_README, encoding="utf-8")

    assert "general_h2_separator" not in issue_types(validate(guide, "readme"))
    assert "general_h2_separator" not in issue_types(validate(cross_cli, "readme"))
    assert "general_h2_separator" in issue_types(validate(other, "readme"))


def test_repo_root_readme_keeps_the_full_divider_score(tmp_path: Path) -> None:
    from extract_structure import extract_structure  # type: ignore

    (tmp_path / ".git").write_text("gitdir: elsewhere\n", encoding="utf-8")
    root = tmp_path / "README.md"
    root.write_text(SPACED_README, encoding="utf-8")
    nested = tmp_path / "docs" / "README.md"
    nested.parent.mkdir()
    nested.write_text(SPACED_README, encoding="utf-8")

    assert extract_structure(str(root))["dqi"]["breakdown"]["divider_score"] == 6
    assert extract_structure(str(nested))["dqi"]["breakdown"]["divider_score"] == 0


GOOD_FOLD = """<details>
<summary>All hook entries</summary>

| File | Role |
|---|---|
| `a.mjs` | Guard |

</details>
"""


def test_a_closed_fold_and_fold_mentions_pass() -> None:
    from validate_document import validate_folds  # type: ignore

    text = (
        GOOD_FOLD
        + "\nA fold opens with `<details>` and closes with `</details>`.\n\n"
        + "```markdown\n<details>\n<summary>Shown, not folded</summary>\n```\n"
    )

    assert validate_folds(text) == []


def test_each_broken_fold_shape_is_reported() -> None:
    from validate_document import validate_folds  # type: ignore

    cases = {
        "fold_unclosed": GOOD_FOLD.replace("</details>\n", ""),
        "fold_stray_close": "Text.\n\n</details>\n",
        "fold_summary_missing": GOOD_FOLD.replace("<summary>All hook entries</summary>\n", ""),
        "fold_summary_spacing": GOOD_FOLD.replace("</summary>\n\n", "</summary>\n"),
    }

    for rule_id, text in cases.items():
        assert [issue["rule_id"] for issue in validate_folds(text)] == [rule_id], rule_id


def test_a_mermaid_fence_blocks_a_readme(tmp_path: Path) -> None:
    path = tmp_path / "README.md"

    for opener, closer in (("```mermaid", "```"), ("~~~mermaid", "~~~"), ("```Mermaid", "```")):
        path.write_text(
            f"# Folder: Holds Hooks\n\n{opener}\nflowchart TD\n  A --> B\n{closer}\n",
            encoding="utf-8",
        )

        result = validate(path, "readme")

        assert "readme_mermaid" in issue_types(result), opener
        assert result["valid"] is False, opener


def test_mermaid_passes_outside_a_readme_and_inside_an_example(tmp_path: Path) -> None:
    other = tmp_path / "notes.md"
    other.write_text("# Notes\n\n```mermaid\nflowchart TD\n  A --> B\n```\n", encoding="utf-8")
    example = tmp_path / "README.md"
    example.write_text(
        "# Folder: Holds Hooks\n\n````markdown\n```mermaid\nflowchart TD\n```\n````\n",
        encoding="utf-8",
    )

    assert "readme_mermaid" not in issue_types(validate(other, "readme"))
    assert "readme_mermaid" not in issue_types(validate(example, "readme"))


def test_an_unclosed_fold_blocks_a_readme(tmp_path: Path) -> None:
    path = tmp_path / "README.md"
    path.write_text("# Folder: Holds Hooks\n\n" + GOOD_FOLD.replace("</details>\n", ""), encoding="utf-8")

    result = validate(path, "readme")

    assert "fold_unclosed" in issue_types(result)
    assert result["valid"] is False
