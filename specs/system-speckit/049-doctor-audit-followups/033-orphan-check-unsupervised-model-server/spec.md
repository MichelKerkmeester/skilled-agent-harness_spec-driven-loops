---
title: "Feature Specification: Phase 33: orphan-check-unsupervised-model-server"
description: "The orphan check reports a model server only when its checkout is gone, but a model server whose launcher died is orphaned even when the checkout exists. This phase reports any model server whose parent is PID 1 as unsupervised."
trigger_phrases:
  - "unsupervised model server"
  - "orphan check model server"
  - "hf model server parent pid 1"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 33: orphan-check-unsupervised-model-server

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-21 |
| **Branch** | `main` (planning only) |
| **Parent Spec** | ../spec.md |
| **Phase** | 33 of 33 |
| **Predecessor** | 032-orphan-process-check |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met or closed by a recorded decision, and strict validation of this folder prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 33** of the Doctor audit followups specification.

**Scope Boundary**: How the orphan check classifies `hf-model-server.cjs`. Other kinds, the reap guard and the doctor line do not change.

**Dependencies**:
- Phase 032, which owns `orphan-process-check.cjs`.

**Deliverables**:
- A new kind `unsupervised-model-server` for a model server with parent PID 1 whose checkout exists.
- Fixture tests.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A model server is a child of its launcher. When the launcher dies, the model server is reparented to PID 1 and keeps its model loaded with no supervisor. The orphan check treats a model server whose checkout still exists as an intended daemon and never lists it, so this case, the most expensive one at about 470 MB, stays invisible.

### Purpose
`/doctor:setup` shows every model server that has lost its launcher.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Classify a `hf-model-server.cjs` row (already parent PID 1 and over the age threshold) as `unsupervised-model-server` when its checkout exists, and keep `stale-model-server` when it does not.
- Update the fixture tests and the classifier's allowlist comment.

### Out of Scope
- Advisor launchers and `git-live-follow`, which run with parent PID 1 by design.
- Reaping automatically; the operator still confirms with `--reap --yes`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/orphan-process-check.cjs` | Modify | The new kind |
| `.skilled/commands/doctor/scripts/tests/orphan-process-check.test.cjs` | Modify | Fixture cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A model server with parent PID 1 and an existing checkout is listed as `unsupervised-model-server`. |
| REQ-002 | Advisor launchers and `git-live-follow` with existing paths are still never listed. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A model server with a missing checkout stays `stale-model-server`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fixture model server with parent PID 1 is listed; the doctor suite passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A model server started by hand from a shell is listed | Low | Its parent is the shell, not PID 1 |
| Risk | A model server kept on purpose with `SPECKIT_HF_MODEL_SERVER_ORPHAN_REAP=0` is listed and could be reaped | Low | The presentation note says not to reap it; `--reap` shows the full command before `--yes` |
| Dependency | Phase 032 | No script to change | Merged |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No extra `ps` calls.

### Security
- **NFR-S01**: The reap guard is unchanged.

### Reliability
- **NFR-R01**: Unchanged.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A model server younger than the threshold: not listed.

### Error Scenarios
- Unreadable checkout path: listed as unsupervised, since its parent is PID 1 either way.

### State Transitions
- After phase 003 the next launcher reaps it, so the line clears without a manual reap.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 3/25 | One classifier branch and tests |
| Risk | 4/25 | Report only |
| Research | 2/20 | Known gap |
| **Total** | **9/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
