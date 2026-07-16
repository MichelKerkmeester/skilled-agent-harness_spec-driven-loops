---
title: "Spec: bge-reranker-v2-m3 off-the-shelf trial [template:level_1/spec.md]"
description: "Phase 2 of the rerank decision arc. Adds BAAI/bge-reranker-v2-m3 (Apache-2.0, 568M, multilingual + diverse text) to the system-rerank-sidecar allowlist and runs the same 50-probe fixture used in Phases 004 and 011/001. The hypothesis: ms-marco's failure was a model-corpus mismatch issue solvable with a stronger off-the-shelf model — not a runtime issue, not a need for fine-tuning. Gated on Phase 1 returning OFF_DEFICIENT with concrete failure-mode targets."
trigger_phrases:
  - "011/002 bge-reranker-v2-m3 trial"
  - "bge v2 m3 spec-memory rerank"
  - "off-the-shelf cross-encoder trial"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/002-bge-v2-m3-trial"
    last_updated_at: "2026-05-21T15:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Superseded by 011/005 opt-in closure"
    next_safe_action: "Use 011/005 instead"
    blockers:
      - "Superseded — do not execute"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: bge-reranker-v2-m3 off-the-shelf trial

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Complete (HOLD; no source patch) |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `011-spec-memory-rerank-decision-arc` |
| **Position in arc** | Phase 012 of 013 |
| **Executor** | cli-codex gpt-5.5 high fast |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Arc 008 tried two off-the-shelf rerankers on spec-memory:
- **Qwen/Qwen3-Reranker-0.6B** — strong on code (cocoindex shipped it), but CPU latency exceeds the rerank-gate timeout for spec-memory's typical query patterns; MPS OOMs at 50-doc batches.
- **cross-encoder/ms-marco-MiniLM-L-6-v2** — fast enough, but rank quality on structured markdown regresses 6 hits below the OFF baseline.

Neither was trained on the structured-markdown corpus that spec-memory indexes (frontmatter, ANCHOR tags, packet-id paths). The hypothesis Phase 2 tests: a stronger generalist off-the-shelf reranker — `BAAI/bge-reranker-v2-m3` — closes the gap that ms-marco couldn't, without the latency profile of Qwen3-0.6B and without needing fine-tuning.

### Why bge-reranker-v2-m3 specifically

- **Apache-2.0 license** (per arc invariant #3)
- **568M parameters** — between ms-marco-MiniLM (33M, too weak for this corpus) and Qwen3-Reranker-0.6B (591M, too slow on CPU)
- **Diverse-text training** — multilingual + multitask, less narrowly-tuned to web QA than ms-marco
- **Standard cross-encoder interface** — drops into the existing sidecar with allowlist + revision pin; no new model loading paths needed
- **Established benchmark results** — strong on MTEB rerank tasks across long-form text

### Purpose

Determine whether a single allowlist + sidecar config change closes the rerank gap without fine-tune effort. If it does, ship + flip default + arc closes. If it doesn't, Phase 3 (fine-tune) becomes the path of last resort with the bge baseline now established as the model to beat.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `BAAI/bge-reranker-v2-m3` to `system-rerank-sidecar`'s `RERANK_ALLOWED_MODELS` allowlist and `RERANK_MODEL_REVISIONS` pin
- Pre-fetch model weights (HF download) once, document the on-disk size + load time
- Add per-model lock if not already in place (sidecar v0.2.0 added per-model locks per memory)
- Run the same 50-probe fixture used in Phases 004 and 011/001, this time with `SPECKIT_CROSS_ENCODER=true` + `RERANKER_LOCAL=true` + sidecar config targeting bge-v2-m3
- Capture per-probe deltas vs the OFF baseline from Phase 1
- Compare against the concrete target metrics produced by Phase 1's failure-mode categorization (the recall misses + ranking inversions it identified)
- Verdict: PROMOTE / HOLD using arc invariant gates (+3 hits over OFF, p95 < +500ms, no OOM, no daemon crash)

### Targets from Phase 1 (filled by Phase 1 execution if OFF_DEFICIENT)

> _Phase 1 fills this section in its implementation-summary §Failure Analysis. Phase 2 reads it here as the concrete success criteria, not just the generic +3-hits gate._

| Target metric | Phase 1 measured | Phase 2 must reach |
|---|---|---|
| Recall@5 (overall) | 0.12 | >= 0.17 (OFF + 0.05) |
| Probe-level recall misses | 44/50 probes missed at @5 | <= 22 misses (reduce by >=50%) |
| Ranking inversions in top-10 but outside top-5 | 0 probes | keep at 0 |
| Empty results | 0 probes | keep at 0 |

### Out of Scope

- Adding new probes (same fixture across all phases per invariant #1)
- Replacing cocoindex's reranker config (this trial is spec-memory only)
- Removing Qwen or ms-marco from the sidecar (allowlist additions only, no deletions)
- Fine-tune training data work (Phase 3 if needed)

### Files likely to be modified

- `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py` (allowlist + revision pin, if not env-driven)
- `.opencode/skills/system-rerank-sidecar/scripts/start.sh` (env passthrough if revisions are env-driven)
- `.opencode/skills/system-rerank-sidecar/.env.local` or equivalent — bge-v2-m3 config
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:54` — provider model field (point local provider at bge-v2-m3)
- `002-bge-v2-m3-trial/evidence/` — new evidence files
- `002-bge-v2-m3-trial/implementation-summary.md` — fill §Benchmark Results + §Verdict
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | bge-reranker-v2-m3 in sidecar allowlist + revision-pinned | `RERANK_ALLOWED_MODELS` env or registry includes the model; revision SHA recorded |
| REQ-002 | Model weights pre-fetched + sidecar `/warmup` returns 200 | `curl /warmup` output captured |
| REQ-003 | Sidecar runs bge-v2-m3 successfully on the 50-probe fixture | No OOM, no crash; full fixture completes |
| REQ-004 | Benchmark output with per-probe deltas vs OFF baseline | `evidence/bge-v2-m3-bench-<date>.json` |
| REQ-005 | All Phase 1 target metrics from §Scope met | Each row in the targets table has a "Phase 2 achieved" column with PASS / FAIL |
| REQ-006 | Generic arc invariant gates met: ≥OFF + 3 hits, p95 < +500ms vs OFF, no OOM | Recorded in implementation-summary §Verdict |
| REQ-007 | Strict-validate exit 0 | `bash validate.sh <packet> --strict` |
| REQ-008 | Phase verdict | PROMOTE (flip spec-memory default to bge-v2-m3, arc closes) or HOLD (escalate to Phase 3 with bge baseline as the new comparison floor) |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | If PROMOTE: spec-memory default flipped + at least one existing memory_search shows `cross_encoder_rerank` signal | Live verification snippet in §Verification |
| REQ-010 | Update arc parent + sidecar skill docs to reflect new default | Diff captured in §Commit Handoff |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All Phase 1 target metrics from §Scope have PASS/FAIL outcomes
- **SC-002**: PROMOTE / HOLD verdict is supported by the benchmark data
- **SC-003**: No regression in p95 latency vs OFF beyond the +500ms invariant
- **SC-004**: If PROMOTE, end-to-end verification shows `cross_encoder_rerank` signal in real memory_search output
- **SC-005**: Strict-validate exit 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| bge-v2-m3 OOMs on MPS at 50-doc batches (same shape as Qwen failure) | Medium | Phase blocked or auto-HOLD | Test on CPU first; if MPS needed, cap top_k to 30 (use packet 008's cap mechanism if it shipped) |
| bge-v2-m3 latency exceeds the rerank-gate timeout on CPU | Medium | HOLD verdict | Latency is a hard gate; HOLD is the correct verdict if it fails |
| bge-v2-m3 rank quality matches OFF baseline (no improvement, no regression) | Low-Medium | HOLD but unclear next step | Treat as HOLD; Phase 3 still applies because "matches OFF" doesn't justify shipping a more complex pipeline |
| Allowlist mechanism is brittle (memory: sidecar v0.2.0 added per-model locks, this is the first non-Qwen non-ms-marco model) | Low | Sidecar refactor scope creep | Constrain Phase 2 to allowlist additions; if the mechanism needs rework, file as a separate sidecar packet |
| HF download fails / model unavailable | Low | Phase blocked | Pre-fetch step in Phase A; document SHA pin |

Dependencies:

- Phase 1 verdict + failure-mode targets
- `system-rerank-sidecar` skill must be running and healthy at start
- Existing 50-probe fixture from `004-spec-memory-rerank-benchmark/`
- HuggingFace network access for the one-time weight download (sidecar dispatch can re-enable network briefly)
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Q1**: Is `RERANK_ALLOWED_MODELS` an env var (start.sh passthrough) or a registry constant in `rerank_sidecar.py`? Both code paths exist per session memory; the dispatch needs to find out and modify the correct one. Plan §Phase A step 1 reads sidecar source first.
- **Q2**: Does the sidecar's `/rerank` HTTP body already pass the model name through, or is the model implicit by daemon-startup config? cocoindex's `HttpSidecarRerankerAdapter` sends `model: self.model_name` in body per memory; spec-memory's cross-encoder.ts line 478 follows the same pattern. Confirm before dispatch.
- **Q3**: If bge-v2-m3 PROMOTEs, should cocoindex also switch from Qwen to bge-v2-m3 for consistency? Out of scope for this packet (cocoindex has its own benchmarks); flag for a future arc.
<!-- /ANCHOR:questions -->
