import sys
# usage: replace_block.py <file> <start-line-prefix> <end-line-prefix> <new-block-file>
path, start, end, new_path = sys.argv[1:5]
lines = open(path, encoding="utf-8").read().split("\n")
starts = [i for i, l in enumerate(lines) if l.startswith(start)]
if len(starts) != 1:
    sys.exit(f"FAIL: start marker found {len(starts)} times")
ends = [i for i, l in enumerate(lines) if l.startswith(end) and i > starts[0]]
if len(ends) != 1:
    sys.exit(f"FAIL: end marker found {len(ends)} times after the start")
new = open(new_path, encoding="utf-8").read().rstrip("\n").split("\n") + [""]
lines[starts[0]:ends[0]] = new
open(path, "w", encoding="utf-8").write("\n".join(lines))
print(f"REPLACED lines {starts[0] + 1} to {ends[0]} of {path}")
