#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: SKILL VALIDATOR
# ───────────────────────────────────────────────────────────────

"""
Quick validation script for skills - enhanced version

Validates:
- SKILL.md exists
- YAML frontmatter present and valid
- Required fields: name, description, version (skills only; 4-part X.Y.Z.W -- see references/frontmatter_versioning.md)
- Optional fields: allowed-tools
- Name format: hyphen-case
- Description: single line (no YAML block format)
- Description length within budget (packet 086): soft warn at 130/110, hard fail at 1536
- allowed-tools (if present): array format [Tool1, Tool2]
- No angle brackets in description
- No TODO placeholders in description

Output formats:
- Human-readable (default)
- JSON (with --json flag)

Description budget reference: see
.opencode/skills/sk-doc/shared/assets/frontmatter_templates.md
§ "Description Budget & Trim Style". Constants below are the single source of
truth for the python validators; doc-side constants live in the markdown file.
"""

import argparse
import sys
import json
import re
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union


# ───────────────────────────────────────────────────────────────
# Description budget constants
# ───────────────────────────────────────────────────────────────
# Soft targets are project conventions (warn, do not block).
# Hard cap is the Claude Code internal limit on combined description+when_to_use.
DESCRIPTION_SOFT_TARGET_SKILL = 130
DESCRIPTION_SOFT_TARGET_COMMAND = 110
DESCRIPTION_HARD_CAP = 1536


def _detect_target_kind(skill_path: Path) -> str:
    """Detect whether the validated artifact is a skill or a command from its path.

    Returns 'command' for paths under .opencode/commands/ or .claude/commands/, else 'skill'.
    """
    parts = [p.lower() for p in skill_path.resolve().parts]
    if any(part in ('command', 'commands') for part in parts):
        return 'command'
    return 'skill'


def check_description_length(
    description: str,
    soft_target: int,
    hard_cap: int = DESCRIPTION_HARD_CAP,
) -> Tuple[Optional[str], Optional[str]]:
    """Evaluate description length against soft target and hard cap.

    Returns (error_message, warning_message). Either may be None.
    Operates on the unwrapped, post-quote-strip description value (caller's
    responsibility to pre-process).
    """
    length = len(description)
    if length > hard_cap:
        return (
            f"Description is {length} chars, exceeds Claude Code hard cap of {hard_cap} chars "
            f"(combined description + when_to_use). Skill will fail to register.",
            None,
        )
    if length > soft_target:
        return (
            None,
            f"Description is {length} chars, exceeds soft target of {soft_target}. "
            f"Project total budget is ~5,600 chars (default 8,000 minus built-ins); "
            f"trim per .opencode/skills/sk-doc/shared/assets/frontmatter_templates.md "
            f"§ 'Description Budget & Trim Style'.",
        )
    return (None, None)


# ───────────────────────────────────────────────────────────────
# 1. VALIDATION
# ───────────────────────────────────────────────────────────────

def strip_matching_quotes(value: str) -> str:
    """Strip one matching pair of wrapping single/double quotes."""
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in ('"', "'"):
        return value[1:-1]
    return value


def validate_skill(
    skill_path: Union[str, Path],
    description_soft_target: Optional[int] = None,
) -> Tuple[bool, str, List[str]]:
    """
    Validate a skill directory.

    Args:
        skill_path: Path to the skill directory containing SKILL.md.
        description_soft_target: Soft cap for description length in chars.
            If None, auto-detect from path (130 for skills, 110 for commands).

    Returns:
        Tuple of (is_valid: bool, message: str, warnings: list)
    """
    skill_path = Path(skill_path)
    warnings: List[str] = []

    kind = _detect_target_kind(skill_path)
    if description_soft_target is None:
        description_soft_target = (
            DESCRIPTION_SOFT_TARGET_COMMAND if kind == 'command' else DESCRIPTION_SOFT_TARGET_SKILL
        )

    skill_md = skill_path / 'SKILL.md'
    if not skill_md.exists():
        return False, "SKILL.md not found", warnings

    try:
        content = skill_md.read_text(encoding='utf-8')
    except OSError as exc:
        return False, f"Failed to read SKILL.md: {exc}", warnings

    if not content.startswith('---'):
        return False, "No YAML frontmatter found (file should start with ---)", warnings

    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return False, "Invalid frontmatter format (missing closing ---)", warnings

    frontmatter = match.group(1)

    if 'name:' not in frontmatter:
        return False, "Missing 'name' in frontmatter", warnings
    if 'description:' not in frontmatter:
        return False, "Missing 'description' in frontmatter", warnings

    name_match = re.search(r'name:\s*(.+)', frontmatter)
    if name_match:
        name = strip_matching_quotes(name_match.group(1))
        # Hyphen-case: lowercase with hyphens only
        if not re.match(r'^[a-z0-9-]+$', name):
            return False, f"Name '{name}' should be hyphen-case (lowercase letters, digits, and hyphens only)", warnings
        if name.startswith('-') or name.endswith('-'):
            return False, f"Name '{name}' cannot start or end with hyphen", warnings
        if '--' in name:
            return False, f"Name '{name}' cannot contain consecutive hyphens", warnings

    # Reject YAML multiline block formats (|, >, or newline+indent)
    if re.search(r'description:\s*\n\s+', frontmatter) or re.search(r'^description:\s*[|>]\s*$', frontmatter, flags=re.MULTILINE):
        return False, "Description uses YAML multiline block format (must be single line after colon)", warnings

    desc_match = re.search(r'description:\s*(.+)', frontmatter)
    if desc_match:
        description = strip_matching_quotes(desc_match.group(1))

        if '<' in description or '>' in description:
            return False, "Description cannot contain angle brackets (< or >)", warnings

        if 'TODO' in description.upper():
            warnings.append("Description contains TODO placeholder - please complete it")

        # Description-length budget check.
        # Run AFTER the multiline-block rejection above and AFTER quote-strip,
        # so we measure the user-visible length the harness will see.
        length_error, length_warning = check_description_length(
            description, description_soft_target
        )
        if length_error:
            return False, length_error, warnings
        if length_warning:
            warnings.append(length_warning)
    else:
        return False, "Description appears to be empty or multiline (must be single line after colon)", warnings

    # allowed-tools is optional but must use array format if present
    tools_match = re.search(r'allowed-tools:\s*(.+)', frontmatter)
    if tools_match:
        tools_value = tools_match.group(1).strip()
        if tools_value and not tools_value.startswith('['):
            if ',' in tools_value:
                return False, f"allowed-tools must use array format [Tool1, Tool2], found: {tools_value}", warnings

    # version is REQUIRED for skills (4-part X.Y.Z.W); commands keep it optional.
    # See references/frontmatter_versioning.md.
    version_match = re.search(r'^version:\s*(.+)', frontmatter, flags=re.MULTILINE)
    if version_match:
        version_value = strip_matching_quotes(version_match.group(1))
        if not re.match(r'^\d+\.\d+\.\d+\.\d+$', version_value):
            return False, (
                f"version '{version_value}' must be 4-part X.Y.Z.W "
                f"(see references/frontmatter_versioning.md)"
            ), warnings
    elif kind == 'skill':
        return False, (
            "Missing required 'version' in frontmatter "
            "(4-part X.Y.Z.W; see references/frontmatter_versioning.md)"
        ), warnings

    return True, "Skill is valid!", warnings


# ───────────────────────────────────────────────────────────────
# 2. MAIN
# ───────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Quick validator for SKILL.md frontmatter and structure."
    )
    parser.add_argument(
        'skill_directory',
        help="Path to the skill directory to validate",
    )
    parser.add_argument(
        '--json',
        dest='json_output',
        action='store_true',
        help="Output result as JSON",
    )
    parser.add_argument(
        '--description-soft-target',
        dest='description_soft_target',
        type=int,
        default=None,
        help=(
            "Soft cap for description length in chars (warning, non-blocking). "
            f"Auto-detects from path when omitted: {DESCRIPTION_SOFT_TARGET_SKILL} for skills, "
            f"{DESCRIPTION_SOFT_TARGET_COMMAND} for commands. "
            f"Hard cap is fixed at {DESCRIPTION_HARD_CAP} (Claude Code internal limit)."
        ),
    )
    args = parser.parse_args()

    json_output = args.json_output
    skill_path = args.skill_directory
    valid, message, warnings = validate_skill(
        skill_path, description_soft_target=args.description_soft_target
    )
    
    if json_output:
        result: Dict[str, Any] = {
            'valid': valid,
            'message': message,
            'warnings': warnings,
            'path': str(Path(skill_path).absolute())
        }
        print(json.dumps(result, indent=2))
    else:
        if valid:
            print(f"✅ {message}")
        else:
            print(f"❌ {message}")
        
        for warning in warnings:
            print(f"⚠️  {warning}")
    
    sys.exit(0 if valid else 1)


if __name__ == "__main__":
    main()
