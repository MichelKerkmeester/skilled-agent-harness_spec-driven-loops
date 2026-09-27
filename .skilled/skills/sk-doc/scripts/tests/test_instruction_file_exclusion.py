#!/usr/bin/env python3
"""
Regression tests for the instruction-file exclusion in validate_document.py.

A runtime instruction file such as AGENTS.md is the operating contract a coding
agent loads at startup, so a section added only to satisfy a readme's required
sections would load into every session. The validator skips it instead. The
match is on the exact file name, so a document whose name only starts the same
way is still validated.

Run: python3 -m pytest -q test_instruction_file_exclusion.py
"""

import json
import subprocess
import sys
from pathlib import Path

TESTS = Path(__file__).resolve().parent
REPO = TESTS.parents[4]
VALIDATOR = REPO / ".skilled/skills/sk-doc/shared/scripts/validate_document.py"

sys.path.insert(0, str(TESTS.parent))
from validate_document import should_exclude_path  # noqa: E402


def test_agents_md_is_skipped_with_no_issues(tmp_path):
    agents = tmp_path / "AGENTS.md"
    agents.write_text("# Framework\n\n## 1. CRITICAL RULES\n\nRules.\n", encoding="utf-8")
    proc = subprocess.run(
        [sys.executable, str(VALIDATOR), str(agents), "--json"],
        cwd=REPO,
        capture_output=True,
        text=True,
        check=False,
    )
    payload = json.loads(proc.stdout)
    assert proc.returncode == 0, proc.stdout + proc.stderr
    assert payload.get("skipped") is True
    assert payload.get("total_issues") == 0
    assert payload.get("skip_reason", "").startswith("Instruction file")


def test_name_that_only_starts_the_same_is_still_validated():
    assert should_exclude_path("/repo/docs/AGENTS-guide.md") == (False, None)
