#!/usr/bin/env python3
"""Check whether static padding speeds preserve embedding parity."""

from __future__ import annotations

import json

import numpy as np

from common import (
    FINDINGS_DIR,
    SCRIPTS_DIR,
    encode_texts,
    load_tokenizer,
    make_session,
    provider_options,
    representative_chunks,
    write_markdown,
    write_summary_csv,
)


def main() -> None:
    from sentence_transformers import SentenceTransformer

    chunks = representative_chunks()
    sbert = SentenceTransformer(
        "google/embeddinggemma-300m",
        trust_remote_code=True,
        local_files_only=True,
    )
    baseline = sbert.encode(
        chunks,
        convert_to_numpy=True,
        normalize_embeddings=True,
        show_progress_bar=False,
    ).astype(np.float32)

    tokenizer = load_tokenizer()
    rows = []
    for max_length in [128, 512, 2048]:
        static_shapes = "1" if max_length in {128, 512} else "0"
        fixed_padding = max_length in {128, 512}
        session = make_session(
            provider_options(
                compute_units="CPUAndNeuralEngine",
                static_shapes=static_shapes,
            )
        )
        candidate = encode_texts(
            tokenizer,
            session,
            chunks,
            batch_size=1,
            max_length=max_length,
            fixed_padding=fixed_padding,
        )
        cosines = np.sum(baseline * candidate, axis=1)
        rows.append(
            {
                "label": f"static-parity-max{max_length}",
                "backend": "onnx",
                "ep": session.get_providers()[0] if session.get_providers() else "UNKNOWN",
                "ml_compute_units": "CPUAndNeuralEngine",
                "model_format": "MLProgram",
                "static_shapes": static_shapes,
                "batch_size": 1,
                "max_length": max_length,
                "fixed_padding": fixed_padding,
                "samples": len(chunks),
                "mean_cosine": float(np.mean(cosines)),
                "min_cosine": float(np.min(cosines)),
                "p05_cosine": float(np.percentile(cosines, 5)),
            }
        )

    write_summary_csv(SCRIPTS_DIR / "summary-static-parity.csv", rows)
    lines = [
        "# Static Padding Parity Check",
        "",
        "This supporting check compares static-padding candidates against "
        "`SentenceTransformer(\"google/embeddinggemma-300m\")` on the same 50 chunks.",
        "",
        "| Max length | Static flag | Fixed padding | Mean cosine | Min cosine | p05 cosine |",
        "|---:|---:|---:|---:|---:|---:|",
    ]
    for row in rows:
        lines.append(
            f"| {row['max_length']} | {row['static_shapes']} | {row['fixed_padding']} | "
            f"{row['mean_cosine']:.9f} | {row['min_cosine']:.9f} | {row['p05_cosine']:.9f} |"
        )
    lines.append("")
    lines.append(
        "Interpretation: max_length=128 is only viable if truncation still meets the existing "
        "mean >= 0.995 and min >= 0.99 parity bar."
    )
    write_markdown(FINDINGS_DIR / "static-padding-parity.md", "\n".join(lines))
    print(json.dumps(rows, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
