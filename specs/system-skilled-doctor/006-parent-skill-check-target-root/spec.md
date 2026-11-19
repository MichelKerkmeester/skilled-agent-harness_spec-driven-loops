---
title: "Feature Specification: parent-skill-check reads a hub's canary fixture, commands and guards from the hub's own repository"
description: "parent-skill-check reads every hub's data from its own checkout, so a checker run from Skilled audits a vendored project's hub against Skilled's canary cases and fails every mode Skilled does not ship."
trigger_phrases:
  - "parent skill check target root"
  - "parent skill check reads a hub s canary"
  - "vendored hub canary fixture"
  - "5k-canary no canary case routes to it"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: parent-skill-check reads a hub's canary fixture, commands and guards from the hub's own repository

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-19 |
| **Branch** | `worktrees/476-parent-skill-check-target-root` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`parent-skill-check.cjs` resolves one root, `findRepoRoot(__dirname)`, and reads every repository-relative path from it. That root is the checker's own checkout, so the canary fixture, the bound commands, the drift guard and the advisor script all come from there, whichever hub is audited. Run from Skilled on a vendored project's hub, the check compares that hub's `routerSignals` with Skilled's canary cases and fails every mode Skilled does not ship.

### Purpose
The checker reads its own code from its own checkout and a hub's data from the repository that holds the hub, so a vendored project's hub gets the same verdict from any checkout.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node /Users/michelkerkmeester/MEGA/Development/Skilled/.skilled/commands/doctor/scripts/parent-skill-check.cjs \
    /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/.skilled/skills/sk-code
FAIL: 5k-canary: "sk-code-backend-system": no canary case routes to it
FAIL: 5k-canary: "sk-code-bartender": no canary case routes to it
... (one line for each of the 13 project modes)
FAIL: 5k-canary: "sk-code-terraform": no canary case routes to it
FAIL: parent-skill-check — 13 invariant failures, 0 warnings
exit 1, 67 PASS lines
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Split the checker's root in two. The checker root serves its own code, the shared `sk-create-skill` contracts and the routing-shape debt ledger. The hub's repository root serves the canary fixture, bound commands, drift guard and advisor script.
- Fall back to the checker root only when the hub sits in no repository, meaning no authored sentinel is found above it.
- Report a missing canary fixture in the hub's repository as not applicable and name that repository. Never fall back to the checker repository's fixture.
- Add tests that fail before the fix: a project hub with its own fixture, the same hub without one, the commands-directory override and the drift guard and advisor lookups.
- Record the change in the doctor changelog and in the doctor scripts README.

### Out of Scope
- Adding a vendored project's modes to Skilled's own canary fixture, because the project owns its canaries.
- Writing anything under `barter/ai-speckit`, because that project is read-only for this work.
- Re-keying the routing-shape debt ledger, because the ledger ships with the checker's code and its keys name the checker repository's skills.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Modify | Split the checker root from the hub's data root |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` | Modify | Add four tests for the hub's repository root |
| `.skilled/commands/doctor/scripts/README.markdown` | Modify | Say which root each lookup uses |
| `.skilled/skills/system-skilled-doctor/changelog/v1.1.8.0.md` | Create | Changelog entry |
| `.skilled/skills/system-skilled-doctor/SKILL.md` | Modify | Bump the version to 1.1.8.0 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A hub's canary fixture, bound commands, drift guard and advisor come from the repository that holds the hub | The Measured Behavior command exits 0 and prints `PASS: 5k-canary` |
| REQ-002 | Every Skilled hub keeps its verdicts | Each of the 7 Skilled hubs prints the same PASS, FAIL and WARN lines before and after the fix |
| REQ-003 | A hub repository with no fixture never falls back to the checker's | The no-fixture test prints `INFO: 5k-canary: ... in <project>, leg not applicable` and no `FAIL: 5k-canary` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `PARENT_HUB_CHECK_COMMANDS_DIR` still overrides the commands tree | The override test passes 3k with the override and fails 3k from the project's own commands |
| REQ-005 | The doctor docs say which root each lookup uses and the doctor changelog records the change | `rg -n "repository that holds the hub" .skilled/commands/doctor/scripts/README.markdown` prints one line and `check_changelog_shape.py` passes the new entry |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The Measured Behavior command exits 0 with `PASS: 5k-canary`, and this work writes no file in `barter/ai-speckit`. A `find -newer` scan of the project for caches and state checks this.
- **SC-002**: `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` passes every test, and the four new tests fail against the unfixed checker.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `findRepoRoot` and `findSourceRoot` in `system-spec-kit/shared/workspace/repo-root.mjs` | The hub's root is wrong if the sentinel walk is | The data root is accepted only when `findSourceRoot` confirms the sentinel, else the checker root is used |
| Risk | A temp test hub outside any repository changes verdict | Medium | Such a hub falls back to the checker root, and the whole suite passes unchanged |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The changelog goes to `system-skilled-doctor`, as the request asked for the doctor component, although the `/doctor:skill-advisor` route that runs the checker is owned by `system-skill-advisor`.
<!-- /ANCHOR:questions -->

---
