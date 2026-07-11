#!/usr/bin/env python3
"""Regression tests for number-agnostic catalog/playbook leaf classification + the no-new-numbers guard.

Catalog and playbook leaves are classified by their structural position (a subfolder of the
catalog/playbook root), not by an ordinal folder-name prefix. Both the legacy `NN--slug` form
and the canonical bare `slug` form must classify as the typed document; the root index file must
not; and the guard must flag any numbered category folder.
"""
import subprocess
import sys
import tempfile
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(SCRIPTS_DIR))

from validate_document import detect_document_type  # noqa: E402

GUARD = SCRIPTS_DIR / 'check_no_numbered_categories.py'
SKILL = '.opencode/skills/sk-x'


def run() -> int:
    failures = 0

    classification_cases = [
        (f'{SKILL}/feature_catalog/06--mcp-tool-surface/x.md', 'feature_catalog', 'numbered catalog leaf'),
        (f'{SKILL}/feature_catalog/mcp-tool-surface/x.md', 'feature_catalog', 'de-numbered catalog leaf'),
        (f'{SKILL}/feature_catalog/feature_catalog.md', 'readme', 'catalog root index excluded'),
        (f'{SKILL}/manual_testing_playbook/01--read-path/x.md', 'playbook_feature', 'numbered playbook leaf'),
        (f'{SKILL}/manual_testing_playbook/read-path/x.md', 'playbook_feature', 'de-numbered playbook leaf'),
        (f'{SKILL}/manual_testing_playbook/manual_testing_playbook.md', 'readme', 'playbook root index excluded'),
        (f'{SKILL}/feature_catalog/06--x/sub/deep.md', 'readme', 'deeper nesting not a leaf'),
    ]
    for path, expected, label in classification_cases:
        got = detect_document_type(path, '', {})
        if got == expected:
            print(f'PASS {label}: -> {got}')
        else:
            print(f'FAIL {label}: -> {got} (expected {expected})')
            failures += 1

    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        (root / 'feature_catalog' / 'mcp-tool-surface').mkdir(parents=True)
        (root / 'manual_testing_playbook' / 'read-path').mkdir(parents=True)
        clean = subprocess.run([sys.executable, str(GUARD), str(root)], capture_output=True, text=True)
        if clean.returncode == 0:
            print('PASS guard passes on a de-numbered tree')
        else:
            print(f'FAIL guard should pass on clean tree (exit {clean.returncode})')
            failures += 1

        (root / 'feature_catalog' / '07--new-numbered').mkdir()
        dirty = subprocess.run([sys.executable, str(GUARD), str(root)], capture_output=True, text=True)
        if dirty.returncode == 1:
            print('PASS guard fails on a freshly-created numbered category folder')
        else:
            print(f'FAIL guard should fail on numbered tree (exit {dirty.returncode})')
            failures += 1

    print('\nALL PASS' if failures == 0 else f'\n{failures} FAILED')
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(run())
