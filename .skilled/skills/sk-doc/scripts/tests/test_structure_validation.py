#!/usr/bin/env python3
"""Tests for staged general-document structure enforcement."""

from __future__ import annotations

import sys
from pathlib import Path

TESTS = Path(__file__).resolve().parent
REPO = TESTS.parents[4]
SCRIPTS = REPO / ".opencode/skills/sk-doc/shared/scripts"
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
