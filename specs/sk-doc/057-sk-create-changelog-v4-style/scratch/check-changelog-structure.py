#!/usr/bin/env python3
"""Mechanical subset of the sk-create-changelog SKILL.md §9 checks.

Usage: check_changelog.py <file> [--excerpt]
--excerpt skips whole-file checks (opening, required sections, caps on the opening)
so a partial example can be checked for section-level structure only.
Prints every violation and every measured cap, exits 1 on any violation.
"""
import re
import sys

path = sys.argv[1]
excerpt = "--excerpt" in sys.argv
text = open(path, encoding="utf-8").read()
lines = text.split("\n")
violations = []
notes = []

# Strip YAML frontmatter.
i = 0
if lines and lines[0].strip() == "---":
    j = 1
    while j < len(lines) and lines[j].strip() != "---":
        j += 1
    i = j + 1
body = lines[i:]

def blocks(seq):
    """Split lines into blank-separated blocks, keeping list items as one block."""
    out, cur = [], []
    for ln in seq:
        if ln.strip() == "":
            if cur:
                out.append(cur)
                cur = []
        else:
            cur.append(ln)
    if cur:
        out.append(cur)
    return out

def sentences(par):
    t = " ".join(par)
    t = re.sub(r"`[^`]*`", "X", t)
    t = re.sub(r"\b(e\.g|i\.e|vs|etc)\.", r"\1", t)
    parts = [p for p in re.split(r"(?<=[.!?])\s+(?=[A-Z`*\"(])", t.strip()) if p.strip()]
    return len(parts)

# C6: opening.
k = 0
while k < len(body) and body[k].strip() == "":
    k += 1
first = body[k] if k < len(body) else ""
if not excerpt:
    if re.match(r"^#\s+v?\d+(\.\d+){2,3}\s*$", first):
        violations.append(f"C6 bare version-title H1: {first!r}")
    if first.startswith("# "):
        notes.append(f"editorial H1 present: {first[:70]!r}")
        k += 1
        while k < len(body) and body[k].strip() == "":
            k += 1
        first = body[k] if k < len(body) else ""
    if first.startswith(("#", ">", "[", "|", "-", "*")) or re.search(r"\d{4}-\d{2}-\d{2}", first[:40]):
        violations.append(f"C6 prose does not open with a narrative paragraph: {first[:80]!r}")

h2 = [(n, ln[3:].strip()) for n, ln in enumerate(body) if ln.startswith("## ")]
h2_names = [t for _, t in h2]
tier = "expanded" if "Upgrade Notes" in h2_names or "Why This Release" in h2_names else "compact"
notes.append(f"tier={tier} h2={h2_names}")

# C8/C9 required sections.
if not excerpt:
    if tier == "compact":
        for req in ("What's New at a Glance", "Upgrade"):
            if req not in h2_names:
                violations.append(f"C8 compact missing ## {req}")
    else:
        for req in ("Why This Release", "What's New at a Glance", "Upgrade Notes"):
            if req not in h2_names:
                violations.append(f"C9 expanded missing ## {req}")
        topical = [t for t in h2_names if t not in ("Why This Release", "What's New at a Glance", "Upgrade Notes")]
        if not topical:
            violations.append("C9 expanded has no topical H2")

# C10: default sections that must not exist.
for n, ln in enumerate(body):
    if re.match(r"^#{2,4}\s+(Files Changed|Changed Files|Test Impact|Schema Changes)\b", ln):
        violations.append(f"C10 default section present: {ln.strip()!r}")
tables = [n for n, ln in enumerate(body) if ln.startswith("|") and (n == 0 or not body[n - 1].startswith("|"))]
notes.append(f"tables={len(tables)}")
for n in tables:
    header = body[n].lower()
    if ("file" in header and ("action" in header or "change" in header)) or "tests" in header:
        violations.append(f"C10/C12 inventory or test table: {body[n][:80]!r}")

# C12: omission heuristics.
for n, ln in enumerate(body):
    if re.search(r"\b\d+\s+(tests?|files?)\s+(pass|passed|passing|changed|modified)\b", ln, re.I):
        violations.append(f"C12 test or file count in prose: line {n + i + 1}: {ln.strip()[:80]!r}")

# C13 caps.
def section_body(name):
    for idx, (n, t) in enumerate(h2):
        if t == name:
            end = h2[idx + 1][0] if idx + 1 < len(h2) else len(body)
            return [ln for ln in body[n + 1:end] if ln.strip() not in ("---", "&nbsp;")]
    return None

if not excerpt:
    first_h2 = h2[0][0] if h2 else len(body)
    opening = [b for b in blocks(body[k:first_h2]) if not b[0].startswith((">", "---", "&nbsp;"))]
    if tier == "compact":
        s = sentences(opening[0]) if opening else 0
        notes.append(f"summary sentences={s}")
        if s > 3:
            violations.append(f"C13 compact summary {s} sentences > 3")
    else:
        notes.append(f"opening paragraphs={len(opening)}")
        if len(opening) > 5:
            violations.append(f"C13 opening {len(opening)} paragraphs > 5")
    wtr = section_body("Why This Release")
    if wtr is not None:
        pars = [b for b in blocks(wtr) if not b[0].lstrip().startswith("- ")]
        sents = sum(sentences(p) for p in pars)
        notes.append(f"why-this-release paragraphs={len(pars)} sentences={sents}")
        if len(pars) > 3:
            violations.append(f"C13 Why This Release {len(pars)} paragraphs > 3")
    glance = section_body("What's New at a Glance")
    if glance is not None:
        bullets = [ln for ln in glance if ln.startswith("- ")]
        notes.append(f"at-a-glance bullets={len(bullets)}")
        if len(bullets) > 12:
            violations.append(f"C13 at-a-glance {len(bullets)} bullets > 12")
        for b in bullets:
            if not b.startswith("- **"):
                violations.append(f"S1 at-a-glance bullet without bold lead-in: {b[:70]!r}")
            if " -- " in b:
                violations.append(f"S1 double-dash bullet instead of a bold lead-in sentence: {b[:60]!r}")
    if tier == "compact":
        prose = [ln for ln in body[k:] if ln.strip() and not ln.startswith(("#", ">", "|"))]
        notes.append(f"compact prose lines={len(prose)}")
        if len(prose) > 40:
            violations.append(f"C13 compact {len(prose)} prose lines > 40")

# H4 items: paragraphs per item, heading words, separators.
h4_word_counts = []
cur_h2 = None
prev_h4_in_h2 = None
for n, ln in enumerate(body):
    if ln.startswith("## "):
        cur_h2 = ln[3:].strip()
        prev_h4_in_h2 = None
        # C14 / S3: nothing between H2 (or its intro) and first H4 may be a separator.
        m = n + 1
        while m < len(body) and not body[m].startswith(("## ", "#### ")):
            m += 1
        if m < len(body) and body[m].startswith("#### "):
            gap = [x.strip() for x in body[n + 1:m]]
            if "&nbsp;" in gap or "---" in gap:
                violations.append(f"S3 separator between H2 {cur_h2!r} and its first H4")
    elif ln.startswith("### "):
        violations.append(f"C14 H3 present: {ln.strip()!r}")
    elif ln.startswith("#### "):
        heading = ln[5:].strip()
        words = len(heading.split())
        h4_word_counts.append(words)
        if words < 2 or words > 10:
            violations.append(f"C14 H4 {words} words: {heading!r}")
        if re.match(r"^\d", heading):
            violations.append(f"C14 numbered H4: {heading!r}")
        if prev_h4_in_h2 is not None:
            gap = [x.strip() for x in body[prev_h4_in_h2 + 1:n]]
            if "&nbsp;" not in gap:
                violations.append(f"S2 no &nbsp; before H4 {heading!r}")
            if "---" in gap:
                violations.append(f"S2 --- between H4s before {heading!r}")
        prev_h4_in_h2 = n
        # paragraphs in this item
        m = n + 1
        while m < len(body) and not body[m].startswith(("## ", "#### ")) and body[m].strip() not in ("&nbsp;", "---"):
            m += 1
        item = [b for b in blocks(body[n + 1:m]) if not b[0].startswith("**Breaking:**")]
        pars = [b for b in item if not b[0].lstrip().startswith(("- ", "|", "```"))]
        lists = [b for b in item if b[0].lstrip().startswith("- ")]
        units = len(pars) + len(lists)
        if units > 7:
            violations.append(f"C13 H4 {heading!r} has {len(pars)} paragraphs + {len(lists)} lists > 7")
if h4_word_counts:
    notes.append(f"h4 count={len(h4_word_counts)} words min={min(h4_word_counts)} max={max(h4_word_counts)}")

# S4: '---' only before an H2.
for n, ln in enumerate(body):
    if ln.strip() == "---":
        m = n + 1
        while m < len(body) and body[m].strip() == "":
            m += 1
        if m < len(body) and not body[m].startswith("## "):
            violations.append(f"S4 --- not followed by an H2 at body line {n + 1}: next {body[m][:50]!r}")

# S5: Problem/Fix labels.
for ln in body:
    if re.search(r"\*\*(Problem|Fix):\*\*", ln):
        violations.append(f"S5 Problem/Fix label: {ln.strip()[:60]!r}")

for x in notes:
    print("NOTE", x)
for v in violations:
    print("FAIL", v)
print(f"RESULT: {'FAILED' if violations else 'PASSED'} ({len(violations)} violations)")
sys.exit(1 if violations else 0)
