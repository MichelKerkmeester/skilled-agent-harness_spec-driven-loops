#!/usr/bin/env python3
"""Guard: reject numbered category folders under feature-catalog/ and manual-testing-playbook/.

Category folders are named by meaning (e.g. `mcp-tool-surface`), not by a two-digit
ordinal prefix (`06--mcp-tool-surface`). Ordinal prefixes forced a renumber-and-relink
cascade on every insertion and bought nothing: display order is owned by the root index
table, and no consumer parses the number. This guard keeps the de-numbered form
self-enforcing so old, numbered examples cannot silently rot back in.

Exit 0 when clean, 1 when any numbered category folder is found (offenders printed).

Usage:
  check_no_numbered_categories.py [ROOT]        # ROOT defaults to .opencode/skills
  check_no_numbered_categories.py --json [ROOT]
"""
import json
import re
import sys
from pathlib import Path

# Two-digit ordinal prefix on a category folder, e.g. `06--mcp-tool-surface`.
NUMBERED_DIR = re.compile(r'^\d{2}--')

# Scan both the hyphen and underscore root forms while the naming migration is in
# flight, sourced from the shared resolver so this guard and the classifier agree on
# which roots exist. Fall back to local names if the sibling cannot be imported.
sys.path.insert(0, str(Path(__file__).resolve().parent))
from naming_root_resolver import (  # type: ignore
    ALL_ROOT_NAMES as CATEGORY_ROOTS,
    find_unsupported_root_dirs,
)


def find_numbered_category_dirs(root: Path):
    """Return sorted repo-relative paths of numbered category folders under either root kind."""
    offenders = []
    for category_root in CATEGORY_ROOTS:
        for parent in root.rglob(category_root):
            if not parent.is_dir():
                continue
            for child in parent.iterdir():
                if child.is_dir() and NUMBERED_DIR.match(child.name):
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

    offenders = find_numbered_category_dirs(root)
    rels = [str(p) for p in offenders]

    if as_json:
        print(json.dumps({'clean': not offenders, 'offenders': rels}, indent=2))
    elif offenders:
        print(f'FAIL: {len(offenders)} numbered category folder(s) found (use the bare descriptive slug):')
        for rel in rels:
            print(f'  - {rel}')
    else:
        print('PASS: no numbered category folders found.')

    return 1 if offenders else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
