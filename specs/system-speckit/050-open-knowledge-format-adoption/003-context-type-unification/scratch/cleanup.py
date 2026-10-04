#!/usr/bin/env python3
"""Map off-list contextType and importance_tier values to canonical ones, packet by packet.

Usage (repo root): python3 cleanup.py <sweep.tsv> <report.json>
  sweep.tsv is the helper's output: WARN<TAB>file<TAB>message

For each packet that holds a flagged doc (nearest ancestor with spec.md) it
records the validate.sh --strict RESULT before any edit, rewrites only the
flagged frontmatter line, regenerates the packet's derived metadata with
repair-derived.cjs, and records RESULT again. A packet whose result changes is
reported, and nothing is committed.
"""
import json
import os
import re
import subprocess
import sys

CONTEXT_MAP = {
    "architecture": "planning",
    "implementation-summary": "implementation",
    "handover": "general",
    "task": "planning",
    "research-prompts": "research",
    "audit": "research",
    "testing": "implementation",
    "verification": "implementation",
    "manual-testing": "implementation",
    "implementation-plan": "planning",
    "implementation_plan": "planning",
    "tasks-ledger": "planning",
    "analysis": "research",
    "decision-record": "planning",
    "phase-parent": "planning",
    "review-report": "research",
    "governance": "planning",
    "synthesis": "research",
    "deferred": "general",
    "remediation": "implementation",
    "resource-map": "general",
}
TIER_MAP = {"planning": "normal"}
VALIDATE = ".skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh"
REPAIR = ".skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs"
WARN_RE = re.compile(r'^(contextType|importance_tier) "([^"]+)"')


def packet_of(path):
    folder = os.path.dirname(path)
    while folder and folder != "specs":
        if os.path.isfile(os.path.join(folder, "spec.md")):
            return folder
        folder = os.path.dirname(folder)
    return None


def result_line(folder):
    run = subprocess.run(["bash", VALIDATE, folder, "--strict"], capture_output=True, text=True)
    lines = [ln for ln in (run.stdout + run.stderr).splitlines() if ln.startswith("RESULT:")]
    # A phase parent validates its children too and prints one RESULT per folder,
    # parent first. The first line is the packet's own; the last is only its final child.
    return lines[0] if lines else f"NO RESULT (exit {run.returncode})"


def rewrite(path, key, old, new):
    text = open(path, encoding="utf-8").read()
    end = text.find("\n---", 3)
    head, rest = text[:end], text[end:]
    pattern = re.compile(rf'^({key}:\s*)(["\']?){re.escape(old)}\2[ \t]*$', re.M | re.I)
    head2, count = pattern.subn(lambda m: f"{m.group(1)}{m.group(2)}{new}{m.group(2)}", head, count=1)
    if count != 1:
        return False
    open(path, "w", encoding="utf-8").write(head2 + rest)
    return True


def main():
    sweep, report_path = sys.argv[1], sys.argv[2]
    edits = []
    for line in open(sweep, encoding="utf-8"):
        kind, path, message = line.rstrip("\n").split("\t", 2)
        m = WARN_RE.match(message)
        if kind != "WARN" or not m:
            continue
        key, value = m.group(1), m.group(2)
        target = (CONTEXT_MAP if key == "contextType" else TIER_MAP).get(value)
        edits.append({"path": path, "key": key, "old": value, "new": target, "packet": packet_of(path)})

    unmapped = [e for e in edits if e["new"] is None]
    if unmapped:
        print("unmapped values:", sorted({(e["key"], e["old"]) for e in unmapped}))
        sys.exit(1)

    packets = sorted({e["packet"] for e in edits if e["packet"]})
    report = {"edits": len(edits), "packets": {}, "no_packet": [e["path"] for e in edits if not e["packet"]]}
    for packet in packets:
        report["packets"][packet] = {"before": result_line(packet)}
    for e in edits:
        e["applied"] = rewrite(e["path"], e["key"], e["old"], e["new"])
    for packet in packets:
        repair = subprocess.run(["node", REPAIR, "--folder", packet, "--apply"], capture_output=True, text=True)
        report["packets"][packet]["repair"] = (repair.stdout.strip().splitlines() or [""])[0]
        report["packets"][packet]["after"] = result_line(packet)
    report["applied"] = sum(e["applied"] for e in edits)
    report["not_applied"] = [e["path"] for e in edits if not e["applied"]]
    report["changed_result"] = {p: r for p, r in report["packets"].items() if r["before"] != r["after"]}
    report["mapping"] = {"contextType": CONTEXT_MAP, "importance_tier": TIER_MAP}
    json.dump(report, open(report_path, "w"), indent=2)
    print(f"edits={len(edits)} applied={report['applied']} packets={len(packets)} "
          f"changed_result={len(report['changed_result'])} no_packet={len(report['no_packet'])}")


if __name__ == "__main__":
    main()
