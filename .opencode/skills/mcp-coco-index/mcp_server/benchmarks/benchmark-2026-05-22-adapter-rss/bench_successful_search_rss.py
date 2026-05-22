#!/usr/bin/env python3
# ---------------------------------------------------------------
# COMPONENT: COCOINDEX SUCCESSFUL-SEARCH RSS BENCHMARK
# ---------------------------------------------------------------
"""Measure CocoIndex successful-search resident-memory slope."""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import time
from pathlib import Path
from typing import Any

from bench_rss_core import blocked_payload, run_snapshot, slope_stats, snapshot_row, utc_now, write_json

REPO_ROOT = Path(__file__).resolve().parents[6]
CCC = REPO_ROOT / ".opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc"
HARNESS = REPO_ROOT / ".opencode/skills/system-spec-kit/scripts/dist/ops/process-memory-harness.js"
BENCH_DIR = Path(__file__).resolve().parent
DEFAULT_FIXTURE = BENCH_DIR.parent / "benchmark-2026-05-21" / "fixture-subset-18.json"
DEFAULT_QUERY = "registry of available embedding backends with dimensions and model notes"


def load_queries(path: Path | None) -> list[str]:
    if path is None or not path.exists():
        return [DEFAULT_QUERY]
    parsed = json.loads(path.read_text(encoding="utf-8"))
    queries = [str(row["query"]) for row in parsed if isinstance(row, dict) and row.get("query")]
    return queries or [DEFAULT_QUERY]


def build_blocked_payload(args: argparse.Namespace, reason: str, samples: list[dict[str, Any]] | None = None) -> dict[str, Any]:
    return blocked_payload(
        path="successful-search",
        iterations=args.iterations,
        threshold_mb=args.threshold_mb,
        out=args.out,
        script_name="bench_successful_search_rss.py",
        reason=reason,
        samples=samples,
    )


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
        payload = build_blocked_payload(args, f"ccc CLI not found at {CCC}")
        write_json(args.out, payload)
        print(json.dumps(payload, indent=2, sort_keys=True))
        return 2
    if not HARNESS.exists():
        payload = build_blocked_payload(args, f"process-memory-harness.js not found at {HARNESS}")
        write_json(args.out, payload)
        print(json.dumps(payload, indent=2, sort_keys=True))
        return 2

    queries = load_queries(args.fixture)
    samples: list[dict[str, Any]] = []
    started_at = utc_now()

    try:
        samples.append(
            snapshot_row(
                0,
                run_snapshot(REPO_ROOT, HARNESS),
                {"returncode": 0, "query": "initial-snapshot"},
                measurement="project-plus-expected-daemon",
            )
        )
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
                payload = build_blocked_payload(args, f"ccc search failed at iteration {iteration}", samples)
                payload["failed_command"] = command
                write_json(args.out, payload)
                print(json.dumps(payload, indent=2, sort_keys=True))
                return 2
            if iteration % args.sample_every == 0 or iteration == args.iterations:
                samples.append(
                    snapshot_row(
                        iteration,
                        run_snapshot(REPO_ROOT, HARNESS),
                        command,
                        measurement="project-plus-expected-daemon",
                    )
                )
                print(f"[successful-search] iter={iteration}/{args.iterations} rss={samples[-1]['rss_bytes']}", flush=True)
    except Exception as exc:
        payload = build_blocked_payload(args, str(exc), samples)
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
