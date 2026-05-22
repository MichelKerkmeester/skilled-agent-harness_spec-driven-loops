#!/usr/bin/env python3
# ---------------------------------------------------------------
# COMPONENT: COCOINDEX SUCCESSFUL-SEARCH RSS BENCHMARK
# ---------------------------------------------------------------
"""Measure CocoIndex successful-search resident-memory slope."""

from __future__ import annotations

import argparse
import json
import os
import statistics
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[6]
CCC = REPO_ROOT / ".opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc"
HARNESS = REPO_ROOT / ".opencode/skills/system-spec-kit/scripts/dist/ops/process-memory-harness.js"
BENCH_DIR = Path(__file__).resolve().parent
DEFAULT_FIXTURE = BENCH_DIR.parent / "benchmark-2026-05-21" / "fixture-subset-18.json"
DEFAULT_QUERY = "registry of available embedding backends with dimensions and model notes"
MB = 1024 * 1024


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def load_queries(path: Path | None) -> list[str]:
    if path is None or not path.exists():
        return [DEFAULT_QUERY]
    parsed = json.loads(path.read_text(encoding="utf-8"))
    queries = [str(row["query"]) for row in parsed if isinstance(row, dict) and row.get("query")]
    return queries or [DEFAULT_QUERY]


def run_snapshot() -> dict[str, Any]:
    proc = subprocess.run(
        ["node", str(HARNESS), "snapshot"],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    if proc.returncode != 0:
        raise RuntimeError((proc.stderr or proc.stdout or "process-memory-harness snapshot failed").strip())
    snapshot = json.loads(proc.stdout)
    if int(snapshot.get("processCount") or 0) == 0:
        raise RuntimeError("process-memory-harness snapshot returned zero processes; ps is blocked in this sandbox")
    return snapshot


def rss_sum(snapshot: dict[str, Any], predicate) -> int:
    total_kb = 0
    for row in snapshot.get("processes", []):
        if predicate(row):
            total_kb += int(row.get("rssKb") or 0)
    return total_kb * 1024


def snapshot_row(iteration: int, snapshot: dict[str, Any], command: dict[str, Any]) -> dict[str, Any]:
    project_daemon = rss_sum(
        snapshot,
        lambda row: row.get("role") == "project-daemon"
        or row.get("classification") in {"project-daemon", "orphaned-project-daemon", "ccc-daemon"},
    )
    expected_daemon = rss_sum(
        snapshot,
        lambda row: row.get("role") == "expected-daemon" or row.get("classification") == "expected-warm-daemon",
    )
    current_session = rss_sum(snapshot, lambda row: row.get("classification") == "current-session")
    host_approx = snapshot.get("hostMemory", {}).get("approx", {})
    measurement = project_daemon + expected_daemon
    return {
        "iter": iteration,
        "timestamp": snapshot.get("timestamp"),
        "measurement_rss_bytes": measurement,
        "rss_bytes": measurement,
        "project_daemon_rss_bytes": project_daemon,
        "expected_daemon_rss_bytes": expected_daemon,
        "current_session_rss_bytes": current_session,
        "swap_bytes": int(host_approx.get("swapBytes") or host_approx.get("compressorBytes") or 0),
        "wired_bytes": int(host_approx.get("wiredBytes") or 0),
        "processCount": snapshot.get("processCount"),
        "projectDaemonCount": snapshot.get("projectDaemonCount"),
        "expectedDaemonCount": snapshot.get("expectedDaemonCount"),
        "command": command,
    }


def percentile(values: list[float], pct: float) -> float:
    if not values:
        return 0.0
    ordered = sorted(values)
    index = max(0, min(len(ordered) - 1, round((pct / 100) * (len(ordered) - 1))))
    return float(ordered[index])


def slope_stats(samples: list[dict[str, Any]], threshold_mb: float) -> dict[str, Any]:
    if not samples:
        return {
            "rss_slope_bytes_per_iter": 0.0,
            "rss_slope_mb_per_50": 0.0,
            "mean_delta_mb": 0.0,
            "median_delta_mb": 0.0,
            "iqr_mb": 0.0,
            "peak_mb": 0.0,
            "confidence_95_mb_per_iter": [0.0, 0.0],
            "decision": "deferred-to-operator",
        }

    xs = [float(row["iter"]) for row in samples]
    ys = [float(row["measurement_rss_bytes"]) for row in samples]
    x_bar = statistics.fmean(xs)
    y_bar = statistics.fmean(ys)
    denom = sum((x - x_bar) ** 2 for x in xs)
    slope = sum((x - x_bar) * (y - y_bar) for x, y in zip(xs, ys, strict=True)) / denom if denom else 0.0
    intercept = y_bar - slope * x_bar
    residuals = [y - (intercept + slope * x) for x, y in zip(xs, ys, strict=True)]
    if len(xs) > 2 and denom:
        residual_var = sum(value * value for value in residuals) / (len(xs) - 2)
        slope_se = (residual_var / denom) ** 0.5
    else:
        slope_se = 0.0

    first = ys[0]
    deltas_mb = [(value - first) / MB for value in ys]
    q1 = percentile(deltas_mb, 25)
    q3 = percentile(deltas_mb, 75)
    slope_mb_per_50 = (slope * 50) / MB
    ci_low = (slope - 1.96 * slope_se) / MB
    ci_high = (slope + 1.96 * slope_se) / MB
    return {
        "rss_slope_bytes_per_iter": slope,
        "rss_slope_mb_per_50": slope_mb_per_50,
        "mean_delta_mb": statistics.fmean(deltas_mb),
        "median_delta_mb": statistics.median(deltas_mb),
        "iqr_mb": q3 - q1,
        "peak_mb": max(ys) / MB,
        "confidence_95_mb_per_iter": [ci_low, ci_high],
        "decision": "P1-escalate" if slope_mb_per_50 > threshold_mb else "P2-hold",
    }


def blocked_payload(args: argparse.Namespace, reason: str, samples: list[dict[str, Any]] | None = None) -> dict[str, Any]:
    return {
        "schema_version": 1,
        "path": "successful-search",
        "status": "blocked",
        "blocked_reason": reason,
        "iterations": args.iterations,
        "threshold_mb": args.threshold_mb,
        "decision": "deferred-to-operator",
        "operator_command": (
            "python3 bench_successful_search_rss.py "
            f"--iterations {args.iterations} --out {args.out}"
        ),
        "expected_json_shape": {
            "rss_slope_bytes_per_iter": 0.0,
            "rss_slope_mb_per_50": 0.0,
            "decision": "P2-hold | P1-escalate | deferred-to-operator",
            "samples": [],
        },
        "samples": samples or [],
    }


def write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--iterations", type=int, default=50)
    parser.add_argument("--sample-every", type=int, default=1)
    parser.add_argument("--out", type=Path, default=Path("/tmp/bench-search-rss.json"))
    parser.add_argument("--threshold-mb", type=float, default=10.0)
    parser.add_argument("--fixture", type=Path, default=DEFAULT_FIXTURE)
    parser.add_argument("--limit", type=str, default="5")
    parser.add_argument("--timeout-s", type=float, default=120.0)
    args = parser.parse_args()

    if args.iterations < 1:
        parser.error("--iterations must be >= 1")
    if args.sample_every < 1:
        parser.error("--sample-every must be >= 1")
    if not CCC.exists():
        payload = blocked_payload(args, f"ccc CLI not found at {CCC}")
        write_json(args.out, payload)
        print(json.dumps(payload, indent=2, sort_keys=True))
        return 2
    if not HARNESS.exists():
        payload = blocked_payload(args, f"process-memory-harness.js not found at {HARNESS}")
        write_json(args.out, payload)
        print(json.dumps(payload, indent=2, sort_keys=True))
        return 2

    queries = load_queries(args.fixture)
    samples: list[dict[str, Any]] = []
    started_at = utc_now()

    try:
        samples.append(snapshot_row(0, run_snapshot(), {"returncode": 0, "query": "initial-snapshot"}))
        for iteration in range(1, args.iterations + 1):
            query = queries[(iteration - 1) % len(queries)]
            env = os.environ.copy()
            env.setdefault("COCOINDEX_RERANK", "true")
            t0 = time.monotonic()
            proc = subprocess.run(
                [str(CCC), "search", query, "--limit", args.limit],
                cwd=REPO_ROOT,
                capture_output=True,
                text=True,
                timeout=args.timeout_s,
                check=False,
                env=env,
            )
            elapsed_ms = int((time.monotonic() - t0) * 1000)
            command = {
                "query": query,
                "returncode": proc.returncode,
                "elapsed_ms": elapsed_ms,
                "stdout_bytes": len(proc.stdout.encode("utf-8")),
                "stderr_tail": proc.stderr.strip()[-1000:],
            }
            if proc.returncode != 0:
                payload = blocked_payload(args, f"ccc search failed at iteration {iteration}", samples)
                payload["failed_command"] = command
                write_json(args.out, payload)
                print(json.dumps(payload, indent=2, sort_keys=True))
                return 2
            if iteration % args.sample_every == 0 or iteration == args.iterations:
                samples.append(snapshot_row(iteration, run_snapshot(), command))
                print(f"[successful-search] iter={iteration}/{args.iterations} rss={samples[-1]['rss_bytes']}", flush=True)
    except Exception as exc:
        payload = blocked_payload(args, str(exc), samples)
        write_json(args.out, payload)
        print(json.dumps(payload, indent=2, sort_keys=True))
        return 2

    payload = {
        "schema_version": 1,
        "path": "successful-search",
        "status": "ok",
        "started_at": started_at,
        "completed_at": utc_now(),
        "iterations": args.iterations,
        "sample_every": args.sample_every,
        "threshold_mb": args.threshold_mb,
        "fixture": str(args.fixture),
        **slope_stats(samples, args.threshold_mb),
        "samples": samples,
    }
    write_json(args.out, payload)
    print(json.dumps(payload, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    sys.exit(main())
