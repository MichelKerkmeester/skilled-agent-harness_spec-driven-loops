---
title: "Spec: fp16 cross-encoder weights on MPS [template:level_1/spec.md]"
description: "Cut Qwen3-Reranker-0.6B's memory footprint roughly in half by loading weights in fp16 instead of fp32. Packet 007 OOM'd at 50-doc batches; packet 008 caps batches at 10; this packet tries a third lever — the weights themselves — so the same batch size fits more comfortably on Apple Silicon MPS. Adds RERANK_TORCH_DTYPE env var to the sidecar."
trigger_phrases:
  - "009 fp16 rerank"
  - "rerank_torch_dtype"
  - "half precision qwen"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/009-fp16-rerank"
    last_updated_at: "2026-05-21T15:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Superseded by 011/005 opt-in closure"
    next_safe_action: "Use 011/005 instead"
    blockers:
      - "Superseded — do not execute"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: fp16 cross-encoder weights on MPS

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Planned |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `008-rerank-sidecar-arc` (re-opened from complete) |
| **Position in arc** | Phase 009 of (now 9+) — second follow-on attempt |

> **Status reconciliation:** This superseded packet retains its planned status as a historical record; the summary documents the terminal HOLD verdict and directs follow-up work to 011/005.

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 007 found that Qwen3-Reranker-0.6B on MPS OOMs in attention forwards at spec-memory's default 50-doc batch size — Metal tried to allocate a 76 GB MTLBuffer. Packet 008 attacks this from the batch-size side. This packet attacks it from the weights side: loading weights in fp16 instead of fp32 cuts model memory roughly in half (~750 MB instead of ~1.5 GB) and may reduce per-call activation memory too.

### Purpose

Test whether `model_kwargs={"torch_dtype": torch.float16}` lets Qwen-on-MPS handle a 50-doc batch without OOM. If yes, the cap-top_k workaround from packet 008 becomes unnecessary; spec-memory's existing 50-doc default can stay.

### Relation to packet 008

Independent levers. Packet 008 = smaller batch, fp32 weights. This packet = same batch, fp16 weights. Results are complementary: if both PROMOTE, the operator picks based on quality vs latency tradeoff. If only one PROMOTEs, that path becomes the default.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `RERANK_TORCH_DTYPE` env var to the sidecar (`scripts/rerank_sidecar.py`) — accepts `float16` / `fp16` / `bfloat16` / `bf16` / unset (default fp32).
- Pass `model_kwargs={"torch_dtype": torch.float16}` (or bf16) to `CrossEncoder` when set.
- Add to `scripts/start.sh` env allowlist.
- Run the same 50-probe A/B as packets 004/007/008 with `RERANK_DEVICE=mps RERANK_TORCH_DTYPE=float16` set, NO batch cap.
- Apply decision rule.

### Out of Scope

- True quantization (int8/int4 via bitsandbytes / GGUF) — requires runtime swap, not a fp16 cast.
- Mixed precision (autocast) — fp16 weights with fp32 ops is a possible follow-on if straight fp16 underperforms.
- Per-model dtype selection on the multi-model sidecar — for this bench all models use the same dtype.

### Files to Change

- `scripts/rerank_sidecar.py` — add dtype handling in `_load_model`.
- `scripts/start.sh` — add `RERANK_TORCH_DTYPE` to env allowlist.
- `mcp_server/dist/` (no spec-memory TS change needed; the sidecar swaps dtype transparently).
- On PROMOTE: `SPECKIT_CROSS_ENCODER` default flip in `search-flags.ts`; sidecar's default dtype in start.sh (optional).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `RERANK_TORCH_DTYPE` env var lands in `rerank_sidecar.py:_load_model` | grep finds the read + dtype branching |
| REQ-002 | Sidecar with `RERANK_DEVICE=mps RERANK_TORCH_DTYPE=float16` does not OOM | uvicorn log clean; no `MPS backend out of memory`; sidecar PID alive post-bench |
| REQ-003 | Sidecar reach in Arm B ≥ 95% | `rerank_provider == 'cross-encoder'` for ≥ 143/150 rows |
| REQ-004 | Decision rule applied | report records gate evaluations |
| REQ-005 | On PROMOTE: `SPECKIT_CROSS_ENCODER` default flipped to true; sidecar's recommended dtype documented | grep + report |
| REQ-006 | On HOLD: source change to sidecar stays (dtype knob is generally useful); defaults unchanged | grep |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Strict-validate exit 0 | `bash validate.sh ... --strict` |
| REQ-008 | Bench evidence preserved | `benchmark-2026-05-21-fp16-rerank/` with fixture + runs/ + report |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Sidecar loads Qwen in fp16 on MPS; `/health` returns ok; `/warmup` returns `status:warmed`.
- **SC-002**: 50-doc batch `/rerank` smoke does not OOM.
- **SC-003**: Arm B sidecar reach ≥ 95%.
- **SC-004**: Arm B hit-rate ≥ 54/150 (baseline 51 + 3).
- **SC-005**: Arm B p95 ≤ 1611 ms (baseline 1111 + 500).
- **SC-006**: Strict-validate exit 0.
- **SC-007**: Either default flips (PROMOTE) or report documents failing gate (HOLD).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| fp16 still OOMs at 50 docs (memory cut not enough) | Medium | HOLD on memory grounds; packet 008's cap-top_k is the better path | Compare to packet 008 result; if both fail, fine-tune (packet 010) is next |
| fp16 numerical drift shifts sigmoid scores | Low | Score-scale change but rank-order should be stable | Sigmoid normalization bounds the output; bench compares rank-based hit-rate, not raw scores |
| MPS-fp16 has op gaps that fall back to CPU | Low | Latency reverts toward CPU floor | `PYTORCH_ENABLE_MPS_FALLBACK=1` already in start.sh allowlist; measure fallback rate via log |
| bf16 vs fp16 choice unclear | Low | Different numerical profile; bf16 has wider dynamic range, fp16 has more precision | Default the env to `float16`; bf16 available as an alternative |

Dependencies:

- Multi-model sidecar (`9349f5f4a`) — provides the `_load_model` hook that this packet extends.
- Phase 004 harness — reused.
- Qwen3-Reranker-0.6B local snapshot at pinned revision.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Q1**: Should the sidecar autodetect MPS and default to fp16 in that case? Decision: no, leave dtype explicit. The dtype is an operator-facing tradeoff (memory vs precision) that shouldn't be implicit.
- **Q2**: If fp16 fits AND clears the gates, what's the recommended default? Decision: deferred to verdict; document in the report's §8 RECOMMENDATIONS.
- **Q3**: Should we also test packet 008's cap-top_k=10 + this packet's fp16 STACKED? Out of scope for this packet; if neither alone PROMOTEs, stacking becomes a follow-on candidate.
<!-- /ANCHOR:questions -->
