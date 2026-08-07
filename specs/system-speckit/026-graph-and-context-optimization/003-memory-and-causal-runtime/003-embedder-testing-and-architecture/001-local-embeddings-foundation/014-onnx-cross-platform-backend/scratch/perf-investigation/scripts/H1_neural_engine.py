#!/usr/bin/env python3
"""H1: test whether CoreML EP is actually using the Neural Engine."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from common import (
    FINDINGS_DIR,
    PROFILES_DIR,
    SCRIPTS_DIR,
    TopSampler,
    benchmark_onnx_calls,
    finish_powermetrics,
    print_rows,
    profile_provider_counts,
    provider_options,
    start_powermetrics,
    write_markdown,
    write_raw_latency_csv,
    write_summary_csv,
)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--iterations", type=int, default=100)
    parser.add_argument("--warmup", type=int, default=5)
    args = parser.parse_args()

    powermetrics_path = FINDINGS_DIR / "H1-powermetrics-output.txt"
    top_path = FINDINGS_DIR / "H1-top-snapshots.txt"
    powermetrics_proc = start_powermetrics(powermetrics_path)
    top_sampler = TopSampler(top_path)
    top_sampler.start()

    rows = []
    profile_data = {}
    try:
        profiling_prefix = str(PROFILES_DIR / "ort-coreml")
        profiled = benchmark_onnx_calls(
            label="profile-CPUAndNeuralEngine",
            options=provider_options(compute_units="CPUAndNeuralEngine"),
            iterations=100,
            warmup=0,
            batch_size=1,
            enable_profiling=True,
            profile_prefix=profiling_prefix,
        )
        rows.append(profiled)
        profile_data = profile_provider_counts(profiled.get("profile_path"))

        for units in ["CPUOnly", "CPUAndGPU", "CPUAndNeuralEngine", "All"]:
            label = f"compute-{units}"
            try:
                rows.append(
                    benchmark_onnx_calls(
                        label=label,
                        options=provider_options(compute_units=units),
                        iterations=args.iterations,
                        warmup=args.warmup,
                        batch_size=1,
                    )
                )
            except Exception as exc:  # noqa: BLE001 - diagnostic script
                rows.append(
                    {
                        "label": label,
                        "backend": "onnx",
                        "ep": "ERROR",
                        "ml_compute_units": units,
                        "model_format": "MLProgram",
                        "static_shapes": "0",
                        "batch_size": 1,
                        "iterations": args.iterations,
                        "warmup_excluded": args.warmup,
                        "latencies_ms": [],
                        "error": f"{type(exc).__name__}: {exc}",
                    }
                )
    finally:
        top_sampler.stop()
        power_status = finish_powermetrics(powermetrics_proc)

    write_raw_latency_csv(SCRIPTS_DIR / "raw-timings-H1.csv", rows)
    write_summary_csv(SCRIPTS_DIR / "summary-H1.csv", rows)
    (FINDINGS_DIR / "H1-profile-summary.json").write_text(json.dumps(profile_data, indent=2, sort_keys=True) + "\n")

    provider_counts = profile_data.get("provider_counts", {})
    cpu_events = provider_counts.get("CPUExecutionProvider", 0)
    coreml_events = provider_counts.get("CoreMLExecutionProvider", 0)
    compute_rows = [row for row in rows if str(row.get("label", "")).startswith("compute-")]
    best = min(
        [row for row in compute_rows if row.get("latencies_ms")],
        key=lambda row: row.get("p50_ms", float("inf")),
        default=None,
    )
    verdict = "INCONCLUSIVE"
    if cpu_events > 0 and coreml_events == 0:
        verdict = "CONFIRMED"
    elif best and best.get("ml_compute_units") == "CPUOnly":
        verdict = "CONFIRMED"
    elif coreml_events > 0:
        verdict = "REFUTED"

    lines = [
        "# H1 - Neural Engine Use",
        "",
        f"Verdict: {verdict}",
        "",
        "The profiling run used CoreML EP with `CPUAndNeuralEngine` for 100 encode calls. "
        "The compute-unit sweep measured `CPUOnly`, `CPUAndGPU`, `CPUAndNeuralEngine`, and `All` "
        f"with {args.iterations} measured iterations after {args.warmup} warmups.",
        "",
        "## Profile Summary",
        "",
        f"- Profile path: `{profile_data.get('profile_path', '')}`",
        f"- Provider event counts: `{json.dumps(provider_counts, sort_keys=True)}`",
        f"- Compile/init event names: `{json.dumps(profile_data.get('compile_or_initialize_names', []))}`",
        f"- Kernel/name sample: `{json.dumps(profile_data.get('kernel_name_sample', []))}`",
        "",
        "## Compute Unit Results",
        "",
        "| MLComputeUnits | EP | p50 ms | p95 ms | p99 ms | Mean ms | Error |",
        "|---|---:|---:|---:|---:|---:|---|",
    ]
    for row in compute_rows:
        lines.append(
            f"| {row.get('ml_compute_units')} | {row.get('ep')} | "
            f"{float(row.get('p50_ms', 0.0)):.3f} | {float(row.get('p95_ms', 0.0)):.3f} | "
            f"{float(row.get('p99_ms', 0.0)):.3f} | {float(row.get('mean_ms', 0.0)):.3f} | "
            f"{row.get('error', '')} |"
        )
    lines.extend(
        [
            "",
            "## Power / Process Evidence",
            "",
            f"- `sudo -n powermetrics --samplers ane_power,gpu_power,cpu_power -i 500 -n 30`: `{power_status}`",
            f"- Raw powermetrics capture: `{powermetrics_path.relative_to(SCRIPTS_DIR.parent)}`",
            f"- Raw `top` snapshots: `{top_path.relative_to(SCRIPTS_DIR.parent)}`",
            "",
            "Interpretation: if powermetrics is unavailable or lacks sudo, the profile provider counts "
            "and compute-unit sweep are the primary evidence.",
        ]
    )
    write_markdown(FINDINGS_DIR / "H1-neural-engine.md", "\n".join(lines))
    print_rows(rows)


if __name__ == "__main__":
    main()
