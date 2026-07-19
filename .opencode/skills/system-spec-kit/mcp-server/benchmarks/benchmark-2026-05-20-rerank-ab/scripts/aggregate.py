#!/usr/bin/env python3
"""Aggregate rerank A/B per-probe JSONL into results.csv."""

from __future__ import annotations

import argparse
import csv
import json
import math
import random
import statistics
from collections import defaultdict
from pathlib import Path
from typing import Any


REQUIRED_COLUMNS = [
    "arm",
    "fixture_count",
    "row_count",
    "hit_count",
    "hit_rate",
    "hit_rate_ci_lower",
    "hit_rate_ci_upper",
    "mrr_at_10",
    "mrr_at_10_ci_lower",
    "mrr_at_10_ci_upper",
    "p50_ms",
    "p95_ms",
    "p99_ms",
    "scoring_methods",
    "rerank_providers",
]


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    with path.open("r", encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if line:
                rows.append(json.loads(line))
    return rows


def wilson_ci(successes: int, n: int, z: float = 1.959963984540054) -> tuple[float, float]:
    if n == 0:
        return (0.0, 0.0)
    phat = successes / n
    denom = 1 + z * z / n
    center = (phat + z * z / (2 * n)) / denom
    margin = z * math.sqrt((phat * (1 - phat) + z * z / (4 * n)) / n) / denom
    return (max(0.0, center - margin), min(1.0, center + margin))


def percentile(values: list[float], pct: float) -> float:
    if not values:
        return 0.0
    ordered = sorted(values)
    if len(ordered) == 1:
        return ordered[0]
    rank = (len(ordered) - 1) * pct
    lower = math.floor(rank)
    upper = math.ceil(rank)
    if lower == upper:
        return ordered[int(rank)]
    return ordered[lower] + (ordered[upper] - ordered[lower]) * (rank - lower)


def bootstrap_mean_ci(values: list[float], samples: int = 10000, seed: int = 1701) -> tuple[float, float]:
    if not values:
        return (0.0, 0.0)
    rng = random.Random(seed)
    means: list[float] = []
    n = len(values)
    for _ in range(samples):
        total = 0.0
        for _ in range(n):
            total += values[rng.randrange(n)]
        means.append(total / n)
    return (percentile(means, 0.025), percentile(means, 0.975))


def summarize_arm(arm: str, rows: list[dict[str, Any]]) -> dict[str, Any]:
    row_count = len(rows)
    hit_count = sum(1 for row in rows if row.get("hit_at_10") is True)
    hit_low, hit_high = wilson_ci(hit_count, row_count)
    rr_values = [float(row.get("reciprocal_rank") or 0.0) for row in rows]
    mrr = statistics.fmean(rr_values) if rr_values else 0.0
    mrr_low, mrr_high = bootstrap_mean_ci(rr_values)
    latencies = [float(row.get("latency_ms") or 0.0) for row in rows]
    return {
        "arm": arm,
        "fixture_count": len({row.get("fixture_id") for row in rows}),
        "row_count": row_count,
        "hit_count": hit_count,
        "hit_rate": hit_count / row_count if row_count else 0.0,
        "hit_rate_ci_lower": hit_low,
        "hit_rate_ci_upper": hit_high,
        "mrr_at_10": mrr,
        "mrr_at_10_ci_lower": mrr_low,
        "mrr_at_10_ci_upper": mrr_high,
        "p50_ms": percentile(latencies, 0.50),
        "p95_ms": percentile(latencies, 0.95),
        "p99_ms": percentile(latencies, 0.99),
        "scoring_methods": "|".join(sorted({str(row.get("scoringMethod")) for row in rows})),
        "rerank_providers": "|".join(sorted({str(row.get("rerank_provider")) for row in rows})),
    }


def paired_delta(rows: list[dict[str, Any]]) -> dict[str, Any]:
    by_arm_fixture: dict[tuple[str, str], list[dict[str, Any]]] = defaultdict(list)
    for row in rows:
        by_arm_fixture[(str(row["arm"]), str(row["fixture_id"]))].append(row)
    fixtures = sorted({fixture for _, fixture in by_arm_fixture})
    hit_deltas: list[float] = []
    mrr_deltas: list[float] = []
    for fixture in fixtures:
        a_rows = by_arm_fixture.get(("A", fixture), [])
        b_rows = by_arm_fixture.get(("B", fixture), [])
        if not a_rows or not b_rows:
            continue
        a_hit = statistics.fmean([1.0 if row.get("hit_at_10") else 0.0 for row in a_rows])
        b_hit = statistics.fmean([1.0 if row.get("hit_at_10") else 0.0 for row in b_rows])
        a_rr = statistics.fmean([float(row.get("reciprocal_rank") or 0.0) for row in a_rows])
        b_rr = statistics.fmean([float(row.get("reciprocal_rank") or 0.0) for row in b_rows])
        hit_deltas.append(b_hit - a_hit)
        mrr_deltas.append(b_rr - a_rr)
    hit_low, hit_high = bootstrap_mean_ci(hit_deltas, seed=2701)
    mrr_low, mrr_high = bootstrap_mean_ci(mrr_deltas, seed=2702)
    return {
        "arm": "B_minus_A",
        "fixture_count": len(mrr_deltas),
        "row_count": "",
        "hit_count": "",
        "hit_rate": statistics.fmean(hit_deltas) if hit_deltas else 0.0,
        "hit_rate_ci_lower": hit_low,
        "hit_rate_ci_upper": hit_high,
        "mrr_at_10": statistics.fmean(mrr_deltas) if mrr_deltas else 0.0,
        "mrr_at_10_ci_lower": mrr_low,
        "mrr_at_10_ci_upper": mrr_high,
        "p50_ms": "",
        "p95_ms": "",
        "p99_ms": "",
        "scoring_methods": "delta",
        "rerank_providers": "delta",
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("jsonl", nargs="+")
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    rows: list[dict[str, Any]] = []
    for path in args.jsonl:
        rows.extend(read_jsonl(Path(path)))
    by_arm: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for row in rows:
        by_arm[str(row["arm"])].append(row)

    summaries = [summarize_arm(arm, by_arm[arm]) for arm in sorted(by_arm)]
    if "A" in by_arm and "B" in by_arm:
        summaries.append(paired_delta(rows))

    with Path(args.out).open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=REQUIRED_COLUMNS)
        writer.writeheader()
        for row in summaries:
            writer.writerow({key: row.get(key, "") for key in REQUIRED_COLUMNS})


if __name__ == "__main__":
    main()
