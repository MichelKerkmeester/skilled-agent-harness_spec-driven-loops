---
title: "Feature Specification: Skill-Benchmark D3/D4 Fidelity Track"
description: "Implement the 011 round-2 (gpt-5.5) recommendation: make D3/D4 measure what they claim. Add a D4-R task-outcome usefulness instrument (separate from the existing hallucination delta), a deferred-asset scoring lane so asset deferral stops inflating D3, and real-phrasing intent synonyms so the router recognizes realistic user wording — without regressing the 251-test suite or the sk-code drift guard."
trigger_phrases:
  - "skill-benchmark fidelity track"
  - "D4-R task-outcome instrument"
  - "deferred-asset scoring lane"
  - "D3 D4 measurement fidelity"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/013-skill-benchmark-fidelity-track"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Opened the fidelity-track build from the 011 round-2 gpt-5.5 research"
    next_safe_action: "Implement Phase 1 intent-synonym reconciliation (no paid runs)"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs"
      - ".opencode/skills/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs"
      - ".opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/011-sk-code-routing-efficiency-remediation/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-benchmark-fidelity-track"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Does a separate task-outcome grader prompt grade reliably, or should the D4-R rubric reuse the existing harness with a new dimension?"
    answered_questions: []
---
# Feature Specification: Skill-Benchmark D3/D4 Fidelity Track

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

## OVERVIEW

Phase 011's round-2 deep research (5 gpt-5.5 iterations, `011-.../research/research.md` §12-18) reached one load-bearing conclusion: **the post-012 D3/D4 numbers are partly measurement artifacts, not skill behavior.** D4 ≈ 49 is graded by a *hallucination* grader (whose own prompt forbids scoring correctness/paths/planning), is n=2, all pre-012, and post-012 D4 is hard-coded `null` in every aggregate — so routine-task usefulness is genuinely UNKNOWN. The asset-deferral slice of the D3 gain is an artifact (folding `expectedAssets` into gold moves D2 by −9.55 pts but D3 by exactly 0.0). A CS-001 prompt-source mismatch and SD-001 intent-signal gaps depress D2 below their true ceilings. This phase fixes the instrument so D3/D4 mean what they claim, then makes the one real recall fix.

**Critical Dependencies**: the 011 round-2 research (the design basis), the skill-benchmark scorer (`score-skill-benchmark.cjs`), the D4 ablation harness (`d4-ablation.cjs`) + the Lane B grader (`model-benchmark/scorer/grader/harness.cjs`), the run orchestrator (`run-skill-benchmark.cjs`), and the report schema (`skill-benchmark-report.v1`).

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete — shipped + verified (D4-R measured 54/100, n=5) |
| **Created** | 2026-06-02 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The benchmark reports D3 50 / D4 49 for sk-code, but round-2 research showed those numbers do not measure what their names claim. D4 reuses `gradeD4` — a hallucination grader — on a routing-analysis answer, never runs in the aggregator (`score-skill-benchmark.cjs:262` hard-codes `D4: { score: null }`; `runD4Ablation` is never called by `run-skill-benchmark.cjs`), and is n=2/pre-012. D3 scores only the model's *stated* route, and asset deferral improves it at zero scored cost because `expected.resources` drops `scenario.expectedAssets` (`score-skill-benchmark.cjs:52-60`). CS-001's per-feature prompt ("Motion CDN… in-view snippet") fires no `MOTION_DEV` intent; SD-001's "gate/IntersectionObserver/smooth-scroll" fire no `IMPLEMENTATION` — both depress D2 below their true ceilings.

### Purpose
Make D3 and D4 honest and complete: a real task-outcome usefulness instrument (D4-R) reported separately from the hallucination delta, a deferred-asset lane so asset deferral is no longer an invisible D3 win, and real-phrasing intent synonyms so the router recognizes realistic user wording — all without regressing the deterministic suite, the drift guard, or report schema v1.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A D4-R task-outcome instrument: a no-write "patch plan + verification commands" dispatch prompt and a task-outcome grader (correctness / verification-fit / contamination / hallucination-risk), reported as a SEPARATE `D4_task_outcome` alongside the existing `D4_hallucination` (never collapsed), integrated into the aggregator and run on LS-001/002/003/004 + SD-002.
- A deferred-asset scoring lane: `expectedAssets` scored as a distinct `assetRecall` / `assetSupport` signal so D3 stays stated-reference efficiency and asset deferral is surfaced, not hidden.
- Real-phrasing intent synonyms in `INTENT_SIGNALS` (`MOTION_DEV`: Motion CDN, in-view, snippet; `IMPLEMENTATION`: gate/gated, IntersectionObserver, smooth-scroll) — a real recall fix, re-verified against the D2 floors.
- Report schema additions (additive only; schema v1 preserved) and honest real-vs-artifact labelling per change.

### Out of Scope
- H2 phase-gating (round-2 confirmed it is unmeasurable — the machine router has "No phase boosts").
- A full observed-cost (read/glob breadth, time-to-first-expected) D3 metric — a larger separate instrument.
- A Webflow concern-overlay taxonomy — only if the synonym fix proves insufficient.
- Editing scenario prompts to match the router (prompt-doctoring) — rejected in favor of synonyms (see plan §3).

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/skill-benchmark/d4-ablation.cjs` | Modify | task-outcome dispatch prompt + task-outcome grading; keep the hallucination path |
| `scripts/model-benchmark/scorer/grader/prompts/system-grader-task-outcome.md` | Create | task-outcome rubric (correctness/verification/contamination/hallucination) |
| `scripts/skill-benchmark/score-skill-benchmark.cjs` | Modify | `assetRecall` dim; surface D4_task_outcome + D4_hallucination separately |
| `scripts/skill-benchmark/run-skill-benchmark.cjs` | Modify | call `runD4Ablation` under an opt-in `--d4` flag; thread results to aggregate |
| `scripts/skill-benchmark/build-report.cjs` | Modify | render the two D4 numbers + assetRecall |
| `sk-code/references/smart_routing.md` + `scripts/skill-benchmark/router-replay.cjs` | Modify | INTENT_SIGNALS real-phrasing synonyms |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | D4-R task-outcome instrument | task-execution prompt + task-outcome grader; `runD4Ablation` integrated into the aggregator; reported as a SEPARATE `D4_task_outcome`, never collapsed with `D4_hallucination`; runs on LS-001/002/003/004 + SD-002 |
| REQ-002 | Deferred-asset lane | `expectedAssets` scored as a distinct signal; D3 stays stated-reference efficiency; the report shows asset support rather than hiding deferral as a D3 win |
| REQ-004 | No regression / schema-safe | full deep-improvement vitest suite green; `sk-code-router-sync.vitest.ts` green; `skill-benchmark-report.v1` preserved (fields added, none broken) |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Intent-synonym reconciliation | `MOTION_DEV` + `IMPLEMENTATION` recognize the realistic CS-001/SD-001 wording; D2 rises with no D2 floor breach on the round-1 guard scenarios |
| REQ-005 | Honest real-vs-artifact reporting | each shipped change is labelled fidelity-fix (measurement honesty) or real-behavior-gain in the report and the implementation summary |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A post-remediation D4-R run produces a real `D4_task_outcome` over ≥5 routine scenarios, distinct from `D4_hallucination`, with per-scenario evidence — replacing the "UNKNOWN" verdict from round-2.
- **SC-002**: The deterministic vitest suite (251 + new tests) and the sk-code drift guard stay green; the router replay shows D2 at-or-above the round-1 floors with the synonym fix; the report distinguishes real gains from fidelity fixes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | D4-R live runs cost paid API (gpt-5.5 + grader) | Medium | opt-in `--d4` flag, off in CI; flag cost before the run; mock grader path for deterministic tests |
| Risk | Task-outcome grader is itself noisy/non-deterministic | Medium | rubric-anchored prompt; report per-axis sub-scores + raw grader objects for audit; never collapse with hallucination |
| Risk | Synonyms over-route and breach a D2/D3 floor | Medium | re-run the round-1 regression guard (D2 floors, surfaceMatch, drift green) before shipping the synonyms |
| Risk | Schema change breaks report consumers | High | additive fields only; keep `schemaVersion: skill-benchmark-report.v1`; back-compat adapter on the scorer |
| Dependency | 011 round-2 research | — | this phase implements its §16 recommendation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should D4-R use a new standalone grader prompt or a new dimension inside the existing harness? (Spike the grader on LS-001/LS-002 before committing.)
- Does the deferred-asset lane belong in the aggregate verdict or stay an advisory side-signal until D4-R corroborates asset usefulness?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Router-mode replay stays deterministic and sub-second; the paid D4-R path is opt-in and never on the CI hot path.

### Security
- **NFR-S01**: The D4-R skill-off dispatch keeps the contamination guard (`observedReads==0` / hook disabled) so a leaked skill read invalidates the pair rather than producing a false usefulness number.

### Reliability
- **NFR-R01**: All new report fields are additive; absent D4-R data renders as `unscored`, never as a fabricated score.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A scenario with `expectedAssets` but no `expectedResources`: `assetRecall` scores independently; D3 is unaffected.

### Error Scenarios
- D4-R dispatch fails or skill-off is contaminated: the pair is dropped and the row renders `unscored` with a reason, mirroring the existing ablation guard.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | scorer + ablation + grader prompt + orchestrator + report + router synonyms |
| Risk | 18/25 | shared scorer + report schema + paid live runs + grader noise |
| Research | 5/20 | research already done in 011 round-2 |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
