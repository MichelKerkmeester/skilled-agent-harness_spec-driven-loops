#!/usr/bin/env python3
"""Tests for baseline_rhythm_check.py.

Like naming_doc_check, this checker reaches into a sibling shared-scripts dir
for `md_table` at import time, so the subprocess smoke test is the one that
catches a wrong parent-count in that path -- the defect that shipped here and
broke every run until it was found by hand.
"""
import json
import subprocess
import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parents[1]
SCRIPT = SCRIPTS_DIR / "baseline_rhythm_check.py"
COMPLIANT = SCRIPTS_DIR / "fixtures" / "naming-doc" / "compliant.md"

sys.path.insert(0, str(SCRIPTS_DIR))
import baseline_rhythm_check as brc  # noqa: E402


def run(args, cwd):
    return subprocess.run(
        [sys.executable, str(SCRIPT), *args],
        cwd=str(cwd), capture_output=True, text=True,
    )


def table(*rows):
    body = "".join(f"| `{t}` | `{v}` | {u} |\n" for t, v, u in rows)
    return "## SPACING SCALE\n\n| Token | Value | Use |\n| --- | --- | --- |\n" + body


# --- smoke: the shared-import path must resolve from any cwd ----------------

def test_runs_without_import_error_from_unrelated_cwd(tmp_path):
    """Guards the shipped ModuleNotFoundError regression."""
    proc = run([str(COMPLIANT)], cwd=tmp_path)
    assert "ModuleNotFoundError" not in proc.stderr, proc.stderr
    assert proc.returncode == 0, proc.stderr


def test_json_output_is_parseable(tmp_path):
    payload = json.loads(run(["--json", str(COMPLIANT)], cwd=tmp_path).stdout)
    assert payload["ok"] is True
    assert payload["baseline"]["px"] == 4.0


# --- baseline resolution ----------------------------------------------------

def test_multiples_of_the_baseline_resolve():
    result = brc.check(table(
        ("--baseline", "4px", "rhythm base"),
        ("--space-md", "16px", "block gap"),
    ))
    assert result["ok"] is True
    assert result["baseline"]["px"] == 4.0


def test_off_baseline_value_fails():
    result = brc.check(table(
        ("--baseline", "4px", "rhythm base"),
        ("--space-odd", "15px", "block gap"),
    ))
    assert result["ok"] is False
    assert "does not resolve" in result["failures"][0]["reason"]


def test_rem_resolves_against_the_16px_root():
    result = brc.check(table(
        ("--baseline", "4px", "rhythm base"),
        ("--space-lg", "1.5rem", "24px via rem"),
    ))
    assert result["ok"] is True


def test_half_and_quarter_baseline_fractions_are_allowed():
    result = brc.check(table(
        ("--baseline", "4px", "rhythm base"),
        ("--space-half", "2px", "hairline gap"),
        ("--space-quarter", "1px", "hairline rule"),
    ))
    assert result["ok"] is True


def test_row_marked_exception_is_allowed_off_baseline():
    result = brc.check(table(
        ("--baseline", "4px", "rhythm base"),
        ("--space-optical", "15px", "exception: optical alignment"),
    ))
    assert result["ok"] is True


def test_fluid_value_without_a_fixed_anchor_fails():
    result = brc.check(table(
        ("--baseline", "4px", "rhythm base"),
        ("--space-fluid", "5vw", "fluid gutter"),
    ))
    assert result["ok"] is False
    assert "no fixed" in result["failures"][0]["reason"]


def test_clamp_with_resolving_fixed_anchors_passes():
    result = brc.check(table(
        ("--baseline", "4px", "rhythm base"),
        ("--space-fluid", "clamp(8px, 2vw, 16px)", "fluid gutter"),
    ))
    assert result["ok"] is True


def test_missing_baseline_token_fails():
    result = brc.check(table(("--space-md", "16px", "block gap")))
    assert result["ok"] is False
    assert any("baseline token missing" in f["reason"] for f in result["failures"])


def test_missing_spacing_table_fails():
    result = brc.check("# No table here\n")
    assert result["ok"] is False


def test_is_baseline_value_rejects_a_zero_baseline():
    assert brc._is_baseline_value(16.0, 0.0) is False


def test_usage_error_exits_2(tmp_path):
    assert run([], cwd=tmp_path).returncode == 2
    assert run([str(tmp_path / "missing.md")], cwd=tmp_path).returncode == 2
