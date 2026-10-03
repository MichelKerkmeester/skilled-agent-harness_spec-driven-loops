---
title: "Feature Specification: Build: improve the Jev spec-folder suggestion (022)"
description: "The folder suggestion scorer shows each option with its real description, measures whether the right folder was offered at all, and records what it scored."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Build: improve the Jev spec-folder suggestion (022)

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
| **Branch** | `scaffold/008-folder-suggestion-improvements` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 12 |
| **Predecessor** | 007-clarify-default-improvements |
| **Successor** | 009-pi-transport-improvements |
| **Handoff Criteria** | Every completion criterion in `goal.md` is checked with evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Build the recommendations from 048's research for each kept Jev feature, and fix the deep-research workflow faults found while running it specification.

**Scope Boundary**: The recommendations listed in scope below, from `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/008-folder-suggestion-research/research/research.md`. Corpus, label and default-on work stays out.

**Dependencies**:
- `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/008-folder-suggestion-research/research/research.md` ranks the recommendations

**Deliverables**:
- Resolve `description.json` by path before any basename index, and skip archive folders in the index
- Report candidate recall and split content saves from folder saves
- Accept a pre-declared comparator and report the 11 discordant rows for adjudication
- One re-measure recorded in `goal.md`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Feature 022 kept against the top-listed alternative, because the fixture's target is wrong on every row. The one loss lines up with a description collision: `001-deep-research` has a `description.json` in 9 places, so the right option was the only one shown without a description. The report does not measure candidate recall or split content saves from folder saves.

### Purpose
The folder suggestion scorer shows each option with its real description, measures whether the right folder was offered at all, and records what it scored.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R2: Resolve `description.json` by path before any basename index, and skip archive folders in the index
- R3: Report candidate recall and split content saves from folder saves
- R4: Accept a pre-declared comparator and report the 11 discordant rows for adjudication
- R5: Hash-pin the corpus, report and scorer revision, and print W+L, an interval and negative-control arms
- R6: Report a confidence-gated arm where passes 2 and 3 run only when pass 1 is below 1.0

### Out of Scope
- R1 real-save corpus - new corpus and labels
- R7 auto-detection near-ties - a later phase
- R8 interactive suggestion - default-on, per 047 D6

### Files to Change

| File Path | Change Type | Description |
| ----------- | ------------- | ------------- |
| `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts` | Modify | Path-resolved descriptions, recall, save-path split, comparator flag, pins, controls, gated arm |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/score-alignment-suggestion.vitest.ts` | Modify | Cases for each new behavior |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-001 | An option whose folder has a `description.json` is shown with it, even when its basename is not unique. | A test with two same-named folders asserts both descriptions. |
| REQ-002 | The report prints candidate recall and splits content saves from folder saves. | A test reads both. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-003 | A pre-declared comparator is honored and the discordant rows are listed. | A test with `--baseline target` asserts the comparator. |
| REQ-004 | The report pins corpus, report and scorer hashes and prints W+L, an interval and the negative controls. | A test asserts each. |
| REQ-005 | A re-measure with path-resolved descriptions is recorded. | The verdict line and the f022-001 pick sit in the goal log. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No option is shown without its description when one exists
- **SC-002**: Candidate recall is reported for every run
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
| ------ | ------ | -------- | ------------ |
| Risk | Path-resolved descriptions change what Jev reads | Low | Re-measure and keep the 047 verdict on record |
| Dependency | `jev auth status` for the re-measure | Re-measure cannot run | Record the skip in the log; the code changes still close |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The scope follows 048's ranked table.
<!-- /ANCHOR:questions -->

---


