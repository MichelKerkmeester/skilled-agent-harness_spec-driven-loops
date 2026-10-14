---
title: "Feature Specification: Phase 33: follow-up-review-fixes"
description: "Close the P0 hook trust hole and the two P2s from the follow-up review: untrusted clones read no code from their own tree, the zero Commit-Id is refused and the catalog states the real enrollment rule."
trigger_phrases:
  - "follow up review fixes"
  - "phase 33 follow up review fixes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 33: follow-up-review-fixes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-14 |
| **Branch** | `scaffold/033-follow-up-review-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 33 of 33 |
| **Predecessor** | 032-epic-follow-up-review |
| **Successor** | None |
| **Handoff Criteria** | The hook suites pass with the new cases and the 032 report names all three fixed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 33** of the Fix the P0 hook trust hole and the two P2s from the follow-up review specification.

**Scope Boundary**: The three findings of 032/review/review-report.md and their tests.

**Dependencies**:
- 032-epic-follow-up-review

**Deliverables**:
- The untrusted root moved outside every repository, the zero-id refusal and the catalog sentence, each with its check

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every global hook pointed an untrusted repository at `$REPO_ROOT/.skilled-untrusted`, a folder inside that repository, so any clone could run its own code on commit or push. The Commit-Id checks also accepted the reserved `0000000`, and the sk-git catalog misstated which repositories get stamped.

### Purpose
No repository the hooks do not trust can run code through them, and the Commit-Id rules match the allocator and the docs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R2-P0-001: the untrusted source root moves to `/dev/null/.skilled-untrusted` in all six trust blocks
- R3: `0000000` is refused at commit and at push
- R4: the catalog states the enrollment rule and the opt-out

### Out of Scope
- Pinning trusted hook sources to a revision - a separate design decision
- The 032 search debt - deferred in that report

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/scripts/git-hooks/` six hooks | Modify | Untrusted root outside the clone |
| `.skilled/scripts/git-hooks/tests/source-root-selection.test.sh` | Modify | Planted `.skilled-untrusted` cases |
| `.skilled/scripts/git-hooks/lib/commit-id-policy.sh`, `pre-push` | Modify | Zero-id refusal |
| `.skilled/skills/sk-git/assets/commit-message-template.md` | Modify | Zero-id pattern |
| `.skilled/scripts/git-hooks/tests/commit-msg.test.sh`, `.skilled/skills/sk-git/scripts/lib/message-contract.test.mjs` | Modify | Zero-id cases |
| `.skilled/skills/sk-git/feature-catalog/workflow-playbooks/conventional-commit-workflows.md` | Modify | Enrollment wording |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A guard or allocator planted under `.skilled-untrusted` in an untrusted clone never runs | source-root-selection.test.sh passes its two new cases |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | `Commit-Id: 0000000` is refused at commit and at push | commit-msg and message-contract suites pass their new cases |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: every hook suite passes, with source-root at 60 from 58
- **SC-002**: strict validation of the epic prints RESULT: PASSED
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The trust-block parity test | The six hooks drift apart | The test fails the change |
| Risk | A path under /dev/null behaves differently on another OS | Low | /dev/null is a character device on every POSIX system |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


