#!/usr/bin/env python3
# ---------------------------------------------------------------------------
# COMPONENT: Rename Tooling Fixture Harness Tests
# ---------------------------------------------------------------------------
"""End-to-end tests for the disposable semantic rename fixture harness."""

from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


SHARED_SCRIPTS = Path(__file__).resolve().parents[2] / "shared" / "scripts"
HARNESS = SHARED_SCRIPTS / "rename_tooling_fixture_harness.py"
sys.path.insert(0, str(SHARED_SCRIPTS))

from git_env import scrub_git_env  # noqa: E402
from rename_tooling_fixture_core import (  # noqa: E402
    DEFAULT_CORPUS,
    HarnessError,
    assert_fixture_boundary,
    load_corpus,
    run_harness,
    snapshot_git_worktree,
)


def _sentinel_git(root: Path, *arguments: str) -> None:
    """Run Git inside the sentinel repository with hooks, signing, and env redirects off."""
    subprocess.run(
        [
            "git",
            "-C",
            str(root),
            "-c",
            "user.email=sentinel@example.invalid",
            "-c",
            "user.name=Protected Sentinel",
            "-c",
            "commit.gpgSign=false",
            "-c",
            "core.hooksPath=/dev/null",
            *arguments,
        ],
        check=True,
        capture_output=True,
        env=scrub_git_env(),
    )


def _build_protected_sentinel(root: Path) -> None:
    """Seed a small dirty Git worktree that stands in for the operator's checkout.

    The live checkout is never the protected root: its unrelated uncommitted state
    (another session's deletions, edits in flight) would decide whether this test
    passes. The sentinel carries the dirty states the snapshot must cover, a
    committed file, a modified tracked file, a tracked file deleted without a
    commit, and an untracked file, so a harness write into the protected root
    still moves its digest.
    """
    root.mkdir()
    _sentinel_git(root, "init", "--quiet")
    (root / "committed.md").write_text("committed baseline\n", encoding="utf-8")
    (root / "modified.md").write_text("committed baseline\n", encoding="utf-8")
    (root / "deleted.md").write_text("committed baseline\n", encoding="utf-8")
    _sentinel_git(root, "add", "--", ".")
    _sentinel_git(root, "commit", "--quiet", "-m", "protected sentinel baseline")
    (root / "modified.md").write_text("uncommitted edit\n", encoding="utf-8")
    (root / "deleted.md").unlink()
    (root / "untracked.md").write_text("untracked operator note\n", encoding="utf-8")


class RenameToolingFixtureHarnessTests(unittest.TestCase):
    """Prove corpus completeness, dry-run safety, apply isolation, and determinism."""

    def setUp(self) -> None:
        # One sentinel per test, so a write leaked by an earlier test cannot hide a later one.
        sentinel_parent = tempfile.TemporaryDirectory(prefix="rename-harness-protected-")
        self.addCleanup(sentinel_parent.cleanup)
        self.protected_root = (Path(sentinel_parent.name) / "protected").resolve()
        _build_protected_sentinel(self.protected_root)

    def test_corpus_declares_a_non_zero_explicit_scenario_matrix(self) -> None:
        """The corpus validator should accept the complete explicit coverage contract."""
        corpus = load_corpus(DEFAULT_CORPUS)

        self.assertEqual(corpus["schema_version"], 1)
        self.assertEqual(
            corpus["program_base_sha"],
            "1ec0ad2947b19ac3053c7b031b7d43e67bf42bbe",
        )
        self.assertEqual(len(corpus["scenarios"]), 10)
        self.assertTrue(all(scenario["map_entries"] for scenario in corpus["scenarios"]))

    def test_default_cli_is_dry_run_deterministic_and_non_mutating(self) -> None:
        """The default CLI should execute no rename apply or rollback operation."""
        protected_before = snapshot_git_worktree(self.protected_root)
        result = subprocess.run(
            [
                sys.executable,
                str(HARNESS),
                "--protected-root",
                str(self.protected_root),
                "--repeat",
                "2",
            ],
            cwd=self.protected_root,
            check=False,
            capture_output=True,
            text=True,
        )

        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        report = json.loads(result.stdout)
        self.assertEqual(report["mode"], "dry-run")
        self.assertTrue(report["protected_unchanged"])
        self.assertEqual(len(set(report["repeat_hashes"])), 1)
        lifecycle = next(row for row in report["scenario_results"] if row["id"] == "semantic-lifecycle")
        self.assertEqual(lifecycle["apply_state"], "not-requested")
        self.assertEqual(lifecycle["idempotent_state"], "not-requested")
        self.assertEqual(lifecycle["rollback_state"], "not-requested")
        self.assertGreater(lifecycle["rewrite_pending"], 0)
        self.assertTrue(lifecycle["rewrite_dynamic_routed"])
        self.assertEqual(lifecycle["rewrite_apply_state"], "not-requested")
        revalidation = next(
            row for row in report["scenario_results"] if row["id"] == "plan-revalidation"
        )
        self.assertEqual(revalidation["status"], "not-requested")
        self.assertEqual(snapshot_git_worktree(self.protected_root), protected_before)

    def test_explicit_apply_and_rollback_remain_inside_disposable_repositories(self) -> None:
        """Opt-in mutation should prove apply, idempotency, rollback, and stale-plan aborts."""
        protected_before = snapshot_git_worktree(self.protected_root)
        report = run_harness(
            corpus_path=DEFAULT_CORPUS,
            protected_root=self.protected_root,
            repeat=1,
            exercise_apply=True,
            exercise_rollback=True,
        )

        lifecycle = next(row for row in report["scenario_results"] if row["id"] == "semantic-lifecycle")
        self.assertEqual(lifecycle["apply_state"], "applied")
        self.assertEqual(lifecycle["idempotent_state"], "already-at-target")
        self.assertEqual(lifecycle["rollback_state"], "reverted")
        self.assertTrue(lifecycle["baseline_restored"])
        self.assertEqual(lifecycle["rewrite_apply_state"], "applied")
        self.assertEqual(lifecycle["rewrite_rerun_pending"], 0)
        self.assertEqual(lifecycle["rewrite_rollback_state"], "reverted")
        self.assertTrue(lifecycle["cross_batch_unchanged"])
        revalidation = next(
            row for row in report["scenario_results"] if row["id"] == "plan-revalidation"
        )
        self.assertEqual(revalidation["status"], "expected-failures")
        self.assertEqual(len(revalidation["cases"]), 4)
        cas = next(
            row for row in report["scenario_results"] if row["id"] == "cas-drift-regeneration"
        )
        self.assertTrue(cas["stale_preimage_rejected"])
        self.assertTrue(cas["regenerated_preimage_matches"])
        self.assertEqual(cas["executor_apply_state"], "applied")
        self.assertTrue(cas["executor_regenerated"])
        self.assertEqual(cas["executor_rollback_state"], "reverted")
        self.assertEqual(snapshot_git_worktree(self.protected_root), protected_before)

    def test_snapshot_records_tracked_deletions_as_absent(self) -> None:
        """A tracked file already missing is stable state; one removed during a run is a change."""
        already_absent = snapshot_git_worktree(self.protected_root)
        self.assertEqual(snapshot_git_worktree(self.protected_root), already_absent)

        (self.protected_root / "committed.md").unlink()
        self.assertNotEqual(snapshot_git_worktree(self.protected_root), already_absent)

    def test_boundary_and_flag_guards_fail_before_fixture_mutation(self) -> None:
        """Protected roots, outside roots, and rollback-only requests should be rejected."""
        with tempfile.TemporaryDirectory() as raw_workspace:
            workspace = Path(raw_workspace)
            with self.assertRaisesRegex(HarnessError, "overlaps the protected worktree"):
                assert_fixture_boundary(self.protected_root, workspace, self.protected_root)
            with tempfile.TemporaryDirectory() as raw_outside:
                outside = Path(raw_outside)
                with self.assertRaisesRegex(HarnessError, "outside the harness-owned temporary root"):
                    assert_fixture_boundary(outside, workspace, self.protected_root)

        with self.assertRaisesRegex(HarnessError, "requires explicit apply"):
            run_harness(
                corpus_path=DEFAULT_CORPUS,
                protected_root=self.protected_root,
                repeat=1,
                exercise_apply=False,
                exercise_rollback=True,
            )


if __name__ == "__main__":
    unittest.main(verbosity=2)
