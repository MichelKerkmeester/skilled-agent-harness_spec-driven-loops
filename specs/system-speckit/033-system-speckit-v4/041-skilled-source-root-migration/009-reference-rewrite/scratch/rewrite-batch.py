#!/usr/bin/env python3
"""rewrite-batch.py: classify and rewrite `.opencode` path references for one manifest of repository paths.

Classes, decided per occurrence of the literal token `.opencode`:
  X   never   an identifier or longer name that contains the token, or a home-anchored path
  K   kept    a line the keep-list names, or a dual-root line that spells both root names
  R2  specs   the token followed by the `specs` entry, handled by --specs-target
  R1  path    the token followed by `/<entry>` (or the regex-escaped `\\/<entry>`) for an entry of the source tree
  R1  segment a quoted `'.opencode'` followed by a quoted entry of the source tree, as in path.join(root, '.opencode', 'skills')
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

Files are read and written as bytes, so line endings and undecodable bytes survive unchanged.
"""
import argparse, hashlib, json, os, re, subprocess, sys
from collections import Counter, defaultdict
from pathlib import Path

TOKEN = '.opencode'
NEW = '.skilled'
WORD = re.compile(r'[A-Za-z0-9_]')
NAME_BEFORE = re.compile(r'[A-Za-z0-9_.-]')
PATH_DELIMITERS = frozenset(' \t\r\n\'"`()[]{}<>=,;|')
HOME_PREFIXES = ('~/', '$HOME/', '${HOME}/')
ENTRY = r'[A-Za-z0-9_.@-]+'
ROOT = r'\\?\.(?:skilled|opencode)'
# A line that spells both root names as alternatives keeps the old name on purpose: a root-name list, a
# brace glob, a regex alternation or prose that offers either root.
DUAL_ROOT = re.compile(
    r"['\"`]\.skilled['\"`]\s*,\s*['\"`]\.opencode['\"`]|['\"`]\.opencode['\"`]\s*,\s*['\"`]\.skilled['\"`]"
    r"|\{\s*\.(?:skilled\s*,\s*\.opencode|opencode\s*,\s*\.skilled)\s*\}"
    r"|\(\?:\s*(?:skilled\s*\|\s*opencode|opencode\s*\|\s*skilled)\s*\)"
    r"|(?<![A-Za-z0-9_.-])\.(?:skilled|opencode)\\?/?\s*(?:or|and|,|\|)\s*`?\\?\.(?:skilled|opencode)(?![A-Za-z0-9_-])(?!\.[A-Za-z0-9])"
)
# The new root as a name of its own, not a piece of a longer name such as `.skilled-local`.
NEW_ROOT = re.compile(r'(?<![A-Za-z0-9_.-])\.skilled(?![A-Za-z0-9_-])(?!\.[A-Za-z0-9])')
# The OpenCode runtime's own view of its directory: a line that names the runtime keeps its paths under review.
RUNTIME_NAME = re.compile(r'(?<![A-Za-z0-9_.-])opencode(?![A-Za-z0-9_.-])', re.IGNORECASE)
RUNTIME_NOISE = re.compile(r'\\?\.opencode|cli-opencode|sk-code-opencode|opencode\.json|OPENCODE_[A-Z_]+|opencode-ai', re.IGNORECASE)


def names_runtime(text):
    return bool(RUNTIME_NAME.search(RUNTIME_NOISE.sub(' ', text)))


def source_entries(repo):
    """Top-level names under the source tree, read from the working tree so the list matches the layout on disk."""
    root = Path(repo) / NEW
    return sorted(p.name for p in root.iterdir()) if root.is_dir() else []


class Rule:
    def __init__(self, entries, keep_lines=(), specs_target='keep', map_compat=False, judged=()):
        self.entries = set(entries)
        self.keep_lines = [(path, re.compile(pattern)) for path, pattern in keep_lines]
        self.specs_target = specs_target
        self.map_compat = map_compat
        self.judged = set(judged)

    def reviewable(self, path, cls):
        """The classes whose occurrences in this file change only by decision."""
        return cls in (('R1', 'R3') if path in self.judged else ('R3',))

    @staticmethod
    def same_path_alternative(text, start):
        """True when the same path also appears under the new root on the line, as in `.opencode/x or .skilled/x`."""
        rest = re.match(r'(\\?/[^\s\'"`()\[\]{},;|]+)', text[start + len(TOKEN):])
        if not rest:
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
    def rooted_by(prefix, cut):
        """True when a variable (`${x}`), a placeholder (`<repo>`) or a command substitution (`$(pwd)`) closes before the slash."""
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

    def keep(self, path, text):
        if not self.map_compat and DUAL_ROOT.search(text):
            return 'dual-root'
        for keep_path, pattern in self.keep_lines:
            if (keep_path == '*' or keep_path == path) and pattern.search(text):
                return 'keep-list'
        return None

    def classify(self, path, text, start, next_line=''):
        """Return (class, detail, replace_span) for the token starting at `start` in `text`.

        `next_line` lets a quoted segment that ends its line, as in a path.join call split over lines, find its entry.
        """
        before = text[start - 1] if start > 0 else ''
        after = text[start + len(TOKEN):]
        if start > 0 and before == '\\':
            escaped = True
            before = text[start - 2] if start > 1 else ''
            token_start = start - 1
        else:
            escaped = False
            token_start = start
        if before and NAME_BEFORE.match(before):
            return 'X', 'identifier', None
        prefix = text[:token_start]
        if any(prefix.endswith(h) for h in HOME_PREFIXES):
            return 'X', 'home', None
        # The path the token sits in, read back to the nearest delimiter.
        cut = len(prefix)
        while cut > 0 and prefix[cut - 1] not in PATH_DELIMITERS:
            cut -= 1
        path_prefix = prefix[cut:]
        if after[:1] and (WORD.match(after[:1]) or after[:1] == '-'):
            return 'X', 'longer-name', None
        if after[:1] == '.' and after[1:2] and WORD.match(after[1:2]):
            return 'X', 'longer-name', None
        reason = self.keep(path, text)
        if reason:
            return 'K', reason, None
        if self.same_path_alternative(text, start):
            return 'K', 'dual-root', None
        if '://' in path_prefix or path_prefix.startswith('//'):
            return 'R3', 'url', None
        # A regex literal opens with a bare `/`, so only a prefix with a directory segment counts as absolute.
        if re.match(r'/[^/\s]+/', path_prefix) or re.match(r'[A-Za-z]:[\\/]', path_prefix):
            return 'R3', 'absolute', None
        # A lone slash roots the path at the filesystem root or matches a fragment of a longer path, which may need
        # both root names. A variable, placeholder or command substitution closing right before it roots it instead.
        lone = path_prefix == '/' and not escaped
        escaped_lone = path_prefix != '/' and path_prefix.replace('\\', '') == '/'
        if (lone or escaped_lone) and not self.rooted_by(prefix, cut):
            return 'R3', 'root-fragment', None
        span = (start, start + len(TOKEN))
        match = re.match(r'(\\?/)(' + ENTRY + r')', after)
        if match:
            entry = match.group(2)
            if escaped and not match.group(1).startswith('\\'):
                return 'R3', 'mixed-escape', None
            if entry == 'specs':
                return 'R2', 'specs', span
            if entry in self.entries:
                if not self.map_compat and names_runtime(text):
                    return 'R3', 'runtime-view', None
                return 'R1', 'path', span
            return 'R3', f'entry:{entry}', None
        quote = before if before in ('"', "'", '`') else ''
        if quote and after[:1] == quote:
            segment = re.match(r'\s*[,/]\s*([\'"`])(' + ENTRY + r')\1', after[1:])
            if not segment and re.match(r'\s*,\s*(?://.*|#.*)?$', after[1:]):
                segment = re.match(r'\s*([\'"`])(' + ENTRY + r')\1', next_line)
            if segment:
                entry = segment.group(2)
                if entry == 'specs':
                    if self.specs_target == 'canonical':
                        return 'R3', 'specs-segment', None
                    return 'R2', 'specs-segment', span
                if entry in self.entries:
                    if not self.map_compat and names_runtime(text):
                        return 'R3', 'runtime-view', None
                    return 'R1', 'segment', span
                return 'R3', f'segment-entry:{entry}', None
            return 'R3', 'segment', None
        if after[:1] == '/':
            return 'R3', 'directory', None
        return 'R3', 'bare', None

    def occurrences(self, path, text):
        lines = text.split('\n')
        for line_no, line in enumerate(lines, 1):
            next_line = lines[line_no] if line_no < len(lines) else ''
            position = line.find(TOKEN)
            while position != -1:
                cls, detail, span = self.classify(path, line, position, next_line)
                yield line_no, position, cls, detail, span, line
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
        lines = text.split('\n')
        changed = 0
        for index, line in enumerate(lines):
            next_line = lines[index + 1] if index + 1 < len(lines) else ''
            new_line, _ = self.rewrite_line(path, line, next_line, index + 1, decisions)
            if new_line != line:
                lines[index] = new_line
                changed += 1
        return '\n'.join(lines), changed


def read_text(path):
    return Path(path).read_bytes().decode('utf-8', 'surrogateescape')


def write_text(path, text):
    Path(path).write_bytes(text.encode('utf-8', 'surrogateescape'))


def read_manifest(path):
    return [l.strip() for l in Path(path).read_text().splitlines() if l.strip() and not l.startswith('#')]


def load_keep(path):
    if not path:
        return []
    rows = []
    for line in Path(path).read_text().splitlines():
        if not line.strip() or line.startswith('#'):
            continue
        keep_path, pattern = line.split('\t', 1)
        rows.append((keep_path, pattern))
    return rows


def line_hash(text):
    return hashlib.sha256(text.encode('utf-8', 'surrogateescape')).hexdigest()[:16]


def occurrence_key(path, line_no, column, text):
    return f'{path}\t{line_no}\t{column}\t{line_hash(text)}'


def load_decision_rows(path):
    rows = []
    for line in Path(path).read_text().splitlines():
        if not line.strip() or line.startswith('#'):
            continue
        fields = line.split('\t')
        if len(fields) < 6 or fields[4] not in ('rewrite', 'keep') or not fields[5].strip():
            raise SystemExit(f'decision row needs path, line, column, line hash, rewrite or keep, and a reason: {line!r}')
        rows.append((fields[0], int(fields[1]), int(fields[2]), fields[3], fields[4], fields[5].strip()))
    return rows


def load_decisions(path):
    if not path:
        return frozenset()
    chosen = set()
    for line in Path(path).read_text().splitlines():
        if not line.strip() or line.startswith('#'):
            continue
        fields = line.split('\t')
        if len(fields) < 5:
            raise SystemExit(f'decision row needs path, line, column, line hash and action: {line!r}')
        if fields[4] == 'rewrite':
            chosen.add((fields[0], int(fields[1]), int(fields[2])))
        elif fields[4] != 'keep':
            raise SystemExit(f'decision action must be rewrite or keep: {line!r}')
    return frozenset(chosen)


def apply_manifest(repo, paths, rule, decisions_path=None, ledger_path=None):
    """Validate every decision, compute every output and ledger row, and only then write anything."""
    decisions = load_decisions(decisions_path)
    rows = load_decision_rows(decisions_path) if decisions_path else []
    keeps = defaultdict(list)
    texts = {}
    decided = set()
    manifest_paths = set(paths)
    for rel, line_no, column, digest, action, reason in rows:
        if rel not in manifest_paths:
            raise SystemExit(f'decision names a path outside the manifests: {rel}; nothing written')
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
    for rel in dict.fromkeys(paths):
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
    rule = Rule(['skills', 'commands', 'bin', 'logs', 'plugins'], keep_lines=[('keep.md', r'opencode looks here')])
    cases = [
        ('a.js', 'plugin.tool.opencode_goal.execute()', 'X'),
        ('a.js', 'deps.opencodeDir', 'X'),
        ('a.md', 'copy into .opencode-local/specs', 'X'),
        ('a.md', 'backups live in .opencode-backup-2026', 'X'),
        ('a.md', 'lock at ~/.opencode/state/lock', 'X'),
        ('a.md', 'config in $HOME/.opencode/bin', 'X'),
        ('a.md', 'see .opencode.json', 'X'),
        ('a.md', 'run .opencode/skills/x/SKILL.md', 'R1'),
        ('a.js', "const re = /\\.opencode\\/skills\\//", 'R1'),
        ('a.js', "path.join(root, '.opencode', 'skills')", 'R1'),
        ('a.js', "path.join(root, '.opencode', 'logs')", 'R1'),
        ('a.py', "ROOT / '.opencode' / 'skills' / 'x'", 'R1'),
        ('a.js', "path.join(\n  root,\n  '.opencode',", 'R3'),
        ('a.md', 'alias .opencode/specs/track', 'R2'),
        ('a.js', "path.join(root, '.opencode', 'specs')", 'R2'),
        ('a.md', 'rg -n phrase specs .opencode', 'R3'),
        ('a.md', 'rg -n "phrase" specs .opencode"', 'R3'),
        ('a.md', 'the .opencode/ directory', 'R3'),
        ('a.md', 'legacy .opencode/skill/ path', 'R3'),
        ('a.js', "const name = '.opencode';", 'R3'),
        ('keep.md', 'opencode looks here: .opencode/plugins/x.js', 'K'),
        ('a.js', "const NAMES = ['.skilled', '.opencode'];", 'K'),
        ('a.md', 'the tree sits under .skilled or .opencode, linked', 'K'),
        ('a.md', 'copy .opencode/skills/x to .skilled/skills/x', 'K'),
        ('a.md', "copy '.opencode/skills' or '.skilled/skills'", 'K'),
        ('a.md', 'see https://example.com/.opencode/skills/x', 'R3'),
        ('a.md', 'at /Users/alice/.opencode/skills/x', 'R3'),
        ('a.md', 'from foo-.opencode/skills/x', 'X'),
        ('a.md', 'link ../.opencode/skills/x', 'R1'),
        ('a.js', "const root = '/.opencode/skills'", 'R3'),
        ('a.sh', 'CHECK="${REPO_ROOT}/.opencode/bin/check.sh"', 'R1'),
        ('a.md', 'defaults to <repo>/.opencode/skills', 'R1'),
        ('a.sh', 'cd "$(git rev-parse --show-toplevel)/.opencode/skills"', 'R1'),
        ('a.js', "const p = '(?<=foo)/.opencode/skills/x'", 'R3'),
        ('a.md', 'copy .opencode/skills/x or foo.skilled/skills/x', 'R1'),
        ('a.md', 'run .opencode/skills/x; foo.skilled or .opencode', 'R1'),
        ('a.sh', 'echo >/.opencode/skills/x', 'R3'),
        ('a.js', "const p = '(?<=foo)\\/\\.opencode\\/skills\\/x'", 'R3'),
        ('a.md', 'run .opencode or .skilled-local', 'R3'),
        ('a.md', 'the tree sits under .skilled or .opencode.', 'K'),
        ('a.md', 'copy .opencode/skills/x or https://example.com/.skilled/skills/x', 'R1'),
        ('a.md', 'see //example.com/.opencode/skills/x', 'R3'),
        ('a.md', 'copy .opencode/skills/x and .skilled/skills/xylophone', 'R1'),
        ('a.md', 'OpenCode discovers plugins under .opencode/plugins/', 'R3'),
        ('a.md', 'opencode run loads every skill under `.opencode/skills/`', 'R3'),
        ('a.md', 'dispatch cli-opencode with .opencode/skills/x', 'R1'),
        ('a.yml', "paths: ['{.opencode,.skilled}/skills/**']", 'K'),
        ('a.js', 'const roots = /(\\.opencode|\\.skilled)\\//', 'K'),
    ]
    failures = 0
    for path, text, expected in cases:
        got = next(rule.occurrences(path, text))[2]
        if got != expected:
            failures += 1
            print(f'FAIL {expected} got {got}: {text!r}')
    rewritten, _ = rule.rewrite('a.md', 'run .opencode/skills/a and keep ~/.opencode/state and .opencode-local')
    if rewritten != 'run .skilled/skills/a and keep ~/.opencode/state and .opencode-local':
        failures += 1
        print(f'FAIL rewrite: {rewritten!r}')
    escaped, _ = rule.rewrite('a.js', "/\\.opencode\\/commands\\//")
    if escaped != "/\\.skilled\\/commands\\//":
        failures += 1
        print(f'FAIL escaped rewrite: {escaped!r}')
    escaped_specs, _ = Rule(['skills'], specs_target='canonical').rewrite('a.js', "/\\.opencode\\/specs\\//")
    if escaped_specs != "/specs\\//":
        failures += 1
        print(f'FAIL canonical escaped specs: {escaped_specs!r}')
    canonical = Rule(['skills'], specs_target='canonical')
    specs_line, _ = canonical.rewrite('a.md', 'open .opencode/specs/track/a.md')
    if specs_line != 'open specs/track/a.md':
        failures += 1
        print(f'FAIL canonical specs: {specs_line!r}')
    kept, _ = rule.rewrite('a.md', 'open .opencode/specs/track/a.md')
    if kept != 'open .opencode/specs/track/a.md':
        failures += 1
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
            print('FAIL a stale decision was applied')
        except SystemExit:
            pass
    if not NEW_ROOT.search('under .skilled/skills') or NEW_ROOT.search('backup lives in .skilled-local') or NEW_ROOT.search('see .skilled.json'):
        failures += 1
        print('FAIL new-root name boundary')
    print(f'self-test: {len(cases) + 15 - failures} passed, {failures} failed')
    return failures


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--repo', default=os.getcwd())
    parser.add_argument('--manifest', action='append', help='a file of repository paths, one per line; repeat to combine manifests')
    parser.add_argument('--keep-list')
    parser.add_argument('--judged', help='a file of repository paths whose R1 occurrences also change only by decision')
    parser.add_argument('--decisions')
    parser.add_argument('--kept-ledger', help='append one row per line whose decided keep leaves the token in place')
    parser.add_argument('--specs-target', choices=['keep', 'canonical'], default='keep')
    parser.add_argument('--entries', help='comma-separated source entries, read from the tree when absent')
    parser.add_argument('--map-compat', action='store_true', help='classify as the planning map did: no runtime-view and no dual-root class')
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument('--census', action='store_true')
    mode.add_argument('--review-lines', action='store_true')
    mode.add_argument('--apply', action='store_true')
    mode.add_argument('--self-test', action='store_true')
    args = parser.parse_args()
    if args.self_test:
        sys.exit(1 if self_test() else 0)
    if not args.manifest:
        parser.error('--manifest is required outside --self-test')
    entries = args.entries.split(',') if args.entries else source_entries(args.repo)
    judged = read_manifest(args.judged) if args.judged else []
    rule = Rule(entries, load_keep(args.keep_list), args.specs_target, args.map_compat, judged)
    paths = list(dict.fromkeys(p for manifest in args.manifest for p in read_manifest(manifest)))
    if args.census:
        counts, details, files = Counter(), Counter(), Counter()
        for rel in paths:
            text = read_text(Path(args.repo) / rel)
            seen = set()
            for _, _, cls, detail, _, _ in rule.occurrences(rel, text):
                counts[cls] += 1
                details[f'{cls}:{detail}'] += 1
                seen.add(cls)
            for cls in seen:
                files[cls] += 1
        print(json.dumps({'files': len(paths), 'occurrences': dict(sorted(counts.items())), 'files_by_class': dict(sorted(files.items())), 'details': dict(details.most_common())}, indent=1))
    elif args.review_lines:
        for rel in paths:
            text = read_text(Path(args.repo) / rel)
            for line_no, column, cls, detail, _, line in rule.occurrences(rel, text):
                if rule.reviewable(rel, cls):
                    print(f'{rel}\t{line_no}\t{column}\t{line_hash(line)}\t{cls}:{detail}\t{line.strip()[:240]}')
    elif args.apply:
        total_files, total_lines = apply_manifest(Path(args.repo), paths, rule, args.decisions, args.kept_ledger)
        print(f'APPLIED files={total_files} lines={total_lines}')


if __name__ == '__main__':
    main()
