#!/usr/bin/env python3
"""Shared benchmark helpers for the 014/014 ONNX CoreML investigation."""

from __future__ import annotations

import csv
import json
import os
import statistics
import subprocess
import sys
import threading
import time
from pathlib import Path
from typing import Any, Iterable

import numpy as np

MODEL_ID = "onnx-community/embeddinggemma-300m-ONNX"
SBERT_MODEL_ID = "google/embeddinggemma-300m"
ONNX_DTYPE = "fp32"
DEFAULT_ITERATIONS = 100
DEFAULT_WARMUP = 5

_DTYPE_FILES = {
    "fp32": "model.onnx",
    "q8": "model_quantized.onnx",
    "q4": "model_q4.onnx",
    "q4f16": "model_q4f16.onnx",
}


def repo_root() -> Path:
    path = Path(__file__).resolve()
    for parent in path.parents:
        if (parent / ".opencode").is_dir():
            return parent
    raise RuntimeError("Could not locate repo root from script path")


REPO_ROOT = repo_root()
PACKET_DIR = (
    REPO_ROOT
    / ".opencode/specs/system-spec-kit/026-graph-and-context-optimization"
    / "014-local-embeddings-setup-a/014-onnx-cross-platform-backend"
)
INVESTIGATION_DIR = PACKET_DIR / "scratch/perf-investigation"
SCRIPTS_DIR = INVESTIGATION_DIR / "scripts"
FINDINGS_DIR = INVESTIGATION_DIR / "findings"
PROFILES_DIR = INVESTIGATION_DIR / "profiles"


def ensure_dirs() -> None:
    SCRIPTS_DIR.mkdir(parents=True, exist_ok=True)
    FINDINGS_DIR.mkdir(parents=True, exist_ok=True)
    PROFILES_DIR.mkdir(parents=True, exist_ok=True)


def representative_chunks(limit: int = 50) -> list[str]:
    roots = [
        REPO_ROOT / ".opencode/skills/system-spec-kit/shared/embeddings",
        REPO_ROOT / ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code",
    ]
    chunks: list[str] = []
    for root in roots:
        for path in sorted(root.rglob("*")):
            if len(chunks) >= limit:
                return chunks
            if not path.is_file() or path.suffix not in {".py", ".ts", ".js"}:
                continue
            try:
                text = path.read_text()
            except UnicodeDecodeError:
                continue
            text = " ".join(text.split())
            if not text:
                continue
            for start in range(0, len(text), 1200):
                chunk = text[start : start + 1200]
                if chunk:
                    chunks.append(chunk)
                if len(chunks) >= limit:
                    return chunks
    return chunks


def percentile(values: list[float], pct: float) -> float:
    if not values:
        return 0.0
    ordered = sorted(values)
    index = min(len(ordered) - 1, max(0, round((pct / 100.0) * (len(ordered) - 1))))
    return ordered[index]


def summarize(values: list[float]) -> dict[str, float]:
    return {
        "mean_ms": statistics.fmean(values) if values else 0.0,
        "p50_ms": percentile(values, 50),
        "p95_ms": percentile(values, 95),
        "p99_ms": percentile(values, 99),
    }


def model_path(dtype: str = ONNX_DTYPE) -> str:
    from huggingface_hub import hf_hub_download

    return hf_hub_download(
        MODEL_ID,
        subfolder="onnx",
        filename=_DTYPE_FILES[dtype],
        local_files_only=True,
    )


def provider_options(
    *,
    compute_units: str = "CPUAndNeuralEngine",
    model_format: str = "MLProgram",
    static_shapes: str = "0",
    enable_on_subgraphs: str = "0",
) -> dict[str, str]:
    return {
        "ModelFormat": model_format,
        "MLComputeUnits": compute_units,
        "RequireStaticInputShapes": static_shapes,
        "EnableOnSubgraphs": enable_on_subgraphs,
    }


def load_tokenizer(*, use_fast: bool | None = None) -> Any:
    from transformers import AutoTokenizer

    kwargs: dict[str, Any] = {"local_files_only": True}
    if use_fast is not None:
        kwargs["use_fast"] = use_fast
    return AutoTokenizer.from_pretrained(MODEL_ID, **kwargs)


def make_session(
    options: dict[str, str],
    *,
    enable_profiling: bool = False,
    profile_prefix: str | None = None,
) -> Any:
    import onnxruntime as ort

    session_options = ort.SessionOptions()
    if enable_profiling:
        session_options.enable_profiling = True
        if profile_prefix:
            session_options.profile_file_prefix = profile_prefix
    return ort.InferenceSession(
        model_path(),
        sess_options=session_options,
        providers=[("CoreMLExecutionProvider", options), ("CPUExecutionProvider", {})],
    )


def session_metadata(session: Any) -> dict[str, Any]:
    return {
        "active_providers": session.get_providers(),
        "inputs": [
            {"name": inp.name, "shape": list(inp.shape), "type": inp.type}
            for inp in session.get_inputs()
        ],
        "outputs": [
            {"name": out.name, "shape": list(out.shape), "type": out.type}
            for out in session.get_outputs()
        ],
    }


def _mean_pool(last_hidden_state: np.ndarray, attention_mask: np.ndarray) -> np.ndarray:
    mask = attention_mask.astype(np.float32)[:, :, None]
    summed = (last_hidden_state.astype(np.float32) * mask).sum(axis=1)
    counts = mask.sum(axis=1).clip(min=1e-9)
    return summed / counts


def _l2_normalize(embeddings: np.ndarray) -> np.ndarray:
    norms = np.linalg.norm(embeddings, axis=1, keepdims=True).clip(min=1e-12)
    return (embeddings / norms).astype(np.float32, copy=False)


def tokenize(
    tokenizer: Any,
    texts: list[str],
    *,
    max_length: int,
    fixed_padding: bool,
) -> Any:
    return tokenizer(
        texts,
        padding="max_length" if fixed_padding else True,
        truncation=True,
        max_length=max_length,
        return_tensors="np",
    )


def encode_texts(
    tokenizer: Any,
    session: Any,
    texts: list[str],
    *,
    batch_size: int,
    max_length: int = 2048,
    fixed_padding: bool = False,
    normalize: bool = True,
) -> np.ndarray:
    input_names = {inp.name for inp in session.get_inputs()}
    output_names = [out.name for out in session.get_outputs()]
    outputs: list[np.ndarray] = []

    for start in range(0, len(texts), batch_size):
        batch = texts[start : start + batch_size]
        tokens = tokenize(tokenizer, batch, max_length=max_length, fixed_padding=fixed_padding)
        inputs = {
            name: np.asarray(value, dtype=np.int64)
            for name, value in tokens.data.items()
            if name in input_names
        }
        if "input_ids" not in inputs or "attention_mask" not in inputs:
            raise RuntimeError("ONNX model requires input_ids and attention_mask inputs")

        result = session.run(None, inputs)
        if "sentence_embedding" in output_names:
            pooled = np.asarray(result[output_names.index("sentence_embedding")], dtype=np.float32)
        else:
            pooled = _mean_pool(np.asarray(result[0], dtype=np.float32), inputs["attention_mask"])
        outputs.append(_l2_normalize(pooled) if normalize else pooled.astype(np.float32))

    return np.vstack(outputs).astype(np.float32, copy=False)


def benchmark_onnx_calls(
    *,
    label: str,
    options: dict[str, str],
    iterations: int = DEFAULT_ITERATIONS,
    warmup: int = DEFAULT_WARMUP,
    batch_size: int = 1,
    max_length: int = 2048,
    fixed_padding: bool = False,
    use_fast: bool | None = None,
    enable_profiling: bool = False,
    profile_prefix: str | None = None,
) -> dict[str, Any]:
    chunks = representative_chunks()
    tokenizer = load_tokenizer(use_fast=use_fast)
    session = make_session(options, enable_profiling=enable_profiling, profile_prefix=profile_prefix)

    for idx in range(warmup):
        batch = [chunks[(idx + offset) % len(chunks)] for offset in range(batch_size)]
        encode_texts(
            tokenizer,
            session,
            batch,
            batch_size=batch_size,
            max_length=max_length,
            fixed_padding=fixed_padding,
        )

    latencies: list[float] = []
    for idx in range(iterations):
        batch = [chunks[(idx + offset) % len(chunks)] for offset in range(batch_size)]
        started = time.perf_counter()
        encode_texts(
            tokenizer,
            session,
            batch,
            batch_size=batch_size,
            max_length=max_length,
            fixed_padding=fixed_padding,
        )
        latencies.append((time.perf_counter() - started) * 1000.0)

    profile_path = session.end_profiling() if enable_profiling else None
    summary = summarize(latencies)
    per_item = [value / batch_size for value in latencies]
    return {
        "label": label,
        "backend": "onnx",
        "ep": session.get_providers()[0] if session.get_providers() else "UNKNOWN",
        "ml_compute_units": options.get("MLComputeUnits", ""),
        "model_format": options.get("ModelFormat", ""),
        "static_shapes": options.get("RequireStaticInputShapes", ""),
        "batch_size": batch_size,
        "max_length": max_length,
        "fixed_padding": fixed_padding,
        "use_fast_tokenizer": use_fast,
        "iterations": iterations,
        "warmup_excluded": warmup,
        "latencies_ms": latencies,
        "per_item_summary": summarize(per_item),
        "profile_path": profile_path,
        "session_metadata": session_metadata(session),
        **summary,
    }


def benchmark_sbert_calls(
    *,
    label: str,
    iterations: int = DEFAULT_ITERATIONS,
    warmup: int = DEFAULT_WARMUP,
    batch_size: int = 1,
) -> dict[str, Any]:
    from sentence_transformers import SentenceTransformer

    chunks = representative_chunks()
    model = SentenceTransformer(SBERT_MODEL_ID, trust_remote_code=True, local_files_only=True)
    device = str(getattr(model, "device", "auto"))

    for idx in range(warmup):
        batch = [chunks[(idx + offset) % len(chunks)] for offset in range(batch_size)]
        model.encode(batch, convert_to_numpy=True, normalize_embeddings=True, show_progress_bar=False)

    latencies: list[float] = []
    for idx in range(iterations):
        batch = [chunks[(idx + offset) % len(chunks)] for offset in range(batch_size)]
        started = time.perf_counter()
        model.encode(batch, convert_to_numpy=True, normalize_embeddings=True, show_progress_bar=False)
        latencies.append((time.perf_counter() - started) * 1000.0)

    per_item = [value / batch_size for value in latencies]
    return {
        "label": label,
        "backend": "sbert",
        "ep": device,
        "ml_compute_units": "",
        "model_format": "",
        "static_shapes": "",
        "batch_size": batch_size,
        "max_length": "",
        "fixed_padding": "",
        "use_fast_tokenizer": "",
        "iterations": iterations,
        "warmup_excluded": warmup,
        "latencies_ms": latencies,
        "per_item_summary": summarize(per_item),
        **summarize(latencies),
    }


def csv_safe_row(row: dict[str, Any]) -> dict[str, Any]:
    excluded = {"latencies_ms", "session_metadata"}
    return {
        key: json.dumps(value, sort_keys=True) if isinstance(value, (dict, list)) else value
        for key, value in row.items()
        if key not in excluded
    }


def write_summary_csv(path: Path, rows: Iterable[dict[str, Any]]) -> None:
    ensure_dirs()
    serializable = [csv_safe_row(row) for row in rows]
    if not serializable:
        return
    keys: list[str] = []
    for row in serializable:
        for key in row:
            if key not in keys:
                keys.append(key)
    with path.open("w", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=keys)
        writer.writeheader()
        writer.writerows(serializable)


def write_raw_latency_csv(path: Path, rows: Iterable[dict[str, Any]]) -> None:
    ensure_dirs()
    with path.open("w", newline="") as fh:
        writer = csv.DictWriter(
            fh,
            fieldnames=[
                "label",
                "backend",
                "ep",
                "ml_compute_units",
                "model_format",
                "static_shapes",
                "batch_size",
                "iteration",
                "latency_ms",
                "per_item_latency_ms",
            ],
        )
        writer.writeheader()
        for row in rows:
            batch_size = int(row.get("batch_size") or 1)
            for idx, latency in enumerate(row.get("latencies_ms", [])):
                writer.writerow(
                    {
                        "label": row.get("label", ""),
                        "backend": row.get("backend", ""),
                        "ep": row.get("ep", ""),
                        "ml_compute_units": row.get("ml_compute_units", ""),
                        "model_format": row.get("model_format", ""),
                        "static_shapes": row.get("static_shapes", ""),
                        "batch_size": batch_size,
                        "iteration": idx,
                        "latency_ms": latency,
                        "per_item_latency_ms": latency / batch_size,
                    }
                )


def print_rows(rows: list[dict[str, Any]]) -> None:
    for row in rows:
        print(
            json.dumps(
                {
                    key: row.get(key)
                    for key in [
                        "label",
                        "backend",
                        "ep",
                        "ml_compute_units",
                        "model_format",
                        "static_shapes",
                        "batch_size",
                        "mean_ms",
                        "p50_ms",
                        "p95_ms",
                        "p99_ms",
                        "profile_path",
                        "error",
                    ]
                    if key in row
                },
                sort_keys=True,
            )
        )


def profile_provider_counts(profile_path: str | None) -> dict[str, Any]:
    if not profile_path:
        return {}
    path = Path(profile_path)
    if not path.exists():
        return {"profile_error": f"profile not found: {profile_path}"}
    try:
        events = json.loads(path.read_text())
    except json.JSONDecodeError as exc:
        return {"profile_error": f"invalid json: {exc}"}

    provider_counts: dict[str, int] = {}
    name_counts: dict[str, int] = {}
    compile_or_init: list[str] = []
    kernel_names: list[str] = []
    for event in events:
        name = str(event.get("name", ""))
        args = event.get("args") or {}
        provider = str(args.get("provider", ""))
        if provider:
            provider_counts[provider] = provider_counts.get(provider, 0) + 1
        if name:
            name_counts[name] = name_counts.get(name, 0) + 1
            if len(kernel_names) < 40 and ("kernel" in name.lower() or provider):
                kernel_names.append(name)
            lowered = name.lower()
            if "compile" in lowered or "initialize" in lowered or "init" in lowered:
                compile_or_init.append(name)

    return {
        "profile_path": str(path),
        "event_count": len(events),
        "provider_counts": provider_counts,
        "top_names": sorted(name_counts.items(), key=lambda item: item[1], reverse=True)[:20],
        "kernel_name_sample": kernel_names[:40],
        "compile_or_initialize_names": sorted(set(compile_or_init))[:50],
    }


def start_powermetrics(output_path: Path) -> subprocess.Popen[str] | None:
    if sys.platform != "darwin":
        output_path.write_text("powermetrics skipped: not darwin\n")
        return None
    cmd = [
        "sudo",
        "-n",
        "powermetrics",
        "--samplers",
        "ane_power,gpu_power,cpu_power",
        "-i",
        "500",
        "-n",
        "30",
    ]
    fh = output_path.open("w")
    try:
        proc = subprocess.Popen(cmd, stdout=fh, stderr=subprocess.STDOUT, text=True)
    except FileNotFoundError:
        fh.write("powermetrics unavailable\n")
        fh.close()
        return None
    proc._codex_output_fh = fh  # type: ignore[attr-defined]
    return proc


def finish_powermetrics(proc: subprocess.Popen[str] | None) -> str:
    if proc is None:
        return "not-started"
    try:
        proc.communicate(timeout=3)
    except subprocess.TimeoutExpired:
        proc.terminate()
        proc.communicate(timeout=3)
    fh = getattr(proc, "_codex_output_fh", None)
    if fh is not None:
        fh.close()
    return f"exit={proc.returncode}"


class TopSampler:
    def __init__(self, output_path: Path, *, interval_seconds: float = 0.5) -> None:
        self.output_path = output_path
        self.interval_seconds = interval_seconds
        self._stop = threading.Event()
        self._thread = threading.Thread(target=self._run, daemon=True)

    def start(self) -> None:
        self._thread.start()

    def stop(self) -> None:
        self._stop.set()
        self._thread.join(timeout=5)

    def _run(self) -> None:
        with self.output_path.open("w") as fh:
            fh.write(f"pid={os.getpid()}\n")
            while not self._stop.is_set():
                if sys.platform == "darwin":
                    cmd = ["top", "-l", "1", "-pid", str(os.getpid()), "-stats", "pid,cpu,command"]
                else:
                    cmd = ["ps", "-o", "pid,pcpu,comm", "-p", str(os.getpid())]
                try:
                    result = subprocess.run(cmd, text=True, capture_output=True, timeout=5)
                    fh.write(result.stdout)
                    if result.stderr:
                        fh.write(result.stderr)
                    fh.write("\n---\n")
                    fh.flush()
                except Exception as exc:  # noqa: BLE001 - diagnostic best effort
                    fh.write(f"top sampler error: {type(exc).__name__}: {exc}\n")
                    fh.flush()
                self._stop.wait(self.interval_seconds)


def write_markdown(path: Path, content: str) -> None:
    ensure_dirs()
    path.write_text(content.rstrip() + "\n")
