"""usage: mkbrief.py <intro-file> <out.brief> <repo-rel path>=<expected file> ...  (cwd = repo root)"""
import sys, difflib, subprocess
intro, out = sys.argv[1:3]
pairs = [a.split("=", 1) for a in sys.argv[3:]]
doc = [open(intro).read().rstrip(), "", "Files:"]
for n, (rel, _) in enumerate(pairs, 1):
    doc.append("%d. %s" % (n, rel))
doc += ["", "Do not touch the frontmatter. A commit hook raises the `version` field.",
        "Each change below gives the exact text to find (OLD) and the exact text that replaces it (NEW).",
        "The first and last lines of OLD and NEW are unchanged context lines, shown so the place is unambiguous.",
        "Blank lines inside OLD and NEW are part of the text. Apply every change, top to bottom.", ""]
verify = []
for rel, exp in pairs:
    a = open(rel).read().split("\n")
    b = open(exp).read().split("\n")
    doc.append("######## FILE: %s ########" % rel)
    k = 0
    ops = [o for o in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes() if o[0] != "equal"]
    for tag, i1, i2, j1, j2 in ops:
        k += 1
        c1 = max(0, i1 - 2); c2 = min(len(a), i2 + 2)
        d1 = j1 - (i1 - c1); d2 = j2 + (c2 - i2)
        old = a[c1:c2]; new = b[d1:d2]
        tail = " (OLD runs to the end of the file)" if c2 == len(a) else ""
        doc += ["", "Change %d, at about line %d%s. Removes %d line(s), adds %d." % (k, i1 + 1, tail, i2 - i1, j2 - j1),
                "<<<<<<< OLD"] + old + ["======= NEW"] + new + [">>>>>>> END"]
    doc.append("")
    wl = len(b) - 1 if b[-1] == "" else len(b)
    ww = sum(len(l.split()) for l in b)
    verify.append("  wc -l < %s      # expect: %d" % (rel, wl))
    verify.append("  wc -w < %s      # expect: %d" % (rel, ww))
doc += ["The markers `<<<<<<< OLD`, `======= NEW` and `>>>>>>> END` are not part of any file. Never write them.", "",
        "Verification (run all, paste the output in the handback):"] + verify
open(out, "w").write("\n".join(doc) + "\n")
print(out, "changes per file ok")
