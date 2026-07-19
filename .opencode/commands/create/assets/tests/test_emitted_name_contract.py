#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# TEST: CREATE COMMAND EMITTED NAME CONTRACT
# ───────────────────────────────────────────────────────────────

"""Verify create-command assets emit kebab-case filesystem names.

Usage: python3 -m unittest discover .opencode/commands/create/assets/tests
"""

import json
import re
import tempfile
import unittest
from pathlib import Path

import yaml


ASSET_ROOT = Path(__file__).resolve().parents[1]
FIXTURE_PATH = ASSET_ROOT / "tests" / "fixtures" / "emitted-name-contract.json"
KEBAB_SEGMENT = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


class EmittedNameContractTest(unittest.TestCase):
    """Protect emitted names without renaming current command source assets."""

    @classmethod
    def setUpClass(cls) -> None:
        """Load the shared contract fixture once for all assertions."""
        cls.contract = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))

    def test_source_asset_filenames_remain_stable(self) -> None:
        """Keep current underscore source assets stable until their rename phase."""
        actual = sorted(path.name for path in ASSET_ROOT.iterdir() if path.is_file())
        self.assertEqual(actual, self.contract["sourceAssetFilenames"])

    def test_root_yaml_assets_parse(self) -> None:
        """Require every root workflow asset to remain valid YAML."""
        yaml_paths = sorted(ASSET_ROOT.glob("*.yaml"))
        self.assertEqual(len(yaml_paths), 22)
        for path in yaml_paths:
            with self.subTest(path=path.name):
                yaml.safe_load(path.read_text(encoding="utf-8"))

    def test_emitter_contract_tokens(self) -> None:
        """Check canonical emitted names and reject known legacy output rules."""
        for filename, tokens in self.contract["requiredTokens"].items():
            content = (ASSET_ROOT / filename).read_text(encoding="utf-8")
            for token in tokens:
                with self.subTest(filename=filename, required=token):
                    self.assertIn(token, content)

        for filename, tokens in self.contract["forbiddenTokens"].items():
            content = (ASSET_ROOT / filename).read_text(encoding="utf-8")
            for token in tokens:
                with self.subTest(filename=filename, forbidden=token):
                    self.assertNotIn(token, content)

    def test_representative_generated_tree_is_kebab_case(self) -> None:
        """Materialize representative outputs and reject non-exempt name drift."""
        with tempfile.TemporaryDirectory() as temporary_root:
            root = Path(temporary_root)
            for route in ("auto", "confirm"):
                for relative_path in self.contract["emittedPaths"]:
                    target = root / route / relative_path
                    target.parent.mkdir(parents=True, exist_ok=True)
                    target.touch()

            emitted_files = [path for path in root.rglob("*") if path.is_file()]
            self.assertGreater(len(emitted_files), 0)
            exempt_segments = set(self.contract["exemptSegments"])

            for path in root.rglob("*"):
                relative = path.relative_to(root)
                for segment in relative.parts:
                    if segment in exempt_segments:
                        continue
                    self.assertNotIn("_", segment, msg=f"underscore path segment: {relative}")
                    stem = Path(segment).stem if Path(segment).suffix else segment
                    self.assertRegex(stem, KEBAB_SEGMENT, msg=f"non-kebab path segment: {relative}")

            route_count = len(self.contract["emittedPaths"])
            print(
                f"AUTO_FILES={route_count} CONFIRM_FILES={route_count} "
                "ZERO_NON_EXEMPT_UNDERSCORES=1"
            )


if __name__ == "__main__":
    unittest.main()
