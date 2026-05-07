#!/usr/bin/env python3
"""
Regression tests for package_skill.py validation behavior.
"""

import importlib.util
from pathlib import Path


def _load_module():
    scripts_dir = Path(__file__).resolve().parents[1]
    module_path = scripts_dir / "package_skill.py"
    spec = importlib.util.spec_from_file_location("package_skill", module_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_h2_with_emoji_does_not_trigger_false_positive_warning():
    module = _load_module()
    content = (
        "---\n"
        "name: demo-skill\n"
        "description: Demo skill description that is intentionally long enough for warning checks.\n"
        "---\n\n"
        "## 1. 🎯 WHEN TO USE\n"
        "Text.\n\n"
        "## 2. 🧭 SMART ROUTING\n"
        "Text.\n\n"
        "## 3. 🛠️ HOW IT WORKS\n"
        "Text.\n\n"
        "## 4. 📋 RULES\n"
        "### ✅ ALWAYS\n"
        "- Do this.\n"
        "### ❌ NEVER\n"
        "- Avoid this.\n"
        "### ⚠️ ESCALATE IF\n"
        "- Ask for help.\n\n"
        "## 5. 📚 REFERENCES\n"
        "Text.\n"
    )

    valid, _, warnings = module.validate_sections(content)
    assert valid is True
    assert not any("missing emoji prefix" in warning.lower() for warning in warnings)


def test_h2_without_emoji_does_not_warn():
    module = _load_module()
    content = (
        "---\n"
        "name: demo-skill\n"
        "description: Demo skill description that is intentionally long enough for warning checks.\n"
        "allowed-tools: [Read, Write, Edit]\n"
        "---\n\n"
        "## 1. WHEN TO USE\n"
        "Text.\n\n"
        "## 2. SMART ROUTING\n"
        "Text.\n\n"
        "## 3. HOW IT WORKS\n"
        "Text.\n\n"
        "## 4. RULES\n"
        "### ✅ ALWAYS\n"
        "- Do this.\n"
        "### ❌ NEVER\n"
        "- Avoid this.\n"
        "### ⚠️ ESCALATE IF\n"
        "- Ask for help.\n\n"
        "## 5. REFERENCES\n"
        "Text.\n"
    )

    valid, _, warnings = module.validate_sections(content)
    assert valid is True
    assert not any("emoji prefix" in warning.lower() for warning in warnings)


def test_references_section_remains_mandatory():
    module = _load_module()
    content = (
        "---\n"
        "name: demo-skill\n"
        "description: Demo skill description that is intentionally long enough for warning checks.\n"
        "---\n\n"
        "## 1. WHEN TO USE\n"
        "Text.\n\n"
        "## 2. SMART ROUTING\n"
        "Text.\n\n"
        "## 3. HOW IT WORKS\n"
        "Text.\n\n"
        "## 4. RULES\n"
        "Text.\n"
    )

    valid, message, _warnings = module.validate_sections(content)
    assert valid is False
    assert "REFERENCES" in message


def test_smart_routing_and_references_combined_header_still_satisfies_requirement():
    module = _load_module()
    content = (
        "---\n"
        "name: demo-skill\n"
        "description: Demo skill description that is intentionally long enough for warning checks.\n"
        "---\n\n"
        "## 1. WHEN TO USE\n"
        "Text.\n\n"
        "## 2. SMART ROUTING & REFERENCES\n"
        "Text.\n\n"
        "## 3. HOW IT WORKS\n"
        "Text.\n\n"
        "## 4. RULES\n"
        "Text.\n"
    )

    valid, _message, _warnings = module.validate_sections(content)
    assert valid is True


def test_allowed_tools_remains_mandatory():
    module = _load_module()
    content = (
        "---\n"
        "name: demo-skill\n"
        "description: Demo skill description that is intentionally long enough for warning checks.\n"
        "---\n\n"
        "## 1. WHEN TO USE\n"
        "Text.\n"
    )

    valid, message, _warnings, _parsed = module.validate_frontmatter(content)
    assert valid is False
    assert "allowed-tools" in message


def test_template_rules_json_not_flagged_as_placeholder(tmp_path):
    module = _load_module()
    skill_path = tmp_path / "demo-skill"
    skill_path.mkdir()
    (skill_path / "assets").mkdir()
    (skill_path / "assets" / "template_rules.json").write_text("{}", encoding="utf-8")

    valid, _message, warnings = module.validate_resources(skill_path)
    assert valid is True
    assert not any("template_rules.json" in warning for warning in warnings)
