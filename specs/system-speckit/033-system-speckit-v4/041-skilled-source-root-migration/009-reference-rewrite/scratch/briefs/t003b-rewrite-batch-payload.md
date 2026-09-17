## Edit 1

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
  --review-lines    print every R3 occurrence as a tab-separated line: path, line, column, text
  --apply           rewrite R1 (and R2 when --specs-target is canonical) in place, plus R3 lines named by --decisions
  --verify          for every rewritten concrete path, report whether it resolves at the tip when its old form resolved at --base
  --self-test       run the boundary cases and exit non-zero on any mismatch
"""
~~~~

NEW:

~~~~text
  --review-lines    print every R3 occurrence as a tab-separated line: path, line, column, text
  --apply           rewrite R1 (and R2 when --specs-target is canonical) in place, plus R3 occurrences --decisions names
  --self-test       run the boundary cases and exit non-zero on any mismatch

Files are read and written as bytes, so line endings and undecodable bytes survive unchanged.
"""
~~~~

## Edit 2

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
WORD = re.compile(r'[A-Za-z0-9_]')
HOME_PREFIXES = ('~/', '$HOME/', '${HOME}/')
~~~~

NEW:

~~~~text
WORD = re.compile(r'[A-Za-z0-9_]')
NAME_BEFORE = re.compile(r'[A-Za-z0-9_.-]')
PATH_DELIMITERS = frozenset(' \t\r\n\'"`()[]{}<>=,;|')
HOME_PREFIXES = ('~/', '$HOME/', '${HOME}/')
~~~~

## Edit 3

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
        self.map_compat = map_compat

    def keep(self, path, text):
~~~~

NEW:

~~~~text
        self.map_compat = map_compat

    @staticmethod
    def same_path_alternative(text, start):
        """True when the same path also appears under the new root on the line, as in `.opencode/x or .skilled/x`."""
        rest = re.match(r'(\\?/[^\s\'"`()\[\]{},;|]+)', text[start + len(TOKEN):])
        return bool(rest) and (NEW + rest.group(1)) in text

    def keep(self, path, text):
~~~~

## Edit 4

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
            token_start = start
        if before and WORD.match(before):
            return 'X', 'identifier', None
~~~~

NEW:

~~~~text
            token_start = start
        if before and NAME_BEFORE.match(before):
            return 'X', 'identifier', None
~~~~

## Edit 5

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
            return 'X', 'home', None
        if after[:1] and (WORD.match(after[:1]) or after[:1] == '-'):
~~~~

NEW:

~~~~text
            return 'X', 'home', None
        # The path the token sits in, read back to the nearest delimiter.
        cut = len(prefix)
        while cut > 0 and prefix[cut - 1] not in PATH_DELIMITERS:
            cut -= 1
        path_prefix = prefix[cut:]
        if after[:1] and (WORD.match(after[:1]) or after[:1] == '-'):
~~~~

## Edit 6

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
            return 'K', reason, None
        span = (start, start + len(TOKEN))
~~~~

NEW:

~~~~text
            return 'K', reason, None
        if self.same_path_alternative(text, start):
            return 'K', 'dual-root', None
        if '://' in path_prefix:
            return 'R3', 'url', None
        # A regex literal opens with a bare `/`, so only a prefix with a directory segment counts as absolute.
        if re.match(r'/[^/\s]+/', path_prefix) or re.match(r'[A-Za-z]:[\\/]', path_prefix):
            return 'R3', 'absolute', None
        span = (start, start + len(TOKEN))
~~~~

## Edit 7

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
                if entry == 'specs':
                    return 'R2', 'specs-segment', span
~~~~

NEW:

~~~~text
                if entry == 'specs':
                    if self.specs_target == 'canonical':
                        return 'R3', 'specs-segment', None
                    return 'R2', 'specs-segment', span
~~~~

## Edit 8

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
        return '\n'.join(lines), changed


def read_manifest(path):
~~~~

NEW:

~~~~text
        return '\n'.join(lines), changed


def read_text(path):
    return Path(path).read_bytes().decode('utf-8', 'surrogateescape')


def write_text(path, text):
    Path(path).write_bytes(text.encode('utf-8', 'surrogateescape'))


def read_manifest(path):
~~~~

## Edit 9

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
    return rows


def line_key(path, line_no, text):
    return f'{path}\t{line_no}\t{hashlib.sha256(text.encode("utf-8", "surrogateescape")).hexdigest()[:16]}'


def load_decision_rows(path):
~~~~

NEW:

~~~~text
    return rows


def line_hash(text):
    return hashlib.sha256(text.encode('utf-8', 'surrogateescape')).hexdigest()[:16]


def occurrence_key(path, line_no, column, text):
    return f'{path}\t{line_no}\t{column}\t{line_hash(text)}'


def load_decision_rows(path):
~~~~

## Edit 10

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
        fields = line.split('\t')
        if len(fields) < 5 or fields[3] not in ('rewrite', 'keep') or not fields[4].strip():
            raise SystemExit(f'decision row needs path, line, column, rewrite or keep, and a reason: {line!r}')
        rows.append((fields[0], int(fields[1]), int(fields[2]), fields[3], fields[4].strip()))
    return rows
~~~~

NEW:

~~~~text
        fields = line.split('\t')
        if len(fields) < 6 or fields[4] not in ('rewrite', 'keep') or not fields[5].strip():
            raise SystemExit(f'decision row needs path, line, column, line hash, rewrite or keep, and a reason: {line!r}')
        rows.append((fields[0], int(fields[1]), int(fields[2]), fields[3], fields[4], fields[5].strip()))
    return rows
~~~~

## Edit 11

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
        fields = line.split('\t')
        if len(fields) < 4:
            raise SystemExit(f'decision row needs path, line, column and action: {line!r}')
        if fields[3] == 'rewrite':
            chosen.add((fields[0], int(fields[1]), int(fields[2])))
        elif fields[3] != 'keep':
            raise SystemExit(f'decision action must be rewrite or keep: {line!r}')
    return frozenset(chosen)


def self_test():
~~~~

NEW:

~~~~text
        fields = line.split('\t')
        if len(fields) < 5:
            raise SystemExit(f'decision row needs path, line, column, line hash and action: {line!r}')
        if fields[4] == 'rewrite':
            chosen.add((fields[0], int(fields[1]), int(fields[2])))
        elif fields[4] != 'keep':
            raise SystemExit(f'decision action must be rewrite or keep: {line!r}')
    return frozenset(chosen)


def apply_manifest(repo, paths, rule, decisions_path=None, ledger_path=None):
    """Validate every decision, rewrite the manifest, then record each decided keep by its final column."""
    decisions = load_decisions(decisions_path)
    rows = load_decision_rows(decisions_path) if decisions_path else []
    texts = {}
    for rel, line_no, column, digest, action, reason in rows:
        if rel not in texts:
            texts[rel] = read_text(repo / rel)
        found = [o for o in rule.occurrences(rel, texts[rel]) if o[0] == line_no and o[1] == column]
        if not found or found[0][2] != 'R3':
            raise SystemExit(f'decision names no R3 occurrence: {rel}:{line_no}:{column}; nothing written')
        if line_hash(found[0][5]) != digest:
            raise SystemExit(f'decision line changed since it was decided: {rel}:{line_no}; nothing written')
    total_files = total_lines = 0
    for rel in paths:
        target = repo / rel
        text = read_text(target)
        new, changed = rule.rewrite(rel, text, decisions)
        if changed:
            write_text(target, new)
            total_files += 1
            total_lines += changed
    if rows and ledger_path:
        rewritten = defaultdict(list)
        for rel, line_no, column, digest, action, reason in rows:
            if action == 'rewrite':
                rewritten[(rel, line_no)].append(column)
        with open(ledger_path, 'a') as ledger:
            for rel, line_no, column, digest, action, reason in sorted(rows):
                if action != 'keep':
                    continue
                final_line = read_text(repo / rel).split('\n')[line_no - 1]
                # Every token rewritten to the left of a kept token shortens the line by the difference in length.
                shift = sum(1 for c in rewritten[(rel, line_no)] if c < column) * (len(TOKEN) - len(NEW))
                final_column = column - shift
                if final_line[final_column:final_column + len(TOKEN)] != TOKEN:
                    raise SystemExit(f'kept occurrence not found after apply: {rel}:{line_no}:{column}')
                ledger.write(f'{occurrence_key(rel, line_no, final_column, final_line)}\t{reason}\n')
    return total_files, total_lines


def self_test():
~~~~

## Edit 12

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
        ('a.md', 'the tree sits under .skilled or .opencode, linked', 'K'),
        ('a.md', 'copy .opencode/skills/x to .skilled/skills/x', 'R1'),
        ('a.md', 'OpenCode discovers plugins under .opencode/plugins/', 'R3'),
~~~~

NEW:

~~~~text
        ('a.md', 'the tree sits under .skilled or .opencode, linked', 'K'),
        ('a.md', 'copy .opencode/skills/x to .skilled/skills/x', 'K'),
        ('a.md', "copy '.opencode/skills' or '.skilled/skills'", 'K'),
        ('a.md', 'see https://example.com/.opencode/skills/x', 'R3'),
        ('a.md', 'at /Users/alice/.opencode/skills/x', 'R3'),
        ('a.md', 'from foo-.opencode/skills/x', 'X'),
        ('a.md', 'link ../.opencode/skills/x', 'R1'),
        ('a.js', "const root = '/.opencode/skills'", 'R1'),
        ('a.md', 'OpenCode discovers plugins under .opencode/plugins/', 'R3'),
~~~~

## Edit 13

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
        print(f'FAIL kept specs: {kept!r}')
    print(f'self-test: {len(cases) + 5 - failures} passed, {failures} failed')
    return failures
~~~~

NEW:

~~~~text
        print(f'FAIL kept specs: {kept!r}')
    import tempfile
    with tempfile.TemporaryDirectory() as tmp:
        crlf = Path(tmp) / 'crlf.md'
        crlf.write_bytes(b'run .opencode/skills/x\r\nuntouched\r\n')
        new, _ = rule.rewrite('crlf.md', read_text(crlf))
        write_text(crlf, new)
        if crlf.read_bytes() != b'run .skilled/skills/x\r\nuntouched\r\n':
            failures += 1
            print(f'FAIL crlf: {crlf.read_bytes()!r}')
        doc = Path(tmp) / 'two.md'
        doc.write_bytes(b'the .opencode/ tree and the .opencode/ folder\n')
        line = 'the .opencode/ tree and the .opencode/ folder'
        decisions = Path(tmp) / 'decisions.tsv'
        decisions.write_text(f'two.md\t1\t4\t{line_hash(line)}\tkeep\tnames the directory itself\n')
        ledger = Path(tmp) / 'ledger.tsv'
        apply_manifest(Path(tmp), ['two.md'], rule, str(decisions), str(ledger))
        rows = ledger.read_text().splitlines()
        if len(rows) != 1 or rows[0].split('\t')[2] != '4':
            failures += 1
            print(f'FAIL ledger keys one occurrence: {rows!r}')
        stale = Path(tmp) / 'stale.tsv'
        stale.write_text('two.md\t1\t4\t0000000000000000\trewrite\tstale hash\n')
        try:
            apply_manifest(Path(tmp), ['two.md'], rule, str(stale), None)
            failures += 1
            print('FAIL a stale decision was applied')
        except SystemExit:
            pass
    print(f'self-test: {len(cases) + 8 - failures} passed, {failures} failed')
    return failures
~~~~

## Edit 14

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
        for rel in paths:
            text = (Path(args.repo) / rel).read_text(errors='surrogateescape')
            seen = set()
~~~~

NEW:

~~~~text
        for rel in paths:
            text = read_text(Path(args.repo) / rel)
            seen = set()
~~~~

## Edit 15

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
        for rel in paths:
            text = (Path(args.repo) / rel).read_text(errors='surrogateescape')
            for line_no, column, cls, detail, _, line in rule.occurrences(rel, text):
                if cls == 'R3':
                    print(f'{rel}\t{line_no}\t{column}\t{detail}\t{line.strip()[:240]}')
    elif args.apply:
        decisions = load_decisions(args.decisions)
        if args.decisions:
            # Every decision must name an R3 occurrence that exists before anything is written.
            texts = {}
            for rel, line_no, column, action, reason in load_decision_rows(args.decisions):
                if rel not in texts:
                    texts[rel] = (Path(args.repo) / rel).read_text(errors='surrogateescape')
                found = [o for o in rule.occurrences(rel, texts[rel]) if o[0] == line_no and o[1] == column]
                if not found or found[0][2] != 'R3':
                    raise SystemExit(f'decision names no R3 occurrence: {rel}:{line_no}:{column}; nothing written')
        total_files = total_lines = 0
        for rel in paths:
            target = Path(args.repo) / rel
            text = target.read_text(errors='surrogateescape')
            new, changed = rule.rewrite(rel, text, decisions)
            if changed:
                target.write_text(new, errors='surrogateescape')
                total_files += 1
                total_lines += changed
        if args.decisions and args.kept_ledger:
            kept = defaultdict(list)
            for rel, line_no, column, action, reason in load_decision_rows(args.decisions):
                if action == 'keep':
                    kept[(rel, line_no)].append(reason)
            with open(args.kept_ledger, 'a') as ledger:
                for (rel, line_no), reasons in sorted(kept.items()):
                    text = (Path(args.repo) / rel).read_text(errors='surrogateescape').split('\n')[line_no - 1]
                    ledger.write(f"{line_key(rel, line_no, text)}\t{'; '.join(sorted(set(reasons)))}\n")
        print(f'APPLIED files={total_files} lines={total_lines}')
~~~~

NEW:

~~~~text
        for rel in paths:
            text = read_text(Path(args.repo) / rel)
            for line_no, column, cls, detail, _, line in rule.occurrences(rel, text):
                if cls == 'R3':
                    print(f'{rel}\t{line_no}\t{column}\t{line_hash(line)}\t{detail}\t{line.strip()[:240]}')
    elif args.apply:
        total_files, total_lines = apply_manifest(Path(args.repo), paths, rule, args.decisions, args.kept_ledger)
        print(f'APPLIED files={total_files} lines={total_lines}')
~~~~
