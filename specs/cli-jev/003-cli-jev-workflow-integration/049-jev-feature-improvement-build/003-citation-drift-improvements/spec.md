---
title: "Feature Specification: Build: improve the Jev citation drift scan (032)"
description: "The scan flags on the evidence it already has, reports live rows apart, checks its own input hashes and reads each document once."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Build: improve the Jev citation drift scan (032)

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
| **Branch** | `scaffold/003-citation-drift-improvements` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 12 |
| **Predecessor** | 002-track-narrowing-improvements |
| **Successor** | 004-injection-screen-improvements |
| **Handoff Criteria** | Every completion criterion in `goal.md` is checked with evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Build the recommendations from 048's research for each kept Jev feature, and fix the deep-research workflow faults found while running it specification.

**Scope Boundary**: The recommendations listed in scope below, from `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/003-citation-drift-research/research/research.md`. Corpus, label and default-on work stays out.

**Dependencies**:
- `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/003-citation-drift-research/research/research.md` ranks the recommendations

**Deliverables**:
- Flag on `min(reruns) < 0.5` and keep the modal pick for reporting
- Report live and constructed columns and a live-only sign test
- Send the enclosing paragraph as the claim, and drop claim-less lines from live draws
- One re-measure recorded in `goal.md`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Feature 032 kept on its 40-row benchmark, but the modal flag misses a catch that flagging on the lowest rerun makes for free. Live and constructed rows are pooled, recorded hashes are never compared, a bare `Evidence:` line is sent as the claim, and 048's DeepSeek lineage counts 8,667 document reads in the census for 82 citing documents.

### Purpose
The scan flags on the evidence it already has, reports live rows apart, checks its own input hashes and reads each document once.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R1: Flag on `min(reruns) < 0.5` and keep the modal pick for reporting
- R2: Report live and constructed columns and a live-only sign test
- R3: Send the enclosing paragraph as the claim, and drop claim-less lines from live draws
- R4: Validate `claim_sha12` and `window_sha12` before scoring
- R5: Make the record self-contained, and requalify on instruction, rule and row-set hashes
- R6: Batch or memoize document reads in the census and draw
- R7: Test the stop branches and disagreeing reruns
- R8: Rerun adaptively when a score falls in [0.35, 0.65]

### Out of Scope
- R9 localizing the baseline's token check - changes the comparator, a separate amendment after this re-measure
- R10 periodic advisory integration - default-on, per 047 D6
- R11 acceptance-criteria evidence - needs an illustrative-reference classifier first

### Files to Change

| File Path | Change Type | Description |
| ----------- | ------------- | ------------- |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | Modify | Min-rerun flag, live column, paragraph claim, hash checks, record, read cache, adaptive reruns |
| `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` | Modify | Stop branches, disagreeing reruns and each new behavior |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-001 | A row whose lowest rerun is below 0.5 is flagged, and the modal pick is still reported. | A test with disagreeing reruns asserts the flag and the modal pick. |
| REQ-002 | A row whose recorded claim or window hash differs from its text is refused before scoring. | A test with a tampered row asserts the refusal. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-003 | The report prints live and constructed columns and a live-only sign test. | A test reads both columns. |
| REQ-004 | The census reads each document at most once. | A test counts reads on a fixture tree. |
| REQ-005 | A re-measure under the min-rerun flag and adaptive reruns is recorded. | The verdict line and the amendment sit in the goal log. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The scan's suite passes, including the stop branches
- **SC-002**: The census reads each document once
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
| ------ | ------ | -------- | ------------ |
| Risk | Paragraph claims change what the model reads | Med | Re-measure and keep the 047 verdict on record |
| Dependency | `jev auth status` for the re-measure | Re-measure cannot run | Record the skip in the log; the code changes still close |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The scope follows 048's ranked table.
<!-- /ANCHOR:questions -->

---


