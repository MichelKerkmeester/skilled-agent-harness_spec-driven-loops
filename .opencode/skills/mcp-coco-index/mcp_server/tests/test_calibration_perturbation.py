from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[4]
PHASE2_BENCH = (
    REPO_ROOT
    / "specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture"
    / "004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench"
)
FIXTURE = (
    REPO_ROOT
    / "skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-expanded"
    / "code-retrieval-fixture-expanded-v2.json"
)


def _load_calibration():
    module_path = PHASE2_BENCH / "calibration_perturbation.py"
    spec = importlib.util.spec_from_file_location("calibration_perturbation", module_path)
    assert spec is not None
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    sys.modules["calibration_perturbation"] = module
    spec.loader.exec_module(module)
    return module


def _run_payload(lane_id: str, hit_rate: float) -> dict:
    total = 10
    hits = round(total * hit_rate)
    return {
        "lane_id": lane_id,
        "lane_name": f"RRF K={lane_id.rsplit('-', 1)[-1]}",
        "total_probes": total,
        "hits": hits,
        "hit_rate": hit_rate,
        "latency_ms": {"p95": 1000},
        "per_probe": [{"probe_id": 1, "hit": True}],
    }


def test_rrf_k_sweep_flat_line() -> None:
    calibration = _load_calibration()
    runs = [
        _run_payload("rrf-k10", 0.71),
        _run_payload("rrf-k30", 0.72),
        _run_payload("rrf-k60", 0.70),
        _run_payload("rrf-k100", 0.72),
        _run_payload("rrf-k150", 0.71),
        _run_payload("rrf-k300", 0.70),
    ]
    summaries = calibration.aggregate_runs(runs)

    assert calibration.rrf_k_hit_rate_variance(summaries) < 0.05


def test_aggregator_computes_mean_stddev_ci() -> None:
    calibration = _load_calibration()
    mean, stddev, ci95 = calibration.mean_stddev_ci95([0.5, 0.7, 0.9])

    assert round(mean, 3) == 0.7
    assert round(stddev, 3) == 0.2
    assert round(ci95, 3) == 0.226


def test_residual_miss_classifier() -> None:
    calibration = _load_calibration()
    probe = {"expected_failure_mode": "none"}

    assert calibration.classify_residual_miss(probe, {"hit": True}) == "none"
    assert (
        calibration.classify_residual_miss(
            probe,
            {"hit": False, "expected_in_fts": False, "diagnostics": {"fts_candidates_count": 3}},
        )
        == "lexical_gap"
    )
    assert (
        calibration.classify_residual_miss(
            probe,
            {
                "hit": False,
                "expected_in_fts": True,
                "expected_in_vector": False,
                "diagnostics": {"fts_candidates_count": 3, "vec_candidates_count": 9},
            },
        )
        == "semantic_gap"
    )
    assert (
        calibration.classify_residual_miss(
            probe,
            {
                "hit": False,
                "expected_in_fts": True,
                "expected_in_vector": True,
                "expected_in_rerank_input": True,
                "diagnostics": {"rerank_input_count": 20},
            },
        )
        == "reranker_inversion"
    )
    assert (
        calibration.classify_residual_miss(
            {"expected_failure_mode": "fixture_ambiguity"},
            {"hit": False, "diagnostics": {}},
        )
        == "fixture_ambiguity"
    )


def test_expanded_fixture_loadable() -> None:
    calibration = _load_calibration()
    summary = calibration.validate_expanded_fixture(FIXTURE)
    fixture = json.loads(FIXTURE.read_text(encoding="utf-8"))

    assert summary["total"] == len(fixture)
    assert summary["original"] == 18
    assert summary["architecture_invariant"] >= 15
    assert summary["multilingual_code_switched"] >= 10
    assert summary["short_query"] >= 5
    assert summary["long_query"] >= 5
    for path_class in ["implementation", "tests", "docs", "generated", "vendor", "spec_research"]:
        assert summary[f"path_class_{path_class}"] >= 5
