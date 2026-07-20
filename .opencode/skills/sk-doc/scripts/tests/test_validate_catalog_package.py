#!/usr/bin/env python3
"""Fixture-based test for the strict feature-catalog package validator.

Builds an isolated temp .opencode/skills tree (never reads or writes the live repo
corpus) with one fake hub (identified via hub-router.json, the same structural signal
the validator uses on the real fleet) plus the hardcoded advisor-central package, then
proves:
  - a fully clean fixture reports zero violations across all three checks
  - a seeded missing leaf (root catalog links a leaf that does not exist) is caught,
    naming the specific package and path
  - a seeded orphan leaf (a leaf file the root catalog never links) is caught by name
  - a seeded missing SOURCE FILES path is caught by name
  - a seeded off-taxonomy Type value is caught by name
  - a seeded missing root catalog (package-existence half of the bijection check) is
    caught, naming the specific package

Run: python3 test_validate_catalog_package.py
"""
import shutil
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'create-feature-catalog' / 'scripts'))
from validate_catalog_package import check_root_catalog_bijection, run_all_checks  # type: ignore  # noqa: E402

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'shared' / 'scripts'))
from validate_document import load_template_rules  # type: ignore  # noqa: E402

REAL_IMPL_PATH = '.opencode/skills/fake-hub-alpha/lib/widget.ts'


def _write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding='utf-8')


def build_clean_fixture(root: Path) -> None:
    """A minimal but structurally complete 2-package tree: one fake hub + advisor-central."""
    skills = root / '.opencode' / 'skills'

    _write(root / REAL_IMPL_PATH, '// fixture target\n')

    _write(skills / 'fake-hub-alpha' / 'hub-router.json', '{}')
    _write(
        skills / 'fake-hub-alpha' / 'feature-catalog' / 'feature-catalog.md',
        '# Fake Hub Alpha: Feature Catalog\n\n'
        '## 1. WIDGETS\n\n'
        '| Widget | Link |\n|---|---|\n'
        '| Widget A | [widget-category/widget-a.md](./widget-category/widget-a.md) |\n',
    )
    _write(
        skills / 'fake-hub-alpha' / 'feature-catalog' / 'widget-category' / 'widget-a.md',
        '# Widget A\n\n## 3. SOURCE FILES\n\n### Implementation\n\n'
        '| File | Layer | Role |\n|---|---|---|\n'
        f'| `{REAL_IMPL_PATH}` | Library | Source reference |\n\n'
        '### Validation And Tests\n\n'
        '| File | Type | Role |\n|---|---|---|\n'
        '| `tests/widget-a.vitest.ts` | Vitest | Coverage |\n',
    )

    _write(
        skills / 'system-skill-advisor' / 'feature-catalog' / 'feature-catalog.md',
        '# Skill Advisor: Feature Catalog\n\n'
        '## 1. ROUTING\n\n'
        '| Feature | Link |\n|---|---|\n'
        '| Routing A | [routing-category/routing-a.md](./routing-category/routing-a.md) |\n',
    )
    _write(
        skills / 'system-skill-advisor' / 'feature-catalog' / 'routing-category' / 'routing-a.md',
        '# Routing A\n\n## 3. SOURCE FILES\n\n### Validation And Tests\n\n'
        '| File | Type | Role |\n|---|---|---|\n'
        '| `tests/routing-a.vitest.ts` | Automated test | Coverage |\n',
    )


def _in_temp_fixture(fn):
    """Run fn(tmp_root) in a fresh temp dir seeded with the clean fixture, always cleaned up."""
    tmp = Path(tempfile.mkdtemp(prefix='catalog-package-fixture-'))
    try:
        build_clean_fixture(tmp)
        return fn(tmp)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def run() -> int:
    fails = []

    def check(name: str, cond: bool) -> None:
        print(('PASS ' if cond else 'FAIL ') + name)
        if not cond:
            fails.append(name)

    rules = load_template_rules(Path(__file__).resolve().parents[2] / 'shared' / 'scripts')

    # ---- Positive fixture: fully clean tree -> zero violations across all checks. ----
    def _clean(tmp: Path):
        return run_all_checks(tmp / '.opencode' / 'skills', tmp, rules)
    violations = _in_temp_fixture(_clean)
    check('clean fixture reports zero violations', violations == [])

    # ---- Negative: seeded missing leaf (root catalog links a leaf that does not exist). ----
    def _missing_leaf(tmp: Path):
        skills = tmp / '.opencode' / 'skills'
        root_catalog = skills / 'fake-hub-alpha' / 'feature-catalog' / 'feature-catalog.md'
        text = root_catalog.read_text(encoding='utf-8')
        text += '| Widget B | [widget-category/widget-b.md](./widget-category/widget-b.md) |\n'
        root_catalog.write_text(text, encoding='utf-8')  # widget-b.md is deliberately never created
        return check_root_catalog_bijection(skills)
    violations = _in_temp_fixture(_missing_leaf)
    missing = [v for v in violations if v['type'] == 'missing_leaf_file']
    check('seeded missing leaf is caught exactly once', len(missing) == 1)
    check('seeded missing leaf names the specific path',
          bool(missing) and missing[0]['path'] == 'widget-category/widget-b.md')
    check('seeded missing leaf names the specific package',
          bool(missing) and missing[0]['package'] == 'fake-hub-alpha')

    # ---- Negative: seeded orphan leaf (a leaf file the root catalog never links). ----
    def _orphan_leaf(tmp: Path):
        skills = tmp / '.opencode' / 'skills'
        _write(skills / 'fake-hub-alpha' / 'feature-catalog' / 'widget-category' / 'widget-orphan.md', '# Orphan Widget\n')
        return check_root_catalog_bijection(skills)
    violations = _in_temp_fixture(_orphan_leaf)
    orphans = [v for v in violations if v['type'] == 'orphan_leaf_file']
    check('seeded orphan leaf is caught exactly once', len(orphans) == 1)
    check('seeded orphan leaf names the specific path',
          bool(orphans) and orphans[0]['path'] == 'widget-category/widget-orphan.md')

    # ---- Negative: seeded missing SOURCE FILES path. ----
    def _missing_source_path(tmp: Path):
        skills = tmp / '.opencode' / 'skills'
        leaf = skills / 'fake-hub-alpha' / 'feature-catalog' / 'widget-category' / 'widget-a.md'
        text = leaf.read_text(encoding='utf-8')
        text = text.replace(
            f'| `{REAL_IMPL_PATH}` | Library | Source reference |',
            f'| `{REAL_IMPL_PATH}` | Library | Source reference |\n'
            '| `.opencode/skills/fake-hub-alpha/lib/does-not-exist.ts` | Library | Stale reference |',
        )
        leaf.write_text(text, encoding='utf-8')
        return run_all_checks(skills, tmp, rules)
    violations = _in_temp_fixture(_missing_source_path)
    missing_paths = [v for v in violations if v['type'] == 'missing_source_path']
    check('seeded missing source path is caught exactly once', len(missing_paths) == 1)
    check('seeded missing source path names the specific path',
          bool(missing_paths) and missing_paths[0]['path'] == '.opencode/skills/fake-hub-alpha/lib/does-not-exist.ts')

    # ---- Negative: seeded off-taxonomy Type value. ----
    def _off_taxonomy(tmp: Path):
        skills = tmp / '.opencode' / 'skills'
        leaf = skills / 'fake-hub-alpha' / 'feature-catalog' / 'widget-category' / 'widget-a.md'
        text = leaf.read_text(encoding='utf-8')
        text = text.replace(
            '| `tests/widget-a.vitest.ts` | Vitest | Coverage |',
            '| `tests/widget-a.vitest.ts` | Manual scenario contract | Coverage |',
        )
        leaf.write_text(text, encoding='utf-8')
        return run_all_checks(skills, tmp, rules)
    violations = _in_temp_fixture(_off_taxonomy)
    off_taxonomy = [v for v in violations if v['type'] == 'off_taxonomy_validation_type']
    check('seeded off-taxonomy Type value is caught exactly once', len(off_taxonomy) == 1)
    check('seeded off-taxonomy Type value names the specific leaf',
          bool(off_taxonomy) and off_taxonomy[0]['leaf'] == 'widget-a.md')

    # ---- Negative: seeded missing root catalog (package-existence half of bijection). ----
    def _missing_root_catalog(tmp: Path):
        skills = tmp / '.opencode' / 'skills'
        (skills / 'system-skill-advisor' / 'feature-catalog' / 'feature-catalog.md').unlink()
        return check_root_catalog_bijection(skills)
    violations = _in_temp_fixture(_missing_root_catalog)
    missing_root = [v for v in violations if v['type'] == 'missing_root_catalog']
    check('seeded missing root catalog is caught exactly once', len(missing_root) == 1)
    check('seeded missing root catalog names the advisor-central package',
          bool(missing_root) and missing_root[0]['package'] == 'system-skill-advisor')

    print(f"\n{'ALL PASS' if not fails else f'{len(fails)} FAILED'}")
    return 1 if fails else 0


if __name__ == '__main__':
    sys.exit(run())
