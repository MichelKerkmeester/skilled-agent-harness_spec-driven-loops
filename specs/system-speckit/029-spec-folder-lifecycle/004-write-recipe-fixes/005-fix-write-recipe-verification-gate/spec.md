---
title: "Feature Specification: Reword the Step 7 verification gate of the spec folder write recipe"
description: "The gate told the author to confirm that git status lists only the packet files, which a shared tree never allows, and the recipe's version had drifted from the derived value."
trigger_phrases:
  - "fix write recipe verification gate"
  - "the gate told the author to confirm"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Reword the Step 7 verification gate of the spec folder write recipe

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
The last line of Step 7 in the spec folder write recipe said to confirm that `git status --short` only includes the intended packet files before commit. In this shared tree other sessions hold uncommitted work, so `git status --short` lists four paths that are not the author's, and the gate cannot pass as written. The previous packet fixed the same assumption in the section 4 post-check rows and left this line for later.

The recipe's `version:` was also stale. It read `3.5.0.5` while the versioning standard derives `4.1.0.19` from the skill anchor and the per-file edit count, and earlier recipe fixes never brought it forward.

### Purpose
The gate checks what is actually staged, which is the one thing that decides what a commit holds, and the recipe's version matches the derivation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reword the Step 7 verification gate so it stages explicit paths and checks the staged set with `git diff --cached --name-only`, and cite the sk-git step that owns scoped staging.
- Bring the recipe's `version:` to the derived value with the versioning engine, plus one for the commit that carries this change.

### Out of Scope
- The sk-git example fixes that share this defect class, which live in packet `sk-git/031-fix-broad-staging-in-examples` and ship in the next commit.
- Any change to the hook or to the sk-git contract itself.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md` | Modify | Reword the Step 7 gate and set `version:` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The gate checks the staged set and no longer asks that `git status --short` list only packet files | The old gate text is found in the recipe at `HEAD` and is absent from the working file |
| REQ-002 | The gate cites the sk-git step that owns scoped staging | The cited heading exists in `commit-workflows.md` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | `version:` follows the versioning standard | The engine's derived value before the commit is `4.1.0.19` and the file carries `4.1.0.20` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The old gate text is present at `HEAD` and absent from the working file, and the new gate carries no em dash and no semicolon.
- **SC-002**: `validate.sh --strict` on this packet prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The `Step 7: Scoped-Staging Discipline` heading in `commit-workflows.md` | Low, the gate cites it by name | A check confirms the heading exists |
| Risk | The build segment is set one above the derived count by hand | Low, the check reads stale by one if the count moves | `verify` after the commit confirms it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

