---
title: "Feature Specification: Phase 4: references-sweep-and-verification"
description: "After the scorers and the hub, Deem still appears in catalogs, playbooks, READMEs and other skills' docs. This phase clears those references, adds the changelog entries and proves the whole removal from the final state."
trigger_phrases:
  - "deem references sweep"
  - "deem removal verification"
  - "jev only changelog"
  - "deem removal review"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: references-sweep-and-verification

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-02 |
| **Branch** | `worktrees/071-cli-jev-sk-alignment` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-cli-deem-mode-removal |
| **Successor** | None |
| **Handoff Criteria** | The completion criteria in `goal.md` each pass from the final state |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Deem deprecation, phase 046 of the cli-jev workflow integration.

**Scope Boundary**: No live doc mentions a Deem backend, each changed skill records the removal in its changelog, and the full gate passes.

**Dependencies**:
- The operator's request of 2026-10-02 to remove Deem and keep Jev.
- `../001-removal-plan/inventory.md` for every phase after 001.

**Deliverables**:
- Every inventory row owned by 004
- One new changelog entry per changed skill
- The trigger index rebuild
- The final review and all gates

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 002 and 003 remove the code and the hub's mode. Catalogs, playbooks, READMEs and other skills' references still describe Deem as a backend, and no single check yet proves the removal end to end.

### Purpose
No live doc mentions a Deem backend, each changed skill records the removal in its changelog, and the full gate passes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every inventory row owned by 004
- One new changelog entry per changed skill
- The trigger index rebuild
- The final review and all gates

### Out of Scope
- `specs/` and released changelog entries
- The Deem server

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Docs the inventory assigns to 004 | Modify | Jev-only wording |
| `changelog/` in each changed skill | Create | The removal entry |
| Trigger index | Modify | Rebuilt |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The inventory pattern prints only keep rows and the `--deem` grep prints nothing |
| REQ-002 | Every inventory suite passes with 0 failing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Changed docs pass `validate_document.py` and the hub check passes |
| REQ-004 | Each changed skill has one new changelog entry |
| REQ-005 | The review leaves no open P0 or P1 |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader of any live doc meets Jev as the only classifier.
- **SC-002**: The full gate passes from the final state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A doc edit drops a Jev fact along with Deem wording | Med | The review reads each rewrite against the code |
| Risk | The index lags the docs | Low | Rebuild after the last doc lands |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: No file holds, reads or prints a credential, and no worker opens a `.env` file.

### Reliability
- **NFR-R01**: Each change is a path-scoped commit that `git revert` undoes on its own.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A match on the English word `deem` is kept, and the inventory marks it keep.

### Error Scenarios
- A suite that fails after an edit blocks that edit's commit until it passes or the edit is reverted.

### State Transitions
- Not applicable. No runtime state changes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Bounded by the inventory |
| Risk | 6/25 | Removal behind suites and byte diffs |
| Research | 4/20 | 001 maps the references |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The operator set the scope on 2026-10-02.
<!-- /ANCHOR:questions -->

---
