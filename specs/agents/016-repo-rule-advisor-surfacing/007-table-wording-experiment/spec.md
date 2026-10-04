---
title: "Feature Specification: Table wording experiment"
description: "Reading communication.md shows no measurable association with fewer tables. Test whether wording is the cause by alternating the current 612-byte table block with a 152-byte imperative at the same path, in pre-registered time blocks."
trigger_phrases:
  - "table wording experiment"
  - "no table rule wording"
  - "abab rule experiment"
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
| **Status** | Draft |
| **Created** | 2026-10-04 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 8 |
| **Predecessor** | 006-rule-concision-rewrites |
| **Successor** | 008-gate5-card-pilot |
| **Handoff Criteria** | Pre-registered decision reached and the chosen wording committed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the repo rule surfacing, concision and loading specification.

**Scope Boundary**: The table block in `communication.md` only, swapped at block boundaries. Everything else frozen during the blocks.

**Dependencies**:
- Phase 004 analyzer and baseline
- Phase 006 shipped, so the rest of the rule is stable

**Deliverables**:
- Pre-registration document
- Four measurement blocks
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
- Pre-registration: metric, sample size from the phase 004 baseline, block schedule and decision rule, committed before block 1
- Four alternating blocks, current wording then short wording then current then short
- Analysis with the phase 004 analyzer, attributing replies by rule version

### Out of Scope
- Per-session randomization - the rule is read from one path, and a hook that served variants would be a new runtime surface built for one experiment
- Any other edit to `communication.md`, `AGENTS.md` §8 or `REPO RULES.md` during the blocks
- Other prohibitions - semicolon is tracked only as a drift control

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/repo-rules/communication.md` | Modify | Table block swapped at each block boundary |
| `preregistration.md` | Create | Metric, sample size, schedule and decision rule |
| `results/` | Create | Aggregates-only block reports |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The pre-registration is committed before block 1 starts |
| REQ-002 | `git log` shows no other change to `communication.md`, `AGENTS.md` or `REPO RULES.md` inside any block |
| REQ-003 | The result reports each block's table rate with denominator and Wilson interval, excluding requested tables, and applies the pre-registered decision rule |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The chosen wording is committed with a ledger entry |
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
| Risk | Model or runtime updates during the blocks | Med | ABAB ordering spreads drift across both arms, and the semicolon rate is a drift control |
| Risk | Not enough long replies per block | Med | Block length is set from baseline volume, and blocks extend rather than end early |
| Risk | Another session edits a frozen file | Med | Freeze noted in the commit message and checked in REQ-002 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What effect size is worth detecting? Proposal: a drop from about 20% to 10%, which needs roughly 200 long replies per arm at 80% power. T002 recomputes from the baseline.
<!-- /ANCHOR:questions -->

---
