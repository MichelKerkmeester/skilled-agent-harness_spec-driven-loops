---
title: "Spec: spec-memory MPS rerank promotion candidate [template:level_1/spec.md]"
description: "Re-evaluate whether spec-memory's SPECKIT_CROSS_ENCODER default can flip ON if Qwen3-Reranker-0.6B runs on Apple Silicon MPS instead of CPU. Phase 004 and the 2026-05-20 re-run both showed CPU exceeded the MCP rerank-gate timeout on 77 percent of probes; MPS is the cheapest experiment that could plausibly clear all three promotion gates."
trigger_phrases:
  - "007 mps rerank"
  - "spec-memory rerank mps"
  - "qwen mps sidecar bench"
  - "speckit_cross_encoder mps promotion"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/007-spec-memory-mps-rerank-promotion"
    last_updated_at: "2026-05-21T15:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Superseded by 011/005 opt-in closure"
    next_safe_action: "Use 011/005 instead"
    blockers:
      - "Superseded — do not execute"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: spec-memory MPS rerank promotion candidate

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Shipped — HOLD |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `008-rerank-sidecar-arc` (re-opened from complete) |
| **Position in arc** | Phase 007 of (now 7) — MPS unblock attempt |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Spec-memory's `SPECKIT_CROSS_ENCODER=true` path stays default-off because Qwen3-Reranker-0.6B on Apple Silicon CPU is too slow under the MCP rerank-gate timeout:

- Phase 004 (2026-05-20 original) — hit-rate Δ +0.4 pp, p95 Δ +9832 ms, sidecar reached on a minority of probes.
- 2026-05-20 re-run after arc 008 phase 006 ship — hit-rate Δ −0.7 pp, p95 Δ +9881 ms, sidecar reached on 23 percent of probes (77 percent timed out to fallback).
- 2026-05-21 ms-marco swap under the new multi-model sidecar — 100 percent sidecar reach, p95 Δ +360 ms (under gate), but hit-rate Δ −4 pp (ordering hurts on spec-memory's structured-markdown corpus).

The CPU forward pass through a 0.6B-param cross-encoder is the bottleneck. Apple Silicon MPS typically delivers 3-8x speedup, which would push per-probe latency under the timeout.

### Purpose

This packet asks one decisive question: does `RERANK_DEVICE=mps` change the bench numbers enough to flip spec-memory's default from OFF to ON?

### Why this isn't pre-empted by phase 005 HOLD

Phase 005 HOLD locked the verdict for **CPU**. MPS is a different device with a different latency profile. New evidence is necessary and sufficient to re-open the decision.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Verify Qwen3-Reranker-0.6B loads on MPS without hard crash (`PYTORCH_ENABLE_MPS_FALLBACK=1` covers missing op kernels).
- Run the same 50-probe A/B fixture used by phase 004 + the 2026-05-20 re-run + the 2026-05-21 ms-marco run. Same harness, same probe set, only the sidecar's device changes.
- Apply the documented decision rule (≥+3 hits AND p95 Δ ≤ +500 ms AND ≥95 percent sidecar reach AND no P0 regressions).
- Apply PROMOTE (flip default + update arc parent + bump cross-encoder.ts:54 if needed) or HOLD (record the verdict, leave default off).
- Document MPS-specific operational caveats (memory pressure, thermal, fp16/fp32 drift).

### Out of Scope

- Other Apple Silicon backends (CoreML, ANE).
- Cocoindex rerank changes — cocoindex already PROMOTE'd on CPU; we do not move it onto MPS in this packet.
- Reranker fine-tuning — alternative "better model for this corpus" hypothesis stays a future packet.
- Sustained-load benchmarking under concurrent spec-memory + cocoindex traffic.

### Files to Change

On PROMOTE only:

- `mcp_server/lib/search/cross-encoder.ts:54` — local provider model from `cross-encoder/ms-marco-MiniLM-L-6-v2` to `Qwen/Qwen3-Reranker-0.6B`
- `mcp_server/lib/search/search-flags.ts` — `SPECKIT_CROSS_ENCODER` default to true
- `mcp_server/dist/` rebuild
- Arc 008 parent `spec.md` + `graph-metadata.json`

On HOLD: no source changes; only the bench evidence + the packet docs ship.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Sidecar loads Qwen on MPS without unrecoverable error | `/health.loaded_models` lists Qwen after warmup; uvicorn log shows no RuntimeError |
| REQ-002 | `/rerank` returns sigmoid-normalized scores in `[0,1]` under MPS | A 3-document smoke returns 200 with bounded scores |
| REQ-003 | 50-probe A/B harness completes for both arms | `arm-a-off.jsonl` and `arm-b-mps.jsonl` each have 150 rows |
| REQ-004 | Sidecar reach in Arm B ≥ 95 percent | `rerank_provider == 'cross-encoder'` for ≥ 143/150 rows |
| REQ-005 | Decision rule applied per gates | report records the three gate evaluations and resulting verdict |
| REQ-006 | If PROMOTE: arc 008 re-opens, `cross-encoder.ts:54` flips to Qwen, default flips to true | git diff shows the changes; pytest still passes; strict-validate exits 0 |
| REQ-007 | If HOLD: record failure mode with measurements; default stays off; arc 008 stays closed | report §8 RECOMMENDATIONS records HOLD with failing gate |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | MPS operational caveats captured | report §7 CAVEATS covers memory, op fallback rate, thermal observations |
| REQ-009 | Strict-validate this packet | `bash validate.sh ... --strict` exit 0 |
| REQ-010 | Bench evidence preserved | `benchmark-2026-05-21-spec-memory-mps/` with fixture + runs/ + report |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Qwen on MPS loads with `RERANK_DEVICE=mps`; `/health` returns 200 after warmup; `loaded_models` contains Qwen.
- **SC-002**: Per-probe rerank latency on MPS ≤ ~1000 ms for the 90th percentile (sanity bound).
- **SC-003**: End-to-end `memory_search` p95 in Arm B ≤ `1108 ms + 500 ms = ~1608 ms` (Arm A baseline ≈ 1108 ms from prior runs).
- **SC-004**: Arm B hit-rate ≥ 54 / 150 (Arm A baseline 51/150 from prior runs).
- **SC-005**: Sidecar reach in Arm B ≥ 95 percent (≤ 7 rows degrade to `fallback`).
- **SC-006**: Strict-validate exit 0 on this packet AND arc parent after closeout.
- **SC-007**: Either default flips to `SPECKIT_CROSS_ENCODER=true` (PROMOTE) or report documents the failing gate (HOLD).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Qwen has ops without MPS kernels | Medium | Op falls back to CPU silently; latency reverts toward CPU floor | Set `PYTORCH_ENABLE_MPS_FALLBACK=1`; measure fallback rate via uvicorn log |
| MPS memory pressure on 16 GB Mac | Medium | Host swaps; tail latency blows out | Single-consumer bench excludes concurrent traffic; document the caveat |
| fp16/fp32 drift on MPS | Low | Scores shift; ordering should be stable | Sigmoid-normalized output bounds the scale; bench compares hit-rate (rank-based) |
| Thermal throttling on sustained MPS use | Low | p95 climbs over time | 10 min wall clock per arm is short enough; recheck if numbers are suspiciously flat |
| MPS-Qwen still too slow → no improvement | Medium | Same outcome as 2026-05-20 re-run; HOLD | Decision rule treats this as honest data; defer fine-tune |

Dependencies:

- Multi-model sidecar (commit 9349f5f4a) — load-bearing because we may want per-model device assignment in a follow-on.
- Phase 004 harness + fixture — reused unchanged.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Q1**: Does Qwen3-Reranker-0.6B's tokenizer + model both run cleanly on MPS, or do we hit unimplemented ops in attention or pooling? Resolution: smoke-test in Phase A.
- **Q2**: Is the rerank-gate timeout the binding constraint, or is the cross-encoder's intrinsic rerank quality the binding constraint? Resolution: if Arm B reaches the cross-encoder on ≥95 percent of probes but hit-rate still doesn't move, the hypothesis is "intrinsic quality" and the fine-tune packet becomes the path forward.
- **Q3**: Should the sidecar set `torch.set_num_threads(1)` on MPS to avoid CPU-side oversubscription? Out of scope for this bench; investigate only if Arm B shows unexpectedly high tail latency.
<!-- /ANCHOR:questions -->
