#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: FEATURE-CATALOG STRICT PACKAGE VALIDATOR
# ───────────────────────────────────────────────────────────────

"""Strict package-level validator for sk-doc feature catalogs.

Proves four things `validate_document.py`'s single-file scope cannot, because each
needs cross-file or cross-directory state:

  (a) Root<->leaf bijection for every discovered package: every leaf `.md` file under
      a package's `feature-catalog/` tree is linked from that package's root catalog,
      and every `.md` link the root catalog makes resolves to a real leaf file on disk.
  (b) Every SOURCE FILES table row's File path exists on disk (best-effort: a bare
      repo-root-relative path is checked directly; a prose cell with an embedded
      markdown link is checked relative to the leaf file's own directory; placeholder
      em-dash rows and unparseable prose are skipped, matching
      `validate_document.py`'s own placeholder-skip convention).
  (c) Every "Validation And Tests" Type-column value is a member of the canonical
      taxonomy, by re-running `validate_document.py`'s own `validate_feature_catalog_table`
      check (the taxonomy stays single-sourced in `template-rules.json`; this script
      never redefines it).
  (d) Both live sk-doc workflowMode inventories equal the key set projected by
      sk-doc/mode-registry.json.

The default invocation is fail-closed for promoted packages. Packages carrying the
known catalog-repair backlog are explicitly staged at WARN until their repair removes
them from the map. Pass --report-only for advisory output; --strict remains an alias
for the default fail-closed behavior.

Usage:
  validate_catalog_package.py [--skills-root PATH] [--repo-root PATH] [--package ID]
      [--strict] [--report-only] [--json]
"""

import argparse
import json
import posixpath
import re
import sys
from pathlib import Path
from typing import Any, Dict, Iterator, List, Optional, Sequence, Tuple

_SHARED_SCRIPTS = Path(__file__).resolve().parents[2] / 'shared' / 'scripts'
sys.path.insert(0, str(_SHARED_SCRIPTS))
from validate_document import load_template_rules, validate_feature_catalog_table  # type: ignore  # noqa: E402
from naming_root_resolver import CATALOG_ROOT_NAMES  # type: ignore  # noqa: E402

# ───────────────────────────────────────────────────────────────
# 1. CONSTANTS
# ───────────────────────────────────────────────────────────────

CATALOG_DIRNAME = CATALOG_ROOT_NAMES[0]  # 'feature-catalog'
ROOT_CATALOG_FILENAME = 'feature-catalog.md'
SK_DOC_NAME = 'sk-doc'

# Staged rollout: every package measured with an existing backlog at enforcement start
# enters at warn, because a package may only fail closed once it has been verified clean.
# Repair work removes an entry when its package is clean, at which point it fails closed;
# packages absent from this list (including any newly created catalog) fail closed from
# their first validation.
WARN_PACKAGE_IDS = frozenset({
    'cli-external-orchestration',
    'mcp-tooling',
    'mcp-tooling/mcp-aside-devtools',
    'mcp-tooling/mcp-chrome-devtools',
    'mcp-tooling/mcp-click-up',
    'mcp-tooling/mcp-figma',
    'mcp-tooling/mcp-mobbin',
    'mcp-tooling/mcp-refero',
    'sk-code',
    'sk-design',
    'sk-design/sk-design-interface',
    'sk-design/sk-design-md-generator',
    'sk-doc',
    'sk-doc/sk-create-diff',
    'sk-git',
    'sk-prompt',
    'system-deep-loop',
    'system-deep-loop/deep-ai-council',
    'system-deep-loop/deep-alignment',
    'system-deep-loop/deep-improvement',
    'system-deep-loop/deep-research',
    'system-deep-loop/deep-review',
    'system-deep-loop/runtime',
    'system-skill-advisor',
    'system-spec-kit',
})

# This explicit ruling excludes runtime data if it ever gains a same-named directory.
EXCLUDED_PACKAGE_PREFIXES = {
    'system-code-graph': 'runtime data root; it has no skill contract or feature catalog',
}

WORKFLOW_MODE_INVENTORY_PATHS = {
    'root catalog': Path(CATALOG_DIRNAME) / ROOT_CATALOG_FILENAME,
    'packet-authored registry routing': (
        Path(CATALOG_DIRNAME)
        / 'packet-authored-registry-routing'
        / 'packet-authored-registry-routing.md'
    ),
}

DASH_VALUES = {'—', '-', '–', ''}

MD_LINK_RE = re.compile(r'\]\(([^)]+)\)')
FULL_MD_LINK_RE = re.compile(r'\[[^\]]*\]\([^)]+\)')
BARE_PATH_HINT_RE = re.compile(r'\.[A-Za-z0-9]{1,8}$')
MD_PATH_TOKEN_RE = re.compile(r'(?<![\w])(?:[A-Za-z0-9_.-]+/)*[A-Za-z0-9_.-]+\.md\b')
REPO_PATH_TOKEN_RE = re.compile(r'(?<![\w])(?:\.opencode|\.claude|\.codex)/[A-Za-z0-9_./-]+')
WORKFLOW_MODE_INVENTORY_RE = re.compile(
    r'`workflowMode`\s+(?:spans|is the public packet key\s+—)\s+(.*?)\.',
    re.DOTALL,
)
FRONTMATTER_RE = re.compile(r'\A---\s*\n(.*?)\n---(?:\s*\n|\Z)', re.DOTALL)
H3_RE = re.compile(r'^###\s+(.+?)\s*$', re.MULTILINE)
DESCRIPTION_HEADING_RE = re.compile(r'^####\s+Description\s*$', re.MULTILINE)
PACKET_HISTORY_RE = re.compile(
    r'^\s*(?:[-*]\s*)?(?:source\s+phase|feature[- ]?id(?:\s+history)?|origin\s+packet)\s*:',
    re.IGNORECASE,
)
UNSHIPPED_LABEL_RE = re.compile(
    r'\b(?:not[- ]yet[- ](?:implemented|shipped)|unshipped|planned[- ]only|not available)\b',
    re.IGNORECASE,
)
SHIPPED_LABEL_RE = re.compile(
    r'^\s*(?:[-*]\s*)?(?:status|shipping status|availability|state)\s*:\s*shipped\b',
    re.IGNORECASE | re.MULTILINE,
)
VOLATILE_SNAPSHOT_RE = re.compile(
    r'\b(?:as of\s+\d{4}-\d{2}-\d{2}|measured|measurement snapshot|snapshot|baseline)\b'
    r'.{0,120}\b\d+\s+(?:features?|leaves?|packages?|tools?|servers?|files?)\b',
    re.IGNORECASE,
)

# ───────────────────────────────────────────────────────────────
# 2. PACKAGE DISCOVERY
# ───────────────────────────────────────────────────────────────


def discover_catalog_directories(skills_root: Path) -> List[Path]:
    """Discover every canonical feature-catalog directory under the skills root."""
    if not skills_root.exists():
        return []
    return sorted(
        (path for path in skills_root.rglob(CATALOG_DIRNAME) if path.is_dir()),
        key=lambda path: path.as_posix(),
    )


def _package_id(catalog_dir: Path, skills_root: Path) -> str:
    return catalog_dir.parent.relative_to(skills_root).as_posix()


def _is_excluded_package(package_id: str) -> bool:
    return any(
        package_id == prefix or package_id.startswith(f'{prefix}/')
        for prefix in EXCLUDED_PACKAGE_PREFIXES
    )


def expected_root_packages(skills_root: Path) -> List[Dict[str, str]]:
    """Return packages whose presence is proved by a feature-catalog directory."""
    packages = []
    for catalog_dir in discover_catalog_directories(skills_root):
        package_id = _package_id(catalog_dir, skills_root)
        if _is_excluded_package(package_id):
            continue
        packages.append({
            'name': package_id,
            'role': 'catalog-package',
            'catalog_dir': str(catalog_dir),
        })
    return packages


def check_discovery_coverage(
    skills_root: Path,
    ruled_packages: Optional[Sequence[Dict[str, str]]] = None,
) -> List[Dict[str, Any]]:
    """Fail if a present catalog directory is absent from the ruled package set."""
    packages = list(ruled_packages) if ruled_packages is not None else expected_root_packages(skills_root)
    ruled_ids = {pkg['name'] for pkg in packages}
    violations = []
    for catalog_dir in discover_catalog_directories(skills_root):
        package_id = _package_id(catalog_dir, skills_root)
        if _is_excluded_package(package_id) or package_id in ruled_ids:
            continue
        violations.append({
            'type': 'unruled_catalog_package',
            'package': package_id,
            'path': str(catalog_dir),
            'message': f'{package_id}: feature-catalog directory is present but not in the ruled discovery set',
        })
    return violations


# ───────────────────────────────────────────────────────────────
# 3. CHECK (a): ROOT<->LEAF BIJECTION
# ───────────────────────────────────────────────────────────────


def _extract_md_links(text: str) -> List[str]:
    """Every markdown link target ending in .md, excluding http(s) URLs."""
    return [
        target.split('#', 1)[0].strip() for target in MD_LINK_RE.findall(text)
        if target.split('#', 1)[0].strip().lower().endswith('.md')
        and not target.startswith(('http://', 'https://'))
    ]


def _path_key(path: Path) -> str:
    """Normalize an absolute path for case-insensitive catalog comparisons."""
    return posixpath.normpath(path.as_posix()).casefold()


def _root_catalog_candidates(catalog_dir: Path) -> List[Path]:
    return sorted(
        (path for path in catalog_dir.iterdir() if path.is_file()
         and path.name.casefold() == ROOT_CATALOG_FILENAME.casefold()),
        key=lambda path: path.as_posix(),
    )


def check_root_leaf_bijection(package_name: str, catalog_dir: Path, root_catalog_path: Path) -> List[Dict[str, Any]]:
    """Bijection between a root catalog's .md links and the leaf files that exist on disk."""
    violations: List[Dict[str, Any]] = []
    catalog_dir = catalog_dir.resolve()
    root_catalog_path = root_catalog_path.resolve()

    text = root_catalog_path.read_text(encoding='utf-8')
    linked_targets = {
        (root_catalog_path.parent / raw).resolve(): raw
        for raw in _extract_md_links(text)
    }
    linked_by_key = {_path_key(path): path for path in linked_targets}

    leaf_files = {
        p.resolve() for p in catalog_dir.rglob('*.md')
        if p.name.casefold() != ROOT_CATALOG_FILENAME.casefold()
    }
    leaf_by_key = {_path_key(path): path for path in leaf_files}

    # Direction 1: the root catalog links a leaf that does not exist on disk.
    for key, target in sorted(linked_by_key.items()):
        if key in leaf_by_key:
            continue  # resolves to something real outside this catalog package; not this check's concern
        if target.exists():
            continue
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
    for key, leaf in sorted(leaf_by_key.items()):
        if key in linked_by_key:
            continue
        rel = leaf.relative_to(catalog_dir)
        violations.append({
            'type': 'orphan_leaf_file',
            'package': package_name,
            'path': str(rel),
            'message': f"{package_name}: leaf file exists on disk but is not linked from the root catalog: {rel}",
        })

    return violations


def check_root_catalog_bijection(
    skills_root: Path,
    packages: Optional[Sequence[Dict[str, str]]] = None,
) -> List[Dict[str, Any]]:
    violations: List[Dict[str, Any]] = []
    for pkg in packages or expected_root_packages(skills_root):
        catalog_dir = Path(pkg.get('catalog_dir', skills_root / pkg['name'] / CATALOG_DIRNAME))
        roots = _root_catalog_candidates(catalog_dir) if catalog_dir.exists() else []
        if not roots:
            violations.append({
                'type': 'missing_root_catalog',
                'package': pkg['name'],
                'role': pkg['role'],
                'message': f"{pkg['name']} ({pkg['role']}) has no {CATALOG_DIRNAME}/{ROOT_CATALOG_FILENAME}",
            })
            continue
        if len(roots) > 1:
            violations.append({
                'type': 'duplicate_root_catalog',
                'package': pkg['name'],
                'path': str(catalog_dir),
                'message': f"{pkg['name']}: multiple root catalogs differ only by filename case: {', '.join(path.name for path in roots)}",
            })
        violations.extend(check_root_leaf_bijection(pkg['name'], catalog_dir, roots[0]))
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
        if leaf.name.casefold() != ROOT_CATALOG_FILENAME.casefold():
            yield leaf


def _iter_prose_lines(text: str) -> Iterator[Tuple[int, str]]:
    """Yield lines outside SOURCE FILES tables, where prose-path rules apply."""
    in_file_table = False
    for line_number, line in enumerate(text.splitlines(), start=1):
        stripped = line.strip()
        if re.match(r'^\|\s*File\s*\|', stripped):
            in_file_table = True
            continue
        if in_file_table and not stripped.startswith('|'):
            in_file_table = False
        if not in_file_table:
            yield line_number, line


def _trim_path_token(raw_path: str) -> str:
    return LINE_RANGE_SUFFIX_RE.sub('', raw_path.rstrip('.,;:)\u201d\u2019'))


def _frontmatter_fields(text: str) -> Dict[str, str]:
    match = FRONTMATTER_RE.search(text)
    if match is None:
        return {}
    fields: Dict[str, str] = {}
    for key in ('title', 'description'):
        field_match = re.search(rf'^{key}:\s*(.+?)\s*$', match.group(1), re.MULTILINE)
        if field_match:
            value = field_match.group(1).strip()
            if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
                value = value[1:-1]
            fields[key] = value
    return fields


def _normalized_description(value: str) -> str:
    value = re.sub(r'[`*_>#]', ' ', value)
    value = re.sub(r'[^\w\s]+', ' ', value, flags=re.UNICODE)
    return ' '.join(value.casefold().split())


def _root_h3_entries(root_catalog_path: Path, catalog_dir: Path) -> List[Tuple[str, Path, Optional[str]]]:
    """Return (root title, linked leaf, root description) for H3 catalog entries."""
    text = root_catalog_path.read_text(encoding='utf-8')
    headings = list(H3_RE.finditer(text))
    entries: List[Tuple[str, Path, Optional[str]]] = []
    for index, heading in enumerate(headings):
        block_end = headings[index + 1].start() if index + 1 < len(headings) else len(text)
        next_h2 = re.search(r'^##\s+', text[heading.end():block_end], re.MULTILINE)
        if next_h2:
            block_end = heading.end() + next_h2.start()
        block = text[heading.end():block_end]
        description: Optional[str] = None
        description_heading = DESCRIPTION_HEADING_RE.search(block)
        if description_heading:
            description_start = description_heading.end()
            description_end_match = re.search(r'^(?:####|###|##)\s+', block[description_start:], re.MULTILINE)
            description_end = description_start + description_end_match.start() if description_end_match else len(block)
            paragraphs = [line.strip() for line in block[description_start:description_end].splitlines()]
            paragraphs = [line for line in paragraphs if line and line != '---']
            if paragraphs:
                description = ' '.join(paragraphs)
        if description is None:
            continue
        root_title = re.sub(r'[`*_]', '', heading.group(1)).strip()
        source_heading = re.search(r'^####\s+Source Files\s*$', block, re.MULTILINE)
        link_block = block[source_heading.end():] if source_heading else block
        next_subheading = re.search(r'^(?:####|###|##)\s+', link_block, re.MULTILINE)
        if next_subheading:
            link_block = link_block[:next_subheading.start()]
        for raw_target in _extract_md_links(link_block):
            target = (root_catalog_path.parent / raw_target).resolve()
            if not _is_relative_to(target, catalog_dir):
                continue
            if target.name.casefold() == ROOT_CATALOG_FILENAME.casefold():
                continue
            entries.append((root_title, target, description))
    return entries


def check_phantom_rows(package_name: str, root_catalog_path: Path) -> List[Dict[str, Any]]:
    """Reject root-table rows that mention markdown targets without linking them."""
    violations: List[Dict[str, Any]] = []
    for line_number, line in enumerate(root_catalog_path.read_text(encoding='utf-8').splitlines(), start=1):
        if '|' not in line or line.lstrip().startswith('|---'):
            continue
        without_links = FULL_MD_LINK_RE.sub('', line)
        for raw_path in MD_PATH_TOKEN_RE.findall(without_links):
            violations.append({
                'type': 'phantom_root_row',
                'package': package_name,
                'path': raw_path,
                'line': line_number,
                'message': f'{package_name}/{root_catalog_path.name}:{line_number}: root table names {raw_path} as plain text instead of a markdown link',
            })
    return violations


def check_prose_paths(
    package_name: str,
    catalog_dir: Path,
    repo_root: Path,
    root_catalog_path: Optional[Path] = None,
) -> List[Dict[str, Any]]:
    """Check repo-relative paths and reject measurement snapshots in catalog prose."""
    violations: List[Dict[str, Any]] = []
    documents = [root_catalog_path] if root_catalog_path is not None else []
    documents += list(_iter_leaf_files(catalog_dir))
    repo_root = repo_root.resolve()
    for document in documents:
        if document is None or not document.exists():
            continue
        text = document.read_text(encoding='utf-8')
        for line_number, line in _iter_prose_lines(text):
            for raw_path in REPO_PATH_TOKEN_RE.findall(line):
                path = _trim_path_token(raw_path)
                resolved = (repo_root / path).resolve()
                if not _is_relative_to(resolved, repo_root):
                    violations.append({
                        'type': 'prose_path_outside_repo',
                        'package': package_name,
                        'leaf': str(document),
                        'line': line_number,
                        'path': path,
                        'message': f'{package_name}/{document.name}:{line_number}: prose path escapes the repository: {path}',
                    })
                elif not resolved.exists():
                    violations.append({
                        'type': 'missing_prose_path',
                        'package': package_name,
                        'leaf': str(document),
                        'line': line_number,
                        'path': path,
                        'message': f'{package_name}/{document.name}:{line_number}: prose path does not exist on disk: {path}',
                    })
            if VOLATILE_SNAPSHOT_RE.search(line):
                violations.append({
                    'type': 'volatile_measurement_snapshot',
                    'package': package_name,
                    'leaf': str(document),
                    'line': line_number,
                    'message': f'{package_name}/{document.name}:{line_number}: prose contains a volatile measurement snapshot; derive structural rosters instead',
                })
    return violations


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
# 7. CHECKS (e): CATALOG ENTRY PARITY
# ───────────────────────────────────────────────────────────────


def check_root_leaf_parity(
    package_name: str,
    catalog_dir: Path,
    root_catalog_path: Path,
) -> List[Dict[str, Any]]:
    """Require H3 entry titles and normalized descriptions to match their leaves."""
    violations: List[Dict[str, Any]] = []
    leaves = {_path_key(leaf): leaf for leaf in _iter_leaf_files(catalog_dir)}
    for root_title, target, root_description in _root_h3_entries(root_catalog_path, catalog_dir):
        leaf = leaves.get(_path_key(target), target)
        fields = _frontmatter_fields(leaf.read_text(encoding='utf-8')) if leaf.exists() else {}
        leaf_title = fields.get('title')
        if leaf_title is None:
            violations.append({
                'type': 'missing_leaf_title',
                'package': package_name,
                'leaf': str(leaf),
                'message': f'{package_name}/{leaf.name}: leaf frontmatter has no title for root entry {root_title!r}',
            })
        elif leaf_title != root_title:
            violations.append({
                'type': 'root_leaf_title_mismatch',
                'package': package_name,
                'leaf': str(leaf),
                'expected': root_title,
                'actual': leaf_title,
                'message': f'{package_name}/{leaf.name}: leaf title {leaf_title!r} does not match root H3 {root_title!r}',
            })

        if root_description is None:
            continue
        leaf_description = fields.get('description')
        if leaf_description is None:
            violations.append({
                'type': 'missing_leaf_description',
                'package': package_name,
                'leaf': str(leaf),
                'message': f'{package_name}/{leaf.name}: leaf frontmatter has no description for root entry {root_title!r}',
            })
        elif _normalized_description(leaf_description) != _normalized_description(root_description):
            violations.append({
                'type': 'root_leaf_description_mismatch',
                'package': package_name,
                'leaf': str(leaf),
                'expected': root_description,
                'actual': leaf_description,
                'message': f'{package_name}/{leaf.name}: normalized leaf description does not match root H3 {root_title!r}',
            })
    return violations


# ───────────────────────────────────────────────────────────────
# 8. CHECKS (f): PACKET HISTORY AND SHIPPED LABELS
# ───────────────────────────────────────────────────────────────


def check_packet_history(package_name: str, catalog_dir: Path) -> List[Dict[str, Any]]:
    violations: List[Dict[str, Any]] = []
    for leaf in _iter_leaf_files(catalog_dir):
        for line_number, line in enumerate(leaf.read_text(encoding='utf-8').splitlines(), start=1):
            if not PACKET_HISTORY_RE.search(line):
                continue
            violations.append({
                'type': 'packet_history_metadata',
                'package': package_name,
                'leaf': str(leaf),
                'line': line_number,
                'message': f'{package_name}/{leaf.name}:{line_number}: packet-history metadata is not allowed in a feature catalog',
            })
    return violations


def _implementation_rows(text: str) -> List[Tuple[str, str, str]]:
    match = re.search(r'^###\s+Implementation\s*$', text, re.MULTILINE)
    if match is None:
        return []
    section = text[match.end():]
    next_heading = re.search(r'^(?:###|##)\s+', section, re.MULTILINE)
    if next_heading:
        section = section[:next_heading.start()]
    return list(_iter_file_column_rows(section))


def _has_populated_implementation_table(text: str) -> bool:
    for file_cell, _layer, _role in _implementation_rows(text):
        value = file_cell.strip().strip('`')
        if value and value not in DASH_VALUES and '{' not in value:
            return True
    return False


def check_shipped_labels(package_name: str, catalog_dir: Path) -> List[Dict[str, Any]]:
    violations: List[Dict[str, Any]] = []
    for leaf in _iter_leaf_files(catalog_dir):
        text = leaf.read_text(encoding='utf-8')
        populated = _has_populated_implementation_table(text)
        unshipped = bool(UNSHIPPED_LABEL_RE.search(text))
        shipped = bool(SHIPPED_LABEL_RE.search(text))
        if populated and unshipped:
            violations.append({
                'type': 'unshipped_with_source_files',
                'package': package_name,
                'leaf': str(leaf),
                'message': f'{package_name}/{leaf.name}: feature is labeled unshipped but has populated implementation source files',
            })
        if shipped and not populated:
            violations.append({
                'type': 'shipped_without_source_files',
                'package': package_name,
                'leaf': str(leaf),
                'message': f'{package_name}/{leaf.name}: feature is labeled shipped but its implementation source table is empty or stub-only',
            })
    return violations


# ───────────────────────────────────────────────────────────────
# 9. CHECK (d): SK-DOC WORKFLOW-MODE SET PARITY
# ───────────────────────────────────────────────────────────────


def _parse_workflow_mode_inventory(text: str) -> Optional[List[str]]:
    """Extract inline-code keys from the declared workflowMode inventory sentence."""
    match = WORKFLOW_MODE_INVENTORY_RE.search(text)
    if match is None:
        return None
    return re.findall(r'`([^`]+)`', match.group(1))


def check_workflow_mode_parity(skills_root: Path) -> List[Dict[str, Any]]:
    """Require both sk-doc catalog inventories to equal the registry workflowMode set."""
    sk_doc_root = skills_root / SK_DOC_NAME
    if not sk_doc_root.exists():
        return []

    registry_path = sk_doc_root / 'mode-registry.json'
    if not registry_path.exists():
        return [{
            'type': 'missing_workflow_mode_registry',
            'package': SK_DOC_NAME,
            'path': str(registry_path.relative_to(skills_root)),
            'message': f'{SK_DOC_NAME}: workflowMode registry does not exist: {registry_path}',
        }]

    try:
        registry = json.loads(registry_path.read_text(encoding='utf-8'))
    except (OSError, json.JSONDecodeError) as exc:
        return [{
            'type': 'invalid_workflow_mode_registry',
            'package': SK_DOC_NAME,
            'path': str(registry_path.relative_to(skills_root)),
            'message': f'{SK_DOC_NAME}: cannot read workflowMode registry: {exc}',
        }]

    registry_keys = {
        mode['workflowMode']
        for mode in registry.get('modes', [])
        if isinstance(mode, dict) and isinstance(mode.get('workflowMode'), str)
    }
    if not registry_keys:
        return [{
            'type': 'empty_workflow_mode_registry',
            'package': SK_DOC_NAME,
            'path': str(registry_path.relative_to(skills_root)),
            'message': f'{SK_DOC_NAME}: workflowMode registry contains no keys',
        }]

    violations: List[Dict[str, Any]] = []
    for inventory_name, relative_path in WORKFLOW_MODE_INVENTORY_PATHS.items():
        inventory_path = sk_doc_root / relative_path
        if not inventory_path.exists():
            violations.append({
                'type': 'missing_workflow_mode_inventory',
                'package': SK_DOC_NAME,
                'path': str(inventory_path.relative_to(skills_root)),
                'message': f'{SK_DOC_NAME} {inventory_name}: inventory page does not exist: {inventory_path}',
            })
            continue

        try:
            inventory_keys = _parse_workflow_mode_inventory(inventory_path.read_text(encoding='utf-8'))
        except OSError as exc:
            violations.append({
                'type': 'unreadable_workflow_mode_inventory',
                'package': SK_DOC_NAME,
                'path': str(inventory_path.relative_to(skills_root)),
                'message': f'{SK_DOC_NAME} {inventory_name}: cannot read inventory page: {exc}',
            })
            continue

        if inventory_keys is None:
            violations.append({
                'type': 'unparseable_workflow_mode_inventory',
                'package': SK_DOC_NAME,
                'path': str(inventory_path.relative_to(skills_root)),
                'message': f'{SK_DOC_NAME} {inventory_name}: workflowMode inventory sentence was not found',
            })
            continue

        inventory_key_set = set(inventory_keys)
        if inventory_key_set == registry_keys:
            continue

        missing_keys = sorted(registry_keys - inventory_key_set)
        extra_keys = sorted(inventory_key_set - registry_keys)
        violations.append({
            'type': 'workflow_mode_inventory_mismatch',
            'package': SK_DOC_NAME,
            'path': str(inventory_path.relative_to(skills_root)),
            'missing': missing_keys,
            'extra': extra_keys,
            'message': (
                f'{SK_DOC_NAME} {inventory_name}: workflowMode inventory differs from mode-registry.json '
                f'(missing: {missing_keys or "none"}; extra: {extra_keys or "none"})'
            ),
        })

    return violations


# ───────────────────────────────────────────────────────────────
# 10. ORCHESTRATION
# ───────────────────────────────────────────────────────────────


def _apply_severity(violations: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    for violation in violations:
        package_id = violation.get('package', '')
        violation['severity'] = 'warn' if package_id in WARN_PACKAGE_IDS else 'fail'
    return violations


def run_all_checks(
    skills_root: Path,
    repo_root: Path,
    rules: Dict[str, Any],
    package_ids: Optional[Sequence[str]] = None,
) -> List[Dict[str, Any]]:
    all_packages = expected_root_packages(skills_root)
    selected_ids = set(package_ids or ())
    packages = [pkg for pkg in all_packages if not selected_ids or pkg['name'] in selected_ids]
    violations: List[Dict[str, Any]] = []
    if not selected_ids or SK_DOC_NAME in selected_ids:
        violations.extend(check_workflow_mode_parity(skills_root))
    if not selected_ids:
        violations.extend(check_discovery_coverage(skills_root, all_packages))
    violations.extend(check_root_catalog_bijection(skills_root, packages))
    for pkg in packages:
        catalog_dir = Path(pkg['catalog_dir'])
        roots = _root_catalog_candidates(catalog_dir) if catalog_dir.exists() else []
        root_catalog = roots[0] if roots else None
        if root_catalog is not None:
            violations.extend(check_phantom_rows(pkg['name'], root_catalog))
            violations.extend(check_prose_paths(pkg['name'], catalog_dir, repo_root, root_catalog))
            violations.extend(check_root_leaf_parity(pkg['name'], catalog_dir, root_catalog))
        if not catalog_dir.exists():
            continue
        violations.extend(check_source_file_paths(pkg['name'], catalog_dir, repo_root))
        violations.extend(check_taxonomy(pkg['name'], catalog_dir, rules))
        violations.extend(check_packet_history(pkg['name'], catalog_dir))
        violations.extend(check_shipped_labels(pkg['name'], catalog_dir))
    return _apply_severity(violations)


def package_verdicts(
    packages: Sequence[Dict[str, str]],
    violations: Sequence[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    verdicts = []
    for package in packages:
        package_violations = [v for v in violations if v.get('package') == package['name']]
        if not package_violations:
            verdicts.append({
                'package': package['name'],
                'tier': 'fail',
                'verdict': 'PASS',
                'violations': 0,
            })
            continue
        has_fail = any(v.get('severity') == 'fail' for v in package_violations)
        verdicts.append({
            'package': package['name'],
            'tier': 'fail' if has_fail else 'warn',
            'verdict': 'FAIL' if has_fail else 'WARN',
            'violations': len(package_violations),
        })
    return verdicts


def format_report(
    violations: List[Dict[str, Any]],
    packages: Sequence[Dict[str, str]],
) -> str:
    verdicts = package_verdicts(packages, violations)
    lines = [
        f"PACKAGE {item['package']}: {item['verdict']} tier={item['tier']} violations={item['violations']}"
        for item in verdicts
    ]
    if not violations:
        lines.append('PASS: 0 violations (all enforced catalog checks).')
        return '\n'.join(lines)
    fail_count = sum(1 for v in violations if v.get('severity') == 'fail')
    warn_count = len(violations) - fail_count
    final_label = 'FAIL' if fail_count else 'WARN'
    lines.append(f'{final_label}: {len(violations)} violation(s) ({fail_count} fail, {warn_count} warn):')
    for v in violations:
        lines.append(f"  - [{v['severity']}] [{v['type']}] {v['message']}")
    return '\n'.join(lines)


# ───────────────────────────────────────────────────────────────
# 11. CLI
# ───────────────────────────────────────────────────────────────


def main(argv: List[str]) -> int:
    parser = argparse.ArgumentParser(
        description='Fail-closed package-level validator for sk-doc feature catalogs.',
    )
    parser.add_argument('--skills-root', default=None, help='Defaults to .opencode/skills at the repo root.')
    parser.add_argument('--repo-root', default=None, help='Defaults to the repo root containing .opencode/skills.')
    parser.add_argument('--package', dest='packages', action='append', help='Validate one package ID; repeatable.')
    parser.add_argument('--strict', action='store_true', help='Alias for the default fail-closed behavior.')
    parser.add_argument('--report-only', action='store_true', help='Print findings without failing on promoted violations.')
    parser.add_argument('--json', action='store_true', help='Emit machine-readable JSON instead of text.')
    args = parser.parse_args(argv)

    default_repo_root = Path(__file__).resolve().parents[5]
    repo_root = Path(args.repo_root).resolve() if args.repo_root else default_repo_root
    skills_root = Path(args.skills_root).resolve() if args.skills_root else (repo_root / '.opencode' / 'skills')

    if not skills_root.exists():
        print(f'ERROR: skills root not found: {skills_root}', file=sys.stderr)
        return 2

    rules = load_template_rules(_SHARED_SCRIPTS)
    all_packages = expected_root_packages(skills_root)
    available_ids = {pkg['name'] for pkg in all_packages}
    unknown_ids = sorted(set(args.packages or ()) - available_ids)
    if unknown_ids:
        print(f"ERROR: package not found in feature-catalog discovery: {', '.join(unknown_ids)}", file=sys.stderr)
        return 2
    violations = run_all_checks(skills_root, repo_root, rules, args.packages)
    selected_packages = [
        pkg for pkg in all_packages
        if not args.packages or pkg['name'] in set(args.packages)
    ]
    fail_count = sum(1 for v in violations if v.get('severity') == 'fail')
    warn_count = len(violations) - fail_count

    if args.json:
        print(json.dumps({
            'clean': not violations,
            'failed': fail_count > 0,
            'violationCount': len(violations),
            'failureCount': fail_count,
            'warningCount': warn_count,
            'packagesSeen': len(selected_packages),
            'packageVerdicts': package_verdicts(selected_packages, violations),
            'violations': violations,
        }, indent=2))
    else:
        print(format_report(violations, selected_packages))

    if not args.report_only and fail_count:
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
