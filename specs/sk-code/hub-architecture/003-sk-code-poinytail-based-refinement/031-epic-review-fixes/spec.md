---
title: "Feature Specification: Phase 31: epic-review-fixes"
description: "Fix the three P2 advisories from the 030 epic deep review: a lone dash passing create.sh, an unquoted probe command in the setup report and the hook trust wording."
trigger_phrases:
  - "epic review fixes"
  - "phase 31 epic review fixes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 31: epic-review-fixes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-14 |
| **Branch** | `scaffold/031-epic-review-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 31 of 31 |
| **Predecessor** | 030-epic-deep-review |
| **Successor** | None |
| **Handoff Criteria** | All three fixes pass their suites and the 030 report names them fixed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 31** of the Fix the three P2 advisories from the epic deep review specification.

**Scope Boundary**: The three findings R2, R4 and R5 of 030/review/review-report.md and their tests.

**Dependencies**:
- 030-epic-deep-review

**Deliverables**:
- create.sh lone-dash refusal, a shell-safe probe line and the clarified trust wording, each with its check

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The epic deep review confirmed three small defects. create.sh lets a lone `-` join the title, the setup report prints a probe line that does not rerun a prompt holding shell characters, and the hook trust comment does not say that trust covers every branch of a trusted clone.

### Purpose
Each defect is fixed at its source and pinned by a check.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R5: create.sh refuses a lone `-` like any unknown option
- R4: the setup report shell-quotes the probe prompt
- R2: the six global hooks and the git-hooks README say trust is per repository, not per branch

### Out of Scope
- Pinning hook sources to a trusted revision - a design change that needs its own decision
- The 030 search debt - a scoped follow-up review owns it

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | Lone-dash branch |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/create-unknown-options.vitest.ts` | Modify | Lone-dash case |
| `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs` | Modify | Shell-quoted probe line |
| `.skilled/commands/doctor/scripts/tests/sk-code-setup-check.test.cjs` | Modify | Shell-character case |
| `.skilled/scripts/git-hooks/{pre-commit,prepare-commit-msg,post-commit,post-merge,post-rewrite,pre-push}` | Modify | Trust block wording |
| `.skilled/scripts/git-hooks/README.md` | Modify | Trust sentence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `create.sh - X` exits 1 with the unknown-option error and writes nothing | The create.sh vitest passes 3 of 3 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | A prompt with `"` or `$` prints as a probe line a shell reads back unchanged, and the trust blocks stay identical | Setup-check suite 13 of 13 and source-root suite 58 of 58 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three suites pass with one new case each where code changed
- **SC-002**: strict validation of the epic prints RESULT: PASSED
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The trust-block parity test | Six hooks drift apart | The test fails the change |
| Risk | A quoted display breaks old expectations | Low | Plain prompts print exactly as before |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


