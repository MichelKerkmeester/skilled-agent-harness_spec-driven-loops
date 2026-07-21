#!/usr/bin/env python3
"""Contract and packaging regressions for package_skill.py."""

import importlib.util
import json
import shutil
import subprocess
import sys
import uuid
import zipfile
from pathlib import Path


def _load_module():
    scripts_dir = Path(__file__).resolve().parents[1]
    module_path = scripts_dir / "package_skill.py"
    spec = importlib.util.spec_from_file_location("package_skill", module_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _load_init_module():
    scripts_dir = Path(__file__).resolve().parents[1]
    module_path = scripts_dir / "init_skill.py"
    spec = importlib.util.spec_from_file_location("init_skill", module_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _load_validator_module():
    scripts_dir = Path(__file__).resolve().parents[1]
    module_path = scripts_dir / "validate_skill_package.py"
    spec = importlib.util.spec_from_file_location("validate_skill_package", module_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _temporary_hub_name() -> str:
    return f"test-hub-{uuid.uuid4().hex[:8]}"


def _activation_dir(hub_name: str) -> Path:
    opencode_root = Path(__file__).resolve().parents[4]
    return (
        opencode_root
        / "bin/lib/compiled-routing/010-live-activation/activation"
        / hub_name
    )


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


def test_standalone_scaffold_emits_kebab_root_and_rejects_underscore(tmp_path):
    module = _load_init_module()

    skill_path = module.init_skill("demo-skill", str(tmp_path))
    invalid_path = module.init_skill("demo_skill", str(tmp_path))

    assert skill_path == tmp_path / "demo-skill"
    assert (skill_path / "SKILL.md").is_file()
    assert invalid_path is None
    assert not (tmp_path / "demo_skill").exists()


def test_parent_scaffold_emits_kebab_storage_and_exact_tool_names(tmp_path):
    module = _load_init_module()

    skill_path = module.init_parent_skill("demo-hub", str(tmp_path))

    assert skill_path == tmp_path / "demo-hub"
    expected_paths = {
        "SKILL.md",
        "README.md",
        "mode-registry.json",
        "hub-router.json",
        "description.json",
        "graph-metadata.json",
        "manual-testing-playbook",
        "benchmark",
        "changelog",
        "demo-hub-primary/SKILL.md",
        "demo-hub-primary/README.md",
    }
    emitted_paths = {
        path.relative_to(skill_path).as_posix()
        for path in skill_path.rglob("*")
    }
    assert expected_paths <= emitted_paths
    assert "manual_testing_playbook" not in emitted_paths


def test_parent_scaffold_defaults_to_legacy_without_manifest(tmp_path, capsys):
    init_module = _load_init_module()
    validator_module = _load_validator_module()
    hub_name = _temporary_hub_name()

    skill_path = init_module.init_parent_skill(hub_name, str(tmp_path))
    output = capsys.readouterr().out

    assert skill_path == tmp_path / hub_name
    assert "Compiled routing: legacy (no manifest)" in output
    assert "compiled-ready" not in output
    assert not _activation_dir(hub_name).exists()
    directive = (skill_path / "SKILL.md").read_text(encoding="utf-8")
    assert f"compiled-route.cjs --hub {hub_name}" in directive
    check = validator_module.check_compiled_routing_state(
        skill_path,
        Path(__file__).resolve().parents[4],
    )
    assert check["ok"] is True
    assert "legacy" in check["name"]


def test_parent_scaffold_ready_mints_and_verifies_canonical_manifest(
    tmp_path,
    capsys,
):
    init_module = _load_init_module()
    validator_module = _load_validator_module()
    hub_name = _temporary_hub_name()
    activation_dir = _activation_dir(hub_name)

    try:
        skill_path = init_module.init_parent_skill(
            hub_name,
            str(tmp_path),
            compiled_routing="ready",
        )
        output = capsys.readouterr().out

        assert skill_path == tmp_path / hub_name
        assert "compiled-ready (fresh manifest verified" in output
        manifest = json.loads(
            (activation_dir / "manifest.json").read_text(encoding="utf-8")
        )
        assert manifest["selectedPolicy"]["generation"] == 1
        assert manifest["servingAuthority"] == "legacy"
        assert manifest["shadowOnly"] is True
        check = validator_module.check_compiled_routing_state(
            skill_path,
            Path(__file__).resolve().parents[4],
        )
        assert check["ok"] is True
        assert "compiled-ready" in check["name"]
    finally:
        if activation_dir.exists():
            shutil.rmtree(activation_dir)


def test_parent_scaffold_never_reports_ready_when_mint_fails(tmp_path, capsys):
    init_module = _load_init_module()
    hub_name = _temporary_hub_name()
    activation_dir = _activation_dir(hub_name)
    first_root = tmp_path / "first"
    second_root = tmp_path / "second"

    try:
        legacy_path = init_module.init_parent_skill(hub_name, str(first_root))
        minted, _payload, error = init_module._run_manifest_command(
            "mint",
            hub_name,
            legacy_path,
        )
        assert minted is True, error
        capsys.readouterr()

        result = init_module.init_parent_skill(
            hub_name,
            str(second_root),
            compiled_routing="ready",
        )
        output = capsys.readouterr().out

        assert result is None
        assert "manifest mint failed" in output
        assert "Compiled routing: compiled-ready" not in output
    finally:
        if activation_dir.exists():
            shutil.rmtree(activation_dir)


def test_parent_scaffold_legacy_rejects_preexisting_manifest(tmp_path, capsys):
    init_module = _load_init_module()
    hub_name = _temporary_hub_name()
    activation_dir = _activation_dir(hub_name)

    try:
        ready_path = init_module.init_parent_skill(
            hub_name,
            str(tmp_path / "ready"),
            compiled_routing="ready",
        )
        assert ready_path is not None
        capsys.readouterr()

        result = init_module.init_parent_skill(
            hub_name,
            str(tmp_path / "legacy"),
            compiled_routing="legacy",
        )
        output = capsys.readouterr().out

        assert result is None
        assert "requires no canonical manifest" in output
        assert "Compiled routing: legacy (no manifest)" not in output
    finally:
        if activation_dir.exists():
            shutil.rmtree(activation_dir)


def test_parent_templates_carry_the_same_exact_directive():
    root = Path(__file__).resolve().parents[2] / "create-skill/assets/parent-skill"
    scaffold = (root / "scaffold/hub-skill-scaffold.md").resolve()
    canonical = (root / "parent-skill-hub-template.md").resolve()

    def directive(path: Path) -> str:
        lines = path.read_text(encoding="utf-8").splitlines()
        start = next(
            index for index, line in enumerate(lines)
            if line.startswith("> **Compiled routing (default-on fleet-wide, flag-gated, additive).**")
        )
        block = []
        for line in lines[start:]:
            if not line.startswith(">"):
                break
            block.append(line)
        return "\n".join(block)

    assert directive(scaffold) == directive(canonical)


def test_compiled_routing_option_is_parent_only(tmp_path):
    script = Path(__file__).resolve().parents[1] / "init_skill.py"
    result = subprocess.run(
        [
            sys.executable,
            str(script),
            "standalone-fixture",
            "--path",
            str(tmp_path),
            "--compiled-routing",
            "ready",
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        check=False,
    )

    assert result.returncode != 0
    assert "only valid with --kind parent" in result.stderr
    assert not (tmp_path / "standalone-fixture").exists()


def test_compiled_routing_validator_rejects_stale_manifest(tmp_path):
    init_module = _load_init_module()
    validator_module = _load_validator_module()
    hub_name = _temporary_hub_name()
    activation_dir = _activation_dir(hub_name)

    try:
        skill_path = init_module.init_parent_skill(
            hub_name,
            str(tmp_path),
            compiled_routing="ready",
        )
        router_path = skill_path / "hub-router.json"
        router = json.loads(router_path.read_text(encoding="utf-8"))
        router["routerPolicy"]["ambiguityDelta"] = 2
        router_path.write_text(json.dumps(router, indent=2) + "\n", encoding="utf-8")

        check = validator_module.check_compiled_routing_state(
            skill_path,
            Path(__file__).resolve().parents[4],
        )
        assert check["ok"] is False
        assert "stale-manifest" in check["output"]
    finally:
        if activation_dir.exists():
            shutil.rmtree(activation_dir)


def test_parent_scaffold_never_reports_ready_when_minter_is_missing(
    tmp_path,
    capsys,
    monkeypatch,
):
    init_module = _load_init_module()
    hub_name = _temporary_hub_name()
    monkeypatch.setattr(
        init_module,
        "_compiled_manifest_cli",
        lambda: tmp_path / "missing-manifest-cli.cjs",
    )

    result = init_module.init_parent_skill(
        hub_name,
        str(tmp_path),
        compiled_routing="ready",
    )
    output = capsys.readouterr().out

    assert result is None
    assert "manifest mint failed" in output
    assert "Compiled routing: compiled-ready" not in output


def test_compiled_routing_validator_rejects_malformed_manifest(tmp_path):
    init_module = _load_init_module()
    validator_module = _load_validator_module()
    hub_name = _temporary_hub_name()
    activation_dir = _activation_dir(hub_name)

    try:
        skill_path = init_module.init_parent_skill(
            hub_name,
            str(tmp_path),
            compiled_routing="ready",
        )
        (activation_dir / "manifest.json").write_text("{malformed\n", encoding="utf-8")

        check = validator_module.check_compiled_routing_state(
            skill_path,
            Path(__file__).resolve().parents[4],
        )
        assert check["ok"] is False
        assert "invalid-manifest" in check["output"]
    finally:
        if activation_dir.exists():
            shutil.rmtree(activation_dir)


def test_parent_scaffold_rejects_unknown_compiled_state(tmp_path, capsys):
    init_module = _load_init_module()

    result = init_module.init_parent_skill(
        _temporary_hub_name(),
        str(tmp_path),
        compiled_routing="unknown",
    )
    output = capsys.readouterr().out

    assert result is None
    assert "must be 'legacy' or 'ready'" in output
    assert "compiled-ready" not in output


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


def test_package_uses_kebab_archive_root_and_members(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(tmp_path / "demo-skill")
    references = skill_path / "references"
    references.mkdir()
    (references / "quick-guide.md").write_text(
        "---\n"
        "title: Quick Guide\n"
        "description: Canonical package path fixture.\n"
        "trigger_phrases:\n"
        "  - \"quick guide\"\n"
        "importance_tier: normal\n"
        "contextType: general\n"
        "version: 1.0.0.0\n"
        "---\n\n# Quick Guide\n",
        encoding="utf-8",
    )

    zip_path = module.package_skill(str(skill_path), str(tmp_path / "packages"))

    assert zip_path is not None
    assert zip_path.name == "demo-skill.zip"
    with zipfile.ZipFile(zip_path) as archive:
        names = archive.namelist()
    assert "demo-skill/SKILL.md" in names
    assert "demo-skill/references/quick-guide.md" in names
    assert all("_" not in part for name in names for part in Path(name).parts)


def test_packaging_rejects_noncanonical_generated_resource_path(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(tmp_path / "demo-skill")
    references = skill_path / "references"
    references.mkdir()
    (references / "bad_name.md").write_text("# Invalid name\n", encoding="utf-8")

    zip_path = module.package_skill(str(skill_path), str(tmp_path / "packages"))

    assert zip_path is None
    strict_valid, strict_message, _warnings = module.validate_skill(
        skill_path,
        strict=True,
    )
    assert strict_valid is False
    assert "must use kebab-case" in strict_message


def test_generated_path_check_preserves_python_and_tool_exemptions(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(tmp_path / "demo-skill")
    package_dir = skill_path / "scripts" / "python_package"
    package_dir.mkdir(parents=True)
    (package_dir / "__init__.py").write_text("", encoding="utf-8")
    (package_dir / "helper_module.py").write_text("", encoding="utf-8")
    (skill_path / "action.yml").write_text("name: demo\n", encoding="utf-8")

    _valid, _message, warnings = module.validate_generated_paths(skill_path)

    assert warnings == []


def test_completion_wrapper_strictly_rejects_underscore_resource_path(tmp_path):
    skill_path = _write_valid_skill(tmp_path / "demo-skill")
    references = skill_path / "references"
    references.mkdir()
    (references / "bad_name.md").write_text("# Invalid name\n", encoding="utf-8")
    validator = Path(__file__).resolve().parents[1] / "validate_skill_package.py"

    result = subprocess.run(
        [sys.executable, str(validator), str(skill_path), "--strict"],
        capture_output=True,
        text=True,
        check=False,
    )

    assert result.returncode == 1
    assert "package_skill.py --check --strict: FAIL" in result.stdout
    assert "must use kebab-case" in result.stdout


def test_skill_template_asset_exempt_from_resource_frontmatter(tmp_path):
    module = _load_module()
    skill_path = _write_valid_skill(tmp_path / "with-template-asset")
    asset_dir = skill_path / "assets" / "skill"
    asset_dir.mkdir(parents=True)
    # A scaffold template renders into a new skill's SKILL.md, so it carries
    # skill frontmatter (name + allowed-tools), not the resource-doc block.
    (asset_dir / "scaffold-template.md").write_text(
        "---\n"
        "name: {{SKILL_NAME}}\n"
        "description: TODO one-line description of the scaffolded skill.\n"
        "allowed-tools: [Read, Write, Edit]\n"
        "version: 1.0.0.0\n"
        "---\n\n# {{SKILL_TITLE}}\n",
        encoding="utf-8",
    )
    # Control: a real resource doc missing the 5-field block still warns.
    (asset_dir / "real-reference.md").write_text(
        "---\ntitle: Real Doc\n---\n\nbody\n",
        encoding="utf-8",
    )

    _valid, _message, warnings = module.validate_resource_frontmatter(skill_path)

    assert not any("scaffold-template.md" in w for w in warnings)
    assert any(
        "real-reference.md" in w and "missing frontmatter field" in w
        for w in warnings
    )
