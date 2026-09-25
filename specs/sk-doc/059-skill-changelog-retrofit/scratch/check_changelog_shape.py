#!/usr/bin/env python3
"""Check a skill changelog against the compact/expanded shape in
sk-create-changelog's assets/changelog-template.md.

With --old, also compare against the pre-rewrite text: frontmatter must be
unchanged, and every backticked identifier and every number in the new text
must already appear in the old one, so a rewrite cannot introduce facts.

Prints a JSON report and exits 1 when any error is found.
"""

import argparse
import json
import re
import sys

KNOWN_H2 = {"Why This Release", "What's New at a Glance", "Upgrade", "Upgrade Notes"}
BANNED_SECTIONS = re.compile(
    r"^(Files Changed|Test Impact|Test Results|Schema Changes|Verification|Validation|"
    r"Added|Fixed|Changed|Removed|New Features|Bug Fixes|Highlights|Summary|Overview)\b",
    re.I,
)
MACHINE_HEADER = re.compile(
    r"^#{1,2}\s+(\[?\**)?(\S+\s+)?v?\d+(\.\d+){1,3}(\**\]?)?(\s*[-–—]\s*\d{4}-\d{2}-\d{2})?\s*$"
)
SPEC_LINE = re.compile(r"^> Spec folder: `[^`]+`(?:(?:, | and )`[^`]+`)*( \(Level [0-9]\+?\))?$")
SENTENCE_END = re.compile(r"[.!?](?=\s+[A-Z`*(\"]|\s*$)")


def split_frontmatter(text):
    if text.startswith("---\n"):
        end = text.find("\n---\n", 4)
        if end != -1:
            return text[: end + 5], text[end + 5 :]
    return "", text


def strip_code(lines):
    out, fenced = [], False
    for line in lines:
        if line.lstrip().startswith(("```", "~~~")):
            fenced = not fenced
            out.append("")
            continue
        out.append("" if fenced else line)
    return out


def paragraphs(block):
    paras, cur = [], []
    for line in block:
        if line.strip() in ("", "&nbsp;", "---"):
            if cur:
                paras.append(cur)
                cur = []
        else:
            cur.append(line)
    if cur:
        paras.append(cur)
    return paras


def sentence_count(para_lines):
    text = " ".join(l.strip() for l in para_lines)
    text = re.sub(r"`[^`]*`", "X", text)
    return max(1, len(SENTENCE_END.findall(text)))


def check(path, old_path=None):
    errors, warnings = [], []
    text = open(path, encoding="utf-8").read()
    front, body = split_frontmatter(text)
    lines = strip_code(body.split("\n"))

    # Optional editorial H1, never a bare version line.
    idx = 0
    while idx < len(lines) and not lines[idx].strip():
        idx += 1
    if idx < len(lines) and lines[idx].startswith("# "):
        if MACHINE_HEADER.match(lines[idx].strip()):
            errors.append(f"retired machine header: {lines[idx].strip()!r}")
        idx += 1
    for i, line in enumerate(lines):
        s = line.strip()
        if i != idx - 1 and MACHINE_HEADER.match(s):
            errors.append(f"retired machine header: {s!r}")
        if re.match(r"^(\*\*)?(Date|Released|Release date)(\*\*)?:", s, re.I):
            errors.append(f"retired version-date line: {s!r}")
        if re.match(r"^(\[?←|\[back|<- )", s, re.I):
            errors.append(f"retired backlink: {s!r}")
        if re.match(r"^Source:", s):
            errors.append("trailing 'Source:' line; use the '> Spec folder:' blockquote")
        if re.search(r"\*\*(Problem|Fix|Solution|Root cause):\*\*", s):
            errors.append(f"Problem/Fix label: {s[:60]!r}")
        if s.startswith("> Spec folder:") and not SPEC_LINE.match(s):
            errors.append(f"malformed spec-folder line: {s!r}")
        if re.match(r"^### ", line):
            errors.append(f"H3 heading (use H2 for domains, H4 for items): {s!r}")

    # First content must be prose.
    j = idx
    while j < len(lines) and not lines[j].strip():
        j += 1
    if j >= len(lines):
        errors.append("empty body")
        return errors, warnings, "unknown"
    first = lines[j].strip()
    if first.startswith(("#", ">", "-", "*", "|", "---")) and not first.startswith("**"):
        errors.append(f"body must open with the summary narrative, found {first[:50]!r}")

    # Sections.
    h2 = [(i, l[3:].strip()) for i, l in enumerate(lines) if l.startswith("## ")]
    names = [n for _, n in h2]
    topical = [n for n in names if n not in KNOWN_H2]
    for n in names:
        if BANNED_SECTIONS.match(n):
            errors.append(f"default or change-type section not allowed: '## {n}'")
    fmt = "expanded" if topical or "Upgrade Notes" in names else "compact"

    if "What's New at a Glance" not in names:
        errors.append("missing '## What's New at a Glance'")
    if fmt == "compact":
        if names and names[-1] != "Upgrade":
            errors.append("compact format must end with '## Upgrade'")
        extra = [n for n in names if n not in {"Why This Release", "What's New at a Glance", "Upgrade"}]
        if extra:
            errors.append(f"compact format has extra sections: {extra}")
        prose = [l for l in lines[idx:] if l.strip() and not l.startswith("#")]
        if len(prose) > 40:
            errors.append(f"compact file has {len(prose)} prose lines; cap is 40")
    else:
        if "Why This Release" not in names:
            errors.append("expanded format missing '## Why This Release'")
        if not names or names[-1] != "Upgrade Notes":
            errors.append("expanded format must end with '## Upgrade Notes'")
        if not topical:
            errors.append("expanded format needs at least one topical H2 section")

    order = [n for n in names if n in KNOWN_H2]
    want = [n for n in ["Why This Release", "What's New at a Glance"] if n in order]
    if order[: len(want)] != want:
        errors.append(f"section order wrong: {names}")
    if "What's New at a Glance" in names and topical:
        g = names.index("What's New at a Glance")
        if any(names.index(t) < g for t in topical):
            errors.append("topical sections must follow What's New at a Glance")

    # Opening narrative size.
    first_h2 = h2[0][0] if h2 else len(lines)
    opening = [l for l in lines[j:first_h2] if not l.startswith(">")]
    opening_paras = paragraphs(opening)
    if fmt == "compact":
        if len(opening_paras) > 1:
            errors.append(f"compact summary is {len(opening_paras)} paragraphs; use one")
        if opening_paras and sentence_count(opening_paras[0]) > 3:
            errors.append("summary paragraph exceeds 3 sentences")
    elif len(opening_paras) > 5:
        errors.append(f"opening narrative is {len(opening_paras)} paragraphs; cap is 5")

    # Section bodies.
    bounds = [(h2[k][0], h2[k + 1][0] if k + 1 < len(h2) else len(lines), h2[k][1]) for k in range(len(h2))]
    topical_with_h4 = 0
    for start, end, name in bounds:
        block = lines[start + 1 : end]
        if not [l for l in block if l.strip() not in ("", "---", "&nbsp;")]:
            errors.append(f"empty section '## {name}'")
        if name == "Upgrade" and not paragraphs(block):
            errors.append("'## Upgrade' needs its steps or 'No migration required.'")
        if name == "What's New at a Glance":
            items = [l for l in block if re.match(r"^\s*[-*] ", l)]
            if not items:
                errors.append("What's New at a Glance has no bullets")
            if len(items) > 12:
                errors.append(f"What's New at a Glance has {len(items)} bullets; cap is 12")
            for l in items:
                if l.startswith((" ", "\t")):
                    errors.append(f"nested bullet in at-a-glance: {l.strip()[:50]!r}")
                elif not re.match(r"^- \*\*[^*].*?\*\*\s+\S", l):
                    errors.append(f"at-a-glance bullet needs a bold lead-in then text: {l.strip()[:60]!r}")
        if name == "Why This Release":
            paras = [p for p in paragraphs(block) if not p[0].lstrip().startswith(("-", "*"))]
            if len(paras) > 3:
                errors.append(f"Why This Release has {len(paras)} paragraphs; cap is 3")
        if name in topical:
            h4 = [k for k, l in enumerate(block) if l.startswith("#### ")]
            if h4:
                topical_with_h4 += 1
            for n_h4, k in enumerate(h4):
                heading = block[k][5:].strip()
                if len(heading.split()) > 10:
                    errors.append(f"H4 heading over 10 words: {heading!r}")
                if re.match(r"^(\d+[.)]|Phase \d|\d{3}-)", heading):
                    errors.append(f"numbered or packet-id H4 heading: {heading!r}")
                prev = [l.strip() for l in block[:k] if l.strip()]
                if n_h4 > 0 and (not prev or prev[-1] != "&nbsp;"):
                    errors.append(f"missing '&nbsp;' before H4 {heading!r}")
                if n_h4 == 0 and prev and prev[-1] in ("---", "&nbsp;"):
                    errors.append(f"separator between '## {name}' and its first H4")
                stop = h4[n_h4 + 1] if n_h4 + 1 < len(h4) else len(block)
                item_paras = paragraphs(block[k + 1 : stop])
                if len(item_paras) > 7:
                    errors.append(f"H4 item {heading!r} exceeds 7 paragraphs")
                # A one-sentence item reads as a fragment; the house exemplar never has one.
                rich = any(re.match(r"^\s*([-*|]|\d+\. )", l) for p in item_paras for l in p)
                if not rich and sum(sentence_count(p) for p in item_paras) < 2:
                    errors.append(f"H4 item {heading!r} holds one sentence; merge it into a neighbor or say more from the original")
        if name != names[0]:
            prev = [l.strip() for l in lines[:start] if l.strip()]
            if fmt == "expanded" and name not in ("What's New at a Glance",) and prev and prev[-1] == "&nbsp;":
                errors.append(f"'&nbsp;' before H2 '{name}'")

    if fmt == "expanded" and topical and not topical_with_h4:
        errors.append("expanded format needs at least one topical section with H4 items")

    # The glance bullets summarize and the H4 items explain, so no sentence should appear in both.
    # Near-copies count too, so a sentence with one word added still matches.
    seen = []
    for start, end, name in bounds:
        text = " ".join(l.strip() for l in lines[start + 1 : end] if l.strip() and not l.startswith("#"))
        text = re.sub(r"(^|\s)[-*]\s+", " ", text)
        for sent in re.split(r"(?<=[.!?])\s+", re.sub(r"\*\*", "", text)):
            words = set(re.sub(r"[^a-z0-9 ]", " ", sent.lower()).split())
            if len(words) < 6:
                continue
            for other_words, other_name in seen:
                if other_name != name and len(words & other_words) / len(words | other_words) >= 0.8:
                    errors.append(f"sentence repeated in '## {other_name}' and '## {name}': {sent.strip()[:70]!r}")
                    break
            seen.append((words, name))

    for i, l in enumerate(lines):
        if l.strip() == "---":
            nxt = [x for x in lines[i + 1 :] if x.strip()]
            if not nxt or not nxt[0].startswith("## "):
                errors.append("'---' used somewhere other than between H2 sections")
                break

    if any(l.startswith("|") for l in lines):
        warnings.append("table present; keep only when the numbers are the story")

    if old_path:
        old = open(old_path, encoding="utf-8").read()
        old_front, _ = split_frontmatter(old)
        if old_front != front:
            errors.append("frontmatter changed; it must stay byte-identical")
        for tok in sorted(set(re.findall(r"`([^`\n]+)`", body))):
            if tok not in old:
                errors.append(f"identifier not in the original: `{tok}`")
        body_nospec = re.sub(r"\(Level [0-9]\+?\)", "", body)
        body_nospec = re.sub(r"`[^`\n]+`", "", body_nospec)
        for num in sorted(set(re.findall(r"(?<![\w.])\d+(?:[.,]\d+)*(?![\w])", body_nospec))):
            if num not in old:
                errors.append(f"number not in the original: {num}")
        # A spec folder the original credits is how a reader finds the release's
        # full record, so the rewrite keeps it even though it is not a behavior.
        credited, heading = [], ""
        for line in old.splitlines():
            if line.startswith("#"):
                heading = line
                continue
            if re.search(r"spec folder", heading, re.I) or re.search(
                r"spec folder|^\W*(source|spec|packet)s?\W*:", line, re.I
            ):
                credited += [m.rstrip(".") for m in re.findall(r"specs/[\w./-]+", line)]
        if credited and not any(l.strip().startswith("> Spec folder:") for l in body.splitlines()):
            errors.append(
                "the original credits a spec folder ("
                + ", ".join(sorted(set(credited)))
                + "); keep it as one '> Spec folder:' line after the summary, path as written, two paths joined with 'and'"
            )
        for folder in sorted(set(credited)):
            if folder.rstrip("/") not in body:
                warnings.append(f"credited spec folder no longer named anywhere: {folder}")
        # A level the original states records the packet as it stood when the release
        # shipped, so it stays even when the folder has moved or changed level since.
        for level in sorted(set(re.findall(r"\(Level [0-9]\+?\)", old))):
            if level not in body:
                errors.append(f"the original states {level}; keep it on the '> Spec folder:' line as written")
        if re.search(r"breaking", old, re.I) and "**Breaking:**" not in body:
            upgrade = body.split("## Upgrade", 1)[-1] if "## Upgrade" in body else ""
            if not upgrade.strip() or "No migration required" in upgrade or "No upgrade needed" in upgrade:
                warnings.append("original mentions a breaking change; the rewrite has no Breaking marker or upgrade step")

    return errors, warnings, fmt


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("file")
    ap.add_argument("--old")
    args = ap.parse_args()
    errors, warnings, fmt = check(args.file, args.old)
    print(json.dumps({"file": args.file, "format": fmt, "errors": errors, "warnings": warnings}, indent=2))
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
