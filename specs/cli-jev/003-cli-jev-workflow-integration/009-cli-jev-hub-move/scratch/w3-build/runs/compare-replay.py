#!/usr/bin/env python3
"""Compare a replay against the baseline: action, selectionKind, target packetIds, exit code.
Reads hub cli-jev as cli-classifier, skillId cli-jev as cli-classifier, workflowMode cli-usage as cli-jev;
ignores effectivePolicyHash and generation."""
import json, re, sys
def parse(path):
    rows = {}
    cur = None
    for line in open(path, encoding="utf-8"):
        m = re.match(r"PROMPT (\d+): (.*)", line.rstrip("\n"))
        if m:
            cur = int(m.group(1)); rows[cur] = {"prompt": m.group(2), "out": None, "exit": None}; continue
        m = re.match(r"EXIT (\d+): (\d+)", line)
        if m:
            rows[int(m.group(1))]["exit"] = int(m.group(2)); continue
        if cur is not None and line.startswith("{"):
            rows[cur]["out"] = json.loads(line)
    return rows
MAP_HUB = {"cli-jev": "cli-classifier"}
MAP_MODE = {"cli-usage": "cli-jev"}
def norm(o, exitc):
    return {
        "hubId": MAP_HUB.get(o.get("hubId"), o.get("hubId")),
        "action": o.get("action"),
        "selectionKind": o.get("selectionKind"),
        "targets": [(MAP_HUB.get(t.get("skillId"), t.get("skillId")), MAP_MODE.get(t.get("workflowMode"), t.get("workflowMode")), t.get("packetId")) for t in (o.get("targets") or [])],
        "exit": exitc,
    }
base, after = parse(sys.argv[1]), parse(sys.argv[2])
fails = 0
for i in sorted(base):
    b, a = base[i], after.get(i)
    nb, na = norm(b["out"], b["exit"]), norm(a["out"], a["exit"])
    same = (a["prompt"] == b["prompt"] and nb == na)
    fails += 0 if same else 1
    tg = "+".join(f"{m}/{p}" for _, m, p in na["targets"]) or "-"
    print(f"{i:02d} | {'MATCH' if same else 'MISMATCH'} | {b['prompt']} | {na['action']} {na['selectionKind'] or '-'} {tg} exit {na['exit']}"
          + ("" if same else f" | baseline {nb}"))
print(f"TOTAL {len(base)} rows, {len(base) - fails} match, {fails} mismatch")
sys.exit(1 if fails else 0)
