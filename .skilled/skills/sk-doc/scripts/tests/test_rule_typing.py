#!/usr/bin/env python3
"""
Regression tests for how validate_document.py types and checks a repository
rule file under repo-rules/.

A rule file opens with two unnumbered sections, Fires when and The rule, and
closes with a self-check. Without its own type it fell back to README rules
and failed for a missing Overview.

Run: python3 -m pytest -q test_rule_typing.py
"""

import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(SCRIPTS_DIR))

from validate_document import detect_document_type, load_rules, validate_document  # type: ignore

RULE = """---
title: "Rule: Example"
description: "One clause, expanded."
---

# Rule: Example

## Fires when

- An agent is about to act.

## The rule

**Do the one thing.**

## 1. WHY

Because it matters.

## 2. SELF-CHECK

- [ ] I did the one thing.
"""


def test_a_rule_file_gets_the_rule_type_and_its_readme_does_not() -> None:
    rules = load_rules()
    assert detect_document_type(".skilled/repo-rules/scope-discipline.md", "", rules) == "rule"
    assert detect_document_type(".skilled/repo-rules/README.md", "", rules) == "readme"


def test_a_complete_rule_file_passes(tmp_path: Path) -> None:
    rule = tmp_path / "repo-rules" / "example.md"
    rule.parent.mkdir()
    rule.write_text(RULE, encoding="utf-8")

    result = validate_document(str(rule), rules=load_rules())

    assert result["document_type"] == "rule"
    assert result["blocking_errors"] == []


def test_a_rule_file_without_its_trigger_section_fails(tmp_path: Path) -> None:
    rule = tmp_path / "repo-rules" / "example.md"
    rule.parent.mkdir()
    rule.write_text(RULE.replace("## Fires when\n\n- An agent is about to act.\n\n", ""), encoding="utf-8")

    result = validate_document(str(rule), rules=load_rules())

    assert [e["message"] for e in result["blocking_errors"]] == ["Missing required section: fires_when"]
