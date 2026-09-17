#!/usr/bin/env python3
"""Paired fixture and exit-contract tests for the catalog package validator."""

import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

SCRIPT_ROOT = Path(__file__).resolve().parents[1]
VALIDATOR = SCRIPT_ROOT / 'validate_catalog_package.py'
FIXTURES = SCRIPT_ROOT / 'fixtures'
SHARED_SCRIPTS = SCRIPT_ROOT.parents[1] / 'shared' / 'scripts'
sys.path.insert(0, str(SCRIPT_ROOT))
sys.path.insert(0, str(SHARED_SCRIPTS))

from validate_catalog_package import (  # noqa: E402
    check_discovery_coverage,
    check_packet_history,
    check_phantom_rows,
    check_prose_paths,
    check_root_catalog_bijection,
    check_root_leaf_parity,
    check_shipped_labels,
    expected_root_packages,
)


def _copy_fixture(tmp: Path, rule: str, variant: str, filename: str, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(FIXTURES / rule / variant / filename, destination)


def _catalog(tmp: Path, name: str = 'fixture') -> tuple[Path, Path, Path]:
    package = tmp / '.opencode' / 'skills' / name
    catalog = package / 'feature-catalog'
    catalog.mkdir(parents=True)
    return tmp, package, catalog


def _run_validator(tmp: Path, *args: str) -> subprocess.CompletedProcess[str]:
    env = dict(os.environ)
    env['PYTHONDONTWRITEBYTECODE'] = '1'
    return subprocess.run(
        [sys.executable, str(VALIDATOR), '--repo-root', str(tmp), '--skills-root', str(tmp / '.opencode' / 'skills'), *args],
        check=False,
        capture_output=True,
        text=True,
        env=env,
    )


def run() -> int:
    failures = []

    def check(name: str, condition: bool) -> None:
        print(('PASS ' if condition else 'FAIL ') + name)
        if not condition:
            failures.append(name)

    with tempfile.TemporaryDirectory(prefix='catalog-validator-fixtures-') as tmp_name:
        tmp = Path(tmp_name)

        _, _, catalog = _catalog(tmp)
        root = catalog / 'feature-catalog.md'
        _copy_fixture(tmp, 'phantom-row', 'positive', 'feature-catalog.md', root)
        check('phantom positive passes', check_phantom_rows('fixture', root) == [])
        _copy_fixture(tmp, 'phantom-row', 'negative', 'feature-catalog.md', root)
        phantom = check_phantom_rows('fixture', root)
        check('phantom negative fails', len(phantom) == 1 and phantom[0]['type'] == 'phantom_root_row')

        _, _, catalog = _catalog(tmp / 'prose')
        (tmp / 'prose' / '.opencode' / 'skills' / 'fixture' / 'implementation.py').parent.mkdir(parents=True, exist_ok=True)
        (tmp / 'prose' / '.opencode' / 'skills' / 'fixture' / 'implementation.py').write_text('fixture\n', encoding='utf-8')
        leaf = catalog / 'category' / 'leaf.md'
        _copy_fixture(tmp, 'prose-path', 'positive', 'leaf.md', leaf)
        check('prose path positive passes', check_prose_paths('fixture', catalog, tmp / 'prose') == [])
        _copy_fixture(tmp, 'prose-path', 'negative', 'leaf.md', leaf)
        prose = check_prose_paths('fixture', catalog, tmp / 'prose')
        check('prose path negative fails', len(prose) == 1 and prose[0]['type'] == 'missing_prose_path')

        for rule, expected_type in (
            ('title-parity', 'root_leaf_title_mismatch'),
            ('description-parity', 'root_leaf_description_mismatch'),
        ):
            _, _, catalog = _catalog(tmp / rule)
            root = catalog / 'feature-catalog.md'
            leaf = catalog / 'feature-one.md'
            _copy_fixture(tmp, rule, 'positive', 'feature-catalog.md', root)
            _copy_fixture(tmp, rule, 'positive', 'leaf.md', leaf)
            check(f'{rule} positive passes', check_root_leaf_parity('fixture', catalog, root) == [])
            _copy_fixture(tmp, rule, 'negative', 'feature-catalog.md', root)
            _copy_fixture(tmp, rule, 'negative', 'leaf.md', leaf)
            parity = check_root_leaf_parity('fixture', catalog, root)
            check(f'{rule} negative fails', any(v['type'] == expected_type for v in parity))

        for rule, checker, expected_type in (
            ('packet-history', check_packet_history, 'packet_history_metadata'),
            ('shipped-label', check_shipped_labels, 'shipped_without_source_files'),
        ):
            _, _, catalog = _catalog(tmp / rule)
            leaf = catalog / 'feature.md'
            _copy_fixture(tmp, rule, 'positive', 'leaf.md', leaf)
            check(f'{rule} positive passes', checker('fixture', catalog) == [])
            _copy_fixture(tmp, rule, 'negative', 'leaf.md', leaf)
            findings = checker('fixture', catalog)
            check(f'{rule} negative fails', any(v['type'] == expected_type for v in findings))

        _, _, catalog = _catalog(tmp / 'volatile')
        leaf = catalog / 'feature.md'
        _copy_fixture(tmp, 'volatile-value', 'positive', 'leaf.md', leaf)
        check('volatile value positive passes', check_prose_paths('fixture', catalog, tmp / 'volatile') == [])
        _copy_fixture(tmp, 'volatile-value', 'negative', 'leaf.md', leaf)
        volatile = check_prose_paths('fixture', catalog, tmp / 'volatile')
        check('volatile value negative fails', any(v['type'] == 'volatile_measurement_snapshot' for v in volatile))

        _, package, catalog = _catalog(tmp / 'coverage', 'new-surface')
        packages = expected_root_packages(tmp / 'coverage' / '.opencode' / 'skills')
        check('presence discovery sees new catalog package', [p['name'] for p in packages] == ['new-surface'])
        check('coverage assertion catches an unruled present package',
              any(v['type'] == 'unruled_catalog_package'
                  for v in check_discovery_coverage(tmp / 'coverage' / '.opencode' / 'skills', [])))
        root = catalog / 'FEATURE-CATALOG.md'
        root.write_text('[Feature](category/feature.md)\n', encoding='utf-8')
        leaf = catalog / 'category' / 'feature.md'
        leaf.parent.mkdir()
        leaf.write_text('# Feature\n', encoding='utf-8')
        check('case-folded root/link matching passes', check_root_catalog_bijection(
            tmp / 'coverage' / '.opencode' / 'skills', packages) == [])

        clean_root = tmp / 'exit' / '.opencode' / 'skills' / 'clean' / 'feature-catalog'
        clean_root.mkdir(parents=True)
        (clean_root / 'feature-catalog.md').write_text('# Clean\n', encoding='utf-8')
        clean = _run_validator(tmp / 'exit', '--package', 'clean')
        check('clean package exits zero', clean.returncode == 0)

        green_root = tmp / 'exit' / '.opencode' / 'skills' / 'green' / 'feature-catalog'
        green_root.mkdir(parents=True)
        (green_root / 'feature-catalog.md').write_text(
            '| Feature | Link |\n|---|---|\n| Missing | [missing.md](missing.md) |\n',
            encoding='utf-8',
        )
        green = _run_validator(tmp / 'exit', '--package', 'green')
        check('promoted package fails closed by default', green.returncode == 1 and 'PACKAGE green: FAIL' in green.stdout)
        report_only = _run_validator(tmp / 'exit', '--package', 'green', '--report-only')
        check('report-only preserves zero exit', report_only.returncode == 0)

        backlog_root = tmp / 'exit' / '.opencode' / 'skills' / 'system-spec-kit' / 'feature-catalog'
        backlog_root.mkdir(parents=True)
        (backlog_root / 'feature-catalog.md').write_text('# Backlog\n', encoding='utf-8')
        (backlog_root / 'category').mkdir()
        (backlog_root / 'category' / 'orphan.md').write_text('# Orphan\n', encoding='utf-8')
        backlog = _run_validator(tmp / 'exit', '--package', 'system-spec-kit')
        check('backlog package reports WARN and exits zero', backlog.returncode == 0 and 'PACKAGE system-spec-kit: WARN' in backlog.stdout)

        first = _run_validator(tmp / 'exit', '--package', 'clean', '--json')
        second = _run_validator(tmp / 'exit', '--package', 'clean', '--json')
        check('JSON output is deterministic', first.returncode == 0 and first.stdout == second.stdout)

    print(f"\n{'ALL PASS' if not failures else f'{len(failures)} FAILED'}")
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(run())
