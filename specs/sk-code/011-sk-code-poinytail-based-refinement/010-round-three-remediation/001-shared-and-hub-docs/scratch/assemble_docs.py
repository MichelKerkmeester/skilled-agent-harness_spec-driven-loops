#!/usr/bin/env python3
"""Assemble tasks.md and plan.md from the skeletons and the generated units.

Run from this spec folder after gen_units.py: python3 -I scratch/assemble_docs.py
"""
import json
import pathlib

units = json.load(open("scratch/dispatch-units.json"))
skeleton = pathlib.Path("scratch/tasks-skeleton.md").read_text()
phase2 = pathlib.Path("scratch/phase2-tasks.md").read_text().rstrip("\n")
phase2 = phase2.replace("plan.md section 8 quotes both", "plan.md section 3, Proposed text, quotes both")
phase2 = phase2.replace("(plan.md section 8 quotes it)", "(plan.md section 3, Proposed text, quotes it)")
assert skeleton.count("@@PHASE2@@") == 1
tasks = skeleton.replace("@@PHASE2@@", phase2)
pathlib.Path("tasks.md").write_text(tasks)

titles = {}
for line in tasks.splitlines():
    if line.startswith("- [ ] T"):
        titles[line[6:10]] = line[11:].split(". ")[0]

def block(text):
    return text if text.endswith("\n") or text == "" else text + "\n"

parts = [pathlib.Path("scratch/plan-head.md").read_text()]
for unit in units:
    tid = unit["task"]
    if unit["kind"] == "create":
        body = open(f"scratch/units/{tid}.create.md").read()
        parts.append(f"#### Proposed text {tid}: {titles[tid]} (`{unit['files'][0]}`, new)\n\n~~~~markdown\n{body}~~~~\n\n")
        continue
    if unit["kind"] != "edit":
        continue
    old = open(f"scratch/units/{tid}.old.txt").read()
    new = open(f"scratch/units/{tid}.new.txt").read()
    if not ("\n" in old or "\n" in new or new == "" or "](" in new):
        continue
    note = " (empty: the OLD lines are deleted)" if new == "" else ""
    parts.append(f"#### Proposed text {tid}: {titles[tid]} (`{unit['files'][0]}`)\n\nOLD:\n\n~~~~text\n{block(old)}~~~~\n\nNEW{note}:\n\n~~~~text\n{block(new)}~~~~\n\n")
parts.append(pathlib.Path("scratch/plan-tail.md").read_text())
pathlib.Path("plan.md").write_text("".join(parts))
print(f"tasks={sum(1 for l in tasks.splitlines() if l.startswith('- [ ] T'))} proposed={len(parts) - 2}")
