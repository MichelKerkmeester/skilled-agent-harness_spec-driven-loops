#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: commit message stamper tests
# ───────────────────────────────────────────────────────────────
"""
Tests for the commit message stamper, citation remapper and runner.

The unit tests pin the trailer shape: a plain body, a body carrying
attribution lines, a planned subject and a residual one, a Refs: line
that the plan supersedes and one that must survive, a message with no
packet, one packet and two packets, and a second stamp that changes
nothing.  The grammar tests pin the subject checks the runner's
invariant ports.  The remap tests pin 10-hex, 40-hex and decoy tokens.
One integration test builds a throwaway five-commit repo with a tag,
writes both plans, rehearses the rewrite and checks the invariants and
the stamped subjects, Spec lines and ordinals on the rewritten mirror.

Usage: python3 -m unittest test_stamp_callback.py
"""
import importlib.util
import json
import os
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path
from typing import Dict, List

SCRIPT_DIR = Path(__file__).resolve().parents[1]
STAMP_PATH = SCRIPT_DIR / "stamp-callback.py"
RUNNER_PATH = SCRIPT_DIR / "rewrite-run.sh"


def _load_stamp_module():
    """Load stamp-callback.py as a module despite its hyphenated name."""
    spec = importlib.util.spec_from_file_location("stamp_callback", STAMP_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


STAMP = _load_stamp_module()

PACKET = "sk-git/028-x"
OTHER_PACKET = "hooks/016-y"
ROW = {"old": "a" * 40, "ordinal": "0000001", "spec": PACKET, "rule": "refs", "tie": False}
ROW_NO_PACKET = {"old": "a" * 40, "ordinal": "0000002", "spec": None, "rule": "none", "tie": False}
ROW_TWO_PACKETS = {
    "old": "b" * 40,
    "ordinal": "0000003",
    "spec": PACKET,
    "candidates": [PACKET, OTHER_PACKET],
    "rule": "refs",
    "tie": False,
}

OLD_FULL = "35e05b0e4bf6e0050bd65da49bc635d13498a43c"
NEW_FULL = "a99e9eb2aca84aff93b110948e7d29e886904d7f"


def _git(repo: Path, *args: str) -> str:
    """Run git in the given repository and return its stdout."""
    completed = subprocess.run(["git", "-C", str(repo), *args], capture_output=True, check=True)
    return completed.stdout.decode("utf-8", errors="replace")


class StampMessageTest(unittest.TestCase):
    """Unit tests over the message shape the commit callback produces."""

    def test_plain_body_opens_a_new_trailer_paragraph(self) -> None:
        message = b"Subject line\n\nBody text here.\n"
        expected = b"Subject line\n\nBody text here.\n\nSpec: sk-git/028-x\nCommit-Id: 0000001\n"
        self.assertEqual(STAMP.stamp_message(message, ROW), expected)

    def test_attribution_block_at_the_end_is_dropped(self) -> None:
        message = b"Subject\n\nBody\n\nCo-Authored-By: A <a@b.c>\nClaude-Session: xyz\n"
        expected = b"Subject\n\nBody\n\nSpec: sk-git/028-x\nCommit-Id: 0000001\n"
        self.assertEqual(STAMP.stamp_message(message, ROW), expected)

    def test_attribution_lines_mid_message_are_dropped_without_a_hole(self) -> None:
        message = (
            b"Subject\n\nBody text.\n\nCo-Authored-By: A <a@b.c>\n\n"
            b"More prose.\n\nClaude-Session: xyz\n"
        )
        expected = b"Subject\n\nBody text.\n\nMore prose.\n\nSpec: sk-git/028-x\nCommit-Id: 0000001\n"
        self.assertEqual(STAMP.stamp_message(message, ROW), expected)

    def test_anthropic_trailer_is_dropped_and_prose_is_kept(self) -> None:
        message = (
            b"Subject\n\nBody names the Anthropic client.\n\n"
            b"Generated-By: Anthropic Claude\n"
        )
        expected = (
            b"Subject\n\nBody names the Anthropic client.\n\n"
            b"Spec: sk-git/028-x\nCommit-Id: 0000001\n"
        )
        self.assertEqual(STAMP.stamp_message(message, ROW), expected)

    def test_planned_subject_replaces_the_first_line(self) -> None:
        stamped = STAMP.stamp_message(b"Legacy subject\n\nBody\n", ROW, "feat(sk-git): carry the plan")
        expected = b"feat(sk-git): carry the plan\n\nBody\n\nSpec: sk-git/028-x\nCommit-Id: 0000001\n"
        self.assertEqual(stamped, expected)

    def test_null_planned_subject_keeps_the_first_line(self) -> None:
        message = b"Legacy subject\n\nBody\n"
        self.assertEqual(STAMP.replace_subject(message, None), message)
        self.assertEqual(STAMP.stamp_message(message, ROW, None), STAMP.stamp_message(message, ROW))

    def test_two_packets_emit_two_spec_lines_dominant_first(self) -> None:
        stamped = STAMP.stamp_message(b"Subject\n\nBody\n", ROW_TWO_PACKETS)
        expected = b"Subject\n\nBody\n\nSpec: sk-git/028-x\nSpec: hooks/016-y\nCommit-Id: 0000003\n"
        self.assertEqual(stamped, expected)

    def test_a_candidate_repeating_the_dominant_packet_adds_no_line(self) -> None:
        row = dict(ROW_TWO_PACKETS, candidates=[PACKET, PACKET, OTHER_PACKET])
        stamped = STAMP.stamp_message(b"Subject\n\nBody\n", row)
        self.assertEqual(stamped.count(b"Spec: "), 2)
        self.assertEqual(stamped.count(b"Spec: sk-git/028-x\n"), 1)

    def test_refs_line_naming_a_touched_packet_is_dropped(self) -> None:
        message = b"Subject\n\nBody\n\nRefs: specs/hooks/016-y\n"
        stamped = STAMP.stamp_message(message, ROW_TWO_PACKETS)
        self.assertNotIn(b"Refs:", stamped)
        self.assertEqual(stamped.count(b"Spec: "), 2)

    def test_refs_line_to_the_same_packet_is_dropped(self) -> None:
        message = b"Subject\n\nBody\n\nRefs: specs/sk-git/028-x\n"
        expected = b"Subject\n\nBody\n\nSpec: sk-git/028-x\nCommit-Id: 0000001\n"
        self.assertEqual(STAMP.stamp_message(message, ROW), expected)

    def test_refs_line_with_opencode_root_is_dropped(self) -> None:
        message = b"Subject\n\nRefs: .opencode/specs/sk-git/028-x\n"
        expected = b"Subject\n\nSpec: sk-git/028-x\nCommit-Id: 0000001\n"
        self.assertEqual(STAMP.stamp_message(message, ROW), expected)

    def test_refs_line_to_another_packet_stays(self) -> None:
        message = b"Subject\n\nBody\n\nRefs: specs/hooks/016-x\n"
        expected = (
            b"Subject\n\nBody\n\nSpec: sk-git/028-x\nCommit-Id: 0000001\n"
            b"Refs: specs/hooks/016-x\n"
        )
        self.assertEqual(STAMP.stamp_message(message, ROW), expected)

    def test_legacy_subject_shaped_final_line_stays_prose(self) -> None:
        message = b"feat(x): subject\n\nchore: align skill docs and spec artifacts\n"
        stamped = STAMP.stamp_message(message, ROW)
        self.assertTrue(stamped.endswith(b"\n\nSpec: " + str(ROW["spec"]).encode() + b"\nCommit-Id: " + str(ROW["ordinal"]).encode() + b"\n"), stamped)
        self.assertIn(b"chore: align skill docs and spec artifacts\n\nSpec:", stamped)

    def test_message_with_no_packet_gets_only_a_commit_id(self) -> None:
        message = b"Subject\n\nBody\n"
        expected = b"Subject\n\nBody\n\nCommit-Id: 0000002\n"
        self.assertEqual(STAMP.stamp_message(message, ROW_NO_PACKET), expected)

    def test_a_second_stamp_changes_nothing(self) -> None:
        for message in (
            b"Subject\n\nBody\n",
            b"Subject\n\nBody\n\nCo-Authored-By: A <a@b.c>\nClaude-Session: xyz\n",
            b"Subject\n\nBody\n\nRefs: specs/sk-git/028-x\n",
            b"Subject\n\nBody text.\n\nCo-Authored-By: A <a@b.c>\n\nMore prose.\n\nGenerated-By: Anthropic Claude\n",
        ):
            once = STAMP.stamp_message(message, ROW)
            self.assertEqual(STAMP.stamp_message(once, ROW), once, message)
        once = STAMP.stamp_message(b"Subject\n\nBody\n", ROW_TWO_PACKETS, "feat(sk-git): carry the plan")
        self.assertEqual(
            STAMP.stamp_message(once, ROW_TWO_PACKETS, "feat(sk-git): carry the plan"), once
        )

    def test_load_plan_indexes_by_bytes(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            plan_path = Path(tmp) / "plan.jsonl"
            plan_path.write_text(json.dumps(ROW) + "\n", encoding="utf-8")
            plan = STAMP.load_plan(str(plan_path))
        self.assertIn(b"a" * 40, plan)
        self.assertEqual(plan[b"a" * 40]["ordinal"], "0000001")


class SubjectGrammarTest(unittest.TestCase):
    """Unit tests over the commit-msg grammar the runner's invariant ports."""

    def test_a_planned_subject_passes(self) -> None:
        self.assertEqual(STAMP.subject_errors(b"feat(sk-git): carry the plan"), [])

    def test_a_legacy_subject_fails_the_grammar(self) -> None:
        self.assertTrue(STAMP.subject_errors(b"commit number 1"))

    def test_a_numeric_scope_fails(self) -> None:
        self.assertIn("scope is numeric-only", STAMP.subject_errors(b"feat(028): add the guard"))

    def test_a_capitalised_summary_fails(self) -> None:
        errors = STAMP.subject_errors(b"feat(git): Add the guard")
        self.assertIn("summary does not start lowercase", errors)

    def test_a_vague_summary_fails(self) -> None:
        self.assertIn("summary is too vague", STAMP.subject_errors(b"chore(git): update"))

    def test_a_subject_past_the_cap_fails(self) -> None:
        subject = b"chore(git): " + b"a" * 95
        self.assertIn("subject exceeds the length cap", STAMP.subject_errors(subject))

    def test_git_generated_subjects_are_exempt(self) -> None:
        for subject in (b"Merge branch 'main'", b'Revert "feat(x): y"', b"fixup! chore(x): y"):
            self.assertTrue(STAMP.is_exempt_subject(subject))
        self.assertFalse(STAMP.is_exempt_subject(b"feat(x): y"))


class RemapMessageTest(unittest.TestCase):
    """Unit tests over the second-pass citation remap."""

    def setUp(self) -> None:
        self.prefix_map: Dict[str, str] = {
            OLD_FULL[:10]: NEW_FULL,
            OLD_FULL: NEW_FULL,
        }

    def test_ten_hex_and_forty_hex_tokens_are_remapped(self) -> None:
        message = ("See %s and %s.\n" % (OLD_FULL[:10], OLD_FULL)).encode("ascii")
        expected = ("See %s and %s.\n" % (NEW_FULL[:10], NEW_FULL)).encode("ascii")
        self.assertEqual(STAMP.remap_message(message, self.prefix_map), expected)

    def test_decoys_stay_byte_identical(self) -> None:
        message = (
            "Short %s, unknown %s, timestamp 1767225600000, embedded pre%spost.\n"
            % (OLD_FULL[:9], "0123456789", OLD_FULL[:10])
        ).encode("ascii")
        self.assertEqual(STAMP.remap_message(message, self.prefix_map), message)

    def test_message_without_a_hash_is_returned_unchanged(self) -> None:
        message = b"No hash here, only 12345 and words.\n"
        self.assertIs(STAMP.remap_message(message, self.prefix_map), message)


class RehearsalIntegrationTest(unittest.TestCase):
    """Builds a throwaway repo and rehearses the full rewrite."""

    def _build_seed(self, root: Path) -> Path:
        """Create a five-commit repo with attribution, a tag and hooks disabled."""
        seed = root / "seed"
        seed.mkdir()
        no_hooks = root / "no-hooks"
        no_hooks.mkdir()
        _git(seed, "init", "-q")
        _git(seed, "config", "user.name", "Stamp Test")
        _git(seed, "config", "user.email", "stamp@example.test")
        _git(seed, "config", "commit.gpgsign", "false")
        _git(seed, "config", "core.hooksPath", str(no_hooks))
        for index in range(1, 6):
            with (seed / "file.txt").open("a", encoding="utf-8") as handle:
                handle.write("line %d\n" % index)
            _git(seed, "add", "-A")
            if index == 2:
                _git(
                    seed,
                    "commit",
                    "-q",
                    "-m",
                    "commit number 2",
                    "-m",
                    "Attribution is stripped from this body.\n\n"
                    "Co-Authored-By: A <a@b.c>\nGenerated-By: Anthropic Claude",
                )
            elif index == 5:
                _git(seed, "commit", "-q", "-m", "chore(sk-git): seed commit five")
            else:
                _git(seed, "commit", "-q", "-m", "commit number %d" % index)
        _git(seed, "tag", "-a", "v1.0", "-m", "release one")
        return seed

    def _write_plan(self, seed: Path, plan_path: Path) -> List[str]:
        """Write one plan row per commit in topological order."""
        shas = _git(seed, "rev-list", "--reverse", "--topo-order", "HEAD").split()
        with plan_path.open("w", encoding="utf-8") as handle:
            for index, sha in enumerate(shas, start=1):
                row = {
                    "old": sha,
                    "ordinal": "%07d" % index,
                    "spec": PACKET if index == 2 else None,
                    "rule": "refs",
                    "tie": False,
                    "candidates": [PACKET, OTHER_PACKET] if index == 2 else [],
                }
                handle.write(json.dumps(row) + "\n")
        return shas

    def _write_subject_plan(self, shas: List[str], plan_path: Path) -> None:
        """Replace the first four subjects and leave the fifth as a residual."""
        with plan_path.open("w", encoding="utf-8") as handle:
            for index, sha in enumerate(shas, start=1):
                old_subject = (
                    "chore(sk-git): seed commit five"
                    if index == 5
                    else "commit number %d" % index
                )
                new_subject = (
                    "chore(sk-git): rewrite commit number %d" % index
                    if index <= 4
                    else None
                )
                row = {
                    "old": sha,
                    "subject_old": old_subject,
                    "subject_new": new_subject,
                    "rules": ["R2", "R3", "R4"] if new_subject else ["R7"],
                    "residual": new_subject is None,
                    "reason": None if new_subject else "R7: the summary is too vague",
                }
                handle.write(json.dumps(row) + "\n")

    def test_rehearsal_stamps_five_commits_and_keeps_the_tag(self) -> None:
        root = Path(tempfile.mkdtemp(prefix="stamp-callback-", dir="/tmp"))
        self.addCleanup(shutil.rmtree, root, ignore_errors=True)
        seed = self._build_seed(root)
        branch = _git(seed, "rev-parse", "--abbrev-ref", "HEAD").strip()
        plan_path = root / "plan.jsonl"
        shas = self._write_plan(seed, plan_path)
        subject_plan_path = root / "subject-plan.jsonl"
        self._write_subject_plan(shas, subject_plan_path)
        work = root / "work"

        env = dict(os.environ)
        env["SPECKIT_SKIP_COMMIT_MSG_VALIDATE"] = "1"
        env["SPECKIT_SKIP_PREPARE_COMMIT_MSG"] = "1"
        completed = subprocess.run(
            [
                "bash",
                str(RUNNER_PATH),
                "--source",
                str(seed),
                "--plan",
                str(plan_path),
                "--subject-plan",
                str(subject_plan_path),
                "--work",
                str(work),
                "--refs",
                branch,
                "--tags",
                "--rehearse",
            ],
            capture_output=True,
            env=env,
        )
        self.assertEqual(completed.returncode, 0, completed.stderr.decode("utf-8", "replace"))

        log_text = (work / "rewrite.log").read_text(encoding="utf-8")
        self.assertNotIn("FAIL", log_text)
        self.assertIn("INVARIANTS: PASS", log_text)
        for label in (
            "commit count per ref equals backup",
            "mapped commits keep tree, author name, email and dates",
            "exactly one Commit-Id per message equal to the plan ordinal",
            "tag count equals backup",
            "commit-map rows equal the commit count",
            "no old 10-hex prefix remains in messages",
            "no forbidden attribution line remains",
            "every non-exempt subject passes the commit-msg grammar",
            "Spec line count equals the plan's packet count",
        ):
            self.assertIn("INVARIANT PASS: " + label, log_text)

        mirror = work / "mirror.git"
        bodies = _git(mirror, "log", "--format=%B", "refs/heads/" + branch)
        backup_bodies = _git(work / "backup.git", "log", "--format=%B", "refs/heads/" + branch)

        subject_lines = _git(mirror, "log", "--format=%s", "refs/heads/" + branch).splitlines()
        for index in range(1, 5):
            self.assertIn("chore(sk-git): rewrite commit number %d" % index, subject_lines)
        self.assertIn("chore(sk-git): seed commit five", subject_lines)
        self.assertNotIn("commit number 1", subject_lines)

        for index in range(1, 6):
            self.assertIn("%07d" % index, bodies)
        self.assertEqual(bodies.count("Commit-Id:"), 5)
        self.assertEqual(bodies.count("Spec: " + PACKET), 1)
        self.assertIn("Spec: " + PACKET + "\nSpec: " + OTHER_PACKET, bodies)

        self.assertNotIn("Co-Authored-By", bodies)
        self.assertNotIn("Anthropic", bodies)
        self.assertIn("Co-Authored-By", backup_bodies)
        self.assertIn("Anthropic", backup_bodies)

        tags = _git(mirror, "tag").split()
        self.assertIn("v1.0", tags)
        self.assertEqual(len(tags), 1)


if __name__ == "__main__":
    unittest.main()
