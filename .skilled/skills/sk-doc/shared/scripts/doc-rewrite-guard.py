#!/usr/bin/env python3
# ---------------------------------------------------------------------------
# COMPONENT: Markdown Rewrite Guard
# ---------------------------------------------------------------------------
"""Compare changed Markdown docs against a base revision and keep what they say.

A rewrite that only reflows a document -- new layout, shorter sentences, a table
where a list was -- must not change a single claim. This guard compares each
changed doc with its base text and reports the ways a form-only rewrite can
silently change meaning instead.

HARD findings are content the doc can no longer be shown to carry: a frontmatter
field, a fenced code sample, a source citation, a heading that another document
links to or cites by number, or any edit at all to a doc a code file consumes.
They fail the run because each one either dropped an assertion or broke another
document's dependence on this one.

ADVISORY findings are changes a reader has to judge: a removed line whose
sentences no longer appear anywhere in the doc, and a changed introduction.
Both can be correct rewrites, so they never change the exit status.

Every finding names the file and, where the position is knowable, the line, so
the reader can confirm the change was intended.

Usage:
  python3 doc-rewrite-guard.py --base <git-ref> [paths...]
"""

from __future__ import annotations

import argparse
import difflib
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import Dict, Iterator, List, Optional, Sequence, Set, Tuple

SCRIPTS = Path(__file__).resolve().parent
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))

import render_exempt  # noqa: E402  The ledger reader owns which docs are code input.
from validation_switch import exit_if_validation_off  # noqa: E402

USAGE = 'doc-rewrite-guard.py --base <git-ref> [paths...]'
DESCRIPTION = (
    'Report how changed Markdown docs differ from a base revision beyond their form. '
    'Exits 1 when a rewrite can no longer be shown to keep a claim, a code sample, a '
    'citation or a cited section.'
)

CHANGELOG_SEGMENT = '/changelog/'
SKIP_PREFIXES = ('specs/',)
# Names that recur in every skill, so a bare mention of one is not evidence that a
# reference is about this file rather than another skill's copy of it.
GENERIC_DOC_NAMES = frozenset({'SKILL.md', 'README.md', 'ROUTER.md'})

FRONTMATTER_RE = re.compile(r'---\n(.*?)\n---\n', re.S)
# A fence may be indented under a list item, and its closing run sits at the same indent.
FENCE_RE = re.compile(r'^([ \t]*)(```+|~~~+)[^\n]*\n.*?^\1\2[ \t]*$', re.S | re.M)
CITATION_RE = re.compile(
    r'\((?:research(?: return)?|docs?|snapshot|source|guide|quoting)\s*:[^)]*\)'
    r'|\[SOURCE:[^\]]*\]',
    re.I,
)
HEADING_RE = re.compile(r'^#{1,6} (.+)$')
NUMBERED_H2_RE = re.compile(r'^##\s+(\d+)[.)]?\s+(\S.*)$')
LINK_WITH_ANCHOR_RE = re.compile(r'\]\(([^)\s#]*)#([^)\s]+)\)')
SECTION_REFERENCE_RE = re.compile(r'§\s*(\d+)|[Ss]ection (\d+)')
INTRO_RE = re.compile(r'^# [^\n]+\n+((?:(?!#|---|<!--)[^\n]+\n?)+)', re.M)
INLINE_CODE_RE = re.compile(r'`[^`]*`')
DOC_TOKEN_RE = re.compile(r'[\w./@-]*\.md\b')

# git resolves its repository and config from these in preference to the working
# directory, so one inherited from the caller would point every read at whichever
# repository the variable names instead of the one the guard was started in.
GIT_REDIRECTORS = frozenset({
    'GIT_DIR', 'GIT_WORK_TREE', 'GIT_COMMON_DIR', 'GIT_INDEX_FILE',
    'GIT_OBJECT_DIRECTORY', 'GIT_ALTERNATE_OBJECT_DIRECTORIES', 'GIT_CONFIG',
    'GIT_CONFIG_COUNT', 'GIT_NAMESPACE', 'GIT_CEILING_DIRECTORIES',
})


class Report:
    """Print findings as they are found, so the output stays in document order."""

    def __init__(self) -> None:
        self.hard_findings = 0
        self.advisory_findings = 0

    def hard(self, kind: str, path: str, line: Optional[int], detail: str) -> None:
        """Record a finding that fails the run."""
        where = f'{path}:{line}' if line else path
        print(f'HARD {kind} {where}: {detail}')
        self.hard_findings += 1

    def advisory(self, kind: str, path: str, detail: str) -> None:
        """Record a finding the reader judges, which never fails the run."""
        print(f'ADVISORY {kind} {path}: {detail}')
        self.advisory_findings += 1


def git_environment() -> Dict[str, str]:
    """Return the process environment without git's repository redirectors."""
    return {key: value for key, value in os.environ.items() if key not in GIT_REDIRECTORS}


def git(*args: str) -> subprocess.CompletedProcess:
    """Run git in the current directory and return the finished process."""
    return subprocess.run(['git', *args], capture_output=True, text=True, env=git_environment())


def read_text(path: Path) -> str:
    """Return the file's text, or the empty string when it cannot be read."""
    try:
        return path.read_text(encoding='utf-8', errors='replace')
    except OSError:
        return ''


def clip(text: str, limit: int) -> str:
    """Return the text on one line and cut to the limit, so a finding stays readable."""
    flat = ' '.join(text.split())
    return flat if len(flat) <= limit else flat[: limit - 3] + '...'


def line_of(text: str, offset: int) -> int:
    """Return the 1-based line number of a character offset."""
    return text.count('\n', 0, offset) + 1


def resolve_base(ref: str) -> Optional[str]:
    """Return the commit a ref names, or None when this repository cannot resolve it."""
    result = git('rev-parse', '--verify', '--quiet', f'{ref}^{{commit}}')
    if result.returncode != 0:
        return None
    return result.stdout.strip() or None


def is_changelog(relative: str) -> bool:
    """Return whether the path belongs to a changelog, whose text is history not docs."""
    return CHANGELOG_SEGMENT in relative


def changed_documents(base: str, paths: Sequence[str]) -> Dict[str, str]:
    """Return each changed Markdown path mapped to its path at base.

    A renamed doc is compared with the text it was renamed from, because a rename
    is exactly when a rewrite slips through unseen. A path present only in the
    working tree maps to itself and has no base text, so only the checks that
    apply to any doc reach it. NUL-separated output keeps names git would quote,
    such as non-ASCII ones, intact. Changelogs are history, not docs, and skipped.
    """
    selector = ['--', *paths]
    found: Dict[str, str] = {}
    fields = git('diff', '--name-status', '-z', '-M', base, *selector).stdout.split('\0')
    index = 0
    while index < len(fields) and fields[index]:
        status = fields[index]
        if status.startswith(('R', 'C')):
            old, new = fields[index + 1], fields[index + 2]
            index += 3
        else:
            old = new = fields[index + 1]
            index += 2
        if status.startswith('C'):
            old = new
        if new.endswith('.md') and not is_changelog(new):
            found[new] = old
    for added in git('ls-files', '-z', '--others', '--exclude-standard', *selector).stdout.split('\0'):
        if added.endswith('.md') and not is_changelog(added):
            found.setdefault(added, added)
    return dict(sorted(found.items()))


def base_text(base: str, path: str) -> Optional[str]:
    """Return the doc as it stood at the base revision, or None when it did not exist."""
    result = git('show', f'{base}:{path}')
    return result.stdout if result.returncode == 0 else None


def numbered_prose_lines(text: str) -> Iterator[Tuple[int, str]]:
    """Yield (line number, line) for the doc's lines outside fenced blocks.

    A heading, link or quote inside a code sample documents the syntax rather than
    being one, so it can neither create an anchor nor make a reference. The number
    counts every line, so a reference after a fence still points at its own line.
    """
    fenced = False
    for number, line in enumerate(text.split('\n'), 1):
        if line.lstrip().startswith(('```', '~~~')):
            fenced = not fenced
            continue
        if fenced:
            continue
        yield number, line


def prose_lines(text: str) -> Iterator[str]:
    """Yield the doc's lines outside fenced blocks."""
    for _number, line in numbered_prose_lines(text):
        yield line


def anchor(heading: str) -> str:
    """Return the GitHub-style anchor a heading is reachable by."""
    cleaned = re.sub(r'[`*]', '', heading.strip().lower())
    return re.sub(r'[^\w\- ]', '', cleaned).replace(' ', '-')


def heading_anchors(text: str) -> Set[str]:
    """Return every anchor the doc's headings produce."""
    found: Set[str] = set()
    for line in prose_lines(text):
        match = HEADING_RE.match(line)
        if match:
            found.add(anchor(match.group(1)))
    return found


def numbered_sections(text: str) -> Dict[str, str]:
    """Return each numbered H2's number mapped to its normalised title."""
    found: Dict[str, str] = {}
    for line in prose_lines(text):
        match = NUMBERED_H2_RE.match(line)
        if match and match.group(1) not in found:
            title = re.sub(r'\s+', ' ', re.sub(r'[`*]', '', match.group(2)))
            found[match.group(1)] = title.strip().lower()
    return found


def skill_root(path: str) -> str:
    """Return the skill folder a doc sits in, or its parent folder outside the skills tree."""
    parts = Path(path).parts
    if len(parts) > 3 and parts[:2] == ('.skilled', 'skills'):
        return str(Path(*parts[:3]))
    return str(Path(path).parent)


def cited_owners(
    line: str, linker: str, owners: Sequence[str], tracked: Sequence[str]
) -> List[str]:
    """Return the changed docs a line actually cites, resolving each path it names.

    A path is resolved from the citing doc's folder and from the repository top, so
    it cites only the file it reaches. A bare file name is shorthand for a file the
    reader can find nearby: it cites a doc in the citing doc's own folder, or the
    one doc of that name in the citing doc's skill. A name that recurs across
    skills, such as references/agent-delegation.md, therefore never pins a doc in
    another skill.
    """
    cited: List[str] = []
    linker_dir = Path(linker).parent
    for token in DOC_TOKEN_RE.findall(line):
        name = Path(token).name
        matching = [owner for owner in owners if Path(owner).name == name]
        if not matching:
            continue
        if '/' in token.strip('./') or token.startswith('../'):
            reached = {
                os.path.normpath(str(linker_dir / token)),
                os.path.normpath(token.lstrip('/')),
            }
            cited.extend(owner for owner in matching if os.path.normpath(owner) in reached)
            continue
        for owner in matching:
            if Path(owner).parent == linker_dir:
                cited.append(owner)
                continue
            if name in GENERIC_DOC_NAMES:
                continue  # Every skill has one, so a bare name says nothing about which.
            root = skill_root(linker)
            same_skill = [doc for doc in tracked if Path(doc).name == name and skill_root(doc) == root]
            if same_skill == [owner]:
                cited.append(owner)
    return [owner for owner in dict.fromkeys(cited) if owner != linker]


def inbound_anchor_links(root: Path, documents: Sequence[str]) -> Dict[Path, Dict[str, List[str]]]:
    """Return the anchors other tracked docs link to, keyed by target file.

    An inbound link is a promise that its heading stays findable, so renaming or
    removing that heading breaks a document the rewriter is not looking at.
    """
    links: Dict[Path, Dict[str, List[str]]] = {}
    for relative in documents:
        source = root / relative
        if not source.is_file():
            continue
        text = read_text(source)
        for number, line in numbered_prose_lines(text):
            stripped = INLINE_CODE_RE.sub('', line)
            for target, fragment in LINK_WITH_ANCHOR_RE.findall(stripped):
                if not target:
                    continue
                destination = (source.parent / target).resolve()
                linkers = links.setdefault(destination, {}).setdefault(anchor(fragment), [])
                linkers.append(f'{relative}:{number}')
    return links


def inbound_section_references(
    root: Path, documents: Sequence[str], targets: Dict[str, List[str]]
) -> Dict[str, List[Tuple[str, int, Set[str], str]]]:
    """Return the numbered-section references made to each changed doc, keyed by its path.

    '<file> §3' names a heading by position rather than by link, so renumbering
    or retitling that heading changes what the citing document points at without
    any link to break.
    """
    references: Dict[str, List[Tuple[str, int, Set[str], str]]] = {}
    for relative in documents:
        source = root / relative
        if not source.is_file():
            continue
        text = read_text(source)
        for number, line in numbered_prose_lines(text):
            if not SECTION_REFERENCE_RE.search(line):
                continue
            stripped = INLINE_CODE_RE.sub('', line)
            hits = {first or second for first, second in SECTION_REFERENCE_RE.findall(stripped)}
            # File names are usually written in backticks, so the names are matched
            # on the raw line while the section numbers come from the code-free one.
            for name, owners in targets.items():
                if name not in line:
                    continue
                for owner in cited_owners(line, relative, owners, documents):
                    references.setdefault(owner, []).append((relative, number, hits, line))
    return references


def frontmatter_fields(text: str) -> List[str]:
    """Return the leading YAML block's lines, ignoring the version line.

    A version bump records that the doc changed, which is bookkeeping, so only the
    remaining fields decide whether the frontmatter still says what it said.
    """
    match = FRONTMATTER_RE.match(text)
    if not match:
        return []
    return [line for line in match.group(1).split('\n') if not line.startswith('version:')]


def fence_label(block: str) -> str:
    """Return a one-line description of a fenced block, enough to find it again."""
    lines = block.split('\n')
    opening = lines[0]
    body = next((line for line in lines[1:] if line.strip()), '')
    return clip(f'{opening} {body}'.strip(), 100)


def normalize(line: str) -> str:
    """Return a line reduced to its words, so formatting cannot hide it.

    Emphasis, list markers and table pipes are exactly what a form-only rewrite
    changes, so dropping them lets the same sentence match before and after.
    """
    text = re.sub(r'[*_`>#|]', ' ', line)
    text = re.sub(r'^\s*(?:[-+]|\d+\.)\s+', ' ', text)
    return re.sub(r'\s+', ' ', text).strip().lower()


def removed_lines(old: str, now: str) -> List[str]:
    """Return the base lines the doc no longer contains at the same place."""
    before = old.split('\n')
    matcher = difflib.SequenceMatcher(None, before, now.split('\n'), autojunk=False)
    removed: List[str] = []
    for tag, start, end, _, _ in matcher.get_opcodes():
        if tag in ('replace', 'delete'):
            removed.extend(before[start:end])
    return removed


def introduction(text: str) -> str:
    """Return the first paragraph after the H1."""
    match = INTRO_RE.search(text)
    return match.group(1).strip() if match else ''


def ledger_key(path: str) -> Optional[str]:
    """Return the doc's ledger key, or None when it sits outside the skills root."""
    try:
        return Path(path).resolve().relative_to(render_exempt.skills_root()).as_posix()
    except ValueError:
        return None


def describe_fields(before: Sequence[str], after: Sequence[str]) -> str:
    """Return the first field that differs and what it became."""
    for index in range(max(len(before), len(after))):
        old_line = before[index] if index < len(before) else '(absent)'
        new_line = after[index] if index < len(after) else '(absent)'
        if old_line != new_line:
            return f'"{old_line}" became "{new_line}"'
    return 'frontmatter differs from base'


def describe_linkers(linkers: Sequence[str]) -> str:
    """Return the inbound linkers, shortened so a long list stays on one line."""
    if len(linkers) <= 3:
        return ', '.join(linkers)
    return f'{", ".join(linkers[:3])} and {len(linkers) - 3} more'


def check_protected(report: Report, path: str, exempt: Dict[str, str], pinned: Dict[str, str]) -> None:
    """Report an edit to a doc that is an input or an approved wording, not prose.

    A consumer script parses such a doc's text or holds it as the reference
    wording, so any edit can break that script even when the words still read
    correctly. There is no form-only rewrite of a file that is not being read as
    prose.
    """
    key = ledger_key(path)
    if key is None:
        return
    if key in exempt:
        report.hard('protected', path, None, f'exempt doc, read by {exempt[key]}')
    if key in pinned:
        report.hard('protected', path, None, f'pinned doc, pinned by {pinned[key]}')


def check_frontmatter(report: Report, path: str, old: str, now: str) -> None:
    """Report a frontmatter field other than the version that no longer matches."""
    before, after = frontmatter_fields(old), frontmatter_fields(now)
    if before != after:
        report.hard('frontmatter', path, None, describe_fields(before, after))


def check_code_blocks(report: Report, path: str, old: str, now: str) -> None:
    """Report fenced samples the rewrite lost or edited.

    A code sample is the most literal claim a doc makes, so reflowing the prose
    around it must carry the block over verbatim. A block present at base and
    absent or different now is a content change, whatever else moved.
    """
    remaining = [match.group(0) for match in FENCE_RE.finditer(old)]
    edited: List[re.Match] = []
    for match in FENCE_RE.finditer(now):
        block = match.group(0)
        if block in remaining:
            remaining.remove(block)
        else:
            edited.append(match)
    for match in edited:
        report.hard(
            'code-block', path, line_of(now, match.start()),
            f'edited fenced block: {fence_label(match.group(0))}',
        )
    for block in remaining:
        report.hard('code-block', path, None, f'missing fenced block: {fence_label(block)}')


def check_citations(report: Report, path: str, old: str, now: str) -> None:
    """Report source citations the rewrite dropped.

    A citation is the provenance of a claim: without it a reader cannot tell a
    checked statement from an invented one, and shortening a paragraph tends to
    take the parenthetical with it.
    """
    for citation in sorted({match.group(0) for match in CITATION_RE.finditer(old)}):
        if citation not in now:
            report.hard('citation', path, None, f'citation gone: {clip(citation, 160)}')


def check_cited_sections(
    report: Report,
    path: str,
    old: str,
    now: str,
    anchor_links: Dict[str, List[str]],
    section_references: Dict[str, List[Tuple[str, int, Set[str], str]]],
    base: Optional[str] = None,
) -> None:
    """Report headings that other docs still point at after this rewrite.

    Cross-document references are invisible from inside the edited file, so both
    forms are compared against the base: a reference that was already broken
    before the rewrite is not this rewrite's doing, and only a reference that
    resolved at base and does not now is reported.
    """
    anchors_before, anchors_after = heading_anchors(old), heading_anchors(now)
    for fragment, linkers in sorted(anchor_links.items()):
        if fragment in anchors_after or fragment not in anchors_before:
            continue
        report.hard(
            'cited-section', path, None,
            f'inbound link #{fragment} from {describe_linkers(linkers)} no longer resolves',
        )
    sections_before, sections_after = numbered_sections(old), numbered_sections(now)
    for linker, number, hits, text in section_references.get(path, []):
        if linker == path:
            continue
        corrected = corrected_citations(base, linker, path, sections_before) if base else set()
        for cited in sorted(hits):
            if cited not in sections_before:
                continue
            if cited not in sections_after:
                report.hard(
                    'cited-section', path, None,
                    f'section {cited} cited by {linker}:{number} is gone',
                )
            elif sections_before[cited] != sections_after[cited]:
                if sections_after[cited] in corrected:
                    continue  # The citing doc was renumbered along with this one.
                report.hard(
                    'cited-section', path, None,
                    f'section {cited} cited by {linker}:{number} was retitled',
                )


def corrected_citations(base: str, linker: str, path: str, sections_before: Dict[str, str]) -> Set[str]:
    """Return the section titles the citing doc pointed at, at base, by number.

    A rewrite that renumbers a section and updates its citation in the same change
    leaves the citation pointing at the same title under a new number. Comparing
    the title the citation reaches now against the titles it reached at base tells
    that case apart from a citation left pointing at a different section.
    """
    old = base_text(base, linker)
    if old is None:
        return set()
    titles: Set[str] = set()
    for _, line in numbered_prose_lines(old):
        if Path(path).name not in line or not SECTION_REFERENCE_RE.search(line):
            continue
        if path not in cited_owners(line, linker, [path], [path]):
            continue
        stripped = INLINE_CODE_RE.sub('', line)
        for first, second in SECTION_REFERENCE_RE.findall(stripped):
            title = sections_before.get(first or second)
            if title:
                titles.add(title)
    return titles


def check_lost_lines(report: Report, path: str, old: str, now: str) -> None:
    """Report removed prose whose sentences no longer appear anywhere in the doc.

    Prose may be reordered, merged or split without losing a claim, so a removed
    line is only reported when its own sentences are gone from the whole doc. It
    stays advisory because a shortened sentence is a judgement call rather than a
    proven loss.
    """
    present = normalize(now.replace('\n', ' '))
    for line in removed_lines(old, now):
        normalized = normalize(line)
        if len(normalized) < 25 or normalized.startswith(('title:', 'description:', 'version:')):
            continue
        parts = [part for part in re.split(r'(?<=[.;:])\s+', normalized) if len(part) >= 20]
        if any(part.rstrip('.;:') not in present for part in parts):
            report.advisory('lost-line', path, f'removed line no longer present: {clip(line, 220)}')


def check_intro(report: Report, path: str, old: str, now: str) -> None:
    """Report a changed introduction.

    The paragraph under the H1 is what a reader uses to decide whether the doc
    answers their question, so replacing it changes the doc's claim about itself
    even when the body is untouched.
    """
    before, after = introduction(old), introduction(now)
    if before != after:
        report.advisory('intro', path, f'was "{clip(before, 200)}" now "{clip(after, 200)}"')


def check_document(
    report: Report,
    path: str,
    old: str,
    now: str,
    anchor_links: Dict[str, List[str]],
    section_references: Dict[str, List[Tuple[str, int, Set[str], str]]],
    base: Optional[str] = None,
) -> None:
    """Run every base comparison for one doc, hard checks first."""
    check_frontmatter(report, path, old, now)
    check_code_blocks(report, path, old, now)
    check_citations(report, path, old, now)
    check_cited_sections(report, path, old, now, anchor_links, section_references, base)
    check_lost_lines(report, path, old, now)
    check_intro(report, path, old, now)


def main(argv: Optional[Sequence[str]] = None) -> int:
    """Report what the rewrites under the given paths changed beyond form."""
    exit_if_validation_off('doc-rewrite-guard.py')
    parser = argparse.ArgumentParser(prog='doc-rewrite-guard.py', usage=USAGE, description=DESCRIPTION)
    parser.add_argument('--base', metavar='<git-ref>', help='revision the working tree is compared against')
    parser.add_argument(
        'paths', nargs='*', metavar='path',
        help='file or directory to check (default: the whole repository)',
    )
    args = parser.parse_args(argv)
    if not args.base:
        parser.error('--base is required')

    base = resolve_base(args.base)
    if base is None:
        print(f'doc-rewrite-guard: unknown base ref "{args.base}"', file=sys.stderr)
        return 2

    # git names changed files from the repository top, so every read happens there;
    # the path arguments are resolved first so they keep meaning what the caller typed.
    top = git('rev-parse', '--show-toplevel').stdout.strip()
    paths = [str(Path(path).resolve()) for path in args.paths]
    if top:
        os.chdir(top)
    root = Path('.').resolve()
    renamed_from = changed_documents(base, paths)
    documents = list(renamed_from)
    if not documents:
        print('doc-rewrite-guard: 0 files, 0 hard, 0 advisory')
        return 0

    exempt, pinned = render_exempt.load_exempt(), render_exempt.load_pinned()
    tracked = [line for line in git('ls-files', '*.md').stdout.splitlines() if line.strip()]
    linkers = [
        path for path in tracked
        if not path.startswith(SKIP_PREFIXES) and not is_changelog(path)
    ]
    anchor_links = inbound_anchor_links(root, linkers)
    targets: Dict[str, List[str]] = {}
    for document in documents:
        targets.setdefault(Path(document).name, []).append(document)
    section_references = inbound_section_references(root, linkers, targets)

    report = Report()
    for path in documents:
        check_protected(report, path, exempt, pinned)
        old = base_text(base, renamed_from[path])
        if old is None:
            continue  # A doc with no base text kept nothing, so only protection applies.
        check_document(
            report, path, old, read_text(Path(path)),
            anchor_links.get(Path(path).resolve(), {}), section_references, base,
        )

    print(
        f'doc-rewrite-guard: {len(documents)} files, '
        f'{report.hard_findings} hard, {report.advisory_findings} advisory'
    )
    return 1 if report.hard_findings else 0


if __name__ == '__main__':
    sys.exit(main())
