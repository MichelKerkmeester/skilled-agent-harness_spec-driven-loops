from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path

import pytest


REPO_ROOT = Path(__file__).resolve().parents[4]
SWEEP_SCRIPT = (
    REPO_ROOT
    / "specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture"
    / "004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/sweep-rrf.py"
)


def _load_sweep_module():
    spec = importlib.util.spec_from_file_location("sweep_rrf", SWEEP_SCRIPT)
    assert spec is not None
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    sys.modules["sweep_rrf"] = module
    spec.loader.exec_module(module)
    return module


def test_rrf_sweep_grid_defaults() -> None:
    sweep = _load_sweep_module()

    assert sweep.parse_grid_from_env({}) == (
        [30, 60, 90, 120],
        [0.5, 0.7, 0.9, 1.0],
        [0.3, 0.5, 0.7, 0.9],
    )


def test_rrf_sweep_grid_env_overrides() -> None:
    sweep = _load_sweep_module()

    assert sweep.parse_grid_from_env(
        {
            "COCOINDEX_RRF_SWEEP_K_VALUES": "[60,90]",
            "COCOINDEX_RRF_SWEEP_VEC_WEIGHTS": "[0.7]",
            "COCOINDEX_RRF_SWEEP_FTS_WEIGHTS": "[0.5,0.9]",
        }
    ) == ([60, 90], [0.7], [0.5, 0.9])


def test_rrf_sweep_grid_rejects_invalid_values() -> None:
    sweep = _load_sweep_module()

    with pytest.raises(ValueError, match="positive integers"):
        sweep.parse_grid_from_env({"COCOINDEX_RRF_SWEEP_K_VALUES": "[0]"})

    with pytest.raises(ValueError, match="positive finite"):
        sweep.parse_grid_from_env({"COCOINDEX_RRF_SWEEP_VEC_WEIGHTS": "[-0.1]"})


def test_rrf_picker_uses_hit_rate_latency_and_default_delta(tmp_path: Path) -> None:
    sweep = _load_sweep_module()
    cells_dir = tmp_path / "cells"
    cells_dir.mkdir()
    for name, payload in {
        "cell-K30-V0p7-F0p7.json": _cell(30, 0.7, 0.7, hits=15, p95=900),
        "cell-K60-V0p7-F0p7.json": _cell(60, 0.7, 0.7, hits=15, p95=900),
        "cell-K90-V0p7-F0p7.json": _cell(90, 0.7, 0.7, hits=15, p95=1000),
        "cell-K120-V1-F0p9.json": _cell(120, 1.0, 0.9, hits=16, p95=2000),
    }.items():
        (cells_dir / name).write_text(json.dumps(payload), encoding="utf-8")

    cells = sweep.load_cell_metrics(cells_dir, "baseline-bge")
    picked_without_cap = sweep.pick_cell(cells)
    picked_with_cap = sweep.pick_cell(cells, baseline_p95_ms=1000)

    assert picked_without_cap.k == 120
    assert picked_with_cap.k == 60


def _cell(k: int, vec: float, fts: float, *, hits: int, p95: int) -> dict:
    probes = [
        {"probe_id": idx + 1, "hit": idx < hits, "latency_ms": 100 + idx}
        for idx in range(18)
    ]
    return {
        "status": "ok",
        "cell": {"k": k, "vec_weight": vec, "fts_weight": fts},
        "lanes": {
            "baseline-bge": {
                "hits": hits,
                "total": 18,
                "hit_rate": hits / 18,
                "p50_ms": 500,
                "p95_ms": p95,
                "probes": probes,
            }
        },
    }
