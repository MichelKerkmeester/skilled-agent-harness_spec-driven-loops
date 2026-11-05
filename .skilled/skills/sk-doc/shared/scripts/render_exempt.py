#!/usr/bin/env python3
# ---------------------------------------------------------------------------
# COMPONENT: Render Exemption Ledger Reader
# ---------------------------------------------------------------------------
"""Single reader for the render ledger's exemption records.

The render check treats every doc as prose, but some docs are the input or the
output of a code file, so rewriting their text would break that code. The ledger
records those docs together with the consumer that depends on them, and this
module is the one place that decides whether a record proves its claim.

It fails closed. A record is kept only when the consumer file exists inside the
skills root and actually names the doc, so a stale, renamed or invented record
exempts nothing and the render check stays at its strictest. Problems are
returned rather than raised, because the caller needs to report every bad record
at once instead of stopping at the first.

The ledger also carries a pinned list: docs whose exact strings a code check
asserts, so a reword there fails that check. Nothing can prove that list is
complete, because a read through a computed path never shows the doc's name at
the call site. So the module offers an advisory scan that finds code reading a
Markdown file by a literal path and reports each doc as pinned, exempt, or a
candidate the pinned list may be missing. The scan is advice only and always
succeeds, because a computed path escapes any literal scan and the list, not
the scan, is the authority.

Usage:
  python3 render_exempt.py --check
  python3 render_exempt.py --scan-pinned
"""

import json
import os
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

RENDER_DEBT_FILE_ENV = 'RENDER_DEBT_FILE'
RENDER_SKILLS_ROOT_ENV = 'RENDER_SKILLS_ROOT'

EXEMPT_KEYS = frozenset({'consumer', 'reason'})
PINNED_KEYS = frozenset({'consumer', 'doc', 'reason'})

SOURCE_SUFFIXES = frozenset({'.js', '.cjs', '.mjs', '.ts', '.py'})
# A read in one of these trees says nothing about what shipped code depends on.
SKIPPED_PARTS = frozenset(
    {'node_modules', 'dist', '__pycache__', 'tests', 'test', 'fixtures', 'benchmark'}
)
READ_CALL_MARKERS = ('readFileSync(', 'readFile(', 'open(', 'read_text(')
QUOTED_MARKDOWN = re.compile(r"""['"`]([^'"`\n]*\.md)['"`]""")
PYTHON_PATH_READ = re.compile(
    r"""Path\(\s*['"`]([^'"`\n]*\.md)['"`]\s*\)\s*\.\s*read_text\s*\("""
)

# The ledger ships beside the packaging check, which is the tool that grew it, so
# the reader and the check cannot disagree about which file records exemptions.
DEFAULT_LEDGER_PATH = (
    Path(__file__).resolve().parents[2]
    / 'sk-create-skill'
    / 'scripts'
    / 'render-known-debt.json'
)


def ledger_path() -> Path:
    """Return the ledger file, honoring the override that callers and tests set."""
    override = os.environ.get(RENDER_DEBT_FILE_ENV)
    return Path(override) if override else DEFAULT_LEDGER_PATH


def skills_root() -> Path:
    """Return the skills root that ledger keys and consumer paths are relative to.

    The default is three levels above this file: the shared script tree sits
    inside the skill that owns it, and that skill sits inside the root the ledger
    keys are written against.
    """
    override = os.environ.get(RENDER_SKILLS_ROOT_ENV)
    return Path(override).resolve() if override else Path(__file__).resolve().parents[3]


def load_ledger_data() -> Dict[str, Any]:
    """Return the parsed ledger, or an empty mapping when it cannot be read as one.

    An absent, unreadable or non-object ledger records no exemptions, so a broken
    ledger can only tighten the render check.
    """
    try:
        data = json.loads(ledger_path().read_text(encoding='utf-8'))
    except (OSError, ValueError):
        return {}
    return data if isinstance(data, dict) else {}


def _inside_root(path: Path, root: Path) -> bool:
    """Return whether a resolved path stays inside the skills root."""
    try:
        path.relative_to(root)
    except ValueError:
        return False
    return True


def _resolve_doc(doc: Any, root: Path) -> Tuple[Optional[Path], Optional[str]]:
    """Return the doc's file and None, or None and the rule its key breaks."""
    if not isinstance(doc, str) or not doc.strip():
        return None, 'doc key must be a non-blank path'
    if Path(doc).is_absolute():
        return None, 'doc key must be a path relative to the skills root'
    candidate = (root / doc).resolve()
    if not _inside_root(candidate, root):
        return None, 'doc key leaves the skills root'
    if not candidate.is_file():
        return None, 'doc file not found under the skills root'
    return candidate, None


def _resolve_consumer(consumer: Any, root: Path) -> Tuple[Optional[Path], Optional[str]]:
    """Return the consumer's file and None, or None and the rule it breaks.

    A consumer outside the skills root proves nothing about a skill doc, so a
    path that leaves the root is rejected rather than read.
    """
    if not isinstance(consumer, str) or not consumer.strip():
        return None, 'consumer must be a non-blank path'
    if Path(consumer).is_absolute():
        return None, 'consumer must be a path relative to the skills root'
    candidate = (root / consumer).resolve()
    if not _inside_root(candidate, root):
        return None, 'consumer path leaves the skills root'
    if not candidate.is_file():
        return None, f'consumer file {consumer} not found under the skills root'
    return candidate, None


# File names that recur across skills, so naming one says nothing about which copy.
GENERIC_DOC_NAMES = frozenset({'SKILL.md', 'README.md', 'ROUTER.md', 'DESIGN.md'})


def _names_doc(consumer_path: Path, doc_path: Path) -> bool:
    """Return whether the consumer's text mentions the doc's file name.

    A consumer that never names the doc is not depending on its text, so the
    pairing is a guess and the doc keeps being render-checked. A generic name such
    as DESIGN.md also needs the doc's folder named, or any copy would qualify.
    """
    try:
        text = consumer_path.read_text(encoding='utf-8', errors='replace')
    except OSError:
        return False
    if doc_path.name not in text:
        return False
    return doc_path.name not in GENERIC_DOC_NAMES or doc_path.parent.name in text


def _doc_label(doc_path: Path) -> str:
    """Return what the consumer has to name: the file, plus its folder for a generic name."""
    if doc_path.name in GENERIC_DOC_NAMES:
        return f'{doc_path.parent.name}/{doc_path.name}'
    return doc_path.name


def _check_exempt(entries: Dict[Any, Any], root: Path, problems: List[str]) -> Dict[str, str]:
    """Return the exempt entries that prove their claim, recording a problem per reject."""
    exempt: Dict[str, str] = {}
    for doc, entry in entries.items():
        key = str(doc)
        prefix = f'exempt {key}:'
        if not isinstance(entry, dict) or set(entry) != EXEMPT_KEYS:
            problems.append(f'{prefix} entry must record exactly consumer and reason')
            continue
        reason = entry['reason']
        if not isinstance(reason, str) or not reason.strip():
            problems.append(f'{prefix} reason is blank')
            continue
        consumer_path, failure = _resolve_consumer(entry['consumer'], root)
        if consumer_path is None:
            problems.append(f'{prefix} {failure}')
            continue
        doc_path, failure = _resolve_doc(key, root)
        if doc_path is None:
            problems.append(f'{prefix} {failure}')
            continue
        if not _names_doc(consumer_path, doc_path):
            problems.append(
                f'{prefix} consumer {entry["consumer"]} does not name {_doc_label(doc_path)}'
            )
            continue
        exempt[key] = entry['consumer']
    return exempt


def _check_pinned(items: List[Any], root: Path, problems: List[str]) -> Dict[str, str]:
    """Return the pinned entries that prove their claim, recording a problem per reject."""
    pinned: Dict[str, str] = {}
    for index, item in enumerate(items):
        doc = item.get('doc') if isinstance(item, dict) else None
        label = doc if isinstance(doc, str) and doc.strip() else f'item #{index}'
        prefix = f'pinned {label}:'
        if not isinstance(item, dict) or set(item) != PINNED_KEYS:
            problems.append(f'{prefix} entry must record exactly doc, consumer and reason')
            continue
        reason = item['reason']
        if not isinstance(reason, str) or not reason.strip():
            problems.append(f'{prefix} reason is blank')
            continue
        consumer_path, failure = _resolve_consumer(item['consumer'], root)
        if consumer_path is None:
            problems.append(f'{prefix} {failure}')
            continue
        doc_path, failure = _resolve_doc(doc, root)
        if doc_path is None:
            problems.append(f'{prefix} {failure}')
            continue
        if not _names_doc(consumer_path, doc_path):
            problems.append(f'{prefix} consumer {item["consumer"]} does not name {_doc_label(doc_path)}')
            continue
        pinned[label] = item['consumer']
    return pinned


def check_ledger(
    data: Any, root: Any
) -> Tuple[Dict[str, str], Dict[str, str], List[str]]:
    """Return the ledger's valid exempt and pinned entries plus the problems found.

    Both maps hold doc path to consumer path, and both are relative to the skills
    root. A record that breaks any rule is left out and reported once, so nothing
    is exempted by a record that cannot prove it. A doc claimed by both lists has
    no single owner, so it is reported and dropped from both rather than letting
    one silently win.
    """
    resolved_root = Path(root).resolve()
    problems: List[str] = []
    entries = data.get('exempt') if isinstance(data, dict) else None
    exempt = _check_exempt(entries, resolved_root, problems) if isinstance(entries, dict) else {}

    items = data.get('pinned') if isinstance(data, dict) else None
    pinned = _check_pinned(items, resolved_root, problems) if isinstance(items, list) else {}

    for doc in sorted(set(exempt) & set(pinned)):
        problems.append(f'{doc}: listed in both exempt and pinned')
        del exempt[doc]
        del pinned[doc]
    return exempt, pinned, problems


def load_exempt() -> Dict[str, str]:
    """Return the valid exempt entries as doc path to consumer path."""
    return check_ledger(load_ledger_data(), skills_root())[0]


def load_pinned() -> Dict[str, str]:
    """Return the valid pinned entries as doc path to consumer path."""
    return check_ledger(load_ledger_data(), skills_root())[1]


def _repository_root(root: Path) -> Path:
    """Return the repository root: the parent of the folder that holds the skills root.

    Code in a skill often spells a doc as a path from the repository root, so a
    literal is tried against that base too. A skills root that is not shaped
    that way falls back to its own parent, which is the closest guess available.
    """
    parent = root.parent
    return parent.parent if parent.name == '.skilled' else parent


def _source_files(root: Path):
    """Yield the code files under the skills root, skipping vendored and test trees."""
    for current, directories, names in os.walk(root):
        directories[:] = sorted(d for d in directories if d not in SKIPPED_PARTS)
        for name in sorted(names):
            path = Path(current) / name
            if path.suffix in SOURCE_SUFFIXES:
                yield path


def _literal_markdown_paths(line: str) -> List[str]:
    """Return the Markdown paths this line hands to a read call as literals.

    The arguments end at the first closing parenthesis on the line, which keeps
    a nested call from swallowing the next statement's quotes.
    """
    literals = [match.group(1) for match in PYTHON_PATH_READ.finditer(line)]
    for marker in READ_CALL_MARKERS:
        start = line.find(marker)
        while start != -1:
            opening = start + len(marker)
            closing = line.find(')', opening)
            arguments = line[opening:] if closing == -1 else line[opening:closing]
            match = QUOTED_MARKDOWN.search(arguments)
            if match:
                literals.append(match.group(1))
            start = line.find(marker, start + 1)
    return literals


def _resolve_literal(
    literal: str, source: Path, root: Path, repository_root: Path
) -> Optional[str]:
    """Return the doc path relative to the skills root, or None when nothing matches.

    A literal is resolved against the code file's folder first, then against the
    repository root, because both spellings occur. A read that resolves outside
    the skills root is not a skill doc, so it is dropped.
    """
    literal_path = Path(literal)
    bases = (None,) if literal_path.is_absolute() else (source.parent, repository_root)
    for base in bases:
        candidate = literal_path if base is None else base / literal_path
        resolved = candidate.resolve()
        if resolved.is_file() and _inside_root(resolved, root):
            return resolved.relative_to(root).as_posix()
    return None


def find_literal_reads(root: Any) -> Dict[str, Tuple[str, int]]:
    """Return each doc a literal read names, as doc path to code path and line.

    Only the first read site per doc is kept, because a second site adds nothing
    a maintainer can act on. A doc read through a computed path is absent here,
    which is why the ledger's pinned list stays authoritative.
    """
    resolved_root = Path(root).resolve()
    repository_root = _repository_root(resolved_root)
    found: Dict[str, Tuple[str, int]] = {}
    for source in _source_files(resolved_root):
        try:
            text = source.read_text(encoding='utf-8', errors='replace')
        except OSError:
            continue
        code = source.relative_to(resolved_root).as_posix()
        for number, line in enumerate(text.splitlines(), start=1):
            for literal in _literal_markdown_paths(line):
                doc = _resolve_literal(literal, source, resolved_root, repository_root)
                if doc is not None and doc not in found:
                    found[doc] = (code, number)
    return found


def pinned_scan_lines(
    root: Any, exempt: Dict[str, str], pinned: Dict[str, str]
) -> List[str]:
    """Return the advisory scan's report lines for the given ledger maps."""
    reads = find_literal_reads(root)
    lines: List[str] = []
    found_pinned = found_exempt = found_candidate = 0
    for doc in sorted(reads):
        if doc in pinned:
            lines.append(f'PINNED {doc}')
            found_pinned += 1
        elif doc in exempt:
            lines.append(f'EXEMPT {doc}')
            found_exempt += 1
        else:
            code, number = reads[doc]
            lines.append(f'CANDIDATE {doc} (read by {code}:{number})')
            found_candidate += 1
    unseen = sorted(doc for doc in pinned if doc not in reads)
    for doc in unseen:
        lines.append(
            f'PINNED-UNSEEN {doc} (pinned by {pinned[doc]}; read through a computed path)'
        )
    lines.append(
        f'pinned scan: {found_pinned} pinned, {found_exempt} exempt, '
        f'{found_candidate} candidates, {len(unseen)} pinned unseen'
    )
    return lines


def scan_pinned() -> int:
    """Print the advisory pinned scan and always succeed.

    The scan never fails the caller: it lists what a literal search can see, so
    a reader can add a pinned record the list is missing. A broken ledger record
    silently drops out here, which narrows the report but never breaks it, and
    the check mode is where a bad record gets reported.
    """
    exempt, pinned, _ = check_ledger(load_ledger_data(), skills_root())
    for line in pinned_scan_lines(skills_root(), exempt, pinned):
        print(line)
    return 0


def main(argv: Optional[List[str]] = None) -> int:
    """Report the ledger's problems, its counts, or the advisory pinned scan."""
    args = list(sys.argv[1:] if argv is None else argv)
    if args == ['--scan-pinned']:
        return scan_pinned()
    if args != ['--check']:
        print('usage: render_exempt.py --check | --scan-pinned', file=sys.stderr)
        return 2
    exempt, pinned, problems = check_ledger(load_ledger_data(), skills_root())
    for problem in problems:
        print(problem)
    if problems:
        return 1
    print(f'render ledger: {len(exempt)} exempt, {len(pinned)} pinned, 0 problems')
    return 0


if __name__ == '__main__':
    sys.exit(main())
