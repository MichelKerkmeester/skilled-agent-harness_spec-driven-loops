---
title: "Feature Specification: Phase 1: symlink-contained-paths"
description: "Every byte-moving read or write the containment guard makes on a repository, artifact or baseline path is contained against symlinked components at every level, with kernel no-follow opens and check-then-create closed, so no restore, capture or quarantine can be redirected by a link."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: symlink-contained-paths

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 15 |
| **Predecessor** | 014-alignment-review |
| **Successor** | None |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the Contain every restore, baseline and quarantine path against symlinked components specification.

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
The fresh review found three residual gaps in one class: the restore guard checked only the final component, so a symlinked parent directory still redirected the write outside the repository; baseline capture and baseline read copied bytes through unchecked components; and the quarantine writer resolved its destination and then created it, so a link planted in between landed the create at the link's target.

### Purpose
No byte the guard moves can be redirected by a symlink, anywhere in the path, at any moment.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One helper set: per-component refusal below the owning root, contained directory creation that re-reads each level, and no-follow opens for reads and for exclusive or replacing writes
- Wiring into baseline capture and read, patch capture, the quarantine pass directory and all its record writes, the content copy, and both restore writes
- Four tests, each red against the unmodified module

### Out of Scope
- The two metadata probes that only test existence and never move bytes - detection semantics are frozen
- The state-log append - a caller-supplied path with a logging-never-blocks contract
- Windows, where the kernel no-follow flag is a no-op and the component walk stands alone

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Modify | `pathRefusal`, `ensureContainedDirectory`, `openContainedRead`, `openContainedWrite` and the three roots; the earlier quarantine-only refusal subsumed; every byte-moving site routed through them |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` | Modify | Four new tests; a file-level fs mock delegating to the real module that fires a hook only in the race case |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every byte-moving read or write on a repository, artifact or baseline path resolves its parent with realpath, requires it beneath the owning root, refuses any symlinked component at or below that root, and never follows the final component |
| REQ-002 | Directories are created level by level with the check repeated on each created level, and files are opened with no-follow and exclusive or replacing modes, so a link introduced between check and create is refused by the create |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A refusal is recorded on the relevant result: the baseline entry marked, the revert action with a reason, the quarantine refusal list |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All four new tests fail against the unmodified module and pass after
- **SC-002**: The deep-loop runtime suite exits zero
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The file-level fs mock affects other cases | Low | It delegates to the real module and fires only in the race case; all 77 cases in the file pass |
| Risk | Platform no-follow semantics | Low | The component walk refuses a symlinked final component on its own where the flag is a no-op |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One realpath and one lstat per component per byte-moving operation

### Security
- **NFR-S01**: No byte the guard moves can be redirected by a symlink at any component or at any moment between check and create

### Reliability
- **NFR-R01**: Every refusal is recorded, never thrown; detection and remedy semantics are unchanged
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Symlinked parent on restore: refused, outside directory untouched
- Symlinked component on a baseline path: not captured, entry marked, nothing restored there
- Symlinked component inside the baseline store: capture refused

### Error Scenarios
- Link planted between check and create: the create refuses
- Dangling link: refused with the reason

### State Transitions
- Not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One module, one test file, every byte-moving site touched |
| Risk | 14/25 | Security boundary across the whole guard |
| Research | 4/20 | Findings located by two review lanes |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


