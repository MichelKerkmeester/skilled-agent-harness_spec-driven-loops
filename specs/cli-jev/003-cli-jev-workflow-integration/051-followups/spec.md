---
title: "Feature Specification: Jev feature follow-ups"
description: "Build the follow-ups the 050 review left: 032 as a non-blocking check, its baseline fix, Pi's model and usage on records, the input-wrapping test, a real reviewer-output capture for 025, 017's port to the shared scorer pattern, and retiring 026, 029 and 031."
trigger_phrases:
  - "jev follow-ups"
  - "citation drift advisory check"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Jev feature follow-ups

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
| **Branch** | `scaffold/051-followups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 51 of 51 |
| **Predecessor** | 050-pi-default-review |
| **Successor** | None |
| **Handoff Criteria** | Every completion criterion in `goal.md` is checked with evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 51** of the Jev feature follow-ups specification.

**Scope Boundary**: The items listed in scope below.

**Dependencies**:
- Phase 050, whose review raised these items

**Deliverables**:
- 032 runs as a non-blocking check in sk-doc's doc validation: dormant unless `jev auth status` passes, never changes an exit code, bounded to the docs being validated, with an opt-out variable
- 032 R9: its word-match baseline compares only the cited window's tokens, logged as an amendment before the re-measure
- Each transport outcome carries the answering model and, on the Pi route, token usage. 032, 035, 024, 025 and 017 record them

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 050 kept Pi as the default and left open items. 032 is the only feature with real data, a large win and no false alarms, but it runs only when asked. Records answered by Pi carry the CLI's model name and no token usage. Pi's noul answers spread wider than the CLI's, likely from how its input is wrapped. 025 has only built rows. 017's report improvements live in 017 alone. 026, 029 and 031 have no path to a keep.

### Purpose
032 checks changed docs on its own, records say truthfully which model answered and what it cost, the input wrapping is measured, 025 gains real unlabeled outputs, the scorer family shares 017's report improvements, and three dead features are closed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 032 runs as a non-blocking check in sk-doc's doc validation: dormant unless `jev auth status` passes, never changes an exit code, bounded to the docs being validated, with an opt-out variable
- 032 R9: its word-match baseline compares only the cited window's tokens, logged as an amendment before the re-measure
- Each transport outcome carries the answering model and, on the Pi route, token usage. 032, 035, 024, 025 and 017 record them
- At least one other way of wrapping Pi's noul input is measured against the CLI on recorded rows, and adopted only if agreement improves, as an amendment
- A capture script collects real reviewer outputs for 025 into `~/.skilled/.labels`, unlabeled, with a census line
- 017 R8: 017's report pins, probability-aware arm and bootstrap (R2, R3 and R6 in `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/002-track-narrowing-research/research/research.md`) move into the classifier-family scorer pattern its siblings share
- 026, 029 and 031 are retired: final verdicts recorded, and their catalog and playbook entries marked retired

### Out of Scope
- Labeled corpora for 024, 035, 022 and 026 - only operator-confirmed or delegated labels count, per 003 D4
- 035 at the fetch boundary - no hook reads fetched text yet
- Any other feature on by default - the operator lifted 047 D6 for 032 only
- Deleting the retired scorers - their code stays as the record of the measurement

### Files to Change

| File Path | Change Type | Description |
| ----------- | ------------- | ------------- |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs`, its tests and sk-doc's validation entry point | Modify | 032 check and R9 |
| `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` and its tests | Modify | Model and usage on outcomes, input wrapping |
| 035, 024, 025 and 017 scorers and tests | Modify | Record the answering model and usage |
| A new 025 capture script beside `score-verdict-fallback.cjs` | Create | Real reviewer outputs, unlabeled |
| The classifier-family scorers named in 048's 017 research | Modify | R8 port |
| Catalog and playbook entries for 026, 029 and 031 | Modify | Marked retired |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-001 | 032 runs as a non-blocking check | Tests show the exit code is unchanged with and without findings, the check is silent without auth, and the opt-out variable skips it. One live run on changed docs prints its advisory |
| REQ-002 | 032 R9 is re-measured | Amendment logged first, then a verdict line with its run folder |
| REQ-003 | 026, 029 and 031 are retired | Catalog, playbook and phase goal log each record the final verdict and the retirement |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-004 | Records name Pi's model and usage | On the Pi route the five scorers record Pi's model and token usage. Tests cover both routes |
| REQ-005 | The input wrapping is measured | Agreement and median gap for each wrapping tried, on recorded noul rows, with the adopt or reject decision logged |
| REQ-006 | 025 has a real-output capture | The script runs, writes unlabeled rows and prints a census |
| REQ-007 | 017 R8 is ported | The family scorers share the pins, probability-aware arm and bootstrap, and 017's replay still reads K=256 A=97 with 0 dropped |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 032 checks the docs sk-doc validates without ever failing validation
- **SC-002**: Every Pi-answered record names Pi's model and its token usage
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
| ------ | ------ | -------- | ------------ |
| Risk | 032's check adds live calls to every validation | Med | Bounded to the docs being validated, dormant without auth, opt-out variable |
| Risk | Three streams edit the same worktree at once | Med | Each stream owns disjoint files. R8 runs after the others are committed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator asked to fix all of these on 2026-10-03 and named the orchestration
<!-- /ANCHOR:questions -->

---


