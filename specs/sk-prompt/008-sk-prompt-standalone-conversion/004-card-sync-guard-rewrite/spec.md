---
title: "Feature Specification: Phase 4: card-sync-guard-rewrite"
description: "Reduce the prompt-knowledge drift guard to the two checks that still have a subject, and repoint them at the surviving canonical home."
trigger_phrases:
  - "008 phase 004"
  - "sk-prompt card-sync-guard-rewrite"
  - "card-sync-guard-rewrite"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: card-sync-guard-rewrite

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-28 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 8 |
| **Predecessor** | 003-routing-baseline-recapture |
| **Successor** | 005-cli-orchestration-repoint |
| **Handoff Criteria** | The guard reports PASS across both surviving checks and exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the sk-prompt standalone conversion.

**Scope Boundary**: The two surviving checks' matching logic, which is unchanged

**Dependencies**:
- The canonical card must exist at its new location before the header is repointed, which the previous phase ensured.

**Deliverables**:
- Remove the registry-completeness and discovery-reachability checks
- Repoint the canonical-location header at the surviving card and reference
- Update the CI workflow's stated coverage

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The guard ran four structural checks; two of them read the deleted model registry directly and now crash with a FileNotFoundError before reporting anything. Because the guard blocks every pull request to main and runs from the pre-commit hook, it has to be correct before any further edits land.

### Purpose
The guard enforces exactly the invariants that still exist - that the framework and CLEAR tables are not inlined into an executor card, and that the escalation trigger list stays pointer-only - and passes from a clean run.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove the registry-completeness and discovery-reachability checks
- Repoint the canonical-location header at the surviving card and reference
- Update the CI workflow's stated coverage
- Correct the pre-commit hook's staged-path regex

### Out of Scope
- The two surviving checks' matching logic, which is unchanged
- The executor cards themselves, repointed in the next phase

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/check-prompt-quality-card-sync.sh` | Modify | Excise the two registry-reading checks; repoint the canonical-location header |
| `.github/workflows/prompt-card-sync.yml` | Modify | Describe the two checks that remain |
| `.opencode/scripts/git-hooks/pre-commit` | Modify | Correct the staged-path regex and the remediation pointer |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The guard runs clean from the repository root | `bash check-prompt-quality-card-sync.sh .` exits 0 |
| REQ-002 | No surviving check reads a deleted path | A search of the guard for the retired packet name returns nothing |
| REQ-003 | The pre-commit regex matches the surfaces the guard actually checks | A self-test over four in-scope paths matches and an out-of-scope path does not |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The remediation message points at a file that exists | The referenced canonical card resolves on disk |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The guard reports PASS across both surviving checks and exits 0
- **SC-002**: The pre-commit regex is proven by a positive and negative self-test rather than by inspection
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Deleting checks weakens a real guard | A future drift class goes unnoticed | Only the two checks whose subject was deleted were removed; the two that guard the surviving invariants are untouched |
| Risk | The pre-commit regex was already wrong | A staged prompt-knowledge edit skips the guard | Found during the rewrite: it named underscored filenames that never existed and a top-level path that never existed; corrected and self-tested |
| Dependency | The guard is a required pull-request check | A broken guard blocks every merge | Rewritten and run before any dependent phase proceeded |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None; the phase closed against its recorded acceptance checks.
<!-- /ANCHOR:questions -->
