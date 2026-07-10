---
title: "Task Breakdown: Live-Mode Scoring Fix"
description: "Task-level status for the live-mode scoring fix: scorer change, RED/GREEN test, regression check, and the 10-run live re-baseline."
trigger_phrases:
  - "live scoring fix tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/054-smart-routing-benchmark-program/001-live-scoring-fix"
    last_updated_at: "2026-07-09T05:03:15Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the live-scoring-fix task list"
    next_safe_action: "Re-baseline the 10 live runs with the fixed scorer"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01Ht7J9NZTEBBXwzTeNvras9"
      parent_session_id: null
    completion_pct: 40
    open_questions: []
    answered_questions:
      - "Fix both artifacts; re-baseline all 10 live runs — operator-locked"
---
# Task Breakdown: Live-Mode Scoring Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

Legend: `[x]` done · `[~]` in progress · `[ ]` not started.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Phase 1: Scorer change
- [x] Live-tier asset fold into `resourceRecall` (`scoreScenario`)
- [x] Live-tier intent-drop: `d1-intra = resourceRecall` (`scoreD1Intra`); router tier keeps the blend
- [x] D3 over-routing kept on the references channel (no waste artifact)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Phase 2: Test + regression
- [x] `live-asset-recall.vitest.ts` — 5 assertions (asset credit, absent-asset 0, intent-drop, router blend, router no-fold)
- [x] RED proven: 3 assertions fail on the pre-fix scorer
- [x] GREEN proven: 5/5 pass after the fix
- [x] No new regressions: pre-fix scorer fails the same 5 tests as post-fix (5 pre-existing, unrelated)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Phase 3: Re-baseline
- [~] Re-dispatch all 10 live runs (8 children + 2 hubs) with the fixed scorer
- [ ] Refresh the parent circularity meter with corrected numbers
- [ ] Confirm Mode-A baselines byte-identical (fix is live-only)
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [~] Fix + test landed; re-baseline captured and the parent meter corrected.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Parent program**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
