## Edit 1

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rescan-references.py`

OLD:

~~~~text
`.opencode/specs` alias reference or a line a recorded keep decision names) and unclassified. The handoff gate
requires unclassified to be zero. Binary files are counted by path, because their bytes are not line-classified.

Usage: rescan-references.py --repo <worktree> --manifests <dir> --rule <rewrite-batch.py> --ledgers <dir> [--list-unclassified]
~~~~

NEW:

~~~~text
`.opencode/specs` alias reference or a line a recorded keep decision names) and unclassified. The handoff gate
requires unclassified to be zero. Files a path class covers are counted by path, without a line class.

Usage: rescan-references.py --repo <worktree> --manifests <dir> --rule <rewrite-batch.py> --ledgers <dir> [--list-unclassified]
~~~~

## Edit 2

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rescan-references.py`

OLD:

~~~~text
                fields = row.split('\t')
                kept_lines['\t'.join(fields[:3])] = fields[3] if len(fields) > 3 else ''
    routed = {}
~~~~

NEW:

~~~~text
                fields = row.split('\t')
                kept_lines['\t'.join(fields[:4])] = fields[4] if len(fields) > 4 else ''
    routed = {}
~~~~

## Edit 3

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rescan-references.py`

OLD:

~~~~text
            routed[path] = owner

    listed = subprocess.run(['git', '-C', str(repo), '-c', 'core.quotePath=false', 'grep', '-c', '-F', '.opencode', '--', '.',
                             ':!specs/', ':!**/node_modules/**'], capture_output=True, text=True, check=True).stdout.split('\n')
    counts, files, unclassified = Counter(), Counter(), []
~~~~

NEW:

~~~~text
            routed[path] = owner

    grep = subprocess.run(['git', '-C', str(repo), '-c', 'core.quotePath=false', 'grep', '-c', '-F', '.opencode', '--', '.',
                           ':!specs/', ':!**/node_modules/**'], capture_output=True, text=True)
    if grep.returncode not in (0, 1):
        raise SystemExit(f'git grep failed: {grep.stderr.strip()}')
    listed = grep.stdout.split('\n')
    counts, files, unclassified = Counter(), Counter(), []
~~~~

## Edit 4

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rescan-references.py`

OLD:

~~~~text
        raw = (repo / path).read_bytes()
        if label and b'\0' in raw[:8000]:
            # A binary file carries its path class, since its bytes hold no lines to classify.
            counts[label] += raw.count(b'.opencode')
~~~~

NEW:

~~~~text
        raw = (repo / path).read_bytes()
        if label:
            # A frozen, generated or routed file carries its path class, so its occurrences need no line class.
            counts[label] += raw.count(b'.opencode')
~~~~

## Edit 5

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rescan-references.py`

OLD:

~~~~text
                kind = 'kept'
            elif rule_module.line_key(path, line_no, line) in kept_lines:
                kind = 'kept'
~~~~

NEW:

~~~~text
                kind = 'kept'
            elif rule_module.occurrence_key(path, line_no, column, line) in kept_lines:
                kind = 'kept'
~~~~
