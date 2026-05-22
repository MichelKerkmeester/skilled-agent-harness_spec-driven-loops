#!/usr/bin/env python3
# ---------------------------------------------------------------
# COMPONENT: COCOINDEX SIDECAR 5XX FALLBACK RSS BENCHMARK
# ---------------------------------------------------------------
"""Measure sidecar 5xx fallback resident-memory slope."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

from bench_rss_core import blocked_payload, run_snapshot, slope_stats, snapshot_row, utc_now, write_json

REPO_ROOT = Path(__file__).resolve().parents[6]
MCP_SERVER = REPO_ROOT / ".opencode/skills/mcp-coco-index/mcp_server"
HARNESS = REPO_ROOT / ".opencode/skills/system-spec-kit/scripts/dist/ops/process-memory-harness.js"

if str(MCP_SERVER) not in sys.path:
    sys.path.insert(0, str(MCP_SERVER))


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


def build_blocked_payload(args: argparse.Namespace, reason: str, samples: list[dict[str, Any]] | None = None) -> dict[str, Any]:
    return blocked_payload(
        path="sidecar-5xx-fallback",
        iterations=args.iterations,
        threshold_mb=args.threshold_mb,
        out=args.out,
        script_name="bench_sidecar_5xx_fallback_rss.py",
        reason=reason,
        samples=samples,
    )


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
        payload = build_blocked_payload(args, f"process-memory-harness.js not found at {HARNESS}")
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

        samples.append(
            snapshot_row(
                0,
                run_snapshot(REPO_ROOT, HARNESS),
                {"returncode": 0, "mode": "initial-snapshot"},
                measurement="current-session",
            )
        )
        for iteration in range(1, args.iterations + 1):
            command = run_one(adapter, args.candidate_count, args.top_k)
            if not command["fallback_used"]:
                raise RuntimeError(f"fallback was not used at iteration {iteration}: {command}")
            if iteration % args.sample_every == 0 or iteration == args.iterations:
                samples.append(
                    snapshot_row(
                        iteration,
                        run_snapshot(REPO_ROOT, HARNESS),
                        command,
                        measurement="current-session",
                    )
                )
                print(f"[sidecar-5xx-fallback] iter={iteration}/{args.iterations} rss={samples[-1]['rss_bytes']}", flush=True)
        adapter.close()
    except Exception as exc:
        payload = build_blocked_payload(args, str(exc), samples)
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
