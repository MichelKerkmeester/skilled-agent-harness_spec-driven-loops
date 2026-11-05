#!/usr/bin/env python3
"""
Regression tests for package_skill.py validation behavior.
"""

import importlib.util
import json
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


def test_references_heading_inside_a_fence_does_not_satisfy_the_contract():
    module = _load_module()
    body = (
        "## 1. WHEN TO USE\n"
        "Text.\n\n"
        "## 2. SMART ROUTING\n"
        "Text.\n\n"
        "## 3. HOW IT WORKS\n"
        "Text.\n\n"
        "## 4. RULES\n"
        "Text.\n\n"
    )
    fenced = "```markdown\n## REFERENCES\n```\n"

    valid, message, _warnings = module.validate_sections(body + fenced)
    assert valid is False
    assert "REFERENCES" in message

    valid, message, _warnings = module.validate_sections(body + "## REFERENCES\nText.\n")
    assert valid is True, message


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
    (skill_path / "assets" / "template-rules.json").write_text("{}", encoding="utf-8")

    valid, _message, warnings = module.validate_resources(skill_path)
    assert valid is True
    assert not any("template-rules.json" in warning for warning in warnings)


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

_RENDER_JOINED_LABEL_DOC = (
    "---\n"
    "title: Render Fixture Reference\n"
    "description: A fixture reference that joins two bold labels into one rendered paragraph.\n"
    "trigger_phrases:\n"
    "  - \"render fixture\"\n"
    "importance_tier: normal\n"
    "contextType: general\n"
    "version: 1.0.0.0\n"
    "---\n\n"
    "# Render Fixture Reference\n\n"
    "A hook paragraph for the render fixture.\n\n"
    "## 1. OVERVIEW\n\n"
    "The fixture shows the joined bold label shape.\n\n"
    "## 2. FIELD LIST\n\n"
    "**File**: references/render-fixture.md\n"
    "**Purpose**: Exercise the joined bold label check.\n"
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
    """Write a minimal skill that passes hard validation; mutate per-test.

    The skill owns its router in a sibling ROUTER.md and links it from
    SKILL.md, which is the shape the routing canon requires.
    """
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
        "\nStructured routing detail: [`ROUTER.md`](./ROUTER.md).\n"
        + (
            "\n## 6. SUCCESS CRITERIA\nText.\n"
            "\n## 7. INTEGRATION POINTS\nText.\n"
            "\n## 8. RELATED RESOURCES\nText.\n"
            if with_recommended_sections
            else ""
        ),
        encoding="utf-8",
    )
    (skill_path / "ROUTER.md").write_text(
        "# Demo Router\n\n"
        "## 1. OVERVIEW\n\n"
        "Open this when a demo request needs the router line by line.\n\n"
        "## 2. MACHINE ROUTER\n\n"
        "The routing detail lives here, apart from SKILL.md.\n",
        encoding="utf-8",
    )
    return skill_path


def _write_render_fixture_skill(tmp_path):
    """A strict-clean skill whose reference joins two bold labels."""
    skill_path = _write_valid_skill(
        tmp_path / "render-label-skill",
        with_recommended_sections=True,
    )
    refs = skill_path / "references"
    refs.mkdir()
    (refs / "render-fixture.md").write_text(_RENDER_JOINED_LABEL_DOC, encoding="utf-8")
    return skill_path


def _write_render_scope_fixture_skill(tmp_path):
    """A skill joining two bold labels in its entry point, its router and its hub trees."""
    skill_path = _write_valid_skill(
        tmp_path / "render-scope-skill",
        with_recommended_sections=True,
    )
    pair = (
        "**File**: {name}\n"
        "**Purpose**: Exercise the joined bold label check.\n"
    )
    with (skill_path / "SKILL.md").open("a", encoding="utf-8") as skill_md:
        skill_md.write("\n" + pair.format(name="SKILL.md"))
    (skill_path / "ROUTER.md").write_text(
        "---\n"
        "title: Render Scope Router\n"
        "description: A fixture router that joins two bold labels into one rendered paragraph.\n"
        "version: 1.0.0.0\n"
        "---\n\n"
        "# Render Scope Router\n\n"
        "The routing detail lives here, apart from SKILL.md.\n\n"
        "## 1. OVERVIEW\n\n"
        "The fixture shows the joined bold label shape.\n\n"
        "## 2. MACHINE ROUTER\n\n"
        + pair.format(name="ROUTER.md"),
        encoding="utf-8",
    )
    for folder, name in (("shared/references", "a.md"), ("runtime/references", "b.md")):
        base = skill_path / folder
        base.mkdir(parents=True)
        (base / name).write_text(_RENDER_JOINED_LABEL_DOC, encoding="utf-8")
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


def test_render_joined_bold_label_is_advisory_until_strict(tmp_path):
    module = _load_module()
    skill_path = _write_render_fixture_skill(tmp_path)

    valid, message, warnings = module.validate_skill(skill_path, strict=False)
    assert valid is True, message
    assert any("render check" in warning for warning in warnings)

    strict_valid, strict_message, _strict_warnings = module.validate_skill(skill_path, strict=True)
    assert strict_valid is False
    assert "render check" in strict_message


def test_render_finding_passes_strict_once_ledgered(tmp_path, monkeypatch):
    module = _load_module()
    skill_path = _write_render_fixture_skill(tmp_path)
    ledger = tmp_path / "render-known-debt.json"
    ledger.write_text(
        json.dumps({
            "debt": {
                "render-label-skill": {
                    "findings": 1,
                    "codes": ["render_bold_label_join"],
                },
            },
        }),
        encoding="utf-8",
    )
    monkeypatch.setenv("RENDER_DEBT_FILE", str(ledger))
    monkeypatch.setenv("RENDER_SKILLS_ROOT", str(tmp_path))

    valid, message, warnings = module.validate_skill(skill_path, strict=True)
    assert valid is True, message
    assert not any("render check" in warning for warning in warnings)


def test_render_debt_cannot_cover_a_growing_count(tmp_path, monkeypatch):
    module = _load_module()
    skill_path = _write_render_fixture_skill(tmp_path)
    refs = skill_path / "references"
    (refs / "second-render-fixture.md").write_text(
        _RENDER_JOINED_LABEL_DOC, encoding="utf-8"
    )
    ledger = tmp_path / "render-known-debt.json"
    ledger.write_text(
        json.dumps({
            "debt": {
                "render-label-skill": {
                    "findings": 1,
                    "codes": ["render_bold_label_join"],
                },
            },
        }),
        encoding="utf-8",
    )
    monkeypatch.setenv("RENDER_DEBT_FILE", str(ledger))
    monkeypatch.setenv("RENDER_SKILLS_ROOT", str(tmp_path))

    valid, message, _warnings = module.validate_skill(skill_path, strict=True)
    assert valid is False
    assert "above its known debt" in message


def test_stale_render_debt_is_promoted_by_strict(tmp_path, monkeypatch):
    module = _load_module()
    skill_path = _write_render_fixture_skill(tmp_path)
    ledger = tmp_path / "render-known-debt.json"
    ledger.write_text(
        json.dumps({
            "debt": {
                "render-label-skill": {
                    "findings": 2,
                    "codes": ["render_bold_label_join"],
                },
            },
        }),
        encoding="utf-8",
    )
    monkeypatch.setenv("RENDER_DEBT_FILE", str(ledger))
    monkeypatch.setenv("RENDER_SKILLS_ROOT", str(tmp_path))

    valid, message, warnings = module.validate_skill(skill_path, strict=False)
    assert valid is True, message
    assert any("stale known debt" in warning for warning in warnings)

    strict_valid, strict_message, _strict_warnings = module.validate_skill(
        skill_path,
        strict=True,
    )
    assert strict_valid is False
    assert "stale known debt" in strict_message


def _write_exempt_ledger(tmp_path, consumer):
    ledger = tmp_path / "render-known-debt.json"
    ledger.write_text(
        json.dumps({
            "debt": {},
            "exempt": {
                "render-label-skill/references/render-fixture.md": {
                    "consumer": consumer,
                    "reason": "A script writes this doc's text verbatim.",
                },
            },
        }),
        encoding="utf-8",
    )
    return ledger


def test_render_exempt_doc_with_live_consumer_passes_strict(tmp_path, monkeypatch):
    module = _load_module()
    skill_path = _write_render_fixture_skill(tmp_path)
    (skill_path / "scripts").mkdir(exist_ok=True)
    (skill_path / "scripts" / "writer.cjs").write_text(
        "// reads render-fixture.md verbatim\n", encoding="utf-8"
    )
    ledger = _write_exempt_ledger(tmp_path, "render-label-skill/scripts/writer.cjs")
    monkeypatch.setenv("RENDER_DEBT_FILE", str(ledger))
    monkeypatch.setenv("RENDER_SKILLS_ROOT", str(tmp_path))

    valid, message, warnings = module.validate_skill(skill_path, strict=True)
    assert valid is True, message
    assert not any("render check" in warning for warning in warnings)


def test_render_exempt_consumer_that_never_names_the_doc_exempts_nothing(
    tmp_path, monkeypatch
):
    module = _load_module()
    skill_path = _write_render_fixture_skill(tmp_path)
    (skill_path / "scripts").mkdir(exist_ok=True)
    (skill_path / "scripts" / "writer.cjs").write_text(
        "// reads an unrelated doc\n", encoding="utf-8"
    )
    ledger = _write_exempt_ledger(tmp_path, "render-label-skill/scripts/writer.cjs")
    monkeypatch.setenv("RENDER_DEBT_FILE", str(ledger))
    monkeypatch.setenv("RENDER_SKILLS_ROOT", str(tmp_path))

    valid, message, _warnings = module.validate_skill(skill_path, strict=True)
    assert valid is False
    assert "render check" in message


def test_render_exempt_entry_with_missing_consumer_exempts_nothing(tmp_path, monkeypatch):
    module = _load_module()
    skill_path = _write_render_fixture_skill(tmp_path)
    ledger = _write_exempt_ledger(tmp_path, "render-label-skill/scripts/gone.cjs")
    monkeypatch.setenv("RENDER_DEBT_FILE", str(ledger))
    monkeypatch.setenv("RENDER_SKILLS_ROOT", str(tmp_path))

    valid, message, _warnings = module.validate_skill(skill_path, strict=True)
    assert valid is False
    assert "render check" in message


def test_render_exempt_skips_only_the_listed_doc(tmp_path, monkeypatch):
    module = _load_module()
    skill_path = _write_render_fixture_skill(tmp_path)
    (skill_path / "references" / "unlisted-render-fixture.md").write_text(
        _RENDER_JOINED_LABEL_DOC, encoding="utf-8"
    )
    (skill_path / "scripts").mkdir(exist_ok=True)
    (skill_path / "scripts" / "writer.cjs").write_text(
        "// reads render-fixture.md verbatim\n", encoding="utf-8"
    )
    ledger = _write_exempt_ledger(tmp_path, "render-label-skill/scripts/writer.cjs")
    monkeypatch.setenv("RENDER_DEBT_FILE", str(ledger))
    monkeypatch.setenv("RENDER_SKILLS_ROOT", str(tmp_path))

    valid, message, _warnings = module.validate_skill(skill_path, strict=True)
    assert valid is False
    assert "unlisted-render-fixture.md" in message


def test_render_exempt_rejects_malformed_and_outside_consumers(tmp_path, monkeypatch):
    module = _load_module()
    skill_path = _write_render_fixture_skill(tmp_path)
    outside = tmp_path.parent / "outside-writer.cjs"
    outside.write_text("// outside the skills root\n", encoding="utf-8")
    doc = "render-label-skill/references/render-fixture.md"
    for entry in (
        {"consumer": str(outside), "reason": "absolute path"},
        {"consumer": "../outside-writer.cjs", "reason": "escapes the root"},
        {"consumer": "render-label-skill/SKILL.md", "reason": "", },
        {"consumer": "render-label-skill/SKILL.md", "reason": "extra key", "note": "x"},
    ):
        ledger = tmp_path / "render-known-debt.json"
        ledger.write_text(json.dumps({"debt": {}, "exempt": {doc: entry}}), encoding="utf-8")
        monkeypatch.setenv("RENDER_DEBT_FILE", str(ledger))
        monkeypatch.setenv("RENDER_SKILLS_ROOT", str(tmp_path))

        valid, message, _warnings = module.validate_skill(skill_path, strict=True)
        assert valid is False, entry
        assert "render check" in message


def test_render_scan_reads_the_entry_point_router_and_hub_reference_trees(tmp_path):
    module = _load_module()
    skill_path = _write_render_scope_fixture_skill(tmp_path)

    joined = [
        finding for finding in module._render_findings(skill_path)
        if finding["code"] == "render_bold_label_join"
    ]
    assert {finding["file"] for finding in joined} == {
        "SKILL.md",
        "ROUTER.md",
        "shared/references/a.md",
        "runtime/references/b.md",
    }
    assert {finding["scope"] for finding in joined} == {
        "SKILL.md",
        "ROUTER.md",
        "shared/references",
        "runtime/references",
    }


_STAGED_SCOPE_FILES = {
    "SKILL.md",
    "ROUTER.md",
    "shared/references/a.md",
    "runtime/references/b.md",
}


def _advisory_files(warnings):
    """The files named by the render warnings the stage holds advisory."""
    return {
        warning[len("render advisory: "):].split(":", 1)[0]
        for warning in warnings
        if warning.startswith("render advisory: ")
    }


def test_staged_render_scopes_stay_advisory_under_strict(tmp_path):
    # The widened scan reads docs the fleet already shaped, so its findings must
    # not turn --strict red before they can be worked off.
    module = _load_module()
    skill_path = _write_render_scope_fixture_skill(tmp_path)

    valid, message, warnings = module.validate_skill(skill_path, strict=True)

    assert valid is True, message
    assert _advisory_files(warnings) == _STAGED_SCOPE_FILES
    assert not any(warning.startswith("render check:") for warning in warnings)


def test_staged_off_env_enforces_the_staged_scopes(tmp_path, monkeypatch):
    # The opt-out is how a stage is measured before it is retired.
    module = _load_module()
    skill_path = _write_render_scope_fixture_skill(tmp_path)
    monkeypatch.setenv("RENDER_STAGED_OFF", "1")

    valid, message, _warnings = module.validate_skill(skill_path, strict=True)

    assert valid is False
    for name in sorted(_STAGED_SCOPE_FILES):
        assert name in message


def test_unstaged_reference_render_finding_still_fails_strict(tmp_path):
    module = _load_module()
    skill_path = _write_render_fixture_skill(tmp_path)

    valid, message, _warnings = module.validate_skill(skill_path, strict=True)

    assert valid is False
    assert (
        "render check: references/render-fixture.md:22 "
        "Consecutive bold labels" in message
    )


def test_staged_render_code_stays_advisory_in_an_enforced_scope(tmp_path, monkeypatch):
    module = _load_module()
    skill_path = _write_render_fixture_skill(tmp_path)
    staged_code = module.RENDER_STAGED_CODES[0]
    finding = {
        "code": staged_code,
        "file": "references/render-fixture.md",
        "line": 3,
        "message": "staged code in an enforced scope",
        "scope": "references",
    }
    monkeypatch.setattr(module, "_render_findings", lambda _path: [finding])

    valid, message, warnings = module.validate_skill(skill_path, strict=True)
    assert valid is True, message
    assert any(
        warning.startswith("render advisory: references/render-fixture.md:3")
        for warning in warnings
    )

    monkeypatch.setenv("RENDER_STAGED_OFF", "1")
    valid, message, _warnings = module.validate_skill(skill_path, strict=True)
    assert valid is False
    assert "render check: references/render-fixture.md:3" in message


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


def test_child_doc_without_version_fails_strict(tmp_path):
    # Every in-scope child doc carries its own edition, so one with no version fails strict.
    module = _load_module()
    skill_path = _write_valid_skill(tmp_path / "demo-skill", with_recommended_sections=True)
    no_version = _VALID_RESOURCE_FM.replace("version: 1.0.0.0\n", "")
    in_scope = ("assets", "references", "feature-catalog", "manual-testing-playbook", "scripts")
    for subtree in in_scope:
        (skill_path / subtree).mkdir()
        (skill_path / subtree / "no-version.md").write_text(no_version, encoding="utf-8")
    # Test input and generated output stay out of scope.
    for out in ("scripts/tests/fixtures", "benchmark", "runtime/lib"):
        (skill_path / out).mkdir(parents=True, exist_ok=True)
        (skill_path / out / "out-of-scope.md").write_text(no_version, encoding="utf-8")

    _valid, _message, warnings = module.validate_resource_frontmatter(skill_path)
    flagged = sorted(w.split("'")[1] for w in warnings if "missing 'version'" in w)
    assert flagged == sorted(f"{s}/no-version.md" for s in in_scope), flagged
    valid, message, _strict_warnings = module.validate_skill(skill_path, strict=True)
    assert valid is False, message


def test_changelog_entry_flags_non_four_part_version(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(tmp_path / "demo-skill")
    changelog = skill_path / "changelog"
    changelog.mkdir()
    (changelog / "v1.0.0.0.md").write_text(
        "---\ntitle: Changelog entry\ndescription: A changelog entry.\nversion: 1.0.0\n---\n\n# v1.0.0.0\n",
        encoding="utf-8",
    )

    _valid, _message, warnings = module.validate_resource_frontmatter(skill_path)
    assert any("v1.0.0.0.md" in w and "4-part" in w for w in warnings)


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


def test_kebab_case_check_recurses_into_subdirs(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(tmp_path / "demo-skill")
    sub = skill_path / "references" / "domain"
    sub.mkdir(parents=True)
    (sub / "kebab-name.md").write_text(_VALID_RESOURCE_FM, encoding="utf-8")

    valid, _message, warnings = module.validate_generated_paths(skill_path)
    assert valid is True
    assert warnings == []


def test_kebab_case_check_flags_underscore_paths(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(tmp_path / "demo-skill")
    sub = skill_path / "references" / "bad_domain"
    sub.mkdir(parents=True)
    (sub / "bad_name.md").write_text(_VALID_RESOURCE_FM, encoding="utf-8")

    valid, _message, warnings = module.validate_generated_paths(skill_path)

    assert valid is True
    assert any("bad_domain" in warning and "must use kebab-case" in warning for warning in warnings)
    assert any("bad_name.md" in warning and "must use kebab-case" in warning for warning in warnings)


def test_kebab_case_check_exempts_readme(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(tmp_path / "demo-skill")
    refs = skill_path / "references" / "aesthetics"
    refs.mkdir(parents=True)
    (refs / "README.md").write_text(_VALID_RESOURCE_FM, encoding="utf-8")

    _valid, _message, warnings = module.validate_generated_paths(skill_path)
    assert not any("README.md" in warning for warning in warnings)


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
    # Invalid case + missing 3 of 5 fields, all at once.
    (refs / "bad-Name.md").write_text(
        "---\ntitle: Bad\ndescription: Violates name, version, and 5-field at once.\n---\n\n# Bad\n",
        encoding="utf-8",
    )

    valid, message, warnings = module.validate_skill(skill_path)
    assert valid is True, f"new checks must be warnings, got hard fail: {message}"
    joined = " ".join(warnings)
    assert "kebab-case" in joined
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


def test_rules_section_ignores_level_three_rules_subsection():
    """A `### Rules` subsection before the real RULES section is not read as the section."""
    module = _load_module()
    content = (
        "---\nname: demo\ndescription: x\n---\n\n"
        "## 4. STORAGE CONTRACT\n"
        "### Rules\n"
        "- A run never edits the corpus.\n\n"
        "## 6. SCENARIO DESIGN RULES\n"
        "Text.\n\n"
        "## 8. RULES\n"
        "### ✅ ALWAYS\n- Do this.\n"
        "### ⛔ NEVER\n- Avoid this.\n"
        "### ⚠️ ESCALATE IF\n- Ask.\n"
    )
    _valid, _message, warnings = module.validate_rules_section(content)
    assert warnings == []


def _declare_repo_root_hub(skill_path, repo_paths):
    (skill_path / "mode-registry.json").write_text(
        json.dumps({"skill": "demo-hub", "extensions": {"repo-root-hub": {"repoPaths": repo_paths}}}),
        encoding="utf-8",
    )


def test_repo_root_hub_folder_id_is_kebab_case(tmp_path):
    module = _load_module()
    skill_path = tmp_path / "Demo Hub"
    skill_path.mkdir()
    assert module.skill_folder_id(skill_path) == "Demo Hub"

    _declare_repo_root_hub(skill_path, ["specs"])
    assert module.skill_folder_id(skill_path) == "demo-hub"
    valid, message, _warnings = module.validate_name_matches_folder(skill_path, {"name": "demo-hub"})
    assert valid is True, message


def test_repo_root_hub_name_mismatch_names_the_kebab_folder(tmp_path):
    module = _load_module()
    skill_path = tmp_path / "Demo Hub"
    skill_path.mkdir()
    _declare_repo_root_hub(skill_path, ["specs"])

    valid, message, _warnings = module.validate_name_matches_folder(skill_path, {"name": "other-hub"})
    assert valid is False
    assert "kebab-case folder name 'demo-hub'" in message


def test_repo_root_hub_paths_skip_the_naming_and_version_walks(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(tmp_path / "demo-skill")
    for folder in ("specs", "drafts"):
        (skill_path / folder / "run_suite").mkdir(parents=True)
        (skill_path / folder / "run_suite" / "notes.md").write_text("---\ntitle: x\n---\n", encoding="utf-8")
    (skill_path / "SYNC.md").write_text("---\ntitle: x\n---\n", encoding="utf-8")
    _declare_repo_root_hub(skill_path, ["specs", "SYNC.md"])

    _valid, _message, warnings = module.validate_generated_paths(skill_path)
    assert any("drafts/run_suite" in warning for warning in warnings)
    assert not any("specs" in warning for warning in warnings)

    versioned = {str(p.relative_to(skill_path)) for p in module._iter_versioned_docs(skill_path)}
    assert "drafts/run_suite/notes.md" in versioned
    assert "specs/run_suite/notes.md" not in versioned
    assert "SYNC.md" not in versioned
