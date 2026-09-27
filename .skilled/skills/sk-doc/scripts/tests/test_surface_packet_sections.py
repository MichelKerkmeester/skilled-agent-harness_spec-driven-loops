#!/usr/bin/env python3
"""
Regression tests for the surface-packet shape in validate_document.py.

A surface packet is a read-only evidence base that a parent hub bundles beside a
workflow mode, so it has no WHEN TO USE, SMART ROUTING or HOW IT WORKS of its own.
It opens with the section that names when the hub bundles it, that section marks
the shape, and the packet is held to its evidence core instead.

Run: python3 -m pytest -q test_surface_packet_sections.py
"""

import json
import subprocess
import sys
from pathlib import Path

TESTS = Path(__file__).resolve().parent
REPO = TESTS.parents[4]
VALIDATOR = REPO / ".skilled/skills/sk-doc/shared/scripts/validate_document.py"

FRONTMATTER = (
    "---\n"
    "name: sk-example-surface\n"
    'description: "Read-only evidence for an example surface."\n'
    "allowed-tools: [Read, Bash, Grep, Glob]\n"
    "version: 0.1.0.0\n"
    "---\n\n"
    "# Example Surface\n\n"
    "Read-only evidence for an example surface.\n\n"
)

SECTIONS = {
    "bundles": "## 1. WHEN THE HUB BUNDLES THIS\n\n- The hub resolves this surface for the task.\n",
    "map": "## 2. REFERENCE MAP\n\n- `references/example.md` holds the example evidence.\n",
    "standards": "## 3. SURFACE STANDARDS (the non-negotiables)\n\n- Every change keeps the example contract.\n",
}


def missing_sections(tmp_path, keys):
    skill = tmp_path / "SKILL.md"
    body = "\n---\n\n".join(SECTIONS[key] for key in keys)
    skill.write_text(FRONTMATTER + "---\n\n" + body, encoding="utf-8")
    proc = subprocess.run(
        [sys.executable, str(VALIDATOR), str(skill), "--type", "skill", "--json"],
        cwd=REPO,
        capture_output=True,
        text=True,
        check=False,
    )
    payload = json.loads(proc.stdout)
    missing = {
        item["message"].split(": ", 1)[1]
        for item in payload.get("blocking_errors", [])
        if item.get("type") == "missing_required_section"
    }
    return proc.returncode, missing, payload


def test_surface_packet_needs_only_its_evidence_core(tmp_path):
    rc, missing, payload = missing_sections(tmp_path, ["bundles", "map", "standards"])
    assert missing == set()
    assert rc == 0, payload


def test_surface_packet_missing_a_core_section_names_that_section(tmp_path):
    rc, missing, _payload = missing_sections(tmp_path, ["bundles", "map"])
    assert missing == {"surface_standards"}
    assert rc == 1
