---
title: "Implementation Summary: fp16 cross-encoder weights on MPS [template:level_1/implementation-summary.md]"
description: "PRE-IMPLEMENTATION stub. Will be filled with Phase C-D bench + verdict."
trigger_phrases:
  - "009 fp16 summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/009-fp16-rerank"
    last_updated_at: "2026-05-21T10:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "fp16 bench HOLD; arc 008 closes"
    next_safe_action: "Commit batch (007+008+009 HOLDs + 010 scaffold + arc parent); revisit packet 010 if/when chosen"
    blockers: []
    completion_state: "complete"
---
# Implementation Summary: fp16 cross-encoder weights on MPS

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: SHIPPED — HOLD.** Phase A smoke surprised positively (fp16 fit 50 short docs in 1.1s on MPS, no OOM). Phase C bench reproduced the OOM pattern from packets 007 + 008 because production spec docs are 4-8x longer than the smoke's lorem ipsum. fp16 cuts WEIGHT memory but not the MPS KERNEL-SCRATCH allocations that are actually blowing the 88 GiB ceiling. Third orthogonal lever falsified.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Shipped — HOLD |
| **Created** | 2026-05-21 |
| **Shipped** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `008-rerank-sidecar-arc` |
| **Position in arc** | Phase 009 of 10 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- `scripts/rerank_sidecar.py:_load_model` — `RERANK_TORCH_DTYPE` env handler. Supports `float16`/`fp16`/`half` and `bfloat16`/`bf16`. Defaults unset → fp32 (no behavior change).
- `scripts/start.sh` env allowlist — `RERANK_TORCH_DTYPE` added.
- `benchmarks/benchmark-2026-05-21-fp16-rerank/` — fixture + 2 arm runs (150 rows each) + `benchmark_report.md` with §1-§8 documenting the smoke-vs-bench divergence.
- Source revert at end: `cross-encoder.ts:54` restored to `cross-encoder/ms-marco-MiniLM-L-6-v2`. fp16 env handler stays.

Original planned shape:

- `scripts/rerank_sidecar.py:_load_model` — `RERANK_TORCH_DTYPE` env handler (fp16 / bf16 / fp32 default)
- `scripts/start.sh` — env allowlist extended with `RERANK_TORCH_DTYPE`
- `benchmarks/benchmark-2026-05-21-fp16-rerank/` — fixture + runs + benchmark_report.md
- On PROMOTE: `search-flags.ts` SPECKIT_CROSS_ENCODER default flipped; sidecar dtype recommendation documented
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. **Phase A — env handler**: Added `RERANK_TORCH_DTYPE` to `rerank_sidecar.py:_load_model` + `start.sh` allowlist. Python smoke confirmed Qwen loads on MPS as fp16, params dtype `torch.float16`, smoke predict() runs in <1s.
2. **Phase B — sidecar restart**: `RERANK_DEVICE=mps RERANK_TORCH_DTYPE=float16 bash scripts/start.sh` ran cleanly; `/warmup` returned in 2.8s (vs fp32's ~5s).
3. **Phase C — 50-doc OOM smoke**: One `POST /rerank` with 50 short lorem-ipsum docs returned HTTP 200 in 1122 ms with sigmoid scores. **No OOM.** This was the breakthrough that motivated continuing to the full bench.
4. **Phase D — full A/B**: Same 50-probe fixture as 007 + 008. Production spec docs (1-10 KB each) triggered MPS OOMs the lorem-ipsum smoke didn't — sidecar crashed mid-bench. Only 23/150 (15.3%) of probes reached the cross-encoder before fallback fired.
5. **Phase E — closeout**: cross-encoder.ts reverted; TS rebuilt; report written; tasks marked; arc parent updated.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001: Default dtype stays unset (fp32)
**Decision:** `RERANK_TORCH_DTYPE` is opt-in.
**Rationale:** Some operators may not want the implicit precision loss; fp16 is an explicit operator choice. The packet 007 + 008 + 009 evidence tells future operators which combination wins on Apple Silicon (answer: none — MPS doesn't fit this model at production load shapes).

### D-002: Sidecar source change survives HOLD
**Decision:** The `RERANK_TORCH_DTYPE` handler stays in `_load_model` regardless of bench verdict.
**Rationale:** Adding a tunable env doesn't enable it by default; nothing changes for existing operators. The handler may help on other hardware (CUDA fp16) or for smaller models that DO fit on MPS.

### D-003: Smoke vs bench divergence is the new finding
**Decision:** Document the smoke-vs-bench gap explicitly — the smoke passed and was a real signal, the bench failed because of load-shape differences (sequence length, sustained traffic) the smoke didn't exercise.
**Rationale:** Future operators looking at MPS smoke results should know they're not predictive of production load. The smoke-bench mismatch is itself a generalizable lesson; document it.

### D-004: bf16 not tested
**Decision:** Skip bf16 as a separate experiment.
**Rationale:** The OOMs are in MPS kernel scratch allocations (76 + 135 GiB), not in weight tensors. bf16 has the same byte width as fp16; if fp16 didn't help, bf16 won't either. Saving the bench wall clock.

### D-005: Three-lever exploration complete
**Decision:** After this packet, declare runtime-level MPS unblocks exhausted. Continue with packet 010 (domain fine-tune) only.
**Rationale:** Three orthogonal levers (batch size, weight dtype, the device itself) all produced HOLD. The binding constraint is in Apple's MPS framework's allocation policy for Qwen3's attention graph, not in our tunables. Further runtime experiments are unlikely to unblock.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Actual recorded outputs:

```text
Phase A — Python smoke:
  dtype: torch.float16  (596,776,512 params on mps:0)
  smoke rerank scores (2 pairs): [3.18, 2.76]  (raw logits; sidecar applies sigmoid downstream)

Phase B — sidecar warmup:
  {"status":"warmed", "model":"Qwen/Qwen3-Reranker-0.6B", "revision":"e61197ed..."}
  warmup time: 2847 ms

Phase C — 50-doc OOM smoke:
  HTTP 200, latency_ms=1122
  results: 50 items, scores sigmoid-normalized
  sidecar PID alive post-call
  RESULT: smoke PASSED

Phase D — bench (3 × 50 probes):
  Arm A (off):           hits=54 hit_rate=0.360 p95=1112 ms scoring={'fallback': 150}
  Arm B (Qwen-MPS+fp16): hits=52 hit_rate=0.347 p95=10900 ms scoring={'cross-encoder': 23, 'fallback': 127}
  Δ: hit-rate -0.013, p95 +9788 ms, reach 0.153

Decision gates:
  Gate 1 (HR Δ ≥ +0.02):    FAIL
  Gate 2 (p95 Δ ≤ +500 ms): FAIL
  Gate 3 (reach ≥ 0.95):    FAIL

Sidecar log post-bench:
  RuntimeError: MPS backend out of memory (allocated: 9.48 GiB; tried 35.60 GiB on shared pool)
  RuntimeError: MPS backend out of memory (allocated: 13.17 GiB; tried 17.81 GiB on shared pool)
  RuntimeError: Invalid buffer size: 135.24 GiB
  failed assertion `Failed to allocate private MTLBuffer for size 76 GB'

VERDICT: HOLD
```

Original planned commands:

```bash
# Phase A python smoke
.opencode/skills/system-rerank-sidecar/.venv/bin/python -c "
import os, torch
os.environ['RERANK_TORCH_DTYPE'] = 'float16'
os.environ['RERANK_DEVICE'] = 'mps'
import sys; sys.path.insert(0, '.opencode/skills/system-rerank-sidecar')
from scripts.rerank_sidecar import _load_model
m = _load_model('Qwen/Qwen3-Reranker-0.6B')
print('dtype:', next(m.model.parameters()).dtype)
"
# expect: dtype: torch.float16

# Phase C OOM smoke
curl -X POST http://127.0.0.1:8765/rerank \
  -d '{"query":"test","documents":["...x50..."],"model":"Qwen/Qwen3-Reranker-0.6B"}'
# expect: 200 (no OOM)

# Phase D bench
RERANK_DEVICE=mps RERANK_TORCH_DTYPE=float16 bash run_arm.sh ...

# Strict validate
bash validate.sh .../009-fp16-rerank --strict
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

(to refine post-execution)

1. Single dtype tested (fp16); bf16 not benched.
2. Single device (MPS); fp16 on CUDA not in scope (single-user Mac).
3. No model-quality regression check across many fixtures; the 50-probe set may not surface fp16's edge cases.
4. Mixed precision (autocast) not tested.
<!-- /ANCHOR:limitations -->
