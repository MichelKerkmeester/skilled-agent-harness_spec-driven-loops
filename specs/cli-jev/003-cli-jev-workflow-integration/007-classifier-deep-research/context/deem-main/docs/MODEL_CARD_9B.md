---
library_name: deem
license: apache-2.0
base_model: Qwen/Qwen3.5-9B-Base
tags:
- decision-model
- system-one
- routing
- classification
- calibrated
datasets: []
metrics:
- jevbench_public_hard
- macro_accuracy
---

# Deem 9B (v1)

**The strongest open decision model we know of.** Deem 9B reads your
state — a policy, contract, ticket, or question — and returns a
**typed, calibrated decision**: choice (2–255 options), score
(ordinal rubric), or yes/no with abstention. One forward pass, ~100ms
P50 on a low-power edge GPU.

## Benchmarks

| JevBench public (hard) | Score |
|---|---|
| Jev (closed, category leader) | 74.1 |
| **Deem 9B (full suite, 231/231)** | **65.8** |
| reflex-4B (open frontier) | 63.2 |

- **JevBench public:** easy 100.0 · original 91.7 · hard 65.8
  (composite, one checkpoint). Extended-reasoning mode: 68.9 hard.
- **Long-state native:** 3,200+ token policies decided in under a
  second (P50 788ms). Encoder routers cannot serve this regime.
- **Calibrated:** temperatures shipped, measured ECE, native
  abstention.
- **Adaptive compute:** 58% of items resolve in a single pass; a
  confidence-gated reasoning mode lifts hard-tier accuracy +7 points
  when you need it.

## Usage

```python
# DEEM_CHECKPOINT=LibertAIDAI/deem-9b-v1 python serve/deem_server.py
curl -s localhost:8300/v1/systemone -d '{
  "state": "Policy: refunds within 30 days require a receipt...",
  "questions": {"refund": {
    "type": "noul",
    "instructions": "Is the customer entitled to a full refund?"}}}'
```

Full stack in the [deem repo](https://github.com/Libertai/deem):
Python serving stack, Rust CPU runtime for the 0.8B sibling, and the
complete Tare benchmark harness.

## How it's built

Qwen3.5-9B-Base, LoRA merged, letter-slot readout — decisions are read
from a slot in a single prefill pass, no decode phase. Every training
domain ground-truth verified: generator-built states with labels by
construction, including GenRM-style verification traces (judge-hard
9/17 → 16/17 after one training cycle). Apache-2.0 recipe, start to
finish.

## Model card for the 0.8B sibling

See [`LibertAIDAI/deem-0.8-v1`](https://huggingface.co/LibertAIDAI/deem-0.8-v1)
— the same decision stack, CPU-native (362ms short-form, 0.9GB
resident).

## License

Apache-2.0. Measured on JevBench public (231 items) — never trained
on. All benchmarks reproducible from the release artifacts.
