#!/usr/bin/env python3
"""Extract findings JSON from each opencode --format json seat stream and aggregate."""
import json, re, sys, os, glob

RDIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEATS = os.path.join(RDIR, "seats")

def collect_text(path):
    """Concatenate all assistant text parts from an opencode JSONL event stream."""
    chunks = []
    def walk(o):
        if isinstance(o, dict):
            if o.get("type") == "text" and isinstance(o.get("text"), str):
                chunks.append(o["text"])
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
    with open(path) as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                walk(json.loads(line))
            except json.JSONDecodeError:
                pass
    return "".join(chunks)

def extract_json_obj(text):
    """Find the findings object: prefer one containing '\"slice\"'. Balance braces."""
    # strip code fences
    text = text.replace("```json", "```")
    # find candidate start
    idx = text.find('{"slice"')
    if idx == -1:
        idx = text.find('"slice"')
        if idx != -1:
            idx = text.rfind("{", 0, idx)
    if idx == -1:
        # fallback: last balanced object
        idx = text.find("{")
    if idx == -1:
        return None
    depth = 0; instr = False; esc = False
    for j in range(idx, len(text)):
        c = text[j]
        if esc:
            esc = False; continue
        if c == "\\":
            esc = True; continue
        if c == '"':
            instr = not instr
        elif not instr:
            if c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    blob = text[idx:j+1]
                    try:
                        return json.loads(blob)
                    except json.JSONDecodeError:
                        return None
    return None

agg = []
summary = []
for path in sorted(glob.glob(os.path.join(SEATS, "seat-*.json"))):
    n = re.search(r"seat-(\d+)\.json", path).group(1)
    text = collect_text(path)
    obj = extract_json_obj(text)
    if obj is None:
        summary.append((n, "PARSE-FAIL", 0,0,0, len(text)))
        # save raw text for manual inspection
        with open(os.path.join(SEATS, f"seat-{n}.text"), "w") as w:
            w.write(text)
        continue
    slice_name = obj.get("slice", f"seat-{n}")
    findings = obj.get("findings", []) or []
    p0 = sum(1 for x in findings if x.get("severity") == "P0")
    p1 = sum(1 for x in findings if x.get("severity") == "P1")
    p2 = sum(1 for x in findings if x.get("severity") == "P2")
    summary.append((n, slice_name, p0, p1, p2, len(findings)))
    for x in findings:
        x["_seat"] = n
        x["_slice"] = slice_name
        agg.append(x)
    # save normalized per-seat findings
    with open(os.path.join(SEATS, f"seat-{n}.findings.json"), "w") as w:
        json.dump(obj, w, indent=2)

with open(os.path.join(RDIR, "scratch", "aggregate-findings.json"), "w") as w:
    json.dump(agg, w, indent=2)

print("=== PER-SEAT SUMMARY ===")
tP0=tP1=tP2=0
for n, sl, p0, p1, p2, tot in summary:
    print(f"seat-{n}  P0={p0} P1={p1} P2={p2}  total={tot}  [{sl[:38]}]")
    if isinstance(p0,int): tP0+=p0; tP1+=p1; tP2+=p2
print(f"--- RAW TOTALS (pre-dedup): P0={tP0} P1={tP1} P2={tP2} | findings={len(agg)} ---")
print("\n=== ALL P0/P1 (titles) ===")
for x in agg:
    if x.get("severity") in ("P0","P1"):
        print(f"[{x['severity']}][seat-{x['_seat']}] {x.get('title','?')}  ::  {x.get('file','?')}")
