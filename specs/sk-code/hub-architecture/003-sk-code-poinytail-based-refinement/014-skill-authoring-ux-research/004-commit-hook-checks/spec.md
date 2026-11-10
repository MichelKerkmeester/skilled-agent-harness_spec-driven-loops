---
title: "Feature Specification: Phase 4: commit-hook-checks"
description: "Run the leaf-manifest, doctor and intent-signal checks for a staged skill at commit, and say when gates are skipped."
trigger_phrases:
  - "commit hook checks"
  - "phase 4 commit hook checks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: commit-hook-checks

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
| **Branch** | `worktrees/095-skill-authoring-ux-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 9 |
| **Predecessor** | 003-unread-version-fields |
| **Successor** | 005-changelog-single-bump |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the skill authoring UX phase parent. It remediates findings from `../001-authoring-ux-research/research/research.md`.

**Scope Boundary**: Only the files in the table below change. Document content owned by the parallel feature-catalog track is handed off, not edited.

**Dependencies**:
- The research in `../001-authoring-ux-research/`.
- The DeepSeek V4.1 Flash builder through cli-pi, verified by the orchestrator.

**Deliverables**:
- Run the leaf-manifest, doctor and intent-signal checks for a staged skill at commit, and say when gates are skipped.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The leaf manifest, the doctor parity and structure rules and the router intent-signal carry are checked only by CI or by hand, so drift lands and costs an amend. The mirror-parity block says only "regenerate the mirror the message names". In an untrusted clone the hook runs no gate and prints nothing.

### Purpose
Catch these drifts at the commit that introduces them, with a message that names the exact fix command, and tell the author when gates were skipped.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new skill-authoring gate in `.skilled/scripts/git-hooks/pre-commit` for each skill root with a staged file.
- The mirror-parity fix line naming the write command.
- A stderr hint in the untrusted-clone branch naming `git config --local skilled.trustRepoHooks true`.
- Cases in `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`.

### Out of Scope
- Auto-staging a regenerated leaf manifest: the generator reads the working tree, untracked files included, so the gate blocks and names the command instead.
- The main checkout's live hook, which runs the main checkout copy until this merges.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/scripts/git-hooks/pre-commit` | Modify | Skill-authoring gate, mirror fix line, untrusted hint |
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` | Modify | Cases for the new gate and the hint |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Stale leaf manifest blocks with the write command | A harness case blocks and the log names generate-leaf-manifest.cjs --write |
| REQ-002 | A failing doctor run on a staged hub blocks | A harness case blocks on a stub doctor failure |
| REQ-003 | An untrusted toolchain clone prints the trust hint | A harness case finds skilled.trustRepoHooks in the log |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-090 | Strict validation of this phase passes | validate.sh --strict prints RESULT: PASSED |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every completion criterion in goal.md passes when the orchestrator reruns it.
- **SC-002**: The phase lands as one conventional commit in the worktree.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | LLM Gateway route for DeepSeek V4.1 Flash | The build cannot start | Switch to the cline route; if that is limited too, wait for the reset |
| Risk | A builder report is a claim | High | The orchestrator reruns every check itself |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
