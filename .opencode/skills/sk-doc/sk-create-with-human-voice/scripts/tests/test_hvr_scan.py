#!/usr/bin/env python3
"""Masking contract tests for the HVR scanner.

Each check pins a span the scanner must read as prose or must not, because every
number the packet quotes is a count of what survived masking.
"""

import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

SCRIPT_ROOT = Path(__file__).resolve().parents[1]
SCANNER = SCRIPT_ROOT / 'hvr_scan.py'
FIXTURES = SCRIPT_ROOT / 'tests' / 'fixtures'


def _scan(*targets: str) -> dict:
    env = dict(os.environ)
    env['PYTHONDONTWRITEBYTECODE'] = '1'
    result = subprocess.run(
        [sys.executable, str(SCANNER), *targets, '--json'],
        check=False,
        capture_output=True,
        text=True,
        env=env,
    )
    if result.returncode == 2:
        raise SystemExit('hvr_scan refused to run: ' + result.stderr.strip())
    return json.loads(result.stdout)['reports'][0]


def _template(tmp: Path, body: str) -> str:
    """Write a file the scanner detects as a template payload.

    Detection keys on the name and the parent directory, so both matter here.
    """
    assets = tmp / 'assets'
    assets.mkdir(parents=True, exist_ok=True)
    target = assets / 'sample-template.md'
    target.write_text(body, encoding='utf-8')
    return str(target)


def _prose(tmp: Path, body: str) -> str:
    target = tmp / 'draft.md'
    target.write_text(body, encoding='utf-8')
    return str(target)


CODE_PAYLOAD = """# Sample

Prose above the fence.

```typescript
call_tool_chain({
  code: 'const tools = await list_tools();',
});
```

Prose below the fence.
"""

PROSE_PAYLOAD = """# Sample

Copy the block below.

```markdown
**Target**
- Path or span: the file under review
- Operation: score, not apply
```

Fill every row.
"""

WRAPPED_SPAN = """# Draft

The scanner reports the error string `cannot delve into a
robust tapestry` when the parse fails, which is expected.
"""

EMITTED_FRONTMATTER = """# Draft

Prose above the payload.

````markdown
---
title: "A field skeleton, not prose"
description: "The generated document carries an em dash — here, in a field."
---

The payload continues below its own frontmatter.
````

Prose below the payload.
"""


UNCLOSED_FRONTMATTER = """# Doc

````markdown

---
Note: a line that looks like a field

Payload prose; the semicolon must survive.
````

---

Tail prose.
"""


SETEXT_UNDERLINE = """Some Heading
---
Note: a semicolon lives here; it must be found.

An em dash — here.

---

Tail prose.
"""


THEMATIC_RULE = """# Draft

A rule between sections is three dashes and nothing else.

---

The delve below the rule stays a finding, because a rule is not frontmatter.
"""


NESTED_FENCE = """# Draft

Prose above the payload.

````markdown
The payload opens with four backticks so it can carry a fence of its own.

```bash
echo "a shell sample lives here"; echo done
```

The payload continues after the inner fence closes.
````

Prose below the payload.
"""


STRAY_BACKTICK = """# Draft

A lone ` backtick opens nothing, so delve on the next line
stays a finding rather than disappearing into a span.
"""


def run() -> int:
    failures = []

    def check(name: str, condition: bool) -> None:
        print(('PASS ' if condition else 'FAIL ') + name)
        if not condition:
            failures.append(name)

    with tempfile.TemporaryDirectory() as raw:
        tmp = Path(raw)

        code_report = _scan(_template(tmp, CODE_PAYLOAD))
        check(
            'a code-tagged fence inside a template payload is masked',
            code_report['templatePayload'] and code_report['hardBlockers'] == 0,
        )

        prose_report = _scan(_template(tmp, PROSE_PAYLOAD.replace('score, not apply', 'score — not apply')))
        check(
            'a markdown-tagged payload fence is still scanned',
            prose_report['templatePayload'] and prose_report['hardBlockers'] == 1,
        )

        nested_report = _scan(_prose(tmp, NESTED_FENCE))
        check(
            'a shorter fence nested inside a longer one does not close it',
            nested_report['hardBlockers'] == 0,
        )

        emitted_report = _scan(_template(tmp, EMITTED_FRONTMATTER))
        check(
            'a frontmatter block inside a payload is masked like the document\'s own',
            emitted_report['templatePayload'] and emitted_report['hardBlockers'] == 0,
        )

        rule_report = _scan(_template(tmp, THEMATIC_RULE))
        check(
            'a rule between sections is not mistaken for frontmatter',
            rule_report['templatePayload'] and rule_report['hardBlockers'] == 1,
        )

        unclosed_report = _scan(_template(tmp, UNCLOSED_FRONTMATTER))
        check(
            'a rule after the fence does not close a block that never opened',
            unclosed_report['templatePayload'] and unclosed_report['hardBlockers'] == 1,
        )

        setext_report = _scan(_template(tmp, SETEXT_UNDERLINE))
        check(
            'three dashes under a heading are an underline, not frontmatter',
            setext_report['templatePayload'] and setext_report['hardBlockers'] == 2,
        )

        wrapped_report = _scan(_prose(tmp, WRAPPED_SPAN))
        check(
            'an inline code span wrapped across two lines is masked',
            wrapped_report['hardBlockers'] == 0,
        )

        stray_report = _scan(_prose(tmp, STRAY_BACKTICK))
        check(
            'an unmatched backtick does not swallow the paragraph',
            stray_report['hardBlockers'] == 1,
        )

    dirty = _scan(str(FIXTURES / 'voice-dirty.md'))
    check(
        'the dirty fixture still reports its pinned control numbers',
        dirty['hardBlockers'] == 6 and dirty['mechanicalDeductions'] == 33,
    )

    clean = _scan(str(FIXTURES / 'voice-clean.md'))
    check(
        'the clean fixture still reports nothing',
        clean['hardBlockers'] == 0 and not clean['findings'],
    )

    print(f"\n{'ALL PASS' if not failures else f'{len(failures)} FAILED'}")
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(run())
