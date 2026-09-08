---
title: "Implementation Summary: measured cache economics for every model"
description: "What shipped in this phase, the evidence behind each claim, and what was left undone or unverified."
trigger_phrases:
  - "implementation summary"
  - "phase outcome"
  - "verification evidence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/016-cache-optimizer-absorbs-deep-pi/002-port-cache-economics"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Recorded the shipped outcome and its evidence"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".pi/extensions/pi-cache-optimizer/index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-016-002-port-cache-economics"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: measured cache economics for every model

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Status** | Complete |
| **Completed** | 2026-09-08 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Extended `CacheStats` in `.pi/extensions/pi-cache-optimizer/index.ts` with `inputCostUsd`,
`uncachedBaselineCostUsd`, `pricedRequests` and `prefixChurnCount`, resolved pricing from the model
registry `cost` block, and extended the existing stats rendering to show hit rate, cost, the
uncached baseline, savings and churn. Added `tests/cache-economics.test.ts`. A model whose cost
block carries no positive input and cached-read rates renders `unpriced` rather than a zero cost.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built on the record and command that already existed. A second stats file and a second command
were deliberately not introduced.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

**Extend, do not duplicate.** `CacheStats`, its persistence and the stats command already existed
with per-provider adapters; a parallel schema would have split the same data across two files.

**Savings has a stated baseline.** It is `uncachedBaselineCostUsd - inputCostUsd`, where the
baseline is the same input tokens billed fully uncached, and the report says so, so the number is
checkable rather than flattering.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Extension suite | exit 0, 40 -> 56 passing, tsc clean |
| New coverage | Cost arithmetic, the unpriced path, no-cache-fields full-miss accounting, churn detection, and a pre-phase record migrating forward |
| Live route | A real turn through `llmgateway/deepseek-v4-flash-vision-exp` recorded a row: 1 request, 21,764 input tokens, `pricedRequests: 0` because DevPass carries no cost block |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The brief given to the executor asserted, from the fork's own provenance record, that the
OpenAI-shape normalizer already counted a no-cache-fields response as a full miss. It did not:
`getOpenAIRawUsage` returned undefined and dropped the sample, as did the Pi-normalized paths for
openai, claude and gemini. The executor probed the code, contradicted the brief and was correct.
All four adapters now count it. Reported hit rates for those providers will fall, because samples
that were silently discarded are now in the denominator.
<!-- /ANCHOR:limitations -->
