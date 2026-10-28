#!/usr/bin/env python3
"""
Fleet gate: every tracked .skilled Markdown file that opens with a frontmatter
fence must parse as YAML.

The validator reads frontmatter key by key, so a block a strict parser rejects
still satisfies the per-document checks until something parses it. This module
runs that parse across the whole fleet, so one broken block anywhere under
.skilled/ fails a test instead of waiting for the next edit of its document.
A first line of '---' is taken as declaring frontmatter here: the validator's
key-line guard exists to keep a thematic break out of the parse, and a file
that opens with the fence has already made that call.

Run: python3 -m pytest -q .skilled/skills/sk-doc/scripts/tests/test_frontmatter_fleet.py
"""

import re
import subprocess
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(SCRIPT_DIR))
import validate_document  # noqa: E402

REPO_ROOT = Path(__file__).resolve().parents[5]
TRACKED_GLOBS = ('.skilled/**/*.md', '.skilled/**/*.markdown')
FRONTMATTER_FENCE = re.compile(r'^---[ \t]*\r?\n(.*?)\r?\n---[ \t]*$', re.DOTALL | re.MULTILINE)

EXCLUSIONS = {
    '.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/grep-convention/non-yaml.md':
        'a deliberate non-YAML fixture for the grep-convention retrieval tests',
}


def tracked_markdown():
    listed = subprocess.run(
        ['git', '-c', 'core.fsmonitor=false', 'ls-files', '--', *TRACKED_GLOBS],
        cwd=REPO_ROOT, capture_output=True, text=True, check=True,
    )
    return [line for line in listed.stdout.splitlines() if line]


def frontmatter_yaml_failure(content):
    """The validator's frontmatter parse verdict, or None when the block parses.

    Mirrors validate_frontmatter_yaml: the strict parser when it is importable,
    otherwise the line check that stands in for it.
    """
    match = FRONTMATTER_FENCE.match(content)
    if not match:
        return None
    block = match.group(1)
    if validate_document.yaml is not None:
        try:
            validate_document.yaml.safe_load(block)
        except validate_document.yaml.YAMLError as exc:
            mark = getattr(exc, 'problem_mark', None)
            line = mark.line + 2 if mark is not None else 2
            detail = getattr(exc, 'problem', None) or str(exc).splitlines()[0]
            return f'frontmatter is not valid YAML at line {line}: {detail}'
        return None
    problem = validate_document._fallback_yaml_problem(block)
    if problem is None:
        return None
    offset, detail, _ = problem
    return f'frontmatter is not valid YAML at line {offset + 2}: {detail}'


def test_tracked_frontmatter_parses_as_yaml():
    failures = []
    checked = 0
    for relative in tracked_markdown():
        if relative in EXCLUSIONS:
            continue
        try:
            content = (REPO_ROOT / relative).read_text(encoding='utf-8')
        except (OSError, UnicodeDecodeError):
            continue
        if content.split('\n', 1)[0].rstrip() != '---':
            continue
        checked += 1
        failure = frontmatter_yaml_failure(content)
        if failure:
            failures.append(f'{relative}: {failure}')
    assert checked > 0, 'no tracked .skilled Markdown file opens with a frontmatter fence'
    assert not failures, 'frontmatter blocks a strict YAML parser rejects:\n' + '\n'.join(failures)


def test_exclusions_are_live():
    stale = []
    for relative, reason in EXCLUSIONS.items():
        path = REPO_ROOT / relative
        if not path.exists():
            stale.append(f'{relative}: no longer exists ({reason})')
        elif validate_document.yaml is None:
            # The line fallback flags an unquoted ': ', a '{{' placeholder and an
            # unescaped inner double quote, none of which a table block carries;
            # the exclusion can only be judged by the strict parser.
            continue
        elif frontmatter_yaml_failure(path.read_text(encoding='utf-8')) is None:
            stale.append(f'{relative}: passes the check now ({reason})')
    assert not stale, 'stale frontmatter exclusions:\n' + '\n'.join(stale)
