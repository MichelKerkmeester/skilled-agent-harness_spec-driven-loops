#!/usr/bin/env python3
"""Tests for the shared render exemption ledger reader.

Every rule in the reader exists so that a ledger record which cannot prove its
claim exempts nothing, so each test builds the smallest fake skills root that
satisfies the other rules and then breaks exactly one of them.

Run: python3 -m pytest -q test_render_exempt.py
"""

import importlib.util
import json
import os
import subprocess
import sys
from pathlib import Path

import pytest

MODULE_PATH = (
    Path(__file__).resolve().parents[2] / "shared" / "scripts" / "render_exempt.py"
)

DOC_KEY = "demo-skill/assets/demo-dashboard.md"
CONSUMER_KEY = "demo-skill/scripts/reduce-state.cjs"
PINNED_DOC_KEY = "demo-skill/assets/demo-prompt.md"
PINNED_CONSUMER_KEY = "demo-skill/scripts/orchestrate-session.cjs"
DECOY_CONSUMER_KEY = "demo-skill/scripts/unrelated.cjs"
MISSING_DOC_KEY = "demo-skill/assets/gone.md"
MISSING_CONSUMER_KEY = "demo-skill/scripts/absent.cjs"
READ_DOC_KEY = "demo-skill/references/read-target.md"
READ_CODE_KEY = "demo-skill/scripts/reads-doc.cjs"
COMPUTED_DOC_KEY = "demo-skill/references/computed-target.md"
COMPUTED_CODE_KEY = "demo-skill/scripts/reads-computed.cjs"
PYTHON_DOC_KEY = "demo-skill/references/py-target.md"
PYTHON_CODE_KEY = "demo-skill/scripts/reads_doc.py"
TEST_TREE_DOC_KEY = "demo-skill/references/test-only-target.md"
TEST_TREE_CODE_KEY = "demo-skill/scripts/tests/reads-doc.cjs"
REASON = "The generator writes these headings verbatim."


@pytest.fixture(scope="module")
def render_exempt():
    spec = importlib.util.spec_from_file_location("render_exempt", MODULE_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


@pytest.fixture()
def skills(tmp_path):
    """Build a skills root whose every pairing would pass, ready to be broken."""
    root = tmp_path / "skills"
    (root / "demo-skill" / "assets").mkdir(parents=True)
    (root / "demo-skill" / "scripts").mkdir(parents=True)
    (root / DOC_KEY).write_text("# Demo dashboard\n", encoding="utf-8")
    (root / PINNED_DOC_KEY).write_text("# Demo prompt\n", encoding="utf-8")
    (root / CONSUMER_KEY).write_text(
        "const template = 'assets/demo-dashboard.md';\n", encoding="utf-8"
    )
    (root / PINNED_CONSUMER_KEY).write_text(
        "const prompt = 'assets/demo-prompt.md';\n", encoding="utf-8"
    )
    (root / DECOY_CONSUMER_KEY).write_text("const unrelated = 1;\n", encoding="utf-8")
    return root


@pytest.fixture()
def scan_skills(tmp_path):
    """Build a skills root whose every doc is read, so only the scan can tell them apart."""
    root = tmp_path / "skills"
    for folder in ("references", "scripts", "scripts/tests"):
        (root / "demo-skill" / folder).mkdir(parents=True, exist_ok=True)
    for doc_key in (
        READ_DOC_KEY,
        COMPUTED_DOC_KEY,
        PYTHON_DOC_KEY,
        TEST_TREE_DOC_KEY,
    ):
        (root / doc_key).write_text("# Target\n", encoding="utf-8")
    (root / READ_CODE_KEY).write_text(
        "const text = fs.readFileSync('../references/read-target.md', 'utf8');\n",
        encoding="utf-8",
    )
    (root / COMPUTED_CODE_KEY).write_text(
        "const name = 'computed-target.md';\n"
        "const text = fs.readFileSync(path.join(__dirname, '..', 'references', name), 'utf8');\n",
        encoding="utf-8",
    )
    (root / PYTHON_CODE_KEY).write_text(
        "text = Path('../references/py-target.md').read_text(encoding='utf-8')\n",
        encoding="utf-8",
    )
    (root / TEST_TREE_CODE_KEY).write_text(
        "const text = fs.readFileSync('../../references/test-only-target.md', 'utf8');\n",
        encoding="utf-8",
    )
    return root


def _exempt_entry(**overrides):
    entry = {"consumer": CONSUMER_KEY, "reason": REASON}
    entry.update(overrides)
    return entry


def _pinned_entry(**overrides):
    entry = {"doc": DOC_KEY, "consumer": CONSUMER_KEY, "reason": REASON}
    entry.update(overrides)
    return entry


def _run_check(ledger_file, skills):
    env = dict(
        os.environ,
        RENDER_DEBT_FILE=str(ledger_file),
        RENDER_SKILLS_ROOT=str(skills),
    )
    return subprocess.run(
        [sys.executable, "-B", str(MODULE_PATH), "--check"],
        capture_output=True,
        text=True,
        env=env,
    )


def _run_scan(ledger_file, skills):
    env = dict(
        os.environ,
        RENDER_DEBT_FILE=str(ledger_file),
        RENDER_SKILLS_ROOT=str(skills),
    )
    return subprocess.run(
        [sys.executable, "-B", str(MODULE_PATH), "--scan-pinned"],
        capture_output=True,
        text=True,
        env=env,
    )


def test_valid_exempt_entry_is_kept(render_exempt, skills):
    exempt, pinned, problems = render_exempt.check_ledger(
        {"exempt": {DOC_KEY: _exempt_entry()}}, skills
    )

    assert exempt == {DOC_KEY: CONSUMER_KEY}
    assert pinned == {}
    assert problems == []


def test_absent_pinned_key_means_no_pinned_entries(render_exempt, skills):
    _, pinned, problems = render_exempt.check_ledger({"exempt": {}}, skills)

    assert pinned == {}
    assert problems == []


def test_missing_doc_key_is_reported_and_dropped(render_exempt, skills):
    exempt, _, problems = render_exempt.check_ledger(
        {"exempt": {MISSING_DOC_KEY: _exempt_entry()}}, skills
    )

    assert exempt == {}
    assert len(problems) == 1
    assert MISSING_DOC_KEY in problems[0]
    assert "not found" in problems[0]


def test_missing_consumer_file_is_reported_and_dropped(render_exempt, skills):
    exempt, _, problems = render_exempt.check_ledger(
        {"exempt": {DOC_KEY: _exempt_entry(consumer=MISSING_CONSUMER_KEY)}}, skills
    )

    assert exempt == {}
    assert len(problems) == 1
    assert DOC_KEY in problems[0]
    assert MISSING_CONSUMER_KEY in problems[0]


def test_absolute_consumer_is_reported_and_dropped(render_exempt, skills):
    exempt, _, problems = render_exempt.check_ledger(
        {"exempt": {DOC_KEY: _exempt_entry(consumer=str(skills / CONSUMER_KEY))}}, skills
    )

    assert exempt == {}
    assert len(problems) == 1
    assert DOC_KEY in problems[0]
    assert "relative" in problems[0]


def test_consumer_escaping_the_root_is_reported_and_dropped(render_exempt, skills):
    exempt, _, problems = render_exempt.check_ledger(
        {"exempt": {DOC_KEY: _exempt_entry(consumer="../../outside.cjs")}}, skills
    )

    assert exempt == {}
    assert len(problems) == 1
    assert DOC_KEY in problems[0]
    assert "leaves the skills root" in problems[0]


def test_consumer_that_does_not_name_the_doc_is_reported_and_dropped(render_exempt, skills):
    exempt, _, problems = render_exempt.check_ledger(
        {"exempt": {DOC_KEY: _exempt_entry(consumer=DECOY_CONSUMER_KEY)}}, skills
    )

    assert exempt == {}
    assert len(problems) == 1
    assert DOC_KEY in problems[0]
    assert "does not name" in problems[0]


def test_blank_reason_is_reported_and_dropped(render_exempt, skills):
    exempt, _, problems = render_exempt.check_ledger(
        {"exempt": {DOC_KEY: _exempt_entry(reason="   ")}}, skills
    )

    assert exempt == {}
    assert len(problems) == 1
    assert DOC_KEY in problems[0]
    assert "reason is blank" in problems[0]


def test_extra_key_is_reported_and_dropped(render_exempt, skills):
    exempt, _, problems = render_exempt.check_ledger(
        {"exempt": {DOC_KEY: _exempt_entry(note="extra")}}, skills
    )

    assert exempt == {}
    assert len(problems) == 1
    assert DOC_KEY in problems[0]
    assert "exactly consumer and reason" in problems[0]


def test_valid_pinned_entry_is_kept(render_exempt, skills):
    exempt, pinned, problems = render_exempt.check_ledger(
        {"pinned": [_pinned_entry()]}, skills
    )

    assert exempt == {}
    assert pinned == {DOC_KEY: CONSUMER_KEY}
    assert problems == []


@pytest.mark.parametrize(
    "overrides",
    (
        {"doc": MISSING_DOC_KEY},
        {"consumer": MISSING_CONSUMER_KEY},
        {"consumer": "../../outside.cjs"},
        {"consumer": DECOY_CONSUMER_KEY},
        {"reason": "   "},
        {"note": "extra"},
    ),
    ids=(
        "missing-doc",
        "missing-consumer",
        "consumer-outside-root",
        "consumer-without-doc-name",
        "blank-reason",
        "extra-key",
    ),
)
def test_pinned_entry_breaking_a_rule_is_reported_and_dropped(
    render_exempt, skills, overrides
):
    _, pinned, problems = render_exempt.check_ledger(
        {"pinned": [_pinned_entry(**overrides)]}, skills
    )

    assert pinned == {}
    assert len(problems) == 1
    assert overrides.get("doc", DOC_KEY) in problems[0]


def test_pinned_entry_with_absolute_consumer_is_reported_and_dropped(render_exempt, skills):
    _, pinned, problems = render_exempt.check_ledger(
        {"pinned": [_pinned_entry(consumer=str(skills / CONSUMER_KEY))]}, skills
    )

    assert pinned == {}
    assert len(problems) == 1
    assert "relative" in problems[0]


def test_pinned_entry_without_a_doc_key_is_reported(render_exempt, skills):
    _, pinned, problems = render_exempt.check_ledger(
        {"pinned": [{"consumer": CONSUMER_KEY, "reason": REASON}]}, skills
    )

    assert pinned == {}
    assert len(problems) == 1
    assert "item #0" in problems[0]


def test_doc_listed_in_both_lists_is_reported_and_dropped_from_both(render_exempt, skills):
    exempt, pinned, problems = render_exempt.check_ledger(
        {"exempt": {DOC_KEY: _exempt_entry()}, "pinned": [_pinned_entry()]}, skills
    )

    assert exempt == {}
    assert pinned == {}
    assert len(problems) == 1
    assert DOC_KEY in problems[0]
    assert "both" in problems[0]


def test_loaders_read_a_valid_ledger(render_exempt, skills, tmp_path, monkeypatch):
    ledger_file = tmp_path / "ledger.json"
    ledger_file.write_text(
        json.dumps(
            {
                "exempt": {DOC_KEY: _exempt_entry()},
                "pinned": [_pinned_entry(doc=PINNED_DOC_KEY, consumer=PINNED_CONSUMER_KEY)],
            }
        ),
        encoding="utf-8",
    )
    monkeypatch.setenv("RENDER_DEBT_FILE", str(ledger_file))
    monkeypatch.setenv("RENDER_SKILLS_ROOT", str(skills))

    assert render_exempt.load_exempt() == {DOC_KEY: CONSUMER_KEY}
    assert render_exempt.load_pinned() == {PINNED_DOC_KEY: PINNED_CONSUMER_KEY}


def test_loaders_return_empty_for_non_object_ledger(
    render_exempt, skills, tmp_path, monkeypatch
):
    ledger_file = tmp_path / "ledger.json"
    ledger_file.write_text("[1, 2]\n", encoding="utf-8")
    monkeypatch.setenv("RENDER_DEBT_FILE", str(ledger_file))
    monkeypatch.setenv("RENDER_SKILLS_ROOT", str(skills))

    assert render_exempt.load_exempt() == {}
    assert render_exempt.load_pinned() == {}


def test_loaders_return_empty_for_unreadable_ledger(
    render_exempt, skills, tmp_path, monkeypatch
):
    monkeypatch.setenv("RENDER_DEBT_FILE", str(tmp_path / "absent.json"))
    monkeypatch.setenv("RENDER_SKILLS_ROOT", str(skills))

    assert render_exempt.load_exempt() == {}
    assert render_exempt.load_pinned() == {}


def test_cli_exits_one_naming_a_missing_doc_key(skills, tmp_path):
    ledger_file = tmp_path / "ledger.json"
    ledger_file.write_text(
        json.dumps({"exempt": {MISSING_DOC_KEY: _exempt_entry()}}), encoding="utf-8"
    )

    proc = _run_check(ledger_file, skills)

    assert proc.returncode == 1
    assert MISSING_DOC_KEY in proc.stdout


def test_cli_exits_zero_on_a_clean_ledger(skills, tmp_path):
    ledger_file = tmp_path / "ledger.json"
    ledger_file.write_text(
        json.dumps(
            {
                "exempt": {DOC_KEY: _exempt_entry()},
                "pinned": [
                    _pinned_entry(doc=PINNED_DOC_KEY, consumer=PINNED_CONSUMER_KEY)
                ],
            }
        ),
        encoding="utf-8",
    )

    proc = _run_check(ledger_file, skills)

    assert proc.returncode == 0
    assert proc.stdout.strip() == "render ledger: 1 exempt, 1 pinned, 0 problems"


def test_scan_reports_a_literal_read_as_a_candidate(scan_skills, tmp_path):
    ledger_file = tmp_path / "ledger.json"
    ledger_file.write_text(json.dumps({"exempt": {}, "pinned": []}), encoding="utf-8")

    proc = _run_scan(ledger_file, scan_skills)

    assert proc.returncode == 0
    assert (
        f"CANDIDATE {READ_DOC_KEY} (read by {READ_CODE_KEY}:1)" in proc.stdout
    )


def test_scan_reports_a_pinned_doc_it_finds(scan_skills, tmp_path):
    ledger_file = tmp_path / "ledger.json"
    ledger_file.write_text(
        json.dumps(
            {
                "exempt": {},
                "pinned": [
                    {
                        "doc": READ_DOC_KEY,
                        "consumer": READ_CODE_KEY,
                        "reason": REASON,
                    }
                ],
            }
        ),
        encoding="utf-8",
    )

    proc = _run_scan(ledger_file, scan_skills)

    assert proc.returncode == 0
    assert f"PINNED {READ_DOC_KEY}" in proc.stdout
    assert f"CANDIDATE {READ_DOC_KEY}" not in proc.stdout


def test_scan_reports_a_pinned_doc_read_through_a_computed_path(
    scan_skills, tmp_path
):
    ledger_file = tmp_path / "ledger.json"
    ledger_file.write_text(
        json.dumps(
            {
                "exempt": {},
                "pinned": [
                    {
                        "doc": COMPUTED_DOC_KEY,
                        "consumer": COMPUTED_CODE_KEY,
                        "reason": REASON,
                    }
                ],
            }
        ),
        encoding="utf-8",
    )

    proc = _run_scan(ledger_file, scan_skills)

    assert proc.returncode == 0
    assert (
        f"PINNED-UNSEEN {COMPUTED_DOC_KEY} "
        f"(pinned by {COMPUTED_CODE_KEY}; read through a computed path)" in proc.stdout
    )
    assert "1 pinned unseen" in proc.stdout
    assert f"CANDIDATE {COMPUTED_DOC_KEY}" not in proc.stdout


def test_scan_ignores_a_read_inside_a_test_tree(scan_skills, tmp_path):
    ledger_file = tmp_path / "ledger.json"
    ledger_file.write_text(json.dumps({"exempt": {}, "pinned": []}), encoding="utf-8")

    proc = _run_scan(ledger_file, scan_skills)

    assert proc.returncode == 0
    assert TEST_TREE_DOC_KEY not in proc.stdout


def test_scan_finds_the_python_path_read_form(scan_skills, tmp_path):
    ledger_file = tmp_path / "ledger.json"
    ledger_file.write_text(json.dumps({"exempt": {}, "pinned": []}), encoding="utf-8")

    proc = _run_scan(ledger_file, scan_skills)

    assert proc.returncode == 0
    assert (
        f"CANDIDATE {PYTHON_DOC_KEY} (read by {PYTHON_CODE_KEY}:1)" in proc.stdout
    )


def test_scan_cli_rejects_an_unknown_argument(scan_skills, tmp_path):
    ledger_file = tmp_path / "ledger.json"
    env = dict(
        os.environ,
        RENDER_DEBT_FILE=str(ledger_file),
        RENDER_SKILLS_ROOT=str(scan_skills),
    )

    proc = subprocess.run(
        [sys.executable, "-B", str(MODULE_PATH), "--everything"],
        capture_output=True,
        text=True,
        env=env,
    )

    assert proc.returncode == 2
    assert "usage: render_exempt.py" in proc.stderr


def test_generic_doc_name_needs_its_folder_named(render_exempt, tmp_path):
    root = tmp_path / "skills"
    doc = root / "demo/assets/style-reference/house/DESIGN.md"
    doc.parent.mkdir(parents=True)
    doc.write_text("# Design\n", encoding="utf-8")
    consumer = root / "demo/scripts/apply.cjs"
    consumer.parent.mkdir(parents=True)
    consumer.write_text("read('DESIGN.md')\n", encoding="utf-8")
    entry = {"consumer": "demo/scripts/apply.cjs", "reason": "reads it"}
    data = {"exempt": {"demo/assets/style-reference/house/DESIGN.md": entry}}

    exempt, _pinned, problems = render_exempt.check_ledger(data, root)
    assert exempt == {}
    assert any("does not name house/DESIGN.md" in problem for problem in problems)

    consumer.write_text("read(path.join('house', 'DESIGN.md'))\n", encoding="utf-8")
    exempt, _pinned, problems = render_exempt.check_ledger(data, root)
    assert "demo/assets/style-reference/house/DESIGN.md" in exempt
    assert problems == []
