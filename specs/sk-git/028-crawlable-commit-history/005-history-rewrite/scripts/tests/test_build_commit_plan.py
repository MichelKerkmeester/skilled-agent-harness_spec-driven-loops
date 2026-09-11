#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: commit plan builder tests
# ───────────────────────────────────────────────────────────────
"""
Tests for the history-rewrite commit plan builder.

Builds a throwaway repository with one commit shaped for each cascade rule:
a Refs: line to an existing packet, a numeric scope with one matching packet,
a consistent single touch, a single touch whose scope names another track and must not map, a
dominant multi-packet touch, a two-packet tie, a commit touching only a rolling
file, a merge commit and a commit touching nothing under specs.  Checks the
assigned rules, consecutive ordinals and byte-identical repeat runs.

Usage: python3 -m unittest test_build_commit_plan.py
"""
import contextlib
import importlib.util
import io
import json
import subprocess
import tempfile
import unittest
from pathlib import Path
from typing import Dict, List

SCRIPT_PATH = Path(__file__).resolve().parents[1] / "build-commit-plan.py"


def _load_builder():
    """Load build-commit-plan.py as a module despite its hyphenated name."""
    spec = importlib.util.spec_from_file_location("build_commit_plan", SCRIPT_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


BUILD = _load_builder()

PACKET_028 = "specs/sk-git/028-x/spec.md"
PACKET_016 = "specs/hooks/016-x/spec.md"
PACKET_101 = "specs/sk-git/101-a/a.md"
PACKET_102 = "specs/sk-git/102-b/a.md"


def _git(repo: Path, *args: str) -> str:
    """Run git in the test repository and return its stdout."""
    completed = subprocess.run(
        ["git", "-C", str(repo), *args], capture_output=True, check=True
    )
    return completed.stdout.decode("utf-8", errors="replace")


def _write(repo: Path, relative: str, text: str) -> None:
    """Write a file inside the test repository, creating its parents."""
    path = repo / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


class BuildCommitPlanTest(unittest.TestCase):
    """End-to-end cascade tests over a disposable repository."""

    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.repo = Path(self.tmp.name) / "repo"
        self.repo.mkdir()
        self.no_hooks = Path(self.tmp.name) / "no-hooks"
        self.no_hooks.mkdir()
        _git(self.repo, "init", "-q")
        _git(self.repo, "config", "user.name", "Plan Test")
        _git(self.repo, "config", "user.email", "plan@example.test")
        _git(self.repo, "config", "commit.gpgsign", "false")
        _git(self.repo, "config", "core.hooksPath", str(self.no_hooks))
        empty_ignore = Path(self.tmp.name) / "empty.gitignore"
        empty_ignore.write_text("", encoding="utf-8")
        _git(self.repo, "config", "core.excludesFile", str(empty_ignore))
        self._build_history()

    def _commit(self, subject: str, body: str = "") -> None:
        """Stage everything and commit with an explicit subject and body."""
        message = subject if not body else f"{subject}\n\n{body}"
        _git(self.repo, "add", "-A")
        _git(self.repo, "commit", "-q", "-m", message)

    def _build_history(self) -> None:
        """Create one commit per cascade shape, then a merge commit."""
        _write(self.repo, "README.md", "root\n")
        self._commit("chore(license): initial commit")

        _write(self.repo, "notes.md", "refs\n")
        self._commit("chore(999): reference an existing packet", "Refs: specs/sk-git/028-x")

        _write(self.repo, PACKET_028, "packet 028\n")
        self._commit("feat(028): numeric scope matches one packet")

        _write(self.repo, PACKET_016, "packet 016\n")
        self._commit("feat(hooks): consistent unique touch")

        _write(self.repo, PACKET_016, "packet 016 revised\n")
        self._commit("feat(sk-git): inconsistent unique touch")

        _write(self.repo, "specs/sk-git/028-x/a.md", "a\n")
        _write(self.repo, "specs/sk-git/028-x/b.md", "b\n")
        _write(self.repo, "specs/hooks/016-x/other.md", "other\n")
        self._commit("feat(zzz): dominant winner")

        _write(self.repo, PACKET_101, "a\n")
        _write(self.repo, "specs/sk-git/101-a/b.md", "b\n")
        _write(self.repo, PACKET_102, "a\n")
        _write(self.repo, "specs/sk-git/102-b/b.md", "b\n")
        self._commit("feat(zzz): dominant tie")

        _write(self.repo, "specs/hooks/016-x/goal.md", "rolling\n")
        self._commit("feat(zzz): excluded touch only")

        _write(self.repo, "README.md", "root and notes\n")
        self._commit("chore(zzz): outside specs")

        main_branch = _git(self.repo, "rev-parse", "--abbrev-ref", "HEAD").strip()
        _git(self.repo, "checkout", "-q", "-b", "feature")
        _write(self.repo, "feature.md", "feature\n")
        self._commit("feat(zzz): feature branch work")
        _git(self.repo, "checkout", "-q", main_branch)
        _git(self.repo, "merge", "-q", "--no-ff", "feature", "-m", "Merge branch 'feature'")

    def _run(self, out_name: str, *extra: str) -> List[Dict[str, object]]:
        """Run the builder and return the parsed plan rows."""
        out_path = Path(self.tmp.name) / out_name
        argv = ["--repo", str(self.repo), "--tip", "HEAD", "--out", str(out_path), *extra]
        with contextlib.redirect_stderr(io.StringIO()):
            exit_code = BUILD.main(argv)
        self.assertEqual(exit_code, 0)
        text = out_path.read_text(encoding="utf-8")
        return [json.loads(line) for line in text.splitlines()]

    def _by_subject(self, rows: List[Dict[str, object]]) -> Dict[str, Dict[str, object]]:
        """Index plan rows by their subject using a fresh history read."""
        history = BUILD.parse_history(BUILD.read_history(str(self.repo), "HEAD"))
        return {history[str(row["old"])][0]: row for row in rows}

    def test_ordinals_are_consecutive_from_one(self) -> None:
        rows = self._run("plan1.jsonl")
        ordinals = [row["ordinal"] for row in rows]
        self.assertEqual(ordinals, [f"{index:07d}" for index in range(1, len(rows) + 1)])
        self.assertEqual(len(rows), 11)

    def test_each_cascade_rule_assigns_the_expected_packet(self) -> None:
        rows = self._by_subject(self._run("plan2.jsonl"))
        self.assertEqual(rows["chore(999): reference an existing packet"]["rule"], "refs")
        self.assertEqual(rows["chore(999): reference an existing packet"]["spec"], "sk-git/028-x")
        self.assertEqual(rows["feat(028): numeric scope matches one packet"]["rule"], "scope-dir")
        self.assertEqual(rows["feat(028): numeric scope matches one packet"]["spec"], "sk-git/028-x")
        self.assertEqual(rows["feat(hooks): consistent unique touch"]["rule"], "unique-touch")
        self.assertEqual(rows["feat(hooks): consistent unique touch"]["spec"], "hooks/016-x")

    def test_inconsistent_scope_and_excluded_files_do_not_map(self) -> None:
        rows = self._by_subject(self._run("plan3.jsonl"))
        self.assertEqual(rows["feat(sk-git): inconsistent unique touch"]["rule"], "none")
        self.assertIsNone(rows["feat(sk-git): inconsistent unique touch"]["spec"])
        self.assertEqual(rows["feat(zzz): excluded touch only"]["rule"], "none")
        self.assertIsNone(rows["feat(zzz): excluded touch only"]["spec"])
        self.assertEqual(rows["chore(zzz): outside specs"]["rule"], "none")
        self.assertIsNone(rows["chore(zzz): outside specs"]["spec"])

    def test_dominant_touch_and_tie_break_are_deterministic(self) -> None:
        rows = self._by_subject(self._run("plan4.jsonl"))
        self.assertEqual(rows["feat(zzz): dominant winner"]["rule"], "dominant-touch")
        self.assertEqual(rows["feat(zzz): dominant winner"]["spec"], "sk-git/028-x")
        self.assertEqual(rows["feat(zzz): dominant tie"]["rule"], "dominant-touch")
        self.assertEqual(rows["feat(zzz): dominant tie"]["spec"], "sk-git/101-a")
        self.assertFalse(rows["feat(zzz): dominant tie"]["tie"])

    def test_merge_commit_gets_an_ordinal_and_no_packet(self) -> None:
        rows = self._by_subject(self._run("plan5.jsonl"))
        merge = rows["Merge branch 'feature'"]
        self.assertRegex(merge["ordinal"], r"^[0-9]{7}$")
        self.assertEqual(merge["rule"], "none")
        self.assertIsNone(merge["spec"])

    def test_repeat_runs_are_byte_identical(self) -> None:
        self._run("run_a.jsonl", "--sample", "4", "--seed", "7")
        self._run("run_b.jsonl", "--sample", "4", "--seed", "7")
        root = Path(self.tmp.name)
        self.assertEqual((root / "run_a.jsonl").read_bytes(), (root / "run_b.jsonl").read_bytes())
        sample_a = root / "run_a.jsonl.sample.jsonl"
        sample_b = root / "run_b.jsonl.sample.jsonl"
        self.assertEqual(sample_a.read_bytes(), sample_b.read_bytes())

    def test_sample_carries_subject_and_paths(self) -> None:
        self._run("sampled.jsonl", "--sample", "4", "--seed", "7")
        sample = Path(self.tmp.name) / "sampled.jsonl.sample.jsonl"
        records = [json.loads(line) for line in sample.read_text(encoding="utf-8").splitlines()]
        self.assertEqual(len(records), 4)
        for record in records:
            self.assertIn("subject", record)
            self.assertIsInstance(record["paths"], list)
            self.assertIn("spec", record)

    def test_summary_reports_every_rule(self) -> None:
        out_path = Path(self.tmp.name) / "summary.jsonl"
        stderr = io.StringIO()
        with contextlib.redirect_stderr(stderr):
            BUILD.main(["--repo", str(self.repo), "--tip", "HEAD", "--out", str(out_path)])
        text = stderr.getvalue()
        self.assertIn("total: 11", text)
        for rule in ("refs", "scope-dir", "unique-touch", "dominant-touch", "none"):
            self.assertIn(f"{rule}: ", text)


if __name__ == "__main__":
    unittest.main()
