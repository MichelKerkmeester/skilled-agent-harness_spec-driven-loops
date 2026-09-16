#!/usr/bin/env python3
"""Deterministic seed inventory for the .opencode -> .skilled reference map.

Enumerates facts only: every symlink under the checkout, every tracked file that
names `.opencode`, and a count-only scan of home-level runtime configuration.
Classification of what each reference means is left to the research lanes, so this
script never decides whether a reference is load-bearing.

Usage: build-seed-inventory.py <repo-root> <output-dir>
"""
import csv
import os
import subprocess
import sys

RUNTIME_ROOTS = ('.claude', '.codex', '.cursor', '.devin', '.hermes', '.pi', '.opencode')
SKIP_DIRS = {'node_modules', '.git', '.worktrees'}
# barter/ links resolve into a different checkout, and the leading-space directory is
# a stray duplicate left by a fan-out run; neither belongs to this repository's map.
SKIP_TOP = {'barter', ' specs'}
NEEDLE = '.opencode'


def area_of(rel):
    parts = rel.split('/')
    top = parts[0]
    if top in RUNTIME_ROOTS and top != '.opencode':
        return f'runtime:{top[1:]}', parts[1] if len(parts) > 1 else '(root)'
    if top == '.opencode':
        if len(parts) > 3 and parts[1] == 'skills' and not parts[2].startswith('.'):
            return f'skill:{parts[2]}', skill_subarea(parts[3:])
        return f'opencode:{parts[1] if len(parts) > 1 else "(root)"}', '/'.join(parts[2:3]) or '(root)'
    if top == '.github':
        return 'ci', '/'.join(parts[1:2])
    if len(parts) == 1:
        return 'root', top
    return f'other:{top}', '/'.join(parts[1:2])


def skill_subarea(rest):
    if not rest:
        return '(root)'
    name = rest[-1]
    head = rest[0]
    if len(rest) == 1:
        return name
    if any(p in ('tests', '__tests__', 'test') for p in rest) or '.test.' in name or '.vitest.' in name:
        return 'tests'
    return head


def md_split(path):
    fenced = inline = 0
    in_fence = False
    try:
        with open(path, encoding='utf-8', errors='replace') as handle:
            for line in handle:
                if line.lstrip().startswith(('```', '~~~')):
                    in_fence = not in_fence
                    continue
                if NEEDLE in line:
                    if in_fence:
                        fenced += 1
                    else:
                        inline += 1
    except OSError:
        pass
    return fenced, inline


def symlinks(root, out):
    opencode_real = os.path.realpath(os.path.join(root, '.opencode'))
    rows = []
    for dirpath, dirnames, filenames in os.walk(root):
        rel_dir = os.path.relpath(dirpath, root)
        if rel_dir == '.':
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and d not in SKIP_TOP]
        else:
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in dirnames + filenames:
            path = os.path.join(dirpath, name)
            if not os.path.islink(path):
                continue
            rel = os.path.relpath(path, root)
            raw = os.readlink(path)
            resolved = os.path.realpath(path)
            inside = resolved == opencode_real or resolved.startswith(opencode_real + os.sep)
            top = rel.split('/')[0]
            rows.append({
                'root': top,
                'link': rel,
                'raw_target': raw,
                'target_kind': 'absolute' if os.path.isabs(raw) else 'relative',
                'resolves_into_opencode': 'yes' if inside else 'no',
                'target_names_opencode': 'yes' if NEEDLE in raw else 'no',
                'dangling': 'no' if os.path.exists(path) else 'yes',
                'resolved_rel': os.path.relpath(resolved, root) if resolved.startswith(root + os.sep) else resolved,
            })
    rows.sort(key=lambda r: r['link'])
    write(out, 'symlinks.tsv', rows)
    return rows


def tracked_refs(root, out):
    listing = subprocess.run(
        ['git', '-C', root, 'ls-files', '-s', '--', '.', ':!specs/', ':!**/node_modules/**'],
        capture_output=True, text=True, check=True).stdout.splitlines()
    link_paths = {line.split('\t', 1)[1] for line in listing if line.startswith('120000')}
    grep = subprocess.run(
        ['git', '-C', root, 'grep', '-I', '-c', '-F', NEEDLE, '--', '.', ':!specs/', ':!**/node_modules/**'],
        capture_output=True, text=True).stdout.splitlines()
    rows = []
    for line in grep:
        rel, _, count = line.rpartition(':')
        if rel in link_paths:
            continue
        area, sub = area_of(rel)
        ext = os.path.splitext(rel)[1].lstrip('.') or os.path.basename(rel)
        fenced = inline = ''
        if rel.endswith('.md'):
            fenced, inline = md_split(os.path.join(root, rel))
        rows.append({'path': rel, 'hit_lines': int(count), 'area': area, 'subarea': sub, 'ext': ext,
                     'md_fenced_lines': fenced, 'md_inline_lines': inline})
    rows.sort(key=lambda r: (r['area'], r['path']))
    write(out, 'tracked-refs.tsv', rows)
    return rows


def main_checkout(root):
    common = subprocess.run(['git', '-C', root, 'rev-parse', '--path-format=absolute', '--git-common-dir'],
                            capture_output=True, text=True, check=True).stdout.strip()
    return os.path.dirname(os.path.realpath(common))


def home_refs(root, out):
    home = os.path.expanduser('~')
    main_root = main_checkout(root)
    candidates = [
        '.codex/hooks.json', '.codex/config.toml', '.codex/AGENTS.md',
        '.hermes/config.yaml', '.claude/settings.json', '.claude.json', '.claude/CLAUDE.md',
        '.zshrc', '.zshenv', '.gitconfig', '.config/git/config',
    ]
    for base in ('.config/devin', '.pi/agent'):
        full = os.path.join(home, base)
        if os.path.isdir(full):
            for name in sorted(os.listdir(full)):
                candidates.append(f'{base}/{name}')
    rows = []
    for rel in candidates:
        path = os.path.join(home, rel)
        if os.path.isdir(path) and not os.path.islink(path):
            continue
        entry = {'path': f'~/{rel}', 'exists': 'yes' if os.path.lexists(path) else 'no',
                 'is_symlink': 'yes' if os.path.islink(path) else 'no',
                 'link_target': os.readlink(path) if os.path.islink(path) else '',
                 'opencode_occurrences': '', 'names_main_checkout': ''}
        if os.path.isfile(path):
            try:
                text = open(path, encoding='utf-8', errors='replace').read()
                entry['opencode_occurrences'] = text.count(NEEDLE)
                entry['names_main_checkout'] = 'yes' if main_root in text else 'no'
            except OSError:
                pass
        rows.append(entry)
    hooks_dir = os.path.join(home, '.config/git/hooks')
    if os.path.isdir(hooks_dir):
        for name in sorted(os.listdir(hooks_dir)):
            path = os.path.join(hooks_dir, name)
            rows.append({'path': f'~/.config/git/hooks/{name}', 'exists': 'yes',
                         'is_symlink': 'yes' if os.path.islink(path) else 'no',
                         'link_target': os.readlink(path) if os.path.islink(path) else '',
                         'opencode_occurrences': '', 'names_main_checkout': ''})
    write(out, 'home-refs.tsv', rows)
    return rows


def write(out, name, rows):
    path = os.path.join(out, name)
    with open(path, 'w', newline='') as handle:
        if not rows:
            handle.write('')
            return
        writer = csv.DictWriter(handle, fieldnames=list(rows[0].keys()), delimiter='\t')
        writer.writeheader()
        writer.writerows(rows)


def summary(out, links, refs, home):
    lines = ['# Seed Inventory Summary', '',
             'Facts enumerated by `build-seed-inventory.py`. No row is classified here.', '']
    lines += ['## Symlinks by root', '', '| Root | All links | Resolve into .opencode | Absolute targets | Dangling |', '|---|---:|---:|---:|---:|']
    roots = sorted({r['root'] for r in links})
    for root in roots:
        subset = [r for r in links if r['root'] == root]
        lines.append(f"| `{root}` | {len(subset)} | {sum(r['resolves_into_opencode'] == 'yes' for r in subset)} | "
                     f"{sum(r['target_kind'] == 'absolute' for r in subset)} | {sum(r['dangling'] == 'yes' for r in subset)} |")
    lines += ['', '## Tracked files naming .opencode, by area', '', 'Counts are matching lines, not occurrences. Markdown lines are split by whether they sit inside a code fence.', '', '| Area | Files | Matching lines | Markdown lines in fences | Markdown lines inline |', '|---|---:|---:|---:|---:|']
    areas = {}
    for r in refs:
        a = areas.setdefault(r['area'], [0, 0, 0, 0])
        a[0] += 1
        a[1] += r['hit_lines']
        a[2] += r['md_fenced_lines'] or 0
        a[3] += r['md_inline_lines'] or 0
    for area in sorted(areas, key=lambda k: (-areas[k][0], k)):
        f, h, fe, il = areas[area]
        lines.append(f'| `{area}` | {f} | {h} | {fe} | {il} |')
    lines += ['', f'Totals: {len(refs)} files, {sum(r["hit_lines"] for r in refs)} matching lines.', '',
              '## Home-level configuration (counts only, no content)', '',
              f'{sum(1 for r in home if r["exists"] == "yes")} of {len(home)} candidate paths exist. See `home-refs.tsv`.', '']
    open(os.path.join(out, 'summary.md'), 'w').write('\n'.join(lines))


def main():
    root = os.path.realpath(sys.argv[1])
    out = sys.argv[2]
    os.makedirs(out, exist_ok=True)
    links = symlinks(root, out)
    refs = tracked_refs(root, out)
    home = home_refs(root, out)
    summary(out, links, refs, home)
    print(f'symlinks={len(links)} tracked_ref_files={len(refs)} home_rows={len(home)}')


if __name__ == '__main__':
    main()
