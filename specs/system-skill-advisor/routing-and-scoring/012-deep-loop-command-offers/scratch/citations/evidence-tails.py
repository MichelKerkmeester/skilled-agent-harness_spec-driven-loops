#!/usr/bin/env python3
"""Check (or --fix) every `Evidence: `path:N` (`anchor`)` tail in the packet's acceptance criteria.

The anchor is the symbol, fixture row id, row label or phrase the cell names. A tail passes when
the anchor text appears on line N of the file. With --fix, N is rewritten to the line where the
anchor appears (it must appear on exactly one line). Also reports any AC row with no tail or a
tail in the old form, and any remaining path:line citation outside the tail.
Run from the repository root.
"""
import re, sys, pathlib, subprocess
PKT = pathlib.Path("specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers")
ADV = pathlib.Path(".skilled/skills/system-skill-advisor/runtime")
fix = "--fix" in sys.argv
docs = [a for a in sys.argv[1:] if not a.startswith("--")] or ["acceptance-criteria.md"]

def resolve(p):
    for c in [pathlib.Path(p), PKT / p, ADV / p, pathlib.Path(".skilled/skills/system-deep-loop/runtime") / p,
              pathlib.Path(".skilled/commands/deep/assets") / p, pathlib.Path(".skilled/changelog/skilled") / p]:
        if c.is_file():
            return c
    hits = subprocess.run(["git", "ls-files", f"*{p}"], capture_output=True, text=True).stdout.split()
    return pathlib.Path(hits[0]) if len(hits) == 1 else None

TAIL = re.compile(r"Evidence: `([^`]+?):(\d+)` \(`([^`]+)`\)")
bad = 0
for doc in docs:
    path = PKT / doc
    lines = path.read_text().splitlines()
    out = []
    for i, l in enumerate(lines, 1):
        rid = re.match(r"^\| (AC-\d+) ", l) or re.match(r"^- \[[ xB]\] (T\d+|CHK-\d+) ", l)
        if rid:
            body = TAIL.sub("", l)
            stray = re.findall(r"`[^`\s]*:\d+`", body)
            if stray:
                bad += 1; print(f"{doc}:{i} {rid.group(1)} line-number citation outside the tail: {stray[:4]}")
            if rid.group(1).startswith("AC-") and not TAIL.search(l):
                bad += 1; print(f"{doc}:{i} {rid.group(1)} has no `Evidence: path:N (anchor)` tail")
        def repl(m):
            global bad
            p, n, a = m.group(1), int(m.group(2)), m.group(3)
            f = resolve(p)
            if not f:
                bad += 1; print(f"{doc}:{i} unresolved path {p}"); return m.group(0)
            src = f.read_text(errors="replace").splitlines()
            needle = f'"id": "{a}"' if f.suffix == ".json" and re.fullmatch(r"[a-z0-9-]+", a) else a
            if 0 < n <= len(src) and needle in src[n - 1]:
                return m.group(0)
            hits = [k for k, s in enumerate(src, 1) if needle in s]
            if fix and len(hits) == 1:
                print(f"{doc}:{i} fixed {p}:{n} -> :{hits[0]} ({a})")
                return f"Evidence: `{p}:{hits[0]}` (`{a}`)"
            bad += 1
            print(f"{doc}:{i} anchor `{a}` not on {p}:{n}; found on lines {hits[:5]}")
            return m.group(0)
        out.append(TAIL.sub(repl, l))
    if fix:
        path.write_text("\n".join(out) + "\n")
print(f"problems={bad}")
sys.exit(1 if bad else 0)
