#!/usr/bin/env python3
"""Process a completed deep-research seat into the loop's iteration artifacts.

Usage: process-iter.py <N> <model> <track> "<focus>"
Reads research/logs/iter-N.out.txt (seat JSON), writes:
  - iterations/iteration-{NNN}.md   (narrative)
  - deltas/iter-{N}.jsonl           (>=1 type:iteration + one type:finding each)
  - appends deep-research-state.jsonl
RESERVED key question is never auto-answered.
"""
import json, re, sys, os

ART = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
N = int(sys.argv[1]); MODEL = sys.argv[2]; TRACK = sys.argv[3]; FOCUS = sys.argv[4]
TS = sys.argv[5] if len(sys.argv) > 5 else "2026-06-22T00:00:00Z"

raw = open(os.path.join(ART, "logs", f"iter-{N}.out.txt"), encoding="utf-8", errors="replace").read()

def extract_json(s):
    m = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", s, re.DOTALL)
    cands = []
    if m: cands.append(m.group(1))
    # outermost brace span
    i = s.find("{")
    if i >= 0: cands.append(s[i:s.rfind("}")+1])
    for c in cands:
        try:
            obj = json.loads(c)
            if "findings" in obj: return obj
        except Exception: pass
    # brace-matching fallback from each '{'
    for start in (mm.start() for mm in re.finditer(r"\{", s)):
        depth = 0
        for j in range(start, len(s)):
            if s[j] == "{": depth += 1
            elif s[j] == "}":
                depth -= 1
                if depth == 0:
                    try:
                        obj = json.loads(s[start:j+1])
                        if "findings" in obj: return obj
                    except Exception: break
                    break
    return None

obj = extract_json(raw)
if not obj:
    print(f"ERROR: no parseable findings JSON in iter-{N} (bytes={len(raw)})"); sys.exit(1)

findings = obj.get("findings", [])
answered = [q for q in obj.get("answeredQuestions", []) if "RESERVED" not in q.upper()]
nir = obj.get("newInfoRatio", 0.0)
nexts = obj.get("nextAngles", [])
summary = obj.get("summary", "")
status = "insight" if any(str(f.get("severity","")).upper() == "P0" for f in findings) else "complete"

# iteration-NNN.md
md = [f"# Iteration {N:03d} — Track {TRACK} ({MODEL})", "",
      "## Focus", FOCUS, "", "## Findings"]
for k, f in enumerate(findings, 1):
    md.append(f"{k}. **[{f.get('severity','P2')}] {f.get('label','')}** — {f.get('detail','')}")
    if f.get("recommendation"): md.append(f"   - Recommendation: {f['recommendation']}")
    if f.get("evidence"): md.append(f"   - Evidence: {f['evidence']}")
md += ["", "## Questions Answered"] + ([f"- {q}" for q in answered] or ["- (none)"])
md += ["", "## Questions Remaining", "- RESERVED: emergent angles/risks (permanently open)"]
md += [f"- {a}" for a in nexts]
md += ["", "## Next Focus"] + ([f"- {a}" for a in nexts] or ["- (see research-plan.md)"])
md += ["", "## Summary", summary, ""]
open(os.path.join(ART, "iterations", f"iteration-{N:03d}.md"), "w", encoding="utf-8").write("\n".join(md))

# deltas/iter-N.jsonl
with open(os.path.join(ART, "deltas", f"iter-{N}.jsonl"), "w", encoding="utf-8") as d:
    d.write(json.dumps({"type":"iteration","iteration":N,"newInfoRatio":nir,"status":status,"focus":FOCUS})+"\n")
    for k, f in enumerate(findings, 1):
        d.write(json.dumps({"type":"finding","id":f"f-iter{N:03d}-{k:03d}","severity":f.get("severity","P2"),
                            "label":f.get("label",""),"iteration":N,"track":TRACK,
                            "recommendation":f.get("recommendation",""),"evidence":f.get("evidence","")})+"\n")

# state.jsonl append
rec = {"type":"iteration","run":N,"iteration":N,"mode":"research","status":status,"focus":FOCUS,
       "track":TRACK,"model":MODEL,"findingsCount":len(findings),"newInfoRatio":nir,
       "answeredQuestions":answered,"timestamp":TS,"sessionId":"drs-152-design-md-2026-06-22","generation":1}
with open(os.path.join(ART, "deep-research-state.jsonl"), "a", encoding="utf-8") as st:
    st.write(json.dumps(rec)+"\n")

print(f"iter-{N:03d} [{TRACK}/{MODEL}] findings={len(findings)} P0={sum(1 for f in findings if str(f.get('severity','')).upper()=='P0')} nir={nir} status={status}")
