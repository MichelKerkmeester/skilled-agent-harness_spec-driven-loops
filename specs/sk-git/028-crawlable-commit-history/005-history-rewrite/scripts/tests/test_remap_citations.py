#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: commit citation remapper tests
# ───────────────────────────────────────────────────────────────
"""
Tests for the commit citation remapper.

Builds a synthetic commit map and a temp tree of markdown files with
synthetic citations and decoys, then checks dry-run safety, exact
rewrites, byte preservation, residue, and collision refusal.

Usage: python3 -m unittest test_remap_citations.py
"""
import contextlib
import importlib.util
import io
import json
import tempfile
import unittest
from pathlib import Path
from typing import Dict, List, Tuple

SCRIPT_PATH = Path(__file__).resolve().parents[1] / "remap-citations.py"


def _load_remapper():
    """Load remap-citations.py as a module despite its hyphenated name."""
    spec = importlib.util.spec_from_file_location("remap_citations", SCRIPT_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


REMAP = _load_remapper()

OLD_HASHES = (
    "1111111111111111111111111111111111111111",
    "2222222222222222222222222222222222222222",
    "3333333333333333333333333333333333333333",
    "4444444444444444444444444444444444444444",
    "5555555555555555555555555555555555555555",
)
NEW_HASHES = (
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "cccccccccccccccccccccccccccccccccccccccc",
    "dddddddddddddddddddddddddddddddddddddddd",
    "0000000000000000000000000000000000000000",
)

CITATIONS_BEFORE = (
    f"First line cites {OLD_HASHES[0][:10]} for the fix.\n"
    f"Second line cites {OLD_HASHES[1][:12]} for the change.\n"
    f"Third line cites {OLD_HASHES[2]} in full.\n"
    "Timestamp 1767225600000 must stay.\n"
    "Unknown hash 0123456789 must stay.\n"
    f"Embedded pre{OLD_HASHES[0][:10]}post must stay.\n"
    f"Removed commit {OLD_HASHES[4][:12]} must stay.\n"
)
CITATIONS_AFTER = (
    f"First line cites {NEW_HASHES[0][:10]} for the fix.\n"
    f"Second line cites {NEW_HASHES[1][:12]} for the change.\n"
    f"Third line cites {NEW_HASHES[2]} in full.\n"
    "Timestamp 1767225600000 must stay.\n"
    "Unknown hash 0123456789 must stay.\n"
    f"Embedded pre{OLD_HASHES[0][:10]}post must stay.\n"
    f"Removed commit {OLD_HASHES[4][:12]} must stay.\n"
)
CRLF_BEFORE = (
    "Title\r\n"
    "\r\n"
    f"Fixes {OLD_HASHES[3][:10]} and {OLD_HASHES[1][:12]}.\r\n"
)
CRLF_AFTER = (
    "Title\r\n"
    "\r\n"
    f"Fixes {NEW_HASHES[3][:10]} and {NEW_HASHES[1][:12]}.\r\n"
)
SKIP_JSON = f'{{"note": "commit {OLD_HASHES[0][:10]} is cited here"}}\n'


def _write_map(path: Path, pairs: List[Tuple[str, str]]) -> None:
    """Write a filter-repo style commit map with the old new header."""
    lines = ["old new"] + [f"{old} {new}" for old, new in pairs]
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


class RemapCitationsTest(unittest.TestCase):
    """End-to-end tests over a temp directory of synthetic citations."""

    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.map_path = self.root / "commit-map.txt"
        _write_map(self.map_path, list(zip(OLD_HASHES, NEW_HASHES)))
        self.citations = self.root / "citations.md"
        self.citations.write_text(CITATIONS_BEFORE, encoding="utf-8")
        self.crlf = self.root / "crlf.md"
        self.crlf.write_bytes(CRLF_BEFORE.encode("utf-8"))
        self.skipped = self.root / "skip.json"
        self.skipped.write_text(SKIP_JSON, encoding="utf-8")

    def _run(self, *extra: str) -> Dict[str, object]:
        argv = ["--commit-map", str(self.map_path), "--root", str(self.root), "--ext", ".md", *extra]
        buffer = io.StringIO()
        with contextlib.redirect_stdout(buffer):
            exit_code = REMAP.main(argv)
        self.assertEqual(exit_code, 0)
        return json.loads(buffer.getvalue())

    def test_dry_run_changes_nothing(self) -> None:
        before = {path: path.read_bytes() for path in (self.citations, self.crlf, self.skipped)}
        report = self._run()
        for path, original in before.items():
            self.assertEqual(path.read_bytes(), original, path.name)
        self.assertEqual(report["files_scanned"], 2)
        self.assertEqual(report["files_changed"], 2)
        self.assertIsNone(report["residue_after_apply"])

    def test_apply_rewrites_exactly_expected_tokens(self) -> None:
        report = self._run("--apply")
        self.assertEqual(self.citations.read_text(encoding="utf-8"), CITATIONS_AFTER)
        self.assertEqual(self.crlf.read_bytes(), CRLF_AFTER.encode("utf-8"))
        self.assertEqual(self.skipped.read_text(encoding="utf-8"), SKIP_JSON)
        self.assertEqual(report["files_scanned"], 2)
        self.assertEqual(report["files_changed"], 2)
        self.assertEqual(report["replacements_by_length"], {"10": 2, "12": 2, "40": 1})
        self.assertEqual(report["distinct_tokens_replaced"], 4)
        self.assertEqual(report["distinct_tokens_skipped"], 3)
        self.assertEqual(report["residue_after_apply"], 0)

    def test_decoys_and_line_endings_stay_byte_identical(self) -> None:
        self._run("--apply")
        applied = self.citations.read_bytes()
        self.assertIn(b"1767225600000", applied)
        self.assertIn(b"0123456789", applied)
        self.assertIn(f"pre{OLD_HASHES[0][:10]}post".encode("ascii"), applied)
        self.assertIn(f"Removed commit {OLD_HASHES[4][:12]} must stay".encode("ascii"), applied)
        crlf = self.crlf.read_bytes()
        self.assertEqual(crlf.count(b"\n"), crlf.count(b"\r\n"))

    def test_colliding_prefix_is_refused(self) -> None:
        colliding = self.root / "colliding.txt"
        _write_map(
            colliding,
            [
                ("abcdef0123" + "a" * 30, "a" * 40),
                ("abcdef0123" + "b" * 30, "b" * 40),
            ],
        )
        argv = ["--commit-map", str(colliding), "--root", str(self.root), "--ext", ".md"]
        stderr = io.StringIO()
        with contextlib.redirect_stderr(stderr), contextlib.redirect_stdout(io.StringIO()):
            with self.assertRaises(SystemExit) as caught:
                REMAP.main(argv)
        self.assertNotEqual(caught.exception.code, 0)
        self.assertIn("abcdef0123", stderr.getvalue())
        self.assertEqual(self.citations.read_text(encoding="utf-8"), CITATIONS_BEFORE)
        self.assertEqual(self.skipped.read_text(encoding="utf-8"), SKIP_JSON)


if __name__ == "__main__":
    unittest.main()
