#!/usr/bin/env python3
# ---------------------------------------------------------------------------
# COMPONENT: Release Notes Builder Tests
# ---------------------------------------------------------------------------
"""The release body drops the frontmatter and title and ends with the entry pointer.

Run: python3 -m pytest -q test_build_release_notes.py
"""

import subprocess
import sys
from pathlib import Path

SK_DOC = Path(__file__).resolve().parents[2]
BUILDER = SK_DOC / "sk-create-changelog" / "scripts" / "build_release_notes.py"

sys.path.insert(0, str(BUILDER.parent))
from build_release_notes import build_notes  # type: ignore  # noqa: E402

ENTRY = (
    '---\ntitle: "v9.0.0.0, Demo"\ndescription: "x"\n---\n'
    "# v9.0.0.0, Demo\n\nThe summary.\n\n&nbsp;\n\n## What's New at a Glance\n\n- **A gain.** It helps.\n"
)


def test_drops_frontmatter_and_title_and_adds_pointer():
    notes = build_notes(ENTRY, ".skilled/changelog/skilled/v9.0.0.0.md")
    assert notes.startswith("The summary.\n")
    assert "title:" not in notes and "# v9.0.0.0" not in notes
    assert notes.endswith("\n&nbsp;\n\nFull changelog: `.skilled/changelog/skilled/v9.0.0.0.md`\n")


def test_entry_without_frontmatter_keeps_its_body():
    notes = build_notes("# v9.0.0.0, Demo\n\nOnly a body.\n", "x.md")
    assert notes.startswith("Only a body.\n")


def test_unclosed_frontmatter_is_a_read_error(tmp_path):
    entry = tmp_path / "v9.0.0.0.md"
    entry.write_text('---\ntitle: "never closed"\n# v9.0.0.0\n', encoding="utf-8")
    result = subprocess.run([sys.executable, str(BUILDER), str(entry)], capture_output=True, text=True)
    assert result.returncode == 2
    assert "never closes" in result.stderr


def test_out_writes_the_file(tmp_path):
    entry = tmp_path / "v9.0.0.0.md"
    entry.write_text(ENTRY, encoding="utf-8")
    out = tmp_path / "notes.md"
    result = subprocess.run([sys.executable, str(BUILDER), str(entry), "--out", str(out)], capture_output=True, text=True)
    assert result.returncode == 0, result.stderr
    assert out.read_text(encoding="utf-8").startswith("The summary.\n")
