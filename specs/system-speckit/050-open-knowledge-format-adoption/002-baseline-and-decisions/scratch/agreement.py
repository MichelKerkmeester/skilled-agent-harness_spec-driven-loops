#!/usr/bin/env python3
"""Two-labeler agreement and the D3 inputs for the enlarged citation sample.

Usage: python3 agreement.py sample-rows.jsonl labels-claude.jsonl labels-deepseek.jsonl

D3 inputs, as fixed in decision-record.md ADR-003:
  1. rows labeled by both labelers (needs at least 30)
  2. relocatable misses: both say partial or contradicts AND both say relocated yes (needs at least 20%)
  3. share of relocatable-miss targets carrying <!-- ANCHOR: markers (needs at least half)
"""
import collections
import json
import sys

MISS = {"partial", "contradicts"}


def load(path):
    rows = {}
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if line.startswith("{"):
                r = json.loads(line)
                rows[r["id"]] = r
    return rows


def main():
    sample, a, b = (load(p) for p in sys.argv[1:4])
    both = [i for i in sample if i in a and i in b]
    agree = sum(a[i]["verdict"] == b[i]["verdict"] for i in both)
    miss_agree = sum((a[i]["verdict"] in MISS) == (b[i]["verdict"] in MISS) for i in both)
    reloc = [i for i in both if a[i]["verdict"] in MISS and b[i]["verdict"] in MISS
             and a[i].get("relocated") == "yes" and b[i].get("relocated") == "yes"]
    anchored = [i for i in reloc if sample[i]["target_has_anchor_markers"]]
    by_family = collections.Counter(sample[i]["family"] for i in reloc)
    out = {
        "rows_in_sample": len(sample),
        "rows_labeled_by_both": len(both),
        "exact_verdict_agreement": agree,
        "miss_vs_support_agreement": miss_agree,
        "verdicts_a": dict(collections.Counter(a[i]["verdict"] for i in both)),
        "verdicts_b": dict(collections.Counter(b[i]["verdict"] for i in both)),
        "both_miss": sum(a[i]["verdict"] in MISS and b[i]["verdict"] in MISS for i in both),
        "relocatable_misses": len(reloc),
        "relocatable_miss_rate": round(len(reloc) / len(both), 3) if both else None,
        "relocatable_by_family": dict(by_family),
        "relocatable_with_anchor_markers": len(anchored),
        "anchor_share": round(len(anchored) / len(reloc), 3) if reloc else None,
        "relocatable_ids": reloc,
        "d3_condition_1_sample": len(both) >= 30,
        "d3_condition_2_rate": bool(both) and len(reloc) / len(both) >= 0.20,
        "d3_condition_3_anchors": bool(reloc) and len(anchored) / len(reloc) >= 0.5,
    }
    out["d3_all_conditions"] = out["d3_condition_1_sample"] and out["d3_condition_2_rate"] and out["d3_condition_3_anchors"]
    json.dump(out, sys.stdout, indent=2)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
