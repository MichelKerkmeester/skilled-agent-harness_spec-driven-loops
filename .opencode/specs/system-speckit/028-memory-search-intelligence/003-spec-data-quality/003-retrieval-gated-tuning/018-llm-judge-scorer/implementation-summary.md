---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. Scaffolded phase that will feed a real LLM-as-judge semantic quality score into the already-shipped qualityScore multiplier behind a default-off flag and prove its marginal value over the form-only scorer first. No code change has landed."
trigger_phrases:
  - "llm judge quality scorer"
  - "c5 quality score multiplier"
  - "semantic quality score fusion"
  - "qualityscore better input"
  - "llm as judge memory quality"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/003-retrieval-gated-tuning/018-llm-judge-scorer"
    last_updated_at: "2026-07-06T18:49:49.195Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase impl doc for C5 llm-judge scorer scaffold"
    next_safe_action: "Hold for implementation, no code change has landed yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-llm-judge-scorer |
| **Completed** | Not yet, status PLANNED |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Write-path LLM-as-judge scorer

The phase will add an LLM-as-judge scorer that computes a normalized `[0,1]` semantic quality score for a document on the write path and persists it into the existing `quality_score` column at `vector-index-schema.ts:643`. It writes the shipped column, never a new column and never a second quality DB. The scorer reads and scores only and never mutates the authored body, the no-body-mutate rail. It clamps an out-of-range judge value before persistence, caches by `content_hash` so an unchanged document is not re-scored, and falls back to the form-only score when the judge call fails or times out so indexing never blocks on the LLM.

### Flag-gated fusion input swap

The phase will add a default-off flag in `applyValidationSignalScoring` at `stage2-fusion.ts:272-288` so `qualityScore` reads the judge value only when the flag is on. The judge is a better input to the already-shipped plus-or-minus-10-percent band, not a new lane. The `0.9 + (quality * 0.2)` mapping, the `clampMultiplier` bound, the fixed `[0.9, 1.1]` range and the `0.5` form-only fallback all stay unchanged when the flag is off, so the flag-off prod path is byte-identical to baseline.

### Form-only-versus-judge comparison and governance value

The phase will add a comparison harness that scores a corpus sample with both the form-only scorer and the judge and reports agreement and divergence, the evidence a reviewer reads before any promotion. The semantic score is surfaced as a first-class signal in the sweep and doctor reports even with the consumer flag off, so the governance half ships on cost with zero retrieval risk.

### Files Changed

This table lists the planned changes. None have been applied.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Planned reuse | Persist the judge score into the existing `quality_score` column at line 643 with no new column and no migration |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` | Planned modify | Add a default-off flag-gated input swap in `applyValidationSignalScoring` that leaves the band, the `0.9 + (quality * 0.2)` mapping and the `0.5` form-only default unchanged when off |
| `<llm-judge scorer module>` | Planned create | Compute a normalized `[0,1]` semantic quality score on the write path, host module resolved in setup against the live indexing path |
| `<form-vs-judge comparison harness>` | Planned create | Score a corpus sample both ways and report agreement and divergence, host directory resolved in setup against the eval harness layout |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planned rollout computes and persists the judge score on the write path, surfaces it to the sweep and doctor reports as a governance signal, and lands the fusion consumer default-off. The form-only-versus-judge comparison runs on a corpus sample to measure the judge's marginal value over the form-only scorer. The flag-off prod path stays byte-identical to baseline, and promotion of the judge to the default fusion input holds behind a prod-mode completeRecall@3 rise through 015-prodmode-recall-gate.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Improve the input, not the band | The plus-or-minus-10-percent multiplier is the shipped governance choice, so C5 feeds a better score into an existing band rather than widening it or opening a new lane |
| Write the existing `quality_score` column | A parallel column or second quality DB risks divergent verdicts against the live form-only path, so the judge reuses the shipped column and the shipped multiplier |
| Ship the consumer default-off | A retrieval-class input change carries prod risk, so the lane lands inert and the form-only score stays the default until the judge is proven and explicitly enabled |
| Prove marginal value before promotion | The retrieval nudge is capped by the deliberately narrow band, so the form-only-versus-judge comparison is a P0 blocker before any promotion is considered |
| Cache by `content_hash` and fall back on failure | A per-document judge call adds latency and variance, so an unchanged document is not re-scored and a failed call falls back to the form-only score |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No verification has run. The checks below are planned and currently unmet.

| Check | Result |
|-------|--------|
| With the consumer flag off, prod-mode retrieval is byte-identical to baseline including the `0.5` form-only fallback | PLANNED, not yet run |
| A scorer unit test shows the judge value clamped to `[0,1]` and the authored body unchanged | PLANNED, not yet run |
| An unchanged `content_hash` is not re-scored and a judge failure falls back to the form-only score | PLANNED, not yet run |
| The form-only-versus-judge comparison emits per-document scores plus an agreement and divergence readout | PLANNED, not yet run |
| The fusion change leaves the `0.9 + (quality * 0.2)` band and the `[0.9, 1.1]` range untouched | PLANNED, not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a scaffold. No code change has landed and no check has passed.
2. **Promotion gate.** The judge stays default-off and unpromoted until a prod-mode completeRecall@3 rise through 015-prodmode-recall-gate beats baseline.
3. **Marginal value unproven.** The retrieval nudge is capped by the narrow band, so a judge that barely differs from the form-only scorer buys little until the comparison readout proves otherwise.
4. **Open host questions.** The write or index module that owns `quality_score` population and the comparison harness host directory are resolved in plan.md against the live indexing path and the eval harness layout.
5. **Open rubric question.** The judge model, prompt and the rubric-to-`[0,1]` mapping that keeps the score comparable to the form-only metric in the same band are resolved in plan.md.
<!-- /ANCHOR:limitations -->

---
