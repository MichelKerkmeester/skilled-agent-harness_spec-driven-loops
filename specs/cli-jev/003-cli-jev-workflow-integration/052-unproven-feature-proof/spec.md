---
title: "Feature Specification: Phase 52: unproven-feature-proof"
description: "Three Jev features have no clean keep and no clean kill: spec-track narrowing, routing clarify default and alignment folder suggestion. This phase applies the research recommendations to their scorers and plans the tests that would prove or retire each one."
trigger_phrases:
  - "unproven jev feature proof"
  - "masked-state ablation"
  - "strongest policy bar"
  - "class floor keep rule"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 52: unproven-feature-proof

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-05 |
| **Branch** | `worktrees/085-jev-feature-improvement-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 52 of 52 |
| **Predecessor** | 051-followups |
| **Successor** | None |
| **Handoff Criteria** | All three scorers share one keep rule, the masked-state run and the clarify census are recorded, and each feature has a written proof plan |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 52** of the cli-jev workflow integration packet. Packet `cli-jev/006-jev-feature-auto-enable` wired the four proven Jev features and ran five research iterations per lineage on the three that were not proven. This phase acts on that research.

**Scope Boundary**: The three scorers, the shared scorer kit, one registry guard test, two recorded runs and the proof plan. No feature gets a live path.

**Dependencies**:
- `specs/cli-jev/006-jev-feature-auto-enable/research/research.md`, the ranked recommendations
- A stored Jev credential for the masked-state run

**Deliverables**:
- Aligned keep rules in the three scorers, backed by shared gates in `scorer-report.mjs`
- A masked-state ablation arm in the folder suggestion scorer, with one recorded live run
- A recorded clarify census over local session transcripts
- A per-feature proof plan in `plan.md`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Spec-track narrowing kept once and stopped on its repeat. Routing clarify default kept only on a fixture the current router no longer clarifies. Alignment folder suggestion kept, but a control that rotates the session state flips it to a kill. The three scorers also judge with different rules: one lacks the kill branch, and none requires beating the strongest simple policy or holding a floor in every class.

### Purpose
Each of the three features gets one keep rule shared across scorers, the cheapest decisive experiment that can run now, and a written test plan that would prove or retire it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A test that keeps the feature registry at exactly the four proven features
- Shared gates in the scorer kit: strongest simple policy, per-class floor, exact kill tail and a sign-test power line
- The kill branch and both new gates in the spec-track narrowing scorer
- Both new gates in the clarify default and folder suggestion scorers
- A masked-state ablation arm in the folder suggestion scorer, with a flag that runs only that arm
- One live masked-state run and one zero-call clarify census, both recorded outside the repository
- A per-feature proof plan

### Out of Scope
- Wiring any of the three features into `jev-features.mjs` - none meets the proof standard
- Collecting the 431-row Gate 1 holdout for spec-track narrowing - it needs labels nobody has gathered yet
- Extending the routing contract to carry clarify alternatives - a routing owner must approve that first
- Shadow logging of user picks - it follows the census, not this phase

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-classifier/shared/scripts/scorer-report.mjs` | Modify | Shared keep-rule gates and power line |
| `.skilled/skills/cli-classifier/shared/scripts/tests/scorer-report.test.mjs` | Modify | Gate and power tests |
| `.skilled/skills/cli-classifier/shared/scripts/tests/jev-features.test.mjs` | Modify | Registry guard |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs` | Modify | Kill branch and both gates |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts` | Modify | Gate tests |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` | Modify | Both gates |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs` | Modify | Gate tests |
| `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts` | Modify | Both gates and the masked-state arm |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/score-alignment-suggestion.vitest.ts` | Modify | Gate and mask tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The feature registry holds exactly the four proven features, and a test fails if a fifth appears |
| REQ-002 | All three scorers decide in one order: coverage, kill, margin, sign test, strongest policy, class floor, flips, keep |
| REQ-003 | A keep requires more right answers than the strongest simple policy and no class where the model is right less often than the baseline |
| REQ-004 | The folder suggestion scorer runs a masked-state arm whose rule was fixed before the run, and never prints or records state text |
| REQ-005 | The masked-state run is recorded with Jev under `~/.skilled/.labels/runs/` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Every model verdict line is followed by a power line, a strongest-policy line and the class-floor lines |
| REQ-007 | The clarify census runs over local session transcripts with zero model calls and records only counts |
| REQ-008 | `plan.md` carries a proof plan for each feature: corpus, labels, rule, power, controls, consumer fail-open tests and staged rollout |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each new gate has a test that fails when the gate is removed.
- **SC-002**: The masked-state run prints a verdict, and the feature's next step follows the decision fixed in `plan.md` before the run.
- **SC-003**: Every suite that covers a changed file passes at or above its baseline count.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Jev service and stored credential | The masked-state run cannot happen | Record the blocker; the code and tests still land |
| Risk | A new gate turns an existing keep fixture into a stop | Tests break for the wrong reason | Change the fixture so the keep is real, never loosen the gate |
| Risk | The mask removes too little of the copied text | The ablation stays anchored | The mask rule and its counts print with the run, so a reader can judge it |
| Risk | Transcript text leaks into a report | Private session text in a file | The census prints counts only, and the mask never prints state |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The masked-only run makes about one arm of calls, near 121, not the full run's 311.
- **NFR-P02**: Power helpers answer for up to 100,000 pairs without overflow.

### Security
- **NFR-S01**: No scorer reads, prints or records an API key. Jev uses its stored credential.
- **NFR-S02**: Run output goes outside the repository, and the scorers refuse an in-repository `--out`.

### Reliability
- **NFR-R01**: Every verdict comes from exact integer or BigInt arithmetic. Only the power line uses floats, and it decides nothing.
- **NFR-R02**: Identical inputs print byte-identical reports.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- No discordant pairs: the kill and sign gates do not fire, and the power line prints `none` for the win rate.
- A tie with the strongest policy fails the bar.
- A state made only of copied text masks to `[masked]` and is counted as emptied.

### Error Scenarios
- Jev unavailable or auth failing: the gate refuses the run before any choice call.
- An unknown `--arm` value exits 2.

### State Transitions
- A run interrupted mid-arm leaves its calls recorded, and a second run into the same `--out` is refused.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Nine files across three skills, one shared module |
| Risk | 8/25 | Measurement code only, nothing serves users |
| Research | 6/20 | Research already done in packet 006 |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Which routing owner would approve an additive alternatives contract for clarify default?
- How often does a real save's final folder sit inside the folder suggestion's candidate set?
<!-- /ANCHOR:questions -->

---
