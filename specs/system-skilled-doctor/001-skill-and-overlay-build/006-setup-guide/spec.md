---
title: "Feature Specification: Setup guide for using Skilled in your own project"
description: "The root README covered linking as reference and never showed how to start a copied Skilled with overlays. A root SETUP.md now guides both paths step by step, and the README points to it."
trigger_phrases:
  - "skilled setup guide"
  - "link or copy skilled into a project"
  - "first overlay setup"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Setup guide for using Skilled in your own project

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
The root README held about 160 lines of setup detail written as reference. It covered linking well but gave no way to choose between linking and copying, and no steps to start a copied Skilled: the first copy, the manifest and its fields, the first overlay and the first re-pin. Its link-shape text also said `auto` links a missing folder whole, which the engine does only for folders without relative links.

### Purpose
One guide, `SETUP.md`, takes a user from a Skilled checkout to a working linked or copied project, with every step tested, and the root README points to it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Every step the guide shows was run in throwaway folders on 2026-11-08. Link path on an empty git repo with `symlink-engine.cjs`, copy path on a copy archived from `877c9b021c`:

```text
link, first run    check: linked-merge .skilled, partial-merge .claude and .opencode
link, second run   check: linked-merge everywhere; git status lists 3 relative links in .claude
unlink, both runs  the project holds only .git, git status clean, exclude lines gone
status, no folder  exit 2: no overlay manifest at skilled-overlays/overlay-manifest.json ...
status, 2 overlays overlay-edited=2, RESULT: FAILED, exit 1
apply              2 changed, exit 0; status RESULT: PASSED; second apply 0 changed
live edit          status and apply exit 1, apply writes nothing; --capture moves it, PASSED
repin --stage      copy 747 paths, RESULT: STAGED, project untouched
repin, live        pin 877c9b021c -> 49b79d094a, overlays kept, RESULT: PASSED
repin --rollback   restored 745 paths, removed 6, pin back to 877c9b021c, PASSED
unowned edit       refuse: unowned .skilled/skills/sk-git/SKILL.md differs from the old pin
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Write `SETUP.md` at the repository root: choose, link, copy, keep healthy, troubleshooting.
- Cut the root README's setup detail to a short section that points to the guide, and retarget its five links.
- Link the guide from the root README's related documents and the system-skilled-doctor README.

### Out of Scope
- Fixing the two link rough edges the tests found: the first `link` leaves runtime folders `partial-merge`, and relative links get no ignore line. The guide documents both, and the fix is its own change.
- The Install section of the root README, which stays where it is.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `SETUP.md` | Create | The setup guide |
| `README.md` | Modify | Section 5 shrinks to a pointer, and five links move to the guide |
| `.skilled/skills/system-skilled-doctor/README.md` | Modify | Links the guide |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The guide covers both paths end to end | Each step in `SETUP.md` sections 2 and 3 was run in a throwaway folder with the output recorded in this spec |
| REQ-002 | The root README points to the guide | `rg -n "SETUP.md" README.md` shows the section 5 pointer and the related-documents entry |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No broken references | `check_readme_references.py README.md SETUP.md .skilled/skills/system-skilled-doctor/README.md` prints `fail=0` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py SETUP.md` reports no blocking error.
- **SC-002**: The root README loses its setup detail with no unresolved reference.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The doctor commands keep their current flags | The guide goes stale | The guide names commands only, and the overlays reference keeps the detail |
| Risk | The guide states behavior the engine does not have | Med | Every step was run before it was written, and two mismatches found that way are written as they behave |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
