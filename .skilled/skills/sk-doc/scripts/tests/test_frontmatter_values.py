#!/usr/bin/env python3
"""
Regression tests for validate_frontmatter_values, the shared-list value warning.

The check reads sk-create-frontmatter's frontmatter-values.json, so skill docs and spec
docs are judged by the same list. Canonical values and aliases pass; a present
value outside the list warns and never blocks; a missing block or a checkout
without the list stays silent; an unreadable list degrades to one warning.

Run: python3 test_frontmatter_values.py   (exit 0 = all pass)
"""

import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import validate_document  # noqa: E402
from validate_document import (  # noqa: E402
    FRONTMATTER_VALUES_PATH,
    _load_frontmatter_values,
    validate_frontmatter_values,
)


def doc(context_type: str, tier: str) -> str:
    return (
        '---\n'
        'title: "Example"\n'
        f'importance_tier: "{tier}"\n'
        f'contextType: {context_type}\n'
        '---\n'
        '# Example\n'
    )


def main() -> int:
    failures = []
    values = _load_frontmatter_values()
    if values is None or not FRONTMATTER_VALUES_PATH.is_file():
        print(f'FAIL shared list not found at {FRONTMATTER_VALUES_PATH}')
        return 1

    cases = [
        ('canonical values pass', doc('planning', 'normal'), []),
        ('aliases pass', doc('review', 'high'), []),
        ('quoted alias passes', doc('"Reference"', 'supporting'), []),
        ('inline YAML comments are not part of the value',
         '---\ncontextType: planning # why\nimportance_tier: "normal" # pinned\n---\n# Example\n', []),
        ('contextType outside the list warns', doc('architecture', 'normal'), ['contextType']),
        ('importance_tier outside the list warns', doc('general', 'planning'), ['importance_tier']),
        ('no frontmatter stays silent', '# Example\n\nBody.\n', []),
    ]
    for name, content, expected_fields in cases:
        warnings = validate_frontmatter_values(content, values)
        fields = [w['message'].split(' ', 1)[0] for w in warnings]
        severities = {w['severity'] for w in warnings}
        if fields != expected_fields or severities - {'warning'}:
            failures.append(f'{name}: got {fields} {sorted(severities)}')

    if validate_frontmatter_values(doc('architecture', 'normal'), None) != []:
        failures.append('a checkout without the list must stay silent')

    degrade_cases = (
        ('unreadable list degrades to one warning', '{"contextType": '),
        ('a list missing contextType degrades to one warning',
         '{"importanceTier": {"canonical": ["normal"], "aliases": []}}'),
    )
    for name, payload in degrade_cases:
        with tempfile.TemporaryDirectory() as directory:
            broken_path = Path(directory) / 'frontmatter-values.json'
            broken_path.write_text(payload, encoding='utf-8')
            original_path = validate_document.FRONTMATTER_VALUES_PATH
            validate_document.FRONTMATTER_VALUES_PATH = broken_path
            try:
                warnings = validate_document.validate_frontmatter_values(
                    doc('planning', 'normal'), validate_document._load_frontmatter_values()
                )
            except Exception as exc:
                failures.append(f'{name}: raised {type(exc).__name__}')
                continue
            finally:
                validate_document.FRONTMATTER_VALUES_PATH = original_path
            types = [w['type'] for w in warnings]
            severities = {w['severity'] for w in warnings}
            if types != ['frontmatter_values_unreadable'] or severities - {'warning'}:
                failures.append(f'{name}: got {types} {sorted(severities)}')
            elif str(broken_path) not in warnings[0]['message']:
                failures.append(f'{name}: warning does not name {broken_path}')

    total = len(cases) + len(degrade_cases) + 1
    for failure in failures:
        print(f'FAIL {failure}')
    print(f'{total - len(failures)}/{total} passed')
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(main())
