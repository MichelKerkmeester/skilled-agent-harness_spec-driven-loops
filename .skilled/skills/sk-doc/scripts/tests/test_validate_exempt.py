#!/usr/bin/env python3
"""Tests for the render exemption verdict in validate_document.py.

A doc whose exact text a code file depends on is still checked, but its findings
are demoted to advice, tagged with that reader and prefixed so the report names
the owner. The ledger proves the claim, so the same doc with no record keeps its
full verdict, and a real Style Reference is validated rather than skipped.

Run: python3 -m pytest -q test_validate_exempt.py
"""

import json
import os
import subprocess
import sys
from pathlib import Path

import pytest

TESTS = Path(__file__).resolve().parent
REPO = TESTS.parents[4]
VALIDATOR = REPO / ".skilled/skills/sk-doc/shared/scripts/validate_document.py"
STYLE_REFERENCE = (
    REPO
    / ".skilled/skills/sk-design/sk-design-chart/assets/style-reference/evilcharts/DESIGN.md"
)
STYLE_REFERENCE_CONSUMER = "sk-design/sk-design-chart/scripts/apply-design-md.cjs"
DOC_KEY = "demo-skill/assets/demo-dashboard.md"
CONSUMER_KEY = "demo-skill/scripts/reduce-state.cjs"
REASON = "The generator writes these headings verbatim."
DOC_TEXT = "# Demo dashboard\n\n**Status:** ready\n**Owner:** demo team\n\nContent follows.\n"
PREFIX = f"exempt (read by {CONSUMER_KEY}): "

sys.path.insert(0, str(TESTS.parent))
from validate_document import should_exclude_path, validate_document  # noqa: E402


@pytest.fixture()
def skills(tmp_path):
    """Build a skills root whose pairing satisfies the ledger's rules."""
    root = tmp_path / "skills"
    (root / "demo-skill" / "assets").mkdir(parents=True)
    (root / "demo-skill" / "scripts").mkdir(parents=True)
    (root / DOC_KEY).write_text(DOC_TEXT, encoding="utf-8")
    (root / CONSUMER_KEY).write_text(
        "const template = 'assets/demo-dashboard.md';\n", encoding="utf-8"
    )
    return root


def _point_at(tmp_path, monkeypatch, skills, exempt):
    ledger = tmp_path / "ledger.json"
    ledger.write_text(json.dumps({"exempt": exempt}), encoding="utf-8")
    monkeypatch.setenv("RENDER_DEBT_FILE", str(ledger))
    monkeypatch.setenv("RENDER_SKILLS_ROOT", str(skills))


def _join_warnings(result):
    return [w for w in result["warnings"] if w["type"] == "render_bold_label_join"]


def test_exempt_doc_names_its_reader_and_stays_valid(skills, tmp_path, monkeypatch):
    _point_at(
        tmp_path,
        monkeypatch,
        skills,
        {DOC_KEY: {"consumer": CONSUMER_KEY, "reason": REASON}},
    )

    result = validate_document(str(skills / DOC_KEY), doc_type="reference")

    joined = _join_warnings(result)
    assert len(joined) == 1
    assert joined[0]["exempt_consumer"] == CONSUMER_KEY
    assert joined[0]["message"].startswith(PREFIX)
    assert result["exempt_consumer"] == CONSUMER_KEY
    assert all(w["exempt_consumer"] == CONSUMER_KEY for w in result["warnings"])
    assert result["blocking_errors"] == []
    assert result["valid"] is True
    assert result["exit_code"] == 0


def test_same_doc_without_a_ledger_record_keeps_its_verdict(skills, tmp_path, monkeypatch):
    _point_at(tmp_path, monkeypatch, skills, {})

    result = validate_document(str(skills / DOC_KEY), doc_type="reference")

    joined = _join_warnings(result)
    assert len(joined) == 1
    assert "exempt_consumer" not in joined[0]
    assert joined[0]["message"].startswith("Consecutive bold labels")
    assert "exempt_consumer" not in result
    assert result["blocking_errors"], "a doc with no record keeps its full verdict"


def test_real_style_reference_is_validated_and_reported_as_exempt():
    assert should_exclude_path(str(STYLE_REFERENCE)) == (False, None)

    result = validate_document(str(STYLE_REFERENCE))

    assert result["exempt_consumer"] == STYLE_REFERENCE_CONSUMER
    assert result["warnings"], "the real reference raises findings to report"
    for finding in result["warnings"]:
        assert finding["exempt_consumer"] == STYLE_REFERENCE_CONSUMER
        assert finding["message"].startswith(f"exempt (read by {STYLE_REFERENCE_CONSUMER}): ")
    assert result["valid"] is True
    assert result["exit_code"] == 0


def test_human_report_names_the_reader_before_the_findings():
    env = dict(os.environ, JEV_FEATURES="0")
    env.pop("RENDER_DEBT_FILE", None)
    env.pop("RENDER_SKILLS_ROOT", None)
    proc = subprocess.run(
        [sys.executable, "-B", str(VALIDATOR), str(STYLE_REFERENCE)],
        cwd=REPO,
        capture_output=True,
        text=True,
        check=False,
        env=env,
    )

    assert proc.returncode == 0, proc.stdout + proc.stderr
    lines = proc.stdout.splitlines()
    exempt_index = lines.index(f"Exempt: read by {STYLE_REFERENCE_CONSUMER}")
    first_finding = next(i for i, line in enumerate(lines) if line.startswith("  - ["))
    assert exempt_index < first_finding
