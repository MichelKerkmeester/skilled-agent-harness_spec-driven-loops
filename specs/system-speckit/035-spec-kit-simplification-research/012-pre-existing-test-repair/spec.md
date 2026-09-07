---
title: "Feature Specification: Pre-existing test repair"
description: "Repair the two test failures the program recorded but did not own: the continuity-freshness suite edited a retired document the rule never reads, and the child-manifest suite asserted another packet's goal manifest against git."
trigger_phrases:
  - "pre-existing test repair"
  - "continuity freshness test fixture"
  - "child manifest test isolation"
  - "retired checklist fixture"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Pre-existing test repair

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-07 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 |
| **Predecessor** | 011-command-surface-contract-realignment |
| **Successor** | None |
| **Handoff Criteria** | The two suites pass for the reason their subjects define, and the full CLI project reports zero failures |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the spec-kit simplification research program.

**Scope Boundary**: two test files, `runtime/tests/continuity-freshness.vitest.ts` and `runtime/cli/tests/recursive-child-manifest.vitest.ts`. No rule, script or packet outside them changes.

**Dependencies**:
- The attestation binding in `runtime/cli/validation/continuity-freshness.ts`, which verifies every completion claim against `implementation-summary.md`'s own fingerprint
- The manifest checker under the deep-loop packet, which the manifest suite exercises and which stays where it is

**Deliverables**:
- A freshness fixture that edits the document the rule reads, with the retired `checklist.md` gone from the packet it builds
- A manifest suite whose tracked case reads a manifest it writes itself from files it already depends on

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two suites failed before this program and stayed red through it. The continuity-freshness suite built a packet with a `checklist.md`, appended to that file and expected the rule to report a stale fingerprint; the rule verifies a claim against the implementation summary's own fingerprint and never reads the retired document, so the edit changed nothing it hashes and the rule passed. The child-manifest suite read the goal manifest of the deep-loop packet's whole-system gate and asserted every entry tracked; that manifest lists 369 files a later refactor removed, so a test about the checker's behaviour failed on another packet's drift.

### Purpose
Each suite fails only when its subject regresses: the freshness rule missing a stale implementation summary, or the checker misjudging tracked, untracked and git-unavailable manifests.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The fixture, the three stale edits and the metadata-table case in the freshness suite
- The tracked case of the manifest suite

### Out of Scope
- The deep-loop packet's stale goal manifest, which belongs to the session that owns that packet and is reported, not edited
- The freshness rule and the manifest checker themselves, which behave as documented

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/tests/continuity-freshness.vitest.ts` | Modify | Fixture without the retired document; stale edits land on the implementation summary; metadata-table case writes tasks.md |
| `runtime/cli/tests/recursive-child-manifest.vitest.ts` | Modify | Tracked case builds its manifest from this test and the checker |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The freshness suite's two stale cases warn and fail because the implementation summary changed after its fingerprint was stamped |
| REQ-002 | The manifest suite's tracked case passes against files this repository tracks and needs no other packet's manifest |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Neither test file names `checklist.md` |
| REQ-004 | The full CLI vitest project reports zero failures |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both suites pass in isolation and inside their projects
- **SC-002**: The full CLI project, which carried one failure through the whole program, reports none
- **SC-003**: No production file changed
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing the fixture hides a real rule regression | A stale packet passes | The stale edit now hits the document the rule hashes, so the assertions exercise the real path |
| Risk | The manifest checker moves with its packet | The suite's path constant breaks | Unchanged from before; the suite already resolved the checker by path |
| Dependency | The other session's deep-loop packet | Its goal manifest is stale | Reported to the operator; not in this packet's write scope |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The manifest suite still spawns the checker three times; its tracked manifest has two entries instead of 2,016
- **NFR-P02**: The freshness suite writes one fewer fixture file

### Security
- **NFR-S01**: No test writes outside its temporary directory
- **NFR-S02**: No rule became less strict

### Reliability
- **NFR-R01**: The tracked case no longer depends on a file another session edits
- **NFR-R02**: Every gate result was read from its output
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an empty manifest still reports zero entries checked
- Maximum length: not applicable
- Invalid format: a missing entry still prints NOT TRACKED

### Error Scenarios
- External service failure: not applicable
- Network timeout: not applicable
- Concurrent access: the other session's working-tree edits stayed out of the private index

### State Transitions
- Partial completion: both files ship in one commit
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Two test files |
| Risk | 6/25 | Fixture and isolation changes only |
| Research | 6/20 | Both root causes traced through the rule and the checker |
| **Total** | **18/70** | **Level 2, kept for the acceptance-criteria gate** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
