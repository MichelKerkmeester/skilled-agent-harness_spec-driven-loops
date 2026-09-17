## Edit 1

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
    r"|\(\?:\s*(?:skilled\s*\|\s*opencode|opencode\s*\|\s*skilled)\s*\)"
    r"|(?<![A-Za-z0-9_.-])\.(?:skilled|opencode)\\?/?\s*(?:or|and|,|\|)\s*`?\\?\.(?:skilled|opencode)\b"
)
# The new root as a name of its own, not a piece of a longer name such as `.skilled-local`.
NEW_ROOT = re.compile(r'(?<![A-Za-z0-9_.-])\.skilled(?![A-Za-z0-9_-])')
# The OpenCode runtime's own view of its directory: a line that names the runtime keeps its paths under review.
~~~~

NEW:

~~~~text
    r"|\(\?:\s*(?:skilled\s*\|\s*opencode|opencode\s*\|\s*skilled)\s*\)"
    r"|(?<![A-Za-z0-9_.-])\.(?:skilled|opencode)\\?/?\s*(?:or|and|,|\|)\s*`?\\?\.(?:skilled|opencode)(?![A-Za-z0-9_-])(?!\.[A-Za-z0-9])"
)
# The new root as a name of its own, not a piece of a longer name such as `.skilled-local`.
NEW_ROOT = re.compile(r'(?<![A-Za-z0-9_.-])\.skilled(?![A-Za-z0-9_-])(?!\.[A-Za-z0-9])')
# The OpenCode runtime's own view of its directory: a line that names the runtime keeps its paths under review.
~~~~

## Edit 2

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
            return False
        return bool(re.search(r'(?<![A-Za-z0-9_.-])' + re.escape(NEW + rest.group(1)) + r'(?![A-Za-z0-9_./-])', text))

    @staticmethod
~~~~

NEW:

~~~~text
            return False
        for match in re.finditer(r'(?<![A-Za-z0-9_.-])' + re.escape(NEW + rest.group(1)) + r'(?![A-Za-z0-9_./-])', text):
            cut = match.start()
            while cut > 0 and text[cut - 1] not in PATH_DELIMITERS:
                cut -= 1
            owner = text[cut:match.start()]
            if '://' not in owner and not owner.startswith('//'):
                return True
        return False

    @staticmethod
~~~~

## Edit 3

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
        closer = prefix[cut - 1] if cut > 0 else ''
        if closer in '}>':
            return True
        if closer != ')':
            return False
        depth = 0
        for index in range(cut - 1, -1, -1):
            if prefix[index] == ')':
                depth += 1
            elif prefix[index] == '(':
                depth -= 1
                if depth == 0:
                    return index > 0 and prefix[index - 1] == '$'
        return False
~~~~

NEW:

~~~~text
        closer = prefix[cut - 1] if cut > 0 else ''
        opener = {'}': '{', '>': '<', ')': '('}.get(closer)
        if not opener:
            return False
        depth = 0
        for index in range(cut - 1, -1, -1):
            if prefix[index] == closer:
                depth += 1
            elif prefix[index] == opener:
                depth -= 1
                if depth == 0:
                    return closer != ')' or (index > 0 and prefix[index - 1] == '$')
        return False
~~~~

## Edit 4

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
        # both root names. A variable, placeholder or command substitution closing right before it roots it instead.
        if path_prefix == '/' and not escaped and not self.rooted_by(prefix, cut):
            return 'R3', 'root-fragment', None
~~~~

NEW:

~~~~text
        # both root names. A variable, placeholder or command substitution closing right before it roots it instead.
        lone = path_prefix == '/' and not escaped
        escaped_lone = path_prefix != '/' and path_prefix.replace('\\', '') == '/'
        if (lone or escaped_lone) and not self.rooted_by(prefix, cut):
            return 'R3', 'root-fragment', None
~~~~

## Edit 5

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
    decided = set()
    for rel, line_no, column, digest, action, reason in rows:
        if (rel, line_no, column) in decided:
~~~~

NEW:

~~~~text
    decided = set()
    manifest_paths = set(paths)
    for rel, line_no, column, digest, action, reason in rows:
        if rel not in manifest_paths:
            raise SystemExit(f'decision names a path outside the manifests: {rel}; nothing written')
        if (rel, line_no, column) in decided:
~~~~

## Edit 6

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
    outputs, ledger_rows, total_lines = {}, [], 0
    for rel in dict.fromkeys(list(paths) + [r[0] for r in rows]):
        text = texts.get(rel) if rel in texts else read_text(repo / rel)
~~~~

NEW:

~~~~text
    outputs, ledger_rows, total_lines = {}, [], 0
    for rel in dict.fromkeys(paths):
        text = texts.get(rel) if rel in texts else read_text(repo / rel)
~~~~

## Edit 7

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
        ('a.md', 'run .opencode/skills/x; foo.skilled or .opencode', 'R1'),
        ('a.md', 'see //example.com/.opencode/skills/x', 'R3'),
~~~~

NEW:

~~~~text
        ('a.md', 'run .opencode/skills/x; foo.skilled or .opencode', 'R1'),
        ('a.sh', 'echo >/.opencode/skills/x', 'R3'),
        ('a.js', "const p = '(?<=foo)\\/\\.opencode\\/skills\\/x'", 'R3'),
        ('a.md', 'run .opencode or .skilled-local', 'R3'),
        ('a.md', 'the tree sits under .skilled or .opencode.', 'K'),
        ('a.md', 'copy .opencode/skills/x or https://example.com/.skilled/skills/x', 'R1'),
        ('a.md', 'see //example.com/.opencode/skills/x', 'R3'),
~~~~

## Edit 8

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
            pass
    if not NEW_ROOT.search('under .skilled/skills') or NEW_ROOT.search('backup lives in .skilled-local'):
        failures += 1
~~~~

NEW:

~~~~text
            pass
    if not NEW_ROOT.search('under .skilled/skills') or NEW_ROOT.search('backup lives in .skilled-local') or NEW_ROOT.search('see .skilled.json'):
        failures += 1
~~~~
