#!/usr/bin/env python3
"""The SKILL.md template's Size Limits table must match the packager's constants."""

from __future__ import annotations

import importlib.util
import re
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parents[1]
TEMPLATE = SCRIPTS.parent / "sk-create-skill" / "assets" / "skill" / "skill-md-template.md"

# Table row label -> (package_skill.py constant it states, what packaging does above it).
RS_001 = "Warns with RS-001, an error under `--strict`, which packaging runs"
ROWS = {
    "SKILL.md words": ("MAX_SKILL_MD_WORDS", "Fails the check"),
    "SKILL.md recommended words": ("RECOMMENDED_MAX_WORDS", "Warns"),
    "SKILL.md lines": ("MAX_SKILL_MD_LINES", "Warns"),
    "SMART ROUTING non-blank lines": ("ROUTING_SHAPE_MAX_LINES", RS_001),
    "SMART ROUTING words": ("ROUTING_SHAPE_MAX_WORDS", RS_001),
}


def _load_package_skill():
    spec = importlib.util.spec_from_file_location("package_skill", SCRIPTS / "package_skill.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _size_table(text: str) -> dict:
    section = re.search(r"^### Size Limits\n(.*?)(?=^#{2,3} |\Z)", text, re.M | re.S)
    assert section, "skill-md-template.md has no '### Size Limits' table"
    rows = {}
    for line in section.group(1).splitlines():
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if len(cells) >= 3 and cells[1].isdigit():
            rows[cells[0]] = (int(cells[1]), cells[2])
    return rows


def test_size_table_matches_package_skill_constants():
    module = _load_package_skill()
    rows = _size_table(TEMPLATE.read_text(encoding="utf-8"))
    assert set(rows) == set(ROWS), f"Size Limits rows {sorted(rows)} differ from {sorted(ROWS)}"
    for label, (constant, effect) in ROWS.items():
        value, stated_effect = rows[label]
        assert value == getattr(module, constant), (
            f"Size Limits row '{label}' says {value}, "
            f"package_skill.py {constant} is {getattr(module, constant)}"
        )
        assert stated_effect == effect, f"Size Limits row '{label}' says '{stated_effect}', expected '{effect}'"


def test_word_limit_fails_and_line_limit_warns():
    """The effects the table states are the ones packaging applies."""
    module = _load_package_skill()
    limit = module.MAX_SKILL_MD_WORDS
    too_many_words = "---\nname: x\n---\n" + "word " * (limit + 1)
    valid, _message, _warnings = module.validate_content_size(too_many_words)
    assert valid is False
    too_many_lines = "---\nname: x\n---\n" + "w\n" * (module.MAX_SKILL_MD_LINES + 1)
    valid, _message, warnings = module.validate_content_size(too_many_lines)
    assert valid is True and any("lines" in warning for warning in warnings)


def test_template_has_one_size_table():
    text = TEMPLATE.read_text(encoding="utf-8")
    assert len(re.findall(r"^### Size Limits$", text, re.M)) == 1
