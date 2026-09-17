#!/usr/bin/env python3
# ---------------------------------------------------------------------------
# COMPONENT: Catalog Content Naming Regression Test
# ---------------------------------------------------------------------------
"""Regression tests for separator-agnostic catalog/playbook leaf classification and the content-name guard.

Catalog and playbook leaves are classified by their structural position (a subfolder of the
catalog/playbook root), not by an ordinal folder-name prefix. The legacy `NN--slug`, hyphenated, and
underscore forms must classify as typed documents; the root index file must not. The content-name
guard rejects underscore catalog/playbook roots and enforces kebab-case content by default.
"""
import subprocess
import sys
import tempfile
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(SCRIPTS_DIR))

from validate_document import detect_document_type  # noqa: E402

GUARD = SCRIPTS_DIR.parent / 'shared' / 'scripts' / 'check_no_hyphenated_catalog_content.py'
SKILL = '.opencode/skills/sk-x'


def run() -> int:
    failures = 0

    classification_cases = [
        (f'{SKILL}/feature-catalog/06--mcp-tool-surface/x.md', 'feature_catalog', 'numbered catalog leaf'),
        (f'{SKILL}/feature-catalog/mcp-tool-surface/x.md', 'feature_catalog', 'de-numbered catalog leaf'),
        (f'{SKILL}/feature-catalog/mcp-tool-surface/x.md', 'feature_catalog', 'underscore catalog leaf'),
        (f'{SKILL}/feature-catalog/feature-catalog.md', 'readme', 'catalog root index excluded'),
        (f'{SKILL}/manual-testing-playbook/01--read-path/x.md', 'playbook_feature', 'numbered playbook leaf'),
        (f'{SKILL}/manual-testing-playbook/read-path/x.md', 'playbook_feature', 'de-numbered playbook leaf'),
        (f'{SKILL}/manual-testing-playbook/read_path/x.md', 'playbook_feature', 'underscore playbook leaf'),
        (f'{SKILL}/manual-testing-playbook/manual-testing-playbook.md', 'readme', 'playbook root index excluded'),
        (f'{SKILL}/feature-catalog/06--x/sub/deep.md', 'readme', 'deeper nesting not a leaf'),
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
        rejected = subprocess.run([sys.executable, str(GUARD), str(root)], capture_output=True, text=True)
        if rejected.returncode == 2:
            print('PASS guard rejects an underscore catalog/playbook root')
        else:
            print(f'FAIL guard should reject underscore root (exit {rejected.returncode})')
            failures += 1

    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        category = root / 'feature-catalog' / 'mcp-tool-surface'
        category.mkdir(parents=True)
        (category / 'new-file.md').touch()
        clean = subprocess.run([sys.executable, str(GUARD), str(root)], capture_output=True, text=True)
        if clean.returncode == 0:
            print('PASS guard accepts kebab-case content by default')
        else:
            print(f'FAIL guard should accept kebab content (exit {clean.returncode})')
            failures += 1

        (category / 'legacy_name.md').touch()
        dirty = subprocess.run([sys.executable, str(GUARD), str(root)], capture_output=True, text=True)
        if dirty.returncode == 1:
            print('PASS guard rejects underscore content by default')
        else:
            print(f'FAIL guard should reject underscore content (exit {dirty.returncode})')
            failures += 1

    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        target_category = root / 'feature-catalog' / 'mcp-tool-surface'
        target_category.mkdir(parents=True)
        (target_category / 'new-file.md').touch()
        clean = subprocess.run(
            [sys.executable, str(GUARD), '--enforce-hyphen-target', str(root)],
            capture_output=True,
            text=True,
        )
        if clean.returncode == 0:
            print('PASS target guard accepts hyphenated content')
        else:
            print(f'FAIL target guard should accept hyphenated content (exit {clean.returncode})')
            failures += 1

        (target_category / 'old_file.md').touch()
        dirty = subprocess.run(
            [sys.executable, str(GUARD), '--enforce-hyphen-target', str(root)],
            capture_output=True,
            text=True,
        )
        if dirty.returncode == 1:
            print('PASS target guard rejects underscore content')
        else:
            print(f'FAIL target guard should reject underscore content (exit {dirty.returncode})')
            failures += 1

    print('\nALL PASS' if failures == 0 else f'\n{failures} FAILED')
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(run())
