## Edit 1

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/build-batch-manifests.py`

OLD:

~~~~text
one), noop (nothing the rule would edit) or a batch. Batches group files by the surface they belong to, so a commit
can carry the generator output its files feed. Paths are read from the working tree at HEAD, never from a map.

Usage: build-batch-manifests.py --repo <worktree> --maps <map dir> --rule <rewrite-batch.py> --out <dir>
"""
~~~~

NEW:

~~~~text
one), noop (nothing the rule would edit) or a batch. Batches group files by the surface they belong to, so a commit
can carry the generator output its files feed. A file that already names `.skilled` knows both roots, so it joins the
dual-root batch, whose every occurrence takes a decision, and `judged.txt` lists it. Paths are read from the working
tree at HEAD, never from a map.

Usage: build-batch-manifests.py --repo <worktree> --maps <map dir> --rule <rewrite-batch.py> --out <dir>
                               [--keep-list <tsv>] [--specs-target keep|canonical]
"""
~~~~

## Edit 2

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/build-batch-manifests.py`

OLD:

~~~~text
    parser.add_argument('--out', required=True)
    args = parser.parse_args()
~~~~

NEW:

~~~~text
    parser.add_argument('--out', required=True)
    parser.add_argument('--keep-list')
    parser.add_argument('--specs-target', choices=['keep', 'canonical'], default='keep')
    args = parser.parse_args()
~~~~

## Edit 3

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/build-batch-manifests.py`

OLD:

~~~~text
    spec.loader.exec_module(rule_module)
    rule = rule_module.Rule(rule_module.source_entries(repo))

    grep = subprocess.run(['git', '-C', str(repo), '-c', 'core.quotePath=false', 'grep', '-l', '-F', '.opencode', '--', '.',
~~~~

NEW:

~~~~text
    spec.loader.exec_module(rule_module)
    rule = rule_module.Rule(rule_module.source_entries(repo), rule_module.load_keep(args.keep_list), args.specs_target)

    grep = subprocess.run(['git', '-C', str(repo), '-c', 'core.quotePath=false', 'grep', '-l', '-F', '.opencode', '--', '.',
~~~~

## Edit 4

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/build-batch-manifests.py`

OLD:

~~~~text
    census_by_group = defaultdict(Counter)
    for path in candidates:
~~~~

NEW:

~~~~text
    census_by_group = defaultdict(Counter)
    census_rows, judged = [], []
    for path in candidates:
~~~~

## Edit 5

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/build-batch-manifests.py`

OLD:

~~~~text
        classes = Counter(o[2] for o in rule.occurrences(path, text))
        if not classes.get('R1') and not classes.get('R3'):
            buckets['noop'].append(f"{path}\t{','.join(f'{k}={v}' for k, v in sorted(classes.items()))}")
            continue
        group = group_of(path)
        batches[group].append(path)
        census_by_group[group].update(classes)

    out.mkdir(parents=True, exist_ok=True)
~~~~

NEW:

~~~~text
        classes = Counter(o[2] for o in rule.occurrences(path, text))
        specs_edit = args.specs_target == 'canonical' and classes.get('R2')
        if not classes.get('R1') and not classes.get('R3') and not specs_edit:
            buckets['noop'].append(f"{path}\t{','.join(f'{k}={v}' for k, v in sorted(classes.items()))}")
            continue
        if rule_module.NEW in text:
            group = 'dual-root'
            judged.append(path)
        else:
            group = group_of(path)
        batches[group].append(path)
        census_by_group[group].update(classes)
        census_rows.append('\t'.join([path] + [str(classes.get(c, 0)) for c in ('R1', 'R2', 'R3', 'K', 'X')]))

    out.mkdir(parents=True, exist_ok=True)
~~~~

## Edit 6

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/build-batch-manifests.py`

OLD:

~~~~text
    (out / 'routed.tsv').write_text('\n'.join(routed) + '\n')
    groups = {}
~~~~

NEW:

~~~~text
    (out / 'routed.tsv').write_text('\n'.join(routed) + '\n')
    (out / 'judged.txt').write_text(''.join(f'{p}\n' for p in judged))
    (out / 'census-before.tsv').write_text('path\tR1\tR2\tR3\tK\tX\n' + ''.join(f'{r}\n' for r in census_rows))
    groups = {}
~~~~

## Edit 7

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/build-batch-manifests.py`

OLD:

~~~~text
    summary['batched_files'] = sum(g['files'] for g in groups.values())
    summary['groups'] = groups
~~~~

NEW:

~~~~text
    summary['batched_files'] = sum(g['files'] for g in groups.values())
    summary['judged_files'] = len(judged)
    summary['specs_target'] = args.specs_target
    summary['batched_occurrences'] = dict(sorted(sum((census_by_group[g] for g in batches), Counter()).items()))
    summary['groups'] = groups
~~~~
