---
title: "Feature Specification: Replace broad staging in sk-git examples with explicit paths"
description: "A release example staged everything with git add -A and two reference blocks staged whole directories, all against the scoped-staging rule the same skill states."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Replace broad staging in sk-git examples with explicit paths

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-29 |
| **Branch** | `main (no branch created)` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-git skill says never to run `git add -A`, `git add .` or a broad `git add <folder>` while the tree holds unrelated changes, and to stage explicit paths instead (`commit-workflows.md`, "Step 7: Scoped-Staging Discipline"). Three worked examples in its own references break that rule.

Example 5 in `finish-workflows.md` shows a release commit that runs `git add -A` and then pushes to `main`. `commit-workflows.md` shows `git add src/ tests/` under the heading "Use targeted staging instead", which stages two whole directories and contradicts the rule that follows a few lines above it. The staging cheat sheet in `shared-patterns.md` lists the same `git add src/ tests/` as a plain option directly under "Targeted staging (preferred)", with no condition.

An agent that copies any of them in a shared tree stages other sessions' uncommitted work into its own commit. All three files also carried `version:` values far behind the derived ones (`1.1.0.18`, `1.1.0.9` and `1.1.0.12` against `1.7.0.31`, `1.7.0.15` and `1.7.0.21`).

### Purpose
Every worked example in sk-git that runs in a shared tree stages by explicit path, and the three files' versions match the derivation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace `git add -A` in Example 5 of `finish-workflows.md` with explicit file paths and add `git diff --cached --name-only` to show the staged set before the commit.
- Replace the directory staging line in `commit-workflows.md` with explicit file paths.
- Qualify the directory staging option in `shared-patterns.md` so it applies only when every file in the directory is the author's.
- Bring all three files' `version:` to the derived value, plus one for the commit that carries this change.

### Out of Scope
- Broad staging inside dedicated worktrees, which is safe because the tree holds only the author's work. These stay as written: `worktree-workflows.md:513`, `quick-reference.md:274`, `shared-patterns.md:420`, `finish-workflows.md:961` and `large-reorg-playbook.md:76`.
- The `git status --short` checks elsewhere in sk-git, which read state and stage nothing.
- The cli-opencode wording that asks for a clean or committed tree before dispatch. It is a safety rule born of a deletion incident, so it needs the operator's decision and not an unrequested rewrite.
- `git reset HEAD .` in the same cheat sheet. It unstages every path instead of staging one, so it cannot put a peer's file into the author's commit, which is the defect fixed here.
- The write-recipe gate in `system-spec-kit`, which ships in packet `system-speckit/041-write-recipe-fixes/005-fix-write-recipe-verification-gate`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-git/references/finish-workflows.md` | Modify | Example 5 stages explicit paths, `version:` set |
| `.skilled/skills/sk-git/references/commit-workflows.md` | Modify | Targeted-staging line uses explicit file paths, `version:` set |
| `.skilled/skills/sk-git/references/shared-patterns.md` | Modify | Directory staging option carries its condition, `version:` set |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Example 5 no longer runs `git add -A` and shows the staged set before the commit | `git add -A` is found in the file at `HEAD` and is absent from Example 5 in the working file |
| REQ-002 | The two directory-staging lines no longer teach unconditional directory staging | `git add src/ tests/` is found in both files at `HEAD` and is absent from both working files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | All three `version:` values follow the versioning standard | The engine's derived values before the commit are `1.7.0.31`, `1.7.0.15` and `1.7.0.21`, and the files carry `1.7.0.32`, `1.7.0.16` and `1.7.0.22` |
| REQ-004 | Broad staging that stays is limited to dedicated worktrees | Each remaining hit in sk-git is classified and its reason recorded |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The old lines are present at `HEAD` and absent from the working files, and the new lines carry no em dash and no semicolon.
- **SC-002**: `validate.sh --strict` on this packet prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A fix that goes too far and removes legitimate worktree staging | Medium, worktree examples would lose their simple form | Each remaining hit was read and classified before the edit |
| Risk | The build segments are set one above the derived counts by hand | Low, `verify` reads them stale by one if history moves | `verify` after the commit confirms both |
| Dependency | The `Step 7: Scoped-Staging Discipline` heading | Low, the examples now agree with it | It exists at `commit-workflows.md:219` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

