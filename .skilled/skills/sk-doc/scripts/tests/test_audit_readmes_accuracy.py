#!/usr/bin/env python3
"""Regression tests for how the README audit resolves references and discovers READMEs."""

import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List

SCRIPT_DIR = Path(__file__).resolve().parents[2] / "sk-create-readme" / "scripts"
sys.path.insert(0, str(SCRIPT_DIR))

import audit_readmes  # type: ignore


def _repo(tmp_path: Path) -> Path:
    root = tmp_path / "repo"
    root.mkdir()
    subprocess.run(["git", "init", "-q", str(root)], check=True)
    return root.resolve()


def _write(path: Path, text: str = "") -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")
    return path


def _per_file(root: Path, readme: Path) -> List[Dict[str, Any]]:
    content = readme.read_text(encoding="utf-8")
    broken = []
    for ref in sorted(audit_readmes.extract_references(content)):
        ok, checked = audit_readmes.classify_reference_status(readme, root, ref)
        if not ok:
            broken.append({"reference": ref, "checked_paths": checked})
    return [{"file": readme.relative_to(root).as_posix(), "broken_references": broken}]


def _broken(item: Dict[str, Any]) -> List[str]:
    return [broken["reference"] for broken in item["broken_references"]]


def test_gitignored_runtime_path_is_resolved_with_evidence(tmp_path: Path) -> None:
    root = _repo(tmp_path)
    _write(root / ".gitignore", "logs/\nlib/**/*.js\n")
    (root / "lib" / "config").mkdir(parents=True)
    readme = _write(
        root / "README.md",
        "Logs land in `./logs/run.log` and builds in `./lib/config/flags.js`.\n"
        "A typo stays broken: `./lib/nope/flags.js`. So does `./missing.md`.\n",
    )
    per_file = _per_file(root, readme)
    assert set(_broken(per_file[0])) == {
        "./logs/run.log", "./lib/config/flags.js", "./lib/nope/flags.js", "./missing.md",
    }

    audit_readmes.resolve_gitignored_references(root, per_file)

    assert sorted(_broken(per_file[0])) == ["./lib/nope/flags.js", "./missing.md"]
    resolved = {item["reference"]: item for item in per_file[0]["resolved_references"]}
    assert set(resolved) == {"./logs/run.log", "./lib/config/flags.js"}
    assert resolved["./logs/run.log"]["evidence"] == "gitignored_runtime_path"
    assert resolved["./logs/run.log"]["path"] == "logs/run.log"


def test_absent_ignored_folder_is_resolved_with_a_trailing_slash_reference(tmp_path: Path) -> None:
    root = _repo(tmp_path)
    _write(root / "release" / ".gitignore", "runs/\n")
    readme = _write(
        root / "README.md",
        "Runs land in `./release/runs/`. A typo stays broken: `./release/nope/`.\n",
    )
    per_file = _per_file(root, readme)
    assert set(_broken(per_file[0])) == {"./release/runs/", "./release/nope/"}

    audit_readmes.resolve_gitignored_references(root, per_file)

    assert _broken(per_file[0]) == ["./release/nope/"]
    resolved = {item["reference"]: item for item in per_file[0]["resolved_references"]}
    assert set(resolved) == {"./release/runs/"}
    assert resolved["./release/runs/"]["evidence"] == "gitignored_runtime_path"


def test_path_outside_the_repo_is_never_cleared_by_gitignore(tmp_path: Path) -> None:
    root = _repo(tmp_path)
    _write(root / ".gitignore", "*.log\n")
    readme = _write(root / "docs" / "README.md", "See `../../outside/run.log`.\n")
    per_file = _per_file(root, readme)

    audit_readmes.resolve_gitignored_references(root, per_file)

    assert _broken(per_file[0]) == ["../../outside/run.log"]
    assert "resolved_references" not in per_file[0]


def test_bare_token_resolves_from_the_nearest_package_root(tmp_path: Path) -> None:
    root = _repo(tmp_path)
    _write(root / "pkg" / "package.json", "{}\n")
    _write(root / "pkg" / "lib" / "api" / "index.ts")
    readme = _write(
        root / "pkg" / "docs" / "sub" / "README.md",
        "The entry is [api](lib/api/index.ts); a dotted path stays README-relative: [x](../lib/api/index.ts).\n",
    )

    ok, _checked = audit_readmes.classify_reference_status(readme, root, "lib/api/index.ts")
    dotted_ok, _ = audit_readmes.classify_reference_status(readme, root, "../lib/api/index.ts")

    assert ok is True
    assert dotted_ok is False


def test_package_root_search_stops_at_the_repo_root(tmp_path: Path) -> None:
    root = _repo(tmp_path)
    _write(tmp_path / "package.json", "{}\n")
    (root / "a" / "b").mkdir(parents=True)

    assert audit_readmes.nearest_package_root(root / "a" / "b", root) is None


def test_reference_through_a_symlinked_folder_resolves(tmp_path: Path) -> None:
    root = _repo(tmp_path)
    _write(root / "real" / "plugins" / "gate.js")
    (root / "linked").symlink_to(root / "real", target_is_directory=True)
    readme = _write(root / "README.md", "The gate is [gate](./linked/plugins/gate.js).\n")

    ok, _checked = audit_readmes.classify_reference_status(readme, root, "./linked/plugins/gate.js")

    assert ok is True


def test_discovery_matches_readme_names_case_sensitively(tmp_path: Path) -> None:
    root = _repo(tmp_path)
    _write(root / ".skilled" / "commands" / "create" / "readme.md", "# The create readme command\n")
    _write(root / ".skilled" / "skills" / "demo" / "README.md", "# Demo\n")
    _write(root / ".skilled" / "skills" / "other" / "README.markdown", "# Other\n")
    subprocess.run(["git", "-C", str(root), "add", "-A"], check=True)

    found = {path.relative_to(root).as_posix() for path in audit_readmes.find_readmes(root)}
    manifest = audit_readmes.build_durable_manifest(root)

    assert found == {".skilled/skills/demo/README.md", ".skilled/skills/other/README.markdown"}
    assert ".skilled/commands/create" not in manifest["directories"]
    assert ".skilled/skills/demo" in manifest["directories"]
    assert audit_readmes._has_readme_file(root / ".skilled" / "commands" / "create") is False


def test_folder_named_as_a_fixture_is_a_fixture_payload(tmp_path: Path) -> None:
    root = _repo(tmp_path)
    fixture = root / ".skilled" / "skills" / "demo" / "scripts" / "rule-experiment-fixture" / "README.md"
    numbered = root / ".skilled" / "skills" / "demo" / "001-goals-fixture" / "README.md"

    assert audit_readmes.classify_path(root, fixture) == "fixture_payload"
    assert audit_readmes.classify_path(root, numbered) is None
