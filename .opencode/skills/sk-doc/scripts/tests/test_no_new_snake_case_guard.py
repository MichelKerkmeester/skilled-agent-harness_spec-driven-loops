#!/usr/bin/env python3
# ---------------------------------------------------------------------------
# COMPONENT: No-New-Snake-Case Guard Tests
# ---------------------------------------------------------------------------
"""Integration fixtures for changed-only and whole-tree naming scans."""

import subprocess
import tempfile
import unittest
from pathlib import Path
from typing import Iterable


GUARD = (
    Path(__file__).resolve().parents[2]
    / "shared"
    / "scripts"
    / "check_no_new_snake_case.py"
)


class FixtureRepository:
    """A disposable git repository used to exercise real diff semantics."""

    def __init__(self) -> None:
        self._temporary_directory = tempfile.TemporaryDirectory()
        self.root = Path(self._temporary_directory.name)
        self._git("init", "--quiet")
        self._git("config", "user.email", "guard@example.invalid")
        self._git("config", "user.name", "Guard Fixture")
        self._git("config", "commit.gpgSign", "false")
        disabled_hooks = self.root / ".hooks-disabled"
        disabled_hooks.mkdir()
        self._git("config", "core.hooksPath", str(disabled_hooks))

    def close(self) -> None:
        self._temporary_directory.cleanup()

    def write(self, relative_path: str, content: str = "fixture\n") -> None:
        path = self.root / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")

    def write_many(self, paths: Iterable[str]) -> None:
        for path in paths:
            self.write(path)

    def commit(self, message: str) -> str:
        self._git("add", ".")
        self._git("commit", "--quiet", "-m", message)
        return self._git("rev-parse", "HEAD").stdout.strip()

    def guard(self, *args: str) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            ["python3", str(GUARD), *args],
            cwd=self.root,
            check=False,
            capture_output=True,
            text=True,
        )

    def _git(self, *args: str) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            ["git", *args],
            cwd=self.root,
            check=True,
            capture_output=True,
            text=True,
        )


class NoNewSnakeCaseGuardTests(unittest.TestCase):
    def setUp(self) -> None:
        self.repo = FixtureRepository()

    def tearDown(self) -> None:
        self.repo.close()

    def test_changed_since_rejects_new_snake_and_accepts_hyphen(self) -> None:
        self.repo.write("docs/existing-name.md")
        base = self.repo.commit("base")

        self.repo.write("docs/new_snake_name.md")
        failed = self.repo.guard("--changed-since", base)
        self.assertEqual(failed.returncode, 1, failed.stdout + failed.stderr)
        self.assertIn("docs/new_snake_name.md", failed.stdout)

        (self.repo.root / "docs/new_snake_name.md").unlink()
        self.repo.write("docs/new-hyphen-name.md")
        passed = self.repo.guard("--changed-since", base)
        self.assertEqual(passed.returncode, 0, passed.stdout + passed.stderr)

    def test_changed_since_ignores_preexisting_debt(self) -> None:
        self.repo.write("docs/pre_existing_debt.md")
        base = self.repo.commit("base with debt")
        self.repo.write("docs/pre_existing_debt.md", "modified\n")
        self.repo.write("docs/new-clean-name.md")

        result = self.repo.guard("--changed-since", base)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertNotIn("pre_existing_debt.md", result.stdout)

    def test_every_exemption_passes_both_modes(self) -> None:
        self.repo.write_many(
            [
                ".opencode/specs/example/001-done/implementation-summary.md",
                ".opencode/specs/example/001-done/spec.md",
                "docs/clean-name.md",
            ]
        )
        base = self.repo.commit("base")

        self.repo.write_many(
            [
                ".codex/agents/goal_opencode.md",
                ".codex/prompts/agent_router.md",
                ".opencode/specs/example/001-done/old_spec_name.md",
                ".utcp_config.json",
                "README.md",
                "SKILL.md",
                "action.yml",
                "changelog/old_release_name.md",
                "conftest.py",
                "dist/generated_file.js",
                "package-lock.json",
                "python_package/__init__.py",
                "python_package/module_name.py",
                "router_test.py",
                "scripts/helper_name.py",
                "test_router.py",
                "tests/__mocks__/mock_name.js",
                "tests/__snapshots__/saved_state.snap",
                "third_party/upstream_name.txt",
                "vendor/upstream_name/file_name.txt",
                "z_archive/old_file_name.md",
            ]
        )

        changed = self.repo.guard("--changed-since", base)
        self.assertEqual(changed.returncode, 0, changed.stdout + changed.stderr)
        whole_tree = self.repo.guard("--all")
        self.assertEqual(whole_tree.returncode, 0, whole_tree.stdout + whole_tree.stderr)

    def test_all_enumerates_offenders_deterministically(self) -> None:
        self.repo.write_many(
            [
                "zeta_name.md",
                "alpha_name.md",
                "snake_dir/clean-name.md",
                "snake_dir/file_name.md",
                "feature_catalog/read-path.md",
            ]
        )
        self.repo.commit("tree with debt")

        first = self.repo.guard("--all")
        second = self.repo.guard("--all")
        self.assertEqual(first.returncode, 1, first.stdout + first.stderr)
        self.assertEqual(first.stdout, second.stdout)
        offender_lines = [line.removeprefix("  - ") for line in first.stdout.splitlines()[1:]]
        self.assertEqual(
            offender_lines,
            [
                "alpha_name.md",
                "feature_catalog",
                "snake_dir",
                "snake_dir/file_name.md",
                "zeta_name.md",
            ],
        )


if __name__ == "__main__":
    unittest.main(verbosity=2)
