---
title: "Feature Specification: Phase 5: skill-packet-and-registry"
description: "The system-deep-loop hub still registers both modes and ships the deep-improvement packet. This phase deletes the packet and removes the two modes from the hub's registry, router, metadata, catalog, playbook and compiled-routing stage."
trigger_phrases:
  - "skill packet and registry"
  - "phase 5 skill packet and registry"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: skill-packet-and-registry

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | worktree branch from sk-git's allocator |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 10 |
| **Predecessor** | 004-commands-and-runtime-mirrors |
| **Successor** | 006-runtime-libraries-and-tests |
| **Handoff Criteria** | `mode-registry.json` holds exactly three modes. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the agent-improvement and model-benchmark removal packet. The program and its decisions are in `../002-removal-plan/plan.md` and `../002-removal-plan/decision-record.md`.

**Scope Boundary**: only the files in this folder's `scratch/` lists, plus the packet directory. Implementation runs in the git worktree.

**Dependencies**:
- Phases: 003, 004

**Deliverables**:
- Delete `.skilled/skills/system-deep-loop/deep-improvement/` whole
- Remove both modes from the 11 hub root files in `scratch/files.txt`
- Remove them from the hub feature catalog, manual-testing playbook (IL-001 and IL-002 deleted), `shared/` and sibling READMEs
- Update compiled-routing stage 009: compiler mode order, `SHARED_PACKET_COLLAPSE` invariant, canary cases

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`mode-registry.json` is the single source the advisor maps, the drift guard, the compiled-routing compiler and both plugin guards read. While it lists the two modes, and while the packet sits on disk, the modes stay routable.

### Purpose
The hub registers research, review and ai-council only, and nothing on disk implements the removed modes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete `.skilled/skills/system-deep-loop/deep-improvement/` whole
- Remove both modes from the 11 hub root files in `scratch/files.txt`
- Remove them from the hub feature catalog, manual-testing playbook (IL-001 and IL-002 deleted), `shared/` and sibling READMEs
- Update compiled-routing stage 009: compiler mode order, `SHARED_PACKET_COLLAPSE` invariant, canary cases

### Out of Scope
- Runtime libraries - phase 006
- Advisor maps - phase 007

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/files.txt` (35 files, including the `.skilled/changelog/system-deep-loop/deep-improvement` symlink, which becomes the real changelog folder moved out of the packet so the history survives the deletion) | Delete/Modify | The exact file list this phase owns |
| `.skilled/skills/system-deep-loop/deep-improvement/` | Delete | The whole packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The packet is gone from the tree. Verified by: `git ls-files .skilled/skills/system-deep-loop/deep-improvement` prints nothing (an ignored local test cache may remain in a working copy and is never committed) |
| REQ-002 | The registry lists three modes. Verified by: `mode-registry.json` modes: research, review, ai-council |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Compiled-routing canaries pass. Verified by: canary tests for stage 009 exit 0 |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `mode-registry.json` holds exactly three modes.
- **SC-002**: Hub conformance and canary checks pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 003, 004 | Starting early breaks a gate | Follow the order in `../002-removal-plan/plan.md` |
| Risk | A sibling README still links into the deleted packet | M | Phase 010 link check and zero-reference search |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each DeepSeek work unit carries one change set, short enough to finish in one dispatch.

### Security
- **NFR-S01**: Every dispatch names banned operations and allowed write paths and runs in the worktree.

### Reliability
- **NFR-R01**: Each work unit has a tree snapshot to roll back to.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Generated files are never hand-edited; phase 010 regenerates them.

### Error Scenarios
- A work unit writes outside its list: restore the snapshot and re-dispatch with the brief corrected.
- DevPass hits its limit: fall back to Cline at `xhigh`, then wait for the reset.

### State Transitions
- Partial phase: `tasks.md` marks each finished work unit with its snapshot hash.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 11/25 | Files in `scratch/files.txt` |
| Risk | 12/25 | Shared contracts; reversible by snapshot |
| Research | 3/20 | Done in phase 001 |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None open. Decisions are in `../002-removal-plan/decision-record.md`.
<!-- /ANCHOR:questions -->

---
