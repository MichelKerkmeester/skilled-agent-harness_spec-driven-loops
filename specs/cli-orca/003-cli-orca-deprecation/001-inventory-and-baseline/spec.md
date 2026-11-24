---
title: "Feature Specification: Phase 1: inventory-and-baseline"
description: "Classify every live reference to the cli-orca skill and record the test baseline before any file changes."
trigger_phrases:
  - "cli orca removal inventory"
  - "cli orca removal baseline"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: inventory-and-baseline

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-24 |
| **Branch** | `worktrees/534-deprecate-cli-orca` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | 002-runtime-code-and-tests |
| **Handoff Criteria** | The manifest classifies every hit and the baseline logs carry exit codes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Deprecate and remove the cli-orca skill specification.

**Scope Boundary**: Read-only: the reference inventory, its classification and the baseline test runs. No tracked file outside this packet changes.

**Dependencies**:
- The worktree is provisioned, so the test suites can run

**Deliverables**:
- `scratch/removal-manifest.md`, every hit classified as delete, edit, regenerate or keep
- `scratch/baseline-*.log` and `scratch/baseline-exits.txt`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Deleting the skill folder alone would leave advisor edges, tests, fixtures and docs pointing at a skill that no longer exists. A bare `orca` search also matches identifiers such as `priorCandidates`, so the raw hit list overstates the work.

### Purpose
Produce a classified removal manifest and a baseline that later phases compare against.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
rg -l -i "cli-orca|\borca\b" (outside specs/, the skill and the skill-tree symlinks)
before: 40 files; 22 delete, edit or regenerate targets and 18 kept with a reason
baseline-exits.txt: advisor-vitest exit=1 (13 failed | 2725 passed), readme-manifest exit=1,
metadata-contract, readme-verdicts, cite-drift, runtime-mirrors, opencode-advisor-plugin exit=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run the word-boundary inventory and classify each hit
- Record the worktree HEAD and the baseline of every suite later phases touch

### Out of Scope
- Edits to any tracked file - later phases own every change

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/removal-manifest.md` | Create | Classified inventory |
| `scratch/baseline-*.log`, `scratch/baseline-exits.txt`, `scratch/baseline-head.txt` | Create | Baseline evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every inventory hit has a class: delete, edit, regenerate or keep, and each keep row states a reason |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | Each suite later phases touch has a baseline log with its exit code |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/removal-manifest.md` lists sections 1 to 5 with no unclassified hit
- **SC-002**: `scratch/baseline-exits.txt` lists seven suites with exit codes
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Provisioned worktree | Suites cannot run | Reinstall dev dependencies and rerun `worktree-naming.sh provision` |
| Risk | A kept hit hides a live reference | Low | Each keep row names why the hit is not the skill |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

N/A: this phase removes code and documentation and runs no service, so it sets no performance, security or uptime target.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an empty search prints nothing and exits 1, which is ripgrep's no-match code.
- Maximum input: the search covers the whole repository outside `specs/`.
- Failure path: an unprovisioned worktree fails the TypeScript builds, so provisioning comes first.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | 2 file groups |
| Risk | 3/25 | Removal only; git restores every path |
| Research | 6/20 | Inventory and tool lookup |
| **Total** | **13/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose full removal on 2026-11-24.
<!-- /ANCHOR:questions -->

---
