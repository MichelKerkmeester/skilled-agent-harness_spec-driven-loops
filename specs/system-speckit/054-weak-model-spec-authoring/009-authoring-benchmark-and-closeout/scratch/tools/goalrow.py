#!/usr/bin/env python3
"""goalrow.py <goal.md> set "<item prefix>" "<state>" "<evidence>"   replace state+evidence of an existing progress row
   goalrow.py <goal.md> addprog "<item>" "<state>" "<evidence>"     append a progress row after the last progress row
   goalrow.py <goal.md> adddev "<item>" "<note>"                    append a row to the deviations table
Reads text for state/evidence/note from argv; keeps the table intact."""
import sys, re
path, mode = sys.argv[1], sys.argv[2]
t = open(path, encoding="utf-8").read().split("\n")
def find_table_end(start_marker):
    i = next(k for k, l in enumerate(t) if l.startswith(start_marker))
    j = i
    while j + 1 < len(t) and t[j + 1].startswith("|"):
        j += 1
    return j
if mode == "set":
    prefix, state, ev = sys.argv[3:6]
    idx = [k for k, l in enumerate(t) if l.startswith("| " + prefix + " |")]
    assert len(idx) == 1, (prefix, idx)
    t[idx[0]] = f"| {prefix} | {state} | {ev} |"
elif mode == "addprog":
    item, state, ev = sys.argv[3:6]
    assert not [l for l in t if l.startswith("| " + item + " |")], item
    j = find_table_end("| Item | State | Evidence |")
    t.insert(j + 1, f"| {item} | {state} | {ev} |")
elif mode == "adddev":
    item, note = sys.argv[3:5]
    assert not [l for l in t if l.startswith("| " + item + " |")], item
    j = find_table_end("| Item | Note |")
    t.insert(j + 1, f"| {item} | {note} |")
open(path, "w", encoding="utf-8").write("\n".join(t))
