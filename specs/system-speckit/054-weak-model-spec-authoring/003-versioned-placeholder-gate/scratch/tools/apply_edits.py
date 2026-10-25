import sys
# usage: apply_edits.py <file> <edits-file>
# The edits file holds blocks separated by a line of three equals signs.
# Each block is OLD text, a line of three dashes, then NEW text.
# Every OLD text must occur exactly once or nothing is written.
path, edits_path = sys.argv[1], sys.argv[2]
text = open(path, encoding="utf-8").read()
blocks = [b for b in open(edits_path, encoding="utf-8").read().split("\n===\n") if b.strip()]
for number, block in enumerate(blocks, 1):
    old, sep, new = block.partition("\n---\n")
    if not sep:
        sys.exit(f"FAIL: block {number} has no divider")
    old, new = old.strip("\n"), new.strip("\n")
    if text.count(old) != 1:
        sys.exit(f"FAIL: block {number} old text found {text.count(old)} times")
    text = text.replace(old, new)
open(path, "w", encoding="utf-8").write(text)
print(f"APPLIED {len(blocks)} edits to {path}")
