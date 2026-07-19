#!/usr/bin/env python3
"""Fail-closed matrix for catalog and playbook filesystem consumers."""
import importlib.util
import re
import subprocess
import sys
import tempfile
from pathlib import Path

TEST_DIR = Path(__file__).resolve().parent
SK_DOC = TEST_DIR.parents[1]
REPO = TEST_DIR.parents[4]
SHARED = SK_DOC / 'shared' / 'scripts'
CREATE_SKILL = SK_DOC / 'create-skill' / 'scripts'
MANIFEST = REPO / '.opencode' / 'specs' / 'sk-doc' / '020-hyphen-naming-convention' / '002-root-name-consumer-migration' / 'manifest' / 'consumer-manifest.md'
JS_MATRIX = TEST_DIR / 'test-root-name-consumer-matrix.cjs'

sys.path.insert(0, str(SHARED))
sys.path.insert(0, str(CREATE_SKILL))

from naming_root_resolver import (  # noqa: E402
    RootCoexistenceError,
    UnsupportedRootError,
    assert_supported_root_path,
    canonical_root,
    path_contains_root,
    resolve_existing_root_dir,
)
from validate_document import detect_document_type  # noqa: E402
from package_skill import validate_skill  # noqa: E402

SKILL_FAMILIES = (
    'sk-doc',
    'sk-code',
    'sk-design',
    'sk-prompt',
    'mcp-code-mode',
    'mcp-tooling',
    'system-code-graph',
    'system-deep-loop',
    'system-skill-advisor',
    'system-spec-kit',
    'cli-external-orchestration',
)


def load_guard(name: str):
    path = SHARED / name
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def manifest_work_rows():
    rows = set()
    for line in MANIFEST.read_text(encoding='utf-8').splitlines():
        match = re.match(r'\| (\d+) \|', line)
        if match and int(match.group(1)) <= 14 and int(match.group(1)) != 10:
            rows.add(int(match.group(1)))
    return rows


def run() -> int:
    failures = 0
    passes = 0

    def check(label, fn):
        nonlocal failures, passes
        try:
            fn()
            passes += 1
            print(f'PASS {label}')
        except Exception as error:
            failures += 1
            print(f'FAIL {label}: {error}')

    def classifier_parity():
        for family in SKILL_FAMILIES:
            posix_old = f'.opencode/skills/{family}/feature-catalog/routing/route.md'
            posix_new = f'.opencode/skills/{family}/feature-catalog/routing/route.md'
            windows_old = posix_old.replace('/', '\\')
            windows_new = posix_new.replace('/', '\\')
            results = {detect_document_type(value, '', {}) for value in (posix_old, posix_new, windows_old, windows_new)}
            if results != {'feature_catalog'}:
                raise AssertionError(f'{family}: {results}')

    check('classifier typed parity across all active skill families and separators', classifier_parity)

    def classifier_refuses():
        try:
            detect_document_type('.opencode/skills/sk-doc/feature_catalog_v2/routing/route.md', '', {})
        except UnsupportedRootError:
            return
        raise AssertionError('unsupported root reached document classification')

    check('classifier refuses unsupported roots before readme fallback', classifier_refuses)
    check('resolver canonicalizes the hyphen form and rejects underscore aliases', lambda: (
        canonical_root('feature-catalog') == 'feature-catalog'
        and canonical_root('manual-testing-playbook') == 'manual-testing-playbook'
        and canonical_root('feature_catalog') is None
        and canonical_root('manual_testing_playbook') is None
    ) or (_ for _ in ()).throw(AssertionError('canonical parity failed')))
    check('resolver matches canonical roots on POSIX and Windows separators, not underscore', lambda: (
        path_contains_root('/x/feature-catalog/y.md')
        and path_contains_root(r'C:\\x\\manual-testing-playbook\\y.md')
        and not path_contains_root(r'C:\\x\\manual_testing_playbook\\y.md')
    ) or (_ for _ in ()).throw(AssertionError('separator match failed')))

    def resolver_refuses_unsupported():
        try:
            assert_supported_root_path(r'C:\\x\\manual_testing_playbook_v2\\y.md')
        except UnsupportedRootError:
            return
        raise AssertionError('unsupported Windows root was accepted')

    check('resolver refuses unsupported Windows roots', resolver_refuses_unsupported)

    def coexistence(kind):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            names = ('feature-catalog', 'feature_catalog') if kind == 'catalog' else ('manual-testing-playbook', 'manual_testing_playbook')
            for name in names:
                (root / name).mkdir()
            try:
                resolve_existing_root_dir(root, kind)
            except RootCoexistenceError:
                return
            raise AssertionError(f'{kind} coexistence was accepted')

    check('resolver rejects coexisting catalog roots', lambda: coexistence('catalog'))
    check('resolver rejects coexisting playbook roots', lambda: coexistence('playbook'))

    def packager_refuses():
        with tempfile.TemporaryDirectory() as temp:
            skill = Path(temp)
            (skill / 'feature_catalog_v2').mkdir()
            valid, message, _warnings = validate_skill(skill)
            if valid or 'Unsupported catalog/playbook root' not in message:
                raise AssertionError((valid, message))

    check('packager refuses unsupported roots before packaging', packager_refuses)

    for filename, label in (
        ('check_no_hyphenated_catalog_content.py', 'inverse guard'),
        ('check_no_numbered_categories.py', 'category guard'),
        ('check_no_numbered_snippet_files.py', 'snippet guard'),
    ):
        module = load_guard(filename)

        def guard_refuses(module=module):
            with tempfile.TemporaryDirectory() as temp:
                root = Path(temp)
                (root / 'manual_testing_playbook_v2').mkdir()
                if module.main([str(root)]) != 2:
                    raise AssertionError('unsupported root did not produce exit 2')

        check(f'{label} refuses unsupported roots before discovery', guard_refuses)

    js = subprocess.run(['node', str(JS_MATRIX)], cwd=REPO, capture_output=True, text=True)
    print(js.stdout, end='')
    if js.returncode != 0:
        print(js.stderr, end='', file=sys.stderr)
        failures += 1
    else:
        match_pass = re.search(r'JS_MATRIX_PASS=(\d+)', js.stdout)
        match_rows = re.search(r'MATRIX_ROWS=([0-9,]+)', js.stdout)
        if not match_pass or not match_rows:
            print('FAIL JS matrix did not report its pass count and rows')
            failures += 1
        else:
            passes += int(match_pass.group(1))
            covered = {1, 5, 11, 12, 13} | {int(value) for value in match_rows.group(1).split(',')}
            expected = manifest_work_rows()
            if covered != expected:
                print(f'FAIL manifest row coverage: covered={sorted(covered)} expected={sorted(expected)}')
                failures += 1
            else:
                passes += 1
                print(f'PASS manifest-derived filesystem row coverage {len(covered)}/{len(expected)}')

    print(f'PY_JS_MATRIX_PASS={passes}')
    print('ALL PASS' if failures == 0 else f'{failures} FAILED')
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(run())
