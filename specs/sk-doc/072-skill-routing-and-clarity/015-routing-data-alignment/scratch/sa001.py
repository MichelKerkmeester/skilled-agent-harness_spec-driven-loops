#!/usr/bin/env python3
"""Run the sk-code SA-001 advisor probe battery and print per-prompt rows plus the aggregate."""
import json, subprocess, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[5]
ADV = ROOT / ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py"
POS = {
 "P1": "Refactor the parseExecutorConfig function in .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts to throw on missing model when type is cli-opencode.",
 "P2": "Implement a negative-trigger whitelist in gate-3-classifier.ts and run the targeted tests.",
 "P3": "Refactor skill_advisor.py to surface raw ambiguity counts in debug output.",
 "P4": "Write a Vitest covering classifyPrompt() for the resume deep review phrase.",
 "P5": "Configure .vscode/mcp.json to mirror the current codeGraph server inputs.",
 "P6": "Use the OpenCode standards route to clean up this CommonJS helper.",
 "P7": "Add a packet-local helper that formats Gate 3 confusion-matrix rows for the research summary.",
 "P8": "Generate a replacement gate3-baseline.json fixture for the first 100 prompts.",
 "P9": "Refactor the corpus scoring helper so it emits stable JSONL keys in sorted order.",
 "P10": "Build a tiny script that counts how many prompts mention /speckit:resume.",
 "P11": "Add set -euo pipefail and a trap to .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh to clean up the temp dir on exit.",
 "P15": "Add a --threshold flag to verify_alignment_drift.py that adjusts the failure threshold for missing module headers.",
}
NEG = {
 "N1": "Update the sk-code SKILL.md headline section to clarify the two-axis routing model.",
 "N2": "Explain how skill_advisor.py computes uncertainty.",
 "N3": "Resume the deep-review iteration from the last save point.",
 "N4": "Reorganize the cli-opencode README into Quick Start, Architecture, and Reference sections.",
 "N5": "Investigate why the gate-3 classifier mis-categorizes resume prompts and report findings as a research summary.",
}
rows = []
for kind, group in (("pos", POS), ("neg", NEG)):
    for pid, prompt in group.items():
        out = subprocess.run([sys.executable, str(ADV), prompt, "--threshold", "0.8"], capture_output=True, text=True, cwd=ROOT)
        data = json.loads(out.stdout or "[]")
        top = data[0] if data else {}
        rows.append({"id": pid, "kind": kind, "top": top.get("skill"), "confidence": top.get("confidence"),
                     "passes_threshold": top.get("passes_threshold"), "stderr": out.stderr.strip()[:120]})
for r in rows:
    print(json.dumps(r))
pos_win = sum(1 for r in rows if r["kind"] == "pos" and r["top"] == "sk-code" and r["passes_threshold"])
neg_fp = sum(1 for r in rows if r["kind"] == "neg" and r["top"] == "sk-code")
print(f"records={len(rows)} positive={pos_win}/12 accuracy={pos_win/12:.2f} negative_fp={neg_fp}/5 verdict={'PASS' if pos_win >= 10 and neg_fp == 0 else 'FAIL'}")
