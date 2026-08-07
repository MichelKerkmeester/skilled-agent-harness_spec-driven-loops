---
title: "Implementation Plan: Live-Mode Scoring Fix"
description: "Plan to fix two live-mode scoring artifacts in the Lane C skill-benchmark scorer (asset-recall fold + intent-drop), prove them with a RED/GREEN test, and re-baseline the 10 live runs."
trigger_phrases:
  - "live scoring fix plan"
  - "asset recall fold plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-smart-routing-benchmark-program/001-live-scoring-fix"
    last_updated_at: "2026-07-09T05:03:15Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the live-scoring-fix plan"
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
# Implementation Plan: Live-Mode Scoring Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Live-tier-gated scorer change: fold the model's stated assets into `resourceRecall`, and score live `d1-intra` on resource recall alone. Router mode is untouched. Prove with a RED/GREEN unit test, then re-baseline the 10 live runs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- The full scorer vitest suite has no new failures vs the pre-fix scorer.
- The new RED/GREEN test fails on the pre-fix scorer and passes after.
- Router-mode (Mode-A) baselines stay byte-identical.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The fix lives entirely in `score-skill-benchmark.cjs` and is `tier === 'live'`-gated. `scoreScenario` builds `observedForRecall = observedResources ∪ observedAssets` for live tier; `scoreD1Intra` scores live `d1-intra` as `resourceRecall`. `D3` over-routing keeps using `observedResources` only, so the deliberate "stated asset is not waste" behavior is preserved.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Scorer change (live asset fold + intent-drop).
2. RED/GREEN unit test + full-suite regression check.
3. Re-baseline the 10 live runs; refresh the parent circularity meter.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- `live-asset-recall.vitest.ts` — deterministic RED/GREEN on synthetic observations (isolates the scorer delta from model variance).
- Full `playbook-mode` + `skill-benchmark` vitest run before/after to prove no new regressions.
- Live re-baseline for the real corrected numbers (advisory; model-nondeterministic).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Impact if Blocked |
|------------|--------|-------------------|
| Live re-dispatch (gpt-5.5-fast) for 10 targets | Available | Re-baseline numbers only; the fix + test do not depend on it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The fix regresses a previously-passing scorer test, or router-mode baselines change.
- **Procedure**: Revert `score-skill-benchmark.cjs` to origin; the change is a single self-contained diff in two functions.
<!-- /ANCHOR:rollback -->
