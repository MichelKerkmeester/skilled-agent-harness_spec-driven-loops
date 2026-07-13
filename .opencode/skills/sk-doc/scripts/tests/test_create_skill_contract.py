#!/usr/bin/env python3
"""Contract and packaging regressions for package_skill.py."""

import importlib.util
import json
import zipfile
from pathlib import Path


def _load_module():
    scripts_dir = Path(__file__).resolve().parents[1]
    module_path = scripts_dir / "package_skill.py"
    spec = importlib.util.spec_from_file_location("package_skill", module_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _write_valid_skill(
    skill_path: Path,
    *,
    allowed_tools: str = "[Read, Write, Edit]",
    description: str = (
        "Standalone skill fixture for deterministic contract validation and packaging checks."
    ),
    include_escalate: bool = True,
) -> Path:
    """Materialize a standalone skill that passes the strict contract."""
    skill_path.mkdir(parents=True, exist_ok=True)
    escalate_rule = "### ESCALATE IF\n- Ask for help.\n" if include_escalate else ""
    (skill_path / "SKILL.md").write_text(
        "---\n"
        f"name: {skill_path.name}\n"
        f"description: {json.dumps(description)}\n"
        f"allowed-tools: {allowed_tools}\n"
        "version: 1.0.0.0\n"
        "---\n\n"
        "# Standalone Skill\n\n"
        "## 1. WHEN TO USE\nUse this fixture in local tests.\n\n"
        "## 2. SMART ROUTING\n"
        "discover_markdown_resources() finds docs, _guard_in_skill() keeps paths "
        "local, and UNKNOWN_FALLBACK returns a checklist.\n\n"
        "## 3. HOW IT WORKS\nValidate the standalone fixture.\n\n"
        "## 4. RULES\n"
        "### ALWAYS\n- Keep the fixture deterministic.\n"
        "### NEVER\n- Use network access.\n"
        f"{escalate_rule}\n"
        "## 5. REFERENCES\nNo external references.\n\n"
        "## 6. SUCCESS CRITERIA\nValidation passes.\n\n"
        "## 7. INTEGRATION POINTS\nThe package validator.\n\n"
        "## 8. RELATED RESOURCES\nNone.\n",
        encoding="utf-8",
    )
    return skill_path


def test_valid_standalone_passes_check(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(tmp_path / "valid-standalone")

    valid, message, warnings = module.validate_skill(skill_path)

    assert valid is True, message
    assert warnings == []


def test_scalar_allowed_tools_is_invalid(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(
        tmp_path / "scalar-tools",
        allowed_tools="Read",
    )

    valid, message, _warnings = module.validate_skill(skill_path)

    assert valid is False
    assert "array format" in message.lower()


def test_missing_version_is_invalid(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(
        tmp_path / "missing-version",
        description="Standalone fixture whose description contains the version: token.",
    )
    skill_md = skill_path / "SKILL.md"
    skill_md.write_text(
        skill_md.read_text(encoding="utf-8").replace("version: 1.0.0.0\n", ""),
        encoding="utf-8",
    )

    valid, message, _warnings = module.validate_skill(skill_path)

    assert valid is False
    assert "Missing required field 'version'" in message


def test_strict_promotes_warnings(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(
        tmp_path / "strict-warning",
        include_escalate=False,
    )

    valid, message, warnings = module.validate_skill(skill_path, strict=False)
    assert valid is True, message
    assert any("ESCALATE" in warning for warning in warnings)

    strict_valid, strict_message, _strict_warnings = module.validate_skill(
        skill_path,
        strict=True,
    )
    assert strict_valid is False
    assert "ESCALATE" in strict_message


def test_zip_excludes_hidden_ancestor(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(tmp_path / "hidden-ancestor")
    (skill_path / ".git").mkdir()
    (skill_path / ".git" / "config").write_text("fixture", encoding="utf-8")
    (skill_path / "scripts" / "__pycache__").mkdir(parents=True)
    (skill_path / "scripts" / "__pycache__" / "m.pyc").write_bytes(b"fixture")
    output_dir = tmp_path / "dist"

    zip_path = module.package_skill(str(skill_path), str(output_dir))

    assert zip_path is not None
    with zipfile.ZipFile(zip_path) as archive:
        names = archive.namelist()
    assert all(".git" not in name.split("/") for name in names)
    assert all("__pycache__" not in name.split("/") for name in names)


def test_zip_does_not_include_itself(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(tmp_path / "in-tree-output")
    output_dir = skill_path / "dist"

    zip_path = module.package_skill(str(skill_path), str(output_dir))

    assert zip_path is not None
    self_member = zip_path.relative_to(skill_path.parent).as_posix()
    with zipfile.ZipFile(zip_path) as archive:
        assert archive.testzip() is None
        assert self_member not in archive.namelist()


def test_skill_template_asset_exempt_from_resource_frontmatter(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(tmp_path / "with-template-asset")
    asset_dir = skill_path / "assets" / "skill"
    asset_dir.mkdir(parents=True)
    # A scaffold template renders into a new skill's SKILL.md, so it carries
    # skill frontmatter (name + allowed-tools), not the resource-doc block.
    (asset_dir / "scaffold_template.md").write_text(
        "---\n"
        "name: {{SKILL_NAME}}\n"
        "description: TODO one-line description of the scaffolded skill.\n"
        "allowed-tools: [Read, Write, Edit]\n"
        "version: 1.0.0.0\n"
        "---\n\n# {{SKILL_TITLE}}\n",
        encoding="utf-8",
    )
    # Control: a real resource doc missing the 5-field block still warns.
    (asset_dir / "real_reference.md").write_text(
        "---\ntitle: Real Doc\n---\n\nbody\n",
        encoding="utf-8",
    )

    _valid, _message, warnings = module.validate_resource_frontmatter(skill_path)

    assert not any("scaffold_template.md" in w for w in warnings)
    assert any(
        "real_reference.md" in w and "missing frontmatter field" in w
        for w in warnings
    )
