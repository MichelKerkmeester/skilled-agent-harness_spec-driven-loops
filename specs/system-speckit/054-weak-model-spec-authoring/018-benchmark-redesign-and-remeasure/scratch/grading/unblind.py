"""Unblind the min-percent grades and give a quality verdict per comparison.

usage: python3 -I unblind.py <grading-dir> <label-map.tsv> <rescore-minpct.tsv> <out-unblinded.tsv>

Decision rule: a comparison is REAL only when at least 4 rounds give a valid pair and every pair
has the same sign on the blind total, and the rescore's Verify ratio or residue mean moves the
same way. A zero difference shares no sign, so it makes the comparison INCONCLUSIVE.
"""
import csv, json, os, statistics, sys

gdir, mapf, rescf, outf = sys.argv[1:5]
DIMS = ("grounding", "requirements", "verification", "scope", "consistency", "clarity")
COMPARISONS = [
    ("main-no054", "pre054", "main drift alone"),
    ("now054", "pre054", "includes main drift"),
    ("refined", "pre054", "includes main drift"),
    ("now054", "main-no054", "authoring work alone"),
    ("refined", "main-no054", "authoring work alone"),
    ("refined", "now054", "refinement effect"),
]

rows = []
for m in csv.DictReader(open(mapf), delimiter="\t"):
    g = json.load(open(os.path.join(gdir, m["label"] + ".json")))
    assert sum(g["scores"][d] for d in DIMS) == g["total"], m["label"]
    # The top-up run's rounds follow the main run's five.
    rnd = int(m["round"]) + (5 if m["run"] == "20261026T170823Z-68750" else 0)
    rows.append({"label": m["label"], "run": m["run"], "variant": m["variant"], "round": rnd,
                 "total": g["total"], **{d: g["scores"][d] for d in DIMS}})
rows.sort(key=lambda r: (r["round"], r["variant"]))
with open(outf, "w") as f:
    w = csv.DictWriter(f, delimiter="\t", fieldnames=["label", "run", "variant", "round", "total", *DIMS])
    w.writeheader()
    w.writerows(rows)

resc = {}
for r in csv.DictReader(open(rescf), delimiter="\t"):
    resc.setdefault(r["variant"], []).append(r)

def rmean(v, key):
    vals = [float(r[key]) for r in resc.get(v, []) if r.get(key) not in (None, "", "NA")]
    return statistics.mean(vals) if vals else None

score = {(r["variant"], r["round"]): r for r in rows}
print("| Variant | Packets | Blind total mean | " + " | ".join(DIMS) + " |")
print("|---|---|---|" + "---|" * len(DIMS))
for v in ("pre054", "main-no054", "now054", "refined"):
    xs = [r for r in rows if r["variant"] == v]
    print(f"| {v} | {len(xs)} | {statistics.mean(r['total'] for r in xs):.1f} | " +
          " | ".join(f"{statistics.mean(r[d] for r in xs):.1f}" for d in DIMS) + " |")
print()
print("| Variant | Baseline | Meaning | Pairs | Diffs by round | Diff mean | Verify ratio means | Residue means | Verdict |")
print("|---|---|---|---|---|---|---|---|---|")
for v, b, meaning in COMPARISONS:
    rounds = sorted({r["round"] for r in rows})
    diffs = [(n, score[(v, n)]["total"] - score[(b, n)]["total"]) for n in rounds if (v, n) in score and (b, n) in score]
    ds = [d for _, d in diffs]
    same = len(ds) >= 4 and (all(d > 0 for d in ds) or all(d < 0 for d in ds))
    sign = 1 if ds and ds[0] > 0 else -1
    rv, rb = rmean(v, "verify_ratio"), rmean(b, "verify_ratio")
    sv, sb = rmean(v, "residue_total"), rmean(b, "residue_total")
    # Better quality means a higher Verify ratio or a lower residue count.
    agrees = (rv is not None and rb is not None and (rv - rb) * sign > 0) or (sv is not None and sb is not None and (sb - sv) * sign > 0)
    verdict = ("REAL " + ("better" if sign > 0 else "worse")) if same and agrees else "INCONCLUSIVE"
    fmt = lambda x: "NA" if x is None else f"{x:.2f}"
    print(f"| {v} | {b} | {meaning} | {len(ds)} | {' '.join(f'r{n}:{d:+d}' for n, d in diffs)} | "
          f"{statistics.mean(ds) if ds else 0:+.1f} | {fmt(rv)} vs {fmt(rb)} | {fmt(sv)} vs {fmt(sb)} | {verdict} |")
