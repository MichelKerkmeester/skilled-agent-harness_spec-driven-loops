## Edit 1

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
  R3  review  anything else: the bare directory, a trailing slash, an entry that does not exist, a lone quoted segment

Modes (dry run unless --apply is given):
  --census          count occurrences per class over the manifest and print JSON
  --review-lines    print every R3 occurrence as a tab-separated line: path, line, column, text
  --apply           rewrite R1 (and R2 when --specs-target is canonical) in place, plus R3 occurrences --decisions names
  --self-test       run the boundary cases and exit non-zero on any mismatch
~~~~

NEW:

~~~~text
  R3  review  anything else: the bare directory, a trailing slash, an entry that does not exist, a lone quoted segment

A judged file (--judged) already names `.skilled`, so its `.opencode` occurrences may build or describe the legacy
layout on purpose. No occurrence in it changes by rule: every R1 and R3 occurrence needs a decision.

Modes (dry run unless --apply is given):
  --census          count occurrences per class over the manifests and print JSON
  --review-lines    print every occurrence that needs a decision as a tab-separated line: path, line, column, line
                    hash, class and detail, text
  --apply           rewrite R1 (and R2 when --specs-target is canonical) in place, plus the occurrences --decisions
                    chooses; refuses before writing when any occurrence that needs a decision has none
  --self-test       run the boundary cases and exit non-zero on any mismatch
~~~~

## Edit 2

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
class Rule:
    def __init__(self, entries, keep_lines=(), specs_target='keep', map_compat=False):
        self.entries = set(entries)
~~~~

NEW:

~~~~text
class Rule:
    def __init__(self, entries, keep_lines=(), specs_target='keep', map_compat=False, judged=()):
        self.entries = set(entries)
~~~~

## Edit 3

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
        self.map_compat = map_compat

    @staticmethod
~~~~

NEW:

~~~~text
        self.map_compat = map_compat
        self.judged = set(judged)

    def reviewable(self, path, cls):
        """The classes whose occurrences in this file change only by decision."""
        return cls in (('R1', 'R3') if path in self.judged else ('R3',))

    @staticmethod
~~~~

## Edit 4

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
        rest = re.match(r'(\\?/[^\s\'"`()\[\]{},;|]+)', text[start + len(TOKEN):])
        return bool(rest) and (NEW + rest.group(1)) in text

    def keep(self, path, text):
~~~~

NEW:

~~~~text
        rest = re.match(r'(\\?/[^\s\'"`()\[\]{},;|]+)', text[start + len(TOKEN):])
        if not rest:
            return False
        return bool(re.search(re.escape(NEW + rest.group(1)) + r'(?![A-Za-z0-9_./-])', text))

    def keep(self, path, text):
~~~~

## Edit 5

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
            return 'K', 'dual-root', None
        if '://' in path_prefix:
            return 'R3', 'url', None
~~~~

NEW:

~~~~text
            return 'K', 'dual-root', None
        if '://' in path_prefix or path_prefix.startswith('//'):
            return 'R3', 'url', None
~~~~

## Edit 6

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
            return 'R3', 'absolute', None
        span = (start, start + len(TOKEN))
~~~~

NEW:

~~~~text
            return 'R3', 'absolute', None
        # A lone slash roots the path at the filesystem root or matches a fragment of a longer path, which may need
        # both root names. A variable, placeholder or command substitution closing right before it roots it instead.
        if path_prefix == '/' and not escaped and (cut == 0 or prefix[cut - 1] not in '})>'):
            return 'R3', 'root-fragment', None
        span = (start, start + len(TOKEN))
~~~~

## Edit 7

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
                position = line.find(TOKEN, position + len(TOKEN))

    def rewrite(self, path, text, decisions=frozenset()):
~~~~

NEW:

~~~~text
                position = line.find(TOKEN, position + len(TOKEN))

    def rewrite_line(self, path, line, next_line, line_no, decisions=frozenset()):
        """Rewrite one line. Returns the new line and the final column of every token left in place."""
        edits, untouched = [], []
        position = line.find(TOKEN)
        while position != -1:
            cls, detail, span = self.classify(path, line, position, next_line)
            if self.reviewable(path, cls):
                chosen = (path, line_no, position) in decisions
            else:
                chosen = cls == 'R1'
            if chosen:
                edits.append((position, position + len(TOKEN), NEW))
            elif cls == 'R2' and detail == 'specs' and self.specs_target == 'canonical':
                begin = position - 1 if position > 0 and line[position - 1] == '\\' else position
                finish = position + len(TOKEN)
                finish += 2 if line[finish:finish + 2] == '\\/' else 1
                edits.append((begin, finish, ''))
            else:
                untouched.append(position)
            position = line.find(TOKEN, position + len(TOKEN))
        if not edits:
            return line, {p: p for p in untouched}
        new_line, cursor = [], 0
        for begin, finish, replacement in edits:
            new_line.append(line[cursor:begin])
            new_line.append(replacement)
            cursor = finish
        new_line.append(line[cursor:])
        final = {}
        for p in untouched:
            final[p] = p + sum(len(r) - (f - b) for b, f, r in edits if f <= p)
        return ''.join(new_line), final

    def rewrite(self, path, text, decisions=frozenset()):
~~~~

## Edit 8

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
        for index, line in enumerate(lines):
            spans = []
            next_line = lines[index + 1] if index + 1 < len(lines) else ''
            position = line.find(TOKEN)
            while position != -1:
                cls, detail, span = self.classify(path, line, position, next_line)
                line_no = index + 1
                if cls == 'R1' or (cls == 'R2' and detail == 'specs' and self.specs_target == 'canonical'):
                    spans.append((cls, position))
                elif cls == 'R3' and (path, line_no, position) in decisions:
                    spans.append((cls, position))
                position = line.find(TOKEN, position + len(TOKEN))
            if not spans:
                continue
            new_line = line
            for cls, position in reversed(spans):
                if cls == 'R2':
                    start = position - 1 if position > 0 and new_line[position - 1] == '\\' else position
                    end = position + len(TOKEN)
                    cut = 2 if new_line[end:end + 2] == '\\/' else 1
                    new_line = new_line[:start] + new_line[end + cut:]
                else:
                    new_line = new_line[:position] + NEW + new_line[position + len(TOKEN):]
            if new_line != line:
~~~~

NEW:

~~~~text
        for index, line in enumerate(lines):
            next_line = lines[index + 1] if index + 1 < len(lines) else ''
            new_line, _ = self.rewrite_line(path, line, next_line, index + 1, decisions)
            if new_line != line:
~~~~

## Edit 9

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
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

NEW:

~~~~text
def apply_manifest(repo, paths, rule, decisions_path=None, ledger_path=None):
    """Validate every decision, compute every output and ledger row, and only then write anything."""
    decisions = load_decisions(decisions_path)
    rows = load_decision_rows(decisions_path) if decisions_path else []
    keeps = defaultdict(list)
    texts = {}
    decided = set()
    for rel, line_no, column, digest, action, reason in rows:
        if (rel, line_no, column) in decided:
            raise SystemExit(f'two decision rows name one occurrence: {rel}:{line_no}:{column}; nothing written')
        decided.add((rel, line_no, column))
        if rel not in texts:
            texts[rel] = read_text(repo / rel)
        found = [o for o in rule.occurrences(rel, texts[rel]) if o[0] == line_no and o[1] == column]
        if not found or not rule.reviewable(rel, found[0][2]):
            raise SystemExit(f'decision names no occurrence that takes a decision: {rel}:{line_no}:{column}; nothing written')
        if line_hash(found[0][5]) != digest:
            raise SystemExit(f'decision line changed since it was decided: {rel}:{line_no}; nothing written')
        if action == 'keep':
            keeps[(rel, line_no)].append((column, reason))
    for rel in paths:
        if rel not in texts:
            texts[rel] = read_text(repo / rel)
        for line_no, column, cls, _, _, _ in rule.occurrences(rel, texts[rel]):
            if rule.reviewable(rel, cls) and (rel, line_no, column) not in decided:
                raise SystemExit(f'occurrence needs a decision: {rel}:{line_no}:{column}; nothing written')
    outputs, ledger_rows, total_lines = {}, [], 0
    for rel in dict.fromkeys(list(paths) + [r[0] for r in rows]):
        text = texts.get(rel) if rel in texts else read_text(repo / rel)
        lines = text.split('\n')
        changed = 0
        for index, line in enumerate(lines):
            next_line = lines[index + 1] if index + 1 < len(lines) else ''
            new_line, final = rule.rewrite_line(rel, line, next_line, index + 1, decisions)
            for column, reason in keeps.get((rel, index + 1), []):
                if column not in final or new_line[final[column]:final[column] + len(TOKEN)] != TOKEN:
                    raise SystemExit(f'kept occurrence would not survive the rewrite: {rel}:{index + 1}:{column}; nothing written')
                ledger_rows.append(f'{occurrence_key(rel, index + 1, final[column], new_line)}\t{reason}')
            if new_line != line:
                lines[index] = new_line
                changed += 1
        if changed:
            outputs[rel] = '\n'.join(lines)
            total_lines += changed
    for rel, new in outputs.items():
        write_text(repo / rel, new)
    if ledger_path and ledger_rows:
        with open(ledger_path, 'a') as ledger:
            ledger.write('\n'.join(ledger_rows) + '\n')
    return len(outputs), total_lines


def self_test():
~~~~

## Edit 10

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
        ('a.md', 'link ../.opencode/skills/x', 'R1'),
        ('a.js', "const root = '/.opencode/skills'", 'R1'),
        ('a.md', 'OpenCode discovers plugins under .opencode/plugins/', 'R3'),
~~~~

NEW:

~~~~text
        ('a.md', 'link ../.opencode/skills/x', 'R1'),
        ('a.js', "const root = '/.opencode/skills'", 'R3'),
        ('a.sh', 'CHECK="${REPO_ROOT}/.opencode/bin/check.sh"', 'R1'),
        ('a.md', 'defaults to <repo>/.opencode/skills', 'R1'),
        ('a.md', 'see //example.com/.opencode/skills/x', 'R3'),
        ('a.md', 'copy .opencode/skills/x and .skilled/skills/xylophone', 'R1'),
        ('a.md', 'OpenCode discovers plugins under .opencode/plugins/', 'R3'),
~~~~

## Edit 11

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
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
~~~~

NEW:

~~~~text
        decisions = Path(tmp) / 'decisions.tsv'
        decisions.write_text(f'two.md\t1\t4\t{line_hash(line)}\tkeep\tnames the directory itself\n'
                             f'two.md\t1\t28\t{line_hash(line)}\trewrite\tnames the source tree\n')
        ledger = Path(tmp) / 'ledger.tsv'
        apply_manifest(Path(tmp), ['two.md'], rule, str(decisions), str(ledger))
        rows = ledger.read_text().splitlines()
        if len(rows) != 1 or rows[0].split('\t')[2] != '4' or doc.read_bytes() != b'the .opencode/ tree and the .skilled/ folder\n':
            failures += 1
            print(f'FAIL ledger keys one occurrence: {rows!r} {doc.read_bytes()!r}')
        partial = Path(tmp) / 'partial.md'
        partial.write_bytes(b'the .opencode/ tree and the .opencode/ folder\n')
        half = Path(tmp) / 'half.tsv'
        half.write_text(f'partial.md\t1\t4\t{line_hash(line)}\tkeep\tnames the directory itself\n')
        conflict = Path(tmp) / 'conflict.tsv'
        conflict.write_text(f'partial.md\t1\t4\t{line_hash(line)}\tkeep\tnames the directory itself\n'
                            f'partial.md\t1\t4\t{line_hash(line)}\trewrite\tnames the source tree\n'
                            f'partial.md\t1\t28\t{line_hash(line)}\trewrite\tnames the source tree\n')
        for label, refused_set in (('an undecided occurrence', half), ('two rows for one occurrence', conflict)):
            try:
                apply_manifest(Path(tmp), ['partial.md'], rule, str(refused_set), None)
                failures += 1
                print(f'FAIL {label} still ran')
            except SystemExit:
                if partial.read_bytes() != b'the .opencode/ tree and the .opencode/ folder\n':
                    failures += 1
                    print(f'FAIL {label} wrote a file')
        judged_rule = Rule(['skills', 'bin'], judged=['judged.sh'])
        judged = Path(tmp) / 'judged.sh'
        judged_line = 'mkdir -p "$TMP/.opencode/bin" "$TMP/.opencode/skills"'
        judged.write_bytes((judged_line + '\n').encode())
        judged_decisions = Path(tmp) / 'judged.tsv'
        judged_decisions.write_text(f'judged.sh\t1\t15\t{line_hash(judged_line)}\tkeep\tbuilds the legacy layout\n'
                                    f'judged.sh\t1\t36\t{line_hash(judged_line)}\trewrite\tnames the source tree\n')
        judged_ledger = Path(tmp) / 'judged-ledger.tsv'
        apply_manifest(Path(tmp), ['judged.sh'], judged_rule, str(judged_decisions), str(judged_ledger))
        if judged.read_bytes() != b'mkdir -p "$TMP/.opencode/bin" "$TMP/.skilled/skills"\n' or len(judged_ledger.read_text().splitlines()) != 1:
            failures += 1
            print(f'FAIL judged file: {judged.read_bytes()!r}')
        undecided = Path(tmp) / 'undecided.sh'
        undecided.write_bytes(b'run "$TMP/.opencode/bin/x"\n')
        try:
            apply_manifest(Path(tmp), ['undecided.sh'], Rule(['bin'], judged=['undecided.sh']), None, None)
            failures += 1
            print('FAIL a judged file changed by rule')
        except SystemExit:
            if undecided.read_bytes() != b'run "$TMP/.opencode/bin/x"\n':
                failures += 1
                print('FAIL a judged file was written without decisions')
        mixed = Path(tmp) / 'mixed.md'
        mixed_line = 'run .opencode/skills/x and .opencode/unknown'
        mixed.write_bytes((mixed_line + '\n').encode())
        mixed_decisions = Path(tmp) / 'mixed.tsv'
        mixed_decisions.write_text(f'mixed.md\t1\t27\t{line_hash(mixed_line)}\tkeep\tnames no source entry\n')
        mixed_ledger = Path(tmp) / 'mixed-ledger.tsv'
        apply_manifest(Path(tmp), ['mixed.md'], rule, str(mixed_decisions), str(mixed_ledger))
        mixed_rows = mixed_ledger.read_text().splitlines()
        if mixed.read_bytes() != b'run .skilled/skills/x and .opencode/unknown\n' or len(mixed_rows) != 1 or mixed_rows[0].split('\t')[2] != '26':
            failures += 1
            print(f'FAIL mixed rewrite and keep: {mixed.read_bytes()!r} {mixed_rows!r}')
        untouched = Path(tmp) / 'untouched.md'
        untouched.write_bytes(b'run .opencode/skills/x\n')
        refused = Path(tmp) / 'refused.tsv'
        refused.write_text('mixed.md\t1\t99\t0000000000000000\tkeep\tno such token\n')
        try:
            apply_manifest(Path(tmp), ['untouched.md'], rule, str(refused), None)
            failures += 1
            print('FAIL a refused decision set still ran')
        except SystemExit:
            if untouched.read_bytes() != b'run .opencode/skills/x\n':
                failures += 1
                print('FAIL a refused decision set wrote a file')
        stale = Path(tmp) / 'stale.tsv'
        stale.write_text('partial.md\t1\t4\t0000000000000000\trewrite\tstale hash\n'
                         f'partial.md\t1\t28\t{line_hash(line)}\trewrite\tnames the source tree\n')
        try:
            apply_manifest(Path(tmp), ['partial.md'], rule, str(stale), None)
            failures += 1
~~~~

## Edit 12

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
            pass
    print(f'self-test: {len(cases) + 8 - failures} passed, {failures} failed')
    return failures
~~~~

NEW:

~~~~text
            pass
    print(f'self-test: {len(cases) + 14 - failures} passed, {failures} failed')
    return failures
~~~~

## Edit 13

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
    parser.add_argument('--repo', default=os.getcwd())
    parser.add_argument('--manifest')
    parser.add_argument('--keep-list')
    parser.add_argument('--decisions')
~~~~

NEW:

~~~~text
    parser.add_argument('--repo', default=os.getcwd())
    parser.add_argument('--manifest', action='append', help='a file of repository paths, one per line; repeat to combine manifests')
    parser.add_argument('--keep-list')
    parser.add_argument('--judged', help='a file of repository paths whose R1 occurrences also change only by decision')
    parser.add_argument('--decisions')
~~~~

## Edit 14

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
    entries = args.entries.split(',') if args.entries else source_entries(args.repo)
    rule = Rule(entries, load_keep(args.keep_list), args.specs_target, args.map_compat)
    paths = read_manifest(args.manifest)
    if args.census:
~~~~

NEW:

~~~~text
    entries = args.entries.split(',') if args.entries else source_entries(args.repo)
    judged = read_manifest(args.judged) if args.judged else []
    rule = Rule(entries, load_keep(args.keep_list), args.specs_target, args.map_compat, judged)
    paths = list(dict.fromkeys(p for manifest in args.manifest for p in read_manifest(manifest)))
    if args.census:
~~~~

## Edit 15

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

OLD:

~~~~text
            for line_no, column, cls, detail, _, line in rule.occurrences(rel, text):
                if cls == 'R3':
                    print(f'{rel}\t{line_no}\t{column}\t{line_hash(line)}\t{detail}\t{line.strip()[:240]}')
    elif args.apply:
~~~~

NEW:

~~~~text
            for line_no, column, cls, detail, _, line in rule.occurrences(rel, text):
                if rule.reviewable(rel, cls):
                    print(f'{rel}\t{line_no}\t{column}\t{line_hash(line)}\t{cls}:{detail}\t{line.strip()[:240]}')
    elif args.apply:
~~~~
