#!/usr/bin/env python3
"""Merge the two research lanes' per-row maps into one reconciled map.

The swe2 lane mapped every seed row individually, so its rows are the base. The
deepseek-pi lane mapped links, runtime files and code individually but grouped
documentation, so it serves as the second lens wherever it has a row. Every
disagreement between the lanes was settled by reading the tree; each settlement is
a named rule below, and every output row records which rule, if any, decided it.

Usage: build-reconciled-map.py <packet-phase-dir> <repo-root>
"""
import collections
import csv
import glob
import json
import os
import re
import subprocess
import sys

CLASSES = {'mechanical', 'regenerate', 'manual', 'freeze', 'none', 'blocker'}
ROOT_DOCS = {'AGENTS.md', 'README.md', 'CLAUDE.md', 'PUBLIC-RELEASE.md', 'CONTRIBUTING.md',
             'REPO RULES.md', 'opencode.json', '.gitignore', '.utcp_config.json', '.mcp.json'}

# Files the tree shows are written by a generator, so they are rebuilt rather than edited.
GENERATED = [
    (re.compile(r'^\.opencode/skills/[^/]+/graph-metadata\.json$'), 'regenerate-skill-derived.cjs'),
    (re.compile(r'^\.opencode/skills/system-spec-kit/runtime/data/trigger-index\.json$'), 'generate-trigger-index.mjs'),
    (re.compile(r'^\.opencode/bin/lib/compiled-routing/serving-closure\.manifest\.json$'), 'compiled-route-sync.cjs'),
    (re.compile(r'^\.cursor/rules/skill-routing\.md$'), 'sync-gate1-pointers.cjs'),
    (re.compile(r'^\.codex/AGENTS\.md$'), 'sync-gate1-pointers.cjs'),
    (re.compile(r'^\.opencode/skills/system-deep-loop/runtime/database/council-graph\.sqlite$'), 'an owning command not yet identified; it is a tracked SQLite database, so never text-rewrite it'),
]
FALSE_FREEZE = re.compile(r'^\.opencode/skills/system-skill-advisor/runtime/tests/cache/')
HAND_KEPT_REGISTRY = re.compile(r'(^|/)(mode-registry|command-metadata)\.json$')
FIXTURE = re.compile(r'/(test-)?fixtures?/')
DIST_LINKS = {'.opencode/skills/system-spec-kit/runtime/cli/runtime', '.opencode/skills/system-spec-kit/runtime/shared'}


def parse_lane(lane_dir):
    rows = collections.defaultdict(dict)
    for path in sorted(glob.glob(os.path.join(lane_dir, 'working', '*.md'))):
        name = os.path.basename(path)
        family = ('A' if name.startswith('map-a') else 'home' if name.startswith('map-b-home')
                  else 'B' if name.startswith('map-b') else 'C' if name.startswith('map-c') else None)
        if family is None:
            continue
        header = None
        for line in open(path, errors='replace'):
            if not line.startswith('|'):
                header = None
                continue
            cells = [c.strip() for c in line.strip().strip('|').split('|')]
            if header is None:
                header = [c.strip('` ').lower() for c in cells]
                continue
            if set(''.join(cells)) <= set('-: '):
                continue
            key = cells[0].strip('`').strip()
            if not (key.startswith(('.', '~', 'specs/')) or '/' in key or key in ROOT_DOCS):
                continue
            classes = [c.strip('`* ') for c in cells if c.strip('`* ') in CLASSES]
            if not classes:
                continue
            record = {h: c.strip('`') for h, c in zip(header, cells)}
            record['class'] = classes[-1]
            rows[family][key] = record
    return rows


def field(record, *needles):
    for key, value in record.items():
        if any(n in key for n in needles):
            return value
    return ''


def load_tsv(path):
    with open(path) as handle:
        return list(csv.DictReader(handle, delimiter='\t'))


def write_tsv(path, rows, fields):
    with open(path, 'w', newline='') as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, delimiter='\t', extrasaction='ignore')
        writer.writeheader()
        writer.writerows(rows)


def decide(key, family, base, other):
    """Return (class, basis, note) for one row."""
    for pattern, owner in GENERATED:
        if pattern.search(key):
            agreed = other and other['class'] == 'regenerate' and base and base['class'] == 'regenerate'
            return 'regenerate', 'both-lanes' if agreed else 'rule:generated', f'rebuilt by {owner}'
    if FALSE_FREEZE.search(key):
        return 'mechanical', 'rule:false-freeze', 'a test and its README, not a cache record'
    if HAND_KEPT_REGISTRY.search(key) and not FIXTURE.search(key):
        return base['class'] if base else 'mechanical', 'rule:hand-kept-registry', 'hand-kept copy guarded by command-catalog-mirror-check.cjs, which states it is not generated'
    if key in DIST_LINKS:
        return 'none', 'rule:dist-link-travels-intact', 'relative link into build output; the link needs no change, the dist it points at is rebuilt'
    if key == '~/.pi/agent/trust.json':
        return 'none', 'rule:root-keyed-trust', 'names the checkout root, not .opencode, so it survives the move'
    if key == '~/.pi/agent/pi-crash.log':
        return 'none', 'rule:log-not-config', 'crash log content, not configuration'
    if base is None and other is None:
        return None, 'no-lane-row', ''
    if base is None:
        return other['class'], 'deepseek-pi only', 'row absent from the swe2 lane'
    if other is None:
        return base['class'], 'swe2 only', ''
    if base['class'] == other['class']:
        return base['class'], 'both-lanes', ''
    pair = (base['class'], other['class'])
    if FIXTURE.search(key) and pair == ('mechanical', 'manual'):
        return 'manual', 'rule:recorded-fixture (judgment)', 'recorded or golden fixture; rewrite only together with the assertion that reads it'
    if FIXTURE.search(key) and pair == ('mechanical', 'regenerate'):
        return 'mechanical', 'rule:fixture-not-generated', 'the generator never reads test fixtures'
    if family == 'A' and key.startswith('.opencode/') and pair == ('none', 'mechanical'):
        return 'none', 'rule:internal-relative-link', 'link and target move together; the deepseek-pi row itself lists both targets as unchanged'
    if pair == ('manual', 'mechanical'):
        return 'manual', 'rule:contract-or-ci', 'defines what .opencode means or scopes a gate on it; a blind rewrite changes behaviour or silences a check'
    if family == 'A' and key.startswith('specs/') and pair == ('none', 'freeze'):
        return 'none', 'rule:specs-link-needs-no-change', 'specs/ is outside the move and this link does not resolve into .opencode'
    if key == '.opencode/specs':
        return base['class'], 'rule:layout-dependent', 'created by spec-root-migration.ts; whether a compatibility .opencode needs its own copy is a layout decision'
    if key.endswith('benchmark/reply-harness/cases.json'):
        return base['class'], 'rule:benchmark-input-not-report', 'benchmark input definitions, not a recorded run'
    return base['class'], 'UNRESOLVED', f'swe2={pair[0]} deepseek-pi={pair[1]}'


def main():
    phase_dir, repo = sys.argv[1], os.path.realpath(sys.argv[2])
    seed = os.path.join(phase_dir, 'scratch', 'seed-inventory')
    lanes = os.path.join(phase_dir, 'research', 'lineages')
    swe2 = parse_lane(os.path.join(lanes, 'swe2'))
    pi = parse_lane(os.path.join(lanes, 'deepseek-pi'))
    out = os.path.join(phase_dir, 'research', 'maps')
    os.makedirs(out, exist_ok=True)
    ledger = collections.Counter()
    unresolved = []

    links = load_tsv(os.path.join(seed, 'symlinks.tsv'))
    a_rows = []
    for link in links:
        key = link['link']
        base, other = swe2['A'].get(key), pi['A'].get(key)
        cls, basis, note = decide(key, 'A', base, other)
        ledger[('A', basis)] += 1
        if basis == 'UNRESOLVED':
            unresolved.append(key)
        src = other or {}
        a_rows.append({**link, 'origin': field(base or src, 'origin'), 'class': cls,
                       'target_if_opencode_compat_kept': field(src, 'compat link survives', 'with `.opencode` compat', 'with .opencode compat') or field(base or {}, 'post-move'),
                       'target_if_no_compat': field(src, 'no `.opencode` compat', 'no compat') or field(base or {}, 'post-move'),
                       'class_basis': basis, 'note': note})
    write_tsv(os.path.join(out, 'map-a-symlinks.tsv'), a_rows,
              ['root', 'link', 'raw_target', 'target_kind', 'resolves_into_opencode', 'dangling', 'origin', 'class',
               'target_if_opencode_compat_kept', 'target_if_no_compat', 'class_basis', 'note'])

    refs = load_tsv(os.path.join(seed, 'tracked-refs.tsv'))
    known = {r['path'] for r in refs}
    listing = subprocess.run(['git', '-C', repo, 'grep', '-l', '-F', '.opencode', '--', '.', ':!specs/', ':!**/node_modules/**'],
                             capture_output=True, text=True).stdout.split()
    for path in sorted(set(listing) - known):
        count = subprocess.run(['git', '-C', repo, 'grep', '-c', '-F', '.opencode', '--', path],
                               capture_output=True, text=True).stdout.strip().rpartition(':')[2]
        area = 'skill:' + path.split('/')[2] if path.startswith('.opencode/skills/') else 'other'
        refs.append({'path': path, 'hit_lines': count, 'area': area, 'subarea': 'binary-detected', 'ext': os.path.splitext(path)[1].lstrip('.'),
                     'md_fenced_lines': '', 'md_inline_lines': '', 'seed_gap': 'yes'})
    b_rows, c_rows = [], []
    for ref in refs:
        key = ref['path']
        family = 'B' if ref['area'].startswith('runtime:') else 'C'
        base, other = swe2[family].get(key), pi[family].get(key)
        cls, basis, note = decide(key, family, base, other)
        if basis == 'no-lane-row':
            cls, basis, note = 'mechanical', 'orchestrator (seed gap)', 'found after the seed; neither lane mapped it'
        if ref.get('seed_gap') == 'yes':
            note = (note + '; ' if note else '') + 'missed by the seed because git treats the file as binary'
        ledger[(family, basis)] += 1
        if basis == 'UNRESOLVED':
            unresolved.append(key)
        src = base or other or {}
        row = {**ref, 'what_it_is': field(src, 'what'), 'origin': field(src, 'origin', 'generated'),
               'needed_change': field(src, 'needed change', 'change needed'), 'class': cls, 'class_basis': basis, 'note': note}
        (b_rows if family == 'B' else c_rows).append(row)
    write_tsv(os.path.join(out, 'map-b-runtime-files.tsv'), b_rows,
              ['area', 'path', 'hit_lines', 'what_it_is', 'origin', 'needed_change', 'class', 'class_basis', 'note'])
    write_tsv(os.path.join(out, 'map-c-references.tsv'), c_rows,
              ['area', 'subarea', 'path', 'ext', 'hit_lines', 'md_fenced_lines', 'md_inline_lines', 'what_it_is', 'origin',
               'needed_change', 'class', 'class_basis', 'note'])

    home = load_tsv(os.path.join(seed, 'home-refs.tsv'))
    h_rows = []
    for entry in home:
        key = entry['path']
        base, other = swe2['home'].get(key), pi['home'].get(key)
        cls, basis, note = decide(key, 'home', base, other)
        if basis == 'no-lane-row':
            cls, basis, note = ('blocker', 'orchestrator (verified)', 'absolute symlink into the main checkout git hooks') if '/.config/git/hooks/' in key else ('none', 'orchestrator', 'no lane row')
        ledger[('home', basis)] += 1
        h_rows.append({**entry, 'needed_change': field(base or other or {}, 'needed change', 'change needed'),
                       'class': cls, 'class_basis': basis, 'note': note})
    write_tsv(os.path.join(out, 'map-b-home.tsv'), h_rows,
              ['path', 'exists', 'is_symlink', 'link_target', 'opencode_occurrences', 'names_main_checkout', 'needed_change', 'class', 'class_basis', 'note'])

    summary = {'rows': {'A': len(a_rows), 'B': len(b_rows), 'C': len(c_rows), 'home': len(h_rows)},
               'class_totals': {fam: dict(collections.Counter(r['class'] for r in rows))
                                for fam, rows in (('A', a_rows), ('B', b_rows), ('C', c_rows), ('home', h_rows))},
               'basis': {f'{fam}:{basis}': n for (fam, basis), n in sorted(ledger.items())},
               'unresolved': unresolved}
    json.dump(summary, open(os.path.join(out, 'reconciliation.json'), 'w'), indent=2)
    print(json.dumps(summary, indent=2))


if __name__ == '__main__':
    main()
