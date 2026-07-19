#!/usr/bin/env python3
# ---------------------------------------------------------------------------
# COMPONENT: Catalog / Playbook Root Resolver Tests
# ---------------------------------------------------------------------------
"""Unit tests for the canonical-only root resolver.

Kebab-case is the sole canonical form. These tests pin the post-migration contract: the
hyphen form resolves, a legacy underscore name is rejected (canonical_root -> None, never
matched), path matching is separator-agnostic, and resolving a physical root dir fails
closed when a legacy underscore directory is present.
"""
import sys
import tempfile
from pathlib import Path

RESOLVER_DIR = Path(__file__).resolve().parent.parent.parent / 'shared' / 'scripts'
sys.path.insert(0, str(RESOLVER_DIR))

import naming_root_resolver as r  # noqa: E402


def run() -> int:
    failures = 0

    def check(name: str, condition: bool) -> None:
        nonlocal failures
        if condition:
            print(f'PASS {name}')
        else:
            print(f'FAIL {name}')
            failures += 1

    # Canonical mapping: the hyphen form resolves; a legacy underscore name -> None.
    check('underscore catalog rejected', r.canonical_root('feature_catalog') is None)
    check('hyphen catalog -> hyphen', r.canonical_root('feature-catalog') == 'feature-catalog')
    check('underscore playbook rejected', r.canonical_root('manual_testing_playbook') is None)
    check('hyphen playbook -> hyphen', r.canonical_root('manual-testing-playbook') == 'manual-testing-playbook')
    check('non-root -> None', r.canonical_root('references') is None)

    # Membership helpers accept the canonical hyphen form only.
    check('is_catalog_root hyphen only', r.is_catalog_root('feature-catalog') and not r.is_catalog_root('feature_catalog'))
    check('is_playbook_root hyphen only', r.is_playbook_root('manual-testing-playbook') and not r.is_playbook_root('manual_testing_playbook'))
    check('is_catalog_root rejects playbook', not r.is_catalog_root('manual-testing-playbook'))

    # Path matching is separator-agnostic and segment-bounded; a legacy underscore is not a root.
    check('posix hyphen path', r.path_contains_root('.opencode/skills/x/feature-catalog/cat/leaf.md'))
    check('windows hyphen path', r.path_contains_root('x\\manual-testing-playbook\\cat\\leaf.md'))
    check('windows underscore path rejected', not r.path_contains_root('x\\feature_catalog\\cat\\leaf.md'))
    check('no false positive on references', not r.path_contains_root('x/references/y.md'))
    check('no partial-segment match', not r.path_contains_root('x/my-feature-catalogue/y.md'))

    # resolve_existing_root_dir: canonical -> that dir; neither -> None; legacy underscore -> fail closed.
    with tempfile.TemporaryDirectory() as tmp:
        parent = Path(tmp)
        check('neither root -> None', r.resolve_existing_root_dir(parent, 'catalog') is None)

        (parent / 'feature-catalog').mkdir()
        got = r.resolve_existing_root_dir(parent, 'catalog')
        check('single hyphen root resolved', got is not None and got.name == 'feature-catalog')

        (parent / 'feature_catalog').mkdir()
        raised = False
        try:
            r.resolve_existing_root_dir(parent, 'catalog')
        except r.RootCoexistenceError:
            raised = True
        check('legacy underscore root fails closed', raised)

    # Bad kind is a programming error, not a silent pass.
    bad_kind_raised = False
    try:
        r.resolve_existing_root_dir(Path('.'), 'nonsense')
    except ValueError:
        bad_kind_raised = True
    check('unknown root_kind raises', bad_kind_raised)

    print('ALL PASS' if failures == 0 else f'{failures} FAILURE(S)')
    return failures


if __name__ == '__main__':
    sys.exit(1 if run() else 0)
