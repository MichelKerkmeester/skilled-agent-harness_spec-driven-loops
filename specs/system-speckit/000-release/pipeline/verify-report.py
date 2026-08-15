#!/usr/bin/env python3
# Aggregate the 82 verdicts (41 features x 2 models) into a verification report:
# per feature both verdicts, an agreement status, and every issue/suggested-fix
# surfaced so the changelog can be corrected. Usage: verify-report.py <verdict-dir> <features.jsonl> <out.md>
import json, os, sys, glob, collections
vdir, feats_path, out = sys.argv[1:4]
feats = {}
for l in open(feats_path, encoding="utf-8"):
    d = json.loads(l); feats[d["id"]] = d
V = collections.defaultdict(dict)  # id -> model -> verdict
for f in glob.glob(os.path.join(vdir, "*.json")):
    try: o = json.load(open(f, encoding="utf-8"))
    except Exception: continue
    V[o.get("id")][o.get("model")] = o
RANK = {"CONFIRMED":0,"MINOR_ISSUES":1,"OVERSTATED":2,"UNVERIFIABLE":2,"WRONG":3}
def worst(vs): return max((RANK.get(v.get("verdict"),2) for v in vs), default=2)
rows, flags = [], []
counts = collections.Counter()
for fid in sorted(feats):
    d = feats[fid]; vs = V.get(fid, {})
    dm = vs.get("deepseek-v4-flash-max", {}); gm = vs.get("glm-5-2-max", {})
    dv, gv = dm.get("verdict","(none)"), gm.get("verdict","(none)")
    both = [x for x in (dm, gm) if x]
    w = worst(both)
    status = "✅ OK" if w == 0 else ("🟡 minor" if w == 1 else ("🟠 review" if w == 2 else "🔴 FLAG"))
    if dv != gv and both: status += " · disagree"
    counts[status.split(" ")[0]] += 1
    rows.append(f"| {fid} | {d['track']} | {d['title'][:48]} | {dv} | {gv} | {status} |")
    if w >= 1 or (dv != gv and both):
        issues = []
        for m,o in (("flash",dm),("glm",gm)):
            iss = (o.get("issues") or "").strip(); fix = (o.get("suggested_fix") or "").strip()
            if iss: issues.append(f"  - **{m}** ({o.get('verdict')}, conf {o.get('confidence')}): {iss}")
            if fix: issues.append(f"    - _suggested fix:_ {fix}")
        flags.append(f"### {fid} — {d['title']}  ·  _{d['section']}_\n" + ("\n".join(issues) if issues else "  - (verdicts differ; no explicit issue text)"))
with open(out, "w", encoding="utf-8") as w:
    w.write("# v4.0.0.0 Changelog — Verification Report\n\n")
    w.write(f"> {len(feats)} features × 2 independent cli-devin verifiers (deepseek-v4-flash-max + glm-5-2-max), each investigating the real repo. "
            f"Summary: {counts.get('✅',0)} OK · {counts.get('🟡',0)} minor · {counts.get('🟠',0)} review · {counts.get('🔴',0)} flagged.\n\n")
    w.write("## Per-feature verdicts\n\n")
    w.write("| ID | Track | Feature | flash | glm-max | Status |\n|---|---|---|---|---|---|\n")
    w.write("\n".join(rows) + "\n\n")
    if flags:
        w.write("## Items needing attention (issues, overstatements, disagreements)\n\n")
        w.write("\n\n".join(flags) + "\n")
    else:
        w.write("## Items needing attention\n\nNone — all features confirmed by both verifiers.\n")
print(f"report -> {out}")
print(f"OK={counts.get('✅',0)} minor={counts.get('🟡',0)} review={counts.get('🟠',0)} flag={counts.get('🔴',0)} | flagged_items={len(flags)}")
