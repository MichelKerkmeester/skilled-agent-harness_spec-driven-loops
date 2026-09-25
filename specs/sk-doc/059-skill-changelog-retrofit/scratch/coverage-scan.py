#!/usr/bin/env python3
"""Rank kept rewrites by how many of the original's code identifiers they lost.

The fact check is one model's reading, and it has passed compact rewrites that
silently dropped contract facts. Identifiers in backticks are the cheapest
proxy for those facts: an original that names `mutatesWorkspace` in its prose
and a rewrite that never does is worth a human read. The scan only ranks files
for review. A missing identifier can be legitimate, because the contract drops
file tables and internal machinery.

usage: coverage-scan.py <list> [<list> ...] [--min N]
       coverage-scan.py --one <changelog>
Originals come from scratch/orig/, rewrites from the working tree. The --one form
is the rewriter's own self-check: it lists what one rewrite lost, one per line,
and always exits 0 because a listed identifier can be a legitimate drop.
"""
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
ORIG_DIR = HERE / "orig"
SPAN = re.compile(r"`([^`\n]+)`")


def safe_name(file):
    return re.sub(r"[^A-Za-z0-9._-]+", "__", file)


DROPPED_SECTION = re.compile(r"^#{1,6}\s+(?:files changed|verification|verified)\b", re.I)


def prose(text):
    """Drop frontmatter, table rows and any Files Changed or Verification section."""
    if text.startswith("---\n"):
        end = text.find("\n---\n", 4)
        if end != -1:
            text = text[end + 5:]
    out, skipping = [], False
    for line in text.splitlines():
        if re.match(r"^#{1,6}\s", line):
            skipping = bool(DROPPED_SECTION.match(line))
            if skipping:
                continue
        if skipping or line.lstrip().startswith("|"):
            continue
        out.append(line)
    return "\n".join(out)


def missing_for(file):
    orig = ORIG_DIR / safe_name(file)
    new = ROOT / file
    old_spans = set(SPAN.findall(prose(orig.read_text())))
    new_text = " ".join(new.read_text().split())
    return sorted(s for s in old_spans if " ".join(s.split()) not in new_text)


def main(argv):
    if argv[:1] == ["--one"]:
        if len(argv) != 2:
            sys.exit("usage: coverage-scan.py --one <changelog>")
        missing = missing_for(argv[1])
        print(f"identifiers the original names and your file lacks: {len(missing)}")
        for s in missing:
            print(f"- `{s}`")
        return
    minimum = 1
    if "--min" in argv:
        i = argv.index("--min")
        minimum = int(argv[i + 1])
        argv = argv[:i] + argv[i + 2:]
    rows = []
    for lst in argv:
        for file in Path(lst).read_text().split():
            orig = ORIG_DIR / safe_name(file)
            new = ROOT / file
            if not orig.exists() or not new.exists():
                continue
            old_spans = set(SPAN.findall(prose(orig.read_text())))
            new_text = " ".join(new.read_text().split())
            missing = sorted(s for s in old_spans if " ".join(s.split()) not in new_text)
            if len(missing) >= minimum:
                rows.append((len(missing), len(old_spans), file, missing))
    rows.sort(key=lambda r: (-r[0], r[2]))
    for n, total, file, missing in rows:
        print(f"{n}/{total}\t{file}")
        print("\t" + " | ".join(missing))
    print(f"files with >= {minimum} missing: {len(rows)}")


if __name__ == "__main__":
    main(sys.argv[1:])
