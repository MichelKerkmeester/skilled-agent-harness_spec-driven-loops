#!/usr/bin/env python3
# ---------------------------------------------------------------------------
# COMPONENT: Authored Artifact Name Guard Tests
# ---------------------------------------------------------------------------
"""Focused CLI tests for authored artifact kebab-case validation."""

import subprocess
import unittest
from pathlib import Path


CHECKER = (
    Path(__file__).resolve().parents[2]
    / "shared"
    / "scripts"
    / "check_authored_name_kebab.py"
)
REPO_ROOT = Path(__file__).resolve().parents[5]


class AuthoredNameKebabTests(unittest.TestCase):
    """Exercise valid, invalid, and canon-exempt authored names."""

    def run_checker(self, artifact: str) -> subprocess.CompletedProcess[str]:
        """Run the checker from the repository root."""
        return subprocess.run(
            ["python3", str(CHECKER), artifact],
            cwd=REPO_ROOT,
            check=False,
            capture_output=True,
            text=True,
        )

    def test_kebab_name_passes(self) -> None:
        """A lowercase hyphenated authored filename passes."""
        result = self.run_checker("generated-artifact.md")
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("is kebab-case", result.stdout)

    def test_underscore_name_fails(self) -> None:
        """An underscore-bearing authored filename fails."""
        result = self.run_checker("generated_artifact.md")
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("must match", result.stdout)

    def test_canon_exempt_names_pass(self) -> None:
        """Python, tool-mandated, and frozen-history names remain exempt."""
        for artifact in (
            "helper_name.py",
            "README.md",
            "changelog/old_release_name.md",
        ):
            with self.subTest(artifact=artifact):
                result = self.run_checker(artifact)
                self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
                self.assertIn("is exempt", result.stdout)


if __name__ == "__main__":
    unittest.main(verbosity=2)
