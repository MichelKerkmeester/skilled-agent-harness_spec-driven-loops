#!/usr/bin/env python3
"""Check that a changelog entry is in the release-notes layout.

The shape checker covers section order and sentence length. This covers the
layout itself, the parts a GitHub release page shows: no bold outside a folded
block's summary, an anchor on every item heading, links that reach their
anchor, an "&nbsp;" line before every H2, one source line per paragraph and
bullet, bullets of one or two sentences, no H3 and no rule lines, and a linked glance table in an expanded
entry. Every rule is absolute, so a file that passes is in the layout whatever
it looked like before.

Usage: layout_lint.py [--json] <entry.md> [<entry.md> ...]
Exit 0 when every file passes, 1 when any fails.
"""
import json
import re
import sys

FENCE = re.compile(r"^\s*(```+|~~~+)")
CODE_SPAN = re.compile(r"(`+)(?:(?!\1).)+?\1")
BOLD = re.compile(r"\*\*[^*\s][^*]*\*\*|(?<![\w])__[^_\s][^_]*__(?![\w])|<b>|<strong>", re.IGNORECASE)
H4 = re.compile(r"^####\s")
H4_ANCHOR = re.compile(r'<a id="c-[a-z0-9-]+"></a>\s*$')
ANCHOR_ID = re.compile(r'<a id="([^"]+)"></a>')
LINK_TARGET = re.compile(r"\]\(#([^)\s]+)\)")
BLOCK_START = re.compile(r"^\s*(#|\||>|<|&nbsp;\s*$|[-*+]\s|\d+[.)]\s|```|~~~)")
LIST_ITEM = re.compile(r"^\s*([-*+]|\d+[.)])\s")
GLANCE = "what's new at a glance"
# A bullet carries one fact. Two sentences leave room for a fact and its reason.
# A numbered step may carry its own check, so the limit is for plain bullets.
BULLET_MAX_SENTENCES = 2
SENTENCE_END = re.compile(r"[.!?](?=\s+[A-Z`\[(]|\s*$)")


def split_frontmatter(text):
    if text.startswith("---\n"):
        end = text.find("\n---\n", 4)
        if end != -1:
            head = text[: end + 5]
            return head.count("\n"), text[end + 5:].split("\n")
    return 0, text.split("\n")


def lint(text):
    offset, lines = split_frontmatter(text)
    problems = []
    ids, links = set(), []
    fence = None
    seen_body = False
    expanded = False
    glance_open = False
    glance_table = False
    glance_bullets = False
    prev = ""
    prev_kind = None

    def where(i):
        return f"line {offset + i + 1}"

    for i, line in enumerate(lines):
        stripped = line.strip()
        if fence:
            if FENCE.match(line) and stripped.startswith(fence):
                fence = None
            prev_kind = "fence"
            continue
        open_fence = FENCE.match(line)
        if open_fence:
            fence = open_fence.group(1)
            prev_kind = "fence"
            seen_body = True
            continue
        if not stripped:
            prev_kind = None
            continue

        bare = CODE_SPAN.sub("", line)
        if BOLD.search(bare) and "<summary>" not in line.lower():
            problems.append(f"{where(i)}: bold text outside a folded block's summary")
        ids.update(ANCHOR_ID.findall(line))
        links.extend((i, target) for target in LINK_TARGET.findall(bare))

        if stripped.startswith("## "):
            name = stripped[3:].strip().lower()
            if seen_body and prev.strip() != "&nbsp;":
                problems.append(f"{where(i)}: put an \"&nbsp;\" line before the H2")
            glance_open = name == GLANCE
            if name == "upgrade notes":
                expanded = True
        elif stripped.startswith("### "):
            problems.append(f"{where(i)}: H3 heading, use H4 for an item or H2 for a section")
        elif H4.match(stripped):
            expanded = True
            if not H4_ANCHOR.search(stripped):
                problems.append(f"{where(i)}: the H4 does not end with <a id=\"c-...\"></a>")
        elif re.fullmatch(r"-{3,}|\*{3,}|_{3,}", stripped):
            problems.append(f"{where(i)}: rule line, use an \"&nbsp;\" line before an H2 instead")

        if glance_open:
            if stripped.startswith("|") and "change" in stripped.lower() and "section" in stripped.lower():
                glance_table = True
            if LIST_ITEM.match(line):
                glance_bullets = True

        kind = "prose"
        if LIST_ITEM.match(line):
            kind = "item"
            sentences = len(SENTENCE_END.findall(re.sub(r"\]\([^)]*\)", "]", bare).strip()))
            if sentences > BULLET_MAX_SENTENCES and re.match(r"^\s*[-*+]\s", line):
                problems.append(f"{where(i)}: a bullet of {sentences} sentences, split it into bullets of one fact each")
        elif BLOCK_START.match(line):
            kind = "block"
        if kind == "prose" and prev_kind in ("prose", "item"):
            problems.append(f"{where(i)}: the paragraph or bullet above runs onto this line, keep it on one source line")
        if not stripped.startswith("# "):
            seen_body = True
        prev, prev_kind = line, kind

    for i, target in links:
        if target not in ids:
            problems.append(f"{where(i)}: the link #{target} reaches no anchor in the entry")
    if expanded and not glance_table:
        problems.append("expanded entry: the glance section needs a | Change | What It Means | Section | table")
    if not expanded and glance_table:
        problems.append("compact entry: the glance section is plain bullets, not a table")
    return {"expanded": expanded, "problems": problems, "glance_bullets": glance_bullets}


def main(argv):
    as_json = "--json" in argv
    files = [a for a in argv if a != "--json"]
    if not files:
        print(__doc__.strip().splitlines()[0], file=sys.stderr)
        return 2
    reports, failed = [], 0
    for path in files:
        with open(path, encoding="utf-8") as handle:
            result = lint(handle.read())
        result["file"] = path
        reports.append(result)
        failed += bool(result["problems"])
        if not as_json:
            print(f"{'FAIL' if result['problems'] else 'PASS'} {path}")
            for problem in result["problems"]:
                print(f"  [layout] {problem}")
    if as_json:
        print(json.dumps({"files": len(files), "fail": failed, "reports": reports}))
    else:
        print(f"SUMMARY files={len(files)} pass={len(files) - failed} fail={failed}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
