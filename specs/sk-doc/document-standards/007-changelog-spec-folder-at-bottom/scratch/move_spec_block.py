#!/usr/bin/env python3
"""Move a changelog's spec-folder blockquote from under the summary to the end of the entry.

Usage: move_spec_block.py LIST_FILE [--apply]

The whole contiguous blockquote that holds the "> Spec folder:" line moves, so
continuation lines such as "> Parent packet:" travel with it. Files with more
than one spec-folder line, or with the line inside a code fence, are skipped and
listed, because where each block belongs needs judgment. A file whose block is
already last is left alone.
"""
import re
import sys

SPEC = re.compile(r"^>\s*Spec folders?:", re.IGNORECASE)
FENCE = re.compile(r"^\s*(```|~~~)")


def in_fence(lines, idx):
    return sum(1 for line in lines[:idx] if FENCE.match(line)) % 2 == 1


def move(text):
    lines = text.split("\n")
    hits = [i for i, line in enumerate(lines) if SPEC.match(line)]
    if len(hits) != 1:
        return None, f"spec lines={len(hits)}"
    i = hits[0]
    if in_fence(lines, i):
        return None, "inside code fence"
    # Quote lines above the spec line, such as a "Part of" release link, stay put.
    # Only a bare ">" separator between them and the spec line goes too.
    start = i
    if start > 0 and lines[start - 1].strip() == ">":
        start -= 1
    end = i
    while end + 1 < len(lines) and lines[end + 1].startswith(">"):
        end += 1
    block = lines[i:end + 1]
    rest = lines[end + 1:]
    if all(not line.strip() or line.strip() == "&nbsp;" for line in rest):
        return text, "already last"
    # Drop the blank line that separated the block from what followed it.
    if rest and not rest[0].strip():
        rest = rest[1:]
    body = "\n".join(lines[:start] + rest).rstrip()
    sep = "\n\n&nbsp;\n\n" if re.search(r"^&nbsp;\s*$", body, re.M) else "\n\n"
    return body + sep + "\n".join(block) + "\n", "moved"


def main():
    paths = [p.strip() for p in open(sys.argv[1]) if p.strip()]
    apply = "--apply" in sys.argv
    counts = {}
    for path in paths:
        with open(path, encoding="utf-8") as fh:
            text = fh.read()
        new, status = move(text)
        key = status.split("=")[0] if status.startswith("spec lines") else status
        counts[key] = counts.get(key, 0) + 1
        if new is None:
            print(f"SKIP {status}: {path}")
        elif apply and status == "moved":
            with open(path, "w", encoding="utf-8") as fh:
                fh.write(new)
    print(counts)


if __name__ == "__main__":
    main()
