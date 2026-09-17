#!/usr/bin/env python3
"""rescan-references.py: classify every `.opencode` occurrence left in tracked files outside specs.

Classes: freeze, generated, routed-005, routed-006, routed-010, never, kept (a dual-root line, a keep-list line, a
`.opencode/specs` alias reference while the specs target is keep, or an occurrence a recorded keep decision names)
and unclassified. The handoff gate requires unclassified to be zero. Files a path class covers are counted by path,
without a line class.

Usage: rescan-references.py --repo <worktree> --manifests <dir> --rule <rewrite-batch.py> --builder <build-batch-manifests.py>
                            --ledgers <dir> [--keep-list <tsv>] [--specs-target keep|canonical] [--list-unclassified]
"""
import argparse, importlib.util, json, subprocess, sys
from collections import Counter
from pathlib import Path


def load_module(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--repo', required=True)
    parser.add_argument('--manifests', required=True)
    parser.add_argument('--rule', required=True)
    parser.add_argument('--builder', required=True)
    parser.add_argument('--ledgers', required=True)
    parser.add_argument('--keep-list')
    parser.add_argument('--specs-target', choices=['keep', 'canonical'], default='keep')
    parser.add_argument('--list-unclassified', action='store_true')
    args = parser.parse_args()
    repo = Path(args.repo)
    rule_module = load_module(args.rule, 'rewrite_batch')
    builder = load_module(args.builder, 'build_batch_manifests')
    judged = [l for f in sorted(Path(args.manifests).glob('*judged.txt')) for l in f.read_text().splitlines() if l.strip()]
    rule = rule_module.Rule(rule_module.source_entries(repo), rule_module.load_keep(args.keep_list), args.specs_target, False, judged)

    kept_lines = {}
    for ledger in sorted(Path(args.ledgers).glob('*.tsv')):
        for row in ledger.read_text().splitlines():
            if row.strip():
                fields = row.split('\t')
                kept_lines['\t'.join(fields[:4])] = fields[4] if len(fields) > 4 else ''
    routed = {}
    for row in (Path(args.manifests) / 'routed.tsv').read_text().splitlines():
        if row.strip():
            path, owner = row.split('\t')
            routed[path] = owner

    grep = subprocess.run(['git', '-C', str(repo), '-c', 'core.quotePath=false', 'grep', '-c', '-F', '.opencode', '--', '.',
                           ':!specs/', ':!**/node_modules/**'], capture_output=True, text=True)
    if grep.returncode not in (0, 1):
        raise SystemExit(f'git grep failed: {grep.stderr.strip()}')
    listed = grep.stdout.split('\n')
    counts, files, unclassified = Counter(), Counter(), []
    for entry in listed:
        if not entry:
            continue
        path, _, _ = entry.rpartition(':')
        freeze = next((fid for fid, pattern, carve in builder.FREEZE if builder.match(path, pattern) and not (carve and builder.match(path, carve))), None)
        if freeze:
            label = 'freeze'
        elif any(builder.match(path, g) for g in builder.GENERATED) and path not in builder.NATIVE_PROMPTS:
            label = 'generated'
        elif path in routed:
            label = f'routed-{routed[path]}'
        else:
            label = None
        raw = (repo / path).read_bytes()
        if label:
            # A frozen, generated or routed file carries its path class, so its occurrences need no line class.
            counts[label] += raw.count(b'.opencode')
            files[label] += 1
            continue
        text = raw.decode('utf-8', 'surrogateescape')
        seen = set()
        lines = text.split('\n')
        for line_no, column, cls, detail, _, line in rule.occurrences(path, text):
            if label:
                kind = label
            elif cls == 'X':
                kind = 'never'
            elif cls == 'K' or (cls == 'R2' and args.specs_target == 'keep'):
                kind = 'kept'
            elif rule.reviewable(path, cls) and rule_module.occurrence_key(path, line_no, column, line) in kept_lines:
                kind = 'kept'
            else:
                kind = 'unclassified'
                unclassified.append(f'{path}\t{line_no}\t{column}\t{cls}:{detail}\t{line.strip()[:200]}')
            counts[kind] += 1
            seen.add(kind)
        for kind in seen:
            files[kind] += 1
    result = {'occurrences': dict(sorted(counts.items())), 'files': dict(sorted(files.items())), 'unclassified': counts.get('unclassified', 0)}
    print(json.dumps(result, indent=1))
    if args.list_unclassified:
        print('\n'.join(unclassified))
    sys.exit(0 if result['unclassified'] == 0 else 1)


if __name__ == '__main__':
    main()
