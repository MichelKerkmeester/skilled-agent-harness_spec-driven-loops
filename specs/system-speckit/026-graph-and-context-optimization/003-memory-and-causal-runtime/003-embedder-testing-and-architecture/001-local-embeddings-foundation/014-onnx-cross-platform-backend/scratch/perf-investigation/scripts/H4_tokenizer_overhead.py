#!/usr/bin/env python3
"""H4: measure tokenizer overhead at batch=1 and compare fast vs slow tokenizers."""

from __future__ import annotations

import argparse
import time

from common import (
    FINDINGS_DIR,
    SCRIPTS_DIR,
    benchmark_onnx_calls,
    load_tokenizer,
    print_rows,
    provider_options,
    representative_chunks,
    summarize,
    tokenize,
    write_markdown,
    write_raw_latency_csv,
    write_summary_csv,
)


def tokenizer_bench(*, use_fast: bool, iterations: int) -> dict[str, object]:
    chunks = representative_chunks()
    tokenizer = load_tokenizer(use_fast=use_fast)
    latencies = []
    for idx in range(iterations):
        text = chunks[idx % len(chunks)]
        started = time.perf_counter()
        tokenize(tokenizer, [text], max_length=2048, fixed_padding=False)
        latencies.append((time.perf_counter() - started) * 1000.0)
    return {
        "label": f"tokenizer-use_fast-{use_fast}",
        "backend": "tokenizer",
        "ep": "",
        "ml_compute_units": "",
        "model_format": "",
        "static_shapes": "",
        "batch_size": 1,
        "iterations": iterations,
        "warmup_excluded": 0,
        "latencies_ms": latencies,
        "use_fast_tokenizer": use_fast,
        **summarize(latencies),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--tokenizer-iterations", type=int, default=1000)
    parser.add_argument("--total-iterations", type=int, default=100)
    parser.add_argument("--warmup", type=int, default=5)
    args = parser.parse_args()

    tokenizer_rows = [
        tokenizer_bench(use_fast=True, iterations=args.tokenizer_iterations),
        tokenizer_bench(use_fast=False, iterations=args.tokenizer_iterations),
    ]
    total_rows = []
    for use_fast in [None, True, False]:
        label = f"total-use_fast-{use_fast}"
        total_rows.append(
            benchmark_onnx_calls(
                label=label,
                options=provider_options(compute_units="CPUAndNeuralEngine"),
                iterations=args.total_iterations,
                warmup=args.warmup,
                batch_size=1,
                use_fast=use_fast,
            )
        )

    rows = tokenizer_rows + total_rows
    write_raw_latency_csv(SCRIPTS_DIR / "raw-timings-H4.csv", rows)
    write_summary_csv(SCRIPTS_DIR / "summary-H4.csv", rows)
    fast_tokenizer = tokenizer_rows[0]
    default_total = total_rows[0]
    share = fast_tokenizer["p50_ms"] / default_total["p50_ms"] if default_total["p50_ms"] else 0.0
    fast_vs_slow = tokenizer_rows[1]["p50_ms"] / fast_tokenizer["p50_ms"] if fast_tokenizer["p50_ms"] else 0.0
    verdict = "CONFIRMED" if share > 0.30 else "REFUTED"

    lines = [
        "# H4 - Tokenizer Overhead at Batch 1",
        "",
        f"Verdict: {verdict}",
        "",
        f"Fast-tokenizer p50 was {fast_tokenizer['p50_ms']:.3f} ms versus default end-to-end "
        f"ONNX p50 {default_total['p50_ms']:.3f} ms, or {share:.1%} of total.",
        f"Slow tokenizer p50 / fast tokenizer p50 ratio was {fast_vs_slow:.2f}x.",
        "",
        "| Row | use_fast | Backend | p50 ms | p95 ms | p99 ms | Mean ms |",
        "|---|---:|---|---:|---:|---:|---:|",
    ]
    for row in rows:
        lines.append(
            f"| {row.get('label')} | {row.get('use_fast_tokenizer')} | {row.get('backend')} | "
            f"{float(row.get('p50_ms', 0.0)):.3f} | {float(row.get('p95_ms', 0.0)):.3f} | "
            f"{float(row.get('p99_ms', 0.0)):.3f} | {float(row.get('mean_ms', 0.0)):.3f} |"
        )
    lines.append("")
    lines.append("Interpretation: tokenizer-bound means tokenizer time exceeds 30% of total encode latency.")
    write_markdown(FINDINGS_DIR / "H4-tokenizer-overhead.md", "\n".join(lines))
    print_rows(rows)


if __name__ == "__main__":
    main()
