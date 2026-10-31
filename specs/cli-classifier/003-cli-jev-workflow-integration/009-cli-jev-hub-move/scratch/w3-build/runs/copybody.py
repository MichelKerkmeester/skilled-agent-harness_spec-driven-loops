#!/usr/bin/env python3
"""Write a copy-then-remove task body. args: attach_name target source_or_- context check_cmd(expect) ..."""
import sys
A = "specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move/scratch/w3-build/attach/"
out, attach, target, source, context = sys.argv[1:6]
checks = sys.argv[6:]
lines = ["TASK: replace one file with a prepared copy" + (", then delete the source it was merged from." if source != "-" else "."), "",
         "Context: " + context, "",
         "STEP 1. Copy the prepared file over the target, byte for byte:",
         f"  cp {A}{attach} {target}"]
n = 2
if source != "-":
    lines += [f"STEP {n}. Delete the merged source with a plain rm (working tree only; never git rm):", f"  rm {source}"]
    n += 1
lines += [f"STEP {n}. Run each check and report its result line and exit code:",
          f"  cmp {A}{attach} {target}   (expect no output, exit 0)"]
if source != "-":
    lines.append(f"  test ! -e {source}   (expect exit 0)")
lines += ["  " + c for c in checks]
acc = f"Accept when: 1 file changed ({target})"
acc += f" and 1 file deleted ({source})." if source != "-" else "."
lines += ["", acc + " No other file differs."]
open(out, "w").write("\n".join(lines) + "\n")
