---
title: "Implementation Summary: Live-Mode Scoring Fix"
description: "Shipped the live-mode scorer fix (fold stated assets into resourceRecall + drop the unobservable intent term in live d1-intra), proved it RED/GREEN with zero new regressions, and re-baselined all 10 live runs."
trigger_phrases:
  - "live scoring fix summary"
  - "asset fold intent drop results"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/054-smart-routing-benchmark-program/001-live-scoring-fix"
    last_updated_at: "2026-07-09T05:03:15Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped the live-mode scorer fix and re-baselined 10 runs"
    next_safe_action: "Wire the drift guard/optimize into CI"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01Ht7J9NZTEBBXwzTeNvras9"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Fix both artifacts; re-baseline all 10 live runs — operator-locked"
---
# Implementation Summary: Live-Mode Scoring Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | 001-live-scoring-fix |
| **Completed** | Fix + test + re-baseline landed |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built
Two live-tier scorer corrections in `score-skill-benchmark.cjs`: fold the model's stated `assets` channel into `resourceRecall` (credit correct asset routing), and score live `d1-intra` on resource recall alone (the live prompt never asks the intent key, so the intent term was an always-zero halving). Router mode is untouched; D3 over-routing stays references-only.

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
`live-asset-recall.vitest.ts` proves both behaviors RED/GREEN (3 assertions fail on the pre-fix scorer, 5/5 pass after) plus router-tier regression guards. The full scorer suite fails no test that passed before (origin 15 → fixed 12, the 3-test delta is this new file). Re-baselining all 10 live runs with the fixed scorer moved every child up:

| Target | Old Mode-B | New Mode-B |
|--------|-----------|-----------|
| code-quality | 31 | 100 |
| code-opencode | 56 | 88 |
| code-webflow | 57 | 86 |
| deep-research | 80 | 91 |
| deep-review | 71 | 87 |
| deep-improvement | 62 | 80 |
| deep-ai-council | 76 | 90 |
| code-review | 0 | 69 → **100** (after packet 002) |
| sk-code hub | 67 | 66 |
| system-deep-loop hub | 93 | 93 |

The two 0.00 cases (code-review, code-quality — all-asset gold) confirm the root cause: correct asset routing was landing in a channel `resourceRecall` ignored.
<!-- /ANCHOR:how-delivered -->
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:decisions -->
## Key Decisions
Fold assets into recall (not D3) so correct routing counts without re-introducing the over-routing "waste" artifact the design deliberately avoided. Drop the intent term for live only; router mode keeps the intent+resource blend since the key is deterministically observable there.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification
RED/GREEN unit test; full-suite no-new-regression (origin vs fixed); Mode-A byte-identical (fix is live-only). Re-baselined reports captured under each skill's `benchmark/live-mode-b/`.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations
Re-dispatch introduces model variance vs the old numbers; the unit test isolates the scorer delta. 12 pre-existing scorer/parser test failures (hardcoded counts, sk-design headline, commandRecipe, sweep fixtures) are unrelated and out of scope.
<!-- /ANCHOR:limitations -->
