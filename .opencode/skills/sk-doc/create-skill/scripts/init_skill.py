#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: SKILL INITIALIZER
# ───────────────────────────────────────────────────────────────

"""
Skill Initializer - Creates a new skill from template

Usage:
    init_skill.py <skill-name> --path <path>

Examples:
    init_skill.py my-new-skill --path skills/public
    init_skill.py my-api-helper --path skills/private
    init_skill.py custom-skill --path /custom/location
"""

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional


# ───────────────────────────────────────────────────────────────
# 1. VALIDATION
# ───────────────────────────────────────────────────────────────

def validate_skill_name(skill_name: str) -> tuple[bool, str]:
    """Validate skill name format (hyphen-case).

    Args:
        skill_name: The skill name to validate.

    Returns:
        Tuple of (is_valid, error_message). Error message is empty if valid.
    """
    if not re.match(r'^[a-z][a-z0-9-]*[a-z0-9]$', skill_name):
        return False, (
            f"Skill name '{skill_name}' must be hyphen-case:\n"
            "   - Start with a lowercase letter\n"
            "   - End with a lowercase letter or number\n"
            "   - Contain only lowercase letters, numbers, and hyphens\n"
            "   Examples: my-skill, pdf-editor, code-review-v2"
        )

    if len(skill_name) > 40:
        return False, f"Skill name '{skill_name}' exceeds 40 character limit ({len(skill_name)} chars)"

    if '--' in skill_name:
        return False, f"Skill name '{skill_name}' cannot contain consecutive hyphens (--)"

    return True, ""


def title_case_skill_name(skill_name: str) -> str:
    """Convert hyphenated skill name to Title Case for display.

    Args:
        skill_name: Hyphen-case skill name (e.g., 'my-skill').

    Returns:
        Title-cased string (e.g., 'My Skill').
    """
    return ' '.join(word.capitalize() for word in skill_name.split('-'))


# ───────────────────────────────────────────────────────────────
# 2. SCAFFOLDING
# ───────────────────────────────────────────────────────────────

def init_skill(skill_name: str, path: str) -> Optional[Path]:
    """Initialize a new skill directory with template SKILL.md.

    Args:
        skill_name: Hyphen-case skill name (e.g., 'my-skill').
        path: Parent directory path where skill folder will be created.

    Returns:
        Path to created skill directory, or None on failure.
    """
    is_valid, error_msg = validate_skill_name(skill_name)
    if not is_valid:
        print(f"❌ Error: {error_msg}")
        return None

    skill_dir = Path(path).resolve() / skill_name

    if skill_dir.exists():
        print(f"❌ Error: Skill directory already exists: {skill_dir}")
        return None

    template_path = (
        Path(__file__).parent.parent
        / 'assets'
        / 'skill'
        / 'skill_scaffold_template.md'
    )
    try:
        skill_template = template_path.read_text(encoding='utf-8')
    except (OSError, UnicodeError) as exc:
        print(f"❌ Error reading scaffold template {template_path}: {exc}")
        return None

    skill_title = title_case_skill_name(skill_name)
    skill_content = (
        skill_template
        .replace('{{SKILL_NAME}}', skill_name)
        .replace('{{SKILL_TITLE}}', skill_title)
    )

    try:
        skill_dir.mkdir(parents=True, exist_ok=False)
        print(f"✅ Created skill directory: {skill_dir}")
    except OSError as exc:
        print(f"❌ Error creating directory: {exc}")
        return None

    skill_md_path = skill_dir / 'SKILL.md'
    try:
        skill_md_path.write_text(skill_content, encoding='utf-8')
        print("✅ Created SKILL.md")
    except OSError as exc:
        print(f"❌ Error creating SKILL.md: {exc}")
        return None

    print(f"\n✅ Skill '{skill_name}' initialized successfully at {skill_dir}")
    print("\nNext steps:")
    print("1. Edit SKILL.md to complete the TODO items and update the description")
    print("2. Add optional references/, assets/, or scripts/ directories as needed")
    print("3. Run the validator when ready to check the skill structure")

    return skill_dir


def init_parent_skill(skill_name: str, path: str) -> Optional[Path]:
    """Initialize a minimal parent skill hub and its primary workflow packet."""
    is_valid, error_msg = validate_skill_name(skill_name)
    if not is_valid:
        print(f"❌ Error: {error_msg}")
        return None

    skill_dir = Path(path).resolve() / skill_name
    if skill_dir.exists():
        print(f"❌ Error: Skill directory already exists: {skill_dir}")
        return None

    scaffold_dir = (
        Path(__file__).parent.parent
        / 'assets'
        / 'parent_skill'
        / 'scaffold'
    )
    hub_template_path = scaffold_dir / 'hub_skill_scaffold.md'
    packet_template_path = scaffold_dir / 'packet_skill_scaffold.md'
    try:
        hub_template = hub_template_path.read_text(encoding='utf-8')
        packet_template = packet_template_path.read_text(encoding='utf-8')
    except (OSError, UnicodeError) as exc:
        print(f"❌ Error reading parent scaffold template: {exc}")
        return None

    skill_title = title_case_skill_name(skill_name)
    mode = 'primary'
    packet_name = f'{skill_name}-{mode}'
    packet_title = f'{skill_title} Primary'
    allowed_union = ["Read", "Write", "Edit", "Bash", "Grep", "Glob"]
    allowed_tools = "[" + ", ".join(allowed_union) + "]"
    timestamp = datetime.now(timezone.utc).isoformat()

    hub_content = (
        hub_template
        .replace('{{HUB_NAME}}', skill_name)
        .replace('{{ALLOWED_TOOLS}}', allowed_tools)
        .replace('{{HUB_TITLE}}', skill_title)
        .replace('{{MODE}}', mode)
        .replace('{{PACKET}}', packet_name)
    )
    packet_content = (
        packet_template
        .replace('{{PACKET_NAME}}', packet_name)
        .replace('{{PACKET_TITLE}}', packet_title)
        .replace('{{HUB_NAME}}', skill_name)
    )

    mode_registry = {
        "skill": skill_name,
        "version": "1.0.0.0",
        "modes": [
            {
                "workflowMode": mode,
                "packetKind": "workflow",
                "backendKind": "skill-workflow",
                "toolSurface": {
                    "allowed": allowed_union,
                    "forbidden": ["Task"],
                    "mutatesWorkspace": True,
                    "bashAllowlist": [],
                },
                "packet": packet_name,
                "packetSkillName": packet_name,
                "grandfatheredFolderMismatch": False,
                "aliases": [packet_name, f"{skill_name} primary workflow"],
                "advisorRouting": {
                    "routingClass": "metadata",
                    "packetSkillName": packet_name,
                },
            }
        ],
    }
    hub_router = {
        "skill": skill_name,
        "version": "1.0.0.0",
        "routerPolicy": {
            "defaultMode": mode,
            "ambiguityDelta": 1,
            "tieBreak": [mode],
            "outcomes": {
                "single": "one dominant workflow intent routes to the primary workflow mode",
                "orderedBundle": "clearly separate workflow intents route to an ordered workflow mode list",
                "defer": "unclear or contradictory intent asks for disambiguation",
            },
            "defaultResource": [f"{packet_name}/SKILL.md"],
            "bundleRules": [],
        },
        "routerSignals": {
            mode: {
                "weight": 4,
                "classes": ["primary-aliases", "hub-identity"],
                "resources": [f"{packet_name}/SKILL.md"],
            }
        },
        "vocabularyClasses": {
            "hub-identity": {
                "keywords": [
                    skill_name,
                    "mode-registry",
                    "hub-router",
                    "workflowmode",
                    "packetkind",
                ]
            },
            "primary-aliases": {
                "keywords": ["primary", f"{skill_name} primary"]
            },
        },
    }
    graph_metadata = {
        "schema_version": 2,
        "skill_id": skill_name,
        "family": "sk-hub",
        "category": "skill",
        "deprecated": False,
        "edges": {
            "depends_on": [],
            "enhances": [],
            "siblings": [],
            "conflicts_with": [],
            "prerequisite_for": [],
        },
        "manual": {"depends_on": [], "related_to": []},
        "domains": [
            skill_name,
            "mode-registry",
            "hub-router",
            "workflowMode",
            "packetKind",
        ],
        "intent_signals": [
            f"{skill_name} hub",
            f"{skill_name} primary workflow",
        ],
        "derived": {
            "trigger_phrases": [skill_name, "primary"],
            "key_topics": [
                skill_name,
                "mode-registry",
                "hub-router",
                "workflowMode",
                "packetKind",
            ],
            "source_docs": [
                "SKILL.md",
                "README.md",
                "mode-registry.json",
                "hub-router.json",
            ],
            "created_at": timestamp,
            "last_updated_at": timestamp,
        },
    }
    description = {
        "name": skill_name,
        "description": (
            "TODO hub description — routes the primary workflow packet via "
            "mode-registry.json."
        ),
        "version": "1.0.0.0",
        "importance_tier": "high",
        "keywords": [skill_name, "mode-registry", "hub-router", "primary"],
        "trigger_examples": [
            f"example request for the {skill_name} primary workflow"
        ],
        "lastUpdated": timestamp,
    }

    packet_dir = skill_dir / packet_name
    changelog_dir = packet_dir / 'changelog'
    try:
        changelog_dir.mkdir(parents=True, exist_ok=False)
        for directory_name in (
            'changelog',
            'manual_testing_playbook',
            'benchmark',
        ):
            (skill_dir / directory_name).mkdir()
        print(f"✅ Created parent skill directory: {skill_dir}")

        (skill_dir / 'SKILL.md').write_text(hub_content, encoding='utf-8')
        (skill_dir / 'README.md').write_text(
            f"# {skill_title}\n\nRouting hub. See SKILL.md and mode-registry.json.\n",
            encoding='utf-8',
        )
        with (skill_dir / 'mode-registry.json').open('w', encoding='utf-8') as handle:
            json.dump(mode_registry, handle, indent=2)
            handle.write('\n')
        with (skill_dir / 'hub-router.json').open('w', encoding='utf-8') as handle:
            json.dump(hub_router, handle, indent=2)
            handle.write('\n')
        with (skill_dir / 'graph-metadata.json').open('w', encoding='utf-8') as handle:
            json.dump(graph_metadata, handle, indent=2)
            handle.write('\n')
        with (skill_dir / 'description.json').open('w', encoding='utf-8') as handle:
            json.dump(description, handle, indent=2)
            handle.write('\n')

        (packet_dir / 'SKILL.md').write_text(packet_content, encoding='utf-8')
        (packet_dir / 'README.md').write_text(
            f"# {packet_title}\n\nPrimary workflow packet for the {skill_name} hub.\n",
            encoding='utf-8',
        )
        (changelog_dir / '1.0.0.0.md').write_text(
            "# 1.0.0.0 - Initial scaffold\n",
            encoding='utf-8',
        )
    except OSError as exc:
        print(f"❌ Error creating parent skill scaffold: {exc}")
        return None

    print(f"\n✅ Parent skill '{skill_name}' initialized successfully at {skill_dir}")
    print("\nNext steps:")
    print(f"1. Rename or replace the {packet_name} example mode")
    print("2. Fill the TODO descriptions in the hub and packet SKILL.md files")
    print("3. Re-run the completion gate with validate_skill_package.py")

    return skill_dir


# ───────────────────────────────────────────────────────────────
# 3. MAIN
# ───────────────────────────────────────────────────────────────

def main() -> None:
    """CLI entry point for skill initialization."""
    parser = argparse.ArgumentParser(
        description="Create a new skill from the sk-doc template."
    )
    parser.add_argument(
        'skill_name',
        help="Hyphen-case skill name (e.g., my-new-skill)",
    )
    parser.add_argument(
        '--path',
        required=True,
        help="Destination parent directory for the skill",
    )
    parser.add_argument(
        '--kind',
        choices=['standalone', 'parent'],
        default='standalone',
        help="Skill scaffold kind (default: standalone)",
    )
    args = parser.parse_args()

    skill_name = args.skill_name
    path = args.path

    print(f"🚀 Initializing skill: {skill_name}")
    print(f"   Location: {path}")
    print()

    if args.kind == 'parent':
        result = init_parent_skill(skill_name, path)
    else:
        result = init_skill(skill_name, path)

    if result:
        sys.exit(0)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
