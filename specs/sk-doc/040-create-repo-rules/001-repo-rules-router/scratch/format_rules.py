"""Uppercase numbered section headings and insert section dividers in the repo-rules set.

Presentation only. Backticked spans are left byte-identical because a heading like
`## 3. Two signals `AGENTS.md` does not carry` must keep the filename readable, and an
uppercased path is a different path to anyone who greps for it. The pass is idempotent
so that re-running it and getting an empty diff is proof the change is confined to
headings, dividers, and the blank lines around them.
"""
import pathlib, re, sys

HEADING = re.compile(r'^## (\d+)\. (.+?)\s*$')
FENCE = re.compile(r'^\s*(```|~~~)')


def upper_outside_backticks(text):
    out, tick = [], False
    for part in text.split('`'):
        out.append(part if tick else part.upper())
        tick = not tick
    return '`'.join(out)


def transform(path):
    lines = pathlib.Path(path).read_text().split('\n')
    out, fenced, changed, found = [], False, 0, 0
    for line in lines:
        if FENCE.match(line):
            fenced = not fenced
            out.append(line)
            continue
        m = None if fenced else HEADING.match(line)
        if not m:
            out.append(line)
            continue
        found += 1
        new_heading = '## %s. %s' % (m.group(1), upper_outside_backticks(m.group(2)))
        # Walk back past blank lines: a divider belongs before the heading's own blank
        # line, not wedged between the heading and the text above it.
        tail = len(out)
        while tail > 0 and out[tail - 1].strip() == '':
            tail -= 1
        if tail > 0 and out[tail - 1].strip() != '---':
            out[tail:] = ['', '---', '']
            changed += 1
        if new_heading != line:
            changed += 1
        out.append(new_heading)
    text = '\n'.join(out)
    pathlib.Path(path).write_text(text)
    return changed, found


targets = ['REPO RULES.md'] + sorted(str(p) for p in pathlib.Path('repo-rules').glob('*.md'))
total = 0
for t in targets:
    n, found = transform(t)
    if found == 0:
        sys.exit('no numbered headings found in %s - refusing to report a silent pass' % t)
    print('%-42s headings=%-3d changes=%d' % (t, found, n))
    total += n
print('total changes:', total)
