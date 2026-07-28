#!/usr/bin/env python3
"""Tests for naming_doc_check.py.

The subprocess smoke tests are the load-bearing ones. This checker imports
`md_table` from a sibling shared-scripts dir via a hand-built sys.path entry,
and a wrong parent-count in that path makes EVERY invocation die with
ModuleNotFoundError before any logic runs. That exact defect shipped and went
undetected because nothing ever executed the script. Importing the module
in-process would not catch it either -- only spawning it the way an operator
does, from an unrelated working directory, exercises the real path math.
"""
import json
import subprocess
import sys
from pathlib import Path

import pytest

SCRIPTS_DIR = Path(__file__).resolve().parents[1]
SCRIPT = SCRIPTS_DIR / "naming_doc_check.py"
FIXTURES = SCRIPTS_DIR / "fixtures" / "naming-doc"

sys.path.insert(0, str(SCRIPTS_DIR))
import naming_doc_check  # noqa: E402


def run(args, cwd):
    return subprocess.run(
        [sys.executable, str(SCRIPT), *args],
        cwd=str(cwd), capture_output=True, text=True,
    )


# --- smoke: the shared-import path must resolve from any cwd ----------------

def test_runs_without_import_error_from_unrelated_cwd(tmp_path):
    """Guards the shipped ModuleNotFoundError regression."""
    proc = run([str(FIXTURES / "compliant.md")], cwd=tmp_path)
    assert "ModuleNotFoundError" not in proc.stderr, proc.stderr
    assert proc.returncode == 0, proc.stderr


def test_shared_md_table_helpers_are_importable():
    assert callable(naming_doc_check._split_table_row)
    assert callable(naming_doc_check._is_separator_row)
    assert callable(naming_doc_check._clean_cell)


# --- fixtures: the documented positive/negative pair ------------------------

def test_compliant_fixture_passes():
    result = naming_doc_check.check((FIXTURES / "compliant.md").read_text(encoding="utf-8"))
    assert result["applicable"] is True
    assert result["artifact_kind"] == "token"
    assert result["invalid_token_names"] == []
    assert result["missing_headings"] == []
    assert result["ok"] is True


def test_violating_fixture_fails_with_three_bad_tokens_and_one_missing_heading():
    result = naming_doc_check.check((FIXTURES / "violating.md").read_text(encoding="utf-8"))
    assert result["ok"] is False
    assert {item["name"] for item in result["invalid_token_names"]} == {
        "--PrimaryColor", "--color_primary", "--clr-primary",
    }
    assert result["missing_headings"] == ["SPACING SCALE"]


def test_violating_fixture_exits_1_via_cli(tmp_path):
    proc = run([str(FIXTURES / "violating.md")], cwd=tmp_path)
    assert proc.returncode == 1
    assert "SPACING SCALE" in proc.stdout


def test_json_output_is_parseable(tmp_path):
    proc = run(["--json", str(FIXTURES / "compliant.md")], cwd=tmp_path)
    payload = json.loads(proc.stdout)
    assert payload["ok"] is True
    assert payload["artifact_kind"] == "token"


# --- applicability + naming rules ------------------------------------------

def test_ordinary_markdown_is_not_applicable_and_exits_clean():
    result = naming_doc_check.check("# Just A Reference\n\nProse with no artifactKind.\n")
    assert result["applicable"] is False
    assert result["ok"] is True


def test_markdown_separator_rows_are_not_read_as_tokens():
    """`| --- |` must not be mistaken for a `--` token declaration."""
    text = (
        "---\nartifactKind: token\n---\n\n## COLOR RAMP\n\n"
        "| Token | Value | Use |\n| --- | --- | --- |\n"
        "| `--color-primary` | `oklch(0.62 0.18 245)` | action |\n\n"
        "## TYPE SCALE\n\n## SPACING SCALE\n\n## HAND OFF\n"
    )
    result = naming_doc_check.check(text)
    assert [item["name"] for item in result["token_names"]] == ["--color-primary"]
    assert result["ok"] is True


@pytest.mark.parametrize("name,fragment", [
    ("--color_primary", "underscore"),
    ("--PrimaryColor", "lowercase"),
    ("--clr-primary", "token tiers"),
])
def test_token_reason_explains_the_specific_violation(name, fragment):
    assert fragment in naming_doc_check._token_reason(name)


def test_usage_error_exits_2(tmp_path):
    assert run([], cwd=tmp_path).returncode == 2
    assert run(["a.md", "b.md"], cwd=tmp_path).returncode == 2


def test_unreadable_path_exits_2(tmp_path):
    assert run([str(tmp_path / "missing.md")], cwd=tmp_path).returncode == 2
