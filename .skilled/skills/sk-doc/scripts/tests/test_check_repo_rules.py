#!/usr/bin/env python3
"""Tests for sk-create-repo-rule's check-repo-rules.cjs run against fixture trees through --root."""

import subprocess
from pathlib import Path

CHECKER = Path(__file__).resolve().parents[2] / "sk-create-repo-rule" / "scripts" / "check-repo-rules.cjs"

RULE = """---
title: "Rule: Alpha"
description: "Alpha settles deploys."
trigger_phrases:
  - "alpha deploy"
importance_tier: "normal"
contextType: "general"
version: 1.0.0
---
# Rule: Alpha

## Fires when

- About to deploy a service.
- You notice a stale comment outside the files in scope.

## The rule

**Deploy carefully.**

## 1. BODY

Text.

---
"""

TRIGGER_ITEMS = "Deploy a service · notice a stale comment outside scope"


def make_tree(root: Path, trigger_items: str = TRIGGER_ITEMS) -> Path:
    rules = root / ".skilled" / "repo-rules"
    rules.mkdir(parents=True)
    (rules / "alpha.md").write_text(RULE)
    link = "[`alpha.md`](.skilled/repo-rules/alpha.md)"
    (root / "REPO RULES.md").write_text(
        "# REPO RULES\n\n"
        "## 2. TRIGGER TABLE\n\n"
        "| You are about to… | Load | It settles |\n|---|---|---|\n"
        f"| {trigger_items} | {link} | Deploys |\n\n---\n\n"
        "## 3. INDEX\n\n"
        "| Rule | Summary |\n|---|---|\n"
        f"| {link} | Alpha settles deploys. |\n\n---\n"
    )
    return root


def run(root: Path) -> subprocess.CompletedProcess:
    return subprocess.run(["node", str(CHECKER), "--root", str(root)], capture_output=True, text=True)


def test_covered_bullets_pass_every_check(tmp_path: Path) -> None:
    result = run(make_tree(tmp_path))

    assert result.returncode == 0, result.stdout + result.stderr
    assert "10/11 PASS fires-when coverage" in result.stdout
    assert "11/11 PASS card sync" in result.stdout
    assert "no cards directory" in result.stdout
    assert "RESULT: PASSED (11/11 checks)" in result.stdout


def test_removing_a_router_item_fails_check_ten_with_rule_bullet_and_line(tmp_path: Path) -> None:
    result = run(make_tree(tmp_path, trigger_items="Deploy a service"))

    assert result.returncode == 1
    line = next(row for row in result.stdout.splitlines() if "fires-when coverage" in row)
    assert "FAIL" in line
    assert 'alpha.md: "You notice a stale comment outside the files in scope." has no counterpart in router line 7' in line
    assert "deploy a service" not in line.lower()


def test_root_without_a_router_is_an_error(tmp_path: Path) -> None:
    result = run(tmp_path)

    assert result.returncode == 2
    assert "no REPO RULES.md" in result.stderr


def test_trigger_row_linking_a_card_credits_its_rule(tmp_path: Path) -> None:
    root = make_tree(tmp_path)
    rule = root / ".skilled" / "repo-rules" / "alpha.md"
    rule.write_text(rule.read_text() + "\n## 2. SELF-CHECK\n\n- [ ] The deploy was careful.\n\n---\n")
    builder = CHECKER.parent / "build-rule-cards.cjs"
    subprocess.run(["node", str(builder), "--root", str(root)], check=True, capture_output=True)
    router = root / "REPO RULES.md"
    router.write_text(router.read_text().replace(
        "| [`alpha.md`](.skilled/repo-rules/alpha.md) | Deploys |",
        "| [`alpha.md`](.skilled/repo-rules/cards/alpha.md) | Deploys |"))

    result = run(root)

    assert result.returncode == 0, result.stdout + result.stderr
    assert "row coverage" in result.stdout and "all links resolve" in result.stdout
    assert "bullets=2 every bullet has a router counterpart" in result.stdout
