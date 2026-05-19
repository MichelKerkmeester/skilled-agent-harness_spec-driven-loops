from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[4]
ANALYZER = (
    REPO_ROOT
    / "specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture"
    / "004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/rerank-matrix-analyze.py"
)


def _load_analyzer():
    spec = importlib.util.spec_from_file_location("rerank_matrix_analyze", ANALYZER)
    assert spec is not None
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    sys.modules["rerank_matrix_analyze"] = module
    spec.loader.exec_module(module)
    return module


def _run_payload(
    lane_id: str,
    *,
    success: bool = True,
    hits: int = 2,
    hit_rate: float = 1.0,
    mean_latency: float = 1000.0,
) -> dict:
    return {
        "success": success,
        "lane_id": lane_id,
        "lane_name": f"lane-{lane_id}",
        "iteration": 1,
        "hits": hits,
        "total_probes": 2,
        "hit_rate": hit_rate,
        "latency_ms": {
            "mean": mean_latency,
            "p50": mean_latency,
            "p95": mean_latency,
            "p99": mean_latency,
        },
        "peak_rss_mb": 512,
        "per_probe": [
            {"probe_id": 1, "hit": hits >= 1},
            {"probe_id": 2, "hit": hits >= 2},
        ],
    }


def test_rerank_matrix_analyzer_skips_failed_runs(tmp_path: Path) -> None:
    analyzer = _load_analyzer()
    (tmp_path / "laneB-iter1.json").write_text(
        json.dumps(_run_payload("B")),
        encoding="utf-8",
    )
    (tmp_path / "laneD-iter1.json").write_text(
        json.dumps(_run_payload("D", success=False, hits=0, hit_rate=0.0)),
        encoding="utf-8",
    )
    (tmp_path / "laneE-iter1.json").write_text(
        json.dumps(_run_payload("E", hits=0, hit_rate=0.0, mean_latency=32000.0)),
        encoding="utf-8",
    )

    runs, skipped = analyzer._load_runs(tmp_path)
    summaries = analyzer._build_summaries(runs)
    report = analyzer._render_markdown(summaries, runs, skipped)

    assert [run["lane_id"] for run in runs] == ["B"]
    assert [item.reason for item in skipped] == [
        "success=false",
        "zero-hit 25s+ timeout signature",
    ]
    assert "| B | lane-B | 1 | 2.00/2 | 100.0%" in report
    assert "| D |" not in report
    assert "| E |" not in report
    assert "## Skipped run warnings" in report
