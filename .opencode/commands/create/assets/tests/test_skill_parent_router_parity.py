#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# TEST: CREATE-SKILL-PARENT ROOT ROUTER PARITY + NO-LEGACY GREP
# ───────────────────────────────────────────────────────────────

"""Verify the create-skill-parent auto/confirm workflows agree on the root
ROUTER.md classification and action contract by comparing the identical
canonical ``root_router_contract`` block structurally — not by stringifying the
whole YAML and checking for tokens. The block must cover every classification
state, map each state to exactly one create/migrate/unchanged action, and carry
the stop-before-write, delete-legacy-after-validation, and machine-block
byte-preservation invariants. A separate grep keeps every authoring surface
from instructing creation of a legacy smart-routing.md path.

Usage: python3 .opencode/commands/create/assets/tests/test_skill_parent_router_parity.py
"""

import re
import unittest
from pathlib import Path

import yaml


ASSET_ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = ASSET_ROOT.parents[3]

AUTO_YAML = ASSET_ROOT / "create-skill-parent-auto.yaml"
CONFIRM_YAML = ASSET_ROOT / "create-skill-parent-confirm.yaml"

# The six classification states and the three actions both workflows must bind
# through the canonical block.
CLASSIFICATION_STATES = [
    "stage1-only",
    "active",
    "legacy-migratable",
    "already-current",
    "conflict",
    "malformed",
]
ACTION_TOKENS = ["create", "migrate", "unchanged"]
ACTION_LINE = "ROUTER.md: create|migrate|unchanged"

# Authoring surfaces that must never instruct an author to create the legacy
# router path. The contract library and its fixtures deliberately name the
# legacy paths (to reject them) and are excluded here.
AUTHORING_SURFACES = [
    REPO_ROOT / ".opencode/skills/sk-doc/sk-create-skill/assets/parent-skill",
    REPO_ROOT / ".opencode/skills/sk-doc/sk-create-skill/references/parent-skill",
    REPO_ROOT / ".opencode/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md",
    REPO_ROOT / ".opencode/commands/create",
]

# A creation instruction is an imperative verb scoped to the legacy router
# path in the same line; a bare mention ("must never coexist with a legacy
# smart-routing.md", "migrate from the legacy smart-routing.md") is not.
CREATION_INSTRUCTION = re.compile(
    r"(copy\s+it\s+to|create\s+(a|an|the)?\s*`?shared/references/smart-routing|"
    r"scaffold\s+(a|an|the)?\s*`?shared/references/smart-routing|"
    r"place\s+(a|an|the)?\s*`?shared/references/smart-routing)"
)


class SkillParentRouterParityTest(unittest.TestCase):
    """Protect auto/confirm router-contract parity and the no-legacy rule."""

    @classmethod
    def setUpClass(cls) -> None:
        cls.auto = yaml.safe_load(AUTO_YAML.read_text(encoding="utf-8"))
        cls.confirm = yaml.safe_load(CONFIRM_YAML.read_text(encoding="utf-8"))
        cls.auto_contract = cls.auto["root_router_contract"]
        cls.confirm_contract = cls.confirm["root_router_contract"]

    def test_both_yamls_parse_and_are_dicts(self) -> None:
        self.assertIsInstance(self.auto, dict)
        self.assertIsInstance(self.confirm, dict)

    def test_canonical_contract_is_identical_between_workflows(self) -> None:
        # Structural equality, not token presence: any drift in a state, an
        # action, or an invariant between :auto and :confirm fails here.
        self.assertEqual(self.auto_contract, self.confirm_contract)

    def test_canonical_contract_covers_all_classification_states(self) -> None:
        self.assertEqual(self.auto_contract["classification_states"], CLASSIFICATION_STATES)
        for state in CLASSIFICATION_STATES:
            with self.subTest(state=state):
                self.assertIn(state, self.auto_contract["state_action_map"])

    def test_canonical_contract_actions(self) -> None:
        self.assertEqual(self.auto_contract["actions"], ACTION_TOKENS)
        self.assertEqual(self.auto_contract["action_line"], ACTION_LINE)

    def test_every_state_maps_to_exactly_one_action(self) -> None:
        # Terminal states (conflict/malformed) deliberately own no action and
        # stop before any write; every other state selects exactly one of the
        # three action tokens.
        for state, row in self.auto_contract["state_action_map"].items():
            with self.subTest(state=state):
                self.assertIsInstance(row, dict)
                if row.get("action") is None:
                    self.assertTrue(row.get("stop_before_write"), f"{state} must stop before write when it has no action")
                else:
                    self.assertIn(row["action"], self.auto_contract["actions"])

    def test_canonical_contract_invariants(self) -> None:
        contract = self.auto_contract
        self.assertTrue(contract["invariants"]["create_emits_stage1_only_with_empty_maps"])
        self.assertTrue(contract["invariants"]["stop_before_write_on_conflict"])
        self.assertTrue(contract["invariants"]["stop_before_write_on_malformed"])
        self.assertTrue(contract["invariants"]["delete_legacy_only_after_validation"])
        self.assertTrue(contract["invariants"]["preserve_machine_block_bytes_on_migrate"])
        # The per-state rows re-state the invariants for the states that carry
        # them, so the behavior is provable from the map itself.
        self.assertIsNone(contract["state_action_map"]["conflict"]["action"])
        self.assertIsNone(contract["state_action_map"]["malformed"]["action"])
        self.assertTrue(contract["state_action_map"]["conflict"]["stop_before_write"])
        self.assertTrue(contract["state_action_map"]["malformed"]["stop_before_write"])
        self.assertEqual(contract["state_action_map"]["legacy-migratable"]["action"], "migrate")
        self.assertEqual(contract["state_action_map"]["stage1-only"]["action"], "unchanged")
        self.assertEqual(contract["state_action_map"]["active"]["action"], "unchanged")
        self.assertEqual(contract["state_action_map"]["already-current"]["action"], "unchanged")

    def test_both_workflows_bind_the_canonical_block(self) -> None:
        for label, workflow in (("auto", self.auto), ("confirm", self.confirm)):
            with self.subTest(workflow=label):
                self.assertIn("root_router_contract", workflow)
                self.assertIn("ROUTER.md", str(workflow))

    def test_no_authoring_surface_instructs_legacy_router_creation(self) -> None:
        violations = []
        for surface in AUTHORING_SURFACES:
            if surface.is_file():
                targets = [surface]
            elif surface.is_dir():
                targets = sorted(p for p in surface.rglob("*") if p.is_file())
            else:
                continue
            for target in targets:
                if target.suffix in (".pyc",):
                    continue
                try:
                    text = target.read_text(encoding="utf-8")
                except (UnicodeDecodeError, OSError):
                    continue
                for lineno, line in enumerate(text.splitlines(), start=1):
                    if CREATION_INSTRUCTION.search(line):
                        violations.append(f"{target.relative_to(REPO_ROOT)}:{lineno}: {line.strip()}")
        self.assertEqual(
            violations, [],
            "authoring surface still instructs legacy smart-routing.md creation:\n"
            + "\n".join(violations),
        )

    def test_command_router_teaches_the_same_vocabulary(self) -> None:
        router = (ASSET_ROOT.parent / "skill-parent.md").read_text(encoding="utf-8")
        for state in CLASSIFICATION_STATES:
            self.assertIn(state, router)
        self.assertIn("ROUTER.md: create|migrate|unchanged", router)


if __name__ == "__main__":
    unittest.main()
