#!/usr/bin/env python3
"""Aggregate RRF sweep cell outputs into a deterministic decision report."""

from __future__ import annotations

import argparse
import json
import math
import os
import re
import statistics
from dataclasses import dataclass
from pathlib import Path
from typing import Any

DEFAULT_K_VALUES = [30, 60, 90, 120]
DEFAULT_VEC_WEIGHTS = [0.5, 0.7, 0.9, 1.0]
DEFAULT_FTS_WEIGHTS = [0.3, 0.5, 0.7, 0.9]
DEFAULT_CELL = (60, 0.7, 0.7)
DEFAULT_PICK_LANE = "baseline-bge"


@dataclass(frozen=True)
class CellMetrics:
    path: Path
    k: int
    vec_weight: float
    fts_weight: float
    lane: str
    status: str
    hits: int
    total: int
    hit_rate: float
    p50_ms: int
    p95_ms: int
    probes: list[dict[str, Any]]

    @property
    def distance_from_default(self) -> float:
        return (
            abs(self.k - DEFAULT_CELL[0])
            + abs(self.vec_weight - DEFAULT_CELL[1])
            + abs(self.fts_weight - DEFAULT_CELL[2])
        )

    @property
    def config_label(self) -> str:
        return f"K={self.k} V={self.vec_weight:g} F={self.fts_weight:g}"


def _parse_json_list(raw_value: str, default: list[int] | list[float], var_name: str) -> list[Any]:
    if not raw_value.strip():
        return list(default)
    try:
        parsed = json.loads(raw_value)
    except json.JSONDecodeError as exc:
        raise ValueError(f"{var_name} must be a JSON array") from exc
    if not isinstance(parsed, list):
        raise ValueError(f"{var_name} must be a JSON array")
    return parsed


def parse_grid_from_env(environ: dict[str, str] | None = None) -> tuple[list[int], list[float], list[float]]:
    """Parse and validate the sweep grid environment contract."""
    env = environ if environ is not None else os.environ
    raw_k = _parse_json_list(
        env.get("COCOINDEX_RRF_SWEEP_K_VALUES", ""),
        DEFAULT_K_VALUES,
        "COCOINDEX_RRF_SWEEP_K_VALUES",
    )
    raw_vec = _parse_json_list(
        env.get("COCOINDEX_RRF_SWEEP_VEC_WEIGHTS", ""),
        DEFAULT_VEC_WEIGHTS,
        "COCOINDEX_RRF_SWEEP_VEC_WEIGHTS",
    )
    raw_fts = _parse_json_list(
        env.get("COCOINDEX_RRF_SWEEP_FTS_WEIGHTS", ""),
        DEFAULT_FTS_WEIGHTS,
        "COCOINDEX_RRF_SWEEP_FTS_WEIGHTS",
    )

    k_values: list[int] = []
    for value in raw_k:
        if isinstance(value, bool):
            raise ValueError("COCOINDEX_RRF_SWEEP_K_VALUES entries must be positive integers")
        int_value = int(value)
        if int_value <= 0 or int_value != value:
            raise ValueError("COCOINDEX_RRF_SWEEP_K_VALUES entries must be positive integers")
        k_values.append(int_value)

    vec_weights = [_positive_float(value, "COCOINDEX_RRF_SWEEP_VEC_WEIGHTS") for value in raw_vec]
    fts_weights = [_positive_float(value, "COCOINDEX_RRF_SWEEP_FTS_WEIGHTS") for value in raw_fts]
    if not k_values or not vec_weights or not fts_weights:
        raise ValueError("RRF sweep grid cannot be empty")
    return k_values, vec_weights, fts_weights


def _positive_float(value: Any, var_name: str) -> float:
    if isinstance(value, bool):
        raise ValueError(f"{var_name} entries must be positive numbers")
    try:
        result = float(value)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"{var_name} entries must be positive numbers") from exc
    if not math.isfinite(result) or result <= 0:
        raise ValueError(f"{var_name} entries must be positive finite numbers")
    return result


def slug_number(value: int | float) -> str:
    """Create a stable filename-safe representation for grid values."""
    if isinstance(value, int) or float(value).is_integer():
        return str(int(value))
    return f"{value:g}".replace("-", "m").replace(".", "p")


def load_cell_metrics(cells_dir: Path, lane: str) -> list[CellMetrics]:
    metrics: list[CellMetrics] = []
    for path in sorted(cells_dir.glob("cell-K*-V*-F*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        cell = data.get("cell", {})
        lanes = data.get("lanes", {})
        lane_data = lanes.get(lane, {})
        status = str(data.get("status", "unknown"))
        if status != "ok" or not lane_data:
            metrics.append(
                CellMetrics(
                    path=path,
                    k=int(cell.get("k", 0)),
                    vec_weight=float(cell.get("vec_weight", 0)),
                    fts_weight=float(cell.get("fts_weight", 0)),
                    lane=lane,
                    status=status,
                    hits=0,
                    total=0,
                    hit_rate=0.0,
                    p50_ms=0,
                    p95_ms=0,
                    probes=[],
                )
            )
            continue
        total = int(lane_data.get("total", 0))
        hits = int(lane_data.get("hits", 0))
        metrics.append(
            CellMetrics(
                path=path,
                k=int(cell["k"]),
                vec_weight=float(cell["vec_weight"]),
                fts_weight=float(cell["fts_weight"]),
                lane=lane,
                status=status,
                hits=hits,
                total=total,
                hit_rate=(hits / total) if total else 0.0,
                p50_ms=int(lane_data.get("p50_ms", 0)),
                p95_ms=int(lane_data.get("p95_ms", 0)),
                probes=list(lane_data.get("probes", [])),
            )
        )
    return metrics


def sort_key(cell: CellMetrics) -> tuple[float, int, float, int, float, float]:
    """Sort best first with deterministic final tiebreaks."""
    return (
        -cell.hit_rate,
        cell.p95_ms,
        cell.distance_from_default,
        cell.k,
        cell.vec_weight,
        cell.fts_weight,
    )


def pick_cell(cells: list[CellMetrics], *, baseline_p95_ms: int | None = None) -> CellMetrics:
    """Pick the deterministic winner, respecting an optional 15 percent p95 cap."""
    ok_cells = [cell for cell in cells if cell.status == "ok" and cell.total > 0]
    if not ok_cells:
        raise ValueError("No successful cell JSONs found")
    sorted_cells = sorted(ok_cells, key=sort_key)
    if baseline_p95_ms is None or baseline_p95_ms <= 0:
        return sorted_cells[0]
    cap = int(math.ceil(baseline_p95_ms * 1.15))
    eligible = [cell for cell in sorted_cells if cell.p95_ms <= cap]
    return eligible[0] if eligible else sorted_cells[0]


def parse_baseline_comparison(path: Path | None, lane: str) -> tuple[dict[int, bool], int | None]:
    """Parse prior Phase 2 markdown for probe states and p95, best-effort."""
    if path is None or not path.exists():
        return {}, None
    text = path.read_text(encoding="utf-8")
    probe_hits: dict[int, bool] = {}
    header_lanes: list[str] = []
    for line in text.splitlines():
        if line.startswith("| Probe |"):
            header_lanes = [part.strip() for part in line.strip("|").split("|")][3:]
            continue
        if not line.startswith("|") or line.startswith("|---"):
            continue
        cells = [part.strip() for part in line.strip("|").split("|")]
        if len(cells) >= 4 and cells[0].isdigit() and header_lanes:
            try:
                lane_idx = header_lanes.index(lane)
            except ValueError:
                continue
            state = cells[3 + lane_idx]
            probe_hits[int(cells[0])] = state in {"yes", "Y", "HIT", "hit", "✓"}
    p95_ms = _parse_summary_p95(text, lane)
    return probe_hits, p95_ms


def _parse_summary_p95(text: str, lane: str) -> int | None:
    for line in text.splitlines():
        if not line.startswith(f"| {lane} |"):
            continue
        cells = [part.strip() for part in line.strip("|").split("|")]
        if len(cells) >= 6:
            try:
                return int(re.sub(r"[^0-9]", "", cells[-1]))
            except ValueError:
                return None
    return None


def percentile(values: list[int], p: float) -> int:
    if not values:
        return 0
    ordered = sorted(values)
    index = min(len(ordered) - 1, int(len(ordered) * p))
    return ordered[index]


def summarize_results_jsonl(path: Path) -> dict[str, Any]:
    rows = [
        json.loads(line)
        for line in path.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]
    latencies = [int(row.get("latency_ms", 0)) for row in rows]
    hits = sum(1 for row in rows if row.get("hit") is True)
    return {
        "hits": hits,
        "total": len(rows),
        "hit_rate": (hits / len(rows)) if rows else 0.0,
        "p50_ms": int(statistics.median(latencies)) if latencies else 0,
        "p95_ms": percentile(latencies, 0.95),
        "probes": rows,
    }


def write_report(
    cells: list[CellMetrics],
    picked: CellMetrics,
    output_path: Path,
    *,
    lane: str,
    baseline_probe_hits: dict[int, bool],
    baseline_p95_ms: int | None,
) -> None:
    ok_cells = [cell for cell in cells if cell.status == "ok" and cell.total > 0]
    ranked = sorted(ok_cells, key=sort_key)
    cap = int(math.ceil(baseline_p95_ms * 1.15)) if baseline_p95_ms else None

    lines: list[str] = [
        "# RRF Sweep Results",
        "",
        f"Lane used for deterministic picker: `{lane}`.",
        f"Successful cells loaded: {len(ok_cells)}.",
    ]
    if cap is not None:
        lines.append(f"Latency cap: p95 <= {cap} ms (15 percent over baseline p95 {baseline_p95_ms} ms).")
    else:
        lines.append("Latency cap: unavailable because no parseable post-016 baseline p95 was supplied.")
    lines.extend(["", "## Table 1: Top 10 Cells", ""])
    lines.append("| Rank | k | vec_weight | fts_weight | Hits | Hit rate | p50 ms | p95 ms | Default delta | Cap |")
    lines.append("|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|")
    for idx, cell in enumerate(ranked[:10], start=1):
        cap_state = "pass" if cap is None or cell.p95_ms <= cap else "fail"
        lines.append(
            f"| {idx} | {cell.k} | {cell.vec_weight:g} | {cell.fts_weight:g} | "
            f"{cell.hits}/{cell.total} | {cell.hit_rate:.3f} | {cell.p50_ms} | "
            f"{cell.p95_ms} | {cell.distance_from_default:.3f} | {cap_state} |"
        )

    lines.extend(["", "## Table 2: Per-Probe Heatmap", ""])
    probe_ids = sorted({int(row["probe_id"]) for cell in ok_cells for row in cell.probes if "probe_id" in row})
    lines.append("| Probe | Picked cell | Cells hit | Hit configs |")
    lines.append("|---:|---|---:|---|")
    picked_probe_map = {int(row["probe_id"]): bool(row.get("hit")) for row in picked.probes}
    for probe_id in probe_ids:
        hit_cells = [
            cell.config_label
            for cell in ranked
            if any(int(row.get("probe_id", -1)) == probe_id and row.get("hit") for row in cell.probes)
        ]
        preview = ", ".join(hit_cells[:5])
        if len(hit_cells) > 5:
            preview += f", ... +{len(hit_cells) - 5}"
        lines.append(
            f"| {probe_id} | {'HIT' if picked_probe_map.get(probe_id) else 'MISS'} | "
            f"{len(hit_cells)} | {preview or '-'} |"
        )

    lines.extend(["", "## Table 3: Latency Scatter", ""])
    lines.append("| Cell | Hit rate | p95 ms |")
    lines.append("|---|---:|---:|")
    for cell in ranked[:20]:
        lines.append(f"| {cell.config_label} | {cell.hit_rate:.3f} | {cell.p95_ms} |")

    lines.extend(["", "## Decision", ""])
    lines.append(
        f"Picked cell: `{picked.config_label}` with {picked.hits}/{picked.total} hits, "
        f"p50 {picked.p50_ms} ms, and p95 {picked.p95_ms} ms."
    )
    lines.append(
        "The picker maximizes hit rate, then minimizes p95 latency, then prefers the smallest "
        "distance from inherited defaults `(60, 0.7, 0.7)`."
    )
    if cap is not None and picked.p95_ms > cap:
        lines.append("No successful cell met the 15 percent p95 cap, so the report keeps the best-ranked cell and marks the cap failure for operator review.")
    else:
        lines.append("The picked cell satisfies the available latency rule, so it is the default candidate for the final no-env bench gate.")

    lines.extend(["", "## Probe Notes", ""])
    for probe_id in probe_ids:
        picked_hit = picked_probe_map.get(probe_id, False)
        if probe_id in baseline_probe_hits:
            before = baseline_probe_hits[probe_id]
            if before and picked_hit:
                note = "stayed hit"
            elif before and not picked_hit:
                note = "regressed hit-to-miss"
            elif not before and picked_hit:
                note = "flipped miss-to-hit"
            else:
                note = "stayed miss"
        else:
            note = "has no parseable post-016 baseline state"
        lines.append(f"- Probe {probe_id}: picked cell is {'HIT' if picked_hit else 'MISS'} and {note}.")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cells-dir", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--lane", default=os.environ.get("COCOINDEX_RRF_SWEEP_PICK_LANE", DEFAULT_PICK_LANE))
    parser.add_argument("--baseline-comparison", type=Path)
    parser.add_argument("--baseline-p95-ms", type=int)
    args = parser.parse_args()

    baseline_probe_hits, parsed_p95 = parse_baseline_comparison(args.baseline_comparison, args.lane)
    baseline_p95 = args.baseline_p95_ms or parsed_p95
    cells = load_cell_metrics(args.cells_dir, args.lane)
    picked = pick_cell(cells, baseline_p95_ms=baseline_p95)
    write_report(
        cells,
        picked,
        args.output,
        lane=args.lane,
        baseline_probe_hits=baseline_probe_hits,
        baseline_p95_ms=baseline_p95,
    )
    print(f"picked {picked.config_label} -> {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
