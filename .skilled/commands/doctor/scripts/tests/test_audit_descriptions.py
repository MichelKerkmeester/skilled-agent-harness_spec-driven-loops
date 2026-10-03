#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: AUDIT DESCRIPTIONS TESTS
# ───────────────────────────────────────────────────────────────
"""
Unit tests for audit_descriptions.py, run against fixture repositories built in
temporary directories.

Usage:
    python3 -m unittest discover -s .skilled/commands/doctor/scripts/tests -p 'test_*.py'
"""

from __future__ import annotations

import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from typing import Dict, List, Optional

SCRIPTS_DIR = Path(__file__).resolve().parent.parent
SCRIPT = SCRIPTS_DIR / "audit_descriptions.py"
CONTRACT = SCRIPTS_DIR.parent.parent.parent / "skills" / "sk-doc" / "shared" / "assets" / "skill-contract.json"


def load_module():
    """Import audit_descriptions.py from its path; the scripts dir is not a package."""
    spec = importlib.util.spec_from_file_location("audit_descriptions", SCRIPT)
    module = importlib.util.module_from_spec(spec)
    # Dataclasses resolve their annotations through sys.modules.
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def write_md(path: Path, description: str) -> None:
    """Write a markdown file whose frontmatter carries one description."""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(f"---\nname: {path.stem}\ndescription: {description}\n---\n\nBody.\n", encoding="utf-8")


class AuditDescriptionsTest(unittest.TestCase):
    """Exit codes, totals and contract wiring of the description-budget audit."""

    def setUp(self) -> None:
        self._tmp = tempfile.TemporaryDirectory()
        self.repo = Path(self._tmp.name)

    def tearDown(self) -> None:
        self._tmp.cleanup()

    def run_audit(self, *args: str) -> subprocess.CompletedProcess:
        """Run the audit against the fixture repo."""
        return subprocess.run(
            [sys.executable, str(SCRIPT), "--repo-root", str(self.repo), *args],
            capture_output=True,
            text=True,
            check=False,
        )

    def run_json(self, *args: str) -> Dict:
        """Run the audit with --json and parse stdout."""
        return json.loads(self.run_audit("--json", *args).stdout)

    def seed(self, skills: Optional[Dict[str, str]] = None, commands: Optional[Dict[str, str]] = None) -> None:
        """Create skills and commands with the given descriptions."""
        for name, desc in (skills or {}).items():
            write_md(self.repo / ".skilled" / "skills" / name / "SKILL.md", desc)
        for name, desc in (commands or {}).items():
            write_md(self.repo / ".skilled" / "commands" / f"{name}.md", desc)

    def test_small_tree_passes(self) -> None:
        self.seed(skills={"alpha": "Short skill."}, commands={"beta": "Short command."})
        proc = self.run_audit()
        self.assertEqual(proc.returncode, 0, proc.stderr)
        self.assertIn("Items audited:  2", proc.stdout)

    def test_zero_items_exits_2_with_json_error(self) -> None:
        proc = self.run_audit("--json")
        self.assertEqual(proc.returncode, 2)
        payload = json.loads(proc.stdout)
        self.assertIn("zero items audited", payload["error"])
        self.assertEqual(payload["items"], [])

    def test_description_over_hard_cap_exits_1(self) -> None:
        module = load_module()
        self.seed(skills={"big": "x" * (module.DESCRIPTION_HARD_CAP + 1)})
        proc = self.run_audit("--json")
        self.assertEqual(proc.returncode, 1)
        self.assertEqual(json.loads(proc.stdout)["hardFails"], ["big"])

    def test_fail_over_boundary(self) -> None:
        self.seed(skills={"alpha": "a" * 40}, commands={"beta": "b" * 60})
        total = self.run_json()["totalChars"]
        self.assertEqual(total, 100)
        self.assertEqual(self.run_audit(f"--fail-over={total}").returncode, 0)
        self.assertEqual(self.run_audit(f"--fail-over={total - 1}").returncode, 1)
        self.assertEqual(self.run_audit("--json", f"--fail-over={total - 1}").returncode, 1)

    def test_mirrored_agent_counted_once(self) -> None:
        write_md(self.repo / ".skilled" / "agents" / "helper.md", "Helps with things.")
        write_md(self.repo / ".claude" / "agents" / "helper.md", "Helps with things.")
        payload = self.run_json()
        self.assertEqual(payload["counts"]["agents"], 1)
        self.assertEqual(payload["totalChars"], len("Helps with things."))
        self.assertEqual(payload["items"][0]["mirrored"], 2)

    def test_negative_top_n_is_rejected(self) -> None:
        self.seed(skills={"alpha": "Short skill."})
        proc = self.run_audit("--top-n", "-3")
        self.assertEqual(proc.returncode, 2)
        self.assertNotIn("more)", proc.stdout)

    def test_constants_match_skill_contract(self) -> None:
        budget = json.loads(CONTRACT.read_text(encoding="utf-8"))["descriptionBudget"]
        module = load_module()
        self.assertEqual(module.DESCRIPTION_SOFT_TARGET_SKILL, budget["skill"]["softMax"])
        self.assertEqual(module.DESCRIPTION_SOFT_TARGET_COMMAND, budget["command"]["softMax"])
        self.assertEqual(module.DESCRIPTION_HARD_CAP, budget["hardCap"])
        self.assertEqual(module.PROJECT_SOFT_CEILING_DEFAULT, budget["projectCeiling"])

    def test_budget_is_read_from_the_contract_file(self) -> None:
        contract = self.repo / "contract.json"
        contract.write_text(json.dumps({"descriptionBudget": {
            "skill": {"softMax": 11}, "command": {"softMax": 22}, "hardCap": 333, "projectCeiling": 4444,
        }}), encoding="utf-8")
        budget = load_module().load_description_budget(contract)
        self.assertEqual(budget, {"soft_skill": 11, "soft_command": 22, "hard_cap": 333, "project_ceiling": 4444})

    def test_missing_contract_uses_documented_fallback(self) -> None:
        module = load_module()
        budget = module.load_description_budget(self.repo / "absent.json")
        self.assertEqual(budget, module.FALLBACK_DESCRIPTION_BUDGET)

    def test_malformed_contract_is_an_error_not_a_fallback(self) -> None:
        contract = self.repo / "contract.json"
        contract.write_text('{"descriptionBudget": {"skill": {}}}', encoding="utf-8")
        with self.assertRaises(ValueError):
            load_module().load_description_budget(contract)


if __name__ == "__main__":
    unittest.main()
