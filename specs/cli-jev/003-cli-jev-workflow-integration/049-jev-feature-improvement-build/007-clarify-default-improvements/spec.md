---
title: "Feature Specification: Build: improve the Jev routing clarify default (020)"
description: "The clarify scorer scores only rows that still clarify, reports by class and hub against an always-none baseline, records its instrument and spends fewer calls."
trigger_phrases:
  - "clarify default improvements"
  - "the clarify scorer scores only rows that still"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Build: improve the Jev routing clarify default (020)

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-03 |
| **Branch** | `scaffold/007-clarify-default-improvements` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 12 |
| **Predecessor** | 006-verdict-fallback-improvements |
| **Successor** | 008-folder-suggestion-improvements |
| **Handoff Criteria** | Every completion criterion in `goal.md` is checked with evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Build the recommendations from 048's research for each kept Jev feature, and fix the deep-research workflow faults found while running it specification.

**Scope Boundary**: The recommendations listed in scope below, from `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/007-clarify-default-research/research/research.md`. Corpus, label and default-on work stays out.

**Dependencies**:
- `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/007-clarify-default-research/research/research.md` ranks the recommendations

**Deliverables**:
- Replay each row against the pinned router build before scoring, and refuse rows that no longer clarify
- Write rows, labels, options and scorer digests plus the build identity into `report.json`
- Report by class and hub, and print always-none and second-alternative baselines as the bar

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Feature 020 kept mostly as a none-of-these detector: 12 of 17 wins are abstentions, and always answering none (34 of 54) beats Jev (28). On today's routers only 12 of the 54 scored prompts still clarify, because the score path never replays a row, and the report cannot be reproduced from what it records.

### Purpose
The clarify scorer scores only rows that still clarify, reports by class and hub against an always-none baseline, records its instrument and spends fewer calls.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R1: Replay each row against the pinned router build before scoring, and refuse rows that no longer clarify
- R2: Write rows, labels, options and scorer digests plus the build identity into `report.json`
- R3: Report by class and hub, and print always-none and second-alternative baselines as the bar
- R5: Record label approver and decision reference fields in the row schema
- R6: Stop after two agreeing orders, and call a third only on disagreement

### Out of Scope
- R4 shadow logging of real clarifies - needs a consent and logging policy first
- R7 instruction amendment - changes REQ-006's frozen texts and needs a fresh corpus
- R8 per-hub fixtures and R9 kit reuse - later phases
- R10 default-on suggestion - default-on, per 047 D6

### Files to Change

| File Path | Change Type | Description |
| ----------- | ------------- | ------------- |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` | Modify | Replay check, digests, class and hub report, baselines, approver fields, early stop |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs` | Modify | Cases for each new behavior |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/fixtures/047-020-recorded-picks.jsonl` | Create | The 047 run's recorded choice picks (row, order, pick, status) for the REQ-004 replay test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-001 | A scored row whose replay on the pinned build does not return `clarify` is refused before any call. | A test with a routed row asserts that row is refused and reported while the run scores the rows that still clarify. |
| REQ-002 | `report.json` carries the four digests and the build identity. | A test asserts each field. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-003 | The report prints class and hub results and the always-none and second-alternative baselines. | A test reads each. |
| REQ-004 | The early stop gives the same picks as three calls on the recorded 047 run. | A replay test matches every pick with 118 calls or fewer. |
| REQ-005 | The row schema accepts label approver and decision reference. | A test reads both fields. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No non-clarify row can be scored
- **SC-002**: The recorded run replays with the same modal picks in fewer calls, with flips counted over measured votes only
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
| ------ | ------ | -------- | ------------ |
| Risk | The replay check leaves too few rows to score | High | That is the honest result. Report the eligible count and stop at the label gate |
| Dependency | `jev auth status` for the re-measure | Re-measure cannot run | Record the skip in the log; the code changes still close |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The scope follows 048's ranked table.
<!-- /ANCHOR:questions -->

---


