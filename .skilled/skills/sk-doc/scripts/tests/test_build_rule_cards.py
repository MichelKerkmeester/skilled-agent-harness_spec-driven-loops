#!/usr/bin/env python3
"""Tests for sk-create-repo-rule's build-rule-cards.cjs and the checker's card sync, run against fixture trees through --root."""

import subprocess
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parents[2] / "sk-create-repo-rule" / "scripts"
CHECKER = SCRIPTS / "check-repo-rules.cjs"
BUILDER = SCRIPTS / "build-rule-cards.cjs"

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

> Routed from [`REPO RULES.md`](../../REPO%20RULES.md). Load before a deploy.
> Expands `AGENTS.md`, never overrides it.

## Fires when

- About to deploy a service.
- You notice a stale comment outside the files in scope.

## The rule

**Deploy carefully.**

Why it matters.

---

## 1. BODY

Text that stays out of the card.

---

## 2. SELF-CHECK

- [ ] The deploy was careful.
"""

CARD = """# Card: Alpha

> Full rule: [`alpha.md`](../alpha.md). Open it when this card does not settle the question.

## Fires when

- About to deploy a service.
- You notice a stale comment outside the files in scope.

## The rule

**Deploy carefully.**

Why it matters.

## SELF-CHECK

- [ ] The deploy was careful.
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


def cards_dir(root: Path) -> Path:
    return root / ".skilled" / "repo-rules" / "cards"


def build(root: Path, *extra: str) -> subprocess.CompletedProcess:
    return subprocess.run(["node", str(BUILDER), "--root", str(root), *extra], capture_output=True, text=True)


def check(root: Path) -> subprocess.CompletedProcess:
    return subprocess.run(["node", str(CHECKER), "--root", str(root)], capture_output=True, text=True)


def snapshot(root: Path) -> dict:
    return {path.name: path.read_bytes() for path in sorted(cards_dir(root).iterdir())}


def drift_self_check(root: Path) -> None:
    rule = root / ".skilled" / "repo-rules" / "alpha.md"
    rule.write_text(rule.read_text().replace("The deploy was careful.", "The deploy was reckless."))


def test_generating_twice_gives_byte_identical_cards(tmp_path: Path) -> None:
    root = make_tree(tmp_path)

    first_run = build(root)
    first = snapshot(root)
    second_run = build(root)
    second = snapshot(root)

    assert first_run.returncode == 0, first_run.stdout + first_run.stderr
    assert second_run.returncode == 0, second_run.stdout + second_run.stderr
    assert first == second
    assert first == {"alpha.md": CARD.encode()}


def test_checker_passes_all_eleven_checks_after_generating(tmp_path: Path) -> None:
    root = make_tree(tmp_path)
    build(root)

    result = check(root)

    assert result.returncode == 0, result.stdout + result.stderr
    assert "1/11 PASS count parity" in result.stdout
    assert "11/11 PASS card sync" in result.stdout
    assert "RESULT: PASSED (11/11 checks)" in result.stdout


def test_editing_a_self_check_without_regenerating_fails_check_eleven(tmp_path: Path) -> None:
    root = make_tree(tmp_path)
    build(root)
    drift_self_check(root)

    result = check(root)

    assert result.returncode == 1
    line = next(row for row in result.stdout.splitlines() if "card sync" in row)
    assert "FAIL" in line
    assert "cards/alpha.md: drifted from its rule" in line
    assert "RESULT: FAILED (10/11 checks)" in result.stdout


def test_builder_check_mode_exits_one_on_drift_and_writes_nothing(tmp_path: Path) -> None:
    root = make_tree(tmp_path)
    build(root)
    before = snapshot(root)
    drift_self_check(root)

    result = build(root, "--check")

    assert result.returncode == 1, result.stdout + result.stderr
    assert "cards/alpha.md: stale" in result.stdout
    assert snapshot(root) == before
