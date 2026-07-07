#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: SKILL/COMMAND/AGENT DESCRIPTION BUDGET AUDIT
# ───────────────────────────────────────────────────────────────

"""
Audit the total description-budget consumption across all project surfaces
that feed Claude Code's available-skills list.

Surfaces walked:
- .opencode/skills/<name>/SKILL.md            (YAML frontmatter)
- .opencode/commands/**/<name>.md             (YAML frontmatter)
- .opencode/agents/<name>.md                  (YAML frontmatter)
- .claude/agents/<name>.md                   (YAML frontmatter, often a symlink)

For agents, the repo-managed runtime mirrors usually share identical text. The audit
reports unique-by-name with a `mirrored: N surfaces` annotation so the budget
math is honest (Claude Code only counts the runtime it actively loads, but the
unique-by-name view is the most useful drift signal).

Outputs:
- Human-readable table: per-item lengths, top-N bloated, project total, headroom
- JSON envelope (`--json`) for CI/pre-commit consumption
- Non-zero exit when project total exceeds `--fail-over=N`

Constants come from the same source-of-truth as quick_validate.py:
130/110 soft, 1536 hard, 5600 project ceiling.

Reference: .opencode/skills/sk-doc/shared/assets/frontmatter_templates.md
           § "Description Budget & Trim Style"
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional

# Reuse quick_validate.py constants (single source of truth in python).
SCRIPT_DIR = Path(__file__).resolve().parent
QUICK_VALIDATE_DIR = SCRIPT_DIR.parent.parent.parent / "skills" / "sk-doc" / "scripts"
sys.path.insert(0, str(QUICK_VALIDATE_DIR))

try:
    from quick_validate import (  # type: ignore
        DESCRIPTION_HARD_CAP,
        DESCRIPTION_SOFT_TARGET_COMMAND,
        DESCRIPTION_SOFT_TARGET_SKILL,
        strip_matching_quotes,
    )
except ImportError:
    # Defensive fallback so the audit still runs if quick_validate.py is missing.
    DESCRIPTION_HARD_CAP = 1536
    DESCRIPTION_SOFT_TARGET_SKILL = 130
    DESCRIPTION_SOFT_TARGET_COMMAND = 110

    def strip_matching_quotes(value: str) -> str:
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in ('"', "'"):
            return value[1:-1]
        return value


PROJECT_SOFT_CEILING_DEFAULT = 5600
CLAUDE_CODE_BUDGET_DEFAULT = 8000  # SLASH_COMMAND_TOOL_CHAR_BUDGET


# ───────────────────────────────────────────────────────────────
# 1. PARSING
# ───────────────────────────────────────────────────────────────


def parse_yaml_frontmatter_description(text: str) -> Optional[str]:
    """Extract the `description:` field from a YAML frontmatter block.

    Returns the unwrapped (post-quote-strip) string, or None if missing/multiline.
    Mirrors quick_validate.py logic for consistency.
    """
    if not text.startswith("---"):
        return None
    match = re.match(r"^---\n(.*?)\n---", text, re.DOTALL)
    if not match:
        return None
    fm = match.group(1)
    if re.search(r"description:\s*\n\s+", fm) or re.search(r"^description:\s*[|>]\s*$", fm, flags=re.MULTILINE):
        return None
    desc_match = re.search(r"description:\s*(.+)", fm)
    if not desc_match:
        return None
    return strip_matching_quotes(desc_match.group(1))


def parse_toml_description(text: str) -> Optional[str]:
    """Extract `description = "..."` from a top-level TOML file.

    Uses tomllib when available (Python 3.11+); falls back to a regex match
    for older Pythons. The regex is deliberately conservative: top-level only,
    string literal only.
    """
    try:
        import tomllib  # type: ignore
        try:
            data = tomllib.loads(text)
            value = data.get("description")
            if isinstance(value, str):
                return value
        except tomllib.TOMLDecodeError:
            pass
    except ImportError:
        pass
    # Regex fallback. Anchors to a top-level (non-indented) `description = "..."`.
    match = re.search(r'^description\s*=\s*"([^"\n]*)"', text, flags=re.MULTILINE)
    if match:
        return match.group(1)
    return None


# ───────────────────────────────────────────────────────────────
# 2. SURFACE WALKING
# ───────────────────────────────────────────────────────────────


@dataclass
class Item:
    name: str
    surface: str  # 'skill' | 'command' | 'agent'
    path: str
    description: str
    length: int
    mirrored_paths: List[str] = field(default_factory=list)

    @property
    def soft_target(self) -> int:
        return (
            DESCRIPTION_SOFT_TARGET_COMMAND
            if self.surface == "command"
            else DESCRIPTION_SOFT_TARGET_SKILL
        )

    @property
    def status(self) -> str:
        if self.length > DESCRIPTION_HARD_CAP:
            return "HARD-FAIL"
        if self.length > self.soft_target:
            return "OVER-SOFT"
        return "OK"


def walk_skills(repo: Path) -> List[Item]:
    items: List[Item] = []
    base = repo / ".opencode" / "skills"
    if not base.is_dir():
        return items
    for skill_dir in sorted(base.iterdir()):
        skill_md = skill_dir / "SKILL.md"
        if not skill_md.is_file():
            continue
        try:
            text = skill_md.read_text(encoding="utf-8")
        except OSError:
            continue
        desc = parse_yaml_frontmatter_description(text)
        if desc is None:
            continue
        items.append(
            Item(
                name=skill_dir.name,
                surface="skill",
                path=str(skill_md.relative_to(repo)),
                description=desc,
                length=len(desc),
            )
        )
    return items


def walk_commands(repo: Path) -> List[Item]:
    items: List[Item] = []
    base = repo / ".opencode" / "commands"
    if not base.is_dir():
        return items
    for cmd in sorted(base.rglob("*.md")):
        # Skip nested asset markdown files
        if "assets" in cmd.parts or "scripts" in cmd.parts:
            continue
        try:
            text = cmd.read_text(encoding="utf-8")
        except OSError:
            continue
        desc = parse_yaml_frontmatter_description(text)
        if desc is None:
            continue
        rel = cmd.relative_to(base)
        # Name: use folder/basename for namespaced commands (e.g., "memory/save")
        if rel.parent != Path("."):
            display_name = f"{rel.parent}/{rel.stem}"
        else:
            display_name = rel.stem
        items.append(
            Item(
                name=display_name,
                surface="command",
                path=str(cmd.relative_to(repo)),
                description=desc,
                length=len(desc),
            )
        )
    return items


def walk_agents(repo: Path) -> List[Item]:
    """Walk repo-managed runtime agent surfaces, dedupe by name, annotate mirrors."""
    surfaces = [
        (repo / ".opencode" / "agents", "yaml"),
        (repo / ".claude" / "agents", "yaml"),
    ]
    by_name: Dict[str, Item] = {}
    for base, fmt in surfaces:
        if not base.is_dir():
            continue
        pattern = "*.md" if fmt == "yaml" else "*.toml"
        for path in sorted(base.glob(pattern)):
            try:
                text = path.read_text(encoding="utf-8")
            except OSError:
                continue
            desc = (
                parse_yaml_frontmatter_description(text)
                if fmt == "yaml"
                else parse_toml_description(text)
            )
            if desc is None:
                continue
            name = path.stem
            rel_path = str(path.relative_to(repo))
            if name in by_name:
                existing = by_name[name]
                existing.mirrored_paths.append(rel_path)
                continue
            by_name[name] = Item(
                name=name,
                surface="agent",
                path=rel_path,
                description=desc,
                length=len(desc),
                mirrored_paths=[rel_path],
            )
    return list(by_name.values())


# ───────────────────────────────────────────────────────────────
# 3. REPORTING
# ───────────────────────────────────────────────────────────────


def project_total(items: List[Item]) -> int:
    return sum(item.length for item in items)


def render_table(items: List[Item], top_n: int = 10) -> str:
    sorted_items = sorted(items, key=lambda i: -i.length)
    lines: List[str] = []
    lines.append(f"{'STATUS':<10} {'CHARS':>5}  {'SURFACE':<8}  NAME")
    lines.append("-" * 70)
    for item in sorted_items[:top_n]:
        suffix = ""
        if item.surface == "agent" and len(item.mirrored_paths) > 1:
            suffix = f"  (mirrored: {len(item.mirrored_paths)} surfaces)"
        lines.append(
            f"{item.status:<10} {item.length:>5}  {item.surface:<8}  {item.name}{suffix}"
        )
    if len(sorted_items) > top_n:
        lines.append(f"... ({len(sorted_items) - top_n} more)")
    return "\n".join(lines)


def render_human(
    items: List[Item],
    project_ceiling: int,
    fail_over: Optional[int],
    top_n: int,
) -> str:
    total = project_total(items)
    lines: List[str] = []
    lines.append("=" * 70)
    lines.append("Skill/Command/Agent Description Budget Audit (Packet 086)")
    lines.append("=" * 70)
    lines.append("")
    lines.append(f"Items audited:  {len(items)}")
    lines.append(f"  - skills:     {sum(1 for i in items if i.surface == 'skill')}")
    lines.append(f"  - commands:   {sum(1 for i in items if i.surface == 'command')}")
    lines.append(f"  - agents:     {sum(1 for i in items if i.surface == 'agent')} (unique names)")
    lines.append("")
    lines.append(f"Project total:        {total:>5} chars")
    lines.append(f"Project soft-ceiling: {project_ceiling:>5} chars")
    lines.append(f"Headroom:             {project_ceiling - total:>5} chars under ceiling")
    lines.append(
        f"Default Claude Code budget: {CLAUDE_CODE_BUDGET_DEFAULT} chars "
        f"(built-ins consume the {CLAUDE_CODE_BUDGET_DEFAULT - project_ceiling}-char headroom)"
    )
    lines.append("")
    lines.append(f"Top {top_n} by length:")
    lines.append(render_table(items, top_n=top_n))
    lines.append("")
    over_soft = [i for i in items if i.status == "OVER-SOFT"]
    hard_fail = [i for i in items if i.status == "HARD-FAIL"]
    if hard_fail:
        lines.append("HARD-FAIL items (over Claude Code 1536-char per-item cap):")
        for i in hard_fail:
            lines.append(f"  - {i.surface} {i.name} ({i.length} chars)")
        lines.append("")
    if over_soft:
        lines.append(f"OVER-SOFT items ({len(over_soft)}; non-blocking, trim at next pass):")
        for i in over_soft:
            lines.append(f"  - {i.surface} {i.name} ({i.length} > {i.soft_target})")
        lines.append("")
    if fail_over is not None:
        if total > fail_over:
            lines.append(f"FAIL: project total {total} > fail_over threshold {fail_over}")
        else:
            lines.append(f"OK: project total {total} ≤ fail_over threshold {fail_over}")
    else:
        if total > project_ceiling:
            lines.append(f"WARN: project total {total} > soft ceiling {project_ceiling}")
        else:
            lines.append(f"OK: project total {total} ≤ soft ceiling {project_ceiling}")
    return "\n".join(lines)


def render_json(
    items: List[Item],
    project_ceiling: int,
    fail_over: Optional[int],
) -> Dict[str, Any]:
    total = project_total(items)
    return {
        "totalChars": total,
        "projectSoftCeiling": project_ceiling,
        "headroomChars": project_ceiling - total,
        "claudeCodeBudgetDefault": CLAUDE_CODE_BUDGET_DEFAULT,
        "softTargetSkill": DESCRIPTION_SOFT_TARGET_SKILL,
        "softTargetCommand": DESCRIPTION_SOFT_TARGET_COMMAND,
        "hardCap": DESCRIPTION_HARD_CAP,
        "counts": {
            "skills": sum(1 for i in items if i.surface == "skill"),
            "commands": sum(1 for i in items if i.surface == "command"),
            "agents": sum(1 for i in items if i.surface == "agent"),
            "total": len(items),
        },
        "items": [
            {
                "name": i.name,
                "surface": i.surface,
                "path": i.path,
                "length": i.length,
                "status": i.status,
                "softTarget": i.soft_target,
                "mirrored": len(i.mirrored_paths) if i.surface == "agent" else 1,
                "mirroredPaths": i.mirrored_paths if i.surface == "agent" else [i.path],
            }
            for i in sorted(items, key=lambda i: -i.length)
        ],
        "hardFails": [i.name for i in items if i.status == "HARD-FAIL"],
        "overSoft": [i.name for i in items if i.status == "OVER-SOFT"],
        "failOver": fail_over,
        "exitOver": (fail_over is not None and total > fail_over) or any(
            i.status == "HARD-FAIL" for i in items
        ),
    }


# ───────────────────────────────────────────────────────────────
# 4. MAIN
# ───────────────────────────────────────────────────────────────


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--repo-root",
        default=".",
        help="Repository root (default: current working directory)",
    )
    parser.add_argument(
        "--json",
        dest="json_output",
        action="store_true",
        help="Emit JSON instead of human-readable output",
    )
    parser.add_argument(
        "--top-n",
        type=int,
        default=10,
        help="How many bloated items to surface in the human report (default 10)",
    )
    parser.add_argument(
        "--fail-over",
        type=int,
        default=None,
        help=(
            "Exit non-zero when project total exceeds this many chars. "
            "Recommended: 5600 (project soft-ceiling) for CI / pre-commit."
        ),
    )
    parser.add_argument(
        "--project-ceiling",
        type=int,
        default=PROJECT_SOFT_CEILING_DEFAULT,
        help=f"Project soft-ceiling (default {PROJECT_SOFT_CEILING_DEFAULT})",
    )
    args = parser.parse_args()

    repo = Path(args.repo_root).resolve()
    items = walk_skills(repo) + walk_commands(repo) + walk_agents(repo)

    if not items:
        msg = (
            f"FAIL: zero items audited (no skills, commands, or agents found under "
            f"{repo}/.opencode/{{skills,commands,agents}}). Likely cause: misconfigured "
            f"--repo-root or stale singular paths post-rename."
        )
        if args.json_output:
            print(json.dumps({"error": msg, "items": []}, indent=2))
        else:
            print(msg, file=sys.stderr)
        sys.exit(2)

    if args.json_output:
        payload = render_json(items, args.project_ceiling, args.fail_over)
        print(json.dumps(payload, indent=2))
        sys.exit(1 if payload["exitOver"] else 0)
    else:
        print(render_human(items, args.project_ceiling, args.fail_over, args.top_n))
        total = project_total(items)
        hard = any(i.status == "HARD-FAIL" for i in items)
        over_threshold = args.fail_over is not None and total > args.fail_over
        sys.exit(1 if (hard or over_threshold) else 0)


if __name__ == "__main__":
    main()
