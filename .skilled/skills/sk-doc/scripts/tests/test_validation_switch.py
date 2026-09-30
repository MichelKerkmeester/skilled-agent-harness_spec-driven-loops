#!/usr/bin/env python3
# ---------------------------------------------------------------------------
# COMPONENT: Validation Off Switch Tests
# ---------------------------------------------------------------------------
"""SKDOC_SKIP_VALIDATION: the shared helpers and every validator that honors it.

Each guarded validator is spawned with the switch on, so a validator that lost
its guard fails here by name. The controls prove the switch, not an easy input,
is what made a run pass, and the exemptions pin the modes that must keep running.
"""

import json
import os
import re
import subprocess
import sys
from pathlib import Path

import pytest

SK_DOC = Path(__file__).resolve().parents[2]
REPO_ROOT = Path(__file__).resolve().parents[5]
SHARED = SK_DOC / "shared" / "scripts"
HOOK_FLAGS_CJS = REPO_ROOT / ".skilled" / "hooks" / "shared" / "hook-flags.cjs"

sys.path.insert(0, str(SHARED))
import validation_switch  # type: ignore  # noqa: E402

SKIPPED = {"skipped": True, "valid": True, "reason": "SKDOC_SKIP_VALIDATION is on"}
ABSENT_FLAGS = Path(__file__).resolve().parent / "no-such-hook-flags.env"


def run(command, env=None, cwd=REPO_ROOT):
    """Run a validator with neither switch inherited and the flags file pointed away."""
    child = {k: v for k, v in os.environ.items() if k not in ("SKDOC_SKIP_VALIDATION", "HOOK_FLAGS_CONFIG")}
    child["HOOK_FLAGS_CONFIG"] = str(ABSENT_FLAGS)
    child.update(env or {})
    return subprocess.run(command, cwd=cwd, env=child, capture_output=True, text=True, check=False)


@pytest.fixture
def scratch(tmp_path):
    (tmp_path / "doc.md").write_text("# Doc\n\nBody text.\n", encoding="utf-8")
    (tmp_path / "README.md").write_text("# Readme\n", encoding="utf-8")
    return tmp_path


# ---------------------------------------------------------------------------
# 1. The resolver mirror
# ---------------------------------------------------------------------------

def test_the_environment_answers_first_even_when_empty(tmp_path):
    flags = tmp_path / "hook-flags.env"
    flags.write_text("SKDOC_SKIP_VALIDATION=1\n", encoding="utf-8")
    base = {"HOOK_FLAGS_CONFIG": str(flags)}
    assert validation_switch.skip_source(base) == str(flags)
    assert validation_switch.skip_source({**base, "SKDOC_SKIP_VALIDATION": "yes"}) == "the environment"
    for value in ("0", "", "skip", "false"):
        assert validation_switch.skip_source({**base, "SKDOC_SKIP_VALIDATION": value}) is None, value
    assert validation_switch.skip_source({"HOOK_FLAGS_CONFIG": str(tmp_path / "absent.env")}) is None


def test_the_file_parser_matches_the_hooks_resolver(tmp_path):
    flags = tmp_path / "hook-flags.env"
    flags.write_bytes(
        (
            "﻿# comment\r\n\r\nA=1\r\n  B = \"true\" \nC='yes'\nNOEQ\n=novalue\nD=\nE=a=b\nF=\"open\n"
            "G=1   # trailing\nH=\"on\" # quoted, then a comment\nI=a#b\nJ= # only a comment\nK='x y'\t# tab\nA=2\n"
        ).encode("utf-8")
    )
    node = subprocess.run(
        ["node", "-e", "process.stdout.write(JSON.stringify(require(process.argv[1]).loadConfigFile(process.argv[2])))",
         str(HOOK_FLAGS_CJS), str(flags)],
        capture_output=True, text=True, check=True,
    )
    assert validation_switch.load_config_file(flags) == json.loads(node.stdout)


# The docs say to copy the example and uncomment the lines you want, so every
# switch line must turn its switch on as written, trailing comment and all.
def test_every_example_line_works_once_uncommented(tmp_path):
    example = REPO_ROOT / ".skilled" / "hooks" / "hook-flags.env.example"
    switch_line = re.compile(r"^# ([A-Z][A-Z0-9_]*)=")
    names, lines = [], []
    for line in example.read_text(encoding="utf-8").splitlines():
        match = switch_line.match(line)
        if match:
            names.append(match.group(1))
            line = line[2:]
        lines.append(line)
    assert {"SPECKIT_SKIP_VALIDATION", "SKDOC_SKIP_VALIDATION", "SYSTEM_HOOKS_DISABLED"} <= set(names)
    flags = tmp_path / "hook-flags.env"
    flags.write_text("\n".join(lines) + "\n", encoding="utf-8")
    assert validation_switch.skip_source({"HOOK_FLAGS_CONFIG": str(flags)}) == str(flags)
    node = subprocess.run(
        ["node", "-e",
         "const h = require(process.argv[1]); const c = h.loadConfigFile(process.argv[2]);"
         " process.stdout.write(JSON.stringify(process.argv.slice(3).filter((n) => !h.isFlagOn(n, {}, c))))",
         str(HOOK_FLAGS_CJS), str(flags), *names],
        capture_output=True, text=True, check=True,
    )
    assert json.loads(node.stdout) == [], "these example lines stay off once uncommented"


# ---------------------------------------------------------------------------
# 2. Every guarded validator skips
# ---------------------------------------------------------------------------

def _guarded(tmp):
    doc, readme = str(tmp / "doc.md"), str(tmp / "README.md")
    python = [
        ("shared/scripts/validate_document.py", [doc, "--json"]),
        ("shared/scripts/quick_validate.py", [str(tmp), "--json"]),
        ("shared/scripts/check_authored_name_kebab.py", ["snake_name.md"]),
        ("shared/scripts/check_no_hyphenated_catalog_content.py", ["--json", str(tmp)]),
        ("shared/scripts/check_no_new_snake_case.py", ["--all"]),
        ("shared/scripts/check_no_numbered_categories.py", ["--json", str(tmp)]),
        ("shared/scripts/check_no_numbered_snippet_files.py", ["--json", str(tmp)]),
        ("shared/scripts/resolve_skill_markdown_links.py", ["--repo-root", str(tmp)]),
        ("sk-create-feature-catalog/scripts/validate_catalog_package.py", ["--json"]),
        ("sk-create-readme/scripts/check_derived_readme_counts.py", [readme]),
        ("sk-create-readme/scripts/check_readme_references.py", [readme]),
        ("sk-create-skill/scripts/validate_skill_package.py", [str(tmp), "--json"]),
        ("sk-create-with-human-voice/scripts/hvr_scan.py", [doc, "--json"]),
    ]
    node = [
        ("shared/scripts/frontmatter-version.mjs", ["gate"]),
        ("scripts/validate-doc-model-refs.js", []),
        ("sk-create-goal/scripts/check-goal.cjs", [str(tmp)]),
        ("sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs", ["--format", "json"]),
        ("sk-create-repo-rule/scripts/check-repo-rules.cjs", []),
        ("sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs", ["--dir", str(tmp), "--format", "json"]),
        ("sk-create-skill/scripts/validate-playbook-topology.cjs", ["--format", "json"]),
    ]
    return [("python3", *entry) for entry in python] + [("node", *entry) for entry in node]


GUARDED_COUNT = 20


def test_every_guarded_validator_skips_when_the_switch_is_on(scratch):
    cases = _guarded(scratch)
    assert len(cases) == GUARDED_COUNT
    failures = []
    for runtime, relative, args in cases:
        result = run([runtime, str(SK_DOC / relative), *args], env={"SKDOC_SKIP_VALIDATION": "1"})
        tool = Path(relative).name
        notice = f"{tool}: validation skipped, SKDOC_SKIP_VALIDATION is on in the environment"
        wants_json = "--json" in args or "json" in args
        stdout_ok = json.loads(result.stdout) == SKIPPED if wants_json else result.stdout == ""
        if result.returncode != 0 or notice not in result.stderr or not stdout_ok:
            failures.append(f"{relative}: rc={result.returncode} stdout={result.stdout[:200]!r} stderr={result.stderr[:200]!r}")
    assert not failures, "\n".join(failures)


# ---------------------------------------------------------------------------
# 3. Controls: the switch, not the input, decides
# ---------------------------------------------------------------------------

def test_a_python_guard_follows_the_switch_from_either_source(tmp_path):
    (tmp_path / "feature-catalog" / "06--numbered").mkdir(parents=True)
    flags = tmp_path / "hook-flags.env"
    flags.write_text("SKDOC_SKIP_VALIDATION=on\n", encoding="utf-8")
    command = ["python3", str(SHARED / "check_no_numbered_categories.py"), str(tmp_path)]
    assert run(command).returncode == 1
    assert run(command, env={"SKDOC_SKIP_VALIDATION": "true"}).returncode == 0
    saved = run(command, env={"HOOK_FLAGS_CONFIG": str(flags)})
    assert saved.returncode == 0 and str(flags) in saved.stderr
    assert run(command, env={"HOOK_FLAGS_CONFIG": str(flags), "SKDOC_SKIP_VALIDATION": "0"}).returncode == 1


def test_a_node_guard_follows_the_switch_from_either_source(tmp_path):
    doc = tmp_path / "unversioned.md"
    doc.write_text("---\ntitle: Unversioned\n---\n# Unversioned\n", encoding="utf-8")
    manifest = tmp_path / "manifest.json"
    manifest.write_text(json.dumps([{"path": str(doc)}]), encoding="utf-8")
    flags = tmp_path / "hook-flags.env"
    flags.write_text("SKDOC_SKIP_VALIDATION=yes\n", encoding="utf-8")
    command = ["node", str(SHARED / "frontmatter-version.mjs"), "gate", "--from-manifest", str(manifest)]
    assert run(command).returncode == 1
    assert run(command, env={"SKDOC_SKIP_VALIDATION": "1"}).returncode == 0
    saved = run(command, env={"HOOK_FLAGS_CONFIG": str(flags)})
    assert saved.returncode == 0 and str(flags) in saved.stderr
    assert run(command, env={"HOOK_FLAGS_CONFIG": str(flags), "SKDOC_SKIP_VALIDATION": ""}).returncode == 1


# ---------------------------------------------------------------------------
# 4. Exemptions: writers, self-tests and the safety gate keep running
# ---------------------------------------------------------------------------

def test_writers_and_self_tests_ignore_the_switch(scratch):
    on = {"SKDOC_SKIP_VALIDATION": "1"}
    fix = run(["python3", str(SHARED / "validate_document.py"), str(scratch / "doc.md"), "--fix", "--dry-run"], env=on)
    assert "validation skipped" not in fix.stderr

    self_test = run(["python3", str(SK_DOC / "sk-create-readme/scripts/check_derived_readme_counts.py"), "--self-test"], env=on)
    assert self_test.returncode == 0 and "validation skipped" not in self_test.stderr

    empty = scratch / "paths.txt"
    empty.write_text("", encoding="utf-8")
    apply = run(["node", str(SHARED / "frontmatter-version.mjs"), "apply", "--paths", str(empty)], env=on)
    assert apply.returncode == 0 and "[apply] 0 files" in apply.stdout
    assert "validation skipped" not in apply.stderr


def test_the_report_safety_gate_ignores_the_switch(scratch):
    result = run(
        ["python3", str(SK_DOC / "sk-create-diff/scripts/validate_report.py"), str(scratch / "missing.html")],
        env={"SKDOC_SKIP_VALIDATION": "1"},
    )
    assert result.returncode == 1 and "not found" in result.stdout
