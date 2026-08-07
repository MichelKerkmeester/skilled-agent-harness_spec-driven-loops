#!/usr/bin/env python3
"""H5: compare CoreML MLProgram versus NeuralNetwork model format."""

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

    rows = []
    for model_format in ["MLProgram", "NeuralNetwork"]:
        try:
            rows.append(
                benchmark_onnx_calls(
                    label=f"format-{model_format}",
                    options=provider_options(
                        compute_units="CPUAndNeuralEngine",
                        model_format=model_format,
                        static_shapes="0",
                    ),
                    iterations=args.iterations,
                    warmup=args.warmup,
                    batch_size=1,
                )
            )
        except Exception as exc:  # noqa: BLE001
            rows.append(
                {
                    "label": f"format-{model_format}",
                    "backend": "onnx",
                    "ep": "ERROR",
                    "ml_compute_units": "CPUAndNeuralEngine",
                    "model_format": model_format,
                    "static_shapes": "0",
                    "batch_size": 1,
                    "iterations": args.iterations,
                    "warmup_excluded": args.warmup,
                    "latencies_ms": [],
                    "error": f"{type(exc).__name__}: {exc}",
                }
            )

    write_raw_latency_csv(SCRIPTS_DIR / "raw-timings-H5.csv", rows)
    write_summary_csv(SCRIPTS_DIR / "summary-H5.csv", rows)
    mlprogram = next((row for row in rows if row.get("model_format") == "MLProgram" and row.get("latencies_ms")), None)
    neural = next((row for row in rows if row.get("model_format") == "NeuralNetwork" and row.get("latencies_ms")), None)
    verdict = "INCONCLUSIVE"
    if mlprogram and neural:
        verdict = "CONFIRMED" if neural["p50_ms"] < mlprogram["p50_ms"] * 0.7 else "REFUTED"
    elif mlprogram and not neural:
        verdict = "REFUTED"

    lines = [
        "# H5 - MLProgram vs NeuralNetwork Format",
        "",
        f"Verdict: {verdict}",
        "",
        f"Measured {args.iterations} iterations after {args.warmup} warmups per format.",
        "",
        "| ModelFormat | EP | p50 ms | p95 ms | p99 ms | Mean ms | Error |",
        "|---|---|---:|---:|---:|---:|---|",
    ]
    for row in rows:
        lines.append(
            f"| {row.get('model_format')} | {row.get('ep')} | "
            f"{float(row.get('p50_ms', 0.0)):.3f} | {float(row.get('p95_ms', 0.0)):.3f} | "
            f"{float(row.get('p99_ms', 0.0)):.3f} | {float(row.get('mean_ms', 0.0)):.3f} | "
            f"{row.get('error', '')} |"
        )
    lines.append("")
    lines.append("Interpretation: a large NeuralNetwork win would make `ModelFormat` a plausible fix.")
    write_markdown(FINDINGS_DIR / "H5-model-format.md", "\n".join(lines))
    print_rows(rows)


if __name__ == "__main__":
    main()
