#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: subject plan builder tests
# ───────────────────────────────────────────────────────────────
"""
Tests for the second-pass subject plan builder.

Builds a throwaway repository with one commit shaped for each subject rule:
a missing type, a legacy type, a numeric scope, a slash scope, a summary that
needs normalization, a subject that already carries the packet word, one that
gains it, one past the length cap, a vague summary, a summary the rules empty
out and a merge commit.  Checks the rules each row reports, the residual rows
and that every rewritten subject passes the ported grammar.

Usage: python3 -m unittest test_build_subject_plan.py
"""
import contextlib
import importlib.util
import io
import json
import subprocess
import tempfile
import unittest
from pathlib import Path
from typing import Dict, List, Optional, Tuple

SCRIPT_PATH = Path(__file__).resolve().parents[1] / "build-subject-plan.py"
PACKET = "sk-git/028-crawlable-commit-history"
LONG_SUBJECT = "chore(infra): " + " ".join(["normalize the subject plan rows"] * 5)
LONG_PREFIX = "chore(infra): "


def _load_builder():
    """Load build-subject-plan.py as a module despite its hyphenated name."""
    spec = importlib.util.spec_from_file_location("build_subject_plan", SCRIPT_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


SUBJECTS = _load_builder()


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


class BuildSubjectPlanTest(unittest.TestCase):
    """End-to-end rule tests over a disposable repository."""

    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.repo = Path(self.tmp.name) / "repo"
        self.repo.mkdir()
        self.no_hooks = Path(self.tmp.name) / "no-hooks"
        self.no_hooks.mkdir()
        _git(self.repo, "init", "-q")
        _git(self.repo, "config", "user.name", "Subject Test")
        _git(self.repo, "config", "user.email", "subject@example.test")
        _git(self.repo, "config", "commit.gpgsign", "false")
        _git(self.repo, "config", "core.hooksPath", str(self.no_hooks))
        empty_ignore = Path(self.tmp.name) / "empty.gitignore"
        empty_ignore.write_text("", encoding="utf-8")
        _git(self.repo, "config", "core.excludesFile", str(empty_ignore))
        self._build_history()
        self.plan = self._write_commit_plan()

    def _commit(self, subject: str, body: str = "") -> None:
        """Stage everything and commit with an explicit subject and body."""
        message = subject if not body else f"{subject}\n\n{body}"
        _git(self.repo, "add", "-A")
        _git(self.repo, "commit", "-q", "-m", message)

    def _build_history(self) -> None:
        """Create one commit per subject rule, then a merge commit."""
        _write(self.repo, "README.md", "root\n")
        self._commit("chore(license): initial commit")

        _write(self.repo, "src/retry.py", "retry\n")
        self._commit("add the retry guard")

        _write(self.repo, ".opencode/scripts/git-hooks/commit-msg", "hook\n")
        self._commit("research(git-hooks): record the hook parity")

        _write(self.repo, ".opencode/skills/sk-git/SKILL.md", "skill\n")
        self._commit("feat(028): add the retry guard")

        _write(self.repo, ".opencode/skills/sk-doc/SKILL.md", "doc skill\n")
        self._commit("feat(sk-code/024): normalize the subjects")

        _write(self.repo, "specs/sk-git/028-x/notes.md", "notes\n")
        self._commit("spec(042.008): record the parity expectations")

        _write(self.repo, "src/retry.py", "retry two\n")
        self._commit("chore(infra): Fix the  repeated spaces")

        _write(self.repo, "src/retry.py", "retry three\n")
        self._commit("chore(infra): phase 2 add the retry guard")

        _write(self.repo, "src/retry.py", "retry four\n")
        self._commit("chore(infra): update")

        _write(self.repo, "src/retry.py", "retry five\n")
        self._commit("chore(infra): phase 2", "Context: the rule empties this one.\n\nRefs: none.")

        _write(self.repo, "src/retry.py", "retry six\n")
        self._commit("feat(config): add the retry guard")

        _write(self.repo, "src/retry.py", "retry seven\n")
        self._commit("feat(config): add the crawlable history guard")

        _write(self.repo, "src/retry.py", "retry eight\n")
        self._commit(LONG_SUBJECT)

        _write(self.repo, "src/retry.py", "retry nine\n")
        self._commit("chore(infra): 138-hybrid-rag-fusion & 139-spec-kit-phase-system save")

        _write(self.repo, "src/retry.py", "retry ten\n")
        self._commit("chore(infra): 042 save")

        _write(self.repo, "src/retry.py", "retry eleven\n")
        self._commit("chore(infra): Wave 1 \u2014 token pressure and latency")

        _write(self.repo, "src/retry.py", "retry twelve\n")
        self._commit("chore(infra): README")

        main_branch = _git(self.repo, "rev-parse", "--abbrev-ref", "HEAD").strip()
        _git(self.repo, "checkout", "-q", "-b", "feature")
        _write(self.repo, "feature.md", "feature\n")
        self._commit("chore(infra): feature branch work")
        _git(self.repo, "checkout", "-q", main_branch)
        _git(self.repo, "merge", "-q", "--no-ff", "feature", "-m", "Merge branch 'feature'")

    def _write_commit_plan(self) -> Path:
        """Write a minimal first pass plan that pins the packet per subject."""
        packets = {
            "feat(config): add the retry guard": PACKET,
            "feat(config): add the crawlable history guard": PACKET,
        }
        rows = []
        for index, line in enumerate(reversed(_git(self.repo, "log", "--format=%H%x1f%s").strip().splitlines()), start=1):
            sha, _sep, subject = line.partition("\x1f")
            rows.append({
                "old": sha,
                "ordinal": f"{index:07d}",
                "spec": packets.get(subject),
                "rule": "none",
                "tie": False,
                "candidates": [],
            })
        path = Path(self.tmp.name) / "commit-plan.jsonl"
        path.write_text("\n".join(json.dumps(row) for row in rows) + "\n", encoding="utf-8")
        return path

    def _run(self, name: str) -> Tuple[List[Dict[str, object]], str]:
        """Run the builder and return the parsed plan rows plus the table text."""
        out_path = Path(self.tmp.name) / f"{name}.jsonl"
        table_path = Path(self.tmp.name) / f"{name}.md"
        argv = [
            "--repo", str(self.repo),
            "--tip", "HEAD",
            "--commit-plan", str(self.plan),
            "--out", str(out_path),
            "--table", str(table_path),
        ]
        with contextlib.redirect_stderr(io.StringIO()):
            exit_code = SUBJECTS.main(argv)
        self.assertEqual(exit_code, 0)
        rows = [json.loads(line) for line in out_path.read_text(encoding="utf-8").splitlines()]
        return rows, table_path.read_text(encoding="utf-8")

    def _by_subject(self, rows: List[Dict[str, object]]) -> Dict[str, Dict[str, object]]:
        """Index plan rows by their old subject."""
        return {str(row["subject_old"]): row for row in rows}

    def test_each_rule_fires_on_its_row(self) -> None:
        rows, _table = self._run("rules")
        by_subject = self._by_subject(rows)
        self.assertEqual(by_subject["chore(license): initial commit"]["rules"], [])
        self.assertEqual(by_subject["research(git-hooks): record the hook parity"]["rules"], ["R2"])
        self.assertEqual(by_subject["feat(028): add the retry guard"]["rules"], ["R3"])
        self.assertEqual(by_subject["chore(infra): Fix the  repeated spaces"]["rules"], ["R4"])
        self.assertEqual(by_subject["feat(config): add the retry guard"]["rules"], ["R5"])
        self.assertEqual(by_subject[LONG_SUBJECT]["rules"], ["R6"])
        self.assertEqual(by_subject["Merge branch 'feature'"]["rules"], ["R1"])

    def test_rewritten_subjects_carry_the_expected_words(self) -> None:
        rows, _table = self._run("words")
        by_subject = self._by_subject(rows)
        self.assertEqual(
            by_subject["add the retry guard"]["subject_new"],
            "feat(src): add the retry guard",
        )
        self.assertEqual(
            by_subject["research(git-hooks): record the hook parity"]["subject_new"],
            "docs(git-hooks): record the hook parity",
        )
        self.assertEqual(
            by_subject["feat(028): add the retry guard"]["subject_new"],
            "feat(sk-git): add the retry guard",
        )
        self.assertEqual(
            by_subject["feat(sk-code/024): normalize the subjects"]["subject_new"],
            "feat(sk-doc): normalize the subjects",
        )
        self.assertEqual(
            by_subject["spec(042.008): record the parity expectations"]["subject_new"],
            "docs(specs): record the parity expectations",
        )
        self.assertEqual(
            by_subject["chore(infra): Fix the  repeated spaces"]["subject_new"],
            "chore(infra): fix the repeated spaces",
        )
        self.assertEqual(
            by_subject["chore(infra): phase 2 add the retry guard"]["subject_new"],
            "chore(infra): add the retry guard",
        )
        self.assertEqual(
            by_subject["chore(infra): 138-hybrid-rag-fusion & 139-spec-kit-phase-system save"]["subject_new"],
            "chore(infra): save",
        )
        self.assertEqual(by_subject["chore(infra): 042 save"]["subject_new"], "chore(infra): save")
        self.assertEqual(
            by_subject["chore(infra): Wave 1 \u2014 token pressure and latency"]["subject_new"],
            "chore(infra): token pressure and latency",
        )
        self.assertEqual(by_subject["chore(infra): README"]["subject_new"], "chore(infra): readme")

    def test_keyword_is_appended_once_and_skipped_when_present(self) -> None:
        rows, _table = self._run("keyword")
        by_subject = self._by_subject(rows)
        appended = by_subject["feat(config): add the retry guard"]["subject_new"]
        self.assertEqual(appended, "feat(config): add the retry guard for crawlable commit history")
        kept = by_subject["feat(config): add the crawlable history guard"]["subject_new"]
        self.assertEqual(kept, "feat(config): add the crawlable history guard")

    def test_length_cap_trims_at_a_word_boundary(self) -> None:
        rows, _table = self._run("length")
        trimmed = self._by_subject(rows)[LONG_SUBJECT]["subject_new"]
        self.assertTrue(str(trimmed).startswith(LONG_PREFIX))
        self.assertLessEqual(len(str(trimmed)), SUBJECTS.TRIM_TARGET)
        self.assertTrue(str(trimmed).split(": ", 1)[1].startswith("normalize the subject plan"))

    def test_exempt_subject_is_untouched(self) -> None:
        rows, _table = self._run("exempt")
        merge = self._by_subject(rows)["Merge branch 'feature'"]
        self.assertEqual(merge["subject_new"], "Merge branch 'feature'")
        self.assertFalse(merge["residual"])

    def test_residual_rows_carry_reason_and_judge_material(self) -> None:
        rows, _table = self._run("residual")
        by_subject = self._by_subject(rows)
        vague = by_subject["chore(infra): update"]
        self.assertTrue(vague["residual"])
        self.assertIsNone(vague["subject_new"])
        self.assertIn("vague", str(vague["reason"]))
        self.assertEqual(vague["rules"], ["R7"])
        emptied = by_subject["chore(infra): phase 2"]
        self.assertTrue(emptied["residual"])
        self.assertIsNone(emptied["subject_new"])
        self.assertIn("empty", str(emptied["reason"]))
        self.assertIn("R4", emptied["rules"])
        self.assertEqual(emptied["paths"], ["src/retry.py"])
        self.assertEqual(
            emptied["body_head"],
            ["Context: the rule empties this one.", "Refs: none."],
        )

    def test_every_rewritten_subject_passes_the_ported_grammar(self) -> None:
        rows, _table = self._run("grammar")
        rewritten = 0
        exempt = 0
        for row in rows:
            if row["residual"]:
                self.assertIsNone(row["subject_new"])
                continue
            if row["rules"] == ["R1"]:
                self.assertEqual(row["subject_new"], row["subject_old"])
                exempt += 1
                continue
            self.assertEqual(SUBJECTS.subject_errors(str(row["subject_new"])), [], row["old"])
            rewritten += 1
        self.assertGreater(rewritten, 10)
        self.assertEqual(exempt, 1)

    def test_repeat_runs_are_byte_identical(self) -> None:
        self._run("run_a")
        self._run("run_b")
        root = Path(self.tmp.name)
        self.assertEqual((root / "run_a.jsonl").read_bytes(), (root / "run_b.jsonl").read_bytes())
        self.assertEqual((root / "run_a.md").read_bytes(), (root / "run_b.md").read_bytes())

    def test_review_table_lists_counts_samples_and_changes(self) -> None:
        _rows, table = self._run("table")
        self.assertIn("## Rule counts", table)
        self.assertIn("| R6 | 1 |", table)
        self.assertIn("## Residual reasons", table)
        self.assertIn("## Rows where the most rules fired", table)
        self.assertIn(f"## Random sample (seed {SUBJECTS.SAMPLE_SEED})", table)
        self.assertIn("## Rows whose new subject differs beyond the first word", table)
        self.assertIn("feat(src): add the retry guard", table)
        self.assertIn("(residual)", table)

    def test_grammar_checker_rejects_each_hook_violation(self) -> None:
        self.assertEqual(SUBJECTS.subject_errors("feat(sk-git): add the retry guard"), [])
        self.assertNotEqual(SUBJECTS.subject_errors("feat(042): add the retry guard"), [])
        self.assertNotEqual(SUBJECTS.subject_errors("feat(sk-git/024): add the retry guard"), [])
        self.assertNotEqual(SUBJECTS.subject_errors("feat(sk-git): Add the retry guard"), [])
        self.assertNotEqual(SUBJECTS.subject_errors("feat(sk-git): add  the retry guard"), [])
        self.assertNotEqual(SUBJECTS.subject_errors("feat(sk-git): add the retry guard."), [])
        self.assertNotEqual(SUBJECTS.subject_errors("feat(sk-git): update"), [])
        self.assertNotEqual(SUBJECTS.subject_errors(f"feat(sk-git): {'x' * 100}"), [])
        self.assertNotEqual(SUBJECTS.subject_errors("feat(Sk-Git): add the retry guard"), [])

    def test_scope_derivation_follows_the_skill_order(self) -> None:
        both = [".opencode/scripts/git-hooks/commit-msg", ".opencode/skills/sk-doc/SKILL.md"]
        self.assertEqual(SUBJECTS.derive_scope(both), "sk-doc")
        self.assertEqual(SUBJECTS.derive_scope(["AGENTS.md"]), "agents")
        self.assertEqual(SUBJECTS.derive_scope(["opencode.json"]), "config")
        self.assertEqual(SUBJECTS.derive_scope(["README.md"]), "readme")
        self.assertEqual(SUBJECTS.derive_scope(["specs/a/b/c.md"]), "specs")
        self.assertEqual(SUBJECTS.derive_scope(["docs/guide.md"]), "docs")
        self.assertEqual(SUBJECTS.derive_scope(["src/a.py", "src/b.py"]), "src")
        self.assertIsNone(SUBJECTS.derive_scope([]))

    def test_type_derivation_prefers_files_then_verb(self) -> None:
        self.assertEqual(SUBJECTS.derive_type(["docs/guide.md"], "change something"), "docs")
        self.assertEqual(SUBJECTS.derive_type(["tests/x_test.py"], "change something"), "test")
        self.assertEqual(SUBJECTS.derive_type([], "restore the runner"), "fix")
        self.assertEqual(SUBJECTS.derive_type(["src/a.py"], "rename the module"), "refactor")
        self.assertEqual(SUBJECTS.derive_type(["src/a.py"], "tidy the module"), "chore")


if __name__ == "__main__":
    unittest.main()
