#!/usr/bin/env python3
"""Shared RSS benchmark measurement helpers."""

from __future__ import annotations

import json
import statistics
import subprocess
from collections.abc import Callable
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

MB = 1024 * 1024


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def run_snapshot(repo_root: Path, harness: Path) -> dict[str, Any]:
    proc = subprocess.run(
        ["node", str(harness), "snapshot"],
        cwd=repo_root,
        capture_output=True,
        text=True,
        check=False,
    )
    if proc.returncode != 0:
        raise RuntimeError((proc.stderr or proc.stdout or "process-memory-harness snapshot failed").strip())
    snapshot = json.loads(proc.stdout)
    if snapshot.get("status") != "ok":
        raise RuntimeError(
            f"process-memory-harness inventory status is {snapshot.get('status')}: {snapshot.get('error') or 'no process rows'}"
        )
    return snapshot


def rss_sum(snapshot: dict[str, Any], predicate: Callable[[dict[str, Any]], bool]) -> int:
    total_kb = 0
    for row in snapshot.get("processes", []):
        if predicate(row):
            total_kb += int(row.get("rssKb") or 0)
    return total_kb * 1024


def snapshot_row(
    iteration: int,
    snapshot: dict[str, Any],
    command: dict[str, Any],
    *,
    measurement: str,
) -> dict[str, Any]:
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
    measurement_rss = {
        "project-plus-expected-daemon": project_daemon + expected_daemon,
        "current-session": current_session,
    }[measurement]
    return {
        "iter": iteration,
        "timestamp": snapshot.get("timestamp"),
        "measurement_rss_bytes": measurement_rss,
        "rss_bytes": measurement_rss,
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


def blocked_payload(
    *,
    path: str,
    iterations: int,
    threshold_mb: float,
    out: Path,
    script_name: str,
    reason: str,
    samples: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    return {
        "schema_version": 1,
        "path": path,
        "status": "blocked",
        "blocked_reason": reason,
        "iterations": iterations,
        "threshold_mb": threshold_mb,
        "decision": "deferred-to-operator",
        "operator_command": f"python3 {script_name} --iterations {iterations} --out {out}",
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
