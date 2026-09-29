---
title: "Feature Specification: Reword the status and push rows of the spec folder write recipe post-checks"
description: "Two post-check rows of the write recipe assumed a clean tree and a push to main, which the shared tree and the operator's workspace choice both contradict."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Reword the status and push rows of the spec folder write recipe post-checks

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
Section 4 of the spec folder write recipe listed `git status clean (only the new packet files)` and `git push origin main success`. In this shared tree other sessions hold uncommitted work, so `git status` still listed four paths that were not ours right after our own commit, and the first row cannot pass as written. The push row names `main`, while the workspace bullet of Step 7 now leaves the workspace to the operator, so a worktree or non-`main` session has no honest way to tick it, and a push off the allowlist needs a go-ahead the row does not mention.

### Purpose
Both rows say what an author can honestly verify in any workspace, and the push row points at the rule that says which pushes need approval.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reword the status row so it checks what the commit holds and allows for other sessions' changes in a shared tree.
- Reword the push row so it names the branch the author worked on and points at the Workspace bullet in Step 7.

### Out of Scope
- The Step 7 verification gate, `confirm git status --short only includes the intended packet files before commit`. It has the same shared-tree reading and is left for a separate change.
- The recipe's `version:` value, as in the three neighbouring recipe fixes.
- The other `git push origin main` hits in the sk-git tests and in `finish-workflows.md`, which are fixtures and an example and not copies of these rows.
- Any change to the hook or to sk-git.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md` | Modify | Reword two rows of section 4 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The push row no longer names `main` as the branch and no longer reads as a standing instruction to push | The old row is found in the recipe at `HEAD` and is absent from the working file |
| REQ-002 | The status row checks what the commit holds and allows for other sessions' changes | The old row is found in the recipe at `HEAD` and is absent from the working file |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The pointer in the push row resolves, and no other doc under the skill, command and rule trees repeats either old row | The Workspace bullet exists in Step 7, and a search of the doc roots finds no copy of either row |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both old rows are present at `HEAD` and absent from the working file, and the two new rows carry no em dash and no semicolon.
- **SC-002**: `validate.sh --strict` on this packet prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The `Workspace:` bullet in Step 7 of the same recipe | Low, the push row points at it instead of copying it | A check confirms the bullet exists |
| Risk | The Workspace bullet is renamed and the pointer goes stale | Low | The row quotes the bullet's label, so a search for the label finds both |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

