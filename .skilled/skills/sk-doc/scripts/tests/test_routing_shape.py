#!/usr/bin/env python3
"""
Routing-shape contract tests for package_skill.py.

The routing canon keeps a skill's SMART ROUTING section short, puts any machine
router block in a final `## MACHINE ROUTER` section, and forbids a mode packet
from carrying its own ROUTER.md. Skills still in the old shape are listed in the
known-debt ledger, keyed by their path relative to the skills root and recording
the line count, word count, machine-block count and finding codes they were
listed with, so a recorded shape is tolerated and one that grows fails. Every
fixture here is otherwise clean, so a finding can only come from the rule under
test.

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


def _appendix_block():
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


def _skill_document(name, prose=None, smart_extra=None, appendix=True, appendix_last=True):
    """Return SKILL.md text in the scaffold's section layout, with real text."""
    prose = _prose(5) if prose is None else prose
    smart = "\n".join(_smart_routing_body(prose, smart_extra or []))

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
        "- `references/demo.md` holds the demo guidance.\n",

        "## 6. SUCCESS CRITERIA\n\n"
        "The task is complete when the artifact exists and validation passes.\n",

        "## 7. INTEGRATION POINTS\n\n"
        "### Inputs\n\n"
        "- The task description names the input it provides.\n",

        "## 8. RELATED RESOURCES\n\n"
        "- The hub `ROUTER.md` owns stage-two routing.\n",
    ]

    appendix_section = "## MACHINE ROUTER\n\n" + "\n".join(_appendix_block()) + "\n"
    if appendix:
        if appendix_last:
            sections.append(appendix_section)
        else:
            sections.insert(-1, appendix_section)

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


def _write_skill(root, name="demo-skill", **kwargs):
    skill_path = root / name
    skill_path.mkdir(parents=True, exist_ok=True)
    (skill_path / "SKILL.md").write_text(_skill_document(name, **kwargs), encoding="utf-8")
    return skill_path


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
        appendix=False,
    )

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is False
    assert "routing shape RS-002" in message
    assert "is outside a final '## MACHINE ROUTER' section" in message
    assert "RS-001" not in message
    assert "missing smart-router marker" not in message


def test_machine_router_followed_by_another_h2_fails_strict(tmp_path):
    skill_path = _write_skill(tmp_path, appendix_last=False)

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is False
    assert "routing shape RS-003" in message
    assert "'## MACHINE ROUTER' is not the last H2 section" in message
    assert "RS-001" not in message
    assert "RS-002" not in message


def test_mode_packet_with_its_own_router_md_fails_strict(tmp_path):
    hub = tmp_path / "demo-hub"
    hub.mkdir()
    (hub / "mode-registry.json").write_text(
        json.dumps({"skill": "demo-hub", "modes": [{"packet": "demo-packet"}]}),
        encoding="utf-8",
    )
    packet = _write_skill(hub, "demo-packet")

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(packet, strict=True)
    assert valid is True, message

    (packet / "ROUTER.md").write_text("# Packet Router\n", encoding="utf-8")
    valid, message, _warnings = PACKAGE_SKILL.validate_skill(packet, strict=True)

    assert valid is False
    assert "routing shape RS-004" in message
    assert "mode packet carries its own ROUTER.md" in message


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


def test_hub_packet_debt_does_not_cover_a_new_finding_code(tmp_path, monkeypatch):
    hub = tmp_path / "demo-hub"
    hub.mkdir()
    (hub / "mode-registry.json").write_text(
        json.dumps({"skill": "demo-hub", "modes": [{"packet": "demo-packet"}]}),
        encoding="utf-8",
    )
    packet = _write_skill(hub, "demo-packet")
    ledger = _write_ledger(
        tmp_path / "ledger.json",
        {"demo-hub/demo-packet": _debt_entry(codes=["RS-001"])},
    )
    monkeypatch.setenv(PACKAGE_SKILL.ROUTING_SHAPE_DEBT_FILE_ENV, str(ledger))

    (packet / "ROUTER.md").write_text("# Packet Router\n", encoding="utf-8")
    valid, message, _warnings = PACKAGE_SKILL.validate_skill(packet, strict=True)

    assert valid is False
    assert "routing shape RS-004" in message
    assert "(not recorded in its known debt)" in message


def _machine_block(code_line):
    return ["", "```python", code_line, "```"]


def test_recorded_machine_block_debt_tolerates_the_recorded_count(tmp_path, monkeypatch):
    marker = "discover_markdown_resources, _guard_in_skill and UNKNOWN_FALLBACK name the router."
    ledger = _write_ledger(
        tmp_path / "ledger.json",
        {"demo-skill": _debt_entry(machine_blocks=1, codes=["RS-002"])},
    )
    monkeypatch.setenv(PACKAGE_SKILL.ROUTING_SHAPE_DEBT_FILE_ENV, str(ledger))

    skill_path = _write_skill(
        tmp_path,
        prose=[marker],
        smart_extra=_machine_block("INTENT_SIGNALS = {'demo': ['demo task']}"),
        appendix=False,
    )
    valid, message, warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)
    assert valid is True, message
    assert "routing shape: known debt, RS-002 (migrate to the routing canon)" in warnings

    (skill_path / "SKILL.md").write_text(
        _skill_document(
            "demo-skill",
            prose=[marker],
            smart_extra=(
                _machine_block("INTENT_SIGNALS = {'demo': ['demo task']}")
                + _machine_block("RESOURCE_MAP = {'demo': ['references/demo.md']}")
            ),
            appendix=False,
        ),
        encoding="utf-8",
    )
    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)
    assert valid is False
    assert message.count("routing shape RS-002") == 2
    assert message.count("(grew past its recorded known debt of 1 machine block(s))") == 2


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

    assert shape.appendix is not None
    assert shape.appendix.is_last is True
    # Five prose lines, the two routing subheads, the domain bullet and the
    # four fenced lines stay inside the SMART ROUTING body.
    assert shape.smart_line_count == 12

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)
    assert valid is True, message


def test_markers_in_the_machine_router_body_satisfy_the_marker_check(tmp_path):
    skill_path = _write_skill(tmp_path)
    content = (skill_path / "SKILL.md").read_text(encoding="utf-8")
    prose, _, appendix_body = content.partition("## MACHINE ROUTER")

    for marker in PACKAGE_SKILL.SMART_ROUTER_MARKERS:
        assert marker not in prose
        assert marker in appendix_body

    _valid, _message, warnings = PACKAGE_SKILL.validate_smart_router(content)
    assert warnings == []


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

    (skill_path / "SKILL.md").write_text(
        _skill_document("demo-skill").rstrip("\n") + "\n\n" + "\n".join(block[1:]) + "\n",
        encoding="utf-8",
    )
    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is True, message
    assert "routing shape RS-002" not in message


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

    assert shape.appendix is not None
    assert shape.appendix.is_last is True
    assert shape.smart_line_count == 11
    assert len(shape.machine_block_lines) == 1
    assert shape.machine_block_lines[0] == _line_number(content, "```python")

    valid, message, _warnings = PACKAGE_SKILL.validate_skill(skill_path, strict=True)

    assert valid is True, message
    assert "routing shape RS-" not in message
