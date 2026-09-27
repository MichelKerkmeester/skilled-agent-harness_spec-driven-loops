# Deem

**Typed, calibrated decisions from open weights.** Deem reads your
state — a policy, contract, ticket, or question — and returns a
structured decision: choice (2–255 options), score (ordinal rubric),
or yes/no with abstention. One forward pass. No streaming, no token
soup.

| Model | What it is | Latency |
|---|---|---|
| **Deem 9B** | The strongest open decision model we know of — JevBench public hard **65.8**, past the open frontier (reflex-4B 63.2) | ~100ms short-form P50 |
| **Deem 0.8B** | The full decision stack, CPU-native — policy hold-out **96.3%**, 0.9GB resident | 362ms on a busy desktop CPU |

Weights: [`LibertAIDAI/deem-9b-v1`](https://huggingface.co/LibertAIDAI/deem-9b-v1) ·
[`LibertAIDAI/deem-0.8-v1`](https://huggingface.co/LibertAIDAI/deem-0.8-v1)

## Quickstart (GPU, 9B)

```bash
pip install transformers torch   # or: pip install deem[torch]
git clone https://github.com/Libertai/deem && cd deem
DEEM_CHECKPOINT=LibertAIDAI/deem-9b-v1 \
DEEM_CALIBRATION=serve/calibration/calibration_v13.json \
python serve/deem_server.py
```

```bash
curl -s localhost:8300/v1/systemone -d '{
  "state": "The build is red on a Friday evening.",
  "questions": {"deploy": {
    "type": "choice",
    "instructions": "Deploy now or wait?",
    "options": ["deploy", "wait"]}}}'
```

```json
{"answers": {"deploy": {
  "type": "choice", "choice": "wait",
  "confidence": 0.82,
  "probabilities": {"deploy": 0.18, "wait": 0.82}}}}
```

Wire-compatible with the TypeSafe SDK shape (`/v1/systemone`).

## Quickstart (CPU, 0.8B)

```bash
cd rust && cargo build --release
DEEM_CHECKPOINT=LibertAIDAI/deem-0.8-v1 ./target/release/deem-server
```

Single static Rust binary. No Python, no C++ dependencies at runtime.
Hand-written AVX-512 kernels (bf16 + int8 lanes), parity-gated against
torch to a max letter-logit diff of 0.085.

## Adaptive compute

Deem 9B ships with a confidence-gated reasoning mode: 58% of items
resolve in a single forward pass; uncertain items get a
sampled-reasoning pass that lifts hard-tier accuracy by 7 points.
One checkpoint, tunable quality — from ~100ms single-pass to
extended-reasoning mode.

## What's in this repo

- `src/deem/` — the Deem format core (prompts, readout, primitives),
  stdlib-only
- `serve/` — the serving stack: stdlib HTTP server, MCP server,
  calibration files
- `rust/` — the CPU runtime: AVX-512 kernels, GDN chunk scan,
  `/v1/systemone` server, torch-parity tests
- `eval/tare/` — the Tare benchmark harness (flip rates, calibration,
  consistency probes)
- `assets/` — release cards and figures
- Model cards: [`deem-9b-v1`](docs/MODEL_CARD_9B.md) ·
  [`deem-0.8-v1`](docs/MODEL_CARD_08B.md)

## License

Apache-2.0. Qwen3.5 backbone (Apache-2.0). All benchmarks reproducible
from the release artifacts.

## Citation

```bibtex
@software{deem2026,
  title  = {Deem: Typed, Calibrated Decisions from Open Weights},
  author = {{LibertAI Labs}},
  year   = {2026},
  url    = {https://github.com/Libertai/deem},
  note   = {Deem 9B (deem-9b-v1) and Deem 0.8B (deem-0.8-v1)}
}
```
