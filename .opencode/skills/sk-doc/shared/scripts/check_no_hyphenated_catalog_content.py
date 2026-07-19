#!/usr/bin/env python3
# ---------------------------------------------------------------------------
# COMPONENT: Catalog Content Naming Guard
# ---------------------------------------------------------------------------
"""Enforce kebab-case for catalog and playbook content.

Category folders and per-feature Markdown files must use kebab-case, matching the
repo-wide filesystem-naming convention; an underscore in a content name is a
violation. Root index files are outside the check because only content below a
category folder is in scope. An underscore catalog/playbook ROOT is a hard error
(the canonical roots are hyphenated) and is rejected before content is scanned.

Usage:
  check_no_hyphenated_catalog_content.py [ROOT]
  check_no_hyphenated_catalog_content.py --json [ROOT]

The historical --enforce-hyphen-target flag is accepted for backward
compatibility but is now the default behavior.
"""
import json
import sys
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parent))
from naming_root_resolver import ALL_ROOT_NAMES, find_unsupported_root_dirs  # type: ignore


def find_underscored_content(root: Path):
    """Return catalog/playbook content paths whose folder or Markdown name uses an underscore."""
    offenders = []
    for category_root in ALL_ROOT_NAMES:
        for parent in root.rglob(category_root):
            if not parent.is_dir():
                continue
            for category in parent.iterdir():
                if not category.is_dir():
                    continue
                for candidate in [category, *category.rglob('*')]:
                    if candidate.is_dir() and '_' in candidate.name:
                        offenders.append(candidate)
                    elif candidate.is_file() and candidate.suffix == '.md' and '_' in candidate.name:
                        offenders.append(candidate)
    return sorted(set(offenders))


def main(argv) -> int:
    # --enforce-hyphen-target is accepted but inert: enforcing kebab content is now the default.
    flags = {'--json', '--enforce-hyphen-target'}
    args = [argument for argument in argv if argument not in flags]
    as_json = '--json' in argv
    root = Path(args[0]) if args else Path('.opencode/skills')
    if not root.exists():
        print(f'ERROR: root not found: {root}', file=sys.stderr)
        return 2

    unsupported = find_unsupported_root_dirs(root)
    if unsupported:
        print(f'ERROR: unsupported catalog/playbook root: {unsupported[0]}', file=sys.stderr)
        return 2

    offenders = find_underscored_content(root)
    paths = [str(path) for path in offenders]
    if as_json:
        print(json.dumps({'clean': not offenders, 'offenders': paths}, indent=2))
    elif offenders:
        print(f'FAIL: {len(offenders)} underscore catalog/playbook content path(s) found (use kebab-case):')
        for offender in paths:
            print(f'  - {offender}')
    else:
        print('PASS: catalog/playbook content is kebab-case.')
    return 1 if offenders else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
