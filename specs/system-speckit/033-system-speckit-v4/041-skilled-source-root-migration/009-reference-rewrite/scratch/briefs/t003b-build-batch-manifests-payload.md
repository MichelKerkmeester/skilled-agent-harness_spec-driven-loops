## Edit 1

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/build-batch-manifests.py`

OLD:

~~~~text
    rule = rule_module.Rule(rule_module.source_entries(repo))

    listed = subprocess.run(['git', '-C', str(repo), '-c', 'core.quotePath=false', 'grep', '-l', '-F', '.opencode', '--', '.',
                             ':!specs/', ':!**/node_modules/**'], capture_output=True, text=True, check=True).stdout.split('\n')
    candidates = sorted(p for p in listed if p)
~~~~

NEW:

~~~~text
    rule = rule_module.Rule(rule_module.source_entries(repo))

    grep = subprocess.run(['git', '-C', str(repo), '-c', 'core.quotePath=false', 'grep', '-l', '-F', '.opencode', '--', '.',
                           ':!specs/', ':!**/node_modules/**'], capture_output=True, text=True)
    if grep.returncode not in (0, 1):
        raise SystemExit(f'git grep failed: {grep.stderr.strip()}')
    listed = grep.stdout.split('\n')
    candidates = sorted(p for p in listed if p)
~~~~

## Edit 2

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/build-batch-manifests.py`

OLD:

~~~~text
            continue
        text = (repo / path).read_text(errors='surrogateescape')
        classes = Counter(o[2] for o in rule.occurrences(path, text))
~~~~

NEW:

~~~~text
            continue
        text = (repo / path).read_bytes().decode('utf-8', 'surrogateescape')
        classes = Counter(o[2] for o in rule.occurrences(path, text))
~~~~
