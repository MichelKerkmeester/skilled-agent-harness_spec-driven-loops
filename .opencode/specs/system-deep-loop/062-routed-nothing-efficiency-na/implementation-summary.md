---
title: "Implementation Summary: D3 efficiency N/A for routed-nothing positive scenarios"
description: "Records removing the scoreD3 routed-nothing 1.0 salvage that floored total recall failures at 31, verified fitted byte-identical across 33 corpora with only routed-nothing holdout scores dropping to their honest 0."
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/062-routed-nothing-efficiency-na"
    last_updated_at: "2026-07-11T22:20:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "scoreD3 salvage removed + re-baselined; fitted 0/33 changed, holdout honest"
    next_safe_action: "Complete"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl/062-routed-nothing-efficiency-na"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: D3 efficiency N/A for routed-nothing positive scenarios

<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | 062-routed-nothing-efficiency-na |
| **Status** | Complete |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built
A one-branch fix to `scoreD3` in `score-skill-benchmark.cjs`: a positive scenario (one with expected-resource
gold) that routes nothing now returns `{ score: null, proxy: 'no-routing' }` instead of `score: 1`. Efficiency is
undefined when nothing was routed, so the dimension drops from the weighted `modeAScore` and the row is judged on
recall (D1-intra + D2) alone — a total recall miss scores an honest 0 rather than the ~31 floor the old salvage
produced. A unit test pins the new behavior.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
The 69-point generalization gap that packet 061 surfaced on cli-opencode / mcp-click-up was traced to its root:
every holdout scoring exactly 31 had `routedCount === 0` and `d3.score === 1`. A blast-radius scan across all
corpora, split by stage, proved the salvage fires on 0 fitted routing scenarios, 0 negatives, and only 5 holdout
scenarios — so the fix could be made without touching any fitted score. After the change, a before/after
re-baseline (post-061 `after.jsonl` vs post-fix `after2.jsonl`) isolated the effect.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions
Return `null` (efficiency not-applicable), not `0` and not the prior `1`: null matches the existing no-positive-gold
convention, drops the dimension cleanly, and avoids over-penalizing a row that still earns partial D1-intra credit.
The negative branch (routing nothing = suppression success) and the over-routing computation are untouched.
Recorded in `decision-record.md` ADR-001.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification
Unit: the new test asserts a positive scenario with an empty router result scores `d3.score === null`,
`d3.proxy === 'no-routing'`, and `modeAScore === 0`. The stage-aware describe runs 6/6; the full deep-improvement
suite is 427 passed / 22 failed / 15 skipped — the same 22 pre-existing failures as before, +1 new passing test
(0 regressions). Re-baseline: 0 fitted-aggregate changes across all 33 corpora (after vs after2), so no verdict
moves and 061's shipped numbers stand. Holdout numbers are now honest — routed-nothing holdouts drop 31 → 0
(cli-opencode / mcp-click-up gap 69 → 100; cli-claude-code 34 → 50), while routed-something holdouts are unchanged
(cli-external 84, mcp-figma 100, mcp-tooling 92).
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations
A keyword-only Mode-A router scoring a decontaminated / `blindToRouterKeywords` holdout 0 is honest for router
coverage, but it is not a live-model generalization score — those holdouts are designed for semantic (Mode-B)
evaluation. Wiring Mode-B holdout scoring so the gap reflects model generalization rather than keyword coverage is
a documented follow-on, out of this packet's scope. The seven pre-existing `skill-benchmark.vitest.ts` failures
(cli-opencode relocation, router content, D5/commandRecipe fixtures) are unrelated and untouched.
<!-- /ANCHOR:limitations -->
