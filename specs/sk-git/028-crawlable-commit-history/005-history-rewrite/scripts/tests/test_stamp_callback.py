#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: commit message stamper tests
# ───────────────────────────────────────────────────────────────
"""
Tests for the commit message stamper, citation remapper and runner.

The unit tests pin the trailer shape: a plain body, a body that ends
in a Co-Authored-By block, a Refs: line that the plan supersedes and
one that must survive, a message with no packet, and a second stamp
that changes nothing.  The remap tests pin 10-hex, 40-hex and decoy
tokens.  One integration test builds a throwaway five-commit repo with
a tag, writes a plan, rehearses the rewrite and checks the invariants
and the stamped ordinals on the rewritten mirror.

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
ROW = {"old": "a" * 40, "ordinal": "0000001", "spec": PACKET, "rule": "refs", "tie": False}
ROW_NO_PACKET = {"old": "a" * 40, "ordinal": "0000002", "spec": None, "rule": "none", "tie": False}

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

    def test_body_ending_in_coauthor_block_joins_that_paragraph(self) -> None:
        message = b"Subject\n\nBody\n\nCo-Authored-By: A <a@b.c>\nClaude-Session: xyz\n"
        expected = (
            b"Subject\n\nBody\n\nSpec: sk-git/028-x\nCommit-Id: 0000001\n"
            b"Co-Authored-By: A <a@b.c>\nClaude-Session: xyz\n"
        )
        self.assertEqual(STAMP.stamp_message(message, ROW), expected)

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
        ):
            once = STAMP.stamp_message(message, ROW)
            self.assertEqual(STAMP.stamp_message(once, ROW), once, message)

    def test_load_plan_indexes_by_bytes(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            plan_path = Path(tmp) / "plan.jsonl"
            plan_path.write_text(json.dumps(ROW) + "\n", encoding="utf-8")
            plan = STAMP.load_plan(str(plan_path))
        self.assertIn(b"a" * 40, plan)
        self.assertEqual(plan[b"a" * 40]["ordinal"], "0000001")


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
        """Create a five-commit repo with a tag and hooks disabled."""
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
                }
                handle.write(json.dumps(row) + "\n")
        return shas

    def test_rehearsal_stamps_five_commits_and_keeps_the_tag(self) -> None:
        root = Path(tempfile.mkdtemp(prefix="stamp-callback-", dir="/tmp"))
        self.addCleanup(shutil.rmtree, root, ignore_errors=True)
        seed = self._build_seed(root)
        branch = _git(seed, "rev-parse", "--abbrev-ref", "HEAD").strip()
        plan_path = root / "plan.jsonl"
        self._write_plan(seed, plan_path)
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
        ):
            self.assertIn("INVARIANT PASS: " + label, log_text)

        mirror = work / "mirror.git"
        bodies = _git(mirror, "log", "--format=%B", "refs/heads/" + branch)
        for index in range(1, 6):
            self.assertIn("%07d" % index, bodies)
        self.assertEqual(bodies.count("Commit-Id:"), 5)
        self.assertEqual(bodies.count("Spec: " + PACKET), 1)

        tags = _git(mirror, "tag").split()
        self.assertIn("v1.0", tags)
        self.assertEqual(len(tags), 1)


if __name__ == "__main__":
    unittest.main()
