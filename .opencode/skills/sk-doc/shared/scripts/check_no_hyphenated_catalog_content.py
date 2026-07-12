#!/usr/bin/env python3
"""Guard: reject hyphenated catalog and playbook content names.

Category folders and per-feature Markdown files use underscore_case so path
segments remain stable without mixing separator conventions. Root index files
are outside the check because only content below a category folder is in scope.

Exit 0 when clean, 1 when a hyphenated folder or Markdown file is found.

Usage:
  check_no_hyphenated_catalog_content.py [ROOT]
  check_no_hyphenated_catalog_content.py --json [ROOT]
"""
import json
import sys
from pathlib import Path


CATEGORY_ROOTS = ('feature_catalog', 'manual_testing_playbook')


def find_hyphenated_content(root: Path):
    """Return sorted content paths with a hyphenated folder or Markdown filename."""
    offenders = []
    for category_root in CATEGORY_ROOTS:
        for parent in root.rglob(category_root):
            if not parent.is_dir():
                continue
            for category in parent.iterdir():
                if not category.is_dir():
                    continue
                for candidate in [category, *category.rglob('*')]:
                    if candidate.is_dir() and '-' in candidate.name:
                        offenders.append(candidate)
                    elif candidate.is_file() and candidate.suffix == '.md' and '-' in candidate.name:
                        offenders.append(candidate)
    return sorted(set(offenders))


def main(argv) -> int:
    args = [argument for argument in argv if argument != '--json']
    as_json = '--json' in argv
    root = Path(args[0]) if args else Path('.opencode/skills')
    if not root.exists():
        print(f'ERROR: root not found: {root}', file=sys.stderr)
        return 2

    offenders = find_hyphenated_content(root)
    paths = [str(path) for path in offenders]
    if as_json:
        print(json.dumps({'clean': not offenders, 'offenders': paths}, indent=2))
    elif offenders:
        print(f'FAIL: {len(offenders)} hyphenated catalog/playbook content path(s) found (use underscores):')
        for offender in paths:
            print(f'  - {offender}')
    else:
        print('PASS: no hyphenated catalog/playbook content paths found.')
    return 1 if offenders else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
