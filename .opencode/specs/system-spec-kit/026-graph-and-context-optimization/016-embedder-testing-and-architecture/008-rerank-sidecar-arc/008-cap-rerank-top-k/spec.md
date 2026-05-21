---
title: "Spec: cap spec-memory rerank top-k to test MPS-Qwen at smaller batch [template:level_1/spec.md]"
description: "Packet 007 showed Qwen3-Reranker-0.6B on MPS OOMs when spec-memory sends its default 50-document batch to /rerank. The attention buffer at that batch shape exceeds Apple Silicon GPU memory. Cap the local-provider maxDocuments to 10 via env override and re-bench. If the smaller batch fits, gates may flip."
trigger_phrases:
  - "008 cap top-k rerank"
  - "speckit_rerank_local_max_docs"
  - "spec-memory rerank top-k cap"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/008-cap-rerank-top-k"
    last_updated_at: "2026-05-21T09:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Spec authored; arc re-opened for follow-on tests"
    next_safe_action: "Add SPECKIT_RERANK_LOCAL_MAX_DOCS env override; rebuild; run A/B"
    blockers: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: cap spec-memory rerank top-k

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
| **Parent Arc** | `008-rerank-sidecar-arc` (re-opened from complete after packet 007 HOLD) |
| **Position in arc** | Phase 008 of (now 8+) — first of three follow-on attempts |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 007 found that Qwen3-Reranker-0.6B on Apple Silicon MPS OOMs in attention forwards when spec-memory's local provider sends its default 50-document batch to `/rerank`. The sidecar crashes mid-bench, falls back to positional, gates fail.

### Purpose

Test the simplest hypothesis: if the batch is small enough, MPS-Qwen fits. Specifically, cap the local provider's `maxDocuments` from 50 to 10 via a new `SPECKIT_RERANK_LOCAL_MAX_DOCS` env override and re-run the same 50-probe A/B.

### Why this isn't pre-empted by packet 007 HOLD

Packet 007 measured at 50-doc batches. The 76 GB MTLBuffer allocation that crashed the sidecar scales roughly as `(batch_size × seq_len)²`. At 10 docs, the buffer is ~25x smaller. Either it fits (gates may pass) or it doesn't (the cause is broader than batch shape).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `SPECKIT_RERANK_LOCAL_MAX_DOCS` env override in `cross-encoder.ts` that overrides `PROVIDER_CONFIG.local.maxDocuments` when set to a positive integer.
- Rebuild spec-memory TS.
- Run the same 50-probe A/B as packets 004/007 with `SPECKIT_RERANK_LOCAL_MAX_DOCS=10` set in the bench shell.
- Apply the same decision rule (≥+3 hits, p95 Δ ≤ +500 ms, ≥95% sidecar reach).
- Apply PROMOTE (flip the local provider's maxDocuments default to 10 + flip SPECKIT_CROSS_ENCODER default to true) or HOLD (revert env change, document failing gate).

### Out of Scope

- Changing the rerank-gate timeout on the MCP side.
- Per-provider top_k overrides for voyage/cohere (only local needs the cap; cloud providers don't hit Apple Silicon GPU memory).
- Quantization (packet 009).
- Fine-tuning (packet 010).

### Files to Change

- `mcp_server/lib/search/cross-encoder.ts:478` — read env override before computing `providerCap`.
- `mcp_server/dist/` rebuild (always).
- On PROMOTE: `cross-encoder.ts:57` (local provider's `maxDocuments` value), `search-flags.ts` default flip.
- Arc 008 parent on either path.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `SPECKIT_RERANK_LOCAL_MAX_DOCS` env override lands in `cross-encoder.ts` | grep finds the env read; rebuild emits new `dist/` |
| REQ-002 | Sidecar with `RERANK_DEVICE=mps` does not crash under 10-doc batches | uvicorn log clean; sidecar PID alive post-bench |
| REQ-003 | Sidecar reach in Arm B ≥ 95% | `rerank_provider == 'cross-encoder'` for ≥ 143/150 rows |
| REQ-004 | Decision rule applied | report records the three gate evaluations |
| REQ-005 | On PROMOTE: `PROVIDER_CONFIG.local.maxDocuments` flips to 10 + `SPECKIT_CROSS_ENCODER` default to true | grep + rebuild |
| REQ-006 | On HOLD: env override reverted; default stays off | grep |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Strict-validate this packet | exit 0 |
| REQ-008 | Bench evidence preserved | `benchmark-2026-05-21-cap-top-k/` with fixture + runs/ + report |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `SPECKIT_RERANK_LOCAL_MAX_DOCS=10` cap is honored by `rerankResults` head/tail split.
- **SC-002**: Sidecar stays alive through the bench (no MPS OOM).
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
| MPS still OOMs at 10 docs | Medium | HOLD on memory grounds again | Increment `RERANK_TORCH_DTYPE=float16` (packet 009 territory) |
| 10-doc batch loses top-K of Stage 2 fusion that mattered | Medium | Hit-rate drops vs baseline because rerank doesn't see the relevant doc | Try 20-doc as a fallback; document the trade |
| Per-call latency rises (10 docs × N seq_len) | Low | p95 grows | Compare against packet 007 latency tables; the slope should be O(batch²) so 10 docs should be ~25x faster than 50 |

Dependencies:
- Multi-model sidecar (`9349f5f4a`) — load-bearing because the bench may want to compare different models at the same batch cap in future packets.
- Phase 004 harness — reused unchanged.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Q1**: If MPS-Qwen at 10 docs clears the latency + reach gates but hit-rate stays flat, the "RRF-already-good" hypothesis is confirmed. Decision: in that case the rerank slot is non-load-bearing for this corpus and the default should stay OFF regardless of batch shape. Confirm.
- **Q2**: Should the env override take a JSON map keyed by provider (`{"local": 10}`) or a single int that only affects `local`? Decision: single int, only `local`. Cloud providers don't have the memory constraint.
- **Q3**: Does the head/tail split in cross-encoder.ts already produce `cross-encoder-tail` markers we can audit? Yes — line 95 documents this. The tail rows will keep positional order, which is what we want.
<!-- /ANCHOR:questions -->
