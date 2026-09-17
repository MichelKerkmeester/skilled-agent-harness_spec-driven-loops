## Edit 1

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rescan-references.py`

OLD:

~~~~text
Classes: freeze, generated, routed-005, routed-006, routed-010, never, kept (a dual-root line, a keep-list line, a
`.opencode/specs` alias reference or a line a recorded keep decision names) and unclassified. The handoff gate
requires unclassified to be zero. Files a path class covers are counted by path, without a line class.

Usage: rescan-references.py --repo <worktree> --manifests <dir> --rule <rewrite-batch.py> --ledgers <dir> [--list-unclassified]
"""
~~~~

NEW:

~~~~text
Classes: freeze, generated, routed-005, routed-006, routed-010, never, kept (a dual-root line, a keep-list line, a
`.opencode/specs` alias reference while the specs target is keep, or an occurrence a recorded keep decision names)
and unclassified. The handoff gate requires unclassified to be zero. Files a path class covers are counted by path,
without a line class.

Usage: rescan-references.py --repo <worktree> --manifests <dir> --rule <rewrite-batch.py> --builder <build-batch-manifests.py>
                            --ledgers <dir> [--keep-list <tsv>] [--specs-target keep|canonical] [--list-unclassified]
"""
~~~~

## Edit 2

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rescan-references.py`

OLD:

~~~~text
    parser.add_argument('--ledgers', required=True)
    parser.add_argument('--list-unclassified', action='store_true')
~~~~

NEW:

~~~~text
    parser.add_argument('--ledgers', required=True)
    parser.add_argument('--keep-list')
    parser.add_argument('--specs-target', choices=['keep', 'canonical'], default='keep')
    parser.add_argument('--list-unclassified', action='store_true')
~~~~

## Edit 3

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rescan-references.py`

OLD:

~~~~text
    builder = load_module(args.builder, 'build_batch_manifests')
    rule = rule_module.Rule(rule_module.source_entries(repo))

    kept_lines = {}
~~~~

NEW:

~~~~text
    builder = load_module(args.builder, 'build_batch_manifests')
    rule = rule_module.Rule(rule_module.source_entries(repo), rule_module.load_keep(args.keep_list), args.specs_target)

    kept_lines = {}
~~~~

## Edit 4

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rescan-references.py`

OLD:

~~~~text
                kind = 'never'
            elif cls in ('K', 'R2'):
                kind = 'kept'
~~~~

NEW:

~~~~text
                kind = 'never'
            elif cls == 'K' or (cls == 'R2' and args.specs_target == 'keep'):
                kind = 'kept'
~~~~
