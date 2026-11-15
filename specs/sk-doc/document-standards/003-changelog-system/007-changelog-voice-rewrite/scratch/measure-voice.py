#!/usr/bin/env python3
"""Measure sentence length and voice-scan results over a list of changelog files.

Usage: measure-voice.py <list-file>

Prints one summary block. Prose is read after the frontmatter, with fenced
blocks, inline code, tables, headings and HTML comments removed, so the
counts describe the sentences a reader reads.
"""
import re
import subprocess
import sys

SCAN = ".skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py"


def sentences(text):
    parts = text.split("---", 2)
    body = parts[2] if text.startswith("---") and len(parts) == 3 else text
    body = re.sub(r"```.*?```", "", body, flags=re.S)
    body = re.sub(r"<!--.*?-->", "", body, flags=re.S)
    body = re.sub(r"`[^`]*`", "X", body)
    keep = []
    for line in body.splitlines():
        s = line.strip()
        if not s or s.startswith(("|", "#", ">", "&nbsp")):
            continue
        keep.append(re.sub(r"^[-*]\s+|\*\*", "", s))
    out = []
    for line in keep:
        for piece in re.split(r"(?<=[.!?])\s+", line):
            if len(piece.split()) > 1:
                out.append(len(piece.split()))
    return out


def main():
    files = [l.strip() for l in open(sys.argv[1]) if l.strip()]
    lengths, blocker_files, over22_files = [], 0, 0
    for f in files:
        w = sentences(open(f, errors="ignore").read())
        lengths.extend(w)
        if any(x > 22 for x in w):
            over22_files += 1
        r = subprocess.run([sys.executable, SCAN, f], capture_output=True, text=True)
        if r.returncode == 1:
            blocker_files += 1
        elif r.returncode not in (0, 1):
            print(f"scan error {r.returncode}: {f}", file=sys.stderr)
    n = len(lengths)
    print(f"files={len(files)} sentences={n} avg_words={sum(lengths)/n:.1f}")
    print(f"sentences_over_15={sum(1 for x in lengths if x > 15)} sentences_over_22={sum(1 for x in lengths if x > 22)}")
    print(f"files_with_a_sentence_over_22={over22_files} files_with_hvr_hard_blockers={blocker_files}")


if __name__ == "__main__":
    main()
