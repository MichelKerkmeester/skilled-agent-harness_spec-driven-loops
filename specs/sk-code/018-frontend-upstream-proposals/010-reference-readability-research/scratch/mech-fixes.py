"""Mechanical layout fixes over sk-code: exact edits only, each asserted to match once."""
import re, pathlib
K = pathlib.Path('.skilled/skills/sk-code')
def edit(rel, old, new, count=1):
    p = K / rel; t = p.read_text()
    assert t.count(old) == count, (rel, t.count(old), old[:60])
    p.write_text(t.replace(old, new)); print('edited', rel)

# Duplicated support sentence pairs created by an earlier line merge.
dup1 = "Baseline widely available since 2019-09-27 (web-features `srcset`). Chrome 38 / Firefox 38 / Safari 10.1."
edit('sk-code-frontend/references/web-performance-and-loading.md', f"- **Support:** {dup1} {dup1}", f"- **Support:** {dup1}")
dup2 = "Baseline limited availability (web-features `overscroll-behavior`). Chrome 144 / Firefox 150 / Safari unsupported."
edit('sk-code-frontend/references/web-layout-and-sizing.md', f"- **Support:** {dup2} {dup2}", f"- **Support:** {dup2}")

# Leaked authoring status token.
edit('sk-code-ci/references/job-shape-rules.md', "## 5. THE COMPOSITE SETUP ACTION\n\nstatus: landed\n\n", "## 5. THE COMPOSITE SETUP ACTION\n\n")

# Two Evidence labels become one line naming both paths.
edit('sk-code-skilled/references/shell/style-guide/overview-structure-and-naming.md',
     "**Evidence**: `.skilled/bin/skilled-loop-shell.sh`\n\n**Evidence**: `.skilled/skills/system-spec-kit/runtime/cli/lib/shell-common.sh:37-45`",
     "**Evidence**: `.skilled/bin/skilled-loop-shell.sh` and `.skilled/skills/system-spec-kit/runtime/cli/lib/shell-common.sh:37-45`")

# The supporting-checklist index lists every asset it indexes.
edit('sk-code-review/references/quick-reference.md',
     "| [test-quality-checklist.md](../assets/test-quality-checklist.md) | Test quality, coverage, and anti-pattern detection |\n",
     "| [test-quality-checklist.md](../assets/test-quality-checklist.md) | Test quality, coverage, and anti-pattern detection |\n| [fix-completeness-checklist.md](../assets/fix-completeness-checklist.md) | Checklist for turning review findings into complete fixes across same-class producers, consumers, algorithms, matrices, and hostile environments. |\n")

# Point the trust state at the section that defines trust.
p = K / 'sk-code-quality/references/quality-config.md'; t = p.read_text()
old = "an untrusted config gives `SKIPPED_UNTRUSTED` with the trust repair line and a run outside git gives `ERROR` with code `GUARD_UNAVAILABLE`."
assert t.count(old) == 1
p.write_text(t.replace(old, old + " [Trust boundary](#8-trust-boundary) says what makes a config trusted.")); print('edited quality-config.md')

# Overview H3 order: Purpose, When to Use, When Not to Use, then the rest in their current order.
FIRST = ['Purpose', 'When to Use', 'When Not to Use']
def reorder(rel):
    p = K / rel; lines = p.read_text().split('\n')
    s = next(i for i, l in enumerate(lines) if l.startswith('## 1.'))
    e = next(i for i in range(s + 1, len(lines)) if lines[i].startswith('## ') or lines[i] == '---')
    starts = [i for i in range(s + 1, e) if lines[i].startswith('### ')]
    head = lines[s:starts[0]]
    blocks = []
    for j, b in enumerate(starts):
        end = starts[j + 1] if j + 1 < len(starts) else e
        blk = lines[b:end]
        while blk and blk[-1] == '': blk.pop()
        blocks.append(blk)
    name = lambda blk: blk[0][4:].strip()
    ordered = [b for f in FIRST for b in blocks if name(b) == f] + [b for b in blocks if name(b) not in FIRST]
    body = []
    for b in ordered: body += b + ['']
    new = lines[:s] + head + body + lines[e:]
    if new != lines:
        p.write_text('\n'.join(new)); print('reordered', rel, [name(b) for b in ordered])
for rel in ['shared/references/workflow-implement.md', 'shared/references/workflow-debug.md', 'shared/references/workflow-verify.md',
            'shared/references/universal/code-quality-standards.md', 'sk-code-frontend/references/figma-to-code.md',
            'sk-code-quality/references/code-style-guide.md', 'sk-code-skilled/references/shared/code-organization/overview-and-module-organization.md',
            'sk-code-skilled/references/shared/hooks.md', 'sk-code-skilled/references/shared/universal-patterns/naming-and-commenting.md']:
    reorder(rel)

# Related resources moves after the authority interface.
p = K / 'sk-code-skilled/references/shared/alignment-verification-automation.md'; t = p.read_text()
m5 = re.search(r'^## 5\. RELATED RESOURCES\n.*?(?=^---\n\n## 6\.)', t, re.S | re.M)
m6 = re.search(r'^## 6\. (ALIGNMENT AUTHORITY INTERFACE.*)$', t, re.M)
assert m5 and m6
sec5 = m5.group(0).rstrip('\n'); rest_start = m5.end()
tail = t[rest_start:]  # begins with '---\n\n## 6.'
sec6 = tail[len('---\n\n'):].rstrip('\n')
assert '\n## ' not in sec6[3:], 'section 6 is not last'
sec6 = sec6.replace('## 6. ', '## 5. ', 1); sec5 = sec5.replace('## 5. ', '## 6. ', 1)
p.write_text(t[:m5.start()] + sec6 + '\n\n---\n\n' + sec5 + '\n'); print('swapped 5 and 6 in alignment-verification-automation.md')
