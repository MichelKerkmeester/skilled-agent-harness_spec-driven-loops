#!/usr/bin/env python3
"""Aggregate 018 rerank matrix JSON runs and pick a production reranker lane."""

from __future__ import annotations

import argparse
import json
import math
import statistics
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Any


DEFAULT_PACKET_DIR = (
    Path(__file__).resolve().parents[3] / "018-rerank-matrix-rebench"
)
DEFAULT_RUNS_DIR = DEFAULT_PACKET_DIR / "evidence" / "runs"
DEFAULT_OUTPUT = DEFAULT_PACKET_DIR / "evidence" / "rerank-matrix-results.md"

MAINTAINABILITY = {
    "A": 4,
    "B": 3,
    "C": 2,
    "D": 1,
    "E": 2,
}

LANE_LABELS = {
    "A": "no-rerank-ablation",
    "B": "bge-baseline",
    "C": "bge-path-class",
    "D": "jina-v3",
    "E": "mxbai",
}


@dataclass(frozen=True)
class LaneSummary:
    lane_id: str
    lane_name: str
    iterations: int
    total_probes: int
    hit_counts: list[int]
    hit_rate_mean: float
    hit_rate_stddev: float
    p50_mean: float
    p95_mean: float
    p99_mean: float
    peak_rss_max: float | None
    majority_hits: dict[int, bool]
    worst_case_misses: int
    maintainability: int


@dataclass(frozen=True)
class SkippedRun:
    path: str
    reason: str


def _skip_reason(run: dict[str, Any]) -> str | None:
    if run.get("success") is False:
        return "success=false"

    latency = run.get("latency_ms", {})
    mean_latency = float(latency.get("mean", 0.0)) if isinstance(latency, dict) else 0.0
    if float(run.get("hit_rate", 0.0)) == 0.0 and mean_latency > 25000:
        return "zero-hit 25s+ timeout signature"

    return None


def _load_runs(runs_dir: Path) -> tuple[list[dict[str, Any]], list[SkippedRun]]:
    runs: list[dict[str, Any]] = []
    skipped: list[SkippedRun] = []
    for path in sorted(runs_dir.glob("lane*-iter*.json")):
        try:
            run = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            raise SystemExit(f"Invalid JSON in {path}: {exc}") from exc
        run["_path"] = str(path)
        reason = _skip_reason(run)
        if reason is not None:
            skipped.append(SkippedRun(path=str(path), reason=reason))
            continue
        runs.append(run)
    return runs, skipped


def _mean(values: list[float]) -> float:
    return statistics.fmean(values) if values else 0.0


def _stddev(values: list[float]) -> float:
    return statistics.stdev(values) if len(values) > 1 else 0.0


def _summarize_lane(lane_id: str, runs: list[dict[str, Any]], probe_ids: list[int]) -> LaneSummary:
    first = runs[0]
    hit_counts = [int(run.get("hits", 0)) for run in runs]
    total_probes = max(int(run.get("total_probes", 0)) for run in runs)
    hit_rates = [float(run.get("hit_rate", 0.0)) for run in runs]
    p50_values = [float(run.get("latency_ms", {}).get("p50", 0.0)) for run in runs]
    p95_values = [float(run.get("latency_ms", {}).get("p95", 0.0)) for run in runs]
    p99_values = [float(run.get("latency_ms", {}).get("p99", 0.0)) for run in runs]
    rss_values = [
        float(run["peak_rss_mb"])
        for run in runs
        if run.get("peak_rss_mb") is not None
    ]

    hits_by_probe: dict[int, list[bool]] = defaultdict(list)
    for run in runs:
        for row in run.get("per_probe", []):
            hits_by_probe[int(row["probe_id"])].append(bool(row.get("hit")))

    majority_hits: dict[int, bool] = {}
    for probe_id in probe_ids:
        hits = hits_by_probe.get(probe_id, [])
        majority_hits[probe_id] = sum(1 for hit in hits if hit) >= math.ceil(len(runs) / 2)

    return LaneSummary(
        lane_id=lane_id,
        lane_name=str(first.get("lane_name") or LANE_LABELS.get(lane_id, lane_id)),
        iterations=len(runs),
        total_probes=total_probes,
        hit_counts=hit_counts,
        hit_rate_mean=_mean(hit_rates),
        hit_rate_stddev=_stddev(hit_rates),
        p50_mean=_mean(p50_values),
        p95_mean=_mean(p95_values),
        p99_mean=_mean(p99_values),
        peak_rss_max=max(rss_values) if rss_values else None,
        majority_hits=majority_hits,
        worst_case_misses=sum(1 for hit in majority_hits.values() if not hit),
        maintainability=MAINTAINABILITY.get(lane_id, 0),
    )


def _build_summaries(runs: list[dict[str, Any]]) -> list[LaneSummary]:
    by_lane: dict[str, list[dict[str, Any]]] = defaultdict(list)
    probe_ids: set[int] = set()
    for run in runs:
        lane_id = str(run.get("lane_id", ""))
        if not lane_id:
            continue
        by_lane[lane_id].append(run)
        for row in run.get("per_probe", []):
            probe_ids.add(int(row["probe_id"]))

    if not by_lane:
        raise SystemExit("No lane runs found")

    return [
        _summarize_lane(lane_id, sorted(lane_runs, key=lambda run: int(run.get("iteration", 0))), sorted(probe_ids))
        for lane_id, lane_runs in sorted(by_lane.items())
    ]


def _pick_winner(summaries: list[LaneSummary]) -> tuple[LaneSummary, LaneSummary | None]:
    reranker_summaries = [summary for summary in summaries if summary.lane_id != "A"]
    picker_pool = reranker_summaries or summaries

    def sort_key(summary: LaneSummary) -> tuple[float, int, float, float, int, str]:
        rss = summary.peak_rss_max if summary.peak_rss_max is not None else float("inf")
        return (
            -summary.hit_rate_mean,
            summary.worst_case_misses,
            summary.p95_mean,
            rss,
            -summary.maintainability,
            summary.lane_id,
        )

    ordered = sorted(picker_pool, key=sort_key)
    winner = ordered[0]
    runner_up = ordered[1] if len(ordered) > 1 else None
    return winner, runner_up


def _fmt_percent(value: float) -> str:
    return f"{value * 100:.1f}%"


def _fmt_float(value: float, digits: int = 1) -> str:
    return f"{value:.{digits}f}"


def _fmt_rss(value: float | None) -> str:
    return "n/a" if value is None else f"{value:.1f}"


def _heatmap_cell(hit: bool) -> str:
    return "hit" if hit else "miss"


def _render_markdown(
    summaries: list[LaneSummary],
    runs: list[dict[str, Any]],
    skipped_runs: list[SkippedRun] | None = None,
) -> str:
    winner, runner_up = _pick_winner(summaries)
    probe_ids = sorted({int(row["probe_id"]) for run in runs for row in run.get("per_probe", [])})

    lines: list[str] = []
    lines.append("# Rerank Matrix Results — 018 Final Reranker Verdict")
    lines.append("")
    if skipped_runs:
        lines.append("## Skipped run warnings")
        lines.append("")
        lines.append("The analyzer excluded failed or timeout-signature run JSON before computing lane summaries.")
        lines.append("")
        for skipped in skipped_runs:
            lines.append(f"- `{skipped.path}` — {skipped.reason}")
        lines.append("")

    lines.append("## Per-lane summary")
    lines.append("")
    lines.append("| Lane | Name | Iterations | Mean hits | Hit rate mean | Hit rate stddev | p50 mean ms | p95 mean ms | p99 mean ms | Peak RSS MB |")
    lines.append("|---|---|---:|---:|---:|---:|---:|---:|---:|---:|")
    for summary in summaries:
        mean_hits = summary.hit_rate_mean * summary.total_probes
        lines.append(
            "| {lane} | {name} | {iters} | {hits}/{total} | {hit_rate} | {stddev} | {p50} | {p95} | {p99} | {rss} |".format(
                lane=summary.lane_id,
                name=summary.lane_name,
                iters=summary.iterations,
                hits=_fmt_float(mean_hits, 2),
                total=summary.total_probes,
                hit_rate=_fmt_percent(summary.hit_rate_mean),
                stddev=_fmt_percent(summary.hit_rate_stddev),
                p50=_fmt_float(summary.p50_mean),
                p95=_fmt_float(summary.p95_mean),
                p99=_fmt_float(summary.p99_mean),
                rss=_fmt_rss(summary.peak_rss_max),
            )
        )

    lines.append("")
    lines.append("## Per-probe majority heatmap")
    lines.append("")
    header = "| Probe | " + " | ".join(f"Lane {summary.lane_id}" for summary in summaries) + " |"
    divider = "|---:|" + "|".join("---" for _ in summaries) + "|"
    lines.append(header)
    lines.append(divider)
    for probe_id in probe_ids:
        cells = [_heatmap_cell(summary.majority_hits.get(probe_id, False)) for summary in summaries]
        lines.append(f"| {probe_id} | " + " | ".join(cells) + " |")

    lines.append("")
    lines.append("## Decision matrix")
    lines.append("")
    lines.append("| Lane | Hit-rate rank value | Worst-case misses | p95 mean ms | Peak RSS MB | Maintainability | Picker order |")
    lines.append("|---|---:|---:|---:|---:|---:|---:|")
    picker_pool = [summary for summary in summaries if summary.lane_id != "A"] or summaries
    ordered = sorted(
        picker_pool,
        key=lambda summary: (
            -summary.hit_rate_mean,
            summary.worst_case_misses,
            summary.p95_mean,
            summary.peak_rss_max if summary.peak_rss_max is not None else float("inf"),
            -summary.maintainability,
            summary.lane_id,
        ),
    )
    order_by_lane = {summary.lane_id: index + 1 for index, summary in enumerate(ordered)}
    for summary in summaries:
        order = order_by_lane.get(summary.lane_id, "ablation")
        lines.append(
            f"| {summary.lane_id} | {_fmt_percent(summary.hit_rate_mean)} | {summary.worst_case_misses} | "
            f"{_fmt_float(summary.p95_mean)} | {_fmt_rss(summary.peak_rss_max)} | "
            f"{summary.maintainability} | {order} |"
        )

    lines.append("")
    lines.append("## Picked winner")
    lines.append("")
    lines.append(f"Picked winner: **Lane {winner.lane_id} — {winner.lane_name}**.")
    lines.append(
        f"It has a mean hit rate of {_fmt_percent(winner.hit_rate_mean)} across {winner.iterations} iteration(s), "
        f"with {winner.worst_case_misses} majority-miss probe(s)."
    )
    lines.append(
        f"The deterministic picker selected it by sorting on hit rate, worst-case misses among reranker lanes, p95 latency, RAM, and maintainability; its p95 mean is {_fmt_float(winner.p95_mean)} ms."
    )
    lines.append(
        "The no-rerank lane is reported as an ablation baseline, but it is not allowed to beat reranker lanes on the worst-case-probe tiebreak unless no reranker lane has valid runs."
    )

    lines.append("")
    lines.append("## Runner-up scenario")
    lines.append("")
    if runner_up is None:
        lines.append("No runner-up exists because only one picker-eligible lane was present.")
    else:
        lines.append(
            f"Runner-up: **Lane {runner_up.lane_id} — {runner_up.lane_name}**. "
            f"It would win if Lane {winner.lane_id} regressed below {_fmt_percent(runner_up.hit_rate_mean)} hit rate, "
            f"or if future hardware makes Lane {winner.lane_id}'s p95/RSS tradeoff unacceptable while hit rate remains tied."
        )

    lines.append("")
    lines.append("## Source runs")
    lines.append("")
    for run in sorted(runs, key=lambda item: (str(item.get("lane_id")), int(item.get("iteration", 0)))):
        lines.append(f"- `{run['_path']}`")

    return "\n".join(lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--runs-dir", type=Path, default=DEFAULT_RUNS_DIR)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()

    runs, skipped_runs = _load_runs(args.runs_dir)
    if not runs:
        raise SystemExit(f"No run JSON files found in {args.runs_dir}")

    summaries = _build_summaries(runs)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(_render_markdown(summaries, runs, skipped_runs), encoding="utf-8")
    print(f"wrote {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
