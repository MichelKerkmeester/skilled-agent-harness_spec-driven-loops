#!/usr/bin/env python3
# ───────────────────────────────────────────────
# COMPONENT: SKILL PACKAGE VALIDATOR
# ───────────────────────────────────────────────

"""Run the completion checks required for a standalone skill or parent hub."""

import argparse
import json
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Optional


COMPILED_ROUTING_MARKERS = (
    'Compiled routing (opt-in, flag-gated, additive).',
    'node .opencode/bin/compiled-route.cjs --hub',
    'servingAuthority":"legacy',
    'off by default',
)


def find_opencode_root(script_path: Path) -> Optional[Path]:
    """Find the enclosing .opencode directory for this script."""
    for parent in script_path.parents:
        if parent.name == '.opencode':
            return parent
    return None


def run_check(name: str, command: List[str]) -> Dict[str, object]:
    """Run one completion check and retain its combined output."""
    try:
        result = subprocess.run(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            check=False,
        )
    except OSError as error:
        return {
            'name': name,
            'exit': 127,
            'ok': False,
            'output': str(error),
        }

    return {
        'name': name,
        'exit': result.returncode,
        'ok': result.returncode == 0,
        'output': result.stdout,
    }


def check_compiled_routing_state(
    skill_path: Path,
    opencode_root: Optional[Path],
) -> Dict[str, object]:
    """Verify the generated directive and canonical manifest readiness state."""
    skill_md = skill_path / 'SKILL.md'
    try:
        skill_content = skill_md.read_text(encoding='utf-8')
    except (OSError, UnicodeError) as error:
        return {
            'name': 'compiled routing readiness',
            'exit': 1,
            'ok': False,
            'output': str(error),
        }

    missing_markers = [
        marker for marker in COMPILED_ROUTING_MARKERS if marker not in skill_content
    ]
    if missing_markers:
        return {
            'name': 'compiled routing readiness',
            'exit': 1,
            'ok': False,
            'output': f"Missing directive markers: {', '.join(missing_markers)}",
        }

    manifest_cli = (
        opencode_root / 'bin' / 'compiled-route-manifest.cjs'
        if opencode_root
        else None
    )
    if manifest_cli is None or not manifest_cli.is_file():
        return {
            'name': 'compiled routing readiness',
            'exit': 1,
            'ok': False,
            'output': f'Manifest CLI not found: {manifest_cli or "UNKNOWN"}',
        }

    try:
        result = subprocess.run(
            [
                'node',
                str(manifest_cli),
                'freshness',
                '--hub',
                skill_path.name,
                '--skill-root',
                str(skill_path.resolve()),
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=False,
        )
    except OSError as error:
        return {
            'name': 'compiled routing readiness',
            'exit': 127,
            'ok': False,
            'output': str(error),
        }
    try:
        payload = json.loads(result.stdout)
    except json.JSONDecodeError:
        detail = result.stderr.strip() or result.stdout.strip() or 'no output'
        return {
            'name': 'compiled routing readiness',
            'exit': 1,
            'ok': False,
            'output': f'Invalid manifest CLI output: {detail}',
        }

    cause = payload.get('causeCode')
    if cause == 'missing-manifest':
        return {
            'name': 'compiled routing readiness: legacy (no manifest)',
            'exit': 0,
            'ok': True,
            'output': result.stdout,
        }
    if (
        result.returncode == 0
        and payload.get('manifestValid') is True
        and payload.get('fresh') is True
    ):
        return {
            'name': 'compiled routing readiness: compiled-ready',
            'exit': 0,
            'ok': True,
            'output': result.stdout,
        }

    return {
        'name': 'compiled routing readiness',
        'exit': result.returncode or 1,
        'ok': False,
        'output': result.stdout or result.stderr or str(cause),
    }


def output_tail(output: str, line_count: int = 20) -> str:
    """Return the final lines of a failed check's output."""
    return '\n'.join(output.rstrip().splitlines()[-line_count:])


def print_report(skill_path: Path, kind: str, checks: List[Dict[str, object]]) -> None:
    """Print the human-readable completion report."""
    print(f"Skill: {skill_path}")
    print(f"Detected kind: {kind}")
    for check in checks:
        status = 'PASS' if check['ok'] else 'FAIL'
        print(f"- {check['name']}: {status} (exit {check['exit']})")
        if not check['ok']:
            tail = output_tail(str(check['output']))
            print("  Output tail:")
            if tail:
                for line in tail.splitlines():
                    print(f"    {line}")
            else:
                print("    (no output)")


def main() -> int:
    """Dispatch completion checks based on the target skill kind."""
    parser = argparse.ArgumentParser(
        description="Validate a standalone skill or parent hub package."
    )
    parser.add_argument('skill_path', help="Path to the skill folder")
    parser.add_argument(
        '--strict',
        action='store_true',
        help="Promote contract warnings, including noncanonical generated paths",
    )
    parser.add_argument(
        '--json',
        action='store_true',
        help="Emit the aggregate result as JSON",
    )
    args = parser.parse_args()

    skill_path = Path(args.skill_path)
    script_path = Path(__file__).resolve()
    package_skill = Path(__file__).parent / 'package_skill.py'
    kind = 'parent' if (skill_path / 'mode-registry.json').exists() else 'standalone'

    package_command = [
        sys.executable,
        str(package_skill),
        str(skill_path),
        '--check',
    ]
    if args.strict:
        package_command.append('--strict')

    package_check_name = (
        'package_skill.py --check --strict'
        if args.strict
        else 'package_skill.py --check'
    )
    checks = [run_check(package_check_name, package_command)]
    missing_checker_error = None

    if kind == 'parent':
        opencode_root = find_opencode_root(script_path)
        checks.append(check_compiled_routing_state(skill_path, opencode_root))
        parent_checker = (
            opencode_root / 'commands' / 'doctor' / 'scripts' / 'parent-skill-check.cjs'
            if opencode_root
            else None
        )
        if parent_checker is None or not parent_checker.is_file():
            expected = (
                str(parent_checker)
                if parent_checker
                else "the repository's .opencode/commands/doctor/scripts/parent-skill-check.cjs"
            )
            missing_checker_error = f"Parent skill checker not found: {expected}"
            checks.append({
                'name': 'parent-skill-check.cjs',
                'exit': 1,
                'ok': False,
                'output': missing_checker_error,
            })
        else:
            checks.append(run_check(
                'parent-skill-check.cjs',
                ['node', str(parent_checker), str(skill_path)],
            ))

    valid = all(bool(check['ok']) for check in checks)

    if args.json:
        if missing_checker_error:
            print(missing_checker_error, file=sys.stderr)
        payload = {
            'skill': str(skill_path),
            'kind': kind,
            'checks': [
                {
                    'name': check['name'],
                    'exit': check['exit'],
                    'ok': check['ok'],
                }
                for check in checks
            ],
            'valid': valid,
        }
        print(json.dumps(payload))
    else:
        print_report(skill_path, kind, checks)

    return 0 if valid else 1


if __name__ == '__main__':
    sys.exit(main())
