---
title: "Feature Specification: D3 efficiency is not-applicable when a positive scenario routes nothing"
description: "Stop scoreD3 from crediting full efficiency (1.0) to a positive scenario that routed nothing — a total recall miss floored at 31 by that salvage. Return null so the row is judged on recall alone, making Mode-A holdout/generalization numbers honest without touching any fitted score."
trigger_phrases:
  - "d3 efficiency not applicable"
  - "routed nothing scoring"
  - "holdout generalization honesty"
  - "skill benchmark"
  - "lane c"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/062-routed-nothing-efficiency-na"
    last_updated_at: "2026-07-11T22:20:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Fixed D3 routed-nothing salvage + re-baselined; fitted byte-identical, holdout honest"
    next_safe_action: "Complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl/062-routed-nothing-efficiency-na"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: D3 efficiency is not-applicable when a positive scenario routes nothing

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-11 |
| **Branch** | `skilled/v4.0.0.0` (no dedicated branch — `--skip-branch`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The stage-aware scorer (packet 061) added a fitted-vs-holdout split and a `generalizationGap`. It immediately surfaced a large gap on cli-opencode and mcp-click-up (fitted 100 / holdout 31), which looked like router overfitting. The root cause is not overfitting: it is a scoring salvage in `scoreD3`.

For a positive scenario (one with expected-resource gold) that routes **nothing**, `scoreD3` returns `score: 1` — "nothing routed, nothing wasted, perfect efficiency." But routing nothing when there WAS gold to route is a total recall failure. D1-intra and D2 correctly score 0; the spurious D3=1 then drags the weighted row score up from an honest 0 to a floor of ~31 (`(0·13 + 0·20 + 1·15) / 48 ≈ 31`). Every holdout that scores exactly 31 is a scenario whose decontaminated prompt the keyword router could not match, so it routed nothing.

The consequence is a dishonest number: a router that completely fails a decontaminated holdout is credited 31, and the generalization gap understates the failure.

### Purpose
Make routing efficiency **not-applicable** when a positive scenario routes nothing: return `null` (as D3 already does for the no-positive-gold case) so the dimension drops out of the weighted score and the row is judged on recall alone. A total recall miss then scores an honest 0, not 31 — with zero change to any fitted aggregate (no fitted scenario routes nothing).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `scoreD3` in `score-skill-benchmark.cjs`: when a positive scenario routes nothing (`routed === 0` past the no-gold and negative guards), return `{ score: null, proxy: 'no-routing' }` instead of `score: 1`.
- A unit test asserting a positive routed-nothing scenario has `d3.score === null` and `modeAScore === 0` (not 31).
- A re-baseline confirming every fitted aggregate is byte-identical and only routed-nothing holdout scores move (to their honest 0).

### Out of Scope
- The deeper measurement-design question: decontaminated / `blindToRouterKeywords` holdouts are meant for semantic (Mode-B) evaluation; a keyword-only Mode-A router scoring them 0 is honest but is not the same as a live-model generalization score. Wiring Mode-B holdout evaluation is a separate follow-on.
- Any change to dimension weights, the D5 hard gate, verdict thresholds, or the negative/no-gold branches of D3.
- Authoring or editing the holdout fixtures themselves.

### Files to Change (this packet)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` | Modify | `scoreD3`: routed-nothing positive scenario → `score: null` (not `1`) |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts` | Modify | Add the routed-nothing → D3 N/A → score 0 assertion |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | D3 is not-applicable for routed-nothing positive scenarios | `scoreD3` returns `score: null` (proxy `no-routing`) when a positive scenario routes nothing; the negative and no-positive-gold branches are unchanged |
| REQ-002 | Honest recall-only score | A positive scenario that routed nothing scores `modeAScore === 0` (D3 dropped from the weighted average), not the ~31 floor |
| REQ-003 | Fitted aggregate unchanged | Every corpus's fitted `aggregateScore` is byte-identical post-fix vs post-061 (0 fitted scenarios route nothing) — verdicts unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Holdout numbers become honest | Routed-nothing holdouts drop from 31 → 0; routed-something holdouts are unchanged (e.g. cli-opencode / mcp-click-up gap 69 → 100; cli-external 84, mcp-figma 100 unchanged) |
| REQ-005 | No new test regressions | The deep-improvement vitest suite gains one passing test with the same pre-existing failure set (0 new regressions) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The new unit test proves a positive routed-nothing scenario scores D3 `null` and `modeAScore` 0 (evidence: `vitest run`).
- **SC-002**: A before/after re-baseline shows 0 fitted-aggregate changes across all 33 corpora and the expected holdout drops (evidence: after vs after2 diff).
- **SC-003**: No dimension weight / D5 gate / verdict threshold changed (evidence: `git diff`).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The fix silently shifts a fitted score | High | Re-baseline proves 0 fitted changes across 33 corpora; blast-radius scan showed 0 fitted scenarios route nothing |
| Risk | `null` D3 mishandled downstream (recipe cap, report) | Low | The recipe-cap code already guards `typeof d3.score === 'number'`; report renders `—` for null |
| Dependency | Packet 061 (fitted/holdout split + generalization reporting) | Anchor | 062 corrects a scoring salvage that 061's holdout reporting exposed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One added branch in `scoreD3`; no measurable cost.

### Security
- **NFR-S01**: No credential or secret introduced; scoring-logic only.

### Reliability
- **NFR-R01**: Mode-A router-replay stays deterministic; the fitted aggregate is reproducible and byte-identical to the 061 baseline.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Negative scenario that routes nothing: unchanged — the negative branch returns `d1intra.score` (suppression success), never reaching the new guard.
- No-positive-gold scenario: unchanged — already returns `null` before the new guard.
- Positive scenario with no expected intent that routes nothing: D3 null; the row scores on D1-intra's intent-null credit alone (still well below the old 31 floor).

### Error Scenarios
- A downstream consumer that assumed D3 is always numeric: report rendering and recipe capping already tolerate a null D3.

### State Transitions
- Re-baseline compares post-061 (`after`) vs post-fix (`after2`) so the fitted-unchanged claim is isolated from 061's holdout-exclusion deltas.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | 1 function branch + 1 test |
| Risk | 10/25 | Touches core scoring, but blast radius verified 0 fitted; contained to routed-nothing holdouts |
| Research | 8/20 | Root-cause traced from the 061 gap to the D3 salvage; blast radius measured before editing |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open. The deeper Mode-B semantic-holdout evaluation is a documented follow-on, not a gap in this packet.
<!-- /ANCHOR:questions -->
