---
title: "Feature Specification: Bring the commit step of the spec folder write recipe in line with the commit hook"
description: "Step 7 of the write recipe told authors to add a Co-Authored-By trailer and to scope by packet, and the commit-msg hook refuses the first and sk-git forbids the second."
trigger_phrases:
  - "fix write recipe commit step"
  - "step 7 of the write recipe told authors"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Bring the commit step of the spec folder write recipe in line with the commit hook

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-29 |
| **Branch** | `main (no branch created)` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Step 7 of the spec folder write recipe told authors to write a subject shaped `feat|chore|fix(<packet>): <short description>` and to add a `Co-Authored-By` trailer. The `commit-msg` hook refuses any `Co-Authored-By:` or `Claude-Session:` line as forbidden attribution, so an author who follows the step literally gets a blocked commit. The subject shape invites the packet as the scope, while sk-git's contract wants a stable subsystem name and the hook refuses numeric-only and slash-path scopes. The step also said nothing of the prose body and the `Spec:` trailer that every authored commit now needs.

### Purpose
An author who follows Step 7 as written produces a commit the hook accepts on the first try.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the subject and trailer bullets of Step 7 with the current contract: subject shape, the body, the `Spec:` trailer, and the ban on attribution trailers.
- Point at the sk-git files that own the contract, so the recipe does not restate it.

### Out of Scope
- The "Stay on main" bullet and the `git push origin main` post-check. They read as the operator's chosen workspace and are left as they are.
- The other steps of the recipe and the companion authoring checklist, which carries no commit wording.
- The recipe's `version:` value, as in the neighbouring recipe fix.
- Any change to the hook or to sk-git.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md` | Modify | Rewrite the commit bullets of Step 7 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Step 7 no longer tells an author to add an attribution trailer, and names the two keys the hook refuses | A message that carries `Co-Authored-By:` or `Claude-Session:` is refused by the hook, and Step 7 says so |
| REQ-002 | Step 7 states the subject shape, the body requirement and the `Spec:` trailer as the sk-git contract defines them | A message built by those rules exits 0 through the hook |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No other doc under the skill, command and rule trees repeats the stale wording | A search of those trees for the old subject shape and the trailer line returns only the recipe before the edit and nothing after it |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Messages shaped the old way are refused and the new shape passes, with the hook run on the same message files before and after the edit.
- **SC-002**: `validate.sh --strict` on this packet prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The sk-git message template and `SKILL.md` own the commit contract | Low, the recipe now points at them instead of copying them | The recipe names both paths and a check confirms they exist |
| Risk | The hook and sk-git change again and the recipe drifts a second time | Low | The recipe states only the four rules a packet author trips over and defers the rest |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---
