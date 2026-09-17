## Edit 1

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
    r"|\(\?:\s*(?:skilled\s*\|\s*opencode|opencode\s*\|\s*skilled)\s*\)"
    r"|\.(?:skilled|opencode)\\?/?\s*(?:or|and|,|\|)\s*`?\\?\.(?:skilled|opencode)\b"
)
# The OpenCode runtime's own view of its directory: a line that names the runtime keeps its paths under review.
~~~~

NEW:

~~~~text
    r"|\(\?:\s*(?:skilled\s*\|\s*opencode|opencode\s*\|\s*skilled)\s*\)"
    r"|(?<![A-Za-z0-9_.-])\.(?:skilled|opencode)\\?/?\s*(?:or|and|,|\|)\s*`?\\?\.(?:skilled|opencode)\b"
)
# The new root as a name of its own, not a piece of a longer name such as `.skilled-local`.
NEW_ROOT = re.compile(r'(?<![A-Za-z0-9_.-])\.skilled(?![A-Za-z0-9_-])')
# The OpenCode runtime's own view of its directory: a line that names the runtime keeps its paths under review.
~~~~

## Edit 2

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
            return False
        return bool(re.search(re.escape(NEW + rest.group(1)) + r'(?![A-Za-z0-9_./-])', text))

    def keep(self, path, text):
~~~~

NEW:

~~~~text
            return False
        return bool(re.search(r'(?<![A-Za-z0-9_.-])' + re.escape(NEW + rest.group(1)) + r'(?![A-Za-z0-9_./-])', text))

    @staticmethod
    def rooted_by(prefix, cut):
        """True when a variable (`${x}`), a placeholder (`<repo>`) or a command substitution (`$(pwd)`) closes before the slash."""
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

    def keep(self, path, text):
~~~~

## Edit 3

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
        # both root names. A variable, placeholder or command substitution closing right before it roots it instead.
        if path_prefix == '/' and not escaped and (cut == 0 or prefix[cut - 1] not in '})>'):
            return 'R3', 'root-fragment', None
~~~~

NEW:

~~~~text
        # both root names. A variable, placeholder or command substitution closing right before it roots it instead.
        if path_prefix == '/' and not escaped and not self.rooted_by(prefix, cut):
            return 'R3', 'root-fragment', None
~~~~

## Edit 4

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
        ('a.md', 'defaults to <repo>/.opencode/skills', 'R1'),
        ('a.md', 'see //example.com/.opencode/skills/x', 'R3'),
~~~~

NEW:

~~~~text
        ('a.md', 'defaults to <repo>/.opencode/skills', 'R1'),
        ('a.sh', 'cd "$(git rev-parse --show-toplevel)/.opencode/skills"', 'R1'),
        ('a.js', "const p = '(?<=foo)/.opencode/skills/x'", 'R3'),
        ('a.md', 'copy .opencode/skills/x or foo.skilled/skills/x', 'R1'),
        ('a.md', 'run .opencode/skills/x; foo.skilled or .opencode', 'R1'),
        ('a.md', 'see //example.com/.opencode/skills/x', 'R3'),
~~~~

## Edit 5

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
            pass
    print(f'self-test: {len(cases) + 14 - failures} passed, {failures} failed')
    return failures
~~~~

NEW:

~~~~text
            pass
    if not NEW_ROOT.search('under .skilled/skills') or NEW_ROOT.search('backup lives in .skilled-local'):
        failures += 1
        print('FAIL new-root name boundary')
    print(f'self-test: {len(cases) + 15 - failures} passed, {failures} failed')
    return failures
~~~~
