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
import re
import sys
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
    args = parser.parse_args()

    skill_name = args.skill_name
    path = args.path

    print(f"🚀 Initializing skill: {skill_name}")
    print(f"   Location: {path}")
    print()

    result = init_skill(skill_name, path)

    if result:
        sys.exit(0)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
