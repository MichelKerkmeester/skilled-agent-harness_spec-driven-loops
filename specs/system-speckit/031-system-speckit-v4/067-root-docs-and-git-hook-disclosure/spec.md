---
title: "Feature Specification: Root docs and git hook disclosure"
description: "CONTRIBUTING named the old project and clone URL, and no user-facing doc said the repository installs git hooks that block commits. This phase fixes the root docs, links every off switch from one README section and names a bypass in each hook block."
trigger_phrases:
  - "root docs and git hook disclosure"
  - "readme git hooks section"
  - "readme off switches section"
  - "git hook block message bypass"
  - "contributing clone url"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Root docs and git hook disclosure

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 67 of 67 |
| **Predecessor** | 066-pre-v4-spec-upgrade |
| **Successor** | None |
| **Handoff Criteria** | Every block in the commit-msg, pre-commit and pre-push hooks names a way through, and the README's Git Hooks and Off Switches sections resolve from CONTRIBUTING and from each other |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 67** of the system-speckit v4 program. It covers what a person who clones the repository reads first: the root README, CONTRIBUTING and `.env.example`, and the messages the git hooks print when they block.

**Scope Boundary**: the root docs, the `.env.example` switch list and the block messages of the commit-msg and pre-commit hooks. What the hooks check, and the runtime settings the repository ships, stay as they are.

**Dependencies**:
- The validation off switches from `specs/sk-doc/062-doc-validation-off-switches`, which the Off Switches section links
- The git hooks under `.skilled/scripts/git-hooks/` and their test suites

**Deliverables**:
- A "Git Hooks" subsection in the README's Quick Start and an "Off Switches" subsection in its Configuration section
- CONTRIBUTING with the Skilled name, the current clone URL and the commit rules the commit-msg hook enforces
- An `.env.example` header saying where switches are read, and a complete git hook bypass list
- A bypass line in each hook block message that lacked one, with a test case for each

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A fresh review of the external user experience on 2026-09-28 found the root docs stale. `CONTRIBUTING.md` still called the project "OpenCode Dev Environment" and cloned a URL the repository no longer uses. Nothing a new user reads said that the first AI session installs git hooks that block commits and pushes. Seven block messages in the commit-msg and pre-commit hooks named no way through, and the off switches for hooks, validators and git hooks were spread over three READMEs and `.env.example` with no one place to point a reader to.

### Purpose
A new user learns from the README what the git hooks do, how to get one command through and how to turn the hooks off, and finds every off switch from one section.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `CONTRIBUTING.md`: the project name, the clone URL, commit rules that match the commit-msg hook and a pointer to the README's Git Hooks section
- `README.md`: a "Git Hooks" subsection in Quick Start and an "Off Switches" subsection in Configuration
- `.env.example`: a header saying where switches are read and the full git hook bypass list
- The commit-msg and pre-commit hooks: a bypass line in every block message that lacked one
- The two hook test suites: a case for each new bypass line

### Out of Scope
- The runtime settings the repository ships (`.claude/settings.json`, `opencode.json`, `.pi/settings.json`) - not requested
- `AGENTS.md` - not requested
- A switch of its own for the agent mirror gate - its block names the whole-chain switch instead, see the plan's decision
- The README line naming a `CLAUDE.md` symlink - commit `003dabe08d` fixed it before this phase started
- The validation switch lines in `.env.example` Section 5 - they close review finding F002 and belong to `specs/sk-doc/062-doc-validation-off-switches`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `README.md` | Modify | Git Hooks and Off Switches subsections |
| `CONTRIBUTING.md` | Modify | Name, clone URL, commit rules and a pointer to the hooks |
| `.env.example` | Modify | Where switches are read, the full git hook bypass list |
| `.skilled/scripts/git-hooks/commit-msg` | Modify | Bypass line on the two early blocks |
| `.skilled/scripts/git-hooks/pre-commit` | Modify | Bypass line on five blocks |
| `.skilled/scripts/git-hooks/tests/commit-msg.test.sh` | Modify | Case 17, both early blocks |
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` | Modify | Bypass checks on two cases and cases 40 to 42 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every block in the commit-msg and pre-commit hooks names the variable that lets that one command through | Each block path prints a `Bypass:` line or the whole-chain switch, and a test case asserts it |
| REQ-002 | The README tells a new user what the git hooks block, what installs them and how to remove them for good | Quick Start holds a "Git Hooks" subsection with the three blocking hooks, the bypass rule, the uninstall command and the switch that stops the reinstall |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | One README section links every off switch | Configuration holds an "Off Switches" subsection naming the master hook switch, both validation switches, the git hook bypasses and `.env.example`, and the Git Hooks subsection links it |
| REQ-004 | CONTRIBUTING matches the repository | It names Skilled, clones `skilled-agent-harness_spec-driven-loops`, states the commit rules the commit-msg hook enforces and links the README's Git Hooks section |
| REQ-005 | `.env.example` says where each group of switches is read and lists every git hook bypass | The header names Code Mode as the only `.env` reader, and Section 16 lists each bypass the hooks read |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The commit-msg suite passes 19 of 19 and the pre-commit suite passes 55 of 55, with the new bypass cases among them.
- **SC-002**: `validate_document.py` reports no new issue on `README.md` or `CONTRIBUTING.md`, and the added lines carry no HVR hard blocker.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Another session edits `README.md` | A shared file could mix two sessions' hunks in one commit | Check `git status` on the file before staging, and stage only this phase's hunks |
| Risk | A doc claim drifts from what a hook does | A user trusts a switch that does not work | Each claim was checked against the hook source, and the bypass lines are asserted by test cases |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator chose the packet layout on 2026-09-28: review fixes stay in 062, and the root docs and git hook disclosure form this phase.
<!-- /ANCHOR:questions -->

---
