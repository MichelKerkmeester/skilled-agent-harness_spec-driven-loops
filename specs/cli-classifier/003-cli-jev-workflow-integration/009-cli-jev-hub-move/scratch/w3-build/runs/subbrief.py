#!/usr/bin/env python3
"""Build a substring-edit task body from a JSON spec.
spec: {"out": path, "file": path, "context": [lines], "edits": [[line, old, new], ...],
       "keep": "sentence", "checks": [cmd lines], "validate": bool}
Each OLD must occur exactly once on its line; the accept line counts distinct changed lines."""
import json, sys
spec = json.load(open(sys.argv[1]))
F = spec["file"]
lines = open(F, encoding="utf-8").read().split("\n")
for ln, o, n in spec["edits"]:
    c = lines[ln - 1].count(o)
    if c != 1:
        sys.exit(f"line {ln}: OLD occurs {c} times: {o!r}")
    if "\u2014" in n:
        sys.exit("em dash in NEW")
changed = len({e[0] for e in spec["edits"]})
out = [f"TASK: literal substring edits in one file, {F}"] + ["Context: " + spec["context"][0]] + spec["context"][1:]
out += ["Each edit gives the line, then the OLD and NEW substrings on their own lines, exactly as they",
        "appear (backticks included). Replace only that substring; keep every other character of the line.", ""]
for i, (ln, o, n) in enumerate(spec["edits"], 1):
    out += [f"{i}. Line {ln}.", f"   OLD: {o}", f"   NEW: {n}"]
if spec.get("keep"):
    out.append(spec["keep"])
out.append("Checks (report result line and exit code):")
out += ["  " + c for c in spec.get("checks", [])]
if spec.get("validate", True) and F.endswith(".md"):
    out.append(f"  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py {F}   (expect exit 0)")
out.append(f"Accept when: 1 file changed, +{changed}/-{changed} lines. No other file differs.")
open(spec["out"], "w", encoding="utf-8").write("\n".join(out) + "\n")
print(spec["out"], len(out), "body lines,", changed, "changed lines")
