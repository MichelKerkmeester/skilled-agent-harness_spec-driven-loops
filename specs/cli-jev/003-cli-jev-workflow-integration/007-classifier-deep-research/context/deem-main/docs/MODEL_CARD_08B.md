---
library_name: deem
license: apache-2.0
base_model: Qwen/Qwen3.5-0.8B
tags:
- decision-model
- cpu-inference
- rust
- edge
- routing
metrics:
- policy_holdout
- macro_accuracy
---

# Deem 0.8B (v1)

**Decisions, anywhere.** The full Deem decision stack on **CPU** —
typed, calibrated choices, scores, and yes/no decisions with
abstention, served by our own Rust runtime. No GPU required.

## Benchmarks

- **96.3%** long-policy hold-out accuracy (trap/adversarial items:
  91.8%)
- **362ms** short-form decisions on a busy desktop CPU
- **0.9GB** resident (int8 path; 1.6GB bf16-exact)
- Near-ceiling exact-law reasoning: counting 0.976, grid 0.984,
  zero-count 1.000

## The runtime

A single static Rust binary. No Python, no C++ dependencies at
runtime.

- Hand-written **AVX-512 kernels** — bf16 (`vdpbf16ps`) and int8
  (`vpdpbusd`) GEMM lanes, ~3.4 TFLOPs/s isolated int8
- **Parity-gated against torch:** max letter-logit diff 0.085
  (bf16 noise floor)
- **Wire-compatible `/v1/systemone`** — drop-in for the TypeSafe SDK

```bash
git clone https://github.com/Libertai/deem && cd deem/rust
cargo build --release
DEEM_CHECKPOINT=LibertAIDAI/deem-0.8-v1 ./target/release/deem-server
```

Runs where GPUs don't: CI runners, edge boxes, laptops, serverless
micro-VMs.

## How it's built

Qwen3.5-0.8B, full fine-tune on the Deem ground-truth-verified
mixture (124,765 rows: anchors + exact laws + policy + working-time +
verification traces). Apache-2.0 recipe.

## License

Apache-2.0. All benchmarks reproducible from the
[release artifacts](https://github.com/Libertai/deem).
