#!/usr/bin/env python3
"""
Regression tests for validate_frontmatter_yaml, the strict-parser frontmatter gate.

An unquoted value holding ': ' reads as a nested mapping, so a strict parser
rejects the block while every key-by-key frontmatter check still finds its keys.
The check reports one blocking issue with the parser's line and a quoting hint;
quoting the value clears it. PyYAML is optional, so the two verdicts are also
asserted under each interpreter on this machine that can import the validator.

Run: python3 test_frontmatter_yaml.py   (exit 0 = all pass)
"""

import json
import subprocess
import sys
import tempfile
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(SCRIPT_DIR))
import validate_document  # noqa: E402

BAD = (
    '---\n'
    'name: sk-create-frontmatter\n'
    'description: Own it: the rules\n'
    'version: 1.0.3.0\n'
    '---\n'
    '# Example\n'
)
GOOD = BAD.replace('description: Own it: the rules', 'description: "Own it: the rules"')

PARITY_SNIPPET = (
    'import json, sys\n'
    'sys.path.insert(0, sys.argv[1])\n'
    'import validate_document\n'
    'print(json.dumps([i["type"] for i in validate_document.validate_frontmatter_yaml(sys.stdin.read())]))\n'
)
PARITY_INTERPRETERS = ('/usr/bin/python3', '/opt/homebrew/bin/python3')


def issues(content: str):
    return validate_document.validate_frontmatter_yaml(content)


def main() -> int:
    failures = []
    checks = 0

    checks += 1
    bad = issues(BAD)
    if [i['type'] for i in bad] != ['frontmatter_invalid_yaml']:
        failures.append(f'unquoted ": " value: got {[i["type"] for i in bad]}')
    elif bad[0]['severity'] != 'blocking':
        failures.append(f'unquoted ": " value: severity is {bad[0]["severity"]}')
    elif bad[0].get('line_number') != 3:
        failures.append(f'unquoted ": " value: line_number is {bad[0].get("line_number")}')
    elif 'quote' not in bad[0].get('fix_hint', '').lower():
        failures.append('unquoted ": " value: fix_hint does not say to quote')

    checks += 1
    if issues(GOOD):
        failures.append(f'quoted value: got {[i["type"] for i in issues(GOOD)]}')

    silent_cases = [
        ('no frontmatter', '# Example\n\nBody.\n'),
        ('literal block scalar', '---\ndescription: |\n  Own it: the rules\n---\n# Example\n'),
        ('folded block scalar', '---\ndescription: >-\n  Own it: the rules\n---\n# Example\n'),
        ('list item', '---\ntrigger_phrases:\n  - Own it: the rules\n---\n# Example\n'),
        ('quoted value with comment', '---\ndescription: "Own it: the rules" # note: kept\n---\n# Example\n'),
        ('URL in plain scalar', '---\ndescription: See https://example.com/docs\n---\n# Example\n'),
        ('flow mapping', '---\nseverityCounts: { "P0": 3, "P1": 8 }\n---\n# Example\n'),
        ('thematic break after a comment', '<!-- note -->\n\n---\n\n## Section\n\nBody.\n'),
    ]
    for name, content in silent_cases:
        checks += 1
        found = issues(content)
        if found:
            failures.append(f'{name}: got {[i["type"] for i in found]}')

    checks += 1
    trivia = '<!-- note -->\n' + BAD
    found = issues(trivia)
    if [i['type'] for i in found] != ['frontmatter_invalid_yaml']:
        failures.append(f'leading comment: got {[i["type"] for i in found]}')
    elif found[0].get('line_number') != 4:
        failures.append(f'leading comment: line_number is {found[0].get("line_number")}')

    for name, content, expected in (
        ('document check blocks the bad block', BAD, True),
        ('document check passes the quoted block', GOOD, False),
    ):
        checks += 1
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'SKILL.md'
            path.write_text(content, encoding='utf-8')
            result = validate_document.validate_document(
                str(path), doc_type='skill', skip_exclusions=True
            )
        types = [e['type'] for e in result.get('blocking_errors', [])]
        if ('frontmatter_invalid_yaml' in types) != expected:
            failures.append(f'{name}: blocking types {types}')
        elif expected and result.get('exit_code') != 1:
            failures.append(f'{name}: exit_code is {result.get("exit_code")}')

    for interpreter in PARITY_INTERPRETERS:
        if not Path(interpreter).exists():
            continue
        for name, content, expected in (
            ('bad', BAD, ['frontmatter_invalid_yaml']),
            ('quoted', GOOD, []),
        ):
            checks += 1
            run = subprocess.run(
                [interpreter, '-c', PARITY_SNIPPET, str(SCRIPT_DIR)],
                input=content, capture_output=True, text=True,
            )
            if run.returncode != 0:
                failures.append(f'{interpreter} {name}: exit {run.returncode} {run.stderr.strip()}')
                continue
            types = json.loads(run.stdout)
            if types != expected:
                failures.append(f'{interpreter} {name}: got {types}')

    for failure in failures:
        print(f'FAIL {failure}')
    print(f'{checks - len(failures)}/{checks} passed')
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(main())
