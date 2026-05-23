---
title: "Tasks: bge-reranker-v2-m3 trial [template:level_1/tasks.md]"
description: "T001-T016 covering allowlist config, pre-fetch, wire-up, benchmark, verdict."
trigger_phrases:
  - "011/002 tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/002-bge-v2-m3-trial"
    last_updated_at: "2026-05-21T13:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Wait for Phase 1 verdict"
    blockers:
      - "Phase 1 OFF_DEFICIENT required"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: bge-reranker-v2-m3 trial

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete, `[ ]` open, `[!]` blocked. P-tag: P0 / P1.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T001 | P0 | Confirm Phase 1 OFF_DEFICIENT verdict + read target metrics | `[ ]` | 011/001 impl-summary cite |
| T002 | P0 | Read sidecar source (rerank_sidecar.py, start.sh) — confirm allowlist mechanism | `[ ]` | code citations |
| T003 | P0 | Locate sidecar env config file (.env, .env.local, etc.) | `[ ]` | path |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T004 | P0 | Add bge-v2-m3 to RERANK_ALLOWED_MODELS + pin revision SHA | `[ ]` | env file diff |
| T005 | P0 | Restart sidecar; confirm /health includes bge-v2-m3 | `[ ]` | curl output |
| T006 | P0 | Pre-fetch via /warmup; record load time + RSS | `[ ]` | impl-summary §Warmup |
| T007 | P0 | Direct /rerank smoke test (5 dummy candidates + 1 probe query) | `[ ]` | curl output, sigmoid scores in [0,1] |
| T008 | P0 | Run 50-probe fixture with sidecar pointed at bge-v2-m3 | `[x]` | `evidence/bge-v2-m3-bench-2026-05-21.json`; direct-handler replay completed 50 probes |
| T009 | P0 | Compute per-probe deltas vs Phase 1 OFF baseline | `[x]` | impl-summary §Per-Probe Deltas vs OFF |
| T010 | P0 | Populate Phase 1 targets table with PASS/FAIL outcomes | `[x]` | impl-summary §Targets vs Achieved |
| T011 | P0 | Apply arc invariant gates → verdict (PROMOTE / HOLD) | `[x]` | impl-summary §Verdict = HOLD |
| T012 | P0 | (PROMOTE only) Patch cross-encoder.ts:54 to bge-v2-m3 | `[x]` | Not applicable: HOLD path; no source patch |
| T013 | P0 | (PROMOTE only) Live memory_search showing cross_encoder_rerank signal | `[x]` | Not applicable: HOLD path |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T014 | P0 | Strict-validate this packet + arc parent | `[x]` | `validate.sh <packet> --strict` exit 0; `validate.sh <arc-parent> --strict` exit 0 |
| T015 | P0 | (HOLD only) Update Phase 3 spec with bge-v2-m3 baseline row in target metrics | `[x]` | 003 spec §Open Questions Q1 updated with HOLD baseline |
| T016 | P0 | Commit handoff: exact paths | `[x]` | impl-summary §Commit Handoff |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

T001-T016 with evidence. PROMOTE closes the arc; HOLD escalates to Phase 3 with bge-v2-m3 as the new comparison floor.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- spec.md §3 §Targets section is filled from Phase 1's §Failure Analysis
- spec.md §6 risks cover MPS OOM + latency + allowlist brittleness
- Phase 3 (003-domain-tuned-finetune) inherits the bge-v2-m3 baseline as the model to beat (not OFF) if Phase 2 HOLDs
- Sidecar invariants from arc 008 §Invariants apply (Apache-2.0 only, sigmoid normalization, port-bind primacy)
<!-- /ANCHOR:cross-refs -->
