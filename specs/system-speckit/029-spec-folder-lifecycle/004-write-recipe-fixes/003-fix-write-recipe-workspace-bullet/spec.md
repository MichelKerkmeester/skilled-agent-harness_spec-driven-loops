---
title: "Feature Specification: Reword the workspace bullet of the spec folder write recipe commit step"
description: "The first bullet of Step 7 cited a memory note as repo authority and fixed main as the workspace, while sk-git leaves the workspace choice to the operator."
trigger_phrases:
  - "fix write recipe workspace bullet"
  - "the first bullet of step 7 cited"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Reword the workspace bullet of the spec folder write recipe commit step

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
The first bullet of Step 7 in the spec folder write recipe read `Stay on main (no feature branches per memory rule)`. It cites a memory note as if it were repo authority, and a reader has no memory note to open. It also fixes `main` as the workspace, while `Workspace Choice Enforcement` in sk-git says the AI never chooses between a worktree and the current branch and never creates a branch with git primitives. An author whose operator picked a worktree finds the recipe telling them something else.

### Purpose
The workspace bullet states what sk-git states, points at the sections that own it, and no longer leans on a note outside the repo.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the workspace bullet of Step 7 with the sk-git rule: the operator chooses the workspace, no branch is made with git primitives, `main` is on the remote allowlist, and a branch off the allowlist needs a go-ahead for that push.
- Name the two sk-git sections that own those rules, so the recipe does not restate them.

### Out of Scope
- The `git push origin main success` post-check in section 4. It stays main-specific and is noted as a known limit.
- The recipe's `version:` value, as in the two neighbouring recipe fixes.
- The sk-git playbook scenario GIT-003, which tests a session's main-only preference and is not a copy of this bullet.
- Any change to the hook or to sk-git.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md` | Modify | Reword the workspace bullet of Step 7 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The bullet no longer cites a memory note and no longer fixes `main` as the workspace | A search of the recipe for the old wording finds it at `HEAD` and finds nothing after the edit |
| REQ-002 | Every claim in the new bullet matches sk-git | Both quoted section headings exist in `SKILL.md`, and `main` is on the remote allowlist that `SKILL.md` and `remote-branch-allowlist.txt` describe |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No other doc under the skill, command and rule trees repeats the old bullet | A search of those trees for the old wording returns no copy of it, and any other hit is explained |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The old wording is present in the recipe at `HEAD` and absent from the working file.
- **SC-002**: `validate.sh --strict` on this packet prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The two sk-git sections own the workspace and push rules | Low, the recipe points at them instead of copying them | A check confirms both headings and the allowlist line exist |
| Risk | The section titles in sk-git change and the pointers go stale | Low | The bullet quotes the titles, so a search for the old title finds the recipe |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

