#!/usr/bin/env python3
"""Fixture-based test for the strict feature-catalog package validator.

Builds an isolated temp .skilled/skills tree (never reads or writes the live repo
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
  - an absent path ignored by a repository .gitignore is surfaced as a note rather than
    passing silently, while a path ignored only through .git/info/exclude is missing
  - a dangling symlink passes only when its resolved target is ignored by a repository
    .gitignore; a broken target is reported missing

Run: python3 test_validate_catalog_package.py
"""
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'sk-create-feature-catalog' / 'scripts'))
from validate_catalog_package import check_root_catalog_bijection, run_all_checks  # type: ignore  # noqa: E402

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'shared' / 'scripts'))
from validate_document import load_template_rules  # type: ignore  # noqa: E402

VALIDATOR = Path(__file__).resolve().parents[2] / 'sk-create-feature-catalog' / 'scripts' / 'validate_catalog_package.py'
REAL_IMPL_PATH = '.skilled/skills/fake-hub-alpha/lib/widget.ts'


def _write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding='utf-8')


def _init_repo(tmp: Path) -> None:
    subprocess.run(
        ['git', 'init', '-q', str(tmp)],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def _run_validator(tmp: Path) -> subprocess.CompletedProcess:
    env = dict(os.environ)
    env['PYTHONDONTWRITEBYTECODE'] = '1'
    return subprocess.run(
        [sys.executable, str(VALIDATOR),
         '--repo-root', str(tmp),
         '--skills-root', str(tmp / '.skilled' / 'skills'),
         '--package', 'fake-hub-alpha'],
        capture_output=True,
        text=True,
        check=False,
        env=env,
    )


def build_clean_fixture(root: Path) -> None:
    """A minimal but structurally complete 2-package tree: one fake hub + advisor-central."""
    skills = root / '.skilled' / 'skills'

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
        return run_all_checks(tmp / '.skilled' / 'skills', tmp, rules)
    violations = _in_temp_fixture(_clean)
    check('clean fixture reports zero violations', violations == [])

    # ---- Negative: seeded missing leaf (root catalog links a leaf that does not exist). ----
    def _missing_leaf(tmp: Path):
        skills = tmp / '.skilled' / 'skills'
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
        skills = tmp / '.skilled' / 'skills'
        _write(skills / 'fake-hub-alpha' / 'feature-catalog' / 'widget-category' / 'widget-orphan.md', '# Orphan Widget\n')
        return check_root_catalog_bijection(skills)
    violations = _in_temp_fixture(_orphan_leaf)
    orphans = [v for v in violations if v['type'] == 'orphan_leaf_file']
    check('seeded orphan leaf is caught exactly once', len(orphans) == 1)
    check('seeded orphan leaf names the specific path',
          bool(orphans) and orphans[0]['path'] == 'widget-category/widget-orphan.md')

    # ---- Negative: seeded missing SOURCE FILES path. ----
    def _missing_source_path(tmp: Path):
        skills = tmp / '.skilled' / 'skills'
        leaf = skills / 'fake-hub-alpha' / 'feature-catalog' / 'widget-category' / 'widget-a.md'
        text = leaf.read_text(encoding='utf-8')
        text = text.replace(
            f'| `{REAL_IMPL_PATH}` | Library | Source reference |',
            f'| `{REAL_IMPL_PATH}` | Library | Source reference |\n'
            '| `.skilled/skills/fake-hub-alpha/lib/does-not-exist.ts` | Library | Stale reference |',
        )
        leaf.write_text(text, encoding='utf-8')
        return run_all_checks(skills, tmp, rules)
    violations = _in_temp_fixture(_missing_source_path)
    missing_paths = [v for v in violations if v['type'] == 'missing_source_path']
    check('seeded missing source path is caught exactly once', len(missing_paths) == 1)
    check('seeded missing source path names the specific path',
          bool(missing_paths) and missing_paths[0]['path'] == '.skilled/skills/fake-hub-alpha/lib/does-not-exist.ts')

    # ---- Negative: a dead path in a two-column File table, which the template does not use. ----
    def _two_column_missing_path(tmp: Path):
        skills = tmp / '.skilled' / 'skills'
        leaf = skills / 'fake-hub-alpha' / 'feature-catalog' / 'widget-category' / 'widget-a.md'
        text = leaf.read_text(encoding='utf-8')
        text += ('\n### Related\n\n| File | Role |\n|------|------|\n'
                 '| `.skilled/commands/fake/gone.md` | Moved command |\n')
        leaf.write_text(text, encoding='utf-8')
        return run_all_checks(skills, tmp, rules)
    violations = _in_temp_fixture(_two_column_missing_path)
    two_column = [v for v in violations if v['type'] == 'missing_source_path']
    check('dead path in a two-column File table is caught',
          [v['path'] for v in two_column] == ['.skilled/commands/fake/gone.md'])

    # ---- Negative: seeded off-taxonomy Type value. ----
    def _off_taxonomy(tmp: Path):
        skills = tmp / '.skilled' / 'skills'
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
        skills = tmp / '.skilled' / 'skills'
        (skills / 'system-skill-advisor' / 'feature-catalog' / 'feature-catalog.md').unlink()
        return check_root_catalog_bijection(skills)
    violations = _in_temp_fixture(_missing_root_catalog)
    missing_root = [v for v in violations if v['type'] == 'missing_root_catalog']
    check('seeded missing root catalog is caught exactly once', len(missing_root) == 1)
    check('seeded missing root catalog names the advisor-central package',
          bool(missing_root) and missing_root[0]['package'] == 'system-skill-advisor')

    # ---- Negative-adjacent: a dangling symlink whose target is gitignored is a legitimate link. ----
    dangling_link = '.skilled/skills/fake-hub-alpha/lib/linked-build-output.ts'
    dangling_target = 'build-output-not-in-checkout.ts'

    def _dangling_symlink(tmp: Path):
        skills = tmp / '.skilled' / 'skills'
        _init_repo(tmp)
        (tmp / '.gitignore').write_text(f'{dangling_target}\n', encoding='utf-8')
        os.symlink(dangling_target, tmp / dangling_link)
        leaf = skills / 'fake-hub-alpha' / 'feature-catalog' / 'widget-category' / 'widget-a.md'
        text = leaf.read_text(encoding='utf-8')
        text = text.replace(
            f'| `{REAL_IMPL_PATH}` | Library | Source reference |',
            f'| `{REAL_IMPL_PATH}` | Library | Source reference |\n'
            f'| `{dangling_link}` | Library | Committed symlink |',
        )
        text += f'\nThe plugin entry point is `{dangling_link}`.\n'
        leaf.write_text(text, encoding='utf-8')
        return run_all_checks(skills, tmp, rules)

    violations = _in_temp_fixture(_dangling_symlink)
    dangling_findings = [v for v in violations
                         if v['type'] in {'missing_prose_path', 'missing_source_path', 'ignored_path_absent'}
                         and v.get('path') == dangling_link]
    check('dangling symlink whose target is gitignored is not reported missing', dangling_findings == [])

    # ---- Negative-adjacent: a gitignored path is deliberately uncommittable, not missing. ----
    ignored_path = '.skilled/skills/fake-hub-alpha/lib/ignored-runtime.env'
    unignored_path = '.skilled/skills/fake-hub-alpha/lib/still-missing.ts'

    def _gitignored_path(tmp: Path):
        skills = tmp / '.skilled' / 'skills'
        subprocess.run(
            ['git', 'init', '-q', str(tmp)],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        (tmp / '.gitignore').write_text(f'{ignored_path}\n', encoding='utf-8')
        leaf = skills / 'fake-hub-alpha' / 'feature-catalog' / 'widget-category' / 'widget-a.md'
        text = leaf.read_text(encoding='utf-8')
        text += f'\nRuntime flags live in `{ignored_path}`.\n'
        text += f'\nThe retired helper lived at `{unignored_path}`.\n'
        leaf.write_text(text, encoding='utf-8')
        return run_all_checks(skills, tmp, rules)

    violations = _in_temp_fixture(_gitignored_path)
    ignored_findings = [v for v in violations
                        if v['type'] in {'missing_prose_path', 'missing_source_path'}
                        and v.get('path') == ignored_path]
    check('gitignored path mentioned by a leaf is not reported missing', ignored_findings == [])
    unignored_findings = [v for v in violations
                          if v['type'] == 'missing_prose_path' and v.get('path') == unignored_path]
    check('non-ignored missing path in the same leaf is still reported', len(unignored_findings) == 1)

    # ---- Absent path under a gitignored directory: reported as a note, never a silent pass. ----
    ignored_dir = '.skilled/skills/fake-hub-alpha/lib/generated-cache/'
    ignored_typo = f'{ignored_dir}typo-never-existed.js'

    def _ignored_typo(tmp: Path):
        skills = tmp / '.skilled' / 'skills'
        _init_repo(tmp)
        (tmp / '.gitignore').write_text(f'{ignored_dir}\n', encoding='utf-8')
        leaf = skills / 'fake-hub-alpha' / 'feature-catalog' / 'widget-category' / 'widget-a.md'
        text = leaf.read_text(encoding='utf-8')
        text += f'\nCached output lives under `{ignored_typo}`.\n'
        leaf.write_text(text, encoding='utf-8')
        return run_all_checks(skills, tmp, rules), _run_validator(tmp)

    violations, completed = _in_temp_fixture(_ignored_typo)
    ignored_notes = [v for v in violations
                     if v['type'] == 'ignored_path_absent' and v.get('path') == ignored_typo]
    check('typo under a gitignored directory is reported as one ignored_path_absent note',
          len(ignored_notes) == 1)
    check('ignored_path_absent carries note severity and is not reported missing',
          bool(ignored_notes) and ignored_notes[0]['severity'] == 'note'
          and [v for v in violations if v.get('path') == ignored_typo
               and v['type'] != 'ignored_path_absent'] == [])
    check('ignored_path_absent is printed by the validator', 'ignored_path_absent' in completed.stdout)
    check('ignored_path_absent note does not change the validator exit code', completed.returncode == 0)

    # ---- A dangling symlink whose target is not ignored is still a missing path. ----
    broken_link = '.skilled/skills/fake-hub-alpha/lib/broken-build-output.ts'

    def _broken_symlink(tmp: Path):
        skills = tmp / '.skilled' / 'skills'
        _init_repo(tmp)
        (tmp / '.gitignore').write_text('unrelated-ignore-pattern/\n', encoding='utf-8')
        os.symlink('build-output-not-created.ts', tmp / broken_link)
        leaf = skills / 'fake-hub-alpha' / 'feature-catalog' / 'widget-category' / 'widget-a.md'
        text = leaf.read_text(encoding='utf-8')
        text += f'\nThe retired entry point is `{broken_link}`.\n'
        leaf.write_text(text, encoding='utf-8')
        return run_all_checks(skills, tmp, rules)

    violations = _in_temp_fixture(_broken_symlink)
    broken_findings = [v for v in violations
                       if v['type'] == 'missing_prose_path' and v.get('path') == broken_link]
    check('dangling symlink whose target is not ignored is reported missing', len(broken_findings) == 1)

    # ---- A dangling symlink whose target sits under an ignored directory stays a pass. ----
    linked_output = '.skilled/skills/fake-hub-alpha/lib/linked-dist-output.js'
    linked_target_dir = 'linked-dist/'

    def _ignored_link_target(tmp: Path):
        skills = tmp / '.skilled' / 'skills'
        _init_repo(tmp)
        (tmp / '.gitignore').write_text(f'{linked_target_dir}\n', encoding='utf-8')
        os.symlink(f'{linked_target_dir}generated.js', tmp / linked_output)
        leaf = skills / 'fake-hub-alpha' / 'feature-catalog' / 'widget-category' / 'widget-a.md'
        text = leaf.read_text(encoding='utf-8')
        text += f'\nGenerator output is linked at `{linked_output}`.\n'
        leaf.write_text(text, encoding='utf-8')
        return run_all_checks(skills, tmp, rules)

    violations = _in_temp_fixture(_ignored_link_target)
    linked_findings = [v for v in violations if v.get('path') == linked_output]
    check('dangling symlink whose target is ignored passes', linked_findings == [])

    # ---- .git/info/exclude is machine-local and never grants the exemption. ----
    local_excluded = '.skilled/skills/fake-hub-alpha/lib/local-only-overrides.env'

    def _local_exclude(tmp: Path):
        skills = tmp / '.skilled' / 'skills'
        _init_repo(tmp)
        (tmp / '.git' / 'info' / 'exclude').write_text(f'{local_excluded}\n', encoding='utf-8')
        leaf = skills / 'fake-hub-alpha' / 'feature-catalog' / 'widget-category' / 'widget-a.md'
        text = leaf.read_text(encoding='utf-8')
        text += f'\nLocal overrides live in `{local_excluded}`.\n'
        leaf.write_text(text, encoding='utf-8')
        return run_all_checks(skills, tmp, rules)

    violations = _in_temp_fixture(_local_exclude)
    local_findings = [v for v in violations
                      if v['type'] == 'missing_prose_path' and v.get('path') == local_excluded]
    check('path ignored only through .git/info/exclude is reported missing', len(local_findings) == 1)

    # ---- A negated .gitignore rule un-ignores: it never grants the exemption. ----
    negated_path = '.skilled/skills/fake-hub-alpha/lib/specs/typo-as-negated.md'

    def _negated_only(tmp: Path):
        skills = tmp / '.skilled' / 'skills'
        _init_repo(tmp)
        (tmp / '.gitignore').write_text(f'!{negated_path}\n', encoding='utf-8')
        leaf = skills / 'fake-hub-alpha' / 'feature-catalog' / 'widget-category' / 'widget-a.md'
        text = leaf.read_text(encoding='utf-8')
        text += f'\nHistorical notes live at `{negated_path}`.\n'
        leaf.write_text(text, encoding='utf-8')
        return run_all_checks(skills, tmp, rules)

    violations = _in_temp_fixture(_negated_only)
    negated_findings = [v for v in violations
                        if v['type'] == 'missing_prose_path' and v.get('path') == negated_path]
    check('path matched only by a negated .gitignore rule is reported missing', len(negated_findings) == 1)

    print(f"\n{'ALL PASS' if not fails else f'{len(fails)} FAILED'}")
    return 1 if fails else 0


if __name__ == '__main__':
    sys.exit(run())
