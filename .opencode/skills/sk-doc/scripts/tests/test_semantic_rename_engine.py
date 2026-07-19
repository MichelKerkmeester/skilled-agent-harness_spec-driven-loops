#!/usr/bin/env python3
# ---------------------------------------------------------------------------
# COMPONENT: Semantic Rename Engine Tests
# ---------------------------------------------------------------------------
"""Disposable-repository tests for semantic rename planning and execution."""

import json
import os
import stat
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional


SHARED_SCRIPTS = Path(__file__).resolve().parents[2] / "shared" / "scripts"
SEMANTIC_ENGINE = SHARED_SCRIPTS / "semantic_rename_engine.py"
sys.path.insert(0, str(SHARED_SCRIPTS))

from rename_engine_core import (  # noqa: E402
    ApplyExecutionError,
    DISPOSABLE_CONFIG_KEY,
    DISPOSABLE_MARKER,
    DISPOSABLE_MARKER_CONTENT,
    MapValidationError,
    PlanValidationError,
    PreflightError,
    apply_plan,
    build_plan,
    load_semantic_map,
    rollback_plan,
)


class FixtureRepository:
    """A real Git repository contained entirely in one temporary directory."""

    def __init__(self, *, disposable: bool = True) -> None:
        self._temporary_directory = tempfile.TemporaryDirectory()
        self.workspace = Path(self._temporary_directory.name)
        self.root = self.workspace / "repo"
        self.root.mkdir()
        self.evidence = self.workspace / "evidence"
        self.evidence.mkdir()
        self._git("init", "--quiet")
        self._git("config", "user.email", "rename-engine@example.invalid")
        self._git("config", "user.name", "Rename Engine Fixture")
        self._git("config", "commit.gpgSign", "false")
        hooks = self.workspace / "hooks-disabled"
        hooks.mkdir()
        self._git("config", "core.hooksPath", str(hooks))
        if disposable:
            self._git("config", DISPOSABLE_CONFIG_KEY, "true")
            self.write(DISPOSABLE_MARKER, DISPOSABLE_MARKER_CONTENT)

    def close(self) -> None:
        self._temporary_directory.cleanup()

    def write(self, relative_path: str, content: str = "fixture\n", *, executable: bool = False) -> None:
        path = self.root / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        if executable:
            path.chmod(path.stat().st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)

    def write_many(self, relative_paths: Iterable[str]) -> None:
        for relative_path in relative_paths:
            self.write(relative_path)

    def symlink(self, relative_path: str, target: str) -> None:
        path = self.root / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.symlink_to(target)

    def commit(self, message: str = "fixture base") -> str:
        self._git("add", "--", ".")
        self._git("commit", "--quiet", "-m", message)
        return self.head()

    def head(self) -> str:
        return self._git("rev-parse", "HEAD").stdout.strip()

    def status(self) -> str:
        return self._git("status", "--porcelain=v1", "--untracked-files=all").stdout

    def index_manifest(self) -> str:
        return self._git("ls-files", "-s").stdout

    def map_path(self, base_sha: str, entries: List[Dict[str, Any]]) -> Path:
        path = self.evidence / "semantic-map.json"
        path.write_text(
            json.dumps(
                {"schema_version": 1, "base_sha": base_sha, "entries": entries},
                ensure_ascii=False,
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )
        return path

    def reviewed_plan(self, map_path: Path) -> Dict[str, Any]:
        return build_plan(self.root, load_semantic_map(map_path))

    def save_plan(self, plan: Dict[str, Any]) -> Path:
        path = self.evidence / "reviewed-plan.json"
        path.write_text(json.dumps(plan, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        return path

    def journal_path(self) -> Path:
        return self.evidence / "journal.json"

    def _git(self, *arguments: str) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            ["git", *arguments],
            cwd=self.root,
            check=True,
            capture_output=True,
            text=True,
        )


def rename_entry(
    entry_id: str,
    source: str,
    target: str,
    *,
    dependencies: Optional[List[str]] = None,
) -> Dict[str, Any]:
    """Build an explicit rename row without deriving its target."""
    return {
        "id": entry_id,
        "source": source,
        "target": target,
        "classification": "rename",
        "dependencies": dependencies or [],
    }


def skipped_entry(
    entry_id: str,
    source: str,
    classification: str,
    reason: str,
) -> Dict[str, Any]:
    """Build an explicit non-rename row with an auditable reason."""
    return {
        "id": entry_id,
        "source": source,
        "classification": classification,
        "reason": reason,
    }


class SemanticRenameEngineTests(unittest.TestCase):
    def setUp(self) -> None:
        self.repo = FixtureRepository()

    def tearDown(self) -> None:
        self.repo.close()

    def test_semantic_targets_are_used_without_character_substitution(self) -> None:
        self.repo.write_many(["docs/_common.md", "tests/__fixtures__.json"])
        base = self.repo.commit()
        map_path = self.repo.map_path(
            base,
            [
                rename_entry("common", "docs/_common.md", "docs/common-reference.md"),
                rename_entry("fixtures", "tests/__fixtures__.json", "tests/fixture-data.json"),
            ],
        )

        plan = self.repo.reviewed_plan(map_path)

        self.assertEqual(
            [(row["source"], row["target"]) for row in plan["operation_order"]],
            [
                ("docs/_common.md", "docs/common-reference.md"),
                ("tests/__fixtures__.json", "tests/fixture-data.json"),
            ],
        )

    def test_mixed_extension_cycle_is_one_dependency_scc(self) -> None:
        self.repo.write_many(["src/router_name.ts", "config/routes_name.json", "docs/route_name.md"])
        base = self.repo.commit()
        map_path = self.repo.map_path(
            base,
            [
                rename_entry("ts", "src/router_name.ts", "src/router-name.ts", dependencies=["json"]),
                rename_entry(
                    "json", "config/routes_name.json", "config/routes-name.json", dependencies=["md"]
                ),
                rename_entry("md", "docs/route_name.md", "docs/route-name.md", dependencies=["ts"]),
            ],
        )

        plan = self.repo.reviewed_plan(map_path)

        self.assertEqual(len(plan["batches"]), 1)
        self.assertEqual(plan["batches"][0]["members"], ["json", "md", "ts"])
        self.assertEqual(plan["summary"]["pending"], 3)

    def test_dependency_batches_are_ordered_before_consumers(self) -> None:
        self.repo.write_many(["src/library_name.ts", "config/consumer_name.json"])
        base = self.repo.commit()
        map_path = self.repo.map_path(
            base,
            [
                rename_entry(
                    "consumer",
                    "config/consumer_name.json",
                    "config/consumer-name.json",
                    dependencies=["library"],
                ),
                rename_entry("library", "src/library_name.ts", "src/library-name.ts"),
            ],
        )

        plan = self.repo.reviewed_plan(map_path)

        self.assertEqual([row["members"] for row in plan["batches"]], [["library"], ["consumer"]])
        self.assertEqual(plan["batches"][1]["depends_on"], [plan["batches"][0]["id"]])

    def test_exact_casefold_and_nfc_target_collisions_abort(self) -> None:
        self.repo.write_many(["a_name.md", "b_name.md"])
        base = self.repo.commit()
        collision_targets = [
            ("same.md", "same.md", "exact target collision"),
            ("Docs/Name.md", "docs/name.md", "casefold target collision"),
            ("docs/caf\u00e9.md", "docs/cafe\u0301.md", "nfc target collision"),
        ]
        for first_target, second_target, expected in collision_targets:
            with self.subTest(expected=expected):
                map_path = self.repo.map_path(
                    base,
                    [
                        rename_entry("a", "a_name.md", first_target),
                        rename_entry("b", "b_name.md", second_target),
                    ],
                )
                with self.assertRaisesRegex(MapValidationError, expected):
                    load_semantic_map(map_path)

    def test_casefold_source_aliases_are_rejected_before_repository_access(self) -> None:
        self.repo.write_many(["first.md", "second.md"])
        base = self.repo.commit()
        map_path = self.repo.map_path(
            base,
            [
                rename_entry("first", "Docs/Name.md", "first.md"),
                rename_entry("second", "docs/name.md", "second.md"),
            ],
        )

        with self.assertRaisesRegex(MapValidationError, "casefold source collision"):
            load_semantic_map(map_path)

    def test_existing_casefold_and_nfc_collisions_abort_without_writes(self) -> None:
        self.repo.write_many(["source_name.md", "Docs/Name.md", "unicode/caf\u00e9.md"])
        base = self.repo.commit()
        before = (self.repo.status(), self.repo.index_manifest())
        for target, expected in [
            ("docs/name.md", "casefold collision"),
            ("unicode/cafe\u0301.md", "NFC collision"),
        ]:
            with self.subTest(target=target):
                map_path = self.repo.map_path(base, [rename_entry("source", "source_name.md", target)])
                with self.assertRaisesRegex(PreflightError, expected):
                    self.repo.reviewed_plan(map_path)
                self.assertEqual((self.repo.status(), self.repo.index_manifest()), before)

    def test_policy_exemptions_are_skipped_and_rename_misclassification_fails(self) -> None:
        self.repo.write_many(
            [
                "docs/source_name.md",
                "scripts/helper_name.py",
                "python_package/__init__.py",
                "dist/generated_name.js",
                "vendor/upstream_name.txt",
                "z_archive/old_name.md",
                "SKILL.md",
            ]
        )
        base = self.repo.commit()
        map_path = self.repo.map_path(
            base,
            [
                rename_entry("rename", "docs/source_name.md", "docs/source-name.md"),
                skipped_entry("python", "scripts/helper_name.py", "exempt", "Python file"),
                skipped_entry("package", "python_package", "exempt", "Python package"),
                skipped_entry("generated", "dist/generated_name.js", "generated", "Generated output"),
                skipped_entry("vendor", "vendor/upstream_name.txt", "exempt", "Vendored output"),
                skipped_entry("frozen", "z_archive/old_name.md", "frozen", "Frozen history"),
                skipped_entry("tool", "SKILL.md", "tool-mandated", "Tool contract"),
            ],
        )

        plan = self.repo.reviewed_plan(map_path)
        skipped = [entry for entry in plan["entries"] if entry["state"] == "skipped-with-reason"]
        self.assertEqual(len(skipped), 6)
        self.assertTrue(all(entry["reason"] for entry in skipped))

        unsafe_map = self.repo.map_path(
            base,
            [rename_entry("unsafe", "scripts/helper_name.py", "scripts/helper-name.py")],
        )
        with self.assertRaisesRegex(MapValidationError, "classifies exempt path"):
            self.repo.reviewed_plan(unsafe_map)

    def test_zero_file_and_outside_paths_are_hard_failures(self) -> None:
        self.repo.write("source_name.md")
        base = self.repo.commit()
        empty_map = self.repo.map_path(base, [])
        with self.assertRaisesRegex(MapValidationError, "zero-file map"):
            load_semantic_map(empty_map)

        outside_map = self.repo.map_path(
            base,
            [rename_entry("outside", "source_name.md", "../outside.md")],
        )
        with self.assertRaisesRegex(MapValidationError, "escapes"):
            load_semantic_map(outside_map)

    def test_untracked_sources_and_missing_target_parents_fail_preflight(self) -> None:
        self.repo.write("tracked_name.md")
        base = self.repo.commit()
        self.repo.write("untracked_name.md")
        untracked_map = self.repo.map_path(
            base,
            [rename_entry("untracked", "untracked_name.md", "untracked-name.md")],
        )
        with self.assertRaisesRegex(PreflightError, "zero tracked files"):
            self.repo.reviewed_plan(untracked_map)

        (self.repo.root / "untracked_name.md").unlink()
        missing_parent_map = self.repo.map_path(
            base,
            [rename_entry("tracked", "tracked_name.md", "missing-parent/tracked-name.md")],
        )
        with self.assertRaisesRegex(PreflightError, "target parent"):
            self.repo.reviewed_plan(missing_parent_map)
        self.assertTrue((self.repo.root / "tracked_name.md").exists())
        self.assertFalse((self.repo.root / "missing-parent").exists())

    def test_dry_run_is_repeatable_and_changes_nothing(self) -> None:
        self.repo.write("docs/source_name.md")
        base = self.repo.commit()
        map_path = self.repo.map_path(
            base,
            [rename_entry("source", "docs/source_name.md", "docs/source-name.md")],
        )
        source_path = self.repo.root / "docs/source_name.md"
        before = (self.repo.status(), self.repo.index_manifest(), source_path.read_bytes())

        first = self.repo.reviewed_plan(map_path)
        second = self.repo.reviewed_plan(map_path)

        self.assertEqual(first, second)
        self.assertEqual(first["mode"], "dry-run")
        self.assertEqual(
            (self.repo.status(), self.repo.index_manifest(), source_path.read_bytes()),
            before,
        )

    def test_cli_defaults_to_a_read_only_dry_run(self) -> None:
        self.repo.write("docs/source_name.md")
        base = self.repo.commit()
        map_path = self.repo.map_path(
            base,
            [rename_entry("source", "docs/source_name.md", "docs/source-name.md")],
        )
        before = (self.repo.status(), self.repo.index_manifest())

        result = subprocess.run(
            [
                sys.executable,
                str(SEMANTIC_ENGINE),
                "--repo",
                str(self.repo.root),
                "--map",
                str(map_path),
            ],
            check=False,
            capture_output=True,
            text=True,
        )

        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual(json.loads(result.stdout)["mode"], "dry-run")
        self.assertEqual((self.repo.status(), self.repo.index_manifest()), before)

    def test_apply_preserves_symlink_and_executable_modes_and_is_idempotent(self) -> None:
        self.repo.write("-run_script.sh", "#!/bin/sh\nexit 0\n", executable=True)
        self.repo.write("stable.txt")
        self.repo.symlink("links/current_link", "../stable.txt")
        base = self.repo.commit()
        map_path = self.repo.map_path(
            base,
            [
                rename_entry("script", "-run_script.sh", "-run-script.sh", dependencies=["link"]),
                rename_entry("link", "links/current_link", "links/current-link", dependencies=["script"]),
            ],
        )
        plan = self.repo.reviewed_plan(map_path)
        journal_path = self.repo.journal_path()

        result = apply_plan(self.repo.root, map_path, plan, journal_path)
        rerun = apply_plan(self.repo.root, map_path, plan, journal_path)

        self.assertEqual(result["state"], "applied")
        self.assertEqual(result["mode_manifest_delta"], {"added": [], "changed": [], "removed": []})
        self.assertEqual(rerun["state"], "already-at-target")
        self.assertTrue(os.access(self.repo.root / "-run-script.sh", os.X_OK))
        self.assertTrue((self.repo.root / "links/current-link").is_symlink())
        modes = self.repo.index_manifest()
        self.assertIn("100755", modes)
        self.assertIn("120000", modes)

        rollback = rollback_plan(self.repo.root, map_path, plan, journal_path)
        self.assertEqual(rollback["state"], "reverted")
        self.assertEqual(self.repo.status(), "")
        self.assertTrue((self.repo.root / "-run_script.sh").exists())
        self.assertTrue((self.repo.root / "links/current_link").is_symlink())

    def test_nested_directory_and_file_renames_apply_and_rollback(self) -> None:
        self.repo.write("snake_dir/file_name.md")
        self.repo.write("snake_dir/other.md")
        base = self.repo.commit()
        map_path = self.repo.map_path(
            base,
            [
                rename_entry("directory", "snake_dir", "snake-dir"),
                rename_entry("file", "snake_dir/file_name.md", "snake-dir/file-name.md"),
            ],
        )
        plan = self.repo.reviewed_plan(map_path)
        journal_path = self.repo.journal_path()

        apply_plan(self.repo.root, map_path, plan, journal_path)
        self.assertTrue((self.repo.root / "snake-dir/file-name.md").is_file())
        self.assertTrue((self.repo.root / "snake-dir/other.md").is_file())
        rollback_plan(self.repo.root, map_path, plan, journal_path)
        self.assertTrue((self.repo.root / "snake_dir/file_name.md").is_file())
        self.assertEqual(self.repo.status(), "")

    def test_directory_whose_every_child_is_renamed_applies_and_rolls_back(self) -> None:
        # When every tracked file under a directory is itself renamed, moving each file
        # aside first would leave the directory empty and unmovable. The directory and a
        # nested directory must each move before their descendants' basenames change.
        self.repo.write("snake_dir/first_child.md")
        self.repo.write("snake_dir/second_child.md")
        self.repo.write("snake_dir/nested_dir/leaf_name.md")
        base = self.repo.commit()
        map_path = self.repo.map_path(
            base,
            [
                rename_entry("dir", "snake_dir", "snake-dir"),
                rename_entry("nested", "snake_dir/nested_dir", "snake-dir/nested-dir"),
                rename_entry("first", "snake_dir/first_child.md", "snake-dir/first-child.md"),
                rename_entry("second", "snake_dir/second_child.md", "snake-dir/second-child.md"),
                rename_entry(
                    "leaf", "snake_dir/nested_dir/leaf_name.md", "snake-dir/nested-dir/leaf-name.md"
                ),
            ],
        )
        plan = self.repo.reviewed_plan(map_path)
        journal_path = self.repo.journal_path()

        result = apply_plan(self.repo.root, map_path, plan, journal_path)
        self.assertEqual(result["state"], "applied")
        self.assertTrue((self.repo.root / "snake-dir/first-child.md").is_file())
        self.assertTrue((self.repo.root / "snake-dir/second-child.md").is_file())
        self.assertTrue((self.repo.root / "snake-dir/nested-dir/leaf-name.md").is_file())
        self.assertFalse((self.repo.root / "snake_dir").exists())

        rollback_plan(self.repo.root, map_path, plan, journal_path)
        self.assertTrue((self.repo.root / "snake_dir/first_child.md").is_file())
        self.assertTrue((self.repo.root / "snake_dir/nested_dir/leaf_name.md").is_file())
        self.assertEqual(self.repo.status(), "")

    def test_injected_failure_is_journaled_and_explicit_rollback_restores_clean_tree(self) -> None:
        self.repo.write_many(["one_name.md", "two_name.md"])
        base = self.repo.commit()
        map_path = self.repo.map_path(
            base,
            [
                rename_entry("one", "one_name.md", "one-name.md"),
                rename_entry("two", "two_name.md", "two-name.md"),
            ],
        )
        plan = self.repo.reviewed_plan(map_path)
        journal_path = self.repo.journal_path()

        with self.assertRaisesRegex(ApplyExecutionError, "injected fixture failure"):
            apply_plan(
                self.repo.root,
                map_path,
                plan,
                journal_path,
                inject_failure_after_moves=1,
            )
        journal = json.loads(journal_path.read_text(encoding="utf-8"))
        self.assertEqual(journal["state"], "failed")
        self.assertEqual(len(journal["completed_moves"]), 1)

        result = rollback_plan(self.repo.root, map_path, plan, journal_path)

        self.assertEqual(result["state"], "reverted")
        self.assertEqual(self.repo.status(), "")
        self.assertTrue((self.repo.root / "one_name.md").exists())
        self.assertTrue((self.repo.root / "two_name.md").exists())

    def test_map_drift_dirty_tree_head_drift_and_plan_tampering_abort_before_write(self) -> None:
        cases = ["map", "dirty", "head", "order"]
        for case in cases:
            with self.subTest(case=case):
                repo = FixtureRepository()
                try:
                    repo.write("source_name.md")
                    base = repo.commit()
                    map_path = repo.map_path(
                        base,
                        [rename_entry("source", "source_name.md", "source-name.md")],
                    )
                    plan = repo.reviewed_plan(map_path)
                    before_content = (repo.root / "source_name.md").read_text(encoding="utf-8")
                    if case == "map":
                        map_path.write_text(map_path.read_text(encoding="utf-8") + "\n", encoding="utf-8")
                        expected_error = PlanValidationError
                    elif case == "dirty":
                        repo.write("unrelated.md", "dirty\n")
                        expected_error = PreflightError
                    elif case == "head":
                        repo.write("later.md")
                        repo.commit("head drift")
                        expected_error = PreflightError
                    else:
                        plan["operation_order"][0]["target"] = "tampered.md"
                        expected_error = PlanValidationError
                    with self.assertRaises(expected_error):
                        apply_plan(repo.root, map_path, plan, repo.journal_path())
                    self.assertEqual(
                        (repo.root / "source_name.md").read_text(encoding="utf-8"),
                        before_content,
                    )
                    self.assertFalse((repo.root / "source-name.md").exists())
                finally:
                    repo.close()

    def test_apply_requires_two_disposable_repository_opt_ins(self) -> None:
        self.repo.write("source_name.md")
        base = self.repo.commit()
        map_path = self.repo.map_path(
            base,
            [rename_entry("source", "source_name.md", "source-name.md")],
        )
        plan = self.repo.reviewed_plan(map_path)
        self.repo._git("config", "--unset", DISPOSABLE_CONFIG_KEY)

        with self.assertRaisesRegex(PreflightError, "local Git config"):
            apply_plan(self.repo.root, map_path, plan, self.repo.journal_path())

        self.assertTrue((self.repo.root / "source_name.md").exists())
        self.assertFalse((self.repo.root / "source-name.md").exists())

    def test_symlink_ancestor_is_never_followed_as_a_target_path(self) -> None:
        outside = self.repo.workspace / "outside"
        outside.mkdir()
        self.repo.write("source_name.md")
        self.repo.symlink("escape", str(outside))
        base = self.repo.commit()
        map_path = self.repo.map_path(
            base,
            [rename_entry("source", "source_name.md", "escape/source-name.md")],
        )

        with self.assertRaisesRegex(PreflightError, "traverses symlink ancestor"):
            self.repo.reviewed_plan(map_path)

        self.assertEqual(tuple(outside.iterdir()), ())


if __name__ == "__main__":
    unittest.main(verbosity=2)
