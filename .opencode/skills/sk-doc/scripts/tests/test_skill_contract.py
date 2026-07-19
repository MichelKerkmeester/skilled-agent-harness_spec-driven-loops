#!/usr/bin/env python3
"""Contract loaders (Python + Node) and contract-vs-template order guards.

The machine-readable skill contract is the single source of truth for the
create-skill layer. These tests assert both language loaders read the same
budget and that the canonical scaffold template's section order matches the
contract, so a future edit to one cannot silently drift from the other.
"""

import importlib.util
import re
import subprocess
from pathlib import Path

_SK_DOC = Path(__file__).resolve().parents[2]
_SHARED_SCRIPTS = _SK_DOC / "shared" / "scripts"
_CREATE_SKILL = _SK_DOC / "create-skill"


def _load_contract_module():
    path = _SHARED_SCRIPTS / "skill_contract.py"
    spec = importlib.util.spec_from_file_location("skill_contract", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_python_loader_reads_budget():
    contract = _load_contract_module()
    assert contract.description_budget("skill")["softMax"] == 130
    assert contract.description_budget("command")["softMax"] == 110


def test_node_loader_reads_same_budget():
    cjs = _SHARED_SCRIPTS / "skill-contract.cjs"
    script = (
        f"const c=require({str(cjs)!r});"
        "process.stdout.write(c.descriptionBudget('skill').softMax+'/'+c.descriptionBudget('command').softMax);"
    )
    result = subprocess.run(
        ["node", "-e", script],
        capture_output=True,
        text=True,
        check=True,
    )
    assert result.stdout.strip() == "130/110"


def test_scaffold_template_order_matches_contract():
    contract = _load_contract_module()
    canonical = contract.load_skill_contract()["sections"]["skill"]["canonicalOrder"]
    template = (
        _CREATE_SKILL / "assets" / "skill" / "skill-scaffold-template.md"
    ).read_text(encoding="utf-8")
    headings = [
        re.sub(r"^\d+\.\s*", "", raw).strip().upper()
        for raw in re.findall(r"^##\s+(.*)$", template, re.MULTILINE)
    ]
    # Every canonical section must be present, and their relative order in the
    # template must match the contract's canonicalOrder.
    positions = [headings.index(section) for section in canonical]
    assert positions == sorted(positions), (
        f"canonical order {canonical} not preserved in template headings {headings}"
    )


def test_scaffold_template_carries_contract_markers():
    contract = _load_contract_module()
    required = contract.smart_router_markers().get("required", [])
    template = (
        _CREATE_SKILL / "assets" / "skill" / "skill-scaffold-template.md"
    ).read_text(encoding="utf-8")
    missing = [marker for marker in required if marker not in template]
    assert missing == [], f"scaffold template missing contract markers: {missing}"
