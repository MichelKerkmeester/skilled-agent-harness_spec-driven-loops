#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: STACK FOLDER VERIFIER TESTS
# ───────────────────────────────────────────────────────────────

"""Unit-style coverage for verify_stack_folders.py behavior."""

from __future__ import annotations

import importlib.util
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


SCRIPT_PATH = Path(__file__).resolve().parent / "verify_stack_folders.py"


def load_module():
    """Load the verifier module to share its language folder sets."""
    spec = importlib.util.spec_from_file_location("verify_stack_folders", SCRIPT_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError("Unable to load verifier module spec.")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


class VerifyStackFoldersTests(unittest.TestCase):
    """Exercise the validator against clean and orphan folder trees."""

    @classmethod
    def setUpClass(cls) -> None:
        cls.module = load_module()

    def run_validator(self, extra_names: tuple[str, ...] = ()) -> subprocess.CompletedProcess[str]:
        """Run a copied validator against a temporary reference tree."""
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            scripts_dir = root / "assets" / "scripts"
            scripts_dir.mkdir(parents=True)
            validator_copy = scripts_dir / "verify_stack_folders.py"
            shutil.copy2(SCRIPT_PATH, validator_copy)

            references_root = root / "references"
            references_root.mkdir()
            folder_names = (
                self.module.KNOWN_LANGUAGES
                | self.module.EXEMPT_NON_LANGUAGE_DIRS
                | set(extra_names)
            )
            for name in sorted(folder_names):
                (references_root / name).mkdir()

            return subprocess.run(
                [sys.executable, "-I", str(validator_copy)],
                capture_output=True,
                text=True,
                check=False,
            )

    def test_known_language_tree_passes(self) -> None:
        """A complete known-language tree should pass."""
        result = self.run_validator()
        self.assertEqual(result.returncode, 0)
        self.assertIn("OK: 6 language folder(s)", result.stdout)

    def test_orphan_folder_fails(self) -> None:
        """An unrecognized references folder should fail with its name."""
        result = self.run_validator(("not-a-language",))
        self.assertEqual(result.returncode, 1)
        self.assertIn("orphan references folder not a known language", result.stdout)
        self.assertIn("not-a-language", result.stdout)
        self.assertIn("1 stack-folder problem(s) found.", result.stdout)


if __name__ == "__main__":
    unittest.main()
