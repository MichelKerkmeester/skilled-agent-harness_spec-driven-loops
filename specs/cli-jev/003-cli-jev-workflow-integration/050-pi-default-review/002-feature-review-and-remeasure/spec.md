---
title: "Feature Specification: Phase 2: Review, test, re-measure and fix nine Jev features"
description: "A fresh Opus 5.5 reviewer at xhigh reviews, tests and re-measures the five features worth wiring in and the four stopped on margin, over the new default transport, and fixes the defects it finds."
trigger_phrases:
  - "jev feature review"
  - "jev feature remeasure"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: Review, test, re-measure and fix nine Jev features

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-03 |
| **Branch** | `scaffold/002-feature-review-and-remeasure` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 2 |
| **Predecessor** | 001-pi-default-transport |
| **Successor** | None |
| **Handoff Criteria** | Every completion criterion in `goal.md` is checked with evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Make Pi the default Jev transport when available, then have a fresh Opus reviewer test, re-measure and fix nine features specification.

**Scope Boundary**: The items listed in scope below.

**Dependencies**:
- Phase 001, so the re-measures run over the new default

**Deliverables**:
- A fresh Claude Opus 5.5 reviewer at xhigh reads each feature's spec, scorer, tests and last verdict, and runs its suite
- It re-measures each feature live behind `jev auth status`, with `--out`, over the default transport, and records how many calls Pi and the CLI answered
- It fixes defects it finds, and a change to a flag line, call protocol, aggregation or question text is logged as an amendment before the re-measure

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The nine features with a measured gain or a near miss were last measured through the jev CLI, several on built rows, and 017 dropped from keep to stop on its repeat. Nobody has checked them end to end since 049, or measured them through Pi. The nine are 032 citation drift, 037 Pi transport, 035 injection screen, 025 verdict fallback, 024 hallucination grader, 017 search narrowing, 026 completion claims, 029 P0 reread order and 031 debug next check.

### Purpose
Each of the nine ends with a reviewed scorer, a passing suite and a fresh verdict line that names which route answered its calls, or a recorded reason it could not be re-measured.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A fresh Claude Opus 5.5 reviewer at xhigh reads each feature's spec, scorer, tests and last verdict, and runs its suite
- It re-measures each feature live behind `jev auth status`, with `--out`, over the default transport, and records how many calls Pi and the CLI answered
- It fixes defects it finds, and a change to a flag line, call protocol, aggregation or question text is logged as an amendment before the re-measure
- It may run DeepSeek V4.1 Flash max on cli-pi (Cline, then OpenCode Go) and Luna 6 max fast on cli-codex as workers and cross-family reviewers
- One log row per feature with the review result, the suite result and the verdict line

### Out of Scope
- New labels or corpora - only operator-confirmed or delegated labels count, per 003 D4
- Wiring a feature into a live workflow - that turns a feature on by default, which 047 D6 keeps out
- Killed and no-headroom features - the operator scoped the review to these nine

### Files to Change

| File Path | Change Type | Description |
| ----------- | ------------- | ------------- |
| Each feature's scorer and its tests, as the review finds defects | Modify | Fixes only, each named in the log |
| This phase's `goal.md` log | Modify | One row per feature |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-001 | Each of the nine has a review result and a suite run | One log row per feature names the files read, the suite command and its pass count |
| REQ-002 | Each of the nine has a fresh verdict line or a recorded reason | The row quotes the verdict line, its run folder and its Pi and CLI call counts |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-003 | Defects found are fixed and reviewed by another family | No open P0 or P1. P2s are recorded |
| REQ-004 | Changed suites hold their baseline | Each changed suite passes at or above its count before the change |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Nine log rows, each with a verdict line or a reason
- **SC-002**: No open P0 or P1 after the cross-family check
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
| ------ | ------ | -------- | ------------ |
| Dependency | `jev auth status` and the Typesafe key | No live re-measure | Record the skip. Review and tests still close |
| Risk | Pi's noul answers move a verdict | Med | The row names the route counts, so a move can be traced to the transport |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator named the nine features, the reviewer and the workers on 2026-10-03
<!-- /ANCHOR:questions -->

---


