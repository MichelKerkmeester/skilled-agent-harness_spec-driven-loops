---
title: "Feature Specification: Phase 4: restore-never-through-symlink"
description: "The opt-in restore checks the violated path with lstat before writing baseline bytes and never writes through a symlink; the refusal is recorded with its reason and the lane's outcome is unchanged."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: restore-never-through-symlink

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
| **Phase** | 11 of 13 |
| **Predecessor** | 010-containment-on-failed-lanes |
| **Successor** | 012-quarantine-retention-per-pass |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the Remediate the deep review findings on the fan-out write containment hardening specification.

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
Under restore, the baseline write used `writeFileSync` on the violated path. A lane that replaced a tracked file with a symlink pointing outside the repository made that write land at the link's target, so a restore meant to undo the lane's change overwrote a file the lane chose. The deep review rated it P1.

### Purpose
A baseline restore writes only to a regular file at the violated path; a symlink there is left alone and named.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An lstat check before the baseline write
- A `reason` on the revert action naming the symlink
- Tests for the link case and the ordinary-file case, plus a negative control against the unmodified module

### Out of Scope
- The HEAD restore path - `git checkout` replaces the link itself, confirmed
- Preserve mode - never writes
- Reclassifying the finding - a symlinked path stays a violation

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Modify | lstat before the baseline write; a symlink records `preserved_in_head` with `ok: true` and a `reason`; `reason` added to the revert action type |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` | Modify | Two new tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Before writing baseline bytes, the path is checked with lstat; a symlink is never written through, and the action is recorded as `preserved_in_head` with a reason naming the link |
| REQ-002 | The lane's outcome is unchanged: the path stays a violation and the event carries the action |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | An ordinary file at the path is still restored from the captured bytes |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The link test fails against the unmodified restore, which overwrites the outside target, and passes after
- **SC-002**: The deep-loop runtime suite exits zero
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A symlinked path is silently left as the lane set it | Low | It stays a violation on the event with the reason; an operator sees it |
| Dependency | lstat semantics on the platform | Green | Standard |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One lstat per restored path

### Security
- **NFR-S01**: A restore never writes outside the repository through a link

### Reliability
- **NFR-R01**: The refusal is recorded, never thrown
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Link to a file outside the repository: untouched, refusal recorded
- Link to a file inside the repository: same rule; a link is never written through
- Ordinary file: restored

### Error Scenarios
- Path removed between detection and restore: handled by the deletion branch

### State Transitions
- Partial completion: not affected
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | One branch, one test file |
| Risk | 8/25 | Restore path in the shared guard |
| Research | 2/20 | Finding located by the review |
| **Total** | **14/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


