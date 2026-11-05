#!/usr/bin/env python3
# ---------------------------------------------------------------------------
# COMPONENT: Changelog Shape Check Tests
# ---------------------------------------------------------------------------
"""Each shape rule passes at its ceiling and fails one past it.

The published v4.0.1.0 release entry is the model for a many-change release, so
it must pass every rule as it stands. A ceiling it breaks is the wrong ceiling.

Run: python3 -m pytest -q test_check_changelog_shape.py
"""

import subprocess
import sys
from pathlib import Path

SK_DOC = Path(__file__).resolve().parents[2]
REPO_ROOT = Path(__file__).resolve().parents[5]
CHECKER = SK_DOC / "sk-create-changelog" / "scripts" / "check_changelog_shape.py"
MODEL_ENTRY = REPO_ROOT / ".skilled" / "changelog" / "skilled" / "v4.0.1.0.md"

sys.path.insert(0, str(CHECKER.parent))
from check_changelog_shape import check_entry  # type: ignore  # noqa: E402

FRONTMATTER = '---\ntitle: "demo v1.0.0.0"\n---\n'


def expanded(glance=None, sections=None, spec="> Spec folder: `specs/demo/001-demo`", padding=0):
    """Build an expanded entry: glance bullets, then one topical H2 per (name, h4_count)."""
    glance = glance if glance is not None else ["- **One gain.** It helps."]
    sections = sections if sections is not None else [("Alpha", 2)]
    parts = [FRONTMATTER, "Opening.\n", spec + "\n", "&nbsp;\n", "## Why This Release\n", "The gap.\n"]
    parts += ["&nbsp;\n", "## What's New at a Glance\n", "\n".join(glance) + "\n"]
    for name, count in sections:
        parts += ["&nbsp;\n", f"## {name}\n"]
        parts += [f"#### Item {name} {n}\n\nOne paragraph.\n" for n in range(count)]
    parts += ["&nbsp;\n", "## Upgrade Notes\n", "- **Anyone:** nothing to do.\n"]
    text = "\n".join(parts)
    return text + "\nFiller line.\n" * padding


def rules(text):
    violations, _notes = check_entry(text)
    return [rule for rule, _message in violations]


def body_lines(text):
    return len(text.splitlines()) - len(FRONTMATTER.splitlines())


def test_the_model_entry_passes_every_rule():
    violations, notes = check_entry(MODEL_ENTRY.read_text(encoding="utf-8"))
    assert violations == []
    assert notes == ["glance-order skipped: no glance bullet carries a section tag"]


def test_file_total_fails_one_line_past_240():
    base = expanded()
    at_ceiling = base + "Filler line.\n" * (240 - body_lines(base))
    assert body_lines(at_ceiling) == 240
    assert rules(at_ceiling) == []
    assert rules(at_ceiling + "One more.\n") == ["file-total"]


def test_a_compact_entry_has_no_file_total_or_h4_rule():
    compact = FRONTMATTER + "Summary.\n\n&nbsp;\n\n## What's New at a Glance\n\n- **A fix.** It works.\n\n## Upgrade\n\nNo migration required.\n"
    assert rules(compact + "Filler line.\n" * 300) == []


def test_h4_items_fail_past_26():
    assert rules(expanded(sections=[("Alpha", 13), ("Beta", 13)])) == []
    assert rules(expanded(sections=[("Alpha", 14), ("Beta", 13)])) == ["h4-items"]


def test_glance_bullets_fail_past_12():
    bullets = [f"- **Gain {n}.** It helps." for n in range(12)]
    assert rules(expanded(glance=bullets)) == []
    assert rules(expanded(glance=bullets + ["- **Gain 13.** It helps."])) == ["glance-bullets"]


def test_glance_order_follows_the_tagged_sections():
    sections = [("Alpha", 1), ("Beta", 1)]
    in_order = ["- **First.** (Alpha) It helps.", "- **Second.** (Beta) It helps.", "- **Third.** (Beta) Too."]
    assert rules(expanded(glance=in_order, sections=sections)) == []
    reversed_order = ["- **First.** (Beta) It helps.", "- **Second.** (Alpha) It helps."]
    violations, _notes = check_entry(expanded(glance=reversed_order, sections=sections))
    assert [rule for rule, _ in violations] == ["glance-order"]
    assert "(Alpha) comes after (Beta)" in violations[0][1]


def test_glance_order_fails_an_untagged_bullet_or_an_unknown_section_once_tags_are_used():
    sections = [("Alpha", 1), ("Beta", 1)]
    mixed = ["- **First.** (Alpha) It helps.", "- **Second.** It has no tag."]
    assert rules(expanded(glance=mixed, sections=sections)) == ["glance-order"]
    unknown = ["- **First.** (Gamma) It helps."]
    assert rules(expanded(glance=unknown, sections=sections)) == ["glance-order"]


def test_spec_line_fails_a_level_label():
    assert rules(expanded(spec="> Spec folder: `specs/demo/001-demo` (Level 2)")) == ["spec-line"]
    assert rules(expanded(spec="> Spec folders: `specs/a` and `specs/b` (Level 2 and 3)")) == ["spec-line"]


def test_a_spec_line_inside_a_code_fence_is_not_read():
    fenced = expanded() + "\n```markdown\n> Spec folder: `{path}` (Level {N})\n## Not A Section\n#### Not an item\n```\n"
    assert rules(fenced) == []


def test_the_command_line_exits_0_1_and_2(tmp_path):
    good = tmp_path / "good.md"
    good.write_text(expanded(), encoding="utf-8")
    bad = tmp_path / "bad.md"
    bad.write_text(expanded(spec="> Spec folder: `specs/demo` (Level 1)"), encoding="utf-8")

    def run(*args):
        return subprocess.run([sys.executable, str(CHECKER), *args], capture_output=True, text=True, check=False)

    passed = run(str(good))
    assert passed.returncode == 0, passed.stdout
    assert "SUMMARY files=1 pass=1 fail=0" in passed.stdout
    failed = run(str(good), str(bad))
    assert failed.returncode == 1
    assert f"FAIL {bad}" in failed.stdout
    assert "[spec-line]" in failed.stdout
    assert run().returncode == 2
    assert run(str(tmp_path / "missing.md")).returncode == 2
