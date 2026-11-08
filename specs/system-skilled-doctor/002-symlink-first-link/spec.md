---
title: "Feature Specification: Link everything on the first symlink run and keep its relative links ignored"
description: "The first /doctor:symlink link on a new project left the runtime folders partial-merge, and the relative links it made showed in git status. One run now links everything and ignores them."
trigger_phrases:
  - "symlink first link"
  - "first link leaves partial merge"
  - "relative links show in git status"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Link everything on the first symlink run and keep its relative links ignored

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
On a new project the first `/doctor:symlink link` left `.claude` and `.opencode` as `partial-merge`. Their relative entries, such as `.claude/skills -> ../.skilled/skills`, were planned only when the target already existed in the project, and `.skilled` was planned in the same run but not on disk yet. A second run added them, but those links got no ignore line, so `git status` listed them.

### Purpose
One `link` run on a new project links every entry, and `git status` stays clean.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Found while testing the setup guide: an empty git repo, `symlink-engine.cjs plan` and `apply` with `--runtimes claude,opencode --mode auto`, then `check` and `git status`:

```text
first run   check: linked-merge .skilled, partial-merge .claude, partial-merge .opencode (10 missing children)
second run  check: linked-merge everywhere
git status  ?? .claude/manual-testing-playbook  ?? .claude/repo-rules  ?? .claude/skills
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Count a relative link's target as present when the same plan creates it.
- Add each relative link the merge creates to the ignore list when its target is a link the same plan creates or one that already resolves into the checkout. An alias to the project's own content, such as `.skilled/specs -> ../specs`, stays visible so the project can commit it.
- Remove the two workaround notes from `SETUP.md`.

### Out of Scope
- A relative link whose target the project does not have and the plan does not create, such as `.skilled/specs` with no `specs` folder. It stays skipped, as before.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/symlink-engine.cjs` | Modify | `planCreates` and the host-relative branch of `planMergeTree` |
| `.skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` | Modify | Two tests |
| `SETUP.md` | Modify | Drops the run-twice and leave-uncommitted notes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | One run links every entry | On an empty project one `link` leaves `check` at `linked-merge` with no missing child |
| REQ-002 | Git stays clean | After that run `git status --porcelain --untracked-files=all` prints nothing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A dangling alias stays skipped | The test `setup omits a dangling specs alias when the host has no specs folder` still passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The doctor suite passes, and both new tests fail against the old engine.
- **SC-002**: A real `link` on an empty project needs one run and leaves `git status` clean.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The core `.skilled` entry is planned before the runtime folders | A runtime alias would wait for a second run again | The manifest lists core first, and the first-link test pins the outcome |
| Risk | An alias is created to a target that never appears | Med | A planned `mkdir` counts only as an exact match, and a target neither present nor planned is still skipped |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
