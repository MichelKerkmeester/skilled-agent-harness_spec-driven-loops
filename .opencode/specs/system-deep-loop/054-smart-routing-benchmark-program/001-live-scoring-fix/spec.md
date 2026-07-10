---
title: "Feature Specification: Live-Mode Scoring Fix (asset recall + intent-drop)"
description: "Live-mode benchmark scores under-represented true routing quality: asset-gold paths landed in a channel resourceRecall ignores, and live d1-intra was halved by an intent term the live prompt never asks for. This fixes both so live scores reflect real routing."
trigger_phrases:
  - "live scoring fix"
  - "asset recall fold"
  - "live intent drop"
  - "resourceRecall assets channel"
  - "skill benchmark live mode"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/054-smart-routing-benchmark-program/001-live-scoring-fix"
    last_updated_at: "2026-07-09T05:03:15Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the live-scoring-fix spec"
    next_safe_action: "Re-baseline the 10 live runs with the fixed scorer"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/live-asset-recall.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01Ht7J9NZTEBBXwzTeNvras9"
      parent_session_id: null
    completion_pct: 40
    open_questions: []
    answered_questions:
      - "Fix both artifacts (asset fold + intent drop); re-baseline all 10 live runs — operator-locked"
---
# Feature Specification: Live-Mode Scoring Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

## 1. METADATA
<!-- ANCHOR:metadata -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-09 |
| **Branch** | `001-live-scoring-fix` |
<!-- /ANCHOR:metadata -->

---

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->

### Problem Statement
The parent program's live (Mode-B) scores under-represented real routing quality. Two harness artifacts caused it: (1) the sk-doc gold puts `assets/*` targets in `expected_resources`, but the live model correctly reports assets on a *separate* `assets` channel that `resourceRecall` never compares against — so all-asset-gold children (`code-review`, `code-quality`) scored 0.00 despite routing correctly; (2) live `d1-intra = 0.4·intentRecall + 0.6·resourceRecall`, but the live prompt asks only for surface + resources, never the internal `INTENT_SIGNALS` key, so `intentRecall` is structurally 0 and flatly halves every live score.

### Purpose
Live-mode benchmark scores reflect true routing quality: correct asset routing is credited, and live `d1-intra` is not depressed by an unobservable intent term.
<!-- /ANCHOR:problem -->

---

## 3. SCOPE
<!-- ANCHOR:scope -->

### In Scope
- Live-tier only: fold the model's stated `assets` into the observed set used for `resourceRecall` (and thus `D2`), while leaving `D3` over-routing on the references channel (preserving the deliberate no-waste behavior).
- Live-tier only: score `d1-intra` on `resourceRecall` alone (drop the unobservable intent term); router tier keeps the intent+resource blend.
- A RED/GREEN unit test guarding both behaviors + router-tier regression.
- Re-baseline all 10 live runs (8 children + 2 hubs) with the fixed scorer; refresh the parent packet's circularity meter.

### Out of Scope
- Router-mode (Mode-A) scoring — unchanged; the fix is live-tier-gated.
- The advisory `assetRecall` lane and its weight — unchanged.
- The 5 pre-existing scorer/parser test failures (hardcoded sk-code scenario counts + commandRecipe drift) — they fail identically on the pre-fix scorer; out of this fix's scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.../skill-benchmark/score-skill-benchmark.cjs` | Modify | Live-tier asset fold + intent-drop in `scoreScenario`/`scoreD1Intra` |
| `.../skill-benchmark/tests/live-asset-recall.vitest.ts` | Create | RED/GREEN guard for both behaviors |
| `.../{sk-code,system-deep-loop}/*/benchmark/live-mode-b/**` | Modify | Re-baselined live reports |
| `../054 packet docs` | Modify | Corrected circularity meter |
<!-- /ANCHOR:scope -->

---

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Live recall credits correctly-routed assets | A live scenario whose gold asset is stated on the `assets` channel scores `resourceRecall = 1` |
| REQ-002 | Live `d1-intra` is resource-recall only | Live `d1-intra.score == resourceRecall`; router tier still blends intent+resource |
| REQ-003 | No new regressions | The full scorer vitest suite fails no test that passed on the pre-fix scorer |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Re-baseline reflects the fix | All 10 live runs re-scored; parent circularity meter updated with corrected numbers |
<!-- /ANCHOR:requirements -->

---

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->

- **SC-001**: RED/GREEN test proves both behaviors (fails on the pre-fix scorer, passes after). — target
- **SC-002**: Re-baselined live scores rise for asset-gold children (`code-review`/`code-quality` no longer 0.00) and reflect intent-drop. — target
- **SC-003**: Router-mode (Mode-A) baselines are byte-identical (fix is live-only). — target
<!-- /ANCHOR:success-criteria -->

---

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Folding assets distorts D3 over-routing (the design's stated concern) | Medium | Fold into recall only; D3 stays references-only (unit-tested) |
| Risk | Re-dispatch introduces model variance vs the old numbers | Low | The unit test isolates the scorer delta; re-baseline is advisory |
| Dependency | Live re-dispatch of 10 targets (gpt-5.5-fast) | Low | Sequential background run |
<!-- /ANCHOR:risks -->

---

## 7. OPEN QUESTIONS
<!-- ANCHOR:questions -->

- None — the fix direction and re-baseline scope were operator-locked.
<!-- /ANCHOR:questions -->
