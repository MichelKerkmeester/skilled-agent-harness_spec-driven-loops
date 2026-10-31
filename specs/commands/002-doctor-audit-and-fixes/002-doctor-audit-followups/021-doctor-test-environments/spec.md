---
title: "Feature Specification: Phase 21: doctor-test-environments"
description: "The doctor scenarios had no repository state to run against: /doctor:update needed real customized, conflicting, removed and local units, and the other suites used throwaway copies. Two long-lived local worktrees now provide that state, and building the update fixture exposed an engine crash on symlinked parents."
trigger_phrases:
  - "doctor test environments"
  - "doctor update test fixture"
  - "doctor test environment worktree"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 21: doctor-test-environments

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-04 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 21 of 21 |
| **Predecessor** | 020-doctor-contract-fixes |
| **Successor** | None |
| **Handoff Criteria** | A scoped offline check in the fixture reports customized, local, conflict and removed, and an apply followed by rollback leaves the fixture as committed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 21** of the doctor audit follow-ups. Phase 019 designed the environments and the operator chose an allocator-numbered worktree with a dot-name symlink, plus a second environment that follows main. This phase builds both. Neither is pushed, so the repository records only how they were built.

**Scope Boundary**: Local worktrees under `.worktrees/` and one local tag. No tracked repository file changes in this phase beyond these docs.

**Dependencies**:
- The research in `019-doctor-test-environment-research/research/research.md`
- `worktree-naming.sh` for allocating both worktrees
- The Barter sk-git snapshot in the main checkout

**Deliverables**:
- `.worktrees/087-doctor-update-test-environment`, symlinked as `.worktrees/.doctor-update-test-environment`, with five fixture commits
- The local tag `v4.0.0.3-fixture`
- `.worktrees/088-doctor-test-environment`, symlinked as `.worktrees/.doctor-test-environment`, following `origin/main`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/doctor:update` scenarios described units nobody could produce, because a normal checkout has no customized, conflicting, removed or local units against an older release. The other doctor scenarios asked for a fresh throwaway copy each time.

### Purpose
Two environments the doctor scenarios can run against repeatedly, each with a documented reset.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The update fixture from `v4.0.0.0`: updater overlay, Webflow customization, local web-dev packet, Barter sk-git, recorded base
- The local prerelease tag without `sk-code-obsidian`
- The current-code environment from `origin/main`
- A check of all four unit statuses and one apply-and-rollback round trip

### Out of Scope
- Installing dependencies in the current-code environment - each scenario that needs them provisions it, after operator approval
- Fixing the engine crash the fixture exposed - a follow-up phase

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.worktrees/087-doctor-update-test-environment/` (local, untracked) | Create | The update fixture worktree and its five commits |
| `.worktrees/088-doctor-test-environment/` (local, untracked) | Create | The current-code environment |
| `.worktrees/.doctor-update-test-environment`, `.worktrees/.doctor-test-environment` | Create | Symlinks with the requested names |
| `021-doctor-test-environments/` | Create | This phase's record |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The fixture gives one unit of each status | A scoped offline check reports `customized`, `local`, `conflict` and `removed` |
| REQ-002 | The fixture resets cleanly | Rollback restores every applied path with nothing skipped, and `git status --porcelain` is empty |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Both environments stay local | Neither branch nor the fixture tag exists on `origin` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every fixture status comes from a committed change, not from uncommitted edits.
- **SC-002**: Both environments carry the requested recognizable names.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Someone pushes the fixture tag | Med | The tag message, the README and DOC-379 say never push it, and `git push origin HEAD:main` does not push tags |
| Risk | The old-tag hooks block fixture commits | Low | Fixture commits use the two gate bypasses the hooks name, never `--no-verify` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

