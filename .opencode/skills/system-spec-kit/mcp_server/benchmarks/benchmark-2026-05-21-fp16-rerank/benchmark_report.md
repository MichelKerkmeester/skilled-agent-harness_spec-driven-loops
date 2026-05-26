---
title: "spec-memory rerank A/B — Qwen on MPS+fp16 — 2026-05-21"
description: "Phase 009 A/B benchmark testing whether RERANK_TORCH_DTYPE=float16 lets Qwen3-Reranker-0.6B fit on Apple Silicon MPS at the production 50-doc batch shape. Smoke PASSED (50-doc rerank in 1.1s, no OOM). Full bench HOLD — under sustained spec-memory load with real-corpus docs, MPS OOMs return. The third orthogonal lever (after batch-cap and weight-dtype) fails. Conclusion: domain fine-tune is the only remaining unblock path."
trigger_phrases:
  - "fp16 mps qwen rerank ab"
  - "009 fp16 bench"
  - "rerank_torch_dtype float16 verdict"
importance_tier: "important"
contextType: "reference"
---

# spec-memory rerank A/B — Qwen on MPS+fp16 — 2026-05-21

Three orthogonal MPS unblock attempts tested. All three HOLD. This packet documents the third: cutting Qwen's weight memory in half via fp16, keeping the 50-doc batch shape.

**Verdict: HOLD.** All three decision gates fail. The MPS binding constraint is upstream of weight dtype.

---

## 1. OVERVIEW

Packet 007 showed Qwen3-Reranker-0.6B on MPS OOMs at the 50-doc batch shape (76 GiB MTLBuffer allocation request). Packet 008 ruled out batch size as the binding constraint (cap=10 still OOMs at 76 + 135 GiB). This packet tests the third orthogonal lever: cut the model's memory footprint via fp16 weights and keep the production batch shape.

Phase A smoke result was a breakthrough: fp16 + MPS on a synthetic 50-doc batch (lorem-ipsum content, ~400 chars each) returned 200 in 1.1 s with no OOM. Sidecar stayed alive.

Phase C bench under spec-memory's actual `memory_search` traffic: same OOM pattern as packets 007 and 008. The smoke setup didn't match the real load shape — production spec docs are 2-10x longer than the smoke's lorem ipsum, and the bench sustains 150 calls over 25 minutes.

---

## 2. AGGREGATE RESULTS

3 runs × 50 probes = 150 rows per arm. Sidecar started with `RERANK_DEVICE=mps RERANK_TORCH_DTYPE=float16`, warmed Qwen before Arm B.

| Arm | Config | Hits | Hit-rate | p50 (ms) | **p95 (ms)** | Sidecar reach | Verdict |
|---|---|---|---|---|---|---|---|
| A | sidecar OFF | 54 / 150 | 0.360 | 677 | **1,112** | n/a | baseline |
| B | Qwen-MPS-fp16 | 52 / 150 | 0.347 | 874 | **10,900** | 15.3 % (23/150) | crashed mid-run |
| **Δ (B − A)** |  | **−2** | **−0.013** | **+197** | **+9,788** | — | |

Decision gates:

| Gate | Threshold | Observed | Pass |
|---|---|---|---|
| Hit-rate Δ | ≥ +0.02 | −0.013 | ❌ |
| p95 Δ | ≤ +500 ms | +9,788 ms | ❌ |
| Sidecar reach | ≥ 0.95 | 0.153 | ❌ |

**Verdict: HOLD.**

---

## 3. METHODOLOGY

- **Sidecar source change**: `scripts/rerank_sidecar.py:_load_model` now reads `RERANK_TORCH_DTYPE` and passes `model_kwargs={"torch_dtype": torch.float16}` (or `bfloat16`) to `CrossEncoder` when set.
- **start.sh**: added `RERANK_TORCH_DTYPE` to the env allowlist.
- **Phase A smoke (synthetic)**: 1 `/rerank` call, 50 docs × ~400 chars of lorem ipsum, `model: Qwen/Qwen3-Reranker-0.6B`. Returned 200 in 1122 ms; sidecar alive.
- **Phase C bench (production load)**: same 50-probe fixture as packets 004/007/008. The harness's MCP child spawns `memory_search` calls; Stage 3 fusion sends up to 50 candidate docs from the live spec-memory `memory_index` (real-world spec docs, 1-10 KB each).
- **Bench env**: `RERANK_DEVICE=mps RERANK_TORCH_DTYPE=float16` exported in the bench shell; propagated to the MCP child via `os.environ.copy()`; propagated to the sidecar spawned by `ensure-rerank-sidecar.cjs` via `processObj.env` pass-through.

---

## 4. WHY THE SMOKE SUCCEEDED BUT THE BENCH FAILED

The smoke and bench differ in three load dimensions:

1. **Sequence length per doc**: smoke ~400 chars (`~100 tokens`); bench documents are real spec-kit markdown averaging 1-3 KB (~300-800 tokens). Attention buffer scales as `(B × L)²`, so 4-8x longer sequences = 16-64x larger attention buffers.
2. **Sustained call count**: smoke = 1 call; bench = 150 calls over ~25 min. MPS may accumulate non-trivially-released buffers across calls.
3. **Diversity of content**: lorem ipsum has compressible token entropy; real spec docs span more vocabulary, more positional indices, more attention paths.

Combined, the bench triggers MPS allocation patterns the smoke doesn't exercise. Empirically:

- Smoke allocation request: implicit, fit comfortably under 88 GiB.
- Bench allocation requests (per uvicorn log): 17.81 GiB AND 35.60 GiB AND 76 GiB AND 135 GiB — all exceeded the 88 GiB ceiling at some point.

The 35.60 GiB allocation is NEW in this packet (packets 007 + 008 hit 76 + 135 only). Possibly the fp16 codepath uses a different kernel scratch geometry that asks for a different-sized buffer.

The takeaway: **fp16 reduces weights memory but doesn't reduce the MPS kernel-scratch allocations** that are actually exceeding the GPU memory ceiling. The 76 + 135 GiB allocation attempts come from the SDPA op or related, and they're independent of the weight dtype.

---

## 5. SYNTHESIS — THREE LEVERS, THREE HOLDS

This packet completes the orthogonal-lever exploration started by packets 007 + 008.

| Lever | Packet | Sidecar reach | p95 Δ vs OFF | OOM allocations attempted |
|---|---|---|---|---|
| fp32, 50-doc batch | 007 | 23 % | +9,938 ms | 76 GiB |
| fp32, cap=10 batch | 008 | 15 % | +9,885 ms | 76 + 135 GiB |
| **fp16, 50-doc batch** | **009 (this)** | **15 %** | **+9,788 ms** | **17.81 + 35.60 + 76 + 135 GiB** |

The three knobs (batch size, weight dtype, and the device choice itself) are now all exhausted. The MPS binding constraint is in the kernel-scratch allocator, which doesn't respond to any of them.

Hit-rate signal across all three: **OFF arm = 51-54 hits / 150; rerank arms = 49-52 / 150**. Whenever the cross-encoder DID get called (15-23% of probes), the reordering it produced was at parity-or-slightly-worse with the upstream RRF fusion. This is consistent evidence that spec-memory's bi-encoder + FTS5 + RRF stack already orders this corpus well enough that a cross-encoder rerank doesn't add information.

---

## 6. CAVEATS

1. **bf16 not tested.** `RERANK_TORCH_DTYPE=bfloat16` is wired but unbenched. bf16 has wider dynamic range than fp16 (preserves outliers better) but the same memory footprint. Given that the OOMs are kernel-scratch (not weight) allocations, bf16 is very unlikely to help — but the evidence isn't there.
2. **PYTORCH_MPS_HIGH_WATERMARK_RATIO=0.0 not tested.** Disabling the MPS memory ceiling could let the allocations succeed at the cost of host stability. Not recommended on a 16 GB Mac.
3. **CUDA + fp16 not tested.** This is a single-user Mac; CUDA isn't in scope.
4. **Bench against a STATIC fixture.** The 50-probe set has been the constant across packets 004, 007, 008, 009. Different fixtures (with shorter docs, e.g. just titles + first 500 chars) would change the load shape and may behave differently.

---

## 7. RECOMMENDATIONS

**Decision: HOLD.** Default for spec-memory stays `SPECKIT_CROSS_ENCODER=false`. `cross-encoder.ts:54` reverted to `cross-encoder/ms-marco-MiniLM-L-6-v2`.

The `RERANK_TORCH_DTYPE` env handler stays in `scripts/rerank_sidecar.py:_load_model` and `scripts/start.sh` — it's a useful operator-facing knob regardless of this packet's verdict.

The three-lever exploration is complete. The remaining unblock candidates from the original packet 007 follow-on list:

1. ~~Cap top_k~~ — falsified by packet 008.
2. ~~fp16 weights~~ — falsified by this packet.
3. **Domain fine-tune** (packet 010 — scaffolded, execution gated). The 2026-05-21 ms-marco bench showed off-the-shelf models reorder spec-memory's structured-markdown WORSE than positional. A small fine-tuned model would run on CPU (no MPS dependency), with smaller attention buffers (smaller base model), and would actually address the rank-quality finding from the ms-marco bench.

The domain fine-tune is multi-day work. The session's evidence now strongly supports going to packet 010 next, rather than further runtime-level experiments.

A second possible direction not yet scaffolded: investigate whether `PYTORCH_MPS_HIGH_WATERMARK_RATIO=0.0` actually delivers usable Qwen-on-MPS at the cost of accepting host swap; that's a one-env-var experiment that could be a packet 011 if anyone wanted to revisit MPS later.

---

## 8. REPRODUCIBILITY

```bash
# 1) Apply sidecar fp16 handler (this packet)
#    scripts/rerank_sidecar.py: _load_model reads RERANK_TORCH_DTYPE
#    scripts/start.sh: env allowlist includes RERANK_TORCH_DTYPE

# 2) Python smoke (does fp16 load on MPS?)
.opencode/skills/system-rerank-sidecar/.venv/bin/python <<'PY'
import os, sys
os.environ["RERANK_TORCH_DTYPE"] = "float16"
os.environ["RERANK_DEVICE"] = "mps"
sys.path.insert(0, ".opencode/skills/system-rerank-sidecar")
from scripts.rerank_sidecar import _load_model
m = _load_model("Qwen/Qwen3-Reranker-0.6B")
print(next(m.model.parameters()).dtype)  # torch.float16
PY

# 3) Start sidecar + warm
RERANK_DEVICE=mps RERANK_TORCH_DTYPE=float16 bash .opencode/skills/system-rerank-sidecar/scripts/start.sh &
sleep 4
curl -sf -X POST http://127.0.0.1:8765/warmup

# 4) 50-doc smoke (expected to PASS — short docs)
curl -X POST http://127.0.0.1:8765/rerank \
  -d '{"query":"...","documents":["...x50 short docs..."]}'

# 5) Pin spec-memory to Qwen + rebuild
sed -i.bak "s|cross-encoder/ms-marco-MiniLM-L-6-v2|Qwen/Qwen3-Reranker-0.6B|" \
  .opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts
(cd .opencode/skills/system-spec-kit/mcp_server && npm run build)

# 6) Full bench
RERANK_DEVICE=mps RERANK_TORCH_DTYPE=float16 \
  bash benchmarks/benchmark-2026-05-20-rerank-ab/scripts/run_arm.sh ... --arm B --runs 3 \
  --cross-encoder true --reranker-local true

# 7) Inspect OOM
grep -iE "MPS|MTLBuffer" /tmp/rerank-sidecar.log

# 8) Revert Qwen pin after HOLD
mv .opencode/skills/.../cross-encoder.ts.bak \
   .opencode/skills/.../cross-encoder.ts
(cd .../mcp_server && npm run build)
```
