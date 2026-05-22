#!/usr/bin/env python3
# ---------------------------------------------------------------
# COMPONENT: COCOINDEX SIDECAR 5XX FALLBACK RSS BENCHMARK
# ---------------------------------------------------------------
"""Measure sidecar 5xx fallback resident-memory slope."""

from __future__ import annotations

import argparse
import json
import os
import statistics
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[6]
MCP_SERVER = REPO_ROOT / ".opencode/skills/mcp-coco-index/mcp_server"
HARNESS = REPO_ROOT / ".opencode/skills/system-spec-kit/scripts/dist/ops/process-memory-harness.js"
MB = 1024 * 1024

if str(MCP_SERVER) not in sys.path:
    sys.path.insert(0, str(MCP_SERVER))


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


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
    if snapshot.get("status") != "ok":
        raise RuntimeError(
            f"process-memory-harness inventory status is {snapshot.get('status')}: {snapshot.get('error') or 'no process rows'}"
        )
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
    return {
        "iter": iteration,
        "timestamp": snapshot.get("timestamp"),
        "measurement_rss_bytes": current_session,
        "rss_bytes": current_session,
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


class FakeResponse:
    status_code = 503

    def json(self) -> dict[str, Any]:
        return {"error": "forced sidecar 5xx"}


class FakeClient:
    def post(self, *_args: Any, **_kwargs: Any) -> FakeResponse:
        return FakeResponse()

    def close(self) -> None:
        return None


class StubFallbackAdapter:
    def __init__(self) -> None:
        self.calls = 0

    def rerank(self, _query: str, candidates: list[Any], _top_k: int, *, diagnostics: Any | None = None) -> list[Any]:
        self.calls += 1
        if diagnostics is not None:
            diagnostics.record_reranker_fallback("stub_fallback")
        return candidates

    def close(self) -> None:
        return None


def make_candidates(count: int) -> list[Any]:
    from cocoindex_code.indexer.schema import QueryResult

    return [
        QueryResult(
            file_path=f"synthetic-{idx}.py",
            language="python",
            content=("def synthetic_function():\n    return 'adapter rss benchmark'\n" * 20),
            start_line=1,
            end_line=40,
            score=float(count - idx),
            raw_score=float(count - idx),
            path_class="implementation",
            rankingSignals=["synthetic"],
        )
        for idx in range(count)
    ]


def run_one(adapter: Any, candidate_count: int, top_k: int) -> dict[str, Any]:
    from cocoindex_code.observability.observability import RetrievalDiagnostics

    diagnostics = RetrievalDiagnostics()
    candidates = make_candidates(candidate_count)
    result = adapter.rerank(
        "adapter resident memory fallback benchmark",
        candidates,
        top_k,
        diagnostics=diagnostics,
    )
    return {
        "result_count": len(result),
        "fallback_used": diagnostics.reranker_fallback_used,
        "fallback_reason": diagnostics.reranker_fallback_reason,
    }


def blocked_payload(args: argparse.Namespace, reason: str, samples: list[dict[str, Any]] | None = None) -> dict[str, Any]:
    return {
        "schema_version": 1,
        "path": "sidecar-5xx-fallback",
        "status": "blocked",
        "blocked_reason": reason,
        "iterations": args.iterations,
        "threshold_mb": args.threshold_mb,
        "decision": "deferred-to-operator",
        "operator_command": (
            "python3 bench_sidecar_5xx_fallback_rss.py "
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
    parser.add_argument("--out", type=Path, default=Path("/tmp/bench-fallback-rss.json"))
    parser.add_argument("--threshold-mb", type=float, default=10.0)
    parser.add_argument("--candidate-count", type=int, default=8)
    parser.add_argument("--top-k", type=int, default=5)
    parser.add_argument(
        "--stub-fallback",
        action="store_true",
        help="Smoke-only mode: avoid loading the bundled fallback model.",
    )
    args = parser.parse_args()

    if args.iterations < 1:
        parser.error("--iterations must be >= 1")
    if args.sample_every < 1:
        parser.error("--sample-every must be >= 1")
    if args.candidate_count < 2:
        parser.error("--candidate-count must be >= 2")
    if not HARNESS.exists():
        payload = blocked_payload(args, f"process-memory-harness.js not found at {HARNESS}")
        write_json(args.out, payload)
        print(json.dumps(payload, indent=2, sort_keys=True))
        return 2

    started_at = utc_now()
    samples: list[dict[str, Any]] = []

    try:
        from cocoindex_code.rerankers.reranker import HttpSidecarRerankerAdapter

        adapter = HttpSidecarRerankerAdapter(port=8765, timeout_s=0.01)
        adapter._client = FakeClient()
        if args.stub_fallback:
            adapter._fallback_adapter = StubFallbackAdapter()

        samples.append(snapshot_row(0, run_snapshot(), {"returncode": 0, "mode": "initial-snapshot"}))
        for iteration in range(1, args.iterations + 1):
            command = run_one(adapter, args.candidate_count, args.top_k)
            if not command["fallback_used"]:
                raise RuntimeError(f"fallback was not used at iteration {iteration}: {command}")
            if iteration % args.sample_every == 0 or iteration == args.iterations:
                samples.append(snapshot_row(iteration, run_snapshot(), command))
                print(f"[sidecar-5xx-fallback] iter={iteration}/{args.iterations} rss={samples[-1]['rss_bytes']}", flush=True)
        adapter.close()
    except Exception as exc:
        payload = blocked_payload(args, str(exc), samples)
        write_json(args.out, payload)
        print(json.dumps(payload, indent=2, sort_keys=True))
        return 2

    payload = {
        "schema_version": 1,
        "path": "sidecar-5xx-fallback",
        "status": "ok",
        "fallback_mode": "stub" if args.stub_fallback else "real-bundled-adapter",
        "started_at": started_at,
        "completed_at": utc_now(),
        "iterations": args.iterations,
        "sample_every": args.sample_every,
        "threshold_mb": args.threshold_mb,
        **slope_stats(samples, args.threshold_mb),
        "samples": samples,
    }
    write_json(args.out, payload)
    print(json.dumps(payload, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    sys.exit(main())
