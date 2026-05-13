#!/usr/bin/env python3
"""H6: measure ONNX and sbert sensitivity to batch size."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys

from common import (
    FINDINGS_DIR,
    SCRIPTS_DIR,
    benchmark_onnx_calls,
    benchmark_sbert_calls,
    print_rows,
    provider_options,
    write_markdown,
    write_raw_latency_csv,
    write_summary_csv,
)


def run_worker(args: argparse.Namespace) -> None:
    if args.worker_backend == "onnx":
        row = benchmark_onnx_calls(
            label=(
                f"onnx-batch-{args.worker_batch_size}-"
                f"max{args.max_length}-static{args.static_shapes}"
            ),
            options=provider_options(
                compute_units="CPUAndNeuralEngine",
                static_shapes=args.static_shapes,
            ),
            iterations=args.iterations,
            warmup=args.warmup,
            batch_size=args.worker_batch_size,
            max_length=args.max_length,
            fixed_padding=args.fixed_padding,
        )
    else:
        row = benchmark_sbert_calls(
            label=f"sbert-batch-{args.worker_batch_size}",
            iterations=args.iterations,
            warmup=args.warmup,
            batch_size=args.worker_batch_size,
        )
    output_json = SCRIPTS_DIR / args.worker_output
    output_json.write_text(json.dumps(row, sort_keys=True) + "\n")


def run_child(args: argparse.Namespace, *, backend: str, batch_size: int) -> dict[str, object]:
    label = (
        f"onnx-batch-{batch_size}-max{args.max_length}-static{args.static_shapes}"
        if backend == "onnx"
        else f"sbert-batch-{batch_size}"
    )
    output_name = f"H6-worker-{label}.json"
    output_json = SCRIPTS_DIR / output_name
    log_path = SCRIPTS_DIR / f"H6-worker-{label}.log"
    if args.reuse_workers and output_json.exists():
        return json.loads(output_json.read_text())
    if args.reuse_workers and log_path.exists():
        return {
            "label": label,
            "backend": backend,
            "ep": "ERROR",
            "ml_compute_units": "CPUAndNeuralEngine" if backend == "onnx" else "",
            "model_format": "MLProgram" if backend == "onnx" else "",
            "static_shapes": args.static_shapes if backend == "onnx" else "",
            "batch_size": batch_size,
            "max_length": args.max_length if backend == "onnx" else "",
            "fixed_padding": args.fixed_padding if backend == "onnx" else "",
            "iterations": args.iterations,
            "warmup_excluded": args.warmup,
            "latencies_ms": [],
            "per_item_summary": {},
            "error": f"no worker JSON; prior run did not complete, see {log_path.relative_to(SCRIPTS_DIR.parent)}",
        }
    if output_json.exists():
        output_json.unlink()
    cmd = [
        sys.executable,
        __file__,
        "--worker-backend",
        backend,
        "--worker-batch-size",
        str(batch_size),
        "--worker-output",
        output_name,
        "--iterations",
        str(args.iterations),
        "--warmup",
        str(args.warmup),
        "--max-length",
        str(args.max_length),
        "--static-shapes",
        args.static_shapes,
    ]
    if args.fixed_padding:
        cmd.append("--fixed-padding")
    with log_path.open("w") as log_file:
        try:
            completed = subprocess.run(
                cmd,
                stdout=log_file,
                stderr=subprocess.STDOUT,
                text=True,
                timeout=args.timeout_seconds,
            )
            timed_out = False
        except subprocess.TimeoutExpired:
            completed = None
            timed_out = True
    if output_json.exists():
        return json.loads(output_json.read_text())
    error = "timeout" if timed_out else f"returncode={completed.returncode if completed else 'UNKNOWN'}"
    return {
        "label": label,
        "backend": backend,
        "ep": "ERROR",
        "ml_compute_units": "CPUAndNeuralEngine" if backend == "onnx" else "",
        "model_format": "MLProgram" if backend == "onnx" else "",
        "static_shapes": args.static_shapes if backend == "onnx" else "",
        "batch_size": batch_size,
        "max_length": args.max_length if backend == "onnx" else "",
        "fixed_padding": args.fixed_padding if backend == "onnx" else "",
        "iterations": args.iterations,
        "warmup_excluded": args.warmup,
        "latencies_ms": [],
        "per_item_summary": {},
        "error": f"{error}; see {log_path.relative_to(SCRIPTS_DIR.parent)}",
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--iterations", type=int, default=100)
    parser.add_argument("--warmup", type=int, default=5)
    parser.add_argument("--max-length", type=int, default=2048)
    parser.add_argument("--static-shapes", choices=["0", "1"], default="0")
    parser.add_argument("--fixed-padding", action="store_true")
    parser.add_argument("--timeout-seconds", type=int, default=300)
    parser.add_argument("--reuse-workers", action="store_true")
    parser.add_argument("--worker-backend", choices=["onnx", "sbert"])
    parser.add_argument("--worker-batch-size", type=int)
    parser.add_argument("--worker-output", default="H6-worker.json")
    args = parser.parse_args()

    if args.worker_backend:
        if args.worker_batch_size is None:
            raise SystemExit("--worker-batch-size is required with --worker-backend")
        run_worker(args)
        return

    rows = []
    for batch_size in [1, 8, 32, 128]:
        rows.append(run_child(args, backend="onnx", batch_size=batch_size))
    for batch_size in [1, 8, 32, 128]:
        rows.append(run_child(args, backend="sbert", batch_size=batch_size))

    write_raw_latency_csv(SCRIPTS_DIR / "raw-timings-H6.csv", rows)
    write_summary_csv(SCRIPTS_DIR / "summary-H6.csv", rows)
    onnx_rows = [row for row in rows if row.get("backend") == "onnx"]
    sbert_rows = [row for row in rows if row.get("backend") == "sbert"]
    onnx_by_batch = {row["batch_size"]: row for row in onnx_rows}
    sbert_by_batch = {row["batch_size"]: row for row in sbert_rows}
    wins = []
    for batch_size, onnx_row in onnx_by_batch.items():
        sbert_row = sbert_by_batch.get(batch_size)
        if not sbert_row:
            continue
        onnx_per_item = onnx_row.get("per_item_summary") or {}
        sbert_per_item = sbert_row.get("per_item_summary") or {}
        if "p50_ms" not in onnx_per_item or "p50_ms" not in sbert_per_item:
            continue
        if onnx_per_item["p50_ms"] < sbert_per_item["p50_ms"]:
            wins.append(batch_size)
    verdict = "CONFIRMED" if wins else "REFUTED"

    lines = [
        "# H6 - Batch Size Sensitivity",
        "",
        f"Verdict: {verdict}",
        "",
        f"Measured {args.iterations} iterations after {args.warmup} warmups for each batch size. "
        f"ONNX config: `RequireStaticInputShapes={args.static_shapes}`, "
        f"`max_length={args.max_length}`, `fixed_padding={args.fixed_padding}`. "
        "The table includes both per-call latency and per-item latency.",
        "",
        "| Backend | Batch | EP | p50 call ms | p95 call ms | p99 call ms | p50/item ms | p95/item ms | Error |",
        "|---|---:|---|---:|---:|---:|---:|---:|---|",
    ]
    for row in rows:
        per_item = row.get("per_item_summary", {})
        lines.append(
            f"| {row.get('backend')} | {row.get('batch_size')} | {row.get('ep')} | "
            f"{float(row.get('p50_ms', 0.0)):.3f} | {float(row.get('p95_ms', 0.0)):.3f} | "
            f"{float(row.get('p99_ms', 0.0)):.3f} | "
            f"{float(per_item.get('p50_ms', 0.0)):.3f} | {float(per_item.get('p95_ms', 0.0)):.3f} | "
            f"{row.get('error', '')} |"
        )
    lines.extend(
        [
            "",
            f"ONNX per-item p50 wins over sbert at matching batch sizes: `{wins}`.",
            "",
            "Interpretation: if ONNX only wins at larger batches, it may still be viable for indexing "
            "but not for query latency.",
        ]
    )
    write_markdown(FINDINGS_DIR / "H6-batch-size.md", "\n".join(lines))
    print_rows(rows)


if __name__ == "__main__":
    main()
