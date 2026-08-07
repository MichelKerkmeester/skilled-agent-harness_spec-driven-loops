#!/usr/bin/env python3
"""Expanded fixture calibration helpers for 023B.

The long-running benchmark path writes one JSON file per lane/run. This module
keeps the pure aggregation, CI, fixture validation, and residual-miss taxonomy
logic testable without requiring a live daemon.
"""

from __future__ import annotations

import argparse
import json
import math
import statistics
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Any


REQUIRED_PROBE_FIELDS = {
    "id",
    "query",
    "expected_source_path",
    "difficulty",
    "category",
    "path_class",
    "truth_set",
    "truth_path_classes",
    "expected_failure_mode",
}

FAILURE_MODES = {
    "chunking_gap",
    "lexical_gap",
    "semantic_gap",
    "path_class_bias",
    "reranker_inversion",
    "fixture_ambiguity",
}


@dataclass(frozen=True)
class CellSummary:
    lane_id: str
    lane_name: str
    runs: int
    total_probes: int
    hit_counts: list[int]
    hit_rate_mean: float
    hit_rate_stddev: float
    hit_rate_ci95: float
    p95_mean_ms: float
    p95_stddev_ms: float


def mean_stddev_ci95(values: list[float]) -> tuple[float, float, float]:
    """Return mean, sample stddev, and normal-approx CI95 half-width."""
    if not values:
        return 0.0, 0.0, 0.0
    mean = statistics.fmean(values)
    stddev = statistics.stdev(values) if len(values) > 1 else 0.0
    ci95 = 1.96 * stddev / math.sqrt(len(values)) if len(values) > 1 else 0.0
    return mean, stddev, ci95


def load_fixture(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise ValueError("fixture root must be a list")
    return data


def validate_expanded_fixture(path: Path) -> dict[str, int]:
    """Validate the expanded fixture schema and return category counters."""
    probes = load_fixture(path)
    ids = [probe.get("id") for probe in probes]
    if len(set(ids)) != len(ids):
        raise ValueError("fixture probe ids must be unique")

    category_counts: Counter[str] = Counter()
    path_class_counts: Counter[str] = Counter()
    profile_counts: Counter[str] = Counter()
    for index, probe in enumerate(probes, start=1):
        missing = sorted(REQUIRED_PROBE_FIELDS - set(probe))
        if missing:
            raise ValueError(f"probe {index} missing fields: {', '.join(missing)}")
        if probe["difficulty"] not in {"easy", "medium", "hard"}:
            raise ValueError(f"probe {probe['id']} has invalid difficulty")
        if probe["expected_failure_mode"] not in {*FAILURE_MODES, "none"}:
            raise ValueError(f"probe {probe['id']} has invalid expected_failure_mode")
        truth_set = probe["truth_set"]
        if not isinstance(truth_set, list) or not truth_set:
            raise ValueError(f"probe {probe['id']} truth_set must be non-empty")
        if probe["expected_source_path"] not in truth_set:
            raise ValueError(f"probe {probe['id']} expected path must be in truth_set")
        category_counts[str(probe["category"])] += 1
        path_class_counts[str(probe["path_class"])] += 1
        for profile in probe.get("probe_profiles", []):
            profile_counts[str(profile)] += 1

    summary = {
        "total": len(probes),
        "original": profile_counts["original"],
        "architecture_invariant": profile_counts["architecture_invariant"],
        "multilingual_code_switched": profile_counts["multilingual_code_switched"],
        "short_query": profile_counts["short_query"],
        "long_query": profile_counts["long_query"],
    }
    summary.update({f"path_class_{key}": value for key, value in path_class_counts.items()})
    return summary


def load_runs(paths: list[Path]) -> list[dict[str, Any]]:
    runs: list[dict[str, Any]] = []
    for path in paths:
        run = json.loads(path.read_text(encoding="utf-8"))
        run["_path"] = str(path)
        runs.append(run)
    return runs


def aggregate_runs(runs: list[dict[str, Any]]) -> list[CellSummary]:
    by_lane: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for run in runs:
        by_lane[str(run["lane_id"])].append(run)

    summaries: list[CellSummary] = []
    for lane_id, lane_runs in sorted(by_lane.items()):
        hit_rates = [float(run.get("hit_rate", 0.0)) for run in lane_runs]
        p95_values = [float(run.get("latency_ms", {}).get("p95", 0.0)) for run in lane_runs]
        hit_mean, hit_stddev, hit_ci95 = mean_stddev_ci95(hit_rates)
        p95_mean, p95_stddev, _p95_ci95 = mean_stddev_ci95(p95_values)
        first = lane_runs[0]
        summaries.append(
            CellSummary(
                lane_id=lane_id,
                lane_name=str(first.get("lane_name", lane_id)),
                runs=len(lane_runs),
                total_probes=max(int(run.get("total_probes", 0)) for run in lane_runs),
                hit_counts=[int(run.get("hits", 0)) for run in lane_runs],
                hit_rate_mean=hit_mean,
                hit_rate_stddev=hit_stddev,
                hit_rate_ci95=hit_ci95,
                p95_mean_ms=p95_mean,
                p95_stddev_ms=p95_stddev,
            )
        )
    return summaries


def rrf_k_hit_rate_variance(summaries: list[CellSummary]) -> float:
    rates = [
        summary.hit_rate_mean
        for summary in summaries
        if "rrf-k" in summary.lane_id.lower() or "rrf k" in summary.lane_name.lower()
    ]
    return (max(rates) - min(rates)) if rates else 0.0


def classify_residual_miss(probe: dict[str, Any], result: dict[str, Any]) -> str:
    """Classify one miss using 023C-style diagnostics plus harness probes."""
    if result.get("hit") is True:
        return "none"

    predicted = probe.get("expected_failure_mode")
    if predicted == "fixture_ambiguity":
        return "fixture_ambiguity"

    diagnostics = result.get("diagnostics") or {}
    if int(diagnostics.get("post_dedup_count", 1) or 0) == 0:
        return "chunking_gap"
    if result.get("expected_in_fts") is False or int(diagnostics.get("fts_candidates_count", 1) or 0) == 0:
        return "lexical_gap"
    if result.get("expected_in_vector") is False or int(diagnostics.get("vec_candidates_count", 1) or 0) == 0:
        return "semantic_gap"
    if result.get("expected_in_rerank_input") is True and int(diagnostics.get("rerank_input_count", 0) or 0) > 0:
        return "reranker_inversion"
    if int(diagnostics.get("boost_flip_count", 0) or 0) > 0 or result.get("boosted_alias_above_truth"):
        return "path_class_bias"
    return str(predicted or "semantic_gap") if predicted != "none" else "semantic_gap"


def build_residual_taxonomy(
    fixture: list[dict[str, Any]],
    run: dict[str, Any],
) -> list[dict[str, Any]]:
    probes_by_id = {str(probe["id"]): probe for probe in fixture}
    rows: list[dict[str, Any]] = []
    for result in run.get("per_probe", []):
        if result.get("hit") is True:
            continue
        probe = probes_by_id.get(str(result.get("probe_id")))
        if probe is None:
            continue
        label = classify_residual_miss(probe, result)
        rows.append(
            {
                "probe_id": probe["id"],
                "query": probe["query"],
                "expected": probe["expected_source_path"],
                "top5": result.get("top5", []),
                "failure_mode": label,
                "diagnostics": result.get("diagnostics", {}),
            }
        )
    return rows


def render_summary_markdown(summaries: list[CellSummary]) -> str:
    lines = [
        "# Expanded Calibration Summary",
        "",
        "| Lane | Name | Runs | Mean hits | Hit rate mean | Stddev | CI95 | p95 mean ms | p95 stddev ms |",
        "|---|---|---:|---:|---:|---:|---:|---:|---:|",
    ]
    for summary in summaries:
        mean_hits = summary.hit_rate_mean * summary.total_probes
        lines.append(
            f"| {summary.lane_id} | {summary.lane_name} | {summary.runs} | "
            f"{mean_hits:.2f}/{summary.total_probes} | {summary.hit_rate_mean:.3f} | "
            f"{summary.hit_rate_stddev:.3f} | {summary.hit_rate_ci95:.3f} | "
            f"{summary.p95_mean_ms:.1f} | {summary.p95_stddev_ms:.1f} |"
        )
    return "\n".join(lines) + "\n"


def render_taxonomy_markdown(rows: list[dict[str, Any]]) -> str:
    lines = [
        "# Residual Miss Taxonomy",
        "",
        "| Probe | Failure mode | Expected | Top 5 | Diagnostic counters |",
        "|---:|---|---|---|---|",
    ]
    if not rows:
        lines.append("| n/a | none | n/a | n/a | no misses in selected run |")
    for row in rows:
        counters = json.dumps(row["diagnostics"], sort_keys=True)
        top5 = ", ".join(str(path) for path in row["top5"][:5])
        lines.append(
            f"| {row['probe_id']} | {row['failure_mode']} | `{row['expected']}` | "
            f"{top5 or 'n/a'} | `{counters}` |"
        )
    return "\n".join(lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="cmd", required=True)

    validate = sub.add_parser("validate-fixture")
    validate.add_argument("fixture", type=Path)

    aggregate = sub.add_parser("aggregate")
    aggregate.add_argument("--runs-dir", type=Path, required=True)
    aggregate.add_argument("--output", type=Path, required=True)

    taxonomy = sub.add_parser("taxonomy")
    taxonomy.add_argument("--fixture", type=Path, required=True)
    taxonomy.add_argument("--run", type=Path, required=True)
    taxonomy.add_argument("--output", type=Path, required=True)

    args = parser.parse_args()
    if args.cmd == "validate-fixture":
        print(json.dumps(validate_expanded_fixture(args.fixture), indent=2, sort_keys=True))
        return 0
    if args.cmd == "aggregate":
        runs = load_runs(sorted(args.runs_dir.glob("lane-*-run-*.json")))
        summaries = aggregate_runs(runs)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(render_summary_markdown(summaries), encoding="utf-8")
        print(f"wrote {args.output}")
        return 0
    if args.cmd == "taxonomy":
        rows = build_residual_taxonomy(load_fixture(args.fixture), json.loads(args.run.read_text(encoding="utf-8")))
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(render_taxonomy_markdown(rows), encoding="utf-8")
        print(f"wrote {args.output}")
        return 0
    raise AssertionError(args.cmd)


if __name__ == "__main__":
    raise SystemExit(main())
