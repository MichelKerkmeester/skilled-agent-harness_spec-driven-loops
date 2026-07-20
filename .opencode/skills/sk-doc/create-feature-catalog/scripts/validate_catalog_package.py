#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: FEATURE-CATALOG STRICT PACKAGE VALIDATOR
# ───────────────────────────────────────────────────────────────

"""Strict package-level validator for sk-doc feature catalogs.

Proves three things `validate_document.py`'s single-file scope cannot, because each
needs cross-file or cross-directory state:

  (a) Root<->leaf bijection for the router/advisor-central package plus the mode-hub
      root packages: every leaf `.md` file under a package's `feature-catalog/` tree is
      linked from that package's root `feature-catalog.md`, and every `.md` link the
      root catalog makes resolves to a real leaf file on disk. Zero orphans either way.
  (b) Every SOURCE FILES table row's File path exists on disk (best-effort: a bare
      repo-root-relative path is checked directly; a prose cell with an embedded
      markdown link is checked relative to the leaf file's own directory; placeholder
      em-dash rows and unparseable prose are skipped, matching
      `validate_document.py`'s own placeholder-skip convention).
  (c) Every "Validation And Tests" Type-column value is a member of the canonical
      taxonomy, by re-running `validate_document.py`'s own `validate_feature_catalog_table`
      check (the taxonomy stays single-sourced in `template-rules.json`; this script
      never redefines it).

This is a reportable check, not a wired gate: by default every run exits 0 and just
prints findings, matching the fleet's current reality (most hub root catalogs do not
exist yet, which is a real, already-tracked gap this validator can report but does not
own fixing). Pass --strict to make it exit non-zero when any violation is found.

Usage:
  validate_catalog_package.py [--skills-root PATH] [--repo-root PATH] [--strict] [--json]
"""

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, Iterator, List, Optional, Tuple

_SHARED_SCRIPTS = Path(__file__).resolve().parents[2] / 'shared' / 'scripts'
sys.path.insert(0, str(_SHARED_SCRIPTS))
from validate_document import load_template_rules, validate_feature_catalog_table  # type: ignore  # noqa: E402
from naming_root_resolver import CATALOG_ROOT_NAMES  # type: ignore  # noqa: E402

# ───────────────────────────────────────────────────────────────
# 1. CONSTANTS
# ───────────────────────────────────────────────────────────────

# system-skill-advisor is the routing brain itself ("router/advisor-central"), the one
# non-hub package this bijection check covers alongside the mode hubs. It carries no
# hub-router.json of its own (it is not itself a mode hub), so it is named explicitly
# rather than discovered structurally the way hubs are.
ADVISOR_CENTRAL_NAME = 'system-skill-advisor'

CATALOG_DIRNAME = CATALOG_ROOT_NAMES[0]  # 'feature-catalog'
ROOT_CATALOG_FILENAME = 'feature-catalog.md'

DASH_VALUES = {'—', '-', '–', ''}

MD_LINK_RE = re.compile(r'\]\(([^)]+)\)')
BARE_PATH_HINT_RE = re.compile(r'\.[A-Za-z0-9]{1,8}$')

# ───────────────────────────────────────────────────────────────
# 2. PACKAGE DISCOVERY
# ───────────────────────────────────────────────────────────────


def discover_hub_names(skills_root: Path) -> List[str]:
    """Hubs are skill dirs carrying their own hub-router.json (the mode-dispatch manifest)."""
    if not skills_root.exists():
        return []
    return sorted(p.parent.name for p in skills_root.glob('*/hub-router.json'))


def expected_root_packages(skills_root: Path) -> List[Dict[str, str]]:
    """The closed set this validator checks: router/advisor-central + the mode hubs."""
    packages = [{'name': ADVISOR_CENTRAL_NAME, 'role': 'advisor-central'}]
    packages += [{'name': name, 'role': 'hub'} for name in discover_hub_names(skills_root)]
    return packages


# ───────────────────────────────────────────────────────────────
# 3. CHECK (a): ROOT<->LEAF BIJECTION
# ───────────────────────────────────────────────────────────────


def _extract_md_links(text: str) -> List[str]:
    """Every markdown link target ending in .md, excluding http(s) URLs."""
    return [
        target for target in MD_LINK_RE.findall(text)
        if target.endswith('.md') and not target.startswith(('http://', 'https://'))
    ]


def check_root_leaf_bijection(package_name: str, catalog_dir: Path, root_catalog_path: Path) -> List[Dict[str, Any]]:
    """Bijection between a root catalog's .md links and the leaf files that exist on disk."""
    violations: List[Dict[str, Any]] = []
    catalog_dir = catalog_dir.resolve()
    root_catalog_path = root_catalog_path.resolve()

    text = root_catalog_path.read_text(encoding='utf-8')
    linked_targets = {(root_catalog_path.parent / raw).resolve() for raw in _extract_md_links(text)}

    leaf_files = {p.resolve() for p in catalog_dir.rglob('*.md') if p.resolve() != root_catalog_path}

    # Direction 1: the root catalog links a leaf that does not exist on disk.
    for target in sorted(linked_targets - leaf_files):
        if target.exists():
            continue  # resolves to something real outside this catalog package; not this check's concern
        try:
            rel = target.relative_to(catalog_dir)
        except ValueError:
            continue  # dangling link points entirely outside this catalog package
        violations.append({
            'type': 'missing_leaf_file',
            'package': package_name,
            'path': str(rel),
            'message': f"{package_name}: root catalog links a leaf file that does not exist on disk: {rel}",
        })

    # Direction 2: a real leaf file that no root-catalog link references.
    for leaf in sorted(leaf_files - linked_targets):
        rel = leaf.relative_to(catalog_dir)
        violations.append({
            'type': 'orphan_leaf_file',
            'package': package_name,
            'path': str(rel),
            'message': f"{package_name}: leaf file exists on disk but is not linked from the root catalog: {rel}",
        })

    return violations


def check_root_catalog_bijection(skills_root: Path) -> List[Dict[str, Any]]:
    violations: List[Dict[str, Any]] = []
    for pkg in expected_root_packages(skills_root):
        catalog_dir = skills_root / pkg['name'] / CATALOG_DIRNAME
        root_catalog = catalog_dir / ROOT_CATALOG_FILENAME
        if not root_catalog.exists():
            violations.append({
                'type': 'missing_root_catalog',
                'package': pkg['name'],
                'role': pkg['role'],
                'message': f"{pkg['name']} ({pkg['role']}) has no {CATALOG_DIRNAME}/{ROOT_CATALOG_FILENAME}",
            })
            continue
        violations.extend(check_root_leaf_bijection(pkg['name'], catalog_dir, root_catalog))
    return violations


# ───────────────────────────────────────────────────────────────
# 4. SHARED LEAF-TABLE WALKER (checks b + c both read '| File | ... | ... |' rows)
# ───────────────────────────────────────────────────────────────


def _iter_file_column_rows(text: str) -> Iterator[Tuple[str, str, str]]:
    """Yield (file_cell, col2, col3) for every row of a '| File | ... | ... |' table.

    Mirrors validate_document.py's validate_feature_catalog_table row walker so both
    scripts agree on table boundaries (header detection, separator-row skip, cell split).
    """
    in_table = False
    for line in text.split('\n'):
        stripped = line.strip()
        if re.match(r'^\|\s*File\s*\|', stripped):
            in_table = True
            continue
        if not in_table:
            continue
        if not stripped.startswith('|'):
            in_table = False
            continue
        if re.match(r'^\|[\s|:\-]+\|$', stripped):
            continue
        cells = [c.strip() for c in stripped.strip('|').split('|')]
        if len(cells) < 3:
            continue
        yield cells[0], cells[1], cells[2]


def _iter_leaf_files(catalog_dir: Path) -> Iterator[Path]:
    for leaf in sorted(catalog_dir.rglob('*.md')):
        if leaf.name != ROOT_CATALOG_FILENAME:
            yield leaf


# ───────────────────────────────────────────────────────────────
# 5. CHECK (b): SOURCE FILES PATH EXISTENCE
# ───────────────────────────────────────────────────────────────


# Cells outside this allowlist are ambiguous (skill-root-relative shorthand, mixed
# conventions across older catalogs) rather than clearly repo-root-relative, so they are
# left unchecked instead of risking a false positive this script cannot substantiate.
REPO_RELATIVE_PREFIXES = ('.opencode/', '.claude/', '.codex/')

# A trailing `:123` or `:123-145` line-range locator (a real, documented citation style
# in this corpus) is not part of the filesystem path and must be stripped before the
# existence check, or every line-anchored citation false-positives as missing.
LINE_RANGE_SUFFIX_RE = re.compile(r':\d+(?:-\d+)?$')


def _looks_like_bare_path(text: str) -> bool:
    if not text or ' ' in text or '\n' in text or '[' in text or ']' in text or '*' in text:
        return False
    return '/' in text or BARE_PATH_HINT_RE.search(text) is not None


def _extract_checkable_path(file_cell: str) -> Optional[Tuple[str, str]]:
    """Return (kind, path) for a File cell, or None when nothing checkable is present.

    kind is 'repo-relative' (resolve against repo_root — only for a recognized
    top-level-dir prefix; see REPO_RELATIVE_PREFIXES) or 'doc-relative' (resolve against
    the leaf file's own directory — a prose cell carrying an embedded markdown link,
    e.g. a playbook scenario reference). Placeholder em-dashes, un-filled template rows,
    glob patterns (`*`), and paths with no recognized base all return None: best-effort,
    not exhaustive — an unresolved cell is a coverage gap, never a false violation.
    """
    text = file_cell.strip()
    inner = text[1:-1].strip() if text.startswith('`') and text.endswith('`') and len(text) >= 2 else text
    if not inner or inner.strip('.,;: ') in DASH_VALUES or '{' in inner:
        return None
    link = MD_LINK_RE.search(inner)
    if link:
        return ('doc-relative', link.group(1))
    if _looks_like_bare_path(inner) and inner.startswith(REPO_RELATIVE_PREFIXES):
        return ('repo-relative', inner)
    return None


def check_source_file_paths(package_name: str, catalog_dir: Path, repo_root: Path) -> List[Dict[str, Any]]:
    violations: List[Dict[str, Any]] = []
    repo_root = repo_root.resolve()
    for leaf in _iter_leaf_files(catalog_dir):
        text = leaf.read_text(encoding='utf-8')
        for file_cell, _col2, _col3 in _iter_file_column_rows(text):
            checkable = _extract_checkable_path(file_cell)
            if checkable is None:
                continue
            kind, raw_path = checkable
            check_path = LINE_RANGE_SUFFIX_RE.sub('', raw_path)
            base = repo_root if kind == 'repo-relative' else leaf.parent
            resolved = (base / check_path).resolve()
            if not resolved.exists():
                leaf_resolved = leaf.resolve()
                violations.append({
                    'type': 'missing_source_path',
                    'package': package_name,
                    'leaf': str(leaf_resolved.relative_to(repo_root)) if _is_relative_to(leaf_resolved, repo_root) else str(leaf_resolved),
                    'path': raw_path,
                    'message': f"{package_name}/{leaf.name}: SOURCE FILES path does not exist on disk: {raw_path}",
                })
    return violations


def _is_relative_to(path: Path, base: Path) -> bool:
    try:
        path.resolve().relative_to(base.resolve())
        return True
    except ValueError:
        return False


# ───────────────────────────────────────────────────────────────
# 6. CHECK (c): TYPE-COLUMN TAXONOMY CONFORMANCE (reuses validate_document.py)
# ───────────────────────────────────────────────────────────────


def check_taxonomy(package_name: str, catalog_dir: Path, rules: Dict[str, Any]) -> List[Dict[str, Any]]:
    violations: List[Dict[str, Any]] = []
    doc_type_rules = rules.get('documentTypes', {}).get('feature_catalog', {})
    for leaf in _iter_leaf_files(catalog_dir):
        text = leaf.read_text(encoding='utf-8')
        for err in validate_feature_catalog_table(text, doc_type_rules):
            if err.get('type') != 'off_taxonomy_validation_type':
                continue  # placeholder_validation_row is validate_document.py's own single-file gate
            violations.append({
                'type': 'off_taxonomy_validation_type',
                'package': package_name,
                'leaf': leaf.name,
                'line': err.get('line'),
                'message': f"{package_name}/{leaf.name}:{err.get('line')}: {err.get('message')}",
            })
    return violations


# ───────────────────────────────────────────────────────────────
# 7. ORCHESTRATION
# ───────────────────────────────────────────────────────────────


def run_all_checks(skills_root: Path, repo_root: Path, rules: Dict[str, Any]) -> List[Dict[str, Any]]:
    violations = check_root_catalog_bijection(skills_root)
    for pkg in expected_root_packages(skills_root):
        catalog_dir = skills_root / pkg['name'] / CATALOG_DIRNAME
        if not catalog_dir.exists():
            continue  # already reported as missing_root_catalog above
        violations.extend(check_source_file_paths(pkg['name'], catalog_dir, repo_root))
        violations.extend(check_taxonomy(pkg['name'], catalog_dir, rules))
    return violations


def format_report(violations: List[Dict[str, Any]]) -> str:
    if not violations:
        return 'PASS: 0 violations (bijection, source-path existence, taxonomy).'
    lines = [f'FAIL: {len(violations)} violation(s):']
    for v in violations:
        lines.append(f"  - [{v['type']}] {v['message']}")
    return '\n'.join(lines)


# ───────────────────────────────────────────────────────────────
# 8. CLI
# ───────────────────────────────────────────────────────────────


def main(argv: List[str]) -> int:
    parser = argparse.ArgumentParser(
        description='Strict package-level validator for sk-doc feature catalogs.',
    )
    parser.add_argument('--skills-root', default=None, help='Defaults to .opencode/skills at the repo root.')
    parser.add_argument('--repo-root', default=None, help='Defaults to the repo root containing .opencode/skills.')
    parser.add_argument('--strict', action='store_true', help='Exit non-zero when any violation is found.')
    parser.add_argument('--json', action='store_true', help='Emit machine-readable JSON instead of text.')
    args = parser.parse_args(argv)

    default_repo_root = Path(__file__).resolve().parents[5]
    repo_root = Path(args.repo_root).resolve() if args.repo_root else default_repo_root
    skills_root = Path(args.skills_root).resolve() if args.skills_root else (repo_root / '.opencode' / 'skills')

    if not skills_root.exists():
        print(f'ERROR: skills root not found: {skills_root}', file=sys.stderr)
        return 2

    rules = load_template_rules(_SHARED_SCRIPTS)
    violations = run_all_checks(skills_root, repo_root, rules)

    if args.json:
        print(json.dumps({'clean': not violations, 'violationCount': len(violations), 'violations': violations}, indent=2))
    else:
        print(format_report(violations))

    if args.strict and violations:
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
