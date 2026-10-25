import sys
# usage: mutate.py <file> <old> <new>   (old must occur exactly once)
p, old, new = sys.argv[1:4]
t = open(p, encoding="utf-8").read()
if t.count(old) != 1:
    sys.exit(f"FAIL: old text found {t.count(old)} times")
open(p, "w", encoding="utf-8").write(t.replace(old, new))
print("MUTATED")
