---
title: "Feature Specification: Phase 31: changelog-v4003-reality-check"
description: "The v4.0.0.3 changelog had claims the code contradicts and left out user-facing changes from specs shipped since v4.0.0.2. Each claim is now checked against the code and the missing changes are covered."
trigger_phrases:
  - "changelog v4.0.0.3 reality check"
  - "v4.0.0.3 release notes accuracy"
  - "changelog coverage since v4.0.0.2"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 31: changelog-v4003-reality-check

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-05 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 31 of 31 |
| **Predecessor** | 030-cursor-reconcile-test-exemption |
| **Successor** | None |
| **Handoff Criteria** | The v4.0.0.3 changelog matches the code and covers the shipped specs |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 31** of the doctor audit follow-ups. The operator asked for the v4.0.0.3 changelog to match current reality and to cover every spec worked on in the recent sessions. Two read-only audits listed candidate drift and gaps, and each finding was confirmed by reading the code, the commits or the packet summaries before it was written.

**Scope Boundary**: One file, `.skilled/changelog/skilled/v4.0.0.3.md`. No code changes.

**Dependencies**:
- The packet summaries and commits since the v4.0.0.2 tag
- The code each claim describes

**Deliverables**:
- Corrected claims
- New sections for the shipped changes the entry left out
- A complete spec list

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Several claims no longer matched the code. The entry said the injection screen ran after Claude Code fetches only, that every Jev answer records its route, that the removed projection was automatic, that spec docs fell from 33 contextType values and that the hooks are always installed machine-wide. It also left out the advisor status fixes, the removed commit-message bypass, Gate 6 and the Devin cut, the deep-loop bookkeeping fixes, Code Mode's fresh-clone build and the workflow security work.

### Purpose
A reader of the v4.0.0.3 notes learns what actually shipped and what they must change.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Correct each contradicted claim
- Add user-facing coverage for specs shipped since v4.0.0.2
- Add the breaking removal of `SPECKIT_SKIP_COMMIT_MSG_VALIDATE` and the Pi provider rename to the upgrade notes

### Out of Scope
- Bookkeeping-only packets with no user-facing effect
- Packets already covered by v4.0.0.2
- Research-only packets
- Tagging or publishing the release

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/changelog/skilled/v4.0.0.3.md` | Modify | Claim fixes and coverage |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No claim contradicts the code | Each changed claim was checked against code, a commit or a packet summary |
| REQ-002 | The entry validates | `validate_document.py` reports 0 issues |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The voice holds | `hvr_scan.py` reports 0 hard blockers and a ceiling of 98 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every contradicted claim is corrected.
- **SC-002**: Each user-facing spec shipped since v4.0.0.2 is covered or deliberately left out.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A new sentence overstates a change | Medium | Each new claim was read against its packet summary or commit before it was written |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

