---
title: "Feature Specification: Provision private local commands in the form the primary checkout holds them"
description: "Worktree provisioning turned every private local-* command into an absolute link, and the pre-commit mirror gate then blocked every commit in that worktree. Each entry is now recreated in the form the primary checkout holds it."
trigger_phrases:
  - "provision private command links"
  - "provision private commands by form"
  - "new worktree cannot commit local commands"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Provision private local commands in the form the primary checkout holds them

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-08 |
| **Branch** | `worktrees/324-overlay-repin-barter-parity` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`worktree-naming.sh provision` linked each private `local-*` command into a new worktree as an absolute link to the primary checkout. The primary holds them as real files, relative links and folders, and the mirror generators walk real files and want relative links, so the pre-commit mirror gate blocked every commit in a freshly provisioned worktree.

### Purpose
A provisioned worktree holds each private command in the same form as the primary checkout and can commit.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
`local-*` entries listed in the primary checkout and in this worktree before its manual repair, per folder the root `.gitignore` names:

```text
primary  .skilled/commands/local-skilled-alignment.md      FILE
primary  .skilled/commands/assets/local-skilled-alignment   DIR
primary  .opencode/commands/local-skilled-alignment.md      LINK -> ../../.skilled/commands/local-skilled-alignment.md
primary  .codex/prompts/local-skilled-alignment.md          FILE
worktree every entry                                       LINK -> /Users/michelkerkmeester/MEGA/Development/Skilled/...
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Recreate each entry by its form: a link as the same link text, a folder as one absolute link, a file as a copy.
- Update the provisioning test and the `SKILL.md` line that describes it.

### Out of Scope
- Private skills. They stay out of provisioning, as before.
- The DSH mirror walk following links. Copying files removes the need.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-git/scripts/worktree-naming.sh` | Modify | Form-preserving `_wn_link_local_commands` |
| `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` | Modify | Asserts each form |
| `.skilled/skills/sk-git/SKILL.md` | Modify | Describes the new behavior |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each private entry keeps its primary form | The provisioning test asserts a real-file router, the same relative link text for a mirror and a shared folder link |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Nothing else in provisioning regresses | `worktree-naming.test.sh` ends `FAIL=0` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `worktree-naming.test.sh` passes, and its new assertions fail against the old function.
- **SC-002**: A worktree provisioned this way holds the same entry forms as the primary checkout.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The root `.gitignore` names every private command folder | An unnamed folder is not provisioned | Unchanged from before: the function reads the ignore rules |
| Risk | A copied file drifts from the primary copy | Low | Said in the function comment and `SKILL.md`: an edit to a copied file stays in its worktree |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
