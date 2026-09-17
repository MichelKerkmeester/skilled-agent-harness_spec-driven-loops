## File 1

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py`

CONTENT:

~~~~text
#!/usr/bin/env python3
"""rewrite-batch.py: classify and rewrite `.opencode` path references for one manifest of repository paths.

Classes, decided per occurrence of the literal token `.opencode`:
  X   never   an identifier or longer name that contains the token, or a home-anchored path
  K   kept    a line the keep-list names, or a dual-root line that spells both root names
  R2  specs   the token followed by the `specs` entry, handled by --specs-target
  R1  path    the token followed by `/<entry>` (or the regex-escaped `\\/<entry>`) for an entry of the source tree
  R1  segment a quoted `'.opencode'` followed by a quoted entry of the source tree, as in path.join(root, '.opencode', 'skills')
  R3  review  anything else: the bare directory, a trailing slash, an entry that does not exist, a lone quoted segment

Modes (dry run unless --apply is given):
  --census          count occurrences per class over the manifest and print JSON
  --review-lines    print every R3 occurrence as a tab-separated line: path, line, column, text
  --apply           rewrite R1 (and R2 when --specs-target is canonical) in place, plus R3 lines named by --decisions
  --verify          for every rewritten concrete path, report whether it resolves at the tip when its old form resolved at --base
  --self-test       run the boundary cases and exit non-zero on any mismatch
"""
import argparse, hashlib, json, os, re, subprocess, sys
from collections import Counter, defaultdict
from pathlib import Path

TOKEN = '.opencode'
NEW = '.skilled'
WORD = re.compile(r'[A-Za-z0-9_]')
HOME_PREFIXES = ('~/', '$HOME/', '${HOME}/')
ENTRY = r'[A-Za-z0-9_.@-]+'
ROOT = r'\\?\.(?:skilled|opencode)'
# A line that spells both root names as alternatives keeps the old name on purpose: a root-name list, a
# brace glob, a regex alternation or prose that offers either root.
DUAL_ROOT = re.compile(
    r"['\"`]\.skilled['\"`]\s*,\s*['\"`]\.opencode['\"`]|['\"`]\.opencode['\"`]\s*,\s*['\"`]\.skilled['\"`]"
    r"|\{\s*\.(?:skilled\s*,\s*\.opencode|opencode\s*,\s*\.skilled)\s*\}"
    r"|\(\?:\s*(?:skilled\s*\|\s*opencode|opencode\s*\|\s*skilled)\s*\)"
    r"|\.(?:skilled|opencode)\\?/?\s*(?:or|and|,|\|)\s*`?\\?\.(?:skilled|opencode)\b"
)
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
    def __init__(self, entries, keep_lines=(), specs_target='keep', map_compat=False):
        self.entries = set(entries)
        self.keep_lines = [(path, re.compile(pattern)) for path, pattern in keep_lines]
        self.specs_target = specs_target
        self.map_compat = map_compat

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
        if before and WORD.match(before):
            return 'X', 'identifier', None
        prefix = text[:token_start]
        if any(prefix.endswith(h) for h in HOME_PREFIXES):
            return 'X', 'home', None
        if after[:1] and (WORD.match(after[:1]) or after[:1] == '-'):
            return 'X', 'longer-name', None
        if after[:1] == '.' and after[1:2] and WORD.match(after[1:2]):
            return 'X', 'longer-name', None
        reason = self.keep(path, text)
        if reason:
            return 'K', reason, None
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

    def rewrite(self, path, text, decisions=frozenset()):
        lines = text.split('\n')
        changed = 0
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
                lines[index] = new_line
                changed += 1
        return '\n'.join(lines), changed


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


def line_key(path, line_no, text):
    return f'{path}\t{line_no}\t{hashlib.sha256(text.encode("utf-8", "surrogateescape")).hexdigest()[:16]}'


def load_decision_rows(path):
    rows = []
    for line in Path(path).read_text().splitlines():
        if not line.strip() or line.startswith('#'):
            continue
        fields = line.split('\t')
        if len(fields) < 5 or fields[3] not in ('rewrite', 'keep') or not fields[4].strip():
            raise SystemExit(f'decision row needs path, line, column, rewrite or keep, and a reason: {line!r}')
        rows.append((fields[0], int(fields[1]), int(fields[2]), fields[3], fields[4].strip()))
    return rows


def load_decisions(path):
    if not path:
        return frozenset()
    chosen = set()
    for line in Path(path).read_text().splitlines():
        if not line.strip() or line.startswith('#'):
            continue
        fields = line.split('\t')
        if len(fields) < 4:
            raise SystemExit(f'decision row needs path, line, column and action: {line!r}')
        if fields[3] == 'rewrite':
            chosen.add((fields[0], int(fields[1]), int(fields[2])))
        elif fields[3] != 'keep':
            raise SystemExit(f'decision action must be rewrite or keep: {line!r}')
    return frozenset(chosen)


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
        ('a.md', 'copy .opencode/skills/x to .skilled/skills/x', 'R1'),
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
    print(f'self-test: {len(cases) + 5 - failures} passed, {failures} failed')
    return failures


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--repo', default=os.getcwd())
    parser.add_argument('--manifest')
    parser.add_argument('--keep-list')
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
    rule = Rule(entries, load_keep(args.keep_list), args.specs_target, args.map_compat)
    paths = read_manifest(args.manifest)
    if args.census:
        counts, details, files = Counter(), Counter(), Counter()
        for rel in paths:
            text = (Path(args.repo) / rel).read_text(errors='surrogateescape')
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


if __name__ == '__main__':
    main()
~~~~
