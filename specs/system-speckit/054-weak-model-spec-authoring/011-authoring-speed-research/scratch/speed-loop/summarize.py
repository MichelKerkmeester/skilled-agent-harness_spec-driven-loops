#!/usr/bin/env python3
"""usage: summarize.py <results.tsv> > summary.md

A run is valid when its dispatch exited 0, did not hit its cap and was not contaminated.
Speed and token figures use valid runs only; every other run is counted by reason. The
paired table compares variants inside the same round, which is what launching all variants
together makes fair, and prints INCONCLUSIVE unless every paired difference has one sign.
"""
import csv
import os
import sys
from collections import OrderedDict

path = sys.argv[1]
rows = list(csv.DictReader(open(path), delimiter="\t"))
ORDER = ["pre054", "main-no054", "now054", "refined"]
BASELINE_LABEL = {
    "pre054": "includes main drift",
    "main-no054": "authoring work alone",
    "now054": "refinement effect",
}


def num(r, k):
    try:
        return float(r.get(k))
    except (TypeError, ValueError):
        return None


def nums(rs, k):
    return [x for x in (num(r, k) for r in rs) if x is not None]


def mean(xs):
    return sum(xs) / len(xs) if xs else None


def fmt(x):
    if x is None:
        return "UNKNOWN"
    return str(int(x)) if float(x).is_integer() else f"{x:.1f}"


def reason(r):
    rc = r.get("rc", "")
    if rc in ("ABORT", "MISSING", "SKIP", "NA", ""):
        return rc.lower() or "missing"
    if r.get("timed_out") == "1":
        return "timed_out"
    if rc != "0":
        return "failed_rc"
    if r.get("contaminated") == "1":
        return "contaminated"
    if num(r, "seconds") is None:
        return "missing"
    return "valid"


def known_mean(rs, k):
    """Mean only when every valid run has a number; a partial mean would mislead."""
    xs = nums(rs, k)
    return mean(xs) if rs and len(xs) == len(rs) else None


def worst(rs, k):
    xs = nums(rs, k)
    return fmt(max(xs)) if xs else "NA"


groups = OrderedDict()
for r in rows:
    groups.setdefault((r["step"], r["variant"]), []).append(r)
steps = [s for s in ("author", "upkeep") if any(k[0] == s for k in groups)]
variants = [v for v in ORDER if any(k[1] == v for k in groups)]
rounds = sorted({r["round"] for r in rows}, key=int)
valid = {k: [r for r in rs if reason(r) == "valid"] for k, rs in groups.items()}

print("# Speed loop summary\n")
print(f"- Results file: `{os.path.basename(path)}`, {len(rows)} rows, rounds: {', '.join(rounds)}.")
print("- Seconds are dispatch start to end. Means use valid runs only: exit 0, under the cap, not contaminated. "
      "Excluded runs are counted by reason in the first table.")
print("- `strict` is valid runs whose strict validation passed. An untouched scaffold passes strict, "
      "so read it next to `hints`. `hints`, `anchors`, `oos`, `side`, `procs`, `refs_054` and `outside` are the worst valid run.")
print("- Tokens come from the Devin session store. UNKNOWN means the store held no figure for at least one valid run.")
print("- Absolute seconds are not comparable with the earlier authoring benchmark: the sandboxes, the cap, "
      "the parallel load and the hook builds differ. Compare variants within this file only.\n")

print("## Runs per variant and step\n")
print("| Step | Variant | Valid | Timed out | Failed rc | Contaminated | Aborted/skipped/missing | Sec min | Sec max | Sec mean | "
      "tok_in | tok_cache_read | tok_out | validate calls | tool calls | strict | hints | anchors | oos | side | procs | refs_054 | outside | applied | wt_new |")
print("|" + "---|" * 25)
means = {}
for s in steps:
    for v in variants:
        rs_all = groups.get((s, v), [])
        rs = valid.get((s, v), [])
        why = [reason(r) for r in rs_all]
        secs = nums(rs, "seconds")
        means[(s, v)] = {k: known_mean(rs, k) for k in ("tok_in", "tok_cache_read", "tok_out", "validate_calls", "tool_calls")}
        means[(s, v)]["seconds"] = mean(secs)
        other = sum(w in ("abort", "skip", "missing", "na") for w in why)
        strict = f"{sum(r.get('strict_passed') == '1' for r in rs)}/{len(rs)}"
        applied = f"{sum(r.get('upkeep_applied') == '1' for r in rs)}/{len(rs)}" if s == "upkeep" else "NA"
        m = means[(s, v)]
        print(f"| {s} | {v} | {len(rs)}/{len(rs_all)} | {why.count('timed_out')} | {why.count('failed_rc')} | "
              f"{why.count('contaminated')} | {other} | "
              f"{fmt(min(secs)) if secs else 'NA'} | {fmt(max(secs)) if secs else 'NA'} | {fmt(mean(secs)) if secs else 'NA'} | "
              f"{fmt(m['tok_in'])} | {fmt(m['tok_cache_read'])} | {fmt(m['tok_out'])} | "
              f"{fmt(m['validate_calls'])} | {fmt(m['tool_calls'])} | {strict} | "
              f"{worst(rs, 'leftover_hints')} | {worst(rs, 'missing_anchors')} | {worst(rs, 'out_of_scope_writes')} | "
              f"{worst(rs, 'sbx_side_writes')} | {worst(rs, 'leftover_procs')} | {worst(rs, 'refs_054')} | "
              f"{worst(rs, 'refs_outside')} | {applied} | {worst(rs_all, 'wt_new_lines')} |")

if "upkeep" in steps:
    print("\n## Upkeep from a clean start\n")
    print("Upkeep seconds also pay for repairing whatever the author step left. These rows keep only valid upkeep runs "
          "whose author packet passed strict validation with 0 leftover hints.\n")
    print("| Variant | Clean-start runs | Sec min | Sec max | Sec mean |")
    print("|---|---|---|---|---|")
    for v in variants:
        rs = [r for r in valid.get(("upkeep", v), []) if r.get("pre_strict") == "1" and r.get("pre_hints") == "0"]
        secs = nums(rs, "seconds")
        print(f"| {v} | {len(rs)}/{len(valid.get(('upkeep', v), []))} | {fmt(min(secs)) if secs else 'NA'} | "
              f"{fmt(max(secs)) if secs else 'NA'} | {fmt(mean(secs)) if secs else 'NA'} |")

print("\n## Paired difference per round\n")
print("For each round where both runs are valid: variant seconds minus baseline seconds from that same round. "
      "Positive means slower than the baseline. The verdict is SLOWER or FASTER only when every pair has that sign "
      "and there are at least two pairs; otherwise INCONCLUSIVE. Against pre054 the difference includes main's "
      "drift; against main-no054 it is the authoring work alone; refined against now054 is the refinement effect.\n")
print("| Step | Variant | Baseline | Meaning | Pairs | Diff min | Diff max | Diff mean | Verdict | Delta of means | "
      "tok_out delta | validate calls delta | Variant strict | Baseline strict | Variant worst hints |")
print("|" + "---|" * 15)
any_pair = False
for s in steps:
    for bi, b in enumerate(variants):
        if b not in BASELINE_LABEL:
            continue
        for v in variants[bi + 1:]:
            if b == "now054" and v != "refined":
                continue
            bv = {r["round"]: r for r in valid.get((s, b), [])}
            vv = {r["round"]: r for r in valid.get((s, v), [])}
            diffs = [num(vv[rd], "seconds") - num(bv[rd], "seconds") for rd in rounds if rd in bv and rd in vv]
            if diffs and len(diffs) >= 2 and min(diffs) > 0:
                verdict = "SLOWER"
            elif diffs and len(diffs) >= 2 and max(diffs) < 0:
                verdict = "FASTER"
            else:
                verdict = "INCONCLUSIVE"
            mb, mv = means.get((s, b), {}), means.get((s, v), {})

            def d(k):
                return None if mv.get(k) is None or mb.get(k) is None else mv[k] - mb[k]
            vs, bs = valid.get((s, v), []), valid.get((s, b), [])
            any_pair = True
            label = "main drift alone" if (b, v) == ("pre054", "main-no054") else BASELINE_LABEL[b]
            print(f"| {s} | {v} | {b} | {label} | {len(diffs)} | "
                  f"{fmt(min(diffs)) if diffs else 'NA'} | {fmt(max(diffs)) if diffs else 'NA'} | {fmt(mean(diffs)) if diffs else 'NA'} | "
                  f"{verdict} | {fmt(d('seconds'))} | {fmt(d('tok_out'))} | {fmt(d('validate_calls'))} | "
                  f"{sum(r.get('strict_passed') == '1' for r in vs)}/{len(vs)} | {sum(r.get('strict_passed') == '1' for r in bs)}/{len(bs)} | "
                  f"{worst(vs, 'leftover_hints')} |")
if not any_pair:
    print("| NA | NA | NA | no baseline variant in this run | 0 | NA | NA | NA | INCONCLUSIVE | NA | NA | NA | NA | NA | NA |")

print("\n## Rounds\n")
rt = os.path.join(os.path.dirname(path), "round.tsv")
budget = {}
if os.path.exists(rt):
    for r in csv.DictReader(open(rt), delimiter="\t"):
        budget[r["round"]] = r
print("Launch order, wall seconds against the 900 s round budget, and launch skew: seconds between the first and "
      "the last variant starting the same step. Near zero means the variants shared the machine load.\n")
for rd in rounds:
    b = budget.get(rd, {})
    skew = []
    for s in steps:
        t0 = nums([r for r in rows if r["round"] == rd and r["step"] == s], "t0")
        if t0:
            skew.append(f"{s} skew {fmt(max(t0) - min(t0))} s")
    over = " OVER BUDGET" if b.get("over_budget") == "1" else ""
    print(f"- round {rd}: order {b.get('order', 'UNKNOWN')}, wall {b.get('wall_seconds', 'UNKNOWN')} s{over}; {'; '.join(skew)}")
