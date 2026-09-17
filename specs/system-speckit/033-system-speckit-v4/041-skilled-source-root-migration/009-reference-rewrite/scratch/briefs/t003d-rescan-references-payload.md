## Edit 1

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rescan-references.py`

OLD:

~~~~text
    builder = load_module(args.builder, 'build_batch_manifests')
    rule = rule_module.Rule(rule_module.source_entries(repo), rule_module.load_keep(args.keep_list), args.specs_target)

    kept_lines = {}
~~~~

NEW:

~~~~text
    builder = load_module(args.builder, 'build_batch_manifests')
    judged_file = Path(args.manifests) / 'judged.txt'
    judged = [l for l in judged_file.read_text().splitlines() if l.strip()] if judged_file.exists() else []
    rule = rule_module.Rule(rule_module.source_entries(repo), rule_module.load_keep(args.keep_list), args.specs_target, False, judged)

    kept_lines = {}
~~~~

## Edit 2

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rescan-references.py`

OLD:

~~~~text
                kind = 'kept'
            elif rule_module.occurrence_key(path, line_no, column, line) in kept_lines:
                kind = 'kept'
~~~~

NEW:

~~~~text
                kind = 'kept'
            elif rule.reviewable(path, cls) and rule_module.occurrence_key(path, line_no, column, line) in kept_lines:
                kind = 'kept'
~~~~
