#!/usr/bin/env python3
"""H3: compare dynamic shapes with static-shape CoreML options and fixed padding."""

from __future__ import annotations

import argparse

from common import (
    FINDINGS_DIR,
    SCRIPTS_DIR,
    benchmark_onnx_calls,
    print_rows,
    provider_options,
    write_markdown,
    write_raw_latency_csv,
    write_summary_csv,
)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--iterations", type=int, default=100)
    parser.add_argument("--warmup", type=int, default=5)
    args = parser.parse_args()

    configs = [
        ("dynamic-max2048", "0", 2048, False),
        ("static-pad128", "1", 128, True),
        ("static-pad512", "1", 512, True),
    ]
    rows = []
    for label, static_shapes, max_length, fixed_padding in configs:
        try:
            rows.append(
                benchmark_onnx_calls(
                    label=label,
                    options=provider_options(
                        compute_units="CPUAndNeuralEngine",
                        model_format="MLProgram",
                        static_shapes=static_shapes,
                    ),
                    iterations=args.iterations,
                    warmup=args.warmup,
                    batch_size=1,
                    max_length=max_length,
                    fixed_padding=fixed_padding,
                )
            )
        except Exception as exc:  # noqa: BLE001
            rows.append(
                {
                    "label": label,
                    "backend": "onnx",
                    "ep": "ERROR",
                    "ml_compute_units": "CPUAndNeuralEngine",
                    "model_format": "MLProgram",
                    "static_shapes": static_shapes,
                    "batch_size": 1,
                    "max_length": max_length,
                    "fixed_padding": fixed_padding,
                    "iterations": args.iterations,
                    "warmup_excluded": args.warmup,
                    "latencies_ms": [],
                    "error": f"{type(exc).__name__}: {exc}",
                }
            )

    write_raw_latency_csv(SCRIPTS_DIR / "raw-timings-H3.csv", rows)
    write_summary_csv(SCRIPTS_DIR / "summary-H3.csv", rows)
    dynamic = next((row for row in rows if row["label"] == "dynamic-max2048" and row.get("latencies_ms")), None)
    static_rows = [row for row in rows if str(row.get("label", "")).startswith("static") and row.get("latencies_ms")]
    best_static = min(static_rows, key=lambda row: row.get("p50_ms", float("inf")), default=None)
    verdict = "INCONCLUSIVE"
    if dynamic and best_static:
        verdict = "CONFIRMED" if best_static["p50_ms"] < dynamic["p50_ms"] * 0.7 else "REFUTED"
    elif dynamic and not static_rows:
        verdict = "REFUTED"

    lines = [
        "# H3 - Static vs Dynamic Input Shapes",
        "",
        f"Verdict: {verdict}",
        "",
        f"Measured {args.iterations} iterations after {args.warmup} warmups per config. "
        "`static-pad128` and `static-pad512` use `RequireStaticInputShapes=1` plus tokenizer "
        "padding to `max_length`.",
        "",
        "| Config | Static flag | Max length | Fixed padding | EP | p50 ms | p95 ms | p99 ms | Mean ms | Error |",
        "|---|---:|---:|---:|---|---:|---:|---:|---:|---|",
    ]
    for row in rows:
        lines.append(
            f"| {row.get('label')} | {row.get('static_shapes')} | {row.get('max_length')} | "
            f"{row.get('fixed_padding')} | {row.get('ep')} | "
            f"{float(row.get('p50_ms', 0.0)):.3f} | {float(row.get('p95_ms', 0.0)):.3f} | "
            f"{float(row.get('p99_ms', 0.0)):.3f} | {float(row.get('mean_ms', 0.0)):.3f} | "
            f"{row.get('error', '')} |"
        )
    lines.append("")
    lines.append("Interpretation: a large static-shape win would mean dynamic shapes blocked the fast CoreML path.")
    write_markdown(FINDINGS_DIR / "H3-static-shapes.md", "\n".join(lines))
    print_rows(rows)


if __name__ == "__main__":
    main()
