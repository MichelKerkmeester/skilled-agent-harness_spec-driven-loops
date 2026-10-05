---
title: "Feature Specification: Table wording experiment"
description: "Reading communication.md shows no measurable association with fewer tables. Test whether wording is the cause by comparing the current 612-byte table block with a 152-byte imperative in isolated test environments, runs interleaved in a pre-registered seeded order."
trigger_phrases:
  - "table wording experiment"
  - "no table rule wording"
  - "isolated rule experiment"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Table wording experiment

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-04 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 10 |
| **Predecessor** | 006-rule-concision-rewrites |
| **Successor** | 008-gate5-card-pilot |
| **Handoff Criteria** | Pre-registered decision reached, and the chosen wording committed once the 006 window is measured |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the repo rule surfacing, concision and loading specification.

**Scope Boundary**: The table block in `communication.md` only, varied between two arms of isolated test environments. The live rule files do not change during the run.

**Dependencies**:
- Phase 004 analyzer and baseline
- The `rule-experiment.py` harness, committed in `edba53daeb`
- Phase 006 window measured before the chosen wording goes live

**Deliverables**:
- Pre-registration document
- 600 scored runs across two arms and two executors
- Result and decision

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Long replies carry a table 17.4% of the time before a `communication.md` read, 20.3% after it and 11.6% in sessions that never read it (`002-rule-concision-and-loading/prep/evidence-pack.md` §3). The semicolon ban roughly halves after a read, so wording is one candidate cause. Observational data cannot separate it from placement, competing defaults or volume.

### Purpose
A pre-registered answer to whether the shorter imperative wording lowers the table rate when nothing else changes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Pre-registration: metric, sample size, run schedule and decision rule, committed before the first scored run
- Two arms, current and short wording, each an isolated git repository built by `rule-experiment.py` from commit `edba53daeb`
- 30 reply-only prompts, 5 runs per prompt per arm per executor, interleaved in one order shuffled with seed 16
- Scoring with `rule-experiment.py score`, which applies the phase 004 analyzer's checks

### Out of Scope
- Live ABAB time blocks - replaced at the operator's request to run now, since isolated environments need no live edit and keep the 006 window clean
- A hook that serves variants in live sessions - the environments make one unnecessary
- Any edit to the live `communication.md`, `AGENTS.md` or `REPO RULES.md` during the run
- Other prohibitions - semicolon is tracked only as a drift control

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/repo-rules/communication.md` | Modify | Chosen wording, only after the decision and the 006 window |
| `experiment/arms.json`, `experiment/prompts.json` | Create | Arm edits and the 30 prompts |
| `preregistration.md` | Create | Metric, sample size, schedule and decision rule |
| `results/` | Create | Aggregates-only reports per arm and executor |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The pre-registration is committed before the first scored run |
| REQ-002 | The test environments are built from commit `edba53daeb`, and `git log` shows no change to the live `communication.md`, `AGENTS.md` or `REPO RULES.md` between the first scored run and the decision |
| REQ-003 | The result reports each arm's table rate with denominator and Wilson interval, excluding requested tables, and applies the pre-registered decision rule |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The chosen wording is committed with a ledger entry, after the 006 window is measured |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each arm reaches the pre-registered sample size.
- **SC-002**: The decision follows the pre-registered rule, including a null result.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Model or runtime updates during the run | Med | The seeded interleaved order spreads drift across both arms, and the semicolon rate is a drift control |
| Risk | Too few delivered long replies per arm | Med | 300 runs per arm, sized from the pilot's delivery rates |
| Risk | Another session edits a live rule file | Med | Environments are built from `edba53daeb`, so a live edit cannot reach a run, and REQ-002 checks the live files |
| Risk | The fixture project differs from live use | Med | The result says it covers two executors on a fixture, and phase 009 measures live delivery |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What effect size is worth detecting? Answered in `preregistration.md` §3: a drop from about 20% to 10%, about 200 delivered long replies per arm at 80% power, from 300 runs per arm.
<!-- /ANCHOR:questions -->

---
