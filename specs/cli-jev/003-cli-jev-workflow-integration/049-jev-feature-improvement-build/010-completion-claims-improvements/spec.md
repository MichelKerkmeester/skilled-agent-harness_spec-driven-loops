---
title: "Feature Specification: Build: improve the Jev completion-claim audit (026)"
description: "The completion sentinel catches the claims it can catch for free, fires less on checklists and tables, and runs in every runtime that has an adapter."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Build: improve the Jev completion-claim audit (026)

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-03 |
| **Branch** | `scaffold/010-completion-claims-improvements` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 12 |
| **Predecessor** | 009-pi-transport-improvements |
| **Successor** | 011-research-run-init-via-gateway |
| **Handoff Criteria** | Every completion criterion in `goal.md` is checked with evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the Build the recommendations from 048's research for each kept Jev feature, and fix the deep-research workflow faults found while running it specification.

**Scope Boundary**: The recommendations listed in scope below, from `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/010-completion-claims-research/research/research.md`. Corpus, label and default-on work stays out.

**Dependencies**:
- `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/010-completion-claims-research/research/research.md` ranks the recommendations

**Deliverables**:
- Anchor the regex to a closing window and filter checklists, tables, code and assignments, choosing the window length from the recorded arms
- Add `complete` to the claim words
- Repair the scorer: reject duplicate IDs, attribute whole words, and correct the `labels-happy` fixture

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Feature 026 stopped on margin, two rows short, against a sentinel regex that catches none of the 10 labeled claims and fires falsely 7 times. A regex miss also skips every evidence check, the scorer has three defects, and the Cursor adapter is not wired.

### Purpose
The completion sentinel catches the claims it can catch for free, fires less on checklists and tables, and runs in every runtime that has an adapter.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R1: Anchor the regex to a closing window and filter checklists, tables, code and assignments, choosing the window length from the recorded arms
- R2: Add `complete` to the claim words
- R4: Repair the scorer: reject duplicate IDs, attribute whole words, and correct the `labels-happy` fixture
- R5: Pre-register the judge threshold in the scorer's docs and add a holdout split flag
- R6: Put call cost in the keep rule and report a one-call arm
- R7: Wire the existing Cursor adapter into `.cursor/hooks.json`
- R9: Reconcile Pi advisory visibility across the README, the adapter and the injection contract

### Out of Scope
- R3 stratified, double-labeled corpus - new corpus and labels, per 003 D4
- R8 sibling regex scoring - a later phase
- R10 judge in default-on - default-on, per 047 D6

### Files to Change

| File Path | Change Type | Description |
| ----------- | ------------- | ------------- |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs` | Modify | Closing-window anchor, context filters, `complete` |
| `.skilled/skills/system-spec-kit/runtime/tests/completion-evidence-sentinel.vitest.ts` | Modify | Cases for the anchor, filters and new word |
| `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs` | Modify | Duplicate IDs, attribution, threshold, holdout flag, cost, one-call arm |
| `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit.vitest.ts` | Modify | Cases for the scorer repairs |
| `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/` | Modify | Correct the `labels-happy` construct |
| `.cursor/hooks.json` | Modify | Wire the Cursor completion adapter |
| `.skilled/hooks/completion/README.md` | Modify | Pi visibility matches the adapter and the injection contract |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-001 | On the 047 rows, the shipped sentinel catches more than 0 of the 10 claims with no more than 7 false fires, and the counts for each fix and their combination are recorded. | The scorer's census prints the counts per arm. Today: 0 and 7. `complete` alone: 3 and 7. The 160-character anchor alone: 0 and 3. Both together: 1 and 3. |
| REQ-002 | The scorer refuses duplicate row IDs and attributes claim words by whole word. | A test asserts each. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-003 | `.cursor/hooks.json` runs the completion adapter. | The file lists it and the Cursor adapter test passes. |
| REQ-004 | The scorer documents a pre-registered threshold, a holdout flag and cost inside the keep rule. | The README states each and a test reads the one-call arm. |
| REQ-005 | The README, the Pi adapter and the injection contract agree on Pi advisory visibility. | A read of the three shows one statement. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The sentinel catches claims it missed before without more false fires
- **SC-002**: Every runtime with an adapter runs it
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
| ------ | ------ | -------- | ------------ |
| Risk | The window length is tuned on the same 110 rows, and the sentinel runs in five live Stop hooks | Med | Record every arm, keep the hook advisory, test negatives and check each runtime's hook test |
| Dependency | `jev auth status` for the re-measure | Re-measure cannot run | Record the skip in the log; the code changes still close |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The scope follows 048's ranked table.
<!-- /ANCHOR:questions -->

---


