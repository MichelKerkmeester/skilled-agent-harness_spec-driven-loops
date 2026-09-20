---
title: "Feature Specification: Phase 1: quarantine-destination-canonical"
description: "The quarantine writer canonicalizes every destination and refuses a symlinked component, so a lane cannot redirect the runner's evidence writes outside the artifact root."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: quarantine-destination-canonical

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
| **Phase** | 8 of 13 |
| **Predecessor** | 007-worktree-removal |
| **Successor** | 009-baseline-deletion-detection |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Remediate the deep review findings on the fan-out write containment hardening specification.

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
The quarantine writer created directories and wrote content copies, patches and the manifest under a path derived from the lane's own directory without canonicalizing it. A lane owns that directory, so a symlink planted at the quarantine path made the runner write other files' content wherever the link pointed while reporting a successful quarantine. The deep review rated this the P0.

### Purpose
Every quarantine write lands beneath the real artifact root or is refused and recorded; nothing is ever written through a symlink.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Canonical destination check before every mkdir and write in the quarantine writer
- A `refused` list on the quarantine result naming each refused path and reason
- Tests for an escaping link, a link that resolves back inside the tree, and the ordinary directory case

### Out of Scope
- Detection and the remedy - untouched
- The patch capture's own path - covered by the retention phase
- Throwing on refusal - the writer never fails the lane

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Modify | `quarantineDestinationRefusal` resolves the deepest existing ancestor with realpath, requires it under the real artifact dir, and refuses any symlinked component below it; called before every mkdir and write; refusals collected on the result |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` | Modify | Three new tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Before any directory creation or write under the quarantine root, the deepest existing ancestor is resolved and must lie under the real artifact directory; a symlinked component at or below the artifact root is refused |
| REQ-002 | A refusal is recorded on the quarantine result with path and reason and never throws; the lane's violations and advisories are unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | An ordinary quarantine still writes the manifest and patches exactly as before |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The escaping-link test fails against the unmodified writer and passes after
- **SC-002**: The deep-loop runtime suite exits zero
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A legitimate symlinked artifact root is refused | Low | The check compares real paths, so a root that is itself a symlink resolves and passes; only components below it may not be links |
| Dependency | Node realpath and lstat | Green | None |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One realpath and one lstat per path component per write; negligible beside the git calls

### Security
- **NFR-S01**: No quarantine byte is ever written through a symlink, inside or outside the tree

### Reliability
- **NFR-R01**: A refusal never throws; the lane's outcome is unchanged
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Link pointing outside the repository: refused, nothing at the target
- Link resolving back inside the tree: still refused, a link is a link
- Ordinary directory: written as before

### Error Scenarios
- realpath fails on a dangling link: refused with the reason
- Artifact dir itself is a symlink: resolved and accepted as the root

### State Transitions
- Partial completion: refusals on one path do not stop the others
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One module, one test file |
| Risk | 12/25 | Security boundary in the shared guard |
| Research | 3/20 | Finding located by the review |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


