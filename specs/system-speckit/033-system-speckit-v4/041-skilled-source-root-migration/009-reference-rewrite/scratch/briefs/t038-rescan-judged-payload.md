## Edit 1

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rescan-references.py`

OLD:

~~~~text
    builder = load_module(args.builder, 'build_batch_manifests')
    judged_file = Path(args.manifests) / 'judged.txt'
    judged = [l for l in judged_file.read_text().splitlines() if l.strip()] if judged_file.exists() else []
    rule = rule_module.Rule(rule_module.source_entries(repo), rule_module.load_keep(args.keep_list), args.specs_target, False, judged)
~~~~

NEW:

~~~~text
    builder = load_module(args.builder, 'build_batch_manifests')
    judged = [l for f in sorted(Path(args.manifests).glob('*judged.txt')) for l in f.read_text().splitlines() if l.strip()]
    rule = rule_module.Rule(rule_module.source_entries(repo), rule_module.load_keep(args.keep_list), args.specs_target, False, judged)
~~~~
