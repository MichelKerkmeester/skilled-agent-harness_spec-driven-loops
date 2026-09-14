---
title: "Feature Specification: Phase 2: baseline-deletion-detection"
description: "A file that was untracked at the pre-dispatch baseline and no longer exists after dispatch is detected as a deletion, restored from the captured baseline under restore, and recorded as unrecoverable otherwise."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: baseline-deletion-detection

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 13 |
| **Predecessor** | 008-quarantine-destination-canonical |
| **Successor** | 010-containment-on-failed-lanes |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the Remediate the deep review findings on the fan-out write containment hardening specification.

**Scope Boundary**: [To be defined during planning]

**Dependencies**:
- [To be defined during planning]

**Deliverables**:
- [To be defined during planning]

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The detector iterated the post-dispatch git status and subtracted the baseline, so an untracked file present at baseline and deleted by the lane was absent from status and never seen. The no-deletion guarantee therefore had a blind spot exactly where a lane could destroy a neighbour's unsaved work. The deep review rated it P1.

### Purpose
A lane that deletes a neighbour's untracked file is reported, and the file comes back when a baseline copy exists.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An `untracked` marker on baseline entries, recorded at the only moment it is observable
- A reverse pass over the baseline reporting a gone untracked path as kind `deleted` with its baseline hash
- Restore from the captured baseline copy, directory recreated, or an `unrecoverable` record

### Out of Scope
- Paths deleted before dispatch - still subtracted
- Tracked deletions - already detected through git status
- The event's data-loss flag - keyed on HEAD restores; noted, not widened here

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Modify | Baseline entries carry `untracked`; detection walks the baseline for gone untracked paths; the revert restores from the baseline copy or records `unrecoverable` |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` | Modify | Three tests in a new describe block |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A baseline entry that was untracked, is absent from current status, outside the artifact tree, not unattributable, and no longer on disk is reported as a violation of kind `deleted` carrying the baseline hash |
| REQ-002 | Under restore with a captured baseline copy the path is written back byte-identically, parent directories recreated; without a copy the action is `unrecoverable` under either remedy |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A path deleted before dispatch and an untouched baseline untracked path are not reported |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The preserve-mode deletion test fails against the unmodified detector and passes after
- **SC-002**: The deep-loop runtime suite exits zero
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A failed status call manufactures deletions | Low | The on-disk check decides; a path still present is never reported |
| Risk | A deletion is reported as fatal-class | Low | The runner already settles a complete lane with advisory; the finding never overwrites the verdict |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One lstat per baseline untracked entry after the status pass

### Security
- **NFR-S01**: Restore writes only what the baseline captured, at the baseline path

### Reliability
- **NFR-R01**: Fail-open on git errors is preserved; the disk check guards against an empty status
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Directory removed with the file: parent chain recreated on restore
- Binary content: restored byte-identically
- Baseline entry with a truncated capture: unrecoverable

### Error Scenarios
- Status call failed open: nothing reported unless the path is truly gone
- Ignored path: not in the baseline, never reported

### State Transitions
- Partial completion: not affected
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One module, one test file |
| Risk | 10/25 | Detection gains a class in the shared guard |
| Research | 3/20 | Finding located by the review |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


