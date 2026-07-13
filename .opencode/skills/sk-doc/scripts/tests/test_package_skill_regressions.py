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


# ───────────────────────────────────────────────────────────────
# Hardened resource-doc + smart-router contract (warnings, not hard errors)
# ───────────────────────────────────────────────────────────────

_VALID_RESOURCE_FM = (
    "---\n"
    "title: Demo Reference\n"
    "description: A demo reference doc with all five required frontmatter fields plus a version.\n"
    "trigger_phrases:\n"
    "  - \"demo reference one\"\n"
    "  - \"demo reference two\"\n"
    "importance_tier: normal\n"
    "contextType: general\n"
    "version: 1.0.0.0\n"
    "---\n\n"
    "# Demo Reference\n\nBody.\n"
)


def _write_valid_skill(
    skill_path,
    with_router_markers=True,
    description=(
        "A demo skill fixture long enough to satisfy the description length "
        "warning threshold here."
    ),
    with_recommended_sections=False,
):
    """Write a minimal skill that passes hard validation; mutate per-test."""
    skill_path.mkdir(parents=True, exist_ok=True)
    router_body = (
        "Prose only, no markers.\n"
        if not with_router_markers
        else (
            "discover_markdown_resources() finds docs; _guard_in_skill() sandboxes "
            "paths; UNKNOWN_FALLBACK returns a checklist.\n"
        )
    )
    (skill_path / "SKILL.md").write_text(
        "---\n"
        f"name: {skill_path.name}\n"
        f"description: {description}\n"
        "allowed-tools: [Read, Write, Edit]\n"
        "version: 1.0.0.0\n"
        "---\n\n"
        "# Demo Skill\n\nTagline.\n\n---\n\n"
        "## 1. WHEN TO USE\nText.\n\n---\n\n"
        f"## 2. SMART ROUTING\n{router_body}\n---\n\n"
        "## 3. HOW IT WORKS\nText.\n\n---\n\n"
        "## 4. RULES\n### ALWAYS\n- Do.\n### NEVER\n- Don't.\n### ESCALATE IF\n- Ask.\n\n---\n\n"
        "## 5. REFERENCES\nText.\n"
        + (
            "\n## 6. SUCCESS CRITERIA\nText.\n"
            "\n## 7. INTEGRATION POINTS\nText.\n"
            "\n## 8. RELATED RESOURCES\nText.\n"
            if with_recommended_sections
            else ""
        ),
        encoding="utf-8",
    )
    return skill_path


def test_strict_mode_promotes_contract_warning_only(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(
        tmp_path / "strict-warning",
        description="A" * 200,
        with_recommended_sections=True,
    )

    valid, _message, warnings = module.validate_skill(skill_path, strict=False)
    assert valid is True
    assert any("exceeds soft target" in warning for warning in warnings)

    strict_valid, strict_message, strict_warnings = module.validate_skill(
        skill_path,
        strict=True,
    )
    assert strict_valid is False
    assert "exceeds soft target" in strict_message
    assert strict_warnings == []


def test_strict_mode_accepts_fully_clean_skill(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(
        tmp_path / "clean-skill",
        with_recommended_sections=True,
    )

    for strict in (False, True):
        valid, message, warnings = module.validate_skill(skill_path, strict=strict)
        assert valid is True, message
        assert warnings == []


def test_strict_mode_keeps_recommended_sections_advisory(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(tmp_path / "advisory-only")

    valid, message, warnings = module.validate_skill(skill_path, strict=True)
    assert valid is True, message
    assert any("Missing recommended section" in warning for warning in warnings)


def test_resource_frontmatter_flags_missing_five_fields(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(tmp_path / "demo-skill")
    refs = skill_path / "references"
    refs.mkdir()
    # Only title + description present.
    (refs / "partial_doc.md").write_text(
        "---\ntitle: Partial\ndescription: Missing the other three fields.\n---\n\n# Partial\n",
        encoding="utf-8",
    )

    valid, _message, warnings = module.validate_resource_frontmatter(skill_path)
    assert valid is True  # warning, not hard error
    joined = " ".join(warnings)
    assert "partial_doc.md" in joined
    assert "trigger_phrases" in joined
    assert "importance_tier" in joined
    assert "contextType" in joined


def test_resource_frontmatter_flags_missing_version(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(tmp_path / "demo-skill")
    assets = skill_path / "assets"
    assets.mkdir()
    no_version = _VALID_RESOURCE_FM.replace("version: 1.0.0.0\n", "")
    (assets / "no_version.md").write_text(no_version, encoding="utf-8")

    _valid, _message, warnings = module.validate_resource_frontmatter(skill_path)
    assert any("no_version.md" in w and "version" in w for w in warnings)


def test_resource_frontmatter_flags_non_four_part_version(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(tmp_path / "demo-skill")
    refs = skill_path / "references"
    refs.mkdir()
    three_part = _VALID_RESOURCE_FM.replace("version: 1.0.0.0", "version: 1.0.0")
    (refs / "three_part.md").write_text(three_part, encoding="utf-8")

    _valid, _message, warnings = module.validate_resource_frontmatter(skill_path)
    assert any("three_part.md" in w and "4-part" in w for w in warnings)


def test_resource_frontmatter_version_checks_changelog(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(tmp_path / "demo-skill")
    changelog = skill_path / "changelog"
    changelog.mkdir()
    (changelog / "v1.0.0.0.md").write_text(
        "---\ntitle: Changelog entry\ndescription: A changelog entry missing version.\n---\n\n# v1.0.0.0\n",
        encoding="utf-8",
    )

    _valid, _message, warnings = module.validate_resource_frontmatter(skill_path)
    assert any("v1.0.0.0.md" in w and "version" in w for w in warnings)


def test_resource_frontmatter_skips_frontmatterless_docs(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(tmp_path / "demo-skill")
    refs = skill_path / "references"
    refs.mkdir()
    # No frontmatter at all -> version check skips it (still flagged for 5-field
    # absence, but the version warning must NOT fire on a frontmatter-less doc).
    (refs / "plain.md").write_text("# Plain\n\nNo frontmatter here.\n", encoding="utf-8")

    _valid, _message, warnings = module.validate_resource_frontmatter(skill_path)
    assert not any("plain.md" in w and "version" in w for w in warnings)


def test_resource_frontmatter_readme_exempt_from_five_fields(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(tmp_path / "demo-skill")
    assets = skill_path / "assets" / "templates"
    assets.mkdir(parents=True)
    # README.md is a distinct doc class -> exempt from the 5-field block.
    (assets / "README.md").write_text(
        "---\ntitle: Readme\ndescription: A readme without the 5-field block.\n---\n\n# Readme\n",
        encoding="utf-8",
    )

    _valid, _message, warnings = module.validate_resource_frontmatter(skill_path)
    assert not any("README.md" in w and "missing frontmatter field" in w for w in warnings)


def test_snake_case_check_recurses_into_subdirs(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(tmp_path / "demo-skill")
    sub = skill_path / "references" / "domain"
    sub.mkdir(parents=True)
    (sub / "kebab-name.md").write_text(_VALID_RESOURCE_FM, encoding="utf-8")

    valid, _message, warnings = module.validate_resources(skill_path)
    assert valid is True  # warning, not hard error
    assert any("kebab-name.md" in w and "snake_case" in w for w in warnings)


def test_snake_case_check_exempts_readme(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(tmp_path / "demo-skill")
    refs = skill_path / "references" / "aesthetics"
    refs.mkdir(parents=True)
    (refs / "README.md").write_text(_VALID_RESOURCE_FM, encoding="utf-8")

    _valid, _message, warnings = module.validate_resources(skill_path)
    assert not any("README.md" in w and "snake_case" in w for w in warnings)


def test_smart_router_flags_missing_markers(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(tmp_path / "demo-skill", with_router_markers=False)
    content = (skill_path / "SKILL.md").read_text(encoding="utf-8")

    valid, _message, warnings = module.validate_smart_router(content)
    assert valid is True  # warning, not hard error
    joined = " ".join(warnings)
    assert "discover_markdown_resources" in joined
    assert "_guard_in_skill" in joined
    assert "UNKNOWN_FALLBACK" in joined


def test_smart_router_passes_when_markers_present(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(tmp_path / "demo-skill", with_router_markers=True)
    content = (skill_path / "SKILL.md").read_text(encoding="utf-8")

    _valid, _message, warnings = module.validate_smart_router(content)
    assert not warnings


def test_new_checks_are_warnings_not_hard_errors(tmp_path):
    """Backward-compat guarantee: a skill that violates ALL four new checks but
    is otherwise structurally valid must still PASS (valid=True) with warnings."""
    module = _load_module()
    skill_path = _write_valid_skill(tmp_path / "demo-skill", with_router_markers=False)
    refs = skill_path / "references" / "domain"
    refs.mkdir(parents=True)
    # kebab name + missing version + missing 3 of 5 fields, all at once.
    (refs / "bad-Name.md").write_text(
        "---\ntitle: Bad\ndescription: Violates name, version, and 5-field at once.\n---\n\n# Bad\n",
        encoding="utf-8",
    )

    valid, message, warnings = module.validate_skill(skill_path)
    assert valid is True, f"new checks must be warnings, got hard fail: {message}"
    joined = " ".join(warnings)
    assert "snake_case" in joined
    assert "version" in joined
    assert "trigger_phrases" in joined
    assert "smart-router marker" in joined


def test_smart_router_combined_header_recognized(tmp_path):
    """Combined 'SMART ROUTING & REFERENCES' header is still scanned for markers."""
    module = _load_module()
    content = (
        "---\nname: demo\ndescription: x\nallowed-tools: [Read]\n---\n\n"
        "## 1. WHEN TO USE\nT.\n\n"
        "## 2. SMART ROUTING & REFERENCES\n"
        "discover_markdown_resources / _guard_in_skill / UNKNOWN_FALLBACK present.\n\n"
        "## 3. HOW IT WORKS\nT.\n"
    )
    _valid, _message, warnings = module.validate_smart_router(content)
    assert not warnings
