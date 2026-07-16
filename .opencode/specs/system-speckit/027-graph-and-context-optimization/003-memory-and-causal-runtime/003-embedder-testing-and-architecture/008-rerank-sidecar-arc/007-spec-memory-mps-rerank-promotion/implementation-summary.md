---
title: "Implementation Summary: spec-memory MPS rerank promotion candidate [template:level_1/implementation-summary.md]"
description: "PRE-IMPLEMENTATION stub. Will be filled with Phase C bench results + Phase D verdict + Phase E closeout actions."
trigger_phrases:
  - "007 mps implementation summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/007-spec-memory-mps-rerank-promotion"
    last_updated_at: "2026-05-21T08:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "MPS HOLD shipped; sidecar OOM on Qwen attention at bench batch shape"
    next_safe_action: "Close arc 008 with HOLD; consider cap-top_k or smaller-model follow-on"
    blockers: []
    completion_state: "complete"
---
# Implementation Summary: spec-memory MPS rerank promotion candidate

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: SHIPPED — HOLD.** MPS smoke showed Qwen at 155 ms per 3-doc call (~19x speedup vs CPU). Bench's 20-doc batch shape triggered MPS GPU OOM in Qwen attention; sidecar crashed mid-run. All three promotion gates failed. Default stays `SPECKIT_CROSS_ENCODER=false`; `cross-encoder.ts:54` reverted to `cross-encoder/ms-marco-MiniLM-L-6-v2`.

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
| **Parent Arc** | `008-rerank-sidecar-arc` (re-opened then re-closed) |
| **Position in arc** | Phase 007 of 7 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- `benchmark-2026-05-21-spec-memory-mps/` folder with the canonical 50-probe fixture, `runs/arm-a-off.jsonl` (150 rows), `runs/arm-b-mps.jsonl` (150 rows, v1 without env propagation), `runs/arm-b-mps-v2.jsonl` (150 rows, v2 with `RERANK_DEVICE=mps` exported through the bench shell), and `benchmark_report.md` (9 sections).
- Phase A smoke evidence preserved inline in the report: 155 ms per 3-doc rerank on MPS, no errors, `RERANK_DEVICE=mps` confirmed in the sidecar process env.
- Phase C bench OOM evidence: uvicorn log showing `MPS backend out of memory` + `Failed to allocate private MTLBuffer for size 76 GB` in Qwen attention forwards; sidecar process death; falling-back behavior captured in 116-119 of 150 rows.
- HOLD verdict applied: `cross-encoder.ts:54` reverted to `cross-encoder/ms-marco-MiniLM-L-6-v2`; spec-memory TS rebuilt; `SPECKIT_CROSS_ENCODER` default unchanged.
- Arc 008 parent updated: phase-map row 007 (HOLD), `graph-metadata.json` derived.status back to complete, last_active_child_id repointed.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. **Phase A — MPS load smoke**: started sidecar with `RERANK_DEVICE=mps`, warmed Qwen in 3.6 s, 3-doc rerank returned 155 ms with sigmoid scores. No errors. RERANK_DEVICE env confirmed live in the process. Smoke = clean PASS.
2. **Phase B — harness setup**: created `benchmark-2026-05-21-spec-memory-mps/`, copied the canonical phase-004 fixture, flipped `cross-encoder.ts:54` from ms-marco to Qwen (since the bench measures Qwen-on-MPS), rebuilt spec-memory TS.
3. **Phase C — A/B run (twice)**:
   - v1: ran Arm A + Arm B without exporting `RERANK_DEVICE=mps` in the bench shell. Suspected env scrubbing.
   - v2: re-ran Arm B with `RERANK_DEVICE=mps` exported. Same shape (~23 percent sidecar reach, p95 ~11 s).
   - Inspection of uvicorn log revealed the sidecar process had crashed with MPS OOM in Qwen attention. PID gone post-bench. Mechanism, not env propagation.
4. **Phase D — decision rule**: all three gates fail. Verdict HOLD.
5. **Phase E — closeout**: cross-encoder.ts reverted to ms-marco, rebuild, arc parent update, tasks marked, strict-validate, commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001: Single-consumer measurement (spec-memory only)
**Decision:** Bench spec-memory's `memory_search` only.
**Rationale:** The question is "should spec-memory default-on with MPS?". Cocoindex is already PROMOTE on CPU and not load-bearing for this decision.

### D-002: Reuse phase-004 harness and fixture verbatim
**Decision:** Use `benchmark-2026-05-20-rerank-ab/scripts/run_arm.{sh,py}` and `rerank-ab-fixture.json` unchanged.
**Rationale:** Apples-to-apples comparison with phase 004 + the 2026-05-20 re-run.

### D-003: HOLD even though the smoke speedup is real
**Decision:** The 19x per-call speedup from the smoke does NOT generalize to the bench. The actual production batch shape (20 docs × ~512 tokens) drives Qwen attention forwards past Apple Silicon MPS memory ceiling; the sidecar crashes mid-run.
**Rationale:** Gate 2 (p95 Δ ≤ +500 ms) and Gate 3 (sidecar reach ≥ 0.95) both fail catastrophically because of the crash, not a small-margin shortfall. Re-running with `PYTORCH_MPS_HIGH_WATERMARK_RATIO=0.0` to disable the safety limit may avoid the crash at the cost of system stability and is not a path I'd recommend defaulting.

### D-004: Revert `cross-encoder.ts:54` to ms-marco (NOT Qwen) after HOLD
**Decision:** On HOLD, restore the local-provider model field to `cross-encoder/ms-marco-MiniLM-L-6-v2`.
**Rationale:** That's the existing, tested config that has the multi-model dispatch path through `HttpSidecarRerankerAdapter`. Pinning to Qwen post-HOLD would silently route the next opt-in operator at a model the sidecar already proved it can't serve reliably at spec-memory's batch shape.

### D-005: Bench env propagation is not the bug
**Decision:** Even with `RERANK_DEVICE=mps` exported through the bench shell (v2 run), the MPS sidecar still crashed. The env DID propagate via `os.environ.copy()` in `run_arm.py:McpServer` and `processObj.env` in `ensure-rerank-sidecar.cjs`. The mechanism is GPU memory exhaustion, not configuration drift.
**Rationale:** Initial suspicion was that the harness scrubbed `RERANK_DEVICE`. v2 confirmed it didn't. The shipped fix is the documentation, not the harness.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Actual recorded outputs:

```text
Phase A smoke:
  $ time curl -X POST /warmup      → status:warmed in 3.6 s
  $ time curl -X POST /rerank …    → 200, sigmoid scores, 155 ms (3-doc batch)
  $ ps -E -p $PID | grep RERANK_DEVICE → RERANK_DEVICE=mps   ✓

Phase C bench v2 (with RERANK_DEVICE=mps exported):
  Arm A (sidecar OFF):  hits=51 hit-rate=0.340 p95=1111 ms  scoring={'fallback': 150}
  Arm B (Qwen on MPS):  hits=49 hit-rate=0.327 p95=11049 ms scoring={'cross-encoder': 34, 'fallback': 116}

Sidecar log post-bench (truncated):
  RuntimeError: MPS backend out of memory (MPS allocated: 20.17 GiB,
    other allocations: 71.31 GiB, max allowed: 88.13 GiB).
  failed assertion `Failed to allocate private MTLBuffer for size 76457536000'
  (sidecar process exits; /tmp/rerank-sidecar.log preserved)

Decision gates:
  Gate 1 (hit-rate Δ ≥ +0.02):    -0.013     → FAIL
  Gate 2 (p95 Δ ≤ +500 ms):       +9938      → FAIL
  Gate 3 (sidecar reach ≥ 0.95):  0.23       → FAIL

Verdict: HOLD.
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No `PYTORCH_MPS_HIGH_WATERMARK_RATIO=0.0` test** — disabling the MPS memory safety limit may avoid the OOM at the cost of host instability. Not pursued; would require a separate risk-assessment pass.
2. **No cap-top_k experiment** — capping spec-memory's Stage 3 `HIGH_TOP_K` from 20 to 5-10 would shrink the attention buffer enough to plausibly fit on MPS. The fastest follow-on candidate.
3. **No quantized-Qwen test** — `Qwen3-Reranker-0.6B-Q4_K_M` or similar would cut model memory ~3-4x. Requires new model artifact + revalidation; non-trivial scope.
4. **No smaller-model-on-MPS test** — ms-marco (80 MB) and BGE (600 MB) have smaller attention footprints; would fit on MPS at the bench batch size. The 2026-05-21 ms-marco bench showed ms-marco hurts ordering on CPU; whether MPS changes that is open.
5. **Single device for the sidecar process** — per-model device assignment (Qwen-CPU for cocoindex, ms-marco-MPS for spec-memory's opt-in) was not implemented in this packet.
6. **No sustained / thermal stress** — 10-min wall clock per arm is short; longer runs are out of scope.
<!-- /ANCHOR:limitations -->
