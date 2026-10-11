---
title: "Feature Specification: Phase 1: compiled-route-manifest-suite"
description: "The compiled-route rebuild failed on main because the authored cli-classifier harness named a removed mode, and the manifest test pinned the hub count at 6 while 7 hubs are served."
trigger_phrases:
  - "compiled route manifest suite"
  - "phase 1 compiled route manifest suite"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: compiled-route-manifest-suite

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/094-root-cause-ux-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 6 |
| **Predecessor** | None |
| **Successor** | 002-admission-corpus-pin |
| **Handoff Criteria** | Every criterion in this phase's `goal.md` passes and the phase is committed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the root cause and UX research packet, which builds the ranked fixes from `../research/research.md`.

**Scope Boundary**: Two files: the authored cli-classifier harness under specs/sk-doc/z_archive and the compiled-route manifest test. The served runtime copy is not touched.

**Dependencies**:
- `../research/research.md` sections 5 and 9, which name both causes

**Deliverables**:
- A rebuild that traces every hub from the authored source
- A manifest suite that passes

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`compiled-route-sync.cjs --check` exited 1 with `authored closure failed to resolve hubs: cli-classifier`. The authored copy of the cli-classifier harness still mapped `cli-classifier/cli-deem/SKILL.md`, a file removed when the cli-deem mode left the hub; the served copy had been updated and the authored copy had not. That error masked a second cause: the manifest test pinned `all 6 hubs resolve` and `DEFAULT_ON_HUBS.size` at 6, while the sync script serves 7 hubs. The suite read 42 tests, 26 pass, 16 fail.

### Purpose
Make the documented rebuild and the manifest suite pass on a clean checkout.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete the stale cli-deem entry from the authored harness
- Derive the test's expected hub count from `sync.HUBS`

### Out of Scope
- Moving the authored source out of `specs/sk-doc/z_archive/`, recorded as an open question in the research
- The served runtime copy, which is already correct

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/008-cli-classifier/harness/build-artifacts.cjs` | Modify | Delete the stale cli-deem entry |
| `.skilled/bin/tests/compiled-route-manifest.test.cjs` | Modify | Read the hub count from `sync.HUBS` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The authored closure resolves every hub | `compiled-route-sync.cjs --check` exits 0 |
| REQ-002 | The manifest suite passes | `node --test` on the suite prints `fail 0` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The serving state stays fresh | `compiled-route-guard.cjs` exits 0 and `--verify` prints move-simulation OK |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The authored harness and the served harness are byte-identical.
- **SC-002**: No test literal pins the hub count.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Reading the count from the producer hides a dropped hub | Low | The guard and `--verify` still name every hub that fails to resolve |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking the phase.
<!-- /ANCHOR:questions -->

---
