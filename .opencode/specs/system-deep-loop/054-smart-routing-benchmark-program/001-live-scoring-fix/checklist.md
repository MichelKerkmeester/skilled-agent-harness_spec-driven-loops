---
title: "Verification Checklist: Live-Mode Scoring Fix"
description: "QA checklist for the live-mode scoring fix: asset-recall fold, intent-drop, RED/GREEN proof, no new regressions, and the re-baseline."
trigger_phrases:
  - "live scoring fix checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/054-smart-routing-benchmark-program/001-live-scoring-fix"
    last_updated_at: "2026-07-09T05:03:15Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the live-scoring-fix checklist"
    next_safe_action: "Re-baseline the 10 live runs with the fixed scorer"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/live-asset-recall.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01Ht7J9NZTEBBXwzTeNvras9"
      parent_session_id: null
    completion_pct: 40
    open_questions: []
    answered_questions:
      - "Fix both artifacts; re-baseline all 10 live runs — operator-locked"
---
# Verification Checklist: Live-Mode Scoring Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P0] Root cause confirmed: asset-gold scored on the references channel; intentRecall structurally 0 live [EVIDENCE: CR-R01 emitted the gold asset on the assets channel yet resourceRecall=0] (verified)
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-002 [P0] Fix is live-tier-gated; router mode untouched [EVIDENCE: `liveTier = tier === 'live'` guards both branches] (verified)
- [x] CHK-003 [P1] Comment hygiene: durable WHY only, no artifact ids/paths in code comments (verified)
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-004 [P0] RED: 3 fix-guarding assertions fail on the pre-fix scorer [EVIDENCE: origin scorer → 3 failed | 2 passed] (verified)
- [x] CHK-005 [P0] GREEN: 5/5 pass after the fix [EVIDENCE: live-asset-recall.vitest.ts 5 passed] (verified)
- [x] CHK-006 [P0] No new regressions [EVIDENCE: pre-fix and post-fix both fail the same 5 pre-existing tests, 76 passed] (verified)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
No additional fix-completeness checklist items were recorded in the existing checklist.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
No security-specific checklist items were recorded in the existing checklist.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-007 [P1] Parent packet ADR/meter updated with the corrected interpretation [EVIDENCE: parent implementation-summary + this child] (verified)
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
No file-organization checklist items were recorded in the existing checklist.
<!-- /ANCHOR:file-org -->

### Sign-off
- [~] CHK-008 [P1] Re-baseline captured; parent circularity meter shows corrected live numbers

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Status |
|----------|--------|
| Scorer fix + RED/GREEN test | Verified |
| No new regressions | Verified |
| Re-baseline + meter refresh | In progress |
<!-- /ANCHOR:summary -->
