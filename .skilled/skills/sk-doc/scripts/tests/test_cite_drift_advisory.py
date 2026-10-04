#!/usr/bin/env python3
"""The citation drift advisory at the end of validate_document.py's human report.

A stub `jev` first on PATH answers the version, credential and noul shapes, and
JEV_TRANSPORT=jev keeps every call on that stub, so no test reaches a backend.
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
TARGET = ".skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs"
CITATION = f"The scan entry `{TARGET}:1` opens the module."
STUB = """#!/bin/sh
echo "$@" >> "$STUB_LOG"
case "$1" in
  --version) echo 'jev 0.6.2' ;;
  auth) exit "${STUB_AUTH_EXIT:-0}" ;;
  noul) cat > /dev/null; printf '{"answers":{"answer":{"noul":%s}}}\\n' "${STUB_NOUL:-0.9}" ;;
  *) exit 2 ;;
esac
"""
CLEARED = ("JEV_PROVIDER", "SKDOC_CITE_DRIFT_CHECK", "SKDOC_CITE_DRIFT_OUT", "SKDOC_SKIP_VALIDATION", "HOOK_FLAGS_CONFIG")


def fixture_doc(tmp_path: Path, source: str) -> Path:
    """Copy a sibling fixture to README.md with one in-range citation under its first section."""
    out = []
    added = False
    for line in (TESTS / source).read_text(encoding="utf-8").splitlines(keepends=True):
        out.append(line)
        if not added and line.startswith("## 1."):
            out.append("\n" + CITATION + "\n")
            added = True
    assert added, source
    doc = tmp_path / "doc" / "README.md"
    doc.parent.mkdir()
    doc.write_text("".join(out), encoding="utf-8")
    return doc


@pytest.fixture
def stub(tmp_path: Path) -> Path:
    bin_dir = tmp_path / "bin"
    bin_dir.mkdir()
    jev = bin_dir / "jev"
    jev.write_text(STUB, encoding="utf-8")
    jev.chmod(0o755)
    return bin_dir


def run(doc: Path, bin_dir: Path, tmp_path: Path, *extra: str, **env_extra: str) -> subprocess.CompletedProcess:
    env = {key: value for key, value in os.environ.items() if key not in CLEARED}
    env.update({
        "PATH": f"{bin_dir}{os.pathsep}{os.environ.get('PATH', '')}",
        "JEV_TRANSPORT": "jev",
        "STUB_LOG": str(tmp_path / "stub.log"),
    })
    env.update(env_extra)
    return subprocess.run(
        [sys.executable, str(VALIDATOR), str(doc), *extra],
        cwd=REPO,
        env=env,
        capture_output=True,
        text=True,
        check=False,
    )


def stub_calls(tmp_path: Path) -> list:
    log = tmp_path / "stub.log"
    return log.read_text(encoding="utf-8").splitlines() if log.exists() else []


@pytest.mark.parametrize("source, code", [("valid-readme.md", 0), ("missing-sections.md", 1)])
def test_flags_never_change_the_exit_code(tmp_path, stub, source, code):
    doc = fixture_doc(tmp_path, source)
    flagged = run(doc, stub, tmp_path, STUB_NOUL="0.1")
    clean = run(doc, stub, tmp_path, STUB_NOUL="0.9")
    skipped = run(doc, stub, tmp_path, SKDOC_CITE_DRIFT_CHECK="0")
    assert flagged.returncode == clean.returncode == skipped.returncode == code
    assert f"cites {TARGET}:1, whose window may no longer show the claim" in flagged.stdout
    assert "checked=1 flagged=1 unchecked=0" in flagged.stdout
    assert "checked=1 flagged=0 unchecked=0" in clean.stdout
    assert "cite-drift advisory:" not in skipped.stdout


def test_silent_without_a_credential(tmp_path, stub):
    doc = fixture_doc(tmp_path, "valid-readme.md")
    skipped = run(doc, stub, tmp_path, SKDOC_CITE_DRIFT_CHECK="0")
    no_auth = run(doc, stub, tmp_path, STUB_AUTH_EXIT="1")
    assert no_auth.returncode == skipped.returncode == 0
    assert no_auth.stdout == skipped.stdout
    assert stub_calls(tmp_path) == ["--version", "auth status --provider official"]


def test_opt_out_never_runs_the_check(tmp_path, stub):
    doc = fixture_doc(tmp_path, "valid-readme.md")
    out_dir = tmp_path / "calls"
    result = run(doc, stub, tmp_path, SKDOC_CITE_DRIFT_CHECK="0", SKDOC_CITE_DRIFT_OUT=str(out_dir), STUB_NOUL="0.1")
    assert result.returncode == 0
    assert "cite-drift advisory:" not in result.stdout
    assert stub_calls(tmp_path) == []
    assert not out_dir.exists()


@pytest.mark.parametrize("flag", ["--json", "--blocking-only"])
def test_json_and_blocking_only_skip_the_check(tmp_path, stub, flag):
    doc = fixture_doc(tmp_path, "valid-readme.md")
    result = run(doc, stub, tmp_path, flag, STUB_NOUL="0.1")
    assert result.returncode == 0
    assert "cite-drift advisory:" not in result.stdout
    if flag == "--json":
        json.loads(result.stdout)
    assert stub_calls(tmp_path) == []


def test_records_calls_when_asked(tmp_path, stub):
    doc = fixture_doc(tmp_path, "valid-readme.md")
    out_dir = tmp_path / "calls"
    result = run(doc, stub, tmp_path, STUB_NOUL="0.1", SKDOC_CITE_DRIFT_OUT=str(out_dir))
    assert result.returncode == 0
    calls = [json.loads(line) for line in (out_dir / "calls.jsonl").read_text(encoding="utf-8").splitlines()]
    assert len(calls) == 1
    assert calls[0]["mode"] == "advise"
    assert calls[0]["flag"] is True
