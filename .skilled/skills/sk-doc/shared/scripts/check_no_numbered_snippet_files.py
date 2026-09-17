#!/usr/bin/env python3
"""Guard: reject numbered scenario files under feature catalogs and testing playbooks.

Scenario files are named by meaning, not by a three-digit ordinal prefix. Ordinal
prefixes couple filenames to display order and force unnecessary renames when a
scenario is inserted. This guard keeps the de-numbered form self-enforcing.

Exit 0 when clean, 1 when any numbered scenario file is found (offenders printed).

Usage:
  check_no_numbered_snippet_files.py [ROOT]        # ROOT defaults to .opencode/skills
  check_no_numbered_snippet_files.py --json [ROOT]
"""
import json
import re
import sys
from pathlib import Path

# Three-digit ordinal prefix on a markdown scenario file, e.g. `001-routing.md`.
NUMBERED_SNIPPET_FILE = re.compile(r'^\d{3}-.*\.md$')

# Scan both the hyphen and underscore root forms while the naming migration is in
# flight, sourced from the shared resolver so this guard and the classifier agree on
# which roots exist. Fall back to local names if the sibling cannot be imported.
sys.path.insert(0, str(Path(__file__).resolve().parent))
from naming_root_resolver import (  # type: ignore
    ALL_ROOT_NAMES as CATEGORY_ROOTS,
    find_unsupported_root_dirs,
)


def find_numbered_snippet_files(root: Path):
    """Return sorted paths of numbered scenario files under either root kind."""
    offenders = []
    for category_root in CATEGORY_ROOTS:
        for parent in root.rglob(category_root):
            if not parent.is_dir():
                continue
            for category in parent.iterdir():
                if not category.is_dir():
                    continue
                for child in category.iterdir():
                    if child.is_file() and NUMBERED_SNIPPET_FILE.match(child.name):
                        offenders.append(child)
    return sorted(set(offenders))


def main(argv) -> int:
    args = [a for a in argv if a != '--json']
    as_json = '--json' in argv
    root = Path(args[0]) if args else Path('.opencode/skills')
    if not root.exists():
        print(f'ERROR: root not found: {root}', file=sys.stderr)
        return 2

    unsupported = find_unsupported_root_dirs(root)
    if unsupported:
        print(f'ERROR: unsupported catalog/playbook root: {unsupported[0]}', file=sys.stderr)
        return 2

    offenders = find_numbered_snippet_files(root)
    rels = [str(p) for p in offenders]

    if as_json:
        print(json.dumps({'clean': not offenders, 'offenders': rels}, indent=2))
    elif offenders:
        print(f'FAIL: {len(offenders)} numbered scenario file(s) found (remove the ordinal prefix):')
        for rel in rels:
            print(f'  - {rel}')
    else:
        print('PASS: no numbered scenario files found.')

    return 1 if offenders else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
