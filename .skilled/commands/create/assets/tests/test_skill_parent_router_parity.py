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
from instructing creation of a legacy smart-routing.md path. The router lines
are also compared across :auto and :confirm, and the moved canon surfaces must
name the sibling ROUTER.md instead of forbidding it.

Usage: python3 .skilled/commands/create/assets/tests/test_skill_parent_router_parity.py
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

STANDALONE_AUTO_YAML = ASSET_ROOT / "create-skill-auto.yaml"
STANDALONE_CONFIRM_YAML = ASSET_ROOT / "create-skill-confirm.yaml"

# The moved canon surfaces that state the routing shape: the four create
# workflows, the presentation summary, and the reference docs. A stale
# packet-prohibition phrase here would teach the old rule back to authors.
CANON_SURFACES = [
    ASSET_ROOT / "create-skill-auto.yaml",
    ASSET_ROOT / "create-skill-confirm.yaml",
    ASSET_ROOT / "create-skill-parent-auto.yaml",
    ASSET_ROOT / "create-skill-parent-confirm.yaml",
    ASSET_ROOT / "create-skill-presentation.txt",
    REPO_ROOT / ".skilled/skills/sk-doc/sk-create-skill/references/shared/validation-and-packaging.md",
    REPO_ROOT / ".skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md",
    REPO_ROOT / ".skilled/skills/sk-doc/sk-create-skill/references/shared/common-pitfalls.md",
    REPO_ROOT / ".skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md",
    REPO_ROOT / ".skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md",
    REPO_ROOT / ".skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md",
]

# A stale prohibition, expressed so the guard's own source never reads as the
# rule it rejects. Each pattern brackets its last character.
STALE_PACKET_ROUTER_RULES = [
    r"packet carries no ROUTE[R]",
    r"no ROUTER\.md of its ow[n]",
    r"mode packet never carrie[s]",
    r"packet carries its own ROUTE[R]\.md",
    r"packet keeps non[e]",
    r"only router file in the famil[y]",
    r"give a mode packet its own ROUTE[R]\.md",
]

# Authoring surfaces that must never instruct an author to create the legacy
# router path. The contract library and its fixtures deliberately name the
# legacy paths (to reject them) and are excluded here.
AUTHORING_SURFACES = [
    REPO_ROOT / ".skilled/skills/sk-doc/sk-create-skill/assets/parent-skill",
    REPO_ROOT / ".skilled/skills/sk-doc/sk-create-skill/references/parent-skill",
    REPO_ROOT / ".skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md",
    REPO_ROOT / ".skilled/commands/create",
]

# A creation instruction is an imperative verb scoped to the legacy router
# path in the same line; a bare mention ("must never coexist with a legacy
# smart-routing.md", "migrate from the legacy smart-routing.md") is not.
CREATION_INSTRUCTION = re.compile(
    r"(copy\s+it\s+to|create\s+(a|an|the)?\s*`?shared/references/smart-routing|"
    r"scaffold\s+(a|an|the)?\s*`?shared/references/smart-routing|"
    r"place\s+(a|an|the)?\s*`?shared/references/smart-routing)"
)


def _string_leaves(node):
    if isinstance(node, dict):
        for value in node.values():
            yield from _string_leaves(value)
    elif isinstance(node, list):
        for value in node:
            yield from _string_leaves(value)
    elif isinstance(node, str):
        yield node


def router_lines(workflow):
    """Return the ROUTER.md lines a workflow states, with the mode token normalized."""
    lines = set()
    for value in _string_leaves(workflow):
        for line in value.splitlines():
            if "ROUTER.md" in line:
                lines.add(line.replace(":auto", ":mode").replace(":confirm", ":mode").strip())
    return lines


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

    def test_router_lines_are_identical_between_workflows(self) -> None:
        # Every ROUTER.md line a workflow states must match its sibling mode,
        # so the packet router rule cannot drift between :auto and :confirm.
        for label, auto_path, confirm_path in (
            ("parent", AUTO_YAML, CONFIRM_YAML),
            ("standalone", STANDALONE_AUTO_YAML, STANDALONE_CONFIRM_YAML),
        ):
            with self.subTest(workflow=label):
                auto = router_lines(yaml.safe_load(auto_path.read_text(encoding="utf-8")))
                confirm = router_lines(yaml.safe_load(confirm_path.read_text(encoding="utf-8")))
                self.assertEqual(auto, confirm)

    def test_moved_surfaces_state_the_sibling_packet_router(self) -> None:
        for surface in CANON_SURFACES:
            with self.subTest(surface=surface.name):
                self.assertTrue(surface.is_file(), f"missing canon surface: {surface}")
                text = surface.read_text(encoding="utf-8")
                self.assertIn("ROUTER.md", text)
                for stale in STALE_PACKET_ROUTER_RULES:
                    self.assertIsNone(
                        re.search(stale, text, re.IGNORECASE),
                        f"{surface} still states the old packet rule: {stale}",
                    )


if __name__ == "__main__":
    unittest.main()
