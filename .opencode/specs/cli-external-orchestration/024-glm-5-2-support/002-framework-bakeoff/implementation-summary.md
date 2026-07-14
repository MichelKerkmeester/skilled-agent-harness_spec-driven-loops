---
title: "Implementation Summary: Phase 2: framework-bakeoff"
description: "GLM-5.2 framework bakeoff (run 008): COSTAR primary, TIDD-EC fallback, avoid RCAF — empirical on strict validators via the deterministic oracle."
trigger_phrases:
  - "glm-5.2 framework bakeoff"
  - "benchmark 008"
  - "glm-5.2 costar empirical"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/024-glm-5-2-support/002-framework-bakeoff"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Bakeoff 008 complete; COSTAR primary, separable verdict"
    next_safe_action: "Promote in 003-promote-results"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles/glm-5.2-frameworks.json"
      - ".opencode/skills/sk-prompt-models/benchmarks/008-glm-5.2-prompt-framework/synthesis.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "glm-support-002-framework-bakeoff"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Best framework for GLM-5.2 = COSTAR (best-of-tied perfect tier); RCAF weakest"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-framework-bakeoff |
| **Completed** | 2026-06-28 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The empirical prompt-framework bakeoff for GLM-5.2 (run `008-glm-5.2-prompt-framework`). It ran the model-benchmark sweep engine over 5 frameworks × 3 invalid-dominant strict validators × 3 samples = 45 real `zai-coding-plan/glm-5.2` dispatches, graded by the deterministic hidden-test oracle (`--grader noop`, no LLM-judge bias). Applying the lesson from kimi's saturated run 006, strict validators were used from the start so correctness could separate.

**Verdict (run status `separable`):** per-framework correctness costar 1.0 = tidd-ec 1.0 = cidi 1.0 = race 1.0 (perfect tier) > rcaf 0.976 (the only sub-perfect framework, also worst format adherence 0.889). Trust verdict TIE among the perfect tier (top-pair costar vs tidd-ec, margin 0, 90% CI [0,0]). **COSTAR is best-of-tied** — perfect correctness, tersest output (13 median words vs tidd-ec 38, cidi/race 94), and cross-model corroborated (also kimi-007 + mimo-004 winner). Phase 003 promotes COSTAR primary / TIDD-EC fallback / avoid RCAF.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles/glm-5.2-frameworks.json` | Created | Bakeoff profile (5 harness frameworks, strict validators, glm-5.2 model, 3 samples/cell) |
| `.opencode/skills/sk-prompt-models/benchmarks/008-glm-5.2-prompt-framework/` | Created | Run outputs: results.json, aggregate.json, synthesis.md, sweep logs |
| `002-framework-bakeoff/improvement/benchmark-run-pointer.json` | Created | Run provenance pointer |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Drove the model-benchmark workflow's own engine (`scripts/model-benchmark/sweep-benchmark.cjs`, the exact step the `/deep:model-benchmark:auto` YAML invokes at its core) directly — a flagged, minimal deviation from running the full YAML state-machine wrapper, chosen for reliable autonomous completion; it cleanly separates the bakeoff (this phase) from promotion (phase 3, which the YAML would auto-run). Pipeline was smoke-tested with one real dispatch (correctness 1.0, 28/28 assertions, 34s) before the full 45-cell run. CRAFT (phase 1's doc-guided default) is NOT in the harness framework registry `[rcaf,race,cidi,tidd-ec,costar]`, so the empirical winner among the five supported frameworks replaces it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Strict validators from the start | Kimi's run 006 saturated on easy fixtures (TIE) and forced a redo; strict validators let correctness separate on run 1 |
| `--grader noop` (deterministic oracle) | Correctness from hidden-test oracle avoids the LLM-judge bias that 149's run 006 judge introduced (it was objectively refuted by the oracle) |
| COSTAR over the equally-correct TIDD-EC/CIDI/RACE | Tersest output (13 median words) + cross-model corroboration (kimi-007, mimo-004); best-of-tied within a correctness TIE |
| Ran the sweep engine directly, not the full YAML | Reliability for an autonomous run; bakeoff/promotion separation matches the phased design; flagged as a deviation |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Sweep run (`sweep-benchmark.cjs --profile glm-5.2-frameworks.json`) | PASS — exit 0, 45 cells, 44 dispatch_ok |
| Per-framework correctness (deterministic oracle) | costar/tidd-ec/cidi/race 1.0, rcaf 0.976 — separable |
| Verdict (sweep aggregate) | TIE on correctness among perfect tier; ranking_key correctness; not saturated |
| 1 failed dispatch | Transient infra (exit -1, dispatch_failed) — excluded from scoring; affected framework perfect on valid cells |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **TIE among the perfect tier** — costar/tidd-ec/cidi/race cannot be statistically separated on correctness; COSTAR is best-of-tied, not a decisive single winner. Confidence: medium.
2. **3 samples/cell** — lighter CI than kimi's 6/cell; sufficient here because correctness separated (rcaf demoted). Phase 4 (more samples/harder fixtures) was therefore not triggered.
3. **CRAFT not measured** — it is not in the harness registry; the empirical result covers only the 5 supported frameworks.
<!-- /ANCHOR:limitations -->
