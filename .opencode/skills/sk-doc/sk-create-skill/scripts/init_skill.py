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
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional


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

def scaffold_benchmark_tree(skill_dir: Path, skill_name: str) -> None:
    """Create the benchmark tree a skill needs before its first measured run.

    A skill scaffolded without this gets `benchmark/` as a bare empty directory,
    so the first run has nowhere obvious to land and its results end up wherever
    the operator happened to point them. Creating the reports directory and its
    index up front means the first run has a home and a row waiting for it.

    The reports index is written in the same shape the benchmark harness appends
    to, so a scaffolded index and a harness-written one are the same document.
    """
    benchmark_dir = skill_dir / 'benchmark'
    reports_dir = benchmark_dir / 'reports'
    reports_dir.mkdir(parents=True, exist_ok=True)

    tree_index = (
        '---\n'
        f'title: "{skill_name} Benchmark Artifacts"\n'
        f'description: "Benchmark inputs and run reports for {skill_name}, kept beside the skill they measure."\n'
        'trigger_phrases:\n'
        f'  - "{skill_name} benchmark"\n'
        f'  - "{skill_name} benchmark artifacts"\n'
        'importance_tier: "important"\n'
        'contextType: "general"\n'
        '---\n'
        '\n'
        f'# {skill_name} Benchmark Artifacts\n'
        '\n'
        f'> Inputs and reports for benchmarking `{skill_name}`, kept beside the skill they measure.\n'
        '\n'
        '---\n'
        '\n'
        '## 1. OVERVIEW\n'
        '\n'
        'TODO describe what this skill is benchmarked on and by which harness.\n'
        '\n'
        '## 2. LAYOUT\n'
        '\n'
        '| Path | Contents |\n'
        '|---|---|\n'
        '| [`reports/`](./reports/) | One folder per run, indexed by `reports/README.md` |\n'
        '\n'
        '## 3. RUNNING A BENCHMARK\n'
        '\n'
        'The Lane C harness reads this skill\'s manual-testing playbook as its default corpus and\n'
        'writes a dated run folder under `reports/`:\n'
        '\n'
        '```bash\n'
        'node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs \\\n'
        f'  --skill {skill_name}\n'
        '```\n'
    )
    _write_if_absent(benchmark_dir / 'README.md', tree_index)
    _write_if_absent(reports_dir / 'README.md', empty_reports_index(skill_name))


def empty_reports_index(skill_name: str) -> str:
    """Return the empty run index, matching the harness writer byte for byte.

    Two writers produce this document: this scaffolder and the benchmark harness
    that appends rows to it. They must agree, or a scaffolded index would gain a
    second table the first time a run recorded itself.
    """
    columns = ['Executed', 'Folder', 'Runtime', 'Result', 'Verdict', 'Source']
    header = f"| {' | '.join(columns)} |"
    divider = '|' + '|'.join('---' for _ in columns) + '|'
    return '\n'.join([
        '---',
        f'title: "{skill_name} Benchmark Reports"',
        f'description: "Index of curated benchmark run reports for {skill_name}, one row per run folder."',
        'trigger_phrases:',
        f'  - "{skill_name} benchmark reports"',
        f'  - "{skill_name} benchmark index"',
        'importance_tier: "important"',
        'contextType: "general"',
        '---',
        '',
        f'# {skill_name} Benchmark Reports',
        '',
        "> Curated reports derived from completed benchmark runs, newest first. Raw execution evidence stays in the packet that produced it, named in each run's `source.md`.",
        '',
        '---',
        '',
        '## 1. OVERVIEW',
        '',
        'Each row below is one run folder. Rows are written by the benchmark harness at the moment it writes the report, so this table cannot fall behind the folders beside it.',
        '',
        '## 2. RUN INDEX',
        '',
        header,
        divider,
        '',
        '## 3. STORAGE RULE',
        '',
        'Run folders are named `<YYYY-MM-DD>--<subject>--<variant>`, dated by execution. Keep curated summaries and machine-readable result tables here, and raw transcripts and copied artifacts in the source packet. A run whose result changes gets a new folder rather than overwriting a prior one.',
        '',
        'The grammar and the report file set are owned by `create-benchmark`; this index states them only so the folder reads on its own. Where the two differ, that skill is correct.',
        '',
    ])


def scaffold_playbook_tree(skill_dir: Path, skill_name: str) -> None:
    """Create the manual-testing-playbook corpus a benchmark run reads.

    The benchmark tree is scaffolded richly while this one has been created bare
    or not at all, which is the same gap that left benchmark output with nowhere
    obvious to land: a run needs a corpus to read as much as a place to write.
    The index is created empty rather than pre-populated, because inventing
    scenarios would put untested claims in front of the first real one.
    """
    playbook_dir = skill_dir / 'manual-testing-playbook'
    playbook_dir.mkdir(parents=True, exist_ok=True)

    index = '\n'.join([
        '---',
        f'title: "{skill_name} Manual Testing Playbook"',
        f'description: "Deterministic operator scenarios for {skill_name}, and the corpus its benchmark runs score against."',
        'trigger_phrases:',
        f'  - "{skill_name} manual testing"',
        f'  - "{skill_name} playbook"',
        'importance_tier: "important"',
        'contextType: "general"',
        '---',
        '',
        f'# {skill_name} Manual Testing Playbook',
        '',
        '> Operator scenarios for this skill. This corpus is an input: a benchmark run reads it and',
        "> never rewrites it, so a later run can be compared against an earlier one.",
        '',
        '---',
        '',
        '## 1. OVERVIEW',
        '',
        'TODO state what this playbook covers and what it deliberately leaves to automated tests.',
        '',
        '## 2. SCENARIOS',
        '',
        'TODO add one category folder per area, and one file per feature inside it. Every scenario',
        'needs a deterministic prompt, an expected signal, and a pass or fail criterion another',
        'operator could apply without asking the author what was meant.',
        '',
        '## 3. RESULTS',
        '',
        'Runs land in [`../benchmark/reports/`](../benchmark/reports/), one dated folder each.',
        '`create-manual-testing-playbook` owns the scenario contract and the results-storage rules.',
        '',
    ])
    _write_if_absent(playbook_dir / 'manual-testing-playbook.md', index)


def _write_if_absent(target: Path, content: str) -> None:
    """Write a scaffold file only when nothing is there, never over real content."""
    if not target.exists():
        target.write_text(content, encoding='utf-8')


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
        Path(__file__).resolve().parent.parent
        / 'assets'
        / 'skill'
        / 'skill-scaffold-template.md'
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

    scaffold_playbook_tree(skill_dir, skill_name)
    scaffold_benchmark_tree(skill_dir, skill_name)
    print("✅ Created manual-testing-playbook/ and benchmark/reports/ with their indexes")

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


def _compiled_manifest_cli() -> Path:
    """Return the canonical compiled-routing manifest CLI path."""
    return (
        Path(__file__).resolve().parents[4]
        / 'bin'
        / 'compiled-route-manifest.cjs'
    )


def _run_manifest_command(
    action: str,
    skill_name: str,
    skill_dir: Path,
) -> tuple[bool, dict[str, Any], str]:
    """Run one canonical manifest command and parse its JSON result."""
    command = [
        'node',
        str(_compiled_manifest_cli()),
        action,
        '--hub',
        skill_name,
        '--skill-root',
        str(skill_dir),
    ]
    try:
        result = subprocess.run(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=False,
        )
    except OSError as exc:
        return False, {}, str(exc)

    try:
        payload = json.loads(result.stdout)
    except json.JSONDecodeError:
        detail = result.stderr.strip() or result.stdout.strip() or 'no output'
        return False, {}, f"invalid manifest CLI output: {detail}"

    valid = bool(payload.get('manifestValid'))
    fresh = bool(payload.get('fresh'))
    if result.returncode == 0 and valid and fresh:
        return True, payload, ''

    cause = payload.get('causeCode') or result.stderr.strip() or 'unknown failure'
    return False, payload, str(cause)


def init_parent_skill(
    skill_name: str,
    path: str,
    compiled_routing: str = 'legacy',
) -> Optional[Path]:
    """Initialize a minimal parent skill hub and its primary workflow packet."""
    if compiled_routing not in {'legacy', 'ready'}:
        print("❌ Error: compiled routing must be 'legacy' or 'ready'")
        return None

    is_valid, error_msg = validate_skill_name(skill_name)
    if not is_valid:
        print(f"❌ Error: {error_msg}")
        return None

    skill_dir = Path(path).resolve() / skill_name
    if skill_dir.exists():
        print(f"❌ Error: Skill directory already exists: {skill_dir}")
        return None

    scaffold_dir = (
        Path(__file__).resolve().parent.parent
        / 'assets'
        / 'parent-skill'
        / 'scaffold'
    )
    hub_template_path = scaffold_dir / 'hub-skill-scaffold.md'
    packet_template_path = scaffold_dir / 'packet-skill-scaffold.md'
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
        (skill_dir / 'changelog').mkdir()
        scaffold_playbook_tree(skill_dir, skill_name)
        scaffold_benchmark_tree(skill_dir, skill_name)
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

    if compiled_routing == 'ready':
        minted, mint_result, mint_error = _run_manifest_command(
            'mint',
            skill_name,
            skill_dir,
        )
        if not minted:
            manifest_path = mint_result.get('manifestPath', 'UNKNOWN')
            print(
                "❌ Compiled routing manifest mint failed; "
                f"legacy fallback retained ({mint_error}, {manifest_path})"
            )
            return None

        fresh, freshness_result, freshness_error = _run_manifest_command(
            'freshness',
            skill_name,
            skill_dir,
        )
        if not fresh:
            manifest_path = freshness_result.get(
                'manifestPath',
                mint_result.get('manifestPath', 'UNKNOWN'),
            )
            print(
                "❌ Compiled routing freshness validation failed; "
                f"legacy fallback retained ({freshness_error}, {manifest_path})"
            )
            return None

        print(
            "✅ Compiled routing: compiled-ready "
            f"(fresh manifest verified at {freshness_result['manifestPath']})"
        )
    else:
        _fresh, manifest_result, manifest_error = _run_manifest_command(
            'freshness',
            skill_name,
            skill_dir,
        )
        if manifest_error != 'missing-manifest':
            manifest_path = manifest_result.get('manifestPath', 'UNKNOWN')
            print(
                "❌ Legacy-by-construction requires no canonical manifest; "
                f"reconcile the existing state ({manifest_error}, {manifest_path})"
            )
            return None
        print("✅ Compiled routing: legacy (no manifest)")

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
    parser.add_argument(
        '--compiled-routing',
        choices=['legacy', 'ready'],
        default=None,
        help=(
            "Parent-hub compiled routing state (default: legacy). 'ready' only mints "
            "a fresh activation manifest (generation 1, servingAuthority='legacy', "
            "shadowOnly=true) as onboarding evidence -- it does NOT make the hub "
            "compiled-serving. The hub still needs its own shadow-child router built "
            "to route == legacy and pass Lane C parity before it can join the "
            "runtime's compiled-serving cohort; see "
            "references/parent-skill/compiled-routing-architecture.md."
        ),
    )
    args = parser.parse_args()

    skill_name = args.skill_name
    path = args.path

    print(f"🚀 Initializing skill: {skill_name}")
    print(f"   Location: {path}")
    print()

    if args.compiled_routing is not None and args.kind != 'parent':
        parser.error('--compiled-routing is only valid with --kind parent')

    if args.kind == 'parent':
        result = init_parent_skill(
            skill_name,
            path,
            compiled_routing=args.compiled_routing or 'legacy',
        )
    else:
        result = init_skill(skill_name, path)

    if result:
        sys.exit(0)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
