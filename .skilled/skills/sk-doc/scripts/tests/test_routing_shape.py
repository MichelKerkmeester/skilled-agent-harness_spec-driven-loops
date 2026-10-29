#!/usr/bin/env python3
"""
Routing-shape contract tests for package_skill.py.

The routing canon keeps a skill's SMART ROUTING section short and puts the
machine router in the skill's own sibling ROUTER.md, which SKILL.md links to.
Every skill and mode packet owns that file, and a `## MACHINE ROUTER` section
left in SKILL.md is a second home for the router. Skills still in the old shape
are listed in the known-debt ledger, keyed by their path relative to the skills
root and recording the line count, word count, machine-block count and finding
codes they were listed with, so a recorded shape is tolerated while it stays the
shape the entry describes. Every fixture here is otherwise clean, so a finding
can only come from the rule under test.

Run: /usr/bin/python3 -m pytest -q test_routing_shape.py
"""

import importlib.util
import json
import subprocess
import sys
from pathlib import Path

import pytest

SCRIPT = Path(__file__).resolve().parents[1] / "package_skill.py"


def _load_module():
    spec = importlib.util.spec_from_file_location("package_skill_routing_shape", SCRIPT)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


PACKAGE_SKILL = _load_module()


@pytest.fixture(autouse=True)
def _absent_ledger(tmp_path, monkeypatch):
    """Point every case at an absent ledger and a temp skills root, so no live debt applies."""
    monkeypatch.setenv(
        PACKAGE_SKILL.ROUTING_SHAPE_DEBT_FILE_ENV,
        str(tmp_path / "absent-routing-shape-debt.json"),
    )
    monkeypatch.setenv(PACKAGE_SKILL.ROUTING_SHAPE_SKILLS_ROOT_ENV, str(tmp_path))


def _prose(count):
    """Return `count` distinct non-blank routing prose lines."""
    return [
        f"Routing line {index + 1} names what selects this skill and what it loads first."
        for index in range(count)
    ]


def _router_block():
    return [
        "```python",
        "INTENT_SIGNALS = {'demo': ['demo task']}",
        "",
        "RESOURCE_MAP = {'demo': ['references/demo.md']}",
        "",
        "UNKNOWN_FALLBACK = {'load_level': 'UNKNOWN_FALLBACK'}",
        "",
        "def discover_markdown_resources():",
        "    return set()",
        "",
        "def _guard_in_skill(path):",
        "    return path",
        "```",
    ]


def _smart_routing_body(prose, extra):
    return [
        "### Routing Signals",
        "",
        *prose,
        "",
        "### Resource Domains",
        "",
        "- `references/` holds optional guidance.",
        *extra,
    ]


def _router_document():
    """Return a sibling ROUTER.md that declares the router in its own section."""
    return "# Demo Router\n\n## MACHINE ROUTER\n\n" + "\n".join(_router_block()) + "\n"


def _skill_document(
    name,
    prose=None,
    smart_extra=None,
    router_section=False,
    section_block=True,
    section_last=True,
    pointer=True,
):
    """Return SKILL.md text in the scaffold's section layout, with real text.

    The default is the canon shape: no machine router in SKILL.md, and a relative
    link to the sibling ROUTER.md. `router_section` writes the old shape instead,
    where the router stayed inline in a final `## MACHINE ROUTER` section.
    """
    prose = _prose(5) if prose is None else prose
    smart = "\n".join(_smart_routing_body(prose, smart_extra or []))
    pointer_line = (
        "\nStructured routing detail: [`ROUTER.md`](./ROUTER.md).\n" if pointer else ""
    )

    sections = [
        "## 1. WHEN TO USE\n\n"
        "### Activation Triggers\n\n"
        "Use this skill when:\n\n"
        "- A demo task arrives with a concrete input.\n"
        "- A demo file needs a validated routing shape.\n\n"
        "### When NOT to Use\n\n"
        "Do not use this skill for:\n\n"
        "- Tasks outside the demo family.\n",

        "## 2. SMART ROUTING\n\n" + smart + "\n",

        "## 3. HOW IT WORKS\n\n"
        "### Workflow\n\n"
        "1. Read the input the task names.\n"
        "2. Route it to the resource the routing prose names.\n"
        "3. Return the artifact the task asks for.\n\n"
        "### Output Contract\n\n"
        "Returns the validated artifact and the evidence that proves it.\n",

        "## 4. RULES\n\n"
        "### ✅ ALWAYS\n\n"
        "- Keep the routing prose short and free of code.\n\n"
        "### ❌ NEVER\n\n"
        "- Put a machine block in the routing prose.\n\n"
        "### ⚠️ ESCALATE IF\n\n"
        "- The request matches no mode and no fallback applies.\n",

        "## 5. REFERENCES\n\n"
        "### Core References\n\n"
        "- `references/demo.md` holds the demo guidance.\n"
        + pointer_line,

        "## 6. SUCCESS CRITERIA\n\n"
        "The task is complete when the artifact exists and validation passes.\n",

        "## 7. INTEGRATION POINTS\n\n"
        "### Inputs\n\n"
        "- The task description names the input it provides.\n",

        "## 8. RELATED RESOURCES\n\n"
        "- The hub `ROUTER.md` owns stage-two routing.\n",
    ]

    if router_section:
        body = "\n".join(_router_block()) if section_block else "The router lives here.\n"
        section_text = "## MACHINE ROUTER\n\n" + body + "\n"
        if section_last:
            sections.append(section_text)
        else:
            sections.insert(-1, section_text)

    frontmatter = (
        "---\n"
        f"name: {name}\n"
        "description: Demo skill fixture that validates one routing shape with real section text.\n"
        "allowed-tools: [Read, Write, Edit]\n"
        "version: 1.0.0.0\n"
        "---\n\n"
        f"# {name}\n\n"
        "Routes one demo task family and validates its routing shape.\n\n"
    )
    return frontmatter + "\n---\n\n".join(sections) + "\n"


def _write_skill(root, name="demo-skill", router_file=True, **kwargs):
    """Write a skill and, unless a case removes it, its sibling ROUTER.md."""
    skill_path = root / name
    skill_path.mkdir(parents=True, exist_ok=True)
    (skill_path / "SKILL.md").write_text(_skill_document(name, **kwargs), encoding="utf-8")
    if router_file:
        (skill_path / "ROUTER.md").write_text(_router_document(), encoding="utf-8")
    return skill_path


def _replace_pointer(skill_path, snippet):
    """Replace the default pointer line with `snippet` in SKILL.md."""
    anchor = "Structured routing detail: [`ROUTER.md`](./ROUTER.md).\n"
    content = (skill_path / "SKILL.md").read_text(encoding="utf-8")
    assert anchor in content
    (skill_path / "SKILL.md").write_text(content.replace(anchor, snippet), encoding="utf-8")


def _run_cli(skill_path):
    return subprocess.run(
        [sys.executable, str(SCRIPT), str(skill_path), "--check", "--strict"],
        capture_output=True,
        text=True,
        check=False,
    )


def _debt_entry(lines=0, words=0, machine_blocks=0, codes=()):
    """Return one known-debt entry in the shape the ledger records."""
    return {
        "lines": lines,
        "words": words,
        "machineBlocks": machine_blocks,
        "codes": list(codes),
    }


def _write_ledger(path, debt, **overrides):
    data = {"maxSmartRoutingLines": 12, "debt": debt}
    data.update(overrides)
    path.write_text(json.dumps(data), encoding="utf-8")
    return path


def test_canon_shaped_standalone_skill_passes_strict(tmp_path):
    skill_path = _write_skill(tmp_path)

    result = _run_cli(skill_path)

    assert result.returncode == 0, result.stdout
    assert "Result: PASS" in result.stdout
    assert "routing shape" not in result.stdout


def test_smart_routing_above_the_limit_fails_strict(tmp_path):
    skill_path = _write_skill(tmp_path, prose=_prose(10))
    content = (skill_path / "SKILL.md").read_text(encoding="utf-8")
    assert PACKAGE_SKILL.parse_routing_shape(content).smart_line_count == 13

    result = _run_cli(skill_path)

    assert result.returncode == 1
    assert "Result: FAIL" in result.stdout
    assert "routing shape RS-001: SMART ROUTING section has 13 lines (max 12)" in result.stdout


def test_machine_block_inside_smart_routing_fails_strict(tmp_path):
    prose = _prose(2) + [
        "discover_markdown_resources, _guard_in_skill and UNKNOWN_FALLBACK name the router.",
    ]
    skill_path = _write_skill(
        tmp_path,
        prose=prose,
        smart_extra=["", "```python", "INTENT_SIGNALS = {'demo': ['demo task']}", "```"],
    )

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is False
    assert "routing shape RS-002" in message
    assert "is outside any '## MACHINE ROUTER' section" in message
    assert "RS-001" not in message
    assert "RS-004" not in message
    assert "RS-005" not in message
    assert "missing smart-router marker" not in message


def test_machine_router_section_in_skill_md_fails_strict(tmp_path):
    # The router lives in ROUTER.md, so an inline section is a second home for it
    # even when the sibling file is there and pointed at.
    skill_path = _write_skill(tmp_path, router_section=True)
    content = (skill_path / "SKILL.md").read_text(encoding="utf-8")
    expected = _line_number(content, "## MACHINE ROUTER")

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is False
    assert "routing shape RS-002" in message
    assert (
        f"'## MACHINE ROUTER' section at line {expected} belongs in the sibling ROUTER.md"
        in message
    )
    assert "RS-001" not in message
    assert "RS-004" not in message
    assert "RS-005" not in message


def test_prose_only_machine_router_section_fails_strict(tmp_path):
    # A section that only talks about the router is still a second home, so the
    # rule cannot depend on finding a code block inside the section.
    skill_path = _write_skill(tmp_path, router_section=True, section_block=False)
    content = (skill_path / "SKILL.md").read_text(encoding="utf-8")

    assert PACKAGE_SKILL.parse_routing_shape(content).machine_block_lines == []

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is False
    assert "routing shape RS-002" in message
    assert "belongs in the sibling ROUTER.md" in message


def test_machine_router_followed_by_another_h2_fails_rules_two_and_three(tmp_path):
    skill_path = _write_skill(tmp_path, router_section=True, section_last=False)

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is False
    assert "routing shape RS-002" in message
    assert "routing shape RS-003" in message
    assert "'## MACHINE ROUTER' is not the last H2 section" in message
    assert "RS-001" not in message


def test_skill_without_a_router_pointer_fails_strict(tmp_path):
    # The router file is there and holds the router, but SKILL.md never links it,
    # so a runtime that selects the skill has no way to reach it.
    skill_path = _write_skill(tmp_path, pointer=False)

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is False
    assert "routing shape RS-005" in message
    assert "no relative markdown link to the sibling ROUTER.md" in message
    assert "RS-001" not in message
    assert "RS-002" not in message
    assert "RS-004" not in message


def test_router_pointer_to_a_missing_target_fails_strict(tmp_path):
    # A link only points when the file it names resolves beside SKILL.md, so a
    # stale path is not a pointer.
    skill_path = _write_skill(tmp_path, router_file=False)

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is False
    assert "routing shape RS-005" in message
    assert "the link to './ROUTER.md' does not resolve to a file inside the skill folder" in message


def test_fenced_pointer_sample_is_not_the_pointer(tmp_path):
    # A fenced sample describes the link grammar; it does not place the link.
    skill_path = _write_skill(
        tmp_path,
        pointer=False,
        smart_extra=["", "```markdown", "[`ROUTER.md`](./ROUTER.md)", "```"],
    )

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is False
    assert "routing shape RS-005" in message
    assert "no relative markdown link to the sibling ROUTER.md" in message


def test_angle_bracketed_pointer_target_does_not_count(tmp_path):
    # An angle-bracketed destination is a different target from the bare path,
    # so the skill is left with no pointer at all.
    skill_path = _write_skill(tmp_path)
    _replace_pointer(
        skill_path,
        "Structured routing detail: [`ROUTER.md`](<ROUTER.md>).\n",
    )

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is False
    assert "routing shape RS-005" in message
    assert "no relative markdown link to the sibling ROUTER.md" in message


def test_pointer_with_trailing_text_does_not_count(tmp_path):
    # The destination is compared as written, so a note after the path makes it
    # a different target rather than the sibling link.
    skill_path = _write_skill(tmp_path)
    _replace_pointer(
        skill_path,
        "Structured routing detail: [`ROUTER.md`](ROUTER.md extra text).\n",
    )

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is False
    assert "routing shape RS-005" in message
    assert "no relative markdown link to the sibling ROUTER.md" in message


def test_pointer_label_split_across_lines_does_not_count(tmp_path):
    # A markdown link's label cannot wrap, so the two lines are prose rather
    # than a pointer.
    skill_path = _write_skill(tmp_path)
    _replace_pointer(
        skill_path,
        "Structured routing detail: [`ROUTER.md`\n](./ROUTER.md).\n",
    )

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is False
    assert "routing shape RS-005" in message
    assert "no relative markdown link to the sibling ROUTER.md" in message


def test_pointer_only_in_the_frontmatter_does_not_count(tmp_path):
    # The frontmatter describes the skill rather than pointing from its body,
    # so a link there is not the pointer a reader follows.
    skill_path = _write_skill(tmp_path, pointer=False)
    content = (skill_path / "SKILL.md").read_text(encoding="utf-8")
    (skill_path / "SKILL.md").write_text(
        content.replace(
            "description: Demo skill fixture that validates one routing shape with real section text.",
            "description: Demo skill fixture whose description links [ROUTER.md](./ROUTER.md).",
        ),
        encoding="utf-8",
    )

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is False
    assert "routing shape RS-005" in message
    assert "no relative markdown link to the sibling ROUTER.md" in message


def test_pointer_to_a_child_router_does_not_count(tmp_path):
    # A path through a child folder names that folder's router, not the sibling
    # file the skill owns, even when that child file exists.
    skill_path = _write_skill(tmp_path)
    (skill_path / "child").mkdir()
    (skill_path / "child" / "ROUTER.md").write_text(_router_document(), encoding="utf-8")
    _replace_pointer(
        skill_path,
        "Structured routing detail: [`ROUTER.md`](./child/ROUTER.md).\n",
    )

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is False
    assert "routing shape RS-005" in message
    assert "no relative markdown link to the sibling ROUTER.md" in message


def test_pointer_on_a_heading_line_counts(tmp_path):
    # The link may sit on any body line, so a heading that carries the pointer
    # points at the router just as a prose line does.
    skill_path = _write_skill(tmp_path, pointer=False)
    content = (skill_path / "SKILL.md").read_text(encoding="utf-8")
    (skill_path / "SKILL.md").write_text(
        content.replace(
            "### Core References\n",
            "### Core References: [ROUTER.md](./ROUTER.md)\n",
        ),
        encoding="utf-8",
    )

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is True, message


def test_skill_without_its_own_router_file_fails_strict(tmp_path):
    skill_path = _write_skill(tmp_path, router_file=False)

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is False
    assert "routing shape RS-004" in message
    assert "no sibling ROUTER.md beside SKILL.md" in message
    assert "RS-002" not in message


def test_router_file_that_is_a_directory_fails_strict(tmp_path):
    # The rule needs a regular file: a directory sits at the path but cannot be
    # the document SKILL.md points at.
    skill_path = _write_skill(tmp_path, router_file=False)
    (skill_path / "ROUTER.md").mkdir()

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is False
    assert "routing shape RS-004" in message
    assert "is not a regular file" in message
    assert "no sibling ROUTER.md beside SKILL.md" not in message


def test_router_file_whose_real_path_leaves_the_folder_fails_strict(tmp_path):
    # A symlink out of the folder would let two skills share one declaration, so
    # the skill that never moved would look moved.
    shared = tmp_path / "shared-router.md"
    shared.write_text(_router_document(), encoding="utf-8")
    skill_path = _write_skill(tmp_path, router_file=False)
    (skill_path / "ROUTER.md").symlink_to(shared)

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is False
    assert "routing shape RS-004" in message
    assert "resolves outside the skill folder" in message


def test_mode_packet_with_its_own_router_md_passes_strict(tmp_path):
    hub = tmp_path / "demo-hub"
    hub.mkdir()
    (hub / "mode-registry.json").write_text(
        json.dumps({"skill": "demo-hub", "modes": [{"packet": "demo-packet"}]}),
        encoding="utf-8",
    )
    packet = _write_skill(hub, "demo-packet")

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(packet, strict=True)

    assert valid is True, message


def test_mode_packet_without_its_own_router_md_fails_strict(tmp_path):
    hub = tmp_path / "demo-hub"
    hub.mkdir()
    (hub / "mode-registry.json").write_text(
        json.dumps({"skill": "demo-hub", "modes": [{"packet": "demo-packet"}]}),
        encoding="utf-8",
    )
    packet = _write_skill(hub, "demo-packet", router_file=False)

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(packet, strict=True)

    assert valid is False
    assert "routing shape RS-004" in message
    assert "no sibling ROUTER.md beside SKILL.md" in message


def test_known_debt_tolerates_the_recorded_count_and_fails_growth(tmp_path, monkeypatch):
    debt = {
        key: _debt_entry(lines=20, words=400, codes=["RS-001"])
        for key in ("under/demo-skill", "at/demo-skill", "over/demo-skill")
    }
    ledger = _write_ledger(tmp_path / "ledger.json", debt)
    monkeypatch.setenv(PACKAGE_SKILL.ROUTING_SHAPE_DEBT_FILE_ENV, str(ledger))
    advisory = "routing shape: known debt, RS-001 (migrate to the routing canon)"

    under = _write_skill(tmp_path / "under", "demo-skill", prose=_prose(15))
    valid, message, warnings = PACKAGE_SKILL.validate_skill(under, strict=True)
    assert valid is True, message
    assert advisory in warnings
    assert not any("routing shape RS-" in warning for warning in warnings)

    at = _write_skill(tmp_path / "at", "demo-skill", prose=_prose(17))
    valid, message, warnings = PACKAGE_SKILL.validate_skill(at, strict=True)
    assert valid is True, message
    assert advisory in warnings

    over = _write_skill(tmp_path / "over", "demo-skill", prose=_prose(18))
    valid, message, _warnings = PACKAGE_SKILL.validate_skill(over, strict=True)
    assert valid is False
    assert (
        "routing shape RS-001: SMART ROUTING section has 21 lines (max 12) "
        "(grew past its recorded known debt of 20 lines)"
    ) in message


def test_clean_skill_with_a_ledger_entry_reports_it_stale(tmp_path, monkeypatch):
    ledger = _write_ledger(tmp_path / "ledger.json", {"demo-skill": _debt_entry()})
    monkeypatch.setenv(PACKAGE_SKILL.ROUTING_SHAPE_DEBT_FILE_ENV, str(ledger))
    skill_path = _write_skill(tmp_path)

    valid, message, warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is True, message
    assert "routing shape: known-debt entry is stale; remove demo-skill" in warnings


def test_debt_does_not_cover_a_code_its_entry_omits(tmp_path, monkeypatch):
    hub = tmp_path / "demo-hub"
    hub.mkdir()
    (hub / "mode-registry.json").write_text(
        json.dumps({"skill": "demo-hub", "modes": [{"packet": "demo-packet"}]}),
        encoding="utf-8",
    )
    packet = _write_skill(hub, "demo-packet", router_file=False, pointer=False)
    ledger = _write_ledger(
        tmp_path / "ledger.json",
        {"demo-hub/demo-packet": _debt_entry(codes=["RS-001"])},
    )
    monkeypatch.setenv(PACKAGE_SKILL.ROUTING_SHAPE_DEBT_FILE_ENV, str(ledger))

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(packet, strict=True)

    assert valid is False
    assert "routing shape RS-004" in message
    assert "(not recorded in its known debt)" in message


def test_recorded_rs_004_tolerates_a_missing_router_file(tmp_path, monkeypatch):
    # The ledger exists for a skill whose router has not moved yet, so the
    # missing sibling file is the one RS-004 cause a recorded code excuses.
    skill_path = _write_skill(
        tmp_path,
        router_file=False,
        pointer=False,
        prose=[
            *_prose(2),
            "discover_markdown_resources, _guard_in_skill and UNKNOWN_FALLBACK name the router.",
        ],
    )
    ledger = _write_ledger(
        tmp_path / "ledger.json",
        {"demo-skill": _debt_entry(codes=["RS-004", "RS-005"])},
    )
    monkeypatch.setenv(PACKAGE_SKILL.ROUTING_SHAPE_DEBT_FILE_ENV, str(ledger))

    valid, message, warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is True, message
    assert "routing shape: known debt, RS-004, RS-005 (migrate to the routing canon)" in warnings


def test_recorded_rs_004_does_not_tolerate_a_router_outside_the_folder(tmp_path, monkeypatch):
    # The ledger records a router that has not moved yet, not a file that hands
    # the skill someone else's router.
    shared = tmp_path / "shared-router.md"
    shared.write_text(_router_document(), encoding="utf-8")
    skill_path = _write_skill(tmp_path, router_file=False)
    (skill_path / "ROUTER.md").symlink_to(shared)
    ledger = _write_ledger(
        tmp_path / "ledger.json",
        {"demo-skill": _debt_entry(codes=["RS-004", "RS-005"])},
    )
    monkeypatch.setenv(PACKAGE_SKILL.ROUTING_SHAPE_DEBT_FILE_ENV, str(ledger))

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is False
    assert "routing shape RS-004" in message
    assert "resolves outside the skill folder" in message
    assert "a recorded RS-004 tolerates only a missing ROUTER.md" in message


def _machine_block(code_line):
    return ["", "```python", code_line, "```"]


def test_recorded_rs_002_does_not_tolerate_a_machine_block_in_smart_routing(tmp_path, monkeypatch):
    # A recorded RS-002 is the router section a skill still keeps at the end of
    # SKILL.md, never a machine block in the routing prose, so the block fails
    # even though the entry records the code.
    ledger = _write_ledger(
        tmp_path / "ledger.json",
        {"demo-skill": _debt_entry(machine_blocks=1, codes=["RS-002"])},
    )
    monkeypatch.setenv(PACKAGE_SKILL.ROUTING_SHAPE_DEBT_FILE_ENV, str(ledger))
    skill_path = _write_skill(
        tmp_path,
        smart_extra=_machine_block("INTENT_SIGNALS = {'demo': ['demo task']}"),
    )

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is False
    assert "routing shape RS-002" in message
    assert "is outside any '## MACHINE ROUTER' section" in message
    assert "a recorded RS-002 tolerates only a trailing '## MACHINE ROUTER' section" in message


def test_recorded_rs_002_tolerates_the_trailing_machine_router_section(tmp_path, monkeypatch):
    # The migration ledger records the router section a skill still keeps at the
    # end of SKILL.md, so that shape passes until the router moves.
    ledger = _write_ledger(
        tmp_path / "ledger.json",
        {"demo-skill": _debt_entry(machine_blocks=1, codes=["RS-002"])},
    )
    monkeypatch.setenv(PACKAGE_SKILL.ROUTING_SHAPE_DEBT_FILE_ENV, str(ledger))
    skill_path = _write_skill(tmp_path, router_section=True)

    valid, message, warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is True, message
    assert "routing shape: known debt, RS-002 (migrate to the routing canon)" in warnings


def test_skill_outside_the_skills_root_is_never_debt(tmp_path, monkeypatch):
    skills_root = tmp_path / "skills"
    skills_root.mkdir()
    monkeypatch.setenv(PACKAGE_SKILL.ROUTING_SHAPE_SKILLS_ROOT_ENV, str(skills_root))
    ledger = _write_ledger(
        tmp_path / "ledger.json",
        {"demo-skill": _debt_entry(lines=20, words=400, codes=["RS-001"])},
    )
    monkeypatch.setenv(PACKAGE_SKILL.ROUTING_SHAPE_DEBT_FILE_ENV, str(ledger))

    outside = _write_skill(tmp_path / "elsewhere", "demo-skill", prose=_prose(15))
    valid, message, _warnings = PACKAGE_SKILL.validate_skill(outside, strict=True)

    assert PACKAGE_SKILL._routing_shape_key(outside) is None
    assert valid is False
    assert "routing shape RS-001: SMART ROUTING section has 18 lines (max 12)" in message
    assert "known debt" not in message


def test_unreadable_ledger_does_not_excuse_a_recorded_skill(tmp_path, monkeypatch):
    ledger = tmp_path / "ledger.json"
    ledger.write_text("{not json", encoding="utf-8")
    monkeypatch.setenv(PACKAGE_SKILL.ROUTING_SHAPE_DEBT_FILE_ENV, str(ledger))
    skill_path = _write_skill(tmp_path, prose=_prose(15))

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is False
    assert "routing shape RS-001: SMART ROUTING section has 18 lines (max 12)" in message


def test_old_format_integer_entry_is_ignored(tmp_path, monkeypatch):
    ledger = _write_ledger(tmp_path / "ledger.json", {"demo-skill": 20})
    monkeypatch.setenv(PACKAGE_SKILL.ROUTING_SHAPE_DEBT_FILE_ENV, str(ledger))
    skill_path = _write_skill(tmp_path, prose=_prose(15))

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is False
    assert "routing shape RS-001: SMART ROUTING section has 18 lines (max 12)" in message
    assert "known debt" not in message


def test_smart_routing_word_cap_fails_strict_within_the_line_cap(tmp_path):
    long_prose = [
        " ".join(f"routing-token-{index}-{word}" for word in range(50))
        for index in range(4)
    ]
    skill_path = _write_skill(tmp_path, prose=long_prose)
    shape = PACKAGE_SKILL.parse_routing_shape(
        (skill_path / "SKILL.md").read_text(encoding="utf-8")
    )
    assert shape.smart_line_count == 7
    assert shape.smart_word_count == 211

    result = _run_cli(skill_path)

    assert result.returncode == 1
    assert "Result: FAIL" in result.stdout
    assert "routing shape RS-001: SMART ROUTING section has 211 words (max 180)" in result.stdout


def test_fenced_h2_line_is_not_read_as_a_section(tmp_path):
    skill_path = _write_skill(
        tmp_path,
        smart_extra=["", "```markdown", "## 9. NOT A SECTION", "## MACHINE ROUTER", "```"],
    )
    content = (skill_path / "SKILL.md").read_text(encoding="utf-8")
    shape = PACKAGE_SKILL.parse_routing_shape(content)

    assert shape.appendix is None
    # Five prose lines, the two routing subheads, the domain bullet and the
    # four fenced lines stay inside the SMART ROUTING body.
    assert shape.smart_line_count == 12

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)
    assert valid is True, message


def test_markers_in_the_inline_appendix_satisfy_the_marker_check(tmp_path):
    # An unmoved skill still declares in its SKILL.md appendix, and the marker
    # check keeps reading that body until the router moves.
    skill_path = _write_skill(tmp_path, router_section=True)
    content = (skill_path / "SKILL.md").read_text(encoding="utf-8")
    prose, _, appendix_body = content.partition("## MACHINE ROUTER")

    for marker in PACKAGE_SKILL.SMART_ROUTER_MARKERS:
        assert marker not in prose
        assert marker in appendix_body

    _valid, _message, warnings = PACKAGE_SKILL.validate_smart_router(content)
    assert warnings == []


def test_markers_in_the_sibling_router_satisfy_the_marker_check(tmp_path):
    # Once the router moves out, the pseudocode lives in ROUTER.md, so the check
    # reads that file instead of failing every skill that moved.
    skill_path = _write_skill(tmp_path)
    content = (skill_path / "SKILL.md").read_text(encoding="utf-8")

    for marker in PACKAGE_SKILL.SMART_ROUTER_MARKERS:
        assert marker not in content

    valid, message, warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is True, message
    assert not any("smart-router marker" in warning for warning in warnings)


def _line_number(content, needle):
    """Return the 1-based line number of the first line containing `needle`."""
    return next(
        index
        for index, line in enumerate(content.split("\n"), start=1)
        if needle in line
    )


def test_unfenced_indented_machine_block_in_smart_routing_fails_strict(tmp_path):
    skill_path = _write_skill(
        tmp_path,
        prose=_prose(3),
        smart_extra=[
            "",
            "    INTENT_SIGNALS = {'demo': ['demo task']}",
            "",
            "    RESOURCE_MAP = {'demo': ['references/demo.md']}",
        ],
    )
    content = (skill_path / "SKILL.md").read_text(encoding="utf-8")
    expected = _line_number(content, "INTENT_SIGNALS")
    shape = PACKAGE_SKILL.parse_routing_shape(content)

    assert expected in shape.machine_block_lines
    assert shape.smart_line_count == 8

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is False
    assert message.count("routing shape RS-002") == 1
    assert f"machine router block at line {expected} is outside" in message
    assert "RS-001" not in message


def test_machine_block_nested_in_a_four_backtick_fence_fails_strict(tmp_path):
    skill_path = _write_skill(
        tmp_path,
        prose=_prose(3),
        smart_extra=[
            "",
            "````markdown",
            "```python",
            "INTENT_SIGNALS = {'demo': ['demo task']}",
            "```",
            "````",
        ],
    )
    content = (skill_path / "SKILL.md").read_text(encoding="utf-8")
    expected = _line_number(content, "````markdown")
    shape = PACKAGE_SKILL.parse_routing_shape(content)

    assert expected in shape.machine_block_lines
    assert shape.smart_line_count == 11

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is False
    assert message.count("routing shape RS-002") == 1
    assert f"machine router block at line {expected} is outside" in message
    assert "RS-001" not in message


def test_unknown_fallback_checklist_is_a_machine_block(tmp_path):
    block = ["", "```python", "UNKNOWN_FALLBACK_CHECKLIST = ['load_level']", "```"]
    skill_path = _write_skill(tmp_path, smart_extra=block)
    content = (skill_path / "SKILL.md").read_text(encoding="utf-8")
    expected = _line_number(content, "```python")

    assert expected in PACKAGE_SKILL.parse_routing_shape(content).machine_block_lines

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is False
    assert "routing shape RS-002" in message
    assert f"machine router block at line {expected} is outside" in message
    assert "RS-001" not in message

    # The same block appended after the routing prose is still a machine router
    # in SKILL.md, so the rule reports it wherever it sits.
    (skill_path / "SKILL.md").write_text(
        _skill_document("demo-skill").rstrip("\n") + "\n\n" + "\n".join(block[1:]) + "\n",
        encoding="utf-8",
    )
    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is False
    assert message.count("routing shape RS-002") == 1
    assert "is outside any '## MACHINE ROUTER' section" in message


def test_four_backtick_fence_hides_a_machine_router_heading(tmp_path):
    skill_path = _write_skill(
        tmp_path,
        prose=_prose(3),
        smart_extra=[
            "",
            "````markdown",
            "```",
            "## MACHINE ROUTER",
            "```",
            "````",
        ],
    )
    content = (skill_path / "SKILL.md").read_text(encoding="utf-8")
    shape = PACKAGE_SKILL.parse_routing_shape(content)

    # The inner three-backtick run does not close the outer four-backtick fence,
    # so the sample heading never becomes the section that RS-002 reports.
    assert shape.appendix is None
    assert shape.machine_block_lines == []
    assert shape.smart_line_count == 11

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)
    assert valid is True, message
