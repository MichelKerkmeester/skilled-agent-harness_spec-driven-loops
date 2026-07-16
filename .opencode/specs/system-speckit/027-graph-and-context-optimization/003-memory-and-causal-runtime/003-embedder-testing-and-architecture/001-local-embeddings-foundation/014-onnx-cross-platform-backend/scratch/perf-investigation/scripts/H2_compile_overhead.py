#!/usr/bin/env python3
"""H2: check whether per-call graph compilation explains slow latency."""

from __future__ import annotations

import json
import time

from common import (
    FINDINGS_DIR,
    PROFILES_DIR,
    SCRIPTS_DIR,
    encode_texts,
    load_tokenizer,
    make_session,
    print_rows,
    profile_provider_counts,
    provider_options,
    representative_chunks,
    summarize,
    write_markdown,
    write_raw_latency_csv,
    write_summary_csv,
)


def main() -> None:
    chunks = representative_chunks()
    tokenizer = load_tokenizer()
    session = make_session(
        provider_options(compute_units="CPUAndNeuralEngine"),
        enable_profiling=True,
        profile_prefix=str(PROFILES_DIR / "ort-coreml-h2"),
    )
    latencies = []
    for idx in range(10):
        started = time.perf_counter()
        encode_texts(tokenizer, session, [chunks[idx % len(chunks)]], batch_size=1)
        latencies.append((time.perf_counter() - started) * 1000.0)
    profile_path = session.end_profiling()
    profile_data = profile_provider_counts(profile_path)

    row = {
        "label": "ten-separate-encode-calls",
        "backend": "onnx",
        "ep": session.get_providers()[0] if session.get_providers() else "UNKNOWN",
        "ml_compute_units": "CPUAndNeuralEngine",
        "model_format": "MLProgram",
        "static_shapes": "0",
        "batch_size": 1,
        "iterations": 10,
        "warmup_excluded": 0,
        "latencies_ms": latencies,
        "profile_path": profile_path,
        **summarize(latencies),
    }
    write_raw_latency_csv(SCRIPTS_DIR / "raw-timings-H2.csv", [row])
    write_summary_csv(SCRIPTS_DIR / "summary-H2.csv", [row])
    (FINDINGS_DIR / "H2-profile-summary.json").write_text(json.dumps(profile_data, indent=2, sort_keys=True) + "\n")

    first = latencies[0]
    tail_mean = sum(latencies[1:]) / max(1, len(latencies) - 1)
    ratio = first / tail_mean if tail_mean else 0.0
    compile_names = profile_data.get("compile_or_initialize_names", [])
    verdict = "CONFIRMED" if ratio >= 5.0 or compile_names else "REFUTED"

    lines = [
        "# H2 - Per-call Graph Compilation Overhead",
        "",
        f"Verdict: {verdict}",
        "",
        f"Call 1 latency was {first:.3f} ms. Calls 2-10 averaged {tail_mean:.3f} ms, "
        f"so the first-call ratio was {ratio:.2f}x.",
        "",
        "| Call | Latency ms |",
        "|---:|---:|",
    ]
    for idx, value in enumerate(latencies, start=1):
        lines.append(f"| {idx} | {value:.3f} |")
    lines.extend(
        [
            "",
            "## Profile Evidence",
            "",
            f"- Profile path: `{profile_path}`",
            f"- Provider event counts: `{json.dumps(profile_data.get('provider_counts', {}), sort_keys=True)}`",
            f"- Compile/init event names: `{json.dumps(compile_names)}`",
            "",
            "Interpretation: first-call-only slowness would point to compilation. Uniform slowness after "
            "the first call points elsewhere.",
        ]
    )
    write_markdown(FINDINGS_DIR / "H2-compile-overhead.md", "\n".join(lines))
    print_rows([row])


if __name__ == "__main__":
    main()
